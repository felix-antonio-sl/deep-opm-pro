# Acta — la firma del Centinela y el riesgo de falso-divergente (D-1, D-2)

**Fecha:** 2026-06-26 · **Tipo:** consenso deliberativo (skill `consenso-deliberativo` v1.0.1) · **Modo:** orquestación (3 subagentes reales) · **Iteración 2** del comité de arranque (`2026-06-26-acta-arranque-centinela-drift.md`).
**Panel:** steipete + `mente-omega` · allan-kelly + `mente-omega` · steve-jobs.
**Gatillo:** steipete-implementador elevó dos dudas de criterio tras dejar la Fase 1 verde (`bun run check` 2855/0, re-verificado).
**Resultado:** **CONSENSO** sobre la dirección (los tres convergen en el pecado de origen y el fix de raíz); disenso de *ejecución* resuelto por distinción «dirección vs despliegue».

---

## El diagnóstico común (los tres convergen)

`firmaSnapshotSubmodelo` (`app/src/modelo/submodelos/estado.ts:29`) hashea `entidades/opds/estados/enlaces/abanicos` **crudos**. La normalización (`normalizarModelo`, `app/src/serializacion/validarNormalizacion.ts`) que corre en guardar→cargar reescribe esa representación → `firma(crudo) ≠ firma(hidratado)` y `firma(in-memory) ≠ firma(round-trip)`. La firma responde «¿mismo JSON de runtime?» cuando debería responder «¿misma biblioteca?». Es **`ordenarJson` a medias** (jobs): ya se ordenan las claves para ignorar diferencias de representación; falta canonizar los valores.

## D-1 — RATIFICADO (los tres)
El Centinela compara **dentro de opforja con su misma firma**; no exige identidad de hash cross-repo (acoplar opforja al serializador de gist sería frágil e innecesario). **Pero D-1 no cierra sola:** «mi misma firma» solo es segura si es round-trip-invariante (allan) — se cierra **con el fix de D-2** (mismo pecado, otro eje).
**Mensaje a gist** (canal `gist-opm/docs/derivaciones/`): el `frozenAtHashReferencia` es **procedencia/trazabilidad, no oráculo de sincronía**; el Centinela ancla y compara internamente sobre el shape hidratado. Lo que gist debe garantizar no es un hash, sino **identidad estable de Piezas (ids `ent-<Clase>`)** entre versiones — dependencia ya registrada.

## D-2 — fix de RAÍZ: la firma debe firmar la forma canónica normalizada
**Forma concreta (jobs, respaldada por allan):** `firmaSnapshotSubmodelo` debe firmar `normalizarModelo(modelo)`, no `modelo`. La normalización pasa de «lo que hacemos al guardar» a **la definición operativa de igualdad de bibliotecas** — guardar→cargar queda idempotente respecto de la firma *por construcción*, y robusto a futuros defaults (se aplican en `normalizarModelo`, que la firma incluye).

**Por qué NO el parche local (a):** congelar contra la forma normalizada-de-hoy no protege contra el hash vivo computado en el futuro sobre la forma normalizada-de-mañana (el próximo campo opcional / default de schema mueve el hash vivo de **todas** las bibliotecas a la vez, en silencio). (a) no entrega síntoma-cero permanente: lo **aplaza al peor momento** (gist real en producción), destruyendo la condición de no-muerte cuando es más caro.

**El falso-positivo es riesgo de valor de PRIMER ORDEN** (allan + jobs, categóricos): en un sistema un-aviso-un-curador, el primer grito de lobo reclasifica el Centinela de oráculo a ruido; Félix aprende a ignorar el marcador y el aviso real muere enterrado. Cero falsos positivos **es la definición del producto**, no una meta de calidad.

## Disenso de ejecución, resuelto
steipete advirtió el riesgo que allan+jobs subestimaban: `firmaSnapshotSubmodelo` **ya gobierna** el estado de submodelos (`materializacion.ts:39` produce `sourceHash`, `estado.ts:10-11` lo compara). Cambiar la firma podría reclasificar submodelos persistidos como `cargado-no-sincronizado` en masa → el fix produciría el bug que previene, a escala de prod. **Resolución (no promedio):**
- La **dirección** es (b) fix de raíz, **ahora** (no diferido): ceden steipete su «(b) como corte aparte» ante el argumento del grito-de-lobo-al-peor-momento.
- El **despliegue** lleva la disciplina de steipete+allan: **(i) investigación empírica primero** —«consulta, no refactor»: ¿el `sourceHash`/`revisionHash` se persiste-y-compara, o se re-computa por sesión? eso decide si el fix es seguro-directo o necesita estrategia de migración (`firmaVersion`/re-materializar)—; **(ii) red de no-regresión sobre submodelos** (fixtures reales: misma fuente ⇒ mismo veredicto antes/después); **(iii) ley de quietud** que sella el resultado.
- allan+jobs ceden «(b) sin más» ante el riesgo de migración masiva.

