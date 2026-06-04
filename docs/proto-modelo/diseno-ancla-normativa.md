# Diseño de `AnclaNormativa` — extensión de trazabilidad normativa del proto-modelo

> **v0 ADJUDICADO bajo mandato autónomo del operador (2026-06-04: «terminar todo este trabajo en forma completamente autónoma y hasta el final»).** Las 6 decisiones del §9 quedan resueltas en §10 adoptando las recomendaciones del propio diseño; todas reversibles a costo declarado. Gate W1.5 cerrado por delegación; revisión del operador bienvenida.
> No implementa nada. Especifica el tipo, su anclaje, la clave estable, la
> sintaxis en el proto, la disciplina OPL-meta, el schema del log de decisiones
> y las leyes L8/L9 operacionalizadas. Cierra el item W1.5 del backlog
> contingencial. Consolida la sección preliminar `gramatica-subdialecto-v0.md:60-64`.

**Fecha:** 2026-06-04 · **Autoridad:** realiza D2/D7/L8 del acta
`docs/auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` y C1/C2
de `docs/auditorias/2026-06-04-acta-mesa-equilibrio-encarnacion.md`.

## 0. Tensión que el tipo resuelve (y dictamen de no-aplicabilidad ontológica)

La pregunta socrática primera: **¿una cita legal `DS art. 17` es una cosa del
modelo?** No. No existe (no es objeto: no tiene esencia física ni
informacional propia del sistema modelado) ni sucede (no es proceso: no
transforma nada). Es **contenido meta del autor sobre el modelo** — la
procedencia normativa de una decisión de modelado, no una primitiva ontológica.

El casillero SSOT es exacto y ya está escrito:

- **R-DOC-7** (`reglas-opm-estrictas-es.md:104`): una capacidad no canonizada por
  la SSOT «DEBE clasificarse como `UI / vista`, `No canonizado` o **`extensión
  declarada`**, nunca como OPM nuclear». `AnclaNormativa` es *extensión declarada*.
- **V-204** (`:215`): «un comentario / sticky note es contenido meta del autor;
  no pertenece a gramática nuclear». El ancla es de esa familia.
- **R-BR-4** (`:1233`, deriva de `V-204`): «notas y sticky notes son contenido
  meta del autor; **NO emiten OPL nuclear**».

Por tanto el tipo es **resuelto en diseño** como las extensiones aditivas ya
vivas (`ontologia`, `satisfaccionesRequisito`, `submodelos` en `modelo.ts:42-44`),
no como cuarta primitiva. La trazabilidad **nivel-hecho** queda fuera de la
garantía de preservación hasta F5 (acta D9/L8: «resuelta en diseño, diferida en
ejecución»).

## 1. El tipo `AnclaNormativa` (sketch TypeScript)

Vive junto a sus hermanas en `app/src/modelo/tipos/extensiones.ts` (donde ya
están `SatisfaccionRequisito` y `RequisitoEntidadMetadata`).

