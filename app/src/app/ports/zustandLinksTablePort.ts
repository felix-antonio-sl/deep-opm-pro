import { useOpmStore } from "../../store";
import type { LinksTableEditPort, LinksTablePort } from "./linksTablePort";

export function useZustandLinksTablePort(): LinksTablePort {
  const abrir = useOpmStore((s) => s.abrirTablaEnlaces);
  const abierta = useOpmStore((s) => s.tablaEnlacesAbierta);
  const cerrar = useOpmStore((s) => s.cerrarTablaEnlaces);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const filtroTipo = useOpmStore((s) => s.tablaEnlacesFiltroTipo);
  const fijarFiltroTipo = useOpmStore((s) => s.fijarFiltroTablaEnlaces);
  const ordenColumna = useOpmStore((s) => s.tablaEnlacesOrdenColumna);
  const ordenDireccion = useOpmStore((s) => s.tablaEnlacesOrdenDireccion);
  const fijarOrden = useOpmStore((s) => s.fijarOrdenTablaEnlaces);
  const navegar = useOpmStore((s) => s.navegarAEnlaceDesdeTabla);
  const irAExtremo = useOpmStore((s) => s.irAExtremoEnlaceTabla);
  const eliminarEnlace = useOpmStore((s) => s.eliminarEnlaceDesdeTabla);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const resaltarTemporalmente = useOpmStore((s) => s.resaltarTemporalmente);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);

  return {
    abrir,
    abierta,
    cerrar,
    modelo,
    opdActivoId,
    filtroTipo,
    fijarFiltroTipo,
    ordenColumna,
    ordenDireccion,
    fijarOrden,
    navegar,
    irAExtremo,
    eliminarEnlace,
    cambiarOpdActivo,
    resaltarTemporalmente,
    enlaceSeleccionId,
  };
}

export function useZustandLinksTableEditPort(): LinksTableEditPort {
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const renombrarEtiquetaSeleccionada = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const fijarMultiplicidad = useOpmStore((s) => s.fijarMultiplicidadEnlace);

  return {
    renombrarEtiqueta: (enlaceId, etiqueta) => {
      if (enlaceSeleccionId !== enlaceId) {
        seleccionarEnlace(enlaceId);
      }
      renombrarEtiquetaSeleccionada(etiqueta);
    },
    fijarMultiplicidad,
  };
}
