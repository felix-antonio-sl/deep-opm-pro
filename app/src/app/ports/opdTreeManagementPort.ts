import type { OpmStore } from "../../store";

export interface OpdTreeManagementPort {
  abierta: OpmStore["gestionArbolAbierta"];
  modelo: OpmStore["modelo"];
  busqueda: OpmStore["busquedaOpdGestion"];
  cerrar: OpmStore["cerrarGestionArbol"];
  fijarBusqueda: OpmStore["fijarBusquedaOpdGestion"];
  moverOpdEnGestion: OpmStore["moverOpdEnGestion"];
  renombrarOpdDesdeArbol: OpmStore["renombrarOpdDesdeArbol"];
}
