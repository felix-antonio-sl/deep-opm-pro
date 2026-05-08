# App modeladora OPM deseada

**Propósito:** Modelo amplio derivado de historias-usuario-v2 para probar la app como sistema modelado.

**Descripción:** Modelo de 8 OPDs usado en la auditoria UX: fuerza importacion, arbol OPD profundo, biblioteca, OPL filtrable, validacion metodologica y guardado local.

**OPDs:** SD, SD1: Modelar sistemas OPM con valor validado, SD1.1: Construir kernel OPD editable, SD1.2: Refinar estructura OPD, SD1.3: Gobernar OPL y validacion, SD1.4: Persistir y compartir modelos, SD2: App modeladora OPM desplegada, SD3: Modelo OPM editable desplegado
**Entidades:** 47
**Enlaces:** 49
**Estados:** 3

## OPL-ES

```
SD del sistema App modeladora OPM deseada.
Modelador OPM es un objeto fisico y ambiental.
Equipo producto es un objeto fisico y ambiental.
Backlog HU v2 es un objeto informatico.
SSOT OPM es un objeto informatico.
App modeladora OPM es un objeto informatico.
Modelar sistemas OPM con valor validado es un proceso informatico.
Modelo OPM editable es un objeto informatico.
OPD navegable es un objeto informatico.
OPL-ES reactivo es un objeto informatico.
Avisos metodologicos es un objeto informatico.
Repositorio local es un objeto informatico.
Modelo OPM editable puede estar en borrador o verificado o versionado.
Modelo OPM editable esta inicialmente en borrador.
Modelo OPM editable esta terminalmente en versionado.
Modelo OPM editable exhibe OPD navegable.
Modelo OPM editable exhibe OPL-ES reactivo.
Modelo OPM editable exhibe Avisos metodologicos.
Modelador OPM manipula Modelar sistemas OPM con valor validado.
Equipo producto manipula Modelar sistemas OPM con valor validado.
Modelar sistemas OPM con valor validado usa Backlog HU v2.
Modelar sistemas OPM con valor validado usa SSOT OPM.
Modelar sistemas OPM con valor validado usa App modeladora OPM.
Modelar sistemas OPM con valor validado produce Modelo OPM editable.
Modelar sistemas OPM con valor validado produce Repositorio local.

SD1: Modelar sistemas OPM con valor validado del sistema App modeladora OPM deseada.
Capturar intencion y alcance es un proceso informatico.
Construir kernel OPD editable es un proceso informatico.
Refinar estructura OPD es un proceso informatico.
Gobernar OPL y validacion es un proceso informatico.
Persistir y compartir modelos es un proceso informatico.
Backlog HU v2 es un objeto informatico.
SSOT OPM es un objeto informatico.
App modeladora OPM es un objeto informatico.
Modelo OPM editable es un objeto informatico.
OPD navegable es un objeto informatico.
OPL-ES reactivo es un objeto informatico.
Avisos metodologicos es un objeto informatico.
Repositorio local es un objeto informatico.
Modelar sistemas OPM con valor validado es un proceso informatico.
Modelo OPM editable puede estar en borrador o verificado o versionado.
Modelo OPM editable esta inicialmente en borrador.
Modelo OPM editable esta terminalmente en versionado.
Capturar intencion y alcance consume Backlog HU v2.
Capturar intencion y alcance usa SSOT OPM.
Capturar intencion y alcance invoca Construir kernel OPD editable.
Construir kernel OPD editable invoca Refinar estructura OPD.
Refinar estructura OPD invoca Gobernar OPL y validacion.
Gobernar OPL y validacion invoca Persistir y compartir modelos.
Construir kernel OPD editable usa App modeladora OPM.
Construir kernel OPD editable produce OPD navegable.
Gobernar OPL y validacion produce OPL-ES reactivo.
Gobernar OPL y validacion produce Avisos metodologicos.
Persistir y compartir modelos produce Repositorio local.
Persistir y compartir modelos produce Modelo OPM editable.

SD1.1: Construir kernel OPD editable del sistema App modeladora OPM deseada.
Construir kernel OPD editable es un proceso informatico.
Crear objetos y procesos es un proceso informatico.
Conectar firmas legales es un proceso informatico.
Editar estados y atributos es un proceso informatico.
Aplicar estilo canonico es un proceso informatico.
SSOT OPM es un objeto informatico.
OPD navegable es un objeto informatico.
OPL-ES reactivo es un objeto informatico.
Crear objetos y procesos invoca Conectar firmas legales.
Conectar firmas legales invoca Editar estados y atributos.
Editar estados y atributos invoca Aplicar estilo canonico.

SD1.2: Refinar estructura OPD del sistema App modeladora OPM deseada.
Refinar estructura OPD es un proceso informatico.
Descomponer procesos inzoom es un proceso informatico.
Desplegar objetos unfold es un proceso informatico.
Navegar arbol OPD es un proceso informatico.
Traer conectados y ordenar es un proceso informatico.
OPD navegable es un objeto informatico.
Modelo OPM editable es un objeto informatico.
Modelo OPM editable puede estar en borrador o verificado o versionado.
Modelo OPM editable esta inicialmente en borrador.
Modelo OPM editable esta terminalmente en versionado.
Descomponer procesos inzoom invoca Desplegar objetos unfold.
Desplegar objetos unfold invoca Navegar arbol OPD.
Navegar arbol OPD invoca Traer conectados y ordenar.

SD1.3: Gobernar OPL y validacion del sistema App modeladora OPM deseada.
Gobernar OPL y validacion es un proceso informatico.
Generar OPL sincronico es un proceso informatico.
Filtrar por seleccion es un proceso informatico.
Detectar violaciones SSOT es un proceso informatico.
Guiar reparaciones metodologicas es un proceso informatico.
OPL-ES reactivo es un objeto informatico.
Avisos metodologicos es un objeto informatico.
Generar OPL sincronico invoca Filtrar por seleccion.
Filtrar por seleccion invoca Detectar violaciones SSOT.
Detectar violaciones SSOT invoca Guiar reparaciones metodologicas.

SD1.4: Persistir y compartir modelos del sistema App modeladora OPM deseada.
Persistir y compartir modelos es un proceso informatico.
Guardar version local es un proceso informatico.
Cargar y recuperar modelo es un proceso informatico.
Exportar JSON SVG PDF HTML es un proceso informatico.
Registrar deuda y bugs es un proceso informatico.
Repositorio local es un objeto informatico.
Modelo OPM editable es un objeto informatico.
Modelo OPM editable puede estar en borrador o verificado o versionado.
Modelo OPM editable esta inicialmente en borrador.
Modelo OPM editable esta terminalmente en versionado.
Guardar version local invoca Cargar y recuperar modelo.
Cargar y recuperar modelo invoca Exportar JSON SVG PDF HTML.
Exportar JSON SVG PDF HTML invoca Registrar deuda y bugs.

SD2: App modeladora OPM desplegada del sistema App modeladora OPM deseada.
App modeladora OPM es un objeto informatico.
Canvas OPD es un objeto informatico.
Toolbar de modelado es un objeto informatico.
Inspector semantico es un objeto informatico.
Arbol OPD es un objeto informatico.
Panel OPL-ES es un objeto informatico.
Panel de metodologia es un objeto informatico.
Biblioteca lateral es un objeto informatico.
Workspace persistente es un objeto informatico.
App modeladora OPM consta de Canvas OPD.
App modeladora OPM consta de Toolbar de modelado.
App modeladora OPM consta de Inspector semantico.
App modeladora OPM consta de Arbol OPD.
App modeladora OPM consta de Panel OPL-ES.
App modeladora OPM consta de Panel de metodologia.
App modeladora OPM consta de Biblioteca lateral.
App modeladora OPM consta de Workspace persistente.

SD3: Modelo OPM editable desplegado del sistema App modeladora OPM deseada.
Modelo OPM editable es un objeto informatico.
Entidades OPM es un objeto informatico.
Estados de objeto es un objeto informatico.
Enlaces OPM es un objeto informatico.
Apariencias OPD es un objeto informatico.
OPDs jerarquicos es un objeto informatico.
OPL derivado es un objeto informatico.
Versiones locales es un objeto informatico.
Modelo OPM editable puede estar en borrador o verificado o versionado.
Modelo OPM editable esta inicialmente en borrador.
Modelo OPM editable esta terminalmente en versionado.
Modelo OPM editable consta de Entidades OPM.
Modelo OPM editable consta de Estados de objeto.
Modelo OPM editable consta de Enlaces OPM.
Modelo OPM editable consta de Apariencias OPD.
Modelo OPM editable consta de OPDs jerarquicos.
Modelo OPM editable consta de OPL derivado.
Modelo OPM editable consta de Versiones locales.
```