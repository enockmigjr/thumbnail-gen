"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  const refCallback = useCallback((node: HTMLElement | null) => {
    if (node !== null && !mountedRef.current) {
      mountedRef.current = true;
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return (
      <div
        ref={refCallback}
        className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Basculer le thème"
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
        "border border-neutral-200 dark:border-neutral-700",
        "bg-white dark:bg-neutral-900",
        "hover:bg-neutral-50 dark:hover:bg-neutral-800",
        "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
      )}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
