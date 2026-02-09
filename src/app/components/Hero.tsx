import { Button } from "@/components/ui/button";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src="https://wp05tkopknv4l4dh.public.blob.vercel-storage.com/video-hero-section.mp4"
            type="video/mp4"
          />
          Seu navegador não suporta vídeos HTML5.
        </video>

        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6 pt-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream/10 text-brand-cream backdrop-blur-md shadow-lg border border-brand-cream/20">
          <Map className="h-8 w-8" />
        </div>

        <h1 className="font-serif text-5xl font-bold leading-tight text-brand-cream md:text-7xl drop-shadow-lg">
          Descubra o seu <br />
          <span className="text-brand-light">próximo destino.</span>
        </h1>

        <p className="max-w-xl text-lg text-brand-cream/90 md:text-xl drop-shadow-md">
          Roteiros personalizados com inteligência artificial, baseados no seu
          orçamento e no seu estilo de viagem.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <Link href="/criar-roteiro">
            <Button
              size="lg"
              className="group bg-brand-primary text-lg text-white hover:bg-brand-dark shadow-xl border-none"
            >
              Criar meu Roteiro
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/em-alta">
            <Button
              variant="outline"
              size="lg"
              className="border-brand-cream/50 bg-transparent text-lg text-brand-cream hover:bg-brand-cream hover:text-brand-primary transition-all"
            >
              Ver destinos em alta
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-brand-cream to-transparent z-10" />
    </section>
  );
}
