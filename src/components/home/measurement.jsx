import { Layers, Presentation, Scale } from "lucide-react";

import { AccentTitle } from "@/components/home/accent_title";
import { CarouselRail } from "@/components/motion/carousel_rail";
import { ImageCycle } from "@/components/motion/image_cycle";
import { ChapterLand, ChapterSlide } from "@/components/motion/pinned_chapter";
import { Container } from "@/components/site/container";

/**
 * Un icono por punto, en el orden del diccionario. Vive aca y no en el
 * diccionario porque no es contenido: no se traduce, no cambia por idioma y
 * elegirlo es una decision de la interfaz.
 *
 * **Va por posicion, asi que sacar una ficha es sacar tambien su icono.** Se
 * fue `ChartColumn`, que era el de "el resultado se guarda por segmento":
 * dejandolo, la ficha de los graficos heredaba el suyo y la ultima se quedaba
 * sin ninguno.
 */
const ITEM_ICONS = [Scale, Layers, Presentation];

/**
 * La segunda diapositiva del capitulo: por que los numeros significan algo.
 *
 * **El titular va arriba y se queda ahi todo el recorrido**; las fichas le pasan
 * por debajo, de derecha a izquierda. No es una reja: una reja se lee de arriba
 * a abajo y pelearia con el eje de la seccion. En el riel las cuatro son del
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
      {/* El titular es lo unico de la diapositiva que no se mueve MIENTRAS
          corre el riel. Va en su `Container`; el riel de abajo sale a sangre
          hasta el borde de la pantalla y arranca en este mismo margen. */}
      <Container class_name="shrink-0 pb-10">
        {/* Entra durante el paneo, en su segunda mitad: la diapositiva llega y el
            encabezado se acomoda adentro. Antes no se movia nunca —transformada
            `none` medida— asi que la diapo 2 aparecia armada y el capitulo tenia
            entrada en una mitad y no en la otra.
            **Desde la DERECHA**, que es al revés del resto del sitio y a
            proposito: la diapositiva entera esta viajando hacia la izquierda, asi
            que una pieza corrida a la derecha se lee como que viene atras y se
            acomoda. Corrida a la izquierda se adelantaria a su propia
            diapositiva. */}
        <ChapterLand
          phase="pan"
          enter_from="right"
          distance={90}
          land_at={0.3}
          land_span={0.4}
        >
          <AccentTitle segments={dict.measurement_title_segments} />
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted-foreground text-pretty">
            {dict.measurement_body}
          </p>
        </ChapterLand>
      </Container>

      <CarouselRail rail_label={dict.a11y_measurement_rail}>
        {dict.measurement_items.map((item, index) => {
          const Icon = ITEM_ICONS[index];

          return (
            // Las cuatro miden lo mismo de alto, y el alto lo pone la ficha de
            // las capturas. Con el texto corto eso deja aire de sobra, asi que
            // `justify-between` lo reparte a proposito: el icono arriba, el
            // texto apoyado abajo. Amontonado contra el borde de arriba, el
            // hueco se leia como una ficha a la que le falta algo.
            //
            // Cada ficha llega con su turno, de derecha a izquierda: la 01 se
            // coloca, despues la 02. Cuelga del paneo, o sea que el riel se arma
            // mientras la diapositiva entra.
            //
            // El envoltorio va `flex`: sin el, con la reja en `items-stretch`
            // —el caso suelto, sin capitulo— el que se estiraria es el envoltorio
            // y la ficha de adentro se quedaria en su alto natural, asi que las
            // cuatro dejarian de igualarse.
            <ChapterLand
              key={item.title}
              phase="pan"
              enter_from="right"
              distance={110}
              land_at={0.24}
              build_index={index}
              class_name="flex shrink-0"
            >
              <article className="surface-key graded-face flex w-[76vw] snap-start flex-col justify-between gap-7 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:w-[292px] lg:w-[320px]">
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
                  {/* 16px, el cuerpo de item de todo el sitio. A `text-lg` los
                      dos pesaban parecido y la ficha no tenia una primera linea
                      de lectura — que es todo lo que la mayoria le va a dar,
                      pasando de lado; el escalon contra el titulo lo dan los dos
                      puntos que quedan y el gris. **Se fue el paso a `text-sm`
                      de pantalla chica**: la ficha mide 76vw ahi, y el copy de
                      una sola idea entra sin renglones de tres palabras. */}
                  <p className="mt-2.5 text-base leading-relaxed text-muted-foreground text-pretty">
                    {item.body}
                  </p>
                </div>
              </article>
            </ChapterLand>
          );
        })}

        {/* La cuarta va ultima y mas ancha: las tres se leen, esta se mira, y
            al final del recorrido es el premio. Le toca el ultimo turno del
            escalonado: **el numero va a mano porque esta ficha vive afuera del
            `map`**, asi que sacar o agregar una ficha arriba obliga a moverlo
            aca. Con el turno de mas, esta entraba tarde y el riel terminaba con
            un hueco. */}
        <ChapterLand
          phase="pan"
          enter_from="right"
          distance={110}
          land_at={0.24}
          build_index={3}
          class_name="flex shrink-0"
        >
          <article className="surface-key flex w-[84vw] snap-start flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:w-[360px] lg:w-[420px]">
            <ImageCycle
              shots={dict.measurement_shots}
              class_name="min-h-52 flex-1 bg-muted"
            />
            <p className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
              {dict.measurement_shots_title}
            </p>
          </article>
        </ChapterLand>
      </CarouselRail>
    </ChapterSlide>
  );
}
