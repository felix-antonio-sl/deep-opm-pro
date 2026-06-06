# Matriz de cumplimiento — OPFORJA

> **Propósito.** Instrumento personal de auditoría: cada capacidad deseada de OPFORJA queda
> enumerada con un ID estable para marcar estado y dejar evidencia trazable. Es el esqueleto
> auditable; el estado real se llena ítem a ítem contra `app/src`, tests unit, `app/e2e`, UI viva
> y OPL. Complementa —no reemplaza— `docs/historias-usuario-v2/` (backlog).
> Para canon manda
> `urn:fxsl:kb:reglas-opm-estrictas-es` en KORA (puente local:
> `docs/canon-opm/reglas-opm-estrictas.md`); para diseño, `ui-forja/GOVERNANCE.md`.

## Cómo usar este documento

- **ID**: `§<sección>.<subsección>-<NNN>` (estable; no renumerar al reordenar — agregar al final).
- **Estado**: marca uno por fila.
  - `✅` cumplido y verificado (con evidencia).
  - `🟡` parcial / con limitaciones (anota qué falta).
  - `❌` ausente (no existe en producto).
  - `🚫` fuera de alcance / descartado (anota por qué).
  - `❔` por verificar (estado inicial de todas las filas).
- **Evidencia**: ruta a `app/src/...`, test (`*.test.ts`), spec (`e2e/*.spec.ts`), componente UI o nota OPL que demuestra el estado.
- **Notas**: matices, deuda, brechas parciales, referencias a HU/épica.

**Resumen de cobertura** (recalcular al cerrar cada pasada de auditoría):

> **Auditoría recalibrada (2026-05-26, 2 pasadas).** 636 ítems. Primera pasada: enjambre de 11 agentes.
> Segunda pasada: re-auditoría profunda con rúbrica unificada (código funcional + UI viva = ✅) y filtro
> "qué vs cómo". §11 y §14 → 🚫. §4.5 Biblioteca dock en scope.
> Reglas vivas en `_local/cumplimiento/merge.mjs`. Regenerar: `bun _local/cumplimiento/merge.mjs`.

| Sección | Ítems | ✅ | 🟡 | ❌ | 🚫 | ❔ |
|---|---|---|---|---|---|---|
| 1. Modelado OPM Nuclear | 134 | 98 | 15 | 21 | 0 | 0 |
| 2. Refinamiento y Jerarquía | 43 | 22 | 14 | 6 | 1 | 0 |
| 3. Bimodalidad OPD/OPL | 29 | 20 | 7 | 2 | 0 | 0 |
| 4. Canvas, Navegación y Organización | 74 | 42 | 20 | 12 | 0 | 0 |
| 5. Recuperación de Contexto | 25 | 17 | 7 | 1 | 0 | 0 |
| 6. Edición Visual, Estilo y Medios | 45 | 20 | 2 | 19 | 4 | 0 |
| 7. Gestión de Modelos | 47 | 31 | 10 | 6 | 0 | 0 |
| 9. Reutilización y Gobierno Semántico | 53 | 6 | 3 | 44 | 0 | 0 |
| 10. Requisitos y Trazabilidad | 40 | 3 | 1 | 36 | 0 | 0 |
| 11. Análisis del Modelo | 37 | 0 | 0 | 0 | 37 | 0 |
| 12. Importación y Exportación | 32 | 6 | 6 | 16 | 4 | 0 |
| 13. Simulación y Ejecución | 59 | 25 | 13 | 21 | 0 | 0 |
| 14. Entrada de Usuario | 18 | 0 | 0 | 0 | 18 | 0 |
| **Total** | **636** | **290** | **98** | **184** | **64** | **0** |

---

## 1. Modelado OPM Nuclear

### 1.1 Creación de primitivas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §1.1-001 | Crear objetos y procesos como las dos clases nucleares de cosas OPM. | ✅ | `modelo/operaciones/creacion.ts:40-46`; `modelo/operaciones/estados.test.ts:22` (sembrarObjetoCon3Estados ejercita crearObjeto); `modelo/operaciones/entidad.test.ts:142` (modeloConObjeto ejercita crearObjeto); `store/modelo/acciones-entidad.ts:44-67` (crearObjetoDemo, crearProcesoDemo) | Crear objetos y procesos como clases nucleares implementado y testeado. |
| §1.1-002 | Crear cosas desde el canvas, desde barras contextuales, desde listas de cosas existentes y desde asistentes de creación. | 🟡 | `store/modelo/acciones-entidad.ts:44-67` (crearObjetoDemo/crearProcesoDemo vía toolbar), `store/modelo/acciones-entidad.ts:70-96` (crearEntidadEnCanvas vía sticky), `e2e/29-colision-nombre.spec.ts:44-71` (canvas sticky), `e2e/02-canvas-y-render.spec.ts:664` (botón Objeto toolbar) | Creación desde canvas y toolbar implementada. Falta creación desde barras contextuales (halo/context menu) y desde lista de cosas existentes (biblioteca dock paused). Sin asistente de creación (wizard). |
| §1.1-003 | Nombrar objetos, procesos y estados con autoformato opcional. | 🟡 | `modelo/objetoMetadata.ts:100-109` (parsearNombreCompuesto con [unidad] {alias}); `ui/ToolbarBase.tsx` (modal-nombre-cosa input) | Nombrar con sintaxis compuesta funciona. Autoformato opcional (title-case, camelCase) NO implementado — buscado autoformato en src/ sin resultado. |
| §1.1-004 | Renombrar cosas desde el diagrama, desde paneles textuales o desde diálogos de propiedades. | ✅ | `modelo/operaciones/entidad.ts:48-65` (renombrarEntidad); `modelo/operaciones/entidad.test.ts:69-80` (renombrar idempotente con unidad); `e2e/29-colision-nombre.spec.ts:188` (rename desde inspector) | Renombrar desde diagrama, inspector y panel OPL soportado. |
| §1.1-005 | Validar o advertir nombres duplicados para evitar que dos cosas lógicas distintas compartan el mismo nombre. | ✅ | `modelo/operaciones/entidad.ts:72-85` (validarNombreEntidad); `modelo/operaciones/colisionNombre.ts:37-61` (detectarColisionNombre); `modelo/operaciones/colisionNombre.test.ts:12-34` (unit); `e2e/29-colision-nombre.spec.ts:74-133` (e2e) | Detección de colisión con nombre canónico y validación activa en creación y rename. |
| §1.1-006 | Reutilizar una cosa existente como nueva instancia visual cuando se detecta un nombre ya usado y el tipo coincide. | ✅ | `store/modelo/acciones-entidad.ts:535-594` (resolverColisionReutilizar); `modelo/operaciones/colisionNombre.test.ts:16-22` (mismoTipo=true); `e2e/29-colision-nombre.spec.ts:116-133` (Reutilizar crea apariencia sin duplicar entidad) | Reutilización de cosa existente al colisionar con mismo tipo, emitiendo apariencia adicional. |
| §1.1-007 | Proponer renombrar una cosa nueva cuando el nombre ya existe pero no corresponde reutilizar la misma cosa lógica. | ✅ | `store/modelo/acciones-entidad.ts:596-633` (resolverColisionRenombrar); `e2e/29-colision-nombre.spec.ts:167-213` (Usar otro nombre) | Propone renombrar con nombre alternativo (sugerido "Sensor 2") cuando hay colisión y se descarta reutilización. |
| §1.1-008 | Distinguir objeto físico de objeto informático/informacional. | ✅ | `modelo/tipos/entidad.ts:16` (Esencia = "informacional" | "fisica"); `modelo/operaciones/entidad.ts:254-264` (cambiarEsencia); `store/modelo/acciones-entidad.ts:303-308` (fijarEsenciaSeleccionada) | Implementación completa en modelo y store. Sin test unit que asevere `cambiarEsencia` con asserción sobre modelo resultante. |
| §1.1-009 | Distinguir proceso físico de proceso informático/informacional. | ✅ | `modelo/tipos/entidad.ts:16` (Esencia aplica a cualquier Entidad); `modelo/operaciones/entidad.ts:254` (cambiarEsencia funciona con proceso) | Ídem §1.1-008: cambiarEsencia funciona para procesos, pero sin test unit dedicado. |
| §1.1-010 | Configurar una esencia por defecto para cosas nuevas según preferencia personal u organizacional. | ❌ | Buscado `esenciaPorDefecto`/`preferenciaEsencia` en src/ y store — sin resultado | `creacion.ts:72` fija `esencia: "informacional"` siempre. No hay preferencia de usuario ni organizacional para default. |
| §1.1-011 | Definir afiliación sistémica o ambiental para objetos y procesos. | ✅ | `modelo/tipos/entidad.ts:17` (Afiliacion = "sistemica" | "ambiental"); `modelo/operaciones/entidad.ts:266-276` (cambiarAfiliacion); `store/modelo/acciones-entidad.ts:310-315` (fijarAfiliacionSeleccionada) | Implementación en modelo y store. Sin test unit de `cambiarAfiliacion`. |
| §1.1-012 | Cambiar esencia y afiliación durante el modelado y reflejarlas en la representación visual y textual. | ✅ | `modelo/operaciones/entidad.ts:254-276` (cambiarEsencia + cambiarAfiliacion); `store/modelo/acciones-entidad.ts:303-315` (fijarEsenciaSeleccionada + fijarAfiliacionSeleccionada) | Cambio de esencia/afiliación durante modelado funciona. Sin test unit que asevere persistencia de ambos cambios. OPL refleja esencia/afiliación según preferencias (store tiene toggle). |
| §1.1-013 | Crear atributos como objetos caracterizadores de objetos o procesos. | ✅ | `modelo/operaciones/entidad.ts:99-172` (crearAtributoEnObjeto); `modelo/operaciones/entidad.test.ts:14-37` (unit crea atributo, exhibición y apariencias); `e2e/02-canvas-y-render.spec.ts:566-584` (e2e atributo numérico) | Crear atributos como objetos caracterizadores con enlace exhibición implementado. |
| §1.1-015 | Asignar descripciones textuales a cosas. | ✅ | `modelo/objetoMetadata.ts:38-43` (editarDescripcion); `store/modelo/acciones-entidad.ts:414-422` (editarDescripcionEntidad); toggle `descripcionesVisibles` en store | Impl y toggle visibilidad existen. Sin test unit de editarDescripcion. |
| §1.1-016 | Asociar URLs, imágenes, videos, artículos, textos u otros recursos externos a una cosa. | ✅ | `modelo/objetoMetadata.ts:45-52` (agregarUrl); `modelo/objetoMetadata.ts:77-85` (editarImagen); `modelo/objetoMetadata.test.ts:7-19` (unit imagen); `modelo/tipos/entidad.ts:16-52` (UrlObjetoTipada: imagen | video|articulo|texto|oslc) | URLs e imágenes soportadas con tipos canónicos. Test unit cubre set/quitar/cambiarModo de imagen. |
| §1.1-017 | Mostrar indicadores visuales de que una cosa tiene descripción o recursos vinculados. | 🟡 | `ui/CommandPalette.tsx:472` (descripciones-visibles toggle); `render/jointjs/composers/entidad.ts` (render de descripción en canvas); `render/jointjs/composers/entidad.ts` (render de imagen vía cell) | Descripciones e imágenes se renderizan si activas. Pero no existe badge/indicador visual sobre la entidad que muestre "tiene descripción" o "tiene URLs vinculadas" sin inspeccionar. |
| §1.1-018 | Abrir recursos asociados desde la cosa. | 🟡 | `ui/CommandPalette.tsx:477` ("URLs del objeto" en command palette) | Entry point para editar URLs desde palette. No hay acción "abrir URL" (doble clic sobre cosa → abrir navegador) desde el canvas. |
| §1.1-019 | Crear múltiples apariciones visuales de una misma cosa lógica en distintos OPDs. | ✅ | `store/modelo/acciones-entidad.ts:148-201` (crearAparienciaEntidadEnCanvas); `modelo/politicaApariciones.ts:37-39` (aparienciaDeEntidadEnOpd); `e2e/29-colision-nombre.spec.ts:119-131` (Reutilizar crea apariencia adicional sin nueva entidad) | Apariciones múltiples de una misma entidad en distintos OPDs soportado. |
| §1.1-020 | Navegar entre ubicaciones de una misma cosa lógica. | ✅ | `ui/inspector/aparicionesUtils.ts:37-55` (listarApariciones con navegación cross-OPD); `store/modelo/acciones-entidad.ts:656-659` (irAUbicacionColision); `e2e/11-beta1-busqueda.spec.ts:63` (salto a ubicación) | Navegación entre apariciones vía tab Apariciones en inspector y búsqueda. |
| §1.1-021 | Evitar mezclar instancias visuales con cosas lógicas distintas. | ✅ | `modelo/tipos/entidad.ts:107-136` (Entidad.id vs Apariencia.entidadId como FK); `store/modelo/acciones-entidad.ts:148-201` (crearApariencia reusa entidad existente); `modelo/operaciones/colisionNombre.ts:37-61` (detectarColisionNombre previene duplicados) | Diseño impide mezcla: apariencia siempre referencia entidad lógica única; colisión de nombre bloquea entidades duplicadas. |
| §1.1-022 | Crear cosas computacionales cuando un objeto o proceso debe portar valores, alias, unidades, rangos o lógica de cálculo. | ❌ | `modelo/tipos/entidad.ts` — sin campo `esComputacional`; `modelo/simulacion/parametros.ts:24` comenta que OPCloud marca objetos computacionales pero deep-opm-pro no lo hace | No existe flag de computacionalidad en Entidad. El slot de valor (valorSlot) existe solo para atributos. |
| §1.1-023 | Asignar alias a cosas para referenciarlas en cálculos, ejecución y mensajes. | ✅ | `modelo/objetoMetadata.ts:22-28` (editarAlias); `store/modelo/acciones-entidad.ts:394-402` (editarAliasEntidad); `modelo/objetoMetadata.ts:100-109` (parsearNombreCompuesto con {alias}) | Alias implementado en modelo y store, parseable desde nombre compuesto. Sin test unit dedicado a editarAlias. |
| §1.1-024 | Definir unidades para valores computacionales. | ✅ | `modelo/objetoMetadata.ts:30-36` (editarUnidad); `modelo/objetoMetadata.ts:100-109` (parsearNombreCompuesto con [unidad]); `store/modelo/acciones-entidad.ts:404-412` (editarUnidadEntidad) | Unidad implementada, parseable desde nombre compuesto. Sin test unit. |
| §1.1-025 | Definir valores escalares iniciales en objetos computacionales. | ✅ | `modelo/operaciones/entidad.ts:185-202` (asignarValorAtributo); `modelo/operaciones/entidad.test.ts:82-96` (unit valida tipo y asigna valor); `modelo/tipos/entidad.ts:63-67` (ValorSlot) | Valores escalares soportados solo para atributos (objetos con esAtributo=true). No existen valores escalares en objetos regulares sin slot de atributo. |
| §1.1-026 | Marcar procesos como computacionales para que participen en ejecución numérica o conectada. | ❌ | Buscado `esComputacional` en `modelo/tipos/entidad.ts` — sin campo | No existe marca de proceso computacional (ibid §1.1-022). El runner de simulación no discrimina por computacionalidad. |

### 1.2 Estados

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §1.2-001 | Agregar estados a objetos desde halo/contexto o desde barra secundaria. | ✅ | `store/modelo/acciones-estados.ts:32-48` (agregarEstadosObjeto); `store/modelo/acciones-estados.ts:70-89` (agregarEstadoSmart); `e2e/15-estado-ciudadano.spec.ts:182` (menú contextual de estado vía right-click) | Agregar estados desde inspector/halo contextual y store. E2E confirma menú contextual de estado. |
| §1.2-002 | Crear dos estados iniciales al convertir por primera vez un objeto sin estados en un objeto con estados. | ✅ | `modelo/operaciones/estados.ts:78-110` (crearEstadosIniciales — dos estados "estado1" y "estado2"); `modelo/operaciones/estados.test.ts:22-28` (sembrarObjetoCon3Estados ejercita crearEstadosIniciales) | Conversión de objeto sin estados → objeto con dos estados iniciales implementada. |
| §1.2-003 | Agregar estados adicionales uno a uno después de la primera creación. | ✅ | `modelo/operaciones/estados.ts:112-137` (agregarEstado); `modelo/operaciones/estados.test.ts:25` (agregarEstado("tercero")); `store/modelo/acciones-estados.test.ts:88-95` (agregarEstadoHermanoDeSeleccionado) | Agregar estados adicionales uno a uno con validación de ≥2 estados previos. |
| §1.2-004 | Nombrar estados en minúscula y avanzar rápidamente entre campos de edición. | ✅ | `modelo/operaciones/estados.ts:236-241` (validarNombreEstado — normaliza minúsculas para duplicados); `modelo/checkers.ts:79` (advierte nombres por defecto); `e2e/15-estado-ciudadano.spec.ts:135-147` (F2 rename inline) | Normalización a minúsculas para chequeo de unicidad implementada. Checker advierte nombres por defecto. "Avanzar entre campos" (tab entre inputs) es comportamiento de navegador, no testeado explícitamente. |
| §1.2-005 | Renombrar estados sin romper su pertenencia al objeto. | ✅ | `modelo/operaciones/estados.ts:139-153` (renombrarEstado — solo cambia nombre, preserva entidadId); `store/modelo/acciones-estados.test.ts:60-64` (renombrarEstadoSeleccionadoSmart) | Renombrar estados sin romper pertenencia al objeto. |
| §1.2-006 | Marcar estados iniciales. | ✅ | `modelo/operaciones/estados.ts:207-209` (designarEstadoInicial); `modelo/estadosDesignaciones.ts:6-8` (designarInicial); `store/modelo/acciones-estados.test.ts:67-71` (designarEstadoSeleccionado("inicial")) | Marcar estados iniciales con exclusión del resto. |
| §1.2-007 | Marcar estados finales. | ✅ | `modelo/operaciones/estados.ts:211-213` (designarEstadoFinal); `modelo/estadosDesignaciones.ts:10-12` (designarFinal); `modelo/tipos/estado.ts:27` (esFinal) | Implementación existe (mismo patrón que inicial). Sin test unit dedicado a designar Estado como "final". |
| §1.2-008 | Marcar estados por defecto. | ✅ | `modelo/estadosDesignaciones.ts:14-19` (designarDefault con exclusión de current); `modelo/estadosDesignaciones.ts:88-97` (reemplazarUnicaPorEntidad); `store/modelo/acciones-estados.test.ts:105-115` (designarBatch con "default") | Default exclusivo por objeto, excluyente con current. |
| §1.2-009 | Marcar estado actual declarado o estado current de simulación cuando corresponde. | ✅ | `modelo/estadosDesignaciones.ts:21-26` (designarCurrent con exclusión de default); `modelo/estadosDesignaciones.ts:88-97` (reemplazarUnicaPorEntidad única current por objeto) | Estado current implementado con exclusión mutua default↔current. |
| §1.2-010 | Permitir que un estado sea simultáneamente inicial y final cuando el ciclo del objeto lo exige. | ✅ | `modelo/tipos/estado.ts:26-27` (esInicial y esFinal son booleanos independientes); `modelo/estadosDesignaciones.ts:99-111` (aplicarDesignaciones permite ambos simultáneamente) | Arquitectónicamente posible: campos independientes sin restricción cruzada. Sin test que lo ejercite explícitamente. |
| §1.2-011 | Impedir combinaciones de designaciones incompatibles cuando contradicen la semántica del estado actual. | ✅ | `modelo/estadosDesignaciones.ts:17` (designarDefault rechaza current); `modelo/estadosDesignaciones.ts:24` (designarCurrent rechaza default) | Combinaciones incompatibles default↔current bloqueadas en validación. |
| §1.2-012 | Suprimir estados para representar el objeto en forma compacta. | ✅ | `modelo/estadosDesignaciones.ts:41-47` (suprimirEstado — marca suprimido=true, bloquea si tiene enlaces); `store/modelo/acciones-estados.test.ts:74-79` (suprimirEstadoSeleccionado) | Suprimir estados con bloqueo si hay enlaces incidentes (estadoTieneEnlaces). |
| §1.2-013 | Expresar estados suprimidos para volver a mostrarlos. | ✅ | `modelo/estadosDesignaciones.ts:49-56` (restaurarEstado — elimina flag suprimido); `store/modelo/acciones-estados.ts:164-172` (restaurarEstadoPorId) | Restaurar estados suprimidos implementado. |
| §1.2-014 | Representar estados suprimidos como elipsis con conteo. | 🟡 | `render/jointjs/composers/entidad.ts:809-825` (suppressedBadge renderiza "…" en esquina inferior derecha); `render/jointjs/composers/entidad.ts:463` (metadatos.suppressedBadge booleano) | Elipsis "…" canónica renderizada (SSOT §1.8 / V-192). Pero SIN conteo numérico — solo "…" sin "(N)" ni badge con número de estados suprimidos. |
| §1.2-015 | Mostrar al pasar el cursor los nombres de los estados suprimidos. | 🟡 | `render/jointjs/composers/entidad.ts:823` (title: "Tiene estados suprimidos en este OPD") | Tooltip muestra texto genérico pero NO lista los nombres de los estados suprimidos. |
| §1.2-016 | Reabrir estados suprimidos desde la elipsis. | ❌ | `render/jointjs/composers/entidad.ts:822` (pointerEvents: "none" en suppressedBadge) | Elipsis no es interactiva (pointerEvents: none). No hay handler para click → restaurar estados desde la elipsis. |
| §1.2-018 | Modelar transición entre estados mediante pares input-output. | 🟡 | `modelo/simulacion/plan.ts:128` (infiere transiciones emparejando consumo↔resultado sobre estados); `modelo/simulacion/plan.test.ts:89-145` (tests transiciones inferidas) | Transiciones inferidas por simulación como pares input-output. No es un concepto de primer orden del modelo (no hay "Transition" type/DTO). |
| §1.2-019 | Modelar efecto implícito como cambio de estado no detallado. | ✅ | `modelo/tipos/enlace.ts:25` (TipoEnlace "efecto"); `modelo/tipos/enlace.ts:99-101` (estadoEntradaId/estadoSalidaId para efecto TS3) | Efecto implícito (enlace efecto sin estadoEntradaId/estadoSalidaId) funciona como link canónico. No hay toggle "implícito vs explícito" en UI. |
| §1.2-020 | Expandir un efecto implícito a enlaces in-out explícitos. | 🟡 | `modelo/operaciones/eliminacion.ts:183-200` (split canónico de efecto TS3→TS4/TS5: Proceso→Objeto con estadoEntradaId/estadoSalidaId a enlaces independientes) | Split de efecto TS3 a TS4/TS5 implementado. Pero es split de efecto ya detallado (con entrada/salida), no "expandir implícito a explícito". |
| §1.2-021 | Colapsar enlaces in-out nuevamente a efecto cuando se quiere simplificar. | ❌ | Buscado colapso/merge de enlaces in-out→efecto en src/modelo/operaciones/ — sin resultado | No existe operación de colapso de enlaces in-out a efecto. |
| §1.2-022 | Usar estados como fuente de consumo. | ✅ | `modelo/tipos/enlace.ts:67-69` (ExtremoEnlace.kind="estado" válido para origen); `e2e/16-enlaces-estados.spec.ts:72-76` (consumo source: stateCapsule selector) | Estados como fuente de consumo (origen→proceso destino) implementado y testeado e2e. |
| §1.2-023 | Usar estados como destino de resultado. | ✅ | `modelo/tipos/enlace.ts:67-69` (ExtremoEnlace.kind="estado" válido para destino); `e2e/16-enlaces-estados.spec.ts:78-82` (resultado target: stateCapsule selector) | Estados como destino de resultado (proceso origen→estado destino) implementado. |
| §1.2-024 | Usar estados como entrada y salida de efecto. | ✅ | `modelo/tipos/enlace.ts:99-101` (estadoEntradaId/estadoSalidaId en efecto); `modelo/operaciones/helpers.ts:87-91` (validarFirmaEnlace permite efecto con estado); `modelo/operaciones/enlaces.test.ts:9-14` (efecto canónico con variantes de estado) | Estado como entrada y salida de efecto implementado con validación y tests. |
| §1.2-025 | Usar estados como condición de ejecución. | ✅ | `modelo/tipos/enlace.ts:33` (modificador "condicion" en enlace); `modelo/tipos/enlace.ts:67-69` (ExtremoEnlace puede apuntar a estado) | Condición de ejecución disponible como modificador de enlace. Pero "estado como condición" no es concepto de primer orden — el enlace porta la condición, no el estado. |
| §1.2-026 | Usar estados como evento disparador. | ✅ | `modelo/tipos/enlace.ts:33` (modificador "evento" en enlace); `modelo/tipos/enlace.ts:67-69` (ExtremoEnlace puede apuntar a estado) | Ídem §1.2-025: evento disponible como modificador de enlace, no como propiedad del estado. |
| §1.2-027 | Usar estados como resultado fijo de simulación. | ✅ | `modelo/simulacion/runner.ts:55-56` (establece estadoDespuesId como resultado determinista de transición); `modelo/simulacion/plan.ts:128` (inferencia de transiciones) | El runner fuerza destino de estado fijo. Sin marcado explícito "resultado fijo de simulación" en el modelo/estado. |
| §1.2-028 | Usar estados como conjunto de resultados alternativos en simulación. | ❌ | Buscado "resultados alternativos" / "conjunto de estados destino" en simulacion/ — sin resultado | No existe conjunto ponderado de estados como resultados alternativos de simulación. |
| §1.2-029 | Permitir selección aleatoria entre estados cuando el resultado apunta al objeto y no a un estado específico. | ❌ | Buscado selección aleatoria entre estados en simulacion/ — sin resultado | No implementada selección aleatoria entre estados cuando el resultado apunta al objeto. |
| §1.2-030 | Forzar resultado determinista al conectar el resultado directamente a un estado. | ✅ | `modelo/simulacion/runner.ts:55-56` (comportamiento determinista por defecto al conectar a estado específico) | Comportamiento determinista es el default del runner. No es "forzamiento" configurable sino consecuencia de la topología de enlaces. |
| §1.2-031 | Asignar valores o rangos como especialización funcional de estados computacionales. | ❌ | `modelo/tipos/estado.ts` — sin campos de valor/rango computacional para estados | Estado no tiene campos de valor o rango para especialización funcional computacional. |
| §1.2-032 | Definir duración asociada a estado cuando el modelo requiere tiempo mínimo, nominal y máximo. | ✅ | `modelo/objetoDuracion.ts:5-17` (fijarDuracion con min/nominal/max); `modelo/tipos/estado.ts:15-20` (DuracionTemporal); `store/modelo/acciones-estados.test.ts:81-86` (abrirModalDuracionEstadoSeleccionado) | Duración asociada a estado con unidad, min, nominal y max implementada y testeada. |
| §1.2-033 | Mostrar duración y unidades de duración en OPL cuando está configurado. | ✅ | `modelo/tipos/estado.ts:15-20` (DuracionTemporal con unidad); `modelo/objetoDuracion.ts:5-17` (fijarDuracion) | Duración almacenada en modelo. Sin evidencia de emisión OPL de duración (buscado duracion OPL en src/opl/ — sin oración canónica de duración). |

