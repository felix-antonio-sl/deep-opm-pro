import { useMemo } from "preact/hooks";
import { nodosSueltosTaller } from "../../ui/arbol/togglesArbol";
import { useOpmStore } from "../../store";
import { useZustandDiagnosticsQueryPort } from "../ports/zustandDiagnosticsPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandOpdTreePort } from "../ports/zustandOpdTreePort";

export function useArbolOpdViewModel() {
  const { modelo, opdActivoId, cambiarOpdActivo } = useZustandOpdNavigationPort();
  // R-OPD-REF-15: la especie del modelo activo (bit persistido del índice). En un
  // apunte, el árbol proyecta la raíz «SD» como «Hoja» (display-only).
  const esApunte = useOpmStore((s) => s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true));
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
    esApunte,
    nuevoOpdSuelto,
    adoptarOpdEnSeleccion,
  };
}

export type ArbolOpdViewModel = ReturnType<typeof useArbolOpdViewModel>;
