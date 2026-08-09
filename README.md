# opforja

Modelador web de OPM/ISO 19450 para construir, revisar y mantener un mismo modelo
mediante sus dos expresiones coordinadas: el diagrama OPD y el lenguaje OPL. Resuelve
la brecha entre dibujar un sistema, describirlo con precisión y conservar un artefacto
persistente, verificable y exportable.

La aplicación está en producción en [opforja.sanixai.com](https://opforja.sanixai.com).

## Estado

El corte documental vigente es el
[handoff](HANDOFF.md), cuyo corte interno es el 2026-08-09. La dirección futura está en el
[roadmap del 2026-08-09](docs/roadmap/roadmap-2026-08-09.md).

Al iniciar el corte del 2026-08-09, `main` y `origin/main` coincidían en `2e7246a6`;
producción servía el build `2761196a`, con salud pública correcta. Este mantenimiento
documental modifica tres fuentes del corpus Tutor y no se ha desplegado. La sonda
productiva prueba identidad y salud técnica, no que el árbol local esté publicado ni
validación humana de los modelos creados con la herramienta.

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