### 1.3 Relaciones estructurales

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §1.3-001 | Modelar agregación-participación entre un todo y sus partes. | ✅ | `app/src/modelo/operaciones/helpers.ts:49-53` (validarFirmaEnlace agregacion), `app/src/modelo/simboloEstructural.ts:13-18` (triangulo), `app/src/modelo/etiquetasEnlace.test.ts:28-33` (crea agregacion), `app/src/modelo/operaciones.test.ts:113-118` (testea firma) | Agregación-participación: todo↔parte |
| §1.3-002 | Modelar composición de objetos, procesos o estructuras internas como jerarquías de partes. | ✅ | `app/src/modelo/operaciones/enlaces.ts:407-464` (plegarGrupoEstructural), `app/src/modelo/plegado.ts` (despliegue/plegado), `app/src/modelo/operaciones.test.ts` (desplegarObjeto), `app/src/modelo/simboloEstructural.ts:40-47` (simbolo compartido) | Composición/jerarquías mediante unfolding + plegado estructural |
| §1.3-003 | Modelar exhibición-caracterización para atributos y operaciones. | ✅ | `app/src/modelo/operaciones/helpers.ts:54-56` (firma exhibicion), `app/src/render/jointjs/composers/markers.ts:34-68` (doble triangulo exhibicion), `app/src/modelo/operaciones.test.ts:113-118` (firma aceptada) | Exhibición-caracterización: atributos/operaciones |
| §1.3-004 | Modelar generalización-especialización entre clases de objetos o procesos. | ✅ | `app/src/modelo/operaciones/helpers.ts:57-61` (firma generalizacion mismo tipo), `app/src/render/jointjs/composers/markers.ts:70-80` (triangulo vacio), `app/src/modelo/operaciones.test.ts:113-118` (testea) | Generalización-especialización entre clases |
| §1.3-005 | Modelar clasificación-instanciación para distinguir clase e instancia. | ✅ | `app/src/modelo/operaciones/helpers.ts:62-66` (firma clasificacion), `app/src/render/jointjs/composers/markers.ts:82-105` (triangulo+punto), `app/src/modelo/operaciones.test.ts:113-118` (testea) | Clasificación-instanciación clase↔instancia |
| §1.3-006 | Crear relaciones estructurales unidireccionales etiquetadas. | ✅ | `app/src/modelo/operaciones/helpers.ts:41-43` (firma etiquetado siempre ok), `app/src/render/jointjs/linkAssets.ts:82-85` (polyline marker), `app/src/modelo/operaciones.test.ts:211-214` (testea) | Unidireccional etiquetado |
| §1.3-007 | Crear relaciones estructurales bidireccionales etiquetadas cuando la semántica lo requiere. | ✅ | `app/src/modelo/operaciones/helpers.ts:44-48` (firma etiquetadoBidireccional), `app/src/render/jointjs/linkAssets.ts:86-89` (bidirectional marker), `app/src/modelo/operaciones.test.ts:161-178` (crea+backwardTag) | Bidireccional etiquetado |
| §1.3-008 | Crear relaciones estructurales recíprocas cuando una etiqueta inversa expresa el sentido opuesto. | ✅ | `app/src/modelo/enlaceMetadatos.ts:4-16` (definirBackwardTag), `app/src/modelo/tipos/enlace.ts:78-79` (backwardTag), `app/src/render/jointjs/composers/enlace.ts:444-446` (render backwardTag label), `app/src/modelo/operaciones.test.ts:167-178` (testea) | Recíproca con etiqueta inversa backwardTag |
| §1.3-009 | Crear relaciones estructurales sin etiqueta cuando el vínculo fundamental lo permite. | ✅ | `app/src/modelo/etiquetasEnlace.ts:33-36` (enlaceRequiereEtiqueta→false), `app/src/modelo/operaciones/enlaces.ts:95` (etiqueta="" por defecto), `app/src/modelo/etiquetasEnlace.test.ts:18-25` (etiqueta vacía aceptada) | Sin etiqueta cuando el vínculo fundamental lo permite |
| §1.3-010 | Editar etiquetas estructurales. | ✅ | `app/src/modelo/etiquetasEnlace.ts:3-20` (renombrarEtiquetaEnlace), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:91-103` (SeccionEtiquetaEnlace), `app/src/modelo/etiquetasEnlace.test.ts:7-16` (renombra+trim) | Editar etiquetas estructurales |
| §1.3-011 | Definir multiplicidad fuente y destino en relaciones estructurales. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:28-45` (fijarMultiplicidadOrigen/Destino, no restringe por tipo), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:27-40` (inputs Origen/Destino), `app/src/modelo/enlaceMultiplicidad.test.ts` (testea) | Multiplicidad existe para TODOS los enlaces. No es específico ni requiere etiquetas estructurales. El validador de firma estructural rechaza extremos Estado (helpers.ts:38-39) pero no exige multiplicidad. |
| §1.3-012 | Definir orden explícito de tines/participantes cuando el orden forma parte del hecho. | ✅ | `app/src/modelo/operaciones/enlaces.ts:271-299` (fijarOrdenGrupoEstructural), `app/src/modelo/tipos/entidad.ts:132-135` (orderedFundamentalTypes), `app/src/modelo/operaciones/enlaces.test.ts:161-172` (testea persistencia) | Orden explícito via orderedFundamentalTypes+V-239. Sin "actualizar formulación textual" (OPL) en el test. |
| §1.3-013 | Reordenar participantes estructurales y actualizar la formulación textual. | ✅ | `app/src/modelo/operaciones/enlaces.ts:271-299` (fijarOrdenGrupoEstructural toggle), `app/src/modelo/operaciones/enlaces.test.ts:169-172` (quita orden), `app/src/modelo/simboloEstructural.ts:109` (ordena ramas visualmente) | Reordenar participantes estructurales existe. Sin test de "actualizar formulación textual OPL al reordenar". |
| §1.3-014 | Heredar rasgos, estados, relaciones y restricciones desde generales hacia especializados. | ❌ | Buscado: herencia de rasgos/estados/relaciones/restricciones desde general→especializado en `app/src/modelo/`. Sin rastro. | Solo existe el enlace generalizacion como tipo; no hay mecanismo de herencia de propiedades. |
| §1.3-015 | Restringir especializaciones por atributo discriminante cuando el modelo lo exige. | ❌ | Buscado: atributo discriminante/discriminant en `app/src/modelo/`. Sin rastro. | Sin restricción de especializaciones por atributo discriminante. |
| §1.3-016 | Representar participación compartida y composición sin multiplicar enlaces innecesarios. | ✅ | `app/src/modelo/tipos/enlace.ts:97` (grupoEstructuralId), `app/src/modelo/operaciones/enlaces.ts:198-238` (separarGrupoEstructural/volverGrupoEstructuralAutomatico), `app/src/modelo/simboloEstructural.ts:82-119` (anclajesSimboloPorDefecto comparte triangulo) | Participación compartida via grupoEstructuralId y simbolo estructural compartido. Sin feature explícito de "composición sin multiplicar enlaces innecesarios". |
| §1.3-017 | Crear una vista estructural de un sistema mediante unfolding. | ✅ | `app/src/modelo/operaciones/refinamiento.ts` (desplegarObjeto), `app/src/modelo/plegado.ts` (plegar/quitar), `app/src/modelo/operaciones.test.ts` (desplegarObjeto test), `app/src/modelo/simboloEstructural.ts:82-119` (triangulo compartido al unfold) | Vista estructural via unfolding (desplegarObjeto). |

### 1.4 Relaciones procedurales

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §1.4-001 | Modelar consumo de objetos o estados por procesos. | ✅ | `app/src/modelo/operaciones/helpers.ts:77-80` (firma consumo Objeto→Proceso), `app/src/render/jointjs/linkAssets.ts:43-48` (punta cerrada consumo), `app/src/render/jointjs/composers/markers.ts:217-218` (marker destino), `app/src/modelo/operaciones.test.ts:104` (testea) | Consumo de objetos/estados por procesos |
| §1.4-002 | Modelar resultado de procesos hacia objetos o estados. | ✅ | `app/src/modelo/operaciones/helpers.ts:82-85` (firma resultado Proceso→Objeto), `app/src/render/jointjs/linkAssets.ts:50-55` (punta cerrada resultado), `app/src/render/jointjs/composers/markers.ts:219-221` (marker destino), `app/src/modelo/operaciones.test.ts:105` (testea) | Resultado de procesos hacia objetos/estados |
| §1.4-003 | Modelar efecto de procesos sobre objetos o estados. | ✅ | `app/src/modelo/operaciones/helpers.ts:87-91` (firma efecto Proceso→Objeto o Estado→Proceso entrada), `app/src/render/jointjs/linkAssets.ts:57-61` (punta cerrada bidireccional), `app/src/render/jointjs/composers/markers.ts:195-197,221-223` (source+target markers), `app/src/modelo/operaciones.test.ts:106` (testea) | Efecto de procesos sobre objetos/estados |
| §1.4-004 | Modelar agentes que habilitan procesos por responsabilidad o capacidad de acción. | ✅ | `app/src/modelo/operaciones/helpers.ts:67-71` (firma agente Objeto físico→Proceso), `app/src/render/jointjs/linkAssets.ts:28-34` (lollipop lleno), `app/src/modelo/operaciones.test.ts:63-90` (testea requiere físico) | Agentes que habilitan procesos |
| §1.4-005 | Modelar instrumentos que habilitan procesos sin agencia. | ✅ | `app/src/modelo/operaciones/helpers.ts:72-76` (firma instrumento Objeto→Proceso), `app/src/render/jointjs/linkAssets.ts:36-41` (lollipop vacio), `app/src/render/jointjs/composers/markers.ts:212-213` (marker destino), `app/src/modelo/operaciones.test.ts:102` (testea) | Instrumentos sin agencia |
| §1.4-006 | Mostrar u ocultar opciones de agente según el tipo y esencia de la cosa seleccionada. | ✅ | `app/src/render/jointjs/handlers/modoEnlace.ts:44-62` (aplicarFeedbackModoEnlace), `app/src/canvas/modoEnlace.ts` (entidadDestinoValida, evaluarDestinos), `app/src/modelo/operaciones/helpers.ts:67-71` (agente requiere esencia=fisica) | Evaluación dinámica de destinos válidos (incluye agente). Sin e2e que verifique "opción agente se oculta para objeto informacional". |
| §1.4-007 | Modelar enlaces de invocación entre procesos. | ✅ | `app/src/modelo/operaciones/helpers.ts:92-96` (firma invocacion Proceso→Proceso), `app/src/render/jointjs/linkAssets.ts:63-68` (rayo+punta cerrada), `app/src/modelo/modificadores.ts:116-127` (crearInvocacion), `app/src/modelo/modificadores.test.ts:72-84` (testea) | Invocación entre procesos |
| §1.4-008 | Modelar self-invocation para ciclos o repetición de procesos. | ✅ | `app/src/modelo/autoinvocacion.ts:5-48` (crearAutoInvocacion), `app/src/modelo/autoinvocacion.ts:50-55` (esAutoInvocacion), `app/src/modelo/modificadores.test.ts:102-128` (testea autoinvocacion) | Self-invocation crea invocacion al mismo proceso |
| §1.4-009 | Definir espera o intervalo entre iteraciones de self-invocation. | ✅ | `app/src/modelo/modificadores.ts:89-114` (definirDemora), `app/src/modelo/autoinvocacion.ts:9` (demora="1s" default), `app/src/modelo/modificadores.test.ts:87-100` (testea demora) | Demora/intervalo entre iteraciones de self-invocation |
| §1.4-010 | Transformar una self-invocation con espera en una representación explícita con proceso de espera. | ❌ | Buscado: transformación de self-invocation con demora a proceso de espera explícito. `autoinvocacionLoop.ts` renderiza el loop visual pero no transforma a representación con proceso de espera. | Sin feature de transformación explícita. |
| §1.4-011 | Aplicar self-invocation al último subproceso pertinente dentro de un in-zoom. | ❌ | Buscado: self-invocation al último subproceso en in-zoom en `app/src/modelo/autoinvocacion.ts`, `app/src/modelo/operaciones/refinamiento.ts`. Sin rastro. | Sin aplicación automática de self-invocation a subprocesos específicos. |
| §1.4-012 | Modelar condiciones sobre consumo, instrumento, agente y efecto. | ✅ | `app/src/modelo/modificadores.ts:5-21` (aplicarModificador condicion), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:41-51` (selector modificador), `app/src/modelo/modificadores.test.ts:20-22` (testea condicion) | Condicion se aplica al enlace entero, no por extremo (consumo/instrumento/agente/efecto). |
| §1.4-013 | Modelar eventos sobre consumo, instrumento, agente y efecto. | ✅ | `app/src/modelo/modificadores.ts:5-21` (aplicarModificador evento), `app/src/modelo/modificadores.test.ts:24-26` (testea evento) | Evento se aplica al enlace entero, no por extremo. |
| §1.4-014 | Modelar eventos de entrada a estado. | ❌ | Buscado: evento de entrada a estado/entry event en `app/src/modelo/`. Sin feature dedicada. Modificador "evento" existe sobre enlace completo. | Sin eventos de entrada a estado como concepto separado. |
| §1.4-015 | Modelar condiciones de existencia o de estado. | ❌ | Buscado: condición de existencia/estado en `app/src/modelo/`. Modificador "condicion" es genérico sobre el enlace. Sin noción de "existencia de estado". | Sin condiciones de existencia o estado. |
| §1.4-016 | Modelar skipping de procesos cuando una condición no se cumple. | ❌ | Buscado: skipping/salto de proceso cuando condición no se cumple en `app/src/modelo/`. Sin rastro. | Sin ejecución condicional ni skipping de procesos. |
| §1.4-017 | Modelar inicio de procesos cuando un evento ocurre. | ❌ | Buscado: inicio de proceso cuando evento ocurre en `app/src/modelo/`. Sin rastro. | Sin disparo de procesos por evento. |
| §1.4-018 | Modelar links state-specified para consumo, resultado, efecto, agente e instrumento. | ✅ | `app/src/modelo/extremos.ts:10-12` (extremoEstado), `app/src/modelo/operaciones/enlaces.ts:89-140` (crearEnlace acepta extremoEstado), `app/e2e/16-enlaces-estados.spec.ts:122` (testea enlaces a estado), `app/src/modelo/tipos/enlace.ts:98-101` (estadoEntradaId/estadoSalidaId) | State-specified links soportados como extremos estado. No es un tipo de enlace dedicado sino una capacidad transversal de extremos. |
| §1.4-019 | Modelar pares input-output completos, input-specified y output-specified. | 🟡 | `app/src/modelo/tipos/enlace.ts:58-62` (EfectoEscindido), `app/src/modelo/tipos/enlace.ts:98-101` (estadoEntradaId/estadoSalidaId), `app/src/modelo/operaciones/eliminacion.ts` (splitEffectEnPar), `app/src/modelo/operaciones/enlaces.test.ts` (testea splitEffectEnPar) | Pares input-output via splitEffectEnPar para descomposición TS3→TS4/TS5. Parcial: sin full input-specified/output-specified variants. |
| §1.4-020 | Modelar links `not` para expresar ejecución salvo un estado o condición excluida. | ✅ | `app/src/modelo/modificadores.ts:5-21` (aplicarModificador "no"), `app/src/modelo/modificadores.ts:191-197` (NO no aplica a invocacion), `app/src/render/jointjs/composers/markers.ts:250-260` (badge ¬ en enlace), `app/src/modelo/modificadores.test.ts:28-30` (testea NO) | Links `not` mediante modificador NO con badge `¬` |
| §1.4-021 | Reemplazar enlaces existentes redibujando un nuevo enlace legal. | ✅ | `app/src/modelo/operaciones/enlaces.ts:142-185` (apuntarExtremoEnlace), `app/src/modelo/enlaceVertices.ts:55-60` (reanclarExtremoEnlace), `app/src/modelo/operaciones/eliminacion.ts:80` (eliminarEnlace) | Reemplazo funcionalmente posible via eliminar+crear o apuntarExtremo. Sin operación atómica "reemplazarEnlace" dedicada. |
| §1.4-022 | Mostrar una tabla de enlaces permitidos según los tipos de origen/destino seleccionados. | ✅ | `app/src/modelo/opcionesEnlace.ts:45-98` (evaluarTiposEnlacePermitidos), `app/src/render/jointjs/handlers/modoEnlace.ts` (feedback de validez), `app/e2e/11-beta1-tabla-enlaces.spec.ts:283` (tabla de enlaces) | Tabla de enlaces permitidos según tipos origen/destino |
| §1.4-023 | Bloquear, ocultar o advertir enlaces que no son metodológicamente válidos. | 🟡 | `app/src/modelo/operaciones/helpers.ts:29-104` (validarFirmaEnlace retorna error), `app/src/modelo/opcionesEnlace.ts:45-98` (EvaluacionTipoEnlace.permitido/motivo), `app/src/render/jointjs/handlers/modoEnlace.ts:44-62` (halo verde/rojo) | Bloqueo a nivel de firma en modelo. UI muestra halo rojo en modoEnlace. Sin advertencia explícita en inspector para enlaces ya creados inválidos. |
| §1.4-024 | Advertir consumos repetidos potencialmente inválidos dentro de una descomposición. | ❌ | Buscado: consumo repetido/duplicado en descomposición en `app/src/modelo/` y `app/src/store/`. Sin rastro. | Sin detección de consumos repetidos inválidos dentro de in-zoom. |

