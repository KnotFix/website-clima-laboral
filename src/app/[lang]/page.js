import { SectionGlow } from "@/components/effects/section_glow";
import { Confidentiality } from "@/components/home/confidentiality";
import { FinalCta } from "@/components/home/final_cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how_it_works";
import { Measurement } from "@/components/home/measurement";
import { WorldReach } from "@/components/home/world_reach";
import { Problem } from "@/components/home/problem";
import { PinnedChapter } from "@/components/motion/pinned_chapter";
import { ScaleTree } from "@/components/home/scale_tree";
import { WeightsFilters } from "@/components/home/weights_filters";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { get_dictionary } from "@/lib/dictionaries";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await get_dictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      {/* Destino del enlace "saltar al contenido" del navbar. */}
      <main id="main" className="flex-1">
        {/* El problema va segundo: primero se plantea que las encuestas de
            clima no cambian nada y recien despues se afirma la solucion.
            Planeta y escala quedan pegados porque son el mismo argumento —
            alcance— visto de dos maneras. */}
        <Hero dict={dict} />

        {/* La luz se ENTREGA aca, no se corta.
            La capa de luz es FIJA detras de toda la pagina, asi que no se puede
            "terminar" en un punto del documento: lo unico que la apaga es que
            de aca para abajo haya fondo propio. Este envoltorio es ese fondo, y
            entra desde transparente en vez de arrancar opaco — ver
            `.light-handoff`. El ultimo tramo de luz le sobrevive al pie del
            hero y se apaga scrolleando; de ahi para abajo la pagina queda en el
            hueso pelado, igual que antes.
            Va en un envoltorio y no seccion por seccion para que sea una sola
            decision y no ocho que se pueden desincronizar. */}
        <div className="light-handoff">
          {/* **El problema y la medicion son un solo capitulo.** Se leen como
              dos diapositivas de un carrusel: la pila se arma con el titular
              quieto al lado, y cuando termina, esa composicion entera se va por
              la izquierda mientras el carrusel entra por la derecha. Durante
              todo el tramo la pagina no se mueve en vertical.
              Van envueltas y no sueltas porque el paneo es un solo movimiento
              con un solo avance: repartirlo entre dos secciones fue lo que hizo
              que antes no se sincronizaran. */}
          <PinnedChapter stack_steps={dict.problem_items.length}>
            <Problem dict={dict} />
            <Measurement dict={dict} />
          </PinnedChapter>

          {/* **Las bandas son el ritmo del scroll.** De aca para abajo la
              pagina son siete secciones con el mismo relleno; sin un cambio de
              valor en el camino, ~5000px de scroll pasan sin que el fondo se
              mueva una sola vez y eso es lo que la hace sentir plana.

              No van alternadas una si una no: van donde AGRUPAN. El planeta y
              la escala son el mismo argumento —alcance— visto de dos maneras,
              asi que comparten banda y se leen como un capitulo. El analisis se
              lleva la suya por ser la seccion diferenciadora. Alternar
              mecanicamente daria seis cambios de valor y el fondo empezaria a
              parpadear en vez de tener cadencia.

              `FinalCta` queda afuera a proposito: ya trae su propio
              `GridBackdrop` con el resplandor encendido, que es su banda. */}
          {/* **El costado del resplandor alterna, y ese es todo el punto.** De
              aca para abajo la luz de canvas ya se entrego, asi que el fondo no
              tiene de donde venir: `SectionGlow` le da a cada seccion un lado
              mas cargado que el otro. Repetido siempre del mismo lado volveria a
              ser un patron parejo, que es justo el problema del que se sale.
              `FinalCta` queda afuera: ya trae su `GridBackdrop` con el
              resplandor encendido. */}
          <div className="section-band">
            <SectionGlow side="right">
              <WorldReach dict={dict} />
            </SectionGlow>
            <SectionGlow side="left">
              <ScaleTree dict={dict} />
            </SectionGlow>
          </div>

          <SectionGlow side="right">
            <HowItWorks dict={dict} />
          </SectionGlow>

          <div className="section-band">
            <SectionGlow side="left">
              <WeightsFilters dict={dict} />
            </SectionGlow>
          </div>

          <SectionGlow side="right">
            <Confidentiality dict={dict} />
          </SectionGlow>

          <FinalCta dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
