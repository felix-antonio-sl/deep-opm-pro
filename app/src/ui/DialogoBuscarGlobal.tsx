// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef } from "preact/hooks";
import { useBusquedaGlobalViewModel } from "../app/viewmodels/busquedaGlobalViewModel";
import { Dialogo } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

export function DialogoBuscarGlobal() {
  const { open, cerrar, query, resultados, fijarQuery, ejecutar, abrirResultado } = useBusquedaGlobalViewModel();
  const confirmarSiDirty = useConfirmarSiDirty();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(ejecutar, 300);
    return () => window.clearTimeout(id);
  }, [ejecutar, open, query]);

  const abrir = (modeloId: string) => confirmarSiDirty(() => abrirResultado(modeloId));

  return (
    <Dialogo
      open={open}
      title="Buscar global"
      onCancel={cerrar}
      initialFocusRef={inputRef}
      actions={<button type="button" style={style.secondaryButton} onClick={cerrar}>Cerrar</button>}
    >
      <div data-testid="dialogo-buscar-global" style={style.body}>
        <input
          ref={inputRef}
          type="search"
          aria-label="Buscar global"
          style={style.input}
          value={query}
          onInput={(event) => fijarQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && resultados[0]) abrir(resultados[0].modeloId);
          }}
        />
        {query.trim().length < 3 ? (
          <div style={style.empty}>Ingresa al menos 3 caracteres.</div>
        ) : resultados.length === 0 ? (
          <div style={style.empty}>Sin resultados.</div>
        ) : (
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>Modelo</th>
                <th style={style.th}>Carpeta</th>
                <th style={style.th}>Match</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado) => (
                <tr
                  key={resultado.modeloId}
                  data-testid={`resultado-busqueda-global-${resultado.modeloId}`}
                  style={style.row}
                  onClick={() => abrir(resultado.modeloId)}
                >
                  <td style={style.td}>{resultado.nombre}</td>
                  <td style={style.tdMuted}>{resultado.rutaCarpetas}</td>
                  <td style={style.tdMuted}>{resultado.match.campo}: {resultado.match.resaltado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Dialogo>
  );
}

// Ronda 28 L5: Bauhaus monocromático.
const style = {
  body: { display: "grid", gap: "12px", minWidth: "min(720px, calc(100vw - 80px))" },
  input: {
    height: "36px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    padding: "0 12px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "14px",
    caretColor: tokens.colors.accent,
  },
  empty: { padding: "16px", border: `1px dashed ${tokens.colors.ink15}`, borderRadius: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  th: { padding: "8px 10px", borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, textAlign: "left", color: tokens.colors.ink50, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  row: { cursor: "pointer", borderBottom: `1px solid ${tokens.colors.ink08}` },
  td: { padding: "10px", color: tokens.colors.ink, fontWeight: 500 },
  tdMuted: { padding: "10px", color: tokens.colors.ink70, fontWeight: 400 },
  secondaryButton: {
    minHeight: "32px",
    padding: "8px 18px",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 500,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
