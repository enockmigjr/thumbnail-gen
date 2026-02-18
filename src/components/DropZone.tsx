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
}

export function DropZone({
  label,
  description,
  multiple = false,
  onFilesChange,
  maxFiles = 1,
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={cn(
          "relative min-h-[110px] rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
          isDragActive
            ? "border-neutral-400 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800 scale-[1.01]"
            : cn(
                "border-neutral-200 dark:border-neutral-800",
                "bg-neutral-50 dark:bg-neutral-900",
                "hover:border-neutral-300 dark:hover:border-neutral-700",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              )
        )}
      >
        <input {...getInputProps()} />

        {previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[110px] gap-2 p-4">
            <div
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                isDragActive
                  ? "bg-neutral-200 dark:bg-neutral-700"
                  : "bg-neutral-100 dark:bg-neutral-800"
              )}
            >
              <ImagePlus
                className={cn(
                  "w-4 h-4",
                  isDragActive
                    ? "text-neutral-700 dark:text-neutral-300"
                    : "text-neutral-400 dark:text-neutral-600"
                )}
              />
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-xs font-medium",
                  isDragActive
                    ? "text-neutral-700 dark:text-neutral-300"
                    : "text-neutral-500 dark:text-neutral-500"
                )}
              >
                {isDragActive ? "Déposez ici" : "Glissez ou cliquez"}
              </p>
              {description && (
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2 grid grid-cols-2 gap-1.5">
            {previews.map((src, index) => (
              <div
                key={index}
                className="relative group aspect-video rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800"
              >
                <Image
                  src={src}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => removeImage(index, e)}
                  className={cn(
                    "absolute top-1 right-1 p-1 rounded-md",
                    "bg-white/90 dark:bg-neutral-900/90",
                    "text-neutral-700 dark:text-neutral-300",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    "hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400"
                  )}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {multiple && previews.length < maxFiles && (
              <div
                className={cn(
                  "flex items-center justify-center aspect-video rounded-lg",
                  "border-2 border-dashed border-neutral-200 dark:border-neutral-800",
                  "hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                )}
              >
                <Upload className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
