import { cn } from "@/lib/utils";

/**
 * Fondo decorativo: retícula de puntos muy tenue, desvanecida a los bordes por
 * una máscara radial, más un resplandor de marca bajo. Sin JS y sin animación.
 *
 * **Las dos capas están APAGADAS en los dos temas.** En claro ya lo estaban: el
 * CTA recibe el extremo cálido de la atmósfera y una retícula encima sería una
 * segunda textura peleando con las manchas. En oscuro se apagaron para que el
 * fondo quede parejo — el CTA era la última sección que se leía más clara que
 * "Una medición", que es la referencia del fondo oscuro. El porqué completo
 * vive en `--band`, bloque `.dark` de `globals.css`.
 *
 * Se neutraliza por tema en vez de borrar el componente, igual que `--band`: el
 * archivo queda entero y devolverlo es cambiar un `hidden` por su
 * `dark:opacity-[…]`.
 *
 * **`hidden` y no `opacity-0`**, y en el resplandor la diferencia se paga: es un
 * `blur-3xl` sobre una caja de 52rem × 32rem, y a opacidad 0 el navegador
 * compone ese blur igual para no mostrar nada. La retícula va a `hidden` por
 * coherencia con él.
 *
 * `show_glow` apaga el resplandor aparte, para un consumidor que quiera solo la
 * retícula. Hoy el único consumidor es `FinalCta` y lo deja encendido — mientras
 * las capas sigan apagadas, el prop no cambia nada de lo que se ve.
 */
export function GridBackdrop({ class_name, show_glow = true }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", class_name)}
    >
      <div
        className="absolute inset-0 hidden"
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
          className="absolute left-1/2 top-[-12rem] hidden h-[32rem] w-[52rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "var(--brand)" }}
        />
      )}
    </div>
  );
}
