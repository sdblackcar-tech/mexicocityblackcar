const TrustBar = () => {
  const badges = [
    "Endorsed by Forbes",
    "Partnered with Embark Beyond",
    "Division of Infinite Logistics Technologies",
    "Patents Pending",
  ];

  return (
    <section className="border-t border-border bg-luxury-dark py-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
