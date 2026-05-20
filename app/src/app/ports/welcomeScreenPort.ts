/**
 * Ronda 23 L3 #7: el modal de bienvenida con 3 caminos fue reemplazado por
 * un canvas pre-cargado con el fixture "System Diagram" + banner inline
 * descartable arriba del canvas. El port expone tanto la API original
 * (cerrarPantallaInicio) como las nuevas señales:
 *
 *  - `precargarBienvenida(nombreFixture)` carga el fixture pero marca la
 *    pestaña con `cargadoDesde: "bienvenida"` para que App sepa mostrar
 *    el banner.
 *  - `pestanaActivaEsBienvenida` es el flag derivado que el banner
 *    consume directamente.
 */
export interface WelcomeScreenPort {
  pantallaInicioCerrada: boolean;
  cerrarPantallaInicio: () => void;
  pestanaActivaEsBienvenida: boolean;
  precargarBienvenida: (nombreFixture: string) => void;
}
