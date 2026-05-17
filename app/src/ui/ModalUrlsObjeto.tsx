// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useModalUrlsObjetoViewModel } from "../app/viewmodels/modalUrlsObjetoViewModel";
import { TIPOS_URL_OBJETO } from "../modelo/objetoMetadata";
import type { TipoUrlObjeto } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

export function ModalUrlsObjeto() {
  const { abierto, entidad, cerrar, agregar, eliminar } = useModalUrlsObjetoViewModel();
  const [tipo, setTipo] = useState<TipoUrlObjeto>("articulo");
  const [url, setUrl] = useState("");

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
  input: { height: "34px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, fontSize: "13px" },
  list: { display: "grid", gap: "6px" },
  row: { display: "grid", gridTemplateColumns: "84px minmax(0, 1fr) auto", alignItems: "center", gap: "8px", padding: "8px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm },
  kind: { color: tokens.colors.chromeNeutral, fontWeight: 700, fontSize: "12px" },
  url: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: tokens.colors.enlaceTexto, fontWeight: 700 },
  empty: { padding: "12px", border: `1px dashed ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, color: tokens.colors.textoTerciario, fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  dangerButton: { height: "30px", padding: "0 10px", border: `1px solid ${tokens.colors.errorBorde}`, borderRadius: tokens.radii.sm, background: tokens.colors.errorFondo, color: tokens.colors.errorTexto, cursor: "pointer", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
