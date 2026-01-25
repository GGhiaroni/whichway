import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Check,
  CloudRain,
  Leaf,
  Lightbulb,
  MapPin,
  Plane,
  Sparkles,
  Star,
  Sun,
  Thermometer,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    destino?: string;
  }>;
}

function getRatingLabel(ratingStr?: string) {
  const rating = parseFloat(ratingStr || "0");

  if (isNaN(rating) || rating === 0) return "Avaliação pendente";
  if (rating >= 4.8) return "Experiência Incrível";
  if (rating >= 4.5) return "Excelente Escolha";
  if (rating >= 4.0) return "Muito Bom";
  if (rating >= 3.5) return "Boa Experiência";

  return "Experiência Média";
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
      <div className="relative h-[55svh] md:h-[65vh] lg:h-[70vh] w-full overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.city}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-0 left-0 w-full z-10 pt-18 min-[370px]:pt-4 md:pt-12">
          <div className="container mx-auto pt-4 px-4 sm:px-8">
            <div className="inline-flex items-center rounded-full shadow-sm px-3 py-1 gap-2 bg-brand-dark ">
              <h1 className="font-sans text-xs font-bold tracking-wider uppercase text-brand-cream">
                Destino popular 🔥
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 sm:px-8 mx-auto container pt-4 min-[390px]:pt-24 min-[400px]:pt-35 sm:pt-36 md:pt-38">
            <h2 className="text-4xl min-[390px]:text-5xl sm:text-7xl md:text-7xl uppercase font-sans text-white font-bold">
              {destination.city}
            </h2>

            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg min-[390px]:text-lg sm:text-2xl max-w-[220px] min-[390px]:max-w-[250px] md:max-w-[400px] font-sans">
                {destination.country}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start gap-6 mt-6">
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 pr-6 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-400/20 rounded-full">
                      <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <span className="text-3xl font-bold text-white font-sans tracking-tight">
                      {destination.rating || "4.8"}
                    </span>
                  </div>

                  <div className="w-[1px] h-10 bg-white/20" />

                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-brand-cream uppercase tracking-wider mb-0.5">
                      {getRatingLabel(destination.rating)}
                    </span>
                    <div className="flex items-center gap-1 text-gray-200 text-sm">
                      <span className="font-medium text-white border-b border-white/30 pb-0.5">
                        {destination.reviews || "12k+ reviews"}
                      </span>
                      <span className="opacity-70">globais</span>
                    </div>
                  </div>
                </div>

                <Link href={`/criar-roteiro?destino=${destination.city}`}>
                  <Button className="h-14 px-8 bg-brand-dark hover:bg-brand-primary text-white font-bold uppercase font-sans text-sm rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/10">
                    Criar meu roteiro agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 container mx-auto px-4 mt-4">
        <h3 className="text-2xl text-brand-dark font-bold">
          Sobre esse destino
        </h3>

        <div className="rounded-3xl bg-brand-dark px-6 py-6 mt-4 shadow-2xl">
          <p className="text-lg text-brand-cream">{destination.description}</p>
        </div>

        <div className="mt-8">
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

        {destination.tips && destination.tips.length > 0 ? (
          <div className="mt-8 bg-[#FDF8F3] border border-brand-primary/10 rounded-3xl p-8 shadow-sm">
            <h2 className="text-brand-dark font-bold text-2xl mb-6 flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-amber-300" /> Dicas
            </h2>

            <div className="grid gap-4">
              {destination.tips.map((tip) => (
                <div key={tip.id} className="flex items-start gap-3">
                  <div className="mt-1 min-w-[24px] h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    {tip.text.includes(":") ? (
                      <>
                        <strong className="font-bold text-brand-dark block sm:inline">
                          {tip.text.split(":")[0]}:
                        </strong>

                        <span className="ml-1">
                          {tip.text.split(":").slice(1).join(":")}
                        </span>
                      </>
                    ) : (
                      tip.text
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 mb-20 p-6 text-center text-gray-500 bg-gray-50 rounded-2xl">
            <p>Carregando dicas de viagem...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Sun className="h-6 w-6 text-orange-500" />
              <h3 className="font-bold text-xl text-gray-800">Clima & Tempo</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Thermometer className="h-5 w-5 text-red-400 mb-2" />
                <span className="text-2xl font-bold text-gray-800">
                  {destination.tempSummer}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Verão
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Thermometer className="h-5 w-5 text-blue-400 mb-2" />
                <span className="text-2xl font-bold text-gray-800">
                  {destination.tempWinter}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Inverno
                </span>
              </div>

              <div className="bg-orange-50/50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Sun className="h-5 w-5 text-orange-400 mb-2" />
                <span className="text-2xl font-bold text-gray-800">
                  {destination.sunnyDays}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Dias de Sol
                </span>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center text-center">
                <CloudRain className="h-5 w-5 text-blue-400 mb-2" />
                <span className="text-2xl font-bold text-gray-800">
                  {destination.rainyDays}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Dias de Chuva
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="h-6 w-6 text-emerald-600" />
                <h3 className="font-bold text-xl text-gray-800">
                  Custo Médio Diário
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Estimativa por pessoa (Hospedagem + Alimentação)
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">Econômico</span>
                    <span className="font-bold text-gray-900">
                      {destination.costBudget}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[30%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">Conforto</span>
                    <span className="font-bold text-gray-900">
                      {destination.costMid}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-[60%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">Luxo</span>
                    <span className="font-bold text-gray-900">
                      {destination.costLuxury}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800 w-[95%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-700">
                  <Plane className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-gray-600">
                  Voo Médio (BR)
                </span>
              </div>
              <span className="text-lg font-black text-gray-900">
                {destination.costFlight}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-brand-dark font-bold text-2xl mb-6">
            🗓️ Quando ir?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#E6F4F1] p-6 rounded-3xl border border-emerald-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-emerald-700" />
                <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Melhor Custo-Benefício
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {destination.bestTimeValue}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {destination.bestTimeDesc}
              </p>
            </div>

            <div className="bg-[#FFF4EB] p-6 rounded-3xl border border-orange-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-orange-700" />
                <span className="px-3 py-1 bg-[#F2E3D5] text-orange-900 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Alta Temporada
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {destination.peakSeasonValue}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {destination.peakSeasonDesc}
              </p>
            </div>

            <div className="bg-[#F7F7F5] p-6 rounded-3xl border border-gray-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="h-5 w-5 text-gray-500" />
                <span className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Baixa Temporada
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {destination.offSeasonValue}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {destination.offSeasonDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="my-12">
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-12 md:px-12 md:py-16 text-center shadow-2xl">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="font-sans text-3xl font-bold uppercase text-white md:text-5xl mb-6 leading-tight">
                E aí, bora para{" "}
                <span className="text-brand-cream border-b-4 border-brand-light">
                  {destination.city}
                </span>
                ?
              </h2>

              <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
                Não perca horas planejando. Nossa IA cria um roteiro dia-a-dia
                personalizado com todos esses highlights e dicas incluídos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white uppercase font-bold tracking-wide transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Explorar outros
                  </Button>
                </Link>

                <Link
                  href={`/criar-roteiro?destino=${destination.city}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto h-14 px-10 rounded-full bg-brand-primary hover:bg-white hover:text-brand-dark text-white font-bold uppercase tracking-wide text-lg shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Criar Roteiro Grátis
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-white/30 mt-6">
                Leva menos de 1 minuto. Personalize como quiser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
