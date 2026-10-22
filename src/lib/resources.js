import "server-only";

import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import survey_template from "@/content/resources/survey_template.json";

/**
 * Lo que la pagina de un recurso necesita leer del disco: el peso del archivo
 * que se descarga y el tamaño de la captura. Va en el servidor (se resuelve al
 * compilar) para que el numero que se muestra sea el del archivo publicado y no
 * uno escrito a mano que se desactualiza el dia que se regenera el Excel.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** El contenido de la plantilla de encuesta en un idioma. */
export function survey_template_content(lang) {
  return survey_template[lang];
}

/** "45 KB": el peso de un archivo de `public/`, redondeado. */
export function public_file_size(public_path, lang) {
  const bytes = statSync(path.join(PUBLIC_DIR, public_path)).size;
  const kb = Math.max(1, Math.round(bytes / 1024));
  return `${new Intl.NumberFormat(lang).format(kb)} KB`;
}

/**
 * El ancho y el alto de un PNG de `public/`, leidos de su cabecera.
 *
 * `next/image` los necesita para reservar el lugar antes de que la imagen
 * cargue (sin eso la pagina salta). Un PNG los trae en los bytes 16 a 24.
 */
export function public_png_size(public_path) {
  const header = readFileSync(path.join(PUBLIC_DIR, public_path)).subarray(0, 24);
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}
