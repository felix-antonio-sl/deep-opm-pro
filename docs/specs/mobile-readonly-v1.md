# Mobile Solo-Lectura v1 — Especificación Técnica

**Estado**: decisiones §14 confirmadas 2026-06-06, lista para implementación
**Versión**: 1.1
**Fecha**: 2026-06-06 (decisiones confirmadas)
**Encadre**: el dispositivo móvil del modelador OPM es un **lector**, no un autor. Esta spec refactoriza el `data-context-modo="mobile"` para que el runtime sea genuinamente de lectura, eliminando affordances de edición y agregando affordances de consulta.

---

## 1. Principios rectores

| # | Principio | Aplicación en mobile |
|---|---|---|
| I | Sustracción | Toolbar de creación, Inspector editable, ChipPersistencia y handles JointJS **se ocultan**. |
| IV | Default brutal | Al cargar: **Diagrama del OPD raíz** visible, no árbol ni Acerca. |
| VI | Reversibilidad universal | El usuario siempre puede volver al OPD anterior con `‹` en el header o el tab "OPDs". |
| XI | Densidad sin caos | Una sola vista activa + bottom sheet modal. |
| XIII | Estado del sistema | Breadcrumb OPD siempre visible en header; zoom % en canvas; sync timestamp en Acerca. |
| XIV | Peor pantalla | iPhone SE 320 px @ 60fps; tipografía mínima 17 px body, 11 px meta. |
| XV | Copy es UI | Cada mensaje es oración completa, nunca "Algo salió mal". |

## 2. Cambios al modelo de contexto

### 2.1 Nuevos valores en `ContextModoWorkbench`

`app/src/ui/contextoWorkbench.ts`:

```ts
// ANTES
export type ContextModoWorkbench = "edicion" | "mapa" | "simulacion";

// DESPUÉS
export type ContextModoWorkbench = "edicion" | "mapa" | "simulacion" | "lectura";
```

### 2.2 Nueva derivada: `ViewPointWorkbench` ya distingue `Mobile`; la spec sólo agrega etiqueta de submodo

```ts
export type ViewPointWorkbench = "Mobile" | "Edicion" | "Mapa" | "Simulacion";

// (sin cambio en el tipo; la distinción lectura vs edición-en-mobile se hace
// por composición: cuando device=mobile y modo=lectura, App.tsx monta el
// chrome readonly descrito en §3)
```

### 2.3 Resolver

```ts
export function resolverContextModoWorkbench(input: ResolverModoWorkbenchInput): ContextModoWorkbench {
  if (input.modoSimulacionActivo) return "simulacion";
  if (input.vistaMapaActiva) return "mapa";
  if (input.modoSoloLectura) return "lectura";   // NUEVO: gana a edicion
  return "edicion";
}
```

`ResolverModoWorkbenchInput` agrega:

```ts
export interface ResolverModoWorkbenchInput {
  vistaMapaActiva: boolean;
  modoSimulacionActivo: boolean;
  modoEnlaceActivo?: boolean;
  modoCreacionActivo?: boolean;
  modoSoloLectura?: boolean;   // NUEVO
}
```

### 2.4 Activación del modo lectura

**Trigger**: `device === "mobile"`. El resolver aplica lectura automáticamente. No se necesita feature flag runtime: el breakpoint ya filtra.

`app/src/ui/App.tsx` (sitio actual donde se computa el contexto, ya en `app/src/ui/App.tsx:164`):

```tsx
const modoSoloLectura = useMemo(() => contextoWorkbench.device === "mobile", [contextoWorkbench.device]);
const contexto = useMemo(
  () => resolverContextoWorkbench({ breakpoint, vistaMapaActiva, modoSimulacionActivo, modoSoloLectura }),
  [breakpoint, vistaMapaActiva, modoSimulacionActivo, modoSoloLectura],
);
```

El `data-context-modo` del `<main>` ya pasa el audit; el nuevo valor `"lectura"` reemplaza a `"edicion"` cuando `device === "mobile"`.

## 3. Composición del chrome mobile-lectura

### 3.1 Estructura DOM

