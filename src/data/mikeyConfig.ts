export const MIKEY_CONFIG = {
  COMPANY_NAME: 'Mexico City Black Car',
  COMPANY_PHONE: '+1 858 999 1895',
  COMPANY_WHATSAPP: '+18589991895',
  COMPANY_EMAIL: 'info@mexicocityblackcar.com',
  COMPANY_WEBSITE: 'https://www.mexicocityblackcar.com',
  PARTNER_SITE: 'https://www.luxtourtravel.com',
  OPS_EMAIL: 'ops@mexicocityblackcar.com',
  EXEC_EMAIL: 'james@luxtourtravel.com',
  INFO_EMAIL: 'info@mexicocityblackcar.com',
  MARKET: 'cdmx',
  CURRENCY: 'USD',
  VIP_SPEND_THRESHOLD: 800,
  COMMISSION_BOTTLE: 0.07,
  COMMISSION_DINNER: 0.05,
};

export interface MikeyLang {
  flag: string;
  label: string;
  ph: string;
  payBtn: string;
  holdBtn: string;
  reserveBtn: string;
  rtl: boolean;
}

export const MIKEY_LANGS: Record<string, MikeyLang> = {
  es: { flag: '🇲🇽', label: 'Español', ph: 'Escribe tu mensaje…', payBtn: 'Confirmar y Pagar', holdBtn: 'Guardar Cotización', reserveBtn: 'Reservar', rtl: false },
  en: { flag: '🇺🇸', label: 'English', ph: 'Type your message…', payBtn: 'Confirm & Pay', holdBtn: 'Save Quote', reserveBtn: 'Reserve', rtl: false },
  fr: { flag: '🇫🇷', label: 'Français', ph: 'Écrivez votre message…', payBtn: 'Confirmer et Payer', holdBtn: 'Sauvegarder', reserveBtn: 'Réserver', rtl: false },
  de: { flag: '🇩🇪', label: 'Deutsch', ph: 'Nachricht eingeben…', payBtn: 'Bestätigen & Zahlen', holdBtn: 'Angebot Speichern', reserveBtn: 'Reservieren', rtl: false },
  pt: { flag: '🇧🇷', label: 'Português', ph: 'Digite sua mensagem…', payBtn: 'Confirmar e Pagar', holdBtn: 'Salvar Cotação', reserveBtn: 'Reservar', rtl: false },
  it: { flag: '🇮🇹', label: 'Italiano', ph: 'Scrivi il tuo messaggio…', payBtn: 'Conferma e Paga', holdBtn: 'Salva Preventivo', reserveBtn: 'Prenota', rtl: false },
  ja: { flag: '🇯🇵', label: '日本語', ph: 'メッセージを入力…', payBtn: '確認・支払い', holdBtn: '見積保存', reserveBtn: '予約', rtl: false },
  zh: { flag: '🇨🇳', label: '中文(简)', ph: '输入您的消息…', payBtn: '确认并支付', holdBtn: '保存报价', reserveBtn: '预订', rtl: false },
  'zh-TW': { flag: '🇹🇼', label: '中文(繁)', ph: '輸入您的訊息…', payBtn: '確認並付款', holdBtn: '儲存報價', reserveBtn: '預訂', rtl: false },
  ko: { flag: '🇰🇷', label: '한국어', ph: '메시지를 입력하세요…', payBtn: '확인 및 결제', holdBtn: '견적 저장', reserveBtn: '예약', rtl: false },
  ar: { flag: '🇸🇦', label: 'العربية', ph: 'اكتب رسالتك…', payBtn: 'تأكيد والدفع', holdBtn: 'حفظ', reserveBtn: 'احجز', rtl: true },
  ru: { flag: '🇷🇺', label: 'Русский', ph: 'Введите сообщение…', payBtn: 'Подтвердить и оплатить', holdBtn: 'Сохранить', reserveBtn: 'Забронировать', rtl: false },
  nl: { flag: '🇳🇱', label: 'Nederlands', ph: 'Typ uw bericht…', payBtn: 'Bevestigen & Betalen', holdBtn: 'Offerte Opslaan', reserveBtn: 'Reserveren', rtl: false },
  tr: { flag: '🇹🇷', label: 'Türkçe', ph: 'Mesajınızı yazın…', payBtn: 'Onayla ve Öde', holdBtn: 'Teklifi Kaydet', reserveBtn: 'Rezervasyon', rtl: false },
  pl: { flag: '🇵🇱', label: 'Polski', ph: 'Wpisz wiadomość…', payBtn: 'Potwierdź i Zapłać', holdBtn: 'Zapisz Ofertę', reserveBtn: 'Rezerwuj', rtl: false },
  sv: { flag: '🇸🇪', label: 'Svenska', ph: 'Skriv ditt meddelande…', payBtn: 'Bekräfta och Betala', holdBtn: 'Spara Offert', reserveBtn: 'Boka', rtl: false },
  hi: { flag: '🇮🇳', label: 'हिन्दी', ph: 'अपना संदेश लिखें…', payBtn: 'पुष्टि करें और भुगतान करें', holdBtn: 'उद्धरण सहेजें', reserveBtn: 'बुक करें', rtl: false },
  th: { flag: '🇹🇭', label: 'ภาษาไทย', ph: 'พิมพ์ข้อความ…', payBtn: 'ยืนยันและชำระเงิน', holdBtn: 'บันทึกใบเสนอราคา', reserveBtn: 'จอง', rtl: false },
  vi: { flag: '🇻🇳', label: 'Tiếng Việt', ph: 'Nhập tin nhắn…', payBtn: 'Xác nhận & Thanh toán', holdBtn: 'Lưu Báo Giá', reserveBtn: 'Đặt chỗ', rtl: false },
  he: { flag: '🇮🇱', label: 'עברית', ph: 'הקלד את הודעתך…', payBtn: 'אשר ושלם', holdBtn: 'שמור הצעה', reserveBtn: 'הזמן', rtl: true },
  fa: { flag: '🇮🇷', label: 'فارسی', ph: 'پیام خود را بنویسید…', payBtn: 'تأیید و پرداخت', holdBtn: 'ذخیره', reserveBtn: 'رزرو کنید', rtl: true },
};

