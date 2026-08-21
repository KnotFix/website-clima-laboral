import { site_config } from "@/lib/site_config";
import { cn } from "@/lib/utils";

/**
 * Las tres esferas: de que tono y que caja ocupa cada una.
 *
 * **Los tres nucleos caen fuera del cuadro**, y eso es lo unico que hay que
 * respetar al mover una. Es la misma precaucion que la mascara horizontal de
 * `.atmo-blobs`: medido en su momento, con el nucleo de una mancha debajo del
 * texto el gris apagado se iba a 2.49:1 contra un minimo de 4.5. Aca la mascara
 * no sirve —el pie usa el ancho entero y no una columna central— asi que la
 * garantia la da la posicion, y por eso los `right`/`left` son negativos y mas
 * grandes que la mitad del ancho de la esfera.
 */
const SPHERES = [
  {
    tone: "start",
    box: { left: "-18%", bottom: "-30%", width: "34rem", height: "26rem" },
  },
  {
    tone: "end",
    box: { right: "-16%", bottom: "-38%", width: "32rem", height: "28rem" },
  },
  {
    tone: "start",
    box: { right: "-14%", top: "-26%", width: "24rem", height: "18rem" },
  },
];

/**
 * El fondo del pie: esferas de atmosfera, trama de puntos y la palabra del
 * producto en grande, cortada por el borde de abajo.
 *
 * Sin una linea de JavaScript de cliente, como `GridBackdrop` y `GoldenBackdrop`.
 * Todo es CSS y todo se pinta una vez.
 *
 * ## El orden de las capas ES el efecto
 *
 * 1. la luz que baja desde el canto de arriba
 * 2. las esferas
 * 3. la reja de lineas
 * 4. **la palabra, con sus puntos ENCIMA**
 *
 * Lo ultimo es lo que la vuelve puntillista: los puntos le rompen las letras,
 * asi que la palabra no se lee como un texto gigante atenuado sino como algo
 * tramado. Al reves —puntos abajo, palabra arriba— serian dos capas que se
 * ignoran.
 *
 * > **Los puntos van acotados a la palabra y la reja al panel.** Sueltas las dos
 * > sobre toda la caja competian: dos tramas del mismo peso en el mismo plano se
 * > pisan. Con roles separados —la reja es el fondo, los puntos son textura de
 * > la palabra— cada una dice una cosa.
 *
 * > **Asi se evita ademas estrenar `background-clip: text` en el repo.** Rellenar
 * > la palabra con un mosaico de puntos daria un resultado parecido, pero es una
 * > tecnica que hoy no se usa en ningun lado y que ademas mete al texto adentro
 * > de una pintura — justo lo que el sitio evita para no tocarle el antialiasing.
 */

export function FooterBackdrop({ class_name }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", class_name)}
    >
      {/* La luz que baja desde la juntura con la seccion de arriba. Va
          primera: es lo que hay MAS al fondo, y las esferas se leen dentro de
          ella. Los numeros y el porque del cono viven en `.footer-light`. */}
      <div className="footer-light absolute inset-0" />

      {/* > **Las esferas reusan las clases de la atmosfera, y eso importa por
            dos motivos.**
            Uno: `.atmo-blob` ya trae el interruptor que apaga el `blur(60px)`
            abajo de 768px. Un blur de ese tamano sobre cajas de media pantalla
            es de lo mas caro que puede pintar un telefono, y esa decision ya
            esta tomada y medida en `globals.css` — reescribir el degradado aca
            la perderia en silencio.
            Dos: el color. Van en `--atmo-start` / `--atmo-end`, que son los
            naranjas de FONDO del sitio, y **no en `--brand`**: el naranja de
            marca es acento —titulares, foco, los numeros de los pasos— y
            `globals.css` es explicito en que no se usa como relleno. El unico
            lugar del fondo donde aparece es `.atmo-blob-mid`, y esta anotado
            como tal.

            De donde sale cada una y por que los nucleos van fuera de cuadro:
            ver `SPHERES`.

            > **Las posiciones van en `style` y no en clases, y no es descuido.**
            Son geometria —de donde sale cada nucleo y cuanto mide— y se leen
            mejor como numeros que como seis utilidades arbitrarias. Ademas
            dependen del JIT: `-right-[16%]` se genera y `-right-[14%]` no,
            comprobado con el servidor reiniciado, y una clase que no compila
            falla en silencio dejando el elemento en su posicion estatica. Con
            `style` no hay nada que generar. */}
      <div className="footer-atmo absolute inset-0 overflow-hidden">
        {SPHERES.map((sphere, index) => (
          <span
            key={index}
            className={`atmo-blob atmo-blob-${sphere.tone} absolute`}
            style={sphere.box}
          />
        ))}
      </div>

      {/* La reja del panel. Va antes de la palabra, o sea por detras: la
          palabra tiene su propia trama encima y dos rejas sobre las letras las
          volverian ilegibles.

          > **No se reusa `GridBackdrop`.** Sus dos capas estan en `opacity-0`
            en tema claro a proposito: ahi la pagina ya recibe el extremo
            calido de la atmosfera y una reticula encima seria una segunda
            textura peleando con las manchas. Pero el pie es un panel APOYADO,
            con canto y sombra propios: su textura no esta sobre el fondo de la
            pagina, asi que no compite con nada y tiene que verse en los dos
            temas. El resto de los numeros vive en `.footer-grid`. */}
      <div className="footer-grid absolute inset-0" />

      {/* La palabra. Va detras de la trama y del contenido, y **la corta el
          `overflow-hidden` del `<footer>`**, no un recorte propio: por eso el
          `-bottom` negativo y por eso este componente no lleva `overflow`.

          `leading-none` y `tracking-tighter` porque a este cuerpo el interletrado
          normal abre agujeros entre las letras y el interlineado reserva un
          renglon de aire que no existe.

          **Va en mayusculas, y el corte es la razon.** En caja baja "Clima"
          tiene una `l` que sube y una `a` que se apoya en la linea de base: al
          cortarla por abajo quedan alturas distintas y se lee como texto mal
          recortado. En mayusculas todas arrancan y terminan a la misma altura,
          asi que el corte se lee como una decision.

          Es la tipografia mas grande del sitio: el segundo puesto es el
          `text-6xl` del 404. */}
      <div className="absolute inset-x-0 -bottom-[0.3em] overflow-hidden">
        <div className="relative">
          <p className="footer-word text-center text-[clamp(5rem,20vw,15rem)] leading-none font-black tracking-tighter uppercase select-none">
            {site_config.product}
          </p>
          {/* Los puntos, encima de las letras y solo sobre ellas. */}
          <div className="footer-word-dots absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
