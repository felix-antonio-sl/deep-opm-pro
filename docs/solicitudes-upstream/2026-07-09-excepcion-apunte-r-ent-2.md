# Enmienda SSOT — excepción de apunte a R-ENT-2 (los bocetos emiten OPL de placeholders) — RESUELTA

**Fecha:** 2026-07-09 · **De:** compuesto opforja (deep-opm-pro) · **Para:** custodio-kora (kora-pneuma)
**Naturaleza:** ENTREGABLE AUTOREADO del fix `BUG-20260709T174709Z-76af16` («no se genera OPL de proceso; en modo taller no se forma ningún OPL»).
**Estado: RESUELTA 2026-07-09** — firmada por el custodio (HITL) y aplicada en pneuma:
`spec-forja-opl-es` **v1.3.0**, commit pneuma `4ae6428`, `kora.py velar` 12/12 (la toolchain no tiene
`check --strict`; `velar` es el gate completo). Puente local anotado (versión observada 1.3.0).

> **Reemplaza y retira** el borrador previo `2026-07-09-apunte-relaja-opl-proceso-placeholder.md`
> (revertido junto con su código en `f0faf77f`): aquel legislaba sobre **R-NOM-PROC-1**, que es la
> política de **nominación deverbal** y no suprime nada, y proponía una relajación **solo de display**
> que dejaba divergentes el editor libre, los exports, la vista móvil y el puente skill. Ambos
> defectos están corregidos aquí.

## El bug (síntoma → causa)

En un **apunte**, el usuario crea un objeto y un proceso; el OPL muestra el objeto pero **no el
proceso**. Bosquejando en el **Taller** (OPDs sueltos) «no se forma ningún OPL». Causa raíz única:
**R-ENT-2** (`spec-forja-opl-es` v1.2.2 §2.0) suprime la OPL canónica de toda cosa con nombre
**placeholder** — existencia y enlaces. En un boceto, donde los procesos nacen sin nombre, todos
desaparecen del OPL → la bisimetría canvas↔OPL se rompe justo en el modo diseñado para bosquejar.

Dos precisiones que este entregable corrige respecto del análisis anterior:

1. **La regla es R-ENT-2, no R-NOM-PROC-1.** R-NOM-PROC-1 (`reglas-opm-estrictas-es` §nominación)
   exige forma deverbal y alimenta el **diagnóstico**; no suprime OPL.
2. **La asimetría objeto/proceso observada NO es ontología deliberada**: es el
   **GAP-PLACEHOLDER-OBJETO** (spec §2.x, rama objeto de R-ENT-2 sin implementar en la mesa). Según
   la regla completa, el objeto placeholder también debería suprimirse en régimen riguroso.

## Enmienda propuesta — insertar junto a R-ENT-2 (§2.0)

> **Excepción de apunte (R-ENT-2-APUNTE).** En una **especie apunte**, R-ENT-2 no aplica: las cosas
> con nombre placeholder (objeto, proceso, `estado`) **SÍ emiten su OPL** — oración de existencia y
> enlaces — en **toda la generación**, incluida la canónica. Rationale: en un modelo, un nombre
> placeholder no es un hecho afirmable; en un **boceto**, el placeholder ES el hecho — afirma que hay
> una cosa aún sin nombrar, y el OPL del boceto debe contarla para preservar la bisimetría
> canvas↔OPL. La excepción es de **régimen por especie**, no de superficie: panel, editor libre,
> exports (Markdown, documento canónico), puente skill (`mesa pull` / contexto W6.0) y lectura móvil
> emiten el mismo texto. El **diagnóstico** de nominación (R-NOM-PROC-1, severidad observación
> por-clase en apuntes) sigue emitiéndose: la mesa acompaña e invita a nombrar con forma verbal, sin
> bloquear. Al **graduar** el apunte a modelo, R-ENT-2 vuelve a regir por sí sola (el régimen lee la
> especie viva del workspace). Coherencia doctrinal: el apunte relaja el **rigor de cierre**, no la
> semántica (`metodologia-forja-opm-es` v1.6.0 A1.5, `spec-forja-opd-es` v1.3.0 R-OPD-REF-20) —
> R-ENT-2 es exactamente rigor de cierre.

**Nota sobre GAP-PLACEHOLDER-OBJETO**: esta excepción lo neutraliza para apuntes (si la rama objeto
de R-ENT-2 se implementa a futuro, los bocetos no pierden sus objetos placeholder del OPL). El GAP en
régimen riguroso queda intacto y sigue abierto en §20.

## Realización en el código (implementada, gate en curso, NO desplegada)

- `VisibilidadOpl.esApunte?: boolean` (`src/opl/opciones.ts`) — opción de **régimen de generación**
  (no de display): `entidadOplEsEmitible`/`extremoOplEsEmitible`/`enlaceOplEsEmitible` la reciben y
  toda la cadena del generador la propaga (`generar.ts` · `procedural.ts` · `estructural.ts` ·
  `abanico.ts`).
- **Todas las superficies** pasan el flag derivado de la especie del workspace: panel OPL (pase
  canónico **y** display, `panel.ts`/`panelOplViewModel.ts`), export Markdown OPD/modelo
  (`exportarMarkdown.ts` + paleta), documento canónico (`perfilesExport.ts`), contexto skill / `mesa
  pull` (`contextoSkill.ts`/`contextoPull.ts`, flag = `especie === "apunte"`), lectura móvil
  (`VistaBusquedaLectura.tsx`).
- **Roundtrip verificado por ley**: el OPL canónico de un apunte con placeholders re-parsea con cero
  patches (`panel.test.ts`); el parser no filtra placeholders. La ley de determinismo del puente
  (cuerpo del pull byte-igual a `exportarContextoSkill`) se preserva por parámetro común.
- Régimen riguroso intacto: `R-ENT-2 suprime la OPL canónica de procesos placeholder (régimen
  riguroso)` en `generar.test.ts`; e2e `45-opl-proceso-apunte.spec.ts` cubre nacer apunte → proceso
  placeholder → OPL visible.

## Qué NO cambia

- Régimen riguroso (modelos y bibliotecas): R-ENT-2 suprime igual que hoy.
- El diagnóstico de nominación (R-NOM-PROC-1) y sus acciones sugeridas.
- La autoría headless (`src/autoria/`) sigue emitiendo en régimen riguroso: los bundles compilados
  son artefactos formales, no bocetos.

## Cómo aplicar (custodio)

1. Insertar el bloque «Excepción de apunte (R-ENT-2-APUNTE)» junto a R-ENT-2 en
   `~/kora-pneuma/artefactos/conocimiento/fxsl/spec-forja-opl-es.md` §2.0 (bump de versión + changelog).
2. `python3 ~/kora-pneuma/kora.py velar` + `kora check --strict`.
3. Re-pinear el puente `docs/canon-opm/spec-forja-opl.md` a la versión nueva.
4. Autorizar el deploy (la mesa lo ejecuta y recién ahí marca el bug Resuelto).
