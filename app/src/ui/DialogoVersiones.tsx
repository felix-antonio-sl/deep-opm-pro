import { useMemo } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

export function DialogoVersiones() {
  const abierto = useOpmStore((s) => s.dialogoVersionesAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoVersiones);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const crearVersionAhora = useOpmStore((s) => s.crearVersionAhora);
  const restaurar = useOpmStore((s) => s.restaurarVersionComoCopia);
  const eliminar = useOpmStore((s) => s.eliminarVersionPorId);
  const modelo = useMemo(
    () => modelos.find((item) => item.id === abierto?.modeloId),
    [abierto?.modeloId, modelos],
  );

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
        {(modelo?.versiones ?? []).length === 0 ? (
          <div style={style.empty}>Este modelo no tiene versiones.</div>
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
              {(modelo?.versiones ?? []).map((version) => (
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
  th: { padding: "6px 8px", borderBottom: "2px solid #d9e0ea", textAlign: "left", color: "#667085" },
  row: { borderBottom: "1px solid #eef2f6" },
  td: { padding: "8px", color: "#1f2937", fontWeight: 600, verticalAlign: "top" },
  actions: { padding: "8px", display: "flex", gap: "6px", flexWrap: "wrap" },
  muted: { color: "#667085", fontSize: "12px", marginTop: "2px" },
  empty: { padding: "14px", border: "1px dashed #c8d2df", borderRadius: "4px", color: "#667085", fontWeight: 700 },
  primaryButton: { height: "32px", justifySelf: "start", padding: "0 12px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontWeight: 700 },
  disabledButton: { height: "32px", justifySelf: "start", padding: "0 12px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#f2f4f7", color: "#98a2b3", fontWeight: 700 },
  smallButton: { minHeight: "28px", padding: "0 8px", border: "1px solid #b9c5d4", borderRadius: "4px", background: "#ffffff", color: "#1f2937", cursor: "pointer", fontWeight: 700 },
  smallDanger: { minHeight: "28px", padding: "0 8px", border: "1px solid #f2b8b5", borderRadius: "4px", background: "#fff5f5", color: "#b42318", cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;

