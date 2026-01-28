"use server";

import { GEMINI_MODEL_FLASH, genAI } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface GenerateTripsParams {
  destination: string;
  dates: { from: Date; to: Date };
  budget: string;
  pace: string;
  travelers: { adults: number; children: number };
  interests: string[];
}

export default async function generateTrip(data: GenerateTripsParams) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        imageUrl: clerkUser.imageUrl,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      },
      create: {
        clerkId: clerkUser.id,
        email: email,
        imageUrl: clerkUser.imageUrl,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      },
    });

    const prompt = `
            Atue como um especialista em viagens de luxo e aventura.
            Crie um roteiro completo para ${data.destination}.
            
            Detalhes da viagem:
            - Data: ${data.dates.from} até ${data.dates.to}
            - Orçamento: ${data.budget}
            - Ritmo: ${data.pace}
            - Viajantes: ${data.travelers.adults} adultos, ${data.travelers.children} crianças
            - Interesses: ${data.interests.join(", ")}

            Retorne APENAS um JSON válido com a seguinte estrutura (sem markdown):
            {
              "titulo": "Um título cativante para a viagem",
              "resumo": "Um parágrafo curto sobre o que esperar",
              "dias": [
                {
                  "dia": 1,
                  "titulo": "Chegada e Reconhecimento",
                  "manha": { "atividade": "...", "descricao": "..." },
                  "tarde": { "atividade": "...", "descricao": "..." },
                  "noite": { "atividade": "...", "descricao": "..." }
                }
              ]
            }
        `;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FLASH });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) throw new Error("IA não retornou resposta");

    const text = responseText.replace(/```json|```/g, "").trim();
    const itineraryJson = JSON.parse(text);

    const trip = await prisma.trip.create({
      data: {
        userId: dbUser.id,
        destination: data.destination,
        startDate: data.dates.from,
        endDate: data.dates.to,
        budget: data.budget,
        pace: data.pace,
        travelers: data.travelers,
        interests: data.interests,
        itinerary: itineraryJson,
      },
    });

    console.log("💾 NOVO ROTEIRO CRIADO NO BANCO. ID:", trip.id);

    return { success: true, tripId: trip.id };
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    return { success: false, error: "Falha interna ao criar roteiro." };
  }
}
