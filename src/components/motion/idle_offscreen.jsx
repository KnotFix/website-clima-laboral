"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Apaga las animaciones de CSS que tiene adentro mientras el bloque no se ve.
 *
 * ## Por que hace falta
 *
 * La regla del proyecto es animar solo `transform` y `opacity`, y hay dos
 * excepciones vivas: el destello de la espiral del hero (`stroke-dashoffset`) y
 * el punteado que corre por el organigrama (`background-position`). Las dos
 * estan anotadas donde viven y las dos tienen el mismo argumento a favor:
 * repintan un trazo chiquito y no recalculan layout.
 *
 * El argumento era incompleto, y medirlo lo mostro. **Un repintado no cuesta lo
 * que ocupa: cuesta la capa entera que lo contiene.** Las dos figuras viven en
 * la capa raiz, asi que cada cuadro que le cambia un pixel al punteado obliga al
 * navegador a volver a grabar la lista de dibujo de **toda la pagina**. En un
 * recorrido completo de la home, en un telefono de gama media:
 *
 * | | antes | despues |
 * |---|---|---|
 * | `Paint` | 13.5 s en 111.248 veces | 2.5 s en 22.183 |
 * | `PaintImage` | 1.6 s en 91.866 | 0.005 s en 117 |
 * | repintados de `#document` | uno por cuadro, siempre | menos de la mitad |
 *
 * O sea: **cinco repintados por cuadro que seguian corriendo con el
 * organigrama a nueve mil pixeles de la pantalla**, porque una animacion de CSS
 * no se entera de que nadie la mira. El costo no estaba en la figura; estaba en
 * que la figura no paraba nunca.
 *
 * ## Por que `animation-play-state` y no apagarlas
 *
 * Porque no son un adorno de mas: son lo que hace que la espiral se lea como
 * una linea viva y el organigrama como un sistema conectado. Pausada, una
 * animacion retoma donde quedo, asi que volver a entrar no produce ningun
 * salto: es exactamente lo mismo que se ve hoy, menos lo que nadie estaba
 * viendo.
 *
 * ## Por que un envoltorio y no un hook
 *
 * Porque las dos figuras cuelgan de componentes de servidor (`GoldenBackdrop`
 * va dentro de `Hero`), y un hook obligaria a volver cliente a la seccion
 * entera para mover un atributo. El envoltorio es la unica pieza que se
 * hidrata.
 *
 * El `data-idle` que pone no lo lee este archivo: lo leen las reglas de
 * `globals.css` que estan al lado de cada `@keyframes`. Buscarlo ahi.
 */
export function IdleOffscreen({ children, class_name }) {
  const box_ref = useRef(null);
  // Mismo margen que usa el globo para pausar su bucle: la animacion vuelve a
  // andar una pantalla antes de asomar, asi nunca se la ve arrancar.
  const in_view = useInView(box_ref, { margin: MARGIN });

  return (
    <div
      ref={box_ref}
      data-idle={in_view ? undefined : "true"}
      className={cn(class_name)}
    >
      {children}
    </div>
  );
}

/** Cuanto antes de entrar en pantalla se despierta el bloque. */
const MARGIN = "200px";
