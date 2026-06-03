# Frentes de la piedra de Rosetta — preludio para sesiones futuras

> **Primer** prospectivo de la capa categorial de opforja. Continúa `docs/capa-categorial.md` (lo hecho) con **lo que falta explorar**: los frentes de la teoría de categorías (corpus ICAS-BoK, `urn:fxsl:kb:icas-*`) que valen la pena para OPM+opforja, priorizados, con su garantía esperada y un veredicto honesto de cuáles son deriva. No es un plan de ejecución; es el mapa para decidir el próximo frente.

## Cómo leer este preludio

Cada frente trae: la **pregunta categorial**, la **URN ICAS** que lo apoya, la **garantía** que daría a OPM/opforja, el **esfuerzo/riesgo**, y una **prioridad** (P1 abrir pronto · P2 cuando P1 madure · P3 elegante pero valor incierto · **NO** descartado con razón).

Criterio rector (de la sesión Fs/Ss): **un frente vale si produce una garantía verificable por ley falsificable, no si solo es elegante.** Verdad estructural sobre belleza formal.

## Mapa de ejes de OPM

| Eje | Estado | Frentes |
|-----|--------|---------|
| **Vertical** (refinamiento ⊣ abstracción) | **formalizado inicial 2026-06-03**: F-V1 adjunción + F-V2 fibración cerrados | F-V1 adjunción ✓, F-V2 fibración ✓ |
| **Horizontal** (componer / comparar / razonar) | iniciado: F1/F2/F3 | F-H1 Yoneda, F-H2 2-categoría, F-H3 pullbacks |
| **Dinámico** (comportamiento / tiempo) | iniciado: simulación Ss; F-D1/F-D2/F-D3 cerrados iniciales | F-D4 sistemas abiertos |
| **Meta** (herramienta y modelo) | no tocado | F-M1 migración, F-M2 lifecycle/drift, y descartados |

---

## Eje vertical — el frente más maduro para abrir

### F-V1 · Refinamiento como adjunción explícita  **[cerrado inicial · 2026-06-03]**
- **Pregunta:** ¿in-zoom ⊣ out-zoom es una adjunción genuina (con unit/counit), o solo una pareja informal? ¿Vale el round-trip (refinar y luego abstraer recupera el original, módulo detalle)?
- **URN:** `urn:fxsl:kb:icas-adjunciones` (unit/counit, free/forgetful, Σ⊣Δ⊣Π).
- **Garantía implementada:** `firmaFronteraEntidad` permite verificar la **unit** η: `out-zoom ∘ in-zoom` preserva exactamente la frontera del proceso ("módulo detalle añadido"), más la idempotencia de in-zoom. La cara estática (counit en estado: padre ≅ hijo) ya la cubría `observarPreservacionFrontera`. Ley en `app/src/leyes/refinamiento-adjuncion.test.ts` con control de no-tautología (`quitarEnlaceFronteraDe`).
- **Puente clave:** la ley `F-V1↔F-D2` demuestra que la frontera que la **bisimulación** (F-D2) ejerce es la que la adjunción **preserva** — convierte la hipótesis sobre la que descansaba F-D2 en **teorema verificado**.
- **Estado:** cerrado como ley operativa. No afirma las identidades triangulares completas (lectura más débil que cumple); el round-trip para `despliegue` queda como extensión.

### F-V2 · Árbol de refinamiento como fibración de Grothendieck  **[cerrado inicial · 2026-06-03]**
- **Pregunta:** ¿el árbol de OPDs es una fibración (cada OPD fibra sobre su padre; navegar el árbol = cambio de base)?
- **URN:** `urn:fxsl:kb:icas-extension` (Grothendieck, fibrations, Kan extensions).
- **Garantía implementada:** `verificarLiftCartesianoFrontera` comprueba que la proyección de frontera padre→hijo es un **lift cartesiano**: biyección {enlaces de frontera del padre} ↔ {derivados `enlace-externo-refinamiento` del hijo}, con existencia (sin faltantes), unicidad (sin duplicados ni huérfanos) y cambio de base coherente (`refinamientoId` = entidad refinada que sube a ese OPD). Verifica también el **cambio de base funtorial** (un enlace de frontera creado tras el in-zoom recibe su lift). Ley en `refinamiento-adjuncion.test.ts` con dos controles de no-tautología (lift huérfano, lift faltante).
- **Estado:** cerrado como ley operativa para `descomposicion`. Juntos, F-V1 + F-V2 formalizan por primera vez el eje vertical de OPM con leyes falsificables.

---

## Eje horizontal — profundizar lo iniciado (F1/F2/F3)

