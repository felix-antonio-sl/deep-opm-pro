# Prompt de asignacion — Ronda 14.2

## Plantilla Generica

```text
Toma control de {{LINEA}} de la ronda 14.2 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Contexto:
- Alpha esta cerrado con OPL reverse y ronda 14.1 cerro hardening refinamiento Thing.
- Ronda 14.2 convierte la auditoria categorial en leyes ejecutables + ledger de calidad.
- Base esperada: main @ 3303a97 o posterior.

Reglas duras:
- Lee docs/HANDOFF.md, docs/roadmap/cortes-operativos.md y docs/roadmap/auditoria-categorial-app.md antes de tocar codigo.
- Revisa SSOT OPM en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
- Revisa opm-extracted antes de inventar: VisualThing/refinement, ExportOPL y OPX.API segun slice.
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/**.
- No migrar Entidad.refinamiento a slots separados.
- No reabrir UI o features fuera de leyes/ledger.
- Cada cambio debe ser aditivo o fix puntual justificado por ley fallida.

Loop verde obligatorio:
- cd app && bun run check
- cd app && bun run lint
- cd app && bun run build
- cd app && bun run browser:smoke
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real

Entregable:
- hashes;
- leyes/ledger agregados;
- pruebas ejecutadas;
- decisiones tomadas y bloqueos;
- deuda residual para ronda 14.3/Beta1.
```

## Invocacion L1

```text
Toma control de L1 de la ronda 14.2 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: docs/instrucciones-lineas-dev/ronda14.2/linea-1-leyes-proyeccion.md

Implementa leyes JSON/render/refinement: law-json-roundtrip, law-render-stable-metadata, law-refinement-thing-matrix y law-refinement-removal. Nuevo archivo preferido: app/src/leyes/proyecciones.test.ts. No toques parser OPL, store runtime, quality ledger, HANDOFF ni HU canonicas.
```

## Invocacion L2

```text
Toma control de L2 de la ronda 14.2 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: docs/instrucciones-lineas-dev/ronda14.2/linea-2-opl-safe-lens-undo.md

Implementa leyes OPL reverse safe lens + undo atomicity: no delete por ausencia, preview no mutation, apply undoable atomico y diagnostico unsupported sin mutar. Nuevo archivo preferido: app/src/leyes/opl-reverse.test.ts y opcional app/src/leyes/undo.test.ts. No toques render/JSON/refinement, quality ledger, HANDOFF ni HU canonicas.
```

## Invocacion L3

```text
Toma control de L3 de la ronda 14.2 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: docs/instrucciones-lineas-dev/ronda14.2/linea-3-quality-ledger.md

Crea docs/roadmap/quality-ledger.md y, si cabe, app/scripts/quality-ledger.mjs lector de metricas. El ledger debe registrar baseline 14.1, leyes activas, umbrales y deuda aceptada. No edites progress-dashboard.mjs, HANDOFF, HU canonicas ni codigo productivo.
```
