export type Stil =
  | 'baddie'
  | 'baddie-nuttig'
  | 'nuttig'
  | 'sexy'
  | 'sexy-baddie'
  | 'leder-biker'
  | 'neglige'
  | 'burlesque'

export type Variante =
  | 'kombi1'
  | 'kombi2'
  | 'kombi3'
  | 'kombi4'
  | 'kombi5'
  | 'kombi6'
  | 'kombi7'
  | 'kombi8'

export type Lage = 'basis' | 'anker' | 'accessoire'

export type Produkt = {
  id: string
  titel: string
  marke: string
  preis: number
  bild: string
  lage: Lage
  produktId: string
  notiz: string
  /** Eigene Produktseite, falls abweichend von der NEW-YORKER-Share-URL */
  link?: string
}

export type StilDef = {
  id: Stil
  titel: string
  claim: string
  beschreibung: string
  stufen: Record<Variante, string[]>
  labels: Record<Variante, string>
  farben: string
  anmerkung: string
}

export const META = {
  anlass: 'Halloween',
  datum: 'Samstag, 31.10.2026',
  ort: 'Potsdam',
  budget: 70,
  koerper: '1,85 m',
  schuhgroesse: 46,
  palette: 'Schwarz, Lederlook, Gold als Akzent',
  hinweis:
    'Preise werden live über die Shop-APIs abgefragt (NEW YORKER und Calzedonia), inklusive Sale-Status, Stand 8. Oktober 2026. Verfügbarkeit und Passform bitte vor Ort prüfen — Größen sind online nicht verlässlich.',
}

