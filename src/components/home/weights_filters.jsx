import { GlassPanel } from "@/components/effects/glass_panel";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";

import { Container } from "@/components/site/container";

/**
 * La seccion diferenciadora: pesos y cruce de filtros. Es donde el parallax
 * pega mas fuerte porque hay dos columnas a distinta profundidad.
 */
export function WeightsFilters({ dict }) {
  return (
    <section
      id="weights"
      className="scroll-mt-24 border-t border-border py-24 sm:py-32"
    >
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Pegajosa y sin parallax: la columna izquierda es corta y la
              derecha larga, asi que sin esto queda medio metro de vacio al
              costado. El parallax de las tarjetas alcanza para dar la
              profundidad — y un transform en este bloque romperia el sticky. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ScrollPass {...HEADING_PASS}>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {dict.weights_title}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                {dict.weights_body}
              </p>
            </ScrollPass>
          </div>

          <Parallax scroll_speed={0.24} class_name="flex flex-col gap-4">
            {dict.weights_points.map((point, index) => (
              <Reveal key={point.title} reveal_delay={index * 0.07}>
                <GlassPanel class_name="p-5 sm:p-6">
                  <h3 className="text-lg font-medium tracking-tight sm:text-xl">
                    {point.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                    {point.body}
                  </p>
                </GlassPanel>
              </Reveal>
            ))}
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
