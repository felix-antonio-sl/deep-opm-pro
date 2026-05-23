// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useCallback, useState } from "preact/hooks";
import regFileIcon from "../../../assets/svg/regFile.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/local";
import type { CarpetaIndice, PortapapelesWorkspace } from "../persistencia/workspace";
import { Breadcrumb } from "./panelCarpetas/Breadcrumb";
import { MenuContextual, type MenuContextualState } from "./panelCarpetas/MenuContextual";
import { Tile, type TileData } from "./panelCarpetas/Tile";
import { iniciarDragWorkspace, leerDragWorkspace } from "./panelCarpetas/handlersDragDrop";
import { tokens } from "./tokens";

export type VistaModo = "tiles" | "lista";

export interface HijosDeCarpeta {
  carpetas: CarpetaIndice[];
  modelos: ResumenModeloPersistido[];
}

interface PanelCarpetasProps {
  hijos: HijosDeCarpeta;
  breadcrumb: CarpetaIndice[];
  carpetaActualId: Id | null;
  vista: VistaModo;
  query: string;
  onQueryChange: (q: string) => void;
  onVistaChange: (modo: VistaModo) => void;
  onAbrirCarpeta: (carpetaId: Id) => void;
  onNavegarBreadcrumb: (carpetaId: Id | null, segmentIndex: number) => void;
  onCrearCarpeta: (nombre: string) => void;
  onRenombrarCarpeta: (carpetaId: Id, nombre: string) => void;
  onEliminarCarpeta: (carpetaId: Id) => void;
  onAbrirModelo: (modeloId: Id) => void;
  onAbrirModeloEnPestana?: (modeloId: Id) => void;
  onCortarModelo?: (modeloId: Id) => void;
  onCortarCarpeta?: (carpetaId: Id) => void;
  onPegarEn?: (carpetaId: Id | null) => void;
  onMoverModelo?: (modeloId: Id, carpetaDestinoId: Id | null) => void;
  onMoverCarpeta?: (carpetaId: Id, carpetaDestinoId: Id | null) => void;
  onArchivarModelo?: (modeloId: Id) => void;
  onRestaurarModelo?: (modeloId: Id) => void;
  onArchivarCarpeta?: (carpetaId: Id) => void;
  onRestaurarCarpeta?: (carpetaId: Id) => void;
  onAbrirVersiones?: (modeloId: Id) => void;
  portapapeles?: PortapapelesWorkspace | null;
  onCancelarPortapapeles?: () => void;
  mostrarVersiones?: boolean;
  recientes: ResumenModeloPersistido[];
  modoOperacion: "carga" | "selector";
}

/**
 * Barrel publico del selector/navegador de carpetas. Sigue prop-driven para
 * funcionar en dialogos de cargar y guardar sin acoplarse al store.
 */
