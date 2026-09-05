#!/usr/bin/env bash
# Circuito canónico: construir, esperar salud y comprobar la versión servida.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v curl >/dev/null 2>&1 || { echo "ERROR: curl es necesario para verificar el despliegue" >&2; exit 1; }
SHA="$(git rev-parse --short HEAD)"
# Los reportes nuevos son salida runtime y .dockerignore los excluye del build.
CAMBIOS_BUILD="$(git status --porcelain --untracked-files=all | grep -vE '^\?\? docs/bugs/' || true)"
if [ -n "$CAMBIOS_BUILD" ]; then
  SHA="${SHA}-dirty"
  echo "→ árbol con cambios sin commitear: build ${SHA}"
fi
URL="${OPFORJA_URL:-https://opforja.sanixai.com}"
URL="${URL%/}"
VERIFY_DIR="$(mktemp -d)"
trap 'rm -rf "$VERIFY_DIR"' EXIT

echo "→ materializando corpus local del tutor desde fuentes vivas"
bun run --cwd app tutor:corpus

echo "→ desplegando opforja · build ${SHA}"
OPFORJA_BUILD="$SHA" docker compose up -d --build --wait --wait-timeout 120

echo "→ comprobando acceso y versión servida"
curl -fsS --retry 3 --retry-delay 2 --max-time 15 "$URL/healthz" -o "$VERIFY_DIR/health"
curl -fsS --retry 3 --retry-delay 2 --max-time 15 "$URL/" -o "$VERIFY_DIR/index"
SESSION_STATUS="$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "$URL/__deep-opm/session")"
if [ "$SESSION_STATUS" != "401" ]; then
  echo "ERROR: se esperaba 401 sin sesión; recibido ${SESSION_STATUS}" >&2
  exit 1
fi

CONFIRMED=false
while IFS= read -r asset; do
  curl -fsS --max-time 15 "$URL$asset" -o "$VERIFY_DIR/bundle"
  if grep -Fq "\"${SHA}\"" "$VERIFY_DIR/bundle"; then
    CONFIRMED=true
    break
  fi
done < <(grep -oE '/assets/[A-Za-z0-9._-]+\.js' "$VERIFY_DIR/index" | sort -u)

if [ "$CONFIRMED" != true ]; then
  echo "ERROR: el sitio no sirve el build esperado ${SHA}" >&2
  exit 1
fi

echo "✓ contenedores disponibles, acceso verificado y build ${SHA} confirmado en ${URL}"
