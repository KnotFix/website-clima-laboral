import { ArrowRight } from "lucide-react";

import { GridBackdrop } from "@/components/effects/grid_backdrop";
import { HeroCover } from "@/components/effects/hero_cover";
import { FOOTER_LIFT } from "@/components/site/footer";
import { AccentTitle } from "@/components/home/accent_title";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { site_config } from "@/lib/site_config";

export function FinalCta({ dict }) {
  return (
    // El relleno bajo de `py-28 sm:py-36` a `py-20 sm:py-24`. Aquel alto salia
    // de que el bloque era una columna centrada de tres pisos —titular, cuerpo,
    // boton— y necesitaba aire alrededor para no leerse apretado. En fila el
    // bloque mide casi la mitad, y el mismo relleno dejaba la seccion vacia por
    // arriba y por abajo.
    <section className="relative overflow-hidden py-20 sm:py-24">
      <GridBackdrop />
      {/* > **Esto es lo que convierte al CTA en una tapa**, y sin ello el efecto
            no existe. El sitio no pinta un fondo por seccion: todas dejan ver el
            del `body`, o sea que el CTA es transparente — y algo transparente no
            tapa nada. Sin esta franja el pie se ve entero desde el primer
            momento y no hay nada que descubrir.
            Es el mismo componente y el mismo problema que resolvio el hero.

            **Va solo al pie y no en toda la seccion.** Un `bg-background` en el
            `<section>` seria mas corto de escribir y taparia el resplandor de
            `SectionGlow`, que va en `-z-10` adentro de su envoltorio: el CTA
            perderia el extremo calido con el que cierra la pagina. Lo unico que
            hay que ocultar son los `FOOTER_LIFT` px del pie que quedaron metidos
            detras.

            `height` tiene que ser **mas del doble del `lift`**: el degradado
            recien llega a opaco al 45%, asi que con menos el pie asoma por el
            tramo todavia translucido.

            **Va ANTES del `<Container>`, y el orden es lo que hace que
            funcione.** El contenedor es `relative`, asi que el titular, el
            cuerpo y el boton quedan encima de la tapa sin tocar un `z-index`.
            Puesta despues —probado— la franja opaca les pasa por encima y apaga
            el CTA entero. Es el mismo orden que usa el hero. */}
      <HeroCover height={FOOTER_LIFT * 2.4} />
      <Container class_name="relative">
        {/* > **El unico titular del sitio que NO entra y sale con el scroll, y
            no es un olvido.** `ScrollPass` apaga lo que envuelve cuando termina
            de cruzar la pantalla, y esta es la ultima seccion: no se puede
            scrollear mas alla de ella, asi que el tramo de salida cae justo
            donde alguien se queda mirandola. Probado — el CTA quedaba invisible
            al llegar al pie de la pagina.
            Con `Reveal` entra una vez y se queda. Es el boton que tiene que
            apretar la persona; desvanecerse no es una opcion. */}
        <Reveal>
          {/* **El boton va al lado del texto, no debajo.** Apilado quedaba
              tercero en la lectura —titular, cuerpo, y recien ahi el boton—, y
              en el pie de una pagina larga eso es un piso mas para llegar a lo
              unico que hay que apretar. Al costado se ve al mismo tiempo que el
              titular.
              De ahi que el texto deje de ir centrado: en una fila, un bloque
              centrado a la izquierda y un boton a la derecha no comparten
              ningun eje y se leen como dos cosas sueltas. Alineado a la
              izquierda, los dos apoyan contra el margen del contenedor.
              Abajo de `md` vuelve a ser columna: a ese ancho la fila deja el
              titular en cuatro renglones y el boton espichado al lado. */}
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
            <div className="max-w-2xl">
              <AccentTitle segments={dict.final_cta_title_segments} />
              <p className="mt-5 text-xl leading-relaxed text-muted-foreground text-pretty">
                {dict.final_cta_body}
              </p>
            </div>
            {/* **Es el MISMO boton que el primario del hero**, plato incluido,
                y recien ahora: apilado debajo del cuerpo quedaba con el `lg`
                pelado del registro —`h-9 px-2.5`—, que al costado de un titular
                a `text-4xl` se leia como un boton secundario. En ingles el
                rotulo son dos palabras cortas y median 88px de ancho.
                Es el ultimo boton de la pagina y el mismo destino que el del
                hero: no hay razon para que pese menos.

                `shrink-0` va en el plato para que la fila le saque el ancho al
                texto y no al boton: sin el, el flex reparte el faltante entre
                los dos y el rotulo se parte en dos renglones.
                Ancho completo en telefono, que es donde el pulgar apunta. */}
            <span className="cta-plate w-full shrink-0 md:w-auto">
              <Button
                asChild
                size="lg"
                className="cta-key h-11 w-full px-6 text-base"
              >
                <a href={site_config.signup_url}>
                  {dict.final_cta_button}
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/button:translate-x-0.5"
                  />
                </a>
              </Button>
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
