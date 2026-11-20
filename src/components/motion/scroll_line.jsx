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
 * Por donde entra la linea a la diapositiva del problema, en `x` del viewBox.
 *
 * Es la otra juntura, la de arriba: `LEAD` termina aca y `STACK` arranca aca.
 * Un numero y no dos por lo mismo que `SEAM_Y`.
 */
const STACK_START_X = 30;

/**
 * Las curvas, en coordenadas del viewBox. El ancho es 100 y el alto 1000, y el
 * SVG se estira al contenedor (`preserveAspectRatio="none"`), asi que estos
 * numeros son porcentajes: `x` del ancho de la caja, `y` del alto.
 *
 * `STACK` baja por la izquierda, cruza por detras de la pila y **sale por el
 * borde derecho**. El trazo pasa por detras de las fichas, asi que lo que se ve
 * de el es donde entra y donde sale: si fuera recto y vertical se leeria como un
 * borde de la maqueta. Cruzando en diagonal, los dos tramos visibles salen en
 * angulos distintos y se lee como un hilo que sigue de largo por atras.
 *
 * > **La caja es la diapositiva entera, no la pila.** Tiene que serlo: el trazo
 * > termina en `x = 100`, que es el borde de la diapo, y ese borde es la juntura
 * > con el grafico. Con la caja acotada a la pila, `100` seria el borde de la
 * > pila y la linea moriria en el medio de la pantalla.
 *
 * > **El tramo de arriba baja por `x ≈ 20` para no cruzar el titular.** Antes
 * > bajaba por 56-78, que era donde caia la columna derecha de las fichas cuando
 * > la seccion tenia dos columnas. Con la pila centrada debajo del titular, ese
 * > tercio derecho quedo vacio y el medio lo ocupa el titulo: un trazo por ahi
 * > le cruzaria el renglon. Medido a 1920 con el titular en `text-5xl`, el texto
 * > vive entre 37 y 63; 20 lo esquiva con aire de sobra y sigue leyendose como
 * > una linea de la seccion y no como un borde pegado al costado.
 *
 * > **Las fichas ocupan de 30 a 70 y la banda va de 480 a 660** (768px centrados
 * > en 1920, en una diapositiva de un alto de ventana). El cruce entra ahi por
 * > abajo a la izquierda y sale por la derecha, que es lo que deja los dos
 * > extremos a la vista con la pila armada.
 *
 * > **Sin atajos `S`, y esta medido.** La version con curvas encadenadas se
 * > desbordaba por la derecha: `S` refleja el tirador anterior, y con la caja
 * > estirada a una pantalla entera (`preserveAspectRatio="none"`) esa reflexion
 * > mandaba el control mas alla de `x = 100`. El trazo salia de la diapositiva y
 * > volvia, dibujando un rulo. Con cada tirador escrito no hay reflexion que
 * > adivinar — y en cada juntura los dos tiradores van alineados a mano, que es
 * > lo que `S` hacia gratis y aca hay que escribir.
 */
const STACK = [
  `M ${STACK_START_X} 0`,
  `C ${STACK_START_X} 170, 20 250, 20 390`,
  `C 20 480, 38 500, 50 560`,
  `C 62 620, 82 ${SEAM_Y}, 100 ${SEAM_Y}`,
].join(" ");

