# Prompt de asignación — Ronda 21 / Cierre residual UX

## Plantilla genérica

Trabaja en `/home/felix/projects/deep-opm-pro`.

Toma la línea `{{LINEA}}` usando como contrato el brief:

`{{PATH_BRIEF}}`

Reglas no negociables:

- Lee `docs/HANDOFF.md`, `docs/instrucciones-lineas-dev/ronda21/README.md` y tu brief.
- Revisa el informe `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md`; no lo modifiques.
- Revisa `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/assets/`, `docs/JOYAS.md` y SSOT OPM antes de diseñar.
- No toques `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- No uses EPICA-91: está descartada.
- Preserva testIds/aria existentes, tokens-only para chrome UI y canvas canónico.
- Cierra con `cd app && bun run check`, `cd app && bun run lint`, `cd app && bun run build`, `cd app && bun run browser:smoke`.
- Si tu línea agrega eval visual, deja salidas en carpetas ignoradas/regenerables.

Forma del entregable:

- 1 a 3 commits atómicos.
- Reporte final con hash, comandos, tests, screenshots/registros regenerados, decisiones y desviaciones.
- HU nuevas solo como propuestas en commit; no editar backlog.

## Invocaciones concretas

### L1 — Estado vacío OPM

- `{{LINEA}}`: `Ronda 21 L1 — Estado vacío OPM con inicio compacto`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda21/linea-1-estado-vacio-opm.md`

Prioridad: desde canvas vacío, crear proceso + objeto + enlace resultado en menos de 60 segundos sin abrir menús largos.

### L2 — Responsive modo revisión

- `{{LINEA}}`: `Ronda 21 L2 — Responsive como modo revisión/navegación`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda21/linea-2-responsive-modo-revision.md`

Prioridad: a 390px, revisar canvas/OPD/OPL/issues sin toolbar primaria saturada.

### L3 — Evals UX permanentes

- `{{LINEA}}`: `Ronda 21 L3 — Evals UX permanentes`
- `{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda21/linea-3-evals-ux-permanentes.md`

Prioridad: convertir los evals mínimos del informe en script repetible con JSON, MD, screenshots regenerables y `--strict`.

## Orden de merge sugerido

Merge recomendado: **L3 → L1 → L2**.

Rationale: primero medición, luego primer valor desde vacío, finalmente responsive porque tiene más riesgo de layout.
