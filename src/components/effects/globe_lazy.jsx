"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

/**
 * El planeta, cargado en un chunk aparte.
 *
 * ## Por que existe este archivo y no un `dynamic()` en `world_reach.jsx`
 *
 * Porque ahi no funcionaria. `world_reach.jsx` es un Server Component, y la
 * guia de Next lo dice sin vueltas: *"When a Server Component dynamically
 * imports a Client Component, automatic code splitting is currently **not**
 * supported"*, y ademas *"`ssr: false` is not supported in Server Components"*.
 * O sea que el `dynamic()` escrito alla seria una capa de indireccion que no
 * parte nada. **El corte tiene que nacer del lado del cliente**, y eso pide un
 * archivo con `"use client"` — este.
 *
 * ## Por que el planeta y no las maquetas del analisis
 *
 * `system_shots.jsx` es el otro candidato obvio: cliente, 356 lineas, y vive a
 * ~7900px de scroll. **Se dejo como estaba a proposito.** Con `ssr: false` sus
 * cuatro maquetas —que tienen texto y numeros de verdad— dejarian de estar en
 * el HTML del servidor y aparecerian de golpe al hidratar. Aca no se pierde
 * nada: un `<canvas>` de WebGL no dibuja una sola cosa en el servidor, asi que
 * el HTML que se sacrifica esta vacio.
 *
 * ## Lo que ya estaba resuelto y esto NO cambia
 *
 * `Globe` pausa su bucle con un `IntersectionObserver` cuando sale de pantalla,
 * asi que el costo de CPU en reposo no era el problema. Lo que ataca este
 * archivo es **el JavaScript que se descarga**: `cobe` entero viajaba en la
 * carga inicial de una pagina donde el planeta esta a 5000px de scroll.
 *
 * ## El hueco mientras carga
 *
 * `loading` dibuja la misma caja `aspect-square` que dibuja `Globe`, asi que la
 * seccion no cambia de alto cuando llega el chunk. Va vacia y no con un
 * esqueleto: el canvas ya entra con `opacity-0` y un fundido de 1s, o sea que
 * el planeta nunca aparece de golpe — un esqueleto agregaria una segunda cosa
 * que se ve aparecer.
 */
const Globe = dynamic(
  () => import("@/components/effects/globe").then((mod) => mod.Globe),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" className="aspect-square" />,
  },
);

export function GlobeLazy({ class_name, ...props }) {
  return <Globe class_name={cn(class_name)} {...props} />;
}
