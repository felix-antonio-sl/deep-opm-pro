# Línea 3 — Rutas y abanicos a estados

## 1. Misión

Completar la continuación natural de abanicos y extremos estado: permitir ramas de abanico que terminan en estados distintos del mismo objeto y agregar etiqueta de ruta libre sobre cada rama, con OPL `Por ruta <etiqueta>, ...`.

**Slice mínimo entregable**: `Enlace.rutaEtiqueta?`, operaciones puras en `rutas.ts`, validación de abanicos con extremos estado, render de etiqueta cerca de la rama, inspector para editarla, OPL con §13 rutas y tests unit/smoke.

**Fuera de slice**: conector visual O/XOR (L1), gesto directo a cápsula (L2), auto-invocación (L4), probabilidades de ramas.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-15.013 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Ramas de abanico hacia estados distintos. |
| HU-15.005 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Campo libre `rutaEtiqueta` sobre rama a estado. |
| HU-15.007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Verbalización OPL `Por ruta X, ...`. |
| HU-15.008, HU-15.009, HU-15.012 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Contexto de abanicos ya implementado. |
| HU-13.014 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` | Extremos estado como prerrequisito. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` §Combinatoria de abanicos: XOR/OR aplican a enlaces procedimentales y el extremo común define convergencia/divergencia.
  - `opm-iso-19450-es.md` §Trayectorias de ejecución y etiquetas de ruta: la etiqueta resuelve ambigüedad al salir de un proceso.
  - `opm-opl-es.md` §13: `Por ruta etiqueta, *Proceso* consume/genera **Objeto**.`
  - `opm-opl-es.md` §11: `exactamente uno de` / `al menos uno de` para abanicos.
- **Corpus interno reusable**:
  - `opm-extracted/src/app/configuration/elementsFunctionality/linkDrawing.ts` contiene `uniteResults(...)`, `uniteConsumptions(...)` y filtros `!item.get("Path")`; evidencia de que OPCloud distingue ramas con path.
  - `docs/JOYAS.md` §9 menciona `AddPath(path, template)` en el motor OPL OPCloud.
  - `opm-extracted/src/app/models/modules/attribute-validation/validation-module.ts` contiene generación OPL extensa con estados y grupos; usar solo como guía.
- **Estado actual del código**:
  - `app/src/modelo/abanicos.ts` detecta puertos comunes vía `entidadIdDeExtremo`; en ramas a estados puede ver dos comunes (proceso y objeto contenedor), por lo que debe preferir extremo exacto común.
  - `app/src/opl/generar.ts` suprime oraciones de enlaces miembros de abanico; para rutas a estados debe emitir oraciones por rama o una oración enriquecida que no pierda etiquetas.
  - `app/src/ui/InspectorEnlace.tsx` ya tiene secciones de multiplicidad, modificadores, extremos y abanico.

## 4. Archivos permitidos

```text
app/src/modelo/tipos.ts                       EDIT aditivo (Enlace.rutaEtiqueta?)
app/src/modelo/rutas.ts                       NUEVO
app/src/modelo/abanicos.ts                    EDIT aditivo
app/src/modelo/abanicos.test.ts               EDIT aditivo
app/src/serializacion/json.ts                 EDIT aditivo
app/src/serializacion/json.test.ts            EDIT aditivo
app/src/opl/generar.ts                        EDIT aditivo
app/src/opl/generar.test.ts                   EDIT aditivo
app/src/render/jointjs/rutaLabels.ts          NUEVO
app/src/render/jointjs/proyeccion.ts          EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts     EDIT aditivo
app/src/store.ts                              EDIT aditivo
app/src/ui/InspectorEnlace.tsx                EDIT aditivo
app/e2e/opm-smoke.spec.ts                     EDIT aditivo
opm-extracted/**                              LECTURA
```

## 5. Restricciones de no-colisión

- No tocar `JointCanvas.tsx` salvo que el smoke requiera un test id para etiqueta; preferir proyección pura.
- No modificar la representación de `ExtremoEnlace`; usar helpers existentes.
- En `abanicos.ts`, no relajar la homogeneidad de tipo. Solo resolver el caso de extremos estado con puerto exacto común.
- `rutaEtiqueta` aplica primero a ramas procedimentales con al menos un extremo estado. Si se permite en otras ramas, documentarlo y probarlo.
- OPL no debe duplicar enlaces ya agrupados sin control: si una rama tiene ruta, esa rama debe ser visible textual aunque pertenezca al abanico.

