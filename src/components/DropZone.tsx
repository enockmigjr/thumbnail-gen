"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Upload, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  label: string;
  description?: string;
  multiple?: boolean;
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  icon?: React.ReactNode;
}

export function DropZone({
  label,
  description,
  multiple = false,
  onFilesChange,
  maxFiles = 1,
  icon,
}: DropZoneProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews: string[] = [];
      let processed = 0;

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          newPreviews.push(base64);
          processed++;
          if (processed === acceptedFiles.length) {
            const updated = multiple
              ? [...previews, ...newPreviews].slice(0, maxFiles)
              : newPreviews.slice(0, 1);
            setPreviews(updated);
            onFilesChange(updated);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [previews, multiple, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    multiple,
    maxFiles,
  });

  const removeImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onFilesChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={cn(
          "relative min-h-[120px] rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
          isDragActive
            ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50"
        )}
      >
        <input {...getInputProps()} />

        {previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2 p-4">
            <div
              className={cn(
                "p-3 rounded-full transition-colors",
                isDragActive ? "bg-violet-500/20" : "bg-zinc-800"
              )}
            >
              {icon || (
                <ImagePlus
                  className={cn(
                    "w-5 h-5",
                    isDragActive ? "text-violet-400" : "text-zinc-500"
                  )}
                />
              )}
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-sm font-medium",
                  isDragActive ? "text-violet-300" : "text-zinc-400"
                )}
              >
                {isDragActive ? "Déposez ici" : "Glissez ou cliquez"}
              </p>
              {description && (
                <p className="text-xs text-zinc-600 mt-0.5">{description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2 grid grid-cols-2 gap-2">
            {previews.map((src, index) => (
              <div key={index} className="relative group aspect-video rounded-lg overflow-hidden">
                <Image
                  src={src}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => removeImage(index, e)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {multiple && previews.length < maxFiles && (
              <div className="flex items-center justify-center aspect-video rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-500 transition-colors">
                <Upload className="w-4 h-4 text-zinc-600" />
              </div>
            )}
          </div>
        )}

        {isDragActive && (
          <div className="absolute inset-0 bg-violet-500/5 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-violet-500/20 border border-violet-500/50 rounded-xl px-4 py-2">
              <p className="text-violet-300 text-sm font-medium">Déposez l&apos;image</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
