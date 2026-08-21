import { GlobeLazy } from "@/components/effects/globe_lazy";
import { PlanetBackdrop } from "@/components/effects/planet_backdrop";
import { BlurText, BlurTextPiece } from "@/components/motion/blur_text";
import { RotatingText } from "@/components/motion/rotating_text";
import { HEADING_PASS, ScrollPass } from "@/components/motion/scroll_pass";
import { Container } from "@/components/site/container";

/**
 * Alcance: texto a la izquierda, planeta a la derecha.
 *
 * Los puntos y los arcos son constantes de modulo y no literales dentro del
 * JSX. `Globe` los tiene entre las dependencias de su efecto, y un array nuevo
 * en cada render destruiria y volveria a crear el planeta entero cada vez.
 *
 * La seleccion mezcla America Latina con el resto del mundo a proposito: el
 * punto de la frase es que la misma estructura sirve en cualquier lado, y un
 * planeta con puntos en una sola region diria lo contrario.
 */
const MARKERS = [
  { location: [9.9281, -84.0907], size: 0.05 }, // San Jose
  { location: [19.4326, -99.1332], size: 0.045 }, // Ciudad de Mexico
  { location: [4.711, -74.0721], size: 0.04 }, // Bogota
  { location: [-23.5505, -46.6333], size: 0.045 }, // Sao Paulo
  { location: [-34.6037, -58.3816], size: 0.04 }, // Buenos Aires
  { location: [40.7128, -74.006], size: 0.04 }, // Nueva York
  { location: [40.4168, -3.7038], size: 0.04 }, // Madrid
  { location: [51.5074, -0.1278], size: 0.035 }, // Londres
  { location: [-1.2921, 36.8219], size: 0.035 }, // Nairobi
  { location: [25.2048, 55.2708], size: 0.035 }, // Dubai
  { location: [1.3521, 103.8198], size: 0.035 }, // Singapur
  { location: [35.6762, 139.6503], size: 0.035 }, // Tokio
  { location: [-33.8688, 151.2093], size: 0.035 }, // Sidney
];

const ARCS = [
  { from: [9.9281, -84.0907], to: [40.4168, -3.7038] }, // San Jose - Madrid
  { from: [-23.5505, -46.6333], to: [1.3521, 103.8198] }, // Sao Paulo - Singapur
  { from: [40.7128, -74.006], to: [35.6762, 139.6503] }, // Nueva York - Tokio
];

export function WorldReach({ dict }) {
  return (
    // Sin padding vertical propio: el alto de la seccion lo pone el planeta,
    // que es cuadrado. El aire con lo que viene antes y despues queda a cargo
    // de las secciones vecinas.
    //
    // `overflow-x-clip` porque las dos columnas llegan de costado: sin el, la
    // pieza corrida se sale del ancho del documento y aparece barra horizontal.
    // Va en la `<section>` y no en la reja: la seccion es de ancho completo, asi
    // que el recorte cae en el borde de la pantalla y no en el del `Container`.
    // El resplandor no se toca — vive en el envoltorio de `SectionGlow`, afuera
    // de esta seccion, y en oscuro esta apagado.
    <section className="relative overflow-x-clip">
      {/* El fondo de la seccion, y **solo en tema claro**: en oscuro
          `.planet-backdrop` esta en `display: none` para que el fondo quede
          parejo con el resto (ver `--band` en el bloque `.dark`). Antes de esta
          capa no habia ninguna, y como `.section-band` tampoco pinta, en claro
          era el blanco pelado.

          > **Se corta antes de llegar al planeta, y no es un capricho de
            composicion.** El halo del globo es WebGL y esta escrito a mano
            contra el color que espera encontrar detras; con color ahi, el halo
            deja de coincidir y aparece el canto del disco. Ver `PlanetBackdrop`. */}
      <PlanetBackdrop />
      <Container class_name="relative">
        {/* Apilado queda texto arriba y planeta abajo, el mismo orden que se
            lee de izquierda a derecha en escritorio: el texto explica, el
            planeta ilustra. */}
        {/* Las columnas no van mitad y mitad: al texto le toca mas. A 50/50 la
            columna quedaba en 536px y "Cualquier organizacion" no entraba
            junto, asi que el titular se partia en cuatro lineas con dos
            palabras solas. El ancho de la columna es lo que decide el corte,
            no el `max-w` del titular. */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* Sin `text-balance`: `BlurText` reparte las palabras en un flex
              para poder animarlas sueltas, y ahi el balanceo no aplica. El
              ancho maximo es lo que decide el corte de linea. */}
          {/* El titular entra y sale con el scroll, como todos los del sitio.
              Sin esto era el unico que se quedaba puesto para siempre despues
              de la primera vez: bajando se armaba palabra por palabra y
              volviendo a subir ya estaba ahi.
              La mezcla de los dos efectos es la misma que ya hace el titular
              de los pesos: `BlurText` entra una vez y `ScrollPass` es funcion
              pura del scroll, asi que en la primera entrada las dos opacidades
              se multiplican. */}
          <ScrollPass {...HEADING_PASS} enter_from="left">
            <BlurText
              tag="h2"
              class_name="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {dict.world_title_segments.map((segment, index) => {
                const trailing_space =
                  index < dict.world_title_segments.length - 1;

                return (
                  <BlurTextPiece key={index} trailing_space={trailing_space}>
                    {segment.rotating ? (
                      // La palabra que rota va en el color de acento, y es el
                      // unico tramo coloreado del titular. No es decoracion: esa
                      // palabra ES el argumento de la seccion —organizacion,
                      // empresa, negocio: el mismo sistema sirve para las tres— y
                      // ademas es la unica que cambia sola. Pintarla avisa que hay
                      // algo que mirar antes de que se mueva.
                      <span className="text-brand">
                        <RotatingText texts={dict.world_rotating_words} />
                      </span>
                    ) : (
                      segment.text
                    )}
                  </BlurTextPiece>
                );
              })}
            </BlurText>
          </ScrollPass>

          {/* El planeta se acota: a lo ancho de media pantalla grande se vuelve
              una esfera enorme que le gana al texto, y es la ilustracion. */}
          {/* Entra desde la derecha, que es la columna en la que vive, y se
              coloca. Antes atravesaba en vertical: derivaba 90px de corrido y
              nunca estaba en su sitio. Los 90px se quedan como distancia. */}
          <ScrollPass
            enter_from="right"
            class_name="mx-auto w-full max-w-md lg:max-w-lg"
          >
            {/* Via `GlobeLazy` y no `Globe` directo: esta seccion es un
                Server Component, y desde ahi `next/dynamic` no parte el chunk
                ni admite `ssr: false`. El envoltorio de cliente es lo que saca
                a `cobe` de la carga inicial — el porque completo esta en
                `globe_lazy.jsx`. */}
            <GlobeLazy markers={MARKERS} arcs={ARCS} />
          </ScrollPass>
        </div>
      </Container>
    </section>
  );
}
