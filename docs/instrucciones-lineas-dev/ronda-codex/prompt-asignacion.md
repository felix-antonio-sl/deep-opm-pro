# Prompt de asignación — Ronda Codex / Pivot visual opforja

## Plantilla genérica

Trabaja en `/home/felix/projects/deep-opm-pro`.

Implementa la línea `{{LINEA}}` usando como contrato principal:

`{{PATH_BRIEF}}`

Reglas comunes:

- Lee `docs/HANDOFF.md`, `docs/instrucciones-lineas-dev/ronda-codex/README.md` y tu brief completo antes de tocar código.
- Lee los specs Codex citados por tu brief en `ui-forja/` y trata `ui-forja/06-ssot-compliance.md` como auditoría de compatibilidad con SSOT.
- Revisa `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/assets/`, `assets/svg/`, `assets/png/` y `docs/JOYAS.md` antes de crear cualquier forma, marker, glifo o solución nueva.
- Respeta las HU base de la sección 2 del brief. Son trazabilidad funcional; no edites `docs/historias-usuario-v2/`.
- No toques `docs/HANDOFF.md`, salvo instrucción explícita del operador al cierre de la ronda.
- No uses EPICA-91: está descartada del proyecto.
- No toques store, modelo, OPL, serialización, persistencia, leyes, `proyeccion.ts`, `opcloudRouting.ts`, `mapa/proyeccion.ts` ni ViewModels/puertos. Si tu línea parece necesitarlo, detente y reporta.
- Tokens del chrome salen de `app/src/ui/tokens.ts` (OWNER L1). Cero hex/fuentes/spacing hard-coded fuera de los dominios autorizados.
- Preserva `data-testid`, roles ARIA y comportamiento. Esto es pivot de presentación, no reescritura funcional.
- Ejecuta en worktree propio si hay líneas paralelas: rama `linea-<n>-codex-wip`.

Loop verde obligatorio antes de cerrar:

```bash
cd app
bun run check
bun run lint
bun run build
```

Si tocaste UI/render, agrega:

```bash
cd app
bun run browser:smoke
```

Para smoke, asegúrate de no tener dev server viejo corriendo si los specs lo requieren.

Forma del entregable:

- 1 a 4 commits atómicos con prefijo `feat(ui)`, `style(ui)`, `feat(render)`, `style(render)` o `test(...)` según corresponda.
- Reporte final con hashes, archivos modificados, tests corridos, decisiones de la sección 10 del brief, gaps/bloqueos y confirmación de que no tocaste `HANDOFF.md` ni backlog HU.
- Bugs fuera de scope: deja patch/notas fuera de la rama, no los mezcles.

## Invocaciones concretas

### L1 — Tokens & tipografía Codex

`{{LINEA}}`: `Ronda Codex L1 — Tokens & tipografía Codex`

`{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda-codex/linea-1-tokens.md`

Prioridad: fundación del contrato visual. Debe entrar primero.

### L4 — CANON-V3 canvas re-piel

`{{LINEA}}`: `Ronda Codex L4 — CANON-V3 canvas re-piel`

`{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda-codex/linea-4-canvas.md`

Prioridad: ola 0 paralela con L1. Re-piel sin tocar routing ni proyección.

### L2 — CodexFrame + shell responsive

`{{LINEA}}`: `Ronda Codex L2 — CodexFrame + shell responsive`

`{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda-codex/linea-2-frame.md`

Prioridad: chokepoint de `App.tsx`. Define la API que L3/L5 consumen.

### L6 — Command palette + glifos + asistente SD

`{{LINEA}}`: `Ronda Codex L6 — Command palette + glifos + asistente SD`

`{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda-codex/linea-6-comandos.md`

Prioridad: absorbe menú principal en `⌘K` y crea `glifos.ts`.

### L3 — Margen unificado OPL ↔ Inspector

`{{LINEA}}`: `Ronda Codex L3 — Margen unificado OPL ↔ Inspector`

`{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda-codex/linea-3-margen.md`

Prioridad: entra tras L2. No edita `App.tsx`; consume `rightPanel`/`floating`.

### L5 — Reconciliación de scope preservado

`{{LINEA}}`: `Ronda Codex L5 — Reconciliación de scope preservado`

`{{PATH_BRIEF}}`: `docs/instrucciones-lineas-dev/ronda-codex/linea-5-scope.md`

Prioridad: entra al final, tras L2/L6 y coordinado con L3.

## Orden de merge sugerido

Merge recomendado: **L1 → L4 → L2 → L6 → L3 → L5**.

Rationale: L1 fija tokens; L4 es disjunto del chrome; L2 define el frame/API; L6 depende de tokens pero no del margen; L3 y L5 consumen el frame y cierran las superficies restantes.

## Notas operativas para orquestación

- Ola 0: L1 y L4 pueden correr en paralelo. L4 puede hard-codear constantes Codex dentro de `render/jointjs/constantes.codex.ts` si L1 aún no mergea.
- Ola 1: L2 y L6 corren tras L1. L2 es dueño único de `App.tsx`; L6 no lo toca.
- Ola 2: L3 y L5 corren tras L2. L3 es dueño del margen; L5 es dueño de árbol/dock/mobile/diálogos/mapa-chrome.
- Si una línea necesita ampliar un contrato de otra, detiene su implementación y reporta a steipete. No cruzar ownership por conveniencia.
