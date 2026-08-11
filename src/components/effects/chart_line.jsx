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
const GRID_TOP = 100;

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
 * a proposito — la linea llega horizontal y recien despues empieza a medir.
 *
 * **Las alturas estan elegidas contra las fichas, no contra el plano.** El
 * carrusel va centrado en el bloque y ocupa la banda del medio (~310 a ~690 de
 * los mil), asi que un grafico prolijo entre esos dos valores no se veria: queda
 * entero tapado. Los vertices se van a las bandas de arriba y de abajo, y lo que
 * cruza la banda del medio **pasa por detras de las fichas** — el mismo recurso
 * de la linea del problema. Dos de los ocho caen adentro de la banda a
 * proposito: sin ellos la serie alterna arriba-abajo con demasiada regularidad y
 * se lee como una guarda y no como un dato.
 *
 * El ultimo es el mas alto de todos y **queda a la vista justo cuando termina el
 * recorrido**: es el remate de la seccion. Va en morado, que es el unico color
 * que se permite y para eso existe `--chart-1`.
 */
const POINTS = [
  { x: 0, y: SEAM_Y, entry: true },
  { x: 130, y: 740 },
  { x: 250, y: 250 },
  { x: 370, y: 480 },
  { x: 490, y: 770 },
  { x: 610, y: 200 },
  { x: 730, y: 750 },
  { x: 850, y: 390 },
  { x: 960, y: 130, accent: true },
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
 * `plot_ratio` es el alto de la caja sobre su ancho, y sirve para una sola cosa:
 * saber a que fraccion del trazo le toca cada vertice. Ver `THRESHOLDS`.
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
export function ChartLine({ reveal, plot_ratio = 1, class_name }) {
  /**
   * A que fraccion del dibujo le toca cada vertice.
   *
   * **No es su `x`, y tampoco el largo del camino en unidades del viewBox.** El
   * trazo se revela con `pathLength`, que termina en un `stroke-dasharray`, y con
   * `non-scaling-stroke` el navegador reparte ese dash en **pixeles de
   * pantalla**: un tramo empinado se come mas dibujo que uno plano, y cuanto se
   * come depende de la proporcion de la caja. Por eso la cuenta se hace acá, con
   * la proporcion real, y no queda escrita a mano: con `x` los puntos aparecerian
   * antes de que el trazo llegue a ellos.
   */
  const thresholds = useMemo(() => {
    const lengths = [];
    let total = 0;

    for (let index = 1; index < POINTS.length; index += 1) {
      const dx = POINTS[index].x - POINTS[index - 1].x;
      const dy = (POINTS[index].y - POINTS[index - 1].y) * plot_ratio;
      total += Math.hypot(dx, dy);
      lengths.push(total);
    }

    return lengths.map((length) => length / total);
  }, [plot_ratio]);

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
        style={{ pathLength: reveal }}
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