export function PanelCarpetas(props: PanelCarpetasProps) {
  const [menuCtx, setMenuCtx] = useState<MenuContextualState>({ abierto: false, tipo: null, itemId: null, x: 0, y: 0 });
  const [renombrandoId, setRenombrandoId] = useState<Id | null>(null);
  const [nombreRenombrar, setNombreRenombrar] = useState("");
  const [creando, setCreando] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [dropDestino, setDropDestino] = useState<Id | null | "__root">(null);
  const filtrar = useCallback((nombre: string) => {
    if (!props.query) return true;
    return nombre.toLocaleLowerCase("es-CL").includes(props.query.toLocaleLowerCase("es-CL"));
  }, [props.query]);
  const carpetasFiltradas = props.hijos.carpetas.filter((c) => filtrar(c.nombre));
  const modelosFiltrados = props.hijos.modelos.filter((m) => filtrar(m.nombre));
  const items: TileData[] = [
    ...carpetasFiltradas.map((carpeta) => ({ tipo: "carpeta" as const, carpeta })),
    ...modelosFiltrados.map((modelo) => ({ tipo: "modelo" as const, modelo })),
  ];
  const cerrarMenu = () => setMenuCtx({ abierto: false, tipo: null, itemId: null, x: 0, y: 0 });
  const puedePegar = Boolean(props.portapapeles && props.onPegarEn);

  const iniciarRenombrar = (carpetaId: Id) => {
    const carpeta = props.hijos.carpetas.find((c) => c.id === carpetaId);
    if (!carpeta) return;
    setRenombrandoId(carpetaId);
    setNombreRenombrar(carpeta.nombre);
    cerrarMenu();
  };
  const confirmarRenombrar = () => {
    if (renombrandoId) props.onRenombrarCarpeta(renombrandoId, nombreRenombrar);
    setRenombrandoId(null);
  };
  const confirmarCrear = () => {
    if (nombreNuevo.trim()) props.onCrearCarpeta(nombreNuevo.trim());
    setCreando(false);
    setNombreNuevo("");
  };
  const abrirMenu = (event: MouseEvent, tipo: MenuContextualState["tipo"], itemId: Id | null) => {
    event.preventDefault();
    setMenuCtx({ abierto: true, tipo, itemId, x: event.clientX, y: event.clientY });
  };
  const soltarEn = (event: DragEvent, carpetaDestinoId: Id | null) => {
    event.preventDefault();
    setDropDestino(null);
    const payload = leerDragWorkspace(event);
    if (!payload) return;
    if (payload.tipo === "modelo") props.onMoverModelo?.(payload.itemId, carpetaDestinoId);
    if (payload.tipo === "carpeta") props.onMoverCarpeta?.(payload.itemId, carpetaDestinoId);
  };

  return (
    <div
      style={style.panel}
      onContextMenu={(event) => {
        if (event.currentTarget !== event.target) return;
        abrirMenu(event as unknown as MouseEvent, "panel", null);
      }}
      onDragOver={(event) => {
        if (!props.onMoverModelo && !props.onMoverCarpeta) return;
        event.preventDefault();
        setDropDestino("__root");
      }}
      onDragLeave={() => setDropDestino(null)}
      onDrop={(event) => soltarEn(event as unknown as DragEvent, props.carpetaActualId)}
    >
      <div style={style.toolbar}>
        <Breadcrumb segmentos={props.breadcrumb} carpetaActualId={props.carpetaActualId} onNavegarBreadcrumb={props.onNavegarBreadcrumb} />
        <ToolbarAcciones {...props} puedePegar={puedePegar} />
      </div>
      {props.modoOperacion === "carga" && props.recientes.length > 0 ? <Recientes recientes={props.recientes} onAbrirModelo={props.onAbrirModelo} /> : null}
      <div style={{ ...(props.modoOperacion === "carga" ? style.contenidoConRecientes : style.contenido), ...(dropDestino === "__root" ? style.dropActivo : {}) }}>
        {props.vista === "lista" ? (
          <TablaItems items={items} comunes={propsTile} />
        ) : (
          <div style={style.grid}>
            {items.map((item) => <Tile key={item.tipo === "carpeta" ? item.carpeta.id : item.modelo.id} item={item} {...propsTile(item)} />)}
          </div>
        )}
        {items.length === 0 ? <div style={style.empty}>{props.query ? "Sin resultados para la búsqueda." : "Sin modelos en esta carpeta."}</div> : null}
      </div>
      <div style={style.footer}>{creando ? <InputCrear value={nombreNuevo} onChange={setNombreNuevo} onConfirmar={confirmarCrear} onCancelar={() => { setCreando(false); setNombreNuevo(""); }} /> : <button type="button" style={style.newFolderButton} onClick={() => setCreando(true)}>+ Nueva carpeta</button>}</div>
      <MenuContextual
        menu={menuCtx}
        carpetas={props.hijos.carpetas}
        modelos={props.hijos.modelos}
        carpetaActualId={props.carpetaActualId}
        puedePegar={puedePegar}
        onCerrar={cerrarMenu}
        onIniciarRenombrar={iniciarRenombrar}
        onEliminarCarpeta={props.onEliminarCarpeta}
        onCortarCarpeta={props.onCortarCarpeta}
        onCortarModelo={props.onCortarModelo}
        onPegarEn={props.onPegarEn}
        onAbrirModeloEnPestana={props.onAbrirModeloEnPestana}
        onArchivarModelo={props.onArchivarModelo}
        onRestaurarModelo={props.onRestaurarModelo}
        onArchivarCarpeta={props.onArchivarCarpeta}
        onRestaurarCarpeta={props.onRestaurarCarpeta}
        onAbrirVersiones={props.onAbrirVersiones}
      />
    </div>
  );

  function propsTile(item?: TileData) {
    return {
      vista: props.vista,
      modoOperacion: props.modoOperacion,
      renombrandoId,
      nombreRenombrar,
      mostrarVersiones: props.mostrarVersiones,
      onNombreRenombrarChange: setNombreRenombrar,
      onConfirmarRenombrar: confirmarRenombrar,
      onCancelarRenombrar: () => setRenombrandoId(null),
      onAbrirCarpeta: props.onAbrirCarpeta,
      onAbrirModelo: props.onAbrirModelo,
      onDragStart: (event: DragEvent, item: TileData) => iniciarDragWorkspace(event, item.tipo === "carpeta" ? { tipo: "carpeta", itemId: item.carpeta.id } : { tipo: "modelo", itemId: item.modelo.id }),
      onDragOverCarpeta: (event: DragEvent, carpetaId: Id) => {
        event.preventDefault();
        setDropDestino(carpetaId);
      },
      onDragLeave: () => setDropDestino(null),
      onDropCarpeta: soltarEn,
      onContextMenu: (event: MouseEvent, tipo: "carpeta" | "modelo", itemId: Id) => abrirMenu(event, tipo, itemId),
      dropActivo: item?.tipo === "carpeta" && dropDestino === item.carpeta.id,
    };
  }
}

