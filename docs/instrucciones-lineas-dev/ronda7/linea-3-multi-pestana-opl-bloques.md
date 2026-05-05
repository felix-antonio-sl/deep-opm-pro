# Linea 3 — Multi-pestana y bloques OPL jerarquicos

## 1. Mision

Cerrar dos pendientes citados explicitamente en `docs/HANDOFF.md §Pendientes Inmediatos`: **EPICA-34 HU-34.002/.003** (boton "+" en pestanas + N modelos abiertos en sesion) y **EPICA-50 HU-50.027** (expandir/colapsar bloques OPL jerarquicos por OPD). Las dos viven juntas porque son ortogonales al canvas y al workspace, y comparten una sensibilidad de cascada: la pestana introduce el concepto de "modelo activo entre N abiertos" y los bloques OPL leen `opd.profundidad` ya derivada en ronda 6 (HU-50.026).

**Slice minimo entregable**:

- Slice nuevo `app/src/store/pestanas.ts` con `pestanasAbiertas: Pestana[]`, `pestanaActivaId: PestanaId`, acciones `abrirPestana`, `cerrarPestana`, `cambiarPestanaActiva`, `duplicarPestana`, `renombrarPestana` (cuando la pestana refleja "Modelo (No guardado)").
- Helper `app/src/opl/bloquesJerarquicos.ts` con `agruparOracionesPorOpd`, `chevronEstadoBloque`, `togglearColapsoBloque`.
- Componente `app/src/ui/BarraPestanas.tsx` con tab list arriba del canvas, boton "+", boton "X" por pestana, drag-reorder via DnD nativo HTML5.
- Extension de `PanelOpl.tsx`: chevrons (▾/▸) por bloque OPD que togglean colapso/expansion del bloque.
- Mantener "Modelo activo" como espejo de `pestanaActiva.modelo`. Las acciones existentes del store (cambiar nombre, agregar entidad, etc.) operan sobre la pestana activa transparente.
- Persistencia: pestanas abiertas son **sesion-only** (no se serializan a JSON OPM ni a workspace). Refresh de pagina restaura SD vacio "Modelo (No guardado)" como ronda 1.

**Fuera de slice**: HU-50.028 AI text (requiere LLM externo); arrastrar pestanas entre ventanas (fuera de scope MVP); colaboracion en pestanas; navegacion historica de undo cross-pestana (cada pestana tiene su propio stack).

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-34.002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Boton "+" en barra de pestanas crea pestana nueva (atajo a HU-34.001). |
| HU-34.003 | idem | N pestanas independientes, cada una con su propio modelo. |
| HU-34.004 | idem (ya parcial) | "Modelo (No guardado)" se mantiene literal hasta el primer save. |
| HU-50.027 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Chevrons por bloque OPL para colapsar/expandir bloques jerarquicos. |

## 3. Anclaje a evidencia

- **SSOT**: `metodologia-opm-es.md §6 nuevo SD` (cada pestana sigue siembra simple o asistente — ya cubierto en ronda 6); `opm-opl-es.md §17 roundtrip` (la indentacion por OPD ya esta en `opl/generar.ts` post-ronda 6 con `opd.profundidad`); el panel OPL es lente derivada — los bloques jerarquicos son agrupacion visual, no semantica.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/tabsService.ts` lineas 5-50: `TabsManager`, `dropTab()` reorder por drag, `replaceContextByTab()` switch modelo, `context.getTabs()`, `context.moveTab()`. Patron canonico para el slice de pestanas.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/pipes/tab-title-pipe.pipe.ts` formato titulos.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/opd-hierarchy/opd-hierarchy.component.ts` lineas 11-45: jerarquia expandible con template recursivo, iconos SVG por estado fold/unfold. Patron para chevron OPL.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/layout/opcloud-chat-component-panel/chat.component.panel.ts` muestra layout con tabs de paneles.
- **Estado actual del codigo (post-ronda 6)**:
  - `app/src/store.ts` (2554 LOC) tiene `modelo: Modelo` como source of truth single-modelo. Esta linea agrega un **slice envolvente**: `pestanasAbiertas: Pestana[]` donde `Pestana` contiene `id`, `etiqueta`, `modeloId | null`, `modelo: Modelo`, `cargadoDesde: "nuevo" | "asistente" | "importado" | "persistido"`, `dirty: boolean`, `historialUndo: HistorialEntrada[]`. La accion `cambiarPestanaActiva(id)` reemplaza `state.modelo` con el de la pestana activa.
  - `app/src/opl/generar.ts` (988 LOC) ya emite oraciones con `opd.profundidad` (post-ronda 6, L2). El panel `PanelOpl.tsx` (435 LOC) las renderiza con indent. Aditivo: agrupar oraciones por OPD y emitir chevrons.
  - `app/src/ui/App.tsx` (108 LOC) renderiza un canvas. Aditivo: introducir `<BarraPestanas />` arriba.
  - `app/src/ui/MenuPrincipal.tsx` (125 LOC) tiene "Nuevo modelo" y "Nuevo modelo por asistente". Aditivo: agregar "Nuevo modelo en pestana" si tiene sentido (revisar Q34.1 — recomendado: "Nuevo modelo" siempre abre pestana nueva tras esta linea).

