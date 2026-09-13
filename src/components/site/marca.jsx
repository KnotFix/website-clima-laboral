import { cn } from "@/lib/utils";

/**
 * El signo de Censuma: la «c» naranja con el «+» adentro.
 *
 * Es el MISMO dibujo que el producto (`Front-End/src/components/marca.tsx`) y
 * que el favicon de los dos (`src/app/icon.svg` aca): mismas coordenadas en un
 * viewBox de 32×32, misma medida A1 elegida el 2026-09-13. Son tres copias en
 * dos repos porque no comparten build; si se cambia el trazo o el naranja, se
 * cambia en las tres.
 *
 * La «c» es naranja fijo en los dos temas; el «+» va en `currentColor`, asi
 * que toma la tinta del navbar (negro sobre claro, blanco sobre oscuro). El
 * tamano lo pone el llamador por clase (`size-6`, `size-8`).
 */
export const NARANJA_MARCA = "#bf400c";

export function Marca({ class_name }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("shrink-0", class_name)}
    >
      <path d="M23.71 6.81 A12 12 0 1 0 23.71 25.19" stroke={NARANJA_MARCA} />
      <path d="M12.5 16 H21.5 M17 11.5 V20.5" />
    </svg>
  );
}
