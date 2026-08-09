# opforja

Modelador web de OPM/ISO 19450 para construir, revisar y mantener un mismo modelo
mediante sus dos expresiones coordinadas: el diagrama OPD y el lenguaje OPL. Resuelve
la brecha entre dibujar un sistema, describirlo con precisión y conservar un artefacto
persistente, verificable y exportable.

La aplicación está en producción en [opforja.sanixai.com](https://opforja.sanixai.com).

## Estado

El estado operativo no se duplica en una instantánea documental: Git fija la fuente,
`cd app && bun run cordon:estado` contrasta fuente, canon, skills y producción, y el
[índice de bugs](docs/bugs/INDEX.md) muestra defectos activos. La dirección futura vive
en el [roadmap](docs/roadmap/roadmap-2026-08-09.md) y solo se abre por evidencia, un bug
reproducible o una decisión explícita.

## Límites

- `app/` contiene el modelador y sus pruebas.
- `ui-forja/` gobierna el sistema visual y la interfaz no semántica.
- `docs/` contiene orientación, manuales, contratos, decisiones y operación.
- `opm-extracted/`, `assets/`, `fixtures/`, `config/` y `catalog/` son evidencia
  técnica curada de OPCloud; no son código para copiar.
- Los modelos de dominio no viven en este repositorio y conservan su propia autoridad.

## Para empezar

| Necesidad | Entrada |
|---|---|
| comprender el repositorio | [Índice documental](docs/README.md) |
| desarrollar o revisar cambios | [Contrato para agentes y personas](AGENTS.md) |
| usar la aplicación | [Uso productivo](docs/uso-productivo.md) |
| aprender OPM | [Manual de OPM puro](docs/manual-opm-puro.md) |
| desplegar u operar | [Runbook de despliegue](docs/deploy/opforja.md) |
| conocer decisiones vigentes | [Índice de decisiones](docs/decisiones/README.md) |

Los comandos reales se definen en `app/package.json` y se ejecutan normalmente desde
`app/`. Para un cambio de código, el gate mínimo es:

```bash
cd app
bun run check
```

`AGENTS.md` es la autoridad local de trabajo. `CLAUDE.md` es solo un adaptador que la
importa para runtimes compatibles.
