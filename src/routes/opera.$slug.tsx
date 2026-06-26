import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { Reviews } from "@/components/site/Reviews";
import { useCart } from "@/lib/cart";
import {
  getProduct,
  relatedProducts,
  artworkImage,
  formatPrice,
  SIZES,
} from "@/lib/products";

export const Route = createFileRoute("/opera/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    return {
      meta: [
        { title: `${p.title} — ${p.artist} | Gallerivm` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.title} — ${p.artist}` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/opera/${p.slug}` },
        { property: "og:image", content: artworkImage(p.file, 1200) },
        { property: "twitter:image", content: artworkImage(p.file, 1200) },
      ],
      links: [{ rel: "canonical", href: `/opera/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${p.title} — Riproduzione su tela`,
            image: artworkImage(p.file, 1200),
            description: p.description,
            brand: { "@type": "Brand", name: "Gallerivm" },
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: p.price,
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "128",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-gallery py-32 text-center">
      <h1 className="font-display text-3xl">Opera non trovata</h1>
      <Button asChild variant="gold" className="mt-6">
        <Link to="/shop">Torna allo shop</Link>
      </Button>
    </div>
  ),
});

const faqs = [
  {
    q: "Che materiali utilizzate?",
    a: "Stampa ad alta definizione su tela in cotone-poliestere di grammatura premium, montata su telaio in legno massello.",
  },
  {
    q: "Quanto tempo richiede la spedizione?",
    a: "La produzione richiede 2-3 giorni lavorativi; la consegna avviene in 3-5 giorni con corriere tracciato.",
  },
  {
    q: "Posso effettuare un reso?",
    a: "Sì, hai 30 giorni per richiedere un reso gratuito se non sei soddisfatto.",
  },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [sizeIdx, setSizeIdx] = useState(1);
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const size = SIZES[sizeIdx];
  const price = Math.round(product.price * size.factor);
  const related = relatedProducts(product);

  const handleAdd = () => {
    addItem(
      {
        slug: product.slug,
        title: product.title,
        artist: product.artist,
        file: product.file,
        size: size.label,
        price,
      },
      qty,
    );
    toast.success(`"${product.title}" aggiunto al carrello`);
  };

  return (
    <div className="container-gallery py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
        <Link to="/shop" className="hover:text-foreground">Shop</Link> /{" "}
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Galleria */}
        <div>
          <div className="overflow-hidden bg-secondary">
            <img
              src={artworkImage(product.file, 1000)}
              alt={`${product.title} di ${product.artist} — riproduzione su tela`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[800, 900, 1000].map((w, k) => (
              <div key={k} className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={artworkImage(product.file, 400)}
                  alt={`${product.title} dettaglio ${k + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: ["center", "top", "bottom"][k] }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold">{product.style}</p>
          <h1 className="mt-2 font-display text-4xl">{product.title}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{product.artist}, {product.year}</p>
          <p className="mt-6 leading-relaxed text-foreground/80">{product.description}</p>

          <p className="mt-8 font-display text-3xl">{formatPrice(price)}</p>

          {/* Misure */}
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Misure disponibili</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SIZES.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={() => setSizeIdx(idx)}
                  className={`border px-3 py-2 text-sm transition-colors ${
                    idx === sizeIdx
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-input hover:border-gold"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Materiale */}
          <ul className="mt-6 space-y-1.5 text-sm text-foreground/80">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Tela premium di qualità museale</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Telaio in legno massello</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Stampa HD a colori fedeli</li>
          </ul>

          {/* Quantità + carrello */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-input">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center hover:bg-secondary" aria-label="Riduci">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center hover:bg-secondary" aria-label="Aumenta">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button variant="gold" size="xl" className="flex-1" onClick={handleAdd}>
              <ShoppingBag /> Aggiungi al carrello
            </Button>
          </div>

          {/* FAQ */}
          <div className="mt-12 border-t border-border pt-6">
            <h3 className="mb-2 font-display text-xl">Domande frequenti</h3>
            {faqs.map((f, idx) => (
              <div key={idx} className="border-b border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
                >
                  {f.q}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && <p className="pb-4 text-sm text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Correlati */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl">Opere correlate</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 30}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        <Reviews />
      </div>
    </div>
  );
}