const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-lg text-gold mb-4">Mexico City Black Car</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Luxury transportation and logistics, powered by Mikey AI. Discretion, precision, and elegance in every journey.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-body tracking-widest uppercase text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              {["Home", "About", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <a href={item === "Home" ? "/" : item === "About" ? "/about" : "/terms"} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-body tracking-widest uppercase text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              {["Instagram", "LinkedIn", "X"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground tracking-widest">
            © {new Date().getFullYear()} Mexico City Black Car. A division of Infinite Logistics Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
