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
import { Bookmark, Plus, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getFeaturedDestinations() {
  const destinations = await prisma.featuredDestination.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  return destinations;
}

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
    <main className=" min-h-screen bg-brand-light text-white pb-20">
      <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <div className="absolute top-0 left-0 z-20 w-full p-6 md:p-8">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-md border border-white/10">
              <TrendingUp className="h-5 w-5 text-brand-primary" />
              <h1 className="font-semibold text-white/90">
                Destinos em alta essa semana! 🔥
              </h1>
            </div>
          </div>
        </div>

        <Image
          src={heroDestination.imageUrl}
          alt={heroDestination.city}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 flex h-full w-full flex-col justify-end p-8 md:p-16 lg:w-2/3">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-wider text-brand-primary/80">
              {heroDestination.country}
            </p>

            <h1 className="font-sans text-5xl font-extrabold uppercase tracking-tight md:text-7xl">
              {heroDestination.city},
              <br />
              <span className="text-white/80">{heroDestination.country}</span>
            </h1>

            <p className="max-w-xl text-lg text-white/90 line-clamp-3 md:text-xl">
              {heroDestination.description}
            </p>

            <div className="flex items-center gap-2 text-lg font-semibold">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span>4.9</span>
              <span className="text-sm font-normal text-white/70">
                (8478 reviews)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="icon"
                variant="secondary"
                className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Link href={`/criar-roteiro?destino=${heroDestination.city}`}>
                <Button className="h-12 rounded-full bg-brand-primary px-8 text-base font-bold text-white hover:bg-brand-dark shadow-lg hover:shadow-brand-primary/30 transition-all">
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Roteiro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {otherDestinations.length > 0 && (
        <div className="container mx-auto px-4 py-12 -mt-20 relative z-20">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-2xl font-bold text-white">
              Continue explorando
            </h3>
            <p className="text-sm text-white/50 hidden md:block">
              Arraste para ver mais
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {otherDestinations.map((place) => (
                <CarouselItem
                  key={place.id}
                  className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <Link
                    href={`/criar-roteiro?destino=${place.city}`}
                    className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <Image
                      src={place.imageUrl}
                      alt={place.city}
                      fill
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                    <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-white/20 text-white border-0"
                      >
                        {place.priceLevel}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-light">
                        {place.country}
                      </p>
                      <h3 className="font-sans text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
                        {place.city}
                      </h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="hidden md:block">
              <CarouselPrevious className="left-[-50px] bg-brand-dark text-white border-white/10 hover:bg-brand-primary hover:text-white" />
              <CarouselNext className="right-[-50px] bg-brand-dark text-white border-white/10 hover:bg-brand-primary hover:text-white" />
            </div>
          </Carousel>
        </div>
      )}
    </main>
  );
}
