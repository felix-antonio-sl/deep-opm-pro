# Linea 2 — Mapa del sistema cierre + fix render

## 1. Mision

Cerrar EPICA-21 (avance 0%, 18 HU pendientes) extendiendo el slice del Mapa del sistema introducido por L5 ronda 6 con: filtros por profundidad/rama, resaltado por tipo, panel de estadisticas, marcadores rojo/verde de OPD activo/visitado, tooltip con metadatos, zoom Ctrl+rueda, persistencia de zoom/pan/filtros, auto-refresh tras cambios del arbol, refrescar bajo demanda mejorado, y export PNG/SVG cliente-side. Resolver el bug de render explicito en `docs/HANDOFF.md §Pendientes Inmediatos` ("scaleContentToFit con >= 2 OPDs proyecta solo el primer thumbnail visible").

**Slice minimo entregable**:

- Fix `scaleContentToFit` en `MapaSistema.tsx` y `mapaSistema.ts`: investigar el flujo paper-1600x1200 + descriptor multi-nivel y completar la proyeccion para que multiples OPDs se visualicen siempre. Cobertura visual >= numero de nodos del descriptor.
- Filtros (`render/jointjs/mapaSistema.ts` extendido): `filtrarPorProfundidad(descriptor, max)`, `filtrarPorSubarbol(descriptor, raizOpdId)`, `resaltarPorTipo(descriptor, criterio)`.
- Panel `app/src/ui/MapaPanelEstadisticas.tsx`: conteos globales (entidades, enlaces, OPDs, profundidad maxima, ramas).
- Panel `app/src/ui/MapaFiltros.tsx`: slider profundidad, selector raiz, dropdown criterio resaltado.
- Helper `app/src/render/jointjs/mapaExport.ts`: `exportarMapaPng`, `exportarMapaSvg` cliente-side via `toBlob()` y `paper.toSVG()`.
- Tooltip al hover sobre thumbnail (HU-21.011).
- Marcadores rojo/verde sobre nodos del meta-grafo (HU-21.005).
- Zoom Ctrl+rueda (HU-21.009) en `MapaSistema.tsx`.
- Persistencia `ui.mapa.{zoom, pan, filtros}` en workspace por modelo (NO en JSON OPM) — sobrevive entre sesiones de un mismo modelo (HU-21.018).
- Auto-refresh: subscripcion a cambios del arbol (`modelo.opds`) que invalida `descriptorMapaCache` y recomputa cuando vista activa (HU-21.016) — toggle activable `mapaAutoRefresh`.
- Boton "Refrescar mapa" en `MapaSistema.tsx` y entrada en `MenuPrincipal.tsx`.

**Fuera de slice**: HU-21.017 export PDF (requiere libreria pdf-lib o html2pdf — bloqueada por EPICA-60); puede entregarse PNG y SVG (cliente-side sin dep nueva), dejando PDF documentado como diferido. HU-50.027 OPL bloques jerarquicos y multi-pestana son territorio L3.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-21.005 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-21-estructura-mapa-sistema.md` | Marcadores rojo/verde como anclas (activo / ultimo visitado). |
| HU-21.009 | idem | Zoom in/out con Ctrl+rueda; rango 25%-200%. |
| HU-21.011 | idem | Tooltip con metadatos al hover. |
| HU-21.012 | idem | Filtros por profundidad o por subarbol. |
| HU-21.013 | idem | Resaltado por tipo de cosa contenida. |
| HU-21.014 | idem | Panel de estadisticas globales. |
| HU-21.016 | idem | Auto-refresh tras cambios del arbol OPD. |
| HU-21.017 | idem | Export PNG/SVG (PDF diferido). |
| HU-21.018 | idem | Persistir zoom/pan/filtros entre sesiones. |
| HU-21.015 | idem (ya parcial) | Refrescar bajo demanda — refuerza con boton mejorado. |
| Fix HANDOFF #1 | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | scaleContentToFit con >= 2 OPDs. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md §3.40 OPD` (jerarquia OPD/SD); el mapa NO es OPD canonico — la convencion neutra de flechas (ronda 6) se preserva. El export es vista derivada; no toca semantica OPM. Estadisticas son lente (no persisten).
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/choose-exported-file-name/choose-exported-file-name.ts` lineas 15-16: `getDefaultModelName()` para nombrar el archivo exportado; patron de modal con campo nombre.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/export-model-as-html-dialog/export-model-as-html.ts` lineas 11-50: `openOpdsSelectionDialog()`, ensamblado de export con metadata. No copiar — usar como esqueleto del modal de export.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/services/dcm/exporters/` patron plug-in de exporters (CMMN, DMN, etc.) — confirma que cliente-side basta para PNG/SVG.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/opd-hierarchy/opdsTreeActions.ts` linea 10: `ToggleOPDsNamesTreeAction` con `init.oplService.settings.SDNames` — patron de persistencia de toggle (zoom/pan/filtros). En L2 ronda 7 vivira en `ui.mapa.*` dentro del indice de workspace.
  - JointJS API: `paper.scaleContentToFit({ padding, minScale, maxScale })` requiere que las celdas existan en `graph` y tengan bbox calculable. El bug de ronda 6 esta en que se llama antes de que `paper` haya renderizado las celdas (`onRender`). Investigar con un microtask `setTimeout(() => paper.scaleContentToFit(...), 0)` o `paper.on("render:done", () => paper.scaleContentToFit(...))`.
  - `paper.toSVG()` retorna SVG inline para HU-21.017; `<canvas>.toBlob("image/png")` desde un SVG renderizado a `<img>` produce PNG.
