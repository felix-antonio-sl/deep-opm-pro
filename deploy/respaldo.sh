#!/usr/bin/env bash
# Copia de archivos vivos: no constituye un snapshot global entre archivos.
set -euo pipefail
umask 077
REPO="${OPFORJA_REPO:-$(cd "$(dirname "$0")/.." && pwd)}"
DESTINO="${OPFORJA_RESPALDOS:-$REPO/respaldos}"
mkdir -p -- "$DESTINO"
chmod 700 -- "$DESTINO"
DESTINO="$(cd -- "$DESTINO" && pwd)"
FECHA="$(date +%F)"
TEMPORAL="$(mktemp "$DESTINO/.opforja-$FECHA.XXXXXX.tgz")"
trap 'rm -f -- "$TEMPORAL"' EXIT
# Temporal privado en el mismo directorio; solo se publica después de tar completo.
docker run --rm -v opforja-datos:/datos:ro -v "$DESTINO":/respaldo alpine tar czf "/respaldo/${TEMPORAL##*/}" -C /datos .
chmod 600 -- "$TEMPORAL"
mv -fT -- "$TEMPORAL" "$DESTINO/opforja-$FECHA.tgz"
# Resolución de un segundo: conservar la frontera exacta y retirar solo >14 días.
AHORA="$(date +%s)"
find "$DESTINO" -maxdepth 1 -type f -name 'opforja-[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].tgz' -print0 |
  while IFS= read -r -d '' ARCHIVO; do
    MODIFICADO="$(stat -c %Y -- "$ARCHIVO")"
    if (( AHORA - MODIFICADO > 14 * 24 * 60 * 60 )); then
      rm -f -- "$ARCHIVO"
    fi
  done
echo "✓ respaldo escrito: $DESTINO/opforja-$FECHA.tgz"
