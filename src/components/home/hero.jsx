import { ArrowRight } from "lucide-react";

import { HeroCover } from "@/components/effects/hero_cover";
import { SilkBackdrop } from "@/components/effects/silk_backdrop";
import { HeroTitle } from "@/components/home/hero_title";
import { HeroVideo } from "@/components/home/hero_video";
import { Reveal } from "@/components/motion/reveal";
import { ScrollLift } from "@/components/motion/scroll_lift";
import { Container } from "@/components/site/container";
import { LightSwitch } from "@/components/site/light_switch";
import { Button } from "@/components/ui/button";
import { site_config } from "@/lib/site_config";

/**
 * Cuanto del problema queda metido detras del hero, en px, y cuanto scroll
 * tarda en destaparse.
 *
 * Viven aca y no en `page.js` porque la tapa y el pie opaco que la hace posible
 * son la misma pieza: `HeroCover` tiene que ser mas del doble de `HERO_LIFT`
 * para que la parte solida alcance a cubrir lo que hay detras.
 *
 * 320px es poco menos que el `pt-32` del problema mas su titular: se tapa el
 * aire de arriba y el arranque del titulo, no la seccion entera. Tapar de mas
 * hace que el destape se lea como que faltaba contenido.
 */
const HERO_LIFT = 320;
const HERO_SPAN = 640;

/**
 * El pie del hero: 60px de aire bajo el video, y esos mismos 60px de niebla.
 *
 * Es un solo numero para las dos cosas —el `padding-bottom` y el tramo en que
 * `HeroCover` se disuelve— porque son la misma franja: el problema se destapa
 * apareciendo justo en el aire que hay debajo del video.
 *
 * **Es niebla, no desenfoque.** Se probo con `backdrop-filter` sobre esta misma
 * franja y funcionaba, pero el resultado era vidrio esmerilado: un plano solido
 * con un borde claro, mas cerca de una mampara que de una transicion. La niebla
 * no tiene plano ni borde — el contenido se disuelve y reaparece.
 */
const HERO_EDGE = 60;

export function Hero({ dict }) {
  return (
    // El hero es la tapa: se levanta con el scroll y va descubriendo el
    // problema, que arranca metido detras suyo. `ScrollLift` pone el margen
    // negativo que lo mete y el movimiento que lo saca.
    <ScrollLift lift={HERO_LIFT} span={HERO_SPAN}>
      {/* El padding de arriba centra el bloque de texto en la pantalla, y por
          eso es relativo al viewport y no un valor fijo: el bloque mide ~23rem,
          asi que para que su centro caiga en el centro de la ventana hay que
          empujarlo media pantalla menos media altura propia. Con un padding
          fijo el texto queda centrado en un solo tamano de monitor y descolgado
          en el resto.
          El `max()` es el piso para ventanas bajas, donde la cuenta daria menos
          que el alto del navbar y el titular se le meteria abajo.
          En movil sigue fijo: ahi el titular ocupa cinco lineas, el bloque mide
          mucho mas de 23rem y centrarlo dejaria los CTA fuera de la pantalla. */}
      {/* El `pb` es el aire bajo el video, y es exactamente el alto de la
          franja esmerilada: el problema se destapa cruzando ese vidrio. */}
      <section
        className="relative overflow-hidden pt-32 sm:pt-[max(8rem,calc(50svh_-_11.5rem))]"
        style={{ paddingBottom: HERO_EDGE }}
      >
        {/* La seda es el fondo del hero, y por eso aca no hay `GridBackdrop`:
            la reticula de puntos sobre la tela son dos texturas peleando por el
            mismo plano. Sigue viva en el CTA final, que no tiene seda. */}
        <SilkBackdrop />
        {/* Los fondos se pintan en orden de DOM: la seda, encima el pie opaco
            que se disuelve en niebla, y arriba de todo el Container. La niebla
            es ademas lo que entrega la tela al fondo liso de la pagina: sin
            ella el hero terminaria en un corte recto entre seda y hueso. */}
        <HeroCover height={HERO_LIFT * 2} fog={HERO_EDGE} />

        {/* El interruptor de la luz. Va centrado y arriba, en el hueco que
            queda entre el pie del navbar (72px con su `pt-2`) y el arranque del
            titular, que en movil es `pt-32` (128px) y en escritorio mucho mas
            abajo. Es el unico tramo del hero donde un objeto no le pisa nada a
            nadie. */}
        <LightSwitch
          dict={dict}
          class_name="absolute left-1/2 top-[5.5rem] size-8 -translate-x-1/2 sm:size-10"
        />
        <Container class_name="relative">
          <div className="mx-auto max-w-6xl text-center">
            {/* El titular entra palabra por palabra; el subtitulo y los CTA
              siguen la misma linea de tiempo. Los retrasos continuan la del
              titular en vez de arrancar de cero: con 8 piezas cada 0.075s, la
              ultima sale a los 0.525s, asi que el subtitulo entra despues y
              los CTA al final. Si aparecieran de golpe mientras el titular
              todavia se esta armando, se leerian como otro bloque. */}
            <HeroTitle dict={dict} />

            <Reveal reveal_delay={0.65}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {dict.hero_subtitle}
              </p>
            </Reveal>

            {/* En columna los CTA siguen ocupando el ancho completo, como antes.
              El centrado es solo de sm para arriba: ahi el primario mide 20px
              mas de alto que el secundario porque lleva el plato, y los dos
              tienen que quedar centrados entre si, no alineados por el pie. */}
            <Reveal
              reveal_delay={0.8}
              class_name="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center"
            >
              {/* El plato es un envoltorio y no un ::before del boton: tiene que
                quedar por debajo y con su propio radio, y un pseudo-elemento
                del boton heredaria su recorte y su hover. */}
              <span className="cta-plate w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="cta-key h-11 w-full px-6 text-base"
                >
                  <a href={site_config.signup_url}>
                    {dict.hero_cta_primary}
                    <ArrowRight
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover/button:translate-x-0.5"
                    />
                  </a>
                </Button>
              </span>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="cta-key-soft h-11 px-6 text-base"
              >
                <a href="#how">{dict.hero_cta_secondary}</a>
              </Button>
            </Reveal>
          </div>

          {/* El video va a lo ancho completo del Container, sin `max-w` propio:
            es la pieza que tiene que ganar la pantalla cuando termina de
            crecer. El margen de arriba es el del bloque, no del video, para
            que el zoom no tenga que compensarlo.
            El hueco es corto a proposito: el video tiene que leerse como la
            continuacion de los CTA, no como otra seccion. Con
            `zoom_origin="top"` este margen es TODO el aire que se ve: el video
            crece anclado a su borde de arriba, asi que no se despega solo. */}
          <div className="mt-16 sm:mt-20">
            <HeroVideo dict={dict} />
          </div>
        </Container>
      </section>
    </ScrollLift>
  );
}
