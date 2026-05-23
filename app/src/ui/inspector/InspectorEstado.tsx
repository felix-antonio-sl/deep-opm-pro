import { useEffect, useRef, useState } from "preact/hooks";
import type { Estado } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { inspectorStyles as style } from "../inspectorStyles";
import { SeccionDesignaciones } from "./SeccionDesignaciones";
import { SeccionDuracion } from "./SeccionDuracion";
import { tokens } from "../tokens";
import { estadosDeEntidad } from "../../modelo/operaciones";

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
 * V-202: este inspector es affordance UI; no es gramática OPM. Las
 * mutaciones que dispara sí (rename, designación, supresión, duración,
 * reorden).
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5.2.
 */
export function InspectorEstado({ estado }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
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

  const [nombreInput, setNombreInput] = useState(estado.nombre);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Sincroniza si el estado cambia desde afuera.
  useEffect(() => setNombreInput(estado.nombre), [estado.nombre, estado.id]);

  const confirmar = () => {
    const limpio = nombreInput.trim();
    if (limpio && limpio !== estado.nombre) renombrarEstado(limpio);
    else if (!limpio) setNombreInput(estado.nombre);
  };

  return (
    <div data-testid="inspector-estado" data-estado-id={estado.id}>
      <header style={style.header}>
        <span style={style.kind}>Estado</span>
        <span style={style.id} title={`id ${estado.id}`}>{estado.id}</span>
      </header>

      <div style={style.field}>
        <span style={style.label}>Nombre</span>
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
        <span style={estadoStyles.contexto}>Pertenece a {objeto?.nombre ?? "objeto desconocido"}</span>
      </div>

      <div style={style.field}>
        <span style={style.label}>Designaciones</span>
        <div style={estadoStyles.row}>
          {/*
            SeccionDesignaciones invoca (estadoId, designacion); las acciones
            from-selection sólo necesitan (designacion). Envolvemos para
            adaptar firmas. El sello del invariante garantiza que el id
            coincide con `estado.id` (estamos rendereados por el discriminador
            del Inspector).
          */}
          <SeccionDesignaciones
            estado={estado}
            onDesignar={(_estadoId, designacion) => designarEstado(designacion)}
            onQuitarDesignacion={(_estadoId, designacion) => quitarDesignacion(designacion)}
          />
        </div>
      </div>

      <div style={style.field}>
        <span style={style.label}>Tiempo</span>
        <div style={estadoStyles.row}>
          <SeccionDuracion estado={estado} onAbrirDuracion={abrirModalDuracion} />
        </div>
      </div>

      <div style={style.field}>
        <span style={style.label}>Visibilidad</span>
        <div style={estadoStyles.row}>
          {estado.suprimido ? (
            <button
              type="button"
              data-testid="inspector-estado-restaurar"
              style={estadoStyles.botonSecundario}
              onClick={() => restaurarEstado(estado.id)}
              title="Restaurar estado suprimido"
            >
              Restaurar
            </button>
          ) : (
            <button
              type="button"
              data-testid="inspector-estado-suprimir"
              style={estadoStyles.botonSecundario}
              onClick={suprimirEstado}
              title="Marcar como suprimido (no se renderiza)"
            >
              Suprimir
            </button>
          )}
        </div>
      </div>

      <div style={style.field}>
        <span style={style.label}>Posición ({indice + 1}/{hermanos.length})</span>
        <div style={estadoStyles.row}>
          <button
            type="button"
            data-testid="inspector-estado-subir"
            style={estadoStyles.botonSecundario}
            disabled={!puedeSubir}
            onClick={() => reordenarEstado(indice - 1)}
            title="Mover hacia atrás (↑ en horizontal / arriba en vertical)"
          >
            ↑
          </button>
          <button
            type="button"
            data-testid="inspector-estado-bajar"
            style={estadoStyles.botonSecundario}
            disabled={!puedeBajar}
            onClick={() => reordenarEstado(indice + 1)}
            title="Mover hacia adelante"
          >
            ↓
          </button>
        </div>
      </div>

      <div style={style.field}>
        <span style={style.label}>Acciones</span>
        <div style={estadoStyles.row}>
          <button
            type="button"
            data-testid="inspector-estado-eliminar"
            style={{ ...estadoStyles.botonSecundario, color: tokens.colors.accent, borderColor: tokens.colors.accent }}
            disabled={!puedeEliminar}
            onClick={eliminarEstado}
            title={puedeEliminar ? "Eliminar este estado" : "Necesitas al menos 2 estados para eliminar uno"}
          >
            Eliminar estado
          </button>
        </div>
      </div>
    </div>
  );
}

const estadoStyles = {
  input: {
    width: "100%",
    height: "30px",
    padding: "4px 8px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: "13px",
    fontFamily: tokens.typography.familyChrome,
  },
  contexto: {
    color: tokens.colors.ink50,
    fontSize: "11px",
  },
  row: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
  },
  botonSecundario: {
    height: "28px",
    padding: "0 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
