import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, X } from 'lucide-react';
import { MIKEY_LANGS, GREETINGS, SUGGESTION_CHIPS, COUNTRY_LANG } from '@/data/mikeyConfig';
import { getVenuesByType, getVenueByKey, type Venue } from '@/data/mikeyVenues';
import { VEHICLES, buildQuote, lookupDistance, type Quote } from '@/data/mikeyPricing';
import { buildSystemPrompt } from '@/data/mikeySystemPrompt';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───
interface ClientInfo {
  name?: string;
  email?: string;
  date?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  venues?: Venue[];
  quote?: Quote;
  suggestions?: string[];
  clientInfo?: ClientInfo;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Signal Parsers ───
function parseSignals(raw: string) {
  let text = raw;
  const venues: Venue[] = [];
  let quote: Quote | null = null;
  const suggestions: string[] = [];

  const venueMatch = text.match(/\[\[VENUES?:([^\]]+)\]\]/i);
  if (venueMatch) {
    text = text.replace(venueMatch[0], '').trim();
    venueMatch[1].split(',').map(k => k.trim()).forEach(key => {
      const v = getVenueByKey(key);
      if (v) venues.push(v);
    });
  }

  const quoteMatch = text.match(/\[\[QUOTE:([^\]]+)\]\]/i);
  if (quoteMatch) {
    text = text.replace(quoteMatch[0], '').trim();
    const parts = quoteMatch[1].split('|');
    if (parts.length >= 2) {
      quote = buildQuote({
        vehicleKey: parts[0]?.trim() || 'suv',
        serviceType: (parts[1]?.trim() || 'transfer') as 'hourly' | 'transfer' | 'airport',
        hours: parseFloat(parts[2]) || undefined,
        miles: parseFloat(parts[3]) || undefined,
        greeters: parseInt(parts[4]) || 0,
        extraStops: parseInt(parts[5]) || 0,
        waitMinutes: parseInt(parts[6]) || 0,
      });
    }
  }

  const sugMatch = text.match(/\[\[SUGGESTIONS?:([^\]]+)\]\]/i);
  if (sugMatch) {
    text = text.replace(sugMatch[0], '').trim();
    sugMatch[1].split('|').forEach(s => { const t = s.trim(); if (t) suggestions.push(t); });
  }

  const clientMatch = text.match(/\[\[CLIENT_INFO:([^\]]+)\]\]/i);
  if (clientMatch) text = text.replace(clientMatch[0], '').trim();

  return { text, venues, quote, suggestions };
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

