# Dossier — autoría, tutor, mesa, agente y canon

Área: `app/src/autoria` (incluye `compilar/`), `app/src/tutor`, `app/src/mesa`,
`app/src/agent`, `app/src/canon`, `app/scripts/generar-corpus-tutor.ts`,
`app/scripts/mesa-cli.ts`, `app/scripts/render-tutor-markdown.ts`. Para explicar
el sentido de las piezas también se leyó lo que las consume o completa:
`src/modelo/mesaExploracion.ts`, `src/modelo/tipos/extensiones.ts`,
`src/server/agent/*`, `src/ui/TutorDetails.tsx`, `src/ui/useTutorContent.ts`,
`scripts/render-headless.ts`, `scripts/verify-reproducible.ts`,
`scripts/cordon-estado.ts`, `docs/canon-opm/resolutor-urn.json`, el acta
`docs/auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` y las
especificaciones del tutor (`2026-07-21`) y del puente mesa↔skill (`2026-07-06`).

Verificación hecha: `bun test src/autoria src/tutor src/mesa src/agent src/canon
scripts/render-tutor-markdown.test.ts` da **467 pass / 0 fail** (39 archivos).
Los tests del canon se saltan en silencio porque KORA no está montado
(`[resolutorUrn] SSOT no montada…`). También se corrieron *probes* propios del
compilador, fuera del repo, en `scratchpad/probe-*.ts`. Con ellos se confirmaron
tres defectos semánticos (§4.7). No se editó nada del repositorio.

---

## 1. Resumen ejecutivo

