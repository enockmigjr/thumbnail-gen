"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Download, 
  ZoomIn, 
  X, 
  RefreshCw, 
  Archive, 
  Loader2, 
  Play, 
  Type, 
  Swords,
  Trophy,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { YouTubePreviewModal } from "./YouTubePreviewModal";
import { toast } from "sonner";

interface ThumbnailGridProps {
  images: Array<{ data: string; mediaType: string }>;
  isLoading?: boolean;
  onRegenerate?: (index: number) => void;
  isRegeneratingIndex?: number | null;
  aspectRatio?: string;
  userPrompt?: string;
}

function SkeletonCard({ ratio = "16:9" }: { ratio?: string }) {
  const aspectClass = ratio === "9:16" ? "aspect-[9/16]" : ratio === "1:1" ? "aspect-square" : "aspect-video";
  
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden shadow-sm",
        "border border-neutral-200 dark:border-neutral-800",
        "bg-neutral-100 dark:bg-neutral-900",
        aspectClass
      )}
    >
      <div className="absolute inset-0 bg-linear-to-r from-neutral-100 via-neutral-200 to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 animate-shimmer bg-size-[200%_100%]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="space-y-1.5">
          <div className="w-20 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <div className="w-14 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function ThumbnailGrid({ 
  images, 
  isLoading, 
  onRegenerate, 
  isRegeneratingIndex,
  aspectRatio = "16:9",
  userPrompt = ""
}: ThumbnailGridProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  
  // New States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  
  const [isAnalyzingTitles, setIsAnalyzingTitles] = useState<number | null>(null);
  const [titlesByImage, setTitlesByImage] = useState<Record<number, string[]>>({});
  
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    winner: number;
    reasoning: string;
    comparison: Record<string, string>;
  } | null>(null);

  const downloadImage = (data: string, mediaType: string, index: number) => {
    const ext = mediaType.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = `data:${mediaType};base64,${data}`;
    link.download = `thumbnail-${index + 1}.${ext}`;
    link.click();
  };

  const downloadAllAsZip = async () => {
    if (images.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      images.forEach((img, i) => {
        const ext = img.mediaType.split("/")[1] || "png";
        zip.file(`thumbnail-${i + 1}.${ext}`, img.data, { base64: true });
      });
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "thumbnails.zip";
      link.click();
    } catch (error) {
      console.error("ZIP error:", error);
    } finally {
      setIsZipping(false);
    }
  };

  const generateTitles = async (index: number) => {
    setIsAnalyzingTitles(index);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "titles",
          images: [images[index].data],
          prompt: userPrompt
        }),
      });
      const data = await response.json();
      if (data.titles) {
        setTitlesByImage(prev => ({ ...prev, [index]: data.titles }));
        toast.success("5 titres suggérés !");
      }
    } catch {
      toast.error("Échec de la génération des titres");
    } finally {
      setIsAnalyzingTitles(null);
    }
  };

  const startComparison = async () => {
    if (selectedForComparison.length !== 2) return;
    setIsComparing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "ctr",
          images: [images[selectedForComparison[0]].data, images[selectedForComparison[1]].data]
        }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch {
      toast.error("Échec de l'analyse A/B");
    } finally {
      setIsComparing(false);
    }
  };

  const toggleSelection = (index: number) => {
    setSelectedForComparison(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].slice(-2)
    );
  };

  const openPreview = (index: number) => {
    setPreviewImage(`data:${images[index].mediaType};base64,${images[index].data}`);
    const currentTitles = titlesByImage[index];
    setPreviewTitle(currentTitles ? currentTitles[0] : "");
    setIsPreviewOpen(true);
  };

  const aspectClass = aspectRatio === "9:16" ? "aspect-[9/16]" : aspectRatio === "1:1" ? "aspect-square" : "aspect-video";
  const gridClass = aspectRatio === "9:16" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2";

  if (!isLoading && images.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           {selectedForComparison.length > 0 && (
             <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">A/B Testing :</span>
                <div className="flex -space-x-2">
                  {selectedForComparison.map(idx => (
                    <div key={idx} className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-950 bg-neutral-200 overflow-hidden relative">
                      <Image src={`data:${images[idx].mediaType};base64,${images[idx].data}`} fill alt="選" className="object-cover" />
                    </div>
                  ))}
                </div>
                {selectedForComparison.length === 2 && (
                  <Button 
                    size="sm" 
                    onClick={startComparison}
                    disabled={isComparing}
                    className="h-7 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3"
                  >
                    {isComparing ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Swords className="w-3 h-3 mr-1.5" />}
                    Prédire le meilleur CTR
                  </Button>
                )}
             </div>
           )}
        </div>

        {images.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAllAsZip}
            disabled={isZipping}
            className="h-8 text-[10px] font-bold uppercase tracking-wider gap-2 border-neutral-200 dark:border-neutral-800"
          >
            {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
            Tout télécharger (ZIP)
          </Button>
        )}
      </div>
      
      {/* Comparison Result Modal-like area */}
      {analysisResult && (
        <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 animate-in zoom-in-95 duration-300">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold dark:text-white uppercase tracking-tight">Verdict de l&apos;IA (A/B Test)</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">Analyse basée sur la composition et la psychologie</p>
                </div>
              </div>
              <button onClick={() => setAnalysisResult(null)} className="p-1 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">WINNER : Miniature #{selectedForComparison[analysisResult.winner - 1] + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
                  {analysisResult.reasoning}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(analysisResult.comparison).map(([key, val]: [string, string]) => (
                  <div key={key} className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">{key}</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{val}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      <div className={cn("grid gap-4", gridClass)}>
        {isLoading && images.length === 0 &&
          Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} ratio={aspectRatio} />)}

        {images.map((img, index) => {
          const isRegenerating = isRegeneratingIndex === index;
          const titles = titlesByImage[index];
          const isSelected = selectedForComparison.includes(index);
          
          return (
            <div key={index} className="space-y-3">
              <div
                className={cn(
                  "group relative rounded-xl overflow-hidden shadow-sm transition-all duration-300",
                  "border border-neutral-200 dark:border-neutral-800",
                  "hover:border-neutral-300 dark:hover:border-neutral-700",
                  "hover:shadow-md dark:hover:shadow-neutral-900/50",
                  isSelected && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-neutral-950",
                  aspectClass
                )}
              >
                {isRegenerating ? (
                  <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                      <span className="text-[10px] uppercase tracking-widest text-neutral-500">Régénération...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      src={`data:${img.mediaType};base64,${img.data}`}
                      alt={`Generated thumbnail ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* MAIN ACTIONS (Hover) */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                       <div className="flex justify-between items-start">
                          <button
                            onClick={() => toggleSelection(index)}
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border transition-all",
                              isSelected 
                                ? "bg-indigo-500 border-indigo-400 text-white" 
                                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                            )}
                            title="Sélectionner pour A/B Test"
                          >
                            <Swords className="w-4 h-4" />
                          </button>
                          
                          <div className="flex gap-2">
                             <button
                               onClick={() => openPreview(index)}
                               className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all"
                               title="Simuler sur YouTube"
                             >
                                <Play className="w-4 h-4" />
                             </button>
                             <button
                                onClick={() => setLightboxSrc(`data:${img.mediaType};base64,${img.data}`)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all"
                             >
                                <ZoomIn className="w-4 h-4" />
                             </button>
                          </div>
                       </div>

                       <div className="flex items-center gap-2 mt-auto">
                          <Button
                            size="sm"
                            className="h-8 flex-1 text-[10px] font-bold uppercase tracking-wider bg-white text-neutral-900 hover:bg-neutral-100 rounded-lg"
                            onClick={() => downloadImage(img.data, img.mediaType, index)}
                          >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Download
                          </Button>
                          
                          {onRegenerate && (
                            <button
                              onClick={() => onRegenerate(index)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white transition-all"
                              title="Régénérer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          )}
                       </div>
                    </div>

                    {/* Index */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[9px] font-black bg-black/50 text-white/70 tracking-widest uppercase backdrop-blur-sm group-hover:hidden">
                      #{index + 1}
                    </div>
                  </>
                )}
              </div>

              {/* SECONDARY ACTIONS (Under card) */}
              <div className="flex gap-2">
                 <Button
                    variant="ghost"
                    size="sm"
                    disabled={isAnalyzingTitles !== null}
                    onClick={() => generateTitles(index)}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 group/btn"
                 >
                    {isAnalyzingTitles === index ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    ) : (
                      <Type className="w-3 h-3 mr-2 transition-transform group-hover/btn:scale-110" />
                    )}
                    Générer Titres IA
                 </Button>
              </div>

              {/* TITLES LIST */}
              {titles && (
                <div className="space-y-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 animate-in slide-in-from-top-2">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Titres suggérés</span>
                   </div>
                   {titles.map((t, i) => (
                     <div key={i} className="flex items-start gap-2 group/t">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-1 shrink-0 opacity-0 group-hover/t:opacity-100 transition-opacity" />
                        <p 
                          className="text-xs text-neutral-600 dark:text-neutral-400 leading-tight cursor-copy hover:text-emerald-600 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(t);
                            toast.success("Titre copié !");
                            setPreviewTitle(t);
                          }}
                        >
                          {t}
                        </p>
                     </div>
                   ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-20000 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all shadow-2xl">
            <X className="w-5 h-5" />
          </button>
          <div className={cn("relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-white/10", aspectClass)} onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxSrc} alt="Preview" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* YouTube Preview Modal */}
      <YouTubePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        image={previewImage} 
        aspectRatio={aspectRatio}
        title={previewTitle}
      />
    </div>
  );
}
