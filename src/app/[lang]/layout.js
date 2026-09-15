import { Elms_Sans, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { AtmosphereField } from "@/components/effects/atmosphere_field";
import { PageGrain } from "@/components/effects/page_grain";
import { ScrollGlide } from "@/components/motion/scroll_glide";
import { ThemeProvider } from "@/components/site/theme_provider";
import { JsonLd } from "@/components/site/json_ld";
import { get_dictionary } from "@/lib/dictionaries";
import { page_metadata } from "@/lib/seo";
import { LOCALES, is_locale, site_config } from "@/lib/site_config";
import {
  graph_ld,
  organization_ld,
  website_ld,
} from "@/lib/structured_data";
import "../globals.css";

// Elms Sans es variable (100-900), asi que un solo archivo cubre todos los
// pesos: el titular usa 600 y 400 sin descargar dos fuentes.
// Va por next/font y no por <link>: asi se auto-hospeda, no hay request a
// fonts.googleapis.com bloqueando el render y no hay salto de layout.
// Elms Sans es tan nueva que Next todavia no tiene sus metricas, asi que no
// puede generar el `size-adjust` de la fuente de respaldo (lo avisa al
// compilar). Se le fija un stack de respaldo a mano para acotar el salto
// mientras carga; desaparece cuando Next incorpore las metricas.
const elms_sans = Elms_Sans({
  variable: "--font-elms-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

const geist_mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * El color de la barra del navegador en movil, uno por tema. Son los dos
 * `--background` de `globals.css`, escritos a mano porque esto se emite como
 * `<meta>` y no resuelve CSS — **si la paleta cambia, se mueven los dos**.
 */
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a0f" },
  ],
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) return {};

  const dict = await get_dictionary(lang);

  // Lo que comparten todas las paginas —canonical, hreflang con x-default,
  // Open Graph, tarjeta de X— lo arma `page_metadata`, y cada ruta hija lo
  // vuelve a llamar con lo suyo. Es a proposito que cada pagina declare el
  // bloque ENTERO: Next hereda `openGraph` y `twitter` como objetos completos,
  // no campo por campo, asi que una pagina que solo pusiera el titulo saldria
  // con la tarjeta de la home. Ver `lib/seo.js`.
  const shared = page_metadata({
    lang,
    path: "",
    description: dict.meta_description,
  });

  return {
    // `template` es lo que le pone la marca al <title> de las paginas hijas:
    // una doc exporta "Satisfaccion y Clima" y sale "Satisfaccion y Clima —
    // Censuma". `default` es el de la home, que no declara titulo propio
    // y por eso NO pasa por la plantilla (si no, diria la marca dos veces).
    title: {
      default: dict.meta_title,
      template: `%s — ${site_config.product}`,
    },
    metadataBase: new URL(site_config.domain),
    ...shared,
    // La home es la unica cuyo titulo ya trae la marca: se pone tal cual en
    // la tarjeta, sin pasarlo por `branded_title`.
    openGraph: { ...shared.openGraph, title: dict.meta_title },
    twitter: { ...shared.twitter, title: dict.meta_title },
    // La imagen la GENERA `opengraph-image.js` (y `twitter-image.js`) de este
    // segmento, pero su URL la declara `page_metadata`, para todas las paginas
    // por igual: la inyeccion automatica de Next alcanza solo a este nivel, y
    // las hijas la perdian al declarar su propio `openGraph`. Ver `lib/seo.js`.
    //
    // Search Console: la etiqueta de verificacion sale solo si la variable
    // esta puesta AL COMPILAR (es `NEXT_PUBLIC_*`, va en Build Args). Vacia
    // o ausente, no se emite nada. La alternativa que no toca el build es
    // verificar el dominio por DNS, que ademas cubre `app.censuma.com`.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!is_locale(lang)) notFound();

  const dict = await get_dictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${elms_sans.variable} ${geist_mono.variable} antialiased`}
    >
      {/* suppressHydrationWarning tambien en el body: varias extensiones de
          navegador le inyectan atributos antes de que React hidrate, y ese
          desajuste aborta la hidratacion del arbol. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Las manchas y las ondas del fondo, DETRAS de todo. Van aca y no en
              `page.js` porque son de la pagina entera y no del home: alcanzan
              tambien a las docs y a los legales, que sin esto quedaban sobre el
              fondo pelado.
              Va antes de `{children}` en el DOM por claridad, pero quien decide
              que quede atras es su `-z-10` — ver `.atmo-field`. */}
          <AtmosphereField />
          {/* Quien publica y que sitio es, en schema.org. Va en el layout
              porque es de TODAS las paginas; cada ruta agrega lo suyo (la
              FAQ, la miga, el articulo) con otro `<JsonLd>` y lo engancha a
              estas entidades por `@id`. Ver `lib/structured_data.js`. */}
          <JsonLd data={graph_ld(organization_ld(), website_ld(lang, dict))} />
          {/* El hielo del scroll. No dibuja nada: engancha la rueda y deja que
              la pagina siga bajando un instante despues del gesto.
              Va en el layout porque es de la navegacion y no de una seccion, y
              tiene que existir una sola vez. Solo la rueda se intercepta: el
              teclado, las anclas y el foco quedan nativos. */}
          <ScrollGlide />
          {children}
          {/* El grano va ULTIMO y por encima de todo: es una propiedad de la
              lente, no del fondo. */}
          <PageGrain />
        </ThemeProvider>
      </body>
    </html>
  );
}
