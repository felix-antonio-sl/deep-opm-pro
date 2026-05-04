import { modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import type { Entidad, ModoDespliegueObjeto } from "../modelo/tipos";
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
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);

  const aparienciaActiva = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === entidad.id);
  const partesPlegables = partesDePlegado(modelo, entidad.id);
  const modoPlegado = aparienciaActiva ? modoPlegadoApariencia(aparienciaActiva) : "completo";

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
