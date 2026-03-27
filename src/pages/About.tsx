import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4 opacity-0 animate-fade-in">
            About Us
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The Future of Luxury{" "}
            <span className="italic gold-text-gradient">Ground Transport</span>
          </h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p>
              Mexico City Black Car was born from a simple conviction: that luxury transportation should be as intelligent as it is elegant. As a division of Infinite Logistics Technologies, we combine decades of logistics expertise with cutting-edge AI to redefine the standard of ground transport in Mexico City.
            </p>
            <p>
              At the heart of our operation is <span className="text-gold font-medium">Mikey AI</span> — our proprietary artificial intelligence system that manages booking, routing, communication, and real-time coordination. Mikey doesn't just dispatch vehicles; it anticipates needs, optimizes every movement, and ensures seamless service from start to finish.
            </p>
            <p>
              Our fleet consists exclusively of premium black car sedans and SUVs, maintained to the highest standards and operated by vetted, professional chauffeurs who understand the meaning of discretion.
            </p>
            <p>
              Whether you're arriving at Benito Juárez International Airport, navigating meetings across Polanco and Reforma, or exploring the city on a custom itinerary — Mexico City Black Car delivers an experience that's precise, private, and unmistakably luxurious.
            </p>
          </div>

          {/* Values */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {[
              { title: "Discretion", desc: "Privacy is not a feature — it's a standard." },
              { title: "Precision", desc: "Every detail accounted for, every second optimized." },
              { title: "Innovation", desc: "AI-powered logistics with patents pending." },
              { title: "Excellence", desc: "Endorsed by Forbes. Partnered with Embark Beyond." },
            ].map((value) => (
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
