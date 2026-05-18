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

COPY --from=deps /workspace/app/node_modules ./app/node_modules
COPY app ./app
COPY assets ./assets

WORKDIR /workspace/app
RUN bun run build

# -----------------------------------------------------------------------------
# Stage 3 - runner: Nginx sirve la SPA estatica con fallback a index.html.
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
