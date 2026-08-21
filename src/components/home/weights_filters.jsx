import {
  CompareShot,
  CrossShot,
  ThresholdShot,
} from "@/components/effects/system_shots";
import { BlurText, BlurTextPiece } from "@/components/motion/blur_text";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";

/**
 * Que maqueta va con que punto, en el orden de `weights_points`. La llave es la
 * del diccionario, de donde sale el contenido de cada una.
 *
 * **Se toma por indice, asi que este array y `weights_points` se mueven
 * juntos.** Cuando se retiro el punto de la ponderacion salieron las tres cosas
 * a la vez: el punto del diccionario, la fila `weights` de aca y el objeto
 * `weights_shots.weights`. Sacando una sola, cada punto se queda con la maqueta
 * del que sigue.
 *
 * **Vive aca y no en `system_shots.jsx`** aunque sea de las maquetas: ese
 * archivo es `"use client"`, y de un modulo cliente un Server Component solo
 * puede importar COMPONENTES. Un array le llega como referencia de cliente y no
 * como el dato — se probo, y `SHOTS[index]` salia `undefined`.
 */
const SHOTS = [
  { key: "cross", Shot: CrossShot },
  { key: "compare", Shot: CompareShot },
  { key: "threshold", Shot: ThresholdShot },
];

/**
 * Desde cuan lejos llega cada columna, en px.
 *
 * **Son distintos a proposito y ahi esta el parallax.** Dos piezas que recorren
 * distinta distancia en el mismo tramo entran a distinta velocidad y se leen a
 * distinta profundidad, y sale gratis: es el mismo `ScrollPass` que ya hace la
 * entrada y la salida, con otro numero. La seccion tenia un `Parallax` aparte
 * para esto; eso era un componente mas por fila midiendo el mismo scroll para el
 * mismo efecto.
 *
 * **Subieron de 45 y 85 a 64 y 96 porque la distancia ahora se recorre de costado
 * y termina en 0**: cada columna viene de su lado y se coloca. 45px sobre una
 * columna de 500px de ancho no se leen como venir de la izquierda, se leen como un
 * temblor. En vertical alcanzaban porque ahi el ojo mide el desplazamiento contra
 * el alto de un renglon, que es mucho menos.
 */
const TEXT_DRIFT = 64;
const SHOT_DRIFT = 96;

/**
 * La seccion diferenciadora: cruzar filtros y comparar.
 *
 * **Tres bloques, y cada uno muestra el sistema haciendo lo que el bloque
 * dice.** Eran cuatro `GlassPanel` derivando al costado del titular: cajas de
 * texto para explicar lo unico que este producto tiene y una encuesta de clima
 * cualquiera no. Ahora cada punto va con su maqueta al lado — el cruce armado,
 * dos segmentos comparados, y el cruce que se quedo sin muestra.
 *
 * > **Eran cuatro y quedaron tres**: se retiro el punto de la ponderacion por
 * > pesos, con su maqueta y su entrada del diccionario. La seccion sigue
 * > llamandose `weights` en el `id` y en las llaves porque es la direccion del
 * > ancla `#weights` del menu.
 *
 * Las tres filas van igual —texto a la izquierda, maqueta a la derecha— y no
 * alternadas: el orden fijo hace que el ojo sepa siempre donde cae el titulo, y
 * lo que cambia de fila en fila es la maqueta, que es lo que hay que mirar.
 *
 * > **Se fue el `sticky` de la columna izquierda.** Existia porque la izquierda
 * > era corta y la derecha larguisima. Con el texto repartido en filas, cada una
 * > al lado de su maqueta, no hay nada que pegar.
 *
 * El titular lleva el efecto del titular del planeta —palabra por palabra,
 * desenfocada— envuelto en `ScrollPass` para que ademas se vaya al salir.
 */
export function WeightsFilters({ dict }) {
  const title_words = dict.weights_title.split(" ");

  return (
    <section
      id="weights"
      className="scroll-mt-24 overflow-x-clip py-24 sm:py-32"
    >
      <Container>
        <ScrollPass {...HEADING_PASS}>
          {/* Sin `text-balance`: `BlurText` reparte las palabras en un flex para
              poder animarlas sueltas, y ahi el balanceo no aplica. */}
          <BlurText
            tag="h2"
            class_name="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {title_words.flatMap((word, index) => {
              const is_last = index === title_words.length - 1;
              // La ultima palabra de una frase tambien lleva su espacio: el
              // corte de renglon es de maquetado y no existe en el texto del
              // DOM. Sin el, `textContent` sale "filtros.Ponderá".
              const pieces = [
                <BlurTextPiece key={index} trailing_space={!is_last}>
                  {word}
                </BlurTextPiece>,
              ];

              // Cada frase en su renglon. Dejandolo envolver solo, el corte cae
              // donde toque y "Ponderá" queda colgando al final de la primera.
              // **Este titular es el unico que hace esto.** El del problema lo
              // hacia tambien, y dejo de hacerlo cuando paso a ser una sola
              // pregunta: ahi no hay dos frases que separar. Aca siguen siendo
              // dos.
              if (!is_last && word.endsWith(".")) {
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
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted-foreground text-pretty">
            {dict.weights_body}
          </p>
        </ScrollPass>

        <ul className="mt-20 flex flex-col gap-20 lg:gap-24">
          {dict.weights_points.map((point, index) => {
            const { key, Shot } = SHOTS[index];

            return (
              <li
                key={point.title}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                {/* Las dos columnas entran y salen por separado, cada una desde
                    el lado que ocupa y con distinta distancia. Los hitos van
                    abiertos —entra temprano, se va tarde— para que nunca quede
                    un bloque translucido mientras alguien lo esta leyendo. */}
                <ScrollPass
                  enter_from="left"
                  drift={TEXT_DRIFT}
                  fade_in={0.26}
                  fade_out={0.8}
                >
                  <div>
                    {/* El numero ordena la lista de un vistazo. Va
                        `aria-hidden` porque leido en voz alta no agrega nada:
                        el `<ul>` ya dice que son items. */}
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-xl font-medium tracking-tight text-balance sm:text-2xl">
                      {point.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty">
                      {point.body}
                    </p>
                  </div>
                </ScrollPass>

                {/* La maqueta lleva un turno de escalonado: el texto llega
                    primero y la maqueta entra atras. Es el orden en que se lee
                    la fila —primero que hace, despues verlo hecho— y no sale
                    del `drift`, que mueve la pieza pero no corre su tramo. */}
                <ScrollPass
                  build_index={1}
                  enter_from="right"
                  drift={SHOT_DRIFT}
                  fade_in={0.3}
                  fade_out={0.78}
                >
                  <Shot
                    shot={dict.weights_shots[key]}
                    scale_max={dict.weights_shots.scale_max}
                  />
                </ScrollPass>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
