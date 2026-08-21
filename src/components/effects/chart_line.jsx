"use client";

import { useMemo } from "react";
import { motion, useTransform } from "motion/react";

import { SEAM_Y } from "@/components/motion/scroll_line";
import { cn } from "@/lib/utils";

/**
 * El plano del grafico, en coordenadas del viewBox (1000 x 1000). El SVG se
 * estira a la caja (`preserveAspectRatio="none"`), asi que son por mil del ancho
 * del grafico y del alto del bloque clavado.
 */
const BASELINE = 900;

/**
 * El techo del plano: donde empieza la reticula y hasta donde puede subir la
 * serie.
 *
 * > **Lo decide el pie del texto de la diapositiva, no el borde del bloque.**
 * > Estaba en 100 —una decima del alto, arriba incluso del titular— y el grafico
 * > le cruzaba los renglones al parrafo: el pico del acento caia sobre la primera
 * > linea y las verticales de la reticula pasaban por el medio de las cuatro.
 * > Medido a 945px de alto, el titular vive entre 119 y 161 y el parrafo entre
 * > 182 y 320. 350 deja ~28px de aire abajo del ultimo renglon.
 */
const GRID_TOP = 350;

/**
 * La serie.
 *
 * > **El primero es la juntura, y por eso vale `SEAM_Y` y no un numero
 * > propio.** Esta en el borde IZQUIERDO de la diapositiva, a la misma altura a
 * > la que la pila del problema sale por su borde derecho — y en el capitulo
 * > clavado esos dos bordes son el mismo punto de la pantalla. Ahi es donde la
 * > linea deja de ser un hilo y se convierte en el grafico.
 * >
 * > Estaba en `{ x: 10, y: 0 }`, arriba a la izquierda, de cuando el empalme
 * > bajaba en vertical desde la seccion anterior. Nunca llego a coincidir: el
 * > grafico arrancaba despues de la columna del titulo, 360px a la derecha de
 * > donde el empalme dejaba la linea.
 *
 * No lleva punto: es de entrada, no un dato. El tramo hasta el segundo es plano
 * a proposito —la linea llega horizontal y recien despues empieza a medir—, y
 * por eso el segundo tambien vale `SEAM_Y` y no un numero copiado: si la juntura
 * se mueve, el tramo tiene que seguir siendo plano.
 *
 * **Las alturas estan elegidas contra lo que tapa la diapositiva, no contra el
 * plano.** De los mil de alto, tres bandas estan ocupadas y solo dos quedan
 * libres — medido a 945px:
 *
 * ```
 *    0 ┌──────────────────────────────┐
 *  119 │  titular                      │  ocupado
 *  182 │  parrafo                      │  ocupado
 *  320 ├───────────────────────────────┤
 *  350 │  GRID_TOP · banda de arriba   │  LIBRE  ← aca van los picos
 *  509 ├───────────────────────────────┤
 *      │  las fichas del riel          │  tapado ← aca se pasa por detras
 *  785 ├───────────────────────────────┤
 *  900 │  BASELINE · banda de abajo    │  LIBRE  ← aca van los valles
 * 1000 └───────────────────────────────┘
 * ```
 *
 * Un grafico prolijo repartido entre 0 y 1000 no se veria: la mitad cae sobre el
 * texto y la otra atras de las fichas. Los vertices se van a las dos bandas
 * libres, y lo que cruza la banda de las fichas **pasa por detras** — el mismo
 * recurso de la linea del problema. Tres de los ocho caen adentro de la banda
 * tapada a proposito: sin ellos la serie alterna arriba-abajo con demasiada
 * regularidad y se lee como una guarda y no como un dato.
 *
 * > **La forma es la misma de siempre, corrida de banda.** Las alturas se
 * > reescribieron una por una manteniendo el ORDEN entre ellas —cual es la mas
 * > alta, cual la segunda, cual el valle mas hondo— asi que la silueta no cambio:
 * > lo unico que cambio es que ya no invade el texto.
 *
 * El ultimo es el mas alto de todos y **queda a la vista justo cuando termina el
 * recorrido**: es el remate de la seccion. Va en el naranja de acento, que es el unico color
 * que se permite y para eso existe `--chart-1`.
 */
