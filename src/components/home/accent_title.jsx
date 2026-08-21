import { cn } from "@/lib/utils";

/**
 * El `<h2>` de una seccion, con una o dos palabras en el color de acento.
 *
 * ## Por que existe, en vez de repetir el `map` cinco veces
 *
 * El sitio ya tenia dos titulares partidos en segmentos —el del hero
 * (`hero_title_segments`, con `tone: "muted"`) y el del problema
 * (`problem_title_segments`, con `tone: "brand"`)— pero cada uno resuelve su
 * propio dibujado porque cada uno hace algo mas: el del hero incrusta las fichas
 * de animo y de clima, y el del problema entra palabra por palabra con
 * `BlurTextPiece`. Los cinco titulares de seccion no hacen nada de eso: son
 * texto y un acento. Este componente es ESE caso, y no intenta absorber a los
 * otros dos — meterle las animaciones y las fichas lo convertiria en un
 * componente con tres modos, que es peor que tres componentes.
 *
 * ## El espacio va DENTRO del segmento
 *
 * Es la misma leccion que ya esta anotada en `problem.jsx`: el corte entre
 * palabras es de maquetado y no existe en el texto del DOM. Si el espacio se
 * dejara entre dos `<span>` hermanos sin escribirlo, `textContent` saldria con
 * las palabras pegadas y un lector de pantalla leeria "sistemaEl".
 *
 * ## El acento es del diccionario, no del componente
 *
 * Que palabra se acentua se decide en `es.js` / `en.js` con `tone: "brand"`.
 * Mover el acento de una palabra a otra es mover una bandera en el contenido,
 * sin tocar codigo — y en los dos idiomas por separado, porque la palabra que
 * carga la frase en espanol no es la misma que en ingles.
 *
 * **El acento vale para texto GRANDE.** Estos titulares son `text-3xl sm:text-4xl`,
 * asi que les alcanza 3:1 (AA large). No bajar este componente a cuerpo sin
 * volver a medir el contraste.
 */
export function AccentTitle({ segments, class_name }) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
        class_name,
      )}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          className={segment.tone === "brand" ? "text-brand" : undefined}
        >
          {segment.text}
          {index < segments.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}
