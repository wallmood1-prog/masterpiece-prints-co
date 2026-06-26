import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  title: string;
  artist: string;
  file: string;
  size: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "gallerivm-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item, qty = 1) =>
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.slug === item.slug && p.size === item.size);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { ...item, qty }];
      });

    const removeItem: CartContextValue["removeItem"] = (slug, size) =>
      setItems((prev) => prev.filter((p) => !(p.slug === slug && p.size === size)));

    const updateQty: CartContextValue["updateQty"] = (slug, size, qty) =>
      setItems((prev) =>
        prev.map((p) =>
          p.slug === slug && p.size === size ? { ...p, qty: Math.max(1, qty) } : p,
        ),
      );

    const clear = () => setItems([]);
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { items, addItem, removeItem, updateQty, clear, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}