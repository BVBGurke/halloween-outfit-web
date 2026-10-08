import { useState } from 'react'
import type { Produkt } from '../data/outfit'

type Props = {
  onImport: (teil: Produkt) => void
}

export function ImportTeil({ onImport }: Props) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'laden' | 'erfolg' | 'fehler'>('idle')
  const [fehler, setFehler] = useState('')

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setStatus('laden')
    setFehler('')

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.fehler || `HTTP ${res.status}`)

      onImport(data.teil)
      setStatus('erfolg')
      setUrl('')
    } catch (err) {
      setFehler(err instanceof Error ? err.message : String(err))
      setStatus('fehler')
    }
  }

  return (
    <div className="wahl import-karte">
      <form className="wahl-flaeche import-form" onSubmit={handleImport}>
        <strong className="wahl-titel">Teil per Link hinzufügen</strong>
        <span className="wahl-meta">NEW YORKER oder Produktseite einfügen. Wird dauerhaft gespeichert.</span>
        <input
          className="import-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.newyorker.de/products/detail/..."
        />
        <button type="submit" className="btn-gold import-btn" disabled={status === 'laden'}>
          {status === 'laden' ? 'Lade …' : 'Hinzufügen'}
        </button>
        {status === 'fehler' && <span className="import-status fehler">{fehler}</span>}
        {status === 'erfolg' && <span className="import-status">Gespeichert.</span>}
      </form>
    </div>
  )
}