```ts
// Una referencia normativa atómica. Una sola norma; los rangos de artículos
// del corpus ("arts. 8, 15-17, 21") se modelan como articulos: string[].
export interface ReferenciaNorma {
  norma: string;        // "DS 1/2022", "NT 2024", "Ley 20.584" (texto libre del autor)
  articulos?: string[]; // ["15", "17"], ["art. 16 letra c"] — verbatim del proto
  seccion?: string;     // "§Protocolos clínicos", "§emergencias"
}

export type EstadoAncla = "vigente" | "pendiente-ratificacion";

// Nivel de autoridad requerido para resolver un pendiente (C1, acta encarnación).
// La app NO decide autoridad: registra cuál se declaró en el proto.
export type NivelAutoridad = "operador-modelado" | "mesa" | "dt-seremi-legal";

// Estados del ciclo de ratificación (C1). La app marca el intermedio; el salto
// a "ratificado-con-fuente" exige fuente y vuelve al proto vía re-elicitación.
export type EstadoRatificacion = "pendiente" | "anotado-en-mesa" | "ratificado-con-fuente";

export interface AnclaNormativa {
  id: Id;                       // clave estable nacida en el proto (ver §3)
  target: TargetAncla;          // a qué se adjunta (ver §2)
  estado: EstadoAncla;          // vigente | pendiente-ratificacion
  referencias?: ReferenciaNorma[]; // 0..N normas; ausente/[] permitido para pendientes puros
  nota?: string;                // glosa del autor: "requisitos", "exclusiones", "6 causales"

  // --- Solo cuando estado === "pendiente-ratificacion" (rama [RATIFICAR], C1) ---
  ratificacion?: {
    nivelAutoridad: NivelAutoridad;     // quién debe resolver (declarado, no decidido)
    estadoRatificacion: EstadoRatificacion;
    fuente?: string;                    // acta/fuente; OBLIGATORIO para "ratificado-con-fuente"
    responsable?: string;               // dueño del pendiente (C1: sin dueño envejece invisible)
    anotadoEn?: string;                 // ISO date — cuándo se marcó "anotado-en-mesa"
    ratificadoEn?: string;              // ISO date — cuándo pasó a "ratificado-con-fuente"
  };
}
```

**Decisión: `[RATIFICAR]` es `AnclaNormativa` con `estado:
"pendiente-ratificacion"`, NO un tipo hermano `DecisionPendiente`.** Justificación
(la mesa ya la fijó en D2: «`[RATIFICAR]` = ancla con `estado: pendiente-ratificacion`»):

1. **Continuidad ontológica.** Un `[RATIFICAR]` y un `DS art. 17` son el mismo
   género — procedencia/justificación normativa de una decisión de modelado.
   Difieren solo en el eje *hecho ↔ supuesto* (tensión sustantiva A): el ancla
   vigente es un hecho ya confirmado; el pendiente es un supuesto declarado
   bloqueante. Un solo tipo con un campo de estado expresa esa tensión sin
   duplicar estructura. Inventar `DecisionPendiente` sería partir un tipo por
   uno de sus estados — el anti-patrón que la deuda categorial del proyecto ya
   nombra (coproducto tagged vs campos paralelos, `CLAUDE.md §Deuda categorial`).
2. **Un solo enumerador, una sola exhibición.** El panel de paquete lista
   *anclas* y filtra por estado; no reconcilia dos colecciones.
3. **Composición con el log.** La transición `pendiente → anotado-en-mesa →
   ratificado-con-fuente` (C1) es una transición de estado **del ancla**, no la
   vida de otro objeto. El log (§6) registra transiciones de `AnclaNormativa`.

La sub-estructura `ratificacion?` opcional aísla los campos C1 a la rama
pendiente: un ancla `vigente` no arrastra `nivelAutoridad`/`responsable` vacíos.

## 2. Cardinalidad y anclaje — extensión del patrón `{target}`

El molde es `SatisfaccionRequisito.target` (`extensiones.ts:27-37`), hoy
`tipo: "entidad" | "enlace"`. `AnclaNormativa` lo **amplía a cuatro niveles**
(la cardinalidad que D2/L8 comprometen: entidad / enlace / OPD / modelo):

```ts
export type TargetAncla =
  | { tipo: "entidad"; id: Id }
  | { tipo: "enlace"; id: Id }   // ← el nivel crítico: enlace de frontera (§7)
  | { tipo: "opd"; id: Id }      // ancla de OPD/refinamiento (encabezado markdown)
  | { tipo: "modelo" };          // ancla de modelo entero (sin id: hay un solo modelo)
```

`anclasNormativas` es un campo **top-level aditivo y opcional** del `Modelo`,
gemelo de sus hermanas (`modelo.ts:42-44`):