export const PRODUKTE: Record<string, Produkt> = {
  spitzenbody: {
    id: 'spitzenbody',
    titel: 'Spitzenbody',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'spitzenbody.jpg',
    lage: 'anker',
    produktId: '03.01.106.0797',
    notiz: 'Tragende Schicht, trägt direkt auf der Haut. In Schwarz und Weiß gelistet.',
  },
  kunstleder_rock: {
    id: 'kunstleder_rock',
    titel: 'Kunstleder Minirock',
    marke: 'NEW YORKER',
    preis: 16.99,
    bild: 'kunstleder_rock.jpg',
    lage: 'anker',
    produktId: '03.01.040.0335',
    notiz: 'Kurzer Lederskirt, sitzt an der Taille. Mit Taillengürtel noch enger.',
  },
  langarmshirt_drapiert: {
    id: 'langarmshirt_drapiert',
    titel: 'Drapiertes Langarmshirt',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'langarmshirt_drapiert.jpg',
    lage: 'anker',
    produktId: '03.01.106.0834',
    notiz: 'Gefalteter Kragen an der Schulter — der feminine Baddie-Akzent.',
  },
  skort_schwarz: {
    id: 'skort_schwarz',
    titel: 'Skort',
    marke: 'NEW YORKER',
    preis: 16.99,
    bild: 'skort_schwarz.jpg',
    lage: 'anker',
    produktId: '03.01.040.0319',
    notiz: 'Kurz mit eingearbeitetem Short. Läuft etwa zwei Größen kleiner.',
  },
  tshirt_figurbetont: {
    id: 'tshirt_figurbetont',
    titel: 'Figurbetontes T-Shirt',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'tshirt_figurbetont.jpg',
    lage: 'anker',
    produktId: '02.02.105.2117',
    notiz: 'Eng geschnitten, deshalb liegt die Kunstleder-Hose darüber.',
  },
  kunstleder_hose: {
    id: 'kunstleder_hose',
    titel: 'Kunstleder Hose',
    marke: 'NEW YORKER',
    preis: 24.99,
    bild: 'kunstleder_hose.jpg',
    lage: 'anker',
    produktId: '02.02.022.0759',
    notiz: 'Der teuerste Brocken im Plan — hält den Streetwear-Look komplett schwarz.',
  },
  kunstlederjacke: {
    id: 'kunstlederjacke',
    titel: 'Kunstlederjacke mit Gürtel',
    marke: 'NEW YORKER',
    preis: 39.99,
    bild: 'kunstlederjacke.png',
    lage: 'anker',
    produktId: '03.01.151.0095',
    notiz: 'Schwarze Kunstlederjacke mit Gürtel für kühle Abende — das kräftigste Layer im Stapel.',
  },
  blazer_tailliert: {
    id: 'blazer_tailliert',
    titel: 'Taillierter Blazer',
    marke: 'NEW YORKER',
    preis: 39.99,
    bild: 'blazer_tailliert.png',
    lage: 'anker',
    produktId: '03.01.154.0695',
    notiz: 'Schwarzer, taillierter Blazer. Stand 8.10.2026 von NEW YORKER noch als „demnächst“ gelistet (coming_soon) — Verfügbarkeit vor dem Kauf prüfen.',
  },
  kettenset_silber: {
    id: 'kettenset_silber',
    titel: 'Kettenset',
    marke: 'NEW YORKER',
    preis: 7.99,
    bild: 'kettenset_silber.png',
    lage: 'accessoire',
    produktId: '01.06.350.3589',
    notiz: 'Silbernes Kettenset, von NEW YORKER als neu gelistet — die günstigste Accessoire-Option.',
  },
  kette_silber: {
    id: 'kette_silber',
    titel: 'Kette (Silber)',
    marke: 'NEW YORKER',
    preis: 9.99,
    bild: 'kette_silber.png',
    lage: 'accessoire',
    produktId: '04.06.350.0118',
    notiz: 'Schlichte Kette von NEW YORKER in Silber (Farbe „Original Silver“).',
  },
  one_shoulder: {
    id: 'one_shoulder',
    titel: 'One Shoulder Langarmshirt',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'one_shoulder.jpg',
    lage: 'anker',
    produktId: '03.01.106.0839',
    notiz: 'Eine Schulter frei — wirkt elegant statt baddig.',
  },
  gewebter_minirock: {
    id: 'gewebter_minirock',
    titel: 'Gewebter Minirock',
    marke: 'NEW YORKER',
    preis: 19.99,
    bild: 'gewebter_minirock.jpg',
    lage: 'anker',
    produktId: '02.02.040.0329',
    notiz: 'Weicher als Leder, dadurch ruhiger als der Rock im Baddie-Look.',
  },
  minikleid_figurbetont: {
    id: 'minikleid_figurbetont',
    titel: 'Figurbetontes Minikleid',
    marke: 'NEW YORKER',
    preis: 24.99,
    bild: 'minikleid_figurbetont.jpg',
    lage: 'anker',
    produktId: '03.01.200.0771',
    notiz: 'Ein Teil für den ganzen Look — deshalb die günstigste Lösung.',
  },
  strumpfhosen: {
    id: 'strumpfhosen',
    titel: 'Strumpfhosen',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'strumpfhosen.jpg',
    lage: 'basis',
    produktId: '01.06.358.0450',
    notiz: 'Blickdicht für die Kniehochschuhe, in fast jedem Look enthalten.',
  },
  netz_strumpfhose: {
    id: 'netz_strumpfhose',
    titel: 'Netzstrumpfhose mittelfein',
    marke: 'Calzedonia',
    preis: 12.95,
    bild: 'netz_strumpfhose.jpg',
    lage: 'basis',
    produktId: 'REC007',
    link: 'https://www.calzedonia.com/de/product/netz_strumpfhose-REC007.html',
    notiz: 'Mittelfeinmaschiges Netz, schwarz (Farbcode 019). Die zurückhaltendere der beiden Netz-Optionen.',
  },
  fischernetz: {
    id: 'fischernetz',
    titel: 'Fischernetz-Strumpfhose',
    marke: 'Calzedonia',
    preis: 12.95,
    bild: 'fischernetz.jpg',
    lage: 'basis',
    produktId: 'REC008',
    link: 'https://www.calzedonia.com/de/product/netz_strumpfhose-REC008.html',
    notiz: 'Großmaschiges Fischernetz, schwarz (SW/019) — der frechste der drei Bein-Optionen. Calzedonia führt ihn selbst als „Netzstrumpfhose“, die größere Masche unterscheidet ihn von REC007.',
  },
  hoodie_schwarz: {
    id: 'hoodie_schwarz',
    titel: 'Sweatshirt mit Kapuze',
    marke: 'NEW YORKER',
    preis: 16.99,
    bild: 'hoodie_schwarz.jpg',
    lage: 'anker',
    produktId: '02.02.120.1242',
    notiz: 'Offen über die Schultern getragen — nimmt jedem Outfit die Strenge.',
  },
  hoodie_warm: {
    id: 'hoodie_warm',
    titel: 'Sweatjacke mit Kapuze',
    marke: 'NEW YORKER',
    preis: 16.99,
    bild: 'hoodie_warm.png',
    lage: 'anker',
    produktId: '02.02.121.0181',
    notiz: 'Zweiter Hoodie im Plan — tauschbar mit dem Sweatshirt mit Kapuze, wenn du eh nur einen willst.',
  },
  taillenguertel: {
    id: 'taillenguertel',
    titel: 'Taillengürtel',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'taillenguertel.jpg',
    lage: 'accessoire',
    produktId: '01.06.356.0470',
    notiz: 'Für den Lederrock praktisch, damit die Taille sitzt.',
  },
  handschuhe: {
    id: 'handschuhe',
    titel: 'Handschuhe',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'handschuhe.jpg',
    lage: 'accessoire',
    produktId: '01.06.352.1068',
    notiz: 'Lang, passend zum One-Shoulder- und zum Negligé-Look.',
  },
  stirnband: {
    id: 'stirnband',
    titel: 'Stirnband',
    marke: 'NEW YORKER',
    preis: 4.99,
    bild: 'stirnband.jpg',
    lage: 'accessoire',
    produktId: '01.06.357.0442',
    notiz: 'Hält die Haare aus dem Gesicht.',
  },
  guertel: {
    id: 'guertel',
    titel: 'Gürtel',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'guertel.jpg',
    lage: 'accessoire',
    produktId: '01.06.356.0459',
    notiz: 'Für Hose und Rock, wenn es ohne Taillengürtel läuft.',
  },
  muetze: {
    id: 'muetze',
    titel: 'Mütze',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'muetze.jpg',
    lage: 'accessoire',
    produktId: '01.06.357.0411',
    notiz: 'Setzt den Streetwear-Charakter.',
  },
  tuch: {
    id: 'tuch',
    titel: 'Tuch',
    marke: 'NEW YORKER',
    preis: 3.99,
    bild: 'tuch.jpg',
    lage: 'accessoire',
    produktId: '01.06.352.1058',
    notiz: 'Am Hals oder am Gürtel — je nach Outfit.',
  },
  schal: {
    id: 'schal',
    titel: 'Schal',
    marke: 'NEW YORKER',
    preis: 9.99,
    bild: 'schal.jpg',
    lage: 'accessoire',
    produktId: '01.06.352.1959',
    notiz: 'Das teuerste Accessoire — macht das Minikleid sofort erwachsen.',
  },
  lederjacke_biker: {
    id: 'lederjacke_biker',
    titel: 'Kunstlederjacke mit Biker-Details',
    marke: 'NEW YORKER',
    preis: 39.99,
    bild: 'lederjacke_biker.jpg',
    lage: 'anker',
    produktId: '03.01.151.0102',
    notiz: 'Reißverschlüsse, Nieten, Bund an der Taille. Alleine 39,99 € — sie frisst das halbe Budget.',
  },
  minirock_enger: {
    id: 'minirock_enger',
    titel: 'Enger Minirock',
    marke: 'NEW YORKER',
    preis: 14.99,
    bild: 'minirock_enger.jpg',
    lage: 'anker',
    produktId: '03.01.040.0331',
    notiz: 'Deutlich kürzer und schmaler als der Kunstleder-Rock. Für den Biker-Look die bessere Wahl.',
  },
  midi_spitze: {
    id: 'midi_spitze',
    titel: 'Midirock mit Spitze',
    marke: 'NEW YORKER',
    preis: 19.99,
    bild: 'midi_spitze.jpg',
    lage: 'anker',
    produktId: '02.02.041.0128',
    notiz: 'Länger als die Miniröcke, deshalb mehr Bein. Das Leitsilben-Stück des Burlesque-Looks.',
  },
  body_cutout: {
    id: 'body_cutout',
    titel: 'Body mit Cut-Out',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'body_cutout.png',
    lage: 'anker',
    produktId: '03.01.106.0819',
    notiz: 'Der Ausschnitt sitzt an der Seite und legt Hüfte und Taille frei.',
  },
  langarmshirt_cutout: {
    id: 'langarmshirt_cutout',
    titel: 'Langarmshirt mit Cut-Out',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'langarmshirt_cutout.jpg',
    lage: 'anker',
    produktId: '03.01.106.0807',
    notiz: 'Cut-Out an der Taille — kombiniert Kleidung mit etwas Haut, ohne dass ein Unterteil nötig ist.',
  },
  langarmshirt_spitze: {
    id: 'langarmshirt_spitze',
    titel: 'Langarmshirt mit Spitze',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'langarmshirt_spitze.png',
    lage: 'anker',
    produktId: '03.01.106.0843',
    notiz: 'Spitze am Ausschnitt und an den Ärmeln. Das Showgirl-Teil des Burlesque-Looks.',
  },
  tshirt_spitze: {
    id: 'tshirt_spitze',
    titel: 'T-Shirt mit Spitze',
    marke: 'NEW YORKER',
    preis: 9.99,
    bild: 'tshirt_spitze.png',
    lage: 'anker',
    produktId: '03.01.105.0834',
    notiz: 'Kurzer Schnitt mit Spitzeneinsatz am Ausschnitt. Billigster Weg zu einem geknöpften Look.',
  },
  sport_top: {
    id: 'sport_top',
    titel: 'Sport Top mit überkreuzten Trägern',
    marke: 'NEW YORKER',
    preis: 9.99,
    bild: 'sport_top.png',
    lage: 'anker',
    produktId: '01.11.100.0034',
    notiz: 'Überkreuzte Träger lassen Rücken und Taille frei — sieht aus wie ein Second-Skin-Teil.',
  },
  negligee: {
    id: 'negligee',
    titel: 'Negligé',
    marke: 'NEW YORKER',
    preis: 12.99,
    bild: 'negligee.png',
    lage: 'anker',
    produktId: '01.05.255.0175',
    notiz: 'Der halbtransparente Hauptteil. Trägt sich allein und bleibt unter dem Kimono sichtbar.',
  },
  kimono: {
    id: 'kimono',
    titel: 'Kimono',
    marke: 'NEW YORKER',
    preis: 19.99,
    bild: 'kimono.png',
    lage: 'anker',
    produktId: '01.05.255.0164',
    notiz: 'Offen getragen die günstigste Art, eine Schicht draufzulegen, ohne etwas zu verdecken.',
  },
  overknee: {
    id: 'overknee',
    titel: 'Overknee-Strümpfe',
    marke: 'NEW YORKER',
    preis: 7.99,
    bild: 'overknee.png',
    lage: 'basis',
    produktId: '01.06.358.0244',
    notiz: 'Nur in 35–38 und 39–42. Bei Schuhgröße 46 der kritischste Artikel im ganzen Plan.',
  },
  kette_gross: {
    id: 'kette_gross',
    titel: 'Kette',
    marke: 'NEW YORKER',
    preis: 6.99,
    bild: 'kette_gross.png',
    lage: 'accessoire',
    produktId: '04.06.350.0119',
    notiz: 'Die größere der beiden Ketten.',
  },
  kette_klein: {
    id: 'kette_klein',
    titel: 'Kette',
    marke: 'NEW YORKER',
    preis: 3.99,
    bild: 'kette_klein.png',
    lage: 'accessoire',
    produktId: '04.06.350.0107',
    notiz: 'Die kleinere der beiden Ketten.',
  },
  armband: {
    id: 'armband',
    titel: 'Armband',
    marke: 'NEW YORKER',
    preis: 6.99,
    bild: 'armband.png',
    lage: 'accessoire',
    produktId: '04.06.350.0087',
    notiz: 'Metallisch, Schwarz und Gold. Der Aufhänger, wenn das Kleidungsstück schwarz bleibt.',
  },  cap_neu: {
    id: 'cap_neu',
    titel: 'Cap',
    marke: 'NEW YORKER',
    preis: 9.99,
    bild: 'cap_neu.jpg',
    lage: 'accessoire',
    produktId: '04.06.357.0797',
    notiz: 'Deutlich teurer als die Mütze im Plan, dafür mit Schirm und saubererem Logo.',
  },
  ohrwaermer: {
    id: 'ohrwaermer',
    titel: 'Ohrwärmer',
    marke: 'NEW YORKER',
    preis: 5.99,
    bild: 'ohrwaermer.png',
    lage: 'accessoire',
    produktId: '01.06.357.0538',
    notiz: 'Strick, hält die Ohren warm und nimmt dem Spitzen-Look etwas von der Kälte.',
  },
}

