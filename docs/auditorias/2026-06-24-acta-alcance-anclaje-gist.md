# Acta de alcance — modo *anchor* (Stereotype real) de gist en opforja

**Fecha:** 2026-06-24 · **Tipo:** consenso deliberativo (skill `consenso-deliberativo` v1.0.1) · **Modo:** orquestación (subagentes reales, independencia epistémica)
**Panel:** steipete (director de ejecución cognitiva) × allan-kelly (arquitecto organizacional humano-agente) · árbitros de desempate reservados (no requeridos): steve-jobs + mente-omega
**Contexto histórico:** destrabó la condición **(b)** del frente gist-anchor. El estado actual vive en `../handoff-2026-07-18.md`.
**Resultado:** **CONSENSO** (1 ciclo de corrección; 1 objeción crítica resuelta).

## Problema

¿Qué **alcance** debe tener el modo *anchor* (referencia viva = fibración de Grothendieck: `stereotypeId` + `libraryRef` + `frozenAtHash`, sin materializar) en opforja, para destrabar la **composabilidad** de la greda gist? Opción A (anchor mínimo-gist, ~15-20 raíces semilla) vs Opción B (paridad-OPCloud-plena: 96 clases + multi-ámbito + permisos + vitrinas).

## Síntesis final (corregida)

1. **Alcance = Opción A.** Mecanismo anchor **genérico-completo** (no recortado). **B se rechaza** como especulativa sin beneficiario nombrado; entra como **incremento aditivo bajo demanda** (la cola de 96 clases se proyecta con `proyectar-gist.mjs`, que ya existe). El mecanismo es invariante al cardinal de la biblioteca: B paga 96/20 de costo por cero arquitectura nueva.

2. **El número de anclas es de VALIDACIÓN, no de catálogo.** Ejercer el mecanismo sobre el **set mínimo que ejerce la propiedad de composabilidad** (1-2 raíces gist + dependencias), no 15-20 por cobertura. La cola de 96 entra por proyección reproducible cuando un consumidor real la demande.

3. **Criterio de cierre = eval ejecutable de composabilidad CON CONTRATO DE FALSABILIDAD** (corrección del ciclo 1). Un test de leyes en `app/src/leyes/` sobre dos SD0 que comparten una raíz anclada es **«defendible» solo si cumple las TRES condiciones**:
   - **(i) Objeto común no trivial:** el pullback rinde estructura/propiedad heredada de la raíz que **ninguna** SD0 redefine localmente — objeto común **derivado del anchor, NO inyectado en el fixture**.
   - **(ii) Discriminación anchor-vs-Template (gate duro, no negociable):** un caso negativo donde la misma estructura se construye con **Template** (la copia desacoplada de D6, ya en prod) y el eval **DEBE fallar ahí**. Si el eval pasa con anchor *y* con Template, mide igualdad sintáctica, no composabilidad.
   - **(iii) Herencia continua sensible a mutación:** mutar la raíz en la biblioteca **propaga** a ambas SD0 ancladas (vivo); en Template no propagaría. El eval ejerce la **propagación**, no solo el estado inicial.

4. **Separación de dos evals (resolución del delta del panel).** *Eval-de-mecanismo* (composabilidad como propiedad arquitectónica) gobierna **CONSTRUIR + declarar VALIDADO**, satisfecho por un par de SD0 **sintético defendible-según-(3)**. *Eval-de-adopción* (un consumidor de dominio real compone) gobierna **ESCALAR** (más raíces, declarar éxito de producto). **La construcción NO se bloquea por ausencia de consumidor de dominio** — bloquearla institucionalizaría el loop abierto (gist v0 sin composabilidad es el estado insuficiente que motivó esta deliberación).

5. **Rótulo honesto del cierre.** El sello porta `validado:mecanismo / adopcion:pendiente`, no un `VALIDADO` desnudo (evita que aguas abajo se lea como «gist composable en producción para consumidores reales»).

6. **Salvaguarda de diferir.** Si la propiedad **no es ejercitable ni siquiera sintéticamente** bajo (3) → **diferir** (hallazgo de diseño = mecanismo mal concebido, no espera de adopción de mercado).

7. **Semántica de «vivo» a declarar.** El diseño debe declarar si entrega **vivo-hasta-rehash** (propagación gobernada por re-anclaje explícito, coherente con `frozenAtHash`) o **vivo-continuo** (propagación inmediata). La condición (iii) prueba la semántica **realmente entregada**, no la que suena mejor. Probable punto de arbitraje de **R-VIS-STEREO-1 (custodio-kora, (a))**.

