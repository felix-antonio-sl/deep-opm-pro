// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef } from "preact/hooks";
import type { Apariencia, Id, Modelo, TipoEntidad } from "../modelo/tipos";
import type { BusquedaCosasFiltro, ResultadoBusquedaSalto } from "../store/tipos";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
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

type ResultadoTipo = "objeto" | "proceso" | "estado" | "enlace";

interface ResultadoBusqueda {
  /** Clave única para `key=` y testid. */
  clave: string;
  /** Tipo a mostrar en la fila. */
  tipo: ResultadoTipo;
  /** Etiqueta principal (nombre canónico). */
  etiqueta: string;
  /** Etiqueta secundaria (entidad padre cuando aplica, vacía si no). */
  contexto: string;
  /** Nombre del OPD destino. */
  opdNombre: string;
  /** Payload para `saltarAResultadoBusqueda`. */
  salto: ResultadoBusquedaSalto;
}

const ETIQUETA_TIPO: Record<ResultadoTipo, string> = {
  objeto: "Objeto",
  proceso: "Proceso",
  estado: "Estado",
  enlace: "Enlace",
};

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

  // Foco al abrir; el `Dialogo` base ya maneja Escape y trap de tab.
  useEffect(() => {
    if (abierto && inputRef.current) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [abierto]);

  const resultados = useMemo<ResultadoBusqueda[]>(
    () => calcularResultados(modelo, query, filtro),
    [modelo, query, filtro],
  );

  return (
    <Dialogo
      open={abierto}
      title="Buscar Cosas del Modelo"
      onCancel={cerrar}
      initialFocusRef={inputRef}
      size="lg"
      testId="dialogo-buscar-cosas"
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
                    <td style={style.tdUbicacion}>{r.opdNombre}</td>
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

/* ────────────────────────────────────────────────────────────────────────── */
/* Lógica de búsqueda                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Calcula apariciones que matchean `query` bajo el filtro `filtro`.
 * Pure: solo lee `modelo`. Sin caché global; si la performance fuera un
 * problema observable, indexar derivados (no introducir índice persistente).
 */
function calcularResultados(
  modelo: Modelo,
  query: string,
  filtro: BusquedaCosasFiltro,
): ResultadoBusqueda[] {
  const q = query.trim().toLocaleLowerCase("es-CL");
  if (!q) return [];

  const resultados: ResultadoBusqueda[] = [];
  const incluyeObjetos = filtro === "todos" || filtro === "objetos";
  const incluyeProcesos = filtro === "todos" || filtro === "procesos";
  const incluyeEstados = filtro === "todos" || filtro === "estados";
  const incluyeEnlaces = filtro === "todos" || filtro === "enlaces";

  // Apariciones de entidades (una fila por OPD donde aparece).
  if (incluyeObjetos || incluyeProcesos) {
    for (const entidad of Object.values(modelo.entidades)) {
      if (entidad.tipo === "objeto" && !incluyeObjetos) continue;
      if (entidad.tipo === "proceso" && !incluyeProcesos) continue;
      if (!entidad.nombre.toLocaleLowerCase("es-CL").includes(q)) continue;

      for (const opd of Object.values(modelo.opds)) {
        const apariencia = aparienciaDeEntidadEnOpd(opd.apariencias, entidad.id);
        if (!apariencia) continue;
        resultados.push({
          clave: `entidad:${entidad.id}:${opd.id}`,
          tipo: entidad.tipo as "objeto" | "proceso",
          etiqueta: entidad.nombre,
          contexto: "",
          opdNombre: opd.nombre,
          salto: {
            tipo: "entidad",
            entidadId: entidad.id,
            opdId: opd.id,
            aparienciaId: apariencia.id,
          },
        });
      }
    }
  }

  // Apariciones de estados (en OPDs donde la entidad padre tiene apariencia).
  if (incluyeEstados) {
    for (const estado of Object.values(modelo.estados)) {
      if (!estado.nombre.toLocaleLowerCase("es-CL").includes(q)) continue;
      const entidad = modelo.entidades[estado.entidadId];
      if (!entidad) continue;
      for (const opd of Object.values(modelo.opds)) {
        const apariencia = aparienciaDeEntidadEnOpd(opd.apariencias, entidad.id);
        if (!apariencia) continue;
        resultados.push({
          clave: `estado:${estado.id}:${opd.id}`,
          tipo: "estado",
          etiqueta: estado.nombre,
          contexto: entidad.nombre,
          opdNombre: opd.nombre,
          salto: {
            tipo: "estado",
            estadoId: estado.id,
            entidadId: entidad.id,
            opdId: opd.id,
            aparienciaId: apariencia.id,
          },
        });
      }
    }
  }

  // Etiquetas de enlace (una fila por OPD donde el enlace tiene apariencia).
  if (incluyeEnlaces) {
    for (const enlace of Object.values(modelo.enlaces)) {
      const etiqueta = enlace.etiqueta?.trim() ?? "";
      if (!etiqueta) continue;
      if (!etiqueta.toLocaleLowerCase("es-CL").includes(q)) continue;
      for (const opd of Object.values(modelo.opds)) {
        const aparece = Object.values(opd.enlaces).some((ap) => ap.enlaceId === enlace.id);
        if (!aparece) continue;
        resultados.push({
          clave: `enlace:${enlace.id}:${opd.id}`,
          tipo: "enlace",
          etiqueta,
          contexto: enlace.tipo,
          opdNombre: opd.nombre,
          salto: { tipo: "enlace", enlaceId: enlace.id, opdId: opd.id },
        });
      }
    }
  }

  return resultados.sort(ordenarResultados);
}

function aparienciaDeEntidadEnOpd(
  apariencias: Record<Id, Apariencia>,
  entidadId: Id,
): Apariencia | undefined {
  return Object.values(apariencias).find((ap) => ap.entidadId === entidadId);
}

function ordenarResultados(a: ResultadoBusqueda, b: ResultadoBusqueda): number {
  // Procesos primero, luego objetos, luego estados, luego enlaces.
  const orden: Record<ResultadoTipo, number> = { proceso: 0, objeto: 1, estado: 2, enlace: 3 };
  if (orden[a.tipo] !== orden[b.tipo]) return orden[a.tipo] - orden[b.tipo];
  const cmp = a.etiqueta.localeCompare(b.etiqueta, "es-CL");
  if (cmp !== 0) return cmp;
  return a.opdNombre.localeCompare(b.opdNombre, "es-CL");
}

function colorIndicador(tipo: ResultadoTipo): string {
  if (tipo === "objeto" || tipo === "estado") return tokens.colors.canvas.objeto;
  if (tipo === "proceso") return tokens.colors.canvas.proceso;
  return tokens.colors.canvas.enlace;
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
  contador: {
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 700,
  },
  resultados: {
    maxHeight: "360px",
    overflow: "auto",
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
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
    background: tokens.colors.fondoTabla,
    position: "sticky",
    top: 0,
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
  tdUbicacion: {
    padding: "8px",
    color: tokens.colors.textoSecundario,
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
  tdContexto: {
    color: tokens.colors.textoTerciario,
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
