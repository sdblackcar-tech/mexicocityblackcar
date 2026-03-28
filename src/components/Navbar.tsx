import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, language, setLanguage, languageNames, allLanguages } = useLanguage();

  const navLinks = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.about, to: "/about" },
    { label: t.nav.blog, to: "#blog" },
    { label: t.nav.terms, to: "/terms" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-12">
        <Link to="/" className="font-display text-xl tracking-wider text-gold">
          MEXICO CITY BLACK CAR
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors duration-300"
            >
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-background border border-border shadow-lg py-2 min-w-[140px] z-50">
                {allLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang as Language); setLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                      lang === language ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {languageNames[lang as Language]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#talk-to-mikey"
            className="ml-4 px-5 py-2 text-sm font-body tracking-widest uppercase border border-gold text-gold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {t.nav.talkToMikey}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-6 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="py-3 border-t border-border mt-3">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <Globe size={12} /> Language
            </p>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang as Language); }}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    lang === language ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {languageNames[lang as Language]}
                </button>
              ))}
            </div>
          </div>

          <a
            href="#talk-to-mikey"
            className="block mt-3 px-5 py-2 text-sm font-body tracking-widest uppercase border border-gold text-gold text-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {t.nav.talkToMikey}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
