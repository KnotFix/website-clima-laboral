import { is_locale, site_config } from "@/lib/site_config";

/**
 * La pagina de precios: el catalogo de planes, leido del PRODUCTO.
 *
 * **Los numeros no estan escritos en el sitio, y es lo que hace posible que la
 * pagina exista.** El 2026-09-13 se probo una seccion con las fichas escritas a
 * mano y se descarto con un argumento que sigue en pie: dos copias de una lista
 * de precios son una desactualizada. Los topes y precios son COLUMNAS de la
 * tabla `planes` (se cambian con un UPDATE, sin deploy), asi que una copia en
 * `es.js` mentiria el dia que alguien ajuste un plan, y en una pagina indexada
 * esa mentira queda guardada en el buscador.
 *
 * Lo que cambio el 2026-10-12 es DONDE se ve: el usuario quiere la pagina
 * indexada, y la pantalla de registro de la app no lo esta (es una SPA detras
 * de otro dominio). La salida es leer el MISMO endpoint que esa pantalla,
 * `GET /api/planes-publicos/` (publico, sin sesion, sin un solo dato de un
 * cliente), desde el servidor del sitio. Queda una sola fuente y dos lectores.
 *
 * Las tarjetas se arman con las mismas reglas que `lib/registro.ts` de la app:
 * la de PRUEBA adelante (no es una fila de `planes`), las viñetas DERIVADAS de
 * los topes (nunca una lista de funciones: todas van incluidas en todos los
 * planes), el precio por persona debajo del de lista, y el plan a medida con
 * su correo. Si alguien cambia esas reglas alla, se cambian aca.
 */

/**
 * La API del producto. Se lee en el SERVIDOR del sitio, al compilar y en cada
 * regeneracion, asi que NO es `NEXT_PUBLIC_*`: el navegador nunca la pide.
 *
 * `||` y no `??` por lo mismo que `app_url`: un build arg sin pasar deja la
 * variable en cadena vacia, no ausente.
 */
export const API_URL = (process.env.CENSUMA_API_URL || "https://api.censuma.com/api").replace(
  /\/$/,
  "",
);

/** Dias de prueba. Espeja `facturacion.models.DIAS_TRIAL`; es solo texto. */
export const TRIAL_DAYS = 30;

/**
 * El plan que lleva el badge «Más popular». Es una decision comercial y no una
 * propiedad del plan: la app la recibe por parametro por el mismo motivo.
 */
export const FEATURED_PLAN = "profesional";

/** Cuanto espera el servidor a la API antes de rendirse. */
const FETCH_TIMEOUT_MS = 8000;

/** Cada cuanto se regenera la pagina: una hora. Ver `app/[lang]/pricing`. */
export const PRICING_REVALIDATE_S = 3600;

/**
 * El catalogo, o `null` si la API no contesto bien.
 *
 * **Fuera del build, un fallo LANZA**, y es a proposito: en una regeneracion,
 * Next descarta el render que lanza y sigue sirviendo la ultima pagina buena.
 * Devolver `null` ahi reemplazaria una tabla de precios correcta por el aviso
 * de «no pudimos cargar los planes» durante una hora, por un parpadeo de la
 * API.
 *
 * **Durante el build devuelve `null`**: no hay pagina anterior que conservar,
 * y lanzar tumbaria el despliegue entero del sitio por una API caida. La pagina
 * sale con el aviso y la proxima regeneracion la completa.
 */
export async function fetch_plans() {
  const building = process.env.NEXT_PHASE === "phase-production-build";
  try {
    const response = await fetch(`${API_URL}/planes-publicos/`, {
      next: { revalidate: PRICING_REVALIDATE_S },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`planes-publicos respondio ${response.status}`);
    }
    const plans = await response.json();
    if (!Array.isArray(plans)) {
      throw new Error("planes-publicos no devolvio una lista");
    }
    return plans;
  } catch (error) {
    if (building) {
      console.warn(`[pricing] sin catalogo al compilar: ${error.message}`);
      return null;
    }
    throw error;
  }
}

