import { ladenFuer, livePreisFuer, preisVon, produktUrl, type Produkt } from '../data/outfit'
import { eur } from '../lib/format'
import { bildUrl } from '../lib/image'

const ROLLE: Record<Produkt['lage'], string> = {
  basis: 'Basis',
  anker: 'Anker',
  accessoire: 'Accessoire',
}

const datumLang = (iso: string) => {
  const datum = new Date(iso)
  return Number.isNaN(datum.getTime())
    ? null
    : datum.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function TeilKarte({ teil }: { teil: Produkt }) {
  const { primar, ersatz } = ladenFuer(teil.id)
  const live = livePreisFuer(teil)
  const preis = preisVon(teil)
  const statt = live?.statt
  const imSale = Boolean(live?.sale && statt && statt > preis)
  const rabatt = imSale && statt ? Math.round((1 - preis / statt) * 100) : 0
  const geprueft = live?.geprueft ? datumLang(live.geprueft) : null

  return (
    <article className="karte" data-lage={teil.lage}>
      <div className="bilder">
        <img
          src={bildUrl(teil.bild)}
          alt={`${teil.titel} von ${teil.marke}, Farbe Schwarz`}
          width={800}
          height={800}
          loading="eager"
          decoding="sync"
        />
      </div>
      <div className="kopf">
        <span className={`badge ${teil.lage}`}>{ROLLE[teil.lage]}</span>
        {imSale && <span className="badge sale">Sale −{rabatt} %</span>}
        <span className="preis">
          {imSale && statt && <s>{eur(statt)}</s>}
          {eur(preis)}
        </span>
      </div>
      <h3>{teil.titel}</h3>
      <p className="shop">{teil.marke}</p>
      <p className="laden">
        Kaufen: {primar.name} (<a href={primar.lageplan} target="_blank" rel="noreferrer">Lageplan</a>)
        {ersatz && (
          <>
            {' · '}
            {ersatz.name} als Ersatz (
            <a href={ersatz.lageplan} target="_blank" rel="noreferrer">Lageplan</a>)
          </>
        )}
      </p>
      <ul className="fakten">
        <li>Artikel {teil.produktId}</li>
        <li>Farbe Schwarz</li>
        {geprueft && <li>Live-Preis, geprüft {geprueft}</li>}
      </ul>
      <p className="notiz">{teil.notiz}</p>
      <a className="link" href={produktUrl(teil)} target="_blank" rel="noreferrer">
        Produkt ansehen
      </a>
    </article>
  )
}

