import AddPlaceModal from "@/app/components/AddPlacesModal";
import EditProfileDialog from "@/app/components/EditProfileDialog";
import InterestsModal from "@/app/components/InterestsModal";
import PlacesCarousel from "@/app/components/PlacesCarousel";
import TripsCarousel from "@/app/components/TripsCarousel";
import { Button } from "@/components/ui/button";
import getUserProfile from "@/lib/get-user-profile";
import { PlaceStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Cake,
  Calendar,
  CheckCircle2,
  Fingerprint,
  Heart,
  LucideIcon,
  Mail,
  MapPin,
  Plane,
  Plus,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { success, user, error } = await getUserProfile();

  if (!success || !user) {
    console.error(error);
    redirect("/sign-in");
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const birthDateFormatted = user.dateOfBirth
    ? format(new Date(user.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })
    : "Não informado";

  const addressFormatted = user.street
    ? `${user.street}, ${user.number || "S/N"}${
        user.complement ? ` (${user.complement})` : ""
      } - ${user.neighborhood}, ${user.city} - ${user.state}`
    : "Endereço não cadastrado";

  const cpfFormatted = user.cpf
    ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    : "Não informado";

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-20">
      <header className="bg-white border-b border-stone-100 pt-10 pb-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative group cursor-pointer">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1 border-2 border-dashed border-brand-primary/30 group-hover:border-brand-primary transition-colors">
              <Image
                src={user.imageUrl || "https://github.com/shadcn.png"}
                alt="Avatar"
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div className="absolute bottom-1 right-1 bg-brand-primary text-white p-1.5 rounded-full shadow-md">
              <Settings className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-serif font-bold text-brand-dark mb-1">
              {fullName || "Viajante Sem Nome"}
            </h1>
            <p className="text-gray-500 font-medium mb-4">
              {user.email} • Membro desde{" "}
              {new Date(user.createdAt).getFullYear()}
            </p>

            <div className="flex justify-center md:justify-start gap-8">
              <div className="text-center">
                <span className="block text-xl font-bold text-brand-dark">
                  {user.trips.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Roteiros
                </span>
              </div>
              <div className="w-px bg-gray-200 h-8 self-center" />
              <div className="text-center">
                <span className="block text-xl font-bold text-brand-dark">
                  {user.visitedPlaces.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Visitados
                </span>
              </div>
              <div className="w-px bg-gray-200 h-8 self-center" />
              <div className="text-center">
                <span className="block text-xl font-bold text-brand-dark">
                  {user.wishlistPlaces.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Desejos
                </span>
              </div>
            </div>
          </div>

          <EditProfileDialog user={user} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 space-y-12">
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" /> Informações
              Pessoais
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={User} label="Nome Completo" value={fullName} />
            <InfoItem icon={Mail} label="E-mail" value={user.email} />

            <InfoItem icon={Fingerprint} label="CPF" value={cpfFormatted} />
            <InfoItem
              icon={Cake}
              label="Data de Nascimento"
              value={birthDateFormatted}
            />

            <div className="md:col-span-2">
              <InfoItem
                icon={MapPin}
                label="Endereço Cadastrado"
                value={addressFormatted}
              />
            </div>

            <InfoItem
              icon={Calendar}
              label="Membro Desde"
              value={format(new Date(user.createdAt), "dd 'de' MMM, yyyy", {
                locale: ptBR,
              })}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-dark">
              Meus Interesses
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {user.interests.length > 0 ? (
                user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-sm font-bold border bg-brand-primary/10 border-brand-primary text-brand-primary transition-all cursor-default"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  Nenhum interesse selecionado ainda.
                </p>
              )}

              <InterestsModal currentInterests={user.interests} />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Plane className="w-5 h-5 text-brand-primary" /> Meus Roteiros
            </h2>
            <Link href="/criar-roteiro">
              <Button className="rounded-full bg-brand-primary hover:bg-brand-dark text-white shadow-lg shadow-brand-primary/20">
                <Plus className="w-4 h-4 mr-1" /> Novo Roteiro
              </Button>
            </Link>
          </div>

          {user.trips.length > 0 ? (
            <TripsCarousel trips={user.trips} />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-200 text-center">
              <p className="text-gray-500 mb-4">
                Você ainda não tem roteiros planejados.
              </p>
              <Link href="/criar-roteiro">
                <Button variant="outline">Criar meu primeiro roteiro</Button>
              </Link>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> Onde já estive
            </h2>
            <AddPlaceModal type={PlaceStatus.VISITED} />
          </div>

          <PlacesCarousel
            places={user.visitedPlaces}
            type={PlaceStatus.VISITED}
          />
        </section>

        <section className="pb-10">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-dark" /> Desejo Visitar
            </h2>
            <AddPlaceModal type={PlaceStatus.WISHLIST} />
          </div>

          <PlacesCarousel
            places={user.wishlistPlaces}
            type={PlaceStatus.WISHLIST}
          />
        </section>
      </main>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-stone-50 border border-stone-100/50">
      <div className="shrink-0 mt-0.5 w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-gray-400 shadow-sm">
        <Icon className="w-5 h-5 text-brand-cream font-semibold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-brand-dark font-medium text-base leading-relaxed break-words">
          {value || "Não informado"}
        </p>
      </div>
    </div>
  );
}
