import { PRODUKTE, preisVon } from '../data/outfit'
import { eur } from '../lib/format'

export type Kategorie = 'top' | 'unten' | 'beinmode' | 'jacke' | 'accessoire'

export type KategorieGruppe = {
  key: Kategorie
  titel: string
  ids: string[]
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

type Props = {
  gruppen: KategorieGruppe[]
  wahl: Record<Kategorie, string | null>
  onChange: (kategorie: Kategorie, produktKey: string) => void
}

export function Builder({ gruppen, wahl, onChange }: Props) {
  return (
    <div className="zusatz">
      <p className="zusatz-hint">
        Pro Kategorie ein Teil — die Kniehochschuhe stehen mit 0 € fest und werden nicht gewählt.
        Erst wenn die Preise vom Shop kommen, rechnet die Summe unten live mit.
      </p>
      {gruppen.map((gruppe) => (
        <div
          className="zusatz-gruppe"
          key={gruppe.key}
          role="group"
          aria-labelledby={`kat-${gruppe.key}`}
        >
          <h3 id={`kat-${gruppe.key}`}>{gruppe.titel}</h3>
          <div className="karten karten-klein">
            {gruppe.ids.map((id) => {
              const teil = PRODUKTE[id]
              if (!teil) return null
              return (
                <label className="wahl" key={id}>
                  <input
                    className="sr-only"
                    type="radio"
                    name={`bau-${gruppe.key}`}
                    value={id}
                    checked={wahl[gruppe.key] === id}
                    onChange={() => onChange(gruppe.key, id)}
                  />
                  <span className="wahl-flaeche">
                    <Haken />
                    <span className="thumb">
                      <img
                        src={`/teile/${teil.bild}`}
                        alt=""
                        width={400}
                        height={400}
                        loading="lazy"
                      />
                    </span>
                    <strong className="wahl-titel">{teil.titel}</strong>
                    <span className="wahl-meta">{teil.marke}</span>
                    <span className="wahl-preis">{eur(preisVon(teil))}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
