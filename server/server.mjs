import express from 'express'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createHash, randomBytes } from 'node:crypto'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'votes.db')
const IMPORT_CONFIG_PATH = path.join(__dirname, 'imports.config.json')
const PORT = process.env.PORT || 5176

const db = new DatabaseSync(DB_PATH)
db.exec(`
  CREATE TABLE IF NOT EXISTS stimmen (
    geraet TEXT PRIMARY KEY,
    wahl TEXT NOT NULL,
    erstellt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)
db.exec(`
  CREATE TABLE IF NOT EXISTS einreichungen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    geraet TEXT NOT NULL,
    name TEXT,
    teile TEXT NOT NULL,
    erstellt TEXT NOT NULL
  )
`)
db.exec(`
  CREATE TABLE IF NOT EXISTS import_teile (
    id TEXT PRIMARY KEY,
    quelle_url TEXT NOT NULL UNIQUE,
    titel TEXT NOT NULL,
    marke TEXT NOT NULL,
    preis REAL NOT NULL,
    bild TEXT NOT NULL,
    lage TEXT NOT NULL,
    produkt_id TEXT NOT NULL,
    notiz TEXT NOT NULL,
    raw_json TEXT,
    erstellt TEXT NOT NULL,
    aktualisiert TEXT NOT NULL
  )
