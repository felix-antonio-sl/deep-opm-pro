import { useOpmStore, store } from "../store";
import type { Enlace, Id, TipoEnlace } from "../modelo/tipos";
import { naturalezaDeEnlace } from "../modelo/constantes";

interface FilaEnlace {
  enlaceId: Id;
  origen: string;
  destino: string;
  tipo: TipoEnlace;
  etiqueta: string;
  multOrigen: string;
  multDestino: string;
}

export function TablaEnlaces() {
  const abierta = useOpmStore((s) => s.tablaEnlacesAbierta);
  const cerrar = useOpmStore((s) => s.cerrarTablaEnlaces);
  const modelo = useOpmStore((s) => s.modelo);
  const filtroTipo = useOpmStore((s) => s.tablaEnlacesFiltroTipo);
  const fijarFiltro = useOpmStore((s) => s.fijarFiltroTablaEnlaces);
  const ordenColumna = useOpmStore((s) => s.tablaEnlacesOrdenColumna);
  const ordenDireccion = useOpmStore((s) => s.tablaEnlacesOrdenDireccion);
  const fijarOrden = useOpmStore((s) => s.fijarOrdenTablaEnlaces);
  const navegar = useOpmStore((s) => s.navegarAEnlaceDesdeTabla);
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const fijarMultiplicidadE = useOpmStore((s) => s.fijarMultiplicidadEnlace);

  if (!abierta) return null;

  // Construir filas
  const filas: FilaEnlace[] = Object.values(modelo.enlaces)
    .filter((enlace) => filtroTipo === "todos" || enlace.tipo === filtroTipo)
    .map((enlace) => ({
      enlaceId: enlace.id,
      origen: nombreExtremo(modelo, enlace.origenId.id),
      destino: nombreExtremo(modelo, enlace.destinoId.id),
      tipo: enlace.tipo,
      etiqueta: enlace.etiqueta,
      multOrigen: enlace.multiplicidadOrigen ?? "",
      multDestino: enlace.multiplicidadDestino ?? "",
    }));

  // Ordenar
  if (ordenColumna) {
    filas.sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[ordenColumna] ?? "";
      const bVal = (b as unknown as Record<string, string>)[ordenColumna] ?? "";
      const cmp = aVal.localeCompare(bVal, "es", { sensitivity: "base" });
      return ordenDireccion === "asc" ? cmp : -cmp;
    });
  }

  const cabeceras: Array<{ clave: string; label: string }> = [
    { clave: "origen", label: "Origen" },
    { clave: "destino", label: "Destino" },
    { clave: "tipo", label: "Tipo" },
    { clave: "etiqueta", label: "Etiqueta" },
    { clave: "multOrigen", label: "Mult. origen" },
    { clave: "multDestino", label: "Mult. destino" },
  ];

  return (
    <div role="dialog" aria-label="Tabla de enlaces" style={overlayStyle}>
      <div style={panelStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Tabla de Enlaces ({filas.length})</h2>
          <button type="button" style={closeButtonStyle} onClick={cerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div style={toolbarStyle}>
          <label style={filterLabelStyle}>
            Filtrar:
            <select
              style={filterSelectStyle}
              value={filtroTipo}
              onChange={(e) => fijarFiltro(e.currentTarget.value as TipoEnlace | "todos")}
            >
              <option value="todos">Todos</option>
              <option value="agregacion">Agregación</option>
              <option value="exhibicion">Exhibición</option>
              <option value="generalizacion">Generalización</option>
              <option value="clasificacion">Clasificación</option>
              <option value="agente">Agente</option>
              <option value="instrumento">Instrumento</option>
              <option value="consumo">Consumo</option>
              <option value="resultado">Resultado</option>
              <option value="efecto">Efecto</option>
              <option value="invocacion">Invocación</option>
            </select>
          </label>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {cabeceras.map(({ clave, label }) => (
                  <th
                    key={clave}
                    style={thStyle}
                    onClick={() => fijarOrden(clave)}
                    role="columnheader"
                    aria-sort={ordenColumna === clave ? (ordenDireccion === "asc" ? "ascending" : "descending") : "none"}
                  >
                    {label}
                    {ordenColumna === clave ? (ordenDireccion === "asc" ? " ▴" : " ▾") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr
                  key={fila.enlaceId}
                  style={trStyle}
                  onClick={() => navegar(fila.enlaceId)}
                  title="Doble clic para navegar al enlace en el canvas"
                >
                  <td style={tdStyle}>{fila.origen}</td>
                  <td style={tdStyle}>{fila.destino}</td>
                  <td style={{ ...tdStyle, color: tipoColor(fila.tipo), fontWeight: 700 }}>
                    {capitalizar(fila.tipo)}
                  </td>
                  <td style={tdStyle}>
                    <input
                      style={inlineInputStyle}
                      value={fila.etiqueta}
                      onClick={(e) => e.stopPropagation()}
                      onInput={(e) => {
                        const st = store.getState();
                        if (st.enlaceSeleccionId !== fila.enlaceId) {
                          st.seleccionarEnlace(fila.enlaceId);
                        }
                        renombrarEtiquetaEnlace(e.currentTarget.value);
                      }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      style={inlineInputStyle}
                      value={fila.multOrigen}
                      placeholder="1, *, N"
                      onClick={(e) => e.stopPropagation()}
                      onInput={(e) => {
                        const st = store.getState();
                        if (st.enlaceSeleccionId !== fila.enlaceId) {
                          st.seleccionarEnlace(fila.enlaceId);
                        }
                        fijarMultiplicidadE(fila.enlaceId, "origen", e.currentTarget.value);
                      }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      style={inlineInputStyle}
                      value={fila.multDestino}
                      placeholder="1, *, N"
                      onClick={(e) => e.stopPropagation()}
                      onInput={(e) => {
                        const st = store.getState();
                        if (st.enlaceSeleccionId !== fila.enlaceId) {
                          st.seleccionarEnlace(fila.enlaceId);
                        }
                        fijarMultiplicidadE(fila.enlaceId, "destino", e.currentTarget.value);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {filas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={emptyStyle}>Sin enlaces que mostrar</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={footerStyle}>
          <button type="button" style={closeFooterButtonStyle} onClick={cerrar}>
            Cerrar (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}

function nombreExtremo(modelo: { entidades: Record<string, { nombre: string }> }, extremoId: string): string {
  const entidad = modelo.entidades[extremoId];
  return entidad?.nombre ?? extremoId;
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function tipoColor(tipo: TipoEnlace): string {
  return naturalezaDeEnlace(tipo) === "estructural" ? "#70E483" : "#3BC3FF";
}

// ── Estilos ────────────────────────────────────────────────────────────────

const overlayStyle: preact.JSX.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const panelStyle: preact.JSX.CSSProperties = {
  width: "min(90vw, 960px)",
  maxHeight: "85vh",
  background: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 20px 60px rgba(16, 24, 40, 0.25)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle: preact.JSX.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  borderBottom: "1px solid #e5e7eb",
};

const titleStyle: preact.JSX.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 700,
  color: "#1f2937",
};

const closeButtonStyle: preact.JSX.CSSProperties = {
  width: "32px",
  height: "32px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  color: "#667085",
  cursor: "pointer",
  borderRadius: "4px",
};

const toolbarStyle: preact.JSX.CSSProperties = {
  padding: "10px 20px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f9fafb",
};

const filterLabelStyle: preact.JSX.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#475467",
};

const filterSelectStyle: preact.JSX.CSSProperties = {
  minHeight: "30px",
  padding: "0 8px",
  border: "1px solid #c8d2df",
  borderRadius: "4px",
  fontSize: "13px",
  outlineColor: "#586D8C",
};

const tableContainerStyle: preact.JSX.CSSProperties = {
  flex: 1,
  overflow: "auto",
};

const tableStyle: preact.JSX.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "12px",
};

const thStyle: preact.JSX.CSSProperties = {
  position: "sticky",
  top: 0,
  background: "#f3f4f6",
  padding: "8px 12px",
  textAlign: "left",
  fontWeight: 700,
  color: "#475467",
  borderBottom: "2px solid #d9e0ea",
  cursor: "pointer",
  whiteSpace: "nowrap",
  userSelect: "none",
};

const tdStyle: preact.JSX.CSSProperties = {
  padding: "6px 12px",
  borderBottom: "1px solid #f0f0f0",
  color: "#1f2937",
};

const trStyle: preact.JSX.CSSProperties = {
  cursor: "pointer",
};

const inlineInputStyle: preact.JSX.CSSProperties = {
  width: "100%",
  minWidth: "60px",
  padding: "2px 6px",
  border: "1px solid transparent",
  borderRadius: "3px",
  background: "transparent",
  fontSize: "12px",
  color: "#1f2937",
  outline: "none",
};

const emptyStyle: preact.JSX.CSSProperties = {
  padding: "24px",
  textAlign: "center",
  color: "#667085",
  fontSize: "13px",
  fontWeight: 600,
};

const footerStyle: preact.JSX.CSSProperties = {
  padding: "12px 20px",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "flex-end",
};

const closeFooterButtonStyle: preact.JSX.CSSProperties = {
  minHeight: "32px",
  padding: "0 16px",
  border: "1px solid #c8d2df",
  borderRadius: "4px",
  background: "#f9fbfd",
  color: "#475467",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 700,
};
