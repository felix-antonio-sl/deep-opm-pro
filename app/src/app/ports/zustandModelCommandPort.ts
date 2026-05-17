import { useOpmStore } from "../../store";
import type { ModelCommandPort } from "./modelCommandPort";

export function useZustandModelCommandPort(): ModelCommandPort {
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const moverAparienciaConPuertos = useOpmStore((s) => s.moverAparienciaConPuertos);
  const actualizarPosicionSimboloEstructural = useOpmStore((s) => s.actualizarPosicionSimboloEstructural);
  const actualizarAnclajesSimboloEstructural = useOpmStore((s) => s.actualizarAnclajesSimboloEstructural);
  const cambiarModoPlegadoApariencia = useOpmStore((s) => s.cambiarModoPlegadoApariencia);
  const extraerParteDePlegado = useOpmStore((s) => s.extraerParteDePlegado);
  const actualizarVerticesEnlace = useOpmStore((s) => s.actualizarVerticesEnlace);
  const actualizarPosicionLabelEnlace = useOpmStore((s) => s.actualizarPosicionLabelEnlace);
  const crearEntidadEnCanvas = useOpmStore((s) => s.crearEntidadEnCanvas);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const iniciarConexionDesdeApariencia = useOpmStore((s) => s.iniciarConexionDesdeApariencia);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const redimensionarAparienciaEnCanvas = useOpmStore((s) => s.redimensionarAparienciaEnCanvas);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);

  return {
    cambiarOpdActivo,
    moverAparienciaConPuertos,
    actualizarPosicionSimboloEstructural,
    actualizarAnclajesSimboloEstructural,
    cambiarModoPlegadoApariencia,
    extraerParteDePlegado,
    actualizarVerticesEnlace,
    actualizarPosicionLabelEnlace,
    crearEntidadEnCanvas,
    crearEnlaceEntreEntidades,
    elegirTipoEnlace,
    iniciarConexionDesdeApariencia,
    cancelarEnlace,
    redimensionarAparienciaEnCanvas,
    renombrarEntidadDesdeOpl,
  };
}
