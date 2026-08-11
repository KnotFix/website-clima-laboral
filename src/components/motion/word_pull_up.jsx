"use client";

import { motion } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Retraso entre pieza y pieza. Con 8 piezas, el titular entero entra en ~0.6s.
 * Mas alto y la ultima palabra llega cuando el ojo ya se fue a otra parte.
 */
const STAGGER = 0.075;

/**
 * Cuanto sube cada pieza. Va en `em` y no en px a proposito: el titular mide
 * text-4xl en movil y text-6xl en escritorio, y un recorrido fijo en px se ve
 * exagerado en el chico y timido en el grande. En `em` sube siempre lo mismo
 * en proporcion a su propia letra.
 */
const PULL = "0.4em";

const container_variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER } },
};

const piece_variants = {
  hidden: { y: PULL, opacity: 0 },
  shown: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Las etiquetas se resuelven de un mapa fijo y no de `motion[algo]`: asi la
 * referencia al componente es siempre la misma entre renders. Calculada al
 * vuelo, React veria un componente distinto cada vez y remontaria el titular
 * entero, perdiendo la animacion a mitad de camino.
 */
const HEADINGS = { h1: motion.h1, h2: motion.h2 };

/**
 * Titular que entra palabra por palabra, cada una subiendo desde abajo.
 *
 * Va en dos partes —contenedor y pieza— y no recibe un string para partir por
 * espacios: el titular del hero no es texto plano. Lleva fichas incrustadas
 * (`MoodFace`, `WeatherTile`) y palabras con peso propio, asi que quien lo
 * compone decide que es cada pieza. Un `words.split(" ")` no puede
 * representar eso.
 *
 * Por defecto anima en el montaje, que es lo que corresponde al titular del
 * hero: vive arriba de todo y ya se ve cuando carga la pagina. Con `on_view`
 * espera a entrar al viewport, para titulares que estan mas abajo — si no,
 * terminarian de animarse mucho antes de que nadie los vea.
 */
export function WordPullUp({
  children,
  heading_level = "h1",
  on_view = false,
  class_name,
}) {
  const reduced_motion = useReducedMotionSafe();

  // Sin animacion no alcanza con saltear las variantes: el titular tiene que
  // salir visible de una, no quedarse en el estado `hidden`.
  if (reduced_motion) {
    const Plain = heading_level;
    return <Plain className={cn(class_name)}>{children}</Plain>;
  }

  const Heading = HEADINGS[heading_level];
  const trigger = on_view
    ? { whileInView: "shown", viewport: { once: true, amount: "some" } }
    : { animate: "shown" };

  return (
    <Heading
      className={cn(class_name)}
      variants={container_variants}
      initial="hidden"
      {...trigger}
    >
      {children}
    </Heading>
  );
}

/**
 * Una pieza del titular: una palabra o una ficha.
 *
 * `inline-flex` para que la ficha siga centrada con la altura de las
 * mayusculas. El contenedor es flex, asi que esta pieza es el item que se
 * acomoda y el salto de linea sigue cayendo entre piezas, nunca dentro de una.
 *
 * **`trailing_space` mete un espacio duro DENTRO de la pieza**, y esa es la
 * separacion entre palabras — no un `gap` del contenedor. Con `gap` el hueco
 * existe en el layout pero no en el texto: `textContent` sale
 * "Equiposcomprometidosalcanzan" y un lector de pantalla lo lee como una sola
 * palabra. Con el espacio adentro, la frase se lee y se copia bien.
 *
 * Va afuera del contenido y no adentro, asi que en las fichas (`MoodFace`,
 * `WeatherTile`) queda fuera de su span y no las ensancha.
 */
export function WordPullUpPiece({ children, trailing_space = false, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  const content = (
    <>
      {children}
      {trailing_space && "\u00A0"}
    </>
  );

  if (reduced_motion) {
    return (
      <span className={cn("inline-flex items-center", class_name)}>
        {content}
      </span>
    );
  }

  return (
    <motion.span
      className={cn("inline-flex items-center", class_name)}
      variants={piece_variants}
    >
      {content}
    </motion.span>
  );
}
