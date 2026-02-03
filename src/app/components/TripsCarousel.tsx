import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteTripDialog from "./DeleteTripDialog";

interface ItineraryJSON {
  titulo?: string;
}

interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  itinerary: unknown;
  imageUrl: string | null;
}

interface TripsCarouselProps {
  trips: Trip[];
}

export default function TripsCarousel({ trips }: TripsCarouselProps) {
  const getFallbackImage = (id: string) => {
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
  };

  const VISIBLE_LIMIT = 5;
  const hasMoreTrips = trips.length > VISIBLE_LIMIT;
  const visibleTrips = trips.slice(0, VISIBLE_LIMIT);

  return (
    <div className="w-full relative px-4 md:px-12">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {visibleTrips.map((trip) => {
            const tripTitle =
              (trip.itinerary as ItineraryJSON)?.titulo ||
              `Viagem para ${trip.destination}`;

            const fallbackSrc = getFallbackImage(trip.id);

            return (
              <CarouselItem
                key={trip.id}
                className="pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]"
              >
                <div className="relative h-full group">
                  <div className="absolute top-2 right-2 z-50">
                    <DeleteTripDialog
                      id={trip.id}
                      placeName={trip.destination}
                    />
                  </div>

                  <Link href={`/roteiro/${trip.id}`}>
                    <div className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group cursor-pointer h-full select-none">
                      <div className="h-40 overflow-hidden relative bg-gray-200">
                        <Image
                          src={trip.imageUrl || fallbackSrc}
                          alt={trip.destination}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg text-brand-dark truncate">
                          {tripTitle}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {trip.destination}
                        </p>
                        <p className="text-xs text-gray-400 mt-3 font-medium bg-gray-50 inline-block px-2 py-1 rounded-md">
                          📅 {format(new Date(trip.startDate), "dd MMM")} -{" "}
                          {format(new Date(trip.endDate), "dd MMM, yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}

          {hasMoreTrips ? (
            <CarouselItem className="pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]">
              <Link href="/meu-perfil/roteiros" className="h-full block">
                <div className="h-full min-h-[280px] rounded-2xl bg-brand-primary/5 border-2 border-brand-primary/20 flex flex-col items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer group gap-4">
                  <div className="p-4 bg-white rounded-full group-hover:bg-white/20 transition-colors shadow-sm">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold block">Ver todos</span>
                    <span className="text-sm opacity-80 font-medium">
                      +{trips.length - VISIBLE_LIMIT} roteiros
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ) : (
            <CarouselItem className="pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]">
              <Link href="/criar-roteiro" className="h-full block">
                <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm font-bold">
                    Planejar Nova Viagem
                  </span>
                </div>
              </Link>
            </CarouselItem>
          )}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex -left-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
        <CarouselNext className="hidden md:flex -right-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
      </Carousel>
    </div>
  );
}
