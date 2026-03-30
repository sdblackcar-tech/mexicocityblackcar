import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, X, Volume2, VolumeX, Shield, MessageSquare } from 'lucide-react';
import { MIKEY_LANGS, GREETINGS, SUGGESTION_CHIPS, COUNTRY_LANG, DRIVERS, MIKEY_CONFIG } from '@/data/mikeyConfig';
import { getVenuesByType, getVenueById, type Venue } from '@/data/mikeyVenues';
import { VEHICLES, buildQuote, lookupDistance, type Quote } from '@/data/mikeyPricing';
import { buildSystemPrompt } from '@/data/mikeySystemPrompt';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───
interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  pax?: number;
}

interface DriverAssign {
  name: string;
  eta: string;
  vehicle: string;
}

interface SecurityBrief {
  zone: string;
}

interface ConciergeType {
  type: string;
}

interface MultiQuoteData {
  keys: string[];
  serviceStr: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  venues?: Venue[];
  quote?: Quote;
  suggestions?: string[];
  clientInfo?: ClientInfo;
  driverAssign?: DriverAssign;
  securityBrief?: SecurityBrief;
  conciergeType?: ConciergeType;
  multiQuote?: MultiQuoteData;
  isVipAccess?: boolean;
  isWhatsappHandoff?: boolean;
  upsellType?: string;
  legCount?: number;
  runningTotal?: number;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SessionFlags {
  isVIP: boolean;
  legCount: number;
  runningTotal: number;
  venueOffered: boolean;
  clientSaved: boolean;
  handoffOffered: boolean;
}

// ─── Signal Parsers ───
function parseSignals(raw: string, sessionFlags: SessionFlags) {
  let text = raw;
  const venues: Venue[] = [];
  let quote: Quote | null = null;
  const suggestions: string[] = [];
  let clientInfo: ClientInfo | null = null;
  let driverAssign: DriverAssign | null = null;
  let securityBrief: SecurityBrief | null = null;
  let conciergeType: ConciergeType | null = null;
  let multiQuote: MultiQuoteData | null = null;
  let isVipAccess = false;
  let isWhatsappHandoff = false;
  let upsellType: string | null = null;
  let legCount: number | null = null;
  let isVipFlag = false;
  let vipReason = '';

  // CLIENT_INFO
  const ciMatch = text.match(/\[\[CLIENT_INFO:([^\]]+)\]\]/i);
  if (ciMatch) {
    text = text.replace(ciMatch[0], '').trim();
    const parts = ciMatch[1].split('|');
    clientInfo = { name: parts[0]?.trim(), email: parts[1]?.trim(), phone: parts[2]?.trim(), pax: parseInt(parts[3]) || undefined };
  }

