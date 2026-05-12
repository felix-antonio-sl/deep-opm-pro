# Auditoria UI/UX ronda 4 - nuevas caracteristicas OPM

Fecha: 2026-05-12
Target solicitado: `http://138.201.53.205:5173/`
Metodo: uso exploratorio con navegador interno, contraste con Chrome headless sobre URL publica, capturas persistidas en `screenshots/`.
Rol simulado: modelador OPM avanzado, exigente en control visual, bimodalidad OPD/OPL, auditabilidad y bajo ruido operacional.

## Alcance real

El navegador interno volvio a fallar contra la IP publica por timeout/bloqueo, aunque el host respondio `HTTP/1.1 200 OK` por `curl` y Chrome headless si pudo abrir `http://138.201.53.205:5173/`. Para no detener la investigacion, la interaccion profunda se hizo contra la app local viva en `http://localhost:5173/` levantada desde este checkout, y se agregaron capturas de control del endpoint publico.

Las observaciones aplican a la superficie publicada porque el endpoint publico muestra la misma reorganizacion funcional y carga el fixture `App modeladora OPM deseada`.

## Veredicto

La app dio un salto claro desde la auditoria anterior. Ya hay control plane mas legible, identidad de modelo mas consistente, biblioteca dock, inspector resizable, mapa, simulacion, validacion separada y fixtures amplios cargables desde la URL publica. El producto ya tiene materia de modelador OPM real.

La critica: aun se siente como una herramienta poderosa que no termina de gobernar su propia complejidad. Las funciones existen, pero varias compiten por el mismo espacio, quedan estados pegajosos invisibles, y algunos paneles se apilan sin una regla clara de prioridad. Para OPM esto importa: si el usuario no entiende con certeza que modo, OPD, enlace, validacion y OPL esta manipulando, pierde confianza semantica.

## Mejoras confirmadas

- La toolbar ahora esta agrupada en `Modelo`, `Modelar`, `Conectar`, `Vista`, `Validar`, `Ayuda`. Es mucho mas orientable que la barra plana anterior.
- El estado vacio desktop ya ofrece arranque directo: `Crear proceso`, `Agregar objeto`, `Agregar agente/instrumento`, `Abrir asistente`.
- La identidad del fixture amplio esta mejor: header y pestana muestran `App modeladora OPM deseada`.
- La validacion distingue bloqueos estructurales, mejoras metodologicas y estilo/legibilidad.
- El arbol OPD muestra tipo de refinamiento y conteos por OPD.
- La biblioteca dock reduce el costo de busqueda respecto al overlay anterior.
- El inspector resizable existe y permite recuperar espacio para modelos amplios.
- El flujo objeto/proceso/enlace resultado funciona y actualiza OPL: `Proceso genera Objeto`.
- La URL publica incluye el modelo amplio y el catalogo de fixtures completo.

## Hallazgos prioritarios

### P0 - La app marca como sucio el modelo por acciones de exploracion

Evidencia: `07-sd-sync-cargado-para-invocacion.png`, `08-sd-sync-sd1-invocaciones.png`.

Despues de usar biblioteca/auto-layout e intentar cargar otro demo, aparece `Hay cambios sin guardar`. Para un fixture, una accion visual o de navegacion no deberia obligar a guardar/descartar salvo que haya mutado el modelo. Si auto-layout es mutacion persistente, debe decirlo antes o mostrar `Aplicar layout al modelo`.

Accion viable: separar estado `dirtyModel` de `dirtyView/layoutDraft`. Cargar fixture, abrir biblioteca, navegar OPDs, expandir paneles y cambiar zoom no deben bloquear carga de otro modelo.

### P0 - Mapa y simulacion pueden quedar activos a la vez sin jerarquia modal

Evidencia: `14-mapa-sistema-modal.png`, `15-simulacion-panel.png`, `16-simulacion-paso-sobre-mapa.png`.

El mapa ocupa el centro y luego la simulacion se monta encima como barra/estado, pero el canvas semantico queda reemplazado por el mapa. Al ejecutar `Paso`, la simulacion completa, pero el usuario no ve con claridad el proceso activo en el OPD porque sigue mirando el mapa.

