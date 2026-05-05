# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-05
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1, 2, 3, 4 y 5 consolidadas sobre `main`
**Código verificado**: `main` @ `12c2e50` (`chore(gitignore): excluye runtimes de cli ai locales`)
**Documentación vigente**: este archivo reemplaza por completo el handoff anterior.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Integrado

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura es propia: no Angular, no Firebase, no Rappid. La semántica se
ancla en la SSOT OPM/ISO 19450 en
`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` y la evidencia
operacional reusable se consulta en `opm-extracted/` sin copiar bloques 1:1.

La ronda 5 quedó integrada con seis líneas de desarrollo y dos commits de
normalización (test + housekeeping):

| Línea | Commit | Resultado integrado |
|---|---|---|
| L1 | `a748833` | `opl/interaccion.ts` con tokens, refs y ordinales estables. Panel OPL numerado, filtro por selección, hover/click bidireccional canvas↔OPL y renombrado inverso desde la lente OPL-ES. |
| L3 | `d73cbbf` | `modelo/opdEliminacion.ts`: bloqueo de raíz, mensaje accionable para internos ("Eliminar descendientes primero"), eliminación segura de hojas con limpieza de apariencias huérfanas y undo. |
| L4 | `2b2bdab` | Bus de agregación derivado en render: triángulo único compartido + ramas independientes desde el mismo `todo`, sin fusionar el modelo. Etiquetas de enlace editables desde Inspector con OPL `consta de ... [etiqueta: ...]`. |
| L2 + L5 + L6 | `c79c8c8` | Workspace local (`persistencia/workspace.ts`), menú principal hamburguesa, `Guardar como`, diálogo de carga, título `(No guardado)` cuando el modelo no está persistido + creación interna correcta de cosa por click dentro del contenedor refinado + `Apariencia.estilo?` con swatches de fill/borde y reset, OPL invariante. |

Cascadas de integración cerradas como commits separados:

| Commit | Cascada |
|---|---|
| `0f66cc3` | `fix(smoke)`: alinea la aserción de import JSON con el nuevo título "(No guardado)" introducido por L2. La aserción original (escrita en `32f2f330`, pre-ronda 5) verificaba la ausencia de un sufijo que entonces no existía. |
| `12c2e50` | `chore(gitignore)`: excluye runtimes locales de CLI IA (`.codex/`, `.opencode/`, `.config/`). Coherente con la política existente de excluir `.claude/`. |

Los briefs de ejecución de ronda quedaron en
`docs/instrucciones-lineas-dev/ronda5/` como registro de partición, scopes y
protocolo de conciliación. Los briefs de ronda 1 fueron movidos a
`ronda1/` para preservar el historial de cada ronda en su propia carpeta.

## Cómo Se Decidió La Partición

L2, L5 y L6 entraron en un único commit (`c79c8c8`) por una razón estructural:
L1 (`a748833`) ya había entrelazado el `store.ts` con hooks de las cuatro
líneas (selección desde OPL, filtros, hover, modo de creación interna,
estilos), de modo que el resto del shipping debía aterrizar junto para
mantener el loop verde sin doble-trabajo de rebases. Las otras tres líneas
(L1, L3, L4) son aisladas y mantienen commits dedicados.

## Decisiones Vigentes

- **OPL-ES como lente derivada**: el panel OPL no es fuente de verdad; los IDs
  emitidos por `generarOplInteractivo` permiten edición inversa sin parser
  libre, alineado con `opm-iso-19450-es.md` y `opm-opl-es.md`.
- **Hover OPL↔canvas es estado UI**: no se serializa, no se persiste, no
  reconstruye el grafo en cada mouseover. `seleccionarDesdeOpl` tampoco abre
  un OPD distinto si el destino vive en otra apariencia.
- **Eliminación de OPDs**: la raíz es `disabled`, los internos ejecutan acción
  con mensaje accionable, las hojas eliminan refinamiento, apariencias y
  enlaces huérfanos. Apariencias compartidas se preservan. OPD activo navega
  al padre.
- **Bus de agregación**: vista derivada en render, no cambio del JSON. El
  modelo conserva múltiples enlaces `agregacion`; el render proyecta un único
  triángulo + ramas con marcador y dimensiones desde
  `assets/svg/links/structural/aggregation.svg`. OPL conserva el verbo canónico
  `consta de` y agrega tag opcional como sufijo.
