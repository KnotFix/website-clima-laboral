/**
 * Envuelve una seccion y le da una direccion de luz: un resplandor grande y
 * suave anclado a uno de sus dos costados.
 *
 * Es lo que le falta a la mitad de abajo de la pagina. La luz de canvas vive
 * arriba y se entrega al pie del hero, asi que de la seccion del planeta para
 * abajo el fondo no tiene de donde venir: es un relleno parejo de punta a punta
 * y por eso se lee plano. Esto no trae una luz nueva —seria otra cosa
 * compitiendo—, trae **modelado**: un lado de la seccion mas cargado que el
 * otro, que es lo minimo que hace falta para que una superficie tenga volumen.
 *
 * El costado ALTERNA seccion a seccion. Un solo lado repetido cinco veces
 * vuelve a ser un patron parejo, que es el problema del que se sale.
 *
 * ## Por que es un envoltorio y no una capa suelta
 *
 * Porque el apilado es facil de romper y esto lo deja resuelto de una: el
 * resplandor va en `-z-10` y el envoltorio en `isolate`. Sin el `isolate`, un
 * `-z-10` se escapa hacia arriba hasta el primer contexto de apilado que
 * encuentre —que aca seria el `<body>`— y el resplandor terminaria **detras del
 * fondo de la pagina**, o sea invisible. Con el, queda encerrado: primero el
 * fondo del envoltorio (la banda, si la hay), despues el resplandor, despues el
 * contenido de la seccion.
 *
 * La alternativa era el trato del hero —capa absoluta sin `z-index` y contenido
 * en `relative`— pero eso obliga a tocar el `Container` de cada seccion y a
 * acordarse cada vez. Aca no hay nada que acordarse.
 *
 * ## El color sale de la atmosfera, y depende de DONDE esta la seccion
 *
 * `--glow` era "el fondo movido hacia el color del texto" —un gris que restaba
 * en claro y sumaba en oscuro—. Hoy sale de mezclar los dos extremos de la
 * atmosfera (`--atmo-start` y `--atmo-end`), y `tint` es la posicion de esta
 * seccion en ese recorrido: 0 arriba de todo, 1 al pie de la pagina.
 *
 * Con eso los lobulos van en el mismo recorrido que las manchas de
 * `<AtmosphereField>`: los de arriba tiran al naranja claro, los de abajo al
 * hondo. **Es lo que los ata entre si** — sin el tinte serian cinco manchas del
 * mismo color puestas a los costados.
 *
 * Antes tambien acompañaban a un degradado que cubria el `body` entero; ese se
 * retiro para que el naranja fueran manchas y no un lavado. El `tint` no
 * dependia de el y sigue igual.
 *
 * `tint` se publica al CSS ya convertido a porcentaje. Se hace la cuenta aca y
 * no en `calc()` adentro del `color-mix` porque un numero sin unidad
 * multiplicado por `100%` dentro de una funcion de color es justo el terreno
 * donde los navegadores se portan distinto.
 *
 * ## Sangra en vertical, y esa es toda la conexion
 *
 * El resplandor NO se recorta al alto de su seccion: se pasa un 18% arriba y
 * abajo para que el lobulo de una se superponga con el de la vecina. Como los
 * costados alternan, lo que se ve en el solape es una banda que cruza de un
 * lado al otro — la seccion no termina, se entrega.
 *
 * Puede sangrar porque el envoltorio es `relative isolate` **sin**
 * `overflow-hidden`. Si algun dia se le agrega, la conexion se corta y vuelven
 * las cinco manchas sueltas.
 */
export function SectionGlow({ side = "left", tint = 0, children }) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="section-glow pointer-events-none absolute -inset-y-[18%] inset-x-0 -z-10"
        style={{
          // El centro de la elipse cae FUERA de la seccion a proposito: lo que
          // entra en cuadro es la caida del resplandor, no su nucleo. Con el
          // centro adentro se ve el punto y se lee como una mancha.
          "--glow-x": side === "right" ? "106%" : "-6%",
          "--atmo-mix": `${Math.round(tint * 100)}%`,
        }}
      />
      {children}
    </div>
  );
}