function ToolbarAcciones(props: PanelCarpetasProps & { puedePegar: boolean }) {
  return (
    <div style={style.toolbarActions}>
      <label style={style.searchBox}>
        <input type="search" style={style.searchInput} placeholder="Buscar..." value={props.query} onInput={(event) => props.onQueryChange(event.currentTarget.value)} />
      </label>
      {props.puedePegar ? (
        <>
          <button type="button" style={style.pendingButton} onClick={() => props.onPegarEn?.(props.carpetaActualId)} title="Pegar en esta carpeta">Pegar aqui</button>
          <button type="button" style={style.toggle} onClick={props.onCancelarPortapapeles} title="Cancelar cortar">x</button>
        </>
      ) : null}
      <button type="button" style={props.vista === "tiles" ? style.activeToggle : style.toggle} onClick={() => props.onVistaChange("tiles")} title="Vista de tiles" aria-label="Vista de tiles" aria-pressed={props.vista === "tiles"}><span aria-hidden="true">▦</span></button>
      <button type="button" style={props.vista === "lista" ? style.activeToggle : style.toggle} onClick={() => props.onVistaChange("lista")} title="Vista de lista" aria-label="Vista de lista" aria-pressed={props.vista === "lista"}><span aria-hidden="true">☰</span></button>
    </div>
  );
}

