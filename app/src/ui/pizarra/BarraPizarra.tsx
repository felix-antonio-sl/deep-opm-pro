import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { useOpmStore } from "../../store";
import { useZustandPizarraPort } from "../../app/ports/zustandPizarraPort";
import type { TipoBoceto, TipoEntidad } from "../../modelo/tipos";
import { tokens } from "../tokens";

/**
 * BarraPizarra (D7.2): control flotante del modo bosquejo. No silencioso —
 * cuando el modo está activo, un indicador visible lo anuncia. Permite:
 *  - activar/salir del modo,
 *  - elegir herramienta (forma/texto/flecha/nota),
 *  - con un boceto seleccionado, "Promover a modelo" (objeto/proceso) con un
 *    mini-prompt de nombre prellenado desde el texto del boceto.
 *
 * La promoción a ENLACE necesita dos extremos ya existentes (firma del kernel);
 * en v1 la barra ofrece solo promoción a entidad (objeto/proceso) — la
 * promoción a enlace queda para un corte posterior (el kernel ya la soporta).
 *
 * Paleta: tokens ui-forja / CODEX. Crimson SOLO como canal de foco/estado-activo
 * (ui-forja/06); el resto es tinta/papel.
 */

const C = tokens.colors;

const HERRAMIENTAS: ReadonlyArray<{ tipo: TipoBoceto; etiqueta: string; icono: string }> = [
  { tipo: "forma", etiqueta: "Forma", icono: "▭" },
  { tipo: "texto", etiqueta: "Texto", icono: "T" },
  { tipo: "flecha", etiqueta: "Flecha", icono: "↗" },
  { tipo: "nota", etiqueta: "Nota", icono: "✎" },
];