Accion viable: definir modos mutuamente excluyentes: `Modelar`, `Mapa`, `Simular`. Si simulacion parte desde mapa, cerrar mapa o convertirlo explicitamente en vista de simulacion. El usuario no debe adivinar que superficie es la primaria.

### P1 - Biblioteca dock duplica estructura y controles

Evidencia: `03-biblioteca-dock-modelo-amplio.png`, `19-url-publica-biblioteca-dock.png`.

El dock muestra `Biblioteca` dos veces y dos botones `x`: uno del contenedor dock y otro del panel interno. La lista funciona, pero el wrapper comunica que hay dos bibliotecas anidadas. En un panel lateral estrecho, esa redundancia consume espacio y baja confianza.

Accion viable: cuando la biblioteca este dockeada, renderizar solo una cabecera, un buscador, filtros y lista. El componente interno no debe traer su propia chrome de overlay.

### P1 - Arbol OPD demasiado denso para ser navegacion primaria

Evidencia: `02-app-modeladora-demo-cargada-identidad.png`, `21-publica-tablet-app-demo.png`.

El arbol ahora contiene informacion valiosa, pero cada nodo expone demasiados controles permanentes: `Abrir`, `Renombrar`, `Crear refinamiento`, borrar, badges y nombres truncados. En tablet se recorta de forma agresiva.

Accion viable: mostrar acciones principales por hover/focus o menu contextual; dejar visibles solo tipo, nombre, conteos e issues. En tablet, usar panel full-height alternable en vez de columna comprimida.

### P1 - Auto-layout aun no termina en encuadre confiable

Evidencia: `05-autolayout-modelo-amplio-root.png`, `06-inspector-resizable-expandido.png`.

La pasada visual corrigio problemas de routing y ranking estructural, pero el resultado aun deja objetos parcialmente fuera del area visible o exige reparar camara con scroll. Un auto-layout que no entrega lectura inmediata se siente incompleto.

Accion viable: despues de aplicar layout, ejecutar fit-to-view con margen o mostrar accion primaria `Encajar OPD`. Si el usuario movio la camara manualmente, ofrecer undo claro de layout.

### P1 - Tipos validos no guia suficientemente el enlace real

Evidencia: `12-tipos-validos-sin-seleccion.png`, `13-conectar-como-resultado-desde-inspector.png`.

`Tipos validos` abre un popover que dice "Selecciona dos cosas", pero no muestra cuales son seleccionables ni como completar el flujo. El inspector si ofrece `Conectar como resultado` y crea el enlace correcto, pero ese camino queda escondido tras una seleccion implicita.

Accion viable: en modo enlace, resaltar origen, destinos validos, destinos invalidos y preview OPL. El popover debe cambiar de estado con la seleccion actual y no quedarse en instruccion generica.

### P1 - Estado sticky confuso durante creacion

Evidencia: `11-flujo-creacion-objeto-proceso.png`, `12-tipos-validos-sin-seleccion.png`, `13-conectar-como-resultado-desde-inspector.png`.

Tras crear objeto/proceso, la UI conserva `Modo sticky: Objeto` mientras la toolbar marca otra accion y el inspector esta sobre proceso/enlace. Ese desalineamiento es pequeno visualmente, pero peligroso: el usuario no sabe que se insertara si hace clic en canvas.

Accion viable: una sola barra de modo con estado canonico: `Insertando objeto`, `Insertando proceso`, `Conectando resultado`, `Seleccion`. Al seleccionar otra herramienta, cancelar el sticky anterior.

### P1 - Editor inline queda vivo despues de cambiar contexto

Evidencia: `13-conectar-como-resultado-desde-inspector.png`.

Despues de crear el enlace resultado, queda abierto el editor de nombre del objeto en el canvas mientras el inspector ya muestra `Enlace Resultado`. Esto cruza dos contextos de edicion y bloquea visualmente el diagrama.

Accion viable: cerrar/confirmar editor inline al cambiar seleccion, al crear enlace o al abrir modo conexion. Ninguna edicion inline debe convivir con inspector de otra entidad/enlace.

### P2 - Menus superiores mejoraron, pero siguen invadiendo superficie de trabajo

Evidencia: `09-menu-principal-largo-sobre-arbol.png`, `10-menu-mas-acciones-apariencia.png`.

