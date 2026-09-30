import { useState } from "preact/hooks";
import type { DocumentOperationsPort } from "../app/ports/documentOperationsPort";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import type { Modelo, ModoDespliegueObjeto, TipoRefinamiento } from "../modelo/tipos";
import type { PreparedAgentChange } from "../persistencia/agentClient";
import { prepareHumanAuthoringRequest } from "../persistencia/humanChangeClient";
import { ChangeReview } from "./agent/ChangeReview";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

type PreparedRefinement = PreparedAgentChange & { frontier: { declarations: number; preserved: boolean } };

export function RefinementProposalAction({ model, opdId, operations }: {
  model: Modelo; opdId: string; operations: DocumentOperationsPort | null;
}) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" disabled={!operations} style={actionStyle} onClick={() => setOpen(true)}
      title={operations ? "Preparar y revisar un nuevo refinamiento" : "Guarda el documento para preparar una propuesta"}>
      Proponer refinamiento…
    </button>
    {open && operations ? <RefinementDialog model={model} opdId={opdId} operations={operations} close={() => setOpen(false)} /> : null}
  </>;
}

function RefinementDialog({ model, opdId, operations, close }: {
  model: Modelo; opdId: string; operations: DocumentOperationsPort; close: () => void;
}) {
  const entities = [...new Set(Object.values(model.opds[opdId]?.apariencias ?? {}).map((appearance) => appearance.entidadId))]
    .map((id) => model.entidades[id]).filter((entity) => entity && !entity.anclaje);
  const [entityId, setEntityId] = useState(entities[0]?.id ?? "");
  const [refinementType, setRefinementType] = useState<TipoRefinamiento>("descomposicion");
  const [mode, setMode] = useState<ModoDespliegueObjeto>("agregacion");
  const [question, setQuestion] = useState("");
  const [justification, setJustification] = useState("");
  const [prepared, setPrepared] = useState<PreparedRefinement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const existing = model.entidades[entityId] && obtenerRefinamiento(model.entidades[entityId]!, refinementType);
  const reset = () => { setPrepared(null); setError(null); setAppliedId(null); };
  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(null);
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "No se pudo completar la propuesta"); }
    finally { setBusy(false); }
  };
  const prepare = () => run(async () => {
    const base = await operations.flush();
    const state = operations.snapshot();
    const candidate = await prepareHumanAuthoringRequest<PreparedRefinement>("refinements", {
      documentId: state.documentId, controllerId: state.controllerId,
      clientSequence: base.clientSequence, workingCopyHash: base.workingCopyHash,
      entityId, opdId, refinementType, question, justification,
      ...(refinementType === "despliegue" ? { mode } : {}),
    });
    setPrepared(candidate); setAppliedId(null);
  });
  const apply = () => run(async () => {
    if (!prepared) return;
    await operations.prepareCommit(prepared.change, "review");
    const result = await operations.commit(prepared.changeId);
    if (result.kind !== "integrated") throw new Error("El cambio sigue pendiente de reconciliación");
    setAppliedId(result.changeId); setPrepared(null);
  });
  return <Dialogo open title="Proponer refinamiento" size="lg" onCancel={close}
    actions={<DialogoAccion onClick={close}>Cerrar</DialogoAccion>}>
    <form style={formStyle} onSubmit={(event) => { event.preventDefault(); void prepare(); }}>
      <label>Elemento del OPD actual
        <select value={entityId} disabled={busy} onChange={(event) => { setEntityId(event.currentTarget.value); reset(); }}>
          {entities.map((entity) => <option key={entity!.id} value={entity!.id}>{entity!.nombre}</option>)}
        </select>
      </label>
      <label>Refinamiento
        <select value={refinementType} disabled={busy} onChange={(event) => { setRefinementType(event.currentTarget.value as TipoRefinamiento); reset(); }}>
          <option value="descomposicion">Descomposición</option><option value="despliegue">Despliegue</option>
        </select>
      </label>
      {refinementType === "despliegue" ? <label>Relación estructural
        <select value={mode} disabled={busy} onChange={(event) => { setMode(event.currentTarget.value as ModoDespliegueObjeto); reset(); }}>
          <option value="agregacion">Partes</option><option value="exhibicion">Atributos</option>
          <option value="generalizacion">Especializaciones</option><option value="clasificacion">Instancias</option>
        </select>
      </label> : null}
      <label>Pregunta que debe responder
        <input value={question} maxLength={2000} disabled={busy} required onInput={(event) => { setQuestion(event.currentTarget.value); reset(); }} />
      </label>
      <label>Justificación del nuevo nivel
        <textarea value={justification} maxLength={4000} disabled={busy} required onInput={(event) => { setJustification(event.currentTarget.value); reset(); }} />
      </label>
      {existing ? <p>Este refinamiento ya existe. Puedes abrirlo desde el índice de OPDs sin crear otro.</p> : null}
      <button type="submit" disabled={busy || !entityId || !!existing || !question.trim() || !justification.trim()}>Preparar propuesta</button>
    </form>
    {error ? <p role="alert">{error}</p> : null}
    {busy ? <p role="status">Comprobando el documento…</p> : null}
    {prepared ? <>
      <p>La propuesta conserva las {prepared.frontier.declarations} declaraciones originales de la frontera. Revisa los elementos iniciales y el texto del nuevo nivel antes de incorporarlo.</p>
      <ChangeReview change={null} prepared={prepared} busy={busy} canApply onApply={() => { void apply(); }} />
    </> : null}
    {appliedId ? <p role="status">Refinamiento incorporado. <button type="button" disabled={busy} onClick={() => {
      void run(async () => {
        const result = await operations.undo(appliedId);
        if (result.kind !== "integrated") throw new Error("La reversión requiere revisar los cambios posteriores");
        setAppliedId(null);
      });
    }}>Deshacer refinamiento</button></p> : null}
  </Dialogo>;
}

const actionStyle = { border: 0, padding: "5px 12px", background: "transparent", color: tokens.colors.inkMid,
  font: `12px ${tokens.typography.serif}`, cursor: "pointer", textAlign: "left" as const };
const formStyle = { display: "grid", gap: 12, fontFamily: tokens.typography.serif };
