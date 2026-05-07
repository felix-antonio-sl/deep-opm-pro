// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import addStatesIcon from "../../../../assets/svg/addStates.svg";
import { estadoTieneEnlaces } from "../../modelo/estadosDesignaciones";
import type { DesignacionEstado, Estado, LayoutEstados, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { SeccionDesignaciones } from "./SeccionDesignaciones";
import { SeccionDuracion } from "./SeccionDuracion";
import { tokens } from "../tokens";

/**
 * Iconografía canónica de gestión de estados.
 * SSOT: [Glos 3.66] axioma "al menos dos estados visibles"; asset assets/svg/addStates.svg [JOYAS §2].
 */

interface Props {
  modelo: Modelo;
  entidadId: string;
  estados: Estado[];
  layout: LayoutEstados;
  onAgregarEstados: () => void;
  onAgregarEstado: () => void;
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

export function SeccionLayoutEstados(props: Props) {
  const visibles = props.estados.filter((estado) => !estado.suprimido);
  return (
    <section style={stateStyles.section} aria-label="Estados" data-testid="inspector-seccion-estados">
      <div style={stateStyles.header}>
        <span style={style.label}>Estados</span>
        {props.estados.length > 0 ? (
          <button type="button" style={stateStyles.smallButtonIcon} onClick={props.onAgregarEstado} title="Agregar nuevo estado">
            <img src={addStatesIcon} alt="" aria-hidden="true" style={stateStyles.iconSmall} />
            Agregar estado
          </button>
        ) : null}
      </div>
      {props.estados.length > 1 ? (
        <label style={style.field}>
          <span style={style.label}>Layout</span>
          <select style={style.input} value={props.layout} onChange={(event) => props.onLayout(event.currentTarget.value as LayoutEstados)}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>
      ) : null}
      {props.estados.length === 0 ? (
        <button type="button" style={stateStyles.primaryIcon} onClick={props.onAgregarEstados} title="Crea simultáneamente estado1 y estado2">
          <img src={addStatesIcon} alt="" aria-hidden="true" style={stateStyles.iconLarge} />
          Agregar estados
        </button>
      ) : (
        <div style={stateStyles.list}>
          {props.estados.map((estado) => (
            <div key={estado.id} style={stateStyles.row}>
              <input aria-label={`Nombre estado ${estado.nombre}`} style={stateStyles.input} value={estado.nombre} onInput={(event) => props.onRenombrar(estado.id, event.currentTarget.value)} />
              <div style={stateStyles.actions}>
                <SeccionDesignaciones estado={estado} onDesignar={props.onDesignar} onQuitarDesignacion={props.onQuitarDesignacion} />
                <SeccionDuracion estado={estado} onAbrirDuracion={props.onAbrirDuracion} />
                <button type="button" style={estado.suprimido ? stateStyles.tagActive : stateStyles.tag} disabled={!estado.suprimido && estadoTieneEnlaces(props.modelo, estado.id)} onClick={() => estado.suprimido ? props.onRestaurar(estado.id) : props.onSuprimir(estado.id)} title={estadoTieneEnlaces(props.modelo, estado.id) ? "No se puede suprimir si tiene enlaces" : "Suprimir estado visualmente"}>
                  {estado.suprimido ? "Restaurar" : "Suprimir"}
                </button>
                <button type="button" style={visibles.length <= 2 ? stateStyles.deleteDisabled : stateStyles.delete} disabled={visibles.length <= 2} onClick={() => props.onEliminar(estado.id)} title={visibles.length <= 2 ? "El axioma exige al menos dos estados visibles" : "Eliminar estado"}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <button type="button" style={style.secondaryButton} onClick={props.onQuitarEstados}>Quitar estados</button>
        </div>
      )}
    </section>
  );
}

const stateStyles = {
  section: { display: "grid", gap: "8px", marginBottom: "14px", paddingTop: "2px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" },
  list: { display: "grid", gap: "8px" },
  row: { display: "grid", gap: "6px", padding: "8px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome },
  input: { width: "100%", height: "30px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, outlineColor: tokens.colors.chromeNeutral, fontSize: "12px" },
  actions: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "6px" },
  smallButton: { minHeight: "28px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoCard, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  smallButtonIcon: { minHeight: "28px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoCard, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" },
  primaryIcon: { minHeight: "32px", padding: "6px 10px", border: `1px solid ${tokens.colors.acentoSecundario}`, borderRadius: tokens.radii.sm, background: tokens.colors.acentoSecundario, color: tokens.colors.fondoChrome, cursor: "pointer", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" },
  iconSmall: { width: "14px", height: "14px", display: "block" },
  iconLarge: { width: "16px", height: "16px", display: "block", filter: "brightness(0) invert(1)" },
  tag: { height: "28px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoCard, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "11px", fontWeight: 700 },
  tagActive: { height: "28px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutralSuave, color: tokens.colors.textoPrimario, cursor: "pointer", fontSize: "11px", fontWeight: 700 },
  delete: { height: "28px", border: `1px solid ${tokens.colors.errorBase}`, borderRadius: tokens.radii.sm, background: tokens.colors.errorFondo, color: tokens.colors.errorTexto, cursor: "pointer", fontSize: "11px", fontWeight: 700 },
  deleteDisabled: { height: "28px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoNeutral, color: tokens.colors.textoDeshabilitado, cursor: "not-allowed", fontSize: "11px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
