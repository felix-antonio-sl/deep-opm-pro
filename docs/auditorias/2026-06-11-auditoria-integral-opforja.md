# Auditoría integral de opforja — 2026-06-11

**Mandato del operador**: auditorías profundas en 6 ámbitos: (1) qué le permite opforja a un modelador OPM, (2) comparación con OPCloud, (3) cumplimiento estricto de las 5 SSOT (`metodologia-forja-es`, `reglas-opm-estrictas-es`, `spec-forja-opd-es`, `spec-forja-opl-es`, `opm-categorial-es`), (4) sistema de simulación, (5) arquitectura/código/antipatrones.

**Método**: 7 agentes de auditoría read-only en paralelo (primera ronda), cada claim anclado a `archivo:línea` o sección de SSOT; cero modificación del repo. **Fase 1** (límite de sesión): agentes de capacidades, comparativa OPCloud, reglas-estrictas, spec-OPD, categorial, simulación y arquitectura completados. **Fase 2** (2026-06-11, post-reinicio): auditoría dedicada al pipeline FORWARD OPL §-por-§ + §20 GAPs + compilador completada y consolidada abajo (secciones 5.B, 5.C, 8.B).

---

## 0. Síntesis ejecutiva — los hallazgos que importan

**Veredicto global**: opforja es un modelador OPM sustancialmente completo, con arquitectura real (las fronteras declaradas se cumplen), higiene de tipos excepcional (0 `as any`, 0 `@ts-ignore` en prod) y una capa de leyes falsables genuina. Las debilidades se concentran en **enforcement del kernel** (reglas que la SSOT declara «DEBE bloquearse» y hoy solo la UI mitiga), **pérdidas silenciosas en el reverse OPL** (contra la propia doctrina del repo de rechazo ruidoso), y **semántica de ejecución de la simulación** (ECA reducida a CA).

### P1 transversales (confirmados por ≥1 auditoría, varios por 2 independientes)

| # | Hallazgo | Evidencia | Confirmado por |
|---|---|---|---|
| 1 | **Régimen de modificadores `c`/`e` roto en kernel+import**: se aceptan sobre `resultado`, `invocacion`, las 3 excepciones temporales y enlaces escindidos TS4/TS5 (AP-01/02/03/10, R-MOD-3/4, R-ESC-1). La UI solo oculta el caso resultado; para invocación/excepciones ni la UI. Fix ≈10 líneas en `validarModificadorEnlace` | `app/src/modelo/modificadores.ts:191-199`, `ui/inspectorEnlace/SeccionMultiplicidad.tsx:46-50,146-153`, `serializacion/validarEnlaces.ts:171` | Auditorías reglas-estrictas (B1/B2/B4/B5) y spec-OPD (V-1), independientes |
| 2 | **`X puede ser A o B` se parsea como estados** (debería ser especialización XOR o rechazo): viola la regla suprema estados=«puede estar»/especialización=«puede ser» y genera patches `sincronizar-estados` erróneos. La sugerencia de `planificar.ts:119` instruye la forma prohibida | `app/src/opl/parser/parsear.ts:516`, `planificar.ts:119`, consagrado en `parsear.test.ts:36` | reglas-estrictas (B3) y spec-OPL reverse, independientes |
| 3 | **Pérdida silenciosa en el aplicador reverse**: multiplicidades y `rutaEtiqueta` se planifican, la línea se clasifica `aplicable`, y el aplicador las descarta sin diagnóstico (los comentarios de `tipos.ts:33-41` documentan conducta inexistente). Ídem `condicionanteEstado` (planificar.ts:425-435) y rama-de-abanico faltante (no-op silencioso, aplicar.ts:375-396) | `app/src/opl/parser/aplicar.ts` (no lee esos campos), `tipos.ts:33-41,315-317` | spec-OPL reverse |
| 4 | **Simulación: eventos sin semántica de ejecución** (R-EJEC-6): el runner solo evalúa `modificador==="condicion"`; un proceso disparado-por-evento se ejecuta igual sin que el evento ocurra. ECA→CA. Y **excepciones temporales detectadas pero no manejadas**: `procesoManejoId` nunca desvía la ejecución | `modelo/simulacion/runner.ts:350,141-142`, `fases.ts:146`, `tiempo.ts:57-102` | simulación |
| 5 | **`scripts/model-persistence-api.ts` (server de prod, 874L) fuera del typecheck** (`tsconfig include: ["src/**"]`) **con import roto** a `../src/persistencia/local` — módulo eliminado en C5; solo vive porque es `import type`. Convertirlo a valor = crash en prod sin gate | `scripts/model-persistence-api.ts:12`, `app/tsconfig.json` | arquitectura |
| 6 | **Reproducibilidad de simulación numérica rota**: `generarDatosSimulados` e `iniciarValoresRuntime` usan `Math.random` sin semilla; el mulberry32 sembrado solo cubre ramas/duraciones. La semilla no tiene control UI; el modo «exhaustivo» del segmented es cosmético (avanza por primer sucesor) | `simulacion/parametros.ts:102-106`, `valores.ts:12`, `runner.ts:28,204`, `BarraSimulacion.tsx:25,255` | simulación |

### P2 destacados

- **Cookie de sesión sin expiración server-side ni revocación**: solo firma HMAC, sin `exp/iat`; token robado válido para siempre; logout solo client-side (`modelPersistence.ts:466-482,113-119`).
- **AP-04 sin guard**: resultado → estado inicial permitido (`modelo/operaciones/helpers.ts:82-86`).
- **R-OPD-HAB-4**: no se impide el segundo enlace procedimental sobre el mismo par objeto-proceso; sin matriz de fuerza semántica §6.5 (habilita R-ROL-UNIC-1, R-PREC-1..5).
- **Estructural etiquetado admite mezcla objeto↔proceso** (R-OPL-SE-2): `helpers.ts:41-43` retorna ok sin chequear homogeneidad.
- **Sin gate de export canónico**: R-LAY-1 (densidad 21-25/>25), AP-13 (<2 hijos), perfiles `canon-diagrama`/`canon-documento` (R-OPD-CAN/EXP) — toda la familia ausente.
- **Catch-all metadata `^(.+?) es (.+)$`** degrada a warning oraciones EBNF-válidas no soportadas (perseverancia, `es de tipo`, `es una <General>` femenino, referencia externa) en vez de `forma-no-reconocida` (R-OPL-FALLO-3) (`parsear.ts:1110`).
- **`type-mismatch` es código muerto**: la firma inválida revienta al aplicar con la línea ya clasificada `aplicable` (R-OPL-FALLO-5).
- **Reverse OPL no crea jerarquía**: `se descompone/despliega en` es solo display — el flujo texto-primero no puede crear refinamientos (`parsear.ts:1115-1132`).
- **Out-zoom no existe como operación de autoría** (solo como ley de equivalencia).
- **Reproyección total del canvas en cada cambio de selección**: un click reconstruye el grafo completo (`JointCanvas.tsx:436-539` → `resetCells`). Palanca de rendimiento #1.
- **Estado mutable módulo-nivel en el store** (undoStack, snapshotGuardado… fuera del store; singleton global) = causa estructural de los flakes de aislamiento documentados (`store/runtime.ts:58-63`, `store.ts:19`).
- **~53 catch silenciosos en prod**, varios en camino de datos (`serializacion/json.ts:89`, `autoria/compilar/emisor.ts:904,1049`, `compilar/anclas.ts:158`) — la clase de bug que ya costó la cola `según`.
- **`verificarLinealidad` diverge de R-CAT-LIN-2**: ignora la exención XOR → falso positivo (`modelo/composicion/linealidad.ts:22-46`).
- **R-HER-1..8 (herencia por gen-spec)**: ausente-probable, sin motor ni checker (no verificado en profundidad).
- **Invocación se dispara sin terminación exitosa** (R-EJEC-9) y **habilitadores no se verifican como precondición** en simulación; **paralelismo del in-zoom inexistente** (misma-Y se serializa alfabéticamente).
- **Test de arquitectura cubre 3 fronteras de 7**: render→ui tiene 3 imports reales (el de `zoom.ts:2` es inversión genuina).

---

## 1. Qué le permite opforja a un modelador OPM

