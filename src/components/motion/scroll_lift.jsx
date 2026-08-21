"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { useRemeasure } from "@/components/motion/use_remeasure";
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
 * `ScrollZoom`, `ScrollPass` y `PinnedChapter`, y por las mismas dos razones:
 * esa version no siembra su valor inicial, y mide su target con el transform ya
 * aplicado.
 */
export function ScrollLift({
  children,
  lift = LIFT,
  span = SPAN,
  class_name,
  inner_class_name,
}) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  // Scroll al que arranca el destape.
  const [start, set_start] = useState(0);

  // Si la pagina entra en una pantalla, no hay destape. Ver mas abajo.
  const [scrollable, set_scrollable] = useState(true);

  // > **`useRemeasure` y no un `resize` a mano, y se cambió por un caso real.**
  // > Esto medía una sola vez al montar. Al hero le alcanzaba —está arriba de
  // > todo y su posición no se mueve cuando el contenido de abajo crece— pero el
  // > CTA final sí: `PinnedChapter` le pone el alto a su pista **desde
  // > JavaScript**, en un efecto, y son ~1500px que aparecen después del primer
  // > pintado y empujan hacia abajo todo lo que viene atrás.
  // >
  // > Con la medición vieja el tramo del CTA quedaba calculado 1500px más
  // > arriba: medido, al llegar al pie de la página la tapa se había levantado
  // > 3px de 120 y el footer no terminaba de aparecer nunca. `useRemeasure`
  // > existe exactamente para esto y además cubre el `resize` que esto ya hacía.
  useRemeasure(() => {
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

      // > **Y si la pagina no scrollea, no hay destape.** El margen negativo
      // > mete `lift` px de la seccion siguiente debajo de esta y es el
      // > movimiento el que despues los devuelve. En un documento que entra en
      // > una pantalla no hay recorrido que recorrer: el movimiento nunca corre
      // > y esos px quedan tapados **para siempre**, que es justo la perdida de
      // > contenido contra la que este componente ya se cuida con
      // > `prefers-reduced-motion`.
      // >
      // > **Se mide el scroll disponible y NO el alto del documento**, y la
      // > primera version lo hizo al reves. `body` es `min-h-screen`, asi que
      // > `scrollHeight` nunca baja del alto de la ventana: una pagina de tres
      // > renglones y una de una pantalla justa miden exactamente lo mismo, y la
      // > cuenta daba "si scrollea" en las dos. Medido: el pie de un legal corto
      // > quedaba con la marca y los dos primeros enlaces comidos.
      // >
      // > **Los dos umbrales son distintos a proposito.** Con uno solo esto
      // > oscila: el margen acorta el documento, apagarlo lo alarga, y una
      // > pagina que cae en el medio prende y apaga sin parar. Se apaga cuando
      // > no queda NADA de recorrido y se vuelve a prender recien cuando sobra
      // > mas de un `lift`; entre esos dos valores se queda como esta.
      const available = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      // El valor anterior sale de la forma funcional de `setState` y no de un
      // ref: escribir un ref durante el render esta prohibido, y ademas asi la
      // medicion no necesita saber nada del render.
      set_scrollable((was_scrollable) =>
        was_scrollable ? available > 0 : available > lift,
      );
    };

    measure();
  });

  // El destape se apaga entero en dos casos, y en los dos se apagan **las dos
  // mitades juntas**: el margen sin el movimiento esconde contenido.
  const still = reduced_motion || !scrollable;

  const y = useTransform(scrollY, [start, start + span], [0, -lift], {
    clamp: true,
  });

  return (
    // `z-10` para quedar por encima de la seccion siguiente, que en el flujo
    // viene despues y por defecto pintaria arriba. Sin esto no tapa nada.
    <div
      ref={container_ref}
      className={cn("relative z-10", class_name)}
      // Sin movimiento no hay margen negativo NI transform: las dos cosas se
      // apagan juntas o la seccion de abajo se queda debajo de esta sin nada que
      // la levante.
      style={still ? undefined : { marginBottom: -lift }}
    >
      {/* Dos divs: el de afuera se mide, el de adentro se mueve. Con el ref
          sobre el mismo elemento que se traslada, la medicion se retroalimenta
          y el recorrido nunca se asienta.

          `inner_class_name` existe para una sola cosa: **dejar pasar el
          `flex-1`**. Cuando esto envuelve al `<main>` de una pagina, entre el
          `<body>` —que es la columna flex— y el `<main>` quedan estos dos divs
          de bloque, y el `flex-1` se corta en el primero. Sin el, una pagina
          corta deja al pie flotando a media pantalla. */}
      <motion.div
        className={cn(inner_class_name)}
        style={still ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
