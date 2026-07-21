import type { ComponentChildren } from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { useZustandOpdNavigationPort } from "../../app/ports/zustandOpdNavigationPort";
import { useZustandEditabilityPort } from "../../app/ports/zustandEditabilityPort";
import { useOpmStore } from "../../store";
import { codigoOpd } from "../arbol/NodoOpd";
import { useCanvasPaper } from "../CanvasAdapterContext";
import { tokens } from "../tokens";
import { CodexSelectionAnnotation } from "./CodexSelectionAnnotation";
import { GLIFO_SEP } from "./glifos";
import { useTutorContent } from "../useTutorContent";
import { TutorFoundationLinks, useTutorDisclosurePreference } from "../TutorDetails";

interface CodexCanvasMountProps {
  children: ComponentChildren;
  floating?: ComponentChildren;
  /**
   * Slot para una franja chrome del canvas que se monta ARRIBA del header
   * (kicker + zoom) y ARRIBA del `paperHost` (JointJS).
   *
   * BUG-20260607T224342Z-a8e599: la barra de simulación solía ser un
   * overlay `position: fixed` con `left: 0; right: 0` que cubría los
   * botones de ocultar panel (◀/▶) que viven en la parte superior de
   * los paneles laterales OPL/Inspector. Como `topbar` la barra vive
   * DENTRO de la región canvas, jamás toca los paneles laterales.
   */
  topbar?: ComponentChildren;
  chromeVisible?: boolean;
}

export function CodexCanvasMount({ children, floating, topbar, chromeVisible = true }: CodexCanvasMountProps) {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const opdActivo = modelo.opds[opdActivoId];
  const code = opdActivo ? codigoOpd(opdActivo.nombre) : "SD";
  const esRaiz = opdActivoId === modelo.opdRaizId;
  // §4: kicker "SD · OPD raíz" (del OPD activo, lectura). Para OPDs hijos se
  // refleja el código + "OPD refinado" para no mentir sobre la jerarquía.
  const kicker = `${code} ${GLIFO_SEP} ${esRaiz ? "OPD raíz" : "OPD refinado"}`;
  const zoom = useZoomDisplay();

  return (
    <div data-testid="canvas-pane" style={style.canvas}>
      {topbar ? <div data-testid="canvas-topbar" style={style.topbar}>{topbar}</div> : null}
      {chromeVisible ? <div data-testid="canvas-header" style={style.header}>
        <span style={style.kicker}>{kicker}</span>
        <span data-testid="canvas-zoom" style={style.zoom}>{`zoom ${GLIFO_SEP} ${zoom}`}</span>
      </div> : null}
      {chromeVisible && opdActivo && !esRaiz ? <PreguntaGuiaOpd opdId={opdActivo.id} pregunta={opdActivo.preguntaGuia} /> : null}
      <div style={style.paperHost}>
        {children}
        {floating ? <div style={style.floating}>{floating}</div> : null}
        <CodexSelectionAnnotation />
      </div>
    </div>
  );
}

function PreguntaGuiaOpd({ opdId, pregunta }: { opdId: string; pregunta: string | undefined }) {
  const actualizar = useOpmStore((s) => s.actualizarPreguntaGuiaOpd);
  const cancelarRenombradoPendiente = useOpmStore((s) => s.cancelarRenombradoPendiente);
  const { readOnly } = useZustandEditabilityPort();
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(pregunta ?? "");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const disparadorRef = useRef<HTMLButtonElement>(null);
  const vistaTutor = useTutorContent("content.refinement.question");
  const [porqueAbierto, setPorqueAbierto] = useTutorDisclosurePreference(
    "content.refinement.question",
    "criterio",
  );

  useEffect(() => {
    setEditando(false);
    setValor(pregunta ?? "");
    setError("");
  }, [opdId, pregunta]);

  useLayoutEffect(() => {
    if (!editando) return undefined;
    inputRef.current?.focus();
    return undefined;
  }, [editando]);

  const iniciarEdicion = () => {
    cancelarRenombradoPendiente();
    setEditando(true);
  };

  const cancelar = () => {
    setValor(pregunta ?? "");
    setError("");
    setEditando(false);
    requestAnimationFrame(() => disparadorRef.current?.focus());
  };

  if (editando) {
    const guardar = () => {
      if (!valor.trim()) {
        setError("La pregunta guía no puede quedar vacía.");
        return;
      }
      actualizar(opdId, valor);
      setEditando(false);
      setError("");
    };
    return (
      <form
        data-atajos-local="true"
        data-testid="pregunta-guia-editor"
        style={style.preguntaEditor}
        onSubmit={(event) => {
          event.preventDefault();
          guardar();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancelar();
          }
        }}
      >
        <label style={style.preguntaCampo}>
          <span style={style.preguntaRotulo}>PREGUNTA GUÍA</span>
          <input
            ref={inputRef}
            autoFocus
            aria-label="Pregunta guía"
            aria-describedby="pregunta-guia-error"
            data-testid="pregunta-guia-input"
            placeholder="Escribe la pregunta…"
            style={style.preguntaInput}
            value={valor}
            onInput={(event) => setValor(event.currentTarget.value)}
          />
        </label>
        <span id="pregunta-guia-error" role="alert" aria-live="assertive" style={style.preguntaError}>{error}</span>
        <details
          open={porqueAbierto}
          style={style.preguntaPorque}
          onToggle={(event) => setPorqueAbierto(event.currentTarget.open)}
        >
          <summary>Por qué</summary>
          <p style={style.preguntaPorqueTexto}>{vistaTutor?.contenido.criterion}</p>
          <p style={style.preguntaFundamento}>
            <TutorFoundationLinks referencias={vistaTutor?.referencias ?? []} inline />
          </p>
        </details>
        <button type="button" style={style.preguntaAccion} onClick={cancelar}>Cancelar</button>
        <button type="submit" style={style.preguntaAccionPrimaria}>Guardar pregunta</button>
      </form>
    );
  }

  return (
    <div data-testid="pregunta-guia-opd" role="note" style={style.preguntaLinea}>
      {pregunta ? (
        <>
          <span style={style.preguntaRotulo}>PREGUNTA GUÍA</span>
          <span aria-hidden="true">{` ${GLIFO_SEP} `}</span>
          <span style={style.preguntaTexto}>{pregunta}</span>
          {!readOnly ? <><span aria-hidden="true">{` ${GLIFO_SEP} `}</span><button ref={disparadorRef} type="button" style={style.preguntaAccion} onClick={iniciarEdicion}>Editar</button></> : null}
        </>
      ) : (
        <>
          <span style={style.preguntaTexto}>Este OPD no tiene pregunta guía.</span>
          {!readOnly ? <><span aria-hidden="true">{` ${GLIFO_SEP} `}</span><button ref={disparadorRef} type="button" style={style.preguntaAccion} onClick={iniciarEdicion}>Añadir pregunta</button></> : null}
        </>
      )}
    </div>
  );
}

