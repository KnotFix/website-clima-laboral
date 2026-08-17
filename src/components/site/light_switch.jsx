"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * El sol del hero: un disco que cambia el tema al apretarlo.
 *
 * Es el `mid-spot` del componente de particulas original, con el juguete
 * convertido en control. Alla el punto encendia un "gold mode" decorativo que
 * invertia medio hero con filtros; aca hace lo unico que tiene sentido que haga
 * un sol en esta pagina: **prender y apagar la luz del sitio**, que es el tema.
 *
 * ## Por que va donde va
 *
 * Centrado y arriba, como en el original. Es el unico objeto del hero que no
 * es ni texto ni fondo, asi que tiene que caer en un eje que ya exista —el del
 * titular— o se lee como algo que quedo suelto. Y va arriba de la tela porque
 * es lo que la cambia de color: el orden importa para que se entienda.
 *
 * ## Sigue existiendo el boton del navbar, y no sobra
 *
 * Este disco no tiene etiqueta y solo vive en la home: es un hallazgo, no una
 * preferencia. El interruptor de siempre queda en el navbar, en todas las
 * paginas y con su icono. Que este sea el unico camino al tema oscuro seria
 * esconder una preferencia adentro de un adorno.
 *
 * El aspecto entero vive en `.sun-switch`, en `globals.css`: es el mismo trato
 * que `.cta-plate` o `.nav-key` — el relieve es del sistema de diseño, no del
 * componente. Ahi tambien esta por que en claro es dorado y en oscuro blanco.
 *
 * **`class_name` tiene que traer la posicion y el tamaño.** La clase de CSS no
 * declara `position` a proposito —va sin capa, asi que le ganaria al `absolute`
 * de quien lo coloca— y el aura que respira se cuelga de esa posicion. Sin
 * ella el disco cae en el flujo y el aura se va a buscar al primer ancestro
 * posicionado.
 *
 * No hace falta esperar a que monte para pintarlo, porque no pinta nada
 * distinto segun el tema desde JS: la clase `dark` del `<html>` la aplica
 * next-themes antes del primer pintado y el CSS resuelve el color solo. Es el
 * mismo motivo por el que `ThemeToggle` tampoco lleva estado de montaje.
 */
export function LightSwitch({ dict, class_name }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={dict.a11y_light_switch}
      title={dict.a11y_light_switch}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn("sun-switch", class_name)}
    />
  );
}
