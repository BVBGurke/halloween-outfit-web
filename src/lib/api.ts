export type StimmDaten = {
  geraet: string
  wahl: string
}

export type StimmenSumme = {
  gesamt: number
  stimmen: { wahl: string; anzahl: number }[]
  meinVote: string | null
}

export async function sendeStimme(daten: StimmDaten): Promise<{ status: 201 | 409 }> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(daten),
  })
  return { status: res.status === 201 ? 201 : 409 }
}

export async function holeErgebnis(geraet: string): Promise<StimmenSumme> {
  const res = await fetch(`/api/ergebnis?geraet=${encodeURIComponent(geraet)}`)
  if (!res.ok) return { gesamt: 0, stimmen: [], meinVote: null }
  return (await res.json()) as StimmenSumme
}