# Candidate Extensions — retorno a SSOT

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-16 |
| Estado | **Activo** — ciclo de enriquecimiento reverso abierto |
| Target | `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:opl-es`, `urn:fxsl:kb:opd-es`, `urn:fxsl:kb:manual-metodologico-opm-es` |
| Base operacional | repo `opmodel` |

## Propósito

Registrar aprendizajes operacionales del repo `opmodel` que ameritan propuesta de cambio a la SSOT normativa (kora). Ningún ítem debe implementarse en SSOT sin discusión: este archivo es **lista de candidatos**, no changelog ejecutado.

Cada entrada tiene:

- **Título** y sección SSOT afectada (si aplica).
- **Hallazgo** — qué se observó operacionalmente.
- **Propuesta** — enmienda concreta sugerida.
- **Evidencia** — referencia a commit, test, bug o ADR del repo.
- **Riesgo** — qué podría salir mal si la SSOT adopta el cambio sin cuidado.

## Mecanismo

El ciclo propuesto:

1. El repo registra la entrada aquí al detectarla.
2. Felix revisa candidatos periódicamente.
3. Los aprobados se proponen como PR al corpus en kora.
4. Al merge en SSOT, el ítem se mueve a `candidate-extensions-closed.md` (aún no existe).

## Candidatos

### #1 — Las 4 leyes del isomorfismo como criterio operacional normativo

- **Afecta:** `urn:fxsl:kb:opm-es` (núcleo), `urn:fxsl:kb:opl-es` (OPL), `urn:fxsl:kb:opd-es` (OPD).
- **Hallazgo:** ADR-003 del repo (`docs/opl-first/10-isomorphism-architecture.md`) define 4 leyes verificables que la implementación debe satisfacer para que OPL/~ ≅ SemanticKernel ≅ Atlas/~:
  1. **Textual roundtrip** — `render(compile(parse(opl))) ≈ opl`
  2. **Atlas colimit** — toda thing en kernel aparece en al menos un OPD del atlas
  3. **Diamond commutativity** — compile-render-compile produce kernels equivalentes
  4. **Layout orthogonality** — cambios de layout no alteran semántica
- **Propuesta:** agregar al manual metodológico (`metodologia-opm-es.md`) una sección normativa "Criterios de isomorfismo textual-gráfico" que enuncie las 4 leyes como condiciones necesarias de cualquier implementación OPM. No especifica cómo probarlas — solo que deben sostenerse.
- **Evidencia:** `packages/core/tests/isomorphism-laws.test.ts`, 6 fixtures × 4 leyes = 24 tests verdes al cierre de T1 (commits `211f3b4`, `59a9806`).
- **Riesgo:** si la SSOT las adopta literalmente, podría parecer que prescribe implementación. Redactar como criterios de aceptación semánticos, no de arquitectura.

### #2 — Stripping de compound names es order-dependent

- **Afecta:** `urn:fxsl:kb:opl-es` (gramática OPL).
- **Hallazgo:** el parser del repo trata `X de Y` como compound de exhibición cuando `Y` está declarado antes que `X`. Si el orden se invierte en el texto re-renderizado, el compound no se detecta y los roundtrips fallan. Sin regla explícita de orden de declaración, el compound depende de heurística posicional.
- **Propuesta:** enmendar OPL-ES para que la gramática admita compound "`X` de `Y`" **independiente del orden de declaración** — ya sea obligando declaraciones de exhibidores antes de features en render, o permitiendo reconocimiento post-hoc. La implementación actual resolvió con propagación de exhibidores al root OPD, pero la regla debería vivir en la gramática.
- **Evidencia:** commit `59a9806` fix(core): close hodom isomorphism via compound refs + root-OPD exhibitor propagation. Bug observable en fixture `hospitalizacion-domiciliaria`.
- **Riesgo:** cambios en OPL-ES requieren re-generar EBNF (Apéndice A de `opm-opl-es.md`). Alto impacto editorial.

### #3 — Link types `input` / `output` ambiguos respecto a `consumption` / `result`

- **Afecta:** `urn:fxsl:kb:opd-es` (gramática visual) y `urn:fxsl:kb:opm-es` (núcleo conceptual).
- **Hallazgo:** las fixtures del repo contienen 1 link con type `input` y 1 con type `output` (fixture `hospitalizacion-domiciliaria`). La SSOT visual no cataloga estos tipos como procedurales de primera clase; probablemente son alias legacy de `consumption` / `result`. Sin embargo, el serializador los preserva.
- **Propuesta:** en SSOT, declarar explícitamente que `input` y `output` **no son tipos canónicos** y deben traducirse a `consumption` y `result` respectivamente. Añadir nota de compatibilidad para implementaciones legacy. Alternativamente, si hay razón conceptual para distinguirlos (por ejemplo, cantidad vs flujo), declararlo.
- **Evidencia:** grep sobre `tests/hospitalizacion-domiciliaria.opmodel`.
- **Riesgo:** clientes de `.opmodel` en el ecosistema podrían tener modelos con esos tipos. Requiere migración.

