// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
// Beta1 ronda 16 L1: workbench de inspección/edición/eliminación de enlaces.
// Contrato e2e congelado en `15-superficie-contextual.spec.ts` (5 reglas duras
// del describe que originalmente vivía como skip).
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useOpmStore, store } from "../store";
import { etiquetaEnlaceNormalizada, validarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { validarMultiplicidad } from "../modelo/operaciones";
import type { Enlace, Id, Modelo, TipoEnlace } from "../modelo/tipos";
import { naturalezaDeEnlace } from "../modelo/constantes";
import { tokens } from "./tokens";

interface FilaEnlace {
  enlaceId: Id;
  origen: string;
  destino: string;
  tipo: TipoEnlace;
  etiqueta: string;
  multOrigen: string;
  multDestino: string;
  opds: string;
  opdsCount: number;
}

const COLUMNAS: ReadonlyArray<{ clave: keyof FilaEnlace; label: string; sortable: boolean }> = [
  { clave: "tipo", label: "Tipo", sortable: true },
  { clave: "origen", label: "Origen", sortable: true },
  { clave: "destino", label: "Destino", sortable: true },
  { clave: "etiqueta", label: "Etiqueta", sortable: true },
  { clave: "multOrigen", label: "Mult. origen", sortable: true },
  { clave: "multDestino", label: "Mult. destino", sortable: true },
  { clave: "opds", label: "OPDs", sortable: true },
];

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
  const irAExtremo = useOpmStore((s) => s.irAExtremoEnlaceTabla);
  const eliminarEnlaceTabla = useOpmStore((s) => s.eliminarEnlaceDesdeTabla);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);

  if (!abierta) return null;

  return (
    <TablaEnlacesContenido
      modelo={modelo}
      filtroTipo={filtroTipo}
      ordenColumna={ordenColumna}
      ordenDireccion={ordenDireccion}
      enlaceSeleccionId={enlaceSeleccionId}
      onCerrar={cerrar}
      onFiltro={fijarFiltro}
      onOrden={fijarOrden}
      onNavegar={navegar}
      onIrAExtremo={irAExtremo}
      onEliminarEnlace={eliminarEnlaceTabla}
    />
  );
}

interface ContenidoProps {
  modelo: Modelo;
  filtroTipo: TipoEnlace | "todos";
  ordenColumna: string | null;
  ordenDireccion: "asc" | "desc";
  enlaceSeleccionId: Id | null;
  onCerrar: () => void;
  onFiltro: (tipo: TipoEnlace | "todos") => void;
  onOrden: (clave: string) => void;
  onNavegar: (id: Id) => void;
  onIrAExtremo: (id: Id, lado: "origen" | "destino") => void;
  onEliminarEnlace: (id: Id) => void;
}

