# Solicitud a custodio-kora — el transmutador claude-code debe preservar `version` en el frontmatter desplegado

**Fecha:** 2026-06-22 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** decisión de consenso D-SKILL (spec del compuesto §5.1; `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md`).
**Naturaleza:** propuesta — el compuesto **propone** sobre pneuma; la escritura es HITL custodio-kora.

## Hecho verificado

La skill `modelamiento-opm` tiene tres encarnaciones con versión divergente:

| Encarnación | Path | `version` en frontmatter |
|---|---|---|
| Canon vivo (pneuma) | `~/kora-pneuma/artefactos/skills/kora/modelamiento-opm/SKILL.md` | `1.9.0` (presente) |
| Bestia (congelada) | `~/kora/artifacts/skills/kora/modelamiento-opm/SKILL.md` | `1.8.0` (presente) |
| **Deploy (claude-code)** | `~/.claude/skills/modelamiento-opm/SKILL.md` | **AUSENTE** (solo `name`/`description`/`allowed-tools`) |

El **deploy es lo que el agente realmente invoca en runtime**. El transmutador `_emision/claude-code` de pneuma (gesto `transmutar` en `kora.py`) **omite el campo `version`** al proyectar el frontmatter — bug-raíz, no divergencia de contenido.

## Petición

Que el funtor de transmutación a `claude-code` **preserve `version`** (y, deseable, un `kora:sello` mínimo) en el frontmatter del SKILL.md emitido. Es aditivo: no altera el cuerpo ni el comportamiento; solo hace legible en el deploy la versión que el canon ya declara.

## Por qué importa al compuesto

El cordón umbilical del super-robot necesita un **testigo de versión de la skill** legible donde el agente la consume (el deploy). Con el `version` presente en el deploy, el corte **C1 (version-match)** de deep-opm-pro puede leer la versión DESPLEGADA y compararla contra `SKILL_VERSION_ESPERADA` pineada en el repo — detectando *deploy stale* (el peor modo de falso verde). Sin esto, C1 solo puede degradar a comparar contra la copia pneuma, lo que **no detecta** un deploy desactualizado.

**Estado del compuesto mientras tanto:** C1 y el componente `skillVersion` del sello quedan **diferidos** hasta que el deploy porte `version`. El resto del cordón (resolutor URN, `doctrinaVersion`) avanza sin depender de esto.

## Verificación de cierre (cuando se aplique)

`grep -m1 '^version:' ~/.claude/skills/modelamiento-opm/SKILL.md` devuelve la versión del canon vigente tras una re-emisión (`transmutar`).
