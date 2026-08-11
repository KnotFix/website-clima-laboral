"use client";

import { motion } from "motion/react";

import { useChapter } from "@/components/motion/pinned_chapter";
import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * **La altura de la juntura entre las dos diapositivas del capitulo**, en por
 * mil del alto de la diapo. Las dos miden una pantalla, asi que el mismo numero
 * cae en el mismo pixel de las dos.
 *
 * Es EL numero del empalme. La pila sale por el borde derecho de la diapo 1 a
 * esta altura y el grafico entra por el borde izquierdo de la diapo 2 a la
 * misma — y en una fila horizontal esos dos bordes son el mismo punto. Por eso
 * el capitulo no necesita un trazo de empalme: **la juntura es el borde entre
 * diapositivas.**
 *
 * Va bajo (74%) y no arriba porque el gráfico entra por ahi: su primer vertice
 * real esta en 740 y la banda del medio la ocupan las fichas. Entrando arriba,
 * la linea tendria que cruzar el riel entero para llegar al dato.
 *
 * Lo importa `chart_line.jsx`. **Si se mueve acá, se mueve allá solo** — esa es
 * la razón de que viva en un lugar y no en dos.
 */
export const SEAM_Y = 740;

/**
 * Las curvas, en coordenadas del viewBox. El ancho es 100 y el alto 1000, y el
 * SVG se estira al contenedor (`preserveAspectRatio="none"`), asi que estos
 * numeros son porcentajes: `x` del ancho de la caja, `y` del alto.
 *
 * `STACK` cruza la columna de las fichas de lado a lado y despues **sale por el
 * borde derecho**. El trazo pasa por detras de las fichas, asi que lo que se ve
 * de el es lo que asoma entre una y otra: si fuera recto y vertical se leeria
 * como un borde de la maqueta. Cruzando, cada tramo visible sale en un angulo
 * distinto y se lee como un hilo que sigue de largo por atras.
 *
 * > **La caja es la diapositiva entera, no la columna de las fichas.** Tiene que
 * > serlo: el trazo termina en `x = 100`, que es el borde de la diapo, y ese
 * > borde es la juntura con el grafico. Con la caja acotada a la columna, `100`
 * > seria el borde de la columna y la linea moriria en el medio de la pantalla.
 * > Por eso la parte que teje entre las fichas vive entre 56 y 78: es donde cae
 * > la columna derecha de la reja en coordenadas de la diapositiva. Medido a
 * > 1920: las fichas ocupan del 52% al 80% del ancho. Tejer mas ancho —se probo
 * > con 58 y 92— no se lee como un hilo entre tarjetas sino como una ese enorme
 * > cruzando el tercio derecho de la pantalla, porque la caja ahora mide una
 * > pantalla entera y no una columna.
 *
 * > **Sin atajos `S`, y esta medido.** La version con curvas encadenadas se
 * > desbordaba por la derecha: `S` refleja el tirador anterior, y con la caja
 * > estirada a una pantalla entera (`preserveAspectRatio="none"`) esa reflexion
 * > mandaba el control mas alla de `x = 100`. El trazo salia de la diapositiva y
 * > volvia, dibujando un rulo. Con cada tirador escrito no hay reflexion que
 * > adivinar.
 */
const STACK = [
  `M 56 0`,
  `C 56 130, 78 170, 78 310`,
  `C 78 440, 56 480, 56 610`,
  `C 56 690, 78 ${SEAM_Y}, 100 ${SEAM_Y}`,
].join(" ");

/**
 * Que camino dibuja cada forma.
 *
 * > **`connector` se retiro.** Eran dos caminos —uno por breakpoint— que bajaban
 * > desde el final de la pila hasta el pie del titular de la medicion, cuando
 * > las dos secciones se scrolleaban una debajo de la otra. Con el capitulo
 * > clavado ya no hay nada que empalmar: las diapositivas son vecinas
 * > horizontales y **el borde derecho de una es el borde izquierdo de la otra**.
 * > El empalme dejo de ser un trazo y paso a ser un numero compartido,
 * > `SEAM_Y`.
 */
