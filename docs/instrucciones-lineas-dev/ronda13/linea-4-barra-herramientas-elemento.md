# Línea 4 — BarraHerramientasElemento.tsx flotante (12 acciones primarias OPCloud, 6 piloto)

## 1. Misión

Crear `app/src/ui/BarraHerramientasElemento.tsx` (NUEVO ~400 LOC) — barra flotante anclada al canvas junto a la cosa seleccionada con **6 acciones primarias OPCloud destiladas** (de las 12 catalogadas por steipete §T2.5). Pilotar como **complemento del Inspector lateral** (no reemplazo). Botón "···" abre/cierra Inspector lateral con detalle completo.

**Enmienda IFML absorbida**: la barra se implementa explícitamente como `CN-SOT/CN-MOT` (Single/Multiple Object Toolbar; ronda 13 solo Single Object). Cada botón debe mapear `Event → Action existente/handler nombrado`; no introducir lambdas inline opacas ni nuevas acciones de store fuera de scope. Ver `docs/auditorias/2026-05-07-auditoria-ifml.md` §6 y §8 H-2.

**Guardrail OPL reverse**: L4 es una barra de acciones contextuales sobre canvas/Inspector. No toca `PanelOpl`, generadores OPL, parser, edicion textual libre ni HU-SHARED-007. Ver `docs/auditorias/2026-05-07-opl-reverse-ssot-opm-extracted.md`.

12 acciones primarias OPCloud (steipete §T2.5):

| # | Acción OPCloud | SVG canónico | Acción equivalente repo | Piloto en ronda 13 |
|---|---|---|---|---|
| 1 | regularCopyStyle | (sin SVG; texto "Copiar estilo") | `copiarEstiloEnlaceAlPortapapeles` (ronda 11) | ✓ |
| 2 | pasteStyle | (sin SVG; texto "Pegar estilo") | `pegarEstiloEnlaceDesdePortapapeles` (ronda 11) | ✓ |
| 3 | toggleStylingDiv | `styleElement.svg` | abrir DialogoEstiloEnlace (ronda 11) | (diferido — abre via Inspector) |
| 4 | returnToDefaultAttributes | (sin SVG; texto "Reset estilo") | `aplicarEstiloEnlacesBatch` con default | (diferido) |
| 5 | toggleTextSizeMenu | (sin SVG; texto "Aa") | abrir submenu fontSize | (diferido — Inspector) |
| 6 | addState | `addStates.svg` | acción `agregarEstado` | ✓ (solo objeto) |
| 7 | inzoomThing | `inzoom.svg` | `desplegarObjeto` modo inzoom (ronda 12.1 L1) | ✓ |
| 8 | unfoldThing | `unfold.svg` | `desplegarObjeto` modo unfold | (diferido) |
| 9 | editAlias | `editAlias.svg` | abrir SeccionAlias en Inspector | ✓ |
| 10 | editDescription | (sin SVG; texto "Desc") | abrir SeccionDescripcion en Inspector | (diferido — Inspector ya tiene) |
| 11 | editURLs | (sin SVG; texto "URL") | abrir SeccionUrls | (diferido) |
| 12 | editImage | (sin SVG canvas; ModalImagenObjeto) | abrir ModalImagenObjeto (solo objeto) | ✓ (solo objeto) |

**6 acciones piloto ronda 13**: copiar estilo, pegar estilo, agregar estado (objeto), inzoom, editar alias, editar imagen (objeto). + **botón "···"** que abre el Inspector lateral con detalle completo (las 6 diferidas + Designaciones + LayoutEstados + Refinamiento + Tamano + Atributo + EsenciaAfiliacion).

Lógica de posicionamiento: anchor al bounding box de la apariencia seleccionada con offset 8px arriba; collision avoidance con bordes del viewport (si arriba no cabe, abajo; si izquierda no cabe, derecha). Re-posicionar en pan/zoom del canvas. Desaparecer al perder selección.

Slice mínimo entregable: 1 commit `feat(ui): BarraHerramientasElemento esqueleto + posicionamiento` + 6 commits `feat(barra): accion N` + 1 commit `feat(ui): integracion App.tsx + Inspector boton "..."` + 2 commits `test(e2e): smokes barra flotante`.

