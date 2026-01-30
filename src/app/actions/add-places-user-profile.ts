"use server";

import { prisma } from "@/lib/prisma";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { currentUser } from "@clerk/nextjs/server";
import { PlaceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface AddPlaceParams {
  name: string;
  fullName: string;
  country: string;
  type: PlaceStatus;
  visitDate?: Date;
}

export default async function addPlacesUserProfile(data: AddPlaceParams) {
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
    });

    if (!dbUser) {
      return {
        success: false,
        error: "Usuário não encontrado no banco de dados.",
      };
    }

    const photoData = await getUnsplashPhoto(
      `${data.name} ${data.country} travel`,
    );

    const imageUrl = photoData?.regular || null;

    await prisma.userPlace.create({
      data: {
        user: { connect: { email } },
        name: data.name,
        country: data.country,
        imageUrl: imageUrl,
        status: data.type,
        visitDate: data.visitDate,
      },
    });

    revalidatePath("/meu-perfil");
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar lugar:", error);
    return { success: false, error: "Erro ao salvar." };
  }
}
