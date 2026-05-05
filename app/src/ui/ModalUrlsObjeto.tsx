import { useState } from "preact/hooks";
import { TIPOS_URL_OBJETO } from "../modelo/objetoMetadata";
import { useOpmStore } from "../store";
import type { TipoUrlObjeto } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";

export function ModalUrlsObjeto() {
  const abierto = useOpmStore((s) => s.modalUrlsAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarModalUrls);
  const agregar = useOpmStore((s) => s.agregarUrlAEntidad);
  const eliminar = useOpmStore((s) => s.eliminarUrlDeEntidad);
  const [tipo, setTipo] = useState<TipoUrlObjeto>("articulo");
  const [url, setUrl] = useState("");
  const entidad = abierto ? modelo.entidades[abierto] : undefined;

  return (
    <Dialogo
      open={abierto !== null}
      title={`URLs de ${entidad?.nombre ?? "objeto"}`}
      onCancel={cerrar}
      actions={<button type="button" style={style.secondaryButton} onClick={cerrar}>Cerrar</button>}
    >
      <div style={style.body}>
        <div style={style.form}>
          <select style={style.input} value={tipo} onChange={(event) => setTipo(event.currentTarget.value as TipoUrlObjeto)}>
            {TIPOS_URL_OBJETO.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input
            style={style.input}
            value={url}
            onInput={(event) => setUrl(event.currentTarget.value)}
            placeholder="https://..."
          />
          <button
            type="button"
            style={style.primaryButton}
            onClick={() => {
              if (!entidad || !url.trim()) return;
              agregar(entidad.id, { tipo, url });
              setUrl("");
            }}
          >
            Agregar
          </button>
        </div>
        {(entidad?.urls ?? []).length === 0 ? (
          <div style={style.empty}>Sin URLs tipadas.</div>
        ) : (
          <div style={style.list}>
            {(entidad?.urls ?? []).map((item) => (
              <div key={item.id} style={style.row}>
                <span style={style.kind}>{item.tipo}</span>
                <a href={item.url} target="_blank" rel="noreferrer" style={style.url}>{item.url}</a>
                <button type="button" style={style.dangerButton} onClick={() => entidad && eliminar(entidad.id, item.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialogo>
  );
}

const style = {
  body: { display: "grid", gap: "10px", minWidth: "min(640px, calc(100vw - 80px))" },
  form: { display: "grid", gridTemplateColumns: "130px minmax(0, 1fr) auto", gap: "8px" },
  input: { height: "34px", padding: "0 8px", border: "1px solid #c8d2df", borderRadius: "4px", fontSize: "13px" },
  list: { display: "grid", gap: "6px" },
  row: { display: "grid", gridTemplateColumns: "84px minmax(0, 1fr) auto", alignItems: "center", gap: "8px", padding: "8px", border: "1px solid #d9e0ea", borderRadius: "4px" },
  kind: { color: "#586D8C", fontWeight: 700, fontSize: "12px" },
  url: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#166496", fontWeight: 700 },
  empty: { padding: "12px", border: "1px dashed #c8d2df", borderRadius: "4px", color: "#667085", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 12px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  dangerButton: { height: "30px", padding: "0 10px", border: "1px solid #f2b8b5", borderRadius: "4px", background: "#fff5f5", color: "#b42318", cursor: "pointer", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
