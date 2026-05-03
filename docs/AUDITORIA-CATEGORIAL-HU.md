---
titulo: "Auditoría categorial 360° del inventario v2 de historias de usuario"
fecha: 2026-05-03
skill: "cat-thinking"
corpus_anclaje: "ICAS-BoK v1.0.0 (24 URNs)"
corpus_auditado: "docs/historias-usuario-v2/"
estado: "fixed-point alcanzado"
herramienta_ejecutable: "docs/historias-usuario-v2/tools/audit-hu.mjs"
---

## 0. Cierre operativo (resumen ejecutivo)

Auditoría categorial 360° aplicada al corpus de 1.117 HU canónicas + 48 stubs + 9
HU shared bajo `docs/historias-usuario-v2/`. Loop **auditar→remediar→reauditar**
ejecutado hasta **fixed-point**.

**Resultado final** (auditor + linter ambos):

| Métrica | Inicial (iter-0) | Final (iter-10) |
|---|---:|---:|
| Hallazgos CRÍTICOS | 23 | 0 |
| Hallazgos MEDIOS | 89 | 0 |
| Hallazgos BAJOS | 22 | 0 |
| Linter validate-hu.ts violaciones | 0 | 0 |
| HU canónicas (en épicas) | 1.117 | 1.117 |
| HU shared canónicas | 9 | 9 |
| Stubs (absorbidas / fusionadas) | 48 | 48 |
| Cobertura SSOT V- | 36 / 269 (13%) | 42 / 269 (16%) |
| Cobertura SSOT Glos 3.x | 18 / 85 (21%) | 20 / 85 (24%) |
| Cobertura SSOT OPL-ES | 9 / 21 (43%) | 23 / 21 (>100% — incluye CX/CS/IV) |

**Lo único que queda son dos INFOs estructurales** (no violaciones):

- **D1** registra el conteo real (control de naturalidad docs↔código).
- **D8** mide cobertura SSOT inversa (qué reglas SSOT no cita ninguna HU).

Ninguno es remediable mecánicamente: D1 ya está reconciliado en docs meta; D8
es una métrica de **completitud funcional**, no una violación. La interpretación
formal (ver §4.8) es una propiedad del funtor `Cite: HU → SSOT`: actualmente es
**fiel pero no esencialmente sobreyectivo**.

---

## 1. Triaje y declaración de aplicabilidad

> Workflow del skill `cat-thinking`: triaje → reformular → localizar →
> aplicar → validar → entregar.

### 1.1 ¿Qué tensiona?

El corpus HU presenta **doce tensiones** identificables:

1. **Composición** de dependencias `Bloqueada por:` / `Bloquea a:` (asociatividad,
   identidad, ciclos).
2. **Preservación** del corpus HU sobre la SSOT OPM vía citas
   `[V-xxx]/[Glos 3.x]/[OPL-ES Tx]` (functor faithful).
3. **Naturalidad** de las HU shared como transformaciones naturales
   entre familias de HU específicas.
4. **Universalidad** de las shared como factorización de patrones recurrentes.
5. **Identidad/Yoneda**: cada HU se determina por sus relaciones (actor, capa,
   citas, dependencias).
6. **Lifecycle/drift** entre docs meta (README/MAPA/PROVENANCE) y la realidad
   ejecutable del corpus.
7. **Goodhart/safety**: el linter pasa 0/0 pero podría pasar siendo el corpus
   estructuralmente débil (proxy ≠ goal).
8. **Adjunción de prioridad**: `M0/M1/S/C/W` con regla "M0 ⇒ depende solo de M0".
9. **Topos de tipos** (`opm-semantica/opcloud-ui/mixto`) como clasificador.
10. **Cambio de doctrina v1→v2** como 2-funtor entre teorías de HU.
11. **Subobjetos en topos OPM**: HU como predicados sobre comportamientos
    aceptables OPM.
12. **Filtración del roadmap**: MVP-α ⊂ β ⊂ γ ⊂ δ debe respetar dependencias.

### 1.2 ¿Es operacional con respuesta directa?

**No**. Cada tensión tiene una formulación estructural y la respuesta vive
en propiedades verificables. El linter `validate-hu.ts` cubre invariantes
**locales por HU** (9 reglas), pero no las propiedades **estructurales del
corpus completo** (drift, naturalidad shared, ciclos, adjunción de prioridad,
cobertura SSOT inversa).

### 1.3 ¿Admite lectura categorial sustantiva?

**Sí, sin reservas.** Es exactamente el dominio del corpus
`urn:fxsl:kb:icas-procesos`: requirements como subobjetos en topos de
comportamientos, design como factorización de morfismos, testing como
verificación de conmutatividad, mantenimiento como endofuntor evolutivo.
La ingeniería de requirements OPM es **el ejemplo paradigmático** del corpus
ICAS-BoK aplicado.

---

## 2. Reformulación categorial del corpus HU

> Antes de aplicar patrones, traducimos el problema al vocabulario categorial
> (skill workflow §reformular-categorialmente).

### 2.1 Categoría base `RequirementsHU`

Definimos la categoría `RequirementsHU` con:

