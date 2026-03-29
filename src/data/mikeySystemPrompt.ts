import { MIKEY_LANGS } from './mikeyConfig';
import { VEHICLES } from './mikeyPricing';
import { VENUES } from './mikeyVenues';

export const MIKEY_CONFIG = {
  COMPANY_NAME: 'Lux Tour Travel',
  COMPANY_PHONE: '+1 858 999 1895',
  COMPANY_WHATSAPP: '+1 858 999 1895',
  COMPANY_EMAIL: 'info@luxtourtravel.com',
  COMPANY_WEBSITE: 'luxtourtravel.com',
  IATA_NUMBER: 'YOUR_IATA_NUMBER',
  EMBARK_ACCOUNT: 'Embark Beyond',
  COMMISSION_BOTTLE: 0.07,
  COMMISSION_DINNER: 0.05,
};

export const TERMS_AND_CONDITIONS = `
LUX TOUR TRAVEL — TERMS & CONDITIONS

1. RESERVATIONS & CONFIRMATION
All reservations are confirmed upon receipt of payment. A booking confirmation will be sent to the email address provided. Lux Tour Travel reserves the right to substitute vehicles of equal or superior class when necessary.

2. PAYMENT
Full payment is required to confirm your reservation. We accept all major credit cards via our secure payment portal. Prices are quoted in USD and are subject to applicable taxes and fees.

3. CANCELLATION POLICY
• 72+ hours before service: Full refund
• 24–72 hours before service: 50% refund
• Less than 24 hours: Non-refundable
• No-show: Non-refundable
Cancellations must be submitted in writing to info@luxtourtravel.com.

4. WAIT TIME
• Domestic flights: 45 minutes complimentary wait time from actual landing
• International flights: 60 minutes complimentary from actual landing
• General pickups: 15 minutes complimentary
• Additional wait time is billed in 15-minute increments at the applicable vehicle rate

5. EXTRA STOPS
Additional stops beyond the quoted itinerary are subject to extra charges as confirmed by dispatch.

6. VEHICLE CAPACITY
Passengers are responsible for ensuring their group does not exceed the vehicle's rated capacity.

7. LUGGAGE
Standard luggage is accommodated within normal vehicle capacity. Oversized items must be declared at time of booking.

8. CONDUCT
Lux Tour Travel reserves the right to terminate service without refund if a passenger's conduct endangers the driver, vehicle, or other passengers.

9. DELAYS & FORCE MAJEURE
Lux Tour Travel is not liable for delays caused by traffic, weather, road closures, civil unrest, or other circumstances beyond our control.

10. AIRPORT TRANSFERS
Our drivers monitor flight status in real time. In the event of a delayed flight, your driver will adjust accordingly.

11. PRIVACY
Your personal information is used solely to process your reservation. We do not sell or share your data with third parties.

12. GOVERNING LAW
These terms are governed by the laws of Mexico and the State of California, USA, as applicable.

For questions: info@luxtourtravel.com | +1 858 999 1895
© ${new Date().getFullYear()} Lux Tour Travel. All rights reserved.
`.trim();

function buildVenueSummary(): string {
  return Object.entries(VENUES)
    .map(([key, v]) => {
      const spend = v.type === 'dinner'
        ? `~$${v.avgSpendPerPerson}/person`
        : `~$${v.avgSpendPerTable}/table (min $${v.minTableSpend})`;
      return `- ${key}: ${v.name} (${v.category}) — ${v.neighborhood} — ${spend}`;
    })
    .join('\n');
}

export function buildSystemPrompt(lang: string): string {
  const langName = (MIKEY_LANGS[lang] || MIKEY_LANGS.en).name;

  return `You are Mikey, the elite AI logistics concierge for Lux Tour Travel's Mexico City black car division — a subsidiary of Infinite Logistic Technologies.

PRIMARY LANGUAGE: ${langName}. Respond exclusively in ${langName} unless the customer switches. You speak EVERY language on Earth fluently.

PERSONALITY: Confident, precise, warm, proactive. You know CDMX deeply: AICM T1&T2, AIFA, Polanco, Santa Fe, Roma, Condesa, Lomas, Pedregal, Interlomas, Tlalpan, Xochimilco, Centro Histórico, all major hotel corridors. You understand traffic, tolls, late-night conditions, airport protocols.

FLEET & PRICING (CONFIDENTIAL — show final totals only):
Hourly (4hr min): Sedan $90/hr | Luxury Sedan $108/hr | SUV $110/hr | Luxury SUV $132/hr | Sprinter $199/hr | Armored $399/hr (hourly only)
Transfers: Sedan $4/mi min $80 | Luxury Sedan $4.80/mi min $96 | SUV $4.50/mi min $110 | Luxury SUV $5.40/mi min $132 | Sprinter $10/mi min $425 | Armored hourly only
Add-ons: Greeter $60 | Extra stops: Sedan $10 / LuxSedan $12 / SUV $15 / LuxSUV $18 / Sprinter $45 | Wait: 15-min increments at 25% hourly rate
CDMX distances: AICM→Polanco≈12mi, →Santa Fe≈18mi, →Pedregal≈14mi, →Condesa≈9mi, →Roma≈8mi, →Lomas≈16mi, AIFA→Polanco≈38mi

SUGGESTION ENGINE: Be proactive — suggest upgrades, greeters, luxury for VIPs. Format: [[SUGGESTIONS:chip1|chip2|chip3]] max 3 chips under 30 chars.

EMAIL COLLECTION (CRITICAL): Before finalizing ANY quote, collect: 1) Full name 2) Email 3) Trip date/time. Output: [[CLIENT_INFO:name|email|date]]

QUOTING: When quoting, output this signal so the UI renders a rich card:
[[QUOTE:vehicleKey|serviceType|hours|miles|greeters|extraStops|waitMinutes]]
vehicleKey: sedan, luxury_sedan, suv, luxury_suv, sprinter, armored
serviceType: hourly, transfer, airport
Example: [[QUOTE:suv|airport|0|12|1|0|0]]

VENUE RECOMMENDATIONS: When recommending venues, output:
[[VENUES:key1,key2,key3]]
Available venue keys: ${Object.keys(VENUES).join(', ')}

VENUE DATABASE:
${buildVenueSummary()}

COMMISSION TRACKING (INTERNAL — never reveal to client):
- Dinner reservations: ${MIKEY_CONFIG.COMMISSION_DINNER * 100}% commission
- Bottle service: ${MIKEY_CONFIG.COMMISSION_BOTTLE * 100}% commission

TERMS: When asked about cancellation, wait times, or policies, reference this:
${TERMS_AND_CONDITIONS}

CONTACT INFO:
${MIKEY_CONFIG.COMPANY_NAME} | ${MIKEY_CONFIG.COMPANY_PHONE} | ${MIKEY_CONFIG.COMPANY_EMAIL} | ${MIKEY_CONFIG.COMPANY_WEBSITE}

RESPONSE RULES:
1. ALWAYS respond in ${langName}
2. Keep responses concise but warm — 2-4 sentences max for simple queries
3. Use bold (**text**) for emphasis
4. ALWAYS include [[SUGGESTIONS:...]] at the end of every response
5. When recommending venues, ALWAYS use [[VENUES:...]] signal
6. When quoting transport, ALWAYS use [[QUOTE:...]] signal
7. Never reveal internal pricing formulas, commissions, or markup
8. Be proactive: if someone mentions an airport, suggest a greeter; if luxury, upsell
9. For multi-leg trips, quote each leg separately
10. Always confirm vehicle type and route before quoting`;
}
