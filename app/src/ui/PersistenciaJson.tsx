import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";

export function PersistenciaJson() {
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const importarJson = useOpmStore((s) => s.importarJson);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const listarModelosGuardados = useOpmStore((s) => s.listarModelosGuardados);
  const cargarLocal = useOpmStore((s) => s.cargarLocal);
  const borrarLocal = useOpmStore((s) => s.borrarLocal);
  const [texto, setTexto] = useState("");
  const [modeloSeleccionadoId, setModeloSeleccionadoId] = useState("");
  const modeloSeleccionado = modeloSeleccionadoId || modelosGuardados[0]?.id || "";

  useEffect(() => {
    listarModelosGuardados();
  }, [listarModelosGuardados]);

  useEffect(() => {
    if (!modeloSeleccionadoId && modelosGuardados[0]?.id) setModeloSeleccionadoId(modelosGuardados[0].id);
    if (modeloSeleccionadoId && !modelosGuardados.some((modelo) => modelo.id === modeloSeleccionadoId)) {
      setModeloSeleccionadoId(modelosGuardados[0]?.id ?? "");
    }
  }, [modeloSeleccionadoId, modelosGuardados]);

  return (
    <div style={style.block}>
      <div style={style.title}>Modelos locales</div>
      <div style={style.actions}>
        <select
          aria-label="Modelo local"
          style={style.select}
          value={modeloSeleccionado}
          onChange={(event) => setModeloSeleccionadoId(event.currentTarget.value)}
        >
          {modelosGuardados.length === 0 ? <option value="">Sin modelos</option> : null}
          {modelosGuardados.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
          ))}
        </select>
        <button type="button" style={modeloSeleccionado ? style.button : style.disabledButton} disabled={!modeloSeleccionado} onClick={() => cargarLocal(modeloSeleccionado)}>Cargar</button>
        <button type="button" style={modeloSeleccionado ? style.button : style.disabledButton} disabled={!modeloSeleccionado} onClick={() => borrarLocal(modeloSeleccionado)}>Borrar</button>
      </div>
      <div style={style.title}>JSON</div>
      <div style={style.actions}>
        <button type="button" style={style.button} onClick={() => setTexto(exportarJson())}>Exportar</button>
        <button type="button" style={style.button} onClick={() => importarJson(texto)}>Importar</button>
      </div>
      <textarea
        style={style.textarea}
        value={texto}
        spellcheck={false}
        onInput={(event) => setTexto(event.currentTarget.value)}
      />
    </div>
  );
}

const style = {
  block: {
    display: "grid",
    gap: "8px",
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid #e4eaf1",
  },
  title: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  button: {
    height: "30px",
    padding: "0 10px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  disabledButton: {
    height: "30px",
    padding: "0 10px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    cursor: "default",
    fontSize: "12px",
    fontWeight: 600,
  },
  select: {
    minWidth: 0,
    flex: "1 1 auto",
    height: "30px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "12px",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    resize: "vertical",
    padding: "8px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    color: "#1f2937",
    background: "#ffffff",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "11px",
    lineHeight: 1.4,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
