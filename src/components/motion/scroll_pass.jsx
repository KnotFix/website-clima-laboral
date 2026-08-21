"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { useRemeasure } from "@/components/motion/use_remeasure";
import { cn } from "@/lib/utils";

/** Recorrido vertical por defecto, en px: sube esto y entra desde mas lejos. */
const DRIFT = 90;

/**
 * Tramos del cruce, en fracciones de lo que tarda el elemento en atravesar la
 * pantalla entera. 0 = asoma por abajo; 1 = se fue por arriba. Entre `IN_DONE`
 * y `OUT_START` esta a pleno.
 */
const IN_DONE = 0.35;
const OUT_START = 0.68;

/**
 * Cuanto se corre el tramo por cada turno del escalonado, en px de scroll.
 *
 * Va en px y no en una fraccion del cruce a proposito: el escalonado tiene que
 * verse igual en una lista de tres renglones y en una reja de cuatro fichas, y
 * el cruce de esas dos mide cosas muy distintas. 70px es poco menos de un
 * decimo de pantalla — se lee como que la pieza siguiente viene atras, no como
 * que llega tarde.
 */
const BUILD_STEP = 70;

/**
 * Cuanto se achica la pieza mientras viene en camino, en modo aterrizaje.
 *
 * **Es lo que separa "flota hasta su lugar" de "la empujaron de costado".** Sin
 * la escala, un desplazamiento lateral se lee en el plano: la pieza patina. Con
 * ella llega desde un poco mas atras y se apoya.
 *
 * 0.97 es el techo util. Mas abajo el texto se ve reescalado —el antialiasing lo
 * delata— y una ficha con captura adentro empieza a mostrar el remuestreo.
 *
 * **Se exporta porque el aterrizaje pasa en dos lugares.** Adentro del capitulo
 * clavado el movimiento no puede colgar del scroll —la pagina no avanza en
 * vertical— asi que `ChapterLand` y `StackCard` lo hacen contra el avance del
 * capitulo. El gesto tiene que ser el MISMO numero en los dos, o el sitio tiene
 * dos aterrizajes distintos segun donde caiga la pieza.
 */
export const SETTLE_SCALE = 0.97;

/**
 * Desde que ancho una pieza tiene un lado del que venir: el `lg` de Tailwind,
 * o sea el ancho en el que las rejas del sitio pasan a dos columnas.
 *
 * Abajo de eso la pieza ocupa la columna entera, y un desplazamiento lateral
 * sobre algo que ya llega a los dos bordes **no dice de donde viene** — encima
 * de agrandar el area desplazable del documento y meter barra horizontal. Ahi el
 * aterrizaje se hace en vertical, que es lo unico que en una columna significa
 * algo.
 */
const SIDE_MIN_WIDTH = 1024;

/**
 * El ajuste de un titular de seccion, en un solo lugar.
 *
 * **Todos los titulares del sitio entran y salen con el scroll**, no con un
 * disparo al cruzar el viewport. La diferencia se nota volviendo para arriba:
 * `Reveal` deja el titulo puesto para siempre despues de la primera vez, y esto
 * lo devuelve por donde vino. La pagina se lee igual en los dos sentidos.
 *
 * Los tres numeros son mas cerrados que los de `ScrollPass` a secas. El
 * recorrido va corto —60px contra 90— porque un titulo que se desplaza mucho
 * compite con el cuerpo que tiene debajo, y los dos hitos se abren temprano y
 * cierran tarde para que **nunca haya un titulo atenuado que alguien este
 * leyendo**: llega a pleno apenas termina de entrar y no empieza a irse hasta
 * que ya cruzo el borde de arriba.
 *
 * Va como constante y no como valores por defecto porque `ScrollPass` tambien
 * envuelve cosas que no son titulares —el planeta, por ejemplo— y ahi el tramo
 * largo es justo lo que se quiere.
 */
export const HEADING_PASS = { drift: 60, fade_in: 0.18, fade_out: 0.82 };

