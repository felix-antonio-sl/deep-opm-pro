// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import autosaveIcon from "../../../assets/svg/autosave.svg";
import lockIcon from "../../../assets/svg/lock.svg";
import regFileIcon from "../../../assets/svg/regFile.svg";
import verFileIcon from "../../../assets/svg/verFile.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/modelos";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useZustandWorkspacePort } from "../app/ports/zustandWorkspacePort";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { PanelCarpetas, type VistaModo } from "./PanelCarpetas";
import { PersistenciaJson } from "./PersistenciaJson";
import { tokens } from "./tokens";

/**
 * Diálogo de carga local. Persistencia/carga: [Met §6].
 */
export function DialogoCargarModelo() {
  const persistencia = useZustandPersistencePort();
  const workspace = useZustandWorkspacePort();
  const confirmarSiDirty = useConfirmarSiDirty();
  const [modo, setModo] = useState<VistaModo>(() => leerVistaCargar());
  const [seleccionadoId, setSeleccionadoId] = useState<Id | null>(null);
  const [orden, setOrden] = useState<OrdenCargar>(() => leerOrdenCargar());
  const [query, setQuery] = useState("");
  const [menuAccionesId, setMenuAccionesId] = useState<Id | null>(null);

  useEffect(() => {
    if (!persistencia.dialogoCargarModeloAbierto) return;
	    persistencia.listarModelosGuardados();
	    setQuery("");
	    setSeleccionadoId(null);
	  }, [persistencia.dialogoCargarModeloAbierto, persistencia.listarModelosGuardados]);

  const breadcrumb = useMemo(
    () => workspace.rutaCarpetaActual(),
    [workspace.indice, workspace.carpetaActualId],
  );

  // Filtrar modelos por carpeta actual
  const hijos = useMemo(() => {
    return workspace.listarHijosActuales({ incluirArchivados: workspace.mostrarArchivados });
  }, [workspace.indice, workspace.carpetaActualId, workspace.modelosGuardados, workspace.mostrarArchivados]);

  const navegarBreadcrumb = useCallback((carpetaId: Id | null, _segmentIndex: number) => {
    workspace.abrirCarpeta(carpetaId);
  }, [workspace.abrirCarpeta]);
  const modelosCatalogo = useMemo(() => ordenarModelos(
    hijos.modelos.filter((modelo) => coincideBusqueda(modelo, query)),
    orden,
  ), [hijos.modelos, orden, query]);
  const seleccionado = modelosCatalogo.find((modelo) => modelo.id === seleccionadoId) ?? null;
  const cambiarModo = useCallback((siguiente: VistaModo) => {
    setModo(siguiente);
    escribirVistaCargar(siguiente);
  }, []);
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
      title="Abrir modelo"
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
        <div style={style.flagsBar}>
          <label style={style.flag}>
            <input type="checkbox" checked={workspace.mostrarArchivados} onChange={workspace.toggleMostrarArchivados} />
            Mostrar archivados
          </label>
          <label style={style.flag}>
            <input type="checkbox" checked={workspace.mostrarVersiones} onChange={workspace.toggleMostrarVersiones} />
            Mostrar versiones
          </label>
        </div>
        <div style={style.catalogo}>
          <div style={style.catalogoToolbar}>
            <input
              type="search"
              aria-label="Buscar modelos por nombre"
              placeholder="Buscar por nombre o descripción..."
              style={style.searchInput}
              value={query}
              onInput={(event) => setQuery(event.currentTarget.value)}
            />
            <button type="button" style={modo === "tiles" ? style.activeToggle : style.toggle} onClick={() => cambiarModo("tiles")} title="Vista de tiles" aria-label="Vista de tiles" aria-pressed={modo === "tiles"}><span aria-hidden="true">▦</span></button>
            <button type="button" style={modo === "lista" ? style.activeToggle : style.toggle} onClick={() => cambiarModo("lista")} title="Vista de lista" aria-label="Vista de lista" aria-pressed={modo === "lista"}><span aria-hidden="true">☰</span></button>
          </div>
          {modo === "lista" ? (
            <TablaModelos
              modelos={modelosCatalogo}
              seleccionadoId={seleccionadoId}
              orden={orden}
              mostrarVersiones={workspace.mostrarVersiones}
              onOrden={alternarOrden}
              onSeleccionar={setSeleccionadoId}
              onAbrir={abrirSeleccionado}
              menu={menuProps}
            />
          ) : (
            <div style={style.gridModelos}>
              {modelosCatalogo.map((modelo) => (
                <TileModelo
                  key={modelo.id}
                  modelo={modelo}
                  seleccionado={modelo.id === seleccionadoId}
                  mostrarVersiones={workspace.mostrarVersiones}
                  onSeleccionar={setSeleccionadoId}
                  onAbrir={abrirSeleccionado}
                  menu={menuProps}
                />
              ))}
            </div>
          )}
          {modelosCatalogo.length === 0 ? <div style={style.empty}>{query ? "Sin resultados para la búsqueda." : "Sin modelos en esta carpeta."}</div> : null}
        </div>
        <details open style={style.legacyExplorer}>
          <summary style={style.folderSummary}>Explorar carpetas</summary>
          <PanelCarpetas
            hijos={hijos}
            breadcrumb={breadcrumb}
            carpetaActualId={workspace.carpetaActualId}
            vista={modo}
            query={query}
            onQueryChange={setQuery}
            onVistaChange={setModo}
            onAbrirCarpeta={(cId) => workspace.abrirCarpeta(cId)}
            onNavegarBreadcrumb={navegarBreadcrumb}
            onCrearCarpeta={workspace.crearCarpetaEnActual}
            onRenombrarCarpeta={workspace.renombrarCarpetaEnIndice}
            onEliminarCarpeta={(cId) => { void workspace.eliminarCarpetaEnIndice(cId, { cascada: false }); }}
            onAbrirModelo={(mId) => {
              setSeleccionadoId(mId);
            }}
            onAbrirModeloEnPestana={(mId) => workspace.abrirPestanaConModelo(mId)}
            onCortarModelo={workspace.cortarModelo}
            onCortarCarpeta={workspace.cortarCarpeta}
            onPegarEn={workspace.pegarEn}
            onMoverModelo={workspace.moverModeloDirecto}
            onMoverCarpeta={workspace.moverCarpetaDirecto}
            onArchivarModelo={(mId) => { void workspace.archivarModeloPorId(mId); }}
            onRestaurarModelo={(mId) => { void workspace.restaurarModeloPorId(mId); }}
            onArchivarCarpeta={workspace.archivarCarpetaPorId}
            onRestaurarCarpeta={workspace.restaurarCarpetaPorId}
            onAbrirVersiones={workspace.abrirDialogoVersiones}
            portapapeles={workspace.portapapelesWorkspace}
            onCancelarPortapapeles={workspace.cancelarPortapapelesWorkspace}
            mostrarVersiones={workspace.mostrarVersiones}
            recientes={[]}
            modoOperacion="carga"
          />
        </details>
        <details style={style.jsonPanel} data-testid="panel-json-abrir-importar">
          <summary style={style.folderSummary}>JSON</summary>
          <PersistenciaJson onImported={persistencia.cerrarCargarModelo} mostrarModelosLocales={false} />
        </details>
      </div>
    </Dialogo>
  );
}

