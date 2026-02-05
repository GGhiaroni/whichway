"use client";

import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/trip-store";
import { Minus, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

interface CounterRowProps {
  label: string;
  desc: string;
  value: number;
  type: "adults" | "children";
  icon: string;
  onChange: (type: "adults" | "children", newValue: number) => void;
}

function CounterRow({
  label,
  desc,
  value,
  type,
  icon,
  onChange,
}: CounterRowProps) {
  const isDisabled = type === "adults" ? value <= 1 : value <= 0;

  return (
    <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl border border-brand-cream/20 bg-white/5 hover:bg-brand-cream/5 transition-colors select-none">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-brand-cream text-brand-dark text-2xl">
          <span role="img" aria-label={label}>
            {icon}
          </span>
        </div>
        <div>
          <h3 className="text-brand-cream font-bold text-lg">{label}</h3>
          <p className="text-brand-cream/60 text-sm">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-black/20 rounded-full p-1.5 border border-white/10">
        <button
          onClick={() => onChange(type, value - 1)}
          disabled={isDisabled}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 text-brand-cream disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5" />
        </button>

        <span className="text-xl font-bold text-brand-cream min-w-[1.5rem] text-center">
          {value}
        </span>

        <button
          onClick={() => onChange(type, value + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cream text-brand-dark hover:bg-white transition-colors shadow-lg cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function StepTravelers() {
  const { travelers, setTravelers, setStep } = useTripStore();

  return (
    <div className="w-full pt-8 md:pt-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-brand-cream mb-2 drop-shadow-sm">
          Quantas pessoas irão nesta viagem?
        </h2>
        <p className="text-brand-cream/70 text-sm md:text-base font-semibold">
          Para ajustarmos o roteiro e acomodações.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-10 max-w-xl mx-auto">
        <CounterRow
          label="Adultos"
          desc="12 anos ou mais"
          value={travelers.adults}
          type="adults"
          icon="🧑"
          onChange={setTravelers}
        />

        <CounterRow
          label="Crianças"
          desc="Menores de 12 anos"
          value={travelers.children}
          type="children"
          icon="👶"
          onChange={setTravelers}
        />
      </div>

      <div className="flex justify-center md:justify-end">
        <Button
          onClick={() => setStep(5)}
          className="
            w-full md:w-auto px-10 h-14 rounded-full text-lg font-bold shadow-xl transition-all hover:scale-105
            bg-brand-primary hover:bg-brand-light text-white
            border border-white/10
          "
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
