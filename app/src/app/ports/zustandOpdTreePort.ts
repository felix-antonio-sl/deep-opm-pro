import { useOpmStore } from "../../store";
import { APP_FEATURES } from "../features";
import type { OpdTreePort } from "./opdTreePort";

export function useZustandOpdTreePort(): OpdTreePort {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const modoOrdenArbol = useOpmStore((s) => s.modoOrdenArbol);
  const fijarModoOrdenArbol = useOpmStore((s) => s.fijarModoOrdenArbol);
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
  const nuevoOpdSuelto = useOpmStore((s) => s.nuevoOpdSuelto);
  const adoptarOpdEnSeleccion = useOpmStore((s) => s.adoptarOpdEnSeleccion);

  return {
    vistaMapaActiva: APP_FEATURES.mapaSistema ? vistaMapaActiva : false,
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
    abrirVistaMapa: APP_FEATURES.mapaSistema ? abrirVistaMapa : () => {},
    abrirGestionArbol,
    nuevoOpdSuelto,
    adoptarOpdEnSeleccion,
  };
}
