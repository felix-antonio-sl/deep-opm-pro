# Prompt de asignación — Ronda 20 / Fase 2 UX

## Plantilla genérica

Trabaja en `/home/felix/projects/deep-opm-pro`.

Toma la línea `{{LINEA}}` usando como contrato el brief:

`{{PATH_BRIEF}}`

Reglas no negociables:

- Lee primero `docs/HANDOFF.md`, el README de `docs/instrucciones-lineas-dev/ronda20/` y el brief de tu línea.
- Revisa el informe histórico `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md`, pero no lo modifiques.
- Antes de inventar UI o semántica, revisa `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/assets/`, `docs/JOYAS.md` y la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Respeta los archivos permitidos del brief. No toques `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- Preserva todos los `data-testid`, `aria-label` y comandos existentes salvo que el brief autorice una adición explícita.
- Usa tokens de `app/src/ui/tokens.ts` para chrome UI. No agregues hex literales.
- Mantén cambios aditivos en API pública. No borres exports ni cambies firmas de componentes públicos.
- Cierra con `cd app && bun run check`, `cd app && bun run lint`, `cd app && bun run build` y `cd app && bun run browser:smoke`.

Forma del entregable:

- 1 a 3 commits atómicos con prefijo `feat(...)`, `style(...)`, `refactor(...)` o `test(...)`.
- Reporte final con hash de commit, comandos ejecutados, tests agregados, decisiones tomadas, desviaciones del brief y bloqueos.
- Si propones HU nuevas, decláralas en el mensaje de commit como propuestas; no edites el backlog vivo.

## Invocaciones concretas

### L1 — Inspector en tabs

Usa la plantilla genérica con:

- `{{LINEA}}`: `Ronda 20 L1 — Inspector en tabs Semántica/Enlaces/Refinamiento/Apariciones/Estilo`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda20/linea-1-inspector-tabs.md`

Prioridad: entregar tabs del Inspector sin romper selección, OPL ni smokes existentes.

### L2 — OPL editor honesto

Usa la plantilla genérica con:

- `{{LINEA}}`: `Ronda 20 L2 — OPL editor honesto`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda20/linea-2-opl-editor-honesto.md`

Prioridad: separar texto, sentencias reconocidas, cambios aplicables/no aplicables y mejorar rail minimizado con contador.

### L3 — Biblioteca dockable

Usa la plantilla genérica con:

- `{{LINEA}}`: `Ronda 20 L3 — Biblioteca dockable`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda20/linea-3-biblioteca-dockable.md`

Prioridad: biblioteca persistente junto al árbol OPD en desktop, overlay preservado en mobile/tablet.

### L4 — Estados con nombres reales

Usa la plantilla genérica con:

- `{{LINEA}}`: `Ronda 20 L4 — Creación de estados con nombres reales y preview OPL`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda20/linea-4-estados-con-nombres-reales.md`

Prioridad: remover `estado1/estado2` desde la UI y pedir nombres reales antes de aplicar.

## Orden de merge sugerido

Merge recomendado: **L4 → L3 → L1 → L2**.

Rationale: L4 es el cambio más acotado; L3 agrega dock sin depender de tabs; L1 reordena Inspector; L2 estabiliza OPL al final porque toca el contrato de edición más sensible.

## Reporte unificado esperado

Al cerrar la ronda, consolidar:

- Hashes por línea.
- Métricas finales `check`, `lint`, `build`, `browser:smoke`.
- Delta de tests unit/e2e.
- Confirmación literal de los cuatro criterios de salida del informe para Fase 2.
- Lista de HU propuestas que deberán formalizarse después si el operador lo decide.
