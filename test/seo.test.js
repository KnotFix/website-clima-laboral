import { describe, expect, it } from "vitest";

import en from "@/content/en";
import es from "@/content/es";
import { LEGAL_NAV } from "@/content/legal/nav";
import { branded_title, hreflang_of, page_metadata } from "@/lib/seo";
import { DEFAULT_LOCALE, LOCALES, site_config } from "@/lib/site_config";
import {
  breadcrumb_ld,
  doc_article_ld,
  faq_ld,
  graph_ld,
  organization_ld,
  website_ld,
} from "@/lib/structured_data";

/**
 * Lo que un buscador lee del sitio, y que falla en silencio si se rompe: un
 * `hreflang` al que le falta un idioma no tira error, solo hace que Google
 * elija mal; una FAQ declarada con otro texto que el visible no rompe nada,
 * solo se penaliza. Ver `README.md`, seccion SEO.
 */

describe("page_metadata", () => {
  it("declara los dos idiomas y el x-default en cada pagina", () => {
    const meta = page_metadata({
      lang: "en",
      path: "/docs/kiosk",
      title: "Kiosk",
      description: "d",
    });

    expect(Object.keys(meta.alternates.languages).sort()).toEqual(
      [...LOCALES, "x-default"].sort(),
    );
    expect(meta.alternates.languages["x-default"]).toBe(
      `/${DEFAULT_LOCALE}/docs/kiosk`,
    );
    expect(meta.alternates.canonical).toBe("/en/docs/kiosk");
  });

  it("la tarjeta lleva la marca aunque el <title> pase por la plantilla", () => {
    const meta = page_metadata({
      lang: "es",
      path: "/docs/kiosk",
      title: "El kiosco",
      description: "d",
    });

    // `title` va pelado: la plantilla del layout le agrega la marca. Pero
    // `openGraph.title` NO pasa por la plantilla, asi que va con la marca.
    expect(meta.title).toBe("El kiosco");
    expect(meta.openGraph.title).toBe(branded_title("El kiosco"));
    expect(meta.twitter.title).toBe(branded_title("El kiosco"));
    expect(meta.openGraph.url).toBe(`${site_config.domain}/es/docs/kiosk`);
    expect(meta.twitter.card).toBe("summary_large_image");
    // La imagen viaja con cada pagina: sin esto, las hijas la perdian.
    expect(meta.openGraph.images[0].url).toBe("/es/opengraph-image");
    expect(meta.twitter.images[0].url).toBe("/es/opengraph-image");
  });

  it("la home no declara titulo: usa el default del layout", () => {
    const meta = page_metadata({ lang: "es", path: "", description: "d" });
    expect(meta).not.toHaveProperty("title");
    expect(meta.alternates.canonical).toBe("/es");
  });

  it("el og:locale va en formato idioma_TERRITORIO", () => {
    for (const lang of LOCALES) {
      const meta = page_metadata({ lang, description: "d" });
      expect(meta.openGraph.locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
      expect(meta.openGraph.alternateLocale).not.toContain(
        meta.openGraph.locale,
      );
    }
  });

  it("el sitemap y el <head> emiten el mismo hreflang", () => {
    // El sitemap pide URLs absolutas; el <head> relativas (metadataBase las
    // completa). Son la misma tabla con otra base.
    const head = hreflang_of("/changelog");
    const sitemap = hreflang_of("/changelog", site_config.domain);
    for (const key of Object.keys(head)) {
      expect(sitemap[key]).toBe(`${site_config.domain}${head[key]}`);
    }
  });
});

describe("titulo y descripcion", () => {
  it.each([
    ["es", es],
    ["en", en],
  ])("%s: el titulo cabe en un resultado y la descripcion tambien", (_, dict) => {
    expect(dict.meta_title.length).toBeLessThanOrEqual(60);
    expect(dict.meta_description.length).toBeLessThanOrEqual(160);
    expect(dict.meta_title).toContain(site_config.product);
  });

  it("cada legal tiene descripcion en los dos idiomas", () => {
    for (const entry of LEGAL_NAV) {
      for (const lang of LOCALES) {
        expect(entry.description?.[lang], `${entry.slug}/${lang}`).toBeTruthy();
        expect(entry.description[lang].length).toBeLessThanOrEqual(160);
      }
    }
  });
});

describe("datos estructurados", () => {
  it("la FAQ declarada es exactamente la que se ve", () => {
    for (const dict of [es, en]) {
      const ld = faq_ld(dict);
      expect(ld.mainEntity.map((q) => q.name)).toEqual(
        dict.faq_items.map((item) => item.question),
      );
      expect(ld.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(
        dict.faq_items.map((item) => item.answer),
      );
    }
  });

  it("todo lo que el grafo referencia por @id existe en el grafo", () => {
    // El `@id` es una promesa: «la organizacion de la que hablo es ESA».
    // Referenciar un nodo que nadie declara la rompe en silencio, y es lo que
    // pasaba con el `SoftwareApplication` que se retiro el 2026-09-17: las
    // docs lo citaban en `about` y la home era la unica que lo declaraba.
    const grafo = graph_ld(
      organization_ld(),
      website_ld("es", es),
      doc_article_ld("es", "/docs/kiosk", { title: "K" }),
    );

    const declarados = new Set(grafo["@graph"].map((e) => e["@id"]));
    for (const entidad of grafo["@graph"]) {
      for (const campo of ["publisher", "author", "about", "isPartOf"]) {
        const ref = entidad[campo]?.["@id"];
        if (ref) {
          expect(declarados, `${entidad["@type"]}.${campo}`).toContain(ref);
        }
      }
    }
    expect(organization_ld().logo.url).toMatch(/\.png$/);
  });

  it("la miga numera desde 1 y el ultimo escalon no lleva URL", () => {
    const ld = breadcrumb_ld("es", [
      { name: "Inicio", path: "" },
      { name: "Docs", path: "/docs" },
      { name: "Pagina", path: null },
    ]);
    const items = ld.itemListElement;
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items[0].item).toBe(`${site_config.domain}/es`);
    expect(items[1].item).toBe(`${site_config.domain}/es/docs`);
    expect(items[2]).not.toHaveProperty("item");
  });

  it("el escalon del grupo lleva el ancla de su seccion", () => {
    // Es el unico escalon intermedio que no es una pagina. Search Console
    // marco como error critico el 2026-09-17 que saliera sin `item`; el ancla
    // de `/docs` es su destino y el que hace que el campo exista.
    const ld = breadcrumb_ld("en", [
      { name: "Inicio", path: "" },
      { name: "Docs", path: "/docs" },
      { name: "Interpreting", path: "/docs#interpreting" },
      { name: "Pagina", path: null },
    ]);
    expect(ld.itemListElement[2].item).toBe(
      `${site_config.domain}/en/docs#interpreting`,
    );
  });

  it("un escalon intermedio sin ruta revienta el build", () => {
    // La mitad que falta del test de arriba: que el arreglo no se pueda
    // deshacer en silencio. Google invalida la miga ENTERA por un `item` que
    // falta, y sin este `throw` la unica forma de enterarse es un correo de
    // Search Console un mes despues.
    expect(() =>
      breadcrumb_ld("es", [
        { name: "Inicio", path: "" },
        { name: "Grupo", path: null },
        { name: "Pagina", path: null },
      ]),
    ).toThrow(/escalon 2/);
  });

  it("la doc declara autor, imagen y las dos fechas", () => {
    // Los cuatro campos que Google recomienda para un articulo y que Search
    // Console reporta uno por uno mientras no esten.
    const ld = doc_article_ld(
      "en",
      "/docs/kiosk",
      { title: "Kiosk", description: "d" },
      { published: "2026-08-17", updated: "2026-09-13" },
    );

    expect(ld.author["@id"]).toBe(organization_ld()["@id"]);
    expect(ld.image).toBe(`${site_config.domain}/en/opengraph-image`);
    expect(ld.datePublished).toBe("2026-08-17");
    expect(ld.dateModified).toBe("2026-09-13");
  });

  it("una doc sin fechas omite los campos en vez de inventarlos", () => {
    const ld = doc_article_ld("es", "/docs/kiosk", { title: "K" });
    expect(ld).not.toHaveProperty("datePublished");
    expect(ld).not.toHaveProperty("dateModified");
  });

  it("el grafo lleva contexto y descarta entidades vacias", () => {
    const g = graph_ld(organization_ld(), null, undefined);
    expect(g["@context"]).toBe("https://schema.org");
    expect(g["@graph"]).toHaveLength(1);
  });
});
