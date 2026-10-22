import { ScrollLift } from "@/components/motion/scroll_lift";
import { Container } from "@/components/site/container";
import { FOOTER_LIFT, FOOTER_SPAN, Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

/**
 * El marco de las paginas de recursos: navbar, contenido y el pie que se
 * destapa. Es el mismo envoltorio que precios y el changelog (ver
 * `pricing/page.js`), escrito una vez porque aca lo usan dos paginas.
 */
export function ResourceFrame({ lang, dict, children }) {
  return (
    <>
      <Navbar lang={lang} dict={dict} section_base={`/${lang}`} />

      <ScrollLift
        lift={FOOTER_LIFT}
        span={FOOTER_SPAN}
        class_name="flex flex-1 flex-col"
        inner_class_name="flex flex-1 flex-col"
      >
        <main id="main" className="flex flex-1 flex-col bg-background">
          {/* `pt-28` despeja la isla del navbar, que es fija. */}
          <Container class_name="pt-28 pb-16 lg:pt-36 lg:pb-24">{children}</Container>
        </main>
      </ScrollLift>

      <Footer lang={lang} dict={dict} section_base={`/${lang}`} />
    </>
  );
}
