"use client";

import { MoodFace, WeatherTile } from "@/components/home/cycling_tile";
import { WordPullUp, WordPullUpPiece } from "@/components/motion/word_pull_up";

/**
 * El titular del hero, entrando palabra por palabra.
 *
 * Existe como componente aparte para que `hero.jsx` siga siendo Server
 * Component: la animacion necesita cliente, y marcando el hero entero se
 * irian tambien al bundle el Container, el fondo y los CTA, que no lo
 * necesitan.
 *
 * El titular es flex y no un parrafo corrido: las fichas tienen que alinearse
 * con la altura de las mayusculas, y como texto en linea quedarian colgadas de
 * la linea base. Cada pieza es un item, asi que el salto de linea cae entre
 * palabras y nunca parte una. El peso lo pone cada pieza (600 las negras, 400
 * las grises), no el h1.
 *
 * La medida es mas angosta que el bloque: a lo ancho del contenedor las lineas
 * se hacen tan largas que el ojo pierde el renglon. El wrap lo decide este
 * max-w, no el tamano de letra. Y seis palabras largas mas dos fichas no
 * entran en dos lineas a text-7xl: el tamano es lo que cede, no el copy, que
 * un titular de tres lineas empuja los CTA fuera de la primera pantalla.
 */
export function HeroTitle({ dict }) {
  return (
    // Sin `gap-x`: la separacion entre palabras es un espacio duro dentro de
    // cada pieza (`trailing_space`). Un `gap` deja el hueco en el layout pero no
    // en el texto, y el titular sale pegado al leerlo o copiarlo. `gap-y` se
    // queda: eso separa renglones, no palabras.
    // `max-w-5xl` y no `4xl`: el espacio real es un poco mas ancho que el
    // `gap-x` de antes, y con la medida vieja la ficha del clima se pasaba al
    // arranque de la tercera linea. Con esta vuelve al final de la segunda, que
    // es donde tiene que estar — incrustada en la frase, no encabezando.
    <WordPullUp class_name="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-y-1 text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
      {dict.hero_title_segments.map((segment, index) => {
        const trailing_space = index < dict.hero_title_segments.length - 1;

        if (segment.face)
          return (
            <WordPullUpPiece key={index} trailing_space={trailing_space}>
              <MoodFace dict={dict} />
            </WordPullUpPiece>
          );

        if (segment.weather)
          return (
            <WordPullUpPiece key={index} trailing_space={trailing_space}>
              <WeatherTile dict={dict} />
            </WordPullUpPiece>
          );

        return (
          <WordPullUpPiece
            key={index}
            trailing_space={trailing_space}
            class_name={
              segment.tone === "muted"
                ? "font-normal text-hero-title-muted"
                : "font-semibold"
            }
          >
            {segment.text}
          </WordPullUpPiece>
        );
      })}
    </WordPullUp>
  );
}
