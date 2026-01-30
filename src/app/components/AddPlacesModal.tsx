"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlaceStatus } from "@prisma/client";
import { Loader2, MapPin, Plus, Search } from "lucide-react";
import { ReactNode, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import addPlacesUserProfile from "../actions/add-places-user-profile";

interface AddPlaceModalProps {
  type: PlaceStatus;
  children?: ReactNode;
}

interface RawNominatimItem {
  place_id: number;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

interface OSMResult {
  place_id: number;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country: string;
  };
}

export default function AddPlaceModal({ type, children }: AddPlaceModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OSMResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [debouncedQuery] = useDebounce(query, 500);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function searchPlaces() {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      setLoadingSearch(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery,
          )}&addressdetails=1&limit=5`,
        );

        const data = (await response.json()) as RawNominatimItem[];

        const validResults: OSMResult[] = data
          .filter(
            (
              item,
            ): item is RawNominatimItem & { address: { country: string } } => {
              return !!(item.address && item.address.country);
            },
          )
          .map((item) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            address: {
              country: item.address!.country!,
              city: item.address!.city,
              town: item.address!.town,
              village: item.address!.village,
            },
          }));

        setResults(validResults);
      } catch (error) {
        console.error("Erro na busca:", error);
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }

    searchPlaces();
  }, [debouncedQuery]);

  const handleSelectPlace = (place: OSMResult) => {
    const cityName =
      place.address.city || place.address.town || place.address.village || "";

    const finalName = cityName || place.display_name.split(",")[0];

    startTransition(async () => {
      const result = await addPlacesUserProfile({
        name: finalName,
        country: place.address.country,
        fullName: place.display_name,
        type: type,
      });

      if (result.success) {
        toast.success("Lugar adicionado com sucesso! 🌍");
        setOpen(false);
        setQuery("");
        setResults([]);
      } else {
        toast.error("Erro ao adicionar lugar.");
      }
    });
  };

  const title =
    type === PlaceStatus.VISITED
      ? "Onde você já esteve?"
      : "Para onde quer ir?";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : type === PlaceStatus.VISITED ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-green-50 hover:text-green-600"
          >
            <Plus className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-rose-50 hover:text-rose-500"
          >
            <Plus className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#FDF8F3]">
        <DialogHeader>
          <DialogTitle className="text-brand-dark font-serif text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription>
            Digite o nome da cidade para adicionar à sua lista.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Ex: Rio de Janeiro, Paris, Tokyo..."
              className="pl-9 h-11 bg-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loadingSearch && (
              <div className="absolute right-3 top-3">
                <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-xl border border-stone-100 z-10 overflow-hidden max-h-60 overflow-y-auto">
              {results.map((place) => (
                <button
                  key={place.place_id}
                  onClick={() => handleSelectPlace(place)}
                  disabled={isPending}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b last:border-0 border-gray-50"
                >
                  <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary shrink-0">
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-brand-dark truncate">
                      {place.address.city ||
                        place.address.town ||
                        place.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {place.address.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length > 3 && !loadingSearch && results.length === 0 && (
            <div className="text-center p-4 text-gray-400 text-sm">
              Nenhum lugar encontrado.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