`)

function importConfigLesen() {
  try {
    const roh = fs.readFileSync(IMPORT_CONFIG_PATH, 'utf8')
    const cfg = JSON.parse(roh)
    return {
      deletedIds: Array.isArray(cfg.deletedIds) ? cfg.deletedIds.map(String) : [],
      deletedUrls: Array.isArray(cfg.deletedUrls) ? cfg.deletedUrls.map(String) : [],
    }
  } catch {
    const cfg = { deletedIds: [], deletedUrls: [] }
    fs.writeFileSync(IMPORT_CONFIG_PATH, `${JSON.stringify(cfg, null, 2)}\n`)
    return cfg
  }
}

function istImportGeloescht(zeile) {
  const cfg = importConfigLesen()
  return cfg.deletedIds.includes(String(zeile.id)) || cfg.deletedUrls.includes(String(zeile.quelle_url))
}

const app = express()
app.use(express.json())

app.get('/api/ergebnis', (req, res) => {
  const geraet = typeof req.query.geraet === 'string' ? req.query.geraet : ''
  const meinVote = db
    .prepare('SELECT wahl FROM stimmen WHERE geraet = ?')
    .get(geraet)

  // Stil-Rangliste: outfit:*-Votes zählen NICHT mit (die leben in einreichungen)
  const zeilen = db
    .prepare("SELECT wahl, COUNT(*) AS anzahl FROM stimmen WHERE wahl NOT LIKE 'outfit:%' GROUP BY wahl")
    .all()
    .map((r) => ({ wahl: r.wahl, anzahl: Number(r.anzahl) }))
    .sort((a, b) => b.anzahl - a.anzahl || a.wahl.localeCompare(b.wahl))

  // Einreichungen (Outfits) neueste zuerst, inkl. Stimmenzahl über
  // das bestehende wahl-Format "outfit:<id>"
  const einreichungen = db
    .prepare(
      `SELECT e.id, e.name, e.teile, e.erstellt,
              (SELECT COUNT(*) FROM stimmen s WHERE s.wahl = 'outfit:' || e.id) AS stimmen
         FROM einreichungen e
        ORDER BY e.id DESC`,
    )
    .all()
    .map((r) => {
      let teile = []
      try {
        const p = JSON.parse(r.teile)
        if (Array.isArray(p)) teile = p
      } catch {
        /* kaputter JSON -> leeres Array */
      }
      return {
        id: Number(r.id),
        name: r.name ?? null,
        teile,
        stimmen: Number(r.stimmen),
        erstellt: r.erstellt,
      }
    })

  res.json({
    gesamt: zeilen.reduce((s, z) => s + z.anzahl, 0),
    stimmen: zeilen,
    meinVote: meinVote ? meinVote.wahl : null,
    einreichungen,
  })
})

app.post('/api/vote', (req, res) => {
  const geraet = typeof req.body?.geraet === 'string' ? req.body.geraet : ''
  const wahl = typeof req.body?.wahl === 'string' ? req.body.wahl : ''
  if (!geraet || !wahl) return res.status(400).json({ fehler: 'geraet und wahl erforderlich' })

  try {
    db.prepare('INSERT INTO stimmen (geraet, wahl) VALUES (?, ?)').run(geraet, wahl)
    res.status(201).json({ ok: true })
  } catch {
    res.status(409).json({ fehler: 'bereits abgestimmt' })
  }
})

// ---------------------------------------------------------------------------
// Outfit-Einreichung: POST /api/outfit  { name?, teile: string[] }
// ---------------------------------------------------------------------------

const TEIL_RE = /^[a-z0-9_]+$/
const MAX_TEILE = 20
const MAX_NAME = 40

app.post('/api/outfit', (req, res) => {
  const koerper = req.body && typeof req.body === 'object' ? req.body : {}
  // Geräte-Kennung wie im Vote-Endpoint: gleicher Ansatz (String oder leer)
  const geraet = typeof koerper.geraet === 'string' ? koerper.geraet : ''
  const teile = koerper.teile

  if (!Array.isArray(teile)) {
    return res.status(400).json({ ok: false, fehler: 'teile muss ein Array sein' })
  }
  if (teile.length === 0) {
    return res.status(400).json({ ok: false, fehler: 'mindestens ein Teil erforderlich' })
  }
  if (teile.length > MAX_TEILE) {
    return res
      .status(400)
      .json({ ok: false, fehler: `höchstens ${MAX_TEILE} Teile erlaubt` })
  }
  for (const t of teile) {
    if (typeof t !== 'string' || !TEIL_RE.test(t)) {
      return res
        .status(400)
        .json({ ok: false, fehler: `ungültiges Teil: ${JSON.stringify(t)} (nur a-z, 0-9, _ erlaubt)` })
    }
  }
  if (new Set(teile).size !== teile.length) {
    return res.status(400).json({ ok: false, fehler: 'Teile dürfen nicht doppelt vorkommen' })
  }

  let name = null
  if (koerper.name !== undefined && koerper.name !== null) {
    if (typeof koerper.name !== 'string') {
      return res.status(400).json({ ok: false, fehler: 'name muss Text sein' })
    }
    const trimmed = koerper.name.trim()
    if (trimmed.length > MAX_NAME) {
      return res
        .status(400)
        .json({ ok: false, fehler: `name darf höchstens ${MAX_NAME} Zeichen haben` })
    }
    name = trimmed === '' ? null : trimmed
  }

  // Keine Budget-Prüfung hier — der Client sperrt das hart.
  const stand = new Date().toISOString()
  const info = db
    .prepare('INSERT INTO einreichungen (geraet, name, teile, erstellt) VALUES (?, ?, ?, ?)')
    .run(geraet, name, JSON.stringify(teile), stand)

  res.status(201).json({ ok: true, id: Number(info.lastInsertRowid) })
})

// ---------------------------------------------------------------------------
// Dynamische Preise: GET /api/preise?ids=<id1,id2,...>
// ---------------------------------------------------------------------------

const PREIS_TTL_MS = 6 * 60 * 60 * 1000 // 6h positiver Cache
const NEG_TTL_MS = 5 * 60 * 1000 // 5min Negative-Cache
const UPSTREAM_TIMEOUT_MS = 8000 // 8s pro Upstream-Call
const MAX_IDS = 60
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126'

// ID-Whitelists -> verhindert, dass beliebige Strings in Upstream-Pfade landen
const NY_ID_RE = /^\d{2}\.\d{2}\.\d{3,4}\.\d{4}$/
const REC_ID_RE = /^REC\d{3,}$/

const preisCache = new Map() // key -> { daten, bis }
const negCache = new Map() // key -> bis (Ablaufzeitpunkt)

function zuZahl(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v.replace(',', '.'))
    if (Number.isFinite(n)) return n
  }
  return null
}

function cacheLesen(key) {
  const e = preisCache.get(key)
  if (!e) return null
  if (Date.now() > e.bis) {
    preisCache.delete(key)
    return null
  }
  return e.daten
}

function cacheSchreiben(key, daten) {
  preisCache.set(key, { daten, bis: Date.now() + PREIS_TTL_MS })
}

function negativLesen(key) {
  const bis = negCache.get(key)
  if (!bis) return false
  if (Date.now() > bis) {
    negCache.delete(key)
    return false
  }
  return true
}

// --- New Yorker (feste Basis-URL, ID nur nach Whitelist-Regex im Pfad) ------
async function preisNewYorker(id) {
  const url = `https://api.newyorker.de/csp/products/public/product/${id}?country=de`
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  })
  if (!r.ok) throw new Error(`newyorker http ${r.status}`)
  const j = await r.json()
  const varianten = Array.isArray(j?.variants) ? j.variants : []
  const v =
    varianten.find((x) => x?.is_primary_variant) ||
    varianten.find((x) => zuZahl(x?.current_price) != null) ||
    varianten[0]
  const preis = zuZahl(v?.current_price)
  if (preis == null) throw new Error('newyorker: kein current_price')

  const original = zuZahl(v?.original_price)
  const billiger = original != null && original > preis
  const sale = v?.sale === true || v?.red_price_change === true || billiger

  const daten = { preis, sale, waehrung: v?.currency || 'EUR' }
  if (billiger) daten.statt = original // nur setzen wenn > current_price
  return daten
}

