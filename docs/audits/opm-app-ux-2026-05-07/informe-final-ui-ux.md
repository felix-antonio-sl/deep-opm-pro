# Informe final UI/UX - App de modelamiento OPM

Fecha: 2026-05-08
Target evaluado: http://138.201.53.205:5173/
Evidencia: 63 screenshots, 3 rondas de uso, fixture OnStar/Cafetera y modelo amplio importado desde `docs/historias-usuario-v2`.
Rol de evaluacion: modelador OPM avanzado, criterio visual exigente, orientado a valor validado, baja friccion y deuda visible.

## Veredicto

La app ya no es una maqueta. Tiene un kernel real: canvas operativo, objetos/procesos OPM, enlaces tipados, OPL vivo, validacion estructural/metodologica, refinamientos OPD, inspector, biblioteca, importacion JSON y guardado local. Eso es valor.

El problema es que ese valor esta enterrado bajo entropia de interfaz. La app funciona mejor de lo que se entiende. El usuario experto puede llegar al resultado, pero debe aprender demasiados gestos implicitos, paneles que compiten, abreviaturas, menus largos y contratos de herramienta que no siempre se cumplen. En una app de modelamiento OPM esto no es cosmetica: si el usuario no sabe con certeza que modelo, OPD, entidad, enlace, validacion y OPL esta editando, la confianza metodologica cae.

El diagnostico directo: falta un control plane claro. La app tiene muchas funciones, pero aun no tiene una jerarquia visual y operacional que diga: "estas modelando significado aqui, estas navegando estructura alla, estas validando calidad aca, y esto solo cambia la vista".

## Resultado esperado

La meta UI/UX no debe ser "tener mas botones". Debe ser que un modelador pueda:

- Crear un SD inicial en menos de un minuto sin leer documentacion externa.
- Conectar entidades con enlaces validos sin adivinar gestos.
- Ver siempre que modelo y OPD esta editando.
- Entender la diferencia entre error estructural, mejora metodologica y preferencia visual.
- Navegar refinamientos OPD como estructura del sistema, no como menu accesorio.
- Leer OPL como vista primaria bimodal, con acciones honestas sobre que editan texto y que editan modelo.
- Guardar, importar, descartar y versionar sin dudas sobre perdida de trabajo.

## Prioridades criticas

### P0 - Identidad del modelo inconsistente

Evidencia: `10-cafetera-demo-after-discard.png`, `11-onstar-demo-loaded.png`, `54-ronda3-imported-root-model.png`, `55-ronda3-loaded-root-sd.png`, `63-ronda3-saved-local-model.png`.

Problema: al cargar fixtures o importar JSON, el header reconoce el modelo activo, pero la pestana sigue como `Modelo (No guardado)` hasta guardar. El selector de demo tampoco queda como fuente activa clara.

Impacto: mina confianza. Un modelador OPM necesita saber de forma inequivoca si esta editando el modelo actual, una copia de fixture, un import temporal o un modelo guardado local.

Accion viable: unificar una sola fuente de verdad para `modelName`, `origin`, `dirty`, `savedAt` y `storageStatus`; renderizar el mismo estado en header, pestana, selector, modal de guardar/exportar y metadata.

Criterio de salida: al cargar fixture/importar JSON, todas las superficies muestran el mismo nombre en la misma accion, sin esperar guardado. Debe verse algo como `Copia de OnStar System - no guardado` o `App modeladora OPM deseada - importado - no guardado`.

### P0 - Arquitectura de toolbar y menus sin jerarquia suficiente

Evidencia: `18-toolbar-baseline-onstar-panels.png`, `19-main-menu-open.png`, `20-more-actions-open.png`, `48-main-menu-duplicate-action-attempt.png`, `49-main-menu-shortcuts-attempt-still-menu.png`.

Problema: la barra superior mezcla modelamiento, conexion, vista, archivo, debug, apariencia, asistente y funciones futuras. Los menus pueden coexistir/solaparse. En accesibilidad/automatizacion aparecieron acciones duplicadas con labels identicos.

