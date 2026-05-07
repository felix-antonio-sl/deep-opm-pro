# Auditoría — Refactor radical (steipete)

| Campo | Valor |
|---|---|
| Fecha | 2026-05-07 |
| Operador | Felix |
| Auditor | Claude (steipete persona, Opus 4.7 1M ctx) |
| Punto de corte | `main @ d99382e` post-ronda 12.1 |
| Loop verde verificado | 673 tests / 86 smokes / chunk principal 218.99 kB / 59 kB gzip |
| MVP-α | 98.8% ponderado · única HU residual HU-SHARED-007 diferida ronda 14 |
| Pregunta | ¿conviene refactor radical aprovechando `opm-extracted/` y, si sí, qué pertenece a qué tier? |

---

## 0. Lectura primaria (la única línea importante antes de leer todo)

**La app no necesita refactor radical.** Necesita una ronda 13 quirúrgica
sobre **dos focos** (Toolbar + tokens) y la incorporación de **un único
módulo nuevo destilable de `opm-extracted/`** (methodological-checking).
El resto del código está más sano de lo que sugiere la métrica LOC. Todo
lo demás que parece "deuda" es densidad legítima con cohesión interna
correcta. El roadmap heredado (rondas 13/14) ya lo capta — basta pulir
lo que cae fuera.

Justificación operativa, no retórica, en el resto del documento.

---

## 1. Lectura del estado — qué está sano, qué tiene deuda real, qué solo parece deuda

### 1.1 Sano (no tocar)

- **`canvas/operacionesBatch.ts` 889 LOC**. Cohesión funcional alta,
  todas las funciones operan sobre `Modelo` puro y devuelven
  `Resultado<Modelo>`. Co-residen 3 batches de la ronda 12 + insertar
  plantilla L4 + comandos ronda 11 — pero comparten primitivas
  (`entidadIdDeExtremoLigero`, `aparienciasSeleccionadas`,
  `puntosEnlace`, `ok`/`fallo`). Un split por dominio (eliminacion / 
  alineacion / traer / plantilla) ahorra ~150 LOC por archivo y duplica
  imports en `acciones-canvas.ts` y `operacionesBatch.test.ts`. **Costo
  > beneficio**.
- **`render/jointjs/`**: ya particionado por composers/ + handlers/ + 
  mapa/ + JointCanvas como orquestador delgado tras refactor ronda 9.
  Saludable.
- **`store/`**: 9 slices + runtime singleton + tipos + acciones por
  dominio (acciones-canvas/enlace/entidad/estados/opd/ui). Bien
  particionado. **Sin deuda estructural**.
- **`ui/inspector/`**: 11 secciones cohesivas (cada una <200 LOC),
  estilos compartidos en `inspectorStyles.ts`, `Inspector.tsx` actúa de
  router por tipo de selección. Saludable.
- **`ui/asistente/`**: Asistente.tsx orquestador delgado + 11 etapas en
  archivos separados + estilos compartidos. Refactor ya consumado en
  ronda 9.
- **`opl/`**: lente derivada con generadores por dominio. Estable.
  Cero oraciones nuevas en ronda 12.1.
- **`modelo/tipos/`**: 12 archivos ~50-200 LOC cada uno por dominio
  semántico (apariencia/enlace/entidad/estado/modelo/opd/opl/abanico/
  pestana/plantilla/ui/comunes). Modelo de datos limpio.
- **`serializacion/`**: 6 validadores especializados + integridad +
  normalización + json. Particionado correcto.

### 1.2 Deuda real (vale moverla)

- **`ui/Toolbar.tsx` 1098 LOC**: cohesión accidental real. Mezcla
  encabezado (menu hamburguesa + título + badges + versiones), banda de
  acciones (drag de tipos, modo creación sticky, undo/redo, CRUD
  modelo, demo selector, enlaces, tipos válidos, biblioteca, traer,
  plantillas), banda de multiselección (alinear/distribuir + traer
  enlaces + agregar al todo), banda de canvas (grid + alias + desc +
  imagen + autosave) + 6 modales/popups montados como hijos. Es **el
  único monolito legítimo del repo**. Diferimiento explícito a ronda 13
  ya documentado.
- **9 literales de color `#3BC3FF` / `#586D8C` / `#3DA8FF` en
  Toolbar.tsx**, 108 ocurrencias totales en `app/src/ui/`. `tokens.ts`
  existe pero solo se aplica en `Dialogo.tsx`. La paleta UI sigue
  reescribiéndose por archivo. Fuga real.
- **`app/e2e/opm-smoke.spec.ts` 3847 LOC / 93 tests** en un único
  archivo. No es deuda de código (los smokes son aditivos por diseño)
  pero sí es deuda **de orientación** — encontrar un smoke específico
  cuesta. Tiempo real de CI también: cuando un smoke flakea, el archivo
  entero se relanza.
- **5 stashes pendientes** en `git stash list` (`stash@{0..4}`):
  artefactos cross-line ronda 12.1 ya integrados. Cleanup pendiente del
  operador.
