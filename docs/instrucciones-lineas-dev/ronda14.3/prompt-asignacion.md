# Prompt de asignacion — Ronda 14.3

## Plantilla Generica

```text
Toma control de {{LINEA}} de la ronda 14.3 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Contexto:
- Ronda 14.3 es frontera arquitectonica pre-Beta1: store contracts, runtime effects y render pure options.
- Puede explorarse en paralelo con 14.2, pero no debe mergearse antes de que 14.2 cierre leyes/ledger.
- No es feature work ni redesign UX.

Reglas duras:
- Lee docs/HANDOFF.md, docs/roadmap/cortes-operativos.md y docs/roadmap/auditoria-categorial-app.md.
- Usa ICAS: urn:fxsl:kb:icas-comparacion para refactor como naturalidad y urn:fxsl:kb:icas-efectos para effects.
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/**.
- No cambiar comportamiento observable.
- No tocar parser OPL ni migrar Entidad.refinamiento.
- Tests de preservacion obligatorios.

Loop verde obligatorio:
- cd app && bun run check
- cd app && bun run lint
- cd app && bun run build
- cd app && bun run browser:smoke
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real

Entregable:
- hashes;
- contratos/effects explicitados;
- pruebas ejecutadas;
- comportamiento preservado;
- deuda residual.
```

## Invocacion L1

```text
Toma control de L1 de la ronda 14.3 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: docs/instrucciones-lineas-dev/ronda14.3/linea-1-store-slice-contracts.md

Reemplaza aliases Partial<OpmStore> por contratos reales de slices sin cambiar runtime. Preferir nuevo app/src/store/sliceTypes.ts. No toques runtime.ts, render, parser OPL, HANDOFF ni HU canonicas.
```

## Invocacion L2

```text
Toma control de L2 de la ronda 14.3 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: docs/instrucciones-lineas-dev/ronda14.3/linea-2-runtime-render-effects.md

Encapsula efectos runtime y purifica opciones de proyeccion JointJS. Crear RuntimeEffects y/o proyeccionOpciones si corresponde. No toques store slice contracts salvo lectura, parser OPL, HANDOFF ni HU canonicas. Mantener comportamiento observable.
```
