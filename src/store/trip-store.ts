import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TripInterest =
  | "natureza"
  | "história"
  | "compras"
  | "gastronomia"
  | "vida-noturna"
  | "aventura"
  | "cultura-local"
  | "fotografia"
  | "espiritualidade"
  | "arquitetura"
  | "praias"
  | "esportes";

export type TripBudget = "econômico" | "moderado" | "confortável" | "luxo";

export type TripPace = "relaxado" | "equilibrado" | "intenso";

interface TripState {
  step: number;
  dates: { from: Date | undefined; to: Date | undefined } | null;
  interests: TripInterest[];
  budget: TripBudget | null;
  travelers: { adults: number; children: number };
  pace: TripPace | null;

  setStep: (step: number) => void;
  setDates: (
    range: { from: Date | undefined; to: Date | undefined } | null,
  ) => void;
  toggleInterest: (interest: TripInterest) => void;
  setBudget: (budget: TripBudget) => void;
  setTravelers: (type: "adults" | "children", value: number) => void;
  setPace: (pace: TripPace) => void;
  reset: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      step: 1,
      dates: null,
      interests: [],
      budget: null,
      travelers: { adults: 1, children: 0 },
      pace: null,

      setStep: (step) => set({ step }),
      setDates: (dates) => set({ dates }),
      toggleInterest: (interest) =>
        set((state) => {
          const exists = state.interests.includes(interest);
          return {
            interests: exists
              ? state.interests.filter((i) => i !== interest)
              : [...state.interests, interest],
          };
        }),
      setBudget: (budget) => set({ budget }),
      setTravelers: (type, value) =>
        set((state) => ({
          travelers: { ...state.travelers, [type]: Math.max(0, value) },
        })),
      setPace: (pace) => set({ pace }),
      reset: () =>
        set({
          step: 1,
          dates: null,
          interests: [],
          budget: null,
          travelers: { adults: 1, children: 0 },
          pace: null,
        }),
    }),
    {
      name: "wanderlust-trip-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
