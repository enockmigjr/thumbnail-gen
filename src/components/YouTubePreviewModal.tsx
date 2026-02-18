"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Monitor, Smartphone, CheckCircle2, MoreVertical, Search, Menu, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface YouTubePreviewModalProps {
  image: string; // Base64
  aspectRatio: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function YouTubePreviewModal({ image, aspectRatio, isOpen, onClose, title }: YouTubePreviewModalProps) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const demoTitle = title || "COMMENT CRÉER DES MINIATURES INCROYABLES AVEC L'IA ! (Tuto complet)";

  const modal = (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col bg-neutral-100 dark:bg-[#0f0f0f] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header Control */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0f0f0f] border-b border-neutral-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Preview Simulator</h3>
            <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
            <div className="flex bg-neutral-200/50 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setView("desktop")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  view === "desktop" ? "bg-white dark:bg-[#272727] shadow-sm text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button 
                onClick={() => setView("mobile")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  view === "mobile" ? "bg-white dark:bg-[#272727] shadow-sm text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
          {view === "desktop" ? (
            <div className="max-w-[1284px] mx-auto p-4 sm:p-8">
              {/* Fake YouTube Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <Menu className="w-6 h-6 dark:text-white" />
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-6 bg-red-600 rounded-md flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[7px] border-l-white ml-0.5" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter dark:text-white">YouTube</span>
                  </div>
                </div>
                <div className="flex-1 max-w-xl mx-8">
                  <div className="flex items-center px-4 py-2 border border-neutral-200 dark:border-white/10 rounded-full bg-neutral-50 dark:bg-white/5">
                    <input className="bg-transparent flex-1 text-sm outline-none" placeholder="Rechercher" disabled />
                    <Search className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
                <div className="flex items-center gap-5 dark:text-white">
                  <Bell className="w-6 h-6" />
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">E</div>
                </div>
              </div>

              {/* Grid Simulator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                {/* THE MINIATURE */}
                <div className="flex flex-col gap-3 group">
                   <div className={cn(
                     "relative rounded-xl overflow-hidden bg-neutral-200 dark:bg-white/5 ring-4 ring-emerald-500/30",
                     aspectRatio === "9:16" ? "aspect-9/16 w-2/3 mx-auto" : 
                     aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
                   )}>
                     <Image src={image} fill alt="Preview" className="object-cover" />
                     <div className="absolute bottom-1.5 right-1.5 px-1 bg-black/80 rounded text-[11px] font-bold text-white">12:45</div>
                   </div>
                   <div className="flex gap-3">
                     <div className="w-9 h-9 shrink-0 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-[10px] font-bold text-white dark:text-black">AI</div>
                     <div className="flex flex-col gap-1 pr-4">
                       <h4 className="text-sm font-bold line-clamp-2 leading-tight dark:text-white">{demoTitle}</h4>
                       <div className="text-xs text-neutral-500 dark:text-neutral-400">
                         <div className="flex items-center gap-1">ThumbnailAI <CheckCircle2 className="w-3 h-3" /></div>
                         <p>12k vues • il y a 2 heures</p>
                       </div>
                     </div>
                     <MoreVertical className="w-4 h-4 text-neutral-400 ml-auto" />
                   </div>
                </div>

                {/* DUMMIES */}
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 opacity-30 grayscale">
                    <div className="aspect-video bg-neutral-200 dark:bg-white/5 rounded-xl" />
                    <div className="flex gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-neutral-200 dark:bg-white/5" />
                      <div className="flex flex-col gap-2 w-full">
                        <div className="h-4 bg-neutral-200 dark:bg-white/5 rounded w-full" />
                        <div className="h-3 bg-neutral-200 dark:bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center bg-black h-full pt-8">
               <div className="relative w-[375px] h-[700px] bg-white dark:bg-[#0f0f0f] rounded-[3.5rem] border-8 border-neutral-800 shadow-2xl overflow-hidden">
                  <div className="h-14 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-white/5 shrink-0">
                    <span className="font-bold text-lg dark:text-white">YouTube</span>
                    <div className="flex gap-4">
                      <Search className="w-5 h-5 dark:text-white" />
                      <User className="w-5 h-5 dark:text-white" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-8">
                     {/* THE MINIATURE */}
                     <div className="flex flex-col gap-3 border-b border-neutral-100 dark:border-white/5 pb-6">
                        <div className={cn(
                          "relative rounded-xl overflow-hidden bg-neutral-200 dark:bg-white/5",
                          aspectRatio === "9:16" ? "aspect-9/16 w-3/4 mx-auto" : 
                          aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
                        )}>
                          <Image src={image} fill alt="Preview" className="object-cover" />
                        </div>
                        <div className="flex gap-3">
                           <div className="w-10 h-10 shrink-0 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-black">AI</div>
                           <div className="space-y-1">
                              <h4 className="text-sm font-bold dark:text-white">{demoTitle}</h4>
                              <p className="text-xs text-neutral-500">ThumbnailAI • 12k vues • il y a 2 heures</p>
                           </div>
                        </div>
                     </div>

                     {/* DUMMIES */}
                     {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex flex-col gap-3 opacity-20 grayscale">
                        <div className="aspect-video bg-neutral-200 dark:bg-white/5 rounded-xl" />
                        <div className="h-4 bg-neutral-200 dark:bg-white/5 rounded w-3/4" />
                      </div>
                     ))}
                  </div>

                  {/* Notch / Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
