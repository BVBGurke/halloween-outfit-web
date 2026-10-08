import { META, SCHUHE, preisVon, type Produkt } from '../data/outfit'
import { eur, prozent } from '../lib/format'

type Props = {
  label: string
  teile: Produkt[]
}

export function Budget({ label, teile }: Props) {
  const summe = teile.reduce((s, t) => s + preisVon(t), 0)
  const rest = META.budget - summe

  return (
    <>
      <div className="budget">
        <div className="budget-kopf">
          <span className="budget-label">Budget · {label}</span>
          <span className="budget-zahl">
            {eur(summe)} <em>von {eur(META.budget)}</em>
          </span>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={META.budget}
          aria-valuenow={summe}
          aria-label={`Budgetauslastung für ${label}`}
        >
          <div className="fill" style={{ width: `${prozent(summe, META.budget)}%` }} />
        </div>
        <p className="budget-rest">
          {rest >= 0 ? (
            <>
              <strong>{eur(rest)}</strong> bleiben übrig. Schuhe und Make-up sind nicht gerechnet —
              die hast du schon.
            </>
          ) : (
            <>
              <strong>{eur(-rest)}</strong> über dem Limit. Genau eine Alternative streichen.
            </>
          )}
        </p>
      </div>

      <div className="rechnung">
        {teile.map((teil) => (
          <div className="zeile" key={teil.id}>
            <span>
              {teil.titel} · {teil.marke}
            </span>
            <span>{eur(preisVon(teil))}</span>
          </div>
        ))}
        <div className="zeile summe">
          <span>Summe ohne Schuhe</span>
          <span>{eur(summe)}</span>
        </div>
        <div className="zeile stumm">
          <span>
            {SCHUHE.marke} {SCHUHE.modell} · bereits vorhanden
          </span>
          <span>{eur(0)}</span>
        </div>
        <div className="zeile stumm">
          <span>Make-up</span>
          <span>{eur(0)}</span>
        </div>
      </div>
    </>
  )
}
