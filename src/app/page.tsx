"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  Youtube, 
  Minus, 
  Plus, 
  Loader2, 
  History as HistoryIcon, 
  Trash2, 
  Smartphone, 
  Monitor, 
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/DropZone";
import { ThumbnailGrid } from "@/components/ThumbnailGrid";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InfoModal } from "@/components/InfoModal";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  data: string;
  mediaType: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  images: GeneratedImage[];
  aspectRatio: string;
  timestamp: number;
}

const SUGGESTIONS = [
  "Un streamer choqué devant son écran",
  "Tutoriel de cuisine professionnel",
  "Vlog de voyage au Japon style cinématique",
  "Design minimaliste pour vidéo tech",
  "Affiche de film d'action cyberpunk",
  "Setup gaming néon ultra moderne"
];

const ASPECT_RATIOS = [
  { id: "16:9", label: "YouTube", icon: <Monitor className="w-3.5 h-3.5" /> },
  { id: "9:16", label: "Shorts", icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: "1:1", label: "Community", icon: <Square className="w-3.5 h-3.5" /> },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [personImages, setPersonImages] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRegeneratingIndex, setIsRegeneratingIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("thumbnail-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((newImages: GeneratedImage[], currentPrompt: string, currentRatio: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      prompt: currentPrompt,
      images: newImages,
      aspectRatio: currentRatio,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem("thumbnail-history", JSON.stringify(updatedHistory));
  }, [history]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("thumbnail-history");
    toast.success("Historique effacé");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setProgress(0);

    // Simuler la progression pendant la génération séquentielle
    const totalTime = count * 20000; // ~20s par image
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
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erreur lors de la génération");
      if (!data.images || data.images.length === 0) throw new Error("Aucune image générée");

      setProgress(100);
      setGeneratedImages(data.images);
      saveToHistory(data.images, prompt.trim(), aspectRatio);
      toast.success(`${data.images.length} miniature(s) générée(s) !`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleRegenerateSingle = async (index: number) => {
    setIsRegeneratingIndex(index);
    try {
      const allImages = [...extraImages, ...inspirationImages, ...personImages];
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim() || "YouTube thumbnail",
          images: allImages,
          count: 1,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.images?.length) throw new Error("Échec de la régénération");

      const newImages = [...generatedImages];
      newImages[index] = data.images[0];
      setGeneratedImages(newImages);
      
      // Update history
      const updatedHistory = history.map(item => {
        if (item.images === generatedImages) {
           return { ...item, images: newImages };
        }
        return item;
      });
      setHistory(updatedHistory);
      localStorage.setItem("thumbnail-history", JSON.stringify(updatedHistory));

      toast.success("Miniature régénérée");
    } catch {
      toast.error("Erreur lors de la régénération");
    } finally {
      setIsRegeneratingIndex(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const useHistoryItem = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setGeneratedImages(item.images);
    setAspectRatio(item.aspectRatio);
    setCount(item.images.length);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Génération restaurée depuis l'historique");
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
            <span className="text-sm font-semibold tracking-tight">ThumbnailAI</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 3 Pro
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500"
              onClick={() => setShowHistory(!showHistory)}
              title="Historique"
            >
              <HistoryIcon className="w-4 h-4" />
            </Button>
            <InfoModal />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 pb-32">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Générateur de miniatures</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Créez des visuels YouTube percutants avec Gemini en quelques secondes.
          </p>
        </div>

        {/* Upload ZONES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DropZone label="Images suppremetaires" description="Contexte" multiple maxFiles={4} onFilesChange={setExtraImages} />
          <DropZone label="Inspiration" description="Style" maxFiles={1} onFilesChange={setInspirationImages} />
          <DropZone label="Personnes" description="Visages" multiple maxFiles={3} onFilesChange={setPersonImages} />
        </div>

        {/* PROMPT AREA */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Description</label>
              <div className="flex gap-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all",
                      aspectRatio === ratio.id 
                        ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-900" 
                        : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                    )}
                  >
                    {ratio.icon}
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={cn(
              "relative rounded-xl border transition-all duration-200 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
              "focus-within:border-neutral-400 dark:focus-within:border-neutral-600 focus-within:ring-4 focus-within:ring-neutral-100 dark:focus-within:ring-neutral-900/50"
            )}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Homme choqué devant un graphique, style cinématique..."
                className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 resize-none px-4 pt-4 pb-3 text-sm leading-relaxed focus:outline-none min-h-[100px]"
                rows={3}
              />
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">CTRL+ENTER POUR GÉNÉRER</span>
                <span className={cn("text-[10px] font-mono tabular-nums", prompt.length > 800 ? "text-red-500" : "text-neutral-400")}>
                  {prompt.length}/1000
                </span>
              </div>
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nombre</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCount(Math.max(1, count - 1))} disabled={count <= 1}
                className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center disabled:opacity-30"
              >
                <Minus className="w-3 h-3 text-neutral-500" />
              </button>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => setCount(n)} className={cn(
                    "w-8 h-7 rounded-lg text-xs font-bold transition-all",
                    count === n ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "bg-white dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                  )}>{n}</button>
                ))}
              </div>
              <button 
                onClick={() => setCount(Math.min(4, count + 1))} disabled={count >= 4}
                className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center disabled:opacity-30"
              >
                <Plus className="w-3 h-3 text-neutral-500" />
              </button>
            </div>
            {count > 1 && <span className="text-[10px] font-mono text-neutral-400">~{30}s</span>}
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="h-9 px-5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity font-semibold shadow-lg shadow-neutral-900/10 dark:shadow-neutral-100/10"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Génération...</> : <><Sparkles className="w-4 h-4 mr-2" />Générer</>}
          </Button>
        </div>

        {/* PROGRESS */}
        {isLoading && (
          <div className="space-y-2.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <span>Génération en cours ({count}x)</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-neutral-900 dark:bg-white transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* RESULTS */}
        {(isLoading || generatedImages.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                {isLoading ? "En cours de rendu" : "Dernière création"}
              </span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <ThumbnailGrid 
              images={generatedImages} 
              isLoading={isLoading} 
              aspectRatio={aspectRatio}
              onRegenerate={handleRegenerateSingle}
              isRegeneratingIndex={isRegeneratingIndex}
            />
          </div>
        )}

        {/* HISTORY SECTION */}
        {showHistory && (
          <div className="space-y-6 pt-10 border-t border-neutral-100 dark:border-neutral-900 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Historique</h3>
              </div>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearHistory} className="h-7 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 className="w-3 h-3 mr-1.5" /> Effacer tout
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-2xl">
                <p className="text-xs text-neutral-400">Aucun historique pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {history.map(item => (
                  <div key={item.id} className="group p-4 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-900/20 hover:border-neutral-200 dark:hover:border-neutral-800 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1 max-w-[80%]">
                        <p className="text-sm font-medium line-clamp-1">{item.prompt}</p>
                        <div className="flex gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{item.aspectRatio}</span>
                          <span className="text-[10px] text-neutral-400">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => useHistoryItem(item)} className="h-8 text-xs border-neutral-200 dark:border-neutral-800">
                        Restaurer
                      </Button>
                    </div>
                    <ThumbnailGrid images={item.images} aspectRatio={item.aspectRatio} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && generatedImages.length === 0 && !showHistory && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative">
               <div className="w-20 h-20 rounded-3xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <Youtube className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">Lancez votre création</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-600 max-w-[240px] leading-relaxed mx-auto">
                Utilisez un prompt suggéré ou décrivez votre idée pour commencer.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
