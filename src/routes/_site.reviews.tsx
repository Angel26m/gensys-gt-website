import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Star } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/_site/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Customer Reviews — Genesys GT" },
      { name: "description", content: "What Oman customers say about Genesys GT IT, CCTV and security solutions." },
    ],
  }),
});

type Review = Database["public"]["Tables"]["reviews"]["Row"];

const ReviewSchema = z.object({
  customer_name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000),
});

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = ReviewSchema.safeParse({
      customer_name: fd.get("customer_name"),
      company: fd.get("company"),
      rating,
      comment: fd.get("comment"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      customer_name: parsed.data.customer_name,
      company: parsed.data.company || null,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });
    setSubmitting(false);
    if (error) { toast.error("Could not submit review"); return; }
    toast.success("Thanks for your review!");
    (e.target as HTMLFormElement).reset();
    setRating(5);
    load();
  }

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">Customer Reviews</div>
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3">What our clients say</h1>
        <p className="text-muted-foreground mb-10">Honest feedback from businesses across Oman.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {reviews.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground">
              No reviews yet — be the first to share!
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-0.5 mb-3 text-accent2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{r.comment}"</p>
                <div className="text-sm font-semibold text-primary">{r.customer_name}</div>
                {r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}
              </div>
            ))
          )}
        </div>

        <div className="bg-secondary border border-border rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-1">Leave a review</h2>
          <p className="text-sm text-muted-foreground mb-6">Worked with us? We'd love to hear about it.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="customer_name" required maxLength={100} placeholder="Your name *" className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input name="company" maxLength={100} placeholder="Company (optional)" className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Rating</label>
              <div className="flex gap-1 text-accent2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star size={26} fill={n <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <textarea name="comment" required rows={4} maxLength={1000} placeholder="Your experience..." className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

            <button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-medium px-6 py-2.5 rounded-md transition-colors">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