```ts
// modelo.ts — se SUMA, no reemplaza nada:
anclasNormativas?: Record<Id, AnclaNormativa>;
```

**Compatibilidad demostrada (acta c3, supuesto aditivo):** la serialización es
allowlist-por-construcción. `json.ts:166-169` emite cada extensión con spread
condicional `...(tiene ? { campo } : {})`; un bundle sin anclas no gana ninguna
clave (byte-identidad sobre opcional ausente — el oráculo D6/L3 de hd-opm v1.6
se preserva). El validador replica el patrón de
`validarSatisfaccionesRequisito` (`json.ts:212-238`): resuelve `target.id`
contra `entidades`/`enlaces`/`opds`, rechaza ids colgantes, y para
`tipo:"modelo"` no exige id. Bundles existentes intactos por construcción.

## 3. Clave estable nacida en el proto

**Restricción dura (RB-1 del acta madre, `dsl.ts:194,239,255`,
`abanicos.ts:39`):** los ids del bundle son **posicionales** — se asignan por
orden de emisión del compilador. No sirven como identidad de un ancla: una
recompilación que reordene un OPD reasigna ids y el log/registro pierde el
hilo. La identidad **debe nacer en el proto** (Besto, acta encarnación §3;
`icas-identidad-relacion`).

Dos candidatos ponderados:

| Opción | Cómo | A favor | En contra |
|---|---|---|---|
| **(a) id explícito** en el proto: `[RATIFICAR#conv-ges: ...]`, `(DS art. 17 #frontera-art17)` | el autor (o el LLM al extraer, humano confirma) acuña una clave-slug estable | estable bajo CUALQUIER reedición (mover, reescribir la nota, reordenar el OPD); legible en el log; alineado con C1 «clave estable nacida en el proto» | exige que el autor/LLM acuñe la clave; un ancla sin clave explícita no tiene identidad estable (degrada a hash) |
| **(b) hash de contenido**: `hash(normaNormalizada + articulos + nota + targetSlug)` | derivada determinista del contenido del ancla | cero fricción de autoría; automática | **frágil ante edición**: corregir una nota o un artículo cambia el hash → el log cree que es un ancla nueva y el pendiente ratificado «reaparece» (rompe L9); colisión si dos anclas idénticas penden de targets distintos sin incluir el target |

**Recomendación: (a) id explícito como clave canónica, con (b) hash como
fallback de continuidad — NO como identidad primaria.**

Porqué el híbrido y no (b) sola: el ciclo de re-elicitación (C1/L9) exige que
un pendiente *ratificado* no reaparezca pendiente. Eso solo se garantiza si la
identidad **sobrevive a la edición del contenido** — y editar la nota de un
ancla mientras se ratifica es el caso normal, no el borde. El hash de contenido
falla exactamente ahí. El id explícito es la única clave que cumple C1 al pie
de la letra. El hash entra solo como **heurística de reconciliación** cuando un
ancla aún no tiene id explícito (modelos viejos, extracción incompleta): el
compilador propone «este ancla sin clave parece la misma que `#frontera-art17`
por hash» y el humano confirma o acuña la clave. La clave, una vez acuñada,
manda; el hash nunca la sobrescribe.

Forma de la clave: slug kebab-case con prefijo de género — `ancla:frontera-art17`,
`ratificar:convenio-ges`. Único dentro del modelo. El `id` del bundle
(posicional) sigue existiendo para el grafo interno; el slug es la **clave de
trazabilidad** que viaja al log y al registro. (Decisión menor para el operador:
si el slug ES el `id` del Record o un campo `claveProto` paralelo — §«Decisiones
al operador».)

## 4. Sintaxis en el proto-modelo (consolida `gramatica-subdialecto-v0.md:60-64`)

**Principio (D2, HITL-1 "bastante libre"):** autoría natural en la superficie,
estructura en el artefacto compilado. El modelador escribe como siempre; el LLM
(E2) propone la extracción a `AnclaNormativa`; el humano confirma. La prosa
**nunca** se restringe (gramática `:7-9`); solo las anclas tienen forma
reconocible.

