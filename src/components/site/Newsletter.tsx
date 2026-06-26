import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Iscrizione confermata. Benvenuto in Gallerivm.");
    setEmail("");
  };

  return (
    <section className="bg-foreground text-background">
      <div className="container-gallery py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Newsletter</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Ricevi offerte esclusive</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-background/70">
          Iscriviti per ricevere anteprime delle nuove collezioni e sconti riservati.
        </p>
        <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            className="h-12 border-background/30 bg-transparent text-background placeholder:text-background/50"
          />
          <Button type="submit" variant="gold" size="xl">
            Iscriviti
          </Button>
        </form>
      </div>
    </section>
  );
}