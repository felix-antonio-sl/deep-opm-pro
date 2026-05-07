# Prompt de asignación — Ronda 15

Ronda pre-Beta1 con dos líneas independientes.

## Plantilla genérica

```text
Toma la línea {{LINEA}} de la ronda 15 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Objetivo de ronda: hardening visual/interacción antes de Beta1. No agregar features de dominio.

Lee primero:
1. docs/HANDOFF.md
2. docs/roadmap/cortes-operativos.md
3. docs/auditorias/2026-05-07-auditoria-ifml.md
4. docs/auditorias/2026-05-07-refactor-radical-steipete.md
5. docs/JOYAS.md
6. opm-extracted/INDEX.md y módulos relevantes citados en el brief

Reglas duras:
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.
- No tocar kernel/OPL/store salvo autorización explícita del brief.
- Reusar evidencia de opm-extracted/assets/JOYAS antes de inventar.
- Commits atómicos.
- Loop verde: cd app && bun run check && bun run lint && bun run build && bun run browser:smoke.

Entregable:
- hashes de commits;
- pruebas ejecutadas;
- decisiones tomadas en §10;
- si algo no se pudo reintroducir, repro y razón concreta.
```

## Invocación L1

```text
{{plantilla genérica}}

LINEA = L1 Dialogo root-cause
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda15/linea-1-dialogo-root-cause.md

Foco: investigar y corregir causa raíz de Dialogo invisible/no-pintado sobre main grid + canvas SVG/composite layers. Crear smoke focal antes del fix. Solo reintroducir mejoras revertidas con commit y smoke propio.
```

## Invocación L2

```text
{{plantilla genérica}}

LINEA = L2 Toolbar overflow manual Mas
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda15/linea-2-toolbar-overflow-mas.md

Foco: agregar ToolbarMas.tsx y mover acciones secundarias al menú manual ⋯ Más para dejar ~25 controles visibles. No implementar overflow automático ni tocar Dialogo/App.
```