export const GREETINGS: Record<string, string> = {
  es: `Hola, soy **Mikey** — su asistente de transporte de lujo en Ciudad de México. Puedo ayudarle con cotizaciones en tiempo real, traslados al aeropuerto, transporte ejecutivo, y recomendaciones de restaurantes y vida nocturna.\n\n¿En qué le puedo ayudar hoy?`,
  en: `Hello, I'm **Mikey** — your luxury ground transportation concierge for Mexico City. I can help with instant quotes, airport transfers, executive transport, venue recommendations, and custom itineraries.\n\nHow can I assist you today?`,
  fr: `Bonjour, je suis **Mikey** — votre assistant transport de luxe à Mexico. Je peux vous aider avec des devis instantanés, transferts aéroport, et recommandations de lieux.\n\nComment puis-je vous aider?`,
  de: `Hallo, ich bin **Mikey** — Ihr Luxus-Transportassistent in Mexiko-Stadt. Sofortige Angebote, Flughafentransfers und Empfehlungen.\n\nWie kann ich Ihnen helfen?`,
  pt: `Olá, sou **Mikey** — seu assistente de transporte de luxo na Cidade do México. Posso ajudar com cotações instantâneas, transfers e recomendações.\n\nComo posso ajudá-lo?`,
  ja: `こんにちは、私は**Mikey**です。メキシコシティの高級送迎サービスをご案内します。空港送迎、見積り、おすすめ情報をご提供します。\n\n何かお手伝いできますか？`,
  zh: `您好，我是**Mikey**——墨西哥城豪华地面交通礼宾助手。我可以为您提供即时报价、机场接送和场馆推荐。\n\n今天有什么可以帮助您？`,
  ar: `مرحباً، أنا **Mikey** — مساعدك لخدمات النقل الفاخر في مكسيكو سيتي. يمكنني المساعدة في عروض الأسعار الفورية والنقل المطاري والتوصيات.\n\nكيف يمكنني مساعدتك اليوم؟`,
  ko: `안녕하세요, 저는 **Mikey**입니다 — 멕시코시티 럭셔리 교통 컨시어지. 즉시 견적, 공항 이동, 추천 서비스를 제공합니다.\n\n무엇을 도와드릴까요?`,
  hi: `नमस्ते, मैं **Mikey** हूँ — मेक्सिको सिटी में आपका लक्जरी ट्रांसपोर्ट कंसीयज। तुरंत कोटेशन, एयरपोर्ट ट्रांसफर और सुझाव।\n\nआज मैं कैसे मदद कर सकता हूँ?`,
};

export const COUNTRY_LANG: Record<string, string> = {
  MX: 'es', ES: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es', BO: 'es', PY: 'es', UY: 'es',
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  FR: 'fr', BE: 'fr', LU: 'fr',
  DE: 'de', AT: 'de', CH: 'de',
  BR: 'pt', PT: 'pt',
  IT: 'it',
  JP: 'ja', CN: 'zh', TW: 'zh-TW', HK: 'zh', KR: 'ko',
  SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', KW: 'ar', QA: 'ar', BH: 'ar', OM: 'ar',
  RU: 'ru', UA: 'uk',
  NL: 'nl', TR: 'tr', PL: 'pl', SE: 'sv',
  IN: 'hi', TH: 'th', VN: 'vi',
  IL: 'he', IR: 'fa',
};

export const SUGGESTION_CHIPS: Record<string, string[]> = {
  es: ['Transfer aeropuerto', 'Servicios de concierge', 'Viaje en grupo', 'Acceso VIP', 'Servicio por hora', 'Reservas de cena'],
  en: ['Airport transfer', 'Concierge services', 'Group travel', 'VIP access', 'Hourly service', 'Dinner reservations'],
  fr: ['Transfert aéroport', 'Services concierge', 'Voyage de groupe', 'Accès VIP'],
  de: ['Flughafentransfer', 'Concierge-Service', 'Gruppenreise', 'VIP-Zugang'],
  pt: ['Transfer aeroporto', 'Serviços concierge', 'Viagem em grupo', 'Acesso VIP'],
  ja: ['空港送迎', 'コンシェルジュ', 'グループ旅行', 'VIPアクセス'],
  zh: ['机场接送', '礼宾服务', '团体出行', 'VIP通道'],
  ko: ['공항 셔틀', '컨시어지 서비스', '단체 여행', 'VIP 액세스'],
  ar: ['نقل المطار', 'خدمات الكونسيرج', 'سفر جماعي', 'وصول VIP'],
  hi: ['एयरपोर्ट ट्रांसफर', 'कंसीयज सेवाएं', 'ग्रुप ट्रैवल', 'VIP एक्सेस'],
};

export const DRIVERS: Record<string, { initials: string; specialty: string; zone: string; }> = {
  Ivan: { initials: 'IV', specialty: 'GM · Born in CDMX · 25 yrs ground transport & logistics', zone: 'All CDMX' },
  Barbie: { initials: 'BA', specialty: 'Concierge · Culinary expert · Exclusive dining access', zone: 'Dining/Events' },
  Jaime: { initials: 'JA', specialty: 'Lux Tour Partner · Touring musicians & festivals · 20 yrs', zone: 'Entertainment' },
};
