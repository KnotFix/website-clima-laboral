import { describe, expect, it } from "vitest";

import {
  capture_touch,
  decode_touch,
  encode_touch,
  is_own_host,
} from "@/lib/attribution";
import { classify_link, clip_text, is_section_seen } from "@/lib/analytics";
import {
  build_cookie,
  consent_bootstrap_script,
  consent_signals,
  cookie_domain_for,
  gtm_loader_script,
  is_gtm_id,
  parse_consent,
  read_cookie_from,
  serialize_consent,
} from "@/lib/consent";

/**
 * La medicion del sitio. Lo que mas importa aca son los dos CONTRATOS con la
 * app —`censuma_consent` y `censuma_utm`—: la app los lee desde otro repo y un
 * cambio de formato no rompe nada de este lado, solo deja de atribuir altas.
 */

describe("censuma_consent", () => {
  it("serializa y parsea el formato 1.a.m", () => {
    expect(serialize_consent({ analytics: true, marketing: false })).toBe("1.1.0");
    expect(serialize_consent({ analytics: false, marketing: true })).toBe("1.0.1");
    expect(parse_consent("1.1.0")).toEqual({ analytics: true, marketing: false });
    expect(parse_consent("1.0.0")).toEqual({ analytics: false, marketing: false });
    for (const consent of [
      { analytics: true, marketing: true },
      { analytics: false, marketing: true },
    ]) {
      expect(parse_consent(serialize_consent(consent))).toEqual(consent);
    }
  });

  it("es fail-closed: lo que no entiende no es consentimiento", () => {
    for (const bad of [null, undefined, "", "1", "1.1", "2.1.1", "1.2.0", "yes", "1.1.1.1"]) {
      expect(parse_consent(bad)).toBeNull();
    }
  });

  it("comparte la cookie con app.censuma.com solo en ese dominio", () => {
    expect(cookie_domain_for("censuma.com")).toBe(".censuma.com");
    expect(cookie_domain_for("www.censuma.com")).toBe(".censuma.com");
    expect(cookie_domain_for("localhost")).toBeNull();
    expect(cookie_domain_for("staging.example.com")).toBeNull();
    // Un sufijo que no es subdominio no cuenta.
    expect(cookie_domain_for("notcensuma.com")).toBeNull();
  });

  it("arma la cookie con los flags del contrato", () => {
    const prod = build_cookie({
      name: "censuma_consent",
      value: "1.1.0",
      max_age: 15552000,
      hostname: "censuma.com",
      secure: true,
    });
    expect(prod).toBe(
      "censuma_consent=1.1.0; Path=/; Max-Age=15552000; SameSite=Lax; Domain=.censuma.com; Secure",
    );
    const local = build_cookie({
      name: "censuma_consent",
      value: "1.0.0",
      max_age: 15552000,
      hostname: "localhost",
      secure: false,
    });
    expect(local).not.toMatch(/Domain/);
    expect(local).not.toMatch(/Secure/);
  });

  it("lee una cookie de un header con varias", () => {
    const header = "a=1; censuma_consent=1.0.1; censuma_utm=%7B%7D";
    expect(read_cookie_from(header, "censuma_consent")).toBe("1.0.1");
    expect(read_cookie_from(header, "censuma_utm")).toBe("%7B%7D");
    expect(read_cookie_from(header, "nada")).toBeNull();
    expect(read_cookie_from("", "censuma_consent")).toBeNull();
  });

  it("traduce la decision a las señales de Consent Mode v2", () => {
    expect(consent_signals({ analytics: true, marketing: false })).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(consent_signals({ analytics: false, marketing: true })).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });
});

