"use client";

import { motion } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Las etiquetas salen de un mapa fijo y no de `motion[algo]`: calculada al
 * vuelo, la referencia al componente cambiaria en cada render y React
 * remontaria el texto entero a mitad de la animacion.
 */
const TAGS = { p: motion.p, h2: motion.h2, h3: motion.h3 };

/** La misma curva que usan `Reveal` y `WordPullUp`. */
const EASE = [0.16, 1, 0.3, 1];

/** Retraso entre palabra y palabra. */
const STAGGER = 0.15;

const container_variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER } },
};

/**
 * El desenfoque va en tres pasos y no en dos: entre el borroso y el limpio hay
 * un estado intermedio a media opacidad. Yendo directo de blur(10px) a 0 la
 * palabra aparece de golpe en el ultimo tramo; con el paso del medio se ve
 * llegar.
 */
const piece_variants = {
  hidden: { filter: "blur(10px)", opacity: 0, y: -40 },
  shown: {
    filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
    opacity: [0, 0.5, 1],
    y: [-40, 5, 0],
    transition: { duration: 0.7, times: [0, 0.5, 1], ease: EASE },
  },
};

/**
 * Texto que entra desenfocado y se va aclarando, palabra por palabra.
 *
 * Va en dos partes —contenedor y pieza— y no recibe un string para partir por
 * espacios: asi una de las piezas puede ser algo que no es texto, como la
 * palabra que rota en el titular del planeta. Es el mismo reparto que usa
 * `WordPullUp` con las fichas del hero: quien compone decide que es cada pieza.
 *
 * Anima al entrar al viewport y una sola vez. Para algo que tenga que aparecer
 * Y desaparecer con el scroll esta `ScrollPass`.
 */
export function BlurText({ children, tag = "p", class_name }) {
  const reduced_motion = useReducedMotionSafe();

  // Sin animacion el texto sale plano y de una. El desenfoque es la entrada, no
  // el diseno: dejarlo borroso seria entregar peor texto a quien pidio menos
  // movimiento. Tampoco hace falta el flex — las piezas fluyen como texto.
  if (reduced_motion) {
    const Plain = tag;
    return <Plain className={cn(class_name)}>{children}</Plain>;
  }

  const Tag = TAGS[tag];

  return (
    <Tag
      className={cn("flex flex-wrap", class_name)}
      variants={container_variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: "some" }}
    >
      {children}
    </Tag>
  );
}

/**
 * Una pieza del texto: una palabra, o cualquier otra cosa que se quiera animar
 * junto con ellas.
 *
 * **`trailing_space` mete un espacio duro DENTRO de la pieza**, y esa es la
 * separacion entre palabras — no un `gap` del contenedor. Con `gap` el hueco
 * existe en el layout pero no en el texto: `textContent` sale
 * "Cualquierorganizacion" y un lector de pantalla lo lee como una sola palabra.
 */
export function BlurTextPiece({
  children,
  trailing_space = false,
  class_name,
}) {
  const reduced_motion = useReducedMotionSafe();

  // Espacio DURO y no uno normal: al final de un `inline-block` el espacio
  // comun se colapsa y las palabras salen pegadas.
  const content = (
    <>
      {children}
      {trailing_space && "\u00A0"}
    </>
  );

  if (reduced_motion) {
    return (
      <span className={cn("inline-block", class_name)}>{content}</span>
    );
  }

  return (
    <motion.span
      className={cn("inline-block", class_name)}
      variants={piece_variants}
    >
      {content}
    </motion.span>
  );
}