- **Workspace local sin jerarquía**: el breadcrumb es sintético
  (`Inicio / Modelos locales`); el primer `Ctrl+S` sobre un modelo nuevo abre
  `Guardar como`; los guardados subsiguientes reescriben sobre el `id` ya
  asignado. `Guardar como` siempre crea un nuevo `id` aunque el origen ya
  estuviera persistido.
- **Importación no auto-persiste**: un modelo importado desde JSON queda en
  estado "no persistido en workspace" y muestra `(No guardado)` hasta que el
  usuario invoque `Guardar como` o sobreescriba. Coherente con la semántica de
  "abrir archivo" en un editor.
- **Creación interna por posición**: cuando el usuario hace click dentro del
  bbox de un contenedor refinado, la cosa creada nace como hija (sin
  advertencia interior/exterior).
- **Estilo visual con paleta cerrada**: `Apariencia.estilo?` acepta
  `{ fill?, borderColor? }` con paleta inicial de 5 swatches. Hex `#RGB`/
  `#RRGGBB` válido en JSON; UI sólo expone swatches + reset. Texto se
  mantiene legible sobre fill oscuro sin persistir color de texto. OPL es
  invariante a estilo.
- **`Modelo.estados` y `Modelo.abanicos` siguen top-level** (legado de ronda 4).
- **Extremos `ExtremoEnlace = { kind, id }`** para entidad o estado (legado de
  ronda 4).
- **`rutaEtiqueta` y `ordenPartes`** son metadata opcional con normalización
  conservadora (legado de ronda 4).

## Cascadas Gestionadas

- **Render JointJS**: la composición sigue en `proyeccion.ts`, pero la lógica
  nueva vive en helpers (`abanicoOverlay.ts`, `estadoTargets.ts`,
  `rutaLabels.ts`, `autoinvocacionLoop.ts`, `plegadoNesting.ts` de ronda 4 y
  proyección del bus de agregación de L4 + overlays de estilo de L6).
- **JSON estricto**: campos nuevos opcionales (`estilo`, sufijo `descripcion`
  legado, ids de workspace) se hidratan con defaults seguros, validan tipo y
  preservan documentos legacy. Roundtrip lossless verificado por unit tests.
- **OPL**: se integran TS3/TS4/TS5 para estados, `Por ruta ...` para ramas
  etiquetadas, auto-invocación con demora (legado de ronda 4) y etiquetas de
  agregación con tag opcional (L4).
- **Gestos UI**: `jointSelector` usa `closest("[joint-selector]")` para
  capturar clicks sobre `tspan` (legado de ronda 4). Las filas plegadas son
  targets de creación de enlace sin extraer la parte.
- **Persistencia local**: `persistencia/local.ts` ahora hidrata índice y
  modelos de forma tolerante; legacy sin `descripcion` recibe `""` por
  default. La identidad lógica del modelo (`opd-1`) se preserva entre cargas.
- **Cascada test↔L2**: la única cascada cross-line del ciclo fue una aserción
  obsoleta en el smoke de import JSON, resuelta en `0f66cc3`.

## Verificación

Último loop verde de consolidación sobre `12c2e50`:

```bash
cd app
bun run check          # typecheck OK; 283 unit tests pass, 1541 expect()
bun run browser:smoke  # 34/34 Playwright smoke pass (43.3 s)
bun run build          # OK; bundle 843 KB minificado, 241 KB gzip
```

Estado HU tras `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`:

| Segmento | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|
| Total backlog | 84 | 51 | 613 | 378 | 10.2% |
| M0 | 51 | 29 | 50 | 0 | 50.5% |
| MVP-alpha | 25 | 23 | 73 | 0 | 26.1% |
| MVP-beta | 46 | 23 | 124 | 0 | 32.4% |

> ⚠️ **Desincronía conocida del detector**. Las reglas regex del
> `progress-dashboard.mjs` reportan `40/42 matcheadas sobre 103 archivos` y
> EPICA-14, EPICA-30, EPICA-34 siguen subreportadas pese a que L2/L6 sí las
> cubren parcialmente. EPICA-50 BAJÓ de 18.2% a 3.6% por reglas que dejaron
> de matchear tras los refactors de L1. Las cifras de la tabla reflejan la
> visión del detector, no la verdad del código. Calibrar las reglas a la
> nueva realidad de ronda 5 es trabajo de la próxima iteración del ledger
> (ver pendientes).

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado `HU-13.005`
entre `epica-13-canvas-estados.md` y `HU-SHARED-001-menu-contextual.md`. No es
fallo de app ni de consolidación.

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados, abanicos,
  multiplicidad, modificadores, invocación, rutas, auto-invocación,
  descomposición, despliegue de objetos, plegado parcial avanzado,
  eliminación segura de OPDs hoja, creación interna por posición y estilo
  visual editable están cubiertos por tests unitarios.
