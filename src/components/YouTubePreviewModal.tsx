"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Monitor, 
  Smartphone, 
  CheckCircle2, 
  MoreVertical, 
  Search, 
  Menu, 
  Bell,  
  PlusSquare,
  Mic,
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  ChevronDown,
  History,
  ListVideo,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface YouTubePreviewModalProps {
  image: string; // Base64
  aspectRatio: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const SIDEBAR_ITEMS = [
  { icon: <Home className="w-5 h-5" />, label: "Accueil", active: true },
  { icon: <Compass className="w-5 h-5" />, label: "Shorts" },
  { icon: <PlaySquare className="w-5 h-5" />, label: "Abonnements" },
];

const YOU_ITEMS = [
  { icon: <History className="w-5 h-5" />, label: "Historique" },
  { icon: <ListVideo className="w-5 h-5" />, label: "Playlists" },
  { icon: <Clock className="w-5 h-5" />, label: "À regarder plus tard" },
  { icon: <ThumbsUp className="w-5 h-5" />, label: "Vidéos j'aime" },
];

const CHANNELS = [
  { name: "FRENCHTV247", color: "bg-orange-500", dot: true },
  { name: "Melvynx • Appre...", color: "bg-blue-500", dot: true },
  { name: "MrBeast 2", color: "bg-cyan-500", dot: true },
  { name: "LCI", color: "bg-red-700", dot: true },
  { name: "Micode", color: "bg-purple-600", dot: false },
  { name: "Frandroid", color: "bg-pink-600", dot: true },
  { name: "Présidence Bénin", color: "bg-green-600", dot: true },
];

export function YouTubePreviewModal({ image, aspectRatio, isOpen, onClose, title }: YouTubePreviewModalProps) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const demoTitle = title || "COMMENT CRÉER DES MINIATURES INCROYABLES AVEC L'IA ! (Tuto complet)";

  const modal = (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/90 backdrop-blur-md p-0">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-[1600px] h-full flex flex-col bg-white dark:bg-[#0f0f0f] shadow-2xl border border-white/5 overflow-hidden">
        {/* TOP TOOLBAR (INTERNAL) */}
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#0f0f0f] border-b border-neutral-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">YouTube Simulator</span>
            <div className="flex bg-neutral-100 dark:bg-white/5 p-1 rounded-xl border border-neutral-200 dark:border-white/5">
              <button 
                onClick={() => setView("desktop")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  view === "desktop" ? "bg-white dark:bg-[#272727] shadow-md text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button 
                onClick={() => setView("mobile")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  view === "mobile" ? "bg-white dark:bg-[#272727] shadow-md text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIMULATOR CONTENT */}
        <div className="flex-1 flex overflow-hidden">
          {view === "desktop" ? (
            <>
              {/* SIDEBAR */}
              <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-neutral-100 dark:border-white/5 p-3 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f0f0f]">
                <div className="space-y-1 mb-4">
                  {SIDEBAR_ITEMS.map(item => (
                    <button key={item.label} className={cn(
                      "flex items-center gap-5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      item.active ? "bg-neutral-100 dark:bg-white/10 font-bold dark:text-white" : "hover:bg-neutral-50 dark:hover:bg-white/5 dark:text-neutral-300"
                    )}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-neutral-100 dark:bg-white/5 my-3 mx-3" />
                <div className="px-3 py-2 text-sm font-bold flex items-center gap-2 dark:text-white mb-1">
                  Vous <ChevronDown className="w-4 h-4" />
                </div>
                <div className="space-y-1 mb-4">
                  {YOU_ITEMS.map(item => (
                    <button key={item.label} className="flex items-center gap-5 w-full px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/5 dark:text-neutral-300">
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-neutral-100 dark:bg-white/5 my-3 mx-3" />
                <div className="px-3 py-2 text-sm font-bold dark:text-white mb-1">Abonnements</div>
                <div className="space-y-1 mb-4">
                  {CHANNELS.map(ch => (
                    <button key={ch.name} className="flex items-center gap-5 w-full px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/5 dark:text-neutral-300">
                      <div className={cn("w-6 h-6 rounded-full shrink-0", ch.color)} />
                      <span className="flex-1 text-left truncate">{ch.name}</span>
                      {ch.dot && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                    </button>
                  ))}
                  <button className="flex items-center gap-5 w-full px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/5 dark:text-neutral-300">
                    <ChevronDown className="w-5 h-5" /> Plus
                  </button>
                </div>
              </aside>

              {/* MAIN YT AREA */}
              <div className="flex-1 flex flex-col bg-white dark:bg-[#0f0f0f] overflow-hidden">
                {/* YT TOP BAR */}
                <header className="h-14 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-4">
                    <Menu className="w-6 h-6 dark:text-white" />
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[7px] border-l-white ml-0.5" />
                      </div>
                      <span className="font-bold text-xl tracking-tighter dark:text-white">YouTube</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium ml-1">FR</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 max-w-2xl w-full translate-x-4">
                    <div className="flex items-center flex-1 h-10 px-4 border border-neutral-200 dark:border-white/10 rounded-l-full bg-white dark:bg-[#121212] focus-within:border-blue-500">
                      <Search className="w-5 h-5 text-neutral-400 mr-3" />
                      <input className="bg-transparent flex-1 outline-none text-[15px] dark:text-white" placeholder="Rechercher" disabled />
                    </div>
                    <button className="h-10 px-5 bg-neutral-100 dark:bg-white/8 b order border-l-0 border-neutral-200 dark:border-white/10 rounded-r-full hover:bg-neutral-200 dark:hover:bg-white/15">
                      <Search className="w-5 h-5 dark:text-white" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-white/8 ml-2 hover:bg-neutral-200 dark:hover:bg-white/15">
                      <Mic className="w-5 h-5 dark:text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/5">
                      <PlusSquare className="w-6 h-6 dark:text-white" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 relative">
                      <Bell className="w-6 h-6 dark:text-white" />
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 rounded-full border-2 border-white dark:border-[#0f0f0f] text-[9px] font-bold text-white flex items-center justify-center">9+</span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white ml-2 ring-1 ring-white/10">A</div>
                  </div>
                </header>

                {/* YT CONTENT SCROLL */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                   {/* Categories */}
                   <div className="flex gap-3 mb-8 overflow-x-hidden">
                      {["Tous", "Jeux vidéo", "Musique", "Mix", "En direct", "Programmation", "Économie", "Podcasts", "Android", "Stratégies"].map((cat, i) => (
                        <span key={cat} className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap",
                          i === 0 ? "bg-black dark:bg-white text-white dark:text-black" : "bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/20"
                        )}>{cat}</span>
                      ))}
                   </div>

                   {/* Grid */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-10">
                      {/* OUR VIDEO */}
                      <div className="flex flex-col gap-3 group animate-in fade-in duration-700">
                         <div className={cn(
                           "relative rounded-2xl overflow-hidden bg-neutral-200 dark:bg-white/5 ring-4 ring-emerald-500/40 shadow-xl",
                           aspectRatio === "9:16" ? "aspect-9/16 w-3/4 mx-auto" : 
                           aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
                         )}>
                           <Image src={image} fill alt="Simulation" className="object-cover" />
                           <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/90 rounded text-[12px] font-bold text-white shadow-lg">14:57</div>
                         </div>
                         <div className="flex gap-3 px-1">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-neutral-900 dark:bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white shadow-inner">AI</div>
                            <div className="space-y-1 flex-1 pr-2">
                               <h4 className="text-[16px] font-bold leading-[1.3] line-clamp-2 dark:text-white group-hover:text-blue-600 transition-colors">
                                 {demoTitle}
                               </h4>
                               <div className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-1">
                                  <div className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-white cursor-pointer">
                                    ThumbnailAI <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                                  </div>
                                  <p>42 k vues • il y a 3 heures</p>
                               </div>
                            </div>
                            <MoreVertical className="w-5 h-5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                      </div>

                      {/* DUMMY VIDEOS (Realistic) */}
                      {[
                        { title: "Pourquoi mon code ne fonctionne pas ? (Storytime)", views: "125 k", date: "2 jours" },
                        { title: "10 astuces Gemini pour booster vos apps Next.js", views: "8 k", date: "1 heure" },
                        { title: "Vlog : Une journée chez Vercel à San Francisco", views: "1.2 M", date: "1 mois" },
                        { title: "React 19 : Tout ce qui change vraiment", views: "56 k", date: "12 heures" },
                        { title: "Comment j'ai hacké ma propre miniature IA", views: "12 k", date: "4 heures" },
                        { title: "Le futur du design web en 2026", views: "250 k", date: "5 jours" },
                      ].map((vid, i) => (
                        <div key={i} className="flex flex-col gap-3 opacity-30 grayscale hover:opacity-50 transition-all cursor-not-allowed">
                           <div className="aspect-video bg-neutral-200 dark:bg-white/5 rounded-2xl" />
                           <div className="flex gap-3 px-1">
                              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-white/10 shrink-0" />
                              <div className="space-y-2 w-full">
                                 <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded-md w-full" />
                                 <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded-md w-2/3" />
                                 <div className="h-3 bg-neutral-100 dark:bg-white/5 rounded-md w-1/3 mt-2" />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </>
          ) : (
            /* MOBILE VIEW */
            <div className="flex-1 flex justify-center bg-black overflow-y-auto custom-scrollbar py-12">
               <div className="relative w-[375px] h-[780px] bg-white dark:bg-[#0f0f0f] rounded-[3.5rem] border-10px border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
                  <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-white/5 shrink-0 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-10">
                    <span className="font-bold text-xl tracking-tighter dark:text-white">YouTube</span>
                    <div className="flex gap-5">
                      <Search className="w-5 h-5 dark:text-white" />
                      <Bell className="w-5 h-5 dark:text-white" />
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto">
                     {/* THE VIDEO */}
                     <div className="flex flex-col gap-3 border-b-4 border-neutral-100 dark:border-white/3 pb-6">
                        <div className={cn(
                          "relative bg-neutral-200 dark:bg-white/5",
                          aspectRatio === "9:16" ? "aspect-9/16 w-full" : 
                          aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
                        )}>
                          <Image src={image} fill alt="Mobile" className="object-cover" />
                        </div>
                        <div className="flex gap-3 px-4">
                           <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white">AI</div>
                           <div className="space-y-1 pr-2">
                              <h4 className="text-[15px] font-bold leading-[1.3] dark:text-white">{demoTitle}</h4>
                              <p className="text-[12px] text-neutral-500">ThumbnailAI • 12 k vues • il y a 3 heures</p>
                           </div>
                           <MoreVertical className="w-5 h-5 text-neutral-400 ml-auto" />
                        </div>
                     </div>

                     {/* DUMMY MOBILE ITEMS */}
                     {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex flex-col gap-3 opacity-20 border-b-4 border-neutral-50 dark:border-white/3 pb-8 pt-4">
                        <div className="aspect-video bg-neutral-100 dark:bg-white/5" />
                        <div className="px-4 space-y-2">
                           <div className="h-4 bg-neutral-100 dark:bg-white/5 rounded-md w-3/4" />
                           <div className="h-3 bg-neutral-100 dark:bg-white/5 rounded-md w-1/2" />
                        </div>
                      </div>
                     ))}
                  </div>

                  {/* NAV BAR MOBILE */}
                  <nav className="h-16 flex items-center justify-around border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-[#0f0f0f] shrink-0">
                    <div className="flex flex-col items-center gap-1 opacity-100"><Home className="w-6 h-6 dark:text-white" /><span className="text-[10px] dark:text-white">Accueil</span></div>
                    <div className="flex flex-col items-center gap-1 opacity-50"><Compass className="w-6 h-6 dark:text-white" /><span className="text-[10px] dark:text-white">Shorts</span></div>
                    <div className="flex flex-col items-center gap-1 opacity-50"><PlaySquare className="w-6 h-6 dark:text-white" /><span className="text-[10px] dark:text-white">Abonnements</span></div>
                    <div className="flex flex-col items-center gap-1 opacity-50"><UserCircle className="w-6 h-6 dark:text-white" /><span className="text-[10px] dark:text-white">Vous</span></div>
                  </nav>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl flex items-center justify-center px-4">
                     <div className="w-10 h-1 rounded-full bg-white/10" />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
