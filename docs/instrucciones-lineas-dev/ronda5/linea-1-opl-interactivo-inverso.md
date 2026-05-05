# Linea 1 — OPL interactivo inverso

## 1. Mision

Cerrar el primer slice de OPL inversa: numerar oraciones, asociar cada token/oracion con entidades o enlaces del modelo, permitir resaltado cruzado OPL-ES <-> OPD, filtrar por seleccion activa y disparar edicion basica desde OPL.

**Slice minimo entregable**: `PanelOpl` renderiza lineas numeradas, tokens con metadata estable, hover/click sincroniza seleccion con canvas, toggle "Filtrar por seleccion", doble clic en nombre de cosa invoca renombrado y doble clic en verbo de enlace selecciona el enlace/abre su inspector.

**Fuera de slice**: parser libre de OPL, cambios estructurales desde texto, busqueda OPL, export HTML, AI text, reubicacion lateral del panel y edicion de multiplicidad/ruta desde la frase.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-50.002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Numeracion ordinal visible de oraciones OPL-ES. |
| HU-50.017 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Resaltado cruzado OPL-ES <-> OPD por hover. |
| HU-50.018 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Filtro por seleccion activa en canvas. |
| HU-50.019 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Doble clic en nombre de cosa renombra via HU-SHARED-004. |
| HU-50.020 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Doble clic en verbo selecciona enlace y expone propiedades. |
| HU-50.022 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | La edicion textual se propaga al canvas en vivo. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` define OPL como representacion textual y delega superficie a OPL-ES; `opm-opl-es.md` §1 fija nombres y roundtrip, §3-§10 plantillas y Ap. A gramatica; `opm-opl-es.md` §17 exige preservar semantica EN/ES sin alterar el modelo interno.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/rappid-components/rappid-opl/rappid-opl.component.ts`, `src/app/modules/layout/opl-container/opl-container.component.ts`, `src/app/dialogs/opl-dialog/opl-dialog.component.ts` y `src/app/models/modules/attribute-validation/validation-module.ts` como referencias de panel, configuracion y servicio OPL.
  - `opm-extracted/INDEX.md` mapea `RappidOplComponent`, `OplContainerComponent`, `OplDialogComponent`, `OplService` y `OplSettingsComponent`.
  - `docs/JOYAS.md` §9 documenta el motor OPL observado (`generateLinksWithOpl(link)`) y confirma que OPCloud trata OPL como lente natural generada desde el modelo.
- **Estado actual del codigo**:
  - `app/src/opl/generar.ts` devuelve `string[]`; no hay metadata tokenizada.
  - `app/src/ui/PanelOpl.tsx` renderiza Markdown simple con `strong`/`em`, sin numeracion, hover, filtro ni edicion inversa.
  - `app/src/store.ts` ya tiene `renombrarSeleccionada`, `seleccionarEntidad`, `seleccionarEnlace`, `opdActivoId`, `seleccionId` y `enlaceSeleccionId`.
  - `app/src/render/jointjs/proyeccion.ts` ya recibe seleccion para resaltar celdas; cualquier hover debe ser aditivo.

## 4. Archivos permitidos

```text
app/src/opl/generar.ts                  EDIT aditivo
app/src/opl/interaccion.ts              NUEVO
app/src/opl/generar.test.ts             EDIT aditivo
app/src/ui/PanelOpl.tsx                 EDIT aditivo fuerte
app/src/render/jointjs/JointCanvas.tsx  EDIT aditivo si se requiere hover canvas->OPL
app/src/render/jointjs/proyeccion.ts    EDIT aditivo acotado solo para hover visual
app/src/render/jointjs/proyeccion.test.ts EDIT aditivo si toca hover visual
app/src/store.ts                        EDIT aditivo
app/src/store.test.ts                   EDIT aditivo
app/e2e/opm-smoke.spec.ts               EDIT aditivo
docs/JOYAS.md                           LECTURA
opm-extracted/**                        LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `Toolbar.tsx`, `ArbolOpd.tsx`, persistencia ni dialogos de L2.
- No cambiar la firma existente `generarOpl(modelo, opdId): string[]`; agregar una funcion paralela, por ejemplo `generarOplInteractivo(...)`.
- No implementar parser libre. La edicion inversa solo usa IDs que el generador ya conoce.
- No editar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- Si L4 ya agrego etiquetas de enlace, reusar su metadata en el generador; no duplicar reglas de etiqueta.

## 6. Slice minimo shippeable

### Modelo

Sin nuevos constructos OPM. Agregar tipos derivados en `app/src/opl/interaccion.ts`:

```ts
export interface OplLineaInteractiva {
  id: string;
  texto: string;
  ordinal: number;
  refs: OplReferencia[];
  tokens: OplToken[];
}

