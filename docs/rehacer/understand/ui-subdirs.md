# Dossier: superficies de UI en subdirectorios de `app/src/ui` + lectores + `index.html`

Área: `app/src/ui/{inspector, inspectorEnlace, codex, toolbar, panelOpl, arbol, mobile,
panelCarpetas, agent, review, portable, reuse}`, `app/portable-reader/index.html`,
`app/src/portable-reader/{main.tsx,sw.js}` y `app/index.html`.

Método: lectura completa de cada archivo fuente del área (no solo nombres), lectura de los
componentes raíz que los componen (`App.tsx`, `Inspector.tsx`, `InspectorEntidad.tsx`,
`InspectorEnlace.tsx`, `PanelOpl.tsx`, `Toolbar.tsx`, `DocumentActions.tsx`,
`PortableDocumentAction.tsx`, `ReviewDocumentAction.tsx`, `main.tsx`, `editorBootstrap.tsx`,
`vite.config.ts`) y contraste con el kernel (`modelo/`, `opl/`) cuando la UI codifica una
regla. Se verificó con `grep` qué exportaciones tienen consumidores reales. No se editó nada.

---

## 0. Resumen ejecutivo

1. **La UI de estas carpetas es ancha, no profunda.** ~14.1k líneas de fuente + ~2.3k de
   tests unitarios + ~0.7k de CSS. El grueso (inspector 3.8k, codex 2.6k, toolbar 1.9k,
   panelOpl 1.4k, inspectorEnlace 1.0k) es edición OPM genuina; el resto son superficies de
   circunstancia añadidas en oleadas (W5/W6 "anclas", "ficha de trabajo", "producto
   integrado": agente, revisión compartida, paquete portátil, piezas).
2. **Núcleo valioso a portar:** edición de estados (designaciones, supresión, duración,
   reorden), esencia/afiliación, atributos con slot de valor, refinamiento (in-zoom/unfold con
   modo estructural), inspector de enlace (modificadores condición/evento/NO, multiplicidad,
   abanicos XOR/OR, extremos a estado), panel OPL interactivo (tokens seleccionables,
   renombrado inline, editor OPL reverso "honesto" con clasificación aplicable/no aplicable),
   árbol OPD accesible (treeitem, teclado), lectores de solo lectura (SVG + OPL).
3. **Lastre concentrado en cinco patrones:** (a) *código muerto* verificable
   (`ToolbarMas`, `ToolbarMapaSistema`, `CodexFooterKey`, `CodexInspectField`, flags de
   `CodexStateRow`, rama `modoOperacion:"carga"` de `PanelCarpetas`, `AI_TEXT_HABILITADO`,
   23/34 variables CSS y 8/9 clases utilitarias de `index.html`); (b) *duplicación de
   superficies* (dos barras de selección, dos flujos de creación de estados, dos flujos de
   refinamiento, tres lectores casi idénticos, tres mecanismos de reutilización, dos
   indicadores de persistencia en la misma toolbar); (c) *gobernanza incrustada en el código*
   (comentarios "Ronda N · L3", `data-ifml-*`, `data-tutor-*`, "testIds inmutables" como
   restricción de diseño, IDs de auditoría); (d) *tutor ubicuo* (cada sección llama
   `runTutorPolicy` de un motor de arbitraje de 5.8k líneas para mostrar ayuda); (e) *métodos
   de un pipeline externo* (anclas normativas, registro [RATIFICAR], LogDecisiones v0, sello
   de procedencia, ficha de trabajo) que viven en el inspector de cualquier modelo.
4. **Divergencias OPM detectadas** (hay que resolverlas al reescribir, no copiarlas):
   - Ayuda del editor OPL enseña `**Bomba** puede ser *encendida* o *apagada*.`
     (`panelOpl/EditorOplHonesto.tsx:96`), pero el canon y el parser usan **`puede estar`** con
     estados en backticks (`opl/generadores/duracionMetadata.ts:67-69`,
     `opl/parser/parsear.ts:159`). El ejemplo no es parseable como estados.
   - La vista previa del modal de estados emite otra forma: `**X** se encuentra en uno de los
     siguientes estados: **A** o **B**.` (`inspector/previewEstadosOpl.ts:22`), con estados
     en negrita (convención de objeto). Tres plantillas distintas para la misma oración.
   - Multiplicidad: la UI anuncia `?` como válido (`inspectorEnlace/SeccionMultiplicidad.tsx:111-112`)
     pero valida con `MULTIPLICIDAD_CANONICA_RE` que no lo acepta
     (`modelo/operaciones/enlaces.ts:53`); existe otra regex que sí
     (`modelo/enlaceMultiplicidad.ts:14`). Dos gramáticas de multiplicidad en el kernel.
   - Mínimo de estados: `InspectorEstado.tsx:58` cuenta todos los estados (`> 2`);
     `SeccionLayoutEstados.tsx:101` cuenta solo visibles (`<= 2`); el kernel cuenta todos
     (`modelo/operaciones/estados.ts:165-166`).
   - Reanclaje de enlaces externos del in-zoom infiere subprocesos por **contención
     geométrica** (`inspectorEnlace/SeccionReanclaje.tsx:60,79-81`), no por la semántica de
     refinamiento (`contextoRefinamiento.rol === "interno"`, que sí usa el renderer).
5. **Chrome sobre el canvas:** en desktop, sobre el papel JointJS se apilan IntentBar del
   agente (formulario + línea de estado + details), barra de acciones de documento
   (persistencia + 4 acciones), hasta tres "cintas", cabecera de canvas (kicker + zoom) y la
   línea de pregunta guía. El propio `HANDOFF.md` registra canvas de 447 px en móvil "tras
   plegar acciones secundarias". La reescritura debe devolver el foco al sistema (la spec del
   producto integrado lo pide: "El sistema ocupa el foco", §5).

---

## 1. Dimensiones y posición en el shell

| Subdirectorio | Fuente | Tests | CSS | Consumidor raíz |
|---|---:|---:|---:|---|
| `inspector/` | 3.768 | 670 | 0 | `Inspector.tsx`, `InspectorEntidad.tsx`, `InspectorEnlace.tsx` |
| `codex/` | 2.625 | 621 | 0 | `App.tsx` (frame, canvas mount, col header), inspector, panel OPL |
| `toolbar/` | 1.902 | 154 | 42 | `Toolbar.tsx` |
| `panelOpl/` | 1.393 | 200 | 0 | `PanelOpl.tsx` |
| `inspectorEnlace/` | 1.016 | 262 | 0 | `InspectorEnlace.tsx` |
| `mobile/` | 753 | 52 | 0 | `App.tsx` (si `VITE_MOBILE_READONLY=true` y breakpoint mobile) |
| `arbol/` | 715 | 335 | 45 | `ArbolOpd.tsx` |
| `agent/` | 535 | 0 | 0 | `App.tsx` (topbar del canvas / cabecera móvil) |
| `panelCarpetas/` | 485 | 14 | 0 | `PanelCarpetas.tsx` → solo `DialogoGuardarComo.tsx` |
| `portable/` | 412 | 0 | 159 | `PortableDocumentAction.tsx` (lazy) y `src/portable-reader/main.tsx` |
| `review/` | 332 | 0 | 419 | `ReviewDocumentAction.tsx` (lazy) y `main.tsx` ruta `/revision/:token` |
| `reuse/` | 211 | 0 | 0 | `DocumentActions.tsx` |

Composición real (App.tsx:153-420):

```
main.tsx
 ├─ /revision/:token  → review/RevisionReader (sin login, sin store)
 └─ editorBootstrap → App
     ├─ requiereLogin → PantallaLogin
     ├─ modoSoloLectura (VITE_MOBILE_READONLY && mobile) → mobile/MobileReadonlyApp
     ├─ esMobile (editor móvil) → Toolbar + BarraPestanas + AgentWorkbench(+DocumentActions compact)
     │     + canvas + BarraHerramientasElemento (barra de chips legacy) + panes opds/opl/issues
     └─ desktop → codex/CodexFrame
           header: wordmark · BarraPestanas · Breadcrumb · Toolbar · ChromeMetaCodex
           left:   CodexColHeader "OPL" + PanelOplView + PanelDiagnostico
           canvas: codex/CodexCanvasMount
                     topbar: AgentWorkbench(IntentBar + DocumentActions) + Cintas | BarraSimulacion
                     header: "SD · OPD raíz" + zoom ; PreguntaGuiaOpd
                     paper JointJS + codex/CodexSelectionAnnotation (portal)
           right:  "ÍNDICE/OPDs" ArbolOpd  ─divisor─  "INSPECTOR/Selección" Inspector (+Timeline)
portable-reader/index.html → src/portable-reader/main.tsx → portable/PortableReaderPage (+sw.js)
```

Producción: `docker-compose.yml:8` fija `VITE_MOBILE_READONLY: "true"`, por lo que en
producción el teléfono ve `MobileReadonlyApp`; la rama "editor móvil" solo existe en builds
sin el flag (dev/e2e). Son **dos shells móviles** mantenidos a la vez.

---

## 2. Inventario por superficie

### 2.1 `inspector/` — ficha de la cosa, del estado y del modelo (3.8k)

**Propósito.** Mostrar y editar la semántica de la selección. El inspector raíz
(`Inspector.tsx:32-53`) es un XOR `estado | entidad | enlace | vacío`, garantizado por el
invariante del store (a lo más uno de `seleccionId`, `enlaceSeleccionId`,
`estadoSeleccionId`).

**Marco de sección (reutilizable, buena calidad):**
- `FichaSeccion.tsx` — bloque con kicker; con `colapsable` usa `useColapso` y oculta con
  `display:none` para que `abrirSeccionesDe` pueda expandir antes de enfocar. `FichaSeccionEnlace`
  es un alias sin valor (`FichaSeccion.tsx:105`).
