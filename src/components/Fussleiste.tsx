import { META } from '../data/outfit'
import { eur } from '../lib/format'

export type Schritt = 1 | 2 | 3 | 4 | 5

type Props = {
  schritt: Schritt
  stilName: string | null
  lookLabel: string | null
  summe: number | null
  weiterGesperrt: boolean
  weiterText: string
  zeigeVergleichen?: boolean
  onWeiter: () => void
  onZurueck: () => void
  onVergleichen: () => void
}

export function Fussleiste({
  schritt,
  stilName,
  lookLabel,
  summe,
  weiterGesperrt,
  weiterText,
  zeigeVergleichen = true,
  onWeiter,
  onZurueck,
  onVergleichen,
}: Props) {
  return (
    <div className="fussleiste">
      <div className="fuss-inhalt">
        <div className="fuss-summary" aria-live="polite">
          <span className="fuss-label">Dein Plan</span>
          <span className="fuss-wert">
            {stilName ?? 'Noch kein Stil'} · {lookLabel ?? 'kein Look'}
            {schritt >= 2 && summe !== null && (
              <span className="fuss-summe">
                {' '}
                · {eur(summe)} von {eur(META.budget)}
              </span>
            )}
          </span>
        </div>
        <div className="fuss-knoepfe">
          {schritt > 1 && (
            <button type="button" className="btn-ghost" onClick={onZurueck}>
              Zurück
            </button>
          )}
          {schritt >= 3 && zeigeVergleichen && (
            <button type="button" className="btn-ghost" onClick={onVergleichen}>
              Wieder vergleichen
            </button>
          )}
          <button type="button" className="btn-gold" onClick={onWeiter} disabled={weiterGesperrt}>
            {weiterText}
          </button>
        </div>
      </div>
    </div>
  )
}