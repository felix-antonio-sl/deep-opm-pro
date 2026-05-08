# Auditoria UX de la app de modelamiento OPM

Fecha: 2026-05-07  
Target evaluado: http://138.201.53.205:5173/  
Rol de evaluacion: modelador OPM avanzado, criterio visual exigente, foco en valor validado y bimodalidad OPD/OPL.

## Resumen ejecutivo

La app ya tiene una base valiosa: el canvas se siente liviano, las primitivas OPM aparecen rapido, la validacion metodologica responde en vivo y el panel OPL-ES cierra la bimodalidad de forma visible. El mayor riesgo no esta en ausencia de funcionalidad, sino en friccion de flujo: la interfaz aun obliga al usuario a descubrir gestos, nombres de estado y paneles que compiten por espacio. La velocidad sin lectura clara se convierte en deuda de modelamiento.

El hallazgo mas importante: cuando el usuario logra expresar un hecho OPM correcto, la app lo valida y lo verbaliza bien. Cuando intenta llegar ahi por intuicion de canvas, el camino no siempre es evidente.

## Evidencia capturada

Todas las capturas estan en `docs/audits/opm-app-ux-2026-05-07/screenshots/`.

- `01-empty-state-desktop.png`: estado inicial limpio, pero poco guiado.
- `02-after-object-process.png`: insercion directa de objeto/proceso y avisos metodologicos utiles.
- `03-editing-friction-after-fill-error.png`: campo de nombre enfocado; friccion al editar desde automatizacion del navegador.
- `04-name-cleared-by-keyboard.png`: nombre borrado con teclado, estado intermedio sin proteccion semantica.
- `05-process-renamed-keypress.png`: OPL y avisos se actualizan al renombrar proceso.
- `06-object-renamed.png`: objeto renombrado; `+ Atributo` se habilita y OPL se actualiza.
- `07-result-link-attempt.png`: intento natural de enlace por drag no produce el link esperado.
- `08-result-link-created-or-not.png`: enlace `Resultado` creado con flujo fuente -> tipo -> destino; validacion queda en verde.
- `09-cafetera-demo-loaded.png`: seleccion de fixture abre modal de cambios sin guardar.
- `10-cafetera-demo-after-discard.png`: fixture Cafetera cargado con OPD, OPL y validacion coherente.
- `11-onstar-demo-loaded.png`: fixture OnStar cargado; warning metodologico real.
- `12-warning-click-navigation.png`: click en warning selecciona el elemento, pero el texto queda estrecho.
- `13-opl-right-panel.png`: OPL lateral mejora lectura textual, pero comprime canvas/inspector/warnings.
- `14-templates-open.png`: modal de plantillas funcional, estado vacio correcto.
- `15-valid-link-types-open.png`: popover de tipos validos visible, pero no guia de forma suficiente.
- `16-valid-link-types-after-two-things.png`: el popover desaparece al seleccionar cosas; la promesa "selecciona dos cosas" no se completa.
- `17-capture-bug-open.png`: modal de captura de bug permite adjuntar screenshots.
- `18-toolbar-baseline-onstar-panels.png`: baseline de segunda ronda con toolbar, paneles, OPL y OnStar cargado.
- `19-main-menu-open.png`: menu principal con alta densidad de acciones.
- `20-more-actions-open.png`: menu principal y `Mas acciones` pueden coexistir/solaparse.
- `21-grid-config-open.png`: configuracion de grid con parametros correctos, pero separada del toggle principal.
- `22-grid-off-canvas.png` y `23-grid-on-canvas.png`: toggle de grid con efecto visual poco destacado.
- `24-library-open.png`: biblioteca flotante de objetos/procesos con acceso a SD.
- `25-image-policy-respeta-open-or-toggle.png`: politica global de imagen con etiquetas cripticas (`Respeta`, `Img+Txt`).
- `26-before-autolayout.png`, `27-after-autolayout.png`, `28-bring-after-select-edge-object.png`: auto-layout aplica cambios, pero no encuadra el resultado.
- `29-opd-tree-management-open.png`, `30-opd-tree-names-toggle.png`, `31-opd-tree-order-toggle-or-menu.png`: gestion del arbol OPD con controles muy abreviados.
- `32-process-selected-from-opl.png`, `33-after-process-decompose.png`: descomposicion de proceso crea SD1, pero sobrecarga el inspector.
- `34-driver-selected-via-opl.png`, `35-add-states-open-or-applied.png`, `52-style-panel-object-selected.png`: inspector semantico/visual poderoso, pero demasiado mezclado.
- `36-add-attribute-result.png`: perdida de seleccion deja acciones contextuales deshabilitadas.
- `37-opl-numbering-off.png`, `38-opl-ai-text-toggle.png`, `39-opl-edit-mode.png`, `40-opl-search-driver-rescuing.png`, `41-opl-filter-by-driver-selection.png`, `42-opl-minimized.png`, `43-opl-restore-attempt.png`: ergonomia del panel OPL.
- `44-mobile-390x844-toolbar-panels.png`, `45-tablet-768x1024-toolbar-panels.png`, `46-desktop-after-responsive-reset.png`: comportamiento responsive de barras y paneles.
- `47-save-action-result.png`: modal de guardado local/versionado.
- `48-main-menu-duplicate-action-attempt.png`, `49-main-menu-shortcuts-attempt-still-menu.png`, `50-assistant-click-before-dialog-paints.png`, `51-new-model-assistant-dialog.png`: navegacion por menu y asistente de nuevo modelo.

