"use client";

import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Tramo de scroll, en px de documento, sobre el que `depth` se recorre entero.
 *
 * Es el alto aproximado del hero: pasado ese punto la pieza ya salio de la
 * pantalla, asi que seguir moviendola seria trabajo que nadie ve. Con `clamp`
 * se queda quieta en su ultimo valor.
 */
const FLOAT_RANGE = 900;

/**
 * Desplaza su contenido hacia arriba con el scroll, `depth` px a lo largo de
 * `FLOAT_RANGE`.
 *
 * Es el parallax por capas: varias piezas encima de un mismo plano, cada una
 * con su `depth`, se separan entre si al scrollear y el plano se lee con
 * volumen. Mas `depth` = mas cerca del ojo = se mueve mas.
 *
 * Funcion pura de `scrollY` y no de la posicion del elemento: las piezas viven
 * adentro de un `ScrollZoom` que ya escala y endereza el conjunto, y medir algo
 * que se esta transformando arma el mismo lazo que ese componente evita.
 */
export function ScrollFloat({ children, depth = 0, class_name }) {
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, FLOAT_RANGE], [0, -depth], {
    clamp: true,
  });

  return (
    <motion.div
      className={cn(class_name)}
      style={reduced_motion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