- **Render**: assets canónicos de enlaces procedimentales, estructurales y
  lógicos se proyectan desde `assets/svg/links/`. Bus de agregación
  derivado y overlays de estilo aplicados en body sin romper
  `strokeDasharray` ambiental.
- **UI/store**: Inspector y canvas cubren creación/edición de estados,
  rutas, auto-invocación, orden de partes plegadas, extracción/reinserción,
  enlaces desde filas plegadas, OPL inverso (selección/hover/renombrado),
  eliminación de OPDs desde árbol, etiquetas de enlace, swatches de
  estilo, menú principal y diálogos de archivo.
- **Persistencia**: JSON conserva estados, extremos, multiplicidad,
  modificadores, rutas, plegado, apariencias extraídas, orden de partes y
  estilo. Workspace local con índice tolerante y `Guardar como` /
  `Cargar modelo` desde diálogos.
- **Auditoría**: `docs/roadmap/hu-progress.{md,html,json}` y
  `hu-progress-evidence.json` regenerados sobre HEAD; ver desincronía del
  detector señalada arriba.

## Pendientes Inmediatos

- **Calibrar `progress-dashboard.mjs` para ronda 5**. Reglas que no detectan
  evidencia real:
  - EPICA-50 (HU-50 sobre OPL inverso): perdió 3 puntos de cobertura por
    refactor de `app/src/opl/`; el nuevo `interaccion.ts` no es matcheado.
  - EPICA-14 (estilado visual): sigue en 0% pese a `modelo/estilos.ts` +
    `ui/StyleControls.tsx` + tests.
  - EPICA-30/34 (workspace y modelo nuevo): no recogen `persistencia/
    workspace.ts`, `MenuPrincipal.tsx`, `DialogoGuardarComo.tsx`,
    `DialogoCargarModelo.tsx`.
  - EPICA-1C (creación interna): no recoge `modelo/creacionInterna.ts`.
  - EPICA-20 (eliminación segura): no recoge `modelo/opdEliminacion.ts`.
  - EPICA-11 (bus agregación + etiquetas): no recoge la proyección del bus
    ni el campo `etiqueta` editable.
- **EPICA-50**: queda completar edición OPL→canvas más allá del renombrado y
  matcher de tokens compuestos.
- **EPICA-30/34**: el asistente de 12 etapas para nuevo modelo, jerarquía de
  carpetas, búsqueda global y autosalvado siguen abiertos.
- **EPICA-20**: vistas derivadas del árbol (mapa del sistema, EPICA-21) y
  reordenamiento drag-and-drop de OPDs siguen pendientes.
- **EPICA-11**: tabla de enlaces (EPICA-16) y propiedades avanzadas siguen
  pendientes.
- **EPICA-14**: el resto de la épica (estilado de texto, estilado de enlaces,
  defaults de organización) sigue pendiente.
- **Deuda técnica**: `app/src/modelo/operaciones.ts` continúa grande;
  cualquier nueva capacidad debe preferir módulos de dominio y wrappers
  mínimos.
- **Deuda de build**: Vite advierte por chunk JS grande (~843 KB minificado);
  posponer code splitting hasta que el corte funcional lo justifique.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md` (con la
   advertencia del detector en mente).
2. Antes de abrir una nueva ronda, **calibrar `progress-dashboard.mjs`** para
   que reconozca la evidencia de ronda 5; sin eso, los avances reales seguirán
   subreportados y la priorización del próximo ciclo será sesgada.
3. Elegir pendientes desde M0/MVP-alpha o abrir una nueva ronda paralela desde
   el tablero vigente. Los briefs antiguos viven en
   `docs/instrucciones-lineas-dev/ronda{1,3,4,5}/`.
4. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md`
   y la SSOT OPM.
5. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar
   `bun run browser:smoke`; si toca proyección o bundle, sumar `bun run build`.
6. Regenerar auditoría con
   `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
   antes de publicar un cierre de ronda.
