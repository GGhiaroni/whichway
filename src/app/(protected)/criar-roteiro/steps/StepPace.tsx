"use client";

import { Button } from "@/components/ui/button";
import { PACE_OPTIONS } from "@/lib/utils";
import { useTripStore } from "@/store/trip-store";

export default function StepPace() {
  const { pace, setPace, setStep } = useTripStore();

  return (
    <div className="w-full pt-8 md:pt-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-brand-cream mb-2 drop-shadow-sm">
          Qual o seu perfil para essa viagem?
        </h2>
        <p className="text-brand-cream/70 text-sm md:text-base font-semibold">
          Vamos pensar em roteiros que atendam criteriosamente sua escolha.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {PACE_OPTIONS.map((item) => {
          const isSelected = pace === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setPace(item.id)}
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
          onClick={() => setStep(6)}
          disabled={!pace}
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
