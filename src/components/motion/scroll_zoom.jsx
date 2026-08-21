"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Recorrido en px por unidad de `scroll_speed`.
 *
 * **Aca vivia "el mismo que usa Parallax".** `Parallax` era el dueño de esta
 * unidad y se retiro por no tener un solo consumidor; el numero se queda porque
 * `scroll_speed` sigue existiendo, y este archivo pasa a ser donde se define.
 */
const TRAVEL = 120;

/**
 * Distancia del ojo al plano, en px, para el `rotateX` de `tilt_from`.
 *
 * Es la fuerza de la perspectiva: mas chico exagera la fuga y el panel se
 * deforma como un truco, mas grande la aplana hasta que la inclinacion parece
 * un aplastado y no una pieza girando en el espacio. 1400 sobre un marco de
 * ~1100px de ancho deja el borde de abajo un 7% mas ancho que el de arriba:
 * se lee el volumen sin que el video se vuelva un trapecio.
 */
const PERSPECTIVE = 1400;

/**
 * Desde donde crece y sobre que eje se inclina.
 *
 * `center` reparte el achique a los cuatro lados, asi que el borde de arriba
 * queda mas abajo de lo que dice el layout y el hueco con lo que tenga encima
 * se agranda solo, sin que ningun margen lo pida.
 *
 * `top` clava el borde de arriba en su posicion de layout: el hueco de arriba
 * es exactamente el margen, sin importar la escala, y el elemento crece hacia
 * abajo. Es lo que quiere una pieza que tiene que leerse pegada a lo anterior.
 */
const ORIGINS = { center: "50% 50%", top: "50% 0%" };

/**
 * useLayoutEffect avisa por consola si le toca correr en el servidor.
 *
 * Va en camelCase, no en snake_case como el resto: es la excepcion de los
 * hooks. El linter solo reconoce /^use[A-Z]/, y en snake_case lo trata como
 * una funcion cualquiera y se queja de que le pasemos un callback que lee un
 * ref (react-hooks/refs), ademas de dejar de vigilar las reglas de hooks.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Escala su contenido con el scroll: arranca en `zoom_from` cuando el elemento
 * asoma por el pie de la ventana y llega a `zoom_to` cuando su centro alcanza
 * el centro de la pantalla.
 *
 * Escala con `transform`, nunca con `width`/`height`: el lugar que ocupa en el
 * layout es siempre el final, asi que crecer no empuja nada de la pagina y no
 * hay un solo reflow durante el recorrido.
 *
 * `tilt_from` lo inclina hacia atras en grados —el borde de arriba se va, el de
 * abajo se acerca— y lo endereza sobre el mismo recorrido: llega a 0 justo
 * cuando termina de crecer, para que sea un solo gesto y no dos animaciones
 * sueltas compitiendo.
 *
 * `scroll_speed` agrega el desplazamiento vertical del parallax. La unidad la
 * define `TRAVEL`, aca arriba. En 0 el elemento solo crece.
 */
export function ScrollZoom({
  children,
  zoom_from = 0.7,
  zoom_to = 1,
  zoom_origin = "center",
  tilt_from = 0,
  scroll_speed = 0,
  class_name,
}) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();

  // Scroll crudo de la ventana, no `useScroll({ target })`.
  //
  // La version con target se apoya en un ScrollTimeline del navegador y no
  // siembra su valor: se queda en 0 hasta que el scroll se mueve de verdad, y
  // ademas vuelve a pisarlo en cada frame, asi que tampoco se puede sembrar
  // desde afuera. En una ventana alta el elemento ya entra medio visible —o
  // sea que su progreso al cargar la pagina no es 0— y eso se veia como un
  // salto de tamano en el primer click de la rueda.
  //
  // Midiendo nosotros el tramo, el zoom queda como funcion pura de `scrollY`:
  // el mismo scroll da siempre el mismo tamano, y al cargar ya vale lo que
  // tiene que valer sin esperar a que nadie scrollee.
  const { scrollY } = useScroll();

  // Tramo de scroll, en px de documento, durante el que el elemento crece.
  const [range, set_range] = useState([0, 1]);

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const element = container_ref.current;
      if (!element) return;

      // El div medido no se transforma nunca, asi que su caja es la del layout:
      // si midieramos el que escalamos, getBoundingClientRect devolveria el
      // rectangulo YA escalado y se armaria un lazo (crece, se mide mas grande,
      // crece mas) que clava el zoom apenas arranca el scroll.
      const rect = element.getBoundingClientRect();
      const top_in_document = rect.top + window.scrollY;
      const viewport = window.innerHeight;

      const start = top_in_document - viewport;
      const end = top_in_document - (viewport / 2 - rect.height / 2);

      set_range([start, Math.max(start + 1, end)]);
    };

    measure();

    // La medida depende del alto de la ventana y de donde cae el titular, que
    // cambia de alto cuando entra la tipografia propia.
    window.addEventListener("resize", measure);
    if (document.fonts?.status === "loading") document.fonts.ready.then(measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  const scale = useTransform(scrollY, range, [zoom_from, zoom_to], {
    clamp: true,
  });
  const y = useTransform(scrollY, range, [scroll_speed * TRAVEL, 0], {
    clamp: true,
  });
  const rotateX = useTransform(scrollY, range, [tilt_from, 0], { clamp: true });

  // Con menos movimiento no queda a medio crecer ni torcido: se entrega en
  // `zoom_to` y derecho, que es como se ve de verdad. El estado chico e
  // inclinado es la animacion, no el diseno.
  //
  // Sin `tilt_from` no se escriben ni `rotateX` ni la perspectiva: alcanza con
  // que aparezcan en el transform para que el navegador promueva el elemento a
  // capa 3D y rasterice distinto. Si nadie pidio inclinacion, no se paga.
  const transform_style = reduced_motion
    ? undefined
    : tilt_from
      ? {
          scale,
          y,
          rotateX,
          transformPerspective: PERSPECTIVE,
          transformOrigin: ORIGINS[zoom_origin],
        }
      : { scale, y, transformOrigin: ORIGINS[zoom_origin] };

  return (
    <div ref={container_ref} className={cn(class_name)}>
      <motion.div style={transform_style}>
        {children}
      </motion.div>
    </div>
  );
}
