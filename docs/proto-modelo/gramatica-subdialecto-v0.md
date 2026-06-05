# Gramática del sub-dialecto del proto-modelo — v0.2 (familia V de verbos extendidos)

**Fecha:** 2026-06-04 · **Estatus:** v0.2 — **falsada** contra el corpus HODOM (52 bloques, 472 líneas; cobertura sobre hechos 93.3%, ley L1 verde 100%; evidencia: `docs/proto-modelo/falsacion-2026-06-04.md`). Absorbe las 4 divergencias spec-vs-parser de la falsación **y** la **Familia V** de verbos/patrones extendidos decididos por el operador (sesión W4.3-rechazos, 2026-06-04): los rechazos del corpus bajan de **31 → 5** (las 5 restantes están EN REFLEXIÓN del operador). Candidata a promoción KORA cuando estabilice.
**Autoridad:** realiza la decisión D2 del acta `2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` bajo HITL-1 ("**bastante libre**"). El vocabulario estricto de destino es el de `docs/canon-opm/spec-forja-opl.md` §1.1; el árbitro operativo de "estricto" es **lo que `app/src/opl/parser/parsear.ts` acepta sin `unsupported-kernel`**.
**Custodia:** este documento + el normalizador + sus fixtures viven en `deep-opm-pro` (D1). Las instancias de proto-modelo viven en cada repo de dominio.

## Principio rector (HITL-1)

