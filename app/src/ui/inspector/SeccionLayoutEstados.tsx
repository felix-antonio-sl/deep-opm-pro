// Ronda Codex v1 · L2 — re-piel a primitivas Codex (cero logica nueva).
//
// La gestion de estados del objeto pasa de filas con cajas/pills a
// `CodexInspectSection` + `CodexStateRow`: cada estado es una fila con badge
// oliva canon, nombre editable y flags tipograficos (designaciones, duracion,
// suprimir/restaurar, eliminar). El selector de layout pasa a
// `CodexInspectInline` (horizontal · vertical). Acciones de creacion/quitar
// como palabras.
//
// Invariantes preservados: section aria-label="Estados", testIds
// inspector-seccion-estados / abrir-modal-crear-estados(-adicional), inputs con
// aria-label "Nombre estado {nombre}", botones "Agregar estados"/"Inicial"/
// "Final" (e2e). Axioma [Glos 3.66] "al menos dos estados visibles" preservado
// en `visibles.length <= 2` para deshabilitar eliminar.
import { useState } from "preact/hooks";
import { estadoTieneEnlaces } from "../../modelo/estadosDesignaciones";
import type { DesignacionEstado, Entidad, Estado, LayoutEstados, Modelo } from "../../modelo/tipos";
import { CodexInspectSection } from "../codex/CodexInspectSection";
import { CodexInspectInline } from "../codex/CodexInspectInline";
import { CodexStateRow } from "../codex/CodexStateRow";
import { ModalCrearEstados, type ModoCrearEstados } from "./ModalCrearEstados";
import { SeccionDesignaciones } from "./SeccionDesignaciones";
import { SeccionDuracion } from "./SeccionDuracion";
import { tokens } from "../tokens";

interface Props {
  modelo: Modelo;
  entidad: Entidad;
  entidadId: string;
  estados: Estado[];
  layout: LayoutEstados;
  onCrearEstadosConNombres: (nombres: string[]) => void;
  onEliminar: (estadoId: string) => void;
  onQuitarEstados: () => void;
  onRenombrar: (estadoId: string, nombre: string) => void;
  onDesignar: (estadoId: string, designacion: DesignacionEstado) => void;
  onQuitarDesignacion: (estadoId: string, designacion: DesignacionEstado) => void;
  onSuprimir: (estadoId: string) => void;
  onRestaurar: (estadoId: string) => void;
  onAbrirDuracion: (estadoId: string) => void;
  onLayout: (layout: LayoutEstados) => void;
}

const LAYOUTS: ReadonlyArray<LayoutEstados> = ["horizontal", "vertical"];

