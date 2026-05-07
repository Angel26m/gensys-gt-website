import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, MapPin, MessageCircle, Phone, X } from "lucide-react";
import { COMPANY_EMAIL, COMPANY_LOCATION_URL, COMPANY_PHONE, COMPANY_WHATSAPP, mailtoLink, whatsappLink } from "@/lib/contact";
import { useQuoteCart, formatQuoteMessage } from "@/lib/quote-cart";

export const Route = createFileRoute("/_site/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact & Quote — Genesys GT" },
      { name: "description", content: "Request a free quote from Genesys GT — IT, CCTV, security and POS solutions in Oman." },
    ],
  }),
});

const QuoteSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  product_interest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us what you need").max(2000),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { items, remove, clear } = useQuoteCart();
  const cartList = items.map((i) => i.name).join(", ");
  const cartMessage = formatQuoteMessage(items);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = QuoteSchema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("quote_requests").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      product_interest: parsed.data.product_interest || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send. Please try WhatsApp or email instead.");
      return;
    }
    setDone(true);
    toast.success("Quote request received — we'll be in touch shortly!");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <section className="px-6 py-16 md:py-20" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">Get in touch</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Let's build something secure</h1>
          <p className="text-white/75 mb-8">Reach us directly or send a quote request — we usually reply within a few hours.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={whatsappLink("Hi Genesys GT, I'd like a quote.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-colors"
            >
              <MessageCircle className="mx-auto mb-2 text-accent" size={22} />
              <div className="font-medium text-sm">WhatsApp</div>
              <div className="text-xs text-white/60 mt-1">+{COMPANY_WHATSAPP}</div>
            </a>
            <a
              href={mailtoLink("Quote request", "Hi Genesys GT, ")}
              className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-colors"
            >
              <Mail className="mx-auto mb-2 text-accent" size={22} />
              <div className="font-medium text-sm">Email</div>
              <div className="text-xs text-white/60 mt-1">{COMPANY_EMAIL}</div>
            </a>
            <a
              href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}
              className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-colors"
            >
              <Phone className="mx-auto mb-2 text-accent" size={22} />
              <div className="font-medium text-sm">Call</div>
              <div className="text-xs text-white/60 mt-1">{COMPANY_PHONE}</div>
            </a>
          </div>

          <a
            href={COMPANY_LOCATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm text-white/80 hover:text-accent transition-colors"
          >
            <MapPin size={16} className="text-accent" /> View our location on Google Maps
          </a>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-primary mb-2">Request a Quote</h2>
          <p className="text-muted-foreground text-sm mb-6">Fill in your details and we'll send a tailored quote.</p>

          {done && (
            <div className="bg-accent/10 border border-accent/30 text-primary rounded-md p-3 mb-5 text-sm">
              Thanks — we received your request and will reply shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name *" name="name" required />
              <Field label="Email *" name="email" type="email" required />
              <Field label="Phone" name="phone" />
              <Field label="Company" name="company" />
            </div>
            <Field label="Product / Service of interest" name="product_interest" placeholder="e.g. CCTV system, POS, attendance machine" />
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                maxLength={2000}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tell us about your project, location and timeline..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent2 hover:bg-accent2/90 disabled:opacity-60 text-accent2-foreground font-medium py-3 rounded-md transition-colors"
              style={{ boxShadow: "var(--shadow-cta)" }}
            >
              {submitting ? "Sending..." : "Send Quote Request"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        maxLength={255}
        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
