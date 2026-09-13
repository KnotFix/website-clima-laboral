"use client";

import { useEffect, useRef } from "react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";

/**
 * Grano de pelicula sobre toda la pagina, y **se mueve**.
 *
 * Es lo mas barato que hay contra la sensacion de fondo vacio, y la razon es
 * que un relleno de color y un degradado de CSS son matematicamente perfectos:
 * no existe una superficie real sin grano, asi que el ojo lo lee como plastico.
 * Con ruido pasa a leerse como papel — y con ruido que **cambia**, como
 * pelicula.
 *
 * Va encima de todo y no como fondo de cada seccion, que es como funciona el
 * grano de verdad: es una propiedad de la lente, no de lo que se fotografia.
 * Ademas asi es una sola capa en vez de una decision por seccion, y alcanza
 * igual a las tarjetas blancas, que son de las superficies mas planas que hay
 * en la pagina.
 *
 * ## Como se mueve sin costar nada
 *
 * La version de Framer que inspiro esto redibuja ruido nuevo en un canvas en
 * cada cuadro. No hace falta: **la textura es ruido, asi que correrla ya se ve
 * como ruido nuevo.** Se genera un solo mosaico y cada cuadro se lo traslada a
 * un punto al azar dentro del mosaico. El navegador solo tiene que recomponer
 * una capa que ya esta promocionada — un `transform`, sin repintar nada.
 *
 * Por eso el div de adentro es mas grande que la pantalla: si midiera lo mismo,
 * al correrlo asomaria el borde.
 *
 * ## Por que 12 cuadros por segundo y no 60
 *
 * Porque el grano de pelicula de verdad va a la velocidad de la pelicula, no a
 * la del monitor. A 60 el ruido se promedia en el ojo y se convierte en una
 * niebla gris quieta: **mas cuadros se ve MENOS.** 12 es lo que da el hervor.
 * De paso cuesta cinco veces menos.
 */
export function PageGrain() {
  const texture_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();

  useEffect(() => {
    // Con movimiento reducido el grano se queda quieto. No se apaga: la textura
    // es lo que saca a la pagina de la sensacion de plano, y eso no es
    // movimiento. Lo que molesta es el hervor, y es lo unico que se va.
    if (reduced_motion) return;

    // En movil la capa esta apagada por CSS (`.page-grain`, bloque de 767px de
    // `globals.css`), asi que correr el mosaico seria pedirle un cuadro al
    // navegador doce veces por segundo para mover algo que no se pinta. Se
    // escucha el cambio para acompanar a la ventana si crece o se achica.
    const phone = window.matchMedia(PHONE_QUERY);
    const texture = texture_ref.current;
    if (!texture) return;

    let frame = 0;
    let last = 0;

    const step = (now) => {
      frame = requestAnimationFrame(step);

      // Se pide cada cuadro y se dibuja uno de cada cinco. Es mas simple y mas
      // estable que un `setInterval`: sigue atado al reloj de pintado del
      // navegador, asi que se frena solo cuando la pestana no se ve.
      if (now - last < FRAME_MS) return;
      last = now;

      // El corrimiento va dentro de un mosaico. Mas alla de eso el patron se
      // repite y no se ganaria variedad.
      const x = Math.random() * TILE_SIZE;
      const y = Math.random() * TILE_SIZE;
      texture.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const on_change = () => (phone.matches ? stop() : start());

    on_change();
    phone.addEventListener("change", on_change);
    return () => {
      phone.removeEventListener("change", on_change);
      stop();
    };
  }, [reduced_motion]);

  return (
    // La mezcla y la opacidad van en el div de AFUERA, no en el que se mueve.
    // `mix-blend-mode` mezcla contra el contexto de apilado del padre: puesto en
    // el div de adentro, el contexto seria este mismo envoltorio —que esta
    // vacio— y no se mezclaria con la pagina. O sea, no haria nada.
    // `z-70` lo deja sobre la isla del navbar (z-50) y sobre el enlace de saltar
    // al contenido (z-60). `pointer-events-none` es obligatorio o se come todos
    // los clics de la pagina.
    <div
      aria-hidden="true"
      className="page-grain pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      <div
        ref={texture_ref}
        className="page-grain-texture absolute"
        // El sobrante es lo que permite correrlo sin que asome el borde. Va en
        // linea porque sale del mismo numero que el corrimiento.
        style={{ inset: -TILE_SIZE }}
      />
    </div>
  );
}

/** Lado del mosaico de ruido, en px. Es tambien el tope del corrimiento. */
const TILE_SIZE = 160;

/**
 * Debajo de este ancho el grano no se pinta. Es el mismo corte que apaga los
 * blurs de la atmosfera en `globals.css` (767px): un solo umbral de "esto es
 * un telefono" para todo el sitio, no uno por efecto.
 */
const PHONE_QUERY = "(max-width: 767px)";

/** 12 cuadros por segundo — ver arriba por que no son 60. */
const FRAME_MS = 1000 / 12;
