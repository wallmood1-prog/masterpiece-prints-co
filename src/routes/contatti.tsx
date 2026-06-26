import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti | Gallerivm" },
      { name: "description", content: "Contatta il team Gallerivm per informazioni su ordini, spedizioni e opere." },
      { property: "og:url", content: "/contatti" },
    ],
    links: [{ rel: "canonical", href: "/contatti" }],
  }),
  component: Contatti,
});

function Contatti() {
  return (
    <div className="container-gallery py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Parliamo</p>
      <h1 className="mt-3 font-display text-4xl">Contatti</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Messaggio inviato. Ti risponderemo al più presto.");
            (e.target as HTMLFormElement).reset();
          }}
          className="space-y-4"
        >
          <Input required placeholder="Nome" className="h-12" />
          <Input required type="email" placeholder="Email" className="h-12" />
          <Textarea required placeholder="Il tuo messaggio" rows={6} />
          <Button type="submit" variant="gold" size="xl">Invia messaggio</Button>
        </form>
        <div className="space-y-6 text-foreground/80">
          <p className="leading-relaxed">Hai una domanda su un'opera o sul tuo ordine? Il nostro team è a tua disposizione.</p>
          <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-gold" /> info@gallerivm.com</div>
          <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-gold" /> +39 02 1234 5678</div>
          <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-gold" /> Via dell'Arte 12, Milano</div>
        </div>
      </div>
    </div>
  );
}