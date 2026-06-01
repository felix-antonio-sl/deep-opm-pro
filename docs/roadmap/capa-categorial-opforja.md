# Plan de diseño — Capa categorial de opforja (cimiento + 4 pisos)

> **Estado:** propuesta de diseño para el equipo de desarrollo. No implementado.
> **Fecha:** 2026-06-01.
> **Alcance:** `app/` + `docs/`. Los cambios a la SSOT OPM (KORA) van como **propuestas** (§8), no se ejecutan sin `custodio-kora`.
> **Precede a:** un corte activo en `docs/roadmap/` por fase.

---

## 0. Resumen ejecutivo

OPM modela espléndidamente *qué hay, qué transforma a qué y cómo se descompone* (**eje vertical**: refinamiento). Le falta el álgebra de *cómo se componen los sistemas y cómo se igualan dos formas de hacer lo mismo* (**eje horizontal**). Este plan dota a opforja del eje horizontal **sin tocar las primitivas OPM**, como una semántica verificable bajo la superficie.

**Insight rector:** las mejoras no son proyectos independientes. Son **un cimiento y cuatro usos** del mismo objeto computable — *el hecho OPM reificado*:

| Nivel | Opera sobre el conjunto de hechos como… |
|---|---|
| **Cimiento** — Hecho OPM reificado | proyección y comparación |
| **Linealidad** | restricción de copia sobre hechos |
| **Piso 1 — Composición** | unión por interfaz (pushout) |
| **Piso 2 — Equivalencia** | igualdad de frontera |
| **Piso 3 — Razonamiento** | cierre / derivación |

**Orden de fundamentación forzoso:** Cimiento → (Composición + Linealidad) → Equivalencia → Razonamiento. Cada peldaño habilita el siguiente; el **riesgo a la legibilidad crece con la altura**.

**Pre-autorización del corpus.** No es injerto externo: `metodologia-forja §0.2-0.3` ya declara *"el método es una fibración sobre el plano de validez; el lifting es cartesiano"* y *"lentes formales solo como nota al margen, nunca como el principio"*. `spec-forja-opl §19-20` ya formaliza simetría OPD↔OPL, la ley `safe-lens` y una tabla de GAPs. Este plan **consolida y extiende** esa semilla.

---

## 1. Marco, principios y precedencia

**Vector axiológico (techo de diseño):** la legibilidad para el experto de dominio es el límite. Toda mejora que obligue al modelador humano a aprender teoría de categorías para usar OPM es una regresión, por rigurosa que sea.

**Principio rector (firmado en consenso previo):** *comparar siempre en la denotación de hechos, nunca en la superficie* (ni strings OPL ni layout de canvas).

**Disciplina de lenguaje:**
- **En código:** vocabulario OPM/dominio (`pegadoOpd`, `seccionLocal`, `componerModelos`, `realizacionAlternativa`, `derivar`). Nunca `functor`, `pushout`, `2-cell` en identificadores de UI.
- **En docs:** la lectura formal (sheaf, cospan, 2-célula, topos) se explica y cita la URN ICAS correspondiente.

**Decisiones fijadas:**
1. No se tocan primitivas OPM (objeto, proceso, estado, enlace, refinamiento).
2. La capa vive como semántica + leyes ejecutables + UX opcional; nunca como sintaxis obligatoria.
3. No se modifica el wire format `deep-opm-pro.modelo.v0` salvo adiciones retrocompatibles, declaradas por fase.
4. Cambios a SSOT KORA = propuestas (§8); deciden el operador + `custodio-kora`.
5. Cada capa nueva es **opcional bajo demanda**: quien no la usa no la ve.

**Lectura categorial del molde (docs, no código):** OPM es una estructura **bipartita** (objetos = portadores de estado / coalgebras; procesos = transformaciones / spans). El eje vertical es una **fibración de Grothendieck** sobre el árbol OPD (`urn:fxsl:kb:icas-extension`); el eje horizontal son **categorías monoidales + structured cospans** (`urn:fxsl:kb:icas-composicion-estructura`, `urn:fxsl:kb:icas-escala`); la consistencia entre vistas es una **condición de sheaf** (`urn:fxsl:kb:icas-topoi`).

