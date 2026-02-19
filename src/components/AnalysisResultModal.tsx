"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trophy, BarChart3, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    winner: number;
    reasoning: string;
    comparison: Record<string, string>;
  } | null;
  images: string[]; // Base64 images
  indices: number[]; // Original indices
}

export function AnalysisResultModal({ isOpen, onClose, result, images, indices }: AnalysisResultModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!mounted || !isOpen || !result) return null;

  const winnerIdx = result.winner - 1;
  const loserIdx = result.winner === 1 ? 1 : 0;

  const modal = (
    <div className="fixed inset-0 z-20000 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white dark:text-black" />
             </div>
             <div>
               <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Verdict de l&apos;IA Studio</h2>
               <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest">Analyse Prédictive de Conversion</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6 space-y-10">
          
          {/* Winner Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black uppercase tracking-widest">
                  <Trophy className="w-3 h-3" /> GAGNANT : VERSION #{indices[winnerIdx] + 1}
                </div>
                
                <p className="text-xl font-bold leading-tight dark:text-white">
                  {result.reasoning}
                </p>

                <div className="space-y-4">
                  {Object.entries(result.comparison).map(([key, val]) => (
                    <div key={key} className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5 transition-all hover:border-neutral-200 dark:hover:border-white/10">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Star className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 italic">{key}</span>
                      </div>
                      <p className="text-sm dark:text-neutral-300 leading-relaxed font-medium">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
             </div>

             <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20 group">
                   <Image src={`data:image/png;base64,${images[winnerIdx]}`} fill alt="Winner" className="object-cover" />
                   <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
                   <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black uppercase tracking-widest">
                     CTR MAXIMAL
                   </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden grayscale opacity-50 border border-neutral-200 dark:border-white/5">
                   <Image src={`data:image/png;base64,${images[loserIdx]}`} fill alt="Loser" className="object-cover" />
                   <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-neutral-500 text-white text-xs font-black uppercase tracking-widest">
                     PERDANT
                   </div>
                </div>
             </div>
          </div>

          {/* Tips / Action */}
          <div className="p-6 rounded-3xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 opacity-50" />
              <div>
                <p className="text-sm font-bold">Confiance algorithmique élevée</p>
                <p className="text-xs opacity-60">Cette miniature respecte les patterns de clics de YouTube 2026.</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                const link = document.createElement("a");
                link.href = `data:image/png;base64,${images[winnerIdx]}`;
                link.download = `winner-thumbnail.png`;
                link.click();
              }}
              variant="secondary"
              className="rounded-xl font-bold uppercase tracking-widest text-xs h-10 px-6 shrink-0"
            >
              Télécharger le gagnant
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950/50 flex justify-center shrink-0">
           <span className="text-xs text-neutral-400 font-bold uppercase tracking-[0.3em]">ThumbnailAI · Vision Studio</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