describe("script del <head>", () => {
  const run = (cookie) => {
    const data_layer = [];
    const context = { dataLayer: data_layer };
    context.window = context;
    context.document = { cookie };
    new Function("window", "document", "dataLayer", consent_bootstrap_script())(
      context,
      context.document,
      data_layer,
    );
    return data_layer.map((args) => Array.from(args));
  };

  it("deniega todo por defecto antes de cualquier etiqueta", () => {
    const calls = run("");
    expect(calls[0][0]).toBe("consent");
    expect(calls[0][1]).toBe("default");
    expect(calls[0][2]).toMatchObject({
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    expect(calls.some((c) => c[1] === "update")).toBe(false);
  });

  it("aplica la decision guardada en el acto", () => {
    const calls = run("x=1; censuma_consent=1.1.0");
    const update = calls.find((c) => c[0] === "consent" && c[1] === "update");
    expect(update[2]).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("solo acepta ids de GTM con forma de id", () => {
    expect(is_gtm_id("GTM-ABC123")).toBe(true);
    expect(is_gtm_id("GTM-abc")).toBe(false);
    expect(is_gtm_id("GTM-1');alert(1)//")).toBe(false);
    expect(is_gtm_id("")).toBe(false);
    expect(is_gtm_id(undefined)).toBe(false);
    expect(gtm_loader_script("GTM-ABC123")).toContain("'GTM-ABC123'");
  });
});

describe("censuma_utm: ultimo toque no directo", () => {
  const base = {
    pathname: "/es",
    referrer: "",
    hostname: "censuma.com",
    now_ms: 1_700_000_000_123,
  };

  it("una visita directa no es un toque", () => {
    expect(capture_touch({ ...base, search: "" })).toBeNull();
    expect(capture_touch({ ...base, search: "?lang=es" })).toBeNull();
  });

  it("la navegacion interna no es un toque", () => {
    for (const referrer of [
      "https://censuma.com/es/docs",
      "https://app.censuma.com/",
    ]) {
      expect(capture_touch({ ...base, search: "", referrer })).toBeNull();
    }
    expect(is_own_host("localhost", "localhost")).toBe(true);
  });

  it("los UTM, gclid y fbclid arman el toque con las claves cortas", () => {
    const touch = capture_touch({
      ...base,
      search:
        "?utm_source=google&utm_medium=cpc&utm_campaign=lanzamiento&utm_term=clima&utm_content=a&gclid=G1&fbclid=F1",
      referrer: "https://www.google.com/search?q=clima",
    });
    expect(touch).toEqual({
      s: "google",
      m: "cpc",
      c: "lanzamiento",
      t: "clima",
      n: "a",
      gclid: "G1",
      fbclid: "F1",
      l: "/es",
      r: "www.google.com",
      ts: 1_700_000_000,
    });
  });

  it("un referrer externo sin parametros tambien es un toque", () => {
    const touch = capture_touch({
      ...base,
      search: "",
      referrer: "https://www.bing.com/",
    });
    expect(touch).toEqual({ l: "/es", r: "www.bing.com", ts: 1_700_000_000 });
  });

  it("recorta cada string a 200", () => {
    const touch = capture_touch({
      ...base,
      search: `?utm_campaign=${"x".repeat(500)}`,
    });
    expect(touch.c).toHaveLength(200);
  });

  it("codifica y decodifica ida y vuelta, y tolera basura", () => {
    const touch = { s: "meta", c: "clima laboral ñ", l: "/es", ts: 1 };
    const encoded = encode_touch(touch);
    expect(encoded).not.toMatch(/[;, ]/);
    expect(decode_touch(encoded)).toEqual(touch);
    expect(decode_touch("%E0%A4%A")).toBeNull();
    expect(decode_touch(encodeURIComponent("[1,2]"))).toBeNull();
    expect(decode_touch("")).toBeNull();
  });

  it("no pasa del tope de una cookie aunque cada campo llegue al maximo", () => {
    const long = "ñ".repeat(200);
    const touch = { s: long, m: long, c: long, t: long, n: long, gclid: long, fbclid: long, l: long, r: long, ts: 1 };
    const encoded = encode_touch(touch);
    expect(encoded.length).toBeLessThanOrEqual(3500);
    expect(decode_touch(encoded).gclid).toBe(long);
  });
});

describe("clasificacion de enlaces", () => {
  const app = "https://app.censuma.com";

  it("la raiz de la app y el registro son intencion de alta", () => {
    expect(classify_link(`${app}/`, app)).toMatchObject({ is_app: true, is_sign_up: true });
    expect(classify_link(`${app}/registro?lang=es`, app)).toMatchObject({
      is_app: true,
      is_sign_up: true,
      plan: null,
    });
    expect(classify_link(`${app}/registro?lang=en&plan=pro`, app).plan).toBe("pro");
  });

  it("otra ruta de la app es solo un enlace a la app", () => {
    expect(classify_link(`${app}/ayuda`, app)).toMatchObject({ is_app: true, is_sign_up: false });
  });

  it("no confunde un dominio parecido con la app", () => {
    expect(classify_link("https://app.censuma.com.evil.io/", app).is_app).toBe(false);
    expect(classify_link("https://censuma.com/es/docs", app).is_app).toBe(false);
  });

  it("reconoce el correo", () => {
    expect(classify_link("mailto:censumaservice@censuma.com", app).is_mailto).toBe(true);
    expect(classify_link(null, app)).toMatchObject({ is_app: false, is_mailto: false });
  });

  it("reconoce WhatsApp y no lo confunde con un dominio parecido", () => {
    expect(classify_link("https://wa.me/50687917066?text=Hola", app).is_whatsapp).toBe(true);
    expect(classify_link("https://api.whatsapp.com/send?phone=50687917066", app).is_whatsapp).toBe(true);
    expect(classify_link("https://wa.me.evil.io/50687917066", app).is_whatsapp).toBe(false);
    expect(classify_link("mailto:censumaservice@censuma.com", app).is_whatsapp).toBe(false);
  });

  it("recorta el texto del CTA", () => {
    expect(clip_text("  Empezar \n gratis  ")).toBe("Empezar gratis");
    expect(clip_text("x".repeat(300))).toHaveLength(100);
  });
});

describe("section_view", () => {
  const viewport_area = 400 * 800;

  it("una seccion corta cuenta con la mitad de ella a la vista", () => {
    const section_area = 400 * 600;
    expect(is_section_seen({ visible_area: 400 * 300, section_area, viewport_area })).toBe(true);
    expect(is_section_seen({ visible_area: 400 * 200, section_area, viewport_area })).toBe(false);
  });

  it("una seccion muy alta cuenta con media pantalla ocupada", () => {
    const section_area = 400 * 5000;
    expect(is_section_seen({ visible_area: 400 * 400, section_area, viewport_area })).toBe(true);
    expect(is_section_seen({ visible_area: 400 * 100, section_area, viewport_area })).toBe(false);
  });

  it("una diapositiva que asoma de costado no cuenta", () => {
    const section_area = viewport_area;
    expect(is_section_seen({ visible_area: 10 * 800, section_area, viewport_area })).toBe(false);
    expect(is_section_seen({ visible_area: 0, section_area, viewport_area })).toBe(false);
  });
});
