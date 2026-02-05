import RoteiroActions from "@/app/components/RoteiroActions";
import { prisma } from "@/lib/prisma";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  LucideIcon,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface ItineraryActivity {
  atividade: string;
  descricao: string;
}

interface ItineraryDay {
  dia: number;
  titulo: string;
  manha: ItineraryActivity;
  tarde: ItineraryActivity;
  noite: ItineraryActivity;
}

interface ItineraryContent {
  titulo: string;
  resumo: string;
  dias: ItineraryDay[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoteiroPage({ params }: PageProps) {
  const { userId: clerkId } = await auth();

  const { id } = await params;

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect("/");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: id,
      userId: user.id,
    },
  });

  if (!trip) {
    notFound();
  }

  const photos = await getUnsplashPhoto(`${trip.destination} travel aesthetic`);
  const bgImage =
    photos?.regular ||
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1";

  const itinerary = trip.itinerary as unknown as ItineraryContent;

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-20">
      <div className="relative h-[45vh] md:h-[55vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/meu-perfil"
            className="group flex items-center gap-2 text-white/90 hover:text-white transition-all bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-brand-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                {trip.pace}
              </span>
              <span className="bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> {trip.budget}
              </span>
              <span className="bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {trip.destination}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-serif font-medium mb-4 drop-shadow-2xl tracking-tight">
              {itinerary.titulo}
            </h1>

            <div className="flex items-center gap-4 text-white/90 text-sm md:text-lg font-medium">
              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-brand-primary" />
                {format(trip.startDate, "dd 'de' MMM", { locale: ptBR })}
                <span className="opacity-50 mx-1">até</span>
                {format(trip.endDate, "dd 'de' MMM, yyyy", { locale: ptBR })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white mt-16 p-8 md:p-10 rounded-3xl shadow-xl shadow-black/5 mb-12 border border-brand-cream/20">
          <div className="flex items-start gap-4">
            <span className="text-4xl">✨</span>
            <div>
              <h2 className="text-2xl font-serif text-brand-dark mb-3 font-bold">
                Visão Geral
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {itinerary.resumo}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] bg-brand-dark/10 flex-1"></div>
            <h3 className="text-sm font-bold text-brand-dark/40 uppercase tracking-[0.2em]">
              Seu planejamento diário
            </h3>
            <div className="h-[1px] bg-brand-dark/10 flex-1"></div>
          </div>

          {itinerary.dias.map((dia) => (
            <div
              key={dia.dia}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-cream/20"
            >
              <div className="bg-brand-dark p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div>
                  <span className="inline-block bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
                    DIA {dia.dia}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-brand-cream font-medium">
                    {dia.titulo}
                  </h3>
                </div>
              </div>

              <div className="p-6 md:p-8 grid gap-8 relative">
                <div className="absolute left-[2.25rem] md:left-[2.25rem] top-8 bottom-8 w-0.5 bg-gray-100" />

                <ActivityItem
                  icon={Sunrise}
                  period="Manhã"
                  data={dia.manha}
                  color="text-amber-500"
                />
                <ActivityItem
                  icon={Sun}
                  period="Tarde"
                  data={dia.tarde}
                  color="text-orange-500"
                />
                <ActivityItem
                  icon={Moon}
                  period="Noite"
                  data={dia.noite}
                  color="text-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  period,
  data,
  color,
}: {
  icon: LucideIcon;
  period: string;
  data: ItineraryActivity | undefined;
  color: string;
}) {
  if (!data || !data.atividade) {
    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-10 opacity-70">
        <div className="flex items-center gap-4 md:block shrink-0">
          <div className="w-16 h-16 md:w-16 md:h-16 rounded-2xl bg-stone-50 border-4 border-[#FDF8F3] flex flex-col items-center justify-center shadow-sm z-10 relative grayscale">
            <Icon className={`w-6 h-6 text-gray-400 mb-1`} />
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {period}
            </span>
          </div>
        </div>
        <div className="flex-1 bg-gray-50/50 p-5 rounded-2xl border border-dashed border-gray-200 flex items-center">
          <p className="text-gray-400 text-sm italic font-medium">
            Tempo livre / Deslocamento
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-10">
      <div className="flex items-center gap-4 md:block shrink-0">
        <div className="w-16 h-16 md:w-16 md:h-16 rounded-2xl bg-white border-4 border-[#FDF8F3] flex flex-col items-center justify-center shadow-sm z-10 relative">
          <Icon className={`w-6 h-6 ${color} mb-1`} />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            {period}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:bg-[#FDF8F3] transition-colors duration-300">
        <h4 className="font-bold text-lg text-brand-dark mb-2 font-serif">
          {data.atividade}
        </h4>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
          {data.descricao}
        </p>
      </div>

      <RoteiroActions />
    </div>
  );
}
