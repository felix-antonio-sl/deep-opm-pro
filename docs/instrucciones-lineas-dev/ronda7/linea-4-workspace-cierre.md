# Linea 4 — Workspace cierre: mover modelos, drag-drop, busqueda global, versiones

## 1. Mision

Cerrar la mayoria de los pendientes de EPICA-30/31/35 listados en `docs/HANDOFF.md §Pendientes Inmediatos`: mover modelos entre carpetas (cut/paste y drag-drop), cut/paste y drag-drop de carpetas, busqueda global cross-folder con minimo 3 caracteres, versiones simples (snapshot por save manual sin log-scale), archivado manual sin auto-archivado por 90 dias, y mejora del grid "Modelos Recientes". Single-user MVP: **sin permisos O/W/R, sin matriz, sin propagacion de lectura, sin colaboracion** — esos quedan fuera de ronda.

**Slice minimo entregable**:

- Helper `app/src/persistencia/movimientoModelos.ts` con `moverModelo`, `cortarModelo`, `pegarModelo`, `moverCarpeta`, `cortarCarpeta`, `pegarCarpeta`, `validarMovimientoSinCiclo`.
- Helper `app/src/persistencia/versiones.ts` con `crearVersion`, `listarVersiones`, `restaurarVersion`, `eliminarVersion`. Snapshot por save manual; **sin log-scale**, sin retention policy automatica.
- Extension `app/src/persistencia/workspace.ts`: campos `carpeta.archivada?`, `modelo.archivado?`, `modelo.versiones?`, `WorkspaceIndice.busquedaGlobalUltima?`.
- Componente nuevo `app/src/ui/DialogoBuscarGlobal.tsx`: caja de busqueda con guard de 3+ caracteres, filtra por nombre y descripcion sobre todo el indice (cross-folder), navega al modelo destino.
- Componente nuevo `app/src/ui/DialogoVersiones.tsx`: lista de snapshots por modelo con timestamp, descripcion opcional, accion "Restaurar como copia" y "Eliminar version".
- Componente nuevo `app/src/ui/DialogoArchivados.tsx`: lista de modelos archivados con accion "Restaurar" y "Eliminar permanentemente".
- Extension `app/src/ui/PanelCarpetas.tsx`: handlers HTML5 DnD para mover modelos y carpetas; menu contextual con Cortar/Pegar/Renombrar/Eliminar/Archivar/Versiones; glifos archivado (archivo) y version (rama) sobre tiles.
- Extension `app/src/ui/DialogoCargarModelo.tsx`: drag-drop entre tiles, toggle "Mostrar archivados", toggle "Mostrar versiones".

**Fuera de slice**: HU-31.008 restringir creacion en Home a admins (requiere multi-usuario); HU-31.014-021/.024-025 matriz O/W/R, expansibles, propagacion de lectura, tooltips de permisos vigentes (requiere multi-usuario); HU-30.024 log-scale (mantener simple, una version por save manual); HU-30.026 auto-archivar 90 dias (requiere job programado, fuera de MVP single-user); HU-35.007 union de permisos al mover (requiere ACL); HU-35.016/.017 biblioteca lateral arrastrable (es canvas — fuera de scope); HU-35.020 actualizar OPL al saltar (ya cubierto en ronda 6); HU-30.034 glifos editable/candado/autosalvado (ya parcial en ronda 6 — refuerza autosalvado y agrega archivado/version, sin candado).

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-35.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-35-persistencia-mover-buscar.md` | Cortar modelo desde dialogo Cargar. |
| HU-35.002 | idem | Pegar modelo cortado en carpeta destino con confirmacion. |
| HU-35.003 | idem | Habilitar "Pegar Modelo" solo con corte pendiente. |
| HU-35.004 | idem | Mover modelo por drag-drop entre tiles. |
| HU-35.005 | idem | Versiones acompanan al modelo movido. |
| HU-31.011 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-31-persistencia-folders.md` | Cortar carpeta. |
| HU-31.012 | idem | Pegar carpeta cortada en destino. |
| HU-31.013 | idem | Mover carpeta con drag-drop directo. |
| HU-30.029 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Busqueda global cross-folder con >=3 caracteres. |
| HU-30.011 | idem | Grid "Modelos Recientes" siempre visible (refuerza ronda 6). |
| HU-30.023 | idem | Toggle "Mostrar Versiones" en dialogo Cargar. |
| HU-30.025 | idem | Toggle "Mostrar Archivados" en dialogo Cargar. |
| HU-30.027 | idem | Restaurar modelo archivado. |
| HU-30.034 | idem | Glifos archivado / version (sin candado por single-user). |

