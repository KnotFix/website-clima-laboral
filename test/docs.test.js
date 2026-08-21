import GithubSlugger from "github-slugger";
import { describe, expect, it } from "vitest";

import { flatten_nav } from "@/content/docs/nav";
import { headings_of, is_doc_slug } from "@/lib/docs";
import { LOCALES } from "@/lib/site_config";

describe("is_doc_slug", () => {
  it("acepta lo que esta en el nav y rechaza lo demas", () => {
    expect(is_doc_slug(flatten_nav()[0].slug)).toBe(true);
    expect(is_doc_slug("pagina-inventada")).toBe(false);
    expect(is_doc_slug("")).toBe(false);
  });
});

describe("headings_of", () => {
  it("devuelve vacio para un slug que no existe", () => {
    // No revienta: la ruta ya devolvio 404 antes de llegar aca, y el indice
    // lateral se dibuja vacio en vez de tumbar la pagina.
    expect(headings_of("es", "pagina-inventada")).resolves.toEqual([]);
  });

  it("saca los backticks pero deja el guion bajo de un identificador", async () => {
    // `### Por qué \`escala_3\` va con números`.
    //
    // Los dos lados de esto fueron un bug: los backticks hay que sacarlos
    // —`rehype-slug` slugifica el texto YA renderizado, donde no estan— y el
    // guion bajo hay que DEJARLO, porque ahi sigue estando. Borrandolo, el
    // indice apuntaba a `escala3` y el ancla de la pagina decia `escala_3`.
    //
    // **Los ids esperados estan verificados contra el HTML construido**, no
    // deducidos: `.next/server/app/en/docs/question-types.html` trae
    // `id="why-escala_3-uses-numbers"`.
    const casos = [
      ["es", "por-qué-escala_3-va-con-números"],
      ["en", "why-escala_3-uses-numbers"],
    ];

    for (const [locale, id_esperado] of casos) {
      const headings = await headings_of(locale, "question-types");
      const con_identificador = headings.find((h) => h.id === id_esperado);

      expect(con_identificador, `${locale}: falta ${id_esperado}`).toBeDefined();
      expect(con_identificador.text).not.toContain("`");
      expect(con_identificador.text).toContain("escala_3");
    }
  });

  it("solo devuelve h2 y h3", async () => {
    // El h1 lo pone la ruta, no el .mdx: si apareciera uno aca, el indice
    // tendria dos titulos de pagina.
    const headings = await headings_of("es", "roster-format");
    expect(headings.length).toBeGreaterThan(0);
    for (const h of headings) expect([2, 3]).toContain(h.level);
  });

  /**
   * **La invariante que el propio `lib/docs.js` marca como fallo silencioso.**
   *
   * El `href` del indice lateral lo calcula `github-slugger` desde el archivo
   * crudo; el `id` que termina en el HTML lo pone `rehype-slug`, que usa el
   * MISMO slugger por dentro. Si los dos se separan, el indice se sigue
   * dibujando entero y deja de saltar a ningun lado — no hay error, no hay
   * pagina rota, solo enlaces que no hacen nada.
   *
   * Se corre sobre las 42 paginas (21 × 2 idiomas) porque el riesgo esta en el
   * texto: un encabezado con un caracter raro es justo donde dos slugificadores
   * se separan.
   */
  it("los ids son los que produce github-slugger, en todas las paginas", async () => {
    const desajustes = [];

    for (const locale of LOCALES) {
      for (const entry of flatten_nav()) {
        const headings = await headings_of(locale, entry.slug);
        // Un slugger nuevo por pagina: lleva estado para desambiguar
        // encabezados repetidos (`titulo`, `titulo-1`), igual que rehype-slug,
        // que arranca de cero en cada documento.
        const slugger = new GithubSlugger();

        for (const h of headings) {
          const esperado = slugger.slug(h.text);
          if (h.id !== esperado) {
            desajustes.push(
              `${locale}/${entry.slug}: "${h.text}" -> ${h.id} (esperado ${esperado})`,
            );
          }
          if (!h.id || !h.text) {
            desajustes.push(`${locale}/${entry.slug}: encabezado vacio`);
          }
        }
      }
    }

    expect(desajustes).toEqual([]);
  });
});
