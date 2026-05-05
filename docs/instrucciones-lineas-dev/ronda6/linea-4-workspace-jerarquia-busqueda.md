# Linea 4 — Workspace jerarquico, busqueda y autosalvado

## 1. Mision

Romper el techo single-folder del workspace local de L2 ronda 5: introducir jerarquia de carpetas con breadcrumb real, vistas tiles/lista con ordenamiento, busqueda por nombre tanto en el dialogo de carga como dentro del modelo activo (Ctrl+F), y autosalvado periodico cada 5 minutos con glifo visible. Sin permisos, sin Firebase, sin remote: workspace local persistido en `localStorage` siguiendo la mecanica ya validada.

**Slice minimo entregable**: extension de `persistencia/workspace.ts` con `carpetas: CarpetaIndice[]` y operaciones (`crearCarpeta`, `renombrarCarpeta`, `eliminarCarpeta`, `moverModeloACarpeta`); `persistencia/autosalvado.ts` nuevo con timer y suscripcion a `dirty`; `DialogoCargarModelo.tsx` y `DialogoGuardarComo.tsx` ampliados para navegar jerarquia con breadcrumb, alternar tiles vs lista, ordenar y filtrar por nombre; `DialogoBuscarCosas.tsx` nuevo (Ctrl+F) con tabla "Elemento | Ubicacion", filtro por tipo y navegacion al OPD; `PanelCarpetas.tsx` nuevo como panel reusable; entrada "Buscar cosas (Ctrl+F)" en `MenuPrincipal.tsx`; tests unit + store + smoke.

**Fuera de slice**: cualquier permiso O/W/R, ACL, multi-usuario, candado read-only, lectura automatica de carpeta (HU-31.008/.014-021/.024-025); cut/paste de carpetas (HU-31.011/.012); drag-and-drop de carpetas (HU-31.013); ejemplos globales/organizacionales (HU-30.021/.022); versiones, archivado, log-scale (HU-30.023-027); mover modelos entre carpetas via cut/paste o drag (HU-35.001-007); biblioteca lateral (HU-35.016/.017); busqueda global cross-folder con ≥3 chars (HU-30.029); panel "Cosas arrastrables".

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-31.002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-31-persistencia-folders.md` | Vista Home con Modelos Recientes y carpetas de primer nivel. |
| HU-31.003 | idem | Seleccionar carpeta con clic simple. |
| HU-31.004 | idem | Abrir carpeta doble clic o boton. |
| HU-31.005 | idem | Navegar atras con flecha breadcrumb. |
| HU-31.006 | idem | Breadcrumb con ruta completa. |
| HU-31.007 | idem | Crear carpeta nueva con input inline. |
| HU-31.009 | idem | Renombrar carpeta seleccionada. |
| HU-31.010 | idem | Eliminar carpeta con confirmacion (cascada o bloqueo si tiene contenido). |
| HU-31.022 | idem | Alternar tiles vs lista. |
| HU-31.023 | idem | Ordenar columnas en lista. |
| HU-31.026 | idem | Menu contextual sobre carpeta. |
| HU-35.008 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-35-persistencia-mover-buscar.md` | Ctrl+F abre dialogo "Buscar Cosas del Modelo". |
| HU-35.009 | idem | Boton equivalente en barra secundaria. |
| HU-35.010 | idem | Filtrar resultados incrementalmente por nombre. |
| HU-35.011 | idem | Filtrar resultados por tipo (Todos/Procesos/Objetos). |
| HU-35.012 | idem | Tabla "Elemento | Ubicacion" con una fila por aparicion. |
| HU-35.013 | idem | Conservar color semantico por tipo. |
| HU-35.014 | idem | Navegar al OPD del resultado con clic. |
| HU-35.015 | idem | Cerrar dialogo con boton/ESC. |
| HU-35.018 | idem | Halo temporal post-salto (3s). |
| HU-35.019 | idem | Estado vacio "Sin resultados". |
| HU-35.020 | idem | Actualizar panel OPL al saltar al OPD destino. |
| HU-30.011 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Grid Modelos Recientes en dialogo. |
| HU-30.013 | idem | Confirmacion toast "guardado exitosamente" (consolidar si esta parcial). |
| HU-30.028 | idem | Buscar modelos por nombre (filtro local en dialogo cargar). |
| HU-30.034 | idem | Glifos editable/autosalvado en tiles (sin candado de permisos). |
| HU-30.035 | idem | Autosalvado cada 5 minutos con glifo circular. |

