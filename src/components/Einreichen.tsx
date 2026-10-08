import { useState, type FormEvent } from 'react'
import { preisVon, type Produkt } from '../data/outfit'
import { eur } from '../lib/format'

type Props = {
  teile: Produkt[]
  label: string
  onFertig: () => void
}

type Status = 'bereit' | 'senden' | 'ok' | 'fehler'

export function Einreichen({ teile, label, onFertig }: Props) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>('bereit')
  const [meldung, setMeldung] = useState<string | null>(null)
  const summe = teile.reduce((s, t) => s + preisVon(t), 0)

  const senden = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!teile.length) return
    setStatus('senden')
    setMeldung(null)
    try {
      const res = await fetch('/api/outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, teile: teile.map((t) => t.id) }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('ok')
      setMeldung('Dein Look liegt in der Abstimmung. Unten weiter — dort kannst du auch abstimmen.')
    } catch {
      setStatus('fehler')
      setMeldung(
        'Einreichen hat nicht geklappt — ist der Auswertungs-Server erreichbar? Deine Auswahl bleibt erhalten.',
      )
    }
  }

  return (
    <form className="einreichen" onSubmit={senden}>
      <p className="absatz">
        {teile.length} Teile für {eur(summe)} — <strong>{label}</strong>. Dein Look geht in die
        Abstimmung und steht dort neben den fertigen Kombinationen. Ohne Namen heißt er einfach
        „Ohne Namen“.
      </p>
      <label htmlFor="einreich-name">Name für die Abstimmung, höchstens 40 Zeichen</label>
      <input
        id="einreich-name"
        name="name"
        type="text"
        maxLength={40}
        autoComplete="off"
        placeholder="z. B. Potsdam-Combo"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit" className="btn-gold" disabled={status === 'senden' || !teile.length}>
        {status === 'senden' ? 'Wird eingereicht …' : 'Look einreichen'}
      </button>
      {meldung && (
        <p className="hinweis" role={status === 'fehler' ? 'alert' : 'status'}>
          {meldung}
        </p>
      )}
      {status === 'ok' && (
        <p>
          <button type="button" className="link" onClick={onFertig}>
            Zur Abstimmung
          </button>
        </p>
      )}
    </form>
  )
}