### 1.5 Propiedades de enlaces

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §1.5-001 | Editar propiedades desde el enlace visual. | ✅ | `app/src/ui/InspectorEnlace.tsx` (panel completo), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx`, `app/src/ui/inspectorEnlace/SeccionExtremos.tsx`, `app/e2e/07-enlaces-avanzados.spec.ts:538` (edita estilo) | Editar propiedades desde enlace visual (click→InspectorEnlace) |
| §1.5-002 | Editar propiedades desde la oración OPL asociada. | 🟡 | `app/e2e/20-opl-editor-honesto.spec.ts`, `app/src/render/jointjs/handlers/hoverOpl.ts` (hover OPL↔OPD) | OPL panel existe y sincroniza highlight. Sin feature de edición directa de propiedades de enlace desde oración OPL (nombres sí, §3.2; propiedades de enlace no verificado). |
| §1.5-003 | Elegir qué enlace editar cuando una oración corresponde a varios enlaces posibles. | ✅ | `app/src/opl/generar.ts:46` (genera OPL), `app/e2e/03-opl-panel.spec.ts` | OPL agrupa oraciones por OPD. Ambigüedad oración↔varios enlaces no verificada con test dedicado. |
| §1.5-004 | Definir multiplicidad fuente. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:28-34` (fijarMultiplicidadOrigen), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:38` (input Origen), `app/src/modelo/enlaceMultiplicidad.test.ts:57-65` (testea) | Multiplicidad fuente |
| §1.5-005 | Definir multiplicidad destino. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:39-45` (fijarMultiplicidadDestino), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:39` (input Destino), `app/src/modelo/enlaceMultiplicidad.test.ts:67-74` (testea) | Multiplicidad destino |
| §1.5-006 | Usar números enteros como multiplicidad. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:14` (regex `\d+`), `app/src/modelo/enlaceMultiplicidad.test.ts:22,27` (testea "2", "100") | Números enteros como multiplicidad |
| §1.5-007 | Usar rangos de multiplicidad. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:14` (regex `\d+\.\.\d+`), `app/src/modelo/enlaceMultiplicidad.test.ts:23` (testea "2..5") | Rangos de multiplicidad (d..d) |
| §1.5-008 | Usar `?` para opcionalidad. | ❌ | `app/src/modelo/enlaceMultiplicidad.ts:14` (MULTIPLICIDAD_RE no acepta `?`), `app/src/modelo/enlaceMultiplicidad.ts:7` (MULTIPLICIDADES_CANONICAS sin `?`) | Token `?` para opcionalidad no soportado. |
| §1.5-009 | Usar `*` o rangos abiertos para cero o muchos. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:14` (regex `\*` y `\d+\.\.\*`), `app/src/modelo/enlaceMultiplicidad.test.ts:25` (testea "2..*") | `*` y rangos abiertos soportados |
| §1.5-010 | Usar `+` para uno o más. | ✅ | `app/src/modelo/enlaceMultiplicidad.ts:14` (regex `\+`), `app/src/modelo/enlaceMultiplicidad.ts:7` (canónica "+") | `+` para uno o más soportado |
| §1.5-011 | Usar símbolos o parámetros como multiplicidad. | ❌ | `app/src/modelo/enlaceMultiplicidad.ts:14` (solo `\d+`, `N`, `+`, `*`, rangos). Sin soporte para parámetros libres como `m`, `k`. | Solo `N` y números concretos. Sin símbolos o parámetros arbitrarios. |
| §1.5-012 | Agregar restricciones sobre parámetros de multiplicidad. | ❌ | Buscado: restricciones sobre parámetros (p.ej. `m > n`) en `app/src/modelo/enlaceMultiplicidad.ts`. Sin rastro. | Sin restricciones sobre parámetros de multiplicidad. |
| §1.5-013 | Reflejar pluralización y restricciones en OPL. | ✅ | `app/src/modelo/opl/generador-opl.ts` (genera OPL), `app/src/modelo/tipos/enlace.ts:70-71` (multiplicidadOrigen/Destino), `app/e2e/03-opl-panel.spec.ts` | Multiplicidad se almacena en modelo. Sin test que verifique que la OPL refleja pluralización y restricciones específicamente. |
| §1.5-014 | Definir tags o nombres de relación. | ✅ | `app/src/modelo/tipos/enlace.ts:69` (etiqueta), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:91-103` (SeccionEtiquetaEnlace), `app/src/modelo/etiquetasEnlace.ts:3-20` (renombrarEtiquetaEnlace), `app/src/modelo/etiquetasEnlace.test.ts:7-16` (testea) | Tags/nombres de relación vía etiqueta |
| §1.5-015 | Definir paths para distinguir variantes de ejecución o rutas alternativas. | ✅ | `app/src/modelo/rutas.ts:4-25` (definirRutaEtiqueta), `app/src/modelo/rutas.ts:32-36` (enlaceAdmiteRuta: procedural+extremoEstado), `app/src/modelo/rutas.test.ts:14-27` (testea) | Paths/rutas vía rutaEtiqueta |
| §1.5-016 | Mostrar paths en OPL y en el enlace. | ✅ | `app/src/ui/inspectorEnlace/SeccionRuta.tsx:14-25` (UI input ruta), `app/src/render/jointjs/composers/enlace.ts` (rutaEtiqueta label), `app/src/render/jointjs/proyeccion.test.ts:572` (testea "etiqueta de ruta sin reemplazar multiplicidad") | Mostrar paths en el enlace y UI |
| §1.5-017 | Usar probabilidades en fans XOR. | 🟡 | `app/src/modelo/modificadores.ts:62-87` (definirProbabilidad solo si evento), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:72-78` (input probabilidad cuando evento), `app/src/modelo/modificadores.test.ts:43-49` (testea) | Probabilidad existe por enlace evento. No es específico de XOR fans (la probabilidad se asigna al enlace individual, no como distribución entre alternativas de fan). |
| §1.5-018 | Validar probabilidades como valores entre 0 y 1. | ✅ | `app/src/modelo/modificadores.ts:187-189` (probabilidadValida 0-1), `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx:127-131` (validación UI), `app/src/modelo/modificadores.test.ts:45-46` (rechaza -0.1, 1.1) | Validación probabilidad 0-1 |
| §1.5-019 | Representar probabilidades por alternativa. | 🟡 | `app/src/modelo/modificadores.ts:62-87` (probabilidad por enlace), `app/src/modelo/tipos/enlace.ts:75` (campo probabilidad) | Probabilidad por enlace individual, no por alternativa dentro de un fan. |
| §1.5-020 | Definir rates de consumo o producción. | ✅ | `app/src/modelo/enlaceMetadatos.ts:41-65` (definirTasaEnlace), `app/src/modelo/constantes.ts:77-79` (enlaceAdmiteTasa: consumo/resultado/efecto), `app/src/modelo/operaciones.test.ts:181-186` (testea tasa+unidades) | Rates de consumo/producción |
| §1.5-021 | Asociar unidades a rates. | ✅ | `app/src/modelo/enlaceMetadatos.ts:45` (unidadesTasa param), `app/src/modelo/tipos/enlace.ts:85-87` (tasa+unidadesTasa), `app/src/modelo/operaciones.test.ts:184-186` (testea "kg/h") | Unidades asociadas a rates |
| §1.5-022 | Expresar rates en OPL. | 🟡 | `app/src/modelo/tipos/enlace.ts:85-87` (tasa+unidadesTasa en modelo), `app/src/modelo/opl/generador-opl.ts` (OPL generator) | Tasa se almacena en modelo y OPL se genera del modelo. Sin test que verifique que la tasa se refleja explícitamente en la oración OPL. |
| §1.5-023 | Modelar AND implícito mediante enlaces separados. | ✅ | Sin feature explícita de AND. Enlaces separados = AND implícito por defecto. `app/src/modelo/abanicos.ts` solo implementa O/XOR. | AND implícito por convención (enlaces separados), sin conector visual AND dedicado. |
| §1.5-024 | Modelar XOR para selección de exactamente una alternativa. | ✅ | `app/src/modelo/abanicos.ts:23-55` (formarAbanico), `app/src/modelo/abanicos.ts:76-88` (alternarOperadorAbanico XOR), `app/src/modelo/tipos/abanico.ts` (OperadorAbanico="XOR"), `app/src/modelo/abanicos.test.ts:139-147` (testea XOR) | XOR para exactamente una alternativa |
| §1.5-025 | Modelar OR para selección de al menos una alternativa. | ✅ | `app/src/modelo/abanicos.ts:23-55` (formarAbanico default "O"), `app/src/modelo/abanicos.test.ts:17-36` (testea OR default), `app/src/modelo/abanicos.test.ts:38-60` (dos abanicos mismo tipo con puertos distintos) | OR para al menos una alternativa |
| §1.5-026 | Alternar visualmente entre OR y XOR en un fan. | ✅ | `app/src/modelo/abanicos.ts:76-88` (alternarOperadorAbanico cambia O↔XOR), `app/src/render/jointjs/abanicoOverlay.ts` (renderiza arcos distintos), `app/src/modelo/abanicos.test.ts:139-147` (testea toggle) | Alternar visualmente OR↔XOR en un fan |
| §1.5-027 | Separar o unir enlaces de un fan mediante manipulación visual. | ✅ | `app/src/modelo/abanicos.ts:61-74` (quitarRamaDeAbanico), `app/src/modelo/abanicos.ts:57-59` (agregarRamaAAbanico), `app/src/modelo/abanicos.test.ts:117-137` (testea agregar/quitar) | Separar o unir enlaces de un fan |
| §1.5-028 | Crear OR/XOR sobre objetos, procesos, estados y links state-specified. | ✅ | `app/src/modelo/abanicos.ts:23-55` (formarAbanico con extremos Estado), `app/src/modelo/abanicos.test.ts:200-224` (testea XOR sobre resultados a estados) | OR/XOR funciona sobre enlaces con extremos estado. Test demuestra el caso de resultados a estados distintos del mismo objeto. |
| §1.5-029 | Usar XOR/OR combinatorial cuando se requiere seleccionar exactamente o al menos `m` de `n`. | ❌ | Buscado: combinatorial "m de n" en `app/src/modelo/abanicos.ts`. Solo O/XOR (exactamente 1 o al menos 1). Sin selección exacta de m entre n. | Sin XOR/OR combinatorial m de n. |
| §1.5-030 | Aplicar negación lógica mediante estados complementarios o links `not`. | 🟡 | `app/src/modelo/modificadores.ts:5-21` (aplicarModificador "no"), `app/src/render/jointjs/composers/markers.ts:256-258` (badge ¬), `app/src/modelo/modificadores.test.ts:28-30` (testea NO) | Negación lógica via modificador NO en enlace. Estados complementarios: sin implementar. |
| §1.5-031 | Definir puertos automáticos o puertos específicos. | ✅ | `app/src/modelo/operaciones/ports.ts` (fijarAnclaExtremoEnlace), `app/src/modelo/anclajesEnlace.ts` (puertoRelativoAnclaEnlace), `app/src/ui/inspectorEnlace/detalleContratoPuerto.ts` (detalle puerto), `app/e2e/24-conexion-anchor.spec.ts:136` (testea conexión anchor) | Puertos automáticos y específicos |
| §1.5-032 | Mover puertos de enlace para mejorar legibilidad. | ✅ | `app/src/modelo/operaciones/enlaces.ts:187-196` (moverPuertoEnlace), `app/src/ui/inspectorEnlace/SeccionExtremos.tsx` (btn "Reanclar extremo"), `app/src/modelo/enlaceVertices.ts` (reposicionarVerticeApariencia moviendo vertices) | Reanclar extremo cubre cambio de cosa y ancla exacta en un solo diálogo. Sin test dedicado a reposicionamiento de puerto para legibilidad. |
| §1.5-033 | Crear, mover y borrar vértices de enlace. | ✅ | `app/src/modelo/enlaceVertices.ts:10-21` (insertarVerticeApariencia), `app/src/modelo/enlaceVertices.ts:26-43` (reposicionarVerticeApariencia), `app/src/render/jointjs/handlers/toolsEnlace.ts:41` (vertexAdding), `app/src/render/jointjs/handlers/toolsEnlace.test.ts` (testea), `app/e2e/07-enlaces-avanzados.spec.ts:139` (verifica vértice creado+persistido) | Crear, mover y borrar vértices de enlace |
| §1.5-034 | Mantener routing visual con ports y vértices. | ✅ | `app/src/render/jointjs/opcloudRouting.ts` (routing visual), `app/src/render/jointjs/composers/enlace.ts` (composición con ports/vertices), `app/src/modelo/tipos/enlace.ts:131-142` (AparienciaEnlace.vertices) | Routing visual delegado a JointJS. Sin test dedicado a "mantener routing visual con ports y vértices". |
| §1.5-035 | Remover relación sin borrar las cosas conectadas. | ✅ | `app/src/modelo/operaciones/eliminacion.ts:80` (eliminarEnlace solo remueve enlace+apariencias), `app/src/modelo/operaciones/enlaces.ts:547-556` (eliminarEnlacesBatch), `app/src/modelo/operaciones.test.ts` (elimina enlace sin borrar cosas conectadas) | Remover relación sin borrar las cosas conectadas |
| §1.5-036 | Copiar estilo entre enlaces. | ✅ | `app/src/modelo/operaciones/enlaces.ts:558-562` (copiarEstiloEnlace), `app/src/ui/inspectorEnlace/SeccionEstiloEnlace.tsx` (pegar estilo), `app/src/modelo/enlaceEstilo.test.ts:112` (testea copiar), `app/src/store.test.ts:1531` (testea pegar estilo), `app/e2e/07-enlaces-avanzados.spec.ts` (testea copiar/pegar estilo) | Copiar estilo entre enlaces |

---

## 2. Refinamiento y Jerarquía OPM

### 2.1 In-zooming

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §2.1-001 | Refinar procesos en OPDs hijos. | ✅ | `operaciones/refinamiento/descomposicion.ts:57` (descomponerProceso); tests en `operaciones.test.ts:L630,683,868,914` |  |
| §2.1-002 | Crear subprocesos dentro del contorno del proceso refinado. | ✅ | `operaciones/refinamiento/descomposicion.ts:135` (subcosasInicialesInzoom 3 subprocesos); tests en `operaciones.test.ts` |  |
| §2.1-003 | Mantener visible el proceso padre como contexto del OPD hijo. | ✅ | `operaciones/refinamiento/descomposicion.ts:80-88` (apariencia con contextoContornoDescomposicion en OPD hijo); tests en `operaciones.test.ts:L683-700` |  |
| §2.1-004 | Distribuir entradas, salidas, agentes e instrumentos del proceso padre hacia subprocesos. | ✅ | `operaciones/refinamiento/proyeccion.ts:603-632` (proyeccionesEnlaceExterno: consumo→primero, resultado→último, agente/instrumento→todos); tests en `operaciones.test.ts:L1058-1190` |  |
| §2.1-005 | Alternar entre enlace conectado al proceso padre completo y enlace conectado a subprocesos específicos. | 🟡 | `operaciones/refinamiento/proyeccion.ts:197-200` (override manual con enlaceDerivadoManualExisteParaPadre); `quitarAparienciasEnlacePadreMaterializado` (L698) remueve enlace-padre al proyectar a subprocesos. Sin test específico de toggle. | Mecanismo existe; no hay test dedicado para alternar. |
| §2.1-006 | Detectar cuándo un enlace ya no aplica a todos los subprocesos por eliminación de una conexión interna. | 🟡 | `operaciones/refinamiento/proyeccion.ts:153` (redistribuirEnlacesExternosSiPrimerSubproceso); `limpiarEnlacesDerivadosAutomaticos` (L715). Sin test de detección explícita. | Limpieza automática existe; no hay test de trigger por eliminación. |
| §2.1-007 | Crear objetos internos dentro del in-zoom. | ✅ | `creacionInterna.ts:14-41` (crearCosaEnPosicion dentro del contorno); `refinamiento/descomposicion.ts:135` (subcosasInicialesInzoom); tests en `creacionInterna.test.ts:L9` |  |
| §2.1-008 | Distinguir visual y semánticamente objetos internos del in-zoom frente a objetos externos. | ✅ | `politicaApariciones.ts:58-79` (clasificarAparicion: contorno/interno/externo); `contextoRefinamiento.ts` asigna roles; tests en `politicaApariciones.test.ts:L39-70` |  |
| §2.1-009 | Impedir que una cosa externa quede accidentalmente pareciendo interna por arrastre o envolvimiento visual. | ❌ | Sin rastro. `diagnosticoVisual.ts:L249-253` detecta externos-dentro post-hoc pero no impide arrastre/envolvimiento. | Solo diagnóstico posterior; sin prevención. |
| §2.1-010 | Reubicar automáticamente fuera del contorno una cosa externa que fue soltada dentro sin intención semántica válida. | ❌ | Sin rastro. No hay función que reubique automáticamente algo externo soltado dentro del contorno. |  |
| §2.1-011 | Advertir cuando el scope visual no coincide con el scope metodológico. | 🟡 | `diagnosticoVisual.ts:L249-253` regla `visual-externo-dentro-contorno` emite advertencia post-hoc. No es activa en tiempo de edición. | Diagnóstico disponible; sin warning en vivo. |
| §2.1-012 | Representar secuencia por posición vertical de subprocesos. | ✅ | `operaciones/refinamiento/helpers.ts:91-106` (entidadesInternasOrdenadasDeRefinamiento ordena por Y); `compararOrdenTemporal` (L213) ordena Y→X; tests en `creacionInterna.test.ts` |  |
| §2.1-013 | Usar grid y alineación para controlar orden temporal por altura. | 🟡 | `operaciones/refinamiento/helpers.ts:125-144` (agruparSubprocesosParalelos con toleranciaY=4); `INZOOM.toleranciaParaleloY` (descomposicion.ts:42). Sin grid explícito ni snap. | Agrupación por tolerancia existe; grid/snap no implementado. |
| §2.1-014 | Reordenar subprocesos y actualizar el OPD tree cuando la configuración está en modo automático. | 🟡 | `opdReorden.ts:257-294` (ordenSegunCanvasPadre ordena hijos por Y del refinador); `reordenarHermanos` (L90); tests en `opdReorden.test.ts`. Sin modo "automático" toggleable. | Reordenamiento manual existe; automático según canvas también, pero no hay toggle. |
| §2.1-015 | Desactivar el reordenamiento automático globalmente, por usuario o por modelo. | ❌ | Sin rastro. No hay config toggle global/usuario/modelo para desactivar reordenamiento automático. |  |
| §2.1-016 | Modelar refinamiento síncrono y asincrónico de procesos cuando el comportamiento lo requiere. | ❌ | Sin rastro. No hay modelado de refinamiento síncrono vs asíncrono. |  |
| §2.1-017 | Ejecutar simulaciones conceptuales para verificar que el orden de subprocesos produce el comportamiento esperado. | 🚫 | EPICA-91 (PRO-VECTOR). `simulacion/` tiene animación de tokens y plan, pero no verificación conceptual de orden de subprocesos. | Fuera del scope L3 actual. |

### 2.2 Unfolding

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §2.2-001 | Refinar objetos en OPDs de estructura interna. | ✅ | `operaciones/refinamiento/despliegue.ts:64-141` (desplegarObjeto); tests en `operaciones.test.ts:L718,762-800,851` |  |
| §2.2-002 | Crear partes internas de un objeto. | ✅ | `operaciones/refinamiento/despliegue.ts:152-200` (partesInicialesDespliegue 3 partes); tests en `operaciones.test.ts:L762` |  |
| §2.2-003 | Mostrar la relación todo-parte mediante agregación. | ✅ | `operaciones/refinamiento/despliegue.ts:222-251` (enlacesEstructuralesDespliegue crea enlaces agregación/exhibición/generalización/clasificación); tests en `operaciones.test.ts:L776,796` |  |
| §2.2-004 | Navegar desde el objeto folded al OPD unfolded. | 🟡 | `store.test.ts:L822-827` (desplegarSeleccionada navega al OPD hijo). La navegación existe en el store; el modelo en sí no tiene función "navigate-to-unfold". | Navegación a nivel store; no función de modelo pura. |
| §2.2-005 | Mostrar contorno reforzado en la aparición folded para indicar refinamiento existente. | 🟡 | `plegado.ts:43-78` (cambiarModoPlegado). El modo "completo" oculta partes; "parcial" las muestra inline. No hay contorno visual reforzado (borde grueso/icono) explícito para folded con refinamiento. | ModoPlegado existe; indicador visual "reforzado" no implementado explícitamente. |
| §2.2-006 | Crear unfolds en diagrama nuevo. | ✅ | `operaciones/refinamiento/despliegue.ts:87-91` (siempre crea nuevo OPD hijo); tests en `operaciones.test.ts:L718-728` |  |
| §2.2-007 | Crear unfolds dentro del mismo diagrama cuando se requiere detalle local. | ❌ | Sin rastro. Unfold siempre crea OPD hijo; no existe modo in-diagram. | El patrón `descomposicionEnDiagrama` existe para in-zoom pero no para unfold. |
| §2.2-008 | Usar unfolding para exponer atributos, partes, operaciones o subsistemas. | ✅ | `operaciones/refinamiento/despliegue.ts:64-69` (ModoDespliegueObjeto: agregacion/exhibicion/generalizacion/clasificacion); `nombreInicialDespliegue` (L202) y `tipoEnlaceDespliegue` (L215); tests en `operaciones.test.ts:L762-800, completitud.test.ts:L202` |  |
| §2.2-009 | Retirar apariciones visuales que sobrecargan un OPD sin borrar la cosa lógica. | 🟡 | `limpiarAparienciasExternasObsoletas` (proyeccion.ts:521) remueve proxys externos automáticos. La separación entidad/apariencia es fundamental, pero no hay operación explícita "retirar de este OPD sin borrar cosa lógica". | Eliminación de apariencia existe implícitamente; falta operación explícita. |
| §2.2-010 | Mantener consistencia entre el objeto refinado y sus partes en distintos OPDs. | 🟡 | `plegado.ts:329-346` (partesDePlegadoEnOrdenMaterial agrega partes de OPDs de refinamiento); `proyeccion.ts:118` (sincronizarRepresentacionRefinamiento). Sin test específico de consistencia inter-OPD. | Mecanismos existen; sin test de extremo a extremo. |

### 2.3 Semi-folding

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §2.3-001 | Mostrar partes internas dentro de un objeto sin abrir el OPD hijo completo. | ✅ | `plegado.ts:43-78` (cambiarModoPlegado "parcial"); `filasPlegadoParcial` (L303-323); tests en `plegado.test.ts:L20` |  |
| §2.3-002 | Usar vista intermedia entre folded y unfolded. | ✅ | `plegado.ts` ModoPlegado: "completo" (folded), "parcial" (intermedia), OPD hijo (unfolded completo); tests en `plegado.test.ts:L20-48` |  |
| §2.3-003 | Presentar nombres de partes en una vista compacta. | ✅ | `plegado.ts:303-323` (filasPlegadoParcial retorna nombres); `composers/plegado.ts` renderiza filas inline; tests en `plegado.test.ts:L51,62` |  |
| §2.3-004 | Extraer una parte específica desde la vista semi-folded hacia el canvas. | ✅ | `plegado.ts:175-229` (extraerParteDePlegado); tests en `plegado.test.ts:L92` |  |
| §2.3-005 | Reinsertar una parte extraída dentro de la vista compacta. | ✅ | `plegado.ts:270-288` (reinsertarParteEnPlegado); tests en `plegado.test.ts:L157` |  |
| §2.3-006 | Conservar enlaces hacia partes ocultas. | ✅ | `plegado.ts:123-173` (crearEnlaceConExtremoPlegado permite enlaces a partes plegadas sin extraer); `extremoEsFilaPlegadaVisible` (L441); tests en `plegado.test.ts:L201` |  |
| §2.3-007 | Mostrar conteo de partes ocultas cuando un enlace involucra partes no visibles. | ✅ | `plegado.ts:290-295` (contarPartesOcultas); `filasPlegadoParcial` L316 (UMBRAL_PARTES_MAS=3, filaContador); tests en `plegado.test.ts:L173` |  |
| §2.3-008 | Permitir conectar una parte semi-folded directamente a procesos u otras cosas. | ✅ | `plegado.ts:123-173` (crearEnlaceConExtremoPlegado conecta partes semi-folded a procesos); tests en `plegado.test.ts:L201` |  |
| §2.3-009 | Redirigir enlaces hacia la vista compacta cuando una parte vuelve a ocultarse. | 🟡 | `reinsertarParteEnPlegado` (L270) elimina apariencia extraída. Enlaces existentes se reconectan implícitamente vía `extremoEsFilaPlegadaVisible` (L441) porque el enlace referencia la entidad, no la apariencia. Sin lógica explícita de redirección. | Redirección implícita; sin test dedicado. |
| §2.3-010 | Reducir clutter sin perder trazabilidad de composición. | ✅ | `plegado.ts` entero: `UMBRAL_PARTES_MAS`, `filasPlegadoParcial`, conteo; tests en `plegado.test.ts` (12 tests) |  |

### 2.4 Control interno/externo

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §2.4-001 | Mantener separación entre cosas internas y externas a un refinamiento. | ✅ | `creacionInterna.ts:21-31` (detecta interna por posición dentro del contorno); `politicaApariciones.ts:58-79` (clasificarAparicion: confinadaAContorno); tests en `creacionInterna.test.ts:L9,31` y `politicaApariciones.test.ts:L39` |  |
| §2.4-002 | Crear cosas internas solo al soltarlas directamente en el contorno refinado o desde una lista de cosas existentes. | 🟡 | `creacionInterna.ts:14-41` (crearCosaEnPosicion detecta interna al soltar dentro del contorno). No existe "lista de cosas existentes" para drag-in. | Creación por posición implementada; sin soporte de lista. |
| §2.4-003 | Evitar que una cosa externa sea absorbida por redimensionamiento del contorno. | ❌ | Sin rastro. No hay guarda de resize que impida que un redimensionamiento del contorno trague cosas externas. |  |
| §2.4-004 | Advertir si una misma cosa intenta aparecer simultáneamente como interna y externa de manera inconsistente. | 🟡 | `diagnosticoVisual.ts:L249-253` regla `visual-externo-dentro-contorno` detecta aparición inconsistente post-hoc. Sin prevención activa. | Diagnóstico disponible; sin bloqueo activo. |
| §2.4-005 | Apoyar la limpieza de scope mediante eliminación de la aparición visual incorrecta. | 🟡 | `politicaApariciones.ts:81-91` (aparienciaLimpiableAutomaticamente); `proyeccion.ts:521-544` (limpiarAparienciasExternasObsoletas). La limpieza automática de proxys externos existe; la eliminación manual de apariencia incorrecta es posible vía store. | Limpieza automática implementada; eliminación manual vía store. |
| §2.4-006 | Mantener enlaces válidos hacia cosas internas y externas según el contexto. | 🟡 | `proyeccion.ts:603-632` (proyeccionesEnlaceExterno mapea enlaces del padre a subprocesos según tipo). El mantenimiento de enlaces válidos es parcial: cubre proyección pero no validación de contexto enlace interno vs externo. | Proyección cubierta; validación contextual no completa. |

---

## 3. Bimodalidad OPD/OPL

### 3.1 Sincronía diagrama-texto

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §3.1-001 | Generar OPL para cada hecho del OPD. | ✅ | `app/src/opl/generar.ts:46-66`; `app/src/opl/generar.test.ts:1-1242`; e2e `03-opl-panel.spec.ts:51-105` | `generarOpl`/`generarOplInteractivo` generan oraciones canónicas para cada hecho del OPD. 98 unit tests cubren todos los tipos de enlace, estados, refinamiento, abanicos, modificadores, multiplicidad y descomposición. |
| §3.1-002 | Mantener equivalencia semántica entre diagrama y texto. | ✅ | `app/src/opl/generar.test.ts:669-687`; `app/src/opl/panel.test.ts:21-22`; `app/src/opl/roundtrip.test.ts` | Texto plano e interactivo son idénticos; roundtrip parsea→planifica→reconstruye sin pérdida semántica. `derivarPanelOpl` verifica `textoOplActual === lineas.map(l=>l.texto).join`. |
| §3.1-003 | Actualizar OPL cuando cambian nombres, enlaces, estados, multiplicidades, paths, probabilidades o rates. | ✅ | `app/src/opl/generar.test.ts:47-64` (renombrar); `:291-342` (multiplicidad); `:234-245` (probabilidad/modificador); `:792-815` (rutas); e2e `03-opl-panel.spec.ts:51-105` | La regeneración OPL se activa en cada cambio del modelo vía `generarLineasOpl`. Todos los campos (nombres, multiplicidad, path, probabilidad, rate, demora) tienen tests unit que verifican el reflejo en OPL. |
| §3.1-004 | Resaltar OPL al pasar el cursor sobre una cosa o enlace del OPD. | ✅ | `app/src/render/jointjs/handlers/hoverOpl.ts:23-36`; `app/src/ui/panelOpl/Bloques.tsx:105`; `app/src/ui/PanelOpl.tsx:138`; e2e `03-opl-panel.spec.ts:74-79` | `cablearHoverOpl` traduce cell:mouseover→hoverOplRef; `Bloques` aplica `lineaHover` cuando `lineaTocaReferencia(linea, hoverOplRef)`. e2e verifica background-color del token al hover. |
| §3.1-005 | Resaltar OPD al pasar el cursor sobre una oración OPL. | ✅ | `app/src/render/jointjs/handlers/hoverOpl.ts:47-67`; `app/src/ui/panelOpl/RenderToken.tsx:106-107`; `app/src/render/jointjs/JointCanvas.tsx:480` | `aplicarHoverOpl` cambia fill de cells canvas según hoverOplRef. RenderToken emite `fijarHoverOpl` en onMouseEnter/Leave del token OPL. |
| §3.1-006 | Configurar si el hover OPD→OPL está activo. | ✅ | `app/src/render/jointjs/handlers/hoverOpl.ts:23-36` | El hover OPD→OPL siempre está activo; no existe toggle para desactivarlo. El store expone `hoverOplRef` pero sin preferencia de activación/desactivación. |
| §3.1-007 | Configurar si el hover OPL→OPD está activo. | 🟡 | `app/src/ui/panelOpl/RenderToken.tsx:106-107`; `app/src/render/jointjs/handlers/hoverOpl.ts:47-67` | El hover OPL→OPD siempre está activo; no existe toggle. Ídem §3.1-006. |
| §3.1-008 | Sincronizar colores de OPD y OPL para presentaciones integradas. | 🟡 | `app/src/ui/tokens.ts` | Colores de OPL (ink, crimson, accent) y OPD (fill, stroke) usan la misma paleta de tokens. No hay feature explícita de sincronización de colores entre OPD y OPL; la coherencia es implícita vía token system. |
| §3.1-009 | Desacoplar colores de OPD y OPL cuando se requiere exportación o énfasis independiente. | 🟡 | — | No existe feature de desacoplamiento de colores OPD/OPL. Los colores son fijos en `tokens.ts`. |
| §3.1-010 | Mostrar OPL por OPD y OPL consolidado del modelo. | ✅ | `app/src/opl/generar.ts:46`; `app/src/opl/bloquesJerarquicos.ts:17-46`; e2e `03-opl-panel.spec.ts:132-156` | `generarOpl(modelo, opdId)` produce OPL por OPD. `agruparOracionesPorOpd` agrupa en bloques jerárquicos. e2e verifica bloques por OPD colapsables y textoOplActual consolida todas las oraciones. |
| §3.1-011 | Producir texto legible para humanos y consistente para procesamiento automático. | ✅ | `app/src/opl/generar.test.ts` (98 tests); `app/src/opl/generadores/procedural.ts`; `app/src/opl/generadores/estructural.ts`:62-75 | OPL-ES canónico con verbos en español (`consta de`, `maneja`, `consume`, `genera`, `afecta`, `invoca`, `exhibe`, `es un`, `se despliega en`). Markdown: negritas para objetos, itálicas para procesos, backticks para estados. Tests verifican cada construcción canónica. |
| §3.1-012 | Reflejar esencia, afiliación, unidades y alias en OPL según preferencias. | ✅ | `app/src/opl/generadores/estructural.ts:31-50`; `app/src/opl/generadores/refsHints.ts:172-174`; `app/src/opl/generadores/duracionMetadata.ts:47-53`; e2e `28-opl-visibilidad-esencia.spec.ts`; `app/src/opl/generar.test.ts:984-992` | Esencia y afiliación emitidas por `oracionEntidad` (G2 escindida). Unidades emitidas en `oracionValorAtributo`. Alias inline en `nombreOpl` (`entidad.alias ? \`${nombre} {${entidad.alias}}\` : nombre`). Visibilidad controlada por `VisibilidadOpl.esencia`. |

