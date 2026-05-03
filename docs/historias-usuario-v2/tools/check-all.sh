#!/usr/bin/env bash
# check-all.sh — orquesta todas las verificaciones del inventario v2.
# Devuelve código 0 si todo pasa, ≠ 0 si hay violación.
#
# Uso: bash docs/historias-usuario-v2/tools/check-all.sh

set +e

ROOT="/home/felix/projects/deep-opm-pro"
TOOLS="$ROOT/docs/historias-usuario-v2/tools"

cd "$ROOT"

echo "================================================"
echo "1. Linter (12 invariantes locales y globales)"
echo "================================================"
bun run "$TOOLS/validate-hu.ts"
LINT_RC=$?

echo ""
echo "================================================"
echo "2. Auditoría de migración v1 → v2"
echo "================================================"
bun run "$TOOLS/audit-migracion.ts"
AUDIT_RC=$?

echo ""
echo "================================================"
echo "3. Grafo de dependencias y métricas de centralidad"
echo "================================================"
bun run "$TOOLS/grafo-dependencias.ts"
GRAFO_RC=$?

echo ""
echo "================================================"
echo "Resumen final"
echo "================================================"
echo "  Linter:    rc=$LINT_RC"
echo "  Migración: rc=$AUDIT_RC"
echo "  Grafo:     rc=$GRAFO_RC"

if [[ $LINT_RC -eq 0 && $AUDIT_RC -eq 0 && $GRAFO_RC -eq 0 ]]; then
  echo "  Todo pasa"
  exit 0
else
  echo "  Alguna verificacion fallo"
  exit 1
fi
