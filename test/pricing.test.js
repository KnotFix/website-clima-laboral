import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import en from "@/content/en";
import es from "@/content/es";
import { classify_link } from "@/lib/analytics";
import { FEATURED_PLAN, fill, format_price, pricing_cards } from "@/lib/pricing";
import { site_config } from "@/lib/site_config";

/**
 * La pagina de precios lee el catalogo del producto y arma las tarjetas con las
 * mismas reglas que `lib/registro.ts` de la app. Lo que se vigila aca es lo que
 * falla en silencio: un tope ilimitado que sale como «0», un eje que la API
 * todavia no publica y aparece como «sin límite», o un boton que deja de
 * contar como alta en la medicion.
 */

// La forma real de `GET /api/planes-publicos/` en produccion (2026-10-12),
// sin `max_whatsapp_por_periodo`: ese campo llego a `dev` antes.
const CATALOG = [
  {
    codigo: "corporativo",
    name: "Corporativo",
    orden: 3,
    precio_anual_centavos: 1200000,
    moneda: "USD",
    contratable: true,
    max_estudios_por_periodo: 6,
    max_empleados_activos: 2000,
    max_boletas: null,
    max_correos_por_periodo: 12000,
    max_estaciones_kiosco: null,
    precio_empleado_extra_centavos: 1000,
    max_empleados_extra: 1000,
  },
  {
    codigo: "starter",
    name: "Starter",
    orden: 1,
    precio_anual_centavos: 250000,
    moneda: "USD",
    contratable: true,
    max_estudios_por_periodo: 1,
    max_empleados_activos: 100,
    max_boletas: null,
    max_correos_por_periodo: 400,
    max_estaciones_kiosco: null,
    precio_empleado_extra_centavos: 3000,
    max_empleados_extra: 50,
  },
  {
    codigo: "profesional",
    name: "Profesional",
    orden: 2,
    precio_anual_centavos: 500000,
    moneda: "USD",
    contratable: true,
    max_estudios_por_periodo: 2,
    max_empleados_activos: 500,
    max_boletas: null,
    max_correos_por_periodo: 2000,
    max_estaciones_kiosco: null,
    precio_empleado_extra_centavos: 1500,
    max_empleados_extra: 250,
  },
  {
    codigo: "custom",
    name: "Custom",
    orden: 4,
    precio_anual_centavos: null,
    moneda: "USD",
    contratable: false,
    max_estudios_por_periodo: null,
    max_empleados_activos: null,
    max_boletas: null,
    max_correos_por_periodo: null,
    max_estaciones_kiosco: null,
    precio_empleado_extra_centavos: null,
    max_empleados_extra: null,
  },
];

describe("pricing_cards", () => {
  it("pone la prueba adelante y ordena el catalogo por `orden`", () => {
    const ids = pricing_cards(CATALOG, es, "es").map((card) => card.id);
    expect(ids).toEqual(["trial", "starter", "profesional", "corporativo", "custom"]);
  });

  it("deriva las viñetas de los topes, con singular, plural e ilimitado", () => {
    const starter = pricing_cards(CATALOG, es, "es").find((card) => card.id === "starter");
    expect(starter.features).toEqual([
      "1 estudio al año",
      "100 personas en nómina",
      "Boletas sin límite",
      "Estaciones de kiosco sin límite",
      "400 correos por período",
      "$30 al año por persona adicional (hasta 50 más)",
    ]);
  });

  it("omite un eje que la API no publica, en vez de darlo por ilimitado", () => {
    const starter = pricing_cards(CATALOG, en, "en").find((card) => card.id === "starter");
    expect(starter.features.some((line) => /WhatsApp/.test(line))).toBe(false);

    const with_whatsapp = CATALOG.map((plan) => ({ ...plan, max_whatsapp_por_periodo: 200 }));
    const again = pricing_cards(with_whatsapp, en, "en").find((card) => card.id === "starter");
    expect(again.features).toContain("200 WhatsApp messages per period");
  });

  it("da el precio de lista y el precio por persona", () => {
    const corporate = pricing_cards(CATALOG, en, "en").find((card) => card.id === "corporativo");
    expect(corporate.price).toBe("$12,000");
    expect(corporate.per_person).toBe("$6 per person per year");
  });

  it("marca un solo destacado", () => {
    const featured = pricing_cards(CATALOG, es, "es").filter((card) => card.featured);
    expect(featured.map((card) => card.id)).toEqual([FEATURED_PLAN]);
    expect(featured[0].badge).toBe(es.pricing_paid.featured);
  });

  it("el plan a medida abre el correo y su umbral sale del plan mas grande", () => {
    const custom = pricing_cards(CATALOG, es, "es").find((card) => card.id === "custom");
    expect(custom.href.startsWith(`mailto:${site_config.contact.email}`)).toBe(true);
    expect(custom.description).toContain("2,000");
    expect(custom.period).toBeNull();
  });

  it("los botones de alta cuentan como alta en la medicion, con su plan", () => {
    for (const card of pricing_cards(CATALOG, en, "en").filter((c) => c.id !== "custom")) {
      const kind = classify_link(card.href, site_config.app_url);
      expect(kind.is_sign_up, card.id).toBe(true);
      expect(kind.plan).toBe(card.id === "trial" ? null : card.id);
    }
  });

  it("ninguna plantilla queda con una llave sin rellenar", () => {
    for (const [lang, dict] of [
      ["es", es],
      ["en", en],
    ]) {
      for (const card of pricing_cards(CATALOG, dict, lang)) {
        const text = [card.description, card.price, card.period, card.per_person, ...card.features]
          .filter(Boolean)
          .join(" ");
        expect(text, `${lang}/${card.id}`).not.toMatch(/\{\w+\}/);
      }
    }
  });
});

describe("fill y format_price", () => {
  it("deja intacta una llave que no se paso", () => {
    expect(fill("{a} y {b}", { a: 1 })).toBe("1 y {b}");
  });

  it("formatea en dolares sin decimales en los dos idiomas", () => {
    expect(format_price(250000, "USD", "es")).toBe("$2,500");
    expect(format_price(250000, "USD", "en")).toBe("$2,500");
  });
});

describe("sitemap", () => {
  it("lista la pagina de precios en los dos idiomas", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain(`${site_config.domain}/es/pricing`);
    expect(urls).toContain(`${site_config.domain}/en/pricing`);
  });
});
