"use client";

import { createContext, useContext, useRef, useState } from "react";
import { motion, useTransform } from "motion/react";

import { useChapter } from "@/components/motion/pinned_chapter";
import { SETTLE_SCALE } from "@/components/motion/scroll_pass";
import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { useRemeasure } from "@/components/motion/use_remeasure";
import { cn } from "@/lib/utils";

/**
 * El escalon entre ficha y ficha, en px. **Es lo que se ve de las de abajo una
 * vez apiladas**: sin el, la ultima taparia a todas y la pila no se leeria como
 * pila.
 *
 * Eran 16 cuando la pila vivia en la columna derecha y las fichas eran altas.
 * Con la pila centrada y las fichas mas bajas, 16 quedaba en el ruido del canto
 * del vidrio y los tres asomos se leian como un borde grueso.
 *
 * > **El techo lo pone el aire de arriba de la ficha, y hay que medirlo contra
 * > la escala.** En el asomo no puede aparecer el titulo de la ficha de atras:
 * > medio renglon de texto cortado se lee como un error de maquetado. El titulo
 * > empieza a `padding-top` del borde, pero la ficha esta achicada, asi que en
 * > pantalla cae a `padding-top × escala`. Con `pt-7` (28px) y la ficha mas
 * > profunda en 0.93 eso da 26px: 20 deja 6px de margen. A 22 el titulo asomaba.
 */
const STACK_STEP = 20;

/**
 * Cuanto se achica una ficha por cada ficha que le cae encima.
 *
 * **Es la profundidad de la pila, y es lo unico que la produce.** Sin esto las
 * tres fichas se leen en el mismo plano, una tapando a la otra como papeles
 * sueltos; con esto la de atras se ve mas lejos y el asomo de arriba se entiende
 * como el canto de algo que quedo abajo.
 *
 * 0.035 sobre una ficha de ~800px son 28px menos de ancho por nivel: se nota sin
 * que el texto de la de atras se vea reescalado — de eso asoman 22px y en esa
 * franja no hay letras.
 *
 * **No hay desenfoque de profundidad a proposito.** El original de React Bits
 * ofrece `blurAmount`; aca seria un filtro sobre texto, que es justo lo que el
 * sitio no hace, y ademas se apagaria en telefono. La escala sola alcanza.
 */
const DEPTH_SCALE = 0.035;

/**
 * Que fraccion de su turno tarda una ficha en llegar. Menos de 1 deja un
 * respiro entre que una se acomoda y arranca la siguiente; con 1 la pila se
 * arma sin pausa y las tres se leen como una sola cosa que crece.
 *
 * **Ademas es lo que hace que los turnos no se pisen**, y de eso depende que la
 * profundidad se pueda escribir como una sola interpolacion — ver `depth_at`.
 */
const SLOT_FILL = 0.85;

/**
 * Aire entre el borde de abajo de la diapositiva y donde arranca una ficha, en
 * px. Sin el, la ficha empieza justo sobre el borde y su sombra ya se ve antes
 * de que salga.
 */
const ENTER_MARGIN = 48;

/**
 * De cuanto mas abajo entra una ficha mientras la medicion no llego.
 *
 * Es un valor de emergencia, no el que se usa: en el primer pintado todavia no
 * hay caja que medir, y una ficha con caida 0 apareceria puesta en su lugar por
 * un frame.
 */
const ENTER_DROP_FALLBACK = 420;

/**
 * De cuanto mas abajo entra cada ficha, en px.
 *
 * **Va por contexto y no por prop porque lo mide la pila y lo usa la ficha**, y
 * en el medio esta todo el JSX de la seccion: pasarlo a mano obligaria a que
 * cada `StackCard` de `problem.jsx` cargara un numero que no le importa.
 */
const stack_context = createContext(ENTER_DROP_FALLBACK);

/**
 * La pila de fichas del problema.
 *
 * > **Esto era CSS `sticky`, despues una pila en la columna derecha, y ahora es
 * > el gesto del ScrollStack: las fichas suben desde abajo del borde y se clavan
 * > una sobre otra debajo del titular.** Lo que no cambio nunca es de que cuelga
 * > el movimiento: adentro de un bloque clavado la pagina no se mueve en
 * > vertical, asi que `position: sticky` no tiene contra que pegarse y el avance
 * > tiene que venir del capitulo (`stack_progress`), no de `scrollY`.
 * >
 * > Lo que se gano contra la version de la columna derecha: **el titular es la
 * > cabecera de la pila y no una columna vecina**. Al lado, el titular competia
 * > con las fichas por la mirada y cada ficha entraba en diagonal sobre la
 * > anterior, translucida; el texto de la de atras se leia a traves de la de
 * > adelante. Arriba y centrado, el titular se lee una vez y despues pasan las
 * > fichas.
 *
 * Sin capitulo clavado —telefono, pantalla baja, movimiento reducido— no se
 * apila nada: las fichas van una debajo de otra y se leen scrolleando. Apilar
 * tres tarjetas que nadie puede desapilar seria esconder contenido.
 */
