import { STILE, teileFuer, type Stil } from '../data/outfit'
import { bildUrl } from '../lib/image'

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
  aktiverStil: Stil | null
  onStil: (stil: Stil) => void
}

export function StileReiter({ aktiverStil, onStil }: Props) {
  return (
    <fieldset className="karten">
      <legend className="sr-only">Richtung wählen</legend>
      {STILE.map((stil) => {
        const bild = teileFuer(stil.id, 'kombi1')[0]?.bild
        return (
          <label className="wahl" key={stil.id}>
            <input
              className="sr-only"
              type="radio"
              name="stil"
              value={stil.id}
              checked={aktiverStil === stil.id}
              onChange={() => onStil(stil.id)}
            />
            <span className="wahl-flaeche">
              <Haken />
              <span className="thumb">
                {bild && (
                  <img src={bildUrl(bild)} alt="" width={400} height={400} loading="eager" decoding="sync" />
                )}
              </span>
              <strong className="wahl-titel">{stil.titel}</strong>
              <span className="wahl-meta">{stil.claim}</span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
