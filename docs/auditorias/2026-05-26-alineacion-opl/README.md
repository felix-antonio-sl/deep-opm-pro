# Auditoría de alineación OPL — triage de `spec-forja-opl §20`

- **Fecha**: 2026-05-26
- **Fuente**: `docs/canon-opm/spec-forja-opl.md §20` (Trazabilidad y gaps — tabla maestra §20.1, índice §20.2, cobertura inversa §20.3).
- **HEAD auditado**: `5ac57d62e2db49b610b329ce96ceb4dfab1eb019`
- **Superficie verificada**: `app/src/opl/generadores/**`, `app/src/opl/parser/**`, `app/src/opl/fixtures-roundtrip.ts`, `app/src/modelo/nombresCanonicos.ts`.
- **Propósito**: cerrar GAPs código↔canon. READ-ONLY sobre `app/src/**`; este doc es el roadmap de corrección posterior. **Doc vivo** (familia auditoría, no archivable).
- **Autoridad de canon**: `docs/canon-opm/reglas-opm-estrictas.md` (estados `puede estar`; especialización `puede ser`).

## 1. Método

Cada GAP-* distinto de §20.2 (más los marcadores embebidos en §20.1/§20.3) se dedup, se verifica contra el código real con lecturas focales, y recibe `Tipo`, `Veredicto` y `Severidad`. Los `GAP-VERIFY` se confirman o reclasifican. Donde la "regla de la spec" colisiona con una emisión deliberada del generador, se arbitra si manda el canon (corregir-código) o si la spec es demasiado estricta (relajar-spec).

Marco de tipos: `bug-viola-canon` · `generador-faltante` · `parser-faltante` · `fixture-faltante` · `verify` · `spec-sin-codigo`.
Veredictos: `corregir-código` · `relajar/ajustar-spec` · `diferir-feature` · `confirmar-y-cerrar` · `requiere-decisión-operador`.

## 2. Tabla de triage