**Fuera de slice**:

- **No tocar Toolbar.tsx ni `toolbar/*.tsx`** (territorio L1; L1 deja slot opcional en `ToolbarSeleccion.tsx` que L4 puede invocar o ignorar).
- **No tocar `tokens.ts`** salvo importar (territorio L2).
- **No tocar `checkers.ts` ni `PanelMetodologia.tsx`** (territorio L3).
- **No reemplazar Inspector** (es complemento; el botón "···" abre Inspector lateral).
- **No portar las 12 acciones**: solo 6 piloto. Las 6 restantes diferidas a iteración futura post-UX research.
- **No modificar render JointJS handlers/seleccion.ts** salvo lectura del anchor coordinates. Si requiere extensión, **abortar y reportar**.
- **No introducir collision avoidance complejo**: heurística simple suficiente para piloto.
- **No introducir keyboard shortcut nuevo** para abrir/cerrar la barra (selección hace toggle automático).
- **No resolver modal-stack ni CustomEvents** (IFML H-1/H-3/H-4 quedan para ronda 13.1).

## 2. HU base

| HU | Estado actual | Aporte L4 |
|---|---|---|
| **HU-SHARED-001 Menú contextual unificado** (parcial existente — `MenuContextualEntidad.tsx` cubre RB) | parcial → refuerzo evidencia (la barra flotante extiende el menú contextual con acciones primarias visibles permanentemente) | Aporte: barra flotante para 6 acciones primarias accesibles sin abrir menú contextual. Refuerza HU-SHARED-001 sin cerrarla (cierre completo requiere las 12 acciones + research). |
| **Sin HU directa específica** para "barra flotante" | refactor estructural autorizado por brief steipete §T2.5 | Crear paradigma UI nuevo análogo a OPCloud element-tool-bar. |

L4 puede registrar nueva métrica complementaria "tiempo a acción primaria" (UX research post-piloto), pero NO cierra HU directas en ronda 13.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas opcionales)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/06-PROVENANCE.md §2`: política operativa.

**Nivel 2 — `app/src/modelo/tipos.ts`**: ronda 13 NO modifica tipos kernel desde L4.

**Nivel 3 — respaldo técnico**:

- **`docs/JOYAS.md §2`**: dimensiones canónicas íconos. **Cita obligatoria header BarraHerramientasElemento**: `[JOYAS §2]`.
- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md` §T2.5**: contrato L4 (lista 12 acciones, recomendación de pilotar 6).
- **`docs/auditorias/2026-05-07-auditoria-ifml.md` §6 CN-SOT/CN-MOT + §8 H-2**: contrato de interacción L4; barra contextual como ViewContainer/ViewComponent de acción sobre objeto seleccionado.
- **`docs/auditorias/2026-05-07-opl-reverse-ssot-opm-extracted.md`**: guardrail L4; la barra no adelanta OPL reverse.
- **`opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`** (8979 LOC, post-Angular IVY, **NO portar 1:1**): solo extraer la lista de 12 acciones. Implementación nueva en Preact + JointJS OSS.
- **Estado actual del código (verificado)**:
  - `app/src/render/jointjs/handlers/seleccion.ts`: handler de selección (lectura para anchor coordinates).
  - `app/src/store/seleccion.ts`: `seleccion` array, `seleccionPrincipal`.
  - `app/src/ui/InspectorEntidad.tsx`: contiene Secciones; el botón "···" toggleará su visibilidad (lectura + modificación mínima).
  - `app/src/render/jointjs/runtime.ts` o `paper.ts`: `paperToLocal` / `paperToClient` para conversión de coordenadas (verificar API exacta JointJS).
  - `assets/svg/`: SVGs canónicos disponibles (verificado ronda 12.1 L3): `inzoom.svg`, `addStates.svg`, `editAlias.svg`, `styleElement.svg` ya cableables.
  - `app/src/ui/MenuContextualEntidad.tsx` ronda 12: 70 LOC, 4 ítems texto. Patrón referencial para acciones contextuales.

## 4. Archivos permitidos

