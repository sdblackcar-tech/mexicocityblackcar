export interface Venue {
  id: string;
  name: string;
  emoji: string;
  type: 'dinner' | 'nightlife';
  category: string;
  zone: string;
  tier: 'ultra' | 'premium' | 'mid';
  email: string;
  commission: number;
  avgSpend: number;
  description: string;
  tags: string[];
  phone?: string;
}

export const VENUES: { dinner: Venue[]; nightlife: Venue[] } = {
  dinner: [
    { id: 'pujol', name: 'Pujol', emoji: '🌮', type: 'dinner', category: 'Contemporary Mexican · Fine Dining', zone: 'Polanco', tier: 'ultra', email: 'reservaciones@pujol.com.mx', commission: 0.05, avgSpend: 180, description: "Enrique Olvera's flagship. One of Latin America's top 5 restaurants.", tags: ['michelin', 'tasting menu', 'iconic'], phone: '+52 55 5545 4111' },
    { id: 'quintonil', name: 'Quintonil', emoji: '🌿', type: 'dinner', category: 'Contemporary Mexican · Fine Dining', zone: 'Polanco', tier: 'ultra', email: 'info@quintonil.com', commission: 0.05, avgSpend: 150, description: "Jorge Vallejo's celebrated restaurant, consistently ranked top 10 globally.", tags: ['world top 10', 'seasonal', 'polanco'], phone: '+52 55 5280 2680' },
    { id: 'contramar', name: 'Contramar', emoji: '🦞', type: 'dinner', category: 'Seafood · Power Lunch', zone: 'Roma Norte', tier: 'premium', email: 'reservas@contramar.com.mx', commission: 0.05, avgSpend: 80, description: 'Iconic Mexico City seafood institution. Legendary tuna tostadas.', tags: ['seafood', 'power lunch', 'roma'], phone: '+52 55 5514 9217' },
    { id: 'dulce_patria', name: 'Dulce Patria', emoji: '🌸', type: 'dinner', category: 'Contemporary Mexican · Boutique', zone: 'Polanco', tier: 'premium', email: 'info@dulcepatria.com.mx', commission: 0.05, avgSpend: 90, description: "Martha Ortiz's visually stunning restaurant. Mexican haute cuisine.", tags: ['boutique', 'artistic', 'polanco'], phone: '+52 55 3300 3900' },
    { id: 'biko', name: 'Biko', emoji: '🇪🇸', type: 'dinner', category: 'Basque-Mexican Fusion · Fine Dining', zone: 'Polanco', tier: 'ultra', email: 'reservas@biko.com.mx', commission: 0.05, avgSpend: 160, description: "Mikel Alonso and Bruno Oteiza's celebrated Basque-Mexican restaurant.", tags: ['basque', 'tasting menu', 'wine pairing'], phone: '+52 55 5282 2064' },
    { id: 'maximo', name: 'Máximo Bistrot', emoji: '🍽️', type: 'dinner', category: 'Farm-to-Table · Bistro', zone: 'Roma Norte', tier: 'premium', email: 'info@maximobistrot.com.mx', commission: 0.05, avgSpend: 70, description: 'Market-driven bistro with ever-changing seasonal menu.', tags: ['farm-to-table', 'roma', 'seasonal'] },
    { id: 'rokai', name: 'Rokai', emoji: '🍣', type: 'dinner', category: 'Japanese · Omakase', zone: 'Polanco', tier: 'premium', email: 'reservas@rokai.com.mx', commission: 0.05, avgSpend: 85, description: 'Intimate omakase experience in Polanco.', tags: ['japanese', 'omakase', 'polanco'] },
    { id: 'lardo', name: 'Lardo', emoji: '🥖', type: 'dinner', category: 'Italian-Mexican · Casual Fine', zone: 'Condesa', tier: 'premium', email: 'info@lardo.mx', commission: 0.05, avgSpend: 65, description: 'Beloved Condesa spot with Italian-inflected Mexican cooking.', tags: ['condesa', 'italian', 'casual fine'] },
  ],
  nightlife: [
    { id: 'bar_americano', name: 'Bar Americano', emoji: '🥃', type: 'nightlife', category: 'Cocktail Bar · Ultra VIP', zone: 'Polanco', tier: 'ultra', email: 'reservas@baramericano.mx', commission: 0.07, avgSpend: 300, description: 'Polanco\'s most exclusive cocktail destination.', tags: ['vip', 'cocktails', 'polanco'] },
    { id: 'living_w', name: 'Living (W Hotel)', emoji: '🪩', type: 'nightlife', category: 'Nightclub · VIP', zone: 'Polanco', tier: 'ultra', email: 'living@whotels.com.mx', commission: 0.07, avgSpend: 400, description: 'The W Hotel\'s premier nightclub experience.', tags: ['hotel', 'nightclub', 'vip'] },
    { id: 'condesa_df', name: 'Condesa DF Rooftop', emoji: '🌃', type: 'nightlife', category: 'Rooftop Bar · Boutique', zone: 'Condesa', tier: 'premium', email: 'bar@condesadf.com', commission: 0.07, avgSpend: 200, description: 'Iconic rooftop bar with panoramic Condesa views.', tags: ['rooftop', 'condesa', 'views'] },
    { id: 'baltra', name: 'Baltra Bar', emoji: '🍹', type: 'nightlife', category: 'Cocktail Bar · Craft', zone: 'Condesa', tier: 'premium', email: 'info@baltrabar.com', commission: 0.07, avgSpend: 180, description: 'Award-winning craft cocktail bar in Condesa.', tags: ['cocktails', 'condesa', 'craft'] },
    { id: 'gin_gin', name: 'Gin Gin', emoji: '🫒', type: 'nightlife', category: 'Gin Bar · Lounge', zone: 'Roma Norte', tier: 'mid', email: 'info@ginginbar.mx', commission: 0.07, avgSpend: 150, description: 'Curated gin experience in the heart of Roma.', tags: ['gin', 'roma', 'lounge'] },
    { id: 'parker', name: 'Parker & Lenox', emoji: '🎩', type: 'nightlife', category: 'Speakeasy · Ultra VIP', zone: 'Polanco', tier: 'ultra', email: 'reservas@parkerandlenox.com', commission: 0.07, avgSpend: 350, description: 'Prohibition-era speakeasy with ultra-exclusive access.', tags: ['speakeasy', 'polanco', 'ultra vip'] },
  ],
};

export function getVenueById(id: string): Venue | undefined {
  return [...VENUES.dinner, ...VENUES.nightlife].find(v => v.id === id);
}

export function getVenuesByType(type?: 'dinner' | 'nightlife' | 'both'): Venue[] {
  if (type === 'both' || !type) return [...VENUES.dinner, ...VENUES.nightlife];
  return type === 'dinner' ? VENUES.dinner : VENUES.nightlife;
}

// Legacy compatibility
export function getVenueByKey(key: string): Venue | undefined {
  return getVenueById(key);
}
