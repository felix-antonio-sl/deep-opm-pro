# Modelo amplio de la app modeladora OPM deseada

Generado desde `docs/historias-usuario-v2` para cargarlo en la app y forzar el uso de SD, refinamientos, estados, OPL, biblioteca, arbol OPD, inspector, persistencia y validacion.

## Archivo

- `app-modeladora-opm-deseada.json`

## Alcance del modelo

- OPDs: 8
- Entidades: 47
- Estados: 3
- Enlaces: 49
- OPL generado por el runtime local: 135 sentencias

## Fuentes de backlog usadas

- `docs/historias-usuario-v2/04-MAPA.md`: mapa completo de 48 epicas y 1.117 HU canonicas.
- `docs/roadmap/mvp-alpha.md`: corte kernel editable, persistible y verificable.
- Epicas base: 10, 11, 12, 13, 20, 30 y 50.
- Epicas extendidas consideradas: A0, A1, A2, B0, C1 y D0.

## Estructura OPM

- `SD`: sistema raiz, donde `Modelar sistemas OPM con valor validado` transforma backlog, SSOT y app en `Modelo OPM editable`.
- `SD1`: descomposicion del proceso central en captura de alcance, kernel OPD, refinamiento, OPL/validacion y persistencia.
- `SD1.1`: refinamiento del kernel editable.
- `SD1.2`: refinamiento de estructura OPD.
- `SD1.3`: refinamiento de OPL y validacion.
- `SD1.4`: refinamiento de persistencia/exportacion/deuda.
- `SD2`: despliegue estructural de `App modeladora OPM`.
- `SD3`: despliegue estructural de `Modelo OPM editable`.

## Superficies de app ejercitadas

- Importacion JSON via inspector.
- Gate de cambios sin guardar antes de reemplazar el modelo activo.
- Arbol OPD con nodos SD, SD1, SD1.1-SD1.4, SD2 y SD3.
- Auto-layout sobre un modelo mediano.
- Biblioteca lateral con apariciones por OPD.
- Panel OPL-ES con filtro por seleccion.
- Validacion estructural y metodologia.
- Guardado local con modal `Guardar como`.

## Observaciones de la carga real

- La app acepto el JSON validado y cargo el modelo completo.
- Tras importar, el header mostro `App modeladora OPM deseada (No guardado)`, pero la pestana siguio como `Modelo (No guardado)` hasta guardar. Es la misma clase de inconsistencia de identidad detectada con fixtures.
- La verificacion estructural quedo en `0`; la metodologia levanto 21 avisos. Esto es correcto como senal de calidad: varios subprocesos se modelaron como capacidades y no como transformaciones con objeto consumido/producido.
- El arbol OPD fue capaz de mostrar jerarquia profunda, pero los labels siguen siendo demasiado compactos para un modelo amplio.
- El OPL filtrado por seleccion funciono bien al seleccionar `App modeladora OPM`: redujo el texto a sentencias relevantes cruzando SD y SD1.
- Auto-layout ordeno, pero no encuadro automaticamente el modelo completo en viewport.