```tsx
<main data-viewpoint="Mobile" data-context-modo="lectura" data-context-device="mobile">
  <header data-testid="mobile-header-lectura">
    <LogoCompact />
    <BreadcrumbOpd onNavigate={irOpd} />
    <BotonBuscar onClick={abrirBusqueda} />
  </header>

  <section data-testid="mobile-vista-activa" aria-live="polite">
    {vistaActiva === "diagrama" && <DiagramaLectura />}
    {vistaActiva === "opl"      && <OplLectura />}
    {vistaActiva === "opds"     && <ArbolOpdsLectura />}
    {vistaActiva === "acerca"   && <AcercaLectura />}
  </section>

  <BottomNavMobileLectura vista={vistaActiva} onChange={setVistaActiva} />

  {bottomSheetEntidad && <BottomSheetEntidad entidad={bottomSheetEntidad} onDismiss={cerrarBottomSheet} />}
  {bottomSheetEnlace  && <BottomSheetEnlace  enlace={bottomSheetEnlace}   onDismiss={cerrarBottomSheet} />}
  {busquedaAbierta    && <VistaBusqueda      onDismiss={cerrarBusqueda} />}
</main>
```

### 3.2 Archivos nuevos

| Ruta | Propósito | Tamaño estimado |
|---|---|---|
| `app/src/ui/mobile/HeaderLectura.tsx` | header compacto con logo + breadcrumb + lupa | 80 LOC |
| `app/src/ui/mobile/DiagramaLectura.tsx` | wrapper sobre `<JointCanvas>` con handlers readonly | 120 LOC |
| `app/src/ui/mobile/OplLectura.tsx` | vista de oraciones con filtros y búsqueda interna | 180 LOC |
| `app/src/ui/mobile/ArbolOpdsLectura.tsx` | árbol colapsable con OPD activo marcado | 140 LOC |
| `app/src/ui/mobile/AcercaLectura.tsx` | metadata + CTA "Continuar en escritorio" | 90 LOC |
| `app/src/ui/mobile/BottomNavMobileLectura.tsx` | 4 tabs con animación de cambio | 70 LOC |
| `app/src/ui/mobile/BottomSheet.tsx` | primitive genérico con drag-to-dismiss | 160 LOC |
| `app/src/ui/mobile/BottomSheetEntidad.tsx` | ficha de cosa con OPDs donde aparece + OPL snippet | 130 LOC |
| `app/src/ui/mobile/BottomSheetEnlace.tsx` | ficha de enlace origen→tipo→destino | 100 LOC |
| `app/src/ui/mobile/VistaBusqueda.tsx` | fullscreen con fuzzy multi-sección (OPD/Entidad/OPL) | 200 LOC |
| `app/src/app/viewmodels/headerLecturaViewModel.ts` | breadcrumb OPD, deep link, sync time | 80 LOC |
| `app/src/app/viewmodels/diagramaLecturaViewModel.ts` | pan/zoom, tap detection, sin edición | 130 LOC |
| `app/src/app/viewmodels/oplLecturaViewModel.ts` | oraciones filtradas, búsqueda | 110 LOC |
| `app/src/app/viewmodels/arbolOpdsLecturaViewModel.ts` | árbol colapsable, OPD activo | 100 LOC |
| `app/src/app/viewmodels/busquedaLecturaViewModel.ts` | fuzzy 4-secciones con toggle "incluir diagnóstico" | 180 LOC |
| `app/src/app/viewmodels/bottomSheetViewModel.ts` | drag gesture, dismiss, history | 90 LOC |
| `app/src/ui/mobile/mobileReadonly.test.tsx` | tests de composición, navegación, deep link | 250 LOC |

**Total: ~2.0 KLOC nuevos**, distribuidos entre 12 archivos de feature y 5 de view model + tests.

### 3.3 Archivos modificados

| Ruta | Cambio | Justificación |
|---|---|---|
| `app/src/ui/contextoWorkbench.ts` | agregar `"lectura"` a `ContextModoWorkbench` + flag `modoSoloLectura` | feature flag nativo del resolver |
| `app/src/ui/App.tsx` | rama `device === "mobile"` monta `<MobileReadonlyApp />` en vez del chrome actual con `ModoRevisionMobile` | encapsulación |
| `app/src/ui/ModoRevisionMobile.tsx` | marcar deprecated; los tests E2E se mantienen gracias a shim que monta el bottom nav nuevo con los mismos `data-testid` | contrato estable de audit |
| `app/src/ui/tokens.ts` | agregar `mobileReadonly = { headerHeight, bottomNavHeight, bottomSheetRadius, tapTarget, bodyTextSize, bodyLineHeight, transitionFast, transitionMedium }` | tokens centralizados |
| `app/src/ui/layoutResponsive.ts` | agregar `esModoLectura(bp): boolean` helper que retorna `bp === "mobile"` | punto único de decisión |
| `app/src/ui/JointCanvas.tsx` | prop opcional `readonly?: boolean` que deshabilita `elementMove`, oculta handles, oculta selection toolbar, no monta HaloEstado | entrada clara para el modo |
| `app/src/ui/InspectorEntidad.tsx` y `InspectorEnlace.tsx` | prop `readonly?: boolean` que deshabilita inputs, oculta botones de acción | read-only del inspector |
| `app/src/store/runtimeEffects.ts` | nuevo effect `wireMobileReadonlySync()` que escucha cambios del OPD activo y emite a un canal de deep link | habilita "Continuar en escritorio" |
| `app/src/persistencia/syncApi.ts` | agregar `getLastSyncAt(modeloId): Promise<Date \| null>` para mostrar timestamp en Acerca | honestidad temporal |

