import type { AgentChangeView, PreparedAgentChange } from "../../persistencia/agentClient";
import type { SemanticOperation } from "../../modelo/changes/types";
import { tokens } from "../tokens";

interface ChangeReviewProps {
  change: AgentChangeView | null;
  prepared: PreparedAgentChange | null;
  busy: boolean;
  canApply: boolean;
  onApply: () => void;
}

export function ChangeReview({ change, prepared, busy, canApply, onApply }: ChangeReviewProps) {
  const candidate = prepared?.change ?? change?.change;
  const diff = prepared?.diff ?? change?.diff;
  if (!candidate) return null;
  return (
    <section aria-label="Revisión de cambios" data-testid="agent-change-review" style={style.root}>
      <header style={style.header}>
        <div>
          <strong>Propuesta de cambio</strong>
          <span style={style.target}>{candidate.target.kind === "variant" ? "Variante" : "Documento vigente"}</span>
          <p style={style.explanation}>{candidate.explanation || "Cambio semántico preparado para revisión."}</p>
        </div>
        {canApply && diff ? (
          <button type="button" onClick={onApply} disabled={busy} style={style.primary}>
            Incorporar al documento
          </button>
        ) : null}
      </header>

      <div style={style.summary} aria-label="Resumen del cambio semántico">
        {candidate.operations.map((operation) => (
          <span key={operation.operationId} style={style.operation}>{describeOperation(operation)}</span>
        ))}
      </div>

      {diff ? (
        <details style={style.details}>
          <summary>Ver diferencia OPD y OPL</summary>
          <div style={style.diffBody}>
            <section aria-label="Diferencia de estructura OPD">
              <h4 style={style.heading}>Cambios semánticos</h4>
              {candidate.operations.length ? (
                <ul style={style.changeList}>
                  {candidate.operations.map((operation) => <li key={operation.operationId}>{describeOperation(operation)}</li>)}
                </ul>
              ) : diff.changes.length ? <p style={style.muted}>El cambio modifica la estructura del modelo.</p> : <p style={style.muted}>No hay diferencias semánticas pendientes.</p>}
            </section>
            <section aria-label="Diferencia de texto OPL">
              <h4 style={style.heading}>Texto OPL por OPD</h4>
              {diff.opl.length ? diff.opl.map((item, index) => (
                <div key={item.opdId} style={style.oplDiff}>
                  <h5 style={style.opdLabel}>OPD afectado {diff.opl.length > 1 ? index + 1 : ""}</h5>
                  <div style={style.columns}>
                    <div><span style={style.columnLabel}>Antes</span><pre style={style.oplText}>{item.before.join("\n") || "(vacío)"}</pre></div>
                    <div><span style={style.columnLabel}>Propuesta</span><pre style={style.oplText}>{item.after.join("\n") || "(vacío)"}</pre></div>
                  </div>
                </div>
              )) : <p style={style.muted}>No hay diferencia textual OPL en los OPD proyectados.</p>}
            </section>
          </div>
        </details>
      ) : (
        <p role="status" style={{ ...style.muted, padding: 12 }}>
          {validationMessage(change?.validation) ?? "Esta diferencia necesita comprobarse de nuevo sobre el documento vigente."} No se puede aplicar todavía.
        </p>
      )}
    </section>
  );
}

function describeOperation(operation: SemanticOperation): string {
  switch (operation.kind) {
    case "createObject": return `Crear objeto «${operation.name}»`;
    case "createProcess": return `Crear proceso «${operation.name}»`;
    case "createState": return `Crear estado «${operation.name}»`;
    case "renameEntity": return `Renombrar «${operation.beforeName}» a «${operation.afterName}»`;
    case "renameState": return `Renombrar estado «${operation.beforeName}» a «${operation.afterName}»`;
    case "createProceduralLink": return `Crear relación de ${linkLabel(operation.linkType)}`;
    case "deleteLink": return "Eliminar relación";
    case "deleteState": return "Eliminar estado";
    case "deleteEntity": return "Eliminar elemento";
    case "createRefinement": return operation.refinementType === "descomposicion" ? "Crear un nivel de descomposición" : "Crear un nivel de despliegue";
    case "createXorExclusion": return "Crear alternativas excluyentes (XOR)";
    case "copyPiece": return "Copiar una pieza con identidad propia";
    case "connectPieceReference": return "Vincular una pieza externa protegida";
    case "replaceSubmodelReference": return "Actualizar la versión de una pieza vinculada";
    default: return "Actualizar una pieza del documento";
  }
}

function linkLabel(kind: string): string {
  const labels: Record<string, string> = {
    agente: "agente", instrumento: "instrumento", consumo: "consumo", resultado: "resultado", efecto: "efecto", invocacion: "invocación",
  };
  return labels[kind] ?? "enlace";
}

function validationMessage(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const message = (value as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

const style = {
  root: { marginTop: 10, border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 4, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.sans, fontSize: 12 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: 12 },
  target: { marginLeft: 10, color: tokens.colors.inkSoft },
  explanation: { margin: "6px 0 0", color: tokens.colors.inkSoft, lineHeight: 1.45 },
  primary: { flex: "0 0 auto", border: `1px solid ${tokens.colors.focus}`, borderRadius: 4, padding: "7px 10px", color: tokens.colors.paper, background: tokens.colors.focus, font: "inherit", cursor: "pointer" },
  summary: { display: "flex", flexWrap: "wrap" as const, gap: 6, padding: "0 12px 10px" },
  operation: { borderRadius: 12, padding: "3px 8px", background: tokens.colors.ink04, color: tokens.colors.inkSoft },
  details: { borderTop: `1px solid ${tokens.colors.rule}` },
  diffBody: { display: "grid", gap: 14, padding: 12 },
  heading: { margin: "0 0 8px", fontSize: 12, fontWeight: tokens.typography.weights.medium },
  changeList: { display: "grid", gap: 5, margin: 0, paddingLeft: 20, overflowWrap: "anywhere" as const },
  muted: { margin: 0, color: tokens.colors.inkSoft },
  oplDiff: { borderTop: `1px solid ${tokens.colors.rule}`, paddingTop: 8, marginTop: 8 },
  opdLabel: { margin: "0 0 6px", fontSize: 11, color: tokens.colors.inkSoft },
  columns: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 },
  columnLabel: { display: "block", marginBottom: 4, color: tokens.colors.inkSoft },
  oplText: { maxHeight: 200, overflow: "auto", margin: 0, padding: 8, background: tokens.colors.paperWarm, font: "inherit", fontSize: 11, whiteSpace: "pre-wrap" as const, overflowWrap: "anywhere" as const },
};
