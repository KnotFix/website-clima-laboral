"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** Cuanto se queda cada imagen, en ms. */
const HOLD = 4200;

/** Lo que tarda el cruce entre una y la siguiente, en segundos. */
const FADE = 0.8;

/**
 * Una captura en sus dos temas, superpuestas, con la que no toca apagada.
 *
 * **El cambio de tema NO pasa por JavaScript.** Leer el tema con un hook obliga
 * a esperar a que el cliente monte —antes de eso no hay tema— y ahi la ficha
 * arranca con la captura equivocada y parpadea al corregirse. Con las dos en el
 * DOM y `dark:` decidiendo cual se ve, el navegador ya tiene puesta la clase
 * `.dark` en el `html` cuando pinta el primer frame: nunca se ve la otra.
 *
 * El precio es que se bajan las dos. Son capturas del panel, ~110 KB cada una y
 * `loading="lazy"` por defecto: no las pide hasta que la ficha se acerca.
 *
 * El `alt` va SOLO en una. Las dos son la misma pantalla —el tema no cambia lo
 * que muestra—, asi que anunciarla dos veces le repetiria la misma frase a quien
 * la escucha; la otra queda decorativa.
 *
 * Se exporta porque el hero la usa suelta, sin el ciclo: `sizes` cambia con el
 * ancho al que se pinta, y `fetch_priority` es para cuando la captura es la
 * candidata a LCP — nunca `preload`, que bajaria las dos.
 */
export function ThemedShot({
  shot,
  sizes = "(min-width: 1024px) 30vw, 100vw",
  fetch_priority,
}) {
  // `object-top` y no el centro: lo que cuenta de un panel esta arriba —el
  // titulo del bloque y el primer grafico—, y la ficha es mas ancha que alta,
  // asi que `cover` recorta justamente por abajo.
  const common = {
    fill: true,
    sizes,
    fetchPriority: fetch_priority,
  };
  const fit = "object-cover object-top";

  return (
    <>
      <Image
        {...common}
        src={shot.light}
        alt={shot.alt}
        className={cn(fit, "dark:hidden")}
      />
      <Image
        {...common}
        src={shot.dark}
        alt=""
        aria-hidden="true"
        className={cn(fit, "hidden dark:block")}
      />
    </>
  );
}

/**
 * Imagenes que se van pasando solas, cruzandose por opacidad.
 *
 * Es la unica animacion del sitio que corre por reloj junto con
 * `RotatingText`, y por eso se apaga entera con `prefers-reduced-motion`: algo
 * que se mueve solo, sin que el usuario haya hecho nada, es exactamente lo que
 * esa preferencia pide que no pase. Apagada muestra la primera y se queda ahi.
 *
 * Cruza con opacidad y una escala minima, nunca con `left` ni `width`: las dos
 * imagenes estan superpuestas en la misma caja y el navegador solo compone.
 *
 * Cada ficha del array trae la captura en sus dos temas —`light` y `dark`—
 * porque son capturas de un producto que tiene los dos: la clara sobre el sitio
 * en oscuro es un rectangulo blanco que encandila, y al reves la oscura se
 * recorta como un agujero. Ver `ThemedShot`.
 */
export function ImageCycle({ shots, class_name }) {
  const reduced_motion = useReducedMotionSafe();
  const [index, set_index] = useState(0);

  useEffect(() => {
    if (reduced_motion || shots.length < 2) return;

    const timer = setInterval(() => {
      set_index((current) => (current + 1) % shots.length);
    }, HOLD);

    return () => clearInterval(timer);
  }, [reduced_motion, shots.length]);

  const shown = reduced_motion ? shots[0] : shots[index];

  return (
    <div className={cn("relative overflow-hidden", class_name)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={shown.light}
          className="absolute inset-0"
          initial={reduced_motion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE, ease: [0.16, 1, 0.3, 1] }}
        >
          <ThemedShot shot={shown} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