// ─── Venue Card ───
function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="bg-card border border-border rounded-[10px] overflow-hidden hover:border-[hsl(var(--gold-dark))] transition-colors">
      <div className="p-3 flex gap-3 items-start">
        <span className="text-[22px] leading-none flex-shrink-0 mt-0.5">{venue.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-[15px] font-semibold text-gold tracking-wide leading-tight">{venue.name}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5 tracking-wider">{venue.category}</div>
          <div className="text-[11px] text-foreground mt-1.5 leading-relaxed opacity-85">{venue.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 px-3 pb-2.5">
        {venue.tags.map((tag) => (
          <span key={tag} className="text-[9px] tracking-wider uppercase px-2 py-0.5 border border-border rounded-full text-muted-foreground">{tag}</span>
        ))}
      </div>
      <div className="px-3 py-2.5 border-t border-border flex items-center justify-between bg-[hsl(var(--gold)/0.03)]">
        <span className="text-[11px] text-muted-foreground">
          {venue.type === 'dinner'
            ? <>Avg <strong className="text-foreground">${venue.avgSpendPerPerson}</strong>/person</>
            : <>Min <strong className="text-foreground">${venue.minTableSpend}</strong>/table</>}
        </span>
        <a href={`tel:${venue.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] rounded-md text-gold font-body text-[10px] font-semibold tracking-wider uppercase hover:border-gold hover:shadow-[0_0_12px_rgba(201,169,110,0.15)] transition-all">
          Reserve
        </a>
      </div>
    </div>
  );
}

// ─── Quote Card ───
function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div className="mt-3 bg-gradient-to-br from-[#1a1a0e] to-[#1e1a0e] border border-[hsl(var(--gold-dark))] rounded-[10px] p-4 min-w-[240px]">
      <div className="font-display text-base text-gold font-semibold tracking-wide mb-1.5">
        {quote.vehicle}{quote.luxury && ' ✦'}
      </div>
      <div className="space-y-1 text-[12px]">
        <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="text-foreground capitalize">{quote.params.serviceType}</span></div>
        {quote.params.hours && <div className="flex justify-between"><span className="text-muted-foreground">Hours</span><span className="text-foreground">{quote.params.hours}h</span></div>}
        {quote.params.miles && <div className="flex justify-between"><span className="text-muted-foreground">Distance</span><span className="text-foreground">~{quote.params.miles} mi</span></div>}
        {(quote.params.greeters || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Greeter</span><span className="text-foreground">+$60</span></div>}
        {(quote.params.extraStops || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Extra Stops</span><span className="text-foreground">{quote.params.extraStops}</span></div>}
      </div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[hsl(var(--gold-dark))]">
        <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Total</span>
        <span className="font-display text-[22px] text-gold font-semibold">${quote.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ─── Fallback local engine ───
function localResponse(userMsg: string, lang: string) {
  const lower = userMsg.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('restaurante') || lower.includes('dinner') || lower.includes('cena')) {
    const zone = lower.includes('polanco') ? 'polanco' : lower.includes('roma') ? 'roma' : lower.includes('condesa') ? 'condesa' : undefined;
    return { content: lang === 'es' ? 'Aquí tiene las mejores recomendaciones de restaurantes exclusivos en CDMX:' : 'Here are my top exclusive dining recommendations in CDMX:', venues: zone ? getVenuesByType('dinner', zone) : getVenuesByType('dinner').slice(0, 4), quote: null as Quote | null, suggestions: lang === 'es' ? ['Ver clubs nocturnos', 'Cotizar transporte', 'Más en Polanco'] : ['View nightclubs', 'Quote transport', 'More in Polanco'] };
  }
  if (lower.includes('club') || lower.includes('nightclub') || lower.includes('noche') || lower.includes('bottle')) {
    return { content: lang === 'es' ? 'Los mejores clubs con servicio de botella en CDMX:' : 'The finest bottle-service clubs in CDMX:', venues: getVenuesByType('bottle').slice(0, 4), quote: null as Quote | null, suggestions: lang === 'es' ? ['Ver restaurantes', 'Transporte al club', 'Todos los clubs'] : ['View restaurants', 'Transport to club', 'All clubs'] };
  }
  if (lower.includes('airport') || lower.includes('aeropuerto') || lower.includes('aicm') || lower.includes('transfer')) {
    const zone = lower.includes('polanco') ? 'polanco' : lower.includes('santa fe') ? 'santa fe' : lower.includes('condesa') ? 'condesa' : 'polanco';
    const miles = lookupDistance('aicm', zone) || 12;
    return { content: lang === 'es' ? `Transfer AICM → ${zone.charAt(0).toUpperCase() + zone.slice(1)} (~${miles} mi):` : `Airport transfer AICM → ${zone.charAt(0).toUpperCase() + zone.slice(1)} (~${miles} mi):`, venues: [] as Venue[], quote: buildQuote({ vehicleKey: 'suv', serviceType: 'airport', miles }), suggestions: lang === 'es' ? ['Agregar greeter', 'Luxury SUV', 'Sprinter'] : ['Add greeter', 'Luxury SUV', 'Sprinter'] };
  }
  if (lower.includes('quote') || lower.includes('cotiz') || lower.includes('price') || lower.includes('precio') || lower.includes('transport')) {
    const vk = lower.includes('sprinter') ? 'sprinter' : lower.includes('luxury') ? 'luxury_suv' : lower.includes('armored') ? 'armored' : 'suv';
    const st = lower.includes('hourly') || lower.includes('hora') ? 'hourly' as const : 'transfer' as const;
    return { content: lang === 'es' ? `Cotización para ${VEHICLES[vk]?.label || 'SUV'}:` : `${VEHICLES[vk]?.label || 'SUV'} quote:`, venues: [] as Venue[], quote: buildQuote({ vehicleKey: vk, serviceType: st, hours: st === 'hourly' ? 4 : undefined, miles: st === 'transfer' ? 12 : undefined }), suggestions: lang === 'es' ? ['Confirmar', 'Otro vehículo', 'Agregar paradas'] : ['Confirm booking', 'Different vehicle', 'Add stops'] };
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasAutoStartedVoice = useRef(false);

  const langConfig = MIKEY_LANGS[lang] || MIKEY_LANGS.en;

  // Auto-detect language
  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        setLang(COUNTRY_LANG[data.country_code] || 'en');
      } catch { setLang('en'); }
      finally { setDetecting(false); }
    };
    detect();
  }, []);

  // Set greeting
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
  }, []);

  // Send message
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
      const { text: cleanText, venues, quote, suggestions } = parseSignals(rawText);
      setMessages(prev => [...prev, {
        id: Date.now().toString(36) + 'a', role: 'assistant', content: cleanText,
        venues: venues.length > 0 ? venues : undefined, quote: quote || undefined,
        suggestions: suggestions.length > 0 ? suggestions : (SUGGESTION_CHIPS[lang] || SUGGESTION_CHIPS.en),
      }]);
      setConversationHistory([...newHistory, { role: 'assistant', content: rawText }]);
      setIsTyping(false);
      return;
    } catch (err) {
      console.warn('Edge function unavailable, using local engine:', err);
    }

    // Local fallback
    setTimeout(() => {
      const result = localResponse(msg, lang);
      setMessages(prev => [...prev, {
        id: Date.now().toString(36) + 'a', role: 'assistant', content: result.content,
        venues: result.venues.length > 0 ? result.venues : undefined, quote: result.quote || undefined,
        suggestions: result.suggestions,
      }]);
      setConversationHistory([...newHistory, { role: 'assistant', content: result.content }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [input, isTyping, conversationHistory, lang]);

  // Voice
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

  // Auto-start voice if requested
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[460px] bg-[hsl(var(--luxury-dark))] shadow-2xl shadow-black/50 transition-transform duration-400 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        dir={langConfig.rtl ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border flex items-center gap-3 bg-card flex-shrink-0">
            <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border-[1.5px] border-[hsl(var(--gold-dark))] flex items-center justify-center font-display text-xl text-gold flex-shrink-0 relative">
              M
              <span className="absolute bottom-[1px] right-[1px] w-[9px] h-[9px] bg-green-500 rounded-full border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg font-semibold text-gold tracking-wider leading-none">MIKEY</div>
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent my-1" />
              <div className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">Lux Tour · Mexico City</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!detecting && (
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-background border border-border text-muted-foreground font-body text-[10px] py-1 px-2 rounded-full cursor-pointer outline-none hover:border-[hsl(var(--gold-dark))] hover:text-gold transition-all appearance-none"
                >
                  {Object.entries(MIKEY_LANGS).map(([code, l]) => (
                    <option key={code} value={code} className="bg-card text-foreground">{l.flag} {l.label}</option>
                  ))}
                </select>
              )}
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-border/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-sm">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-gold font-display text-sm'
                    : 'bg-border text-muted-foreground text-[11px]'
                }`}>
                  {msg.role === 'assistant' ? 'M' : '●'}
                </div>
                <div className="max-w-[82%]">
                  <div className={`px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-card border border-border text-foreground rounded-tl-[4px]'
                      : 'bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-foreground rounded-tr-[4px]'
                  }`}>
                    {renderMarkdown(msg.content)}
                  </div>
                  {msg.venues && msg.venues.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3">
                      {msg.venues.map((v) => <VenueCard key={v.key} venue={v} />)}
                    </div>
                  )}
                  {msg.quote && <QuoteCard quote={msg.quote} />}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {msg.suggestions.map((chip) => (
                        <button key={chip} onClick={() => sendMessage(chip)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[hsl(var(--gold)/0.06)] border border-[hsl(var(--gold-dark))] rounded-full text-[11px] text-gold cursor-pointer hover:bg-[hsl(var(--gold)/0.14)] transition-all font-body">
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 animate-in fade-in duration-300">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] flex items-center justify-center text-gold font-display text-sm flex-shrink-0">M</div>
                <div className="px-3.5 py-2.5 bg-card border border-border rounded-xl rounded-tl-[4px]">
                  <div className="flex gap-1 py-1 px-0.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold-dark))] animate-bounce" style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.2s' }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border bg-card flex gap-2 items-end flex-shrink-0">
            <div className="flex-1">
              <textarea ref={textareaRef} value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown} placeholder={langConfig.ph} rows={1}
                className="w-full bg-background border border-border rounded-lg text-foreground font-body text-[13px] px-3.5 py-2.5 resize-none outline-none leading-relaxed min-h-[42px] max-h-[120px] overflow-y-auto placeholder:text-muted-foreground focus:border-[hsl(var(--gold-dark))] transition-colors"
              />
            </div>
            <button onClick={toggleMic}
              className={`w-[42px] h-[42px] rounded-lg border flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                isRecording ? 'border-destructive text-destructive animate-pulse bg-background' : 'bg-background border-border text-muted-foreground hover:border-[hsl(var(--gold-dark))] hover:text-gold'
              }`}>
              <Mic className="w-4 h-4" />
            </button>
            <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
              className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-gold flex items-center justify-center cursor-pointer hover:border-gold hover:shadow-[0_0_14px_rgba(201,169,110,0.2)] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