- `SeccionDisclosure.tsx` — mismo patrón para sub-bloques ("Avanzado", "Notas de mesa").
  Duplica la estructura de `FichaSeccionColapsable`.
- `useColapso.ts` + `seccionColapso.ts` — memoria de plegado en `sessionStorage`
  (`opm.inspector.colapso.*`) y evento `opm:inspector-abrir-colapso` para expandir desde
  otras superficies. Útil pero acoplado vía `window` y `data-colapso-key` en el DOM.
- `identificador.ts` — `o-11 → o.11`. **Duplica** `identificadorCanonicoEntidad`
  (`render/jointjs/composers/entidad.ts:363`) con otra regla (prefijo desde id vs desde
  `entidad.tipo`) y sin el ordinal jerárquico de subprocesos internos (`:369-389`). Riesgo de
  que canvas e inspector rotulen distinto. `identificadorEnlaceInspector` es identidad pura.

**Secciones de entidad (orden en `InspectorEntidad.tsx:222-330`):**
Semántica → Enlaces → Refinamiento → Extensiones → Anclaje (si anclada) → Apariciones → Tamaño.

| Archivo | Qué hace | Valor | Complejidad |
|---|---|---|---|
| `SeccionDescripcion.tsx` | textarea de descripción | núcleo (metadato de cosa) | trivial |
| `SeccionAlias.tsx` | alias + unidad (solo objetos, dentro de "Avanzado") | importante | trivial; **unidad duplicada** con `SeccionAtributo` |
| `SeccionUrls.tsx` | botón "URLs (n)" → modal | marginal | trivial |
| `SeccionImagen.tsx` | imagen del objeto (modo imagen/texto/ambos) | marginal (OPCloud) | baja |
| `SeccionEsenciaAfiliacion.tsx` | esencia informacional/física, afiliación sistémica/ambiental, **linealidad** copiable/lineal (solo objetos) | núcleo OPM (+ extensión F1) | baja |
| `SeccionLayoutEstados.tsx` | lista de estados: renombrar, suprimir/restaurar, eliminar, designaciones, duración, layout horizontal/vertical, "Quitar estados" | núcleo | media; renderiza dos listas paralelas (filas + flags) para "preservar e2e" (`:143-154`) |
| `ModalCrearEstados.tsx` + `previewEstadosOpl.ts` | modal para nombrar 2 estados iniciales o uno adicional, con "previsualización OPL" | importante | media; **plantilla OPL divergente** (ver §0.4) y validación duplicada del kernel |
| `SeccionDesignaciones.tsx` | Inicial/Final/Default/Current como palabras-botón | núcleo | baja |
| `SeccionDuracion.tsx` | palabra "duración" que abre modal | importante | trivial |
| `InspectorEstado.tsx` | inspector dedicado del estado: nombre (Enter/Escape), reordenar ↑↓, designaciones, duración, suprimir/restaurar, eliminar | núcleo | media; header muestra `estado.id` crudo (entidad muestra `o.11`) |
| `SeccionAtributo.tsx` | atributo con slot de valor: unidad, tipo (entero/decimal/carácter/texto), valor, simulación (7 distribuciones + modo textual ponderado) | núcleo (slot) + importante (simulación) | alta (396 l.); parser de texto ponderado en la UI (`:240-257`); icono `editAlias` usado para "Tipo de valor" |
| `SeccionRefinamiento.tsx` | estado de in-zoom/despliegue, reasignación de enlaces externos derivados, auto-invocación, plegado parcial/completo, orden de partes, semiplegado estructural, traer agregaciones del in-zoom, partes compactas extraíbles | núcleo + importante | alta (260 l. con 23 props) |
| `SeccionEnlaces.tsx` | lista entrantes/salientes/refinamientos de la cosa, navega al enlace | importante | media; lógica de consulta (`listarEnlacesEntidad`) en la UI; `etiquetaTipoOpl` parte camelCase con regex |
| `SeccionApariciones.tsx` + `aparicionesUtils.ts` | OPDs donde aparece la cosa, navega; raíz primero | importante (entidad vs apariencia) | baja; buena calidad |
| `SeccionTamano.tsx` | ancho/alto, auto/manual, ajustar al texto | marginal (layout) | baja |
| `SeccionRequisitos.tsx` | requisitos vinculados / cobertura de un requisito | marginal (estereotipo requisito, OPCloud) | media |
| `SeccionAnclaje.tsx` + `anclajePresentacion.ts` | "Centinela de drift": pieza de biblioteca anclada, sincronizado/divergente/no-resuelto, Re-sincronizar/Soltar | marginal (reutilización) | media; copy cuidado |
| `SeccionAnclas.tsx` + `anclasPresentacion.ts` | anclas normativas read-only (proto KORA) | acreción (pipeline externo) | baja |
| `SeccionRegistroRatificar.tsx` | registro [RATIFICAR]: anotar en mesa, ratificar con fuente, copiar "LogDecisiones v0" | acreción (pipeline externo) | media |
| `SeccionNotasMesa.tsx` | notas de "mesa" por target (dudas pendientes) | marginal (útil como comentario) | baja; duplica el concepto de anotación de `review/` |
| `SeccionFichaTrabajo.tsx` | "ficha de trabajo" del documento: pregunta habilitante, modalidad, dueño del significado, responsable, tipos de modelo, criterio de suficiencia, vida útil, revisar cuando, lentes de conocimiento, política documental | acreción metodológica | alta (426 l.); rastreo de "último cambio" vía `JSON.stringify` para el tutor (`:54-92`), reenvío manual de Ctrl+Z (`:300-319`) |

**Rama vacía** (`Inspector.tsx:62-95`): placeholder "Selecciona un elemento.", sello de
procedencia (`protoHash`, versiones de autoría/layout) con advertencia de divergencia,
registro [RATIFICAR], anclas del modelo y del OPD activo, ficha de trabajo (lazy), nota del
modelo. Para un modelador genérico la rama vacía debería mostrar el **modelo** (nombre,
descripción, OPD activo, resumen) y no metadatos de un compilador externo.

**Acoplamiento.** Mezcla tres vías de acceso al estado: viewmodels (`useInspectorViewModel`,
`useInspectorEntidadViewModel`), puertos (`useZustandEditabilityPort`) y **`useOpmStore`
directo** en 9 secciones (`SeccionAnclas`, `SeccionNotasMesa`, `SeccionRegistroRatificar`,
`SeccionAnclaje`, `InspectorEstado`, `SeccionFichaTrabajo`, `CodexCanvasMount`,
`CodexSelectionAnnotation`, `VistaModelosLectura`), contra la regla declarada en `AGENTS.md`
("interfaz consume app"). La capa viewmodel es indirección parcial.

### 2.2 `inspectorEnlace/` — propiedades del enlace (1.0k)

| Archivo | Qué hace | Valor |
|---|---|---|
| `SeccionMultiplicidad.tsx` | multiplicidad origen/destino; modificador (condición/evento/NO) con subtipo C/E/¬; probabilidad de evento [0,1]; demora de invocación; `SeccionEtiquetaEnlace` (etiqueta con validación del kernel); `enlaceProcedural()` | núcleo |
| `SeccionExtremos.tsx` + `detalleContratoPuerto.ts` | "Anclaje exacto": puerto de cada extremo (exacto/no visible/automático/estado), hora de reloj del ancla, fan exacto y fans posibles ("Crear fan"), selector de extremo a estado, "Reanclar extremo" | núcleo (extremo a estado, fan) + marginal (puerto/reloj) |
| `SeccionAbanico.tsx` | abanico XOR/O: puerto común, política de decisión (estado fijo/uniforme/probabilidades/función), editor de probabilidades que suman 100 %, quitar rama, disolver, "Resolver ahora" | núcleo (XOR/OR) + importante (simulación) |
| `SeccionReanclaje.tsx` | reanclar un enlace derivado del in-zoom a otro subproceso; manual/automático | importante; **subprocesos por geometría** (§0.4) |
| `SeccionRuta.tsx` | etiqueta de ruta si `enlaceAdmiteRuta` | importante (OPL "Por ruta X,") |
| `SeccionMetadatosOpcloud.tsx` | etiqueta inversa (bidireccional), tasa + unidades, tiempo mín./máx. de excepciones, "Satisfied textual" + mostrar etiqueta | importante (excepciones) + marginal (tasa, satisfied) |

Olores: estilos "card" con tokens legados (`fondoCard`, `bordeTabla`, `infoMuySuave`,
`azulMuySuave`) que contrastan con la estética Codex del resto; hint sin sentido para el
usuario ("Tabla filtrada por dirección y tipo vigente", `SeccionMultiplicidad.tsx:38`);
dos representaciones de requisitos satisfechos (texto libre `requisitos` y
`SatisfaccionRequisito` estructurado) conviven en el mismo inspector.

### 2.3 `codex/` — marco editorial y primitivas visuales (2.6k)

