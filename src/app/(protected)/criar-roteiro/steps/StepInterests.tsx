"use client";

import { Button } from "@/components/ui/button";
import { TripInterest, useTripStore } from "@/store/trip-store";

const interestsOptions: { id: TripInterest; label: string; icon: string }[] = [
  { id: "natureza", label: "Natureza", icon: "⛰️" },
  { id: "história", label: "História", icon: "🏛️" },
  { id: "compras", label: "Compras", icon: "🛍️" },
  { id: "praias", label: "Praias", icon: "🏖️" },
  { id: "gastronomia", label: "Gastronomia", icon: "🍽️" },
  { id: "fotografia", label: "Fotografia", icon: "📸" },
  { id: "espiritualidade", label: "Espiritualidade", icon: "🧎‍♂️" },
  { id: "aventura", label: "Aventura", icon: "🧗‍♂️" },
  { id: "vida-noturna", label: "Vida noturna", icon: "🪩" },
  { id: "cultura-local", label: "Cultura local", icon: "🎭" },
  { id: "esportes", label: "Esportes", icon: "⚽️" },
  { id: "arquitetura", label: "Arquitetura", icon: "🏰" },
];

export default function StepInterests() {
  const { interests, toggleInterest, setStep } = useTripStore();

  return (
    <div className="w-full pt-8 md:pt-4">
      {" "}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-cream mb-2 drop-shadow-sm">
          O que mais te interessa?
        </h2>
        <p className="text-brand-cream/70 text-sm md:text-base font-semibold">
          Selecione pelo menos uma opção.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {interestsOptions.map((item) => {
          const isSelected = interests.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleInterest(item.id)}
              className={`
                group cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border transition-all duration-300 select-none
                ${
                  isSelected
                    ? "bg-brand-primary border-brand-cream scale-[1.02] shadow-[0_0_15px_rgba(253,248,243,0.3)]"
                    : "bg-brand-cream/30 border-brand-cream/20 hover:bg-brand-cream/10 hover:border-brand-cream/50"
                }
              `}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl transition-all duration-300
                  ${
                    isSelected
                      ? "bg-brand-cream grayscale-0"
                      : "bg-brand-cream grayscale group-hover:grayscale-0 group-hover:scale-110"
                  }
                `}
              >
                <span role="img" aria-label={item.label}>
                  {item.icon}
                </span>
              </div>

              <span
                className={`text-sm font-medium tracking-wide transition-colors
                  ${
                    isSelected
                      ? "!font-bold text-brand-cream text-base"
                      : "text-brand-cream"
                  }
                `}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center md:justify-end">
        <Button
          onClick={() => setStep(3)}
          disabled={interests.length === 0}
          className="
            w-full md:w-auto px-10 h-14 rounded-full text-lg font-bold shadow-xl transition-all hover:scale-105
            bg-brand-primary hover:bg-brand-light text-white disabled:opacity-50 disabled:cursor-not-allowed
            border border-white/10
          "
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