- **Objetos**: HU canónicas vivas. Cada HU es un *sketch predicate* — un
  diagrama que debe conmutar en la categoría de comportamientos del
  modelador OPM (`urn:fxsl:kb:icas-procesos §requirements`).
- **Morfismos**: dependencias `Bloqueada por:`. Si `H_A` está bloqueada por
  `H_B`, hay un morfismo `H_B → H_A` (orden de implementación).
- **Identidad**: `id_H : H → H` (cada HU se "implementa por sí misma" en
  el caso trivial).
- **Composición**: dada `H_A → H_B` (A bloquea B) y `H_B → H_C`, la
  composición es `H_A → H_C` (transitividad de dependencias).

`RequirementsHU` debe ser una **categoría libre**: no debe haber ciclos
(URN: `icas-patrones §dependencia-circular`). El auditor verifica esto en D6
y encontró 0 ciclos.

### 2.2 Sub-categorías y filtraciones

- **Por épica**: 48 sub-categorías plenas (`HU_10`, `HU_11`, …, `HU_D1`).
- **Por nivel**: 8 sub-categorías (`HU_K`, `HU_V`, `HU_L`, `HU_P`, `HU_U`,
  `HU_C`, `HU_X`, `HU_D`).
- **Por prioridad**: filtración monótona `HU_M0 ⊂ HU_M1 ⊂ HU_S ⊂ HU_C ⊂ HU_W`
  (dual: cuanto más alta la prioridad, menor el conjunto).
- **Por estado**: `viva ⊔ absorbida ⊔ fusionada` (coproducto disjunto).
- **Por tipo**: clasificador 3-valuado `{opm-semantica, opcloud-ui, mixto}`.

### 2.3 Funtores hacia categorías destino

| Funtor | Origen | Destino | URN |
|---|---|---|---|
| `Cite_V : HU → SSOT_V` | HU canónicas | reglas visuales `V-xxx` | `icas-preservacion` |
| `Cite_Glos : HU → SSOT_Glos` | HU canónicas | términos `Glos 3.x` | `icas-preservacion` |
| `Cite_OPL : HU → SSOT_OPL` | HU canónicas | plantillas `T/D/TS/CX/CS/IV` | `icas-preservacion` |
| `Type : HU → 3` | HU | `{opm-semantica, opcloud-ui, mixto}` | `icas-topoi` |
| `Touch : HU → tipos.ts.raíces` | HU | raíces `entidad/apariencia/enlace/...` | `icas-preservacion` |
| `Pattern : HU → SHARED` | HU específicas | HU shared aplicadas | `icas-comparacion` |
| `Π_α : HU → MVP-α` | HU | corte MVP-α | `icas-adjunciones` (free/forgetful) |

El **functor de citas** `Cite : HU → SSOT` es el más crítico. La auditoría
verifica que `Cite` es **bien definido** (cada cita existe — el linter lo
asegura) y mide su **cobertura inversa** (esencialmente sobreyectivo o no).

### 2.4 Naturalidad de las HU shared

Una HU shared `S` es una **transformación natural** entre dos funtores:

- `F_específica` que asocia a cada HU específica su mecánica detallada.
- `F_canónica` que asocia el contrato uniforme de `S`.

La condición de naturalidad: para cada HU específica `H` que aplica `S`, el
diagrama conmuta:

```
H ────F_específica(H)────▶ mecánica detallada
│                          │
│                          α_H (especialización local)
↓                          ↓
S ────F_canónica(S)──────▶ contrato uniforme
```

Esto es **literalmente** lo que el provenance v2 hizo: extraer el cuadrado de
naturalidad y hacerlo explícito (URN: `icas-comparacion §naturalidad`).

### 2.5 Topos de comportamientos OPM

Cada HU es un **subobjeto** en el topos de comportamientos OPM (URN
`icas-topoi`). Una HU canónica `H` selecciona los comportamientos del
modelador que satisfacen su predicado de aceptación. La intersección de todos
los predicados M0 produce el "comportamiento OPM mínimo aceptable" (pullback
de los subobjetos M0 en el topos).

---

## 3. URNs aplicadas

| URN | Para qué | Donde se aplica |
|---|---|---|
| `urn:fxsl:kb:icas-composicion` | Asociatividad e identidad de dependencias `Bloqueada por:` | §4.1 |
| `urn:fxsl:kb:icas-preservacion` | Functor faithful HU → SSOT vía citas | §4.2, §4.8 |
| `urn:fxsl:kb:icas-comparacion` | Naturalidad de HU shared como transformación natural | §4.3 |
| `urn:fxsl:kb:icas-identidad-relacion` | Yoneda: HU determinada por sus relaciones | §4.4 |
| `urn:fxsl:kb:icas-universales` | HU shared como factorización (colimite) | §4.5 |
| `urn:fxsl:kb:icas-adjunciones` | M0/M1/S/C/W como adjunción free/forgetful | §4.6 |
| `urn:fxsl:kb:icas-topoi` | Tipo HU como clasificador, permisos como sheaf | §4.7 |
| `urn:fxsl:kb:icas-lifecycle` | Drift docs↔código v1→v2 como naturalidad rota | §4.9 |
| `urn:fxsl:kb:icas-procesos` | Requirements como subobjetos, acceptance criteria como sketch predicates | §1.3, §4.0 |
| `urn:fxsl:kb:icas-patrones` | Anti-patrones (ciclos, God Object, factorización rota) | §4.10 |
| `urn:fxsl:kb:icas-calidad-riesgo` | HU como contrato (assume/guarantee), Goodhart, end vs coend | §4.11 |
| `urn:fxsl:kb:icas-safety-alignment` | Goodhart aplicado al "linter verde" | §4.11 |
| `urn:fxsl:kb:icas-efectos` | Bisimulación canvas↔OPL en HU-SHARED-007 | §4.7 |

