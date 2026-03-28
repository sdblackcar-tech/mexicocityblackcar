import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Paperclip, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MIKEY_LANGS, GREETINGS, SUGGESTION_CHIPS, COUNTRY_LANG } from '@/data/mikeyConfig';
import { getVenuesByType, type Venue } from '@/data/mikeyVenues';
import { VEHICLES, buildQuote, lookupDistance, type Quote } from '@/data/mikeyPricing';

// ─── Types ───
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  venues?: Venue[];
  quote?: Quote;
  suggestions?: string[];
}

// ─── Markdown-lite renderer ───
function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return <strong key={j} className="text-[hsl(var(--gold))] font-semibold">{seg.slice(2, -2)}</strong>;
      }
      return <span key={j}>{seg}</span>;
    });
    return <span key={i}>{parts}{i < text.split('\n').length - 1 && <br />}</span>;
  });
}

// ─── Venue Card ───
function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[10px] overflow-hidden hover:border-[hsl(var(--gold-dark))] transition-colors">
      <div className="p-3 flex gap-3 items-start">
        <span className="text-[22px] leading-none flex-shrink-0 mt-0.5">{venue.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-['Cormorant_Garamond',serif] text-[15px] font-semibold text-[hsl(var(--gold))] tracking-wide leading-tight">{venue.name}</div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 tracking-wider">{venue.category}</div>
          <div className="text-[11px] text-[hsl(var(--foreground))] mt-1.5 leading-relaxed opacity-85">{venue.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 px-3 pb-2.5">
        {venue.tags.map((tag) => (
          <span key={tag} className="text-[9px] tracking-wider uppercase px-2 py-0.5 border border-[hsl(var(--border))] rounded-full text-[hsl(var(--muted-foreground))]">{tag}</span>
        ))}
      </div>
      <div className="px-3 py-2.5 border-t border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--gold))/0.03]">
        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
          {venue.type === 'dinner' ? (
            <>Avg <strong className="text-[hsl(var(--foreground))]">${venue.avgSpendPerPerson}</strong>/person</>
          ) : (
            <>Min <strong className="text-[hsl(var(--foreground))]">${venue.minTableSpend}</strong>/table</>
          )}
        </span>
        <a href={`tel:${venue.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] rounded-md text-[hsl(var(--gold))] font-['Montserrat',sans-serif] text-[10px] font-semibold tracking-wider uppercase hover:border-[hsl(var(--gold))] hover:shadow-[0_0_12px_rgba(201,169,110,0.15)] transition-all">
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
      <div className="font-['Cormorant_Garamond',serif] text-base text-[hsl(var(--gold))] font-semibold tracking-wide mb-1.5">
        {quote.vehicle}{quote.luxury && ' ✦'}
      </div>
      <div className="space-y-1 text-[12px]">
        <div className="flex justify-between">
          <span className="text-[hsl(var(--muted-foreground))]">Service</span>
          <span className="text-[hsl(var(--foreground))] capitalize">{quote.params.serviceType}</span>
        </div>
        {quote.params.hours && (
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))]">Hours</span>
            <span className="text-[hsl(var(--foreground))]">{quote.params.hours}h</span>
          </div>
        )}
        {quote.params.miles && (
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))]">Distance</span>
            <span className="text-[hsl(var(--foreground))]">~{quote.params.miles} mi</span>
          </div>
        )}
        {(quote.params.greeters || 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))]">Greeter</span>
            <span className="text-[hsl(var(--foreground))]">+$60</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[hsl(var(--gold-dark))]">
        <span className="text-[10px] tracking-wider uppercase text-[hsl(var(--muted-foreground))]">Total</span>
        <span className="font-['Cormorant_Garamond',serif] text-[22px] text-[hsl(var(--gold))] font-semibold">${quote.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ─── Main Mikey Page ───
export default function Mikey() {
  const [lang, setLang] = useState('en');
  const [detecting, setDetecting] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const langConfig = MIKEY_LANGS[lang] || MIKEY_LANGS.en;

  // Auto-detect language
  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        const detected = COUNTRY_LANG[data.country_code] || 'en';
        setLang(detected);
      } catch {
        setLang('en');
      } finally {
        setDetecting(false);
      }
    };
    detect();
  }, []);

  // Set greeting when language is ready
  useEffect(() => {
    if (!detecting) {
      const greeting = GREETINGS[lang] || GREETINGS.en;
      const chips = SUGGESTION_CHIPS[lang] || SUGGESTION_CHIPS.en;
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: greeting,
        suggestions: chips,
      }]);
    }
  }, [detecting, lang]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, []);

  // ─── Simple local response engine ───
  const generateResponse = useCallback((userMsg: string): ChatMessage => {
    const lower = userMsg.toLowerCase();
    const id = Date.now().toString(36);

    // Venue recommendations
    if (lower.includes('restaurant') || lower.includes('restaurante') || lower.includes('dinner') || lower.includes('cena') || lower.includes('comida')) {
      const venues = getVenuesByType('dinner');
      const zone = lower.includes('polanco') ? 'polanco' : lower.includes('roma') ? 'roma' : lower.includes('condesa') ? 'condesa' : undefined;
      const filtered = zone ? getVenuesByType('dinner', zone) : venues.slice(0, 4);
      return {
        id,
        role: 'assistant',
        content: lang === 'es'
          ? 'Aquí tiene las mejores recomendaciones de restaurantes exclusivos en CDMX:'
          : 'Here are my top exclusive dining recommendations in CDMX:',
        venues: filtered,
        suggestions: lang === 'es'
          ? ['Ver clubs nocturnos', 'Cotizar transporte', 'Más en Polanco']
          : ['View nightclubs', 'Quote transport', 'More in Polanco'],
      };
    }

    if (lower.includes('club') || lower.includes('nightclub') || lower.includes('noche') || lower.includes('bottle') || lower.includes('fiesta')) {
      const venues = getVenuesByType('bottle');
      return {
        id,
        role: 'assistant',
        content: lang === 'es'
          ? 'Los mejores clubs con servicio de botella en CDMX:'
          : 'The finest bottle-service clubs in CDMX:',
        venues: venues.slice(0, 4),
        suggestions: lang === 'es'
          ? ['Ver restaurantes', 'Transporte al club', 'Todos los clubs']
          : ['View restaurants', 'Transport to club', 'All clubs'],
      };
    }

    // Transport quotes
    if (lower.includes('airport') || lower.includes('aeropuerto') || lower.includes('aicm') || lower.includes('transfer')) {
      const zone = lower.includes('polanco') ? 'polanco' : lower.includes('santa fe') ? 'santa fe' : lower.includes('condesa') ? 'condesa' : 'polanco';
      const miles = lookupDistance('aicm', zone) || 12;
      const quote = buildQuote({ vehicleKey: 'suv', serviceType: 'airport', miles });
      return {
        id,
        role: 'assistant',
        content: lang === 'es'
          ? `Transfer desde AICM → ${zone.charAt(0).toUpperCase() + zone.slice(1)} (~${miles} mi). Aquí está su cotización con SUV Ejecutivo:`
          : `Airport transfer AICM → ${zone.charAt(0).toUpperCase() + zone.slice(1)} (~${miles} mi). Here's your Executive SUV quote:`,
        quote: quote || undefined,
        suggestions: lang === 'es'
          ? ['Agregar greeter', 'Cotizar Luxury SUV', 'Ver Sprinter']
          : ['Add greeter', 'Quote Luxury SUV', 'View Sprinter'],
      };
    }

    if (lower.includes('quote') || lower.includes('cotiz') || lower.includes('price') || lower.includes('precio') || lower.includes('transport')) {
      const vehicleKey = lower.includes('sprinter') ? 'sprinter' : lower.includes('luxury') || lower.includes('lujo') ? 'luxury_suv' : lower.includes('armored') || lower.includes('blindado') ? 'armored' : 'suv';
      const serviceType = lower.includes('hourly') || lower.includes('hora') ? 'hourly' as const : 'transfer' as const;
      const quote = buildQuote({ vehicleKey, serviceType, hours: serviceType === 'hourly' ? 4 : undefined, miles: serviceType === 'transfer' ? 12 : undefined });
      return {
        id,
        role: 'assistant',
        content: lang === 'es'
          ? `Aquí está su cotización para ${VEHICLES[vehicleKey]?.label || 'SUV'}:`
          : `Here's your ${VEHICLES[vehicleKey]?.label || 'SUV'} quote:`,
        quote: quote || undefined,
        suggestions: lang === 'es'
          ? ['Confirmar reserva', 'Otro vehículo', 'Agregar paradas']
          : ['Confirm booking', 'Different vehicle', 'Add stops'],
      };
    }

    // Default
    return {
      id,
      role: 'assistant',
      content: lang === 'es'
        ? 'Con mucho gusto le ayudo. Puedo cotizar transporte ejecutivo, recomendar restaurantes exclusivos o clubs nocturnos en CDMX. ¿Qué necesita?'
        : "I'd be happy to help. I can quote executive transport, recommend exclusive restaurants, or suggest VIP nightclubs in CDMX. What do you need?",
      suggestions: SUGGESTION_CHIPS[lang] || SUGGESTION_CHIPS.en,
    };
  }, [lang]);

  // Send message
  const sendMessage = useCallback((text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: ChatMessage = { id: Date.now().toString(36) + 'u', role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [input, generateResponse]);

  // Voice
  const toggleMic = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = true;
    const langMap: Record<string, string> = { es: 'es-MX', en: 'en-US', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR', ar: 'ar-SA', hi: 'hi-IN' };
    r.lang = langMap[lang] || 'en-US';

    r.onstart = () => setIsRecording(true);
    r.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
    };
    r.onend = () => {
      setIsRecording(false);
      const val = textareaRef.current?.value.trim();
      if (val) setTimeout(() => sendMessage(val), 400);
    };
    r.onerror = () => setIsRecording(false);

    recognitionRef.current = r;
    r.start();
  }, [isRecording, lang, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center" dir={langConfig.rtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col w-full max-w-[520px] min-w-[320px] h-full bg-[#141414] mx-auto">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-[hsl(var(--border))] flex items-center gap-3 bg-[hsl(var(--card))]">
          <Link to="/" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--gold))] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border-[1.5px] border-[hsl(var(--gold-dark))] flex items-center justify-center font-['Cormorant_Garamond',serif] text-xl text-[hsl(var(--gold))] flex-shrink-0 relative">
            M
            <span className="absolute bottom-[1px] right-[1px] w-[9px] h-[9px] bg-green-500 rounded-full border-2 border-[hsl(var(--card))]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-['Cormorant_Garamond',serif] text-lg font-semibold text-[hsl(var(--gold))] tracking-wider leading-none">MIKEY</div>
            <div className="w-10 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent my-1" />
            <div className="text-[10px] text-[hsl(var(--muted-foreground))] tracking-[0.12em] uppercase">Lux Tour · Mexico City</div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-lg leading-none">{langConfig.flag}</span>
            {detecting ? (
              <span className="text-[9px] text-[hsl(var(--muted-foreground))] tracking-wider uppercase px-2 py-0.5 border border-[hsl(var(--border))] rounded-full animate-pulse">detecting…</span>
            ) : (
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-[#0e0e0e] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] font-['Montserrat',sans-serif] text-[10px] py-1 px-2 rounded-full cursor-pointer outline-none hover:border-[hsl(var(--gold-dark))] hover:text-[hsl(var(--gold))] transition-all appearance-none"
              >
                {Object.entries(MIKEY_LANGS).map(([code, l]) => (
                  <option key={code} value={code}>{l.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--border))] [&::-webkit-scrollbar-thumb]:rounded-sm">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5 ${
                msg.role === 'assistant'
                  ? "bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-[hsl(var(--gold))] font-['Cormorant_Garamond',serif] text-sm"
                  : 'bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
              }`}>
                {msg.role === 'assistant' ? 'M' : '●'}
              </div>
              {/* Bubble */}
              <div className={`max-w-[82%] ${msg.role === 'assistant' ? '' : ''}`}>
                <div className={`px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-tl-[4px]'
                    : 'bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-[hsl(var(--foreground))] rounded-tr-[4px]'
                }`}>
                  {renderMarkdown(msg.content)}
                </div>

                {/* Venue cards */}
                {msg.venues && msg.venues.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3">
                    {msg.venues.map((v) => <VenueCard key={v.key} venue={v} />)}
                  </div>
                )}

                {/* Quote card */}
                {msg.quote && <QuoteCard quote={msg.quote} />}

                {/* Suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.suggestions.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => sendMessage(chip)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[hsl(var(--gold))/0.06] border border-[hsl(var(--gold-dark))] rounded-full text-[11px] text-[hsl(var(--gold))] cursor-pointer hover:bg-[hsl(var(--gold))/0.14] transition-all font-['Montserrat',sans-serif]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1f1a12] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] flex items-center justify-center text-[hsl(var(--gold))] font-['Cormorant_Garamond',serif] text-sm flex-shrink-0">M</div>
              <div className="px-3.5 py-2.5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl rounded-tl-[4px]">
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

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] flex gap-2 items-end">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder={langConfig.ph}
              rows={1}
              className="w-full bg-[#0e0e0e] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] font-['Montserrat',sans-serif] text-[13px] px-3.5 py-2.5 resize-none outline-none leading-relaxed min-h-[42px] max-h-[120px] overflow-y-auto placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--gold-dark))] transition-colors"
            />
          </div>
          <button
            onClick={toggleMic}
            className={`w-[42px] h-[42px] rounded-lg border flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
              isRecording
                ? 'border-red-500 text-red-500 animate-pulse bg-[#0e0e0e]'
                : 'bg-[#0e0e0e] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--gold-dark))] hover:text-[hsl(var(--gold))]'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-[#2a2215] to-[#3a2f1e] border border-[hsl(var(--gold-dark))] text-[hsl(var(--gold))] flex items-center justify-center cursor-pointer hover:border-[hsl(var(--gold))] hover:shadow-[0_0_14px_rgba(201,169,110,0.2)] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
