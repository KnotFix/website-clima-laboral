import {
  consent_bootstrap_script,
  gtm_loader_script,
  is_gtm_id,
} from "@/lib/consent";

/**
 * Google Tag Manager, en dos piezas: los scripts del `<head>` y el `<noscript>`
 * del principio del `<body>`.
 *
 * El id sale de `NEXT_PUBLIC_GTM_ID`, que es de BUILD como las otras
 * `NEXT_PUBLIC_*` (en Dokploy va en Build Args). **Sin id no se carga GTM**,
 * pero el script de consentimiento sale igual: el `dataLayer`, el banner y los
 * eventos funcionan en local sin contenedor, y se ven en la consola con
 * `dataLayer`.
 *
 * Un id con otra forma que `GTM-XXXX` se trata como ausente: va adentro de un
 * script y no tiene que poder inyectar nada.
 */
const GTM_ID = is_gtm_id(process.env.NEXT_PUBLIC_GTM_ID)
  ? process.env.NEXT_PUBLIC_GTM_ID
  : null;

/**
 * Van como `<script>` crudos en el `<head>`, en este orden, y el orden es el
 * punto: el consentimiento por defecto tiene que estar fijado ANTES de que
 * `gtm.js` lea el `dataLayer`. Por que no `next/script`, en `lib/consent.js`.
 */
export function TagManagerHead() {
  return (
    <>
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{ __html: consent_bootstrap_script() }}
      />
      {GTM_ID ? (
        <script
          id="gtm-loader"
          dangerouslySetInnerHTML={{ __html: gtm_loader_script(GTM_ID) }}
        />
      ) : null}
      {/* Sin JavaScript no se carga ninguna etiqueta y los botones del banner
          no harian nada: no hay nada que consentir, asi que no se muestra. Va
          en `<noscript>` y no colgado de una marca en `<html>`, porque React
          borra las marcas ajenas del `<html>` al cambiar de idioma. */}
      <noscript>
        <style>{"[data-consent-banner]{display:none}"}</style>
      </noscript>
    </>
  );
}

/** El iframe de GTM para quien navega sin JavaScript. */
export function TagManagerNoscript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
