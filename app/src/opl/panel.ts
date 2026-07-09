import type { Id, Modelo } from "../modelo/tipos";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl, type BloqueOpl } from "./bloquesJerarquicos";
import { generarOplInteractivo } from "./generar";
import {
  filtrarLineasPorReferencia,
  lineaTocaReferencia,
  type OplLineaInteractiva,
  type OplReferencia,
} from "./interaccion";
import { VISIBILIDAD_OPL_DEFAULT, type VisibilidadOpl } from "./opciones";
import { planificarEdicionOplLibre, type PrevisualizacionOplReverse } from "./parser";

export interface DerivarPanelOplInput {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  enlaceSeleccionId: Id | null;
  filtroActivo: boolean;
  busquedaOpl: string;
  editorLibre: boolean;
  textoLibre: string;
  /**
   * Opciones de generación OPL. `esencia` es preferencia de display (read-only):
   * NUNCA afecta `textoOplActual`, que se genera con esencia default para
   * proteger el roundtrip (editor libre + parser). `esApunte` es RÉGIMEN
   * (excepción de apunte a R-ENT-2) y aplica a AMBOS pases: el boceto cuenta
   * lo mismo en display, editor libre y export — bisimetría sin superficies
   * divergentes.
   */
  visibilidad?: VisibilidadOpl;
}

export interface PanelOplDerivado {
  query: string;
  seleccionRef: OplReferencia | null;
  lineas: OplLineaInteractiva[];
  textoOplActual: string;
  bloques: BloqueOpl[];
  visibles: OplLineaInteractiva[];
  visiblesPorId: Set<string>;
  primeraVisibleSeleccionada: OplLineaInteractiva | null;
  previewLibre: PrevisualizacionOplReverse | null;
}

export function derivarPanelOpl(input: DerivarPanelOplInput): PanelOplDerivado {
  const seleccionRef = referenciaSeleccionada(input.seleccionId, input.enlaceSeleccionId);
  const opds = ordenarOpdsParaOpl(input.modelo);

  const visibilidad = input.visibilidad ?? VISIBILIDAD_OPL_DEFAULT;

  // Pase canónico: esencia default (protege textoOplActual y el roundtrip) +
  // el régimen (`esApunte`), que sí es parte del texto que edita el usuario.
  const visibilidadCanonica: VisibilidadOpl = { ...VISIBILIDAD_OPL_DEFAULT, esApunte: visibilidad.esApunte ?? false };
  const lineasCanonicas = opds.flatMap((id) => generarOplInteractivo(input.modelo, id, visibilidadCanonica));
  const textoOplActual = lineasCanonicas.map((linea) => linea.texto).join("\n");

  // Pase display: aplica la preferencia de esencia solo a las líneas renderizadas.
  const lineas =
    visibilidad.esencia === VISIBILIDAD_OPL_DEFAULT.esencia
      ? lineasCanonicas // mismo resultado que el canónico → reusar sin segundo pase
      : opds.flatMap((id) => generarOplInteractivo(input.modelo, id, visibilidad));

  const previewLibre = input.editorLibre
    ? planificarEdicionOplLibre(input.modelo, input.textoLibre, { opdActivoId: input.opdActivoId })
    : null;
  const bloques = agruparOracionesPorOpd(lineas, input.modelo);
  const filtradasPorSeleccion = input.filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;
  const query = input.busquedaOpl.toLowerCase().trim();
  const visibles = query
    ? filtradasPorSeleccion.filter((linea) => linea.texto.toLowerCase().includes(query))
    : filtradasPorSeleccion;
  const visiblesPorId = new Set(visibles.map((linea) => linea.id));
  const primeraVisibleSeleccionada = seleccionRef
    ? visibles.find((linea) => lineaTocaReferencia(linea, seleccionRef)) ?? null
    : null;

  return {
    query,
    seleccionRef,
    lineas,
    textoOplActual,
    bloques,
    visibles,
    visiblesPorId,
    primeraVisibleSeleccionada,
    previewLibre,
  };
}

export function referenciaSeleccionada(
  seleccionId: Id | null,
  enlaceSeleccionId: Id | null,
): OplReferencia | null {
  if (enlaceSeleccionId) return { tipo: "enlace", id: enlaceSeleccionId };
  if (seleccionId) return { tipo: "entidad", id: seleccionId };
  return null;
}