| Archivo | Qué hace | Uso real |
|---|---|---|
| `CodexFrame.tsx` | grid del workbench: header 48 px (wordmark, tabs, breadcrumb, toolbar, meta) + cuerpo 5 columnas (`left 6px canvas 6px right`); modo `canvasOnly` | vivo (App) — prop `menu` siempre `null`; `modoMarginaliaCodex` solo en test |
| `CodexCanvasMount.tsx` | región canvas: topbar, cabecera (código OPD · "OPD raíz/Boceto no integrado/OPD integrado", zoom leído de `paper.scale()`), **pregunta guía** del OPD editable, host del paper, portal de la anotación | vivo |
| `CodexSelectionAnnotation.tsx` | **única voz de la selección en desktop** (917 l.): barra tipográfica anclada al bbox de las celdas seleccionadas (portal en `canvas-pane`, recalcula con eventos de paper/scroll/resize), acciones por contexto (descomponer, desplegar, estado, alias, imagen, eliminar, partes, traer enlaces, alinear, distribuir, inspector) y **formulario de refinamiento** (pregunta guía obligatoria; tipo; relación estructural si despliegue; adopción de boceto) con tutor | vivo; `accionesDeContexto()` exportada y solo usada por tests |
| `CodexOplNote.tsx` | piel de una oración OPL numerada con marginalia de severidad | vivo (Bloques) — `marginalia/severidad` no se usan desde Bloques |
| `oplTipografia.tsx` | `OplObj` (serif bold, subrayado sólido), `OplProc` (bold italic, subrayado punteado), `OplState` (mono, oliva) + objeto `estilos` | vivo; contrato tipográfico OPL valioso |
| `CodexStateRow.tsx` | fila de estado: badge oliva + nombre/slot + ↑↓ + flags | vivo, pero ambos consumidores pasan `flags={[]}`; los flags reales se renderizan fuera |
| `CodexInspectSection.tsx` / `CodexInspectInline.tsx` | sección con kicker / segmented tipográfico `a · b` | vivos |
| `CodexColHeader.tsx` | cabecera de columna (kicker, título, meta) | vivo |
| `glifos.ts` | glifos Unicode + `formatearComboCodex` (⌘⇧⌥ en Mac) | vivo parcialmente: `GLIFOS_CODEX`, `estiloKbdCodex` sin consumidores |
| `CodexInspectField.tsx` | par clave-valor | **muerto** (solo su test) |
| `CodexFooterKey.tsx` | leyenda de pie | **muerto** (solo su test y el prototipo `ui-forja/src/variant-codex.jsx`) |

Valor: `CodexSelectionAnnotation` es la pieza de interacción más importante del área (acciones
pertinentes junto a lo seleccionado, como pide la spec §5 "Tocar una cosa… revelar sus acciones
pertinentes"). Pero coexiste con `BarraHerramientasElemento.tsx` (850 l., fuera del área) que
sigue montado en el editor móvil (`App.tsx:192-196`) y del que la anotación importa todo el
catálogo (`resolverContextoBarra`, `accionesParaContextoBarra`, `ariaLabelBarra`…). Dos
presentaciones de un mismo catálogo; `enfocarSeccionInspector` está implementado **dos veces**
(`CodexSelectionAnnotation.tsx` con `abrirSeccionesDe` y doble rAF; `ToolbarBase.tsx` con
`setTimeout` y **sin** `abrirSeccionesDe`, de modo que "Editar alias" desde el menú contextual
puede no enfocar el input si "Avanzado" está plegado — defecto plausible, no verificado en
navegador).

### 2.4 `toolbar/` — creación y estado global (1.9k)

- `Toolbar.tsx` (raíz, fuera del área) monta `ToolbarBase` con `conectarSlot=<ToolbarCreacion/>`
  y un `statusSlot` "● Auto" de autosalvado.
- `ToolbarBase.tsx` (509 l.) hace **cinco cosas distintas**: (1) estado de persistencia inline
  (`ToolbarPersistenceStatus`, chip clicable → Guardar como); (2) `ChipRevisionNueva`;
  (3) creadores Objeto/Proceso/Estado (+ Atributo contextual) con drag al canvas y Shift+clic
  para inserción continua; (4) **capa de menús contextuales** de enlace/entidad/estado
  escuchando `window` (`opm:menu-contextual-enlace`, `opm:menu-contextual-estado`,
  `contextmenu` en captura leyendo `model-id` del DOM JointJS); (5) modal "nombre de cosa"
  para `nuevaCosaPendiente` y el diálogo lazy "traer conectados". Responsabilidades (4) y (5)
  no pertenecen a una toolbar.
- `ToolbarCreacion.tsx` — botón "Relación" que abre `MenuTipoEnlace` (tipos válidos según
  origen/destino), indicador canónico de modo (`Conectando: … · Esc cancela`,
  `Insertando objetos · Esc para salir`), nudge "arrastra desde un anchor" limitado a 5 usos
  por sesión con un `Map` en memoria llamado "Sesion".
- `toolbarPrimitives.tsx` — `ToolbarActionButton` (glifo + label + kbd con color semántico) y
  `labelPersistenciaToolbar`.
- `ChipRevisionNueva.tsx` — aviso "Revisión del agente" con poll; ramifica "Ver la del agente"
  / "Descartar los míos y traer la del agente" si hay cambios locales. Canal de agente
  **distinto** del de `agent/` (puente directo por revisiones vs tareas con propuestas).
- `toolbarStyles.ts` (613 l.) — 55 claves; al menos 16 sin consumidor (`activeButton`,
  `objectButton`, `processButton`, `versionButton`, `lockIcon`, `searchIcon`, `marcaCompacta`,
  …) y un comentario de "compat-shim" para consumidores que ya no existen.
- `toolbar.css` — hover/active seleccionando **por `data-testid`**.
- **Muertos:** `ToolbarMas.tsx` (352 l., menú "⋯ Más" con portal) y `ToolbarMapaSistema.tsx`
  no tienen importador; arrastran `toolbarMasViewModel`, `toolbarMapaSistemaViewModel`,
  `zustandToolbarOverflowPort` y ~37 referencias a `toolbarMasAbierto`/`menuPrincipalAbierto`
  en el store (el componente `MenuPrincipal` ya no existe).

Detalle visual: `GlyphEstado` es un **rombo** (`ToolbarBase.tsx:84-103`), mientras en OPD
el estado es un rectángulo redondeado dentro del objeto; el badge de `CodexStateRow` y
`GLIFO_ESTADO` ("▢") son cuadrados. Iconografía inconsistente con la gramática visual OPM.

### 2.5 `panelOpl/` — la expresión textual (1.4k)

- `PanelOpl.tsx` (fuera del área) orquesta: delta "OPL actualizada · N líneas" tras cada
  cambio, scroll a la primera línea cambiada o a la seleccionada, rail minimizado, estado
  "vista mapa".
- `Bloques.tsx` — oraciones agrupadas por OPD (profundidad → indentación), cabecera plegable
  con conteo, "en foco · nivel N", etiqueta de alcance "OPL completo · todos los OPDs" /
  "OPL local · X"; resaltado de selección, hover cruzado canvas↔OPL y proceso activo de
  simulación. Buena calidad funcional.
- `RenderToken.tsx` — token OPL interactivo: `**objeto**`→`<strong>`, `*proceso*`→`<em>`,
  `` `estado` ``→`<code>` (`:167-169`); clic selecciona el referente; Enter/F2/doble clic
  renombra entidad o estado inline; doble clic en verbo/enlace abre inspector de enlace;
  `role="button"`, `tabIndex`, `aria-keyshortcuts`. **Pieza a portar casi tal cual.**
- `EditorOplHonesto.tsx` — editor OPL reverso: textarea + cuatro grupos (texto,
  reconocidas, aplicables, no aplicables con razón y cita SSOT) + "Aplicar N cambios";
  aviso para familias generadas solo desde canvas (abanicos, eventos, condiciones,
  excepciones). Concepto excelente (declara soporte en vez de fingir roundtrip); **ayuda
  con sintaxis incorrecta** (§0.4). Además dice "*itálicas* para estados" cuando el renderer
  usa itálica para procesos y backticks para estados.
- `Toolbar.tsx` (panel) — plegar, nº, editar, buscar, "copiar md", filtro por selección con
  chip `filtrado · o.06 · 4/24 ✕`. Contiene un botón "AI Text" apagado por constante
  (`AI_TEXT_HABILITADO = false`, `:15`) con handler, estilos y prop vivos: vaporware.
- `dataFlow.ts` — atributos `data-ifml-*` (view component, pattern CN-MMD, master…) y
  `aria-label` del alcance. Los `data-ifml-*` son trazabilidad de un informe de diseño, sin
  función para el usuario (7 aserciones e2e los leen).
- `styles.ts` — estilos del editor reverso (pills de conteo, etc.).

### 2.6 `arbol/` — índice de OPDs (0.7k)

- `NodoOpd.tsx` — fila `role="treeitem"` con `aria-level/selected/expanded/current`, marker
  ▸/▾, código mono + etiqueta serif, renombrado inline (doble clic/F2), chips `SM
  sync/out/off/cold` (submodelo), `Vista` (vista derivada), `Anclas N`; botón "ir al
  refinador" (※), badge de avisos (△ errores/advertencias), eliminar (⌫) con reglas
  (raíz no, con hijos no). Arrastre para orden manual.
- `badges.ts` — tipo de OPD (SD/Inzoom/Unfold), conteo de avisos por OPD, proyección
  "Hoja" de la raíz en apuntes; `cuentaObjetos/Procesos/Enlaces` se calculan y **no se
  muestran** en ningún consumidor.
- `togglesArbol.ts`, `handlersTeclado.ts` — lógica pura de expandir/colapsar, orden local,
  navegación por flechas y atajos (Ctrl+E, Ctrl+Shift+E, Ctrl+D, F2). Buena calidad.
- `arbol.css` — acciones visibles solo en hover/focus-within.
- Duplicación: `refinadorDeOpd` existe en `NodoOpd.tsx:10-16` y en `badges.ts:132-138`.
  `codigoOpd` (`NodoOpd.tsx:237-243`) infiere el código desde el **nombre** del OPD con una
  regex (`SD\d*`, `P\d+`, `LF-\d+`, `OPD\d+`); si el nombre no lo contiene, la jerarquía se
  pierde en la presentación. En OPM la numeración de OPDs (SD, SD1, SD1.1) es estructural y
  debería derivarse del árbol, no del texto.

### 2.7 `mobile/` — lectura en teléfono (0.75k)

- `MobileReadonlyApp.tsx` — pestañas Modelos | Diagrama | OPDs | OPL | Acerca, cabecera con
  OPD y pregunta guía, búsqueda (botón 🔍 emoji). Reutiliza `ArbolOpd`, `PanelOplView`,
  `JointCanvasFeedbackBoundary` en `readonlyMode`.
- `VistaBusquedaLectura.tsx` — búsqueda normalizada en OPDs, entidades, OPL del OPD activo
  y, opcionalmente, diagnóstico (preferencia en `localStorage`
  `deep-opm.mobile.busqueda.incluirDiagnostico`). Los hits OPL e issues tienen `onClick` no-op.
- `VistaModelosLectura.tsx` — lista de modelos guardados del tenant; abre con `cargarLocal`.
- `seleccionModelos.ts`, `preferenciasMovil.ts` — helpers puros diminutos.

Valor: importante (la spec exige lectura/observación en teléfono, A11). Pero hay un segundo
shell móvil editable (§1) y el lector de revisión (`review/RevisionReader`) ya ofrece lectura +
anotación en teléfono con otra UI.

### 2.8 `panelCarpetas/` — selector de carpetas (0.5k)

`Tile.tsx` (tile/lista, glifos autosave/versiones, badge ARCH, drag), `Breadcrumb.tsx`,
`MenuContextual.tsx` (renombrar, eliminar, cortar/pegar, archivar, biblioteca, versiones,
abrir en pestaña), `handlersDragDrop.ts` (MIME `application/x-deep-opm-workspace`).
Solo se monta en `DialogoGuardarComo` con `modoOperacion="selector"`,
`onAbrirModelo={() => {}}` y `recientes={[]}`; ~17 callbacks opcionales nunca se pasan y la
rama `"carga"` no se usa: `DialogoCargarModelo.tsx` (1.108 l., fuera del área) reimplementa
su propia navegación de carpetas reutilizando solo los helpers de drag.
`accionDropDesdeEvento` y `puedeAceptarDrop` solo tienen consumidores en tests.

### 2.9 `agent/` — trabajo con agente (0.5k)

- `AgentWorkbench.tsx` — crea `AgentClient`, `DocumentOperationsPort` y `AgentTaskPort` por
  documento persistido; alcance = selección ∪ entidad ∪ estado seleccionados; además hace de
  **render-prop** para `DocumentActions` (las acciones del documento dependen del puerto de
  operaciones del agente aunque no sean agénticas).
- `IntentBar.tsx` — "Qué quieres conseguir": alcance (documento/selección+OPD), autoridad
  (proponer/editar), corregir encargo en curso, Detener, Continuar con decisión, ampliar
  presupuesto, aceptar reserva de uso desconocida, ver cambios, deshacer/reaplicar, avisos de
  ediciones locales pendientes y conflictos con descarga del borrador en JSON.
- `ChangeReview.tsx` — propuesta: operaciones semánticas descritas, diff OPL antes/después por
  OPD, "Incorporar al documento". Reutilizado por `RefinementProposalAction` y
  `PieceProposalAction`.
- `TaskActivity.tsx` — estado, uso (herramientas, modelo, USD), resultados, razones.

Valor: importante *para la visión* del producto integrado (A02–A07, A24), pero hoy **no hay
inferencia real configurada** (`HANDOFF.md`: falta `OPFORJA_AGENT_API_KEY`) y la barra se
monta siempre en el topbar del canvas. Debe ser plegable/convocable, no chrome permanente.
`ChangeReview` es la parte más reutilizable (diff OPD/OPL de una propuesta).

### 2.10 `review/` — revisión compartida (0.33k + 419 CSS)

- `ReviewSharePanel.tsx` (dueño, dentro de un Diálogo): elegir fuentes de la mesa que el
  lector podrá ver, permitir anotaciones, crear enlace `/revision/<token>`, copiar, revocar,
  ver anotaciones y resolverlas ("Marcar atendida" / "Mantener sin cambios" + nota).
- `RevisionReader.tsx` (lector público, sin store ni login): SVG offscreen del OPD elegido,
  OPL del OPD en `<ol>`, fuentes incluidas, anotaciones con resoluciones y formulario para
  anclar una observación a modelo/OPD/elemento/estado/relación.
- `review.css` — BEM propio con variables de `index.html`.

Valor: importante (READ-01..04). Calidad razonable. Duplica ~70 % de `PortableReaderPage`.

### 2.11 `portable/` + `portable-reader/` + `sw.js` — paquete portátil (0.41k + 159 CSS + 85 SW)

- `PortablePackagePanel.tsx` — exporta la **revisión de trabajo abierta** como
  `*.opforja.json` (formato `opforja.portable-package` v1), con consentimiento explícito por
  fuente de la mesa; lista piezas externas omitidas (submodelos y anclajes de biblioteca con
  locators `opforja://…`); "Abrir en lector portable" (guarda bytes en Cache Storage y
  navega); "Preparar lector sin conexión".
- `PortableReaderPage.tsx` — abre archivo (≤40 MB) o `?package=<id>` desde Cache Storage;
  muestra perfil, huella verificada, selector de revisión y de OPD, SVG + OPL, fuentes
  incluidas/omitidas; guarda copia local, descarga original.
- `src/portable-reader/sw.js` — service worker con scope `/portable-reader/`; cachea el shell
  **al final** (si falla un recurso queda el shell anterior); valida lista blanca desde
  `asset-manifest.json` generado por `portableReaderPlugin` en `vite.config.ts`.
- `app/portable-reader/index.html` — segunda entrada Vite; título "Lector portable ·
  OpForja", sin las variables `:root` de `index.html` (el CSS define su propia paleta
  `--portable-*`, verde-gris, distinta de Codex).