### F-H1 · Identidad por relaciones (Yoneda)  **[P2]**
- **Pregunta:** ¿una entidad está determinada por su patrón de relaciones? ("dime con qué te enlazas y te diré qué eres").
- **URN:** `urn:fxsl:kb:icas-identidad-relacion` (Yoneda, embedding, presheaves).
- **Garantía:** equivalencia/deduplicación más fina que la firma de frontera (F2); mejora la **sugerencia de interfaz en composición** — hoy por nombre+tipo, Yoneda la haría por patrón de relaciones (más robusta a renombres).
- **Esfuerzo/riesgo:** medio / medio.
- **Por qué P2:** profundiza F1/F2 directamente; valor concreto en la UX de composición.

### F-H2 · OPM como 2-categoría  **[P3]**
- **Pregunta:** ¿OPDs (0-células), refinamientos (1-células) y equivalencias (2-células) forman una 2-categoría coherente?
- **URN:** `urn:fxsl:kb:icas-higher-categories`.
- **Garantía:** unifica composición + equivalencia + refinamiento en UNA estructura; elegancia conceptual máxima.
- **Esfuerzo/riesgo:** alto / **alto** — abstracto; valor para el *constructor*, casi nulo para el *usuario*. Riesgo de deriva.
- **Por qué P3:** hermoso, pero solo abrir si F-V1/F-V2/F-H1 ya dieron las piezas y la unificación se vuelve natural, no forzada.

### F-H3 · Pullbacks (restricción / intersección de modelos)  **[P3]**
- **Pregunta:** si la composición es pushout (unión por interfaz), ¿cuál es su dual — el pullback (la parte común / restricción de un modelo a una frontera)?
- **URN:** `urn:fxsl:kb:icas-universales`.
- **Garantía:** extraer el submodelo común a dos, restringir un modelo a un contexto. Cierra la dualidad de la composición.
- **Esfuerzo/riesgo:** medio / medio. Valor de uso incierto (¿el modelador necesita "intersecar" modelos?).

---

## Eje dinámico — la frontera de la simulación

### F-D1 · El tiempo (behavior types / sheaves temporales)  **[cerrado inicial · 2026-06-03]**
- **Pregunta:** ¿cómo modela OPM la duración real, el sobretiempo/subtiempo, la concurrencia temporal? Hoy la simulación tiene **reloj sin semántica**.
- **URN:** `urn:fxsl:kb:icas-tiempo` (behavior types, sheaves temporales, contratos).
- **Garantía implementada:** cierra el mínimo S3: `DuracionTemporal` se conserva como ventana de traza, la duración observada entra al reloj en segundos y los enlaces `excepcionSobretiempo`/`excepcionSubtiempo`/`excepcionSubSobretiempo` disparan eventos por umbral.
- **Estado:** ley operativa en `app/src/leyes/tiempo-enriquecimiento.test.ts`; queda pendiente solo la UX rica de concurrencia temporal, no el contrato semántico mínimo.
- **Esfuerzo/riesgo:** alto / medio. Toca el tipo compartido `DuracionTemporal` (decisión de arquitectura).
- **Nota:** la lectura sheaf temporal sigue como marco conceptual; el código implementa la sección observada mínima sin meter jerga categorial al usuario.

### F-D2 · Bisimulación de frontera plena (cierre de F2↔S)  **[cerrado inicial · 2026-06-03]**
- **Pregunta:** ¿la simulación de un in-zoom **ejerce** las entidades de frontera del proceso abstracto?
- **URN:** `urn:fxsl:kb:icas-efectos` (bisimulación).
- **Garantía implementada:** `verificarBisimulacionFrontera` compara la firma abstracta de frontera del proceso padre con la firma ejercida por la traza del OPD hijo. La ley `F2↔S frontera plena` falla si falta un derivado de frontera ejercido.
- **Estado:** cerrado como ley operativa en `app/src/leyes/integracion-ss-fs.test.ts` con control de no-tautología; queda como base para F-D1/F-D3, no como deuda abierta.
- **Nota:** la lectura adjunta del eje vertical sigue siendo hipótesis estructural útil; la ley no afirma todavía una adjunción completa in-zoom ⊣ out-zoom con unit/counit.

### F-D3 · Enriquecimiento cuantitativo (Cost-categories)  **[cerrado inicial · 2026-06-03]**
- **Pregunta:** ¿costos, duración, probabilidad y recursos como **enriquecimiento** de la categoría OPM (no como atributos sueltos)?
- **URN:** `urn:fxsl:kb:icas-enriquecimiento` (Bool/Cost-categories, profunctors, QoS).
- **Garantía implementada:** `resumirEnriquecimientoCuantitativo` reduce corridas a duración total/media/min/max y conteos de eventos temporales por tipo/enlace; la ley verifica que dos corridas se agregan como magnitudes enriquecidas de la traza.
- **Estado:** cerrado como base cuantitativa inicial. Costos/recursos/probabilidades agregadas quedan como extensiones del mismo patrón, no como frente abierto sin ancla.
- **Esfuerzo/riesgo:** medio / medio.
- **Nota:** no afirma optimización ni QoS completa; fija el operador de resumen que permite crecer hacia ellas.

