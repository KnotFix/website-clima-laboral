# Imagen del SITIO público (Next.js) para staging/producción.
#
# Contexto de build: `website-clima-laboral/`.
#
# Es el tercer despliegue, junto al backend (Django) y al front del producto
# (React + Vite), y sigue la misma forma que aquellos: Node compila y una imagen
# final mínima sirve. A diferencia del producto, acá la imagen final SÍ lleva
# Node: el sitio no es estático puro. `src/proxy.js` decide `/` → `/es` o `/en`
# leyendo `Accept-Language` en cada request, y eso solo corre en un servidor.
# Por eso no hay etapa nginx: la salida es `next start`.
#
# `output: "standalone"` (en `next.config.mjs`) es lo que hace chica la imagen:
# Next traza qué archivos de `node_modules` usa el servidor de verdad y deja un
# `server.js` autocontenido. La imagen final no corre `npm` ni ve el
# `package.json`: solo `node server.js`.

# ─── Etapa 1: build ──────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# ⚠️ Se resuelve AL COMPILAR y queda escrita dentro del JS. No es configuración
# de runtime: cambiarla exige reconstruir la imagen, no reiniciar el contenedor.
# En Dokploy va en "Build Args" (Environment se inyecta al contenedor ya
# construido y llega tarde). Es la base del PRODUCTO, a donde mandan todos los
# «Empezar» (`${APP_URL}/`); tiene default en `lib/site_config.js`
# (`https://app.censuma.com`), así que es OPCIONAL: un enlace que apunta a
# producción no puede impedir que staging arranque.
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# El código de verificación de Google Search Console (`<meta
# name="google-site-verification">`). OPCIONAL y también de build: vacío, la
# etiqueta no se emite. Solo hace falta si el dominio se verifica por etiqueta
# HTML; verificarlo por DNS no necesita nada de acá.
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ENV NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

# Apaga la telemetría de Next en el build: no hay nada que reportar desde un
# servidor de CI.
ENV NEXT_TELEMETRY_DISABLED=1

# `npm ci` (no `install`): respeta el lockfile al pie de la letra, así el build
# del servidor instala exactamente lo mismo que probaste local.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Etapa 2: servir ─────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Usuario sin privilegios, como el `django` del backend: el proceso que atiende
# la red no corre como root.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Tres piezas, y las tres hacen falta:
#   standalone/  el servidor y el recorte de node_modules que traza Next
#   static/      el JS/CSS compilado con hash — standalone NO lo incluye
#   public/      capturas, clips, favicon — tampoco lo incluye
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