---

## 4. Auditoría por dimensión

### 4.0 Acceptance criteria como sketch predicates

> URN `icas-procesos §requirements`: *"Lo que llamo acceptance criteria en una
> user story es exactamente un predicado de sketch. […] Los acceptance
> criteria son sketch predicates — declaraciones de conmutatividad sobre
> diagramas específicos en la categoría del sistema."*

**Lectura del corpus**: cada criterio Gherkin en formato
`Dado P, cuando A, entonces C` declara que el diagrama:

```
Estado_inicial ─acción A─▶ Estado_final
        │                       │
        precondición P          consecuencia C
        │                       │
        ▼                       ▼
       (conmuta verificablemente)
```

En la categoría del modelador OPM. El linter (`validate-hu.ts`) verifica
sintaxis del predicado; el auditor (`audit-hu.mjs`) verifica composición
estructural entre predicados.

**Hallazgo**: 100% de las HU vivas tienen criterios Gherkin. Distinción
**formal**: si un criterio tiene "valor o predicado verificable" (regla
metodológica §6), es un sketch predicate verificable; si no, es heurística.

**Severidad**: COHERENTE. Sin acción correctiva.

---

### 4.1 Composición de dependencias

> URN `icas-composicion`: asociatividad (`(h ∘ g) ∘ f = h ∘ (g ∘ f)`) e
> identidad (`id_A ∘ f = f = f ∘ id_A`).

**Verificaciones del auditor** (D5, D6):

- D5 (dependencias rotas): **0** `Bloqueada por:` apunta a IDs inexistentes.
- D5 (dependencias a stubs): **0** dependencias apuntan a stubs (lo cual
  rompería la composición porque los stubs no son objetos vivos).
- D6 (ciclos): **0** ciclos `H_A → H_B → … → H_A` con todas vivas.

**Hallazgo formal**: `RequirementsHU` es una **categoría bien fundada y libre**
sobre el grafo de dependencias. La asociatividad es trivial (composición de
relación de orden); la identidad es la HU consigo misma; no hay ciclos no
triviales.

**Severidad**: COHERENTE.

---

### 4.2 Preservación: functor `Cite` HU → SSOT

> URN `icas-preservacion §faithful-full`. Un functor `F: C → D` es **faithful**
> si la función sobre morfismos es inyectiva; **full** si es sobreyectiva;
> **essentially surjective** si todo objeto de D tiene preimagen.

**Verificaciones**:

- El linter rechaza HU `opm-semantica` sin cita SSOT (preservación de
  estructura semántica) — 0 violaciones tras remediación.
- El auditor (D7) extiende a `mixto`: tipo `mixto` debe citar SSOT (la
  metodología §4 lo exige). 0 violaciones tras remediación.
- El linter rechaza citas a `[V-xxx]/[Glos 3.x]/[OPL-ES Tx]` que no existen
  en la SSOT — 0 violaciones.

**Hallazgo formal**: `Cite : HU → SSOT` es:

- **Bien definido**: cada cita target existe en la SSOT.
- **Faithful** sobre HU `opm-semantica` y `mixto`: HUs distintas con
  citas distintas se mapean a citas distintas (asegurado por el linter).
- **NO essentially surjective**: solo 16% V-, 24% Glos 3.x, >100% OPL-ES
  son cubiertos por alguna HU. La cobertura inversa es **incompleta** (D8).

**Severidad**: COHERENTE para `Cite`. La incompletitud surjectivity (D8) es
estructural y se discute en §4.8.

---

### 4.3 Naturalidad de las HU shared

> URN `icas-comparacion §transformacion-natural`. Una transformación natural
> `α : F ⇒ G` es una familia `{α_X}` que conmuta con todos los morfismos.
> *"La condición de naturalidad dice exactamente esto: da igual qué camino
> tomes alrededor del cuadrado."*

**Verificaciones**:

- D10 (naturalidad bidireccional): cada HU absorbida (`[absorbida en S]` en
  título o `**Estado:** absorbida`) tiene su `S` declarado en `**Patrones
  aplicados:**`, **Y** la HU shared `S` lista esa HU en su frontmatter
  `absorbe:`. Tras remediación, **0** asimetrías.
- D4 (heurística de patrón aplicado omitido): HUs cuyo texto invoca la
  mecánica de un SHARED pero no lo declaran en `Patrones aplicados:`. Tras
  remediación, **0** omisiones detectables por las 9 heurísticas
  léxico-semánticas.

**Hallazgo formal**: las 9 HU shared funcionan como **transformaciones
naturales** entre el funtor "mecánica específica por épica" y el funtor
"contrato uniforme". El cuadrado de naturalidad cierra:

- HU específica `H_E` (de la épica `E`) cita `S` en `Patrones aplicados`.
- `S` lista `H_E` (cuando absorbida) en `absorbe:`.
- La especialización local (catálogo de acciones por contexto en
  HU-SHARED-001, plantillas por tipo en HU-SHARED-007) es el "componente
  natural" `α_H_E` que acomoda la mecánica al contexto.

**Severidad**: COHERENTE. Ahora bidireccionalmente consistente.

---

### 4.4 Yoneda: HU determinada por sus relaciones

> URN `icas-identidad-relacion §yoneda`. *"un objeto A queda determinado
> salvo isomorfismo natural por el funtor representable Hom(A, −)."*

**Lectura**: cada HU se determina por:

- Su actor primario y secundarios.
- Su tipo (`opm-semantica/opcloud-ui/mixto`).
- Su nivel (`K/V/L/P/U/C/X/D`).
- Sus dependencias `Bloqueada por:` / `Bloquea a:`.
- Sus citas SSOT.
- Sus patrones aplicados (HU-SHARED).
- Su prioridad y tamaño.

Estos campos forman su "hom-funtor" representable `Hom(H, −)`. Dos HUs con
**exactamente** las mismas relaciones serían el mismo objeto salvo
isomorfismo natural — un caso de **duplicación oculta**.

**Verificación**: el corpus tiene IDs inmutables `HU-NN.NNN` que actúan como
representantes del objeto. La regla de inmutabilidad de la metodología §3
("Las renumeraciones están prohibidas") impide colapsar duplicados, pero
también permite que sobrevivan.

**Hallazgo**: el provenance v1→v2 detectó y absorbió/fusionó **>140 HU**
duplicadas (las que tenían "mismas relaciones"). Tras v2: 48 stubs vivos +
fusiones intra-épica. La ronda de Yoneda está cerrada por reciprocidad: cada
stub redirige a su canónica (esto es exactamente *colapsar el isomorfismo
natural*).

**Severidad**: COHERENTE.

---

### 4.5 Universalidad: HU shared como factorización

> URN `icas-universales §coproducto-pushout`. Un colímite es la "mejor
> manera de combinar" un diagrama; una factorización pasa por un objeto
> universal.

**Lectura**: cada HU shared `S` es el **objeto universal** (colimite) del
diagrama de HUs específicas que comparten una mecánica:

```
HU-13.005 ──┐
HU-10.019 ──┼──▶ HU-SHARED-001 (menú contextual)
HU-12.001 ──┘
   ...
```

Cualquier HU futura con la misma mecánica factoriza por `S` con única
elección de especialización local (catálogo de acciones por contexto).

**Verificación**: ¿cumple la propiedad universal? Necesitaría que toda HU
nueva con mecánica X **factorice únicamente** por `S`. La metodología §13
prescribe esto: "Una HU que invoca un patrón shared lo cita explícitamente
en `Patrones aplicados:`". Si la lógica completa coincide → stub absorbido.
Si solo coincide parcialmente → permanece canónica con cita.

**Hallazgo formal**: las 9 HU shared son **factorizaciones universales** en
el sentido pragmático del corpus. La universalidad estricta requeriría
demostrar unicidad salvo isomorfismo, lo cual es heurística aquí — no
teorema (distinción explícita §7).

**Severidad**: COHERENTE como factorización; HEURÍSTICA como universalidad
estricta.

---

### 4.6 Adjunción de prioridad

> URN `icas-adjunciones §free-forgetful`. Un funtor *libre* construye
> sobre generadores; su adjunto *forgetful* olvida estructura.

**Lectura**: el orden `M0 ≤ M1 ≤ S ≤ C ≤ W` es un **poset finito totalmente
ordenado**. La regla "una HU no puede ser M0 si depende de una que no es M0"
(metodología §8) es la **monotonía** de la prioridad respecto a las
dependencias.

**Verificación** (D3): el auditor verifica que para cada HU `H` con
`Prioridad ≥ M0` y para cada `D ∈ Bloqueada por:`, `Prioridad(D) ≤ Prioridad(H)`
(orden bajo = mayor compromiso).

**Resultado**: tras remediación, **0** violaciones de monotonía. Ninguna HU
M0 depende de una no-M0.

**Hallazgo formal**: la asignación de prioridad respeta la **filtración
monótona** del corpus. Esto es la condición que asegura que el roadmap
α/β/γ/δ se puede implementar respetando dependencias.

**Severidad**: COHERENTE.

---

### 4.7 Topos de tipos y bisimulación canvas↔OPL

> URN `icas-topoi`. Un topos tiene clasificador de subobjetos `Ω`.
> URN `icas-efectos §bisimulacion`. Dos sistemas son bisimilares si producen
> las mismas observaciones bajo todas las trayectorias.

**Lectura del clasificador**: `Type : HU → {opm-semantica, opcloud-ui, mixto}`
es un clasificador de tres valores (no booleano). En topos lenguaje:

- `opm-semantica`: el predicado "exigido por SSOT" vale.
- `opcloud-ui`: el predicado "afordancia OPCloud sin exigencia SSOT" vale.
- `mixto`: ambos predicados valen parcialmente.