### F-D4 · Sistemas dinámicos abiertos / lentes  **[P3]**
- **Pregunta:** ¿procesos como sistemas abiertos componibles por **lentes / polynomial functors** (entrada/salida que se enchufan)?
- **URN:** `urn:fxsl:kb:icas-interaccion` (polynomial functors, lentes dependientes, sistemas dinámicos).
- **Garantía:** composición **dinámica** de sistemas que interactúan (no solo unión estática por interfaz); une F1 (composición) con Ss (simulación) en sistemas que se acoplan en el tiempo.
- **Esfuerzo/riesgo:** alto / alto. Abrir solo si F-D1 y F1 maduraron.

---

## Eje meta — la herramienta y el ciclo de vida

### F-M1 · Migración / interoperabilidad (funtor OPM ↔ otros)  **[P3]**
- **Pregunta:** ¿un funtor faithful OPM↔BPMN/SysML/FHIR que declare exactamente qué preserva y qué pierde?
- **URN:** `urn:fxsl:kb:icas-preservacion` (funtores faithful/full, migración).
- **Garantía:** importar/exportar a otros formalismos con garantía de no-corrupción. Práctico pero fuera del foco interno actual.
- **Esfuerzo/riesgo:** alto / medio.

### F-M2 · Lifecycle / drift del modelo  **[P3]**
- **Pregunta:** ¿el modelo OPM diverge de la realidad que modela (drift)? ¿deuda categorial entre versiones?
- **URN:** `urn:fxsl:kb:icas-lifecycle`.
- **Garantía:** detección de drift modelo↔sistema; versionado con semántica. Valor organizacional más que de OPM-lenguaje.

---

## Lo que NO recomiendo (anti-deriva, honestidad Ψ)

| Frente | URN | Por qué NO |
|--------|-----|------------|
| Topos / lógica interna completa | `icas-topoi` (más allá del sheaf de pegado de F0) | la lógica intuicionista de OPM es matemáticamente fascinante y de **valor práctico nulo** para el modelador; el sheaf de pegado (F0) ya capturó lo útil. Deriva pura. |
| Agencia / free monad | `icas-agencia` | OPM modela **procesos, no agentes deliberativos**; imponer free monad sería estructura que OPM no pide. La simulación no-determinista (Dist/Powerset) ya cubre lo necesario. |
| Protocolos / sagas / coreografía | `icas-protocolos` | OPM no es un lenguaje de coordinación de protocolos; periférico. |
| Procesos / infraestructura / safety-alignment | `icas-procesos`, `icas-infraestructura`, `icas-safety-alignment` | son sobre la **herramienta y el proceso de modelar**, no sobre OPM-el-lenguaje. Meta; no categorial-de-OPM. |
| Operads / escala / megamodelos | `icas-escala` | structured cospans ya se tocó en composición; megamodelos solo si aparece un caso real de sistema-de-sistemas. Especulativo hoy. |

## Método para abordar CUALQUIER frente (patrón validado en Fs/Ss)

1. **Reformular** el mecanismo OPM como construcción categorial (cat-thinking: traducir antes de aplicar).
2. La construcción **predice una ley de coherencia**.
3. **Implementar la ley como test falsificable** en `app/src/leyes/`, **con control de no-tautología** (debe fallar si el bug que vigila reaparece). *Esta es la lección dura: sin ella, verde ≠ correcto.*
4. Si el frente toca canon, **proponer a `custodio-kora`** — en las capas opforja (`reglas-opm-estrictas-es`, `metodologia-forja-opm-es`, `spec-forja-opl-es`, `opm-categorial-es`), **nunca** en las ISO.
5. **Nunca exponer la jerga categorial al modelador** (`metodologia-forja §0.2-0.3`). La lente vive bajo la superficie.

## Orden sugerido para sesiones futuras

1. **Sesión "identidad"** — F-H1 (Yoneda) para afinar composición/equivalencia si aparece una ley concreta.
2. **Sesión "sistemas abiertos"** — F-D4 (lentes) solo si F1+Ss necesitan composición dinámica, no antes.
3. ~~**Sesión "eje vertical 2"** — F-V1 + F-V2~~ **hecho (2026-06-03).** Extensiones abiertas: round-trip para `despliegue`, identidades triangulares completas, Cost-category real (F-D3).
4. **Solo si emergen naturalmente:** F-H2 (2-categoría), F-H3 (pullbacks), F-M1/F-M2.

**Antes de abrir cualquier frente, el test de admisión:** *¿esto da una garantía verificable por ley, o solo elegancia?* Si solo elegancia → no se abre.

## Referencias

- Lo hecho: `docs/capa-categorial.md` (mapa OPM↔TC, arquitectura F0-F3+Ss, leyes verificadas, lecciones).
- SSOT: `urn:fxsl:kb:opm-categorial-es` (artefacto-puente) + el corpus ICAS-BoK (`urn:fxsl:kb:icas-sintesis` y familia, 24 piezas).
- Leyes ejecutables: `app/src/leyes/`.
