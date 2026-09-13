import Image from "next/image";
import { FileSpreadsheet, FileText, Globe } from "lucide-react";

import { AccentTitle } from "@/components/home/accent_title";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";

/**
 * Un icono por formato, en el orden de `reports_formats`. Vive aca y no en el
 * diccionario por lo mismo que los de la medicion: no es contenido, no se
 * traduce y elegirlo es una decision de la interfaz.
 *
 * **Va por posicion**: sacar un formato es sacar tambien su icono, o el que
 * sigue hereda el ajeno.
 */
const FORMAT_ICONS = [FileSpreadsheet, FileText, Globe];

/** Desde cuan lejos llega cada captura, en px. El mismo valor que `SHOT_DRIFT`
 * del analisis: las dos secciones mueven capturas del producto y moverlas
 * distinto las haria leerse a distinta profundidad sin motivo. */
const SHOT_DRIFT = 96;

/**
 * Lo que sale del sistema una vez que el analisis esta hecho: el reporte, en
 * XLSX, PDF y HTML.
 *
 * **Va despues del analisis y no antes.** Es su consecuencia: primero se cruza
 * y se compara, y recien despues tiene sentido decir en que formato te llevas
 * eso. Puesta antes seria un listado de formatos de un informe que todavia no
 * se sabe que contiene.
 *
 * ## Por que no se parece a sus vecinas
 *
 * El analisis son filas de texto con su maqueta al lado, y el FAQ es un
 * acordeon. Esta es lo unico de la pagina que muestra **capturas del entregable
 * una al lado de la otra**: los formatos van arriba en una fila sin cajas —tres
 * iconos y una linea cada uno— y abajo van las capturas enmarcadas. El peso
 * visual esta en las imagenes, que es lo que esta seccion tiene para mostrar.
 *
 * Las capturas entran de a una, cada una un turno despues de la anterior, en el
 * orden en que se leen.
 *
 * ## Estas capturas van con UNA imagen, no en par claro/oscuro
 *
 * Es la unica seccion del sitio donde no hay `ThemedShot`, y no es un olvido:
 * **un export no tiene tema**. La planilla, el PDF y el reporte en el navegador
 * son blancos en las dos pantallas, asi que no existe una version oscura que
 * bajar — a diferencia de las capturas del producto, que si tienen las dos.
 *
 * Lo unico que cambia con el tema es el brillo. En oscuro van apenas bajadas:
 * papel a pleno contra el fondo de la pagina encandila, que es el mismo motivo
 * por el que el resto del sitio cambia de captura.
 */
export function Reports({ dict }) {
  return (
    <section id="reports" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <ScrollPass {...HEADING_PASS}>
          <AccentTitle segments={dict.reports_title_segments} />
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted-foreground text-pretty">
            {dict.reports_body}
          </p>
        </ScrollPass>

        {/* Los formatos van SIN caja: abajo hay tres capturas enmarcadas, y
            enmarcar tambien esto daria seis rectangulos iguales en la misma
            pantalla. Lo que los separa del cuerpo es el icono hundido, el
            mismo relieve que usan las fichas de la medicion. */}
        <ScrollPass enter_from="left" drift={SHOT_DRIFT} fade_in={0.26} fade_out={0.8}>
          <ul className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {dict.reports_formats.map((format, index) => {
              const Icon = FORMAT_ICONS[index];

              return (
                <li key={format.name}>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-9 items-center justify-center rounded-lg bg-muted ring-1 ring-inset ring-foreground/10"
                  >
                    <Icon className="size-4.5 text-foreground/70" />
                  </span>
                  {/* El nombre del formato es el dato: va en versalita tabular
                      —XLSX, PDF, HTML— y no como titulo de oracion. */}
                  <h3 className="mt-4 text-lg font-medium tracking-tight">
                    {format.name}
                  </h3>
                  <p className="mt-2 max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">
                    {format.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </ScrollPass>

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {dict.reports_shots.map((shot, index) => (
            // Cada captura llega un turno despues de la anterior, de izquierda a
            // derecha. `build_index` escalona sin correr el tramo de scroll: las
            // tres cruzan la pantalla juntas y se colocan en orden.
            <li key={shot.src}>
              <ScrollPass
                build_index={index}
                enter_from="right"
                drift={SHOT_DRIFT}
                fade_in={0.3}
                fade_out={0.78}
              >
                <figure className="surface-key graded-face overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                  {/* 16:10 fijo, como el panel del hero, y `object-cover
                      object-top`: las tres capturas vienen con proporciones
                      distintas —1,81 la del HTML, 1,41 la del PDF y 1,67 la de
                      la planilla— y en una reja de tres el alto tiene que ser
                      el mismo o las tarjetas quedan escalonadas. Recorta por
                      abajo, que en un documento es el aire y el pie de pagina.

                      `fill` necesita que el alto lo ponga la caja: la imagen no
                      tiene contra que medirse. */}
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover object-top dark:brightness-[0.92]"
                    />
                  </div>
                  <figcaption className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
                    {shot.caption}
                  </figcaption>
                </figure>
              </ScrollPass>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
