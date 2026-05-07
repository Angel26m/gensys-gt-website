import { useEffect, useState, useCallback } from "react";

const KEY = "ggt_quote_cart_v1";

export type QuoteItem = {
  id: string;
  name: string;
  price: number | null;
  category: string;
};

function read(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuoteItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: QuoteItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("quote-cart-change"));
}

export function useQuoteCart() {
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener("quote-cart-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("quote-cart-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: QuoteItem) => {
    const cur = read();
    if (cur.some((i) => i.id === item.id)) return;
    write([...cur, item]);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => write([]), []);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return { items, add, remove, clear, has };
}

export function formatQuoteMessage(items: QuoteItem[]) {
  if (items.length === 0) return "";
  const lines = items.map(
    (i, idx) => `${idx + 1}. ${i.name}${i.price !== null ? ` — OMR ${Number(i.price).toFixed(2)}` : ""} (${i.category})`,
  );
  return `I'd like a quote for the following products:\n\n${lines.join("\n")}`;
}