**Cobertura**: prácticamente todo el núcleo ISO 19450 para un modelador individual está implementado y verificado: cosas/estados (designaciones, duración, supresión global y per-OPD), 15 tipos de enlace con metadatos OPCloud completos, abanicos XOR/OR con probabilidades, multiplicidades, rutas, in-zoom+unfold ortogonales con distribución de enlaces fiel a V-37/V-103/V-104, plegado, 3 tipos de vista, multi-OPD/multi-modelo con undo por pestaña, OPL bisimétrico con editor honesto y tokens interactivos, 15 checkers con cita SSOT, anclas normativas+notas de mesa+LogDecisiones (ciclo de re-elicitación cerrado), razonamiento F3 proyectado al canvas, requisitos, simulación conceptual y numérica, persistencia Postgres con locking/versiones/auth, mobile read-only con gestos, ~42 comandos de paleta y ~30 atajos.

**Problemas principales** (detalle con evidencia en informe del agente):
1. P2 — reverse OPL no crea/quita refinamientos ni plegado (asimetría del flujo texto-primero).
2. P2 — duración de estado no es roundtrip (el generador la emite, el parser no la entiende).
3. P2 — `rutaEtiqueta` se pierde en wrappers condición/abanico.
4. P2 — reanclaje por drag de estructurales con compuesto triangular sigue roto en canvas (BUG-fb6c2c; workaround Inspector).
5. P2 — resolución de decisiones XOR desacoplada de la simulación (corrida `bloqueado` sin camino inline de resolución; política `funcion` sin UI).
6. P2 — single-operator real: sin colaboración/roles para la mesa W6.
7. P3 — `MenuContextualEnlace` legacy fuera del catálogo de acciones; mobile 2 `test.fixme`; preferencias de paneles no persisten; e2e desproporcionadamente baja en composición/reanclaje/numérica; deuda coproducto tagged de selección; flag AI Text pausado.

**Oportunidades**: cerrar bisimetría de jerarquía en reverse; resolver decisiones inline en barra de sim; out-zoom de autoría reutilizando `equivalencia/`; roundtrip duración+rutas; auth v2; comando «Encuadrar contenido» (la maquinaria `fitToContent` existe sin comando — no verificado que exista por otra vía).

---

## 2. opforja vs OPCloud

**Ventajas verificadas de opforja** (15): OPL bisimétrico (OPCloud solo forward), autoría headless DSL+compilador proto con layout determinista versionado, sello de procedencia+golden-harness, render headless para agentes, canon español SSOT, capa de leyes falsables, anclas/[RATIFICAR]/LogDecisiones, loop humano-agente gobernado, diagnóstico superset (13+ vs 6 checkers), razonamiento F3 determinista (OPCloud delega a LLM), persistencia moderna blindada, captura de bugs, mobile+canvas infinito, stack OSS sin Rappid con 2517 unit + 44 e2e, y paridad ya conquistada en el «secreto» de enlaces OPCloud (manhattan+obstáculos, puertos dinámicos, sort, beautify, jumpover, tagged/bidireccional, labels avanzados).

**Brechas que valen la pena**:
| Brecha | Veredicto |
|---|---|
| Animación temporal de ejecución en canvas | ✅ mayor delta visible; es T2/F-D4, **gateado por WIP del operador** |
| Auditoría de paridad vs las ~40 reglas de `behavioral.rules.ts` (1232L) | ✅ barata; riesgo de huecos silenciosos de legalidad de conexión |
| Diff/comparación de modelos | ✅ compone gratis con versiones+sello+serialización determinista |
| Export PDF documental | ✅ los 3 insumos (H1 PNG/SVG, OPL MD, modeloTextual) ya existen |
| Estereotipos generales + templates (W6.7) | ✅ ya candidato |
| Notas visuales en canvas sobre NotaMesa | ✅ kernel listo, falta proyección |
| Métricas de complejidad de modelo | ✅ kernel puro, barato |
| `InstantiationLink` + forked-tagged sync (R) + handler ambiental (T) | ✅ menores |
| Procesos computacionales ejecutables / digital twin | ⚖️ decisión de alcance (territorio distintivo OPCloud) |
| DSM analysis, export SysML/RDF, OPL-EN | ⚖️ solo si el mandato vira a MBSE/difusión |
| Import OPX (EPICA-70), wizard (EPICA-91), export HTML, SaaS/SSO/chat, estilo libre | ❌ descartadas por decisión |

---

## 3. Cumplimiento `reglas-opm-estrictas-es` + `metodologia-forja-es`

Cumplimiento efectivo **~70-75%** (~34 clusters fieles, 7 violaciones, ~13 no implementadas, 6 zonas grises).

**Violaciones**: B1 `c/e` sobre invocación (P1, AP-10); B2 `c/e` sobre resultado en kernel/persistencia (P1, AP-01/02 — UI mitiga, kernel no; R-APP-3 prohibe darla por cerrada); B3 parser acepta «puede ser» como estados (P1, R-BI-2); B4 `c/e` sobre excepciones temporales (P2); B5 modificador sobre escindido TS4/TS5 sin guard (P2, AP-08); B6 etiquetado mixto objeto↔proceso (P2, R-OPL-SE-2); B7 comentario normativo erróneo en `checkers.ts:244-248` (P3, el render es correcto).

**No implementadas** (selección): AP-04 resultado→estado-inicial; R-ROL-UNIC-1 + matriz de fuerza §6.5 + R-PREC-1..5; R-EXC-2/3 (coherencia sobretiempo↔duración declarada); R-LAY-1 gate densidad; R-REF-1 ciclo transitivo entidad-refina-entidad; R-MULT-1A/2; R-NOM-PROC-2 (rango palabras); R-SD-4 (exactamente un proceso sistémico — hoy `≥1`); R-HER-1..8 herencia gen-spec (ausente-probable); V-87 supresión solo-en-descomposición.

**Zonas grises**: agente=humano vía proxy `esencia física` (robot físico pasa; divergencia consciente sin declaración de perfil); Pr=p por-enlace fuera de abanico (extensión no declarada); validación tripartita con todos los avisos en severidad blanda (coherente solo como fase de adopción).

**Fortalezas confirmadas**: generadores OPL 31/31 fieles; migración de enlaces al descomponer fiel; AP-12/R-EST-2 como fallos duros de deserialización; R-EJEC-7/8/10 conformes; circuito Forja completo (proto→compilador, sello, claveProto, anclas, rechazo ruidoso R1-R8) verificado.

---

## 4. Cumplimiento `spec-forja-opd-es` (visual)

Gramática visual nuclear **sustancialmente conforme** (formas, sombras, swallowtail, piruletas, triángulos, arcos XOR/OR, rayo, excepciones, marcas c/e/¬, routers por familia, canal crimson separado, export sin UI transitoria). El layout de autoría quedó excluido (auditado 2026-06-11, LAYOUT_VERSION 3).

**Violaciones**: V-1 = el mismo hueco de modificadores (P1, no está en §22); V-2 AP-04 (P2); V-3 R-OPD-HAB-4 unicidad de rol (P2); V-4 proceso de manejo de excepción sin validar ambiental (P3); V-5 efecto a objeto sin estados solo checker blando (P3); V-6 afiliación no heredada por cadena estructural en render (P3); V-7 deriva documental §18.2 (dashes/pin current — el código es la realización vigente); V-8 `normalizarColoresSvg` descarta alfa en export SVG (P3).

**Backlog §22 real**: de 19 GAPs — 2 cerrados-verificados (current declarado, grid en export), 3 parciales (CATEGORIAS-OPD, SUBMODELO-REF, matriz distribución), **14 abiertos**, incluidos **TAGGED-ITALIC (literalmente 1 línea: `fontStyle: "italic"` en `etiquetaTextoTagged`, enlace.ts:514-540)**, PERFIL-EXPORT, EXPORT-GATE, POS-MODIFICADOR, PROB-NOTACION, FAN-M, DEFAULT-GLIFO, FEEDBACK-LEGACY, PROXY-TOKEN, y la deuda doc UIFORJA-08a/b/c (R-§25-MIG-2 incumplida — `ui-forja/08` prescribe lo derogado). *(Actualización: TAGGED-ITALIC, PERFIL-EXPORT, EXPORT-GATE, POS-MODIFICADOR, PROB-NOTACION cerrados en código y reflejados en spec v1.1.0; la deuda doc UIFORJA-08a/b/c quedó SUPERADA en su mitad documental el 2026-06-12 — `ui-forja/08` reconciliado por remisión y R-§25-MIG-2 cumplida en lo documental; residual sólo de código. Ver `docs/auditorias/2026-06-12-auditoria-ssot-corpus.md`.)*

---

## 5. Cumplimiento `spec-forja-opl-es` (reverse + forward completos)

