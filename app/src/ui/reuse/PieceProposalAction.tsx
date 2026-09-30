import { useMemo, useState } from "preact/hooks";
import type { DocumentOperationsPort } from "../../app/ports/documentOperationsPort";
import { createPiecePort, MAX_PIECE_SOURCE_BYTES, type PiecePort, type PreparedPieceChange } from "../../app/ports/piecePort";
import { preparePieceOperation } from "../../modelo/reuse/piece";
import { hidratarModelo } from "../../serializacion/json";
import type { Entidad, Id, Modelo, SubmodeloReferencia } from "../../modelo/tipos";
import { ChangeReview } from "../agent/ChangeReview";
import { Dialogo, DialogoAccion } from "../Dialogo";
import { tokens } from "../tokens";

type PieceAction = "copy" | "reference" | "update";

export function PieceProposalAction({ model, opdId, operations }: {
  model: Modelo; opdId: string; operations: DocumentOperationsPort | null;
}) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" disabled={!operations} style={actionStyle} onClick={() => setOpen(true)}
      title={operations ? "Preparar una pieza reutilizable y revisar sus límites" : "Guarda el documento para preparar una pieza"}>
      Reutilizar pieza…
    </button>
    {open && operations ? <PieceDialog model={model} opdId={opdId} operations={operations} close={() => setOpen(false)} /> : null}
  </>;
}

