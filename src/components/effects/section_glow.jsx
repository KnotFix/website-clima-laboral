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
 * ## Sombra en claro, luz en oscuro, y una sola expresion
 *
 * `--glow` es siempre "el fondo movido hacia el color del texto". En tema claro
 * eso es un gris que **oscurece** el hueso; en oscuro es un casi blanco que
 * **aclara** el negro. La misma linea de CSS da sombra de un lado y luz del
 * otro, y las dos son modelado. Es la misma asimetria que la de los rayos: sobre
 * el hueso no hay recorrido hacia el blanco, asi que en claro se resta.
 */
export function SectionGlow({ side = "left", children }) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="section-glow pointer-events-none absolute inset-0 -z-10"
        // El centro de la elipse cae FUERA de la seccion a proposito: lo que
        // entra en cuadro es la caida del resplandor, no su nucleo. Con el
        // centro adentro se ve el punto y se lee como una mancha.
        style={{ "--glow-x": side === "right" ? "106%" : "-6%" }}
      />
      {children}
    </div>
  );
}
