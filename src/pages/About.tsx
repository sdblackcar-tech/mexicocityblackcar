import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const values = [
    { title: t.about.discretion, desc: t.about.discretionDesc },
    { title: t.about.precision, desc: t.about.precisionDesc },
    { title: t.about.innovation, desc: t.about.innovationDesc },
    { title: t.about.excellence, desc: t.about.excellenceDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4 opacity-0 animate-fade-in">
            {t.about.tagline}
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {t.about.title}{" "}
            <span className="italic gold-text-gradient">{t.about.titleHighlight}</span>
          </h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
            <p>{t.about.p4}</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {values.map((value) => (
              <div key={value.title} className="p-6 border border-border hover:border-gold transition-colors duration-500">
                <h3 className="font-display text-lg text-gold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
