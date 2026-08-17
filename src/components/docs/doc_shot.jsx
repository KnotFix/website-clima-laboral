import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

/** Donde viven las capturas de las docs, dentro de `public/`. */
const SHOTS_DIR = "/docs";

/**
 * Una captura del producto dentro de una pagina de doc.
 *
 * **Cuando el archivo no esta, dibuja un hueco con el nombre que falta en vez
 * de romper el build o mostrar una imagen partida.** Es a proposito: deja
 * escribir la pagina entera hoy y pegar las capturas despues, sin que el texto
 * quede esperando. El hueco es feo a proposito — una captura faltante tiene que
 * verse, o se publica sin ella y nadie se entera.
 *
 * Server Component: el chequeo es un `existsSync` en build, no en el navegador.
 *
 * Las capturas salen del MODO DEMO del producto, nunca de una cuenta real: la
 * demo tiene datos sembrados y es de solo lectura, asi que una captura no puede
 * filtrar el nombre de nadie ni un resultado de un cliente.
 */
export function Shot({ src, alt, caption, ratio = "16 / 9" }) {
  const public_path = `${SHOTS_DIR}/${src}`;
  const exists = existsSync(path.join(process.cwd(), "public", SHOTS_DIR, src));

  return (
    <figure className="mt-8">
      <div
        className="relative overflow-hidden rounded-lg border border-box-edge bg-card"
        style={{ aspectRatio: ratio }}
      >
        {exists ? (
          <Image
            src={public_path}
            alt={alt}
            fill
            // La captura nunca pasa del ancho de la columna de texto, que en el
            // layout de tres columnas es ~700px. En movil ocupa el ancho util.
            sizes="(min-width: 1024px) 700px, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-box-edge p-6 text-center">
            <p className="text-sm font-medium">Falta esta captura</p>
            <code className="rounded-sm bg-panel px-2 py-1 font-mono text-xs text-muted-foreground">
              public{SHOTS_DIR}/{src}
            </code>
            <p className="max-w-sm text-xs text-muted-foreground">{alt}</p>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