Formas inline soportadas (verificadas contra el corpus real HODOM, 57
ocurrencias — `modelo-opm-hodom-completo.md`):

| Forma en el proto | Ejemplo real (archivo:línea) | Se extrae a |
|---|---|---|
| Cita en prosa de cierre de bloque | `Anclaje DS art. 15 (requisitos) + art. 17 (exclusiones).` (`:312`) | `referencias:[{norma:"DS",articulos:["15","17"]}]`, `nota:"requisitos / exclusiones"`, target = entidad/proceso del bloque |
| Multi-norma + multi-artículo + sección | `DS 1/2022 arts. 8, 15-17, 21; NT 2024 §emergencias/protocolos` (`:653`) | `referencias:[{norma:"DS 1/2022",articulos:["8","15","16","17","21"]},{norma:"NT 2024",seccion:"§emergencias/protocolos"}]` |
| Inline parentético | `(DS art. 12)` (`:683`), `(NT 2024 §X)` | `referencias:[{norma:"DS",articulos:["12"]}]` |
| `[RATIFICAR ...]` con texto libre | `[RATIFICAR] Se reifica como atributo del Establecimiento … que gatea la elegibilidad` (`:1236`) | ancla `estado:pendiente-ratificacion`, `nota:` = texto, `ratificacion.nivelAutoridad` propuesto por el LLM |
| Etiqueta de sección/tema | `# Flota y móviles [C1]` (`:1155`), `[Q16]`, `[B3]` | ancla de OPD (`target.tipo:"opd"`), o anotación de consenso; **el LLM propone, el humano decide si es ancla normativa o solo marca de tópico** |

Forma de **id explícito** (nueva, opcional, la innovación de W1.5): el autor o
el LLM añade un slug tras `#`:

```
Anclaje DS art. 17 #frontera-art17.
[RATIFICAR #convenio-ges: ¿el Convenio HODOM es objeto-frontera o fuera de alcance?]
```

El normalizador (clase `ancla`, `gramatica-subdialecto-v0.md:21`) **extrae y
conserva** la línea; la **emite a `AnclaNormativa` solo en F5** (hasta entonces:
conservada junto a la oración, `:64`). La extracción es asistida: el compilador
produce un *candidato* de `AnclaNormativa` por cada marca detectada; el reporte
de compilación los lista para confirmación humana (E2 «LLM propone, humano
valida», acta D8). **Nunca adivina** la norma ni el nivel de autoridad: si la
marca es ambigua (`[C1]` ¿es ancla o tópico?), la clasifica como candidato
no-confirmado, no como ancla emitida.

## 5. Disciplina OPL-meta — el ancla NO contamina

**Regla dura (R-BR-4/R-DOC-7):** una `AnclaNormativa` **no emite ninguna oración
OPL nuclear**. No genera frases del catálogo 23/23. El OPL forward del modelo es
proyección de `modelo × vista` (`generar.ts:87,99`) y el ancla **no entra en esa
proyección como hecho**.

Exhibición permitida (capa meta declarada, a lo sumo estilo `«…»` — restricción
F5 del acta, línea 94):

- **En el panel OPL:** las anclas se muestran en una **franja meta separada y
  rotulada** («Procedencia normativa», read-only), nunca intercaladas con las
  oraciones nucleares. Forma sugerida, no-OPL: `«Categorización del paciente —
  DS art. 12; NT 2024 §Protocolos clínicos»`. Las comillas angulares y el rótulo
  de sección la marcan inequívocamente como meta. El round-trip OPL bisimétrico
  (`roundtrip.test.ts`) **ignora** la franja meta: el parser reverse no la lee
  como hecho, por lo que no hay frase que reconciliar y la bisimetría nuclear
  queda intacta.
