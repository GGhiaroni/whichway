import { GEMINI_MODEL_FLASH, genAI } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { NextResponse } from "next/server";

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
  rating: string;
  reviews: string;
  tempSummer: string;
  tempWinter: string;
  sunnyDays: string;
  rainyDays: string;
  costBudget: string;
  costMid: string;
  costLuxury: string;
  costFlight: string;
  bestTimeValue: string;
  bestTimeDesc: string;
  peakSeasonValue: string;
  peakSeasonDesc: string;
  offSeasonValue: string;
  offSeasonDesc: string;
  highlights: HighlightInput[];
  tips: string[];
}

export async function GET() {
  try {
    console.log("Iniciando atualização de destinos...");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_FLASH });

    const prompt = `
      Liste 8 destinos de viagem que estão em alta mundialmente nesta semana.
      Retorne APENAS um JSON array puro, sem markdown, com este formato exato:
      [
        {
          "city": "Nome da Cidade",
          "country": "Nome do País",
          "description": "Descrição inspiradora (250 chars)",
          "priceLevel": "Baixo, Médio ou Alto",
          "landmark": "Nome do ponto turístico icônico em Inglês (para busca de fotos). PRECISA SER O PONTO MAIS FAMOSO DO LUGAR, QUE NÃO SE CONFUNDA COM NENHUM OUTRO NO MUNDO.",

          "rating": "Nota média (ex: 4.8)",
          "reviews": "Volume de reviews (ex: 12k+ reviews)",

          "tempSummer": "Temp média verão (ex: 28°C)",
          "tempWinter": "Temp média inverno (ex: 12°C)",
          "sunnyDays": "Dias de sol/ano (ex: 300)",
          "rainyDays": "Dias de chuva/ano (ex: 45)",

          "costBudget": "Custo diário mochileiro em USD ou EUR (ex: €50-80)",
          "costMid": "Custo diário conforto em USD ou EUR (ex: €150-250)",
          "costLuxury": "Custo diário luxo em USD ou EUR (ex: €500+)",
          "costFlight": "Preço médio voo saindo do Brasil em BRL (ex: R$ 5.200)",

          "bestTimeValue": "Melhores meses (ex: Abril - Maio)",
          "bestTimeDesc": "Por que ir nessa época (ex: Clima ameno e preços bons)",
          "peakSeasonValue": "Alta temporada (ex: Julho - Agosto)",
          "peakSeasonDesc": "O que esperar (ex: Lotado, calor, tudo aberto)",
          "offSeasonValue": "Baixa temporada (ex: Nov - Mar)",
          "offSeasonDesc": "O que esperar (ex: Frio, chuva, mas barato)",

          "highlights": [
             { "title": "Torre Eiffel", "imageQuery": "Eiffel Tower detail" },
             { "title": "Museu do Louvre", "imageQuery": "Louvre pyramid night" },
             { "title": "Montmartre", "imageQuery": "Montmartre streets paris" }
          ],

          "tips": [
            "Dica 1: Evite golpes comuns na região...",
            "Dica 2: Melhor meio de transporte é...",
            "Dica 3: Não deixe de provar tal prato...",
            "Dica 4: Regras de etiqueta local...",
            "Dica 5: Leve dinheiro em espécie para..."
          ]
        }
      ]
        Certifique-se de incluir no mínimo 5 "Dicas de Ouro" (Golden Tips) essenciais e práticas para cada destino no array "tips".
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "");
    const destinations = JSON.parse(text) as DestinationInput[];

    await prisma.featuredDestination.deleteMany({});

    for (const dest of destinations) {
      const mainPhotoUrls = await getUnsplashPhoto(
        `${dest.landmark} iconic view`,
      );

      const fallbackImage =
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1";
      const finalImageUrl = mainPhotoUrls?.regular || fallbackImage;

      const highlightsWithImages = await Promise.all(
        dest.highlights.map(async (highlight) => {
          const photoUrls = await getUnsplashPhoto(highlight.imageQuery);

          const highlightFallback =
            "https://images.unsplash.com/photo-1521747116042-5a810fda9664";

          return {
            title: highlight.title,
            imageUrl: photoUrls?.small || highlightFallback,
          };
        }),
      );

      await prisma.featuredDestination.create({
        data: {
          city: dest.city,
          country: dest.country,
          description: dest.description,
          priceLevel: dest.priceLevel,
          imageUrl: finalImageUrl,
          rating: dest.rating,
          reviews: dest.reviews,
          tempSummer: dest.tempSummer,
          tempWinter: dest.tempWinter,
          sunnyDays: dest.sunnyDays,
          rainyDays: dest.rainyDays,
          costBudget: dest.costBudget,
          costMid: dest.costMid,
          costLuxury: dest.costLuxury,
          costFlight: dest.costFlight,
          bestTimeValue: dest.bestTimeValue,
          bestTimeDesc: dest.bestTimeDesc,
          peakSeasonValue: dest.peakSeasonValue,
          peakSeasonDesc: dest.peakSeasonDesc,
          offSeasonValue: dest.offSeasonValue,
          offSeasonDesc: dest.offSeasonDesc,
          highlights: {
            create: highlightsWithImages,
          },
          tips: {
            create: dest.tips.map((tipString) => ({
              text: tipString,
            })),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Destinos atualizados!",
    });
  } catch (error) {
    console.error("Erro fatal:", error);
    return NextResponse.json(
      { success: false, error: "Falha geral" },
      { status: 500 },
    );
  }
}
