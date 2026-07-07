// Sub-bloque plegable interno de una sección (p. ej. «Avanzado» y «Notas de
// mesa» dentro de Semántica; «Nota del modelo» en el inspector vacío). Cerrado
// por defecto: baja el volumen de Semántica sin esconder la afordancia. Marca
// `data-colapso-key` para que `abrirSeccionesDe` lo expanda al navegar (la
// quick-action «alias» enfoca un input que vive aquí dentro).
import type { ComponentChildren } from "preact";
import { inspectorStyles as style } from "../inspectorStyles";
import { useColapso } from "./useColapso";

interface Props {
  titulo: string;
  colapsoId: string;
  testid?: string;
  defaultAbierta?: boolean;
  children: ComponentChildren;
}

export function SeccionDisclosure({ titulo, colapsoId, testid, defaultAbierta = false, children }: Props) {
  const [abierta, alternar] = useColapso(colapsoId, defaultAbierta);
  const panelId = `${colapsoId}-contenido`;
  return (
    <div style={style.disclosure} data-colapso-key={colapsoId} {...(testid ? { "data-testid": testid } : {})}>
      <button
        type="button"
        style={style.disclosureBoton}
        aria-expanded={abierta}
        aria-controls={panelId}
        {...(testid ? { "data-testid": `${testid}-toggle` } : {})}
        onClick={alternar}
      >
        <span class="opm-label-uppercase" style={style.label}>{titulo}</span>
        <span style={style.disclosureChevron} aria-hidden="true">{abierta ? "▾" : "▸"}</span>
      </button>
      <div id={panelId} data-abierta={abierta ? "true" : "false"} style={abierta ? style.disclosureContenido : style.disclosureContenidoOculto}>{children}</div>
    </div>
  );
}