- **En el canvas:** opcional, como afordance UI (marcador/badge en la cosa o el
  enlace anclado) — afordance, no gramática (`V-202/V-203`, citadas en
  `reglas-opm-estrictas-es.md:216`). Fuera del alcance de W1.5 (es exhibición
  E6, no tipo).

La prueba de no-contaminación es L8 más su negativa (§7): si una `AnclaNormativa`
produjera una frase que el parser reverse intenta parsear como hecho, el fixture
negativo de bimodalidad debe fallar.

## 6. Schema del log de decisiones (C2, versionado v0)

Cuando el operador anota/registra una transición de un pendiente en la mesa, la
app **exporta** una entrada de log (la app registra, no decide — §8). Formato
versionado, gemelo del paquete:

```ts
// deep-opm-pro.log-decisiones.v0 — emitido por OpForja, consumido por la skill
interface EntradaLogDecision {
  claveAncla: string;                 // el slug estable del proto (§3), NO el id posicional
  transicion: {                       // qué cambió
    de: EstadoRatificacion;           // p.ej. "pendiente"
    a: EstadoRatificacion;            // p.ej. "anotado-en-mesa"
  };
  nivelAutoridad: NivelAutoridad;     // declarado en el ancla
  fuente?: string;                    // acta/fuente — OBLIGATORIO si a === "ratificado-con-fuente"
  responsable?: string;               // dueño
  fecha: string;                      // ISO date del acto en la mesa
  modeloHash: string;                 // hash del modelo en que se anotó (procedencia, conecta D7/L6)
}

interface LogDecisiones {
  schema: "deep-opm-pro.log-decisiones.v0";
  emitidoEn: string;                  // ISO
  modeloHash: string;                 // hash del modelo fuente
  entradas: EntradaLogDecision[];
}
```

**Contrato de consumo (C2, derivado a custodio-kora):** el log alimenta el
estado **`re-elicitar`** que `modelamiento-opm` gana en KORA. Contrato
(solo el contrato; la skill se actualiza fuera de este repo):

> Dado un `LogDecisiones` v0, la skill DEBE, para cada `EntradaLogDecision` con
> `transicion.a === "ratificado-con-fuente"`, reabrir el ancla correspondiente
> en el proto (matchea por `claveAncla`), incorporar `fuente`/`responsable`/`fecha`,
> y transicionar el ancla de `estado:pendiente-ratificacion` a `estado:vigente`
> en la siguiente emisión del bundle. El estado intermedio `anotado-en-mesa` NO
> muta el proto (es marca de la app); solo `ratificado-con-fuente` dispara la
> mutación del proto. Ratificar es **acto de modelado** (supuesto→hecho),
> propiedad del canal E0-E2, no de la app (acta encarnación, aporte Resto).

**ANTI-ESTERILIDAD (Besto):** no se construye el exportador del log hasta que el
estado `re-elicitar` esté comprometido en la skill. Un log write-only sin
consumidor es ceremonia. (Gate de construcción, no de diseño.)

## 7. Leyes L8 y L9 operacionalizadas

### L8 — toda ancla del proto se compila a `AnclaNormativa` enumerable

**Enunciado (acta D9):** toda ancla normativa del proto se compila a
`AnclaNormativa` de primera clase (entidad/enlace/OPD/modelo), enumerable y
exhibida estructurada. Hasta F5, trazabilidad nivel-hecho fuera de la garantía.

- **Fixture positivo:** un proto con las 5 formas del §4 → compilar → el bundle
  porta N `AnclaNormativa` con sus `referencias`/`target`/`estado` correctos;
  `enumerarAnclas(modelo)` las devuelve todas.
- **Fixture negativo de L8:** un proto con una marca `(DS art. 17)` adjunta a un
  bloque cuyo target **no resuelve** a ninguna entidad/enlace/OPD → el compilador
  **rechaza con diagnóstico** (no emite un ancla colgante ni la descarta en
  silencio). Falla como debe: «ancla sin target resoluble: línea L_, norma DS
  art. 17». La «exclusión silenciosa» que el acta prohíbe (L2/L8) queda
  falsada.

