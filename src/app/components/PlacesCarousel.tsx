"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceStatus } from "@prisma/client";
import { Globe2, Heart, Plus } from "lucide-react";
import Image from "next/image";
import AddPlaceModal from "./AddPlacesModal";
import DeletePlaceDialog from "./DeletePlaceDialog";

interface Place {
  id: string;
  name: string;
  country: string;
  imageUrl: string | null;
}

interface PlacesCarouselProps {
  title?: string;
  places: Place[];
  type: PlaceStatus;
}

export default function PlacesCarousel({ places, type }: PlacesCarouselProps) {
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
          {places.map((place) => (
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

                <DeletePlaceDialog id={place.id} name={place.name} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {type === PlaceStatus.WISHLIST && (
                  <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md p-1.5 rounded-full text-white">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold text-sm md:text-base leading-tight">
                    {place.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">
                    {place.country}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}

          <CarouselItem className="pl-4 basis-[45%] md:basis-[30%] lg:basis-[22%]">
            <AddPlaceModal type={type}>
              <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer h-full">
                {type === PlaceStatus.VISITED ? (
                  <>
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold">Adicionar</span>
                  </>
                ) : (
                  <>
                    <Globe2 className="w-8 h-8 mb-2" />
                    <span className="text-sm font-bold">Novo Sonho</span>
                  </>
                )}
              </div>
            </AddPlaceModal>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex -left-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
        <CarouselNext className="hidden md:flex -right-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" />
      </Carousel>
    </div>
  );
}
