# Solicitud a custodio-kora — pregunta doctrinal: ¿arranque bottom-up de primera clase en Forja?

**Fecha:** 2026-07-06 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** brainstorming «experiencia ágil mesa↔skill» + veredicto adversarial `steve-jobs` (2026-07-06). Spec del corte: `docs/superpowers/specs/2026-07-06-puente-directo-mesa-skill-design.md` §7.
**Naturaleza:** pregunta doctrinal ANTES de construir — la mesa no legisla método. Un código de validez nuevo es una afirmación sobre qué es válido en Forja; eso vive en la SSOT del método, no en la herramienta.

## La pregunta

El operador pide poder modelar **bottom-up**: bosquejar OPDs sueltos (fragmentos) y desde ellos ir componiendo hacia el SD0, en vez de arrancar siempre por la función/SD (Regla Dura #5 de la skill, «SD primero»).

> **¿Admite Forja un arranque bottom-up con reconciliación posterior al SD0 como camino de primera clase del método, o se canaliza siempre por la válvula existente (régimen apunte + composición de modelos)?**

## Lo que existe hoy (la válvula)

- **Régimen apunte**: especie con rigor relajado (validez→observación, integridad intacta) — fragmentos legítimos sin bloqueo.
- **Composición de modelos**: fusión por interfaz — un fragmento-apunte puede incorporarse al modelo madre.
- Camino documentado como receta en la skill v1.12.0 (corte del puente): bosquejar fragmentos como apuntes → componer → graduar.

## Mecanismo propuesto SI la respuesta es «primera clase» (no construir antes)

1. **OPD suelto**: `Opd.padreId: null` adicional al SD (el tipo ya lo admite); el árbol lo muestra bajo una banda «Taller».
2. **Verbo «adoptar»**: declarar un OPD suelto como in-zoom/unfold de una cosa existente — fija padre + refinamiento en un gesto. No inventa semántica: es un camino de autoría hacia el mismo estado final legislado.
3. **Código de validez «OPD sin adoptar»** (requiere decisión del custodio): en apunte = observación; en modelo = bloquea solo el export canónico, jamás la edición. Entraría a la whitelist `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`.
4. Integridad estructural: NUNCA degrada (invariante intocable).

## Qué decide el custodio

- (a) **Sí, primera clase** → se especifica el mecanismo (probablemente enmienda menor a `metodologia-forja-opm-es` + realización en `spec-forja-opd-es` §10) y la mesa lo construye como corte propio.
- (b) **Se canaliza por apunte+composición** → esta solicitud se cierra sin pérdida; la receta de la skill v1.12.0 es el camino canónico; el verbo «adoptar» muere.
- (c) **Variante** que el custodio prefiera.

## Estado

**ABIERTA** — pendiente HITL custodio-kora.