/** Rellena `{clave}` en una plantilla del diccionario. */
export function fill(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Un importe en centavos, en la moneda del plan.
 *
 * `es-419` y no `es`: el `es` a secas de Intl escribe «2500 US$», que en
 * Latinoamerica no lo escribe nadie. `narrowSymbol` deja el `$` solo, y la
 * pagina aclara la moneda una vez al pie en vez de repetir «USD» en cada
 * tarjeta.
 */
export function format_price(cents, currency, lang) {
  return new Intl.NumberFormat(lang === "es" ? "es-419" : "en-US", {
    style: "currency",
    currency: currency || "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function format_number(value, lang) {
  return new Intl.NumberFormat(lang === "es" ? "es-419" : "en-US").format(value);
}

/**
 * Los ejes que se listan en cada tarjeta, en orden, con su campo del catalogo.
 * Son los mismos seis que la app.
 */
const LIMIT_FIELDS = [
  ["studies", "max_estudios_por_periodo"],
  ["people", "max_empleados_activos"],
  ["forms", "max_boletas"],
  ["kiosks", "max_estaciones_kiosco"],
  ["emails", "max_correos_por_periodo"],
  ["whatsapp", "max_whatsapp_por_periodo"],
];

/**
 * La viñeta de un tope. `null` es ilimitado en toda la tabla `planes`.
 *
 * **Un campo AUSENTE no es lo mismo que `null`**: es un eje que esa version de
 * la API todavia no publica (WhatsApp llego a `dev` antes que a produccion).
 * Ese se omite; ponerlo como «sin límite» le prometeria al cliente algo que el
 * plan no dice.
 */
function limit_line(plan, axis, field, dict, lang) {
  if (!(field in plan)) return null;
  const copy = dict.pricing_limits[axis];
  const value = plan[field];
  if (value === null) return copy.unlimited;
  return fill(value === 1 ? copy.one : copy.other, {
    number: format_number(value, lang),
  });
}

function features_of(plan, dict, lang) {
  const features = LIMIT_FIELDS.map(([axis, field]) =>
    limit_line(plan, axis, field, dict, lang),
  ).filter(Boolean);

  // El excedente aparece solo si el plan lo admite, y es el que evita que el
  // tope de personas se lea como una pared.
  if (plan.precio_empleado_extra_centavos !== null && plan.precio_empleado_extra_centavos !== undefined) {
    const price = format_price(plan.precio_empleado_extra_centavos, plan.moneda, lang);
    features.push(
      plan.max_empleados_extra === null || plan.max_empleados_extra === undefined
        ? fill(dict.pricing_extra, { price })
        : fill(dict.pricing_extra_up_to, {
            price,
            number: format_number(plan.max_empleados_extra, lang),
          }),
    );
  }

  return features;
}

/**
 * Lo que sale cada persona al año. `null` sin precio (a medida) o sin tope de
 * personas: inventar un «por persona» ahi seria dividir por infinito.
 */
function per_person_of(plan, lang) {
  if (plan.precio_anual_centavos === null || plan.precio_anual_centavos === undefined) return null;
  if (!plan.max_empleados_activos) return null;
  return format_price(
    Math.round(plan.precio_anual_centavos / plan.max_empleados_activos),
    plan.moneda,
    lang,
  );
}

/** `mailto:` comercial, con el plan en el asunto (igual que la app). */
export function sales_mailto(plan_name, dict) {
  const subject = encodeURIComponent(fill(dict.pricing_custom.mail_subject, { plan: plan_name }));
  return `mailto:${site_config.contact.email}?subject=${subject}`;
}

/**
 * El registro del producto con el plan elegido. El `?plan=` no lo lee la app
 * (el plan se vuelve a elegir alla); lo lee la medicion del sitio, que lo
 * manda en `begin_sign_up` (`classify_link`).
 */
export function signup_url_for(lang, plan_code) {
  const base = site_config.register_url(is_locale(lang) ? lang : undefined);
  return plan_code ? `${base}&plan=${encodeURIComponent(plan_code)}` : base;
}

/**
 * Catalogo -> tarjetas, con la de PRUEBA adelante.
 *
 * Cada tarjeta es un objeto plano, listo para dibujar:
 * `{ id, title, description, price, period, per_person, features[],
 *    button, href, featured, badge }`.
 */
export function pricing_cards(plans, dict, lang) {
  const trial = {
    id: "trial",
    title: dict.pricing_trial.title,
    description: dict.pricing_trial.description,
    price: dict.pricing_trial.price,
    period: fill(dict.pricing_trial.period, { days: TRIAL_DAYS }),
    per_person: null,
    features: dict.pricing_trial.features,
    button: dict.pricing_trial.button,
    href: signup_url_for(lang, null),
    featured: false,
    badge: null,
  };

  // El «más de N personas» de la tarjeta a medida es el techo del plan mas
  // grande que se vende: la app lo tiene escrito (2.000) y aca sale del dato,
  // asi no queda mintiendo el dia que Corporativo cambie de tope.
  const largest = Math.max(
    0,
    ...plans.filter((plan) => plan.contratable).map((plan) => plan.max_empleados_activos ?? 0),
  );

  const from_catalog = [...plans]
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map((plan) =>
      plan.contratable ? sellable_card(plan, dict, lang) : custom_card(plan, dict, lang, largest),
    );

  return [trial, ...from_catalog];
}

function sellable_card(plan, dict, lang) {
  const per_person = per_person_of(plan, lang);
  const featured = plan.codigo === FEATURED_PLAN;
  return {
    id: plan.codigo,
    title: plan.name,
    description: dict.pricing_paid.description,
    price: format_price(plan.precio_anual_centavos ?? 0, plan.moneda, lang),
    period: dict.pricing_paid.period,
    per_person: per_person ? fill(dict.pricing_paid.per_person, { price: per_person }) : null,
    features: features_of(plan, dict, lang),
    button: dict.pricing_paid.button,
    href: signup_url_for(lang, plan.codigo),
    featured,
    badge: featured ? dict.pricing_paid.featured : null,
  };
}

/**
 * El plan a medida: se pide por correo, no se compra. Sale del catalogo (es una
 * fila sin precio) para que su nombre y su lugar los siga decidiendo la tabla.
 */
function custom_card(plan, dict, lang, largest) {
  return {
    id: plan.codigo,
    title: plan.name,
    description: largest
      ? fill(dict.pricing_custom.description, { number: format_number(largest, lang) })
      : dict.pricing_custom.description_plain,
    price: dict.pricing_custom.price,
    // Sin periodo: «a medida / por año» prometeria un precio anual que todavia
    // no existe.
    period: null,
    per_person: null,
    features: dict.pricing_custom.features,
    button: dict.pricing_custom.button,
    href: sales_mailto(plan.name, dict),
    featured: false,
    badge: null,
  };
}
