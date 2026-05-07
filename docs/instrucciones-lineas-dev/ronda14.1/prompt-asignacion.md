# Prompt de asignacion — Ronda 14.1

Mini-ronda de una sola linea. No generar paralelismo artificial.

## Plantilla Generica

```text
Toma control de {{LINEA}} de la ronda 14.1 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Contexto:
- Alpha esta cerrado con OPL reverse.
- El corte vigente inmediato es "refinamiento OPM completo sobre Thing".
- La base esperada es main @ f20c09a o posterior.
- Tu trabajo es hardening, no reescritura.

Reglas duras:
- Lee docs/HANDOFF.md y docs/roadmap/cortes-operativos.md antes de tocar codigo.
- Revisa SSOT OPM en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
- Revisa opm-extracted antes de inventar: VisualPart/OpmVisualThing.ts,
  json.model.ts, ImportOPX/OPX.API.ts y validation-module.ts.
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/**.
- No migrar schema ni Entidad.refinamiento a slots separados salvo autorizacion
  explicita. Default: auditar y decidir.
- No reabrir OPL reverse ni tocar app/src/opl/parser/**.
- Todo cambio debe ser aditivo o patch puntual justificado por SSOT.

Loop verde obligatorio:
- cd app && bun run check
- cd app && bun run lint
- cd app && bun run build
- cd app && bun run browser:smoke
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real

Entregable:
- hashes;
- decision sobre refineeInzooming/refineeUnfolding/refineable;
- smokes object-inzoom y process-unfold;
- auditoria OPL de descomposicion de objeto;
- si corriges OPL, muestra antes/despues;
- pruebas ejecutadas y cualquier deuda residual.
```

## Invocacion L1

```text
Toma control de L1 de la ronda 14.1 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: docs/instrucciones-lineas-dev/ronda14.1/linea-1-refinamiento-thing-hardening.md

Continua desde el corte "refinamiento OPM completo sobre Thing": revisar deuda
de slots separados refineeInzooming/refineeUnfolding/refineable, agregar e2e
para object-inzoom y process-unfold, y auditar OPL especifico de descomposicion
de objeto contra SSOT.

No implementes migracion de schema por defecto. Primero documenta si realmente
se necesita para Beta1. Si no hay contraejemplo, deja la migracion como schema
vNext y cierra con tests + auditoria OPL.
```