### #4 — Cobertura fixture insuficiente de fans, modifiers y estado-designation

- **Afecta:** `urn:fxsl:kb:opd-es` y `urn:fxsl:kb:manual-metodologico-opm-es`.
- **Hallazgo:** de 6 fixtures del suite de isomorfismo, solo 2 (`hospitalizacion-domiciliaria`, `ev-ams`) ejercitan fans, y solo 2 ejercitan modifiers E/C. 4 fixtures no ejercitan ningún fan ni modifier. Fans OR y AND aparecen una sola vez cada uno (hospitalizacion-dom). Esto deja porciones de la gramática visual sin verificar por el suite.
- **Propuesta:** agregar al repo de SSOT (o a un repo compañero de fixtures canónicas) un set de **fixtures sintéticas mínimas por constructo** — una por cada regla V-* con dimensión visual distinguible. Ejemplo: `fixture-xor-diverging.opmodel`, `fixture-state-designations.opmodel`, `fixture-semi-folding.opmodel`.
- **Evidencia:** `docs/opl-first/21-ssot-visual-mapping.md` sección "Coverage matrix final".
- **Riesgo:** las fixtures sintéticas deben ser canónicamente correctas; un error propaga a verificaciones operacionales. Requiere revisión manual.

### #5 — Regla V-54 tiene disyuntiva no resuelta

- **Afecta:** `urn:fxsl:kb:opd-es`, §17 (ejecución/simulación).
- **Hallazgo:** V-54 enuncia que "el estado actual se resalta con borde más grueso **o** color diferencial". La disyuntiva queda abierta — dos implementaciones conformes producen diagramas visualmente distintos.
- **Propuesta:** resolver la disyuntiva. Alternativas:
  - fijar una convención (por ejemplo, "borde más grueso es normativo; color es informativo");
  - declarar explícitamente que ambas son permitidas y marcar la convención como no-determinista;
  - separar en dos reglas (V-54a, V-54b) para simulación paso-a-paso vs resaltado instantáneo.
- **Evidencia:** detectado durante extracción del catálogo normativo (slice 2.0).
- **Riesgo:** ninguno relevante si la decisión es explicitar.

### #6 — Duplicado visual (§1.8) sin offset normado

- **Afecta:** `urn:fxsl:kb:opd-es`, §1.8.
- **Hallazgo:** la SSOT menciona "silueta desplazada detrás del símbolo" como indicador de copia visual de la misma cosa en el mismo OPD, pero no norma offset, opacidad ni grosor de la silueta. Dos implementaciones pueden producir diagramas inconfundiblemente diferentes.
- **Propuesta:** agregar parámetros mínimos — por ejemplo, "offset ≥ 2 mm, opacidad reducida respecto al símbolo principal, mismo contorno que la cosa duplicada" — o declarar explícitamente el gap.
- **Evidencia:** detectado durante extracción del catálogo normativo (slice 2.0).
- **Riesgo:** bajo.

### #7 — Agent/Instrument participantes vs. internal objects de in-zoom

- **Afecta:** `urn:fxsl:kb:opd-es`, §10.3–§10.4; `urn:fxsl:kb:opl-es`, cláusulas de in-zoom.
- **Hallazgo:** en un OPD hijo (in-zoom) aparecen **dos clases distintas** de thing visible: (a) subprocesos/subobjetos que el proceso padre refina — verdaderos "internals" — y (b) agentes/instrumentos/inputs externos necesarios para los subprocesos — no son internals, son participantes. La distinción no es explícita en la SSOT y la implementación inicial la confundía, produciendo OPL que no re-parseaba.
- **Propuesta:** agregar a `opm-opl-es.md` o `opm-visual-es.md` nota distintiva: en cláusula de in-zoom solo deben enumerarse los **internals del refinamiento**, no los participantes que llegan vía links agent/instrument/consumption.
- **Evidencia:** commit `211f3b4` fix(core): exclude agent/instrument participants from in-zoom internalObjects. Bugs observables en fixtures `ev-ams` y `hospitalizacion-domiciliaria`.
- **Riesgo:** si la nota se malinterpreta, podría eliminar participantes del OPD hijo. La regla correcta es **no nombrar participantes en cláusula "as well as" del in-zoom**; siguen apareciendo en el OPD por sus links.

### #8 — Coverage de exception links (§4.4) escasa en fixtures

- **Afecta:** `urn:fxsl:kb:opd-es` §4.4.
- **Hallazgo:** exception link aparece 3 veces en total a lo largo de las 6 fixtures, cada una con 1 caso. No hay cobertura explícita de overtime vs. undertime, ni de destino a proceso ambiental.
- **Propuesta:** ídem candidato #4, fixture sintética dedicada a exceptions.
- **Evidencia:** `docs/opl-first/21-ssot-visual-mapping.md` sección "Cobertura de Link types".
- **Riesgo:** bajo.

### #9 — Path label y multiplicidad sin fixture canónica

