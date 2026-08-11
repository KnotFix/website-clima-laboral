"use client";

import { motion, useTransform } from "motion/react";

import { useChapter } from "@/components/motion/pinned_chapter";
import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * El escalon entre ficha y ficha, en px. **Es lo que se ve de las de abajo una
 * vez apiladas**: sin el, la ultima taparia a todas y la pila no se leeria como
 * pila.
 */
const STEP_Y = 16;

/** Desde cuantos px mas abajo entra cada ficha. */
const ENTER_DROP = 220;

/**
 * Que fraccion de su turno tarda una ficha en llegar. Menos de 1 deja un
 * respiro entre que una se acomoda y arranca la siguiente; con 1 la pila se
 * arma sin pausa y las tres se leen como una sola cosa que crece.
 */
const SLOT_FILL = 0.85;

/**
 * La pila de fichas del problema.
 *
 * > **Esto era CSS `sticky` puro y ahora va atado al avance del capitulo.** El
 * > cambio no fue por gusto: adentro de un bloque clavado la pagina no se mueve
 * > en vertical, y `position: sticky` se pega contra un scroll que ahi no
 * > existe. Con la version vieja las tres fichas aparecian juntas y quietas.
 * >
 * > Lo que se perdio: el navegador resolvia el apilado solo, en el compositor,
 * > sin un frame de JavaScript por movimiento. Ahora hay un `useTransform` por
 * > ficha. Se paga porque el apilado es el contenido de la fase 1 del capitulo,
 * > y sin el la diapositiva no tiene nada que contar mientras se scrollea.
 * >
 * > Lo que se gano: el reposo de cada ficha es un numero y no el resultado de
 * > una negociacion del navegador. La advertencia vieja —que un `margin-bottom`
 * > le recortaba el recorrido al pegado, medido al pixel— dejo de aplicar,
 * > porque ya no hay pegado.
 *
 * Sin capitulo clavado —telefono, pantalla baja, movimiento reducido— no se
 * apila nada: las fichas van una debajo de otra y se leen scrolleando. Apilar
 * tres tarjetas que nadie puede desapilar seria esconder contenido.
 */
export function CardsStack({ children, class_name }) {
  const { is_pinned } = useChapter();
  const count = Array.isArray(children) ? children.length : 1;

  if (!is_pinned) {
    return (
      <div className={cn("flex flex-col gap-6", class_name)}>{children}</div>
    );
  }

  return (
    // El `grid` con todas las fichas en la MISMA celda es lo que las superpone
    // sin sacarlas del flujo: la celda mide lo que la mas alta, asi que el
    // bloque no depende de medir nada. El `padding` de abajo es el espacio que
    // el escalon de la ultima se lleva — un `translate` no ocupa alto.
    <div
      className={cn("grid", class_name)}
      style={{ paddingBottom: (count - 1) * STEP_Y }}
    >
      {children}
    </div>
  );
}

/**
 * Una ficha de la pila. Llega desde abajo y se acomoda en su escalon.
 *
 * `index` decide dos cosas: el turno dentro de la fase 1 y el escalon de
 * reposo. El orden de pintado sale del DOM —la ultima va arriba— y por eso no
 * hay `z-index` en ninguna.
 */
export function StackCard({ children, index, count, class_name }) {
  const { is_pinned, stack_progress } = useChapter();
  const reduced_motion = useReducedMotionSafe();

  const rest = index * STEP_Y;
  const slot = 1 / count;
  const from = index * slot;
  const to = from + slot * SLOT_FILL;

  // Los hooks no pueden ser condicionales: los dos valores se arman siempre y
  // lo que se decide despues es si se usan.
  const y = useTransform(
    stack_progress,
    [from, to],
    [rest + ENTER_DROP, rest],
    { clamp: true },
  );
  const opacity = useTransform(stack_progress, [from, to], [0, 1], {
    clamp: true,
  });

  if (!is_pinned || reduced_motion) {
    return <div className={cn(class_name)}>{children}</div>;
  }

  return (
    <motion.div
      // Todas en la misma celda del grid: es lo que las hace pila.
      className={cn("col-start-1 row-start-1", class_name)}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
}
