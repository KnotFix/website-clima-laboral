import { ArrowRight, Mail, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrollLift } from "@/components/motion/scroll_lift";
import { PricingGrid } from "@/components/pricing/pricing_grid";
import { Container } from "@/components/site/container";
import { FOOTER_LIFT, FOOTER_SPAN, Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json_ld";
import { Navbar } from "@/components/site/navbar";
import { Button } from "@/components/ui/button";
import { get_dictionary } from "@/lib/dictionaries";
import { fetch_plans, pricing_cards, signup_url_for } from "@/lib/pricing";
import { page_metadata } from "@/lib/seo";
import { LOCALES, is_locale, site_config } from "@/lib/site_config";
import { breadcrumb_ld, graph_ld } from "@/lib/structured_data";

/**
 * La pagina se regenera, como mucho, una vez por hora: el catalogo de planes
 * se cambia con un UPDATE en la base del producto y no con un deploy del sitio,
 * asi que la pagina tiene que enterarse sola. Va escrito como literal porque
 * Next lo lee al compilar y no acepta una constante importada; es el mismo
 * numero que `PRICING_REVALIDATE_S` de `lib/pricing.js`.
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) return {};

  const dict = await get_dictionary(lang);

  return page_metadata({
    lang,
    path: "/pricing",
    title: dict.pricing_meta_title,
    description: dict.pricing_meta_description,
  });
}

/**
 * Precios: una pagina del sitio, fuera de la home.
 *
 * Hasta el 2026-10-12 «Precios» llevaba a la pantalla de registro de la app,
 * que es una SPA en otro dominio y no la indexa nadie. El usuario quiere que la
 * lista de planes sea parte del sitio para que el buscador la encuentre, pero
 * NO en el scroll de la home: es una ruta propia, como las docs.
 *
 * Los botones siguen yendo a la app (el registro, con el idioma), porque ahi
 * es donde se contrata; lo que cambio es que la lista se lee aca.
 *
 * Sin `Product` ni `SoftwareApplication` en el JSON-LD, a proposito: los dos
 * piden campos que no tenemos (reseñas, calificacion) y un tipo incompleto es
 * un rojo permanente en Search Console. Solo la miga. Ver
 * `lib/structured_data.js`.
 */
export default async function PricingPage({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) notFound();

  const dict = await get_dictionary(lang);
  const plans = await fetch_plans();
  const cards = plans ? pricing_cards(plans, dict, lang) : null;

  return (
    <>
      <JsonLd
        data={graph_ld(
          breadcrumb_ld(lang, [
            { name: dict.meta_title, path: "" },
            { name: dict.nav_pricing, path: null },
          ]),
        )}
      />
      <Navbar lang={lang} dict={dict} section_base={`/${lang}`} />

      {/* El mismo envoltorio que el changelog: `bg-background` opaco para que
          los destellos de fondo no le peleen a la tabla, y el destape del pie
          con `ScrollLift`. Ver `changelog/page.js`. */}
      <ScrollLift
        lift={FOOTER_LIFT}
        span={FOOTER_SPAN}
        class_name="flex flex-1 flex-col"
        inner_class_name="flex flex-1 flex-col"
      >
        <main id="main" className="flex flex-1 flex-col bg-background">
          {/* `pt-28` despeja la isla del navbar, que es fija. */}
          <Container class_name="pt-28 pb-16 lg:pt-36 lg:pb-24">
            <header className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {dict.pricing_title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                {dict.pricing_body}
              </p>
              <p className="mt-6 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground">
                {dict.pricing_billing}
              </p>
            </header>

            <div className="mt-10">
              {cards ? (
                <PricingGrid cards={cards} dict={dict} />
              ) : (
                // Sin catalogo (la API no contesto al compilar) no se inventa
                // una lista: se manda a la app, que la carga sola. La proxima
                // regeneracion completa la pagina.
                <div className="rounded-xl border border-border p-6">
                  <p className="text-muted-foreground">{dict.pricing_unavailable}</p>
                  <Button asChild size="lg" className="mt-4">
                    <a
                      href={signup_url_for(lang, null)}
                      data-track="pricing_unavailable"
                      data-track-location="pricing"
                    >
                      {dict.pricing_unavailable_button}
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-8 max-w-3xl space-y-2 text-sm text-muted-foreground">
              <p>{dict.pricing_trial_note}</p>
              <p>{dict.pricing_currency_note}</p>
              <p>
                {dict.pricing_docs_hint}{" "}
                <Link
                  href={`/${lang}/docs/account-and-plan`}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  {dict.pricing_docs_link}
                </Link>
              </p>
            </div>

            {/* Las dos respuestas a «¿y si no quiero hacer esto yo?», como en la
                pantalla de precios de la app: una muestra el producto, la otra
                ofrece que lo operemos nosotros. Van DESPUES de la tabla y no
                arriba como en la app: alla quien llega ya decidio registrarse,
                y aca la pagina existe para que se lea el precio. */}
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <aside className="flex flex-col items-start gap-4 rounded-xl border border-border bg-muted/40 p-6">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {dict.pricing_demo_title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{dict.pricing_demo_body}</p>
                </div>
                <Button asChild size="lg" variant="outline" className="mt-auto">
                  <a
                    href={`${site_config.app_url}/demo`}
                    data-track="pricing_demo"
                    data-track-location="pricing"
                  >
                    <Play aria-hidden="true" />
                    {dict.pricing_demo_button}
                  </a>
                </Button>
              </aside>

              <aside className="flex flex-col items-start gap-4 rounded-xl border border-border bg-muted/40 p-6">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {dict.pricing_assisted_title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dict.pricing_assisted_body}
                  </p>
                </div>
                <Button asChild size="lg" variant="outline" className="mt-auto">
                  <a
                    href={`mailto:${site_config.contact.email}?subject=${encodeURIComponent(
                      dict.pricing_assisted_subject,
                    )}`}
                    data-track="pricing_assisted"
                    data-track-location="pricing"
                  >
                    <Mail aria-hidden="true" />
                    {dict.pricing_assisted_button}
                  </a>
                </Button>
              </aside>
            </div>
          </Container>
        </main>
      </ScrollLift>

      <Footer lang={lang} dict={dict} section_base={`/${lang}`} />
    </>
  );
}
