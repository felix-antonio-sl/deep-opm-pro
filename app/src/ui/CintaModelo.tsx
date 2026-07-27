import type { JSX } from "preact";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

/** Identidad visible del documento reconocido: Modelo de Trabajo en Modelos. */
export function CintaModelo(): JSX.Element | null {
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const esModeloTrabajo = useOpmStore((s) => s.indice.modelos.some((entrada) =>
    entrada.id === s.modelo.id &&
    entrada.esApunte !== true &&
    entrada.esBiblioteca !== true &&
    entrada.archivado !== true
  ));
  const abrirReapertura = useOpmStore((s) => s.abrirReaperturaTaller);

  if (!modeloPersistidoId || !esModeloTrabajo) return null;

  return (
    <div
      data-testid="cinta-modelo"
      data-tutor-capability="cap.lifecycle.regime"
      role="status"
      aria-live="polite"
      style={s.cinta}
    >
      <span style={s.glifo} aria-hidden="true">◆</span>
      <span style={s.texto} data-testid="cinta-modelo-estado">
        <span style={s.rotulo}>Modelo</span> {"·"} en Modelos {"·"} rigor de cierre exigible
      </span>
      <button
        type="button"
        data-testid="cinta-modelo-reabrir"
        data-tutor-entrypoint="workspace:reopen-workshop"
        style={s.accion}
        onClick={() => abrirReapertura(modeloPersistidoId)}
      >
        Reabrir en Taller
      </button>
    </div>
  );
}

const C = tokens.colors;
const T = tokens.typography;

const s = {
  cinta: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `5px ${tokens.spacing.md}px`,
    minHeight: 34,
    background: C.paperWarm,
    borderTop: `1px solid ${C.rule}`,
    borderBottom: `1px solid ${C.rule}`,
    fontFamily: T.serif,
    fontSize: T.fs.fs13,
    color: C.inkFaint,
  },
  glifo: {
    fontFamily: T.mono,
    fontSize: T.fs.fs12,
    color: C.inkFaint,
    lineHeight: 1,
    flex: "0 0 auto",
  },
  texto: { color: C.inkFaint, minWidth: 0 },
  rotulo: {
    color: C.inkSoft,
    fontWeight: T.weights.bold,
    letterSpacing: tokens.typography.ls.body,
  },
  accion: {
    marginLeft: "auto",
    flex: "0 0 auto",
    border: 0,
    borderBottom: `1px solid ${C.inkSoft}`,
    background: "transparent",
    padding: "2px",
    color: C.inkSoft,
    fontFamily: T.serif,
    fontSize: T.fs.fs13,
    fontWeight: T.weights.bold,
    cursor: "pointer",
    transition: tokens.transitions.fast,
  },
} satisfies Record<string, JSX.CSSProperties>;
