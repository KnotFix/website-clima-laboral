import { cn } from "@/lib/utils";

/**
 * Fondo de la seccion del problema: un degradado que hunde el centro.
 *
 * No es lo mismo que `GridBackdrop`, que es la reticula de puntos del hero y del
 * CTA final. Aca no hay reticula a proposito: las marcas de regla de las fichas
 * ya son la textura de la seccion, y dos tramas distintas compitiendo se pisan.
 *
 * > **Habia un resplandor morado detras de la pila y se retiro.** El morado es
 * > acento, no relleno: en esta seccion ya se lo gastan las dos palabras del
 * > remate del titular —"sigue igual."—, y un halo de 34rem detras de las fichas
 * > lo repetia en grande sin que dijera nada. De paso se fue un `blur-3xl` sobre
 * > una caja enorme, que era lo mas caro de pintar del bloque.
 */
export function StackBackdrop({ class_name }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        class_name,
      )}
    >
      {/* El degradado entra y sale en transparente: la seccion se apoya sobre
          el fondo de la pagina en los dos bordes y no se recorta contra las
          vecinas. */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-foreground/[0.035] to-transparent" />
    </div>
  );
}
