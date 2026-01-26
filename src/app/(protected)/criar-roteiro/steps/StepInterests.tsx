"use client";

import { TripInterest } from "@/store/trip-store";

const interestsOptions: { id: TripInterest; label: string; icon: string }[] = [
  { id: "natureza", label: "Natureza", icon: "⛰️" },
  { id: "história", label: "História", icon: "🏛️" },
  { id: "compras", label: "Compras", icon: "🛍️" },
  { id: "praias", label: "Praias", icon: "🏖️" },
  { id: "gastronomia", label: "Gastronomia", icon: "🍽️" },
  { id: "fotografia", label: "Fotografia", icon: "📸" },
  { id: "espiritualidade", label: "Espiritualidade", icon: "🧎‍♂️" },
  { id: "aventura", label: "Aventura", icon: "🧗‍♂️" },
  { id: "vida noturna", label: "Vida noturna", icon: "🪩" },
  { id: "cultura local", label: "Cultura local", icon: "🎭" },
  { id: "esportes", label: "Esportes", icon: "⚽️" },
  { id: "arquitetura", label: "Arquitetura", icon: "🏰" },
];

export default function StepInterests() {
  return <div>StepInterests</div>;
}
