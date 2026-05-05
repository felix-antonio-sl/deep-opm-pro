import { estadosDeEntidad } from "../modelo/operaciones";
import { filasPlegadoParcial, modoPlegadoApariencia, partesDePlegado, type FilaPlegadoParcial } from "../modelo/plegado";
import type { Entidad, Estado, ModoDespliegueObjeto } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";

interface Props {
  entidad: Entidad;
}

export function InspectorEntidad({ entidad }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const renombrar = useOpmStore((s) => s.renombrarSeleccionada);
  const fijarEsencia = useOpmStore((s) => s.fijarEsenciaSeleccionada);
  const fijarAfiliacion = useOpmStore((s) => s.fijarAfiliacionSeleccionada);
  const descomponer = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegar = useOpmStore((s) => s.desplegarSeleccionada);
  const quitarDescomposicion = useOpmStore((s) => s.quitarDescomposicionSeleccionada);
  const quitarDespliegue = useOpmStore((s) => s.quitarDespliegueSeleccionado);
  const cambiarModoPlegado = useOpmStore((s) => s.cambiarModoPlegadoSeleccionado);
  const extraerParte = useOpmStore((s) => s.extraerParteDePlegado);
  const reinsertarParte = useOpmStore((s) => s.reinsertarParteExtraidaSeleccionada);
  const agregarEstados = useOpmStore((s) => s.agregarEstadosObjeto);
  const agregarEstado = useOpmStore((s) => s.agregarEstadoObjeto);
  const eliminarEstado = useOpmStore((s) => s.eliminarEstado);
  const quitarEstados = useOpmStore((s) => s.quitarEstadosObjetoSeleccionado);
  const renombrarEstado = useOpmStore((s) => s.renombrarEstadoSeleccionado);
  const designarInicial = useOpmStore((s) => s.designarEstadoInicial);
  const designarFinal = useOpmStore((s) => s.designarEstadoFinal);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);

  const aparienciaActiva = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === entidad.id);
  const partesPlegables = partesDePlegado(modelo, entidad.id);
  const modoPlegado = aparienciaActiva ? modoPlegadoApariencia(aparienciaActiva) : "completo";
  const filasParciales = aparienciaActiva && modoPlegado === "parcial"
    ? filasPlegadoParcial(modelo, opdActivoId, aparienciaActiva.id)
    : [];
  const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>{entidad.tipo === "objeto" ? "Objeto" : "Proceso"}</span>
        <code style={style.id}>{entidad.id}</code>
      </div>

      <label style={style.field}>
        <span style={style.label}>Nombre</span>
        <input
          style={style.input}
          value={entidad.nombre}
          onInput={(event) => renombrar(event.currentTarget.value)}
        />
      </label>

      <div style={style.field}>
        <span style={style.label}>Esencia</span>
        <div style={style.segmented}>
          <Segment label="Informacional" active={entidad.esencia === "informacional"} onClick={() => fijarEsencia("informacional")} />
          <Segment label="Física" active={entidad.esencia === "fisica"} onClick={() => fijarEsencia("fisica")} />
        </div>
      </div>

      <div style={style.field}>
        <span style={style.label}>Afiliación</span>
        <div style={style.segmented}>
          <Segment label="Sistémica" active={entidad.afiliacion === "sistemica"} onClick={() => fijarAfiliacion("sistemica")} />
          <Segment label="Ambiental" active={entidad.afiliacion === "ambiental"} onClick={() => fijarAfiliacion("ambiental")} />
        </div>
      </div>

      {entidad.tipo === "proceso" ? (
        <>
          <button
            type="button"
            style={style.primaryButton}
            onClick={descomponer}
            title="Crear o abrir el OPD hijo de descomposición"
          >
            {entidad.refinamiento?.tipo === "descomposicion" ? "Abrir descomposición" : "Descomponer"}
          </button>
          {entidad.refinamiento?.tipo === "descomposicion" ? (
            <button
              type="button"
              style={style.secondaryButton}
              onClick={quitarDescomposicion}
              title="Eliminar el OPD hijo de descomposición"
            >
              Quitar descomposición
            </button>
          ) : null}
        </>
      ) : null}

      {entidad.tipo === "objeto" ? (
        <>
          {entidad.refinamiento?.tipo === "despliegue" ? (
            <button
              type="button"
              style={style.primaryButton}
              onClick={() => desplegar()}
              title="Abrir el OPD hijo de despliegue"
            >
              Mostrar despliegue
            </button>
          ) : (
            <DesplegarComo onSelect={desplegar} />
          )}
          {entidad.refinamiento?.tipo === "despliegue" ? (
            <button
              type="button"
              style={style.secondaryButton}
              onClick={quitarDespliegue}
              title="Eliminar el OPD hijo de despliegue y sus refinadores locales"
            >
              Quitar despliegue
            </button>
          ) : null}
        </>
      ) : null}

      {partesPlegables.length > 0 && aparienciaActiva ? (
        <button
          type="button"
          style={style.secondaryButton}
          onClick={() => cambiarModoPlegado(modoPlegado === "parcial" ? "completo" : "parcial")}
          title="Alternar vista compacta intra-rectángulo sin abrir ni destruir el OPD hijo"
        >
          {modoPlegado === "parcial" ? "Plegado completo" : "Plegado parcial"}
        </button>
      ) : null}

      {aparienciaActiva?.parteExtraidaDe ? (
        <button
          type="button"
          style={style.secondaryButton}
          onClick={reinsertarParte}
          title="Reinsertar esta parte en la lista compacta del padre"
        >
          Reinsertar al padre
        </button>
      ) : null}

      {aparienciaActiva && filasParciales.length > 0 ? (
        <PartesCompactas
          filas={filasParciales}
          padreAparienciaId={aparienciaActiva.id}
          onExtraer={extraerParte}
        />
      ) : null}

      {entidad.tipo === "objeto" ? (
        <EstadosObjeto
          estados={estados}
          onAgregarEstados={agregarEstados}
          onAgregarEstado={agregarEstado}
          onEliminar={eliminarEstado}
          onQuitarEstados={quitarEstados}
          onRenombrar={renombrarEstado}
          onDesignarInicial={designarInicial}
          onDesignarFinal={designarFinal}
        />
      ) : null}

      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar entidad</button>
    </>
  );
}