export type LookZeile = {
  id: string
  variante: Variante
  teile: Produkt[]
  summe: number
  drueber: boolean
}

export function lookZeilen(stil: Stil): LookZeile[] {
  return (Object.keys(STIL_INDEX[stil].stufen) as Variante[]).map((variante) => {
    const teile = teileFuer(stil, variante)
    const summe = teile.reduce((s, t) => s + t.preis, 0)
    return {
      id: `look:${stil}:${variante}`,
      variante,
      teile,
      summe,
      drueber: summe > META.budget,
    }
  })
}

export function lookId(stil: Stil, variante: Variante): string {
  return `look:${stil}:${variante}`
}

export const STILE: StilDef[] = [
  {
    id: 'baddie',
    titel: 'Baddie',
    claim: 'Kurz, krawellig, komplett schwarz',
    beschreibung:
      'Spitze trifft Leder. Der günstigste Einstieg in den Plan und trotzdem sofort outfit.',
    stufen: {
      kombi1: ['spitzenbody', 'kunstleder_rock', 'strumpfhosen'],
      kombi2: ['spitzenbody', 'kunstleder_hose', 'strumpfhosen'],
      kombi3: ['tshirt_spitze', 'kunstleder_rock', 'strumpfhosen'],
      kombi4: ['spitzenbody', 'minirock_enger', 'strumpfhosen'],
      kombi5: ['spitzenbody', 'kunstleder_rock', 'strumpfhosen', 'taillenguertel', 'handschuhe'],
      kombi6: ['spitzenbody', 'kunstleder_rock', 'strumpfhosen', 'hoodie_schwarz'],
      kombi7: ['spitzenbody', 'kunstleder_rock', 'strumpfhosen', 'kette_klein', 'armband', 'tuch'],
      kombi8: ['spitzenbody', 'kunstleder_rock', 'strumpfhosen', 'hoodie_warm', 'kette_klein'],
    },
    labels: {
      kombi1: 'Spitzenbody + Lederrock',
      kombi2: 'Spitzenbody + Lederhose',
      kombi3: 'Spitzen-Top + Lederrock',
      kombi4: 'Spitzenbody + enger Rock',
      kombi5: 'Mit Gürtel + Handschuhen',
      kombi6: 'Mit Hoodie',
      kombi7: 'Mit Schmuck + Tuch',
      kombi8: 'Warm + Kette',
    },
    farben: 'Schwarz',
    anmerkung:
      'Gürtel und Handschuhe tauchen nur in Kombination 5 auf. Der Hoodie kostet 16,99 € und schiebt die schlichte Variante auf 52,96 €.',
  },
  {
    id: 'baddie-nuttig',
    titel: 'Baddie-Nuttig',
    claim: 'Drapiert, verspielt, mit Skort',
    beschreibung:
      'Der gefaltete Kragen gibt dem Ganzen etwas Süßes, der Skort hält es kurz und unkompliziert.',
    stufen: {
      kombi1: ['langarmshirt_drapiert', 'skort_schwarz', 'strumpfhosen'],
      kombi2: ['langarmshirt_drapiert', 'kunstleder_rock', 'strumpfhosen'],
      kombi3: ['langarmshirt_drapiert', 'minirock_enger', 'strumpfhosen'],
      kombi4: ['tshirt_figurbetont', 'skort_schwarz', 'strumpfhosen'],
      kombi5: ['langarmshirt_drapiert', 'skort_schwarz', 'strumpfhosen', 'muetze', 'tuch'],
      kombi6: ['langarmshirt_drapiert', 'skort_schwarz', 'strumpfhosen', 'hoodie_schwarz'],
      kombi7: ['langarmshirt_drapiert', 'skort_schwarz', 'strumpfhosen', 'guertel', 'kette_klein'],
      kombi8: ['langarmshirt_drapiert', 'kunstleder_hose', 'strumpfhosen'],
    },
    labels: {
      kombi1: 'Drapiert + Skort',
      kombi2: 'Drapiert + Lederrock',
      kombi3: 'Drapiert + enger Rock',
      kombi4: 'T-Shirt + Skort',
      kombi5: 'Mit Mütze + Tuch',
      kombi6: 'Mit Hoodie',
      kombi7: 'Mit Gürtel + Kette',
      kombi8: 'Drapiert + Lederhose',
    },
    farben: 'Schwarz',
    anmerkung:
      'Am natürlichsten mit offenen Haaren und wenig Make-up. Der Gürtel taucht nur in Kombination 7 auf.',
  },
  {
    id: 'nuttig',
    titel: 'Nuttig',
    claim: 'Eng, streetwear, Lederhose',
    beschreibung:
      'Eng geschnitten unter Kunstleder-Hose. Weniger Baddie, mehr Streetwear — dafür bequem und unauffällig.',
    stufen: {
      kombi1: ['tshirt_figurbetont', 'kunstleder_hose', 'strumpfhosen'],
      kombi2: ['tshirt_figurbetont', 'kunstleder_hose', 'cap_neu', 'kette_klein'],
      kombi3: ['tshirt_figurbetont', 'kunstleder_hose', 'hoodie_schwarz'],
      kombi4: ['tshirt_figurbetont', 'kunstleder_hose', 'hoodie_warm', 'kette_klein'],
      kombi5: ['tshirt_spitze', 'kunstleder_hose', 'strumpfhosen'],
      kombi6: ['spitzenbody', 'kunstleder_hose', 'strumpfhosen'],
      kombi7: ['tshirt_figurbetont', 'kunstleder_hose', 'muetze', 'tuch'],
      kombi8: ['tshirt_figurbetont', 'kunstleder_hose', 'handschuhe', 'kette_klein'],
    },
    labels: {
      kombi1: 'T-Shirt + Lederhose',
      kombi2: 'Mit Cap + Kette',
      kombi3: 'Mit Hoodie',
      kombi4: 'Warm + Kette',
      kombi5: 'Spitzen-Top + Lederhose',
      kombi6: 'Body + Lederhose',
      kombi7: 'Mit Mütze + Tuch',
      kombi8: 'Mit Handschuhen + Kette',
    },
    farben: 'Schwarz',
    anmerkung:
      'Die Hose kostet allein 24,99 € und steckt in jeder Kombination. Der Look ist ohne sie nicht dieser Look.',
  },
  {
    id: 'sexy',
    titel: 'Sexy',
    claim: 'Eine Schulter frei, Stoff statt Leder',
    beschreibung:
      'Der ruhigste Look im Plan. Weicher Rock, kein Reißverschluss, ein Schal als einziges Accessoire.',
    stufen: {
      kombi1: ['one_shoulder', 'gewebter_minirock', 'overknee'],
      kombi2: ['one_shoulder', 'gewebter_minirock', 'schal'],
      kombi3: ['one_shoulder', 'gewebter_minirock', 'overknee', 'schal'],
      kombi4: ['one_shoulder', 'gewebter_minirock', 'overknee', 'hoodie_schwarz'],
      kombi5: ['one_shoulder', 'midi_spitze', 'overknee'],
      kombi6: ['one_shoulder', 'minirock_enger', 'overknee'],
      kombi7: ['one_shoulder', 'gewebter_minirock', 'overknee', 'kette_klein', 'armband'],
      kombi8: ['one_shoulder', 'gewebter_minirock', 'overknee', 'hoodie_warm'],
    },
    labels: {
      kombi1: 'One Shoulder + Rock',
      kombi2: 'Mit Schal',
      kombi3: 'Rock + Schal',
      kombi4: 'Mit Hoodie',
      kombi5: 'Mit Midirock',
      kombi6: 'Mit engem Rock',
      kombi7: 'Mit Schmuck',
      kombi8: 'Warm',
    },
    farben: 'Schwarz',
    anmerkung:
      'Funktioniert auch ohne Accessoires — die beste Basis, falls du nichts findest, das passt.',
  },
  {
    id: 'sexy-baddie',
    titel: 'Sexy-Baddie',
    claim: 'Ein Kleid, Sport-Top drüber',
    beschreibung:
      'Das Minikleid trägt die Basis, das Sport-Top sitzt darüber und macht den Look sportlicher statt braver.',
    stufen: {
      kombi1: ['minikleid_figurbetont', 'sport_top', 'strumpfhosen'],
      kombi2: ['minikleid_figurbetont', 'sport_top', 'strumpfhosen', 'armband', 'stirnband'],
      kombi3: ['minikleid_figurbetont', 'sport_top', 'strumpfhosen', 'hoodie_schwarz'],
      kombi4: ['minikleid_figurbetont', 'sport_top', 'strumpfhosen', 'hoodie_warm', 'kette_klein'],
      kombi5: ['minikleid_figurbetont', 'strumpfhosen', 'kette_gross'],
      kombi6: ['minikleid_figurbetont', 'sport_top', 'overknee'],
      kombi7: ['minikleid_figurbetont', 'sport_top', 'strumpfhosen', 'handschuhe'],
      kombi8: ['minikleid_figurbetont', 'sport_top', 'strumpfhosen', 'tuch', 'kette_klein'],
    },
    labels: {
      kombi1: 'Kleid + Sport-Top',
      kombi2: 'Mit Schmuck + Stirnband',
      kombi3: 'Mit Hoodie',
      kombi4: 'Warm + Kette',
      kombi5: 'Kleid pur',
      kombi6: 'Mit Overknees',
      kombi7: 'Mit Handschuhen',
      kombi8: 'Mit Tuch + Kette',
    },
    farben: 'Schwarz',
    anmerkung:
      'Billigster Einstieg in den Plan: ohne Hoodie liegen hier nur 37,97 € auf dem Tisch. Mit Hoodie rückt der Look an die 70-€-Grenze.',
  },
  {
    id: 'leder-biker',
    titel: 'Leder-Biker',
    claim: 'Kunstlederjacke, Nieten, enger Rock',
    beschreibung:
      'Die Jacke ist mit 39,99 € das teuerste Einzelteil und entscheidet, ob dieser Look aufgeht. Ohne sie fehlt ihm die Mitte.',
    stufen: {
      kombi1: ['lederjacke_biker', 'minirock_enger', 'tshirt_spitze'],
      kombi2: ['lederjacke_biker', 'minirock_enger', 'spitzenbody'],
      kombi3: ['lederjacke_biker', 'kunstleder_rock', 'tshirt_spitze'],
      kombi4: ['lederjacke_biker', 'kunstleder_rock', 'spitzenbody'],
      kombi5: ['lederjacke_biker', 'gewebter_minirock', 'tshirt_figurbetont'],
      kombi6: ['lederjacke_biker', 'minirock_enger', 'tshirt_figurbetont', 'strumpfhosen'],
      kombi7: ['lederjacke_biker', 'minirock_enger', 'tshirt_spitze', 'kette_klein'],
      kombi8: ['lederjacke_biker', 'minirock_enger', 'tshirt_figurbetont', 'muetze'],
    },
    labels: {
      kombi1: 'Jacke + enger Rock + Spitzen-Top',
      kombi2: 'Jacke + enger Rock + Body',
      kombi3: 'Jacke + Lederrock + Spitzen-Top',
      kombi4: 'Jacke + Lederrock + Body',
      kombi5: 'Jacke + Stoffrock',
      kombi6: 'Jacke + Rock + Strumpfhosen',
      kombi7: 'Mit Kette',
      kombi8: 'Mit Mütze',
    },
    farben: 'Schwarz',
    anmerkung:
      'Die Jacke kostet 39,99 € und steckt in jeder Kombination — sie frisst fast das halbe Budget. Deshalb bleiben die Kombinationen schlank, damit die 70 € halten.',
  },
  {
    id: 'neglige',
    titel: 'Negligé',
    claim: 'Halbtransparent, Kimono drüber',
    beschreibung:
      'Die weichste Variante im Plan. Der Negligé ist das Hauptteil, der Kimono liegt offen darüber und verdeckt nichts.',
    stufen: {
      kombi1: ['negligee', 'kimono', 'body_cutout'],
      kombi2: ['negligee', 'kimono', 'body_cutout', 'ohrwaermer'],
      kombi3: ['negligee', 'kimono', 'body_cutout', 'hoodie_schwarz'],
      kombi4: ['negligee', 'kimono', 'body_cutout', 'hoodie_warm', 'kette_klein'],
      kombi5: ['negligee', 'kimono', 'strumpfhosen'],
      kombi6: ['negligee', 'kimono', 'body_cutout', 'handschuhe'],
      kombi7: ['negligee', 'kimono', 'body_cutout', 'kette_gross', 'armband'],
      kombi8: ['negligee', 'kimono', 'overknee'],
    },
    labels: {
      kombi1: 'Negligé + Kimono + Body',
      kombi2: 'Mit Ohrwärmer',
      kombi3: 'Mit Hoodie',
      kombi4: 'Warm + Kette',
      kombi5: 'Negligé + Kimono',
      kombi6: 'Mit Handschuhen',
      kombi7: 'Mit Schmuck',
      kombi8: 'Mit Overknees',
    },
    farben: 'Schwarz, halbtransparent',
    anmerkung:
      'Hier ist die Sichtbarkeit Absicht, nicht Risiko: das Negligé bleibt unter dem Kimono halbtransparent, der Cut-Out-Body darunter gibt nur Halt.',
  },
  {
    id: 'burlesque',
    titel: 'Burlesque',
    claim: 'Showgirl, Spitze, Midirock',
    beschreibung:
      'Der Midirock mit Spitze ist das Ankerstück, dazu zwei gestapelte Langarmshirts. Der teuerste Ball-Look im Plan — und trotzdem unter 70 €.',
    stufen: {
      kombi1: ['midi_spitze', 'langarmshirt_spitze', 'langarmshirt_cutout'],
      kombi2: ['midi_spitze', 'langarmshirt_spitze', 'langarmshirt_cutout', 'kette_gross'],
      kombi3: ['midi_spitze', 'langarmshirt_spitze', 'langarmshirt_cutout', 'hoodie_schwarz'],
      kombi4: ['midi_spitze', 'langarmshirt_spitze', 'langarmshirt_cutout', 'hoodie_warm', 'kette_klein'],
      kombi5: ['midi_spitze', 'langarmshirt_spitze', 'strumpfhosen'],
      kombi6: ['midi_spitze', 'langarmshirt_cutout', 'strumpfhosen'],
      kombi7: ['midi_spitze', 'langarmshirt_spitze', 'langarmshirt_cutout', 'handschuhe'],
      kombi8: ['midi_spitze', 'langarmshirt_spitze', 'langarmshirt_cutout', 'kette_gross', 'armband'],
    },
    labels: {
      kombi1: 'Midirock + zwei Langarmshirts',
      kombi2: 'Mit Kette',
      kombi3: 'Mit Hoodie',
      kombi4: 'Warm + Kette',
      kombi5: 'Midirock + Spitzen-Top',
      kombi6: 'Midirock + Cut-Out',
      kombi7: 'Mit Handschuhen',
      kombi8: 'Mit Schmuck',
    },
    farben: 'Schwarz, Spitze',
    anmerkung:
      'Zwei Langarmshirts gestapelt: das Cut-Out-Teil darunter, das Spitzen-Oberteil darüber. Die große Kette kommt nur in Kombination 2 und 8 dazu.',
  },
]