| GAP | Tipo | Descripción | Archivo(s) | Veredicto | Severidad | Notas |
|-----|------|-------------|-----------|-----------|-----------|-------|
| GAP-PLACEHOLDER-ENTIDAD | bug-viola-canon | `entidadOplEsEmitible` hace `return true` siempre (`void entidad`); R-ENT-2 (supresión de placeholder) no tiene efecto pese a existir `esNombreProcesoPlaceholder` | `generadores/refsHints.ts:203-206`, `modelo/nombresCanonicos.ts:43` | corregir-código | **alta** | Bug real y aislado: conectar `esNombreProcesoPlaceholder(entidad.nombre)` para procesos. Riesgo: emisión de placeholders como entidades OPL. Un solo archivo. |
| GAP-EVENTO-RESULTADO | bug-viola-canon | `oracionEvento` caso `resultado` emite `X inicia P, que genera X` — evento sobre un resultado (output), viola R-MOD-INPUT-2 (evento solo sobre INPUT) | `generadores/procedural.ts:272-276` | corregir-código | **alta** | Un objeto resultado no puede iniciar el proceso que lo crea (no existe aún). Canon manda: no emitir, o degradar a oración base de resultado. No es spec demasiado estricta: es causalidad. |
| GAP-EVENTO-INVOCACION | bug-viola-canon | `oracionEvento` caso `invocacion` emite `X inicia e invoca Y`, mezcla evento (transformante/habilitante) con invocación (proceso→proceso), viola R-MOD-CAT-1 | `generadores/procedural.ts:282-283` | corregir-código | media | Evento es modificador de enlace objeto→proceso; invocación no admite extremo-objeto iniciador. Degradar a invocación base. |
| GAP-CONDICION-RESULTADO | bug-viola-canon | `oracionCondicion` caso `resultado` emite `P ocurre si Y puede generarse…` — condición sobre output, viola R-MOD-INPUT-2 | `generadores/procedural.ts:313-317` | corregir-código | **alta** | Misma raíz que GAP-EVENTO-RESULTADO. `puede generarse` no es léxico canónico de condición (canon usa `existe`/`está en`). Corregir junto. |
| GAP-CONDICION-INVOCACION | bug-viola-canon | `oracionCondicion` caso `invocacion` emite `X invoca Y si X ocurre` | `generadores/procedural.ts:323-324` | corregir-código | baja | Condición sobre invocación no canónica; tautológica (`si X ocurre`). Degradar a invocación base. |
| GAP-FAN-RESULTADO-COND | bug-viola-canon | `oracionAbanicoCondicional` emite `puede generarse` para resultado+condición+fan (C-20) | `generadores/abanico.ts` (`oracionAbanicoCondicional`) | corregir-código | media | Misma familia léxica que GAP-CONDICION-RESULTADO; coordinar la corrección de `puede generarse` en abanico y procedural. |
| GAP-INVOCACION-TILDE | bug-viola-canon | Emite `despues de` sin tilde (`después de`) en invocación y autoinvocación | `generadores/procedural.ts:187,205` | corregir-código | baja | Bug ortográfico trivial es-CL. Atención al roundtrip: el parser debe aceptar ambas grafías o normalizar (§18). |
| GAP-PROB-SUPERFICIE | bug-viola-canon | `sufijoProbabilidad` emite `(probabilidad: %)` por enlace, no `Pr=p` por rama en fan XOR (C-22) | `generadores/procedural.ts:421-422`, `abanico.ts` | corregir-código | media | Divergencia de superficie deliberada. Decidir si el canon `Pr=p` es obligatorio o si el formato humano es aceptable → si canon manda, cambiar a `Pr=`. |
| GAP-EXC-UNIDADES-LITERAL | relajar/ajustar-spec | `formatoTiempo` operacionaliza `unidades-tiempo` con valor+unidad concretos en vez del literal de plantilla | `generadores/procedural.ts:207-227` | relajar/ajustar-spec | baja | Operacionalizar el placeholder es correcto (un modelo real tiene valores). La spec describe la plantilla; ajustar §5.3 para reconocer la realización concreta. Confirmar-cerrar tras nota en spec. |
| GAP-XOR | generador-faltante | `puede ser` (especialización XOR) sin generador; `emitirEspecializacion` emite `es un` (generalización plana) | `generadores/refinamiento.ts:332-350` | corregir-código | **alta** | El canon del repo exige `puede ser` para especialización (reglas-opm-estrictas). Emitir `es un` es divergencia de canon, no solo feature faltante. Bug + feature. |
| GAP-XOR-PARSER | parser-faltante | Sin regex estructural para `puede ser` en `astEstructural` | `parser/parsear.ts:959-974` | diferir-feature | media | Depende de GAP-XOR (forward primero). Ola de parsers. |
| GAP-VARIA | generador-faltante | `varía de … a` (rango de valor de atributo) sin generador | — | diferir-feature | media | Canónico §1.1; no emitido. Feature. |
| GAP-TIPO | generador-faltante | `es de tipo` sin generador | — | diferir-feature | baja | Feature. |
| GAP-NOMBRE-INSTANCIA | generador-faltante | Formato nominal `Instancia : Clase` sin generador dedicado | `estructural.ts`, parser §6.4 | diferir-feature | baja | La clasificación verbal (`es una instancia de`) sí existe (gen+parser). El nominal `:` es display alternativo. Feature opcional. |
| GAP-REFINA | generador-faltante | `se refina por …` (CX4) sin generador autónomo ni parser | `refinamiento.ts` (jerarquía implícita) | diferir-feature | media | La jerarquía OPD se expresa por bloques, no por oración `se refina`. Feature de superficie. |
| GAP-PLIEGA | generador-faltante | `se pliega en el OPD padre` (plegado total CX5/CX6) sin generador ni parser (existe plegado parcial) | `plegado.ts` | diferir-feature | media | Plegado parcial alineado; total ausente. Feature. |
| GAP-RECOMPONE | generador-faltante | `se recompone desde` (CX7/CX8) sin generador ni parser | — | diferir-feature | baja | Feature avanzada. |
| GAP-FAN-EVENTO | generador-faltante/parcial | `abanico.ts` emite fan bajo evento solo para efecto con objeto común y procesos alternativos; otros roles bajo evento siguen sin plantilla | `generadores/abanico.ts` | diferir-feature-restante | media | Parcial cerrado por `BUG-20260603T050454Z-276ea7`; restan otros roles. |
| GAP-FAN-M | generador-faltante | Sin generador `exactamente m de f` / `al menos m de f` (solo m=1) | `generadores/abanico.ts:76` | diferir-feature | media | Solo `exactamente uno de`/`al menos uno de`. Feature de cardinalidad de fan. |
| GAP-COMPOSICION | generador-faltante | Sin capa que coordine predicados de distinto verbo bajo proceso compartido (eje a) | — | diferir-feature | media | Capa de composición ausente; feature mayor §9. |
| GAP-COMP-REVERSE | parser-faltante | Parser no descompone línea de predicados coordinados de distinto verbo (R-COMP-REV-1) | `parser/parsear.ts` | diferir-feature | media | Pareja inversa de GAP-COMPOSICION; mismo paquete. |
| GAP-TAG-PARSER | parser-faltante | `se relaciona con` / `se relacionan` / etiquetas de usuario sin regex en `astEstructural` (verificado: no aparecen) | `parser/parsear.ts:959-974` | diferir-feature | media | El generador `oracionEstructuralEtiquetada` emite; el parser no lo reconstruye. Pareja forward-sin-reverse. |
| GAP-SSE-PARSER | parser-faltante | Etiquetado con estado especificado hereda GAP-TAG-PARSER | `parser/parsear.ts` | diferir-feature | baja | Subconjunto de GAP-TAG-PARSER. |
| GAP-CX-PARSER | parser-faltante | `se descompone en` se genera pero sin regex que la reconstruya como refinamiento | `parser/parsear.ts` | diferir-feature | media | Despliegue (CX3) sí se parsea por regex estructurales; descomposición serial no. |
| GAP-PARSE-TS4 | verify | Regex de `cambia … de \`estado\`` sin `a` no verificada | `parser/parsear.ts:297` (`ABANICO_CAMBIA_RE`) | requiere-decisión-operador | media | `ABANICO_CAMBIA_RE` existe; falta confirmar que cubre TS4 (origen sin destino). Verificar regex y, si no, ampliarla. |
| GAP-PARSE-TS5 | verify | Regex de `cambia … a \`estado\`` sin `de` no verificada fuera del abanico | `parser/parsear.ts:297` | requiere-decisión-operador | media | Igual que TS4 para rama destino. Verificar cobertura de `ABANICO_CAMBIA_RE`. |
| GAP-PROCEDENCIA-ESCIND | verify | Metadato de procedencia escindido (split de TS por refinamiento) no rastreado | `generadores/procedural.ts:130-133` | confirmar-y-cerrar | baja | El split input/output existe (`consumo.modificador ?? resultado.modificador`); confirmar que el metadato se preserva en patch. Cerrar tras verificación. |
| GAP-FIXTURE-EFECTO | fixture-faltante | Sin fixture roundtrip de efecto básico (`afecta`) | `fixtures-roundtrip.ts` | corregir-código | media | Generador+parser existen (`oracionEfecto`, `ABANICO_VERBO_RE_LIST`); falta cobertura. Bajo blast-radius. |
| GAP-FIXTURE-TS3 | fixture-faltante | Sin fixture de cambio de estado `de … a …` | `fixtures-roundtrip.ts` | corregir-código | media | Gen+parser existen; añadir fixture estricto. |
| GAP-FIXTURE-TS4 | fixture-faltante | Sin fixture de efecto parcial TS4 | `fixtures-roundtrip.ts` | diferir-feature | baja | Depende de GAP-PARSE-TS4 (verify). Añadir tras confirmar regex. |
| GAP-FIXTURE-TS5 | fixture-faltante | Sin fixture de efecto parcial TS5 | `fixtures-roundtrip.ts` | diferir-feature | baja | Depende de GAP-PARSE-TS5. |
| GAP-FIXTURE-HS | fixture-faltante | Sin fixture de habilitador con estado especificado (HS1/HS2) ni variantes evento/cond/negada | `fixtures-roundtrip.ts` | corregir-código | baja | Gen+parser existen (`ABANICO_VERBO_RE_LIST`, sufijo estado). Añadir fixtures. |
| GAP-FIXTURE-EVENTO | fixture-faltante | Sin fixture de evento `inicia` | `fixtures-roundtrip.ts` | corregir-código | media | Solo cubrir evento canónico (input), tras corregir GAP-EVENTO-RESULTADO/INVOCACION. |
| GAP-FIXTURE-INVOCACION | fixture-faltante | Sin fixture de invocación/autoinvocación | `fixtures-roundtrip.ts` | corregir-código | baja | Añadir tras GAP-INVOCACION-TILDE (la grafía debe estabilizarse primero). |
| GAP-FIXTURE-AGREGACION | fixture-faltante | Sin fixture dedicado de agregación | `fixtures-roundtrip.ts` | confirmar-y-cerrar | baja | **Existe** `enlace-estructural-agregacion` (línea 230). Reclasificar: GAP ya cubierto; cerrar. |
| GAP-FIXTURE-GENERALIZACION | fixture-faltante | Sin fixture dedicado de generalización | `fixtures-roundtrip.ts` | confirmar-y-cerrar | baja | **Existe** `enlace-estructural-generalizacion` (línea 250). Reclasificar; cerrar. |
| GAP-FIXTURE-EXHIBICION | fixture-faltante | Sin fixture de exhibición | `fixtures-roundtrip.ts` | corregir-código | baja | Gen+parser existen (`exhibe`); falta fixture. |
| GAP-FIXTURE-CLASIFICACION | fixture-faltante | Sin fixture de clasificación | `fixtures-roundtrip.ts` | corregir-código | baja | Gen+parser existen (`es una instancia de`); falta fixture. |
| GAP-FIXTURE-TAGGED | fixture-faltante | Sin fixture de etiquetado | `fixtures-roundtrip.ts` | diferir-feature | baja | Bloqueado por GAP-TAG-PARSER (no hay reverse). No-estricto o diferir. |
| GAP-FIXTURE-SSE | fixture-faltante | Sin fixture de estructural con estado especificado | `fixtures-roundtrip.ts` | diferir-feature | baja | Bloqueado por GAP-SSE-PARSER. |
| GAP-FIXTURE-ESTRUCTURALES | fixture-faltante | Paraguas: faltan fixtures de las estructurales | `fixtures-roundtrip.ts` | confirmar-y-cerrar | baja | **Dedup**: meta-GAP que se descompone en los GAP-FIXTURE-{AGREGACION,EXHIBICION,GENERALIZACION,CLASIFICACION,TAGGED}. No es fila propia; cerrar como agregador. |
| GAP-FIXTURE-DESCOMPOSICION | fixture-faltante | Sin fixture de descomposición/despliegue | `fixtures-roundtrip.ts` | diferir-feature | baja | Despliegue tiene test parcial; descomposición serial bloqueada por GAP-CX-PARSER. |
| GAP-ABANICO-AGENTE-PARSE | verify | Abanico de instrumento/agente inverso sin verificación de cobertura de parseo | `parser/parsear.ts`, `abanico.ts` | requiere-decisión-operador | media | Verificar si `ABANICO_VERBO_RE_LIST` cubre `es manejado por`/`es requerido por` (formas pasivas del fan). Si no, parser-faltante. |
| GAP-COMP-GUARDA | spec-sin-codigo | Sin guard programático que prohíba coordinar enlaces hijos en refinamiento (R-CX-COMP / R-COMP-ZP-1) | — | relajar/ajustar-spec | baja | Protección "por construcción". Si no hay capa de composición (GAP-COMPOSICION diferido), el guard es inalcanzable hoy. Documentar como no-aplicable hasta §9. |
| GAP-COL-RESOLUCION | spec-sin-codigo | Resolución de colisión de rol / precedencia de recomposición vive en kernel, sin generador OPL de reporte | `modelo/**` | relajar/ajustar-spec | baja | Correcto que viva en kernel (no es capa OPL). Ajustar spec: no exigir generador OPL. Confirmar-cerrar. |
| GAP-VERIFY (§11 ruta) | verify | Etiqueta de ruta (path label) — traza no confirmada | `procedural.ts` (`oracionEnlaceConRuta`, `oracionProcedimentalParaRuta`) | confirmar-y-cerrar | baja | Símbolos existen en cobertura inversa §20.3. Confirmar que emiten y cerrar; sin parser → nota diferir si se quiere reverse. |
| GAP-VERIFY (§14.5 click→foco) | verify | Handler click→foco vive en UI | `interaccion.ts` + `app/src/ui` | requiere-decisión-operador | baja | Fuera de capa OPL pura; verificar handler UI. Ajustar spec para no exigirlo en `opl/**`. |
| GAP-VERIFY (§15.x mutación por hecho) | verify | Re-tokenización sub-span | `interaccion.ts` (`referenciaEnlaceEspecifico`) | confirmar-y-cerrar | baja | Símbolo existe; se traza a §9/§14.5. Cerrar. |
| GAP-spec: `emitirDespliegueOcurren` | spec-sin-codigo | Emisión de despliegue sin entrada explícita en §7.2 | `refinamiento.ts` | relajar/ajustar-spec | baja | Dar entrada en §7.2 o marcar helper no normativo. |
| GAP-spec: `emitirEspecializacion` | spec-sin-codigo | Sin traza explícita; ligado a `puede ser`/generalización | `refinamiento.ts:332` | corregir-código | media | **Cruza con GAP-XOR**: emite `es un`, debería contemplar `puede ser`. Dar entrada en spec y corregir emisión. |
| GAP-spec: formateadores inline duración | spec-sin-codigo | `oracionesUnidadDescripcionEstados`/`formatear{Alias,Unidad,Descripcion}Inline` sin entrada dedicada | `duracionMetadata.ts` | relajar/ajustar-spec | baja | Helpers de metadato inline; dar entrada o marcar no normativos. |
| GAP-spec: mecánica de colapso de bloques | spec-sin-codigo | `aplanarBloquesOpl`/`chevronEstadoBloque`/`togglearColapsoBloque` sin entrada en §12–§13 | `bloquesJerarquicos.ts` | relajar/ajustar-spec | baja | Mecánica display; dar entrada en §12–§13 o marcar no normativa. |