Valor: importante (A18, autonomía del documento). Ingeniería sólida (SW, límites, integridad),
pero el "ciclo" guardar-en-cache-y-navegar y "preparar sin conexión" son dos botones que el
usuario no necesita distinguir. Candidato a fusionarse con el lector de revisión en un único
**Lector**.

### 2.12 `reuse/` — piezas reutilizables (0.2k)

`PieceProposalAction.tsx`: cargar un OPM JSON fuente (≤1 MiB), elegir pieza (entidad no
atributo), declarar función, acción (copiar con identidad propia / referenciar solo lectura /
proponer actualización de referencia), raíz propia del documento, incluir cambio de frontera;
prepara propuesta y la revisa con `ChangeReview`. Es el **tercer** mecanismo de reutilización
junto a **Biblioteca/Anclaje/Drift** (`SeccionAnclaje`, `CintaBiblioteca`) y **Submodelos**
(`SM sync/out/off/cold`, `PanelExtensiones`). Los tres comparten objetivo (reutilizar
fragmentos con identidad y procedencia) con vocabularios, flujos y tipos distintos.

### 2.13 `app/index.html`

Título "Modelador OPM" (el wordmark dice "Opforja"; el lector "OpForja"). Bloque `<style>`
con 34 variables `:root` "históricas" reexpresadas en tinta/papel/crimson Codex y 9 clases
utilitarias. Uso verificado: **23 variables sin ninguna referencia** (`--ocre*`, `--bosque*`,
`--terracota*`, `--warning*`, `--success*`, `--destructive`, `--paper-02`, `--ink-90`…) y
solo `.opm-label-uppercase` se usa (45 veces); `.opm-weight-*`, `.opm-hairline`,
`.opm-chrome-line` no. Alias semánticos colapsados (`--warning` = `--ocre` = crimson;
`--accent-soft` = papel) indican un sistema de tokens heredado vaciado. Aporta valor real:
`box-sizing`, `overflow:hidden` del body, `overscroll-behavior-x:none` (evita el swipe-back
de macOS sobre el canvas), fuente base, `:focus-visible` crimson.

---

## 3. Reglas OPM codificadas en la UI (catálogo)

Leyenda: **K** = la regla también vive en el kernel (la UI solo la refleja); **U** = solo en la
UI (riesgo: una reescritura que la omita la pierde); **D** = divergencia con el kernel/canon.

### 3.1 Cosas y propiedades genéricas

| Regla | Ubicación | Tipo |
|---|---|---|
| Esencia ∈ {informacional, física}; afiliación ∈ {sistémica, ambiental} | `inspector/SeccionEsenciaAfiliacion.tsx:26-27` | K |
| Linealidad (copiable/lineal) solo para objetos; extensión "capa categorial F1", no ISO | `InspectorEntidad.tsx:575`, `modelo/tipos/entidad.ts:144-145` | K (extensión) |
| Una cosa puede tener varias apariencias; editar afecta todas ("Aparece en N OPDs… Los cambios afectan a todas") | `InspectorEntidad.tsx:501-508`, `inspector/aparicionesUtils.ts` | U (presentación de la distinción entidad/apariencia) |
| Alias, URLs, imagen solo en objetos | `InspectorEntidad.tsx:519` | U |
| Atributo = objeto exhibido por su portador; no se anida slot sobre slot ("+ Atributo" solo si objeto y no atributo derivado) | `InspectorEntidad.tsx:538-566` | K/U |
| Slot de valor: tipos integer/float/char/string; modo numérico de simulación solo si integer/float | `inspector/SeccionAtributo.tsx:35-40,57` | K |

### 3.2 Estados