## La ley que falta (los tres la piden) — condición de validez de la Fase 1
La Fase 1 está **verde de aritmética, no de valor** (allan): sus tests de quietud usan el mismo objeto in-memory, nunca cruzan un round-trip. Entregable que falta, **antes de avanzar a la UI**:
- **Ley de quietud:** anclar → guardar/cargar la biblioteca **sin cambio real** → drift = `sincronizado`. Mutante que la rompe: «la firma firma el modelo crudo en vez del normalizado» → rojo.
- **Discriminación preservada:** la quietud no se compra a costa de la divergencia — el mutante «firma constante» debe seguir rompiendo la ley de drift (gredaV1≠gredaV2 → divergente). Las dos forman una pinza.

## Consecuencias de segundo orden (registradas, no de este corte)
- **La firma mezcla apariencia (layout, coords, `modoPlegado`) con semántica** (steipete): un re-layout puro de gist dispararía drift. La versión rica de (b) contemplaría firma **semántica** (excluyendo layout). Nombrado para que el fix no se haga a medias; no se ejecuta ahora.
- **Auditabilidad del aviso** (allan): un «divergente» opaco es indistinguible de un grito de lobo desde la silla del curador; la granularidad pieza/campo (C4, ya anticipada en el kernel) es la dirección, no este corte.

## Confianza por experto (no promediada)
- **steve-jobs: alta.** Diagnóstico del pecado de origen y forma concreta del fix; categórico en que el falso-positivo mata el producto.
- **allan-kelly: alta.** Falso-positivo = riesgo de primer orden; (b) como leverage (un fix, dos subsistemas); condición de reversibilidad dura.
- **steipete: alta, condicionada.** Acepta (b)-ahora **solo con** la investigación empírica + red de no-regresión; sin ellas, su voto se mueve a (a). Esa condición es parte del consenso, no una reserva.

## Metadatos
- Objeción crítica resuelta: 1 (despliegue de (b) sin red de migración rompe submodelos → investigación-primero + no-regresión + ley de quietud).
- Sin disenso irreductible: la dirección fue unánime; el «cuándo/cómo» se cerró por distinción dirección-vs-despliegue.
- Próximo: steipete-implementador ejecuta el sub-corte de quietud. Si la investigación revela migración costosa de submodelos → para y reporta.

---

## Iteración 3 (2026-06-26) — corrección: el fix `normalizarModelo` era insuficiente → **firma semántica**

**Gatillo:** steipete-implementador ejecutó el fix `normalizarModelo` que esta acta bendijo y **paró**: (i) la migración de submodelos temida es **NULA** (verificado: `revisionHash` deriva del mismo `sourceHash`, comparados viejo-contra-viejo; 137/137 verdes con y sin fix); (ii) pero el fix **no cierra la quietud** — la hidratación aplica defaults de *validación* (`modoPlegado`, `validarApariencias.ts:66`) que `normalizarModelo` no replica. El acta había prescrito una cura insuficiente.

**Reconvocado el comité (iteración 3), CONSENSO UNÁNIME: (1) firma semántica.**
- La firma debe hashear **significado** (`entidades` sin su apariencia, `estados`, `enlaces`, `abanicos`, nombres, esencias, tipos, multiplicidad, `estereotipoId`, estructura de refinamiento) y **excluir presentación** (`apariencias`: x/y/w/h, `modoTamano`, `modoPlegado`, `ordenPartes`, `contextoRefinamiento`). Disuelve quietud Y re-layout en un solo corte: ambos defectos venían de firmar presentación. Es «`ordenarJson` terminado»: ignorar no solo el orden de claves, sino todo lo que no es la cosa.
- **(2) firmar la forma de persistencia (round-trip): RECHAZADA** — firma «la representación por otra puerta» (definición equivocada de «lo mismo»), vuelve la firma **falible** (puede lanzar excepción = órgano de certeza con modo-degradado), e **invierte la dependencia `modelo → serialización`** que el repo declara sagrada.
- **(3) mover defaults a `normalizarModelo`: RECHAZADA** — rompe el contrato de **byte-identidad de export** (`validarNormalizacion.ts:71-84`) → re-pin/re-migración masiva de todo lo persistido; trabaja el síntoma, no la causa.