/**
 * Entrada y salida atadas al scroll: el contenido sube y aparece mientras entra
 * a la pantalla, se queda a pleno en el medio, y sigue subiendo mientras se va.
 *
 * Es distinto de `Reveal`, que dispara una vez al cruzar el viewport y ahi
 * queda. Aca **no hay disparo**: la posicion y la opacidad son funcion pura del
 * scroll, asi que volver hacia arriba deshace el efecto igual que bajar lo
 * hizo. El mismo scroll da siempre el mismo fotograma.
 *
 * El tramo se mide contra `scrollY` crudo y no con `useScroll({ target })`: esa
 * version se apoya en un ScrollTimeline del navegador que no siembra su valor
 * inicial y lo repisa en cada frame.
 *
 * `fill_height` es para cuando esto envuelve una ficha de una reja: el div de
 * afuera es la celda y se estira solo, pero el de adentro no, asi que un
 * `h-full` del hijo se quedaria sin contra quien medir y las fichas de una
 * misma fila dejarian de igualarse.
 *
 * `fade_in` y `fade_out` corren los dos hitos de la opacidad. Se abren porque
 * el ancho del tramo tiene que salir de lo que se envuelve: una pieza sola en
 * el medio de la pantalla puede darse el lujo de aparecer despacio, pero una
 * reja de texto no — ahi el tramo largo deja una fila entera translucida
 * mientras alguien la esta leyendo.
 *
 * ## El escalonado: `build_index`
 *
 * **Un bloque que aparece completo se lee como que se enciende, no como que se
 * arma.** `build_index` es el turno de la pieza dentro de su bloque, y corre su
 * tramo `build_index * build_step` px mas abajo: la segunda entra cuando la
 * primera ya llego, la tercera detras de la segunda.
 *
 * **Corre el tramo ENTERO y no solo la entrada**, y eso es lo que hace que la
 * salida deshaga el orden del armado. La pieza con mas turno entra despues y
 * tambien se va despues; como todo es funcion pura del scroll, subir recorre la
 * misma curva al reves. No hay codigo del desarmado — es el armado leido de
 * atras para adelante.
 *
 * El turno lo pasa quien compone, igual que `index` en `StackCard`. No hay
 * contenedor ni contexto: el contexto se usa una sola vez en el sitio
 * —`PinnedChapter`— y sumar otro para correr un numero no se paga.
 *
 * ## Los dos modelos de movimiento: `enter_from`
 *
 * **Sin `enter_from` la pieza ATRAVIESA.** Va de `+drift` a `−drift` de corrido, o
 * sea que nunca pasa por su posicion de layout: siempre esta deslizandose. Es un
 * parallax, y es lo que se quiere para una ilustracion o un titular que solo
 * tiene que dar profundidad.
 *
 * **Con `enter_from` la pieza ATERRIZA.** Llega desde ese lado, y el
 * desplazamiento **llega a 0 justo cuando la opacidad llega a 1**, se queda
 * quieto todo el tramo de lectura, y vuelve al MISMO lado al salir:
 *
 * ```
 *            asoma    aterriza   se queda   se va
 *  opacidad    0 ─────→ 1 ═══════════ 1 ─────→ 0
 *  x         ∓drift ───→ 0 ═══════════ 0 ─────→ ∓drift
 *  escala   0.97 ─────→ 1 ═══════════ 1 ─────→ 0.97
 * ```
 *
 * Atravesar necesita dos hitos y aterrizar los cuatro, y por eso el segundo
 * modelo no se podia expresar cambiando de eje: la diferencia no es la
 * direccion, es que **haya un tramo en el que la pieza esta en su sitio**.
 * Volver al mismo lado tampoco es un detalle — es lo que hace que subir
 * DESARME lo que bajar armo, en vez de seguir empujando la pieza de largo.
 *
 * La distancia sigue saliendo de `drift`: no hay una prop nueva para eso.
 *
 * **Abajo de `SIDE_MIN_WIDTH` el aterrizaje cae a vertical** — ver la constante.
 * Los dos ejes se declaran SIEMPRE en este modo, y uno de los dos vale 0. No es
 * redundancia: si el `style` dejara de nombrar un eje al cambiar de breakpoint,
 * la transformada anterior se quedaria pegada en el elemento.
 *
 * > **Quien deslice de costado tiene que ir dentro de un `overflow-x-clip`.** Un
 * > `translateX` agranda el area desplazable del documento: la columna izquierda
 * > arranca en el borde del `Container`, asi que corrida 64px se va 40px mas alla
 * > de su `padding` y aparece una barra horizontal. El recorte va en el
 * > envoltorio de las piezas y no en la `<section>` —ahi cortaria los lobulos de
 * > `SectionGlow`, que sangran a proposito— y es `clip` y no `hidden` porque
 * > `clip` no crea contenedor de scroll.
 */