- **Estado actual del codigo (post-ronda 6)**:
  - `app/src/render/jointjs/mapaSistema.ts` (258 LOC) provee `construirDescriptorMapa(modelo)` y `proyectarMapaSistemaAJointCells(descriptor, paper)` con namespaces registrados (commit `3c393d7`).
  - `app/src/ui/MapaSistema.tsx` (148 LOC) renderiza el meta-grafo con boton Refrescar y Cerrar; ronda 6 dejo cobertura visual incompleta cuando hay >= 2 OPDs por bug de scaleContentToFit (smoke relajado a `>= 1` joint-element).
  - `app/src/store.ts` ya expone `vistaMapaActiva`, `descriptorMapaCache`, `abrirVistaMapa`, `cerrarVistaMapa`, `refrescarVistaMapa`, `saltarAOpdDesdeMapa`. No expone aun: filtros, resaltado, zoom/pan, marcadores, auto-refresh.
  - `app/src/persistencia/workspace.ts` (254 LOC) tiene `WorkspaceIndice` con campos opcionales por modelo (`carpetaId`, `ultimaApertura`, `autosalvado`); aditivo: agregar `mapa: { zoom?, panX?, panY?, filtros? } | undefined` por modelo.
  - `app/src/ui/MenuPrincipal.tsx` (125 LOC) tiene entrada "Mapa del sistema" introducida en L5 ronda 6; aditivo: agregar entrada "Exportar mapa" visible solo cuando `vistaMapaActiva`.

## 4. Archivos permitidos