- **`store/modelo/acciones-canvas.ts` 735 LOC**: el archivo más grande
  de los slices (concentra seleccionarEntidad/Estado/Enlace + 
  edicion-OPL inversa + plegado + estilo apariencia + mover apariencia
  + vértices + copiar/exportar OPL + deshacer/rehacer). En la frontera
  de "razonable" — particionable pero su cohesión por verbos de
  selección/canvas es real.

### 1.3 Solo parece deuda (no es)

- **`store/tipos.ts` 605 LOC**: es una **interfaz `OpmStore` con ~370
  miembros**. No hay lógica. Es el contrato público del store. Su
  tamaño refleja la superficie API real, no smell.
- **`store/runtime.ts` 639 LOC**: contiene el singleton del store, undo
  stack, cuenta de pestañas, control autosalvado, helpers de
  normalización entre snapshot/modelo/pestana. Es kernel runtime
  consolidado. Particionarlo desacopla cosas que deben estar acopladas.
- **`modelo/operaciones/` particionado** (7 archivos): apariencias,
  creacion, eliminacion, enlaces, entidad, estados, helpers,
  refinamiento. Es exactamente el tamaño correcto.
- **9 lazy chunks** activos (`feature-asistente`, `feature-dialogos-
  pesados`, `feature-mapa`, `MenuPrincipal`, `feature-modales`,
  `PantallaInicio`, `ModalImagenObjeto`, `DialogoPlantillas`,
  `DialogoTraerConectados`). Code-split saludable; el chunk principal a
  218.99 kB no es por monolito sino por **superficie real** (toolbar +
  canvas + store + render + tipos cargan eager juntos como deben).
  **El bundle no está mal; el objetivo `<195` está derivado de
  expectativa nominal sin presupuesto justificado**.

---

## 2. TIER 1 — Refactor evidente y blast-radius bajo

Cambios reversibles, sin debate de taste, ejecutables en ronda corta
estilo 12.1 (1-2 commits cada uno). Los listo como ítems atómicos.

### T1.1 — Limpiar 5 stashes pendientes

| Path | Acción | Verificación |
|---|---|---|
| `git stash list` | `git stash drop` × 5 (después de auditar cada uno con `git stash show -p stash@{N}`) | `git stash list` vacío; `bun run check` verde |

Decisión destructiva → autorización operador requerida. Costo: 10 min.

### T1.2 — Asignar literales `#3BC3FF` / `#586D8C` activeButton/stickyBadge en Toolbar.tsx a tokens

Toolbar.tsx tiene **9 literales** de color UI inline (`activeButton.border`,
`activeButton.background`, `stickyBadge.border`, `stickyBadge.background`,
`activeSelect.border`, `activeSelect.background`, `nombreInput.outlineColor`,
`primarySmall.border`, `primarySmall.background`). Reemplazar por
`tokens.colors.acentoUi` / `chromeNeutral` no toca paleta canvas (que
sigue invariante).

| Path | Acción | Verificación |
|---|---|---|
| `app/src/ui/Toolbar.tsx` | reemplazar 9 literales por referencias a `tokens.colors.acentoUi` y `chromeNeutral` (con fallback `#eaf8ff`/`#e8eef5` para fondo claro derivado, expuestos como tokens nuevos `acentoUiSuave` / `chromeNeutralSuave`) | smoke `boton-toolbar-activo` verde; visual diff manual |
| `app/src/ui/tokens.ts` | añadir tokens derivados `acentoUiSuave: "#eaf8ff"`, `chromeNeutralSuave: "#e8eef5"` | tokens.test.ts pasa |

Costo ~30 min. Blast: cero (tokens ya separa UI de canvas).

### T1.3 — Headers de provenance ya identificados por auditoría SSOT

Ítem heredado `2026-05-07-ssot-opm-extracted.md` §5 (RF-1 + R4):

| Path | Acción | Verificación |
|---|---|---|
| `app/src/modelo/operaciones/enlaces.ts:33` | `Logical/AggregationLink.ts` → `DrawnPart/Links/AggregationLink.ts` | grep verde |
| `app/src/modelo/tipos/enlace.ts:10` | mismo | grep verde |
| `app/src/modelo/tipos/abanico.ts:8` | `Logical/*` → `LogicalPart/*` | grep verde |
| `app/src/modelo/validaciones.ts:1` | añadir header `// Refs: opm-extracted/.../{behavioral,structural}.rules.ts (técnica de inspiración; SSOT = opm-iso-19450-es.md §Reglas)` | lectura humana |

5 minutos en total. Es trabajo que ya estaba planificado por la auditoría
previa.

### T1.4 — Particionar `app/e2e/opm-smoke.spec.ts` por dominio

3847 LOC / 93 tests en un solo archivo. No mover el código de los tests
— solo distribuir por archivos:

