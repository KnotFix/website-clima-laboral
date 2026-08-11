"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 150, damping: 20, mass: 0.6 };

/** Inclinacion 3D siguiendo el mouse. Se apaga en touch y con movimiento reducido. */
export function Tilt({ children, tilt_strength = 8, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  // 0.5 / 0.5 es el centro: en reposo la pieza queda plana.
  const pointer_x = useMotionValue(0.5);
  const pointer_y = useMotionValue(0.5);

  const rotate_x = useSpring(
    useTransform(pointer_y, [0, 1], [tilt_strength, -tilt_strength]),
    SPRING,
  );
  const rotate_y = useSpring(
    useTransform(pointer_x, [0, 1], [-tilt_strength, tilt_strength]),
    SPRING,
  );

  function handle_pointer_move(event) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer_x.set((event.clientX - bounds.left) / bounds.width);
    pointer_y.set((event.clientY - bounds.top) / bounds.height);
  }

  function handle_pointer_leave() {
    pointer_x.set(0.5);
    pointer_y.set(0.5);
  }

  if (reduced_motion) {
    return <div className={cn(class_name)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(class_name)}
      onPointerMove={handle_pointer_move}
      onPointerLeave={handle_pointer_leave}
      style={{
        rotateX: rotate_x,
        rotateY: rotate_y,
        // La perspectiva va en la misma transform: sin esto la rotacion
        // se ve plana en vez de tridimensional.
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
