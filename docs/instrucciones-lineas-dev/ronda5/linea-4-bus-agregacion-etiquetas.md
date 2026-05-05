# Linea 4 — Bus de agregacion y etiquetas de enlace

## 1. Mision

Cerrar dos brechas de EPICA-11 sin mezclar modelo y render: fusionar visualmente multiples enlaces de agregacion con mismo todo en un bus unico, y permitir renombrar etiqueta de enlace desde el inspector preservando OPL y render.

**Slice minimo entregable**: helper `agregacionBus.ts` agrupa enlaces de agregacion por puerto compartido, proyeccion JointJS muestra triangulo unico con salidas, `InspectorEnlace` edita `enlace.etiqueta`, validacion de etiqueta vacia para enlace etiquetado si existe, OPL/render reflejan la etiqueta sin reemplazar verbos canonicos.

**Fuera de slice**: crear enlace estructural etiquetado nuevo si el tipo aun no existe, bus para exhibicion/generalizacion/clasificacion, multi-seleccion batch HU-11.007, vertices manuales y estilo visual de enlaces.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-11.004 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Fusionar multiples enlaces de agregacion en bus vertical unico. |
| HU-11.014 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Renombrar etiqueta del enlace y sincronizar render + OPL. |
| HU-SHARED-004 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-004-renombrar.md` | Patron de renombrado aplicado a scope enlace. |
| HU-SHARED-007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | OPL reactivo ante cambio de etiqueta. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-visual-es.md` V-129 prescribe topologia de agregacion multiple con triangulo y N salidas; V-239 lista las cinco familias canonicas de enlace; `opm-opl-es.md` §9 cubre enlaces estructurales y etiquetas; `opm-iso-19450-es.md` §multiplicidad y enlaces estructurales mantiene cada enlace como hecho independiente.
- **Corpus interno reusable**:
  - `assets/svg/links/structural/aggregation.svg` es marker canonico de agregacion.
  - `opm-extracted/MODULES.md` lista `src/app/models/DrawnPart/Links/AggregationLink.ts` y `src/app/configuration/elementsFunctionality/linkDrawing.ts`.
  - `opm-extracted/INDEX.md` mapea `AggregationLink`, `TriangleClass`, `OpmFundamentalLink`, `OpmStructuralLink` y `OpmTaggedLink`.
  - `docs/JOYAS.md` documenta colores `#586D8C`, wrapper+line 15px/2px y triangulo estructural.
- **Estado actual del codigo**:
  - `app/src/render/jointjs/proyeccion.ts` tiene `proyectarRefinamientoEstructural` y marcadores estructurales, pero no bus unico de agregacion multiple.
  - `app/src/modelo/tipos.ts` ya define `Enlace.etiqueta: string`.
  - `app/src/ui/InspectorEnlace.tsx` edita multiplicidad, modificadores, rutas y extremos, pero no campo etiqueta general.
  - `app/src/opl/generar.ts` emite OPL por tipo de enlace; debe agregar etiqueta como tag adicional sin romper verbo canonico.

## 4. Archivos permitidos

```text
app/src/modelo/etiquetasEnlace.ts          NUEVO
app/src/modelo/etiquetasEnlace.test.ts     NUEVO
app/src/render/jointjs/agregacionBus.ts    NUEVO
app/src/render/jointjs/proyeccion.ts       EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts  EDIT aditivo
app/src/ui/InspectorEnlace.tsx             EDIT aditivo
app/src/opl/generar.ts                     EDIT aditivo
app/src/opl/generar.test.ts                EDIT aditivo
app/src/store.ts                           EDIT aditivo
app/src/store.test.ts                      EDIT aditivo
app/e2e/opm-smoke.spec.ts                  EDIT aditivo
assets/svg/links/structural/aggregation.svg LECTURA
docs/JOYAS.md                              LECTURA
opm-extracted/**                           LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/modelo/estilos.ts` ni campos de estilo de L6.
- No tocar `PanelOpl.tsx`; L1 posee interaccion OPL.
- No cambiar `TipoEnlace` salvo que una implementacion anterior ya haya introducido `"etiquetado"` y se necesite compatibilidad.
- El bus es render derivado: no fusionar `modelo.enlaces`.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Crear helper puro:

