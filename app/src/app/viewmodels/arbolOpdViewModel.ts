import { useMemo } from "preact/hooks";
import { nodosSueltosTaller } from "../../ui/arbol/togglesArbol";
import { useZustandDiagnosticsQueryPort } from "../ports/zustandDiagnosticsPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandOpdTreePort } from "../ports/zustandOpdTreePort";

export function useArbolOpdViewModel() {
  const { modelo, opdActivoId, cambiarOpdActivo } = useZustandOpdNavigationPort();
  const {
    vistaMapaActiva,
    modoOrdenArbol,
    fijarModoOrdenArbol,
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
    nuevoOpdSuelto,
    adoptarOpdEnSeleccion,
  } = useZustandOpdTreePort();
  const { listarAvisos } = useZustandDiagnosticsQueryPort();
  const avisosArbol = useMemo(() => listarAvisos({ tipo: "modelo" }), [listarAvisos]);
  // Banda «Taller» (R-OPD-REF-20): proyección derivada de los OPD sueltos, NO
  // especie ni estructura persistida. Se recomputa del modelo, como el árbol.
  const sueltos = useMemo(() => nodosSueltosTaller(modelo), [modelo]);

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
    sueltos,
    nuevoOpdSuelto,
    adoptarOpdEnSeleccion,
  };
}

export type ArbolOpdViewModel = ReturnType<typeof useArbolOpdViewModel>;
