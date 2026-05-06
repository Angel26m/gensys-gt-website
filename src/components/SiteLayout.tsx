import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-accent2 text-accent2-foreground text-xs font-medium text-center px-4 py-2">
        Trusted IT, CCTV & Security Partner in Oman · info@genesysgt.com
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-accent grid place-items-center">
              <span className="font-display font-extrabold text-primary text-base">G</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base">Genesys GT</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-accent">Global Technologies</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`text-sm transition-colors hover:text-accent ${
                  pathname === n.to ? "text-accent" : "text-primary-foreground/80"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-accent2 hover:bg-accent2/90 text-accent2-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-primary border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm text-primary-foreground/90 hover:text-accent"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="bg-accent2 text-accent2-foreground text-sm font-medium px-4 py-2 rounded-md text-center"
            >
              Get a Quote
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#05121f] text-white/50 px-6 py-8 text-center text-xs">
        <div className="max-w-6xl mx-auto">
          <strong className="text-white/85">Genesys Global Technologies</strong> — IT Solutions, CCTV & Security Systems in Oman
          <div className="flex gap-4 justify-center mt-3 flex-wrap">
            <Link to="/services" className="text-white/40 hover:text-accent">Services</Link>
            <Link to="/products" className="text-white/40 hover:text-accent">Products</Link>
            <Link to="/contact" className="text-white/40 hover:text-accent">Contact</Link>
            <Link to="/admin" className="text-white/40 hover:text-accent">Admin</Link>
          </div>
          <div className="mt-3 text-white/30">© {new Date().getFullYear()} Genesys GT. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
