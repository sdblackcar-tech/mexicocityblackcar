export interface VehicleType {
  label: string;
  hourly: number;
  hourlyMin: number;
  perMile: number | null;
  transferMin: number | null;
  extraStop: number | null;
  luxury: boolean;
  hourlyOnly: boolean;
}

export const VEHICLES: Record<string, VehicleType> = {
  sedan:        { label: 'Executive Sedan',  hourly: 90,  hourlyMin: 4, perMile: 4.00, transferMin: 80,  extraStop: 10, luxury: false, hourlyOnly: false },
  luxury_sedan: { label: 'Luxury Sedan',     hourly: 108, hourlyMin: 4, perMile: 4.80, transferMin: 96,  extraStop: 12, luxury: true,  hourlyOnly: false },
  suv:          { label: 'Executive SUV',    hourly: 110, hourlyMin: 4, perMile: 4.50, transferMin: 110, extraStop: 15, luxury: false, hourlyOnly: false },
  luxury_suv:   { label: 'Luxury SUV',       hourly: 132, hourlyMin: 4, perMile: 5.40, transferMin: 132, extraStop: 18, luxury: true,  hourlyOnly: false },
  sprinter:     { label: 'Premium Sprinter', hourly: 199, hourlyMin: 4, perMile: 10.0, transferMin: 425, extraStop: 45, luxury: false, hourlyOnly: false },
  armored:      { label: 'Armored Escalade', hourly: 399, hourlyMin: 4, perMile: null, transferMin: null, extraStop: null, luxury: false, hourlyOnly: true },
};

export const GREETER_FEE = 60;
export const WAIT_TIME_INCREMENT = 15;

export interface QuoteParams {
  vehicleKey: string;
  serviceType: 'hourly' | 'transfer' | 'airport';
  hours?: number;
  miles?: number;
  greeters?: number;
  extraStops?: number;
  waitMinutes?: number;
}

export interface Quote {
  vehicle: string;
  luxury: boolean;
  total: number;
  params: QuoteParams;
}

export function buildQuote(p: QuoteParams): Quote | null {
  const v = VEHICLES[p.vehicleKey];
  if (!v) return null;
  let total = 0;
  if (p.serviceType === 'hourly') {
    total += Math.max(p.hours || v.hourlyMin, v.hourlyMin) * v.hourly;
  } else {
    total += v.hourlyOnly
      ? Math.max(p.hours || v.hourlyMin, v.hourlyMin) * v.hourly
      : Math.max((p.miles || 0) * (v.perMile || 0), v.transferMin || 0);
  }
  if ((p.greeters || 0) > 0) total += (p.greeters || 0) * GREETER_FEE;
  if ((p.extraStops || 0) > 0 && v.extraStop) total += (p.extraStops || 0) * v.extraStop;
  if ((p.waitMinutes || 0) > 0) {
    total += parseFloat((v.hourly / 4 * Math.ceil((p.waitMinutes || 0) / WAIT_TIME_INCREMENT)).toFixed(2));
  }
  return { vehicle: v.label, luxury: v.luxury, total: parseFloat(total.toFixed(2)), params: p };
}

export const CDMX_DISTANCES: Record<string, number> = {
  'aicm-polanco': 12, 'aicm-reforma': 11, 'aicm-condesa': 9, 'aicm-roma': 8,
  'aicm-santa fe': 18, 'aicm-pedregal': 14, 'aicm-lomas': 16, 'aicm-interlomas': 22,
  'aicm-tlalpan': 16, 'aicm-xochimilco': 18, 'aicm-centro': 7, 'aicm-narvarte': 7,
  'aicm-del valle': 9, 'aicm-coyoacan': 13, 'aicm-satelite': 24,
  'aifa-polanco': 38, 'aifa-reforma': 37, 'aifa-condesa': 39, 'aifa-santa fe': 42,
  'aifa-pedregal': 44, 'aifa-lomas': 40, 'aifa-centro': 34,
  'polanco-santa fe': 9, 'polanco-pedregal': 11, 'polanco-condesa': 4,
  'polanco-roma': 5, 'polanco-centro': 8, 'reforma-condesa': 3, 'reforma-santa fe': 11,
};

export function lookupDistance(from: string, to: string): number | null {
  const f = from.toLowerCase().trim();
  const t = to.toLowerCase().trim();
  return CDMX_DISTANCES[`${f}-${t}`] || CDMX_DISTANCES[`${t}-${f}`] || null;
}