## 4. Archivos permitidos

```text
app/src/store/pestanas.ts                      NUEVO
app/src/store/pestanas.test.ts                 NUEVO
app/src/store.ts                               EDIT aditivo (slice pestanas, espejado de modelo activo)
app/src/store.test.ts                          EDIT aditivo
app/src/opl/bloquesJerarquicos.ts              NUEVO
app/src/opl/bloquesJerarquicos.test.ts         NUEVO
app/src/opl/generar.ts                         EDIT aditivo (numerar oraciones por OPD, agrupar por bloque)
app/src/opl/generar.test.ts                   EDIT aditivo
app/src/ui/BarraPestanas.tsx                   NUEVO
app/src/ui/PanelOpl.tsx                        EDIT aditivo (chevrons + colapso por bloque)
app/src/ui/App.tsx                             EDIT aditivo (montar BarraPestanas)
app/src/ui/MenuPrincipal.tsx                   EDIT aditivo (entrada "Nuevo modelo en pestana")
app/src/ui/PanelCarpetas.tsx                   EDIT aditivo discreto (item "Abrir en pestana" en menu contextual)
app/src/ui/DialogoCargarModelo.tsx             EDIT aditivo (boton "Abrir en nueva pestana")
app/src/modelo/tipos.ts                        EDIT aditivo (`Pestana`, `PestanaId`, `BloqueOplEstado`)
app/src/persistencia/local.ts                  EDIT aditivo (no autopersistir pestanas; sesion-only) — solo si necesario
app/src/persistencia/local.test.ts             LECTURA (sin cambios — pestanas no se persisten)
app/src/serializacion/json.ts                  EDIT aditivo (assert: no incluir pestanas en JSON OPM)
app/src/serializacion/json.test.ts             EDIT aditivo
app/e2e/opm-smoke.spec.ts                      EDIT aditivo
opm-extracted/**                               LECTURA
docs/JOYAS.md                                  LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/canvas/seleccionMultiple.ts`, `operacionesBatch.ts` (territorio L1). El cambio de pestana vacia la seleccion automaticamente (consistente con vaciar al cambiar OPD); coordinacion via accion `cambiarPestanaActiva` que invoca `vaciarSeleccion()` del bloque L1 si esta presente.
- No tocar `app/src/render/jointjs/mapaSistema.ts`, `mapaExport.ts`, `MapaSistema.tsx`, `MapaPanelEstadisticas.tsx`, `MapaFiltros.tsx` (territorio L2). Vista mapa es por pestana: al cambiar pestana, `vistaMapaActiva` se cierra automaticamente (recomendado).
- No tocar `app/src/persistencia/movimientoModelos.ts`, `versiones.ts`, `DialogoBuscarGlobal.tsx`, `DialogoVersiones.tsx`, `DialogoArchivados.tsx` (territorio L4). El item "Abrir en pestana" en `PanelCarpetas.tsx` es minimo (1 linea de menu); L4 lo respeta cuando reescribe handlers de tile.
- No tocar `app/src/ui/atajosTeclado.ts`, `divisorPanel.tsx`, `MenuContextualArbol.tsx`, `ArbolOpd.tsx`, `CheatsheetAtajos.tsx` (territorio L5). Atajos para pestanas (`Ctrl+T` para nueva pestana, `Ctrl+W` para cerrar, `Ctrl+Tab` para siguiente) **se documentan en commit** pero no se cablean en esta linea — L5 los registra al merge siguiente.
- No tocar `app/src/modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`, `InspectorEntidad.tsx`, `ModalUrlsObjeto.tsx`, `ModalDuracion.tsx` (territorio L6).
- No tocar `app/src/render/jointjs/proyeccion.ts`, `JointCanvas.tsx`. La pestana activa expone `state.modelo` como antes; el canvas no necesita cambios.
- No tocar `app/src/modelo/operaciones.ts`. Las acciones existentes operan sobre `state.modelo` que apunta a la pestana activa.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- No introducir libreria de tabs (no `react-tabs`, no `@radix-ui/react-tabs`); usar componente propio Preact.
- No introducir libreria DnD para reorder de tabs; usar API nativa HTML5 (`draggable`, `ondragstart`, `ondragover`, `ondrop`).

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo):

