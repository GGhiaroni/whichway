import DeleteTripDialog from "@/app/components/DeleteTripDialog";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface ItineraryJSON {
  titulo?: string;
}

export default async function AllTripsPage() {
  const { userId: clerkId } = await auth();

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

  const trips = await prisma.trip.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getFallbackImage = (id: string) => {
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-20">
      <header className="bg-white border-b border-stone-100 pt-10 pb-8 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/meu-perfil">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-stone-100 text-stone-500"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">
                Meus Roteiros
              </h1>
              <p className="text-gray-500 text-sm">
                Gerencie suas {trips.length} viagens planejadas
              </p>
            </div>
          </div>

          <Link href="/criar-roteiro" className="w-full md:w-auto">
            <Button className="w-full md:w-auto rounded-full bg-brand-primary hover:bg-brand-dark text-white font-bold shadow-lg shadow-brand-primary/20 gap-2">
              <Plus className="w-4 h-4" /> Criar Novo Roteiro
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">Nada por aqui</h3>
            <p className="text-gray-500">
              Você ainda não criou nenhum roteiro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const tripTitle =
                (trip.itinerary as ItineraryJSON)?.titulo ||
                `Viagem para ${trip.destination}`;

              const fallbackSrc = getFallbackImage(trip.id);

              return (
                <div key={trip.id} className="relative group">
                  <div className="absolute top-3 right-3 z-20">
                    <DeleteTripDialog
                      id={trip.id}
                      placeName={trip.destination}
                    />
                  </div>

                  <Link href={`/roteiro/${trip.id}`} className="block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100 h-full flex flex-col">
                      <div className="h-48 overflow-hidden relative bg-gray-200">
                        <Image
                          src={trip.imageUrl || fallbackSrc}
                          alt={trip.destination}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-lg text-brand-dark line-clamp-1 mb-2">
                          {tripTitle}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <MapPin className="w-4 h-4 text-brand-primary" />
                          <span className="truncate">{trip.destination}</span>
                        </div>

                        <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-gray-400 font-medium border-t border-stone-50">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(trip.startDate, "dd MMM")} -{" "}
                          {format(trip.endDate, "dd MMM, yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}

            <Link href="/criar-roteiro" className="block h-full min-h-[300px]">
              <div className="h-full rounded-2xl border-2 border-dashed border-stone-300 hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-brand-primary cursor-pointer gap-3 p-6">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold">Planejar Nova Viagem</span>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
