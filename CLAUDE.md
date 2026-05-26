# CLAUDE.md

Documento **único** de orientación del repo `deep-opm-pro` para Claude Code y cualquier agente de desarrollo (Codex, etc.). Consolida lo que antes vivía en `README.md` y `AGENTS.md`. Para el **estado operativo vigente** (bloqueantes, pendientes, riesgos) lee siempre `docs/HANDOFF.md` antes de tocar producto.

## Qué es esto

Workspace de desarrollo de un modelador OPM/ISO 19450 nuevo (la app vive en `app/`), construido desde cero con arquitectura propia a partir de la SSOT OPM y de evidencia observacional de OPCloud. El repo **no** es una app heredada ni un fork de OPCloud: `assets/`, `opm-extracted/`, `fixtures/`, `config/`, `catalog/`, `docs/JOYAS.md` son **evidencia de ingeniería inversa verificada** que informa producto, semántica visual, OPL y fixtures — referencia para construir, no código a clonar. El código de aplicación vive separado, con arquitectura propia. Instancia en producción: `https://opforja.sanixai.com`.

## Comandos (todos desde `app/`)

```bash
cd app
bun run dev              # Vite + HMR en localhost:5173
bun run check            # typecheck + unit tests (gate mínimo antes de commit)
bun run typecheck        # tsc --noEmit estricto
bun run test             # unit tests (Bun test runner sobre src/)
bun run lint             # eslint src/
bun run build            # build producción a app/dist/
bun run design:governance # gate ui-forja-governance (tokens/docs/sombras offset)
bun run browser:smoke    # smoke Playwright/Chromium (e2e/)
bun run security:scan    # bun pm scan (Socket scanner sobre bun.lock)
bun run visual:audit     # auditoría visual in-vivo → app/test-results/
bun run visual:deep      # auditoría visual profunda → app/test-results/
```

**Un solo test:**
- Unit: `bun test src/modelo/abanicos.test.ts` (o `bun test -t "nombre del test"` para filtrar por título)
- E2E: `bunx playwright test e2e/03-opl-panel.spec.ts` (añade `--headed` para ver el navegador)

**Gate pesado de refactor** (corre todo + sync de progreso HU + quality ledger): `bun run gate:refactor`.

**Importante**: vite en background + `browser:smoke` en paralelo produce flakes en specs sensibles al canvas (02, 05). Apaga el dev server antes de correr smoke.

Stack: Bun 1.3+, TypeScript strict, JointJS 3.7 core (sin Rappid), Preact 10 + Signals, Zustand 5, Vite 6, Playwright. `app/bunfig.toml` configura supply-chain (scanner Socket + edad mínima de publicación 7 días); la instalación reproducible queda anclada en `app/bun.lock`.

## Arquitectura

Dependencias en una sola dirección — **el renderer nunca es fuente de verdad**:

```
src/modelo/   →  kernel de dominio OPM puro (sin JointJS, sin DOM, sin Zustand)
   ↑              tipos en modelo/tipos/, operaciones, validadores, refinamientos,
   │              plegado, abanicos, multiplicidad, diagnóstico, simulación
src/store/    →  Zustand: fuente de verdad de runtime. Slices (modelo, seleccion,
   ↑              pestanas, mapa, enlaces, carpetas, feedback, persistencia...)
   │              compuestos en runtime.ts; runtimeEffects.ts conecta efectos.
src/render/jointjs/  →  ADAPTADOR desechable. Proyecta el modelo a celdas JointJS
                        (proyeccion.ts, customShapes.ts, composers/, linkAssets.ts,
                        opcloudRouting.ts). JointCanvas.tsx es el componente Preact.
src/ui/       →  componentes Preact (Inspector, PanelOpl, Toolbar, árbol OPD,
                 diálogos, asistente, mobile). tokens.ts = design system (lenguaje Codex).
```

