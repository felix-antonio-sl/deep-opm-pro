// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef } from "preact/hooks";
import { useDialogoBuscarCosasViewModel, type BusquedaCosasFiltro, type ResultadoTipo } from "../app/viewmodels/busquedaCosasViewModel";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * DialogoBuscarCosas — búsqueda intra-modelo (ronda 16 L2 / Beta1).
 *
 * Slice mínimo:
 *   - Una fila por aparición visible (entidad/estado en un OPD; enlace en un OPD).
 *   - Click salta al OPD destino, selecciona en canvas y dispara halo temporal
 *     (3s) + sincroniza OPL via `seleccionId/enlaceSeleccionId` (PanelOpl ya
 *     observa esos campos y hace `scrollIntoView` automáticamente).
 *
 * Cobertura:
 *   - Entidades (objetos/procesos) por nombre canónico.
 *   - Estados por nombre, asociados a su entidad padre.
 *   - Etiquetas de enlaces (cuando el enlace tiene apariencia en algún OPD).
 *
 * Anclaje SSOT: una Thing puede aparecer en múltiples OPDs; la búsqueda opera
 * por apariencia, no solo por entidad. `opm-extracted/src/app/dialogs/
 * search-items-dialog/search-items-dialog.component.ts:231` (goToOpdById)
 * inspira el patrón visual.
 */

const ETIQUETA_TIPO: Record<ResultadoTipo, string> = {
  objeto: "Objeto",
  proceso: "Proceso",
  estado: "Estado",
  enlace: "Enlace",
};

export function DialogoBuscarCosas() {
  const { abierto, query, filtro, resultados, traibles, cerrar, fijarQuery, fijarFiltro, saltar, traerAlOpdActivo } = useDialogoBuscarCosasViewModel();
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco al abrir; el `Dialogo` base ya maneja Escape y trap de tab.
  useEffect(() => {
    if (abierto && inputRef.current) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [abierto]);

  return (
    <Dialogo
      open={abierto}
      title="Buscar Cosas del Modelo"
      onCancel={cerrar}
      initialFocusRef={inputRef}
      size="lg"
      testId="dialogo-buscar-cosas"
      actions={<DialogoAccion onClick={cerrar}>Cerrar</DialogoAccion>}
    >
      <div style={style.body}>
        <div style={style.filtros}>
          <input
            ref={inputRef}
            type="search"
            data-testid="dialogo-buscar-cosas-input"
            aria-label="Buscar por nombre"
            style={style.searchInput}
            placeholder="Buscar entidades, estados o etiquetas de enlace..."
            value={query}
            onInput={(e) => fijarQuery(e.currentTarget.value)}
          />
          <select
            aria-label="Filtro por tipo"
            data-testid="dialogo-buscar-cosas-filtro"
            style={style.filterSelect}
            value={filtro}
            onChange={(e) => fijarFiltro(e.currentTarget.value as BusquedaCosasFiltro)}
          >
            <option value="todos">Todos</option>
            <option value="objetos">Objetos</option>
            <option value="procesos">Procesos</option>
            <option value="estados">Estados</option>
            <option value="enlaces">Enlaces</option>
          </select>
        </div>
        <div style={style.contador} data-testid="dialogo-buscar-cosas-contador">
          {query.trim()
            ? `${resultados.length} ${resultados.length === 1 ? "aparición" : "apariciones"}`
            : "Escribe para buscar"}
        </div>
        <div style={style.resultados}>
          {resultados.length === 0 && query.trim() ? (
            <div style={style.empty} data-testid="dialogo-buscar-cosas-vacio">
              Sin resultados
            </div>
          ) : resultados.length === 0 ? (
            <div style={style.empty}>
              Escribe para buscar entidades, estados o etiquetas de enlace.
            </div>
          ) : (
            <table style={style.tabla}>
              <thead>
                <tr>
                  <th style={style.th}>Elemento</th>
                  <th style={style.th}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r) => (
                  <tr
                    key={r.clave}
                    data-testid="dialogo-buscar-cosas-fila"
                    style={style.fila}
                    tabIndex={0}
                    role="button"
                    aria-label={`Saltar a ${r.etiqueta} en ${r.opdNombre}`}
                    onClick={() => saltar(r.salto)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        saltar(r.salto);
                      }
                    }}
                  >
                    <td style={style.td}>
                      <span style={{ ...style.tipoIndicador, background: colorIndicador(r.tipo) }} />
                      <span style={style.tdName}>{r.etiqueta}</span>
                      <span style={style.tdTipo}>{ETIQUETA_TIPO[r.tipo]}</span>
                      {r.contexto ? <span style={style.tdContexto}>· {r.contexto}</span> : null}
                    </td>
                    <td style={style.tdUbicacion}>
                      {r.opdNombre}
                      {r.salto.tipo === "entidad" && traibles.has(r.salto.entidadId) ? (
                        <button
                          type="button"
                          data-testid="dialogo-buscar-cosas-traer"
                          style={style.traerBtn}
                          title="Crear una aparición de esta cosa en el OPD activo (la cosa es la misma; la aparición es contexto visual)"
                          onClick={(e) => {
                            e.stopPropagation();
                            traerAlOpdActivo(r.salto.tipo === "entidad" ? r.salto.entidadId : "");
                            cerrar();
                          }}
                        >
                          Traer aquí
                        </button>
                      ) : null}
                    </td>
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

function colorIndicador(tipo: ResultadoTipo): string {
  if (tipo === "objeto" || tipo === "estado") return tokens.colors.opm.object;
  if (tipo === "proceso") return tokens.colors.opm.process;
  return tokens.colors.inkMid;
}

// Ronda 28 L5: Bauhaus monocromático. Indicadores tipográficos de clase en
// chrome → paleta editorial colors.opm.* (verde objeto / azul proceso) e inkMid
// para enlace; no los aliases lime/cyan del canvas (ui-forja/GOVERNANCE §4). A5-2.
const style = {
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  filtros: {
    display: "flex",
    gap: "8px",
  },
  searchInput: {
    flex: "1 1 auto",
    height: "34px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    boxSizing: "border-box",
    caretColor: tokens.colors.accent,
  },
  filterSelect: {
    height: "34px",
    width: "130px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
  },
  contador: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  resultados: {
    maxHeight: "360px",
    overflow: "auto",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
  },
  empty: {
    padding: "16px",
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 400,
  },
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
  },
  th: {
    padding: "8px 10px",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    color: tokens.colors.ink50,
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    textAlign: "left",
    background: tokens.colors.paper,
    position: "sticky",
    top: 0,
  },
  fila: {
    borderBottom: `1px solid ${tokens.colors.ink08}`,
    cursor: "pointer",
  },
  td: {
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tdUbicacion: {
    padding: "8px 10px",
    color: tokens.colors.ink70,
  },
  traerBtn: {
    marginLeft: "8px",
    padding: "2px 8px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 500,
    color: tokens.colors.ink,
    background: tokens.colors.paper,
    border: `1px solid ${tokens.colors.ink30}`,
    borderRadius: "3px",
    cursor: "pointer",
  },
  tipoIndicador: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  tdName: {
    fontWeight: 500,
    color: tokens.colors.ink,
  },
  tdTipo: {
    color: tokens.colors.ink50,
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tdContexto: {
    color: tokens.colors.ink70,
    fontSize: "11px",
    fontWeight: 400,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