function TablaEnlacesContenido(props: ContenidoProps) {
  const {
    modelo,
    filtroTipo,
    ordenColumna,
    ordenDireccion,
    enlaceSeleccionId,
    onCerrar,
    onFiltro,
    onOrden,
    onNavegar,
    onIrAExtremo,
    onEliminarEnlace,
  } = props;

  // Confirmación de borrado por fila (toggle); se resetea al cerrar/cambiar selección.
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<Id | null>(null);
  // Ref a la fila seleccionada para scrollIntoView automático.
  const filaSeleccionadaRef = useRef<HTMLTableRowElement | null>(null);

  // Construir filas del modelo entero (cross-OPD).
  const filas: FilaEnlace[] = useMemo(() => {
    const lista = Object.values(modelo.enlaces)
      .filter((enlace) => filtroTipo === "todos" || enlace.tipo === filtroTipo)
      .map((enlace) => construirFila(modelo, enlace));
    if (ordenColumna) {
      lista.sort((a, b) => {
        const aVal = String((a as unknown as Record<string, unknown>)[ordenColumna] ?? "");
        const bVal = String((b as unknown as Record<string, unknown>)[ordenColumna] ?? "");
        const cmp = aVal.localeCompare(bVal, "es", { sensitivity: "base" });
        return ordenDireccion === "asc" ? cmp : -cmp;
      });
    }
    return lista;
  }, [modelo, filtroTipo, ordenColumna, ordenDireccion]);

  // Reset de confirmación de borrado cuando cambia la selección externa.
  useEffect(() => {
    setConfirmandoEliminar(null);
  }, [enlaceSeleccionId]);

  // Auto-scroll a la fila seleccionada cuando viene del canvas/OPL.
  useEffect(() => {
    if (!enlaceSeleccionId) return;
    if (!filaSeleccionadaRef.current) return;
    filaSeleccionadaRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [enlaceSeleccionId]);

  // Cerrar con Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Solo cerrar si Escape no está siendo absorbido por un input en edición.
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" && target.dataset.editandoMult === "true") return;
      onCerrar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCerrar]);

  return (
    <div role="dialog" aria-label="Tabla de enlaces" data-testid="tabla-enlaces" style={overlayStyle}>
      <div style={panelStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Tabla de Enlaces ({filas.length})</h2>
          <button
            type="button"
            style={closeButtonStyle}
            onClick={onCerrar}
            aria-label="Cerrar"
            data-testid="tabla-enlaces-cerrar"
          >
            ✕
          </button>
        </div>

        <div style={toolbarStyle}>
          <label style={filterLabelStyle}>
            Filtrar:
            <select
              style={filterSelectStyle}
              value={filtroTipo}
              onChange={(e) => onFiltro(e.currentTarget.value as TipoEnlace | "todos")}
              data-testid="tabla-enlaces-filtro"
              aria-label="Filtrar por tipo de enlace"
            >
              <option value="todos">Todos</option>
              <option value="agregacion">Agregación</option>
              <option value="exhibicion">Exhibición</option>
              <option value="generalizacion">Generalización</option>
              <option value="clasificacion">Clasificación</option>
              <option value="etiquetado">Etiquetado</option>
              <option value="etiquetadoBidireccional">Etiquetado bidireccional</option>
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
          <table style={tableStyle} data-testid="tabla-enlaces-grid">
            <thead>
              <tr>
                {COLUMNAS.map(({ clave, label }) => (
                  <th
                    key={clave}
                    style={thStyle}
                    onClick={() => onOrden(clave)}
                    role="columnheader"
                    aria-sort={ordenColumna === clave
                      ? ordenDireccion === "asc" ? "ascending" : "descending"
                      : "none"}
                    data-testid={`tabla-enlaces-col-${clave}`}
                  >
                    {label}
                    {ordenColumna === clave ? (ordenDireccion === "asc" ? " ▴" : " ▾") : ""}
                  </th>
                ))}
                <th style={thAccionesStyle} aria-label="Acciones de fila">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => {
                const seleccionada = fila.enlaceId === enlaceSeleccionId;
                const confirmando = confirmandoEliminar === fila.enlaceId;
                return (
                  <FilaEnlaceRow
                    key={fila.enlaceId}
                    fila={fila}
                    modelo={modelo}
                    seleccionada={seleccionada}
                    confirmando={confirmando}
                    refSeleccionada={seleccionada ? filaSeleccionadaRef : null}
                    onNavegar={() => onNavegar(fila.enlaceId)}
                    onIrAExtremo={(lado) => onIrAExtremo(fila.enlaceId, lado)}
                    onPedirEliminar={() => setConfirmandoEliminar(fila.enlaceId)}
                    onCancelarEliminar={() => setConfirmandoEliminar(null)}
                    onConfirmarEliminar={() => {
                      onEliminarEnlace(fila.enlaceId);
                      setConfirmandoEliminar(null);
                    }}
                  />
                );
              })}
              {filas.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNAS.length + 1} style={emptyStyle} data-testid="tabla-enlaces-vacio">
                    Sin enlaces que mostrar
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={footerStyle}>
          <button
            type="button"
            style={closeFooterButtonStyle}
            onClick={onCerrar}
            data-testid="tabla-enlaces-cerrar-footer"
          >
            Cerrar (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}