## 3. Anclaje a evidencia

- **SSOT**: la persistencia no esta normada por SSOT; mantener invariante "modelo serializable lossless" segun `metodologia-opm-es.md` §15. La organizacion en carpetas es semantica de UI, no de modelo.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/dialogs/load-model-dialog/load-model-dialog.component.ts` (estructura del dialogo de carga), `src/app/rappid-components/services/storage/` (capa de almacenamiento), `src/app/dialogs/folder-picker/folder-picker.component.ts` si existe (selector de carpeta destino), `src/app/services/save-search/` (busqueda).
  - `opm-extracted/INDEX.md` mapea componentes de breadcrumb (`BreadcrumbComponent`), tiles (`ModelTileComponent`), gestion de carpetas (`FolderManagementComponent`).
  - `assets/svg/folder.svg`, `assets/svg/regFile.svg`, `assets/svg/delete.svg` ya existen para iconografia. No redibujar.
  - `docs/JOYAS.md` §1 fija colores de objeto/proceso para HU-35.013.
- **Estado actual del codigo (post-ronda 5)**:
  - `app/src/persistencia/workspace.ts` (51 LOC) tiene `WorkspaceIndice` plano (sin carpetas) y operaciones `cargarIndice`, `crearEntrada`, `actualizarEntrada`, `eliminarEntrada`. Extender con `carpetas` manteniendo retrocompatibilidad.
  - `app/src/persistencia/local.ts` (183 LOC) hidrata legacy con `descripcion = ""`. Agregar `carpetaId` opcional con default `null` (raiz).
  - `app/src/ui/DialogoCargarModelo.tsx`, `app/src/ui/DialogoGuardarComo.tsx` ya existen (ronda 5). Hoy listan modelos planos y permiten elegir nombre/descripcion.
  - `app/src/ui/MenuPrincipal.tsx` (103 LOC) tiene entradas Nuevo/Guardar como/Cargar. Agregar "Buscar cosas (Ctrl+F)".
  - `app/src/store.ts` (1616 LOC) ya tiene `guardarLocal`, `cargarLocal`, `dirty` derivado contra snapshot. El autosalvado se cuelga sobre estas operaciones.
  - `app/src/ui/Toolbar.tsx` puede mostrar indicador discreto de autosalvado si lo decide la linea.
  - `app/src/ui/Dialogo.tsx`, `DialogoConfirmacion.tsx`, `ConfirmacionContext.tsx` existen para reusar el modal base y la confirmacion de eliminacion.

## 4. Archivos permitidos

```text
app/src/persistencia/workspace.ts            EDIT aditivo (carpetas e indice extendido)
app/src/persistencia/local.ts                EDIT aditivo (carpetaId, ultimaApertura, autosalvado)
app/src/persistencia/local.test.ts           EDIT aditivo
app/src/persistencia/autosalvado.ts          NUEVO
app/src/persistencia/autosalvado.test.ts     NUEVO
app/src/serializacion/json.ts                EDIT aditivo (modelo.carpetaId opcional)
app/src/serializacion/json.test.ts           EDIT aditivo
app/src/store.ts                             EDIT aditivo (carpetas, busqueda intra, autosalvado state)
app/src/store.test.ts                        EDIT aditivo
app/src/ui/MenuPrincipal.tsx                 EDIT aditivo (entrada Buscar cosas)
app/src/ui/Toolbar.tsx                       EDIT aditivo opcional (indicador autosalvado discreto)
app/src/ui/App.tsx                           EDIT aditivo (montar DialogoBuscarCosas)
app/src/ui/DialogoCargarModelo.tsx           EDIT aditivo fuerte
app/src/ui/DialogoGuardarComo.tsx            EDIT aditivo (selector carpeta destino)
app/src/ui/DialogoBuscarCosas.tsx            NUEVO
app/src/ui/PanelCarpetas.tsx                 NUEVO (componente reusable con breadcrumb + lista)
app/src/render/jointjs/proyeccion.ts         LECTURA o aditivo acotado (halo temporal post-salto si requiere proyeccion)
app/e2e/opm-smoke.spec.ts                    EDIT aditivo
assets/svg/folder.svg                        LECTURA canonica
assets/svg/regFile.svg                       LECTURA canonica
assets/svg/delete.svg                        LECTURA canonica
opm-extracted/**                             LECTURA
docs/JOYAS.md                                LECTURA
```

## 5. Restricciones de no-colision

- No tocar `AsistenteNuevoModelo.tsx` (L3), `MapaSistema.tsx` ni `GestionArbolOpd.tsx` (L5), `TablaEnlaces.tsx` ni `StyleControls.tsx` (L6), `PanelOpl.tsx` ni `app/src/opl/` (L2), `app/src/modelo/operaciones.ts` (compartido).
- No introducir backend, Firebase, auth, Drive, ni cualquier dependencia de red.
- No introducir libreria de date utils si no es necesaria; usar `Date.now()` y `Intl.DateTimeFormat` nativos.
- No introducir DnD library ni cut/paste de carpetas; lo unico aceptable para mover modelos a carpetas es el selector en "Guardar como" o el menu contextual con dialogo.
- `Ctrl+F` debe interceptarse a nivel global solo cuando el panel OPL no este capturandolo; coordinar con L2 para evitar choque (L2 puede usar `Ctrl+Shift+F` para busqueda dentro del OPL).
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- Mantener legacy: modelos sin `carpetaId` se hidratan con `carpetaId = null` (raiz "Inicio / Modelos locales") y siguen apareciendo correctamente.

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo opcional):

```ts
export interface CarpetaIndice {
  id: Id;
  nombre: string;
  padreId: Id | null;     // null = raiz
  creadoEn: number;
}
```

`modelo.carpetaId?: Id | null` — opcional; si esta ausente, es raiz.

### Operaciones

Sin operaciones nuevas en `operaciones.ts`. La gestion de carpetas vive en `persistencia/workspace.ts`.

### Persistencia

`workspace.ts`:

```ts
export interface WorkspaceIndice {
  modelos: ModeloIndice[];
  carpetas: CarpetaIndice[];     // nuevo, default []
  recientes: Id[];               // ids de modelos en orden de apertura, max 10
}

export function crearCarpeta(indice: WorkspaceIndice, nombre: string, padreId: Id | null): Resultado<{ indice: WorkspaceIndice; carpeta: CarpetaIndice }>;
export function renombrarCarpeta(indice: WorkspaceIndice, carpetaId: Id, nombre: string): Resultado<WorkspaceIndice>;
export function eliminarCarpeta(indice: WorkspaceIndice, carpetaId: Id, opciones: { cascada: boolean }): Resultado<WorkspaceIndice>;
export function moverModeloACarpeta(indice: WorkspaceIndice, modeloId: Id, carpetaId: Id | null): Resultado<WorkspaceIndice>;
export function listarHijosDeCarpeta(indice: WorkspaceIndice, carpetaId: Id | null): { carpetas: CarpetaIndice[]; modelos: ModeloIndice[] };
export function rutaDeCarpeta(indice: WorkspaceIndice, carpetaId: Id | null): CarpetaIndice[];   // breadcrumb
```

Reglas:
- Renombrar: unicidad por carpeta padre; rechaza nombre vacio.
- Eliminar con `cascada: false` y carpeta no vacia -> error con conteo de hijos.
- Eliminar con `cascada: true` elimina recursivamente carpetas y referencias `modelo.carpetaId` apuntando a ellas (el modelo permanece pero queda en raiz para no destruir trabajo).
- Mover modelo a carpeta inexistente -> error.

`autosalvado.ts`:

```ts
export interface AutosalvadoControl {
  iniciar(intervaloMs?: number): void;     // default 5*60*1000
  detener(): void;
  ultimoSalvado: number | null;
  salvandoAhora: boolean;
}

export function crearAutosalvado(opts: {
  esDirty: () => boolean;
  ejecutarSalvado: () => Promise<void>;
  intervaloMs?: number;
}): AutosalvadoControl;
```

Idempotente: si esta salvando, ignora ticks; si no esta dirty, no hace nada (HU-30.035).

`local.ts` (aditivo): `modelo.ultimaApertura` y `modelo.autosalvado` opcionales en el tile.

### Serializacion

`json.ts` (aditivo): `modelo.carpetaId` opcional con default `null`. Sin cambios en `entidades`/`enlaces`/`opds`. Test roundtrip lossless.

### Store

```ts
// Carpetas
crearCarpetaEnActual(nombre: string): void;
renombrarCarpetaEnIndice(carpetaId: Id, nombre: string): void;
eliminarCarpetaEnIndice(carpetaId: Id, opciones: { cascada: boolean }): Promise<void>;   // confirmacion
abrirCarpeta(carpetaId: Id | null): void;        // navegacion del dialogo

// Busqueda intra-modelo
busquedaCosasAbierta: boolean;
busquedaCosasQuery: string;
busquedaCosasFiltro: "todos" | "procesos" | "objetos";
abrirBusquedaCosas(): void;
cerrarBusquedaCosas(): void;
fijarBusquedaCosasQuery(q: string): void;
fijarBusquedaCosasFiltro(filtro: "todos" | "procesos" | "objetos"): void;
saltarAResultadoBusqueda(entidadId: Id, opdId: Id): void;     // navega + halo 3s

// Autosalvado
autosalvado: { activo: boolean; ultimo: number | null; salvando: boolean };
iniciarAutosalvado(): void;
detenerAutosalvado(): void;
```

Atajo `Ctrl+F` (Cmd+F en macOS): listener global cuando el foco no esta en input de OPL (delegar deteccion a un selector seguro). `ESC` cierra modal.

### Render

Halo post-salto (HU-35.018): aplicar via `proyeccion.ts` agregando un overlay temporal vinculado a `entidadIdHalo`/`opdIdHalo`/`expiraEn`. Limpiar via timeout. Si esto requiere editar `proyeccion.ts`, mantener cambio acotado.

### UX

`PanelCarpetas.tsx`:

- Recibe `indice`, `carpetaActualId`, callbacks (abrir, crear, renombrar, eliminar, abrirModelo).
- Muestra breadcrumb (Inicio / A / B / C). Cada segmento es navegable.
- Lista hijos: carpetas (icono `folder.svg`) + modelos (icono `regFile.svg`). Modo tiles o lista (toggle).
- En lista: columnas Nombre, Ultima apertura, Tipo (carpeta/modelo). Clic en cabecera ordena.
- Caja de busqueda local filtra subcadena (HU-30.028).
- Boton "Nueva carpeta" abre input inline.
- Menu contextual sobre carpeta (clic derecho): Renombrar, Eliminar.
- Glifo "autosalvado" sobre tile si `modelo.autosalvado === true` (HU-30.034).

`DialogoCargarModelo.tsx`:

- Embebe `PanelCarpetas` en modo "carga" (doble clic en modelo lo abre).
- Grid lateral "Modelos Recientes" (HU-30.011) con ultimos 10 abiertos.
- Estado vacio "Sin modelos en esta carpeta".

`DialogoGuardarComo.tsx`:

- Embebe `PanelCarpetas` en modo "selector destino" (selecciona carpeta donde guardar).
- Inputs Nombre, Descripcion (ya existentes).
- Boton Guardar requiere nombre + carpeta destino (default: carpeta actual visible).

`DialogoBuscarCosas.tsx`:

- Modal nuevo, ocupa centro de pantalla.
- Caja de busqueda con focus automatico.
- Dropdown "Filtro por tipo" (Todos/Procesos/Objetos).
- Tabla de resultados (Elemento | Ubicacion). Color verde lima objetos, cyan procesos (HU-35.013).
- Mensaje "Sin resultados" si vacio (HU-35.019).
- Clic en fila: navega al OPD destino (`opdActivoId`), aplica halo 3s (HU-35.018), actualiza panel OPL automaticamente (HU-35.020 — esto ya pasa por reactividad de Zustand, verificar).
- Cierre con boton o ESC (HU-35.015).
- Atajo Ctrl+F abre el modal; si modal abierto, ESC cierra.

`MenuPrincipal.tsx`: agregar entrada "Buscar cosas (Ctrl+F)".

`Toolbar.tsx`: indicador de autosalvado opcional (icono pequeno con tooltip "Autosalvado activo / ultimo: hh:mm").

### Cross-capa

- Atajos globales en `App.tsx` o en hook propio: Ctrl+F abre busqueda intra-modelo; coordinacion con L2 (que puede usar Ctrl+Shift+F para OPL local).
- `ConfirmacionContext` se reutiliza para "Eliminar carpeta no vacia" y "Cancelar guardado con cambios".
- `iniciarAutosalvado` se llama desde `App.tsx` al montar y `detenerAutosalvado` al desmontar.
- El indice se persiste a `localStorage` despues de cada operacion exitosa (mismo patron que ronda 5).

## 7. Tests obligatorios

- Unit workspace: `crearCarpeta` con padre nulo crea carpeta raiz; con padre existente, hija; con nombre duplicado en mismo padre, falla.
- Unit workspace: `renombrarCarpeta` valida unicidad por padre.
- Unit workspace: `eliminarCarpeta` con `cascada: false` falla si tiene hijos; con `cascada: true` elimina recursivamente y reasigna modelos a raiz.
- Unit workspace: `moverModeloACarpeta` con id valido cambia `carpetaId`; con carpeta inexistente, falla.
- Unit workspace: `listarHijosDeCarpeta(null)` devuelve hijos de raiz; orden alfabetico estable.
- Unit workspace: `rutaDeCarpeta` devuelve breadcrumb correcto en jerarquia de >= 3 niveles.
- Unit autosalvado: timer dispara al intervalo, salta si no dirty, salta si esta salvando, libera `salvandoAhora` post-salvado.
- Unit serializacion: `modelo.carpetaId` opcional roundtrip lossless; legacy sin `carpetaId` hidrata como `null`.
- Store: `crearCarpetaEnActual` agrega carpeta visible en `PanelCarpetas`.
- Store: `eliminarCarpetaEnIndice` con cascada elimina recursivamente y modelos quedan en raiz.
- Store: `abrirBusquedaCosas` setea estado UI; `fijarBusquedaCosasQuery` filtra entidades; `saltarAResultadoBusqueda` cambia `opdActivoId` y aplica halo (verificar via selector).
- Store: `iniciarAutosalvado` activa timer; `detenerAutosalvado` lo apaga; mocking de `setInterval`/`clearInterval`.
- Component/UI: breadcrumb navegable; tiles vs lista alterna; ordenar columnas; menu contextual sobre carpeta; modal de busqueda con tabla de resultados.
- Smoke: crear carpeta "Demo", crear modelo dentro, navegar atras, verificar tile; abrir Ctrl+F, buscar "Pro", clicar resultado, verificar OPD activo cambio.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Workspace local sin permisos: la jerarquia es navegable pero no hay O/W/R, candado, ni multi-usuario.
- Cut/paste y drag-and-drop de carpetas o modelos quedan fuera; mover modelos solo via "Guardar como" o menu contextual con selector.
- Versiones, archivado, log-scale: fuera.
- Ejemplos globales/organizacionales: fuera.
- Autosalvado intervalo fijo de 5 minutos; configurable queda fuera.
- Ctrl+F intercepta solo cuando OPL no captura el atajo; L2 documenta su atajo coordinado.
- El modelo importado por L2 ronda 5 sigue mostrando "(No guardado)" hasta que el usuario lo guarde explicitamente; el autosalvado **no** autopersiste un modelo importado (solo persiste modelos ya guardados con id).

## 10. Decisiones que tomas vos (documentar en commit)

- Si las carpetas se almacenan en el mismo `localStorage` key que los modelos o en una key separada `opm-workspace-carpetas-v1`. Preferir misma key con campo `carpetas` para atomicidad.
- Si "Eliminar carpeta no vacia" ofrece dos botones (Mover hijos a raiz / Eliminar todo en cascada) o solo uno con confirmacion. Preferir dos botones.
- Si el grid "Modelos Recientes" vive en columna izquierda permanente o como tab. Preferir columna izquierda.
- Si la busqueda intra-modelo incluye estados y atributos o solo entidades top-level. Recomendar solo entidades en este slice.
- Como visualizar el halo temporal: pulse de 0.6s + halo persistente de 3s, o stroke amarillo grueso. Documentar.
- Cuando arranca el autosalvado: al primer save manual o al cargar el modelo. Preferir al primer save (modelos importados o nuevos sin save no autopersisten).
- Nombre del icono indicador en Toolbar (si se incluye); preferir "Autosalvado activo · hh:mm" en tooltip.

## 11. Forma del entregable

Commits sugeridos:

- `feat(persistencia): introduce jerarquia de carpetas en workspace local`
- `feat(ui): navegacion de carpetas con breadcrumb y vistas tiles/lista`
- `feat(ui): dialogo Buscar Cosas (Ctrl+F) con filtros y navegacion al opd`
- `feat(persistencia): habilita autosalvado periodico con glifo`
- `test(workspace): cubre carpetas, busqueda intra y autosalvado`

Co-author footer estandar si aplica al implementador. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas y bloqueos.