export const STIL_INDEX: Record<Stil, StilDef> = Object.fromEntries(
  STILE.map((stil) => [stil.id, stil]),
) as Record<Stil, StilDef>

export function varianteLabel(stil: Stil, variante: Variante): string {
  return STIL_INDEX[stil].labels[variante]
}

export const url = (produktId: string) =>
  `https://app.newyorker.de/share/product/${produktId}/001?country=de`

/** Produktseite eines Teils — eigener Link (z. B. Calzedonia) oder NEW-YORKER-Share-URL */
export const produktUrl = (teil: Produkt) => teil.link ?? url(teil.produktId)

// — Live-Preise (per /api/preise vom Server geholt) ————————————————
export type LivePreis = {
  preis: number
  statt?: number
  sale: boolean
  waehrung?: string
  quelle?: string
  geprueft?: string
}

let LIVE: Record<string, LivePreis> = {}

export function setLivePreise(daten: Record<string, LivePreis> | null | undefined) {
  LIVE = daten ?? {}
}

/** Live-Datensatz eines Teils (keyed nach produktId), falls vorhanden */
export function livePreisFuer(teil: Produkt): LivePreis | undefined {
  return LIVE[teil.produktId]
}

/** Zahlungspreis: Live-Wert, sonst der eingetragene statische Preis */
export function preisVon(teil: Produkt): number {
  return LIVE[teil.produktId]?.preis ?? teil.preis
}

