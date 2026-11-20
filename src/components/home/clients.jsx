import Image from "next/image";

import { AccentTitle } from "@/components/home/accent_title";
import { ScrollLine } from "@/components/motion/scroll_line";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/**
 * Cuantas veces se repite la lista de clientes dentro de CADA mitad del riel.
 *
 * Con dos clientes una vuelta mide ~500px, y la mitad del riel tiene que ser
 * mas ancha que la pantalla mas ancha que se espera (2560px) o, al llegar al
 * final del ciclo, se ve el hueco antes de que la segunda mitad entre. Cinco
 * vueltas son ~2500px. Si se suman clientes, este numero se puede bajar.
 */
const RAIL_REPEAT = 5;

/**
 * «Nuestra familia»: los logos de los clientes, pasando solos.
 *
 * > **Contradice a proposito el «sin carrusel de logos» de `AGENTS.md`.** Esa
 * > regla era contra la tira de logos generica suelta dentro del hero; esta es
 * > una seccion propia, con titular y con los clientes reales, pedida por el
 * > usuario el 2026-11-19.
 *
 * **Va justo debajo de la captura del hero, antes del problema** (decision del
 * usuario, el mismo 2026-11-19; nacio entre los reportes y el FAQ). O sea que
 * es la seccion que `ScrollLift` mete detras del hero: sus primeros `HERO_LIFT`
 * px arrancan tapados y se destapan con el scroll. Primero asoma el riel por la
 * niebla del pie del hero y despues el titular; en reposo queda todo a la
 * vista, como cualquier otra seccion.
 *
 * **Es un Server Component: el movimiento es CSS.** El riel es una
 * `@keyframes` sobre `transform` (`clients-marquee`, en `globals.css`), que el
 * navegador compone sin un frame de JavaScript. Se detiene al pasar el mouse.
 *
 * **Hay dos copias de la lista, y cada una tiene su publico.**
 * - El riel animado lleva `aria-hidden` y `alt=""`: son los mismos logos
 *   repetidos una decena de veces, y un lector de pantalla los leeria todos.
 * - La lista real —un logo por cliente, con su `alt`— esta SIEMPRE en el arbol
 *   de accesibilidad. Con movimiento permitido va en `sr-only`; con
 *   `prefers-reduced-motion` se vuelve visible y el riel desaparece. O sea que
 *   quien pidio menos movimiento ve los logos quietos, uno al lado del otro, y
 *   no un riel congelado a mitad de camino.
 *
 * **La placa es blanca en los dos temas** (`--logo-plate`): los logos son
 * archivos de terceros con fondo blanco y no hay version para fondo oscuro. En
 * oscuro la placa y el logo bajan juntos al 92% del brillo, el mismo trato que
 * las capturas de los reportes, para que no encandilen.
 */
export function Clients({ dict }) {
  const rail_half = Array.from({ length: RAIL_REPEAT }, () => dict.clients_items).flat();

  return (
    <section
      id="clients"
      data-section="clients"
      className="relative isolate scroll-mt-24 overflow-x-clip py-20 sm:py-32"
    >
      {/* La linea del problema, traida desde el hero. Sin esto arranca en el
          aire debajo de los logos: ver `LEAD` en `scroll_line.jsx`.

          **Los 6rem de arriba se meten debajo del hero.** El pie del hero son
          60px de niebla bajo la captura (`HERO_EDGE`); con 96 el trazo arranca
          tapado por la captura y sale por la niebla, que es lo que lo hace
          leerse como que viene de atras. El alto va escrito porque un `svg`
          absoluto no se estira entre `top` y `bottom`.

          **El ancho copia al de la diapositiva del problema**, o el empalme
          queda corrido: clavada mide `w-screen`, que incluye la barra de
          scroll, y suelta mide el 100%. `chapter-pinned` es la variante de
          `globals.css` que repite las condiciones de `PinnedChapter`. Sobra
          por la derecha lo que mide la barra, y lo corta el `overflow-x-clip`
          de la seccion.

          `-z-10` con `isolate`: queda detras del texto y de las placas, que
          son opacas, asi que por el riel pasa por atras. */}
      <ScrollLine
        shape="lead"
        outside_chapter
        class_name="-top-24 left-0 -z-10 h-[calc(100%+6rem)] w-full chapter-pinned:w-screen"
      />

      <Container>
        <ScrollPass {...HEADING_PASS}>
          <div className="max-w-2xl">
            <AccentTitle segments={dict.clients_title_segments} />
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
              {dict.clients_body}
            </p>
          </div>
        </ScrollPass>

        {/* El margen va en un envoltorio porque `not-sr-only` pone
            `margin: 0` y, en la misma lista, le ganaria al `mt-12`. */}
        <div className="motion-reduce:mt-12">
          <ul className="sr-only motion-reduce:not-sr-only motion-reduce:flex motion-reduce:flex-wrap motion-reduce:gap-5">
            {dict.clients_items.map((client) => (
              <li key={client.name}>
                <LogoPlate client={client} alt={client.name} />
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* A sangre, sin `Container`: el riel entra y sale por los bordes de la
          ventana, y la mascara lo desvanece en los costados para que no se
          corte en seco. No define ancho maximo, asi que no le disputa nada al
          `Container`. */}
      <div aria-hidden="true" className="clients-rail mt-12 motion-reduce:hidden">
        <div className="clients-track flex w-max">
          {[0, 1].map((half) => (
            // `pe-5` igual al `gap-5`: sin ese aire final, la juntura entre las
            // dos mitades quedaria mas apretada que el resto y el `-50%` no
            // caeria justo sobre el comienzo de la segunda.
            <ul key={half} className="flex gap-5 pe-5">
              {rail_half.map((client, index) => (
                <li key={`${client.name}-${index}`}>
                  <LogoPlate client={client} alt="" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Un logo sobre su placa. Medida fija para que logos de proporciones distintas
 * —GACH es 2:1, Right People es un circulo— ocupen lo mismo en el riel;
 * `object-contain` los encaja sin recortar.
 *
 * **`round` saca casi todo el relleno.** Un logo redondo encajado en una placa
 * apaisada queda limitado por el alto, y con el `p-3` de los demas el texto de
 * adentro del circulo salia a la mitad del tamaño que el de GACH. Sin relleno
 * el circulo toca casi el borde de arriba y de abajo, que en una forma redonda
 * no se ve apretado.
 */
function LogoPlate({ client, alt }) {
  return (
    <div className="relative h-24 w-48 overflow-hidden rounded-xl bg-logo-plate ring-1 ring-foreground/10 sm:h-28 sm:w-56">
      <Image
        src={client.logo}
        alt={alt}
        fill
        sizes="224px"
        className={cn("object-contain dark:brightness-[0.92]", client.round ? "p-1" : "p-3")}
      />
    </div>
  );
}
