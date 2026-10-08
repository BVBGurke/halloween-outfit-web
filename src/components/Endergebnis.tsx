import { useEffect, useMemo, useState } from 'react'
import { sendeStimme, type StimmenSumme } from '../lib/api'
import { geraetId } from '../lib/geraet'
import {
  META,
  PRODUKTE,
  STIL_INDEX,
  lookZeilen,
  preisVon,
  varianteLabel,
  type LookZeile,
  type Produkt,
  type Stil,
  type Variante,
} from '../data/outfit'
import { eur } from '../lib/format'

type Einreichung = {
  id: string
  name?: string
  teile: string[]
  stimmen?: number
  erstellt?: string
}

type Props = {
  stil: Stil | null
  meinLook: string | null
}

export function Endergebnis({ stil, meinLook }: Props) {
  const [stimme, setStimme] = useState<string | null>(null)
  const [meldung, setMeldung] = useState<'ok' | 'dupliziert' | 'fehler' | null>(null)
  const [ergebnis, setErgebnis] = useState<StimmenSumme | null>(null)
  const [einreichungen, setEinreichungen] = useState<Einreichung[]>([])

  const zeilen = useMemo<LookZeile[]>(() => {
    if (!stil) return []
    // lookZeilen rechnet mit den Grundpreisen — hier live nachziehen
    return lookZeilen(stil).map((zeile) => {
      const summe = zeile.teile.reduce((s, t) => s + preisVon(t), 0)
      return { ...zeile, summe, drueber: summe > META.budget }
    })
  }, [stil])

  const stimMe = async (id: string) => {
    setMeldung(null)
    try {
      const { status } = await sendeStimme({ geraet: geraetId(), wahl: id })
      if (status === 201) {
        setStimme(id)
        setMeldung('ok')
      } else {
        setStimme(id)
        setMeldung('dupliziert')
      }
    } catch {
      setMeldung('fehler')
    }
    await aktualisieren()
  }

  const aktualisieren = async () => {
    try {
      const res = await fetch(`/api/ergebnis?geraet=${encodeURIComponent(geraetId())}`)
      if (!res.ok) return
      const rund = (await res.json()) as StimmenSumme & { einreichungen?: Einreichung[] }
      setErgebnis(rund)
      setEinreichungen(rund.einreichungen ?? [])
      if (rund.meinVote) setStimme(rund.meinVote)
    } catch {
      // Server nicht erreichbar — die Auswahl oben bleibt trotzdem nutzbar
    }
  }

  useEffect(() => {
    void aktualisieren()
    const timer = setInterval(() => void aktualisieren(), 10000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const labelZu = (wahl: string) => {
    if (wahl.startsWith('outfit:')) {
      const id = wahl.slice('outfit:'.length)
      const treffer = einreichungen.find((e) => e.id === id)
      return treffer?.name?.trim() || 'Ohne Namen'
    }
    const [, stilId, variante] = wahl.split(':')
    const def = STIL_INDEX[stilId as Stil]
    if (!def || !variante) return wahl
    const label = def.labels[variante as Variante]
    return `${def.titel} · ${label ?? variante}`
  }

  return (
    <section className="endergebnis" aria-labelledby="ergebnis-titel">
      <h2 id="ergebnis-titel">Die Abstimmung</h2>

      {stil && zeilen.length > 0 && (
        <>
          <p className="absatz">
            {zeilen.length} Kombinationen stehen zur Wahl — alle unter {eur(META.budget)}. Dein
            gewählter Look ist mit <strong>Dein Favorit</strong> markiert. Eine Stimme pro Gerät.
          </p>

          <ul className="vergleich">
            {zeilen.map((zeile) => {
              const gewaehlt = stimme === zeile.id
              const favorit = zeile.id === meinLook
              return (
                <li
                  className={[
                    'vergleich-zeile',
                    zeile.drueber ? 'drueber' : '',
                    gewaehlt ? 'gewaehlt' : '',
                    favorit ? 'favorit' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={zeile.id}
                >
                  <div className="vergleich-bilder">
                    {zeile.teile.slice(0, 6).map((teil) => (
                      <span className="vergleich-bild" key={teil.id}>
                        <img
                          src={`/teile/${teil.bild}`}
                          width={56}
                          height={56}
                          alt=""
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                  <div className="vergleich-text">
                    <strong className="vergleich-titel">
                      {varianteLabel(stil, zeile.variante)}
                      {favorit && <span className="favorit-badge">Dein Favorit</span>}
                    </strong>
                    <span className="vergleich-preis">
                      {zeile.drueber ? `${eur(zeile.summe)} · über Budget` : eur(zeile.summe)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-gold"
                    disabled={zeile.drueber || (gewaehlt && meldung === 'ok')}
                    onClick={() => void stimMe(zeile.id)}
                  >
                    {gewaehlt ? 'Deine Stimme' : `${zeile.teile.length} Teile · stimmen`}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {meldung === 'ok' && (
        <p className="hinweis" role="status">
          Stimme gezählt. Die Rangliste unten aktualisiert sich live.
        </p>
      )}
      {meldung === 'dupliziert' && (
        <p className="hinweis" role="status">
          Dieses Gerät hat bereits abgestimmt — Stimme bleibt wie sie war. Neustart der Auswahl ändert
          sie nicht.
        </p>
      )}
      {meldung === 'fehler' && (
        <p className="hinweis" role="status">
          Stimme konnte nicht gespeichert werden — ist der Auswertungs-Server erreichbar?
        </p>
      )}

      <div className="einreichungen">
        <h3>Eingereichte Outfits · {einreichungen.length}</h3>
        {einreichungen.length === 0 ? (
          <p className="hinweis">
            Noch nichts eingereicht — in Schritt 3 kannst du deinen eigenen Look einreichen, dann
            steht er hier.
          </p>
        ) : (
          <ul className="vergleich">
            {einreichungen.map((einreichung) => {
              const wahl = `outfit:${einreichung.id}`
              const gewaehlt = stimme === wahl
              const favorit = meinLook === wahl
              const teile = einreichung.teile
                .map((id) => PRODUKTE[id])
                .filter((teil): teil is Produkt => Boolean(teil))
              const summe = teile.reduce((s, t) => s + preisVon(t), 0)
              const name = einreichung.name?.trim() || 'Ohne Namen'
              return (
                <li
                  className={[
                    'vergleich-zeile',
                    gewaehlt ? 'gewaehlt' : '',
                    favorit ? 'favorit' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={einreichung.id}
                >
                  <div className="vergleich-bilder">
                    {teile.slice(0, 6).map((teil) => (
                      <span className="vergleich-bild" key={teil.id}>
                        <img
                          src={`/teile/${teil.bild}`}
                          width={56}
                          height={56}
                          alt=""
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                  <div className="vergleich-text">
                    <strong className="vergleich-titel">
                      {name}
                      {favorit && <span className="favorit-badge">Dein Favorit</span>}
                    </strong>
                    <span className="vergleich-preis">
                      {eur(summe)} · {teile.length} Teile
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-gold"
                    disabled={gewaehlt && meldung === 'ok'}
                    onClick={() => void stimMe(wahl)}
                  >
                    {gewaehlt ? 'Deine Stimme' : 'stimmen'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {ergebnis && ergebnis.gesamt > 0 && (
        <div className="rangliste" aria-live="polite">
          <h3>Rangliste · {ergebnis.gesamt} Stimmen</h3>
          <ol className="rangfolge">
            {[...ergebnis.stimmen]
              .sort((a, b) => b.anzahl - a.anzahl)
              .map(({ wahl, anzahl }, i) => {
                const platz = i + 1
                const breite = Math.round((anzahl / ergebnis.gesamt) * 100)
                return (
                  <li className={wahl === stimme ? 'mein' : ''} key={wahl}>
                    <span className="rang-platz">{platz}.</span>
                    <span className="rang-label">{labelZu(wahl)}</span>
                    <span className="rang-balken" style={{ width: `${breite}%` }} />
                    <span className="rang-zahl">
                      {anzahl} {anzahl === 1 ? 'Stimme' : 'Stimmen'}
                    </span>
                  </li>
                )
              })}
          </ol>
        </div>
      )}
      {ergebnis && ergebnis.gesamt === 0 && (
        <p className="hinweis">Noch keine Stimmen — du kannst die erste abgeben.</p>
      )}
    </section>
  )
}
