# Capa categorial de opforja — síntesis y conocimiento destilado

> Documento de **fundamento permanente** (no es un corte ni una auditoría). Registra el conocimiento aprendido al dotar a opforja de una **semántica denotacional verificable bajo la superficie OPM**, sin tocar primitivas. El diseño detallado vive en `docs/roadmap/capa-categorial-opforja.md` y `docs/roadmap/simulacion-categorial-opforja.md`; la **verdad ejecutable** vive en las leyes de `app/src/leyes/`. Este doc es el mapa que conecta ambos y las lecciones que no deben re-aprenderse.

## Premisa

Leer OPM (ISO 19450) con **teoría de categorías como piedra de Rosetta**. OPM ya es categorialmente bien fundado: sus primitivas instancian construcciones canónicas. "Mejorable" no significa cambiar OPM para el humano — significa **formalizar bajo la superficie** lo que OPM implica estructuralmente, y hacerlo **verificable por leyes**. Regla dura del corpus (`metodologia-forja §0.2-0.3`): la lente formal es **nota al margen, nunca principio para el modelador humano**. El lenguaje de la UI y del modelo es OPM/dominio; lo categorial vive en código y en este doc.

## Mapa OPM ↔ teoría de categorías

| Primitiva / mecanismo OPM | Construcción categorial | URN ICAS-BoK |
|---|---|---|
| Objetos, procesos, enlaces | objetos y morfismos de una categoría | `icas-composicion` |
| Hecho OPM (denotación atómica) | elemento del haz de hechos (presheaf) | `icas-topoi` |
| Pegado de OPDs (consistencia entre vistas) | **sheaf / gluing** sobre el cubrimiento de OPDs | `icas-topoi` |
| Refinamiento (in-zoom/unfold) ↔ abstracción | fibración / extensión entre niveles | `icas-extension` |
| Composición de modelos (interfaz compartida) | **pushout / structured cospan** | `icas-universales` |
| Equivalencia de realizaciones (mismo efecto, interior distinto) | **2-célula / equivalencia** por firma de frontera | `icas-higher-categories`, `icas-comparacion` |
| **Simulación** (desplegar el comportamiento) | **anamorfismo** (unfold de una coalgebra) | `icas-efectos` |
| **Razonamiento** (derivar lo implícito) | **catamorfismo** (fold) — dual de la simulación | `icas-efectos` |
| Recurso lineal (se consume, no se clona) | categoría **monoidal no-cartesiana** | `icas-composicion-estructura` |

## El mapa inverso TC → OPM: dónde estaba la frontera

OPM tiene el **eje vertical** (refinamiento ⊣ abstracción) muy desarrollado. La carencia estaba en el **eje horizontal**: **composición**, **equivalencia** y **razonamiento** entre modelos/realizaciones, más la **linealidad** como cuarta dimensión designable. La capa categorial añade ese eje horizontal como semántica verificable, no como primitiva nueva.

## Arquitectura: cimiento + pisos + dinámica

```
F0  hechos/         cimiento: el hecho OPM reificado (Hecho, ConjuntoDeHechos,
                    hechosDe, seccionLocal) + sheaf-check de pegado (verificarPegado).
                    Proyección PARCIAL del modelo: entidades + estados + enlaces.
                    NO proyecta refinamientos (decisión declarada).
F1  composicion/    componer modelos por interfaz compartida (pushout/cospan).
F2  equivalencia/   equivalencia funcional por firma de frontera (rol neto),
                    aplicada en opforja como ley in-zoom ↔ out-zoom.
F3  razonamiento/   motor de derivación (fold): afectan-a, requerido-por,
                    impacto-de-eliminar, alcanzable. Frontera dura anti-FOL.
Ss  simulacion/     anamorfismo (unfold): runner.ts = coalgebra + desplegar.
                    Functor de efecto F: Id (determinista) / Dist (muestreo) /
                    Powerset (exhaustivo).
```

## La dualidad central (lo que une todo)

**Simulación (unfold) y razonamiento (fold) son duales sobre el mismo sustrato F0.** `simular = unfold(paso)`; `razonar = fold(grafo)`. El puente `simulacion/integracionHechos.ts` lo hace ejecutable: la traza de una corrida es una **sección del haz de hechos** de F0, y el razonamiento puede operar sobre lo que la simulación ejerció. `alcanzable` (reachability estática, F3) recorre **el mismo grafo de transición** que la simulación despliega — es su dual estático.

## Leyes verificadas (la verdad ejecutable — no se pierde mientras corran)