function Recientes(props: { recientes: ResumenModeloPersistido[]; onAbrirModelo: (modeloId: Id) => void }) {
  return (
    <div style={style.recientesPanel}>
      <h3 style={style.recientesTitulo}>Recientes</h3>
      <div style={style.recientesList}>
        {props.recientes.slice(0, 10).map((modelo) => (
          <button key={modelo.id} type="button" data-testid="reciente-modelo" style={style.recienteItem} onClick={() => props.onAbrirModelo(modelo.id)} onDblClick={() => props.onAbrirModelo(modelo.id)} title={modelo.nombre}>
            <img src={regFileIcon} alt="" style={style.recienteIcon} />
            <span style={style.recienteNombre}>{modelo.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TablaItems(props: { items: TileData[]; comunes: (item?: TileData) => Omit<Parameters<typeof Tile>[0], "item"> }) {
  return (
    <table style={style.tabla}>
      <thead><tr><th style={style.th}>Nombre</th><th style={style.th}>Tipo</th><th style={style.th}>Última modificación</th></tr></thead>
      <tbody>{props.items.map((item) => <Tile key={item.tipo === "carpeta" ? item.carpeta.id : item.modelo.id} item={item} {...props.comunes(item)} />)}</tbody>
    </table>
  );
}

function InputCrear(props: { value: string; onChange: (value: string) => void; onConfirmar: () => void; onCancelar: () => void }) {
  return <input type="text" style={style.inlineInput} placeholder="Nombre de carpeta" value={props.value} onInput={(event) => props.onChange(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Enter") props.onConfirmar(); if (event.key === "Escape") props.onCancelar(); }} onBlur={props.onConfirmar} autoFocus />;
}

// Ronda 28 L3: PanelCarpetas Bauhaus — misma estética que árbol OPD.
//   - Toolbar: search outline ink-15, toggles iconográficos paper/ink-04.
//   - Recientes: label uppercase ink-50, items minimal ink-70.
//   - Grid/Tabla: divisores ink-15 hairline.
//   - drop activo: outline cinabrio 2px (signal).
//   - empty: caja dashed ink-15 ink-50.
const style = {
  panel: { display: "flex" as const, flexDirection: "column" as const, minHeight: 0 },
  toolbar: { display: "flex" as const, flexDirection: "column" as const, gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm },
  toolbarActions: { display: "flex" as const, gap: tokens.spacing.xs, alignItems: "center" },
  searchBox: { flex: "1 1 auto" },
  searchInput: {
    width: "100%",
    height: "30px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    fontSize: tokens.typography.sizes.base,
    boxSizing: "border-box" as const,
  },
  toggle: botonToggle(tokens.colors.ink15, tokens.colors.paper, tokens.colors.ink50, tokens.typography.weights.normal),
  activeToggle: botonToggle(tokens.colors.ink, tokens.colors.ink, tokens.colors.paper, tokens.typography.weights.semibold),
  pendingButton: {
    height: "30px",
    padding: "0 12px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
    whiteSpace: "nowrap" as const,
  },
  recientesPanel: {
    width: "160px",
    flexShrink: 0,
    borderRight: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    paddingRight: tokens.spacing.sm,
    marginRight: tokens.spacing.sm,
    overflow: "auto" as const,
  },
  recientesTitulo: {
    margin: "0 0 8px",
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  recientesList: { display: "flex" as const, flexDirection: "column" as const, gap: tokens.spacing.xs },
  recienteItem: {
    display: "flex" as const,
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `6px ${tokens.spacing.md}px`,
    border: 0,
    borderLeft: `${tokens.stroke.bold}px solid transparent`,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left" as const,
    transition: tokens.transitions.fast,
  },
  recienteIcon: { width: "16px", height: "16px", flexShrink: 0 },
  recienteNombre: { overflow: "hidden", textOverflow: "ellipsis" as const, whiteSpace: "nowrap" as const },
  contenidoConRecientes: { display: "flex" as const, minHeight: 0, flex: "1 1 auto", overflow: "auto" as const },
  contenido: { flex: "1 1 auto", overflow: "auto" as const, minHeight: 0 },
  grid: { display: "grid" as const, gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: tokens.spacing.sm },
  tabla: { width: "100%", borderCollapse: "collapse" as const, fontSize: tokens.typography.sizes.base },
  th: {
    padding: "8px 10px",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    textAlign: "left" as const,
  },
  // Drop activo: outline cinabrio 2px — signal Bauhaus reservado al acento.
  dropActivo: { outline: `${tokens.stroke.bold}px solid ${tokens.colors.accent}`, outlineOffset: "-2px" },
  empty: {
    padding: tokens.spacing.lg,
    border: `${tokens.stroke.hairline}px dashed ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    color: tokens.colors.ink50,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "center" as const,
  },
  footer: { marginTop: tokens.spacing.sm },
  newFolderButton: {
    width: "100%",
    height: "34px",
    border: `${tokens.stroke.hairline}px dashed ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink50,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    transition: tokens.transitions.fast,
  },
  inlineInput: {
    width: "100%",
    height: "28px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    padding: "0 8px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    caretColor: tokens.colors.accent,
    fontSize: tokens.typography.sizes.base,
    boxSizing: "border-box" as const,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function botonToggle(border: string, background: string, color: string, fontWeight: number): preact.JSX.CSSProperties {
  return {
    width: "30px",
    height: "30px",
    border: `${tokens.stroke.hairline}px solid ${border}`,
    borderRadius: tokens.radii.xs,
    background,
    color,
    cursor: "pointer",
    fontSize: tokens.typography.sizes.lg,
    lineHeight: 1,
    padding: 0,
    fontWeight,
    transition: tokens.transitions.fast,
  };
}