export function teileFuer(stil: Stil, variante: Variante): Produkt[] {
  return STIL_INDEX[stil].stufen[variante].map((id) => PRODUKTE[id]).filter(Boolean)
}

export function einkaufsliste(): { teil: Produkt; stile: Stil[] }[] {
  const treffer = new Map<string, Stil[]>()
  for (const stil of STILE) {
    for (const ids of Object.values(stil.stufen)) {
      for (const id of ids) {
        treffer.set(id, [...(treffer.get(id) ?? []), stil.id])
      }
    }
  }
  return [...treffer.entries()]
    .map(([id, stile]) => ({ teil: PRODUKTE[id], stile: [...new Set(stile)] }))
    .sort((a, b) => a.teil.preis - b.teil.preis)
}

export const EINKAUF = einkaufsliste()

export const einkaufSumme = EINKAUF.reduce((s, e) => s + e.teil.preis, 0)

export type Laden = {
  key: string
  name: string
  lageplan: string
}

const sternCenter = (location: string) =>
  `https://www.stern-center-potsdam.de/service/centerplan/lageplan/?location=${location}`

export const LAEDEN: Record<string, Laden> = {
  newyorker: { key: 'newyorker', name: 'NEW YORKER', lageplan: sternCenter('42192') },
  hm: { key: 'hm', name: 'H&M', lageplan: sternCenter('42138') },
  ca: { key: 'ca', name: 'C&A', lageplan: sternCenter('40899') },
  calzedonia: { key: 'calzedonia', name: 'Calzedonia', lageplan: sternCenter('199662') },
  bijou: { key: 'bijou', name: 'Bijou Brigitte', lageplan: sternCenter('40323') },
  fastforward: { key: 'fastforward', name: 'Fast Forward', lageplan: sternCenter('41142') },
  intimissimi: { key: 'intimissimi', name: 'Intimissimi', lageplan: sternCenter('231104') },
}

