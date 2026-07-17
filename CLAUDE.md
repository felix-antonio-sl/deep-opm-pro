Hereda de ~/CLAUDE.md

# CLAUDE.md

Fuente única de orientación y gobernanza permanente del repo `deep-opm-pro` para personas y agentes de desarrollo. El estado volátil se referencia; no se duplica aquí.

## Identidad y límites

Modelador OPM/ISO 19450 nuevo (`app/`), con arquitectura propia. No es fork ni app heredada de OPCloud. Los directorios `assets/`, `opm-extracted/`, `fixtures/`, `config/`, `catalog/` y `docs/JOYAS.md` son **evidencia de ingeniería inversa verificada** que informa semántica visual, OPL y fixtures — referencia para construir, no código a clonar.

Instancia en producción: `https://opforja.sanixai.com`.

El **estado operativo vigente** vive en `docs/handoff-2026-07-12.md`. El plan futuro vive en `docs/roadmap/roadmap-2026-07-12.md`; la cola de defectos, en `docs/bugs/INDEX.md`; la historia, en Git. Leer esas fuentes antes de tocar producto.

**Frontera con los modelos de dominio (HODOM, gist).** opforja es la **mesa/herramienta**; los **modelos** que se construyen con ella viven en sus propios repos y son de otra autoridad: HODOM en `hd-opm` (Intento 1, sustrato vigente) / `hodom-opm` (Intento 2), gobernados por **hd-dt** (Director Técnico HODOM-HSC); gist en `gist-opm`. Esta mesa **consume** esos modelos solo como **fixtures** de verificación (golden de regresión, amarras con dato real) y **no los modela, no los versiona aquí, ni decide su gestión o adopción**. Una migración que un cambio de método imponga sobre un modelo de dominio se hace con utilidad **genérica parametrizada** (jamás hardcodeando la ruta de otro repo) y se coordina por el canal `docs/solicitudes-upstream/`. La decisión de **adoptar** una feature de opforja para gestionar HODOM (p. ej. anclar HODOM a gist) es de **hd-dt**, no de este repo.

## Arquitectura

Dependencias unidireccionales. El renderer **nunca** es fuente de verdad:

```
src/modelo/        kernel OPM puro — tipos, operaciones, validadores,
    ↓              refinamientos, plegado, abanicos, diagnóstico, simulación.
src/store/         Zustand — fuente de verdad de runtime. Slices compuestos
    ↓              en runtime.ts; runtimeEffects.ts conecta efectos.
src/app/           frontera de aplicación — ports, adaptadores Zustand y
    ↓              viewmodels compartidos. Nunca importa de ui ni render.
    ├── src/render/jointjs/  adaptador desechable modelo → celdas JointJS.
    └── src/ui/              componentes Preact, diálogos y design system.
```

`src/ui/` y `src/render/` pueden consumir contratos de `src/app/`; el flujo inverso está prohibido. `src/store/` tampoco consume `src/app/`: los tipos compartidos de runtime pertenecen a store/modelo y los ports pueden reexportarlos. Las leyes L7–L8 en `src/leyes/dependencias-unidireccionales.test.ts` sellan estas fronteras.

Subsistemas:

| Módulo | Responsabilidad | Nota |
|---|---|---|
| `src/opl/` | OPL bisimétrico (canvas↔texto) | Dos pipelines espejo: `generadores/` (forward) y `parser/` (reverse: `parsear.ts → planificar.ts → aplicar.ts`). Cambiar uno exige revisar el otro; `roundtrip.test.ts` defiende la simetría. |
| `src/leyes/` | Invariantes verificadas por tests | Undo, proyecciones, cascadas de refinamiento, opl-reverse. |
| `src/serializacion/` | JSON de modelo + validadores | `validar*.ts` por dimensión. |
| `src/persistencia/` | Contrato backend (modelos, workspace, versiones) | SSOT en Postgres/API; sin cache ni fallback OPM en storage del navegador. |
| `src/canvas/` | Geometría/layout pura | Grid, layout radial/sugerido, modo enlace, selección múltiple. Independiente de JointJS. |
| `src/server/` | Captura de bugs | `bugCapture.ts`, gated por `VITE_ENABLE_BUG_CAPTURE`. |

Estructura del repo:

```text
deep-opm-pro/
├── CLAUDE.md · AGENTS.md · NOTICE.md
├── app/                        modelo OPM (src/, e2e/)
├── ui-forja/                   autoridad normativa de diseño Codex
├── deploy/                     nginx.conf (copiado a la imagen) + backup-opforja-db.sh + systemd/
├── docs/
│   ├── README.md               entrada principal de documentación
│   ├── handoff-2026-07-12.md   fotografía operativa vigente
│   ├── uso-productivo.md       guía operativa del usuario (entrar, guardar, atajos)
│   ├── manual-opm-puro.md      manual educativo agnóstico de herramienta
│   ├── manual-opforja.md       manual integrado: método Forja + pista humano + pista agente
│   ├── manual-sistemas-opm.md  ciclo transversal: evidencia, cambio, adopción y retiro
│   ├── manual-sanitarios-opm.md manual avanzado de modelamiento sanitario
│   ├── manual-software-opm.md  manual del dominio a operación de software con agentes
│   ├── cheatsheets/            hojas de referencia visuales
│   ├── JOYAS.md                hallazgos técnicos validados de ingeniería inversa
│   ├── canon-opm/              puentes locales a las SSOT OPM/opforja en KORA
│   ├── deploy/                 operación de la instancia (opforja.md)
│   ├── roadmap/                dirección vigente + registro de conformidad SSOT
│   ├── auditorias/             auditorías con referencia viva o valor prospectivo
│   ├── specs/                  especificaciones técnicas de frentes (vivo o canónico)
│   ├── superpowers/            especificaciones con autoridad o referencia viva
│   ├── reference/              referencia histórica del decommission (opmodel/opm-model-app, 2026-06-22)
│   ├── memorias-aprendizajes/  lecciones del bucle modelar-OPM-con-OpForja
│   ├── solicitudes-upstream/   peticiones desde/hacia skills y KORA
│   └── bugs/                   capturador integrado: activos + bugs/archive/ (resueltos)
├── opm-extracted/              derivado curado, versionado y trazable
├── assets/  fixtures/  config/  catalog/  webroot/   evidencia OPCloud
```

`_local/`, `decompiled/`, `app/dist/`, `app/test-results/`, `.claude/` y cualquier `_archivo/` son ignorados o regenerables. `opm-extracted/` sí se versiona (regenerable con `node opm-extracted/tools/{extract,refactor,build-index}.mjs`).

## Comandos

Todos desde `app/`. Stack: Bun 1.3+, TypeScript strict, JointJS 3.7 core (sin Rappid), Preact 10, Zustand 5, Vite 6, Playwright.

```bash
cd app
bun run dev               # Vite + HMR en localhost:5173
bun run check             # typecheck + unit tests (gate mínimo antes de commit)
bun run typecheck         # tsc --noEmit estricto
bun run test              # unit tests (Bun test runner sobre src/)
bun run lint              # eslint src/
bun run build             # build producción a app/dist/
bun run gate:refactor     # check + lint + build + governance + smoke + quality ledger
bun run design:governance # gate ui-forja (tokens, docs, sombras, offset)
bun run browser:smoke     # smoke Playwright/Chromium (e2e/)
bun run security:scan     # bun pm scan (Socket sobre bun.lock)
bun run visual:audit      # auditoría visual in-vivo → test-results/
bun run visual:deep       # auditoría visual profunda → test-results/
```

Ejecutar un solo test: `bun test src/modelo/abanicos.test.ts` (unit) o `bunx playwright test e2e/03-opl-panel.spec.ts` (E2E; añadir `--headed` para ver el navegador). Filtrar por título: `bun test -t "nombre del test"`.

**Advertencia**: vite en background + `browser:smoke` en paralelo produce flakes en specs sensibles al canvas (02, 05). Apagar dev server antes de smoke.

## Reglas de oro

1. **SSOT semántica**: la autoridad suprema es `urn:fxsl:kb:reglas-opm-estrictas-es` (estados=`puede estar`, especialización=`puede ser`). OPL operativo: `urn:fxsl:kb:spec-forja-opl-es`. Realización visual/OPD: `urn:fxsl:kb:spec-forja-opd-es`. Método: `urn:fxsl:kb:metodologia-forja-opm-es`. Las capas base viven en `/home/felix/kora-pneuma/artefactos/conocimiento/fxsl/` (resueltas vía `docs/canon-opm/resolutor-urn.json`; `/home/felix/kora/` queda como origen histórico congelado, decisión HITL 2026-06-15 — pneuma es la SSOT viva). `docs/canon-opm/` son puentes locales a KORA. OPCloud operacionaliza OPM pero no lo redefine; ante conflicto, manda la SSOT.

2. **Cadena de precedencia visual**: `reglas-opm-estrictas-es` > `spec-forja-opd-es` > `ui-forja/GOVERNANCE.md` > implementación. `ui-forja` gobierna estética, frame, chrome, tokens, tipografía y componentes no portadores de semántica OPM. En formas, marcadores, estados, refinamiento, layout semántico y simulación manda `spec-forja-opd-es` (subordina a ui-forja; GAP-OPD-UIFORJA-08* en su §22). Todo cambio visual debe pasar `cd app && bun run design:governance`.

3. **No crear de novo sin buscar en evidencia**: antes de introducir un marcador, shape, color o regla OPL, verificar este orden: `assets/svg/` (+ `opm-extracted/assets/svg/`, markers `links/procedural|structural/`) → `assets/png/` → `docs/JOYAS.md` → `opm-extracted/INDEX.md`+`MODULES.md`+`assets/INDEX.md` → `decompiled/` (solo si lo anterior no alcanza; `bash setup.sh`) → `fixtures/` → `catalog/` → `config/`. No copiar bloques 1:1 de `opm-extracted/` o `decompiled/` a `app/`: el stack diverge (Preact≠Angular, Zustand≠Firebase, JointJS core≠Rappid); usar la evidencia para entender semántica, no para clonar.