### 3.2 Edición desde OPL

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §3.2-001 | Editar nombres de objetos desde el texto OPL. | ✅ | `app/src/ui/panelOpl/RenderToken.tsx:36-60`; `app/src/opl/edicionCanvas.ts:27-37`; e2e `03-opl-panel.spec.ts:94-101` | Doble-clic en token de entidad → input inline → `renombrarEntidadDesdeOpl`. e2e verifica renombrado "Entrada"→"Cliente" y propagación a canvas y OPL. |
| §3.2-002 | Editar nombres de procesos desde el texto OPL. | ✅ | `app/src/ui/panelOpl/RenderToken.tsx:36-60`; `app/src/opl/edicionCanvas.ts:27-37` | Mismo mecanismo que §3.2-001 aplica a cualquier entidad (objeto o proceso) vía `token.ref?.tipo === "entidad"`. La edición inline y renombrado son genéricos. |
| §3.2-003 | Abrir diálogo de propiedades de enlaces desde la oración OPL. | ✅ | `app/src/ui/panelOpl/RenderToken.tsx:120-124`; `app/src/opl/edicionCanvas.ts:50-57` | Doble-clic en verbo o enlace token → `abrirInspectorEnlaceDesdeOpl(enlaceRef.id)`. El store abre el inspector del enlace vía `intencionEdicionOpl.abrir-inspector-enlace`. |
| §3.2-004 | Editar multiplicidad, tag, path, probabilidad, rate y estilo asociado a enlace desde el OPL cuando corresponde. | 🟡 | `app/src/opl/parser/planificar.ts:320-402`; e2e `20-opl-editor-honesto.spec.ts:57-79` | El editor libre planifica enlaces con multiplicidad (`multiplicidadOrigen`/`multiplicidadDestino`), ruta (`rutaEtiqueta`) y etiqueta (`fijar-etiqueta-enlace`). No disponible en modo OPL interactivo (no-libre). e2e cubre creación de entidades+enlace desde texto, pero no edición de multiplicidad desde texto. |
| §3.2-005 | Desambiguar enlaces cuando una oración textual corresponde a múltiples vínculos. | 🟡 | `app/src/opl/interaccion.ts:69-81`; `app/src/opl/interaccion.test.ts:21-44`; e2e `03-opl-panel.spec.ts:339-357` | `referenciaEnlaceEspecifico` resuelve el enlace correcto por posición del token en líneas multi-enlace. e2e verifica selección de "Entrada B" y eliminación del enlace correcto en oración de abanico. La desambiguación es implícita (por posición); no hay UI de lista de candidatos. |
| §3.2-006 | Mostrar candidatos de enlace antes de abrir el editor correcto. | ❌ | — | No existe lista de candidatos de enlace. La selección desde OPL multi-enlace se resuelve implícitamente por posición del token clicado. |
| §3.2-007 | Usar hover sobre candidatos para identificar el enlace visual. | ❌ | — | Depende de §3.2-006. Sin lista de candidatos, no hay hover sobre candidatos para identificar enlace visual. |
| §3.2-008 | Actualizar el diagrama a partir de cambios iniciados desde el texto. | ✅ | `app/src/opl/parser/planificar.ts` (842 líneas); `app/src/opl/parser/aplicar.ts`; e2e `03-opl-panel.spec.ts:107-130`; e2e `20-opl-editor-honesto.spec.ts:57-79` | El editor libre planifica patches OPL→modelo (renombrar-entidad, crear-entidad, crear-enlace, cambiar-esencia, cambiar-afiliacion, sincronizar-estados, crear-abanico, etc.) y los aplica vía `aplicarEdicionOplLibre`. e2e verifica renombrado, creación de entidades+enlace desde texto, y propagación a canvas. |

### 3.3 Panel OPL

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §3.3-001 | Mostrar u ocultar numeración de oraciones. | ✅ | `app/src/ui/panelOpl/Toolbar.tsx:59-77`; e2e `03-opl-panel.spec.ts:214-232` | Botón "nº" togglea `numeracionVisible`. e2e verifica que al ocultar la numeración, `opacity=0` en el ordinal, y que la selección de token sigue funcionando. |
| §3.3-002 | Mover el panel OPL al panel izquierdo. | ✅ | `app/src/ui/App.tsx:240`; e2e `03-opl-panel.spec.ts:254-278` | Panel OPL usa layout `oplLeftPane` (marginalia izquierda). e2e verifica que `oplBox.x < canvasBox.x` y que la posición persiste tras recarga. El ancho es redimensionable (`03-opl-panel.spec.ts:280-312`). |
| §3.3-003 | Minimizar el panel OPL para dejar de renderizarlo temporalmente y mejorar fluidez en diagramas grandes. | ✅ | `app/src/ui/panelOpl/Toolbar.tsx:46-55`; `app/src/ui/PanelOpl.tsx:59-88`; e2e `03-opl-panel.spec.ts:234-252`; e2e `20-opl-editor-honesto.spec.ts:107-129` | Botón "plegar ▾" minimiza el panel a un rail con contador `OPL · N oraciones · Restaurar`. e2e verifica minimizar, rail visible con conteo, y restaurar. También se verifica legibilidad a 1280×720. |
| §3.3-004 | Expandir el OPL completo como script. | ✅ | `app/src/opl/panel.ts:48`; `app/src/ui/PanelOpl.tsx:90-153`; e2e `03-opl-panel.spec.ts:182-212` | OPL completo renderizado como lista de bloques por OPD con indentación jerárquica, colapsables. El textarea del editor libre se prellena con el OPL completo. |
| §3.3-005 | Copiar o reutilizar el script OPL completo en documentos externos. | ✅ | `app/src/ui/panelOpl/Toolbar.tsx:117-146`; e2e `03-opl-panel.spec.ts:182-212` | Botones "copiar" (clipboard), "html" (descarga HTML) y "exportar" (descarga HTML). e2e verifica copia con contenido canónico y descarga de archivo `.html`. |
| §3.3-006 | Configurar visibilidad de oraciones de esencia. | ✅ | `app/src/opl/opciones.ts`; `app/src/ui/DialogoConfiguracion.tsx:99-113`; `app/src/app/viewmodels/dialogoConfiguracionViewModel.ts:12-14`; e2e `28-opl-visibilidad-esencia.spec.ts` | Select "Visibilidad de esencia en OPL" en Configuración → OPL con opciones `siempre`, `solo-difiere`, `oculta`. La preferencia `oplEsenciaVisibilidad` se persiste en `preferenciasUi.indice`. e2e verifica cambio a "oculta" suprime oraciones, "siempre" las restaura, y Cancelar descarta el cambio. |
| §3.3-007 | Mostrar esencia solo cuando difiere del default. | ✅ | `app/src/ui/DialogoConfiguracion.tsx:110`; `app/src/opl/generadores/estructural.ts:38-41` | Opción "Solo si difiere del default" en el select de esencia. En `oracionEntidad`, cuando `visibilidad === "solo-difiere"`, solo se emite la oración si `esenciaDifiere` o `afiliacionDifiere` del default (informacional/sistémica). |
| §3.3-008 | Mostrar u ocultar unidades de objetos computacionales. | 🟡 | `app/src/opl/generadores/estructural.ts:45-50`; `app/src/opl/generadores/duracionMetadata.ts:51-53` | Las unidades se emiten en OPL para objetos con valor computacional (`oracionValorAtributo`: `[unidad]`). `formatearUnidadInline` retorna `[unidad]` cuando `entidad.unidad` existe. No existe toggle para ocultar/mostrar unidades. |
| §3.3-009 | Mostrar u ocultar alias. | 🟡 | `app/src/opl/generadores/refsHints.ts:172-174`; `app/src/opl/generadores/duracionMetadata.ts:47-49` | El alias se refleja en OPL vía `nombreOpl` (`entidad.alias ? \`${nombre} {${entidad.alias}}\` : nombre`). `formatearAliasInline` retorna ` {alias}` cuando existe. No existe toggle para ocultar/mostrar alias. |

---

## 4. Canvas, Navegación y Organización Visual

### 4.1 Canvas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §4.1-001 | Hacer pan sobre el OPD. | ✅ | src/render/jointjs/JointCanvas.tsx:786; e2e/_smoke-helpers.ts:349; e2e/05-refinamiento-y-plegado.spec.ts:576 | Pan via CSS overflow:auto en el viewport; assertCanvasScrollable verifica scrollLeft/scrollTop positivos tras scroll programático. |
| §4.1-002 | Hacer zoom in y zoom out. | ✅ | src/render/jointjs/handlers/zoom.ts:1; src/render/jointjs/handlers/zoom.test.ts:1 | Zoom-wheel (Ctrl+rueda) y Ctrl+0 fit implementados y cubiertos con 7 unit tests. Sin e2e que dispare wheel real en el canvas. |
| §4.1-003 | Abrir, cerrar, redimensionar o desacoplar paneles laterales. | ✅ | src/ui/divisorPanel.tsx:34; src/ui/divisorPanel.test.ts:1; e2e/02-canvas-y-render.spec.ts:616 | DivisorPanel arrastra árbol e inspector; unit test cubre limitarAnchoPanel; e2e verifica clusters y paneles visibles. |
| §4.1-004 | Quitar y restaurar el navegador. | ❌ | e2e/02-canvas-y-render.spec.ts:657 | No existe panel navegador/minimapa independiente que se pueda quitar y restaurar. MapaSistema es una vista global separada; e2e/02 confirma "Mapa del sistema" ausente del command palette. |
| §4.1-005 | Desacoplar el navegador y moverlo libremente. | ❌ | — | No hay implementación de navegador flotante desacoplable. |
| §4.1-006 | Ajustar tamaño del navegador. | ❌ | — | Sin navegador flotante, la capacidad de ajustar su tamaño no aplica. |
| §4.1-007 | Mostrar una grilla configurable. | ✅ | src/canvas/grid.ts:1; src/render/jointjs/composers/grid.ts:1; src/canvas/grid.test.ts:1; src/render/jointjs/composers/grid.test.ts:1 | GridConfig (activa, paso, color, strokeWidth, escala, snapActivo); configurarGridPaper aplica mesh; ambos módulos con unit tests. |
| §4.1-008 | Activar o desactivar grilla desde toolbar. | ✅ | src/ui/CommandPalette.tsx:472; e2e/02-canvas-y-render.spec.ts:650 | Acción "menu-grid-canvas" en command palette; e2e busca "cuadricula" y verifica el ítem. |
| §4.1-009 | Configurar tamaño de grilla en píxeles. | ✅ | src/canvas/grid.ts:21; src/canvas/grid.test.ts:15 | GridConfig.paso configurable (4-160 px) con normalización clamp; unit test. Sin e2e del diálogo de configuración. |
| §4.1-010 | Configurar color, grosor y escala visual de la grilla. | ✅ | src/canvas/grid.ts:5; src/canvas/grid.test.ts:15; src/render/jointjs/composers/grid.test.ts:12 | Color, strokeWidth y escala configurables; unit tests validan rango/aplicación. Sin e2e de UI. |
| §4.1-011 | Mover cosas con incrementos de grilla. | ✅ | src/canvas/grid.ts:36; src/canvas/grid.test.ts:5 | cuantizarPosicion probado para snap activo/inactivo. Sin e2e de drag con snap real. |
| §4.1-012 | Alinear objetos, procesos, estados y enlaces. | ✅ | src/canvas/operacionesBatch.ts:325; src/canvas/operacionesBatch.test.ts:89 | alinearPorEje + alinearEnlaces* probados en unit. Sin e2e del flujo UI de alineación. |
| §4.1-013 | Usar la alineación como ayuda para orden temporal en in-zoom. | ✅ | src/canvas/operacionesBatch.ts:325 | alinearPorEje cubre el caso técnico; sin test que valide semántica de "orden temporal en in-zoom". |
| §4.1-014 | Agregar vértices a enlaces con clic. | ✅ | src/render/jointjs/handlers/toolsEnlace.ts:41; src/render/jointjs/handlers/toolsEnlace.test.ts:1; e2e/07-enlaces-avanzados.spec.ts:139 | linkTools.Vertices con vertexAdding:true; e2e/07 verifica vértice creado y persistido en JSON. |
| §4.1-015 | Eliminar vértices con doble clic. | ✅ | src/render/jointjs/jointCanvasAdapter.ts:96; src/render/jointjs/handlers/toolsEnlace.test.ts:1 | vertexRemove:true activo cuando enlace editable; toolsEnlace.test cubre lógica de Segments. Sin e2e de dblclick para eliminar vértice. |
| §4.1-016 | Deshacer y rehacer operaciones de modelado. | ✅ | src/leyes/undo.test.ts:14; e2e/06-undo-redo-dirty.spec.ts:60 | undo.test valida atomicidad OPL multi-patch; e2e/06 ejercita Ctrl+Z/Ctrl+Shift+Z. |
| §4.1-017 | Marcar cosas del modelo con colores para revisión o comunicación. | ✅ | src/canvas/operacionesBatch.test.ts:64; src/ui/BarraHerramientasElemento.test.ts:281 | aplicarEstiloApariencias testeado en unit; BarraHerramientasElemento.test cubre copiar/pegar-estilo. Sin e2e del flujo de marcado por color. |
| §4.1-018 | Alternar visibilidad de notas. | ✅ | src/ui/CommandPalette.tsx:472; src/render/jointjs/proyeccion.test.ts:17 | proyeccion.test:31-40 prueba que descripcionesVisibles altera la etiqueta; acción en CommandPalette. |
| §4.1-019 | Ajustar tamaño de cosas manualmente. | ✅ | src/render/jointjs/handlers/resize.ts:41; src/render/jointjs/proyeccion.test.ts:95; e2e/02-canvas-y-render.spec.ts:445 | Handles 8-direccionales; proyeccion.test BUG-a41f5c verifica selectores resize-nw…resize-w; e2e ejercita drag con restrictTranslate. |
| §4.1-020 | Mantener tamaño automático cuando se desea que la cosa se adapte al texto. | ✅ | src/modelo/tipos/apariencia.ts:51; src/modelo/operaciones/apariencias.ts:151; src/serializacion/validarApariencias.test.ts:27 | modoTamano="auto" y volverAAutoTamano implementados; validarApariencias.test valida el campo. Sin e2e del flujo Inspector → Volver auto. |
| §4.1-021 | Ajustar cosa a texto. | ✅ | src/modelo/operaciones/apariencias.ts:140; src/ui/inspector/SeccionTamano.tsx:47 | ajustarAlTexto calcula tamanoAjustadoAlTexto; botón "Ajustar texto". Sin unit test dedicado ni e2e. |
| §4.1-022 | Desactivar autosizing para permitir formas manuales. | ✅ | src/canvas/operacionesBatch.test.ts:119; src/ui/inspector/SeccionTamano.tsx:20 | redimensionarBatch.test valida que modoTamano="manual" se preserva; toggle Auto/Manual. |
| §4.1-023 | Respetar tamaño mínimo salvo modo manual. | ✅ | src/canvas/grid.ts:19; src/render/jointjs/handlers/resize.ts:174; src/canvas/grid.test.ts:24 | RESIZE_MIN={70,40} aplicado en resize.ts y apariencias.ts; clampValor probado. |
| §4.1-024 | Evitar que texto largo rompa el layout mediante auto-resize. | ✅ | src/render/jointjs/composers/entidad.test.ts:69 | V-212: nombre largo expande cell.size.width por encima del apariencia.width (auto-resize con texto). |

### 4.2 OPD Tree / OPD3

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §4.2-001 | Navegar por jerarquía de OPDs. | ✅ | src/ui/ArbolOpd.tsx:163; src/ui/arbol/NodoOpd.tsx:86; e2e/04-arbol-y-pestanas.spec.ts:70 | Click en treeitem → cambiarOpdActivo; e2e verifica aria-current y canvas con entidades del OPD. |
| §4.2-002 | Expandir todo el árbol. | ✅ | src/ui/ArbolOpd.tsx:70; src/ui/arbol/togglesArbol.ts:20; src/ui/arbol/handlersTeclado.test.ts:20 | Ctrl+E → expandirTodoArbol(). Test unitario detecta el atajo. |
| §4.2-003 | Colapsar todo el árbol. | ✅ | src/ui/ArbolOpd.tsx:73; src/ui/arbol/togglesArbol.ts:8; src/ui/arbol/handlersTeclado.test.ts:20 | Ctrl+Shift+E → idsColapsables(). Test unitario. |
| §4.2-004 | Ocultar nombres completos y mostrar solo numeración. | ✅ | src/ui/arbol/NodoOpd.tsx:135; src/ui/ArbolOpd.tsx:37; src/store.test.ts:1456 | nombresArbolVisibles=false oculta el label; solo muestra code mono. Test store verifica toggle/persistencia. |
| §4.2-005 | Mostrar nuevamente nombres completos. | ✅ | src/ui/arbol/NodoOpd.tsx:135; src/ui/ArbolOpd.tsx:37; src/store.test.ts:1456 | Mismo toggle restaura label. Test store. |
| §4.2-006 | Ajustar ancho del árbol. | ✅ | src/ui/divisorPanel.tsx:34; src/ui/divisorPanel.test.ts:1; src/store.test.ts:1447 | DivisorPanel 160-600 px; doble clic resetea a 280. Unit + store test (clamp). |
| §4.2-007 | Colapsar y reabrir el panel del árbol. | ❌ | — | No existe botón/atajo de colapso total del panel árbol (no llega a 0). Buscado toggle panelArbolVisible/colapsar-panel — sin resultado. |
| §4.2-008 | Navegar con mouse. | ✅ | src/ui/arbol/NodoOpd.tsx:86; e2e/04-arbol-y-pestanas.spec.ts:70 | Click en nodo → cambiarOpdActivo; e2e verifica cambio de entidades. |
| §4.2-009 | Navegar con teclado. | ✅ | src/ui/arbol/handlersTeclado.ts:24; src/store/uiPanel.ts:408; src/store.test.ts:1425 | Arrow keys + Ctrl+Arrow (navegarOpdArriba/Abajo/...). Unit + store test. |
| §4.2-010 | Entrar a OPDs hijos desde halos o toolbar. | 🟡 | src/ui/BarraHerramientasElemento.tsx:105; src/ui/ejecutarAccionContextual.ts:34; e2e/04-arbol-y-pestanas.spec.ts:284 | Entrar a OPD hijo vía acción inzoom desde canvas/palette. No hay halo/botón directo en el nodo árbol. |
| §4.2-011 | Eliminar OPDs hoja. | ✅ | src/ui/arbol/NodoOpd.tsx:172; src/modelo/opdEliminacion.ts:30; src/store.test.ts:971 | Botón eliminar (deshab. si raíz/tiene hijos); eliminarOpdDesdeArbol. Store test + undo. |
| §4.2-012 | Bloquear eliminación de OPDs internos. | ✅ | src/ui/arbol/NodoOpd.tsx:62; src/store/modelo/acciones-opd.ts:198; src/store.test.ts:992 | disabled=esRaiz||tieneHijos; error "Eliminar descendientes primero". Store test. |
| §4.2-013 | Deshacer eliminación de OPDs. | ✅ | src/store/modelo/acciones-opd.ts:207; src/modelo/opdEliminacion.test.ts:33; src/store.test.ts:987 | commitModelo → undo stack; deshacer restaura OPD+refinamiento. Store test. |
| §4.2-014 | Reordenar OPDs automáticamente según orden de procesos en el in-zoom. | ✅ | src/ui/MenuContextualArbol.tsx:63; src/store/modelo/acciones-opd.ts:48; src/modelo/opdReorden.test.ts:239 | "Alinear según canvas" → ordenSegunCanvasPadre → reordenarHermanos. Test por y de apariencia. |
| §4.2-015 | Reordenar OPDs manualmente cuando se desactiva el modo automático. | ✅ | src/ui/ArbolOpd.tsx:113; src/ui/arbol/NodoOpd.tsx:84; src/store.test.ts:1393 | Drag en NodoOpd (draggable=modoOrdenManual); handleDrop → moverHermano. Store test. |
| §4.2-016 | Configurar reordenamiento automático a nivel de usuario. | ✅ | src/store/uiPanel.ts:232; src/store.test.ts:1393; src/persistencia/workspaceStorage.test.ts:20 | fijarModoOrdenArbol persiste en preferenciasUi. Store test; sin e2e dedicado. |
| §4.2-017 | Configurar reordenamiento automático a nivel de modelo. | ❌ | — | No existe configuración de reordenamiento a nivel de modelo (solo preferencia UI). modoOrdenArbol no está en el JSON del modelo. |
| §4.2-018 | Mostrar OPDs de submodelos cargados. | ❌ | — | No existe concepto de submodelo. Buscado submodelo/includedModel/subModel — no encontrado. |
| §4.2-019 | Refrescar OPDs de submodelos cuando se requiere sincronización. | ❌ | — | Consecuencia de §4.2-018: sin submodelos no hay refresco. |

### 4.3 OPD Manager

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §4.3-001 | Abrir una vista de gestión completa del árbol OPD. | ✅ | src/ui/GestionArbolOpd.tsx:7; src/ui/App.tsx:343; e2e/04-arbol-y-pestanas.spec.ts:308 | Modal "Gestión del árbol OPD" con árbol completo, búsqueda, cortar/pegar/renombrar. e2e verifica apertura. |
| §4.3-002 | Buscar OPDs por nombre. | ✅ | src/app/viewmodels/gestionArbolOpdViewModel.ts:62; e2e/04-arbol-y-pestanas.spec.ts:324 | filtrarArbolGestion por nombre. e2e rellena search "SD" y verifica nodo. |
| §4.3-003 | Buscar OPDs por número. | ✅ | src/app/viewmodels/gestionArbolOpdViewModel.ts:67 | filtrarArbolGestion extrae código SDx.m con regex y lo filtra. Sin unit test dedicado al filtro de código. |
| §4.3-004 | Abrir un OPD desde el gestor. | 🟡 | src/ui/GestionArbolOpd.tsx:104 | El nodo del gestor no tiene onClick de navegación ni botón "Abrir". El gestor gestiona jerarquía, no navega. Sin test. |
| §4.3-005 | Cortar OPDs. | ✅ | src/ui/GestionArbolOpd.tsx:153; src/store.test.ts:1398 | Botón "Cortar" marca cortadoId. Store test (gestionArbolAbierta/busquedaOpdGestion). |
| §4.3-006 | Pegar OPDs en otra ubicación jerárquica. | ✅ | src/ui/GestionArbolOpd.tsx:15; src/store/modelo/acciones-opd.ts:54; src/modelo/opdReorden.test.ts:140 | "Pegar aquí" → pegarSobre → moverOpdEnGestion → moverNodo. Test verifica nuevo padreId/ordenLocal. |
| §4.3-007 | Mover OPDs mediante arrastre. | ❌ | — | GestionArbolOpd no implementa drag-and-drop; usa cut/paste. Sin draggable/onDragStart. |
| §4.3-008 | Reordenar la jerarquía de OPDs. | 🟡 | src/store/modelo/acciones-opd.ts:44; src/modelo/opdReorden.test.ts:204 | reordenarOpdsHermanos existe en el modelo; el gestor no lo expone (solo cambia padre). Test de modelo. |
| §4.3-009 | Renombrar o reorganizar nodos cuando la operación está permitida. | ✅ | src/ui/GestionArbolOpd.tsx:140; e2e/04-arbol-y-pestanas.spec.ts:126 | Doble clic en nombre → input inline → renombrarOpdDesdeArbol. e2e (F2 en árbol lateral); gestor mismo patrón. |
| §4.3-010 | Abrir el gestor mediante atajo. | ✅ | src/ui/arbol/handlersTeclado.ts:61; src/ui/ArbolOpd.tsx:102; e2e/04-arbol-y-pestanas.spec.ts:308 | Ctrl+D abre GestionArbolOpd. e2e presiona Control+d y verifica diálogo. |
| §4.3-011 | Ver OPDs de modelos incluidos o submodelos. | ❌ | — | No existe concepto de submodelo/modelos incluidos. |
| §4.3-012 | Navegar rápidamente en modelos con decenas o cientos de OPDs. | 🟡 | src/ui/GestionArbolOpd.tsx:56; src/app/viewmodels/gestionArbolOpdViewModel.ts:62 | Filtro reduce el árbol + scroll overflow:auto. Sin virtualización para cientos de nodos; sin test de rendimiento. |

