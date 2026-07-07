import type { OpmStore } from "../../store";

export interface OpdTreePort {
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
  modoOrdenArbol: OpmStore["modoOrdenArbol"];
  fijarModoOrdenArbol: OpmStore["fijarModoOrdenArbol"];
  seleccionarEntidad: OpmStore["seleccionarEntidad"];
  eliminarOpdDesdeArbol: OpmStore["eliminarOpdDesdeArbol"];
  moverHermano: OpmStore["moverHermano"];
  moverOpdEnGestion: OpmStore["moverOpdEnGestion"];
  renombrarOpdDesdeArbol: OpmStore["renombrarOpdDesdeArbol"];
  nombresArbolVisibles: OpmStore["nombresArbolVisibles"];
  toggleNombresArbolVisibles: OpmStore["toggleNombresArbolVisibles"];
  navegarOpdArriba: OpmStore["navegarOpdArriba"];
  navegarOpdAbajo: OpmStore["navegarOpdAbajo"];
  navegarOpdIzquierda: OpmStore["navegarOpdIzquierda"];
  navegarOpdDerecha: OpmStore["navegarOpdDerecha"];
  abrirVistaMapa: OpmStore["abrirVistaMapa"];
  abrirGestionArbol: OpmStore["abrirGestionArbol"];
  nuevoOpdSuelto: OpmStore["nuevoOpdSuelto"];
  adoptarOpdEnSeleccion: OpmStore["adoptarOpdEnSeleccion"];
}
