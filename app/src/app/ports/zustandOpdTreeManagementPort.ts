import { useOpmStore } from "../../store";
import type { OpdTreeManagementPort } from "./opdTreeManagementPort";

export function useZustandOpdTreeManagementPort(): OpdTreeManagementPort {
  const abierta = useOpmStore((s) => s.gestionArbolAbierta);
  const modelo = useOpmStore((s) => s.modelo);
  const busqueda = useOpmStore((s) => s.busquedaOpdGestion);
  const cerrar = useOpmStore((s) => s.cerrarGestionArbol);
  const fijarBusqueda = useOpmStore((s) => s.fijarBusquedaOpdGestion);
  const moverOpdEnGestion = useOpmStore((s) => s.moverOpdEnGestion);
  const renombrarOpdDesdeArbol = useOpmStore((s) => s.renombrarOpdDesdeArbol);

  return {
    abierta,
    modelo,
    busqueda,
    cerrar,
    fijarBusqueda,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
  };
}
