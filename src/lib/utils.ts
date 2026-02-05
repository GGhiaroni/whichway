import { TripInterest, TripPace } from "@/store/trip-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface AddressUser {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
}

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

export const BUDGET_OPTIONS = [
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
] as const;

export const INTERESTS_OPTIONS: {
  id: TripInterest;
  label: string;
  icon: string;
}[] = [
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

export const PACE_OPTIONS: {
  id: TripPace;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "relaxado",
    label: "Relaxado",
    desc: "Você não abre mão de uma viagem para descansar e revigorar as energias.",
    icon: "🧘‍♂️",
  },
  {
    id: "equilibrado",
    label: "Equilibrado",
    desc: "Descansar é importante, mas você não quer abrir mão de conhecer os principais atrativos.",
    icon: "😎",
  },
  {
    id: "intenso",
    label: "Intenso",
    desc: "Descanso? Que nada! Você quer aproveitar cada atração o máximo que puder!",
    icon: "🏃",
  },
];

export function isAdult(dateOfBirth: Date | string | null): boolean {
  if (!dateOfBirth) return false;
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}

export function formatCPF(cpf: string | null): string {
  if (!cpf) return "Não informado";
  const clean = cpf.replace(/\D/g, "");
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatFullAddress(user: AddressUser): string {
  if (!user?.street) return "Endereço não cadastrado";
  const num = user.number || "S/N";
  const comp = user.complement ? ` (${user.complement})` : "";
  return `${user.street}, ${num}${comp} - ${user.neighborhood}, ${user.city} - ${user.state}`;
}

export function validateTravelers(adults: number, children: number): boolean {
  if (adults < 1) return false;
  if (adults === 0 && children > 0) return false;
  return true;
}
