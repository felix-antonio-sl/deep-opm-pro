import type { TaskView } from "../../agent/taskView";
import { taskStatusLabel } from "../../agent/taskState";
import { tokens } from "../tokens";

export function TaskActivity({ task }: { task: TaskView | null }) {
  if (!task) return <p style={style.muted}>Todavía no hay actividad de agente.</p>;
  return (
    <section aria-label="Actividad del encargo" data-testid="agent-task-activity" style={style.root}>
      <div style={style.header}>
        <strong>{taskStatusLabel(task.status)}</strong>
        <span>{task.intent.target.kind === "variant" ? "Variante" : "Documento vigente"}</span>
      </div>
      <p style={style.outcome}>{task.intent.outcome}</p>
      {task.reason ? <p role="status" style={style.note}>{taskReason(task.reason)}</p> : null}
      <dl style={style.usage}>
        <div><dt>Herramientas</dt><dd>{task.usage.toolCalls}/{task.budget.maxToolCalls}</dd></div>
        <div><dt>Modelo</dt><dd>{task.model}</dd></div>
        <div><dt>Uso estimado</dt><dd>{task.usage.usageUnknown ? "reserva sin confirmar" : formatUsd(task.usage.estimatedUsd)}</dd></div>
      </dl>
      {task.results.length ? (
        <ol style={style.results}>
          {task.results.map((result) => (
            <li key={result.id}>
              <span style={style.resultKind}>{result.kind === "warning" ? "Aviso" : result.kind === "proposal" ? "Propuesta" : "Resultado"}</span>
              <span>{summarize(result.payload)}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function summarize(value: unknown): string {
  if (typeof value === "string") return value.slice(0, 600);
  if (!value || typeof value !== "object") return String(value ?? "");
  const record = value as Record<string, unknown>;
  for (const key of ["message", "summary", "result", "text"]) {
    if (typeof record[key] === "string") return (record[key] as string).slice(0, 600);
  }
  return "Se registró un resultado estructurado.";
}

function taskReason(reason: string): string {
  const known: Record<string, string> = {
    "operator-stop": "El encargo se detuvo. Los cambios ya aplicados permanecen en el documento.",
    "controller-absent": "El encargo quedó suspendido porque el documento no estaba abierto.",
    "usage-unavailable": "El proveedor no informó el uso de la última llamada; la reserva permanece contabilizada.",
    "result-not-verified": "El resultado necesita una comprobación antes de continuar.",
    "request-budget": "El encargo alcanzó el límite de la llamada y conserva su trabajo parcial.",
    "model-call-budget": "Se alcanzó el límite de llamadas configurado.",
    "tool-call-budget": "Se alcanzó el límite de herramientas configurado.",
    "input-token-budget": "Se alcanzó el límite de tokens de entrada configurado.",
    "output-token-budget": "Se alcanzó el límite de tokens de salida configurado.",
    "cost-budget": "Se alcanzó el límite de coste configurado.",
    "time-budget": "Se alcanzó el tiempo máximo configurado.",
    "provider-error": "El proveedor falló; se conservan los cambios ya confirmados.",
  };
  return known[reason] ?? "El encargo necesita atención antes de continuar.";
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(value);
}

const style = {
  root: { borderTop: `1px solid ${tokens.colors.rule}`, paddingTop: 10, color: tokens.colors.ink, fontFamily: tokens.typography.sans, fontSize: 12 },
  header: { display: "flex", justifyContent: "space-between", gap: 12, color: tokens.colors.inkSoft },
  outcome: { margin: "8px 0", fontSize: 13, color: tokens.colors.ink },
  muted: { margin: 0, color: tokens.colors.inkSoft, fontSize: 12 },
  note: { margin: "6px 0", color: tokens.colors.inkSoft },
  usage: { display: "flex", flexWrap: "wrap" as const, gap: "4px 16px", margin: "8px 0" },
  results: { margin: "8px 0 0", paddingLeft: 20, display: "grid", gap: 6 },
  resultKind: { display: "inline-block", minWidth: 70, color: tokens.colors.inkSoft },
};
