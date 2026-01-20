import { Button } from "@/components/ui/button";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute top-10 h-72 w-72 rounded-full bg-brand-light/30 blur-3xl filter" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-brand-cream shadow-lg">
          <Map className="h-8 w-8" />
        </div>

        <h1 className="font-serif text-5xl font-bold leading-tight text-brand-primary md:text-7xl">
          Descubra o seu <br />
          <span className="text-brand-dark">próximo destino.</span>
        </h1>

        <p className="max-w-xl text-lg text-brand-dark/80 md:text-xl">
          Roteiros personalizados com inteligência artificial, baseados no seu
          orçamento e no seu estilo de viagem.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/criar-roteiro">
            <Button
              size="lg"
              className="group bg-brand-primary text-lg text-white hover:bg-brand-dark"
            >
              Criar meu Roteiro
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/em-alta">
            <Button
              variant="outline"
              size="lg"
              className="border-brand-primary text-lg text-brand-primary hover:bg-brand-light/20"
            >
              Ver destinos em alta
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
