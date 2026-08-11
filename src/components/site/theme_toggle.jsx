"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Los dos iconos se renderizan siempre y el CSS decide cual se ve segun la
 * clase `dark` del <html>. next-themes la aplica con un script inline antes
 * del primer pintado, asi que no hay parpadeo ni desajuste de hidratacion —
 * y no hace falta estado de montaje.
 */
export function ThemeToggle({ dict }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dict.a11y_toggle_theme}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </Button>
  );
}