8. **Cobertura aditiva conocida.** El set mínimo deja ramas del mecanismo genérico sin cobertura ejecutable (herencia múltiple; staleness de `frozenAtHash`). Deuda **declarada y aditiva**, no bloqueante.

## Razonamiento consolidado

Ambos panelistas convergieron en A (no B) desde doctrinas distintas: steipete por *architecture-over-implementation* (el valor es el mecanismo, invariante al tamaño) y *ship-beats-perfect*; allan por *valor validado sobre throughput* (paridad sin beneficiario = deuda). La fricción real no fue A-vs-B sino el **criterio de cierre**. La refutación adversarial (ambos, independientes) detectó que el término «fixture sintético defendible» estaba **subespecificado** y colapsaba en **verde tautológico** — un fixture diseñado para que el eval pase valida al implementador, no la propiedad. La corrección (contrato de falsabilidad de 3 condiciones, con el **caso negativo Template-adversarial** como discriminador duro) cierra ese hueco y fue **pre-aceptada por ambos** como condición de su consenso.

## Aportes por experto

- **steipete:** alcance A genérico-completo; rechazo de B (96/20 sin arquitectura nueva); **separación construir/validar vs adopción**; diagnóstico de que el time-box-diferir institucionaliza el loop abierto (huevo-y-gallina: sin anchor nadie produce el SD0 que el time-box exige). En refutación: el negative-test debe ejercer la **dimensión mutacional**, no comparación estática (objeción 2→condición iii); cobertura aditiva del mecanismo genérico (punto 8).
- **allan-kelly:** **eval ejecutable de composabilidad como criterio de cierre**; «número de validación, no de catálogo»; las **tres condiciones de defensibilidad** del fixture con el **gate Template-adversarial**; rótulo honesto `validado:mecanismo/adopcion:pendiente` (punto 5); tensión `frozenAtHash` vs herencia continua (punto 7).

## Supuestos aceptados

- El mecanismo anchor es agnóstico al nº de tipos (dato verificado): escalar 1-2 → 96 es proyección reproducible, no rediseño.
- Un par de SD0 sintético que cumpla (3) es **construible** como fixture del corte (parte del TDD).
- ids deterministas `ent-<Clase>` ya verificados (0 colisiones); el proyector existe.
- (a) y (c) se resuelven en paralelo; esta acta solo fija **alcance + criterio de cierre**.

## Riesgos pendientes

- **Verde tautológico** si el contrato de falsabilidad (3) se implementa débil. Mitigación: la condición (ii) Template-adversarial es gate duro.
- **Composabilidad inerte:** un fixture ejercitable solo bajo construcción tan artificial que ningún SD0 real de opforja podría instanciarlo (steipete, objeción 4). Vigilar al diseñar el fixture.
- **Semántica `frozenAtHash` vs «vivo»** (punto 7) sin arbitrar hasta R-VIS-STEREO-1.

## Incertidumbres

- Si llegará un consumidor de dominio real con 2 SD0 (gobierna ESCALAR, no construir).
- Forma OPL/visual del anchor (depende de (a), HITL custodio-kora).

## Confianza por experto (no promediada)

- **steipete: 0.82 → ~0.92** con la corrección incorporada. Alta convicción en el alcance; la rebaja venía enteramente del criterio de cierre subespecificado, resuelto por (3).
- **allan-kelly: ALTA (condicionada) → ALTA plena** con las tres condiciones incorporadas. Sin ellas habría bajado a MEDIA («cierre no auditable = autonomía sin evaluación»).

Las confianzas **no se promedian**: ambas eran altas en *dirección* y condicionadas al *contrato de cierre*; al incorporarlo, convergen alto. La señal es unánime: el alcance es robusto; el rigor estaba en el gate, ahora especificado.

## Metadatos

- Modo: **orquestación** (2 subagentes reales, independencia verificable).
- Fases ejecutadas: convocar · proponer (independiente) · criticar (cruzada) · sintetizar · refutar (adversarial) · corregir (1 ciclo) · declarar (consenso).
- Objeciones críticas resueltas: **1** (fixture defendible subespecificado → contrato de falsabilidad de 3 condiciones).
- Salida: consenso, no disenso. No requirió árbitro HITL.
