export function bildUrl(bild: string) {
  if (!bild) return ''
  return bild.startsWith('http') || bild.startsWith('/') ? bild : `/teile/${bild}`
}
