import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 120;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  try {
    const { prompt, images, count, aspectRatio = "16:9" } = await req.json();

    const ratioDesc = aspectRatio === "9:16" ? "9:16 vertical ratio (Shorts)" : aspectRatio === "1:1" ? "1:1 square ratio" : "16:9 horizontal ratio";
    const thumbnailPrompt = `${prompt}. Create a YouTube thumbnail in ${ratioDesc}, photorealistic, high quality, vibrant colors, eye-catching design, bold composition, professional photography style.`;

    const totalCount = Math.min(Math.max(1, count || 1), 4);
    const generatedImages: Array<{ data: string; mediaType: string }> = [];

    // Génération SÉQUENTIELLE avec délai pour respecter les quotas API
    for (let i = 0; i < totalCount; i++) {
      if (i > 0) {
        // Attendre 8 secondes entre chaque requête (quota free tier)
        await sleep(8000);
      }

      const result = await generateText({
        model: google("gemini-3-pro-image-preview"),
        providerOptions: {
          google: { responseModalities: ["TEXT", "IMAGE"] },
        },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: thumbnailPrompt },
              ...(images || []).map((img: string) => ({
                type: "image" as const,
                image: img,
              })),
            ],
          },
        ],
      });

      for (const file of result.files ?? []) {
        if (file.mediaType.startsWith("image/")) {
          generatedImages.push({
            data: file.base64,
            mediaType: file.mediaType,
          });
        }
      }
    }

    return Response.json({ images: generatedImages });
  } catch (error) {
    console.error("Generation error:", error);

    // Extraire un message lisible depuis l'erreur API
    let message = "Erreur lors de la génération";
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("quota")) {
        message =
          "Quota API dépassé. Attendez quelques secondes et réessayez, ou réduisez le nombre de miniatures.";
      } else if (error.message.includes("API key")) {
        message = "Clé API invalide. Vérifiez votre fichier .env.local.";
      } else {
        message = error.message;
      }
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
