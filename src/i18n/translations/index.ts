import en from "./en";
import es from "./es";
import fr from "./fr";
import de from "./de";
import pt from "./pt";
import zh from "./zh";
import ja from "./ja";
import ko from "./ko";
import ar from "./ar";
import hi from "./hi";

export type TranslationKeys = typeof en;
export type Language = "en" | "es" | "fr" | "de" | "pt" | "zh" | "ja" | "ko" | "ar" | "hi";

export const translations: Record<Language, TranslationKeys> = {
  en, es, fr, de, pt, zh, ja, ko, ar, hi,
};

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
};

// Map country codes to languages
export const countryToLanguage: Record<string, Language> = {
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en",
  MX: "es", ES: "es", AR: "es", CO: "es", PE: "es", CL: "es", VE: "es", EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es", SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  FR: "fr", BE: "fr", CH: "fr", MC: "fr", LU: "fr", SN: "fr", CI: "fr", ML: "fr", CM: "fr",
  DE: "de", AT: "de",
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  JP: "ja",
  KR: "ko",
  SA: "ar", AE: "ar", EG: "ar", IQ: "ar", MA: "ar", DZ: "ar", SD: "ar", YE: "ar", SY: "ar", TN: "ar", JO: "ar", LB: "ar", LY: "ar", KW: "ar", OM: "ar", QA: "ar", BH: "ar",
  IN: "hi",
};