## 3. Anclaje a evidencia

- **SSOT**: la SSOT no prescribe persistencia ni workspace; toda la EPICA-30/31/35 es UI heredada de OPCloud. Los invariantes son: (i) modelo serializado integro al guardar, (ii) entidad/apariencia/enlace/opd/modelo no se rompen por movimiento, (iii) `modelo.id` es estable cross-folder.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts` lineas 5-27: `DeepSearchModel { archiveMode, directory_id, title, path }`, `DeepSearchFolder { father, id, name }`. Patron canonico para el resultset de busqueda global.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/load-model-dialog/load-model-dialog.component.ts` lineas 28-50: drag-drop zona, folder/model selector, name + description fields. Patron de UI; no copiar.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/folder-permissions-dialog/folder-permissions-dialog/folder-permissions-dialog.component.ts` patron drag-drop de carpetas (estructura DOM y handlers); ignorar la logica de permisos.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/search-items-dialog/search-items-dialog.component.ts` patron de busqueda global con throttle.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/load-model-dialog/sub-dialogs/` removeModel, rename — patron sub-dialogos.
  - `assets/svg/folder.svg`, `assets/svg/regFile.svg`, `assets/svg/delete.svg`: iconos canonicos. Glifo archivado: usar svg existente (revisar `assets/`); si no existe, decidir y documentar en commit (no redibujar). Glifo version: usar svg existente o emoji `🌿` con consistencia visual.
- **Estado actual del codigo (post-ronda 6)**:
  - `app/src/persistencia/workspace.ts` (254 LOC) tiene `WorkspaceIndice { modelos: ResumenModeloPersistido[]; carpetas: CarpetaIndice[]; busquedaUltima?: string }` (revisar campo exacto). `ResumenModeloPersistido { id, nombre, descripcion?, carpetaId, ultimaApertura?, autosalvado? }`. `CarpetaIndice { id, nombre, padreId, creadoEn }`. **Sin permisos**.
  - `app/src/persistencia/local.ts` (211 LOC) usa LocalStorage (o IndexedDB?) para persistir modelos serializados. Verificar la estrategia y reusarla para snapshots de version.
  - `app/src/ui/PanelCarpetas.tsx` (609 LOC) renderiza tiles vs lista, breadcrumb, ordenamiento, recientes. No tiene drag-drop ni cut/paste.
  - `app/src/ui/DialogoCargarModelo.tsx` (103 LOC) y `DialogoGuardarComo.tsx` envuelven `PanelCarpetas`.
  - `app/src/ui/DialogoBuscarCosas.tsx` ya existe (Ctrl+F intra-modelo, ronda 6). El nuevo `DialogoBuscarGlobal.tsx` es analogo pero cross-folder cross-modelo.

## 4. Archivos permitidos

```text
app/src/persistencia/movimientoModelos.ts        NUEVO
app/src/persistencia/movimientoModelos.test.ts   NUEVO
app/src/persistencia/versiones.ts                NUEVO
app/src/persistencia/versiones.test.ts           NUEVO
app/src/persistencia/workspace.ts                EDIT aditivo (mover, drag-drop, glifos archivado/version)
app/src/persistencia/local.ts                    EDIT aditivo (`modelo.archivado?`, `modelo.versiones?`, `carpeta.archivada?`)
app/src/persistencia/local.test.ts               EDIT aditivo
app/src/store.ts                                 EDIT aditivo (slice "Workspace cierre" al final)
app/src/store.test.ts                            EDIT aditivo
app/src/modelo/tipos.ts                          EDIT aditivo (`carpeta.archivada?`, `modelo.archivado?`, `modelo.versiones?`)
app/src/serializacion/json.ts                    EDIT aditivo (`modelo.archivado?`, `modelo.versiones?` opcionales en JSON OPM)
app/src/serializacion/json.test.ts               EDIT aditivo
app/src/ui/PanelCarpetas.tsx                     EDIT aditivo (drag-drop, cut/paste, glifos)
app/src/ui/DialogoCargarModelo.tsx               EDIT aditivo (drag-drop entre tiles, toggles, glifos)
app/src/ui/DialogoGuardarComo.tsx                EDIT aditivo (snapshot-version checkbox opcional al guardar)
app/src/ui/DialogoBuscarGlobal.tsx               NUEVO
app/src/ui/DialogoVersiones.tsx                  NUEVO
app/src/ui/DialogoArchivados.tsx                 NUEVO
app/src/ui/MenuPrincipal.tsx                     EDIT aditivo (entradas "Buscar global", "Mostrar archivados", "Mostrar versiones")
app/src/ui/Toolbar.tsx                           EDIT aditivo discreto (icono "archivado" / "version" si modelo activo)
app/src/ui/App.tsx                               EDIT aditivo (montar DialogoBuscarGlobal, DialogoVersiones, DialogoArchivados)
app/e2e/opm-smoke.spec.ts                        EDIT aditivo
opm-extracted/**                                 LECTURA
docs/JOYAS.md                                    LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/canvas/seleccionMultiple.ts`, `operacionesBatch.ts` (territorio L1). El drag-drop del workspace no toca canvas.
- No tocar `app/src/render/jointjs/mapaSistema.ts`, `mapaExport.ts`, `MapaSistema.tsx`, `MapaPanelEstadisticas.tsx`, `MapaFiltros.tsx` (territorio L2). El campo `mapa` por modelo en `WorkspaceIndice` es de L2; esta linea **lee** la estructura `ResumenModeloPersistido` pero no escribe sobre `mapa` (reusa lo que L2 entrego en la base de merge). Coordinacion: si L2 mergea antes (orden sugerido: si), `mapa` ya esta presente; si no, L4 deja el campo `mapa` opcional sin tocar.
- No tocar `app/src/store/pestanas.ts`, `BarraPestanas.tsx`, `opl/bloquesJerarquicos.ts`, `PanelOpl.tsx` (territorio L3). Esta linea escribe en `PanelCarpetas` y dialogos sin tocar pestanas; el item "Abrir en pestana nueva" es propiedad de L3 — si L3 mergea antes (NO en orden sugerido), respeta su firma; si no, deja stub para L3 al merge siguiente.
- No tocar `app/src/ui/atajosTeclado.ts`, `divisorPanel.tsx`, `MenuContextualArbol.tsx`, `ArbolOpd.tsx`, `CheatsheetAtajos.tsx` (territorio L5). Atajo `Ctrl+Shift+F` para busqueda global se documenta pero no se cablea aqui — L5 lo registra al merge siguiente. El atajo `Ctrl+F` (busqueda intra-modelo) ya existe (ronda 6 L4); esta linea no lo toca.
- No tocar `app/src/modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`, `InspectorEntidad.tsx`, `ModalUrlsObjeto.tsx`, `ModalDuracion.tsx` (territorio L6).
- No tocar `app/src/modelo/operaciones.ts`. El movimiento es persistencia, no kernel.
- No tocar `app/src/render/jointjs/proyeccion.ts`, `JointCanvas.tsx`. El workspace no toca render.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- No introducir libreria DnD; usar HTML5 nativo.
- No introducir backend ni servicio remoto. La busqueda global es local sobre el indice de workspace.

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo):

```ts
export interface CarpetaIndice {
  id: Id;
  nombre: string;
  padreId: Id | null;
  creadoEn: string;            // ISO
  archivada?: boolean;         // default false (omitido)
}

export interface ResumenModeloPersistido {
  // ... campos existentes
  archivado?: boolean;         // default false
  archivadoEn?: string;        // ISO
  versiones?: VersionResumen[];
}

export interface VersionResumen {
  id: Id;                      // ej. crypto.randomUUID()
  creadoEn: string;            // ISO
  nombre: string;              // default "Snapshot AAAA-MM-DD HH:MM"
  descripcion?: string;
  modeloPayloadKey: string;    // clave en LocalStorage / IndexedDB para el snapshot
  bytes: number;               // tamaño aprox del payload, para mostrar
}

export interface PortapapelesWorkspace {
  tipo: "modelo" | "carpeta";
  itemId: Id;
  origenCarpetaId: Id | null;  // donde estaba antes
  cortadoEn: string;            // ISO; se descarta tras 5 minutos para evitar pegar un cut viejo
}

export interface BusquedaGlobalEstado {
  query: string;
  resultados: ResultadoBusquedaGlobal[];
  enProgreso: boolean;
}

export interface ResultadoBusquedaGlobal {
  modeloId: Id;
  nombre: string;
  descripcion?: string;
  carpetaId: Id | null;
  rutaCarpetas: string;        // breadcrumb tipo "Home / A / B"
  match: { campo: "nombre" | "descripcion"; resaltado: string };
}
```

### Persistencia

`persistencia/movimientoModelos.ts` (nuevo):

```ts
export function moverModelo(
  workspace: WorkspaceIndice,
  modeloId: Id,
  destinoCarpetaId: Id | null,
): Resultado<WorkspaceIndice>;

export function moverCarpeta(
  workspace: WorkspaceIndice,
  carpetaId: Id,
  destinoCarpetaId: Id | null,
): Resultado<WorkspaceIndice>;

export function validarMovimientoCarpetaSinCiclo(
  workspace: WorkspaceIndice,
  carpetaId: Id,
  destinoCarpetaId: Id | null,
): Resultado<void>;
```

Reglas:
- `moverModelo` actualiza `ResumenModeloPersistido.carpetaId` sin tocar `modelo.*` (la carpeta es metadata workspace, no del modelo OPM).
- `moverCarpeta` cambia `carpeta.padreId`. Rechaza si `destinoCarpetaId` es descendiente de `carpetaId` (ciclo).
- `moverCarpeta` con `destinoCarpetaId === null` mueve a Home (raiz).
- Versiones del modelo (`versiones`) **se mueven con el modelo** (HU-35.005) — son metadata local del modelo.
- Snapshots actuales (LocalStorage payloads) no se renombran; el modelo conserva su id y sus claves de payload.

`persistencia/versiones.ts` (nuevo):

```ts
export function crearVersion(modelo: Modelo, opts: { nombre?: string; descripcion?: string }): VersionResumen;
export function listarVersiones(workspace: WorkspaceIndice, modeloId: Id): VersionResumen[];
export function restaurarVersion(versionId: Id): Promise<Modelo>;       // retorna el snapshot deserializado
export function eliminarVersion(workspace: WorkspaceIndice, modeloId: Id, versionId: Id): WorkspaceIndice;
```

Reglas:
- `crearVersion` serializa `modelo` a JSON y guarda en `localStorage[clave]` o IndexedDB con `clave = "version:${modeloId}:${versionId}"`. Devuelve `VersionResumen` con `bytes = payload.length`.
- Por default, una version se crea al guardar manualmente (no autosalvado). Se controla con flag `crearVersionEnSave: boolean` en preferencias del usuario; default `false` (las versiones son opt-in para no inflar storage). Documentar en commit.
- `restaurarVersion` retorna el snapshot deserializado pero **NO** sobreescribe el modelo actual; el flujo UI ofrece "Restaurar como copia" que crea modelo nuevo con sufijo "(restaurado AAAA-MM-DD)".
- `eliminarVersion` quita del array y elimina la clave del storage.
- Sin retention policy automatica (HU-30.024 fuera). El usuario gestiona manualmente.

`persistencia/workspace.ts` (aditivo):

```ts
export function listarModelosPorCarpeta(
  workspace: WorkspaceIndice,
  carpetaId: Id | null,
  opts?: { incluirArchivados?: boolean },
): ResumenModeloPersistido[];

export function listarCarpetasPorPadre(
  workspace: WorkspaceIndice,
  padreId: Id | null,
  opts?: { incluirArchivadas?: boolean },
): CarpetaIndice[];

export function buscarGlobal(workspace: WorkspaceIndice, query: string): ResultadoBusquedaGlobal[];

export function archivarModelo(workspace: WorkspaceIndice, modeloId: Id): WorkspaceIndice;
export function restaurarModelo(workspace: WorkspaceIndice, modeloId: Id): WorkspaceIndice;
export function archivarCarpeta(workspace: WorkspaceIndice, carpetaId: Id): WorkspaceIndice;
export function restaurarCarpeta(workspace: WorkspaceIndice, carpetaId: Id): WorkspaceIndice;
```

Reglas:
- `buscarGlobal` retorna `[]` si `query.length < 3`. Filtra `nombre` y `descripcion` case-insensitive con `includes`. Resaltado: marca substring matching con `<mark>` o tokens (UI decide).
- `archivarModelo` setea `archivado: true, archivadoEn: now`. NO mueve el archivo (sigue en su carpeta); solo lo marca.
- `archivarCarpeta` propaga: marca todos los modelos descendientes y sub-carpetas como archivados (cascada). UI confirma antes.
- `restaurarModelo` quita el flag `archivado`.
- `listarModelosPorCarpeta` con `incluirArchivados: false` (default) filtra archivados.

### Store

```ts
// Bloque "Workspace cierre" (al final, agrupado)
portapapelesWorkspace: PortapapelesWorkspace | null;
busquedaGlobal: BusquedaGlobalEstado;
mostrarArchivados: boolean;
mostrarVersiones: boolean;
dialogoVersionesAbierto: { modeloId: Id } | null;
dialogoArchivadosAbierto: boolean;
dialogoBuscarGlobalAbierto: boolean;

cortarModelo(modeloId: Id): void;
cortarCarpeta(carpetaId: Id): void;
pegarEn(carpetaDestinoId: Id | null): void;     // resuelve segun portapapelesWorkspace.tipo
moverModeloDirecto(modeloId: Id, destino: Id | null): void;
moverCarpetaDirecto(carpetaId: Id, destino: Id | null): void;

archivarModeloActual(): void;
archivarModeloPorId(modeloId: Id): void;
restaurarModeloPorId(modeloId: Id): void;
archivarCarpetaPorId(carpetaId: Id): void;
restaurarCarpetaPorId(carpetaId: Id): void;

guardarConVersion(): Promise<void>;             // save manual + crearVersion
crearVersionAhora(opts?: { nombre?: string; descripcion?: string }): Promise<void>;
abrirDialogoVersiones(modeloId: Id): void;
cerrarDialogoVersiones(): void;
restaurarVersionComoCopia(modeloId: Id, versionId: Id): Promise<void>;
eliminarVersionPorId(modeloId: Id, versionId: Id): void;

abrirDialogoArchivados(): void;
cerrarDialogoArchivados(): void;

abrirDialogoBuscarGlobal(): void;
cerrarDialogoBuscarGlobal(): void;
fijarBusquedaGlobalQuery(q: string): void;
ejecutarBusquedaGlobal(): void;                 // se invoca con debounce 300ms desde input

toggleMostrarArchivados(): void;
toggleMostrarVersiones(): void;
```

Reglas:
- `pegarEn` valida con `validarMovimientoCarpetaSinCiclo` cuando aplica. En caso de error, mostrar toast y mantener portapapeles.
- `moverModeloDirecto` y `moverCarpetaDirecto` se invocan desde drag-drop directo.
- `cortarModelo`/`cortarCarpeta` setean portapapeles con `cortadoEn: now`. Si el portapapeles tiene >5 min, descartar antes de pegar.
- `restaurarVersionComoCopia(m, v)` invoca `restaurarVersion(v)` y luego `Guardar como` con nombre `${nombre} (restaurado AAAA-MM-DD)`.
- Busqueda con debounce 300 ms en el input; `ejecutarBusquedaGlobal` invoca `buscarGlobal(query)`.

### Serializacion

`json.ts` (aditivo):

- `modelo.archivado?: boolean` opcional, default `false` cuando ausente.
- `modelo.archivadoEn?: string` opcional.
- `modelo.versiones?: VersionResumen[]` opcional, default `[]` cuando ausente.
- Roundtrip lossless: cargar modelo legacy sin estos campos NO falla.
- `WorkspaceIndice` se persiste aparte (probablemente en `workspace.ts` con su propio storage key).

### UX

`PanelCarpetas.tsx` (aditivo):

- Handlers HTML5 DnD:
  - `onDragStart` en tile de modelo o carpeta: `dataTransfer.setData("text/workspace-item", JSON.stringify({ tipo, id, origenCarpetaId }))`.
  - `onDragOver` en zona de carpeta o tile de carpeta: `e.preventDefault()` para permitir drop.
  - `onDrop`: lee el payload; si es modelo, invoca `moverModeloDirecto(id, destinoId)`; si es carpeta, invoca `moverCarpetaDirecto(id, destinoId)` (con validacion de ciclo, mostrar toast si rechaza).
  - Visual feedback: durante drag, resaltar zonas validas con borde dasharray azul.
- Menu contextual (clic derecho o boton tres puntos):
  - "Cortar" -> `cortarModelo` o `cortarCarpeta`.
  - "Pegar aqui" -> `pegarEn(carpetaActual)` (visible solo cuando `portapapelesWorkspace` no nulo).
  - "Renombrar" -> existente.
  - "Eliminar" -> existente.
  - "Archivar" / "Restaurar" -> nuevo (segun estado).
  - "Versiones..." (solo modelo) -> `abrirDialogoVersiones(modeloId)`.
- Glifos sobre tiles:
  - Archivado: icono caja con flecha sobre la esquina superior izquierda; tile en grayscale.
  - Tiene versiones (>=1): icono rama / `🌿` o svg interno en esquina superior derecha; tooltip "N versiones".
- Filtro respeta `mostrarArchivados` y `mostrarVersiones` toggles del store.
- Boton "Cortar pendiente" visible cuando hay portapapeles, con acion "Pegar aqui" y "Cancelar".

`DialogoCargarModelo.tsx` (aditivo):

- Cabecera con toggles "Mostrar archivados" y "Mostrar versiones" (refresca tiles).
- Input "Buscar en esta carpeta" (HU-30.028, ya existente?) y checkbox "Incluir subcarpetas" cuando query.length >= 3 (HU-30.029).
- Si "Incluir subcarpetas" activo, cambia a modo busqueda global; muestra tabla de resultados con breadcrumb por modelo.
- Boton "Abrir versiones..." junto a cada modelo con >=1 version (icono rama).

`DialogoBuscarGlobal.tsx` (nuevo):

- Modal central con caja de busqueda grande, mensaje "Ingrese >=3 caracteres" cuando query.length < 3.
- Tabla de resultados con columnas: Modelo (con icono tipo), Carpeta (breadcrumb), Match (campo + texto resaltado).
- Click en fila navega: cierra dialogo + abre modelo en pestana actual (o nueva pestana via L3 cuando este disponible).
- Atajo Esc cierra; Enter abre primero.
- `data-testid="dialogo-buscar-global"`, `data-testid="resultado-busqueda-global-${modeloId}"`.

`DialogoVersiones.tsx` (nuevo):

- Modal central con titulo "Versiones de '<nombre modelo>'".
- Lista de versiones: tabla con `creadoEn`, `nombre`, `descripcion`, `bytes`. Acciones por fila: "Restaurar como copia", "Eliminar".
- Boton "Crear version ahora" arriba (invoca `crearVersionAhora()`).
- Boton "Cerrar".

`DialogoArchivados.tsx` (nuevo):

- Modal central con titulo "Modelos archivados".
- Tabla con `nombre`, `archivadoEn`, `carpeta` (breadcrumb), acciones "Restaurar", "Eliminar permanentemente".
- Boton "Cerrar".

`MenuPrincipal.tsx` (aditivo): entradas "Buscar global... (Ctrl+Shift+F)" y "Mostrar archivados...", "Mostrar versiones del modelo actual".

`Toolbar.tsx` (aditivo discreto): icono "archivado" con tooltip si modelo activo esta archivado (no debe ocurrir normalmente, pero defensivo); icono "version" cuando modelo tiene >=1 version, click abre `DialogoVersiones` del modelo actual.

`App.tsx` (aditivo): montar `<DialogoBuscarGlobal />`, `<DialogoVersiones />`, `<DialogoArchivados />` controlados por flags del store.

### Cross-capa

- L3 multi-pestana: en orden de merge sugerido L4 va antes que L3. El item "Abrir en pestana" en `PanelCarpetas` es introducido por L3 al merge siguiente; L4 deja el menu contextual extensible (acciones array facilmente apendible).
- L5 atajos teclado: el atajo `Ctrl+Shift+F` (busqueda global) y atajos del panel carpetas (flechas, Enter, Backspace) se documentan en commit; L5 los cablea en el registry central.
- Versiones y JSON OPM: las versiones viven como `modelo.versiones?: VersionResumen[]` opcional en JSON. Permite migrar el indice si en el futuro se mueve a otro storage. Roundtrip lossless verificado.
- Drag-drop coexiste con DnD del arbol OPD (L5/ronda 6) — uso de `dataTransfer.types` distintos: `text/workspace-item` (L4) vs `text/opd-id` (L5/ronda 6). Documentar contrato.

## 7. Tests obligatorios

- Unit `movimientoModelos.test.ts`:
  - `moverModelo` cambia carpetaId del modelo; no toca `modelo.entidades`.
  - `moverCarpeta` cambia padreId.
  - `validarMovimientoCarpetaSinCiclo` rechaza mover carpeta a su propio descendiente; rechaza mover Home (`carpetaId === null` no es valido como source).
  - Modelo movido conserva versiones (HU-35.005).
- Unit `versiones.test.ts`:
  - `crearVersion` agrega entrada y guarda payload en storage (mock LocalStorage).
  - `listarVersiones` filtra por modeloId.
  - `restaurarVersion` retorna Modelo deserializado equivalente al guardado.
  - `eliminarVersion` quita del array y libera storage.
- Unit `workspace.ts` (aditivo):
  - `buscarGlobal("ab")` retorna `[]` (query < 3 chars).
  - `buscarGlobal("modelo")` filtra todos los nombres/descripciones que contienen "modelo".
  - `archivarModelo` setea flag; `restaurarModelo` lo quita.
  - `archivarCarpeta` cascada propaga a hijos.
  - `listarModelosPorCarpeta` con `incluirArchivados: false` excluye archivados.
- Unit serializacion: roundtrip lossless con `archivado`, `archivadoEn`, `versiones`. Modelo legacy sin esos campos hidrata sin error.
- Store: `cortarModelo` setea portapapeles con `cortadoEn`. `pegarEn` con portapapeles >5 min no aplica (mostrar toast); con valido aplica `moverModelo`.
- Store: `archivarModeloActual` setea flag y refresca lista; `restaurarModeloPorId` lo quita.
- Store: `crearVersionAhora` agrega version al modelo activo.
- Store: `ejecutarBusquedaGlobal` con debounce 300 ms; query corta ignorada.
- Component/UI PanelCarpetas: drag tile A sobre carpeta C invoca `moverModeloDirecto`; visual feedback durante drag; cut/paste flow funciona; glifos archivado/version visibles cuando aplica.
- Component/UI DialogoBuscarGlobal: input con 2 chars no busca; con 3+ ejecuta busqueda; click en resultado navega.
- Component/UI DialogoVersiones: lista versiones; "Restaurar como copia" crea modelo nuevo con sufijo; "Eliminar" quita.
- Component/UI DialogoArchivados: muestra archivados; restaurar quita flag; eliminar permanentemente borra.
- Smoke browser: cargar modelo demo; abrir dialogo Cargar; cortar modelo, navegar a carpeta destino, pegar; verificar movimiento; abrir busqueda global, escribir 3 chars, navegar al resultado; archivar modelo, abrir DialogoArchivados, restaurar.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Single-user MVP: sin permisos O/W/R, sin matriz, sin propagacion de lectura, sin tooltips de permisos vigentes.
- Versiones son **opt-in por save manual**. Sin log-scale, sin retention policy automatica. El usuario gestiona; UI limita silente (cuando storage llena, advertir y no auto-limpiar).
- Auto-archivado por 90 dias (HU-30.026) **fuera de ronda** — requiere job y politica.
- Drag-drop usa API nativa HTML5 (`draggable`, `ondragstart`, etc.). No introducir `react-dnd`, `@dnd-kit/*`, etc.
- Cortar/pegar caduca a los 5 minutos para evitar pegar un cut viejo en otra sesion.
- Movimiento de carpeta valida ciclos (no permitir mover una carpeta dentro de su propio descendiente).
- Versiones acompanan al modelo movido (HU-35.005): la metadata `modelo.versiones` se preserva al cambiar `carpetaId`.
- Busqueda global require >=3 caracteres (HU-30.029); query corta es no-op.
- Archivar carpeta cascada propaga a modelos y sub-carpetas (UI confirma antes).
- Glifos: archivado (caja con flecha) y version (rama). No introducir glifo candado (single-user, no aplica).
- `DialogoBuscarGlobal` navega cerrando el dialogo; si L3 mergea despues, podra ofrecer "Abrir en nueva pestana" como variante.

## 10. Decisiones que tomas vos (documentar en commit)

- Si `crearVersionEnSave` es preferencia global o per-modelo. Recomendado: per-modelo (`modelo.crearVersionAlGuardar?: boolean`) para que el usuario decida que modelos versionar.
- Cuanta storage maxima reservar para versiones por modelo (alerta cuando >10 MB acumulados). Recomendado: warning cuando >10 MB; sin auto-purga.
- Si "Restaurar como copia" abre la copia automaticamente o solo aparece en el listado. Recomendado: abrir automaticamente.
- Si la busqueda global busca en `entidad.nombre` cross-modelo (lento) o solo en `modelo.nombre/descripcion`. Recomendado: solo modelo (rapido); busqueda profunda como feature futura.
- Si la cabecera del dialogo Cargar muestra "X resultados" cuando busca cross-folder. Recomendado: si.
- Si los toggles "Mostrar archivados" / "Mostrar versiones" son por sesion o persistentes. Recomendado: persistentes en LocalStorage (ej. `ui.preferencias.mostrarArchivados`).
- Si el menu contextual del modelo en `PanelCarpetas` reemplaza al boton tres puntos o lo complementa. Recomendado: complementario (ambos coexisten).

## 11. Forma del entregable

Commits sugeridos:

- `feat(persistencia): introduce mover modelos y carpetas con cut paste y drag drop`
- `feat(persistencia): versiones por save manual con restaurar como copia`
- `feat(persistencia): archivado manual de modelos y carpetas con cascada`
- `feat(persistencia): busqueda global cross folder con guard de 3 caracteres`
- `feat(ui): dialogos de busqueda global versiones y archivados con glifos en tiles`
- `feat(ui): drag drop entre tiles y menu contextual completo en panel carpetas`
- `test(workspace): cubre movimiento versiones archivado busqueda global y cascadas`

Co-author footer estandar si aplica al implementador externo. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas (HU-30.024 log-scale fuera, HU-30.026 auto-archivado fuera) y bloqueos. Si descubris bug fuera de scope, entregar como patch a `/tmp/`.