export function CardsStack({ children, class_name }) {
  const { is_pinned } = useChapter();
  const stack_ref = useRef(null);
  const [enter_drop, set_enter_drop] = useState(ENTER_DROP_FALLBACK);
  const count = Array.isArray(children) ? children.length : 1;

  // **La caida se mide contra la diapositiva, no contra la ventana.** Es lo que
  // la hace independiente del scroll: `rect.top` solo valdria lo que se busca en
  // los frames en que el capitulo esta clavado, y esta medicion corre al montar,
  // cuando el capitulo todavia esta una pantalla mas abajo.
  //
  // `ChapterSlide` es `relative` y `Container` no esta posicionado, asi que el
  // `offsetParent` de la pila es la diapositiva: `offsetTop` es la distancia
  // desde su borde de arriba y `clientHeight` es lo que mide de alto.
  useRemeasure(() => {
    const node = stack_ref.current;
    const slide = node?.offsetParent;
    if (!node || !slide) return;

    set_enter_drop(
      Math.max(
        slide.clientHeight - node.offsetTop + ENTER_MARGIN,
        ENTER_DROP_FALLBACK,
      ),
    );
  }, [is_pinned]);

  if (!is_pinned) {
    return (
      <div className={cn("flex flex-col gap-6", class_name)}>{children}</div>
    );
  }

  return (
    // El `grid` con todas las fichas en la MISMA celda es lo que las superpone
    // sin sacarlas del flujo: la celda mide lo que la mas alta, asi que el
    // bloque no depende de medir nada. El `padding` de abajo es el espacio que
    // el escalon de la ultima se lleva — un `translate` no ocupa alto.
    <div
      ref={stack_ref}
      className={cn("grid", class_name)}
      style={{ paddingBottom: (count - 1) * STACK_STEP }}
    >
      <stack_context.Provider value={enter_drop}>
        {children}
      </stack_context.Provider>
    </div>
  );
}

/**
 * Los hitos del avance donde la escala de una ficha cambia de pendiente.
 *
 * Son los dos bordes de la ventana de llegada de CADA ficha, en orden, mas el
 * final. Entre dos hitos consecutivos no hay ninguna ficha que empiece ni
 * termine de llegar, asi que ahi todo es lineal.
 */
function slot_stops(count) {
  const slot = 1 / count;
  const stops = [];

  for (let index = 0; index < count; index += 1) {
    stops.push(index * slot, index * slot + slot * SLOT_FILL);
  }

  // El ultimo borde cae en `1 - 0.15 * slot`, siempre antes del final. Sin este
  // hito la interpolacion se quedaria sin rango justo en el tramo en que el
  // capitulo sostiene la pila armada.
  stops.push(1);

  return stops;
}

/** Cuanto llego la ficha `index` con el avance en `progress`, de 0 a 1. */
function arrival_at(progress, index, count) {
  const slot = 1 / count;
  const from = index * slot;

  return Math.min(Math.max((progress - from) / (slot * SLOT_FILL), 0), 1);
}

/**
 * Cuantas fichas le cayeron encima a la ficha `index`, con decimales.
 *
 * El decimal es lo que hace que la de atras se vaya achicando MIENTRAS la de
 * adelante sube, y no de un salto cuando termina de llegar.
 */
function depth_at(progress, index, count) {
  let depth = 0;

  for (let other = index + 1; other < count; other += 1) {
    depth += arrival_at(progress, other, count);
  }

  return depth;
}

/**
 * Una ficha de la pila. Sube desde abajo del borde y se clava en su escalon.
 *
 * `index` decide tres cosas: el turno dentro de la fase 1, el escalon de reposo
 * y cuantas fichas le van a caer encima. El orden de pintado sale del DOM —la
 * ultima va arriba— y por eso no hay `z-index` en ninguna.
 */
export function StackCard({ children, index, count, class_name }) {
  const { is_pinned, stack_progress } = useChapter();
  const enter_drop = useContext(stack_context);
  const reduced_motion = useReducedMotionSafe();

  const rest = index * STACK_STEP;
  const slot = 1 / count;
  const from = index * slot;
  const to = from + slot * SLOT_FILL;

  // Los hooks no pueden ser condicionales: los tres valores se arman siempre y
  // lo que se decide despues es si se usan.
  const y = useTransform(
    stack_progress,
    [from, to],
    [rest + enter_drop, rest],
    { clamp: true },
  );
  const opacity = useTransform(stack_progress, [from, to], [0, 1], {
    clamp: true,
  });

  // **Una sola interpolacion para dos cosas: el aterrizaje y la profundidad.**
  //
  // El aterrizaje es el mismo numero que el resto del sitio, `SETTLE_SCALE`,
  // importado y no repetido. La profundidad es lo nuevo: la ficha se sigue
  // achicando despues de llegar, una vez por cada ficha que le cae encima.
  //
  // Las dos son lineales por tramos sobre la MISMA grilla de hitos —los turnos
  // no se pisan, de eso se encarga `SLOT_FILL`— asi que su producto evaluado en
  // cada hito describe la curva entera. Sale un `useTransform` por ficha, igual
  // que antes: no se paga nada mas por frame.
  const stops = slot_stops(count);
  const scales = stops.map((stop) => {
    const landing =
      SETTLE_SCALE + (1 - SETTLE_SCALE) * arrival_at(stop, index, count);

    return landing * (1 - depth_at(stop, index, count) * DEPTH_SCALE);
  });
  const scale = useTransform(stack_progress, stops, scales, { clamp: true });

  if (!is_pinned || reduced_motion) {
    return <div className={cn(class_name)}>{children}</div>;
  }

  return (
    <motion.div
      // Todas en la misma celda del grid: es lo que las hace pila.
      //
      // `origin-top` no es cosmetico. Achicando desde el centro, el borde de
      // arriba de una ficha de atras BAJA al achicarse y el abanico de asomos
      // deja de estar parejo: los 22px del escalon se comen solos. Desde arriba,
      // el borde superior queda clavado en `index * STACK_STEP` y lo unico que
      // se mueve es cuanto sobresale a los costados.
      className={cn("col-start-1 row-start-1 origin-top", class_name)}
      style={{ y, opacity, scale }}
    >
      {children}
    </motion.div>
  );
}
