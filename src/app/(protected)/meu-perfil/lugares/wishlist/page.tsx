import AddPlaceModal from "@/app/components/AddPlacesModal";
import DeletePlaceDialog from "@/app/components/DeletePlaceDialog";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PlaceStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, Globe2, Heart, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect("/");
  }

  const destinations = await prisma.userPlace.findMany({
    where: {
      userId: user.id,
      status: PlaceStatus.WISHLIST,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#FDF8F3] pb-20">
      <header className="bg-white border-b border-stone-100 pt-10 pb-8 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/meu-perfil">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-stone-100 text-stone-500"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark flex items-center gap-2">
                Minha Wishlist{" "}
                <Heart className="w-6 h-6 text-brand-primary fill-brand-primary/20" />
              </h1>
              <p className="text-gray-500 text-sm">
                Você possui {destinations.length} destinos nos seus sonhos.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <AddPlaceModal type={PlaceStatus.WISHLIST}>
              <Button className="w-full md:w-auto rounded-full bg-brand-primary hover:bg-brand-dark text-white font-bold shadow-lg shadow-brand-primary/20 gap-2">
                <Plus className="w-4 h-4" /> Adicionar novo local
              </Button>
            </AddPlaceModal>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">
              Sua lista está vazia
            </h3>
            <p className="text-gray-500 mb-6">
              Que tal começar a planejar seus sonhos?
            </p>
            <AddPlaceModal type={PlaceStatus.WISHLIST}>
              <Button variant="outline">Adicionar primeiro destino</Button>
            </AddPlaceModal>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((place) => (
              <div key={place.id} className="relative group">
                <div className="absolute top-3 right-3 z-20">
                  <DeletePlaceDialog id={place.id} name={place.name} />
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100 h-full flex flex-col group cursor-default">
                  <div className="h-48 overflow-hidden relative bg-gray-200">
                    <Image
                      src={
                        place.imageUrl ||
                        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
                      }
                      alt={place.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs uppercase tracking-wider font-bold opacity-90 flex items-center gap-1">
                        <Globe2 className="w-3 h-3" />{" "}
                        {place.country || "Mundo"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-brand-dark line-clamp-1 mb-2">
                      {place.name}
                    </h3>

                    <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-gray-400 font-medium border-t border-stone-50">
                      <Calendar className="w-3.5 h-3.5" />
                      Adicionado em{" "}
                      {format(place.createdAt, "dd MMM, yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <AddPlaceModal type={PlaceStatus.WISHLIST}>
              <div className="h-full min-h-[300px] w-full rounded-2xl border-2 border-dashed border-stone-300 hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-brand-primary cursor-pointer gap-3 p-6">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold">Adicionar Novo Sonho</span>
              </div>
            </AddPlaceModal>
          </div>
        )}
      </main>
    </div>
  );
}