**Las tres leyes falsables en pinza (condición de validez — ninguna sola basta):**
1. **Quietud:** cambiar presentación (coords, `modoPlegado`, round-trip, re-layout) ⇒ `firma` invariante ⇒ `sincronizado`. Mutante: re-incluir `apariencias` → re-layout enrojece.
2. **Sensibilidad (la dual, sella el falso-negativo):** batería de mutaciones SEMÁNTICAS (tipo, nombre, esencia, afiliación, +/- estado, +/- enlace, multiplicidad, refinamiento, `estereotipoId`) — cada una DEBE volver `divergente`. Es la definición operacional, enumerada y auditable, de «qué es la misma Pieza».
3. **Partición:** el dominio de campos se parte en `{significado, presentación}`; un test falla si un campo nuevo no se clasifica (mantiene la frontera honesta en el tiempo).

**Falso-positivo vs falso-negativo (allan):** NO son simétricos. El falso-positivo (def. forma-persistida) es letal por reclasificación e *inevitable*. El falso-negativo de (1) es **frontera de cobertura declarada** — gobernable y honesto si la frontera es visible; letal («perro guardián dormido») solo si excluye significado real. (1) cambia un riesgo fatal-inevitable por uno gobernable-prevenible (Ley 2 lo neutraliza).

**Frontera de autoridad [HITL — no la legisla el comité]:** la clasificación campo-a-campo significado/presentación —en especial los **ambiguos** (`estadosSuprimidos`, `ordenInzoom`, estructura de contención OPD)— es decisión de la **SSOT OPM (custodio-kora / Félix)**, no del comité ni del implementador (legislar semántica OPM reflejamente = anti-patrón [[feedback_no_promover_deslices_a_ssot]]). El implementador **traza un borrador defendido y lo eleva**; Félix ratifica. Geometría pura = presentación es consenso técnico directo; los ambiguos esperan ratificación. **Reconecta con el frente HITL del custodio-kora** (mismo custodio que la condición (a), encargo distinto).

**Cambio de comportamiento en producción (a ratificar):** la firma semántica cambia también el veredicto de **submodelos** — un re-layout de la fuente deja de marcar `cargado-no-sincronizado`. Los tres lo leen como **mejora** (elimina ruido preexistente), pero es cambio de comportamiento en prod → ratificación del operador.

**Confianza iteración 3:** steipete, allan, jobs — **alta los tres** (incluido jobs y steipete corrigiendo sus propias posiciones de iteración 2: «firma la forma normalizada» era «firmar la representación por otra puerta»). Sin disenso.

**Próximo:** ratificación HITL de Félix sobre (i) el cambio de alcance/comportamiento y (ii) la partición de campos ambiguos, antes de que el implementador toque `firmaSnapshotSubmodelo`.

---

## Ratificación HITL del custodio (Félix, 2026-06-27) — partición cerrada

Félix ratificó la firma semántica y clasificó los cuatro campos fronterizos. **Partición definitiva del subset que `firmaSnapshotSubmodelo` debe firmar:**

**FIRMADO (significado):**
- **Entidad:** `tipo, nombre, esencia, afiliacion, refinamientos, alias, unidad, esAtributo, valorSlot, lineal, estereotipoId, anclaje, requisito, orderedFundamentalTypes` + (ratificados) `descripcion, urls, simulacion`.
- **Estado:** `nombre, esInicial, esFinal, designaciones, duracion` + (ratificado) `orden`.
- **Enlace:** `tipo, origenId, destinoId, etiqueta, multiplicidadOrigen, multiplicidadDestino, modificador, subtipoModificador, probabilidad, demora, backwardTag, requisitos, tasa, unidadesTasa, tiempoMaximo, unidadTiempoMaximo, tiempoMinimo, unidadTiempoMinimo, grupoEstructuralId, estadoEntradaId, estadoSalidaId, efectoEscindido, derivado`.
- **Abanico:** estructura semántica completa (XOR/OR + miembros).
- **Opd:** `padreId, ordenInzoom` + (ratificados) `nombre, vista`.
- **Modelo:** `opdRaizId` (estructural). `id`/`nombre` se mantienen (constantes por modelo; no causan falso-positivo).

**EXCLUIDO (presentación):**
- **Entidad:** `imagen, layoutEstados`.
- **Estado:** (ratificado) `suprimido`, + `width, height, x, y`.
- **Enlace:** `rutaEtiqueta, mostrarRequisitos`.
- **Apariencia (entera):** `x, y, width, height, modoTamano, modoPlegado, ordenPartes, parteExtraidaDe, contextoRefinamiento, ports` + (ratificado) `estadosSuprimidos`.
- **AparienciaEnlace (entera):** `vertices, symbolPos, symbolAnchors, labelPositions`.
- **Opd:** `apariencias, enlaces` (AparienciaEnlace), `ordenLocal`.

Nota: la estructura de refinamiento (qué se descompone en qué) se preserva por `Entidad.refinamientos` + `Opd.padreId` + `ordenInzoom`, no por las apariencias — por eso excluir apariencias enteras no pierde la jerarquía semántica. La **Ley de partición** debe fallar si un campo nuevo de cualquier tipo no se clasifica explícitamente.