### 3.4 Archivos no tocados

- Toda la capa `app/src/modelo/`, `app/src/serializacion/`, `app/src/render/jointjs/composers/`: la geometría CANON-V2 y la lógica de presentación son agnósticas al modo.
- `app/src/ui/commandPalette/`: se reusa el motor fuzzy (`commandPaletteViewModel`) dentro de `VistaBusqueda`, sin duplicar lógica.
- `app/src/ui/codex/`: tokens de color, tipografía y motion se extienden; nada se rompe.

## 4. Contratos TypeScript

### 4.1 `MobileVistaActiva`

`app/src/ui/mobile/tipos.ts` (nuevo):

```ts
export type MobileVistaActiva = "diagrama" | "opl" | "opds" | "acerca";

export const MOBILE_VISTAS_ORDEN: ReadonlyArray<MobileVistaActiva> = ["diagrama", "opl", "opds", "acerca"];

export interface MobileTabSpec {
  readonly id: MobileVistaActiva;
  readonly etiqueta: string;
  readonly icono: string;
  readonly testId: string;
}

export const MOBILE_TABS: ReadonlyArray<MobileTabSpec> = [
  { id: "diagrama", etiqueta: "Diagrama",  icono: "▦", testId: "mobile-tab-diagrama" },
  { id: "opl",      etiqueta: "OPL",       icono: "¶", testId: "mobile-tab-opl" },
  { id: "opds",     etiqueta: "OPDs",      icono: "⎘", testId: "mobile-tab-opds" },
  { id: "acerca",   etiqueta: "Acerca",    icono: "ℹ", testId: "mobile-tab-acerca" },
];
```

> **Decisión**: `data-testid` de tabs cambia a `mobile-tab-diagrama` (antes `mobile-tab-canvas`). Esto rompe el contrato E2E del audit y del `22-responsive-review.spec.ts`. La sección §10 documenta la migración.

### 4.2 `BottomSheet`

`app/src/ui/mobile/BottomSheet.tsx`:

```ts
export interface BottomSheetProps<T> {
  readonly abierto: boolean;
  readonly contenido: T | null;
  readonly onDismiss: () => void;
  readonly renderHeader: (item: T) => preact.ComponentChildren;
  readonly renderBody:   (item: T) => preact.ComponentChildren;
  readonly testIdPrefix: string;            // p.ej. "bottom-sheet-entidad"
  readonly ariaLabel: string;
  readonly snapPoints?: ReadonlyArray<number>; // heights en vh; default [0.45, 0.85]
}
```

Implementación interna:

```ts
function useDragToDismiss(open: boolean, onDismiss: () => void, threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const delta  = useRef(0);
  const onPointerDown = (e: PointerEvent) => {
    if (e.target instanceof HTMLElement && e.target.dataset.dragHandle === "true") {
      startY.current = e.clientY;
      delta.current = 0;
      ref.current?.setPointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: PointerEvent) => {
    if (startY.current === null) return;
    delta.current = Math.max(0, e.clientY - startY.current);
    if (ref.current) ref.current.style.transform = `translateY(${delta.current}px)`;
  };
  const onPointerUp = () => {
    if (delta.current / (ref.current?.clientHeight ?? 1) > threshold) onDismiss();
    else if (ref.current) ref.current.style.transform = "translateY(0)";
    startY.current = null;
  };
  return { ref, onPointerDown, onPointerMove, onPointerUp };
}
```

### 4.3 `DiagramaLecturaViewModel`

```ts
export interface DiagramaLecturaState {
  readonly opdActivoId: string;
  readonly zoom: number;                    // 0.25 a 4
  readonly panX: number;
  readonly panY: number;
  readonly tapTarget: { kind: "entidad" | "enlace"; id: string } | null;
  readonly esVacio: boolean;                // OPD sin apariencias
}

export interface DiagramaLecturaViewModel {
  readonly state: DiagramaLecturaState;
  readonly opdAnterior: () => void;         // navega al OPD padre
  readonly ajustarZoom: (delta: number) => void;
  readonly ajustarPan: (dx: number, dy: number) => void;
  readonly fit: () => void;                // fitToContent del paper
  readonly handleTapEntidad: (id: string) => void;
  readonly handleTapEnlace: (id: string) => void;
  readonly handleTapVacio: () => void;      // dismiss bottom sheet
}
```