function Segment(props: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      style={props.active ? style.segmentActive : style.segment}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

function EstadosObjeto(props: {
  estados: Estado[];
  onAgregarEstados: () => void;
  onAgregarEstado: () => void;
  onEliminar: (estadoId: string) => void;
  onQuitarEstados: () => void;
  onRenombrar: (estadoId: string, nombre: string) => void;
  onDesignarInicial: (estadoId: string) => void;
  onDesignarFinal: (estadoId: string) => void;
}) {
  return (
    <section style={stateStyles.section} aria-label="Estados">
      <div style={stateStyles.header}>
        <span style={style.label}>Estados</span>
        {props.estados.length > 0 ? (
          <button type="button" style={stateStyles.smallButton} onClick={props.onAgregarEstado}>
            Agregar estado
          </button>
        ) : null}
      </div>

      {props.estados.length === 0 ? (
        <button
          type="button"
          style={style.primaryButton}
          onClick={props.onAgregarEstados}
          title="Crea simultáneamente estado1 y estado2"
        >
          Agregar estados
        </button>
      ) : (
        <div style={stateStyles.list}>
          {props.estados.map((estado) => (
            <div key={estado.id} style={stateStyles.row}>
              <input
                aria-label={`Nombre estado ${estado.nombre}`}
                style={stateStyles.input}
                value={estado.nombre}
                onInput={(event) => props.onRenombrar(estado.id, event.currentTarget.value)}
              />
              <div style={stateStyles.actions}>
                <button
                  type="button"
                  style={estado.esInicial ? stateStyles.tagActive : stateStyles.tag}
                  onClick={() => props.onDesignarInicial(estado.id)}
                  title="Designar inicial"
                >
                  Inicial
                </button>
                <button
                  type="button"
                  style={estado.esFinal ? stateStyles.tagActive : stateStyles.tag}
                  onClick={() => props.onDesignarFinal(estado.id)}
                  title="Designar final"
                >
                  Final
                </button>
                <button
                  type="button"
                  style={props.estados.length <= 2 ? stateStyles.deleteDisabled : stateStyles.delete}
                  disabled={props.estados.length <= 2}
                  onClick={() => props.onEliminar(estado.id)}
                  title={props.estados.length <= 2 ? "El axioma exige al menos dos estados" : "Eliminar estado"}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <button type="button" style={style.secondaryButton} onClick={props.onQuitarEstados}>
            Quitar estados
          </button>
        </div>
      )}
    </section>
  );
}

function PartesCompactas(props: {
  filas: FilaPlegadoParcial[];
  padreAparienciaId: string;
  onExtraer: (padreAparienciaId: string, parteEntidadId: string) => void;
}) {
  return (
    <section style={partialStyles.section} aria-label="Partes plegadas">
      <span style={style.label}>Partes</span>
      <div style={partialStyles.list}>
        {props.filas.map((fila, index) => fila.tipo === "contador" ? (
          <div key={`contador-${index}`} style={partialStyles.counter}>{fila.texto}</div>
        ) : (
          <div key={fila.entidadId} style={partialStyles.row}>
            <span style={fila.extraida ? partialStyles.nameExtracted : partialStyles.name}>{fila.nombre}</span>
            <button
              type="button"
              style={fila.extraida ? partialStyles.buttonDisabled : partialStyles.button}
              disabled={fila.extraida}
              onClick={() => props.onExtraer(props.padreAparienciaId, fila.entidadId)}
            >
              {fila.extraida ? "Extraída" : "Extraer"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export const OPCIONES_DESPLIEGUE_OBJETO: Array<{ modo: ModoDespliegueObjeto; label: string }> = [
  { modo: "agregacion", label: "Como partes (agregación)" },
  { modo: "exhibicion", label: "Como atributos (exhibición)" },
  { modo: "generalizacion", label: "Como especializaciones" },
  { modo: "clasificacion", label: "Como instancias" },
];

function DesplegarComo(props: { onSelect: (modo: ModoDespliegueObjeto) => void }) {
  return (
    <details style={style.menu}>
      <summary style={style.menuSummary}>Desplegar como...</summary>
      <div style={style.menuItems}>
        {OPCIONES_DESPLIEGUE_OBJETO.map((opcion) => (
          <button
            key={opcion.modo}
            type="button"
            style={style.menuButton}
            onClick={() => props.onSelect(opcion.modo)}
          >
            {opcion.label}
          </button>
        ))}
      </div>
    </details>
  );
}

const stateStyles = {
  section: {
    display: "grid",
    gap: "8px",
    marginBottom: "14px",
    paddingTop: "2px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  list: {
    display: "grid",
    gap: "8px",
  },
  row: {
    display: "grid",
    gap: "6px",
    padding: "8px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#ffffff",
  },
  input: {
    width: "100%",
    height: "30px",
    padding: "0 8px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    outlineColor: "#586D8C",
    fontSize: "12px",
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "6px",
  },
  smallButton: {
    minHeight: "28px",
    padding: "0 8px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  tag: {
    height: "28px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
  tagActive: {
    height: "28px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#e8eef5",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
  delete: {
    height: "28px",
    border: "1px solid #d92d20",
    borderRadius: "4px",
    background: "#fff5f5",
    color: "#b42318",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
  deleteDisabled: {
    height: "28px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f3f4f6",
    color: "#98a2b3",
    cursor: "not-allowed",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

const partialStyles = {
  section: {
    display: "grid",
    gap: "8px",
    marginBottom: "14px",
    paddingTop: "2px",
  },
  list: {
    display: "grid",
    gap: "6px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#ffffff",
  },
  name: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#1f2937",
    fontSize: "12px",
    fontWeight: 700,
  },
  nameExtracted: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#667085",
    fontSize: "12px",
    fontWeight: 700,
    fontStyle: "italic",
    textDecoration: "line-through",
  },
  counter: {
    padding: "8px",
    color: "#667085",
    fontSize: "12px",
    fontStyle: "italic",
  },
  button: {
    minHeight: "28px",
    padding: "0 8px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  buttonDisabled: {
    minHeight: "28px",
    padding: "0 8px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f3f4f6",
    color: "#98a2b3",
    cursor: "not-allowed",
    fontSize: "12px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