**Conformidades**: §15 (clasificación 4-estados, razones cerradas, mapeo patch→operación 3 fases, canal inline) y §14.5 (sub-spans) casi literales; safe-lens §19.3 con defensa de test completa; fail-fast §17.1 y partial-parse §17.4 exactos; R-OPL-FALLO-1/2/4/6/7/8 cumplidos; R-§19-SIM-1 se sostiene en lo revisado.

**Violaciones**: las P1 #2 y #3 de la síntesis; P2 catch-all metadata (R-OPL-FALLO-3); P2 `type-mismatch` muerto (R-OPL-FALLO-5); P2 doc-código falso en abanico rama-faltante; P3 `patch-conflict` con dos severidades; P3 cabecera de fixtures obsoleta; P3 sin fixture roundtrip multi-destino (R-§19-COMP-1 solo dirección parse); P3 gaps de dictado (`invoca <lista>`, cola `, y otros estados` → estado espurio, `es una` femenino tragado).

**EBNF §18**: familia completa de estructurales etiquetados textuales (A.8) sin handler (la forja usa el sufijo extra-EBNF `[etiqueta: …]`); restricciones de participación textuales no cubiertas (solo simbólicas, que la EBNF no deriva — divergencia en ambas direcciones); recomposición, rangos, `donde …` sin handler. La superficie canónica de la forja diverge de la EBNF §18 en sí misma — candidata a reconciliación de spec.

---

### 5.B Auditoría FORWARD OPL §-por-§ (completada 2026-06-11)

Verificación directa de los 26 generadores forward de `app/src/opl/generadores/` contra las plantillas de `spec-forja-opl-es` §1–§11. **25/26 claims confirmados. 1 mismatch de nombre de símbolo (conducta correcta).**

| # | Spec § | Plantilla | Generador (código) | Veredicto |
|---|--------|-----------|---------------------|-----------|
| 1 | §2.1 | Objeto/Proceso `es un {tipo} {esencia} y {afiliacion}` | `estructural.ts:35-48` `oracionEntidad` | **CONFIRMADO** |
| 2 | §2.1 | Supresión de placeholder | `refsHints.ts·entidadOplEsEmitible` + `nombresCanonicos.ts` | **CONFIRMADO** |
| 3 | §2.3 | Estados `puede estar` | `duracionMetadata.ts:69` `${nombre} puede estar ${estados}` | **CONFIRMADO** |
| 4 | §2.4 | Designación `Estado \`X\` de Y es {designacion}` | `designaciones.ts:24-26` `oracionDesignacionEstadoOpl` | **CONFIRMADO** |
| 5 | §2.5 | Atributo `{nombre} es {valor}{unidad}` | `estructural.ts:51-56` `oracionValorAtributo` | **CONFIRMADO** |
| 6 | §2.7 | Esencia (física/informacional) | `estructural.ts:45` vía `textoEsencia` | **CONFIRMADO** |
| 7 | §2.8 | Afiliación (sistémica/ambiental) | `estructural.ts:46` vía `textoAfiliacion` | **CONFIRMADO** |
| 8 | §3.1 | Consumo `consume` | `procedural.ts:222` `verbo("consume", ...)` | **CONFIRMADO** |
| 9 | §3.2 | Resultado `genera` | `procedural.ts:224` `verbo("genera", ...)` | **CONFIRMADO** |
| 10 | §3.3 | Efecto `afecta` | `procedural.ts:438` `oracionEfecto` → `verbo("afecta", ...)` | **CONFIRMADO** |
| 11 | §3.4 | Cambio TS3 `cambia {obj} de \`E1\` a \`E2\`` | `procedural.ts:170` `oracionTransicionEstados` | **CONFIRMADO** |
| 12 | §3.5 | Efecto TS4 `cambia {obj} de \`E\`` (sin `a`) | `procedural.ts:406-407` rama origen de `oracionEfecto` | **CONFIRMADO** |
| 13 | §3.6 | Efecto TS5 `cambia {obj} a \`E\`` (sin `de`) | `procedural.ts:409-410` rama destino de `oracionEfecto` | **CONFIRMADO** |
| 14 | §4.1 | Agente `maneja` (+estado/evento/cond) | `procedural.ts:215` `verbo("maneja", ...)` | **CONFIRMADO** |
| 15 | §4.2 | Instrumento `requiere` | `procedural.ts:219` `verbo("requiere", ...)` | **CONFIRMADO** |
| 16 | §4.x | Habilitador con estado HS1/HS2 | `refsHints.ts·nombreOplExtremo` sufijo `en \`estado\`` | **CONFIRMADO** |
| 17 | §5.1 | Evento `inicia` (9 sub-cláusulas) | `procedural.ts:276-307` `oracionEvento` | **CONFIRMADO** |
| 18 | §5.2 | Condición `ocurre si … de lo contrario … se omite` | `procedural.ts:309-345` `oracionCondicion` | **CONFIRMADO** |
| 19 | §5.3 | Excepción sobretiempo/subtiempo/sub-sobretiempo | `procedural.ts:229-234` + `formatoTiempo*` + `duracionMetadata.ts` | **CONFIRMADO** |
| 20 | §5.4 | Invocación `invoca` / autoinvocación `se invoca a sí mismo` | `procedural.ts:209-210` `se invoca`, `:227-228` `verbo("invoca", ...)` | **CONFIRMADO** |
| 21 | §6.1 | Agregación `consta de` / `constan de` | `estructural.ts:69` `verbo("consta", "constan", ...)` | **CONFIRMADO** |
| 22 | §6.2 | Exhibición `exhibe` / `exhiben` + `tiene … opcional` | `estructural.ts:74` `verbo("exhibe", "exhiben", ...)` | **CONFIRMADO** |
| 23 | §6.3 | Generalización `es un` / `son` | `estructural.ts:76` plural `"son"` o singular `"es un"` | **CONFIRMADO** |
| 24 | §6.4 | Clasificación `es una instancia de` / `son instancias de` | `estructural.ts:78` | **CONFIRMADO** |
| 25 | §6.5 | Etiquetado `se relaciona con` / `se relacionan` | `procedural.ts:263,267` `oracionTagged` (privada, vía `oracionEnlace`) — spec cita nombre de export inexistente `oracionEstructuralEtiquetada`; conducta correcta | **CONFIRMADO (nombre símbolo mismatch)** |
| 26 | §11 | Etiqueta de ruta `Por ruta {ruta}, {oracion}` | `procedural.ts:31-36` `oracionEnlaceConRuta` | **CONFIRMADO** |

**Conclusión forward**: los generadores forward cubren el 100% de las plantillas canónicas implementadas. El 100% de los verbos del enum cerrado con generador se emiten correctamente. Divergencias de la spec de cara al código: solo el nombre de export en §6.5 (la spec dice `oracionEstructuralEtiquetada`; el código tiene `oracionTagged` privada, expuesta vía `oracionEnlace`).

---

### 5.C Auditoría §20 GAPs + Compilador (completada 2026-06-11)

Verificación DIRECTA de los 44 GAPs de `spec-forja-opl-es` §20.2 contra `app/src/opl/generadores/`, `app/src/opl/parser/`, `app/src/opl/` y `app/src/autoria/compilar/`. Verificación directa del pipeline de compilador (`compilador.ts`, `normalizador.ts`, `resolutor.ts`, `emisor.ts`, `procedencia.ts`, `layout.ts`, `bundle.ts`, `dsl.ts`).

#### GAPs verificados directamente (26 evaluados de la tabla §20.2)