| Regla | Ubicación | Tipo |
|---|---|---|
| Estados solo aplican a objetos | `InspectorEntidad.tsx:577`; `toolbar/ToolbarBase.tsx:224`; kernel `modelo/operaciones/estados.ts:81,120` | K |
| Un objeto con estados tiene al menos dos; crear estados crea dos; eliminar exige > 2 | UI `inspector/InspectorEstado.tsx:58` (todos), `inspector/SeccionLayoutEstados.tsx:101` (**solo visibles**); modal "requiere al menos dos estados visibles" `inspector/ModalCrearEstados.tsx:80`; kernel `estados.ts:85,121,165-166` | K + **D** |
| Designaciones {inicial, final, default, current}; default y current mutuamente excluyentes | `inspector/SeccionDesignaciones.tsx:19,27-29`; kernel `modelo/estadosDesignaciones.ts:14-26` | K |
| Suprimir estado prohibido si tiene enlaces incidentes | `inspector/SeccionLayoutEstados.tsx:100,118`; kernel `estadosDesignaciones.ts:44` | K |
| Nombre de estado: sin caracteres de control, ≤200, único sin distinción de mayúsculas por objeto | `inspector/previewEstadosOpl.ts:40-63`; kernel `validarNombreEstado` en `modelo/operaciones/estados.ts` | K (duplicada) |
| Oración OPL de estados: canon `X puede estar \`a\` o \`b\`.` (ser/estar §1.5) | canon en `opl/generadores/duracionMetadata.ts:67-69`, parser `opl/parser/parsear.ts:159`; UI **divergente** `inspector/previewEstadosOpl.ts:22,35` y `panelOpl/EditorOplHonesto.tsx:94-97` | **D** |
| Duración asociada a estado | `inspector/SeccionDuracion.tsx` | K |
| Orden de estados reordenable (↑/↓) | `inspector/InspectorEstado.tsx:55-57,137-140` | K |
| Layout de estados horizontal/vertical (solo si >1 estado) | `inspector/SeccionLayoutEstados.tsx:44,89-96` | U (presentación) |

### 3.3 Enlaces

| Regla | Ubicación | Tipo |
|---|---|---|
| Familia procedural = agente, instrumento, consumo, resultado, efecto, invocación, excepciones sobretiempo/subtiempo/sub-sobretiempo | `inspectorEnlace/SeccionMultiplicidad.tsx:117-127` | U (hay constantes afines en `modelo/constantes`) |
| Modificadores solo en procedurales; condición y evento **no** se ofrecen en `resultado` salvo legado (SSOT-OPL §7) | `SeccionMultiplicidad.tsx:42,148-155` | U |
| Modificador NO (negación) no se ofrece en invocación | `SeccionMultiplicidad.tsx:51` | U |
| Subtipo por modificador: condición→C, evento→E, no→¬ | `SeccionMultiplicidad.tsx:135-161` | U |
| Probabilidad de evento ∈ [0,1] con sintaxis `0(.d+)` o `1(.0+)` | `SeccionMultiplicidad.tsx:129-133` | U |
| Demora solo en invocación | `SeccionMultiplicidad.tsx:81-86` | U |
| Multiplicidad con gramática canónica | UI usa `modelo/operaciones/enlaces.ts:53-57` (sin `?`); anuncia `?` en `SeccionMultiplicidad.tsx:111-112`; otra regex acepta `?` en `modelo/enlaceMultiplicidad.ts:7,14` | **D** |
| Extremo a estado solo en procedurales, sobre objetos con ≥2 estados | `inspectorEnlace/SeccionExtremos.tsx:107-121` | U/K |
| Sección de extremos visible para procedurales y estructurales fundamentales; fan solo procedurales; reasignación estructural valida misma clase OPM (agregación/generalización/clasificación) | `SeccionExtremos.tsx:21-34` (comentario remite a `validarFirmaEnlace`) | K |
| Abanico: XOR = exactamente una rama; O = al menos una; ramas comparten puerto | `inspectorEnlace/SeccionAbanico.tsx:79-82` | K |
| Probabilidades de XOR: cada rama 0–100 %, todas completas, suma 100 % | `SeccionAbanico.tsx:182-219` | U |
| Abanico heredado se edita solo en su OPD propietario | `SeccionAbanico.tsx:84-88` (`puedeEditarAbanicoEnOpd` en kernel) | K |
| Etiqueta inversa solo en etiquetado bidireccional; tasa/tiempos según `enlaceAdmite*` | `inspectorEnlace/SeccionMetadatosOpcloud.tsx:33-90` | K |
| Ruta etiquetada solo si `enlaceAdmiteRuta` | `inspectorEnlace/SeccionRuta.tsx:15` | K |
| Tipos de enlace legales entre origen/destino en el menú de relación | `toolbar/ToolbarCreacion.tsx:208-216` → `MenuTipoEnlace` (fuera del área) | K |

### 3.4 Refinamiento y OPD

| Regla | Ubicación | Tipo |
|---|---|---|
| Descomposición (in-zoom) y despliegue (unfold) son ortogonales: una cosa puede tener ambos | `inspector/SeccionRefinamiento.tsx:115-133` | K |
| Despliegue exige relación estructural: agregación (partes), exhibición (atributos), generalización (especializaciones), clasificación (instancias) | `inspector/SeccionRefinamiento.tsx:16-21`; `codex/CodexSelectionAnnotation.tsx:376-377,458-470` | K |
| Todo refinamiento nuevo exige pregunta guía no vacía (método Forja; no forma parte del OPL) | `codex/CodexSelectionAnnotation.tsx:377,476-489`; `codex/CodexCanvasMount.tsx:104-108` | U (regla de método, no ISO) |
| Enlaces externos derivados del in-zoom se reasignan a subprocesos internos (solo descomposición de procesos) | `inspector/SeccionRefinamiento.tsx:128,143-156`; `inspectorEnlace/SeccionReanclaje.tsx:50-80` | K + **D** (geometría) |
| Auto-invocación solo para procesos; una por OPD | `inspector/SeccionRefinamiento.tsx:134-138` | K |
| Plegado parcial/completo de partes, semiplegado estructural (patrón OPCloud) y "traer agregaciones del in-zoom" | `inspector/SeccionRefinamiento.tsx:52-109` | K |
| OPD raíz (SD) no se elimina; OPD con hijos no se elimina hasta eliminar descendientes | `arbol/NodoOpd.tsx:62-66,199` | K/U |
| Tipo de OPD: raíz / in-zoom / unfold según refinador | `arbol/badges.ts:93-97,127-130` | K |
| Clase del OPD activo: "OPD raíz" / "Boceto no integrado" / "OPD integrado" | `codex/CodexCanvasMount.tsx:36-44` | K (`esOpdSuelto`) |
| Proyección "Hoja" de la raíz en apuntes (display-only, R-OPD-REF-15) | `arbol/badges.ts:40-42`, `arbol/NodoOpd.tsx:58-59` | U (regla Forja) |
| Adopción de boceto: integrar un OPD suelto como refinamiento de una cosa del OPD padre | `codex/CodexSelectionAnnotation.tsx:355-491` | K |
| Vista derivada (generic-view) sin semántica de refinamiento, posiblemente solo lectura | `arbol/badges.ts:104-111`; `reuse/PieceProposalAction.tsx:46` | K |

### 3.5 OPL

| Regla | Ubicación | Tipo |
|---|---|---|
| Convención tipográfica: objeto `**negrita**`, proceso `*itálica*`, estado `` `código` `` | `panelOpl/RenderToken.tsx:167-177`; piel en `codex/oplTipografia.tsx` | K |
| Ayuda del editor contradice la convención (estados en itálica, "puede ser") | `panelOpl/EditorOplHonesto.tsx:88-97` | **D** |
| Familias OPL no editables desde texto (abanicos, eventos, condiciones, excepciones) se declaran, no se simulan | `panelOpl/EditorOplHonesto.tsx:29-45,99-108` | K (declaración de soporte) |
| Alcance del OPL: modelo completo vs OPD local, explícito | `panelOpl/dataFlow.ts:25-36`, `panelOpl/Bloques.tsx:36-43` | U |
| En apuntes, OPL emite placeholders (excepción a R-ENT-2) | `mobile/VistaBusquedaLectura.tsx:47-83` | K |

---

## 4. Contratos que la reescritura debe respetar o migrar

### 4.1 Tipos del modelo consumidos/escritos por estas superficies

Citados textualmente (contrato persistido en JSON):

```ts
// modelo/tipos/estado.ts:12,22-43
export type DesignacionEstado = "inicial" | "final" | "default" | "current";
export interface Estado {
  id: Id; entidadId: Id; nombre: string;
  esInicial?: boolean; esFinal?: boolean;          // legado, fusionado con designaciones
  designaciones?: DesignacionEstado[];
  duracion?: DuracionTemporal; suprimido?: boolean;
  width?: number; height?: number; x?: number; y?: number;   // geometría en el tipo semántico
  orden?: number;
}
// modelo/tipos/apariencia.ts:13
export type LayoutEstados = "horizontal" | "vertical";

// modelo/tipos/modelo.ts:67-78  (ficha editada por SeccionFichaTrabajo)
export interface FichaTrabajo {
  preguntaHabilitante?: string; duenoSignificado?: string; responsableDecision?: string;
  tiposModelo?: TipoModelo[]; criterioSuficiencia?: string; vidaUtil?: VidaUtilModelo;
  revisarCuando?: string; modalidad?: ModalidadDocumento;
  historialModalidad?: CambioModalidadDocumento[]; revisionesHumanas?: RevisionHumanaDocumento[];
}
```

Campos del `Modelo` que estas superficies leen/escriben y que no son OPM nuclear
(`modelo/tipos/modelo.ts:89-120`): `abanicos`, `satisfaccionesRequisito`, `anclasNormativas`,
`notasMesa`, `mesaExploracion` (fuentes), `procedencia` (sello), `fichaTrabajo`,
`lentesConocimiento`, `submodelos`, `pieceLineage`, `versiones`. Una reescritura debe al
menos **leerlos sin pérdida** (importación), aunque retire su UI.

Duplicaciones de contrato a migrar: `esInicial/esFinal` vs `designaciones`
(`modelo/estadosDesignaciones.ts:58-65` los fusiona); requisitos satisfechos como texto libre
en el enlace vs `SatisfaccionRequisito`; multiplicidad con dos gramáticas.

### 4.2 Paquete portátil (`serializacion/portablePackage.ts`)