interface FilaProps {
  fila: FilaEnlace;
  modelo: Modelo;
  seleccionada: boolean;
  confirmando: boolean;
  refSeleccionada: { current: HTMLTableRowElement | null } | null;
  onNavegar: () => void;
  onIrAExtremo: (lado: "origen" | "destino") => void;
  onPedirEliminar: () => void;
  onCancelarEliminar: () => void;
  onConfirmarEliminar: () => void;
}

function FilaEnlaceRow(props: FilaProps) {
  const {
    fila,
    modelo,
    seleccionada,
    confirmando,
    refSeleccionada,
    onNavegar,
    onIrAExtremo,
    onPedirEliminar,
    onCancelarEliminar,
    onConfirmarEliminar,
  } = props;
  const trEstilo: preact.JSX.CSSProperties = {
    ...trStyle,
    background: seleccionada ? tokens.colors.acentoUiSuave : "transparent",
    boxShadow: seleccionada ? tokens.shadows.seleccionadoInset : "none",
  };
  const enlace = modelo.enlaces[fila.enlaceId];
  if (!enlace) return null;
  return (
    <tr
      ref={refSeleccionada}
      style={trEstilo}
      onClick={onNavegar}
      title="Click: navegar al enlace en el canvas (cierra la tabla)"
      data-testid="tabla-enlaces-fila"
      data-enlace-id={fila.enlaceId}
      aria-selected={seleccionada}
    >
      <td style={{ ...tdStyle, color: tipoColor(fila.tipo), fontWeight: 700 }} data-testid="tabla-enlaces-celda-tipo">
        {capitalizar(fila.tipo)}
      </td>
      <td style={tdStyle} data-testid="tabla-enlaces-celda-origen">{fila.origen}</td>
      <td style={tdStyle} data-testid="tabla-enlaces-celda-destino">{fila.destino}</td>
      <td style={tdStyle}>
        <CeldaEtiqueta enlace={enlace} />
      </td>
      <td style={tdStyle}>
        <CeldaMultiplicidad enlaceId={fila.enlaceId} valorActual={fila.multOrigen} lado="origen" />
      </td>
      <td style={tdStyle}>
        <CeldaMultiplicidad enlaceId={fila.enlaceId} valorActual={fila.multDestino} lado="destino" />
      </td>
      <td style={tdStyle} data-testid="tabla-enlaces-celda-opds" title={fila.opds}>
        {fila.opdsCount === 0 ? "—" : `${fila.opdsCount}`}
      </td>
      <td style={tdAccionesStyle} onClick={(e) => e.stopPropagation()}>
        <div style={accionesContainerStyle}>
          <button
            type="button"
            style={accionBotonStyle}
            onClick={() => onIrAExtremo("origen")}
            title="Ir al OPD del origen y seleccionarlo"
            aria-label={`Ir a origen de ${fila.origen}`}
            data-testid="tabla-enlaces-ir-origen"
          >
            ←{" "}Origen
          </button>
          <button
            type="button"
            style={accionBotonStyle}
            onClick={() => onIrAExtremo("destino")}
            title="Ir al OPD del destino y seleccionarlo"
            aria-label={`Ir a destino de ${fila.destino}`}
            data-testid="tabla-enlaces-ir-destino"
          >
            Destino{" "}→
          </button>
          {confirmando ? (
            <>
              <button
                type="button"
                style={accionBotonPeligroStyle}
                onClick={onConfirmarEliminar}
                aria-label={`Confirmar eliminación del enlace ${capitalizar(fila.tipo)} ${fila.origen} → ${fila.destino}`}
                data-testid="tabla-enlaces-confirmar-eliminar"
              >
                Confirmar
              </button>
              <button
                type="button"
                style={accionBotonStyle}
                onClick={onCancelarEliminar}
                aria-label="Cancelar eliminación"
                data-testid="tabla-enlaces-cancelar-eliminar"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              style={accionBotonPeligroStyle}
              onClick={onPedirEliminar}
              title="Eliminar enlace (cross-OPD)"
              aria-label={`Eliminar enlace ${capitalizar(fila.tipo)} ${fila.origen} → ${fila.destino}`}
              data-testid="tabla-enlaces-eliminar"
            >
              Eliminar
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

interface CeldaEtiquetaProps {
  enlace: Enlace;
}

/**
 * Edición in-place de etiqueta. Estado local mientras se edita; commit a store
 * en blur o Enter (preferencia documentada en brief L1 §10). Border rojo si la
 * etiqueta es inválida según validarEtiquetaEnlace.
 *
 * Implementación: usamos refs sincronizadas con el state para que el blur
 * (disparado tras Escape via .blur()) lea el valor revertido en lugar del
 * "abc" en el closure stale del callback inline.
 */
function CeldaEtiqueta({ enlace }: CeldaEtiquetaProps) {
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const [valor, setValor] = useState(enlace.etiqueta);
  const [error, setError] = useState<string | null>(null);
  const valorRef = useRef(valor);
  valorRef.current = valor;
  // Sincronizar con cambios externos (ej: edición desde InspectorEnlace).
  useEffect(() => {
    setValor(enlace.etiqueta);
    setError(null);
    valorRef.current = enlace.etiqueta;
  }, [enlace.id, enlace.etiqueta]);

  const commit = (): boolean => {
    const normalizada = etiquetaEnlaceNormalizada(valorRef.current);
    const validacion = validarEtiquetaEnlace(enlace, normalizada);
    if (!validacion.ok) {
      setError(validacion.error);
      return false;
    }
    setError(null);
    if (normalizada === enlace.etiqueta) return true;
    // Cargar el enlace en seleccionId del slice antes del rename (la acción
    // mira enlaceSeleccionId).
    const st = store.getState();
    if (st.enlaceSeleccionId !== enlace.id) {
      st.seleccionarEnlace(enlace.id);
    }
    renombrarEtiquetaEnlace(normalizada);
    return true;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget as HTMLInputElement;
      const ok = commit();
      // Solo blur si el commit fue válido: si hay error, mantenemos el foco
      // para que el operador pueda corregir o cancelar con Escape.
      if (ok) target.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setValor(enlace.etiqueta);
      setError(null);
      valorRef.current = enlace.etiqueta;
    }
  };

  return (
    <input
      style={{
        ...inlineInputStyle,
        border: `1px solid ${error ? tokens.colors.errorBorde : "transparent"}`,
      }}
      value={valor}
      onClick={(e) => e.stopPropagation()}
      onInput={(e) => setValor(e.currentTarget.value)}
      onBlur={commit}
      onKeyDown={onKeyDown}
      title={error ?? "Etiqueta del enlace (Enter para confirmar, Escape para cancelar)"}
      aria-label={`Etiqueta del enlace ${enlace.id}`}
      aria-invalid={error ? true : false}
      data-testid="tabla-enlaces-etiqueta-input"
    />
  );
}

interface CeldaMultiplicidadProps {
  enlaceId: Id;
  valorActual: string;
  lado: "origen" | "destino";
}

/**
 * Edición in-place de multiplicidad. Border rojo si el valor es inválido
 * según validarMultiplicidad. Commit en blur o Enter; Escape revierte.
 * Cadena vacía es válida (quita la multiplicidad).
 *
 * Refs sincronizadas con state para que el blur tras Escape lea el valor
 * revertido en lugar del closure inicial.
 */
function CeldaMultiplicidad({ enlaceId, valorActual, lado }: CeldaMultiplicidadProps) {
  const fijarMultiplicidad = useOpmStore((s) => s.fijarMultiplicidadEnlace);
  const [valor, setValor] = useState(valorActual);
  const [error, setError] = useState<string | null>(null);
  const valorRef = useRef(valor);
  valorRef.current = valor;
  useEffect(() => {
    setValor(valorActual);
    setError(null);
    valorRef.current = valorActual;
  }, [enlaceId, valorActual]);

  const commit = (): boolean => {
    const trimmed = valorRef.current.trim();
    if (trimmed !== "" && !validarMultiplicidad(trimmed)) {
      setError("Usa 1, *, 2..N, 0..N o 1..5");
      return false;
    }
    setError(null);
    if (trimmed === valorActual) return true;
    fijarMultiplicidad(enlaceId, lado, trimmed);
    return true;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget as HTMLInputElement;
      const ok = commit();
      if (ok) target.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setValor(valorActual);
      setError(null);
      valorRef.current = valorActual;
    }
  };

  return (
    <input
      style={{
        ...inlineInputStyle,
        border: `1px solid ${error ? tokens.colors.errorBorde : "transparent"}`,
      }}
      value={valor}
      placeholder="1, *, N"
      data-editando-mult="true"
      onClick={(e) => e.stopPropagation()}
      onInput={(e) => setValor(e.currentTarget.value)}
      onBlur={commit}
      onKeyDown={onKeyDown}
      title={error ?? `Multiplicidad ${lado} (Enter confirma, Escape cancela)`}
      aria-label={`Multiplicidad ${lado} del enlace ${enlaceId}`}
      aria-invalid={error ? true : false}
      data-testid={`tabla-enlaces-mult-${lado}-input`}
    />
  );
}

function construirFila(modelo: Modelo, enlace: Enlace): FilaEnlace {
  const opdsConApariencia: string[] = [];
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlace.id)) {
      opdsConApariencia.push(opd.nombre);
    }
  }
  return {
    enlaceId: enlace.id,
    origen: nombreExtremo(modelo, enlace.origenId.id),
    destino: nombreExtremo(modelo, enlace.destinoId.id),
    tipo: enlace.tipo,
    etiqueta: enlace.etiqueta,
    multOrigen: enlace.multiplicidadOrigen ?? "",
    multDestino: enlace.multiplicidadDestino ?? "",
    opds: opdsConApariencia.join(", "),
    opdsCount: opdsConApariencia.length,
  };
}

