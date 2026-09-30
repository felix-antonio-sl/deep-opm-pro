# opforja

Modelador web de OPM/ISO 19450 para construir, revisar y mantener un mismo modelo
mediante sus dos expresiones coordinadas: el diagrama OPD y el lenguaje OPL. Resuelve
la brecha entre dibujar un sistema, describirlo con precisión y conservar un artefacto
persistente, verificable y exportable.

La aplicación está en producción en [opforja.sanixai.com](https://opforja.sanixai.com).

## Estado

El estado operativo no se duplica en una instantánea documental: Git fija la fuente,
`cd app && bun run cordon:estado` contrasta fuente, canon, skills y producción, y el
[índice de bugs](docs/bugs/INDEX.md) muestra defectos activos. El
[producto integrado](docs/roadmap/implementacion-producto-integrado.md) está en
implementación por decisión del operador; el plan distingue aceptación pendiente
y evidencia del candidato. Los cambios locales no acreditan un despliegue.

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

El smoke habitual (`bun run browser:smoke`) usa los casos propios del producto.
Las amarras con modelos externos se ejecutan por separado, desde `app/`, indicando
sus fuentes sin copiarlas al repositorio:

```bash
OPFORJA_GIST_BUNDLE=/ruta/gist-opm-v0.json \
OPFORJA_SD0_BUNDLE=/ruta/sd0-ejemplar-transaccion.json \
bun run browser:external
```

Este comando usa Vite con persistencia efímera local. Si falta una fuente requerida,
falla explícitamente; `--list` permite descubrir las pruebas sin abrir esos archivos.
`PW_PORT` permite elegir otro puerto local.

`AGENTS.md` es la autoridad local de trabajo. `CLAUDE.md` es solo un adaptador que la
importa para runtimes compatibles.
