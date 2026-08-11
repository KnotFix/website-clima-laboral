"use client";

import { useEffect, useRef } from "react";

/**
 * Corre una medicion al montar, al cambiar el tamano de la ventana, y **cada vez
 * que cambia el alto del documento**.
 *
 * Lo tercero es lo que justifica el hook. Todo lo que va atado al scroll en este
 * sitio calcula su tramo en pixeles de documento: donde arranca el elemento y
 * cuanto mide. Eso se puede medir una sola vez... si la pagina no cambia de
 * alto despues. Y cambia:
 *
 * - `PinnedChapter` le pone el alto a su pista **desde JavaScript**, en un
 *   efecto, despues del primer pintado. Son ~1500px que aparecen de golpe y
 *   empujan hacia abajo todo lo que viene despues.
 * - Las imagenes y el video del hero llegan tarde y corren el resto.
 * - Las fuentes cambian el alto de los bloques de texto al reemplazarse.
 *
 * Sin esto, un elemento que se midio antes del empujon queda con el tramo
 * corrido: **el efecto se dispara donde el elemento ya no esta**. Se vio con el
 * planeta — la esfera quedaba en opacidad cero justo mientras cruzaba la
 * pantalla, porque su tramo habia quedado calculado 1500px mas arriba.
 *
 * `escuchar el `resize` de la ventana no alcanza`: la ventana no cambia de
 * tamano cuando lo que crece es el documento.
 *
 * `deps` es para lo que cambia sin tocar el layout. El caso real es
 * `useReducedMotionSafe`: devuelve `false` antes de resolverse y el valor
 * verdadero despues, sin que nada se mueva de tamano. Sin declararlo, la
 * medicion se queda con la primera respuesta y una persona que pidio menos
 * movimiento igual se come el efecto.
 */
export function useRemeasure(measure, deps = []) {
  // El efecto se arma una sola vez y lee siempre la ultima version de la
  // medicion. Guardarla en un ref evita rearmar el observer en cada render solo
  // porque la funcion es nueva.
  const latest = useRef(measure);

  useEffect(() => {
    latest.current = measure;
  });

  useEffect(() => {
    const run = () => latest.current();

    run();
    window.addEventListener("resize", run);

    const observer = new ResizeObserver(run);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", run);
      observer.disconnect();
    };
    // El efecto se rearma con `deps` a proposito: es la unica forma de volver a
    // medir cuando cambia algo que no mueve el layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