function nombreExtremo(modelo: Modelo, extremoId: string): string {
  const entidad = modelo.entidades[extremoId];
  if (entidad) return entidad.nombre;
  const estado = modelo.estados[extremoId];
  if (estado) {
    const portadora = modelo.entidades[estado.entidadId];
    return portadora ? `${portadora.nombre}.${estado.nombre}` : estado.nombre;
  }
  return extremoId;
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function tipoColor(tipo: TipoEnlace): string {
  return naturalezaDeEnlace(tipo) === "estructural"
    ? tokens.colors.canvas.objeto
    : tokens.colors.canvas.proceso;
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
  width: "min(96vw, 1100px)",
  maxHeight: "88vh",
  background: tokens.colors.fondoChrome,
  borderRadius: tokens.radii.lg,
  boxShadow: tokens.shadows.tabla,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle: preact.JSX.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  borderBottom: `1px solid ${tokens.colors.bordeTabla}`,
};

const titleStyle: preact.JSX.CSSProperties = {
  margin: 0,
  fontSize: `${tokens.typography.sizes.xl}px`,
  fontWeight: tokens.typography.weights.bold,
  color: tokens.colors.textoPrimario,
};

const closeButtonStyle: preact.JSX.CSSProperties = {
  width: "32px",
  height: "32px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  color: tokens.colors.textoTerciario,
  cursor: "pointer",
  borderRadius: tokens.radii.sm,
};

const toolbarStyle: preact.JSX.CSSProperties = {
  padding: "10px 20px",
  borderBottom: `1px solid ${tokens.colors.bordeTabla}`,
  background: tokens.colors.fondoTabla,
};

const filterLabelStyle: preact.JSX.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: `${tokens.typography.sizes.md}px`,
  fontWeight: tokens.typography.weights.semibold,
  color: tokens.colors.textoSecundario,
};

