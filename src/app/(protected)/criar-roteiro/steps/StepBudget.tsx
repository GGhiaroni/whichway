"use client";

import { Button } from "@/components/ui/button";
import { TripBudget, useTripStore } from "@/store/trip-store";

const budgetOptions: {
  id: TripBudget;
  label: string;
  desc: string;
  value: string;
  icon: string;
}[] = [
  {
    id: "econômico",
    label: "Econômico",
    desc: "Hostels, transporte público, refeições locais",
    value: "Até R$ 5.000",
    icon: "🎒",
  },
  {
    id: "moderado",
    label: "Moderado",
    desc: "Hotéis 3 estrelas, algumas experiências",
    value: "R$ 5.000 - R$ 10.000",
    icon: "💰",
  },
  {
    id: "confortável",
    label: "Confortável",
    desc: "Hotéis 4 estrelas, tours guiados",
    value: "R$ 10.000 - R$ 20.000",
    icon: "🥂",
  },
  {
    id: "luxo",
    label: "Luxo",
    desc: "Hotéis 5 estrelas, experiências exclusivas",
    value: "Acima de R$ 20.000",
    icon: "💎",
  },
];

export default function StepBudget() {
  const { budget, setBudget, setStep } = useTripStore();

  return (
    <div className="w-full pt-8 md:pt-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-brand-cream mb-2 drop-shadow-sm">
          Qual seu orçamento?
        </h2>
        <p className="text-brand-cream/70 text-sm md:text-base font-light">
          Isso nos ajuda a recomendar opções adequadas ao seu bolso.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {budgetOptions.map((item) => {
          const isSelected = budget === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setBudget(item.id)}
              className={`
                group relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4 select-none
                ${
                  isSelected
                    ? "bg-brand-cream border-brand-cream scale-[1.02] shadow-lg"
                    : "bg-transparent border-brand-cream/20 hover:bg-brand-cream/10 hover:border-brand-cream/50"
                }
              `}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl shrink-0 transition-all duration-300
                  ${
                    isSelected
                      ? "bg-brand-dark/10 grayscale-0"
                      : "bg-brand-cream grayscale group-hover:grayscale-0"
                  }
                `}
              >
                <span role="img" aria-label={item.label}>
                  {item.icon}
                </span>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                  <span
                    className={`font-bold text-lg transition-colors ${
                      isSelected ? "text-brand-dark" : "text-brand-cream"
                    }`}
                  >
                    {item.label}
                  </span>

                  <span
                    className={`w-fit text-sm font-bold tracking-wide transition-colors ${
                      isSelected
                        ? "text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded-md"
                        : "text-brand-cream/90"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>

                <p
                  className={`text-sm transition-colors ${
                    isSelected
                      ? "text-brand-dark font-bold"
                      : "text-brand-cream/60"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center md:justify-end">
        <Button
          onClick={() => setStep(4)}
          disabled={!budget}
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
