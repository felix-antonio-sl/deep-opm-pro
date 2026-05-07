import { useEffect, useState } from "preact/hooks";
import inzoomIcon from "../../../../assets/svg/inzoom.svg";
import unfoldIcon from "../../../../assets/svg/unfold.svg";
import type { FilaPlegadoParcial } from "../../modelo/plegado";
import type { Enlace, Entidad, Id, Modelo, ModoDespliegueObjeto, OrdenPartesPlegado } from "../../modelo/tipos";
import { contextoReanclaje, type ContextoReanclaje } from "../inspectorEnlace/SeccionReanclaje";
import { inspectorStyles as style } from "../inspectorStyles";

/**
 * Iconografía canónica del refinamiento OPM.
 * SSOT: [Met §inzoom] descomposición proceso, [Met §unfold] despliegue objeto.
 * Assets: assets/svg/inzoom.svg y assets/svg/unfold.svg [JOYAS §2].
 */

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
  modelo: Modelo;
  onDescomponer: () => void;
  onDesplegar: (modo?: ModoDespliegueObjeto) => void;
  onQuitarDescomposicion: () => void;
  onQuitarDespliegue: () => void;
  onReasignarEnlaceExterno: (opdId: Id, aparienciaEnlaceId: Id, nuevoSubprocesoId: Id) => void;
  onCrearAutoInvocacion: () => void;
  onCambiarModoPlegado: () => void;
  onCambiarOrdenPartes: (orden: OrdenPartesPlegado) => void;
  onExtraer: (padreAparienciaId: string, parteEntidadId: string) => void;
  onExtraerTodas: () => void;
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
      {props.padreAparienciaId && props.filasParciales.length > 0 ? <PartesCompactas filas={props.filasParciales} padreAparienciaId={props.padreAparienciaId} onExtraer={props.onExtraer} onExtraerTodas={props.onExtraerTodas} /> : null}
    </>
  );
}

function RefinamientoProceso(props: Props) {
  return (
    <>
      <button type="button" style={refinamientoStyles.iconButton} onClick={props.onDescomponer} title="Crear o abrir el OPD hijo de descomposición">
        <img src={inzoomIcon} alt="" aria-hidden="true" style={refinamientoStyles.icon} />
        {props.entidad.refinamiento?.tipo === "descomposicion" ? "Abrir descomposición" : "Descomponer"}
      </button>
      {props.entidad.refinamiento?.tipo === "descomposicion" ? <button type="button" style={style.secondaryButton} onClick={props.onQuitarDescomposicion} title="Eliminar el OPD hijo de descomposición">Quitar descomposición</button> : null}
      {props.entidad.refinamiento?.tipo === "descomposicion" ? <ReasignacionExternos modelo={props.modelo} entidad={props.entidad} onReasignar={props.onReasignarEnlaceExterno} /> : null}
      <button type="button" style={props.autoInvocacion ? style.secondaryButton : style.primaryButton} onClick={props.onCrearAutoInvocacion} disabled={!!props.autoInvocacion} title={props.autoInvocacion ? "El proceso ya tiene auto-invocación en este OPD" : "Crear auto-invocación con demora de 1s"}>
        {props.autoInvocacion ? "Auto-invocación existente" : "Auto-invocación"}
      </button>
    </>
  );
}

function ReasignacionExternos(props: { modelo: Modelo; entidad: Entidad; onReasignar: (opdId: Id, aparienciaEnlaceId: Id, nuevoSubprocesoId: Id) => void }) {
  const opdId = props.entidad.refinamiento?.opdId;
  const opd = opdId ? props.modelo.opds[opdId] : undefined;
  if (!opdId || !opd) return null;
  const rows = Object.values(opd.enlaces)
    .flatMap((aparienciaEnlace) => {
      const enlace = props.modelo.enlaces[aparienciaEnlace.enlaceId];
      if (enlace?.derivado?.tipo !== "enlace-externo-refinamiento" || enlace.derivado.refinamientoId !== props.entidad.id) return [];
      const reanclaje = contextoReanclaje(props.modelo, opdId, enlace);
      return reanclaje ? [{ enlace, reanclaje }] : [];
    });
  if (rows.length === 0) return null;

  return (
    <section style={reassignStyles.section} aria-label="Enlaces externos derivados">
      <span style={style.label}>Enlaces externos derivados</span>
      {rows.map((row) => (
        <ReasignacionExternoRow
          key={row.reanclaje.aparienciaEnlaceId}
          opdId={opdId}
          enlace={row.enlace}
          reanclaje={row.reanclaje}
          onReasignar={props.onReasignar}
        />
      ))}
    </section>
  );
}

