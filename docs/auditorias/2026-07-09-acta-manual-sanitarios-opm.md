# Acta — Deliberación de diseño del manual sanitario de opforja

**Fecha**: 2026-07-09 · **Entregable**: `docs/manual-sanitarios-opm.md` ·
**Protocolo**: skill `consenso-deliberativo`, modo **orquestación** (3 subagentes con
contexto propio) · **Panel**: `salubrista` (dominio macro/meso, KB-first) ×
`allan-kelly` (célula humano-agente, evals) × `steve-jobs` (diseño del artefacto) ·
**Orquestador**: sesión principal con skills `modelamiento-opm` + `pensamiento-modelador`.

**Encargo del operador**: manual avanzado de modelamiento de sistemas sanitarios
complejos con OPM en el ecosistema opforja; 360°, «del microscopio al satélite»;
amplía las hojas `opforja-sanitarios-gestion.html` y `opforja-sociosanitarios.html`.
**Restricción dura**: `hd-opm` y `hodom-opm` jamás como casos de éxito o buena práctica.

## Resultado

**Consenso con triple aceptación** de los tres expertos tras 2 ciclos de refutación
adversarial (7 objeciones críticas del ciclo 1, todas resueltas; ciclo 2 sin críticas).
Confianza final por experto (no promediada): **salubrista 0.88 · allan-kelly 0.85 ·
steve-jobs 0.85**. Residuos declarados: de redacción/ejecución, no de arquitectura.

## Decisiones de arquitectura (las que gobiernan el manual)

1. **Espina = tres lentes** (asistencial · gestión · sistémica), fieles al canon de
   las hojas; **ortogonales a la escala** (unidad→nacional). Lo poblacional NO es
   cuarta lente: es la misma tríada a escala territorio/nacional (§6 del manual).
   Se descartó la cuarta lente por colisión de ejes (lente «red» vs escala «red») y
   drift con el canon publicado.
2. **Unidad editorial = pieza-decisión de 5 ranuras**: Pregunta · La tentación · El
   corte (regla por URN; marca «No lo decides tú» cuando el fork es clínico,
   normativo o cross-escala) · Realización mínima bimodal · Cómo se rompe. El
   esqueleto agnóstico vive UNA vez en el Apéndice A. 24 piezas (el conteo flotó de
   22 a 24 al separar dos piezas-maleta: voluntad-del-paciente y triaje/bypass).
3. **Ficha del modelo** (§2): contrato de intención copiable — pregunta de gestión,
   dueño humano, lente+escala, especie (respuesta | instrumento con cadencia de
   revisión), criterio de suficiencia PRE-REGISTRADO, criterio de muerte. Honestidad
   declarada mecanismo-vs-disciplina (la mesa no gatea la ficha; el método sí, con
   traza auditable). No existe capítulo de «evals» paralelo: bien-hecho lo juzga la
   tripartita (A8); sirve lo juzga la ficha (tensión Verificar↔Validar).
4. **Sin caso integrador HODOM** (roza el veto + es el mega-diagrama). En su lugar:
   Red de Ranquil (ficticia declarada) como hilo topeado — 3 OPDs, veredicto
   **cualitativo/estructural declarado** (el modelo descompone, localiza y entrega el
   indicador discriminante; no adjudica dinámica de capacidad, §9).
5. **Cifras del corpus jamás como hechos del manual**: la estructura del indicador se
   cita por URN; los valores en ejemplos son utilería rotulada.
6. **Sobre de autonomía del agente** (P23): decide/eleva/prohibido con los mecanismos
   reales (skill, versiones, revisión, [RATIFICAR]); el agente jamás juzga la ficha
   ni ratifica anclas.

## Objeciones críticas del ciclo 1 y su resolución

| # | Objeción (autor) | Resolución |
|---|---|---|
| 1 | Unidad inflada a 9 elementos (jobs) | Re-sustracción a 5 ranuras; esqueleto al Apéndice A |
| 2 | 4ª lente: colisión de ejes + drift con canon (jobs) | Tres lentes × cinco escalas; §6 = escala, no lente |
| 3 | Ficha sin runner; autor==evaluador; [RATIFICAR] sin dientes (allan) | Mecanismo-vs-disciplina declarado; pre-registro fechado; juez≠autor o separación temporal; cierre limpio como disciplina auditable |
| 4 | Modelo-instrumento inmortal (allan) | Discriminador de especie + cadencia de revisión + mortalidad por desuso + modo-mutante (versión) |
| 5 | Pregunta del hilo no adjudicable por la mesa (allan) | Re-pregunta estructural (estados de la espera con dueño + corte de contrarreferencia); veredicto rotulado cualitativo/estructural |
| 6 | Cifras reales de corpus ⊥ ejemplos ficticios (salubrista) | Regla de citación honesta: estructura por URN, valores de utilería rotulados |
| 7 | Hueco de equidad/estratificación (salubrista) | Pieza P18 (población estratificada; inequidad = indicador-brecha) + consentimiento/voluntad como P5 |

## Menores registradas (honradas en la redacción; no bloqueaban)

Ranquil hilvana solo las piezas de flujo/continuidad (anti-monolito); §6 rotula la
lente-madre de cada pieza; letra chica de §2 acotada; discriminador de muerte cubre
registros permanentes y vigilancia de preparación (revisión por obligación/fidelidad,
no consumo); rampa del novato concreta (una unidad, una pregunta, ≤12 entidades);
recomendación de auditoría periódica del portafolio contra fichas; ruteo por síntoma
al frente (§0).

## Supuestos aceptados y riesgos vivos

- El manual asume `manual-opforja.md` + SSOT por URN; se re-sincroniza cuando bumpeen
  (disciplina anti-drift de la casa).
- La gobernanza de bibliotecas de red (P16) es en parte prospectiva y así se declara.
- La frontera fina del sobre de autonomía en semántica clínica queda declarada como
  zona gris con regla operativa ([RATIFICAR] ante duda), no resuelta.
- Eficacia conductual de las disciplinas (ficha, cierre limpio) en célula unipersonal:
  apuesta no probada aún contra una sesión de modelado viva (allan, 0.15 de descuento).

## Vigencia de esta acta

Referencia viva: documenta por qué el manual tiene la forma que tiene (espina, unidad,
ficha, veto, límites). Si el manual se rediseña de raíz, esta acta se elimina
(política `docs/auditorias/README.md`).
