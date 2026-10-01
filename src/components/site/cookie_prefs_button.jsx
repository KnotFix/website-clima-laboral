"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * «Preferencias de cookies», en el pie. Reabre `ConsentBanner` con la decision
 * actual: retirar el consentimiento tiene que ser tan facil como darlo, y eso
 * es lo que lo hace valido.
 *
 * Es un `<button>` y no un enlace porque no navega. Habla con el banner por un
 * evento de `window` y no por contexto de React: el pie lo dibujan cuatro
 * paginas distintas y el banner vive una sola vez, en el layout.
 */
export function CookiePrefsButton({ children, class_name }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={cn(
        "rounded-sm text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        class_name,
      )}
    >
      {children}
    </button>
  );
}
