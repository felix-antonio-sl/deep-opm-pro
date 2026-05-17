import { useMemo } from "preact/hooks";
import { listarAvisosDiagnostico } from "../../modelo/diagnostico";
import { useOpmStore } from "../../store";

export function useArbolOpdViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const modoOrdenArbol = useOpmStore((s) => s.modoOrdenArbol);
  const fijarModoOrdenArbol = useOpmStore((s) => s.fijarModoOrdenArbol);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const eliminarOpdDesdeArbol = useOpmStore((s) => s.eliminarOpdDesdeArbol);
  const moverHermano = useOpmStore((s) => s.moverHermano);
  const moverOpdEnGestion = useOpmStore((s) => s.moverOpdEnGestion);
  const renombrarOpdDesdeArbol = useOpmStore((s) => s.renombrarOpdDesdeArbol);
  const nombresArbolVisibles = useOpmStore((s) => s.nombresArbolVisibles);
  const toggleNombresArbolVisibles = useOpmStore((s) => s.toggleNombresArbolVisibles);
  const navegarOpdArriba = useOpmStore((s) => s.navegarOpdArriba);
  const navegarOpdAbajo = useOpmStore((s) => s.navegarOpdAbajo);
  const navegarOpdIzquierda = useOpmStore((s) => s.navegarOpdIzquierda);
  const navegarOpdDerecha = useOpmStore((s) => s.navegarOpdDerecha);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const abrirGestionArbol = useOpmStore((s) => s.abrirGestionArbol);
  const avisosArbol = useMemo(() => listarAvisosDiagnostico(modelo, { tipo: "modelo" }), [modelo]);

  return {
    modelo,
    opdActivoId,
    vistaMapaActiva,
    modoOrdenArbol,
    fijarModoOrdenArbol,
    cambiarOpdActivo,
    seleccionarEntidad,
    eliminarOpdDesdeArbol,
    moverHermano,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
    nombresArbolVisibles,
    toggleNombresArbolVisibles,
    navegarOpdArriba,
    navegarOpdAbajo,
    navegarOpdIzquierda,
    navegarOpdDerecha,
    abrirVistaMapa,
    abrirGestionArbol,
    avisosArbol,
  };
}

export type ArbolOpdViewModel = ReturnType<typeof useArbolOpdViewModel>;
