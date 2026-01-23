import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    destino?: string;
  }>;
}

export default async function SaibaMais(props: PageProps) {
  const searchParams = await props.searchParams;

  const rawDestiny = searchParams.destino;

  if (!rawDestiny) {
    redirect("/");
  }

  function normalizeString(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const targetCity = normalizeString(decodeURIComponent(rawDestiny));

  const allDestinations = await prisma.featuredDestination.findMany();

  const destination = allDestinations.find(
    (d) => normalizeString(d.city) === targetCity,
  );

  if (!destination) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Destino não encontrado 😕</h1>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  return (
    <main>
      <div className="relative h-[45vh] min-[390px]:h-[50vh] sm:h-[55vh] min-[1000px]:h-[75vh] lg:h-[70vh] w-full overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.city}
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

          <div className="flex flex-col px-4 sm:px-8 mx-auto container pt-14 min-[390px]:pt-40 min-[400px]:pt-35 sm:pt-36 md:pt-38">
            <h2 className="text-4xl min-[390px]:text-5xl sm:text-7xl md:text-7xl uppercase font-sans text-white font-bold">
              {destination.city},
            </h2>
            <h3 className="text-2xl min-[390px]:text-3xl sm:text-5xl max-w-[220px] min-[390px]:max-w-[250px] md:max-w-[400px] uppercase font-sans text-gray-400 font-bold">
              {destination.country}
            </h3>

            <p className="hidden min-[400px]:block md:block mt-6 mb-2 font-bold min-[400px]:text-sm md:text-lg text-gray-200 max-w-xl leading-relaxed drop-shadow-md border-l-2 border-brand-primary pl-4">
              {destination.description}
            </p>

            <div className="pt-4 flex gap-4">
              <Link href={`/criar-roteiro?destino=${destination.city}`}>
                <Button className="h-6 p-4 bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase font-sans text-xs rounded-full  shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  Gerar roteiro
                </Button>
              </Link>
              <Link href={`/saiba-mais?destino=${destination.city}`}>
                <Button className="h-6 p-4 bg-brand-primary hover:bg-brand-light text-brand-cream font-bold uppercase font-sans text-xs rounded-full  shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  Saiba mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
