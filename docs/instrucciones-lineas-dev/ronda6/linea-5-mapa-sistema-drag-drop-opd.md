# Linea 5 — Mapa del sistema y gestion del arbol OPD

## 1. Mision

Cubrir la dimension de meta-vista y reorganizacion estructural que falto post-ronda 5: introducir el "Mapa del sistema" (vista derivada con thumbnails y flechas padre-hijo del arbol OPD) y un panel de gestion del arbol con renombrado, reordenamiento manual/automatico de hermanos y cut/paste de nodos. Mapa = vista, no modelo: no toca JSON, no afecta OPL, suspende ambos paneles cuando se activa.

**Slice minimo entregable**: helper `app/src/render/jointjs/mapaSistema.ts` que recibe `Modelo` + `opdRaizId` y emite descriptor de meta-grafo (thumbnails con bbox, conexiones); helper `app/src/modelo/opdReorden.ts` con `reordenarHermanos`, `moverNodo`, `validarMovimientoSinCiclo`; componente `app/src/ui/MapaSistema.tsx` con render via JointJS o SVG simple; modal `app/src/ui/GestionArbolOpd.tsx` (Ctrl+D) con vista jerarquica + busqueda + cut/paste; ampliacion de `app/src/ui/ArbolOpd.tsx` con drag manual entre hermanos, sufijos por refinamiento (descompuesto/desplegado), expandir-colapsar todo y renombrado inline; entrada "Mapa del sistema" en `MenuPrincipal.tsx`; serializacion opcional `opd.ordenLocal?`; tests unit + store + smoke.

