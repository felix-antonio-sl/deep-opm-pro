import { useEffect, useRef, useState } from "preact/hooks";
import type { Estado } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { inspectorStyles as style } from "../inspectorStyles";
import { CodexInspectSection } from "../codex/CodexInspectSection";
import { CodexStateRow, type CodexStateFlag } from "../codex/CodexStateRow";
import { OplObj, OplState } from "../codex/oplTipografia";
import { SeccionDesignaciones } from "./SeccionDesignaciones";
import { SeccionDuracion } from "./SeccionDuracion";
import { tokens } from "../tokens";
import { estadosDeEntidad } from "../../modelo/operaciones";
import { tieneDesignacion } from "../../modelo/estadosDesignaciones";
import { deriveElementIntent, runTutorPolicy } from "../../tutor";
import { TutorInterventionDetails, mapearLentesTutor } from "../TutorDetails";

interface Props {
  estado: Estado;
}

/**
 * Inspector dedicado del Estado seleccionado (paquete "Estados ciudadanos
 * de primera clase", 2026-05-23).
 *
 * Se monta cuando `estadoSeleccionId !== null` (discriminado en
 * `useInspectorViewModel.modo`). Reutiliza `SeccionDesignaciones` y
 * `SeccionDuracion` para no duplicar UI. Reordena con flechas ↑↓ usando
 * la operación `reordenarEstadoSeleccionado` del slice.
 *
 * Ronda Codex v1 · L2: re-piel a primitivas Codex (CodexInspectSection +
 * CodexStateRow). El badge de estado va en oliva canon, las designaciones y
 * la supresión como flags tipográficos. Cero lógica nueva: cada handler es el
 * mismo del slice; testIds inmutables (inspector-estado, -nombre, -subir,
 * -bajar, -suprimir, -restaurar, -eliminar).
 *
 * V-202: este inspector es affordance UI; no es gramática OPM. Las
 * mutaciones que dispara sí (rename, designación, supresión, duración,
 * reorden).
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5.2.
 */