export type OplReferencia =
  | { tipo: "entidad"; id: Id }
  | { tipo: "enlace"; id: Id }
  | { tipo: "estado"; id: Id };
```

### Operaciones

Agregar acciones store acotadas:

```ts
seleccionarDesdeOpl(ref: OplReferencia): void;
renombrarEntidadDesdeOpl(entidadId: Id, nombre: string): void;
fijarFiltroOplPorSeleccion(activo: boolean): void;
fijarHoverOpl(ref: OplReferencia | null): void;
```

### Serializacion

Sin cambios.

### Render

Si la seleccion normal no alcanza para hover, agregar `hoverOplRef` como estado UI y proyectarlo como stroke/fill temporal. No persistirlo.

### OPL

Agregar `generarOplInteractivo(modelo, opdId)` que reusa el recorrido de `generarOpl` o lo envuelve con metadata. Cada linea debe conocer sus entidades/enlaces; no depender de regex sobre el texto renderizado si el generador tiene el dato fuente.

### UX

- Numeracion `1.`, `2.`, etc. siempre visible.
- Toggle compacto para "Filtrar por seleccion".
- Hover sobre token OPL resalta canvas; hover sobre entidad/enlace canvas puede resaltar lineas OPL si `JointCanvas` expone evento liviano.
- Doble clic en token entidad convierte a input inline con validacion existente de nombre.
- Doble clic en verbo de enlace selecciona el enlace y deja visible `InspectorEnlace`; no abrir modal nuevo.

### Cross-capa

`PanelOpl` debe seguir aceptando las marcas Markdown actuales para objeto/proceso y no cambiar el texto canonico emitido por `generarOpl`.

## 7. Tests obligatorios

- Unit OPL: `generarOplInteractivo` conserva el texto de `generarOpl` y agrega ordinales estables.
- Unit OPL: cada oracion de enlace contiene una referencia `tipo: "enlace"` y tokens para extremos.
- Store: seleccionar desde OPL cambia `seleccionId` o `enlaceSeleccionId` y limpia el modo enlace.
- Store: renombrar desde OPL usa la misma operacion de renombrado que el inspector.
- Component/UI: filtro por seleccion reduce lineas a las que tocan la entidad/enlace activo.
- Smoke: crear dos cosas y un enlace, verificar numeracion, hover/filtro y doble clic de renombrado.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- OPL-ES es lente derivada; no es nueva fuente de verdad del modelo.
- La edicion inversa de esta ronda solo cubre nombres y seleccion de enlace; no parsea sentencias completas.
- `generarOpl` se mantiene compatible para tests y consumidores existentes.
- No se introduce dependencia de editor rich-text ni parser externo.

## 10. Decisiones que tomas vos (documentar en commit)

- Si `PanelOpl` usa input inline o `prompt` controlado por componente para renombrar; preferir input inline si no aumenta mucho el scope.
- Como representar hover visual: seleccion temporal en store o prop separada hacia `JointCanvas`.
- Si la numeracion se filtra manteniendo ordinal original o reenumera la vista filtrada; documentar y testear.
- Si tokens de estados se exponen en el primer slice o solo quedan como refs de linea.

## 11. Forma del entregable

Commits sugeridos:

- `feat(opl): agrega lineas interactivas con referencias`
- `feat(ui): sincroniza panel opl con seleccion`
- `test(opl): cubre numeracion filtro y edicion inversa`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas y cualquier HU que quede parcial.