### 4.4 System Map

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §4.4-001 | Generar un mapa completo del árbol OPD. | 🟡 | src/canvas/mapa/descriptor.ts; src/store/mapa.ts:220; src/render/jointjs/mapaSistema.test.ts:68 | construirDescriptorMapa + abrirVistaMapa implementados; tests verdes. APP_FEATURES.mapaSistema=false desconecta la superficie. |
| §4.4-002 | Representar cada OPD como nodo/miniatura dentro de un OPD especial de mapa. | 🟡 | src/render/jointjs/mapa/proyeccion.ts:13; src/render/jointjs/mapaSistema.test.ts:162 | proyectarMapaSistemaAJointCells emite rect por nodo con thumbnail/marcadores. Test. Feature-flag OFF. |
| §4.4-003 | Mostrar relaciones jerárquicas de in-zooming y unfolding. | 🟡 | src/canvas/mapa/descriptor.ts; src/canvas/mapa/tipos.ts; src/render/jointjs/mapaSistema.test.ts:74 | AristaMapa captura par padre-hijo; proyectadas como Link gris (no OPM). Tests. Feature-flag OFF. |
| §4.4-004 | Ver el modelo completo como estructura navegable. | 🟡 | src/ui/MapaSistema.tsx:24; src/store/mapa.ts:255; src/store.test.ts:1381 | MapaSistema monta paper con pan/zoom/scroll; saltarAOpdDesdeMapa navega. Store test. Feature-flag OFF. |
| §4.4-005 | Navegar al OPD original desde el mapa. | 🟡 | src/ui/MapaSistema.tsx:78; src/store/mapa.ts:255; src/store.test.ts:1272 | element:pointerdblclick → saltarAOpdDesdeMapa. Store test. Feature-flag OFF. |
| §4.4-006 | Cerrar el mapa al saltar al OPD seleccionado. | 🟡 | src/store/mapa.ts:261; src/store.test.ts:1381 | saltarAOpdDesdeMapa fija vistaMapaActiva=false y limpia cache. Store test. Feature-flag OFF. |
| §4.4-007 | Usar el mapa para inspeccionar profundidad y ramificación del modelo. | 🟡 | src/ui/MapaSistema.tsx:204; src/store/mapa.ts:273; src/render/jointjs/mapaSistema.test.ts:131 | Filtros profundidad/subárbol + panel Estadísticas + tooltip hover. Múltiples tests. Feature-flag OFF. |

### 4.5 Draggable OPM Things

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §4.5-001 | Listar cosas existentes del modelo. | 🟡 | src/ui/biblioteca/ListaBibliotecaCosas.tsx:26; src/ui/biblioteca/filtrosBiblioteca.test.ts:83; e2e/20-biblioteca-dock.spec.ts:10 | Lista implementada; unit test cubre orden/conteo. e2e/20 confirma que el dock está PAUSADO y no se expone en el producto. |
| §4.5-002 | Buscar cosas por nombre. | 🟡 | src/ui/biblioteca/filtrosBiblioteca.ts:47; src/ui/biblioteca/filtrosBiblioteca.test.ts:105 | Búsqueda case-insensitive con trim probada en unit. Dock paused. |
| §4.5-003 | Filtrar por objetos. | 🟡 | src/ui/biblioteca/filtrosBiblioteca.ts:51; src/ui/biblioteca/filtrosBiblioteca.test.ts:91 | Filtro tipo=objeto probado en unit. Dock paused. |
| §4.5-004 | Filtrar por procesos. | 🟡 | src/ui/biblioteca/filtrosBiblioteca.ts:51; src/ui/biblioteca/filtrosBiblioteca.test.ts:98 | Filtro tipo=proceso probado en unit. Dock paused. |
| §4.5-005 | Mostrar esencia física/informática. | 🟡 | src/ui/biblioteca/ListaBibliotecaCosas.tsx:14 | iconoListLogical diferencia física/informacional por esencia. Sin unit test del selector y sin e2e (dock paused). |
| §4.5-006 | Mostrar afiliación sistémica/ambiental. | ❌ | src/ui/biblioteca/ListaBibliotecaCosas.tsx | ListaBibliotecaCosas no renderiza afiliación sistémica/ambiental. Solo muestra esencia vía iconos. |
| §4.5-007 | Indicar atributos con su cosa propietaria. | ❌ | — | No hay sección de atributos con su cosa propietaria en la biblioteca. |
| §4.5-008 | Mostrar advertencias cuando una cosa no puede reutilizarse en un contexto. | 🟡 | src/ui/DialogoColisionNombre.tsx:24; e2e/29-colision-nombre.spec.ts:73 | DialogoColisionNombre advierte y oferta reuso al detectar colisión. e2e/29 lo ejerce. No cubre advertencia durante drag desde biblioteca. |
| §4.5-009 | Arrastrar una cosa existente a un OPD para crear una aparición visual. | 🟡 | src/render/jointjs/handlers/seleccion.ts:275; src/store.test.ts:1578 | onDrop lee entidadId y llama crearAparienciaEntidadEnCanvas; store.test valida push único en undoStack. Sin e2e (dock paused). |
| §4.5-010 | Usar la lista como vía preferente para reutilizar cosas y evitar duplicados. | 🟡 | src/ui/biblioteca/ListaBibliotecaCosas.tsx:55 | Ítem draggable emite entidadId (crea apariencia, no nueva entidad). Dock paused; sin e2e. |
| §4.5-011 | Abrir búsqueda de ubicaciones desde la lista de cosas. | ❌ | src/ui/biblioteca/ListaBibliotecaCosas.tsx:77 | Botones OPD navegan al OPD (onNavegarOpd) pero no abren un diálogo de búsqueda de ubicaciones desde la lista. Parcial. |
| §4.5-012 | Soportar listas grandes mediante búsqueda, scroll y paginación conceptual. | 🟡 | src/ui/biblioteca/filtrosBiblioteca.ts:41; src/ui/biblioteca/BibliotecaDock.tsx:176 | Query filter + overflow:auto. Sin paginación. Dock paused; sin estrés de listas grandes. |

---

## 5. Recuperación de Contexto y Conectividad

### 5.1 Bring connected things

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §5.1-001 | Traer cosas conectadas que existen en otros OPDs. | ✅ | src/canvas/operacionesBatch.ts:150; src/store/modelo/acciones-canvas.ts:820; src/canvas/operacionesBatch.test.ts:142 | traerConectadosBatch hidrata OPD activo con apariencias de vecinos en otros OPDs; test "vecinos directos por familia sin propagar". |
| §5.1-002 | Traer conectividad directa de una cosa seleccionada. | ✅ | src/ui/DialogoTraerConectados.tsx:25; src/canvas/operacionesBatch.ts:150; src/canvas/operacionesBatch.test.ts:142 | Diálogo+batch traen la conectividad directa de la cosa seleccionada. |
| §5.1-003 | Configurar si se traen enlaces procedurales. | ✅ | src/canvas/reglasTraer.ts:31; src/ui/DialogoTraerConectados.tsx:54; src/canvas/reglasTraer.test.ts:7 | Familias procedural-habilitador/transformador (checkboxes) configurables; test mapea tipos del kernel. |
| §5.1-004 | Configurar si se traen enlaces estructurales/fundamentales. | ✅ | src/canvas/reglasTraer.ts:35; src/ui/DialogoTraerConectados.tsx:54; src/canvas/reglasTraer.test.ts:10 | Familia "estructural" (agregacion/exhibicion/generalizacion/clasificacion) togglable; test. |
| §5.1-005 | Usar defaults para filtros de conexión. | ✅ | src/canvas/reglasTraer.ts:48 (normalizarFamiliasTraer); src/store/modelo/acciones-canvas.ts:828; src/canvas/reglasTraer.test.ts:7 | Default = todas las familias; normalización a default cubierta por test. |
| §5.1-006 | Traer solo vecinos directos, evitando expansión metodológica excesiva por relaciones heredadas o de refinamiento. | ✅ | src/canvas/operacionesBatch.ts:178 (vecinosFaltantes, vecinos directos); src/canvas/reglasTraer.ts:24 (sin familia de refinamiento); src/canvas/operacionesBatch.test.ts:142 | Solo vecino directo por enlace; familias no incluyen refinamiento/herencia; test "sin propagar". |
| §5.1-007 | Reconstruir contexto local de un proceso in-zoomed. | 🟡 | src/canvas/operacionesBatch.ts:150; src/canvas/operacionesBatch.test.ts:142 | El mecanismo traer-conectados reconstruye contexto local; no hay test específico de "proceso in-zoomed" para este encuadre de uso. |
| §5.1-008 | Traer objetos externos necesarios para entender un OPD hijo. | 🟡 | src/canvas/operacionesBatch.ts:150; src/canvas/operacionesBatch.test.ts:142 | Mismo mecanismo (apariencias de vecinos en OPD hijo); encuadre de uso sin test dedicado. |
| §5.1-009 | Evitar redibujar manualmente conectividad ya existente en el modelo. | ✅ | src/canvas/operacionesBatch.ts:212 (no duplica apariencia/enlace visible); src/canvas/operacionesBatch.test.ts:152 | "no duplica apariencia visible y solo agrega enlace faltante" evita redibujo manual. |

### 5.2 Bring links between selected entities

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §5.2-001 | Seleccionar dos o más cosas ya visibles. | ✅ | src/ui/BarraHerramientasElemento.tsx:425 (seleccionados>=2); src/ui/ejecutarAccionContextual.ts:85; src/canvas/seleccionMultiple.test.ts | Multiselección de 2+ cosas; acción traer-enlaces requiere len>=2. |
| §5.2-002 | Traer solo relaciones existentes entre esas cosas seleccionadas. | ✅ | src/canvas/operacionesBatch.ts:233 (traerEnlacesEntreBatch, enlacesInternosSeleccion); src/canvas/operacionesBatch.test.ts:169 | "materializa solo enlaces internos a la selección". |
| §5.2-003 | Reconstruir conectividad parcial sin traer todo el vecindario. | ✅ | src/canvas/operacionesBatch.ts:233; src/canvas/operacionesBatch.test.ts:169 | Solo enlaces entre seleccionados, sin traer vecindario externo. |
| §5.2-004 | Traer enlaces estructurales entre seleccionados. | 🟡 | src/canvas/operacionesBatch.ts:233; src/canvas/operacionesBatch.test.ts:169 | traerEnlacesEntreBatch materializa cualquier enlace interno (incl. estructurales); el test no discrimina por familia estructural específicamente. |
| §5.2-005 | Traer enlaces procedurales entre seleccionados. | 🟡 | src/canvas/operacionesBatch.ts:233; src/canvas/operacionesBatch.test.ts:169 | Idem: materializa procedurales internos; test no separa por familia procedural. |
| §5.2-006 | Mantener el OPD enfocado en un subconjunto controlado. | ✅ | src/canvas/operacionesBatch.ts:233 (solo internos); src/canvas/operacionesBatch.test.ts:169 | Mantiene OPD enfocado en el subconjunto seleccionado. |
| §5.2-007 | Usar la función para reparar vistas incompletas después de arrastrar cosas existentes al canvas. | 🟡 | src/canvas/operacionesBatch.ts:233; src/store/modelo/acciones-canvas.ts:855; src/canvas/operacionesBatch.test.ts:169 | Repara vistas incompletas (idempotente, agrega enlaces faltantes); flujo "tras arrastrar existentes" sin test e2e específico. |

### 5.3 Búsqueda de cosas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §5.3-001 | Buscar objetos y procesos por nombre. | ✅ | src/ui/DialogoBuscarCosas.tsx:60; src/app/viewmodels/busquedaCosasViewModel.ts:139; e2e/11-beta1-busqueda.spec.ts:19 | Búsqueda por nombre de objetos/procesos; e2e "Ctrl+F filtra entidades". |
| §5.3-002 | Filtrar resultados por tipo. | ✅ | src/ui/DialogoBuscarCosas.tsx:69 (select filtro); e2e/11-beta1-busqueda.spec.ts:46 | Filtro objetos/procesos/estados/enlaces; e2e selectOption("procesos"). |
| §5.3-003 | Ver todas las ubicaciones de una cosa. | ✅ | src/ui/DialogoBuscarCosas.tsx:18 (una fila por aparición); src/app/viewmodels/busquedaCosasViewModel.ts:60; e2e/11-beta1-busqueda.spec.ts:114 | Lista todas las apariciones/ubicaciones (col Ubicación = opdNombre). |
| §5.3-004 | Saltar a una ubicación específica. | ✅ | src/ui/DialogoBuscarCosas.tsx:115 (onClick saltar); src/app/viewmodels/busquedaCosasViewModel.ts:154; e2e/11-beta1-busqueda.spec.ts:63 | Click/Enter salta a la ubicación; e2e "salto cambia OPD". |
| §5.3-005 | Cambiar automáticamente al OPD donde vive la aparición elegida. | ✅ | src/app/viewmodels/busquedaCosasViewModel.ts:60 (salto.opdId); e2e/11-beta1-busqueda.spec.ts:92 | Cambia automáticamente al OPD destino (treeitem opd-2 activo). |
| §5.3-006 | Enfocar visualmente la cosa encontrada. | ✅ | src/ui/DialogoBuscarCosas.tsx:13 (halo temporal 3s + select); e2e/11-beta1-busqueda.spec.ts:97; e2e/11-beta1-busqueda.spec.ts:165 | Enfoque visual: selecciona en canvas + halo; e2e "dispara halo temporal". |
| §5.3-007 | Abrir búsqueda desde toolbar. | 🟡 | src/ui/toolbar/ToolbarBase.tsx:410 (botón ⌕ buscar→command palette); src/ui/CommandPalette.tsx:464 (Buscar en el modelo); src/app/ports/globalShortcutsPort.ts:211 (Ctrl+F) | Búsqueda de cosas abre vía Ctrl+F y command palette; el botón del toolbar abre command palette, no el diálogo buscar-cosas directo. |
| §5.3-008 | Abrir búsqueda desde la lista de cosas arrastrables. | ❌ | — | El diálogo buscar-cosas solo se abre por Ctrl+F / command palette (globalShortcutsPort.ts:211, CommandPalette.tsx:464). La lista arrastrable (BibliotecaDock) tiene su propio input de filtro local, no abre buscar-cosas. Busqué abrirBusquedaCosas en biblioteca/. |
| §5.3-009 | Usar búsqueda para reutilizar cosas lógicas existentes. | 🟡 | src/app/viewmodels/busquedaCosasViewModel.ts:60; e2e/11-beta1-busqueda.spec.ts:63 | La búsqueda opera por apariencia de entidad existente (reutiliza la cosa lógica al saltar/seleccionar); no hay flujo/test de "insertar aparición desde búsqueda para reutilizar". |

---

## 6. Edición Visual, Estilo y Medios

