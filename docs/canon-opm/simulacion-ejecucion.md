# Simulación y ejecución OPM — reglas fuera del canon estricto

> Documento hermano de `reglas-opm-estrictas.md`. Contiene reglas de ejecución, realización o simulación que no alteran por sí mismas la canonicidad OPD/OPL, la validación de hechos ni el roundtrip OPD<->OPL. Por R-DOC-4C, estas reglas NO pertenecen al canon estricto.

## Alcance

- **R-SIM-0**: una regla de este documento PUEDE guiar kernels de simulación, runtimes, replay, animación, headless mode o métricas de ejecución; NO DEBE usarse como condición de canonicidad OPD/OPL salvo que otro documento la cite explícitamente como gate.
- **R-SIM-1**: si una regla de ejecución altera persistencia canónica, export, importación, parser, generador OPL o validación de hechos, DEBE moverse o duplicarse como regla aplicable en `reglas-opm-estrictas.md`.

## Reglas exiliadas desde el canon estricto

- **R-SIM-INS-1** (antes `R-INS-5`): una simulación DEBE rastrear número e identidad de instancias operacionales de objetos y procesos.
- **R-SIM-EJEC-1** (antes `R-EJEC-2`): el modelo de ejecución DEBE representar instancias operacionales durante simulación.
- **R-SIM-EJEC-2** (antes `R-EJEC-4`): un modelo solo es realizable como simulación si expresa detalle consistente suficiente para activar recursos, ejecutar procesos, transformar objetos y producir valor funcional.
- **R-SIM-EJEC-3** (antes `R-EJEC-5`): la completitud formal de un modelo ejecutable DEBE evaluarse por capacidad de realización, no por cantidad de diagramas.
- **R-SIM-RUN-1** (antes `R-VIS-RUN-3D`, `V-139`): el modo síncrono DEBE limitar activos por hilo según la política runtime declarada.
