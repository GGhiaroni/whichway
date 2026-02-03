"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceStatus } from "@prisma/client";
import { ArrowRight, Globe2, Heart, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddPlaceModal from "./AddPlacesModal";
import DeletePlaceDialog from "./DeletePlaceDialog";

interface Place {
  id: string;
  name: string;
  country: string | null;
  imageUrl: string | null;
}

interface PlacesCarouselProps {
  title?: string;
  places: Place[];
  type: PlaceStatus;
}

export default function PlacesCarousel({ places, type }: PlacesCarouselProps) {
  const VISIBLE_LIMIT = 5;
  const hasMorePlaces = places.length > VISIBLE_LIMIT;
  const visiblePlaces = places.slice(0, VISIBLE_LIMIT);

  const viewAllLink =
    type === PlaceStatus.VISITED
      ? "/meu-perfil/lugares/visitados"
      : "/meu-perfil/lugares/wishlist";

  const typeLabel = type === PlaceStatus.VISITED ? "visitados" : "wishlist";

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
          {visiblePlaces.map((place) => (
            <CarouselItem
              key={place.id}
              className="pl-4 basis-[45%] md:basis-[30%] lg:basis-[22%]"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group select-none">
                <Image
                  src={place.imageUrl || "/placeholder-place.jpg"}
                  alt={place.name}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-2 right-2 z-50">
                  <DeletePlaceDialog id={place.id} name={place.name} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {type === PlaceStatus.WISHLIST && (
                  <div className="absolute top-3 left-3 bg-white/30 backdrop-blur-md p-1.5 rounded-full text-white">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3 text-white right-3">
                  <p className="font-bold text-sm md:text-base leading-tight truncate">
                    {place.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80 truncate">
                    {place.country || "Mundo"}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}

          {hasMorePlaces ? (
            <CarouselItem className="pl-4 basis-[45%] md:basis-[30%] lg:basis-[22%]">
              <Link href={viewAllLink} className="block h-full">
                <div className="aspect-[3/4] h-full rounded-2xl bg-brand-primary/5 border-2 border-brand-primary/20 flex flex-col items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer group gap-3 p-4">
                  <div className="p-3 bg-white rounded-full group-hover:bg-white/20 transition-colors shadow-sm">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold block leading-tight">
                      Ver todos
                    </span>
                    <span className="text-xs opacity-80 font-medium">
                      +{places.length - VISIBLE_LIMIT} {typeLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ) : (
            <CarouselItem className="pl-4 basis-[45%] md:basis-[30%] lg:basis-[22%]">
              <AddPlaceModal type={type}>
                <div className="aspect-[3/4] h-full rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer w-full">
                  {type === PlaceStatus.VISITED ? (
                    <>
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Adicionar
                      </span>
                    </>
                  ) : (
                    <>
                      <Globe2 className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Novo Sonho
                      </span>
                    </>
                  )}
                </div>
              </AddPlaceModal>
            </CarouselItem>
          )}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex -left-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
        <CarouselNext className="hidden md:flex -right-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
      </Carousel>
    </div>
  );
}