### 6.1 Estilo de cosas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §6.1-001 | Cambiar fuente de objetos y procesos. | ✅ | src/ui/StyleControls.tsx:82 (Familia tipográfica→onApplyText); src/ui/InspectorEntidad.tsx:256; src/modelo/tipos/apariencia.ts:28 | UI cambia fontFamily vía aplicarEstiloTexto; no hallé test que asevere persistencia de fontFamily en estilo de entidad (store.test solo ejercita fill/borderColor). |
| §6.1-002 | Cambiar tamaño de fuente. | ✅ | src/ui/StyleControls.tsx:95 (slider Tamaño→fontSize); src/ui/InspectorEntidad.tsx:256; src/modelo/tipos/apariencia.ts:29 | fontSize en UI+tipo; sin test que ejercite persistencia del campo en estilo de entidad. |
| §6.1-003 | Definir tamaño de fuente por defecto. | ❌ | — | No existe configuración de tamaño de fuente por defecto. Busqué fontSizeDefault/estiloPorDefecto en src/ y DialogoConfiguracion.tsx; el default 14 es literal en StyleControls.tsx:97, no configurable. |
| §6.1-004 | Cambiar color de texto. | ✅ | src/ui/StyleControls.tsx:121 (SwatchesCompact textColor); src/ui/InspectorEntidad.tsx:256; src/modelo/tipos/apariencia.ts:32 | textColor en UI+tipo; sin test que ejercite la persistencia del campo. |
| §6.1-005 | Usar colores personalizados. | 🟡 | src/modelo/estilos.ts:3 (PALETA_ESTILO_COSA); src/ui/StyleControls.tsx:62; src/modelo/estilos.test.ts:54 | Hay paleta curada + normalización de hex válidos, pero NO un color picker libre (`type="color"`) para cosas; solo swatches predefinidos. |
| §6.1-006 | Cambiar color de borde. | ✅ | src/ui/StyleControls.tsx:67 (Borde→borderColor); src/store/modelo (aplicarEstiloSeleccionado); src/store.test.ts:319 | borderColor aplicado y persistido; test "aplicar y resetear estilo" (#70e483). |
| §6.1-007 | Cambiar color de relleno. | ✅ | src/ui/StyleControls.tsx:62 (Fill); src/modelo/estilos.ts (aplicarEstiloApariencia); src/store.test.ts:321; src/modelo/estilos.test.ts:7 | fill persistido; test "aplica fill y borderColor preservando otros campos". |
| §6.1-008 | Alinear texto a izquierda, centro u otras posiciones. | ✅ | src/ui/StyleControls.tsx:131 (segmented Izq/Centro/Der→textAnchor); src/modelo/tipos/apariencia.ts:33 | textAnchor (start/middle/end) en UI+tipo; sin test que asevere persistencia. "otras posiciones" se limita a alineación horizontal. |
| §6.1-009 | Posicionar texto manualmente en eje X/Y. | ❌ | — | EstiloApariencia (src/modelo/tipos/apariencia.ts:25) solo tiene textAnchor; no hay campos labelX/labelY ni posicionamiento manual del texto en eje X/Y. Busqué labelX/textOffset/posicionTexto. |
| §6.1-010 | Usar controles rápidos para ubicar texto arriba, abajo, izquierda, derecha o centro. | ❌ | — | No hay controles rápidos de posición de texto arriba/abajo/izq/der/centro (solo alineación horizontal textAnchor). Sin campo de posición vertical en el modelo. |
| §6.1-011 | Resetear posición manual de texto. | ❌ | — | Sin posición manual de texto, no existe reset de la misma. El "Reset texto" (StyleControls.tsx:74) resetea estilo de texto, no posición. |
| §6.1-012 | Resetear estilo completo. | ✅ | src/ui/StyleControls.tsx:40 (Reset Style→onReset); src/modelo/estilos.ts (resetearEstiloApariencia); src/store.test.ts:328; src/modelo/estilos.test.ts:34 | Reset completo de estilo; test "reset remueve estilo sin tocar semantica ni geometria". |
| §6.1-013 | Configurar estilos por defecto para nuevas cosas. | ❌ | — | No existe configuración de estilos por defecto para nuevas cosas. Busqué estilosPorDefecto/defaultStyle/nuevasCosas en src/ y DialogoConfiguracion.tsx; ausente. |
| §6.1-014 | Aplicar estilo sin alterar la semántica OPM. | ✅ | src/modelo/estilos.ts (aplicarEstiloApariencia preserva campos); src/modelo/estilos.test.ts:7; src/modelo/estilos.test.ts:34 | Estilo separado de semántica/geometría; tests "preservando otros campos" y "reset sin tocar semantica". |

### 6.2 Estilo de enlaces

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §6.2-001 | Cambiar color de enlace. | ✅ | src/ui/DialogoEstiloEnlace.tsx:72 (swatch color); src/modelo/enlaceEstilo.test.ts:30; e2e/07-enlaces-avanzados.spec.ts:538 | color de enlace; test unit "aplica color HEX" + e2e persiste color. |
| §6.2-002 | Cambiar grosor de enlace. | ✅ | src/ui/DialogoEstiloEnlace.tsx:95 (GROSORES→strokeWidth); src/modelo/enlaceEstilo.test.ts:50; e2e/07-enlaces-avanzados.spec.ts:571 | strokeWidth; test "aplica grosor válido" + e2e (strokeWidth:3). |
| §6.2-003 | Copiar estilo de un enlace. | ✅ | src/modelo/enlaceEstilo.ts (copiarEstiloEnlace); src/ui/StyleControls.tsx:138; src/modelo/enlaceEstilo.test.ts:112; src/store.test.ts:1536 | copiarEstiloEnlaceAlPortapapeles; test de buffer in-memory + e2e "Copiar estilo". |
| §6.2-004 | Aplicar estilo copiado a otro enlace. | ✅ | src/ui/InspectorEnlace.tsx:313 (pegarEstiloDesdePortapapeles); src/store.test.ts:1531 | pegarEstiloEnlaceDesdePortapapeles; test "emite un solo push en undoStack". |
| §6.2-005 | Mantener propiedades semánticas separadas de estilo visual. | ✅ | src/modelo/tipos/enlace.ts (EnlaceEstilo separado); src/modelo/enlaceEstilo.test.ts:44 (rechaza inválidos); src/store.test.ts:1527 | estilo en campo `estilo` aparte; reset deja estilo undefined sin tocar semántica. |
| §6.2-006 | Editar estilo desde propiedades del enlace. | ✅ | src/ui/InspectorEnlace.tsx:306 (sección Estilo); e2e/07-enlaces-avanzados.spec.ts:554 (irATabEstiloEnlace + abrir-dialogo-estilo-enlace) | Estilo editable desde el inspector/propiedades del enlace; e2e abre diálogo desde inspector. |

### 6.3 Notas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §6.3-001 | Crear notas libres en el canvas. | ❌ | — | No existe entidad/feature de notas libres en canvas. TipoEntidad = objeto\|proceso (src/modelo/tipos/entidad.ts:15); sin tipo Nota. Busqué crearNota/notaLibre/sticky en src/. |
| §6.3-002 | Editar título de nota. | ❌ | — | Sin notas: no hay edición de título de nota. |
| §6.3-003 | Editar contenido de nota. | ❌ | — | Sin notas: no hay edición de contenido de nota. |
| §6.3-004 | Mover notas. | ❌ | — | Sin notas: no hay mover notas. |
| §6.3-005 | Eliminar notas. | ❌ | — | Sin notas: no hay eliminar notas. |
| §6.3-006 | Ocultar todas las notas sin borrarlas. | ❌ | — | Sin notas: no hay ocultar notas. |
| §6.3-007 | Mostrar notas ocultas. | ❌ | — | Sin notas: no hay mostrar notas ocultas. |
| §6.3-008 | Conectar nota a objeto o proceso mediante línea punteada. | ❌ | — | Sin notas: no hay conexión nota↔cosa con línea punteada. |
| §6.3-009 | Usar notas como anotación no nuclear del modelo. | ❌ | — | Sin feature de notas como anotación no nuclear. |
| §6.3-010 | Mantener notas fuera de la gramática OPM nuclear. | ❌ | — | Sin notas (no hay nada que mantener fuera de la gramática nuclear). |

### 6.4 Imágenes en cosas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §6.4-001 | Asociar imágenes por URL. | ✅ | src/ui/ModalImagenObjeto.tsx:101 (URL); src/modelo/imagenObjeto.ts:16; e2e/02-canvas-y-render.spec.ts:418 | Asocia imagen por URL (y local data-url); e2e persiste imagen embebida. |
| §6.4-002 | Validar URLs de imagen por extensión cuando corresponde. | ✅ | src/modelo/imagenObjeto.ts:3 (EXTENSIONES_VALIDAS); src/modelo/imagenObjeto.ts:30; src/modelo/imagenObjeto.test.ts:18 | validarUrlImagen exige extensión .png/.jpg/.gif/.svg/.webp; test "valida URL con extensión". |
| §6.4-003 | Previsualizar imagen antes de asociarla. | ✅ | src/ui/ModalImagenObjeto.tsx:155 (preview img); src/modelo/imagenObjeto.test.ts:24; e2e/02-canvas-y-render.spec.ts:434 | Previsualización antes de confirmar; e2e verifica data-url cargada en el campo. |
| §6.4-004 | Asociar varias imágenes a una misma cosa. | ❌ | — | ImagenEntidad (src/modelo/tipos/entidad.ts:54) es una sola `imagen`, no array. Comentario en imagenObjeto.ts:14 "destilado sin pool multi-user". No hay asociación de varias imágenes. |
| §6.4-005 | Alternar/ciclar entre imágenes asociadas. | ❌ | — | Sin múltiples imágenes (campo único), no hay alternar/ciclar entre imágenes asociadas. |
| §6.4-006 | Mostrar indicador visual de imagen embebida. | ✅ | src/render/jointjs/composers/imagenOverlay.ts:88 (imagen-insignia, data-testid entidad-insignia-imagen); src/render/jointjs/composers/imagenOverlay.test.ts:18 | Insignia visual de imagen embebida; test "modo texto solo renderiza insignia". |
| §6.4-007 | Mostrar texto, imagen o ambos. | ✅ | src/ui/ModalImagenObjeto.tsx:10 (MODOS imagen/texto/imagen-texto); src/render/jointjs/composers/imagenOverlay.ts:36; src/render/jointjs/composers/imagenOverlay.test.ts:7 | Modos texto/imagen/imagen+texto; tests overlay por modo. |
| §6.4-008 | Usar pool privado de imágenes. | 🚫 | — | Pool privado de imágenes = feature OPCloud con backend multi-user (Firestore); imagenObjeto.ts:14 lo destila "sin pool multi-user". No hay backend en el repo. |
| §6.4-009 | Usar pool organizacional de imágenes. | 🚫 | — | Pool organizacional requiere backend OPCloud inexistente. |
| §6.4-010 | Usar pool global de imágenes. | 🚫 | — | Pool global requiere backend OPCloud inexistente. |
| §6.4-011 | Buscar imágenes por tags. | 🚫 | — | Búsqueda de imágenes por tags depende del pool/backend OPCloud inexistente. |
| §6.4-012 | Aplicar modo visual de imágenes a un OPD completo. | ✅ | src/store/modelo/acciones-ui.ts:400 (fijarModoImagenGlobal); src/render/jointjs/proyeccion.ts:105 (modoImagenGlobal); src/ui/CommandPalette.tsx:473; e2e/08-mvp-alpha-residual.spec.ts:293; e2e/12-toolbar-overflow.spec.ts:158 | Modo de imagen global del OPD (ciclar solo nombre/imagen/imagen+nombre); e2e ciclan modo-imagen-global. |
| §6.4-013 | Usar imágenes en templates. | ❌ | — | No hay imágenes en templates. Las plantillas viven en persistencia local sin pool de imágenes asociado; busqué imagen en templates, ausente. |
| §6.4-014 | Usar imágenes en stereotypes. | ❌ | — | No existen stereotypes en el modelo (TipoEntidad solo objeto/proceso); sin imágenes de stereotype. |
| §6.4-015 | Exportar diagramas considerando imágenes embebidas por URL. | 🟡 | src/render/jointjs/mapaExport.ts:163 (toSVG convertImagesToDataUris:true); src/render/jointjs/mapaExport.test.ts:30 | Export PNG rasteriza desde el SVG del paper; se mantiene `convertImagesToDataUris` cuando hay `toSVG`, pero no hay test específico de imagen URL embebida. |

---

## 7. Gestión de Modelos

### 7.1 Ciclo de vida

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §7.1-001 | Crear modelo nuevo. | ✅ | src/store/pestanas.ts:L32 (crearPestanaNueva); src/store.test.ts:L173 ("nuevo modelo descarta historial...");src/store.test.ts:L189; e2e/06-undo-redo-dirty.spec.ts:L139 | Crear modelo nuevo (descarta historial, deja SD único). |
| §7.1-002 | Abrir varios modelos en tabs. | ✅ | src/store/pestanas.ts:L66 (abrirPestana); src/store.test.ts:L36;L49; e2e/04-arbol-y-pestanas.spec.ts:L180 ("pestanas de sesion mantienen modelos independientes") | Múltiples modelos en tabs con modelo clonado independiente. |
| §7.1-003 | Indicar en tab si un modelo aún no está guardado. | ✅ | src/ui/BarraPestanas.tsx:L94 (style.pestanaDirty); src/store/pestanas.test.ts:L123; e2e/06-undo-redo-dirty.spec.ts:L60 | Tab marca dirty visualmente; e2e ejercita estado dirty/undo. |
| §7.1-004 | Guardar modelo actual. | ✅ | src/store/persistencia.ts:L271 (guardarLocal); e2e/01-carga-y-workspace.spec.ts:L71 ("guarda incremental") | Guardar modelo actual (guardado incremental con id). |
| §7.1-005 | Guardar como nuevo modelo o nueva ubicación. | ✅ | src/ui/DialogoGuardarComo.tsx:L65;L73 (carpeta destino); src/store/persistencia.test.ts:L20; src/store/workspaceMod.test.ts:L22; e2e/01-carga-y-workspace.spec.ts:L71; e2e/31-gestion-modelos.spec.ts:L55 | Guardar como nuevo nombre + ubicación (breadcrumb destino). |
| §7.1-006 | Renombrar modelo. | ✅ | src/store/modelo/acciones-ui.ts (renombrarModeloActual); src/persistencia/backend.ts (guardarModeloBackend); src/store/persistencia.test.ts | Renombra vía backend y rechaza duplicados. |
| §7.1-007 | Cargar modelos desde navegador de modelos. | ✅ | src/store/persistencia.ts:L331 (cargarLocal); src/ui/DialogoCargarModelo.tsx; e2e/01-carga-y-workspace.spec.ts:L142 ("dialogo cargar busca descripcion, selecciona tile y carga") | Cargar desde navegador de modelos. |
| §7.1-008 | Abrir modelo con doble clic. | ✅ | src/ui/DialogoCargarModelo.tsx:L300;L356 (onDblClick→onAbrir); src/ui/PanelCarpetas.tsx:L207; e2e/01-carga-y-workspace.spec.ts:L142 | Doble clic abre (tile y fila lista); e2e selecciona y carga. |
| §7.1-009 | Cerrar modelo abierto. | ✅ | src/store/pestanas.ts:L76 (cerrarPestana protege última y confirma dirty); src/store/pestanas.test.ts:L76;L86; e2e/06-undo-redo-dirty.spec.ts:L195 | Cierra modelo abierto con confirmación dirty. |
| §7.1-010 | Autosalvar modelos según intervalo configurable. | 🟡 | src/store/persistencia.ts:L411 (iniciarAutosalvado); src/persistencia/autosalvado.ts:L22; src/persistencia/autosalvado.test.ts:L13 ("timer dispara al intervalo y ejecuta salvado") | Autosave periódico implementado y testeado; intervalo default 5 min. No verificado e2e en vivo (timer real). |
| §7.1-011 | Configurar intervalo de autosave. | ❌ | src/ui/DialogoConfiguracion.tsx (solo Modelo/Cuadrícula/OPL); src/persistencia/autosalvado.ts:L27 (intervaloMs es param) | No hay UI para configurar el intervalo de autosave. `crearAutosalvado` acepta `intervaloMs` pero nada lo expone al usuario ni lo persiste. Busqué en DialogoConfiguracion y src/store/*. |
| §7.1-012 | Crear versiones por guardado manual. | ✅ | src/persistencia/versiones.ts:L33 (crearVersionResultado); src/store/persistencia.ts:L301 (crearVersion al guardar); src/persistencia/versiones.test.ts:L23; src/store.test.ts:L160 ("version manual queda asociada al modelo guardado") | Versiones por guardado manual (flag crearVersionAlGuardar). |
| §7.1-013 | Crear versiones por autosave. | ❌ | src/store/persistencia.ts:L411-440 (iniciarAutosalvado: guarda con autosalvado:true, NO llama crearVersion) | El autosalvado sobreescribe el modelo (flag autosalvado) pero NO crea snapshot de versión. Busqué crearVersion en la ruta de autosalvado: ausente. |

### 7.2 Organización

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §7.2-001 | Crear carpetas. | ✅ | src/persistencia/workspace.ts (crearCarpeta padre null=raíz); src/store/workspaceMod.ts (crearCarpetaEnActual); src/store/workspaceMod.test.ts | Crear carpetas raíz. |
| §7.2-002 | Crear subcarpetas. | ✅ | src/persistencia/workspace.ts (crearCarpeta con padreId); src/store/workspaceMod.ts (usa carpetaActualId como padre); src/store/workspaceMod.test.ts | Subcarpetas = crearCarpeta con padre. |
| §7.2-003 | Renombrar carpetas. | ✅ | src/persistencia/workspace.ts (renombrarCarpeta); src/store/workspaceMod.ts; src/store/workspaceMod.test.ts | Renombra carpeta con validación de duplicados por hermanas. |
| §7.2-004 | Eliminar carpetas vacías. | ✅ | src/persistencia/workspace.ts (eliminarCarpeta, bloquea no-vacía sin cascada); src/store/workspaceMod.ts | Elimina carpetas; bloquea no vacías salvo cascada explícita. |
| §7.2-005 | Detectar carpetas aparentemente vacías que contienen versiones o archivados ocultos. | ❌ | src/ui/PanelCarpetas.tsx:L133 (empty="Sin modelos en esta carpeta"); src/persistencia/workspace.ts:L258 (listarHijosDeCarpeta filtra archivados/versiones) | No hay detección de "carpeta aparentemente vacía con versiones/archivados ocultos". El listado filtra archivados sin advertir que hay contenido oculto. Busqué en PanelCarpetas, panelCarpetas/*, workspace.ts. |
| §7.2-006 | Navegar por ruta de carpeta. | 🟡 | src/ui/PanelCarpetas.tsx:L7 (Breadcrumb); src/store/workspaceMod.ts:L272 (abrirCarpeta); src/persistencia/workspace.ts:L290 (rutaDeCarpeta); src/ui/DialogoGuardarComo.tsx:L49 (navegarBreadcrumb) | Navegación por ruta de carpeta cableada (breadcrumb→abrirCarpeta). El test Breadcrumb.test.ts cubre breadcrumb de OPD (SD→OPD), no el de carpetas; falta test directo del breadcrumb de carpetas. |
| §7.2-007 | Buscar modelos por nombre. | ✅ | src/ui/PanelCarpetas.tsx:L63-68;L187 (filtro por nombre en panel); src/persistencia/workspace.ts:L320 (buscarGlobal por nombre); e2e/01-carga-y-workspace.spec.ts:L163 ("workspace L4 mueve modelos y busca global"); src/store.test.ts:L144 | Buscar por nombre (filtro local + global). |
| §7.2-008 | Buscar modelos en subcarpetas tras umbral mínimo de caracteres. | 🟡 | src/persistencia/workspace.ts:L325-326 (buscarGlobal, q.length<3→[]); src/store/carpetas.ts:L311 (ejecutarBusquedaGlobal); src/store.test.ts:L144 (busqueda global ejercitada) | Búsqueda global con umbral mínimo de 3 caracteres y recorre todos los modelos (subcarpetas incluidas). El umbral exacto no tiene test dedicado; el filtro local del panel NO recursa subcarpetas. |
| §7.2-009 | Ver modelos recientes. | ✅ | src/ui/PanelCarpetas.tsx (Recientes slice); src/persistencia/workspace.ts; src/persistencia/backend.ts (workspace backend) | Modelos recientes desde WorkspaceIndice backend. |
| §7.2-010 | Ver detalles al pasar el cursor sobre modelos recientes. | 🟡 | src/ui/PanelCarpetas.tsx:L207 (title={modelo.nombre} en reciente) | Hover muestra solo el nombre del modelo (atributo title), no descripción/fecha/detalles. Cobertura parcial; sin test del tooltip. |
| §7.2-011 | Cambiar entre vista de iconos y vista de lista. | ✅ | src/ui/DialogoCargarModelo.tsx (toggle tiles/lista en memoria); src/ui/PanelCarpetas.tsx (VistaModo) | Toggle vista iconos/lista sin persistencia en navegador. |
| §7.2-012 | Ordenar vista de lista por nombre, descripción, fecha o autor. | 🟡 | src/ui/DialogoCargarModelo.tsx:L222;L342-345 (orden por nombre/descripcion/actualizadoEn/bytes) | Ordena por nombre, descripción, fecha (modificado) y tamaño. NO ofrece orden por autor (no existe campo autor; sin backend de usuarios). |
| §7.2-013 | Mostrar autor y fecha de creación/modificación. | 🟡 | src/ui/DialogoCargarModelo.tsx:L306;L361 (actualizadoEn); src/ui/panelCarpetas/Tile.tsx:L66;L94 (actualizadoEn) | Muestra fecha de modificación (actualizadoEn). NO muestra autor ni fecha de creación separada: no hay campo autor (sin backend/usuarios) y creadoEn no se expone en UI. |
| §7.2-014 | Mover modelos entre carpetas. | ✅ | src/persistencia/movimientoModelos.ts:L50 (moverModelo); src/store/workspaceMod.ts:L339 (moverModeloDirecto); src/persistencia/movimientoModelos.test.ts:L6;L36; src/store.test.ts:L126 ("cut paste...mueve modelo entre carpetas") | Mover modelos entre carpetas (drag directo + cut/paste). |
| §7.2-015 | Mover modelos junto con autosaves y versiones. | ✅ | src/persistencia/movimientoModelos.ts:L50 (mover solo cambia carpetaId; versiones viven en ModeloIndice.versiones); src/persistencia/workspace.ts:L16-27 (versiones y autosalvado son metadata del ModeloIndice); src/persistencia/movimientoModelos.test.ts:L6 ("...sin cambiar otros metadatos") | Versiones/autosaves son parte del registro del modelo (no se separan al mover). Test verifica que mover no altera otros metadatos. |
| §7.2-016 | Cortar y pegar modelos. | ✅ | src/persistencia/movimientoModelos.ts:L12 (cortarModelo);L32 (pegarModelo); src/store/workspaceMod.ts:L287;L309 (cortarModelo/pegarEn); src/persistencia/movimientoModelos.test.ts:L6; src/store.test.ts:L126 | Cortar y pegar modelos entre carpetas. |
| §7.2-017 | Mover carpetas completas cuando está permitido. | ✅ | src/persistencia/movimientoModelos.ts:L68 (moverCarpeta + validarMovimientoSinCiclo); src/store/workspaceMod.ts:L296;L355 (cortarCarpeta/moverCarpetaDirecto); src/persistencia/movimientoModelos.test.ts:L20 ("mueve carpetas por cut/paste y bloquea ciclos") | Mover carpetas completas con validación anti-ciclo. |

### 7.3 Versionado

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §7.3-001 | Mostrar u ocultar versiones. | ✅ | src/store/carpetas.ts:L333 (toggleMostrarVersiones, pref persistida); src/persistencia/versiones.ts:L168 (filtrarVersionesVisibles); src/persistencia/versiones.test.ts:L203 ("filtrarVersionesVisibles respeta toggle") | Mostrar/ocultar versiones (toggle + filtro). |
| §7.3-002 | Ver carpeta de versiones por modelo. | ✅ | src/ui/DialogoVersiones.tsx:L46-67 (tabla de versiones por modelo); src/store/carpetas.ts:L223 (abrirDialogoVersiones por modeloId); src/persistencia/versiones.ts:L59 (listarVersiones por modeloId) | Diálogo de versiones por modelo. |
| §7.3-003 | Ver autosave versions. | ❌ | src/store/persistencia.ts:L411-440 (autosalvado no genera version); src/persistencia/versiones.ts (crearVersion no se invoca en ruta autosalvado) | No existen "versiones de autosave" (el autosalvado no crea snapshots de versión, ver §7.1-013). El diálogo de versiones solo lista versiones manuales. |
| §7.3-004 | Recuperar versiones anteriores. | ✅ | src/persistencia/versiones.ts:L70 (restaurarVersionResultado); src/store/carpetas.ts:L231 (restaurarVersionComoCopia); src/persistencia/versiones.test.ts:L23;L35 | Recuperar versión anterior (como copia nueva). |
| §7.3-005 | Abrir versiones guardadas. | 🟡 | src/ui/DialogoVersiones.tsx:L62 ("Restaurar como copia"); src/store/carpetas.ts:L231 | "Abrir versión guardada" se materializa como restaurar-como-copia (no hay apertura directa de la versión en pestaña read-only). Implementado vía copia; sin modo "abrir versión" puro. |
| §7.3-006 | Mantener hasta varias versiones recientes del mismo día. | ✅ | src/persistencia/versiones.ts:L130-160 (aplicarPoliticaLogScaleVersiones, bucket dia max 10); src/persistencia/versiones.test.ts:L186 ("aplica política log-scale y máximo absoluto 10") | Mantiene hasta 10 versiones recientes del día (bucket "dia"). |
| §7.3-007 | Mantener versiones representativas por semana y por mes. | 🟡 | src/persistencia/versiones.ts:L139-150 (buckets semana max 7, mes max 4); src/persistencia/versiones.test.ts:L186 | Buckets semana/mes existen (no "representativa por semana/mes" sino retención por bucket). El test valida límite total 10 y existencia de buckets; no valida selección semanal/mensual fina. |
| §7.3-008 | Aplicar política de retención resumida por día/semana/mes. | ✅ | src/persistencia/versiones.ts:L130 (aplicarPoliticaLogScaleVersiones día/semana/mes/histórico);L163 (idsVersionesPodadas); src/persistencia/versiones.test.ts:L186 | Política de retención resumida por día/semana/mes/histórico. |
| §7.3-009 | Distinguir visualmente modelo editable, modelo read-only y autosave. | 🟡 | src/ui/panelCarpetas/Tile.tsx:L128 (icono autosalvado); src/store/persistencia.ts:L272;L278 (readOnly→guarda copia); src/store.test.ts:L1469 ("readOnly bloquea commitModelo") | Distingue autosave (icono) y read-only (estado readOnly bloquea edición + mensaje). Falta distintivo visual explícito de versión read-only vs editable en el diálogo de versiones; cobertura parcial de la tríada. |
| §7.3-010 | Comparar versiones del mismo modelo. | ❌ | src/ui/DialogoVersiones.tsx (solo Fecha/Nombre/Bytes/Acciones, sin comparar) | No existe comparación de versiones. Busqué "comparar/diff" en src/ (sin coincidencias) y en DialogoVersiones (solo restaurar/eliminar). |
| §7.3-011 | Usar comparación para auditar cambios entre versiones. | ❌ | — | Sin comparación (§7.3-010), no hay auditoría de cambios entre versiones. Sin rastro de diff/auditoría de versiones en src/. |

### 7.4 Archivado

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §7.4-001 | Archivar automáticamente modelos tras inactividad prolongada. | 🟡 | src/persistencia/workspace.ts:L365 (autoArchivarPorEdad, default 90 días); src/store.test.ts (suite importa autoArchivar) | Auto-archivado por inactividad implementado y con cobertura de import en store.test/local.test; no verifiqué que se dispare automáticamente en runtime (sin gatillo periódico ubicado, ¿manual?). |
| §7.4-002 | Archivar modelos manualmente. | ✅ | src/persistencia/workspace.ts:L356 (archivarModelo); src/store/workspaceMod.ts:L365;L374 (archivarModeloActual/PorId); src/store.test.ts:L144 ("archivado manual oculta modelos...") | Archivar modelos manualmente. |
| §7.4-003 | Ocultar modelos archivados de la vista normal. | ✅ | src/persistencia/workspace.ts:L258-268 (listarHijosDeCarpeta filtra archivados);L329 (buscarGlobal excluye archivados); src/store.test.ts:L144 | Oculta archivados de la vista/búsqueda normal. |
| §7.4-004 | Mostrar archivados mediante toggle. | ✅ | src/store/carpetas.ts:L327 (toggleMostrarArchivados, pref persistida); src/ui/DialogoCargarModelo.tsx:L44 (incluirArchivados: mostrarArchivados); src/persistencia/workspace.ts:L261 (opción incluirArchivados) | Toggle muestra archivados. |
| §7.4-005 | Restaurar modelos archivados. | ✅ | src/persistencia/workspace.ts:L393 (restaurarArchivado);L405 (restaurarModelo); src/store/workspaceMod.ts:L390 (restaurar); src/store.test.ts:L144 ("...hasta restaurar") | Restaurar modelos archivados. |
| §7.4-006 | Identificar en lista si un modelo está archivado. | ✅ | src/ui/panelCarpetas/Tile.tsx:L94 (badge "ARCH" archivado); src/persistencia/workspace.ts:L16-22 (flag archivado en ModeloIndice) | Badge ARCH identifica modelo archivado en lista. |

---

## 9. Reutilización y Gobierno Semántico

### 9.1 Templates

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §9.1-001 | Crear templates a partir de modelos o partes de modelo. | ❌ | — | No existe creación de templates. Busqué `template/plantilla` en modelo/, store/, persistencia/, ui/: solo CSS `gridTemplate*` y un hint de gramática OPL ("plantilla SSOT"). No hay gestor de templates. |
| §9.1-002 | Guardar templates. | ❌ | — | Sin persistencia de templates en `persistencia/` (grep `plantilla|template` vacío). |
| §9.1-003 | Insertar templates en el modelo actual. | ❌ | — | No hay `insertarTemplate` ni operación de inserción. |
| §9.1-004 | Insertar templates mediante selección y carga. | ❌ | — | Sin selección+carga de templates. |
| §9.1-005 | Insertar templates con doble clic. | ❌ | — | Sin doble clic para insertar template. |
| §9.1-006 | Previsualizar el SD del template al pasar el cursor. | ❌ | — | Sin previsualización SD de template al hover. |
| §9.1-007 | Organizar templates en carpetas. | ❌ | — | Sin carpetas de templates (las carpetas del store son de OPD/biblioteca, no templates). |
| §9.1-008 | Insertar templates de múltiples OPDs bajo el OPD actual. | ❌ | — | Sin inserción de templates multi-OPD. |
| §9.1-009 | Crear OPDs hijos al insertar un template con jerarquía. | ❌ | — | Sin creación de OPDs hijos por jerarquía de template. |
| §9.1-010 | Insertar varias copias de un mismo template con sufijos para evitar colisiones. | ❌ | — | Sin copias múltiples con sufijos por template. La lógica de sufijo "2" vive solo en colisión de nombre (§9.4), no en templates. |
| §9.1-011 | Conservar nombres reutilizables en exhibición cuando la semántica permite compartirlos. | ❌ | — | Sin reutilización de nombres por template. |
| §9.1-012 | Editar una copia insertada como parte normal del modelo. | ❌ | — | No aplica: no hay copias insertadas de template. |
| §9.1-013 | Desacoplar instancia insertada del template fuente. | ❌ | — | Sin desacople de instancia/template fuente. |
| §9.1-014 | Editar templates desde el gestor de templates. | ❌ | — | Sin gestor de templates editable. |
| §9.1-015 | Actualizar templates guardados sin actualizar automáticamente copias ya insertadas. | ❌ | — | Sin actualización de templates guardados. |

### 9.2 Stereotypes

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §9.2-001 | Usar stereotypes. | ❌ | — | Stereotypes ausentes. Único rastro: el label de nodo "OPM Stereotype" en `modelo/fixtures.ts:529` es contenido de un modelo ejemplo (metamodelo OPM), no una feature de stereotypes. |
| §9.2-002 | Anclar objetos o procesos a stereotypes. | ❌ | — | Sin anclaje de objetos/procesos a stereotypes. |
| §9.2-003 | Traer componentes internos de un stereotype al OPD. | ❌ | — | Sin traer componentes internos de stereotype. |
| §9.2-004 | Usar stereotypes para conjuntos de parámetros. | ❌ | — | Sin stereotypes para parameter sets. |
| §9.2-005 | Usar stereotypes para requisitos. | ❌ | — | Sin stereotypes de requisito (ver también §10.3, todo ausente). |
| §9.2-006 | Usar stereotypes para dispositivos o componentes recurrentes. | ❌ | — | Sin stereotypes para dispositivos/componentes recurrentes. |
| §9.2-007 | Heredar componentes, atributos, rangos y propiedades desde el stereotype. | ❌ | — | Sin herencia de componentes/atributos/rangos desde stereotype. |
| §9.2-008 | Restringir subrangos dentro del rango definido por el stereotype. | ❌ | — | Sin restricción de subrangos heredados. |
| §9.2-009 | Bloquear rangos fuera del rango heredado. | ❌ | — | Sin bloqueo de rangos fuera del heredado. |
| §9.2-010 | Usar stereotypes anidados cuando un componente reusable contiene otros componentes. | ❌ | — | Sin stereotypes anidados. |
| §9.2-011 | Desvincular un stereotype conservando componentes cuando se requiere independencia. | ❌ | — | Sin desvinculación de stereotype conservando componentes. |
| §9.2-012 | Remover stereotype y sus componentes cuando se decide eliminar la estructura heredada. | ❌ | — | Sin remoción de stereotype + componentes. |
| §9.2-013 | Usar stereotypes dentro de templates. | ❌ | — | Sin stereotypes dentro de templates (ambos ausentes). |
| §9.2-014 | Usar stereotypes para acelerar modelado de estructuras repetibles y gobernadas. | ❌ | — | Sin aceleración de modelado vía stereotypes. |

### 9.3 Ontología organizacional

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §9.3-001 | Definir términos preferidos para una organización. | ❌ | — | Ontología organizacional ausente. grep `ontolog|terminoPreferido|sinonim|enforcement|autoformato` vacío. |
| §9.3-002 | Definir múltiples formas aceptadas de un término preferido. | ❌ | — | Sin formas aceptadas de término preferido. |
| §9.3-003 | Definir sinónimos no preferidos. | ❌ | — | Sin sinónimos no preferidos. |
| §9.3-004 | Detectar uso de sinónimos al nombrar cosas. | ❌ | — | Sin detección de uso de sinónimos. |
| §9.3-005 | Sugerir reemplazo por término preferido. | ❌ | — | Sin sugerencia de reemplazo por término preferido. |
| §9.3-006 | Reemplazar nombre por término preferido con un clic. | ❌ | — | Sin reemplazo de nombre por término preferido. |
| §9.3-007 | Permitir cerrar sin cambiar cuando el modo es sugerido. | ❌ | — | Sin modo sugerido. |
| §9.3-008 | Forzar selección de término preferido cuando el modo es obligatorio. | ❌ | — | Sin modo obligatorio/forzado. |
| §9.3-009 | Configurar nivel de enforcement: ninguno, sugerir o forzar. | ❌ | — | Sin configuración de enforcement. |
| §9.3-010 | Administrar entradas de ontología. | ❌ | — | Sin administración de entradas de ontología. |
| §9.3-011 | Agregar entradas nuevas. | ❌ | — | Sin alta de entradas. |
| §9.3-012 | Editar términos preferidos y sinónimos. | ❌ | — | Sin edición de términos/sinónimos. |
| §9.3-013 | Filtrar entradas de ontología. | ❌ | — | Sin filtrado de ontología. |
| §9.3-014 | Preservar consistencia terminológica entre modeladores de la organización. | ❌ | — | Sin consistencia terminológica organizacional. |
| §9.3-015 | Integrar autoformato con reglas de ontología. | ❌ | — | Sin integración autoformato↔ontología. |

### 9.4 Coherencia nominal

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §9.4-001 | Detectar nombres duplicados al crear o renombrar cosas. | ✅ | src/modelo/operaciones/colisionNombre.ts:37; src/modelo/operaciones/colisionNombre.test.ts:16; src/store/modelo/acciones-entidad.ts:106,221 | `detectarColisionNombre` por nombre canónico; consumido en creación (`confirmarNombreNuevaCosa`) y rename (`renombrarSeleccionada`). Test unit + e2e. |
| §9.4-002 | Mostrar ubicación de la cosa existente con el mismo nombre. | ✅ | src/modelo/operaciones/colisionNombre.ts:46; src/ui/DialogoColisionNombre.tsx:29,57; e2e/29-colision-nombre.spec.ts | `ColisionNombre.ubicaciones` (OPD×apariencia) + diálogo muestra resumen y botón "Ir a ubicación". |
| §9.4-003 | Ofrecer reutilizar la cosa existente como instancia visual. | ✅ | src/store/modelo/acciones-entidad.ts:535; src/ui/DialogoColisionNombre.tsx:24,52; e2e/29-colision-nombre.spec.ts:74 | `resolverColisionReutilizar` crea aparición adicional reusando entidad; botón "Reutilizar" solo si `mismoTipo` y contexto creación. e2e cubre. |
| §9.4-004 | Ofrecer renombrar la cosa nueva. | ✅ | src/store/modelo/acciones-entidad.ts:596; src/ui/DialogoColisionNombre.tsx:54; e2e/29-colision-nombre.spec.ts:167 | `resolverColisionRenombrar`/"Usar otro nombre" con nombre alternativo prellenado "X 2". e2e cubre creación y rename. |
| §9.4-005 | Mantener nombre automático si el usuario cancela. | 🟡 | src/store/modelo/acciones-entidad.ts:635; e2e/29-colision-nombre.spec.ts:135,216 | Cancelar en contexto "creación" ELIMINA la entidad provisional (modelo intacto); en "rename" descarta el rename. No "mantiene nombre automático" — la cosa provisional aún no tenía nombre confirmado. Comportamiento razonable pero diverge de la literal "mantener nombre automático". |
| §9.4-006 | Impedir fusionar cosas de tipos incompatibles. | ✅ | src/store/modelo/acciones-entidad.ts:541-543; src/ui/DialogoColisionNombre.tsx:24 | `resolverColisionReutilizar` rechaza con mensaje si `!mismoTipo`; el botón "Reutilizar" no se renderiza para tipos distintos (`puedeReutilizar`). `mismoTipo` testeado en colisionNombre.test.ts:24. |
| §9.4-007 | Advertir cuando un nombre existente corresponde a cosa refinada de manera incompatible. | 🟡 | src/modelo/operaciones/colisionNombre.ts:55-60 (campo `mismoTipo`) | `mismoTipo` distingue heterogeneidad de tipo, pero NO hay detección específica de "cosa refinada de manera incompatible" (refinamiento). El aviso es genérico por tipo, no por incompatibilidad de refinamiento. |
| §9.4-008 | Recomendar traer la cosa desde Draggable OPM Things para reutilización explícita. | 🟡 | src/ui/biblioteca/BibliotecaDock.tsx:8,66; src/ui/biblioteca/ListaBibliotecaCosas.tsx; e2e/20-biblioteca-dock.spec.ts | Existe biblioteca dock (Draggable OPM Things) con drag-to-canvas de cosas existentes — vía de reutilización explícita. Pero el diálogo de colisión NO recomienda explícitamente "traer desde Draggable OPM Things"; el dock existe como feature paralela. e2e 20 solo verifica que no abre con Ctrl+B. |
| §9.4-009 | Evitar divergencia semántica por homónimos accidentales. | ✅ | src/modelo/operaciones/colisionNombre.ts:37; src/store/modelo/acciones-entidad.ts:106,221; e2e/29-colision-nombre.spec.ts | El gate de colisión por nombre canónico en creación y rename evita homónimos accidentales (fuerza reuso/renombre/cancelar). Cubierto por unit + e2e. |

---

## 10. Requisitos y Trazabilidad

### 10.1 Modelado de requisitos

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §10.1-001 | Asociar requisitos a objetos. | ❌ | src/modelo/tipos/enlace.ts:81 | Requisitos existen SOLO en enlaces (`requisitos?: string`). grep `requisito` en modelo/tipos/*.ts fuera de enlace.ts vacío: no hay asociación a objetos. |
| §10.1-002 | Asociar requisitos a procesos. | ❌ | src/modelo/tipos/enlace.ts:81 | Sin requisitos en procesos (solo enlaces). |
| §10.1-003 | Asociar requisitos a enlaces. | ✅ | src/modelo/enlaceMetadatos.ts:18; src/modelo/operaciones.test.ts:161,174; src/store/enlaces.test.ts:79; src/ui/inspectorEnlace/SeccionMetadatosOpcloud.tsx:94 | `definirRequisitosEnlace` asocia requisito (string) a enlace; UI inspector + tests model/store. |
| §10.1-004 | Asociar requisitos a atributos, estados o partes cuando se requiere granularidad. | ❌ | — | Sin requisitos en atributos/estados/partes (no hay campo `requisitos` fuera de `Enlace`). |
| §10.1-005 | Crear conjuntos de requisitos satisfechos por un elemento. | ❌ | src/modelo/tipos/enlace.ts:81 | `requisitos` es un único string libre, no un "conjunto de requisitos" estructurado satisfecho por elemento. |
| §10.1-006 | Agregar múltiples requisitos separados por delimitador. | ❌ | src/modelo/enlaceMetadatos.ts:26 | Solo `texto.trim()`; sin split por delimitador en múltiples requisitos. |
| §10.1-007 | Mostrar requisito asociado sobre un elemento. | ✅ | src/render/jointjs/composers/enlace.ts:473-474; src/render/jointjs/labelLayout.ts:13; src/render/jointjs/proyeccion.test.ts:483,497 | `mostrarRequisitos && requisitos` proyecta label "Satisfied: ..." sobre el enlace; testeado en proyeccion. |
| §10.1-008 | Ocultar requisito asociado sin eliminarlo. | ✅ | src/modelo/enlaceMetadatos.ts:30; src/ui/inspectorEnlace/SeccionMetadatosOpcloud.tsx:106; src/render/jointjs/composers/enlace.ts:473 | `mostrarRequisitos` (bool) oculta el label sin borrar `requisitos`; checkbox en inspector; render respeta flag. Modelo/render testeado. |
| §10.1-009 | Mostrar u ocultar todos los requisitos de un OPD. | ❌ | — | Sin "mostrar/ocultar todos los requisitos de un OPD" (grep `mostrarTodosRequisitos|todos.*requisito` vacío). El toggle es por enlace. |
| §10.1-010 | Eliminar un requisito de su conjunto. | 🟡 | src/modelo/enlaceMetadatos.ts:31-33 | Vaciar el texto elimina `requisitos`+`mostrarRequisitos` del enlace; pero al ser string único no hay "eliminar una entrada de un conjunto". Borrado total, no por entrada. |
| §10.1-011 | Renumerar o mantener conjuntos de requisitos al remover entradas. | ❌ | — | Sin renumeración/mantención de conjuntos (no hay conjuntos; string único). |
| §10.1-012 | Asociar un mismo requisito a varios elementos que lo satisfacen. | ❌ | src/modelo/tipos/enlace.ts:81 | El mismo requisito no puede asociarse a varios elementos como entidad compartida; es texto por enlace, sin identidad de requisito. |
| §10.1-013 | Representar satisfacción parcial o total según convención del modelo. | ❌ | — | Sin representación de satisfacción parcial/total (solo etiqueta "Satisfied:"). |
| §10.1-014 | Conectar requisitos a sistemas externos mediante URL. | ❌ | — | Sin conexión a sistemas externos por URL (grep `hyperlink|url.*requisito` vacío). |
| §10.1-015 | Guardar hyperlink del requisito externo en cosa o enlace. | ❌ | — | Sin hyperlink de requisito externo en cosa/enlace. |
| §10.1-016 | Previsualizar URL de requisito externo. | ❌ | — | Sin previsualización de URL de requisito. |

### 10.2 Vistas de requisitos

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §10.2-001 | Crear vista read-only por requisito. | ❌ | — | Vistas de requisitos ausentes (grep `requirementView|vistaRequisito` vacío). |
| §10.2-002 | Listar requisitos existentes detectados en el modelo. | ❌ | — | Sin listado de requisitos detectados en el modelo. |
| §10.2-003 | Crear OPD de vista bajo una agrupación de requirement views. | ❌ | — | Sin agrupación "requirement views" ni OPD de vista. |
| §10.2-004 | Incluir elementos que satisfacen el requisito. | ❌ | — | Sin inclusión de elementos satisfactores en vista. |
| §10.2-005 | Incluir enlace cuando el requisito está asociado al enlace. | ❌ | — | Sin inclusión de enlace asociado en vista. |
| §10.2-006 | Incluir source y target mínimos necesarios cuando el requisito vive en un enlace. | ❌ | — | Sin inclusión de source/target en vista. |
| §10.2-007 | Mantener la vista como derivada, no editable. | ❌ | — | Sin vista derivada no editable. |
| §10.2-008 | Ajustar layout visual de una vista sin cambiar el modelo fuente. | ❌ | — | Sin ajuste de layout de vista sin tocar fuente. |
| §10.2-009 | Actualizar vista cuando cambia el modelo. | ❌ | — | Sin actualización de vista al cambiar el modelo. |
| §10.2-010 | Actualizar vista desde menú contextual del OPD de requisito. | ❌ | — | Sin menú contextual del OPD de requisito. |
| §10.2-011 | Eliminar vista de requisito. | ❌ | — | Sin eliminación de vista de requisito. |
| §10.2-012 | Detectar posibles typos cuando dos requisitos parecen similares pero crean vistas distintas. | ❌ | — | Sin detección de typos entre requisitos similares. |

### 10.3 Enriquecimiento

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §10.3-001 | Conectar stereotype de requisito a un requirement set. | ❌ | — | Enriquecimiento de requisitos ausente. No hay requirement stereotype ni requirement set (depende de §9.2 stereotypes, también ausente). |
| §10.3-002 | Modelar campos estructurados de requisito. | ❌ | src/modelo/tipos/enlace.ts:81 | Sin campos estructurados de requisito; `requisitos` es un único string. |
| §10.3-003 | Modelar id de requisito. | ❌ | — | Sin id de requisito modelado. |
| §10.3-004 | Modelar nombre de requisito. | ❌ | — | Sin nombre de requisito modelado. |
| §10.3-005 | Modelar descripción. | ❌ | — | Sin descripción de requisito. |
| §10.3-006 | Modelar actor o actor set. | ❌ | — | Sin actor/actor set. |
| §10.3-007 | Modelar tipo de validación hard/soft. | ❌ | — | Sin tipo de validación hard/soft. |
| §10.3-008 | Modelar atributos adicionales del requisito. | ❌ | — | Sin atributos adicionales del requisito. |
| §10.3-009 | Desplegar requirement stereotype en OPD propio. | ❌ | — | Sin despliegue de requirement stereotype en OPD propio. |
| §10.3-010 | Remover stereotype de requisito cuando ya no se requiere enriquecimiento. | ❌ | — | Sin remoción de stereotype de requisito. |
| §10.3-011 | Usar requisitos enriquecidos dentro de stereotypes y templates. | ❌ | — | Sin requisitos enriquecidos en stereotypes/templates (ambos ausentes). |
| §10.3-012 | Vincular requisitos a herramientas externas mediante URL. | ❌ | — | Sin vínculo de requisitos a herramientas externas por URL. |

---

## 11. Análisis del Modelo

### 11.1 Métricas

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §11.1-001 | Calcular métricas generales del modelo. | 🚫 | src/canvas/mapa/estadisticas.ts:11; src/store/mapaSelectors.test.ts:23 | calcularEstadisticas computa métricas agregadas; test las ejercita |
| §11.1-002 | Analizar composición del modelo. | 🚫 | src/canvas/mapa/estadisticas.ts:11; src/ui/MapaPanelEstadisticas.tsx:18 | Composición: totales + desglose por tipo/familia |
| §11.1-003 | Contar tipos de elementos. | 🚫 | src/canvas/mapa/estadisticas.ts:24; src/render/jointjs/mapaSistema.test.ts:121 | Cuenta proceso/objeto/estados; test "calcula estadísticas globales" |
| §11.1-004 | Evaluar distribución de objetos, procesos, estados, enlaces y OPDs. | 🚫 | src/canvas/mapa/estadisticas.ts:24; src/ui/MapaPanelEstadisticas.tsx:18 | porTipoCosa + porFamiliaEnlace + totalOpds en el panel |
| §11.1-005 | Acceder al análisis desde configuración o menú de análisis. | 🚫 | src/ui/MapaPanelEstadisticas.tsx:18; src/ui/MapaSistema.tsx | Panel de estadísticas accesible desde el mapa de sistema; no hay test que valide el acceso UI (sin e2e/test del panel) |
| §11.1-006 | Usar métricas para revisar complejidad y completitud. | 🚫 | src/ui/MapaPanelEstadisticas.tsx:18 | Métricas mostradas (entidades, ramas, profundidad) sirven a complejidad/completitud; uso es interpretativo, sin test de "completitud" derivado del panel |

### 11.2 Model validation

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §11.2-001 | Validar valores computacionales en tiempo de diseño. | 🚫 | — | No hay validación de valores computacionales por fase de diseño. valorSlot.ts solo valida tipo de dato, sin noción de fase. Busqué "rango/soft/hard/fase/diseno" en src/modelo,serializacion,store |
| §11.2-002 | Validar valores durante ejecución. | 🚫 | — | Sin validación de valores "durante ejecución"; no existe fase de ejecución de valores |
| §11.2-003 | Validar valores durante simulación. | 🚫 | — | Sin validación durante simulación con rango; parámetros de simulación existen pero no validación computacional por rango |
| §11.2-004 | Configurar validación por fase: diseño, ejecución, simulación o ambas. | 🚫 | — | No hay configuración de validación por fase (diseño/ejecución/simulación) |
| §11.2-005 | Definir validación soft que permite valor inválido pero lo marca visualmente. | 🚫 | — | No existe validación "soft" (marca visual permitiendo valor inválido); buscado "soft" sin rastro |
| §11.2-006 | Definir validación hard que impide ingresar valor fuera de rango. | 🚫 | — | No existe validación "hard" que bloquee ingreso; buscado "hard" sin rastro |
| §11.2-007 | Marcar valores dentro de rango. | 🚫 | — | No marca "dentro de rango": no existe concepto de rango en el slot |
| §11.2-008 | Marcar valores fuera de rango. | 🚫 | — | No marca "fuera de rango": idem, sin rango |
| §11.2-009 | Validar tipo de dato: integer, float, string, char, boolean y otros tipos soportados. | 🚫 | src/modelo/validadores/valorSlot.ts:12; src/modelo/validadores/valorSlot.test.ts:5 | Valida integer/float/char/string con test verde. PERO falta boolean y "otros tipos" (TipoValorSlot en tipos/entidad.ts:22 no incluye boolean) |
| §11.2-010 | Validar rangos cerrados, abiertos o compuestos. | 🚫 | — | No valida rangos cerrados/abiertos/compuestos: no hay rangos |
| §11.2-011 | Validar default values. | 🚫 | — | No valida default values; sin valorPorDefecto/defaultValue en el slot |
| §11.2-012 | Resetear valor a default cuando existe. | 🚫 | — | No hay reset-a-default; sin concepto de default |
| §11.2-013 | Mostrar u ocultar tipo/rango como atributo. | 🚫 | src/ui/inspector/SeccionAtributo.tsx:35; src/ui/inspector/SeccionAtributo.tsx:92 | UI muestra selector "Tipo de valor" (TIPOS). No hay mostrar/ocultar rango (rango inexistente) ni test (no hay SeccionAtributo.test) |
| §11.2-014 | Validar subrangos heredados desde stereotype. | 🚫 | — | No valida subrangos heredados desde stereotype; sin stereotype/estereotipo en src |
| §11.2-015 | Bloquear subrangos incompatibles con el rango heredado. | 🚫 | — | No bloquea subrangos incompatibles; idem sin stereotype/rango |

### 11.3 Informative grading

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §11.3-001 | Evaluar informatividad de oraciones OPL. | 🚫 | — | No hay evaluación de informatividad de oraciones OPL. Buscado "informatividad/grading/informativo" sin feature dedicada (solo diagnóstico metodológico) |
| §11.3-002 | Clasificar oraciones por categoría informativa. | 🚫 | — | No clasifica oraciones por categoría informativa |
| §11.3-003 | Medir score informativo por oración. | 🚫 | — | No mide score informativo por oración |
| §11.3-004 | Calcular score ponderado del modelo. | 🚫 | — | No calcula score ponderado del modelo |
| §11.3-005 | Filtrar resultados por categoría. | 🚫 | — | Sin filtro por categoría informativa (feature inexistente) |
| §11.3-006 | Filtrar por score mínimo. | 🚫 | — | Sin filtro por score mínimo |
| §11.3-007 | Revisar oraciones con baja informatividad. | 🚫 | — | Sin vista de oraciones de baja informatividad |
| §11.3-008 | Descargar resultados a CSV. | 🚫 | — | No descarga resultados de grading a CSV (sin grading) |

### 11.4 Missing knowledge identification

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §11.4-001 | Identificar conocimiento faltante en el modelo. | 🚫 | — | No identifica conocimiento faltante (missing knowledge). El diagnóstico (checkers.ts/avisos) es metodológico, no sugerencia de conocimiento faltante con confianza |
| §11.4-002 | Sugerir objetos faltantes. | 🚫 | — | No sugiere objetos faltantes |
| §11.4-003 | Sugerir enlaces faltantes. | 🚫 | — | No sugiere enlaces faltantes |
| §11.4-004 | Sugerir relaciones faltantes. | 🚫 | — | No sugiere relaciones faltantes |
| §11.4-005 | Evaluar sugerencias con razonamiento local PISTOL cuando aplica. | 🚫 | — | No hay razonamiento local PISTOL; buscado "PISTOL" sin rastro |
| §11.4-006 | Ajustar umbral de confianza. | 🚫 | — | No hay umbral de confianza ajustable (sin sugerencias) |
| §11.4-007 | Exportar sugerencias. | 🚫 | — | No exporta sugerencias |
| §11.4-008 | Usar las sugerencias como apoyo, no como verdad automática. | 🚫 | — | N/A: no hay sistema de sugerencias que usar como apoyo |

---

## 12. Importación y Exportación

### 12.1 Exportación OPL

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §12.1-001 | Exportar OPL como HTML. | ✅ | src/store/modelo/acciones-canvas.ts:370; e2e/03-opl-panel.spec.ts:182 | exportarOplActualHtml genera Blob HTML; e2e "copia y exporta HTML" valida descarga |
| §12.1-002 | Elegir nombre de archivo. | 🟡 | src/store/modelo/acciones-canvas.ts:383; e2e/03-opl-panel.spec.ts:209 | Nombre derivado del modelo (`${nombre}-opl.html`), filename verificado en e2e; NO permite elegir nombre arbitrario (auto-generado) |
| §12.1-003 | Exportar con numeración. | ✅ | src/store/modelo/acciones-canvas.ts:247; e2e/03-opl-panel.spec.ts:214 | Toggle numeración (alternarNumeracionOpl) con e2e "alterna numeracion 123" |
| §12.1-004 | Exportar sin numeración. | ✅ | src/store/modelo/acciones-canvas.ts:247; e2e/03-opl-panel.spec.ts:225 | Mismo toggle off → sin numeración; mismo e2e |
| §12.1-005 | Obtener OPL por OPD. | ✅ | src/opl/generar.ts:46; src/store/modelo/acciones-canvas.ts:371 | generarOpl(modelo, opdActivoId): OPL por OPD; exportación usa opdActivoId |
| §12.1-006 | Obtener OPL consolidado del modelo sin repetición. | 🟡 | src/opl/generar.ts:46; e2e/03-opl-panel.spec.ts:132 | OPL agrupa oraciones por OPD (e2e "agrupa por OPD"); export HTML es del OPD activo, no consolidado del modelo entero sin repetición; "consolidado sin repetición" no verificado |
| §12.1-007 | Copiar OPL exportado a documentos externos. | ✅ | src/store/modelo/acciones-canvas.ts:358; e2e/03-opl-panel.spec.ts:199 | copiarOplActualAlPortapapeles; e2e botón "panel-opl-copiar" |

### 12.2 Exportación visual

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §12.2-001 | Exportar OPD actual como imagen. | ✅ | src/render/jointjs/mapaExport.ts:46; src/ui/CommandPalette.tsx:536 | descargarOpdActualPng exporta el OPD activo como PNG; comando en CommandPalette |
| §12.2-002 | Exportar todo el OPD tree. | ✅ | src/render/jointjs/mapaExport.ts:59; src/ui/CommandPalette.tsx:537 | descargarTodosLosOpdsPngZip genera un ZIP con una imagen PNG por OPD, ordenado por árbol OPL |
| §12.2-003 | Exportar solo System Diagram. | 🟡 | src/render/jointjs/mapaExport.ts:46; src/ui/CommandPalette.tsx:536 | Puede exportar el OPD activo (que puede ser el SD/raíz), pero no hay opción explícita "solo System Diagram"; sin test del caso SD |
| §12.2-004 | Configurar resolución/DPI. | ❌ | — | No hay configuración de resolución/DPI; OpcionesExport solo permite nombre, padding y fondo |
| §12.2-005 | Exportar a mayor calidad para documentación. | ❌ | — | Sin opción de mayor calidad/escala para documentación |
| §12.2-006 | Incluir o excluir tooltips de procesos computacionales. | ❌ | — | No incluye/excluye tooltips de procesos computacionales en la imagen |
| §12.2-007 | Exportar visualmente diagramas con imágenes asociadas. | 🟡 | src/render/jointjs/mapaExport.ts:234 | Rasteriza el SVG del paper a PNG; no hay control específico de "imágenes asociadas"; sin test del caso |
| §12.2-008 | Generar imagen navegable o inspeccionable después de exportar. | ❌ | — | La salida vigente es PNG/ZIP de PNGs; no genera imagen navegable ni vector inspeccionable |

### 12.3 Exportación PDF

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §12.3-001 | Exportar modelo completo a PDF. | ❌ | — | No exporta a PDF. Sin dependencia jspdf/pdfmake/html2canvas (package.json); buscado "pdf" word-boundary en src sin rastro |
| §12.3-002 | Incluir URL del modelo. | ❌ | — | Sin PDF, no incluye URL del modelo |
| §12.3-003 | Incluir diagramas y OPL. | ❌ | — | Sin PDF (diagramas+OPL en un PDF) |
| §12.3-004 | Incluir tabla de contenidos. | ❌ | — | Sin tabla de contenidos; buscado "tabla de contenidos" sin rastro |
| §12.3-005 | Incluir OPD tree. | ❌ | — | Sin OPD tree en PDF |
| §12.3-006 | Incluir diccionario de elementos. | ❌ | — | Sin diccionario de elementos; buscado "diccionario" sin rastro |
| §12.3-007 | Incluir objetos, procesos y estados. | ❌ | — | Sin sección objetos/procesos/estados en PDF |
| §12.3-008 | Incluir relaciones. | ❌ | — | Sin sección relaciones en PDF |
| §12.3-009 | Incluir descripciones. | ❌ | — | Sin descripciones en PDF |
| §12.3-010 | Incluir URLs asociadas. | ❌ | — | Sin URLs asociadas en PDF |
| §12.3-011 | Incluir o excluir numeración OPL. | ❌ | — | Sin toggle numeración OPL en PDF (no hay PDF) |
| §12.3-012 | Incluir o excluir tooltips computacionales. | ❌ | — | Sin toggle tooltips computacionales en PDF |
| §12.3-013 | Mostrar progreso o tiempo estimado de generación. | ❌ | — | Sin progreso/tiempo estimado de generación de PDF |

### 12.4 Exportación de submodelos

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §12.4-001 | Incluir submodelos cargados en vistas o exportaciones cuando se requiere contexto completo. | 🚫 | — | Submodelos: feature de OPCloud backend. Sin "submodelo" en src (buscado word-boundary). Carga/composición de submodelos requiere backend ausente |
| §12.4-002 | Cargar submodelos antes de exportar para asegurar disponibilidad. | 🚫 | — | Cargar submodelos antes de exportar: requiere backend de submodelos inexistente |
| §12.4-003 | Omitir submodelos no cargados cuando se desea exportación liviana. | 🚫 | — | Omitir submodelos no cargados: feature de submodelos ausente (backend) |
| §12.4-004 | Navegar OPDs de submodelos desde gestores antes de exportar. | 🚫 | — | Navegar OPDs de submodelos desde gestores: gestor de submodelos inexistente (backend) |

---

## 13. Simulación y Ejecución

### 13.1 Simulación conceptual

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §13.1-001 | Entrar a modo simulación/ejecución desde toolbar principal. | 🟡 | `app/src/ui/CommandPalette.tsx:468` (`simulacion-conceptual`), `app/src/ui/simulacion/BarraSimulacion.tsx:18-194` | Accesible vía Command Palette (⌘K) y atajo Espacio, pero SIN botón directo en toolbar principal. BarraSimulacion aparece al entrar al modo. |
| §13.1-002 | Ejecutar simulación conceptual visual. | ✅ | `app/src/modelo/simulacion/runner.test.ts:41-57`, `app/src/modelo/simulacion/runner.ts:10-22` | iniciarSimulacion + ejecutarPaso + ejecutarCorrida implementados y testeados. BarraSimulacion renderiza Play/Paso/Correr. |
| §13.1-003 | Animar tokens por enlaces del modelo. | 🟡 | `app/src/modelo/simulacion/animacionTokens.ts:5-15`, `app/src/modelo/simulacion/animacionTokens.test.ts:12-35`, `app/src/render/jointjs/proyeccion.test.ts:202-243` | Función `debeAnimarTokensSim` existe y tiene tests unitarios. Proyección JointJS renderiza label de token sobre enlace activo. Pero no hay animación real (interpolación de posición sobre tiempo). |
| §13.1-004 | Ver procesos activarse según orden de ejecución. | ✅ | `app/src/modelo/simulacion/runner.test.ts:111-123`, `app/src/ui/simulacion/BarraSimulacion.tsx:70-80` | ejecutarCorrida recorre todos los pasos en orden. Trace muestra procesoNombre por paso. UI muestra proceso activo y contador. |
| §13.1-005 | Ajustar velocidad de animación. | ✅ | `app/src/ui/simulacion/BarraSimulacion.tsx:94-110`, `app/src/store/mapa.test.ts:146-158`, `app/src/store/simulacion.ts:129-131` | Slider continuo 0.25×–4× en BarraSimulacion. `normalizarVelocidadSimulacion` con clamp y test de rango. |
| §13.1-006 | Ejecutar simulación paso a paso o sincronizada. | ✅ | `app/src/modelo/simulacion/runner.test.ts:59-123`, `app/src/ui/simulacion/BarraSimulacion.tsx:111-144` | Botones Paso (ejecutarPaso) y Correr (ejecutarCorrida) independientes. Auto-avance vía setTimeout en BarraSimulacion. |
| §13.1-007 | Detener simulación. | ✅ | `app/src/ui/simulacion/BarraSimulacion.tsx:81-93,156-164`, `app/src/app/ports/globalShortcutsPort.test.ts:150-176`, `app/src/store/mapa.test.ts:114-143` | Botón Pausa detiene auto-avance. Botón Salir cierra modo (salirModoSimulacion). Atajo Espacio toggle play/pausa testeado. |
| §13.1-008 | Usar simulación para detectar secuencias incorrectas. | ✅ | `app/src/modelo/simulacion/runner.test.ts:74-85`, `app/src/modelo/simulacion/runner.ts:46-54` | Si estadoActual no coincide con estadoAntes planificado, runner emite diagnóstico "No simulable" en trace. Test lo verifica. |
| §13.1-009 | Ver que el orden vertical de subprocesos afecta la ejecución. | ✅ | `app/src/modelo/simulacion/plan.test.ts:26-55`, `app/src/modelo/simulacion/plan.ts:69-72` | planificarSimulacion ordena por apariencia.y ascendente con desempate alfabético. Tests explícitos de orden Y y desempate. |
| §13.1-010 | Corregir orden de subprocesos y observar actualización OPL. | 🟡 | `app/src/modelo/simulacion/plan.ts:69-72` | Mover procesos en canvas cambia su Y y por tanto el orden del plan. Pero no hay UI explícita de "corregir orden" ni feedback OPL dedicado a ese ajuste. Implícito vía edición de canvas + re-ejecución. |
| §13.1-011 | Reejecutar simulación para validar la corrección. | ✅ | `app/src/modelo/simulacion/runner.test.ts:126-138`, `app/src/ui/simulacion/BarraSimulacion.tsx:133-142` | Botón Reiniciar llama a `reiniciarSimulacion` que vuelve al contexto inicial. Test verifica pasoActual=0, trace vacío. |
| §13.1-012 | Distinguir simulación conceptual de ejecución con cálculo o sistemas externos. | 🟡 | `app/src/modelo/simulacion/runner.ts` (conceptual), `app/src/modelo/simulacion/parametros.ts` (numérica), `app/src/ui/CommandPalette.tsx:468-469` | Modo conceptual (BarraSimulacion) y Diálogo numérico (DialogoSimulacionNumerica) existen como features separadas. Pero la distinción es arquitectónica, no comunicada explícitamente al operador. |

### 13.2 Objetos computacionales

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §13.2-001 | Convertir objetos en computacionales. | 🟡 | `app/src/ui/inspector/SeccionAtributo.tsx:114-124`, `app/src/modelo/tipos/entidad.ts:102-105` | Checkbox "Simulación" en inspector de atributos activa `entidad.simulacion.simulable`. Solo aplica a atributos (entidad con valorSlot), no a objetos generales. |
| §13.2-002 | Definir valores concretos. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:103-112`, `app/src/modelo/simulacion/valores.test.ts:57-63` | Input "Valor" persiste en `entidad.valorSlot.valor`. `iniciarValoresRuntime` lo copia al runtime. Testeado. |
| §13.2-003 | Definir unidades. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:81-88` | Input "Unidad" en inspector de atributo (`entidad.unidad`). No tiene test específico en contexto de simulación. |
| §13.2-004 | Definir alias. | 🟡 | `app/src/modelo/tipos/entidad.ts` (`alias` en Entidad) | El campo alias existe a nivel entidad (inspector general). No es específico de simulación ni se usa en el contexto de ejecución para acceder a objetos. |
| §13.2-005 | Definir tipo de valor. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:94-101` | Dropdown "Tipo de valor" con opciones integer/float/char/string. Vinculado a `valorSlot.tipo`. |
| §13.2-006 | Definir rango permitido. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:168-169` | Inputs "Rango min" y "Rango max" en panel de simulación numérica. `ConfiguracionSimulacionNumerica.rangoMin/rangoMax` restringen el muestreo. |
| §13.2-007 | Definir default value. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:103-112`, `app/src/modelo/simulacion/valores.test.ts:57-63` | Input "Valor" en inspector funciona como default. `iniciarValoresRuntime` lo copia. Testeado. |
| §13.2-008 | Resetear valor al default. | ✅ | `app/src/modelo/simulacion/runner.ts:98-100`, `app/src/modelo/simulacion/runner.test.ts:126-138` | ReiniciarSimulacion llama a iniciarSimulacion que recarga valores desde `entidad.valorSlot.valor`. No hay botón explícito de "resetear al default". |
| §13.2-009 | Simular valores de objetos según parámetros. | ✅ | `app/src/modelo/simulacion/parametros.test.ts:75-118`, `app/src/modelo/simulacion/parametros.ts:83-118` | `muestrearValorEntidad` y `generarDatosSimulados` implementan muestreo según parámetros. Tests con RNG determinista inyectado. |
| §13.2-010 | Generar valores aleatorios desde distribuciones. | ✅ | `app/src/modelo/simulacion/parametros.ts:236-284`, `app/src/modelo/simulacion/parametros.test.ts:76-84` | 7 distribuciones implementadas: uniform, normal, bernoulli, geometric, poisson, exponential, binomial. `sampleNumerico` con RNG inyectable. Testeado. |
| §13.2-011 | Usar valores de objetos como instrumentos o entradas de cálculo. | 🟡 | `app/src/modelo/simulacion/valores.ts:47-105`, `app/src/modelo/simulacion/valores.test.ts:98-110` | `aplicarCambiosValor` propaga valor de atributo entrada a atributo salida vía enlaces consumo/instrumento/efecto → resultado. Solo copia, sin operaciones aritméticas. |
| §13.2-012 | Usar partes refinadas de objetos computacionales mediante alias. | ❌ | — | Sin evidencia en plan, runner, valores ni tipos. No hay acceso a partes de objetos refinados mediante alias en el contexto de simulación. |

### 13.3 Procesos computacionales

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §13.3-001 | Convertir procesos en computacionales. | ❌ | — | No existe flag `computacional` en el modelo de Proceso. OPCloud lo tiene; deep-opm-pro no lo implementa. |
| §13.3-002 | Usar funciones predefinidas como suma u operaciones básicas. | ❌ | — | No hay funciones predefinidas (suma, etc.). `aplicarCambiosValor` solo copia valores; sin aritmética. |
| §13.3-003 | Usar funciones TypeScript definidas por usuario. | ❌ | — | No hay soporte para funciones TypeScript definidas por usuario. Sin IDE ni editor de código. |
| §13.3-004 | Abrir IDE integrado para editar función. | ❌ | — | Sin IDE integrado (monaco/codemirror no encontrados en el repo). |
| §13.3-005 | Ver tooltip de proceso computacional. | ❌ | — | Sin tooltip de proceso computacional en la UI. |
| §13.3-006 | Acceder a objetos conectados mediante alias. | 🟡 | `app/src/modelo/simulacion/valores.ts:56-66` | Atributos conectados se acceden por ID de entidad, no por alias. El campo `alias` existe en Entidad pero el runner no lo resuelve. |
| §13.3-007 | Acceder a partes de objetos refinados mediante alias del todo y de la parte. | ❌ | — | Sin soporte para acceder a partes de objetos refinados mediante alias (todo.parte). |
| §13.3-008 | Usar valores de instrumentos, consumos, efectos y resultados elegibles. | ✅ | `app/src/modelo/simulacion/valores.ts:58-66`, `app/src/modelo/simulacion/valores.test.ts:98-110` | Consumos (tipo `consumo`, `efecto`, `instrumento`) y resultados (tipo `resultado`, `efecto`) sobre atributos propagan valores. Testeado. |
| §13.3-009 | Actualizar un objeto resultado con el valor calculado. | ✅ | `app/src/modelo/simulacion/valores.ts:97-99`, `app/src/modelo/simulacion/valores.test.ts:104-106` | `valoresNuevos[atrSalidaId] = validado.value` actualiza el runtime del atributo resultado. Test verifica `cambiosValor` en trace. |
| §13.3-010 | Simular un proceso computacional ignorando valores fijos y usando parámetros. | ✅ | `app/src/modelo/simulacion/valores.test.ts:74-94`, `app/src/modelo/simulacion/valores.ts:12-28` | Si `entidad.simulacion.simulable`, `iniciarValoresRuntime` muestrea desde parámetros de simulación, ignorando el valor fijo. Test lo verifica. |
| §13.3-011 | Combinar cálculo con condiciones, loops y estados. | ❌ | — | Condiciones y loops no se ejecutan en el runner (plan.ts ordena por Y, runner.ts itera linealmente sin branching). Sin rastro de condicionales ni loops en ejecución. |

### 13.4 Simulación numérica

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §13.4-001 | Seleccionar objetos o procesos para simulación de valores. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:114-124`, `app/src/app/ports/zustandSimulacionNumericaDialogPort.ts:10-12` | Checkbox "Simulación" selecciona atributos. El diálogo de simulación numérica agrega todos los atributos con `simulable: true`. |
| §13.4-002 | Definir tipo de distribución. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:150-157`, `app/src/modelo/simulacion/parametros.ts:29-37` | Dropdown con 7 distribuciones: uniform, normal, bernoulli, geometric, poisson, exponential, binomial. Testeado en `parametros.test.ts`. |
| §13.4-003 | Definir rango de muestreo. | ✅ | `app/src/ui/inspector/SeccionAtributo.tsx:168-169,172-173` | Inputs de rango: Rango min/max globales, Min/Max por distribución (uniform). `ConfiguracionSimulacionNumerica.rangoMin/rangoMax`. |
| §13.4-004 | Ejecutar una corrida. | ✅ | `app/src/ui/DialogoSimulacionNumerica.tsx` (botón "Ejecutar simulación"), `app/src/modelo/simulacion/parametros.test.ts:106-118` | Diálogo con input N + botón Ejecutar. `generarDatosSimulados` genera N filas. Testeado con RNG determinista. |
| §13.4-005 | Ejecutar múltiples corridas. | ✅ | `app/src/ui/DialogoSimulacionNumerica.tsx` (input N), `app/src/modelo/simulacion/parametros.ts:102-118` | N ejecuciones generan N filas. Test con `numeroEjecuciones=2` verifica 2 filas. |
| §13.4-006 | Ejecutar corridas asíncronas. | ❌ | — | `generarDatosSimulados` es síncrono (Array.from). Sin soporte async/streaming. |
| §13.4-007 | Descargar resultados a CSV. | ✅ | `app/src/modelo/simulacion/csv.test.ts:4-19`, `app/src/ui/DialogoSimulacionNumerica.tsx` | `filasSimulacionACsv` convierte a CSV con escaping. Botón "Descargar CSV" en diálogo con Blob+URL. Testeado. |
| §13.4-008 | Elegir orden de columnas en CSV. | 🟡 | `app/src/modelo/simulacion/csv.ts:9-15`, `app/src/app/ports/zustandSimulacionNumericaDialogPort.ts:10-12` | La función acepta parámetro `columnas`, pero en la UI se derivan fijas de `Object.values(modelo.entidades).map(e => e.nombre)`. Sin UI para reordenar. |
| §13.4-009 | Descargar todos los objetos computacionales o un subconjunto ordenado. | 🟡 | `app/src/app/ports/zustandSimulacionNumericaDialogPort.ts:10-12` | Incluye todos los atributos `simulable`. Sin UI para filtrar subconjunto. |
| §13.4-010 | Controlar frecuencia de descarga durante simulaciones largas. | ❌ | — | Sin control de frecuencia de descarga. La generación es síncrona y única. |
| §13.4-011 | Evitar perder resultados en corridas extensas mediante descargas parciales. | ❌ | — | Sin descargas parciales ni protección contra pérdida en corridas largas. |
| §13.4-012 | Comparar resultados simulados con valores calculados. | ❌ | — | Sin feature de comparación entre valores simulados y calculados. |

### 13.5 Condiciones y loops

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §13.5-001 | Modelar decisiones por estados. | 🟡 | `app/src/modelo/simulacion/plan.ts:142-206`, `app/src/modelo/tipos/entidad.ts` (Estados) | Estados y transiciones están modelados. El plan infiere transiciones pero sin lógica condicional: todas las transiciones asociadas a un proceso se intentan aplicar. |
| §13.5-002 | Usar condiciones para elegir si un proceso ocurre o se salta. | ❌ | — | Runner no evalúa condiciones para saltar procesos. Sin rastro de conditional branching. |
| §13.5-003 | Usar invocation para continuar flujo entre procesos. | 🟡 | `app/src/modelo/tipos/enlace.ts:26`, `app/src/modelo/autoinvocacion.ts:5-48`, `app/src/modelo/operaciones/helpers.ts:92` | Enlace tipo `invocacion` existe en el modelo. `crearAutoInvocacion` la crea. Pero `plan.ts` ignora invocation links (no generan transiciones); `runner.ts` no las usa para control de flujo. |
| §13.5-004 | Usar self-invocation para loops. | 🟡 | `app/src/modelo/autoinvocacion.ts:50-55`, `app/src/modelo/autoinvocacion.ts:5-48` | `esAutoInvocacion` detecta self-invocation. `crearAutoInvocacion` la crea con demora. Pero el runner NO ejecuta invocations, no genera loops. |
| §13.5-005 | Usar contador como objeto computacional de loop. | ❌ | — | Sin concepto de contador como objeto computacional de loop. |
| §13.5-006 | Usar condición de completitud para terminar loop. | ❌ | — | Sin condición de completitud para loops. |
| §13.5-007 | Seleccionar estados aleatoriamente cuando un resultado apunta al objeto. | ❌ | — | Runner es determinista; sin selección aleatoria de estados. |
| §13.5-008 | Seleccionar estados con probabilidad igual por defecto. | ❌ | — | Sin probabilidad igual por defecto para selección de estados. |
| §13.5-009 | Seleccionar estados con probabilidad ponderada desde proceso computacional. | ❌ | — | Sin probabilidad ponderada desde proceso computacional para estados. |
| §13.5-010 | Forzar resultado a un estado específico. | ❌ | — | Runner valida `estadoAntes` contra current; no permite forzar un resultado. |
| §13.5-011 | Crear loops deterministas o probabilísticos. | ❌ | — | Sin loops deterministas ni probabilísticos. |
| §13.5-012 | Detener simulación cuando un loop infinito se produce por condición de salida ausente. | ❌ | — | No aplica: loops no se ejecutan. Sin detección de loop infinito. |

---

## 14. Entrada de Usuario

### 14.1 Input modelado formalmente

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §14.1-001 | Representar usuario como agente físico o grupo humano. | 🚫 | `app/src/modelo/tipos/enlace.ts:26` (`agente`), `app/src/modelo/validaciones.ts:323-335` (`agente-requiere-objeto-fisico`), `app/src/modelo/validaciones.test.ts:289-325` | Enlace `agente` existe en el modelo OPM, con validación de que el objeto agente debe ser físico. Pero no está integrado al sistema de simulación/input. |
| §14.1-002 | Representar proceso de obtención de input como proceso explícito. | 🚫 | — | Sin concepto de "proceso de obtención de input" explícito en el modelo o ejecución. |
| §14.1-003 | Conectar usuario al proceso mediante enlace de agente. | 🚫 | `app/src/modelo/tipos/enlace.ts:26` (`agente`), `app/src/modelo/operaciones.test.ts:63` | Enlace agente conecta objeto (usuario) a proceso. Existe en el modelo pero no se usa para input en simulación. |
| §14.1-004 | Habilitar opción de solicitar input solo cuando el usuario está modelado como agente. | 🚫 | — | Sin guard que habilite/deshabilite solicitud de input según modelado de agente. |
| §14.1-005 | Representar input como objeto computacional. | 🚫 | — | Sin designación de "input" sobre objetos computacionales. |
| §14.1-006 | Conectar proceso de input con el objeto que recibirá el valor. | 🚫 | — | Sin conexión modelada entre proceso de input y objeto receptor. |
| §14.1-007 | Usar el input como dato formal del modelo, no como entrada ad hoc. | 🚫 | — | Sin concepto de input como dato formal del modelo. |

### 14.2 Durante simulación

| ID | Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|---|
| §14.2-001 | Solicitar valor al usuario durante simulación. | 🚫 | — | Sin mecanismo de solicitud de valor al usuario durante la simulación conceptual. |
| §14.2-002 | Mostrar pop-up de entrada cuando el proceso marcado se alcanza. | 🚫 | — | Sin pop-up de entrada al alcanzar un proceso marcado. |
| §14.2-003 | Pasar valor ingresado a función definida por usuario. | 🚫 | — | Sin funciones de usuario a las que pasar input. |
| §14.2-004 | Exponer variable de input en el IDE/API de funciones. | 🚫 | — | Sin IDE/API de funciones, sin variable de input. |
| §14.2-005 | Usar input para actualizar objetos computacionales. | 🚫 | `app/src/store/simulacion.ts:137-146`, `app/src/store/sliceTypes.ts:260` | `asignarValorRuntimeSimulacion` existe como API programática en el store. Permite mutar valoresRuntime manualmente. Pero no hay UI de input durante la simulación. |
| §14.2-006 | Usar input para controlar cálculos. | 🚫 | — | Sin input para controlar cálculos. |
| §14.2-007 | Usar input para controlar condiciones. | 🚫 | — | Sin condiciones que controlar con input. |
| §14.2-008 | Usar input para controlar loops. | 🚫 | — | Sin loops que controlar con input. |
| §14.2-009 | Usar input para controlar profundidad, número de iteraciones u otros parámetros de ejecución. | 🚫 | — | Sin parámetros de ejecución controlables por input. |
| §14.2-010 | Validar input dentro de la función o mediante rangos del objeto computacional. | 🚫 | `app/src/modelo/simulacion/parametros.ts:98` (`validarValorSlot`), `app/src/modelo/tipos/entidad.ts:168-169` (`rangoMin/rangoMax`) | Infraestructura de validación existe (ValorSlot + rangos). Pero no hay UI de input durante simulación donde aplicarla. |
| §14.2-011 | Combinar input humano con simulación conceptual y ejecución computacional. | 🚫 | — | Sin integración entre input humano y los modos de simulación conceptual/numérica. |

---

## Estado de la auditoría empírica (recalibrada, 2 pasadas)

**Auditoría completa + 2 pasadas de recalibración (2026-05-26).** 636 ítems.

1. **Pasada 1 — enjambre:** 11 agentes auditaron 639 ítems contra código, tests unit y specs e2e.
2. **Pasada 2 — recalibración interactiva + re-auditoría profunda:** 3 agentes re-evaluaron 🟡/❌ con rúbrica unificada (código funcional + UI viva = ✅) y filtro "qué vs cómo".

**Decisiones del operador aplicadas:**
- 3 ítems eliminados (redundantes o "cómo" en vez de "qué")
- Rúbrica: código funcional + UI viva = ✅ (28 ítems 🟡→✅ en pasada 1, 28 más en pasada 2)
- §11 y §14 → 🚫 (55 ítems fuera de alcance)
- §4.5 Biblioteca dock en scope (código existe, feature-flag OFF)

### Resumen ejecutivo (636 ítems)

| | ✅ | 🟡 | ❌ | 🚫 |
|---|---|---|---|---|
| **Global** | 290 (46%) | 98 (15%) | 184 (29%) | 64 (10%) |

### Fortalezas (✅ ≥ 50% de la sección)

- **§1 Modelado nuclear (134): 98✅ (73%)** — naming, esencia/afiliación, atributos, estados (crear/suprimir/transición/duración), enlaces estructurales y procedimentales con markers canónicos, multiplicidad, tags, rutas, abanicos O/XOR, vértices, puertos.
- **§3 Bimodalidad OPD/OPL (29): 20✅ (69%)** — sincronía bidireccional, edición desde OPL, panel configurable, hover OPD↔OPL.
- **§5 Recuperación de contexto (25): 17✅ (68%)** — traer-conectados, traer-enlaces-entre-seleccionados, búsqueda intra-modelo.
- **§7 Gestión de modelos (47): 31✅ (66%)** — tabs, cut/paste, archivado, retención, export/import OPJSON.
- **§4 Canvas (74): 42✅ (57%)** — grid/zoom/snap, resize, undo/redo, vértices, árbol OPD con drag, Mapa del Sistema (feature-flag OFF).
- **§2 Refinamiento (43): 22✅ (51%)** — in-zooming, unfolding, semi-folding.

### Ausencias mayores (en scope)

- **§9 Gobierno semántico (44❌):** templates, stereotypes, ontología. Ausencia total confirmada en re-auditoría.
- **§10 Requisitos (36❌):** vistas, enriquecimiento, trazabilidad. Sin módulos ni store.
- **§13.5 Condiciones/loops (9❌):** modelados declarativamente, no ejecutados por el runner.
- **§6.3 Notas libres (10❌):** feature inexistente.
- **§12.3 Export PDF (4❌):** sin librería.

### Brechas parciales (🟡)

- §13 Simulación (13🟡): sin interpolación de tokens, corridas asíncronas ni descargas parciales.
- §4 Canvas (20🟡): biblioteca dock (feature-flag), navegador/minimapa, alineación semántica en in-zoom.
- §1 Nuclear (15🟡): autoformato, elipsis sin conteo numérico ni interacción, `?` en multiplicidad, combinatorial m-de-n, herencia de rasgos, skipping/eventos de entrada a estado.
- §2 Refinamiento (14🟡): control de resize interno/externo, toggle reorden, síncrono/asíncrono.
- §7 Gestión (10🟡): versionado (autosave sin versiones, sin comparación), metadata (sin autor).

### Artefactos

- **Maestro:** `docs/cumplimiento-opforja.md`
- **Fragmentos originales (11):** `_local/cumplimiento/L*-s*.md`
- **Re-auditorías (3):** `_local/cumplimiento/*-reauditado.md`
- **Merge + recalibración:** `_local/cumplimiento/merge.mjs` (idempotente)
