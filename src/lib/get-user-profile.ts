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

    let dbUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        trips: {
          orderBy: { createdAt: "desc" },
          take: 6,
        },

        places: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!dbUser) {
      console.log("🛠️ Usuário fantasma detectado. Recriando no banco...");

      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: email,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        },
        include: {
          trips: true,
          places: true,
        },
      });
    }

    const allPlaces = dbUser.places || [];

    const visitedPlaces = allPlaces.filter(
      (p) => p.status === PlaceStatus.VISITED,
    );

    const wishlistPlaces = allPlaces.filter(
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
    console.error("Erro crítico ao buscar perfil:", error);
    return { success: false, error: "Erro interno ao buscar dados." };
  }
}
