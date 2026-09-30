import { useMemo, useState } from "preact/hooks";
import type { TaskStatus } from "../../agent/taskState";
import type { AgentTaskPort } from "../../app/ports/agentTaskPort";
import { useAgentTaskViewModel } from "../../app/viewmodels/agentTaskViewModel";
import type { Id, Modelo } from "../../modelo/tipos";
import { tokens } from "../tokens";
import { ChangeReview } from "./ChangeReview";
import { TaskActivity } from "./TaskActivity";

interface IntentBarProps {
  port: AgentTaskPort | null;
  model: Modelo;
  activeOpdId: Id;
  selectedIds: Id[];
  disabled?: boolean;
  disabledReason?: string;
}

type ScopeChoice = "document" | "selection";

export function IntentBar({ port, model, activeOpdId, selectedIds, disabled = false, disabledReason }: IntentBarProps) {
  const view = useAgentTaskViewModel(port);
  const selectedScope = useMemo(
    () => selectedIds.filter((id) => model.entidades[id] || model.estados[id] || model.opds[id]),
    [selectedIds, model],
  );
  const [outcome, setOutcome] = useState("");
  const [answer, setAnswer] = useState("");
  const [scope, setScope] = useState<ScopeChoice>(selectedScope.length ? "selection" : "document");
  const [delegated, setDelegated] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const task = view.activeTask;
  const active = !!task && isActive(task.status);
  const scopeIds = scope === "selection" && selectedScope.length
    ? [...new Set([activeOpdId, ...selectedScope])]
    : allDocumentScopeIds(model);

  const submitIntent = async (event: Event) => {
    event.preventDefault();
    if (!port || !outcome.trim()) return;
    try {
      if (active) await port.instruct(outcome);
      else await port.start({ outcome, scopeIds, authority: delegated ? "edit" : "propose" });
      setOutcome("");
    } catch {
      // The port exposes the error in its view projection; preserve user text for correction.
    }
  };

  const continueTask = async (extendBudget = false) => {
    if (!port) return;
    try {
      await port.continueTask(answer.trim() || undefined, !extendBudget && !!task?.usage.usageUnknown && acceptReservedUsage, extendBudget);
      setAnswer("");
    } catch {
      // Keep the answer visible so the user can correct it or retry.
    }
  };

  const apply = async () => {
    if (!port) return;
    const source = view.change?.change.id ?? view.preparedChange?.change.id;
    if (!source) return;
    try {
      await port.apply(source, "review");
      setReviewOpen(true);
    } catch {
      // Candidate remains visible; the port carries the failure reason.
    }
  };

  const [acceptReservedUsage, setAcceptReservedUsage] = useState(false);
  const hasCandidate = !!(view.change || view.preparedChange);

  return (
    <section aria-label="Trabajo con agente" data-testid="agent-intent-bar" style={style.root}>
      <form onSubmit={submitIntent} style={style.form}>
        <label style={style.intentLabel}>
          <span style={style.kicker}>TRABAJO DEL DOCUMENTO</span>
          <span style={style.label}>{active ? "Corrige el encargo" : "Qué quieres conseguir"}</span>
          <textarea
            aria-label={active ? "Corrección del encargo" : "Qué quieres conseguir"}
            data-testid="agent-intent-input"
            rows={1}
            value={outcome}
            placeholder={active ? "Añade una condición o corrige el rumbo…" : "Describe el resultado que necesitas…"}
            onInput={(event) => setOutcome(event.currentTarget.value)}
            style={style.textarea}
          />
        </label>
        <div style={style.controls}>
          {!active ? (
            <>
              <label style={style.scopeLabel}>
                <span>Alcance</span>
                <select
                  aria-label="Alcance del encargo"
                  value={scope}
                  onChange={(event) => setScope(event.currentTarget.value as ScopeChoice)}
                  style={style.select}
                >
                  <option value="document">Documento completo</option>
                  {selectedScope.length ? <option value="selection">Selección y OPD activo ({selectedScope.length})</option> : null}
                </select>
              </label>
              <label style={style.delegation}>
                <input
                  type="checkbox"
                  checked={delegated}
                  onChange={(event) => setDelegated(event.currentTarget.checked)}
                />
                Autorizar edición directa en este alcance
              </label>
            </>
          ) : (
            <span role="status" style={style.liveTarget}>
              {task?.intent.authority === "edit" ? "Edición directa autorizada en el alcance elegido" : "Propuesta para revisar"}
              {task?.intent.target.kind === "variant" ? " · variante" : " · documento vigente"}
            </span>
          )}
          <button type="submit" disabled={disabled || !outcome.trim() || (active ? !view.canCorrect : !view.canStart)} style={style.primary}>
            {view.action === "starting" ? "Iniciando…" : view.action === "correcting" ? "Enviando corrección…" : active ? "Enviar corrección" : "Iniciar encargo"}
          </button>
        {view.canStop ? <button type="button" disabled={!!view.action} onClick={() => port && void port.stop()} style={style.secondary}>Detener</button> : null}
        </div>
      </form>

      <div style={style.statusLine}>
        <span aria-live="polite" role="status" data-testid="agent-task-status">
          {view.showWorkingIndicator ? <span aria-hidden="true" style={style.pulse} /> : null}
          {view.statusLabel}{view.targetLabel ? ` · ${view.targetLabel}` : ""}
        </span>
        {view.error ? <span role="alert" style={style.error}>{view.error}</span> : null}
        {disabled && disabledReason ? <span role="note" style={style.error}>{disabledReason}</span> : null}
        {hasCandidate ? (
          <button type="button" aria-expanded={reviewOpen} onClick={() => setReviewOpen((open) => !open)} style={style.linkButton}>
            {reviewOpen ? "Ocultar cambios" : "Ver cambios"}
          </button>
        ) : null}
        {view.canUndo ? <button type="button" onClick={() => port && void port.undo(view.lastAppliedChangeId!)} style={style.linkButton}>Deshacer cambio</button> : null}
        {view.canReapply ? <button type="button" onClick={() => port && void port.reapply(view.lastUndoneChangeId!)} style={style.linkButton}>Reaplicar cambio</button> : null}
      </div>

      {view.pendingEdits > 0 ? (
        <p role="status" style={style.pendingNotice}>
          {view.pendingEdits} {view.pendingEdits === 1 ? "cambio local está" : "cambios locales están"} pendiente{view.pendingEdits === 1 ? "" : "s"} de guardar.
        </p>
      ) : null}
      {view.pendingConflicts > 0 ? (
        <details style={style.conflictDetails}>
          <summary role="alert">{view.pendingConflicts} {view.pendingConflicts === 1 ? "cambio local quedó" : "cambios locales quedaron"} en conflicto y necesitan revisión.</summary>
          <ul style={style.conflictList}>
            {view.conflicts.map((conflict, index) => (
              <li key={conflict.id} style={style.conflictItem}>
                <span>{conflict.reason}</span>
                <button type="button" onClick={() => downloadRecoveryJson(conflict.recoveryJson, index)} style={style.linkButton}>
                  Descargar borrador {view.conflicts.length > 1 ? index + 1 : ""}
                </button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {view.canContinue ? (
        <div style={style.continuePanel}>
          {view.hasDecision ? <p style={style.decision}>{decisionText(task?.pendingDecision)}</p> : null}
          <label style={style.answerLabel}>
            {view.hasDecision ? "Tu decisión" : "Contexto para continuar (opcional)"}
            <textarea aria-label="Respuesta para continuar" rows={2} value={answer} onInput={(event) => setAnswer(event.currentTarget.value)} style={style.answerInput} />
          </label>
          {task?.usage.usageUnknown ? (
            <label style={style.acceptUsage}>
              <input type="checkbox" checked={acceptReservedUsage} onChange={(event) => setAcceptReservedUsage(event.currentTarget.checked)} />
              Continuar contando toda la reserva de uso como consumida
            </label>
          ) : null}
          <button type="button" disabled={!!view.action || (view.hasDecision && !answer.trim()) || (!!task?.usage.usageUnknown && !acceptReservedUsage)} onClick={() => void continueTask()} style={style.primary}>
            Continuar
          </button>
          {view.canExtendBudget ? (
            <div style={style.budgetExtension}>
              <span>
                Añade hasta {formatUsd(view.availability?.budgetIncrement?.maxTaskUsd ?? 0)} y amplía los límites de llamadas, herramientas y tokens.
              </span>
              <button type="button" disabled={!!view.action || (view.hasDecision && !answer.trim())} onClick={() => void continueTask(true)} style={style.secondary}>
                Ampliar presupuesto y continuar
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {reviewOpen ? (
        <ChangeReview
          change={view.change}
          prepared={view.preparedChange}
          busy={!!view.action}
          canApply={view.canApply}
          onApply={() => void apply()}
        />
      ) : null}

      <details style={style.activityDetails}>
        <summary>Actividad y resultados</summary>
        <TaskActivity task={task} />
      </details>
    </section>
  );
}

function allDocumentScopeIds(model: Modelo): Id[] {
  return [...new Set([
    ...Object.keys(model.entidades),
    ...Object.keys(model.estados),
    ...Object.keys(model.opds),
  ])];
}

function isActive(status: TaskStatus): boolean {
  return status === "preparing" || status === "working" || status === "awaiting-decision" || status === "suspended";
}

function decisionText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["question", "prompt", "message"]) if (typeof record[key] === "string") return record[key] as string;
  }
  return "El encargo necesita una decisión para continuar.";
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function downloadRecoveryJson(recoveryJson: string, index: number): void {
  const blob = new Blob([recoveryJson], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `opforja-borrador-en-conflicto-${index + 1}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

const style = {
  root: { minWidth: 0, padding: "9px 12px", borderBottom: `1px solid ${tokens.colors.rule}`, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.sans, fontSize: 12 },
  form: { display: "flex", flexWrap: "wrap" as const, alignItems: "flex-end", gap: 12, minWidth: 0 },
  intentLabel: { display: "grid", gap: 3, flex: "1 1 auto", minWidth: 160 },
  kicker: { color: tokens.colors.inkSoft, fontSize: 9, letterSpacing: "0.08em" },
  label: { fontSize: 12, fontWeight: tokens.typography.weights.medium },
  textarea: { width: "100%", resize: "vertical" as const, minHeight: 34, maxHeight: 120, padding: "7px 9px", border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 4, background: tokens.colors.paper, color: tokens.colors.ink, font: "inherit", lineHeight: 1.4 },
  controls: { display: "flex", flexWrap: "wrap" as const, alignItems: "center", justifyContent: "flex-end", gap: 7, flex: "0 1 auto" },
  scopeLabel: { display: "grid", gap: 2, color: tokens.colors.inkSoft, fontSize: 10 },
  select: { maxWidth: 190, minHeight: 30, padding: "3px 6px", border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 4, background: tokens.colors.paper, color: tokens.colors.ink, font: "inherit" },
  delegation: { display: "flex", alignItems: "center", gap: 5, maxWidth: 175, color: tokens.colors.inkSoft, lineHeight: 1.25 },
  liveTarget: { color: tokens.colors.inkSoft },
  primary: { minHeight: 32, padding: "6px 10px", border: `1px solid ${tokens.colors.focus}`, borderRadius: 4, background: tokens.colors.focus, color: tokens.colors.paper, font: "inherit", fontWeight: tokens.typography.weights.medium, cursor: "pointer" },
  secondary: { minHeight: 32, padding: "6px 10px", border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 4, background: tokens.colors.paper, color: tokens.colors.ink, font: "inherit", cursor: "pointer" },
  statusLine: { display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: "4px 12px", marginTop: 6, minHeight: 20, color: tokens.colors.inkSoft },
  pendingNotice: { margin: "4px 0 0", color: tokens.colors.inkSoft, lineHeight: 1.4 },
  conflictDetails: { marginTop: 5, paddingTop: 5, borderTop: `1px solid ${tokens.colors.rule}`, color: tokens.colors.destructive },
  conflictList: { display: "grid", gap: 5, margin: "5px 0 0", paddingLeft: 20 },
  conflictItem: { display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 4 },
  pulse: { display: "inline-block", width: 7, height: 7, marginRight: 6, borderRadius: "50%", background: tokens.colors.focus },
  error: { color: tokens.colors.destructive },
  linkButton: { padding: 0, border: 0, background: "transparent", color: tokens.colors.focus, font: "inherit", textDecoration: "underline", cursor: "pointer" },
  continuePanel: { display: "flex", flexWrap: "wrap" as const, alignItems: "end", gap: 8, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${tokens.colors.rule}` },
  decision: { flex: "1 0 100%", margin: 0, color: tokens.colors.ink, lineHeight: 1.4 },
  answerLabel: { display: "grid", gap: 4, color: tokens.colors.inkSoft },
  answerInput: { width: "100%", resize: "vertical" as const, padding: 7, border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 4, background: tokens.colors.paper, color: tokens.colors.ink, font: "inherit" },
  acceptUsage: { flex: "1 0 100%", display: "flex", alignItems: "center", gap: 5, color: tokens.colors.inkSoft },
  budgetExtension: { flex: "1 0 100%", display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 8, color: tokens.colors.inkSoft, borderTop: `1px solid ${tokens.colors.rule}`, paddingTop: 8 },
  activityDetails: { marginTop: 7, borderTop: `1px solid ${tokens.colors.rule}`, paddingTop: 6 },
};
