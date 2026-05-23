// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useDialogoVersionesViewModel } from "../app/viewmodels/dialogoVersionesViewModel";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

export function DialogoVersiones() {
  const {
    abierto,
    cerrar,
    modelo,
    modeloPersistidoId,
    crearVersionAhora,
    restaurar,
    eliminar,
    mostrarVersiones,
    toggleMostrarVersiones,
    versiones,
  } = useDialogoVersionesViewModel();

  return (
    <Dialogo
      open={abierto !== null}
      title={`Versiones de "${modelo?.nombre ?? "modelo"}"`}
      onCancel={cerrar}
      actions={<button type="button" style={style.secondaryButton} onClick={cerrar}>Cerrar</button>}
    >
      <div style={style.body}>
        <button
          type="button"
          style={modelo?.id === modeloPersistidoId ? style.primaryButton : style.disabledButton}
          disabled={modelo?.id !== modeloPersistidoId}
          onClick={() => { void crearVersionAhora({ descripcion: "Versión manual" }); }}
        >
          Crear version ahora
        </button>
        <label style={style.flag}>
          <input type="checkbox" checked={mostrarVersiones} onChange={toggleMostrarVersiones} />
          Mostrar versiones
        </label>
        {(modelo?.versiones ?? []).length === 0 || versiones.length === 0 ? (
          <div style={style.empty}>{mostrarVersiones ? "Este modelo no tiene versiones." : "Versiones ocultas."}</div>
        ) : (
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>Fecha</th>
                <th style={style.th}>Nombre</th>
                <th style={style.th}>Bytes</th>
                <th style={style.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {versiones.map((version) => (
                <tr key={version.id} style={style.row}>
                  <td style={style.td}>{new Date(version.creadoEn).toLocaleString("es-CL")}</td>
                  <td style={style.td}>
                    <strong>{version.nombre}</strong>
                    {version.descripcion ? <div style={style.muted}>{version.descripcion}</div> : null}
                  </td>
                  <td style={style.td}>{version.bytes}</td>
                  <td style={style.actions}>
                    <button type="button" style={style.smallButton} onClick={() => { void restaurar(modelo!.id, version.id); }}>
                      Restaurar como copia
                    </button>
                    <button type="button" style={style.smallDanger} onClick={() => eliminar(modelo!.id, version.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Dialogo>
  );
}

// Ronda 28 L5: Bauhaus monocromático. Danger = accent (cinabrio).
const style = {
  body: { display: "grid", gap: "12px", minWidth: "min(720px, calc(100vw - 80px))" },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  th: { padding: "8px 10px", borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, textAlign: "left", color: tokens.colors.ink50, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  row: { borderBottom: `1px solid ${tokens.colors.ink08}` },
  td: { padding: "10px", color: tokens.colors.ink, fontWeight: 400, verticalAlign: "top" },
  actions: { padding: "10px", display: "flex", gap: "6px", flexWrap: "wrap" },
  muted: { color: tokens.colors.ink50, fontSize: "12px", marginTop: "2px" },
  flag: { display: "inline-flex", alignItems: "center", gap: "8px", color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  empty: { padding: "16px", border: `1px dashed ${tokens.colors.ink15}`, borderRadius: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  primaryButton: { minHeight: "32px", justifySelf: "start", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink, color: tokens.colors.paper, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  disabledButton: { minHeight: "32px", justifySelf: "start", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.ink04, color: tokens.colors.ink50, cursor: "not-allowed", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  smallButton: { minHeight: "28px", padding: "4px 12px", border: `1px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  smallDanger: { minHeight: "28px", padding: "4px 12px", border: `1px solid ${tokens.colors.accent}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.accentDark, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  secondaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
} satisfies Record<string, preact.JSX.CSSProperties>;