---

## 2. CIMIENTO — Hecho OPM reificado

**Para quién:** kernel. **Esfuerzo:** M. **Riesgo legibilidad:** nulo (invisible). **Misión:** sin cambio.

### 2.1 Contrato semántico
El modelo deja de compararse por su grafo o su texto y empieza a compararse por su **conjunto de hechos atómicos**. Un *hecho* es la unidad mínima que tanto la generación OPL (hoy `lineas+refs`) como el parseo (hoy `AST`) como el grafo del modelo representan de forma distinta. Reificar el hecho da una denotación común a las tres.

### 2.2 Kernel (`app/src/modelo/hechos/`, puro)
```ts
// Unión discriminada de hechos atómicos OPM (capa semántica, NO primitiva nueva)
type Hecho =
  | { tipo: "entidad"; entidadId: Id; clase: TipoEntidad; esencia: Esencia; afiliacion: Afiliacion; lineal?: boolean }
  | { tipo: "estado"; entidadId: Id; estado: string; designaciones: Designacion[] }
  | { tipo: "enlace"; clase: TipoEnlace; origen: Id; destino: Id; modificador?: "e" | "c"; estadoEspecificado?: string }
  | { tipo: "abanico"; operador: "AND" | "XOR" | "OR"; ramas: Id[]; pr?: number[] }
  | { tipo: "refinamiento"; padre: Id; hijo: Id; mecanismo: TipoRefinamiento }

type ConjuntoDeHechos = ReadonlySet<Hecho> // con igualdad estructural, no por referencia

// Proyección pura — la denotación del modelo
function hechosDe(modelo: Modelo, opdId?: Id): ConjuntoDeHechos
// La fibra: hechos sobre una identidad visibles en un OPD (presheaf Vis : OPD^op → Set)
function seccionLocal(modelo: Modelo, entidadId: Id, opdId: Id): ConjuntoDeHechos
// Comparadores estructurales
function hechosIguales(a: Hecho, b: Hecho): boolean
function interseccionHechos(a: ConjuntoDeHechos, b: ConjuntoDeHechos): ConjuntoDeHechos
```

### 2.3 Leyes ejecutables (`app/src/leyes/`)
| Ley | Enunciado | Estado |
|---|---|---|
| `law-hechos-proyeccion` | `hechosDe` es total y determinista sobre todo modelo válido. | nueva |
| `law-opl-safe-lens` | (ya existe en `opl-reverse.test.ts`) ausencia de línea no borra hecho; preview puro. | reusar |
| `law-pegado-opd` | para toda identidad, sus `seccionLocal` por OPD **pegan**. Severidad: **separación contradictoria → `error-consistencia`**; **gluing pendiente → `advertencia-consistencia`**. Ambas salen por **diagnóstico**, no por gate. | nueva (= consenso sheaf-check) |

### 2.4 Integración y UX
- **No** entra en `serializacion/json.ts::validarModelo` (ese es gate de integridad referencial; el pegado es consistencia semántica → canal de diagnóstico).
- Alimenta el `PanelMetodologia` existente (clasificación tripartita: bloqueo / metodológico / estilo). El pegado entra como categoría metodológica.
- Foco acotado del pegado: como `tipo/esencia/afiliacion` viven en `Entidad` global, esas contradicciones son **imposibles por construcción**. El target real es la fibra local por `Apariencia`: `estadosSuprimidos`, `contextoRefinamiento`, `parteExtraidaDe` + enlaces con estado especificado.

### 2.5 Costo / dependencias
Blast radius: `modelo/hechos/` (nuevo), `leyes/` (3 leyes), `serializacion/` (consumir diagnóstico). Sin dependencias previas. **Habilita los cuatro pisos.**

---

## 3. LINEALIDAD (comprometida — entra con Piso 1)

