"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** Resorte corto: la palabra entra firme y no rebota. */
const TRANSITION = { type: "spring", damping: 30, stiffness: 400 };

/** Retraso entre letra y letra. Muy chico: es un acento, no una animacion. */
const STAGGER = 0.025;

/**
 * La palabra y sus letras se animan con VARIANTES propias, no con objetos
 * `animate` sueltos.
 *
 * No es estilo: es obligatorio. Este componente vive dentro de `BlurText`, que
 * maneja su titular con variantes (`hidden`/`shown`), y motion propaga esas
 * etiquetas a **todos** los componentes de movimiento que tenga debajo. Las
 * letras, que no conocian esas etiquetas, se quedaban clavadas en su estado
 * inicial: invisibles y corridas 48px hacia abajo.
 *
 * Declarando etiquetas propias y poniendolas explicitamente en el envoltorio,
 * ese subarbol deja de heredar y pasa a mandarse solo.
 *
 * `staggerDirection: -1` arranca por la ultima letra, asi la palabra se arma
 * como una cortina que cae.
 */
const word_variants = {
  out: {},
  in: { transition: { staggerChildren: STAGGER, staggerDirection: -1 } },
  gone: { transition: { staggerChildren: STAGGER, staggerDirection: -1 } },
};

const letter_variants = {
  out: { y: "100%", opacity: 0 },
  in: { y: 0, opacity: 1, transition: TRANSITION },
  gone: { y: "-120%", opacity: 0, transition: TRANSITION },
};

/**
 * `Intl.Segmenter` parte por grafemas y no por unidades de codigo: una letra
 * con tilde cuenta como una sola pieza. Se crea UNA vez, no en cada render —
 * construirlo es de lo mas caro de la API de Intl.
 */
const segmenter =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function split_graphemes(text) {
  if (!segmenter) return Array.from(text);
  return Array.from(segmenter.segment(text), (piece) => piece.segment);
}

/**
 * Una palabra que se va reemplazando por otra, letra por letra.
 *
 * Las letras entran desde abajo y salen por arriba, y el contenedor las recorta
 * para que el recambio se lea como un rodillo y no como texto volando por
 * encima de los renglones vecinos. El `pb`/`-mb` compensa ese recorte: sin el,
 * la panza de la "g" de "organizacion" queda cortada.
 *
 * `layout` en el contenedor anima el cambio de ancho — las palabras no miden lo
 * mismo, y sin eso lo que sigue pegaria un salto en cada vuelta.
 */
export function RotatingText({ texts, interval = 2400, class_name }) {
  const reduced_motion = useReducedMotionSafe();
  const [index, set_index] = useState(0);

  useEffect(() => {
    if (reduced_motion || texts.length < 2) return;

    let timer;
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      timer = setInterval(
        () => set_index((current) => (current + 1) % texts.length),
        interval,
      );
    };

    // La rotacion se detiene con la pestana oculta. No es solo ahorro: los
    // temporizadores siguen corriendo en segundo plano pero las animaciones no,
    // asi que las palabras que salen se quedan sin terminar de salir y se
    // AMONTONAN — al volver a la pestana se ven varias encimadas.
    const on_visibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", on_visibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", on_visibility);
    };
  }, [reduced_motion, texts.length, interval]);

  const characters = useMemo(
    () => split_graphemes(texts[index]),
    [texts, index],
  );

  // Con menos movimiento se queda quieta en la primera. Una palabra que cambia
  // sola cada dos segundos, para siempre, es justo lo que no hay que imponer.
  if (reduced_motion) {
    return <span className={cn(class_name)}>{texts[0]}</span>;
  }

  return (
    <motion.span
      layout
      transition={TRANSITION}
      className={cn(
        "relative inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em]",
        class_name,
      )}
    >
      {/* La palabra para el lector de pantalla va una sola vez y aparte: el
          bloque animado esta partido en letras, y leido tal cual saldria
          deletreado. */}
      <span className="sr-only">{texts[index]}</span>

      {/* `popLayout` y no `wait`: con `wait` la palabra que sale tiene que
          terminar antes de que entre la siguiente, y en ese hueco el renglon se
          queda sin nada — el titular pegaba un salto en cada vuelta. Con
          `popLayout` la que sale se saca del flujo y la nueva ocupa su lugar de
          inmediato; el `layout` del contenedor anima el cambio de ancho. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-flex"
          variants={word_variants}
          initial="out"
          animate="in"
          exit="gone"
        >
          {characters.map((character, position) => (
            <motion.span
              key={position}
              className="inline-block"
              variants={letter_variants}
            >
              {character}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
