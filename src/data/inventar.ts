export type InventarKategorie = 'top' | 'unten' | 'beinmode' | 'jacke' | 'accessoire'

export type InventarTeil = {
  id: string
  kategorie: InventarKategorie
  titel: string
  farbe: string
  unterton: 'warm' | 'kühl' | 'neutral' | 'offen'
  stoff: string
  formalitaet: string
  passformNotiz: string
  zustand: string
  confirmed_by_user: boolean
}

export const LEER_FORM: NeuesTeilForm = {
  titel: '',
  kategorie: 'top',
  farbe: 'schwarz',
  unterton: 'warm',
  stoff: 'Baumwolle',
  formalitaet: '1 — Alltag / Couch',
  zustand: 'Intakt / Mitgenommen',
  passformNotiz: '',
}

export type NeuesTeilForm = {
  titel: string
  kategorie: InventarKategorie
  farbe: string
  unterton: string
  stoff: string
  formalitaet: string
  zustand: string
  passformNotiz: string
}
