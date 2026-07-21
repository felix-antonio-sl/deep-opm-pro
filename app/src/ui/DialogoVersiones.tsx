// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useRef, useState } from "preact/hooks";
import type { VersionResumen } from "../modelo/tipos";
import { useDialogoVersionesViewModel } from "../app/viewmodels/dialogoVersionesViewModel";
import { runTutorPolicy } from "../tutor/politica";
import type { PersistenceIntentSnapshot } from "../tutor/tipos";
import { useOpmStore } from "../store";
import type { VersionMutationOperation, VersionMutationReceipt } from "../store/tipos";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";
import { TutorInterventionDetails } from "./TutorDetails";

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
  const [versionAEliminar, setVersionAEliminar] = useState<VersionResumen | null>(null);
  const [estadoTutor, setEstadoTutor] = useState<VersionTutorState | null>(null);
  const dirtyModelo = useOpmStore((s) => s.dirtyModelo);
  const cancelarEliminarRef = useRef<HTMLButtonElement>(null);
  const intentIdTutor = estadoTutor
    ? `persistence:${estadoTutor.operation}:${estadoTutor.targetId}`
    : null;
  const intervencionTutor = estadoTutor && intentIdTutor ? runTutorPolicy(
    construirSnapshotVersion(estadoTutor, intentIdTutor, dirtyModelo),
    versionAEliminar ? [{ owner: "product", intentId: intentIdTutor }] : [],
  ) : null;
  const iniciarTutor = (operation: VersionMutationOperation, targetId: string): VersionTutorState => {
    const siguiente = { operation, targetId, destructiveConfirmed: false } satisfies VersionTutorState;
    setEstadoTutor(siguiente);
    return siguiente;
  };
  const ejecutarCrear = async () => {
    const base = iniciarTutor("version-create", modelo?.id ?? "none");
    const receipt = await crearVersionAhora({ descripcion: "Versión manual" });
    setEstadoTutor({ ...base, receipt });
  };
  const ejecutarRestauracion = async (version: VersionResumen) => {
    if (!modelo) return;
    const base = iniciarTutor("version-restore-copy", version.id);
    const receipt = await restaurar(modelo.id, version.id);
    setEstadoTutor({ ...base, receipt });
  };
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
        <button
          type="button"
          data-tutor-entrypoint="workspace:restore-version-copy"
          style={style.smallButton}
          onFocus={() => iniciarTutor("version-restore-copy", version.id)}
          onClick={() => { void ejecutarRestauracion(version); }}
        >
          Restaurar como copia
        </button>
        <button
          type="button"
          data-tutor-entrypoint="workspace:delete-version"
          style={style.smallDanger}
          onClick={() => {
            iniciarTutor("version-delete", version.id);
            setVersionAEliminar(version);
          }}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <Dialogo
      open={abierto !== null}
      title={`Versiones de "${modelo?.nombre ?? "modelo"}"`}
      onCancel={cerrar}
      actions={<DialogoAccion onClick={cerrar}>Cerrar</DialogoAccion>}
    >
      <div style={style.body}>
        <button
          key="crear-version"
          type="button"
          data-tutor-entrypoint="workspace:create-version"
          style={modelo?.id === modeloPersistidoId ? style.primaryButton : style.disabledButton}
          disabled={modelo?.id !== modeloPersistidoId}
          onFocus={() => iniciarTutor("version-create", modelo?.id ?? "none")}
          onClick={() => { void ejecutarCrear(); }}
        >
          Crear version ahora
        </button>
        <label key="mostrar-versiones" style={style.flag}>
          <input type="checkbox" checked={mostrarVersiones} onChange={toggleMostrarVersiones} />
          Mostrar versiones
        </label>
        {(modelo?.versiones ?? []).length === 0 || filas.length === 0 ? (
          <div key="versiones-vacias" style={style.empty}>{mostrarVersiones ? "Este modelo no tiene versiones." : "Versiones ocultas."}</div>
        ) : (
          <table key="versiones" style={style.table}>
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
        <div key="tutor" style={style.tutorSlot}>
          {!versionAEliminar && intervencionTutor ? (
            <div data-testid="tutor-versiones-voz" role="status">
              <TutorInterventionDetails intervention={intervencionTutor} abrirEnPrimerUso={false} testId="tutor-dialogo-versiones" />
              {estadoTutor?.receipt ? <ReciboVersion receipt={estadoTutor.receipt} /> : null}
            </div>
          ) : null}
        </div>
      </div>
      </Dialogo>
      <Dialogo
        open={versionAEliminar !== null}
        title="Eliminar versión"
        size="sm"
        onCancel={() => {
          setVersionAEliminar(null);
          setEstadoTutor(null);
        }}
        initialFocusRef={cancelarEliminarRef}
        testId="dialogo-eliminar-version"
        actions={(
          <>
            <DialogoAccion innerRef={cancelarEliminarRef} onClick={() => {
              setVersionAEliminar(null);
              setEstadoTutor(null);
            }}>Cancelar</DialogoAccion>
            <DialogoAccion
              tutorEntrypoint="workspace:delete-version"
              tono="destructiva"
              onClick={async () => {
                const version = versionAEliminar;
                if (!modelo || !version) return;
                const base = {
                  operation: "version-delete",
                  targetId: version.id,
                  destructiveConfirmed: true,
                } satisfies VersionTutorState;
                setVersionAEliminar(null);
                setEstadoTutor(base);
                const receipt = await eliminar(modelo.id, version.id);
                setEstadoTutor({ ...base, receipt });
              }}
            >
              Eliminar versión
            </DialogoAccion>
          </>
        )}
      >
        <div
          style={style.confirmBody}
          data-tutor-claim="product"
          {...(intentIdTutor ? { "data-tutor-intent": intentIdTutor } : {})}
        >
          <p style={style.confirmText}>
            Se eliminará «{versionAEliminar?.nombre ?? "esta versión"}». Esta acción es irreversible;
            restaurar como copia sigue disponible solo mientras la versión exista.
          </p>
        </div>
      </Dialogo>
    </>
  );
}

