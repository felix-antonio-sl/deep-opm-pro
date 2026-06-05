# Backlog contingencial — flujo canónico dominio→OpForja

**Fecha:** 2026-06-04
**Estado:** corte operativo VIGENTE por decisión del operador (HITL-3 de la adenda del acta).
**Fuente de autoridad:** `docs/auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` (consenso Besto/Resto + adenda HITL).
**Qué congela:** `cortes-operativos.md` (2026-05-07) y la priorización HU v2 quedan congelados operativamente — no eliminados, no autoritativos para planificar rondas mientras este documento viva. El concern del quality-gate baseline (93f184f) queda aparcado con nota, no resuelto.
**Documento vivo:** se reescribe, no se acumula (política de handoff único aplicada a roadmap).

## ⚡ Estado de ejecución (mandato autónomo 2026-06-04, mismo día)

Bajo el mandato del operador («terminar todo de forma completamente autónoma y hasta el final») se ejecutó:

| WS | Estado | Evidencia |
|---|---|---|
| **W1 completo** | ✅ CERRADO | gramática v0.1 falsada (93.4% hechos, L1 verde 100%) · normalizador TDD 42 tests · inventario 46 clases · AnclaNormativa adjudicada §10 — `docs/proto-modelo/` |
| **W2 completo** | ✅ CERRADO | W2.1 `protocolo-re-pin.md` · W2.2 hecha por el operador en paralelo (fixes V16, commit 51b58ed) · W2.3 conteo reconciliado **262/192/433/37** + regeneración byte-idéntica verificada |
| **W3 completo** | ✅ CERRADO | DSL valida firma vía kernel (vía b; residuo entidades documentado en dsl.ts) · constantes in-zoom unificadas (`canvas/constantesInzoom.ts`; hallazgo: la "triplicación" era doble) · ley L7 falsificable por ROL declarado — gate byte-identidad verde en cada paso |
| **W4.1 completo** | ✅ CERRADO | 6 primitivas tanda 1 (abanico/multiplicidadOrigen/demora/autoinvocación/no/designaciones), 23 tests con round-trip OPL |
| **W4.2 completo** | ✅ CERRADO | compilador 4 etapas (`compilar/{estructura,resolutor,emisor,compilador}.ts`) + **piloto sobre el proto v1.9 ENTERO**: 11 OPDs/250 ent/284 enl, validación PASS, L2 coherente, roundtrip 92.3%, 17 tensiones documentadas — `piloto-compilador-2026-06-04.md` |
| **W4.3** | ⏳ PENDIENTE | migración real de `generar-bundle-hodom.ts` OPD-por-OPD (el piloto probó el compilador; la migración resuelve además las 17 tensiones + 30 rechazos T3 CON el operador — son decisiones de modelado) |
| **W5.1 completo** | ✅ CERRADO | `AnclaNormativa` aditiva en el formato + DSL `ancla()` + L8 round-trip nivel-enlace + L9 preparatorio — 12 tests |
| **W5.2 completo** | ✅ CERRADO | anclas inline del proto compiladas a `AnclaNormativa` (5 formas, claveProto determinista, ledger L8) — `4b6e3d9` |
| **W5.3 completo** | ✅ CERRADO (2026-06-05) | `SelloProcedencia` aditivo en el formato + `autoria/procedencia.ts` (hash FNV-1a puro, `construirSello`, `compararProcedencia`) + `OpcionesBundle.procedencia` + ley **L6** con fixture negativo (`src/leyes/procedencia-staleness.test.ts`) + piloto HODOM §5c (sello en bundle, sin divergencia) — suite 2212/0, byte-identidad hd-opm verde (el generador no pasa procedencia) |
| **Segundo dominio** | ✅ CICLO COMPLETO + P3 RATIFICADO (2026-06-05) | falsación → 5 hallazgos → **adjudicación dov-dori** (`docs/proto-modelo/adjudicacion-dov-dori-2026-06-05.md`) → **remediación TDD el mismo día** (28 tests): guard R9 anti-silencio + `detectarDuplicadosPorAbsorcion` (P0); detector de citas por LOCALIZADOR, no enum de cuerpos (P1); R8 plural-rechaza-con-sugerencia + **V17** acotado-por bifurcado (destraba ex-en-reflexión #2) + **V16** notifica→genera+dirigido-a (P2). Post-fix: segundo dominio **96.5%** (2 R8 correctos, 3/3 anclas, 0 duplicados) · HODOM **99.1%** (rechazos 5→4). **P3 ratificado por Felix:** léxico abierto y estándar normativo pasan a `modelamiento-opm` E2 (`normalizar-proto`, v1.5.2); el compilador queda como verificador total y emisor reproducible. Siguiente paso: contrato de migración gradual familia-V→skill sin romper HODOM ni byte-identidad |
| **Migración familia-V→skill F0** | ✅ CONTRATO PUBLICADO (2026-06-05) | `docs/proto-modelo/contrato-migracion-familia-v-skill.md`: `mapearFamiliaV()` queda como adaptador legacy congelado; no se agregan nuevos verbos V salvo bugfix con prueba negativa; fases F1-F5 definen ledger `V1`..`V17`, fixtures de equivalencia, auditoría `usoFamiliaV`, pilotos con `usoFamiliaV == 0` y cambio de default solo con HODOM/segundo dominio equivalentes + byte-identidad/re-pin |
| **Migración familia-V→skill F1** | ✅ LEDGER PUBLICADO (2026-06-05) | `docs/proto-modelo/ledger-familia-v-skill.md`: inventario `V1`..`V17` con superficie legacy, salida E2 esperada, fixture positivo/negativo, criterio de retiro, guardas anti-complacencia y lectura de preservación (`urn:fxsl:kb:icas-preservacion`). Siguiente paso: F2 fixtures ejecutables laxo→E2 |
| **W6** | ⏳ PENDIENTE | superficie UX (W6.0 puente primero); W6.1 tiene gate de release HITL (re-protección) |

Suite final histórica del mandato W1-W5.1: **2117/0** · byte-identidad hd-opm intacta en TODAS las ondas · commits 8ddb772→3c6140f en deep-opm-pro + 2376ea8 en hd-opm (sin push). Cierres posteriores: W5.3 **2212/0**; segundo dominio/adjudicación **2254/0**.

**Nota normativa 2026-06-05:** `metodologia-forja-opm-es` v1.5.0 añade `LF-19` y endurece `A8` para auditorías. Todo barrido futuro de integridad de estados en W4/W5/W6 debe operar sobre JSON canónico hidratado/exportado, no sobre OPL; la métrica debe distinguir estados de flujo, caracterización y ambiental-observado antes de concluir deuda o error. Esta nota evita reabrir falsos positivos de "estado sin escritor" en dominios donde el estado es value-set caracterizador o lectura ambiental.

## Decisiones rectoras (resueltas, no reabrir sin acta)

| ID | Decisión | Consecuencia operativa |
|---|---|---|
| HITL-1 | Sub-dialecto del proto-modelo **bastante libre** | Gramática amplia; normalizador + extracción LLM asistida cargan el peso; rechaza-con-diagnóstico es la frontera |
| HITL-2 | Protocolo de **re-pin aprobado** | Byte-identidad por defecto; cambio deliberado → checks + validación visual de Felix + bump + commit |
| HITL-3 | **Backlog contingencial** | Este documento es el corte; lo previo congelado |
| UX-EXTERNA | Asistencia AI y wizard **FUERA de la app** (ratificación del operador, 2026-06-04) | Se MANTIENE la decisión de cortes-operativos 2026-05-07 (EPICA-34→delta; skill externa). E0-E2 corren vía `modelamiento-opm` en Claude Code sobre el repo de dominio; la app participa desde E5 (importación) en adelante. **Sin proxy LLM en alcance** — anula el pivot tentativo registrado más temprano el mismo día |
| EQUILIBRIO | **El LLM genera afuera; la app VE y GESTIONA los artefactos adentro** (refinamiento del operador, 2026-06-04) | Los artefactos de la skill (glosario, reporte de compilación, anclas, registro [RATIFICAR], procedencia) viajan CON el bundle como **paquete de dominio** y tienen superficie de visualización/gestión en OpForja. La gestión in-app (p.ej. ratificar una decisión) se EXPORTA como log para la siguiente ronda de la skill — **ciclo de re-elicitación** cerrado sin LLM in-app |
| LLM-POR-JUICIO | **Distribución del LLM RATIFICADA por la mesa (delib. 2, acta equilibrio): por naturaleza del juicio, no por superficie** | Juicio dialéctico (E1/E2) y crítica conceptual (E6) = **skill** (método anti-barro + corpus KORA con citas); gates y compilación = **determinista**; la "IA" de la app = **su capa de lenguaje determinista** (OPL bisimétrico + diagnóstico + glosario "sugerir"). **Gatillos falsables de revisión**: g1 backend seguro + RAG corpus-anclado con citas; g2 usuarios no-expertos (T1); g3 contador de cruces del puente W6.0 sobre umbral. Micro-asistencias LLM en mesa: pospuestas por costo/gatillo (no por método); explorar antes versión determinista local (precedente OpCloud) |
| P3-NORMALIZAR-PROTO | **Frontera skill/compilador RATIFICADA por Felix (2026-06-05)** | Léxico abierto de dominio y estándar normativo viven en `modelamiento-opm` E2 (`normalizar-proto`, v1.5.2): la skill identifica citas por forma/localizador, estandariza referencias en el proto y propone mapeos; el humano confirma. El compilador no aprende léxico abierto ni normaliza juicio normativo: verifica OPL-ES cerrado, rechaza con diagnóstico y emite bundle reproducible. Contrato F0 de retiro gradual de familia-V: `docs/proto-modelo/contrato-migracion-familia-v-skill.md` |

## Workstreams

### W1 — Fundación del flujo (= F0 del acta) · PRIMERO: todo lo demás depende de su falsación

| Item | Contenido | Gate |
|---|---|---|
| W1.1 | **Gramática amplia del sub-dialecto** (HITL-1): variantes de superficie por tipo de hecho del catálogo OPL 23/23; anclas inline naturales `(DS art. N)`; spec + fixtures positivos y negativos | spec publicada en deep-opm-pro |
| W1.2 | **Normalizador prototipo** (función pura TS): sub-dialecto → OPL-ES estricto; rechaza-con-diagnóstico | fixtures ± verdes |
| W1.3 | **Falsación sobre corpus real**: correr W1.2 sobre los 52 bloques `opl` de `hd-opm/docs/modelo-opm-hodom-completo.md`; medir cobertura | cobertura suficiente o rediseño (vuelve al operador) |
| W1.4 | **Inventario de primitivas DSL** vs catálogo OPL (abanicos XOR/OR ya identificado como faltante) | inventario publicado; alcance de L2 fijado |
| W1.5 | **Diseño de `AnclaNormativa`** sobre el molde `SatisfaccionRequisito{target}` (`extensiones.ts:32`); cardinalidad entidad/enlace/OPD/modelo; semántica de edición; disciplina OPL-meta (R-BR-4/R-DOC-7) | diseño aprobado por el operador |

### W2 — Contrato hd-opm (= F1 + primer re-pin) · puede correr en paralelo a W1

| Item | Contenido | Gate |
|---|---|---|
| W2.1 | Documentar el **protocolo de re-pin** (ya aprobado HITL-2): checks deterministas + validación visual + bump + commit con acta | documento corto en `docs/roadmap/` |
| W2.2 | **Validación visual del bundle v1.6 en opforja** (hito pendiente de hd-opm: layout R26 + 3 OPDs nuevos R24-C). Sirve de PRIMER ejercicio del pin: Felix bendice la referencia vigente | **acción de Felix** |
| W2.3 | Reconciliar comentarios de conteo del generador hd-opm con el golden vivo (**262/192/433/36** por conteo directo; `generar-bundle-hodom.ts:9` y `:49` discrepan) | comentarios corregidos en hd-opm |

### W3 — Unificación interna (= F2+F3) · tras W1; gates de byte-identidad

| Item | Contenido | Gate |
|---|---|---|
| W3.1 | **Layout único**: núcleo puro en `src/canvas/` + adapters batch/interactivo + tabla INZOOM única (mata triplicación `descomposicion.ts:38`/`layoutSugerido.ts:63`/`autoria/layout.ts:10`); el núcleo absorbe externos-por-ROL de autoría | L4 + byte-identidad (algoritmo preservado) o re-pin |
| W3.2 | **DSL sobre operaciones del kernel** (`Resultado<Modelo>`), conservando esquema de ids | byte-identidad |
| W3.3 | **L7**: contención de refinamiento como ley nombrada en `src/leyes/` (desde `verificarContencion`) | fixture negativo falla como debe |

### W4 — Compilador proto→Modelo (= F4) · tras W1 y W3

| Item | Contenido | Gate |
|---|---|---|
| W4.1 | Primitivas faltantes al DSL (abanicos vía `formarAbanico` del kernel; resto según W1.4) | inventario cerrado |
| W4.2 | **`autoria/compilar/`**: normalizador (W1.2 endurecido) + lector de estructura markdown→plan de OPDs/refinamientos + parseo de oraciones (reuso de `parsear.ts`) + resolutor incremental por-OPD (net-new) + emisor | L1 + L2 verdes |
| W4.3 | Migración de `generar-bundle-hodom.ts` (1257 llamadas DSL) a proto compilado, **OPD por OPD** | L1+L2+L3 por OPD migrado |
| W4.4 | **Migración familia-V→skill** (P3): retirar gradualmente `V1`..`V17` del camino normal del compilador hacia `modelamiento-opm` E2. F0 contrato publicado; F1 ledger publicado; F2 fixtures laxo→E2; F3 auditoría `usoFamiliaV`; F4 pilotos con `usoFamiliaV == 0`; F5 default estricto | F2 fixtures HODOM/segundo dominio + byte-identidad; no cambiar default antes de F4 |

### W5 — Trazabilidad y procedencia (= F5) · tras W4 (puede adelantarse W5.1 tras W1.5)

| Item | Contenido | Gate |
|---|---|---|
| W5.1 | `AnclaNormativa` en el formato (kernel/tipos + serialización; extensión aditiva — bundles existentes intactos) | round-trip de un ancla nivel-ENLACE real de hd-opm («frontera clínico↔programa, excl. art. 17») |
| W5.2 | Compilación de anclas + checker **L8** + registro `[RATIFICAR]` consultable | fixture negativo L8 |
| W5.3 | Procedencia `{protoHash, glosarioHash, autoriaVersion, layoutVersion}` + staleness (**L6**) | fixture negativo L6 |

### W6 — Superficie de gestión del flujo en la app (decisión EQUILIBRIO: sin wizard, sin LLM; la app ve y gestiona lo que la skill genera)

| Item | Contenido | Dependencia |
|---|---|---|
| W6.0 | **Puente de contexto bidireccional 1-click** (mesa equilibrio, delib. 2): export del contexto de modelado del modelo activo (diagnóstico JSON + OPL MD + estado glosario + pendientes — mínimo necesario) para pegar en la sesión de la skill; formaliza los exportadores Cmd+K existentes; **contador automático de cruces** (observable de g3); hereda gate C3 | independiente; primera pieza recomendada de W6 |
| W6.1 | **Paquete de dominio** — formato de TRANSPORTE declarado `deep-opm-pro.paquete.v0` [C5]: versionado, validado al abrir, **emitido únicamente por el compilador** con hash único (sellado en emisión [C2]); el `modelo.v0` interior viaja intacto (no rivaliza con el pivote). Contiene bundle + glosario + reporte + registro [RATIFICAR]/anclas + procedencia. **GATE DE RELEASE [C3]: no desplegar paquetes a la instancia pública sin re-protección (o uso local-only) — decisión HITL de Felix** | tras W1; NO requiere W4 |
| W6.2 | **Panel de glosario** (read-only; inspirado en Ontología organizacional OpCloud, `meta-opforja.md:538`): términos ↔ cosas (L5 visible), divergencia al nombrar en modo **máx "sugerir"** [C4], **integrando** el mecanismo de colisión de nombres existente (no un segundo diálogo) | tras W6.1 |
| W6.3 | **Patrón de vista derivada read-only** (inspirado en Requirement views, `meta-opforja.md:589`): OPD-vista no editable que se actualiza con el modelo. Resuelve además el pendiente «vía-OPD-interfaz» de hd-opm | independiente |
| W6.4 | **Anclas normativas en el Inspector + vistas** sobre W6.3 | tras W5.1 |
| W6.5 | **Registro [RATIFICAR] tipificado** [C1]: `{clave estable nacida en el proto; nivel de autoridad: operador-modelado \| mesa \| DT/SEREMI/legal; estado: pendiente → anotado-en-mesa → ratificado-con-fuente; fuente/acta; responsable; edad}`. **La app registra, no decide**: la marca in-app = "anotado-en-mesa" (persistida); "ratificado" exige fuente; el modelo/proto solo cambian vía re-elicitación. Export del log con **schema versionado** y consumidor comprometido: estado `re-elicitar` de `modelamiento-opm` (cambio en KORA → custodio-kora) [C2] | tras W5.2 |
| W6.6 | **Panel de procedencia/staleness**: de qué proto+glosario+versión viene el modelo; si divergió; export del reporte de divergencia | tras W5.3 |
| W6.7 | Templates in-app (OpCloud `meta-opforja.md:503`) | candidato |

**Leyes añadidas por la mesa EQUILIBRIO** (acta `2026-06-04-acta-mesa-equilibrio-encarnacion.md`): **L9 convergencia del ciclo de re-elicitación** (un pendiente ratificado y re-elicitado no reaparece pendiente; falsable con fixture). W1.5 gana: **claves estables de pendientes/anclas nacidas en el proto** + diseño del schema del log de decisiones.

**Ciclo de re-elicitación** (el equilibrio operando): skill genera (E0-E2) → compila (E4) → **paquete de dominio** → la app lo abre: modelo en canvas + glosario en panel + pendientes en registro (E5-E6) → el operador gestiona (ratifica, edita, anota) → la app **exporta** log de decisiones + divergencias → la skill re-elicita y recompila. El LLM nunca entra a la app; los artefactos nunca se quedan afuera.

Los gates de importación E5 enriquecidos se entregan con W4/W5 (parte del compilador/leyes, no item UX aparte).

## Orden propuesto

```
W1 (falsación)  ────────────►  W3  ───►  W4  ───►  W5  ───►  W6.4/W6.5/W6.6
W2 (∥, W2.2 es de Felix)              W6.1 ──► W6.2 (tras W1, intercalable)
W6.3 independiente · W6.7 candidato
```

## Restricciones y aparcados (visibles, no silenciados)

- **Techo localStorage** (~5-10MB; v1.6 = 654KB): no bloquea el flujo; acota la mesa como repositorio multi-dominio. Se resuelve cuando se retome el backend (track propio, pausado).
- **Quality-gate baseline** (93f184f, alphaProgress 86.2→63): aparcado con el backlog previo; investigar al descongelar HU v2.
- **Exclusiones vigentes de L2** (registro público): abanicos (hasta W4.1) y clase-ancla (hasta W5.1).
- El backlog previo (HU v2 + cortes-operativos) se **re-reconcilia** cuando este corte entregue W1-W4 o cuando el operador lo pida — lo que ocurra primero.