```text
app/src/render/jointjs/mapaSistema.ts          EDIT aditivo (filtros, resaltado, marcadores, fix scaleContentToFit, auto-refresh hook)
app/src/render/jointjs/mapaSistema.test.ts     EDIT aditivo
app/src/render/jointjs/mapaExport.ts           NUEVO
app/src/render/jointjs/mapaExport.test.ts      NUEVO
app/src/render/jointjs/proyeccion.ts           EDIT aditivo (resaltado por tipo opcional)
app/src/render/jointjs/JointCanvas.tsx         EDIT aditivo (zoom Ctrl+rueda en mapa, refrescar hook)
app/src/ui/MapaSistema.tsx                     EDIT aditivo (zoom, pan persistente, tooltip, marcadores, panels montados)
app/src/ui/MapaPanelEstadisticas.tsx           NUEVO
app/src/ui/MapaFiltros.tsx                     NUEVO
app/src/ui/MenuPrincipal.tsx                   EDIT aditivo ("Exportar mapa como PNG / SVG")
app/src/ui/Toolbar.tsx                         EDIT aditivo (boton "Refrescar mapa" cuando vistaMapaActiva)
app/src/store.ts                               EDIT aditivo (slice mapa al final, agrupado)
app/src/store.test.ts                          EDIT aditivo
app/src/persistencia/workspace.ts              EDIT aditivo (`mapa` por modelo)
app/src/persistencia/local.ts                  LECTURA (workspace persiste por separado)
app/src/serializacion/json.ts                  LECTURA (no toca JSON OPM)
app/e2e/opm-smoke.spec.ts                      EDIT aditivo
opm-extracted/**                               LECTURA
docs/JOYAS.md                                  LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/canvas/seleccionMultiple.ts`, `operacionesBatch.ts`, ni los handlers de seleccion en `JointCanvas.tsx` (territorio L1). Las modificaciones a `JointCanvas.tsx` son **solo en el branch `if (vistaMapaActiva)`** del componente — handlers de zoom y pan dedicados al mapa.
- No tocar `app/src/store/pestanas.ts`, `BarraPestanas.tsx`, `opl/bloquesJerarquicos.ts` ni `PanelOpl.tsx` (territorio L3). El mapa ya suspende OPL (decision ronda 6); no requiere cambios al panel OPL.
- No tocar `app/src/persistencia/movimientoModelos.ts`, `versiones.ts`, los dialogos de busqueda/version/archivo (territorio L4). El campo `mapa` se inserta en `WorkspaceIndice` con default `undefined` — modelos legacy hidratan sin tocar.
- No tocar `app/src/ui/atajosTeclado.ts`, `divisorPanel.tsx`, `MenuContextualArbol.tsx`, `ArbolOpd.tsx` (territorio L5). El zoom Ctrl+rueda del mapa vive como handler local en `MapaSistema.tsx`/`JointCanvas.tsx`; cuando L5 mergea despues, el registry central absorbe estos atajos manteniendo comportamiento.
- No tocar `app/src/modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`, `InspectorEntidad.tsx` (territorio L6).
- No introducir libreria de export (no `html2canvas`, no `jspdf`); usar `paper.toSVG()` + serializacion `<svg>` -> `<img>` -> `<canvas>` -> `toBlob` para PNG.
- No tocar `app/src/modelo/operaciones.ts` ni firmas existentes en `mapaSistema.ts`. Nuevos exports se agregan al final del archivo.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Render

`mapaSistema.ts` (extender `DescriptorMapa` y agregar funciones nuevas):

```ts
export interface DescriptorMapaExtendido extends DescriptorMapa {
  estadisticas: EstadisticasModelo;
}

export interface EstadisticasModelo {
  totalEntidades: number;
  totalEnlaces: number;
  totalOpds: number;
  profundidadMaxima: number;
  totalRamas: number;
  porTipoCosa: { proceso: number; objeto: number; estados: number };
  porFamiliaEnlace: { agregacion: number; etiquetado: number; procedural: number; logico: number };
}

export function calcularEstadisticas(modelo: Modelo): EstadisticasModelo;          // HU-21.014

export function filtrarPorProfundidad(descriptor: DescriptorMapa, maxProfundidad: number): DescriptorMapa;   // HU-21.012
export function filtrarPorSubarbol(descriptor: DescriptorMapa, raizOpdId: Id): DescriptorMapa;               // HU-21.012

export type CriterioResaltado = "predominanciaProceso" | "predominanciaObjeto" | "tieneEstados" | "raiz" | "ninguno";
export function resaltarPorTipo(descriptor: DescriptorMapa, criterio: CriterioResaltado): DescriptorMapa;     // HU-21.013

export function aplicarMarcadores(
  descriptor: DescriptorMapa,
  opdActivoId: Id | null,
  opdUltimoVisitadoId: Id | null,
): DescriptorMapa;                                                                                            // HU-21.005
```

Reglas:
- `filtrarPorProfundidad(d, n)` retorna nuevo descriptor con solo nodos cuya profundidad <= n y aristas cuyos extremos sobreviven.
- `filtrarPorSubarbol(d, raizId)` retorna descriptor con la raiz dada y todos sus descendientes.
- `resaltarPorTipo` agrega `nodo.estiloResaltado: "verde-lima" | "cyan" | "gris" | "azul" | "naranja"` segun criterio. Color de borde:
  - `predominanciaProceso` -> cyan `#3BC3FF` (JOYAS §1).
  - `predominanciaObjeto` -> verde lima `#70E483`.
  - `tieneEstados` -> azul `#3DA8FF`.
  - `raiz` -> naranja `#FF9F43`.
  - `ninguno` -> gris neutro (default mapa neutral).
