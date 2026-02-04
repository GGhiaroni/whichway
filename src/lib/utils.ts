import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeAccentsForUnsplashQuery(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function calculateTripDays(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(end.getTime() - start.getTime());

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1;
}

export function cleanAIJSON(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

export type PriceLevel = "Alto" | "Médio" | "Baixo" | string;

export function getPriceBadgeConfig(price: PriceLevel) {
  const safePrice = price ? price.trim() : "";

  switch (safePrice) {
    case "Alto":
      return {
        label: "Alto",
        emoji: "💰💰💰",
        classes: "bg-amber-100 border-amber-300 text-amber-700",
      };
    case "Médio":
      return {
        label: "Médio",
        emoji: "💰💰",
        classes: "bg-blue-100 border-blue-300 text-blue-700",
      };
    case "Baixo":
      return {
        label: "Baixo",
        emoji: "💰",
        classes: "bg-green-100 border-green-300 text-green-700",
      };
    default:
      return {
        label: "Sob Consulta",
        emoji: "",
        classes: "bg-gray-500/90 border-gray-400 text-white",
      };
  }
}
