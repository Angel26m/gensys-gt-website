import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Genesys GT" },
      { name: "description", content: "About Genesys Global Technologies — Oman's trusted IT, CCTV and security partner." },
    ],
  }),
});

function AboutPage() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">About Us</div>
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">Built for Oman's businesses</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          Genesys Global Technologies is a complete IT solutions provider in Oman, delivering CCTV, gate barriers,
          attendance systems, POS software, and IT hardware to businesses of every size.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-10">
          Our mission is simple: bring reliable, modern technology to Omani businesses with quality products,
          professional installation, and round-the-clock support.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-border">
          {[["500+", "Projects"], ["10+", "Years"], ["200+", "Clients"], ["24/7", "Support"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display font-bold text-3xl text-primary">{n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
