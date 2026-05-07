// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

export function DialogoBuscarGlobal() {
  const open = useOpmStore((s) => s.dialogoBuscarGlobalAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoBuscarGlobal);
  const query = useOpmStore((s) => s.busquedaGlobal.query);
  const resultados = useOpmStore((s) => s.busquedaGlobal.resultados);
  const fijarQuery = useOpmStore((s) => s.fijarBusquedaGlobalQuery);
  const ejecutar = useOpmStore((s) => s.ejecutarBusquedaGlobal);
  const abrirResultado = useOpmStore((s) => s.abrirResultadoBusquedaGlobal);
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

const style = {
  body: { display: "grid", gap: "10px", minWidth: "min(720px, calc(100vw - 80px))" },
  input: {
    height: "36px",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    padding: "0 10px",
    fontSize: "14px",
  },
  empty: { padding: "16px", border: `1px dashed ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, color: tokens.colors.textoTerciario, fontWeight: 700 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "6px 8px", borderBottom: `2px solid ${tokens.colors.bordeIntermedio}`, textAlign: "left", color: tokens.colors.textoTerciario },
  row: { cursor: "pointer", borderBottom: `1px solid ${tokens.colors.fondoMuted}` },
  td: { padding: "8px", color: tokens.colors.textoPrimario, fontWeight: 700 },
  tdMuted: { padding: "8px", color: tokens.colors.textoTerciario, fontWeight: 600 },
  secondaryButton: {
    height: "34px",
    padding: "0 14px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

