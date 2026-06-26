import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const reviews = [
  {
    name: "Giulia R.",
    text: "La tela è di una qualità incredibile, i colori della Notte Stellata sono vividi e profondi. Sembra un'opera autentica.",
    art: "Notte Stellata",
  },
  {
    name: "Marco T.",
    text: "Spedizione velocissima e imballaggio perfetto. Il Bacio di Klimt domina il salotto, complimenti davvero.",
    art: "Il Bacio",
  },
  {
    name: "Elena B.",
    text: "Servizio impeccabile e resa cromatica fedele. Ho già ordinato la seconda tela. Consigliatissimo.",
    art: "Ninfee",
  },
  {
    name: "Davide M.",
    text: "Qualità museale come promesso. Il telaio in legno è solido e la stampa nitida in ogni dettaglio.",
    art: "La Gioconda",
  },
];

export function Reviews() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-secondary py-20">
      <div className="container-gallery">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Recensioni clienti</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="font-display text-2xl">4.9/5</span>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-10 max-w-2xl">
          <div className="min-h-[160px] text-center">
            <p className="font-display text-xl leading-relaxed sm:text-2xl">
              “{reviews[i].text}”
            </p>
            <p className="mt-6 text-sm font-medium">{reviews[i].name}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {reviews[i].art}
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, k) => (
              <button
                key={k}
                aria-label={`Recensione ${k + 1}`}
                onClick={() => setI(k)}
                className={`h-2 w-2 transition-colors ${k === i ? "bg-gold" : "bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}