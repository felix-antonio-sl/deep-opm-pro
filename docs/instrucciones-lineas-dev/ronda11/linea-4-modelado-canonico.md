# Línea 4 — Modelado canónico (drag desde toolbar + biblioteca + reanclaje + lote + propiedades enlace)

## 1. Misión

Cerrar **EPICA-10 creación de cosas** (3 pendientes + 9 parciales = 12 HU vivas) y **EPICA-11 modelado básico** (6 pendientes + 4 parciales = 10 HU vivas), 22 HU totales, llevando el flujo de creación y edición a la UX canónica de OPCloud:

- **Drag desde Toolbar al canvas**: arrastrar el botón "Objeto" o "Proceso" suelta una cosa en la posición del cursor.
- **Tabla de tipos de enlace contextual**: al iniciar enlace desde una cosa, aparece menú flotante con tipos válidos según firma origen-destino, con previsualización OPL de cada tipo.
- **Biblioteca de cosas lateral**: panel adicional que lista entidades del modelo + permite drag-drop al canvas para reusar (HU-10.017/.018).
- **Edición de descripción** desde Inspector (HU-10.004).
- **Reanclar extremo de enlace** a otro puerto del shape (HU-11.020): drag del extremo de un enlace para moverlo a otro punto del mismo shape.
- **Conectar multi-selección al todo con un gesto** (HU-11.007): múltiple selecciona partes, gesto único conecta todas como agregación al objeto destino.
- **Borrar enlaces seleccionados en lote** (HU-11.023).
- **Diálogo propiedades visuales del enlace** (HU-11.016) y **copiar estilo** (HU-11.017).
- **Iniciar enlace desde zona de borde respetando handles** (HU-11.025).
- **Crear cosa y partes en secuencia sobre el mismo OPD** (HU-11.001): tras crear cosa con modo barra sticky, modo continúa; agregar puede ser una operación recurrente.

Slice mínimo entregable: feature **modelado canvas + UI inspector** sin tocar OPL ni persistencia. Toda la lógica vive en `Toolbar.tsx` extendido + `InspectorEnlace.tsx` extendido + `inspectorEnlace/*` + nuevos `BibliotecaCosa.tsx` y `MenuTipoEnlace.tsx` + `operaciones/enlaces.ts` extendido.

