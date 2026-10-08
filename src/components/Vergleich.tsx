import { useMemo } from 'react'
import {
  META,
  lookId,
  lookZeilen,
  preisVon,
  varianteLabel,
  type Stil,
  type Variante,
} from '../data/outfit'
import { eur } from '../lib/format'

type Auswahl = { variante: Variante }

type Props = {
  stil: Stil
  auswahl: Auswahl | null
  onWahl: (variante: Variante) => void
}

export function Vergleich({ stil, auswahl, onWahl }: Props) {
  // lookZeilen rechnet mit den eingetragenen Grundpreisen — hier live nachziehen
  const zeilen = useMemo(
    () =>
      lookZeilen(stil).map((zeile) => {
        const summe = zeile.teile.reduce((s, t) => s + preisVon(t), 0)
        return { ...zeile, summe, drueber: summe > META.budget }
      }),
    [stil],
  )
  const gewaehltId = auswahl ? lookId(stil, auswahl.variante) : null

  return (
    <section className="vergleich">
      <div className="karten look-karten">
        {zeilen.map((zeile) => {
          const aktiv = zeile.id === gewaehltId
          return (
            <label className="wahl look-karte" key={zeile.id}>
              <input
                className="sr-only"
                type="radio"
                name="vergleich"
                value={zeile.id}
                checked={aktiv}
                disabled={zeile.drueber}
                onChange={() => onWahl(zeile.variante)}
              />
              <span className="wahl-flaeche look-karte-flaeche">
                <span className="look-bilder">
                  {zeile.teile.map((teil) => (
                    <span className="look-bild" key={teil.id}>
                      <img src={`/teile/${teil.bild}`} width={96} height={96} alt="" loading="lazy" />
                    </span>
                  ))}
                </span>
                <strong className="wahl-titel">{varianteLabel(stil, zeile.variante)}</strong>
                <span className="look-zeile">
                  <span className="look-preis">{eur(zeile.summe)}</span>
                  <span className="look-anzahl">{zeile.teile.length} Teile</span>
                  {zeile.drueber && <span className="look-drueber">über Budget</span>}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}