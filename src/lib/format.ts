export const eur = (n: number) => `${n.toFixed(2).replace('.', ',')} \u20ac`

export const prozent = (teil: number, ganz: number) =>
  Math.min(100, Math.round((teil / ganz) * 1000) / 10)