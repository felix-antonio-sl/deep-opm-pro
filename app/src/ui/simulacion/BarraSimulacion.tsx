import type { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useZustandSimulationPort } from "../../app/ports/zustandSimulationPort";
import { descriptorFaseSimulacion, fasesDelPasoSimulacion } from "../../modelo/simulacion/fases";
import { useBreakpoint } from "../layoutResponsive";
import { tokens } from "../tokens";
import { proyectarEstadoBarraSimulacion, proyectarNarrativaSimulacion, rotuloTraceSimulacion, type NarrativaSimulacion } from "./proyeccionBarra";

export function BarraSimulacion(): JSX.Element | null {
  const {
    modelo,
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
    fijarModo,
    fijarSemilla,
  } = useZustandSimulationPort();

  const esMobile = useBreakpoint() === "mobile";

  useEffect(() => {
    if (!contexto || !autoAvance || contexto.estado === "completado" || contexto.estado === "bloqueado" || contexto.plan.length === 0) return;
    const timeoutId = window.setTimeout(ejecutarPaso, intervaloAutoAvanceMs(velocidadSimulacion));
    return () => window.clearTimeout(timeoutId);
  }, [autoAvance, contexto?.estado, contexto?.faseActual, contexto?.modeloId, contexto?.pasoActual, contexto?.plan.length, ejecutarPaso, velocidadSimulacion]);

  if (!contexto) return null;

  const pasoActual = contexto.plan[contexto.pasoActual];
  const totalPasos = contexto.plan.length;
  const ejecutados = contexto.trace.length;
  const sinProcesos = totalPasos === 0;
  const estadoBarra = proyectarEstadoBarraSimulacion(contexto, autoAvance);
  const narrativa = proyectarNarrativaSimulacion(modelo, contexto, autoAvance);
  const faseActual = pasoActual ? descriptorFaseSimulacion(modelo, pasoActual, contexto.faseActual) : null;
  const fasesPasoActual = pasoActual ? fasesDelPasoSimulacion(modelo, pasoActual) : [];
  const completado = estadoBarra.completado;
  const bloqueado = estadoBarra.bloqueado;
  const controlesDeshabilitados = sinProcesos || !estadoBarra.puedeEjecutar;
  const C = tokens.colors;

  const velocidades = [0.5, 1, 2, 4] as const;

  return (
    // BUG-20260607T224342Z-a8e599: la barra ya no es un overlay `position:
    // fixed` con `left: 0; right: 0`. Vive DENTRO de la región canvas (vía
    // `CodexCanvasMount.topbar`), por lo que jamás toca los botones ◀/▶
    // de los paneles laterales OPL/Inspector. El "encuadre" se construye
    // con un borde superior 2px crimson y dos spines laterales (3px) con
    // gradiente vertical crimson→50% — un marco editorial que señala
    // "modo simulación" sin tapar al canvas.
    <>
      {/* Keyframe del "live dot" — el pulso crimson marca que la simulación
          está activa. Inyectado una sola vez por render del componente;
          como el nombre del keyframe es único (`sim-live-dot-pulse`) y la
          regla es idempotente, re-renderizar no causa flickering.
          BUG-20260608T171552Z-17477a: además, pseudo-estados de los
          controles (`:hover`, `:active`, `:focus-visible`) y segmentos
          (`:hover`) se manejan aquí, no inline, porque CSS-in-JS inline
          no soporta pseudo-clases. Se anclan a las clases `sim-control`,
          `sim-segment` y al atributo `data-testid="barra-simulacion"` para
          que el scope sea local al componente (no contamina otros
          botones de la app). Los colores vienen de los tokens del design
          system (`paper` / `paperWarm` / `crimson`), no son literales
          nuevos. */}
      <style>{`@keyframes sim-live-dot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.45;transform:scale(1.35)}}.sim-live-dot{animation:sim-live-dot-pulse 1.4s ease-in-out infinite;transform-origin:center}.sim-control:hover:not(:disabled):not(.sim-control-activo){color:${C.ink};background:${C.paper};border-color:${C.ruleStrong}}.sim-control:active:not(:disabled){background:${C.paperWarm}}.sim-control:focus-visible{outline:2px solid ${C.crimson};outline-offset:2px}.sim-control:disabled{color:${C.inkFaint};border-color:${C.paperWarm};cursor:not-allowed}.sim-control.sim-control-activo{color:${C.ink};background:${C.paper};border-color:${C.ruleStrong};border-bottom-color:${C.crimson};border-bottom-width:2px}.sim-control.sim-control-activo:hover:not(:disabled){background:${C.paperWarm}}.sim-segment:hover:not(:disabled){color:${C.ink};background:${C.paper}}.sim-segment:focus-visible{outline:2px solid ${C.crimson};outline-offset:2px}`}</style>
      <div
        data-testid="barra-simulacion"
        role="toolbar"
        aria-label="Controles de simulacion"
        style={esMobile ? { ...s.barra, ...s.barraMobile } : s.barra}
      >
      {!esMobile ? (
        <>
          <div data-testid="barra-simulacion-spine-left" aria-hidden="true" style={s.barraSpine} />
          <div data-testid="barra-simulacion-spine-right" aria-hidden="true" style={{ ...s.barraSpine, left: "auto", right: 0 }} />
        </>
      ) : null}
      <div style={s.fila}>
        <span style={s.tag}>
          {!esMobile ? <span className="sim-live-dot" style={s.tagDot} aria-hidden="true" /> : null}
          Simulacion
        </span>
        {esMobile ? (
          <span
            style={s.narrativaInlineMobile}
            data-testid="barra-simulacion-narrativa"
            aria-live="polite"
            title={narrativa.detalle}
          >
            {narrativa.titulo}
          </span>
        ) : null}
        {sinProcesos ? (
          <span style={s.contador} data-testid="barra-simulacion-progreso">Este modelo no tiene procesos que simular</span>
        ) : completado ? (
          <span style={{ ...s.estadoTexto, color: C.success }} data-testid="barra-simulacion-progreso">
            {estadoBarra.textoProgreso}
          </span>
        ) : bloqueado ? (
          <span style={{ ...s.estadoTexto, color: C.crimson, fontWeight: 600 }} data-testid="barra-simulacion-progreso">
            {estadoBarra.textoProgreso}
          </span>
        ) : (
          <span style={s.estadoTexto} data-testid="barra-simulacion-progreso">
            {estadoBarra.textoProgreso}
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

      {!esMobile ? (
        <div
          style={{ ...s.narrativa, ...estiloNarrativa(narrativa.tono) }}
          data-testid="barra-simulacion-narrativa"
          aria-live="polite"
        >
          <span style={s.narrativaMarca} aria-hidden="true">{marcaNarrativa(narrativa.tono)}</span>
          <span style={s.narrativaTexto}>
            <strong style={s.narrativaTitulo}>{narrativa.titulo}</strong>
            <span style={s.narrativaDetalle}>{narrativa.detalle}</span>
          </span>
          <span style={s.narrativaContexto} aria-label={`Contexto: ${narrativa.contexto.join(", ")}`}>
            {narrativa.contexto.map((item) => (
              <span key={item} style={s.narrativaChip}>{item}</span>
            ))}
          </span>
        </div>
      ) : null}

      <div style={s.filaControles} data-testid="barra-simulacion-fila-controles">
        {/* Controles como palabras */}
        <button
          type="button"
          className={autoAvance ? "sim-control sim-control-activo" : "sim-control"}
          style={{ ...s.control, ...(autoAvance ? s.controlActivo : {}), fontWeight: 600 }}
          onClick={autoAvance ? pausarAutoAvance : iniciarAutoAvance}
          disabled={controlesDeshabilitados}
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
            <button type="button" className="sim-control" style={s.control} onClick={ejecutarPaso} disabled={controlesDeshabilitados} data-testid="barra-simulacion-paso" title="Avanzar una fase">
              fase <span style={s.flecha}>&#9656;</span>
            </button>
            <span style={s.sep}>&middot;</span>
          </>
        ) : null}

        <button type="button" className="sim-control" style={s.control} onClick={ejecutarCorrida} disabled={controlesDeshabilitados} data-testid="barra-simulacion-correr" title="Ejecutar todos los pasos restantes sin animacion">
          correr
        </button>
        <span style={s.sep}>&middot;</span>

        <button type="button" className="sim-control" style={s.control} onClick={reiniciar} disabled={sinProcesos} data-testid="barra-simulacion-reiniciar" title="Volver al paso 0">
          reiniciar
        </button>
        <span style={s.sep}>&middot;</span>

        <button type="button" className="sim-control" style={s.control} onClick={alternarHeadless} aria-pressed={headless} title="Headless: corre sin animacion de tokens" data-testid="barra-simulacion-headless">
          {headless ? "headless activo" : "headless"}
        </button>
        <span style={s.sep}>&middot;</span>

        <button type="button" className="sim-control" style={{ ...s.control, marginLeft: 4 }} onClick={salir} data-testid="barra-simulacion-salir" title="Salir del modo simulacion (Escape)">
          salir
          <kbd style={s.kbd}>&#x238B;</kbd>
        </button>

        {/* Modo: segmented inline */}
        {!sinProcesos ? (
          <span style={s.segmented} data-testid="barra-simulacion-modo">
            {(["determinista", "muestreo", "exhaustivo"] as const).map((m, idx, arr) => (
              <button
                key={m}
                type="button"
                className="sim-segment"
                style={{ ...s.segmentBtn, ...(idx === arr.length - 1 ? s.segmentBtnUltimo : {}), ...((contexto.modo ?? "determinista") === m ? s.segmentActivo : {}) }}
                onClick={() => fijarModo(m)}
                title={`Modo ${m}`}
              >
                {m}
              </button>
            ))}
          </span>
        ) : null}

        {/* Velocidad: segmented inline */}
        {!sinProcesos ? (
          <span style={s.segmented} data-testid="barra-simulacion-velocidad">
            {velocidades.map((v, idx, arr) => (
              <button
                key={v}
                type="button"
                className="sim-segment"
                style={{ ...s.segmentBtn, ...(idx === arr.length - 1 ? s.segmentBtnUltimo : {}), ...(velocidadSimulacion === v ? s.segmentActivo : {}) }}
                onClick={() => fijarVelocidad(v)}
                aria-label={`Velocidad ${v}x`}
                title={`Velocidad ${v}x`}
              >
                {v === 0.5 ? "\u00BDx" : `${v}x`}
              </button>
            ))}
          </span>
        ) : null}
      </div>

      {/* Timeline de microfases del proceso actual. */}
      {!sinProcesos && fasesPasoActual.length > 0 ? (
        <div style={{ ...s.filaTimeline, ...s.timeline }} data-testid="barra-simulacion-timeline" aria-label="Fases del proceso actual">
          {fasesPasoActual.map((fase, i) => {
            const indice = i + 1;
            const activa = faseActual?.indice === indice;
            const cerrada = faseActual ? indice < faseActual.indice : false;
            return (
              <span
                key={fase}
                style={{ ...s.marco, ...(cerrada ? s.marcoCompletado : {}), ...(activa ? s.marcoActual : {}) }}
                title={rotuloFase(fase)}
              >
                {rotuloCortoFase(fase)}
              </span>
            );
          })}
          {/* Timer mono desde reloj */}
          <span style={s.timer}>
            {String(ejecutados).padStart(2, "0")} / {String(totalPasos).padStart(2, "0")}
            {contexto.reloj != null ? ` \u00b7 ${contexto.reloj}u` : ""}
          </span>
        </div>
      ) : !sinProcesos ? (
        <div style={s.filaTimeline} data-testid="barra-simulacion-timeline" aria-label="Procesos consolidados">
          <span style={s.timelineGrande}>
            {ejecutados} de {totalPasos} procesos consolidados
          </span>
          <span style={s.timer}>
            {String(ejecutados).padStart(2, "0")} / {String(totalPasos).padStart(2, "0")}
            {contexto.reloj != null ? ` \u00b7 ${contexto.reloj}u` : ""}
          </span>
        </div>
      ) : null}

      {contexto.trace.length > 0 ? (
        <div style={s.trace} data-testid="barra-simulacion-trace" aria-label="Trace de simulacion">
          {contexto.trace.slice(-4).map((entrada) => {
            const rotulo = rotuloTraceSimulacion(entrada);
            return (
              <span key={entrada.numero} style={entrada.omitido ? { ...s.traceItem, ...s.traceItemOmitido } : s.traceItem}>
                <span style={s.traceNumero}>#{entrada.numero}</span>
                <span style={s.traceProceso}>{entrada.procesoNombre}</span>
                {rotulo ? (
                  <span style={rotulo.tipo === "omitido" ? s.traceOmitido : s.traceDiag} title={rotulo.titulo}>
                    {rotulo.texto}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      ) : null}
      </div>
    </>
  );
}

function intervaloAutoAvanceMs(velocidad: number): number {
  return Math.round(900 / velocidad);
}

function rotuloCortoFase(fase: string): string {
  if (fase === "preparacion") return "prep";
  if (fase === "consumo") return "cons";
  if (fase === "proceso") return "proc";
  if (fase === "resultado") return "res";
  return "cierre";
}

function rotuloFase(fase: string): string {
  if (fase === "preparacion") return "Preparación";
  if (fase === "consumo") return "Consumo";
  if (fase === "proceso") return "Proceso activo";
  if (fase === "resultado") return "Resultado";
  return "Cierre";
}

function marcaNarrativa(tono: NarrativaSimulacion["tono"]): string {
  if (tono === "exito") return "✓";
  if (tono === "alerta") return "!";
  if (tono === "activo") return "▶";
  return "·";
}

function estiloNarrativa(tono: NarrativaSimulacion["tono"]): JSX.CSSProperties {
  if (tono === "exito") return { borderLeftColor: C.success };
  if (tono === "alerta") return { borderLeftColor: C.crimson, background: C.paperWarm };
  if (tono === "activo") return { borderLeftColor: C.crimson };
  return { borderLeftColor: C.ruleStrong };
}

const C = tokens.colors;
const T = tokens.typography;

// Exportado para que tests anclen las invariantes de layout.
// BUG-20260606T063734Z-52df54: estos estilos no se derivan de tokens dinámicos,
// se verifican directamente en tests estructurales (ver
// `BarraSimulacion.styles.test.ts`).
type EstilosBarra = {
  barra: JSX.CSSProperties;
  barraSpine: JSX.CSSProperties;
  barraMobile: JSX.CSSProperties;
  fila: JSX.CSSProperties;
  filaControles: JSX.CSSProperties;
  filaTimeline: JSX.CSSProperties;
  tag: JSX.CSSProperties;
  tagDot: JSX.CSSProperties;
  contador: JSX.CSSProperties;
  estadoTexto: JSX.CSSProperties;
  procesoActivo: JSX.CSSProperties;
  opd: JSX.CSSProperties;
  check: JSX.CSSProperties;
  narrativa: JSX.CSSProperties;
  narrativaInlineMobile: JSX.CSSProperties;
  narrativaMarca: JSX.CSSProperties;
  narrativaTexto: JSX.CSSProperties;
  narrativaTitulo: JSX.CSSProperties;
  narrativaDetalle: JSX.CSSProperties;
  narrativaContexto: JSX.CSSProperties;
  narrativaChip: JSX.CSSProperties;
  control: JSX.CSSProperties;
  controlActivo: JSX.CSSProperties;
  controlHover: JSX.CSSProperties;
  controlApretado: JSX.CSSProperties;
  controlDeshabilitado: JSX.CSSProperties;
  controlFocus: JSX.CSSProperties;
  sep: JSX.CSSProperties;
  kbd: JSX.CSSProperties;
  flecha: JSX.CSSProperties;
  segmented: JSX.CSSProperties;
  segmentBtn: JSX.CSSProperties;
  segmentBtnUltimo: JSX.CSSProperties;
  segmentActivo: JSX.CSSProperties;
  segmentHover: JSX.CSSProperties;
  timeline: JSX.CSSProperties;
  marco: JSX.CSSProperties;
  marcoCompletado: JSX.CSSProperties;
  marcoActual: JSX.CSSProperties;
  timelineGrande: JSX.CSSProperties;
  timer: JSX.CSSProperties;
  trace: JSX.CSSProperties;
  traceItem: JSX.CSSProperties;
  traceItemOmitido: JSX.CSSProperties;
  traceNumero: JSX.CSSProperties;
  traceProceso: JSX.CSSProperties;
  traceDiag: JSX.CSSProperties;
  traceOmitido: JSX.CSSProperties;
};
export const s: EstilosBarra = {
  // BUG-20260607T224342Z-a8e599: la barra se monta dentro de
  // `CodexCanvasMount.topbar` (vive en la región canvas). Su superficie
  // usa `paperWarm` para empastar con el fondo del canvas, y se diferencia
  // visualmente con:
  // - borde superior 2px crimson (línea de marca)
  // - dos spines laterales 3px con gradiente vertical crimson→50% (encuadre)
  // - el panel narrativa usa `paper` (más claro) para jerarquía visual
  // - la tag usa un "live dot" crimson que pulsa
  // El resultado: la barra se lee como "un modo especial framed" sin
  // tapar el canvas ni los paneles laterales.
  barra: {
    display: "flex",
    alignItems: "flex-start",
    gap: tokens.spacing.sm,
    padding: `6px ${tokens.spacing.md}px`,
    background: C.paperWarm,
    borderTop: `2px solid ${C.crimson}`,
    borderBottom: `1px solid ${C.rule}`,
    minHeight: 44,
    flexWrap: "wrap",
    fontFamily: T.fontFamily,
    fontSize: T.sizes.sm,
    color: C.ink,
    position: "relative",
  },
  // BUG-20260607T224342Z-a8e599: spine crimson 3px con gradiente vertical
  // (crimson al 100% en el 60% superior, fade a 50% en el resto). Dos
  // spines (izquierda + derecha) enmarcan la barra como una "ventana
  // editorial" sobre el canvas.
  barraSpine: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    background: `linear-gradient(to bottom, ${C.crimson} 0%, ${C.crimson} 60%, rgba(142, 42, 46, 0.5) 100%)`,
    pointerEvents: "none",
  },
  barraMobile: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 4,
    padding: "4px 8px",
    minHeight: 48,
    height: 48,
    overflowX: "auto",
    overflowY: "hidden",
  },
  fila: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap" as const,
  },
  tag: {
    fontWeight: 700,
    fontSize: T.sizes.xs,
    color: C.crimson,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginRight: 4,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: T.fontFamilyMono,
  },
  // BUG-20260607T224342Z-a8e599: "live dot" crimson 6px. La animación
  // de pulso se define por clase CSS `.sim-live-dot` (ver el `<style>`
  // inyectado al final del componente). La marca visual: el modo
  // simulación está "vivo" en este momento.
  tagDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    background: C.crimson,
    borderRadius: "50%",
    flex: "0 0 6px",
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
  // BUG-20260608T171552Z-17477a: el "proceso activo" pasa de ser un span
  // crimson italic a un chip con border-left 2px crimson + background
  // `paper` para que se lea como **etiqueta de estado** (lo que es) y no
  // compita visualmente con el botón `reproducir` activo (que también
  // usa crimson como acento semántico). El wash `paper` lo separa del
  // fondo `paperWarm` de la barra, haciéndolo "salir" del frame.
  procesoActivo: {
    fontStyle: "italic",
    fontSize: T.sizes.sm,
    color: C.crimson,
    padding: "1px 6px 1px 8px",
    borderLeft: `2px solid ${C.crimson}`,
    background: C.paper,
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
  // BUG-20260608T171552Z-17477a: la fila de controles gana un separador
  // editorial dotted arriba para que el ojo lea "fila de status → narrativa
  // → controles → timeline" como bloques tipográficos, no como una sola
  // línea plana de palabras. Sin este separador, los botones se mezclaban
  // con los separadores `·`, los kbd y los chips de status, y el operador
  // no podía distinguir qué era acción y qué era label.
  filaControles: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap" as const,
    flexBasis: "100%",
    borderTop: `1px dotted ${C.rule}`,
    paddingTop: 6,
    marginTop: 2,
  },
  // BUG-20260608T171552Z-17477a: la fila de timeline/trace usa el mismo
  // lenguaje dotted para señalar "esto ya no son controles, es info".
  filaTimeline: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap" as const,
    flexBasis: "100%",
    borderTop: `1px dotted ${C.rule}`,
    paddingTop: 4,
    marginTop: 2,
  },
  // BUG-20260606T063734Z-52df54: `flexBasis: 100%` fuerza a la narrativa a
  // ocupar su propia fila (status line arriba, controles abajo). `maxHeight`
  // + `overflow: hidden` acotan el crecimiento del panel cuando el detalle
  // o los chips se vuelven muy largos — antes la altura libre del panel
  // tiraba del `alignItems: center` del padre y desalineaba el status.
  narrativa: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    flex: "1 1 520px",
    flexBasis: "100%",
    minWidth: 280,
    maxWidth: "100%",
    maxHeight: "90px",
    overflow: "hidden",
    padding: "5px 8px",
    background: C.paper,
    borderLeft: `3px solid ${C.ruleStrong}`,
    borderTop: `1px solid ${C.rule}`,
    borderBottom: `1px solid ${C.rule}`,
  },
  narrativaInlineMobile: {
    minWidth: 0,
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    color: C.ink,
    fontSize: T.sizes.sm,
    fontWeight: 700,
  },
  narrativaMarca: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    flex: "0 0 18px",
    color: C.crimson,
    fontFamily: T.fontFamilyMono,
    fontSize: 11,
    fontWeight: 700,
  },
  narrativaTexto: {
    display: "flex",
    alignItems: "baseline",
    gap: tokens.spacing.sm,
    minWidth: 0,
    flex: "1 1 auto",
    flexWrap: "wrap" as const,
  },
  narrativaTitulo: {
    color: C.ink,
    fontSize: T.sizes.sm,
    fontWeight: 700,
    whiteSpace: "nowrap" as const,
  },
  narrativaDetalle: {
    color: C.inkMid,
    fontSize: T.sizes.sm,
    lineHeight: 1.35,
    overflowWrap: "anywhere" as const,
  },
  narrativaContexto: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    flex: "0 1 auto",
    flexWrap: "wrap" as const,
    justifyContent: "flex-end",
  },
  narrativaChip: {
    display: "inline-flex",
    alignItems: "center",
    height: 18,
    padding: "0 5px",
    border: `1px solid ${C.rule}`,
    color: C.inkSoft,
    background: C.paperWarm,
    fontFamily: T.fontFamilyMono,
    fontSize: 10,
    fontVariantNumeric: "tabular-nums",
  },
  // BUG-20260608T171552Z-17477a: el botón "control" gana una silueta de
  // botón-fantasma discreta para que el ojo lo lea como acción y no como
  // label. La invariante canon se mantiene: sin background permanente,
  // sin radio, sin sombra. Sólo un hairline `rule` que se oscurece a
  // `ruleStrong` en hover, con wash `paper` (no `paperWarm` — el wash más
  // claro indica "elevación" sin acentuar cromáticamente). El color del
  // texto baja a `inkMid` en reposo para que la acción se distinga del
  // texto de status (que vive en `ink`/`inkSoft`/`inkFaint`).
  control: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    height: 26,
    padding: "0 8px",
    fontSize: T.sizes.sm,
    fontFamily: T.fontFamily,
    color: C.inkMid,
    background: "transparent",
    border: `1px solid ${C.rule}`,
    borderRadius: 0,
    cursor: "pointer",
    pointerEvents: "auto",
    transition: "color 120ms ease, background 120ms ease, border-color 120ms ease",
  },
  // BUG-20260608T171552Z-17477a: el botón "activo" (autoAvance prendido)
  // se diferencia del resto por (a) color ink en vez de inkMid, (b) fondo
  // `paper` (wash más claro que el de hover, para señalar "presionado"
  // sostenido), y (c) el border-bottom crimson se mantiene como acento
  // semántico: la simulación está corriendo AHORA.
  controlActivo: {
    color: C.ink,
    background: C.paper,
    borderColor: C.ruleStrong,
    borderBottomColor: C.crimson,
    borderBottomWidth: 2,
  },
  // BUG-20260608T171552Z-17477a: hover/active/focus del control se
  // manejan aquí, no en CSS externo, para que la unidad de estilo del
  // componente siga siendo self-contained (paridad con `toolbar.css`,
  // pero localizado). `:hover` → wash `paper`. `:active` → wash `paperWarm`
  // (un punto más oscuro = "se está apretando"). `:focus-visible` →
  // outline crimson canon (ui-forja §4.1 "focus states").
  controlHover: {
    color: C.ink,
    background: C.paper,
    borderColor: C.ruleStrong,
  },
  controlApretado: {
    background: C.paperWarm,
  },
  controlDeshabilitado: {
    color: C.inkFaint,
    borderColor: C.paperWarm,
    cursor: "not-allowed",
  },
  controlFocus: {
    outline: `2px solid ${C.crimson}`,
    outlineOffset: 2,
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
  // BUG-20260608T171552Z-17477a: el `segmented` (modo/velocidad) sube
  // su silueta de `rule` a `ruleStrong` para que el grupo se lea como
  // "un widget continuo" diferenciado de los botones sueltos. Sin este
  // cambio, el grupo se confundía con el border de un `control` aislado.
  segmented: {
    display: "inline-flex",
    alignItems: "center",
    marginLeft: tokens.spacing.sm,
    border: `1px solid ${C.ruleStrong}`,
  },
  // BUG-20260608T171552Z-17477a: el botón interno del segmented también
  // gana hairline `rule` y un separador vertical entre segmentos (vía
  // `borderRight` en cada botón menos el último) para que el ojo lea
  // los límites entre opciones. Hover/activo del segmento se manejan
  // con wash `paper` (paridad con `control`).
  segmentBtn: {
    display: "inline-flex",
    alignItems: "center",
    height: 26,
    padding: "0 8px",
    fontSize: 11,
    fontFamily: T.fontFamilyMono,
    fontVariantNumeric: "tabular-nums",
    color: C.inkSoft,
    background: "transparent",
    border: "none",
    borderRight: `1px solid ${C.rule}`,
    borderRadius: 0,
    cursor: "pointer",
    pointerEvents: "auto",
    transition: "color 120ms ease, background 120ms ease",
  },
  segmentBtnUltimo: {
    borderRight: "none",
  },
  segmentActivo: {
    fontWeight: 600,
    color: C.ink,
    background: C.paperWarm,
  },
  segmentHover: {
    color: C.ink,
    background: C.paper,
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
    cursor: "default",
    pointerEvents: "auto",
    transition: "color 120ms ease, fontWeight 120ms ease",
  },
  marcoCompletado: {
    color: C.inkSoft,
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
    pointerEvents: "auto",
  },
  traceItemOmitido: {
    borderColor: C.crimson,
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
  traceOmitido: {
    color: C.crimson,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    fontSize: 9,
  },
};
