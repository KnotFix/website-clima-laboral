"use client";

import { useActiveSection } from "@/components/site/use_active_section";
import { cn } from "@/lib/utils";

/** Los href del diccionario son anclas ("#how"); el id es lo que sigue al #. */
function section_id_of(href) {
  return href.startsWith("#") ? href.slice(1) : "";
}

/**
 * Links de seccion del navbar de escritorio, con marca de seccion activa.
 *
 * Es cliente porque necesita observar el scroll; el resto del navbar sigue
 * siendo Server Component.
 */
export function NavLinks({ dict, class_name }) {
  const active_id = useActiveSection(
    dict.nav_links.map((link) => section_id_of(link.href)),
  );

  return (
    <nav
      className={cn("items-center gap-1", class_name)}
      aria-label={dict.a11y_main_nav}
    >
      {dict.nav_links.map((link) => {
        const is_active = section_id_of(link.href) === active_id;

        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={is_active ? "true" : undefined}
            className={cn(
              // nav-key trae el relieve 3D del hover y su propia transicion.
              "nav-key relative rounded-md px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              is_active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
            {/* El color solo no alcanza: al pasar el mouse un link inactivo
                toma el mismo `text-foreground` que el activo. El subrayado es
                lo que los distingue. Se anima con scaleX (no con width) y el
                bloque de movimiento reducido de globals.css ya lo desactiva. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 bottom-1 h-px origin-center bg-foreground transition-transform duration-200",
                is_active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
