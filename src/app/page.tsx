"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  Youtube, 
  Minus, 
  Plus, 
  Loader2, 
  Smartphone, 
  Monitor, 
  Square,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/DropZone";
import { ThumbnailGrid } from "@/components/ThumbnailGrid";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InfoModal } from "@/components/InfoModal";
import { HistoryModal } from "@/components/HistoryModal";
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
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRegeneratingIndex, setIsRegeneratingIndex] = useState<number | null>(null);
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

  const handleGenerate = async (isDemo = false) => {
    if (!prompt.trim() && !isDemo) {
      toast.error("Veuillez entrer une description");
      return;
    }

    if (isDemo) setIsDemoLoading(true);
    else setIsLoading(true);
    
    setGeneratedImages([]);
    setProgress(0);

    // En parallèle, le temps total est celui d'une image (~30s)
    const totalTime = 30000;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / (totalTime / 500)), 92));
    }, 500);

    try {
      if (isDemo) {
        // Mode Démo : images simulées depuis internet
        await new Promise(r => setTimeout(r, 2000)); // Simuler un délai
        const demoImages: GeneratedImage[] = [];
        
        for (let i = 0; i < count; i++) {
          const res = await fetch(`https://picsum.photos/1280/720?random=${Math.random()}`);
          const blob = await res.blob();
          const buffer = await blob.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          demoImages.push({
            data: base64,
            mediaType: "image/jpeg"
          });
        }
        
        setGeneratedImages(demoImages);
        setProgress(100);
        toast.success("Démo : Images récupérées avec succès !");
      } else {
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
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setIsDemoLoading(false);
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
      
      // Update history if this set is in history
      const updatedHistory = history.map(item => {
        if (JSON.stringify(item.images) === JSON.stringify(generatedImages)) {
           return { ...item, images: newImages };
        }
        return item;
      });
      setHistory(updatedHistory);
      localStorage.setItem("thumbnail-history", JSON.stringify(updatedHistory));

      toast.success("Miniature régénérée");
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Generation error:", error);

      let message = "Erreur lors de la génération";
      if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("quota")) {
          message = "Quota API dépassé. Attendez quelques secondes et réessayez.";
        } else if (error.message.includes("API key")) {
          message = "Clé API invalide. Vérifiez votre fichier .env.local ou .env.";
        } else {
          message = error.message;
        }
      }

      toast.error(message);
    } finally {
      setIsRegeneratingIndex(null);
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
            <span className="text-sm font-semibold tracking-tight">ThumbnailAI</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 3 Pro
            </span>
            <HistoryModal 
              history={history} 
              onClear={clearHistory} 
              onUseItem={useHistoryItem} 
            />
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
          <DropZone label="Images supplémentaires" description="Contexte" multiple maxFiles={4} onFilesChange={setExtraImages} />
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-tight">CTRL+ENTER</span>
                  <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
                  <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">VOUS INSPIREZ ? CLIQUEZ SUR UNE SUGGESTION</span>
                </div>
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
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm"
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
                    count === n ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent shadow-md" : "bg-white dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700"
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
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-tighter">~30s</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* DEMO BUTTON */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleGenerate(true)}
              disabled={isLoading || isDemoLoading}
              title="Mode Démo (Génère des images aléatoires)"
              className={cn(
                "h-9 w-9 min-w-[40px] rounded-xl border-neutral-200 dark:border-neutral-800",
                isDemoLoading && "animate-pulse"
              )}
            >
              {isDemoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              onClick={() => handleGenerate()}
              disabled={isLoading || isDemoLoading || !prompt.trim()}
              className="flex-1 sm:flex-none h-9 px-5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-95 transition-all font-bold shadow-lg shadow-neutral-900/10 dark:shadow-neutral-100/10"
            >
              {(isLoading) ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Génération...</> : <><Sparkles className="w-4 h-4 mr-2" />Générer</>}
            </Button>
          </div>
        </div>

        {/* PROGRESS */}
        {(isLoading || isDemoLoading) && (
          <div className="space-y-2.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 items-center">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
                {isDemoLoading ? "Simulation démo" : "Génération parallèle"} ({count}x)
              </span>
              <span className="tabular-nums font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-neutral-900 dark:bg-white transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* RESULTS */}
        {(isLoading || isDemoLoading || generatedImages.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                {isLoading || isDemoLoading ? "En cours de rendu" : "Dernière création"}
              </span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <ThumbnailGrid 
              images={generatedImages} 
              isLoading={isLoading || isDemoLoading} 
              aspectRatio={aspectRatio}
              onRegenerate={handleRegenerateSingle}
              isRegeneratingIndex={isRegeneratingIndex}
            />
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isDemoLoading && generatedImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative">
               <div className="w-20 h-20 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shadow-sm transition-transform hover:scale-110 duration-500">
                <Youtube className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">Lancez votre création</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 max-w-[280px] leading-relaxed mx-auto">
                Utilisez une suggestion ou décrivez votre idée. Testez le bouton <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-mono text-[10px] ml-1">Play</kbd> pour une démo.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
