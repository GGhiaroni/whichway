"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteTrip(id: string) {
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
      select: { id: true },
    });

    if (!dbUser) {
      return {
        success: false,
        error: "Usuário não encontrado no banco de dados.",
      };
    }

    const result = await prisma.trip.deleteMany({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Roteiro não encontrado ou usuário sem permissão.",
      };
    }

    revalidatePath("/meu-perfil");

    return { success: true, message: "Roteiro deletado com sucesso!" };
  } catch (error) {
    console.error("Erro ao deletar o roteiro:", error);
    return { success: false, error: "Não foi possível deletar o roteiro." };
  }
}

export async function deletePlace(id: string) {
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
      select: { id: true },
    });

    if (!dbUser) {
      return { success: false, error: "Usuário não encontrado no banco." };
    }

    const result = await prisma.userPlace.deleteMany({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Destino não encontrado ou usuário sem permissão.",
      };
    }

    revalidatePath("/meu-perfil");

    return { success: true, message: "Exclusão realizada com sucesso." };
  } catch (error) {
    console.error("Erro ao realizar a exclusão:", error);
    return { success: false, error: "Não foi possível realizar a exclusão." };
  }
}
