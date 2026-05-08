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

## Criterio de salida sugerido para la proxima iteracion

- Cargar `Cafetera Domestica` deja el mismo nombre en header, tab y estado activo.
- Crear `Proceso -> Resultado -> Objeto` funciona tanto por click-click como por drag.
- Un warning metodologico se puede abrir en modo lectura sin truncamiento ni palabras partidas.
- `Tipos validos` muestra preview OPL despues de seleccionar dos cosas y no desaparece.
- Estado vacio permite construir un SD minimo guiado en menos de 60 segundos: proceso central, transformee, agent/instrument y OPL equivalente.
