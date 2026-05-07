# Prompt de asignacion — Ronda 17 Beta2

## Plantilla generica

```text
Toma la linea {{LINEA}} de la ronda 17 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Contexto: Beta1 ya esta cerrada. Ronda 17 busca Beta2-min: simulacion conceptual + valores simples sobre un dominio ancla. No runtime externo, no user functions, no probabilidad avanzada.

Reglas duras:
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/**.
- Consultar SSOT OPM y opm-extracted antes de inventar.
- Estado de simulacion runtime separado del modelo persistente.
- Trace visible para cada cambio.
- Commits atomicos.

Loop verde:
cd app && bun run check
cd app && bun run browser:smoke cuando toque UI/render
cd app && bun run build al cierre

Entregable:
- hashes
- tests
- decisiones de alcance
- evidencia de que no se implemento user functions/probabilidad/backend
```

## Invocaciones concretas

### L1

```text
{{plantilla generica}}
LINEA = L1 Kernel de simulacion conceptual
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda17/linea-1-kernel-simulacion-conceptual.md
```

### L2

```text
{{plantilla generica}}
LINEA = L2 UI modo simulacion
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda17/linea-2-ui-modo-simulacion.md
```

### L3

```text
{{plantilla generica}}
LINEA = L3 Valores simples y transiciones
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda17/linea-3-valores-simples-transiciones.md
```

### L4

```text
{{plantilla generica}}
LINEA = L4 Eval Beta2 dominio ancla
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda17/linea-4-eval-beta2-dominio-ancla.md
```

