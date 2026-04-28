#!/usr/bin/env bash
# setup.sh — regenera el material de ingenieria inversa de OPCloud (produccion).
#
# Descarga el bundle principal de opcloud.systems, lo decompila con webcrack,
# y descarga todos los assets publicos (SVGs, PNGs, config).
#
# Uso:
#   bash setup.sh
#
# Tiempo estimado: 2-3 minutos. Requisitos: bash, curl, npx (npm).

set -e
SCRIPT_DIR="$(cd "$(/usr/bin/dirname "$0")" && pwd)"

BASE_URL="https://opcloud.systems"
BUNDLE_HASH="a8737ee2a8ed30eb"
RUNTIME_HASH="fc52d5769e5144aa"
POLYFILLS_HASH="18d88e2014052aca"
SCRIPTS_HASH="8153de010e3d945e"
STYLES_HASH="5c39161930f899e1"

LOCAL="${SCRIPT_DIR}/_local/bundles"
DECOMP="${SCRIPT_DIR}/decompiled"

/usr/bin/mkdir -p "${LOCAL}" "${DECOMP}"

echo "==> OPCloud (produccion) — extraccion de material"
echo "    Fuente: ${BASE_URL}"
echo ""

# ── Bundles ──────────────────────────────────────────────────────────
echo "==> Descargando bundles..."

dl() {
  local name="$1" url="$2" out="$3"
  if [ ! -f "${out}" ]; then
    /usr/bin/curl -sL --max-time 120 -o "${out}" "${url}"
    echo "    ${name}: $(numfmt --to=iec "$(/usr/bin/stat -c%s "${out}")")"
  else
    echo "    ${name}: ya existe, skip"
  fi
}

dl "main.js"     "${BASE_URL}/main.${BUNDLE_HASH}.js"      "${LOCAL}/main.${BUNDLE_HASH}.js"
dl "runtime.js"  "${BASE_URL}/runtime.${RUNTIME_HASH}.js"   "${LOCAL}/runtime.${RUNTIME_HASH}.js"
dl "polyfills.js" "${BASE_URL}/polyfills.${POLYFILLS_HASH}.js" "${LOCAL}/polyfills.${POLYFILLS_HASH}.js"
dl "scripts.js"  "${BASE_URL}/scripts.${SCRIPTS_HASH}.js"   "${LOCAL}/scripts.${SCRIPTS_HASH}.js"
dl "styles.css"  "${BASE_URL}/styles.${STYLES_HASH}.css"    "${LOCAL}/styles.${STYLES_HASH}.css"

# ── Decompilacion ────────────────────────────────────────────────────
echo ""
echo "==> Decompilando con webcrack..."

if [ ! -f "${DECOMP}/bundle.json" ]; then
  npx --yes webcrack "${LOCAL}/main.${BUNDLE_HASH}.js" --output "${DECOMP}"
  echo "    modulos: $(/usr/bin/find "${DECOMP}" -name '*.js' | /usr/bin/wc -l)"
else
  echo "    ya decompilado, skip"
fi

# ── Assets SVG ───────────────────────────────────────────────────────
echo ""
echo "==> Descargando assets SVG..."

SVG_DIR="${SCRIPT_DIR}/assets/svg"
/usr/bin/mkdir -p "${SVG_DIR}"/{links/structural,links/procedural,list-logical,toolbar}

svg_ok=0 svg_fail=0

dl_svg() {
  local path="$1"
  local dir; dir=$(/usr/bin/dirname "${SVG_DIR}/${path}")
  /usr/bin/mkdir -p "${dir}"
  if /usr/bin/curl -sL --max-time 10 -o "${SVG_DIR}/${path}" "${BASE_URL}/assets/SVG/${path}" 2>/dev/null; then
    local sz; sz=$(/usr/bin/stat -c%s "${SVG_DIR}/${path}" 2>/dev/null || echo 0)
    if [ "${sz}" -gt 100 ]; then
      ((svg_ok++)) || true
      return 0
    fi
  fi
  /usr/bin/rm -f "${SVG_DIR}/${path}"
  ((svg_fail++)) || true
  return 1
}

for f in aggregation classification exhibition generalization; do
  dl_svg "links/structural/${f}.svg"
done

