"use client";

import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion` devuelve null antes de resolverse en el cliente.
 * Este wrapper lo normaliza a boolean para poder usarlo en condicionales
 * sin provocar desajustes de hidratacion.
 */
export function useReducedMotionSafe() {
  return useReducedMotion() ?? false;
}
