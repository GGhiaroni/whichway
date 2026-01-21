import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Bookmark, ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getFeaturedDestinations() {
  const destinations = await prisma.featuredDestination.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
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
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherDestinations.map((place) => (
                <Link
                  href={`/criar-roteiro?destino=${place.city}`}
                  key={place.id}
                  className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                >
                  <Image
                    src={place.imageUrl}
                    alt={place.city}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-primary/80">
                      {place.country}
                    </p>
                    <h3 className="font-sans text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
                      {place.city},
                      <br />
                      {place.country}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end lg:justify-start">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-brand-primary disabled:opacity-50 backdrop-blur-md"
                  disabled
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-brand-primary backdrop-blur-md"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              <span className="font-sans text-4xl font-bold text-white/30">
                04
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