function ReasignacionExternoRow(props: { opdId: Id; enlace: Enlace; reanclaje: ContextoReanclaje; onReasignar: (opdId: Id, aparienciaEnlaceId: Id, nuevoSubprocesoId: Id) => void }) {
  const [seleccionado, setSeleccionado] = useState(props.reanclaje.endpointActualId);
  useEffect(() => setSeleccionado(props.reanclaje.endpointActualId), [props.reanclaje.endpointActualId]);

  return (
    <div style={reassignStyles.row}>
      <div style={reassignStyles.summary}>
        <span style={reassignStyles.kind}>{props.enlace.tipo}</span>
        <span style={reassignStyles.badge}>{props.enlace.derivado?.origen === "manual" ? "manual" : "automático"}</span>
      </div>
      <label style={style.field}>
        <span style={style.label}>Reasignar a subproceso</span>
        <select data-testid={`refinamiento-reasignar-${props.reanclaje.aparienciaEnlaceId}`} style={style.input} value={seleccionado} onChange={(event) => setSeleccionado(event.currentTarget.value)}>
          {props.reanclaje.subprocesos.map((subproceso, index) => <option key={subproceso.id} value={subproceso.id}>{subproceso.nombre} ({index + 1})</option>)}
        </select>
      </label>
      <button type="button" style={style.secondaryButton} disabled={!seleccionado || (seleccionado === props.reanclaje.endpointActualId && props.enlace.derivado?.origen === "manual")} onClick={() => props.onReasignar(props.opdId, props.reanclaje.aparienciaEnlaceId, seleccionado)}>
        Reasignar
      </button>
    </div>
  );
}

function RefinamientoObjeto(props: Props) {
  return (
    <>
      {props.entidad.refinamiento?.tipo === "despliegue" ? (
        <button type="button" style={refinamientoStyles.iconButton} onClick={() => props.onDesplegar()} title="Abrir el OPD hijo de despliegue">
          <img src={unfoldIcon} alt="" aria-hidden="true" style={refinamientoStyles.icon} />
          Mostrar despliegue
        </button>
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
      <summary style={style.menuSummary}>
        <img src={unfoldIcon} alt="" aria-hidden="true" style={refinamientoStyles.iconInline} />
        Desplegar como...
      </summary>
      <div style={style.menuItems}>
        {OPCIONES_DESPLIEGUE_OBJETO.map((opcion) => <button key={opcion.modo} type="button" style={style.menuButton} onClick={() => props.onSelect(opcion.modo)}>{opcion.label}</button>)}
      </div>
    </details>
  );
}

function PartesCompactas(props: { filas: FilaPlegadoParcial[]; padreAparienciaId: string; onExtraer: (padreAparienciaId: string, parteEntidadId: string) => void; onExtraerTodas: () => void }) {
  const tienePendientes = props.filas.some((fila) => fila.tipo === "parte" && !fila.extraida);
  return (
    <section style={partialStyles.section} aria-label="Partes plegadas">
      <div style={partialStyles.header}>
        <span style={style.label}>Partes</span>
        <button
          type="button"
          data-testid="extraer-todas-partes-btn"
          style={tienePendientes ? partialStyles.button : partialStyles.buttonDisabled}
          disabled={!tienePendientes}
          onClick={props.onExtraerTodas}
        >
          Extraer todas
        </button>
      </div>
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
  header: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: "8px" },
  list: { display: "grid", gap: "6px" },
  row: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: "8px", padding: "8px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#ffffff" },
  name: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#1f2937", fontSize: "12px", fontWeight: 700 },
  nameExtracted: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#667085", fontSize: "12px", fontWeight: 700, fontStyle: "italic", textDecoration: "line-through" },
  counter: { padding: "8px", color: "#667085", fontSize: "12px", fontStyle: "italic" },
  button: { minHeight: "28px", padding: "0 8px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#f9fbfd", color: "#475467", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  buttonDisabled: { minHeight: "28px", padding: "0 8px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#f3f4f6", color: "#98a2b3", cursor: "not-allowed", fontSize: "12px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;

const refinamientoStyles = {
  iconButton: {
    minHeight: "32px",
    padding: "6px 10px",
    border: "1px solid #1a3763",
    borderRadius: "4px",
    background: "#1a3763",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  icon: { width: "16px", height: "16px", display: "block", filter: "brightness(0) invert(1)" },
  iconInline: { width: "14px", height: "14px", verticalAlign: "-2px", marginRight: "4px" },
} satisfies Record<string, preact.JSX.CSSProperties>;

const reassignStyles = {
  section: { display: "grid", gap: "8px", margin: "4px 0 14px" },
  row: { display: "grid", gap: "8px", padding: "8px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#ffffff" },
  summary: { display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" },
  kind: { color: "#1f2937", fontSize: "12px", fontWeight: 700 },
  badge: { color: "#667085", fontSize: "11px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