### 4.4 `VistaBusqueda`

```ts
export type BusquedaHitClase = "opd" | "entidad" | "enlace" | "oracion-opl" | "issue";

export interface BusquedaHit {
  readonly clase: BusquedaHitClase;
  readonly id: string;
  readonly titulo: string;
  readonly subtitulo: string;               // p.ej. "objeto · sistémica" o "M1.1 · Admisión"
  readonly deepLink: () => { vista: MobileVistaActiva; opdId?: string; entidadId?: string; };
}

export interface BusquedaLecturaViewModel {
  readonly query: string;
  readonly incluirDiagnostico: boolean;     // toggle en memoria de sesión/store
  readonly hits: ReadonlyArray<BusquedaHit>; // filtrado por incluirDiagnostico
  readonly hitsPorClase: ReadonlyMap<BusquedaHitClase, ReadonlyArray<BusquedaHit>>; // agrupa para render
  readonly setQuery: (q: string) => void;
  readonly toggleIncluirDiagnostico: () => void;
  readonly seleccionar: (hit: BusquedaHit) => void;  // navega y cierra
}
```

**Toggle de sesión**: la preferencia del usuario sobre `incluirDiagnostico` vive en memoria de runtime/store, sin persistencia en navegador. Default: `false`. El toggle aparece en la barra superior de `VistaBusqueda` con etiqueta clara:

> "Buscar también en diagnóstico"  [toggle off]

Cuando `incluirDiagnostico === true`, los hits de clase `"issue"` se renderizan en una **sección colapsable** separada al final de la lista, con badge ámbar y etiqueta "Diagnóstico". Si el toggle está off, esa sección no se monta.

## 5. data-testids (contrato para el audit in-vivo)

Esta lista es el contrato que `app/scripts/in-vivo-exhaustivo.mjs` validará en su próxima corrida.

| data-testid | Padre | Propósito |
|---|---|---|
| `mobile-app-lectura` | `<main>` | raíz del modo lectura (reemplaza `modo-revision-mobile`) |
| `mobile-header-lectura` | header | header completo |
| `mobile-breadcrumb-opd` | header | breadcrumb OPD activo |
| `mobile-breadcrumb-volver` | header | botón `‹` para OPD padre (solo si existe) |
| `mobile-boton-buscar` | header | abre `VistaBusqueda` |
| `mobile-vista-activa` | section | contenedor de vista actual |
| `mobile-vista-diagrama` | section | DiagramaLectura |
| `mobile-vista-opl` | section | OplLectura |
| `mobile-vista-opds` | section | ArbolOpdsLectura |
| `mobile-vista-acerca` | section | AcercaLectura |
| `mobile-nav-lectura` | nav | bottom nav |
| `mobile-tab-diagrama` | nav | tab Diagrama |
| `mobile-tab-opl` | nav | tab OPL |
| `mobile-tab-opds` | nav | tab OPDs |
| `mobile-tab-acerca` | nav | tab Acerca |
| `mobile-canvas-readonly` | div | JointCanvas readonly |
| `mobile-canvas-zoom-indicator` | div | "100%" sobre canvas |
| `mobile-canvas-vacio` | p | "Este OPD no tiene cosas todavía." |
| `mobile-opl-filtros` | div | filtros por tipo de oración |
| `mobile-opl-buscar` | input | búsqueda dentro de OPL |
| `mobile-opl-lista` | ol | oraciones, con `data-oracion-id` |
| `mobile-opl-snippet` | div | snippet en bottom sheet |
| `mobile-arbol-nodo` | button | cada OPD del árbol |
| `mobile-arbol-activo` | button | OPD activo, `data-activo="true"` |
| `mobile-acerca-cta-escritorio` | a | "Continuar en escritorio" |
| `mobile-acerca-url-escritorio` | code | URL profunda copiable |
| `mobile-acerca-sync` | span | "Sincronizado · HH:MM" |
| `mobile-busqueda-vista` | section | VistaBusqueda fullscreen |
| `mobile-busqueda-input` | input | input principal |
| `mobile-busqueda-toggle-diagnostico` | label | toggle "Buscar también en diagnóstico" |
| `mobile-busqueda-toggle-diagnostico-input` | input | checkbox real, `aria-checked` |
| `mobile-busqueda-seccion-opds` | ul | resultados OPDs |
| `mobile-busqueda-seccion-entidades` | ul | resultados entidades |
| `mobile-busqueda-seccion-opl` | ul | resultados oraciones |
| `mobile-busqueda-seccion-issues` | ul | resultados diagnóstico (sólo si toggle on) |
| `mobile-busqueda-hit` | li | cada hit, `data-hit-clase` |
| `mobile-busqueda-badge-issue` | span | badge ámbar visible sólo en hits `clase=issue` |
| `bottom-sheet-entidad` | section | BottomSheetEntidad |
| `bottom-sheet-entidad-header` | header | nombre + tipo |
| `bottom-sheet-entidad-aparece-en` | ul | lista de OPDs |
| `bottom-sheet-enlace` | section | BottomSheetEnlace |
| `bottom-sheet-drag-handle` | div | handle de drag, `data-drag-handle="true"` |