```text
app/src/ui/BarraHerramientasElemento.tsx                NUEVO (~400 LOC: barra + 6 acciones + posicionamiento + boton "...")
app/src/ui/App.tsx                                      EDIT aditivo (montar BarraHerramientasElemento condicional a seleccion === 1)
app/src/ui/InspectorEntidad.tsx                         EDIT aditivo (recibe prop `colapsado?` opcional + handler para boton "..."; si colapsado, no monta secciones)
app/src/ui/tokens.ts                                    LECTURA (importar tokens.colors, tokens.spacing, tokens.shadows.flotante)
app/src/render/jointjs/handlers/seleccion.ts            LECTURA (extraer bbox de apariencia seleccionada; si requiere export nuevo, pausar y reportar)
app/src/render/jointjs/runtime.ts                       LECTURA (paperToLocal/paperToClient si necesita conversión coords)
app/src/store/seleccion.ts                              LECTURA (seleccion, seleccionPrincipal, helpers)
app/src/store/runtime.ts                                LECTURA (modelo, opdActivoId)
app/src/store/modelo/acciones-canvas.ts                 LECTURA (acciones existentes a invocar: copiarEstilo, pegarEstilo, etc.)
app/src/store/modelo/acciones-entidad.ts                LECTURA (acciones agregar estado, alias, inzoom)
app/src/store/modelo/acciones-ui.ts                     LECTURA (abrir Inspector si "..." colapsa)
app/e2e/02-canvas-y-render.spec.ts                      EDIT aditivo (1-2 smokes barra aparece con seleccion)
app/e2e/06-undo-redo-dirty.spec.ts                      EDIT aditivo (1 smoke acciones de la barra reflejan en undo)
opm-extracted/src/app/modules/layout/element-tool-bar/  LECTURA (referencia lista 12 acciones, NO copia 1:1)
docs/HANDOFF.md                                         LECTURA
docs/auditorias/2026-05-07-refactor-radical-steipete.md LECTURA
docs/auditorias/2026-05-07-auditoria-ifml.md            LECTURA
docs/JOYAS.md                                           LECTURA
assets/svg/**                                           LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `Toolbar.tsx` ni `toolbar/*.tsx`** (L1). Si L1 dejó slot en `ToolbarSeleccion.tsx`, L4 decide invocar o no.
- **No tocar `tokens.ts`** salvo lectura (L2).
- **No tocar `checkers.ts`, `tipos/avisos.ts`, `PanelMetodologia.tsx`** (L3).
- **No tocar `app/src/render/jointjs/handlers/seleccion.ts`** salvo lectura. Si emerge necesidad de exportar bbox utility, **pausa y reporta**.
- **No tocar `customShapes.ts`** (suelto del operador).
- **No introducir keyboard shortcut nuevo** para abrir/cerrar barra (selección hace toggle natural).
- **No reemplazar Inspector**: el botón "···" lo expande/colapsa, pero el Inspector lateral sigue siendo el lugar canónico para todas las propiedades.
- **No tocar acciones-canvas/ui/entidad.ts** salvo lectura. La barra invoca acciones existentes; cero acciones nuevas.
- **No tocar OPL**: `app/src/opl/**`, `app/src/modelo/opl/**`, `PanelOpl.tsx` y `panelOpl/**` quedan fuera de scope.
- **No crear lambdas opacas**: si un botón combina pasos (ej. abrir sección + enfocar), crear `handleAbrirAlias`/`handleInzoom` nombrado dentro de `BarraHerramientasElemento.tsx`.
- **App.tsx en zona compartida con L1 (lazy) y L3 (PanelMetodologia)**: L4 monta `BarraHerramientasElemento` como overlay flotante (no en layout principal). Hunks disjuntos.
- **No portar las 12 acciones OPCloud**: solo 6 piloto. Las 6 diferidas a iteración futura.

## 6. Slice mínimo shippeable

### 6.1 Esqueleto + posicionamiento

```typescript
// app/src/ui/BarraHerramientasElemento.tsx (~400 LOC total)
// [JOYAS §2] [HU-SHARED-001] barra flotante con 6 acciones primarias OPCloud
// destiladas (steipete §T2.5). Complemento del Inspector lateral, no reemplazo.
// IFML: CN-SOT/CN-MOT contextual toolbar; Event -> Action nombrada.
// Refs: opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts
//       (8979 LOC post-Angular IVY; solo lista de acciones extraída).

import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store/runtime";
import { tokens } from "./tokens";

interface PosicionAnchor {
  x: number;
  y: number;
  visible: boolean;
}

export function BarraHerramientasElemento() {
  const seleccion = useOpmStore((s) => s.seleccion);
  const seleccionPrincipal = useOpmStore((s) => s.seleccionPrincipal);
  const [pos, setPos] = useState<PosicionAnchor>({ x: 0, y: 0, visible: false });
  const [inspectorAbierto, setInspectorAbierto] = useState(true);  // estado local del toggle "..."

  useEffect(() => {
    if (seleccion.length !== 1 || !seleccionPrincipal) {
      setPos({ x: 0, y: 0, visible: false });
      return;
    }
    const bbox = obtenerBboxApariencia(seleccionPrincipal);  // helper privado: lee del DOM JointJS
    if (!bbox) {
      setPos({ x: 0, y: 0, visible: false });
      return;
    }
    const { x, y } = posicionarConCollisionAvoidance(bbox, /* viewportSize */);
    setPos({ x, y, visible: true });
  }, [seleccion, seleccionPrincipal]);

  if (!pos.visible) return null;

  const entidad = obtenerEntidad(seleccionPrincipal);  // helper
  const esObjeto = entidad?.tipo === "objeto";

  return (
    <div
      data-testid="barra-herramientas-elemento"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        background: tokens.colors.fondoChrome,
        boxShadow: tokens.shadows.flotante,
        borderRadius: tokens.radii.md,
        padding: tokens.spacing.sm,
        display: "flex",
        gap: tokens.spacing.xs,
        zIndex: 100,
      }}
    >
      <BotonCopiarEstilo />
      <BotonPegarEstilo />
      {esObjeto && <BotonAgregarEstado />}
      <BotonInzoom />
      <BotonEditarAlias />
      {esObjeto && <BotonEditarImagen />}
      <BotonMasOpciones onClick={() => setInspectorAbierto((v) => !v)} aria-pressed={inspectorAbierto} />
    </div>
  );
}

