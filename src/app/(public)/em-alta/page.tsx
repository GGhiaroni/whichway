import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { prisma } from "@/lib/prisma";
import { getPriceBadgeConfig } from "@/lib/utils";
import { ArrowDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getFeaturedDestinations() {
  const destinations = await prisma.featuredDestination.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      highlights: true,
    },
  });
  return destinations;
}

const renderPriceBadge = (price: string) => {
  const config = getPriceBadgeConfig(price);

  const baseClasses =
    "backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 shadow-lg border font-bold hover:scale-105 transition-transform cursor-default select-none";

  return (
    <Badge className={`${baseClasses} ${config.classes}`}>
      <span className="flex items-center gap-1.5">
        {config.emoji && (
          <span className="text-sm md:text-lg">{config.emoji}</span>
        )}
        <span className="uppercase tracking-wide font-bold text-[10px] md:text-xs">
          {config.label}
        </span>
      </span>
    </Badge>
  );
};

export default async function EmAlta() {
  const destinations = await getFeaturedDestinations();

  const [heroDestination, ...otherDestinations] = destinations;

  if (!heroDestination) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-xl">
          Nenhum destino encontrado. Rode o script de atualização.
        </p>
      </main>
    );
  }

  return (
    <main>
      <div className="relative h-[45vh] min-[390px]:h-[50vh] sm:h-[55vh] min-[1000px]:h-[75vh] lg:h-[70vh] w-full overflow-hidden">
        <Image
          src={heroDestination.imageUrl}
          alt={heroDestination.city}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-0 left-0 w-full z-10 pt-6 md:pt-12">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="inline-flex items-center rounded-full shadow-sm px-3 py-1 gap-2 bg-brand-dark ">
              <TrendingUp className="h-4 w-4 text-brand-cream" />
              <h1 className="font-sans text-xs font-bold tracking-wider uppercase text-brand-cream">
                Destinos em alta 🔥
              </h1>
            </div>
          </div>

          <div className="flex flex-col px-4 sm:px-8 mx-auto container pt-14 min-[390px]:pt-32 min-[400px]:pt-22 sm:pt-36 md:pt-38">
            <h2 className="text-4xl min-[390px]:text-5xl sm:text-7xl md:text-7xl uppercase font-sans text-white font-bold">
              {heroDestination.city},
            </h2>
            <h3 className="text-2xl min-[390px]:text-3xl sm:text-5xl max-w-[220px] min-[390px]:max-w-[250px] md:max-w-[400px] uppercase font-sans text-gray-400 font-bold">
              {heroDestination.country}
            </h3>

            <p className="hidden min-[400px]:block md:block mt-6 mb-2 font-bold min-[400px]:text-sm md:text-lg text-gray-200 max-w-xl leading-relaxed drop-shadow-md border-l-2 border-brand-primary pl-4">
              {heroDestination.description}
            </p>

            <div className="pt-4 flex gap-4">
              <Link href={`/criar-roteiro?destino=${heroDestination.city}`}>
                <Button className="h-6 p-4 bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase font-sans text-xs rounded-full  shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  Gerar roteiro
                </Button>
              </Link>
              <Link href={`/saiba-mais?destino=${heroDestination.city}`}>
                <Button className="h-6 p-4 bg-brand-primary hover:bg-brand-light text-brand-cream font-bold uppercase font-sans text-xs rounded-full  shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  Saiba mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-8 container pt-6 flex gap-2 items-center pb-8">
        <h2 className="text-2xl text-brand-dark font-bold">Confira também</h2>
        <ArrowDown className="text-brand-dark h-5 w-5 mt-1" />
      </div>

      {otherDestinations.length > 0 && (
        <div className="container mx-auto pt-6 sm:pt-14 px-4 sm:px-12 md:px-16 -mt-8 md:-mt-16 relative z-20">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {otherDestinations.map((place) => (
                <CarouselItem
                  key={place.id}
                  className="pl-3 md:pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link
                    href={`/saiba-mais?destino=${place.city}`}
                    className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 shadow-xl transition-all active:scale-95 md:hover:-translate-y-2 md:hover:shadow-2xl [mask-image:linear-gradient(white,white)]"
                  >
                    <div className="absolute inset-0 z-20 rounded-xl md:rounded-2xl border-2 border-brand-dark pointer-events-none" />

                    <Image
                      src={place.imageUrl}
                      alt={place.city}
                      fill
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 70vw, 25vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                    <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                      {renderPriceBadge(place.priceLevel)}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6">
                      <p className="mb-1 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary">
                        {place.country}
                      </p>
                      <h3 className="font-sans text-xl md:text-2xl font-extrabold uppercase leading-none tracking-tight text-white drop-shadow-lg line-clamp-2">
                        {place.city}
                      </h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="hidden md:block">
              <CarouselPrevious className="left-[-50px] bg-brand-dark text-white border-brand-primary hover:bg-brand-primary hover:text-white backdrop-blur-md" />
              <CarouselNext className="right-[-50px] bg-brand-dark text-white border-brand-primary hover:bg-brand-primary hover:text-white backdrop-blur-md" />
            </div>
          </Carousel>
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-16 text-center shadow-2xl md:px-12 md:py-20">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-8">
            <Badge
              variant="outline"
              className="border-white/20 text-white/80 uppercase tracking-widest"
            >
              WhichWay Insider
            </Badge>

            <h2 className="font-sans text-3xl font-bold uppercase text-white md:text-[2.5rem]">
              Não perca a próxima onda 🌊
            </h2>

            <p className="text-lg text-white/70 leading-relaxed">
              Nossa IA processa milhões de dados de viagem toda semana. Receba
              os destinos tendência direto no seu e-mail, antes que os preços
              subam.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center pt-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-6 text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary sm:w-80 transition-all"
              />
              <Button className="h-12 rounded-full bg-brand-cream text-brand-dark hover:bg-white font-bold px-8 uppercase tracking-wide">
                Quero receber
              </Button>
            </div>

            <p className="text-xs text-white/30 pt-4">
              Sem spam. Apenas viagens incríveis. Cancele quando quiser.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