**Migración desde `ModoRevisionMobile`**: los `data-testid` legacy (`mobile-tab-canvas`, `mobile-tab-opds`, `mobile-tab-opl`) se conservan como alias sin render durante 2 sprints para no romper `e2e/22-responsive-review.spec.ts`. `mobile-tab-issues` se **elimina** (decisión §14.1A: el panel de diagnóstico ya no vive en el bottom nav). Alias sólo en DEV; en PROD se eliminan.

## 6. Tokens nuevos en `app/src/ui/tokens.ts`

```ts
export const mobileReadonly = {
  headerHeight: 56,
  bottomNavHeight: 64,
  bottomSheet: {
    radius: 12,
    handleWidth: 36,
    handleHeight: 4,
    background: colors.paper,
    borderTop: stroke.hairline,
  },
  tapTarget: 44,
  bodyTextSize: 17,
  bodyLineHeight: 1.55,
  metaTextSize: 11,
  breadcrumbSize: 13,
  transitionFast: "150ms ease-out",          // tab switch, color hover
  transitionMedium: "200ms ease-out",        // bottom sheet slide
  transitionSheetSpring: "cubic-bezier(0.16, 1, 0.3, 1)",
  paddingSides: 16,
  paddingVias: 12,
  gapStack: 8,
} as const;
```

## 7. CSS additions

`app/src/ui/mobile/mobileReadonly.css` (nuevo, scoped por preact):

```css
/* Reduce todas las tipografías un grado en mobile y aplica line-height editorial. */
@media (max-width: 640px) {
  html { font-size: 17px; }
  body { line-height: 1.55; }
}

/* Bottom sheet: drag-to-dismiss con handle explícito. */
.mobile-bottom-sheet {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: var(--paper);
  border-top: 1px solid var(--ink-15);
  border-radius: 12px 12px 0 0;
  z-index: 100;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
  touch-action: none;
  padding-bottom: env(safe-area-inset-bottom, 0);
}
.mobile-bottom-sheet__handle {
  width: 36px; height: 4px;
  margin: 8px auto;
  background: var(--ink-30);
  border-radius: 2px;
  cursor: grab;
}

/* JointCanvas readonly: deshabilita cursor de drag sobre las cosas, mantiene pan. */
.mobile-canvas-readonly .joint-element { cursor: pointer; }
.mobile-canvas-readonly .joint-element [data-tool="resize"],
.mobile-canvas-readonly .joint-element .joint-handle { display: none; }

/* Tab nav: hairline superior + tab activa con underline crimson (mismo patrón Codex). */
.mobile-nav-lectura button[aria-selected="true"] {
  border-top: 1px solid var(--accent);
  color: var(--ink);
}
```

## 8. Gestures y accesibilidad

| Aspecto | Especificación |
|---|---|
| Pan canvas | 1 dedo arrastrando el paper vacío. NO arrastra las cosas. |
| Zoom canvas | 2 dedos (pinch). Indicador de zoom 1.5s post-gesto. |
| Doble tap cosa | Abre bottom sheet de la entidad. |
| Tap enlace | Abre bottom sheet del enlace. |
| Tap vacío | Cierra bottom sheet. |
| Drag-down en bottom sheet | Threshold 25% del alto del sheet; al cruzar, dismiss. |
| Keyboard externo | `⌘K` abre `VistaBusqueda`; `Esc` cierra bottom sheet/búsqueda. |
| Screen reader | `<header role="banner">`, `<nav role="navigation" aria-label="Vistas">`, `<main role="main" aria-live="polite">`. Bottom sheet usa `role="dialog" aria-modal="true"`. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` desactiva `transitionSheetSpring`; usa `transitionFast` en su lugar. |
| Tap target | Mínimo 44×44 px en todo lo interactivo (bottom nav, breadcrumb, botones de bottom sheet). |
| Focus visible | `outline: 2px solid var(--focus)` con `outline-offset: 2px` en cualquier elemento focusable. |

## 9. Máquina de estados (vista)

```
                 ┌──────────────┐
                 │  cold-start  │
                 └──────┬───────┘
                        │ modelo cargado
                        ▼
        ┌─────────── Diagrama ◄────────────┐
        │       (default al cargar)         │
        │ tap cosa → BottomSheetEntidad    │
        │ tap enlace → BottomSheetEnlace   │
        │ tap nav → cambia vista            │
        │                                  │
        ├──► OPL                            │
        │   tap oración → Diagrama + bottom │
        │   filtro tipo                     │
        │                                  │
        ├──► OPDs                           │
        │   tap OPD → Diagrama (cambia OPD) │
        │   expand/colapsa nodo             │
        │                                  │
        └──► Acerca                         │
            tap CTA → window.open(url, '_system')
            copy URL

