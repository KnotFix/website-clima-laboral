/**
 * Un bloque `<script type="application/ld+json">` con datos estructurados.
 *
 * Es un Server Component sin estado: recibe el objeto ya armado (ver
 * `lib/structured_data.js`) y lo serializa. Va en el `<body>` de cada pagina y
 * no en `generateMetadata`, porque la API de metadatos de Next no tiene un
 * campo para JSON-LD — lo unico que acepta es `other`, y ese escribe `<meta>`,
 * no `<script>`.
 *
 * **El `<` se escapa a `<` a proposito.** Dentro de un `<script>` el
 * navegador no decodifica entidades HTML, asi que un `</script>` metido en el
 * texto de una respuesta de la FAQ cerraria la etiqueta y lo que siguiera se
 * ejecutaria. JSON.parse lee `<` como `<` sin diferencia; el HTML, no.
 */
export function JsonLd({ data }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