- `aplicarMarcadores` agrega `nodo.marcadorActivo: boolean`, `nodo.marcadorVisitado: boolean`. UI los renderiza como circulos verde (activo) y rojo (visitado) en esquina.

`mapaExport.ts` (nuevo):

```ts
export type FormatoExport = "png" | "svg";

export interface OpcionesExport {
  formato: FormatoExport;
  nombreArchivo?: string;
  paddingPx?: number;
  fondo?: "blanco" | "transparente";
}

export async function exportarMapa(paper: dia.Paper, modelo: Modelo, opts: OpcionesExport): Promise<Blob>;
export async function descargarMapa(paper: dia.Paper, modelo: Modelo, opts: OpcionesExport): Promise<void>;
```

Implementacion (cliente-side, sin libreria nueva):

- `paper.toSVG()` retorna serializacion del grafo. Wrap con `<svg xmlns="http://www.w3.org/2000/svg">` y dimensiones de `paper.getComputedSize()`.
- Para PNG: crear `<img>` con `src` = data URL del SVG (`URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))`); cuando `img.onload`, dibujar a `<canvas>` y `canvas.toBlob("image/png")`.
- `descargarMapa` invoca `URL.createObjectURL(blob)`, crea `<a download>` y dispara click, libera URL.
- `nombreArchivo` por defecto: `${modelo.nombre || "modelo"}-mapa-${new Date().toISOString().slice(0,10)}.${formato}`.

`proyeccion.ts` (aditivo minimo): expone `aplicarResaltadoNodoMapa(cell, criterio)` que ajusta `body/stroke` y `body/strokeWidth` segun criterio. Llamado desde `mapaSistema.ts`, no desde el flujo normal de canvas.

`JointCanvas.tsx` (aditivo): handlers locales solo cuando `vistaMapaActiva`:
- `paper.on("blank:mousewheel", (evt) => { if (evt.ctrlKey) zoomMapa(evt.deltaY); })` — HU-21.009.
- `paper.on("blank:pointerdown", iniciarPanMapa)` — HU-21.010 ya existia, mantener.
- `paper.on("cell:mouseenter", mostrarTooltip)` — HU-21.011.

### Store

```ts
// Bloque "Mapa" extendido (al final del archivo)
mapaProfundidadMaxima: number | null;          // null = sin limite
mapaSubarbolRaizId: Id | null;                  // null = arbol completo
mapaCriterioResaltado: CriterioResaltado;       // default "ninguno"
mapaZoom: number;                                // 1.0 default; rango 0.25..2.0
mapaPanX: number;
mapaPanY: number;
mapaAutoRefresh: boolean;                        // default true
mapaUltimoVisitadoOpdId: Id | null;
mapaTooltipActivoId: Id | null;

fijarMapaProfundidad(max: number | null): void;
fijarMapaSubarbol(raizId: Id | null): void;
fijarMapaCriterioResaltado(criterio: CriterioResaltado): void;
fijarMapaZoom(zoom: number): void;
fijarMapaPan(x: number, y: number): void;
toggleMapaAutoRefresh(): void;
exportarMapaActual(formato: FormatoExport): Promise<void>;

// Selectores derivados
descriptorMapaFiltrado: () => DescriptorMapa;    // construye, aplica filtros + resaltado + marcadores
estadisticasModelo: () => EstadisticasModelo;
```

`refrescarVistaMapa()` ahora invalida cache y recomputa con filtros vigentes. Cuando `mapaAutoRefresh && vistaMapaActiva && cambia modelo.opds`, se invoca `refrescarVistaMapa()` automaticamente (suscripcion en `useMapaSistemaSync` hook).

`saltarAOpdDesdeMapa(opdId)` asigna `mapaUltimoVisitadoOpdId = opdActivoIdAnterior` antes de cambiar OPD activo, para que al reabrir mapa se vea marcador rojo en el OPD desde el cual venimos.