// --- Calzedonia (Salesforce SLAS Guest + PKCE, Flow wie slastest.mjs) ------
const CALZ_ORG = 'f_ecom_bjhw_prd'
const CALZ_CLIENT = 'ac56781a-38fd-4bda-957a-eb3a65a26065'
const CALZ_BASE = 'https://www.calzedonia.com/mobify/proxy/api'

let calzToken = { wert: null, bis: 0, lauf: null }

async function calzedoniaToken(frisch = false) {
  if (!frisch && calzToken.wert && Date.now() < calzToken.bis) return calzToken.wert
  if (calzToken.lauf) return calzToken.lauf

  calzToken.lauf = (async () => {
    const verifier = randomBytes(48).toString('base64url')
    const challenge = createHash('sha256').update(verifier).digest('base64url')

    const authUrl =
      `${CALZ_BASE}/shopper/auth/v1/organizations/${CALZ_ORG}/oauth2/authorize` +
      `?redirect_uri=${encodeURIComponent('https://www.calzedonia.com/callback')}` +
      `&response_type=code&client_id=${CALZ_CLIENT}&hint=guest&channel_id=calzedonia-de&code_challenge=${challenge}`

    const a = await fetch(authUrl, {
      headers: { 'User-Agent': UA },
      redirect: 'manual',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
    const loc = a.headers.get('location') || ''
    const locUrl = new URL(loc, 'https://www.calzedonia.com')
    const code = locUrl.searchParams.get('code')
    const usid = locUrl.searchParams.get('usid')
    if (!code) throw new Error('calzedonia: kein code')

    const t = await fetch(`${CALZ_BASE}/shopper/auth/v1/organizations/${CALZ_ORG}/oauth2/token`, {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CALZ_CLIENT,
        channel_id: 'calzedonia-de',
        code,
        code_verifier: verifier,
        grant_type: 'authorization_code_pkce',
        redirect_uri: 'https://www.calzedonia.com/callback',
        usid,
        dnt: 'false',
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
    const tj = await t.json().catch(() => ({}))
    if (!tj.access_token) throw new Error(`calzedonia: token fehlt (${t.status})`)

    // 1800s Token-Cache mit 30s Puffer vor Ablauf
    const ttlSek = Math.max(Math.min(Number(tj.expires_in) || 1800, 1800) - 30, 60)
    calzToken = { wert: tj.access_token, bis: Date.now() + ttlSek * 1000, lauf: null }
    return tj.access_token
  })().catch((e) => {
    calzToken.lauf = null
    throw e
  })

  return calzToken.lauf
}

async function preisCalzedonia(id) {
  const url =
    `${CALZ_BASE}/product/shopper-products/v1/organizations/${CALZ_ORG}/products/${id}` +
    `?currency=EUR&expand=availability,promotions&locale=de-DE&siteId=calzedonia-de`

  const hol = async (token) =>
    fetch(url, {
      headers: { 'User-Agent': UA, Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })

  let token = await calzedoniaToken()
  let r = await hol(token)
  if (r.status === 401) {
    // Token verworfen und einmal neu holen
    token = await calzedoniaToken(true)
    r = await hol(token)
  }
  if (!r.ok) throw new Error(`calzedonia http ${r.status}`)

  const j = await r.json()
  const sales = zuZahl(j?.c_price?.sales?.value)
  if (sales == null) throw new Error('calzedonia: kein c_price.sales.value')

  const list = zuZahl(j?.c_price?.list?.value)
  // Nur ein echter Originalpreis ZAHLEN über dem Zahlungspreis zählt als Sale.
  // productPromotions ("3. ARTIKEL -50%") sind Bundle-Aktionen -> kein Sale.
  const billiger = list != null && list > sales

  const daten = { preis: sales, sale: billiger, waehrung: j?.c_price?.sales?.currency || 'EUR' }
  if (billiger) daten.statt = list
  return daten
}

async function preisFuerId(id) {
  let anbieter
  if (NY_ID_RE.test(id)) anbieter = 'newyorker'
  else if (REC_ID_RE.test(id)) anbieter = 'calzedonia'
  else return null // unbekannte ID -> laut Contract weglassen

  const key = `${anbieter}:${id}`

  const treffer = cacheLesen(key)
  if (treffer) return { ...treffer, quelle: 'cache' }
  if (negativLesen(key)) return null

  try {
    const roh = anbieter === 'newyorker' ? await preisNewYorker(id) : await preisCalzedonia(id)
    const daten = { ...roh, quelle: 'api', geprueft: new Date().toISOString() }
    cacheSchreiben(key, daten)
    return { ...daten }
  } catch (e) {
    // Provider-Fehler -> nur diese ID weglassen, kurzes Negative-Caching
    negCache.set(key, Date.now() + NEG_TTL_MS)
    console.warn(`[preise] ${id}: ${e?.message || e}`)
    return null
  }
}

app.get('/api/preise', async (req, res) => {
  const roh = typeof req.query.ids === 'string' ? req.query.ids : ''
  const teile = roh.split(',').map((s) => s.trim()).filter(Boolean)
  if (teile.length === 0) {
    return res.status(400).json({ ok: false, fehler: 'ids erforderlich (komma-separiert, max 60)' })
  }
  if (teile.length > MAX_IDS) {
    return res.status(400).json({ ok: false, fehler: `hochstens ${MAX_IDS} IDs` })
  }

  const ids = [...new Set(teile)]
  const stand = new Date().toISOString()
  const daten = {}

  // Parallel, Fehler pro ID isoliert (eine Fehler-IDs.. andere laufen weiter)
  await Promise.all(
    ids.map(async (id) => {
      try {
        const d = await preisFuerId(id)
        if (d) daten[id] = d
      } catch {
        /* isoliert: ID fehlt in der Antwort */
      }
    }),
  )

  res.json({ ok: true, stand, daten })
})

function importZeileZuTeil(r) {
  return {
    id: r.id,
    titel: r.titel,
    marke: r.marke,
    preis: Number(r.preis) || 0,
    bild: r.bild,
    lage: r.lage || 'anker',
    produktId: r.produkt_id,
    notiz: r.notiz || 'Importiert per Link',
    link: r.quelle_url,
  }
}

function sichereImportId(url, produktId) {
  const h = createHash('sha1').update(`${url}|${produktId}`).digest('hex').slice(0, 10)
  return `imp_${h}`
}

function textAusHtml(html, re) {
  const m = html.match(re)
  return m ? m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim() : ''
}

async function generischScrapen(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  })
  if (!r.ok) throw new Error(`Shop-Seite HTTP ${r.status}`)
  const html = await r.text()
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => {
      try { return JSON.parse(m[1].trim()) } catch { return null }
    })
    .flatMap((x) => Array.isArray(x) ? x : [x])
    .find((x) => x && (x['@type'] === 'Product' || (Array.isArray(x['@type']) && x['@type'].includes('Product'))))

  const titel = jsonLd?.name || textAusHtml(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) || 'Importiertes Teil'
  const bild = Array.isArray(jsonLd?.image) ? jsonLd.image[0] : jsonLd?.image || textAusHtml(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)
  const preis = zuZahl(jsonLd?.offers?.price) || zuZahl(textAusHtml(html, /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)/i)) || 0
  const marke = typeof jsonLd?.brand === 'string' ? jsonLd.brand : jsonLd?.brand?.name || new URL(url).hostname.replace(/^www\./, '')
  return { titel, marke, preis, bild: bild || '', produktId: jsonLd?.sku || url, raw: jsonLd || null }
}

async function newYorkerImport(urlParam) {
  const id = (urlParam.match(NY_ID_RE) || urlParam.match(/\d{2}\.\d{2}\.\d{3,4}\.\d{4}/))?.[0]
  if (!id) return null

  const apiUrl = `https://api.newyorker.de/csp/products/public/product/${id}?country=de`
  const r = await fetch(apiUrl, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  })
  if (!r.ok) throw new Error(`NEW YORKER HTTP ${r.status}`)
  const j = await r.json()
  const varianten = Array.isArray(j?.variants) ? j.variants : []
  const v = varianten.find((x) => x?.product_id === id) || varianten.find((x) => x?.is_primary_variant) || varianten.find((x) => zuZahl(x?.current_price) != null) || varianten[0]
  const imgObj = v?.images?.find((i) => i.type === 'CUTOUT') || v?.images?.find((i) => i.type === 'OUTFIT_IMAGE') || v?.images?.[0]

  return {
    titel: j.descriptions?.find((d) => d.language === 'DE')?.description || j.maintenance_group || 'NEW YORKER Teil',
    marke: j.brand || 'NEW YORKER',
    preis: zuZahl(v?.current_price) || 0,
    bild: imgObj ? `https://api.newyorker.de/csp/images/image/public/${imgObj.key}?res=high` : '',
    produktId: id,
    raw: { product: j, variant: v },
  }
}

