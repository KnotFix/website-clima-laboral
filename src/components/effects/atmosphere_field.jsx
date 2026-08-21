"use client";

import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";

/**
 * El campo de atmosfera: manchas de color detras de TODA la pagina, en dos
 * profundidades distintas.
 *
 * El fondo del sitio ya tenia un gradiente continuo en el `body`, que resuelve
 * el recorrido de arriba abajo pero es matematicamente perfecto — sube parejo y
 * no pasa nada en el camino. Esto es lo que le da relieve: **manchas**, que son
 * donde el color se junta.
 *
 * ## Los dos planos se mueven a velocidades distintas, y ese es el parallax
 *
 * La capa es `fixed`, asi que por si sola no se mueve: el contenido scrollea a
 * velocidad 1 y ella a 0. Cada plano se traslada `-scrollY * factor`, o sea que
 * sube mas lento que el contenido. Dos factores distintos —0.10 y 0.26— dan dos
 * planos, y **la diferencia entre ellos es la profundidad**. Con un solo factor
 * esto seria un fondo que se mueve, no un fondo que tiene fondo.
 *
 * Las manchas grandes van en el plano lento y las chicas en el rapido: en la
 * vida real lo que esta lejos se ve mas grande y se corre menos. Al reves se lee
 * como un error.
 *
 * > **Aca habia tambien lineas onduladas**, en dos planos propios: `path` de SVG
 * > estirados con `preserveAspectRatio="none"` y trazados con un degradado que
 * > entraba y salia en alfa 0, para que la linea naciera y muriera dentro del
 * > cuadro. Cruzaban de lado a lado por encima de los cortes de seccion. Se
 * > retiraron por decision; si vuelven, van en planos propios y no mezcladas con
 * > las manchas — una linea y una mancha a la misma velocidad se leen como una
 * > sola cosa mal dibujada.
 *
 * ## Por que los planos son altisimos
 *
 * Si midieran una pantalla, al trasladarlos asomaria el borde de arriba. El alto
 * tiene que cubrir la ventana MAS todo el recorrido: en una pagina de ~10.000px
 * el plano rapido viaja ~2.600px, o sea unas tres pantallas. De ahi el `420vh`
 * con `-60vh` de arranque.
 *
 * ## Lo que NO hace
 *
 * - **No anima solo.** Se mueve con el scroll y nada mas: un fondo que respira
 *   por su cuenta compite con el contenido y ademas es un bucle permanente.
 * - **Solo `transform`.** Es la regla del sitio y aca ademas es lo unico que
 *   hace pagable mover capas grandes con blur: se recomponen, no se repintan.
 * - **Con `prefers-reduced-motion` se queda quieto**, pero NO desaparece: el
 *   color y las manchas son composicion, no movimiento. Lo que se apaga es el
 *   parallax.
 */
export function AtmosphereField() {
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  // Los dos planos. El numero es cuanto de cada pixel de scroll se come la
  // capa: 0 seria quedarse clavada al viewport, 1 seria ir pegada al contenido.
  const far_y = useTransform(scrollY, (v) => -v * 0.1);
  const near_y = useTransform(scrollY, (v) => -v * 0.26);

  const layer = "atmo-blobs absolute inset-x-0 -top-[60vh] h-[420vh]";
  const still = reduced_motion ? undefined : true;

  return (
    <div
      aria-hidden="true"
      className="atmo-field pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Van sueltas y de tamaños distintos: cuatro manchas iguales repartidas
          parejo vuelven a ser un patron, que es lo que se esta evitando.

          **Los centros caen fuera de cuadro y los dos planos van enmascarados al
          medio.** Las dos cosas apuntan a lo mismo: que el nucleo de una mancha
          nunca quede debajo de la columna de lectura. Medido con el centro
          encima del texto, el gris apagado caia a 2.49:1 contra un minimo de
          4.5. Ver `.atmo-blobs`. */}
      <motion.div className={layer} style={still && { y: far_y }}>
        <span className="atmo-blob atmo-blob-start absolute left-[-26%] top-[4%] h-[46vh] w-[52vw]" />
        <span className="atmo-blob atmo-blob-start absolute right-[-28%] top-[24%] h-[52vh] w-[46vw]" />
        <span className="atmo-blob atmo-blob-end absolute right-[-24%] top-[66%] h-[50vh] w-[50vw]" />
        <span className="atmo-blob atmo-blob-end absolute left-[-26%] top-[88%] h-[44vh] w-[48vw]" />
      </motion.div>

      <motion.div className={layer} style={still && { y: near_y }}>
        <span className="atmo-blob atmo-blob-start absolute right-[-18%] top-[12%] h-[30vh] w-[30vw]" />
        <span className="atmo-blob atmo-blob-mid absolute left-[-16%] top-[46%] h-[28vh] w-[32vw]" />
        <span className="atmo-blob atmo-blob-end absolute left-[-18%] top-[76%] h-[32vh] w-[30vw]" />
      </motion.div>
    </div>
  );
}