La prosa del modelador **nunca se restringe**. Solo los **hechos** (bloques ```opl) y las **anclas** tienen gramática — y la gramática de hechos es **amplia**: acepta las variantes naturales observadas en el corpus real, normaliza determinísticamente lo normalizable, y **rechaza con diagnóstico** (jamás adivina) lo que excede el catálogo. El barro vuelve al humano (principio anti-complacencia de `modelamiento-opm`).

## Clasificación de cada línea de un bloque `opl`

Toda línea se clasifica en exactamente una de:

| Clase | Qué es | Destino |
|---|---|---|
| `estricta` | ya es OPL-ES canónico parseable | parser (etapa 3 del compilador) |
| `normalizada` | azúcar T2 → reescrita a estricta por regla determinista | parser, con `{original, regla}` trazados |
| `estructura` | oración de refinamiento (`se descompone en`, `se despliega en`, variantes `también`/`en esa secuencia`) | lector de estructura (etapa 2) — el parser reverse las rechaza por diseño (`parsear.ts:1123`) |
| `comentario` | línea `#`... dentro del bloque | se conserva como anotación del bloque (no compila) |
| `ancla` | marcador `[C1]`/`[Q14]`/`(DS art. N)`/`[RATIFICAR ...]` inline o en comentario | **W5.2 (implementado)**: extraída y stripeada; `norma`/`ratificacion` compilan a `AnclaNormativa`, `[C1]`-style se conservan como candidatas (§Anclas inline) |
| `rechazada` | excede T1+T2 | diagnóstico con categoría + línea + sugerencia; vuelve al modelador/skill |

## T1 — Formas estrictas aceptadas (identidad)

Estados SIN prefijo (`X puede estar 'a', 'b' o 'c'.` — **[v0.1]** la forma con `en uno de los estados` NO es estricta: el parser la mangla; ver A2) · agente (`X maneja P.`) · instrumento (`P requiere X.` / con estado en backticks `` P requiere X en `e`. ``) · consumo (`P consume X.`) · resultado (`P genera X.`) · efecto (`P afecta X.`) · TS (`P cambia X de 'a' a 'b'.`) · **TS compacta** (`P cambia X a 'b'.` — **[v0.1]** verificado: el parser la acepta, TS5) · exhibición (`X exhibe Y.`) · agregación (`X consta de A, B y C.`) · **especialización = `A es un/una B.`** (**[v0.1]** verificado: el parser la acepta como generalización; la forma del canon textual `puede ser` es TRAMPA para este parser — la lee como declaración de estados; divergencia canon↔parser registrada para reconciliar en spec-forja-opl) · evento de estado (`X en estado 'e' inicia P.`) · invocación (`P invoca Q.`) · designación inicial/final (`'a' (inicial)`).

**[v0.1] Esencia/afiliación — regla AESS obligatoria:** la forma del corpus `X es físico/a y sistémico/a.` (sin `un objeto/proceso`) NO es estricta — cae a metadata sin crear entidad (falso positivo del parser). La forma estricta inyecta el tipo: `X es un objeto físico y sistémico.` / `X es un proceso físico y sistémico.`; el normalizador infiere objeto/proceso del contexto del proto. Fue la regla más aplicada en la falsación (83 líneas) — la v0 la subestimó.

## T2 — Azúcares con regla de reescritura determinista

| # | Forma laxa (ejemplo del corpus) | Reescritura estricta | Corpus |
|---|---|---|---|
| A1 | `A, B y C son físicas y sistémicas.` | distribuir: una oración de esencia por entidad | L17, L45, L96 |
| A2 **[v0.1 INVERTIDA]** | `X puede estar en uno de los estados 'a' o 'b'.` | **stripear** el prefijo → `X puede estar 'a' o 'b'.` (la forma estricta es SIN prefijo; el parser mangla `en uno de los estados` metiéndolo en el primer estado) | 45 líneas en falsación |
| A3 | `P afecta X (de 'a' a 'b').` | `P cambia X de 'a' a 'b'.` | L147-148 |
| A4 | estado sin comillas pegado al nombre: `requiere Paciente hospitalizado en domicilio` | `requiere Paciente en estado 'hospitalizado en domicilio'` — SOLO si el estado ya está declarado para esa entidad en el mismo proto (si no: rechazo R4) | L34, L92, L199 |
| A5 | `X consta también de Y.` / `se descompone también en ...` | fusión aditiva con la oración base previa de la misma entidad/proceso | L335, L394 |
| A6 | `P cambia X de 'a' a 'b', 'c' o 'd'.` (multi-destino) | una oración TS por destino | L224, L482 |
| A7 **[v0.1]** | `P cambia X a 'b'.` (sin estado origen) | es ESTRICTA (TS5 compacta, aceptada por el parser — verificado; la condicional R5 de la v0 se elimina: cero R5 en el corpus) | L139, L268 |
| A8 | conector `así como` / `e` en listas | `y` canónico | L175, L55 |
| A9 | `X exhibe Y como su operación[ de programa].` | `X exhibe Y.` + cola registrada como etiqueta/anotación | L2, L215 |
| A10 | `se descompone en A, B y C en esa secuencia.` | clase `estructura` con marca de orden secuencial | L145 |
| A11 | género/número del verbo copular (`es física y sistémica`) | aceptado en concordancia, PERO sujeto a AESS (ver T1 [v0.1]): sin `un objeto/proceso` no es estricta | passim |
| AESS **[v0.1]** | `X es físico/a\|informacional y sistémico/a\|ambiental.` | inyectar tipo desde contexto: `X es un objeto\|proceso … .` | 83 líneas en falsación |
| A4' **[v0.1]** | `requiere X en estado 'e'` | el estado canónico va en backticks: `` requiere X en `e` `` (evita degradación silenciosa del parser) | 17 líneas |
| A12 **[W4.3]** | disyunción `u` ante sonido /o/ en lista de estados: `puede estar 'disponible' u 'ocupado'.` | reescribir ` u '`/`` u ` `` → ` o '`/`` o ` `` **solo** tras `puede estar` (contexto de estados). El divisor de listas del parser parte SOLO por ` o `; el `u` ortográfico español rompía el split y dejaba un objeto con <2 estados. | L344, L792, L1085 |

**[W4.3] Decisión del operador (tensión 2) + GAP ortográfico A12:** el español exige `u` (no `o`) ante palabra que empieza por sonido /o/ (`'disponible' u 'ocupado'`, `'pendiente' u 'otorgado'`). El sub-dialecto del proto admite la forma ortográficamente correcta con `u`, pero el **canónico interno** queda con `o` uniforme — igual que el generador OPL forward, que nunca emite `u`. Es un GAP ortográfico ACEPTADO (decisión registrada): el proto puede escribir `u`, el modelo lo unifica a `o`. A12 NO toca `u` fuera de una lista de estados.

**[v0.1] GAP de parser registrado (no es deuda del normalizador):** la multiplicidad SUFIJA (`… con multiplicidad 0..N.`) parsea sin error pero el AST la absorbe en el nombre del destino (9 líneas del corpus — degradación silenciosa). La canónica es PREFIJA (`1..N **X**`). Pendiente: o el normalizador reescribe a prefija, o el parser gana soporte del sufijo — decidir en W4.2.

Reglas T2 obligatorias: (i) cada reescritura registra `{original, regla}`; (ii) **idempotencia**: normalizar(normalizar(x)) = normalizar(x); (iii) ninguna regla inventa información que no esté en la línea o en el proto ya leído (A4 mira declaraciones previas, jamás adivina nombres de estado).

## Familia V — verbos/patrones extendidos (decisiones del operador 2026-06-04)

**[v0.2]** El operador (sesión W4.3-rechazos) decidió mapear hacia primitivas OPM la mayoría de los rechazos T3 del corpus. Cada mapeo produce una línea `normalizada` (1:1) o `compuesta` (1:N emisiones, con o sin abanico). Las emisiones que conservan superficie de parser van como **oración** (ruta parser→AST→emisor); las que el parser reverse no sabe re-leer (enlaces TAGGED, modificador con gatillo, anotaciones libres) van como **directiva** (ruta directa del emisor). Implementación: `app/src/autoria/compilar/normalizador.ts` (`mapearFamiliaV`) + `emisor.ts` (`emitirDirectiva`/`emitirCompuesta`).

**[P3 2026-06-05] Contrato de migración:** con P3 ratificado, la Familia V queda congelada como compatibilidad transitoria del compilador. El léxico abierto y la estandarización normativa migran a `modelamiento-opm` E2 (`normalizar-proto`); el contrato operativo vive en `docs/proto-modelo/contrato-migracion-familia-v-skill.md` y el ledger F1 en `docs/proto-modelo/ledger-familia-v-skill.md`. No agregar nuevos verbos V al compilador salvo bugfix con prueba negativa.

**Canal de anotación elegido** (decisión registrada): el verbo de capacidad preservado (V6) viaja en `enlace.etiqueta` — canal serializable que **round-trip en el OPL forward** (`P afecta O. [etiqueta: compromete]`), el menos invasivo que ya serializa sin contaminar el verbo nuclear. Las **colas de modelado fino** (V10 `para …`, V12 `cuando/según/dentro de …`, y la decisión XOR no agrupable de V14/V15) viajan como **`AnclaNormativa` con `estado: pendiente-ratificacion`** sobre el enlace target — el canal diseñado para "pendiente de modelado fino" (`docs/proto-modelo/diseno-ancla-normativa.md`), trazable y no-OPL.

| # | Forma del corpus (rechazo previo) | Mapeo OPM | Fundamento |
|---|---|---|---|
| V1 | `X [en 's'] habilita P` (X objeto, P proceso) | instrumento con `modificador: condicion` desde X[ en `s`] hacia P | "habilitar" = el estado/existencia de X es **condición** del proceso (gatillo sin consumo). Incluye `X habilita P` sin estado. |
| V2 | `X en 'e' restringe P` | instrumento-condición desde X en el estado **complementario**, SOLO si X es **binario** (exactamente 2 estados); si no → rechazo con diagnóstico | "restringir desde 'e'" ≡ "habilitar desde el complemento". La binariedad es la única lectura unívoca (`Cupo ocupado restringe` ≡ `Cupo disponible habilita`). |
| V3 | `X [en 's'] puede iniciar P` | misma ruta evento que `inicia` (evento sin portador: instrumento-evento si X objeto-en-estado, invocación-evento si X proceso) | `puede iniciar` = `inicia` con modalidad; el modelo no distingue la modalidad deóntica. |
| V4 | `O alimenta P` | `P requiere O` (instrumento) | "alimentar" un proceso con un objeto = el proceso lo **requiere** como insumo persistente. |
| V5 | `P detecta O` | `P genera O` (resultado) | "detectar" produce el objeto-evento detectado como **resultado** del proceso de vigilancia. |
| V6 | `P compromete/libera O` | `P afecta O` + verbo original en `enlace.etiqueta` | "comprometer/liberar" capacidad = un **efecto** sobre el recurso; el matiz se preserva como anotación serializable. |
| V7 | `A precede a B` (procesos) | `A invoca B` (invocación) | precedencia temporal estricta proceso→proceso = invocación (disparo secuencial). |
| V8 | `A puede suceder a un B [opcional]` | enlace **etiquetado** «sucede a» A→B (+ multiplicidad `0..1` si `opcional`) | relación de orden no procedural entre objetos = relación estructural fundamental **etiquetada** (no hay primitiva nuclear). |
| V9 | `A corresponde a un B` | etiquetado «corresponde a» A→B | correspondencia/mapeo entre objetos = relación estructural etiquetada. |
| V10 | `A cumple B [para el acto]` | etiquetado «cumple» A→B + cola `para …` anotada (ancla pendiente) | "cumplir" un requisito/competencia = relación etiquetada; el alcance (`para …`) es modelado fino pendiente. |
| V11 | `A habilita B` (AMBOS objetos) | etiquetado «habilita» A→B | habilitación objeto→objeto (no proceso) = relación estructural etiquetada (distinta de V1). |
| V12 | cola condicional `… cuando/según/por una …`; y R4 `requiere X dentro del Y` | compila el hecho principal (TS/efecto/requiere) + cola anotada como ancla pendiente sobre el enlace | la cláusula condicional/de alcance es **decisión de modelado fino** que no degrada el hecho nuclear ya verdadero. |
| V13 | guard compuesto `X en 'a' con Y 'b' inicia P` | evento desde X en `a` (ruta W4.3) **+** instrumento-condición desde Y en `b` hacia P | dos guards conjuntos = dos enlaces reactivos (uno evento-gatillo, otro condición). |
| V14 | `P cambia X a 'e', o inicia Q` | transición (efecto P→X a `e`) + invocación-evento P→Q + **abanico XOR** | dos consecuencias alternativas. El kernel exige abanicos **homogéneos**: efecto+invocación no agrupan → la decisión XOR queda anotada como ancla pendiente sobre cada rama. |
| V15 | `X en 's' inicia A o B` / `S puede iniciar A o B` | dos ramas evento + **abanico XOR** | disyunción de consecuencias. El XOR se forma cuando las ramas comparten un puerto de **entidad** (S proceso → invocaciones); con gatillo-estado (X objeto), el kernel no agrupa puertos-estado → la decisión XOR queda anotada. |
| V16 | `P notifica a <R> [contenido]` | `P genera Notificación` (resultado) + etiquetado «dirigido a» Notificación→R; el contenido → cola anotada | **[adjudicación dov-dori 2026-06-05 (e)]** notificar = producir un mensaje y entregarlo. Descompone en primitivas existentes — el enum de verbos NUNCA se infla. NO es `afecta <R>`: el receptor no cambia de estado; lo nuevo en el mundo es el mensaje. |
| V17 | `X está acotado por <Y>` | **bifurcado por firma de extremos** (R-OPL-SE-2): `<Y>` temporal (`plazo de N días`) → `X exhibe Plazo` + literal como cola anotada; `<Y>` restricción abstracta → etiquetado «está acotado por» X→Y | **[adjudicación dov-dori 2026-06-05 (d)]** OPM no tiene primitiva de timing (límite del formalismo, declarado): la salida canónica es R-PROC-6/R-OPL-PERSIST-3. El valor («30 días») es DATO del atributo, no parte del nombre. Resuelve la ex-en-reflexión #2 de HODOM. |

**Guards anti-silencio (adjudicación dov-dori 2026-06-05, hallazgos (a)/(c) — la lección: reconocer formas y rechazar, jamás enumerar instancias ni absorber lo ambiguo):**

- **R8** (normalizador): esencia con `son` sobre sujeto NO-lista = nombre plural sin sufijo `Conjunto`/`Grupo` (R-NOM-OBJ-1/2) → rechazo con sugerencia. JAMÁS se normaliza a esencia singular conservando el nombre plural (sería plantar barro).
- **R9** (guard del emisor, cae como `fallo` con diagnóstico): un nombre-a-crear con material no nominal residual (paréntesis/corchete colgante, localizador `art./§/N°` suelto) NO crea entidad en silencio — casi siempre es una cita normativa no extraída absorbida al nombre (el bug del segundo dominio: `Permiso de edificación (LGUC art. 116)` ≠ `Permiso de edificación`, dos entidades para una cosa). Capa 2: `detectarDuplicadosPorAbsorcion(modelo)` (`compilar/absorcion.ts`) atrapa el patrón en modelos ya construidos.
- **Detector de citas por LOCALIZADOR** (no por enum de cuerpos): el alfabeto de cuerpos normativos es ABIERTO (LGUC, OGUC, DFL, NCh, Código Civil, ISO…) — la señal cerrada y transversal es el localizador (`art./§/inc./letra/N°/numeral/título`) o cuerpo-en-mayúscula + numeración legal. Ver §Anclas.

**Los 4 que SIGUEN rechazados (EN REFLEXIÓN del operador, no se mapean):**

1. `Cupo HODOM proyecta la Capacidad de prestaciones comprometida como día-cama para REM.` (R3 `proyecta` — proyección/derivación no resuelta).
2. `… y los demás veredictos parciales determinan Solicitud … como 'aceptada', 'en espera' o 'rechazada'.` (R6 cola informal de lista + `determinan…como`).
3. `Equipo HODOM consta de … y Otros profesionales según prestaciones.` (R6 cola informal `y Otros … según …`).
4. `Inspección pre-ruta habilita Vehículo de transporte para 'en ruta'.` (R3 — proceso→objeto con cola `para 'estado'`; V1 NO la captura por exigir objeto→proceso sin cola `para`).

(El histórico #2, `está acotado por`, salió de la lista: adjudicado → **V17**.)

## T3 — Rechazos con diagnóstico (categorías)

**[v0.2]** Tras la Familia V, R3/R7 se reducen a los verbos **aún sin mapeo decidido** (`proyecta`, `determinan…como`, `está acotado por`) y a la forma proceso→objeto-con-cola de `habilita`. Las colas condicionales (R1) y disyunciones (R2) ya NO se rechazan salvo la cola informal de lista (R6).

| Cat | Patrón | Estado en v0.2 | Diagnóstico al modelador |
|---|---|---|---|
| R1 | cláusula condicional `cuando ...` / `por una ...` / `según ...` | **mayoría → V12/V13** (cola anotada / guard compuesto); solo persiste lo que no es hecho procedural compilable | "condición no modelable como cláusula: modélala como estado-guard, evento o declárala supuesto" |
| R2 | disyunción de cláusulas (`..., o inicia Y` / `inicia A o B`) | **→ V14/V15** (TS+evento / ramas evento + abanico XOR) | "dos hechos alternativos en una oración: sepáralos o modela la decisión (abanico XOR)" |
| R3 | verbo fuera del enum cerrado | **reducido**: `alimenta`→V4, `detecta`→V5, `compromete/libera`→V6, `habilita`(obj→proc)→V1, `restringe`(binario)→V2, `puede iniciar`→V3/V15, `cumple`→V10. **Persisten SIN mapeo**: `proyecta`, `determinan…como`, `habilita`(proc→obj con cola `para 'estado'`) | "verbo '<v>' no es del catálogo: elige el verbo OPM que corresponde (propuestas: …) o declara el hecho como pendiente" |
| R4 | estado no declarado usado por A4/A7 | `requiere X dentro del Y` → **V12** (requiere X + cola anotada) | "el estado '<e>' no está declarado para <X>" |
| R5 | TS sin origen no aceptada por el parser | — (cero en el corpus) | "indica el estado de origen" |
| R6 | cola informal en lista (`y Otros profesionales según prestaciones`) | **persiste** (EN REFLEXIÓN): elemento no nominal no se adivina | "elemento de lista no nominal: nómbralo o decláralo fuera del modelo" |
| R7 | oración relacional libre | `precede a`→V7, `suceder a`→V8, `corresponde a`→V9, `está acotado por`→**V17** (adjudicado 2026-06-05) | "relación no primitiva: usa enlace etiquetado canónico o exhibición" |
| R8 | esencia con `son` sobre sujeto no-lista (nombre plural) | **nuevo** (adjudicación (a)) | "nombre plural sin sufijo Conjunto/Grupo (R-NOM-OBJ-1/2): renómbralo 'Conjunto de …'/'Grupo de …' o usa el singular" |

**Importante:** un rechazo NO es fracaso del flujo — es el sub-dialecto haciendo su trabajo. Tras la Familia V, los rechazos del corpus HODOM bajan de **31 → 5**, y esas 5 están EN REFLEXIÓN del operador (no decidió aún su mapeo): el normalizador devuelve el barro al humano (anti-complacencia) en lugar de adivinar una semántica no resuelta.

## Anclas inline (W5.2 — IMPLEMENTADO)

> **Estado:** implementado en `app/src/autoria/compilar/{normalizador,anclas,compilador}.ts`
> (W5.2, 2026-06-04). El diseño adjudicado es `docs/proto-modelo/diseno-ancla-normativa.md`.
> El alcance determinista del compilador son las marcas DENTRO de bloques ```opl (hechos y
> comentarios `#`); las citas en PROSA interbloque son alcance de la skill E2, fuera de W5.2.

### Extracción (`extraerAnclasDeLinea`, clase `ancla`)

El normalizador EXTRAE (y **stripea** antes de clasificar/parsear) las marcas; la oración
LIMPIA sigue su camino normal. Tres clases de ancla, espejo del diseño:

| Forma en el proto | Clase extraída | Compila a |
|---|---|---|
| `(DS art. N[, M…])` · `(NT 2024 §X)` · `(Ley N art. M)` | `norma` (con `referencias`) | `AnclaNormativa` `estado: vigente` |
| `… DS art. 17 #frontera-art17` (inline con `#clave`, sin paréntesis) | `norma` + `claveExplicita` | `AnclaNormativa` `vigente` |
| `[RATIFICAR[ #clave][: texto]]` | `ratificacion` | `AnclaNormativa` `pendiente-ratificacion` |
| `[C1]` · `[Q14]` · `[B3]` · `[C4/D]` | `candidata` | **NADA** (§10.3: jamás compila por defecto) |

Los `articulos` se conservan **verbatim** (`["15-17"]` NO se expande a `["15","16","17"]` — §10.5).

### Compilación al modelo (`compilar/anclas.ts`)

- **Regla de target.** El ancla se adjunta al hecho PRINCIPAL de su línea, en este orden:
  (1) si la línea emite uno o más ENLACES → target = el **primer enlace** creado;
  (2) si no, pero la línea declara una ENTIDAD (descripción/`puede estar`) → target = esa **entidad**;
  (3) si la línea es un COMENTARIO de bloque (o no produjo enlace/entidad) → target = el **OPD** del bloque.
- **Regla de claveProto.** Si el autor acuñó `#clave` explícita, esa manda (con prefijo de
  género `ancla:`/`ratificar:`). Si no, derivación **determinista** que **NO depende de la nota
  libre editable** (C1/L9): `<genero>:<norma+articulos>-<slug-del-target>` para normas,
  `ratificar:<slug-del-target>` para `[RATIFICAR]`. Sobrevive a cualquier reedición de la nota.
  Colisiones → sufijo numérico `-N` estable.
- **Estado.** `vigente` para citas normativas; `pendiente-ratificacion` para `[RATIFICAR]`
  (con `nivelAutoridad: operador-modelado` por default — la app NO decide autoridad, §8).

### Contabilidad L8 (registro consultable + ledger)

`ResumenLedger` reporta `anclasDetectadas / anclasCompiladas / anclasCandidatas / anclasEnRechazadas`,
con la invariante **detectadas == compiladas + candidatas + en-rechazadas**. Un ancla sobre una
línea RECHAZADA NO se pierde: queda en el ledger junto al diagnóstico de su línea (no se compila,
porque el hecho no tiene target). El registro consultable son `enumerarAnclas` / `anclasPendientes`
(kernel `app/src/modelo/anclasNormativas.ts`); el reporte de `emitirBundle` lista el conteo con el
desglose de pendientes (solo si hay anclas — byte-identidad preservada).

## Contrato del normalizador (W1.2)

```ts
// app/src/autoria/compilar/normalizador.ts — función pura, sin IO
type LineaNormalizada =
  | { clase: "estricta"; oracion: string }
  | { clase: "normalizada"; oracion: string; original: string; regla: string }   // A1..A12/AESS
  | { clase: "estructura"; oracion: string; secuencial?: boolean; aditiva?: boolean }
  | { clase: "comentario"; texto: string; anclas: Ancla[] }
  // [v0.2] FAMILIA V: 1..N emisiones (oración → parser; directiva → emisor directo),
  // opcionalmente agrupadas en un abanico XOR/OR sobre los enlaces creados.
  | { clase: "compuesta"; emisiones: Emision[]; original: string; regla: "V1".."V17";
      agrupar?: { operador: "O"|"XOR" } }
  | { clase: "rechazada"; original: string; categoria: "R1"|...|"R7"; diagnostico: string };
normalizarBloqueOpl(lineas: string[], contexto: ContextoProto): LineaNormalizada[]
// contexto acumula estados declarados por entidad (para A4/R4/V2) — se construye en una pasada previa.
```

## Ley L1 (sella esta gramática)

El normalizador es **total** sobre T1+T2 (toda línea T1/T2 produce `estricta|normalizada` cuyo texto **parsea sin `unsupported-kernel`** en `parsear.ts`, salvo clase `estructura`), **idempotente**, y **rechaza-con-diagnóstico** todo lo demás. **[v0.2]** Para la Familia V, la ley L1 aplica sobre las emisiones-**oración** de una línea `compuesta` (cada una parsea estricta); las emisiones-**directiva** se validan por el efecto en el modelo emitido (firma de enlace del kernel + round-trip OPL forward donde el generador tiene superficie: tagged `A sucede a B.`, efecto anotado `[etiqueta: …]`). Fixtures positivos y negativos obligatorios (`app/src/autoria/compilar/familia-v.test.ts`); falsación: el corpus HODOM completo (reporte en `docs/proto-modelo/falsacion-2026-06-04.md`), rechazos 31→5.
