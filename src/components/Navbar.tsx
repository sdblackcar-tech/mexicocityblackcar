import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "#blog" },
  { label: "Terms", to: "/terms" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
          <a
            href="#talk-to-mikey"
            className="ml-4 px-5 py-2 text-sm font-body tracking-widest uppercase border border-gold text-gold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Talk to Mikey
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
          <a
            href="#talk-to-mikey"
            className="block mt-3 px-5 py-2 text-sm font-body tracking-widest uppercase border border-gold text-gold text-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Talk to Mikey
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
