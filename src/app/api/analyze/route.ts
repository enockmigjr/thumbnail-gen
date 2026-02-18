import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { mode, images, prompt: userPrompt } = await req.json();

    if (mode === "titles") {
      const result = await generateText({
        model: google("gemini-3-pro-image-preview"),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and propose 5 catchy, high-CTR YouTube titles that match the visual content and the context: " + (userPrompt || "YouTube video") + ". Return only a JSON array of strings." },
              { type: "image", image: images[0] },
            ],
          },
        ],
      });
      
      const text = result.text.replace(/```json|```/g, "").trim();
      return Response.json({ titles: JSON.parse(text) });
    }

    if (mode === "ctr") {
      const result = await generateText({
        model: google("gemini-3-pro-image-preview"),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Compare these two YouTube thumbnails. Which one will perform better in terms of Click-Through Rate (CTR)? Consider color psychology, composition, clarity, and emotional impact. Provide a winner and a detailed justification for both. Return JSON format: { winner: 1 or 2, reasoning: 'text', comparison: { clarity: 'text', colors: 'text', impact: 'text' } }" },
              { type: "image", image: images[0] },
              { type: "image", image: images[1] },
            ],
          },
        ],
      });

      const text = result.text.replace(/```json|```/g, "").trim();
      return Response.json({ analysis: JSON.parse(text) });
    }

    return Response.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
