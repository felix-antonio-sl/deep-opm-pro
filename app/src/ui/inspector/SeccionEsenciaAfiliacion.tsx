// Ronda Codex v1 · L2 — re-piel a primitivas Codex (cero logica nueva).
//
// Esencia/Afiliacion pasan de toggles segmentados con background a
// `CodexInspectInline` (segmented tipografico: palabras separadas por `·`,
// activa subrayada). Las opciones siguen siendo `<button>` con el mismo nombre
// accesible ("Informacional"/"Física"/"Sistémica"/"Ambiental") para preservar
// los e2e que las localizan por rol+nombre. testIds de hints inmutables.
//
// Capa categorial F1: sección "Linealidad" (solo objetos) con el mismo idioma
// Codex; toggle entre recurso Copiable / Lineal.
import type { Afiliacion, Esencia } from "../../modelo/tipos";
import { CodexInspectSection } from "../codex/CodexInspectSection";
import { CodexInspectInline } from "../codex/CodexInspectInline";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  esencia: Esencia;
  afiliacion: Afiliacion;
  onEsencia: (value: Esencia) => void;
  onAfiliacion: (value: Afiliacion) => void;
  lineal?: boolean;
  onLineal?: (value: boolean) => void;
  mostrarLinealidad?: boolean;
}

const ESENCIAS: ReadonlyArray<Esencia> = ["informacional", "fisica"];
const AFILIACIONES: ReadonlyArray<Afiliacion> = ["sistemica", "ambiental"];

export function SeccionEsenciaAfiliacion(props: Props) {
  return (
    <>
      <CodexInspectSection label="Esencia">
        <CodexInspectInline
          options={["Informacional", "Física"]}
          active={ESENCIAS.indexOf(props.esencia)}
          onSelect={(i) => props.onEsencia(ESENCIAS[i]!)}
        />
        <p data-testid="hint-esencia" style={style.hint}>
          Informacional: datos, conceptos, ideas. Física: objetos tangibles.
        </p>
      </CodexInspectSection>
      <CodexInspectSection label="Afiliación">
        <CodexInspectInline
          options={["Sistémica", "Ambiental"]}
          active={AFILIACIONES.indexOf(props.afiliacion)}
          onSelect={(i) => props.onAfiliacion(AFILIACIONES[i]!)}
        />
        <p data-testid="hint-afiliacion" style={style.hint}>
          Sistémica: parte del sistema. Ambiental: contexto externo.
        </p>
      </CodexInspectSection>
      {props.mostrarLinealidad && props.onLineal ? (
        <CodexInspectSection label="Linealidad">
          <CodexInspectInline
            options={["Copiable", "Lineal"]}
            active={props.lineal ? 1 : 0}
            onSelect={(i) => props.onLineal!(i === 1)}
          />
          <p data-testid="hint-linealidad" style={style.hint}>
            Copiable: el recurso se reutiliza. Lineal: se consume al usarse (un solo consumidor).
          </p>
        </CodexInspectSection>
      ) : null}
    </>
  );
}
