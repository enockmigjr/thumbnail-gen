"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Info,
  X,
  Zap,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  Swords,
  Type,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

export function InfoModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Bloquer le scroll quand le modal est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const modal = open ? (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl shadow-2xl",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200 dark:border-neutral-800",
          "overflow-hidden max-h-[90vh] flex flex-col"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-neutral-900" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                ThumbnailAI Studio
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Guide des outils IA avancés
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200",
              "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Section 1: Fonctionnement */}
          <div className="space-y-4">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Flux de travail</h3>
             <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <ImageIcon className="w-4 h-4" />, title: "Contexte visuel", desc: "Uploadez des visages ou styles pour guider l'IA." },
                  { icon: <Sparkles className="w-4 h-4" />, title: "Prompt Magique", desc: "Décrivez l'ambiance, les couleurs et le sujet." },
                  { icon: <Zap className="w-4 h-4" />, title: "Parallélisme", desc: "Génération simultanée de plusieurs variantes." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center shrink-0 shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{item.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Section 2: Outils Studio */}
          <div className="space-y-4">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Outils de conversion (CTR)</h3>
             <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                    <Swords className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">IA CTR Predictor (A/B Test)</p>
                    <p className="text-xs text-neutral-500 mt-0.5 line-height-relaxed">
                      Sélectionnez deux miniatures avec l&apos;icône ⚔️. L&apos;IA simulera le comportement des spectateurs pour déterminer laquelle aura le meilleur taux de clic.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">Générateur de Titres IA</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Analyse visuelle de votre miniature pour suggérer 5 titres &quot;putaclic&quot; mais honnêtes, optimisés pour l&apos;algorithme.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/50">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">Simulateur In-Situ</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Visualisez votre création directement dans le flux YouTube Desktop et Mobile pour tester la lisibilité et le contraste.
                    </p>
                  </div>
                </div>
             </div>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Quota & Limites</p>
              <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
                Le modèle Gemini Free Tier est limité par minute. Si la génération échoue, attendez 60s. Le mode démo (Play) permet de tester l&apos;interface sans consommer de quota.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Conseils pour de meilleurs résultats
            </h3>
            <ul className="space-y-1.5">
              {[
                "Mentionnez le style : cinématique, cartoon, réaliste, minimaliste…",
                "Précisez les couleurs dominantes et l'ambiance",
                "Ajoutez une image d'inspiration pour guider le style visuel",
                "Incluez des mots comme « vibrant », « dramatique », « professionnel »",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-500"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 shrink-0">
          <p className="text-xs text-neutral-400 dark:text-neutral-600 text-center uppercase tracking-[0.3em] font-black">
            ThumbnailAI Studio · info
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Informations sur l'application"
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-2 ring-indigo-500",
          "border border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-900",
          "hover:bg-neutral-50 dark:hover:bg-neutral-800",
          "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        )}
      >
        <Info className="w-4 h-4" />
      </button>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
