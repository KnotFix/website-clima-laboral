import { Reveal } from "@/components/motion/reveal";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";
import { Separator } from "@/components/ui/separator";

/**
 * Seccion critica: el SaaS se vende por autoservicio, asi que esta es la que
 * convence de que arrancar es facil. El primer paso (subir la nomina) es el
 * que suena pesado y por eso lleva el peso del copy.
 */
export function HowItWorks({ dict }) {
  return (
    <section id="how" className="scroll-mt-24 border-t border-border py-24 sm:py-32">
      <Container>
        {/* El titular entra y sale con el scroll; los pasos siguen con
            `Reveal`. Una lista que se atenua mientras alguien la esta leyendo es
            otra cosa que un titular que se va. */}
        <ScrollPass {...HEADING_PASS}>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {dict.how_title}
          </h2>
        </ScrollPass>

        <ol className="mt-16 flex flex-col">
          {dict.how_steps.map((step, index) => (
            <li key={step.step_title}>
              {index > 0 && <Separator className="my-10" />}
              <Reveal reveal_delay={index * 0.06}>
                <div className="grid gap-4 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8">
                  <span
                    aria-hidden="true"
                    className="text-4xl font-semibold tabular-nums text-muted-foreground/40"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-medium tracking-tight sm:text-xl">
                      {step.step_title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                      {step.step_body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
