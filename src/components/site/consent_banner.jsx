"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { persist_attribution } from "@/lib/attribution";
import { push_event, update_consent_mode } from "@/lib/analytics";
import {
  CONSENT_COOKIE,
  OPEN_CONSENT_EVENT,
  parse_consent,
  read_consent,
  read_cookie_from,
  write_consent,
} from "@/lib/consent";

/**
 * La cookie como store externo. `useSyncExternalStore` y no un `useEffect` que
 * la lea y haga `setState`: el snapshot del servidor es `null` («todavia no se
 * sabe») y React lo reemplaza por el del navegador justo despues de hidratar,
 * sin desajuste y sin render en cascada.
 */
const CONSENT_CHANGE_EVENT = "censuma:consent-change";

function subscribe_consent(on_change) {
  window.addEventListener(CONSENT_CHANGE_EVENT, on_change);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, on_change);
}

function consent_snapshot() {
  // String y no el objeto: el snapshot se compara por identidad, y un objeto
  // nuevo en cada lectura haria que React re-renderice sin fin.
  return read_cookie_from(document.cookie, CONSENT_COOKIE) ?? "";
}

function server_snapshot() {
  return null;
}

/**
 * El banner de consentimiento: una tarjeta abajo, no un modal.
 *
 * **No bloquea la pagina.** Se puede leer el sitio entero sin decidir; mientras
 * tanto todo sigue denegado (el default del `<head>`, ver `lib/consent.js`).
 * Por eso es una `region` con nombre y no un `dialog`: no atrapa el foco ni
 * le pide a nadie que la cierre para seguir.
 *
 * > **«Aceptar todo» y «Rechazar» son el mismo boton.** Misma variante, mismo
 * > tamaño, uno al lado del otro. Un rechazo mas chico, gris o escondido detras
 * > de «Configurar» es un patron oscuro, y un consentimiento sacado asi no es
 * > libre ni para la Ley 8968 ni para el RGPD.
 *
 * **Viene dibujado en el HTML**, y lo esconde el CSS si ya hay decision: el
 * script del `<head>` lee la cookie y marca `<html data-consent>` antes del
 * primer pintado (`lib/consent.js`), y `globals.css` oculta el banner con esa
 * marca. Despues de hidratar, el componente lee la cookie de verdad y lo saca
 * del arbol si ya se eligio.
 *
 * > Hasta el 2026-10-21 se montaba DESPUES de hidratar, para no dibujar algo
 * > que habia que esconder. El costo no se veia: en la primera visita, en las
 * > paginas con poco texto, su parrafo era lo mas grande de la pantalla y el
 * > navegador lo tomaba como el LCP, a los 2,6 s de un celular lento contra los
 * > 0,8 s del resto de la pagina. Ahora pinta con la pagina.
 *
 * Como es `fixed`, aparecer no corre nada de la pagina: no suma CLS.
 * `data-nosnippet` lo deja fuera de los fragmentos de Google, que si no podrian
 * citar el aviso de cookies como resumen de una pagina.
 *
 * Se reabre desde «Preferencias de cookies» del pie (`CookiePrefsButton`), que
 * dispara `OPEN_CONSENT_EVENT`. Reabierto arranca con el panel de los switches
 * desplegado y en el estado actual, se cierra con Escape y devuelve el foco al
 * enlace que lo abrio.
 */