### Persistencia

`workspace.ts` (aditivo):

```ts
export interface WorkspaceIndice {
  // ... campos existentes
  modelos: ResumenModeloPersistido[];
  carpetas: CarpetaIndice[];
}

export interface ResumenModeloPersistido {
  // ... campos existentes (id, nombre, carpetaId, ultimaApertura, autosalvado)
  mapa?: {
    zoom?: number;
    panX?: number;
    panY?: number;
    profundidadMaxima?: number | null;
    subarbolRaizId?: Id | null;
    criterioResaltado?: CriterioResaltado;
    autoRefresh?: boolean;
  };
}
```

Hidratacion tolerante: ausentes -> defaults (`zoom: 1`, `pan: 0,0`, `autoRefresh: true`, `criterio: "ninguno"`, `profundidad: null`, `subarbol: null`).

Persistencia: cuando el usuario cambia zoom/pan/filtros y vista mapa esta activa, `WorkspaceIndice.modelos[i].mapa` se actualiza con `actualizarIndiceModelo({ id, mapa: nuevoMapa })`. **No persiste en JSON OPM** — es metadata de UI por usuario, vive en el indice de workspace.

### UX

`MapaPanelEstadisticas.tsx` (nuevo):

- Panel lateral derecho cuando `vistaMapaActiva && mapaPanelEstadisticasAbierto`.
- Render de `EstadisticasModelo` con tabla:
  - Total entidades / Total enlaces / Total OPDs.
  - Profundidad maxima.
  - Total ramas (OPDs hoja).
  - Por tipo cosa: procesos / objetos / estados.
  - Por familia enlace: agregacion / etiquetado / procedural / logico.
- Boton cerrar.
- Toggle "Mostrar estadisticas" en `Toolbar.tsx`.

`MapaFiltros.tsx` (nuevo):

- Panel lateral izquierdo cuando `vistaMapaActiva && mapaPanelFiltrosAbierto`.
- Slider profundidad: rango 1..max(profundidadMaxima); etiqueta "Sin limite" cuando null.
- Selector subarbol raiz: dropdown con todos los OPDs (incluyendo SD); seleccion vacia = arbol completo.
- Dropdown criterio resaltado: "Sin resaltado", "Predominancia procesos", "Predominancia objetos", "Tiene estados", "Raiz".
- Boton "Limpiar filtros" resetea los tres a defaults.

`MapaSistema.tsx` (extender):

- Layout: panel filtros izquierda, canvas mapa centro, panel estadisticas derecha (toggleables).
- Toolbar interno con: Refrescar, Auto-refresh toggle, Profundidad-/+, Resaltado dropdown, Exportar (PNG/SVG), Cerrar.
- Tooltip al hover sobre nodo: posicionado cerca del cursor con `nombre`, `tipo (descompuesto/desplegado/raiz)`, `entidades: N`, `enlaces: M`, `profundidad: D`. CSS overlay sobre el paper.
- Marcadores: circulo verde 8 px en esquina superior izquierda del thumbnail si `nodo.marcadorActivo`; circulo rojo en esquina superior derecha si `nodo.marcadorVisitado`.
- Zoom: Ctrl+rueda dentro del paper invoca `fijarMapaZoom(zoom + delta * 0.05)` clampeado [0.25, 2.0]. Indicador "%" arriba a la derecha.
- Pan persistente: al panear con click+drag, actualizar `mapaPanX/Y`. Al cerrar y reabrir mapa del mismo modelo, restaurar zoom/pan.
- Doble clic en thumbnail (HU-21.008) sigue funcionando; setea `mapaUltimoVisitadoOpdId = opdActivoIdAnterior` y dispara `saltarAOpdDesdeMapa`.

`MenuPrincipal.tsx` (aditivo): cuando `vistaMapaActiva`, mostrar entradas extra:
- "Exportar mapa como PNG"
- "Exportar mapa como SVG"
- "Estadisticas del modelo"

`Toolbar.tsx` (aditivo): boton "Refrescar mapa" con icono y data-testid `refrescar-mapa`; toggle "Auto-refresh" con estado del store.

### Fix render scaleContentToFit

