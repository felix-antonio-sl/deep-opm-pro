# NOTICE

Este repositorio contiene dos clases de material que deben mantenerse
conceptualmente separadas.

## Codigo Del Modelador

El codigo nuevo del modelador OPM vive en `app/`. Esta implementacion usa una
arquitectura propia basada en Bun, Vite, Preact, Zustand y JointJS OSS. El
kernel OPM esta en `app/src/modelo/`; JointJS se trata como adaptador de render.

No hay una licencia open-source repo-wide declarada en este corte. Hasta que se
defina una politica de licencia explicita, no asumas permiso de redistribucion
publica mas alla de los derechos ya otorgados por cada dependencia de terceros.

## Material Observacional Y Derivado

Los directorios `assets/`, `config/`, `catalog/`, `fixtures/`, `webroot/`,
`opm-extracted/`, `decompiled/` y `_local/` contienen evidencia observacional,
artefactos extraidos o derivados curados de OPCloud y de su sandbox publico.
Ese material se conserva para trazabilidad, investigacion, interoperabilidad,
validacion visual y construccion semantica basada en ISO 19450.

OPCloud, sus marcas, assets, configuraciones, modelos de ejemplo y codigo
original pertenecen a sus titulares respectivos. Estos insumos no convierten el
repositorio en un fork autorizado de OPCloud ni habilitan copiar bloques de su
implementacion dentro de `app/`.

## Dependencias De Terceros

Las dependencias de `app/package.json` se rigen por sus propias licencias. En
particular, JointJS OSS 3.7 se usa como dependencia open-source bajo los terminos
publicados por sus mantenedores. Cualquier cambio de distribucion o producto
debe revisar licencias de dependencias y material observacional antes de salir
del entorno de desarrollo.