## Hallazgos

### H1 - Identidad del modelo inconsistente al cargar fixtures

Evidencia: `10-cafetera-demo-after-discard.png`, `11-onstar-demo-loaded.png`.

El encabezado muestra `Cafetera Domestica (No guardado)` u `OnStar System (No guardado)`, pero la pestaña inferior/superior de modelos abiertos sigue mostrando `Modelo (No guardado)`. El selector de demo tambien queda visualmente en `Demo`, no en el fixture activo.

Impacto: un modelador pierde confianza en que esta editando el modelo correcto. En OPM esto importa porque el OPD activo, su OPL y sus validaciones deben pertenecer inequivocamente al mismo modelo.

Recomendacion: unificar el nombre activo en header, tab, selector/estado de fixture y export metadata. Si un fixture se carga como copia editable, mostrarlo explicitamente como `Copia de Cafetera Domestica`.

### H2 - Creacion de enlaces correcta, pero el gesto principal no es descubrible

Evidencia: `07-result-link-attempt.png`, `08-result-link-created-or-not.png`.

El link `Resultado` se pudo crear con el flujo: seleccionar proceso, elegir tipo `Resultado`, seleccionar objeto destino. La validacion paso a `0` avisos y OPL agrego `Preparar cafe genera Cafe preparado.`

El intento natural de canvas, arrastrar desde proceso hacia objeto despues de elegir `Resultado`, no produjo el enlace esperado y dejo al usuario en estado "Selecciona la entidad destino".

Impacto: para usuarios expertos en diagramadores, drag desde source a target es el gesto natural. Si no funciona o no se senaliza, el usuario culpa a la app, no a su gesto.

Recomendacion: soportar drag source-target para enlaces o mostrar un ghost/hint mas fuerte: `1. Selecciona origen: Preparar cafe. 2. Ahora haz click en destino`. El estado del enlace deberia estar visualmente anclado al cursor/canvas, no solo a una frase en toolbar.

### H2 - Paneles laterales degradan la lectura de avisos metodologicos

Evidencia: `12-warning-click-navigation.png`, `13-opl-right-panel.png`.

La app detecta un warning util: objeto ambiental `Driver` transformado por procesos sistemicos. Al navegar al aviso, el elemento se selecciona, pero el texto del warning queda en una columna estrecha, con palabras partidas y baja legibilidad. Al mover OPL al lateral derecho, el texto OPL mejora, pero el canvas y la metodologia quedan comprimidos.

Impacto: la validacion es una de las piezas de valor mas fuertes del producto. Si sus avisos se vuelven visualmente ilegibles, el valor validado se pierde en presentacion.

Recomendacion: separar el panel de issues como bandeja propia con ancho minimo estable, o permitir modo "issues focus" que oculte inspector/OPL y muestre aviso, regla SSOT, elemento afectado y accion sugerida.