function PieceDialog({ model, opdId, operations, close }: {
  model: Modelo; opdId: string; operations: DocumentOperationsPort; close: () => void;
}) {
  const port = useMemo(() => createPiecePort(operations), [operations]);
  const [sourceJson, setSourceJson] = useState("");
  const [sourceModel, setSourceModel] = useState<Modelo | null>(null);
  const [pieceId, setPieceId] = useState("");
  const [functionText, setFunctionText] = useState("");
  const [kind, setKind] = useState<PieceAction>("copy");
  const [anchorEntityId, setAnchorEntityId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [includeBoundaryChange, setIncludeBoundaryChange] = useState(false);
  const [prepared, setPrepared] = useState<PreparedPieceChange | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourcePieces = useMemo(() => Object.values(sourceModel?.entidades ?? {}).filter((entity) => !entity.esAtributo), [sourceModel]);
  const targetEntities = useMemo(() => {
    const view = model.opds[opdId];
    if (!view || view.vista?.readOnly) return [];
    return Object.values(view.apariencias).map((appearance) => model.entidades[appearance.entidadId])
      .filter((entity): entity is Entidad => !!entity && !entity.anclaje);
  }, [model, opdId]);
  const pieceReferences = useMemo(() => Object.values(model.submodelos ?? {}).filter((ref) => ref.piece), [model]);
  const updateReferences: SubmodeloReferencia[] = pieceReferences.filter((ref) =>
    !!ref.piece && ref.piece.identity.modelId === sourceModel?.id && ref.piece.identity.pieceId === pieceId,
  );
  const selectedRef: SubmodeloReferencia | undefined = updateReferences.find((ref) => ref.id === referenceId) ?? updateReferences[0];
  const boundaryPreview = useMemo(() => {
    if (kind !== "update" || !sourceModel || !pieceId || !selectedRef?.piece) return null;
    const result = preparePieceOperation(model, {
      kind: "update", source: sourceModel, pieceId, function: functionText || selectedRef.piece.function,
      target: { referenceId: selectedRef.id, expectedSourceVersion: selectedRef.piece.version.id }, includeBoundaryChange: true,
    });
    return result.ok ? result.value.comparison?.dimensions.boundary?.status === "different" : null;
  }, [kind, sourceModel, pieceId, functionText, selectedRef, model]);

  const resetReview = () => { setPrepared(null); setAppliedId(null); setError(null); };
  const run = async (work: () => Promise<void>) => {
    setBusy(true); setError(null);
    try { await work(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "No se pudo preparar la pieza"); }
    finally { setBusy(false); }
  };
  const loadSource = async (file: File | undefined) => {
    resetReview();
    setSourceModel(null); setPieceId(""); setSourceJson(""); setFunctionText("");
    if (!file) return;
    if (file.size > MAX_PIECE_SOURCE_BYTES) {
      setError("El archivo supera 1 MiB. Elige una fuente OPM JSON más pequeña.");
      return;
    }
    const json = await file.text();
    if (new TextEncoder().encode(json).byteLength > MAX_PIECE_SOURCE_BYTES) {
      setError("El archivo supera 1 MiB en UTF-8. Elige una fuente OPM JSON más pequeña.");
      return;
    }
    const hydrated = hidratarModelo(json);
    if (!hydrated.ok) { setError(`No se pudo leer la fuente OPM: ${hydrated.error}`); return; }
    setSourceJson(json);
    setSourceModel(hydrated.value);
    setPieceId(Object.values(hydrated.value.entidades).find((entity) => !entity.esAtributo)?.id ?? "");
  };
  const chooseKind = (next: PieceAction) => {
    setKind(next); setIncludeBoundaryChange(false); resetReview();
    if (next === "update" && pieceReferences.length) setReferenceId(pieceReferences[0]!.id);
  };
  const prepare = () => run(async () => {
    if (!sourceModel || !pieceId) throw new Error("Selecciona una pieza de la fuente");
    const common = { sourceJson, pieceId, function: functionText };
    const input = kind === "copy"
      ? { ...common, kind, target: { opdId, position: nextPosition(model, opdId) } }
      : kind === "reference"
        ? { ...common, kind, target: { opdId, anchorEntityId } }
        : {
            ...common,
            kind,
            target: { referenceId: selectedRef?.id ?? "", expectedSourceVersion: selectedRef?.piece?.version.id ?? "" },
            ...(includeBoundaryChange ? { includeBoundaryChange: true } : {}),
          };
    const candidate = await port.prepare(input);
    setPrepared(candidate); setAppliedId(null);
  });
  const apply = () => run(async () => {
    if (!prepared) return;
    const result = await port.apply(prepared);
    if (result.kind !== "integrated") throw new Error(result.reason);
    setAppliedId(result.changeId); setPrepared(null);
  });

  return <Dialogo open title="Reutilizar pieza" size="lg" onCancel={close}
    actions={<DialogoAccion onClick={close}>Cerrar</DialogoAccion>}>
    <div style={formStyle}>
      <p style={introStyle}>Aporta un archivo OPM JSON. La copia crea identidad local; la referencia queda protegida en solo lectura. La vista conserva entidad y estados, y declara lo que queda fuera.</p>
      <label>Archivo de origen OPM JSON
        <input type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { void loadSource(event.currentTarget.files?.[0]); }} />
      </label>
      <small style={mutedStyle}>Máximo 1 MiB por fuente. No se resuelven URLs.</small>
      {sourceModel ? <>
        <p style={statusStyle}>Fuente: {sourceModel.nombre} · {sourcePieces.length} piezas · {sourceModel.id}</p>
        <label>Pieza
          <select aria-label="Pieza" value={pieceId} disabled={busy} onChange={(event) => { setPieceId(event.currentTarget.value); setFunctionText(""); resetReview(); }}>
            {sourcePieces.map((entity) => <option key={entity.id} value={entity.id}>{entity.nombre} · {entity.id}</option>)}
          </select>
        </label>
        <label>Función que declara el autor
          <input value={functionText} maxLength={1000} disabled={busy} onInput={(event) => { setFunctionText(event.currentTarget.value); resetReview(); }} />
        </label>
        <label>Acción
          <select value={kind} disabled={busy} onChange={(event) => chooseKind(event.currentTarget.value as PieceAction)}>
            <option value="copy">Copiar como identidad independiente</option>
            <option value="reference">Referenciar en solo lectura</option>
            <option value="update">Proponer actualización de referencia</option>
          </select>
        </label>
        {kind === "reference" ? <label>Raíz propia del documento
          <select value={anchorEntityId} disabled={busy} onChange={(event) => { setAnchorEntityId(event.currentTarget.value); resetReview(); }}>
            <option value="">Selecciona un elemento del OPD actual</option>
            {targetEntities.map((entity) => <option key={entity.id} value={entity.id}>{entity.nombre} · {entity.id}</option>)}
          </select>
        </label> : null}
        {kind === "update" ? <label>Referencia protegida
          <select value={selectedRef?.id ?? ""} disabled={busy} onChange={(event) => { setReferenceId(event.currentTarget.value); setIncludeBoundaryChange(false); resetReview(); }}>
            <option value="">Selecciona una referencia</option>
            {updateReferences.map((ref) => <option key={ref.id} value={ref.id}>{ref.nombre} · {ref.piece?.identity.pieceId}</option>)}
          </select>
        </label> : null}
        {boundaryPreview ? <label style={warningStyle}>
          <input type="checkbox" checked={includeBoundaryChange} disabled={busy}
            onChange={(event) => { setIncludeBoundaryChange(event.currentTarget.checked); resetReview(); }} />
          Incluir la frontera distinta en una propuesta para revisión humana.
        </label> : null}
        <button type="button" disabled={busy || !pieceId || !functionText.trim() ||
          (kind === "reference" && !anchorEntityId) ||
          (kind === "update" && (!selectedRef || (boundaryPreview === true && !includeBoundaryChange)))}
          onClick={() => { void prepare(); }}>Preparar propuesta</button>
      </> : null}
      {error ? <p role="alert" style={warningStyle}>{error}</p> : null}
      {busy ? <p role="status" style={mutedStyle}>Preparando sobre la versión guardada…</p> : null}
      {prepared ? <PieceManifestReview prepared={prepared} busy={busy} onApply={() => { void apply(); }} /> : null}
      {appliedId ? <p role="status" style={statusStyle}>Pieza incorporada. <button type="button" disabled={busy} onClick={() => {
        void run(async () => {
          const result = await port.undo(appliedId);
          if (result.kind !== "integrated") throw new Error("La reversión requiere revisar cambios posteriores");
          setAppliedId(null);
        });
      }}>Deshacer</button></p> : null}
    </div>
  </Dialogo>;
}