- **Afecta:** `urn:fxsl:kb:opd-es` §6, §7.
- **Hallazgo:** ni path labels ni multiplicidad (símbolos `?`, `*`, `+`, rangos, expresiones parametrizadas) aparecen ejercitados en ninguna de las 6 fixtures.
- **Propuesta:** ídem candidato #4.
- **Evidencia:** audit slice 2.0.
- **Riesgo:** bajo.

### #10 — System boundary confundido con aggregation en OPD raíz

- **Afecta:** `urn:fxsl:kb:opd-es` §1.2, `urn:fxsl:kb:manual-metodologico-opm-es`.
- **Hallazgo:** la SSOT no define "system boundary" como entidad visual — es ausencia normativa, no regla explícita. V-71 trata sobre persistencia del tipo de contorno en refinamiento, no sobre system boundary. La distinción sistémico/ambiental vive en §1.2 y V-1 (contorno sólido vs punteado por thing). Herramientas de terceros (OPCloud, SysEngine) sí dibujan cajas envolventes. La implementación de `opmodel` necesita aclarar que cualquier grupo visual en UI es decoración, no entidad, y que la frontera del sistema se lee por la afiliación de cada thing individualmente.
- **Propuesta:** agregar a `metodologia-opm-es.md` nota operativa: "en implementaciones que dibujen bounding boxes o system frames, estos son auxiliares visuales no-normativos. La frontera del sistema vive en la afiliación systemic/environmental de cada cosa."
- **Evidencia:** análisis slice 2.0 (catálogo normativo).
- **Riesgo:** usuarios formados en OPCloud pueden esperar un frame.

### #11 — Effect link a obj-driver stateless (driver-rescuing)

- **Afecta:** fixture `driver-rescuing.opmodel` (no SSOT).
- **Hallazgo:** verifier emite VR-010 + VR-016 sobre `lnk-rescuing-effect-driver`: es un effect link que apunta a `obj-driver` (ambiental) sin states declarados. V-7 exige objeto stateful para effect; V-5 exige que objetos stateless solo participen vía consumption/result. Detectado al extender el verifier con las reglas semánticas V-5/V-7 (VR-010, VR-016).
- **Propuesta:** agregar estados `{rescued, unrescued}` o similares a `obj-driver` — plausible normativamente (el driver pasa de "unrescued" a "rescued" por el proceso). Alternativa: reclasificar el link como `result` si el driver se "genera" por el rescate.
- **Evidencia:** `bun run test` → `tests/jointjs-fixture-coverage.test.ts` marca KNOWN_FIXTURE_ERROR_CODES = {VR-010, VR-016}.
- **Riesgo:** si se modifica la fixture, verificar que los tests de isomorfismo sigan verdes.

### #12 — V-115 per-OPD vs per-atlas

- **Afecta:** `urn:fxsl:kb:opd-es` §9 (V-115: "todo proceso explícito transforma al menos un objeto").
- **Hallazgo:** la redacción deja ambiguo si la regla aplica por OPD individual o a nivel de atlas. El verifier VR-015 originalmente evaluaba por OPD y marcó 42 subprocesos sin transformer directo. Muchos son subprocesos que exhiben transformer en su sub-OPD hijo, no en el mismo OPD donde se dibujan. Baja a warning por ahora.
- **Propuesta:** aclarar en SSOT que V-115 opera a **nivel de atlas** (al menos un OPD muestra el transformer). Un OPD que omite el transformer es legítimo (abstracción parcial) mientras otro OPD lo exhiba.
- **Evidencia:** VR-015 emitido 42× contra las 6 fixtures; ninguno era realmente un error.
- **Riesgo:** bajo.

### #13 — V-83 requiere semántica per-appearance de refinement

- **Afecta:** `urn:fxsl:kb:opd-es` §10.4.
- **Hallazgo:** V-83 prohíbe que un elemento "external" sea refinado dentro del mismo child OPD. La información operacional necesaria es "¿este thing en este appearance tiene un refinement scope que cae dentro de este OPD?", no simplemente "¿el thing tiene algún refinement en el modelo?". El flag `isRefined` del spec solo responde la segunda, por eso VR-020 baja a warning.
- **Propuesta:** la SSOT podría pedir que las implementaciones tengan un tracking per-appearance de refinement scope, o simplificar V-83 a "un thing que aparece como external en child OPD no puede tener un refinement en el mismo child OPD" (definición posicional ya capturable por visibleThings + refinementByChildOpd).
- **Evidencia:** VR-020 disparó 6 falsos positivos en hospitalizacion-domiciliaria/SD1 porque Admisión/Atención Clínica/etc. tienen refinement en OTROS OPDs, no en SD1.
- **Riesgo:** medio — cambiar la semántica de V-83 puede impactar implementaciones existentes.

## Cronología

| Fecha | Entrada | Origen |
|-------|---------|--------|
| 2026-04-16 | #1–#10 (semilla inicial) | Slice 2.0 de T2 (rescate JointJS) |
| 2026-04-17 | #11–#13 | Extensión verifier con reglas semánticas V-5/V-7/V-83/V-115 (VR-010..VR-020) |