### H2 - El popover "Tipos validos" promete una interaccion que no se sostiene

Evidencia: `15-valid-link-types-open.png`, `16-valid-link-types-after-two-things.png`.

El popover indica: `Selecciona dos cosas para ver firmas y preview OPL`. Al seleccionar dos cosas en el canvas, el popover desaparece y no entrega preview visible.

Impacto: esta funcion podria ser excelente para aprender OPM y evitar links invalidos, pero hoy se siente como una herramienta que no completa su contrato.

Recomendacion: mantener el popover fijado durante la seleccion de origen/destino, listar `origen`, `destino`, links validos, links invalidos y preview OPL. Si la seleccion cambia, actualizar sin cerrar.

### H3 - Estado vacio limpio, pero sin proposito modelador

Evidencia: `01-empty-state-desktop.png`.

El canvas inicial es limpio y profesional. El problema es que el primer paso esta distribuido entre toolbar, inspector y OPL. Para un usuario nuevo de OPM, no hay "construye tu SD" como intencion central.

Impacto: la app se presenta como herramienta de dibujo antes que como asistente de modelamiento OPM. El valor del producto es guiar del proposito al SD, no solo poner shapes.

Recomendacion: en estado vacio, mostrar una guia no invasiva dentro del canvas: `Empieza con proceso central`, `agrega transformee`, `agrega agent/instrument`, con botones compactos que ejecuten esos pasos.

### H3 - Edicion de nombres requiere foco preciso y no protege estados intermedios

Evidencia: `03-editing-friction-after-fill-error.png`, `04-name-cleared-by-keyboard.png`, `05-process-renamed-keypress.png`.

Renombrar funciona y actualiza OPL/validacion. Pero el campo puede quedar vacio mientras el canvas aun muestra el nombre anterior o el usuario esta a medio editar.

Impacto: los modelos OPM dependen de nombres claros. Un estado intermedio vacio deberia estar contenido como borrador de edicion, no propagarse parcialmente al modelo.

Recomendacion: aplicar commit-on-blur/Enter con validacion de nombre no vacio, y mostrar feedback local si el nombre queda vacio. Mantener el valor previo hasta confirmar.

### H3 - Modal de cambios sin guardar es correcto, pero interrumpe el flujo de exploracion de demos

Evidencia: `09-cafetera-demo-loaded.png`.

Al cargar un fixture despues de editar, aparece modal con `Guardar`, `Descartar`, `Cancelar`. Es correcto y reversible.

Impacto: para exploracion de ejemplos, la proteccion esta bien, pero falta contexto: no dice que se esta intentando cargar `Cafetera Domestica` ni que se descartara la copia actual.

Recomendacion: cambiar copy a `Para cargar Cafetera Domestica, primero decide que hacer con Modelo (No guardado)`. Esto reduce ambiguedad sin quitar seguridad.

### H3 - El boton flotante de bug capture es util, pero compite visualmente con warnings

Evidencia: `17-capture-bug-open.png`.

El modal de captura es claro y permite screenshots. El boton rojo `!` permanente se parece a severidad/error del modelo, no a herramienta de reporte.

Impacto: en una app con validaciones metodologicas, el rojo debe reservarse para deuda del modelo. Un boton de feedback rojo confunde semantica visual.

Recomendacion: moverlo a `Mas acciones` o cambiarlo a un icono neutral de feedback. Si se mantiene flotante, usar color distinto de errores metodologicos.

## Segunda ronda: barras, paneles y herramientas

### H1 - La toolbar principal mezcla modelamiento, archivo, vista, depuracion y apariencia

Evidencia: `18-toolbar-baseline-onstar-panels.png`, `19-main-menu-open.png`, `20-more-actions-open.png`, `25-image-policy-respeta-open-or-toggle.png`, `38-opl-ai-text-toggle.png`.

La barra superior concentra acciones de naturalezas muy distintas: creacion OPM, layout, grid, captura de bug, guardado, menus de archivo, politica de imagen, OPL experimental y paneles. La interfaz se siente funcionalmente rica, pero no jerarquizada. Un modelador experto necesita percibir rapidamente que acciones cambian el modelo, cuales cambian la vista y cuales son administrativas.

