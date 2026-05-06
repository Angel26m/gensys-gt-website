import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Camera, Fingerprint, Cpu, Bell, Code2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_site/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Genesys GT | IT, CCTV & Security Solutions in Oman" },
      { name: "description", content: "From CCTV and gate barriers to POS and IT infrastructure — Genesys GT is Oman's one-stop technology partner." },
    ],
  }),
});

const SERVICES = [
  { icon: Camera, title: "CCTV & Surveillance", desc: "IP cameras, NVR/DVR, video analytics & remote monitoring." },
  { icon: ShieldCheck, title: "Gate Barriers & Access", desc: "Boom barriers, bollards, sliding gates & parking systems." },
  { icon: Fingerprint, title: "Attendance & Access Control", desc: "Biometric, fingerprint and face recognition systems." },
  { icon: Bell, title: "VDP & Intercom", desc: "Video door phones, intercom & visitor management." },
  { icon: Code2, title: "Web & Software Development", desc: "Custom websites, apps, POS & ERP solutions." },
  { icon: Cpu, title: "IT Infrastructure & Supply", desc: "Laptops, servers, networking & structured cabling." },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-accent/10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-accent2/10 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em] bg-accent/15 border border-accent/40 text-accent mb-6">
            Oman's Trusted IT & Security Partner
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Complete IT Infrastructure & <span className="text-accent">Security Solutions</span> for Modern Business
          </h1>
          <p className="max-w-xl mx-auto text-white/75 text-base md:text-lg mb-8">
            From CCTV surveillance and gate barriers to POS systems, attendance and custom software — Genesys GT is your one-stop technology partner in Oman.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/products" className="bg-accent2 hover:bg-accent2/90 text-accent2-foreground font-medium px-7 py-3 rounded-lg transition-colors" style={{ boxShadow: "var(--shadow-cta)" }}>
              Explore Products
            </Link>
            <Link to="/contact" className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium px-7 py-3 rounded-lg transition-colors">
              Get a Free Quote
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-3xl mx-auto">
            {[["500+", "Projects"], ["10+", "Years"], ["200+", "Clients"], ["24/7", "Support"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-display font-bold text-2xl md:text-3xl text-accent">{n}</div>
                <div className="text-[11px] uppercase tracking-widest text-white/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-secondary px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">What We Do</div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">End-to-End IT & Security Services</h2>
          <p className="text-muted-foreground max-w-xl mb-10">
            Comprehensive technology solutions for businesses across Oman — from supply and installation to ongoing support.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6 hover:-translate-y-1 transition-all hover:shadow-lg">
                <div className="w-11 h-11 rounded-lg bg-accent/10 grid place-items-center mb-4 text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-primary mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
              View all services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-20" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to upgrade your business?</h2>
          <p className="text-white/70 mb-8">Tell us what you need — we'll get back with a tailored quote.</p>
          <Link to="/contact" className="inline-block bg-accent2 hover:bg-accent2/90 text-accent2-foreground font-medium px-8 py-3.5 rounded-lg" style={{ boxShadow: "var(--shadow-cta)" }}>
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
