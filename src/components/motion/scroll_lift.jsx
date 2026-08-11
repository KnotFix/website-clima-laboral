"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** Cuanto se levanta de mas, en px. Es exactamente cuanto tapa al principio. */
const LIFT = 320;

/** Scroll que dura el destape, en px. Mas largo = mas suave. */
const SPAN = 640;

/**
 * Tapa que se levanta y descubre lo que viene detras.
 *
 * Lo que envuelve queda **encima** de la seccion siguiente y se la come: el
 * `margin-bottom` negativo mete los primeros `lift` px de la que sigue debajo
 * de esta, donde no se ven. Despues, mientras se scrollea, este bloque se
 * levanta esos mismos `lift` px de mas, y lo que estaba tapado va apareciendo
 * por el borde de abajo.
 *
 * El margen y el movimiento son **la misma decision** y por eso los escribe el
 * mismo componente: el margen sin el movimiento deja la seccion de abajo tapada
 * para siempre, que es perder contenido.
 *
 * Al terminar el recorrido el bloque queda levantado justo `lift`, o sea que su
 * borde de abajo cae exactamente donde arranca la seccion siguiente: el estado
 * final es **identico al que habria sin nada de esto**. El solape existe
 * solamente durante el destape.
 *
 * > El de abajo se mueve a velocidad de scroll y este a `1 + lift/span`. Que la
 * > diferencia sea chica es lo que lo hace leer como una tapa que se levanta y
 * > no como un bloque que sale despedido: con `span` igual a `lift` iria al
 * > doble de velocidad y se veria un tiron.
 *
 * Se mide contra `scrollY` crudo y no con `useScroll({ target })`, igual que
 * `Parallax` y `ScrollPass`, y por las mismas dos razones: esa version no
 * siembra su valor inicial, y mide su target con el transform ya aplicado.
 */
export function ScrollLift({ children, lift = LIFT, span = SPAN, class_name }) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  // Scroll al que arranca el destape.
  const [start, set_start] = useState(0);

  useEffect(() => {
    const measure = () => {
      const element = container_ref.current;
      if (!element) return;

      // Arranca cuando el borde de abajo del bloque llega al pie de la ventana:
      // antes de eso, lo que esta tapado esta fuera de pantalla igual y no hay
      // nada que descubrir.
      //
      // El `margin-bottom` negativo no entra en `getBoundingClientRect()` —
      // mide la caja de borde, no la de margen— asi que no se mide a si mismo.
      //
      // El piso en 0 es para la ventana mas alta que el bloque: ahi la cuenta da
      // negativo, o sea que el destape ya habria empezado antes del scroll 0, y
      // la pagina cargaria con el bloque levantado sin que nadie lo haya
      // movido. Con el piso arranca al primer scroll, que es lo unico que se
      // puede hacer cuando no hay lugar para esperar.
      const rect = element.getBoundingClientRect();
      set_start(Math.max(0, rect.bottom + window.scrollY - window.innerHeight));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const y = useTransform(scrollY, [start, start + span], [0, -lift], {
    clamp: true,
  });

  return (
    // `z-10` para quedar por encima de la seccion siguiente, que en el flujo
    // viene despues y por defecto pintaria arriba. Sin esto no tapa nada.
    <div
      ref={container_ref}
      className={cn("relative z-10", class_name)}
      // Con menos movimiento no hay margen negativo NI transform: las dos cosas
      // se apagan juntas o la seccion de abajo se queda debajo de esta sin nada
      // que la levante.
      style={reduced_motion ? undefined : { marginBottom: -lift }}
    >
      {/* Dos divs: el de afuera se mide, el de adentro se mueve. Con el ref
          sobre el mismo elemento que se traslada, la medicion se retroalimenta
          y el recorrido nunca se asienta. */}
      <motion.div style={reduced_motion ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
