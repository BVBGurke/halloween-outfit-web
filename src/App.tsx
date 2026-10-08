import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { Budget } from './components/Budget'
import { Builder, type Kategorie, type KategorieGruppe } from './components/Builder'
import { Einreichen } from './components/Einreichen'
import { Endergebnis } from './components/Endergebnis'
import { Fussleiste, type Schritt } from './components/Fussleiste'
import { StileReiter } from './components/Reiter'
import { TeilKarte } from './components/TeilKarte'
import { TeileTauschen } from './components/TeileTauschen'
import { Vergleich } from './components/Vergleich'
import {
  EINKAUF,
  MAKEUP,
  META,
  PACKLISTE,
  PRODUKTE,
  SCHUHE,
  SHOPS,
  STILE,
  STIL_INDEX,
  lookId,
  preisVon,
  produktUrl,
  setLivePreise,
  teileFuer,
  varianteLabel,
  type LivePreis,
  type Produkt,
  type Stil,
  type Variante,
} from './data/outfit'
import { eur } from './lib/format'

const SCHRITTE = [
  { nr: 1, kurz: 'Richtung' },
  { nr: 2, kurz: 'Vergleichen' },
  { nr: 3, kurz: 'Dein Look' },
  { nr: 4, kurz: 'Abstimmen' },
] as const

type Modus = 'start' | 'selber' | 'stil'

/** Bausteine des Builder-Modus: pro Kategorie ein Teil, nichts vorausgewählt */
const KATEGORIEN: KategorieGruppe[] = [
  {
    key: 'top',
    titel: 'Top / Body (ein Oberteil)',
    ids: [
      'spitzenbody',
      'langarmshirt_drapiert',
      'one_shoulder',
      'body_cutout',
      'langarmshirt_cutout',
      'langarmshirt_spitze',
      'tshirt_spitze',
      'tshirt_figurbetont',
      'sport_top',
      'negligee',
    ],
  },
  {
    key: 'unten',
    titel: 'Rock / Kleid / Hose (ein Unterteil)',
    ids: [
      'kunstleder_rock',
      'skort_schwarz',
      'kunstleder_hose',
      'gewebter_minirock',
      'minirock_enger',
      'midi_spitze',
      'minikleid_figurbetont',
    ],
  },
  {
    key: 'beinmode',
    titel: 'Beinmode (optional)',
    ids: ['strumpfhosen', 'netz_strumpfhose', 'fischernetz', 'overknee'],
  },
  {
    key: 'jacke',
    titel: 'Jacke / Layer (optional)',
    ids: ['lederjacke_biker', 'kimono', 'hoodie_schwarz', 'hoodie_warm', 'kunstlederjacke', 'blazer_tailliert'],
  },
  {
    key: 'accessoire',
    titel: 'Accessoire (optional)',
    ids: [
      'taillenguertel',
      'handschuhe',
      'stirnband',
      'guertel',
      'muetze',
      'tuch',
      'schal',
      'kette_gross',
      'kette_klein',
      'kettenset_silber',
      'kette_silber',
      'armband',
      'cap_neu',
      'ohrwaermer',
    ],
  },
]

/** Wählbare Teile im Builder — Zahl für die Intro-Texte */
const OPTIONEN = KATEGORIEN.reduce((n, g) => n + g.ids.length, 0)

const LEER_BAU: Record<Kategorie, string | null> = {
  top: null,
  unten: null,
  beinmode: null,
  jacke: null,
  accessoire: null,
}