### L9 — convergencia del ciclo (acta encarnación C2)

**Enunciado:** un pendiente ratificado y re-elicitado NO reaparece pendiente.

- **Caso de prueba positivo (round-trip nivel-ENLACE):** el enlace de frontera
  clínico↔programa de HODOM, anclado a `DS art. 17` (la exclusión que separa el
  episodio clínico del programa — evidencia en `modelo-opm-hodom-completo.md:1019`
  «Anclaje DS art. 17» + el cospan clínico-programa de `:976`/`:152`). Ciclo
  completo:
  1. proto: `... frontera clínico↔programa (excl. art. 17) [RATIFICAR
     #frontera-art17] ...` → compila a `AnclaNormativa{ target:{tipo:"enlace",
     id:<enlace-frontera>}, estado:"pendiente-ratificacion",
     referencias:[{norma:"DS",articulos:["17"]}], ratificacion:{nivelAutoridad:
     "dt-seremi-legal", estadoRatificacion:"pendiente"} }`.
  2. en la mesa: operador marca `anotado-en-mesa` → export `EntradaLogDecision{
     claveAncla:"frontera-art17", transicion:{de:"pendiente",a:"anotado-en-mesa"} }`.
  3. operador registra ratificación con fuente → export con
     `transicion.a:"ratificado-con-fuente", fuente:"Acta R17"`.
  4. la skill re-elicita: el ancla pasa a `estado:"vigente"` en el proto.
  5. **assert L9:** recompilar → la `AnclaNormativa#frontera-art17` es `vigente`,
     **no reaparece** `pendiente-ratificacion`. La clave estable (§3, id
     explícito) es lo que hace el match en el paso 4 — por eso el id de contenido
     no sirve (editar la nota entre 1 y 4 lo rompería).
- **Fixture negativo de L9:** simular un compilador que deriva la clave por hash
  de contenido y editar la nota del ancla entre el paso 1 y el 4 → el match
  falla → el ancla `vigente` **reaparece como pendiente** → L9 **falla como
  debe**, demostrando por qué la recomendación §3(a) es la correcta.

Este es exactamente el «un ancla nivel-enlace real de hd-opm round-tripea
estructurada» que el gate F5 exige (acta D10).

> **Nota de honestidad (dov-dori):** la etiqueta literal «frontera clínico↔programa
> (excl. art. 17)» es una **construcción ilustrativa de la mesa**, no una cita
> verbatim del proto. El enlace de frontera y su anclaje a `art. 17` SÍ son reales
> (`:1019`, `:976`); la redacción exacta de la etiqueta del enlace se fija al
> implementar el round-trip. No se modela lo que no se confirmó.

## 8. Qué NO hace `AnclaNormativa` (alcance negativo)

| NO es / NO hace | Por qué |
|---|---|
| **NO es cuarta primitiva ontológica** | es *extensión declarada* (R-DOC-7), contenido meta (V-204); no es objeto ni proceso ni estado. El SD sigue teniendo dos building blocks y solo dos. |
| **NO emite OPL nuclear** | R-BR-4/R-DOC-7; a lo sumo capa meta `«…»` en franja rotulada (§5). |
| **NO valida contenido legal** | la app no verifica que «DS art. 17» diga lo que el modelador cree; registra la procedencia que el autor declaró. Verdad del dominio = del operador (no invadir el dominio). |
| **NO decide autoridad** | `nivelAutoridad` es lo *declarado* en el proto, no un juicio de la app. La app registra; la mesa/DT/SEREMI decide; la skill re-elicita. |
| **NO ratifica** | el click marca `anotado-en-mesa` (estado intermedio persistido). `ratificado-con-fuente` exige fuente y solo muta el proto vía re-elicitación de la skill (acto de modelado, canal E0-E2). |
| **NO es segunda superficie de edición** | los paneles del paquete son read-only (acta encarnación, aporte Resto); la bimodalidad no gana un tercer canal. |
| **NO rompe bundles existentes** | aditiva y opcional; serialización allowlist; byte-identidad de hd-opm v1.6 preservada (D6/L3). |
| **NO entra en alcance hasta F5** | W1.5 = *diseño aprobado*; la implementación (kernel/serialización/compilador/checker/exhibición) es F5 (acta D10). |

