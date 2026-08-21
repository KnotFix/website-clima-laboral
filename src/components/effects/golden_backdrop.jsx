import { cn } from "@/lib/utils";

/**
 * La geometria dorada del hero: la subdivision de la caja, los cuadrados
 * anidados y la espiral de Fibonacci.
 *
 * **Sin una linea de JavaScript de cliente**, como `GridBackdrop` y `HeroCover`.
 * El unico movimiento —el destello que recorre la espiral— es un `@keyframes` de
 * `globals.css`, asi que esta capa no pesa nada en el bundle y no gasta un
 * `requestAnimationFrame` por fotograma. Ver `.golden-spark`.
 *
 * ## Dos figuras y no una estirada
 *
 * La caja del hero es alta en telefono y ancha en escritorio, y la figura tiene
 * que seguir siendo dorada en las dos. Por eso hay dos: una vertical y una
 * horizontal, con la misma construccion rotada. **Las dos viven en el DOM pero
 * solo una se pinta** — `hidden` es `display: none`, asi que el destello anima
 * en una sola.
 *
 * ## `preserveAspectRatio` se queda en el default
 *
 * O sea `xMidYMid meet`: la figura se escala entera y se centra. Estirarla con
 * `none` para que llene la caja convierte los cuadrados en rectangulos y la
 * espiral en un ovalo, y ahi se pierde **exactamente lo que la hace dorada**.
 * Que sobre aire a los costados es el precio, y es el precio correcto.
 */
export function GoldenBackdrop({ class_name }) {
  return (
    // `text-box-edge` es de donde sale el color de todo lo que dibuja: el canto
    // de las cajas del sitio, que ya esta resuelto por tema (#c5c3be en claro,
    // #2e2a3b en oscuro). Nada de morado — el unico acento de la primera
    // pantalla es el CTA primario.
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden text-box-edge",
        class_name,
      )}
    >
      <GoldenFigure figure={PORTRAIT} class_name="md:hidden" />
      <GoldenFigure figure={LANDSCAPE} class_name="hidden md:block" />
    </div>
  );
}

/**
 * Una de las dos figuras.
 *
 * `overflow-visible` no es un descuido: los arcos exteriores de la espiral se
 * dibujan **muy** afuera del viewBox a proposito —ahi esta la sensacion de que
 * la curva sigue de largo— y lo que sobra lo recorta el `overflow-hidden` de la
 * seccion del hero. Sin el recorte de arriba habria barra horizontal.
 *
 * `vectorEffect="non-scaling-stroke"` en cada trazo: el grosor se mide en
 * pixeles de pantalla y no en unidades del viewBox, asi que la figura no
 * engorda al escalarse a una pantalla grande.
 */
function GoldenFigure({ figure, class_name }) {
  return (
    <svg
      viewBox={figure.view_box}
      fill="none"
      className={cn("absolute inset-0 overflow-visible", class_name)}
    >
      {/* Las diagonales son el trazado de construccion: cruzan la caja entera y
          van punteadas para leerse como una guia y no como un borde. */}
      <g className="text-box-edge/60">
        {figure.diagonals.map((d) => (
          <path
            key={d}
            d={d}
            stroke="currentColor"
            strokeDasharray="4 2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* La subdivision: las rectas que parten la caja en la razon dorada. */}
      <g className="text-box-edge/70">
        {figure.lines.map((d) => (
          <path
            key={d}
            d={d}
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* Los tres cuadrados anidados, cada uno la razon dorada del anterior. Son
          `rect` y no `path` porque son cuadrados y decirlo asi se lee. */}
      <g className="text-box-edge/70">
        {figure.squares.map((square, index) => (
          <rect
            key={index}
            {...square}
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* La espiral, completa y quieta desde el primer fotograma. */}
      <path
        d={figure.spiral}
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />

      {/* La misma curva otra vez, y esto es el destello. Va con `pathLength="1"`
          —el largo de la curva normalizado a 1— asi que el `stroke-dasharray` de
          `.golden-spark` se escribe en fracciones y no hay que medir la curva
          desde JavaScript. El movimiento y el porque del bucle viven en
          `globals.css`.
          El color no sale de `--box-edge` sino del texto: es luz sobre la curva,
          no otra curva. Y sube en oscuro, el mismo criterio que `GridBackdrop`:
          ese fondo tiene menos con que leerse y aguanta mas. */}
      <path
        className="golden-spark text-foreground/25 dark:text-foreground/40"
        d={figure.spiral}
        pathLength="1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * La figura vertical, para telefono. El ojo de la espiral cae abajo a la
 * derecha, que es la esquina que en una pantalla alta queda libre.
 */
const PORTRAIT = {
  view_box: "0 0 210 340",
  diagonals: [
    "M380.853 105.099L-201.625 464.632",
    "M-165.247 -267.831L369.777 600.141",
  ],
  lines: [
    "M209.5 260L130 260",
    "M129.5 339.5L129.5 210",
    "M159.5 260L159.5 210",
    "M0 210L209.5 210",
    "M160 240L130.133 240",
    "M149.5 240L149.5 260",
  ],
  squares: [
    { x: 159.5, y: 210, width: 30, height: 30, transform: "rotate(90 159.5 210)" },
    { x: 149.5, y: 240, width: 20, height: 20, transform: "rotate(90 149.5 240)" },
    { x: 159.5, y: 240, width: 20, height: 10, transform: "rotate(90 159.5 240)" },
  ],
  spiral: [
    "M149.643 239.897C155.106 239.897 159.619 244.414 159.619 249.882C159.619",
    "255.35 155.106 259.868 149.643 259.868C138.717 259.868 129.69 250.833",
    "129.69 239.897C129.69 223.493 143.23 209.941 159.619 209.941C186.935",
    "209.941 209.5 232.527 209.5 259.868C209.5 303.613 173.396 339.75 129.69",
    "339.75C58.6695 339.75 0 281.027 0 209.941C0 95.1103 94.7738 0.25 209.5",
    "0.25C395.69 0.25 549.5 154.06 549.5 340.25",
  ].join(" "),
};

/**
 * La figura horizontal, de `md` para arriba. Es la misma construccion girada un
 * cuarto de vuelta: el ojo queda arriba a la derecha, o sea en el aire que el
 * hero tiene entre el navbar y el titular.
 */
const LANDSCAPE = {
  view_box: "0 0 340 210",
  diagonals: [
    "M105.1 -170.853L464.633 411.625",
    "M-267.831 375.247L600.141 -159.777",
  ],
  lines: ["M260 0.5V80", "M339.5 80.5H210", "M210 210V0.5"],
  squares: [
    { x: 210, y: 50.5, width: 30, height: 30 },
    { x: 240, y: 60.5, width: 20, height: 20 },
    { x: 240, y: 50.5, width: 20, height: 10 },
  ],
  spiral: [
    "M239.897 60.3571C239.897 54.894 244.414 50.381 249.882 50.381C255.35",
    "50.381 259.868 54.894 259.868 60.3571C259.868 71.2835 250.833 80.3095",
    "239.897 80.3095C223.493 80.3095 209.941 66.7704 209.941 50.381C209.941",
    "23.0652 232.527 0.5 259.868 0.5C303.613 0.5 339.75 36.6043 339.75",
    "80.3095C339.75 151.33 281.027 210 209.941 210C95.1103 210 0.25 115.226",
    "0.25 0.5C0.25 -185.69 154.06 -339.5 340.25 -339.5",
  ].join(" "),
};
