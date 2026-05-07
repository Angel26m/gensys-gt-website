import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Package, MessageCircle, Mail, Plus, Check, X, FileText } from "lucide-react";
import { whatsappLink, mailtoLink } from "@/lib/contact";
import { useQuoteCart, formatQuoteMessage } from "@/lib/quote-cart";


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
    <>
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">Products</div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3">This Week's Products</h1>
          <p className="text-muted-foreground max-w-xl mb-8">
            Add products of interest to your quote list and we'll send a single tailored quote covering all of them.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <QuoteCartBar />
    </>
  );
}

function QuoteCartBar() {
  const { items, remove, clear } = useQuoteCart();
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  const message = formatQuoteMessage(items);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,640px)]">
      {open && (
        <div className="bg-card border border-border rounded-xl shadow-xl p-4 mb-2 max-h-[60vh] overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-primary text-sm">Your Quote List ({items.length})</h3>
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">Clear all</button>
          </div>
          <ul className="space-y-2 mb-4">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-2 text-sm border-b border-border pb-2">
                <div className="min-w-0">
                  <div className="font-medium text-primary truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.category}{i.price !== null ? ` · OMR ${Number(i.price).toFixed(2)}` : ""}</div>
                </div>
                <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Remove">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Link
              to="/contact"
              className="bg-accent2 hover:bg-accent2/90 text-accent2-foreground text-sm font-medium px-3 py-2 rounded-md text-center inline-flex items-center justify-center gap-1.5"
            >
              <FileText size={14} /> Get Quote
            </Link>
            <a
              href={whatsappLink(`Hi Genesys GT,\n\n${message}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-3 py-2 rounded-md text-center inline-flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={mailtoLink("Quote request — multiple products", message)}
              className="bg-secondary hover:bg-secondary/80 text-primary text-sm font-medium px-3 py-2 rounded-md text-center inline-flex items-center justify-center gap-1.5 border border-border"
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-primary text-primary-foreground rounded-full shadow-lg px-5 py-3 flex items-center justify-between gap-3 hover:bg-primary/90 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <FileText size={16} className="text-accent" />
          {items.length} item{items.length > 1 ? "s" : ""} in your quote list
        </span>
        <span className="text-xs text-accent font-medium">{open ? "Close" : "Review & Send"}</span>
      </button>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const inquiry = `Hi Genesys GT, I'm interested in: ${p.name}${p.price ? ` (OMR ${p.price})` : ""}. Please share more details.`;
  const { add, remove, has } = useQuoteCart();
  const inCart = has(p.id);

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

        <button
          onClick={() =>
            inCart
              ? remove(p.id)
              : add({ id: p.id, name: p.name, price: p.price !== null ? Number(p.price) : null, category: p.category })
          }
          className={`w-full mb-2 flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md transition-colors border ${
            inCart
              ? "bg-accent/10 text-accent border-accent/40"
              : "bg-accent2 hover:bg-accent2/90 text-accent2-foreground border-transparent"
          }`}
        >
          {inCart ? <><Check size={14} /> Added to Quote</> : <><Plus size={14} /> Add to Quote</>}
        </button>
        <div className="flex gap-2">
          <a
            href={whatsappLink(inquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-secondary hover:bg-secondary/80 border border-border text-primary text-sm font-medium px-3 py-2 rounded-md transition-colors"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <a
            href={mailtoLink(`Quote: ${p.name}`, inquiry)}
            className="flex items-center justify-center gap-1.5 bg-secondary hover:bg-secondary/80 border border-border text-primary text-sm font-medium px-3 py-2 rounded-md transition-colors"
            aria-label="Email"
          >
            <Mail size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