| Nuevo archivo | Tests aprox |
|---|---:|
| `app/e2e/01-carga-y-workspace.spec.ts` | carga demo, dialogo cargar, busqueda global, workspace L4 (5-7 tests) |
| `app/e2e/02-canvas-y-render.spec.ts` | markers, abanicos, modificadores, multiplicidad, mover puerto, atributos numéricos, drag (10-12) |
| `app/e2e/03-opl-panel.spec.ts` | OPL agrupa, búsqueda, copia/export, numeración, minimiza, lateral, indenta, multi-enlace, AI placeholder (9) |
| `app/e2e/04-arbol-y-pestanas.spec.ts` | navega árbol, atajos, pestañas (3-4) |
| `app/e2e/05-refinamiento-y-plegado.spec.ts` | descompone, despliega, plegado parcial, partes plegadas (5-7) |
| `app/e2e/06-undo-redo-dirty.spec.ts` | undo entidad/renombrar/mover/esencia/vertices/extraer + dirty + beforeunload (8) |
| `app/e2e/07-enlaces-avanzados.spec.ts` | crear/editar/eliminar enlaces, split effect, agregación, reanclaje, autoinvocación, etiquetas (10-12) |
| `app/e2e/08-mvp-alpha-residual.spec.ts` | smokes ronda 12.1 L1+L2+L3 cierre fino (~12) |

Verificación: `bun run browser:smoke` pasa con misma cobertura.

Costo: 1 hora con asistente de movimiento (cortar/pegar test por test;
los imports de Playwright son idénticos en cada archivo). Beneficio:
navegación + observabilidad + paralelización CI nativa de Playwright.

### T1.5 — Reglas detector que aún quedan parcialmente desfasadas

Las recalibraciones ronda 12.1 cerraron el grueso. Verificar con
`progress-dashboard.mjs --sync-real --strict` si hay HU con paths
heredados que ya rotaron tras commits L0-L3. Costo: 15 min audit + 0-30
min fix.

---

## 3. TIER 2 — Refactor estructural con tradeoffs reales

Aquí hay debate. Recomiendo, no impongo. Cada opción nombra su
sacrificio.

### T2.1 — Split de `Toolbar.tsx` en 3 bandas

**Diferimiento canónico ronda 13 según briefs ronda12.1 §4b**.

#### Opción A (la del brief): tres componentes hermanos

```
ui/Toolbar.tsx                  ← orquestador delgado (~80 LOC)
ui/toolbar/
  BarraEncabezado.tsx           ← menu hamburguesa + título + badges + versiones (~150 LOC)
  BarraTipos.tsx                ← drag tipos + modo creación sticky (~180 LOC)
  BarraContextual.tsx           ← undo/redo + CRUD + demo + enlace + biblioteca + traer + plantillas + multiselección + grid + alias/desc + imagen + mapa + autosave (~600 LOC)
  toolbarStyles.ts              ← tokens compartidos
```

- **Sacrifica**: BarraContextual sigue siendo grande (~600 LOC). El
  monolito no se elimina, se desplaza.
- **Gana**: tres archivos navegables, menos prop drilling, estilos
  compartidos en lugar de duplicados, lazy candidato natural sobre
  BarraContextual (la que carga las acciones contextuales).

#### Opción B: descomponer **por estado del editor**

```
ui/toolbar/
  ToolbarBase.tsx               ← chrome estable (encabezado + drag tipos + undo/redo + CRUD)
  ToolbarSeleccion.tsx          ← banda contextual cuando hay 1 entidad/enlace seleccionado
  ToolbarMultiseleccion.tsx     ← banda cuando hay ≥2 (alinear/distribuir/agregar al todo)
  ToolbarCreacion.tsx           ← cuando modoEnlace o modoCreacion activos
  ToolbarMapaSistema.tsx        ← cuando vistaMapaActiva
```

- **Sacrifica**: introduce 5 archivos en lugar de 3; los smokes que
  buscan `[data-testid]` específicos pueden moverse de path; divide la
  unidad de toggle de un button.
- **Gana**: cada archivo refleja un **modo del editor**, no una banda
  visual. Carga condicional natural (solo monta lo activo). Permite
  evolucionar `BarraHerramientasElemento.tsx` flotante (ronda 13 ítem
  P0) como variante de ToolbarSeleccion sin reescribir.

#### Opción C: slot dinámico con IntersectionObserver

Detecta overflow y mueve botones a un menú "···" automático. Pattern
moderno tipo Material 3.

- **Sacrifica**: complejidad alta, accesibilidad sufre (navegación por
  teclado en menú dinámico es no trivial), CSS reflow añadido,
  Playwright más flaky.
- **Gana**: presenta solo lo que cabe. Útil en monitores chicos.

**Recomendación**: opción B. Acoplada al modelo de modos del editor
que ya existe. La A es más conservadora y la C es exceso.

### T2.2 — `tokens.ts` central completo + migración archivo por archivo

**Diferimiento canónico ronda 13.**

Ya tienes `tokens.ts` mínimo (3 colores + canvas referencia). Lo que
toca:

- Migrar **108 ocurrencias en `app/src/ui/`** a tokens centrales.
- Añadir tokens secundarios: `spacing` (4/8/12/16/24), `radii` (4/6/8),
  `shadows.dialogo` (`0 12px 30px rgba(15,23,42,0.16)` repetido en 8
  archivos), `typography` (`familyArial`, `sizes`, `weights`).