Impacto: aumenta la carga cognitiva y el riesgo de tocar controles que parecen inocuos pero cambian representacion global (`Respeta` -> `Img+Txt`) o abren funciones aun no disponibles (`AI Text`).

Recomendacion: separar la toolbar en grupos visuales estables: `Modelar`, `Conectar`, `Vista`, `Validar/OPL`, `Archivo`. Las funciones futuras deben verse deshabilitadas o vivir en un area beta, no ocupar espacio primario como si estuvieran listas.

### H1 - Los menus se solapan y el DOM expone acciones duplicadas

Evidencia: `19-main-menu-open.png`, `20-more-actions-open.png`, `48-main-menu-duplicate-action-attempt.png`, `49-main-menu-shortcuts-attempt-still-menu.png`.

Al abrir `Mas acciones` con el menu principal abierto, ambos quedan visibles y se pisan. Desde automatizacion/accessibility aparecieron acciones duplicadas con nombres identicos, lo que dificulto seleccionar items como `Atajos`. Visualmente, el menu principal tambien es demasiado largo para ser una herramienta de navegacion rapida.

Impacto: si el usuario avanzado no logra predecir que menu esta activo, la app pierde sensacion de precision. Para usuarios con tecnologias asistivas o automatizacion, los duplicados vuelven fragil la navegacion.

Recomendacion: imponer un unico popover/menu abierto a la vez, usar ids/labels accesibles unicos y dividir el menu principal en secciones mas compactas. `Nuevo modelo por asistente` debe estar promovido fuera del menu largo: es probablemente el mejor onboarding OPM de la app.

### H2 - Grid, auto-layout y traer necesitan feedback espacial mas fuerte

Evidencia: `21-grid-config-open.png`, `22-grid-off-canvas.png`, `23-grid-on-canvas.png`, `26-before-autolayout.png`, `27-after-autolayout.png`, `28-bring-after-select-edge-object.png`.

La configuracion de grid es completa: paso, color, grosor, escala y snap. El problema es que `Grid` y `Config grid` viven como acciones separadas y el efecto del toggle no queda suficientemente anclado al canvas. El auto-layout aplica cambios y muestra toast, pero no encuadra el resultado; despues de ordenar, parte del modelo puede quedar fuera de la ventana util.

Impacto: las herramientas de vista deberian reducir friccion espacial. Si ordenar no incluye fit-to-view, el usuario queda con una accion exitosa pero una camara peor o incompleta.

Recomendacion: fusionar `Grid` y configuracion en un control de vista con estado visible. Despues de `Auto-layout`, ejecutar o sugerir `encuadrar modelo`; `Traer` deberia explicar cuando esta disponible y que elemento/capa va a afectar.

### H2 - El arbol OPD existe, pero sus controles son demasiado cripticos

Evidencia: `29-opd-tree-management-open.png`, `30-opd-tree-names-toggle.png`, `31-opd-tree-order-toggle-or-menu.png`, `33-after-process-decompose.png`.

La gestion del arbol OPD es una pieza importante: permite ver SD, cantidad de cosas, busqueda y modo de orden. Pero los controles `Nom`, `Cod`, `Ord: Auto`, `Ord: Manual` y `...` economizan tanto texto que dejan de comunicar. La descomposicion a SD1 si se refleja en el arbol, lo que confirma valor funcional.

Impacto: en OPM, navegar entre SD y refinamientos no es una preferencia de vista; es la estructura del modelo. Si el arbol parece una utilidad secundaria, el usuario no entiende bien la arquitectura del sistema modelado.

Recomendacion: convertir el arbol OPD en navegacion primaria con etiquetas claras: `Mostrar nombres/codigos`, `Orden automatico/manual`, `Gestionar SD`. Para cada OPD, mostrar rol, estado de validacion y conteo de objetos/procesos/enlaces.

### H2 - La biblioteca es valiosa, pero flota como overlay competitivo

Evidencia: `24-library-open.png`.

