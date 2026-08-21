/**
 * La misma imagen que Open Graph, para las etiquetas `twitter:*`.
 *
 * **Es un reexport y no una imagen distinta.** `opengraph-image` emite `og:image`
 * y nada mas: sin este archivo, X no recibe `twitter:image` y arma la tarjeta
 * con lo que adivina. Dos imagenes distintas serian dos disenos que mantener
 * para que los vea la misma persona pegando el mismo enlace.
 *
 * Se reexportan tambien `alt`, `size` y `contentType` porque Next los lee de
 * ESTE modulo, no del que esta detras del reexport.
 */
export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from "./opengraph-image";
