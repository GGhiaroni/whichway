"use server";

import { GEMINI_MODEL_FLASH, genAI } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GenerateTripsParams {
  destination: string;
  dates: { from: Date; to: Date };
  budget: string;
  pace: string;
  travelers: { adults: number; children: number };
  interests: string[];
}

function removeAccentsForUnsplashQuery(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default async function generateTrip(data: GenerateTripsParams) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await prisma.user.upsert({
      where: { email },
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

    const formattedFrom = format(data.dates.from, "dd/MM/yyyy", {
      locale: ptBR,
    });
    const formattedTo = format(data.dates.to, "dd/MM/yyyy", { locale: ptBR });

    const prompt = `
            Atue como um especialista em viagens de luxo e aventura.
            Crie um roteiro turístico detalhado para: ${data.destination}.
            
            Detalhes da viagem:
            - Período: ${formattedFrom} até ${formattedTo}
            - Orçamento: ${data.budget}
            - Ritmo: ${data.pace}
            - Grupo: ${data.travelers.adults} adultos, ${data.travelers.children} crianças
            - Interesses: ${data.interests.join(", ")}

            REGRAS RÍGIDAS DE JSON (Siga estritamente):
            1. Retorne APENAS um JSON válido.
            2. Todos os dias DEVEM ter obrigatoriamente as chaves: "manha", "tarde" e "noite".
            3. Se não houver atividade (ex: voo ou tempo livre), preencha o objeto assim: { "atividade": "Tempo Livre / Deslocamento", "descricao": "..." }.
            4. NUNCA omita as chaves "manha", "tarde" ou "noite".

            Estrutura de Retorno:
            {
              "titulo": "Título da viagem",
              "resumo": "Resumo curto",
              "dias": [
                {
                  "dia": 1,
                  "titulo": "Título do dia",
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

    const cleanText = responseText.replace(/```json|```/g, "").trim();
    const jsonStartIndex = cleanText.indexOf("{");
    const jsonEndIndex = cleanText.lastIndexOf("}");
    const finalJsonString = cleanText.substring(
      jsonStartIndex,
      jsonEndIndex + 1,
    );

    const itineraryJson = JSON.parse(finalJsonString);

    let tripImageUrl = null;

    try {
      const cleanDestination = removeAccentsForUnsplashQuery(data.destination);
      console.log(`🔍 Buscando imagem para: ${cleanDestination}`);

      let query = `${cleanDestination} tourism view landmark`;
      let photoData = await getUnsplashPhoto(query);

      if (!photoData?.regular) {
        console.log("⚠️ Busca específica falhou. Tentando busca genérica...");
        query = `${cleanDestination} travel`;
        photoData = await getUnsplashPhoto(query);
      }

      if (photoData?.regular) {
        tripImageUrl = photoData.regular;
        console.log("✅ Imagem encontrada:", tripImageUrl);
      } else {
        console.log("❌ Nenhuma imagem encontrada no Unsplash.");
      }
    } catch (error) {
      console.error("🔥 Erro (não impeditivo) ao buscar imagem:", error);
    }

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
        imageUrl: tripImageUrl,
      },
    });

    console.log("💾 NOVO ROTEIRO CRIADO NO BANCO. ID:", trip.id);

    return { success: true, tripId: trip.id };
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    return { success: false, error: "Falha interna ao criar roteiro." };
  }
}