Impacto: la app se siente rica pero no precisa. El usuario no distingue rapidamente que cambia el modelo, que cambia la vista y que abre una herramienta auxiliar. Esto aumenta errores y reduce fluidez.

Accion viable: reorganizar toolbar en grupos persistentes:

- `Modelo`: nuevo, abrir/importar, guardar, exportar.
- `Modelar`: objeto, proceso, estado, atributo.
- `Conectar`: tipos de enlace y asistente de enlace.
- `Vista`: zoom, grid, auto-layout, fit, paneles.
- `Validar`: issues, OPL, metodologia.
- `Ayuda/Feedback`: bug capture, atajos, beta.

Criterio de salida: solo un menu abierto a la vez; labels accesibles unicos; acciones beta deshabilitadas o marcadas como beta; ningun menu primario supera una pantalla sin secciones.

### P0 - Creacion de enlaces demasiado implicita para ser herramienta central

Evidencia: `07-result-link-attempt.png`, `08-result-link-created-or-not.png`, `15-valid-link-types-open.png`, `16-valid-link-types-after-two-things.png`.

Problema: el flujo fuente -> tipo -> destino funciona, pero el gesto natural drag source-target no resulto evidente. El popover `Tipos validos` promete preview al seleccionar dos cosas y luego desaparece.

Impacto: conectar es el corazon del modelamiento. Si el usuario no domina enlace rapidamente, la app se percibe como editor fragil aunque el motor sea correcto.

Accion viable: implementar un "modo enlace" con estado visible en canvas:

- Origen seleccionado.
- Tipo elegido.
- Destinos validos resaltados.
- Destinos invalidos atenuados con razon.
- Preview OPL antes de confirmar.
- Escape/cancel claro.

Criterio de salida: crear un link legal debe funcionar tanto por click-click como por drag source-target. `Tipos validos` debe permanecer abierto hasta mostrar firma, validez y preview OPL para la seleccion actual.

### P1 - Validacion poderosa pero mal presentada

Evidencia: `12-warning-click-navigation.png`, `13-opl-right-panel.png`, `55-ronda3-loaded-root-sd.png`.

Problema: la validacion metodologica detecta problemas reales, pero se lee en columnas estrechas y compite con inspector/OPL. En el modelo amplio, estructura quedo en `0` y metodologia en `21`; esa diferencia es importante, pero visualmente puede sentirse como "21 errores".

Impacto: la validacion es valor central. Si se presenta como ruido o texto comprimido, el usuario aprende a ignorarla.

Accion viable: convertir issues en bandeja dedicada con niveles separados:

- `Estructura`: bloqueos de modelo.
- `Metodologia`: mejoras de calidad OPM.
- `Estilo/legibilidad`: recomendaciones visuales.

Cada issue debe mostrar entidad afectada, regla, razon, accion sugerida y boton `centrar`.

Criterio de salida: a 1280x720, un warning metodologico debe leerse sin palabras partidas. El resumen debe decir claramente `0 bloqueos estructurales / 21 mejoras metodologicas`.

### P1 - Inspector con demasiadas responsabilidades

Evidencia: `32-process-selected-from-opl.png`, `33-after-process-decompose.png`, `34-driver-selected-via-opl.png`, `35-add-states-open-or-applied.png`, `52-style-panel-object-selected.png`.

Problema: el inspector combina semantica, refinamiento, apariciones, estados, atributos, enlaces externos derivados y estilo. Despues de descomponer un proceso, la columna se vuelve un muro operacional. Los estados `estado1` y `estado2` son placeholders pobres para modelamiento serio.

Impacto: se mezcla "que significa el modelo" con "como se ve". Eso debilita el criterio OPM. Un usuario puede tocar estilo o reasignacion sin entender consecuencias semanticas.

Accion viable: separar inspector en tabs:

