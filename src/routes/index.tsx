import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brush,
  ShieldCheck,
  RotateCcw,
  Lock,
  Award,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { Newsletter } from "@/components/site/Newsletter";
import { Reviews } from "@/components/site/Reviews";
import { categories, products, artworkImage } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gallerivm — Riproduzioni d'arte su tela di qualità museale" },
      {
        name: "description",
        content:
          "Riproduzioni su tela dei capolavori più celebri al mondo, stampa ad alta definizione e materiali di qualità museale. Spedizione sicura e reso semplice.",
      },
      { property: "og:title", content: "Gallerivm — Arte su tela di qualità museale" },
      {
        property: "og:description",
        content: "Trasforma le tue pareti in opere d'arte con riproduzioni su tela premium.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
  }),
  component: Index,
});

const benefits = [
  { icon: Brush, title: "Stampa HD su tela premium", text: "Colori fedeli e dettaglio nitido." },
  { icon: ShieldCheck, title: "Spedizione sicura", text: "Imballo protetto e tracciato." },
  { icon: RotateCcw, title: "Reso semplice", text: "30 giorni per cambiare idea." },
  { icon: Lock, title: "Pagamenti protetti", text: "Transazioni cifrate e sicure." },
  { icon: Award, title: "Qualità museale", text: "Materiali certificati di lunga durata." },
];

function Index() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Parete moderna decorata con riproduzioni di quadri famosi"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-gallery">
              <div className="max-w-2xl text-background">
                <p className="text-sm uppercase tracking-[0.3em] text-background/80">
                  Galleria d'arte online
                </p>
                <h1 className="mt-4 font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
                  Trasforma le tue pareti in opere d'arte.
                </h1>
                <p className="mt-6 max-w-xl text-base text-background/85 sm:text-lg">
                  Riproduzioni su tela dei capolavori più celebri al mondo, realizzate con stampa ad
                  alta definizione e materiali di qualità museale.
                </p>
                <Button asChild variant="gold" size="xl" className="mt-8">
                  <Link to="/shop">Scopri la collezione</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorie */}
      <section className="container-gallery py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Collezioni"
            title="Esplora per stile e artista"
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {categories.map((c, i) => {
            const cover = products.find(
              (p) => p.category === c.key || p.style === c.key,
            );
            return (
              <Reveal key={c.key} delay={i * 40}>
                <Link
                  to="/shop"
                  search={{ categoria: c.key }}
                  className="group relative block aspect-[3/2] overflow-hidden bg-secondary"
                >
                  {cover && (
                    <img
                      src={artworkImage(cover.file, 600)}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-foreground/30 transition-colors group-hover:bg-foreground/45" />
                  <span className="absolute inset-0 flex items-center justify-center px-3 text-center font-display text-xl text-background sm:text-2xl">
                    {c.name}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Bestseller */}
      <section className="bg-secondary py-20">
        <div className="container-gallery">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="I più amati" title="Bestseller" />
              <Link
                to="/shop"
                className="hidden items-center gap-1 text-sm font-medium text-foreground hover:text-gold sm:inline-flex"
              >
                Vedi tutto <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <Reveal key={p.slug} delay={i * 30}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Perché Gallerivm */}
      <section className="container-gallery py-20">
        <Reveal>
          <SectionHeading eyebrow="Perché sceglierci" title="L'esperienza Gallerivm" centered />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 50} className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center border border-gold text-gold">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Reviews />
      <Newsletter />
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  centered,
}: {
  eyebrow?: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl sm:text-4xl">{title}</h2>
    </div>
  );
}