for link in agent instrument consumption effect; do
  for suffix in "" Condition Event Negation ConditionNegation; do
    dl_svg "links/procedural/${link}${suffix}.svg"
  done
done

for f in result invocation bidirectionalRelation unidirectionalRelation overtimeexception underOver underTime; do
  dl_svg "links/procedural/${f}.svg"
done

for f in currentState defaultState rangeState; do
  dl_svg "${f}.svg"
done

for f in object object-dashed objectDrag process process-dashed processDrag; do
  dl_svg "${f}.svg"
done

for f in addConnected addStates autosave computation delete deleteFunction \
  editAlias editUnits example ExpressHalo folder greenIndicator inzoom \
  lock regFile sharedFolder sim styleElement supressHalo template \
  timeDuration unfold updateComputationalProcess verFile \
  newLogo logoPic regFileStereotypeG regFileStereotypeNonG; do
  dl_svg "${f}.svg"
done

for f in object objectDashed process processDashed; do
  dl_svg "list-logical/${f}.svg"
done

dl_svg "toolbar/modelWizard.svg"

echo "    SVGs: ${svg_ok} ok, ${svg_fail} fail"

# ── Assets PNG ───────────────────────────────────────────────────────
echo ""
echo "==> Descargando assets PNG..."

PNG_DIR="${SCRIPT_DIR}/assets/png"
/usr/bin/mkdir -p "${PNG_DIR}"/{icons,modelWizard}

png_ok=0 png_fail=0

dl_png() {
  local path="$1"
  local dir; dir=$(/usr/bin/dirname "${PNG_DIR}/${path}")
  /usr/bin/mkdir -p "${dir}"
  if /usr/bin/curl -sL --max-time 10 -o "${PNG_DIR}/${path}" "${BASE_URL}/assets/${path}" 2>/dev/null; then
    local sz; sz=$(/usr/bin/stat -c%s "${PNG_DIR}/${path}" 2>/dev/null || echo 0)
    if [ "${sz}" -gt 100 ]; then
      ((png_ok++)) || true
      return 0
    fi
  fi
  /usr/bin/rm -f "${PNG_DIR}/${path}"
  ((png_fail++)) || true
  return 1
}

for f in key-icon pin token-icon; do
  dl_png "icons/${f}.png"
done

for f in page10.1 page10.2 page10.3 page11 page2 page3 page5 page7; do
  dl_png "modelWizard/${f}.png"
done

dl_png "SVG/redx.png"

echo "    PNGs: ${png_ok} ok, ${png_fail} fail"

# ── Config & root ────────────────────────────────────────────────────
echo ""
echo "==> Descargando config & root assets..."

/usr/bin/mkdir -p "${SCRIPT_DIR}/config"
/usr/bin/curl -sL --max-time 10 -o "${SCRIPT_DIR}/config/edx.config.json" "${BASE_URL}/assets/config/edx.config.json" 2>/dev/null || true
/usr/bin/curl -sL --max-time 10 -o "${SCRIPT_DIR}/index.html" "${BASE_URL}/" 2>/dev/null || true
/usr/bin/curl -sL --max-time 10 -o "${SCRIPT_DIR}/favicon.ico" "${BASE_URL}/favicon_new.ico" 2>/dev/null || true

# ── Resumen ──────────────────────────────────────────────────────────
echo ""
echo "==> DONE."
echo "    decompiled/ : $(/usr/bin/find "${DECOMP}" -name '*.js' | /usr/bin/wc -l) modulos webpack"
echo "    svg/        : $(/usr/bin/find "${SVG_DIR}" -name '*.svg' -size +100c | /usr/bin/wc -l) SVGs"
echo "    assets-png/ : $(/usr/bin/find "${PNG_DIR}" -name '*.png' -size +100c | /usr/bin/wc -l) PNGs"
echo "    _local/     : $(/usr/bin/du -sh "${LOCAL}" | /usr/bin/cut -f1) bundles originales"
echo "    config/     : firebase.json, routes.json, edx.config.json"
echo ""
echo "Total decompilado: $(/usr/bin/du -sh "${DECOMP}" | /usr/bin/cut -f1)"
echo "Total svg:         $(/usr/bin/du -sh "${SVG_DIR}" | /usr/bin/cut -f1)"
echo "Total png:         $(/usr/bin/du -sh "${PNG_DIR}" | /usr/bin/cut -f1)"