4. **Vigencia documental**: un solo archivo visible por especie operativa, fechado como `<especie>-AAAA-MM-DD.md`; la fecha ISO máxima es la vigente. No se sobrescribe un operativo: antes de publicar su sucesor, el anterior se desplaza al `_archivo/` local e ignorado. Las auditorías viven en `docs/auditorias/` solo mientras tengan referencia de autoridad o brechas abiertas. La historia Git es la red de recuperación versionada.

5. **Repo liviano**: no versionar artefactos regenerables o efímeros (listados en Estructura). `opm-extracted/` es la excepción: derivado curado y trazable.

6. **Jerarquía documental**: `CLAUDE.md` gobierna; el handoff fecha el estado; el roadmap fecha la dirección; `docs/bugs/INDEX.md` registra defectos; especificaciones y decisiones conservan contratos; Git conserva la historia. No convertir ninguna de estas capas en una segunda SSoT.

7. **Trabajo paralelo**: para particionar pendientes en líneas concurrentes usar la skill `lineas-paralelas` (genera README + briefs en `docs/instrucciones-lineas-dev/<ronda>/`). Patrón: worktrees aislados, olas con orden de merge, reconciliación e2e sobre `main` integrado. Cada línea mantiene su gate contra su base.

## Deuda categorial activa

**Trigger hacia el coproducto tagged de selección (refactor A → B)**: `OpmStore` usa tres campos paralelos `seleccionId / enlaceSeleccionId / estadoSeleccionId`, sellados por invariante de exclusividad mutua en `setSeleccionPorTipo`. Al introducir un cuarto tipo seleccionable, migrar antes: reemplazar los tres campos por `seleccion: { tipo: KindSeleccion; id: Id } | null` discriminado, con adaptadores backwards-compat. Fundamento (`urn:fxsl:kb:icas-universales`): el coproducto tagged es universal; N campos paralelos escalan el invariante a O(N²); el discriminado lo mantiene en O(1).

**Trigger hacia especie discriminada (3er flag de especie)**: al 2026-07-12 el record de persistencia lleva **dos** booleanos de especie — `esBiblioteca` + `esApunte` (excluyentes, sellados en `workspace.ts::marcarBiblioteca`/`marcarApunte`). Dos booleanos son correctos (el flag aditivo es el patrón bueno); **al introducir un TERCER flag de especie**, migrar antes: reemplazar `esBiblioteca`+`esApunte` → `especie: 'modelo' | 'biblioteca' | 'apunte' | ...` discriminado, con adaptadores backwards-compat. Fundamento idéntico (coproducto tagged O(1) vs N booleanos paralelos O(N²)); el invariante de exclusión mutua ya escrito hace la migración trivial. NO refactorizar antes del trigger.

## Épicas descartadas

EPICA-70 (Importación OPCAT 4.2) y EPICA-91 (Modo tutorial). No proponer en rondas ni briefs.

## Deploy y convenciones

**Deploy**: `./deploy/deploy.sh` desde raíz (comando canónico). Envuelve `docker compose up -d --build` (`VITE_ENABLE_BUG_CAPTURE=true`) y **estampa la versión visible en la UI**: pasa `OPFORJA_BUILD=$(git rev-parse --short HEAD)` para que el footer de «Ayuda › Atajos» muestre la fecha de build (automática) + el short SHA del commit desplegado (tooltip). **No desplegar con `docker compose up -d --build` a secas: el SHA quedaría en `local`.** 4 contenedores sobre red Traefik `web`: `opforja` (app) · `opforja-model-api` (backend) · `opforja-bug-capture` · `opforja-postgres` (persistencia), TLS `certresolver=myresolver`. Procedimiento completo, incluida la protección de acceso, en `docs/deploy/opforja.md`.

**Convenciones**:
- Idioma: español de Chile (es-CL) para documentación y comunicación; inglés para código nuevo, comandos e identificadores. El vocabulario OPM ya existente en español (`formarAbanico`, `commitModelo`) es una excepción heredada que no se amplía ni se migra dentro de mantenimientos documentales.
- Fechas: siempre ISO absolutas (`AAAA-MM-DD`); evitar expresiones relativas para estados históricos.
- No hay cuenta, HAR autenticado, schema Firestore ni backend code de OPCloud. `setup.sh` hardcodea hashes de bundles; actualizar si OPCloud cambia deploy.

**Fuentes externas**:
- OPCloud app pública: `https://opcloud.systems` · sandbox: `https://opcloud-sandbox.web.app`
- Bun Security Scanner API: `https://bun.com/docs/pm/security-scanner-api`
