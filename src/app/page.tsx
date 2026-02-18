"use client";

import { useState, useRef } from "react";
import { Sparkles, Youtube, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/DropZone";
import { ThumbnailGrid } from "@/components/ThumbnailGrid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  data: string;
  mediaType: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [personImages, setPersonImages] = useState<string[]>([]);
  const [count, setCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description pour votre miniature");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const allImages = [
        ...extraImages,
        ...inspirationImages,
        ...personImages,
      ];

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          images: allImages,
          count,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      if (!data.images || data.images.length === 0) {
        throw new Error("Aucune image générée");
      }

      setGeneratedImages(data.images);
      toast.success(`${data.images.length} miniature(s) générée(s) avec succès !`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/20">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Thumbnail<span className="text-violet-400">AI</span>
              </h1>
              <p className="text-xs text-zinc-500">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-500">Gemini 3 Pro</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Prompt area */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-violet-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-600 transition-colors">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Décrivez votre miniature YouTube... (ex: 'Un développeur surpris devant son écran avec du code Python, style cinématique')"
              className="w-full bg-transparent text-white placeholder-zinc-600 resize-none p-5 text-base leading-relaxed focus:outline-none min-h-[100px]"
              rows={3}
            />
            <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800/50">
              <span className="text-xs text-zinc-600">
                Ctrl+Entrée pour générer
              </span>
              <span
                className={cn(
                  "text-xs",
                  prompt.length > 800 ? "text-red-400" : "text-zinc-600"
                )}
              >
                {prompt.length}/1000
              </span>
            </div>
          </div>
        </div>

        {/* Upload zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DropZone
            label="Images supplémentaires"
            description="Contexte visuel additionnel"
            multiple={true}
            maxFiles={4}
            onFilesChange={setExtraImages}
          />
          <DropZone
            label="Inspiration"
            description="Style de référence"
            multiple={false}
            maxFiles={1}
            onFilesChange={setInspirationImages}
          />
          <DropZone
            label="Personnes"
            description="Visages à inclure"
            multiple={true}
            maxFiles={3}
            onFilesChange={setPersonImages}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4">
          {/* Count selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 font-medium whitespace-nowrap">
              Nombre de miniatures
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCount(Math.max(1, count - 1))}
                disabled={count <= 1}
                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200",
                      count === n
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCount(Math.min(4, count + 1))}
                disabled={count >= 4}
                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={cn(
              "relative px-6 py-2.5 h-auto font-semibold text-sm rounded-xl transition-all duration-300",
              "bg-linear-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600",
              "shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
              isLoading && "animate-pulse"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer {count > 1 ? `${count} miniatures` : "la miniature"}
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {(isLoading || generatedImages.length > 0) && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                {isLoading ? "Génération en cours..." : `${generatedImages.length} résultat(s)`}
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <ThumbnailGrid images={generatedImages} isLoading={isLoading} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && generatedImages.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto">
                <Youtube className="w-9 h-9 text-zinc-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <p className="text-zinc-400 font-medium">
                Vos miniatures apparaîtront ici
              </p>
              <p className="text-zinc-600 text-sm mt-1">
                Décrivez votre miniature et cliquez sur Générer
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
