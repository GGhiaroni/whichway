"use client";

import Logomarca from "@/app/components/Logomarca";
import { useTripStore } from "@/store/trip-store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StepInterests from "./steps/StepInterests";

export default function CriarRoteiro() {
  const { step, setStep } = useTripStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleBack = () => {
    if (step === 1) {
      router.push("/");
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="px-6 py-6 flex justify-between items-center max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Logomarca />
        </div>
        <span className="text-sm text-brand-dark font-bold">
          Passo {step} de {totalSteps}
        </span>
      </header>

      <div className="w-full h-1.5 bg-white">
        <div
          className="h-full bg-brand-light transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">
        <div className="w-full max-w-2xl bg-brand-dark rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 min-h-[400px] relative">
          {/* {step === 1 && <StepDates />} */}
          {step === 1 && <StepInterests />}
          {/* {step === 3 && <StepBudget />}
          {step === 4 && <StepTravelers />}
          {step === 5 && <StepPace />}
          {step === 6 && <StepSummary />} */}

          <button
            onClick={handleBack}
            className="absolute top-6 left-6 md:top-10 md:left-10 text-brand-cream hover:cursor-pointer flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </main>
    </div>
  );
}
