import { ChartColumn, Layers, Presentation, Scale } from "lucide-react";

import { CarouselRail } from "@/components/motion/carousel_rail";
import { ImageCycle } from "@/components/motion/image_cycle";
import { ChapterSlide } from "@/components/motion/pinned_chapter";
import { Container } from "@/components/site/container";

/**
 * Un icono por punto, en el orden del diccionario. Vive aca y no en el
 * diccionario porque no es contenido: no se traduce, no cambia por idioma y
 * elegirlo es una decision de la interfaz.
 */
const ITEM_ICONS = [Scale, Layers, ChartColumn, Presentation];

/**
 * La segunda diapositiva del capitulo: por que los numeros significan algo.
 *
 * **El titular va arriba y se queda ahi todo el recorrido**; las fichas le pasan
 * por debajo, de derecha a izquierda. No es una reja: una reja se lee de arriba
 * a abajo y pelearia con el eje de la seccion. En el riel las cinco son del
 * mismo alto y se leen una tras otra en la direccion en la que la seccion se
 * mueve.
 *
 * La diapositiva **entra desde la derecha** cuando la del problema termina de
 * irse por la izquierda. Ese paneo lo hace `PinnedChapter`, no esta seccion.
 *
 * > **El grafico entra por el borde izquierdo, a la altura `SEAM_Y`** — el mismo
 * > punto por el que la pila del problema sale por su borde derecho. En una fila
 * > horizontal esos dos bordes son el mismo pixel, asi que la linea de la
 * > seccion anterior se convierte en el grafico de esta sin nada en el medio.
 * > Antes habia un trazo de empalme para cubrir esa distancia; ahora la
 * > distancia es cero.
 */
export function Measurement({ dict }) {
  return (
    <ChapterSlide class_name="flex flex-col justify-center pt-28 pb-16">
      {/* El titular es lo unico de la diapositiva que no se mueve nunca. Va en
          su `Container`; el riel de abajo sale a sangre hasta el borde de la
          pantalla y arranca en este mismo margen. */}
      <Container class_name="shrink-0 pb-10">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {dict.measurement_title}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
          {dict.measurement_body}
        </p>
      </Container>

      <CarouselRail rail_label={dict.a11y_measurement_rail}>
        {dict.measurement_items.map((item, index) => {
          const Icon = ITEM_ICONS[index];

          return (
            // Las cinco miden lo mismo de alto, y el alto lo pone la ficha de
            // las capturas. Con el texto corto eso deja aire de sobra, asi que
            // `justify-between` lo reparte a proposito: el icono arriba, el
            // texto apoyado abajo. Amontonado contra el borde de arriba, el
            // hueco se leia como una ficha a la que le falta algo.
            <article
              key={item.title}
              className="surface-key graded-face flex w-[76vw] shrink-0 snap-start flex-col justify-between gap-7 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:w-[292px] lg:w-[320px]"
            >
              {/* El icono va en su propia caja hundida: sin ella queda un
                  dibujo suelto arriba del titulo, y con ella se lee como una
                  pieza del mismo relieve que la ficha. */}
              <span
                aria-hidden="true"
                className="inline-flex size-9 items-center justify-center rounded-lg bg-muted ring-1 ring-inset ring-foreground/10"
              >
                <Icon className="size-4.5 text-foreground/70" />
              </span>
              <div>
                <h3 className="text-lg font-medium tracking-tight text-balance">
                  {item.title}
                </h3>
                {/* Un escalon de verdad contra el titulo. A `text-lg` los dos
                    pesaban parecido y la ficha no tenia una primera linea de
                    lectura — que es todo lo que la mayoria le va a dar, pasando
                    de lado. Y baja a `text-sm` en pantalla chica: 15px en una
                    ficha de 76vw deja renglones de tres palabras. */}
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                  {item.body}
                </p>
              </div>
            </article>
          );
        })}

        {/* La quinta va ultima y mas ancha: las cuatro se leen, esta se mira, y
            al final del recorrido es el premio. */}
        <article className="surface-key flex w-[84vw] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:w-[360px] lg:w-[420px]">
          <ImageCycle
            shots={dict.measurement_shots}
            class_name="min-h-52 flex-1 bg-muted"
          />
          <p className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
            {dict.measurement_shots_title}
          </p>
        </article>
      </CarouselRail>
    </ChapterSlide>
  );
}
