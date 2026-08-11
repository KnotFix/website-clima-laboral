import { cn } from "@/lib/utils";

/** Separacion entre marca y marca, en px. */
const TICK_STEP = 8;

/** Cuanto baja cada marca desde la linea, en px. */
const TICK_LENGTH = 4;

/**
 * Cada cuanto va una marca larga. Es lo que hace que se lea como regla y no
 * como una linea punteada: sin el ritmo de cuatro en cuatro, todas las marcas
 * miden lo mismo y no hay escala que leer.
 */
const MAJOR_STEP = TICK_STEP * 4;

/** Cuanto baja la marca larga, en px. */
const MAJOR_LENGTH = 8;

/**
 * Regla: una linea con marcas colgando, como la de una cota de plano.
 *
 * Delimita el contenido de una ficha sin meter otra caja adentro de la caja. El
 * tono es el del borde, asi que se lee como estructura y no como decoracion, y
 * anda igual en claro y en oscuro sin tocar nada.
 *
 * Las marcas son un `repeating-linear-gradient` y no elementos: treinta y pico
 * de `<span>` por ficha para dibujar rayitas de un pixel es pedirle al navegador
 * que arme un layout entero que despues nadie lee.
 */
export function RulerMarks({ class_name }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-2 w-full border-t border-border", class_name)}
      style={{
        backgroundImage: [
          `repeating-linear-gradient(to right, var(--border) 0 1px, transparent 1px ${TICK_STEP}px)`,
          `repeating-linear-gradient(to right, var(--border) 0 1px, transparent 1px ${MAJOR_STEP}px)`,
        ].join(", "),
        // Las marcas cuelgan de la linea de arriba: el gradiente no se repite en
        // vertical, se recorta a lo que mide la marca y se ancla al tope.
        backgroundSize: `100% ${TICK_LENGTH}px, 100% ${MAJOR_LENGTH}px`,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "top, top",
      }}
    />
  );
}
