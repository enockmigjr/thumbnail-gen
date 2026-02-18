"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThumbnailGridProps {
  images: Array<{ data: string; mediaType: string }>;
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden",
        "border border-neutral-200 dark:border-neutral-800",
        "bg-neutral-100 dark:bg-neutral-900"
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

export function ThumbnailGrid({ images, isLoading }: ThumbnailGridProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const downloadImage = (data: string, mediaType: string, index: number) => {
    const ext = mediaType.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = `data:${mediaType};base64,${data}`;
    link.download = `thumbnail-${index + 1}.${ext}`;
    link.click();
  };

  if (!isLoading && images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading &&
          images.length === 0 &&
          Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}

        {images.map((img, index) => (
          <div
            key={index}
            className={cn(
              "group relative aspect-video rounded-xl overflow-hidden",
              "border border-neutral-200 dark:border-neutral-800",
              "hover:border-neutral-300 dark:hover:border-neutral-700",
              "transition-all duration-300",
              "hover:shadow-lg dark:hover:shadow-neutral-900/50"
            )}
          >
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
                onClick={() =>
                  setLightboxSrc(`data:${img.mediaType};base64,${img.data}`)
                }
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm",
                  "border border-white/20",
                  "text-neutral-700 dark:text-neutral-300",
                  "hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                )}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <Button
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs font-medium rounded-lg",
                  "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm",
                  "border border-white/20",
                  "text-neutral-900 dark:text-neutral-100",
                  "hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                )}
                onClick={() => downloadImage(img.data, img.mediaType, index)}
              >
                <Download className="w-3 h-3 mr-1.5" />
                Télécharger
              </Button>
            </div>

            {/* Index */}
            <div
              className={cn(
                "absolute top-3 left-3 w-5 h-5 rounded-md flex items-center justify-center",
                "bg-black/40 backdrop-blur-sm"
              )}
            >
              <span className="text-[10px] text-white font-semibold">
                {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className={cn(
              "absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center",
              "bg-white/10 hover:bg-white/20 transition-colors",
              "text-white"
            )}
            onClick={() => setLightboxSrc(null)}
          >
            <X className="w-4 h-4" />
          </button>
          <div
            className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
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
    </>
  );
}
