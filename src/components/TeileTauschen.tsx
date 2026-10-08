import { PRODUKTE, preisVon, type Produkt } from '../data/outfit'
import { eur } from '../lib/format'
import { bildUrl } from '../lib/image'
import type { KategorieGruppe } from './Builder'

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
  /** Teile des gewählten Looks, solange sie im Ursprungszustand sind */
  basis: Produkt[]
  /** Teil-ID → Ersatz-Produktkey */
  tausch: Record<string, string>
  gruppen: KategorieGruppe[]
  onChange: (teilId: string, produktKey: string) => void
}

export function TeileTauschen({ basis, tausch, gruppen, onChange }: Props) {
  if (!basis.length) return null
  const belegt = new Set(basis.map((teil) => tausch[teil.id] ?? teil.id))

  return (
    <div className="zusatz">
      <p className="zusatz-hint">
        Pro Teil dieselbe Kategorie — was schon im Look steckt, schaltet sich ab. Der Look behält
        seine ursprüngliche Kombi, solange du nichts tauschst.
      </p>
      {basis.map((teil) => {
        const gruppe = gruppen.find((g) => g.ids.includes(teil.id))
        if (!gruppe) return null
        const aktuell = tausch[teil.id] ?? teil.id
        return (
          <div
            className="zusatz-gruppe"
            key={teil.id}
            role="group"
            aria-labelledby={`tausch-${teil.id}`}
          >
            <h3 id={`tausch-${teil.id}`}>{teil.titel}</h3>
            <div className="karten karten-klein">
              {gruppe.ids.map((id) => {
                const option = PRODUKTE[id]
                if (!option) return null
                const fremd = id !== aktuell && belegt.has(id)
                return (
                  <label className="wahl" key={id}>
                    <input
                      className="sr-only"
                      type="radio"
                      name={`tausch-${teil.id}`}
                      value={id}
                      checked={aktuell === id}
                      disabled={fremd}
                      onChange={() => onChange(teil.id, id)}
                    />
                    <span className="wahl-flaeche">
                      <Haken />
                      <span className="thumb">
                        <img
                          src={bildUrl(option.bild)}
                          alt=""
                          width={400}
                          height={400}
                          loading="eager"
                          decoding="sync"
                        />
                      </span>
                      <strong className="wahl-titel">{option.titel}</strong>
                      <span className="wahl-meta">
                        {id === teil.id ? 'Im Look' : option.marke}
                      </span>
                      <span className="wahl-preis">{eur(preisVon(option))}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