type OrdenCargar = { columna: "nombre" | "descripcion" | "actualizadoEn" | "bytes"; direccion: "asc" | "desc" };
let vistaCargarMemoria: VistaModo = "tiles";
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

function TileModelo(props: {
  modelo: ResumenModeloPersistido;
  seleccionado: boolean;
  mostrarVersiones: boolean;
  onSeleccionar: (id: Id) => void;
  onAbrir: (id: Id) => void;
  menu: MenuAccionesContexto;
}) {
  return (
    <div
      data-testid="modelo-tile-cargar"
      style={props.seleccionado ? style.tileSeleccionado : style.tileModelo}
      onClick={() => props.onSeleccionar(props.modelo.id)}
      onDblClick={() => props.onAbrir(props.modelo.id)}
      title={props.modelo.nombre}
    >
      <img src={regFileIcon} alt="" style={style.tileIcon} />
      <strong style={style.tileTitle}>{props.modelo.nombre}</strong>
      <span style={style.tileDesc}>{props.modelo.descripcion || "Sin descripción"}</span>
      <span style={style.tileDate}>{new Date(props.modelo.actualizadoEn).toLocaleString("es-CL")}</span>
      <Glifos modelo={props.modelo} mostrarVersiones={props.mostrarVersiones} />
      {props.modelo.archivado ? <span style={style.archiveBadge}>Archivado</span> : null}
      <div style={style.tileFooter}>
        <button
          type="button"
          data-testid="reciente-modelo"
          style={style.tileLoadButton}
          onClick={(event) => {
            event.stopPropagation();
            props.onAbrir(props.modelo.id);
          }}
          onDblClick={(event) => event.stopPropagation()}
        >
          Abrir {props.modelo.nombre}
        </button>
        <MenuAccionesModelo modelo={props.modelo} menu={props.menu} />
      </div>
    </div>
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
          <th style={style.th}>Glifos</th>
          <th style={style.th}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {props.modelos.map((modelo) => (
          <tr
            key={modelo.id}
            style={props.seleccionadoId === modelo.id ? style.rowSeleccionada : style.row}
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
                <button
                  type="button"
                  data-testid="reciente-modelo"
                  style={style.inlineLoadButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    props.onAbrir(modelo.id);
                  }}
                >
                  Cargar {modelo.nombre}
                </button>
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

function leerVistaCargar(): VistaModo {
  return vistaCargarMemoria;
}

function escribirVistaCargar(modo: VistaModo): void {
  vistaCargarMemoria = modo;
}

function leerOrdenCargar(): OrdenCargar {
  return ordenCargarMemoria;
}

function escribirOrdenCargar(orden: OrdenCargar): void {
  ordenCargarMemoria = orden;
}

// Ronda 28 L5: Bauhaus monocromático — ink/paper, sin radius, Inter Tight,
// sombras planas. Botones primario=ink/paper, secundario=paper/border ink.
const style = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "300px",
  },
  flagsBar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  flag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 400,
  },
  catalogo: {
    display: "grid",
    gap: "8px",
    minHeight: "220px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    padding: "12px",
    background: tokens.colors.paper,
  },
  catalogoToolbar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  searchInput: {
    flex: "1 1 auto",
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
  toggle: botonToggle(tokens.colors.ink15, tokens.colors.paper, tokens.colors.ink70, 400),
  activeToggle: botonToggle(tokens.colors.ink, tokens.colors.ink, tokens.colors.paper, 500),
  gridModelos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "8px",
    maxHeight: "320px",
    overflow: "auto",
  },
  tileModelo: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "24px auto auto 18px 30px",
    gap: "4px",
    minHeight: "140px",
    padding: "12px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    textAlign: "left",
    cursor: "pointer",
    transition: tokens.transitions.fast,
  },
  tileSeleccionado: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "24px auto auto 18px 30px",
    gap: "4px",
    minHeight: "140px",
    padding: "12px",
    border: `${tokens.stroke.bold}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    textAlign: "left",
    cursor: "pointer",
  },
  tileIcon: { width: "24px", height: "24px" },
  tileTitle: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 600, overflowWrap: "anywhere" },
  tileDesc: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400, lineHeight: 1.4, overflowWrap: "anywhere" },
  tileDate: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500 },
  tileLoadButton: { alignSelf: "end", minHeight: "28px", padding: "4px 12px", border: `1px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  inlineLoadButton: { minHeight: "28px", padding: "4px 12px", border: `1px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  tileFooter: { display: "flex", alignItems: "center", gap: "6px", minWidth: 0 },
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
  empty: { padding: "20px", border: `1px dashed ${tokens.colors.ink15}`, borderRadius: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400, textAlign: "center" },
  legacyExplorer: { border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "10px", background: tokens.colors.paper },
  jsonPanel: { border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "10px", background: tokens.colors.paper },
  folderSummary: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500, cursor: "pointer" },
} satisfies Record<string, preact.JSX.CSSProperties>;

function botonToggle(border: string, background: string, color: string, fontWeight: number): preact.JSX.CSSProperties {
  return {
    width: "30px",
    height: "30px",
    border: `1px solid ${border}`,
    borderRadius: 0,
    background,
    color,
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: 1,
    padding: 0,
    fontWeight,
  };
}
