import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { estadosCurrentDeclarados } from "../../modelo/simulacion/plan";
import type { ContextoSimulacion } from "../../modelo/simulacion/tipos";
import {
  crearEscenario,
  validarEscenario,
  type Conocimiento,
  type EscenarioSimulacion,
  type PresenciaEscenario,
} from "../../modelo/simulacion/scenario";
import type { Id, Modelo } from "../../modelo/tipos";
import { tokens } from "../tokens";
import { proyectarConclusionEscenario, rotuloReferenciaEscenario } from "./proyeccionBarra";

interface Props {
  modelo: Modelo;
  modeloBase: Modelo | null;
  contexto: ContextoSimulacion;
  aplicarEscenario: (escenario: EscenarioSimulacion | null) => string | null;
  onOpenChange?: (open: boolean) => void;
}

interface BorradorEscenario {
  proposito: string;
  estadoPorEntidad: Record<Id, Id | "">;
  presenciaPorEntidad: Record<Id, PresenciaEscenario | "">;
  supuestos: string;
}

const C = tokens.colors;
const T = tokens.typography;

export function PanelEscenarioSimulacion({
  modelo,
  modeloBase,
  contexto,
  aplicarEscenario,
  onOpenChange,
}: Props): JSX.Element {
  const escenario = contexto.escenario;
  const idsAlcance = entidadesEnAlcance(modelo, contexto);
  const keyBorrador = `${escenario?.id ?? "nuevo"}:${escenario?.revisionBase ?? ""}:${modelo.id}:${modelo.nextSeq}`;
  const [borrador, setBorrador] = useState<BorradorEscenario>(() => crearBorrador(modelo, contexto, idsAlcance));
  const [error, setError] = useState<string | null>(null);
  const baseVigente = !escenario || modeloBase === modelo;
  const pasoFinal = contexto.trace.at(-1);
  const conclusion = escenario
    ? proyectarConclusionEscenario(escenario, pasoFinal, baseVigente)
    : null;
  const modeloReferencias = modeloBase && !baseVigente ? modeloBase : modelo;

  useEffect(() => {
    setBorrador(crearBorrador(modelo, contexto, entidadesEnAlcance(modelo, contexto)));
    setError(null);
  }, [modelo, keyBorrador]);

  function actualizarEstado(entidadId: Id, estadoId: Id | ""): void {
    setBorrador((actual) => ({
      ...actual,
      estadoPorEntidad: { ...actual.estadoPorEntidad, [entidadId]: estadoId },
      presenciaPorEntidad: estadoId
        ? { ...actual.presenciaPorEntidad, [entidadId]: "presente" }
        : actual.presenciaPorEntidad,
    }));
  }

  function actualizarPresencia(entidadId: Id, valor: PresenciaEscenario | ""): void {
    setBorrador((actual) => ({
      ...actual,
      presenciaPorEntidad: { ...actual.presenciaPorEntidad, [entidadId]: valor },
      estadoPorEntidad: valor === "ausente"
        ? { ...actual.estadoPorEntidad, [entidadId]: "" }
        : actual.estadoPorEntidad,
    }));
  }

  function guardar(): void {
    const alcanceIds = idsAlcance;
    const estadosCurrent: Record<Id, Conocimiento<Id>> = {};
    const presencia: Record<Id, Conocimiento<PresenciaEscenario>> = {};
    for (const entidadId of alcanceIds) {
      const estadoId = borrador.estadoPorEntidad[entidadId] ?? "";
      const presenciaInicial = borrador.presenciaPorEntidad[entidadId] ?? "";
      estadosCurrent[entidadId] = estadoId
        ? { estado: "conocido", valor: estadoId }
        : { estado: "desconocido", motivo: "No se declaró un estado inicial" };
      presencia[entidadId] = presenciaInicial
        ? { estado: "conocido", valor: presenciaInicial }
        : { estado: "desconocido", motivo: "No se declaró la presencia" };
    }
    const supuestos = borrador.supuestos
      .split("\n")
      .map((descripcion) => descripcion.trim())
      .filter(Boolean)
      .map((descripcion, indice) => ({
        id: `supuesto-${indice + 1}`,
        descripcion,
        referencias: [...alcanceIds],
      }));
    const escenarioNuevo = crearEscenario({
      id: escenario?.id ?? `ensayo-${modelo.id}-${contexto.opdId}`,
      modeloId: modelo.id,
      revisionBase: `local:${modelo.id}:${modelo.nextSeq}`,
      proposito: borrador.proposito.trim(),
      alcanceIds,
      conocimientoInicial: { presencia, estadosCurrent },
      supuestos,
      parametros: escenario?.parametros ?? {},
      capacidadesSoportadas: capacidadesDelPlan(modelo, contexto),
    });
    const validacion = validarEscenario(modelo, escenarioNuevo);
    if (!validacion.ok) {
      setError(validacion.error);
      return;
    }
    const problema = aplicarEscenario(escenarioNuevo);
    setError(problema);
  }

  function quitarEscenario(): void {
    setError(aplicarEscenario(null));
  }

  return (
    <section style={estilos.contenedor} data-testid="simulacion-escenario">
      <details
        data-testid="simulacion-escenario-editor"
        onToggle={(event) => onOpenChange?.(event.currentTarget.open)}
      >
        <summary style={estilos.summary}>
          <span>Escenario</span>
          <span style={estilos.estadoEscenario}>
            {!escenario ? "Sin fijar" : baseVigente ? escenario.proposito : "Base modificada"}
          </span>
        </summary>
        <div style={estilos.formulario}>
          {escenario && !baseVigente ? (
            <p role="alert" style={estilos.avisoBase} data-testid="simulacion-escenario-base-obsoleta">
              La base fijada cambió. Este resultado queda asociado a la revisión anterior; fija el escenario otra vez para continuar.
            </p>
          ) : null}
          <label style={estilos.campo}>
            <span>Propósito del ensayo</span>
            <input
              aria-label="Propósito del ensayo"
              data-testid="simulacion-escenario-proposito"
              type="text"
              value={borrador.proposito}
              onInput={(event) => setBorrador((actual) => ({ ...actual, proposito: event.currentTarget.value }))}
              style={estilos.input}
              maxLength={160}
              required
            />
          </label>
          <div style={estilos.alcance}>
            <strong>Alcance de esta corrida</strong>
            <span>{idsAlcance.length === 0 ? "Sin objetos de estado asociados al plan." : idsAlcance.map((id) => modelo.entidades[id]?.nombre ?? id).join(", ")}</span>
          </div>
          <p style={estilos.ayuda}>
            Los campos sin declarar quedan desconocidos. Desconocido no significa ausente ni agrega un estado al modelo.
          </p>
          <div style={estilos.datos}>
            {idsAlcance.map((entidadId) => {
              const entidad = modelo.entidades[entidadId];
              if (!entidad) return null;
              const estados = Object.values(modelo.estados)
                .filter((estado) => estado.entidadId === entidadId && !estado.suprimido)
                .sort((a, b) => a.nombre.localeCompare(b.nombre));
              const valorPresencia = borrador.presenciaPorEntidad[entidadId] ?? "";
              const valorEstado = borrador.estadoPorEntidad[entidadId] ?? "";
              return (
                <fieldset key={entidadId} style={estilos.grupoDato}>
                  <legend>{entidad.nombre}</legend>
                  <label style={estilos.campoCompacto}>
                    <span>Presencia</span>
                    <select
                      aria-label={`Presencia de ${entidad.nombre}`}
                      data-testid={`simulacion-escenario-presencia-${entidadId}`}
                      value={valorPresencia}
                      onChange={(event) => actualizarPresencia(entidadId, event.currentTarget.value as PresenciaEscenario | "")}
                      style={estilos.select}
                    >
                      <option value="">Desconocida</option>
                      <option value="presente">Presente</option>
                      <option value="ausente">Ausente</option>
                    </select>
                  </label>
                  {estados.length > 0 ? (
                    <label style={estilos.campoCompacto}>
                      <span>Estado inicial</span>
                      <select
                        aria-label={`Estado inicial de ${entidad.nombre}`}
                        data-testid={`simulacion-escenario-estado-${entidadId}`}
                        value={valorEstado}
                        onChange={(event) => actualizarEstado(entidadId, event.currentTarget.value)}
                        style={estilos.select}
                        disabled={valorPresencia === "ausente"}
                      >
                        <option value="">Desconocido</option>
                        {estados.map((estado) => <option key={estado.id} value={estado.id}>{estado.nombre}</option>)}
                      </select>
                    </label>
                  ) : null}
                </fieldset>
              );
            })}
          </div>
          <label style={estilos.campo}>
            <span>Supuestos (opcional, uno por línea)</span>
            <textarea
              aria-label="Supuestos del ensayo"
              data-testid="simulacion-escenario-supuestos"
              value={borrador.supuestos}
              onInput={(event) => setBorrador((actual) => ({ ...actual, supuestos: event.currentTarget.value }))}
              style={estilos.textarea}
              rows={2}
            />
          </label>
          <div style={estilos.metadatos}>
            <span>Base local fijada al aplicar</span>
            <span>Parámetros: {Object.keys(escenario?.parametros ?? {}).length === 0 ? "ninguno" : "conservados"}</span>
            <span>Capacidades: {capacidadesDelPlan(modelo, contexto).map(rotuloCapacidad).join(", ") || "sin extensiones"}</span>
          </div>
          {error ? <p role="alert" style={estilos.error}>{error}</p> : null}
          <div style={estilos.acciones}>
            <button type="button" onClick={guardar} style={estilos.botonPrimario} data-testid="simulacion-escenario-aplicar">
              Aplicar y reiniciar
            </button>
            {escenario ? (
              <button type="button" onClick={quitarEscenario} style={estilos.botonSecundario} data-testid="simulacion-escenario-quitar">
                Quitar escenario
              </button>
            ) : null}
          </div>
        </div>
      </details>

      {escenario ? (
        <div style={estilos.conclusion} data-testid="simulacion-escenario-conclusion" aria-live="polite">
          <strong>En este escenario…</strong>
          <span style={estilos.rotuloConclusion}>{conclusion?.titulo ?? "Sin conclusión todavía"}</span>
          {pasoFinal?.diagnostico ? <span>{pasoFinal.diagnostico}</span> : null}
          {conclusion?.referencias.length ? (
            <details style={estilos.detalleEvidencia}>
              <summary>Evidencia ({conclusion.referencias.length})</summary>
              <ul style={estilos.listaEvidencia}>
                {conclusion.referencias.map((referencia, indice) => (
                  <li key={`${referencia.tipo}:${referencia.id}:${indice}`}>
                    {rotuloReferenciaEscenario(modeloReferencias, escenario, referencia)}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          {conclusion?.limites.length ? (
            <ul style={estilos.listaLimites} data-testid="simulacion-escenario-limites">
              {conclusion.limites.map((limite) => <li key={limite}>{limite}</li>)}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function crearBorrador(modelo: Modelo, contexto: ContextoSimulacion, ids: readonly Id[]): BorradorEscenario {
  const escenario = contexto.escenario;
  const declarados = estadosCurrentDeclarados(modelo);
  const estadoPorEntidad: Record<Id, Id | ""> = {};
  const presenciaPorEntidad: Record<Id, PresenciaEscenario | ""> = {};
  for (const entidadId of ids) {
    const estadoInicial = escenario?.conocimientoInicial.estadosCurrent[entidadId];
    const presenciaInicial = escenario?.conocimientoInicial.presencia[entidadId];
    const estadoId = estadoInicial?.estado === "conocido"
      ? estadoInicial.valor
      : escenario
        ? ""
        : declarados[entidadId] ?? "";
    const estadoValido = presenciaInicial?.estado === "conocido" && presenciaInicial.valor === "ausente"
      ? ""
      : estadoId && modelo.estados[estadoId]?.entidadId === entidadId
        ? estadoId
        : "";
    estadoPorEntidad[entidadId] = estadoValido;
    presenciaPorEntidad[entidadId] = presenciaInicial?.estado === "conocido"
      ? presenciaInicial.valor
      : estadoValido
        ? "presente"
        : "";
  }
  return {
    proposito: escenario?.proposito ?? `Explorar el comportamiento de ${modelo.nombre}`,
    estadoPorEntidad,
    presenciaPorEntidad,
    supuestos: escenario?.supuestos.map((supuesto) => supuesto.descripcion).join("\n") ?? "",
  };
}

function entidadesEnAlcance(modelo: Modelo, contexto: ContextoSimulacion): Id[] {
  const ids = new Set<Id>();
  for (const paso of contexto.plan) {
    for (const enlaceId of [...paso.enlacesEntradaIds, ...paso.enlacesSalidaIds]) {
      const enlace = modelo.enlaces[enlaceId];
      if (!enlace) continue;
      for (const extremo of [enlace.origenId, enlace.destinoId]) {
        const entidadId = extremo.kind === "entidad"
          ? extremo.id
          : modelo.estados[extremo.id]?.entidadId;
        if (entidadId && modelo.entidades[entidadId]?.tipo === "objeto") ids.add(entidadId);
      }
    }
    for (const transicion of paso.transicionesPlanificadas) {
      if (modelo.entidades[transicion.entidadId]?.tipo === "objeto") ids.add(transicion.entidadId);
    }
  }
  return [...ids].sort((a, b) => (modelo.entidades[a]?.nombre ?? a).localeCompare(modelo.entidades[b]?.nombre ?? b));
}

function capacidadesDelPlan(modelo: Modelo, contexto: ContextoSimulacion): string[] {
  const ids = new Set([...contexto.plan.flatMap((paso) => [...paso.enlacesEntradaIds, ...paso.enlacesSalidaIds])]);
  const enlaces = [...ids].map((id) => modelo.enlaces[id]).filter((enlace) => enlace !== undefined);
  const capacidades = new Set<string>();
  if (contexto.plan.some((paso) => paso.transicionesPlanificadas.length > 0)) capacidades.add("state-transitions");
  if (enlaces.some((enlace) => enlace.tipo === "agente" || enlace.tipo === "instrumento")) capacidades.add("base-enablers");
  if (enlaces.some((enlace) => enlace.modificador === "condicion")) capacidades.add("conditions");
  if (enlaces.some((enlace) => enlace.modificador === "evento")) capacidades.add("events");
  if (enlaces.some((enlace) => enlace.tipo === "invocacion")) capacidades.add("process-invocation");
  return [...capacidades].sort();
}

function rotuloCapacidad(capacidad: string): string {
  const rotulos: Record<string, string> = {
    "state-transitions": "transiciones",
    "base-enablers": "habilitadores",
    conditions: "condiciones",
    events: "eventos",
    "process-invocation": "invocaciones",
  };
  return rotulos[capacidad] ?? capacidad;
}

const estilos: Record<string, JSX.CSSProperties> = {
  contenedor: { display: "contents" },
  summary: {
    display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
    color: C.inkMid, fontSize: T.sizes.sm, listStyle: "disclosure-closed",
    padding: "2px 7px", border: `1px solid ${C.rule}`, minHeight: 24,
  },
  estadoEscenario: { color: C.inkSoft, fontStyle: "italic", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  formulario: {
    display: "grid", gap: 8, width: "min(720px, calc(100vw - 32px))", maxHeight: "min(62vh, 560px)", overflow: "auto",
    position: "absolute", zIndex: 50, top: "calc(100% - 2px)", left: 8,
    padding: 12, background: C.paper, border: `1px solid ${C.ruleStrong}`, borderTop: `2px solid ${C.crimson}`,
    boxShadow: tokens.shadows.none,
  },
  avisoBase: { margin: 0, padding: 8, color: C.ink, background: C.paperWarm, borderLeft: `2px solid ${C.crimson}`, lineHeight: 1.35 },
  campo: { display: "grid", gap: 4, color: C.inkMid, fontSize: T.sizes.sm },
  input: { width: "100%", minHeight: 30, boxSizing: "border-box", padding: "4px 7px", color: C.ink, background: C.paper, border: `1px solid ${C.ruleStrong}`, font: `inherit` },
  textarea: { width: "100%", boxSizing: "border-box", padding: "6px 7px", resize: "vertical", color: C.ink, background: C.paper, border: `1px solid ${C.ruleStrong}`, font: `inherit` },
  alcance: { display: "grid", gap: 2, color: C.inkMid, fontSize: T.sizes.sm },
  ayuda: { margin: 0, color: C.inkSoft, fontSize: T.sizes.sm, lineHeight: 1.4 },
  datos: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 6, maxHeight: 230, overflow: "auto" },
  grupoDato: { display: "grid", gridTemplateColumns: "minmax(90px, 1fr) minmax(110px, 1fr)", alignItems: "end", gap: 6, minWidth: 0, margin: 0, padding: 6, border: `1px solid ${C.rule}` },
  campoCompacto: { display: "grid", gap: 3, minWidth: 0, color: C.inkSoft, fontSize: 11 },
  select: { width: "100%", height: 28, minWidth: 0, padding: "2px 4px", color: C.ink, background: C.paper, border: `1px solid ${C.ruleStrong}`, font: `inherit` },
  metadatos: { display: "flex", flexWrap: "wrap", gap: 6, color: C.inkFaint, fontSize: 10.5 },
  error: { margin: 0, color: C.crimson, fontSize: T.sizes.sm },
  acciones: { display: "flex", flexWrap: "wrap", gap: 6 },
  botonPrimario: { padding: "5px 9px", color: C.paper, background: C.ink, border: `1px solid ${C.ink}`, font: `inherit`, cursor: "pointer" },
  botonSecundario: { padding: "5px 9px", color: C.inkMid, background: C.paper, border: `1px solid ${C.ruleStrong}`, font: `inherit`, cursor: "pointer" },
  conclusion: { display: "grid", gap: 3, flexBasis: "100%", padding: "4px 8px", borderLeft: `2px solid ${C.ruleStrong}`, color: C.inkMid, fontSize: T.sizes.sm, lineHeight: 1.35, background: C.paper },
  rotuloConclusion: { color: C.ink, fontWeight: 700 },
  detalleEvidencia: { color: C.inkMid, fontSize: T.sizes.sm },
  listaEvidencia: { margin: "4px 0", paddingLeft: 20 },
  listaLimites: { margin: 0, paddingLeft: 18, color: C.inkSoft },
};
