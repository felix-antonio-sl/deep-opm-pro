import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { useOpmStore } from "../../store";
import { useZustandPizarraPort } from "../../app/ports/zustandPizarraPort";
import { extremoEntidad } from "../../modelo/extremos";
import type { Id, TipoBoceto, TipoEnlace, TipoEntidad } from "../../modelo/tipos";
import { tokens } from "../tokens";
import {
  entidadesPromocionablesEnOpd,
  puedePromoverEnlace,
  TIPOS_ENLACE_PROMOCION,
} from "./barraPizarraEnlace";

/**
 * BarraPizarra (D7.2): control flotante del modo bosquejo. No silencioso —
 * cuando el modo está activo, un indicador visible lo anuncia. Permite:
 *  - activar/salir del modo,
 *  - elegir herramienta (forma/texto/flecha/nota),
 *  - con un boceto seleccionado, elegir DESTINO de promoción
 *    (Objeto / Proceso / Enlace):
 *      · entidad: mini-prompt de nombre prellenado desde el texto del boceto;
 *      · enlace: mini-form con origen/destino (cosas presentes en el OPD activo),
 *        tipo de enlace canónico y etiqueta opcional.
 *
 * El kernel ya soporta promover a enlace (`promoverBocetoActual` → `crearEnlace`,
 * rechazo ruidoso ante firma ilegal). La barra solo arma el borrador e invoca;
 * NO duplica la validación de firma (la dice el store).
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

type DestinoPromocion = TipoEntidad | "enlace";

const DESTINOS: ReadonlyArray<{ valor: DestinoPromocion; etiqueta: string }> = [
  { valor: "objeto", etiqueta: "Objeto" },
  { valor: "proceso", etiqueta: "Proceso" },
  { valor: "enlace", etiqueta: "Enlace" },
];

interface BorradorEnlace {
  origenId: Id | null;
  destinoId: Id | null;
  tipo: TipoEnlace | null;
  etiqueta: string;
}

const BORRADOR_ENLACE_VACIO: BorradorEnlace = { origenId: null, destinoId: null, tipo: null, etiqueta: "" };

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

  // Cosas presentes en el OPD activo: extremos elegibles para el enlace. Deriva
  // de las apariencias del OPD donde caerá el enlace (no de todo el modelo).
  const entidadesOpd = useOpmStore((s) => entidadesPromocionablesEnOpd(s.modelo, s.opdActivoId));

  const [destino, setDestino] = useState<DestinoPromocion>("objeto");
  const [promocionAbierta, setPromocionAbierta] = useState<{ tipoEntidad: TipoEntidad; nombre: string } | null>(null);
  const [borradorEnlace, setBorradorEnlace] = useState<BorradorEnlace>(BORRADOR_ENLACE_VACIO);

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

  const enlaceHabilitado = puedePromoverEnlace(borradorEnlace);

  function promoverEnlace(): void {
    const { origenId, destinoId, tipo, etiqueta } = borradorEnlace;
    if (!origenId || !destinoId || !tipo) return;
    // Construye el ExtremoEnlace desde el id de entidad (v1: solo extremos de
    // tipo entidad). Si la firma es ilegal, el store FALLA ruidoso y NO consume
    // el boceto — no se duplica esa lógica aquí; el borrador se conserva.
    promoverBoceto({
      destino: "enlace",
      origenId: extremoEntidad(origenId),
      destinoId: extremoEntidad(destinoId),
      tipo,
      ...(etiqueta.trim() ? { etiqueta: etiqueta.trim() } : {}),
    });
    setBorradorEnlace(BORRADOR_ENLACE_VACIO);
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
            <span style={estilos.etiquetaPromover}>Promover a:</span>
            <div style={estilos.segmented} role="group" aria-label="Destino de promoción" data-testid="barra-pizarra-destino">
              {DESTINOS.map((d) => (
                <button
                  key={d.valor}
                  type="button"
                  data-testid={`barra-pizarra-destino-${d.valor}`}
                  aria-pressed={destino === d.valor}
                  style={destino === d.valor ? estilos.segmentActivo : estilos.segment}
                  onClick={() => setDestino(d.valor)}
                >
                  {d.etiqueta}
                </button>
              ))}
            </div>

            {destino === "enlace" ? (
              <div style={estilos.grupo} data-testid="barra-pizarra-promover-enlace-form">
                <select
                  data-testid="barra-pizarra-origen"
                  aria-label="Cosa origen del enlace"
                  style={estilos.select}
                  value={borradorEnlace.origenId ?? ""}
                  onChange={(e) => setBorradorEnlace({ ...borradorEnlace, origenId: (e.target as HTMLSelectElement).value || null })}
                >
                  <option value="">Origen…</option>
                  {entidadesOpd.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                  ))}
                </select>
                <span aria-hidden="true" style={estilos.flechaEnlace}>→</span>
                <select
                  data-testid="barra-pizarra-destino-cosa"
                  aria-label="Cosa destino del enlace"
                  style={estilos.select}
                  value={borradorEnlace.destinoId ?? ""}
                  onChange={(e) => setBorradorEnlace({ ...borradorEnlace, destinoId: (e.target as HTMLSelectElement).value || null })}
                >
                  <option value="">Destino…</option>
                  {entidadesOpd.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                  ))}
                </select>
                <select
                  data-testid="barra-pizarra-tipo"
                  aria-label="Tipo de enlace"
                  style={estilos.select}
                  value={borradorEnlace.tipo ?? ""}
                  onChange={(e) => setBorradorEnlace({ ...borradorEnlace, tipo: ((e.target as HTMLSelectElement).value || null) as TipoEnlace | null })}
                >
                  <option value="">Tipo…</option>
                  {TIPOS_ENLACE_PROMOCION.map((t) => (
                    <option key={t.tipo} value={t.tipo}>{t.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  data-testid="barra-pizarra-etiqueta"
                  aria-label="Etiqueta del enlace (opcional)"
                  placeholder="Etiqueta (opcional)"
                  style={estilos.inputEtiqueta}
                  value={borradorEnlace.etiqueta}
                  onInput={(e) => setBorradorEnlace({ ...borradorEnlace, etiqueta: (e.target as HTMLInputElement).value })}
                />
                <button
                  type="button"
                  data-testid="barra-pizarra-promover-enlace"
                  style={estilos.botonHerramienta(false)}
                  disabled={!enlaceHabilitado}
                  onClick={promoverEnlace}
                >
                  ✓ Enlace
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-testid={destino === "proceso" ? "pizarra-promover-proceso" : "pizarra-promover-objeto"}
                style={estilos.botonHerramienta(false)}
                onClick={() => abrirPromocion(destino)}
              >
                {destino === "proceso" ? "Proceso" : "Objeto"}
              </button>
            )}
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
  segmented: {
    display: "flex",
    border: `1px solid ${C.ruleStrong}`,
    overflow: "hidden",
  } as JSX.CSSProperties,
  segment: {
    border: 0,
    background: C.paper,
    color: C.inkMid,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    cursor: "pointer",
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.xs,
  } as JSX.CSSProperties,
  segmentActivo: {
    border: 0,
    background: C.paperWarm,
    color: C.ink,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    cursor: "pointer",
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.semibold,
    boxShadow: `inset 0 -2px 0 0 ${C.crimson}`,
  } as JSX.CSSProperties,
  select: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: C.paper,
    color: C.ink,
    border: `1px solid ${C.bordeInput}`,
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.xs,
    maxWidth: 160,
  } as JSX.CSSProperties,
  inputEtiqueta: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: C.paper,
    color: C.ink,
    border: `1px solid ${C.bordeInput}`,
    fontFamily: tokens.typography.sans,
    fontSize: tokens.typography.sizes.xs,
    minWidth: 120,
  } as JSX.CSSProperties,
  flechaEnlace: { color: C.inkSoft, fontSize: tokens.typography.sizes.sm },
} as const;
