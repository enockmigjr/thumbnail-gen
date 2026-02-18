"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Type, Sparkles, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface TitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: string[];
  image: string; // Base64
  aspectRatio: string;
}

export function TitlesModal({ isOpen, onClose, titles, image, aspectRatio }: TitlesModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!mounted || !isOpen || titles.length === 0) return null;

  const aspectClass = aspectRatio === "9:16" ? "aspect-9/16" : aspectRatio === "1:1" ? "aspect-square" : "aspect-video";

  const modal = (
    <div className="fixed inset-0 z-20000 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
                <Type className="w-5 h-5 text-white dark:text-black" />
             </div>
             <div>
               <h2 className="text-base font-black uppercase tracking-tight dark:text-white">Titres Optimisés CTR</h2>
               <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest italic">Analyse sémantique IA</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Aperçu Visuel</h3>
                <div className={cn("relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/5 shadow-xl", aspectClass)}>
                   <Image src={`data:image/png;base64,${image}`} fill alt="Thumbnail" className="object-cover" />
                </div>
                <div className="flex gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                   <Sparkles className="w-4 h-4 shrink-0" />
                   <p className="text-[11px] font-medium leading-relaxed">Ces titres ont été générés en analysant les éléments visuels et cognitifs de votre miniature.</p>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Suggestions (Top 5)</h3>
                <div className="space-y-2.5">
                  {titles.map((t, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        navigator.clipboard.writeText(t);
                        toast.success("Titre copié !");
                      }}
                      className="group flex items-start gap-4 p-4 w-full rounded-2xl bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-50/10"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-[11px] font-black text-neutral-400 group-hover:text-emerald-500 transition-colors shrink-0">
                         {i + 1}
                      </div>
                      <p className="text-sm dark:text-neutral-300 font-bold leading-tight flex-1">
                        {t}
                      </p>
                      <Copy className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950/50 flex justify-end shrink-0">
           <Button onClick={onClose} variant="secondary" className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-6">
             Fermer
           </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