Diagnostico esperado: `scaleContentToFit` se invoca en el primer render del paper, antes de que JointJS haya posicionado las celdas. La solucion canonica es:

```ts
useEffect(() => {
  if (!paperRef.current || !descriptor) return;
  const paper = paperRef.current;
  paper.model.fromJSON({}); // limpia
  proyectarMapaSistemaAJointCells(descriptor, paper);
  // Esperar a que el render JointJS termine antes de scalear:
  queueMicrotask(() => {
    paper.scaleContentToFit({ padding: 40, minScale: 0.25, maxScale: 2.0 });
    if (mapaZoom !== 1 || mapaPanX !== 0 || mapaPanY !== 0) {
      paper.scale(mapaZoom);
      paper.translate(mapaPanX, mapaPanY);
    }
  });
}, [descriptor]);
```

Smoke debe asertar que cuando hay >= 2 OPDs, hay >= 2 cells visibles (`paper.findViewsInArea(...).length >= 2`). Test unit en `mapaSistema.test.ts`: `proyectarMapaSistemaAJointCells` con descriptor de 3 nodos crea 3 cells `standard.Rectangle` y 2 cells `standard.Link` en el grafo.

### Cross-capa

- `App.tsx` monta `MapaSistema` con paneles `MapaPanelEstadisticas` y `MapaFiltros` cuando `vistaMapaActiva`.
- Cuando el usuario sale de la vista mapa, el zoom/pan/filtros vigentes se persisten al indice de workspace.
- Auto-refresh: hook `useMapaSistemaSync` se suscribe a `modelo.opds` y `modelo.entidades` (via `subscribeKey` de Zustand) y llama `refrescarVistaMapa()` con debounce 300 ms si `mapaAutoRefresh && vistaMapaActiva`.
- Al exportar PNG/SVG, no incluir paneles laterales — solo el canvas con descriptor + marcadores + resaltado actuales.

## 7. Tests obligatorios

- Unit `mapaSistema.test.ts` (existente, extender):
  - `calcularEstadisticas` con modelo demo: totalEntidades, enlaces, OPDs, profundidad, ramas correctos.
  - `filtrarPorProfundidad(d, 1)` con descriptor 3 niveles deja solo raiz (SD); `(d, 2)` deja raiz + nivel 2; `(d, null)` retorna identico.
  - `filtrarPorSubarbol(d, "SD2")` retorna SD2 y descendientes; raiz es SD2.
  - `resaltarPorTipo(d, "predominanciaProceso")` aplica `estiloResaltado: "cyan"` a nodos donde `procesos > objetos`.
  - `aplicarMarcadores(d, opdId, prevId)` setea `marcadorActivo` y `marcadorVisitado` correctamente.
  - `proyectarMapaSistemaAJointCells` con descriptor de 3 nodos crea 3 cells `standard.Rectangle` y 2 cells `standard.Link` en el grafo (cobertura del fix).
- Unit `mapaExport.test.ts`:
  - `exportarMapa(paper, modelo, { formato: "svg" })` retorna Blob con `type: "image/svg+xml"` y contenido que incluye `<svg`.
  - `exportarMapa(paper, modelo, { formato: "png" })` retorna Blob con `type: "image/png"` (mock canvas si bun no soporta `<canvas>` — usar happy-dom).
  - `descargarMapa` no rechaza con paper vacio.
