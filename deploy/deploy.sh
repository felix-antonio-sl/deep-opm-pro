#!/usr/bin/env bash
# Circuito canónico: construir, esperar salud y comprobar la versión servida.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v curl >/dev/null || { echo "ERROR: curl es necesario" >&2; exit 1; }
SHA="$(git rev-parse --short HEAD)"
CAMBIOS="$(git status --porcelain --untracked-files=all)"
[ -z "$CAMBIOS" ] || { SHA="${SHA}-dirty"; echo "→ árbol con cambios: build ${SHA}"; }
URL="${OPFORJA_URL:-https://opforja.sanixai.com}"
URL="${URL%/}"
echo "→ desplegando opforja · build ${SHA}"
OPFORJA_BUILD="$SHA" docker compose up -d --build --wait --wait-timeout 120 --remove-orphans
echo "→ comprobando salud, acceso y versión"
SALUD="$(curl -fsS --retry 5 --retry-delay 2 --max-time 15 "$URL/salud")"
echo "$SALUD" | grep -Fq "\"version\":\"${SHA}\"" || { echo "ERROR: /salud no informa ${SHA}: ${SALUD}" >&2; exit 1; }
ESTADO="$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "$URL/api/sesion")"
[ "$ESTADO" = "401" ] || { echo "ERROR: se esperaba 401 sin sesión; recibido ${ESTADO}" >&2; exit 1; }
curl -fsS --max-time 15 "$URL/" | grep -Fq '<div id="app"' || { echo "ERROR: / no sirve la aplicación" >&2; exit 1; }
echo "✓ opforja ${SHA} disponible en ${URL}"
