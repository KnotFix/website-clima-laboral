import { cn } from "@/lib/utils";

/**
 * Organigrama de un nodo y sus hijos, recursivo.
 *
 * Las lineas que unen los niveles viven en `globals.css` (`.org-children`,
 * `.org-branch`): son pseudo-elementos con selectores de posicion
 * (`:first-child`, `:last-child`, `:only-child`) que en clases de Tailwind
 * quedarian ilegibles.
 *
 * La raiz se pinta en solido y el resto en tarjeta. Es el unico contraste que
 * necesita: se lee de una cual es la organizacion contratante y cuales son sus
 * ramas, sin agregar color.
 */
function OrgNode({ node, is_root = false }) {
  const children = node.children ?? [];

  return (
    <div className="flex flex-col items-center">
      <span
        className={cn(
          "rounded-lg px-4 py-2 text-center text-sm leading-tight whitespace-nowrap sm:text-base",
          is_root
            ? "org-box-root font-semibold text-background"
            : "org-box font-medium text-foreground",
        )}
      >
        {node.label}
      </span>

      {children.length > 0 && (
        <div className="org-children">
          {children.map((child, index) => (
            <div key={index} className="org-branch">
              <OrgNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrgChart({ tree, class_name }) {
  return (
    <div className={cn("flex w-full justify-center", class_name)}>
      <OrgNode node={tree} is_root />
    </div>
  );
}
