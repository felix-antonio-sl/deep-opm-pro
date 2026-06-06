# syntax=docker/dockerfile:1.7

# -----------------------------------------------------------------------------
# Stage 1 - deps: instala dependencias Bun de la app Vite.
# -----------------------------------------------------------------------------
FROM oven/bun:1.3.10-slim AS deps
WORKDIR /workspace/app

COPY app/package.json app/bun.lock ./
RUN bun install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2 - builder: compila el bundle estatico.
# -----------------------------------------------------------------------------
FROM oven/bun:1.3.10-slim AS builder
WORKDIR /workspace

ARG VITE_ENABLE_BUG_CAPTURE=false
ENV VITE_ENABLE_BUG_CAPTURE=${VITE_ENABLE_BUG_CAPTURE}
ARG VITE_MOBILE_READONLY=false
ENV VITE_MOBILE_READONLY=${VITE_MOBILE_READONLY}

COPY --from=deps /workspace/app/node_modules ./app/node_modules
COPY app ./app
COPY assets ./assets

WORKDIR /workspace/app
RUN bun run build

# -----------------------------------------------------------------------------
# Stage opcional - bug-capture: API interna para persistir reportes dev/ops.
# -----------------------------------------------------------------------------
FROM oven/bun:1.3.10-slim AS bug-capture
WORKDIR /workspace

COPY app/src/server ./app/src/server
COPY app/scripts/bug-capture-api.ts ./app/scripts/bug-capture-api.ts

EXPOSE 3000

CMD ["bun", "run", "./app/scripts/bug-capture-api.ts"]

# -----------------------------------------------------------------------------
# Stage opcional - model-api: API interna para persistir modelos en Postgres.
# -----------------------------------------------------------------------------
FROM oven/bun:1.3.10-slim AS model-api
WORKDIR /workspace

COPY app/src/server ./app/src/server
COPY app/src/persistencia ./app/src/persistencia
COPY app/src/modelo/tipos ./app/src/modelo/tipos
COPY app/scripts/model-persistence-api.ts ./app/scripts/model-persistence-api.ts

EXPOSE 3001

CMD ["bun", "run", "./app/scripts/model-persistence-api.ts"]

# -----------------------------------------------------------------------------
# Stage 3 - runner: Nginx sirve la SPA estatica con fallback a index.html.
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
