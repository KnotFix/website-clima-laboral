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

        {/* La luz llega hasta el video y ahi se corta.
            `.page-light` es una capa FIJA detras de toda la pagina, asi que no
            se puede "terminar" en un punto del documento: lo que la corta es
            que de aca para abajo haya fondo propio. `bg-background` es opaco y
            del mismo color, o sea que estas secciones quedan en el gris pelado
            y los destellos solo existen arriba, donde esta el video.
            Va en un envoltorio y no seccion por seccion para que sea una sola
            decision y no ocho que se pueden desincronizar. */}
        <div className="bg-background">
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

          <WorldReach dict={dict} />
          <ScaleTree dict={dict} />
          <HowItWorks dict={dict} />
          <WeightsFilters dict={dict} />
          <Confidentiality dict={dict} />
          <FinalCta dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
