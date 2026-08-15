import { Pin } from "lucide-react";

import { StepsTrail } from "@/components/effects/steps_trail";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Tilt } from "@/components/motion/tilt";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/**
 * El zigzag, una fila por paso: izquierda, derecha, izquierda.
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
 */
const STEP_CELLS = [
  {
    cell: "md:col-start-1 md:row-start-1 md:justify-self-start",
    angle: "md:rotate-2",
  },
  {
    cell: "md:col-start-2 md:row-start-2 md:justify-self-end",
    angle: "md:-rotate-2",
  },
  {
    cell: "md:col-start-1 md:row-start-3 md:justify-self-start",
    angle: "md:rotate-2",
  },
];

/**
 * Una ficha clavada: el chinche, el numero, y el paso.
 *
 * Local y no exportada: se usa una sola vez, en un solo lugar. La tipografia es
 * la canonica de item del sitio —`text-lg`/`sm:text-xl` el titulo y 15px el
 * cuerpo—, la misma del problema, los pesos y la confidencialidad.
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
      <div
        className={cn(
          "relative rounded-2xl border border-border bg-card p-2 shadow-[0_10px_28px_-20px_rgb(0_0_0/0.45)] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
          angle,
          "md:group-hover:rotate-0",
        )}
      >
        <Pin
          aria-hidden="true"
          className="mx-auto my-2.5 size-5 text-muted-foreground/50"
        />
        <div className="rounded-xl border border-border bg-muted/40 p-5">
          {/* El numero es el unico morado de la ficha. El chinche va gris: dos
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
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
            {step.step_body}
          </p>
        </div>
      </div>
    </Tilt>
  );
}

/**
 * Seccion critica: el SaaS se vende por autoservicio, asi que esta es la que
 * convence de que arrancar es facil. El primer paso (subir la nomina) es el que
 * suena pesado y por eso abre.
 *
 * **Las tres fichas van en zigzag y una ruta punteada las une.** Era una lista
 * numerada con separadores, que es lo mas plano de la pagina justo en la seccion
 * que mas tiene que convencer. El zigzag tambien la separa de las otras: el
 * problema apila, la medicion corre un riel, los pesos derivan, y los pasos son
 * un tablero.
 */
export function HowItWorks({ dict }) {
  return (
    <section id="how" className="scroll-mt-24 border-t border-border py-24 sm:py-32">
      <Container>
        {/* El titular entra y sale con el scroll, igual que el de todas las
            secciones. */}
        <ScrollPass {...HEADING_PASS}>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {dict.how_title}
          </h2>
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
                      nunca quede una ficha translucida mientras alguien la lee. */}
                  <ScrollPass drift={70} fade_in={0.28} fade_out={0.78}>
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
