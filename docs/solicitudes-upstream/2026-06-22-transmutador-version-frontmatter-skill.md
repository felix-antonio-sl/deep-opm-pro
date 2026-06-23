# [RETIRADA 2026-06-24] Solicitud — preservar `version` en el frontmatter del deploy

**Estado:** RETIRADA. Premisa incompleta. **Reemplazada por** [`2026-06-24-cordon-version-skill-via-sello.md`](./2026-06-24-cordon-version-skill-via-sello.md).

Esta solicitud pedía «arreglar» el transmutador `_emision/claude-code` para que preservara `version` en el frontmatter del SKILL.md desplegado, bajo la premisa de que el deploy tenía el `version` **ausente**. Esa premisa nació de mirar **solo el frontmatter**.

Verificado el 2026-06-24: el `version` **sí está en el deploy**, en el bloque proof-carrying `<!-- kora:sello … -->` del **cuerpo** (`version` + `hash-fuente` + `target`), y es universal en las 24 skills emitidas a claude-code. No hay bug en el transmutador: el frontmatter mínimo + sello en el cuerpo es diseño deliberado. C1 quedó **resuelto** en opforja leyendo del sello (`app/src/canon/selloSkill.ts` + `app/scripts/cordon-skill-audit.ts`), sin tocar pneuma.

El contenido original se recupera por git si hace falta.
