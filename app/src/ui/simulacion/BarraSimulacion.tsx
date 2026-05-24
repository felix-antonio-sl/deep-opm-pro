// [JOYAS §1-3] Chrome consume tokens centralizados; sin colores nuevos.
import type { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useZustandSimulationPort } from "../../app/ports/zustandSimulationPort";
import { tokens } from "../tokens";

/**
 * BarraSimulacion — Beta2 / Ronda 17 L2.
 *
 * Vive sobre el header, reemplazando la Toolbar de edición cuando
 * `contextoSimulacion !== null`. Slice mínimo:
 *   - Indicador "Modo simulación" + opdActivo.
 *   - Próximo paso ("▶ {procesoNombre}") o estado del contexto.
 *   - Controles: Play/Pausa, velocidad, Paso, Correr, Reiniciar, Salir.
 *   - Panel trace compacto: últimos pasos ejecutados.
 */
export function BarraSimulacion(): JSX.Element | null {
  const {
    contexto,
    autoAvance,
    velocidad: velocidadSimulacion,
    ejecutarPaso,
    ejecutarCorrida,
    reiniciar,
    iniciarAutoAvance,
    pausarAutoAvance,
    fijarVelocidad,
    salir,
  } = useZustandSimulationPort();

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

  return (
    <div data-testid="barra-simulacion" role="toolbar" aria-label="Controles de simulación" style={style.barra}>
      <div style={style.cluster}>
        <span style={style.tag}>Simulación</span>
        <span style={style.contador} data-testid="barra-simulacion-progreso">
          {totalPasos === 0
            ? "Sin procesos en este OPD"
            : completado
              ? `Completado · ${ejecutados}/${totalPasos}`
              : `Paso ${ejecutados + 1}/${totalPasos}${autoAvance ? ` · auto ${velocidadSimulacion}x` : ""}`}
        </span>
        {pasoActual && !completado ? (
          <span style={style.activo} data-testid="barra-simulacion-proceso-activo">
            ▶ {pasoActual.procesoNombre}
          </span>
        ) : null}
        {pasoActual && !completado ? (
          <span style={style.opd} data-testid="barra-simulacion-opd">
            Diagrama {pasoActual.opdNombre}
            {pasoActual.opdHijoNombre ? ` > ${pasoActual.opdHijoNombre}` : ""}
          </span>
        ) : null}
      </div>
      <div style={style.cluster}>
        <button
          type="button"
          style={autoAvance ? style.botonPausa : style.botonPrimario}
          onClick={autoAvance ? pausarAutoAvance : iniciarAutoAvance}
          disabled={totalPasos === 0 || completado}
          data-testid="barra-simulacion-auto"
          aria-pressed={autoAvance}
        >
          {autoAvance ? "Pausa" : "Play"}
        </button>
        <label style={style.velocidadControl} title="Velocidad de reproducción (0.25× a 4×)">
          <span style={style.velocidadTexto}>Velocidad {velocidadSimulacion}×</span>
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.25"
            value={String(velocidadSimulacion)}
            onInput={(event) => {
              const target = event.currentTarget as HTMLInputElement;
              fijarVelocidad(Number(target.value));
            }}
            disabled={totalPasos === 0}
            style={style.velocidadSelect}
            data-testid="barra-simulacion-velocidad"
            aria-label="Velocidad de simulación"
          />
        </label>
        <button
          type="button"
          style={style.boton}
          onClick={ejecutarPaso}
          disabled={totalPasos === 0 || completado || autoAvance}
          data-testid="barra-simulacion-paso"
        >
          Paso
        </button>
        <button
          type="button"
          style={style.boton}
          onClick={ejecutarCorrida}
          disabled={totalPasos === 0 || completado || autoAvance}
          data-testid="barra-simulacion-correr"
        >
          Correr
        </button>
        <button
          type="button"
          style={style.boton}
          onClick={reiniciar}
          disabled={totalPasos === 0 || autoAvance}
          data-testid="barra-simulacion-reiniciar"
        >
          Reiniciar
        </button>
        <button
          type="button"
          style={style.botonSalir}
          onClick={salir}
          data-testid="barra-simulacion-salir"
        >
          Salir
        </button>
      </div>
      {contexto.trace.length > 0 ? (
        <ol style={style.trace} data-testid="barra-simulacion-trace" aria-label="Trace de simulación">
          {contexto.trace.slice(-4).map((entrada) => (
            <li key={entrada.numero} style={style.traceItem}>
              <span style={style.traceNumero}>#{entrada.numero}</span>
              <span style={style.traceProceso}>{entrada.procesoNombre}</span>
              <span style={style.traceDetalle}>{entrada.opdNombre}</span>
              {entrada.transicionesAplicadas.length > 0 ? (
                <span style={style.traceDetalle}>
                  {entrada.transicionesAplicadas.length} transición{entrada.transicionesAplicadas.length === 1 ? "" : "es"}
                </span>
              ) : null}
              {entrada.cambiosValor.length > 0 ? (
                <span style={style.traceDetalle}>
                  {entrada.cambiosValor.length} valor{entrada.cambiosValor.length === 1 ? "" : "es"}
                </span>
              ) : null}
              {entrada.diagnostico ? (
                <span style={style.traceDiagnostico} title={entrada.diagnostico}>
                  ⚠
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function intervaloAutoAvanceMs(velocidad: number): number {
  return Math.round(900 / velocidad);
}

const style: Record<string, JSX.CSSProperties> = {
  barra: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.md,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    background: tokens.colors.fondoChrome,
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    minHeight: 44,
    flexWrap: "wrap",
  },
  cluster: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
  },
  tag: {
    fontWeight: tokens.typography.weights.bold,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.fondoChrome,
    background: tokens.colors.acentoSecundario,
    padding: `2px ${tokens.spacing.sm}px`,
    borderRadius: tokens.radii.sm,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  contador: {
    fontVariantNumeric: "tabular-nums",
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.textoSecundario,
  },
  activo: {
    fontWeight: tokens.typography.weights.semibold,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.textoPrimario,
    padding: `2px ${tokens.spacing.sm}px`,
    background: tokens.colors.acentoUiSuave,
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.sm,
  },
  opd: {
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.textoSecundario,
    padding: `2px ${tokens.spacing.sm}px`,
    background: tokens.colors.fondoCard,
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: tokens.radii.sm,
  },
  boton: {
    height: 28,
    padding: `0 ${tokens.spacing.sm}px`,
    fontSize: tokens.typography.sizes.sm,
    background: tokens.colors.fondoChrome,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.control,
    cursor: "pointer",
  },
  botonPrimario: {
    height: 28,
    padding: `0 ${tokens.spacing.md}px`,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
    background: tokens.colors.acentoUi,
    color: tokens.colors.fondoChrome,
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.control,
    cursor: "pointer",
  },
  botonPausa: {
    height: 28,
    padding: `0 ${tokens.spacing.md}px`,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
    background: tokens.colors.advertenciaFondo,
    color: tokens.colors.alertaTexto,
    border: `1px solid ${tokens.colors.advertenciaBorde}`,
    borderRadius: tokens.radii.control,
    cursor: "pointer",
  },
  velocidadControl: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    height: 28,
    padding: `0 ${tokens.spacing.xs}px 0 ${tokens.spacing.sm}px`,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.textoSecundario,
    background: tokens.colors.fondoChrome,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.control,
  },
  velocidadTexto: {
    lineHeight: "26px",
  },
  velocidadSelect: {
    height: 24,
    border: "none",
    background: "transparent",
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.sm,
    cursor: "pointer",
  },
  botonSalir: {
    height: 28,
    padding: `0 ${tokens.spacing.sm}px`,
    fontSize: tokens.typography.sizes.sm,
    background: tokens.colors.fondoChrome,
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.control,
    cursor: "pointer",
    marginLeft: tokens.spacing.sm,
  },
  trace: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    listStyle: "none",
    margin: 0,
    padding: 0,
    overflowX: "auto",
  },
  traceItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: `2px ${tokens.spacing.sm}px`,
    background: tokens.colors.fondoCard,
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: tokens.radii.sm,
    fontSize: tokens.typography.sizes.xs,
  },
  traceNumero: {
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.textoSecundario,
  },
  traceProceso: {
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.textoPrimario,
  },
  traceDetalle: {
    color: tokens.colors.textoSecundario,
  },
  traceDiagnostico: {
    color: tokens.colors.alertaTexto,
  },
};
