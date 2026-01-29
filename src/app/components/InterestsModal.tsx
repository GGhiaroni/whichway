"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import updateInterests from "../actions/update-interests";

const AVAILABLE_INTERESTS = [
  { label: "Natureza", icon: "🌿" },
  { label: "Praias", icon: "🏖️" },
  { label: "História", icon: "🏛️" },
  { label: "Compras", icon: "🛍️" },
  { label: "Gastronomia", icon: "🍽️" },
  { label: "Aventura", icon: "🧗" },
  { label: "Cultura", icon: "🎭" },
  { label: "Vida Noturna", icon: "🌙" },
  { label: "Relaxamento", icon: "🧘" },
  { label: "Fotografia", icon: "📸" },
  { label: "Arquitetura", icon: "🏰" },
  { label: "Esportes", icon: "⚽" },
];

interface InterestsModalProps {
  currentInterests: string[];
}

export default function InterestsModal({
  currentInterests,
}: InterestsModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(currentInterests);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setSelected(currentInterests);
    setOpen(isOpen);
  };

  const toggleInterest = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateInterests(selected);

      if (result.success) {
        toast.success("Interesses atualizados! 🎉");
        setOpen(false);
      } else {
        toast.error("Erro ao atualizar.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-full text-sm font-bold border border-dashed border-gray-300 text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-1">
          <Plus className="w-4 h-4" /> Gerenciar
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#FDF8F3]">
        <DialogHeader>
          <DialogTitle className="text-brand-dark font-serif text-2xl">
            Seus Interesses
          </DialogTitle>
          <DialogDescription>
            Selecione o que você mais gosta para receber recomendações
            personalizadas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
          {AVAILABLE_INTERESTS.map((item) => {
            const isSelected = selected.includes(item.label);
            return (
              <div
                key={item.label}
                onClick={() => toggleInterest(item.label)}
                className={`
                  cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                  ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary/10"
                      : "border-transparent bg-white hover:border-brand-primary/30"
                  }
                `}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span
                  className={`text-xs font-bold ${
                    isSelected ? "text-brand-primary" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-brand-primary text-white hover:bg-brand-dark"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