- ESLint rule custom `no-restricted-syntax` con regex
  `/#[0-9A-Fa-f]{3,8}/` solo en `app/src/ui/**/*.{ts,tsx}` (excluye
  `tokens.ts`).

**Tradeoff real**: la migración archivo por archivo es **mecánica** pero
afecta cualquier visual diff manual del operador. Sugerencia: hacerlo en
una línea paralela L de ronda 13 con commits atómicos por archivo
visible en `git log --stat` para reversibilidad simple.

**Smoke regresión**: visual snapshot Playwright de `.toolbar`,
`.inspector`, `.dialogo` antes/después.

### T2.3 — Destilar `methodological-checking-dialog/checkers/` desde opm-extracted

**Esto es la única joya semántica nueva real de `opm-extracted/`**.

Encontré 6 checkers en `opm-extracted/src/app/dialogs/methodological-
checking-dialog/checkers/` que son **TS legible reusable** (no
post-Angular IVY ni post-webcrack inintegrable):

- `IngProcessesNamesChecker` (procesos en gerundio "ing" → en español:
  termina en `-ar`/`-er`/`-ir` para infinitivos verbales o convención
  ISO 19450 §Procesos)
- `ObjectNameAsSingularChecker` (objetos en singular)
- `InzoomedContentChecker` (in-zoom debe contener ≥2 cosas)
- `PartUnfoldContentChecker` (unfold debe contener ≥2 partes)
- `TransformingProcessChecker` (proceso debe tener al menos un Result/
  Consumption/Effect)
- `SystemicProcessesMainFunctionChecker` (todos los procesos sistémicos
  conectados al proceso principal SD vía links fundamentales o cadena
  in-zoom/unfold)

Adaptación a deep-opm-pro:

- `OPCloudUtils.isInstanceOfLogicalProcess(thing)` → `entidad.tipo === "proceso"`
- `OPCloudUtils.isInstanceOfLogicalObject(thing)` → `entidad.tipo === "objeto"`
- `model.logicalElements` → `Object.values(modelo.entidades)`
- `model.opds.filter(o => !o.isHidden)` → `Object.values(modelo.opds)`
- `vis.getAllLinks()` → reusar `entidadIdDeExtremo` + filtros sobre
  `modelo.enlaces`
- `proc.affiliation === Affiliation.Systemic` → `entidad.afiliacion === "sistémica"`
- `linkType.Result/Consumption/Effect` → ya hay tipo `TipoEnlace`

Resultado esperado: archivo nuevo `app/src/modelo/checkers.ts` (~250
LOC) que expone `verificarMetodologia(modelo: Modelo): AvisoMetodologico[]`
+ tests + integración como sección visual en Inspector o panel
dedicado.

**Tradeoff**: introduce un nuevo dominio (validación metodológica vs
validación de consistencia ya existente). Hay que decidir si es **un
panel separado** (estilo PanelAvisos) o **una pestaña del Inspector** o
**un overlay del canvas** (badges sobre entidades inválidas).

**Recomendación**: PanelAvisos extendido o panel hermano. Las reglas
metodológicas son **avisos blandos**, no errores. La ronda 13 las
incluye como "validation/methodological-checking pipeline visual" en la
lista cerrada de diferimientos. Aquí hay leverage real de
`opm-extracted/`.

**Costo**: línea paralela completa en ronda 13. ~600 LOC totales (250
checkers + 200 panel UI + 150 tests + cita SSOT + ESLint headers).

### T2.4 — Centralizar `box-shadow` y `border-radius` en tokens

108 literales de color, pero también `boxShadow: "0 12px 30px
rgba(15,23,42,0.16)"` aparece en 6 diálogos distintos como literal.
Sub-caso de T2.2 pero más granular y aislable.

| Sacrifica | Gana |
|---|---|
| 1 hora de migración mecánica | tokens.shadows.dialogo único; cambio único para dark mode futuro |

Combinable con T2.2.

### T2.5 — `BarraHerramientasElemento.tsx` flotante (element-tool-bar canónico OPCloud)

**Diferimiento canónico ronda 13 según briefs.**

`opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-
bar.component.ts` 8979 LOC: imposible portar 1:1 (es post-Angular IVY
con 700+ template fragments). Pero la **lista de acciones** sí es
extraíble del decompilado y de los SVGs canónicos:

12 acciones primarias OPCloud según el código observable:
1. `regularCopyStyle` (copiar estilo)
2. `pasteStyle` (pegar estilo)
3. `toggleStylingDiv` (panel estilo extendido)
4. `returnToDefaultAttributes` (resetear estilo)
5. `toggleTextSizeMenu` (tamaño de texto)
6. `addState` (añadir estado)
7. `inzoomThing` (in-zoom)
8. `unfoldThing` (unfold/structural)
9. `editAlias` (editar alias)
10. `editDescription` (editar descripción)
11. `editURLs` (editar URLs)
12. `editImage` (editar imagen, solo objeto)

