import { cn } from "@/lib/utils";

/**
 * Fondo de la seccion del problema: un degradado que hunde el centro.
 *
 * **Hoy no pinta en ningun tema** — ver el comentario de la capa, abajo. El
 * componente se queda montado y neutralizado, igual que `--band`.
 *
 * No es lo mismo que `GridBackdrop`, que es la reticula de puntos del hero y del
 * CTA final. Aca no hay reticula a proposito: las marcas de regla de las fichas
 * ya son la textura de la seccion, y dos tramas distintas compitiendo se pisan.
 *
 * > **Habia un resplandor de marca detras de la pila y se retiro.** El acento es
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
          vecinas.
          **El paso del medio tambien es transparente en los dos temas, o sea
          que esta capa ya no dibuja nada.** En claro siempre fue asi: ahi las
          secciones son blanco liso y ninguna lleva fondo propio. En oscuro
          estaba en `dark:via-foreground/[0.035]`, y eso hundia el centro del
          problema justo al lado de "Una medicion" — que es la referencia del
          fondo oscuro y va pegada a esta en el MISMO capitulo, asi que el
          escalon caia en una juntura que se cruza sin transicion. Es la misma
          decision que apaga `--band`, `--glow` y `.planet-backdrop`. */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-transparent" />
    </div>
  );
}