export function InspectorEstado({ estado }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const contextoSimulacion = useOpmStore((s) => s.contextoSimulacion);
  const renombrarEstado = useOpmStore((s) => s.renombrarEstadoSeleccionadoSmart);
  const designarEstado = useOpmStore((s) => s.designarEstadoSeleccionado);
  const quitarDesignacion = useOpmStore((s) => s.quitarDesignacionEstadoSeleccionado);
  const suprimirEstado = useOpmStore((s) => s.suprimirEstadoSeleccionado);
  const restaurarEstado = useOpmStore((s) => s.restaurarEstadoPorId);
  const abrirModalDuracion = useOpmStore((s) => s.abrirModalDuracionEstadoSeleccionado);
  const reordenarEstado = useOpmStore((s) => s.reordenarEstadoSeleccionado);
  const eliminarEstado = useOpmStore((s) => s.eliminarEstadoSeleccionado);

  const objeto = modelo.entidades[estado.entidadId];
  const hermanos = estadosDeEntidad(modelo, estado.entidadId);
  const indice = hermanos.findIndex((e) => e.id === estado.id);
  const puedeSubir = indice > 0;
  const puedeBajar = indice >= 0 && indice < hermanos.length - 1;
  const puedeEliminar = hermanos.length > 2;
  const intervencionTutor = runTutorPolicy(deriveElementIntent({
    intentId: `state:${estado.id}:lifecycle`,
    focus: "state",
    ownerKind: objeto?.tipo === "proceso" ? "process" : "object",
    declaredCurrent: tieneDesignacion(estado, "current"),
    runtimeCurrent: contextoSimulacion?.estadosCurrent[estado.entidadId] === estado.id,
    activeLenses: mapearLentesTutor(modelo.lentesConocimiento ?? []),
  }));

  const [nombreInput, setNombreInput] = useState(estado.nombre);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Sincroniza si el estado cambia desde afuera.
  useEffect(() => setNombreInput(estado.nombre), [estado.nombre, estado.id]);

  const confirmar = () => {
    const limpio = nombreInput.trim();
    if (limpio && limpio !== estado.nombre) renombrarEstado(limpio);
    else if (!limpio) setNombreInput(estado.nombre);
  };

  // Flag de supresión: SIEMPRE crimson (canal UI, V-203). El handler alterna
  // suprimir/restaurar reutilizando los handlers del slice; testIds inmutables.
  const flagSupresion: CodexStateFlag = estado.suprimido
    ? {
        label: "restaurar",
        active: true,
        danger: true,
        title: "Restaurar estado suprimido",
        onToggle: () => restaurarEstado(estado.id),
        testId: "inspector-estado-restaurar",
      }
    : {
        label: "suprimir",
        active: false,
        danger: true,
        title: "Marcar como suprimido (no se renderiza)",
        onToggle: suprimirEstado,
        testId: "inspector-estado-suprimir",
      };

  const inputNombre = (
    <input
      ref={inputRef}
      data-testid="inspector-estado-nombre"
      type="text"
      value={nombreInput}
      onInput={(e) => setNombreInput((e.target as HTMLInputElement).value)}
      onBlur={confirmar}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          confirmar();
          (e.target as HTMLInputElement).blur();
        } else if (e.key === "Escape") {
          e.preventDefault();
          setNombreInput(estado.nombre);
          (e.target as HTMLInputElement).blur();
        }
      }}
      style={estadoStyles.input}
    />
  );

  return (
    <div data-testid="inspector-estado" data-estado-id={estado.id}>
      <header style={style.header}>
        <span style={style.kind}>Estado</span>
        <span style={style.id} title={`id ${estado.id}`}>{estado.id}</span>
      </header>

      <CodexInspectSection label="Identidad" testId="inspector-estado-identidad">
        <TutorInterventionDetails
          intervention={intervencionTutor}
          testId="tutor-inspector-estado"
        />
        <CodexStateRow
          nameSlot={inputNombre}
          estadoId={estado.id}
          onSubir={() => reordenarEstado(indice - 1)}
          onBajar={() => reordenarEstado(indice + 1)}
          puedeSubir={puedeSubir}
          puedeBajar={puedeBajar}
          flags={[]}
        />
        <span style={estadoStyles.contexto}>
          <OplState>{estado.nombre}</OplState> pertenece a {objeto ? <OplObj>{objeto.nombre}</OplObj> : "objeto desconocido"} · Posición ({indice + 1}/{hermanos.length})
        </span>
      </CodexInspectSection>

      <CodexInspectSection label="Designaciones" testId="inspector-estado-designaciones">
        {/*
          SeccionDesignaciones invoca (estadoId, designacion); las acciones
          from-selection sólo necesitan (designacion). Envolvemos para adaptar
          firmas. El sello del invariante garantiza que el id coincide con
          `estado.id` (estamos rendereados por el discriminador del Inspector).
        */}
        <SeccionDesignaciones
          estado={estado}
          onDesignar={(_estadoId, designacion) => designarEstado(designacion)}
          onQuitarDesignacion={(_estadoId, designacion) => quitarDesignacion(designacion)}
        />
      </CodexInspectSection>

      <CodexInspectSection label="Tiempo · visibilidad" testId="inspector-estado-tiempo">
        <span style={estadoStyles.row}>
          <SeccionDuracion estado={estado} onAbrirDuracion={abrirModalDuracion} />
          <button
            type="button"
            aria-pressed={flagSupresion.active}
            data-testid={flagSupresion.testId}
            style={flagSupresion.active ? estadoStyles.flagDangerActive : estadoStyles.flagDanger}
            onClick={flagSupresion.onToggle}
            title={flagSupresion.title}
          >
            {flagSupresion.label}
          </button>
        </span>
      </CodexInspectSection>

      <CodexInspectSection label="Acciones" testId="inspector-estado-acciones">
        <button
          type="button"
          data-testid="inspector-estado-eliminar"
          style={estadoStyles.eliminar}
          disabled={!puedeEliminar}
          onClick={eliminarEstado}
          title={puedeEliminar ? "Eliminar este estado" : "Necesitas al menos 2 estados para eliminar uno"}
        >
          eliminar estado
        </button>
      </CodexInspectSection>
    </div>
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

const estadoStyles = {
  input: {
    width: "100%",
    height: "30px",
    padding: "4px 8px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: "13px",
    fontFamily: tokens.typography.serif,
  },
  contexto: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
    fontSize: `${tokens.typography.fs.fs11}px`,
  },
  row: {
    display: "inline-flex",
    flexWrap: "wrap" as const,
    gap: `${tokens.spacing.md}px`,
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
  eliminar: {
    ...flagBase,
    color: tokens.colors.crimson,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
