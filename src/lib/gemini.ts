import { GoogleGenAI, Type } from "@google/genai";
import { AnimationCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAnimation(prompt: string): Promise<AnimationCode> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Sen bir uzman web animasyon geliştiricisisin. Kullanıcının şu isteğine göre detaylı, uzun süreli ve profesyonel bir HTML/CSS/JS animasyonu oluştur: "${prompt}". 

    Kurallar:
    1. Animasyon zengin içerikli, akıcı ve uzun süreli (en az 10-20 saniyelik döngüler veya sahneler) olmalıdır.
    2. HTML, CSS ve karmaşık hareketler için vanilla JavaScript kullan.
    3. KESİNLİKLE işlevsel veya tıklanabilir butonlar ekleme.
    4. Animasyonun sağ alt köşesinde "ANIMAX" yazan şık, yarı saydam bir filigran (watermark) alanı için yer bırak veya CSS ile ekle.
    5. Görsel derinlik, parçacık sistemleri veya katmanlı efektler kullanarak "sinematik" bir hava kat.
    6. JSON formatında döndür.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          html: {
            type: Type.STRING,
            description: "The HTML structure for the animation (excluding body/head tags, just the content).",
          },
          css: {
            type: Type.STRING,
            description: "The CSS styles for the animation.",
          },
          js: {
            type: Type.STRING,
            description: "The JavaScript logic for the animation (optional, can be empty string).",
          },
        },
        required: ["html", "css", "js"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as AnimationCode;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate animation code.");
  }
}