## 6. Slice mínimo shippeable

### Modelo

Agregar campo opcional:

```ts
export interface Enlace {
  rutaEtiqueta?: string;
}
```

Normalización: `trim`, vacío elimina campo.

### Operaciones

`rutas.ts`:

```ts
export function definirRutaEtiqueta(modelo: Modelo, enlaceId: Id, etiqueta: string | undefined): Resultado<Modelo>;
export function rutaEtiquetaNormalizada(etiqueta: string | undefined): string | undefined;
export function enlaceAdmiteRuta(modelo: Modelo, enlaceId: Id): boolean;
```

`abanicos.ts`:

- Para dos resultados `Proceso -> EstadoA` y `Proceso -> EstadoB` del mismo objeto, el puerto común debe ser el origen exacto `Proceso`, no el objeto contenedor derivado de ambos estados.
- Mantener rechazo si hay más de un extremo exacto común y no hay `puertoEsperado`.

### Serialización

- Exportar `rutaEtiqueta` solo si existe.
- Hidratar como string no vacío; vacío o whitespace se ignora.
- Si el JSON trae tipo no string, falla con mensaje legible.

### Render

`rutaLabels.ts` debe producir labels JointJS:

```ts
export function etiquetasRuta(enlace: Enlace): Array<Record<string, unknown>>;
```

- Texto visible: la etiqueta limpia, no anteponer "ruta".
- Posición cerca del primer tercio de la rama o cerca del punto de bifurcación si existe abanico.
- Estilo Arial 11-12 px, semibold, `#475467`, sin tapar multiplicidad/modificadores.

### OPL

Regla mínima:

- Enlace con `rutaEtiqueta`: anteponer `Por ruta ${rutaEtiqueta}, ` a la oración procedural base.
- En abanico con rutas a estados: emitir una oración por rama etiquetada para no perder el estado destino.
- Conservar `exactamente uno de` / `al menos uno de` cuando no hay rutas.

Ejemplo esperado:

```text
Por ruta exitoso, *Aprobar* genera **Pedido** en `aprobado`.
Por ruta fallido, *Aprobar* genera **Pedido** en `rechazado`.
```

### UX

En `InspectorEnlace.tsx`, si `enlaceAdmiteRuta(...)`:

- Campo "Ruta" con placeholder `exitoso`.
- Edición en vivo mediante acción de store.
- Help text breve solo si ya existe patrón local; no agregar explicación larga en UI.

### Cross-capa

Si se crea union para tipo de ruta, agregar `Record<...>` en `completitud.test.ts`. Si solo es string opcional, no tocar completitud.

## 7. Tests obligatorios

- `rutas.test.ts` si se crea: normaliza, elimina vacío, rechaza enlace inexistente.
- `abanicos.test.ts`: dos resultados a estados distintos del mismo objeto forman abanico por proceso común.
- `json.test.ts`: round-trip preserva `rutaEtiqueta`; whitespace se limpia.
- `generar.test.ts`: `Por ruta exitoso, ...` y `Por ruta fallido, ...` sobre ramas a estados.
- `proyeccion.test.ts`: label de ruta aparece y no reemplaza multiplicidad/modificador.
- `opm-smoke.spec.ts`: importar/crear modelo con dos ramas a estados, editar rutas, ver OPL y export JSON.

## 8. Verificación

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- `rutaEtiqueta` vive en `Enlace`, no en `Abanico`; la ruta pertenece a la rama.
- La etiqueta OPL fija es `Por ruta`, no "siguiendo ruta" ni variante local.
- Los abanicos siguen siendo homogéneos por `TipoEnlace`.
- Las probabilidades de ramas quedan fuera.

## 10. Decisiones que tomas vos (documentar en commit)

- Si `rutaEtiqueta` se permite solo con extremo estado o en cualquier rama procedural.
- Cómo se posiciona la etiqueta cuando hay vértices manuales.
- Si el abanico con rutas emite además una oración resumen o solo oraciones por rama.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): etiquetas de ruta en enlaces procedimentales`
- `feat(modelo): abanicos admiten ramas hacia estados distintos`
- `feat(opl): verbaliza rutas sobre ramas a estado`
- `feat(render): etiquetas de ruta sobre enlaces`
- `feat(ui): edicion de ruta en inspector de enlace`
- `test(...)` por capa

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
