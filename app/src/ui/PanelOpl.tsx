import { generarOpl } from "../opl/generar";
import { useOpmStore } from "../store";

export function PanelOpl() {
  const modelo = useOpmStore((s) => s.modelo);
  const lineas = generarOpl(modelo);

  return (
    <aside style={style.panel}>
      {lineas.length === 0 ? (
        <span style={style.empty}>Sin OPL todavía.</span>
      ) : (
        lineas.map((linea, index) => <div key={`${index}-${linea}`}>{renderOpl(linea)}</div>)
      )}
    </aside>
  );
}

function renderOpl(linea: string) {
  return linea.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((parte, index) => {
    if (parte.startsWith("**") && parte.endsWith("**")) {
      return <strong key={index} style={style.objeto}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith("*") && parte.endsWith("*")) {
      return <em key={index} style={style.proceso}>{parte.slice(1, -1)}</em>;
    }
    return <span key={index}>{parte}</span>;
  });
}

const style = {
  panel: {
    overflow: "auto",
    padding: "12px 16px",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "13px",
    lineHeight: 1.7,
  },
  empty: {
    color: "#667085",
  },
  objeto: {
    color: "#1f7a3c",
    fontWeight: 700,
  },
  proceso: {
    color: "#147aa5",
    fontStyle: "italic",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
