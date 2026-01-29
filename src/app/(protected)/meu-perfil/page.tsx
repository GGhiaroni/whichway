import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import getUserProfile from "@/lib/get-user-profile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  Globe2,
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

interface ItineraryJSON {
  titulo?: string;
}

export default async function ProfilePage() {
  const { success, user, error } = await getUserProfile();

  if (!success || !user) {
    console.error(error);
    redirect("/sign-in");
  }

  const getTripStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    if (now > endDate) return { label: "Concluída", color: "bg-green-500" };
    if (now >= startDate && now <= endDate)
      return { label: "Em andamento", color: "bg-blue-500" };
    return { label: "Próxima", color: "bg-brand-primary" };
  };

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

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

          <Button
            variant="outline"
            className="rounded-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
          >
            Editar Perfil
          </Button>
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

              <button className="px-4 py-2 rounded-full text-sm font-bold border border-dashed border-gray-300 text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-1">
                <Plus className="w-4 h-4" /> Gerenciar
              </button>
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
            <div className="flex overflow-x-auto pb-6 gap-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {user.trips.map((trip) => {
                const status = getTripStatus(
                  new Date(trip.startDate),
                  new Date(trip.endDate),
                );

                const tripTitle =
                  (trip.itinerary as unknown as ItineraryJSON)?.titulo ||
                  `Viagem para ${trip.destination}`;

                return (
                  <Link href={`/roteiro/${trip.id}`} key={trip.id}>
                    <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group cursor-pointer h-full">
                      <div className="h-40 overflow-hidden relative bg-gray-200">
                        <Image
                          src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80`}
                          alt={trip.destination}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge
                            className={`${status.color} text-white border-none`}
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-brand-dark truncate">
                          {tripTitle}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {trip.destination}
                        </p>
                        <p className="text-xs text-gray-400 mt-3 font-medium bg-gray-50 inline-block px-2 py-1 rounded-md">
                          📅 {format(new Date(trip.startDate), "dd MMM")} -{" "}
                          {format(new Date(trip.endDate), "dd MMM, yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
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
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-green-50 hover:text-green-600"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.visitedPlaces.map((place) => (
              <div
                key={place.id}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={place.imageUrl || "/placeholder-place.jpg"}
                  alt={place.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold text-sm md:text-base leading-tight">
                    {place.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">
                    {place.country}
                  </p>
                </div>
              </div>
            ))}

            <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition-all cursor-pointer">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-xs font-bold">Adicionar</span>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Desejo Visitar
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-rose-50 hover:text-rose-500"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex overflow-x-auto gap-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {user.wishlistPlaces.map((place) => (
              <div
                key={place.id}
                className="min-w-[200px] h-[280px] rounded-2xl overflow-hidden relative group cursor-pointer"
              >
                <Image
                  src={place.imageUrl || "/placeholder-place.jpg"}
                  alt={place.name}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md p-1.5 rounded-full text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-light uppercase tracking-widest mb-1">
                    {place.country}
                  </p>
                  <h4 className="text-xl font-serif">{place.name}</h4>
                </div>
              </div>
            ))}

            <div className="min-w-[200px] h-[280px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
              <Globe2 className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">Novo Sonho</span>
            </div>
          </div>
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
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          {label}
        </p>
        <p className="text-brand-dark font-medium">
          {value || "Não informado"}
        </p>
      </div>
    </div>
  );
}
