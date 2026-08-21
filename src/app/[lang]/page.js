import { SectionGlow } from "@/components/effects/section_glow";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final_cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how_it_works";
import { Measurement } from "@/components/home/measurement";
import { WorldReach } from "@/components/home/world_reach";
import { Problem } from "@/components/home/problem";
import { PinnedChapter } from "@/components/motion/pinned_chapter";
import { ScrollLift } from "@/components/motion/scroll_lift";
import { ScaleTree } from "@/components/home/scale_tree";
import { WeightsFilters } from "@/components/home/weights_filters";
import { FOOTER_LIFT, FOOTER_SPAN, Footer } from "@/components/site/footer";
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

        {/* **Aca vivia `.light-handoff`**, un envoltorio que pintaba un
            degradado de transparente a `--background` para apagar de a poco la
            luz FIJA que habia detras de toda la pagina. Esa luz se retiro hace
            rato, asi que lo unico que le quedaba era pintar blanco solido desde
            los 768px hacia abajo — o sea **tapar el fondo de la pagina en toda
            su altura**. Medido: 9645px de blanco encima de la atmosfera.
            El envoltorio se queda porque agrupa el bloque, pero ya no pinta. */}
        <div>
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

          {/* **Los dos `.section-band` ya no pintan nada**: `--band` esta en
              `transparent` en los dos temas. El fondo oscuro va parejo de punta
              a punta, al valor de "Una medicion" — el porque entero vive en
              `--band`, bloque `.dark` de `globals.css`.

              **Los envoltorios se quedan porque AGRUPAN**, que era ademas lo que
              decidia donde iba cada banda. No iban alternadas una si una no: el
              planeta y la escala son el mismo argumento —alcance— visto de dos
              maneras, asi que comparten bloque y se leen como un capitulo; el
              analisis va aparte por ser la seccion diferenciadora. Alternar
              mecanicamente daria seis cambios de valor y el fondo parpadearia en
              vez de tener cadencia. Esa es la nota que hay que leer el dia que
              la banda vuelva.

              `FinalCta` quedaba afuera porque su `GridBackdrop` hacia de banda;
              ese resplandor tambien esta apagado ahora. */}
          {/* **`SectionGlow` pinta SOLO EN TEMA CLARO.** En oscuro esta apagado
              por lo mismo que la banda: sus lobulos naranjas eran de lo que mas
              separaba a unas secciones de otras. Los `side` y los `tint` de
              abajo siguen gobernando el tema claro y quedan listos para cuando
              el oscuro los quiera de vuelta — ver `.dark .section-glow`.

              **El costado del resplandor alterna, y ese es todo el punto.**
              `SectionGlow` le da a cada seccion un lado mas cargado que el otro,
              y como los lobulos sangran en vertical, el de una se superpone con
              el de la vecina: lo que se ve en el solape es una banda cruzando de
              derecha a izquierda. Repetido siempre del mismo lado volveria a ser
              un patron parejo, que es justo el problema del que se sale.

              **`tint` es la posicion de cada seccion en el recorrido de la
              atmosfera**, de 0 arriba a 1 al pie. Sube parejo de a 0.2 y esta
              escrito a mano y no calculado sobre el indice a proposito: el orden
              de las secciones es una decision editorial —ver el comentario del
              capitulo, arriba— y si algun dia se reordenan, estos numeros tienen
              que revisarse a ojo y no seguirlas en silencio.

              **El tramo de arriba —hero, problema y medicion— no lleva glow, y
              depende solo de las manchas de `<AtmosphereField>`**, que son de
              pagina y llegan igual. En oscuro eso dejo de ser una excepcion: es
              lo que tienen TODAS las secciones, y "Una medicion" es justamente
              la referencia a la que se igualo el resto. Antes lo cubria ademas un degradado en el
              `body`; se retiro, asi que si ese tramo alguna vez queda pelado, la
              salida es mover una mancha y no devolver el lavado.
              `PinnedChapter` no se envuelve porque adentro tiene scroll pinneado
              y un envoltorio nuevo le cambiaria el bloque contenedor a lo que
              este en `sticky`. */}
          <div className="section-band">
            <SectionGlow side="right" tint={0.2}>
              <WorldReach dict={dict} />
            </SectionGlow>
            <SectionGlow side="left" tint={0.4}>
              <ScaleTree dict={dict} />
            </SectionGlow>
          </div>

          <SectionGlow side="right" tint={0.6}>
            <HowItWorks dict={dict} />
          </SectionGlow>

          <div className="section-band">
            <SectionGlow side="left" tint={0.8}>
              <WeightsFilters dict={dict} />
            </SectionGlow>
          </div>

          <SectionGlow side="right" tint={0.9}>
            <Faq dict={dict} />
          </SectionGlow>

          {/* El CTA cierra el recorrido en el extremo calido. Antes quedaba
              afuera porque su `GridBackdrop` hacia de banda; ese resplandor de
              marca despues se sumo al ambar del final, y hoy esta apagado en los
              dos temas — ver `grid_backdrop.jsx`. En claro el cierre lo sigue
              haciendo este `tint={1}`. */}
          {/* > **El pie sale desde ABAJO del CTA, y por eso la tapa es el CTA.**
              `ScrollLift` mete los primeros `FOOTER_LIFT` px del footer debajo de
              esta seccion —con un `margin-bottom` negativo— y le pone `z-10`
              para que le gane en el orden de pintado. Despues, al scrollear, el
              CTA se levanta esos mismos px y el panel del pie va apareciendo por
              el borde de abajo.

              Es el mismo componente que usa el hero para descubrir al problema.
              La franja opaca que lo hace posible vive adentro de `FinalCta`
              —`HeroCover`—, porque el `lift` y lo que hay que tapar son el mismo
              numero y tienen que poder mirarse juntos.

              **El envoltorio va por FUERA de `SectionGlow`.** Adentro, el
              `transform` de `ScrollLift` le crearia bloque contenedor al
              resplandor y la sangría vertical del ±18% —que es lo unico que
              conecta esta seccion con la anterior— quedaria medida contra otra
              caja. */}
          <ScrollLift lift={FOOTER_LIFT} span={FOOTER_SPAN}>
            <SectionGlow side="left" tint={1}>
              <FinalCta dict={dict} />
            </SectionGlow>
          </ScrollLift>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
