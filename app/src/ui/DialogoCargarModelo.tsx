// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import autosaveIcon from "../../../assets/svg/autosave.svg";
import lockIcon from "../../../assets/svg/lock.svg";
import verFileIcon from "../../../assets/svg/verFile.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/modelos";
import type { CarpetaIndice } from "../persistencia/workspace";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useZustandWorkspacePort } from "../app/ports/zustandWorkspacePort";
import { useOpmStore } from "../store";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { iniciarDragWorkspace, leerDragWorkspace } from "./panelCarpetas/handlersDragDrop";
import { PersistenciaJson } from "./PersistenciaJson";
import { tokens } from "./tokens";

/**
 * Diálogo «Modelos». Higiene del gestor (spec 2026-07-06 chrome-gestion-design
 * §1 + puerta steve-jobs): un solo buscador, sidebar mínima de carpetas, «Importar
 * JSON» como acción del encabezado (no sección), estado vacío con CTA, footer con
 * primario visual, catálogo como lista única (sin vista tarjetas ni botón «Abrir»
 * por fila — se abre por doble-click de fila o por el primario del footer).
 * Persistencia/carga: [Met §6].
 */
export function DialogoCargarModelo() {
  const persistencia = useZustandPersistencePort();
  const workspace = useZustandWorkspacePort();
  const confirmarSiDirty = useConfirmarSiDirty();
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const [seleccionadoId, setSeleccionadoId] = useState<Id | null>(null);
  const [orden, setOrden] = useState<OrdenCargar>(() => leerOrdenCargar());
  const [query, setQuery] = useState("");
  const [menuAccionesId, setMenuAccionesId] = useState<Id | null>(null);
  const [importarAbierto, setImportarAbierto] = useState(false);
  const [creandoCarpeta, setCreandoCarpeta] = useState(false);
  const [nombreCarpetaNueva, setNombreCarpetaNueva] = useState("");
  const [renombrandoCarpetaId, setRenombrandoCarpetaId] = useState<Id | null>(null);
  const [nombreCarpetaRenombrar, setNombreCarpetaRenombrar] = useState("");

  useEffect(() => {
    if (!persistencia.dialogoCargarModeloAbierto) return;
    persistencia.listarModelosGuardados();
    setQuery("");
    setSeleccionadoId(null);
    setMenuAccionesId(null);
    setImportarAbierto(false);
    setCreandoCarpeta(false);
    setNombreCarpetaNueva("");
    setRenombrandoCarpetaId(null);
  }, [persistencia.dialogoCargarModeloAbierto, persistencia.listarModelosGuardados]);

  // «Archivo» = lente de archivados sobre el ámbito actual (activa el flag del
  // store); «Todas»/carpetas lo desactivan.
  const enArchivo = workspace.mostrarArchivados;

  const hijos = useMemo(
    () => workspace.listarHijosActuales({ incluirArchivados: enArchivo }),
    [workspace.indice, workspace.carpetaActualId, workspace.modelosGuardados, enArchivo],
  );

  const modelosCatalogo = useMemo(
    () => ordenarModelos(
      hijos.modelos.filter((modelo) => (enArchivo ? modelo.archivado === true : true) && coincideBusqueda(modelo, query)),
      orden,
    ),
    [hijos.modelos, orden, query, enArchivo],
  );
  const seleccionado = modelosCatalogo.find((modelo) => modelo.id === seleccionadoId) ?? null;

  const carpetasOrdenadas = useMemo(
    () => ordenarCarpetasJerarquia(workspace.indice.carpetas.filter((carpeta) => !carpeta.archivada)),
    [workspace.indice.carpetas],
  );

  const raizActiva = !enArchivo && workspace.carpetaActualId === null;
  const carpetaActiva = useCallback(
    (carpetaId: Id) => !enArchivo && workspace.carpetaActualId === carpetaId,
    [enArchivo, workspace.carpetaActualId],
  );

  const alternarOrden = useCallback((columna: OrdenCargar["columna"]) => {
    setOrden((actual) => {
      const siguiente: OrdenCargar = actual.columna === columna
        ? { columna, direccion: actual.direccion === "asc" ? "desc" : "asc" }
        : { columna, direccion: columna === "nombre" ? "asc" : "desc" };
      escribirOrdenCargar(siguiente);
      return siguiente;
    });
  }, []);
  const abrirSeleccionado = useCallback((modeloId: Id | null) => {
    if (!modeloId) return;
    confirmarSiDirty(() => persistencia.cargarLocal(modeloId));
  }, [confirmarSiDirty, persistencia.cargarLocal]);

  // Navegación de la sidebar. «Archivo» prende el flag; «Todas»/carpetas lo
  // apagan antes de cambiar de carpeta (el port solo expone el toggle).
  const irARaiz = useCallback(() => {
    if (workspace.mostrarArchivados) workspace.toggleMostrarArchivados();
    workspace.abrirCarpeta(null);
  }, [workspace.mostrarArchivados, workspace.toggleMostrarArchivados, workspace.abrirCarpeta]);
  const irACarpeta = useCallback((carpetaId: Id) => {
    if (workspace.mostrarArchivados) workspace.toggleMostrarArchivados();
    workspace.abrirCarpeta(carpetaId);
  }, [workspace.mostrarArchivados, workspace.toggleMostrarArchivados, workspace.abrirCarpeta]);
  const irAArchivo = useCallback(() => {
    if (!workspace.mostrarArchivados) workspace.toggleMostrarArchivados();
  }, [workspace.mostrarArchivados, workspace.toggleMostrarArchivados]);

  // Arrastrar un modelo (tile/fila) a una carpeta de la sidebar lo mueve.
  const iniciarDragModelo = useCallback((event: DragEvent, modeloId: Id) => {
    iniciarDragWorkspace(event, { tipo: "modelo", itemId: modeloId });
  }, []);
  const permitirDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);
  const soltarEnCarpeta = useCallback((event: DragEvent, carpetaDestinoId: Id | null) => {
    event.preventDefault();
    const payload = leerDragWorkspace(event);
    if (payload?.tipo === "modelo") workspace.moverModeloDirecto(payload.itemId, carpetaDestinoId);
  }, [workspace.moverModeloDirecto]);

  const confirmarCrearCarpeta = useCallback(() => {
    const limpio = nombreCarpetaNueva.trim();
    if (limpio) workspace.crearCarpetaEnActual(limpio);
    setCreandoCarpeta(false);
    setNombreCarpetaNueva("");
  }, [nombreCarpetaNueva, workspace.crearCarpetaEnActual]);
  const iniciarRenombrarCarpeta = useCallback((carpeta: CarpetaIndice) => {
    setRenombrandoCarpetaId(carpeta.id);
    setNombreCarpetaRenombrar(carpeta.nombre);
  }, []);
  const confirmarRenombrarCarpeta = useCallback(() => {
    if (renombrandoCarpetaId) {
      const limpio = nombreCarpetaRenombrar.trim();
      if (limpio) workspace.renombrarCarpetaEnIndice(renombrandoCarpetaId, limpio);
    }
    setRenombrandoCarpetaId(null);
  }, [renombrandoCarpetaId, nombreCarpetaRenombrar, workspace.renombrarCarpetaEnIndice]);

  // «Nuevo modelo» del estado vacío: el puerto de persistencia no expone la
  // acción; se toma del store y se envuelve en confirmarSiDirty (mismo patrón
  // que «Abrir en pestaña nueva»).
  const crearNuevoModelo = useCallback(() => {
    confirmarSiDirty(() => nuevoModelo());
    persistencia.cerrarCargarModelo();
  }, [confirmarSiDirty, nuevoModelo, persistencia.cerrarCargarModelo]);

  // Acciones por modelo: solo se exponen operaciones que el dominio ya soporta
  // (cargar, abrir en pestaña, versiones, archivar/restaurar, eliminar). No se
  // ofrece duplicar/renombrar-por-id porque no existe acción de store por id.
  const acciones = useMemo<AccionesModelo>(() => ({
    onAbrir: abrirSeleccionado,
    onAbrirEnPestana: (modeloId) => {
      confirmarSiDirty(() => workspace.abrirPestanaConModelo(modeloId));
      persistencia.cerrarCargarModelo();
    },
    onVersiones: (modeloId) => workspace.abrirDialogoVersiones(modeloId),
    onArchivar: (modeloId) => workspace.archivarModeloPorId(modeloId),
    onRestaurar: (modeloId) => workspace.restaurarModeloPorId(modeloId),
    onEliminar: (modeloId, nombre) => {
      const ok = typeof globalThis.confirm !== "function"
        || globalThis.confirm(`¿Eliminar definitivamente el modelo "${nombre}"? Esta acción no se puede deshacer.`);
      if (!ok) return;
      persistencia.borrarLocal(modeloId);
      if (seleccionadoId === modeloId) setSeleccionadoId(null);
    },
  }), [
    abrirSeleccionado,
    confirmarSiDirty,
    persistencia.cerrarCargarModelo,
    persistencia.borrarLocal,
    seleccionadoId,
    workspace.abrirPestanaConModelo,
    workspace.abrirDialogoVersiones,
    workspace.archivarModeloPorId,
    workspace.restaurarModeloPorId,
  ]);

  const menuProps: MenuAccionesContexto = {
    abiertoId: menuAccionesId,
    onToggle: (modeloId) => setMenuAccionesId((actual) => (actual === modeloId ? null : modeloId)),
    onCerrar: () => setMenuAccionesId(null),
    acciones,
  };

  return (
    <Dialogo
      open={persistencia.dialogoCargarModeloAbierto}
      title="Modelos"
      onCancel={persistencia.cerrarCargarModelo}
      size="xl"
      testId="dialogo-abrir-importar"
      actions={(
        <>
          <DialogoAccion onClick={persistencia.cerrarCargarModelo}>Cancelar</DialogoAccion>
          <DialogoAccion tono="primaria" disabled={!seleccionado} onClick={() => abrirSeleccionado(seleccionado?.id ?? null)}>Abrir</DialogoAccion>
        </>
      )}
    >
      <div style={style.container}>
        <aside style={style.sidebar}>
          <nav style={style.sidebarLista} aria-label="Carpetas">
            <button
              type="button"
              data-testid="gestor-sidebar-todas"
              style={raizActiva ? style.sidebarItemActivo : style.sidebarItem}
              aria-current={raizActiva ? "true" : undefined}
              onClick={irARaiz}
              onDragOver={permitirDrop}
              onDrop={(event) => soltarEnCarpeta(event as unknown as DragEvent, null)}
            >
              Todas
            </button>

            {carpetasOrdenadas.map(({ carpeta, nivel }) => (
              renombrandoCarpetaId === carpeta.id ? (
                <input
                  key={carpeta.id}
                  type="text"
                  style={{ ...style.sidebarInput, marginLeft: `${nivel * 12}px` }}
                  value={nombreCarpetaRenombrar}
                  onInput={(event) => setNombreCarpetaRenombrar(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") confirmarRenombrarCarpeta();
                    if (event.key === "Escape") setRenombrandoCarpetaId(null);
                  }}
                  onBlur={confirmarRenombrarCarpeta}
                  autoFocus
                />
              ) : (
                <button
                  key={carpeta.id}
                  type="button"
                  data-testid="gestor-sidebar-carpeta"
                  style={{ ...(carpetaActiva(carpeta.id) ? style.sidebarItemActivo : style.sidebarItem), paddingLeft: `${10 + nivel * 12}px` }}
                  aria-current={carpetaActiva(carpeta.id) ? "true" : undefined}
                  title={carpeta.nombre}
                  onClick={() => irACarpeta(carpeta.id)}
                  onDblClick={() => iniciarRenombrarCarpeta(carpeta)}
                  onDragOver={permitirDrop}
                  onDrop={(event) => soltarEnCarpeta(event as unknown as DragEvent, carpeta.id)}
                >
                  {carpeta.nombre}
                </button>
              )
            ))}

            <button
              type="button"
              data-testid="gestor-sidebar-archivo"
              style={enArchivo ? style.sidebarItemActivo : style.sidebarItem}
              aria-current={enArchivo ? "true" : undefined}
              onClick={irAArchivo}
            >
              Archivo
            </button>
          </nav>
          <div style={style.sidebarFoot}>
            {creandoCarpeta ? (
              <input
                type="text"
                style={style.sidebarInput}
                placeholder="Nombre de carpeta"
                value={nombreCarpetaNueva}
                onInput={(event) => setNombreCarpetaNueva(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") confirmarCrearCarpeta();
                  if (event.key === "Escape") { setCreandoCarpeta(false); setNombreCarpetaNueva(""); }
                }}
                onBlur={confirmarCrearCarpeta}
                autoFocus
              />
            ) : (
              <button type="button" style={style.sidebarNueva} onClick={() => setCreandoCarpeta(true)}>+ Nueva carpeta</button>
            )}
          </div>
        </aside>

        <div style={style.main}>
          {/* La barra de catálogo (buscar · vistas · Importar JSON) solo aparece
              cuando hay sobre qué actuar: con modelos, con búsqueda activa (para
              poder limpiarla en «Sin resultados») o en la lente «Archivo». En el
              vacío de primer uso, el estado vacío queda dueño del panel con su
              par de fundación centrado. */}
          {(modelosCatalogo.length > 0 || query || enArchivo) ? (
            <div style={style.toolbar}>
              <input
                type="search"
                aria-label="Buscar modelos por nombre"
                placeholder="Buscar por nombre o descripción…"
                style={style.searchInput}
                value={query}
                onInput={(event) => setQuery(event.currentTarget.value)}
              />
              <button
                type="button"
                data-testid="abrir-importar-json"
                style={importarAbierto ? style.headerActionActiva : style.headerAction}
                aria-pressed={importarAbierto}
                onClick={() => setImportarAbierto((valor) => !valor)}
              >
                Importar JSON
              </button>
            </div>
          ) : null}

          {importarAbierto ? (
            <div style={style.importSurface} data-testid="panel-json-abrir-importar">
              <PersistenciaJson mostrarModelosLocales={false} onImported={persistencia.cerrarCargarModelo} />
            </div>
          ) : null}

          <div style={style.catalogo}>
            <TablaModelos
              modelos={modelosCatalogo}
              seleccionadoId={seleccionadoId}
              orden={orden}
              mostrarVersiones={workspace.mostrarVersiones}
              onOrden={alternarOrden}
              onSeleccionar={setSeleccionadoId}
              onAbrir={abrirSeleccionado}
              onIniciarDrag={iniciarDragModelo}
              menu={menuProps}
            />
            {modelosCatalogo.length === 0 ? (
              <div style={style.empty} data-testid="gestor-vacio">
                {query ? (
                  <>
                    <span style={style.emptyText}>Sin resultados para «{query}».</span>
                    <button type="button" style={style.emptyLink} onClick={() => setQuery("")}>Limpiar búsqueda</button>
                  </>
                ) : enArchivo ? (
                  <span style={style.emptyText}>No hay modelos archivados.</span>
                ) : (
                  <>
                    <span style={style.emptyText}>Aún no hay modelos. Crea uno nuevo o importa un JSON.</span>
                    <div style={style.emptyCtas}>
                      <button type="button" style={style.emptyCta} onClick={crearNuevoModelo}>Nuevo modelo</button>
                      <button type="button" data-testid="abrir-importar-json" style={style.emptyCta} onClick={() => setImportarAbierto(true)}>Importar JSON</button>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Dialogo>
  );
}

type OrdenCargar = { columna: "nombre" | "descripcion" | "actualizadoEn" | "bytes"; direccion: "asc" | "desc" };
let ordenCargarMemoria: OrdenCargar = { columna: "actualizadoEn", direccion: "desc" };

interface AccionesModelo {
  onAbrir: (id: Id) => void;
  onAbrirEnPestana: (id: Id) => void;
  onVersiones: (id: Id) => void;
  onArchivar: (id: Id) => void;
  onRestaurar: (id: Id) => void;
  onEliminar: (id: Id, nombre: string) => void;
}

interface MenuAccionesContexto {
  abiertoId: Id | null;
  onToggle: (id: Id) => void;
  onCerrar: () => void;
  acciones: AccionesModelo;
}

/**
 * Ordena las carpetas como lista plana indentada por profundidad (DFS ligero
 * por `padreId`, hermanas ordenadas por nombre). No construye un árbol de
 * componentes pesado: solo calcula `{ carpeta, nivel }` para pintar una fila
 * por carpeta con sangría.
 */
function ordenarCarpetasJerarquia(carpetas: CarpetaIndice[]): Array<{ carpeta: CarpetaIndice; nivel: number }> {
  const porPadre = new Map<Id | null, CarpetaIndice[]>();
  for (const carpeta of carpetas) {
    const clave = carpeta.padreId;
    const grupo = porPadre.get(clave) ?? [];
    grupo.push(carpeta);
    porPadre.set(clave, grupo);
  }
  for (const grupo of porPadre.values()) grupo.sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"));
  const resultado: Array<{ carpeta: CarpetaIndice; nivel: number }> = [];
  const visitar = (padreId: Id | null, nivel: number) => {
    for (const carpeta of porPadre.get(padreId) ?? []) {
      resultado.push({ carpeta, nivel });
      visitar(carpeta.id, nivel + 1);
    }
  };
  visitar(null, 0);
  return resultado;
}

/** Menú de acciones por modelo. Solo expone lo que el dominio ya soporta. */
function MenuAccionesModelo(props: { modelo: ResumenModeloPersistido; menu: MenuAccionesContexto }) {
  const { modelo, menu } = props;
  const abierto = menu.abiertoId === modelo.id;
  return (
    <span style={style.accionesCelda} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        data-testid="modelo-acciones-toggle"
        style={style.accionesToggle}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label={`Acciones de ${modelo.nombre}`}
        title="Acciones del modelo"
        onClick={(event) => { event.stopPropagation(); menu.onToggle(modelo.id); }}
      >
        Acciones <span aria-hidden="true">▾</span>
      </button>
      {abierto ? (
        <div role="menu" style={style.accionesMenu} onMouseLeave={menu.onCerrar} data-testid="modelo-acciones-menu">
          <AccionItem onClick={() => { menu.onCerrar(); menu.acciones.onAbrirEnPestana(modelo.id); }}>Abrir en pestaña nueva</AccionItem>
          <AccionItem onClick={() => { menu.onCerrar(); menu.acciones.onVersiones(modelo.id); }}>Ver versiones</AccionItem>
          {modelo.archivado
            ? <AccionItem onClick={() => { menu.onCerrar(); menu.acciones.onRestaurar(modelo.id); }}>Restaurar</AccionItem>
            : <AccionItem onClick={() => { menu.onCerrar(); menu.acciones.onArchivar(modelo.id); }}>Archivar</AccionItem>}
          <AccionItem tono="danger" onClick={() => { menu.onCerrar(); menu.acciones.onEliminar(modelo.id, modelo.nombre); }}>Eliminar…</AccionItem>
        </div>
      ) : null}
    </span>
  );
}

function AccionItem(props: { onClick: () => void; tono?: "danger"; children: preact.ComponentChildren }) {
  return (
    <button
      type="button"
      role="menuitem"
      style={props.tono === "danger" ? style.accionItemDanger : style.accionItem}
      onClick={(event) => { event.stopPropagation(); props.onClick(); }}
    >
      {props.children}
    </button>
  );
}

function TablaModelos(props: {
  modelos: ResumenModeloPersistido[];
  seleccionadoId: Id | null;
  orden: OrdenCargar;
  mostrarVersiones: boolean;
  onOrden: (columna: OrdenCargar["columna"]) => void;
  onSeleccionar: (id: Id) => void;
  onAbrir: (id: Id) => void;
  onIniciarDrag: (event: DragEvent, id: Id) => void;
  menu: MenuAccionesContexto;
}) {
  return (
    <table style={style.table}>
      <thead>
        <tr>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("nombre")}>Nombre {marcaOrden(props.orden, "nombre")}</button></th>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("descripcion")}>Descripción {marcaOrden(props.orden, "descripcion")}</button></th>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("actualizadoEn")}>Modificado {marcaOrden(props.orden, "actualizadoEn")}</button></th>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("bytes")}>Tamaño {marcaOrden(props.orden, "bytes")}</button></th>
          <th style={style.th}>Marcas</th>
          <th style={style.th}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {props.modelos.map((modelo) => (
          <tr
            key={modelo.id}
            style={props.seleccionadoId === modelo.id ? style.rowSeleccionada : style.row}
            draggable
            onDragStart={(event) => props.onIniciarDrag(event as unknown as DragEvent, modelo.id)}
            onClick={() => props.onSeleccionar(modelo.id)}
            onDblClick={() => props.onAbrir(modelo.id)}
            data-testid="modelo-fila-cargar"
          >
            <td style={style.tdStrong}>{modelo.nombre}</td>
            <td style={style.td}>{modelo.descripcion || "Sin descripción"}</td>
            <td style={style.td}>{new Date(modelo.actualizadoEn).toLocaleString("es-CL")}</td>
            <td style={style.td}>{tamanoModelo(modelo)}</td>
            <td style={style.td}><Glifos modelo={modelo} mostrarVersiones={props.mostrarVersiones} /></td>
            <td style={style.td}>
              <span style={style.accionesCelda}>
                <MenuAccionesModelo modelo={modelo} menu={props.menu} />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Glifos(props: { modelo: ResumenModeloPersistido; mostrarVersiones: boolean }) {
  const versiones = props.modelo.versiones?.length ?? 0;
  return (
    <span style={style.glyphs}>
      <span title="Editable" aria-label="Editable" style={style.glyphText}>✎</span>
      {props.modelo.archivado ? <img src={lockIcon} alt="candado" style={style.glyphIcon} title="Archivado" /> : null}
      {props.modelo.autosalvado ? <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} title="Autosalvado" /> : null}
      {props.mostrarVersiones && versiones > 0 ? <img src={verFileIcon} alt={`${versiones} versiones`} style={style.glyphIcon} title={`${versiones} versiones`} /> : null}
    </span>
  );
}

function coincideBusqueda(modelo: ResumenModeloPersistido, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("es-CL");
  if (!q) return true;
  return modelo.nombre.toLocaleLowerCase("es-CL").includes(q) ||
    modelo.descripcion.toLocaleLowerCase("es-CL").includes(q);
}

function ordenarModelos(modelos: ResumenModeloPersistido[], orden: OrdenCargar): ResumenModeloPersistido[] {
  const dir = orden.direccion === "asc" ? 1 : -1;
  return [...modelos].sort((a, b) => {
    const va = valorOrden(a, orden.columna);
    const vb = valorOrden(b, orden.columna);
    return va.localeCompare(vb, "es-CL", { numeric: true }) * dir;
  });
}

function valorOrden(modelo: ResumenModeloPersistido, columna: OrdenCargar["columna"]): string {
  if (columna === "descripcion") return modelo.descripcion;
  if (columna === "actualizadoEn") return modelo.actualizadoEn;
  if (columna === "bytes") return tamanoModelo(modelo).padStart(12, "0");
  return modelo.nombre;
}

function tamanoModelo(modelo: ResumenModeloPersistido): string {
  return String(modelo.versiones?.[0]?.bytes ?? 0);
}

function marcaOrden(orden: OrdenCargar, columna: OrdenCargar["columna"]): string {
  if (orden.columna !== columna) return "";
  return orden.direccion === "asc" ? "↑" : "↓";
}

function leerOrdenCargar(): OrdenCargar {
  return ordenCargarMemoria;
}

function escribirOrdenCargar(orden: OrdenCargar): void {
  ordenCargarMemoria = orden;
}

// Codex monocromático — ink/paper, sin radius, Inria Serif, sombras planas.
// Layout de dos columnas: sidebar mínima de carpetas + catálogo/importación.
const style = {
  container: {
    display: "flex",
    gap: "16px",
    minHeight: "360px",
    alignItems: "stretch",
  },
  sidebar: {
    flex: "0 0 176px",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    borderRight: `1px solid ${tokens.colors.ink15}`,
    paddingRight: "12px",
  },
  sidebarLista: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: "1 1 auto",
    minHeight: 0,
    overflow: "auto",
  },
  sidebarItem: {
    minHeight: "30px",
    padding: "6px 10px",
    border: 0,
    borderLeft: `${tokens.stroke.bold}px solid transparent`,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 400,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition: tokens.transitions.fast,
  },
  sidebarItemActivo: {
    minHeight: "30px",
    padding: "6px 10px",
    border: 0,
    borderLeft: `${tokens.stroke.bold}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  sidebarFoot: {
    marginTop: "8px",
    paddingTop: "8px",
    borderTop: `1px solid ${tokens.colors.ink15}`,
  },
  sidebarNueva: {
    width: "100%",
    minHeight: "32px",
    border: `1px dashed ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink50,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 500,
    transition: tokens.transitions.fast,
  },
  sidebarInput: {
    width: "100%",
    height: "30px",
    border: `1px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    padding: "0 8px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    caretColor: tokens.colors.crimson,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    boxSizing: "border-box",
  },
  main: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  searchInput: {
    flex: "1 1 auto",
    minWidth: 0,
    height: "32px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    caretColor: tokens.colors.crimson,
  },
  headerAction: {
    minHeight: "32px",
    padding: "0 12px",
    border: `1px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition: tokens.transitions.fast,
  },
  headerActionActiva: {
    minHeight: "32px",
    padding: "0 12px",
    border: `1px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  importSurface: {
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    padding: "10px 12px",
    background: tokens.colors.paper,
  },
  catalogo: {
    display: "grid",
    gap: "8px",
    minHeight: "220px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    padding: "12px",
    background: tokens.colors.paper,
    alignContent: "start",
  },
  accionesCelda: { position: "relative", display: "inline-flex", alignItems: "center", gap: "6px" },
  accionesToggle: { minHeight: "28px", padding: "4px 10px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink70, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500, whiteSpace: "nowrap" },
  accionesMenu: { position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 30, minWidth: "180px", display: "grid", gap: "2px", padding: "4px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, boxShadow: tokens.shadows.flat },
  accionItem: { minHeight: "30px", padding: "0 10px", border: 0, borderRadius: 0, background: "transparent", color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500, textAlign: "left" },
  accionItemDanger: { minHeight: "30px", padding: "0 10px", border: 0, borderRadius: 0, background: "transparent", color: tokens.colors.crimson, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500, textAlign: "left" },
  glyphs: { display: "inline-flex", gap: "6px", alignItems: "center", justifySelf: "end" },
  glyphIcon: { width: "14px", height: "14px" },
  glyphText: { color: tokens.colors.ink50, fontSize: "14px", fontWeight: 600, lineHeight: 1 },
  archiveBadge: {
    position: "absolute",
    right: "8px",
    top: "8px",
    padding: "2px 6px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "10px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  th: { padding: "8px 10px", borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, color: tokens.colors.ink50, textAlign: "left", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" },
  thButton: { padding: 0, borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, textAlign: "left" },
  headerButton: { width: "100%", minHeight: "30px", border: 0, background: "transparent", color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left", cursor: "pointer", padding: "8px 10px" },
  row: { borderBottom: `1px solid ${tokens.colors.ink08}`, cursor: "pointer" },
  rowSeleccionada: { borderBottom: `1px solid ${tokens.colors.ink08}`, background: tokens.colors.ink04, cursor: "pointer" },
  td: { padding: "8px 10px", color: tokens.colors.ink70, fontWeight: 400, verticalAlign: "top" },
  tdStrong: { padding: "8px 10px", color: tokens.colors.ink, fontWeight: 600, verticalAlign: "top" },
  empty: { display: "grid", gap: "12px", justifyItems: "center", alignContent: "center", padding: "24px", border: `1px dashed ${tokens.colors.ink15}`, borderRadius: 0, textAlign: "center" },
  emptyText: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  emptyCtas: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" },
  emptyCta: {
    minHeight: "32px",
    padding: "0 14px",
    border: `1px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 600,
  },
  emptyLink: {
    minHeight: "28px",
    padding: "0 8px",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 500,
    textDecoration: "underline",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
