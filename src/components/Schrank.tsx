import type { InventarTeil, NeuesTeilForm } from '../data/inventar'
const LAGE_KEYS: Record<string, 'top' | 'unten' | 'beinmode' | 'jacke' | 'accessoire'> = {
  Oberteil: 'top',
  Unterteil: 'unten',
  Beinmode: 'beinmode',
  Jacke: 'jacke',
  Accessoire: 'accessoire',
}

const KATEGORIE_TITEL: Record<string, string> = {
  top: 'Oberteil',
  unten: 'Unterteil',
  beinmode: 'Beinmode',
  jacke: 'Jacke / Layer',
  accessoire: 'Accessoire',
}

const FARBEN = [
  'schwarz',
  'weiss',
  'creme',
  'beige',
  'khaki',
  'grau-antschau',
  'anthrazit',
  'blau-hell',
  'blau-tief',
  'gruen-oliv',
  'gruen-pistazie',
  'rot-burgunßon',
  'rot-zinnober',
  'pink-hell',
  'pink-tief',
  'lila',
  'orange-braun',
  'gelb-museum',
  'gold',
  'silber',
  'nicht zugeordnet',
] as const

const UNTERTON = ['warm', 'kühl', 'neutral', 'offen'] as const

const STOFFE = [
  'Baumwolle',
  'Leinen',
  'Seide / Satin',
  'Viskose / Rayon',
  'Modal / Tencel',
  'Polyester / Microfibre',
  'Kunstleder',
  'Leder / Rinderleder',
  'Gehäkeltes / Stickerei',
  'Glitzer / Netz / Spitze',
  'Denim / Jeans',
  'Wolle / Flanell',
  'Polar / Saumfutter',
  'Fleece / Woll-Mix',
  'Strick / Merinowolle',
  'Plexiglas / Vinyl / Hartstoff',
  'Andere / Mischstoff',
] as const

const FORMALITAET = [
  '1 — Alltag / Couch',
  '2 — Sperrgebiet / Supermarkt',
  '3 — Freizeit / Treff',
  '4 — Beruflich / Service',
  '5 — Hochzeit / Ball / Abend',
  '6 — Kleiderordnung Gastgeber',
] as const

const ZUSTAND = [
  'Intakt / Mitgenommen',
  'Zahnfleisch hoch / Halter drin',
  'Leere Knöpfe / Nähte straff',
  'Bekant mit einem Fleck',
  'Trage ich nur wenn es ganz heißt',
] as const

type Props = {
  inventar: InventarTeil[]
  form: NeuesTeilForm
  status: 'ok' | 'loeschen' | null
  msg: string | null
  fehler: string | null
  submit: 'idle' | 'senden'
  onField: (feld: keyof NeuesTeilForm, wert: string) => void
  onSubmit: () => void
  onLoeschen: (id: string) => void
}

