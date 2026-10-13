import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fill } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * Las tarjetas de planes, ya armadas por `pricing_cards()`.
 *
 * Server Component sin una linea de JavaScript en el navegador: no hay nada que
 * alternar (el producto vende UN solo periodo, el año adelantado, asi que no
 * hay selector mensual/anual que poner) y una pagina que se indexa tiene que
 * tener el precio en el HTML, no pintarlo despues.
 *
 * **Grilla y no fila flex**, por lo mismo que la tabla de la app: con
 * `flex-wrap` las tarjetas de la fila de abajo median distinto que las de
 * arriba. En grid las columnas son iguales por definicion y cada tarjeta se
 * estira al alto de su fila, asi que los botones quedan alineados abajo aunque
 * una tenga cuatro viñetas y otra siete.
 *
 * El destacado no es morado: el morado del sitio es el acento del CTA, y una
 * tarjeta entera teñida competiria con su propio boton. Se marca con un borde
 * en tinta y el badge; el boton primario (el unico morado de la grilla) es el
 * de esa tarjeta.
 */
export function PricingGrid({ cards, dict }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <li
          key={card.id}
          className={cn(
            "flex min-w-0 flex-col rounded-xl border bg-card p-5 text-card-foreground",
            card.featured ? "border-foreground/40 shadow-lg" : "border-border",
          )}
        >
          {/* El nombre y el badge en una FILA que se parte: con la tarjeta a
              ~210px los dos rotulos no siempre entran en un renglon, y uno
              encima del otro se leen; superpuestos, no. */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight">{card.title}</h2>
            {card.badge ? (
              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">
                {card.badge}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-muted-foreground text-pretty">{card.description}</p>

          {/* El precio que se cobra arriba y grande; el «por persona» debajo y
              en chico. Es la cifra con la que se comparan dos planes, pero no
              puede competir en peso con el importe real. */}
          <div className="mt-6">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">{card.price}</p>
            {card.period ? (
              <p className="mt-1 text-sm text-muted-foreground">{card.period}</p>
            ) : null}
            {card.per_person ? (
              <p className="mt-1 text-xs text-muted-foreground">{card.per_person}</p>
            ) : null}
          </div>

          <hr className="my-5 border-border" />

          <ul className="flex-1 space-y-3 text-sm">
            {card.features.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span className="text-foreground/90">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            variant={card.featured ? "default" : "outline"}
            className="mt-6 w-full"
          >
            <a
              href={card.href}
              aria-label={fill(dict.pricing_card_label, {
                action: card.button,
                plan: card.title,
              })}
              data-track={`pricing_${card.id}`}
              data-track-location="pricing"
            >
              {card.button}
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}
