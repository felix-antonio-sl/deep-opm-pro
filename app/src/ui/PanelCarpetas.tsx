import { useCallback, useState } from "preact/hooks";
import folderIcon from "../../../assets/svg/folder.svg";
import regFileIcon from "../../../assets/svg/regFile.svg";
import autosaveIcon from "../../../assets/svg/autosave.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/local";
import type { CarpetaIndice } from "../persistencia/workspace";

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
  recientes: ResumenModeloPersistido[];
  modoOperacion: "carga" | "selector"; // carga = doble clic abre modelo, selector = seleccionar carpeta destino
}

interface MenuContextualState {
  abierto: boolean;
  carpetaId: Id | null;
  x: number;
  y: number;
}

export function PanelCarpetas(props: PanelCarpetasProps) {
  const [menuCtx, setMenuCtx] = useState<MenuContextualState>({ abierto: false, carpetaId: null, x: 0, y: 0 });
  const [renombrandoId, setRenombrandoId] = useState<Id | null>(null);
  const [nombreRenombrar, setNombreRenombrar] = useState("");
  const [creando, setCreando] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");

  const filtrar = useCallback((nombre: string) => {
    if (!props.query) return true;
    return nombre.toLocaleLowerCase("es-CL").includes(props.query.toLocaleLowerCase("es-CL"));
  }, [props.query]);

  const carpetasFiltradas = props.hijos.carpetas.filter((c) => filtrar(c.nombre));
  const modelosFiltrados = props.hijos.modelos.filter((m) => filtrar(m.nombre));

  const iniciarRenombrar = (carpetaId: Id) => {
    const carpeta = props.hijos.carpetas.find((c) => c.id === carpetaId);
    if (!carpeta) return;
    setRenombrandoId(carpetaId);
    setNombreRenombrar(carpeta.nombre);
    setMenuCtx({ abierto: false, carpetaId: null, x: 0, y: 0 });
  };

  const confirmarRenombrar = () => {
    if (renombrandoId) {
      props.onRenombrarCarpeta(renombrandoId, nombreRenombrar);
    }
    setRenombrandoId(null);
  };

  const confirmarCrear = () => {
    if (nombreNuevo.trim()) {
      props.onCrearCarpeta(nombreNuevo.trim());
    }
    setCreando(false);
    setNombreNuevo("");
  };

  // Breadcrumb
  const segmentos = props.breadcrumb;

  return (
    <div style={style.panel}>
      {/* Barra de herramientas */}
      <div style={style.toolbar}>
        <div style={style.breadcrumbBar}>
          <button
            type="button"
            style={style.backButton}
            disabled={props.carpetaActualId === null}
            aria-label="Atrás"
            onClick={() => {
              if (segmentos.length > 0) {
                const ultimo = segmentos[segmentos.length - 1]!;
                props.onNavegarBreadcrumb(ultimo.padreId, segmentos.length - 2);
              } else {
                props.onNavegarBreadcrumb(null, -1);
              }
            }}
          >
            {"<"}
          </button>
          <nav aria-label="Ubicación" style={style.breadcrumb}>
            <span style={style.breadcrumbPart}>
              <button
                type="button"
                style={{ ...style.breadcrumbButton, fontWeight: props.carpetaActualId === null ? 700 : 400 }}
                onClick={() => props.onNavegarBreadcrumb(null, -1)}
              >
                Inicio
              </button>
            </span>
            {segmentos.map((segmento, index) => (
              <span key={segmento.id} style={style.breadcrumbPart}>
                <span style={style.separator}>/</span>
                <button
                  type="button"
                  style={{
                    ...style.breadcrumbButton,
                    fontWeight: index === segmentos.length - 1 ? 700 : 400,
                  }}
                  onClick={() => props.onNavegarBreadcrumb(segmento.id, index)}
                >
                  {segmento.nombre}
                </button>
              </span>
            ))}
          </nav>
        </div>
        <div style={style.toolbarActions}>
          <label style={style.searchBox}>
            <input
              type="search"
              style={style.searchInput}
              placeholder="Buscar..."
              value={props.query}
              onInput={(e) => props.onQueryChange(e.currentTarget.value)}
            />
          </label>
          <button
            type="button"
            style={props.vista === "tiles" ? style.activeToggle : style.toggle}
            onClick={() => props.onVistaChange("tiles")}
            title="Vista de tiles"
          >
            ▦
          </button>
          <button
            type="button"
            style={props.vista === "lista" ? style.activeToggle : style.toggle}
            onClick={() => props.onVistaChange("lista")}
            title="Vista de lista"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Grid lateral de recientes solo en modo carga */}
      {props.modoOperacion === "carga" && props.recientes.length > 0 && (
        <div style={style.recientesPanel}>
          <h3 style={style.recientesTitulo}>Recientes</h3>
          <div style={style.recientesList}>
            {props.recientes.slice(0, 10).map((modelo) => (
              <button
                key={modelo.id}
                type="button"
                style={style.recienteItem}
                onClick={() => props.onAbrirModelo(modelo.id)}
                onDblClick={() => props.onAbrirModelo(modelo.id)}
                title={modelo.nombre}
              >
                <img src={regFileIcon} alt="" style={style.recienteIcon} />
                <span style={style.recienteNombre}>{modelo.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={props.modoOperacion === "carga" ? style.contenidoConRecientes : style.contenido}>
        {props.vista === "lista" ? (
          <table style={style.tabla}>
            <thead>
              <tr>
                <th style={style.th}>Nombre</th>
                <th style={style.th}>Tipo</th>
                <th style={style.th}>Última modificación</th>
              </tr>
            </thead>
            <tbody>
              {carpetasFiltradas.map((carpeta) => (
                <tr
                  key={carpeta.id}
                  style={style.fila}
                  onDblClick={() => props.onAbrirCarpeta(carpeta.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenuCtx({ abierto: true, carpetaId: carpeta.id, x: e.clientX, y: e.clientY });
                  }}
                >
                  <td style={style.td}>
                    <img src={folderIcon} alt="" style={style.tableIcon} />
                    {renombrandoId === carpeta.id ? (
                      <input
                        type="text"
                        style={style.inlineInput}
                        value={nombreRenombrar}
                        onInput={(e) => setNombreRenombrar(e.currentTarget.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") confirmarRenombrar(); if (e.key === "Escape") setRenombrandoId(null); }}
                        onBlur={confirmarRenombrar}
                        autoFocus
                      />
                    ) : (
                      <span style={style.tdName}>{carpeta.nombre}</span>
                    )}
                  </td>
                  <td style={style.td}>Carpeta</td>
                  <td style={style.td}>—</td>
                </tr>
              ))}
              {modelosFiltrados.map((modelo) => (
                <tr
                  key={modelo.id}
                  style={style.fila}
                  onDblClick={() => props.onAbrirModelo(modelo.id)}
                  onClick={() => {
                    if (props.modoOperacion === "carga") props.onAbrirModelo(modelo.id);
                  }}
                >
                  <td style={style.td}>
                    <img src={regFileIcon} alt="" style={style.tableIcon} />
                    <span style={style.tdName}>{modelo.nombre}</span>
                    {modelo.autosalvado ? <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} /> : null}
                  </td>
                  <td style={style.td}>Modelo</td>
                  <td style={style.td}>{new Date(modelo.actualizadoEn).toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Vista tiles */
          <div style={style.grid}>
            {carpetasFiltradas.map((carpeta) => (
              <button
                key={carpeta.id}
                type="button"
                style={style.tile}
                onDblClick={() => props.onAbrirCarpeta(carpeta.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenuCtx({ abierto: true, carpetaId: carpeta.id, x: e.clientX, y: e.clientY });
                }}
                title={carpeta.nombre}
              >
                <img src={folderIcon} alt="" style={style.tileIcon} />
                {renombrandoId === carpeta.id ? (
                  <input
                    type="text"
                    style={style.inlineInput}
                    value={nombreRenombrar}
                    onInput={(e) => setNombreRenombrar(e.currentTarget.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") confirmarRenombrar(); if (e.key === "Escape") setRenombrandoId(null); }}
                    onBlur={confirmarRenombrar}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span style={style.tileName}>{carpeta.nombre}</span>
                )}
                <span style={style.tileType}>Carpeta</span>
              </button>
            ))}
            {modelosFiltrados.map((modelo) => (
              <button
                key={modelo.id}
                type="button"
                style={style.tile}
                onClick={() => {
                  if (props.modoOperacion === "carga") props.onAbrirModelo(modelo.id);
                }}
                onDblClick={() => props.onAbrirModelo(modelo.id)}
                title={modelo.nombre}
              >
                <img src={regFileIcon} alt="" style={style.tileIcon} />
                <span style={style.tileName}>{modelo.nombre}</span>
                {modelo.descripcion ? <span style={style.tileDesc}>{modelo.descripcion}</span> : null}
                <span style={style.tileDate}>{new Date(modelo.actualizadoEn).toLocaleString("es-CL")}</span>
                {modelo.autosalvado ? (
                  <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} title="Autosalvado" />
                ) : null}
              </button>
            ))}
          </div>
        )}

        {carpetasFiltradas.length === 0 && modelosFiltrados.length === 0 ? (
          <div style={style.empty}>
            {props.query ? "Sin resultados para la búsqueda." : "Sin modelos en esta carpeta."}
          </div>
        ) : null}
      </div>

      {/* Botón nueva carpeta */}
      <div style={style.footer}>
        {creando ? (
          <input
            type="text"
            style={style.inlineInput}
            placeholder="Nombre de carpeta"
            value={nombreNuevo}
            onInput={(e) => setNombreNuevo(e.currentTarget.value)}
            onKeyDown={(e) => { if (e.key === "Enter") confirmarCrear(); if (e.key === "Escape") { setCreando(false); setNombreNuevo(""); } }}
            onBlur={confirmarCrear}
            autoFocus
          />
        ) : (
          <button type="button" style={style.newFolderButton} onClick={() => setCreando(true)}>
            + Nueva carpeta
          </button>
        )}
      </div>

      {/* Menú contextual */}
      {menuCtx.abierto && menuCtx.carpetaId ? (
        <div
          style={{ ...style.contextMenu, left: menuCtx.x, top: menuCtx.y }}
          onMouseLeave={() => setMenuCtx({ abierto: false, carpetaId: null, x: 0, y: 0 })}
        >
          <button type="button" style={style.contextItem} onClick={() => iniciarRenombrar(menuCtx.carpetaId!)}>
            Renombrar
          </button>
          <button type="button" style={style.contextItem} onClick={() => { props.onEliminarCarpeta(menuCtx.carpetaId!); setMenuCtx({ abierto: false, carpetaId: null, x: 0, y: 0 }); }}>
            Eliminar
          </button>
        </div>
      ) : null}
    </div>
  );
}

const style = {
  panel: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  toolbar: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "10px",
  },
  breadcrumbBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  backButton: {
    width: "30px",
    height: "30px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    fontWeight: 700,
    flexShrink: 0,
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    flexWrap: "wrap",
    gap: "4px",
  },
  breadcrumbPart: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  separator: { color: "#98a2b3" },
  breadcrumbButton: {
    border: 0,
    padding: 0,
    background: "transparent",
    color: "#475467",
    fontSize: "13px",
    cursor: "pointer",
  },
  toolbarActions: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  searchBox: { flex: "1 1 auto" },
  searchInput: {
    width: "100%",
    height: "30px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    padding: "0 8px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  toggle: {
    width: "30px",
    height: "30px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: 1,
    padding: 0,
  },
  activeToggle: {
    width: "30px",
    height: "30px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#e8eef5",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: 1,
    padding: 0,
    fontWeight: 700,
  },
  recientesPanel: {
    width: "160px",
    flexShrink: 0,
    borderRight: "1px solid #e4eaf1",
    paddingRight: "10px",
    marginRight: "10px",
    overflow: "auto",
  },
  recientesTitulo: {
    margin: "0 0 8px",
    color: "#667085",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  recientesList: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  recienteItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 8px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "transparent",
    color: "#475467",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    textAlign: "left",
  },
  recienteIcon: { width: "16px", height: "16px", flexShrink: 0 },
  recienteNombre: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  contenidoConRecientes: {
    display: "flex",
    minHeight: 0,
    flex: "1 1 auto",
    overflow: "auto",
  },
  contenido: {
    flex: "1 1 auto",
    overflow: "auto",
    minHeight: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
    gap: "8px",
  },
  tile: {
    minHeight: "110px",
    display: "grid",
    gridTemplateRows: "28px auto auto",
    gap: "4px",
    padding: "10px",
    border: "1px solid #d9e0ea",
    borderRadius: "6px",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
    textAlign: "left",
  },
  tileIcon: { width: "24px", height: "24px" },
  tileName: {
    minWidth: 0,
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.2,
    overflowWrap: "anywhere",
  },
  tileDesc: {
    minWidth: 0,
    color: "#667085",
    fontSize: "11px",
    lineHeight: 1.25,
    overflowWrap: "anywhere",
  },
  tileDate: {
    color: "#667085",
    fontSize: "11px",
    fontWeight: 700,
  },
  tileType: {
    color: "#98a2b3",
    fontSize: "11px",
    fontWeight: 600,
  },
  glyphIcon: { width: "14px", height: "14px", justifySelf: "end" },
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    padding: "6px 8px",
    borderBottom: "2px solid #d9e0ea",
    color: "#667085",
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "left",
  },
  fila: {
    borderBottom: "1px solid #f2f4f7",
    cursor: "pointer",
  },
  td: {
    padding: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tableIcon: { width: "18px", height: "18px", flexShrink: 0 },
  tdName: { fontWeight: 600, color: "#1f2937" },
  empty: {
    padding: "18px",
    border: "1px dashed #c8d2df",
    borderRadius: "4px",
    color: "#667085",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "center",
  },
  footer: {
    marginTop: "10px",
  },
  newFolderButton: {
    width: "100%",
    height: "34px",
    border: "1px dashed #b9c5d4",
    borderRadius: "4px",
    background: "transparent",
    color: "#586D8C",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  inlineInput: {
    width: "100%",
    height: "28px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    padding: "0 6px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  contextMenu: {
    position: "fixed",
    zIndex: 2000,
    background: "#ffffff",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.18)",
    padding: "4px",
    display: "grid",
    gap: "2px",
  },
  contextItem: {
    height: "30px",
    padding: "0 12px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "transparent",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
