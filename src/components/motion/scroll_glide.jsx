"use client";

import { useEffect } from "react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";

/**
 * Cuanto se acerca el scroll a su destino en cada fotograma, de 0 a 1.
 *
 * Es la unica perilla del hielo. 0.09 tapa el 63% de la distancia en ~180ms y el
 * 95% en ~530ms: se lee como que la pagina sigue viniendo despues de soltar la
 * rueda. Subirlo endurece el frenado; bajarlo empieza a marear, porque el
 * contenido queda llegando mucho despues del gesto.
 */
const EASE = 0.09;

/** Resto, en px, abajo del cual se da por llegado y el bucle se apaga. */
const SETTLED = 0.4;

/**
 * Fotogramas seguidos sin que la pagina se mueva antes de rendirse.
 *
 * Es la salida del bucle infinito: contra el tope o el pie, `scrollTo` acota y el
 * resto nunca baja de `SETTLED`, asi que el bucle giraria para siempre pidiendo
 * un lugar que no existe. Tambien cubre que la pagina se acorte a mitad del
 * recorrido —`PinnedChapter` le pone el alto a su pista desde JavaScript—.
 */
const STUCK_FRAMES = 3;

/**
 * El scroll con inercia: la pagina sigue bajando un instante despues de soltar
 * la rueda, como algo que se desliza sobre hielo.
 *
 * ## Solo la rueda, y esa es la decision importante
 *
 * Lo unico que se intercepta es el `wheel`. El teclado, las anclas del navbar,
 * arrastrar la barra, `scrollIntoView` y el enlace de "saltar al contenido"
 * **quedan nativos**: cuando la pagina se mueve por cualquier otra via, esto solo
 * resincroniza su destino.
 *
 * Es lo que separa esto de una libreria de scroll suave. Las que reemplazan el
 * scroll entero tienen que reimplementar el teclado y el foco, y ahi es donde se
 * rompe la accesibilidad. Aca no hay nada que reimplementar.
 *
 * ## Y no toca el scroll de verdad
 *
 * Mueve `window.scrollY` con `scrollTo`; **no traslada un envoltorio con un
 * `transform`**, que es como funcionan varias libreras del genero. La diferencia
 * no es de gusto: todo el movimiento de este sitio se mide contra `scrollY` y
 * `PinnedChapter` se apoya en `position: sticky`. Con un envoltorio trasladado,
 * `sticky` deja de tener contra que pegarse y **cada medicion de
 * `rect.top + scrollY` empieza a mentir**. Asi, `ScrollPass`, `ScrollLift`,
 * `ChapterLand` y el capitulo clavado no se enteran de que esto existe: reciben
 * el mismo `scrollY` de siempre, solo que llega mas parejo.
 *
 * ## Donde no corre
 *
 * - **Con `prefers-reduced-motion`**: ni se engancha. Tomarle el scroll a alguien
 *   que pidio menos movimiento es de las peores cosas que se pueden hacer.
 * - **Con puntero grueso** (telefono, tablet): el sistema operativo ya trae su
 *   propia inercia, y pelearle al gesto de la mano se siente roto. Ahi el scroll
 *   queda 100% nativo.
 * - **Con `ctrl`/`cmd` apretado**: eso es zoom del navegador, no scroll.
 * - **Sobre algo que puede scrollear en vertical por su cuenta**: hoy no hay
 *   ninguno —los tres contenedores con scroll propio del sitio son horizontales—
 *   pero la guarda queda puesta, porque el dia que aparezca uno el sintoma seria
 *   "ese panel no scrollea" y nadie lo buscaria aca.
 *
 * ## Por que es un componente que no dibuja nada
 *
 * Porque el layout es un Server Component y no puede llamar hooks. Es el mismo
 * reparto que `HeroTitle`: la parte que necesita cliente se muda a su propio
 * archivo y el resto se queda del lado del servidor.
 */
