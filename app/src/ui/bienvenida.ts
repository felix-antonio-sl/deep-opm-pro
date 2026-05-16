import type { Modelo } from "../modelo/tipos";

export function modeloTieneContenidoVisible(modelo: Modelo): boolean {
  return Object.values(modelo.opds).some((opd) => (
    Object.keys(opd.apariencias).length > 0 ||
    Object.keys(opd.enlaces).length > 0
  ));
}
