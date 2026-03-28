export interface Venue {
  key: string;
  name: string;
  emoji: string;
  type: 'dinner' | 'bottle';
  category: string;
  neighborhood: string;
  zone: string;
  description: string;
  tags: string[];
  avgSpendPerPerson?: number;
  minPartySpend?: number;
  avgSpendPerTable?: number;
  minTableSpend?: number;
  email: string;
  phone: string;
  commissionType: 'dinner' | 'bottle';
}

export const VENUES: Record<string, Venue> = {
  pujol: { key: 'pujol', name: 'Pujol', emoji: '🌮', type: 'dinner', category: 'Contemporary Mexican · Fine Dining', neighborhood: 'Polanco', zone: 'polanco', description: "Enrique Olvera's flagship. One of Latin America's top 5 restaurants. Tasting menus only, legendary mole madre.", tags: ['michelin', 'tasting menu', 'iconic', 'polanco'], avgSpendPerPerson: 180, minPartySpend: 720, email: 'reservaciones@pujol.com.mx', phone: '+52 55 5545 4111', commissionType: 'dinner' },
  quintonil: { key: 'quintonil', name: 'Quintonil', emoji: '🌿', type: 'dinner', category: 'Contemporary Mexican · Fine Dining', neighborhood: 'Polanco', zone: 'polanco', description: "Jorge Vallejo's celebrated restaurant, consistently ranked top 10 globally. Seasonal, ingredient-driven.", tags: ['world top 10', 'seasonal', 'polanco', "chef's table"], avgSpendPerPerson: 160, minPartySpend: 640, email: 'reservas@quintonil.com', phone: '+52 55 5280 2680', commissionType: 'dinner' },
  contramar: { key: 'contramar', name: 'Contramar', emoji: '🦞', type: 'dinner', category: 'Seafood · Power Lunch', neighborhood: 'Roma Norte', zone: 'roma', description: 'Iconic Mexico City seafood institution. The tuna tostadas and red-and-green snapper are legendary.', tags: ['seafood', 'power lunch', 'iconic', 'roma'], avgSpendPerPerson: 90, minPartySpend: 360, email: 'reservaciones@contramar.com.mx', phone: '+52 55 5514 9217', commissionType: 'dinner' },
  meridiem: { key: 'meridiem', name: 'Meridiem', emoji: '✨', type: 'dinner', category: 'Contemporary · Rooftop · Fine Dining', neighborhood: 'Polanco', zone: 'polanco', description: 'Stunning rooftop dining in the heart of Polanco. Modern Mexican with exceptional wine list and panoramic city views.', tags: ['rooftop', 'views', 'polanco', 'contemporary'], avgSpendPerPerson: 130, minPartySpend: 520, email: 'events@meridiem.mx', phone: '+52 55 7589 0100', commissionType: 'dinner' },
  dulce_patria: { key: 'dulce_patria', name: 'Dulce Patria', emoji: '🌸', type: 'dinner', category: 'Contemporary Mexican · Boutique', neighborhood: 'Polanco', zone: 'polanco', description: "Martha Ortiz's visually stunning restaurant inside Las Alcobas hotel. Mexican haute cuisine with a theatrical, artistic touch.", tags: ['boutique hotel', 'artistic', 'polanco', 'mexican'], avgSpendPerPerson: 120, minPartySpend: 480, email: 'dining@lasalcobasmexico.com', phone: '+52 55 3300 3900', commissionType: 'dinner' },
  rosetta: { key: 'rosetta', name: 'Rosetta', emoji: '🌹', type: 'dinner', category: 'Italian-Mexican · Elena Reygadas', neighborhood: 'Roma Norte', zone: 'roma', description: "Elena Reygadas' acclaimed restaurant in a restored mansion. Latin America's best female chef. Italian-influenced with Mexican soul.", tags: ['james beard', 'roma', 'italian-mexican', 'heritage building'], avgSpendPerPerson: 110, minPartySpend: 440, email: 'contacto@rosetta.com.mx', phone: '+52 55 5533 7804', commissionType: 'dinner' },
  biko: { key: 'biko', name: 'Biko', emoji: '🇪🇸', type: 'dinner', category: 'Basque-Mexican Fusion · Fine Dining', neighborhood: 'Polanco', zone: 'polanco', description: "Mikel Alonso and Bruno Oteiza's celebrated Basque-Mexican restaurant. Creative tasting menus in an elegant setting.", tags: ['basque', 'polanco', 'tasting menu', 'wine pairing'], avgSpendPerPerson: 150, minPartySpend: 600, email: 'reservaciones@biko.com.mx', phone: '+52 55 5282 2064', commissionType: 'dinner' },
  loup_bar: { key: 'loup_bar', name: 'Loup Bar', emoji: '🍷', type: 'dinner', category: 'Wine Bar · Small Plates', neighborhood: 'Condesa', zone: 'condesa', description: "Buzzing natural wine bar and small plates restaurant beloved by Mexico City's creative elite.", tags: ['wine bar', 'condesa', 'natural wine', 'small plates'], avgSpendPerPerson: 75, minPartySpend: 300, email: 'hello@loupbar.mx', phone: '+52 55 5211 5550', commissionType: 'dinner' },
  hyde_polanco: { key: 'hyde_polanco', name: 'Hyde Club Polanco', emoji: '🥂', type: 'bottle', category: 'Nightclub · Bottle Service', neighborhood: 'Polanco', zone: 'polanco', description: "Upscale nightclub in the heart of Polanco. Premier bottle service, international DJs, VIP tables.", tags: ['vip', 'bottle service', 'polanco', 'nightclub', 'dj'], avgSpendPerTable: 2500, minTableSpend: 2000, email: 'reservas@hydepolanco.com', phone: '+52 55 5280 4444', commissionType: 'bottle' },
  white: { key: 'white', name: 'White CDMX', emoji: '🪩', type: 'bottle', category: 'Nightclub · Electronic · Bottle Service', neighborhood: 'Lomas de Chapultepec', zone: 'lomas', description: 'Iconic Mexico City nightclub. Top-tier electronic music, massive production, full VIP bottle service.', tags: ['electronic', 'vip', 'lomas', 'bottle service'], avgSpendPerTable: 3000, minTableSpend: 2500, email: 'vip@whitecdmx.com', phone: '+52 55 5520 7900', commissionType: 'bottle' },
  onyx: { key: 'onyx', name: 'Onyx Club', emoji: '💎', type: 'bottle', category: 'Nightclub · Latin · Bottle Service', neighborhood: 'Santa Fe', zone: 'santa_fe', description: "Santa Fe's premier VIP lounge and nightclub. Latin and urban music, private VIP areas.", tags: ['latin', 'santa fe', 'vip lounge', 'bottle service'], avgSpendPerTable: 2000, minTableSpend: 1500, email: 'vip@onyxcdmx.com', phone: '+52 55 2591 3300', commissionType: 'bottle' },
  patron: { key: 'patron', name: 'Patrón Sports Bar & Club', emoji: '🏆', type: 'bottle', category: 'Sports Bar · Nightclub · Bottle Service', neighborhood: 'Polanco', zone: 'polanco', description: 'Upscale sports bar with full nightclub transformation. Bottle service, popular with corporate groups.', tags: ['sports bar', 'polanco', 'corporate', 'bottle service'], avgSpendPerTable: 1800, minTableSpend: 1500, email: 'reservas@patronpolanco.mx', phone: '+52 55 5545 2200', commissionType: 'bottle' },
  bar_mil: { key: 'bar_mil', name: 'Bar Mil', emoji: '🎶', type: 'bottle', category: 'Cocktail Bar · Live Music · Upscale', neighborhood: 'Condesa', zone: 'condesa', description: "Sophisticated cocktail bar with live jazz and curated spirits.", tags: ['jazz', 'cocktails', 'condesa', 'live music'], avgSpendPerTable: 800, minTableSpend: 600, email: 'reservas@barmil.mx', phone: '+52 55 5211 0703', commissionType: 'bottle' },
  babel: { key: 'babel', name: 'Babel Rooftop Bar', emoji: '🌃', type: 'bottle', category: 'Rooftop Bar · Bottle Service · Views', neighborhood: 'Centro Histórico', zone: 'centro', description: 'Stunning rooftop bar atop a historic building in Centro. Sweeping views, craft cocktails.', tags: ['rooftop', 'centro', 'views', 'bottle service'], avgSpendPerTable: 1200, minTableSpend: 900, email: 'reservas@babelrooftop.mx', phone: '+52 55 5510 2200', commissionType: 'bottle' },
};

export function getVenuesByType(type?: string, zone?: string): Venue[] {
  return Object.values(VENUES).filter(
    (v) => (!type || v.type === type) && (!zone || v.zone === zone || zone === 'any')
  );
}

export function getVenueByKey(key: string): Venue | null {
  return VENUES[key] || null;
}
