# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Lee también `AGENTS.md` (reglas de insumos OPCloud + autoridad SSOT) y `docs/HANDOFF.md` (estado vigente, bloqueantes, pendientes) **antes de tocar producto**. Este archivo no los duplica; los complementa con arquitectura interna y comandos.

## Qué es esto

Workspace de desarrollo de un modelador OPM/ISO 19450 nuevo (la app vive en `app/`), construido desde cero con arquitectura propia. El resto del repo (`assets/`, `opm-extracted/`, `fixtures/`, `config/`, `catalog/`) es **evidencia de ingeniería inversa de OPCloud**: referencia verificada para construir, no código a clonar. Instancia privada en producción: `https://opforja.sanixai.com`.

## Comandos (todos desde `app/`)

```bash
cd app
bun run dev              # Vite + HMR en localhost:5173
bun run check            # typecheck + unit tests (gate mínimo antes de commit)
bun run typecheck        # tsc --noEmit estricto
bun run test             # unit tests (Bun test runner sobre src/)
bun run lint             # eslint src/
bun run build            # build producción a app/dist/
bun run browser:smoke    # smoke Playwright/Chromium (e2e/)
bun run security:scan    # bun pm scan (Socket scanner sobre bun.lock)
```

**Un solo test:**
- Unit: `bun test src/modelo/abanicos.test.ts` (o `bun test -t "nombre del test"` para filtrar por título)
- E2E: `bunx playwright test e2e/03-opl-panel.spec.ts` (añade `--headed` para ver el navegador)

**Gate pesado de refactor** (corre todo + sync de progreso HU + quality ledger): `bun run gate:refactor`.

**Importante**: vite en background + `browser:smoke` en paralelo produce flakes en specs sensibles al canvas (02, 05). Apaga el dev server antes de correr smoke.

## Arquitectura

Stack: Bun 1.3 + Vite 6 + Preact 10 (+ Signals) + Zustand 5 + JointJS 3.7 **core OSS** (sin Rappid) + Playwright. TypeScript strict. JSX vía `jsxImportSource: preact`.

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
                 diálogos, asistente, mobile). tokens.ts = design system Bauhaus.
```

Otros subsistemas:
- **`src/opl/` — OPL bisimétrico (bidireccional canvas↔texto).** Dos pipelines espejo: `generadores/` (modelo → frases OPL, "forward") y `parser/` (frases OPL → mutaciones de modelo, "reverse": `parsear.ts` → `planificar.ts` → `aplicar.ts`). **Un cambio semántico en un pipeline casi siempre obliga a revisar el otro**; los `roundtrip.test.ts` y `fixtures-roundtrip.ts` defienden la simetría. La autoridad gramatical es la SSOT OPL (`opm-opl-es.md`).
- **`src/leyes/`** — invariantes/leyes del sistema verificadas por tests (undo, proyecciones, cascadas de refinamiento, opl-reverse). Es la red de seguridad conceptual.
- **`src/serializacion/`** — JSON de modelo + validadores de integridad (`validar*.ts`) por dimensión (entidades, enlaces, estados, OPDs, apariencias).
- **`src/persistencia/`** — almacenamiento local del workspace, autosalvado, versiones, plantillas (no hay backend; persistencia en navegador).
- **`src/canvas/`** — geometría/layout pura (grid, layout radial/sugerido, modo enlace, selección múltiple) independiente de JointJS.
- **`src/server/`** — `bugCapture.ts`: endpoint de captura de bugs (gated por `VITE_ENABLE_BUG_CAPTURE`).

## Reglas de oro del proyecto

1. **Autoridad semántica = SSOT OPM**, no OPCloud. Ante conflicto, manda la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`). OPCloud operacionaliza OPM pero no lo redefine.
2. **Antes de crear algo de novo** (marcador, shape, color, regla OPL), verifica que no exista ya en los insumos, en orden: `assets/svg/` → `assets/png/` → `docs/JOYAS.md` → `opm-extracted/INDEX.md`. **No copies bloques 1:1 de `opm-extracted/` a `app/`**: el stack diverge (Preact≠Angular, Zustand≠Firebase, JointJS core≠Rappid); úsalo para entender semántica.
3. **Handoff único**: `docs/HANDOFF.md` es la única memoria de traspaso versionada. Reescríbela y consolídala — nunca crees handoffs paralelos/fechados.
4. **Repo liviano**: `decompiled/`, `_local/`, `app/dist/`, `app/test-results/`, `.claude/` son gitignored y regenerables (`bash setup.sh`). No los versiones. `opm-extracted/` **sí** se versiona (derivado curado).
5. **Backlog vs corte activo**: `docs/historias-usuario-v2/` es el backlog completo (no lo arrastres entero); `docs/roadmap/` define el corte operativo. Auditoría de avance: `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`.

## Deploy

Instancia privada en `https://opforja.sanixai.com` (auth básica). Procedimiento en `docs/deploy/opforja.md`. Patrón: `git archive HEAD | docker build` (build-arg `VITE_ENABLE_BUG_CAPTURE=true`) + `docker compose up -d --no-build`. Convención de idioma: español (es-CL) para docs/comunicación, inglés para identificadores de código.