function speichereImport(url, daten) {
  const jetzt = new Date().toISOString()
  const id = sichereImportId(url, daten.produktId)
  db.prepare(`
    INSERT INTO import_teile (id, quelle_url, titel, marke, preis, bild, lage, produkt_id, notiz, raw_json, erstellt, aktualisiert)
    VALUES (?, ?, ?, ?, ?, ?, 'anker', ?, 'Importiert per Link', ?, ?, ?)
    ON CONFLICT(quelle_url) DO UPDATE SET
      titel = excluded.titel,
      marke = excluded.marke,
      preis = excluded.preis,
      bild = excluded.bild,
      produkt_id = excluded.produkt_id,
      raw_json = excluded.raw_json,
      aktualisiert = excluded.aktualisiert
  `).run(id, url, daten.titel, daten.marke, daten.preis, daten.bild, daten.produktId, JSON.stringify(daten.raw ?? null), jetzt, jetzt)

  const zeile = db.prepare('SELECT * FROM import_teile WHERE quelle_url = ?').get(url)
  return importZeileZuTeil(zeile)
}

app.get('/api/imports', (_req, res) => {
  const zeilen = db.prepare('SELECT * FROM import_teile ORDER BY aktualisiert DESC').all()
  const teile = zeilen.filter((zeile) => !istImportGeloescht(zeile)).map(importZeileZuTeil)
  res.json({ ok: true, teile })
})

app.post('/api/import', async (req, res) => {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : ''
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ ok: false, fehler: 'Gültigen Produkt-Link einfügen.' })

  try {
    const daten = (await newYorkerImport(url)) || (await generischScrapen(url))
    const teil = speichereImport(url, daten)
    res.status(201).json({ ok: true, teil })
  } catch (err) {
    res.status(502).json({ ok: false, fehler: err?.message || 'Import fehlgeschlagen' })
  }
})

app.delete('/api/import/:id', (req, res) => {
  const id = typeof req.params.id === 'string' ? req.params.id : ''
  if (!/^imp_[a-f0-9]{10}$/.test(id)) return res.status(400).json({ ok: false, fehler: 'Ungültige Import-ID' })

  const info = db.prepare('DELETE FROM import_teile WHERE id = ?').run(id)
  db.prepare("DELETE FROM stimmen WHERE wahl = ?").run(`outfit:${id}`)
  res.json({ ok: true, geloescht: Number(info.changes) })
})

app.listen(PORT, () => {
  console.log(`Abstimmungs-Server läuft auf http://localhost:${PORT}`)
})