# ui-forja — sistema de diseño de opforja

Índice del sistema visual y de interacción de opforja. Esta carpeta gobierna la
estética, el chrome, los tokens y la apariencia no semántica de JointJS; no redefine
OPM, OPL ni el comportamiento actual del producto.

**Versión:** 1.2.0
- **Gobernanza vigente:** [GOVERNANCE.md](GOVERNANCE.md)
- **Producto implementado:** `app/src/ui/` y `app/src/render/jointjs/`
- **Gate:** `cd app && bun run design:governance`

## Precedencia

1. `urn:fxsl:kb:reglas-opm-estrictas-es` gobierna la semántica OPM.
2. `urn:fxsl:kb:spec-forja-opd-es` gobierna lo visualmente significativo del OPD.
3. [GOVERNANCE.md](GOVERNANCE.md) gobierna estética, chrome y tokens.
4. Los documentos `01` a `08` detallan la realización por superficie.
5. `tokens.json` y `tokens.css` fijan valores; el runtime los refleja.
6. Código y tests verifican el comportamiento implementado.

Si una captura, escena o documento antiguo difiere del canon o de GOVERNANCE, no manda
la captura: se corrige o se trata como referencia histórica.

## Mapa de documentos

| Documento | Rol actual |
|---|---|
| [01-design-spec.md](01-design-spec.md) | lenguaje visual, tipografía, color, layout y responsabilidades |
| [02-components.md](02-components.md) | inventario de referencia de componentes del chrome |
| [03-scenes.md](03-scenes.md) | composición de cuatro escenas de referencia, no inventario del producto actual |
| [04-opl-rendering.md](04-opl-rendering.md) | realización tipográfica de OPL bajo el canon vigente |
| [05-interactions.md](05-interactions.md) | patrones de interacción del chrome |
| [06-ssot-compliance.md](06-ssot-compliance.md) | auditoría histórica de trazabilidad; no registro de estado |
| [07-glyphs.md](07-glyphs.md) | iconografía tipográfica permitida |
| [08-jointjs-styling.md](08-jointjs-styling.md) | apariencia JointJS subordinada a la spec OPD |
| [tokens.json](tokens.json) | fuente estructurada de valores de diseño |
| [tokens.css](tokens.css) | proyección CSS de los tokens |

## Escenas y material de referencia

`scenes/`, `screenshots/` y `src/variant-codex.jsx` conservan la propuesta visual que
originó el sistema. Sirven para contraste editorial y de composición; no son una app
ejecutable, un roadmap ni un contrato de paridad pixel a pixel con el producto actual.

El canvas de las escenas es un mock. El canvas productivo vive en JointJS dentro de
`app/`. No copies el mock SVG a la aplicación.

## Qué gobierna

- frame, columnas, header, panel OPL, índice, Inspector, diálogos y overlays HTML;
- tipografía, color, espaciado, hairlines, foco y estados de interacción;
- apariencia JointJS que no porta semántica OPM;
- accesibilidad visual y ausencia de overflow en los viewports declarados.

No gobierna:

- ontología, enlaces, refinamientos, simulación ni sintaxis OPL;
- persistencia, auth, schema, navegación de dominio o estado actual del producto;
- formas, marcadores o contornos cuando su significado ya está definido por la spec OPD.

## Flujo de cambio

1. Resolver primero si la decisión es semántica OPM o diseño de producto.
2. Consultar GOVERNANCE y el documento propietario de la superficie.
3. Cambiar tokens antes que introducir valores directos cuando corresponda.
4. Verificar la experiencia afectada en la aplicación, no solo en una escena estática.
5. Ejecutar:

```bash
cd app
bun run check
bun run lint
bun run build
bun run design:governance
```

Para cambios de interacción o canvas se añaden los E2E focales. Una suite verde prueba
el contrato mecanizado; no sustituye la evaluación humana del software feel.
