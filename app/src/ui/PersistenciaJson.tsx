import { useState } from "preact/hooks";
import { useOpmStore } from "../store";

export function PersistenciaJson() {
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const importarJson = useOpmStore((s) => s.importarJson);
  const [texto, setTexto] = useState("");

  return (
    <div style={style.block}>
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