```ts
export const PORTABLE_PACKAGE_FORMAT = "opforja.portable-package" as const;   // :5
export const PORTABLE_PACKAGE_VERSION = 1 as const;                            // :6
export const PORTABLE_READER_PROFILE = { id: "deep-opm-pro.modelo", version: "deep-opm-pro.modelo.v0" } as const;
export const PORTABLE_PACKAGE_MAX_BYTES = 40 * 1024 * 1024;  // fuentes: 1 MiB c/u, 10 MiB total, ≤50 revisiones, ≤200 fuentes
export interface PortablePackageData {
  manifest: { packageId: string; createdAt: string; selectedRevisionId: string };
  profile: PortableReaderProfile;
  revisions: PortablePackageRevision[];   // { id, modelJson, label, selectedOpdId, modelId, createdAt, views:{selectedOpdId, opdIds} }
  sources: { included: PortableIncludedSource[]; omitted: PortableOmittedSource[] };
}
export type PortablePackageReadResult =
  | { kind: "ready"; package; revisions: PortableRevisionView[]; originalBytes; integrity: "verified" }
  | { kind: "unsupported-profile"; originalBytes; integrity: "verified"; message }
  | { kind: "unsupported-version" | "unsupported-format"; originalBytes; integrity: "unverified"; message };
```

`PortableIncludedSource` lleva `contentSha256` y `authorization: "human-authorized"`; el
creador rechaza incluir una fuente sin `authorizedByUser: true` o con contenido distinto al del
modelo. Locators internos: `opforja://mesa-exploracion/<id>`,
`opforja://modelo/<modelId>/submodelo/<refId>`, `opforja://biblioteca/<modelId>/pieza/<pieceId>`.
Almacenamiento local: Cache Storage `opforja-portable-packages-v1`; shell del lector
`opforja-portable-reader-shell-v1`; manifiesto `/portable-reader/asset-manifest.json`
`{version:1, urls:[...]}`; mensaje SW `{type:"CACHE_READER_ASSETS", manifest}` con respuesta
por `MessagePort` `{ok, cachedCount}|{ok:false,error}`.

### 4.3 Revisión compartida (`modelo/review.ts`, `persistencia/reviewClient.ts`)

```ts
export type ReviewAnchor = { kind: "model" } | { kind: "opd" | "entity" | "state" | "link"; id: string };
export interface ReviewAnnotation { id; shareId; documentId; revision: number; anchor: ReviewAnchor; text;
  actorId; actorLabel; actorKind: "reader" | "operator"; createdAt; resolutions: ReviewResolution[] }
export interface ReviewResolution { id; actorId; actorLabel; at; revision; outcome: "addressed" | "kept"; note; anchorPresent: boolean }
export interface ReviewShareOwnerView { id; documentId; revision; source: "saved" | "autosave"; modelName; createdAt;
  revokedAt: string | null; permissions: { annotate: boolean }; includedSources: Array<{ id; title }> }
```

HTTP (`ROOT = "/__deep-opm/review"`):
- Lector público: `GET /__deep-opm/review/<token>` → `ReviewReaderView`;
  `POST /__deep-opm/review/<token>/annotations` `{anchor, text}` → `{annotation}`.
- Dueño: `GET /grants?documentId=`; `POST /grants` `{documentId, includedSourceIds, annotate,
  expectedRevision, expectedWorkingCopyHash}` → `{share, token}`; `GET /grants/<id>?documentId=`;
  `DELETE /grants/<id>?documentId=`; `POST /grants/<id>/annotations/<aid>/resolve?documentId=`.
- Ruta de UI: `/revision/<token>` (nginx `deploy/nginx.conf:124` la sirve sin logs de acceso).
  El dueño hace `flushDocumentOperations` antes de compartir para fijar base y hash.

### 4.4 Agente (`persistencia/agentClient.ts`, `ROOT = "/__deep-opm/agent"`)

`GET /status`, `GET|POST /tasks`, `GET /tasks/<id>`, `POST /tasks/<id>/{instructions,continue,stop,presence}`,
`GET /tasks/<id>/events?after=` (SSE), `GET /changes/<id>`, `POST /changes/<id>/{prepare,undo,reapply,grants,commit}`,
`GET /changes/<id>/receipt`. Autoría humana preparada: `/__deep-opm/agent/<route>`
(`persistencia/humanChangeClient.ts:13`) usada por "Proponer refinamiento" y "Reutilizar pieza".
Operaciones semánticas que `ChangeReview` describe (`agent/ChangeReview.tsx:206-224`):
`createObject, createProcess, createState, renameEntity, renameState, createProceduralLink,
deleteLink, deleteState, deleteEntity, createRefinement, createXorExclusion, copyPiece,
connectPieceReference, replaceSubmodelReference` — es el vocabulario del contrato común de
operaciones (`modelo/changes/types.ts`), valioso para la reescritura.

### 4.5 Contratos implícitos de DOM/eventos (a no copiar sin decidir)

- Eventos `window`: `opm:menu-contextual-enlace` `{enlaceId,x,y}`, `opm:menu-contextual-estado`
  `{estadoId,entidadId,x,y}`, `opm:inspector-abrir-colapso` `{key}`; `contextmenu` global en
  captura que lee `model-id`/`data-model-id` de celdas JointJS y `prop("opm")` del grafo.
- Atributos: `data-colapso-key`, `data-atajos-local`, `data-atajos-contexto="canvas|panel-opl"`,
  `data-opl-ordinal`, `data-opl-token="entidad:<id>"`, `data-ifml-*`, `data-tutor-*`.
- Almacenamiento: `sessionStorage opm.inspector.colapso.*`; `localStorage
  deep-opm.mobile.busqueda.incluirDiagnostico`; preferencias del tutor en `localStorage`.
- `data-testid`: ~165 en los cinco subdirectorios mayores; 13 comentarios condicionan la forma
  de la UI a "preservar e2e/testIds inmutables". 76 specs e2e / 16k líneas dependen de ellos.

---

## 5. Flujos principales

1. **Seleccionar → actuar.** Clic en canvas o token OPL → store fija la selección → la
   anotación Codex se posiciona bajo/sobre el bbox (flip si no cabe) con acciones
   pertinentes; el Inspector muestra la ficha; el panel OPL resalta y hace scroll a la primera
   oración que toca el referente (`PanelOpl.tsx` efecto `seleccionRef`); hover en OPL resalta en
   canvas (`fijarHoverOpl`). Simetría OPD↔OPL genuina y bien lograda.
2. **Crear cosa.** Toolbar O/P (clic = insertar; Shift+clic = inserción continua; arrastre al
   canvas) → `nuevaCosaPendiente` → modal "Nombre" de `ToolbarBase` → confirmación.
3. **Crear estados (dos caminos).** (a) Toolbar "Estado"/anotación "estado" →
   `agregarEstadoSmart` crea `estado1/estado2` o `estadoN` con cola de renombrado inline;
   (b) Inspector "Agregar estados"/"+ estado" → `ModalCrearEstados` exige nombres reales y
   muestra una vista previa OPL (con plantilla divergente). Mismas reglas, UX distinta.
4. **Refinar (dos caminos).** (a) Anotación "descomponer/desplegar" → `refinamientoPendiente`
   → `FormularioRefinamiento` (pregunta guía, relación si despliegue) → crea y abre el OPD
   hijo; (b) `DocumentActions › Proponer refinamiento…` → diálogo → propuesta vía servidor →
   `ChangeReview` → incorporar. El segundo requiere documento guardado y backend.
5. **Editar OPL como texto.** Panel OPL › editar → textarea con el OPL → parser reverso →
   clasificación aplicable/sin cambio/no aplicable con razón y cita → "Aplicar N cambios".
6. **Compartir revisión.** Acciones › Compartir revisión… → elegir fuentes, anotaciones →
   enlace `/revision/<token>` → lector público anota con ancla → dueño resuelve.
7. **Paquete portátil.** Acciones › Paquete portátil… → consentimiento por fuente →
   descargar `.opforja.json` o abrir en `/portable-reader/?package=<id>` → lector offline.
8. **Encargo al agente.** IntentBar → alcance/autoridad → tarea → eventos SSE → propuesta →
   ver cambios (diff OPD/OPL) → incorporar / deshacer / reaplicar; detener/continuar/ampliar
   presupuesto; conflictos locales con descarga del borrador.
9. **Anclaje/drift.** Cosa anclada a pieza de biblioteca → drift calculado → sección
   "Anclaje" se abre sola si diverge → Re-sincronizar (acepta firma nueva) o Soltar (copia
   propia, reversible con Ctrl+Z inmediato).

---

## 6. Acoplamientos relevantes

- **UI ↔ store directo** en secciones pese a la capa viewmodel (ver 2.1).
- **UI ↔ render JointJS**: `ToolbarBase` lee `adapter.graph.getCell(id).prop("opm")`;
  `CodexSelectionAnnotation` usa `paper.findViewByModel`, eventos `render:done scale translate
  transform resize` y localiza contenedores por `closest('[data-testid="canvas-pane"]')` y
  `[aria-label="OPD activo"]`. El overlay depende de testids y aria-labels como selectores.
- **UI ↔ tutor**: 8 archivos del área invocan `runTutorPolicy(derive*Intent(...))` en cada
  render y renderizan `TutorInterventionDetails`; 18 atributos `data-tutor-*`. El tutor
  (`src/tutor`, 5.850 l.) arbitra "candidatos" y "claims de superficie" para mostrar un texto
  `now/criterion/fundamento`.
- **Acciones de documento ↔ agente**: `DocumentActions` recibe `operations` del
  `AgentWorkbench` por render-prop; sin puerto de agente, "Proponer refinamiento" y
  "Reutilizar pieza" quedan deshabilitados aunque no sean agénticos.
- **Estilos**: tres paradigmas simultáneos — objetos de estilo inline con `tokens` (dos
  vocabularios: Codex `ink/paper/rule` y legado `textoPrimario/fondoCard/bordeIntermedio`
  aliasados en `tokens.ts:78-137`), CSS con variables de `index.html` (`review.css`,
  `toolbar.css`, `arbol.css`) y CSS con paleta propia (`portable.css`). Selectores CSS por
  `data-testid` (`toolbar.css:13-41`).