```ts
export function renombrarEtiquetaEnlace(modelo: Modelo, enlaceId: Id, etiqueta: string): Resultado<Modelo>;
export function etiquetaEnlaceNormalizada(etiqueta: string | undefined): string;
```

Reglas:

- `trim`.
- Etiqueta vacia se permite para enlaces canonicos si es tag opcional.
- Si existe tipo etiquetado libre en el codigo final, etiqueta vacia falla para ese tipo.

### Operaciones

Store:

```ts
renombrarEtiquetaEnlaceSeleccionado(etiqueta: string): void;
```

Usar `commitModelo` y conservar seleccion de enlace.

### Serializacion

Sin cambio de schema: `Enlace.etiqueta` ya existe. Confirmar que roundtrip preserva etiqueta.

### Render

`agregacionBus.ts` debe agrupar apariencias de enlace:

```ts
export function proyectarBusesAgregacion(args: {
  modelo: Modelo;
  opdId: Id;
  enlaces: EnlaceConEndpointVisual[];
  seleccionados: Set<Id>;
}): { busCells: JointCellJson[]; enlacesConsumidos: Set<Id> };
```

El bus debe:

- agrupar solo `tipo === "agregacion"` con mismo origen todo o mismo destino todo segun direccion existente;
- dibujar un triangulo unico y N ramas;
- mantener cada enlace seleccionable por metadata de rama o labels;
- degradar a render actual cuando solo hay un enlace.

### OPL

Para enlace canonico con etiqueta, agregar tag adicional sin reemplazar verbo:

```text
**Todo** consiste en **Parte**. [etiqueta: componente critico]
```

Si el repo ya tiene convencion distinta, usarla y testearla. No cambiar plantillas base.

### UX

Agregar campo "Etiqueta" en `InspectorEnlace`. Debe ser editable para cualquier enlace, con error inline solo cuando el tipo exija etiqueta no vacia.

### Cross-capa

El bus debe actualizarse al eliminar una rama y volver a render simple cuando queda una sola. La etiqueta debe verse en render y OPL, y persistir por JSON existente.

## 7. Tests obligatorios

- Unit modelo: renombrar etiqueta trim y preserva enlace seleccionado.
- Unit modelo: etiqueta vacia permitida para agregacion como tag opcional.
- Proyeccion: dos agregaciones con mismo todo producen un bus/triangulo unico y no dos triangulos.
- Proyeccion: al quedar una agregacion se usa render simple.
- OPL: etiqueta no reemplaza verbo canonico de agregacion.
- Store/UI: editar etiqueta desde inspector actualiza render/OPL.
- Smoke: crear Todo + dos Partes, dos agregaciones, verificar bus unico; renombrar etiqueta y ver OPL actualizado.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- La fusion de agregacion es visual, no de modelo.
- Cada enlace sigue teniendo identidad y seleccion propia.
- La etiqueta de enlace canonico es tag adicional, no sustituye semantica OPL.
- No implementar estilo visual de enlaces en esta linea.

## 10. Decisiones que tomas vos (documentar en commit)

- Como escoger el puerto compartido cuando las ramas no son perfectamente alineadas.
- Si el bus se dibuja con `standard.Link` multiple o con `standard.Path` compuesto.
- Como exponer seleccion de rama dentro del bus.
- Texto exacto del tag OPL para etiqueta opcional.

## 11. Forma del entregable

Commits sugeridos:

- `feat(render): fusiona agregaciones en bus unico`
- `feat(modelo): permite renombrar etiquetas de enlace`
- `test(enlaces): cubre bus de agregacion y etiquetas`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas y bloqueos.
