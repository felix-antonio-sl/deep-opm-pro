import { useEffect, useState } from "preact/hooks";
import { createDocumentPersistencePort, type DocumentPersistenceState } from "../app/ports/documentPersistencePort";
import type { Modelo } from "../modelo/tipos";
import { generarOpl } from "../opl/generar";
import { hidratarModelo } from "../serializacion/json";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

/** Keyed by the local/backend document identity; mounting never restores or sends a document. */
export function DocumentPersistenceStatus({ documentId, model }: { documentId: string; model: Modelo }) {
  const [port] = useState(() => createDocumentPersistencePort(documentId));
  const [state, setState] = useState(port.snapshot);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = port.subscribe(setState);
    return () => { unsubscribe(); port.dispose(); };
  }, [port]);
  useEffect(() => { setState(port.snapshot()); }, [port, model]);
  const identified = state.identity === "authenticated" || state.identity === "offline";
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true); setError(null);
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "No se pudo completar el guardado"); }
    finally { setBusy(false); setState(port.snapshot()); }
  };
  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={`Guardado del documento: ${localLabel(state)}`}
      style={{ border: 0, padding: "5px 12px", background: "transparent", color: tokens.colors.inkMid,
        font: `12px ${tokens.typography.serif}`, cursor: "pointer" }}>{localLabel(state)}</button>
    {open ? <Dialogo open title="Guardado del documento" size="lg" onCancel={() => setOpen(false)}
      actions={<DialogoAccion onClick={() => setOpen(false)}>Cerrar</DialogoAccion>}>
      <p role="status">{localLabel(state)}. {remoteLabel(state)}</p>
      {!identified ? <p>Inicia sesión para guardar una copia local asociada a tu cuenta. Puedes exportar el documento desde el menú de archivos.</p> : null}
      {state.local === "volatile" ? <p role="alert">El navegador no confirmó el guardado. Conserva esta ventana y descarga una recuperación.</p> : null}
      {error || state.error ? <p role="alert">{error ?? state.error}</p> : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button type="button" disabled={busy || !identified} onClick={() => { void run(() => port.saveHere()); }}>Guardar aquí</button>
        <button type="button" disabled={busy || state.identity !== "authenticated" || state.remote === "local-only" || state.conflicts.length > 0}
          onClick={() => { void run(() => port.synchronize()); }}>Sincronizar ahora</button>
        <button type="button" disabled={busy || !identified} onClick={() => { void run(async () => {
          const json = await port.recoveryJson();
          if (!json) throw new Error("Todavía no hay una copia recuperable de este documento");
          const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
          const anchor = document.createElement("a"); anchor.href = url; anchor.download = "opforja-recuperacion.json";
          anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        }); }}>Descargar recuperación</button>
      </div>
      {state.conflicts.map((conflict) => <section key={conflict.id} aria-label="Ramas en conflicto"
        style={{ marginTop: 20, borderTop: `1px solid ${tokens.colors.rule}`, paddingTop: 12 }}>
        <p>Las dos revisiones se conservan. Compara su contenido antes de elegir cuál seguirá abierta; la otra permanece en la recuperación.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
          <Branch label="Local" json={conflict.localSnapshotJson} />
          <Branch label="Remota" json={conflict.remoteSnapshotJson} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
          <button type="button" disabled={busy} onClick={() => { void run(() => port.resolveConflict(conflict.id, "local")); }}>Conservar rama local</button>
          <button type="button" disabled={busy} onClick={() => { void run(() => port.resolveConflict(conflict.id, "remote")); }}>Usar rama remota</button>
        </div>
      </section>)}
    </Dialogo> : null}
  </>;
}

function Branch({ label, json }: { label: string; json: string }) {
  const hydrated = hidratarModelo(json);
  const text = hydrated.ok
    ? Object.values(hydrated.value.opds).map((opd) => `${opd.nombre}\n${generarOpl(hydrated.value, opd.id).join("\n")}`).join("\n\n")
    : "Esta revisión necesita un perfil compatible. Sus bytes se conservan en la recuperación.";
  return <section aria-label={`Rama ${label.toLowerCase()}`}><strong>{label}</strong>
    <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 260, overflow: "auto",
      font: `13px ${tokens.typography.serif}`, padding: 10, background: tokens.colors.paperWarm }}>{text}</pre>
  </section>;
}

function localLabel(state: DocumentPersistenceState): string {
  if (state.local === "volatile") return "Sin guardar aquí";
  if (state.conflicts.length > 0) return "Revisar conflicto";
  if (!state.durableSnapshotMatchesCurrent) return "Sin guardar aquí";
  return state.remote === "synced" ? "Sincronizado" : "Guardado aquí";
}

function remoteLabel(state: DocumentPersistenceState): string {
  switch (state.remote) {
    case "local-only": return "Este documento todavía no tiene una copia remota.";
    case "offline": return "Sin conexión; la copia local permanece en este navegador.";
    case "syncing": return "Enviando la revisión al servidor…";
    case "synced": return state.durableSnapshotMatchesCurrent ? "El servidor confirmó esta revisión." : "Hay cambios posteriores a la revisión confirmada.";
    case "conflict": return "El servidor conserva una revisión diferente.";
    case "pending": return "Hay cambios pendientes de sincronizar.";
    default: return "El servidor aún no confirmó esta revisión local.";
  }
}
