"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { Container } from "@/components/site/container";
import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** Scroll (px) en el que el desprendimiento queda completo. */
const DETACH_THRESHOLD = 120;
/**
 * Cuanto baja la isla al despegarse (px). Se suma al `pt-2` que ya la separa
 * del tope en reposo, asi que el hueco final es de ~18px.
 */
const DETACH_OFFSET = 10;
/**
 * Cuanto se achica la isla ya despegada. Escala UNIFORME: encoge alto y ancho
 * a la vez, que es lo que se lee como "el navbar se hizo mas chico", y al ser
 * un `transform` no obliga a recalcular layout en cada frame del scroll.
 */
const ISLAND_SCALE = 0.92;

/**
 * Cascara visual del navbar: una pildora de vidrio, del ancho del Container y
 * redondeada DESDE EL PRIMER FRAME. No se ensancha ni se endereza nunca.
 *
 * Antes habia dos capas que se cruzaban en opacidad — una barra a lo ancho de
 * la ventana arriba y la isla al scrollear. Se saco: la forma final es la misma
 * siempre, asi que la barra ancha solo agregaba una capa, un cruce que afinar y
 * un borde que aparecia a destiempo.
 *
 * Lo unico que cambia al scrollear es que la pildora BAJA y se ACHICA. Ni el
 * radio ni la opacidad se animan.
 *
 * Es vidrio esmerilado a proposito: el navbar viaja sobre el hueso del hero y
 * sobre las secciones de mas abajo, y cualquier color propio se recorta como
 * una banda contra alguno de los dos. El vidrio no tiene color propio — toma
 * el de atras.
 *
 * Aca vivia un efecto slime con `filter: url(#goo_filter)`. Se saco porque es
 * incompatible con el vidrio, por dos razones independientes: el goo necesita
 * formas OPACAS (su rampa de alfa lleva a opaco todo lo que pase de ~0.44), y
 * un `filter` en un ancestro anula el `backdrop-filter` de todos sus hijos.
 *
 * Se anima solo `transform` y `opacity`.
 */
export function GlassBar({ children, class_name }) {
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  const raw_progress = useTransform(scrollY, [0, DETACH_THRESHOLD], [0, 1], {
    clamp: true,
  });

  // Spring SUBAMORTIGUADO a proposito: el rebote al asentarse es lo que le da
  // peso. Un spring critico se leeria como una transicion CSS.
  const spring_progress = useSpring(raw_progress, {
    stiffness: 220,
    damping: 18,
    mass: 0.9,
  });

  const detach_progress = reduced_motion ? raw_progress : spring_progress;

  const bar_y = useTransform(detach_progress, [0, 1], [0, DETACH_OFFSET]);
  const island_scale = useTransform(detach_progress, [0, 1], [1, ISLAND_SCALE]);

  // El scrim entra apenas empieza el scroll: la isla esta separada del tope
  // desde el principio, asi que el hueco por donde pasaria el contenido existe
  // desde el primer pixel.
  const scrim_opacity = useTransform(detach_progress, [0, 0.4], [0, 1], {
    clamp: true,
  });

  return (
    <div
      className={cn(
        // pointer-events-none para que la franja fija no bloquee la pagina;
        // la capa de contenido lo vuelve a habilitar.
        // pt-2 separa la pildora del borde superior ya en reposo: pegada al
        // tope, las esquinas redondeadas no se leerian.
        "pointer-events-none fixed inset-x-0 top-0 z-50 pt-2",
        class_name,
      )}
    >
      {/* ---------- Scrim: tapa el hueco sobre la isla ---------- */}
      <motion.div
        aria-hidden="true"
        className="nav-scrim absolute inset-x-0 top-0 h-14"
        style={{ opacity: scrim_opacity }}
      />

      {/* ---------- Isla + contenido ---------- */}
      <Container class_name="relative">
        <motion.header
          className="relative h-16 origin-top"
          style={{ y: bar_y, scale: island_scale }}
        >
          {/* Pildora desde el primer frame: ni el radio ni la opacidad se
              animan. Lo unico que cambia al scrollear es que baja y se achica.
              Sigue separada del contenido para no re-renderizarlo. */}
          <div
            aria-hidden="true"
            className="nav-glass nav-glass-island absolute inset-0 rounded-full border border-border shadow-lg"
          />
          {/* El padding despega al logo y al CTA del borde de la pildora. Va
              aca dentro y no en el Container: el Container define el ancho de
              la pagina, esto es el aire interno de la isla. */}
          <div className="pointer-events-auto relative flex h-full items-center justify-between gap-4 px-5 md:px-7">
            {children}
          </div>
        </motion.header>
      </Container>
    </div>
  );
}