const filterSelectStyle: preact.JSX.CSSProperties = {
  minHeight: "30px",
  padding: "0 8px",
  border: `1px solid ${tokens.colors.bordeControl}`,
  borderRadius: tokens.radii.sm,
  fontSize: `${tokens.typography.sizes.md}px`,
  outlineColor: tokens.colors.chromeNeutral,
};

const tableContainerStyle: preact.JSX.CSSProperties = {
  flex: 1,
  overflow: "auto",
};

const tableStyle: preact.JSX.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: `${tokens.typography.sizes.sm}px`,
};

const thStyle: preact.JSX.CSSProperties = {
  position: "sticky",
  top: 0,
  background: tokens.colors.fondoNeutral,
  padding: "8px 12px",
  textAlign: "left",
  fontWeight: tokens.typography.weights.bold,
  color: tokens.colors.textoSecundario,
  borderBottom: `2px solid ${tokens.colors.bordeIntermedio}`,
  cursor: "pointer",
  whiteSpace: "nowrap",
  userSelect: "none",
  zIndex: 1,
};

const thAccionesStyle: preact.JSX.CSSProperties = {
  ...thStyle,
  cursor: "default",
  textAlign: "right",
};

const tdStyle: preact.JSX.CSSProperties = {
  padding: "6px 12px",
  borderBottom: `1px solid ${tokens.colors.bordeFila}`,
  color: tokens.colors.textoPrimario,
  verticalAlign: "middle",
};

