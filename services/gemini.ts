import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

// Fix: Follow strict initialization guidelines using the named parameter 'apiKey'.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAekcfLiMPJxLdVq5zItSQXlQld1P31W1s" });

export const getStylistAdvice = async (query: string) => {
  // Fix: Assume the API_KEY is available and configured as per guidelines.
  const productsContext = MOCK_PRODUCTS.map(p => `- ${p.name} (₹ ${p.price}): ${p.description}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Axora Luxury Stylist. You help customers choose the best high-end items from our catalog, including fine apparel, heritage sarees, and exclusive mobile devices.
      Be sophisticated, helpful, and concise. 
      Our current catalog:
      ${productsContext}

      User query: ${query}`,
      config: {
        temperature: 0.7,
        // Fix: Removed maxOutputTokens as recommended by guidelines when not strictly necessary.
      }
    });
    // Fix: Directly access the .text property from the response.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Forgive me, I encountered a brief moment of reflection. How else may I assist you with the Axora collection?";
  }
};