```ts
export type PestanaId = string;

export type OrigenPestana = "nuevo" | "asistente" | "importado" | "persistido";

export interface Pestana {
  id: PestanaId;
  etiqueta: string;                          // "Modelo (No guardado)" o `modelo.nombre`
  modeloId: Id | null;                       // null hasta primer save (HU-34.004)
  modelo: Modelo;
  cargadoDesde: OrigenPestana;
  dirty: boolean;
  // Stack undo per-pestana (sesion-only)
  historialUndo: HistorialEntrada[];
  cursorUndo: number;
  // Vista mapa per-pestana
  vistaMapaActivaPestana: boolean;
  // Reservado para L1: seleccionados per-pestana
  seleccionadosPestana?: Id[];
}

export interface BloqueOplEstado {
  opdId: Id;
  colapsado: boolean;
}
```

`Pestana.modelo` es propietario (no compartido). Cambios sobre `modelo` solo modifican la pestana cuyo id coincide con `pestanaActivaId`.

### Store

`store/pestanas.ts` (nuevo, aislando logica de pestanas):

```ts
export function crearPestanaNueva(opts?: { etiqueta?: string }): Pestana;
export function crearPestanaDesdeModelo(modelo: Modelo, opts: { modeloId: Id; nombre: string }): Pestana;

export function abrirPestana(estado: EstadoPestanas, pestana: Pestana): EstadoPestanas;
export function cerrarPestana(estado: EstadoPestanas, id: PestanaId, opts?: { forzar?: boolean }): Resultado<EstadoPestanas>;
export function cambiarActiva(estado: EstadoPestanas, id: PestanaId): EstadoPestanas;
export function reordenarPestanas(estado: EstadoPestanas, idsOrdenados: PestanaId[]): EstadoPestanas;
export function actualizarEtiquetaPestana(estado: EstadoPestanas, id: PestanaId, etiqueta: string): EstadoPestanas;

export interface EstadoPestanas {
  pestanas: Pestana[];
  activa: PestanaId;
}
```

Reglas:
- Siempre hay >=1 pestana. `cerrarPestana` con N=1 falla con error explicito ("No se puede cerrar la ultima pestana"); el comportamiento UI es deshabilitar el boton X cuando solo hay 1.
- `cerrarPestana` con `dirty === true` y `forzar !== true` falla con `Resultado.error("Pestana sin guardar")`. UI muestra dialogo de confirmacion antes de invocar con `forzar: true`.
- `cerrarPestana` cuando se cierra la activa: la siguiente pestana a activar es la inmediatamente a la derecha; si no hay, la ultima a la izquierda. Si solo queda una, queda activa.
- `crearPestanaNueva` genera `id = crypto.randomUUID()`, `etiqueta = "Modelo (No guardado)"`, `modeloId = null`, `modelo = crearModeloVacio()`, `cargadoDesde = "nuevo"`.
- `actualizarEtiquetaPestana` se invoca tras primer save manual: `etiqueta = modelo.nombre || "Modelo (No guardado)"`, `modeloId = persistidoId`.

`store.ts` (envoltorio):

```ts
// Slice nuevo (al final, agrupado)
pestanasAbiertas: Pestana[];
pestanaActivaId: PestanaId;

// Selector derivado (ya existente como state.modelo)
get modelo(): Modelo { return pestanasAbiertas.find(p => p.id === pestanaActivaId)!.modelo; }

abrirPestanaNueva(): void;
abrirPestanaConAsistente(): void;          // HU-34.010 ya cableado; ahora abre pestana nueva
abrirPestanaImportandoJson(json: string): void;     // analoga a importar pero en pestana
abrirPestanaConModelo(modeloId: Id): void;          // HU-30.019 ahora puede abrir en pestana
duplicarPestana(id: PestanaId): void;
cerrarPestana(id: PestanaId, opts?: { forzar?: boolean }): void;
cambiarPestanaActiva(id: PestanaId): void;
reordenarPestanas(idsOrdenados: PestanaId[]): void;
```

