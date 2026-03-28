import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-lg text-gold mb-4">{t.footer.brand}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.brandDesc}</p>
          </div>
          <div>
            <h4 className="text-sm font-body tracking-widest uppercase text-foreground mb-4">{t.footer.navigation}</h4>
            <ul className="space-y-2">
              {[
                { label: t.footer.navHome, href: "/" },
                { label: t.footer.navAbout, href: "/about" },
                { label: t.footer.navTerms, href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-body tracking-widest uppercase text-foreground mb-4">{t.footer.connect}</h4>
            <div className="flex gap-4">
              {["Instagram"].map((social) => (
                <a key={social} href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground tracking-widest">
            {t.footer.copyright.replace("{year}", new Date().getFullYear().toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
