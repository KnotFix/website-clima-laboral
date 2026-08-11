"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { OrgChart } from "@/components/home/org_chart";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { Container } from "@/components/site/container";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Alto reservado para el organigrama.
 *
 * Es FIJO y no lo pone el contenido: los cuatro arboles tienen profundidades
 * distintas (2, 3, 3 y 4 niveles), asi que dejandolo libre el panel cambia de
 * alto en cada pestana y todo lo de abajo pega un salto. Tiene que entrar el
 * mas alto de los cuatro.
 */
const CHART_MIN_HEIGHT = "24rem";

/** Desde que ancho la lista pasa de fila a columna. Es el `lg` de Tailwind. */
const COLUMN_MIN_WIDTH = "(min-width: 1024px)";

/**
 * La escala: cuatro organizaciones, de la mas chica a la mas grande, y el mismo
 * arbol cada vez mas profundo.
 *
 * > **Esto se recorria con el scroll y ahora son pestanas.** Habia una pista de
 * > 180vh y un bloque clavado que cambiaba de organizacion segun donde estuviera
 * > la pagina, con el menu girando como un tambor. Se cambio por pestanas: **el
 * > cambio lo dispara la persona, no el scroll.** Con eso se fueron
 * > `useScrollSteps`, la pista, el `sticky` y el tambor 3D — y tambien la rama
 * > de movimiento reducido, que existia justamente porque clavar un bloque y
 * > cambiarle el contenido por debajo es lo que esa preferencia pide que no
 * > pase. Un control que se clickea no tiene ese problema.
 */
