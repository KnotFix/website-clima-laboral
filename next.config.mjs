import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `standalone`: el build deja en `.next/standalone` un `server.js` con el
  // recorte de `node_modules` que el servidor usa de verdad. Es lo que copia el
  // `Dockerfile` en su imagen final, que asi no lleva `npm` ni el arbol entero
  // de dependencias. Sin esto, la imagen pesaria lo que pesa `node_modules`.
  output: "standalone",
  reactCompiler: true,
  // **Aca vivia `images.remotePatterns`** con `i.ytimg.com`, la miniatura del
  // video del hero. El video se retiro y el sitio no tiene host externo de
  // imagenes: next/image responde 400 a cualquier URL remota, y es lo que se
  // quiere.

  // **Los clips se cachean una semana.** Por defecto `public/` sale con
  // `max-age=0` y cada visita repetida revalida los videos. No es `immutable`
  // porque los nombres no llevan hash: una regrabacion se publica con el mismo
  // nombre, y una semana (mas un dia sirviendo la vieja mientras revalida) es
  // lo mas que alguien puede quedar viendo la anterior.
  // **`www` servia el sitio ENTERO con 200.** Las dos versiones responden
  // porque el hosting rutea los dos nombres al mismo contenedor, y aunque cada
  // pagina se auto-canonicaliza al dominio sin `www` (todas las URLs salen de
  // `site_config.domain`), para un buscador siguen siendo dos hosts que hay que
  // rastrear: gasta el doble de rastreo en el mismo contenido y llena Search
  // Console de «pagina alternativa con canonica adecuada». El 308 lo resuelve
  // antes de que se sirva nada.
  //
  // El host va escrito y no deducido a proposito: asi el redirect existe SOLO
  // para el dominio de produccion y no toca staging, que corre en otro nombre.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.censuma.com" }],
        destination: "https://censuma.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/clips/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

// `pageExtensions` NO se toca a proposito. Agregarle "mdx" convierte en RUTA a
// cualquier .mdx que caiga dentro de `app/`, y las docs no se rutean asi: viven
// en `src/content/docs/` y las carga la ruta catch-all con un import dinamico.
// El loader de .mdx lo instala `createMDX` de todos modos, que es lo unico que
// hace falta para importarlos.
const withMDX = createMDX({
  options: {
    // Los plugins van como STRINGS y no como imports: Turbopack no puede
    // serializar una referencia a funcion para pasarsela a Rust. Con la
    // sintaxis vieja (`[remarkGfm]`) compila en dev y falla al construir.
    remarkPlugins: ["remark-gfm"],
    // rehype-slug le pone id a cada encabezado. Es lo que hace que las anclas
    // funcionen y lo que el indice de la pagina (`DocsToc`) apunta: los ids se
    // recalculan con el MISMO algoritmo en `lib/docs.js` — ver ahi.
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
