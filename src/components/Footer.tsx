import { Github, Globe, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-neutral-200 dark:border-neutral-800",
        "bg-white dark:bg-neutral-950"
      )}
    >
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left — branding */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            ThumbnailAI
          </span>
          <span>·</span>
          <span>© {year}</span>
          <span>·</span>
          <span>Fait avec ❤️ par</span>
          <a
            href="https://github.com/enockmigjr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline underline-offset-2"
          >
            Enock Junior MIGNANWANDE
          </a>
        </div>

        {/* Right — links */}
        <div className="flex items-center gap-1">
          {[
            {
              href: "https://github.com/enockmigjr",
              icon: <Github className="w-3.5 h-3.5" />,
              label: "GitHub",
            },
            {
              href: "https://twitter.com/FraisMig",
              icon: <Twitter className="w-3.5 h-3.5" />,
              label: "Twitter / X",
            },
            {
              href: "https://enomig.dreamhosters.com/",
              icon: <Globe className="w-3.5 h-3.5" />,
              label: "Site web",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150",
                "text-neutral-400 dark:text-neutral-600",
                "hover:text-neutral-700 dark:hover:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
