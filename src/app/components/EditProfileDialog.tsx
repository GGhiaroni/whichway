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
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
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
    const { name, value } = e.target;
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
      toast.success("Endereço encontrado!");
    } catch (error) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSave = async () => {
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
          className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
        >
          Editar Perfil
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-brand-cream sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-dark text-xl">
            Editar Informações
          </DialogTitle>
          <DialogDescription>
            Mantenha seus dados atualizados para facilitar suas próximas
            viagens.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="h-[1px] bg-stone-200 my-2" />

          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="col-span-2 space-y-2 relative">
              <Label htmlFor="cep">CEP</Label>
              <div className="relative">
                <Input
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={handleBlurCep}
                  className={isLoadingCep ? "pr-8 opacity-70" : ""}
                />
                {isLoadingCep && (
                  <div className="absolute right-2 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2 flex items-center pb-2 text-xs text-gray-500">
              {isLoadingCep
                ? "Buscando endereço..."
                : "Digite o CEP para buscar"}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label htmlFor="street">Rua / Logradouro</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                className="bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                placeholder="123"
                value={formData.number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                className="bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                name="complement"
                placeholder="Apto 101"
                value={formData.complement}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                className="bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label htmlFor="state">UF</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                className="bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoadingCep}
            className="bg-brand-primary text-white"
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