**Para quién:** kernel + UI + docs/SSOT. **Esfuerzo:** S-M. **Riesgo legibilidad:** bajo. **Misión:** sin cambio.

### 3.1 Contrato
Distinguir objetos **lineales** (recursos que se consumen y no se copian: materia, energía, dinero, datos sensibles, obligaciones) de objetos **copiables** (default actual, preserva comportamiento). OPM ya está a medio camino: su `consumo` es lineal en espíritu.

### 3.2 Kernel
- `Entidad.lineal?: boolean` (default `false` = copiable; retrocompatible).
- Restricción semántica: un objeto lineal no puede ser usado simultáneamente por dos procesos sin un *split* explícito, ni identificarse/copiarse libremente al componer (§4).
- Ley `law-lineal-no-clona`: un objeto lineal no aparece como recurso duplicado en el conjunto de hechos.

### 3.3 UX (opforja)
- Marcador en el **Inspector** (sección propiedades/esencia): toggle "lineal".
- Glifo en canvas: **a definir por el gate `design:governance`** (no inventar; respetar `ui-forja/08-jointjs-styling.md` y el canon cromático — crimson off-limits en OPD).
- Feedback: si un objeto lineal es consumido por dos procesos, diagnóstico en `PanelMetodologia`.

### 3.4 Docs / SSOT (propuesta)
Proponer a `opm-es §Propiedades genéricas` una cuarta genérica: **copiabilidad** (lineal / copiable), junto a esencia, afiliación, perseverancia. **Requiere `custodio-kora`.**

---

## 4. PISO 1 — Composición (⊗ monoidal + structured cospans)

**Para quién:** kernel + UI/UX + docs/SSOT. **Esfuerzo:** M. **Riesgo legibilidad:** bajo. **Misión:** sin cambio (extiende submodelos).

### 4.1 Contrato semántico
- **Interfaz** de un modelo/OPD = subconjunto de entidades-frontera, cada una con rol `import` o `export`.
- **Composición por interfaz (cospan / pushout):** pegar dos modelos identificando entidades de interfaz compatibles; lo compartido aparece **una sola vez**, el resto se une.
- **Composición monoidal `⊗`:** caso con interfaz vacía (yuxtaposición disjunta). Unidad = modelo vacío. Leyes: asociatividad, unidad.
- Reutiliza `app/src/modelo/submodelos.ts` (`compartidas` se formaliza como el *legging* del cospan).

### 4.2 Kernel
```ts
type Interfaz = { exporta: Id[]; importa: Id[] }
function interfazDe(modelo: Modelo, opdId: Id): Interfaz
function componerModelos(a: Modelo, b: Modelo, mapeo: Record<Id, Id>): Resultado<Modelo> // pushout
```
Leyes: `law-composicion-asociativa`, `law-composicion-unidad`, `law-composicion-no-duplica` (lo compartido aparece una vez), `law-composicion-bien-tipada` (interfaces compatibles — interactúa con linealidad: no identificar un lineal con dos consumidores).

### 4.3 UI/UX (opforja)
- **Puertos de interfaz** visibles en submodelos (entidades-frontera marcadas export/import).
- Acción **"Componer"** (paleta Cmd+K + menú de submodelo): seleccionar dos modelos → **diálogo de mapeo** (auto-match por identidad/nombre + ajuste manual arrastrando puerto↔puerto) → opforja calcula el pushout y **materializa el compuesto** (reusa `materializacion` de LF-04).
- Render: cosas compartidas **fusionadas/transparentes** (encaja con el pendiente "tratamiento visual rico de cosas compartidas").
- OPL del compuesto = **colímite** de los OPL locales (recorrido del árbol, ya descrito en la semántica).

### 4.4 Docs / SSOT (propuesta)
Formalizar `compartidas` como interfaz de cospan + la operación de composición, como **nota transversal** que extiende `spec-forja-opl §19` (donde ya vive el pegado). Posible nueva sub-sección §21 "Composición por interfaz". **Consolidación, no nueva primitiva.**