// Ersatzladen derselben Kategorie, falls NEW YORKER das Teil nicht führt
const LADEN_ERSETZ: Record<string, keyof typeof LAEDEN> = {
  spitzenbody: 'hm',
  langarmshirt_drapiert: 'hm',
  tshirt_figurbetont: 'hm',
  one_shoulder: 'hm',
  minikleid_figurbetont: 'hm',
  body_cutout: 'hm',
  langarmshirt_cutout: 'hm',
  langarmshirt_spitze: 'hm',
  tshirt_spitze: 'hm',
  sport_top: 'hm',
  hoodie_schwarz: 'fastforward',
  hoodie_warm: 'fastforward',
  muetze: 'fastforward',
  cap_neu: 'fastforward',
  stirnband: 'fastforward',
  ohrwaermer: 'fastforward',
  kunstleder_rock: 'ca',
  skort_schwarz: 'ca',
  kunstleder_hose: 'ca',
  gewebter_minirock: 'ca',
  minirock_enger: 'ca',
  midi_spitze: 'ca',
  lederjacke_biker: 'ca',
  schal: 'ca',
  tuch: 'ca',
  taillenguertel: 'ca',
  guertel: 'ca',
  handschuhe: 'ca',
  strumpfhosen: 'calzedonia',
  overknee: 'calzedonia',
  kette_klein: 'bijou',
  kette_gross: 'bijou',
  armband: 'bijou',
  negligee: 'intimissimi',
  kimono: 'intimissimi',
}

