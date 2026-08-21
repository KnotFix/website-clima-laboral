"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { ScrollZoom } from "@/components/motion/scroll_zoom";
import { site_config } from "@/lib/site_config";

/**
 * El video de presentacion del hero. Entra creciendo con el scroll.
 *
 * El iframe de YouTube NO se monta hasta que alguien da play: el embed son
 * cientos de kB y varias conexiones de terceros, y puesto en el hero eso lo
 * paga el primer render de todas las visitas, incluidas las que nunca miran el
 * video. Hasta el click hay una sola imagen: la miniatura.
 *
 * El otro motivo es el zoom, que es justo cuando el elemento se esta escalando
 * en cada frame: escalar una imagen es trabajo de compositor, escalar un iframe
 * obliga a re-rasterizar un documento entero. Despues del click el iframe si
 * queda dentro del zoom, pero para entonces el recorrido ya esta casi terminado
 * y quien le dio play esta mirando el video, no scrolleando.
 */
export function HeroVideo({ dict }) {
  const [is_playing, set_is_playing] = useState(false);
  // maxresdefault es 1280x720, pero YouTube solo lo genera para los videos
  // subidos en HD. Si devuelve 404 se cae a hqdefault, que existe siempre: es
  // 4:3 con bandas negras, y `object-cover` las recorta contra el marco 16:9.
  const [poster_quality, set_poster_quality] = useState("maxresdefault");

  const video_id = site_config.hero_video_id;

  return (
    // `zoom_origin="top"` y no el centro: achicando desde el centro, el borde
    // de arriba del video se despegaba de los CTA casi 80px que no los pedia
    // ningun margen, y encima el hueco cambiaba con el scroll. Anclado arriba,
    // el aire con los botones es exactamente el margen y el video crece hacia
    // abajo, que es justo donde tiene que insinuar que sigue.
    <ScrollZoom
      zoom_from={0.7}
      zoom_to={1}
      zoom_origin="top"
      tilt_from={18}
      scroll_speed={0.08}
    >
      {/* El marco reserva su tamano final desde el primer render: `aspect-video`
          fija la altura por proporcion, asi el contenido de abajo no salta
          cuando carga la miniatura ni cuando el zoom termina de crecer. */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted to-background shadow-2xl">
        {video_id && is_playing && (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video_id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={dict.hero_video_title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}

        {video_id && !is_playing && (
          <button
            type="button"
            onClick={() => set_is_playing(true)}
            aria-label={dict.hero_video_play}
            className="group/play absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Image
              src={`https://i.ytimg.com/vi/${video_id}/${poster_quality}.jpg`}
              alt=""
              fill
              // El video nunca pasa del ancho del Container.
              sizes="(max-width: 1200px) 100vw, 1200px"
              // **Es la imagen mas grande arriba del pliegue, o sea la
              // candidata a LCP.** Sin `priority` next/image le pone
              // `loading="lazy"` y no emite el `<link rel="preload">`: el
              // navegador recien la descubre cuando termina de armar el layout,
              // y ademas sale de otro dominio (`i.ytimg.com`), asi que antes de
              // pedirla hay que resolver DNS y abrir TLS. `priority` adelanta
              // toda esa cadena al head del documento.
              priority
              className="object-cover"
              onError={() => set_poster_quality("hqdefault")}
            />

            {/* Velo parejo y suave: la miniatura la elige el video, no nosotros,
                asi que el boton tiene que leerse sobre una clara igual que sobre
                una oscura. */}
            <span className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover/play:bg-black/10" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 group-hover/play:scale-105 group-active/play:scale-100 sm:size-20">
                {/* Desplazado a la derecha: el triangulo tiene el centro de masa
                    a la izquierda y centrado de verdad se ve corrido. */}
                <Play className="ml-0.5 size-6 fill-current sm:size-7" />
              </span>
            </span>
          </button>
        )}
      </div>
    </ScrollZoom>
  );
}