export function Schrank({
  inventar,
  form,
  status,
  msg,
  fehler,
  submit,
  onField,
  onSubmit,
  onLoeschen,
}: Props) {
  const formularFehler =
    !form.titel.trim()
      ? 'Ein Titel ist das Mindeste — ohne Titel kein Teil.'
      : form.farbe === 'nicht zugeordnet'
        ? 'Farbe nennen, auch wenn sie „nicht zugeordnet“ lautet.'
        : null
  const formularFehlerBool = Boolean(formularFehler)

  return (
    <div className="schrank">
      <div className="schrank-half">
        <h2>Neues Teil</h2>
        {msg ? (
          <p className="hinweis" role="status">
            {msg}
          </p>
        ) : null}
        {fehler ? (
          <p className="hinweis" role="alert">
            {fehler}
          </p>
        ) : null}
        <form className="schrank-form" onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          <label>Titel des Teils
            <input
              className="schrank-input"
              value={form.titel}
              onChange={(e) => onField('titel', e.target.value)}
              maxLength={80}
              placeholder="z. B. Stricknetter Schwarz L"
              autoFocus
            />
          </label>

          <fieldset className="schrank-zeile">
            <legend className="sr-only">Kategorie</legend>
            <span className="schrank-label">Kategorie</span>
            <select
              className="schrank-select"
              value={form.kategorie}
              onChange={(e) => onField('kategorie', e.target.value)}
            >
              {Object.values(LAGE_KEYS).map((k) => (
                <option key={k} value={k}>
                  {KATEGORIE_TITEL[k]}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="schrank-zeile">
            <legend className="sr-only">Farbe</legend>
            <span className="schrank-label">Farbe</span>
            <select
              className="schrank-select"
              value={form.farbe}
              onChange={(e) => onField('farbe', e.target.value)}
            >
              {FARBEN.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="schrank-zeile">
            <legend className="sr-only">Unterton</legend>
            <span className="schrank-label">Unterton</span>
            <select
              className="schrank-select"
              value={form.unterton}
              onChange={(e) => onField('unterton', e.target.value)}
            >
              {UNTERTON.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="schrank-zeile">
            <legend className="sr-only">Stoff</legend>
            <span className="schrank-label">Stoff</span>
            <select
              className="schrank-select"
              value={form.stoff}
              onChange={(e) => onField('stoff', e.target.value)}
            >
              {STOFFE.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="schrank-zeile">
            <legend className="sr-only">Formalitätsstufe</legend>
            <span className="schrank-label">Formalitätsstufe</span>
            <select
              className="schrank-select"
              value={form.formalitaet}
              onChange={(e) => onField('formalitaet', e.target.value)}
            >
              {FORMALITAET.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="schrank-zeile">
            <legend className="sr-only">Zustand</legend>
            <span className="schrank-label">Zustand</span>
            <select
              className="schrank-select"
              value={form.zustand}
              onChange={(e) => onField('zustand', e.target.value)}
            >
              {ZUSTAND.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </fieldset>

          <label>Passform-Notiz
            <input
              className="schrank-input"
              value={form.passformNotiz}
              onChange={(e) => onField('passformNotiz', e.target.value)}
              maxLength={120}
              placeholder="z. B. Schulter sitzt, Taillenerweiterung nötig"
            />
          </label>

          <button
            type="submit"
            className="btn-gold"
            disabled={submit === 'senden' || formularFehlerBool}
          >
            {submit === 'senden' ? 'Wird gespeichert …' : 'Teil im Schrank ablegen'}
          </button>
        </form>
      </div>

      <div className="schrank-half">
        <h2>Schrank ({inventar.length})</h2>
        {inventar.length === 0 ? (
          <p className="hinweis">Noch nichts im Schrank. Das erste Teil oben eintragen.</p>
        ) : (
          <ul className="schrank-liste">
            {inventar.map((t) => (
              <li key={t.id} className="schrank-row">
                <button
                  type="button"
                  className="schrank-loeschen"
                  onClick={() => onLoeschen(t.id)}
                  title="Teil aus Schrank nehmen"
                  disabled={status === 'loeschen'}
                >
                  ×
                </button>
                <span className="schrank-id">{t.id}</span>
                <span className="schrank-titel">{t.titel}</span>
                <span className="schrank-meta">
                  {t.farbe} · {t.unterton} · {t.stoff} · {t.formalitaet}
                </span>
                <span className="schrank-notiz">{t.passformNotiz}</span>
                <span className="schrank-status">{t.zustand}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const INVENTAR_KATEGORIEN = [
  { key: 'top', titel: 'Oberteil' },
  { key: 'unten', titel: 'Unterteil' },
  { key: 'beinmode', titel: 'Beinmode' },
  { key: 'jacke', titel: 'Jacke / Layer' },
  { key: 'accessoire', titel: 'Accessoire' },
]

export function InventarListe({
  teile,
  onLoeschen,
  status,
  msg,
}: {
  teile: InventarTeil[]
  onLoeschen: (id: string) => void
  status: 'ok' | 'loeschen' | null
  msg: string | null
}) {
  return (
    <section className="schrank-liste-alle" aria-labelledby="schrank-alle-titel">
      <h2 id="schrank-alle-titel">Alle Teile ({teile.length})</h2>
      {msg ? <p className="hinweis" role="status">{msg}</p> : null}
      {teile.length === 0 ? (
        <p className="hinweis">Noch nichts im Schrank.</p>
      ) : (
        <ul className="schrank-liste">
          {teile.map((t) => (
            <li key={t.id} className="schrank-row">
              <button
                type="button"
                className="schrank-loeschen"
                onClick={() => onLoeschen(t.id)}
                title="Teil aus Schrank nehmen"
                disabled={status === 'loeschen'}
              >
                ×
              </button>
              <span className="schrank-id">{t.id}</span>
              <span className="schrank-titel">{t.titel}</span>
              <span className="schrank-meta">
                {t.kategorie} · {t.farbe} · {t.unterton} · {t.stoff} · {t.formalitaet}
              </span>
              <span className="schrank-notiz">{t.passformNotiz}</span>
              <span className="schrank-status">{t.zustand}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
