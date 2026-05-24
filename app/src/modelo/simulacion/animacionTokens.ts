import type { Id } from "../tipos";
import type { FocoPasoSimulacion } from "./foco";

/** Decide si el render debe disparar tokens animados sobre el OPD visible. Puro. */
export function debeAnimarTokensSim(foco: FocoPasoSimulacion, opdActivoId: Id, headless: boolean): boolean {
  if (headless) return false;
  if (!foco.paso) return false;
  if (foco.paso.opdId !== opdActivoId) return false;
  return foco.enlacesInvolucradosIds.length > 0;
}

/** Enlaces por los que viaja un token en el paso activo. */
export function tokensViajeDelPaso(foco: FocoPasoSimulacion): Id[] {
  return foco.enlacesInvolucradosIds;
}