  // VIP_FLAG
  const vfMatch = text.match(/\[\[VIP_FLAG:([^\]]+)\]\]/i);
  if (vfMatch) {
    text = text.replace(vfMatch[0], '').trim();
    isVipFlag = true;
    vipReason = vfMatch[1];
  }

  // QUOTE
  const qMatch = text.match(/\[\[QUOTE:([^\]]+)\]\]/i);
  if (qMatch) {
    text = text.replace(qMatch[0], '').trim();
    const parts = qMatch[1].split('|');
    if (parts.length >= 2) {
      quote = buildQuote({
        vehicleKey: parts[0]?.trim() || 'suv',
        serviceType: (parts[1]?.trim() || 'transfer') as any,
        hours: parseFloat(parts[2]) || undefined,
        miles: parseFloat(parts[3]) || undefined,
        greeters: parseInt(parts[4]) || 0,
        extraStops: parseInt(parts[5]) || 0,
        waitMinutes: parseInt(parts[6]) || 0,
      });
    }
  }

  // MULTI_QUOTE
  const mqMatch = text.match(/\[\[MULTI_QUOTE:([^\]]+)\]\]/i);
  if (mqMatch) {
    text = text.replace(mqMatch[0], '').trim();
    const parts = mqMatch[1].split('|');
    const keys = parts[0].split(',').map(k => k.trim());
    multiQuote = { keys, serviceStr: parts.slice(1).join('|') };
  }

  // DRIVER_ASSIGN
  const daMatch = text.match(/\[\[DRIVER_ASSIGN:([^\]]+)\]\]/i);
  if (daMatch) {
    text = text.replace(daMatch[0], '').trim();
    const [name, eta, vehicle] = daMatch[1].split('|');
    driverAssign = { name: name?.trim() || '', eta: eta?.trim() || '', vehicle: vehicle?.trim() || '' };
  }

  // WHATSAPP_HANDOFF
  if (text.includes('[[WHATSAPP_HANDOFF]]')) {
    text = text.replace('[[WHATSAPP_HANDOFF]]', '').trim();
    isWhatsappHandoff = true;
  }

  // SECURITY_BRIEF
  const sbMatch = text.match(/\[\[SECURITY_BRIEF:([^\]]+)\]\]/i);
  if (sbMatch) {
    text = text.replace(sbMatch[0], '').trim();
    securityBrief = { zone: sbMatch[1].trim() };
  }

  // UPSELL
  const usMatch = text.match(/\[\[UPSELL:([^\]]+)\]\]/i);
  if (usMatch) {
    text = text.replace(usMatch[0], '').trim();
    upsellType = usMatch[1].trim();
  }

  // CONCIERGE_BRIEF
  const cbMatch = text.match(/\[\[CONCIERGE_BRIEF:([^\]]+)\]\]/i);
  if (cbMatch) {
    text = text.replace(cbMatch[0], '').trim();
    conciergeType = { type: cbMatch[1].trim() };
  }

  // VIP_ACCESS_BRIEF
  if (text.includes('[[VIP_ACCESS_BRIEF]]')) {
    text = text.replace('[[VIP_ACCESS_BRIEF]]', '').trim();
    isVipAccess = true;
  }

  // RECOMMEND_VENUES
  const rvMatch = text.match(/\[\[RECOMMEND_VENUES:([^\]]+)\]\]/i);
  if (rvMatch) {
    text = text.replace(rvMatch[0], '').trim();
    const type = rvMatch[1].trim() as 'dinner' | 'nightlife' | 'both';
    venues.push(...getVenuesByType(type));
  }

  // LEG_COUNT
  const lcMatch = text.match(/\[\[LEG_COUNT:(\d+)\]\]/i);
  if (lcMatch) {
    text = text.replace(lcMatch[0], '').trim();
    legCount = parseInt(lcMatch[1]);
  }

  // Strip remaining signals
  text = text.replace(/\[\[(?:ITINERARY_READY|OPEN_BOOKING|SAVE_CLIENT|BOOK_VENUE:[^\]]+)\]\]/gi, '').trim();

  // SUGGESTIONS (last)
  const sugMatch = text.match(/\[\[SUGGESTIONS?:([^\]]+)\]\]/i);
  if (sugMatch) {
    text = text.replace(sugMatch[0], '').trim();
    sugMatch[1].split('|').forEach(s => { const t = s.trim(); if (t) suggestions.push(t); });
  }

  return { text, venues, quote, suggestions, clientInfo, driverAssign, securityBrief, conciergeType, multiQuote, isVipAccess, isWhatsappHandoff, upsellType, legCount, isVipFlag, vipReason };
}

// ─── Markdown renderer ───
function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
      if (seg.startsWith('**') && seg.endsWith('**'))
        return <strong key={j} className="text-gold font-semibold">{seg.slice(2, -2)}</strong>;
      return <span key={j}>{seg}</span>;
    });
    return <span key={i}>{parts}{i < text.split('\n').length - 1 && <br />}</span>;
  });
}

// ─── Sub-components ───
function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-[hsl(var(--gold-dark))] transition-colors">
      <div className="p-3 flex gap-3 items-start">
        <span className="text-[22px] leading-none flex-shrink-0 mt-0.5">{venue.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-display text-[14px] font-semibold text-gold">{venue.name}</div>
            <span className="text-[8px] tracking-wider uppercase px-1.5 py-0.5 border border-border rounded text-muted-foreground">{venue.tier}</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{venue.zone} · {venue.category}</div>
          <div className="text-[11px] text-foreground mt-1 leading-relaxed opacity-85">{venue.description}</div>
        </div>
      </div>
      <div className="px-3 py-2 border-t border-border flex items-center justify-between bg-[hsl(var(--gold)/0.03)]">
        <span className="text-[11px] text-muted-foreground">~${venue.avgSpend}/{venue.type === 'dinner' ? 'person' : 'table'}</span>
        <button className="px-3 py-1 bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] rounded text-gold text-[10px] font-semibold tracking-wider uppercase hover:border-gold transition-all">
          Reserve
        </button>
      </div>
    </div>
  );
}

