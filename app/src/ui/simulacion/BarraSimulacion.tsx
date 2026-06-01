import type { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useZustandSimulationPort } from "../../app/ports/zustandSimulationPort";
import { useBreakpoint } from "../layoutResponsive";
import { tokens } from "../tokens";

export function BarraSimulacion(): JSX.Element | null {
  const {
    contexto,
    autoAvance,
    velocidad: velocidadSimulacion,
    headless,
    ejecutarPaso,
    ejecutarCorrida,
    reiniciar,
    iniciarAutoAvance,
    pausarAutoAvance,
    fijarVelocidad,
    alternarHeadless,
    salir,
  } = useZustandSimulationPort();

  const esMobile = useBreakpoint() === "mobile";

  useEffect(() => {
    if (!contexto || !autoAvance || contexto.estado === "completado" || contexto.plan.length === 0) return;
    const timeoutId = window.setTimeout(ejecutarPaso, intervaloAutoAvanceMs(velocidadSimulacion));
    return () => window.clearTimeout(timeoutId);
  }, [autoAvance, contexto?.estado, contexto?.modeloId, contexto?.pasoActual, contexto?.plan.length, ejecutarPaso, velocidadSimulacion]);

  if (!contexto) return null;

  const pasoActual = contexto.plan[contexto.pasoActual];
  const completado = contexto.estado === "completado";
  const totalPasos = contexto.plan.length;
  const ejecutados = contexto.trace.length;
  const sinProcesos = totalPasos === 0;
  const C = tokens.colors;

  const handleScrub = (n: number) => {
    if (sinProcesos || n < 0 || n > totalPasos) return;
    reiniciar();
    for (let i = 0; i < n; i++) ejecutarPaso();
  };

  const velocidades = [0.5, 1, 2, 4] as const;

  return (
    <div
      data-testid="barra-simulacion"
      role="toolbar"
      aria-label="Controles de simulacion"
      style={esMobile ? s.barra : { ...s.barra, ...s.barraOverlayDesktop }}
    >
      <div style={s.fila}>
        <span style={s.tag}>Simulacion</span>
        {sinProcesos ? (
          <span style={s.contador}>Este modelo no tiene procesos que simular</span>
        ) : completado ? (
          <span style={{ ...s.estadoTexto, color: C.success }} data-testid="barra-simulacion-progreso">
            Completada &middot; {totalPasos} pasos
          </span>
        ) : (
          <span style={s.estadoTexto} data-testid="barra-simulacion-progreso">
            {autoAvance ? "Reproduciendo" : "Listo para simular"} &middot; paso {Math.min(ejecutados + 1, totalPasos)} de {totalPasos}
          </span>
        )}
        {pasoActual && !completado ? (
          <span style={s.procesoActivo} data-testid="barra-simulacion-proceso-activo">
            {pasoActual.procesoNombre}
          </span>
        ) : null}
        {pasoActual ? (
          <span style={s.opd} data-testid="barra-simulacion-opd">
            {pasoActual.opdNombre}{pasoActual.opdHijoNombre ? ` \u25b8 ${pasoActual.opdHijoNombre}` : ""}
          </span>
        ) : null}
        {completado ? (
          <span style={s.check}>listo</span>
        ) : null}
      </div>

      <div style={s.fila}>
        {/* Controles como palabras */}
        <button
          type="button"
          style={{ ...s.control, ...(autoAvance ? s.controlActivo : {}), fontWeight: 600 }}
          onClick={autoAvance ? pausarAutoAvance : iniciarAutoAvance}
          disabled={sinProcesos || completado}
          data-testid="barra-simulacion-auto"
          aria-pressed={autoAvance}
          title={autoAvance ? "Pausar (Espacio)" : "Reproducir (Ctrl+P)"}
        >
          {autoAvance ? "pausa" : "reproducir"}
          <kbd style={s.kbd}>P</kbd>
        </button>
        <span style={s.sep}>&middot;</span>

        {!autoAvance ? (
          <>
            <button type="button" style={s.control} onClick={ejecutarPaso} disabled={sinProcesos || completado} data-testid="barra-simulacion-paso" title="Avanzar un paso">
              paso <span style={s.flecha}>&#9656;</span>
            </button>
            <span style={s.sep}>&middot;</span>
          </>
        ) : null}

        <button type="button" style={s.control} onClick={ejecutarCorrida} disabled={sinProcesos || completado} data-testid="barra-simulacion-correr" title="Ejecutar todos los pasos restantes sin animacion">
          correr
        </button>
        <span style={s.sep}>&middot;</span>

        <button type="button" style={s.control} onClick={reiniciar} disabled={sinProcesos} data-testid="barra-simulacion-reiniciar" title="Volver al paso 0">
          reiniciar
        </button>
        <span style={s.sep}>&middot;</span>

        <button type="button" style={s.control} onClick={alternarHeadless} aria-pressed={headless} title="Headless: corre sin animacion de tokens" data-testid="barra-simulacion-headless">
          {headless ? "headless activo" : "headless"}
        </button>
        <span style={s.sep}>&middot;</span>

        <button type="button" style={{ ...s.control, marginLeft: 4 }} onClick={salir} data-testid="barra-simulacion-salir" title="Salir del modo simulacion (Escape)">
          salir
          <kbd style={s.kbd}>&#x238B;</kbd>
        </button>

        {/* Velocidad: segmented inline */}
        {!sinProcesos ? (
          <span style={s.segmented} data-testid="barra-simulacion-velocidad">
            {velocidades.map((v) => (
              <button
                key={v}
                type="button"
                style={{ ...s.segmentBtn, ...(velocidadSimulacion === v ? s.segmentActivo : {}) }}
                onClick={() => fijarVelocidad(v)}
                title={`Velocidad ${v}x`}
              >
                {v === 0.5 ? "\u00BDx" : `${v}x`}
              </button>
            ))}
          </span>
        ) : null}
      </div>

      {/* Timeline: marcos navegables (scrubbing) */}
      {!sinProcesos && totalPasos <= 30 ? (
        <div style={s.timeline} data-testid="barra-simulacion-timeline">
          {Array.from({ length: Math.max(1, totalPasos) }, (_, i) => (
            <button
              key={i}
              type="button"
              style={{ ...s.marco, ...(i === ejecutados ? s.marcoActual : {}) }}
              onClick={() => handleScrub(i)}
              title={`Ir al paso ${i === 0 ? "inicial" : i}`}
            >
              {i === 0 ? "ini" : i}
            </button>
          ))}
        </div>
      ) : !sinProcesos ? (
        <span style={s.timelineGrande}>
          {ejecutados} de {totalPasos} pasos &middot; usar paso &#9656; para navegar
        </span>
      ) : null}

      {/* Timer mono */}
      {!sinProcesos ? (
        <span style={s.timer}>
          {String(ejecutados).padStart(2, "0")} / {String(totalPasos).padStart(2, "0")}
        </span>
      ) : null}

      {contexto.trace.length > 0 ? (
        <div style={s.trace} data-testid="barra-simulacion-trace" aria-label="Trace de simulacion">
          {contexto.trace.slice(-4).map((entrada) => (
            <span key={entrada.numero} style={s.traceItem}>
              <span style={s.traceNumero}>#{entrada.numero}</span>
              <span style={s.traceProceso}>{entrada.procesoNombre}</span>
              {entrada.diagnostico ? <span style={s.traceDiag} title={entrada.diagnostico}>!</span> : null}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function intervaloAutoAvanceMs(velocidad: number): number {
  return Math.round(900 / velocidad);
}

const C = tokens.colors;
const T = tokens.typography;

const s: Record<string, JSX.CSSProperties> = {
  barra: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `6px ${tokens.spacing.md}px`,
    background: C.paper,
    borderBottom: `1px solid ${C.rule}`,
    minHeight: 44,
    flexWrap: "wrap",
    fontFamily: T.fontFamily,
    fontSize: T.sizes.sm,
    color: C.ink,
  },
  barraOverlayDesktop: {
    position: "fixed",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  fila: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap" as const,
  },
  tag: {
    fontWeight: 600,
    fontSize: T.sizes.xs,
    color: C.crimson,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    marginRight: 4,
  },
  contador: {
    fontSize: T.sizes.sm,
    color: C.inkSoft,
    fontStyle: "italic",
  },
  estadoTexto: {
    fontSize: T.sizes.sm,
    color: C.inkMid,
    fontStyle: "italic",
  },
  procesoActivo: {
    fontStyle: "italic",
    fontSize: T.sizes.sm,
    color: C.crimson,
    padding: `1px 6px`,
  },
  opd: {
    fontSize: T.sizes.sm,
    color: C.inkSoft,
    fontFamily: T.fontFamilyMono,
  },
  check: {
    fontSize: T.sizes.sm,
    color: C.success,
    fontStyle: "italic",
  },
  control: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    height: 28,
    padding: "0 6px",
    fontSize: T.sizes.sm,
    fontFamily: T.fontFamily,
    color: C.ink,
    background: "transparent",
    border: "none",
    borderBottom: "1px solid transparent",
    borderRadius: 0,
    cursor: "pointer",
    transition: "color 120ms ease, border-color 120ms ease",
  },
  controlActivo: {
    borderBottom: `1px solid ${C.crimson}`,
    color: C.ink,
  },
  sep: {
    color: C.inkFaint,
    userSelect: "none" as const,
    fontSize: T.sizes.sm,
  },
  kbd: {
    fontFamily: T.fontFamilyMono,
    fontSize: 10,
    letterSpacing: "0.06em",
    color: C.inkFaint,
    border: `1px solid ${C.rule}`,
    padding: "0 3px",
    borderRadius: 0,
    lineHeight: "16px",
  },
  flecha: {
    fontSize: 9,
  },
  segmented: {
    display: "inline-flex",
    alignItems: "center",
    marginLeft: tokens.spacing.sm,
    border: `1px solid ${C.rule}`,
  },
  segmentBtn: {
    display: "inline-flex",
    alignItems: "center",
    height: 28,
    padding: "0 8px",
    fontSize: 11,
    fontFamily: T.fontFamilyMono,
    fontVariantNumeric: "tabular-nums",
    color: C.inkSoft,
    background: "transparent",
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
    transition: "color 120ms ease, background 120ms ease",
  },
  segmentActivo: {
    fontWeight: 600,
    color: C.ink,
    background: C.paperWarm,
  },
  timeline: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    marginLeft: tokens.spacing.sm,
    flexWrap: "wrap" as const,
  },
  marco: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 26,
    height: 22,
    padding: "0 4px",
    fontSize: 10,
    fontFamily: T.fontFamilyMono,
    fontVariantNumeric: "tabular-nums",
    color: C.inkFaint,
    background: "transparent",
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
    transition: "color 120ms ease, fontWeight 120ms ease",
  },
  marcoActual: {
    fontWeight: 600,
    color: C.crimson,
  },
  timelineGrande: {
    fontSize: 10,
    fontFamily: T.fontFamilyMono,
    color: C.inkFaint,
    marginLeft: tokens.spacing.sm,
  },
  timer: {
    fontSize: 10,
    fontFamily: T.fontFamilyMono,
    fontVariantNumeric: "tabular-nums",
    color: C.inkSoft,
    marginLeft: tokens.spacing.sm,
  },
  trace: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap" as const,
  },
  traceItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 6px",
    background: C.paperWarm,
    border: `1px solid ${C.rule}`,
    fontSize: 10,
    fontFamily: T.fontFamilyMono,
  },
  traceNumero: {
    fontWeight: 600,
    color: C.inkSoft,
  },
  traceProceso: {
    fontWeight: 500,
    color: C.ink,
  },
  traceDiag: {
    color: C.crimson,
    fontWeight: 700,
  },
};
