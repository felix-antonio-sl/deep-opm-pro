# AGENTS.md

- Este repo pasa de ingenieria inversa de OPCloud a desarrollo de software basado en esos insumos; trata `assets/`, `config/`, `catalog/`, `fixtures/`, `docs/JOYAS.md` y `docs/HANDOFF.md` como referencias verificadas para construir, no como una app ya existente.
- La meta inmediata es desarrollar/revisar `/home/felix/projects/opm-model-app/docs/historias-usuario`, no clonar OPCloud con fidelidad 100%.
- Autoridad normativa: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es` (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`); OPCloud operacionaliza OPM pero no redefine la semantica.
- **Principio rector de desarrollo:** antes de generar cualquier solucion de novo, verifica primero que existe en los insumos de ingenieria inversa, en este orden:
  1. `assets/svg/` (73 SVGs canonicos — no redibujar marcadores, iconos ni shapes)
  2. `assets/png/` (11 PNGs de UI)
  3. `docs/JOYAS.md` (colores #70E483/#3BC3FF/#586D8C, dimensiones 135x60, tipografia Arial 14px semibold, patron wrapper+line 15px/2px, markers, routing, puertos, OPL)
  4. `decompiled/` (808 modulos searchables con `rg "class Foo" decompiled` para implementacion exacta)
  5. `fixtures/` (7 grupos con modelos reales — cells JSON + OPL + screenshots como fixtures y validacion)
  6. `catalog/` (376 clases + mapeo modulo→clase para guiar la arquitectura)
  7. `config/` (rutas, Firebase, assets — como referencia de superficie funcional, no a copiar arquitectura)
  8. La arquitectura final puede diferir (no Firebase, no Angular), pero SVGs, dimensiones, colores, tipografia, clases y plantillas OPL se reutilizan directamente.
- Considera `/home/felix/projects/opm-model-app/docs/archive/si-partiese-desde-0.md` antes de modificar historias: el desarrollo previo se hizo sin estos insumos de ingenieria inversa y contiene decisiones/deuda que no deben arrastrarse automaticamente.
- Las HU existentes nacieron desde `opcloud-reverse` y una metodologia 1:1; al revisarlas, rebasalas contra SSOT OPM + evidencia OPCloud nueva + lecciones del archivo `si-partiese-desde-0.md`.
- No hay todavia workspace de aplicacion, manifests, tests, lint, typecheck ni CI; no inventes comandos `npm`/`pnpm` hasta que aparezcan en el repo.
- Lee `docs/HANDOFF.md` primero para estado, bloqueantes y pendientes; `docs/JOYAS.md` para hallazgos tecnicos validados; `docs/PROCEDIMIENTO.md` solo cuando necesites regenerar material extraido.
- `bash setup.sh` es el unico comando de regeneracion; requiere `bash`, `curl` y `npx`/npm, descarga bundles de produccion, ejecuta `webcrack` y repuebla `decompiled/`, `_local/bundles/`, assets publicos, `webroot/index.html`, `webroot/favicon.ico` y `config/edx.config.json`.
- No versionar ni usar como codigo fuente directo `decompiled/` o `_local/`; son material grande, gitignored, de OPCloud y regenerable.
- `setup.sh` hardcodea hashes de bundles como `main.a8737ee2a8ed30eb.js`; si OPCloud cambia deploy, actualiza esos hashes antes de regenerar.
- `config/firebase.json`, `config/routes.json` y `config/assets.json` son hechos curados extraidos; no asumas que `setup.sh` los refresca completos.
- `fixtures/` es data observacional versionada del sandbox demo organizada por modelo; usala para inferir modelos, UI y OPL, no como fuente productiva completa.
- Produccion sigue bloqueada por auth: no hay cuenta, HAR autenticado, schema Firestore, formato export ni backend code.
- Para rastrear clases o comportamientos OPCloud, regenera `decompiled/` si falta y busca con `rg`, por ejemplo `rg "class AggregationLink" decompiled` o `rg "getTriangleSVG" decompiled`.
- Cuando agregues software nuevo, mantenlo separado del material extraido/generado y actualiza este archivo con comandos reales de build, test y ejecucion apenas existan.