Otros subsistemas:
- **`src/opl/` — OPL bisimétrico (bidireccional canvas↔texto).** Dos pipelines espejo: `generadores/` (modelo → frases OPL, "forward") y `parser/` (frases OPL → mutaciones, "reverse": `parsear.ts` → `planificar.ts` → `aplicar.ts`). **Un cambio semántico en un pipeline casi siempre obliga a revisar el otro**; `roundtrip.test.ts` y `fixtures-roundtrip.ts` defienden la simetría.
- **`src/leyes/`** — invariantes/leyes verificadas por tests (undo, proyecciones, cascadas de refinamiento, opl-reverse). Red de seguridad conceptual.
- **`src/serializacion/`** — JSON de modelo + validadores de integridad (`validar*.ts`) por dimensión.
- **`src/persistencia/`** — almacenamiento local del workspace, autosalvado, versiones, plantillas (no hay backend; persistencia en navegador).
- **`src/canvas/`** — geometría/layout pura (grid, layout radial/sugerido, modo enlace, selección múltiple) independiente de JointJS.
- **`src/server/`** — `bugCapture.ts`: endpoint de captura de bugs (gated por `VITE_ENABLE_BUG_CAPTURE`).

### Estructura del repo

```text
deep-opm-pro/
├── CLAUDE.md                 # este documento (orientación única)
├── AGENTS.md                 # redirige a CLAUDE.md
├── NOTICE.md                 # límites de uso, autoría, material derivado
├── setup.sh                  # regeneración del material OPCloud grande
├── app/                      # modelador OPM nuevo (src/, e2e/)
├── ui-forja/                 # ui-forja-governance: autoridad normativa de diseño Codex
├── docs/
│   ├── HANDOFF.md            # estado vigente, decisiones, pendientes, riesgos
│   ├── canon-opm/            # reglas-opm-estrictas.md (SSOT suprema de canon)
│   ├── JOYAS.md              # hallazgos técnicos validados
│   ├── deploy/opforja.md     # operación de la instancia
│   ├── instrucciones-lineas-dev/  # rondas de desarrollo paralelo
│   ├── historias-usuario-v2/ # backlog local vivo
│   └── roadmap/              # cortes activos
├── opm-extracted/            # derivado curado, versionado y trazable
├── assets/  fixtures/  config/  catalog/  webroot/   # evidencia OPCloud
```

`_local/`, `decompiled/`, `app/dist/`, `app/test-results/`, `.claude/` son gitignored y regenerables. `app/node_modules/` también es gitignored pero se mantiene localmente.

## Reglas de oro del proyecto

1. **Autoridad semántica = SSOT OPM**, no OPCloud. Para **canon OPM/OPD/OPL** la SSOT suprema del repo es `docs/canon-opm/reglas-opm-estrictas.md` (p.ej. estados=`puede estar`, especialización=`puede ser`). La SSOT externa es `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`). OPCloud operacionaliza OPM pero no lo redefine; ante conflicto, manda la SSOT.
2. **Autoridad de diseño = `ui-forja/GOVERNANCE.md`**. `ui-forja-governance` gobierna frame, chrome, tokens, tipografía, composición, componentes, interacción visual y apariencia JointJS. Su precedencia está por debajo de `reglas-opm-estrictas.md` y por encima de la implementación. Todo cambio visual debe respetar `ui-forja/01-design-spec.md` ... `08-jointjs-styling.md`, `tokens.json`/`tokens.css` y el gate `cd app && bun run design:governance`.
3. **Antes de crear algo de novo** (marcador, shape, color, regla OPL), verifica que no exista en los insumos, en este orden: `assets/svg/` (+ `opm-extracted/assets/svg/`, markers en `links/procedural|structural/`) → `assets/png/` → `docs/JOYAS.md` → `opm-extracted/INDEX.md`+`MODULES.md`+`assets/INDEX.md` → `decompiled/` (solo si lo anterior no alcanza; regenerar con `bash setup.sh`) → `fixtures/` → `catalog/` → `config/`. **No copies bloques 1:1 de `opm-extracted/`/`decompiled/` a `app/`**: el stack diverge (Preact≠Angular, Zustand≠Firebase, JointJS core≠Rappid); úsalos para entender semántica, no para clonar.
4. **Handoff único**: `docs/HANDOFF.md` es la única memoria de traspaso versionada. Reescríbela y consolídala — nunca crees handoffs paralelos/fechados.
5. **Repo liviano**: no versiones artefactos regenerables/efímeros (ver Estructura). `opm-extracted/` **sí** se versiona (derivado curado; regenerable con `node opm-extracted/tools/{extract,refactor,build-index}.mjs`).
6. **Backlog vs corte activo**: `docs/historias-usuario-v2/` es el backlog completo (no lo arrastres entero); `docs/roadmap/` define el corte operativo. Auditoría de avance: `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` (escanea `app/src`, `app/e2e`, `app/scripts`, `assets/svg/links`; regenera `docs/roadmap/hu-progress.{html,md,json}`).
7. **Trabajo paralelo en rondas**: para particionar pendientes en líneas concurrentes usar la skill `lineas-paralelas` (genera README + briefs en `docs/instrucciones-lineas-dev/<ronda>/`). Patrón validado: worktrees aislados, olas con orden de merge, y un paso final de **reconciliación e2e** sobre el `main` integrado (cada línea solo mantiene su gate contra su base).

