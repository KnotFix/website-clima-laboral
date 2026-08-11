"use client";

import { motion } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** Entrada fade + subida al entrar al viewport, una sola vez. */
export function Reveal({ children, reveal_delay = 0, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  if (reduced_motion) {
    return <div className={cn(class_name)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(class_name)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      // "some" y no una fraccion: un bloque mas alto que la ventana nunca
      // llega a mostrar un 25% de si mismo, y se quedaria invisible para
      // siempre en pantallas bajas.
      viewport={{ once: true, amount: "some" }}
      transition={{
        duration: 0.55,
        delay: reveal_delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
