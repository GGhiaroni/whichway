"use client";

import generateTrip from "@/app/actions/generate-trip";
import { suggestDestinations } from "@/app/actions/suggest-destination";
import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/trip-store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Activity,
  ArrowRight,
  Calendar,
  MapPin,
  RefreshCcw,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import SuggestionSkeleton from "./SuggestionSkeleton";

interface Suggestion {
  cidade: string;
  pais: string;
  motivo: string;
  imagem: string | null;
}

export default function StepSummary() {
  const {
    dates,
    interests,
    budget,
    travelers,
    pace,
    destination,
    setDestination,
    reset,
  } = useTripStore();

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const router = useRouter();

  if (isLoading && !destination) {
    return <SuggestionSkeleton />;
  }

  const createFinalTrip = async (targetDestination: string) => {
    if (!dates?.from || !dates?.to || !budget || !pace) return;

    setIsLoading(true);
    try {
      const result = await generateTrip({
        destination: targetDestination,
        dates: { from: dates.from, to: dates.to },
        budget,
        pace,
        travelers,
        interests,
      });

      if (result.success && result.tripId) {
        toast.success("Roteiro criado com sucesso! 🚀");
        router.push(`/roteiro/${result.tripId}`);
        reset();
      } else {
        throw new Error(result.error || "Erro desconhecido");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar roteiro final.");
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!dates?.from || !dates?.to) {
      toast.error("Por favor, selecione as datas da viagem.");
      return;
    }
    if (interests.length === 0) {
      toast.error("Selecione pelo menos um interesse.");
      return;
    }
    if (!budget) {
      toast.error("Selecione um orçamento.");
      return;
    }

    setIsLoading(true);

    if (destination) {
      await createFinalTrip(destination);
      return;
    }

    try {
      const result = await suggestDestinations({
        budget,
        interests,
        travelers,
        dates: { from: dates.from, to: dates.to },
      });

      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions);
        setIsLoading(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Não conseguimos sugerir destinos agora.");
      setIsLoading(false);
    }
  };

  if (suggestions.length > 0) {
    return (
      <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-brand-cream text-center mb-2 pt-6">
          Destinos perfeitos para você
        </h2>
        <p className="text-brand-cream/80 text-center mb-6 text-sm font-semibold">
          Baseado no seu perfil, selecionamos estas 3 opções:
        </p>

        <div className="grid gap-4 mb-6">
          {suggestions.map((place, idx) => (
            <div
              key={idx}
              onClick={() => {
                setDestination(place.cidade);
                createFinalTrip(place.cidade);
              }}
              className="group relative h-32 md:h-40 w-full rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-brand-primary transition-all shadow-lg"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${place.imagem || "/placeholder.jpg"})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-black/10" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">
                      {place.cidade}, {place.pais}
                    </h3>
                    <p className="text-sm font-bold text-white/80 line-clamp-1 md:line-clamp-none max-w-[80%]">
                      {place.motivo}
                    </p>
                  </div>
                  <div className="bg-brand-primary p-2 rounded-full text-white transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={() => setSuggestions([])}
          className="w-full text-brand-cream hover:text-white hover:bg-white/10 flex items-center gap-2 font-semibold"
        >
          <RefreshCcw className="w-4 h-4 font-semibold" /> Tentar preferências
          diferentes
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/30">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-brand-cream mb-2 text-center">
        {destination ? "Pronto para decolar?" : "Vamos definir seu destino!"}
      </h2>
      <p className="text-brand-cream text-center mb-8 font-semibold">
        {destination
          ? `Criando roteiro para ${destination}`
          : "Analisando seu perfil..."}
      </p>

      <div className="flex flex-col gap-4 mb-8">
        {destination && (
          <div className="flex items-center gap-4 p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
            <div className="p-3 bg-brand-primary rounded-xl text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-brand-cream/60 uppercase font-bold">
                Destino Escolhido
              </p>
              <p className="font-bold text-brand-cream text-lg">
                {destination}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Datas</p>
            <p className="font-bold text-brand-dark">
              {dates?.from
                ? format(dates.from, "dd MMM", { locale: ptBR })
                : "A definir"}{" "}
              -{" "}
              {dates?.to
                ? format(dates.to, "dd MMM, yyyy", { locale: ptBR })
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Viajantes
            </p>
            <p className="font-bold text-brand-dark">
              {travelers.adults} Adultos, {travelers.children} Crianças
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Orçamento
            </p>
            <p className="font-bold text-brand-dark capitalize">{budget}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Ritmo</p>
            <p className="font-bold text-brand-dark capitalize">{pace}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <p className="text-xs text-gray-500 uppercase font-bold">
              Interesses
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span
                key={i}
                className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full capitalize"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleAction}
        disabled={isLoading}
        className="w-full h-14 rounded-full bg-brand-primary text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            {destination ? "Gerando roteiro..." : "Buscando destinos..."}
          </span>
        ) : destination ? (
          "✨ Gerar roteiro personalizado"
        ) : (
          <div className="flex gap-3">
            <span>🔍</span>
            <span>Descobrir destinos ideais</span>
          </div>
        )}
      </Button>
    </div>
  );
}