## Deuda categorial activa

- **Trigger hacia el coproducto tagged de selección (refactor A → B)**: el paquete "Estados ciudadanos de primera clase" usa tres campos paralelos `seleccionId / enlaceSeleccionId / estadoSeleccionId` en `OpmStore`, sellados por el invariante de exclusividad mutua en `setSeleccionPorTipo`. Cuando entre el siguiente paquete consumidor de selección (un cuarto tipo seleccionable), **migrar A → B antes** de construir ese funtor: reemplazar los tres campos por `seleccion: { tipo: KindSeleccion; id: Id } | null` discriminado, con adaptadores backwards-compat durante la transición. Fundamento (`urn:fxsl:kb:icas-universales`): el coproducto tagged es universal; un cuarto campo paralelo escalaría el invariante sellado a O(N²); el discriminado lo deja en O(1).

## Épicas descartadas

EPICA-70 (Importación OPCAT 4.2) y EPICA-91 (Modo tutorial) — descartadas; no proponer en rondas ni briefs.

## Deploy

Instancia en `https://opforja.sanixai.com`. Procedimiento en `docs/deploy/opforja.md`. Patrón: `docker compose up -d --build` desde la raíz (build-arg `VITE_ENABLE_BUG_CAPTURE=true`); contenedores `opforja` + `opforja-bug-capture` (sidecar) sobre red Traefik `web`, TLS `certresolver=myresolver`. **Estado actual: instancia pública** (el Basic Auth de Traefik fue retirado por decisión del operador). Para re-protegerla, ver `docs/HANDOFF.md` § Riesgos.

## Convenciones

- **Idioma**: español (es-CL) para docs y comunicación; inglés para identificadores de código y comandos.
- **No-archivado de histórico sin valor**: no se conserva documentación histórica que ya no sirve (cortes implementados/desplegados, criterios superados). Las auditorías viven en `docs/auditorias/` (carpeta única; no crear `docs/audits/` ni variantes) solo mientras tengan **referencia viva** (citadas por código/tooling/normas) o **valor prospectivo** (brechas abiertas, decisiones vigentes). Lo implementado o superado se **elimina** — la historia git es la red de recuperación; la narrativa de cortes cerrados vive en `docs/HANDOFF.md`. Política e índice en `docs/auditorias/README.md`.
- **Producción bloqueada por auth OPCloud**: no hay cuenta, HAR autenticado, schema Firestore ni backend code de OPCloud; `setup.sh` hardcodea hashes de bundles (actualizar si OPCloud cambia deploy).

## Fuentes externas

- OPCloud app pública: `https://opcloud.systems` · sandbox observado: `https://opcloud-sandbox.web.app`
- Bun Security Scanner API: `https://bun.com/docs/pm/security-scanner-api`