// Primärladen pro Produkt, wenn er nicht NEW YORKER ist
const LADEN_PRIMAR: Record<string, keyof typeof LAEDEN> = {
  netz_strumpfhose: 'calzedonia',
  fischernetz: 'calzedonia',
}

export function ladenFuer(produktKey: string): { primar: Laden; ersatz?: Laden } {
  const ersatz = LADEN_ERSETZ[produktKey]
  const primar = LADEN_PRIMAR[produktKey]
  return {
    primar: primar ? LAEDEN[primar] : LAEDEN.newyorker,
    ersatz: ersatz ? LAEDEN[ersatz] : undefined,
  }
}

export const PACKLISTE = [
  { text: 'Strumpfhosen und ein Paar Ersatzsocken', ok: false },
  { text: 'Spiegel, Haargummi, Kamm', ok: false },
  { text: 'Deo, Notfall-Tampon, Pflaster', ok: false },
  { text: 'Ladekabel und Powerbank für den Rückweg', ok: false },
  { text: 'Regenschirm — Ende Oktober in Potsdam', ok: false },
  { text: 'Gold-Schmuck, den du tragen willst', ok: false },
]

export const SCHUHE = {
  marke: 'Onewus',
  modell: 'Kniehochschuhe, schwarz',
  produktId: 'B07K561YWF',
  preis: 0,
  groesse: 46,
  url: 'https://www.amazon.de/dp/B07K561YWF',
  bild: 'stiefel.jpg',
  bildQuelle: 'https://www.amazon.de/dp/B07K561YWF',
  notiz: 'Bereits vorhanden, kostet nichts — deshalb nirgends eingerechnet.',
}

export const MAKEUP = [
  { text: 'Goldener Lidschatten am Lid', ok: false },
  { text: 'Schwarzer Wimpernkohl', ok: false },
  { text: 'Konturierung Wangen und Nase', ok: false },
  { text: 'Lippenstift schwarz oder dunkelrot', ok: false },
  { text: 'Fixier-Spray', ok: false },
]

export const SHOPS = [
  {
    name: 'Stern-Center Potsdam',
    strasse: 'Stern-Center 1–10',
    ort: '14480 Potsdam',
    note: 'Mehrere NEW-YORKER-Flächen, Preise vor Ort vergleichen.',
  },
  {
    name: 'Bahnhofspassagen',
    strasse: 'Friedrich-Ebert-Straße',
    ort: '14467 Potsdam',
    note: 'Nur wenn es im Stern-Center nichts Passendes gibt.',
  },
]
