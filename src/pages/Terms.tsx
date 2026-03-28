import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();

  const sections = [
    { title: t.terms.s1Title, body: t.terms.s1 },
    { title: t.terms.s2Title, body: t.terms.s2 },
    { title: t.terms.s3Title, body: t.terms.s3 },
    { title: t.terms.s4Title, body: t.terms.s4 },
    { title: t.terms.s5Title, body: t.terms.s5 },
    { title: t.terms.s6Title, body: t.terms.s6 },
    { title: t.terms.s7Title, body: t.terms.s7 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">
            {t.terms.tagline}
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-12">
            {t.terms.title}
          </h1>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-lg text-foreground mb-3">{s.title}</h2>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
