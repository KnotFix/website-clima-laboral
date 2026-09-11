import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // **Aca vivia `images.remotePatterns`** con `i.ytimg.com`, la miniatura del
  // video del hero. El video se retiro y el sitio no tiene host externo de
  // imagenes: next/image responde 400 a cualquier URL remota, y es lo que se
  // quiere.
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
