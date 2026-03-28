export const MIKEY_CONFIG = {
  COMPANY_NAME: 'Lux Tour Travel',
  COMPANY_PHONE: '+1 858 999 1895',
  COMPANY_WHATSAPP: '+1 858 999 1895',
  COMPANY_EMAIL: 'info@luxtourtravel.com',
  COMPANY_WEBSITE: 'luxtourtravel.com',
};

export interface MikeyLang {
  flag: string;
  label: string;
  ph: string;
  name: string;
  rtl: boolean;
}

export const MIKEY_LANGS: Record<string, MikeyLang> = {
  es: { flag: '🇲🇽', label: 'Español', ph: 'Escribe o usa el micrófono…', name: 'Spanish', rtl: false },
  en: { flag: '🇺🇸', label: 'English', ph: 'Type or use the microphone…', name: 'English', rtl: false },
  fr: { flag: '🇫🇷', label: 'Français', ph: 'Écrivez ou utilisez le micro…', name: 'French', rtl: false },
  de: { flag: '🇩🇪', label: 'Deutsch', ph: 'Tippen oder Mikrofon nutzen…', name: 'German', rtl: false },
  pt: { flag: '🇧🇷', label: 'Português', ph: 'Digite ou use o microfone…', name: 'Portuguese', rtl: false },
  ja: { flag: '🇯🇵', label: '日本語', ph: '入力またはマイクを使用…', name: 'Japanese', rtl: false },
  zh: { flag: '🇨🇳', label: '中文', ph: '输入或使用麦克风…', name: 'Chinese', rtl: false },
  ko: { flag: '🇰🇷', label: '한국어', ph: '입력하거나 마이크 사용…', name: 'Korean', rtl: false },
  ar: { flag: '🇸🇦', label: 'العربية', ph: 'اكتب أو استخدم الميكروفون…', name: 'Arabic', rtl: true },
  hi: { flag: '🇮🇳', label: 'हिन्दी', ph: 'टाइप करें या माइक का उपयोग करें…', name: 'Hindi', rtl: false },
};

export const GREETINGS: Record<string, string> = {
  es: `Buen día — soy **Mikey**, su concierge de Lux Tour para la Ciudad de México.\n\nPuedo cotizar transporte ejecutivo en todo el CDMX, recomendar restaurantes y clubs exclusivos, y enviar confirmación por correo al instante.\n\nPuede escribir o usar el 🎤 micrófono.\n\n¿A dónde va hoy?`,
  en: `Good day — I'm **Mikey**, your Lux Tour concierge for Mexico City.\n\nI can quote executive transport anywhere in CDMX, recommend the best restaurants and clubs, and send instant email confirmations.\n\nFeel free to type or tap the 🎤 mic button.\n\nWhere are you heading today?`,
  fr: `Bonjour — je suis **Mikey**, votre concierge Lux Tour pour Mexico.\n\nJe peux organiser votre transport exécutif dans tout CDMX, recommander restaurants et clubs, et envoyer des confirmations par e-mail.\n\nOù souhaitez-vous aller aujourd'hui ?`,
  de: `Guten Tag — ich bin **Mikey**, Ihr Lux Tour Concierge für Mexiko-Stadt.\n\nIch kann Executive-Transport in ganz CDMX buchen, Restaurants und Clubs empfehlen und Bestätigungs-E-Mails senden.\n\nWohin fahren Sie heute?`,
  pt: `Bom dia — sou **Mikey**, seu concierge Lux Tour para a Cidade do México.\n\nPosso cotar transporte executivo em toda CDMX, recomendar restaurantes e clubs, e enviar confirmações por e-mail.\n\nPara onde vai hoje?`,
  ja: `こんにちは — メキシコシティのLux Tourコンシェルジュ、**Mikey**です。\n\nCDMX全域のエグゼクティブ送迎のお見積り、レストランやクラブのご案内、メールでの即時確認をいたします。\n\n本日はどちらへ？`,
  zh: `您好 — 我是 **Mikey**，Lux Tour 墨西哥城的礼宾服务。\n\n我可以为您报价整个 CDMX 的行政交通，推荐最佳餐厅和俱乐部，并发送即时电子邮件确认。\n\n今天要去哪里？`,
  ko: `안녕하세요 — 저는 멕시코시티의 Lux Tour 컨시어지 **Mikey**입니다.\n\nCDMX 전역의 이그제큐티브 교통편 견적, 최고의 레스토랑과 클럽 추천, 즉시 이메일 확인을 도와드립니다.\n\n오늘 어디로 가시나요?`,
  ar: `مرحباً — أنا **مايكي**، خدمة كونسيرج لوكس تور في مكسيكو سيتي.\n\nيمكنني تقديم عروض أسعار للنقل التنفيذي في جميع أنحاء CDMX، والتوصية بأفضل المطاعم والنوادي.\n\nإلى أين تتجه اليوم؟`,
  hi: `नमस्ते — मैं **Mikey** हूँ, मेक्सिको सिटी के लिए आपका Lux Tour कंसीयज।\n\nमैं CDMX में कहीं भी एग्जीक्यूटिव ट्रांसपोर्ट की कोटेशन दे सकता हूँ, बेहतरीन रेस्तरां और क्लब सुझा सकता हूँ।\n\nआज कहाँ जा रहे हैं?`,
};

export const COUNTRY_LANG: Record<string, string> = {
  MX: 'es', ES: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  FR: 'fr', BE: 'fr', LU: 'fr',
  DE: 'de', AT: 'de', CH: 'de',
  BR: 'pt', PT: 'pt',
  JP: 'ja', CN: 'zh', TW: 'zh', HK: 'zh', KR: 'ko',
  SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', KW: 'ar', QA: 'ar',
  IN: 'hi',
};

export const SUGGESTION_CHIPS: Record<string, string[]> = {
  es: ['Cotizar transporte', 'Restaurantes en Polanco', 'Transfer al aeropuerto', 'Clubs nocturnos VIP'],
  en: ['Quote transport', 'Polanco restaurants', 'Airport transfer', 'VIP nightclubs'],
  fr: ['Devis transport', 'Restaurants Polanco', 'Transfert aéroport', 'Clubs VIP'],
  de: ['Transport anfragen', 'Restaurants Polanco', 'Flughafentransfer', 'VIP-Clubs'],
  pt: ['Orçamento transporte', 'Restaurantes Polanco', 'Transfer aeroporto', 'Clubes VIP'],
  ja: ['交通見積もり', 'ポランコのレストラン', '空港送迎', 'VIPクラブ'],
  zh: ['交通报价', '波兰科餐厅', '机场接送', 'VIP俱乐部'],
  ko: ['교통편 견적', '폴란코 레스토랑', '공항 셔틀', 'VIP 클럽'],
  ar: ['عرض سعر نقل', 'مطاعم بولانكو', 'نقل المطار', 'نوادي VIP'],
  hi: ['ट्रांसपोर्ट कोट', 'पोलान्को रेस्तरां', 'एयरपोर्ट ट्रांसफर', 'VIP क्लब'],
};
