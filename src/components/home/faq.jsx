import { AccentTitle } from "@/components/home/accent_title";
import { FaqList } from "@/components/home/faq_list";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";

/**
 * Las preguntas frecuentes, en un acordeon.
 *
 * > **Reemplaza a la seccion de confidencialidad**, que era una lista de tres
 * > puntos con un tilde. El argumento no se perdio: la confidencialidad es la
 * > objecion mas grande que tiene una encuesta de clima, asi que entro como la
 * > PRIMERA pregunta, que es donde alguien la va a buscar.
 *
 * **Esta seccion existe porque el producto se vende por autoservicio.** No hay
 * nadie del otro lado para aclarar una duda antes de que alguien cree la
 * cuenta: lo que no este contestado acá se convierte en una persona que se va.
 *
 * La seccion es un Server Component y la lista no, porque el acordeon tiene
 * estado. Es el mismo reparto que `HeroTitle`: la parte que necesita cliente se
 * muda a su propio archivo y el resto se queda del lado del servidor.
 */
export function Faq({ dict }) {
  return (
    <section id="faq" className="scroll-mt-24 overflow-x-clip py-24 sm:py-32">
      <Container>
        <ScrollPass {...HEADING_PASS}>
          <div className="max-w-2xl">
            <AccentTitle segments={dict.faq_title_segments} />
            <p className="mt-5 text-xl leading-relaxed text-muted-foreground text-pretty">
              {dict.faq_body}
            </p>
          </div>
        </ScrollPass>

        <FaqList items={dict.faq_items} class_name="mt-12" />
      </Container>
    </section>
  );
}
