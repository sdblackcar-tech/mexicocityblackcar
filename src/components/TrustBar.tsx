import { useLanguage } from "@/i18n/LanguageContext";

const TrustBar = () => {
  const { t } = useLanguage();

  const badges = [t.trust.forbes, t.trust.embark, t.trust.division, t.trust.patents];

  return (
    <section className="border-t border-border bg-luxury-dark py-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {badges.map((badge) => (
            <span key={badge} className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