export function ScrollGlide() {
  const reduced_motion = useReducedMotionSafe();

  useEffect(() => {
    if (reduced_motion) return;

    // Puntero fino = mouse o trackpad. Con dedo, el scroll queda nativo.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let target = window.scrollY;
    let frame = 0;
    let last_time = 0;
    let stuck = 0;
    let gliding = false;

    const max_scroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last_time = 0;
      stuck = 0;
      gliding = false;
    };

    const step = (now) => {
      // El acercamiento se escala por el tiempo del fotograma. Sin esto, en una
      // pantalla de 144Hz el hielo se derrite: el mismo 0.09 por fotograma
      // converge dos veces y media mas rapido y el efecto casi desaparece.
      const elapsed = last_time ? Math.min(now - last_time, 50) : 1000 / 60;
      last_time = now;
      const factor = 1 - (1 - EASE) ** (elapsed / (1000 / 60));

      const from = window.scrollY;
      const rest = target - from;

      if (Math.abs(rest) < SETTLED) {
        window.scrollTo({ top: target, behavior: "instant" });
        stop();
        return;
      }

      window.scrollTo({ top: from + rest * factor, behavior: "instant" });

      // Si la pagina no se movio, el destino esta afuera de lo que se puede
      // recorrer: se acepta donde estamos y se corta.
      stuck = Math.abs(window.scrollY - from) < 0.05 ? stuck + 1 : 0;
      if (stuck >= STUCK_FRAMES) {
        target = window.scrollY;
        stop();
        return;
      }

      frame = requestAnimationFrame(step);
    };

    /** Un `wheel` puede venir en px, en renglones o en pantallas. */
    const pixels = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    };

    /**
     * Hay un ancestro que puede absorber este scroll vertical?
     *
     * La caminata **termina antes del `<body>`**, y no es una optimizacion: el
     * `<html>` de una pagina larga siempre tiene `scrollHeight > clientHeight`, y
     * si su `overflow-y` computado resolviera a `auto` esta guarda daria `true`
     * SIEMPRE y el hielo no se activaria nunca. El scroll de la pagina no es un
     * ancestro que absorbe: es el que estamos manejando.
     *
     * Y se verifica `nodeType`: el `target` de un `wheel` puede ser el
     * `document`, y `getComputedStyle` de algo que no es un elemento **tira
     * excepcion** — dentro de un listener no pasivo eso deja el evento sin
     * `preventDefault` y el scroll salta.
     */
    const scrolls_vertically = (node) => {
      for (let el = node; el; el = el.parentElement) {
        if (el.nodeType !== 1) break;
        if (el === document.body || el === document.documentElement) break;
        if (el.scrollHeight <= el.clientHeight + 1) continue;
        const overflow = getComputedStyle(el).overflowY;
        if (overflow === "auto" || overflow === "scroll") return true;
      }
      return false;
    };

    const on_wheel = (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey) return;
      // Gesto horizontal del trackpad: es de quien tenga un riel debajo.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (scrolls_vertically(event.target)) return;

      event.preventDefault();

      // El destino arranca de donde esta la pagina si no veniamos glidando: si
      // no, un scroll nativo intermedio dejaria el destino viejo y la pagina
      // pegaria un salto al primer notch.
      if (!gliding) target = window.scrollY;

      target = Math.min(Math.max(target + pixels(event), 0), max_scroll());

      if (!gliding) {
        gliding = true;
        frame = requestAnimationFrame(step);
      }
    };

    // Todo lo que NO es la rueda queda nativo; lo unico que hace falta es que el
    // destino no se quede atras.
    const on_scroll = () => {
      if (!gliding) target = window.scrollY;
    };

    window.addEventListener("wheel", on_wheel, { passive: false });
    window.addEventListener("scroll", on_scroll, { passive: true });

    return () => {
      stop();
      window.removeEventListener("wheel", on_wheel);
      window.removeEventListener("scroll", on_scroll);
    };
  }, [reduced_motion]);

  return null;
}