Inicializacion (sesion-only): si no hay pestanas, crear una pestana inicial vacia. **NO restaurar pestanas desde persistencia** — las pestanas son sesion-only.

Compatibilidad: las acciones existentes (`agregarEntidad`, `eliminarEntidad`, `commitModelo`, etc.) operan sobre `state.pestanasAbiertas[i].modelo` donde `i = indexOf(pestanaActivaId)`. Esto se logra extrayendo un `mutarPestanaActiva(fn)` interno y reescribiendo cada accion para usarlo. Si el blast de migrar todas las acciones es alto, una alternativa es: mantener `state.modelo` como puntero (ref live) a `pestanasAbiertas[activeIdx].modelo`. Recomendado: opcion 2 con sync explicito en `cambiarPestanaActiva` (Zustand soporta `set(state => ({ modelo: state.pestanasAbiertas.find(...).modelo }))`).

`commitModelo` cambia para anidar: empuja al historial de la pestana activa, no a un stack global. Si el blast es bajo, ronda 7 ya hace esto; si es alto, dejarlo como deuda y usar un stack global compartido (sub-optimo pero compatible).

**Criterio de decision**: si tras estimar la migracion se ve que tocar las ~50 acciones del store excede el slice, mantener un stack global compartido entre pestanas y documentarlo como decision en commit. Lo importante es que cada pestana tenga **su propio modelo y sus propias entidades/enlaces/OPDs** — el undo perfecto puede esperar.

### OPL bloques jerarquicos

`opl/bloquesJerarquicos.ts` (nuevo):

```ts
export interface BloqueOpl {
  opdId: Id;
  opdNombre: string;
  profundidad: number;
  oraciones: OracionOpl[];                 // OracionOpl ya existe en generar.ts
}

export function agruparPorOpd(oraciones: OracionOpl[], modelo: Modelo): BloqueOpl[];
export function aplanar(bloques: BloqueOpl[], colapsados: Set<Id>): OracionOpl[];     // si colapsado, omitir oraciones del bloque
```

Reglas:
- `agruparPorOpd` recorre `oraciones` y las agrupa por `oracion.opdId` (campo agregado en ronda 6 L2). Cada grupo se envuelve en `BloqueOpl` con metadata.
- Bloques en orden de aparicion: SD primero, luego descomposiciones segun BFS.
- Bloques anidados se serializan plano con indent dinamico (preservando el comportamiento HU-50.026 de ronda 6).

`opl/generar.ts` (aditivo): agregar `oracion.opdId: Id` al output (probablemente ya existe; verificar). Si no, propagarlo desde el contexto.

### UX

`BarraPestanas.tsx` (nuevo):

```tsx
export function BarraPestanas() {
  const pestanas = useStore(s => s.pestanasAbiertas);
  const activa = useStore(s => s.pestanaActivaId);
  return (
    <div class="barra-pestanas" data-testid="barra-pestanas" role="tablist">
      {pestanas.map(p => (
        <button
          key={p.id}
          role="tab"
          aria-selected={p.id === activa}
          class={`pestana ${p.id === activa ? "activa" : ""} ${p.dirty ? "dirty" : ""}`}
          onClick={() => store.cambiarPestanaActiva(p.id)}
          draggable
          onDragStart={...}
          onDragOver={...}
          onDrop={...}
          data-testid={`pestana-${p.id}`}
        >
          <span class="etiqueta">{p.etiqueta}{p.dirty ? " *" : ""}</span>
          {pestanas.length > 1 && (
            <button
              class="cerrar"
              onClick={(e) => { e.stopPropagation(); cerrarConConfirmacion(p); }}
              aria-label="Cerrar pestana"
              data-testid={`cerrar-pestana-${p.id}`}
            >×</button>
          )}
        </button>
      ))}
      <button
        class="nueva-pestana"
        onClick={() => store.abrirPestanaNueva()}
        aria-label="Nueva pestana"
        data-testid="nueva-pestana-btn"
      >+</button>
    </div>
  );
}
```

`cerrarConConfirmacion(p)` muestra dialogo nativo `confirm("Hay cambios sin guardar. ¿Cerrar pestana?")` cuando `p.dirty`; si confirma, invoca `cerrarPestana(p.id, { forzar: true })`. Si no dirty, cierra directamente.

