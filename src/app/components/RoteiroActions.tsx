"use client";

import { Button } from "@/components/ui/button";
import { Check, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RoteiroActions() {
  const router = useRouter();

  const handleSaveAndFinish = () => {
    toast.success("Roteiro salvo na sua coleção! 🎉");
    router.push("/meu-perfil");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-100 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-500">
            O que achou deste planejamento?
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/criar-roteiro?new=true" className="flex-1 md:flex-none">
            <Button
              variant="outline"
              className="w-full border-stone-200 text-gray-600 hover:bg-stone-50 hover:text-brand-dark h-12 md:h-10"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Gerar Outro
            </Button>
          </Link>

          <Button
            onClick={handleSaveAndFinish}
            className="flex-1 md:flex-none bg-brand-primary hover:bg-brand-dark text-white font-bold shadow-lg shadow-brand-primary/20 h-12 md:h-10"
          >
            <Check className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