function QuoteCard({ quote, lang }: { quote: Quote; lang: string }) {
  const L = MIKEY_LANGS[lang] || MIKEY_LANGS.en;
  return (
    <div className="mt-3 bg-card border border-border border-l-[3px] border-l-gold rounded-lg overflow-hidden">
      <div className="p-3 border-b border-border flex justify-between items-start">
        <div>
          <div className="font-display text-[15px] text-gold font-semibold">{quote.vehicle}{quote.luxury && <span className="text-[10px] text-muted-foreground ml-2 font-body tracking-wider">ULTRA-LUXURY</span>}</div>
          <div className="text-[9.5px] tracking-wider uppercase text-muted-foreground mt-0.5">{quote.label}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl text-foreground">${quote.total.toFixed(2)}</div>
          <div className="text-[11px] text-muted-foreground">USD</div>
        </div>
      </div>
      <div className="p-3 space-y-0.5 text-[11.5px]">
        <div className="flex justify-between"><span className="text-muted-foreground font-mono">Capacity</span><span className="text-foreground font-mono">{quote.pax} pax</span></div>
        {(quote.params.greeters || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground font-mono">Meet & Greet</span><span className="text-foreground font-mono">Included</span></div>}
        {(quote.params.extraStops || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground font-mono">Extra Stops</span><span className="text-foreground font-mono">{quote.params.extraStops}</span></div>}
        <div className="h-px bg-border my-2" />
        <div className="font-mono text-[9.5px] text-[hsl(var(--gold-dark))] tracking-wider">REF: {quote.confNum}</div>
      </div>
      <div className="p-3 flex gap-2">
        <button className="flex-1 py-2.5 bg-gold border-none rounded-md text-[11.5px] font-medium text-background tracking-wider uppercase hover:opacity-90 transition-opacity">{L.payBtn}</button>
        <button className="py-2.5 px-3 bg-transparent border border-border rounded-md text-[11.5px] text-muted-foreground hover:border-[hsl(var(--gold-dark))] hover:text-foreground transition-all">{L.holdBtn}</button>
      </div>
    </div>
  );
}

function MultiQuoteCard({ keys, serviceStr, onSelect }: { keys: string[]; serviceStr: string; onSelect: (key: string) => void }) {
  const validKeys = keys.filter(k => VEHICLES[k]);
  const recIdx = Math.floor(validKeys.length / 2);
  return (
    <div className="mt-3 bg-card border border-border border-t-2 border-t-[hsl(var(--gold-dark))] rounded-lg overflow-hidden">
      <div className="p-2.5 text-[9.5px] tracking-wider uppercase text-muted-foreground">Select Your Vehicle</div>
      <div className={`grid gap-px bg-border ${validKeys.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {validKeys.map((key, i) => {
          const veh = VEHICLES[key];
          const parts = serviceStr.split('|');
          const st = parts[0] as any;
          const q = buildQuote({ vehicleKey: key, serviceType: st, hours: parseFloat(parts[1]) || undefined, miles: parseFloat(parts[2]) || undefined, greeters: parseInt(parts[3]) || 0, extraStops: parseInt(parts[4]) || 0, waitMinutes: parseInt(parts[5]) || 0 });
          return (
            <button key={key} onClick={() => onSelect(key)} className="bg-card p-3 hover:bg-border/30 transition-colors text-left relative">
              {i === recIdx && <span className="absolute top-1.5 right-1.5 text-[7px] tracking-wider text-teal-400 border border-teal-400 rounded px-1 py-px">BEST VALUE</span>}
              <div className="font-display text-[13px] text-gold font-semibold leading-tight">{veh.label}</div>
              <div className="text-[9.5px] text-muted-foreground mt-0.5">{veh.pax} passengers{veh.luxury ? ' · Ultra-Luxury' : ''}</div>
              <div className="font-mono text-lg text-foreground mt-1.5">${q?.total.toFixed(0) || '—'}</div>
              <div className="text-[9px] text-muted-foreground">USD · tap to select</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DriverCard({ driver }: { driver: DriverAssign }) {
  const data = DRIVERS[driver.name] || { initials: driver.name.slice(0, 2).toUpperCase(), specialty: 'Professional driver', zone: 'All zones' };
  return (
    <div className="mt-2 bg-card border border-border border-l-[3px] border-l-teal-400 rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a2a20] to-[#0a130d] border-[1.5px] border-teal-400 flex items-center justify-center font-display text-base text-teal-400 flex-shrink-0">{data.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-sm text-foreground font-semibold">{driver.name}</div>
        <div className="text-[10.5px] text-muted-foreground mt-0.5">{driver.vehicle}</div>
        <div className="text-[9px] tracking-wider uppercase text-teal-400 mt-1">{data.specialty}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-mono text-xl text-teal-400">{driver.eta}</div>
        <div className="text-[9px] text-muted-foreground tracking-wider uppercase">ETA</div>
      </div>
    </div>
  );
}

function WhatsAppHandoffCard({ confNum }: { confNum?: string }) {
  return (
    <div className="mt-2 bg-green-500/5 border border-green-500/25 rounded-lg p-3 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="text-[12px] text-foreground leading-relaxed">
        Your booking is confirmed. For <strong className="text-green-400 font-medium">live tracking, schedule changes, or real-time coordination</strong>, connect directly with our operations team.
      </div>
      <a href={`https://wa.me/${MIKEY_CONFIG.COMPANY_WHATSAPP}?text=Hi, I just booked through Mikey. My confirmation is ${confNum || 'N/A'}.`} target="_blank" rel="noopener" className="flex items-center gap-1.5 bg-green-500 text-background border-none rounded-md px-3 py-2 text-[11px] font-medium tracking-wider flex-shrink-0 hover:opacity-90 transition-opacity">
        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
      </a>
    </div>
  );
}

function SecurityBriefCard({ zone }: { zone: string }) {
  const notes: Record<string, string[]> = {
    polanco: ['All vehicles GPS-tracked, 24/7 ops monitoring', 'Diplomatic-grade vetting for all drivers', "Polanco is CDMX's safest commercial zone", 'Night routes pre-cleared with ops team'],
    roma: ['GPS tracking active on all vehicles', 'Roma Norte is generally safe — stay to main avenidas at night', 'All drivers carry secure communication to operations'],
    condesa: ['Condesa is low-risk — active nightlife zone with police presence', 'Late-night pickups coordinated with venue staff', 'Real-time tracking via WhatsApp ops line'],
    default: ['All vehicles GPS-tracked, 24/7 monitoring', 'Vetted, licensed, insured professional drivers', 'Pre-trip route assessment for all bookings', 'Direct line to operations for real-time needs'],
  };
  const items = notes[zone.toLowerCase()] || notes.default;
  return (
    <div className="mt-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-amber-500" />
        <span className="font-mono text-[10px] tracking-wider uppercase text-amber-500">Security & Safety — {zone}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="text-[11.5px] text-foreground leading-relaxed flex gap-2">
            <span className="text-amber-500 font-mono flex-shrink-0">✓</span>{item}
          </div>
        ))}
      </div>
    </div>
  );
}

function UpsellCard({ type, onSend }: { type: string; onSend: (msg: string) => void }) {
  const isDinner = type === 'dinner';
  const chips = isDinner ? ['Pujol — Polanco', 'Quintonil — Polanco', 'Contramar — Roma', 'Dulce Patria'] : ['Bar Americano', 'Parker & Lenox', 'Condesa DF Rooftop', 'Baltra Bar'];
  return (
    <div className="mt-2 bg-[hsl(var(--gold)/0.06)] border border-[hsl(var(--gold)/0.2)] rounded-lg p-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="font-display text-[13px] text-gold font-semibold mb-1.5">{isDinner ? '🍽 Complete your evening' : '🥃 Continue the night'}</div>
      <div className="text-[11.5px] text-muted-foreground leading-relaxed mb-2.5">{isDinner ? "We have partnerships with CDMX's finest dining rooms." : "Top cocktail bars and private clubs in Polanco and Condesa."}</div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map(c => <button key={c} onClick={() => onSend(c)} className="bg-border border border-[hsl(var(--gold-dark))] rounded-xl px-2.5 py-1 text-[11px] text-gold/80 hover:border-gold transition-colors">{c}</button>)}
        <button onClick={() => onSend('Show all venues')} className="bg-border border border-[hsl(var(--gold-dark))] rounded-xl px-2.5 py-1 text-[11px] text-gold/80 hover:border-gold transition-colors">Show all venues</button>
      </div>
    </div>
  );
}

function ConciergeCard({ type, onSend }: { type: string; onSend: (msg: string) => void }) {
  const services: Record<string, { icon: string; name: string; desc: string }[]> = {
    shopping: [{ icon: '🛍️', name: 'Private Shopping', desc: 'Masaryk & Antara' }, { icon: '💎', name: 'Luxury Curation', desc: 'After-hours appointments' }, { icon: '🎨', name: 'Artisan Markets', desc: 'Curated selections' }, { icon: '👔', name: 'Personal Stylist', desc: 'Fashion consultation' }],
    spa: [{ icon: '🧖', name: 'Spa Booking', desc: 'Four Seasons, St. Regis' }, { icon: '💆', name: 'Wellness Concierge', desc: 'Tailored programs' }, { icon: '🌿', name: 'Private Yoga', desc: 'In-villa or rooftop' }, { icon: '🏊', name: 'Pool Access', desc: 'Luxury hotel facilities' }],
    tours: [{ icon: '🎭', name: 'Art Gallery Route', desc: 'Frida Kahlo, Jumex, Soumaya' }, { icon: '🏛️', name: 'Architecture Walk', desc: 'Expert-guided tour' }, { icon: '🍽️', name: 'Food & Market', desc: 'La Merced, San Juan' }, { icon: '🌆', name: 'Aerial City View', desc: 'Torre Latino & Mirador' }],
    business: [{ icon: '✈️', name: 'Airport Meet & Greet', desc: 'VIP arrivals protocol' }, { icon: '🌐', name: 'Translation', desc: 'Spanish/English professional' }, { icon: '🤝', name: 'Event Coordination', desc: 'Corporate & diplomatic' }, { icon: '📋', name: 'Executive Assistant', desc: 'Full day support' }],
    dining: [{ icon: '🍽️', name: 'Table Reservations', desc: 'Fully-booked restaurants' }, { icon: '🥂', name: 'Private Dining', desc: "Chef's table" }, { icon: '🌮', name: 'Culinary Journey', desc: 'Hidden local gems' }, { icon: '🎂', name: 'Special Occasions', desc: 'Bespoke celebration' }],
    general: [{ icon: '🛍️', name: 'Shopping', desc: 'Luxury & artisan' }, { icon: '🧖', name: 'Spa & Wellness', desc: 'Premium properties' }, { icon: '🎭', name: 'Cultural Tours', desc: 'Art, history, food' }, { icon: '✈️', name: 'Business Services', desc: 'Executive support' }],
  };
  const items = services[type] || services.general;
  const labels: Record<string, string> = { shopping: 'Private Shopping', spa: 'Spa & Wellness', tours: 'Bespoke City Tours', business: 'Business Services', dining: 'Dining Experiences', general: 'Concierge Services' };
  return (
    <div className="mt-2 bg-gradient-to-br from-[hsl(var(--gold)/0.05)] to-[hsl(var(--gold)/0.02)] border border-[hsl(var(--gold)/0.22)] border-t-2 border-t-[hsl(var(--gold-dark))] rounded-lg p-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="font-display text-sm text-gold font-semibold">{labels[type] || 'Concierge Services'}</div>
      <div className="text-[10.5px] tracking-wider uppercase text-[hsl(var(--gold-dark))] mb-2.5">Arranged by Barbie — CDMX Lifestyle Concierge</div>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map(s => (
          <button key={s.name} onClick={() => onSend(`Tell me more about ${s.name}`)} className="bg-border border border-border rounded-md p-2 text-left hover:border-[hsl(var(--gold-dark))] hover:bg-card transition-all">
            <div className="text-sm">{s.icon}</div>
            <div className="text-[11px] text-foreground mt-0.5">{s.name}</div>
            <div className="text-[9.5px] text-muted-foreground">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function VIPAccessCard({ onSend }: { onSend: (msg: string) => void }) {
  const perks = [
    'Priority reservations at Pujol, Quintonil, and Biko — even when fully booked',
    "Backstage & artist-area access via Jaime's touring network",
    'Private club entry: Bar Americano, Parker & Lenox, Living at the W',
    'Rolls-Royce or Bentley on 48-hour advance notice',
    'Diplomatic-grade discretion — NDAs available, no-photo policy enforced',
    'Dedicated ops line: real-time coordination with Ivan 24/7',
  ];
  return (
    <div className="mt-2 bg-gradient-to-br from-[rgba(184,134,11,0.08)] to-[rgba(184,134,11,0.03)] border border-[rgba(184,134,11,0.3)] border-t-2 border-t-[#b8860b] rounded-lg p-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-full bg-[rgba(184,134,11,0.15)] border border-[rgba(184,134,11,0.35)] flex items-center justify-center text-[13px] flex-shrink-0">◆</div>
        <div>
          <div className="font-display text-sm text-[#b8860b] font-semibold">VIP Access Program</div>
          <div className="text-[9.5px] tracking-wider uppercase text-[rgba(184,134,11,0.6)]">Exclusive to Mexico City Black Car clients</div>
        </div>
      </div>
      <div className="space-y-1.5 mb-3">
        {perks.map((p, i) => (
          <div key={i} className="flex items-start gap-2 text-[11.5px] text-foreground leading-snug">
            <span className="text-[#b8860b] text-[7px] mt-1.5 flex-shrink-0">◆</span>{p}
          </div>
        ))}
      </div>
      <button onClick={() => onSend('I want to activate VIP service')} className="w-full bg-[rgba(184,134,11,0.15)] border border-[rgba(184,134,11,0.3)] rounded-md py-2 text-[11.5px] text-[#b8860b] hover:bg-[rgba(184,134,11,0.25)] transition-colors">Activate VIP Service →</button>
    </div>
  );
}

function LegTracker({ legNum, total }: { legNum: number; total: number }) {
  return (
    <div className="mt-2 bg-card border border-border rounded-md px-3 py-2 flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground font-mono tracking-wider">ITINERARY PROGRESS</span>
      <span className="text-gold font-mono text-[13px]">Leg {legNum} · ${total.toFixed(0)} running total</span>
    </div>
  );
}

// ─── Fallback local engine ───
function localResponse(userMsg: string, lang: string) {
  const lower = userMsg.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('dinner') || lower.includes('cena')) {
    return { content: lang === 'es' ? 'Aquí tiene las mejores recomendaciones:' : 'Here are my top dining recommendations:', venues: getVenuesByType('dinner'), quote: null as Quote | null, suggestions: lang === 'es' ? ['Ver clubs', 'Cotizar transporte'] : ['View nightclubs', 'Quote transport'] };
  }
  if (lower.includes('club') || lower.includes('nightclub') || lower.includes('noche')) {
    return { content: lang === 'es' ? 'Los mejores clubs en CDMX:' : 'The finest clubs in CDMX:', venues: getVenuesByType('nightlife'), quote: null as Quote | null, suggestions: lang === 'es' ? ['Ver restaurantes', 'Transporte al club'] : ['View restaurants', 'Transport to club'] };
  }
  if (lower.includes('airport') || lower.includes('aeropuerto') || lower.includes('aicm') || lower.includes('transfer')) {
    const zone = lower.includes('polanco') ? 'polanco' : lower.includes('santafe') ? 'santafe' : 'polanco';
    const miles = lookupDistance('aicm', zone) || 12;
    return { content: lang === 'es' ? `Transfer AICM → ${zone}:` : `Airport transfer AICM → ${zone}:`, venues: [] as Venue[], quote: buildQuote({ vehicleKey: 'suv', serviceType: 'airport_aicm', miles }), suggestions: lang === 'es' ? ['Agregar greeter', 'SUV Luxury', 'Sprinter'] : ['Add greeter', 'Luxury SUV', 'Sprinter'] };
  }
  return { content: lang === 'es' ? 'Puedo cotizar transporte ejecutivo, recomendar restaurantes o clubs nocturnos en CDMX. ¿Qué necesita?' : "I can quote executive transport, recommend restaurants, or suggest VIP nightclubs in CDMX. What do you need?", venues: [] as Venue[], quote: null as Quote | null, suggestions: SUGGESTION_CHIPS[lang] || SUGGESTION_CHIPS.en };
}

// ═══ Main Panel Component ═══
interface MikeyChatPanelProps {
  open: boolean;
  onClose: () => void;
  startWithVoice?: boolean;
}

export default function MikeyChatPanel({ open, onClose, startWithVoice = false }: MikeyChatPanelProps) {
  const [lang, setLang] = useState('en');
  const [detecting, setDetecting] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [sessionFlags] = useState<SessionFlags>({ isVIP: false, legCount: 0, runningTotal: 0, venueOffered: false, clientSaved: false, handoffOffered: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasAutoStartedVoice = useRef(false);
  const lastConfNum = useRef<string | undefined>();

  const langConfig = MIKEY_LANGS[lang] || MIKEY_LANGS.en;

  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        setLang(COUNTRY_LANG[data.country_code] || 'en');
      } catch { setLang('en'); }
      finally { setDetecting(false); }
    };
    detect();
  }, []);

  useEffect(() => {
    if (!detecting) {
      setMessages([{
        id: 'greeting', role: 'assistant',
        content: GREETINGS[lang] || GREETINGS.en,
        suggestions: SUGGESTION_CHIPS[lang] || SUGGESTION_CHIPS.en,
      }]);
      setConversationHistory([]);
    }
  }, [detecting, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now().toString(36) + 'u', role: 'user', content: msg }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    const newHistory: ConversationMessage[] = [...conversationHistory, { role: 'user', content: msg }];

    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('mikey-chat', {
        body: { system: buildSystemPrompt(lang), max_tokens: 1200, messages: newHistory },
      });
      if (fnError) throw fnError;
      const rawText = fnData?.content?.[0]?.text || fnData?.content || '';
      const parsed = parseSignals(rawText, sessionFlags);

      if (parsed.quote) {
        sessionFlags.runningTotal += parsed.quote.total;
        lastConfNum.current = parsed.quote.confNum;
      }
      if (parsed.isVipFlag && !sessionFlags.isVIP) {
        sessionFlags.isVIP = true;
        setIsVIP(true);
      }
      if (parsed.legCount !== null) sessionFlags.legCount = parsed.legCount;

      setMessages(prev => [...prev, {
        id: Date.now().toString(36) + 'a', role: 'assistant', content: parsed.text,
        venues: parsed.venues.length > 0 ? parsed.venues : undefined,
        quote: parsed.quote || undefined,
        suggestions: parsed.suggestions.length > 0 ? parsed.suggestions : (SUGGESTION_CHIPS[lang] || SUGGESTION_CHIPS.en),
        clientInfo: parsed.clientInfo || undefined,
        driverAssign: parsed.driverAssign || undefined,
        securityBrief: parsed.securityBrief || undefined,
        conciergeType: parsed.conciergeType || undefined,
        multiQuote: parsed.multiQuote || undefined,
        isVipAccess: parsed.isVipAccess || undefined,
        isWhatsappHandoff: parsed.isWhatsappHandoff || undefined,
        upsellType: parsed.upsellType || undefined,
        legCount: parsed.legCount !== null ? parsed.legCount : undefined,
        runningTotal: parsed.legCount !== null ? sessionFlags.runningTotal : undefined,
      }]);
      setConversationHistory([...newHistory, { role: 'assistant', content: rawText }]);
      setIsTyping(false);
      return;
    } catch (err) {
      console.warn('Edge function unavailable, using local engine:', err);
    }

    setTimeout(() => {
      const result = localResponse(msg, lang);
      setMessages(prev => [...prev, {
        id: Date.now().toString(36) + 'a', role: 'assistant', content: result.content,
        venues: result.venues.length > 0 ? result.venues : undefined,
        quote: result.quote || undefined,
        suggestions: result.suggestions,
      }]);
      setConversationHistory([...newHistory, { role: 'assistant', content: result.content }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [input, isTyping, conversationHistory, lang, sessionFlags]);

  const toggleMic = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (isRecording && recognitionRef.current) { recognitionRef.current.stop(); return; }
    const r = new SR();
    r.continuous = false; r.interimResults = true;
    const langMap: Record<string, string> = { es: 'es-MX', en: 'en-US', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR', ar: 'ar-SA', hi: 'hi-IN' };
    r.lang = langMap[lang] || 'en-US';
    r.onstart = () => setIsRecording(true);
    r.onresult = (e: any) => { setInput(Array.from(e.results).map((r: any) => r[0].transcript).join('')); };
    r.onend = () => { setIsRecording(false); const val = textareaRef.current?.value.trim(); if (val) setTimeout(() => sendMessage(val), 400); };
    r.onerror = () => setIsRecording(false);
    recognitionRef.current = r;
    r.start();
  }, [isRecording, lang, sendMessage]);

  useEffect(() => {
    if (open && startWithVoice && !hasAutoStartedVoice.current && !detecting) {
      hasAutoStartedVoice.current = true;
      setTimeout(() => toggleMic(), 600);
    }
    if (!open) hasAutoStartedVoice.current = false;
  }, [open, startWithVoice, detecting, toggleMic]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleMultiQuoteSelect = useCallback((key: string, serviceStr: string) => {
    const parts = serviceStr.split('|');
    const q = buildQuote({
      vehicleKey: key, serviceType: parts[0] as any,
      hours: parseFloat(parts[1]) || undefined, miles: parseFloat(parts[2]) || undefined,
      greeters: parseInt(parts[3]) || 0, extraStops: parseInt(parts[4]) || 0, waitMinutes: parseInt(parts[5]) || 0,
    });
    if (q) {
      sessionFlags.runningTotal += q.total;
      lastConfNum.current = q.confNum;
      setMessages(prev => [...prev, {
        id: Date.now().toString(36) + 'q', role: 'assistant',
        content: `**${q.vehicle}** selected.`,
        quote: q,
      }]);
    }
  }, [sessionFlags]);

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-[460px] bg-[hsl(var(--luxury-dark))] shadow-2xl shadow-black/50 transition-transform duration-400 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`} dir={langConfig.rtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="relative px-4 py-3.5 border-b border-border flex items-center gap-3 bg-card flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold" />
            <div className={`w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border-[1.5px] flex items-center justify-center font-display text-xl text-gold flex-shrink-0 relative ${isVIP ? 'border-[#b8860b] shadow-[0_0_12px_rgba(184,134,11,0.12)]' : 'border-[hsl(var(--gold-dark))]'}`}>
              M
              <span className={`absolute bottom-[1px] right-[1px] w-[9px] h-[9px] rounded-full border-2 border-card ${isTyping ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg font-semibold text-gold tracking-wider leading-none">MIKEY</div>
              <div className="w-7 h-px bg-[hsl(var(--gold-dark))] my-1" />
              <div className="text-[9.5px] text-muted-foreground tracking-[0.18em] uppercase">Mexico City Black Car · 24/7</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-1.5 border border-border rounded-md text-muted-foreground hover:border-[hsl(var(--gold-dark))] hover:text-foreground transition-all ${voiceEnabled ? 'border-gold text-gold' : ''}`}>
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              {!detecting && (
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-background border border-border text-muted-foreground font-body text-[10px] py-1 px-2 rounded-md cursor-pointer outline-none hover:border-[hsl(var(--gold-dark))] hover:text-gold transition-all appearance-none">
                  {Object.entries(MIKEY_LANGS).map(([code, l]) => (
                    <option key={code} value={code} className="bg-card text-foreground">{l.flag} {l.label}</option>
                  ))}
                </select>
              )}
              <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-border/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIP Banner */}
          {isVIP && (
            <div className="bg-[rgba(184,134,11,0.08)] border-b border-[rgba(184,134,11,0.3)] py-1 text-center text-[9px] tracking-wider uppercase text-[#b8860b]">◆ Priority Service Active</div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-sm">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'assistant' ? 'bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-gold font-display text-sm' : 'bg-border text-muted-foreground text-[11px]'
                }`}>
                  {msg.role === 'assistant' ? 'M' : '›'}
                </div>
                <div className="max-w-[85%]">
                  <div className={`px-3.5 py-2.5 rounded-lg text-[13.5px] leading-relaxed ${
                    msg.role === 'assistant' ? 'bg-card border border-border text-foreground rounded-bl-[3px]' : 'text-gold/90 font-display text-[15px] italic text-right pr-0 border-none bg-transparent'
                  }`}>
                    {renderMarkdown(msg.content)}
                  </div>
                  {msg.venues && msg.venues.length > 0 && <div className="flex flex-col gap-2 mt-2">{msg.venues.map(v => <VenueCard key={v.id} venue={v} />)}</div>}
                  {msg.quote && <QuoteCard quote={msg.quote} lang={lang} />}
                  {msg.multiQuote && <MultiQuoteCard keys={msg.multiQuote.keys} serviceStr={msg.multiQuote.serviceStr} onSelect={(key) => handleMultiQuoteSelect(key, msg.multiQuote!.serviceStr)} />}
                  {msg.driverAssign && <DriverCard driver={msg.driverAssign} />}
                  {msg.isWhatsappHandoff && <WhatsAppHandoffCard confNum={lastConfNum.current} />}
                  {msg.securityBrief && <SecurityBriefCard zone={msg.securityBrief.zone} />}
                  {msg.upsellType && <UpsellCard type={msg.upsellType} onSend={sendMessage} />}
                  {msg.conciergeType && <ConciergeCard type={msg.conciergeType.type} onSend={sendMessage} />}
                  {msg.isVipAccess && <VIPAccessCard onSend={sendMessage} />}
                  {msg.legCount != null && <LegTracker legNum={msg.legCount} total={msg.runningTotal || 0} />}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {msg.suggestions.map(chip => (
                        <button key={chip} onClick={() => sendMessage(chip)} className="px-2.5 py-1.5 bg-card border border-border rounded-2xl text-[11.5px] text-foreground cursor-pointer hover:border-[hsl(var(--gold-dark))] hover:bg-border/30 transition-all font-body">{chip}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 animate-in fade-in duration-300">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] flex items-center justify-center text-gold font-display text-sm flex-shrink-0">M</div>
                <div className="px-3.5 py-2.5 bg-card border border-border rounded-lg rounded-bl-[3px]">
                  <div className="flex gap-1 py-1 px-0.5">
                    {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold-dark))] animate-bounce" style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.4s' }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border bg-card flex flex-col gap-2 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <button onClick={toggleMic} className={`w-[38px] h-[38px] rounded-lg border flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${isRecording ? 'border-destructive text-destructive animate-pulse bg-background' : 'bg-background border-border text-muted-foreground hover:border-[hsl(var(--gold-dark))] hover:text-gold'}`}>
                <Mic className="w-4 h-4" />
              </button>
              <textarea ref={textareaRef} value={input} onChange={(e) => { setInput(e.target.value); autoResize(); }} onKeyDown={handleKeyDown} placeholder={langConfig.ph} rows={1}
                className="flex-1 bg-card border border-border rounded-lg text-foreground font-body text-[13.5px] px-3.5 py-2 resize-none outline-none leading-relaxed min-h-[38px] max-h-[110px] overflow-y-auto placeholder:text-muted-foreground/50 focus:border-[hsl(var(--gold-dark))] transition-colors" />
              <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
                className="w-[38px] h-[38px] rounded-lg bg-[hsl(var(--gold-dark))] border-none text-background flex items-center justify-center cursor-pointer hover:bg-gold transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[9.5px] text-[hsl(var(--gold-dark))] text-center tracking-wider opacity-70">
              Powered by Mikey AI · <a href="https://www.luxtourtravel.com" target="_blank" rel="noopener" className="text-[hsl(var(--gold-dark))] no-underline">Lux Tour Travel Partner</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