// Refleja paper.scale() como porcentaje (§4: display de zoom). 100% sin paper.
function useZoomDisplay(): string {
  const paper = useCanvasPaper();
  const [zoom, setZoom] = useState("100%");

  useEffect(() => {
    if (!paper) {
      setZoom("100%");
      return undefined;
    }
    const leer = () => setZoom(formatearZoom(escalaDePaper(paper)));
    leer();
    const eventos = paper as unknown as { on(e: string, cb: () => void): void; off(e: string, cb: () => void): void };
    eventos.on("scale transform resize", leer);
    return () => eventos.off("scale transform resize", leer);
  }, [paper]);

  return zoom;
}

function escalaDePaper(paper: unknown): number {
  const conScale = paper as { scale?: () => { sx: number } };
  const sx = conScale.scale?.().sx;
  return typeof sx === "number" && Number.isFinite(sx) && sx > 0 ? sx : 1;
}

export function formatearZoom(escala: number): string {
  return `${Math.round(escala * 100)}%`;
}

const style = {
  canvas: {
    gridArea: "canvas",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    background: tokens.colors.paperWarm,
  },
  topbar: {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 18px 8px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  preguntaLinea: {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    alignItems: "baseline",
    gap: "5px",
    padding: "0 18px 9px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
    lineHeight: tokens.typography.lh.body,
  },
  preguntaRotulo: {
    flex: "0 0 auto",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    letterSpacing: tokens.typography.ls.kicker,
  },
  preguntaTexto: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.inkMid,
  },
  preguntaAccion: {
    flex: "0 0 auto",
    border: 0,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.inkSoft}`,
    borderRadius: 0,
    padding: "1px",
    background: "transparent",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
    cursor: "pointer",
  },
  preguntaEditor: {
    flex: "0 0 auto",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    alignItems: "end",
    gap: "8px",
    padding: "7px 18px 9px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    background: tokens.colors.paperWarm,
  },
  preguntaCampo: {
    minWidth: 0,
    display: "grid",
    gap: "4px",
  },
  preguntaInput: {
    width: "100%",
    minWidth: 0,
    height: "32px",
    boxSizing: "border-box",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    padding: "5px 8px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  preguntaError: {
    gridColumn: "1 / -1",
    minHeight: "14px",
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.fs.fs10}px`,
  },
  preguntaPorque: {
    gridColumn: "1 / -1",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs11}px`,
  },
  preguntaPorqueTexto: {
    margin: "5px 0 2px",
    color: tokens.colors.inkMid,
  },
  preguntaFundamento: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
  },
  preguntaAccionPrimaria: {
    minHeight: "32px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    padding: "5px 9px",
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
    fontWeight: tokens.typography.weights.bold,
    cursor: "pointer",
  },
  kicker: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    letterSpacing: tokens.typography.ls.kicker,
    textTransform: "uppercase",
  },
  zoom: {
    flex: "0 0 auto",
    whiteSpace: "nowrap",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.mono,
  },
  paperHost: {
    position: "relative",
    flex: "1 1 auto",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  floating: {
    position: "absolute",
    left: "16px",
    top: "16px",
    zIndex: 12,
    pointerEvents: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
