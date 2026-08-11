import { RulerMarks } from "@/components/effects/ruler_marks";
import { StackBackdrop } from "@/components/effects/stack_backdrop";
import { BlurText, BlurTextPiece } from "@/components/motion/blur_text";
import { CardsStack, StackCard } from "@/components/motion/cards_stack";
import { ChapterSlide } from "@/components/motion/pinned_chapter";
import { ScrollLine } from "@/components/motion/scroll_line";
import { Tilt } from "@/components/motion/tilt";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";

/**
 * La primera diapositiva del capitulo: el problema.
 *
 * El titular se queda quieto a la izquierda mientras las fichas suben una por
 * una a la derecha. **Nada de esto se mueve en vertical**: la diapositiva mide
 * una pantalla y esta clavada; lo que avanza con el scroll es el apilado.
 *
 * Cuando la pila termina, la diapositiva entera se va por la izquierda y entra
 * la medicion. Ese paneo lo hace `PinnedChapter`, no esta seccion.
 *
 * > **La linea es una capa de toda la diapositiva, no de la columna de las
 * > fichas.** Tiene que serlo: termina en el borde derecho de la diapo, que es
 * > la juntura con el grafico de la seccion siguiente. Ver `SEAM_Y`.
 */
export function Problem({ dict }) {
  const segments = dict.problem_title_segments;
  const items = dict.problem_items;

  return (
    <ChapterSlide class_name="isolate">
      <StackBackdrop />

      {/* La linea que hilvana la pila, nitida. Va POR DETRAS de las fichas y a
          lo ancho de la diapositiva entera: se pinta antes que ellas, asi que
          queda debajo.
          No lleva el morado a proposito: en esta seccion el acento ya se lo
          gastan las dos palabras del titular. */}
      <ScrollLine class_name="inset-0 h-full w-full" />

      <Container class_name="flex h-full flex-col justify-center py-20">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {/* Mismo movimiento que el titular del planeta: entra palabra por
                palabra, desenfocado. Sin `text-balance` — `BlurText` reparte las
                palabras en un flex y ahi el balanceo no aplica. */}
            <BlurText
              tag="h2"
              class_name="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              {segments.flatMap((segment, index) => {
                const is_last = index === segments.length - 1;
                // La ultima palabra de una frase tambien lleva su espacio: el
                // corte de renglon es de maquetado y no existe en el texto del
                // DOM. Sin el, `textContent` sale "encuesta.El" y un lector de
                // pantalla lee las dos frases pegadas.
                const pieces = [
                  <BlurTextPiece
                    key={index}
                    trailing_space={!is_last}
                    class_name={
                      segment.tone === "brand" ? "text-brand" : undefined
                    }
                  >
                    {segment.text}
                  </BlurTextPiece>,
                ];

                // Cada frase en su renglon. Dejandolo envolver solo, la segunda
                // se parte donde toque y el remate queda colgando —"igual." solo
                // en la ultima linea—, que es justo lo que tiene que pegar. El
                // bloque vacio de ancho completo corta el renglon con el flex de
                // `BlurText` y tambien con el texto plano que sale cuando el
                // sistema pide menos movimiento.
                if (!is_last && segment.text.endsWith(".")) {
                  pieces.push(
                    <span
                      key={`break-${index}`}
                      aria-hidden="true"
                      className="block w-full"
                    />,
                  );
                }

                return pieces;
              })}
            </BlurText>
          </div>

          <CardsStack class_name="mt-12 max-w-2xl lg:mt-0 lg:max-w-none">
            {items.map((item, index) => (
              <StackCard key={item.title} index={index} count={items.length}>
                <Tilt tilt_strength={8} class_name="group relative">
                  {/* La sombra es una capa aparte que se enciende por opacidad,
                    no un `box-shadow` que transiciona: animar la sombra
                    repinta la caja en cada frame. Va por fuera de `Card`, que
                    recorta lo que se le salga. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 shadow-[0_18px_45px_-15px_rgb(0_0_0/0.35)] transition-opacity duration-300 group-hover:opacity-100"
                  />
                  {/* `overflow-visible` pisa el recorte propio de `Card` y
                    `transform-3d` abre el espacio 3D adentro: sin las dos, el
                    `translate-z` del contenido queda aplastado. */}
                  {/* La sombra en reposo no es decoracion: apiladas, es lo que
                    dice que esta ficha esta ARRIBA de la anterior y no al lado.
                    La del hover, mas larga, se enciende sobre esta. */}
                  {/* Vidrio: la cara va translucida y SIN `backdrop-blur`. El
                    desenfoque no se lo pone la ficha, se lo pone la copia
                    difusa de la linea que va encima — ver mas abajo. Un
                    `backdrop-filter` aca ademas seria contraproducente:
                    reemplaza el fondo por su muestreo y tapa lo que si se veria
                    por transparencia.
                    La cara va en `/97`, y el numero lo decide **cuanto se lee de
                    la ficha de atras**, no cuanto se ve. Un texto oscuro sobre
                    blanco aguanta muchisimo: al 20% se lee entero, al 12 se lee
                    igual, y al 6 todavia se adivinan los renglones. Recien
                    abajo del 4% deja de haber letras y queda una veladura.
                    Sin `backdrop-filter` no hay forma de desenfocarlo de verdad
                    —ver la nota de la seccion—, asi que lo unico que queda es
                    dejar pasar menos. **El vidrio no lo hace la transparencia
                    de la cara**, lo hace la linea difusa que cruza por encima.
                    El anillo interior claro es el canto del vidrio; sin el, una
                    cara translucida se lee como una tarjeta desteñida. */}
                  {/* `graded-face` es la cara: gris arriba, limpia abajo. Va
                    sobre la cara translucida, no en su lugar — el degradado
                    apoya la ficha, la transparencia es lo que deja ver la linea
                    de atras. */}
                  <Card className="graded-face relative gap-0 overflow-visible bg-card/97 p-6 shadow-[0_10px_28px_-20px_rgb(0_0_0/0.45)] ring-1 ring-inset ring-background/60 transform-3d transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                    {/* Brillo diagonal y borde encendido, apagados en reposo. El
                      borde no es adorno: en oscuro la sombra no se ve contra un
                      fondo negro y sin el, el hover casi no avisa. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-foreground/[0.06] to-transparent opacity-0 ring-1 ring-foreground/15 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    {/* El texto se despega de la cara de la ficha: es lo que hace
                      leer la inclinacion como profundidad y no como una imagen
                      torcida. */}
                    <div className="relative transition-transform duration-300 group-hover:translate-z-6 motion-reduce:transition-none motion-reduce:group-hover:translate-z-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-lg font-medium tracking-tight sm:text-xl">
                          {item.title}
                        </h3>
                        {/* El numero ordena la pila: apilada, una ficha tapa a la
                          anterior y sin el no se sabe cuantas van ni cuantas
                          faltan. */}
                        <span
                          aria-hidden="true"
                          className="text-lg font-semibold tabular-nums text-muted-foreground/40 sm:text-xl"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Cota entre el titulo y el cuerpo: delimita sin meter
                          otra caja adentro de la caja. */}
                      <RulerMarks class_name="mt-3.5" />
                      {/* Un escalon de verdad contra el titulo. A `text-lg`
                          contra `text-xl` eran 18 y 20px y se leian como el
                          mismo texto dos veces, sin decir cual manda.
                          15px en escritorio y 14 en pantalla chica: la ficha
                          angosta con 15px deja renglones de tres palabras. */}
                      <p className="mt-3.5 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                        {item.body}
                      </p>
                    </div>
                  </Card>
                </Tilt>
              </StackCard>
            ))}
          </CardsStack>
        </div>
      </Container>

      {/* La misma curva, difusa y ENCIMA de las fichas. Es la otra mitad del
          vidrio.
          `backdrop-filter` sobre las fichas no sirve: probado en siete
          configuraciones —en la `Card`, en el `Tilt`, en el `sticky`, en una
          capa absoluta adentro, moviendo la linea a la seccion, sin `isolate`,
          sin 3D— y en todas devuelve un fondo plano. Muestrea algo que no
          incluye el contenido de la seccion, asi que la linea nunca aparece;
          peor, **reemplaza** el fondo y tapa incluso la linea nitida que si se
          veria por transparencia.
          Lo que si es determinista es el orden de pintado: donde una ficha tapa
          a la linea nitida, lo unico que queda a la vista es esta copia difusa.
          O sea que el tramo tapado se lee desenfocado — que es exactamente el
          efecto — sin depender de como el navegador arma el backdrop. */}
      <ScrollLine blurred class_name="inset-0 h-full w-full" />
    </ChapterSlide>
  );
}
