import type { OpmStore } from "../../store";

export interface WelcomeScreenPort {
  pantallaInicioCerrada: OpmStore["pantallaInicioCerrada"];
  cerrarPantallaInicio: OpmStore["cerrarPantallaInicio"];
}
