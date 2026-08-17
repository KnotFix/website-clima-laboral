"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Seda: una tela que ondula, dibujada en canvas. Es el fondo del hero.
 *
 * El patron es el del componente original, formula por formula — el pliegue
 * (`tex_y`), la trama (`pattern`) y el barrido del tiempo son los mismos. Lo
 * que cambio es COMO se dibuja, porque tal como venia no era publicable:
 *
 * - **Se dibuja chico y se agranda.** El original recorria la ventana entera,
 *   medio millon de pixeles por cuadro con seis senos cada uno. Pero la trama
 *   es de baja frecuencia —seis a trece ondas de lado a lado— asi que no hay
 *   nada que perder: se pintan ~45.000 pixeles y el navegador los estira. La
 *   interpolacion sale gratis, la trigonometria no.
 * - **El buffer se reusa.** El original hacia un `createImageData` nuevo en cada
 *   cuadro: a pantalla completa son 8 MB por cuadro tirados al recolector de
 *   basura, sesenta veces por segundo.
 * - **Va a 24 cuadros por segundo**, no a 60. La tela se mueve despacio; el
 *   ojo no distingue, y son dos tercios menos de trabajo. El avance igual se
 *   calcula con el tiempo real, asi que la seda fluye a la misma velocidad en
 *   cualquier monitor.
 * - **Sin el ruido del original.** Ese `noise()` era grano, y el grano de este
 *   sitio ya existe y es uno solo: `.page-grain`, sobre TODA la pagina. Dos
 *   granos con dos tamaños distintos se notan enseguida — el hero tendria una
 *   textura que el resto de la pagina no tiene.
 * - **Se pinta cada pixel.** El original saltaba de a dos en x y en y pero
 *   escribia uno solo, asi que tres de cada cuatro pixeles quedaban en alfa 0 y
 *   `putImageData` —que reemplaza, no mezcla— se llevaba puesto el degradado de
 *   abajo. Lo que se veia era una malla de puntitos, no seda.
 *
 * ## El color sale del tema: blanca de dia, oscura de noche
 *
 * La intensidad de la trama no multiplica un color, **mezcla entre dos**:
 * `--silk-fold` es el fondo del pliegue y `--silk-sheen` el brillo de la cresta.
 * Multiplicar —como hacia el original— obliga a que el pliegue mas hondo sea
 * negro, que es justo lo que no se puede hacer en el tema claro. Con la mezcla,
 * en claro la seda va de un hueso apenas mas oscuro que la pagina al blanco
 * puro, y en oscuro del casi negro a un gris malva.
 */