const datumLang = (iso: string) => {
  const datum = new Date(iso)
  return Number.isNaN(datum.getTime())
    ? null
    : datum.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Haken() {
  return (
    <span className="haken" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

export default function App() {
  const [schritt, setSchritt] = useState<Schritt>(1)
  const [modus, setModus] = useState<Modus>('start')
  const [stil, setStil] = useState<Stil | null>(null)
  const [variante, setVariante] = useState<Variante | null>(null)
  const [tausch, setTausch] = useState<Record<string, string>>({})
  const [bau, setBau] = useState<Record<Kategorie, string | null>>(LEER_BAU)
  const [packliste, setPackliste] = useState(PACKLISTE.map((p) => p.ok))
  const [makeup, setMakeup] = useState(MAKEUP.map((m) => m.ok))
  const [live, setLive] = useState<{ stand: string | null } | null>(null)

  const stilDef = stil ? STIL_INDEX[stil] : null

  // Live-Preise einmalig beim Start holen — setLivePreise mutiert den Cache in
  // outfit.ts, deshalb setzt setLive zusätzlich einen React-Tick.
  useEffect(() => {
    let lebt = true
    const ids = [...new Set(Object.values(PRODUKTE).map((p) => p.produktId))]
    fetch(`/api/preise?ids=${encodeURIComponent(ids.join(','))}`)
      .then((res) =>
        res.ok
          ? (res.json() as Promise<{ stand?: string; daten?: Record<string, LivePreis> }>)
          : null,
      )
      .then((daten) => {
        if (!lebt || !daten?.daten) return
        setLivePreise(daten.daten)
        setLive({ stand: daten.stand ?? null })
      })
      .catch(() => {})
    return () => {
      lebt = false
    }
  }, [])

  const basisTeile = useMemo(() => {
    if (!stil || !variante) return []
    return teileFuer(stil, variante)
  }, [stil, variante])

  /** Look mit Tausch-Treibern, doppelte Produkte zählen nur einmal */
  const lookTeile = useMemo(() => {
    const gesehen = new Set<string>()
    const liste: Produkt[] = []
    for (const teil of basisTeile) {
      const ersatzId = tausch[teil.id]
      const treffer = (ersatzId ? PRODUKTE[ersatzId] : undefined) ?? teil
      if (gesehen.has(treffer.id)) continue
      gesehen.add(treffer.id)
      liste.push(treffer)
    }
    return liste
  }, [basisTeile, tausch])

  const bauTeile = useMemo(() => {
    const liste: Produkt[] = []
    for (const gruppe of KATEGORIEN) {
      const id = bau[gruppe.key]
      const teil = id ? PRODUKTE[id] : undefined
      if (teil) liste.push(teil)
    }
    return liste
  }, [bau])

  const teile = modus === 'selber' ? bauTeile : lookTeile
  const summe = teile.reduce((s, t) => s + preisVon(t), 0)
  const gewaehlteId = stil && variante ? lookId(stil, variante) : null
  const lookLabel = stil && variante ? varianteLabel(stil, variante) : null
  const planLabel =
    modus === 'selber'
      ? 'Selber gewählt'
      : `${stilDef?.titel ?? 'Kein Stil'} · ${lookLabel ?? 'kein Look'}${
          Object.keys(tausch).length ? ' (getauscht)' : ''
        }`

  const springe = (ziel: Schritt) => {
    setSchritt(ziel)
    window.scrollTo({ top: 0 })
  }

  const waehleStil = (s: Stil) => {
    setStil(s)
    setVariante(null)
    setTausch({})
  }

  const waehleLook = (v: Variante) => {
    // Tauschliste zurücksetzen: sie gilt nur, solange dieselbe Variante gewählt ist
    setVariante(v)
    setTausch({})
  }

  const tausche = (teilId: string, produktKey: string) => {
    setTausch((alt) => ({ ...alt, [teilId]: produktKey }))
  }

  const waehleBau = (kategorie: Kategorie, produktKey: string) => {
    setBau((alt) => ({ ...alt, [kategorie]: produktKey }))
  }

  const waehleModus = (m: Modus) => {
    setModus(m)
    setStil(null)
    setVariante(null)
    setTausch({})
    setBau(LEER_BAU)
  }

  const vergleichen = () => {
    if (stil) springe(2)
  }

  const weiter = () => {
    if (schritt === 1) {
      if (modus === 'stil' && stil) springe(2)
      else if (modus === 'selber' && bauTeile.length) springe(3)
    } else if (schritt === 2 && stil && variante) springe(3)
    else if (schritt === 3 && teile.length) springe(4)
    else if (schritt === 4) {
      setStil(null)
      setVariante(null)
      setTausch({})
      setBau(LEER_BAU)
      setModus('start')
      springe(1)
    }
  }

  const zurueck = () => {
    if (schritt === 3 && modus === 'selber') springe(1)
    else if (schritt > 1) springe((schritt - 1) as Schritt)
  }

  const darfSpringen = (ziel: Schritt) =>
    ziel === 1 ||
    (ziel === 2 && modus === 'stil' && Boolean(stil)) ||
    ((ziel === 3 || ziel === 4) &&
      (modus === 'stil' ? Boolean(stil && variante) : bauTeile.length > 0))

  const toggle = (setter: Dispatch<SetStateAction<boolean[]>>, index: number) => () =>
    setter((alt) => alt.map((ok, i) => (i === index ? !ok : ok)))

  const leer = teile.length === 0
  const kannLos = modus === 'selber' ? bauTeile.length > 0 : Boolean(stil)
  const weiterGesperrt =
    modus === 'start' ? true : schritt === 1 ? !kannLos : schritt === 2 ? !variante : schritt === 3 ? leer : false
  const weiterText =
    modus === 'start'
      ? 'Wähle einen Modus'
      : schritt === 1
        ? modus === 'selber'
          ? leer
            ? 'Wähle mindestens ein Teil'
            : 'Weiter zu Deinem Look'
          : stil
            ? 'Weiter zu Vergleichen'
            : 'Wähle zuerst einen Stil'
        : schritt === 2
          ? variante
            ? 'Weiter zu Deinem Look'
            : 'Wähle oben einen Look'
          : schritt === 3
            ? leer
              ? 'Wähle oben Teile'
              : 'Weiter zur Abstimmung'
            : 'Neue Auswahl'

  // Abschnittsnummern in Schritt 3 — der Zähler zählt mit, welche Blöcke im
  // aktuellen Modus wirklich gerendert werden.
  let abschnittNr = 0
  const abschnitt = (titel: string) => {
    abschnittNr += 1
    return (
      <h2>
        <span>{abschnittNr < 10 ? `0${abschnittNr}` : `${abschnittNr}`}</span> — {titel}
      </h2>
    )
  }

  return (
    <>
      <a className="skip" href="#inhalt">
        Zur Auswahl springen
      </a>

      <div className="fortschritt-leiste">
        <div className="fortschritt-inhalt">
          <div className="fortschritt-knoepfe" role="group" aria-label="Auswahlschritte">
            {SCHRITTE.map((s) => (
              <button
                key={s.nr}
                type="button"
                className={[
                  'schritt-knopf',
                  s.nr === schritt ? 'aktiv' : '',
                  s.nr < schritt ? 'fertig' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => darfSpringen(s.nr) && springe(s.nr)}
                disabled={!darfSpringen(s.nr)}
              >
                <span className="schritt-nr">{s.nr < 10 ? `0${s.nr}` : `${s.nr}`}</span>
                {s.kurz}
              </button>
            ))}
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Auswahlschritt"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={schritt}
          >
            <div className="progress-fill" style={{ width: `${schritt * 25}%` }} />
          </div>
          <span className="fortschritt-label">Schritt {schritt} von 4</span>
        </div>
      </div>

      <div className="wrap" id="inhalt">
        {schritt === 1 && (
          <header className="hero">
            <p className="kicker">
              {META.anlass} · {META.datum} · {META.ort}
            </p>
            <h1>
              Schwarz auf Schwarz, <em>ein Gold</em>
            </h1>
            <p className="lede">
              {STILE.length} Stile × 8 Kombinationen auf {META.koerper} gerechnet — jede Version
              unter {META.budget} €. Du legst erst die Richtung fest, vergleichst dann alle Looks
              auf einem Blick und stimmst am Ende ab. Die Kniehochschuhe stehen schon im Schrank und
              geben die Palette vor: {META.palette}.
            </p>
          </header>
        )}

        {schritt !== 1 && (
          <div className="mini-kopf">
            <p className="kicker">
              {META.anlass} · {META.datum} · {META.ort}
            </p>
            <h1>Schwarz auf Schwarz, ein Gold</h1>
          </div>
        )}

        {schritt === 1 && modus === 'start' && (
          <>
            <h2>
              <span>Schritt 1</span> — Wie willst du starten
            </h2>
            <p className="absatz">
              Zwei Wege in den Look: der Plan mit {STILE.length} Stilen und acht Kombinationen pro
              Stil — oder freies Zusammenstellen aus allen {OPTIONEN} Teilen. Der Plan bleibt unter{' '}
              {eur(META.budget)}, beim Selber-Wählen warnt die Summe über dem Limit.
            </p>
            <div className="karten karten-breit">
              <label className="wahl">
                <input
                  className="sr-only"
                  type="radio"
                  name="modus"
                  value="stil"
                  onChange={() => waehleModus('stil')}
                />
                <span className="wahl-flaeche">
                  <Haken />
                  <strong className="wahl-titel">Vorgefertigte anpassen</strong>
                  <span className="wahl-meta">
                    Richtung wählen, alle Kombinationen vergleichen und danach einzelne Teile
                    tauschen.
                  </span>
                </span>
              </label>
              <label className="wahl">
                <input
                  className="sr-only"
                  type="radio"
                  name="modus"
                  value="selber"
                  onChange={() => waehleModus('selber')}
                />
                <span className="wahl-flaeche">
                  <Haken />
                  <strong className="wahl-titel">Selber wählen</strong>
                  <span className="wahl-meta">
                    Pro Kategorie ein Teil aus {OPTIONEN} Optionen — kein Look ist
                    vorausgewählt, die Summe rechnet live mit.
                  </span>
                </span>
              </label>
            </div>
          </>
        )}

        {schritt === 1 && modus !== 'start' && (
          <>
            <h2>
              <span>Schritt 1</span> — {modus === 'stil' ? 'Welche Richtung' : 'Deine Teile'}
            </h2>
            <p className="absatz">
              Modus <strong>{modus === 'stil' ? 'Vorgefertigte anpassen' : 'Selber wählen'}</strong>{' '}
              ·{' '}
              <button type="button" className="link" onClick={() => waehleModus('start')}>
                Modus wechseln
              </button>
            </p>
            {modus === 'stil' ? (
              <StileReiter aktiverStil={stil} onStil={waehleStil} />
            ) : (
              <Builder gruppen={KATEGORIEN} wahl={bau} onChange={waehleBau} />
            )}
          </>
        )}

        {schritt === 2 && stil && stilDef && (
          <>
            <h2>
              <span>Schritt 2</span> — Vergleichen
            </h2>
            <p className="absatz">
              Alle {stilDef.titel}-Kombinationen nebeneinander — jede unter {eur(META.budget)}.
              Tipp auf eine Karte wählt den Look und danach geht es zu deinem Outfit.
            </p>

            <Vergleich stil={stil} auswahl={variante ? { variante } : null} onWahl={waehleLook} />
          </>
        )}

        {schritt === 3 && (
          <>
            <h2>
              <span>Schritt 3</span> — Dein Look
            </h2>
            <p className="absatz">
              {modus === 'stil' && (
                <>
                  <strong>
                    {planLabel}
                    {Object.keys(tausch).length ? ' (getauscht)' : ''}.
                  </strong>{' '}
                </>
              )}
              {modus === 'selber' && (
                <>
                  <strong>Selber gewählt.</strong>{' '}
                </>
              )}
              {teile.length} Teile für {eur(summe)} von {eur(META.budget)} — jeder Teil unten
              einzeln mit Produktseite.
              {modus === 'stil' && (
                <>
                  {' '}
                  Zum Wechseln{' '}
                  <button type="button" className="link" onClick={() => springe(2)}>
                    nochmal vergleichen
                  </button>{' '}
                  oder gleich{' '}
                  <button type="button" className="link" onClick={() => springe(4)}>
                    abstimmen
                  </button>
                  .
                </>
              )}
              {live?.stand && datumLang(live.stand) && (
                <> Preise live geprüft am {datumLang(live.stand)}.</>
              )}
            </p>

            <div className="raster" id="teile">
              {teile.map((teil) => (
                <TeilKarte key={teil.id} teil={teil} />
              ))}
            </div>

            {modus === 'stil' && (
              <>
                {abschnitt('Teile tauschen')}
                <TeileTauschen basis={basisTeile} tausch={tausch} gruppen={KATEGORIEN} onChange={tausche} />
              </>
            )}

            {abschnitt('Was es kostet')}
            <Budget label={planLabel} teile={teile} />

            {abschnitt('Einreichen')}
            <Einreichen teile={teile} label={planLabel} onFertig={() => springe(4)} />

            {abschnitt('Die Schuhe sind gesetzt')}
            <div className="schuhe">
              <div className="schuhe-text">
                <h3>
                  {SCHUHE.marke} {SCHUHE.modell}
                </h3>
                <ul className="merkmale">
                  <li>Größe {SCHUHE.groesse}</li>
                  <li>Artikel {SCHUHE.produktId}</li>
                  <li>{SCHUHE.notiz}</li>
                </ul>
              </div>
              <div className="schuhe-kasten">
                <img
                  className="schuhe-bild"
                  src={`/teile/${SCHUHE.bild}`}
                  alt={`${SCHUHE.marke} ${SCHUHE.modell}, Größe ${SCHUHE.groesse} — schwarze Damen-Knieboots mit Blockabsatz und Langschaft`}
                  loading="lazy"
                  width={1000}
                  height={1000}
                />
                <p>
                  Stehen nicht in der Rechnung, weil du sie schon hast. Sie sind der Anker: der ganze
                  Look ist darauf gebaut, schwarz zu bleiben und nur einen Goldakzent zu tragen.
                </p>
                <a className="link" href={SCHUHE.url} target="_blank" rel="noreferrer">
                  Auf Amazon ansehen
                </a>
              </div>
            </div>

            {modus === 'stil' && stilDef && (
              <>
                {abschnitt('Einkaufsliste für alle Stile')}
                <p className="absatz">
                  Wenn du nicht alles kaufst, sondern nur einen Look zusammenziehen willst, nimm nur
                  die Karten des aktiven Stils. Die Strumpfhose und die beiden Hoodies tauchen in
                  mehreren Looks auf — sie lohnen sich zuerst. Das teuerste Einzelteil der ganzen
                  Liste ist die Kunstlederjacke mit 39,99 €, das teuerste Outfit der Lederlook mit
                  69,97 €. Beide liegen damit unter deinem 70-€-Rahmen.
                </p>
                <div className="einkauf">
                  <div className="einkauf-spalte">
                    <h3>
                      Nur {stilDef.titel} · {lookLabel}
                    </h3>
                    <ul className="einkaufsliste">
                      {teile.map((teil) => (
                        <li key={teil.id}>
                          <a href={produktUrl(teil)} target="_blank" rel="noreferrer">
                            {teil.titel}
                          </a>
                          <span className="summe">{eur(preisVon(teil))}</span>
                        </li>
                      ))}
                      <li className="summe-zeile">
                        <strong>Summe</strong>
                        <strong>{eur(summe)}</strong>
                      </li>
                    </ul>
                  </div>
                  <div className="einkauf-spalte">
                    <h3>Alle Stile ({EINKAUF.length} Teile)</h3>
                    <ul className="einkaufsliste">
                      {EINKAUF.map(({ teil, stile }) => (
                        <li key={teil.id}>
                          <a href={produktUrl(teil)} target="_blank" rel="noreferrer">
                            {teil.titel}
                          </a>
                          <span className="stile-hinweis">{stile.length}× verwendet</span>
                          <span className="summe">{eur(preisVon(teil))}</span>
                        </li>
                      ))}
                      <li className="summe-zeile">
                        <strong>Summe gesamt</strong>
                        <strong>{eur(EINKAUF.reduce((s, e) => s + preisVon(e.teil), 0))}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {abschnitt('Packcheckliste')}
            <ul className="checkliste">
              {PACKLISTE.map((posten, i) => (
                <li key={posten.text}>
                  <label>
                    <input
                      type="checkbox"
                      checked={packliste[i]}
                      onChange={toggle(setPackliste, i)}
                    />
                    <span className={packliste[i] ? 'erledigt' : ''}>{posten.text}</span>
                  </label>
                </li>
              ))}
            </ul>

            <h3 className="zwischen-titel">Make-up</h3>
            <ul className="checkliste">
              {MAKEUP.map((posten, i) => (
                <li key={posten.text}>
                  <label>
                    <input type="checkbox" checked={makeup[i]} onChange={toggle(setMakeup, i)} />
                    <span className={makeup[i] ? 'erledigt' : ''}>{posten.text}</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="hinweis">
              Make-up zählt nicht ins Budget — es ist ein zweites Budget aus Farbe und Zeit, und der
              Goldakzent entsteht genau hier, nicht in der Kleidung.
            </p>

            {abschnitt('Wo du es kaufst')}
            <div className="shops">
              {SHOPS.map((shop) => (
                <div className="shop-karte" key={shop.name}>
                  <h3>{shop.name}</h3>
                  <p className="shop-addr">
                    {shop.strasse}
                    <br />
                    {shop.ort}
                  </p>
                  <p className="shop-note">{shop.note}</p>
                </div>
              ))}
            </div>

            {abschnitt('Die Größenfalle')}
            <div className="warnung">
              <p>
                <strong>Bei {META.koerper} ist S die falsche Größe.</strong> Bei L oder XL wirst du
                zum Anker. Ausnahme: der Skort läuft zwei Größen kleiner, bei 185 cm also 38 statt 36.
              </p>
              <p>
                <span className="marke">Kunstleder gibt nicht nach.</span> Beim Minirock und beim
                Rock im Zweifel eine Nummer größer. Die Modelle der abgebildeten Teile sind kleiner
                als du — verlass dich nicht auf die Fotos.
              </p>
              <p>
                <span className="marke">Strumpfhose zuerst.</span> Sie sitzt unter Oberteil und Rock,
                also zuerst kaufen und zuerst anprobieren.
              </p>
              <p>
                <strong>Der Rock richtet sich nach dem Stiefel, nicht nach dir.</strong> Die Stiefel
                stehen fest, also beim Rock nur noch auf den Saum schauen: über den Schaft oder
                darunter. Miss die Beinlänge vom Schaft bis zum Boden und vergleich sie mit der
                Rocklänge, bevor du ihn holst.
              </p>
            </div>

            <footer>
              <p>
                <strong>Grundlage:</strong> Preise, Farben und Artikelnummern stammen aus den
                NEW-YORKER-Produktdetailseiten, abgerufen am 5. Oktober 2026. Rechnung in Euro,
                Schuhe in Größe {META.schuhgroesse}.
              </p>
              <p>
                <strong>Nicht belegt:</strong> Verfügbarkeit im Laden, EU-Größen der Oberteile und
                Hosen, und die Farbwirkung am echten Oberteil. Alle Teile sind als Schwarz gelistet,
                aber prüf das im Laden — gerade bei Kunstleder und Spitze.
              </p>
            </footer>
          </>
        )}

        {schritt === 4 && (
          <>
            <h2>
              <span>Schritt 4</span> — Abstimmen
            </h2>
            <p className="absatz">
              {modus === 'stil'
                ? 'Hier siehst du alle Versionen nochmal, jede mit den Bildern ihrer Teile. Dein gewählter Look ist als Dein Favorit markiert — aber du darfst jeden anderen wählen. Eine Stimme pro Gerät, die Rangliste unten zählt live mit.'
                : 'Hier laufen alle eingereichten Outfits zusammen — dein eigener steht mit dabei. Du kannst für jedes abstimmen, auch für fremde. Eine Stimme pro Gerät, die Rangliste unten zählt live mit.'}
            </p>

            <div className="vorschau">
              <div className="vorschau-bilder">
                {teile.map((teil) => (
                  <span className="vorschau-bild" key={teil.id}>
                    <img
                      src={`/teile/${teil.bild}`}
                      width={120}
                      height={120}
                      alt=""
                      loading="lazy"
                    />
                  </span>
                ))}
              </div>
              <p className="vorschau-text">
                <strong>Dein Look:</strong> {planLabel} — {teile.length} Teile · {eur(summe)} von{' '}
                {eur(META.budget)}
              </p>
            </div>

            <Endergebnis
              stil={modus === 'stil' ? stil : null}
              meinLook={modus === 'stil' ? gewaehlteId : null}
            />
          </>
        )}
      </div>

      <Fussleiste
        schritt={schritt}
        stilName={modus === 'selber' ? 'Selber wählen' : stilDef?.titel ?? null}
        lookLabel={modus === 'selber' ? (bauTeile.length ? `${bauTeile.length} Teile` : null) : lookLabel}
        summe={teile.length ? summe : null}
        weiterGesperrt={weiterGesperrt}
        weiterText={weiterText}
        zeigeVergleichen={modus === 'stil'}
        onWeiter={weiter}
        onZurueck={zurueck}
        onVergleichen={vergleichen}
      />
    </>
  )
}