- `Semantica`: nombre, esencia/afiliacion, estados, atributos.
- `Enlaces`: relaciones actuales y links derivados.
- `Refinamiento`: in-zoom, unfold, OPD hijo, external links.
- `Apariciones`: donde aparece y como navegar.
- `Estilo`: imagen, color, layout local.

Criterio de salida: al seleccionar un proceso descompuesto, la primera pantalla del inspector debe mostrar significado y refinamiento principal sin scroll excesivo. Crear estados debe pedir nombres reales y mostrar preview OPL antes de aplicar.

### P1 - OPD tree subestimado visualmente

Evidencia: `29-opd-tree-management-open.png`, `30-opd-tree-names-toggle.png`, `31-opd-tree-order-toggle-or-menu.png`, `58-ronda3-navigate-sd1-1-kernel.png`, `59-ronda3-navigate-sd2-app-unfold.png`.

Problema: el arbol OPD soporta jerarquia profunda, pero sus controles (`Nom`, `Cod`, `Ord: Auto`, `Ord: Manual`, `...`) son demasiado cripticos. Para un modelo OPM, el arbol no es accesorio: es la estructura de refinamiento del sistema.

Impacto: el usuario ve SD, SD1, SD2, etc., pero no entiende suficientemente el rol, tipo de refinamiento, completitud o deuda de cada OPD.

Accion viable: promover el arbol como navegacion primaria de estructura:

- Labels claros: `Mostrar nombres`, `Mostrar codigos`, `Orden automatico`.
- Badges por OPD: tipo de refinamiento, conteo de objetos/procesos/enlaces, issues.
- Acciones directas: `abrir`, `renombrar`, `centrar raiz`, `crear refinamiento`.

Criterio de salida: en un modelo con 8 OPDs, el usuario debe identificar en 5 segundos cual OPD es SD raiz, cual es in-zoom, cual es unfold y donde hay deuda metodologica.

### P1 - OPL fuerte, pero con contratos de accion confusos

Evidencia: `37-opl-numbering-off.png`, `38-opl-ai-text-toggle.png`, `39-opl-edit-mode.png`, `40-opl-search-driver-rescuing.png`, `41-opl-filter-by-driver-selection.png`, `42-opl-minimized.png`, `43-opl-restore-attempt.png`, `61-ronda3-select-app-object-filter-opl.png`.

Problema: el filtro por seleccion es excelente. Pero `AI Text` dice `Proximamente` aunque ocupa espacio de accion real. `Editar` muestra muchas sentencias parseadas no aplicables, sin separar texto libre de cambios al modelo. La pestana minimizada queda pobre y truncada.

Impacto: OPL deberia ser la segunda mitad de la experiencia bimodal. Si las acciones no son honestas, el usuario no sabe si esta editando texto, modelo o solo vista.

Accion viable:

- Promover `Filtrar por seleccion`.
- Deshabilitar o marcar `AI Text` como beta.
- Separar editor OPL en `texto`, `sentencias reconocidas`, `cambios aplicables`, `no aplicables`.
- Mejorar rail minimizado con contador y estado, por ejemplo `OPL 135`.

Criterio de salida: al editar OPL, antes de aplicar debe quedar claro que cambios modificaran el modelo y cuales son solo texto no accionable.

### P1 - Biblioteca util pero mal ubicada

Evidencia: `24-library-open.png`, `57-ronda3-library-large-model.png`.

Problema: la biblioteca lista entidades, procesos, apariciones y acceso a SD. Es valiosa. Pero como overlay sobre canvas compite con el trabajo principal.

Impacto: en modelos grandes, la biblioteca deberia reducir desorientacion. En overlay temporal, ayuda a buscar pero no a mantener contexto.

Accion viable: convertirla en panel acoplable o tab junto al arbol OPD, con busqueda persistente, filtros por tipo/OPD y acciones `centrar`, `abrir SD`, `mostrar apariciones`.

Criterio de salida: abrir la biblioteca no debe tapar el area central del modelo salvo en mobile. Debe poder quedar visible mientras se navega el canvas.

### P1 - Auto-layout sin fit-to-view deja una accion incompleta