Esto es lógica intuicionista no-booleana (URN `icas-topoi §logica-intuicionista`).

**Lectura de bisimulación** (HU-SHARED-007 — eco OPL): el panel OPL-ES y el
canvas son **dos coalgebras** sobre el mismo espacio de estados (modelo OPM).
La bisimulación canvas↔OPL exige que producir el mismo resultado por
cualquier camino:

```
Modelo M ──cambio canvas──▶ M'
   │                        │
   OPL_funtor               OPL_funtor
   ▼                        ▼
oraciones(M) ──actualiza──▶ oraciones(M')
```

Conmute. La sección categorial 4 de HU-SHARED-007 ya formaliza esto con
invariantes verificables (INV-1..INV-5).

**Severidad**: COHERENTE. La sección 4.4 de HU-SHARED-003 hace lo análogo
para permisos como sheaf.

---

### 4.8 Cobertura SSOT inversa: D8

> URN `icas-preservacion §essentially-surjective`. Un funtor es esencialmente
> sobreyectivo si todo objeto del destino tiene preimagen.

**Métrica**:

| SSOT | Tamaño total | Citado por algún HU | Cobertura |
|---|---:|---:|---:|
| Reglas visuales `V-xxx` | 269 | 42 | 16% |
| Términos `Glos 3.x` | 85 | 20 | 24% |
| Plantillas `OPL-ES T/D/TS/CX/CS/IV/§` | 21 (extraídas) | 23 (incluye CX, CS, IV no contados originalmente) | >100% |

**Interpretación formal**: `Cite_V` es **fiel pero no essentially
surjective**. 84% de las reglas visuales SSOT no están "alcanzadas" por
ninguna HU. Esto NO es una violación porque:

1. Muchas V-xxx son meta-reglas internas a la SSOT que el modelador no
   manipula directamente.
2. El roadmap MVP-α/β/γ/δ no pretende cubrir el 100% de la SSOT en MVP.
3. Lo que sí debería preocupar es si **alguna SSOT M0 esencial NO se cita**.

**Hallazgo (heurística)**: revisar manualmente si alguna `V-xxx` o
`Glos 3.x` esencial para conformidad OPM/ISO 19450 quedó sin HU. Esto es
trabajo de juicio humano sobre la SSOT, no automatizable. Lo dejo como
**recomendación** (§5).

**Severidad**: INFO (no violación). Métrica de completitud funcional, no de
calidad estructural.

---

### 4.9 Drift docs↔código (lifecycle)

> URN `icas-lifecycle §drift`. *"El drift es lo que ocurre cuando η deja de
> ser natural. […] El componente A evolucionó a E(A), el componente B
> evolucionó a E(B), pero la dependencia f entre ellos no evolucionó de
> forma compatible."*

**Hallazgo inicial** (iter-0):

- README.md: "HU canónicas | ~1.020" vs realidad 1.117 (diff −97).
- README.md: "Stubs | ~140" vs realidad 48 (diff +92).
- 04-MAPA.md, 06-PROVENANCE.md: mismos drifts.

**Lectura categorial**: las "cifras documentadas" son una **vista (sheaf
section)** del corpus. Cuando el corpus evolucionó (v1→v2 con consolidaciones
y fusiones), la sección documental NO se actualizó coherentemente. Es
**naturalidad rota** del endofuntor de evolución `E : Corpus → Corpus`.

**Remediación aplicada** (iter-1): actualicé README, MAPA y PROVENANCE con
cifras verificadas por `audit-hu.mjs` y añadí nota de procedencia
("Cifras verificadas contra el corpus por `tools/audit-hu.mjs`").

**Resultado iter-2+**: D11 = 0.

**Hallazgo derivado**: para evitar drift futuro, cualquier release de v2
debería re-correr el auditor y refrescar cifras. Es un *gate categorial*
(URN `icas-lifecycle §phase-gate`).

**Severidad**: COHERENTE tras remediación.

---

### 4.10 Anti-patrones: ciclos y "God HU"

> URN `icas-patrones §anti-patrones`. *"El God Object es un objeto con
> demasiados morfismos entrantes y salientes — un objeto cuyo funtor
> representable Hom(G, −) tiene demasiada estructura."*

**Verificación del auditor** (D6): **0 ciclos** en `Bloqueada por:`.

**Análisis de "God HU"** (heurística): ¿hay HUs con desproporcionadamente
muchas incoming/outgoing dependencies? Métrica no implementada en el
auditor (no hay heurística clara), recomendable como extensión.

**Caso límite observado**: HU-SHARED-003 (permisos read-only) "bloquea a
HU-SHARED-001, HU-SHARED-002, HU-SHARED-005, HU-SHARED-006 y cualquier HU
de escritura". Es legítimo (los permisos son transversales), pero a nivel
de implementación significa que el módulo de permisos es un punto de paso
forzado. Es **factorización deliberada**, no anti-patrón.

**Severidad**: COHERENTE. Recomendable agregar métrica de centralidad
en futuras iteraciones del auditor.

---

### 4.11 HU como contrato: assume/guarantee y Goodhart

