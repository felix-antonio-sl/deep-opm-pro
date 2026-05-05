import type { FilaPlegadoParcial } from "../../modelo/plegado";
import type { Entidad, ModoDespliegueObjeto, OrdenPartesPlegado } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

export const OPCIONES_DESPLIEGUE_OBJETO: Array<{ modo: ModoDespliegueObjeto; label: string }> = [
  { modo: "agregacion", label: "Como partes (agregación)" },
  { modo: "exhibicion", label: "Como atributos (exhibición)" },
  { modo: "generalizacion", label: "Como especializaciones" },
  { modo: "clasificacion", label: "Como instancias" },
];

interface Props {
  entidad: Entidad;
  autoInvocacion?: unknown | undefined;
  tienePartesPlegables: boolean;
  modoPlegado: string;
  ordenPartes?: OrdenPartesPlegado | undefined;
  filasParciales: FilaPlegadoParcial[];
  padreAparienciaId?: string | undefined;
  parteExtraidaDe?: unknown | undefined;
  onDescomponer: () => void;
  onDesplegar: (modo?: ModoDespliegueObjeto) => void;
  onQuitarDescomposicion: () => void;
  onQuitarDespliegue: () => void;
  onCrearAutoInvocacion: () => void;
  onCambiarModoPlegado: () => void;
  onCambiarOrdenPartes: (orden: OrdenPartesPlegado) => void;
  onExtraer: (padreAparienciaId: string, parteEntidadId: string) => void;
  onReinsertarParte: () => void;
}

export function SeccionRefinamiento(props: Props) {
  return (
    <>
      {props.entidad.tipo === "proceso" ? <RefinamientoProceso {...props} /> : null}
      {props.entidad.tipo === "objeto" ? <RefinamientoObjeto {...props} /> : null}
      {props.tienePartesPlegables ? (
        <>
          <button type="button" style={style.secondaryButton} onClick={props.onCambiarModoPlegado} title="Alternar vista compacta intra-rectángulo sin abrir ni destruir el OPD hijo">
            {props.modoPlegado === "parcial" ? "Plegado completo" : "Plegado parcial"}
          </button>
          <label style={style.field}>
            <span style={style.label}>Orden de partes</span>
            <select aria-label="Orden de partes" style={style.input} value={props.ordenPartes ?? "alfabetico"} onChange={(event) => props.onCambiarOrdenPartes(event.currentTarget.value as OrdenPartesPlegado)}>
              <option value="alfabetico">Alfabético</option>
              <option value="creacion">Creación</option>
            </select>
          </label>
        </>
      ) : null}
      {props.parteExtraidaDe ? <button type="button" style={style.secondaryButton} onClick={props.onReinsertarParte} title="Reinsertar esta parte en la lista compacta del padre">Reinsertar al padre</button> : null}
      {props.padreAparienciaId && props.filasParciales.length > 0 ? <PartesCompactas filas={props.filasParciales} padreAparienciaId={props.padreAparienciaId} onExtraer={props.onExtraer} /> : null}
    </>
  );
}

function RefinamientoProceso(props: Props) {
  return (
    <>
      <button type="button" style={style.primaryButton} onClick={props.onDescomponer} title="Crear o abrir el OPD hijo de descomposición">
        {props.entidad.refinamiento?.tipo === "descomposicion" ? "Abrir descomposición" : "Descomponer"}
      </button>
      {props.entidad.refinamiento?.tipo === "descomposicion" ? <button type="button" style={style.secondaryButton} onClick={props.onQuitarDescomposicion} title="Eliminar el OPD hijo de descomposición">Quitar descomposición</button> : null}
      <button type="button" style={props.autoInvocacion ? style.secondaryButton : style.primaryButton} onClick={props.onCrearAutoInvocacion} disabled={!!props.autoInvocacion} title={props.autoInvocacion ? "El proceso ya tiene auto-invocación en este OPD" : "Crear auto-invocación con demora de 1s"}>
        {props.autoInvocacion ? "Auto-invocación existente" : "Auto-invocación"}
      </button>
    </>
  );
}

function RefinamientoObjeto(props: Props) {
  return (
    <>
      {props.entidad.refinamiento?.tipo === "despliegue" ? (
        <button type="button" style={style.primaryButton} onClick={() => props.onDesplegar()} title="Abrir el OPD hijo de despliegue">Mostrar despliegue</button>
      ) : (
        <DesplegarComo onSelect={props.onDesplegar} />
      )}
      {props.entidad.refinamiento?.tipo === "despliegue" ? <button type="button" style={style.secondaryButton} onClick={props.onQuitarDespliegue} title="Eliminar el OPD hijo de despliegue y sus refinadores locales">Quitar despliegue</button> : null}
    </>
  );
}

function DesplegarComo(props: { onSelect: (modo: ModoDespliegueObjeto) => void }) {
  return (
    <details style={style.menu}>
      <summary style={style.menuSummary}>Desplegar como...</summary>
      <div style={style.menuItems}>
        {OPCIONES_DESPLIEGUE_OBJETO.map((opcion) => <button key={opcion.modo} type="button" style={style.menuButton} onClick={() => props.onSelect(opcion.modo)}>{opcion.label}</button>)}
      </div>
    </details>
  );
}

function PartesCompactas(props: { filas: FilaPlegadoParcial[]; padreAparienciaId: string; onExtraer: (padreAparienciaId: string, parteEntidadId: string) => void }) {
  return (
    <section style={partialStyles.section} aria-label="Partes plegadas">
      <span style={style.label}>Partes</span>
      <div style={partialStyles.list}>
        {props.filas.map((fila, index) => fila.tipo === "contador" ? (
          <div key={`contador-${index}`} style={partialStyles.counter}>{fila.texto}</div>
        ) : (
          <div key={fila.entidadId} style={partialStyles.row}>
            <span style={fila.extraida ? partialStyles.nameExtracted : partialStyles.name}>{fila.nombre}</span>
            <button type="button" style={fila.extraida ? partialStyles.buttonDisabled : partialStyles.button} disabled={fila.extraida} onClick={() => props.onExtraer(props.padreAparienciaId, fila.entidadId)}>
              {fila.extraida ? "Extraída" : "Extraer"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

const partialStyles = {
  section: { display: "grid", gap: "8px", marginBottom: "14px", paddingTop: "2px" },
  list: { display: "grid", gap: "6px" },
  row: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: "8px", padding: "8px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#ffffff" },
  name: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#1f2937", fontSize: "12px", fontWeight: 700 },
  nameExtracted: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#667085", fontSize: "12px", fontWeight: 700, fontStyle: "italic", textDecoration: "line-through" },
  counter: { padding: "8px", color: "#667085", fontSize: "12px", fontStyle: "italic" },
  button: { minHeight: "28px", padding: "0 8px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#f9fbfd", color: "#475467", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  buttonDisabled: { minHeight: "28px", padding: "0 8px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#f3f4f6", color: "#98a2b3", cursor: "not-allowed", fontSize: "12px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
