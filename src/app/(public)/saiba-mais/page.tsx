import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Check, MapPin } from "lucide-react";
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

  const allDestinations = await prisma.featuredDestination.findMany({
    include: {
      highlights: true,
      tips: true,
    },
  });

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
      <div className="relative h-[55vh] min-[390px]:h-[50vh] sm:h-[55vh] min-[1000px]:h-[75vh] lg:h-[70vh] w-full overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.city}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-0 left-0 w-full z-10 pt-40 md:pt-12">
          <div className="container mx-auto pt-4 px-4 sm:px-8">
            <div className="inline-flex items-center rounded-full shadow-sm px-3 py-1 gap-2 bg-brand-dark ">
              <h1 className="font-sans text-xs font-bold tracking-wider uppercase text-brand-cream">
                Destino popular 🔥
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-8 px-4 sm:px-8 mx-auto container pt-4 min-[390px]:pt-40 min-[400px]:pt-35 sm:pt-36 md:pt-38">
            <h2 className="text-4xl min-[390px]:text-5xl sm:text-7xl md:text-7xl uppercase font-sans text-white font-bold">
              {destination.city}
            </h2>

            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-5 w-5" />
              <h3 className="text-xl min-[390px]:text-3xl sm:text-5xl max-w-[220px] min-[390px]:max-w-[250px] md:max-w-[400px] font-sans">
                {destination.country}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <Link href={`/criar-roteiro?destino=${destination.city}`}>
                <Button className="h-6 p-4 bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase font-sans text-xs rounded-full  shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  REVIEWS & ESTRELAS AQUI
                </Button>
              </Link>
              <Link href={`/criar-roteiro?destino=${destination.city}`}>
                <Button className="h-6 p-4 bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase font-sans text-xs rounded-full  shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  CRIE SEU ROTEIRO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-4">
        <h3 className="text-2xl text-brand-dark font-bold">
          Sobre esse destino
        </h3>

        <div className="rounded-3xl bg-brand-dark px-6 py-6 mt-4 shadow-2xl">
          <p className="text-lg text-brand-cream">{destination.description}</p>
        </div>

        <div className="mt-12 mb-12">
          <h2 className="text-brand-dark font-bold text-2xl mb-6">
            ✨ Highlights
          </h2>

          {destination.highlights && destination.highlights.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="group relative h-64 w-full overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl"
                >
                  <Image
                    src={highlight.imageUrl}
                    alt={highlight.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="h-1 w-10 bg-brand-primary mb-3 rounded-full" />
                    <p className="text-white font-bold text-xl leading-tight drop-shadow-md">
                      {highlight.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-6 border border-gray-100 text-center">
              <p className="text-gray-500">
                Os destaques visuais deste destino estão sendo carregados.
              </p>
            </div>
          )}
        </div>

        <div className="bg-brand-primary rounded-3xl px-6 py-6 shadow-2xl">
          <h2 className="text-brand-cream font-bold text-2xl mb-6">💡 Dicas</h2>
          {destination.tips && destination.tips.length > 0 && (
            <div className="mt-12 mb-20 bg-[#FDF8F3] border border-brand-primary/10 rounded-3xl p-8 shadow-sm">
              <h2 className="text-brand-dark font-bold text-2xl mb-6 flex items-center gap-3">
                💡 Dicas de Ouro (Travel Tips)
              </h2>

              <div className="grid gap-4">
                {destination.tips.map((tip) => (
                  <div key={tip.id} className="flex items-start gap-3">
                    <div className="mt-1 min-w-[24px] h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Check className="h-4 w-4" />
                    </div>

                    <p className="text-gray-700 text-lg leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