Evidencia: `26-before-autolayout.png`, `27-after-autolayout.png`, `56-ronda3-after-auto-layout-root.png`.

Problema: auto-layout ordena, pero no encuadra automaticamente el resultado. El usuario recibe un toast de exito, pero debe reparar la camara.

Impacto: una herramienta de layout debe terminar con el modelo mas legible que antes. Si ordena pero deja partes fuera, la accion parece parcialmente fallida.

Accion viable: despues de auto-layout ejecutar fit-to-view o mostrar una accion inmediata `Encajar modelo`.

Criterio de salida: tras auto-layout, todos los elementos del OPD activo quedan visibles con margen razonable en desktop.

### P2 - Estado vacio demasiado neutral

Evidencia: `01-empty-state-desktop.png`, `51-new-model-assistant-dialog.png`.

Problema: el estado vacio es limpio, pero no expresa la metodologia. El asistente de nuevo modelo existe, pero esta escondido en menu largo.

Impacto: la app parte como editor de figuras, no como modelador OPM. Eso retrasa el primer valor.

Accion viable: en canvas vacio, ofrecer un inicio OPM compacto:

- `Crear proceso central`.
- `Agregar objeto transformado`.
- `Agregar agente/instrumento`.
- `Abrir asistente`.

Criterio de salida: un usuario nuevo debe poder crear un SD minimo con proceso, objeto y link resultado desde el estado vacio sin buscar en menus.

### P2 - Guardado correcto, pero estatus de persistencia insuficiente

Evidencia: `47-save-action-result.png`, `62-ronda3-save-as-modal-large-model.png`, `63-ronda3-saved-local-model.png`.

Problema: el modal de guardar/versionar es correcto, pero la barra no comunica bien antes del primer guardado si el modelo es fixture, import, local, versionado o pendiente.

Impacto: la persistencia es parte de la confianza. Si no se ve donde vive el modelo, el usuario teme perder trabajo.

Accion viable: agregar chip persistente: `Local`, `Importado`, `Fixture`, `No guardado`, `Guardado hace 2 min`, `Version 3`.

Criterio de salida: antes y despues de guardar, el usuario entiende exactamente el estado de almacenamiento sin abrir modal.

### P2 - Responsive es compresion, no adaptacion

Evidencia: `44-mobile-390x844-toolbar-panels.png`, `45-tablet-768x1024-toolbar-panels.png`, `46-desktop-after-responsive-reset.png`.

Problema: en mobile/tablet, la interfaz comprime toolbar y paneles; no redefine el modo de uso.

Impacto: modelar OPM completo en mobile probablemente no es el caso principal. Forzar la misma UI en chico crea friccion y mala percepcion.

Accion viable: definir mobile como modo revision/navegacion:

- Canvas + OPD tree.
- OPL filtrable.
- Issues.
- Seleccion y comentarios.
- Edicion pesada solo en tablet/desktop o con paneles full-screen.

Criterio de salida: a 390px, no debe haber toolbar primaria saturada. Debe quedar claro que se esta revisando/navegando el modelo, no usando un desktop apretado.

### P2 - Semantica visual del feedback compite con errores del modelo

Evidencia: `17-capture-bug-open.png`.

Problema: el boton flotante rojo `!` para reportar bugs parece severidad del modelo.

Impacto: en una app con validacion OPM, rojo debe reservarse para problemas del modelo o fallas criticas.

Accion viable: mover feedback a menu de ayuda o cambiarlo a icono neutral con color no-error.

Criterio de salida: ningun control de feedback debe confundirse con alerta metodologica.

## Principios de rediseño

### 1. Separar significado, vista y administracion

Hoy muchas superficies mezclan capas. La regla debe ser simple:

- Significado: cosas, procesos, estados, enlaces, refinamientos.
- Vista: zoom, grid, layout, imagen, estilo.
- Administracion: guardar, importar, exportar, demos, feedback.