| Pieza | Qué es realmente | Necesidad real que resuelve | Veredicto global |
|---|---|---|---|
| **autoría (DSL + bundle + layout)** | Librería *headless* para construir un `Modelo` OPM desde código y emitir un bundle `deep-opm-pro.modelo.v0` validado, con OPL, reporte y layout canónico | Que un repositorio de dominio externo (hd-opm/HODOM) genere modelos multi-OPD grandes y reproducibles, sin la UI | **simplify**: el núcleo DSL→bundle es valioso; lo que sobra es la ceremonia de byte-identidad y las variantes de API pedidas desde upstream |
| **autoría/compilar (proto→modelo)** | Compilador de un «proto-modelo» (markdown con bloques ```opl en sub-dialecto OPL-ES laxo) hacia el DSL, con ledger de trazabilidad por línea | Bootstrap de un modelo multi-OPD desde un documento de modelado escrito por humano o LLM, conservando las citas normativas | **simplify fuerte / redefinir**: ~4k líneas de heurísticas léxicas acopladas a un corpus concreto (HODOM, adjudicaciones «dov-dori»). Tiene defectos semánticos verificados |
| **tutor** | Capa determinista de ayuda contextual: *snapshot* de la intención de UI → política → `contentId` → texto (ahora/criterio) y enlaces a fuentes canónicas materializadas | Enseñar el método y la consecuencia en el punto del gesto, sin chat ni LLM | **simplify fuerte**: el valor está en `contenidos.ts` y `fuentes.ts`. ~2,3k líneas (`capacidades`, `escenarios`, `auditoria`) solo existen para que los tests se auditen a sí mismos |
| **mesa (`src/mesa`)** | Lógica pura del **puente mesa↔skill**: `mesa pull` / `mesa push` desde un CLI hacia el backend de producción, con Testigo-Base, guard sin delta, carril por procedencia y especie | Que la skill externa `modelamiento-opm` (Claude Code o Codex) lea y escriba modelos de la instancia sin copiar bytes a mano ni pisar trabajo humano | **keep núcleo / simplify**: la semántica de concurrencia (testigo + 409 + no-op) está bien resuelta; hay wrappers y *workarounds* de almacenamiento |
| **mesa de exploración** (`src/modelo/mesaExploracion.ts`, no está en `src/mesa`) | Extensión meta del Apunte: fuentes de texto, trazos, propuestas pendientes y confirmaciones que crean **un** hecho OPM por el kernel | Capturar material preformal sin contaminar el modelo | **keep, reevaluar alcance**: v1 solo confirma `crear-entidad` |
| **agent (`src/agent`)** | Contratos compartidos cliente↔servidor del agente LLM integrado: `ChangeSet`, `Base`, `CommitReceipt`, `TaskIntent`, estado de tarea, presupuesto y perfil de capacidades. El runtime vive en `src/server/agent` (~9,7k líneas con UI y cliente) | Tareas agénticas acotadas, con propuesta, validación y commit revisable sobre el documento | **keep contratos / simplify perfil**. El agente es el eje declarado del «producto integrado» (sin desplegar) |
| **canon** | Lector del mapa URN→ruta KORA (`resolutor-urn.json`), lectura de la «doctrina» para un hash y parser del sello `kora:sello` de la skill desplegada | Anclar la app a las versiones del corpus metodológico externo (KORA) y detectar skill *stale* | **cut / mover a tooling**: nada del runtime del producto lo usa; `doctrina.ts` no tiene consumidor fuera de su test |
| **scripts** | Generación del corpus del tutor (lee KORA y los manuales del repo, valida hash y anclas, materializa HTML), renderer markdown y CLI de mesa | Servir las fuentes que cita el tutor y operar el puente | `generar-corpus-tutor` + `render-tutor-markdown`: **simplify**. `mesa-cli`: **keep delgado** |

**Dependencias externas ausentes en este entorno**: KORA
(`/home/felix/kora-knowledge`, codificado en `docs/canon-opm/resolutor-urn.json`
como `kora_raiz_default`), el repositorio de dominio hd-opm (consume
`app/src/autoria` por ruta, según el acta de 2026-06-04) y la skill
`modelamiento-opm` con sus emisiones `claude-code` y `codex`. Como consecuencia,
**`bun run dev` y `bun run build` no funcionan sin KORA**: los dos invocan
`tutor:corpus`, que hace `readFileSync` de las fuentes canónicas URN
(`generar-corpus-tutor.ts:53-63`). La única salida es `TUTOR_CORPUS_PREBUILT=1`
con un corpus ya generado o `TUTOR_CANON_ROOT`.

---

## 2. Inventario de módulos

LOC de producción (sin `*.test.ts`) y consumidores reales encontrados con grep.

### 2.1 `src/autoria` (~6,95k de producción; ~4,9k de tests)

| Archivo | LOC | Propósito | Consumidores de producción | Rec. |
|---|---:|---|---|---|
| `index.ts` | 40 | Barrel público de la librería (contrato hacia hd-opm) | hd-opm (externo) | keep (API reducida) |
| `tipos.ts` | 124 | `EntKey`, `OpdKey`, `ExtremoEntrada`, `OpcionesEnlace`, `OpcionesAncla`, `OpcionesBundle`, `ResultadoBundle` | DSL, bundle | keep/simplify |
| `dsl.ts` | 736 | `crearAutor()`: DSL imperativo por *closure*, con ids propios (`o-/p-<key>`, `opd-<key>`, `s-<key>-<slug>`, `e-N`, `a-N`, `ae-N`, `anc-N`) | compilador, fixtures, tests de leyes | simplify |
| `bundle.ts` | 181 | `emitirBundle()`: layout → export → hidrata → reexporta (round-trip estable) → diagnóstico → contención → OPL por OPD → reporte markdown | scripts `render-headless` y `verify-reproducible`, hd-opm | keep (núcleo) |
| `contencion.ts` | 64 | Clasificación geométrica interna/externa por **rol declarado** (ley L7) | bundle, test de leyes | keep |
| `layout.ts` | 791 | Motor de layout «orden canónico»: bandas por nivel topológico de invocaciones, externos por rol, unfold en filas, raíz plana radial, contorno ajustado al contenido y a la elipse, centrado en el lienzo | bundle | simplify (unificar con `canvas/layoutSugerido`) |
| `procedencia.ts` | 145 | FNV-1a 64 bits (`hashContenido`), `construirSello`, `hashDoctrina`, `compararProcedencia` | scripts, estructura, resolutor, estabilizarIds | keep `hashContenido`; simplify el resto |
| `reproducibilidad.ts` | 100 | Comparación byte a byte de un bundle contra un golden, con diff de líneas y causa por sello | `verify-reproducible.ts` | cut (tooling externo) |
| `compilar/tipos.ts` | 236 | Contrato del normalizador: `LineaNormalizada`, `Directiva`, `Emision`, `Ancla`, `ContextoProto`, `ReglaT2`, `CategoriaRechazo` | compilador | simplify |
| `compilar/estructura.ts` | 298 | Lector de estructura: markdown → `PlanEstructura` (OPDs por encabezado y oración `se descompone/despliega`) | compilador | keep la idea, reescribir |
| `compilar/normalizador.ts` | 1340 | Sub-dialecto → OPL-ES estricto. Familias A1..A12/AESS, V1..V17, rechazos R1..R8. Inferencia de tipo por uso global | estructura | **cut/rehacer** |
| `compilar/annotations.ts` | 183 | Extracción de anclas inline: citas normativas por forma, `[RATIFICAR…]`, `[C1]` | normalizador | keep (aislado) |
| `compilar/anclas.ts` | 224 | Ancla → `AnclaNormativa` con target y `claveProto` estable; contabilidad L8 | compilador | simplify |
| `compilar/resolutor.ts` | 219 | Nombre → clave de dominio (crear/reusar/proyectar por OPD); guard R9 de residuo no nominal | compilador, emisor | keep la idea |
| `compilar/emisor.ts` | 1196 | AST del parser OPL → llamadas DSL, directivas familia V, dedup y adjunción de eventos, herencia de clase en agregación, re-junta de nombres con « y » | compilador | **rehacer** |
| `compilar/compilador.ts` | 395 | Orquestación de las 4 etapas + ledger L2 + resumen | scripts, hd-opm | simplify |
| `compilar/estabilizarIds.ts` | 150 | Re-id de enlaces por hash de su firma semántica (`e-<fnv>`) y de abanicos (`ab-<fnv>`) | compilador | keep (buena idea) |
| `compilar/absorcion.ts` | 57 | Detecta duplicados «X» / «X (sufijo)» | **solo tests** | cut o mover a diagnóstico |
| `compilar/usoFamiliaV.ts` | 156 | Métricas de uso de la familia V y proyección observable para comparar equivalencias | **solo tests** | cut |
| `compilar/familia-v-e2.fixtures.ts` | 252 | Fixtures de equivalencia laxo↔E2 (fuera de `*.test`) | tests | cut |
| `_fixtures/cafetera.ts` | 65 | Fixture de dominio demo | tests | keep como fixture |

### 2.2 `src/tutor` (~4,9k de producción; ~0,93k de tests)

| Archivo | LOC | Propósito | Consumidores de producción | Rec. |
|---|---:|---|---|---|
| `tipos.ts` | 634 | 14 uniones de `*IntentSnapshot`, `TutorIntervention`, `TutorContent`, `TutorSource`, `CapabilityDescriptor`, `TutorCut` (1A..7C) | UI (26 archivos), política | simplify fuerte |
| `politica.ts` | 369 | `runTutorPolicy(snapshot, claims)`: candidatos por snapshot → prioridad → tipo de intervención (`block/ask/confirm/orient/silent`) | UI (32 llamadas) | simplify |
| `adaptadores.ts` | 348 | `derive*Intent(state)`: estado de UI → snapshot con `actionId`/`surface` literales | UI | cut (fusionar con la política) |
| `contenidos.ts` | 883 | 48 `TutorContent` (momento, ahora, criterio, referencias a fuentes, detalle por lente systems/software/health), búsqueda | UI (carga diferida) | **keep (contenido)** |
| `fuentes.ts` | 415 | 23 `TutorSource`: 5 canónicas por URN KORA (con versión) y 18 del repo (con **sha256 fijado en el código**), anclas por heading | tutor, `server/agent/tools.ts` (`search_rules`), generador de corpus | keep, simplificar integridad |
| `capacidades.ts` | 806 | 41 `CapabilityDescriptor` (cut, status, behavior, owners, effects/recovery, limits, silentWhen), catálogo de entrypoints, cobertura por corte | **solo tests** (`registro.test.ts`) | **cut** |
| `escenarios.ts` | 1060 | `TUTOR_SCENARIOS`: pares snapshot → intervención esperada, con evidencia e2e declarada | **solo tests** | **cut** (o reducir a tabla de tests) |
| `auditoria.ts` | 395 | `auditTutorRegistry()`: cruza capacidades, contenidos, escenarios, entrypoints, fuentes y cortes | **solo tests** | **cut** |
| `index.ts`, `contenidoRuntime.ts` | 7 | Barrel síncrono y *entry* diferido del corpus | UI | keep |

### 2.3 `src/mesa` (puente mesa↔skill, ~0,7k de producción)

| Archivo | LOC | Propósito | Consumidores | Rec. |
|---|---:|---|---|---|
| `baseWitness.ts` | 160 | `MesaBaseWitnessV1` (Testigo-Base): huella sha256 del guardado y del autosave, fuente elegida, codificación `mesa-v1.<base64url>` | CLI, `server/modelPersistence`, `repoMemoria`, `server/agent/*Repository`, `validatePersistence` | **keep** |
| `contextoPull.ts` | 65 | `elegirBase` (el autosave gana solo si es estrictamente más nuevo) y `componerPull` (encabezado + `exportarContextoSkill`) | CLI | keep |
| `validarPush.ts` | 70 | `evaluarPush`: contrato de import, especie al crear, biblioteca de solo lectura, carril por sello, base autosave exige confirmación | CLI, `server/modelPersistence` | keep |
| `esSinDelta.ts` | 60 | Guard de clausura: `exportarModelo(hidratar(a)) === exportarModelo(hidratar(b))` | CLI, servidor | keep |
| `especieWorkspace.ts` | 73 | Cruce especie ← índice de workspace; `establecerEspecieCreada`; `registrarVersionEnWorkspace` | CLI, `repoMemoria`, `store/persistencia` | simplify (*workaround* de almacenamiento) |
| `construirBodyActualizacion.ts` | 34 | Wrapper 1:1 de `construirModeloPersistido` | CLI | **cut** |
| `historialAgente.ts` | 45 | Agrupa versiones `agente·*` consecutivas en una «sesión» | UI (diálogo de versiones) | keep/simplify |
| `revisionVitrina.ts` | 27 | `evaluarVitrina`: chip «revisión nueva» | UI | keep |
| `timestampOrder.ts` | 9 | `isValidTimestamp`, `isTimestampAfter` | varios | keep |

### 2.4 `src/agent` (~0,54k)

| Archivo | LOC | Propósito | Rec. |
|---|---:|---|---|
| `contracts.ts` | 66 | `Target`, `Base`, `Dependency`, `TaskIntent`, `ChangeSet`, `CommitReceipt`, `TaskEvent` | **keep** (contrato cliente↔servidor↔BD) |
| `taskState.ts` | 92 | Máquina de estados de tarea, etiquetas es-CL, `TaskBudget`/`TaskUsage`, `DEFAULT_TASK_BUDGET`, `exhaustedTaskBudget` | keep |
| `taskView.ts` | 42 | `StartTaskRequest`, `TaskView` (proyección para el navegador, sin credenciales), `AppliedChangeView` | keep |
| `changeProjection.ts` | 19 | `projectChangeDiff`: diff semántico + OPL antes/después por OPD | keep |
| `markdownSource.ts` | 41 | Decodificación UTF-8 estricta y *byte-preserving* de un `.md` adjunto (≤128 kB) | keep |
| `capabilityProfile.ts` | 116 | `AGENT_CAPABILITY_PROFILE = "opforja-agent-authoring-v3"`, matriz construcción×capacidad con ruta de test como «evidencia», lista de operaciones permitidas | simplify |
| `fixtures/order.ts` | 82 | Fixture de kernel (pedido con XOR y refinamiento) | keep como fixture |

### 2.5 `src/canon` (~0,2k)

| Archivo | LOC | Propósito | Consumidores | Rec. |
|---|---:|---|---|---|
| `resolutorUrn.ts` | 39 | Lee `docs/canon-opm/resolutor-urn.json` **al importar** (node:fs); `koraRaiz()` desde `KORA_RAIZ` o el default; `resolverUrn` | `scripts/cordon-estado.ts`, `doctrina.ts` | mover a tooling |
| `doctrina.ts` | 41 | Lee las 4 SSOT en orden canónico para `hashDoctrina` | **nadie fuera de su test** | cut |
| `selloSkill.ts` | 122 | Parser de `<!-- kora:sello … -->`, veredicto ok/advertencia/fallo/skip, hashes esperados de la skill por runtime | `scripts/cordon-*.ts` | mover a tooling |

---

## 3. Historia y decisiones que moldearon el área

- **Git no conserva la historia larga.** El log de `main` tiene 69 commits y
  arranca el 2026-07-26 con un *squash* («docs(handoff): registrar smoke final
  exacto»). `src/mesa` tiene un solo commit y `src/agent` también (2026-09-30).
  La procedencia real está en documentos: actas, specs y notas de las olas W1..W6,
  F0..F5 e I1.
- **Acta de 2026-06-04 (flujo canónico dominio→OpForja).** Reconcilia dos líneas:
  - Línea A: hd-opm, con glosario + proto-modelo MD → `generar-bundle-hodom.ts` →
    bundle, consumiendo `app/src/autoria/` desde 2026-06-03.
  - Línea B: OpForja, con kernel + OPL bimodal + canvas.

  Decide que `autoria/` es «EL compilador del flujo» (D3), con 4 etapas. Conserva
  la **byte-identidad** del golden HODOM (262 entidades / 192 estados / 433 enlaces
  / 36 OPDs) con re-pin gobernado (D6). Crea `AnclaNormativa` como tipo de primera
  clase (D2/L8) y el sello de procedencia (D7/L6). Declara L1..L8 como leyes.
  Varias decisiones de esa acta **explican directamente la complejidad actual**:
  - el DSL escribe bytes a mano en vez de usar las operaciones del kernel, para
    preservar el golden (`dsl.ts:5-25`, «vía b»);
  - hay dos motores de layout, porque fusionarlos cambiaría bytes o píxeles
    (`layout.ts:8-19`, TODO D5 nunca cerrado);
  - los spreads condicionales del tipo «ausente ⇒ byte-identidad» están en todas
    partes (`bundle.ts:102-106,143-180`, `procedencia.ts:93-97`).
- **Adjudicaciones «dov-dori» (2026-06-05) y sesión W4.3 (2026-06-04).** Añaden
  la familia V (V1..V17) y los rechazos R8/R9 a partir de un segundo dominio
  (urbanismo: LGUC/OGUC). F5-parcial (2026-06-08) **retira** V3/V4/V5/V7, con
  prueba de equivalencia byte a byte. Se retira también la cola `según` por
  pérdida silenciosa (auditoría 2026-06-09). El glosario se elimina el
  2026-06-09 y el sello pasa de 4 a 3 componentes. Estas decisiones dejaron
  residuos: constantes y funciones que registran reglas retiradas
  (`usoFamiliaV.ts:53-54 MIGRABLE_ESTRICTO_F2`) y comentarios que remiten a
  documentos «retirado 2a83c1c5, en git» que ya no existen en el árbol.
- **Puente mesa↔skill (2026-07-06, protocolo 2.0 desplegado el 2026-07-18).**
  Tiene tres verbos, `especieDe()` y el carril por procedencia. Reemplaza el
  *optimistic locking* por Testigo-Base + commit atómico `POST
  /modelos/:id/revisiones`. Formaliza las leyes *counit* (`pull∘push` preserva),
  *clausura* (`push∘pull` sin delta = no-op) y *fast-forward* (409).
- **Tutor contextual (2026-07-21, enmendado el 2026-07-27).** Se diseña una
  «capa determinista» que «calla, confirma, orienta, pregunta o bloquea». La
  autoridad se despacha por plano hacia las cinco SSOT de KORA, con cobertura
  «exhaustiva por debajo» y cortes 1A..7C. Esto último es lo que genera
  `capacidades`, `escenarios` y `auditoria`.
- **Producto integrado (spec 2026-09-10, roadmap I1).** El agente pasa a ser
  «constitutivo desde el primer incremento». El 2026-09-30 se integran las
  tareas revisables. El candidato no está desplegado y falta la prueba con la
  API real (`docs/roadmap/README.md`).
- **Cordón con KORA (C1..C3, D4).** El resolutor URN queda como datos puros, la
  doctrina tiene un hash opcional en el sello y se verifica el sello de la skill
  desplegada. Todo esto es gobernanza entre repositorios, no producto.

---

## 4. Autoría (`src/autoria`)

### 4.1 Qué es y para quién

Es una librería **dominio-agnóstica y headless** (su test de arquitectura prohíbe
importar `app|canvas|persistencia|render|server|store|ui`:
`arquitectura.test.ts:16`). Hace dos cosas:

1. **DSL programático** (`crearAutor`). Sirve para escribir un generador de
   modelo en TypeScript, que es lo que hacía hd-opm.
2. **Emisión** (`emitirBundle`). Aplica el layout canónico, prueba el round-trip,
   aplica la política de diagnóstico (la llama «canon»; es la de
   `modelo/diagnosticoSeveridad`, no KORA), verifica contención y produce el JSON
   importable, el OPL y un reporte.

Dentro de este repositorio solo la usan `scripts/render-headless.ts` (da «ojos» a
un agente: PNG/SVG por OPD) y `scripts/verify-reproducible.ts`. Ningún código del
runtime del producto (store, UI, servidor) la importa. Su consumidor principal es
**externo**: hd-opm, que la importa por ruta relativa del filesystem. Eso es una
dependencia de código fuente entre repositorios, no un paquete.

### 4.2 DSL — contrato y decisiones

Interfaz `Autor` (`dsl.ts:73-188`): 27 miembros. Puntos que importan:

- **Esquema de ids propio**: `opd-${key}` (`:239`), `o-|p-${key}` (`:261-262`),
  `s-${key}-${slug(nombre)}` (`:294`), `a-${n}`, `e-${n}`, `ae-${n}`, `anc-${n}`.
  `nextSeq` arranca en 10000 (`:209`). Los ids posicionales `e-/a-/ae-` los
  estabiliza por hash `estabilizarIds.ts` solo en la ruta del compilador.
- **Escritura directa sin pasar por el kernel** para entidades y apariencias. La
  validación del kernel se compone solo en `enlazar` (`validarFirmaEnlace`,
  `:572-580`). Para `abanico`, `autoinvocacion`, `rutaEtiqueta` y `demora` se
  delega en `formarAbanico`, `crearAutoInvocacion`, `definirRutaEtiqueta` y
  `definirDemora`, y el resultado inmutable se vuelca al modelo mutable
  (`:457-468,475-487,605-624`). La deuda está declarada (`:19-25`): crear
  entidades por el kernel cambiaría esencia/afiliación, nombres y apariencias.
- **Consumo de la agregación contorno→subproceso como contención**
  (`:553-560`): `enlazar(opd, refinable, sub, "agregacion")` no crea enlace;
  registra `internosInzoom`. Codifica la regla OPM de que, en un in-zoom, los
  subprocesos son partes del proceso refinado y el enlace de agregación es
  implícito en la contención.
- **Contorno** (`:338-364`): la apariencia del refinable en su OPD de
  descomposición recibe `contextoRefinamiento {tipo:"descomposicion", rol:"contorno"}`
  y un tamaño mínimo de 520×320.
- **Pin de puerto del abanico** (`:433-469`): replica `opl/parser/aplicar.ts:390-405`
  asignando `port-fan-…` a la entidad pivote común. Solo reconoce pivotes
  `kind === "entidad"` (`:491-504`); un abanico cuyo pivote es un **estado** no
  se forma (ver defecto D3).
- **Tres variantes de `aparecerEnlace`** (por extremos+tipo, por id, por
  transición: `:127-144,628-685`), añadidas por pedidos upstream F1/H5. Es
  acreción: basta una sola operación con un selector.
- Sin validación de duplicado en `entidad()`: una clave repetida sobrescribe
  `eid` en silencio (`:260-274`). `opd()` sí valida (`:240`) y `estados()` también
  (`:296-298`).

### 4.3 Emisión del bundle — flujo

`emitirBundle(autor, opciones)` (`bundle.ts:96-181`) **muta** `autor.modelo`
(documentado en `:90-94`):

1. `descripcion` = `opciones.descripcion.join(" ")`; se inyecta `procedencia` si
   viene.
2. `aplicarLayoutCompleto(modelo, internosInzoom, ordenInzoom)`.
3. `exportarModelo` → `hidratarModelo` → `exportarModelo` → `hidratarModelo` →
   exige igualdad de strings, es decir, un **round-trip estable** (`:110-120`).
4. `listarAvisosDiagnostico` → `severidadDiagnostico`. Si hay `bloqueo` y
   `lanzarEnError` (default `true`), lanza (`:122-126`).
5. `verificarContencion`, que combina la clasificación por rol declarado con la
   **rigidez de arrastre**: se mueve el contorno 37×29 y se verifica que las
   internas lo acompañan y las externas no (`:27-67`).
6. OPL por OPD ordenado por `ordenLocal` (`generarOpl`) y reporte markdown con
   conteos, PASS/FAIL, anclas y sello. Si se pide, `modeloTextual` (derivado de
   `exportarOplModeloMarkdown`).

**Calidad**: la verificación de round-trip + contención + diagnóstico es un
*gate* de emisión sólido que vale la pena conservar. El reporte markdown
duplica información que ya existe estructurada.

### 4.4 Layout canónico (`layout.ts`)

Es una única función `aplicarLayoutCompleto` de 734 líneas, con *closures* que
mutan en sitio:

- **Dimensión por texto**: ancho = max(190, 7,4 px/char + 34, suma de cápsulas de
  estado a 8 px/char + 12 (+6 si designada) + gaps), con tope 820. Alto 100 si
  tiene estados y 72 si no (`:79-108`). La métrica está acoplada al render
  (BUG-7ae086).
- **In-zoom de proceso** (`:446-633`):
  - banda Y = nivel topológico en el grafo de **invocaciones** entre subprocesos
    (`:122-140`);
  - los subprocesos *reactivos* (nivel 0 con un enlace `modificador: "evento"`
    entrante) se apilan después de la base (`:477-484`);
  - un orden declarado (`opd.ordenInzoom` o el `ordenInzoom` del DSL) tiene
    prioridad: «eje vertical = línea de tiempo» (`:485-503`);
  - la banda envuelve en varias filas si supera 2100 px con ≥7 ítems;
  - los objetos internos se colocan en *fila abajo* o *columna derecha* según
    cuál minimice el área (`:549-586`);
  - el contorno se ajusta al contenido (`:620-623`) y se infla lo necesario para
    contener la **elipse** inscrita (N-3, `:627-629,688-710`);
  - los externos se colocan por **rol OPM** respecto del subproceso ancla:
    agente → arriba, consumo → izquierda, resultado/efecto → derecha,
    instrumento → abajo (`:155-177`). Los clusters estructurales de externos se
    mantienen juntos (A-2, `:199-259`).
- **Unfold** (`:314-384`): el refinable arriba y las partes en filas con wrap a
  2200 px. «V-78: posición = disposición espacial, no orden temporal». Los drops
  del bus se alinean a huecos (V16-5).
- **Raíz plana** (`:387-427`): el proceso central (de mayor grado) en
  (900,520), el resto por zona de rol y una resolución de solapes iterativa (N-1).
- **Normalización de contextos** (`:730-764`): decide interno/externo con
  `esInternoDeInzoom` (`:646-655`):
  - un interno declarado es interno;
  - un proceso no declarado no es interno;
  - un objeto `ambiental` es externo;
  - un objeto conectado al refinable en el OPD padre es externo;
  - un objeto que aparece en un ancestro es externo;
  - en otro caso es interno solo si lo transforma (consumo/resultado/efecto) un
    interno declarado.
- **Centrado** de cada OPD en (3600,2600) sobre un lienzo de 7200×5200
  (`:767-785`): acoplado a constantes del render.

**Duplicación declarada**: `canvas/layoutSugerido.ts` es «el MISMO funtor
Modelo→Geometría implementado dos veces» con heurísticas distintas
(`layout.ts:8-19`). La reescritura debería tener **un** motor parametrizado. La
colocación de externos por rol OPM es la parte semánticamente superior y es la
que conviene conservar.

### 4.5 Procedencia y reproducibilidad

- `hashContenido` (`procedencia.ts:31-57`): FNV-1a de 64 bits sobre UTF-8, con
  BigInt, síncrono, sin `crypto`. Se usa para claves de entidad (`slug-hash16`),
  claves de OPD, ids de enlace por firma y el `protoHash`. **Portable tal cual.**
- `SelloProcedencia` = `{protoHash, autoriaVersion:"2", layoutVersion:"3",
  doctrinaVersion?}`. `doctrinaVersion` **no lo produce ningún consumidor del
  repo** (`render-headless` y `verify-reproducible` llaman
  `construirSello({protoTexto})`). `hashDoctrina` y `canon/doctrina.ts` son
  código muerto dentro del repo.
- La UI muestra el sello en el inspector vacío (`ui/Inspector.tsx:62-80`) y
  `mesa/validarPush` lo usa como **carril por procedencia**: un modelo nacido de
  un proto solo acepta bundles sellados.
- `reproducibilidad.ts` reemplaza el «ritual md5sum» del dogfood de hd-opm. Es
  tooling de la cadena de un consumidor externo.

### 4.6 Compilador proto→modelo (`autoria/compilar`)

**Entrada**: markdown con encabezados = árbol de OPDs, bloques ```opl = hechos,
prosa = razonamiento que no compila (acta D2). **Salida**:
`{autor, modelo, ledger, resumen}` (`compilador.ts:54-61`). No aplica layout; eso
lo hace `emitirBundle`.

Etapas (`compilador.ts:1-13,101-173`):

1. **Lector de estructura** (`estructura.ts:107-165`). Separa en tokens:
   encabezados, prosa, fences ```opl. El **primer bloque** es el OPD raíz. Un
   bloque con oración `X se descompone|despliega en …` abre un OPD hijo (el
   refinable es el sujeto). Un bloque sin esa oración es **continuación** del
   último OPD abierto. Las claves de OPD vienen del prefijo de código del
   encabezado (`SD1.M2.1 — …` → `sd1-m2-1`, `:288-298`) o de
   `inzoom|unfold-<slug>-<fnv>`. Los miembros de la lista de `se descompone en`
   son los internos (S1, `:209-217`). La tensión con HODOM está documentada en
   `:36-43`.
2. **Contexto global** (`normalizador.ts:107-265 construirContextoProto`). Una
   pasada previa sobre **todo** el proto infiere:
   - estados por entidad, explícitos (`puede estar`) e implícitos por transición;
   - tipo objeto/proceso por uso: sujeto de verbo procedural → proceso, salvo
     `genera`; sujeto de `maneja` → objeto agente; `se descompone` → proceso;
   - clase explícita;
   - universo de nombres conocidos.

   Hay una reconciliación final: un agente se fuerza a objeto (`:252-262`).
3. **Normalizador** (`normalizarLinea`, `:295-381`). Orden de clasificación:
   comentario → atajo de familia-efectos-preestado estricta → extracción de
   anclas → A12 (`u`→`o`) → **estructura** → **familia V** → rechazos tempranos
   R6/R2/R1 (y `puede iniciar` retirado) → A1/A6 (expanden) → A2/A3/A4/A8/A9/AESS
   (1:1) → R8 plural → R3/R7 verbo no canónico → estricta.
4. **Resolutor** (`resolutor.ts:370-517`). Usa `claveNombre` del parser, así que
   la comparación ignora mayúsculas. Distingue *crear* / *reusar* (ya aparece en
   este OPD) / *proyectar* (existe en otro OPD, se hace `ver()`). La semilla de
   tipo del contexto tiene prioridad sobre la sugerencia posicional, salvo
   `forzarTipo`. Tiene un **guard R9**: rechaza crear nombres con paréntesis,
   corchetes o localizador de cita (`:356-368,455-465`).
5. **Emisor** (`emisor.ts`). Pasa la oración por `parsearParrafoOpl` y hace un
   *switch* por `kind` del AST (`:243-276`):
   `descripcion-cosa|estados|procedimental|estructural|evento|condicion|abanico|familia-efectos-preestado|excepcion|designacion-estado`.
   `metadata`, `plegado-parcial` y `contexto` quedan como `excluida` con razón.
   `excepcion` (sobretiempo/subtiempo) queda excluida «sin primitiva» (`:828-835`).
   Las **directivas** (`:1071-1127`) son la vía para lo que el parser inverso no
   relee: enlaces `etiquetado`, instrumento-condición, anotaciones.
6. **Anclas** (`annotations.ts`, `anclas.ts`):
   - `(DS art. N)`, `(NT 2024 §X)`, `(Ley 20.584 art. M)` y citas por *forma*
     (localizador o cuerpo + numeración legal) → `AnclaNormativa{estado:"vigente"}`;
   - `[RATIFICAR #clave: texto]` → `pendiente-ratificacion`;
   - `[C1]`-style → candidata, **nunca** compila.

   El target es el primer enlace creado por la línea, o la entidad principal, o
   el OPD. La `claveProto` es determinista e independiente de la nota.
7. **Estabilización de ids** (`estabilizarIds.ts:67-207`): `e-<fnv(firma
   semántica)>`, con detección de colisión y de «misma identidad, distinta
   presentación». `ab-<fnv(opd,operador,enlaces)>`. Se remapean todas las
   referencias: apariencias, abanicos, pesos, anclas, notas, satisfacciones y
   familias.

**Ledger L2** (`compilador.ts:40-47`): cada línea del markdown cae en un destino
`aplicada|estructura|rechazada|excluida|comentario|estructural-md|fallo`, con sus
anclas. `emitirSegura` convierte cualquier `throw` en `fallo`
(`compilador.ts:346-352`). Es la mejor idea del compilador: **nada se pierde en
silencio**. La implementación no siempre la cumple (ver D3 y D4).

**Gramática y léxico**:

- verbos canónicos (`normalizador.ts:32-51`): `maneja(n) requiere(n) consume(n)
  genera(n) afecta(n) cambia invoca(n) exhibe(n) consta(n)`;
- verbos R3 observados en el corpus: `alimenta, compromete, libera, proyecta,
  restringe, habilita, detecta, determina, cumple, otorga`;
- R7 relacionales: `precede a, acotado por, sucede a, corresponde a`.

Buena parte de la gramática la dictó el corpus HODOM/LGUC (comentarios «tensión
1..5», «SEREMI», «Resumen clínico en domicilio», «Vigilancia y monitorización
clínica»).

### 4.7 Defectos verificados con *probes* (no corregidos)

- **D1 — Una agregación canónica de dos partes crea una sola entidad «A y B».**
  `Cafetera consta de Depósito y Filtro.` produce las entidades `Cafetera` y
  `Depósito y Filtro` (una). `consta de Depósito, Filtro y Jarra.` produce
  `Depósito` y `Filtro y Jarra`. Solo con coma serial se obtienen las tres
  partes. La causa: `segmentosLista` (`normalizador.ts:1307-1321`) registra el
  último segmento completo como «nombre conocido», y `rejuntarDestinos`
  (`emisor.ts:642-667`) vuelve a unir los fragmentos que el parser había separado
  bien. La heurística de nombres compuestos con « y » interno (HODOM) corrompe
  la agregación OPM más básica.
- **D2 — Un unfold de objeto se trata como descomposición de proceso.** En
  `procesarOpd` (`compilador.ts:191-198`), el refinable se resuelve con sugerencia
  `"proceso"` y se llama `promoverAProceso` **sin distinguir** `despliegue`. Si el
  refinable no existía, se crea como `proceso` (`:194-196`). Resultado observado:
  - `Molinillo se despliega en Muela` con Molinillo nuevo crea `p-molinillo` y
    `p-muela`, dos procesos, con `refinamientos.despliegue` sobre un proceso;
  - con `Cafetera` objeto ya existente, la parte hereda la clase «proceso» del
    todo promovido y `consta de` **falla** con «Agregación requiere entidades de
    la misma clase OPM».

  El normalizador sí distingue el caso (`normalizador.ts:224-231`); el
  compilador no.
- **D3 — Un XOR degradado a AND sin fallo.** `Solicitud en 'abierta' inicia
  Archivar o Escalar.` (V15) crea dos instrumento-evento desde el estado
  `abierta`. El abanico no se forma porque el pivote es un estado
  (`dsl.ts:491-504` solo reconoce `kind:"entidad"`). `emitirCompuesta`
  (`emisor.ts:1043-1057`) captura la excepción y anota un ancla pendiente: la
  línea queda `aplicada`. En el modelo OPM resultante **ambos procesos se
  disparan** (semántica AND); la exclusión XOR queda solo como texto meta. Lo
  mismo ocurre en V14 (`P cambia X a 'e', o inicia Q` → efecto + invocación,
  heterogéneos: el kernel nunca podrá agruparlos). Esto contradice el principio
  «rechaza con diagnóstico, nunca adivina» del acta.
- **D4 — Menores.**
  - `emitirHechoAnotado` descarta la cola si la oración no creó enlace, y cuando
    lo crea **sustituye** los hechos del ledger por uno de tipo «ver»
    (`emisor.ts:1163-1180`). Subcuenta hechos y rompe L2 en silencio.
  - `X inicia P` con X objeto sin estado se enruta a `invocacion`
    (`emisor.ts:743-747`) y falla con el diagnóstico engañoso «Invocación
    requiere Proceso -> Proceso».
  - `aparecerEnlacePorTransicion` y `enlazar` suponen que `destino` es una
    `EntKey` string (`dsl.ts:593-594`).

### 4.8 Olores de sobreingeniería en autoría

- **La byte-identidad de un golden externo como principio de diseño.** Hay
  decenas de spreads condicionales justificados por «byte-identidad de
  consumidores existentes». Por esa razón se rechazó pasar el DSL por el kernel y
  se mantienen dos layouts. El oráculo pertenece a otro repositorio (hd-opm) y
  aquí no se puede ejecutar.
- **Comentarios-acta.** Las cabeceras narran olas, actas y personas (W3.2 «vía
  b», F5-parcial, «tensión 4», «adjudicación dov-dori (a)/(b)/(c)») y citan
  documentos «retirados, en git». Buena parte del texto de `dsl.ts`,
  `normalizador.ts` y `emisor.ts` es historia, no especificación.
- **Leyes numeradas** (L1..L9, R1..R9, A1..A12, V1..V17) sin tabla de
  equivalencia viva en el repo. La gramática SSOT
  (`gramatica-subdialecto-v0.md`) está **retirada** y no hay especificación
  vigente del sub-dialecto dentro del árbol.
- **Métricas de migración ya cumplidas** (`usoFamiliaV.ts`,
  `MIGRABLE_ESTRICTO_F2`), un detector de absorción que solo usan los tests y
  fixtures de equivalencia laxo↔E2 en `src/`.
- **API por acreción**: tres `aparecerEnlace*`, `posicionarEtiqueta`,
  `vistaGenerica`, `emitirModeloTextual`, `reporteExtra`, `descripcion: string[]`
  que se une con un espacio.

### 4.9 Recomendación para autoría

- **keep**:
  - el concepto de **emisión validada**: round-trip estable, diagnóstico por
    severidad y contención por rol declarado;
  - `hashContenido`;
  - los ids deterministas por firma (`estabilizarIds`);
  - la colocación de externos por rol OPM;
  - la contención elíptica;
  - el ledger «toda línea tiene destino»;
  - la extracción de anclas por forma (`annotations.ts`).
- **simplify**:
  - un DSL **sobre las operaciones del kernel** (una sola ruta de validación,
    como pedía D4 del acta), aceptando re-pin;
  - un solo motor de layout;
  - un `ResultadoBundle` estructurado sin reporte markdown obligatorio;
  - sello sin `doctrinaVersion`.
- **cut / redefinir**:
  - el normalizador «laxo» con familias V y la inferencia global de tipos;
  - sustituirlo por un **compilador de OPL-ES estricto** (el mismo parser del
    panel OPL) más una convención mínima de estructura (encabezado + `se
    descompone/despliega en`). La tolerancia léxica (plurales, sinónimos,
    colas) debe vivir en la skill externa que redacta el proto, no en el kernel
    del modelador. El propio código ya empezó ese camino (F5-parcial: «el
    compilador = verificador»).

---

## 5. Tutor (`src/tutor`)

### 5.1 Qué hace en *runtime*

1. Una superficie de UI, por ejemplo `InspectorEntidad`, construye un
   **snapshot** de intención con `derive*Intent(estado)` (`adaptadores.ts`).
2. `runTutorPolicy(snapshot, claims)` (`politica.ts:40-50`) genera candidatos
   `{contentId, prioridad, surface, actionId}` por tipo de snapshot, filtra los
   que «reclama» otra superficie (`claims`), ordena por prioridad
   (integrity < human-decision < loss-or-concurrency < persistent-diagnostic <
   consequence < opl-echo < optional-teaching) y mapea a `block|ask|confirm|orient`
   (`:82-89`) o `silent`.
3. `TutorInterventionDetails` (`ui/TutorDetails.tsx:126-149`) renderiza, si no es
   silencio, `TutorDetails`. Este carga **de forma diferida**
   `contenidoRuntime` → `resolveTutorContent(contentId, lentes)`
   (`ui/useTutorContent.ts:17-70`) y muestra «ahora», «criterio» (en `<details>`),
   el detalle por lente y enlaces a `/tutor-sources/<sourceId>.html#<ancla>`.
   Las preferencias de despliegue viven en `localStorage`.
4. El corpus HTML se genera en build y deploy (`scripts/generar-corpus-tutor.ts`)
   en `app/.tutor-corpus/`, que Vite sirve como `publicDir`
   (`vite.config.ts:15`). El agente LLM también lo lee (`server/agent/tools.ts:1097-1158`,
   herramienta `search_rules`).

### 5.2 Valor real y acreción

- **Valor**: 48 textos breves, bien escritos, que dicen qué decidir y con qué
  criterio en cada gesto (`contenidos.ts`), con cita a la fuente que manda en
  cada plano (validez, método, OPD, OPL, explicación formal). Eso es enseñanza
  del método en el punto de acción y conviene conservarlo.
- **Acreción medible**:
  - `capacidades.ts` (806), `escenarios.ts` (1060) y `auditoria.ts` (395)
    **no tienen consumidor de producción**: solo `registro.test.ts`. Forman un
    meta-registro que describe la app por «cortes» 1A..7C, efectos y
    recuperación, y un test verifica que el registro es coherente consigo mismo.
    Es gobernanza autorreferente: ~2,26k líneas.
  - `tipos.ts` define 14 uniones de snapshot con **campos fantasma literales**
    que solo sirven de «prueba» a nivel de tipos: `logicalIdentityChanges:
    false`, `createsLogicalIdentity: false`, `causalClaim: false`,
    `modelsProcessDynamics: false`, `automaticConsumerAvailable: false`,
    `persistedWeightsAvailable: false`, `localInferenceAvailable: false`
    (`tipos.ts:339,383,404,468,482-493,611`).
  - **Maquinaria muerta en call-sites**: `DialogoGraduar.tsx:104-110`,
    `DialogoRolBiblioteca.tsx:18-23`, `DialogoReabrirTaller.tsx:14-20` y
    `estadoVacioOpmViewModel.ts:61-68` calculan la política y le pasan un
    `claim {owner:"product", intentId}` con el **mismo** `intentId`. El
    resultado es siempre `silent/already-owned` y el componente renderiza
    `null`. La política se ejecuta para decidir callar siempre.
  - Varias ramas devuelven `[]` por diseño (`probabilistic-weights`, `outzoom`,
    `upstream-ficha`, `inference`, `certification`, `export-unavailable`:
    `politica.ts:167-168,186-187,201-204,225-227`). Son tipos y adaptadores
    completos para no mostrar nada.
  - **Checksums sha256 de los manuales del repo fijados en el código**
    (`fuentes.ts:163-359`, argumento `sha256` de `repositorySource`, `:42-61`). Cualquier edición de `docs/manual-*.md`,
    `docs/uso-productivo.md` o de una hoja rápida rompe `tutor:corpus` y
    `registro.test.ts` (evidencia: commit `b45b886` «reconciliar checksums tras
    propagación P4»). Es burocracia que vuelve costoso mejorar la documentación.
  - El heading de cada ancla se valida contra el documento fuente
    (`generar-corpus-tutor.ts:151-158`). Es razonable, pero junto con el
    checksum es doble control.
- **Reglas OPM presentes en el tutor** (orientación, no validación):
  - `politica.ts:157`: un snapshot `state` con `ownerKind === "process"` es
    prioridad `integrity` (bloquea). Codifica que los estados solo pertenecen a
    objetos.
  - `contenidos.ts:107,128,182,198,214,246` tienen criterios doctrinales:
    - «Un objeto existe durante el tiempo; un proceso transforma objetos o sus
      estados»;
    - «Consumo, resultado y efecto transforman; agente, instrumento e invocación
      habilitan o ejecutan»;
    - «Agregación expresa partes; exhibición atributos; generalización
      especializaciones; instanciación ejemplares»;
    - «AND exige todas; XOR exactamente una; OR al menos una»;
    - «Una entidad puede aparecer en varios OPDs; visibilidad y layout no crean
      ni borran el hecho lógico».

    Son copy, no lógica. Deben conservarse palabra por palabra si se mantiene el
    tutor, y ser consistentes con el kernel.

### 5.3 Recomendación para el tutor

- **keep**:
  - `contenidos.ts` (como datos, idealmente en JSON o markdown);
  - `fuentes.ts` (catálogo de fuentes y anclas);
  - la carga diferida;
  - el renderer de markdown a HTML con anclas.
- **simplify**:
  - sustituir snapshot + adaptadores + política (~1,35k líneas) por una tabla
    `actionId → contentId` y una función `tono(estado)` con 2 o 3 booleanos por
    superficie;
  - quitar la integridad sha256 de los documentos del repo, porque Git ya
    versiona; basta validar que existe el heading del ancla;
  - dejar la versión solo en las fuentes externas.
- **cut**:
  - `capacidades.ts`, `escenarios.ts` y `auditoria.ts`;
  - los tipos de «corte» 1A..7C;
  - los campos fantasma;
  - las llamadas que siempre se autosilencian.

---

## 6. Mesa: dos cosas con el mismo nombre

### 6.1 `src/mesa`: puente mesa↔skill (CLI `bun run mesa`)

Aquí «mesa» es la mesa de trabajo, es decir la instancia opforja donde trabaja
el humano. El puente permite que la skill externa `modelamiento-opm` opere contra
la instancia de **producción** (`OPFORJA_API_URL`, por defecto
`https://opforja.sanixai.com`) con un Bearer de mínimo privilegio leído de
`~/.config/opforja/agent-token` (`mesa-cli.ts:36-54`).

Verbos (`mesa-cli.ts:9-11,413`): `modelos`, `pull <ref>`,
`recuperar <modeloId>`, `preflight-retiro <modeloId>` y
`push <ref> <bundle.json> --base <Testigo-Base> --nota … [--especie apunte|modelo] [--confirmado-por-operador]`.

**Flujo de `push`** (`mesa-cli.ts:272-355`):

1. La nota es obligatoria.
2. `resolverRef` por id o nombre. Si aparece en el listado pero el `GET` da 404,
   aborta (sospecha de borrado concurrente).
3. Si el destino existe, exige `--base`, decodifica el testigo, lo compara contra
   el estado observado (guardado + autosave) y sale con **409** si difiere
   (`baseWitnessMatches`).
4. **Clausura**: si `esSinDelta` contra la fuente elegida por el pull, termina
   con «sin cambios» (exit 4).
5. Obtiene la especie cruzando el índice del workspace (`mapaEspeciePorModelo`),
   porque la especie **no está en el registro del modelo en Postgres**. Lee el
   sello en el guardado o en el autosave.
6. `evaluarPush` (reglas en `validarPush.ts:279-310`).
7. Arma el body (`construirBodyActualizacion` = `construirModeloPersistido`, para
   no pisar descripción, carpeta, versiones ni archivado) y una versión
   `agente·<nota>`, y hace `POST /__deep-opm/modelos/:id/revisiones` con
   `{model, version, base, confirmedByOperator?, speciesOnCreate?}`.
8. Clasifica la respuesta: 409 → conflicto; 404/405/501 → backend sin soporte;
   5xx o respuesta inválida → resultado desconocido y pide `pull`.

**Leyes** (spec 2026-07-06 §8, tests `roundtrip.test.ts`,
`especie-workspace-integration.test.ts`): determinismo del generador (el pull sin
encabezado es byte-igual a `exportarContextoSkill`), *counit*, clausura, un push
inválido no escribe, carril por procedencia, *fast-forward* 409, base ratificada,
especie (biblioteca de solo lectura).

**Calidad**: la semántica de concurrencia es de buena factura (testigo con sha256
de las dos ramas, fuente elegida con criterio exacto «autosave gana solo si es
estrictamente más nuevo», no-op real, commit atómico idempotente con verificación
del `version.id` devuelto) y se puede portar casi tal cual. Olores:

- `construirBodyActualizacion` es un wrapper 1:1 sin valor.
- `especieWorkspace.ts` existe porque especie y versiones viven en un índice JSON
  del workspace y no en la tabla del modelo. Una reescritura del almacenamiento
  lo elimina.
- `historialAgente.ts` detecta al agente por el prefijo de texto `agente·` en el
  nombre de la versión (`:4-6`). Debería ser un campo `autor`.
- `baseWitness.ts` (node:crypto) y `persistencia/baseWitnessBrowser.ts`
  (WebCrypto) duplican la lógica y la constante `FORMAT`. Bun y los navegadores
  tienen `crypto.subtle`, así que basta una implementación asíncrona.
- `mesa-cli.ts` tiene 577 líneas, con comentarios extensos sobre bugs pasados.

### 6.2 Mesa de exploración (`src/modelo/mesaExploracion.ts`, UI `DialogoMesaExploracion.tsx`)

Es una extensión meta `MesaExploracionV1` dentro del modelo
(`extensiones.ts:225-297`, `schema: "deep-opm-pro.mesa-exploracion.v1"`), con
**fuentes** de texto o markdown (≤128 kB), **trazos** (N:M con fuentes),
**propuestas** (N:M con trazos, con `baseFirmaSemantica`) y **confirmaciones**.
Regla: «Fuente, trazo y propuesta pendiente no son cosas OPM, no emiten OPL y no
alteran la firma semántica. Solo una confirmación crea un hecho mediante el
kernel OPM» (`extensiones.ts:226-228`). En v1 la única operación es
`crear-entidad` (objeto|proceso en un OPD). Responde a una necesidad real:
capturar evidencia preformal y convertirla en hechos con rastro. Su alcance es
mínimo, lo que plantea si una reescritura la conserva como está o la generaliza a
«propuesta = ChangeSet» (lo que ya hace el agente).

---

## 7. Agente LLM (`src/agent` + `src/server/agent`)

### 7.1 Qué es

Es un **agente de tareas integrado**, del lado del servidor (no del cliente). El
navegador solo ve `TaskView` (`taskView.ts:21-37`: sin credenciales, transcript
ni lease). El proveedor está en `server/agent/opencodeProvider.ts`: SDK
`ai` + `@ai-sdk/openai-compatible` contra `opencode-zen` (`glm-5.2`) o
`xiaomi-mimo` (`mimo-v2.6-pro`, el default), con tarifas verificadas a mano
(`server/agent/config.ts:37-58`). Si no hay tarifa, el servicio queda
**deshabilitado** (`agentAvailability`, `:86-91`). El contrato operativo es
`server/agent/instructions.ts` (prompt de sistema).

Herramientas (`server/agent/tools.ts:89-140`): `read_context`, `query_model`
(consultas estructurales `afectan-a|requerido-por|alcanzable|impacto-de-eliminar|impacto-aguas-abajo`),
`read_source`, `search_rules` (sobre el corpus canónico materializado del tutor),
`propose_change`, `validate_change`, `apply_change`, `ask_decision` y
`finish_task`.

Las operaciones de autoría permitidas se filtran por la matriz de capacidades
(`capabilityProfile.ts:340-354`): `createObject`, `createProcess`,
`renameEntity`, `deleteEntity`, `createState`, `renameState`, `deleteState`,
`createProceduralLink`, `deleteLink` y `createXorExclusion`. **El refinamiento no
es autorable por el agente** (`:330-337`), aunque existe la ruta humana
`/agent/refinements`.

### 7.2 Contratos (`src/agent/contracts.ts`), textuales

```ts
export type Target =
  | { kind: "current"; documentId: string }
  | { kind: "variant"; documentId: string; variantId: string };

export interface Base {
  revision: number;
  semanticHash: string;
  workingCopyHash: string;
  clientSequence: number;
  profileVersion: string;
}

export interface Dependency {
  kind: "element" | "source" | "assumption" | "decision";
  id: string;
  version: string;
}

export interface TaskIntent {
  id: string; version: number; target: Target; outcome: string;
  scopeIds: string[]; exclusions: string[]; allowedSourceIds: string[];
  sufficiency: string[]; authority: "read" | "propose" | "edit";
  authorizationVersion: number;
  rejectedAlternatives: Array<{ description: string; reason: string }>;
}

export interface ChangeSet extends SemanticChangeBatch {
  taskId: string | null; actorId: string; intentVersion: number | null;
  target: Target; base: Base; readIds: Id[]; writeIds: Id[];
  dependencies: Dependency[]; explanation: string;
}

export interface CommitReceipt {
  changeId: Id; target: Target; previousRevision: number; revision: number;
  appliedOperationIds: string[]; inverseId: Id;
}

export interface TaskEvent {
  id: Id; taskId: Id; sequence: number;
  kind: "status" | "result" | "decision" | "committed" | "invalidated";
  revision: number | null; resultId: Id | null;
}
```

Máquina de estados (`taskState.ts:2-27`):
`preparing → working → awaiting-decision | suspended | completed | cancelled | failed`.
`awaiting-decision → preparing | suspended | cancelled`. `suspended → preparing |
cancelled`. Los estados terminales son `completed`, `cancelled` y `failed`.
Presupuesto por defecto: 12 llamadas al modelo, 40 herramientas, 120k tokens de
entrada, 16k de salida, US$1 y 600 s. Un uso desconocido **retiene** la tarea
(`usageUnknown`).

Las operaciones semánticas (`modelo/changes/types.ts:20+`) llevan
`operationId` + `preconditions` (`idAbsent|opdExists|entity|state|link`) y tienen
inversa (`SemanticInverse`). Es un contrato de cambios bien pensado: un cambio
es reversible y auditable y se valida contra la base.

### 7.3 Olores y recomendación

- `AGENT_CAPABILITY_MATRIX` guarda la **ruta de un archivo de test como
  «evidencia»** de cada capacidad (`capabilityProfile.ts:289-338`). Es metadato
  de gobernanza que viaja al cliente y al prompt. En *runtime* solo importa
  `AGENT_AUTHORING_OPERATIONS`.
- `ProviderProfile.provider` y los endpoints están cerrados a dos proveedores
  concretos. Las tarifas están en el código con fecha de verificación.
- **keep**: `contracts.ts`, `taskState.ts`, `taskView.ts`, `changeProjection.ts`
  y `markdownSource.ts` (contrato entre cliente, servidor y BD, compacto y claro).
- **simplify**: el perfil de capacidades pasa a ser una lista de operaciones y
  una versión de perfil. La matriz de evidencias se va a la documentación.
- **no decidir aquí**: si el agente integrado se conserva. Es la apuesta
  declarada del producto (spec 2026-09-10), pero no está desplegado ni validado
  con la API real. El servidor del agente (~5k líneas + tests) queda fuera de
  esta área, aunque depende de estos contratos.

---

## 8. Canon y resolutor URN (`src/canon`)

- `resolutor-urn.json` (datos): `kora_raiz_default: "/home/felix/kora-knowledge"`
  y un mapa de 5 URN a `references/fxsl/*/content.md` con versión:
  - reglas 1.5.0;
  - spec-OPD 1.4.0;
  - spec-OPL 1.4.1;
  - metodología 1.7.0;
  - categorial 1.3.0.

  Incluye además `puente_inverso`, que apunta al manual del repo. Esta es la
  «jerarquía de autoridad» nivel 2 de `docs/README.md`: las SSOT OPM/Forja viven
  en **KORA Pneuma** (externo) y `docs/canon-opm/*.md` son puentes de 70 a 100
  líneas.
- `resolutorUrn.ts` lee ese JSON **en el momento del import** con `node:fs`, lo
  que lo hace inutilizable en el navegador. La única consumidora es
  `scripts/cordon-estado.ts`. **Duplicación**: `generar-corpus-tutor.ts:26-29,124-128`
  reimplementa la misma resolución con **otra variable de entorno**
  (`TUTOR_CANON_ROOT` en vez de `KORA_RAIZ`).
- `selloSkill.ts` parsea el bloque `kora:sello` que el transmutador de KORA
  embebe en la skill desplegada y lo compara con valores fijados
  (`CORDON_SKILL_ESPERADOS`: claude-code 2.1.0, codex 3.1.0 con `nativeHash`).
  Sirve a `cordon:skill` y `cordon:estado`, que forman parte de `gate:refactor`.
  Es una verificación del ecosistema de despliegue de la skill, no del modelador.
- `doctrina.ts`: sin consumidor.

**Veredicto**: el canon no es producto; es la **gobernanza del cordón** entre
opforja, KORA y la skill. Una reescritura debería:

1. mantener la regla metodológica (usar el corpus KORA como autoridad, como pide
   AGENTS.md);
2. materializar las fuentes que cita el tutor como **artefacto de build opcional**
   (si falta KORA, el tutor muestra el criterio sin el enlace, en vez de romper
   `dev` y `build`);
3. sacar `cordon:*` del *gate* del producto hacia un script de operación.

---

## 9. Scripts del área

| Script | LOC | Qué hace | Olores | Rec. |
|---|---:|---|---|---|
| `generar-corpus-tutor.ts` | 250 | Con un lock en `app/.tutor-corpus.lock/`, resuelve cada `TUTOR_SOURCE` (URN KORA o ruta del repo), valida la integridad (sha256 o versión), valida los headings de las anclas, genera el HTML (renderer propio o instrumenta el HTML existente con ids) y escribe `manifest.json` con *fingerprint*. Usa staging con `rename` atómico, permisos 755/644 y un modo `TUTOR_CORPUS_PREBUILT=1` para Docker | rompe `dev`/`build` sin KORA; duplica el resolutor; doble integridad | simplify (tolerar la ausencia, quitar sha256 del repo) |
| `render-tutor-markdown.ts` | 220 | `Bun.markdown.render` con callbacks: headings con id de ancla, tablas desplazables, enlaces seguros (`safeUrl`), frontmatter extraído | `html: (children) => children` deja pasar **HTML crudo** de las fuentes (`:44`); es aceptable solo si las fuentes son de confianza | keep (revisar el paso de HTML crudo) |
| `mesa-cli.ts` | 577 | CLI del puente (§6.1), con `ApiFn` inyectable para tests | wrapper innecesario; comentarios-historia | keep delgado |

Relacionados fuera del alcance directo: `render-headless.ts` (201) y
`verify-reproducible.ts` (101) sirven a hd-opm. `cordon-estado.ts` (126) y
`cordon-skill-audit.ts` (82) sirven al cordón.

---

## 10. Catálogo de reglas OPM codificadas en el área

Estas reglas son sagradas en el sentido de que cualquier reescritura debe
preservarlas. Donde se marca **(defecto)**, la regla está codificada pero el
código la incumple.

### 10.1 Autoría: DSL, bundle y layout

| # | Regla | Ubicación |
|---|---|---|
| A1 | Un objeto con estados declara **≥2 estados** (no se acepta un estado único) | `autoria/dsl.ts:291` |
| A2 | Las designaciones `inicial`/`final` se sincronizan con `esInicial`/`esFinal`; `default`/`current` son solo designación avanzada | `autoria/dsl.ts:300-316,422-431` |
| A3 | La firma de enlace (tipo × clase de origen × clase de destino, con extremos de estado) la valida el kernel en el punto de construcción | `autoria/dsl.ts:572-580` (→ `modelo/operaciones/helpers.validarFirmaEnlace`) |
| A4 | En un in-zoom, la agregación refinable→subproceso **no es un enlace**: es contención (el subproceso es parte interna del contorno) | `autoria/dsl.ts:553-560` |
| A5 | La apariencia del refinable en su OPD de descomposición es el **contorno** (`rol:"contorno"`) | `autoria/dsl.ts:342-358` |
| A6 | Modificadores: `evento`→subtipo `E`, `condicion`→`C`, `no`→`no`; solo en enlaces procedurales | `autoria/dsl.ts:585-586`, `autoria/tipos.ts:30-31` |
| A7 | La etiqueta de ruta exige un enlace procedural ligado a un estado (kernel) | `autoria/dsl.ts:605-613`, `autoria/tipos.ts:22-23` |
| A8 | La demora solo es legal en enlaces de `invocacion` (kernel `definirDemora`) | `autoria/dsl.ts:616-624`, `autoria/tipos.ts:35-39` |
| A9 | Un abanico O/XOR exige ≥2 enlaces procedurales homogéneos que comparten un **puerto exacto** (kernel `formarAbanico`) | `autoria/dsl.ts:433-469` |
| A10 | La auto-invocación exige que el proceso aparezca en el OPD (kernel) | `autoria/dsl.ts:471-488` |
| A11 | Una vista genérica (`generic-view`) reúne apariciones **sin** refinamiento y queda excluida de los checks de frontera y descomposición | `autoria/dsl.ts:95-98,254-258` |
| A12 | La emisión exige un round-trip JSON estable y **cero bloqueos** de diagnóstico (la severidad depende de la regla, no del productor) | `autoria/bundle.ts:110-126,71-82` |
| A13 | **Contención (L7)**: los internos (por rol declarado) quedan dentro del contorno y los externos fuera; al arrastrar el contorno se mueven las internas y no las externas | `autoria/contencion.ts:44-54`, `autoria/bundle.ts:27-67` |
| A14 | Las anclas normativas son meta: no son cosas, no emiten OPL y no cuentan en los conteos | `autoria/bundle.ts:143-149`, `modelo/tipos/extensiones.ts:133-138` |
| A15 | Eje vertical del in-zoom = línea de tiempo. El orden declarado (`en esa secuencia`) fija bandas; sin él se usa el nivel topológico de las invocaciones | `autoria/layout.ts:122-140,485-507` |
| A16 | Los subprocesos disparados por **evento** en nivel 0 se ubican después de la secuencia base | `autoria/layout.ts:477-484` |
| A17 | Clasificación interno/externo del in-zoom: un interno declarado es interno. Un objeto ambiental es externo, igual que uno conectado al refinable en el padre o que aparece en un ancestro. En otro caso es interno solo si lo transforma (consumo/resultado/efecto) un interno | `autoria/layout.ts:646-684` |
| A18 | Enlaces transformadores = {consumo, resultado, efecto}; estructurales = {agregación, exhibición, generalización, clasificación} | `autoria/layout.ts:48-49` |
| A19 | Unfold: la posición es disposición espacial, no orden temporal (V-78) | `autoria/layout.ts:314-384` |
| A20 | El contorno de un proceso es una **elipse**: los internos deben caer dentro de la curva, no solo del bbox | `autoria/layout.ts:624-629,686-710` |
| A21 | Colocación de externos por rol: agente arriba, consumo a la izquierda, resultado/efecto a la derecha, instrumento abajo | `autoria/layout.ts:154-177` |

### 10.2 Compilador

| # | Regla | Ubicación |
|---|---|---|
| C1 | Solo los **objetos** portan estados; nunca se declaran estados sobre un proceso | `compilar/emisor.ts:896-906` |
| C2 | Agregación, generalización y clasificación son **homogéneas** (misma clase OPM en todo y partes); la exhibición admite cruce de clase (objeto exhibe proceso-operación) | `compilar/emisor.ts:584-613` |
| C3 | Una parte con clase explícita contraria a la del todo es una contradicción y produce diagnóstico, no herencia | `compilar/emisor.ts:603-611` |
| C4 | El sujeto de `maneja` (agente) es **siempre objeto** (físico/humano); esta evidencia prevalece sobre el heurístico «sujeto de genera ⇒ proceso» | `compilar/normalizador.ts:118-122,168-180,252-262` |
| C5 | `se descompone en` refina un **proceso**; `se despliega en` puede refinar un objeto. **(defecto D2)**: el compilador no respeta esta distinción | `compilar/normalizador.ts:224-231` frente a `compilar/compilador.ts:191-198` |
| C6 | Un evento sin portador con iniciador **proceso** se modela como `invocacion`. Con iniciador **objeto en estado**, como instrumento con `modificador: evento` y el gatillo en el origen, sin consumo (V-59). La invocación no admite modificadores | `compilar/emisor.ts:695-758` |
| C7 | Evento y `requiere` sobre el mismo par en el mismo OPD son **un solo enlace** (adjunción, sin duplicado) | `compilar/emisor.ts:936-996` |
| C8 | La disyunción de consecuencias es un abanico **XOR**. **(defecto D3)**: si el kernel no puede agrupar, se degrada a enlaces independientes | `compilar/normalizador.ts:790-833`, `compilar/emisor.ts:1036-1057` |
| C9 | «Notificar» no es `afecta` al receptor (el receptor no cambia de estado): se modela como `genera Notificación` + estructural etiquetado «dirigido a» | `compilar/normalizador.ts:676-712` |
| C10 | OPM no tiene primitiva de timing: `está acotado por <plazo>` se modela como `exhibe Plazo` con cola anotada; una restricción abstracta, como etiquetado | `compilar/normalizador.ts:714-748` |
| C11 | `restringe` solo se mapea para objetos **binarios** (condición sobre el estado complementario) | `compilar/normalizador.ts:586-608` |
| C12 | Nombres: un plural sin sufijo `Conjunto de`/`Grupo de` se rechaza (R8, R-NOM-OBJ-1/2); la designación de esencia incompleta también se rechaza (R8) | `compilar/normalizador.ts:465-491,1104-1125` |
| C13 | No se crea una cosa cuyo nombre arrastra material no nominal (cita no extraída): guard R9 | `compilar/resolutor.ts:344-368,455-465` |
| C14 | Identidad de nombre = `claveNombre` del parser (sin distinguir mayúsculas), igual que en la edición inversa | `compilar/resolutor.ts:312-315` |
| C15 | Clases de OPL sin primitiva de autoría (`metadata`, `plegado-parcial`, `contexto`, `excepcion`) se registran como excluidas, nunca en silencio | `compilar/emisor.ts:266-273,828-835` |
| C16 | Una etiqueta candidata `[C1]` nunca compila; `[RATIFICAR]` produce un ancla `pendiente-ratificacion`; una cita normativa, `vigente` | `compilar/annotations.ts`, `compilar/anclas.ts:1-22` |
| C17 | La partición por preestado (`familia-efectos-preestado`) se acepta solo si el parser canónico la reconoce completa | `compilar/normalizador.ts:307-317` |

### 10.3 Tutor y mesa de exploración

| # | Regla | Ubicación |
|---|---|---|
| T1 | Estado sobre un proceso = bloqueo de integridad | `tutor/politica.ts:157` |
| T2 | Criterios doctrinales mostrados al usuario (objeto/proceso, familias de enlaces, AND/XOR/OR, apariencia ≠ hecho) | `tutor/contenidos.ts:107,128,182,198,214,246` |
| X1 | El material preformal (fuente, trazo, propuesta) no es cosa OPM, no emite OPL y no altera la firma semántica; solo la confirmación crea el hecho, y lo hace por el kernel | `modelo/tipos/extensiones.ts:225-228`, `modelo/mesaExploracion.ts` |

---

## 11. Contratos de datos que una reescritura debe respetar o migrar

### 11.1 Formato persistido `deep-opm-pro.modelo.v0` (extensiones que toca el área)

La envolvente es `{ formato: "deep-opm-pro.modelo.v0", modelo, carpetaId? }`
(`serializacion/json.ts:19-31`). Claves opcionales del `modelo` producidas o
consumidas aquí (`json.ts:179-185`): `anclasNormativas`, `notasMesa`,
`mesaExploracion`, `procedencia`, `fichaTrabajo` y `lentesConocimiento`. Se
omiten si están vacías.

Tipos textuales (`modelo/tipos/extensiones.ts`):

```ts
export interface ReferenciaNorma { norma: string; articulos?: string[]; seccion?: string; }
export type EstadoAncla = "vigente" | "pendiente-ratificacion";
export type NivelAutoridad = "operador-modelado" | "mesa" | "dt-seremi-legal";
export type EstadoRatificacion = "pendiente" | "anotado-en-mesa" | "ratificado-con-fuente";
export type TargetAncla =
  | { tipo: "entidad"; id: Id } | { tipo: "enlace"; id: Id }
  | { tipo: "opd"; id: Id } | { tipo: "modelo" };
export interface RatificacionAncla {
  nivelAutoridad: NivelAutoridad; estadoRatificacion: EstadoRatificacion;
  fuente?: string; responsable?: string; anotadoEn?: string; ratificadoEn?: string;
}
export interface AnclaNormativa {
  id: Id; claveProto: string; target: TargetAncla; estado: EstadoAncla;
  referencias?: ReferenciaNorma[]; nota?: string; ratificacion?: RatificacionAncla;
}
export interface NotaMesa { id: Id; target: TargetAncla; texto: string; fecha: string; }

export interface SelloProcedencia {
  protoHash: string; autoriaVersion: string; layoutVersion: string; doctrinaVersion?: string;
}
export const COMPONENTES_SELLO = ["protoHash", "autoriaVersion", "layoutVersion"] as const;
export const COMPONENTES_SELLO_OPCIONALES = ["doctrinaVersion"] as const;

export const MESA_EXPLORACION_SCHEMA = "deep-opm-pro.mesa-exploracion.v1" as const;
export const MAX_MARKDOWN_SOURCE_BYTES = 128_000;
export interface MesaExploracionV1 {
  schema: typeof MESA_EXPLORACION_SCHEMA;
  fuentes: Record<Id, FuenteExploracionTexto>;   // {id, tipo:"texto", mediaType?, titulo?, contenido, creadaEn}
  trazos: Record<Id, TrazoExploracion>;          // {id, fuenteIds[], texto, creadoEn, editadoEn?}
  propuestas: Record<Id, PropuestaOpmExploracion>; // {id, trazoIds[], baseFirmaSemantica, operacion, estado, creadaEn, confirmacionId?}
  confirmaciones: Record<Id, ConfirmacionExploracion>; // {id, propuestaId, targets:[{tipo:"entidad",id,opdId}], fuenteIds, trazoIds, confirmadoEn}
}
```

Nota de migración: `NivelAutoridad` contiene `"dt-seremi-legal"`, un valor de
**dominio sanitario chileno** dentro del tipo del producto. Conviene migrarlo a
un string libre o a una lista configurable.

### 11.2 Testigo-Base (formato de intercambio CLI↔servidor↔BD)

```ts
const FORMAT = "opforja.mesa-base.v1"; const PREFIX = "mesa-v1.";
export interface MesaBaseWitnessV1 {
  format: "opforja.mesa-base.v1"; modelId: string;
  saved: { revision: number; updatedAt: string; sha256: string };
  autosave: { createdAt: string; sha256: string } | null;
  source: "saved" | "autosave";
}
// codificado: "mesa-v1." + base64url(JSON)
```

El servidor lo persiste o lo normaliza (`server/validatePersistence.ts`,
`server/modelPersistence.ts`, `store/tipos.ts`). Esto lo convierte en contrato de
BD y hay que migrarlo con cuidado.

### 11.3 APIs HTTP que usa o define el área

Persistencia (Bearer de agente o cookie de operador):

- `GET /__deep-opm/modelos` → `{ modelos: ResumenModeloPersistido[] }`, sin `json`.
- `GET /__deep-opm/modelos/:id` → `{ modelo }`, con `json`.
- `GET /__deep-opm/modelos/:id/autosave`.
- `GET /__deep-opm/modelos/:id/versiones`.
- `GET /__deep-opm/modelos/:id/versiones/:versionId`.
- `GET /__deep-opm/workspace` → `{ indice }`. Ahí vive la especie
  (`esApunte`/`esBiblioteca`) y las versiones.
- `POST /__deep-opm/modelos/:id/revisiones` → body
  `{ model, version:{id,creadoEn,nombre:"agente·…",modeloPayloadKey,bytes}, base:{kind:"new"}|{kind:"existing",witness}, confirmedByOperator?, speciesOnCreate? }`.
  Responde 409 si la base cambió y 200 con `{model, version}` si tuvo éxito.
  El token de agente «solo permite lectura y commit atómico de revisiones»
  (`server/modelPersistence.ts:239`).

Agente (solo sesión de operador, mismo origen; `server/agent/http.ts:31-200`):

- `GET agent/status` → disponibilidad, perfil, modelo e incremento de presupuesto.
- `GET|POST agent/tasks` → listar o iniciar (`StartTaskRequest`, 202).
- `GET agent/tasks/:id`.
- `GET agent/tasks/:id/events` → SSE con cursor `after` o `last-event-id`.
- `POST agent/tasks/:id/{instructions|continue|stop|presence|grants}`.
- `POST agent/changes/:id/{prepare|undo|reapply|grants|commit}`.
- `GET agent/changes/:id/receipt`.
- `POST agent/pieces`.
- `POST agent/refinements` (preparación humana de refinamiento, con preservación
  de la frontera).

### 11.4 API pública de la librería de autoría (contrato con hd-opm)

`autoria/index.ts` exporta, entre otros:

- `crearAutor` (con `Autor` y sus 27 miembros);
- `emitirBundle(autor, OpcionesBundle) → ResultadoBundle{json, opl, reporte, conteos, avisos, modeloTextual?}`;
- `compilarProto(md, {nombre?, id?, fichaTrabajo?, lentesConocimiento?}) → {autor, modelo, ledger, resumen}`;
- `leerEstructura`;
- `aplicarLayoutCompleto`, `LAYOUT`, `LAYOUT_VERSION`;
- `AUTORIA_VERSION`, `hashContenido`, `construirSello`, `compararProcedencia`.

Si la reescritura cambia esta API, hay que coordinar con hd-opm o publicarla
como paquete versionado. Hoy hd-opm la importa por ruta relativa, así que
cualquier refactor del árbol la rompe.

### 11.5 Formato del proto-modelo (entrada del compilador)

Markdown con:

1. encabezados `#..######` que segmentan el documento y dan nombre y clave a los
   OPD;
2. bloques ```opl con una oración por línea;
3. un primer bloque que es el OPD raíz;
4. `X se descompone en A, B y C[, en esa secuencia].` o `X se despliega en …`,
   que abre un OPD hijo;
5. bloques sin estructura, que son continuación;
6. anclas inline `(Cuerpo art. N)`, `[RATIFICAR #clave: texto]` y `[C1]`;
7. líneas `#` dentro del bloque, que son comentarios.

La gramática formal (`gramatica-subdialecto-v0.md`) está retirada y hoy el
contrato vive solo en el código y los tests.

### 11.6 Pull de mesa (texto)

```
<!-- mesa pull · {nombre} -->
Especie: apunte|modelo|biblioteca
Fuente: guardado rev N | Fuente: autosave no consolidado (no ratificado) — {creadoEn} · guardado rev N
Testigo-Base: mesa-v1.…            (si existe)

{exportarContextoSkill(modelo, now, {esApunte})}
```

---

## 12. Acoplamientos y dependencias externas

- **KORA** (ausente):
  - build y dev del producto (`tutor:corpus`);
  - `search_rules` del agente (lee `.tutor-corpus`; si falta, las fuentes se
    saltan en silencio, `tools.ts:1106-1107`);
  - `cordon:*`;
  - los tests del canon, que se saltan.

  La ruta por defecto es la de la máquina del operador.
- **hd-opm** (ausente): consumidor de la librería de autoría y dueño del golden
  de byte-identidad. Muchas decisiones del DSL y del layout se tomaron para no
  romperlo.
- **skill `modelamiento-opm`** (ausente): consumidora del puente de mesa y del
  contexto `exportarContextoSkill`. Sus versiones están fijadas en
  `canon/selloSkill.ts:189-202`.
- **Proveedores LLM** (opencode-zen, xiaomi-mimo): endpoints y tarifas en el
  código.
- Acoplamientos internos notables:
  - `tutor/capacidades.ts` depende de `store/acciones-contextuales`
    (`AccionContextualId`): el tutor importa del store (dirección
    `store → tutor` invertida).
  - `registro.test.ts` importa `ui/CommandPalette`.
  - `mesa/*` depende de `persistencia/*` y de `opl/contextoSkill`.
  - `autoria` depende de `opl/parser` (reverse) y `opl/generar` (forward), y
    conserva una **copia** de la lógica de pin de puerto del parser
    (`dsl.ts:435-438`, «replica `opl/parser/aplicar.ts:390-405`»).
  - `layout.ts` depende implícitamente de constantes de render (lienzo
    7200×5200, métricas de fuente).

---

## 13. Olores de sobreingeniería: lista concreta

1. **Meta-registro del tutor sin consumidor de producción**: `capacidades.ts`,
   `escenarios.ts` y `auditoria.ts`, 2261 líneas.
2. **La política del tutor calcula intervenciones que se autosilencian** en 4
   call-sites (§5.2).
3. **Campos fantasma `false` literales** en los tipos de snapshot como «prueba»
   de no-capacidad.
4. **sha256 de los manuales del repo en código** (`tutor/fuentes.ts`): editar
   documentación rompe build y tests.
5. **Dos resolutores URN** con variables de entorno distintas (`KORA_RAIZ` y
   `TUTOR_CANON_ROOT`).
6. **Build del producto condicionado a una biblioteca externa** en una ruta fija
   de la máquina del operador.
7. **Byte-identidad de un golden externo** como restricción de diseño del DSL y
   del layout: dos motores de layout y un DSL que esquiva el kernel.
8. **Normalizador léxico de 1340 líneas** más un emisor de 1196, con heurísticas
   del corpus de un dominio concreto (instituciones «SEREMI», nombres HODOM) y
   tres defectos semánticos verificados.
9. **Código de migración ya concluida** (`usoFamiliaV`, `MIGRABLE_ESTRICTO_F2`,
   fixtures E2) y detectores que solo usan los tests (`absorcion.ts`).
10. **Comentarios-acta**: cabeceras de 20 a 40 líneas con historia de olas,
    personas y documentos retirados.
11. **Wrappers 1:1**: `construirBodyActualizacion`.
12. **Duplicación Node/Browser** del Testigo-Base.
13. **Detección del autor por prefijo de string** (`agente·`) en vez de un campo.
14. **Matriz de capacidades del agente con rutas de test como evidencia**.
15. **`canon/doctrina.ts` y `hashDoctrina`** sin productor ni consumidor en el
    repo.
16. **Tipo de producto con valor de dominio** (`NivelAutoridad
    "dt-seremi-legal"`).
17. **API del DSL por acreción**: tres `aparecerEnlace*`, `reporteExtra`,
    `emitirModeloTextual`, `descripcion: string[]`.

---

## 14. Piezas de alta calidad que conviene portar casi tal cual

- `autoria/procedencia.ts::hashContenido`: FNV-1a 64 puro y portable.
- `autoria/compilar/estabilizarIds.ts`: ids de enlace por firma semántica con
  detección de colisión y remapeo total de referencias. Es el camino a ids
  deterministas en toda la app.
- `autoria/contencion.ts`: partición por rol **declarado** (ley falsificable) y
  predicado de contención.
- `autoria/bundle.ts`, pasos 3 a 5: round-trip estable, bloqueo por severidad y
  rigidez de arrastre.
- `autoria/layout.ts`: la colocación de externos por rol OPM, la contención
  elíptica, las bandas por nivel topológico y el orden declarado. Portar como
  estrategias de un motor único.
- `autoria/compilar/annotations.ts`: reconocimiento de citas normativas por
  **forma** (localizador o numeración legal), sin enumerar cuerpos.
- La idea del **ledger L2**: cada línea de entrada tiene un destino con
  diagnóstico.
- `mesa/baseWitness.ts`, `contextoPull.ts::elegirBase`, `validarPush.ts`,
  `esSinDelta.ts` y el protocolo de `push` del CLI (409, no-op, commit atómico,
  clasificación de resultados desconocidos).
- `agent/contracts.ts`, `taskState.ts`, `taskView.ts`, `changeProjection.ts` y
  `markdownSource.ts`: contrato compacto con separación cliente/servidor
  explícita.
- `tutor/contenidos.ts` (texto) y `tutor/fuentes.ts` (anclas por heading),
  junto con `scripts/render-tutor-markdown.ts` (renderer con ids de ancla y URLs
  seguras).
- `modelo/mesaExploracion.ts`: la regla «preformal ≠ hecho; solo confirmar
  crea».

---

## 15. Recomendación keep / simplify / cut por pieza

| Pieza | Rec. | Justificación |
|---|---|---|
| `autoria/dsl.ts` | simplify | Reescribir sobre las operaciones del kernel (una sola validación) y colapsar la API; aceptar re-pin del golden |
| `autoria/bundle.ts` | keep (simplificar el reporte) | Es un *gate* de emisión sólido; el reporte markdown es opcional |
| `autoria/contencion.ts` | keep | Ley L7 limpia |
| `autoria/layout.ts` | simplify | Un motor único con `canvas/layoutSugerido`; conservar la semántica de rol |
| `autoria/procedencia.ts` | keep hash / simplify sello | Quitar `doctrinaVersion` y `hashDoctrina` |
| `autoria/reproducibilidad.ts` | cut | Tooling de un consumidor externo; un `diff` basta |
| `compilar/estructura.ts` | keep la idea, reescribir | Convención mínima: encabezado + oración de refinamiento |
| `compilar/normalizador.ts` | cut / rehacer | Heurísticas de corpus y defectos; el compilador debe aceptar OPL-ES estricto y rechazar el resto |
| `compilar/emisor.ts` | rehacer | Mapear AST→operaciones kernel sin re-junta de nombres ni degradación de XOR |
| `compilar/resolutor.ts` | keep la idea | crear/reusar/proyectar por OPD; guard R9 |
| `compilar/annotations.ts` + `anclas.ts` | keep / simplify | Anclas normativas por forma; target con reglas simples |
| `compilar/estabilizarIds.ts` | keep | Ids deterministas |
| `compilar/absorcion.ts`, `usoFamiliaV.ts`, `familia-v-e2.fixtures.ts` | cut | Solo los usan tests o migración cerrada |
| `compilar/compilador.ts` | simplify | Menos parámetros sueltos (8 argumentos en `procesarOpd`) |
| `tutor/contenidos.ts`, `fuentes.ts` | keep (como datos) | Es donde está el valor pedagógico |
| `tutor/politica.ts`, `adaptadores.ts`, `tipos.ts` | simplify fuerte | Tabla `actionId → contentId` + tono |
| `tutor/capacidades.ts`, `escenarios.ts`, `auditoria.ts` | cut | Gobernanza autorreferente |
| `mesa/baseWitness.ts`, `contextoPull.ts`, `validarPush.ts`, `esSinDelta.ts`, `revisionVitrina.ts`, `timestampOrder.ts` | keep | Concurrencia bien resuelta |
| `mesa/especieWorkspace.ts` | simplify | Desaparece si especie y versiones viven en el registro del modelo |
| `mesa/construirBodyActualizacion.ts` | cut | Wrapper 1:1 |
| `mesa/historialAgente.ts` | simplify | Usar un campo explícito de autor de la versión |
| `modelo/mesaExploracion.ts` | keep / reevaluar | Evaluar si unificarla con `ChangeSet` del agente |
| `agent/*` contratos | keep | Contrato compacto |
| `agent/capabilityProfile.ts` | simplify | Lista de operaciones + versión |
| `canon/resolutorUrn.ts`, `selloSkill.ts` | mover a tooling de operación | No es producto |
| `canon/doctrina.ts` | cut | Sin consumidor |
| `scripts/generar-corpus-tutor.ts` | simplify | Tolerar la ausencia de KORA; quitar sha256 del repo; un solo resolutor |
| `scripts/render-tutor-markdown.ts` | keep | Revisar el paso de HTML crudo |
| `scripts/mesa-cli.ts` | keep delgado | Quitar comentarios-historia |

---

## 16. Riesgos y preguntas abiertas para la reescritura

1. **¿Se sigue sirviendo a hd-opm?** Si la librería de autoría queda, hay que
   publicarla con API versionada y dejar la byte-identidad como test de
   regresión opcional, no como restricción de diseño. Si no queda, `autoria/`
   se reduce al *gate* de emisión que usa `render-headless`.
2. **¿Proto-modelo laxo o estricto?** La evidencia (F5-parcial: retiro de V3,
   V4, V5 y V7 con equivalencia byte a byte; retiro de `cuando` y `según` por
   pérdida silenciosa; defectos D1 a D3) apunta a un proto **estricto** en OPL-ES
   con convención de estructura, y la tolerancia léxica en la skill.
3. **¿Tutor determinista o ayuda del agente?** Hoy coexisten un tutor sin LLM y
   un agente con LLM que consume el mismo corpus. Una reescritura podría dejar
   el tutor como copy estático por gesto y el agente para lo contextual.
4. **Corpus canónico**: definir un contrato de importación del corpus KORA (un
   artefacto versionado y opcional) en vez de una ruta de disco. AGENTS.md
   prohíbe codificar rutas a repositorios de dominio; KORA es el canon, pero la
   misma lógica aplica.
5. **Especie y versiones en el almacenamiento**: moverlas al registro del modelo
   elimina `especieWorkspace` y parte de la complejidad del CLI y de
   `repoMemoria`.
6. **Migración de datos**: `anclasNormativas`, `notasMesa`, `mesaExploracion`,
   `procedencia` y el Testigo-Base ya existen en modelos de producción; mantener
   la hidratación o proveer un migrador.
7. **Defectos D1 a D3** (§4.7): deben corregirse o hacer que el compilador
   rechace, antes de que cualquier consumidor confíe en el bundle compilado.
   Ningún test actual los cubre (la suite está verde con ellos presentes).
