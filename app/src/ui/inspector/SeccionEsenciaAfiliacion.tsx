import type { Afiliacion, Esencia } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  esencia: Esencia;
  afiliacion: Afiliacion;
  onEsencia: (value: Esencia) => void;
  onAfiliacion: (value: Afiliacion) => void;
}

export function SeccionEsenciaAfiliacion(props: Props) {
  return (
    <>
      <div style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>Esencia</span>
        <div style={style.segmented}>
          <Segment label="Informacional" active={props.esencia === "informacional"} onClick={() => props.onEsencia("informacional")} />
          <Segment label="Física" active={props.esencia === "fisica"} onClick={() => props.onEsencia("fisica")} />
        </div>
        <p data-testid="hint-esencia" style={style.hint}>
          Informacional: datos, conceptos, ideas. Física: objetos tangibles.
        </p>
      </div>
      <div style={style.field}>
        <span class="opm-label-uppercase" style={style.label}>Afiliación</span>
        <div style={style.segmented}>
          <Segment label="Sistémica" active={props.afiliacion === "sistemica"} onClick={() => props.onAfiliacion("sistemica")} />
          <Segment label="Ambiental" active={props.afiliacion === "ambiental"} onClick={() => props.onAfiliacion("ambiental")} />
        </div>
        <p data-testid="hint-afiliacion" style={style.hint}>
          Sistémica: parte del sistema. Ambiental: contexto externo.
        </p>
      </div>
    </>
  );
}

function Segment(props: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" style={props.active ? style.segmentActive : style.segment} onClick={props.onClick}>{props.label}</button>;
}
