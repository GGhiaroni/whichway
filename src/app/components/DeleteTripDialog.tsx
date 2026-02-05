"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTrip } from "../actions/delete-item";

interface DeleteTripDialogProps {
  id: string;
  placeName: string;
}

export default function DeleteTripDialog({
  id,
  placeName,
}: DeleteTripDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteTrip(id);

      if (result.success) {
        toast.success("Local removido com sucesso!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Erro ao deletar.");
      }
    } catch (error) {
      console.error("Erro ao deletar local.", error);
      toast.error("Ocorreu um erro ao tentar deletar o local.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-brand-primary hover:text-brand-dark hover:bg-red-50 transition-colors absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[90%] sm:w-full sm:max-w-md bg-brand-cream border-stone-200 rounded-2xl p-6">
        <div
          className="absolute right-4 top-4 md:-right-3 md:-top-3 p-1.5 bg-brand-dark rounded-full cursor-pointer hover:bg-black transition-colors shadow-md z-50"
          onClick={() => setIsOpen(false)}
        >
          <X className="text-brand-cream w-4 h-4" />
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-brand-dark text-xl text-left">
            Remover roteiro para {placeName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-left text-base">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            roteiro para
            <span className="font-bold text-brand-dark"> {placeName} </span>
            da sua lista.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            className="w-full sm:w-auto font-semibold text-brand-dark border-brand-dark/20 hover:bg-brand-dark/5 hover:text-brand-dark mt-0"
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-brand-dark hover:bg-brand-primary text-white font-semibold border-none shadow-md"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removendo...
              </>
            ) : (
              "Sim, remover"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