| Ley | Garantiza | Archivo | URN |
|---|---|---|---|
| `law-pegado-opd` | un OPD no muestra un enlace a un estado que él mismo suprime (separación) | `leyes/hechos-pegado.test.ts` | `icas-topoi` |
| `law-composicion-unidad` | componer con vacío preserva | `composicion/componer.test.ts` | `icas-universales` |
| `law-composicion-no-duplica` | entidad compartida no se duplica (entidades **y** apariencias) | `composicion/componer.test.ts` | `icas-universales` |
| `law-composicion-sin-refs-colgantes` | `enlacesPadreIds` se remapean al namespacear B | `composicion/componer.test.ts` | `icas-preservacion` |
| `law-composicion-sin-solape` | apariencias de B se desplazan fuera del bbox de A | `composicion/componer.test.ts` | — |
| `law-composicion-asociativa` | `(a∘b)∘c ≅ a∘(b∘c)` (firma estructural módulo namespacing) | `leyes/composicion.test.ts` | `icas-composicion` |
| `law-composicion-bien-tipada` | componer válidos no introduce avisos de error | `leyes/composicion.test.ts` | `icas-preservacion` |
| `law-composicion-respeta-lineal` | objeto lineal multi-consumido se detecta | `leyes/composicion.test.ts` | `icas-composicion-estructura` |
| `law-derivacion-pura` | derivar es puro y determinista | `leyes/razonamiento.test.ts` | `icas-efectos` |
| `law-derivacion-no-contradice` | toda referencia derivada existe en `hechosDe` (4 consultas) | `leyes/razonamiento.test.ts` | `icas-topoi` |
| **S⊑F0** | el unfold no inventa estructura fuera de la denotación | `leyes/integracion-ss-fs.test.ts` | `icas-efectos` |
| **dualidad S→F3** | todo objeto que S transicionó, F3 lo reconoce (`afectan-a≠∅`) | `leyes/integracion-ss-fs.test.ts` | `icas-efectos` |
| **F1↔S** | la composición preserva la simulabilidad | `leyes/integracion-ss-fs.test.ts` | `icas-composicion` |
| **F2↔S** | un in-zoom F2-coherente es simulable y respeta S⊑F0 | `leyes/integracion-ss-fs.test.ts` | `icas-efectos` |

## Lecciones metodológicas (lo que costó aprender — no repetir)

1. **Verde tautológico recurrente.** En cada tanda nueva (Fs, simulación, composición UX), la suite daba verde mientras había bugs reales — porque los tests miraban la dimensión equivocada (conteos de nombres, no coordenadas; positivos sin control negativo; OPDs idénticos sin abanicos). **Verde ≠ correcto.** Defensa instalada: **leyes falsificables con control de no-tautología** (cada una falla si el bug que vigila reaparece; ej. la entidad aislada «Sal» que ni se transiciona ni la reconoce F3).
2. **El bug no vive donde el test mira.** Los tests de composición verificaban `entidades` con rigor y pasaban; C1 (apariencia duplicada) y el solape geométrico vivían en `opds[].apariencias` y en las coordenadas, que nadie miraba.
3. **Coherencia por ley > refactor forzado.** "reúsa-F0" parecía un refactor faltante; era incorrecto (F0 no proyecta refinamientos que `impacto-de-eliminar` necesita). La coherencia F0-F3 se garantiza por `law-derivacion-no-contradice`, no por compartir implementación. **La lectura más débil que cumple el trabajo gana** (cat-thinking §9).
4. **Distinguir corrección de pulido de diseño-mayor.** No todo "pendiente" es igual: los P0 (solape, linealidad silenciosa) eran corrección; reúsa-F0 era pureza; F2↔S **bisimulación de frontera plena** es diseño-mayor. No falsificar una ley frágil para "completar la lista".
5. **F0 es proyección parcial por diseño** (sin refinamientos). Quien construya sobre F0 debe saber qué proyecta y qué no.

## Relación con la SSOT (qué sí, qué no)

- **SSOT OPM-para-humanos** (`opm-es`, `opd-es`, `opl-es`, `manual-metodologico`, `reglas-opm-estrictas`): **NO se contamina con jerga categorial.** El corpus lo prohíbe (lente formal = nota al margen). Lo aprendido **no** modifica estas capas.
- **Propuestas legítimas a la SSOT OPM** (vía `custodio-kora`, decisión del operador, **no** ejecución unilateral — regla de oro #1): (a) **linealidad** como 4ª designación genérica en `opm-es`; (b) **equivalencia funcional** (firma de frontera) como cierre formal del método A0 en `metodologia-forja`; (c) **composición por interfaz** (pushout) en `spec-forja-opl`. Lo aprendido las **refuerza** (son implementables y verificables), pero siguen siendo propuestas.
- **SSOT categorial** (`urn:fxsl:kb:icas-*`, corpus ICAS-BoK): el **mapa OPM↔TC** de arriba es conocimiento-puente entre dominios; candidato a artefacto KORA que conecte OPM e ICAS-BoK. También es propuesta a `custodio-kora`.
- **Las leyes y la arquitectura de opforja** son de la **implementación**, no de la metodología OPM. Su lugar es el repo (este doc + el código), no la SSOT.

## Pendiente de fundamento

**Bisimulación de frontera plena (F2↔S).** Hoy F2↔S sella la lectura débil (in-zoom coherente ⇒ simulable + S⊑F0). La plena —que la simulación del in-zoom **ejerza** las entidades de frontera del proceso abstracto— exige confirmar que los subprocesos creados por `descomponerProceso` ejercen los enlaces heredados (`enlacesPadreIds`). Camino: instrumentar `desplegar` sobre un in-zoom y comparar `hechosEjercidosPorTraza ∩ frontera` contra `fronteraDe(padre)`.

## Referencias

- Diseño detallado: `docs/roadmap/capa-categorial-opforja.md`, `docs/roadmap/simulacion-categorial-opforja.md`.
- **Frentes futuros (preludio prospectivo): `docs/capa-categorial-frentes.md`** — los frentes de la piedra de Rosetta que valen la pena, priorizados, con veredicto de cuáles son deriva.
- Estado operativo y cierre: `docs/HANDOFF.md` § *Cierre de la capa categorial*.
- Corpus categorial (SSOT): `urn:fxsl:kb:icas-*` (24 piezas ICAS-BoK).
- Canon OPM (SSOT): `urn:fxsl:kb:{opm-es,opd-es,opl-es,manual-metodologico-opm-es,reglas-opm-estrictas-es,spec-forja-opl-es,metodologia-forja-opm-es}`.