const POINTS = [
  { x: 0, y: SEAM_Y, entry: true },
  { x: 130, y: SEAM_Y },
  { x: 250, y: 430 },
  { x: 370, y: 650 },
  { x: 490, y: 880 },
  { x: 610, y: 380 },
  { x: 730, y: 855 },
  { x: 850, y: 590 },
  { x: 960, y: 365, accent: true },
];

/** El camino sale de los mismos puntos: una sola fuente para la geometria. */
const LINE = POINTS.map(
  (point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
).join(" ");

/**
 * Cuanto antes de su punto empieza a aparecer un vertice, en fraccion del
 * dibujo. Corto: con 0.02 el punto se encendia ~40px antes de que el trazo
 * llegara, y quedaba un punto flotando adelante de la linea.
 */
const DOT_FADE = 0.01;

/**
 * El grafico que corre por detras del carrusel de la medicion.
 *
 * Es la continuacion de la linea que baja del problema: el empalme la trae hasta
 * el titular y aca la seccion cambia de eje. `reveal` es una fraccion 0 → 1 y la
 * pone el riel; el grafico no sabe de scroll.
 *
 * **La reticula y el eje van siempre visibles y solo se dibuja el dato.** Es la
 * misma idea del riel de `ScrollLine`: el marco de un grafico existe antes que la
 * serie, y ver adonde va a llegar el trazo es lo que hace que dibujarse se lea
 * como que se esta midiendo algo.
 *
 * `plot_ratio` es el alto de la caja sobre su ancho y `chart_width` lo que mide
 * de ancho en px. Los dos sirven para lo mismo: pasar de las unidades del
 * viewBox a los pixeles de pantalla, que es el unico espacio en el que el avance
 * del dibujo significa algo. Ver `draw_scale`.
 *
 * > **Los puntos son tramos de largo casi cero con punta redonda**, no
 * > `<circle>`. Con `preserveAspectRatio="none"` la caja se estira distinto en
 * > cada eje —el ancho del grafico contra el alto del bloque— y un circulo
 * > saldria ovalado. El grosor del trazo, en cambio, lo fija
 * > `non-scaling-stroke` en pixeles de pantalla, asi que la punta redonda es un
 * > circulo de verdad en cualquier proporcion.
 *
 * > **No lleva ni un numero ni una etiqueta.** Ningun texto visible del sitio
 * > vive en un componente, y un eje con valores inventados seria dato falso sobre
 * > el producto. De este grafico se lee la forma.
 */
export function ChartLine({
  reveal,
  plot_ratio = 1,
  chart_width = 0,
  class_name,
}) {
  /**
   * Los dos largos del mismo camino, y por que no son el mismo numero.
   *
   * - **En pantalla** (`screen`): lo que se recorre con la caja ya estirada. Es
   *   el largo que le importa a quien mira, y contra el que hay que medir el
   *   avance para que la cabeza del trazo no cambie de velocidad al pasar de un
   *   tramo plano a uno empinado.
   * - **En unidades del viewBox** (`user`): el largo de la geometria, sin
   *   estirar.
   *
   * `preserveAspectRatio="none"` estira los dos ejes distinto —el ancho del
   * grafico contra el alto del bloque— asi que los dos largos no se parecen: hoy
   * 3032px contra 2518 unidades.
   */
  const { thresholds, draw_scale } = useMemo(() => {
    // px de pantalla por unidad de viewBox en x. El de y sale de `plot_ratio`,
    // que es justamente la proporcion entre los dos.
    const scale_x = chart_width / 1000;
    const cumulative = [];
    let screen = 0;
    let user = 0;

    for (let index = 1; index < POINTS.length; index += 1) {
      const dx = POINTS[index].x - POINTS[index - 1].x;
      const dy = POINTS[index].y - POINTS[index - 1].y;
      screen += Math.hypot(dx, dy * plot_ratio) * scale_x;
      user += Math.hypot(dx, dy);
      cumulative.push(screen);
    }

    return {
      // A que fraccion del dibujo le toca cada vertice. **No es su `x`, y
      // tampoco el largo en unidades del viewBox**: un tramo empinado se come
      // mas dibujo que uno plano, y cuanto se come depende de la proporcion de
      // la caja. Con `x` los puntos aparecerian antes de que el trazo llegue.
      thresholds: cumulative.map((length) => length / screen),
      // > **Por que el avance se multiplica por algo mayor que 1.**
      // > `pathLength="1"` calibra el guion contra el largo en unidades del
      // > viewBox, pero `non-scaling-stroke` lo reparte en pixeles de pantalla.
      // > O sea que un avance de 1 dibuja `user` **pixeles** de un camino que
      // > mide `screen`: medido, se quedaba en el 83% y el pico del acento —el
      // > remate de la seccion— quedaba de punto suelto, sin linea que llegara.
      // > De paso corrige que los puntos se encendieran adelantados: sus hitos
      // > siempre estuvieron en pantalla y el trazo no.
      draw_scale: user > 0 && screen > 0 ? screen / user : 1,
    };
  }, [plot_ratio, chart_width]);

  const draw = useTransform(reveal, (value) => value * draw_scale);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className={cn("absolute inset-0 h-full w-full", class_name)}
    >
      {/* La reticula: una vertical por vertice, del eje para arriba. Es lo que
          convierte al trazo en un grafico y no en una linea suelta. */}
      {POINTS.slice(1).map((point) => (
        <line
          key={point.x}
          x1={point.x}
          y1={GRID_TOP}
          x2={point.x}
          y2={BASELINE}
          stroke="var(--org-line)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.35"
        />
      ))}
      <line
        x1="0"
        y1={BASELINE}
        x2="1000"
        y2={BASELINE}
        stroke="var(--org-line)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        opacity="0.6"
      />

      {/* La serie. `pathLength` es la misma tecnica de `ScrollLine`: un trazo
          quebrado no se puede dibujar escalando, porque escalar le cambia la
          forma y no el largo. */}
      <motion.path
        d={LINE}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.6"
        style={{ pathLength: draw }}
      />

      {POINTS.slice(1).map((point, index) => (
        <ChartDot
          key={point.x}
          reveal={reveal}
          at={thresholds[index]}
          {...point}
        />
      ))}
    </svg>
  );
}

/**
 * Un vertice, que aparece cuando el trazo lo alcanza.
 *
 * Es un componente propio y no un `<path>` dentro del `map` porque cada uno
 * necesita su `useTransform`, y un hook adentro de un callback rompe las reglas
 * de hooks. El pico ademas lleva un halo: es el remate del recorrido.
 */
function ChartDot({ reveal, x, y, at, accent = false }) {
  // La rampa TERMINA en el punto, no antes: el vertice llega a pleno justo
  // cuando el trazo lo toca.
  const opacity = useTransform(reveal, [at - DOT_FADE, at], [0, 1]);

  return (
    <motion.g style={{ opacity }}>
      {accent && (
        <path
          d={`M ${x} ${y} l 0.01 0`}
          stroke="var(--chart-1)"
          strokeWidth="18"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.18"
        />
      )}
      <path
        d={`M ${x} ${y} l 0.01 0`}
        stroke={accent ? "var(--chart-1)" : "var(--foreground)"}
        strokeWidth={accent ? 10 : 7}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity={accent ? 1 : 0.55}
      />
    </motion.g>
  );
}
