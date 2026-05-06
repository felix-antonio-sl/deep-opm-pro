import { useMemo } from "preact/hooks";
import { rutaTexto } from "../persistencia/workspace";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

export function DialogoArchivados() {
  const open = useOpmStore((s) => s.dialogoArchivadosAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoArchivados);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const indice = useOpmStore((s) => s.indice);
  const restaurar = useOpmStore((s) => s.restaurarModeloPorId);
  const borrar = useOpmStore((s) => s.borrarLocal);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const archivados = useMemo(() => mostrarArchivados ? modelos.filter((modelo) => modelo.archivado) : [], [modelos, mostrarArchivados]);

  return (
    <Dialogo
      open={open}
      title="Modelos archivados"
      onCancel={cerrar}
      actions={<button type="button" style={style.secondaryButton} onClick={cerrar}>Cerrar</button>}
    >
      <div style={style.body}>
        <label style={style.flag}>
          <input type="checkbox" checked={mostrarArchivados} onChange={toggleMostrarArchivados} />
          Mostrar archivados
        </label>
        {archivados.length === 0 ? (
          <div style={style.empty}>{mostrarArchivados ? "No hay modelos archivados." : "Archivados ocultos."}</div>
        ) : (
          <table style={style.table}>
          <thead>
            <tr>
              <th style={style.th}>Modelo</th>
              <th style={style.th}>Carpeta</th>
              <th style={style.th}>Archivado</th>
              <th style={style.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {archivados.map((modelo) => {
              const carpetaId = indice.modelos.find((item) => item.id === modelo.id)?.carpetaId ?? modelo.carpetaId ?? null;
              return (
                <tr key={modelo.id} style={style.row}>
                  <td style={style.td}>{modelo.nombre}</td>
                  <td style={style.tdMuted}>{rutaTexto(indice, carpetaId)}</td>
                  <td style={style.tdMuted}>{modelo.archivadoEn ? new Date(modelo.archivadoEn).toLocaleString("es-CL") : "Sin fecha"}</td>
                  <td style={style.actions}>
                    <button type="button" style={style.smallButton} onClick={() => restaurar(modelo.id)}>Restaurar</button>
                    <button
                      type="button"
                      style={style.smallDanger}
                      onClick={() => {
                        if (typeof globalThis.confirm === "function" && !globalThis.confirm(`Eliminar permanentemente "${modelo.nombre}"?`)) return;
                        borrar(modelo.id);
                      }}
                    >
                      Eliminar permanentemente
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        )}
      </div>
    </Dialogo>
  );
}

const style = {
  body: { display: "grid", gap: "10px" },
  flag: { display: "inline-flex", alignItems: "center", gap: "6px", color: "#475467", fontSize: "13px", fontWeight: 700 },
  table: { width: "min(760px, calc(100vw - 80px))", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "6px 8px", borderBottom: "2px solid #d9e0ea", textAlign: "left", color: "#667085" },
  row: { borderBottom: "1px solid #eef2f6" },
  td: { padding: "8px", color: "#1f2937", fontWeight: 700 },
  tdMuted: { padding: "8px", color: "#667085", fontWeight: 600 },
  actions: { padding: "8px", display: "flex", gap: "6px", flexWrap: "wrap" },
  empty: { width: "min(520px, calc(100vw - 80px))", padding: "14px", border: "1px dashed #c8d2df", borderRadius: "4px", color: "#667085", fontWeight: 700 },
  smallButton: { minHeight: "28px", padding: "0 8px", border: "1px solid #b9c5d4", borderRadius: "4px", background: "#ffffff", color: "#1f2937", cursor: "pointer", fontWeight: 700 },
  smallDanger: { minHeight: "28px", padding: "0 8px", border: "1px solid #f2b8b5", borderRadius: "4px", background: "#fff5f5", color: "#b42318", cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "13px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
