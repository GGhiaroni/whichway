import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createApi } from "unsplash-js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  fetch: fetch,
});

export async function GET(request: Request) {
  try {
    console.log("Iniciando atualização de destinos...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Liste 10 destinos de viagem que estão em alta mundialmente nesta semana.
      Retorne APENAS um JSON array puro, sem markdown, com este formato exato:
      [
        {
          "city": "Nome da Cidade",
          "country": "Nome do País",
          "description": "Descrição inspiradora (max 150 chars)",
          "priceLevel": "Baixo, Médio ou Alto",
          "landmark": "Nome do ponto turístico icônico em Inglês (para busca de fotos)",
          "climate": "Resumo curto do clima (ex: Tropical ameno)",
          "bestTime": "Melhor época para ir (ex: Maio a Setembro)",
          "avgPrice": "Custo médio diário estimado em USD (ex: $120/dia)",
          "highlights": "3 palavras-chave do que fazer (ex: História, Gastronomia, Praias)"
        }
      ]
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text().replace(/```json|```/g, "");
    const destinations = JSON.parse(text);

    await prisma.featuredDestination.deleteMany({});

    for (const dest of destinations) {
      const querySearch = `${dest.landmark} iconic view`;

      const photoResult = await unsplash.search.getPhotos({
        query: querySearch,
        perPage: 1,
        orientation: "landscape",
        orderBy: "relevant",
      });

      let fallbackImage =
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1";

      if (photoResult.response && photoResult.response.results.length > 0) {
        fallbackImage = photoResult.response?.results[0].urls.regular;
      }

      await prisma.featuredDestination.create({
        data: {
          city: dest.city,
          country: dest.country,
          description: dest.description,
          priceLevel: dest.priceLevel,
          imageUrl: fallbackImage,
          climate: dest.climate,
          bestTime: dest.bestTime,
          avgPrice: dest.avgPrice,
          highlights: dest.highlights,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Destinos atualizados com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return NextResponse.json(
      { success: false, error: "Falha na atualização" },
      { status: 500 },
    );
  }
}
