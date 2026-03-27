import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { MessageCircle, Mic, CalendarCheck, BookOpen } from "lucide-react";

const ctaButtons = [
  { label: "Talk to Mikey", icon: MessageCircle, href: "#talk-to-mikey" },
  { label: "Push to Talk", icon: Mic, href: "#push-to-talk" },
  { label: "Request Service", icon: CalendarCheck, href: "#request-service" },
  { label: "View Blog", icon: BookOpen, href: "#blog" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Luxury black car on Mexico City streets at night"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <p
            className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Private Black Car Service
          </p>

          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            Luxury Transport in Mexico City,{" "}
            <span className="gold-text-gradient italic">Powered by Mikey AI</span>
          </h1>

          <p
            className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            From airport transfers to executive movements and custom itineraries,
            Mikey AI helps clients request service with speed, clarity, and discretion.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "1.1s" }}
          >
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
        </div>
      </section>

      {/* Services preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-16 opacity-0 animate-fade-in">
            <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">Our Services</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Curated Experiences, Seamless Logistics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Airport Transfers",
                desc: "Effortless arrivals and departures with real-time flight tracking and meet-and-greet service.",
              },
              {
                title: "Executive Movements",
                desc: "Discrete, punctual transport for business professionals and high-profile individuals.",
              },
              {
                title: "Custom Itineraries",
                desc: "Bespoke travel plans crafted by Mikey AI, tailored to your schedule and preferences.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="p-8 border border-border bg-card hover:border-gold transition-colors duration-500 group"
              >
                <h3 className="font-display text-xl text-foreground mb-3 group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mikey AI Section */}
      <section id="talk-to-mikey" className="py-24 bg-luxury-dark border-t border-b border-border">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">Introducing</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">
            Meet <span className="italic gold-text-gradient">Mikey AI</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Mikey AI is the intelligent coordination layer behind every journey. From booking to routing to real-time adjustments, Mikey ensures your travel is handled with precision — so you never have to worry about the details.
          </p>
          <a
            href="#talk-to-mikey"
            className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-primary-foreground text-sm font-body tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={16} />
            Start a Conversation
          </a>
        </div>
      </section>

      <TrustBar />
      <Footer />
    </div>
  );
};

export default Index;