Búsqueda (modal fullscreen, no es vista):
 任何 vista ──tap lupa──► Búsqueda ──tap hit──► (vista + OPD + bottom sheet)
                              ──Esc/← ──────────► vista previa
```

## 10. Migración y rollout

### 10.1 Fase 0 — Shims (1 día)

`app/src/ui/ModoRevisionMobile.tsx` se reemplaza por un componente que monta `<BottomNavMobileLectura />` con **los mismos 3 `data-testid` legacy** (`mobile-tab-canvas`, `mobile-tab-opds`, `mobile-tab-opl`). Esto evita romper `e2e/22-responsive-review.spec.ts` y el `app/scripts/in-vivo-exhaustivo.mjs` actual. El test E2E que esperaba `mobile-tab-issues` se ajusta en este mismo commit (decisión §14.1A: el panel de diagnóstico se elimina del bottom nav). Los IDs nuevos se introducen en paralelo como `mobile-tab-diagrama` etc.

### 10.2 Fase 0.5 — Deploy config + router (0.5 día)

**Deploy config**: agregar rewrite rule en el hosting para que cualquier path caiga en `index.html`:

- **Vercel**: ya tiene fallback automático a `index.html` para SPAs. Verificar `vercel.json` o config del proyecto. Si no existe, agregar 1 línea: `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`.
- **Nginx** (si self-hosted): `try_files $uri /index.html;` en el bloque `location /`.
- **Cloudflare Pages**: `_redirects` con `/* /index.html 200`.

**Router mínimo en la app**: como deep-opm-pro no usa router, se agrega un módulo `app/src/ui/mobile/routerMovil.ts` (~80 LOC) que:
- Lee `window.location.pathname` en mount.
- Detecta patrón `/m/:modeloId/opd/:opdId/vista/:vista` (todos los segmentos opcionales).
- Si no matchea, redirige a `/` (workspace normal).
- Si matchea, setea estado inicial de `headerLecturaViewModel` con OPD y vista.
- Expone un método `actualizarUrl(state)` que usa `history.pushState` (sin recargar) cuando el usuario navega dentro de la app, manteniendo la URL sincronizada.

**Comportamiento en desktop**: si la URL es `/m/<id>` y el dispositivo NO es mobile, la app ignora el path y carga el workspace normal. El receptor del link no ve error; simplemente abre en desktop. (Decisión explícita: NO redirigir a `/` para evitar loop de redirect.)

### 10.3 Fase 1 — Composición condicional (2 días)

`app/src/ui/App.tsx`:

```tsx
if (contextoWorkbench.device === "mobile") {
  return <MobileReadonlyApp contexto={contextoWorkbench} />;
}
// resto del chrome desktop/tablet
```

`MobileReadonlyApp` se construye desde los archivos nuevos. El `ModoRevisionMobile.tsx` legacy se elimina (ya nadie lo importa).

### 10.4 Fase 2 — Deep link (1 día)

URL contract:

```
https://opforja.sanixai.com/m/<modeloId>/opd/<opdId>/vista/<diagrama|opl|opds|acerca>
```

Todos los segmentos son **opcionales**. Formas válidas:
- `/m/hodom-v1-6` → modelo HODOM, OPD raíz, vista diagrama.
- `/m/hodom-v1-6/opd/admision` → OPD específico, vista diagrama.
- `/m/hodom-v1-6/vista/opl` → OPL del OPD raíz.
- `/m/hodom-v1-6/opd/admision/vista/acerca` → metadata del OPD.

`app/src/ui/mobile/routerMovil.ts` parsea el path en mount, setea OPD activo y vista. `AcercaLectura` muestra esta URL como copy-paste. Cuando el usuario navega dentro de la app, `actualizarUrl(state)` mantiene la barra de dirección sincronizada vía `history.pushState`.

### 10.5 Fase 3 — Auditoría extendida (1 día)

Extender `app/scripts/in-vivo-exhaustivo.mjs` con bloque "11. Mobile Solo-Lectura" que valida los 30 data-testids nuevos, gesture, deep link, Acerca, búsqueda (incluyendo toggle diagnóstico on/off).

### 10.6 Kill switch

`app/src/ui/App.tsx` envuelve la rama mobile en:

```tsx
if (contextoWorkbench.device === "mobile" && import.meta.env.VITE_MOBILE_READONLY === "true") {
  return <MobileReadonlyApp contexto={contextoWorkbench} />;
}
// fallback al chrome actual
```

Por default en este sprint, `VITE_MOBILE_READONLY === "false"`. El equipo lo activa cuando esté listo.

## 11. Performance budget

| Métrica | Budget | Cómo se mide |
|---|---|---|
| Time-to-first-diagram | < 1.5 s en cold start | Performance API + flag `data-testid="mobile-vista-diagrama"` |
| Heap mobile | < 60 MB | DevTools mobile profile |
| FPS pan/zoom | 60 fps en iPhone SE (2020) | PerformanceObserver en `requestAnimationFrame` |
| Búsqueda fuzzy | < 50 ms sobre 36 OPDs / 261 entidades | `performance.now()` wrap en `busquedaLecturaViewModel` |
| Bottom sheet open | < 100 ms desde tap hasta visible | igual |
| Sync fetch | < 800 ms en Acerca | `fetch + AbortController` con timeout |

Si la métrica excede budget, el bloque se reporta como **WARN** en el audit, no **FAIL**, para no bloquear release.

## 12. Verificación

### 12.1 Unit tests (nuevos)

- `app/src/ui/mobile/mobileReadonly.test.tsx` cubre composición, navegación entre vistas, deep link parse, búsqueda vacía, bottom sheet open/close/dismiss.
- `app/src/app/viewmodels/diagramaLecturaViewModel.test.ts` cubre pan/zoom bounds, tap detection, fit-to-content.
- `app/src/app/viewmodels/oplLecturaViewModel.test.ts` cubre filtrado, búsqueda interna, snippets.
- `app/src/app/viewmodels/busquedaLecturaViewModel.test.ts` cubre fuzzy, secciones (4 con toggle on, 3 con toggle off), deep link generation, persistencia del toggle.
- `app/src/app/viewmodels/bottomSheetViewModel.test.ts` cubre drag threshold, dismiss, history.

### 12.2 E2E (extender)

`app/e2e/22-responsive-review.spec.ts`:

- Mantener tests legacy con los 3 `data-testid` legacy (`mobile-tab-canvas`, `mobile-tab-opds`, `mobile-tab-opl`) durante la fase 0. **Eliminar** el test que esperaba `mobile-tab-issues` (decisión §14.1A).
- Agregar suite "mobile-readonly" que valida los 30 `data-testid` nuevos, el deep link con path, el bottom sheet, la búsqueda (incluyendo toggle diagnóstico on/off), el CTA "Continuar en escritorio".

### 12.3 Audit in-vivo

`app/scripts/in-vivo-exhaustivo.mjs` agrega bloque 11:

```
[OK] 11. Mobile readonly :: HeaderLectura visible
[OK] 11. Mobile readonly :: DiagramaLectura es vista default
[OK] 11. Mobile readonly :: BottomNavMobileLectura con 4 tabs
[OK] 11. Mobile readonly :: data-context-modo=lectura
[OK] 11. Mobile readonly :: Tap entidad abre bottom sheet
[OK] 11. Mobile readonly :: Drag-down dismisses bottom sheet
[OK] 11. Mobile readonly :: Deep link /m/X/opd/Y/vista/Z navega
[OK] 11. Mobile readonly :: Búsqueda fuzzy devuelve hits en 4 secciones (con toggle on)
[OK] 11. Mobile readonly :: Búsqueda fuzzy NO incluye issues con toggle off
[OK] 11. Mobile readonly :: Toggle de diagnóstico persiste durante la sesión
[OK] 11. Mobile readonly :: Acerca muestra CTA "Continuar en escritorio"
[OK] 11. Mobile readonly :: No hay toolbar-actions-pesadas montado
[OK] 11. Mobile readonly :: No hay chip-persistencia montado
[OK] 11. Mobile readonly :: Inspector sin inputs editables
```

### 12.4 E2E cross-device

`bun run browser:smoke` debe pasar en viewports 320, 360, 390, 414, 768, 1024, 1440, 1920. El bloque mobile readonly sólo se evalúa en < 640.

## 13. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La rama tablet pierde funcionalidad que sólo existe en mobile-readonly | Aplica lectura también a tablet si el operador lo pide; por ahora lectura = mobile only. |
| JointJS readonly no se respeta (drag de cosas funciona) | El test E2E "JointCanvas no permite drag de elemento" valida contract. |
| Bottom sheet se cierra accidentalmente con scroll | Threshold 25% + pointer capture. |
| Deep link con modeloId inválido rompe estado | Fallback a "Acerca" con mensaje "Modelo no disponible en este dispositivo." |
| Memoria: precargar todos los OPDs para el árbol | Árbol se lazy-loads; sólo OPDs visibles se hidratan. Treeitems máximo 36 en HODOM, pero el patrón aguanta cientos. |
| Búsqueda fuzzy O(n) sobre 261 entidades es lenta | Índice de búsqueda se construye en mount; la query es O(k) sobre el índice. |
| Migración de data-testids rompe audit en producción | Alias DEV-only durante 2 sprints; el audit corre contra los IDs canónicos. |
| **Path `/m/<id>/...` no se parsea correctamente en deep link** | `routerMovil.ts` valida cada segmento contra regex estricta (`^[a-z0-9-]{1,64}$`); modeloId inválido → fallback a `/`. Unit test cubre 12 casos de paths malformados. |
| **Deploy config (rewrite rule) no está aplicada en staging/prod** | Bloqueante para Fase 2: el PR de Fase 0.5 incluye el cambio de config y un smoke test que verifica el rewrite con un path de prueba. Si falla, no se mergea. |
| **Receptor del deep link en desktop no entiende la URL** | Documentado en `AcercaLectura`: si el dispositivo no es mobile, la app ignora el path y carga el workspace normal. NO redirige para evitar loops. |
| **Badge "issue" ámbar se confunde con badge de error en la búsqueda** | Diseño de badge con copy literal: "Diagnóstico" (no "Issue", no "Error"). Solo se renderiza cuando `incluirDiagnostico === true`; default off. Unit test verifica que el badge NO aparece en el render por default. |
| **Estado del toggle `incluirDiagnostico` colisiona con otros features** | Estado namespaced en el store mobile; no usar storage navegador. |

## 14. Decisiones explícitas confirmadas 2026-06-06

1. **El tab "Acerca" reemplaza a "Sugerencias"** (decisión A del operador). El panel de diagnóstico se **elimina del bottom nav mobile**. El autor que quiera ver issues abre el modelo en escritorio. Blast radius: 0 código de diagnóstico, 1 test E2E legacy (`22-responsive-review.spec.ts` esperaba `mobile-tab-issues`) se ajusta en Fase 0.
2. **Deep link con path** (decisión B del operador). URL contract: `/m/<modeloId>/opd/<opdId>/vista/<diagrama|opl|opds|acerca>`. Implica: rewrite rule en deploy config (Fase 0.5), router mínimo `routerMovil.ts` (~80 LOC), comportamiento explícito en desktop (ignora path, no redirige).
3. **Búsqueda con toggle "Buscar también en diagnóstico"** (decisión C del operador). Toggle off por default, retenido sólo durante la sesión. Cuando está on, agrega sección colapsable con badge ámbar "Diagnóstico". El índice de búsqueda crece ~3x; presupuesto de búsqueda sigue < 50ms con índice precomputado.

## 15. Lo que esta spec NO hace

- No refactoriza la capa `app/src/modelo/`, `app/src/serializacion/`, `app/src/render/`. La geometría y la lógica de presentación son agnósticas al modo.
- No introduce AI features. El modo lectura es decididamente no-agentic.
- No migra la persistencia. El backend `__deep-opm` se usa tal cual está; el timestamp en Acerca requiere sólo un endpoint nuevo `getLastSyncAt` en `app/src/persistencia/syncApi.ts`.
- No cambia el chrome desktop. El blast radius es mobile-only.
- No introduce tests visuales (Playwright visual diff). El audit in-vivo con screenshots es suficiente para esta v1.

---

**Total estimado de esfuerzo**: 7-8 días para 1 ingeniero full-time (ajustado al alza por Fase 0.5 deploy+router y toggle de búsqueda). **Blast radius**: 13 archivos nuevos, 9 modificados, 1 reemplazado, +1 cambio de config de deploy (rewrite rule). **Riesgo de regresión**: bajo (mobile no se usaba productivamente hoy; el cambio es net-positive). El kill switch `VITE_MOBILE_READONLY` permite desactivar el chrome nuevo sin redeploy.

**Próximo paso**: abrir 5 issues (uno por hito: Fase 0, 0.5, 1, 2, 3) y empezar por Fase 0 (shims, 1 día) que es cero riesgo.
