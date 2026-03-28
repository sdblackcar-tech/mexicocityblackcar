import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { seoKeywords, seoDescriptions, seoTitles } from "@/i18n/seo";
import type { Language } from "@/i18n/translations";

const SITE_URL = "https://mexicocityblackcar.com";

const hreflangMap: Record<Language, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  ar: "ar",
  hi: "hi",
};

const SEOHead = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Update title
    document.title = seoTitles[language];

    // Helper to set or create a meta tag
    const setMeta = (attr: string, attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Core meta
    setMeta("name", "description", seoDescriptions[language]);
    setMeta("name", "keywords", seoKeywords[language]);
    setMeta("name", "language", hreflangMap[language]);

    // Open Graph
    setMeta("property", "og:title", seoTitles[language]);
    setMeta("property", "og:description", seoDescriptions[language]);
    setMeta("property", "og:locale", language === "zh" ? "zh_CN" : language === "pt" ? "pt_BR" : `${language}_${language.toUpperCase()}`);

    // Twitter
    setMeta("name", "twitter:title", seoTitles[language]);
    setMeta("name", "twitter:description", seoDescriptions[language]);

    // Remove old hreflang links
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    // Add hreflang links for all languages
    const path = window.location.pathname;
    Object.entries(hreflangMap).forEach(([lang, hreflang]) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hreflang;
      link.href = `${SITE_URL}${path}`;
      document.head.appendChild(link);
    });

    // x-default
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = `${SITE_URL}${path}`;
    document.head.appendChild(defaultLink);

    // JSON-LD structured data
    let ldScript = document.getElementById("json-ld-org") as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "json-ld-org";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Mexico City Black Car",
      description: seoDescriptions[language],
      url: SITE_URL,
      areaServed: {
        "@type": "City",
        name: "Mexico City",
      },
      serviceType: "Luxury Black Car Transportation",
      brand: {
        "@type": "Brand",
        name: "Mexico City Black Car",
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Infinite Logistics Technologies",
      },
      keywords: seoKeywords[language],
    });
  }, [language]);

  return null;
};

export default SEOHead;
