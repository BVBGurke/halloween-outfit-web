import type { ReactNode } from 'react'
import { PRODUKTE, preisVon } from '../data/outfit'
import { eur } from '../lib/format'
import { bildUrl } from '../lib/image'

export type Kategorie = 'top' | 'unten' | 'beinmode' | 'jacke' | 'accessoire'

export type KategorieGruppe = {
  key: Kategorie
  titel: string
  ids: string[]
}

function Haken() {
  return (
    <span className="haken" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

type Props = {
  gruppen: KategorieGruppe[]
  wahl: Record<Kategorie, string | null>
  produkte?: Record<string, typeof PRODUKTE[string]>
  slots?: Partial<Record<Kategorie, ReactNode>>
  onDelete?: (produktKey: string) => void
  onChange: (kategorie: Kategorie, produktKey: string) => void
}

export function Builder({ gruppen, wahl, produkte = PRODUKTE, slots = {}, onDelete, onChange }: Props) {
  return (
    <div className="zusatz">
      <p className="zusatz-hint">
        Pro Kategorie ein Teil — die Kniehochschuhe stehen mit 0 € fest und werden nicht gewählt.
        Erst wenn die Preise vom Shop kommen, rechnet die Summe unten live mit.
      </p>
      {gruppen.map((gruppe) => (
        <div
          className="zusatz-gruppe"
          key={gruppe.key}
          role="group"
          aria-labelledby={`kat-${gruppe.key}`}
        >
          <h3 id={`kat-${gruppe.key}`}>{gruppe.titel}</h3>
          <div className="karten karten-klein">
            {slots[gruppe.key]}
            {gruppe.ids.map((id) => {
              const teil = produkte[id]
              if (!teil) return null
              const karte = (
                <label className="wahl" key={id}>
                  <input
                    className="sr-only"
                    type="radio"
                    name={`bau-${gruppe.key}`}
                    value={id}
                    checked={wahl[gruppe.key] === id}
                    onChange={() => onChange(gruppe.key, id)}
                  />
                  <span className="wahl-flaeche">
                    <Haken />
                    <span className="thumb">
                      <img
                        src={bildUrl(teil.bild)}
                        alt=""
                        width={400}
                        height={400}
                        loading="eager"
                        decoding="sync"
                      />
                    </span>
                    <strong className="wahl-titel">{teil.titel}</strong>
                    <span className="wahl-meta">{teil.marke}</span>
                    <span className="wahl-preis">{eur(preisVon(teil))}</span>
                  </span>
                </label>
              )

  const importSlot = slots ? slots['top'] || slots['unten'] || slots['beinmode'] || slots['jacke'] || slots['accessoire'] || null : null

  const hasImportSlot = Boolean(importSlot)
  const importCard = (
    <label className="wahl" key="add-import" style={{ opacity: 0.85 }}>
      <input
        className="sr-only"
        type="radio"
        name="bau-import"
        value=""
        disabled
      />
      <span className="wahl-flaeche" style={{ borderStyle: 'dashed', borderColor: '#c9a227', background: '#16161a' }}>
        <strong className="wahl-titel" style={{ color: '#c9a227' }}>+ Teil importieren</strong>
        <span className="wahl-meta">Link in Schritt 1 einfügen · wird automatisch zugeordnet</span>
      </span>
    </label>
  )

  return (
    <div className="zusatz">
      <p className="zusatz-hint">
        Pro Kategorie ein Teil — die Kniehochschuhe stehen mit 0 € fest und werden nicht gewählt.
        Erst wenn die Preise vom Shop kommen, rechnet die Summe unten live mit.
      </p>
      {gruppen.map((gruppe) => (
        <div
          className="zusatz-gruppe"
          key={gruppe.key}
          role="group"
          aria-labelledby={`kat-${gruppe.key}`}
        >
          <h3 id={`kat-${gruppe.key}`}>{gruppe.titel}</h3>
          <div className="karten karten-klein">
            {gruppe.ids.map((id) => {
              const teil = produkte[id]
              if (!teil) return null
              const karte = (
                <label className="wahl" key={id}>
                  <input
                    className="sr-only"
                    type="radio"
                    name={`bau-${gruppe.key}`}
                    value={id}
                    checked={wahl[gruppe.key] === id}
                    onChange={() => onChange(gruppe.key, id)}
                  />
                  <span className="wahl-flaeche">
                    <Haken />
                    <span className="thumb">
                      <img
                        src={bildUrl(teil.bild)}
                        alt=""
                        width={400}
                        height={400}
                        loading="eager"
                        decoding="sync"
                      />
                    </span>
                    <strong className="wahl-titel">{teil.titel}</strong>
                    <span className="wahl-meta">{teil.marke}</span>
                    <span className="wahl-preis">{eur(preisVon(teil))}</span>
                  </span>
                </label>
              )

              if (!id.startsWith('imp_') || !onDelete) return karte

              return (
                <div className="wahl-shell" key={id}>
                  {karte}
                  <button
                    type="button"
                    className="import-loeschen"
                    onClick={() => onDelete(id)}
                    aria-label={`${teil.titel} löschen`}
                    title="Import löschen"
                  >
                    ×
                  </button>
                </div>
              )
            })}
            {hasImportSlot && gruppe.key === 'top' && importCard}
          </div>
        </div>
      ))}
    </div>
  )
}

