import { Globe } from "@/components/effects/globe";
import { BlurText, BlurTextPiece } from "@/components/motion/blur_text";
import { RotatingText } from "@/components/motion/rotating_text";
import { ScrollPass } from "@/components/motion/scroll_pass";
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
    <section className="relative">
      <Container>
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
                    <RotatingText texts={dict.world_rotating_words} />
                  ) : (
                    segment.text
                  )}
                </BlurTextPiece>
              );
            })}
          </BlurText>

          {/* El planeta se acota: a lo ancho de media pantalla grande se vuelve
              una esfera enorme que le gana al texto, y es la ilustracion. */}
          <ScrollPass class_name="mx-auto w-full max-w-md lg:max-w-lg">
            <Globe markers={MARKERS} arcs={ARCS} />
          </ScrollPass>
        </div>
      </Container>
    </section>
  );
}