La biblioteca lista objetos y procesos del modelo, marca aparicion en OPD actual y ofrece acceso a SD. Es informacion de alta utilidad. Sin embargo, aparece como panel flotante sobre el canvas, compitiendo con inspector, OPL y validacion.

Impacto: la biblioteca deberia ayudar a orientarse en modelos grandes. Como overlay temporal, sirve para buscar, pero no para mantener contexto estable.

Recomendacion: ofrecerla como panel acoplable o tab del arbol/inspector, con busqueda persistente, filtro por OPD y acciones contextuales (`centrar`, `abrir SD`, `mostrar apariciones`).

### H2 - El inspector combina semantica, refinamiento y estilo en una sola columna

Evidencia: `32-process-selected-from-opl.png`, `33-after-process-decompose.png`, `34-driver-selected-via-opl.png`, `35-add-states-open-or-applied.png`, `52-style-panel-object-selected.png`.

El inspector es potente: muestra apariciones, descomposicion, estados, atributos, metadata y estilo. El costo es que despues de descomponer un proceso aparecen bloques repetidos de `Enlaces externos derivados` y controles de reasignacion que convierten el panel en un muro operativo. Al agregar estados, la app crea `estado1` y `estado2` y expone muchos botones (`Inicial`, `Final`, `Default`, `Current`, `Duracion`, `Suprimir`, `Eliminar`) sin suficiente contexto de consecuencia OPM.

Impacto: se diluye la diferencia entre editar la semantica del modelo y decorar su representacion. Un modelador necesita primero decidir significado; estilo debe quedar como capa secundaria.

Recomendacion: partir el inspector en tabs o secciones con prioridad: `Semantica`, `Refinamiento`, `Apariciones`, `Estilo`. Para estados, evitar placeholders genericos y abrir un mini-dialogo: nombre de estados, inicial/final, constraint y preview OPL antes de aplicar.

### H2 - El panel OPL es fuerte, pero sus herramientas necesitan contratos mas honestos

Evidencia: `37-opl-numbering-off.png`, `38-opl-ai-text-toggle.png`, `39-opl-edit-mode.png`, `41-opl-filter-by-driver-selection.png`, `42-opl-minimized.png`, `43-opl-restore-attempt.png`.

El OPL tiene buenas ideas: numeracion, filtro por seleccion, editor libre, restauracion y sincronizacion con seleccion. El filtro por seleccion funciono especialmente bien: al seleccionar `Driver`, redujo la lectura a sentencias relevantes entre SD y SD1. En cambio, `AI Text` responde `Proximamente`, y el modo `Editar` muestra muchas sentencias parseadas que no son aplicables como refinamientos.

Impacto: la bimodalidad OPD/OPL es una ventaja central. Las acciones que parecen editar o generar OPL deben tener alcance clarisimo; de lo contrario el usuario no sabe si esta manipulando texto, modelo o solo vista.

Recomendacion: mantener `Filtrar por seleccion` como herramienta principal. Marcar `AI Text` como beta/deshabilitado. En `Editar`, separar `texto editable`, `sentencias reconocidas`, `cambios aplicables` y `sentencias solo descriptivas`; si no hay cambios aplicables, explicar por que antes de mostrar una caja enorme de texto.

### H3 - Minimizar OPL deja una pestana visualmente pobre

Evidencia: `42-opl-minimized.png`, `43-opl-restore-attempt.png`.

Al minimizar OPL, queda un rail estrecho con texto vertical truncado (`OPL 35 oraci... Resta...`). La accion de restaurar existe y el nombre accesible es razonable, pero visualmente la pestana se siente accidental.

Impacto: minimizar paneles deberia liberar espacio sin romper orientacion. Aqui libera espacio, pero el retorno no se lee con claridad.

Recomendacion: usar una pestana/icono estable con `OPL`, contador y tooltip; evitar texto vertical largo. Mantener el estado minimizado sincronizado con atajos y menu.

### H3 - Guardar funciona como modal seguro, pero la barra no comunica estado de version/localidad

Evidencia: `47-save-action-result.png`.

El modal `Guardar como` permite elegir destino, nombre, descripcion y versionado. Es un buen punto de partida. La friccion esta antes: en la toolbar, `Guardar` no distingue primer guardado, guardado local, version creada o modelo aun no persistido.

