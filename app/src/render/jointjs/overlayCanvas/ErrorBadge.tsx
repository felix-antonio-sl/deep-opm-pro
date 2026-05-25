import type { dia } from "jointjs";
import { EVENTO_ABRIR_AVISO_DIAGNOSTICO, type FeedbackOverlay } from "../../../app/ports/feedbackPort";
import { tokens } from "../../../ui/tokens";
import { useBboxTracker } from "./useBboxTracker";

interface Props {
  overlay: Extract<FeedbackOverlay, { tipo: "inline-error" }>;
  paper: dia.Paper | null;
}

export function ErrorBadge({ overlay, paper }: Props) {
  const bbox = useBboxTracker(paper, overlay.anchorCellId);
  if (!bbox) return null;

  return (
    <span
      role="img"
      tabIndex={0}
      aria-label={`Aviso: ${etiquetaSeveridad(overlay.severidad)} · ${overlay.reglaId}. ${overlay.mensaje}`}
      data-testid="error-badge"
      data-anchor-cell-id={overlay.anchorCellId}
      data-regla-id={overlay.reglaId}
      title={`${overlay.reglaId}: ${overlay.mensaje}`}
      style={{
        ...style.badge,
        left: `${bbox.x + bbox.width - 4}px`,
        top: `${bbox.y - 10}px`,
        ...(overlay.severidad === "error" ? style.error : style.warning),
      }}
      onClick={() => abrirAvisoDiagnostico(overlay)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          abrirAvisoDiagnostico(overlay);
        }
      }}
    >
      △
    </span>
  );
}

function abrirAvisoDiagnostico(overlay: Extract<FeedbackOverlay, { tipo: "inline-error" }>): void {
  document.querySelector<HTMLElement>('[data-testid="panel-diagnostico"]')?.scrollIntoView({ block: "nearest" });
  window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_AVISO_DIAGNOSTICO, {
    detail: { reglaId: overlay.reglaId, overlayId: overlay.id },
  }));
}

function etiquetaSeveridad(severidad: Extract<FeedbackOverlay, { tipo: "inline-error" }>["severidad"]): string {
  if (severidad === "error") return "error";
  if (severidad === "advertencia") return "advertencia";
  return "información";
}

const style = {
  badge: {
    position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    pointerEvents: "auto",
    cursor: "pointer",
    zIndex: 2,
    userSelect: "none",
  },
  error: {
    color: tokens.colors.crimson,
  },
  warning: {
    color: tokens.colors.inkSoft,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