export function BarraPizarra(): JSX.Element {
  const {
    modoPizarra,
    herramientaPizarra,
    bocetoSeleccionadoId,
    activar,
    salir,
    elegirHerramienta,
    promoverBoceto,
  } = useZustandPizarraPort();

  // Texto del boceto seleccionado (para prellenar el mini-prompt de nombre).
  const textoBocetoSeleccionado = useOpmStore((s) =>
    s.bocetoSeleccionadoId ? s.modelo.opds[s.opdActivoId]?.bocetos?.[s.bocetoSeleccionadoId]?.texto ?? "" : "",
  );

  const [promocionAbierta, setPromocionAbierta] = useState<{ tipoEntidad: TipoEntidad; nombre: string } | null>(null);

  if (!modoPizarra) {
    return (
      <div style={estilos.contenedor}>
        <button
          type="button"
          data-testid="pizarra-activar"
          style={estilos.botonModo(false)}
          onClick={activar}
          title="Modo pizarra: dibuja bocetos de baja fricción y promuévelos a modelo"
        >
          ✎ Pizarra
        </button>
      </div>
    );
  }

  function abrirPromocion(tipoEntidad: TipoEntidad): void {
    setPromocionAbierta({ tipoEntidad, nombre: textoBocetoSeleccionado.trim() });
  }

  function confirmarPromocion(): void {
    if (!promocionAbierta) return;
    const nombre = promocionAbierta.nombre.trim();
    promoverBoceto({
      destino: "entidad",
      tipoEntidad: promocionAbierta.tipoEntidad,
      ...(nombre ? { nombre } : {}),
    });
    setPromocionAbierta(null);
  }

  return (
    <div style={estilos.contenedor} role="toolbar" aria-label="Controles de modo pizarra" data-testid="barra-pizarra">
      {/* Indicador visible de modo activo (no silencioso). */}
      <span style={estilos.indicador} data-testid="pizarra-indicador">
        <span aria-hidden="true" style={estilos.dot}>●</span> Pizarra
      </span>

      <div style={estilos.grupo}>
        {HERRAMIENTAS.map((h) => (
          <button
            key={h.tipo}
            type="button"
            data-testid={`pizarra-herramienta-${h.tipo}`}
            aria-pressed={herramientaPizarra === h.tipo}
            style={estilos.botonHerramienta(herramientaPizarra === h.tipo)}
            onClick={() => elegirHerramienta(herramientaPizarra === h.tipo ? null : h.tipo)}
            title={`Herramienta: ${h.etiqueta}`}
          >
            <span aria-hidden="true">{h.icono}</span> {h.etiqueta}
          </button>
        ))}
      </div>

      {bocetoSeleccionadoId ? (
        promocionAbierta ? (
          <div style={estilos.grupo} data-testid="pizarra-promocion-prompt">
            <input
              type="text"
              autoFocus
              value={promocionAbierta.nombre}
              data-testid="pizarra-promocion-nombre"
              placeholder="Nombre del hecho"
              style={estilos.input}
              onInput={(e) => setPromocionAbierta({ ...promocionAbierta, nombre: (e.target as HTMLInputElement).value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); confirmarPromocion(); }
                if (e.key === "Escape") { e.preventDefault(); setPromocionAbierta(null); }
              }}
            />
            <button type="button" data-testid="pizarra-promocion-confirmar" style={estilos.botonHerramienta(false)} onClick={confirmarPromocion}>
              ✓ {promocionAbierta.tipoEntidad === "proceso" ? "Proceso" : "Objeto"}
            </button>
            <button type="button" data-testid="pizarra-promocion-cancelar" style={estilos.botonTexto} onClick={() => setPromocionAbierta(null)}>
              Cancelar
            </button>
          </div>
        ) : (
          <div style={estilos.grupo}>
            <span style={estilos.etiquetaPromover}>Promover a modelo:</span>
            <button type="button" data-testid="pizarra-promover-objeto" style={estilos.botonHerramienta(false)} onClick={() => abrirPromocion("objeto")}>
              Objeto
            </button>
            <button type="button" data-testid="pizarra-promover-proceso" style={estilos.botonHerramienta(false)} onClick={() => abrirPromocion("proceso")}>
              Proceso
            </button>
          </div>
        )
      ) : (
        <span style={estilos.hint}>Coloca un boceto en el lienzo y selecciónalo para promoverlo.</span>
      )}

      <button type="button" data-testid="pizarra-salir" style={estilos.botonTexto} onClick={salir} title="Salir del modo pizarra">
        Salir
      </button>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: C.paper,
    borderBottom: `1px solid ${C.rule}`,
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.sm,
    color: C.ink,
    flexWrap: "wrap" as const,
  },
  indicador: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: C.crimson,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: tokens.typography.ls.meta,
    textTransform: "uppercase" as const,
    fontSize: tokens.typography.sizes.xs,
  },
  dot: { fontSize: 9 },
  grupo: { display: "flex", alignItems: "center", gap: tokens.spacing.xs },
  etiquetaPromover: { color: C.inkMid, fontSize: tokens.typography.sizes.xs },
  hint: { color: C.inkSoft, fontStyle: "italic" as const, fontSize: tokens.typography.sizes.xs },
  botonModo: (activo: boolean): JSX.CSSProperties => ({
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: activo ? C.paperWarm : C.paper,
    color: C.ink,
    border: `1px solid ${activo ? C.crimson : C.ruleStrong}`,
    cursor: "pointer",
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.sm,
  }),
  botonHerramienta: (activo: boolean): JSX.CSSProperties => ({
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: activo ? C.paperWarm : C.paper,
    color: C.ink,
    border: `1px solid ${C.ruleStrong}`,
    ...(activo ? { borderBottom: `2px solid ${C.crimson}` } : {}),
    cursor: "pointer",
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.xs,
  }),
  botonTexto: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: "transparent",
    color: C.inkMid,
    border: "1px solid transparent",
    cursor: "pointer",
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.xs,
  } as JSX.CSSProperties,
  input: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: C.paper,
    color: C.ink,
    border: `1px solid ${C.bordeInput}`,
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.sm,
    minWidth: 160,
  } as JSX.CSSProperties,
} as const;