## 3. Agrupación por ola de corrección

Solo veredictos `corregir-código`. Olas por blast-radius creciente.

### Ola 1 — Bugs de canon en `procedural.ts` (un solo archivo, alto valor)
Corrige las violaciones léxicas/causales de modificadores de enlace. Todas viven en `generadores/procedural.ts` (+ un caso espejo en `abanico.ts`).

- GAP-EVENTO-RESULTADO, GAP-EVENTO-INVOCACION (degradar a base; no emitir evento sobre output/invocación).
- GAP-CONDICION-RESULTADO, GAP-CONDICION-INVOCACION (eliminar `puede generarse`; degradar a base).
- GAP-FAN-RESULTADO-COND (espejo en `abanico.ts·oracionAbanicoCondicional`; corregir junto por compartir el léxico `puede generarse`).
- GAP-INVOCACION-TILDE (`despues de` → `después de`; alinear normalización del parser §18).
- GAP-PROB-SUPERFICIE (`(probabilidad: %)` → `Pr=p`; coordinar con `abanico.ts`).
- GAP-PLACEHOLDER-ENTIDAD (`refsHints.ts·entidadOplEsEmitible`: conectar `esNombreProcesoPlaceholder`).

**Tests que protegen**: `generadores/procedural.test.ts`, `generadores/abanico.test.ts`, `generadores/refsHints.test.ts`, `parser.condicionesExcepciones.test.ts`, `leyes/opl-reverse.test.ts`. Riesgo: cambiar el texto de evento/condición puede romper aserciones de snapshot existentes en `procedural.test.ts` — actualizar en el mismo cambio.

