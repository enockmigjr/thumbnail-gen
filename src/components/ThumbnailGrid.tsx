"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThumbnailGridProps {
  images: Array<{ data: string; mediaType: string }>;
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
      <div className="absolute inset-0 bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-shimmer bg-size-[200%_100%]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse" />
        <div className="w-24 h-2 rounded-full bg-zinc-800 animate-pulse" />
        <div className="w-16 h-2 rounded-full bg-zinc-800 animate-pulse" />
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
            className="group relative aspect-video rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10"
          >
            <Image
              src={`data:${img.mediaType};base64,${img.data}`}
              alt={`Generated thumbnail ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Actions */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                onClick={() =>
                  setLightboxSrc(`data:${img.mediaType};base64,${img.data}`)
                }
              >
                <ZoomIn className="w-3.5 h-3.5 text-white" />
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium"
                onClick={() => downloadImage(img.data, img.mediaType, index)}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Télécharger
              </Button>
            </div>

            {/* Index badge */}
            <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <span className="text-xs text-white/70 font-medium">
                {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setLightboxSrc(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div
            className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
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
