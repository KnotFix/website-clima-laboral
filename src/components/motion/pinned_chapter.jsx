"use client";

import { createContext, useContext, useRef, useState } from "react";
import {
  motion,
  motionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { useRemeasure } from "@/components/motion/use_remeasure";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/**
 * Cuanto scroll consume cada ficha de la pila, en altos de ventana. Es la fase
 * 1: la pila se arma con el titulo quieto al lado.
 *
 * **La fase 1 es el tramo mas caro del capitulo** —son tres fichas— y el
 * capitulo entero hay que atravesarlo: clavado no se puede pasar de largo. A
 * 0.7 el tramo media 4.8 pantallas; a 0.55 baja a 4.3, que es casi lo que
 * costaban las dos secciones sueltas antes de unirlas. Cada ficha se lleva unos
 * 500px de scroll, cinco golpes de rueda: alcanza para leerla sin que se
 * arrastre.
 */
const STACK_PER_CARD = 0.55;

/**
 * Cuanto scroll consume el paneo, en altos de ventana. Es la fase 2: la diapo 1
 * se va por la izquierda y la 2 entra por la derecha.
 *
 * Corto a proposito. Un paneo largo se lee como que la pagina se trabo: el
 * gesto ya se entendio en el primer tercio y el resto es esperar.
 */
const PAN_SPAN = 0.8;

/**
 * Cuanto scroll se sostiene la diapositiva 2 ya completa antes de que el
 * capitulo suelte, en altos de ventana.
 *
 * No es aire: es lo que evita que la seccion se vaya con el riel a medio
 * camino. El avance pasa por un `useSpring`, asi que cuando el scroll llega al
 * final del tramo el riel todavia esta acomodandose; sin este colchon el
 * clavado se suelta justo ahi y la ultima ficha se va de pantalla sin haber
 * llegado a su lugar. Es el mismo papel que cumplia el `pb-[14vh]` de la pila
 * en la version vertical.
 */
const HOLD_SPAN = 0.2;

/**
 * A que fraccion de la velocidad del riel corre el grafico del fondo. Es TODO
 * el parallax: con 1 las dos capas viajarian pegadas y la seccion se leeria como
 * una sola imagen que se corre de lado.
 */
const CHART_SPEED = 0.55;

/**
 * Donde queda la punta del trazo dentro de lo que se ve, en fraccion del ancho
 * visible. La punta se **queda quieta** ahi y el grafico ya dibujado se le va
 * hacia la izquierda, como el papel de un plotter: es lo que hace ver que el
 * grafico se esta dibujando y no que ya estaba hecho.
 *
 * 0.9 y no 1 a proposito: pegada al borde derecho no se distingue de un trazo
 * que sigue fuera de pantalla.
 */
const PEN_X = 0.9;

/**
 * Suavizado del recorrido: la rueda del mouse llega a saltos de ~100px y sin
 * esto todo el capitulo se mueve a tirones.
 *
 * Va **corto a proposito**. Con un resorte blando (90 / 26 / 0.6) el retraso se
 * ve: en un scroll rapido el bloque se despega antes de que el riel termine de
 * llegar, y la seccion se va con la ultima ficha a medio camino. Medido a
 * ~500px de salto: 370px de riel sin recorrer al soltarse el clavado. Esto llega
 * en ~150ms y conserva la deriva sin perder el final.
 */
const GLIDE = { stiffness: 150, damping: 28, mass: 0.5 };

/**
 * Abajo de estos limites no se clava nada. El ancho, porque un capitulo
 * horizontal tomado del scroll vertical en un telefono le pelea al gesto de la
 * mano. El alto, porque cada diapositiva mide una pantalla y el contenido tiene
 * que entrar adentro.
 */
const PIN_MIN_WIDTH = 1024;
const PIN_MIN_HEIGHT = 640;

/** Sin clavado: las diapositivas se apilan y cada una se lee por su cuenta. */
const LOOSE = {
  is_pinned: false,
  height: 0,
  pan: 0,
  travel: 0,
  chart_width: 0,
  plot_ratio: 1,
  span: [0, 1],
  stack_end: 0,
  pan_end: 0,
  rail_end: 0,
  pen_fraction: 1,
};

/**
 * Fuera de un capitulo no hay nada clavado: cada pieza se entrega quieta.
 *
 * Los valores son `MotionValue` de verdad y no `undefined`. Quien los consume
 * los pasa por `useTransform`, que es un hook y no puede ser condicional: sin
 * esto, cada pieza tendria que fabricar su propio relleno.
 */
const chapter_context = createContext({
  is_pinned: false,
  stack_progress: motionValue(1),
  rail_x: motionValue(0),
  chart_x: motionValue(0),
  reveal: motionValue(1),
  chart_width: 0,
  plot_ratio: 1,
  rail_ref: { current: null },
});

/**
 * Lo que una diapositiva necesita saber del capitulo que la contiene.
 *
 * **Va por contexto y no por props, y es la unica vez en el sitio.** Tres piezas
 * que viven en archivos distintos —la pila, el riel y el grafico— dependen del
 * MISMO avance, y tienen que estar sincronizadas al frame o el paneo se parte.
 * Pasarlo por props obligaria a que `Problem` y `Measurement` fueran Client
 * Components enteros y a encadenar el valor por cuatro niveles de JSX.
 */
export function useChapter() {
  return useContext(chapter_context);
}

/**
 * Dos secciones, un solo tramo de scroll, y en el medio la pagina cambia de eje.
 *
 * ```
 * ┌─ pista (1 pantalla + recorrido) ────────────┐
 * │ ┌─ ventana clavada, h-screen ─────────────┐ │
 * │ │ [ diapo 1        ][ diapo 2          ]  │ │
 * │ └─────────────────────────────────────────┘ │
 * │   x: 0 ──────────────────────> -100vw       │
 * └─────────────────────────────────────────────┘
 * ```
 *
 * Tres fases sobre un unico avance:
 *
 * 1. **la pila** — las fichas suben a su lugar; la fila no se mueve.
 * 2. **el paneo** — la fila corre una pantalla entera hacia la izquierda.
 * 3. **el riel** — adentro de la diapo 2 corren las fichas; el titulo no.
 *
 * **Durante todo el capitulo la pagina no se mueve en vertical.** Es la
 * diferencia con la version anterior, donde el pase era un fundido mientras las
 * dos secciones scrolleaban: ahi el movimiento horizontal competia con el
 * vertical y el gesto no se leia.
 *
 * > **Este componente es el dueno de TODA la geometria del capitulo**, incluida
 * > la del riel y la del grafico que viven en la diapo 2. No es acoplamiento
 * > gratuito: el alto de la pista depende de cuanto mide el riel, y el avance de
 * > las tres fases sale de ese mismo alto. Repartir la medicion entre dos
 * > componentes fue exactamente lo que produjo el huevo y la gallina de la
 * > version anterior — el ancho del titulo se media de un nodo que todavia no
 * > existia porque su montaje dependia de la medicion.
 *
 * El avance sale de `scrollY` crudo y no de `useScroll({ target })`, como en todo
 * el sitio: esa version se apoya en un ScrollTimeline que no siembra su valor
 * inicial. Y las cuatro salidas pasan por un mismo `useSpring`, asi que no se
 * desincronizan entre si.
 */
export function PinnedChapter({ children, stack_steps = 0 }) {
  const track_ref = useRef(null);
  const gutter_ref = useRef(null);
  const rail_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const [track, set_track] = useState(LOOSE);

  useRemeasure(() => {
    const track_element = track_ref.current;
    const gutter_element = gutter_ref.current;
    if (!track_element || !gutter_element) return;

    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    if (
      reduced_motion ||
      viewport_width < PIN_MIN_WIDTH ||
      viewport_height < PIN_MIN_HEIGHT
    ) {
      set_track(LOOSE);
      return;
    }

    // > **Nada que lleve transform se mide con `getBoundingClientRect()`.** El
    // > rectangulo llega con el transform ya aplicado, asi que se mediria
    // > corrido y el recorrido nunca se asentaria. La sonda del margen vive
    // > FUERA de la fila justamente para poder medirse asi; el riel, que viaja,
    // > va con `offsetWidth`, que ignora los transforms.
    const gutter = gutter_element.getBoundingClientRect().left;
    const rail_width = rail_ref.current ? rail_ref.current.offsetWidth : 0;

    // El recorrido del riel termina con el mismo aire a la derecha que el
    // contenedor tiene a la izquierda: la ultima ficha queda apoyada en el borde
    // del contenido, no pegada al de la ventana.
    const travel = Math.max(
      0,
      Math.round(rail_width + gutter * 2 - viewport_width),
    );

    const stack = Math.round(STACK_PER_CARD * viewport_height * stack_steps);
    const pan = Math.round(PAN_SPAN * viewport_height);
    const hold = Math.round(HOLD_SPAN * viewport_height);
    const scrollable = stack + pan + travel + hold;
    if (scrollable <= 0) {
      set_track(LOOSE);
      return;
    }

    // La punta del trazo se mide contra la ventana ENTERA y no contra lo que
    // queda a la derecha del margen: el grafico arranca en el borde de la
    // diapositiva, porque ese pixel es la juntura con la linea del problema.
    const pen = PEN_X * viewport_width;

    // El grafico mide lo que se ve MAS lo que va a viajar, y nada mas. Con el
    // ancho del riel sobraria justo lo que el grafico no alcanza a traer a
    // pantalla —viaja mas lento—, y el pico del final no se veria nunca.
    const chart_width = Math.round(pen + CHART_SPEED * travel);
    const pin_start = track_element.getBoundingClientRect().top + window.scrollY;

    set_track({
      is_pinned: true,
      height: viewport_height + scrollable,
      pan: viewport_width,
      travel,
      chart_width,
      // El grafico se dibuja en pixeles de pantalla, asi que necesita saber
      // cuanto vale una unidad de alto contra una de ancho.
      plot_ratio: viewport_height / chart_width,
      span: [pin_start, pin_start + scrollable],
      stack_end: stack / scrollable,
      pan_end: (stack + pan) / scrollable,
      rail_end: (stack + pan + travel) / scrollable,
      // Lo que ya esta dibujado cuando arranca el riel. De aca sale que la punta
      // quede quieta: el trazo crece exactamente lo que el grafico se corre, asi
      // que `dibujado - corrimiento` no cambia en todo el recorrido.
      pen_fraction: pen / chart_width,
    });
  }, [reduced_motion, stack_steps]);

  const { is_pinned, travel, pen_fraction } = track;

  // > **Los hitos se separan aunque el capitulo este suelto.** `useTransform`
  // > necesita un rango de entrada estrictamente creciente; con dos topes
  // > iguales devuelve `NaN` y el estilo queda roto. En reposo las tres fases
  // > valen 0, asi que se reparten en tercios y da lo mismo: sin clavado ningun
  // > valor se usa.
  const stack_end = is_pinned ? track.stack_end : 1 / 4;
  const pan_end = is_pinned ? track.pan_end : 2 / 4;
  const rail_end = is_pinned ? track.rail_end : 3 / 4;

  const phase = useTransform(scrollY, track.span, [0, 1], { clamp: true });
  const glide = useSpring(phase, GLIDE);

  const stack_progress = useTransform(glide, [0, stack_end], [0, 1], {
    clamp: true,
  });
  const pan_x = useTransform(glide, [stack_end, pan_end], [0, -track.pan], {
    clamp: true,
  });
  const rail_x = useTransform(glide, [pan_end, rail_end], [0, -travel], {
    clamp: true,
  });

  // **El grafico no parallaxea durante el paneo.** Si se moviera, su punto de
  // entrada se despegaria de la juntura con la diapo 1 justo cuando se la esta
  // mirando. El parallax arranca con el riel, cuando la diapo 1 ya salio de
  // pantalla y la juntura no se ve.
  const chart_x = useTransform(
    glide,
    [pan_end, rail_end],
    [0, -travel * CHART_SPEED],
    { clamp: true },
  );

  // El dibujo del grafico ocupa el paneo Y el riel: durante el paneo llega hasta
  // la punta, y de ahi en mas crece lo mismo que el grafico se corre.
  const reveal = useTransform(
    glide,
    [stack_end, pan_end, rail_end],
    // Suelto el grafico se entrega dibujado: no hay recorrido que lo revele.
    is_pinned ? [0, pen_fraction, 1] : [1, 1, 1],
  );

  const value = {
    is_pinned,
    stack_progress,
    rail_x,
    chart_x,
    reveal,
    chart_width: track.chart_width,
    plot_ratio: track.plot_ratio,
    rail_ref,
  };

  return (
    <div
      ref={track_ref}
      style={is_pinned ? { height: track.height } : undefined}
    >
      {/* La sonda del margen: un `Container` de alto cero, fuera de la fila y
          sin transform, del que sale dónde empieza el contenido. Se mide de acá
          y no se calcula a mano para no duplicar `--container-max`.
          > **No lleva `absolute`, y esta medido.** Con `absolute` el
          > `Container` deja de centrarse —`w-full` le da el ancho entero y
          > `mx-auto` no tiene nada que repartir—, asi que la sonda devolvia 32
          > en vez de 392. Con ese numero el recorrido del riel daba negativo, se
          > acotaba a cero y **las fichas no se movian nunca**: el paneo pasaba y
          > la fase del riel no existia. En flujo normal, con `h-0`, no ocupa
          > alto y mide bien. */}
      <Container class_name="pointer-events-none h-0 overflow-hidden">
        <div ref={gutter_ref} />
      </Container>

      <div className={cn(is_pinned && "sticky top-0 h-screen overflow-hidden")}>
        {/* Clavado es una fila de diapositivas que se corre. Suelto es una
            columna: las dos secciones, una debajo de la otra, sin capítulo. */}
        <motion.div
          className={cn("flex", is_pinned ? "h-full w-max" : "flex-col")}
          style={is_pinned ? { x: pan_x } : undefined}
        >
          <chapter_context.Provider value={value}>
            {children}
          </chapter_context.Provider>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Una diapositiva del capitulo: exactamente una pantalla de ancho.
 *
 * El ancho es lo que hace que el paneo cierre. La fila corre `-100vw` y con eso
 * la diapo 2 queda calzada en la ventana; si midiera otra cosa, el paneo
 * terminaria con las dos a medio mostrar.
 *
 * Sin clavado se convierte en una seccion normal y el capitulo deja de existir:
 * el `flex` de afuera no tiene `w-max`, asi que las dos se apilan.
 */
export function ChapterSlide({ children, class_name }) {
  const { is_pinned } = useChapter();

  return (
    <section
      className={cn(
        "relative",
        is_pinned && "h-full w-screen shrink-0 overflow-hidden",
        class_name,
      )}
    >
      {children}
    </section>
  );
}