**Tradeoff**:
- **A favor**: barra flotante junto a la cosa seleccionada es UX
  superior a "viajar al panel Inspector lateral" para acciones
  frecuentes; libera espacio del Toolbar superior; muy demandado en UX
  research de modeladores.
- **En contra**: introduce un componente flotante con anchor al canvas
  + lógica de posicionamiento (collision avoidance con bordes); duplica
  parcialmente acciones del Inspector → **decidir si es duplicación o
  reemplazo del Inspector lateral**. Si es reemplazo, es cambio mayor
  de UX.

**Recomendación**: pilotear como **complemento** (no reemplazo) en
ronda 13. Solo las 6 acciones más frecuentes + un botón "···" que abre
el Inspector lateral. Si UX research valida el patrón, ronda 14+ puede
considerar mover el Inspector a popover-on-demand.

### T2.6 — Lazy split adicional `MapaSistema` + `Timeline` + `TablaEnlaces`

Chunk principal 218.99 kB es +24 sobre objetivo 195. Candidatos
naturales:

| Componente | LOC | Lazy candidato |
|---|---:|---|
| `MapaSistema.tsx` | 370 | sí — solo se monta con `vistaMapaActiva` |
| `Timeline.tsx` | 385 | sí — solo se monta con OPD inzoomed |
| `TablaEnlaces.tsx` | 349 | sí — solo cuando `tablaEnlacesAbierta` |
| `GestionArbolOpd.tsx` | 371 | sí — solo cuando `gestionArbolAbierta` |

Estimado: **~30-40 kB ahorro chunk principal** combinando los 4. Bajo
objetivo. Costo: 30 min. Cero blast (cada uno tiene flag de apertura).

**Recomendación**: hacerlo dentro de la línea de Toolbar split (T2.1)
porque toca la misma capa de orquestación.

### T2.7 — Migrar OPL viejo (`app/src/opl/`) o coexistencia con `app/src/modelo/opl/generador-opl.ts`

L0 ronda 12.1 introdujo `app/src/modelo/opl/generador-opl.ts` para
emitir OPL-ES bimodal de los demos. Coexiste con `app/src/opl/generar.ts`
de la lente derivada original. **Hay dos generadores OPL en el repo**.

**Tradeoff**:
- **Mantener ambos**: `app/src/opl/` es runtime (lente reactiva) + tests
  + integración OPL-canvas hover/edición; `modelo/opl/generador-opl.ts`
  es offline (generación de fixtures bimodal). Tienen **propósitos
  distintos** y sus templates tienen overlap pero no son idénticos.
- **Unificar**: un único generador con dos modos (runtime/offline). Costo
  alto, riesgo alto (893 LOC de tests OPL en `generar.test.ts`).

**Recomendación**: mantener separados con header de cada uno declarando
su rol (runtime vs offline). NO unificar. Dejar nota en HANDOFF para
futura ronda 14 (parser OPL bidireccional) que evalúe si la unificación
viene "gratis" tras parser.

---

## 4. TIER 3 — Refactor especulativo / arquitectónico (no ejecutar sin brief de ronda dedicada)

Aquí especialmente: nombrar **lo que se gana, lo que se pierde, y el
evento que justificaría tomarlo**.

### T3.1 — Reemplazar Zustand por `@preact/signals`

- **Gana**: signals nativos de Preact son más livianos (~3 kB vs
  ~12 kB Zustand+React adapter), mejor primitiva para UI reactiva,
  reactividad fina sin re-render del árbol.
- **Pierde**: 605 LOC de `OpmStore` interface + 9 slices + runtime
  singleton + 11 tests `*.test.ts` en `store/` + hooks `useOpmStore` en
  60+ componentes. Migración mecánica pero gigantesca (estimado 2-3
  semanas full-time). Se pierden 2 años de tooling Zustand (devtools,
  middleware patterns).
- **Cuándo justificarlo**: si Felix decide adoptar signals como modelo
  de programación general en su stack (HDOS, OpenClaw frontends),
  homogeneizar tiene sentido. Si no, es deuda gratuita.
- **Recomendación**: NO HACER. El costo de migración no compra nada
  observable para el usuario.

### T3.2 — Reemplazar JointJS por motor canvas custom (PixiJS / Konva / SVG nativo)

- **Gana**: librería principal del bundle (`vendor-jointjs-*.js` 470 kB
  / 130 kB gzip lazy). Es el chunk más grande del repo. Reemplazarlo
  por SVG nativo + library propia bajaría dramáticamente el peso.
- **Pierde**: TODA la arquitectura render/jointjs/ (composers/ +
  handlers/ + mapa/ + JointCanvas + customShapes + linkAssets +
  rutaLabels + agregacionBus + plegadoNesting + autoinvocacionLoop +
  abanicoOverlay + abanicoDragSync). Estimado 6000+ LOC reescritas. La
  feature manhattan routing + ports magnéticos + Boundary tools +
  freeze del paper son **commodity gigantesca** que JointJS provee.
  Reescribirlas es 6+ meses full-time con regresiones garantizadas.