DnD: `dragstart` setea `dataTransfer.setData("text/pestana-id", p.id)`; `dragover` previene default; `drop` lee el id y reordena.

`PanelOpl.tsx` (aditivo):

- Importar `agruparPorOpd` y `aplanar` de `bloquesJerarquicos.ts`.
- Estado local `bloquesColapsados: Set<Id>` (no en store; per-pestana per-render).
- Renderizar bloques con cabecera clickable `<button>` que muestra chevron `▾` (expandido) o `▸` (colapsado), nombre del OPD y conteo de oraciones (`${nombre} (${oraciones.length})`).
- Click en cabecera togglea colapso del bloque.
- Cuando colapsado, omitir oraciones; mostrar solo cabecera.
- Estilos: cabecera de bloque con peso `font-weight: 600`, indent segun profundidad.
- `data-testid="bloque-opl-${opdId}"` y `data-testid="cabecera-bloque-opl-${opdId}"`.
- Boton "Expandir todo" / "Colapsar todo" en toolbar del panel.

`App.tsx` (aditivo):

- Renderizar `<BarraPestanas />` arriba del canvas, antes de `<MenuPrincipal />` o como hermano superior. Layout: `<div class="layout-app"><BarraPestanas /><div class="cuerpo">{children}</div></div>`.
- Cambio de pestana propaga: `useEffect` que escucha `pestanaActivaId` y limpia seleccion (delegado a L1 cuando este disponible) + cierra vista mapa (delegado a L2 cuando este disponible).

`MenuPrincipal.tsx` (aditivo):

- Item "Nuevo modelo en pestana nueva" (HU-34.001 redirige a esto si la pestana actual no esta vacia).
- Decidir: "Nuevo modelo" siempre abre pestana nueva, o reemplaza pestana actual cuando esta vacia. Recomendado: si `pestanaActiva.cargadoDesde === "nuevo" && !dirty`, reemplaza; si no, abre nueva. Documentar en commit.

`PanelCarpetas.tsx` (aditivo discreto):

- En el menu contextual de cada modelo (clic derecho o boton de tres puntos), agregar item "Abrir en pestana nueva" que invoca `store.abrirPestanaConModelo(modeloId)`.

`DialogoCargarModelo.tsx` (aditivo):

- Boton secundario "Abrir en nueva pestana" junto al "Cargar". Cargar reemplaza pestana actual; "Abrir en nueva pestana" agrega una.

### Cross-capa

- L1 multi-seleccion: cambio de pestana vacia seleccion (consistente con cambio de OPD).
- L2 mapa: vista mapa pertenece a la pestana activa; cambio de pestana cierra vista mapa.
- Persistencia: cuando el usuario guarda una pestana con `pestana.modeloId === null`, se invoca el flujo `Guardar como` existente (ronda 5 L2); al confirmar, `pestana.modeloId = nuevoId`, `pestana.etiqueta = nombre`, `pestana.dirty = false`. Cuando el modelo ya esta persistido, el save es incremental.
- Atajos teclado: `Ctrl+T` (nueva pestana), `Ctrl+W` (cerrar pestana), `Ctrl+Tab` (siguiente), `Ctrl+Shift+Tab` (anterior). Documentar en commit; cablear en L5.
- Refresh de pagina: al recargar la app, `pestanasAbiertas` arranca con una pestana inicial vacia. Las pestanas que tenian `modeloId !== null` se pierden de la vista pero el modelo persiste en workspace y el usuario puede reabrirlo.

## 7. Tests obligatorios

- Unit `store/pestanas.test.ts`:
  - `crearPestanaNueva()` retorna pestana con etiqueta "Modelo (No guardado)", modelo vacio, dirty: false, cargadoDesde: "nuevo".
  - `abrirPestana` agrega y deja la nueva como activa por default.
  - `cerrarPestana` con N=1 retorna error.
  - `cerrarPestana` con dirty=true y forzar=false retorna error; con forzar=true cierra.
  - `cerrarPestana` de la activa con N>=2 activa la siguiente o anterior.
  - `cambiarActiva(id)` cambia el activa. Si id no existe, no-op silente.
  - `reordenarPestanas` con orden invalido (faltante, duplicado) retorna error; con orden valido reordena.
- Unit `bloquesJerarquicos.test.ts`:
  - `agruparPorOpd` con 5 oraciones de 2 OPDs distintos retorna 2 bloques.
  - `aplanar` con 1 bloque colapsado omite sus oraciones.
