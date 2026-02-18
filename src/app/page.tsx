"use client";

import { useState, useRef } from "react";
import { Sparkles, Youtube, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/DropZone";
import { ThumbnailGrid } from "@/components/ThumbnailGrid";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description pour votre miniature");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setProgress(0);

    // Simuler la progression pendant la génération séquentielle
    const totalTime = count * 30000; // ~30s par image
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / (totalTime / 500)), 92));
    }, 500);

    try {
      const allImages = [...extraImages, ...inspirationImages, ...personImages];

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

      setProgress(100);
      setGeneratedImages(data.images);
      toast.success(
        `${data.images.length} miniature${data.images.length > 1 ? "s" : ""} générée${data.images.length > 1 ? "s" : ""} !`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Header — style Vercel */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Youtube className="w-4 h-4 text-white dark:text-neutral-900" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              ThumbnailAI
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 3 Pro
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Générateur de miniatures
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Décrivez votre miniature, ajoutez des images de référence, et laissez Gemini créer.
          </p>
        </div>

        {/* Upload zones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DropZone
            label="Images supplémentaires"
            description="Contexte visuel"
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

        {/* Prompt */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Description
          </label>
          <div
            className={cn(
              "relative rounded-xl border transition-all duration-200",
              "border-neutral-200 dark:border-neutral-800",
              "bg-neutral-50 dark:bg-neutral-900",
              "focus-within:border-neutral-400 dark:focus-within:border-neutral-600",
              "focus-within:ring-4 focus-within:ring-neutral-100 dark:focus-within:ring-neutral-900"
            )}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex : Un développeur surpris devant son écran avec du code Python, style cinématique, lumière dramatique..."
              className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 resize-none px-4 pt-4 pb-3 text-sm leading-relaxed focus:outline-none min-h-[90px]"
              rows={3}
            />
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-xs text-neutral-400 dark:text-neutral-600">
                Ctrl+Entrée pour générer
              </span>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  prompt.length > 800
                    ? "text-red-500"
                    : "text-neutral-400 dark:text-neutral-600"
                )}
              >
                {prompt.length} / 1000
              </span>
            </div>
          </div>
        </div>

        {/* Controls bar */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
            "p-4 rounded-xl border",
            "border-neutral-200 dark:border-neutral-800",
            "bg-neutral-50 dark:bg-neutral-900"
          )}
        >
          {/* Count */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Nombre
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCount(Math.max(1, count - 1))}
                disabled={count <= 1}
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                  "border border-neutral-200 dark:border-neutral-700",
                  "bg-white dark:bg-neutral-800",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  "text-neutral-600 dark:text-neutral-400"
                )}
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={cn(
                      "w-8 h-7 rounded-md text-xs font-semibold transition-all duration-150",
                      count === n
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : cn(
                            "border border-neutral-200 dark:border-neutral-700",
                            "bg-white dark:bg-neutral-800",
                            "text-neutral-600 dark:text-neutral-400",
                            "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          )
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCount(Math.min(4, count + 1))}
                disabled={count >= 4}
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                  "border border-neutral-200 dark:border-neutral-700",
                  "bg-white dark:bg-neutral-800",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  "text-neutral-600 dark:text-neutral-400"
                )}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            {count > 1 && (
              <span className="text-xs text-neutral-400 dark:text-neutral-600">
                ~{count * 30}s
              </span>
            )}
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={cn(
              "h-9 px-5 text-sm font-medium rounded-lg transition-all duration-200",
              "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
              "hover:bg-neutral-700 dark:hover:bg-neutral-100",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "shadow-sm"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Générer{count > 1 ? ` (${count})` : ""}
              </>
            )}
          </Button>
        </div>

        {/* Progress bar */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Génération en cours
                {count > 1 && ` — images séquentielles (${count}x)`}
              </span>
              <span className="text-xs tabular-nums text-neutral-400 dark:text-neutral-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-neutral-900 dark:bg-white transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Divider + Results */}
        {(isLoading || generatedImages.length > 0) && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                {isLoading
                  ? "En cours..."
                  : `${generatedImages.length} résultat${generatedImages.length > 1 ? "s" : ""}`}
              </span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <ThumbnailGrid images={generatedImages} isLoading={isLoading} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && generatedImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "border border-neutral-200 dark:border-neutral-800",
                "bg-neutral-50 dark:bg-neutral-900"
              )}
            >
              <Youtube className="w-7 h-7 text-neutral-400 dark:text-neutral-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Aucune miniature générée
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-600">
                Décrivez votre miniature ci-dessus et cliquez sur Générer
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
