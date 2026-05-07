# Prompt de asignacion — Ronda 16 Beta1

## Plantilla generica

```text
Toma la linea {{LINEA}} de la ronda 16 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Brief: {{PATH_BRIEF}}

Contexto: asumimos ronda 15 perfecta. El objetivo de ronda 16 es cerrar Beta1 como modelado de dominio real mediano, no abrir simulacion ni infraestructura generica.

Reglas duras:
- No tocar docs/HANDOFF.md ni docs/historias-usuario-v2/**.
- Consultar SSOT OPM y opm-extracted antes de inventar.
- Mantener alpha 100%.
- No agregar carpetas/permisos ni simulacion.
- Commits atomicos y semanticos.

Loop verde minimo:
cd app && bun run check
cd app && bun run browser:smoke cuando toque UI/render
cd app && bun run build cuando toque bundle/proyeccion

Entregable:
- hashes de commits
- tests ejecutados
- decisiones tomadas
- bugs capturados como BUG-* si aparecen
- confirmacion de archivos no tocados
```

## Invocaciones concretas

### L1

```text
{{plantilla generica}}
LINEA = L1 Tabla de Enlaces workbench
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda16/linea-1-tabla-enlaces-workbench.md
```

### L2

```text
{{plantilla generica}}
LINEA = L2 Busqueda intra-modelo
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda16/linea-2-busqueda-intra-modelo.md
```

### L3

```text
{{plantilla generica}}
LINEA = L3 Validacion metodologica accionable
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda16/linea-3-validacion-metodologica.md
```

### L4

```text
{{plantilla generica}}
LINEA = L4 Catalogo simple + modelos ancla
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda16/linea-4-catalogo-modelos-ancla.md
```

### L5

```text
{{plantilla generica}}
LINEA = L5 Eval Beta1 dominio real
PATH_BRIEF = docs/instrucciones-lineas-dev/ronda16/linea-5-eval-beta1-dominio-real.md
```