export function ScaleTree({ dict }) {
  const orgs = dict.scale_orgs;
  const reduced_motion = useReducedMotionSafe();
  const [is_column, set_is_column] = useState(false);

  // Controlado y no `defaultValue`: el tamaño que se despliega necesita saber
  // cuál está activa desde JavaScript, no solo desde CSS. Con un `data-*` se
  // podría pintar, pero no marcar `aria-hidden` — y sin eso un lector de
  // pantalla anuncia las cuatro cifras aunque tres estén plegadas.
  const [active, set_active] = useState("0");

  // > **La orientacion tiene que coincidir con lo que se ve.** No es cosmetica:
  // > decide que flechas mueven el foco — vertical usa arriba/abajo, horizontal
  // > izquierda/derecha. Con la lista en columna en escritorio y en fila en
  // > telefono, un valor fijo deja el teclado peleado con el dibujo.
  // >
  // > Arranca en `false` y se corrige despues del montaje, como
  // > `useReducedMotionSafe`. No hay salto visible: lo unico que cambia es un
  // > atributo y el manejo de teclado.
  useEffect(() => {
    const query = window.matchMedia(COLUMN_MIN_WIDTH);
    const sync = () => set_is_column(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <section className="border-t border-border py-24 sm:py-32">
      <Container>
        <ScrollPass {...HEADING_PASS}>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.scale_title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
              {dict.scale_body}
            </p>
          </div>
        </ScrollPass>

        {/* > **La raiz es la primitiva de Radix y no el `Tabs` del registro, y
            es a proposito.** El componente del registro se queda con
            `orientation` para armar su `data-orientation` y **no se lo pasa a
            Radix**, asi que el manejo de teclado quedaria siempre en
            horizontal por mas que la lista se vea en columna. Radix pone ese
            mismo atributo por su cuenta, asi que las clases del registro
            —`group-data-vertical/tabs:*`— siguen funcionando igual.
            Las otras tres piezas si salen de `ui/tabs.jsx` sin tocar. */}
        <TabsPrimitive.Root
          value={active}
          onValueChange={set_active}
          orientation={is_column ? "vertical" : "horizontal"}
          className="group/tabs mt-12 flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-14"
        >
          {/* En telefono la lista se recorre de lado: cuatro etiquetas largas
              no entran en 390px, y cortarlas o apilarlas en cuatro renglones
              come toda la pantalla antes de llegar al organigrama.
              > **`justify-start` pisa al `justify-center` del registro, y hace
              falta.** Con el centrado, un flex que desborda reparte el sobrante
              a los DOS lados y lo que se va por la izquierda **no se alcanza
              scrolleando**: medido a 390px, la primera pestaña quedaba en
              `left: -176` con `scrollLeft` en 0. */}
          {/* > **El alto de la lista se pisa con la MISMA cadena de
              modificadores del registro**, `group-data-horizontal/tabs:h-auto`
              contra su `group-data-horizontal/tabs:h-8`. Un `h-auto` pelado no
              alcanza: el del registro lleva un `group-data-*` y gana por
              especificidad. Medido: la lista se quedaba en 32px con la pestaña
              activa midiendo 76 — el tamaño desplegado quedaba recortado.
              `items-start` va aparte: sin el, las etiquetas de un renglon
              quedan centradas contra la activa, que ahora es mas alta. */}
          <TabsList
            variant="line"
            className="-mx-6 w-auto max-w-none snap-x snap-mandatory items-start justify-start gap-2 overflow-x-auto px-6 pb-1.5 group-data-horizontal/tabs:h-auto lg:mx-0 lg:w-full lg:snap-none lg:overflow-visible lg:px-0"
          >
            {orgs.map((org, index) => {
              const is_active = active === String(index);

              return (
              <TabsTrigger
                key={org.label}
                value={String(index)}
                // > **El indicador del registro se muda a la izquierda, no se
                // reemplaza.** En columna la pestaña ocupa el ancho entero de
                // su celda, asi que el `after:` de `variant="line"` —anclado al
                // canto derecho— terminaba a 250px del texto, flotando contra
                // el organigrama.
                // >
                // > Se probo antes con `border-l-2` y **no sirve**: el registro
                // trae `dark:data-active:border-input`, que pinta los cuatro
                // bordes. Como los modificadores no coinciden, `tailwind-merge`
                // no puede deduplicar y decide el orden del stylesheet — en
                // claro se veia el morado y en oscuro no. Reusando `after:*`
                // con los MISMOS modificadores, la deduplicacion funciona.
                // Y en fila el subrayado se mete ADENTRO de la caja. El
                // registro lo cuelga en `bottom-[-5px]`, pero la lista lleva
                // `overflow-x-auto` para poder recorrerse en telefono y eso
                // recorta tambien en vertical: medido, la barra caia entre 485
                // y 487 con la lista terminando en 484. Invisible.
                //
                // > **En columna el subrayado se apaga: ahi manda la tarjeta.**
                // Con el fondo relleno y el texto en negrita, una barra pegada
                // al canto redondeado sobra. En fila se queda, porque ahi no
                // hay tarjeta que la reemplace.
                //
                // > **El fondo activo se declara con los MISMOS modificadores
                // que el del registro** (`data-active:` y `dark:data-active:`).
                // Es la leccion de la ronda pasada: con modificadores distintos
                // `tailwind-merge` no puede deduplicar, decide el orden del
                // stylesheet, y sale bien en un tema y mal en el otro.
                className={cn(
                  "h-auto shrink-0 cursor-pointer snap-start flex-col items-start gap-0 py-3 text-base font-semibold tracking-tight after:bg-brand group-data-horizontal/tabs:after:bottom-0 group-data-vertical/tabs:rounded-xl group-data-vertical/tabs:px-5 group-data-vertical/tabs:py-4 group-data-vertical/tabs:after:hidden lg:text-xl",
                  is_active && "font-bold text-foreground",
                )}
                // > **El fondo de la tarjeta va en `style` y no en una clase.**
                // No es pereza: `variant="line"` trae
                // `group-data-[variant=line]/tabs-list:data-active:bg-transparent`,
                // que empata en especificidad con cualquier
                // `group-data-vertical/tabs:bg-*` que se le ponga encima — y
                // ahi decide el orden del stylesheet, no el nuestro. Medido: el
                // fondo salia `rgba(0,0,0,0)`. Un estilo en linea gana siempre,
                // y el color sigue saliendo del token.
                style={
                  is_active && is_column
                    ? { backgroundColor: "var(--muted)" }
                    : undefined
                }
              >
                <span>{org.label}</span>

                {/* > **El despliegue va con `grid-template-rows: 0fr → 1fr`, y
                    es una excepcion consciente a "solo `transform` y
                    `opacity`".** Esa regla existe por las animaciones atadas al
                    scroll, que recalculan layout EN CADA FRAME. Esto es una
                    transicion de 200ms sobre un elemento, disparada por un
                    clic. Empujar a los hermanos hacia abajo con `transform` no
                    se puede, y reservar el hueco siempre —cuatro espacios
                    vacios— mata la idea de que se despliega. */}
                <span
                  aria-hidden={is_active ? undefined : "true"}
                  className={cn(
                    "grid overflow-hidden text-sm font-normal text-muted-foreground transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                    is_active
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  {/* El `min-h-0` es lo que hace funcionar el truco: sin el, el
                      hijo de la reja se planta en su alto de contenido y la
                      fila de `0fr` no lo puede achicar. */}
                  <span className="min-h-0">
                    <span className="block pt-1.5">{org.size}</span>
                  </span>
                </span>
              </TabsTrigger>
              );
            })}
          </TabsList>

          {orgs.map((org, index) => (
            <TabsContent key={org.label} value={String(index)}>
              {/* El panel se recorre de lado en pantalla chica: `OrgChart`
                  pinta cajas con `whitespace-nowrap` y el arbol de cuatro
                  niveles no entra en un telefono. */}
              <div
                className="org-canvas flex items-center justify-center overflow-x-auto rounded-2xl px-4 py-8 lg:overflow-visible lg:px-0"
                style={{ minHeight: CHART_MIN_HEIGHT }}
              >
                {/* Radix desmonta el panel inactivo, asi que la entrada corre
                    sola en cada cambio: no hace falta `key`. */}
                <motion.div
                  className="w-full"
                  initial={
                    reduced_motion ? false : { opacity: 0, y: 18, scale: 0.97 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <OrgChart tree={org.tree} />
                </motion.div>
              </div>
            </TabsContent>
          ))}
        </TabsPrimitive.Root>
      </Container>
    </section>
  );
}
