# Auditoría — ui-forja-governance como autoridad normativa

**Fecha:** 2026-05-25
**Objeto:** integración de `ui-forja-governance` como fuente única de verdad visual/estructural de Opforja.
**SSOT superior:** `docs/canon-opm/reglas-opm-estrictas.md`.

## Veredicto

`ui-forja/` queda promovido de handoff propuesto a autoridad normativa de diseño. La implementación actual ya cubría el layout Codex v1.1 en la superficie principal; el mayor riesgo era documental y de gobernanza: specs v1.0 obsoletos, ausencia de gate ejecutable y sombras offset residuales en overlays secundarios.

## Jerarquía consolidada

1. `docs/canon-opm/reglas-opm-estrictas.md` — canonicidad OPM/OPD/OPL.
2. `ui-forja/GOVERNANCE.md` — diseño de producto y resolución de conflictos visuales.
3. `ui-forja/01-design-spec.md` ... `08-jointjs-styling.md` — norma por capa.
4. `ui-forja/tokens.json` / `tokens.css` — valores de diseño.
5. `app/src/ui/tokens.ts`, `app/src/ui/`, `app/src/render/jointjs/` — implementación.

## Hallazgos y correcciones

| id | hallazgo | evidencia | severidad | corrección aplicada |
|---|---|---|---|---|
| GOV-1 | No existía artefacto `ui-forja-governance` explícito. | `ui-forja/` tenía handoff v1.0 y compliance SSOT, pero no contrato de precedencia. | Alta | Creado `ui-forja/GOVERNANCE.md` con autoridad, invariantes, excepciones, política de cambio y gates. |
| GOV-2 | La documentación `ui-forja` seguía describiendo OPL derecha / índice izquierdo. | `README.md`, `01-design-spec.md`, `02-components.md`, `03-scenes.md`, `05-interactions.md`. | Alta | Actualizados a Codex v1.1: `OPL ← canvas → Índice + Inspector`, tabs workspace en header, columnas 360/360. |
| GOV-3 | Tokens fuente seguían en versión 1.0 y `--cx-col-left: 210px`. | `ui-forja/tokens.css`, `ui-forja/tokens.json`. | Media | Actualizados a v1.1 y `colLeft = 360px`. |
| GOV-4 | No había gate automatizado que defendiera la norma visual. | `package.json` sin script de diseño. | Alta | Agregado `bun run design:governance`; incorporado en `gate:refactor`. |
| GOV-5 | Persistían sombras offset en overlays secundarios. | `BarraHerramientasElemento`, `MenuTipoEnlace`, `HaloEstado`, `toolbarStyles.nombreModal`. | Media | Reemplazadas por `boxShadow: "none"` y hairlines/rings permitidos. |

## Gate ejecutable

`app/scripts/design-governance-audit.mjs` verifica:

- existencia y precedencia de `ui-forja/GOVERNANCE.md`;
- documentación Codex v1.1 conectada a governance;
- `tokens.json`/`tokens.css` v1.1 y columna izquierda 360 px;
- equivalencia de tokens core con `app/src/ui/tokens.ts`;
- colapso de `radii` de chrome;
- ausencia de sombras offset directas en `app/src/ui` y `app/src/render/jointjs`.

Comando:

```bash
cd app
bun run design:governance
```

## Deuda controlada

- `tokens.colors.canvas.*` conserva aliases legacy OPCloud/JOYAS para compatibilidad con apariencias antiguas y tests de estilo persistido. La excepción está documentada en `ui-forja/GOVERNANCE.md`.
- Las capturas PNG de `ui-forja/screenshots/` siguen siendo referencia histórica v1.0; el texto normativo v1.1 y la UI viva tienen precedencia hasta regenerar screenshots.
- Existen componentes secundarios con `borderRadius: tokens.radii.*`; esto es aceptable porque los tokens de chrome colapsan a `0`, excepto `pill/full` donde la forma transmite estado/dot/swatch.

## Próximo control recomendado

Regenerar screenshots Codex v1.1 desde la app viva y añadir comparación visual automatizada contra desktop 1280×800 y mobile 390×844.