- Unit `opl/generar.test.ts` (aditivo): cada `OracionOpl` tiene `opdId`.
- Store: `abrirPestanaNueva()` agrega; `cambiarPestanaActiva` cambia `state.modelo` a la pestana correspondiente; modificar entidad en pestana A no afecta pestana B.
- Store: cerrar pestana dirty con `forzar: true` no rompe undo de las otras pestanas.
- Store: serializar `state` (a JSON OPM) NO incluye `pestanasAbiertas`.
- Persistencia: cargar modelo X via `abrirPestanaConModelo(X)` crea pestana con `modeloId: X, etiqueta: nombre, dirty: false, cargadoDesde: "persistido"`.
- Component/UI BarraPestanas: render con 3 pestanas; clic en una cambia activa (resaltado visual); boton "+" agrega; boton X cierra; DnD reordena; pestana dirty muestra `*` y dialogo al cerrar.
- Component/UI PanelOpl: chevrons por bloque; click colapsa; "Expandir todo" expande todos.
- Smoke browser: abrir 3 pestanas, escribir un nombre de cosa en pestana A, cambiar a B, verificar canvas vacio en B; volver a A, verificar cosa visible; cerrar B, verificar 2 pestanas; cerrar A con dirty, dialogo aparece. Colapsar bloque OPL del SD, oraciones desaparecen; expandir, vuelven.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Pestanas son sesion-only: no se persisten en JSON OPM, no se persisten en workspace, no se restauran tras refresh. Modelos abiertos en pestanas siguen viviendo en workspace y se reabren manualmente.
- Cada pestana tiene su propio modelo (no compartido). Cambios en una no afectan otras.
- Etiqueta "Modelo (No guardado)" es literal hasta primer save; tras save = `modelo.nombre`. Dirty marcado con asterisco visible en la pestana.
- Boton X solo visible cuando hay >=2 pestanas. Pestana ultima no se puede cerrar.
- Cerrar pestana dirty pide confirmacion (dialogo nativo `confirm`); confirmar fuerza cierre y descarta cambios.
- Bloques OPL colapsados son estado UI local del panel; no se persisten — cada vez que se abre el panel arrancan todos expandidos.
- DnD de pestanas usa API nativa HTML5; no se introduce libreria.
- Atajos `Ctrl+T/W/Tab` se documentan en commit; el cableado lo hace L5 al merge siguiente.
- Cambio de pestana cierra vista mapa y vacia seleccion (delegado a L2/L1 cuando esten disponibles, o no-op si aun no estan).
- Si la pestana activa esta vacia y no dirty, "Nuevo modelo" la reemplaza; en cualquier otro caso abre pestana nueva.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el stack undo es per-pestana (ideal pero alto blast) o global compartido (low-blast pero confuso). Recomendado: per-pestana via wrapper `commitModelo` que empuja al `historialUndo` de la pestana activa; si el blast es prohibitivo, mantener global y documentarlo.
- Si "Nuevo modelo en pestana" es entrada separada en `MenuPrincipal` o si "Nuevo modelo" automaticamente decide. Recomendado: una sola entrada "Nuevo modelo" con la heuristica anterior.
- Como persistir el orden de pestanas durante la sesion (al cerrar y reabrir una). Recomendado: append al final.
- Si `Ctrl+Tab` cicla en orden de creacion o orden visual (drag-reorder). Recomendado: orden visual.
- Si bloques OPL muestran conteo (`(N oraciones)`) en cabecera. Recomendado: si.
- Si la indentacion de bloques colapsados se preserva o se aplana. Recomendado: preservada para mantener jerarquia visible.

## 11. Forma del entregable

Commits sugeridos:

- `feat(store): introduce slice de pestanas con N modelos abiertos en sesion`
- `feat(ui): barra de pestanas con boton + y cerrar por pestana, drag reorder`
- `feat(opl): bloques jerarquicos por opd en panel opl con chevrons colapso`
- `feat(ui): item abrir en nueva pestana en panel carpetas y dialogo cargar`
- `test(pestanas): cubre apertura cierre cambio activo dirty y bloques opl`

Co-author footer estandar si aplica al implementador externo. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas (especialmente el dilema undo per-pestana vs global), HU parcialmente cubiertas y bloqueos. Si descubris bug fuera de scope al implementar (ej. carga JSON con pestanas multiples), entregar como patch a `/tmp/`.
