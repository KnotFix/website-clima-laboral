"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** Recorrido total en px por unidad de scroll_speed. */
const TRAVEL = 120;

/**
 * Desplaza su contenido mientras el elemento cruza el viewport.
 * scroll_speed 0 = quieto; mas alto = mas recorrido.
 *
 * Se mide contra `scrollY` crudo y no con `useScroll({ target })`, igual que
 * `ScrollZoom`, `ScrollPass` y `PinnedChapter`. Esa version tiene dos
 * problemas: se apoya en un ScrollTimeline del navegador que no siembra su
 * valor inicial, y mide su target con `getBoundingClientRect()`, que devuelve
 * el rectangulo **con el transform ya aplicado** — o sea que el elemento se
 * movia, se media corrido, y se movia distinto.
 */
export function Parallax({ children, scroll_speed = 0.2, class_name }) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  // Tramo de scroll, en px de documento, durante el que el elemento se mueve.
  const [span, set_span] = useState([0, 1]);

  useEffect(() => {
    const measure = () => {
      const element = container_ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const top_in_document = rect.top + window.scrollY;
      const viewport = window.innerHeight;

      // Todo el cruce: desde que asoma por el pie de la ventana hasta que sale
      // por arriba. Es el equivalente del offset ["start end", "end start"].
      const enter = top_in_document - viewport;
      const exit = top_in_document + rect.height;

      set_span([enter, Math.max(enter + 1, exit)]);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const y = useTransform(
    scrollY,
    span,
    [scroll_speed * TRAVEL, scroll_speed * -TRAVEL],
    { clamp: true },
  );

  return (
    // Dos divs: el de afuera se mide, el de adentro se transforma. Con el ref
    // sobre el mismo elemento que se traslada, la medicion se retroalimenta.
    //
    // `class_name` va en el de ADENTRO, que es el que envuelve a los hijos y
    // donde estaba antes de partir el componente en dos. Quien lo usa manda
    // layout para los hijos (`flex flex-col gap-4`): puesto afuera, el
    // contenedor pasaria a tener un solo hijo y el `gap` no separaria nada.
    <div ref={container_ref}>
      <motion.div
        className={cn(class_name)}
        style={reduced_motion ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