const tdAccionesStyle: preact.JSX.CSSProperties = {
  ...tdStyle,
  textAlign: "right",
  whiteSpace: "nowrap",
};

const accionesContainerStyle: preact.JSX.CSSProperties = {
  display: "inline-flex",
  gap: "6px",
  justifyContent: "flex-end",
  flexWrap: "nowrap",
};

const accionBotonStyle: preact.JSX.CSSProperties = {
  minHeight: "26px",
  padding: "0 8px",
  border: `1px solid ${tokens.colors.bordeControl}`,
  borderRadius: tokens.radii.sm,
  background: tokens.colors.fondoCard,
  color: tokens.colors.textoSecundario,
  cursor: "pointer",
  fontSize: `${tokens.typography.sizes.xs}px`,
  fontWeight: tokens.typography.weights.semibold,
};

const accionBotonPeligroStyle: preact.JSX.CSSProperties = {
  ...accionBotonStyle,
  border: `1px solid ${tokens.colors.errorBorde}`,
  background: tokens.colors.errorFondo,
  color: tokens.colors.errorTexto,
};

const trStyle: preact.JSX.CSSProperties = {
  cursor: "pointer",
};

const inlineInputStyle: preact.JSX.CSSProperties = {
  width: "100%",
  minWidth: "60px",
  padding: "2px 6px",
  borderRadius: tokens.radii.xs,
  background: "transparent",
  fontSize: `${tokens.typography.sizes.sm}px`,
  color: tokens.colors.textoPrimario,
  outline: "none",
};

const emptyStyle: preact.JSX.CSSProperties = {
  padding: "24px",
  textAlign: "center",
  color: tokens.colors.textoTerciario,
  fontSize: `${tokens.typography.sizes.md}px`,
  fontWeight: tokens.typography.weights.semibold,
};

const footerStyle: preact.JSX.CSSProperties = {
  padding: "12px 20px",
  borderTop: `1px solid ${tokens.colors.bordeTabla}`,
  display: "flex",
  justifyContent: "flex-end",
};

const closeFooterButtonStyle: preact.JSX.CSSProperties = {
  minHeight: "32px",
  padding: "0 16px",
  border: `1px solid ${tokens.colors.bordeControl}`,
  borderRadius: tokens.radii.sm,
  background: tokens.colors.fondoCard,
  color: tokens.colors.textoSecundario,
  cursor: "pointer",
  fontSize: `${tokens.typography.sizes.md}px`,
  fontWeight: tokens.typography.weights.bold,
};