export function ScrollPass({
  children,
  drift = DRIFT,
  fill_height = false,
  fade_in = IN_DONE,
  fade_out = OUT_START,
  build_index = 0,
  build_step = BUILD_STEP,
  enter_from,
  class_name,
}) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();

  // Cuatro hitos: asoma, ya entro, empieza a irse, se fue.
  const [span, set_span] = useState([0, 1, 2, 3]);

  // Arranca en `false` y se corrige despues del montaje, como
  // `useReducedMotionSafe`. No hay salto visible: en el primer fotograma la
  // pieza todavia esta en opacidad cero.
  const [has_sides, set_has_sides] = useState(false);

  useRemeasure(() => {
    const element = container_ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const top_in_document = rect.top + window.scrollY;
    const viewport = window.innerHeight;

    set_has_sides(window.innerWidth >= SIDE_MIN_WIDTH);

    // El turno se suma al ARRANQUE, no a cada hito: los cuatro salen de
    // `enter`, asi que corriendolo se corre el tramo completo de una. Sumarlo
    // tambien a `travel` seria otra cosa —la pieza cruzaria mas despacio— y el
    // escalonado dejaria de ser un desfase para volverse un cambio de ritmo.
    const enter = top_in_document - viewport + build_index * build_step;
    const travel = rect.height + viewport;

    set_span([
      enter,
      enter + travel * fade_in,
      enter + travel * fade_out,
      enter + travel,
    ]);
  });

  const opacity = useTransform(scrollY, span, [0, 1, 1, 0], { clamp: true });

  // Atravesar: dos hitos, de un extremo al otro. Nunca pasa por 0.
  const pass_y = useTransform(scrollY, [span[0], span[3]], [drift, -drift], {
    clamp: true,
  });

  // Aterrizar: los cuatro hitos, espejados. El 0 del medio es la posicion de
  // layout, y el tramo entre los dos hitos del medio es la pieza QUIETA en su
  // sitio. Los extremos son iguales entre si: se va por donde vino.
  const sideways = Boolean(enter_from) && has_sides;
  const x_from = sideways ? (enter_from === "left" ? -drift : drift) : 0;
  const y_from = sideways ? 0 : drift;

  const land_x = useTransform(scrollY, span, [x_from, 0, 0, x_from], {
    clamp: true,
  });
  const land_y = useTransform(scrollY, span, [y_from, 0, 0, y_from], {
    clamp: true,
  });
  const scale = useTransform(
    scrollY,
    span,
    [SETTLE_SCALE, 1, 1, SETTLE_SCALE],
    { clamp: true },
  );

  return (
    // Dos divs: el de afuera se mide, el de adentro se transforma. `y` sobre el
    // mismo elemento que medimos armaria un lazo — se mueve, se mide corrido, se
    // mueve mas — y el recorrido nunca se asentaria.
    <div ref={container_ref} className={cn(fill_height && "h-full", class_name)}>
      <motion.div
        className={cn(fill_height && "h-full")}
        // Con menos movimiento se entrega quieto y visible. Un elemento que
        // aparece y desaparece con el scroll es justo lo que hay que no hacer.
        style={
          reduced_motion
            ? undefined
            : enter_from
              ? { opacity, x: land_x, y: land_y, scale }
              : { opacity, y: pass_y }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
