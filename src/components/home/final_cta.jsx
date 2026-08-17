import { GridBackdrop } from "@/components/effects/grid_backdrop";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { site_config } from "@/lib/site_config";

export function FinalCta({ dict }) {
  return (
    <section className="relative overflow-hidden section-seam py-28 sm:py-36">
      <GridBackdrop />
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
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.final_cta_title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
              {dict.final_cta_body}
            </p>
            <Button asChild size="lg" className="mt-9">
              <a href={site_config.signup_url}>{dict.final_cta_button}</a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
