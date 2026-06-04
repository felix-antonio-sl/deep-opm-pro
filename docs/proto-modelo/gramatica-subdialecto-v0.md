# Gramática del sub-dialecto del proto-modelo — v0.1 (falsada contra HODOM)

**Fecha:** 2026-06-04 · **Estatus:** v0.1 — **falsada** contra el corpus HODOM (52 bloques, 469 líneas; cobertura sobre hechos 93.4%, ley L1 verde 100%; evidencia: `docs/proto-modelo/falsacion-2026-06-04.md`). Absorbe las 4 divergencias spec-vs-parser de la falsación. Candidata a promoción KORA cuando estabilice.
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
| `ancla` | marcador `[C1]`/`[Q14]`/`(DS art. N)`/`[RATIFICAR ...]` inline o en comentario | capa de anclas (W1.5/F5); hasta entonces, conservada con la oración |
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

**[v0.1] GAP de parser registrado (no es deuda del normalizador):** la multiplicidad SUFIJA (`… con multiplicidad 0..N.`) parsea sin error pero el AST la absorbe en el nombre del destino (9 líneas del corpus — degradación silenciosa). La canónica es PREFIJA (`1..N **X**`). Pendiente: o el normalizador reescribe a prefija, o el parser gana soporte del sufijo — decidir en W4.2.

Reglas T2 obligatorias: (i) cada reescritura registra `{original, regla}`; (ii) **idempotencia**: normalizar(normalizar(x)) = normalizar(x); (iii) ninguna regla inventa información que no esté en la línea o en el proto ya leído (A4 mira declaraciones previas, jamás adivina nombres de estado).

## T3 — Rechazos con diagnóstico (categorías)

| Cat | Patrón | Ejemplos del corpus | Diagnóstico al modelador |
|---|---|---|---|
| R1 | cláusula condicional `cuando ...` / `por una ...` / `según ...` | L139, L199, L268, L398, L435, L482 | "condición no modelable como cláusula: modélala como estado-guard, evento o declárala supuesto" |
| R2 | disyunción de cláusulas (`..., o inicia Y` / `inicia A o B`) | L183, L201, L429 | "dos hechos alternativos en una oración: sepáralos o modela la decisión (abanico XOR)" |
| R3 | verbo fuera del enum cerrado | `determinan...como` L66, `detecta` L181, `restringe` L237, `alimenta` L307/420, `cumple` L130, `corresponde a` L346, `está acotado por` L438, `precede a` L279/426, `habilita` L110/232/238/333, `suceder a` L21, `compromete/libera/proyecta` L483-485 | "verbo '<v>' no es del catálogo: elige el verbo OPM que corresponde (propuestas: …) o declara el hecho como pendiente" |
| R4 | estado no declarado usado por A4/A7 | — | "el estado '<e>' no está declarado para <X>" |
| R5 | TS sin origen no aceptada por el parser | — | "indica el estado de origen" |
| R6 | cola informal en lista (`y Otros profesionales según prestaciones`) | L171 | "elemento de lista no nominal: nómbralo o decláralo fuera del modelo" |
| R7 | oración relacional libre | L438, L21, L346 | "relación no primitiva: usa enlace etiquetado canónico o exhibición" |

**Importante:** un rechazo NO es fracaso del flujo — es el sub-dialecto haciendo su trabajo: las líneas R1-R3 del corpus codifican decisiones de modelado reales (guards compuestos, alternativas, semántica de dominio) que el modelador debe resolver con la skill, no que un normalizador deba adivinar.

## Anclas inline (diseño preliminar; se consolida en W1.5)

- En comentario de bloque: `# Flota y móviles [C1]` → ancla de sección `{tipo: consenso, id: C1}`.
- Inline en prosa/hecho: `(DS art. 17)`, `(NT 2024 §X)`, `[RATIFICAR: ...]` → ancla `{norma, articulo}` / pendiente.
- El normalizador las **extrae y conserva** junto a la línea; no las compila (hasta F5/`AnclaNormativa`) ni las rechaza.

## Contrato del normalizador (W1.2)

```ts
// app/src/autoria/compilar/normalizador.ts — función pura, sin IO
type LineaNormalizada =
  | { clase: "estricta"; oracion: string }
  | { clase: "normalizada"; oracion: string; original: string; regla: string }   // A1..A11
  | { clase: "estructura"; oracion: string; secuencial?: boolean; aditiva?: boolean }
  | { clase: "comentario"; texto: string; anclas: Ancla[] }
  | { clase: "rechazada"; original: string; categoria: "R1"|...|"R7"; diagnostico: string };
normalizarBloqueOpl(lineas: string[], contexto: ContextoProto): LineaNormalizada[]
// contexto acumula estados declarados por entidad (para A4/R4) — se construye en una pasada previa.
```

## Ley L1 (sella esta gramática)

El normalizador es **total** sobre T1+T2 (toda línea T1/T2 produce `estricta|normalizada` cuyo texto **parsea sin `unsupported-kernel`** en `parsear.ts`, salvo clase `estructura`), **idempotente**, y **rechaza-con-diagnóstico** todo lo demás. Fixtures positivos y negativos obligatorios; primera falsación: el corpus HODOM completo (reporte en `docs/proto-modelo/falsacion-2026-06-04.md`).