- **Comentarios como gobierno**: cabeceras con "Ronda Codex v1 · L2", "BUG-2026…", "C′·A (M-4)",
  "W6.5-b", "V-202", "[JOYAS §1-3]" en casi todos los archivos: historia de proceso en el
  código, no explicación de comportamiento.

---

## 7. Olores de sobreingeniería, lastre y duplicación (con ejemplos)

1. **Código muerto verificable**: `toolbar/ToolbarMas.tsx` (352 l.),
   `toolbar/ToolbarMapaSistema.tsx`, sus viewmodels/puerto y ~37 referencias de store;
   `codex/CodexFooterKey.tsx`, `codex/CodexInspectField.tsx`; `CodexStateRow.flags` (siempre
   `[]`); `accionesDeContexto`, `modoMarginaliaCodex`, `GLIFOS_CODEX`, `estiloKbdCodex`,
   `accionDropDesdeEvento`, `puedeAceptarDrop`, `cuentaObjetos/Procesos/Enlaces`,
   `estadoVitrinaDelStore` (solo tests); 16+ claves de `toolbarStyles.ts`; rama `"carga"` y
   ~17 callbacks de `PanelCarpetas`; botón "AI Text" tras flag `false`; 23 variables y 8 clases
   de `index.html`.
2. **Dos de todo**: barra de selección (Codex vs `BarraHerramientasElemento`); shells móviles
   (lectura vs edición); creación de estados; refinamiento (directo vs propuesta); disclosure
   (`FichaSeccion` colapsable vs `SeccionDisclosure`); `enfocarSeccionInspector`;
   `refinadorDeOpd`; `identificadorInspector` vs `identificadorCanonicoEntidad`; indicador de
   persistencia ("● Auto" + chip de persistencia + `DocumentPersistenceStatus` en la barra de
   acciones + meta "● sin guardar" del header: **cuatro** señales de guardado); anotación
   (notas de mesa vs anotaciones de revisión); requisitos satisfechos (texto vs estructurado).
3. **Tres lectores** con la misma estructura (selector de OPD, SVG offscreen como data-URI,
   `<ol>` de OPL, fuentes en `<details>`): `PortableReaderPage`, `RevisionReader` y la pestaña
   Diagrama/OPL de `MobileReadonlyApp` (esta con canvas vivo). Tres CSS distintos.
4. **Tres mecanismos de reutilización** (Anclaje/biblioteca/drift, Submodelo SM, Pieza
   copy/reference/update) con tres vocabularios.
5. **Tutor como infraestructura transversal**: para mostrar un párrafo de ayuda cada sección
   construye un `intentId` (a veces con `JSON.stringify` de todas las líneas OPL:
   `PanelOpl.tsx` `firmaLineas`), llama al árbitro y propaga `data-tutor-*`. En
   `SeccionFichaTrabajo` se rastrea el "último cambio" para que el tutor pueda comentar
   (`:54-92`).
6. **Trazabilidad de diseño en el DOM**: `data-ifml-view-component/pattern/master/…`
   (`panelOpl/dataFlow.ts`), `data-ifml-event="SelectEvent"` en filas de enlaces.
7. **Burocracia de pipeline externo en la UI general**: anclas normativas, registro
   [RATIFICAR], "Copiar LogDecisiones v0", sello de procedencia con `protoHash`, ficha de
   trabajo de 9 campos con historial de modalidad y revisiones humanas. Solo tienen sentido
   para modelos producidos por el compilador de autoría KORA.
8. **Forma dictada por tests**: listas paralelas en `SeccionLayoutEstados` para conservar
   rol+nombre; `<div data-testid="inspector-entidad-acciones" />` vacío para procesos
   (`InspectorEntidad.tsx:257`); badges que no cambian de texto porque Playwright clicaría
   otro nodo (`arbol/badges.ts:85-92`).
9. **Chrome permanente sobre el canvas** (§0.5) y header con 6 columnas.
10. **Toolbar con responsabilidades ajenas** (menús contextuales globales, modal de nombre,
    diálogo traer conectados) y listeners `window` `click` para cerrar menús registrados tres
    veces.
11. **Micro-memoria innecesaria**: nudge de anchor con `Map` de módulo y límite de 5.
12. **Hacks de teclado**: `reenviarUndoGlobalDesdeControl` (re-despacha Ctrl+Z desde
    selects/checkboxes, `SeccionFichaTrabajo.tsx:300-319`) y `reenviarComboGlobalDesdeInput`
    en `InspectorEntidad`: síntoma de un sistema de atajos que no distingue foco.
13. **Lógica de dominio en la UI**: `listarEnlacesEntidad`, `contextoReanclaje` (geometría),
    `filasTextualesDesdeTexto` (pesos de simulación), `modeloEditorProbabilidadesAbanico`,
    `describirDecision`, `detalleContratoPuertoEnlace`. Son consultas puras que deberían vivir
    en `modelo/` (o en viewmodels testeados) para servir también a OPL, agente y lectores.

---

## 8. Defectos y riesgos observados (no verificados en navegador salvo indicación)

| # | Hallazgo | Evidencia | Severidad |
|---|---|---|---|
| D1 | Ayuda del editor OPL enseña una forma que el parser no reconoce como estados | `panelOpl/EditorOplHonesto.tsx:94-97` vs `opl/parser/parsear.ts:159` | alta (enseña OPM incorrecto) |
| D2 | Vista previa OPL del modal de estados no coincide con la oración generada | `inspector/previewEstadosOpl.ts:22,35` vs `opl/generadores/duracionMetadata.ts:69` | media |
| D3 | Multiplicidad `?` anunciada pero rechazada | `inspectorEnlace/SeccionMultiplicidad.tsx:111-112` vs `modelo/operaciones/enlaces.ts:53` | media |
| D4 | Regla de mínimo de estados inconsistente entre inspector de estado y lista de estados | `inspector/InspectorEstado.tsx:58` vs `inspector/SeccionLayoutEstados.tsx:101` | baja |
| D5 | Subprocesos del in-zoom inferidos por contención geométrica | `inspectorEnlace/SeccionReanclaje.tsx:57-61,79-81` | media (semántica desde layout) |
| D6 | "Editar alias" desde menú contextual no abre el disclosure plegado | `toolbar/ToolbarBase.tsx` `enfocarSeccionInspector` sin `abrirSeccionesDe` | baja (plausible) |
| D7 | Rótulo de identidad distinto entre canvas (`identificadorCanonicoApariencia`) e inspector | `inspector/identificador.ts` vs `render/jointjs/composers/entidad.ts:363-389` | baja |
| D8 | Inspector de estado muestra id crudo `s-12`; entidad muestra `o.11` | `inspector/InspectorEstado.tsx:126` | cosmético |
| D9 | Código de OPD derivado del nombre por regex; nombres libres pierden la jerarquía | `arbol/NodoOpd.tsx:237-243` | media |
| D10 | Lector portátil usa paleta propia distinta de Codex; tres títulos de producto distintos | `portable/portable.css:3-6`, `index.html`, `portable-reader/index.html` | cosmético |
| D11 | Búsqueda móvil: hits OPL/issues sin acción | `mobile/VistaBusquedaLectura.tsx:91,108` | baja |
| D12 | Icono de estado en toolbar es un rombo | `toolbar/ToolbarBase.tsx:84-103` | cosmético (gramática visual) |

---

## 9. Recomendación por pieza