export function SilkBackdrop({ class_name }) {
  const container_ref = useRef(null);
  const canvas_ref = useRef(null);
  const { resolvedTheme } = useTheme();
  const reduced_motion = useReducedMotionSafe();

  useEffect(() => {
    // `resolvedTheme` llega undefined hasta que next-themes resuelve en el
    // cliente. Sin tema no se dibuja: pintar la seda blanca para corregirla un
    // cuadro despues seria un fogonazo a pantalla completa en el tema oscuro.
    if (!resolvedTheme) return;

    const container = container_ref.current;
    const canvas = canvas_ref.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Los dos extremos de la tela, leidos del tema. Se leen una vez y de ahi
    // salen los tres deltas, que es lo que consume el bucle: por pixel se hace
    // una multiplicacion y una suma por canal, no una interpolacion.
    const styles = getComputedStyle(container);
    const fold = read_rgb(styles, "--silk-fold", [11, 10, 15]);
    const sheen = read_rgb(styles, "--silk-sheen", [79, 74, 92]);
    const span_r = sheen[0] - fold[0];
    const span_g = sheen[1] - fold[1];
    const span_b = sheen[2] - fold[2];

    let image = null;
    let data = null;
    let width = 0;
    let height = 0;
    /** `u` de cada columna. No cambia nunca: depende solo de x. */
    let columns = null;
    /** El pliegue de cada columna. Cambia con el tiempo, no con la fila. */
    let folds = null;

    /** El tiempo de la tela. No son segundos: es el barrido del patron. */
    let flow = 0;
    let frame = 0;
    let last = 0;
    let due = 0;

    /** Devuelve si hubo que rehacer el lienzo. */
    const measure = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;

      // El lienzo no mide lo que mide el hero: mide ~45.000 pixeles con su
      // misma proporcion, y el CSS lo estira. Ver el bloque de arriba.
      const aspect = rect.width / rect.height;
      const next_width = Math.max(2, Math.round(Math.sqrt(TARGET_PIXELS * aspect)));
      const next_height = Math.max(2, Math.round(next_width / aspect));

      // Tolerancia de un par de pixeles: en movil la barra de direcciones
      // cambia el alto de la ventana todo el tiempo y cada cambio moveria la
      // proporcion lo justo para rehacer el buffer entero.
      if (
        Math.abs(next_width - width) <= SIZE_STEP &&
        Math.abs(next_height - height) <= SIZE_STEP
      ) {
        return false;
      }

      width = next_width;
      height = next_height;
      canvas.width = width;
      canvas.height = height;

      image = ctx.createImageData(width, height);
      data = image.data;
      // El alfa se escribe UNA vez. De ahi en mas el bucle solo toca RGB, que
      // es un cuarto menos de escrituras por cuadro.
      for (let i = 3; i < data.length; i += 4) data[i] = 255;

      columns = new Float64Array(width);
      for (let x = 0; x < width; x++) columns[x] = (x / width) * SCALE;
      folds = new Float64Array(width);

      return true;
    };

    const render = () => {
      // El pliegue depende de la columna y del tiempo, nunca de la fila: sacado
      // del bucle interno es un seno por columna en vez de uno por pixel.
      for (let x = 0; x < width; x++) {
        folds[x] = FOLD_DEPTH * Math.sin(FOLD_WAVES * columns[x] - flow);
      }

      let index = 0;

      for (let y = 0; y < height; y++) {
        const v = (y / height) * SCALE;

        for (let x = 0; x < width; x++) {
          const u = columns[x];
          const w = v + folds[x];
          const sum = u + w;

          // La trama del original, tal cual. Da entre 0.2 y 1.
          const pattern =
            0.6 +
            0.4 *
              Math.sin(
                5 * (sum + Math.cos(3 * u + 5 * w) + 0.02 * flow) +
                  Math.sin(20 * (sum - 0.1 * flow)),
              );

          const intensity = (pattern - PATTERN_MIN) / PATTERN_SPAN;

          // `Uint8ClampedArray` redondea y recorta solo: no hace falta ni
          // `Math.round` ni acotar a 0..255.
          data[index] = fold[0] + span_r * intensity;
          data[index + 1] = fold[1] + span_g * intensity;
          data[index + 2] = fold[2] + span_b * intensity;
          index += 4;
        }
      }

      ctx.putImageData(image, 0, 0);
    };

    const step = (now) => {
      frame = requestAnimationFrame(step);

      // Techo al delta: al volver de otra pestaña `now` salta varios segundos y
      // sin el la tela pegaria un latigazo.
      const delta = Math.min((now - last) / 1000, MAX_STEP);
      last = now;

      // El avance se acumula SIEMPRE, aunque el cuadro se saltee: es lo que
      // hace que la seda fluya a la misma velocidad a 60Hz que a 144Hz.
      flow += FLOW_SPEED * delta;

      due += delta;
      if (due < FRAME_INTERVAL) return;
      due = 0;

      render();
    };

    const start = () => {
      if (frame || reduced_motion) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    measure();
    render();

    const size_observer = new ResizeObserver(() => {
      if (measure() && !frame) render();
    });
    size_observer.observe(container);

    // El hero se va arriba al primer scroll. De ahi en adelante la tela no se
    // ve, y es el bucle mas caro de la pagina.
    const view_observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    view_observer.observe(container);

    return () => {
      stop();
      size_observer.disconnect();
      view_observer.disconnect();
    };
  }, [resolvedTheme, reduced_motion]);

  return (
    <div
      ref={container_ref}
      aria-hidden="true"
      className={cn(
        "silk-backdrop pointer-events-none absolute inset-0 overflow-hidden",
        class_name,
      )}
    >
      <canvas
        ref={canvas_ref}
        className="absolute inset-0 h-full w-full animate-in fade-in duration-1000"
      />
    </div>
  );
}

/**
 * Lee un token como tripleta `r g b`. Van sin envolver en `rgb()` justamente
 * para esto: parsear tres numeros separados por espacios es un `split`, y
 * parsear un `#rrggbb` o un `oklch()` es un intérprete de color.
 */
function read_rgb(styles, token, fallback) {
  const parts = styles.getPropertyValue(token).trim().split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => Number.isFinite(n))
    ? parts
    : fallback;
}

/**
 * Cuantos pixeles pinta el lienzo, sin importar cuanto mida el hero.
 *
 * **El numero sale de la frecuencia del patron, no de una corazonada.** La
 * trama tiene entre seis y trece ondas de lado a lado; en un hero de 1400x1200
 * esto da un lienzo de 324x278, o sea 25 muestras por onda. De ahi para arriba
 * no hay detalle que agregar —el patron no lo tiene— y solo se agregan senos.
 *
 * Medido: 0,2 ms por cuadro, contra los 41,7 ms que da de presupuesto ir a 24
 * cuadros por segundo. El original, a resolucion de ventana completa, estaba
 * dos ordenes de magnitud mas arriba.
 */
const TARGET_PIXELS = 90000;

/** Cuanto entra de la tela en el lienzo. Mas alto = trama mas chica. */
const SCALE = 2;

/** La onda del pliegue: cuantas hay de lado a lado, y cuanto desplaza. */
const FOLD_WAVES = 8;
const FOLD_DEPTH = 0.03;

/** El rango que devuelve `pattern`: de 0.2 a 1. */
const PATTERN_MIN = 0.2;
const PATTERN_SPAN = 0.8;

/**
 * Velocidad de la tela, en unidades de patron por segundo. Sale de la cuenta
 * del original —`speed: 0.02` por cuadro a 60 cuadros— para que fluya igual.
 */
const FLOW_SPEED = 1.2;

/** 24 cuadros por segundo, en segundos. Ver el bloque de arriba. */
const FRAME_INTERVAL = 1 / 24;

/** Delta maximo de un cuadro, en segundos. */
const MAX_STEP = 1 / 20;

/** Tolerancia de la medida, en pixeles del lienzo. Ver `measure`. */
const SIZE_STEP = 2;
