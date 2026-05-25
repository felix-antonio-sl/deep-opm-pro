// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useModalUrlsObjetoViewModel } from "../app/viewmodels/modalUrlsObjetoViewModel";
import { TIPOS_URL_OBJETO } from "../modelo/objetoMetadata";
import type { TipoUrlObjeto } from "../modelo/tipos";
import { Dialogo, DialogoAccion } from "./Dialogo";
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
      actions={<DialogoAccion onClick={cerrar}>Cerrar</DialogoAccion>}
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

// Ronda 28 L5: Bauhaus monocromático. URLs en focus (ultramar) — único uso
// canónico de azul fuera del focus visible (semántica: enlace activo).
const style = {
  body: { display: "grid", gap: "14px", minWidth: "min(640px, calc(100vw - 80px))" },
  form: { display: "grid", gridTemplateColumns: "130px minmax(0, 1fr) auto", gap: "8px" },
  input: { height: "34px", padding: "0 10px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.crimson },
  list: { display: "grid", gap: "6px" },
  row: { display: "grid", gridTemplateColumns: "84px minmax(0, 1fr) auto", alignItems: "center", gap: "8px", padding: "10px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper },
  kind: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" },
  url: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: tokens.colors.focus, fontFamily: tokens.typography.familyChrome, fontWeight: 500, fontSize: "13px" },
  empty: { padding: "16px", border: `1px dashed ${tokens.colors.ink15}`, borderRadius: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  primaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink, color: tokens.colors.paper, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  dangerButton: { minHeight: "28px", padding: "4px 12px", border: `1px solid ${tokens.colors.crimson}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.crimson, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
} satisfies Record<string, preact.JSX.CSSProperties>;
