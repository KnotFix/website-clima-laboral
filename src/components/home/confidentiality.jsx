import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";

/** Bloque sobrio a proposito: el tono es lo que transmite seriedad. */
export function Confidentiality({ dict }) {
  return (
    <section
      id="confidentiality"
      className="scroll-mt-24 section-seam py-24 sm:py-32"
    >
      <Container>
        <ScrollPass {...HEADING_PASS}>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.confidentiality_title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
              {dict.confidentiality_body}
            </p>
          </div>
        </ScrollPass>

        <ul className="mt-12 flex max-w-3xl flex-col gap-5">
          {dict.confidentiality_points.map((point, index) => (
            <Reveal key={point} reveal_delay={index * 0.07}>
              <li className="flex gap-3">
                <Check
                  aria-hidden="true"
                  className="mt-1.5 size-4 shrink-0 text-brand"
                />
                <span className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                  {point}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
