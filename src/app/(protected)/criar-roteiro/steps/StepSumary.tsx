import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/trip-store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Activity,
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

export default function StepSummary() {
  const { dates, interests, budget, travelers, pace } = useTripStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="pt-2">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/30">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-brand-cream mb-2 text-center">
        Respire fundo, seu roteiro está sendo criado
      </h2>
      <p className="text-brand-cream text-center mb-8 font-semibold">
        Confira o resumo das suas preferências:
      </p>

      <div className="flex flex-col gap-4 mb-8">
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
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full h-14 rounded-full bg-brand-primary text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
      >
        {isLoading ? "Gerando Mágica..." : "✨ Ver Roteiro Personalizado"}
      </Button>
    </div>
  );
}
