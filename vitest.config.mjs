import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // El mismo alias que `jsconfig.json`. Se escribe a mano porque el
      // proyecto no tiene `tsconfig.json`, asi que los plugins que leen
      // `compilerOptions.paths` no tienen de donde sacarlo.
      "@": path.resolve(root, "src"),

      // `server-only` existe para REVENTAR fuera del servidor: es su unico
      // trabajo. Lo importan `lib/docs.js`, `lib/legal.js`, `lib/changelog.js`
      // y `lib/dictionaries.js`, y en Vitest —que no es el runtime de Next—
      // eso tumbaria cualquier test que los toque. Se apunta a un modulo vacio.
      //
      // No debilita nada: el guard sigue puesto para el bundler, que es quien
      // de verdad puede meter estos modulos en un componente de cliente.
      "server-only": path.resolve(root, "test/stubs/server_only.js"),
    },
  },
  test: {
    // Todo lo que se prueba es logica pura y lectura de archivos: no hay un
    // solo test de componente, asi que no hace falta jsdom ni su arranque.
    environment: "node",
    include: ["test/**/*.test.js"],
  },
});