interface VersionTutorState {
  operation: VersionMutationOperation;
  targetId: string;
  destructiveConfirmed: boolean;
  receipt?: VersionMutationReceipt;
}

function construirSnapshotVersion(
  state: VersionTutorState,
  intentId: string,
  hasUnsavedChanges: boolean,
): PersistenceIntentSnapshot {
  const base = {
    kind: "persistence" as const,
    intentId,
    surface: "modal" as const,
    interactionMode: "editable" as const,
    hasUnsavedChanges,
    destructiveConfirmed: state.destructiveConfirmed,
  };
  const result = state.receipt?.ok
    ? { phase: "confirmed" as const, resultId: state.receipt.resultId }
    : { phase: "decision" as const };
  if (state.operation === "version-create") {
    return { ...base, ...result, operation: state.operation, actionId: "workspace:create-version" };
  }
  if (state.operation === "version-delete") {
    return { ...base, ...result, operation: state.operation, actionId: "workspace:delete-version" };
  }
  return { ...base, ...result, operation: state.operation, actionId: "workspace:restore-version-copy" };
}

function ReciboVersion({ receipt }: { receipt: VersionMutationReceipt }) {
  if (!receipt.ok) {
    return (
      <p data-testid="version-operation-error" style={style.receiptError}>
        No se aplicó la operación. El modelo y el historial local se conservaron. {receipt.error}
      </p>
    );
  }
  const texto = receipt.operation === "version-create"
    ? `Versión creada · ${receipt.versionId}`
    : receipt.operation === "version-restore-copy"
      ? `Copia restaurada · ${receipt.resultId}`
      : `Versión eliminada · ${receipt.versionId} · sin undo`;
  return <p data-testid="version-operation-receipt" data-result-id={receipt.resultId} style={style.receipt}>{texto}</p>;
}

// Ronda 28 L5: Bauhaus monocromático. Danger = accent (cinabrio).
const style = {
  body: { display: "grid", gap: "12px", minWidth: "min(720px, calc(100vw - 80px))" },
  tutorSlot: { display: "contents" },
  confirmBody: { display: "grid", gap: "10px" },
  confirmText: { margin: 0 },
  receipt: { margin: 0, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
  receiptError: { margin: 0, color: tokens.colors.crimson, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
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
