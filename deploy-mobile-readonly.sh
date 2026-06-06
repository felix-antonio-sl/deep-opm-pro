#!/bin/bash
# deploy-mobile-readonly.sh — Script de deploy para activar mobile-readonly v1 en producción
# Uso: ./deploy-mobile-readonly.sh [ambiente]
# Requiere: acceso SSH al servidor, docker-compose.yml con VITE_MOBILE_READONLY=true

set -euo pipefail

AMBIENTE="${1:-produccion}"
FECHA=$(date +%Y%m%dT%H%M%S)
BACKUP_DIR="/opt/opforja/backups"
COMPOSE_DIR="/opt/opforja"

echo "=== Deploy mobile-readonly v1 — $AMBIENTE ==="
echo "Fecha: $FECHA"

# 1. Backup de seguridad
echo "[1/5] Backup de seguridad..."
mkdir -p "$BACKUP_DIR"
ssh opforja@opforja.sanixai.com "cd $COMPOSE_DIR && pg_dump -U opforja -d opforja | gzip > $BACKUP_DIR/opforja-$FECHA.sql.gz" || {
    echo "ERROR: Backup falló. Abortando."
    exit 1
}
echo "Backup: $BACKUP_DIR/opforja-$FECHA.sql.gz"

# 2. Pull de código
echo "[2/5] Pull de código..."
ssh opforja@opforja.sanixai.com "cd $COMPOSE_DIR && git pull origin main" || {
    echo "ERROR: Git pull falló. Abortando."
    exit 1
}

# 3. Verificar flag en compose
echo "[3/5] Verificar VITE_MOBILE_READONLY=true..."
ssh opforja@opforja.sanixai.com "cd $COMPOSE_DIR && grep 'VITE_MOBILE_READONLY.*true' docker-compose.yml" || {
    echo "ERROR: VITE_MOBILE_READONLY no está en true. Abortando."
    exit 1
}

# 4. Build y deploy
echo "[4/5] Build y deploy..."
ssh opforja@opforja.sanixai.com "cd $COMPOSE_DIR && docker compose up --build -d opforja" || {
    echo "ERROR: Docker build/deploy falló. Abortando."
    exit 1
}

# 5. Smoke test
echo "[5/5] Smoke test..."
sleep 5
BUNDLE=$(ssh opforja@opforja.sanixai.com "curl -s https://opforja.sanixai.com/ | grep -o 'assets/index-[A-Za-z0-9]*.js' | head -1")
if [ -n "$BUNDLE" ]; then
    echo "✓ Bundle servido: $BUNDLE"
    
    # Verificar que el bundle contiene MobileReadonlyApp
    if ssh opforja@opforja.sanixai.com "curl -s https://opforja.sanixai.com/$BUNDLE | grep -q 'MobileReadonlyApp'"; then
        echo "✓ MobileReadonlyApp encontrado en bundle"
    else
        echo "⚠ MobileReadonlyApp NO encontrado en bundle — verificar build"
    fi
    
    # Verificar deep link
    if ssh opforja@opforja.sanixai.com "curl -sI https://opforja.sanixai.com/m/test-modelo/opd/test-opd/vista/diagrama | grep -q '200 OK'"; then
        echo "✓ Deep link responde 200"
    else
        echo "⚠ Deep link no responde 200 — verificar routing"
    fi
else
    echo "ERROR: No se pudo verificar bundle."
    exit 1
fi

echo "=== Deploy completado ==="
echo "Validar manualmente:"
echo "1. Abrir https://opforja.sanixai.com en móvil (390x844)"
echo "2. Verificar que se muestra MobileReadonlyApp (4 tabs)"
echo "3. Probar búsqueda y navegación"
echo "4. Verificar que no se puede editar en mobile"
