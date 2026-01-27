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

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!dbUser) {
      return {
        success: false,
        error: "Usuário não encontrado no banco.",
      };
    }

    const prompt = `
            Atue como um especialista em viagens e criação de roteiros de viagens únicos que marcam de forma significativa seus clientes.
            Crie um roteiro personalizado, como um agente de viagens dedicado, especialista e com muitos anos de experiência no mercado, para o destino ${data.destination}.
            
            Detalhes da viagem:
            - Data: ${data.dates.from} até ${data.dates.to}
            - Orçamento: ${data.budget}
            - Ritmo escolhido pelos viajantes (entre "Relaxado", "Equilibrado" e "Intenso"): ${data.pace}
            - Viajantes: ${data.travelers.adults} adultos, ${data.travelers.children} crianças
            - Interesses principais do(s) viajante(s): ${data.interests.join(", ")}

            Retorne APENAS um JSON válido com a seguinte estrutura (sem markdown):
            {
              "titulo": "Um título cativante e único para viagem",
              "resumo": "Um parágrafo sobre o que esperar dessa viagem",
              "dias": [
                {
                  "dia": 1,
                  "titulo": "Chegada e Reconhecimento",
                  "manha": { "atividade": "...", "descricao": "...", "duracao estimada": 2h },
                  "tarde": { "atividade": "...", "descricao": "...", "duracao estimada": 2h },
                  "noite": { "atividade": "...", "descricao": "...", "duracao estimada": 2h }
                }
              ]
            }
        `;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FLASH });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response
      .text()
      .replace(/```json|```/g, "")
      .trim();

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

    return { success: true, tripId: trip.id };
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    return { success: false, error: "Falha interna ao criar roteiro." };
  }
}