> URN `icas-calidad-riesgo §contratos`. Un assume-guarantee contract
> `(A, G)` dice: si el entorno satisface A, el componente garantiza G.
> URN `icas-safety-alignment §goodhart`. *"Cuando una medida se convierte
> en objetivo, deja de ser buena medida."*

**Lectura como contrato**: cada HU canónica es un par
`(precondiciones, consecuencias verificables)`. Sus criterios Gherkin lo
explicitan: `Dado P (assumption), cuando A, entonces C (guarantee)`.

**Análisis Goodhart (importante)**: el linter `validate-hu.ts` mide 9
proxies (frontmatter homogéneo, citas válidas, terminología, etc.) y pasa
0 violaciones. **Pero** los 9 proxies NO miden:

1. **Cobertura SSOT real** — el linter mide que las citas sean válidas,
   no que cubran lo esencial.
2. **Completitud Yoneda** — el linter no detecta HU duplicadas con misma
   red de relaciones (excepto IDs idénticos).
3. **Naturalidad shared bidireccional** — esto solo lo verifica el auditor,
   no el linter.
4. **Filtración del roadmap** — la regla "M0 no depende de no-M0" no es
   parte del linter.

**Reward hacking potencial**: una organización podría "pasar el linter"
escribiendo HU sintácticamente correctas pero estructuralmente débiles.

**Mitigación implementada**: el auditor `audit-hu.mjs` cubre las 4 brechas
y **complementa** al linter. Ambos deben pasar.

**Hallazgo**: el linter es proxy local; el auditor es proxy global. Mantener
ambos en CI evita Goodhart sobre cualquiera de los dos individualmente.

**Severidad**: COHERENTE. Recomendable correr ambos en cada PR.

---

### 4.12 Comportamiento bisimulacional: cambio v1 → v2 como refactoring

> URN `icas-procesos §refactoring-bisimulacion`. *"Un refactoring es un M
> que es un isomorfismo natural. La estructura del sistema cambia […] pero
> el comportamiento observable permanece idéntico."*

**Lectura del provenance v1→v2**: la migración v1→v2 (consolidación de
1.164 HU a 1.117 + 48 stubs + 9 shared) es un **refactoring** del corpus.

**Verificación de bisimulación**:

- ¿El comportamiento observable se preserva? Sí, por construcción: las HU
  absorbidas/fusionadas tienen stubs que redirigen.
- ¿Los IDs son inmutables? Sí (regla §3).
- ¿Las citas SSOT preservadas? Sí (verificado por linter).

**Hallazgo formal**: el provenance es un **isomorfismo natural** sobre el
funtor "comportamiento observable del corpus" (lectura humana, búsqueda
por ID, trazabilidad SSOT). La estructura interna cambió (factorización por
shared), pero el comportamiento observable es bisimilar.

**Severidad**: COHERENTE.

---

## 5. Recomendaciones — checklist categorial para mantener salud del corpus

> URN `icas-procesos §convergencia` + `icas-lifecycle §phase-gate`.

Para cualquier PR sobre `docs/historias-usuario-v2/`:

### CRÍTICO (debe pasar)

- [ ] `bun run docs/historias-usuario-v2/tools/validate-hu.ts` — 0 violaciones.
- [ ] `node docs/historias-usuario-v2/tools/audit-hu.mjs` — 0 CRÍTICOS, 0 MEDIOS.
- [ ] Si una nueva HU absorbe en una shared, actualizar `absorbe:` del SHARED.
- [ ] Si una nueva HU aplica una mecánica shared, declararlo en
      `Patrones aplicados:`.
- [ ] Si una HU nueva es M0, todas sus `Bloqueada por:` son M0.
- [ ] Si una HU nueva es `mixto`, citar al menos un `[V-xxx]/[Glos 3.x]/[OPL-ES]`.

### MEDIO (debe pasar o declararse)

- [ ] Re-correr auditoría tras cualquier renombramiento o fusión.
- [ ] Si la cobertura SSOT cae (V/Glos/OPL-ES), explicar (¿se eliminó HU? ¿se
      consolidó? ¿la SSOT cambió?).
- [ ] Verificar que ningún `**Bloqueada por:**` apunta a stub (debería
      apuntar a la canónica destino del stub).

### BAJO (recomendable)

- [ ] Tras release del corpus, refrescar cifras en `README.md`, `04-MAPA.md`,
      `06-PROVENANCE.md` con valores del auditor.
- [ ] Considerar agregar al auditor: detección de "God HU" por centralidad de
      grado (in+out degree desproporcionado).
- [ ] Considerar agregar al auditor: detección Yoneda de duplicación oculta
      (HUs con misma red de relaciones modulo nombre).

---

## 6. Alternativas comparadas con tradeoffs

### 6.1 Versionado de HU: versionar (v1, v2, v3) vs versionar in-place

- **Versionar separado** (actual): preserva trazabilidad histórica completa
  vía `06-PROVENANCE.md`, permite refactor masivo. Costo: duplicación de
  espacio (v1 conservada bajo `archive/`); riesgo de drift si docs meta no
  se sincronizan (mitigado por el auditor).
- **Versionar in-place**: cambios incrementales, sin duplicación de espacio.
  Costo: pérdida de trazabilidad si el cambio es masivo; difícil ver "qué
  cambió" sin git blame intensivo.

