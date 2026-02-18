"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Info,
  X,
  Zap,
  Image as ImageIcon,
  Users,
  Sparkles,
  AlertTriangle,
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
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white dark:text-neutral-900" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                ThumbnailAI
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Guide d&apos;utilisation
              </p>
            </div>
          </div>
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

        {/* Scrollable content */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto">
          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            ThumbnailAI génère des miniatures YouTube professionnelles à partir
            d&apos;une description textuelle, en utilisant le modèle{" "}
            <code className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              gemini-3-pro-image-preview
            </code>{" "}
            de Google.
          </p>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Comment utiliser
            </h3>
            <div className="space-y-2.5">
              {[
                {
                  icon: <ImageIcon className="w-3.5 h-3.5" />,
                  step: "1",
                  title: "Images de référence (optionnel)",
                  desc: "Ajoutez des images pour guider le style, l'inspiration ou les personnes à inclure. Glissez-déposez ou cliquez.",
                },
                {
                  icon: <Sparkles className="w-3.5 h-3.5" />,
                  step: "2",
                  title: "Décrivez votre miniature",
                  desc: 'Soyez précis : sujet, ambiance, couleurs, style. Ex : "Homme choqué devant un graphique qui monte, fond rouge, style cinématique".',
                },
                {
                  icon: <Users className="w-3.5 h-3.5" />,
                  step: "3",
                  title: "Choisissez le nombre & le ratio",
                  desc: "Générez 1 à 4 miniatures en 16:9, 9:16 (Shorts) ou 1:1 (Community). ~30s par image (génération séquentielle).",
                },
                {
                  icon: <Zap className="w-3.5 h-3.5" />,
                  step: "4",
                  title: "Générez & téléchargez",
                  desc: "Cliquez sur Générer ou Ctrl+Entrée. Survolez une miniature pour la zoomer, télécharger ou régénérer individuellement.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div
                    className={cn(
                      "mt-0.5 w-6 h-6 rounded-md shrink-0 flex items-center justify-center",
                      "bg-neutral-100 dark:bg-neutral-800",
                      "text-neutral-500 dark:text-neutral-400"
                    )}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div
            className={cn(
              "flex gap-2.5 p-3 rounded-xl",
              "bg-amber-50 dark:bg-amber-950/30",
              "border border-amber-200 dark:border-amber-900/50"
            )}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Quota API
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
                Le free tier Gemini est limité. En cas d&apos;erreur 429,
                attendez ~1 minute avant de réessayer. Préférez générer 1 image
                à la fois.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
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
                  className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-500"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 shrink-0">
          <p className="text-xs text-neutral-400 dark:text-neutral-600 text-center">
            Propulsé par{" "}
            <a
              href="https://ai.google.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              Google Gemini API
            </a>{" "}
            · gemini-3-pro-image-preview
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Informations sur l'application"
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
          "border border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-900",
          "hover:bg-neutral-50 dark:hover:bg-neutral-800",
          "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        )}
      >
        <Info className="w-4 h-4" />
      </button>

      {/* Portal — rendu dans document.body pour échapper au header sticky */}
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
