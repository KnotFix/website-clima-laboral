import { Pin } from "lucide-react";

import { StepsTrail } from "@/components/effects/steps_trail";
import { AccentTitle } from "@/components/home/accent_title";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Tilt } from "@/components/motion/tilt";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/**
 * El zigzag, una fila por paso: izquierda, derecha, izquierda, derecha.
 *
 * **Sale de la reja y no de posiciones absolutas.** La version de la que salio
 * esto clavaba cada ficha en un `top` fijo y le fijaba el alto al bloque por
 * breakpoint; con eso, un texto una linea mas largo —o el mismo texto en el otro
 * idioma— desacomoda todo. Acomodando celdas, el alto lo pone el contenido.
 *
 * **La fila va declarada y no librada al acomodo automatico.** Con solo
 * `col-start`, la ficha 2 se mete en el hueco que dejo la 1 y las dos terminan
 * en la primera fila: sale una reja de dos arriba y una abajo, no un zigzag.
 * Cada una pide su fila y baja un escalon por paso.
 *
 * La rotacion es de dos grados y solo desde `md`: en una columna las fichas van
 * derechas, porque torcidas y apiladas se leen como un error de maquetado y no
 * como un tablero.
 *
 * **`side` es de donde llega la ficha, y sale del mismo dato que su celda.** La
 * 01 esta clavada a la izquierda y entra desde la izquierda; la 02 a la derecha y
 * entra desde la derecha. No es una tabla aparte que haya que mantener en
 * sincronia con la otra: es el mismo zigzag dicho dos veces, una para el layout y
 * una para el movimiento.
 *
 * > **Hay una celda por paso y tiene que haberlas todas.** El indice se toma con
 * > `index % STEP_CELLS.length`, asi que un paso sin celda propia no rompe: se
 * > lleva la del principio y las dos fichas terminan una encima de la otra en la
 * > misma celda de la reja. Cuando la seccion paso de tres pasos a cuatro, esto
 * > fue lo que hubo que agregar.
 */
const STEP_CELLS = [
  {
    cell: "md:col-start-1 md:row-start-1 md:justify-self-start",
    angle: "md:rotate-2",
    side: "left",
  },
  {
    cell: "md:col-start-2 md:row-start-2 md:justify-self-end",
    angle: "md:-rotate-2",
    side: "right",
  },
  {
    cell: "md:col-start-1 md:row-start-3 md:justify-self-start",
    angle: "md:rotate-2",
    side: "left",
  },
  {
    cell: "md:col-start-2 md:row-start-4 md:justify-self-end",
    angle: "md:-rotate-2",
    side: "right",
  },
];

/**
 * Una ficha clavada: el chinche, el numero, y el paso.
 *
 * Local y no exportada: se usa una sola vez, en un solo lugar. La tipografia es
 * la canonica de item del sitio —`text-lg`/`sm:text-xl` el titulo y 16px el
 * cuerpo—, la misma de la medicion y del analisis.
 */
function StepCard({ step, index, angle }) {
  // `relative` en el `Tilt` es contra quien se posiciona la capa de sombra.
  return (
    <Tilt tilt_strength={6} class_name="group relative">
      {/* La sombra del hover es una capa aparte que se enciende por opacidad, no
          un `box-shadow` que transiciona: animar la sombra repinta la caja en
          cada frame. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[0_18px_45px_-15px_rgb(0_0_0/0.35)] transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Al pasar el mouse la ficha se endereza y sube un poco. Las dos cosas son
          `rotate` y `translate`, o sea que no hay layout que recalcular.
          `rotate` en Tailwind v4 es su propia propiedad y no el `transform`, asi
          que convive con el `rotateX/rotateY` que le pone `Tilt` por style en vez
          de pisarlo. */}
      {/* El borde exterior es `--box-edge` y no `--border`: con la pagina en
          blanco la cara de la ficha ya no se levanta por valor, asi que lo que
          la recorta es el canto. `--border` alcanza para el bloque de adentro,
          que si tiene una cara distinta debajo. */}
      <div
        className={cn(
          "relative rounded-2xl border border-box-edge bg-card p-2 shadow-[0_10px_28px_-20px_rgb(0_0_0/0.45)] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
          angle,
          "md:group-hover:rotate-0",
        )}
      >
        <Pin
          aria-hidden="true"
          className="mx-auto my-2.5 size-5 text-muted-foreground/50"
        />
        <div className="rounded-xl border border-border bg-muted/40 p-5">
          {/* El numero es el unico acento de la ficha. El chinche va gris: dos
              acentos en una caja de este tamano ya no es un acento. */}
          <span
            aria-hidden="true"
            className="block text-4xl font-semibold tabular-nums text-brand"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-lg font-medium tracking-tight sm:text-xl">
            {step.step_title}
          </h3>
          <p className="mt-2.5 text-base leading-relaxed text-muted-foreground text-pretty">
            {step.step_body}
          </p>
        </div>
      </div>
    </Tilt>
  );
}

/**
 * Seccion critica: el SaaS se vende por autoservicio, asi que esta es la que
 * convence de que arrancar es facil. Los dos primeros pasos —armar la
 * organizacion y subir la nomina— son los que suenan pesados, y por eso abren.
 *
 * **Las cuatro fichas van en zigzag y una ruta punteada las une.** Era una lista
 * numerada con separadores, que es lo mas plano de la pagina justo en la seccion
 * que mas tiene que convencer. El zigzag tambien la separa de las otras: el
 * problema apila, la medicion corre un riel, los pesos derivan, y los pasos son
 * un tablero.
 */
export function HowItWorks({ dict }) {
  return (
    // `overflow-x-clip` porque las fichas llegan de costado: sin el, la que
    // esta corrida se sale del ancho del documento y aparece barra horizontal.
    // Va en la `<section>`, que es de ancho completo, y no en el envoltorio del
    // zigzag: ahi el recorte caeria en el borde del `Container` y le comeria el
    // canto rotado a las fichas de la izquierda.
    <section id="how" className="scroll-mt-24 overflow-x-clip py-24 sm:py-32">
      <Container>
        {/* El titular entra y sale con el scroll, igual que el de todas las
            secciones. */}
        <ScrollPass {...HEADING_PASS}>
          <AccentTitle segments={dict.how_title_segments} class_name="max-w-2xl" />
        </ScrollPass>

        {/* El envoltorio existe para la ruta: el trazo se estira a el, y no puede
            colgar del `<ol>` porque ahi adentro solo van `<li>`. */}
        <div className="relative mt-16">
          <StepsTrail />

          <ol className="flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-6">
            {dict.how_steps.map((step, index) => {
              const position = STEP_CELLS[index % STEP_CELLS.length];

              return (
                <li
                  key={step.step_title}
                  className={cn("md:max-w-[340px]", position.cell)}
                >
                  {/* Cada ficha entra y sale con el scroll por su cuenta. Los dos
                      hitos van abiertos —entra temprano, se va tarde— para que
                      nunca quede una ficha translucida mientras alguien la lee.
                      El turno las escalona: la 02 entra cuando la 01 ya llego.
                      En escritorio el zigzag ya las separa por geometria, pero
                      apiladas en una columna las cuatro caen a la misma altura y
                      sin el turno entrarian juntas.
                      Y cada una llega desde el lado en el que esta clavada y se
                      coloca ahi: `enter_from` sale de la misma celda que el
                      `justify-self`. */}
                  <ScrollPass
                    build_index={index}
                    enter_from={position.side}
                    drift={70}
                    fade_in={0.28}
                    fade_out={0.78}
                  >
                    <StepCard step={step} index={index} angle={position.angle} />
                  </ScrollPass>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