const SHAPES = {
  stack: [{ d: STACK }],
};

/**
 * Trazo curvo que se dibuja con un avance que le pasan de afuera, y se borra al
 * volver para atras.
 *
 * Es funcion del avance, no una animacion que se dispara: bajando crece,
 * subiendo se retrae, y en cualquier posicion vale lo mismo. Por eso no tiene
 * disparo ni `once`.
 *
 * > **El avance llega por `progress` y ya no se mide solo.** Antes calculaba su
 * > propio tramo contra `scrollY`: donde estaba la caja y cuanto media. Adentro
 * > del capitulo clavado eso no sirve — la caja no se mueve nunca, asi que el
 * > tramo salia degenerado y el trazo quedaba en 0 o en 1. Ahora lo dibuja el
 * > mismo avance que arma la pila, que es lo que hace que la linea y las fichas
 * > lleguen juntas.
 *
 * > **Antes era un div que crecia con `scaleY` y ahora es un `path` que se
 * > dibuja con `pathLength`.** El cambio no es gratis: `pathLength` termina en
 * > `stroke-dashoffset`, que repinta el trazo en cada frame en vez de
 * > resolverse en el compositor. Se paga porque **una curva no se puede dibujar
 * > escalando un rectangulo**: `scaleY` sobre una curva le cambia la forma, no
 * > la longitud, y lo que se veria es la misma curva cada vez mas estirada.
 * > El repintado es de un trazo de 2px sobre un area sin nada mas; si alguna vez
 * > la linea deja de ser curva, esto vuelve a ser un `scaleY`.
 *
 * > **`vector-effect="non-scaling-stroke"` no es opcional con
 * > `preserveAspectRatio="none"`.** El SVG se estira a una columna mucho mas
 * > alta que ancha, y sin eso el estirado se le aplica tambien al grosor: el
 * > trazo saldria finisimo en los tramos verticales y grueso en los horizontales.
 *
 * `blurred` dibuja la misma curva desenfocada y tenue, para montarla **encima**
 * de las fichas. Es la mitad del truco del vidrio: ver `problem.jsx`.
 *
 * `shape` elige el camino. La geometria vive **aca** y no en la seccion que la
 * usa: es una decision de dibujo, y el extremo del trazo tiene que poder
 * mirarse contra `SEAM_Y` en el mismo archivo.
 */
export function ScrollLine({
  progress,
  blurred = false,
  shape = "stack",
  class_name,
}) {
  const reduced_motion = useReducedMotionSafe();
  const { stack_progress } = useChapter();

  // Por defecto se dibuja con el avance de la pila del capitulo. Es el unico
  // uso que tiene hoy, y leerlo del contexto evita que la seccion que la
  // coloca —un Server Component— tenga que volverse cliente solo para pasar un
  // `MotionValue` de un lado al otro.
  const draw = progress ?? stack_progress;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute",
        blurred && "blur-[7px]",
        class_name,
      )}
    >
      {SHAPES[shape].map((variant) => (
        <g key={variant.d} className={variant.class_name}>
          {/* El riel: adonde va a llegar el trazo, siempre visible. La version
              difusa no lo lleva — encima de una ficha, un riel siempre presente
              se leeria como una mancha fija y no como algo que pasa por
              detras. */}
          {!blurred && (
            <path
              d={variant.d}
              fill="none"
              stroke="var(--org-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              opacity="0.5"
            />
          )}
          {/* El trazo. Con movimiento reducido va entero y quieto: dibujarse es
              el efecto, no el contenido, y una linea a medias seria informacion
              perdida.
              La version difusa va mas gruesa y mucho mas tenue: el desenfoque
              reparte la tinta, asi que un trazo de 2px se disolveria hasta
              desaparecer. */}
          <motion.path
            d={variant.d}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={blurred ? 9 : 2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={blurred ? 0.16 : 0.55}
            style={reduced_motion ? undefined : { pathLength: draw }}
          />
        </g>
      ))}
    </svg>
  );
}
