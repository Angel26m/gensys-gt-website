import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotes,
});

type Quote = Database["public"]["Tables"]["quote_requests"]["Row"];

function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setQuotes(data);
      }
    };

    fetchQuotes();

    // Realtime subscription
    const channel = supabase
      .channel("quote_requests_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "quote_requests",
        },
        (payload) => {
          setQuotes((prev) => [payload.new as Quote, ...prev]);
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
        Quote Requests
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Inbox of customer enquiries.
      </p>

      <div className="space-y-4">
        {quotes.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground text-sm">
            No requests yet.
          </div>
        )}

        {quotes.map((q) => (
          <div
            key={q.id}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex justify-between items-start gap-2 flex-wrap mb-2">
              <div>
                <div className="font-semibold text-primary">{q.name}</div>
                {q.company && (
                  <div className="text-xs text-muted-foreground">
                    {q.company}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(q.created_at).toLocaleString()}
              </div>
            </div>

            {q.product_interest && (
              <div className="text-xs bg-accent/10 text-accent inline-block rounded px-2 py-0.5 mb-2">
                {q.product_interest}
              </div>
            )}

            <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">
              {q.message}
            </p>

            <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
              <a
                href={`mailto:${q.email}`}
                className="flex items-center gap-1 hover:text-accent"
              >
                <Mail size={12} /> {q.email}
              </a>

              {q.phone && (
                <a
                  href={`tel:${q.phone}`}
                  className="flex items-center gap-1 hover:text-accent"
                >
                  <Phone size={12} /> {q.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}