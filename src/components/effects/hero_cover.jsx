/**
 * Franja opaca al pie del hero. Es lo que convierte al hero en una tapa.
 *
 * El sitio entero comparte un solo fondo: las secciones no pintan el suyo y
 * dejan ver el hueso del `body` y los destellos de `.page-light`, que es una
 * capa **fija** detras de todo. Muy lindo, pero significa que el hero es
 * transparente — y algo transparente no puede tapar a la seccion que tiene
 * detras. Sin esta franja, el titular del problema se ve a traves del hero
 * desde el primer scroll y no hay nada que descubrir.
 *
 * Va **solo al pie** y no en todo el hero a proposito. La luz diagonal es la
 * firma de la primera pantalla y taparla entera para ganar un efecto es un mal
 * negocio. Y no hace falta: lo unico que hay que ocultar es la parte de la
 * seccion de abajo que quedo metida detras, que son los `lift` px del pie. Mas
 * arriba de eso no hay nada atras del hero.
 *
 * `height` tiene que ser **mas del doble de `lift`**: el degradado recien llega
 * a opaco al 45%, asi que la parte solida es el 55% restante. Con menos, la
 * seccion de abajo asoma por el tramo todavia translucido.
 *
 * El borde de arriba va desvanecido: ese degradado es el que apaga los
 * destellos de a poco al acercarse al pie, porque de golpe se veria el escalon.
 *
 * `fog` son los ultimos px, donde el hero deja de tapar de a poco y lo que viene
 * detras **aparece saliendo de una niebla**. En 0 el borde corta limpio.
 */
export function HeroCover({ height = 640, fog = 0 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{
        height,
        backgroundImage: [
          "linear-gradient(to bottom,",
          "transparent,",
          "var(--background) 45%,",
          ...FOG_STOPS.map(
            ([amount, from_bottom]) =>
              `color-mix(in oklab, var(--background) ${amount}%, transparent) calc(100% - ${from_bottom} * ${fog}px),`,
          ),
          "transparent 100%)",
        ].join(" "),
      }}
    />
  );
}

/**
 * La niebla, como `[cuanto queda del fondo, a que altura de la franja]`.
 *
 * **No es una rampa lineal, y ahi esta toda la diferencia.** Un degradado de
 * opaco a transparente en linea recta no se lee como niebla: se lee como una
 * banda, con un principio y un final que el ojo encuentra enseguida. Estos
 * puntos dibujan una ese —se queda arriba, cae en el medio, se va suave— que es
 * la curva con la que se disuelve algo de verdad.
 *
 * La ese ademas es lo que hace que el tramo sirva. Aguantar arriba significa que
 * la mayor parte de la franja sigue tapando bastante, asi que **lo que asoma es
 * una insinuacion y no un texto legible**: con la rampa recta, el titular de
 * abajo se leia entero a traves del hero, y un texto oscuro sobre hueso se lee
 * incluso al 20%.
 */
const FOG_STOPS = [
  [96, 0.82],
  [86, 0.62],
  [66, 0.44],
  [38, 0.26],
  [14, 0.11],
];
