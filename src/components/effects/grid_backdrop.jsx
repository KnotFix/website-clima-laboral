import { cn } from "@/lib/utils";

/**
 * Fondo decorativo: retícula de puntos muy tenue, desvanecida a los bordes por
 * una máscara radial, más un resplandor morado bajo. Sin JS y sin animación.
 *
 * `show_glow` apaga el resplandor. En el hero se apaga: ahí la luz la ponen los
 * destellos blancos de `.page-light`, y el morado sobre el fondo hueso ensucia
 * la esquina justo donde nace la luz. En el CTA final sigue encendido.
 */
export function GridBackdrop({ class_name, show_glow = true }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", class_name)}
    >
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />
      {show_glow && (
        <div
          className="absolute left-1/2 top-[-12rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full opacity-[0.10] blur-3xl dark:opacity-[0.18]"
          style={{ background: "var(--brand)" }}
        />
      )}
    </div>
  );
}
