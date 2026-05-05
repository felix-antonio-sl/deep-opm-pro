# Línea 1 — Conectores lógicos canónicos O/XOR

## 1. Misión

Cerrar la brecha visual de abanicos lógicos: reemplazar el overlay textual actual (`O`/`XOR` dentro de elipse) por conectores canónicos usando `assets/svg/links/logical/or.svg` y `assets/svg/links/logical/xor.svg`.

**Slice mínimo entregable**: `LINK_ASSETS.logical`, helper render `abanicoOverlay.ts`, proyección JointJS con triángulo XOR y arco O, tests de proyección y smoke que verifiquen que no queda texto `O`/`XOR` como marcador principal.

**Fuera de slice**: crear/editar abanicos, ramas a estado, rutas y probabilidades. Eso es L3.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-15.010 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | XOR se renderiza como triángulo cerca del puerto. |
| HU-15.011 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | OR se renderiza como abrazadera/arco curvo. |
| HU-15.009 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Contexto: el operador ya existe como `"O" | "XOR"`. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` §Combinatoria de abanicos de enlaces: XOR y OR aplican a familias procedimentales; `opm-opl-es.md` §11.2-11.3 distingue "exactamente uno de" y "al menos uno de"; `opm-visual-es.md` V-239 encuadra los enlaces procedimentales.
- **Corpus interno reusable**:
  - `assets/svg/links/logical/or.svg` y `assets/svg/links/logical/xor.svg` son la fuente canónica local.
  - `opm-extracted/assets/INDEX.md` muestra que los assets históricos no incluían `logical`, por lo que los SVG raíz versionados son la fuente curada para esta brecha.
  - `opm-extracted/src/app/dialogs/choose-link-dialog/Dialog.component.ts` contiene evidencia de UX OPCloud para opciones XOR en el diálogo de enlaces.
- **Estado actual del código**:
  - `app/src/render/jointjs/proyeccion.ts` tiene `proyectarOverlayAbanico` con `standard.Ellipse` y texto.
  - `app/src/modelo/abanicos.ts` ya gestiona `OperadorAbanico`.
  - `app/src/opl/generar.ts` ya emite O/XOR; no tocar salvo si un test revela regresión.

## 4. Archivos permitidos

```text
app/src/render/jointjs/linkAssets.ts          EDIT aditivo
app/src/render/jointjs/abanicoOverlay.ts      NUEVO
app/src/render/jointjs/proyeccion.ts          EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts     EDIT aditivo
app/e2e/opm-smoke.spec.ts                     EDIT aditivo
assets/svg/links/logical/or.svg               LECTURA
assets/svg/links/logical/xor.svg              LECTURA
docs/JOYAS.md                                 LECTURA
opm-extracted/**                              LECTURA
```

## 5. Restricciones de no-colisión

- No tocar `app/src/modelo/abanicos.ts`, `app/src/modelo/tipos.ts`, `app/src/store.ts` ni `app/src/opl/generar.ts`.
- En `proyeccion.ts`, dejar solo una llamada a `proyectarOverlayAbanicoCanonico(...)`; la geometría vive en `abanicoOverlay.ts`.
- No crear SVG nuevo; usar los dos assets existentes y registrar su normalización en `LINK_ASSETS.logical`.
- Mantener metadata `kind: "overlay-abanico"` para que selección/inspector sigan funcionando.

## 6. Slice mínimo shippeable

### Modelo

Sin cambios de modelo. `Abanico.operador` ya existe.

### Operaciones

Sin cambios de kernel.

### Serialización

Sin cambios.

### Render

Agregar:

```ts
export function proyectarOverlayAbanicoCanonico(args: {
  opdId: Id;
  abanicoId: Id;
  operador: "O" | "XOR";
  aparienciaPuerto: Apariencia;
}): JointCellJson[];
```

- XOR: `standard.Polygon` o `standard.Path` basado en `LINK_ASSETS.logical.xor`.
- O: `standard.Path` basado en el arco de `LINK_ASSETS.logical.or`.
- Color `#586D8C`, trazo 1.5-2 px, sin label visible.
- Posición inicial: cerca del puerto compartido actual, reemplazando la elipse textual. Si no existe cálculo de puerto real, mantener el offset actual pero con forma canónica.

### OPL

Sin cambios; L3 revisará rutas y abanicos a estados.

### UX

No agregar controles. El inspector existente sigue alternando operador.

### Cross-capa

`proyeccion.test.ts` debe fallar si el overlay vuelve a `standard.Ellipse` con texto.

## 7. Tests obligatorios

- `proyeccion.test.ts`: O produce `standard.Path` con stroke `#586D8C`; XOR produce `standard.Polygon`/`standard.Path` sin label textual.
- `proyeccion.test.ts`: metadata `overlay-abanico` conserva `abanicoId` y `operador`.
- `opm-smoke.spec.ts`: importar fixture con abanico O/XOR, alternar en inspector y verificar SVG visible sin texto `XOR` como marcador principal.

## 8. Verificación

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Los SVG canónicos son `assets/svg/links/logical/{or,xor}.svg`.
- No se redefine la semántica de `Abanico`; solo cambia la proyección visual.
- El overlay sigue siendo una celda separada, no se incrusta en cada enlace miembro.

## 10. Decisiones que tomas vos (documentar en commit)

- Si renderizas OR como `standard.Path` directo o como imagen SVG embebida.
- Si el triángulo XOR apunta hacia la primera rama o queda sin rotación en este slice.
- Si el offset mantiene el punto actual o se deriva del bbox de las ramas.

## 11. Forma del entregable

Commits sugeridos:

- `feat(render): conectores logicos canonicos para abanicos`
- `test(render): cubre overlay O y XOR canonico`
- `test(smoke): verifica abanicos logicos sin overlay textual`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
