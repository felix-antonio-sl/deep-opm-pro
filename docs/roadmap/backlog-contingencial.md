# Backlog contingencial — flujo canónico dominio→OpForja

**Fecha:** 2026-06-04
**Estado:** corte operativo VIGENTE por decisión del operador (HITL-3 de la adenda del acta).
**Fuente de autoridad:** `docs/auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` (consenso Besto/Resto + adenda HITL).
**Qué congela:** `cortes-operativos.md` (2026-05-07) y la priorización HU v2 quedan congelados operativamente — no eliminados, no autoritativos para planificar rondas mientras este documento viva. El concern del quality-gate baseline (93f184f) queda aparcado con nota, no resuelto.
**Documento vivo:** se reescribe, no se acumula (política de handoff único aplicada a roadmap).

## Decisiones rectoras (resueltas, no reabrir sin acta)

| ID | Decisión | Consecuencia operativa |
|---|---|---|
| HITL-1 | Sub-dialecto del proto-modelo **bastante libre** | Gramática amplia; normalizador + extracción LLM asistida cargan el peso; rechaza-con-diagnóstico es la frontera |
| HITL-2 | Protocolo de **re-pin aprobado** | Byte-identidad por defecto; cambio deliberado → checks + validación visual de Felix + bump + commit |
| HITL-3 | **Backlog contingencial** | Este documento es el corte; lo previo congelado |
| UX-EXTERNA | Asistencia AI y wizard **FUERA de la app** (ratificación del operador, 2026-06-04) | Se MANTIENE la decisión de cortes-operativos 2026-05-07 (EPICA-34→delta; skill externa). E0-E2 corren vía `modelamiento-opm` en Claude Code sobre el repo de dominio; la app participa desde E5 (importación) en adelante. **Sin proxy LLM en alcance** — anula el pivot tentativo registrado más temprano el mismo día |
| EQUILIBRIO | **El LLM genera afuera; la app VE y GESTIONA los artefactos adentro** (refinamiento del operador, 2026-06-04) | Los artefactos de la skill (glosario, reporte de compilación, anclas, registro [RATIFICAR], procedencia) viajan CON el bundle como **paquete de dominio** y tienen superficie de visualización/gestión en OpForja. La gestión in-app (p.ej. ratificar una decisión) se EXPORTA como log para la siguiente ronda de la skill — **ciclo de re-elicitación** cerrado sin LLM in-app |

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

### W5 — Trazabilidad y procedencia (= F5) · tras W4 (puede adelantarse W5.1 tras W1.5)

| Item | Contenido | Gate |
|---|---|---|
| W5.1 | `AnclaNormativa` en el formato (kernel/tipos + serialización; extensión aditiva — bundles existentes intactos) | round-trip de un ancla nivel-ENLACE real de hd-opm («frontera clínico↔programa, excl. art. 17») |
| W5.2 | Compilación de anclas + checker **L8** + registro `[RATIFICAR]` consultable | fixture negativo L8 |
| W5.3 | Procedencia `{protoHash, glosarioHash, autoriaVersion, layoutVersion}` + staleness (**L6**) | fixture negativo L6 |

### W6 — Superficie de gestión del flujo en la app (decisión EQUILIBRIO: sin wizard, sin LLM; la app ve y gestiona lo que la skill genera)

| Item | Contenido | Dependencia |
|---|---|---|
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
