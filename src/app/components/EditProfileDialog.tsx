"use client";

import updateProfile from "@/app/actions/update-profile";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, isAfter, isBefore, parseISO, subYears } from "date-fns";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserData {
  cpf?: string | null;
  dateOfBirth?: Date | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
}

interface EditProfileDialogProps {
  user: UserData;
}

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export default function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const [formData, setFormData] = useState({
    cpf: user.cpf || "",
    dateOfBirth: user.dateOfBirth
      ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
      : "",
    cep: user.cep || "",
    street: user.street || "",
    number: user.number || "",
    complement: user.complement || "",
    neighborhood: user.neighborhood || "",
    city: user.city || "",
    state: user.state || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "cpf") {
      value = maskCPF(value);
    }
    if (name === "cep") {
      value = maskCEP(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlurCep = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
      toast.success("Endereço preenchido automaticamente!");
    } catch (error) {
      console.error("Erro ao buscar CEP.", error);
      toast.error("Erro ao buscar CEP.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const MIN_AGE = 18;

  const maxDateAllowed = subYears(new Date(), MIN_AGE);

  const maxDateString = format(maxDateAllowed, "yyyy-MM-dd");

  const minDateString = "1900-01-01";

  const handleSave = async () => {
    if (formData.dateOfBirth) {
      const selectedDate = parseISO(formData.dateOfBirth);

      if (isAfter(selectedDate, maxDateAllowed)) {
        toast.error(`Você precisa ter pelo menos ${MIN_AGE} anos.`);
        return;
      }

      if (isBefore(selectedDate, parseISO(minDateString))) {
        toast.error("Data de nascimento inválida.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const dateObj = formData.dateOfBirth
        ? new Date(formData.dateOfBirth + "T12:00:00")
        : new Date();

      const result = await updateProfile({
        ...formData,
        dateOfBirth: dateObj,
      });

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
        setOpen(false);
      } else {
        toast.error(result.error || "Erro ao atualizar.");
      }
    } catch (error) {
      console.error("Erro inesperado.", error);
      toast.error("Erro inesperado.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
        >
          Editar Perfil
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-brand-cream sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-brand-dark text-xl font-serif">
            Editar Informações
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Mantenha seus dados atualizados para facilitar suas próximas
            viagens.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-brand-dark font-medium">
                CPF
              </Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                maxLength={14}
                className="bg-white border-brand-primary/20 focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="text-brand-dark font-medium"
              >
                Data de Nascimento
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                max={maxDateString}
                min={minDateString}
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="bg-white border-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="h-[1px] bg-brand-primary/10 my-1" />

          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="col-span-2 space-y-2 relative">
              <Label htmlFor="cep" className="text-brand-dark font-medium">
                CEP
              </Label>
              <div className="relative">
                <Input
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={handleBlurCep}
                  maxLength={9}
                  className={`bg-white border-brand-primary/20 focus:border-brand-primary ${isLoadingCep ? "opacity-50" : ""}`}
                />
                {isLoadingCep && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2 pb-3 text-xs text-gray-500 italic">
              {isLoadingCep
                ? "Buscando..."
                : "Digite o CEP para buscar endereço"}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                Rua <Lock className="w-3 h-3" />
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                className="bg-stone-200/50 border-transparent text-gray-600 cursor-not-allowed font-medium"
                readOnly
                tabIndex={-1}
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label htmlFor="number" className="text-brand-dark font-medium">
                Número
              </Label>
              <Input
                id="number"
                name="number"
                placeholder="123"
                value={formData.number}
                onChange={handleChange}
                className="bg-white border-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                Bairro <Lock className="w-3 h-3" />
              </Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                className="bg-stone-200/50 border-transparent text-gray-600 cursor-not-allowed font-medium"
                readOnly
                tabIndex={-1}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="complement"
                className="text-brand-dark font-medium"
              >
                Complemento
              </Label>
              <Input
                id="complement"
                name="complement"
                placeholder="Apto 101"
                value={formData.complement}
                onChange={handleChange}
                className="bg-white border-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                Cidade <Lock className="w-3 h-3" />
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                className="bg-stone-200/50 border-transparent text-gray-600 cursor-not-allowed font-medium"
                readOnly
                tabIndex={-1}
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                UF <Lock className="w-3 h-3" />
              </Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                className="bg-stone-200/50 border-transparent text-gray-600 cursor-not-allowed font-medium text-center"
                readOnly
                tabIndex={-1}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isSaving}
            className="hover:bg-stone-100 text-stone-600"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoadingCep}
            className="bg-brand-primary hover:bg-brand-dark text-white font-semibold transition-all shadow-md"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