/**
 * El tramo que trae la linea desde el hero hasta el arranque de `STACK`,
 * cruzando la seccion de clientes. No se dibuja con el scroll: va quieto, ver
 * `outside_chapter`.
 *
 * **Existe porque la linea quedo cortada** (2026-11-19). Mientras el problema
 * iba pegado al hero, el arranque de `STACK` quedaba metido detras de la tapa y
 * la linea se leia saliendo de abajo de la captura. Con «Nuestra familia» en el
 * medio, ese arranque quedo a la vista: un trazo que empezaba en el aire, debajo
 * de los logos.
 *
 * La caja es la seccion de clientes mas un tramo hacia arriba que se mete
 * debajo del hero (ver `clients.jsx`), asi que `y = 0` esta tapado por la
 * captura y `y = 1000` es el borde de arriba del problema.
 *
 * > **Termina en `(STACK_START_X, 1000)` bajando en vertical**, que es como
 * > arranca `STACK`: mismo `x`, misma tangente. Son dos SVG distintos y lo unico
 * > que los une es ese punto.
 *
 * > **Baja por la derecha para no cruzar el texto.** El titular y el cuerpo van
 * > alineados a la izquierda y ocupan hasta `max-w-2xl`: a 1024 de ancho eso
 * > llega al 69%. `WIDE` baja por 76 —debajo de la captura hasta los ~2300px de
 * > ancho— y recien dobla a la altura del riel, por detras de las placas. En
 * > `NARROW` el texto ocupa todo el ancho, asi que baja por el margen del
 * > `Container` (97) y cruza donde ya no hay texto.
 *
 * > **El cruce es una sola ese, con los dos tiradores en vertical.** La primera
 * > version doblaba en dos tramos y llegaba al empalme casi horizontal, con un
 * > codo de 85px justo antes de la juntura: se leia como un quiebre y no como
 * > la misma linea. Vertical arriba y vertical abajo es ademas lo unico que
 * > sobrevive al estirado: la caja cambia de proporcion con cada ancho, y una
 * > tangente en diagonal quedaria en otro angulo que la de `STACK`.
 */
const LEAD_WIDE = [
  `M 76 0`,
  `L 76 560`,
  `C 76 800, ${STACK_START_X} 760, ${STACK_START_X} 1000`,
].join(" ");

const LEAD_NARROW = [
  `M 97 0`,
  `L 97 660`,
  `C 97 860, ${STACK_START_X} 820, ${STACK_START_X} 1000`,
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
  // Dos caminos, uno por ancho. El corte es `lg` porque es donde el texto de
  // los clientes deja de ocupar todo el ancho del `Container`.
  lead: [
    { d: LEAD_NARROW, class_name: "lg:hidden" },
    { d: LEAD_WIDE, class_name: "hidden lg:block" },
  ],
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
 *
 * `outside_chapter` es para `lead`, que vive fuera del capitulo y no tiene
 * avance que lo dibuje. El trazo va quieto y **copia el estado en que esta el
 * arranque de `STACK` cuando los dos se ven juntos**:
 * - con el capitulo clavado, `STACK` todavia no empezo a dibujarse —el avance
 *   vale 0 hasta que la diapositiva llega arriba, y ahi los clientes ya
 *   salieron de pantalla—, asi que aca queda solo el riel;
 * - con el capitulo suelto (telefono, ventana baja, movimiento reducido),
 *   `STACK` va entero y oscuro, y aca tambien.
 * Sin esto, en un telefono la linea cambiaba de gris a negro justo en el
 * empalme. El corte es la variante `chapter-pinned` de `globals.css`.
 */
export function ScrollLine({
  progress,
  blurred = false,
  outside_chapter = false,
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
              desaparecer.
              > **Sin `strokeLinecap="round"`, y es por el avance en 0.** Un
              > trazo de largo cero con punta redonda igual pinta la punta: un
              > punto oscuro en el arranque de la curva. Mientras ese arranque
              > quedaba detras del hero no se veia; con los clientes en el medio
              > quedo a la vista, justo en el empalme con `lead`. A 2px la punta
              > recta no se distingue de la redonda. */}
          <motion.path
            d={variant.d}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={blurred ? 9 : 2}
            vectorEffect="non-scaling-stroke"
            opacity={blurred ? 0.16 : 0.55}
            className={outside_chapter ? "chapter-pinned:hidden" : undefined}
            style={
              reduced_motion || outside_chapter
                ? undefined
                : { pathLength: draw }
            }
          />
        </g>
      ))}
    </svg>
  );
}