### 4.5 Costo / dependencias
Depende de: Cimiento + Linealidad. Blast radius: `modelo/` (composición + interfaz), `serializacion/` (validar pegado — reusa `law-pegado-opd`), `store/` (acción), `ui/` (diálogo), `render/` (compartidas transparentes).

---

## 5. PISO 2 — Equivalencia (2-células: alternativas de diseño)

**Para quién:** kernel + UI/UX + docs/SSOT. **Esfuerzo:** M-L. **Riesgo legibilidad:** medio (mitigable por lenguaje). **Misión:** leve (de describir a comparar).

### 5.1 Contrato semántico
Una **relación de segundo nivel** entre dos refinamientos *hermanos* del mismo padre: declarar que la descomposición A y la B de un proceso *P* son **realizaciones alternativas equivalentes** sobre la interfaz del padre. opforja **verifica** (no solo registra) que ambas tienen el mismo conjunto-previo→posterior observable.

### 5.2 Por qué es mejora *desde dentro* (no injerto)
`metodologia-forja §A0.1-A0.3` **ya exige** generar ≥3 conceptos de solución y separar función (solution-neutral) de forma (solution-specific), pero OPM **no tiene cómo relacionar formalmente esos conceptos rivales**. La equivalencia es la pieza que **cierra el método A0 que la SSOT ya prescribe**.

### 5.3 Kernel
```ts
type RealizacionAlternativa = { padreId: Id; opdA: Id; opdB: Id; sobreInterfaz: Id[] }
function verificarEquivalencia(modelo: Modelo, eq: RealizacionAlternativa)
  : Resultado<{ equivalente: boolean; diferencias?: ConjuntoDeHechos }>
// Compara seccionLocal de la frontera del padre — REUSA el cimiento
```
Leyes: `law-equivalencia-frontera` (A≡B sii misma frontera observable), `law-equivalencia-reflexiva-simetrica`.

### 5.4 UI/UX (opforja)
- **OPD tree:** dos hijos del mismo padre se marcan como **"variantes / realizaciones alternativas"** (badge nuevo junto a SD/Inzoom/Unfold).
- **Panel equivalencia:** declarar A ≡ B; mostrar el resultado de la verificación; si no coinciden → diagnóstico en `PanelMetodologia` (reusa cimiento).
- **Selector de variante activa:** ver el sistema "con la variante A" vs "con la B" (reusa la maquinaria de apariencias-por-OPD ya existente).
- OPL: *"P se realiza por [descomposición A] o [descomposición B], equivalentes sobre {interfaz}."*

### 5.5 Docs / SSOT (propuesta)
Proponer a `metodologia-forja §A0` la "equivalencia de realizaciones" como **cierre formal de A0.1-A0.3**. Toca la capa de método (forja), de **menor precedencia** que el plano de validez → propuesta más liviana. **Requiere `custodio-kora`.**

### 5.6 Costo / dependencias
Depende de: Cimiento + Composición. Blast radius: `modelo/` (relación + verificador), `modelo/tipos` (OPD gana rol variante), `leyes/`, `ui/` (panel + selector + badge), `render/`.

---

## 6. PISO 3 — Razonamiento (versión mínima, con frontera dura)

**Para quién:** kernel + UI/UX + docs. **Esfuerzo:** L (mínimo). **Riesgo legibilidad:** bajo (opcional); **riesgo de scope creep: alto**. **Misión:** sin cambio en versión mínima.

### 6.1 Contrato — y la frontera (Ψ anti-ilusión)
**Versión mínima (la única de este plan):** un **motor de derivación** sobre el grafo de hechos que hace *computables las inferencias que OPM ya define implícitamente* (herencia de la especialización, distribución de enlaces en refinamiento, unión de estados `R-OPL-TOTAL-5`, precedencia en recomposición). NO es un demostrador de teoremas ni lógica de primer orden.

**Frontera dura (fuera de alcance, documentada):** cuantificadores, deducción general, razonador tipo Datalog/topos interno. Eso **cambia la misión de OPM** y es otra premisa. Cualquier PR que cruce esta frontera se rechaza en review.