function PieceManifestReview({ prepared, busy, onApply }: {
  prepared: PreparedPieceChange; busy: boolean; onApply: () => void;
}) {
  const manifest = prepared.manifest;
  return <section aria-label="Declaración de pieza" style={manifestStyle}>
    <h3 style={headingStyle}>Declaración de origen</h3>
    <p style={statusStyle}>{manifest.function}</p>
    <p style={mutedStyle}>Versión {manifest.version.id} · firma {manifest.version.contentHash} · perfil {manifest.profile.id}@{manifest.profile.version}</p>
    <p style={mutedStyle}>Frontera observada: {manifest.boundary.roles.length === 0 ? "sin enlaces incidentes" : manifest.boundary.roles.map((role) => `${role.role === "source" ? "sale hacia" : "entra desde"} ${role.entityId} (${role.linkType})`).join("; ")}</p>
    <p style={mutedStyle}>El manifiesto describe identidad, frontera y versión. No demuestra equivalencia ni sustituibilidad.</p>
    {prepared.comparison ? <>
      <p style={mutedStyle}>Diferencias declaradas: {prepared.comparison.changed.length ? prepared.comparison.changed.join(", ") : "ninguna observada"}.</p>
      {prepared.comparison.unexamined.length ? <p style={mutedStyle}>Sin evidencia comparativa: {prepared.comparison.unexamined.join(", ")}.</p> : null}
    </> : null}
    {prepared.losses.length ? <div><strong style={mutedStyle}>Límites de esta vista</strong><ul style={lossListStyle}>{prepared.losses.map((loss) => <li key={loss}>{loss}</li>)}</ul></div> : null}
    <ChangeReview change={null} prepared={prepared} busy={busy} canApply={!busy} onApply={onApply} />
  </section>;
}

function nextPosition(model: Modelo, opdId: Id): { x: number; y: number } {
  const count = Object.keys(model.opds[opdId]?.apariencias ?? {}).length;
  return { x: 80 + (count % 5) * 36, y: 80 + Math.floor(count / 5) * 36 };
}

const actionStyle = { border: 0, padding: "5px 12px", background: "transparent", color: tokens.colors.inkMid,
  font: `12px ${tokens.typography.serif}`, cursor: "pointer", textAlign: "left" as const };
const formStyle = { display: "grid", gap: 12, fontFamily: tokens.typography.serif };
const introStyle = { margin: 0, color: tokens.colors.inkSoft, lineHeight: 1.45 };
const mutedStyle = { margin: 0, color: tokens.colors.inkSoft, lineHeight: 1.45, overflowWrap: "anywhere" as const };
const statusStyle = { margin: 0, color: tokens.colors.ink, lineHeight: 1.45 };
const warningStyle = { margin: 0, color: tokens.colors.errorTexto, lineHeight: 1.45 };
const manifestStyle = { display: "grid", gap: 8, marginTop: 8, padding: 10, border: `1px solid ${tokens.colors.rule}`, background: tokens.colors.paperWarm };
const headingStyle = { margin: 0, fontSize: 13, color: tokens.colors.ink };
const lossListStyle = { margin: "4px 0 0", paddingLeft: 20, color: tokens.colors.inkSoft, lineHeight: 1.45 };
