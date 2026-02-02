"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface UpdateProfileProps {
  cpf: string;
  dateOfBirth: Date;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export default async function updateProfile(data: UpdateProfileProps) {
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

    const updatedUser = await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        cpf: data.cpf,
        dateOfBirth: data.dateOfBirth,
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
    });

    revalidatePath("/meu-perfil");

    return { success: true, message: "Perfil atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Falha interna ao atualizar dados." };
  }
}