### 6.2 Kernel
```ts
type Consulta =
  | { tipo: "afectan-a"; entidadId: Id }
  | { tipo: "requerido-por"; procesoId: Id }      // cierre transitivo de precondiciones
  | { tipo: "alcanzable"; entidadId: Id; estado: string }
  | { tipo: "impacto-de-eliminar"; elementoId: Id }
function derivar(modelo: Modelo, c: Consulta): ConjuntoDeHechos // puro; marca hechoInferido vs hechoDeclarado
```
Leyes: `law-derivacion-pura` (determinista, sin efectos), `law-derivacion-no-contradice` (un hecho inferido nunca contradice uno declarado — si lo hiciera, es inconsistencia del modelo, no de la derivación).

### 6.3 UI/UX (opforja)
- **Consola de consultas** en la paleta Cmd+K: conjunto **cerrado** de preguntas predefinidas (no lenguaje libre al inicio).
- Resultado: **subgrafo resaltado en canvas** + frases en OPL con badge visible **"inferido"** vs **"declarado"** (jamás mezclar — sería ilusión).
- Se enchufa al exportador de diagnóstico JSON existente.

### 6.4 Docs / SSOT
Mayormente docs en opforja. Impacto SSOT mínimo: documentar **qué regla `opm-es` funda cada consulta** (herencia, distribución, R-OPL-TOTAL-5). No es norma nueva; es hacer computable lo que la norma ya implica.

### 6.5 Costo / dependencias
Depende de: Cimiento (idealmente también Composición/Equivalencia para consultas inter-modelo). Blast radius: `modelo/` (motor puro), `ui/` (consola), `render/` (resaltado).

---

## 7. Plan de implementación (fases, TDD, gates)

Cada fase es TDD: **ley/test primero (rojo) → kernel → UI → docs → gate verde**. Comandos desde `app/`.

| Fase | Contenido | Gate de cierre |
|---|---|---|
| **F0 — Cimiento** | `modelo/hechos/`, `law-hechos-proyeccion`, `law-pegado-opd`; integrar diagnóstico en `PanelMetodologia`. Sin UI nueva. | `bun run check` + leyes verdes. **Sin** tocar `validarModelo`. |
| **F1 — Composición + Linealidad** | `Entidad.lineal`, `componerModelos`, interfaz, 4 leyes composición + `law-lineal-no-clona`; UX puertos + diálogo + compartidas transparentes; docs §4.4/§3.4. | `bun run check` + `bun run design:governance` + e2e + leyes verdes. |
| **F2 — Equivalencia** | `RealizacionAlternativa`, `verificarEquivalencia`, leyes; UX variantes + panel + selector; docs A0. | igual que F1 + reconciliación e2e. |
| **F3 — Razonamiento mínimo** | `derivar` + 4 consultas, 2 leyes; UX consola Cmd+K + badges inferido/declarado; docs reglas-fuente. **Frontera anti-creep en CONTRIBUTING.** | igual que F1 + revisión explícita de frontera. |

**Criterios de aceptación transversales:**
- Ninguna fase convierte render/display en fuente de verdad.
- Ninguna fase mete consistencia semántica en el gate de import.
- No cambia `deep-opm-pro.modelo.v0` salvo adiciones retrocompatibles declaradas (F1: `lineal?`).
- Toda capa es opcional bajo demanda.
- El equipo puede añadir una operación nueva respondiendo: qué preserva / qué pierde / qué ley la cubre / qué regla SSOT la funda.

**Trabajo paralelo:** F0 es prerrequisito duro. F1/F2/F3 pueden particionarse con la skill `lineas-paralelas` una vez F0 está en `main` (worktrees aislados, olas con orden de merge, reconciliación e2e final).

---

## 8. Impacto en la SSOT (KORA) — propuestas, no ejecución

> Gobernanza: manda el **plano de validez** (`opm-es` > `opl-es`=`opd-es`); el plano de método (`metodologia-forja`) no deroga validez. Todo lo siguiente lo decide el operador + `custodio-kora`. El plan **no** edita KORA.