export function SeccionLayoutEstados(props: Props) {
  const [modoCrearEstados, setModoCrearEstados] = useState<ModoCrearEstados | null>(null);
  const visibles = props.estados.filter((estado) => !estado.suprimido);
  const sinEstados = props.estados.length === 0;
  const abrirModalCrearEstados = sinEstados
    ? () => setModoCrearEstados("iniciales")
    : () => setModoCrearEstados("adicional");
  const confirmarCrearEstados = (nombres: string[]) => {
    props.onCrearEstadosConNombres(nombres);
    setModoCrearEstados(null);
  };

  const accionAgregar = sinEstados
    ? (
      <button
        type="button"
        style={stateStyles.accion}
        onClick={abrirModalCrearEstados}
        title="Crear estados con nombres reales"
        data-testid="abrir-modal-crear-estados"
      >
        Agregar estados
      </button>
    )
    : (
      <button
        type="button"
        style={stateStyles.accion}
        onClick={abrirModalCrearEstados}
        title="Agregar estado con nombre real"
        data-testid="abrir-modal-crear-estados-adicional"
      >
        + estado
      </button>
    );

  return (
    <CodexInspectSection
      label="Estados"
      ariaLabel="Estados"
      right={accionAgregar}
      testId="inspector-seccion-estados"
    >
      {props.estados.length > 1 ? (
        <CodexInspectInline
          k="layout"
          options={["horizontal", "vertical"]}
          active={LAYOUTS.indexOf(props.layout)}
          onSelect={(i) => props.onLayout(LAYOUTS[i]!)}
        />
      ) : null}
      {!sinEstados ? (
        <div style={stateStyles.list}>
          {props.estados.map((estado) => {
            const noPuedeSuprimir = !estado.suprimido && estadoTieneEnlaces(props.modelo, estado.id);
            const noPuedeEliminar = visibles.length <= 2;
            const inputNombre = (
              <input
                aria-label={`Nombre estado ${estado.nombre}`}
                style={stateStyles.input}
                value={estado.nombre}
                onInput={(event) => props.onRenombrar(estado.id, event.currentTarget.value)}
              />
            );
            const headerRight = (
              <span style={stateStyles.headerActions}>
                <button
                  type="button"
                  aria-pressed={estado.suprimido}
                  disabled={noPuedeSuprimir}
                  style={estado.suprimido ? stateStyles.flagDangerActive : stateStyles.flagDanger}
                  onClick={() => estado.suprimido ? props.onRestaurar(estado.id) : props.onSuprimir(estado.id)}
                  title={noPuedeSuprimir ? "No se puede suprimir si tiene enlaces" : "Suprimir estado visualmente"}
                >
                  {estado.suprimido ? "restaurar" : "suprimir"}
                </button>
                <button
                  type="button"
                  disabled={noPuedeEliminar}
                  style={noPuedeEliminar ? stateStyles.flagOff : stateStyles.flagDanger}
                  onClick={() => props.onEliminar(estado.id)}
                  title={noPuedeEliminar ? "El axioma exige al menos dos estados visibles" : "Eliminar estado"}
                >
                  eliminar
                </button>
              </span>
            );
            return (
              <CodexStateRow
                key={estado.id}
                nameSlot={inputNombre}
                estadoId={estado.id}
                headerRight={headerRight}
                flags={[]}
              />
            );
          })}
          {/* Designaciones + duracion por estado: viven debajo del row para
              conservar el rol+nombre que el e2e localiza (Inicial/Final). */}
          {props.estados.map((estado) => (
            <div key={`flags-${estado.id}`} style={stateStyles.flagsRow} data-estado-flags={estado.id}>
              <SeccionDesignaciones
                estado={estado}
                onDesignar={props.onDesignar}
                onQuitarDesignacion={props.onQuitarDesignacion}
              />
              <SeccionDuracion estado={estado} onAbrirDuracion={props.onAbrirDuracion} />
            </div>
          ))}
          <button type="button" style={stateStyles.accion} onClick={props.onQuitarEstados}>Quitar estados</button>
        </div>
      ) : null}
      {modoCrearEstados ? (
        <ModalCrearEstados
          entidad={props.entidad}
          estadosExistentes={props.estados}
          modo={modoCrearEstados}
          onConfirmar={confirmarCrearEstados}
          onCancelar={() => setModoCrearEstados(null)}
        />
      ) : null}
    </CodexInspectSection>
  );
}

const flagBase: preact.JSX.CSSProperties = {
  border: 0,
  padding: 0,
  background: "transparent",
  fontFamily: tokens.typography.sans,
  fontSize: `${tokens.typography.fs.fs11}px`,
  fontWeight: tokens.typography.weights.regular,
  cursor: "pointer",
};

const stateStyles = {
  list: { display: "grid", gap: `${tokens.spacing.sm}px` },
  input: {
    width: "100%",
    height: "28px",
    padding: "0 8px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
    fontSize: `${tokens.typography.fs.fs13}px`,
  },
  headerActions: {
    display: "inline-flex",
    gap: `${tokens.spacing.sm}px`,
  },
  flagsRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    alignItems: "baseline",
    gap: `${tokens.spacing.sm}px`,
    paddingBottom: "4px",
  },
  accion: {
    ...flagBase,
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.fs.fs10}px`,
  },
  flagDanger: {
    ...flagBase,
    color: tokens.colors.crimson,
  },
  flagDangerActive: {
    ...flagBase,
    color: tokens.colors.crimson,
    fontWeight: tokens.typography.weights.semibold,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.crimson}`,
  },
  flagOff: {
    ...flagBase,
    color: tokens.colors.inkFaint,
    cursor: "not-allowed",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
