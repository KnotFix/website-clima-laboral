import { cn } from "@/lib/utils";

/**
 * El ancho maximo del sitio vive UNICAMENTE aca (--container-max: 1200px).
 * Ninguna seccion define su propio max-w.
 */
export function Container({ children, class_name }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-6 md:px-8",
        class_name,
      )}
    >
      {children}
    </div>
  );
}
