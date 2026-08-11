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
 * `unoptimized` sale del propio archivo. Los reemplazos de verdad van a ser
 * capturas en PNG o JPG y pasan por el optimizador como corresponde; los SVG de
 * relleno no pueden, porque el optimizador de Next los rechaza salvo que se
 * abra `dangerouslyAllowSVG` en la config, y eso no se toca por un placeholder.
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
          key={shown.src}
          className="absolute inset-0"
          initial={reduced_motion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={shown.src}
            alt={shown.alt}
            fill
            unoptimized={shown.src.endsWith(".svg")}
            className="object-cover"
            sizes="(min-width: 1024px) 30vw, 100vw"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
