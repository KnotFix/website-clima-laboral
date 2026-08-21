"use client";

import { useId, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { useRemeasure } from "@/components/motion/use_remeasure";
import { cn } from "@/lib/utils";

/**
 * La ruta que une los cuatro pasos, en coordenadas del viewBox. El ancho es 100
 * y el alto 1000, y el SVG se estira al contenedor
 * (`preserveAspectRatio="none"`), asi que estos numeros son porcentajes: `x` del
 * ancho de la reja, `y` del alto.
 *
 * Sale del **borde derecho** de la ficha 1, cruza a la 2 —que va pegada a la
 * derecha—, vuelve a la izquierda para la 3 y cruza otra vez para la 4. Las
 * fichas miden ~30 del ancho, asi que la columna izquierda termina cerca de 30 y
 * la derecha arranca cerca de 70: por eso los extremos caen ahi y no en 0 y 100.
 *
 * Las alturas son los centros de las cuatro filas, medidos en el navegador: 110,
 * 349, 609 y 880 por mil. Van redondeadas, porque el alto de una ficha cambia
 * con el largo del texto y con el idioma; los extremos se meten abajo de la
 * ficha, asi que un par de puntos de corrimiento no se ven.
 *
 * **No estan repartidas parejo, y no es un error.** Las filas no miden lo mismo:
 * la tercera es la mas alta —el paso del estudio es el de texto mas largo— y eso
 * corre los centros de las de abajo. Por eso los numeros salen de medir y no de
 * dividir mil en cuatro.
 *
 * > **Un tramo por par de fichas, y agregar un paso es agregar un tramo.** Con
 * > la seccion en tres pasos esto eran dos curvas entre 160, 500 y 840; con el
 * > cuarto paso son tres, y las alturas se recalcularon todas — no alcanza con
 * > pegarle una curva al final, porque las filas se corrieron para arriba.
 *
 * > **Sin atajos `S`, por lo mismo que anota `scroll_line.jsx`.** `S` refleja el
 * > tirador anterior, y con la caja estirada (`preserveAspectRatio="none"`) esa
 * > reflexion se calcula en el espacio deformado: la curva se va del bloque por
 * > un costado y vuelve. Con cada tirador escrito no hay nada que adivinar.
 */
const TRAIL = [
  `M 30 110`,
  `C 52 110, 54 350, 70 350`,
  `C 46 350, 48 610, 30 610`,
  `C 52 610, 54 880, 70 880`,
].join(" ");

/**
 * Donde empieza y donde termina de dibujarse, en altos de ventana medidos contra
 * el bloque. Arranca cuando el bloque asoma por abajo (`0.85` de la ventana) y
 * esta completo cuando su pie llega a la mitad larga (`0.6`).
 *
 * Es a proposito mas corto que el cruce entero: la ruta tiene que estar cerrada
 * mientras las tres fichas se leen juntas, no terminarse recien cuando la
 * seccion ya se esta yendo.
 */
const DRAW_START = 0.85;
const DRAW_END = 0.6;

/**
 * Trazo punteado que une las fichas de los pasos, dibujado por el scroll.
 *
 * **Punteado y no solido a proposito.** La linea solida ya es el motivo del
 * capitulo problema -> medicion, donde hilvana la pila y termina convirtiendose
 * en el grafico. Aca tiene que leerse como otra cosa: una ruta de un paso al
 * siguiente, no el mismo hilo cruzando la pagina de nuevo.
 *
 * Es funcion del avance, no una animacion que se dispara: bajando crece,
 * subiendo se retrae, y en cualquier posicion vale lo mismo. Por eso no tiene
 * `once` ni disparo al entrar al viewport.
 *
 * > **Mide contra `scrollY` crudo y no con `useScroll({ target })`.** Esa
 * > version se apoya en un ScrollTimeline del navegador que no siembra su valor
 * > inicial: entrando a la pagina con el scroll ya abajo, el trazo sale en 0 y
 * > se corrige recien al primer movimiento. Esta la misma nota en
 * > `scroll_pass.jsx`, que mide igual.
 *
 * `vector-effect="non-scaling-stroke"` no es opcional con
 * `preserveAspectRatio="none"`: sin eso el estirado se le aplica tambien al
 * grosor, y el punteado saldria finito en los tramos verticales y grueso en los
 * horizontales, con los puntos deformados de paso.
 */
export function StepsTrail({ class_name }) {
  const container_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const mask_id = useId();

  const [span, set_span] = useState([0, 1]);

  useRemeasure(() => {
    const element = container_ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const top_in_document = rect.top + window.scrollY;
    const viewport = window.innerHeight;

    set_span([
      top_in_document - viewport * DRAW_START,
      top_in_document + rect.height - viewport * DRAW_END,
    ]);
  });

  const draw = useTransform(scrollY, span, [0, 1], { clamp: true });

  return (
    // El div se mide y el SVG se dibuja. Van separados porque el que mide tiene
    // que ser un elemento comun: `getBoundingClientRect` sobre un SVG estirado
    // devuelve la caja del elemento, no la del bloque que nos interesa.
    <div
      ref={container_ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", class_name)}
    >
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="hidden h-full w-full md:block"
      >
        {/* **El avance va en una mascara y no en el trazo visible.**
            `pathLength` no dibuja: lo que hace es escribir `stroke-dasharray`
            —ver `motion-dom/render/svg/utils/path`—, o sea que se pelea por el
            mismo atributo con el que hace el punteado. Puestos juntos, gana
            `pathLength` y la linea sale solida.
            Con la mascara cada uno usa su atributo: el trazo de abajo es
            punteado y quieto, y el de la mascara —solido, blanco y mas grueso—
            es el que crece y va destapando los puntos que ya cruzo. */}
        <mask id={mask_id}>
          {/* **La mascara NO lleva `non-scaling-stroke`, y es a proposito.**
              El viewBox se estira 11x en x y 0.85x en y, o sea que el largo del
              camino no es el mismo medido en coordenadas del viewBox que medido
              en pantalla. `pathLength` normaliza contra el primero y el trazo
              constante se dibuja contra el segundo: puestos juntos, el avance se
              queda corto y la ruta nunca termina de destaparse (se cortaba en la
              ficha 2 con el avance en 1). Sin el, las dos cuentas viven en el
              mismo espacio.
              El grosor va en unidades del viewBox y sobrado: lo unico que hay
              abajo es una linea de 2px, asi que taparla de mas no se ve. */}
          <motion.path
            d={TRAIL}
            fill="none"
            stroke="#fff"
            strokeWidth="14"
            strokeLinecap="round"
            // Con movimiento reducido no se pone `pathLength` y la mascara
            // queda abierta entera: la ruta se entrega dibujada y quieta.
            // Dibujarse es el efecto, la ruta es el contenido, y media ruta
            // seria informacion perdida.
            style={reduced_motion ? undefined : { pathLength: draw }}
          />
        </mask>

        <path
          d={TRAIL}
          fill="none"
          stroke="var(--org-line)"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          mask={`url(#${mask_id})`}
        />
      </svg>
    </div>
  );
}