El menu principal esta mejor estructurado, pero cae sobre arbol y canvas, y su altura puede exceder la pantalla. `Mas acciones` cae sobre el inspector/validacion. Son acciones auxiliares, pero visualmente interrumpen las superficies primarias.

Accion viable: menus con max-height, scroll interno, secciones mas compactas y cierre mutuo garantizado. Acciones de apariencia pueden vivir en un panel de vista en vez de flotar sobre validacion.

### P2 - Responsive mobile queda como revision incompleta

Evidencia: `20-publica-mobile-inicial.png`, `21-publica-tablet-app-demo.png`.

Mobile tiene tabs inferiores (`Canvas`, `OPDs`, `OPL`, `Issues`), lo que es buena direccion. Pero el canvas inicial queda vacio: desaparece el bloque `Iniciar SD`, asi que el usuario no sabe como partir. Tablet comprime todo y recorta arbol, toolbar y panel derecho.

Accion viable: declarar mobile como modo revision/navegacion y poner el arranque en una hoja full-screen si se permite crear. Para tablet, usar paneles alternables y no columnas desktop comprimidas.

### P2 - Microcopy y consistencia linguistica

Evidencia: `01-estado-inicial-toolbar-reorganizada.png`, `02-app-modeladora-demo-cargada-identidad.png`, `11-flujo-creacion-objeto-proceso.png`.

Persisten textos sin tilde o poco naturales: `mejoras metodologicas`, `validacion`, `accion`, `pestana`, `Respeta` sin contexto, `AI BETA` ocupando accion primaria aunque parece futura. No es solo cosmetica: la precision textual sostiene la precision metodologica.

Accion viable: normalizar copia en espanol, tooltip para terminos compactos, y estados beta deshabilitados o secundarios hasta que tengan contrato claro.

## Notas de campo

- La app mejoro donde mas dolia: identidad, agrupacion de toolbar, validacion y arranque. El progreso es real.
- La superficie todavia tiene demasiados estados visibles simultaneos. En OPM, menos ambiguedad vale mas que mas botones.
- La bimodalidad OPD/OPL esta viva: el OPL se actualiza correctamente al crear `Resultado`. Hay que proteger esa fortaleza haciendo mas claro cuando se edita modelo y cuando se edita texto.
- La biblioteca y el mapa son valiosos, pero hoy compiten con canvas/arbol/inspector. Deben sentirse como instrumentos acoplados, no como capas oportunistas.
- El proximo salto no es agregar features: es gobernar modos, paneles y dirty-state.

## Evidencia capturada

1. `01-estado-inicial-toolbar-reorganizada.png`
2. `02-app-modeladora-demo-cargada-identidad.png`
3. `03-biblioteca-dock-modelo-amplio.png`
4. `04-seleccion-desde-biblioteca-con-inspector.png`
5. `05-autolayout-modelo-amplio-root.png`
6. `06-inspector-resizable-expandido.png`
7. `07-sd-sync-cargado-para-invocacion.png`
8. `08-sd-sync-sd1-invocaciones.png`
9. `09-menu-principal-largo-sobre-arbol.png`
10. `10-menu-mas-acciones-apariencia.png`
11. `11-flujo-creacion-objeto-proceso.png`
12. `12-tipos-validos-sin-seleccion.png`
13. `13-conectar-como-resultado-desde-inspector.png`
14. `14-mapa-sistema-modal.png`
15. `15-simulacion-panel.png`
16. `16-simulacion-paso-sobre-mapa.png`
17. `17-url-publica-estado-inicial.png`
18. `18-url-publica-app-modeladora-cargada.png`
19. `19-url-publica-biblioteca-dock.png`
20. `20-publica-mobile-inicial.png`
21. `21-publica-tablet-app-demo.png`

## Orden recomendado de remediacion

1. Corregir dirty-state: distinguir mutacion semantica de navegacion/layout exploratorio.
2. Hacer modos mutuamente excluyentes: modelar, mapa, simulacion, enlace.
3. Simplificar biblioteca dock y cerrar duplicacion de cabecera.
4. Resolver sticky mode e inline editor cruzado.
5. Dar al modo enlace un flujo guiado con preview OPL.
6. Ajustar auto-layout para terminar con fit-to-view.
7. Redisenar responsive: mobile revision, tablet paneles alternables.
8. Limpieza de microcopy y tooltips.