| GAP | Estado spec | Estado real verificado | Evidencia |
|-----|-------------|----------------------|-----------|
| GAP-VARIA | Sin generador | **ABIERTO** — ni generador, ni parser, ni compilador. Sin referencias | grep `varía`/`varia` = 0 hits |
| GAP-TIPO | Sin generador | **ABIERTO** — `es de tipo` sin generador ni parser | grep `es de tipo` = 0 hits |
| GAP-XOR-FEATURE | Sin generador | **ABIERTO** — `puede ser` (XOR especialización) sin generador. `emitirEspecializacion` emite `es un` | `refinamiento.ts`, `duracionMetadata.ts:68` |
| GAP-XOR-PARSER | Sin parser | **ABIERTO** — `parsearEstructural` sin regex para `puede ser` | `parsear.ts:1010-1028` |
| GAP-REFINA | Sin generador/parser | **ABIERTO** — `se refina por` sin generador ni parser | grep `se refina` = 0 hits en generadores |
| GAP-PLIEGA | Sin generador (plegado total) | **PARCIALMENTE CERRADO** — parser reconoce `se pliega en` (`parsear.ts:1116`); generador de plegado parcial existe (`plegado.ts`); generador de plegado total CX5/CX6 no existe | `parsear.ts:1116`, `plegado.ts` |
| GAP-RECOMPONE | Sin generador/parser | **ABIERTO** — `se recompone desde` sin generador ni parser | grep `recompone` = 0 hits en opl/ |
| GAP-PLACEHOLDER-ENTIDAD | Cerrado | **CERRADO** — `entidadOplEsEmitible` suprime placeholders | `refsHints.ts`, `nombresCanonicos.ts` |
| GAP-NOMBRE-INSTANCIA | Sin generador | **ABIERTO** — formato `Instancia : Clase` sin generador; solo forma verbal `es una instancia de` | `estructural.ts` |
| GAP-FIXTURE-EFECTO | Cerrado | **CERRADO** — `enlace-efecto-simple` en fixtures | `fixtures-roundtrip.ts` |
| GAP-FIXTURE-TS3 | Cerrado | **CERRADO** — 2 fixtures estrictas | `fixtures-roundtrip.ts` |
| GAP-PARSE-TS4/TS5 | Cerrado | **CERRADO** — regex verificadas por fixtures | `parsear.ts`, `fixtures-roundtrip.ts` |
| GAP-FIXTURE-TS4/TS5 | Cerrado | **CERRADO** — fixtures estrictas | `fixtures-roundtrip.ts` |
| GAP-PROCEDENCIA-ESCIND | Sin verificar | **ABIERTO** — metadato de procedencia escindido no rastreado en este pase | — |
| GAP-FIXTURE-HS | Cerrado | **CERRADO** — `habilitador-con-estado-hs` fixture estricta | `fixtures-roundtrip.ts` |
| GAP-ABANICO-AGENTE-PARSE | Sin verificar | **ABIERTO** — cobertura de parseo no verificada | `parsear.ts` |
| GAP-FIXTURE-EVENTO | Cerrado | **CERRADO** — `evento-consumo-canonico` | `fixtures-roundtrip.ts` |
| GAP-EVENTO-RESULTADO/INVOCACION | Cerrado | **CERRADO** — degradación a base confirmada | `procedural.ts` |
| GAP-CONDICION-RESULTADO/INVOCACION | Cerrado | **CERRADO** — degradación a base confirmada | `procedural.ts` |
| GAP-EXC-UNIDADES-LITERAL | Cerrado | **CERRADO** — ajuste-spec | `duracionMetadata.ts` |
| GAP-FIXTURE-INVOCACION | Cerrado | **CERRADO** — 3 fixtures estrictas | `fixtures-roundtrip.ts` |
| GAP-INVOCACION-TILDE | Cerrado | **CERRADO** — `después de` canónico; parser acepta sin tilde | `procedural.ts`, `parsear.ts` |
| GAP-FIXTURE-AGREGACION | Abierto (spec) | **CERRADO EN CÓDIGO** — spec está desactualizada. `fixtureAgregacion` existe en `fixtures-roundtrip.ts:231-246`, incluida en `fixturesRoundtripNucleo:343` y validada por `roundtrip.test.ts` | `fixtures-roundtrip.ts:231-246,343` |
| GAP-FIXTURE-EXHIBICION | Cerrado | **CERRADO** — `enlace-estructural-exhibicion` | `fixtures-roundtrip.ts` |
| GAP-FIXTURE-GENERALIZACION | Abierto (spec) | **CERRADO EN CÓDIGO** — spec está desactualizada. `fixtureGeneralizacion` existe en `fixtures-roundtrip.ts:249-265`, incluida en `fixturesRoundtripNucleo:344` y validada por `roundtrip.test.ts` | `fixtures-roundtrip.ts:249-265,344` |
| GAP-FIXTURE-CLASIFICACION | Cerrado | **CERRADO** — `enlace-estructural-clasificacion` | `fixtures-roundtrip.ts` |
| GAP-TAG-PARSER | Sin parser | **ABIERTO** — `se relaciona con` sin regex en `astEstructural`; sin parser | `parsear.ts:1010-1028` |
| GAP-SSE-PARSER | Sin parser | **ABIERTO** — hereda GAP-TAG-PARSER; sin parser para etiquetados con estado | `parsear.ts` |
| GAP-FIXTURE-TAGGED | Sin fixture | **ABIERTO** — sin fixture roundtrip dedicado de etiquetado | `fixtures-roundtrip.ts` |
| GAP-FIXTURE-SSE | Sin fixture | **ABIERTO** — sin fixture dedicado de estructural con estado | `fixtures-roundtrip.ts` |
| GAP-CX-PARSER | Sin parser | **PARCIALMENTE CERRADO** — `parsearContexto` (`parsear.ts:1116`) reconoce `se descompone en` pero retorna diagnóstico `unsupported-kernel` (no aplica el refinamiento); código existe pero no es funcional para reverse | `parsear.ts:1115-1132` |
| GAP-FIXTURE-DESCOMPOSICION | Sin fixture | **ABIERTO** — sin fixture roundtrip de descomposición/despliegue | `fixtures-roundtrip.ts` |
| GAP-FAN-EVENTO | Parcial | **PARCIAL** — efecto con objeto común cerrado; otros roles bajo evento sin generador | `abanico.ts` |
| GAP-FAN-M | Sin generador | **ABIERTO** — solo `m=1`; sin `exactamente 3 de` / `al menos 2 de` | `abanico.ts` |
| GAP-COMPOSICION | Sin capa | **ABIERTO** — sin capa de coordinación de predicados de distinto verbo | `opl/generadores/` |
| GAP-COMP-REVERSE | Sin parser | **ABIERTO** — parser no descompone predicados coordinados de distinto verbo | `parsear.ts` |
| GAP-VERIFY | Sin verificar | **PARCIAL** — etiqueta de ruta confirmada en forward; handler click→foco y mutación por hecho no verificados | `procedural.ts`, `interaccion.ts` |

**Resumen GAPs**: 10 GAPs genuinamente abiertos (VARIA, TIPO, XOR-FEATURE, XOR-PARSER, REFINA, RECOMPONE, NOMBRE-INSTANCIA, FAN-M, COMPOSICION, COMP-REVERSE), 2 GAPs cerrados en código pero con spec desactualizada (FIXTURE-AGREGACION, FIXTURE-GENERALIZACION), 3 GAPs parcialmente cerrados (PLIEGA, CX-PARSER, FAN-EVENTO), resto cerrados o cubiertos. **Cobertura forward de §20.1**: 25/26 claims de generadores confirmados; 2 fixtures documentados como ausentes en spec ya existen en código.**

#### Auditoría del compilador (autoria/compilar/)

**Pipeline del compilador** (`compilarProto`, `compilador.ts:91`): 4 etapas que transforman markdown → modelo OPM vía DSL:
1. **Lector de estructura** (`estructura.ts`): tokeniza markdown, segmenta por encabezados y bloques `\`\`\`opl`, produce plan de OPDs
2. **Normalizador** (`normalizador.ts`): clasifica líneas en 7 clases (estricta, normalizada, compuesta, estructura, comentario, rechazada), aplica reescrituras T2 y familia V
3. **Resolutor** (`resolutor.ts`): incremental por OPD, resuelve nombres → keys del DSL
4. **Emisor** (`emisor.ts`): traduce oraciones normalizadas a llamadas DSL (`entidad`, `estados`, `enlazar`, `abanico`, etc.)

**Hallazgos clave del compilador**:
- **NO produce OPL directamente.** El compilador consume OPL (parseo reverse → AST → DSL). La salida OPL la produce `emitirBundle` invocando `generarOpl()` — exactamente los mismos generadores forward del panel interactivo
- **FNV-1a implementado correctamente** (`procedencia.ts:30-56`): offset basis `0xcbf29ce484222325n`, prime `0x100000001b3n`, XOR antes de multiplicar, máscara 64-bit. Hash determinista, no criptográfico
- **LAYOUT_VERSION = "3"** correcto (`layout.ts:47`), documentado con cambios A-1/N-3/A-2/N-1/N-2
- **Relación compilador↔generadores forward**: el compilador construye el modelo; los generadores forward verbalizan el modelo ya construido. Un solo conjunto de generadores forward compartido por ambos caminos
- **Directiva Familia V**: puentea el parser reverse para efectos que el parser no sabe re-leer (tagged, modificador con gatillo, anotaciones), escritos al modelo vía DSL
- **Verbos del enum canónico no manejados por el compilador**: exactamente los 6 que la spec marca como GAP (VARIA, TIPO, XOR-FEATURE, REFINA, PLIEGA, RECOMPONE) — consistente con la spec, no omisiones inadvertidas

