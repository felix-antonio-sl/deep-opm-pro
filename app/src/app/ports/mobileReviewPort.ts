import type { OpmStore } from "../../store";

export interface MobileReviewPort {
  vistaMobileActiva: OpmStore["vistaMobileActiva"];
  cambiarVistaMobile: OpmStore["cambiarVistaMobile"];
}
