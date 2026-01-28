"use client";

import { useTripStore } from "@/store/trip-store";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import StepBudget from "./steps/StepBudget";
import StepDates from "./steps/StepDate";
import StepInterests from "./steps/StepInterests";
import StepPace from "./steps/StepPace";
import StepSummary from "./steps/StepSumary";
import StepTravelers from "./steps/StepTravelers";

function WizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { step, setStep, setDestination, destination, reset } = useTripStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isNewTrip = searchParams.get("new") === "true";
    const destParam = searchParams.get("destino");

    if (isNewTrip) {
      reset();

      if (destParam) {
        setDestination(destParam);
      }

      router.replace(
        destParam ? `/criar-roteiro?destino=${destParam}` : "/criar-roteiro",
      );
    } else if (destParam && destParam !== destination) {
      setDestination(destParam);
    }
  }, [searchParams, reset, setDestination, destination, router]);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleBack = () => {
    if (step === 1) {
      router.push("/");
    } else {
      setStep(step - 1);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <div className="mt-4 container mx-auto px-6 md:px-20">
        <span className="text-sm text-brand-dark font-bold ">
          Passo {step} de {totalSteps}
        </span>
        <div className="w-full h-1.5 bg-white mt-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">
        <div className="w-full max-w-2xl bg-brand-dark rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 min-h-[400px] relative animate-in fade-in zoom-in-95 duration-300">
          {step === 1 && <StepDates />}
          {step === 2 && <StepInterests />}
          {step === 3 && <StepBudget />}
          {step === 4 && <StepTravelers />}
          {step === 5 && <StepPace />}
          {step === 6 && <StepSummary />}

          <button
            onClick={handleBack}
            className="absolute top-6 left-6 md:top-10 md:left-10 text-brand-cream/60 hover:text-brand-cream hover:cursor-pointer flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CriarRoteiro() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  );
}
