export type MobileReviewView = "canvas" | "opds" | "opl" | "issues";

export interface MobileReviewPort {
  vistaMobileActiva: MobileReviewView;
  cambiarVistaMobile: (vista: MobileReviewView) => void;
}