### Ola 2 — Especialización `puede ser` (gen + spec)
- GAP-XOR / GAP-spec `emitirEspecializacion`: cambiar `refinamiento.ts:338` para emitir `puede ser` según canon de especialización; dar entrada en §6.3/§7.
- Luego GAP-XOR-PARSER (Ola 3 de parsers).

**Tests**: `generadores/refinamiento.test.ts`, `parser.designacionesPlegado.test.ts`. Riesgo medio: `es un` vs `puede ser` toca generalización vs especialización — distinguir bien los dos constructos (no convertir toda generalización en XOR).

### Ola 3 — Fixtures roundtrip (cobertura, blast-radius mínimo)
Solo fixtures con gen+parser ya existentes y verificados:
- GAP-FIXTURE-EFECTO, GAP-FIXTURE-TS3, GAP-FIXTURE-HS, GAP-FIXTURE-EVENTO (post-Ola 1), GAP-FIXTURE-INVOCACION (post-Ola 1), GAP-FIXTURE-EXHIBICION, GAP-FIXTURE-CLASIFICACION.

**Tests**: `roundtrip.test.ts` + `fixtures-roundtrip.ts`. Riesgo bajo: solo agrega filas al catálogo; si la bisimetría falla, marca `bisimetricaEstricta=false` y abre GAP de parser.

