"use client";

import { useCallback, useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useTheme } from "next-themes";

import { useReducedMotionSafe } from "@/components/motion/use_reduced_motion";
import { cn } from "@/lib/utils";

/**
 * Paletas del planeta, una por tema.
 *
 * cobe pinta en WebGL, asi que los colores son tripletas 0-1 y NO pueden salir
 * de las variables CSS: no hay nada que las lea del otro lado. Son los mismos
 * valores del sistema, escritos en la unidad que entiende el shader.
 *
 *   claro   base #ebebee   marca #5b21b6   halo #d6d5d1 (el hueso del fondo)
 *   oscuro  base #292630   marca #8b5cf6   halo #0b0a0f
 *
 * El halo tiene que ser EXACTAMENTE el fondo de la pagina: es el resplandor que
 * rodea la esfera, y si no coincide se ve el disco cuadrado del canvas.
 */
const PALETTES = {
  light: {
    dark: 0,
    diffuse: 1.5,
    map_brightness: 5,
    base_color: [0.922, 0.922, 0.933],
    marker_color: [0.357, 0.129, 0.714],
    arc_color: [0.357, 0.129, 0.714],
    glow_color: [0.839, 0.835, 0.82],
  },
  dark: {
    // La esfera va bastante mas clara que el fondo (#4a4655 contra #0b0a0f).
    // Igualarla al fondo la volvia una silueta: se veian los puntos flotando y
    // no un planeta. `dark` baja a 0.85 y `diffuse` a 1.1 para que el lado en
    // sombra no se coma media esfera; con el sombreado a pleno, la mitad
    // derecha desaparecia contra la pagina.
    dark: 0.55,
    diffuse: 1,
    map_brightness: 11,
    base_color: [0.32, 0.31, 0.36],
    marker_color: [0.545, 0.361, 0.965],
    arc_color: [0.545, 0.361, 0.965],
    glow_color: [0.043, 0.039, 0.059],
  },
};

/** Velocidad de giro por frame. */
const SPEED = 0.0035;
/** Inclinacion del eje: un poco de norte, para que no se vea de perfil. */
const THETA = 0.25;
/** Cuanto se puede arrastrar en vertical antes de que vuelva solo. */
const THETA_LIMIT = 0.4;

/**
 * Planeta interactivo. Gira solo y se puede arrastrar.
 *
 * Los tooltips de la version original se retiraron. Se posicionaban con CSS
 * Anchor Positioning (`position-anchor`, `anchor()`), que hoy solo implementa
 * Chrome. En Firefox y Safari la variable `--cobe-visible-*` igual se setea
 * —una custom property siempre funciona— asi que las etiquetas aparecian
 * visibles pero ancladas a ningun lado. Los puntos y los arcos se dibujan
 * dentro del canvas y no tienen ese problema.
 *
 * El bucle se detiene cuando el planeta no esta en pantalla. Es WebGL con un
 * `requestAnimationFrame` propio: dejarlo girando en una seccion que nadie esta
 * mirando gasta bateria por nada, y esta seccion vive bien abajo del pliegue.
 */
