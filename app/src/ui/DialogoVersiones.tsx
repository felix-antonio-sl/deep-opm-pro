// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import type { VersionResumen } from "../modelo/tipos";
import { useDialogoVersionesViewModel } from "../app/viewmodels/dialogoVersionesViewModel";
import { Dialogo, DialogoAccion } from "./Dialogo";
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
    filas,
  } = useDialogoVersionesViewModel();
  // A′-vitrina: expansión local de los hitos de sesión de agente (colapsados por
  // defecto). Clave = id del push más nuevo de la corrida (único).
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const alternarHito = (clave: string) =>
    setExpandidos((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(clave)) siguiente.delete(clave); else siguiente.add(clave);
      return siguiente;
    });

  const filaVersion = (version: VersionResumen, anidada: boolean) => (
    <tr key={version.id} style={style.row}>
      <td style={anidada ? style.tdAnidada : style.td}>{new Date(version.creadoEn).toLocaleString("es-CL")}</td>
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
  );

  return (
    <Dialogo
      open={abierto !== null}
      title={`Versiones de "${modelo?.nombre ?? "modelo"}"`}
      onCancel={cerrar}
      actions={<DialogoAccion onClick={cerrar}>Cerrar</DialogoAccion>}
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
        {(modelo?.versiones ?? []).length === 0 || filas.length === 0 ? (
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
              {filas.map((fila) => {
                if (fila.tipo === "individual") return filaVersion(fila.version, false);
                const clave = fila.versiones[0]!.id;
                const abierto = expandidos.has(clave);
                const resumen = (
                  <tr key={`hito-${clave}`} style={style.row} data-testid="hito-sesion-agente">
                    <td style={style.td}>{new Date(fila.hasta).toLocaleString("es-CL")}</td>
                    <td style={style.td} colSpan={3}>
                      <button type="button" style={style.hitoToggle} onClick={() => alternarHito(clave)} aria-expanded={abierto}>
                        <span aria-hidden="true" style={style.hitoCaret}>{abierto ? "▾" : "▸"}</span>
                        Sesión de agente · {fila.versiones.length} {fila.versiones.length === 1 ? "revisión" : "revisiones"}
                      </button>
                    </td>
                  </tr>
                );
                return abierto ? [resumen, ...fila.versiones.map((version) => filaVersion(version, true))] : resumen;
              })}
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
  smallDanger: { minHeight: "28px", padding: "4px 12px", border: `1px solid ${tokens.colors.crimson}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.crimson, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  // A′-vitrina: fila de versión anidada bajo un hito expandido (sangría) + toggle del hito.
  tdAnidada: { padding: "10px 10px 10px 26px", color: tokens.colors.ink, fontWeight: 400, verticalAlign: "top" },
  hitoToggle: { display: "inline-flex", alignItems: "center", gap: "8px", border: "none", background: "transparent", color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500, padding: 0, boxShadow: "none" },
  hitoCaret: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px", lineHeight: 1 },
} satisfies Record<string, preact.JSX.CSSProperties>;