### Diferidos (no entran a olas de corrección)
Features: GAP-VARIA, GAP-TIPO, GAP-REFINA, GAP-PLIEGA, GAP-RECOMPONE, GAP-FAN-EVENTO parcial (restan otros roles bajo evento), GAP-FAN-M, GAP-COMPOSICION/GAP-COMP-REVERSE, GAP-NOMBRE-INSTANCIA. Parsers sin reverse: GAP-TAG-PARSER, GAP-SSE-PARSER, GAP-CX-PARSER, GAP-XOR-PARSER (tras Ola 2). Fixtures bloqueados: GAP-FIXTURE-{TS4,TS5,TAGGED,SSE,DESCOMPOSICION}.

## 4. Resumen ejecutivo

**GAPs distintos triados: 48** (incluye 3 GAP-VERIFY desagregados de §11/§14.5/§15.x y 4 GAP-spec de §20.3; deduplicados GAP-FIXTURE-ESTRUCTURALES como agregador y los GAP-* repetidos en §1.1↔§6/§7).

Por **tipo**:
- bug-viola-canon: **8**
- generador-faltante: 11
- parser-faltante: 5
- fixture-faltante: 13
- verify: 6
- spec-sin-codigo: 5

Por **veredicto**:
- corregir-código: **15** (8 bugs Ola 1 + especialización + 7 fixtures con backend listo, algunos post-Ola 1)
- diferir-feature: 17
- relajar/ajustar-spec: 7
- confirmar-y-cerrar: 6 (incluye 2 fixtures que ya existen: agregación, generalización)
- requiere-decisión-operador: 4 (GAP-PARSE-TS4, GAP-PARSE-TS5, GAP-ABANICO-AGENTE-PARSE, GAP-VERIFY click→foco UI)

