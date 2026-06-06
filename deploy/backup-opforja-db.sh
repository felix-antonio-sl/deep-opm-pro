#!/usr/bin/env bash
# Backup diario de la DB de opforja (blindaje 2026-06-06, auditoría persistencia crítico #3).
#
# pg_dump vía docker exec contra el contenedor opforja-postgres, comprimido, con
# retención de 14 días. Corre como systemd user timer (opforja-db-backup.timer,
# diario 03:30 America/Santiago — antes del cleanup de sesiones de las 04:00).
#
# Instalación (una vez):
#   cp deploy/systemd/opforja-db-backup.{service,timer} ~/.config/systemd/user/
#   systemctl --user daemon-reload && systemctl --user enable --now opforja-db-backup.timer
#
# Restauración:
#   gunzip -c ~/backups/opforja/opforja-<stamp>.sql.gz | docker exec -i opforja-postgres psql -U opforja -d opforja
set -euo pipefail

DIR="${OPFORJA_BACKUP_DIR:-$HOME/backups/opforja}"
RETENCION_DIAS="${OPFORJA_BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%dT%H%M%S)"
DEST="$DIR/opforja-$STAMP.sql.gz"

mkdir -p "$DIR"

# Dump lógico completo (schema + datos). --clean para restauración idempotente.
docker exec opforja-postgres pg_dump -U opforja -d opforja --clean --if-exists | gzip > "$DEST.tmp"
mv "$DEST.tmp" "$DEST"

# Sanidad mínima: el dump no puede estar vacío.
if [ ! -s "$DEST" ]; then
  echo "ERROR: dump vacío en $DEST" >&2
  exit 1
fi

# Retención: borra dumps más viejos que N días.
find "$DIR" -name 'opforja-*.sql.gz' -mtime "+$RETENCION_DIAS" -delete

echo "backup ok: $DEST ($(du -h "$DEST" | cut -f1)) · retención ${RETENCION_DIAS}d · $(ls "$DIR" | wc -l) dumps"
