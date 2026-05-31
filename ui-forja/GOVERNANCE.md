# ui-forja-governance — autoridad normativa de diseño

**Producto:** Opforja
**Estado:** normativa vigente para decisiones visuales y estructurales de la aplicación
**Versión:** 1.1
**Fecha:** 25 mayo 2026

---

## 1. Autoridad y precedencia

`ui-forja-governance` es la fuente única de verdad para el diseño de interfaz de Opforja: frame, chrome, tokens, tipografía, composición, componentes, interacción visual y apariencia JointJS.

La precedencia completa del repo es:

1. `urn:fxsl:kb:reglas-opm-estrictas-es` — SSOT suprema para canonicidad OPM/OPD/OPL. El archivo `docs/canon-opm/reglas-opm-estrictas.md` es puente local. Ninguna decisión visual puede contradecirla.
2. `ui-forja/GOVERNANCE.md` — autoridad normativa para diseño de producto y resolución de conflictos visuales.
3. `ui-forja/01-design-spec.md` ... `ui-forja/08-jointjs-styling.md` — especificación prescriptiva por capa.
4. `ui-forja/tokens.json` y `ui-forja/tokens.css` — fuente de valores de diseño; `app/src/ui/tokens.ts` es el espejo runtime.
5. Implementación en `app/src/ui/` y `app/src/render/jointjs/`.
6. Tests unitarios, e2e y auditorías visuales que verifican la implementación.

Si `ui-forja` y `urn:fxsl:kb:reglas-opm-estrictas-es` difieren, manda la SSOT KORA. Si la implementación y `ui-forja` difieren, manda `ui-forja` salvo que exista una excepción documentada aquí.

## 2. Invariantes de diseño

Estos invariantes son obligatorios para cualquier cambio de UI:

- La app es un editor OPM de trabajo, no una landing page ni una demo.
- El layout desktop vigente es: `OPL ← canvas → Índice + Inspector`.
- El header global contiene wordmark, tabs de modelos, breadcrumb, acciones, meta y command palette.
- El canvas se centra para todo efecto en el centro geométrico del paper, no en `x/y = 0/0`.
- Las columnas laterales canónicas miden 360 px en desktop; el canvas central absorbe el resto.
- El chrome usa tipografía, hairlines y espacio editorial; no usa sombras de elevación, tarjetas decorativas ni cajas de botón innecesarias.
- Los colores OPM solo codifican semántica OPM: objeto verde, proceso azul, estado oliva. El acento crimson es UI-only.
- El command palette es la vía principal de comandos no visibles.
- La selección visual en canvas es underline crimson bajo la etiqueta; no hay resize handles ni doble borde de proceso por selección.
- OPL y OPD deben mantenerse sincronizados bidireccionalmente.

## 3. Alcance normativo

`ui-forja-governance` rige:

- `CodexFrame`, headers, footer, tabs, toolbar, command palette, panel OPL, árbol OPD, inspector, diálogos y overlays HTML.
- Tokens de color, tipografía, espaciado, hairlines, radios, sombras y transiciones.
- Atributos de apariencia JointJS: shapes, enlaces, markers, highlighters y overlays de canvas.
- Reglas visuales de empty states, foco, hover, disabled, selección y estados de guardado.
- E2E visuales y smokes de no-overflow.

No rige semántica nuclear OPM. Esa capa pertenece a `urn:fxsl:kb:reglas-opm-estrictas-es` y al kernel en `app/src/modelo/`.

## 4. Excepciones permitidas

Estas excepciones están permitidas mientras estén cubiertas por tests:

- `tokens.colors.canvas.*` conserva aliases legacy OPCloud/JOYAS para compatibilidad con apariencias antiguas y pruebas de estilo persistido. Las nuevas superficies deben preferir `colors.opm.*`, `colors.ink*`, `colors.rule*` y `colors.crimson`.
- `tokens.radii.pill` y `tokens.radii.full` pueden usarse para estados OPM, dots, swatches circulares o badges cuyo significado depende de la forma.
- `box-shadow` puede usarse solo como ring sin blur (`0 0 0 ...`) o como `inset` hairline. Las sombras offset de elevación están prohibidas.
- El command palette y modales pueden usar backdrop, pero el panel interno sigue siendo hairline + papel.
- SVG/JointJS puede usar geometría propia cuando representa símbolos OPM canónicos, markers o highlighters.

## 5. Política de cambio

Todo cambio visual debe cumplir:

1. Citar el documento de `ui-forja` que lo gobierna en comentario, test, PR o commit cuando modifique una decisión material.
2. No introducir colores hex directos en UI salvo que sean fixtures/test de estilos persistidos o valores documentados en tokens.
3. No introducir sombras offset, gradientes decorativos, orbs, cards anidadas o radius decorativo.
4. Mantener textos dentro de sus contenedores en desktop y mobile.
5. Mantener accesibilidad: foco visible, labels accesibles, target mínimo 24 px y contraste WCAG 2.2 AA.
6. Correr `bun run check`, `bun run lint`, `bun run build` y el subset Playwright afectado.

## 6. Gates ejecutables

Los gates mínimos para cambios de UI son:

```bash
cd app
bun run check
bun run lint
bun run build
bun run design:governance
```

Para cambios de layout/canvas se añade:

```bash
cd app
bunx playwright test e2e/02-canvas-y-render.spec.ts e2e/03-opl-panel.spec.ts e2e/04-arbol-y-pestanas.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/22-responsive-review.spec.ts e2e/23-inspector-resize.spec.ts
```

## 7. Resolución de conflictos

Cuando una decisión visual no esté especificada:

1. Revisar `urn:fxsl:kb:reglas-opm-estrictas-es` para descartar impacto semántico.
2. Revisar `ui-forja/01..08`.
3. Revisar `docs/JOYAS.md` y assets canónicos si toca OPD/JointJS.
4. Elegir la opción más tipográfica, plana, neutral y reversible.
5. Documentar la decisión en `ui-forja/GOVERNANCE.md` si se vuelve patrón.

## 8. Definición de listo

Un cambio visual está listo cuando:

- La implementación no contradice la SSOT OPM.
- Los tokens runtime coinciden con `ui-forja/tokens.json` o declaran una excepción.
- No hay overflow horizontal inesperado en 1280×800 ni mobile 390×844.
- Los e2e de layout y canvas relevantes pasan.
- Las divergencias frente a `ui-forja` están eliminadas o documentadas como excepción.