function posicionarConCollisionAvoidance(bbox: DOMRect, viewport?: { w: number; h: number }): { x: number; y: number } {
  // heurística simple: arriba 8px del bbox; si y < 0, abajo del bbox.
  const x = bbox.left + bbox.width / 2 - 200;  // centrar (200 = mitad del width estimado de la barra)
  let y = bbox.top - 48 - 8;  // 48 = altura barra estimada
  if (y < 0) y = bbox.bottom + 8;
  return { x, y };
}
```

### 6.2 Las 6 acciones piloto

Cada botón es un sub-componente que invoca una acción existente del store:

```typescript
function BotonCopiarEstilo() {
  const ejecutar = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  return <button onClick={ejecutar} title="Copiar estilo (Ctrl+Alt+C)" data-testid="barra-copiar-estilo">📋</button>;
}

function BotonPegarEstilo() {
  const ejecutar = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  return <button onClick={ejecutar} title="Pegar estilo (Ctrl+Alt+V)" data-testid="barra-pegar-estilo">📋✓</button>;
}

function BotonAgregarEstado() {
  const ejecutar = useOpmStore((s) => s.agregarEstado);  // verificar nombre exacto
  return (
    <button onClick={() => ejecutar(/* defaultEstado */)} title="Agregar estado" data-testid="barra-agregar-estado">
      <img src="/assets/svg/addStates.svg" alt="" width={16} height={16} />
    </button>
  );
}

function BotonInzoom() {
  const ejecutar = useOpmStore((s) => s.desplegarSeleccionada);
  return (
    <button onClick={() => ejecutar("agregacion")} title="Inzoom" data-testid="barra-inzoom">
      <img src="/assets/svg/inzoom.svg" alt="" width={16} height={16} />
    </button>
  );
}

function BotonEditarAlias() {
  const abrirSeccionAlias = useOpmStore((s) => s.abrirInspectorSeccion);  // verificar nombre exacto
  return (
    <button onClick={() => abrirSeccionAlias?.("alias")} title="Editar alias" data-testid="barra-editar-alias">
      <img src="/assets/svg/editAlias.svg" alt="" width={16} height={16} />
    </button>
  );
}

