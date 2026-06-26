import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Che qualità hanno le stampe?", a: "Utilizziamo stampa ad alta definizione su tela premium di qualità museale, con inchiostri a colori fedeli e resistenti nel tempo." },
  { q: "Quali misure sono disponibili?", a: "Ogni opera è disponibile in quattro formati, da 30×40 cm fino a 100×140 cm." },
  { q: "Quanto costa la spedizione?", a: "La spedizione è gratuita per ordini superiori a 100 €. Sotto questa soglia il costo è di 9,90 €." },
  { q: "Posso effettuare un reso?", a: "Sì, hai 30 giorni di tempo per richiedere un reso gratuito." },
  { q: "Come vengono imballate le tele?", a: "Ogni tela viene protetta con imballaggio rinforzato e spedita con corriere tracciato." },
  { q: "Quali metodi di pagamento accettate?", a: "Stiamo attivando pagamenti con carta, PayPal e Stripe, tutti con transazioni cifrate e sicure." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Gallerivm" },
      { name: "description", content: "Domande frequenti su spedizioni, resi, qualità delle stampe e pagamenti Gallerivm." },
      { property: "og:title", content: "FAQ — Gallerivm" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container-gallery max-w-3xl py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Assistenza</p>
      <h1 className="mt-3 font-display text-4xl">Domande frequenti</h1>
      <div className="mt-10">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-border">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg">
              {f.q}
              <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="pb-5 text-foreground/75">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}