Cuando estas capas se mezclan, el usuario no sabe si esta cambiando el modelo o solo su presentacion.

### 2. Hacer visible la deuda metodologica

La app ya detecta deuda. Ahora debe hacerla gobernable. La pregunta no es "hay warnings", sino:

- Que bloquea.
- Que es mejora.
- Que afecta OPL.
- Que afecta solo legibilidad.
- Que puedo resolver ahora.

### 3. Cumplir contratos pequeños

Si una herramienta dice "selecciona dos cosas para ver firmas y preview OPL", debe mostrar firmas y preview OPL. Si un boton dice `Editar OPL`, debe decir que cambios aplicara al modelo. Si `AI Text` no existe, no debe parecer listo.

### 4. Privilegiar el flujo principal

El flujo principal es:

1. Crear SD.
2. Nombrar cosas/procesos.
3. Conectar con enlaces validos.
4. Refinar OPDs.
5. Leer OPL.
6. Corregir issues.
7. Guardar/exportar.

Todo lo que no ayude directamente a ese flujo debe bajar jerarquia visual.

## Plan viable de remediacion

### Fase 0 - Limpieza critica, 1 a 2 dias

- Unificar identidad de modelo en header, pestana, selector, save/export.
- Cerrar automaticamente menus solapados y eliminar labels accesibles duplicados.
- Deshabilitar/marcar claramente funciones futuras como `AI Text`.
- Cambiar color/ubicacion del bug capture.
- Agregar fit-to-view despues de auto-layout.
- Hacer persistente el popover `Tipos validos` hasta entregar preview real.

### Fase 1 - Reordenamiento de barras y paneles, 1 semana

- Reagrupar toolbar en `Modelo`, `Modelar`, `Conectar`, `Vista`, `Validar`, `Ayuda`.
- Crear modo enlace con origen/tipo/destino/previsualizacion OPL.
- Separar issues por estructura/metodologia/legibilidad.
- Convertir OPD tree en navegacion primaria con labels claros y badges.
- Agregar chip de persistencia visible.

### Fase 2 - Inspector y OPL como producto serio, 2 a 3 semanas

- Dividir inspector en tabs semanticos.
- Redisenar creacion de estados con nombres reales y preview OPL.
- Dockear biblioteca o integrarla con OPD tree.
- Rehacer editor OPL con cambios aplicables/no aplicables.
- Mejorar rail minimizado de OPL.

### Fase 3 - Evals UX permanentes

- Crear fixtures de evaluacion con modelos chicos, medianos y grandes.
- Testear flujos: crear SD, enlazar, refinar, filtrar OPL, corregir issue, guardar, importar.
- Guardar screenshots de regresion para desktop/tablet/mobile.
- Medir tiempos y fallos, no solo que el build pase.

## Evals minimos antes de declarar la app "usable"

- Desde canvas vacio, crear proceso + objeto + link resultado en menos de 60 segundos.
- Crear el mismo link por click-click y por drag source-target.
- Cargar fixture/import JSON y ver nombre consistente en todas las superficies.
- Navegar 8 OPDs y distinguir tipo de refinamiento sin abrir documentacion.
- Leer un warning metodologico completo a 1280x720 sin truncamiento grave.
- Seleccionar una entidad y obtener OPL filtrado relevante.
- Ejecutar auto-layout y quedar con el OPD visible completo.
- Guardar un modelo importado y entender si quedo local, versionado o pendiente.
- En mobile, revisar OPD/OPL/issues sin toolbar saturada.

## Cierre

La app tiene suficiente funcionalidad para justificar una UX mas estricta. El proximo salto no es agregar mas capacidades; es bajar entropia, hacer visibles los estados del sistema y convertir cada herramienta en un contrato pequeno, cumplido y verificable.

La recomendacion dura: congelar por un sprint la incorporacion de botones nuevos y dedicarlo a control plane, toolbar, enlaces, issues, inspector y OPL. Ese sprint no se veria espectacular en una demo superficial, pero aumentaria de forma real el valor validado de la herramienta.
