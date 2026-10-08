const KEY = 'halloween-outfit-geraet'

function zufallsId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback für ältere Browser ohne crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (zeichen) => {
    const zufall = (crypto.getRandomValues(new Uint8Array(1))[0] ?? Math.random() * 16) | 0
    const wert = zeichen === 'x' ? zufall : (zufall & 0x3) | 0x8
    return wert.toString(16)
  })
}

export function geraetId(): string {
  const alt = localStorage.getItem(KEY)
  if (alt) return alt
  const neu = zufallsId()
  localStorage.setItem(KEY, neu)
  return neu
}