import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, images, count } = await req.json();

    const thumbnailPrompt = `${prompt}. Create a YouTube thumbnail in 16:9 ratio, photorealistic, high quality, vibrant colors, eye-catching design, bold composition, professional photography style.`;

    const generatedImages: Array<{ data: string; mediaType: string }> = [];

    // Generate thumbnails one by one (or in parallel for count)
    const generateOne = async () => {
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
    };

    const totalCount = Math.min(Math.max(1, count || 1), 4);
    const promises = Array.from({ length: totalCount }, () => generateOne());
    await Promise.all(promises);

    return Response.json({ images: generatedImages });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json({ error: message }, { status: 500 });
  }
}
