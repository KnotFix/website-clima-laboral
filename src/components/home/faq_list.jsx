"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * El acordeon del FAQ: una pregunta abierta por vez.
 *
 * ## Por que no usa `motion`, que es la libreria del sitio
 *
 * Porque no hay nada que colgar del scroll. `motion` esta para lo que avanza
 * con el recorrido —el capitulo clavado, la pila, el riel— y ahi hace falta un
 * `MotionValue` por frame. Esto es un interruptor: abierto o cerrado. Una
 * transicion de CSS lo resuelve sin un solo frame de JavaScript, y
 * `prefers-reduced-motion` se apaga con una clase en vez de con una rama.
 *
 * Es el mismo criterio que ya usan los `hover` de las fichas del problema.
 *
 * ## El panel se abre con `grid-template-rows`, no con `height`
 *
 * `AGENTS.md` prohibe animar `height`: fuerza layout en cada frame. Un
 * desplegable **tiene** que cambiar de alto —lo de abajo se corre—, asi que la
 * regla no se puede cumplir al pie; lo que si se puede es elegir la version mas
 * barata y no meter JavaScript en el medio.
 *
 * La reja de una sola fila va de `0fr` a `1fr`. Es una transicion de CSS pura
 * sobre un contenedor con un unico hijo de texto, el navegador la corre en su
 * hilo, y **funciona con alto automatico**: no hay que medir el panel ni
 * escribirle una altura fija, que es lo que obliga a hacer `height`.
 *
 * El hijo lleva `overflow-hidden` y `min-h-0`. Los dos son obligatorios: sin el
 * primero el texto se ve entero con la fila en `0fr`, y sin el segundo la fila
 * nunca baja de la altura minima del contenido, que es el default de una reja.
 */
export function FaqList({ items, class_name }) {
  // Arranca todo cerrado. Abrir la primera de fabrica es comodo en una demo y
  // molesto en un sitio: mete un bloque de texto entre el titular y el resto de
  // las preguntas, que es justo el indice que alguien vino a leer.
  const [open_question, set_open_question] = useState(null);
  const base_id = useId();

  return (
    <ul className={cn("max-w-3xl", class_name)}>
      {items.map((item, index) => {
        const is_open = open_question === item.question;
        const panel_id = `${base_id}-panel-${index}`;
        const button_id = `${base_id}-button-${index}`;

        return (
          // > **Las filas NO entran con el scroll, y es a proposito.** Estaban
          //   envueltas en `ScrollPass` —llegaban de a una desde la izquierda y
          //   se atenuaban al salir— y se retiro.
          //
          //   El titular de la seccion si conserva su entrada: aparece una vez y
          //   se queda. La diferencia es que estas filas son **controles**, no
          //   texto de lectura. Un acordeon es un indice: se recorre con la
          //   vista de arriba abajo buscando la pregunta propia, y seis
          //   renglones que se acomodan de a uno mientras se los busca hacen
          //   justo lo contrario de lo que un indice tiene que hacer.
          //
          //   Ademas `ScrollPass` atenua lo que envuelve al terminar de cruzar
          //   la pantalla: con una respuesta abierta cerca del pie, el texto que
          //   alguien esta leyendo se apagaba solo.
          <li key={item.question}>
            {/* El `<h3>` va POR FUERA del boton y no adentro. Un encabezado
                  metido adentro de un boton deja de ser un hito de navegacion:
                  quien recorre la pagina por encabezados se pierde las seis
                  preguntas y solo encuentra el titulo de la seccion. */}
            <h3>
              <button
                type="button"
                id={button_id}
                aria-expanded={is_open}
                aria-controls={panel_id}
                onClick={() =>
                  set_open_question(is_open ? null : item.question)
                }
                className="group relative flex w-full items-center gap-5 py-5 text-left"
              >
                {/* El numero, adentro de un disco que aparece cuando la
                      pregunta esta abierta. El disco es una capa aparte que
                      escala desde 0: animar un `background` no se puede
                      componer, y escalar un circulo si. */}
                <span className="relative flex size-9 shrink-0 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 rounded-full bg-foreground transition-transform duration-300 ease-out motion-reduce:transition-none",
                      is_open
                        ? "scale-100"
                        : "scale-0 group-hover:scale-90 group-hover:opacity-10 group-focus-visible:scale-90 group-focus-visible:opacity-10",
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative text-sm font-medium tabular-nums transition-colors duration-200 motion-reduce:transition-none",
                      is_open ? "text-background" : "text-muted-foreground/70",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>

                <span
                  className={cn(
                    "text-lg font-medium tracking-tight transition-colors duration-200 text-pretty motion-reduce:transition-none sm:text-xl",
                    is_open
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground",
                  )}
                >
                  {item.question}
                </span>

                {/* El mas que gira 45° y queda una cruz. Es un `+` dibujado
                      con dos barras y no un icono de `lucide`: girar el nodo
                      entero es una sola transformacion, y con dos iconos
                      distintos habria que fundir uno sobre el otro. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative ms-auto size-4 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
                    is_open ? "rotate-45" : "rotate-0",
                  )}
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-foreground" />
                  <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-foreground" />
                </span>

                {/* Dos reglones en el pie: el gris de siempre y, encima, el
                      del acento que crece desde la izquierda. Se dibuja con
                      `scaleX` sobre una barra de ancho completo, que es
                      transform puro; animar el `width` seria layout. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-border"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px origin-left bg-foreground transition-transform duration-300 ease-out motion-reduce:transition-none",
                    is_open
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-[0.3] group-focus-visible:scale-x-[0.3]",
                  )}
                />
              </button>
            </h3>

            {/* El panel queda SIEMPRE en el DOM y se colapsa con la reja.
                  `hidden` lo sacaria del arbol de accesibilidad de golpe y se
                  perderia la transicion; `inert` cerrado es lo que evita que el
                  tabulador entre en un panel que no se ve.
                  Va como booleano y no como cadena vacia: desde React 19
                  `inert` es un atributo booleano de verdad, y `inert=""` se
                  interpreta como `false` — o sea, al reves de lo que se quiere. */}
            <div
              id={panel_id}
              role="region"
              aria-labelledby={button_id}
              inert={!is_open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                is_open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className={cn(
                    "max-w-prose pt-1 pb-6 ps-14 pe-8 text-base leading-relaxed text-muted-foreground text-pretty transition-opacity duration-200 motion-reduce:transition-none",
                    is_open ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
