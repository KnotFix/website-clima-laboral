import { cn } from "@/lib/utils";

/**
 * El fondo de la seccion del planeta: manchas de gradiente en los naranjas de la
 * atmosfera, quietas y sin canvas.
 *
 * Hasta hoy esa seccion **no tenia ninguna capa de fondo**. Como `.section-band`
 * no pinta nada, era el blanco pelado de la pagina.
 *
 * > **Y pinta SOLO EN TEMA CLARO.** En oscuro el fondo va parejo en todas las
 * > secciones, al valor de "Una medicion", asi que `.dark .planet-backdrop` deja
 * > esta capa en `display: none` — con el blur y todo, que a opacidad 0 se
 * > seguiria pagando. El porque vive en `--band`, bloque `.dark` de
 * > `globals.css`; el como, en `.planet-backdrop`.
 *
 * ## Lo que manda acá es el halo del planeta, no el gradiente
 *
 * `globe.jsx` pinta en WebGL y su `glowColor` **tiene que ser exactamente el
 * fondo que hay detras de la esfera**. Como es WebGL, ese color no puede salir de
 * una variable CSS: esta escrito a mano, blanco puro en claro y `#0b0a0f` en
 * oscuro, y **no se corrige solo**. Cualquier color que se ponga por debajo del
 * planeta desalinea el halo y aparece el canto del disco del canvas.
 *
 * Por eso las manchas **se enmascaran para no pasar por debajo de la esfera**:
 * viven del lado del titular y mueren antes de llegar. Es el mismo recurso que la
 * mascara horizontal de `.atmo-blobs`, que despeja la columna de lectura por la
 * misma clase de razon — el fondo cede donde hay algo que no lo tolera.
 *
 * > Si algun dia se quiere color debajo del planeta, lo que hay que cambiar es
 * > `glowColor` en `globe.jsx`, **mirando los dos temas**. No esta capa.
 *
 * ## Manchas, no un lavado
 *
 * Es la leccion de las dos capas que se retiraron. El degradado continuo que
 * cubria el documento entero salio porque "el naranja dejaba de ser una presencia
 * para volverse el fondo", y `SilkBackdrop` salio por pintar un lienzo OPACO que
 * tapaba todo lo que hubiera detras. Esto son manchas sobre transparente: la
 * atmosfera —que es `fixed` en `-z-10`— y el resplandor de `SectionGlow` tienen
 * que seguir viendose por debajo.
 *
 * Y **no se mueve**. `AtmosphereField` ya dejo escrito el porque: un fondo que
 * respira por su cuenta le compite al contenido y ademas es un bucle permanente.
 *
 * > **Llevan blur, y se probo sacarlo.** El razonamiento era que un radial ya
 * > sale difuso y que estas manchas, al no moverse, no tienen nada que suavizar
 * > entre frames. En pantalla no cerro: a esta escala el degradado muestra las
 * > bandas de 8 bits y el borde se lee como tinta con canto duro. Con el blur
 * > vuelve tambien su interruptor de movil — ver `.planet-spot`.
 */
export function PlanetBackdrop({ class_name }) {
  return (
    // Sin `z-index`. La seccion no tiene contexto de apilado propio y su
    // `Container` viene despues en el DOM, asi que el contenido pinta encima sin
    // que haya que escribir una escalera de z-index.
    <div
      aria-hidden="true"
      className={cn(
        "planet-backdrop pointer-events-none absolute inset-0 overflow-hidden",
        class_name,
      )}
    >
      {SPOTS.map((spot, index) => (
        <span
          key={index}
          className={`planet-spot planet-spot-${spot.tone} absolute`}
          style={spot.box}
        />
      ))}
    </div>
  );
}

/**
 * Las manchas: de que tono y que caja ocupa cada una.
 *
 * **Todas viven en la mitad izquierda**, que es la del titular. La derecha es del
 * planeta y ahi el fondo tiene que quedarse en el color que espera su halo — ver
 * arriba. La mascara de `.planet-backdrop` es la que garantiza el corte; estas
 * posiciones solo evitan pelearse con ella.
 */
const SPOTS = [
  {
    tone: "start",
    box: { left: "-14%", top: "-24%", width: "40rem", height: "30rem" },
  },
  {
    tone: "end",
    box: { left: "6%", bottom: "-30%", width: "34rem", height: "26rem" },
  },
];
