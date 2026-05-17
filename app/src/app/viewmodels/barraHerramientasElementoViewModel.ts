import { useOpmStore } from "../../store";

export function useBarraHerramientasElementoViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const agregarEstadoSmart = useOpmStore((s) => s.agregarEstadoSmart);
  const descomponer = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegar = useOpmStore((s) => s.desplegarSeleccionada);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const copiarEstiloEnlaceAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlaceDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const eliminarSeleccion = useOpmStore((s) => s.eliminarSeleccion);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const traerEnlacesEntreSeleccionadas = useOpmStore((s) => s.traerEnlacesEntreSeleccionadas);
  const alinearSeleccion = useOpmStore((s) => s.alinearSeleccion);
  const distribuirSeleccion = useOpmStore((s) => s.distribuirSeleccion);

  return {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    enlaceEstiloPortapapeles,
    agregarEstadoSmart,
    descomponer,
    desplegar,
    abrirModalImagen,
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
  };
}

export type BarraHerramientasElementoViewModel = ReturnType<typeof useBarraHerramientasElementoViewModel>;
