import { Elms_Sans, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { AtmosphereField } from "@/components/effects/atmosphere_field";
import { PageGrain } from "@/components/effects/page_grain";
import { ScrollGlide } from "@/components/motion/scroll_glide";
import { ThemeProvider } from "@/components/site/theme_provider";
import { get_dictionary } from "@/lib/dictionaries";
import { LOCALES, is_locale, site_config } from "@/lib/site_config";
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

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) return {};

  const dict = await get_dictionary(lang);

  return {
    // `template` es lo que le pone la marca al <title> de las paginas hijas:
    // una doc exporta "Satisfaccion y Clima" y sale "Satisfaccion y Clima —
    // Knotfix Clima". `default` es el de la home, que no declara titulo propio
    // y por eso NO pasa por la plantilla (si no, diria la marca dos veces).
    title: {
      default: dict.meta_title,
      template: `%s — ${site_config.brand} ${site_config.product}`,
    },
    description: dict.meta_description,
    metadataBase: new URL(site_config.domain),
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `/${locale}`]),
      ),
    },
    openGraph: {
      title: dict.meta_title,
      description: dict.meta_description,
      locale: lang,
      type: "website",
    },
    // La imagen NO se declara aca: la pone el archivo `opengraph-image.js` de
    // este mismo segmento, y Next la inyecta en `og:image` solo. Escribirla
    // ademas en `openGraph.images` seria declararla dos veces y en dos lugares
    // que se desincronizan.
    //
    // **Lo que si hay que declarar es la tarjeta**, porque `opengraph-image` no
    // emite ni una etiqueta `twitter:*` — eso lo hace `twitter-image.js`, que
    // esta al lado y reexporta esta misma imagen. Sin `card`, X muestra la
    // miniatura chica al costado del texto en vez de la tarjeta grande.
    twitter: {
      card: "summary_large_image",
      title: dict.meta_title,
      description: dict.meta_description,
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!is_locale(lang)) notFound();

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
