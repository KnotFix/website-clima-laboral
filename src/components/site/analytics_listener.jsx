"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { persist_attribution, record_landing } from "@/lib/attribution";
import {
  classify_link,
  clip_text,
  is_section_seen,
  push_event,
} from "@/lib/analytics";
import { read_consent } from "@/lib/consent";
import { is_locale, site_config } from "@/lib/site_config";

/**
 * Los ojos del `dataLayer`. No dibuja nada; se monta una vez, en el layout.
 *
 * Hace cuatro cosas, y ninguna depende de GTM: sin contenedor los eventos se
 * acumulan en `window.dataLayer` y ahi se pueden mirar.
 *
 * 1. **Atribucion.** Al cargar el documento guarda de donde vino la visita
 *    (`lib/attribution.js`) y, si ya hay consentimiento, la pasa a la cookie
 *    que lee la app.
 * 2. **Paginas vistas.** Un `virtual_page_view` por ruta, incluida la primera.
 *    Es la UNICA fuente de `page_view` para GA4; ver `lib/analytics.js`.
 * 3. **Clics.** Un solo listener delegado en el documento, no un `onClick` por
 *    boton: los CTA son Server Components y asi siguen siendolo. Basta con
 *    ponerles `data-track="<id>"`.
 * 4. **Secciones.** `section_view` la primera vez que cada `[data-section]`
 *    entra a la pantalla.
 */

// **Por carga de documento, no por montaje.** En desarrollo React monta los
// efectos dos veces, y una navegacion de ida y vuelta vuelve a montar: con el
// estado en el modulo, la misma pagina no se cuenta dos veces seguidas y una
// seccion no se reporta de nuevo al volver a la home.
let last_page_key = null;
const seen_sections = new Set();

/** Donde esta un CTA: su `data-track-location`, o la seccion que lo contiene. */
function location_of(element) {
  const explicit = element.closest("[data-track-location]");
  if (explicit) return explicit.getAttribute("data-track-location");
  const section = element.closest("[data-section]");
  if (section) return section.getAttribute("data-section");
  const landmark = element.closest("section[id], header, nav, footer, main");
  if (!landmark) return null;
  return landmark.id || landmark.tagName.toLowerCase();
}

function on_click(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const tracked = target.closest("[data-track]");
  const link = target.closest("a[href]");
  // `link.href` y no `getAttribute`: el navegador ya lo resolvio a absoluto.
  const href = link ? link.href : null;
  const kind = classify_link(href, site_config.app_url);
  // Un `mailto:` lleva la direccion de correo adentro, y eso no viaja a
  // ninguna herramienta de medicion.
  const link_url = kind.is_mailto ? "mailto:" : href;
  const cta_id = tracked ? tracked.getAttribute("data-track") : null;

  if (tracked) {
    push_event("cta_click", {
      cta_id,
      cta_text: clip_text(
        tracked.getAttribute("aria-label") || tracked.textContent,
      ),
      cta_location: location_of(tracked),
      link_url,
    });
  }

  if (kind.is_app) {
    push_event("app_link_click", { link_url, cta_id });
    if (kind.is_sign_up) {
      push_event("begin_sign_up", {
        link_url,
        cta_id,
        ...(kind.plan ? { plan: kind.plan } : {}),
      });
    }
  }

  if (kind.is_mailto) {
    push_event("contact_click", { method: "email", cta_id });
  }
}

export function AnalyticsListener() {
  const pathname = usePathname();

  // Atribucion y clics: una vez por documento.
  useEffect(() => {
    record_landing();
    persist_attribution(read_consent());

    // En captura: corre antes que cualquier `stopPropagation` de un componente
    // y antes de que el enlace se lleve la pagina.
    document.addEventListener("click", on_click, { capture: true });
    return () =>
      document.removeEventListener("click", on_click, { capture: true });
  }, []);

  // Pagina vista y secciones: una vez por ruta.
  useEffect(() => {
    const page_key = `${pathname}${window.location.search}`;

    // Un tick despues: el `<title>` de la ruta nueva lo pone React en el mismo
    // commit, pero no garantiza que ya este cuando corre este efecto.
    const timer = window.setTimeout(() => {
      if (page_key === last_page_key) return;
      last_page_key = page_key;
      const first_segment = pathname.split("/")[1];
      push_event("virtual_page_view", {
        page_path: pathname,
        page_title: document.title,
        page_language: is_locale(first_segment)
          ? first_segment
          : document.documentElement.lang || null,
        page_location: window.location.href,
      });
    }, 0);

    const sections = Array.from(document.querySelectorAll("[data-section]"));
    let observer = null;
    if (sections.length && "IntersectionObserver" in window) {
      // Umbrales cada 5%: el observador solo avisa al cruzar uno, y una
      // seccion muy alta nunca pasa del 20% de si misma en pantalla.
      const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-section");
          if (!id || seen_sections.has(id)) continue;
          const visible = entry.intersectionRect;
          const box = entry.boundingClientRect;
          const root = entry.rootBounds;
          const seen = is_section_seen({
            visible_area: visible.width * visible.height,
            section_area: box.width * box.height,
            viewport_area: root
              ? root.width * root.height
              : window.innerWidth * window.innerHeight,
          });
          if (!seen) continue;
          seen_sections.add(id);
          observer.unobserve(entry.target);
          push_event("section_view", { section_id: id });
        }
      }, { threshold: thresholds });
      for (const section of sections) {
        if (!seen_sections.has(section.getAttribute("data-section"))) {
          observer.observe(section);
        }
      }
    }

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
