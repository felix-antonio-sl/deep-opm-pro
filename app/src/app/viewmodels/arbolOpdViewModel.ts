import { useMemo } from "preact/hooks";
import { esOpdSuelto } from "../../modelo/opdSueltos";
import { refinaA } from "../../modelo/refinamientos";
import type { Id } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { nodosBocetos } from "./arbolOpdEstructura";
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
    solicitarDevolverOpdABocetos,
  } = useZustandOpdTreePort();
  const { listarAvisos } = useZustandDiagnosticsQueryPort();
  const avisosArbol = useMemo(() => listarAvisos({ tipo: "modelo" }), [listarAvisos]);
  // Banda «Bocetos» (R-OPD-REF-20): proyección derivada de los OPD sueltos, NO
  // especie documental ni estructura persistida. Se recomputa como el árbol.
  const sueltos = useMemo(() => nodosBocetos(modelo), [modelo]);
  const clasificacionOpds = useMemo(() => {
    const bocetos = new Set<Id>();
    const integrados = new Set<Id>();
    for (const opd of Object.values(modelo.opds)) {
      if (esOpdSuelto(modelo, opd.id)) {
        bocetos.add(opd.id);
        continue;
      }
      if (
        opd.id !== modelo.opdRaizId
        && Object.values(modelo.entidades).some((entidad) => refinaA(entidad, opd.id) !== null)
      ) {
        integrados.add(opd.id);
      }
    }
    return { bocetos, integrados };
  }, [modelo]);

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
    solicitarDevolverOpdABocetos,
    esOpdBoceto: (opdId: Id) => clasificacionOpds.bocetos.has(opdId),
    esOpdIntegrado: (opdId: Id) => clasificacionOpds.integrados.has(opdId),
  };
}

export type ArbolOpdViewModel = ReturnType<typeof useArbolOpdViewModel>;