**Fuera de slice**: HU-21.012-014 (filtros por profundidad, resaltado por tipo, panel de estadisticas); HU-21.016 (auto-refresh tras cambios); HU-21.017 (export PNG/SVG/PDF — bloqueado por EPICA-60/61); HU-21.018 (persistir zoom/pan/filtros entre sesiones); HU-20.009 (atajos teclado Ctrl+arriba/abajo); HU-20.010 (divisor arrastrable); HU-20.011 (menu contextual del arbol mas alla del minimo); HU-20.013 (toggle ocultar nombres). HU-21.005 (marcador rojo/verde) y HU-21.011 (tooltip) pueden quedar como nice-to-have si caben sin riesgo, pero no forman parte del slice obligatorio.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-21.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-21-estructura-mapa-sistema.md` | Activar Mapa del sistema desde menu. |
| HU-21.002 | idem | Entrada Mapa en el arbol OPD. |
| HU-21.003 | idem | Meta-grafo con thumbnails y flechas padre-hijo. |
| HU-21.004 | idem | Flechas con estilo neutro, no enlaces OPM. |
| HU-21.006 | idem | Suspender OPL durante vista Mapa. |
| HU-21.007 | idem | Ocultar OPD Navigator durante Mapa. |
| HU-21.008 | idem | Doble clic en thumbnail navega al OPD real y cierra Mapa. |
| HU-21.010 | idem | Pan con click+drag. |
| HU-21.015 | idem | Refrescar Mapa bajo demanda. |
| HU-20.014 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Renombrar OPD desde el arbol. |
| HU-20.017 | idem | Reordenar hermanos con arrastre manual. |
| HU-20.018 | idem | Reordenar hermanos automatico segun canvas del padre. |
| HU-20.019 | idem | Configurar modo Manual vs Automatico. |
| HU-20.020 | idem | Ctrl+D abre Gestion del Arbol OPD. |
| HU-20.021 | idem | Buscar OPD por nombre o numero en gestion. |
| HU-20.022 | idem | Cut/paste de nodos en gestion. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` define jerarquia OPD (`SD`, `SDn`, `SDn.m`); `metodologia-opm-es.md` §7/§7b refinamiento; `opm-visual-es.md` deja libre la vista derivada del mapa (no es OPD canonico, por eso la convencion neutra de flechas); `opm-iso-19450-es.md` glosario 3.40 (OPD).
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/opd-hierarchy/system-map.component.ts` (o equivalente), `src/app/opd-hierarchy/opdsTreeActions.ts` (`MoveOpdTreeAction`, `RenameOpdTreeAction`, `ToggleOPDsNamesTreeAction`), `src/app/rappid-components/services/tree-view.service.ts` (`remove`, `move`).
  - `opm-extracted/INDEX.md` mapea `SystemMapComponent`, `OpdHierarchyComponent`, `OpdTreeActions`.
  - `assets/svg/folder.svg`, `assets/svg/regFile.svg`, `assets/svg/delete.svg` son canonicos para iconos de arbol.
  - `docs/JOYAS.md` no fija el estilo del meta-grafo; queda libre dentro de la convencion "no parecer enlace OPM" (HU-21.004).
- **Estado actual del codigo (post-ronda 5)**:
  - `app/src/ui/ArbolOpd.tsx` ya construye el arbol con `padreId`, navega con click y expone eliminacion (de L3 ronda 5). Falta drag manual, expandir/colapsar todo, sufijos por refinamiento y renombrado inline.
  - `app/src/modelo/opdEliminacion.ts` ya muestra el patron de helper de dominio para arbol; `opdReorden.ts` sigue la misma forma.
  - `app/src/render/jointjs/proyeccion.ts` ya conoce los OPDs y entidades; el modo mapa puede generar descriptores y delegar render a un sub-componente.
  - `app/src/store.ts` tiene `opdActivoId`. Modo mapa = un valor sentinel (`opdActivoId: "MAPA"`) o un flag separado (`vistaMapaActiva: boolean`); preferir flag separado para no contaminar el id.

## 4. Archivos permitidos

```text
app/src/modelo/opdReorden.ts                 NUEVO
app/src/modelo/opdReorden.test.ts            NUEVO
app/src/render/jointjs/mapaSistema.ts        NUEVO
app/src/render/jointjs/mapaSistema.test.ts   NUEVO
app/src/render/jointjs/proyeccion.ts         EDIT aditivo (modo mapa derivado)
app/src/render/jointjs/proyeccion.test.ts    EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx       EDIT aditivo (cuando vista mapa esta activa, switch al meta-grafo)
app/src/ui/MapaSistema.tsx                   NUEVO
app/src/ui/GestionArbolOpd.tsx               NUEVO
app/src/ui/ArbolOpd.tsx                      EDIT aditivo (drag, sufijos, renombrado, expandir todo)
app/src/ui/MenuPrincipal.tsx                 EDIT aditivo (entrada Mapa del sistema)
app/src/ui/PanelOpl.tsx                      EDIT aditivo minimo (placeholder "vista mapa: opl no disponible") via prop o store
app/src/ui/App.tsx                           EDIT aditivo (montar GestionArbolOpd, switch canvas vs mapa)
app/src/store.ts                             EDIT aditivo
app/src/store.test.ts                        EDIT aditivo
app/src/modelo/tipos.ts                      EDIT aditivo opcional (`opd.ordenLocal?`)
app/src/serializacion/json.ts                EDIT aditivo (`opd.ordenLocal?`)
app/src/serializacion/json.test.ts           EDIT aditivo
app/e2e/opm-smoke.spec.ts                    EDIT aditivo
assets/svg/folder.svg                        LECTURA canonica
assets/svg/regFile.svg                       LECTURA canonica
assets/svg/delete.svg                        LECTURA canonica
opm-extracted/**                             LECTURA
docs/JOYAS.md                                LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `MapaSistema` exterior (no existe — esta linea lo crea); no tocar dialogos de archivo (L4) ni `AsistenteNuevoModelo.tsx` (L3).
- No tocar `app/src/opl/` excepto via `PanelOpl.tsx` y solo para insertar placeholder cuando vista mapa esta activa; el placeholder se controla por estado del store ("vistaMapaActiva"), no por edicion del generador.
- No tocar `InspectorEnlace.tsx`, `InspectorEntidad.tsx`, `StyleControls.tsx` ni `TablaEnlaces.tsx` (L6), `Toolbar.tsx`, ni el detector.
- No introducir libreria DnD nueva; usar API nativa de HTML5 drag-and-drop (`draggable`, `ondragstart`, `ondragover`, `ondrop`) o JointJS para el meta-grafo si reusas el motor existente.
- No alterar la firma publica de `proyeccion.ts`; agregar un parametro opcional para el modo mapa o una funcion paralela `proyectarMapaSistema` que se invoca en lugar de la normal cuando `vistaMapaActiva`.
- `opd.ordenLocal` es metadata opcional con normalizacion conservadora; modelos legacy sin orden se ordenan por id alfabetico (mismo comportamiento actual).
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo opcional):

```ts
export interface Opd {
  // ... campos existentes
  ordenLocal?: number;     // opcional, monotono entre hermanos
}
```

`opdReorden.ts`:

```ts
export function listarHermanos(modelo: Modelo, opdId: Id): Id[];
export function reordenarHermanos(modelo: Modelo, padreId: Id | null, ordenNuevo: Id[]): Resultado<Modelo>;
export function moverNodo(modelo: Modelo, opdId: Id, nuevoPadreId: Id | null, posicion?: number): Resultado<Modelo>;
export function validarMovimientoSinCiclo(modelo: Modelo, opdId: Id, nuevoPadreId: Id | null): Resultado<void>;
export function ordenSegunCanvasPadre(modelo: Modelo, padreId: Id): Resultado<Id[]>;     // HU-20.018: orden por apariencia.y de subprocesos
```

Reglas:
- `moverNodo` rechaza si `nuevoPadreId` es descendiente de `opdId` (ciclo).
- `moverNodo` rechaza mover el SD raiz.
- `reordenarHermanos` valida que `ordenNuevo` contenga exactamente los mismos ids que `listarHermanos(padreId)`.
- `ordenSegunCanvasPadre` lee las apariencias de los subprocesos en el OPD padre y ordena por `y` ascendente.

### Render

`mapaSistema.ts`:

```ts
export interface NodoMapa {
  opdId: Id;
  nombre: string;
  tipoRefinamiento: "descompuesto" | "desplegado" | "raiz";
  bbox: { x: number; y: number; w: number; h: number };
  thumbnailEntidades: number;     // contador para tooltip
  thumbnailEnlaces: number;
}

export interface AristaMapa {
  desdeOpdId: Id;
  haciaOpdId: Id;
}

export interface DescriptorMapa {
  nodos: NodoMapa[];
  aristas: AristaMapa[];
  bboxTotal: { w: number; h: number };
}

export function construirDescriptorMapa(modelo: Modelo): DescriptorMapa;
```

Layout: arbol vertical o radial determinista; cada nivel separado verticalmente, hermanos horizontalmente; thumbnails maximo 200x150 px (HU-21.003).

`proyeccion.ts` (aditivo): si `vistaMapaActiva`, usar `proyectarMapaSistema` en lugar de proyeccion normal; el resultado es un `joint.dia.Graph` con celdas `Element` para thumbnails (con miniatura SVG opcional o solo nombre+contadores) y `Link` con estilo neutro (gris, linea simple, marker triangular pequeno) — distinto del wrapper+line de OPM (HU-21.004).

`JointCanvas.tsx` (aditivo): cuando `vistaMapaActiva`, montar el grafo del mapa en lugar del normal; doble clic en thumbnail dispara `saltarAOpdDesdeMapa(opdId)` que cierra mapa y navega.

### Store

```ts
// Vista mapa
vistaMapaActiva: boolean;
abrirVistaMapa(): void;
cerrarVistaMapa(): void;
refrescarVistaMapa(): void;       // recomputa descriptor
saltarAOpdDesdeMapa(opdId: Id): void;

// Reordenamiento del arbol
modoOrdenArbol: "manual" | "automatico";
fijarModoOrdenArbol(modo: "manual" | "automatico"): void;
moverHermano(padreId: Id | null, opdId: Id, posicion: number): void;
moverOpdEnGestion(opdId: Id, nuevoPadreId: Id | null, posicion: number): void;

// Gestion arbol
gestionArbolAbierta: boolean;
abrirGestionArbol(): void;       // atajo Ctrl+D
cerrarGestionArbol(): void;
busquedaOpdGestion: string;
fijarBusquedaOpdGestion(q: string): void;

// Renombrado OPD desde arbol
renombrarOpdDesdeArbol(opdId: Id, nombre: string): void;
```

`refrescarVistaMapa` se invoca al abrir mapa y bajo demanda con boton "Refrescar" (HU-21.015).

### Serializacion

`json.ts` (aditivo): `opd.ordenLocal?` opcional; default `undefined`. Hidratacion conservadora: si presente y numero, conservar; si ausente, fallback a orden alfabetico por id.

### UX

`MapaSistema.tsx`:

- Componente que ocupa el slot del canvas cuando `vistaMapaActiva === true`.
- Renderiza el descriptor de meta-grafo via JointJS (preferido para reusar pan/zoom) o SVG.
- Doble clic en thumbnail invoca `saltarAOpdDesdeMapa`.
- Pan con click+drag (HU-21.010); zoom Ctrl+rueda opcional dentro del slice si reusas el zoom de JointCanvas.
- Boton "Refrescar" en esquina (HU-21.015).
- Boton "Cerrar Mapa" o esquina superior con icono.
- Tooltip basico al hover (nombre + conteo entidades) si entra sin riesgo (HU-21.011 nice-to-have).

`PanelOpl.tsx` (aditivo via store): cuando `vistaMapaActiva`, mostrar placeholder "Vista mapa: OPL no disponible" en lugar de oraciones (HU-21.006). Esto es solo agregar un branch al inicio del render basado en una prop o un selector del store.

`GestionArbolOpd.tsx`:

- Modal nuevo, ocupa centro de pantalla.
- Lista jerarquica del arbol (recursiva, con indent).
- Caja de busqueda: filtra nodos por nombre o por codigo `SDn.m` (HU-20.021).
- Cada nodo tiene acciones: Cortar, Pegar (si hay portapapeles), Renombrar inline.
- Cut: marca nodo como "pendiente"; Paste sobre otro nodo lo mueve como hijo. Validar ciclo (HU-20.022).
- Boton "Cerrar" (Esc).
- Atajo Ctrl+D abre/cierra modal.

`ArbolOpd.tsx` (aditivo):

- Drag manual entre hermanos cuando `modoOrdenArbol === "manual"` (HU-20.017): cada nodo es `draggable`; al soltar entre dos hermanos, invocar `moverHermano`.
- Sufijos por refinamiento en el nombre del nodo (HU-20.005 — verificar si ya esta cubierto): "SDn: Proceso descompuesto" o "SDn: Objeto desplegado".
- Renombrado inline (HU-20.014): doble clic en el texto del nodo abre input.
- Expandir/colapsar todo (HU-20.012 — opcional dentro del slice si cabe): boton en cabecera del arbol.
- Entrada "Mapa del sistema" como nodo destacado en el arbol (HU-21.002): si `vistaMapaActiva`, el nodo aparece resaltado.

`MenuPrincipal.tsx`: agregar entrada "Mapa del sistema" (Ctrl+M opcional).

### Cross-capa

- Switch entre canvas normal y `MapaSistema` se hace en `App.tsx` o en `JointCanvas.tsx` segun `vistaMapaActiva`.
- `cerrarVistaMapa` reactiva canvas normal y panel OPL.
- `Ctrl+D` se intercepta en `App.tsx`; coordinacion: si OPL esta en modo busqueda local (L2), no interceptar.
- `commitModelo` se invoca tras cada `moverHermano`/`moverOpdEnGestion` para que entren al stack undo.

## 7. Tests obligatorios

- Unit opdReorden: `validarMovimientoSinCiclo` rechaza mover SD raiz; rechaza mover nodo bajo su descendiente.
- Unit opdReorden: `reordenarHermanos` con orden invalido (faltante, duplicado) falla.
- Unit opdReorden: `moverNodo` con padre nuevo valido cambia `padreId` y reasigna `ordenLocal`.
- Unit opdReorden: `ordenSegunCanvasPadre` ordena por `apariencia.y` de subprocesos (HU-20.018).
- Unit mapaSistema: `construirDescriptorMapa` produce 1 nodo por OPD + 1 arista por par (padre, hijo); raiz queda como "raiz" sin arista entrante.
- Unit mapaSistema: descriptor es determinista (mismo modelo -> mismo descriptor).
- Unit serializacion: `opd.ordenLocal` opcional roundtrip lossless; legacy hidrata como `undefined`.
- Store: `abrirVistaMapa` activa flag; `cerrarVistaMapa` lo desactiva; `saltarAOpdDesdeMapa` cambia `opdActivoId` y desactiva mapa.
- Store: `moverHermano` con orden manual cambia posicion; con automatico es no-op.
- Store: `fijarModoOrdenArbol("automatico")` recomputa orden desde canvas (verificar via selector).
- Store: `abrirGestionArbol` setea flag; `Ctrl+D` lo invoca; `fijarBusquedaOpdGestion` filtra arbol visible.
- Store: cut+paste mueve nodo; cut+paste sobre descendiente falla.
- Store: `renombrarOpdDesdeArbol` cambia `opd.nombre` con validacion de unicidad por modelo.
- Component/UI: drag entre hermanos en modo manual reordena; en automatico es bloqueado; renombrado inline funciona; modal Gestion abre con Ctrl+D, cierra con ESC.
- Smoke: crear modelo con 3 OPDs anidados; abrir Mapa, verificar 3 thumbnails y 2 aristas; doble clic en thumbnail navega; abrir Gestion (Ctrl+D), buscar nodo, renombrarlo, verificar arbol actualizado.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Mapa es vista derivada; no toca JSON, no afecta OPL, no bloquea historial undo.
- Flechas del meta-grafo no usan estilo OPM (no triangulo, no wrapper+line); usar gris neutro con marker triangular pequeno.
- Modo orden default = automatico; manual exige opt-in (HU-20.019).
- Cut/paste valida ciclos; mover SD raiz esta prohibido.
- No introducir DnD library; usar API nativa.
- Filtros por profundidad/rama, panel de estadisticas, auto-refresh, export y persistencia de zoom/pan quedan fuera.
- Marcadores rojo/verde y tooltips son nice-to-have; pueden quedar fuera si comprometen el slice.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el meta-grafo se renderiza con JointJS reusando el paper o con SVG simple. Recomendado JointJS para reusar pan/zoom; documentar.
- Layout del meta-grafo: vertical Tree (raiz arriba, hijos abajo) vs radial. Preferir vertical Tree para legibilidad inicial.
- Si los thumbnails muestran miniatura visual del OPD o solo nombre + contadores. Para slice minimo, preferir nombre + contadores; miniatura visual opcional si encaja.
- Si el modal Gestion ofrece copiar como alternativa a cortar (cut crea referencia, copy duplica subarbol). Recomendado solo cut/paste; copy queda fuera.
- Como estilizar el indicador "modo orden" en el arbol (icono manual/automatico en cabecera).
- Si la entrada "Mapa del sistema" en el arbol es nodo permanente o solo aparece cuando esta activo. Preferir permanente con resaltado dinamico.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): introduce reordenamiento manual y automatico de hermanos opd`
- `feat(render): construye descriptor de mapa del sistema y proyeccion neutra`
- `feat(ui): agrega vista Mapa del sistema con pan y refrescar`
- `feat(ui): habilita gestion del arbol opd (Ctrl+D) con cut/paste y busqueda`
- `feat(ui): drag manual y renombrado inline en el arbol opd`
- `test(arbol): cubre reordenamiento, gestion y mapa`

Co-author footer estandar si aplica al implementador. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas y bloqueos.