| Pieza | Decisión | Justificación |
|---|---|---|
| Inspector XOR estado/entidad/enlace/vacío | **keep** | Modelo mental correcto; simple. |
| `FichaSeccion` + `SeccionDisclosure` + `useColapso` | **simplify** | Un solo componente `Seccion` plegable con memoria; sin eventos `window` (pasar "abrir" por estado/props o `id` + `<details>`). |
| `identificador.ts` | **cut** | Usar una única función del kernel para canvas, inspector y OPL. |
| Descripción, Esencia/Afiliación, Designaciones, Duración, InspectorEstado | **keep** | Núcleo OPM; componentes pequeños y claros. |
| Linealidad | **keep (como extensión marcada)** | Extensión del kernel con checkers; mostrar solo si el perfil la activa. |
| `SeccionLayoutEstados` + `ModalCrearEstados` + `previewEstadosOpl` | **simplify** | Un único flujo: "+ estado" crea con nombre propuesto y renombrado inline (o modal) usando la **misma** oración que `opl/`; validación solo del kernel; una sola lista con flags por fila. |
| `SeccionAtributo` | **simplify** | Mantener slot (tipo, valor, unidad); mover simulación a una sección "Simulación" separada y el parser de pesos al kernel; unidad en un solo lugar. |
| `SeccionRefinamiento` | **simplify** | Mantener estado de in-zoom/unfold, auto-invocación, reasignación; agrupar plegados en "Presentación del refinamiento"; reducir 23 props con un viewmodel. |
| `SeccionEnlaces`, `SeccionApariciones` | **keep** (mover consultas al kernel) | Navegación semántica útil; `aparicionesUtils` de buena calidad. |
| `SeccionTamano`, `SeccionImagen`, `SeccionUrls` | **simplify** | Plegar en "Presentación/Metadatos"; tamaño se gestiona mejor en canvas. |
| `SeccionRequisitos` + "Satisfied textual" | **simplify** | Una sola representación estructurada de requisitos; ocultar si el modelo no usa el estereotipo. |
| `SeccionAnclaje` + `anclajePresentacion` | **simplify** | Conservar el copy honesto; fusionar con el modelo único de reutilización. |
| `SeccionAnclas`, `SeccionRegistroRatificar`, sello de procedencia | **cut del núcleo** (plugin/import) | Pipeline KORA específico; conservar datos en JSON e importar/exportar sin UI permanente. |
| `SeccionNotasMesa` | **simplify** | Fusionar con anotaciones/comentarios anclados (mismo `ReviewAnchor`). |
| `SeccionFichaTrabajo` | **cut** (o reducir a "Propósito del modelo": pregunta + modalidad) | Método Forja; 9 campos + historial + tutor no son OPM y pesan en cada modelo. |
| `SeccionMultiplicidad` (+ etiqueta) | **keep** | Reglas de modificadores valiosas; corregir D3 y mover `enlaceProcedural` al kernel. |
| `SeccionExtremos` + `detalleContratoPuerto` | **simplify** | Mantener extremo a estado y "crear fan"; ocultar detalle de puerto/hora como vista avanzada. |
| `SeccionAbanico` | **keep** | XOR/OR y política de decisión claros; mover validación de probabilidades al kernel. |
| `SeccionReanclaje` | **simplify** | Derivar subprocesos por semántica (`contextoRefinamiento`), no geometría. |
| `SeccionRuta`, `SeccionMetadatosOpcloud` | **keep/simplify** | Útiles para excepciones y rutas; "tasa" y "satisfied" bajo "Avanzado". |
| `CodexFrame`, `CodexColHeader` | **simplify** | Layout adaptable: índice y propiedades convocables, no tres columnas fijas (spec §5). |
| `CodexCanvasMount` | **simplify** | Mantener kicker y zoom; pregunta guía como dato del OPD visible en el inspector del OPD, no como franja fija. |
| `CodexSelectionAnnotation` | **keep (núcleo de interacción) / simplify** | Portar el patrón; separar catálogo de acciones (puro) del posicionamiento; extraer `FormularioRefinamiento`; eliminar `BarraHerramientasElemento`. |
| `oplTipografia`, `CodexOplNote`, `CodexInspectSection/Inline`, `glifos.formatearComboCodex` | **keep** | Primitivas pequeñas y coherentes. |
| `CodexStateRow` | **simplify** | Quitar `flags` muertos o usarlos de verdad (y eliminar la lista paralela). |
| `CodexFooterKey`, `CodexInspectField` | **cut** | Sin consumidores. |
| `ToolbarBase` | **simplify** | Solo creadores + modo; mover menús contextuales al canvas y modal de nombre al flujo de creación; una sola señal de persistencia. |
| `ToolbarCreacion` + `MenuTipoEnlace` | **keep** | Tipos legales por origen/destino = regla OPM visible; quitar nudge con memoria. |
| `toolbarPrimitives` | **keep** | Botón creador accesible con kbd. |
| `ChipRevisionNueva` | **cut o fusionar** | Canal de agente paralelo al de tareas; unificar en un único aviso de "cambios remotos". |
| `ToolbarMas`, `ToolbarMapaSistema`, claves muertas de `toolbarStyles`, `toolbar.css` por testid | **cut** | Muertos / acoplados a tests. |
| `RenderToken`, `Bloques` | **keep** | Núcleo bimodal OPD↔OPL; excelente accesibilidad. |
| `EditorOplHonesto` | **keep** (corregir D1) | Declarar soporte reverso es exactamente la honestidad que pide el canon. |
| Toolbar del panel OPL | **simplify** | Quitar "AI Text"; buscar/filtrar/copiar bastan. |
| `dataFlow.ts` (`data-ifml-*`) | **cut** (conservar `atributosAlcanceOpl`) | Trazabilidad de informe, no producto. |
| Árbol (`NodoOpd`, `badges`, `togglesArbol`, `handlersTeclado`) | **keep / simplify** | Excelente base accesible; derivar código de OPD de la jerarquía; unificar `refinadorDeOpd`; quitar conteos muertos. |
| `MobileReadonlyApp` + vistas | **simplify** | Un único lector responsive (ver abajo) sirve teléfono; eliminar el shell móvil editable o dejarlo explícitamente fuera de alcance. |
| `panelCarpetas/` | **simplify** | Un único navegador de carpetas para abrir y guardar; quitar props muertas. |
| `AgentWorkbench` + `IntentBar` + `TaskActivity` | **simplify** | Panel convocable (atajo / botón) en vez de topbar permanente; separar `DocumentActions` del puerto del agente. |
| `ChangeReview` | **keep** | Diff OPD/OPL de propuestas: sirve a agente, refinamiento propuesto, piezas y revisión. |
| `RefinementProposalAction` (fuera del área) | **cut o fusionar** | Duplica el refinamiento directo; mantener solo si aporta revisión humana previa en un flujo explícito. |
| `ReviewSharePanel` + `RevisionReader` | **keep (fusionar lector)** | Capacidad READ-01..04; unificar lector con el portátil. |
| `PortablePackagePanel` + `PortableReaderPage` + `sw.js` + plugin Vite | **keep (fusionar lector)** | Autonomía del documento bien resuelta; reducir botones ("Descargar" y "Abrir"). |
| `PieceProposalAction` | **simplify** | Converger en un único modelo de reutilización (pieza con identidad, versión, frontera) que absorba Anclaje y Submodelo. |
| Tutor en secciones | **cut la arbitración** | Sustituir por ayuda contextual estática (`<Ayuda id>` con texto y fuente) en los pocos puntos donde enseña OPM (refinamiento, estados, OPL reverso). |
| `index.html` `<style>` | **simplify** | Conservar reset/overscroll/focus/fuentes; generar variables desde `tokens` (una fuente); título coherente. |
| `portable-reader/index.html` | **keep** | Entrada separada necesaria para el SW con scope propio. |

---

## 10. Piezas de alta calidad para portar casi tal cual

1. `panelOpl/RenderToken.tsx` — mapeo token→elemento semántico, edición inline Enter/F2/Escape,
   `aria-keyshortcuts`, doble clic sobre verbo abre el enlace.
2. `panelOpl/EditorOplHonesto.tsx` (con la ayuda corregida) y su contrato
   `clasificarEdicionOpl` → grupos aplicable/sin cambio/no aplicable con razón y cita.
3. `panelOpl/Bloques.tsx` — agrupación por OPD con profundidad, foco y alcance explícito.
4. `codex/oplTipografia.tsx` — contrato tipográfico objeto/proceso/estado.
5. `inspector/aparicionesUtils.ts`, `inspector/anclajePresentacion.ts` (copy honesto, sin
   culpar a la pieza), `inspector/seccionColapso.ts` (lógica pura y defensiva de storage).
6. `inspectorEnlace/SeccionMultiplicidad.tsx` (`modificadorOfrecido`, `subtiposPermitidos`,
   `probabilidadValida`) y `SeccionAbanico.modeloEditorProbabilidadesAbanico` (llevar al kernel).
7. `arbol/handlersTeclado.ts`, `arbol/togglesArbol.ts`, marcado ARIA de `NodoOpd`.
8. `codex/CodexSelectionAnnotation.posicionarAnotacion` y el cálculo de bbox por vistas DOM
   (`rectClienteDeCeldas`), robusto a zoom/scroll.
9. `agent/ChangeReview.tsx` (descripción de operaciones semánticas + diff OPL por OPD).
10. `src/portable-reader/sw.js` + `portableReaderPlugin` (shell reemplazado al final, lista
    blanca, manifiesto generado) y `readerCache.ts`.
11. `toolbar/toolbarPrimitives.ToolbarActionButton` e indicador canónico de modo de
    `ToolbarCreacion`.

---

## 11. Forma sugerida para la reescritura de estas superficies

- **Una superficie principal**: canvas + OPL coordinados (OPL como columna o bajo el canvas
  según ancho), con **una** anotación de selección como puerta a las acciones; índice de OPDs
  y ficha de propiedades como paneles convocables (no fijos).
- **Ficha de propiedades en cuatro bloques estables**: *Identidad* (nombre, tipo, id canónico,
  descripción), *Semántica OPM* (esencia, afiliación, estados, atributo/slot, refinamiento,
  enlaces), *Presentación* (tamaño, layout de estados, plegados, puertos), *Extensiones*
  (requisitos, reutilización, simulación) mostradas solo si el modelo las usa.
- **Un lector** (`/leer`): fuente = paquete local o revisión compartida; mismo componente para
  teléfono y escritorio; anotaciones ancladas cuando la fuente lo permite.
- **Un modelo de reutilización** (pieza con identidad, versión, frontera, procedencia) con los
  estados sincronizado/divergente/desconectado y las acciones copiar/referenciar/actualizar/soltar.
- **Un indicador de persistencia** (local confirmado / sincronizando / conflicto) en un solo lugar.
- **Agente como panel convocable** que reutiliza `ChangeReview`; acciones de documento
  independientes del puerto del agente.
- **Reglas en el kernel**: toda regla de §3 marcada U o D se mueve a `modelo/` con una sola
  función exportada; la UI solo pregunta "¿qué opciones son legales?".
- **Tokens únicos**: un solo vocabulario (Codex) generado a CSS variables; eliminar alias
  legados y selectores por testid; comentarios que expliquen comportamiento, no rondas.

---

## 12. Límites de este estudio

- No se ejecutó la aplicación ni el navegador; D6, D9 y D11 son inferencias de código.
- No se leyeron en profundidad `BarraHerramientasElemento.tsx`, `DialogoCargarModelo.tsx`,
  `MenuTipoEnlace.tsx`, `ArbolOpd.tsx`, viewmodels ni el tutor: se trataron como fronteras
  del área y se citaron solo donde determinan el comportamiento de estas carpetas.
- La historia Git está consolidada (69 commits; el último, `8ada528`, añadió de golpe
  `agent/`, `review/`, `portable/`, `reuse/` y el lector portátil). La motivación de oleadas
  previas se reconstruyó desde comentarios del código y `docs/specs/opforja-producto-integrado.md`.
- "Muerto" significa sin importador de producción en `src/`, `e2e/` o `scripts/`; algunos
  tienen tests unitarios que habría que retirar a la par.