function BotonEditarImagen() {
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);  // verificar nombre exacto
  return <button onClick={abrirModalImagen} title="Editar imagen" data-testid="barra-editar-imagen">🖼</button>;
}

function BotonMasOpciones({ onClick, ariaPressed }: { onClick: () => void; ariaPressed: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ariaPressed}
      title={ariaPressed ? "Cerrar Inspector lateral" : "Abrir Inspector lateral"}
      data-testid="barra-mas-opciones"
    >
      ⋯
    </button>
  );
}
```

### 6.3 Integración en `App.tsx`

```tsx
// App.tsx (zona overlay)
<BarraHerramientasElemento />
```

Se monta siempre; el componente decide internamente si renderear (via `pos.visible`).

### 6.4 Integración con InspectorEntidad

`InspectorEntidad.tsx` recibe prop nueva opcional `colapsado?: boolean`. Si `colapsado === true`, no rendera secciones (solo placeholder). El estado del toggle vive en `BarraHerramientasElemento` para piloto (ronda 14+ podría moverlo a store si se valida UX).

```typescript
// InspectorEntidad.tsx (modificación mínima)
interface Props {
  // ... props existentes
  colapsado?: boolean;
}
export function InspectorEntidad({ /* ... */, colapsado = false }: Props) {
  if (colapsado) return <div data-testid="inspector-colapsado" />;
  // resto del rendering existente
}
```

## 7. Tests obligatorios

**Unit tests (~30 nuevos)**: en archivos de test del componente o `barra-herramientas-elemento.test.tsx` si existe convención.

- Posicionamiento: bbox arriba dentro del viewport → posición arriba; bbox cerca del top → posición abajo (collision avoidance básico).
- Visibility: seleccion === 1 → visible; seleccion === 0 → no visible; seleccion >= 2 → no visible.
- Acciones invocan el handler correcto del store (mock store).
- `BotonAgregarEstado` y `BotonEditarImagen` solo se renderean si `entidad.tipo === "objeto"`.
- `BotonMasOpciones` toggle correcto.

**Smoke browser** (`app/e2e/02-canvas-y-render.spec.ts`, `06-undo-redo-dirty.spec.ts`), 2-3 nuevos:

- `02-*`: cargar demo, seleccionar un objeto, verificar que `[data-testid="barra-herramientas-elemento"]` aparece y muestra los 6 botones esperados.
- `02-*`: deseleccionar, verificar que la barra desaparece.
- `06-*`: clic en `[data-testid="barra-copiar-estilo"]` y luego clic en `[data-testid="barra-pegar-estilo"]` aplica estilo correctamente; undo revierte.

## 8. Verificación

```bash
cd app
bun run check          # 675 → ~705 (con +30 tests barra)
bun run browser:smoke  # 93 → ~96 (con +3 smokes barra)
bun run build          # main chunk +~5 kB por barra; sigue ≤ 195 kB post-L1 lazy
```

Verificar:

- `app/src/ui/BarraHerramientasElemento.tsx` ≤ 500 LOC.
- `data-testid="barra-herramientas-elemento"` aparece con selección 1 entidad.
- 6 acciones funcionan (smoke + visual diff).
- Botón "···" toggle Inspector.
- Posicionamiento adecuado (no se sale del viewport).
- Cero impacto sobre Toolbar, tokens, checkers, App.tsx layout principal.

## 9. Decisiones bloqueadas (no reabrir)

- **Piloto = 6 acciones**, no 12. Las 6 diferidas (toggleStylingDiv, returnToDefaultAttributes, toggleTextSizeMenu, unfoldThing, editDescription, editURLs) NO se implementan en ronda 13. Iteración futura post-UX research.
- **Complemento del Inspector**, NO reemplazo. El Inspector lateral sigue siendo canónico.
- **Anchor al canvas vía bbox del DOM JointJS**. NO modificar render handlers para emitir nuevo evento; usar lectura del DOM.
- **Heurística simple de collision avoidance**: arriba primero, abajo si no cabe. NO implementar grid de posiciones, NO floating-ui library, NO popper.js. Suficiente para piloto.
- **Estado del toggle "···" vive en el componente**, no en store. Si UX valida, ronda 14+ lo mueve a store.
- **Cero acciones store nuevas**: la barra invoca solo acciones ya existentes.
- **Cero cambios JointJS handlers**: si requiere extensión, pausar y reportar.

## 10. Decisiones que tomas vos (documentar en commit)

- **Nombres exactos de las acciones del store**: el slice §6.2 propone `copiarEstiloEnlaceAlPortapapeles`, `pegarEstiloEnlaceDesdePortapapeles`, `agregarEstado`, `desplegarSeleccionada`, `abrirInspectorSeccion`, `abrirModalImagen`. Verificar nombres reales en `store/tipos.ts` y ajustar.
- **Helper `obtenerBboxApariencia`**: implementación exacta depende de cómo JointJS expone la geometría. Si requiere `paper.findViewByModel(modelo).getBBox()`, verificar API. Si no es trivial, considerar usar `getBoundingClientRect()` del elemento DOM con selector específico.
- **Visualización de los 6 botones**: el slice usa emoji + SVG. Si visualmente queda mejor todo SVG, agregar SVGs faltantes (verificar primero con `ls assets/svg/` qué hay; usar text fallback si no existe).
- **Posición exacta del botón "···"**: al final de la barra (recomendado), o en una esquina. Documentar.
- **Integración con `ToolbarSeleccion.tsx` (slot opcional L1)**: si L1 dejó slot, decidir invocar la barra desde allí o como overlay separado. Recomendación: overlay separado en App.tsx (más simple).
- **Tamaño de íconos**: 16x16 px sugerido (`[JOYAS §2]`); ajustar.
- **Mensajes title de los botones**: en es-CL con atajo cuando aplique. Documentar tabla.
- **Si `getBoundingClientRect` no funciona** porque JointJS usa SVG: usar `paperToClient` o equivalente. Documentar elección.
- **Si seleccionar enlace** (no entidad): el slice asume entidad. Si se quiere extender a enlace, agregar discriminante. Recomendación: ronda 13 solo entidades; enlaces en iteración futura.
- **Mapa IFML de cada botón**: documentar `Event`, `Action`, precondición y resultado normal/excepcional (mensaje/disabled).

## 11. Forma del entregable

Al cierre de L4, declarar:

- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat HEAD~10 HEAD` aprox 10 commits).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail).
- Lista de commits creados en orden + rationale por uno.
- Decisiones declaradas (§10): acciones store, helper bbox, visualización, posición "···", integración con ToolbarSeleccion, mensajes title.
- Tabla de las 6 acciones implementadas con su `data-testid` y la acción store invocada.
- Tabla IFML L4: `Event → Action nombrada → Flow/resultado` para los 6 botones + "···".
- Confirmación que `BarraHerramientasElemento` aparece/desaparece correctamente con cambio de selección (smoke verde).
- Confirmación archivos no tocados (de §5) — especialmente `seleccion.ts` solo lectura.

Commits sugeridos (orden):

1. `feat(ui): BarraHerramientasElemento esqueleto + posicionamiento + visibility (T2.5 steipete piloto 6/12)`
2. `feat(barra): BotonCopiarEstilo + BotonPegarEstilo (acciones existentes ronda 11)`
3. `feat(barra): BotonAgregarEstado solo objeto (assets/svg/addStates.svg)`
4. `feat(barra): BotonInzoom (assets/svg/inzoom.svg) + integracion desplegarSeleccionada ronda 12.1 L1`
5. `feat(barra): BotonEditarAlias (assets/svg/editAlias.svg) + abrir SeccionAlias`
6. `feat(barra): BotonEditarImagen solo objeto + abrir ModalImagenObjeto`
7. `feat(barra): BotonMasOpciones toggle Inspector lateral`
8. `feat(ui): InspectorEntidad acepta prop colapsado? para toggle desde barra`
9. `feat(ui): integracion en App.tsx como overlay condicional a seleccion === 1`
10. `test(ui): cobertura ~30 tests + 3 smokes (visibility, posicionamiento, acciones)`

Cada commit debe dejar la rama verde. Co-author si aplica.

Si dudás de un caso límite: detente y reporta al operador antes de actuar.
