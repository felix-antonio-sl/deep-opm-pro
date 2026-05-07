// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef } from "preact/hooks";
import type { Id, TipoEntidad } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

interface ResultadoBusqueda {
  entidadId: Id;
  nombre: string;
  tipo: TipoEntidad;
  opdId: Id;
  opdNombre: string;
}

export function DialogoBuscarCosas() {
  const abierto = useOpmStore((s) => s.busquedaCosasAbierta);
  const query = useOpmStore((s) => s.busquedaCosasQuery);
  const filtro = useOpmStore((s) => s.busquedaCosasFiltro);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarBusquedaCosas);
  const fijarQuery = useOpmStore((s) => s.fijarBusquedaCosasQuery);
  const fijarFiltro = useOpmStore((s) => s.fijarBusquedaCosasFiltro);
  const saltar = useOpmStore((s) => s.saltarAResultadoBusqueda);
  const inputRef = useRef<HTMLInputElement>(null);

  // Limpiar al abrir
  useEffect(() => {
    if (abierto && inputRef.current) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [abierto]);

  const resultados = useMemo<ResultadoBusqueda[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLocaleLowerCase("es-CL");
    const items: ResultadoBusqueda[] = [];

    for (const entidad of Object.values(modelo.entidades)) {
      if (filtro === "procesos" && entidad.tipo !== "proceso") continue;
      if (filtro === "objetos" && entidad.tipo !== "objeto") continue;
      if (!entidad.nombre.toLocaleLowerCase("es-CL").includes(q)) continue;

      // Encontrar OPDs donde aparece
      for (const opd of Object.values(modelo.opds)) {
        if (Object.values(opd.apariencias).some((ap) => ap.entidadId === entidad.id)) {
          items.push({
            entidadId: entidad.id,
            nombre: entidad.nombre,
            tipo: entidad.tipo,
            opdId: opd.id,
            opdNombre: opd.nombre,
          });
        }
      }
    }

    // Ordenar: primero por tipo (procesos), luego alfabético
    return items.sort((a, b) => {
      if (a.tipo !== b.tipo) return a.tipo === "proceso" ? -1 : 1;
      return a.nombre.localeCompare(b.nombre, "es-CL");
    });
  }, [modelo, query, filtro]);

  // Color semántico por tipo (JOYAS §1)
  const colorTipo = (tipo: TipoEntidad): string =>
    tipo === "objeto" ? tokens.colors.canvas.objeto : tokens.colors.canvas.proceso;

  return (
    <Dialogo
      open={abierto}
      title="Buscar Cosas del Modelo"
      onCancel={cerrar}
      initialFocusRef={inputRef}
      actions={(
        <button type="button" style={style.primaryButton} onClick={cerrar}>
          Cerrar
        </button>
      )}
    >
      <div style={style.body}>
        <div style={style.filtros}>
          <input
            ref={inputRef}
            type="search"
            style={style.searchInput}
            placeholder="Buscar por nombre..."
            value={query}
            onInput={(e) => fijarQuery(e.currentTarget.value)}
          />
          <select
            aria-label="Filtro por tipo"
            style={style.filterSelect}
            value={filtro}
            onChange={(e) => fijarFiltro(e.currentTarget.value as "todos" | "procesos" | "objetos")}
          >
            <option value="todos">Todos</option>
            <option value="procesos">Procesos</option>
            <option value="objetos">Objetos</option>
          </select>
        </div>
        <div style={style.resultados}>
          {resultados.length === 0 && query.trim() ? (
            <div style={style.empty}>Sin resultados</div>
          ) : resultados.length === 0 ? (
            <div style={style.empty}>Escribe para buscar entidades del modelo</div>
          ) : (
            <table style={style.tabla}>
              <thead>
                <tr>
                  <th style={style.th}>Elemento</th>
                  <th style={style.th}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r, i) => (
                  <tr
                    key={`${r.entidadId}-${r.opdId}-${i}`}
                    style={style.fila}
                    onClick={() => saltar(r.entidadId, r.opdId)}
                  >
                    <td style={style.td}>
                      <span style={{ ...style.tipoIndicador, background: colorTipo(r.tipo) }} />
                      <span style={style.tdName}>{r.nombre}</span>
                      <span style={style.tdTipo}>{r.tipo === "objeto" ? "Objeto" : "Proceso"}</span>
                    </td>
                    <td style={style.td}>{r.opdNombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Dialogo>
  );
}

const style = {
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  filtros: {
    display: "flex",
    gap: "8px",
  },
  searchInput: {
    flex: "1 1 auto",
    height: "34px",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    padding: "0 10px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  filterSelect: {
    height: "34px",
    width: "130px",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
  },
  resultados: {
    maxHeight: "300px",
    overflow: "auto",
  },
  empty: {
    padding: "14px",
    color: tokens.colors.textoTerciario,
    fontSize: "13px",
    fontWeight: 600,
  },
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    padding: "6px 8px",
    borderBottom: `2px solid ${tokens.colors.bordeIntermedio}`,
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "left",
  },
  fila: {
    borderBottom: `1px solid ${tokens.colors.fondoDeshabilitado}`,
    cursor: "pointer",
  },
  td: {
    padding: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tipoIndicador: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  tdName: {
    fontWeight: 600,
    color: tokens.colors.textoPrimario,
  },
  tdTipo: {
    color: tokens.colors.textoDeshabilitado,
    fontSize: "11px",
    fontWeight: 600,
  },
  primaryButton: {
    height: "34px",
    padding: "0 14px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.chromeNeutral,
    color: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