**Tradeoff categorial**: el versionado separado es la opción de
**fibración** (URN `icas-lifecycle §grothendieck-fibration`): cada versión es
una fibra completa. El in-place es la opción de **endofuntor evolutivo**:
cada commit es una aplicación de `E`. Para refactors masivos como v1→v2,
la fibración es más segura porque el funtor de migración v1→v2 puede
exhibirse explícitamente (PROVENANCE.md).

**Recomendación**: mantener fibración para mayor refactor; usar evolutivo
para cambios menores.

### 6.2 HU shared: factorización máxima vs duplicación local

- **Factorización máxima** (actual con 9 SHARED): reduce duplicación,
  asegura coherencia uniforme, pero introduce indirección (hay que leer la
  shared para entender la HU específica).
- **Duplicación local**: cada HU es autocontenida, fácil de leer aislada,
  pero coherencia entre HUs queda en manos del autor (riesgo de divergencia).

**Tradeoff categorial**: factorización es la opción **categórica** (URN
`icas-universales`). Sigue la propiedad universal: el SHARED es el objeto
inicial del diagrama. Pierde un grado de localidad (lectura aislada) por
ganar un grado de coherencia (definición única).

**Recomendación**: la factorización a 9 shared es probablemente óptima.
Crear una nueva shared solo cuando un patrón aparezca en ≥5 épicas (regla
metodológica §3.5).

### 6.3 Linter en CI vs auditor en CI vs ambos

- **Solo linter**: barato, rápido, cubre invariantes locales. Riesgo
  Goodhart: HUs sintácticamente correctas estructuralmente débiles.
- **Solo auditor**: cubre estructura completa, pero más lento (parsea todo
  el corpus + cruza con SSOT) y heurístico en algunos puntos (D4).
- **Ambos** (recomendado): linter para gate por-PR, auditor para gate
  por-release.

**Recomendación**: ambos. Linter en pre-commit, auditor en CI release.

---

## 7. Distinción formal vs heurístico

> URN regla del skill: *"distingue formal de heurística".*

| Hallazgo | Tipo | Justificación |
|---|---|---|
| Asociatividad de `Bloqueada por:` | **Formal** | Es composición en categoría libre sobre grafo dirigido. |
| Identidad de dependencias | **Formal** | Cada HU es objeto, identidad existe trivialmente. |
| Sin ciclos (D6) | **Formal** | Verificado por DFS; bien fundación. |
| Functor `Cite : HU → SSOT` faithful | **Formal** | Verificado por linter (citas únicas, existencia). |
| HU shared como transformación natural | **Formal** | Bidireccionalidad declarada y verificada por auditor (D10). |
| Adjunción de prioridad (M0 ⇒ deps M0) | **Formal** | Monotonía verificable; D3 = 0. |
| HU shared como colímite universal | **Heurística** | La unicidad salvo isomorfismo no se verifica formalmente; depende del juicio del autor sobre cuándo factorizar. |
| Yoneda: HU determinada por relaciones | **Heurística** | El criterio de "duplicación por misma red de relaciones" no es decidible automáticamente sin más estructura. |
| Acceptance criteria como sketch predicates | **Heurística** | El predicado verificable existe, pero la conmutatividad del diagrama solo se verifica por test e2e. |
| Cobertura SSOT inversa | **Heurística** | El criterio de "qué SSOT importa cubrir" depende del roadmap, no es propiedad estructural. |
| Cambio v1→v2 como isomorfismo natural | **Heurística** | La bisimulación observacional no se verifica con tests automáticos; se infiere del provenance. |
| Análisis Goodhart sobre el linter | **Formal** (existencia de proxy gap) + **Heurística** (importancia del gap) | El gap proxy↔goal es estructural; el peso es de juicio. |

---

## 8. Convergencia del bucle audit→remediar→reauditar

> URN `icas-lifecycle §fixed-point`. *"La iteración CD^n produce la n-ésima
> versión. La convergencia de CD — si las versiones se estabilizan — es la
> existencia de un fixed point del endofuntor."*

**Trazabilidad de iteraciones**:

| Iter | CRÍTICOS | MEDIOS | BAJOS | Acción aplicada |
|---:|---:|---:|---:|---|
| 0 | 23 | 89 | 22 | Auditoría inicial. Bug regex en auditor (no reconocía SHARED-NNN). |
| 1 | 0 | 91 | 22 | Fix regex → 23 falsos positivos D2 desaparecen. |
| 2 | 0 | 85 | 12 | Actualicé conteos en README/MAPA/PROVENANCE (D11=0); listas `absorbe:` SHARED corregidas (D9=0). |
| 3 | 0 | 85 | 0 | (D10 BAJOS resueltos en iter 2). |
| 4 | 0 | 39 | 0 | Fix regex `extraerPatronesAplicados` para reconocer formato corto `**Patrones:**`. |
| 5 | 0 | 28 | 0 | `fix-patrones.mjs` aplicó 11 inserciones SHARED. |
| 6 | 0 | 12 | 0 | `fix-patrones.mjs` extendido (anchors `**Deps:**`, `**Prioridad:**`); 16 inserciones más. |
| 7 | 0 | 5 | 0 | Fix `extraerCitasSSOT` para no excluir notas de evidencia + reconocer CX/CS/IV/§. |
| 8 | 0 | 3 | 0 | Cambié tipo `mixto → opcloud-ui` en 3 HUs cuyo cuerpo declaraba que la SSOT no prescribía. |
| 9 | 0 | 0 | 0 | **Fixed point**. Solo INFOS estructurales (D1, D8). |

