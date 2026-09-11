"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * Una captura EN MOVIMIENTO del sistema, con el mismo marco que las maquetas
 * dibujadas de `system_shots.jsx`.
 *
 * **El marco es el mismo a proposito.** Las tres filas de la seccion van igual
 * —texto a la izquierda, sistema a la derecha— y lo unico que cambia de fila en
 * fila es lo que se muestra. Si la primera perdiera el borde, el punteado y la
 * sombra de `.org-canvas`, se leeria como una pieza de otra pagina.
 *
 * **Va SIN controles, y no es un descuido.** La barra nativa trae una linea de
 * tiempo, un volumen y un menu de opciones; el clip no tiene audio, dura veinte
 * segundos y vuelve a empezar solo, asi que las tres cosas sobran y ademas
 * delatan que esto es un video en vez de dejarlo pasar como lo que muestra: el
 * producto funcionando. `disablePictureInPicture` saca del menu contextual la
 * ultima que quedaba.
 *
 * > **Consecuencia conocida:** con `prefers-reduced-motion` el clip igual se
 * > reproduce. Sin controles no hay otra forma de verlo, y un poster congelado
 * > deja la fila sin la mitad que explica el punto. Es la unica pieza del sitio
 * > que no se apaga con esa preferencia — lo compensa que es silenciosa, que no
 * > se mueve hasta que alguien la trae a pantalla y que nada del layout depende
 * > de ella.
 *
 * **No pide NADA hasta que la fila se acerca.** Ni el poster ni el video: el
 * `<video>` se pinta sin `src` ni `poster` —una caja `bg-muted` con el alto ya
 * reservado— y los recibe cuando la fila esta a `NEAR_MARGIN` de entrar. Con los
 * dos atributos puestos desde el primer render, Chromium bajaba al cargar la
 * pagina los posters enteros y ~120 kB de cada video por `preload="metadata"`:
 * cerca de 1 MB para una seccion que vive muy abajo, compitiendo con el hero.
 *
 * **Un solo `<video>`, del tema que toca.** Las capturas fijas (`ThemedShot`)
 * ponen los dos temas en el DOM y dejan que `dark:` elija, porque se ven en el
 * primer frame y un hook llegaria tarde. Aca no hace falta: para cuando la fila
 * esta cerca el cliente ya monto y `resolvedTheme` ya se sabe, asi que no hay
 * primer frame con el tema equivocado — y el otro tema no se baja nunca.
 * `key={theme}` monta un elemento nuevo al cambiar de tema en vez de cambiarle
 * el `src` a uno que esta reproduciendo.
 *
 * **Arranca al entrar en pantalla y se pausa al salir.** Un video en loop fuera
 * de pantalla sigue decodificando frames: es bateria gastada en algo que nadie
 * mira.
 */
/**
 * El tamano con el que salen los clips del reencodeo, en los dos temas. Se
 * recortan al contenido de la ventana y se llevan a 1072 de ancho, que es el
 * doble del hueco de 536px que les toca en la fila.
 *
 * **El recorte es FIJO por tanda de grabaciones y no se recalcula por clip**:
 * detectandolo en cada una salia distinto por un par de pixeles, y ahi las
 * filas quedan con proporciones distintas y las maquetas no alinean.
 *
 * - **Claras**: 1920x1080 con bandas negras al costado —la ventana no llena la
 *   pantalla—. `1400x1080` desde `x=260`, con 8px de sobra por lado.
 * - **Oscuras**: la pantalla entera de un monitor 2560x1080, grabada en un
 *   lienzo de 2560x1440 —bandas arriba y abajo— con el navegador en la mitad
 *   izquierda. `1260x971` desde `(5, 245)`: justo adentro del area de la
 *   pagina, dejando afuera la barra de scroll. Es la misma proporcion, asi que
 *   salen al mismo tamano.
 *
 * El encode es x264 `-crf 28 -preset veryslow -tune animation -g 300`, con
 * `setsar=1` y `+faststart`: la UI es plana y casi quieta, y eso la deja en
 * 150–350 kB por clip. AV1 bajaba otro ~13% y pedia un `<source>` de respaldo;
 * no se uso. Los posters van en WebP: el atributo `poster` no tiene respaldo, y
 * WebP lo lee cualquier navegador en el que este sitio corre.
 *
 * De aca sale la proporcion con la que el navegador reserva el alto antes de
 * que el video cargue: tienen que ser los del archivo, o queda una banda fina
 * arriba y abajo.
 */
const CLIP_WIDTH = 1072;
const CLIP_HEIGHT = 826;

/**
 * Cuanto antes de entrar en pantalla la fila recibe su poster y su video. Lo
 * justo para que el poster ya este pintado cuando asoma, sin bajarlo en visitas
 * que nunca pasan del hero.
 */
const NEAR_MARGIN = "800px 0px";

export function SystemClip({ clip, class_name }) {
  const video_ref = useRef(null);
  const frame_ref = useRef(null);
  const { resolvedTheme } = useTheme();
  const near = useInView(frame_ref, { once: true, margin: NEAR_MARGIN });
  // `amount: 0.4` y no "apenas asoma": arrancando con la primera linea de pixeles
  // adentro, el video empieza mientras la fila todavia esta entrando y se pierde
  // el principio, que es justo donde se arman los filtros.
  const in_view = useInView(frame_ref, { amount: 0.4 });

  // `resolvedTheme` es `undefined` hasta que next-themes monta. Sin tema no se
  // elige archivo: elegir "claro" por defecto le bajaria el video equivocado a
  // quien entra en oscuro directo a `#weights`.
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const ready = near && resolvedTheme !== undefined;
  const media = clip[theme];

  useEffect(() => {
    const video = video_ref.current;
    if (!video || !ready) return;

    if (in_view) {
      // Puede rechazar —una politica del navegador, una pestana en segundo
      // plano— y es una promesa: sin el `catch` sale por consola como un error
      // no atrapado. Que no arranque no rompe nada; queda el poster.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [ready, in_view, theme]);

  return (
    <figure
      ref={frame_ref}
      aria-label={clip.a11y}
      className={cn("org-canvas rounded-xl bg-card p-5 sm:p-6", class_name)}
    >
      <figcaption className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {clip.title}
      </figcaption>
      {/* `width` y `height` van puestos aunque el ancho sea fluido: de ellos
          sale la proporcion con la que el navegador reserva el alto en el
          primer render, y sin eso la fila salta cuando el video carga. Tienen
          que ser los del archivo — ver `CLIP_WIDTH`. */}
      <video
        key={theme}
        ref={video_ref}
        src={ready ? media.src : undefined}
        poster={ready ? media.poster : undefined}
        width={CLIP_WIDTH}
        height={CLIP_HEIGHT}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        // `block` mata la linea base de los elementos en linea, que si no deja
        // ~4px de aire fantasma abajo del video.
        //
        // `pointer-events-none` es lo que termina de sacarle las opciones: sin
        // controles no queda nada que clickear, pero el clic derecho sobre un
        // `<video>` abre igual el menu del navegador —descargar, velocidad,
        // ventana flotante—. Sin puntero no hay menu, y no se pierde nada
        // porque no hay nada con que interactuar.
        className="pointer-events-none mt-4 block w-full rounded-lg border border-border bg-muted"
      />
    </figure>
  );
}
