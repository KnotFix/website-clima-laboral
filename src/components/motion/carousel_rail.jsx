"use client";

import { motion } from "motion/react";

import { ChartLine } from "@/components/effects/chart_line";
import { useChapter } from "@/components/motion/pinned_chapter";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/**
 * El riel de fichas de la medicion, con el grafico corriendo por detras.
 *
 * **Ya no clava nada ni mide nada.** El clavado, el recorrido y la geometria del
 * grafico son del capitulo: esto es la capa que se mueve. Antes esto era
 * `CarouselTrack` y hacia las dos cosas; separarlas fue lo que permitio que el
 * paneo y el riel salgan del mismo avance sin pelearse.
 *
 * **El parallax de la seccion es horizontal.** El scroll vertical no mueve nada
 * hacia arriba: mueve el riel hacia la izquierda, y el grafico atras a poco mas
 * de la mitad de esa velocidad. La diferencia entre las dos velocidades es lo
 * unico que produce la profundidad; con un solo valor esto seria una imagen que
 * se desliza.
 *
 * > **Sin capitulo el riel se recorre a mano.** En telefono, con movimiento
 * > reducido, o si las fichas ya entran en pantalla, no hay nada pegado y el
 * > bloque pasa a ser un `overflow-x-auto` con snap: el mismo contenido,
 * > manejado por quien lo lee. Tomarle el scroll a alguien que pidio menos
 * > movimiento es exactamente lo que esa preferencia pide que no pase.
 */
export function CarouselRail({ children, rail_label }) {
  const { is_pinned, rail_x, chart_x, reveal, chart_width, plot_ratio, rail_ref } =
    useChapter();

  return (
    <>
      {/* > **El grafico es una capa de la DIAPOSITIVA ENTERA, no de la banda del
          riel.** Las dos cosas que lo obligan:
          - **En x**: tiene que empezar en `x = 0` de la diapo, porque ese pixel
            es la juntura con la linea de la seccion anterior. Metido adentro del
            `Container` arrancaria ~390px a la derecha.
          - **En y**: `SEAM_Y` esta en por mil del alto, y para que caiga en el
            mismo pixel que la salida de la pila las dos cajas tienen que medir
            lo mismo. Estuvo un rato colgando de la banda del riel —612px contra
            los 945 de la diapo— y la juntura quedaba 7px corrida: poco, pero
            sobre un trazo de 2px es un codo que se ve.

          `inset-y-0` se resuelve contra `ChapterSlide`, que es `relative`. Por
          eso esto va suelto en un fragmento y no adentro de la banda. Las fichas
          si respetan el margen del contenedor — son contenido, no fondo. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: is_pinned ? chart_width : "100%",
          x: is_pinned ? chart_x : undefined,
        }}
      >
        <ChartLine
          reveal={reveal}
          plot_ratio={plot_ratio}
          chart_width={chart_width}
        />
      </motion.div>

      <div
        className={cn(
          "relative",
          is_pinned
            ? "min-h-0 flex-1"
            : "overflow-x-auto overscroll-x-contain scroll-pl-6 md:scroll-pl-8",
        )}
        // Un contenedor que se scrollea tiene que poder recibir el foco para
        // recorrerse con el teclado. Clavado no hace falta: ahi lo mueve el
        // scroll de la pagina, que ya es del teclado.
        {...(is_pinned
          ? {}
          : { tabIndex: 0, role: "group", "aria-label": rail_label })}
      >
        <Container class_name={cn("relative", is_pinned ? "h-full" : "py-4")}>
          {/* `w-max` lo hace medir exactamente lo que mide el riel, y de ahi
              sale el recorrido. Se desborda del `Container` hacia la derecha a
              proposito: lo recorta la ventana clavada del capitulo. */}
          <motion.div
            ref={rail_ref}
            className={cn(
              "flex w-max items-stretch gap-5 pe-6 md:pe-8",
              is_pinned && "h-full items-center",
            )}
            style={is_pinned ? { x: rail_x } : undefined}
          >
            {children}
          </motion.div>
        </Container>
      </div>
    </>
  );
}