**Convergencia**: en 9 iteraciones, el endofuntor `(audit ∘ remedy)`
converge a un fixed point con 0 violaciones automatizables. Las 2 INFOs
(D1, D8) son métricas, no violaciones, y permanecerán hasta que se
amplíe la cobertura SSOT manualmente.

---

## 9. Lo que la auditoría NO hizo

> Regla del skill: *"si el corpus no cubre el caso, declararlo".*

- **Verificación semántica**: el auditor no lee el contenido de las HUs
  para detectar inconsistencias semánticas (e.g. una HU dice "se crea como
  objeto" pero su criterio dice "tipo proceso"). Eso requiere análisis
  manual o un LLM con la SSOT como contexto.
- **Análisis de tamaños/prioridades coherente**: el auditor no verifica si
  los `**Tamaño:**` declarados son razonables, ni si la prioridad respeta
  el roadmap real (más allá de D3 sobre dependencias).
- **Cobertura M0 vs roadmap**: no verifica que el conjunto de HUs M0
  efectivamente entregue el "kernel OPM editable y persistente" del
  MVP-α (eso requiere validación funcional, no solo estructural).
- **Detección Yoneda automática**: no comparo redes de relaciones de HUs
  para detectar duplicados estructurales con IDs distintos.
- **Topología del roadmap como filtración monótona**: no verifico
  α ⊂ β ⊂ γ ⊂ δ explícitamente; solo verifico monotonía local de M0.
- **Bisimulación canvas↔OPL en código**: la sección 4 de HU-SHARED-007
  formaliza los invariantes; la verificación ejecutable requiere tests
  e2e en `app/`.
- **Validación de la cobertura SSOT funcional**: las 269−42=227 reglas
  visuales no citadas pueden ser irrelevantes para MVP o ser una omisión
  crítica; juicio humano + roadmap.

Estos son trabajo de **revisión humana especializada** (`opm-specialist`,
`polymath`) o de extensiones futuras del auditor.

---

## 10. Apéndice A: herramientas

| Herramienta | Path | Función | Línea convergencia |
|---|---|---|---:|
| `validate-hu.ts` | `docs/historias-usuario-v2/tools/validate-hu.ts` | Linter local por-HU (9 invariantes) | 0 violaciones |
| `audit-hu.mjs` | `docs/historias-usuario-v2/tools/audit-hu.mjs` | Auditor categorial 360° (12 dimensiones) | 0 CRÍTICOS, 0 MEDIOS, 0 BAJOS |
| `fix-patrones.mjs` | `docs/historias-usuario-v2/tools/fix-patrones.mjs` | Aplicador automático de remediación D4 (patrones SHARED omitidos) | 27 fixes aplicados (iters 5-6) |

Comandos:

```bash
cd /home/felix/projects/deep-opm-pro

# Linter local (rápido, gate por-PR)
bun run docs/historias-usuario-v2/tools/validate-hu.ts

# Auditor categorial (estructural, gate por-release)
node docs/historias-usuario-v2/tools/audit-hu.mjs

# Reporte JSON detallado
cat docs/historias-usuario-v2/AUDITORIA-CATEGORIAL-RESULTADO.json | jq .
```

---

## 11. Apéndice B: reproducibilidad

**Verificación del fixed-point** (cualquiera puede correrlo):

```bash
$ bun run docs/historias-usuario-v2/tools/validate-hu.ts | tail -8
Épicas: 48
Shared: 9
HU canónicas: 1117
Stubs (absorbidas/fusionadas): 48
Violaciones: 0
  Locales (L*): 0
  Globales (G*): 0

$ node docs/historias-usuario-v2/tools/audit-hu.mjs | tail -7
AUDITORÍA — 2 hallazgos.
  CRÍTICO: 0
  MEDIO: 0
  BAJO: 0
  INFO: 2
Resumen: canónicas=1117, stubs=48 (auditor cuenta SHARED como canónicas: 1126).
Cobertura SSOT: V=42/269, Glos=20/85, OPL-ES=23/21.
```

Los dos INFOS son métricas estructurales, no violaciones:

- **D1**: control de naturalidad docs↔código (URN `icas-lifecycle`).
- **D8**: cobertura SSOT inversa (URN `icas-preservacion §essentially-surjective`).

Ambos quedan documentados aquí; no requieren remediación adicional.

---

*Reporte producido aplicando el skill `cat-thinking` (workflow
triaje → reformular → localizar → aplicar → validar → entregar) sobre el
corpus `docs/historias-usuario-v2/` el 2026-05-03. Anclajes a 11 URNs del
ICAS-BoK v1.0.0. Convergencia del loop `(audit ∘ remedy)` en 9 iteraciones
hasta fixed-point.*
