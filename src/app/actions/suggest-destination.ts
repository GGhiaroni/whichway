"use server";

import { GEMINI_MODEL_FLASH, genAI } from "@/lib/gemini";
import { getUnsplashPhoto } from "@/lib/unsplash";

interface SuggestionParams {
  budget: string;
  interests: string[];
  travelers: { adults: number; children: number };
  dates: { from: Date; to: Date };
}

interface RawSuggestion {
  cidade: string;
  pais: string;
  motivo: string;
}

export async function suggestDestinations(data: SuggestionParams) {
  try {
    const prompt = `
      Atue como um consultor de viagens experiente.
      Sugira 3 destinos de viagem perfeitos para este perfil:
      - Orçamento: ${data.budget}
      - Interesses: ${data.interests.join(", ")}
      - Viajantes: ${data.travelers.adults} adultos, ${data.travelers.children} crianças
      - Data: ${data.dates.from} (Considere o clima nessa época)

      Retorne APENAS um JSON array válido:
      [
        {
          "cidade": "Nome da Cidade",
          "pais": "Nome do País",
          "motivo": "Uma frase curta e persuasiva do porquê esse destino combina com o perfil (máx 150 chars)."
        }
      ]
    `;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FLASH });
    const result = await model.generateContent(prompt);

    const responseText = result.response.text();
    if (!responseText) throw new Error("IA retornou resposta vazia");

    const text = responseText.replace(/```json|```/g, "").trim();

    const suggestions = JSON.parse(text) as RawSuggestion[];

    const suggestionsWithPhotos = await Promise.all(
      suggestions.map(async (place) => {
        const photo = await getUnsplashPhoto(
          `${place.cidade} ${place.pais} iconic`,
        );
        return { ...place, imagem: photo?.regular || null };
      }),
    );

    return { success: true, suggestions: suggestionsWithPhotos };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Falha ao sugerir destinos." };
  }
}
