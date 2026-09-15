import { ArrowUpRight, CircleCheck, ShieldCheck } from "lucide-react";

import { ThemedShot } from "@/components/motion/image_cycle";
import { Reveal } from "@/components/motion/reveal";
import { ScrollFloat } from "@/components/motion/scroll_float";
import { ScrollZoom } from "@/components/motion/scroll_zoom";
import { site_config } from "@/lib/site_config";
import { cn } from "@/lib/utils";

/**
 * Piso y techo del eje de la linea de tendencia, en puntos del indice.
 *
 * No arranca en 0 a proposito: la serie se mueve entre 60 y 75, y sobre un eje
 * de 0 a 100 la subida de 15 puntos seria una linea casi plana. La tarjeta dice
 * el valor y la diferencia en texto; la linea solo tiene que mostrar la forma.
 */
const SPARK_FLOOR = 55;
const SPARK_CEIL = 80;

/** Alto del `viewBox` de la linea. El ancho es 100, asi x queda en %. */
const SPARK_HEIGHT = 32;

function spark_points(series) {
  const last = series.length - 1;
  return series.map((value, index) => [
    (index / last) * 100,
    SPARK_HEIGHT -
      ((value - SPARK_FLOOR) / (SPARK_CEIL - SPARK_FLOOR)) * SPARK_HEIGHT,
  ]);
}

/**
 * La cara de las tarjetas que flotan sobre la captura. Es la misma tarjeta del
 * resto del sitio —`bg-card`, el ring y `.graded-face`— con una sombra mas
 * larga: estas no apoyan en la pagina, estan despegadas del panel.
 */