- **Cuándo justificarlo**: si JointJS deprecara o el chunk de 470 kB
  bloqueara una métrica de carga inicial crítica (no es el caso —
  está lazy).
- **Recomendación**: NO HACER. Si el chunk preocupa, optimizar import
  específico (`jointjs/dist/joint.core.js` vs full) o investigar
  splitting más fino. **Esto sí es ronda dedicada de investigación** no
  refactor.

### T3.3 — Introducir capa CQRS / Event Sourcing entre store y kernel

- **Gana**: undo/redo más limpio (cada acción → evento serializable),
  multi-user gratis (replay de eventos), debugging trivial (timeline de
  eventos), persistence más natural.
- **Pierde**: redirige todas las acciones por bus + reducer pattern.
  Las 9 slices actuales (con sus 200+ acciones) pasarían a ser command
  handlers + event handlers. Costo de reescritura masiva.
- **Cuándo justificarlo**: si EPICA-19 (pool organizacional multi-user)
  o EPICA-32 (sub-modelos peer-persistence) entran a roadmap activo. Si
  no, es overkill.
- **Recomendación**: NO HACER ahora. Marcar como **pre-requisito
  arquitectónico de EPICA-19**. Cuando esa épica salga de "diferida",
  abrir ronda dedicada con brief.

### T3.4 — Separar runtime singleton del store en módulo dedicado de DI

- **Gana**: `store/runtime.ts` 639 LOC mezcla `storeApi` + undo stack +
  autosalvado + helpers de pestañas. Separar en módulos DI-style con
  inyección explícita facilitaría testing aislado del runtime sin
  montar el store completo.
- **Pierde**: arquitectura DI explícita en JS no tiene equivalente
  natural. Forzaría introducir un container o pasar dependencias como
  argumentos. Carga cognitiva por boilerplate.
- **Cuándo justificarlo**: si los tests de runtime se vuelven dolor
  recurrente (no es el caso — los tests pasan).
- **Recomendación**: NO HACER. El acoplamiento actual es cohesión real,
  no accidente.

### T3.5 — Migrar a TypeScript estricto + branded types para `Id`

- **Gana**: `Id` es alias de `string`. Branded types
  (`type Id = string & { __id: true }`) previenen bugs de "pasar un
  nombre donde se esperaba ID". Tipos más fuertes en general.
- **Pierde**: cada constructor de `Id` debe pasar por una función
  `crearId(s)`. Todos los call sites que reciben `string` desde APIs
  externas necesitan cast o validación. Cambia el contrato público de
  todas las funciones que aceptan `Id`.
- **Cuándo justificarlo**: si aparece un bug de "pasé el nombre como
  ID y nadie se dio cuenta" en producción. No tengo evidencia de eso.
- **Recomendación**: NO HACER. El kernel ya valida vía `Resultado<T>`
  pattern. Los IDs siempre vienen del kernel (`siguienteId(seq, prefijo)`)
  por construcción.

### T3.6 — Eliminar JSX/Preact y mover UI a Web Components

- **Gana**: portabilidad UI a otros stacks; estandarización pura.
- **Pierde**: TODO el ecosistema actual. ~12000 LOC de UI Preact.
- **Cuándo justificarlo**: nunca para este proyecto.
- **Recomendación**: NO HACER. Mencionado para descartar explícitamente
  si surge la conversación.

### T3.7 — Adoptar `signals` solo para hover/highlight efímero (subset)

Variante quirúrgica de T3.1. `hoverOplRef` + `idsResaltadosTemporales`
+ `mapaTooltipActivoId` + `bibliotecaAbierta` + estados ad-hoc UI son
"efímeros" y forzar al store completo a re-renderizar cuando cambian es
costoso.

- **Gana**: latencia de hover OPL canvas mejorada en modelos grandes;
  store sigue como SSOT.
- **Pierde**: introduce dos paradigmas reactivos en paralelo. Carga
  cognitiva permanente.
- **Cuándo justificarlo**: si aparece una métrica de jank visible en
  modelos de >300 entidades.
- **Recomendación**: NO HACER hasta que haya métrica concreta.
  Documentar como candidato de optimización dirigida.

---

## 5. Mapa `opm-extracted/` ↔ deep-opm-pro

Solo nombro las piezas con leverage real. No reproduzco el inventario
completo (349 archivos / 486 clases / 165K LOC). Filtré por dictámen.

### 5.1 Reusable-semántico (vale destilar idea)

