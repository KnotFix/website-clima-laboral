"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Frown, Meh, Smile, Sun } from "lucide-react";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Las caras y el clima se turnan a ritmos DISTINTOS a proposito. Con el mismo
 * intervalo cambiarian siempre juntos y se leeria como un reloj; desfasados
 * parecen dos senales independientes, que es lo que representan.
 */
const MOOD_INTERVAL = 1600;
// 1900 y no 2300: a 2300ms el ciclo completo tardaba casi 7 segundos y era
// facil quedarse mirando el sol y no ver nunca la nube ni la lluvia.
const WEATHER_INTERVAL = 1900;

/** Contenta, seria, triste: el mismo recorrido que un resultado de clima. */
const MOODS = [
  { Icon: Smile, tone: "text-signal-good" },
  { Icon: Meh, tone: "text-signal-warn" },
  { Icon: Frown, tone: "text-signal-bad" },
];

/** Soleado, nublado, lluvia — el clima laboral, literal. */
const WEATHER = [
  { Icon: Sun, tone: "text-signal-warn" },
  { Icon: Cloud, tone: "text-signal-cloud" },
  { Icon: CloudRain, tone: "text-signal-rain" },
];

function useCycle(length, interval, enabled) {
  const [index, set_index] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(
      () => set_index((current) => (current + 1) % length),
      interval,
    );
    return () => clearInterval(timer);
  }, [length, interval, enabled]);

  return index;
}

/**
 * Ficha incrustada en el titular con un icono que va cambiando.
 *
 * Se dimensiona en `em`, no en px: vive dentro de un titular que cambia de
 * tamano en cada breakpoint, y en px habria que reajustarla en cada uno.
 *
 * Todos los iconos se renderizan siempre y se turnan por opacidad y escala.
 * Es mas barato que montar y desmontar, y evita que la ficha se sacuda cuando
 * el icono entrante todavia no ocupa lugar.
 */
function CyclingTile({ items, interval, label, class_name }) {
  const reduced_motion = useReducedMotionSafe();
  const index = useCycle(items.length, interval, !reduced_motion);

  return (
    <span
      // El titular ya dice la frase completa; la ficha es decorativa. Se le
      // pone label igual para que no quede un hueco mudo al leerlo en voz alta.
      role="img"
      aria-label={label}
      className={cn(
        "relative inline-flex h-[0.86em] w-[1.02em] shrink-0 items-center justify-center",
        "rounded-[0.24em] bg-foreground align-middle",
        "shadow-[0_0.06em_0.18em_rgb(0_0_0/0.28)]",
        class_name,
      )}
    >
      {items.map(({ Icon, tone }, item_index) => (
        <Icon
          key={item_index}
          aria-hidden="true"
          strokeWidth={2.25}
          className={cn(
            "absolute size-[0.58em] transition-all duration-500 ease-out",
            tone,
            item_index === index
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0",
          )}
        />
      ))}
    </span>
  );
}

export function MoodFace({ dict, class_name }) {
  return (
    <CyclingTile
      items={MOODS}
      interval={MOOD_INTERVAL}
      label={dict.a11y_mood_face}
      class_name={class_name}
    />
  );
}

export function WeatherTile({ dict, class_name }) {
  return (
    <CyclingTile
      items={WEATHER}
      interval={WEATHER_INTERVAL}
      label={dict.a11y_weather_tile}
      class_name={class_name}
    />
  );
}
