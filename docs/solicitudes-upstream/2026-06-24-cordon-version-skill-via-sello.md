# Solicitud a custodio-kora — el cordón lee la versión del **sello** del cuerpo (rectifica la del 2026-06-22)

**Fecha:** 2026-06-24 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Origen:** corte **C1 (version-match skill↔app)** del cordón umbilical (roadmap Tramo C; spec `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md`).
**Naturaleza:** propuesta (menor) + **rectificación de registro**. El compuesto **propone** sobre pneuma; la escritura es HITL custodio-kora.
**Reemplaza:** `2026-06-22-transmutador-version-frontmatter-skill.md` (RETIRADA — premisa incompleta).

## Rectificación: no había bug en el transmutador

La solicitud del 2026-06-22 afirmaba que el deploy claude-code tenía el `version` **AUSENTE** y pedía «arreglar» el transmutador para que lo preservara en el frontmatter. **Esa premisa era una verificación incompleta: solo se miró el frontmatter.** Verificado de primera mano el 2026-06-24:

- El `version` **sí está en el deploy**, en el bloque proof-carrying `<!-- kora:sello … -->` del **cuerpo** (`~/.claude/skills/modelamiento-opm/SKILL.md:783-791`): `version: 1.9.0` + `hash-fuente: sha256:3df0872…` + `target: claude-code`.
- Es **universal**: las 24 skills emitidas a claude-code llevan el sello con `version` + `hash-fuente` + `target` (barrido sobre `~/.claude/skills/*/SKILL.md`).
- El diseño es **deliberado, no un bug**: el frontmatter queda mínimo (lo único que el runtime parsea: `name`/`description`/`allowed-tools`) y la metadata de gobernanza baja a su sitio canónico, el sello, garantizado por el check `sello-fresco` de `velar`. **El `version` no se pierde en la transmutación — cambia de lugar.**

No se pide tocar el transmutador. La premisa de la solicitud anterior queda retractada.

## C1 — RESUELTO en opforja (sin tocar pneuma)

El cordón ahora lee la versión **auténtica de lo desplegado** parseando el sello del deploy:

- Parser puro + evaluador: `app/src/canon/selloSkill.ts` (tests `selloSkill.test.ts`, 7/7).
- Gate IO: `app/scripts/cordon-skill-audit.ts` (tests, 3/3); 7ª conjunción de `gate:refactor` vía `bun run cordon:skill`.
- Valores pineados en el repo: `CORDON_SKILL_ESPERADO` (`version` + `hash-fuente` + `target`).
- **Matriz de dureza** (coherente con R-CONF-7 — la divergencia se reporta, la indeterminación se nombra):
  - `version` deploy ≠ esperada → **FALLO duro** `[CORDON] FALLO: deploy stale: skill vX != esperada vY`.
  - `hash-fuente` ≠ esperado con `version` igual → **ADVERTENCIA** (contenido cambió sin bump; no rompe el gate).
  - `target` ≠ `claude-code` → **FALLO duro** (emisión de otro runtime).
  - sello/skill ausente → **SKIP nombrado** (CI/otra máquina sin `~/.claude/skills` montado; no rompe el gate).

Ventaja sobre las dos vías que contemplaba la solicitud anterior: lee lo que **realmente corre** (detecta deploy stale real, no un proxy), es **accionable ya** sin esperar a pneuma, y **no degrada** (no invoca R-CONF-7: lee la versión auténtica, no un sustituto). Bonus: pinear `hash-fuente` ataja el falso negativo de «cambió el contenido pero se olvidó el bump».

## Petición (menor, opcional) — canonizar el contrato en `ley/`

Para que la convención quede como **contrato explícito y estable** (y no como conocimiento tribal que el próximo consumidor vuelva a descubrir mirando el frontmatter):

> **Los consumidores de una skill emitida leen la metadata de gobernanza (`version`, `hash-fuente`, `target`, …) del bloque `kora:sello` del cuerpo, NO del frontmatter del runtime.** El frontmatter es mínimo por diseño del funtor de transmutación; el sello es el contrato proof-carrying, garantizado por el check `sello-fresco` de `velar`.

Sugerido en `ley/3` (o donde el custodio juzgue). No bloquea C1: el corte ya está cerrado y verde en opforja con o sin esta canonización.

## Verificación de cierre

`bun run cordon:skill` en `deep-opm-pro/app/` debe imprimir `[CORDON] OK` y la
versión esperada por el repo. Al subir la skill sin actualizar
`CORDON_SKILL_ESPERADO`, el gate rompe con `[CORDON] FALLO: deploy stale`. La
versión concreta es un dato vivo del sello y no se duplica en esta solicitud.
