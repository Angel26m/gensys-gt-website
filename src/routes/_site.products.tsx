import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Package, MessageCircle, Mail } from "lucide-react";
import { whatsappLink, mailtoLink } from "@/lib/contact";

export const Route = createFileRoute("/_site/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — Genesys GT" },
      { name: "description", content: "Browse weekly-updated IT, CCTV and POS products available in Oman from Genesys GT." },
    ],
  }),
});

type Product = Database["public"]["Tables"]["products"]["Row"];

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string>("All");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = activeCat === "All" ? products : products.filter((p) => p.category === activeCat);

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">Products</div>
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3">This Week's Products</h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Our catalog is refreshed every week. Browse what's currently in stock and request a quote or buy directly.
        </p>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`text-sm px-4 py-1.5 rounded-md border transition-colors ${
                  activeCat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-accent hover:text-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <Package className="mx-auto text-muted-foreground mb-3" size={32} />
            <p className="text-muted-foreground mb-4">No products listed yet. Check back soon!</p>
            <Link to="/contact" className="text-accent text-sm font-medium hover:underline">
              Request a custom quote →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  const inquiry = `Hi Genesys GT, I'm interested in: ${p.name}${p.price ? ` (OMR ${p.price})` : ""}. Please share more details.`;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-accent/40 transition-all">
      <div className="aspect-[4/3] bg-secondary flex items-center justify-center overflow-hidden">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Package className="text-muted-foreground" size={48} />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-primary">{p.name}</h3>
          {p.badge && (
            <span className="text-[10px] bg-accent/10 text-accent border border-accent/30 rounded px-2 py-0.5 font-medium whitespace-nowrap">
              {p.badge}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{p.category}</div>
        {p.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
        {p.price !== null && (
          <div className="font-display font-bold text-xl text-primary mb-3">
            OMR {Number(p.price).toFixed(2)}
          </div>
        )}
        {!p.in_stock && <div className="text-xs text-destructive mb-2">Out of stock</div>}

        <div className="flex gap-2">
          <a
            href={whatsappLink(inquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-accent2 hover:bg-accent2/90 text-accent2-foreground text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <a
            href={mailtoLink(`Quote: ${p.name}`, inquiry)}
            className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-3 py-2 rounded-md transition-colors"
            aria-label="Email"
          >
            <Mail size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