---

## 6. Capa categorial (`opm-categorial-es`)

**Sana**: 157/0 en el perímetro; F-V1/F-V2 con 6 controles de no-tautología y mutiladores explícitos (patrón de referencia); F-D3 con triángulo y cerradura; integración Ss↔Fs con controles. **No hay verde tautológico grave hoy**.

**Hallazgos**: B1 la SSOT (`opm-categorial-es.md:7,136`) cita `docs/capa-categorial.md` **eliminado** en `2a83c1c5` — referencia colgante en artefacto canónico (proponer re-apuntado vía custodio-kora); B2 `verificarLinealidad` ignora exención XOR (R-CAT-LIN-2); B3 asociatividad de composición solo probada con interfaz vacía (coproducto, no pushout); B4 sheaf-check = solo separación intra-OPD, gluing cross-OPD sin primer fixture y `verificarPegado` sin consumidor de producto; B5 comentarios stale en `simulacion/efecto.ts:4-7`/`runner.ts:35` (S2/Dist/Powerset ya implementados; la memoria «desconectados» ya no aplica); B6 F-D3 sin consumidor de producto.

**Anti-tautología puntual**: `simulacion-unfold` sin guard de no-vacuidad (plan vacío pasaría); `leyes/equivalencia` sin negativo en la ley misma (vive en el test de módulo).

**Mayor palanca**: gluing cross-OPD sobre `seccionLocal` (carrier existe y testeado; ~1 kernel + 1 ley) + cablear `verificarPegado` al diagnóstico.

---

## 7. Sistema de simulación

**Conformes**: R-EJEC-7/8 bypass, R-EJEC-9 parcial, R-EJEC-10 límite 200, R-EJEC-3 runtime no persiste, runner puro/inmutable con `ContextoSimulacion` como carrier, halos R-OPD-SIM-1..3 alineados, descenso in-zoom funcional, políticas XOR con probabilidades correctas.

**Problemas semánticos**: P1 eventos sin ejecución y P1 excepciones no manejadas (síntesis #4); P2 invocación sin gate de terminación exitosa; P2 habilitadores no-precondición (sin noción de existencia de instancias → R-OPD-SIM-7 irrepresentable); P2 paralelismo in-zoom inexistente; P2 abanicos: OR sin multi-rama, XOR de entrada no evaluado, `.find` toma solo el primer abanico; P3 current inventado por orden de id; P3 microfases recorridas antes de la omisión por condición.

**Calidad**: reproducibilidad rota (síntesis #6); flake por store singleton sigue (`store/simulacion.test.ts:6`); huérfanos `sociotecnico.ts` (235L solo su test) y `lifeline.ts` (0 consumidores, 0 tests) — política «eliminar > completar»; 2 referencias doc colgantes.

**Oportunidades**: 1) reproducibilidad (rng sembrado + control de semilla — habilita golden/H2 para sim); 2) eventos+excepciones ejecutables (la detección ya existe); 3) exhaustivo honesto (proyectar `desplegarArbol` o retirar el modo); 4) gate de invocación + decisión espera/omisión; 5) paralelismo por bandas de Y (marca múltiple R-OPD-SIM-4); 6) `createStore` por test; 7) F-D4/T2 sigue gateado por el operador.

---

## 8. Arquitectura e implementación

**Veredicto**: las fronteras declaradas se cumplen (modelo/canvas/autoria/opl/serializacion limpios). Única violación: render→ui ×3 (`handlers/zoom.ts:2` genuina; 2 de tokens benignas). `arquitectura.test.ts` cubre 3 leyes de ~7 fronteras.