**Bugs reales (no features ni ajustes de spec): 8.** Los de mayor severidad:

1. **GAP-PLACEHOLDER-ENTIDAD** (alta) — `entidadOplEsEmitible` ignora el argumento y siempre emite; R-ENT-2 muerto. Procesos placeholder se emiten como OPL. `refsHints.ts:203`.
2. **GAP-EVENTO-RESULTADO** (alta) — emite evento sobre un resultado (`X inicia P, que genera X`), causalmente imposible; viola R-MOD-INPUT-2. `procedural.ts:272`.
3. **GAP-CONDICION-RESULTADO** (alta) — condición sobre output con léxico no canónico `puede generarse`; misma raíz. `procedural.ts:313`.
4. **GAP-XOR / `emitirEspecializacion`** (alta) — especialización se emite como `es un` plano en vez del `puede ser` que exige el canon del repo. `refinamiento.ts:338`.
5. **GAP-EVENTO-INVOCACION / GAP-CONDICION-INVOCACION** (media) — mezclan invocación proceso→proceso con modificadores objeto→proceso (R-MOD-CAT-1). `procedural.ts:282,323`.

Conclusión: el grueso del trabajo de corrección (Ola 1) es **un solo archivo** (`procedural.ts`, con espejo en `abanico.ts`) y cierra los 8 bugs de canon; el resto son features diferibles o ajustes de redacción de la spec. La especialización `puede ser` (Ola 2) es el único bug que toca semántica estructural y merece atención al distinguir generalización de especialización.
