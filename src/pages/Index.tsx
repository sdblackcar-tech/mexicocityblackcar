import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { MessageCircle, Mic, CalendarCheck, BookOpen } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  const ctaButtons = [
    { label: t.hero.ctaTalk, icon: MessageCircle, href: "#talk-to-mikey" },
    { label: t.hero.ctaPush, icon: Mic, href: "#push-to-talk" },
    { label: t.hero.ctaRequest, icon: CalendarCheck, href: "#request-service" },
    { label: t.hero.ctaBlog, icon: BookOpen, href: "#blog" },
  ];

  const services = [
    { title: t.services.airport, desc: t.services.airportDesc },
    { title: t.services.executive, desc: t.services.executiveDesc },
    { title: t.services.custom, desc: t.services.customDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Luxury black car on Mexico City streets at night" width={1920} height={1080} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl hero-text-shadow">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {t.hero.tagline}
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight text-white font-bold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {t.hero.title}{" "}
            <span className="gold-text-gradient italic font-bold">{t.hero.titleHighlight}</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "1.1s" }}>
            {ctaButtons.map((cta, i) => (
              <a
                key={cta.label}
                href={cta.href}
                className={`group inline-flex items-center gap-2 px-6 py-3 text-sm font-body tracking-widest uppercase transition-all duration-300 ${
                  i === 0
                    ? "gold-gradient text-primary-foreground font-medium hover:opacity-90"
                    : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                }`}
              >
                <cta.icon size={16} className={i === 0 ? "" : "group-hover:text-gold transition-colors"} />
                {cta.label}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-16 opacity-0 animate-fade-in">
            <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">{t.services.tagline}</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">{t.services.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="p-8 border border-border bg-card hover:border-gold transition-colors duration-500 group">
                <h3 className="font-display text-xl text-foreground mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mikey AI */}
      <section id="talk-to-mikey" className="py-24 bg-luxury-dark border-t border-b border-border">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">{t.mikey.tagline}</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">
            {t.mikey.title} <span className="italic gold-text-gradient">{t.mikey.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">{t.mikey.desc}</p>
          <a href="#talk-to-mikey" className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-primary-foreground text-sm font-body tracking-widest uppercase hover:opacity-90 transition-opacity">
            <MessageCircle size={16} />
            {t.mikey.cta}
          </a>
        </div>
      </section>

      <TrustBar />
      <Footer />
    </div>
  );
};

export default Index;
