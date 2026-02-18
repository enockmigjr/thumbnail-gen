"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn, X, RefreshCw, Archive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import JSZip from "jszip";

interface ThumbnailGridProps {
  images: Array<{ data: string; mediaType: string }>;
  isLoading?: boolean;
  onRegenerate?: (index: number) => void;
  isRegeneratingIndex?: number | null;
  aspectRatio?: string;
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
  aspectRatio = "16:9" 
}: ThumbnailGridProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

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

  const aspectClass = aspectRatio === "9:16" ? "aspect-[9/16]" : aspectRatio === "1:1" ? "aspect-square" : "aspect-video";
  const gridClass = aspectRatio === "9:16" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2";

  if (!isLoading && images.length === 0) return null;

  return (
    <div className="space-y-4">
      {images.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAllAsZip}
            disabled={isZipping}
            className="h-8 text-xs gap-2 border-neutral-200 dark:border-neutral-800"
          >
            {isZipping ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Archive className="w-3.5 h-3.5" />
            )}
            Tout télécharger (ZIP)
          </Button>
        </div>
      )}
      
      <div className={cn("grid gap-4", gridClass)}>
        {isLoading &&
          images.length === 0 &&
          Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} ratio={aspectRatio} />)}

        {images.map((img, index) => {
          const isRegenerating = isRegeneratingIndex === index;
          
          return (
            <div
              key={index}
              className={cn(
                "group relative rounded-xl overflow-hidden shadow-sm transition-all duration-300",
                "border border-neutral-200 dark:border-neutral-800",
                "hover:border-neutral-300 dark:hover:border-neutral-700",
                "hover:shadow-md dark:hover:shadow-neutral-900/50",
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Actions */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <button
                      onClick={() => setLightboxSrc(`data:${img.mediaType};base64,${img.data}`)}
                      title="Agrandir"
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm",
                        "border border-white/20 dark:border-neutral-700",
                        "text-neutral-700 dark:text-neutral-300",
                        "hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                      )}
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    
                    {onRegenerate && (
                      <button
                        onClick={() => onRegenerate(index)}
                        title="Régénérer cette image"
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm",
                          "border border-white/20 dark:border-neutral-700",
                          "text-neutral-700 dark:text-neutral-300",
                          "hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                        )}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <Button
                      size="sm"
                      className={cn(
                        "h-8 px-3 text-xs font-medium rounded-lg shadow-sm font-sans",
                        "bg-white/90 dark:bg-white text-neutral-900 dark:text-neutral-900",
                        "hover:bg-white dark:hover:bg-neutral-100 transition-colors"
                      )}
                      onClick={() => downloadImage(img.data, img.mediaType, index)}
                    >
                      <Download className="w-3 h-3 mr-1.5" />
                      Download
                    </Button>
                  </div>

                  {/* Index */}
                  <div
                    className={cn(
                      "absolute top-3 left-3 w-5 h-5 rounded-md flex items-center justify-center shadow-sm",
                      "bg-black/40 backdrop-blur-sm"
                    )}
                  >
                    <span className="text-[10px] text-white font-semibold font-mono">
                      {index + 1}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className={cn(
              "absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              "bg-white/10 hover:bg-white/20 active:scale-95 shadow-xl",
              "text-white"
            )}
            onClick={() => setLightboxSrc(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className={cn(
              "relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10",
              aspectClass
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Thumbnail preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