**Fuera de slice**:
- No tocar refinamiento (territorio ronda 10 L3).
- No tocar imágenes (territorio ronda 10 L4).
- No tocar grid/snap/autosize (territorio ronda 10 L1).
- No tocar OPL panel (territorio L3).
- No tocar persistencia (territorio L2).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L4 |
|---|---|---|
| HU-10.001 — Crear proceso por arrastre | parcial → cubierto | `Toolbar.tsx` botones "Proceso"/"Objeto" con `draggable=true`; al soltar sobre canvas, dispatch `crearProcesoEnPosicion(canvasPos)` o `crearObjetoEnPosicion`. |
| HU-10.002 — Crear objeto por arrastre | parcial → cubierto | Idem HU-10.001 para objetos. |
| HU-10.003 — Nombrar cosa recién creada | parcial → cubierto | Después de crear, modal pequeño con input nombre + foco automático. Enter confirma, Esc descarta. |
| HU-10.004 — Editar descripción opcional | pendiente | Sección descripción en Inspector ya existe (`SeccionDescripcion.tsx`); verificar wiring completo + smoke. |
| HU-10.007 — Iniciar enlace desde borde de cosa | parcial → cubierto | Hover sobre borde muestra puerto visual; click+drag inicia enlace en modo. Comportamiento ya existente, completar UX con feedback visible. |
| HU-10.008 — Tabla solo tipos válidos | parcial → cubierto | Nuevo `MenuTipoEnlace.tsx`: al iniciar enlace y antes de soltar destino, panel flotante con tipos válidos según `validarFirmaEnlace` para origen/destino candidatos. |
| HU-10.009 — Previsualización OPL por tipo | pendiente | Cada item en `MenuTipoEnlace` muestra preview de oración OPL ej: "[A] consume [B]" / "[A] requiere [B]". Usa generador OPL para preview. |
| HU-10.010 — Filtrar agente cuando objeto no físico | parcial → cubierto | En `MenuTipoEnlace`, si origen es objeto NO-físico (informacional), excluir tipo "agente" de la lista. Lógica vía `validarFirmaEnlace`. |
| HU-10.011 — Confirmar tipo y cerrar tabla | parcial → cubierto | Click en tipo confirma + cierra menú; Enter sobre item enfocado equivalente. |
| HU-10.017 — Ver cosa en biblioteca lateral | pendiente | Nuevo `BibliotecaCosa.tsx` panel lateral: lista todas las entidades del modelo agrupadas por tipo (objeto/proceso) con íconos. |
| HU-10.018 — Ver cosa en navegador OPD | parcial → cubierto | Cada entidad en biblioteca muestra en qué OPDs aparece como apariencia. Click en OPD navega. |
| HU-10.021 — Descomposición de objeto en mismo diagrama | parcial → cubierto | Verificar despliegue por inzoom funciona correctamente con objetos (no solo procesos). HU-10.021 dice "C priority", revisar criterio. |
| HU-11.001 — Crear cosa y partes en secuencia | pendiente | Modo barra creación sticky (ya existe); cada click crea nueva cosa sin desactivar modo. Verificar wiring + smoke explícito. |
| HU-11.007 — Conectar multi-selección al todo | pendiente | Con multi-selección activa de objetos parte + selección secundaria de objeto todo, atajo `Ctrl+Shift+A` o botón crea agregaciones desde cada parte al todo. |
| HU-11.012 — Crear enlace estructural etiquetado | parcial → cubierto | Verificar exhibición/generalización/clasificación + etiqueta funcionan completos. |
| HU-11.013 — Editar propiedades enlace por menú contextual | parcial → cubierto | Right-click sobre enlace abre menú con opciones (Multiplicidad, Modificador, Estilo, Eliminar). Wiring ya parcial via `InspectorEnlace`; agregar menú contextual canvas. |
| HU-11.016 — Diálogo propiedades visuales enlace | pendiente | Botón "Estilo" en Inspector enlace abre `DialogoEstiloEnlace.tsx` con paleta de colores, grosor, tipo de línea (continua/discontinua/punteada). Usa palette cerrada. |
| HU-11.017 — Copiar estilo de enlace a otro | pendiente | Atajos: con enlace seleccionado, "Copiar estilo" guarda `enlaceEstiloPortapapeles`; "Pegar estilo" sobre otro enlace lo aplica. Botones en Inspector + atajos `Ctrl+Alt+C` / `Ctrl+Alt+V`. |
| HU-11.020 — Reanclar extremo a otro puerto | pendiente | Tools de enlace (ya hay `linkTools.Vertices`, `linkTools.Segments`) extender con `linkTools.SourceArrowhead` y `TargetArrowhead` que permiten drag de extremo. Persiste vía `apuntarExtremoEnlace`. |
| HU-11.023 — Borrar enlaces seleccionados en lote | pendiente | Con multi-selección que incluya enlaces, tecla `Delete` borra todos. Acción `eliminarEnlacesSeleccionados()` en `acciones-canvas.ts`. |
| HU-11.025 — Iniciar enlace respetando handles | parcial → cubierto | Cuando hay handles de resize visibles (ronda 10 L1), no iniciar enlace si click en handle. Ya parcial; completar separación. |
| HU-11.026 — Tabla filtrada por dirección y tipo | parcial → cubierto | `MenuTipoEnlace` ya filtra; agregar filtro adicional por dirección (entrante vs saliente desde shape activo). |