| Pieza SSOT | Cambio propuesto | Precedencia / dificultad |
|---|---|---|
| `opm-es §Propiedades genéricas` | Añadir **copiabilidad** (lineal/copiable) como 4ª genérica. | Alta precedencia (núcleo) → cuidado. |
| `metodologia-forja §A0` | Añadir **equivalencia de realizaciones** como cierre de A0.1-A0.3. | Menor precedencia (método) → liviano. |
| `spec-forja-opl` | Nueva §21 **Composición por interfaz** (cospan); consolidar el pegado ya semillado en §19. | Realización → medio. |
| (razonamiento) | Documentar qué reglas existentes fundan cada consulta. No norma nueva. | Trivial. |

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Romper legibilidad del experto** (techo axiológico) | Lenguaje de dominio en UI; capas opcionales bajo demanda; razonamiento solo versión mínima. |
| **Scope creep en razonamiento** | Frontera dura documentada en CONTRIBUTING; review rechaza FOL/demostrador. |
| **Regresión de fixtures** | Cimiento no toca `validarModelo`; pegado sale por diagnóstico, no por gate. |
| **Divergencia OPL forward/reverse** | Cimiento unifica la denotación (hecho reificado); roundtrip se compara en hechos, no en strings. |
| **Deuda de selección (coproducto tagged)** | No la dispara este plan, pero F2 añade un tipo seleccionable (variante) → vigilar el trigger A→B documentado en CLAUDE.md. |

---

## 10. No-alcance (descartado con razón)

- **Session types, sagas, coreografía, event-sourcing** (`icas-protocolos`, `icas-agencia`): dominio de sistemas distribuidos; OPM-lenguaje no compite ahí. Capa de realización, no de modelado conceptual.
- **∞-categorías, HoTT pleno, conjuntos simpliciales, double categories explícitas como primitiva**: maquinaria; el modelador de dominio nunca las toca. (La doble categoría se usa como *lente de docs*, no como primitiva.)
- **Razonamiento ambicioso** (Datalog / topos interno con cuantificadores): cambia la misión de OPM; otra premisa.
- **Ausencias deliberadas correctas:** estados solo en objetos (dualidad álgebra/coalgebra), state-primary, first-order por defecto. Un extraterrestre categorial las firma.

---

## Anexo — Trazas a código (anclaje para el equipo)

| Subsistema | Archivos clave (verificados en exploración) | Rol en el plan |
|---|---|---|
| Kernel dominio | `modelo/`, `modelo/tipos/`, `modelo/operaciones/refinamiento/`, `modelo/submodelos.ts` | Cimiento + pisos (puro) |
| Leyes | `leyes/opl-reverse.test.ts` (safe-lens), `leyes/proyecciones.test.ts`, `leyes/refinamiento-cascadas.test.ts` | leyes ejecutables |
| OPL bimodal | `opl/generar.ts`, `opl/generadores/`, `opl/parser/{parsear,planificar,aplicar}.ts`, `opl/roundtrip.test.ts`, `opl/fixtures-roundtrip.ts` | hecho reificado + colímite OPL |
| Serialización | `serializacion/json.ts::validarModelo`, `serializacion/validar*.ts`, `validarIntegridad.ts::validarReferenciasOpd` | diagnóstico de pegado (NO gate) |
| Store | `store/runtime.ts` (`commitModelo`), `store/runtimeEffects.ts`, slices | acciones componer / equivalencia / consultas |
| Render | `render/jointjs/proyeccion.ts` (`proyectarModeloAJointCells`), `composers/` | puertos, compartidas transparentes, resaltado |
| UI | Inspector (tabs por intención), PanelOpl, OPD tree, paleta Cmd+K, PanelMetodologia | marcadores, diálogos, paneles, consola |

> Nota: los nombres exactos de componentes UI deben confirmarse contra el árbol `app/src/ui/` al iniciar cada fase; este anexo fija subsistemas y puntos de anclaje, no un diff.
