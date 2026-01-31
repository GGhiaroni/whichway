import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ItineraryJSON {
  titulo?: string;
}

interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  itinerary: unknown;
}

interface TripsCarouselProps {
  trips: Trip[];
}

export default function TripsCarousel({ trips }: TripsCarouselProps) {
  const getTripStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) return { label: "Concluída", color: "bg-green-500" };
    if (now >= start && now <= end)
      return { label: "Em andamento", color: "bg-blue-500" };
    return { label: "Próxima", color: "bg-brand-primary" };
  };

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
          {trips.map((trip) => {
            const status = getTripStatus(trip.startDate, trip.endDate);
            const tripTitle =
              (trip.itinerary as ItineraryJSON)?.titulo ||
              `Viagem para ${trip.destination}`;

            return (
              <CarouselItem
                key={trip.id}
                className="pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]"
              >
                <Link href={`/roteiro/${trip.id}`}>
                  <div className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group cursor-pointer h-full select-none">
                    <div className="h-40 overflow-hidden relative bg-gray-200">
                      <Image
                        src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80`}
                        alt={trip.destination}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={`${status.color} text-white border-none`}
                        >
                          {status.label}
                        </Badge>
                      </div>
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
              </CarouselItem>
            );
          })}

          <CarouselItem className="pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]">
            <Link href="/criar-roteiro" className="h-full block">
              <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">Planejar Nova Viagem</span>
              </div>
            </Link>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex -left-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
        <CarouselNext className="hidden md:flex -right-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
      </Carousel>
    </div>
  );
}
