import { createApi } from "unsplash-js";

const accessKey = process.env.UNSPLASH_ACCESS_KEY;

if (!accessKey) {
  throw new Error(
    "⚠️ A variável de ambiente UNSPLASH_ACCESS_KEY não está definida!",
  );
}

export const unsplash = createApi({
  accessKey: accessKey,

  fetch: fetch,
});

export async function getUnsplashPhoto(
  query: string,
  orientation: "landscape" | "portrait" = "landscape",
) {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 1,
      orientation,
      orderBy: "relevant",
    });

    if (result.response && result.response.results.length > 0) {
      return result.response.results[0].urls;
    }

    return null;
  } catch (error) {
    console.error(`Erro ao buscar foto Unsplash para: ${query}`, error);
    return null;
  }
}