Impacto: para un modelador, saber si el OPD/OPL actual esta guardado es tan importante como saber si valida. `No guardado` aparece, pero no se integra con destino ni version.

Recomendacion: mostrar un bloque compacto de estado: `Local / No guardado / v--` o `Local / Guardado / v3`, con accion secundaria para `Guardar como`.

### H3 - Responsive actual es desktop comprimido, no una experiencia adaptada

Evidencia: `44-mobile-390x844-toolbar-panels.png`, `45-tablet-768x1024-toolbar-panels.png`, `46-desktop-after-responsive-reset.png`.

En mobile, la app conserva la logica desktop: toolbar horizontal con overflow, paneles estrechos y canvas recortado. En tablet mejora, pero sigue habiendo demasiadas superficies simultaneas. No parece haber un modo tactil dedicado.

Impacto: el modelamiento OPM complejo probablemente vive en desktop, pero revisar, navegar y comentar modelos deberia ser viable en tablet/mobile. La interfaz actual no degrada con elegancia.

Recomendacion: definir dos modos: `Editar` desktop/tablet grande y `Revisar` mobile/tablet chica. En mobile, priorizar OPD, OPL filtrado, issues y navegacion; ocultar estilo avanzado y toolbar completa.

## Juicio UX de segunda ronda

La app ya tiene muchas piezas que un modelador avanzado necesita, pero estan distribuidas como inventario de funciones mas que como una mesa de trabajo. La barra superior intenta ser todo; el inspector intenta contener todo; OPL intenta ser texto, filtro, editor y futuro asistente IA. El resultado es rico, pero aun no sereno.

El siguiente salto no es agregar mas botones. Es bajar la entropia: agrupar por intencion, distinguir semantica de vista, hacer que cada panel tenga una responsabilidad y dar a la descomposicion SD/OPD el lugar central que merece.

## Fortalezas observadas

- Bimodalidad OPD/OPL viva: al crear entidades y links, el OPL-ES se actualiza inmediatamente.
- Validacion metodologica accionable: detecta proceso sin transformacion, proceso sin links y tension ambiental/sistemica.
- Los fixtures demuestran modelos reales, no solo placeholders.
- Los colores, tamanos y formas canonicas se alinean con el material OPCloud/JOYAS: objeto 135x60, proceso eliptico/rounded, paleta verde/azul/gris.
- El modal de plantillas tiene una base clara para reutilizacion, aunque aun este vacio.
- No se observaron errores `console.warn`/`console.error` durante la sesion.

## Recomendaciones priorizadas

1. Corregir identidad de modelo activo en header, tab, selector y metadata de export.
2. Hacer el flujo de enlaces visible y tolerante: click-click y drag source-target.
3. Redisenar la superficie de warnings como panel de issues legible, con regla, causa y accion.
4. Convertir "Tipos validos" en asistente persistente de origen/destino/preview OPL.
5. Introducir un estado vacio orientado a construir SD, no solo a insertar shapes.
6. Separar visualmente feedback/report-bug de errores metodologicos.
7. Reagrupar toolbar y menus por intencion: modelar, conectar, vista, OPL/validacion y archivo.
8. Convertir el arbol OPD y la biblioteca en navegacion estable, no overlays secundarios.
9. Separar inspector semantico/refinamiento/estilo para evitar que estados, apariciones y colores compitan.
10. Hacer honesto el estado de funciones futuras como `AI Text`: deshabilitado, beta o fuera de la toolbar principal.

## Criterio de salida sugerido para la proxima iteracion

- Cargar `Cafetera Domestica` deja el mismo nombre en header, tab y estado activo.
- Crear `Proceso -> Resultado -> Objeto` funciona tanto por click-click como por drag.
- Un warning metodologico se puede abrir en modo lectura sin truncamiento ni palabras partidas.
- `Tipos validos` muestra preview OPL despues de seleccionar dos cosas y no desaparece.
- Estado vacio permite construir un SD minimo guiado en menos de 60 segundos: proceso central, transformee, agent/instrument y OPL equivalente.
