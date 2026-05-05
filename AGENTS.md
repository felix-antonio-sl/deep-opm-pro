# AGENTS.md

- Este repo pasa de ingenieria inversa de OPCloud a desarrollo de software basado en esos insumos; trata `assets/`, `config/`, `catalog/`, `fixtures/`, `docs/JOYAS.md` y `docs/HANDOFF.md` como referencias verificadas para construir, no como una app ya existente.
- La meta inmediata es desarrollar el modelador OPM en `app/` basado en `docs/historias-usuario-v2/`, inspirado en OPCloud pero con arquitectura propia.
- Autoridad normativa: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es` (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`); OPCloud operacionaliza OPM pero no redefine la semantica.
- **Principio rector de desarrollo:** antes de generar cualquier solucion de novo, verifica primero que existe en los insumos de ingenieria inversa, en este orden:
  1. `assets/svg/` (73 SVGs canonicos — no redibujar marcadores, iconos ni shapes). Para enlaces, usar siempre `assets/svg/links/procedural/` y `assets/svg/links/structural/` como fuente canonica de markers — copia trazable en `opm-extracted/assets/svg/`
  2. `assets/png/` (11 PNGs de UI) — copia trazable en `opm-extracted/assets/png/`
  3. `docs/JOYAS.md` (colores #70E483/#3BC3FF/#586D8C, dimensiones 135x60, tipografia Arial 14px semibold, patron wrapper+line 15px/2px, markers, routing, puertos, OPL)
  4. **`opm-extracted/`** (349 archivos OPM legibles + INDEX.md de 486 clases + MODULES.md + assets/INDEX.md). **Es la forma preferente de consultar la logica OPCloud**: ya esta refactorizado, indexado y trazable. Versionado.
  5. `decompiled/` (810 modulos webpack, 91 MB, gitignored, regenerable y no conservado por defecto) — usar solo si `opm-extracted/` no cubre algo; regenerar con `bash setup.sh` antes de consultarlo.
  6. `fixtures/` (7 grupos con modelos reales — cells JSON + OPL + screenshots como fixtures y validacion)
  7. `catalog/` (376 clases + mapeo modulo→clase) — superado por `opm-extracted/INDEX.md`, mantener como referencia historica.
  8. `config/` (rutas, Firebase, assets — como referencia de superficie funcional, no a copiar arquitectura)
  9. La arquitectura final puede diferir (no Firebase, no Angular), pero SVGs, dimensiones, colores, tipografia, plantillas OPL y reglas de consistency se reutilizan directamente.
- Considera `docs/archive/si-partiese-desde-0.md` antes de modificar historias: el desarrollo previo se hizo sin estos insumos de ingenieria inversa y contiene decisiones/deuda que no deben arrastrarse automaticamente.
- Las HU existentes nacieron desde `opcloud-reverse` y una metodologia 1:1; al revisarlas, rebasalas contra SSOT OPM + evidencia OPCloud nueva + lecciones del archivo `si-partiese-desde-0.md`.
- `docs/historias-usuario-v2/` es el backlog completo local vivo; `docs/roadmap/` define el corte operativo activo. No arrastres las 1.117 HU canónicas a cada cambio: trabaja contra Sprint 0/MVP-alpha y consulta HU puntuales.
- **Auditoria de avance HU v2**: `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` escanea `app/src`, `app/e2e`, `app/scripts` y `assets/svg/links`, actualiza `docs/roadmap/hu-progress-evidence.json` (`autoEntries`) y regenera `docs/roadmap/hu-progress.{html,md,json}`. Sin `--sync-real` solo regenera reportes desde el ledger vigente.
- **Workspace de aplicacion**: `app/` con Bun + Vite + Preact + JointJS (MPL 2.0) + Zustand. Comandos reales:
  - `cd app && bun run dev` — dev server con HMR en localhost:5173
  - `cd app && bun run build` — build produccion a `app/dist/`
  - `cd app && bun run typecheck` — `tsc --noEmit` estricto
  - `cd app && bun run test` — unit tests con Bun sobre `src/`
  - `cd app && bun run browser:smoke` — smoke Playwright contra navegador Chromium
  - `cd app && bun run check` — typecheck + test
- Stack: Bun 1.3+, TypeScript strict, JointJS 3.7 core (sin Rappid), Preact 10 + Signals, Zustand 5, Vite 6, Playwright para evaluacion browser.
- Lee `docs/HANDOFF.md` primero para estado, bloqueantes y pendientes; `docs/JOYAS.md` para hallazgos tecnicos validados; `docs/PROCEDIMIENTO.md` solo cuando necesites regenerar material extraido.
- **Handoff unico del proyecto**: `docs/HANDOFF.md` es la unica memoria de traspaso vigente. No crear handoffs paralelos, fechados ni duplicados. Cuando se genere un handoff nuevo, debe reemplazar y consolidar el contenido previo dentro de `docs/HANDOFF.md`.
- **Repo liviano por defecto**: no conservar en el workspace artefactos regenerables o efimeros (`_local/`, `decompiled/`, `app/dist/`, `app/test-results/`, `.claude/`). Las salidas visuales se regeneran bajo demanda y quedan ignoradas; no versionar reportes/capturas de prueba.
- `bash setup.sh` es el unico comando de regeneracion; requiere `bash`, `curl` y `npx`/npm, descarga bundles de produccion, ejecuta `webcrack` y repuebla `decompiled/`, `_local/bundles/`, assets publicos, `webroot/index.html`, `webroot/favicon.ico` y `config/edx.config.json`.
- No versionar ni usar como codigo fuente directo `decompiled/` o `_local/`; son material grande, gitignored, de OPCloud y regenerable.
- **`opm-extracted/` SI se versiona**: es el derivado curado y trazable (~8 MiB, 349 archivos OPM legibles + 84 assets + 3 indices). Reemplaza `decompiled/` como referencia de lectura. Regenerable idempotentemente con `node opm-extracted/tools/{extract,refactor,build-index}.mjs`. **No copiar bloques 1:1 a `app/`**: el stack diverge (Preact != Angular, Zustand != Firebase, JointJS core != Rappid); `opm-extracted/` se usa para entender semantica OPM, no para clonar.
- `setup.sh` hardcodea hashes de bundles como `main.a8737ee2a8ed30eb.js`; si OPCloud cambia deploy, actualiza esos hashes antes de regenerar.
- `config/firebase.json`, `config/routes.json` y `config/assets.json` son hechos curados extraidos; no asumas que `setup.sh` los refresca completos.
- `fixtures/` es data observacional versionada del sandbox demo organizada por modelo; usala para inferir modelos, UI y OPL, no como fuente productiva completa.
- Produccion sigue bloqueada por auth: no hay cuenta, HAR autenticado, schema Firestore, formato export ni backend code.
- Para rastrear clases o comportamientos OPCloud, primero busca en `opm-extracted/INDEX.md` (486 clases mapeadas a archivo), o `rg "class AggregationLink" opm-extracted/src/`. Si la clase no aparece (caso muy raro), regenera `decompiled/` con `bash setup.sh` y busca alli con `rg`.
- Cuando agregues software nuevo, mantenlo separado del material extraido/generado y actualiza este archivo con comandos reales de build, test y ejecucion apenas existan.