| `opm-extracted/` | Estado en deep-opm-pro | Acción sugerida |
|---|---|---|
| `dialogs/methodological-checking-dialog/checkers/*.ts` (6 archivos, ~200 LOC total legible) | Ausente | **Destilar como módulo nuevo `modelo/checkers.ts`** (T2.3). Es la joya semántica del repo. |
| `models/consistency/behavioral.rules.ts` 1232 LOC / ~40 reglas | 11 reglas en `validaciones.ts` | Mapeo dirigido por HU activas (RF-3 auditoría SSOT). NO portar las 49 faltantes en bloque. |
| `models/consistency/structural.rules.ts` 299 LOC / ~11 reglas | parcial en `validaciones.ts` | Auditoría dirigida por HU. |
| `models/consistency/bringConnectedRules.ts` 181 LOC / ~7 reglas | implementado como `canvas/reglasTraer.ts` | Verificar paridad semántica. Probable que ya esté completa. |
| `models/components/commands/*.ts` (15 archivos) | implementados como funciones puras kernel | Ya cubierto. Patrón Command de Angular no aplica; en deep-opm-pro las acciones son funciones puras `Modelo → Resultado<Modelo>`. |
| `LogicalPart/LogicalTextModule.ts` + `components/*` | implementado como `app/src/opl/generadores/*` | Ya cubierto. EPICA-50 al 100% con 26 citas SSOT. |
| `dialogs/templates-import/templates-import.ts` | implementado como `DialogoPlantillas.tsx` + `insertarPlantillaBatch` | Ya cubierto. |
| `dialogs/load-model-dialog/name-validator.ts` | implementado como `validarNombreModeloLocal` | Ya cubierto. |
| `dialogs/new-model-by-wizard-component/` | implementado como `ui/asistente/*` (12 etapas) | Ya cubierto. |
| `Actions/BringConnectedEntitiesAction.ts` 209 LOC | implementado como `traerConectadosBatch` | Ya cubierto. |

### 5.2 Bypassed-dependency (descartar)

| `opm-extracted/` | Razón |
|---|---|
| `modules/layout/element-tool-bar/element-tool-bar.component.ts` 8979 LOC | post-Angular IVY (`core.ɵɵelementStart`). **Solo extraíble la lista de acciones** (T2.5), no el código. |
| `dialogs/*.ts` mayoría (60+ diálogos) | Material Angular dialogs. Reescritos como `Dialogo.tsx` con prop `size?` y portales propios. |
| `database/firebaseAuthDriver.ts` + `services/*` | Firebase. Stack único. Workspace local + IndexedDB-likely cubre el caso single-user. |
| `services/dcm/*` (8 algoritmos + 5 exporters) | DCM/SysML/CMMN. Fuera de scope MVP. |
| `services/sysml-converters/*` (7) | SysML. Fuera de scope MVP. |
| `ImportOPX/*` (7 archivos, 95 KB) | EPICA-70 descartada explícitamente. |
| `configuration/rappidEnviromentFunctionality/shared.ts` 6261 LOC | Rappid + Backbone. JointJS core es la elección. Solo se usa como referencia de geometría/markers (ya citado en `linkAssets.ts`, `abanicoOverlay.ts`). |
| `rappid-components/*` | Rappid. No aplica. |
| `modules/Settings/*` | Multi-user organizacional. EPICA-19 diferida. |

### 5.3 Ya-cubierto

| `opm-extracted/` | Equivalente deep-opm-pro |
|---|---|
| Paleta + dimensiones + markers | `JOYAS.md` + `linkAssets.ts` + `customShapes.ts` |
| 84 SVG/PNG canónicos | `assets/svg/` + `assets/png/` (100% replicados, auditoría SSOT lo confirma) |
| OPL templates | `app/src/opl/generar.ts` + 8 generadores |
| Manhattan routing | `customShapes.ts` (config heredada por router JointJS) |
| Wrapper+line pattern (15 px hit area) | `composers/enlace.ts` |
| In-zoom / unfold | `modelo/operaciones/refinamiento/*` |
| Plegado parcial | `modelo/plegado.ts` |
| Estados M0 + designaciones | `modelo/estadosDesignaciones.ts` |
| Multiplicidad + estilos enlace | `modelo/enlaceMultiplicidad.ts` + `enlaceEstilo.ts` |

**Conclusión sección 5**: `opm-extracted/` ya rindió ~95% de lo que
podía rendir. Lo único que falta destilar con leverage real es **el
módulo de methodological-checking** (T2.3). Todo lo demás es ya
existente, descartado por arquitectura, o referencia opcional.

---

## 6. Coordinación con rondas 13/14 ya programadas

### 6.1 Lo que se absorbe en ronda 13 (UX foundation, 3-5 líneas paralelas)

