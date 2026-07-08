#!/usr/bin/env bash
# Deploy canónico de opforja.
#
# Estampa la VERSIÓN VISIBLE EN LA UI (footer de «Ayuda › Atajos») de forma
# fiable: la fecha de build la computa vite sola, pero el short SHA del commit
# viaja por el arg `OPFORJA_BUILD` — y un `docker compose up -d --build` a secas
# lo dejaría en "local". Este script lo deriva de git en cada deploy, así que la
# versión de la UI siempre refleja el commit realmente desplegado, sin recordar
# nada. Si el árbol tiene cambios sin commitear, marca el build como `-dirty`
# (honestidad: la UI declara que salió de un estado no versionado).
set -euo pipefail
cd "$(dirname "$0")/.."   # raíz del repo

SHA="$(git rev-parse --short HEAD)"
if [ -n "$(git status --porcelain)" ]; then
  SHA="${SHA}-dirty"
  echo "⚠  árbol con cambios sin commitear → build marcado ${SHA}"
fi
FECHA="$(date +%Y-%m-%d)"

echo "→ desplegando opforja · ${FECHA} · build ${SHA}"
OPFORJA_BUILD="${SHA}" docker compose up -d --build

echo "→ esperando salud de los contenedores…"
sleep 6
docker compose ps --format '{{.Name}}\t{{.Status}}' | grep opforja || true

# Confirmación best-effort (no fatal): el SHA quedó horneado en el bundle servido.
if command -v curl >/dev/null 2>&1; then
  set +e
  for js in $(curl -fsS --max-time 15 https://opforja.sanixai.com/ 2>/dev/null | grep -oE '/assets/[A-Za-z0-9._-]+\.js'); do
    if curl -fsS --max-time 15 "https://opforja.sanixai.com${js}" 2>/dev/null | grep -q "${SHA}"; then
      echo "✓ versión ${SHA} confirmada en el bundle servido"
      break
    fi
  done
  set -e
fi

echo "→ verifica en la app: Ayuda › Atajos (footer) muestra «opforja · ${FECHA}», tooltip build ${SHA}"
