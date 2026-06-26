import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import {
  products,
  artists,
  STYLES,
  COLORS,
  formatPrice,
} from "@/lib/products";

type ShopSearch = { categoria?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    categoria: typeof s.categoria === "string" ? s.categoria : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Collezione di riproduzioni su tela | Gallerivm" },
      {
        name: "description",
        content:
          "Esplora la collezione Gallerivm: filtra per artista, stile, prezzo, dimensione e colore. Riproduzioni su tela di qualità museale.",
      },
      { property: "og:title", content: "Shop — Gallerivm" },
      { property: "og:description", content: "Riproduzioni su tela di qualità museale." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const SORTS = [
  { key: "popolari", label: "Popolari" },
  { key: "novita", label: "Novità" },
  { key: "prezzo-asc", label: "Prezzo crescente" },
  { key: "prezzo-desc", label: "Prezzo decrescente" },
] as const;

function Shop() {
  const { categoria } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState<string>("");
  const [style, setStyle] = useState<string>(
    STYLES.includes(categoria ?? "") ? categoria! : "",
  );
  const [color, setColor] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [sort, setSort] = useState<string>("popolari");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.artist.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q);
      const matchCat =
        !categoria ||
        STYLES.includes(categoria) ||
        p.category === categoria ||
        p.artist === categoria;
      const matchArtist = !artist || p.artist === artist;
      const matchStyle = !style || p.style === style;
      const matchColor = !color || p.color === color;
      const matchPrice = p.price <= maxPrice;
      return matchQ && matchCat && matchArtist && matchStyle && matchColor && matchPrice;
    });

    list = [...list].sort((a, b) => {
      if (sort === "prezzo-asc") return a.price - b.price;
      if (sort === "prezzo-desc") return b.price - a.price;
      if (sort === "novita") return Number(!!b.isNew) - Number(!!a.isNew);
      return Number(!!b.bestseller) - Number(!!a.bestseller);
    });
    return list;
  }, [query, artist, style, color, maxPrice, sort, categoria]);

  return (
    <div className="container-gallery py-12">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Collezione</p>
        <h1 className="mt-3 font-display text-4xl">
          {categoria ? categoria : "Tutte le opere"}
        </h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filtri */}
        <aside className="space-y-8">
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca opera o artista…"
                className="h-11 pl-9"
              />
            </div>
          </div>

          <FilterGroup label="Artista" value={artist} onChange={setArtist} options={artists} />
          <FilterGroup label="Stile" value={style} onChange={setStyle} options={STYLES} />
          <FilterGroup label="Colore predominante" value={color} onChange={setColor} options={COLORS} />

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Prezzo massimo</h3>
            <input
              type="range"
              min={70}
              max={120}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--gold)]"
            />
            <p className="mt-2 text-sm text-muted-foreground">Fino a {formatPrice(maxPrice)}</p>
          </div>
        </aside>

        {/* Griglia */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} opere</p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Ordina:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 border border-input bg-background px-3 text-sm"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              Nessuna opera corrisponde ai filtri selezionati.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p.slug} delay={Math.min(i * 25, 200)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">{label}</h3>
      <div className="space-y-1.5">
        <FilterOption active={value === ""} onClick={() => onChange("")}>
          Tutti
        </FilterOption>
        {options.map((o) => (
          <FilterOption key={o} active={value === o} onClick={() => onChange(o)}>
            {o}
          </FilterOption>
        ))}
      </div>
    </div>
  );
}

function FilterOption({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`block text-left text-sm transition-colors ${
        active ? "text-gold" : "text-foreground/70 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}