- T2.1 (split Toolbar.tsx, opción B recomendada) → línea L-Toolbar
- T2.2 (tokens.ts central + migración + ESLint rule) → línea L-Tokens
- T2.4 (box-shadow/border-radius en tokens) → absorber en L-Tokens
- T2.5 (`BarraHerramientasElemento.tsx` flotante) → línea L-FloatingBar
- T2.6 (lazy split MapaSistema/Timeline/TablaEnlaces) → absorber en L-Toolbar
- T2.3 (methodological checkers destilados) → línea L-Methodological
  (semánticamente independiente; es el ítem "validation/methodological-
  checking pipeline visual" del brief de diferimientos)
- Sprite-sheet 17 modificadores procedurales → línea L-Sprites (ya en
  diferimientos cerrados)
- Minimapa flotante → absorber en L-FloatingBar o L-Toolbar
- Dark mode → solo viable post-T2.2 + T2.4 cuando todos los colores
  estén tokenizados. Probable diferimiento a ronda 13.5 o 14.

**Topología sugerida ronda 13**: 4 líneas paralelas con disjuntez por
dominio funcional:
- L-Toolbar (UI estructural superior + lazy adicional)
- L-Tokens (centralización paleta + ESLint rule + box-shadow)
- L-FloatingBar (BarraHerramientasElemento + minimapa)
- L-Methodological (checkers + panel/sección visual)

L-Sprites como L-5 si capacidad; sino se absorbe en L-Toolbar (los
sprites son archivos planos en `assets/svg/modificadores/` + un
componente sprite renderer).

### 6.2 Lo que se absorbe en ronda 14 (parser OPL bidireccional)

- T2.7 (decisión coexistencia OPL viejo vs nuevo) → revisar al final de
  ronda 14 cuando parser bidireccional aclare si los generadores se
  unifican naturalmente.

### 6.3 Lo que exige ronda separada nueva

- **Ronda 15+ EPICA-32 sub-modelos peer-persistence** (ya planificada).
- **Ronda eventual EPICA-19 pool organizacional** → pre-requisito
  arquitectónico T3.3 (CQRS) podría reabrirse.

### 6.4 Lo que se ejecuta en ronda corta antes de las grandes (ronda 13.0)

Ronda **13.0** (estilo 12.1, corta, 1-2 commits operador + 1-3 líneas
chicas):

- T1.1 (limpieza stashes) — operador.
- T1.2 (9 literales activeButton/stickyBadge a tokens) — línea chica.
- T1.3 (paths errados + header validaciones.ts) — línea chica
  (heredado auditoría SSOT).
- T1.4 (split smoke spec por dominio) — línea chica.
- T1.5 (verificación recalibración detector) — operador.

Tiempo estimado ronda 13.0 completa: **medio día**. Útil porque
**despeja la mesa antes de la ronda 13 grande**: 13 grande arranca con
stashes limpios, smokes navegables, paths trazables, base de tokens
mínima validada.

---

## 7. Anti-magia — métricas de éxito

Cada propuesta debe poder evaluarse con loop verde + métrica
observable. Si no, lo declaro:

| Propuesta | Métrica observable | Cómo medir |
|---|---|---|
| T1.1 stashes | `git stash list` vacío | comando |
| T1.2 tokens parciales | grep verde | `rg '#3BC3FF\|#586D8C\|#3DA8FF' app/src/ui/Toolbar.tsx` |
| T1.3 provenance | grep verde | `rg 'Logical/AggregationLink'` |
| T1.4 smoke split | tests/archivo ≤15 | wc -l e2e/*.spec.ts |
| T1.5 detector | strict mode passa | `progress-dashboard --sync-real --strict` |
| T2.1 toolbar split | LOC max archivo en `ui/toolbar/` ≤300 | wc -l |
| T2.2 tokens completo | `rg '#[0-9a-f]{3,8}' app/src/ui/` solo en tokens.ts | regex |
| T2.3 checkers | tests verdes para 6 checkers + integración panel | bun test + smoke nuevo |
| T2.4 shadows | `rg 'boxShadow.*rgba' app/src/ui/` solo en tokens.ts | regex |
| T2.5 floating bar | smoke nuevo verifica 6 acciones en barra flotante con anchor canvas | smoke + visual |
| T2.6 lazy chunks | chunk principal ≤195 kB | `bun run build` |
| T2.7 OPL coexistencia | header explicativo presente | grep header |
| T3.* | declarado: NO ejecutables sin brief de ronda dedicada | — |

**Anti-magia explícita**: T2.5 (BarraHerramientasElemento flotante)
tiene componente UX que no es loop-verde-evaluable. El "feel correcto"
exige UX research o A/B con el operador. **Recomiendo definir 2-3 user
journeys concretos antes de empezar L-FloatingBar**: (a) editar alias
en cosa seleccionada sin abrir Inspector, (b) cambiar tamaño de texto
de proceso seleccionado, (c) in-zoom desde canvas con un click.
Cada journey medible en clicks reducidos / paths.

**Lo único especulativo sin métrica clara**: el peso del bundle. El
objetivo "<195 kB" es nominal sin presupuesto justificado por costo de
carga del usuario. **Sugerencia**: medir TTI real del editor en red
3G simulada con DevTools. Si TTI <2s, el peso actual es aceptable;
si >2s, optimización del bundle gana prioridad. **Sin esa medición, no
hay forma honesta de decir si las 218 kB son problema**.

---

## 8. Recomendación primaria

**Ejecutar ronda 13.0 corta (T1.1-T1.5, medio día) y luego ronda 13
grande con 4 líneas paralelas (T2.1 opción B + T2.2 + T2.5 + T2.3); no
tomar ningún ítem T3 sin que aparezca el evento que los justifica.**

Vista de conjunto: el código está más sano de lo que sugieren los LOC.
La única deuda real concentrada está en `Toolbar.tsx` y en la
dispersión de literales de color. La única joya nueva extraíble de
`opm-extracted/` es el módulo de methodological-checking. Todo lo demás
ya está cubierto, descartado por arquitectura, o es referencia opcional.
