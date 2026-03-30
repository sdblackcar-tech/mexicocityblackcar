export interface VehicleType {
  label: string;
  pax: string;
  perMile: number;
  hourly: number;
  minHours: number;
  aicm: number;
  aifa: number;
  luxury: boolean;
  extraStop: number;
}

export const VEHICLES: Record<string, VehicleType> = {
  sedan:   { label: 'Executive Sedan',    pax: '1–3',   perMile: 3.50, hourly: 65,  minHours: 3, aicm: 85,  aifa: 145, luxury: false, extraStop: 25 },
  suv:     { label: 'Premium SUV',        pax: '1–6',   perMile: 5.50, hourly: 95,  minHours: 3, aicm: 115, aifa: 195, luxury: false, extraStop: 25 },
  van:     { label: 'Executive Sprinter', pax: '7–12',  perMile: 7.00, hourly: 125, minHours: 3, aicm: 145, aifa: 245, luxury: false, extraStop: 25 },
  minibus: { label: 'Mini Coach',         pax: '13–20', perMile: 9.00, hourly: 165, minHours: 4, aicm: 195, aifa: 295, luxury: false, extraStop: 25 },
  bus:     { label: 'Luxury Coach',       pax: '21–40', perMile: 12.0, hourly: 220, minHours: 4, aicm: 265, aifa: 395, luxury: false, extraStop: 25 },
  luxury:  { label: 'Ultra-Luxury',       pax: '1–3',   perMile: 6.50, hourly: 150, minHours: 3, aicm: 165, aifa: 285, luxury: true,  extraStop: 25 },
};

export const ADDONS = {
  greeter: 45,
  extraStop: 25,
  waitPerMin: 1.5,
  meetGreet: 35,
};

export interface QuoteParams {
  vehicleKey: string;
  serviceType: 'hourly' | 'transfer' | 'airport_aicm' | 'airport_aifa' | 'airport';
  hours?: number;
  miles?: number;
  greeters?: number;
  extraStops?: number;
  waitMinutes?: number;
}

export interface Quote {
  vehicle: string;
  vehicleKey: string;
  pax: string;
  luxury: boolean;
  total: number;
  label: string;
  confNum: string;
  params: QuoteParams;
}

export function buildQuote(p: QuoteParams): Quote | null {
  const v = VEHICLES[p.vehicleKey];
  if (!v) return null;
  let total = 0;
  let label = '';

  const h = p.hours || 0;
  const m = p.miles || 0;
  const g = p.greeters || 0;
  const es = p.extraStops || 0;
  const wm = p.waitMinutes || 0;

  if (p.serviceType === 'hourly') {
    const hrs = Math.max(h, v.minHours);
    total = hrs * v.hourly;
    label = `${hrs}hr Hourly Service`;
  } else if (p.serviceType === 'transfer') {
    total = m * v.perMile;
    label = `Point-to-Point Transfer · ~${m} mi`;
  } else if (p.serviceType === 'airport_aicm' || p.serviceType === 'airport') {
    total = v.aicm;
    label = 'Airport Transfer — AICM';
  } else if (p.serviceType === 'airport_aifa') {
    total = v.aifa;
    label = 'Airport Transfer — AIFA';
  }

  if (g) total += g * ADDONS.greeter;
  if (es) total += es * ADDONS.extraStop;
  if (wm) total += wm * ADDONS.waitPerMin;

  const confNum = 'MCBC-' + Date.now().toString(36).toUpperCase();

  return {
    vehicle: v.label,
    vehicleKey: p.vehicleKey,
    pax: v.pax,
    luxury: v.luxury,
    total: parseFloat(total.toFixed(2)),
    label,
    confNum,
    params: p,
  };
}

export const CDMX_DISTANCES: Record<string, number> = {
  'aicm-polanco': 12, 'aicm-santafe': 18, 'aicm-lomas': 13, 'aicm-roma': 10,
  'aicm-condesa': 10, 'aicm-centro': 8, 'aicm-pedregal': 20, 'aicm-interlomas': 25,
  'aicm-satelite': 28, 'aicm-tlalpan': 22, 'aicm-xochimilco': 18, 'aicm-coyoacan': 14,
  'aicm-insurgentes': 10,
  'aifa-polanco': 32, 'aifa-santafe': 38, 'aifa-lomas': 33, 'aifa-roma': 30,
  'aifa-condesa': 30, 'aifa-centro': 28, 'aifa-pedregal': 40, 'aifa-interlomas': 35,
  'aifa-satelite': 22, 'aifa-tlalpan': 45, 'aifa-xochimilco': 42, 'aifa-coyoacan': 38,
  'aifa-insurgentes': 30,
  'polanco-santafe': 9, 'polanco-pedregal': 11, 'polanco-condesa': 4,
  'polanco-roma': 5, 'polanco-centro': 8,
};

export function lookupDistance(from: string, to: string): number | null {
  const f = from.toLowerCase().trim().replace(/\s+/g, '');
  const t = to.toLowerCase().trim().replace(/\s+/g, '');
  return CDMX_DISTANCES[`${f}-${t}`] || CDMX_DISTANCES[`${t}-${f}`] || null;
}
