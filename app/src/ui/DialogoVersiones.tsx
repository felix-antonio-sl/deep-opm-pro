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

const style = {
  body: { display: "grid", gap: "10px", minWidth: "min(720px, calc(100vw - 80px))" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "6px 8px", borderBottom: `2px solid ${tokens.colors.bordeIntermedio}`, textAlign: "left", color: tokens.colors.textoTerciario },
  row: { borderBottom: `1px solid ${tokens.colors.fondoMuted}` },
  td: { padding: "8px", color: tokens.colors.textoPrimario, fontWeight: 600, verticalAlign: "top" },
  actions: { padding: "8px", display: "flex", gap: "6px", flexWrap: "wrap" },
  muted: { color: tokens.colors.textoTerciario, fontSize: "12px", marginTop: "2px" },
  flag: { display: "inline-flex", alignItems: "center", gap: "6px", color: tokens.colors.textoSecundario, fontSize: "13px", fontWeight: 700 },
  empty: { padding: "14px", border: `1px dashed ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, color: tokens.colors.textoTerciario, fontWeight: 700 },
  primaryButton: { height: "32px", justifySelf: "start", padding: "0 12px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontWeight: 700 },
  disabledButton: { height: "32px", justifySelf: "start", padding: "0 12px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoDeshabilitado, color: tokens.colors.textoDeshabilitado, fontWeight: 700 },
  smallButton: { minHeight: "28px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeInput}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoPrimario, cursor: "pointer", fontWeight: 700 },
  smallDanger: { minHeight: "28px", padding: "0 8px", border: `1px solid ${tokens.colors.errorBorde}`, borderRadius: tokens.radii.sm, background: tokens.colors.errorFondo, color: tokens.colors.errorTexto, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
