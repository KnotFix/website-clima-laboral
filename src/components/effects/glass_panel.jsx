import { cn } from "@/lib/utils";

/** Superficie translucida, coherente con la isla del navbar. */
export function GlassPanel({ children, class_name }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-lg backdrop-blur-xl",
        class_name,
      )}
    >
      {children}
    </div>
  );
}
