import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createApi } from "unsplash-js";

interface HighlightInput {
  title: string;
  imageQuery: string;
}

interface DestinationInput {
  city: string;
  country: string;
  description: string;
  priceLevel: string;
  landmark: string;
  climate: string;
  bestTime: string;
  avgPrice: string;
  highlights: HighlightInput[];
}

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
      Liste 8 destinos de viagem que estão em alta mundialmente nesta semana.
      Retorne APENAS um JSON array puro, sem markdown, com este formato exato:
      [
        {
          "city": "Nome da Cidade",
          "country": "Nome do País",
          "description": "Descrição inspiradora (250 chars)",
          "priceLevel": "Baixo, Médio ou Alto",
          "landmark": "Nome do ponto turístico icônico em Inglês (para busca de fotos)",
          "climate": "Resumo curto do clima (ex: Tropical ameno)",
          "bestTime": "Melhor época para ir (ex: Maio a Setembro)",
          "avgPrice": "Custo médio diário estimado em USD (ex: $120/dia)",
          "highlights": [
             { "title": "Torre Eiffel", "imageQuery": "Eiffel Tower detail" },
             { "title": "Museu do Louvre", "imageQuery": "Louvre pyramid night" },
             { "title": "Montmartre", "imageQuery": "Montmartre streets paris" }
          ]
        }
      ]
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text().replace(/```json|```/g, "");

    const destinations = JSON.parse(text) as DestinationInput[];

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
        fallbackImage = photoResult.response.results[0].urls.regular;
      }

      const highlightsWithImages = await Promise.all(
        dest.highlights.map(async (highlight) => {
          const highlightPhotoRes = await unsplash.search.getPhotos({
            query: highlight.imageQuery,
            perPage: 1,
            orientation: "landscape",
          });

          let highlightUrl =
            "https://images.unsplash.com/photo-1521747116042-5a810fda9664";
          if (
            highlightPhotoRes.response &&
            highlightPhotoRes.response.results.length > 0
          ) {
            highlightUrl = highlightPhotoRes.response.results[0].urls.small;
          }

          return {
            title: highlight.title,
            imageUrl: highlightUrl,
          };
        }),
      );

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
          highlights: {
            create: highlightsWithImages,
          },
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
