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
  CheckCircle2,
  Sparkles,
  Bot,
  ChevronRight,
  Copy,
  PlusSquare
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
  const aspectClass = ratio === "9:16" ? "aspect-9/16" : ratio === "1:1" ? "aspect-square" : "aspect-video";
  
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
    setAnalysisResult(null); // Clear previous
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

  const aspectClass = aspectRatio === "9:16" ? "aspect-9/16" : aspectRatio === "1:1" ? "aspect-square" : "aspect-video";
  const gridClass = aspectRatio === "9:16" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2";

  if (!isLoading && images.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
           {selectedForComparison.length > 0 && (
             <div className="flex items-center gap-4 p-2 pl-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 animate-in slide-in-from-left-4">
                <div className="flex items-center gap-2">
                   <Swords className="w-4 h-4 text-indigo-500" />
                   <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Selection A/B</span>
                </div>
                <div className="flex -space-x-2.5">
                  {selectedForComparison.map(idx => (
                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-950 bg-neutral-200 overflow-hidden relative shadow-sm ring-1 ring-indigo-500/20">
                      <Image src={`data:${images[idx].mediaType};base64,${images[idx].data}`} fill alt="選" className="object-cover" />
                    </div>
                  ))}
                  {selectedForComparison.length < 2 && (
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-800 bg-transparent flex items-center justify-center text-[10px] text-neutral-400">
                      +1
                    </div>
                  )}
                </div>
                {selectedForComparison.length === 2 && (
                  <Button 
                    size="sm" 
                    onClick={startComparison}
                    disabled={isComparing}
                    className="h-8 text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    {isComparing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Bot className="w-3.5 h-3.5 mr-2" />}
                    Prédire le CTR
                  </Button>
                )}
             </div>
           )}
        </div>

        <div className="flex items-center gap-3">
          {images.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAllAsZip}
              disabled={isZipping}
              className="h-9 px-4 text-[10px] font-black uppercase tracking-widest gap-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all shadow-sm"
            >
              {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4 text-emerald-500" />}
              Export ZIP
            </Button>
          )}
        </div>
      </div>
      
      {/* Comparison Loading State */}
      {isComparing && (
        <div className="p-10 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 border-dashed animate-pulse flex flex-col items-center justify-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl animate-bounce">
              <Bot className="w-6 h-6" />
           </div>
           <div className="text-center space-y-1">
              <p className="text-sm font-bold dark:text-white uppercase tracking-widest">Analyse IA en cours...</p>
              <p className="text-[11px] text-neutral-500">L&apos;IA compare les stimuli visuels et la psychologie des couleurs</p>
           </div>
        </div>
      )}

      {/* Comparison Result */}
      {analysisResult && !isComparing && (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121212] border border-indigo-100 dark:border-indigo-900/30 shadow-2xl shadow-indigo-500/5 animate-in zoom-in-95 duration-500">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black dark:text-white uppercase tracking-tight">Verdict de l&apos;IA Studio</h4>
                  <p className="text-[11px] text-neutral-500 font-medium">Miniature #{selectedForComparison[analysisResult.winner - 1] + 1} est déclarée vainqueur</p>
                </div>
              </div>
              <button onClick={() => setAnalysisResult(null)} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-2">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Raisonnement Stratégique</h5>
                   <p className="text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium">
                     {analysisResult.reasoning}
                   </p>
                </div>
                
                <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                   <p className="text-[13px] text-emerald-700 dark:text-emerald-400 font-medium">Recommandation : Utilisez cette version pour votre vidéo principale et gardez l&apos;autre pour un test communautaire.</p>
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Analyse Comparative</h5>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(analysisResult.comparison).map(([key, val]: [string, string]) => (
                    <div key={key} className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5 transition-all hover:border-neutral-200 dark:hover:border-white/10 group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-indigo-500 transition-colors">{key}</span>
                        <ChevronRight className="w-3 h-3 text-neutral-300" />
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      )}

      <div className={cn("grid gap-6", gridClass)}>
        {isLoading && images.length === 0 &&
          Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} ratio={aspectRatio} />)}

        {images.map((img, index) => {
          const isRegenerating = isRegeneratingIndex === index;
          const titles = titlesByImage[index];
          const isSelected = selectedForComparison.includes(index);
          const isAnalyzing = isAnalyzingTitles === index;
          
          return (
            <div key={index} className="space-y-4">
              <div
                className={cn(
                  "group relative rounded-2xl overflow-hidden shadow-sm transition-all duration-500",
                  "border border-neutral-200 dark:border-neutral-800",
                  "hover:border-indigo-400 dark:hover:border-indigo-500/50",
                  "hover:shadow-2xl hover:shadow-indigo-500/20",
                  isSelected && "ring-4 ring-indigo-500 ring-offset-4 dark:ring-offset-neutral-950 scale-[1.02]",
                  aspectClass
                )}
              >
                {isRegenerating ? (
                  <div className="absolute inset-0 bg-neutral-100 dark:bg-[#0f0f0f] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Régénération</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      src={`data:${img.mediaType};base64,${img.data}`}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark Overlay (Gradient) */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* TOP ACTIONS (Hover) */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                       <button
                          onClick={() => toggleSelection(index)}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
                            isSelected 
                              ? "bg-indigo-600 border-indigo-400 text-white" 
                              : "bg-black/40 border-white/20 text-white hover:bg-white/20"
                          )}
                          title="Comparer (A/B Test)"
                        >
                          <Swords className="w-5 h-5" />
                        </button>
                        
                        <div className="flex gap-2">
                           <button
                             onClick={() => openPreview(index)}
                             className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-all shadow-xl active:scale-90"
                             title="Simulator YouTube"
                           >
                              <Play className="w-5 h-5" />
                           </button>
                           <button
                              onClick={() => setLightboxSrc(`data:${img.mediaType};base64,${img.data}`)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-all shadow-xl active:scale-90"
                           >
                              <ZoomIn className="w-5 h-5" />
                           </button>
                        </div>
                    </div>

                    {/* BOTTOM ACTIONS (Hover) */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          size="sm"
                          className="h-10 flex-1 text-[11px] font-black uppercase tracking-widest bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl shadow-2xl active:scale-95"
                          onClick={() => downloadImage(img.data, img.mediaType, index)}
                        >
                          <Download className="w-4 h-4 mr-2 text-indigo-500" />
                          Download
                        </Button>
                        
                        {onRegenerate && (
                          <button
                            onClick={() => onRegenerate(index)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-all active:scale-90 shadow-2xl"
                            title="Régénérer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                    </div>

                    {/* Label Badge */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-[10px] font-black bg-black/50 text-white/90 tracking-[0.2em] uppercase backdrop-blur-md border border-white/5 opacity-100 group-hover:opacity-0 transition-opacity">
                      Version {index + 1}
                    </div>
                  </>
                )}
              </div>

              {/* SECONDARY TOOLS */}
              <div className="space-y-3">
                 <Button
                    variant="ghost"
                    size="sm"
                    disabled={isAnalyzing}
                    onClick={() => generateTitles(index)}
                    className={cn(
                      "h-10 w-full text-[11px] font-black uppercase tracking-widest border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl transition-all group/btn",
                      isAnalyzing ? "bg-neutral-50 dark:bg-white/5 cursor-wait" : "hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    )}
                 >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Type className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                    )}
                    Générer des titres IA
                 </Button>

                 {/* TITLES LIST (With Skeleton) */}
                 {isAnalyzing && (
                    <div className="space-y-2 p-4 rounded-2xl bg-neutral-50 dark:bg-white/2 border border-neutral-100 dark:border-white/5">
                        <div className="h-3 bg-neutral-200 dark:bg-white/10 rounded-full w-1/3 animate-pulse mb-4" />
                        {[...Array(3)].map((_, i) => (
                           <div key={i} className="h-4 bg-neutral-200 dark:bg-white/10 rounded-full w-full animate-pulse" />
                        ))}
                    </div>
                 )}

                 {titles && !isAnalyzing && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-100 dark:border-white/5 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Titres optimisés CTR</span>
                          </div>
                          <Bot className="w-3.5 h-3.5 text-neutral-300" />
                       </div>
                       <div className="space-y-2">
                         {titles.map((t, i) => (
                           <button 
                             key={i} 
                             className="group/t flex items-start gap-3 w-full p-2.5 rounded-xl text-left transition-all hover:bg-neutral-50 dark:hover:bg-white/5 border border-transparent hover:border-neutral-100 dark:hover:border-white/5"
                             onClick={() => {
                               navigator.clipboard.writeText(t);
                               toast.success("Titre copié dans le presse-papier");
                               setPreviewTitle(t);
                             }}
                           >
                              <div className="w-5 h-5 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover/t:bg-emerald-100 dark:group-hover/t:bg-emerald-900/30 group-hover/t:text-emerald-600 transition-colors">
                                 <PlusSquare className="w-3 h-3" />
                              </div>
                              <p className="text-[13px] text-neutral-600 dark:text-neutral-300 font-medium leading-normal line-clamp-2">
                                {t}
                              </p>
                              <Copy className="w-3 h-3 text-neutral-300 ml-auto opacity-0 group-hover/t:opacity-100 transition-all" />
                           </button>
                         ))}
                       </div>
                    </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-20000 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12"
          onClick={() => setLightboxSrc(null)}
        >
          <button className="absolute top-8 right-8 w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all shadow-2xl active:scale-95 border border-white/10 scale-110">
            <X className="w-6 h-6" />
          </button>
          <div className={cn("relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10", aspectClass)} onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxSrc} alt="Vision HD" fill className="object-contain" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-white text-xs font-black uppercase tracking-widest flex items-center gap-3">
               <Bot className="w-4 h-4 text-indigo-400" /> Rendement HD Studio
            </div>
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
