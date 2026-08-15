"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/** La misma curva que usan `Reveal`, `BlurText` y `WordPullUp`. */
const EASE = [0.16, 1, 0.3, 1];

/** Retraso entre pieza y pieza de la parte de arriba de una maqueta. */
const PIECE_STAGGER = 0.12;

/**
 * Cuanto espera la primera barra despues de la ultima pieza de arriba. Las
 * barras son la CONSECUENCIA de lo que se armo arriba —el cruce, los pesos, la
 * comparacion—, asi que tienen que llegar despues: creciendo a la vez, la
 * maqueta entera se mueve de golpe y no se lee que una cosa produce la otra.
 */
const BAR_DELAY = 0.2;

/** Retraso entre una barra y la siguiente. */
const BAR_STAGGER = 0.12;

const list_variants = {
  hidden: {},
  shown: { transition: { staggerChildren: PIECE_STAGGER } },
};

const piece_variants = {
  hidden: { opacity: 0, scale: 0.94, y: 6 },
  shown: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

/**
 * De la escala sale la fraccion de cada barra. Va por el numero y no a ojo: si
 * manana el copy dice 3,8 la barra tiene que acompanar sola.
 *
 * El `replace` es por el idioma: en español el decimal es coma y `Number("3,4")`
 * da NaN.
 */
function to_ratio(score, scale_max) {
  const value = Number(String(score).replace(",", "."));
  const max = Number(String(scale_max).replace(",", "."));
  return Math.min(1, value / max);
}

/**
 * El marco de una maqueta.
 *
 * Va sobre `.org-canvas`, la misma superficie del organigrama de la escala. Es a
 * proposito: las maquetas tienen que leerse como una parte mas del producto y no
 * como una ilustracion de la pagina de marketing.
 *
 * `figure` con `aria-label` y no un `div`: son imagenes compuestas con texto, y
 * sin el nombre quien las recorre con un lector se encuentra chips y numeros
 * sueltos sin saber que son.
 */
function ShotFrame({ title, a11y_label, children, class_name }) {
  return (
    <figure
      aria-label={a11y_label}
      className={cn("org-canvas rounded-xl bg-card p-5 sm:p-6", class_name)}
    >
      <figcaption className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </figcaption>
      {children}
    </figure>
  );
}

/** Los chips de un cruce. Son contenido: dicen que filtros estan puestos. */
function ChipRow({ chips, reduced_motion }) {
  return (
    <motion.ul
      className="mt-4 flex flex-wrap gap-2"
      variants={reduced_motion ? undefined : list_variants}
      initial={reduced_motion ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: "some" }}
    >
      {chips.map((chip) => (
        <motion.li
          key={chip}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-foreground/80"
          variants={reduced_motion ? undefined : piece_variants}
        >
          {chip}
          {/* La cruz dice que el filtro se puede sacar, o sea que esto es un
              control y no una etiqueta impresa. Decorativa: quien no ve la
              maqueta no gana nada con "cerrar". */}
          <X aria-hidden="true" className="size-3 text-muted-foreground" />
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** El conteo de la muestra, que es de que tamano es el grupo del que se habla. */
function SampleCount({ count, label, class_name }) {
  return (
    <div className={cn("flex items-baseline gap-2", class_name)}>
      <span className="text-2xl font-semibold tabular-nums">{count}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Una barra de resultado.
 *
 * **Crece con `scaleX` y no con `width`.** El ancho fuerza layout en cada frame;
 * la escala la resuelve el compositor. El origen va a la izquierda para que
 * crezca desde el eje y no desde el centro.
 *
 * El valor NO va adentro de la barra: escalar el padre le deforma las letras a
 * los hijos.
 *
 * **La etiqueta va ARRIBA de la barra y no al lado.** Al lado hay que fijarle un
 * ancho a la columna de texto, y ahi cualquier etiqueta larga —"General de la
 * empresa", "This cross-section"— parte en dos renglones y le cambia el alto a
 * una fila sola, con las barras desalineadas. Arriba, el largo del texto deja de
 * importar y las filas miden lo mismo en los dos idiomas.
 */
function ScoreBar({ label, value, ratio, accent, delay, reduced_motion }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium tabular-nums">{value}</span>
      </div>
      <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-muted">
        <motion.span
          className="block h-full w-full origin-left rounded-full"
          // El morado va SOLO en la barra que la seccion promete; la de
          // referencia queda gris, que es exactamente su papel.
          style={{ background: accent ? "var(--chart-1)" : "var(--chart-3)" }}
          initial={reduced_motion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: ratio }}
          viewport={{ once: true, amount: "some" }}
          transition={
            reduced_motion
              ? { duration: 0 }
              : { duration: 0.9, delay, ease: EASE }
          }
        />
      </span>
    </div>
  );
}

/**
 * Las barras de una maqueta, con su escalonado ya calculado.
 *
 * `lead` es cuantas piezas hubo arriba: de ahi sale cuanto tiene que esperar la
 * primera barra para llegar despues de todas.
 */
function ScoreBars({ bars, scale_max, lead = 0, reduced_motion }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {bars.map((bar, index) => (
        <ScoreBar
          key={bar.label}
          label={bar.label}
          value={bar.value}
          ratio={to_ratio(bar.value, scale_max)}
          accent={index === 0}
          delay={lead * PIECE_STAGGER + BAR_DELAY + index * BAR_STAGGER}
          reduced_motion={reduced_motion}
        />
      ))}
    </div>
  );
}

/** Una linea divisoria con el aire de arriba y abajo ya puesto. */
const DIVIDER = "mt-5 border-t border-border pt-5";

/**
 * 01 — Uni filtros entre si: el cruce armado y lo que da contra el general.
 *
 * Los dos numeros comparados son el argumento entero de la seccion: el cruce
 * dice algo que el promedio general escondia.
 */
export function CrossShot({ shot, scale_max, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  return (
    <ShotFrame
      title={shot.title}
      a11y_label={shot.a11y}
      class_name={class_name}
    >
      <ChipRow chips={shot.chips} reduced_motion={reduced_motion} />
      <SampleCount
        count={shot.count}
        label={shot.count_label}
        class_name={DIVIDER}
      />
      <ScoreBars
        bars={shot.bars}
        scale_max={scale_max}
        lead={shot.chips.length}
        reduced_motion={reduced_motion}
      />
    </ShotFrame>
  );
}

/**
 * 02 — Ponderá por categoria: los pesos puestos, y el ponderado contra el simple.
 *
 * El peso va en su propia pastilla a la derecha del nombre. Es lo que hace leer
 * la fila como un control con un valor y no como un item de una lista.
 */
export function WeightsShot({ shot, scale_max, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  return (
    <ShotFrame
      title={shot.title}
      a11y_label={shot.a11y}
      class_name={class_name}
    >
      <motion.ul
        className="mt-4 flex flex-col gap-2"
        variants={reduced_motion ? undefined : list_variants}
        initial={reduced_motion ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: "some" }}
      >
        {shot.categories.map((category) => (
          <motion.li
            key={category.label}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-3 py-2"
            variants={reduced_motion ? undefined : piece_variants}
          >
            <span className="text-xs text-foreground/80">{category.label}</span>
            <span className="text-xs font-medium tabular-nums text-brand">
              {category.weight}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <div className={DIVIDER}>
        <ScoreBars
          bars={shot.bars}
          scale_max={scale_max}
          lead={shot.categories.length}
          reduced_motion={reduced_motion}
        />
      </div>
    </ShotFrame>
  );
}

/**
 * 03 — Compará poblaciones equivalentes: dos segmentos, y al pie lo que los hace
 * comparables.
 *
 * El pie no es letra chica de relleno: es la razon por la que la comparacion
 * vale. Sin el, dos barras una arriba de la otra no dicen nada que un Excel no
 * pueda dibujar.
 */
export function CompareShot({ shot, scale_max, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  return (
    <ShotFrame
      title={shot.title}
      a11y_label={shot.a11y}
      class_name={class_name}
    >
      <ScoreBars
        bars={shot.bars}
        scale_max={scale_max}
        reduced_motion={reduced_motion}
      />
      <p
        className={cn(
          DIVIDER,
          "text-xs leading-relaxed text-muted-foreground text-pretty",
        )}
      >
        {shot.footnote}
      </p>
    </ShotFrame>
  );
}

/**
 * 04 — Sabé cuándo no alcanza: un cruce que se quedo sin muestra.
 *
 * **La barra va vacia y punteada, y el valor es una raya.** Es el remate de la
 * maqueta: donde las otras tres muestran un numero, esta muestra que no lo hay.
 * Dibujar una barra corta seria justo lo contrario de lo que dice el punto.
 *
 * Sin rojo: la paleta del sitio es blanco y negro con el morado de acento, y
 * ademas esto no es un error — es el sistema haciendo lo que tiene que hacer.
 */
export function ThresholdShot({ shot, class_name }) {
  const reduced_motion = useReducedMotionSafe();

  return (
    <ShotFrame
      title={shot.title}
      a11y_label={shot.a11y}
      class_name={class_name}
    >
      <ChipRow chips={shot.chips} reduced_motion={reduced_motion} />
      <SampleCount
        count={shot.count}
        label={shot.count_label}
        class_name={DIVIDER}
      />

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {shot.result_label}
          </span>
          <span
            aria-hidden="true"
            className="text-sm font-medium text-muted-foreground"
          >
            &mdash;
          </span>
        </div>
        {/* Punteada y hueca: el lugar de la barra existe y esta vacio. */}
        <span className="mt-1.5 block h-2 rounded-full border border-dashed border-border" />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground text-pretty">
        {shot.notice}
      </p>
    </ShotFrame>
  );
}

/**
 * > **El orden de las cuatro NO vive aca.** Estaba, como un array
 * > `SYSTEM_SHOTS`, y no funciona: este archivo es `"use client"`, y de un
 * > modulo cliente un Server Component solo puede importar COMPONENTES. Un
 * > valor comun —un array, un objeto— le llega como referencia de cliente y no
 * > como el dato, asi que `SYSTEM_SHOTS[index]` salia `undefined` y la pagina
 * > devolvia 500. El orden vive en `weights_filters.jsx`, que es el que arma la
 * > lista, y de aca salen las cuatro maquetas sueltas.
 */
