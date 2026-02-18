"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  History as HistoryIcon, 
  Trash2, 
  Clock,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThumbnailGrid } from "@/components/ThumbnailGrid";

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

interface HistoryModalProps {
  history: HistoryItem[];
  onClear: () => void;
  onUseItem: (item: HistoryItem) => void;
}

export function HistoryModal({ history, onClear, onUseItem }: HistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const modal = open ? (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-6xl rounded-2xl shadow-2xl",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200 dark:border-neutral-800",
          "overflow-hidden max-h-[85vh] flex flex-col"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <HistoryIcon className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Historique des générations
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Retrouvez vos {history.length} dernières créations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-8 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold uppercase tracking-wider"
              >
                <Trash2 className="w-3 h-3 mr-1.5" />
                Effacer
              </Button>
            )}
            <button
              onClick={() => setOpen(false)}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center">
                 <HistoryIcon className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Votre historique est vide.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative flex flex-col gap-3 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 flex-1 pr-4">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 uppercase tracking-tight">
                          {item.aspectRatio}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => {
                        onUseItem(item);
                        setOpen(false);
                      }}
                      className="h-8 text-[10px] font-bold uppercase tracking-wider shrink-0 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90"
                    >
                      Restaurer
                    </Button>
                  </div>
                  
                  <ThumbnailGrid images={item.images} aspectRatio={item.aspectRatio} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 shrink-0">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-600 text-center uppercase tracking-widest font-medium">
            ThumbnailAI · Historique local
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Ouvrir l'historique"
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
          "border border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-900",
          "hover:bg-neutral-50 dark:hover:bg-neutral-800",
          "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        )}
      >
        <HistoryIcon className="w-4 h-4" />
      </button>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
