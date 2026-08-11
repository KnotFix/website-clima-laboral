"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { useRemeasure } from "@/components/motion/use_remeasure";
import { cn } from "@/lib/utils";

/** Recorrido vertical por defecto, en px: sube esto y entra desde mas lejos. */
const DRIFT = 90;

/**
 * Tramos del cruce, en fracciones de lo que tarda el elemento en atravesar la
 * pantalla entera. 0 = asoma por abajo; 1 = se fue por arriba. Entre `IN_DONE`
 * y `OUT_START` esta a pleno.
 */
const IN_DONE = 0.35;
const OUT_START = 0.68;

/**
 * El ajuste de un titular de seccion, en un solo lugar.
 *
 * **Todos los titulares del sitio entran y salen con el scroll**, no con un
 * disparo al cruzar el viewport. La diferencia se nota volviendo para arriba:
 * `Reveal` deja el titulo puesto para siempre despues de la primera vez, y esto
 * lo devuelve por donde vino. La pagina se lee igual en los dos sentidos.
 *
 * Los tres numeros son mas cerrados que los de `ScrollPass` a secas. El
 * recorrido va corto —60px contra 90— porque un titulo que se desplaza mucho
 * compite con el cuerpo que tiene debajo, y los dos hitos se abren temprano y
 * cierran tarde para que **nunca haya un titulo atenuado que alguien este
 * leyendo**: llega a pleno apenas termina de entrar y no empieza a irse hasta
 * que ya cruzo el borde de arriba.
 *
 * Va como constante y no como valores por defecto porque `ScrollPass` tambien
 * envuelve cosas que no son titulares —el planeta, por ejemplo— y ahi el tramo
 * largo es justo lo que se quiere.
 */
export const HEADING_PASS = { drift: 60, fade_in: 0.18, fade_out: 0.82 };

/**
 * Entrada y salida atadas al scroll: el contenido sube y aparece mientras entra
 * a la pantalla, se queda a pleno en el medio, y sigue subiendo mientras se va.
 *
 * Es distinto de `Reveal`, que dispara una vez al cruzar el viewport y ahi
 * queda. Aca **no hay disparo**: la posicion y la opacidad son funcion pura del
 * scroll, asi que volver hacia arriba deshace el efecto igual que bajar lo
 * hizo. El mismo scroll da siempre el mismo fotograma.
 *
 * El tramo se mide contra `scrollY` crudo y no con `useScroll({ target })`: esa
 * version se apoya en un ScrollTimeline del navegador que no siembra su valor
 * inicial y lo repisa en cada frame.
 *
 * `fill_height` es para cuando esto envuelve una ficha de una reja: el div de
 * afuera es la celda y se estira solo, pero el de adentro no, asi que un
 * `h-full` del hijo se quedaria sin contra quien medir y las fichas de una
 * misma fila dejarian de igualarse.
 *
 * `fade_in` y `fade_out` corren los dos hitos de la opacidad. Se abren porque
 * el ancho del tramo tiene que salir de lo que se envuelve: una pieza sola en
 * el medio de la pantalla puede darse el lujo de aparecer despacio, pero una
 * reja de texto no — ahi el tramo largo deja una fila entera translucida
 * mientras alguien la esta leyendo.
 */
export function ScrollPass({
  children,
  drift = DRIFT,
  fill_height = false,
  fade_in = IN_DONE,
  fade_out = OUT_START,
  class_name,
}) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  // Cuatro hitos: asoma, ya entro, empieza a irse, se fue.
  const [span, set_span] = useState([0, 1, 2, 3]);

  useRemeasure(() => {
    const element = container_ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const top_in_document = rect.top + window.scrollY;
    const viewport = window.innerHeight;

    const enter = top_in_document - viewport;
    const travel = rect.height + viewport;

    set_span([
      enter,
      enter + travel * fade_in,
      enter + travel * fade_out,
      enter + travel,
    ]);
  });

  const opacity = useTransform(scrollY, span, [0, 1, 1, 0], { clamp: true });
  const y = useTransform(scrollY, [span[0], span[3]], [drift, -drift], {
    clamp: true,
  });

  return (
    // Dos divs: el de afuera se mide, el de adentro se transforma. `y` sobre el
    // mismo elemento que medimos armaria un lazo — se mueve, se mide corrido, se
    // mueve mas — y el recorrido nunca se asentaria.
    <div ref={container_ref} className={cn(fill_height && "h-full", class_name)}>
      <motion.div
        className={cn(fill_height && "h-full")}
        // Con menos movimiento se entrega quieto y visible. Un elemento que
        // aparece y desaparece con el scroll es justo lo que hay que no hacer.
        style={reduced_motion ? undefined : { opacity, y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