**Total esperado**: 22 HU vivas → cubiertas.

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §firmas de enlace: validar tipos por firma kernel.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` §propiedades visuales: paleta cerrada de colores y estilos.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` D5/T1: oraciones por tipo de enlace para preview.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/MenuesAndCommands/sideMenu/sideMenu.component.ts` — drag desde toolbar al canvas.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/linkConfigurationOperations.ts` — tabla de tipos de enlace contextual.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/edit-link-dialog/` — diálogo propiedades visuales.
- **Estado actual del código (post-ronda-10)**:
  - `app/src/ui/Toolbar.tsx` (~340 LOC ronda 10): tiene botones modelado, alinear/distribuir, grid, modo imagen. **L4 agrega `draggable` + `onDragStart` a botones Objeto/Proceso.**
  - `app/src/ui/InspectorEnlace.tsx` (~120 LOC ronda 8 + 10): tiene secciones extremos/multiplicidad/modificador/etiqueta. **L4 agrega botón "Estilo" + "Copiar estilo" + sub-componente.**
  - `app/src/ui/inspectorEnlace/SeccionExtremos.tsx`: tiene Mover Puerto (ronda 10 L2). **L4 agrega botón Reanclar (HU-11.020) que activa modo drag de extremo en canvas.**
  - `app/src/modelo/operaciones/enlaces.ts` (ronda 10 L1+L2): tiene `crearEnlace`, `apuntarExtremoEnlace`, `moverPuertoEnlace`, `aplicarSubtipoModificador`, `validarFirmaEnlace`. **L4 agrega `eliminarEnlacesBatch`, `copiarEstiloEnlace`.**
  - `app/src/canvas/operacionesBatch.ts` (ronda 10 L1): tiene `eliminarBatch`, `aplicarEstiloEnlaces`, `conectarMultiAlTodo`. **L4 verifica `conectarMultiAlTodo` está completo + agrega smoke.**
  - `app/src/render/jointjs/handlers/seleccion.ts`: tiene click handlers. **L4 agrega `onmousedown` sobre Toolbar buttons + drop handler en paper.**
  - `app/src/render/jointjs/handlers/toolsEnlace.ts`: tiene `linkTools.Vertices`, `linkTools.Segments`. **L4 agrega `linkTools.SourceArrowhead` + `linkTools.TargetArrowhead` para reanclar HU-11.020.**

## 4. Archivos permitidos

```text
app/src/modelo/tipos/enlace.ts                    EDIT aditivo (Enlace.estilo? extendido si añade campos visuales)
app/src/modelo/operaciones/enlaces.ts             EDIT extiende (eliminarEnlacesBatch, copiarEstiloEnlace)
app/src/modelo/etiquetasEnlace.ts                 EDIT aditivo (helpers etiqueta si necesario)
app/src/modelo/estilos.ts                         EDIT aditivo (extiende paleta o helpers estilo enlace)
app/src/canvas/operacionesBatch.ts                EDIT extiende (eliminarEnlacesBatch + verificar conectarMultiAlTodo completo)
app/src/canvas/operacionesBatch.test.ts           EDIT aditivo
app/src/render/jointjs/handlers/seleccion.ts      EDIT aditivo (drop handler para drag desde Toolbar, separar handle de cosa)
app/src/render/jointjs/handlers/toolsEnlace.ts    EDIT extiende (SourceArrowhead + TargetArrowhead tools)
app/src/render/jointjs/handlers/drag.ts           EDIT aditivo (drag de extremo enlace para reanclar)
app/src/render/jointjs/composers/enlace.ts        EDIT aditivo (estilos visuales completos)
app/src/store/tipos.ts                            EDIT aditivo (~8 acciones nuevas)
app/src/store/modelo/acciones-canvas.ts           EDIT extiende (reanclarExtremoEnlaceSeleccionado, eliminarEnlacesSeleccionados, copiarEstiloEnlaceSeleccionado, pegarEstiloEnlaceSobre, conectarMultiAlTodoSeleccionada)
app/src/store/modelo/acciones-enlace.ts           EDIT extiende (seleccionarEnlaceEspecifico si aplica, abrirDialogoEstiloEnlace)
app/src/store/modelo/acciones-entidad.ts          EDIT aditivo (crearObjetoEnPosicion, crearProcesoEnPosicion si no existían)
app/src/ui/Toolbar.tsx                            EDIT aditivo (draggable + onDragStart en botones cosa)
app/src/ui/InspectorEnlace.tsx                    EDIT extiende (botón Estilo, Copiar estilo, Pegar estilo, Reanclar)
app/src/ui/inspectorEnlace/SeccionExtremos.tsx    EDIT aditivo (botón Reanclar)
app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx EDIT aditivo (filtros tabla)
app/src/ui/inspectorEnlace/SeccionEstilo.tsx      NUEVO (sub-componente con paleta de colores + grosor + dash)
app/src/ui/DialogoEstiloEnlace.tsx                NUEVO (modal propiedades visuales)
app/src/ui/MenuTipoEnlace.tsx                     NUEVO (panel flotante tipos válidos con preview OPL)
app/src/ui/BibliotecaCosa.tsx                     NUEVO (panel lateral biblioteca)
app/src/ui/inspector/SeccionDescripcion.tsx       EDIT aditivo (verificar HU-10.004 completo)
app/src/ui/MenuContextualEnlace.tsx               NUEVO opcional (right-click sobre enlace)
app/src/render/jointjs/handlers/menuContextual.ts NUEVO opcional (cablear contextmenu sobre enlaces)
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smokes modelado L4)
opm-extracted/**                                  LECTURA
docs/HANDOFF.md                                   LECTURA
docs/historias-usuario-v2/**                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `acciones-opd.ts`** (territorio L1).
- **No tocar `ArbolOpd.tsx`, `arbol/*`** (territorio L1).
- **No tocar `Dialogo{Cargar,GuardarComo,Versiones,Archivados,BuscarGlobal,GestionArbol}.tsx`, `MenuPrincipal.tsx`, `PantallaInicio.tsx`** (territorio L1+L2).
- **No tocar `PanelOpl.tsx`, `panelOpl/*`** (territorio L3).
- **No tocar `runtime.ts`, `progress-dashboard.mjs`** (territorio L5).
- **No tocar `ModalImagenObjeto.tsx`, `composers/imagenOverlay.ts`, `imagenObjeto.ts`** (territorio ronda 10 L4).
- **No tocar `ModalConfiguracionGrid.tsx`, `composers/grid.ts`, `canvas/grid.ts`** (territorio ronda 10 L1).
- **No tocar refinamiento**: `operaciones/refinamiento/*` (ronda 9 L1 + ronda 10 L3).
- **`Toolbar.tsx`**: L4 agrega solo `draggable` + handlers a botones existentes Objeto/Proceso. L2 agrega glifo autosalvado (sección distinta). L5 agrega indicador read-only (sección distinta). Hunks disjuntos.
- **`acciones-canvas.ts`**: L4 agrega 5 acciones modelado. L3 agrega 5 acciones panel OPL. Hunks disjuntos.
- **`tipos/enlace.ts`**: L4 puede extender `EnlaceEstilo` si paleta lo requiere. Aditivo, sin remover campos.

## 6. Comportamiento esperado

- **Drag desde Toolbar al canvas**: `<button draggable onDragStart={...}>` setea `dataTransfer.setData("application/x-opm-tipo", "objeto"|"proceso")`. Canvas (paper element) tiene `onDrop` que lee tipo + calcula posición + dispatch `crearObjetoEnPosicion(pos)` o `crearProcesoEnPosicion`.
- **MenuTipoEnlace**: aparece como popover sobre el canvas cuando se inicia enlace y se hace hover sobre destino candidato. Muestra lista de tipos VÁLIDOS según `validarFirmaEnlace(modelo, origen, destino, tipo)`. Cada item muestra:
  - Icon del tipo de enlace.
  - Nombre del tipo (en español).
  - Preview OPL: `<small>{previewOpl}</small>` ej: "Objeto consume Proceso".
  - Click confirma + ejecuta `crearEnlace`.
  - Filtros adicionales: dirección entrante/saliente, tipo válido.
- **BibliotecaCosa**: panel colapsable a la izquierda (entre árbol y canvas) o derecho (alternativo). Lista entidades del modelo agrupadas por tipo:
  ```
  ▼ Objetos (3)
    🟢 Documento [editado: hace 5 min]
    🟢 Sistema
    🟢 Usuario
  ▼ Procesos (2)
    🔵 Procesar
    🔵 Validar
  ```
  Cada entidad clickeable: hover muestra OPDs donde aparece, click navega al primer OPD que la contiene. Drag desde biblioteca al canvas crea apariencia (no nueva entidad) en el OPD activo si no existe ya.
- **Reanclar extremo**: con enlace seleccionado, tools muestran flechas en source/target. Drag de la flecha permite reposicionar el extremo. Drop:
  - Sobre otro punto del mismo shape → cambia coordenadas relativas (dock).
  - Sobre otro shape compatible → llama `apuntarExtremoEnlace` (cambio de extremo, ya existe).
  - Sobre vacío → cancela.
- **Diálogo propiedades visuales**: paleta cerrada de colores: `#475467`, `#d92d20`, `#0e7c66`, `#1d4ed8`, `#ca8a04`, `#9333ea` (semánticos: default/error/success/info/warn/special). Grosor: 1, 1.5, 2, 3px. Estilo línea: continua/discontinua/punteada.
- **Copiar/Pegar estilo**: store guarda `enlaceEstiloPortapapeles: EnlaceEstilo | null`. Atajos `Ctrl+Alt+C` (copiar desde seleccionado), `Ctrl+Alt+V` (pegar sobre seleccionado o sobre el siguiente clickeado).
- **Borrar enlaces lote**: si selección incluye ≥1 enlace, `Delete` o `Backspace` ejecuta `eliminarEnlacesSeleccionados()` que filtra solo enlaces.
- **Conectar multi al todo**: con multi-selección de partes (entidades) y un objeto destinatario "todo", botón en Toolbar o atajo `Ctrl+Shift+A` crea N enlaces de agregación (parte→todo). Mensaje: "N partes agregadas a [Todo]".
- **Modo barra creación sticky** (HU-11.001): ya existe en ronda 7. L4 verifica + agrega smoke explícito que tras crear cosa, modo continúa activo.
- **Iniciar enlace respetando handles**: si click sobre handle de resize (8 handles cuadrados visibles), NO iniciar enlace. Ya hay parcial; completar separación lógica.
- **Menú contextual sobre enlace**: right-click sobre cualquier enlace abre menú: Multiplicidad / Modificador / Estilo / Reanclar / Eliminar. Cada item dispara la acción correspondiente (abre Inspector enfocado en sección o ejecuta).

## 7. Pruebas requeridas

**Unit tests**:

- `enlaces.test.ts`: `eliminarEnlacesBatch(modelo, ids[])` elimina solo los IDs y limpia apariencias.
- `etiquetasEnlace.test.ts`: `copiarEstiloEnlace(origenId)` retorna `EnlaceEstilo`; `aplicarEstiloEnlaces([targetId], estilo)` lo aplica.
- `operacionesBatch.test.ts`: extender tests de `conectarMultiAlTodo` con casos parte/todo distintos.

**Smoke browser** (~10 nuevos):

- "Drag desde Toolbar suelta cosa en posición exacta": drag botón Proceso, drop en (300, 200), verificar apariencia creada en (300, 200).
- "MenuTipoEnlace muestra tipos válidos con preview OPL": iniciar enlace de objeto a proceso, hover sobre proceso, ver menú con consumo/efecto/instrumento/agente con previews.
- "MenuTipoEnlace filtra agente para objeto informacional": idem pero con objeto informacional, agente NO visible.
- "BibliotecaCosa lista entidades agrupadas": modelo con 3 objetos + 2 procesos, panel muestra ambos grupos correctamente.
- "BibliotecaCosa drag al canvas crea apariencia": drag entidad existente al OPD activo, verificar nueva apariencia (no nueva entidad).
- "Reanclar extremo enlace por drag de flecha": enlace seleccionado, drag source arrow a otro shape, verificar extremo movido.
- "Borrar enlaces lote con Delete": multi-seleccionar 3 enlaces, presionar Delete, verificar 0 enlaces.
- "Copiar y pegar estilo entre enlaces": setear color rojo en enlace A, Ctrl+Alt+C, click enlace B, Ctrl+Alt+V, verificar B con color rojo.
- "DialogoEstiloEnlace aplica paleta cerrada": abrir dialog, click swatch verde, confirmar, verificar enlace verde.
- "Modo barra creación sticky": activar modo Objeto, click en canvas crea, mismo modo activo, click otro lugar crea, modo sigue activo hasta Esc.

## 8. Métricas esperadas

- **Tests aditivos**: ~10 unit + 10 smokes nuevos.
- **HU cerradas**: 22 HU vivas (12 EPICA-10 + 10 EPICA-11).
- **Reglas detector ronda 11 que esta línea aporta**:
  - HU-10.001/.002 → 1 regla (drag desde toolbar).
  - HU-10.003 → 1 regla (modal nombre tras crear).
  - HU-10.004 → 1 regla (descripción inspector verificada).
  - HU-10.007/.008/.009/.010/.011 → 1 regla (MenuTipoEnlace + filtros + previews).
  - HU-10.017/.018 → 1 regla (BibliotecaCosa + navegación OPD).
  - HU-11.001 → 1 regla (modo creación sticky verificado).
  - HU-11.007 → 1 regla (conectar multi al todo).
  - HU-11.012/.013 → 1 regla (estructural etiquetado + menú contextual).
  - HU-11.016/.017 → 1 regla (DialogoEstiloEnlace + copiar estilo).
  - HU-11.020 → 1 regla (reanclar extremo).
  - HU-11.023 → 1 regla (eliminar enlaces lote).
  - HU-11.025 → 1 regla (iniciar enlace respeta handles).
  - HU-11.026 → 1 regla (tabla filtrada por dirección).
  - **Total estimado**: 13 reglas nuevas (la línea con más reglas).
- **Build**: chunk principal + ~10-15 KB (BibliotecaCosa + MenuTipoEnlace + DialogoEstiloEnlace). Considerar lazy chunk si excede 15 KB.
- **Smoke browser**: 59 → ~75 (con L1+L2+L3).

## 9. Loop verde y commits

```bash
cd app
bun run check          # 597 → ~625 unit
bun run browser:smoke  # 59 → ~78 (con L1+L2+L3)
bun run build          # main chunk objetivo < 180 KB / < 48 KB gzip
```

Commits sugeridos:

1. `feat(canvas): drag desde Toolbar al canvas crea cosa en posición (HU-10.001/.002/.003)`
2. `feat(ui): MenuTipoEnlace con tipos válidos + preview OPL + filtros (HU-10.008/.009/.010/.011/.026)`
3. `feat(ui): BibliotecaCosa lateral con drag-drop al canvas (HU-10.017/.018)`
4. `feat(canvas): conectar multi-selección al todo en un gesto (HU-11.007)`
5. `feat(canvas): borrar enlaces seleccionados en lote (HU-11.023)`
6. `feat(enlace): reanclar extremo con tools SourceArrowhead/TargetArrowhead (HU-11.020)`
7. `feat(enlace): DialogoEstiloEnlace + copiar/pegar estilo (HU-11.016/.017)`
8. `feat(canvas): menú contextual sobre enlace + propiedades (HU-11.013)`
9. `feat(canvas): iniciar enlace respeta handles de resize (HU-11.025)`
10. `feat(inspector): descripción opcional + verificación HU-10.004`
11. `test(e2e): smokes modelado L4 (10 nuevos)`

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Drag desde Toolbar choca con drag interno de JointJS**: paper tiene su propio drag. | `dataTransfer.setData` específico `application/x-opm-tipo`; `onDrop` del paper-host (div padre) lo intercepta antes de que JointJS reciba. Verificar con smoke. |
| **MenuTipoEnlace con preview OPL es costoso**: generar oración por cada tipo en hover. | Memoizar preview por (origenId, destinoId, tipo). Re-evaluar solo si cambian endpoints. |
| **BibliotecaCosa con muchas entidades (>100) causa scroll problemático**. | Virtualización opcional con `useVirtualizer` o solo renderizar visible. Para MVP-α (<50 entidades típicas), aceptable sin virtualización. |
| **Reanclar extremo conflicto con vértices manuales (HU-11.018)**: si enlace tiene vertices, drag de flecha podría confundirse con drag de vertice. | `linkTools.SourceArrowhead` y `Vertices` son herramientas distintas en JointJS; cada una con su handle visual diferenciable. Documentar UX. |
| **`enlaceEstiloPortapapeles` persiste entre sesiones inadvertidamente**. | Guardar solo en `OpmStore` runtime, NO en `WorkspaceIndice`. Se pierde al recargar. Comportamiento esperado. |
| **Paleta cerrada vs deseo del usuario**: paleta de 6 colores puede no cubrir necesidades. | Documentar paleta como contrato MVP-α. Ronda futura puede agregar color picker custom si producto lo justifica. |
| **HU-11.020 reanclar a otro puerto del MISMO shape**: requiere coordenadas relativas dentro del shape. | JointJS soporta `connector` con `connectionPoint` específico. Usar `magnetT` y `magnetS` con offsets del bbox del shape. |
| **MenuContextualEnlace vs DialogoEstiloEnlace UX confuso**: dos formas de editar estilo. | Menú contextual abre Inspector enfocado en sección específica (no abre dialogo). DialogoEstiloEnlace solo desde botón explícito en Inspector. |
| **HU-10.003 modal nombre tras crear** rompe flujo rápido del operador power-user. | Modal con foco automático en input + Enter inmediato confirma. Toggle en preferencias `omitirModalNombre?` para desactivar. |

## 11. Salida esperada

Al cierre de L4, el operador debe poder:

- Crear cosas arrastrando botones desde Toolbar al canvas (gesto canónico OPCloud).
- Iniciar enlaces y elegir tipo desde menú contextual con preview OPL en vivo.
- Tener una biblioteca lateral para reusar entidades existentes en otros OPDs.
- Reanclar extremos de enlace por drag visual.
- Editar propiedades visuales de enlaces con paleta canónica.
- Copiar/pegar estilo entre enlaces con atajos.
- Borrar múltiples enlaces de un golpe.
- Conectar multi-selección al todo con un solo gesto.

EPICA-10 cierra al 100% (12/12 vivas) y EPICA-11 al 100% (10/10 vivas). MVP-α avanza ~18 puntos porcentuales por L4 (línea con mayor impacto).