export function ConsentBanner({ lang, dict }) {
  const raw = useSyncExternalStore(
    subscribe_consent,
    consent_snapshot,
    server_snapshot,
  );
  const stored = parse_consent(raw);
  const has_decision = Boolean(stored);

  // `reopened` lo prende «Preferencias de cookies»; sin decision guardada el
  // banner se ve solo. `draft` son los switches mientras no se guardan.
  const [reopened, set_reopened] = useState(false);
  const [show_settings, set_show_settings] = useState(false);
  const [draft, set_draft] = useState({ analytics: false, marketing: false });

  const region_ref = useRef(null);
  const opener_ref = useRef(null);
  const title_id = useId();
  const body_id = useId();
  const analytics_id = useId();
  const marketing_id = useId();

  useEffect(() => {
    function reopen() {
      const current = read_consent();
      set_draft({
        analytics: current?.analytics ?? false,
        marketing: current?.marketing ?? false,
      });
      opener_ref.current = document.activeElement;
      set_show_settings(true);
      set_reopened(true);
      // El foco va a la tarjeta despues de pintarla: quien la abrio con el
      // teclado tiene que aterrizar adentro, no quedarse en el pie.
      requestAnimationFrame(() => region_ref.current?.focus());
    }

    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const close = useCallback(() => {
    set_reopened(false);
    set_show_settings(false);
    const opener = opener_ref.current;
    opener_ref.current = null;
    if (opener && typeof opener.focus === "function") opener.focus();
  }, []);

  const decide = useCallback(
    (consent) => {
      write_consent(consent);
      update_consent_mode(consent);
      push_event("consent_update", {
        consent_analytics: consent.analytics,
        consent_marketing: consent.marketing,
      });
      persist_attribution(consent);
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
      close();
    },
    [close],
  );

  // Escape cierra SOLO si ya hay una decision: la primera vez no hay nada a
  // que volver, y cerrar sin elegir dejaria el banner volviendo en cada pagina.
  function on_key_down(event) {
    if (event.key === "Escape" && has_decision) {
      event.stopPropagation();
      close();
    }
  }

  // `raw === null` es el render del servidor y la hidratacion: se dibuja, y si
  // ya habia decision lo tapa el CSS (`html[data-consent]`) hasta que el
  // snapshot del navegador lo saca.
  const is_open = reopened || raw === null || !has_decision;
  const { analytics, marketing } = draft;
  const set_analytics = (value) => set_draft((d) => ({ ...d, analytics: value }));
  const set_marketing = (value) => set_draft((d) => ({ ...d, marketing: value }));

  if (!is_open) return null;

  return (
    <section
      ref={region_ref}
      role="region"
      aria-labelledby={title_id}
      aria-describedby={body_id}
      tabIndex={-1}
      onKeyDown={on_key_down}
      // «initial» es el que esconde `html[data-consent]`; reabierto desde el
      // pie no lleva la marca y se ve aunque ya haya decision.
      data-consent-banner={reopened ? "reopened" : "initial"}
      data-nosnippet=""
      className={
        // Abajo de `sm` ocupa el ancho con el margen del sitio; de `sm` para
        // arriba es una tarjeta en la esquina, lejos de los CTA del centro.
        // `max-h` + scroll: con el panel abierto en un telefono apaisado, la
        // tarjeta no puede pasarse de la pantalla.
        // El desenfoque va solo de `sm` para arriba. En telefono la tarjeta
        // ocupa el ancho y se queda fija mientras la pagina scrollea debajo,
        // asi que un `backdrop-filter` ahi se recalcula en cada cuadro, y con el
        // fondo al 95 % casi no se ve.
        "fixed inset-x-3 bottom-3 z-50 max-h-[calc(100svh-1.5rem)] overflow-y-auto rounded-2xl border border-border bg-background/95 p-4 text-foreground shadow-2xl sm:backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[26rem] sm:p-5" +
        // La entrada animada, solo al reabrirlo desde el pie. El de la primera
        // visita aparece CON la pagina, y arrancar transparente hacia que el
        // navegador lo contara como pintado tarde (es el LCP de las paginas con
        // poco texto).
        (reopened
          ? " animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none"
          : "")
      }
    >
      <h2 id={title_id} className="text-sm font-semibold tracking-tight">
        {dict.consent_title}
      </h2>
      <p id={body_id} className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {dict.consent_body}{" "}
        <Link
          href={`/${lang}/legal/privacy`}
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          {dict.consent_privacy_link}
        </Link>
      </p>

      {show_settings ? (
        <ul className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
          <li className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{dict.consent_necessary_label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {dict.consent_necessary_body}
              </p>
            </div>
            <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">
              {dict.consent_necessary_state}
            </span>
          </li>
          <li className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor={analytics_id} className="text-sm font-medium">
                {dict.consent_analytics_label}
              </label>
              <p
                id={`${analytics_id}-body`}
                className="mt-0.5 text-xs leading-relaxed text-muted-foreground"
              >
                {dict.consent_analytics_body}
              </p>
            </div>
            <Switch
              id={analytics_id}
              checked={analytics}
              onCheckedChange={set_analytics}
              aria-describedby={`${analytics_id}-body`}
              className="mt-0.5"
            />
          </li>
          <li className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor={marketing_id} className="text-sm font-medium">
                {dict.consent_marketing_label}
              </label>
              <p
                id={`${marketing_id}-body`}
                className="mt-0.5 text-xs leading-relaxed text-muted-foreground"
              >
                {dict.consent_marketing_body}
              </p>
            </div>
            <Switch
              id={marketing_id}
              checked={marketing}
              onCheckedChange={set_marketing}
              aria-describedby={`${marketing_id}-body`}
              className="mt-0.5"
            />
          </li>
        </ul>
      ) : null}

      {/* Tres botones en una fila de tercios en cualquier ancho: el orden y el
          tamaño no cambian con la pantalla, y ninguno queda debajo del pliegue
          de la tarjeta. Rechazar va primero y Aceptar despues, con la misma
          variante: el orden de lectura no empuja hacia ninguno. */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-2"
          onClick={() => decide({ analytics: false, marketing: false })}
        >
          {dict.consent_reject}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-2"
          onClick={() => decide({ analytics: true, marketing: true })}
        >
          {dict.consent_accept_all}
        </Button>
        {show_settings ? (
          <Button
            type="button"
            variant="outline"
            className="h-9 px-2"
            onClick={() => decide({ analytics, marketing })}
          >
            {dict.consent_save}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-9 px-2"
            onClick={() => set_show_settings(true)}
          >
            {dict.consent_configure}
          </Button>
        )}
      </div>
    </section>
  );
}
