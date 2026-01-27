"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useTripStore } from "@/store/trip-store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { DateRange } from "react-day-picker";

export default function StepDates() {
  const { dates, setDates, setStep } = useTripStore();

  const handleSelectDate = (range: DateRange | undefined) => {
    if (!range) {
      setDates(null);
      return;
    }

    setDates({
      from: range.from,
      to: range.to,
    });
  };

  return (
    <div className="w-full pt-8 md:pt-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-brand-cream mb-2 drop-shadow-sm">
          Quando será a viagem?
        </h2>
        <p className="text-brand-cream/70 text-sm md:text-base font-semibold">
          Selecione a data de ida e volta (aproximada).
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-brand-cream/30 bg-white/5 backdrop-blur-sm">
          <CalendarDays className="w-5 h-5 text-brand-cream" />
          <span className="text-brand-cream font-medium text-sm md:text-base">
            {dates?.from ? (
              <>
                {format(dates.from, "dd 'de' MMM", { locale: ptBR })}
                {dates.to && (
                  <>
                    {" "}
                    <span className="text-brand-cream/50 mx-1">até</span>{" "}
                    {format(dates.to, "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </>
                )}
              </>
            ) : (
              <span className="text-brand-cream/50 italic">
                Selecione as datas abaixo
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <div className="p-4 bg-brand-cream rounded-3xl shadow-2xl">
          <Calendar
            mode="range"
            selected={dates || undefined}
            onSelect={handleSelectDate}
            locale={ptBR}
            className="rounded-md"
            classNames={{
              day_selected:
                "bg-brand-primary text-white hover:bg-brand-primary hover:text-white focus:bg-brand-primary focus:text-white",
              day_today: "bg-gray-100 text-gray-900 font-bold",
              day_range_middle:
                "bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 hover:text-brand-primary",
              head_cell: "text-brand-dark/60 font-medium pt-1",
              caption_label: "text-brand-dark font-bold text-lg capitalize",
            }}
            numberOfMonths={1}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <Button
          onClick={() => setStep(2)}
          disabled={!dates?.from || !dates?.to}
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
