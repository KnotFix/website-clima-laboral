import { ImageResponse } from "next/og";

import { get_dictionary } from "@/lib/dictionaries";
import { LOCALES, site_config } from "@/lib/site_config";

export const alt = "Knotfix Clima";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Sin esto la ruta sale `f` (Dynamic) en la tabla del build: `[lang]` es un
 * segmento dinamico y el `generateStaticParams` del layout **no** alcanza a las
 * rutas de metadatos. El resultado es que cada rastreador que pasa dispara un
 * render de Satori. Con los dos idiomas declarados aca, las dos imagenes se
 * generan en el build y despues se sirven como archivos.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * La tarjeta que se ve cuando alguien pega un enlace del sitio en WhatsApp,
 * Slack o LinkedIn. Sin esto no hay vista previa: solo la URL pelada.
 *
 * **Va bajo `[lang]` y no en la raiz**, asi que hay una por idioma y las rutas
 * hijas —docs, legales, changelog— la heredan sin declarar nada. El texto sale
 * del diccionario, igual que el resto del sitio: `meta_description` es la unica
 * frase que ya esta escrita en los dos idiomas para explicar el producto de un
 * tiron, que es exactamente el trabajo de esta imagen.
 *
 * ## Sin fuente propia, a proposito
 *
 * `ImageResponse` deja cargar un `.woff` y usar Elms Sans, la del sitio. No se
 * hace: obliga a leer un archivo en cada build para una imagen que nadie mira de
 * cerca, y es un punto de fallo nuevo —si el archivo no esta, el build se cae—
 * a cambio de una diferencia tipografica que en una miniatura de Slack no se
 * ve. La marca la sostienen el color y la composicion.
 *
 * ## Los colores son literales, y aca si corresponde
 *
 * Satori no tiene CSS custom properties: esto se renderiza fuera del navegador
 * y `var(--background)` no resuelve contra nada. Es el mismo caso que el halo
 * WebGL de `globe.jsx`, y vale la misma advertencia — **si la paleta oscura
 * cambia, estos tres valores hay que moverlos a mano**:
 *
 *   fondo #0b0a0f (`--background` oscuro)
 *   texto #f4f3f6 (`--foreground` oscuro)
 *   marca #fb923c (`--brand` oscuro)
 *
 * Va en oscuro y no en claro porque es la version del sitio que mejor sobrevive
 * a una miniatura: sobre el blanco, el naranja de marca y el gris apagado se
 * lavan cuando la tarjeta se muestra a 300px de ancho.
 */
export default async function Image({ params }) {
  const { lang } = await params;
  const dict = await get_dictionary(lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#0b0a0f",
          // La atmosfera del sitio, reducida a una sola mancha. El nucleo cae
          // fuera del cuadro por la misma razon que en `SectionGlow`: lo que
          // entra es la caida, no el punto.
          backgroundImage:
            "radial-gradient(900px 600px at 100% 0%, rgba(251,146,60,0.22), rgba(251,146,60,0) 70%)",
          color: "#f4f3f6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34 }}>
          <span style={{ fontWeight: 700 }}>{site_config.brand}</span>
          <span style={{ marginLeft: 12, color: "#9491a0" }}>
            {site_config.product}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 52,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {dict.meta_description}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#fb923c" }}>
          {/* Sin el protocolo: es una firma, no un enlace en el que se hace
              clic. */}
          {site_config.domain.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}