function FloatCard({ children, class_name }) {
  return (
    <div
      className={cn(
        "graded-face rounded-xl bg-card p-4 text-left ring-1 ring-foreground/10",
        "shadow-[0_24px_48px_-20px_rgb(0_0_0/0.35)]",
        class_name,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Lo que va debajo de los CTA del hero: el panel del producto en un marco de
 * ventana, con tres tarjetas encima que sacan afuera lo que el panel dice.
 *
 * **Reemplaza al video de YouTube**, que nunca paso de *Big Buck Bunny*. Una
 * captura se puede tener hoy; un video de presentacion no.
 *
 * El conjunto entero —marco y tarjetas— va adentro de un solo `ScrollZoom`, asi
 * que crece y se endereza como una pieza. Encima de eso cada tarjeta tiene su
 * `ScrollFloat` con otra profundidad: se separan del panel al scrollear, y es
 * esa diferencia la que le da volumen.
 *
 * Las tarjetas no aparecen en movil. Ahi el marco mide lo que la pantalla, y
 * tres tarjetas encima taparian justo la captura que tienen que acompanar.
 *
 * Los numeros salen del mismo modo demo que la captura —144 respuestas, 71,42
 * de clima en el estudio 2027 con eNPS, la meta de satisfaccion 2026—: una
 * tarjeta que contradijera al panel que tiene abajo se leeria como inventada.
 *
 * La captura es la del estudio 2027 y no la del 2026 porque es la que muestra
 * el eNPS al lado de satisfaccion y clima: es lo que se vende arriba del
 * pliegue, y antes no aparecia en ninguna captura del sitio.
 */
export function HeroShowcase({ dict }) {
  const { shot, trend, goal, anonymity } = dict.hero_showcase;

  const points = spark_points(trend.series);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const [end_x, end_y] = points.at(-1);

  return (
    // Los mismos valores que tenia el video: el gesto de entrada no cambia,
    // cambia lo que entra. `zoom_origin="top"` deja el aire con los CTA fijo
    // en el margen de `hero.jsx`.
    <ScrollZoom
      zoom_from={0.7}
      zoom_to={1}
      zoom_origin="top"
      tilt_from={18}
      scroll_speed={0.08}
    >
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* El cromo de ventana dice "esto es una aplicacion" antes de que se
              lea nada adentro. Sin URL a proposito: una direccion inventada es
              un dato falso, y la real todavia no existe. */}
          <div
            aria-hidden="true"
            className="relative flex h-9 items-center border-b border-border px-4"
          >
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 rounded-md bg-muted px-3 py-0.5 text-xs text-muted-foreground">
              {site_config.product}
            </span>
          </div>

          {/* 16:10 y no la proporcion de la captura (~4:3): entera mediria mas
              de 900px de alto a ancho completo. `object-top` en `ThemedShot`
              recorta por abajo, y arriba estan los tres indicadores. */}
          <div className="relative aspect-[16/10] bg-muted">
            <ThemedShot
              shot={shot}
              sizes="(max-width: 1200px) 100vw, 1136px"
              // Es la imagen mas grande arriba del pliegue: la candidata a LCP.
              // `fetchPriority` y NO `preload`: con dos imagenes por tema,
              // `preload` bajaria las dos. `eager` en vez del `lazy` por
              // defecto: con `lazy` la request no salia hasta que el navegador
              // decidia que la imagen estaba cerca, y en movil eso costaba
              // 1,8 s de LCP. `eager` sigue pidiendo solo la que se ve — la
              // del otro tema esta en `display: none` y no se baja.
              fetch_priority="high"
              loading="eager"
            />
          </div>
        </div>

        {/* **Los lados salen de `xl` para arriba.** Antes el Container toca el
            borde de la ventana: 56px afuera del marco serian 24px afuera de
            la pantalla, y el `overflow-hidden` del hero los cortaria. */}
        <ScrollFloat
          depth={90}
          class_name="absolute -left-4 top-[14%] hidden w-60 md:block xl:-left-14 xl:w-64"
        >
          <Reveal reveal_delay={1}>
            <FloatCard>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-signal-good/15 px-2 py-0.5 text-xs font-medium">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 text-signal-good"
                  />
                  {trend.delta}
                </span>
              </div>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {trend.value}
              </p>
              <div className="relative mt-3 h-10">
                <svg
                  aria-hidden="true"
                  viewBox={`0 0 100 ${SPARK_HEIGHT}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full overflow-visible text-primary"
                >
                  <polygon
                    points={`0,${SPARK_HEIGHT} ${line} 100,${SPARK_HEIGHT}`}
                    className="fill-primary/10"
                  />
                  <polyline
                    points={line}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* El punto final va en HTML y no en el SVG: con
                    `preserveAspectRatio="none"` un circulo se estira y sale
                    ovalado. */}
                <span
                  aria-hidden="true"
                  className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/20"
                  style={{
                    left: `${end_x}%`,
                    top: `${(end_y / SPARK_HEIGHT) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {trend.span}
              </p>
            </FloatCard>
          </Reveal>
        </ScrollFloat>

        <ScrollFloat
          depth={140}
          class_name="absolute -right-4 top-[46%] hidden w-64 md:block xl:-right-14 xl:w-72"
        >
          <Reveal reveal_delay={1.15}>
            <FloatCard>
              <span className="text-xs text-muted-foreground">
                {goal.label}
              </span>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                <CircleCheck
                  aria-hidden="true"
                  className="size-4 text-signal-good"
                />
                {goal.status}
              </p>
              {/* De 0 a 100, sin recortar el eje: la barra pasa apenas la raya
                  de la meta, y eso es exactamente lo que paso. */}
              <div aria-hidden="true" className="relative mt-4 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-signal-good"
                  style={{ width: `${goal.result_value}%` }}
                />
                <span
                  className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full bg-foreground"
                  style={{ left: `${goal.target_value}%` }}
                />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">{goal.target_label}</dt>
                  <dd className="mt-0.5 text-base font-semibold tabular-nums">
                    {goal.target}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-muted-foreground">{goal.result_label}</dt>
                  <dd className="mt-0.5 text-base font-semibold tabular-nums">
                    {goal.result}
                  </dd>
                </div>
              </dl>
            </FloatCard>
          </Reveal>
        </ScrollFloat>

        {/* La mas quieta de las tres: el anonimato es la promesa de fondo, no
            un dato que salta. */}
        <ScrollFloat
          depth={50}
          class_name="absolute bottom-[8%] left-[6%] hidden md:block xl:left-[10%]"
        >
          <Reveal reveal_delay={1.3}>
            <FloatCard class_name="flex max-w-xs items-center gap-3 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  {anonymity.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {anonymity.body}
                </span>
              </span>
            </FloatCard>
          </Reveal>
        </ScrollFloat>
      </div>
    </ScrollZoom>
  );
}
