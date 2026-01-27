import { GoogleGenerativeAI } from "@google/generative-ai";

//
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "⚠️ A variável de ambiente GOOGLE_AI_API_KEY não está definida!",
  );
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const GEMINI_MODEL_FLASH = "gemini-2.5-flash";