## 9. Decisiones que dejo explícitamente al operador

1. **¿`DecisionPendiente` separado o estado del ancla?** — Recomiendo
   **estado del ancla** (`estado:"pendiente-ratificacion"`, §1), por continuidad
   ontológica y para no partir un tipo por uno de sus estados. Decisión final
   del operador; si prefiere un tipo hermano, lo respeto pero advierto el costo
   (dos colecciones, dos exhibiciones, reconciliación).
2. **Clave estable: ¿el slug ES el `id` del `Record` o un campo `claveProto`
   paralelo?** — Recomiendo `claveProto` paralelo al `id` posicional (preserva
   el esquema del bundle que D6/F3 exigen no alterar; el slug viaja al log). La
   alternativa (slug como id del Record) es más limpia conceptualmente pero toca
   la asignación de ids del bundle → re-pin gobernado.
3. **¿Las etiquetas `[C1]`/`[Q14]`/`[B3]` son anclas normativas o marcas de
   tópico/consenso?** — En el corpus son ambos según el caso. Recomiendo: el LLM
   las clasifica como **candidatas no-confirmadas**; el operador decide caso a
   caso si una etiqueta dada se promueve a `AnclaNormativa` (target OPD) o queda
   como anotación no-compilable. No las emito a anclas por defecto.
4. **Nivel de enforcement de la extracción asistida** — confirmar que es
   «proponer, humano valida» (E2) y nunca emisión automática sin confirmación.
   (Asumido así por D2/D8; lo dejo explícito por ser una línea de fricción.)
5. **Granularidad de `articulos`** — ¿expandir rangos (`15-17` → `["15","16","17"]`)
   o conservar verbatim (`["15-17"]`)? Recomiendo **verbatim** (no inventar
   información que el autor no escribió, principio del normalizador
   `gramatica-subdialecto-v0.md:44`); la expansión es presentación, no dato.
6. **Prioridad de construcción** — W1.5 es solo el diseño; la implementación es
   F5 y está sujeta a la prioridad del backlog contingencial (decisión HITL-3
   del acta madre). Confirmar si F5 precede o sigue al resto del backlog.

## 10. Adjudicación autónoma (2026-06-04, mandato del operador)

Bajo el mandato «terminar todo de forma completamente autónoma y hasta el final», se adoptan las recomendaciones del §9 — criterio: la opción reversible de menor blast radius en cada caso:

| # | Decisión adoptada | Reversibilidad |
|---|---|---|
| 1 | **Estado del ancla** (`pendiente-ratificacion`), sin tipo hermano | migración mecánica si se parte el tipo después |
| 2 | **`claveProto` paralelo** al id posicional | renombrable; no toca el esquema de ids del bundle (D6/F3 intactos) |
| 3 | `[C1]`/`[Q14]`/`[B3]` = **candidatas no-confirmadas** (jamás anclas por defecto) | promoción caso a caso, siempre disponible |
| 4 | **«Proponer, humano valida»** confirmado como enforcement (coherente con D2/D8 ya consensuados) | — |
| 5 | **Verbatim** en `articulos` (la expansión de rangos es presentación) | expandible en render sin tocar el dato |
| 6 | La implementación queda en **W5/F5 según el orden del backlog contingencial** (tras W4), sin adelantamiento | re-priorizable por el operador |
