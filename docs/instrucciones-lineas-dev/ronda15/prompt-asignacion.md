# Prompt de asignación — Ronda 15 fusionada

Ronda Beta0 hardening pre-Beta1 con cinco líneas paralelas. Fusiona la ronda 15 original (`Dialogo` + Toolbar `⋯ Más`) y la ronda 16 propuesta (IFML + eval, visual-canvas fidelity, coherencia UX contextual).

## Plantilla Genérica

```text
Toma la línea {{LINEA}} de la ronda 15 fusionada de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Objetivo de ronda: hardening Beta0 antes de Beta1. No abrir features Beta1 de dominio.

Lee primero:
1. docs/HANDOFF.md
2. docs/roadmap/cortes-operativos.md
3. docs/instrucciones-lineas-dev/ronda15/README.md
4. docs/auditorias/2026-05-07-auditoria-ifml.md
5. docs/auditorias/2026-05-07-refactor-radical-steipete.md
6. docs/JOYAS.md
7. opm-extracted/INDEX.md, MODULES.md y módulos relevantes citados en el brief

Reglas duras:
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/.
- No tocar kernel/OPL/store salvo autorización explícita del brief.
- Reusar evidencia de assets/opm-extracted/JOYAS/SSOT antes de inventar.
- Commits atómicos.
- Respetar orden de merge del README: L1 -> L3 -> L2 -> L4 -> L5 -> consolidación.
- Loop verde: cd app && bun run check && bun run lint && bun run build && bun run browser:smoke.

Entregable:
- hashes de commits;
- pruebas ejecutadas;
- decisiones tomadas en §10;
- bloqueos o patches a /tmp si encuentras WIP cruzado;
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

## Invocación L3

```text
{{plantilla genérica}}

LINEA = L3 IFML flow cleanup + evaluacion visual
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda15/linea-3-ifml-evaluacion-visual.md

Foco: normalizar un flujo IFML de alto impacto (modal-stack LIFO o reemplazo de un CustomEvent) y convertir evaluacion-exhaustiva.mjs en loop útil de captura pre-Beta1. Coordinar con L1 si toca modales.
```

## Invocación L4

```text
{{plantilla genérica}}

LINEA = L4 Visual-canvas fidelity
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda15/linea-4-visual-canvas-fidelity.md

Foco: calibrar shapes, enlaces, anclaje, routing, cruces y autolayout sugerido/aplicable contra SSOT + JOYAS + opm-extracted. No persistir layout automáticamente ni introducir dependencia nueva sin aprobación.
```

## Invocación L5

```text
{{plantilla genérica}}

LINEA = L5 Superficie contextual única
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda15/linea-5-superficie-contextual.md

Foco: alinear BarraHerramientasElemento, Inspector, Panel OPL, árbol y PanelMetodologia/PanelAvisos como una sola superficie de modelado. Preparar contrato UX de TablaEnlaces Beta1 sin implementar la feature completa.
```
