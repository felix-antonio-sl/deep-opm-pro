import { useEffect } from "preact/hooks";
import { useOpmStore } from "../store";
import type { TipoEnlace } from "../modelo/tipos";

const TIPOS_ENLACE: Array<{ tipo: TipoEnlace; label: string }> = [
  { tipo: "agregacion", label: "Agregación" },
  { tipo: "instrumento", label: "Instrumento" },
  { tipo: "agente", label: "Agente" },
  { tipo: "consumo", label: "Consumo" },
  { tipo: "resultado", label: "Resultado" },
  { tipo: "efecto", label: "Efecto" },
  { tipo: "invocacion", label: "Invocación" },
];

export function Toolbar() {
  const crearObjeto = useOpmStore((s) => s.crearObjetoDemo);
  const crearProceso = useOpmStore((s) => s.crearProcesoDemo);
  const cargarDemo = useOpmStore((s) => s.cargarDemo);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const cargarLocal = useOpmStore((s) => s.cargarLocal);
  const deshacer = useOpmStore((s) => s.deshacer);
  const rehacer = useOpmStore((s) => s.rehacer);
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const limpiarMensaje = useOpmStore((s) => s.limpiarMensaje);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const mensaje = useOpmStore((s) => s.mensaje);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const dirty = useOpmStore((s) => s.dirty);
  const puedeDeshacer = useOpmStore((s) => s.puedeDeshacer);
  const puedeRehacer = useOpmStore((s) => s.puedeRehacer);
  const modelo = useOpmStore((s) => s.modelo);

  useEffect(() => {
    const manejarAtajo = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (esCampoEditable(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        rehacer();
        return;
      }
      if (key === "z") {
        event.preventDefault();
        deshacer();
        return;
      }
      if (key === "y") {
        event.preventDefault();
        rehacer();
      }
    };
    window.addEventListener("keydown", manejarAtajo);
    return () => window.removeEventListener("keydown", manejarAtajo);
  }, [deshacer, rehacer]);

  useEffect(() => {
    if (!mensaje || modoEnlace) return undefined;
    const timeout = window.setTimeout(limpiarMensaje, 4_500);
    return () => window.clearTimeout(timeout);
  }, [limpiarMensaje, mensaje, modoEnlace]);

  const selectorEnlaceDeshabilitado = !seleccionId && !modoEnlace;

  return (
    <div style={style.bar}>
      <span style={style.title}>{modelo.nombre}{dirty ? " (No guardado)" : ""}</span>
      <div style={style.actions}>
        <span style={style.divider} />
        <button style={style.button} type="button" onClick={crearObjeto}>Objeto</button>
        <button style={style.button} type="button" onClick={crearProceso}>Proceso</button>
        <span style={style.divider} />
        <button style={puedeDeshacer ? style.button : style.disabledButton} type="button" onClick={deshacer} disabled={!puedeDeshacer}>Deshacer</button>
        <button style={puedeRehacer ? style.button : style.disabledButton} type="button" onClick={rehacer} disabled={!puedeRehacer}>Rehacer</button>
        <span style={style.divider} />
        <button style={style.button} type="button" onClick={cargarDemo}>Demo</button>
        <button style={style.button} type="button" onClick={guardarLocal}>Guardar</button>
        <button style={style.button} type="button" onClick={cargarLocal}>Cargar</button>
        <span style={style.divider} />
        <label style={style.linkPicker}>
          <span style={style.linkPickerLabel}>Enlace</span>
          <select
            aria-label="Tipo de enlace"
            title={selectorEnlaceDeshabilitado ? "Selecciona una entidad origen" : undefined}
            disabled={selectorEnlaceDeshabilitado}
            style={selectorEnlaceDeshabilitado ? style.disabledSelect : modoEnlace ? style.activeSelect : style.select}
            value={modoEnlace?.tipo ?? ""}
            onChange={(event) => {
              const tipo = (event.currentTarget as HTMLSelectElement).value;
              if (tipo) elegirTipoEnlace(tipo as TipoEnlace);
              else cancelarEnlace();
            }}
          >
            <option value="">Tipo...</option>
            {TIPOS_ENLACE.map((item) => (
              <option key={item.tipo} value={item.tipo}>{item.label}</option>
            ))}
          </select>
        </label>
        {modoEnlace ? (
          <button style={style.secondaryButton} type="button" onClick={cancelarEnlace}>Cancelar</button>
        ) : null}
        {mensaje ? <span style={style.status}>{mensaje}</span> : null}
      </div>
    </div>
  );
}

const style = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 12px",
    background: "#ffffff",
    borderBottom: "1px solid #d9e0ea",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: 0,
    flex: "1 1 auto",
    overflowX: "auto",
  },
  button: {
    height: "34px",
    minWidth: "76px",
    padding: "0 14px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  disabledButton: {
    height: "34px",
    minWidth: "76px",
    padding: "0 14px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    cursor: "default",
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  title: {
    flex: "0 0 auto",
    maxWidth: "210px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  secondaryButton: {
    height: "34px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#475467",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  linkPicker: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "34px",
    flex: "0 0 auto",
  },
  linkPickerLabel: {
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  select: {
    height: "34px",
    width: "148px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 600,
  },
  activeSelect: {
    height: "34px",
    width: "148px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#e8eef5",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  disabledSelect: {
    height: "34px",
    width: "148px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "not-allowed",
  },
  divider: {
    width: "1px",
    height: "24px",
    flex: "0 0 auto",
    background: "#d9e0ea",
  },
  status: {
    color: "#475467",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function esCampoEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable=true]"));
}
