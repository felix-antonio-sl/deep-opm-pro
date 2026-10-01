# Dossier normativo — spec-forja-opl-es v1.4.1 · Tramo A (líneas 1–1424)

- **Fuente**: `canon/spec-forja-opl-es/content.md` (v1.4.1, 3136 líneas). Tramo leído completo en 4 lecturas contiguas (1–400, 400–799, 800–1199, 1200–1429). Cubre: front-matter, Definición, Definiciones, Precedencia, Convenciones, §1 vocabulario, §2 entidades, §3 transformadores, §4 habilitadores, §5 modificadores de control (+ excepción e invocación), §6 estructurales, §7 refinamiento. §8 (combinatoria) en adelante queda fuera del tramo; las remisiones a §8–§20 se marcan «fuera de tramo».
- **Transcripción**: el canon escribe las plantillas como código inline con backticks escapados (`` \` ``). Aquí van en bloques de código con el backtick desescapado; todo lo demás es literal (negritas `**`, cursivas `*`, metavariables, comas y punto final).
- **Leyenda de consecuencia para la herramienta**: IMPEDIR · ADVERTIR · GENERAR-OPL · PARSEAR-OPL · RENDERIZAR · OPERACIÓN · MODELO-DATOS · EXPORT · MÉTODO (solo humano) · NO-HERRAMIENTA.
- **Nivel de obligación**: se reproduce la keyword del canon (DEBE / NO DEBE / DEBERÍA / PUEDE; «NUNCA DEBE» ≡ NO DEBE; «EXIGE»/«REQUIERE» ≡ DEBE). Cuando el canon solo describe («se emite», «se parsea»), se marca **inferido**.
- **Instrucción de alcance aplicada**: las citas a `opl-es`, `opm-es`, `SSOT-iso`, `SSOT-metod`, `SSOT-visual`, `glosario`, `opm-categorial-es`, `icas-universales` NO se siguen. Las citas a `reglas §…` se anotan como procedencia (el texto de `reglas-opm-estrictas-es` es canon entregado, pero se cubre en otro tramo).

---

## 0. Front-matter, Definición, Definiciones, Precedencia (l. 1–57)

### 0.1 Front-matter (l. 1–16)

`urn:fxsl:kb:spec-forja-opl-es`, v1.4.1, estado publicado, `depende: [reglas-opm-estrictas-es, opl-es, opm-es]`, `refina: [opl-es]`, `cita: [spec-forja-opd-es, metodologia-forja-opm-es, opm-categorial-es, icas-universales]`. El campo `fuente` narra la historia de sincronización (la «bestia» `~/kora`, sha256, commits, decisiones HITL 2026-06-15, deltas v1.2.2 orden de descomposición, v1.3.0 R-ENT-2-APUNTE por BUG-76af16, v1.4.0 R-FAN-5A/5B abanico TS3 entrada común, v1.4.1 solo corrige puntero).
→ **NO-HERRAMIENTA** (circunstancial). Relevante solo: existen R-ENT-2-APUNTE (§2.0) y R-FAN-5A/5B (fuera de tramo; mencionada en §3.4).

### 0.2 Definición (l. 20–28)

- La spec es SSOT OPL **bidireccional** y **operativa**: gobierna generación (modelo → frases), parseo (frases → mutaciones), presentación, interacción, edición, configuración, manejo de fallos e invariantes de equivalencia. → Define el perímetro de la herramienta en la modalidad OPL: GENERAR-OPL + PARSEAR-OPL (a mutaciones del modelo) + RENDERIZAR + edición.
- «Esta spec es autocontenida: un agente conforme NO DEBE necesitar abrir `opm-opl-es` ni `reglas-opm-estrictas-es §4` para implementar una entrada.» (NO DEBE) → consistente con la instrucción de ignorar fuentes externas.
- Frontera: validez nuclear y severidad → `reglas-opm-estrictas-es`; geometría/canvas → `spec-forja-opd-es`; método → `metodologia-forja-es`; lectura formal → `opm-categorial-es` (no entregado). La spec «NO DEBE copiar sus reglas completas salvo lo necesario». → NO-HERRAMIENTA (documental).

### 0.3 Definiciones (tabla literal, l. 32–45)

| Término | Definición |
| --- | --- |
| Oración atómica | Frase OPL que expresa un solo hecho del modelo y no admite descomposición sin perder el hecho. |
| Oración compuesta | Frase OPL que coordina dos o más hechos en una sola realización superficial (p. ej. agregación con varias partes). |
| Sub-span | Tramo contiguo de texto dentro de una oración que mapea a un único token o referencia de modelo. |
| Hecho | Unidad mínima del modelo (cosa, enlace, estado, relación) que una oración OPL realiza textualmente. |
| `ref` | Referencia tipada de un sub-span a la entidad de modelo (cosa, estado, enlace) que representa. |
| `hint` | Anotación no normativa adjunta a un span que orienta presentación, interacción o edición sin alterar el hecho. |
| Token | Unidad léxica de una oración OPL (palabra de objeto, verbo de proceso, valor de estado, conector o puntuación) reconocible por generación y parseo. |
| Esencia | Propiedad genérica de una cosa: física o informacional. |
| Afiliación | Propiedad genérica de una cosa: sistémica o ambiental. |
| Placeholder | Marcador de span pendiente de completar (objeto/proceso/estado sin nombre) emitido para edición guiada. |
| Plegado | Supresión deliberada de hechos refinados en un OPD ascendente, con su realización OPL equivalente. |
| Display-vs-canónico | Distinción entre la forma visible de una oración (presentación) y su forma canónica normalizada (equivalencia y roundtrip). |

→ **MODELO-DATOS** (inferido): la salida del generador no es texto plano sino oraciones compuestas de sub-spans con `ref` tipada (cosa/estado/enlace) y `hint` opcional. Es la base de la interacción OPL↔OPD (resaltar, navegar, editar). Display vs canónico: dos formas de una misma oración (visible vs normalizada para roundtrip).

### 0.4 Precedencia (l. 47–57)

- Esta spec DEBE mandar sobre la implementación OPL de OPFORJA (generadores, parser, presentación, interacción) y sobre todo texto OPL emitido/parseado/editado. → la herramienta rehecha queda subordinada a este texto.
- Esta spec DEBE quedar **bajo** `reglas-opm-estrictas-es` para el canon OPM nuclear (qué es cosa, enlace, estado, relación, severidad, extensión declarada).
- «Debe quedar compatible con la SSOT OPM externa (`opl-es`, `opm-es`)» → **fuera de canon por instrucción**; NO-HERRAMIENTA.
- NO DEBE relajar contratos superiores; solo PUEDE operacionalizarlos, restringirlos o declarar extensiones marcadas.

---

## 1. Convenciones (l. 59–99)

### 1.1 Tipografía — DEBE

> Un **objeto** DEBE escribirse en negrita; un *proceso* en cursiva; un `estado` o `valor` entre backticks. Esta convención es obligatoria en toda frase OPL y ejemplo de esta spec.

Ancla literal:

```
Correcto: *Cocinar* consume **Ingrediente**.
Incorrecto: Cocinar consume ingrediente.
Rationale: la tipografía es portadora de tipo; sin ella el parser no distingue objeto de proceso.
```

→ **GENERAR-OPL + RENDERIZAR** (DEBE): toda oración emitida marca tipo por tipografía (en texto/Markdown: `**…**`, `*…*`, `` `…` ``; en UI: negrita/cursiva/monoespaciado o equivalente). → **PARSEAR-OPL** (inferido): el parser usa la tipografía como portadora de tipo (objeto vs proceso vs estado). Ver GAP-A04 sobre texto sin marcado.

### 1.2 Esquema de IDs — DEBE (documental)

Reusar IDs de `reglas-opm-estrictas-es`: `D1`–`D13` (designaciones de cosas), `T1`–`T3`/`TS1`–`TS5` (transformadores), `H*`/`HS*` (habilitadores), `E*` (eventos), `C*` (condiciones), `SE*` (estructurales etiquetados), `RF*` (relaciones fundamentales), `SSE*` (estructurales con estado), `CX*` (refinamiento/contexto), `CM*` (gestión de complejidad). La spec PUEDE acuñar IDs nuevos sin colisión. → NO-HERRAMIENTA (útil para nombrar tests/fixtures).

### 1.3 Lenguaje de obligación — DEBE (documental)

Keywords RFC 2119 es-CL mayúsculas, enum cerrado: DEBE, NO DEBE, DEBERÍA, NO DEBERÍA, PUEDE. El hedging NO DEBE reemplazar una keyword. → NO-HERRAMIENTA.

### 1.4 Patrón regla + ejemplo + traza; trazabilidad — DEBE (documental)

Regla con más de una condición → `Correcto:` / `Incorrecto:` / `Rationale:`. Procedencia con `Rationale:`; NO DEBE usar `Traces to:`. → NO-HERRAMIENTA.

### 1.5 Cómo leer una entrada — DEBE (documental)

Campos en orden: ID, Plantilla, Emisión, Supresión, Tokenización, Orden, Composabilidad, Reverse, Edición, Interacción, Roundtrip, Edge cases, Traza a código, Procedencia.
→ (inferido) cada constructo implementado por la herramienta tiene esas dimensiones: plantilla de salida, condición de emisión, condición de supresión, tokenización con `ref`, orden de tokens, reglas de coordinación, parseo inverso, edición, roundtrip.

### 1.6 Precedencia de fuentes (l. 89–99)

1. `reglas-opm-estrictas-es` decide validez, severidad y extensión declarada.
2. `opl-es` y esta spec deciden gramática textual, vocabulario, plantillas, parseo y roundtrip OPL. (opl-es: fuera de canon por instrucción → solo esta spec.)
3. `spec-forja-opd-es` decide solo la contraparte visual cuando una entrada OPL cruza el puente OPD↔OPL.
4. `metodologia-forja-opm-es` decide solo el método; `opm-categorial-es` solo la explicación formal.
5. Libro de Dori, videos OPCloud y curso pedagógico son evidencia o intuición; no canonizan.

«Cuando el canon calla, la entrada DEBE marcarse como no-canonizado o extensión declarada; NO DEBE inventar canon.» → MÉTODO (para desarrollo: la herramienta no inventa superficies OPL; lo no canonizado se omite o se declara).

---

## 2. §1 Vocabulario fijo de verbos y cópulas (l. 101–196)

### 2.1 Regla marco — DEBE / NO DEBE

> El vocabulario OPL-ES es un **enum cerrado**. La generación NO DEBE emitir un verbo o cópula fuera de esta sección; el parseo NO DEBE reconocer como verbo OPL un token ausente de esta sección. Todo verbo DEBE emitirse en tercera persona singular del presente indicativo, salvo que la plantilla imponga otra forma (plural por multiplicidad, negación, pasiva refleja).

Procedencia: `reglas §4.3` (R-OPL-VERB-1).
→ **GENERAR-OPL** (NO DEBE emitir fuera del enum) + **PARSEAR-OPL** (NO DEBE reconocer fuera del enum). Ver contradicciones GAP-A03 (tokens usados en plantillas y ausentes del enum).

### 2.2 §1.1 Enum de verbos y cópulas (tabla literal)

| Verbo / cópula | Significado | Familia(s) de oración | Traza a código |
| --- | --- | --- | --- |
| consume | el proceso destruye el objeto | T1, TS1; condición/evento de consumo | `procedural.ts·oracionProcedural` (`consume`) |
| genera | el proceso crea el objeto | T2, TS2; condición/evento de resultado | `procedural.ts·oracionProcedural` (`genera`) |
| afecta | el proceso modifica el objeto sin estados explícitos | T3, TS3 | `procedural.ts·oracionProcedural` (`afecta`) |
| cambia … de … a | el proceso transforma el estado del objeto | cambio de estado; condición/evento de cambio | `procedural.ts·oracionCambioEstado` (`cambia … de … a`) |
| maneja | el agente humano habilita el proceso | agente | `procedural.ts·oracionProcedural` (`maneja`) |
| requiere | el proceso depende del instrumento | instrumento | `procedural.ts·oracionProcedural` (`requiere`) |
| inicia | el objeto/estado dispara el proceso | evento | `procedural.ts·oracionEvento` (`inicia`) |
| invoca | un proceso dispara otro proceso | invocación; autoinvocación | `procedural.ts·oracionProcedural` (`invoca`, `se invoca`) |
| ocurre | el proceso se ejecuta bajo condición o excepción | condición; excepción de duración | `procedural.ts·oracionCondicion` / excepción (`ocurre si`) |
| existe | el objeto está presente como precondición | condición de existencia | `procedural.ts·oracionCondicion` (`… existe`) |
| se omite | el proceso no se ejecuta (rama negativa) | condición (alternativa) | `procedural.ts·oracionCondicion` (`se omite`) |
| se consume | el objeto se destruye (voz pasiva refleja) | condición de consumo | `procedural.ts·oracionCondicion` (`se consume`) |
| consta de | el todo agrega las partes | agregación-participación | `estructural.ts·oracionEstructural` (`consta de` / `constan de`) |
| exhibe | el exhibidor caracteriza atributos/operaciones | exhibición-caracterización | `estructural.ts·oracionEstructural` (`exhibe` / `exhiben`) |
| tiene un … opcional | el exhibidor porta un rasgo de multiplicidad opcional (extensión declarada, §6.2 RF2o) | exhibición con rasgo opcional | `estructural.ts·oracionEnlaceEstructural` (variante opcional) / `parsear.ts` (`tiene un … opcional`, plural `tiene … opcionales`) |
| son | varias especializaciones son la general (plural) | especialización jerárquica | `estructural.ts·oracionEstructural` (`son`) |
| es un / es una | una especialización es la general (singular) | especialización jerárquica | `estructural.ts·oracionEstructural` (`es un`) |
| es una instancia de | la instancia pertenece a la clase | clasificación-instanciación | `estructural.ts·oracionEstructural` (`es una instancia de` / `son instancias de`) |
| se relaciona con | enlace estructural etiquetado nulo | tagged sin etiqueta de usuario | `procedural.ts·oracionEstructuralEtiquetada` (`se relaciona con` / `se relacionan`) |
| varía de … a | el atributo recorre un rango de valores | rango de atributo | GAP-VARIA |
| es de tipo | la cosa declara su tipo | declaración de tipo | GAP-TIPO |
| puede estar | el objeto enumera sus estados posibles | enumeración de estados (D5, D6) | `duracionMetadata.ts·oracionEstados` (`puede estar`) |
| puede ser | la especialización XOR enumera generales mutuamente excluyentes | especialización XOR (RX1, RX2) | GAP-XOR-FEATURE |
| se descompone | el proceso se descompone (in-zooming) en subprocesos | descomposición síncrona | `refinamiento.ts·oracionRefinamiento` (`se descompone en`) |
| se despliega | la cosa se despliega (unfolding) en refinados | despliegue asíncrono | `refinamiento.ts·oracionRefinamiento` (`se despliega en`) |
| se refina | refinamiento explícito entre OPDs por descomposición | refinamiento inter-OPD | GAP-REFINA |
| se pliega | supresión de hechos refinados en OPD ascendente | plegado | GAP-PLIEGA |
| se recompone | recomposición desde refinados | recomposición | GAP-RECOMPONE |

Notas de traza (literal, lo normativo):
- `cambia` aparece además como `hint` de los enlaces consumo/resultado en `refsHints.ts·hintEnlace`.
- `existe`, `se omite` y `se consume` solo se emiten dentro de plantillas condicionales/excepción, no como oración autónoma. → GENERAR-OPL (inferido: NO emitir como oración autónoma).
- GAP-VARIA, GAP-TIPO, GAP-XOR-FEATURE, GAP-REFINA, GAP-PLIEGA, GAP-RECOMPONE: «el verbo es canónico pero ningún generador de `app/src/opl/generadores/` lo emite hoy». → para la herramienta rehecha: decisión de alcance (ver §GAP-A10).

→ La columna «Traza a código» es **NO-HERRAMIENTA** (v0 deep-opm-pro).

### 2.3 §1.2 Reglas duras `puede estar` vs `puede ser`

- **R-VERB-EST-1** (DEBE): la enumeración de **estados** de un objeto DEBE usar **puede estar**.
  ```
  Correcto: **Pedido** puede estar `pendiente`, `despachado` o `cerrado`.
  Incorrecto: **Pedido** puede ser `pendiente`, `despachado` o `cerrado`.
  ```
  → GENERAR-OPL; PARSEAR-OPL (inferido: `puede ser` + backticks no es enumeración de estados válida).
- **R-VERB-EST-2** (DEBE / NO DEBE): **puede ser** DEBE reservarse a **especialización XOR** (generales mutuamente excluyentes); NO DEBE usarse para enumerar estados.
  ```
  Correcto: **Vehículo** puede ser **Auto** o **Camión**.
  Incorrecto: **Vehículo** puede ser `encendido` o `apagado`.
  ```
  Procedencia: `reglas §4.3` (RX1, RX2), R-OPL-RF-5 («especialización XOR DEBE emitirse con `puede ser` o `puede ser uno de`»). → GENERAR-OPL / PARSEAR-OPL. Ver contradicción GAP-A01 (dirección XOR).

### 2.4 §1.3 Palabras clave y conectores fijos (tabla literal)

| Conector / clave | Significado | Familia(s) | Notas |
| --- | --- | --- | --- |
| si | introduce condición | condición, excepción | — |
| en cuyo caso | introduce consecuencia positiva | condición | — |
| de lo contrario | introduce rama negativa | condición | — |
| de | origen de estado/rango | cambio, rango | — |
| a | destino de estado/rango | cambio, rango | — |
| y / e | conjunción copulativa | enumeraciones AND | `e` ante `i-` / `hi-` |
| o / u | conjunción disyuntiva | enumeraciones OR/XOR | `u` ante `o-` / `ho-` |
| así como | adición heterogénea | exhibición mixta | atributos + operaciones |
| exactamente uno de | operador XOR | abanico XOR | — |
| al menos uno de | operador OR | abanico OR | — |
| al menos otro/a | colección incompleta | agregación/especialización parcial | — |
| un/una opcional | opcionalidad `?` (0..1) | multiplicidad | — |
| al menos un/una | cardinalidad inferior `+` (1..\*) | multiplicidad | — |
| por ruta | etiqueta de ruta | rutas/escenarios | — |
| duración de | magnitud temporal de la fuente | excepción | — |
| excede | sobretiempo | excepción overtime | — |
| es menor que | subtiempo | excepción undertime | — |
| en esa secuencia | orden temporal explícito | descomposición síncrona, tagged ordenado | — |

- **R-VERB-KW-1** (DEBE): las palabras clave fijas DEBEN emitirse exactamente como aparecen, salvo la alternancia morfofonológica `y/e` y `o/u`. → GENERAR-OPL.
- **R-VERB-KW-2** (DEBE): la alternancia `y/e` y `o/u` DEBE decidirse solo por la condición fonética del término siguiente. → GENERAR-OPL (regla: `e` ante palabra que empieza por `i-`/`hi-`; `u` ante `o-`/`ho-`); PARSEAR-OPL (inferido: aceptar ambas alternantes).

Procedencia: `reglas §4.3` (R-OPL-KW-1, R-OPL-KW-2).

### 2.5 §1.4 Divergencias entre fuentes canónicas

- **DIV-1 — Plegado y recomposición**: `se pliega en` y `se recompone desde` PERTENECEN al enum (aporte de `reglas §4.3`), marcados GAP-PLIEGA y GAP-RECOMPONE por ausencia de generador. → PARSEAR-OPL (inferido: tokens reconocidos); GENERAR-OPL opcional (ver §7).
- **DIV-2 — Designaciones de estado como cópulas**: `es inicial`, `es final`, `es por defecto`, `es inicial y final` NO son verbos del enum §1.1; se canonizan como plantillas de designación (D7–D13). → PARSEAR-OPL (inferido: rutas de designación, no de verbo).

---

## 3. §2 Entidades (l. 198–415)

Alcance de la sección: realización OPL de objeto, proceso, estado, atributo/valor, instancia, designación de estado, esencia y afiliación. Las plantillas de enlaces NO pertenecen a §2.

### 3.1 §2.0 Reglas duras transversales

- **R-ENT-1** (DEBE / NO existe): una entidad de modelo DEBE ser **objeto** o *proceso*; NO existe tercera clase de cosa. Un `estado`, un enlace, un **atributo** flotante, un comentario o un afordance de UI NO son cosas. Proc.: `reglas §2.1` (R-COSA-1), `§2.5`. → **MODELO-DATOS** (dos tipos de cosa, sin tercero) + IMPEDIR (atributo flotante).
- **R-ENT-2** (NO DEBE): la generación NO DEBE emitir OPL canónica para una cosa con nombre **placeholder** (objeto/proceso sin nombrar) ni para un `estado` con nombre placeholder. La realización canónica solo procede cuando la cosa tiene nombre canónico. → **GENERAR-OPL** (filtro por nombre placeholder, para objetos, procesos y estados; v0 solo filtra procesos: GAP-PLACEHOLDER-OBJETO).
- **R-ENT-2-APUNTE** (DEBE; excepción de régimen por especie): en una **especie apunte**, R-ENT-2 NO aplica: las cosas con nombre placeholder (objeto, proceso, `estado`) DEBEN emitir su OPL — oración de existencia y enlaces — en **toda la generación, incluida la canónica**. La excepción es de **régimen por especie**, no de superficie: panel, editor libre, exports (Markdown, documento canónico), puente skill (`mesa pull`/contexto W6.0) y lectura móvil emiten el mismo texto. El **diagnóstico** de nominación (`reglas` R-NOM-PROC-1, observación por-clase en apuntes) sigue emitiéndose: la mesa acompaña e invita a nombrar con forma verbal, sin bloquear. Al **graduar** el apunte a modelo, R-ENT-2 vuelve a regir (el régimen lee la especie viva del workspace). La autoría headless (bundles compilados) permanece en régimen riguroso.
  Rationale (resumen): en un boceto el placeholder ES el hecho; el apunte relaja rigor de cierre, no semántica; roundtrip verificado (el parser no filtra placeholders y el canónico de apunte re-parsea con cero patches).
  → **MODELO-DATOS** (el modelo/workspace porta una «especie»: apunte | modelo; operación «graduar») + **GENERAR-OPL** (régimen de filtrado según especie; mismo texto en todas las superficies) + **ADVERTIR** (diagnóstico de nominación no bloqueante) + **PARSEAR-OPL** (el parser no filtra placeholders). Superficies «mesa pull/W6.0», «lectura móvil», «bundles headless» → circunstanciales.
- **R-ENT-3** (DEBE; extensión declarada de superficie — eco OPCloud): la emisión OPFORJA de esencia y afiliación DEBE **componerse en UNA sola oración** con el sustantivo de tipo, coordinadas con «y»:
  ```
  **Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.
  ```
  D1–D4 siguen siendo canónicas y son entrada reverse VÁLIDA (el parser las acepta). La perseverancia (persistente/transitoria), si se emite, va en oración aparte. Producción `(* ext §2.0 *)` en §18 (fuera de tramo).
  ```
  Preferida en emisión OPFORJA: **Sensor** es un objeto físico y ambiental.
  No preferida en emisión (pero canónica por reglas §4.4 y parseable): **Sensor** es física. seguido de **Sensor** es ambiental. (forma atómica escindida D1+D3)
  ```
  Evidencia (no canon): `*Rescatar* es un proceso informacional y sistémico.` «Bajo `solo-difiere` se coordinan solo las propiedades que difieren del default.» G2: aditividad, nunca rechazo de OPL válida.
  → **GENERAR-OPL** (forma combinada) + **PARSEAR-OPL** (aceptar combinada y atómicas D1–D4).

### 3.2 §2.1 Objeto — ENT-OBJ

- **Plantilla**: el **objeto** se nombra como sustantivo singular en negrita; su mención es el span de objeto dentro de cualquier oración. La descripción autónoma se realiza mediante propiedades genéricas (§2.7, §2.8) y, si tiene estados, su enumeración (§2.3).
- **Emisión** (inferido): la presencia de un objeto en un OPD emite las oraciones de esencia/afiliación que apliquen. Un objeto sin propiedades divergentes y sin estados PUEDE no producir oración autónoma alguna; existe solo como span dentro de oraciones de enlace. → GENERAR-OPL.
- **Supresión** (NO DEBE): objeto con nombre placeholder NO DEBE producir OPL canónica (R-ENT-2).
- **Tokenización** (DEBE / PUEDE): nombre = token de objeto con `ref` a la entidad. «Las palabras léxicas DEBEN capitalizarse; artículos y preposiciones breves PUEDEN quedar en minúscula.» → ADVERTIR/normalizar capitalización de nombres; MODELO-DATOS (`ref`).
- **Reverse** (inferido): el span de objeto se parsea como referencia a cosa existente o como creación de cosa nueva, según contexto. El nombre por sí solo no es oración parseable. → PARSEAR-OPL (resolución por nombre, crear si no existe).
- **Roundtrip** (DEBE): el nombre DEBE preservarse íntegro tras generación → parseo → generación.
- GAP-PLACEHOLDER-OBJETO: en v0 los objetos placeholder no se filtran (solo procesos); rige solo en régimen riguroso.

### 3.3 §2.2 Proceso — ENT-PROC

- **Plantilla**: el *proceso* se nombra en cursiva, comenzando con infinitivo `-ar`/`-er`/`-ir` o nominalización `-ción`/`-miento`. → ADVERTIR (inferido; diagnóstico de nominación).
- **Emisión**: igual que objeto (oraciones de esencia/afiliación divergentes) + span en oraciones de transformación, habilitación, evento, condición, refinamiento e invocación. «**OPM no admite estados de proceso**; «iniciado»/«en proceso»/«terminado» NO DEBEN modelarse como estados, sino como subprocesos.» → **IMPEDIR** (estados en proceso) + MÉTODO (subprocesos).
- **Supresión** (NO DEBE): nombres placeholder de proceso literales: `proceso`, `proceso N`, `proceso parte N`.
- **Tokenización**: token de proceso con `ref`. **Reverse**: referencia o creación según contexto. **Roundtrip** (DEBE): nombre preservado íntegro.
- **Edge case**: un *proceso* persistente (mantiene estado sin cambio neto) NO tiene familia verbal propia; su realización canónica reusa TS3 con `estado-entrada = estado-salida`. → GENERAR-OPL (no hay plantilla nueva).

### 3.4 §2.3 Estado y enumeración — ENT-EST (D5, D6)

Plantillas literales:
```
D5: **Objeto** puede estar `estado1`, `estado2` o `estado3`.
D6 (colección incompleta): **Objeto** puede estar `estado1`, …, y otros estados.
```
- **Emisión** (inferido): cuando un objeto tiene `s ≥ 1` estados no suprimidos y todos son canónicos, se emite **una sola** oración de enumeración con `puede estar`. El último estado se une con `o`/`u` según fonética.
- **Supresión**: si algún estado NO es canónico (placeholder), la enumeración NO se emite; emisión atómica **todo-o-nada por objeto**. Un estado individual marcado `suprimido` se excluye del listado. → GENERAR-OPL; MODELO-DATOS (flag `suprimido` por estado).
- **Tokenización**: span objeto con `ref` a entidad; cada `estado` con `ref` al estado. «Los valores de estado van entre backticks, en minúscula, forma pasiva/descriptiva.» → ADVERTIR (inferido: nombre de estado en minúscula, forma descriptiva).
- **R-ENT-EST-1** (DEBE / NUNCA): la enumeración DEBE usar **puede estar**, NUNCA **puede ser** (= R-VERB-EST-1).
- **R-ENT-EST-2** (NO DEBE): un `estado` NO existe fuera de su **objeto** propietario; NO DEBE haber estados flotantes ni estados de *proceso*. → **IMPEDIR** + MODELO-DATOS (estado siempre hijo de objeto).
- **Reverse** (inferido): `puede estar` se parsea como declaración de estados del objeto.
- **Roundtrip** (DEBE): la lista de estados **y su orden** DEBEN preservarse.

### 3.5 §2.4 Designación de estado — ENT-DESIG (D7–D10, D13)

Plantilla literal:
```
Estado `s` de **Objeto** es <designación>.
```
con designación ∈ {`inicial` (D7), `final` (D8), `por defecto` (D9), `inicial y final` (D10), `declarado `Current`` (D13)}.

Expansión (inferida, misma plantilla):
```
D7:  Estado `s` de **Objeto** es inicial.
D8:  Estado `s` de **Objeto** es final.
D9:  Estado `s` de **Objeto** es por defecto.
D10: Estado `s` de **Objeto** es inicial y final.
D13: Estado `s` de **Objeto** es declarado `Current`.
```
- **Emisión** (inferido): una oración por cada estado con designación distinta de normal. Un estado PUEDE ser simultáneamente inicial y final (D10): una sola oración combinada, no dos. → GENERAR-OPL + MODELO-DATOS (designaciones: inicial, final, por defecto, Current; inicial y final combinables).
- **Supresión**: estado normal no produce oración; estado placeholder no la produce.
- **Tokenización**: `inicial`/`final`/`por defecto`/`declarado Current` son palabras clave de designación, no verbos (DIV-2).
- **Reverse / Roundtrip** (DEBE): designación parseable y preservada.

### 3.6 §2.5 Atributo y valor — ENT-ATR

Plantillas literales:
```
Valor puntual: **Atributo** de **Objeto** es valor.
Rango: **Atributo** de **Objeto** varía de X a Y.
Enumeración de valores: **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`.
```
- **Emisión**: el atributo se realiza como cosa-objeto que pertenece al objeto mediante `de`. Si el atributo porta un `valorSlot`, se emite `es valor` (con unidad opcional `[unidad]`). Los `valor` enumerados son **estados** del atributo → reusan `puede estar`. → MODELO-DATOS (atributo = objeto con `valorSlot` opcional y `unidad` opcional) + GENERAR-OPL.
- **R-ENT-ATR-1** (DEBE / NO existe): un **atributo** DEBE modelarse como **objeto** que caracteriza una cosa vía exhibición-caracterización; NO existe atributo flotante. → MODELO-DATOS / IMPEDIR.
- **R-ENT-ATR-2** (DEBE): los valores DEBEN modelarse como **estados** del atributo, y enumerarse con **puede estar**, no con **puede ser**.
  ```
  Correcto: **Limpieza** de **Conjunto de Platos** puede estar `sucia` o `limpia`.
  Incorrecto: **Limpieza** de **Conjunto de Platos** puede ser `sucia` o `limpia`.
  ```
- **Supresión**: sin `valorSlot` no hay `es valor`; placeholder no emite.
- **Tokenización**: spans `ref` a atributo, objeto caracterizado y cada valor/estado. La unidad es span con `hint`, no hecho ontológico.
- **Reverse**: `es valor` → asignación de valor; enumeración reusa `puede estar`. **Roundtrip** (DEBE): atributo, valor y unidad DEBEN preservarse.
- GAP-VARIA: `varía de … a` sin generador.

### 3.7 §2.6 Instancia — ENT-INS

- **Plantilla** (DEBE): «el nombre de una instancia lógica DEBE escribirse `NombreInstancia : NombreClase`». La oración de relación (`es una instancia de`) se canoniza en §6.4. → MODELO-DATOS/ADVERTIR (formato de nombre). GAP-NOMBRE-INSTANCIA: sin composición automática.
- **R-ENT-INS-1** (DEBE): distinguir **instancia visual** (misma cosa con apariencia local en otro OPD) de **instancia lógica** (relación de clasificación-instanciación entre cosas distintas). La instancia visual NO produce oración de instanciación; solo reaparece como span de la misma cosa. → MODELO-DATOS (cosa única ↔ muchas apariencias) + GENERAR-OPL.
- **Supresión**: instancia visual no emite oración propia (la cosa ya se realizó en su OPD origen, «R-PRIN-9 / hecho único»).

### 3.8 §2.7 Esencia (física / informacional) — ENT-ESENCIA (D1, D2)

```
**Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.
```
Atómicas canónicas (reverse válido): D1 `es física` / D2 `es informacional`. Expansión literal inferida: `**Cosa** es física.` / `**Cosa** es informacional.`
- **Emisión**: la esencia entra en la oración combinada si la visibilidad es `siempre`, o si la esencia **difiere del default** (default = informacional). Bajo `solo-difiere`, si solo difiere la esencia: `**Cosa** es un objeto físico.`
- **Supresión**: visibilidad `oculta` → no se emite oración de clasificación. «El default informacional puede derivarse de perfil/preset, pero ese default NO DEBE sobrescribir esencia explícita.» → MODELO-DATOS (esencia explícita vs default) + GENERAR-OPL (modos `siempre`/`solo-difiere`/`oculta`).
- **Roundtrip** (DEBE): esencia preservada.

### 3.9 §2.8 Afiliación (sistémica / ambiental) — ENT-AFILIA (D3, D4)

Misma plantilla combinada. Atómicas: D3 `es ambiental` / D4 `es sistémica` (expansión inferida: `**Cosa** es ambiental.` / `**Cosa** es sistémica.`).
- **Emisión**: si visibilidad `siempre` o afiliación difiere del default (sistémica). Bajo `solo-difiere`: `**Cosa** es un objeto ambiental.`
- **Supresión / coherencia** (DEBE): «Un atributo de objeto ambiental DEBE ser ambiental; un *proceso* ejecutado por cosa ambiental DEBE modelarse ambiental.» → ADVERTIR (coherencia de afiliación).
- **Edge case**: esencia y afiliación en una sola oración; sin coma de Oxford (`{esencia} y {afiliacion}`).
- **Roundtrip** (DEBE): afiliación preservada.

Concordancia inferida de la oración combinada (de los ejemplos): adjetivos en masculino concordando con «objeto/proceso»: `físico`/`informacional`, `sistémico`/`ambiental`; en atómicas D1–D4 el adjetivo aparece en femenino (`física`, `sistémica`).

---

## 4. §3 Enlaces transformadores (l. 417–611)

Marco (NO DEBE): «La generación NO DEBE emitir un verbo transformador fuera de {`consume`, `genera`, `afecta`, `cambia … de … a`}; el parseo NO DEBE reconocer otro verbo como transformador.» Un transformador conecta *proceso* ↔ **objeto** transformado.

### 4.1 §3.0 Asimetría consumo / resultado bajo modificadores

- **R-TR-ASIM-1** (PUEDE): el consumo (T1, TS1) PUEDE portar evento (`e`) o condición (`c`) porque el consumido pertenece a Pre(P).
- **R-TR-ASIM-2** (NO DEBE): el resultado (T2, TS2) NO DEBE portar evento ni condición (resultante ∈ Post(P)).
  ```
  Correcto: **Disparador** inicia *Procesar*, que consume **Disparador**.
  Incorrecto: **Resultado** inicia *Procesar*, que genera **Resultado**.
  ```
- **R-TR-ASIM-3** (PUEDE): el efecto (T3, TS3) sobre un objeto con estados PUEDE portar `e` o `c` (el afectado existe en Pre(P) con su estado de entrada; ET2, CT2).
- **R-TR-ASIM-4** (NO DEBE): el generador NO DEBE producir oración de evento/condición de resultado y el parser NO DEBE construir un enlace de resultado con `e`/`c`; tal entrada es OPL no canónica.
→ **IMPEDIR** (en la UI: no ofrecer `e`/`c` en resultado) + **GENERAR-OPL** (degradar a oración base si llegara) + **PARSEAR-OPL** (rechazar/diagnosticar).

### 4.2 §3.1 Consumo — T1, TS1

```
T1:  *Proceso* consume **Objeto**.
TS1: *Proceso* consume **Objeto** en `estado`.
Plural por multiplicidad: *Proceso* consumen **Objetos**.   (verbo concuerda con el sujeto-proceso múltiple)
```
- **Emisión** (inferido): enlace `consumo` objeto(origen)→proceso(destino) emite `consume`, sujeto = proceso; con estado especificado en el extremo del consumido (TS1) se añade `en `estado``.
- **Supresión**: placeholder no emite (R-ENT-2). Consumo bajo abanico XOR/OR → oración de abanico (fuera de tramo), no T1 individual.
- **Tokenización**: proceso `ref`; `consume` token-verbo; objeto `ref`; estado `ref` (TS1).
- **Orden**: *proceso* → `consume` → **objeto** [→ `en` → `estado`]. «El consumo se interpreta inmediato salvo declaración simultánea de tasa de consumo en el enlace y atributo de cantidad en el objeto.» (semántico, no de superficie).
- **Composabilidad** (NO DEBE): coordinación con sujeto-proceso compartido (§9, fuera de tramo); «La coordinación NO DEBE mezclar consumo con resultado/efecto en un solo predicado.»
- **Reverse**: regex `/^(.+?)\s+consume\s+(.+)$/`, `tipo: "consumo"`, `puertoEsOrigen: false` → enlace `consumo` objeto→proceso; `en `estado`` fija estado del extremo consumido.
- **Roundtrip** (DEBE): fixture `enlace-consumo-simple`, oración `*Procesar* consume **Entrada**.`; nombre, verbo y estado (TS1) DEBEN preservarse.
- **Edge case** (parse legacy): pasiva `**Objeto** es consumido por *Proceso*` es entrada parseable válida, NO forma canónica emitida; el generador siempre emite la activa. → PARSEAR-OPL (circunstancial legacy).

### 4.3 §3.2 Resultado — T2, TS2

```
T2:  *Proceso* genera **Objeto**.
TS2: *Proceso* genera **Objeto** en `estado`.
Plural por multiplicidad: *Procesos* generan **Objeto**.
```
- **Emisión**: enlace `resultado` proceso(origen)→objeto(destino), `genera`, sujeto = proceso; estado en extremo del resultante (TS2) → `en `estado``.
- **Supresión** (NUNCA DEBE): «Un enlace de resultado hacia un **objeto** con estado inicial NUNCA DEBE conectarse directamente al estado inicial (R-RES-1); la emisión refleja la conexión al rectángulo o a un estado distinto del inicial.» → **IMPEDIR/ADVERTIR** (ver GAP-A17: verificar contra reglas).
- **Orden**: *proceso* → `genera` → **objeto** [→ `en` → `estado`]. **Composabilidad**: coordinable por sujeto-proceso; NO DEBE coordinarse con consumo/efecto.
- **Reverse**: `/^(.+?)\s+genera\s+(.+)$/`, `tipo: "resultado"`, `puertoEsOrigen: true`. «El resultado NO DEBE parsearse con modificador `e`/`c`.»
- **Roundtrip**: fixture `enlace-resultado-simple`, `*Procesar* genera **Salida**.`
- **Edge**: pasiva legacy `**Objeto** es generado por *Proceso*` parseable (`puertoEsOrigen: false`), no canónica.

### 4.4 §3.3 Efecto — T3

```
T3: *Proceso* afecta **Objeto**.
Plural por multiplicidad: *Procesos* afectan **Objeto**.
```
- **Emisión**: enlace `efecto` sin estado especificado en ningún extremo → `afecta`, sujeto = proceso. «El efecto REQUIERE un **objeto** con al menos un estado definido (R-EFE-1)»; una vez iniciado el afector, el afectado DEBE salir del estado de entrada (R-EFE-2) y solo alcanza el de salida al completarse (R-EFE-2A). → **ADVERTIR/IMPEDIR** (efecto sobre objeto sin estados); R-EFE-2/2A semántica de ejecución (NO-HERRAMIENTA salvo simulación, no exigida aquí).
- **Supresión**: placeholder no emite. Si porta estados especificados, NO se emite T3 sino TS3/TS4/TS5.
- **Orden**: *proceso* → `afecta` → **objeto**. **Composabilidad**: NO DEBE coordinarse con consumo/resultado.
- **Reverse**: `/^(.+?)\s+afecta\s+(.+)$/`, `tipo: "efecto"`, `puertoEsOrigen: true`.
- **Roundtrip**: fixture `enlace-efecto-simple`; verbo y nombres DEBEN preservarse.
- **Edge**: proceso persistente → TS3 con `estado-entrada = estado-salida` (R-OPL-PERSIST-2), no T3.

### 4.5 §3.4 Efecto entrada-salida — TS3

```
TS3: *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`.
Variante evento: **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`.
Variante condición: *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite.
Variante negada (extensión declarada): *Proceso* no cambia **Objeto** de `estado-entrada` a `estado-salida`.
```
- Variante negada: NO es canon ISO; realiza el modificador `no` del kernel (negación del enlace; condición/instrumento sobre estado no-existente, enlace NOT compacto). Extensión declarada en `spec-forja-opd-es` (R-OPD-CTL-5) con kernel en `metodologia-forja-es §NOT`; en OPCloud la negación es flag ortogonal a `c`/`e`, mientras el kernel de la app la trata como **tercer modificador excluyente** — divergencia declarada. **Emisión-only**: sin ruta de parseo (GAP-NEGADA-REVERSE). Aplica igual a variantes negadas de §4.1 y §4.2. → GENERAR-OPL (PUEDE, extensión); MODELO-DATOS (modificador ∈ {ninguno, e, c, no}, excluyentes). Ver GAP-A05.
- **Emisión**: efecto con estado en entrada y salida → verbo compuesto `cambia … de … a`; `e`/`c` reescribe según variantes (admisible, R-TR-ASIM-3).
- **Supresión**: placeholder no emite. Bajo abanico XOR/OR de estados de destino **sin** entrada común → oración de abanico unilateral (`cambia … a exactamente uno de …`); cuando todas las ramas TS3 comparten entrada y difieren por la salida → forma de entrada común de R-FAN-5A (`cambia … de … a exactamente uno de …`) (fuera de tramo).
- **Tokenización**: `cambia` + `de` + `a` tokens fijos; `estado-entrada` y `estado-salida` con `ref` cada uno.
- **Orden** (fijo, portador de dirección): *proceso* → `cambia` → **objeto** → `de` → `estado-entrada` → `a` → `estado-salida`. Invertirlo cambia el hecho.
- **Composabilidad** (NO DEBE): TS3 NO DEBE coordinarse con consumo/resultado; fan de estados de salida → abanico.
- **Reverse**: regex de cambio completo:
  ```
  /^(.+?)\s+cambia\s+(.+?)\s+de\s+`?([^`]+?)`?\s+a\s+`?([^`]+?)`?$/
  ```
  construye `efecto` con ambos estados especificados; abanico de cambio por `ABANICO_CAMBIA_RE`.
- **Roundtrip** (DEBE): proceso, objeto, ambos estados y su orden. Fixtures estrictas `cambio-estado-ts3` y `cambio-estado-ts3-compacto`: «el patch preserva arcos y `stateHints`, y el aplicador reconstruye los estados necesarios desde modelo vacío». → PARSEAR-OPL: parsear TS3 sobre modelo vacío DEBE crear objeto y estados faltantes (inferido).
- **Edge**: si el modelo se descompone, TS3 se escinde en TS4+TS5 y deja de emitirse como una sola oración.

### 4.6 §3.5 Solo entrada — TS4

```
TS4: *Proceso* cambia **Objeto** de `estado-entrada`.
```
**Doble régimen (R-ESCIND-0)**, misma superficie:
- **(a) fragmento escindido**: mitad temprana de un par acoplado producido al descomponer un TS3; saca al objeto del `estado-entrada`. Solo tiene sentido junto a su TS5 tardío. NO DEBE portar modificador de control (R-ESC-1). NUNCA se origina por parseo de OPL aislado: solo por la operación de descomposición, y persiste con metadato de procedencia.
- **(b) efecto parcial standalone**: efecto completo cuya salida, si no se especifica, se resuelve al estado por defecto del objeto o, en su ausencia, a la distribución de probabilidad de estados (R-EFE-3). Admite evento/condición (ETS3, ETS4).
- **Emisión**: efecto con estado solo en entrada (origen) → `cambia … de `estado`` sin destino. **Supresión** (NO DEBE): fragmento (a) sin modificadores.
- **Orden**: *proceso* → `cambia` → **objeto** → `de` → `estado-entrada`.
- **Composabilidad** (DEBE): el fragmento (a) DEBE acoplarse con su TS5; no se coordina como predicado independiente.
- **Reverse**: el parser produce SIEMPRE el régimen **(b)**; (a) NUNCA proviene de parseo. Fixture estricta `cambio-estado-ts4-solo-entrada`.
- GAP-PROCEDENCIA-ESCIND: la spec «aún no exige un metadato normativo que marque la escisión original». → MODELO-DATOS (inferido: marca de procedencia «escindido» en el enlace; ver GAP-A13).

### 4.7 §3.6 Solo salida — TS5

```
TS5: *Proceso* cambia **Objeto** a `estado-salida`.
```
- **Régimen**: mitad tardía del par escindido (R-ESCIND-3): pone al objeto en `estado-salida`. Como fragmento NO DEBE portar modificador de control (R-ESC-1). Como efecto parcial standalone solo-salida es válido y PUEDE portar evento/condición.
- **Emisión**: estado solo en extremo de salida (destino) → `cambia … a `estado``.
- **Orden**: *proceso* → `cambia` → **objeto** → `a` → `estado-salida`. «El token `a` (no `de`) marca el régimen solo-salida; la asimetría con TS4 es portadora del hecho.»
- **Composabilidad** (DEBE): como fragmento DEBE acoplarse con su TS4.
- **Reverse**: parser acepta la forma standalone `cambia … a `estado`` sin `de`; fixture estricta `cambio-estado-ts5-solo-salida`.

---

## 5. §4 Enlaces habilitadores (l. 613–714)

Marco (DEBE / NO DEBE): habilitador conecta **objeto** (origen) → *proceso* (destino); DEBE estar presente para que el proceso se ejecute, pero NO se transforma. «La generación NO DEBE emitir un verbo habilitador fuera de {`maneja`, `requiere`}; el parseo NO DEBE reconocer otro verbo como habilitador.»

### 5.1 §4.0 Reglas duras — agente vs instrumento

- **R-HAB-AG-1** (DEBE): el enlace de **agente** y el término «agente» DEBEN reservarse EXCLUSIVAMENTE para humanos o grupos de humanos. Un agente modifica el *qué* del proceso (juicio, decisión, intención). Visual: piruleta NEGRA en extremo proceso. → MÉTODO + ADVERTIR (la herramienta no sabe si una cosa es humana; ver GAP-A14).
- **R-HAB-AG-2** (DEBE / NUNCA): robots, agentes de software, IA y máquinas DEBEN modelarse como **instrumento**, NUNCA como agente, en OPD/OPL canónico. Una descripción externa PUEDE llamar «agente» a un software, pero la realización canónica DEBE clasificarlo como instrumento. Visual: piruleta BLANCA.
  ```
  Correcto: *Procesar* requiere **Modelo de Lenguaje**.
  Incorrecto: **Modelo de Lenguaje** maneja *Procesar*.
  ```
  → MÉTODO (+ ADVERTIR heurístico opcional).
- **R-HAB-AG-3** (DEBE): un instrumento NO se consume ni cambia de estado por el proceso que habilita; DEBE estar presente durante toda la ejecución. Si un habilitador deja de existir durante la ejecución, el proceso DEBE detenerse y el estado del afectado queda indeterminado. → MODELO-DATOS (enlace habilitador no porta transición de estado; solo estado de requisito HS*) ; semántica de ejecución: NO-HERRAMIENTA.
- **R-HAB-AG-4** (DEBE / DEBERÍA): cuando el desgaste/degradación/amortización del instrumento es relevante, DEBE reclasificarse como afectado (enlace de efecto). El modelo DEBERÍA agregar atributo de degradación y proceso de mantenimiento separado; si el mantenimiento queda fuera del alcance, el modelo DEBE declarar esa exclusión. → MÉTODO; OPERACIÓN (inferido: cambiar tipo de enlace instrumento→efecto).
- **R-HAB-AG-5** (DEBE / NO DEBE): un objeto y un proceso DEBEN conectarse por **a lo más un** enlace procedimental. Ante colisión de roles, el transformador (consumo/resultado/efecto) tiene mayor fuerza semántica que el habilitador. Un mismo objeto NO DEBE ser simultáneamente habilitador y transformado del mismo proceso en el mismo nivel. → **IMPEDIR** (segundo enlace procedimental entre el mismo par objeto–proceso en el mismo nivel; al colisionar, prevalece el transformador).

### 5.2 §4.1 Agente — H1, HS1

```
H1:  **Agente** maneja *Proceso*.
HS1: **Agente** en `estado` maneja *Proceso*.
Plural por multiplicidad: **Agentes** manejan *Proceso*.   (verbo concuerda con el sujeto-agente múltiple)
Variante evento (EH1): **Agente** inicia y maneja *Proceso*.
Variante condición (CH1/CS5): **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite. · **Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite.
Variante negada (extensión declarada; emisión-only, GAP-NEGADA-REVERSE): **Agente** no maneja *Proceso*.
```
- **Emisión**: enlace `agente` objeto humano(origen)→proceso(destino) → `maneja`, sujeto = agente; HS1: `en `estado`` tras el objeto.
- **Supresión**: placeholder no emite; bajo abanico XOR/OR → oración de abanico (`maneja exactamente uno de …` / fan inverso).
- **Orden** (portador de rol): **agente** [→ `en` → `estado`] → `maneja` → *proceso*. Invertirlo convierte al agente en complemento.
- **Composabilidad** (NO DEBE): coordinación de habilitadores con proceso compartido (`**A** maneja *P*.` / `**B** maneja *P*.`); NO DEBE mezclar agente con instrumento en un predicado; fan bajo operador lógico → abanico.
- **Reverse**: `/^(.+?)\s+maneja\s+(.+)$/`, `tipo: "agente"`, `puertoEsOrigen: true`; forma condicional por `CONDICION_AGENTE_RE` (existe / `está en `estado``).
- **Roundtrip** (DEBE): fixture `enlace-agente-simple`, `**Operador** maneja *Procesar*.`; nombre, verbo y estado (HS1).
- **Edge**: pasiva legacy `*Proceso* es manejado por **Agente**` parseable (`puertoEsOrigen: false`), no canónica.

### 5.3 §4.2 Instrumento — H2, HS2

```
H2:  *Proceso* requiere **Instrumento**.
HS2: *Proceso* requiere **Instrumento** en `estado`.
Plural por multiplicidad: *Procesos* requieren **Instrumento**.   (verbo concuerda con el sujeto-proceso múltiple)
Variante evento (EH2): **Instrumento** inicia *Proceso*, que requiere **Instrumento**.
Variante condición (CH2/CS6): *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite. · *Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite.
Variante negada (extensión declarada; emisión-only, GAP-NEGADA-REVERSE): *Proceso* no requiere **Instrumento**.
```
- **Emisión**: enlace `instrumento` objeto no humano(origen)→proceso(destino) → `requiere`, sujeto = proceso; HS2: `en `estado`` tras el objeto.
- **Supresión**: placeholder no emite; abanico → `exactamente uno de … requiere **B**`; reclasificado por desgaste (R-HAB-AG-4) → familia de efecto.
- **Orden** (NO DEBE igualarse): *proceso* → `requiere` → **instrumento** [→ `en` → `estado`]. «esta asimetría sujeto-verbo es portadora de la distinción humano/no-humano y NO DEBE igualarse.»
- **Composabilidad** (NO DEBE): `*P* requiere **A**.` / `*P* requiere **B**.` coordinables; NO DEBE mezclar instrumento con agente ni con transformadores.
- **Reverse**: `/^(.+?)\s+requiere\s+(.+)$/`, `tipo: "instrumento"`, `puertoEsOrigen: false`; condicional por `CONDICION_OCURRE_RE` con `base: "instrumento"`; plurales `requieren?`.
- **Roundtrip** (DEBE): fixture `enlace-instrumento-simple`, `*Procesar* requiere **Herramienta**.`
- **Edge**: pasiva legacy `**Instrumento** es requerido por *Proceso*` parseable, no canónica. **Forma posesiva**: cuando el verbo del instrumento expresa conducción/manejo (`manejar`/`conducir`), `oracionInstrumentoPosesiva` PUEDE emitir una superficie alterna (sin plantilla dada) — «realización condicionada por el verbo léxico, no la canónica `requiere`». → PUEDE; ver GAP-A06.

### 5.4 §4.3 GAPs habilitadores

- GAP-FIXTURE-HS: cerrado para HS1/HS2 (`habilitador-con-estado-hs`); variantes evento/condición/negada cubiertas por tests, no fixture estricta.
- GAP-FIXTURE-ABANICO-HABILITADOR: parser de fan de instrumento/agente e inversos (`requiere`, `es requerido por`, `maneja`, `es manejado por`) + cuantificador XOR/OR verificado, sin fixture estricta. → NO-HERRAMIENTA (bookkeeping v0); para el rehecho implica: PARSEAR-OPL abanicos de habilitador (plantillas fuera de tramo).

---

## 6. §5 Modificadores de control, excepción e invocación (l. 716–942)

Marco: modificadores = evento `e`, condición `c` sobre transformadores y habilitadores. Excepción (`/` sobretiempo, `//` subtiempo) e invocación (IV1, IV2) son **familias de enlace autónomas** colocadas aquí por afinidad. «Un modificador NO es una familia de enlace: anota un enlace base preexistente».

### 6.1 §5.0 Reglas duras transversales

Los modificadores `e` y `c` son **anotaciones INPUT-only** (solo Pre(P), nunca Post(P)).
- **R-MOD-NAT-1** (NO DEBE): un modificador `e`/`c` NO DEBE introducirse como cosa ni como enlace nuevo; anota un enlace base y preserva su firma, verbo y cardinalidad. La generación NO DEBE emitir un constructo de control que agregue entidades de modelo. → **MODELO-DATOS**: modificador = atributo del enlace, no entidad.
- **R-MOD-NAT-2** (DEBE / NO DEBE): semántica de falla distinguida en superficie. Enlace con `c` → rama `de lo contrario *Proceso* se omite` (bypass). Enlace SIN modificador NO DEBE emitir esa rama (espera indefinida). El evento `e` se realiza con `inicia` y se pierde tras la evaluación aunque la precondición falle. → GENERAR-OPL.
- **R-MOD-INPUT-1** (DEBE / NO DEBE): `e`/`c` DEBEN aplicarse exclusivamente sobre enlaces cuyo extremo objeto/estado pertenece a Pre(P) (consumido, afectado pre-transición, agente, instrumento). NO DEBEN aplicarse sobre Post(P) (resultante, afectado post-transición). → **IMPEDIR**.
- **R-MOD-INPUT-2** (NUNCA DEBE / NO DEBE): el resultado (T2, TS2) NUNCA DEBE portar `e` ni `c`; generación NO DEBE emitir evento/condición de resultado; parser NO DEBE construir resultado con modificador.
  ```
  Correcto: **Disparador** inicia *Procesar*, que consume **Disparador**.
  Incorrecto: **Resultado** inicia *Procesar*, que genera **Resultado**.
  ```
  → IMPEDIR + GENERAR-OPL + PARSEAR-OPL (duplica R-TR-ASIM-2/4).
- **R-MOD-CAT-1** (NO DEBE / DEBE): `e`/`c` NO DEBE anotar un enlace **estructural** ni de **invocación** (errores de categoría AP-09, AP-10). El control proceso→proceso DEBE expresarse con nodo de decisión booleano, no con `e`/`c` sobre la invocación. → IMPEDIR; MÉTODO (nodo de decisión).
- **R-MOD-CAT-2** (NO DEBE): modificador de control NO DEBE anotar un enlace **escindido** (TS4/TS5 como fragmento de un par). → IMPEDIR (requiere saber que es fragmento: GAP-A13).
- **R-MOD-CAT-3** (NO DEBE): la combinación `c` + `e` sobre el mismo enlace NO está canonizada; la generación NO DEBE emitirla y el parser NO DEBE construirla. → IMPEDIR + MODELO-DATOS (modificador único, excluyente).

### 6.2 §5.1 Evento — E*

IDs: ET1 (consumo), ET2 (efecto), EH1 (agente), EH2 (instrumento), ETS1–ETS4 (con estado de consumo/cambio), EHS1–EHS2 (habilitador con estado).
```
ET1 (consumo): **Objeto** inicia *Proceso*, que consume **Objeto**.
ET2 (efecto): **Objeto** inicia *Proceso*, que afecta **Objeto**.
EH1 (agente): **Agente** inicia y maneja *Proceso*.
EH2 (instrumento): **Instrumento** inicia *Proceso*, que requiere **Instrumento**.
ETS1 (consumo en estado): **Objeto** en `estado` inicia *Proceso*, que consume **Objeto**.
ETS2 (cambio entrada-salida): **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`.
ETS3 (solo entrada): **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada`.
ETS4 (solo salida): **Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a `estado-destino`.
EHS1 (agente en estado): **Agente** en `estado` inicia y maneja *Proceso*.
EHS2 (instrumento en estado): **Instrumento** en `estado` inicia *Proceso*, que requiere **Instrumento** en `estado`.
```
- **Emisión**: transformador (consumo/efecto) o habilitador con `e` → oración de evento de su tipo. El disparador se nombra una vez como sujeto de `inicia` y reaparece en la cláusula relativa. El agente colapsa disparo y habilitación en `inicia y maneja`.
- **Supresión**: placeholder no emite. Evento de efecto bajo abanico XOR/OR con objeto común y procesos alternativos:
  ```
  **B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.
  ```
  (no E* individual).
- **Tokenización**: disparador con `ref` al extremo Pre(P); `inicia` (o `inicia y maneja`) token de evento; cláusula relativa reusa tokens del enlace base; estado con `ref`. «El sufijo de probabilidad (`Pr=p`) es un span con `hint`, no un hecho ontológico nuevo.»
- **Orden**: disparador → `inicia` [`y maneja`] → *proceso* → (`, que` + verbo base + objeto). Invertir cambia quién dispara.
- **Composabilidad** (NO DEBE): múltiples eventos al mismo proceso = semántica OR (cualquiera dispara). Un evento NO DEBE coordinarse en un predicado con un enlace sin control del mismo proceso.
- **Reverse**: la oración de evento → enlace base con `modificador: "e"`; ETS1/ETS2 reconstruyen el estado del extremo Pre(P).
- **Roundtrip** (DEBE): disparador, verbo base, proceso y estados DEBEN preservarse. Fixture `evento-consumo-canonico`.
- **Edge**: ET2 admisible (R-MOD-INPUT-1). GAP-EVENTO-RESULTADO cerrado: evento sobre resultado se degrada a oración base de resultado (`**X** inicia *Proceso*, que genera **X**` ya no se exporta). GAP-EVENTO-INVOCACION cerrado: evento sobre invocación se degrada a invocación base (`**X** inicia e invoca *Y*` ya no se exporta). → GENERAR-OPL: degradación defensiva (inferido).

### 6.3 §5.2 Condición — C*

IDs: CT1, CT2, CH1, CH2, CS1–CS6.
```
CT1 (consumo): *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.
CT2 (efecto): *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite.
CH1 (agente): **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.
CH2 (instrumento): *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite.
CS1 (consumo en estado): *Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.
CS2 (cambio entrada-salida en estado): *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite.
CS3 (cambio solo entrada): *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada`, de lo contrario *Proceso* se omite.
CS4 (cambio solo salida): *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a `estado-salida`, de lo contrario *Proceso* se omite.
CS5 (agente en estado): **Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite.
CS6 (instrumento en estado): *Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite.
```
- **Estructura de ramas** (DEBE): rama positiva + rama negativa. Positiva (si hay transformación visible) con `en cuyo caso` y realiza el enlace base (consumo: `**Objeto** se consume`; efecto: `*Proceso* afecta **Objeto**`; cambio: `*Proceso* cambia **Objeto** …`). Negativa con `de lo contrario` y DEBE ser `*Proceso* se omite`. Habilitador (CH1/CH2/CS5/CS6) omite la rama positiva.
- **R-COND-RAMA-1** (DEBE / NO DEBE): la rama negativa de toda condición DEBE ser `de lo contrario *Proceso* se omite`; NO DEBE expresar espera ni transformación alterna.
- **R-COND-RAMA-2** (DEBE): la rama positiva de consumo DEBE usar pasiva refleja `se consume` (no `es consumido`); efecto y cambio DEBEN usar voz activa con el proceso como sujeto.
  ```
  Correcto: *Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.
  Incorrecto: *Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** es consumido, de lo contrario *Procesar* se omite.
  ```
- **Emisión**: con estado en extremo Pre(P) → variante CS* (`está en `estado``); sin estado → CT*/CH* (`existe`).
- **Supresión**: placeholder no emite; fan condicional XOR/OR → cláusula `si … existe/está en estado … de lo contrario … se omite` sobre la oración de abanico.
- **Orden**: consumo/efecto/instrumento: *proceso* → `ocurre si` → extremo → (`existe` | `está en `estado``) → [`en cuyo caso` + transformación] → `de lo contrario` → *proceso* → `se omite`. Agente: **agente** → `maneja` → *proceso* → `si` → **agente** → (`existe` | `está en `estado``) → `de lo contrario` → *proceso* → `se omite`.
- **Composabilidad** (DEBE / NO DEBE): múltiples condiciones al mismo proceso: AND para ejecutar (todas DEBEN cumplirse), OR para omitir. Una condición NO DEBE coordinarse con enlace sin control.
- **Reverse**: → enlace base con `modificador: "c"`; tests cubren CT1, CT2, CH2, CS1, CS2, CS3; agente por `CONDICION_AGENTE_RE`; instrumento por `CONDICION_OCURRE_RE` `base: "instrumento"`.
- **Roundtrip** (DEBE): proceso, extremo, verbo base, estados y ambas ramas. **R-OPL-COND-ALT-1** (DEBE aceptarse en parseo) / **R-OPL-COND-ALT-2** (NO DEBE preferirse en emisión; el generador DEBE preferir CT1). Forma alternativa literal:
  ```
  Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*
  ```
  → PARSEAR-OPL.
- **Edge**: CT2, CS2–CS4 admisibles. GAP-CONDICION-RESULTADO cerrado (degrada a base; `puede generarse` ya no se exporta). GAP-CONDICION-INVOCACION cerrado (degrada; `*X* invoca *Y* si *X* ocurre` ya no se exporta).

### 6.4 §5.3 Excepción — EX1 (sobretiempo `/`), EX2 (subtiempo `//`)

```
EX1 (sobretiempo): *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo.
EX2 (subtiempo): *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo.
Variante combinada (extensión local): *Manejo* ocurre si duración de *Fuente* es menor que mín-duración o excede máx-duración.
```
- **Naturaleza**: NO es modificador `e`/`c`; es la **familia de excepción procedimental** (`reglas §5.1`, familia 4; R-EXC-1B), firma proceso→proceso, *fuente* → *manejo*, disparada por desviación temporal. Sobretiempo `/`, subtiempo `//`. → MODELO-DATOS (tipos de enlace `excepcionSobretiempo`, `excepcionSubtiempo` y, por extensión, `excepcionSubSobretiempo`).
- **R-EXC-AMBIENTAL-1** (DEBE): el proceso de manejo DEBE ser **ambiental**. La fuente pertenece al sistema; el manejo vive en el entorno.
  ```
  Correcto: *Manejar Excepción* ocurre si duración de *Procesar* excede 5 minutos. (con *Manejar Excepción* declarado ambiental)
  ```
  → ADVERTIR (o fijar afiliación ambiental al crear el enlace, inferido).
- **R-EXC-DUR-1** (EXIGE ≡ DEBE): EX1 EXIGE duración máxima declarada de la fuente; EX2 EXIGE duración mínima. Sin la cota, la emisión cae al respaldo (`su duración máxima` / `su duración mínima`). → MODELO-DATOS (duración mín/máx + unidad en proceso) + ADVERTIR + GENERAR-OPL (respaldo). Superficie de respaldo inferida: `*Manejo* ocurre si duración de *Fuente* excede su duración máxima.` / `… es menor que su duración mínima.`
- **Emisión**: `excepcionSobretiempo` → `… excede <valor> <unidad>`; `excepcionSubtiempo` → `… es menor que <valor> <unidad>`; manejo = sujeto (`ocurre`), fuente tras `duración de`. «La unidad temporal del sistema es default; un *proceso* con unidad distinta DEBE declararla (R-EXC-5).» → MODELO-DATOS (unidad temporal del sistema + override por proceso).
- **Supresión** (NUNCA DEBE): placeholder no emite; `e`/`c` NUNCA DEBE anotar una excepción. → IMPEDIR.
- **Orden** (NO DEBE intercambiarse): *manejo* → `ocurre si duración de` → *fuente* → (`excede` | `es menor que`) → valor → unidad.
- **Composabilidad** (PUEDE): una fuente PUEDE tener sobretiempo y subtiempo simultáneos; variante combinada con `o`. No se coordina con transformadores/habilitadores.
- **Reverse**: EX1 (`… excede 5 minutos`), EX2 (`… es menor que 30 segundos`) → enlace de excepción con cota y unidad.
- **Roundtrip** (DEBE): manejo, fuente, dirección, valor y unidad.
- **Nota de realización** (DEBE): `unidades-tiempo` es metavariable; la superficie DEBE realizarla como `<valor> <unidad>` cuando ambos existen; sin cota, la frase de respaldo preserva el tipo sin inventar duración (GAP-EXC-UNIDADES-LITERAL cerrado).

### 6.5 §5.4 Invocación — IV1, IV2

```
IV1 (invocación): *Invocador* invoca *Invocado*.
IV1 con demora (extensión local): *Invocador* invoca *Invocado* después de <demora>.
IV2 (autoinvocación): *Invocador* se invoca a sí mismo.
IV2 con demora (extensión local): *Invocador* se invoca a sí mismo después de <demora>.
Abanico XOR divergente: *P* invoca exactamente uno de *Q* o *R*.
Abanico XOR convergente: Exactamente uno de *P* o *Q* invoca *R*.
```
- **Naturaleza**: familia procedimental autónoma proceso→proceso; decorada con rayo (zigzag). Autoinvocación = bucle sobre sí mismo.
- **R-IV-1** (DEBE / NO DEBE): firma *proceso* → *proceso*; NO DEBE conectar un objeto. → IMPEDIR.
- **R-IV-2** (NO DEBE): la invocación implícita (terminación de un subproceso que dispara al inmediatamente inferior por posición vertical dentro de una descomposición) NO DEBE dibujarse como enlace explícito ni emitir oración IV1 propia; subprocesos con borde superior a la misma altura inician en paralelo. → RENDERIZAR + GENERAR-OPL (orden implícito por posición vertical; ver §7.1).
- **R-IV-3** (NO DEBE / DEBE): la invocación NO DEBE portar `e`/`c`; control de flujo entre procesos DEBE expresarse con nodo de decisión booleano. → IMPEDIR.
- **Emisión**: `invocacion` entre dos procesos distintos → `invoca` (`invocan` plural por multiplicidad); `demora` → `después de <demora>`; origen = destino (`esAutoInvocacion`) → `se invoca a sí mismo`. → MODELO-DATOS (demora opcional en enlace de invocación; autoinvocación = enlace con origen=destino).
- **Supresión**: placeholder no emite; implícita no emite; fan XOR/OR → abanico.
- **Tokenización**: `después de <demora>` span con `hint`; parser acepta `despues de` (legacy).
- **Orden**: *invocador* → `invoca` → *invocado* [→ `después de` → demora]; en autoinvocación el invocado no se nombra dos veces.
- **Composabilidad**: varias invocaciones del mismo invocador = oraciones IV1 separadas; bajo operador lógico → abanico; no se coordina con transformadores/habilitadores.
- **Reverse**: `*X* invoca *Y*` → invocación; `*X* se invoca a sí mismo` → autoinvocación; abanico por ruta de abanico.
- **Roundtrip** (DEBE): invocador, invocado y demora. Fixtures `invocacion-con-demora-tilde`, `autoinvocacion-con-demora-tilde`, `evento-invocacion-degrada-base`.
- **Edge**: grafía canónica `después de`. `inicia e invoca` e `invoca … si … ocurre` VIOLAN R-IV-3 / R-MOD-CAT-1; no se exportan; se degrada a invocación base.

### 6.6 §5.5 GAPs (todos cerrados en v0)

GAP-EVENTO-RESULTADO / GAP-CONDICION-RESULTADO / GAP-EVENTO-INVOCACION / GAP-CONDICION-INVOCACION / GAP-FIXTURE-EVENTO / GAP-FIXTURE-INVOCACION / GAP-EXC-UNIDADES-LITERAL / GAP-INVOCACION-TILDE: cerrados. → NO-HERRAMIENTA (bookkeeping); su contenido normativo ya está arriba.

---

## 7. §6 Enlaces estructurales (l. 944–1183)

Marco (NO DEBE): relaciones fundamentales RF1 (agregación), RF2/RF2b (exhibición), RF3/RF3b + RX1/RX2 + RH1 (generalización), RF4/RF4b (clasificación) y etiquetados SE1–SE5 + SSE1–SSE7. Un enlace estructural es **invariante en el tiempo** y conecta cosa↔cosa (no proceso↔objeto, salvo exhibición). Firma: origen = vértice del triángulo (todo, exhibidor, general, clase); destino = base (partes, rasgos, especializaciones, instancias). «La generación NO DEBE emitir un verbo estructural fuera de {`consta de`, `exhibe`, `tiene un … opcional` (extensión declarada, §6.2 RF2o), `es un`/`son`, `puede ser`/`puede ser uno de`, `es una instancia de`/`son instancias de`, etiqueta-de-usuario, `se relaciona con`/`se relacionan`}; el parseo NO DEBE reconocer otro verbo como estructural.»

### 7.1 §6.0 Reglas duras transversales

- **R-EST-PERS-1** (DEBE / NO DEBE): salvo exhibición, refinable y refinadores DEBEN tener la misma **perseverancia** (objeto↔objeto, proceso↔proceso) en agregación, generalización y clasificación. NO DEBE agregarse un proceso a un objeto ni viceversa. → **IMPEDIR**.
- **R-EST-PERS-2** (PUEDE): exhibición es la ÚNICA que PUEDE mezclar perseverancias; mezclas válidas: objeto exhibe atributo, objeto exhibe operación, proceso exhibe atributo, proceso exhibe operación. → IMPEDIR (otras mezclas) (inferido).
- **R-EST-DIR-1** (DEBE): la oración estructural fundamental se emite en dirección vértice → base, pero la superficie invierte el sujeto según relación: agregación y exhibición ponen al **vértice** como sujeto (`**Todo** consta de …`, `**Exhibidor** exhibe …`); generalización y clasificación ponen la **base** como sujeto (`**Especialización** es un **General**`, `**Instancia** es una instancia de **Clase**`). El generador DEBE respetar esta inversión. → GENERAR-OPL + PARSEAR-OPL.
- **R-EST-HER-1** (NO DEBE / PUEDE): una especialización hereda del general todas las partes, rasgos, etiquetados y enlaces procedimentales; los heredados NO DEBEN dibujarse como enlaces explícitos duplicados ni emitir OPL propia, salvo que la herramienta los marque como vista derivada no nuclear. → GENERAR-OPL + RENDERIZAR (no duplicar); vista derivada = PUEDE.

### 7.2 §6.1 Agregación-participación — RF1, RF1i

```
RF1: **Todo** consta de **Parte1**, **Parte2** y **Parte3**.
Plural por multiplicidad del todo: **Todos** constan de **Parte1** y **Parte2**.
RF1i (colección incompleta): **Todo** consta de **Parte1**, **Parte2** y al menos otra parte.
```
- **Emisión**: enlace `agregacion` todo(origen, vértice)→partes(destino, base) → `consta de`, todo = sujeto; concuerda `consta`/`constan`; partes separadas por coma, última con `y`/`e`.
- **Supresión**: placeholder no emite; enlace heredado no emite (R-EST-HER-1).
- **Orden**: **todo** → `consta de` → lista de partes.
- **Composabilidad**: **destino-enumerado**: múltiples `agregacion` desde el mismo todo → una sola oración con lista coordinada (no RF1 por parte). NO DEBE coordinarse con exhibición/generalización/clasificación. **Zona prohibida** (NO DEBE): la enumeración NO DEBE agruparse cuando el enlace participa de contexto de descomposición/despliegue; ahí se emite por enlace (§7.7).
- **Reverse**: `^(.+?) consta de (.+)$`, `tipo: "agregacion"` → enlaces `agregacion` todo→cada parte.
- **Edición** (DEBERÍA / PUEDE): agregar una parte DEBERÍA extender la lista de la oración en su lugar; quitar la última parte PUEDE colapsar la oración. → OPERACIÓN (edición OPL).
- **Roundtrip** (DEBE): el todo, el orden de las partes y la marca de colección incompleta DEBEN preservarse. v0: RF1i sin implementación ni fixture. → MODELO-DATOS (flag «colección incompleta» en el conjunto de agregación; orden de partes).

### 7.3 §6.2 Exhibición-caracterización — RF2, RF2b, RF2o

```
RF2: **Exhibidor** exhibe **Atributo1** y **Atributo2**.
RF2b (heterogénea): **Exhibidor** exhibe **Atributo1** así como *Operación1*.
RF2o (rasgo opcional — extensión declarada de producto): **Exhibidor** tiene un **Rasgo** opcional.
Plural por multiplicidad del exhibidor: **Exhibidores** exhiben **Rasgo**.
```
- RF2o: «El verbo `tiene` NO existe en `reglas` ni en `opm-opl-es` (la base realiza `?` como restricción de participación `un/una opcional` dentro de la oración existente, R-§18-PART-1); OPFORJA lo declara como extensión de superficie con producción `(* ext §6.2 *)` en §18.»
- **Emisión**: `exhibicion` exhibidor(origen)→rasgos(destino) → `exhibe`; destino con multiplicidad `?`/`0..1` → `tiene un **Rasgo** opcional` en vez de `exhibe`; heterogéneos con `así como`.
- **Supresión**: placeholder no emite; admite mezcla de perseverancias (4 mezclas).
- **Tokenización**: `así como` conector; `opcional` portador de multiplicidad `?`.
- **Orden**: **exhibidor** → `exhibe` → rasgos [`así como` ante bloque heterogéneo].
- **Composabilidad**: destino-enumerado; NO DEBE coordinarse con otras estructurales; zona prohibida en refinamiento/despliegue (NO DEBE agrupar).
- **Reverse**: `^(.+?) exhibe(?:n)? (.+)$`, `tipo: "exhibicion"`; `tiene un … opcional` → multiplicidad `0..1`; el parser acepta además plural `tiene … opcionales` (no emitido).
- **Roundtrip** (DEBE): exhibidor, rasgos, orden, opcionalidad y **frontera atributo/operación**. → MODELO-DATOS (rasgo = objeto (atributo) o proceso (operación)).
- **Edge**: `**Atributo** de **Objeto** es valor` NO es exhibición sino entidad-atributo (§2.5).

### 7.4 §6.3 Generalización-especialización — RF3, RF3b, RX1, RX2, RH1

```
RF3 (plural): **Especialización1** y **Especialización2** son **General**.
RF3b (singular): **Especialización** es un **General**.
RX1 (XOR, dos generales): **Especial** puede ser **General1** o **General2**.
RX2 (XOR, lista): **Especial** puede ser uno de **General1**, **General2** o **General3**.
RH1 (herencia múltiple): **Especial** es un **General1** y un **General2**.
Colección incompleta: **Especialización1**, **Especialización2** y al menos otra especialización son **General**.
```
- **Emisión**: base (especializaciones) = sujeto; general = predicado nominal; plural `son **General**`, singular `es un **General**`; XOR → `puede ser` / `puede ser uno de`; herencia múltiple coordina generales con `un/una`.
- **Supresión**: placeholder no emite; heredados no se duplican; misma perseverancia obligatoria.
- **R-EST-GEN-1** (DEBE / NUNCA): XOR DEBE emitirse con `puede ser` o `puede ser uno de`, NUNCA con `son`/`es un` (inclusivos) ni con `puede estar`.
  ```
  Correcto: **Vehículo** puede ser **Auto** o **Camión**.
  Incorrecto: **Vehículo** puede estar **Auto** o **Camión**.
  ```
- **R-EST-GEN-2** (DEBE): herencia múltiple con lista de generales unida por artículos `un/una` (`es un **G1** y un **G2**`), preservando trazabilidad de cada general.
- **Tokenización**: `o`/`u` conector XOR; `y`/`e` conector de especializaciones; `un`/`una` artículos de herencia múltiple.
- **Orden**: especializaciones → (`son` | `es un`) → general. XOR: especial → (`puede ser` | `puede ser uno de`) → generales.
- **Composabilidad**: destino-enumerado en sujeto (varias especializaciones) y en predicado (herencia múltiple/XOR). Zona prohibida en refinamiento/despliegue.
- **Reverse**: `^(.+?) es un (.+)$` y `^(.+?) son (.+)$` → `generalizacion` general(origen)→especialización(destino). GAP-XOR-PARSER: `puede ser`/`puede ser uno de` sin regex ni generador (GAP-XOR-FEATURE).
- **Roundtrip** (DEBE): especializaciones, general, exclusividad (XOR vs inclusivo) y herencia múltiple. → MODELO-DATOS (flag XOR en el conjunto de generalización).
- **Nota**: `emitirEspecializacion` emite el hecho individual como `es un`; NO realiza «la superficie XOR parent-centric `puede ser`». Ver GAP-A01.

### 7.5 §6.4 Clasificación-instanciación — RF4, RF4b

```
RF4 (singular): **Instancia** es una instancia de **Clase**.
RF4b (plural): **Instancia1** y **Instancia2** son instancias de **Clase**.
```
- **Emisión**: instancia (base) = sujeto; clase (vértice) = complemento. «La clasificación NO distingue colección completa/incompleta (R-STRF-3): NO DEBE emitirse marca de colección incompleta para instanciación.» → GENERAR-OPL + IMPEDIR (no ofrecer «incompleta» en clasificación).
- **Supresión**: placeholder no emite; instancia visual no emite (R-ENT-INS-1); misma perseverancia.
- **Orden**: instancias → (`es una instancia de` | `son instancias de`) → clase.
- **Composabilidad**: destino-enumerado en el sujeto; NO DEBE coordinarse con las otras tres; zona prohibida en despliegue.
- **Reverse**: `^(.+?) es una instancia de (.+)$` y `^(.+?) son instancias de (.+)$` → `clasificacion` clase(origen)→instancia(destino).
- **Roundtrip** (DEBE): instancias, clase y plural/singular. `Instancia : Clase` es designación de nombre, no oración (GAP-NOMBRE-INSTANCIA).

### 7.6 §6.5 Etiquetados — SE1–SE5

```
SE1 (unidireccional, etiqueta de usuario): **Origen** etiqueta **Destino**.
SE2 (unidireccional, etiqueta nula): **Origen** se relaciona con **Destino**.
SE3 (bidireccional, etiquetas distintas): **Origen** etiqueta-f **Destino**. seguido de **Destino** etiqueta-b **Origen**. (dos oraciones)
SE4 (recíproco con etiqueta): **Origen** y **Destino** son etiqueta.
SE5 (recíproco nulo): **Origen** y **Destino** se relacionan.
```
- **Naturaleza**: estructural **no fundamental**, relación arbitraria del modelador entre dos cosas de la misma perseverancia (R-OPL-SE-2). La etiqueta de usuario es frase breve en minúscula que funciona como verbo o predicado nominal (R-OPL-SE-1). → ADVERTIR (inferido: etiqueta en minúscula).
- **Emisión**: `etiquetado` → `**Origen** <tag> **Destino**`; sin etiqueta → `se relaciona con` (SE2). `etiquetadoBidireccional` recíproco sin etiqueta diferencial → `se relacionan` (SE5). SE3 → dos oraciones (f-tag / b-tag). «un bidireccional cuyas dos etiquetas coinciden DEBE tratarse como recíproco con esa etiqueta (R-STRE-1).» → GENERAR-OPL (DEBE colapsar SE3 idéntico a SE4); MODELO-DATOS (etiquetado: uni | bi con f-tag/b-tag | recíproco).
- **Supresión**: placeholder no emite. «Una etiqueta nula definida por usuario solo es válida si conserva trazabilidad como etiqueta de usuario (R-OPL-SE-5).»
- **R-EST-TAG-1** (DEBE): etiquetado conecta cosas de la misma perseverancia (objeto↔objeto o proceso↔proceso); mezclas objeto↔proceso son exhibición cuando canónicas, no etiquetado. → IMPEDIR.
- **R-EST-TAG-2** (DEBE): `se relaciona con` (uni) y `se relacionan` (recíproco) son las etiquetas nulas canónicas; el generador DEBE emitirlas cuando no hay etiqueta de usuario.
- **R-EST-TAG-3** (PUEDE; extensión declarada — sufijo de etiqueta de enlace): la herramienta PUEDE adjuntar la etiqueta de usuario de un enlace **procedimental o estructural fundamental** como sufijo `[etiqueta: …]` tras el punto terminal:
  ```
  **Todo** consta de **Parte**. [etiqueta: componente critico]
  ```
  El parser extrae el sufijo antes de cotejar la oración base; la edición lo aplica vía patch `fijar-etiqueta-enlace` (§15.3–§15.4, fuera de tramo). Producción `(* ext §6.5 *)` en §18. → MODELO-DATOS (etiqueta opcional en cualquier enlace) + GENERAR-OPL + PARSEAR-OPL.
- **Tokenización**: etiqueta de usuario = token-verbo con `hint` de etiqueta editable; `y`/`e` en recíprocos.
- **Orden**: SE1/SE2: origen → tag → destino. SE4/SE5: origen → `y` → destino → (`son` tag | `se relacionan`).
- **Composabilidad** (PUEDE / NO DEBE): PUEDE bifurcarse hacia listas con `ordenados por` o `en esa secuencia` cuando el orden sea parte de la superficie (R-OPL-SE-4); PUEDE incluir restricciones de participación en origen y destino (R-OPL-SE-3); NO DEBE coordinarse con fundamentales; zona prohibida en refinamiento/despliegue.
- **Reverse**: etiqueta de usuario → `etiquetado`; `se relaciona con` → nulo uni; `se relacionan` → recíproco nulo. GAP-TAG-PARSER: v0 no tiene regex para etiquetados. → PARSEAR-OPL (inferido: DEBE existir para roundtrip; ver GAP-A08).
- **Roundtrip** (DEBE): origen, destino, dirección (uni/bi/recíproco), etiqueta y orden. GAP-FIXTURE-TAGGED.
- **Edge**: SE3 con etiquetas idénticas colapsa a SE4; V-30 prohíbe bidireccional y recíproco con estado solo en destino (§6.6).

### 7.7 §6.6 Estructurales con estado especificado — SSE1–SSE7

```
SSE1 (estado en origen, unidireccional): **Origen** en `estado` etiqueta **Destino**.
SSE2 (estado en destino, unidireccional): **Origen** etiqueta **Destino** en `estado`.
SSE3 (estado en ambos, unidireccional): **Origen** en `sa` etiqueta **Destino** en `sb`.
SSE4 (estado en origen, bidireccional f-tag): **Origen** en `sa` etiqueta-f **Destino**.
SSE5 (estado en origen, bidireccional b-tag): **Destino** etiqueta-b **Origen** en `sa`.
SSE6 (estado en ambos, recíproco): **Origen** en `sa` y **Destino** en `sb` son etiqueta.
SSE7 (estado en origen, recíproco): **Destino** y **Origen** en `sa` son etiqueta.
```
- **Emisión**: etiquetado cuyo extremo se fija a un estado añade `en `estado`` en el extremo que porta el estado. → MODELO-DATOS (extremo de enlace estructural etiquetado puede anclar a estado).
- **R-EST-SSE-1** (`V-30`, NO DEBE): las variantes **bidireccional** y **recíproco** NO existen para el caso de estado solo en destino; solo aplican SSE1–SSE7. NO DEBE emitirse bidireccional/recíproca con estado únicamente en destino. → IMPEDIR.
- **Tokenización / Orden**: `en` precede al estado; el sufijo `en `estado`` sigue inmediatamente a la cosa cuyo estado especifica (posición post-cosa).
- **Reverse**: GAP-SSE-PARSER (hereda GAP-TAG-PARSER). **Roundtrip** (DEBE): origen, destino, etiqueta, dirección y cada estado. GAP-FIXTURE-SSE.

### 7.8 §6.7 GAPs estructurales

GAP-XOR-FEATURE / GAP-XOR-PARSER (XOR sin generador ni parser), GAP-TAG-PARSER / GAP-SSE-PARSER (etiquetados sin parser), GAP-NOMBRE-INSTANCIA (sin composición de `Instancia : Clase`), GAP-FIXTURE-ESTRUCTURALES (cerrado para las cuatro fundamentales).

---

## 8. §7 Refinamiento / gestión de contexto (l. 1185–1423)

Marco: la gestión de contexto NO crea hechos OPM nuevos: realiza textualmente la relación jerárquica OPD padre ↔ hijo(s) o la distribución de un enlace sobre subprocesos. Cada mecanismo aparea refinamiento (revelar) con abstracción (suprimir). «El refinamiento del modelo es un canal separado de la etiqueta visible `SDx.y`: la generación PUEDE emitir la etiqueta de navegación como `hint` de presentación, pero NO DEBE tratarla como identidad persistente (R-IDP-1, R-IDP-2).» → MODELO-DATOS (OPD con id persistente; etiqueta SDx.y derivada).

### 8.1 §7.0 Reglas duras transversales

- **R-CX-0** (NO DEBE / PUEDE; no-trivialidad): un refinamiento NO DEBE emitir oración de gestión de contexto cuando el hijo tiene **menos de 2** refinadores; un nodo con un solo hijo NO es refinamiento canónico (R-REF-NTRIV-1..3) y solo PUEDE persistir como placeholder de edición. → GENERAR-OPL (suprimir) + ADVERTIR (refinamiento trivial).
- **R-CX-1** (NO DEBE): esencia, perseverancia y nombre de la cosa refinada NO cambian al cruzar el refinamiento; la generación NO DEBE emitir oración de refinamiento que reasigne esas propiedades. → MODELO-DATOS (la cosa refinada es la misma entidad en padre e hijo).
- **R-CX-2** (PUEDE / DEBE): la oración de refinamiento entre OPDs (CX3, CX4) PUEDE mostrar `SDx.y` como superficie de navegación, pero el `ref` del span de OPD DEBE anclar al identificador persistente del OPD, no a la etiqueta mutable.
  ```
  Correcto: **Pedido** se despliega en SD1 en **Cabecera** y **Línea**. (span SD1 con ref al OPD persistente)
  Incorrecto: usar SD1 como clave de modelo para resolver el hijo en serialización.
  ```
  → MODELO-DATOS + EXPORT (serializar por id, no por etiqueta).

### 8.2 §7.1 Descomposición / recomposición de proceso — CX1, CX2 (inverso CX7)

```
CX1 (secuencial): *Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia.
CX2 (paralelo): *Proceso* se descompone en paralelo *P1* y *P2*.
Mixta: *Proceso* se descompone en *P1*, paralelo *P2* y *P3*, y *P4*, en esa secuencia.   (preserva qué subprocesos van en paralelo dentro de la secuencia, R-OPL-CX-5)
Con objetos internos de zoom: … se descompone en *P1* y *P2*, así como **ObjetoInterno**.   (R-OPL-CX-6)
```
- **Emisión**: proceso con refinamiento `descomposicion` con ≥ 2 subprocesos → `se descompone en`, sujeto = padre, complemento = subprocesos. «El orden temporal se deriva de la coordenada vertical de los subprocesos en el OPD hijo (R-IDP-0A); si hay secuencia detectable se añade `en esa secuencia`, y los subprocesos coetáneos se agrupan con `paralelo`.» → GENERAR-OPL + RENDERIZAR (orden = eje Y); MODELO-DATOS (`opd.ordenInzoom` como campo explícito según §7.1 Reverse).
- **Supresión** (NO DEBE): placeholder no emite; un OPD **semidescompuesto** (transitorio) NO DEBE emitir oración canónica de descomposición (R-OPD-OP-3); <2 refinadores no emite.
- **Tokenización**: `se descompone en` token-verbo; `paralelo` clave de coetaneidad; `en esa secuencia` clave de orden; `así como` objetos internos.
- **Orden**: *padre* → `se descompone en` → [`paralelo`] subprocesos [`, así como` objetos internos] [`, en esa secuencia`].
- **Composabilidad** (NO DEBE): lista = destino-enumerado dentro de la única oración; NO se fragmenta por subproceso; NO DEBE coordinarse con enlaces transformadores/habilitadores; zona prohibida: los enlaces de los subprocesos NO se fusionan.
- **Reverse** (inferido, descriptivo de v0): `se descompone en` → AST de contexto → patch `crear-refinamiento` (idempotente) que crea el refinamiento con **OPD hijo vacío**. «Los miembros enumerados NO se crean ni se mueven automáticamente (diagnóstico `info` deliberado anti-pérdida-silenciosa; el alta de subprocesos sigue siendo gesto de canvas)». El orden (`en esa secuencia`/`paralelo`) SÍ se reconstruye sobre el refinamiento existente: resolución nombre→id contra los subprocesos del OPD hijo y patch `set-orden-inzoom` que setea `opd.ordenInzoom`, con **verificación por inversa** (re-emite el orden con la lógica forward; si difiere de la entrada, rechaza con `warning` y sin patch). → PARSEAR-OPL (crear refinamiento; fijar orden; diagnosticar miembros no creados). Ver GAP-A12.
- **Roundtrip** (DEBE): padre, lista de subprocesos, orden temporal (secuencia/paralelo) y objetos internos DEBEN preservarse; defendido sin rayos de invocación (orden implícito, R-IV-2).
- **Edge**: recomposición (out-zoom, CX7 `se recompone desde`) sin generador (GAP-RECOMPONE). «Un objeto que es instrumento en el nivel abstracto PUEDE figurar como afectado en el hijo solo si el cambio neto del proceso abstracto es cero (R-ROL-1); ese cambio de rol aplica a descomposición, no a despliegue (R-ROL-2).» → ADVERTIR (inferido).

### 8.3 §7.2 Despliegue / plegado de cosa — CX3, CX5, CX6

```
CX3 (despliegue genérico): **Cosa** se despliega en SD1 en **T1**, **T2** y **T3**.
Despliegue por relación fundamental (exhibición, generalización y clasificación reusan el verbo de su relación; la agregación es la excepción y usa `se despliega [por partes] en`, no `consta de`):
  agregación: **Todo** se despliega en **Parte1** y **Parte2**.
  exhibición: **Exhibidor** exhibe **Atributo1**, así como *Operación1*.
  generalización: **Especial1** y **Especial2** son **General**.
  clasificación: **Inst1** y **Inst2** son instancias de **Clase**.
CX5/CX6 (plegado): *Proceso* se pliega en el OPD padre. · **Objeto** se pliega en el OPD padre.
```
- **Emisión**: cosa con refinamiento `despliegue` con ≥ 2 refinadores → oración de despliegue. «El **modo** se resuelve por la relación fundamental dominante en el OPD hijo (agregación, exhibición, generalización, clasificación) según `modoDespliegue`»; superficie reusa el verbo de la relación (`consta de`/`se despliega en`, `exhibe`, `son`/`es un`, `son instancias de`). «El despliegue revela estructura estática y NO implica orden temporal (R-REF-SYNC-2): NUNCA DEBE añadir `en esa secuencia`.»
- **Supresión**: placeholder no emite; <2 refinadores no emite. El plegado (CX5, CX6) suprime hechos refinados en el OPD ascendente; su oración solo describe la operación de abstracción y NO reemplaza la gramática del hecho interno.
- **R-CX-DESP-1** (DEBE / NO DEBE): el despliegue DEBE aplicarse **por relación fundamental**; NO DEBE mezclar dos relaciones fundamentales en una sola oración de despliegue.
- **R-CX-DESP-2** (NO DEBE): el despliegue NO DEBE portar marca temporal (`en esa secuencia`, `paralelo`).
  ```
  Correcto: **Pedido** se despliega en **Cabecera** y **Línea**.
  Incorrecto: **Pedido** se despliega en **Cabecera** y **Línea**, en esa secuencia.
  ```
- **Tokenización**: span `SD1` (CX3) con `ref` al OPD persistente (R-CX-2); en plegado, `se pliega en` token-verbo, `el OPD padre` referencia al ascendente.
- **Orden**: cosa → verbo de relación → refinadores [`, así como` lista heterogénea]. CX3: cosa → `se despliega en` → `SD1` → `en` → lista. Plegado: cosa → `se pliega en` → `el OPD padre`.
- **Composabilidad** (NO DEBE): destino-enumerado dentro de la única oración; zona prohibida: los enlaces estructurales de los refinadores NO se fusionan en plural; NO DEBE coordinarse con descomposición ni procedimentales.
- **Reverse**: despliegue por relación fundamental se parsea por las regex estructurales de §6 reconstruyendo el refinamiento `despliegue`. Plegado parcial defendido por test. GAP-PLIEGA: `se pliega en el OPD padre` sin generador; el parser la reconoce con warning `unsupported-kernel` sin aplicar plegado.
- **Roundtrip** (DEBE): cosa desplegada, modo, lista de refinadores y **estado de plegado parcial**. «El plegado parcial (mostrar N partes y suprimir el resto con `al menos otro/a`) se realiza en `plegado.ts·oracionPlegadoParcial`.» → GENERAR-OPL/PARSEAR-OPL (superficie = RF1i con `al menos otra parte`, inferido).
- **Edge**: en despliegue por agregación las partes viven **fuera** del contenedor del padre y se conectan por enlaces estructurales; pertenencia por presencia en el OPD hijo, no por contención espacial (a diferencia de la descomposición). El despliegue NO admite cambio de rol instrumento↔afectado (R-ROL-2). → MODELO-DATOS/RENDERIZAR.

### 8.4 §7.3 Refinamiento explícito entre OPDs — CX4

```
Descomposición: SD se refina por descomposición de *Proceso* en SD1.
Despliegue: SD se refina por despliegue de **Cosa** en SD1.
```
- **Emisión**: la arista del árbol OPD padre→hijo equivale a `se refina por descomposición de … en` / `se refina por despliegue de … en` (R-ARB-4). «El OPL completo del sistema se obtiene concatenando los párrafos locales en orden de navegación del árbol (R-OPL-TOTAL-1), no describiendo un solo contexto.» → GENERAR-OPL (inferido DEBE: OPL total = concatenación de párrafos por OPD en orden del árbol) + MODELO-DATOS (árbol OPD).
- **Supresión**: no se emite para nodo que no cierra como refinamiento canónico (R-CX-0).
- **Reverse**: GAP-REFINA (sin generador ni parser; el árbol se materializa por estructura del modelo).
- **Roundtrip** (DEBERÍA): si se materializara, OPD padre, hijo y cosa refinada DEBERÍAN preservarse vía identidad persistente.

### 8.5 §7.4 Expresión / supresión de estados — CX-EST

- **Plantilla**: reusa D5 (`**Objeto** puede estar `s1`, `s2` o `s3`.`) y designaciones §2.4. La expresión de estados ES el refinamiento; la supresión ES la abstracción.
- **Emisión** (DEBE): en un OPD con estados visibles se emite la enumeración; en el ascendente que los abstrae se suprime. «El OPL de un OPD DEBE expresar solo los estados **visibles o referenciados en ese OPD** (R-OPL-TOTAL-4); el conjunto completo de estados de un objeto es la unión a través de todos los OPDs del modelo (R-OPL-TOTAL-5).» → GENERAR-OPL por OPD + MODELO-DATOS (visibilidad de estado por apariencia/OPD).
- **R-CX-EST-1** (DEBE / NUNCA): expresión de estados con `puede estar`, NUNCA `puede ser`.
- **R-CX-EST-2** (NO DEBE): la supresión de estados en un OPD ascendente NO DEBE borrar los estados del modelo; solo los oculta en la realización local. → MODELO-DATOS / OPERACIÓN (suprimir ≠ borrar).
- **Roundtrip** (DEBE): el conjunto de estados visibles por OPD DEBE preservarse.
- **Metadatos inline**: alias, unidad, descripción y duración pueden agregarse a la descripción de entidad/estados «cuando el modelo los declara»; no son plantilla OPL nueva. → GENERAR-OPL (PUEDE; sin plantilla literal en el tramo: GAP-A11).

### 8.6 §7.5 Síncrona vs asíncrona — CX-SYNC

- **R-CX-SYNC-1** (PUEDE): la descomposición (in-zoom) es **síncrona**: el padre espera a que todos los subprocesos completen; su OPL PUEDE portar orden temporal (`en esa secuencia`, `paralelo`).
- **R-CX-SYNC-2** (NO DEBE): el despliegue es **asíncrono**; su OPL NO DEBE portar orden temporal.
  ```
  Correcto: *Cocinar* se descompone en *Preparar Masa*, *Preparar Relleno* y *Hornear*, en esa secuencia. (síncrona, ordenada)
  Correcto: **Empanada** se despliega en **Masa** y **Relleno**. (asíncrona, sin orden)
  Incorrecto: **Empanada** se despliega en **Masa** y **Relleno**, en esa secuencia. (orden temporal en despliegue)
  ```

### 8.7 §7.6 Distribución de enlaces al descomponer — CX-DIST

Matriz literal:

| Tipo de enlace | Contorno exterior del padre | Distribución al hijo |
| --- | --- | --- |
| Consumo (T1, TS1) | **PROHIBIDO** | migra al **primer** subproceso |
| Resultado (T2, TS2) | **PROHIBIDO** | migra al **último** subproceso |
| Efecto básico (T3, sin estado) | PERMITIDO | a **todos** los subprocesos |
| Efecto entrada-salida (TS3) | — | **escisión** TS4/TS5 (§7.6.1, remite §3) |
| Agente | PERMITIDO | a **todos** los subprocesos |
| Instrumento | PERMITIDO | a **todos** los subprocesos |
| Estructural | NO se distribuye | permanece en el contenedor |
| Evento sistémico | **PROHIBIDO** cruzar frontera | — |
| Evento ambiental | permitido cruzar | con modelado de contingencia |

- **R-CX-DIST-1** (NO DEBE / DEBE): consumo y resultado NO DEBEN conectarse al contorno exterior de un proceso descompuesto; DEBEN conectarse al subproceso específico (consumo→primero, resultado→último). → **IMPEDIR** (en el OPD hijo) + **OPERACIÓN** (al descomponer, migrar/distribuir por defecto según la matriz).
- **R-CX-DIST-2** (NO DEBE / PUEDE): un evento **sistémico** NO DEBE cruzar la frontera del proceso descompuesto; un evento ambiental PUEDE cruzarla con modelado de contingencia. → IMPEDIR/ADVERTIR.
- **Efecto en OPL** (DEBE): la migración cambia sujeto/complemento en el OPL del OPD hijo: `*ProcesoPadre* consume **X**` (padre) → `*PrimerSubproceso* consume **X**` (hijo). «La identidad del hecho (mismo enlace) DEBE preservarse a través de la migración (R-OPD-OP-4).» → MODELO-DATOS (enlace del padre y enlace migrado mantienen identidad/traza).

#### §7.6.1 Enlaces escindidos

- **R-CX-ESC-1**: al descomponer un TS3 `*P* cambia **A** de `s1` a `s2``, el modelo queda subespecificado hasta **escindir** el enlace en TS4/TS5. (inferido DEBE) → OPERACIÓN (escisión al descomponer).
- **R-CX-ESC-2**: el subproceso **temprano** recibe TS4: `*P1* cambia **A** de `s1`.`
- **R-CX-ESC-3**: el subproceso **tardío** recibe TS5: `*P2* cambia **A** a `s2`.`
- **R-CX-ESC-4** (NO DEBE): los fragmentos escindidos NO DEBEN portar `e`/`c`; la prohibición aplica al fragmento, no al efecto parcial standalone (R-ESCIND-0).
- Traza: distribución/migración es **operación de modelo** (descomposición como operación de herramienta, `reglas §8.11`); cada oración transformadora se asigna al OPD donde reside su enlace. → OPERACIÓN + GENERAR-OPL por OPD.

### 8.8 §7.7 Zona prohibida de composición en refinamiento / despliegue

Preludio de §9 (fuera de tramo); lección BUG-f897bc.
- **R-CX-COMP-1** (NO DEBE / DEBE): los enlaces de los refinadores (subprocesos, partes/especializaciones/instancias/rasgos de un despliegue) NO DEBEN fusionarse en una oración plural única; cada enlace DEBE emitirse en su propia oración, preservando su token-verbo y su `ref` por enlace.
  ```
  Correcto: en contexto de despliegue de generalización, los enlaces se emiten por enlace — **Auto** es un **Vehículo**. seguido de **Camión** es un **Vehículo**. (un enlace, una oración, refs preservados) — y COEXISTEN con la oración de despliegue **Auto** y **Camión** son **Vehículo**. (un hecho de refinamiento con refs de entidad, refinadores y enlaces; §7.2, R-CX-COMP-3).
  Incorrecto (zona prohibida): fusionar las N oraciones de enlace a **Auto** y **Camión** son **Vehículo**. en reemplazo de su emisión atómica.
  ```
- **R-CX-COMP-2** (DEBE / NO DEBE): la coordinación copulativa de §9 DEBE excluir explícitamente el contexto de refinamiento/despliegue; «La detección de candidatos a coordinación NO DEBE activarse sobre enlaces que pertenecen a un OPD hijo de refinamiento.»
- **R-CX-COMP-3** (inferido): dentro de la propia oración de refinamiento (CX1–CX3) la lista de refinadores SÍ es destino-enumerado legítimo — un solo verbo de refinamiento, explícito (`se descompone en`/`se despliega en`) o reusado de la relación fundamental (`exhibe`, `son`/`es un`, `son instancias de`) —; lo prohibido es coordinar los enlaces de esos refinadores entre sí en reemplazo de su emisión atómica. La oración de despliegue superficie-idéntica es canónica y COEXISTE con las oraciones por enlace.
→ GENERAR-OPL (en OPD hijo: oración de refinamiento + una oración por enlace hijo; nunca fusión). PARSEAR-OPL (inferido: re-parsear ambas sin duplicar hechos; ver GAP-A09).

### 8.9 §7.8 GAPs de refinamiento

GAP-CX-PARSER (orden cerrado; residual: miembros por gesto), GAP-PLIEGA (sin generador; parser reconoce sin aplicar), GAP-DESPLIEGUE-DEDICADO (superficies `se despliega por partes/especialización/instanciación/rasgos en SDx en …` derivadas en EBNF §18 sin generador ni declaración de sustitución), GAP-RECOMPONE (`se recompone desde`, CX7/CX8, sin generador ni parser), GAP-REFINA (CX4 sin generador ni parser), GAP-FIXTURE-DESCOMPOSICION (orden cerrado), GAP-COMP-GUARDA (no aplica: salida atómica por construcción).
Superficies dedicadas A.10 mencionadas (sin plantilla literal completa en el tramo): `se despliega por partes/especialización/instanciación/rasgos en SDx en …`.

---

## 9. Regex de parseo citadas (referencia, no normativas en sí)

| Constructo | Patrón | tipo | puertoEsOrigen |
| --- | --- | --- | --- |
| T1/TS1 | `/^(.+?)\s+consume\s+(.+)$/` | consumo | false |
| T2/TS2 | `/^(.+?)\s+genera\s+(.+)$/` | resultado | true |
| T3 | `/^(.+?)\s+afecta\s+(.+)$/` | efecto | true |
| TS3 (ctx condición/CS2) | ``/^(.+?)\s+cambia\s+(.+?)\s+de\s+`?([^`]+?)`?\s+a\s+`?([^`]+?)`?$/`` | efecto | — |
| H1/HS1 | `/^(.+?)\s+maneja\s+(.+)$/` | agente | true |
| H2/HS2 | `/^(.+?)\s+requiere\s+(.+)$/` | instrumento | false |
| RF1 | `^(.+?) consta de (.+)$` | agregacion | todo = origen |
| RF2 | `^(.+?) exhibe(?:n)? (.+)$` | exhibicion | exhibidor = origen |
| RF3b / RF3 | `^(.+?) es un (.+)$` / `^(.+?) son (.+)$` | generalizacion | general = origen |
| RF4 / RF4b | `^(.+?) es una instancia de (.+)$` / `^(.+?) son instancias de (.+)$` | clasificacion | clase = origen |

Nota (inferida): `son (.+)` también casa `son instancias de …` y SE4 `son etiqueta`; el orden de prueba de patrones importa (más específico primero). Pasivas legacy reconocidas: `es consumido por`, `es generado por`, `es manejado por`, `es requerido por`.

---

## 10. Índice de plantillas por ID (tramo A)

| Familia | IDs con plantilla literal en este dossier |
| --- | --- |
| Entidades | R-ENT-3 (combinada), D1–D4 (atómicas), D5, D6, D7–D10, D13, ENT-ATR (valor, rango, enumeración), ENT-INS (`Instancia : Clase`) |
| Transformadores | T1, TS1, T2, TS2, T3, TS3 (+evento, +condición, +negada), TS4, TS5, plurales |
| Habilitadores | H1, HS1, H2, HS2, EH1, EH2, CH1/CS5, CH2/CS6, negadas, plurales |
| Evento | ET1, ET2, EH1, EH2, ETS1–ETS4, EHS1, EHS2, abanico evento de efecto |
| Condición | CT1, CT2, CH1, CH2, CS1–CS6, COND-ALT |
| Excepción | EX1, EX2, combinada |
| Invocación | IV1, IV1+demora, IV2, IV2+demora, abanico XOR divergente/convergente |
| Estructurales | RF1, RF1 plural, RF1i, RF2, RF2b, RF2o, RF2 plural, RF3, RF3b, RX1, RX2, RH1, colección incompleta, RF4, RF4b, SE1–SE5, SSE1–SSE7, R-EST-TAG-3 sufijo |
| Refinamiento | CX1, CX2, mixta, objetos internos, CX3, despliegue ×4 relaciones, CX5/CX6, CX4 ×2 |

Abanicos (XOR/OR), multiplicidades, rutas, probabilidades (`Pr=p`), coordinación (§9) y EBNF (§18) quedan **fuera de tramo**.

---

## 11. Sobreingeniería o circunstancial para una herramienta simple

1. **Columnas/campos «Traza a código»** en todas las entradas (archivos `app/src/opl/…`, números de línea, nombres de funciones `oracionEntidad`, `ABANICO_VERBO_RE_LIST`, `puertoEsOrigen`, fixtures `fixtures-roundtrip.ts`, tests): describen la v0 de deep-opm-pro. No son requisito del rehecho; útiles solo como casos de prueba (p. ej. `*Procesar* consume **Entrada**.`).
2. **Front-matter y sincronización con la «bestia»/KORA/pneuma**, sha256, commits, decisiones HITL, compatibilidad con `opl-es`/`opm-es` externas y «abrir corrección documental»: puramente documental.
3. **Convenciones de IDs, RFC 2119, `Rationale:` vs `Traces to:`**: gobierno documental, no requisito de herramienta.
4. **R-ENT-2-APUNTE**: el concepto de «especie apunte vs modelo» con «graduar» es un requisito real, pero las superficies enumeradas (`mesa pull`, contexto W6.0, «puente skill», lectura móvil, «bundles compilados headless») son productos circunstanciales de v0.
5. **R-ENT-3 «eco OPCloud»** y tres modos de visibilidad (`siempre`/`solo-difiere`/`oculta`) con defaults por «perfil/preset»: el canon solo exige la oración combinada y que el default no pise lo explícito; tres modos + presets son configuración prescindible (un modo `solo-difiere` basta; los modos no llevan keyword DEBE).
6. **Formas pasivas legacy** (`es consumido por`, `es generado por`, `es manejado por`, `es requerido por`) y `despues de` sin tilde: compatibilidad hacia atrás con OPL antiguo; no es obligación con keyword.
7. **Forma posesiva de instrumento** (`oracionInstrumentoPosesiva`, verbos `manejar`/`conducir`): PUEDE, sin plantilla; candidato claro a descartar.
8. **Variantes negadas** (`no cambia`, `no maneja`, `no requiere`): extensión declarada, emisión-only, con divergencia OPCloud vs kernel; o se implementan completas (generar + parsear) o se omiten.
9. **RF2o `tiene un … opcional`** (+ plural `tiene … opcionales` solo en parser): extensión de producto que duplica la restricción base `un/una opcional`.
10. **R-EST-TAG-3 sufijo `[etiqueta: …]`** en enlaces no etiquetados + patch `fijar-etiqueta-enlace`: PUEDE; prescindible.
11. **D13 `declarado `Current``**: designación con token inglés; circunstancial.
12. **Extensiones locales**: demora en invocación (`después de <demora>`), variante combinada de excepción y tipo de enlace `excepcionSubSobretiempo`; metadatos inline (alias, unidad, descripción, duración).
13. **Plegado parcial** (`oracionPlegadoParcial`), verbos `se pliega`, `se recompone`, `se refina`, `varía de … a`, `es de tipo` y superficies dedicadas A.10: presentes en el enum pero sin generador ni obligación de emisión; para una herramienta simple basta con no emitirlos (y a lo sumo reconocerlos con diagnóstico).
14. **Maquinaria de parseo de descomposición** (AST de contexto, patches `crear-refinamiento` idempotente, `set-orden-inzoom`, verificación por inversa con warning, diagnóstico `info` anti-pérdida-silenciosa, `bandasNombres`): detalle de implementación v0.
15. **§7.7 coexistencia de la oración de despliegue con las oraciones por enlace** (BUG-f897bc): dice el mismo hecho dos veces; nace de un bug histórico. Una herramienta simple podría emitir solo la de refinamiento o solo las por enlace, pero el canon exige ambas (ver GAP-A09).
16. **Bookkeeping de GAPs cerrados** (GAP-EVENTO-RESULTADO, GAP-INVOCACION-TILDE, GAP-FIXTURE-*…): historial v0; solo su contenido normativo residual importa (degradar e/c sobre resultado/invocación).
17. **Evidencia OPCloud** (`*Rescatar* es un proceso informacional y sistémico.`, markers `*Negation`): no canon.
18. **`hint` `Pr=p`, `stateHints`, `SDx.y` como hint**: detalles de presentación.

---

## 12. GAPs y contradicciones internas detectadas

- **GAP-A01 — Dirección de la especialización XOR (contradicción)**: las plantillas RX1/RX2 ponen al **especial** como sujeto y enumeran **generales** mutuamente excluyentes (`**Especial** puede ser **General1** o **General2**.`, y §1.1: «la especialización XOR enumera generales mutuamente excluyentes»), pero los ejemplos Correcto de R-VERB-EST-2 y R-EST-GEN-1 (`**Vehículo** puede ser **Auto** o **Camión**.`) y la nota de §6.3 («superficie XOR parent-centric `puede ser`») ponen al **general** como sujeto y enumeran especializaciones. Hay que resolver cuál es el hecho: ¿especializaciones exclusivas de un general, o un especial con generales exclusivos?
- **GAP-A02 — Plural de consumo incoherente**: `*Proceso* consumen **Objetos**.` («verbo concuerda con el sujeto-proceso múltiple») usa sujeto singular con verbo plural y pluraliza el objeto; las plantillas análogas (`*Procesos* generan **Objeto**.`, `*Procesos* afectan **Objeto**.`, `*Procesos* requieren **Instrumento**.`) pluralizan el proceso. La regla de «plural por multiplicidad» tampoco dice qué multiplicidad (extremo proceso u objeto) dispara el plural.
- **GAP-A03 — Enum verbal «cerrado» vs tokens usados**: §1 prohíbe emitir o reconocer verbos fuera de §1.1, pero las plantillas usan `está (en)` (CS*, CH*, TS3 condición), `es` (valor de atributo `es valor`, designación `es inicial`), `tiene` (solo en extensión), `ocurren en paralelo` (generador `oracionParalelo`, sin plantilla), pasivas legacy (`es consumido por`, …) y la etiqueta de usuario como verbo libre (SE1, SE4). Además la tabla de conectores §1.3 omite tokens que sí aparecen: `en` (estado), `que` (relativa), `paralelo`, `después de`, `a sí mismo`, `en cualquier estado` (ETS4), `uno de` (RX2), `y otros estados` (D6), `no` (negadas), `Si … entonces` (COND-ALT), `ordenados por`, `el OPD padre`, `su duración máxima/mínima`.
- **GAP-A04 — Parseo de texto sin tipografía**: la tipografía es «portadora de tipo» para el parser, pero no se define qué hace el parser con texto sin marcado (editor libre, pegado) ni si resuelve tipo por nombre existente. Hay que decidirlo.
- **GAP-A05 — Negadas emisión-only**: violan la bidireccionalidad que la propia spec declara como razón del enum cerrado (GAP-NEGADA-REVERSE); además su modelo de datos es ambiguo («tercer modificador excluyente» del kernel vs flag ortogonal de OPCloud).
- **GAP-A06 — Forma posesiva de instrumento**: contradice «la generación NO DEBE emitir un verbo habilitador fuera de {`maneja`, `requiere`}» y no da plantilla.
- **GAP-A07 — Despliegue por agregación**: §7.2 dice que la agregación usa `se despliega [por partes] en`, «no `consta de`», pero la Emisión lista `consta de`/`se despliega en`, y el Reverse dice que el despliegue «se parsea por las regex estructurales de §6 (`consta de`, …)», que no reconocen `se despliega en` (§7.1 Reverse lo asigna a `parsearContexto`). Además CX3 lleva `SD1` (`**Cosa** se despliega en SD1 en …`) y los ejemplos de R-CX-DESP-2 / R-CX-SYNC-2 no: dos superficies para el mismo hecho.
- **GAP-A08 — Etiquetados sin parser (GAP-TAG-PARSER/GAP-SSE-PARSER)**: el canon exige roundtrip (DEBE preservarse origen, destino, dirección, etiqueta) sin dar estrategia de parseo para un verbo libre, lo que choca con el enum cerrado. Hace falta una regla de desambiguación (p. ej. `**A** <texto> **B**.` cuando nada más casa).
- **GAP-A09 — Hecho duplicado en refinamiento**: R-CX-COMP-1/3 exige que la oración de despliegue (`**Auto** y **Camión** son **Vehículo**.`) COEXISTA con `**Auto** es un **Vehículo**.` y `**Camión** es un **Vehículo**.`, es decir, el mismo hecho estructural dicho dos veces, lo que tensiona el «hecho único» (R-PRIN-9) citado en §2.6. No se dice cómo el parser evita duplicar enlaces al re-parsear ambas.
- **GAP-A10 — Verbos canónicos sin plantilla ni obligación de emisión**: `es de tipo` (sin plantilla), `varía de … a` (plantilla sin generador), `se refina`, `se pliega`, `se recompone` y las superficies dedicadas A.10. No queda claro si la herramienta DEBE emitirlos/parsearlos o solo tolerarlos.
- **GAP-A11 — Superficies mencionadas sin plantilla literal**: perseverancia («en oración aparte»), metadatos inline (alias/unidad/descripción/duración), plegado parcial (solo implícito vía `al menos otro/a`), respaldo de excepción (`su duración máxima` sin oración completa), probabilidad `Pr=p`.
- **GAP-A12 — Reverse incompleto de descomposición**: parsear `*P* se descompone en *A*, *B* y *C*` crea el refinamiento con OPD hijo **vacío** y no crea los subprocesos (por diseño); en ese constructo el OPL→OPD no es completo, en tensión con la simetría forward/reverse.
- **GAP-A13 — Procedencia de escisión (GAP-PROCEDENCIA-ESCIND)**: TS4/TS5 fragmento vs standalone tienen la misma superficie; sin metadato normativo, la herramienta no puede aplicar R-MOD-CAT-2 / R-CX-ESC-4 ni el acoplamiento obligatorio TS4↔TS5 después de recargar o parsear.
- **GAP-A14 — Agente humano sin dato**: la Emisión habla de «objeto humano» (agente) y «objeto no humano» (instrumento), pero el modelo no define una propiedad «humano»; R-HAB-AG-1/2 no son verificables por la herramienta salvo con heurística o un dato nuevo.
- **GAP-A15 — Nombres placeholder de objeto/estado no enumerados**: solo se listan los de proceso (`proceso`, `proceso N`, `proceso parte N`). En v0 los objetos placeholder no se filtran (GAP-PLACEHOLDER-OBJETO).
- **GAP-A16 — Conceptos indefinidos en el tramo**: «OPD semidescompuesto (transitorio)» (R-OPD-OP-3), «relación fundamental dominante» del modo de despliegue cuando el hijo mezcla relaciones (y R-CX-DESP-1 prohíbe mezclar), «modelado de contingencia» del evento ambiental, celda «—» del contorno exterior para TS3 en la matriz CX-DIST.
- **GAP-A17 — R-RES-1 (a verificar contra `reglas`)**: «Un enlace de resultado hacia un **objeto** con estado inicial NUNCA DEBE conectarse directamente al estado inicial». La redacción es inusual (lo común en OPM es crear el objeto en su estado inicial); hay que cotejarla con el tramo de `reglas-opm-estrictas-es`.
- **GAP-A18 — Inconsistencias menores de superficie**: `así como` sin coma en RF2b y con coma en el despliegue por exhibición y en objetos internos de CX1; D6 usa coma de Oxford (`…, y otros estados`) mientras §2.8 dice que no se usa; ETS1 no repite el estado en la relativa (`…, que consume **Objeto**.`) pero EHS2 sí (`…, que requiere **Instrumento** en `estado`.`); `es valor` sin backticks pese a la convención tipográfica (valor entre backticks); CX2 `se descompone en paralelo *P1* y *P2*` frente al generador `ocurren en paralelo`.
- **GAP-A19 — Destino-enumerado vs salida atómica**: §6.1–§6.4 prescriben agrupar varios enlaces del mismo vértice en una oración (RF1 con lista, RF3 plural), pero §7.7 (GAP-COMP-GUARDA) dice que hoy «cada enlace genera su propia oración, sin transformador que pueda fusionarlos», y R-CX-COMP-2 excluye la coordinación en cualquier «OPD hijo de refinamiento» (es decir, en todo OPD salvo la raíz). No queda claro si la agrupación es obligatoria y en qué OPDs.
- **GAP-A20 — Ambigüedad del default de esencia**: «cuando la esencia difiere del default (informacional)» se lee como default = informacional; el ejemplo `**Cosa** es un objeto físico.` lo confirma, pero no se dice si el default de un proceso también es informacional.
