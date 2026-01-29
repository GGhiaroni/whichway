"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { PlaceStatus } from "@prisma/client";

export default async function getUserProfile() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        trips: {
          orderBy: { createdAt: "desc" },
        },

        places: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!dbUser) {
      return { success: false, error: "Usuário não encontrado no banco." };
    }

    const visitedPlaces = dbUser.places.filter(
      (p) => p.status === PlaceStatus.VISITED,
    );

    const wishlistPlaces = dbUser.places.filter(
      (p) => p.status === PlaceStatus.WISHLIST,
    );

    return {
      success: true,
      user: {
        ...dbUser,
        visitedPlaces,
        wishlistPlaces,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar prefil:", error);
    return { success: false, error: "Erro interno ao buscar dados." };
  }
}
