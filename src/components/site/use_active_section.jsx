"use client";

import { useEffect, useState } from "react";

/**
 * Franja de lectura, en la que se decide que seccion esta activa.
 *
 * `NAV_CLEARANCE` descuenta la isla flotante (~96px con su separacion del
 * tope): sin eso una seccion contaria como visible mientras esta tapada por el
 * navbar. `BOTTOM_CUT` recorta la parte de abajo para que la seccion que recien
 * asoma no le gane a la que el usuario esta leyendo.
 *
 * Los dos valores alimentan tanto el `rootMargin` como el calculo de geometria,
 * asi que no pueden quedar desincronizados.
 */
const NAV_CLEARANCE = 96;
const BOTTOM_CUT = 0.45;

/**
 * Devuelve el id de la seccion que el usuario esta mirando, o null si no hay
 * ninguna (por ejemplo, arriba del todo en el hero).
 *
 * IntersectionObserver se usa solo como disparador — nunca un listener de
 * scroll, que correria en cada frame. La decision NO sale de los ratios que
 * trae el callback: el observer solo reporta las secciones que cruzaron un
 * umbral, asi que una seccion que se fue de pantalla sin disparar conserva su
 * ratio viejo y le gana a la que de verdad estas mirando. En vez de acumular
 * ratios se vuelven a medir las secciones en cada aviso: son un punado de
 * `getBoundingClientRect`, y siempre da el resultado correcto.
 */
export function useActiveSection(ids) {
  const [active_id, set_active_id] = useState(null);

  // `ids` llega como array nuevo en cada render del padre; comparar por
  // contenido evita resuscribir el observer en cada render.
  const ids_key = ids.join(",");

  useEffect(() => {
    const section_ids = ids_key ? ids_key.split(",") : [];
    const nodes = section_ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (nodes.length === 0) return;

    const pick_active = () => {
      const band_top = NAV_CLEARANCE;
      const band_bottom = window.innerHeight * (1 - BOTTOM_CUT);

      // Gana la seccion que mas ocupa la franja. Recorrer `nodes` en orden de
      // documento deja el desempate estable.
      let best_id = null;
      let best_ratio = 0;

      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.height === 0) continue;

        const visible =
          Math.min(rect.bottom, band_bottom) - Math.max(rect.top, band_top);
        const ratio = Math.max(0, visible) / rect.height;

        if (ratio > best_ratio) {
          best_ratio = ratio;
          best_id = node.id;
        }
      }

      set_active_id(best_ratio > 0 ? best_id : null);
    };

    const observer = new IntersectionObserver(pick_active, {
      rootMargin: `-${NAV_CLEARANCE}px 0px -${BOTTOM_CUT * 100}% 0px`,
      // Umbrales finos y bajos: las secciones son mas altas que la franja, asi
      // que su ratio maximo ronda 0.4 y nunca cruzarian umbrales tipo 0.6 o 1.
      // Con estos, la seccion activa se actualiza a tiempo.
      threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.55, 0.75, 1],
    });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids_key]);

  return active_id;
}
