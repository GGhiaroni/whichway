"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function updateInterests(newInterests: string[]) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    await prisma.user.update({
      where: { email },
      data: {
        interests: newInterests,
      },
    });

    revalidatePath("/meu-perfil");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar interesses:", error);
    return { success: false, error: "Falha ao salvar interesses." };
  }
}
