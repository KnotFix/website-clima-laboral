import { RulerMarks } from "@/components/effects/ruler_marks";
import { StackBackdrop } from "@/components/effects/stack_backdrop";
import { BlurText, BlurTextPiece } from "@/components/motion/blur_text";
import { CardsStack, StackCard } from "@/components/motion/cards_stack";
import { ChapterLand, ChapterSlide } from "@/components/motion/pinned_chapter";
import { ScrollLine } from "@/components/motion/scroll_line";
import { Tilt } from "@/components/motion/tilt";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";

/**
 * La primera diapositiva del capitulo: el problema.
 *
 * El titular se queda quieto arriba mientras las fichas suben una por una desde
 * abajo del borde y se apilan debajo de el. **Nada de esto se mueve en
 * vertical**: la diapositiva mide una pantalla y esta clavada; lo que avanza con
 * el scroll es el apilado.
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
          No lleva el acento a proposito: en esta seccion el acento ya se lo
          gastan las dos palabras del titular. */}
      <ScrollLine class_name="inset-0 h-full w-full" />

      {/* Titular arriba y pila abajo, las dos centradas. **No es la misma
          seccion en dos columnas.** Al lado, el titular y las fichas competian
          por la mirada y cada ficha entraba en diagonal sobre la anterior;
          arriba, el titular se lee una vez y despues pasan las fichas debajo. */}
      <Container class_name="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="w-full">
          <div>
            {/* Sube y se coloca. Cuelga del avance de la PILA y no del scroll de
                la pagina: adentro del capitulo clavado la pagina no avanza en
                vertical, asi que un fundido atado a `scrollY` apagaria el
                titular a mitad de la pista.
                **Entra desde abajo y no de costado**, que es lo que hacia cuando
                vivia en la columna izquierda: un titular centrado que llega de
                un lado se lee torcido, porque no hay ninguna columna que
                justifique ese lado.
                La ventana es corta —el primer 18% de la fase— porque este
                titular es el argumento que se lee mientras las fichas se
                apilan: tiene que estar puesto antes de que llegue la primera.
                No lleva salida: la salida de esta diapositiva es el paneo, y de
                eso se encarga el capitulo.
                **`fade={false}`, y no es un detalle.** Esta diapositiva se ve una
                pantalla entera antes de que el capitulo se clave, y en todo ese
                tramo el avance vale 0. Con el fundido puesto, el titular quedaba
                invisible justo ahi y la pantalla entraba vacia — las fichas
                todavia no llegaron, asi que este titular es lo unico que hay.
                Se mueve, no aparece: de aparecer se encarga `BlurText`. */}
            <ChapterLand
              phase="stack"
              enter_from="below"
              distance={48}
              land_span={0.18}
              fade={false}
            >
              {/* Mismo movimiento que el titular del planeta: entra palabra por
                  palabra, desenfocado. Sin `text-balance` — `BlurText` reparte
                  las palabras en un flex y ahi el balanceo no aplica.
                  **`justify-center` ademas de `text-center`, y las dos hacen
                  falta.** `BlurText` reparte las palabras en un `flex flex-wrap`
                  y ahi centrar es cosa del contenedor; el `text-center` es para
                  el texto plano que sale cuando el sistema pide menos
                  movimiento, que no lleva flex.
                  **Los 60rem del ancho son el corte del titular, y salen de
                  medir las dos frases.** Sin cortes forzados, lo unico que
                  decide donde parte es cuanto entra por renglon, y el remate en
                  color tiene que caer entero en el segundo — es el acento, no
                  puede quedar partido al medio.
                  Medido a 48px, en px acumulados de cada palabra:

                    es  …clima laboral 894 | +sigue 1028
                    en  …climate is    919 | +still 1007

                  O sea que la caja tiene que entrar en [919, 1007): abajo de 919
                  el ingles corta antes de tiempo, de 1007 para arriba se lleva
                  "still" al primer renglon y parte "still the same?".
                  960 es el medio de esa banda. `max-w-4xl` (896) no alcanza —el
                  espanol raspa los 894 y pierde por fracciones de pixel— y
                  `max-w-5xl` (1024) se pasa. En `rem` y no en `px` porque las
                  medidas son de un `text-5xl`, que tambien es `rem`: si crece la
                  raiz, crecen las dos. */}
              <BlurText
                tag="h2"
                class_name="mx-auto max-w-[60rem] justify-center text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                {/* **Sin cortes de renglon: el titular envuelve solo.** Antes
                    eran dos frases y habia que partirlas a mano con un bloque
                    vacio de ancho completo, porque el remate tenia que entrar
                    entero en el segundo renglon. Ahora es UNA pregunta: no hay
                    dos frases que separar, y forzar un corte adentro de una sola
                    pregunta la parte donde el ancho no lo pide.
                    El espacio entre palabras sigue yendo DENTRO de la pieza —
                    entre dos `<span>` hermanos no existe en el texto del DOM y
                    `textContent` saldria con las palabras pegadas. */}
                {segments.map((segment, index) => (
                  <BlurTextPiece
                    key={index}
                    trailing_space={index < segments.length - 1}
                    class_name={
                      segment.tone === "brand" ? "text-brand" : undefined
                    }
                  >
                    {segment.text}
                  </BlurTextPiece>
                ))}
              </BlurText>
            </ChapterLand>
          </div>

          {/* Una columna de 768px centrada. **No los 1200px del `Container`**:
              a ancho completo el cuerpo de la ficha entra en dos renglones
              cortos y la pila se lee como tres bandas horizontales, no como
              tarjetas. */}
          <CardsStack class_name="mx-auto mt-14 w-full max-w-3xl">
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
                  {/* **El aire de arriba es mas grande que el de abajo, y es
                    estructural.** Apilada, lo unico que se ve de una ficha de
                    atras son los `STACK_STEP` px de su borde superior, y ahi no
                    puede haber texto: medio titulo cortado se lee como un error
                    de maquetado. Los 28px de `pt-7` son ese asomo mas el margen
                    que se come la escala de profundidad — ver `STACK_STEP`. */}
                  {/* Vidrio: SIN `backdrop-blur`. El desenfoque no se lo pone la
                    ficha, se lo pone la copia difusa de la linea que va encima —
                    ver mas abajo. Un `backdrop-filter` aca ademas seria
                    contraproducente: reemplaza el fondo por su muestreo y tapa
                    lo que si se veria por detras.
                    > **La cara era `bg-card/97` y ahora es opaca.** Ese 3% se
                    > eligio cuando las fichas se tocaban apenas: dejaba pasar la
                    > linea nitida de atras y el texto de la ficha vecina no
                    > coincidia con el propio. Apiladas coinciden — el titulo de
                    > la de atras cae justo en el aire de arriba de la de
                    > adelante, sobre blanco y sin nada que compita— y al 3% un
                    > texto oscuro todavia se lee: quedaban dos titulos
                    > superpuestos. Medido: al 20% se lee entero, al 12 igual, al
                    > 6 se adivinan los renglones, y recien abajo del 4% queda una
                    > veladura. En una pila esa veladura ya es demasiada.
                    > Lo que se pierde es la linea nitida por detras de la cara.
                    > No es el efecto: **el vidrio no lo hace la transparencia de
                    > la cara**, lo hace la linea difusa que cruza por encima, y
                    > esa sigue igual.
                    El anillo interior claro es el canto del vidrio; sin el, la
                    cara se lee como una tarjeta desteñida. */}
                  {/* `graded-face` es la cara: gris arriba, limpia abajo. Va
                    sobre el color de fondo, no en su lugar — el degradado es lo
                    que apoya la ficha contra la de atras. */}
                  {/* El ring va por tema y no es un descuido. En oscuro el
                    canto del vidrio es el fondo casi negro, `ring-background`.
                    En claro era lo mismo —el hueso sobre la cara blanca— pero
                    con la pagina en blanco eso quedo blanco sobre blanco, o sea
                    sin canto. Aca el canto tiene que venir del lado del texto:
                    `ring-foreground/10`. */}
                  <Card className="graded-face relative gap-0 overflow-visible bg-card px-5 pt-7 pb-5 shadow-[0_10px_28px_-20px_rgb(0_0_0/0.45)] ring-1 ring-inset ring-foreground/10 transform-3d transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 dark:ring-background/60">
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
                    {/* `text-left` porque el `text-center` del `Container`
                      baja hasta aca. La pila esta centrada en la pantalla; el
                      texto ADENTRO de la ficha no: un cuerpo de tres renglones
                      centrado se lee como una cita, no como un argumento. */}
                    <div className="relative text-left transition-transform duration-300 group-hover:translate-z-6 motion-reduce:transition-none motion-reduce:group-hover:translate-z-0">
                      <div className="flex items-baseline justify-between gap-4">
                        {/* 20px, y no el `text-lg sm:text-xl` del item comun de
                          la pagina. Estas tres fichas son el argumento de la
                          seccion, pasan solas por la pantalla y no comparten
                          renglon con nada: aca el tamaño no compite contra otra
                          cosa, y a 18px el titulo se leia como una etiqueta.
                          No lleva escalon en `sm`: 20px ya entra en un renglon a
                          390px de ancho con los dos digitos al lado. */}
                        <h3 className="text-xl font-medium tracking-tight">
                          {item.title}
                        </h3>
                        {/* El numero ordena la pila: apilada, una ficha tapa a la
                          anterior y sin el no se sabe cuantas van ni cuantas
                          faltan. */}
                        <span
                          aria-hidden="true"
                          className="text-xl font-semibold tabular-nums text-muted-foreground/40"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Cota entre el titulo y el cuerpo: delimita sin meter
                          otra caja adentro de la caja. */}
                      <RulerMarks class_name="mt-3" />
                      {/* 16px contra los 20 del titulo. **El escalon sigue
                          siendo de 4px, que es lo que importa**: el cuerpo es el
                          detalle y no el titular, y el gris hace el resto.
                          Subio de 14 junto con el titulo porque a 14px este
                          cuerpo se leia como una nota al pie de la ficha, y es
                          la frase que dice qué pasa.
                          El alto que gana la ficha son ~10px y la pila los tiene:
                          la diapositiva esta clavada y le sobra pantalla. */}
                      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground text-pretty">
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