- Store: `fijarMapaProfundidad(2)` -> `descriptorMapaFiltrado()` retorna descriptor con max profundidad 2.
- Store: `fijarMapaZoom(0.5)` clampea correctamente; valores fuera de rango se ajustan.
- Store: `toggleMapaAutoRefresh()` alterna; al cambiar `modelo.opds` con auto-refresh activo, `refrescarVistaMapa` se invoca (mock spy).
- Store: `saltarAOpdDesdeMapa(opdId)` setea `mapaUltimoVisitadoOpdId = opdActivoIdAnterior`.
- Persistencia: guardar modelo con zoom 0.5, pan (100, 100), profundidad 2; recargar -> store recupera esos valores en el slice mapa cuando se abre vista mapa.
- Component/UI: panel filtros con slider profundidad cambia el zoom visual; panel estadisticas muestra conteos correctos; tooltip al hover muestra nombre + conteos; doble clic en thumbnail navega y deja marcador rojo en el ultimo visitado al reabrir mapa.
- Smoke browser: cargar modelo demo con 3 OPDs anidados; abrir Mapa; verificar **>= 3 joint-elements visibles** (la asercion ronda 6 era >=1; ahora se restablece a >= numero de OPDs); abrir filtros, ajustar profundidad a 2, verificar visualizacion reducida; resaltar predominanciaProceso, verificar borde cyan en OPDs procesales; abrir estadisticas, verificar conteos correctos; exportar SVG, verificar descarga; cerrar mapa, reabrir, verificar zoom/pan/filtros restaurados.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Mapa = vista derivada; no toca JSON OPM, no afecta OPL, no genera commits a undo stack.
- Flechas del meta-grafo siguen estilo neutro (gris dasharray "6 3", marker triangular pequeno) — distinto de OPM.
- Marcadores rojo/verde son lente UI; no se persisten — se calculan en runtime desde `opdActivoId` y `mapaUltimoVisitadoOpdId`.
- `mapaAutoRefresh` por default `true`; usuario puede apagar si percibe lag en modelos grandes.
- Filtros + zoom + pan persisten en `WorkspaceIndice.modelos[i].mapa` (no JSON OPM). Modelos sin `mapa` hidratan con defaults.
- Export PNG/SVG cliente-side via `paper.toSVG()` + canvas blob. **PDF queda diferido** (HU-21.017 parcialmente cubierto: PNG y SVG si, PDF no).
- Tooltip aparece tras 500 ms hover (consistente con HU-17.005); cierra al mouseleave.
- Resaltado por tipo es overlay sobre el estilo neutro: cambia `body/stroke` del thumbnail, no el estilo de las flechas.
- Fix scaleContentToFit: usar `queueMicrotask` o `paper.on("render:done")` — no recrear el paper.

## 10. Decisiones que tomas vos (documentar en commit)

- Si zoom Ctrl+rueda usa `paper.scale` o `paper.scaleContentToFit({ minScale: zoom, maxScale: zoom })`. Recomendado: `paper.scale` directo para responsividad inmediata.
- Si paneles filtros/estadisticas se renderizan en columnas fijas o flotantes overlay. Recomendado: columnas (left/right) que comparten alto del canvas mapa para evitar superposicion.
- Si el slider profundidad acepta "Sin limite" como valor especial (ej. n+1 con label "∞") o un toggle separado. Recomendado: toggle separado para claridad.
- Si auto-refresh suscribe a `entidades` y `enlaces` o solo a `opds`. Recomendado: solo `opds` (el mapa es estructural, no necesita refrescar por cambios internos a OPDs).
- Si export PNG fija ancho 1920 px o respeta el ancho actual del paper. Recomendado: ancho del paper (mas fiel) con padding 40 px.
- Si tooltip se renderiza con `<div>` absoluto en `MapaSistema.tsx` o con `joint.linkTools.Tooltip` de JointJS. Recomendado: `<div>` propio para control completo del estilo.
- Como manejar export con resaltado activo: incluirlo en el output o renderizar version "limpia" sin marcadores. Recomendado: incluir resaltado (es WYSIWYG).

## 11. Forma del entregable

Commits sugeridos:

- `fix(render): mapa proyecta todas las cells antes de scaleContentToFit`
- `feat(render): filtros y resaltado por tipo en mapa del sistema`
- `feat(render): panel de estadisticas y marcadores activo/visitado en mapa`
- `feat(render): export cliente side de mapa como png y svg`
- `feat(ui): zoom Ctrl+rueda y persistencia de zoom pan filtros del mapa`
- `feat(store): auto refresh del mapa al cambiar el arbol opd`
- `test(mapa): cubre filtros estadisticas export marcadores y persistencia`

Co-author footer estandar si aplica al implementador externo. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas (HU-21.017 PDF diferido) y bloqueos. Si el bug de scaleContentToFit revela una causa distinta (ej. namespace, paper invalidacion), documentar el diagnostico en commit message; si surge un bug fuera de scope, entregar como patch a `/tmp/`.
