import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useQuoteCart, formatQuoteMessage } from "@/lib/quote-cart";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/contact")({
  component: ContactPage,
});

const QuoteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  product_interest: z.string().optional().or(z.literal("")),
  message: z.string().min(1),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { items, clear } = useQuoteCart();

  const cartList = items.map((i) => i.name).join(", ");
  const cartMessage = formatQuoteMessage(items);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const parsed = QuoteSchema.safeParse(Object.fromEntries(fd.entries()));

    if (!parsed.success) {
      toast.error("Please check the form");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...parsed.data,
        product_interest: parsed.data.product_interest || cartList,
        message: parsed.data.message || cartMessage,
      };

      // 1️⃣ SUPABASE (admin dashboard)
      const { error } = await supabase
        .from("quote_requests")
        .insert(payload);

      if (error) throw error;

      // 2️⃣ GOOGLE SHEETS (IMPORTANT FIX: NO HEADERS)
      await fetch(
        "https://script.google.com/macros/s/AKfycbzL9AgR9gexDfbVcXxLtc5mrAY5C0tBIFxCxtH36_Dfz3bizJdW3lR_hRxU-c1oJYcL2Q/exec",
        {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            products: cartList,
          }),
        }
      );

      setDone(true);
      toast.success("Quote request sent successfully!");

      (e.target as HTMLFormElement).reset();
      clear();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. Please try WhatsApp or email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="px-6 py-16">
      <div className="max-w-2xl mx-auto">

        {done && (
          <div className="mb-4 p-3 bg-green-100 rounded">
            Thanks! We received your request.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <Field label="Name *" name="name" required />
          <Field label="Email *" name="email" type="email" required />
          <Field label="Phone" name="phone" />
          <Field label="Company" name="company" />

          <Field
            label="Product Interest"
            name="product_interest"
            defaultValue={cartList}
          />

          <div>
            <label className="text-sm">Message *</label>
            <textarea
              name="message"
              required
              rows={5}
              defaultValue={cartMessage}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            disabled={submitting}
            className="w-full bg-black text-white p-3 rounded"
          >
            {submitting ? "Sending..." : "Send Quote Request"}
          </button>

        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}