export function Globe({ markers = [], arcs = [], class_name }) {
  const canvas_ref = useRef(null);
  const reduced_motion = useReducedMotionSafe();
  const { resolvedTheme } = useTheme();

  // Todo lo que el bucle necesita leer vive en refs: el bucle se crea una vez
  // y no se puede recrear en cada render sin destruir el planeta.
  const pointer_start = useRef(null);
  const last_pointer = useRef(null);
  const drag_offset = useRef({ phi: 0, theta: 0 });
  const velocity = useRef({ phi: 0, theta: 0 });
  const phi_offset = useRef(0);
  const theta_offset = useRef(0);
  const is_dragging = useRef(false);
  const is_visible = useRef(false);

  const on_pointer_down = useCallback((event) => {
    pointer_start.current = { x: event.clientX, y: event.clientY };
    is_dragging.current = true;
    if (canvas_ref.current) canvas_ref.current.style.cursor = "grabbing";
  }, []);

  useEffect(() => {
    const on_move = (event) => {
      if (!pointer_start.current) return;

      drag_offset.current = {
        phi: (event.clientX - pointer_start.current.x) / 300,
        theta: (event.clientY - pointer_start.current.y) / 1000,
      };

      const now = Date.now();
      if (last_pointer.current) {
        const elapsed = Math.max(now - last_pointer.current.t, 1);
        const cap = 0.15;
        const clamp = (value) => Math.max(-cap, Math.min(cap, value));
        velocity.current = {
          phi: clamp(((event.clientX - last_pointer.current.x) / elapsed) * 0.3),
          theta: clamp(
            ((event.clientY - last_pointer.current.y) / elapsed) * 0.08,
          ),
        };
      }
      last_pointer.current = { x: event.clientX, y: event.clientY, t: now };
    };

    const on_up = () => {
      if (pointer_start.current) {
        phi_offset.current += drag_offset.current.phi;
        theta_offset.current += drag_offset.current.theta;
        drag_offset.current = { phi: 0, theta: 0 };
        last_pointer.current = null;
      }
      pointer_start.current = null;
      is_dragging.current = false;
      if (canvas_ref.current) canvas_ref.current.style.cursor = "grab";
    };

    window.addEventListener("pointermove", on_move, { passive: true });
    window.addEventListener("pointerup", on_up, { passive: true });
    return () => {
      window.removeEventListener("pointermove", on_move);
      window.removeEventListener("pointerup", on_up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    const palette = PALETTES[resolvedTheme === "dark" ? "dark" : "light"];
    // Con menos movimiento el planeta no gira solo. Arrastrarlo si: eso lo pide
    // la persona, no se lo imponemos.
    const speed = reduced_motion ? 0 : SPEED;

    let globe = null;
    let frame = 0;
    let phi = 0;

    const start = () => {
      const width = canvas.offsetWidth;
      if (!width || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: THETA,
        diffuse: palette.diffuse,
        mapSamples: 16000,
        opacity: 0.9,
        dark: palette.dark,
        mapBrightness: palette.map_brightness,
        baseColor: palette.base_color,
        markerColor: palette.marker_color,
        glowColor: palette.glow_color,
        arcColor: palette.arc_color,
        arcWidth: 0.5,
        arcHeight: 0.35,
        markerElevation: 0.01,
        markers,
        arcs,
      });

      const render = () => {
        // Fuera de pantalla no se dibuja nada, pero se sigue pidiendo el frame
        // para poder retomar solo cuando vuelva a entrar.
        if (is_visible.current) {
          if (!is_dragging.current) {
            phi += speed;

            const moving =
              Math.abs(velocity.current.phi) > 0.0001 ||
              Math.abs(velocity.current.theta) > 0.0001;

            if (moving) {
              phi_offset.current += velocity.current.phi;
              theta_offset.current += velocity.current.theta;
              velocity.current.phi *= 0.95;
              velocity.current.theta *= 0.95;
            }

            // El arrastre vertical vuelve solo si se paso de los topes: sin
            // esto se puede girar el planeta hasta dejarlo boca abajo.
            if (theta_offset.current < -THETA_LIMIT) {
              theta_offset.current +=
                (-THETA_LIMIT - theta_offset.current) * 0.1;
            } else if (theta_offset.current > THETA_LIMIT) {
              theta_offset.current += (THETA_LIMIT - theta_offset.current) * 0.1;
            }
          }

          globe.update({
            phi: phi + phi_offset.current + drag_offset.current.phi,
            theta: THETA + theta_offset.current + drag_offset.current.theta,
          });
        }

        frame = requestAnimationFrame(render);
      };

      render();
      // El canvas nace transparente y aparece cuando ya hay algo dibujado: si
      // no, el primer frame entra como un cuadrado de color.
      requestAnimationFrame(() => {
        if (canvas) canvas.style.opacity = "1";
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        is_visible.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    observer.observe(canvas);

    // El canvas puede medir 0 en el primer render (por ejemplo dentro de un
    // grid que todavia no se resolvio); ahi se espera a que tenga ancho.
    let resize_observer = null;
    if (canvas.offsetWidth > 0) {
      start();
    } else {
      resize_observer = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          resize_observer.disconnect();
          start();
        }
      });
      resize_observer.observe(canvas);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resize_observer?.disconnect();
      globe?.destroy();
    };
  }, [markers, arcs, resolvedTheme, reduced_motion]);

  return (
    <div className={cn("relative aspect-square select-none", class_name)}>
      <canvas
        ref={canvas_ref}
        // El planeta es decorativo: la frase de al lado ya dice lo que
        // significa, y un canvas no tiene nada que anunciar.
        aria-hidden="true"
        onPointerDown={on_pointer_down}
        className="h-full w-full rounded-full opacity-0 transition-opacity duration-1000"
        style={{ cursor: "grab", touchAction: "none" }}
      />
    </div>
  );
}
