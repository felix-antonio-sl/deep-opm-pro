# Ronda 9 — Refactor estructural sobre los 4 monolitos restantes + cierre de undo per-pestaña

**Fecha**: 2026-05-06
**Base**: `main` @ commit `95e0b59` (`docs(handoff): consolida ronda 8`) — HANDOFF vigente con rondas 1-8 consolidadas. Working tree limpio salvo `docs/instrucciones-lineas-dev/ronda9/` (que crea esta ronda como input).
**Objetivo**: extender el patrón canónico ronda 8 (barrel re-export + slices/sub-archivos por dominio) a los **4 monolitos no abordados**, cerrar la **deuda de undo per-pestaña** declarada desde ronda 7, y completar la modularización del corpus de tipos. NO se agregan features. NO se reabren contratos. La forma del repo es lo que escala.

## 1. Filosofía operativa (continuidad ronda 8)

- **Architecture-over-implementation**: invertimos en mover líneas de límite, no en pulir lo que ya existe. Si una línea termina con LOC reducido pero misma forma, fallo.
- **Adjunción libre/olvido (categorial)**: cada barrel reducido es un funtor `forgetful` que olvida partición; los sub-archivos son el `free` adjunto que la materializa. Patrón validado en ronda 8 sobre 5 superficies (`store.ts`, `proyeccion.ts`, `json.ts`, `generar.ts`, UI grandes). Ronda 9 lo extiende a las 4 superficies restantes (`operaciones.ts`, `JointCanvas.tsx`, `AsistenteNuevoModelo.tsx`, `tipos.ts`) más una deuda funcional (undo per-pestaña).
- **Disjuntez por coproducto**: las 5 líneas son disjuntas en archivos editados — pushout vacío entre ellas. Conmutatividad de orden de merge requiere ortogonalidad.
- **Funtor faithful sobre API pública**: ningún rename de export. APIs públicas se preservan sin excepción (`urn:fxsl:kb:icas-preservacion`).
- **Refactor solo aditivo + reemplazo controlado**: cada línea entrega los módulos nuevos primero, luego adapta consumidores. Los archivos viejos se vacían a barrel re-exports temporales. No hay commit intermedio en rojo.
- **Reuso obligatorio del corpus interno**: cada línea cita evidencia concreta de `opm-extracted/` y SSOT.
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-ronda 8: 558 unit / 2357 expect, 40/40 smoke (46.5 s), chunk principal 138 KB / 38 KB gzip, detector 55/55 reglas.
- **Ship-beats-perfect**: si el refactor expone un bug que no es del scope, se entrega como patch a `/tmp/` y NO se commitea. Regla del operador para WIP cross-line.
- **APIs públicas documentadas**: cada módulo nuevo abre con un comentario JSDoc del módulo declarando su responsabilidad y sus consumidores conocidos.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Si aparece un cambio cross-line no previsto, detenerse y reportar (no resolver por invasión silenciosa).
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las líneas. El handoff único se actualiza solo en consolidación final. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..8/` (memoria histórica), ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador** en working tree raíz, ni `app/scripts/in-vivo-test.mjs` ni `app/src/render/jointjs/customShapes.ts` ni `home/`. Son WIP del operador, fuera de scope.
4. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica, UX y arquitectura; la implementación en `app/` se reescribe con Preact/Zustand/JointJS OSS. Cada cita debe apuntar a path absoluto desde repo root con número de línea.
5. **Citas explícitas**: cada decisión arquitectural cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno (`opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, módulos `src/` con paths absolutos + líneas).
6. **APIs públicas estables**: no renombrar funciones exportadas existentes. El barrel re-exporta exactamente las firmas previas. Cualquier cambio de firma quiebra el funtor faithful y se rechaza.
7. **Contrato observable por línea**: antes de editar, capturar consumidores y salidas observables del archivo público. Después de editar, demostrar equivalencia con tests existentes intactos, tests aditivos y checks específicos de cada brief. Comentarios o strings agregados solo para satisfacer regex del detector NO cuentan como evidencia si no están acompañados por regla tolerante o test/golden real.
8. **JSON lossless**: roundtrip permanece intacto. Ninguna línea altera el formato emitido ni el formato aceptado. Tests de `serializacion/json.test.ts` deben pasar sin tocar.
9. **Idiomas**: documentación y mensajes de usuario en es-CL; identificadores siguen el estilo existente del repo (camelCase TS, kebab-case data-testid, helpers de operación en es-CL).
10. **Tests por capa**: cada slice/módulo nuevo trae sus tests al lado (mismo nombre + `.test.ts`). Los tests viejos de `operaciones.test.ts` (1185 LOC), `store.test.ts`, `JointCanvas.test.ts` si existe, `AsistenteNuevoModelo.test.ts` si existe, siguen vivos sin reescribir; las líneas pueden agregar tests aditivos en archivos nuevos pero no quitar coverage existente.
11. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** en esta ronda.
12. **Commits de línea**: mensajes imperativos con `refactor(...)` (predominante), `feat(...)` solo si el refactor abre superficie nueva (poco probable), `test(...)`, `chore(...)`. Co-author footer si aplica al implementador externo. Cada línea reporta hashes y comandos al cerrar.
13. **No reabrir contratos de rondas 1-8**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Multi-selección canónica, modo barra creación sticky, mapa = vista derivada extendida, multi-pestaña sesión-only, bloques OPL jerárquicos, workspace single-user, designaciones de estado, alias/unidad/descripción/URLs, duración canónica, plegado parcial persistido, atajos centralizados, divisor árbol/canvas, diálogos custom con captura, barrel re-export como contrato público — ninguno se reabre. Si la línea necesita matizarlos, lo declara como decisión documentada en commit; no los rompe.
14. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05. No incluir en ningún brief, ni proponer reactivar.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests
bun run browser:smoke  # Playwright Chromium para UI/render
bun run build          # build Vite; chunk principal 138 KB / 38 KB gzip post-ronda 8
bun run dev            # localhost:5173
```

Auditoría HU al cierre de consolidación:

```bash
```

## 4. Diagnóstico estructural (qué se rompe)

Estado post-ronda 8:

| Archivo | Post-r8 | Diagnóstico | Línea ronda 9 |
|---|---:|---|---|
| `app/src/modelo/operaciones.ts` | **1743** | Congelado por doctrina desde rondas 4-8. 7 dominios disjuntos: creación, refinamiento, edición entidad, estados, enlaces, apariencias, eliminación. 38 consumidores. Test asociado 1185 LOC fija contrato. | **L1** |
| `app/src/render/jointjs/JointCanvas.tsx` | **697** | Handlers JointJS frágiles. Familias: selección, zoom, pan, rubber band, teclado, drag, hover OPL, herramientas de enlace. Composers L2 ronda 8 estabilizaron contrato visual. | **L2** |
| `app/src/ui/AsistenteNuevoModelo.tsx` | **935** | Asistente 12 etapas en TSX único. 9 funciones `Etapa*` ya están separadas internamente (Bienvenida, FuncionPrincipal, Beneficiario, Atributo, Handler, NombreSistema, Herramientas, Entradas, Salidas, Ambientales, Confirmar). Particionar en archivos por etapa. | **L3** |
| `app/src/store/runtime.ts` + `commitModelo` | 614 | `undoStack`, `redoStack`, `snapshotGuardado` son singletons globales del runtime. Cada `commitModelo` empuja a `undoStack` global compartido entre pestañas — undo per-pestaña queda como deuda explícita ronda 7. `historialUndo` ya existe en cada `Pestana` pero no se usa. | **L4** |
| `app/src/modelo/tipos.ts` | **241** | Fan-in 122 archivos. 11 dominios mezclados. Bajo blast técnico, alto blast cognitivo (cualquier cambio se propaga). | **L5** |

Bundle post-ronda 8: chunk principal 138 KB / 38 KB gzip; vendor-jointjs separado 469 KB / 129 KB gzip; `feature-asistente` lazy 248 KB / 64 KB gzip (este último cae más en L3 al particionar el wizard).


**Regla de oro continuada**:

> **Patrón `barrel re-export`**: `app/src/modelo/operaciones.ts`, `app/src/render/jointjs/JointCanvas.tsx`, `app/src/ui/AsistenteNuevoModelo.tsx`, `app/src/modelo/tipos.ts` se mantienen como ARCHIVOS PÚBLICOS TOP-LEVEL después del refactor. Su contenido nuevo es: importar de los sub-archivos y re-exportar. Las APIs públicas no cambian. El detector apunta a evidencia real en sub-archivos, no a comentarios señuelo en barrels (lección consolidada ronda 8).

L4 no produce barrel nuevo (no es refactor de archivo, es cambio de wiring). Su contrato es: `commitModelo` mantiene firma pública pero internamente empuja al `historialUndo` de la pestaña activa en lugar del `undoStack` global.

## 5. Contraste opm-extracted ↔ deep-opm-pro

OPCloud opera con ~349 archivos / ~165k LOC sin monolitos críticos. Patrones canónicos destilables relevantes para ronda 9:

| Patrón OPCloud | Path | Aplicación ronda 9 |
|---|---|---|
| **Command/Action pattern** sobre cambios del modelo | `opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30`, `object-decider.ts:5-127` | L1: cada función exportada de `operaciones.ts` es una "acción" pura sobre `Modelo`. La partición sigue el dominio del comando (entidad / enlace / estado / opd / apariencia). |
| **Decider por tipo** | `opm-extracted/src/app/models/components/commands/object-decider.ts:5-88` | L1: la signatura `validarFirmaEnlace` es un decider sobre `TipoEnlace`. Queda en `enlaces.ts` del L1. |
| **Wizard por etapa** | `opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts` (creación de elementos) y módulos de UI con steps | L3: cada etapa del asistente es un componente disjunto con validación local y datos parciales. |
| **Event handlers por familia** | `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts:5-65` (4 métodos disjuntos) | L2: handlers de JointJS particionables por familia (selección, zoom, pan, rubber band, teclado, drag). |
| **Tipos compartidos por dominio** | OPCloud separa `models/json.model.ts:6-611`, `models/Logical/AggregationLink.ts`, `models/DrawnPart/Links/AggregationLink.ts:33` — cada dominio tiene sus tipos al lado del comportamiento | L5: `tipos.ts` se parte en `tipos/{entidad,enlace,estado,opd,apariencia,modelo,workspace,abanico,plegado,opl,ui}.ts` siguiendo el dominio. |
| **Undo per-tab/context** | OPCloud `context.service.ts:5-130` orquesta el contexto activo con su propia historia | L4: `historialUndo: HistorialEntrada[]` ya existe en `Pestana` (ronda 7); falta cablear `commitModelo` para empujar ahí en lugar del singleton runtime. |

Patrones que NO se transfieren (heredados de ronda 8): Angular DI, RxJS, MongoDB/Firestore, Rappid commercial, megamódulos.

## 6. Visión general de las 5 líneas

| ID | Título | Deuda que cierra | Módulo nuevo creado | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Operaciones por dominio (`operaciones.ts` 1743→<200 barrel) | Monolito congelado desde ronda 4 | `modelo/operaciones/{creacion,refinamiento,entidad,estados,enlaces,apariencias,eliminacion}.ts` + helpers compartidos | XL | **alto** |
| **L2** | Handlers JointCanvas por familia (`JointCanvas.tsx` 697→<200 barrel) | Componente con 6+ familias de handlers mezcladas | `render/jointjs/handlers/{seleccion,zoom,pan,rubberBand,teclado,drag,hoverOpl,toolsEnlace}.ts` | L | medio-alto |
| **L3** | Asistente por etapa (`AsistenteNuevoModelo.tsx` 935→<200 barrel) | 12 etapas en TSX único; chunk lazy `feature-asistente` 248 KB | `ui/asistente/{Bienvenida,Etapa01..Etapa10,Confirmar,Asistente}.tsx` + `ui/asistente/validaciones/*.ts` | L | medio |
| **L4** | Undo per-pestaña (sin archivo nuevo, cambio interno) | Stack undo global compartido entre pestañas (deuda ronda 7) | (modifica `store/runtime.ts`, `store/modelo.ts` ligeramente, `store/pestanas.ts`); HistorialEntrada ya existe | M | bajo técnico, **alto cognitivo** |
| **L5** | Tipos por dominio (`modelo/tipos.ts` 241→<100 barrel) | Tipos mezclados con fan-in 122 | `modelo/tipos/{entidad,enlace,estado,opd,apariencia,modelo,workspace,abanico,plegado,opl,ui,comunes}.ts` | M | bajo |

Quedan fuera de ronda 9:

- **`app/src/store/modelo.ts`** (1622 LOC): emergente post-ronda 8. Choca con L4 si se sub-particiona ahora (ambos tocan `commitModelo`). Diferido a ronda 10 si crece más.
- **HU de kernel pendientes**: `enlace.subtipo`, `enlace.modificadorNot`, slot de valor numérico EPICA-17, multiplicidad avanzada EPICA-15, imágenes EPICA-19, sub-modelos EPICA-32, plantillas EPICA-33. Son features, no refactor. Ronda 10 puede ser la primera ronda **de features** post-MVP-α.
- **EPICA-60 export PDF**, **EPICA-61 export SVG papel**, **EPICA-71 CSV import**: requieren librerías nuevas; bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-70 OPCAT**, **EPICA-91 tutorial**: descartadas del proyecto.
- **Endurecimiento del boundary JointJS**: bajo valor inmediato; pospone.
- **Refactor de `mapaSistema.ts` (499 LOC)**: bajo blast, modularización pendiente; candidato menor a ronda 10.

## 7. Mapa de archivos por línea

Convención: `aditivo` = solo agregar imports/re-exports; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; `barrel` = el archivo se reduce a re-exports; `wiring` = se modifica la implementación interna sin tocar la API pública; vacío = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/operaciones.ts` | **barrel** (1743→<200) | lectura | lectura | lectura | lectura |
| `app/src/modelo/operaciones/creacion.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/refinamiento.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/entidad.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/estados.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/enlaces.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/apariencias.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/eliminacion.ts` | **nuevo** | — | — | — | — |
| `app/src/modelo/operaciones/helpers.ts` | **nuevo** opcional (para helpers compartidos entre dominios) | — | — | — | — |
| `app/src/modelo/operaciones.test.ts` | LECTURA (preservar intacto) | — | — | — | — |
| `app/src/render/jointjs/JointCanvas.tsx` | lectura | **barrel** (697→<200) | lectura | lectura | lectura |
| `app/src/render/jointjs/handlers/seleccion.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/zoom.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/pan.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/rubberBand.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/teclado.ts` | — | **nuevo** opcional (si se centralizan keys del paper) | — | — | — |
| `app/src/render/jointjs/handlers/drag.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/hoverOpl.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/toolsEnlace.ts` | — | **nuevo** | — | — | — |
| `app/src/render/jointjs/handlers/helpers.ts` | — | **nuevo** opcional (jointSelector, multiEvento, ctrlEvento, shiftEvento, dimensiones, etc.) | — | — | — |
| `app/src/ui/AsistenteNuevoModelo.tsx` | lectura | lectura | **barrel** (935→<200) | lectura | lectura |
| `app/src/ui/asistente/Bienvenida.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaFuncionPrincipal.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaBeneficiario.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaAtributo.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaHandler.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaNombreSistema.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaHerramientas.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaEntradas.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaSalidas.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaAmbientales.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/EtapaConfirmar.tsx` | — | — | **nuevo** | — | — |
| `app/src/ui/asistente/Asistente.tsx` | — | — | **nuevo** (orquestador con switch por etapa) | — | — |
| `app/src/ui/asistente/estilos.ts` | — | — | **nuevo** opcional (objeto `S` compartido) | — | — |
| `app/src/ui/asistente/validaciones.ts` | — | — | **nuevo** opcional (helpers de validación de campos) | — | — |
| `app/src/store/runtime.ts` | lectura | — | — | **wiring** (commitModelo, undo/redo per-pestaña) | — |
| `app/src/store/modelo.ts` | lectura | — | — | aditivo (selector cache si necesario) | lectura |
| `app/src/store/pestanas.ts` | — | — | — | **wiring** (gestionar historialUndo activo en cambio de pestaña) | — |
| `app/src/store/runtime.test.ts` | — | — | — | **nuevo opcional** o ampliar (cubrir undo per-pestaña) | — |
| `app/src/modelo/tipos.ts` | lectura | lectura | lectura | lectura | **barrel** (241→<100) |
| `app/src/modelo/tipos/comunes.ts` | — | — | — | — | **nuevo** (Id, PestanaId, Posicion, Resultado<T>) |
| `app/src/modelo/tipos/entidad.ts` | — | — | — | — | **nuevo** |
| `app/src/modelo/tipos/estado.ts` | — | — | — | — | **nuevo** |
| `app/src/modelo/tipos/apariencia.ts` | — | — | — | — | **nuevo** |
| `app/src/modelo/tipos/enlace.ts` | — | — | — | — | **nuevo** |
| `app/src/modelo/tipos/abanico.ts` | — | — | — | — | **nuevo** |
| `app/src/modelo/tipos/opd.ts` | — | — | — | — | **nuevo** |
| `app/src/modelo/tipos/modelo.ts` | — | — | — | — | **nuevo** (Modelo, VersionResumen) |
| `app/src/modelo/tipos/pestana.ts` | — | — | — | — | **nuevo** (Pestana, OrigenPestana, HistorialEntrada) |
| `app/src/modelo/tipos/opl.ts` | — | — | — | — | **nuevo** opcional |
| `app/src/modelo/tipos/ui.ts` | — | — | — | — | **nuevo** (UiPortapapelesVisual, PreferenciasUiUsuario) |
| `app/vite.config.ts` | — | — | — | — | — |
| `app/e2e/opm-smoke.spec.ts` | — | aditivo (smoke nuevo si la partición altera selectores) | aditivo (smoke por etapa si selector cambia) | aditivo (smoke undo cross-pestaña) | — |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `docs/HANDOFF.md` | — | — | — | — | — |
| `docs/historias-usuario-v2/**` | — | — | — | — | — |

Reglas de colisión:

- **`operaciones.ts`** lo toca solo L1 (barrel). Otros consumidores (38) siguen importando desde `operaciones.ts` sin cambios.
- **`JointCanvas.tsx`** lo toca solo L2 (barrel). `App.tsx` y composers L2 ronda 8 lo siguen consumiendo sin cambios.
- **`AsistenteNuevoModelo.tsx`** lo toca solo L3 (barrel). `App.tsx` lo consume sin cambios.
- **`tipos.ts`** lo toca solo L5 (barrel). Los 122 consumidores siguen importando desde `tipos.ts`.
- **`runtime.ts` + `pestanas.ts`** los toca solo L4 (wiring interno). `commitModelo` mantiene firma; el cambio es dónde empuja.
- **`opm-extracted/`** es lectura universal; ninguna línea modifica nada ahí.
- **`docs/HANDOFF.md`** y `docs/historias-usuario-v2/` son intocables.

## 8. Protocolo de conciliación (orden de merge)

Orden sugerido: **L_scaffolding (reglas detector tolerantes) → L1 → L5 → L2 → L3 → L4 → L_consolidación (medición + cascadas + handoff)**.

Rationale (`urn:fxsl:kb:icas-lifecycle` — deuda categorial):

1. **L1 primero** (alto blast): el monolito más antiguo y crítico. Worktree dedicado obligatorio. Aterrizar primero permite que las cascadas se absorban antes de las líneas de bajo blast. La adjunción `forgetful/free` se prueba sobre la superficie más cargada (38 consumidores).
2. **L5 segundo** (bajo blast pero fan-in 122): valida el patrón sobre la superficie con mayor fan-in. Si L5 falla aquí, las demás se detienen porque cualquier slice nuevo eventualmente importa de `tipos.ts`.
3. **L2 tercero** (medio blast): partir `JointCanvas.tsx`. Composers L2 ronda 8 dieron piso. No depende de L1 (no llama operaciones directamente — el store sí lo hace).
4. **L3 cuarto** (medio blast): partir `AsistenteNuevoModelo.tsx`. UI aislada del kernel; lee del store sin tocar.
5. **L4 quinto** (bajo blast técnico, alto blast cognitivo): undo per-pestaña. Toca `runtime.ts` que muchos slices leen pero ninguno edita. Reservar al final para que L1-L3 hayan validado patrones.


Chequeo de contrato por merge:

- **Export surface**: verificar consumidores via `grep`/`rg` para cada barrel tocado y mantener cada export público previo, incluyendo tipos públicos.
- **Behavioral surface**: misma entrada produce mismo JSON serializado, mismas líneas OPL, mismo orden/id/type/metadata `opm` en `JointCellJson`, mismos `data-testid` y mismas acciones Zustand observables.
- **Undo surface (L4 específico)**: `commitModelo(modelo)` → `puedeDeshacer === true`; `deshacer()` → modelo previo; `cambiarPestanaActiva(otra)` → `undoStack` cambia al `historialUndo` de la nueva pestaña; `commitModelo` en pestaña B no afecta `historialUndo` de pestaña A.
- **Detector surface**: si se preserva un string por compatibilidad, debe estar conectado a una regla tolerante o test/golden; no se aceptan comentarios sin evidencia real como sustituto de implementación.

## 9. Anclaje obligatorio a SSOT y opm-extracted

Antes de codificar cada línea, leer:

- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-iso-19450-es.md`: glosario y axiomas. Más relevante para L1 (operaciones de modelo).
  - `metodologia-opm-es.md`: workflow de creación de modelos. Más relevante para L3 (asistente).
  - `opm-visual-es.md`: V-1 a V-240. Más relevante para L2 (handlers de canvas).
  - `opm-opl-es.md`: D5-D8, T1-T3, TS1-TS3. Lectura solo en L1 (firmas de enlace).
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Módulos puntuales citados en cada brief con paths absolutos desde repo root + líneas.
- HANDOFF y briefs de rondas 1-8 (leer `docs/HANDOFF.md §Decisiones Vigentes` y `§Cascadas Gestionadas`). Ronda 8 documentó el patrón canónico barrel + slices que ronda 9 extiende.

Si SSOT y OPCloud difieren, manda SSOT. OPCloud operacionaliza; no redefine semántica.

## 10. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-operaciones-dominios.md](./linea-1-operaciones-dominios.md) |
| L2 | [linea-2-jointcanvas-handlers.md](./linea-2-jointcanvas-handlers.md) |
| L3 | [linea-3-asistente-etapas.md](./linea-3-asistente-etapas.md) |
| L4 | [linea-4-undo-per-pestana.md](./linea-4-undo-per-pestana.md) |
| L5 | [linea-5-tipos-dominios.md](./linea-5-tipos-dominios.md) |

Prompt para asignar líneas: [prompt-asignacion.md](./prompt-asignacion.md).

## 11. Verificación al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
```

Métricas esperadas post-ronda 9 (sobre base post-ronda 8: 558 unit / 2357 expect, 40/40 smoke, chunk principal 138 KB / 38 KB gzip, detector 55/55 reglas):

- **`modelo/operaciones.ts` < 200 LOC** (barrel). Reducción ≥ 88% del actual 1743 LOC.
- **`render/jointjs/JointCanvas.tsx` < 200 LOC** (barrel). Reducción ≥ 71% del actual 697 LOC.
- **`ui/AsistenteNuevoModelo.tsx` < 200 LOC** (barrel). Reducción ≥ 78% del actual 935 LOC.
- **`modelo/tipos.ts` < 100 LOC** (barrel). Reducción ≥ 58% del actual 241 LOC.
- **Sub-archivos por dominio < 350 LOC cada uno**. Máximo aceptable < 500 LOC con desviación declarada.
- **Bundle**: chunk principal y vendor chunks dentro de tamaños comparables a ronda 8 (no regresión). L3 puede reducir chunk lazy `feature-asistente` de 248 KB a ~150 KB si la partición permite tree-shaking por etapa.
- **Undo per-pestaña funcional**: cambiar de pestaña preserva historial independiente; `puedeDeshacer`/`puedeRehacer` reflejan stack de la pestaña activa; commits en pestaña A no contaminan historial de pestaña B.
- **Unit tests ≥ 558 verdes** (sin regresión). **Tests nuevos esperados: ~30-50** distribuidos entre L1 sub-archivos, L2 handlers, L3 etapas, L4 undo cross-pestaña. Total razonable ≥ 590.
- **Smoke browser ≥ 40 verdes** (sin regresión). Idealmente +1-2 smokes nuevos en L4 (undo cross-pestaña) y L2 (rubber band si selector cambia).
- **APIs públicas sin cambios**: cada barrel re-exporta exactamente las firmas públicas previas. Tests existentes no se reescriben.
- **Contratos observables sin cambios**: JSON y OPL son carácter-por-carácter equivalentes; `JointCellJson` mantiene orden/id/type/selectores/metadata `opm`; UI mantiene `data-testid`, foco y propagación de eventos; `Pestana.historialUndo` ahora se usa pero su forma serializada no cambia (era ya parte del tipo).
- **`docs/HANDOFF.md` permanece intacto** durante las líneas; se actualiza solo en consolidación final con la nueva forma del repo.

Si una métrica no se cumple, la línea correspondiente lo declara explícito en el reporte y propone meta realista con rationale.