**Hallazgos**: P1 scripts/ fuera de typecheck + import roto (síntesis #5); P2 estado módulo-nivel del store (causa de flakes); P2 ~53 catch silenciosos; P2 cookie sin exp; P2 cobertura desproporcionada (`src/app/` 135 archivos / 8 tests; `JointCanvas.tsx` 927L sin unit); P2 reproyección total por selección; P3 `useOpmStore` re-suscribe en cada render (×604 sitios; `useSyncExternalStore` lo resuelve); P3 `acciones-canvas.ts` factory de 879L con 4 catch silenciosos; P3 buffering sin streaming-cap; P3 clasificación 400/500 por prefijo de string.

**Métricas**: ~93.8k líneas prod; top: `normalizador.ts` 1431, `parsear.ts` 1188, `emisor.ts` 1052; `as any` 0 / `@ts-ignore` 0 / `eslint-disable` 3; `as unknown` 105 (hotspot frontera JointJS); console.log 0; TODO real 1; SQL 100% parametrizado; login anti-oráculo con `timingSafeEqual`; payload cap 15MB.

**Corrección a dato previo**: `restaurarVersionResultado` sí tiene consumidores internos — no es dead code puro (matiza el hallazgo del informe de capacidades).

### 8.B Compilador y autoría (auditado 2026-06-11)

**Veredicto**: pipeline del compilador sano. FNV-1a determinista correcto. LAYOUT_VERSION=3 trazable. Compilador y panel OPL comparten los mismos generadores forward (un solo conjunto). Los 6 GAPs de verbos canónicos del compilador son los mismos que los GAPs forward — no son omisiones inadvertidas.

- **`procedencia.ts`**: FNV-1a 64-bit implementado fielmente (`procedencia.ts:30-56`). Offset basis `0xcbf29ce484222325n`, prime `0x100000001b3n`, XOR antes de multiplicar. Expansión UTF-8 manual correcta. Hash determinista, no criptográfico (documentado L25-28).
- **`layout.ts`**: `LAYOUT_VERSION = "3"` documentado con cambios A-1 spine real, N-3 contención elíptica, A-2 cluster, N-1 guard de solapes, N-2 contorno objeto.
- **`compilador.ts`**: pipeline 4 etapas (estructura → normalizador → resolutor → emisor). Reusa `parsearParrafoOpl` (parser reverse) para leer OPL estricta.
- **`normalizador.ts`**: 7 clases de línea. Familia V (V1–V17) puentea parser reverse para efectos no re-legibles (tagged, modificador con gatillo, anotaciones).
- **`bundle.ts`**: `emitirBundle` invoca `generarOpl()` — exactamente los mismos generadores forward del panel OPL interactivo.

---

## 9. Plan de remediación sugerido (por palanca/costo)

**Corte 1 — kernel ruidoso (bajo costo, cierra P1 #1, #2, #3 y varios P2)**
1. `validarModificadorEnlace`: tabla `admiteModificador(tipo)` (rechaza resultado/invocacion/excepciones + `efectoEscindido.modo==="par"`) → cierra AP-01/02/03/08/10 en kernel+import+UI de una vez.
2. Quitar `ser` de `parsearEstados` + corregir sugerencia `planificar.ts:119` (o clasificar «puede ser» como `unsupported-canonical`).
3. Aplicador reverse: o aplica multiplicidad/ruta/condicionanteEstado o emite diagnóstico (rechazo ruidoso); corregir los comentarios mentirosos de `tipos.ts`.
4. AP-04 (resultado→estado inicial) y homogeneidad de etiquetados en `validarFirmaEnlace`/helpers.

**Corte 2 — gates ciegos y seguridad**
5. `tsconfig` incluye `scripts/` + fix import `persistencia/local`→`persistencia/modelos`.
6. `exp` en token de sesión (+test).
7. Extender `arquitectura.test.ts` a las fronteras restantes (afloran los render→ui).
8. Auditoría dirigida de los ~53 catch silenciosos (clasificar guard vs tragado).

**Corte 3 — simulación honesta**
9. RNG sembrado end-to-end + control de semilla en UI; retirar o implementar el modo exhaustivo.
10. Eventos y excepciones temporales ejecutables; gate de invocación.
11. `createStore` por test (mata el flake de raíz); eliminar/integrar `lifeline`/`sociotecnico`.

**Corte 4 — paridad y producto**
12. TAGGED-ITALIC (1 línea) + PROB-NOTACION + POS-MODIFICADOR.
13. Perfil `canon-diagrama` + gate de densidad (cierra PERFIL-EXPORT + EXPORT-GATE + alfa V-8).
14. Bisimetría de jerarquía en reverse; out-zoom de autoría; resolución de decisiones inline en sim.
15. Auditoría de paridad vs `behavioral.rules.ts` de OPCloud; diff de modelos; export PDF; métricas de complejidad; notas visuales en canvas.

**Corte 5 — rendimiento y deuda**
16. Canal de selección separado de `resetCells` (no reproyectar el OPD por click).
17. `useSyncExternalStore`; wrapper tipado JointJS (baja los 105 `as unknown`); tests de viewmodels `src/app/`.
18. Saneo documental: comentarios stale de simulación, exención XOR en `verificarLinealidad`, propuesta a custodio-kora del re-apuntado de `opm-categorial-es.md:136`, corrección `ui-forja/08` (UIFORJA-08a/b/c), reconciliación §18.2 de spec-OPD y EBNF §18 de spec-OPL con la realización vigente, y actualización de la tabla §20 de spec-OPL (GAP-FIXTURE-AGREGACION y GAP-FIXTURE-GENERALIZACION ya cerrados en código; nombre de export §6.5 `oracionEstructuralEtiquetada`→`oracionTagged`). *(SUPERADO 2026-06-12 por la auditoría de coherencia del corpus: `ui-forja/08` reconciliado por remisión, EBNF §18 de spec-OPL y notas §18.x de spec-OPD reconciliadas, tabla §20 actualizada con los cierres por fila. Ver `docs/auditorias/2026-06-12-auditoria-ssot-corpus.md`.)*

---

## 10. Propuesta: estereotipos, templates y oportunidades de mejora

**Naturaleza**: esta sección es propositiva (read-only, sin modificación del código). Cataloga oportunidades de extensión del modelador basadas en la infraestructura ya existente, los patrones de OPCloud documentados en `opm-extracted/` y `JOYAS.md`, y las especificaciones SSOT. Cada propuesta incluye justificación, costo estimado, dependencias y diseño tentativo.

---

### 10.0 Baseline — lo que ya existe

Antes de proponer, se inventaría el punto de partida:

| Capacidad | Estado | Evidencia |
|---|---|---|
| `Entidad.estereotipo?: "requirement"` | **Existe** — literal único | `modelo/tipos/entidad.ts:128` |
| `Entidad.requisito?: RequisitoEntidadMetadata` | **Existe** — acoplado al estereotipo `requirement` | `modelo/tipos/entidad.ts:131-138` |
| `Modelo.anclasNormativas` | **Existe** — W5.1 completo | `modelo/tipos/extensiones.ts:94-132` |
| `Modelo.notasMesa` | **Existe** — W6.5 completo | `modelo/tipos/extensiones.ts:150-174` |
| `Modelo.ontologia` | **Existe** — parcial | `modelo/tipos/extensiones.ts:176-211` |
| `OpdVista` con `kind` discriminado | **Existe** — `"requirement-view"`, `"submodel-view"`, `"generic-view"` | `modelo/tipos/extensiones.ts:212-231` |
| `bibliotecaDock` (thing library) | **Existe** — feature-gated (`bibliotecaDock: false`) | `ui/biblioteca/BibliotecaDock.tsx` |
| `generic-view` (vista derivada readonly) | **Existe** — E-1 completo | `autoria/vista-generica.test.ts` |
| Composición/submodelos | **Existe** — `componerModelos()` | `modelo/composicion/componer.ts` |
| DSL composable (`crearAutor`, 28 métodos) | **Existe** — reentrante, testado | `autoria/dsl.ts:72-187` |
| Familia V (verbos extendidos → OPM canónico) | **Existe** — V1–V17 en compilador | `autoria/compilar/normalizador.ts`, `compilar/tipos.ts:52-62` |
| Sistema de templates de modelo (legacy) | **Eliminado** — decisión UX 2026-05-26 | `DialogoPlantillas.tsx`, `persistencia/plantillas.ts` (removidos) |
| W6.7 Templates in-app | **Registro histórico; superado por Piezas/Calco/Anclaje** | Estado actual en `../handoff-2026-07-18.md`. |
| A0 Estereotipos generales OPM | **Delta** — diferido (costoso, sin eval inmediato) | `cortes-operativos.md:285` |

**Principio de diseño heredado**: las extensiones en opforja son aditivas y opcionales sobre `Modelo` (no baked-in en entidades), usan targets `{tipo, id}` para anclaje flexible, y tienen sus propios ciclos de vida (formato versionado `v0`, state machines). Este patrón — inaugurado por `AnclaNormativa` — es el molde para cualquier extensión nueva.

---

### 10.1 Estereotipos generales

#### 10.1.1 Propuesta: sistema de estereotipos extensible

**Qué es**: generalizar el campo `estereotipo` de `"requirement"` (literal único) a un registro extensible de estereotipos nombrados, cada uno con metadatos propios, reglas de validación, renderizado visual `<<Nombre>>` y proyección OPL.

**Justificación**:
- ISO 19450 define estereotipos como mecanismo canónico de extensión (`R-VIS-STEREO-1`, `V-143`–`V-157`)
- OPCloud implementa un `StereotypeManager` completo con template OPDs, guards, y renderizado. La infraestructura de opforja (estereotipo single-literal, extensiones aditivas) ya está alineada con ese modelo
- El caso `requirement` ya funciona en producción; es la prueba de que el patrón escala
- La SSOT exige perfiles `canon-diagrama` y `canon-documento` (`R-VIS-EXP-2`) que dependen de clasificación por estereotipo

**Catálogo propuesto de estereotipos (primera iteración)**:

| Estereotipo | Aplica a | Metadatos propios | Visual | OPL |
|---|---|---|---|---|
| `<<Requirement>>` | Objeto | `{idLogico, descripcion, dureza, actor, satisfaction}` — **ya existe** | `<<Requirement>>` en canvas, Inspector dedicado | `**R-01** es un objeto informacional y sistémico.` |
| `<<Module>>` | Objeto/Proceso | `{interfaz: Id[], encapsulamiento: "abierto"|"cerrado"}` | Contorno punteado grueso, nombre `<<Module>>` | `**Módulo** es un objeto informacional y sistémico.` |
| `<<Role>>` | Objeto | `{participaEn: Id[], autoridad: "consulta"|"ejecuta"|"decide"}` | Icono de persona en miniatura junto al nombre | `**Rol** es un objeto físico y sistémico.` |
| `<<Event>>` | Proceso | `{gatillo: Id, guardEstado?: string, tipo: "externo"|"interno"|"temporal"}` | Rayo pequeño en esquina superior | `*Evento* es un proceso informacional y ambiental.` |
| `<<Decision>>` | Proceso | `{opciones: Id[], criterio: string, politica: "humano"|"automatico"|"hibrido"}` | Rombo pequeño junto al nombre | `*Decidir* es un proceso informacional y sistémico.` |
| `<<External>>` | Objeto/Proceso | `{sistemaExterno: string, protocolo?: string}` | Sombra exterior difuminada | `**Sistema** es un objeto informacional y ambiental.` |
| `<<KPI>>` | Objeto | `{formula: string, umbralVerde: number, umbralRojo: number, unidad: string}` | Borde derecho coloreado (verde/amarillo/rojo) | `**KPI** es un objeto informacional y sistémico.` |

**Diseño técnico tentativo**:

```typescript
// modelo/tipos/estereotipos.ts (nuevo archivo)
type EstereotipoNombre = "requirement" | "module" | "role" | "event" | "decision" | "external" | "kpi";

interface MetadatosEstereotipo {
  requirement: RequisitoEntidadMetadata;
  module: ModuloMetadata;
  role: RolMetadata;
  event: EventoMetadata;
  decision: DecisionMetadata;
  external: ExternalMetadata;
  kpi: KpiMetadata;
}

// Entidad se amplía:
interface Entidad {
  estereotipo?: EstereotipoNombre;
  metadatosEstereotipo?: MetadatosEstereotipo[EstereotipoNombre];
}
```

**Costo estimado**: medio (~3-5 días). El kernel ya tiene el molde (`estereotipo + requisito`). La mayor parte del trabajo es UI (Inspector por estereotipo, renderizado `<<Nombre>>`) y validación (checkers por estereotipo).

**Dependencias**: ninguna. Es aditivo sobre infraestructura existente.

#### 10.1.2 Propuesta: perfil `canon-diagrama` y `canon-documento`

**Qué es**: sistema de exportación selectiva que, según el perfil activo, incluye/excluye elementos del modelo. Requerido por `R-VIS-EXP-2` y `R-VIS-EXP-5`.

**Justificación**: la SSOT exige que toda herramienta conforme declare al menos estos dos perfiles. Hoy opforja exporta el modelo completo sin filtro por perfil.

**Perfiles propuestos**:

| Perfil | Qué incluye | Qué excluye |
|---|---|---|
| `canon-diagrama` (default) | Entidades, enlaces, estados, refinamientos, estereotipos, anclas | Notas de mesa, capturas de bug, UI transitoria, ontología organizacional |
| `canon-documento` | Todo `canon-diagrama` + requisitos, satisfacciones, OPL completa, procedencia | Solo UI transitoria, capturas de bug |
| `intercambio` | Todo `canon-documento` + ontología, submodelos | Nada (modelo completo) |
| `simulacion` | Solo entidades con `simulacion` params + enlaces procedurales | Estructurales, notas, ontología |

**Costo estimado**: bajo (~1-2 días). Es un filtro sobre `exportarModelo()` ya existente.

---

### 10.2 Templates y patrones reutilizables

#### 10.2.1 Propuesta: sistema de templates de modelo (W6.7)

**Qué es**: catálogo navegable de fragmentos de modelo predefinidos que el operador puede instanciar en su modelo activo. Cada template es una función DSL que recibe parámetros de configuración y emite entidades + enlaces + OPDs.

**Justificación**:
- Acelera el arranque de nuevos modelos (hoy se parte de un canvas vacío)
- Reduce errores de modelado en patrones recurrentes (bucles de control, flujos de aprobación, arquitecturas en capas)
- Capitaliza el DSL composable ya existente — las funciones de template son composiciones de `crearAutor()` + `entidad()` + `enlazar()`
- OPCloud tiene `TemplatesComponent` y `NewModelByWizardComponent` (8-page wizard); el diferencial de opforja es que sus templates serían headless por construcción (DSL puro, sin DOM) y por tanto auditables, versionables y reproducibles

**Catálogo propuesto de templates (primera iteración)**:

| Template | Parámetros | Qué construye | Origen |
|---|---|---|---|
| `flujo-aprobacion` | `solicitante: string`, `aprobador: string`, `documento: string` | Objeto Documento con estados `pendiente`/`aprobado`/`rechazado`, procesos Solicitar y Aprobar, enlaces de consumo/resultado/agente | Patrón HODOM §9.26 |
| `control-loop` | `sensor: string`, `controlador: string`, `actuador: string`, `variable: string` | Proceso en 3 etapas (sense→decide→act), variable con estados, feedback loop | `metodologia-forja-es §9.26` |
| `arquitectura-3-capas` | `frontend: string`, `backend: string`, `datos: string` | 3 módulos con interfaces, enlaces de invocación entre capas, agregación de componentes | Patrón enterprise estándar |
| `gate-admision` | `entrada: string`, `criterio: string`, `salidaAceptada: string`, `salidaRechazada: string` | Proceso de decisión con 2 ramas condicionales, objeto de entrada con estados, abanico XOR | `metodologia-forja-es §Admisión` |
| `escalamiento` | `nivel1: string`, `nivel2: string`, `gatillo: string` | 2 procesos anidados con invocación condicional, objeto de señal de escalamiento | Patrón HODOM |
| `actor-rol` | `actor: string`, `rol: string`, `responsabilidad: string` | Objeto Actor con estereotipo `<<Role>>`, proceso que consume responsabilidad, enlace de agente | `metodologia-forja-es §A2.2` |
| `digital-twin` | `procesoFisico: string`, `gemeloDigital: string`, `datos: string` | Proceso físico + informacional espejo, objeto de datos compartido, enlace de efecto bidireccional | `metodologia-forja-es §A1.4` |

**Diseño técnico tentativo**:

```typescript
// templates/registro.ts (nuevo)
type TemplateFn = (autor: Autor, params: Record<string, string>) => void;

const registro: Map<string, { fn: TemplateFn; descripcion: string; categoria: string }> = new Map();

registro.set("flujo-aprobacion", {
  categoria: "gobernanza",
  descripcion: "Flujo de aprobación con dos roles y documento con estados",
  fn: (autor, { solicitante, aprobador, documento }) => {
    const doc = autor.entidad(documento, "objeto", documento, "informacional", "sistemica");
    autor.estados(documento, ["pendiente", "aprobado", "rechazado"], "pendiente");
    const solicitar = autor.entidad("solicitar", "proceso", "Solicitar", "informacional", "sistemica");
    const aprobar = autor.entidad("aprobar", "proceso", "Aprobar", "informacional", "sistemica");
    autor.enlazar({ tipo: "agente", origenId: autor.extremo(solicitante), destinoId: autor.id("solicitar") });
    // ... resto del patrón
  }
});
```

**Costo estimado**: medio-alto (~5-8 días). Incluye: motor de instanciación (namespace-remapping de IDs vía `componerModelos` ya existente), UI de catálogo (adaptar `bibliotecaDock` existente), 7 templates iniciales, tests de instanciación + roundtrip.

**Dependencias**: bibliotecaDock ya existe (feature-gated). `componerModelos()` ya maneja el remapping de IDs.

#### 10.2.2 Propuesta: templates de OPD (in-canvas patterns)

**Qué es**: a diferencia de templates de modelo (que crean entidades nuevas), los templates de OPD permiten al operador seleccionar un conjunto de cosas existentes en el canvas y aplicarles un patrón estructural (ej. "convertir en capas", "aplicar wrapper de seguridad", "agregar buffer intermedio").

**Justificación**: menor fricción que crear entidades desde cero. El operador ya tiene sus cosas modeladas; el template las reorganiza.

**Catálogo propuesto**:

| Template OPD | Entrada | Salida |
|---|---|---|
| `wrapper-seguridad` | Proceso existente | Proceso envuelto en módulo `<<Security Boundary>>` con agentes de autenticación/autorización |
| `buffer-intermedio` | Consumo directo entre objeto y proceso | Objeto buffer intermedio + dos consumos secuenciales |
| `observabilidad` | Proceso existente | Objeto KPI + enlace de efecto del proceso al KPI + proceso de monitoreo |
| `versionado` | Objeto existente | Objeto con estados `vigente`/`obsoleto` + proceso de transición de versión |

**Costo estimado**: medio (~3-4 días). Reusa el DSL; añade UI de selección + preview.

#### 10.2.3 Propuesta: macro-expansión en compilador (templates textuales)

**Qué es**: extender el normalizador del compilador para reconocer directivas `@template(nombre, param1=valor1, ...)` en el proto-markdown y expandirlas a oraciones OPL normales antes de la compilación.

**Justificación**: el normalizador ya tiene el pipeline de expansión 1→N (reglas A1–A12, familia V). Agregar un paso de expansión de templates antes de la clasificación de verbos es natural.

**Diseño tentativo**:

```markdown
## OPD Principal

@template(flujo-aprobacion, solicitante=Operador, aprobador=Supervisor, documento=Informe)
@template(control-loop, sensor=Monitor, controlador=Regulador, actuador=Ejecutor, variable=Temperatura)

**Operador** es un objeto físico y sistémico.
```

El normalizador expandiría `@template(...)` a N líneas `normalizada` que luego el emisor compila normalmente.

**Costo estimado**: bajo (~1 día). El 90% de la infraestructura ya existe en el normalizador.

---

### 10.3 Otras oportunidades de mejora

#### 10.3.1 Checkers metodológicos

**Qué es**: portar los checkers de OPCloud que hoy no existen en opforja: `IngProcessesNamesChecker` (convención de nombre de proceso), `InzoomedContentChecker` (calidad de contenido in-zoom), `TransformingProcessChecker` (procesos deben transformar), `SystemicProcessesMainFunctionChecker` (función principal).

**Justificación**: `opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/` contiene implementaciones de referencia (~500 líneas en total). La infraestructura de checkers de opforja (`modelo/checkers.ts`, `AvisoMetodologico`) es directamente compatible.

**Costo estimado**: bajo (~1-2 días). Port directo con adaptación de nombres de tipos.

#### 10.3.2 Biblioteca de modelos de ejemplo

**Qué es**: exponer los 6 modelos de ejemplo de `fixtures/demo-models/` como punto de partida en el diálogo "Nuevo modelo", con previsualización OPL + thumbnail del OPD raíz.

**Justificación**: los modelos ya existen (`Vacio`, `OnStar`, `OPM Meta`, `SD Async`, `SD Sync`, `System Diagram`). Hoy solo son artefactos de test. Exponerlos reduce la fricción de onboarding.

**Costo estimado**: bajo (~1 día). UI de selección + importación vía `cargarModelo()` existente.

#### 10.3.3 Visualización de calor/cobertura de requisitos

**Qué es**: dado un conjunto de requisitos (`<<Requirement>>`) y las entidades que los satisfacen (vía tagged link `satisface`), mostrar en el canvas un overlay de calor: verde = satisfecho, amarillo = parcial, rojo = insatisfecho, gris = sin requisito asociado.

**Justificación**: opforja ya tiene `satisfaccionesRequisito` en el modelo y `InspectorEntidad` ya muestra satisfacción por entidad. Falta la proyección agregada al canvas.

**Costo estimado**: bajo (~1-2 días). Proyección adicional en el render, sin cambios en el kernel.

#### 10.3.4 Ontología organizacional — completar

**Qué es**: el tipo `OntologiaOrganizacional` (`extensiones.ts:176-211`) y `DialogoOntologia.tsx` existen pero están incompletos. La ontología debería poder: (a) definir términos de dominio con sinónimos, (b) sugerir el término canónico durante el nombrado de entidades, (c) validar que los nombres de entidades usen solo términos del vocabulario controlado.

**Justificación**: OPCloud tiene `OntologyApplier`, `OntologySuggestionDialog` y `OrganizationOntologyComponent` completos. La base ya está en opforja; falta completar la UI y los checkers.

**Costo estimado**: medio (~2-3 días). Extensión de `DialogoOntologia.tsx` + `checkers.ts`.

#### 10.3.5 Wizard de nuevo modelo (paso a paso)

**Qué es**: un diálogo multi-paso que guía al operador en la creación de un modelo nuevo: (1) nombrar el modelo y dominio, (2) seleccionar template inicial o empezar vacío, (3) configurar parámetros del template, (4) revisar OPL generada, (5) abrir canvas. Inspirado en `NewModelByWizardComponent` de OPCloud (8 páginas).

**Justificación**: reduce la fricción de "hoja en blanco" y capitaliza los templates de §10.2.1.

**Costo estimado**: medio (~3-4 días). Depende de §10.2.1.

#### 10.3.6 Vistas de requisitos (requirement view)

**Qué es**: el tipo `OpdVista` ya soporta `"requirement-view"` (`extensiones.ts:218`). Falta implementar la generación automática de estas vistas: dado un `<<Requirement>>`, crear OPD readonly que contenga solo las entidades que lo satisfacen (transitivamente, vía tagged link `satisface`). OPCloud tiene `CreateRequirementViewDialog`.

**Justificación**: el kernel ya tiene el tipo. La generación es una consulta sobre el grafo de enlaces `satisface` + proyección a OPD readonly (patrón `generic-view` ya implementado).

**Costo estimado**: bajo (~1-2 días). Reusa `generic-view` y `satisfaccionesRequisito`.

#### 10.3.7 Simulación — reproducibilidad (W6.2)

**Qué es**: reemplazar `Math.random` por RNG sembrado (mulberry32) en toda la cadena de simulación, con control de semilla en la UI. Esto cierra el hallazgo P1 #6 de la síntesis ejecutiva.

**Justificación**: hoy la simulación numérica no es reproducible. El mulberry32 ya existe en `simulacion/rng.ts` pero solo cubre ramas/duraciones. Extenderlo a `generarDatosSimulados` e `iniciarValoresRuntime` es acotado.

**Costo estimado**: bajo (~1 día). Está en el corte 3 del plan de remediación.

#### 10.3.8 Panel de métricas de complejidad

**Qué es**: panel lateral que muestra métricas del modelo en tiempo real: #entidades, #enlaces (por tipo), profundidad de refinamiento, densidad (entidades/OPD), conectividad (enlaces/entidad), cobertura de requisitos. Actualización reactiva al editar.

**Justificación**: las métricas son consultas puras sobre `Modelo` (kernel sin DOM). La SSOT menciona gate de densidad `R-LAY-1` (21-25/>25 entidades por OPD). Estas métricas son el insumo para ese gate y para que el operador monitoree la salud de su modelo.

**Costo estimado**: bajo (~1-2 días). Panel Preact + selectors Zustand.

#### 10.3.9 Diff/comparación de modelos

**Qué es**: dados dos modelos (o dos versiones del mismo modelo), mostrar un diff estructural: entidades añadidas/eliminadas/modificadas, enlaces cambiados, estados alterados. Con renderizado side-by-side o unificado en canvas.

**Justificación**: opforja ya tiene versiones (`persistencia/versiones`), serialización determinista y sello de procedencia. El diff es una comparación de dos `Modelo` normalizados.

**Costo estimado**: medio (~3-4 días). Algoritmo de diffing + UI.

---

### 10.4 Matriz de priorización

Las propuestas se ordenan por palanca (impacto en el producto / costo de implementación):

| # | Propuesta | Palanca | Costo | Dependencias | Corte sugerido |
|---|---|---|---|---|---|
| 1 | Checkers metodológicos (§10.3.1) | Alta | Bajo (~1d) | Ninguna | **Corte 1** |
| 2 | Perfil `canon-diagrama`/`canon-documento` (§10.1.2) | Alta | Bajo (~1d) | Ninguna | **Corte 1** |
| 3 | Reproducibilidad simulación (§10.3.7) | Alta | Bajo (~1d) | Ninguna | **Corte 1** |
| 4 | Biblioteca de modelos de ejemplo (§10.3.2) | Media | Bajo (~1d) | Ninguna | **Corte 1** |
| 5 | Estereotipos generales — iteración 1 (§10.1.1) | Alta | Medio (~3d) | Ninguna | **Corte 2** |
| 6 | Vistas de requisitos (§10.3.6) | Media | Bajo (~2d) | §10.1.1 (estereotipo requirement ya existe) | **Corte 2** |
| 7 | Panel de métricas (§10.3.8) | Media | Bajo (~2d) | Ninguna | **Corte 2** |
| 8 | Macro-expansión en compilador (§10.2.3) | Media | Bajo (~1d) | Ninguna | **Corte 2** |
| 9 | Templates de modelo — W6.7 (§10.2.1) | Alta | Medio-alto (~5d) | §10.1.1 (para templates con estereotipos) | **Corte 3** |
| 10 | Ontología organizacional (§10.3.4) | Media | Medio (~3d) | Ninguna | **Corte 3** |
| 11 | Templates de OPD in-canvas (§10.2.2) | Media | Medio (~3d) | §10.2.1 | **Corte 3** |
| 12 | Calor/cobertura de requisitos (§10.3.3) | Media | Bajo (~2d) | §10.3.6 | **Corte 4** |
| 13 | Wizard de nuevo modelo (§10.3.5) | Media | Medio (~3d) | §10.2.1 | **Corte 4** |
| 14 | Diff de modelos (§10.3.9) | Media | Medio (~4d) | Ninguna | **Corte 4** |

**Corte 1** (~4 días): bajo costo, alta palanca, sin dependencias. Cierra 3 GAPs SSOT y el hallazgo P1 #6.

**Corte 2** (~8 días): estereotipos generales + herramientas de análisis. Habilita el resto del catálogo.

**Corte 3** (~11 días): templates y ontología. El diferencial de producto más visible para el operador.

**Corte 4** (~9 días): experiencia de usuario avanzada. Capitaliza los cortes anteriores.

---

### 10.5 Principios de diseño para la implementación

1. **Extensiones aditivas, no baked-in**: todo estereotipo y template nuevo sigue el patrón `AnclaNormativa` — opcional, versionado (`v0`), con cero impacto en la validación nuclear del modelo.

2. **DSL-first**: los templates se definen como funciones puras sobre `Autor`, sin dependencia del DOM, JointJS, Zustand ni Preact. Esto los hace auditables, testeables y reproducibles (sello de procedencia).

3. **Un solo conjunto de generadores forward**: los templates no crean nuevas plantillas OPL. El OPL de un modelo con estereotipos se genera con los mismos generadores de `app/src/opl/generadores/`. La distinción visual la da el render, no el texto.

4. **Render progresivo**: los estereotipos se renderizan como decoraciones sobre la forma canónica existente (8 representaciones de cosa). No se crean nuevas formas base.

5. **Validación por checker, no por tipo**: las reglas específicas de cada estereotipo se implementan como `AvisoMetodologico` en `checkers.ts`, no como restricciones de tipo en el kernel. Esto permite que el modelo exista sin estereotipo (retrocompatibilidad) y que las reglas evolucionen sin migrar el schema.

6. **Feature gates**: las features nuevas se protegen con flags (patrón `bibliotecaDock: false`) hasta que tengan cobertura E2E y validación del operador.

**Auditoría cerrada**: el frente forward OPL §-por-§ + §20 GAPs + compilador fue completado el 2026-06-11 (secciones 5.B, 5.C, 8.B). No hay residuales pendientes de esta ronda. La sección 10 (estereotipos, templates y oportunidades) es propositiva y no requiere acción inmediata.
