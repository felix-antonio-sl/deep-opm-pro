import type { dia } from "jointjs";
import { ZOOM_MAX, ZOOM_MIN } from "./helpers";

/**
 * Gestos táctiles del canvas en MODO LECTURA (shell mobile-readonly):
 *  - un dedo arrastra ⇒ pan (el pan del canvas infinito ES scroll DOM del
 *    viewport; JointJS captura los touch y mata el scroll nativo, así que se
 *    traduce a mano);
 *  - dos dedos ⇒ pinch-zoom anclado al punto medio inicial (mismo motor que
 *    Ctrl+rueda: `scaleUniformAtPoint`).
 * Solo se cablea en readonly: en edición un dedo arrastra elementos.
 * Reporte origen: en iPhone no se podía hacer zoom ni desplazar el canvas.
 */

export interface PuntoToque {
  x: number;
  y: number;
}

/** Umbral en px para distinguir tap (selección) de arrastre (pan). */
const UMBRAL_PAN_PX = 6;

export function distanciaToques(a: PuntoToque, b: PuntoToque): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function puntoMedioToques(a: PuntoToque, b: PuntoToque): PuntoToque {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function superaUmbralPan(inicio: PuntoToque, actual: PuntoToque): boolean {
  return distanciaToques(inicio, actual) > UMBRAL_PAN_PX;
}

/** Escala = inicial × (separación actual / separación inicial), acotada a los límites del canvas. */
export function calcularZoomPinch(escalaInicial: number, distInicial: number, distActual: number): number {
  if (distInicial <= 0) return escalaInicial;
  const escala = escalaInicial * (distActual / distInicial);
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, escala));
}

/** El contenido sigue al dedo: scroll = inicial + (inicio − actual). */
export function calcularScrollPan(
  scrollInicial: { left: number; top: number },
  toqueInicial: PuntoToque,
  toqueActual: PuntoToque,
): { left: number; top: number } {
  return {
    left: scrollInicial.left + (toqueInicial.x - toqueActual.x),
    top: scrollInicial.top + (toqueInicial.y - toqueActual.y),
  };
}

interface PaperZoomable {
  scale(): { sx?: number; sy?: number };
  scale(sx: number, sy?: number): void;
  scaleUniformAtPoint?: (scale: number, point: PuntoToque) => void;
  clientToLocalPoint?: (x: number, y: number) => PuntoToque;
  wakeUp?: () => void;
  checkViewport?: () => void;
}

export function cablearGestosTouchLectura(args: {
  host: HTMLElement;
  viewport: HTMLElement | null | undefined;
  paperRef: { current: dia.Paper | null | undefined };
}): () => void {
  let panInicio: PuntoToque | null = null;
  let scrollInicio = { left: 0, top: 0 };
  let panActivo = false;
  let pinchDistInicial = 0;
  let pinchEscalaInicial = 1;
  let pinchAnclaLocal: PuntoToque | null = null;

  const toque = (touch: Touch): PuntoToque => ({ x: touch.clientX, y: touch.clientY });

  const alEmpezar = (event: TouchEvent) => {
    const paper = args.paperRef.current as unknown as PaperZoomable | null;
    if (event.touches.length === 2 && paper) {
      const [a, b] = [toque(event.touches[0]!), toque(event.touches[1]!)];
      pinchDistInicial = distanciaToques(a, b);
      pinchEscalaInicial = paper.scale().sx ?? paper.scale().sy ?? 1;
      const medio = puntoMedioToques(a, b);
      pinchAnclaLocal = paper.clientToLocalPoint?.(medio.x, medio.y) ?? null;
      panInicio = null;
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1) {
      panInicio = toque(event.touches[0]!);
      panActivo = false;
      const viewport = args.viewport;
      scrollInicio = viewport
        ? { left: viewport.scrollLeft, top: viewport.scrollTop }
        : { left: 0, top: 0 };
    }
  };

  const alMover = (event: TouchEvent) => {
    const paper = args.paperRef.current as unknown as PaperZoomable | null;
    if (event.touches.length === 2 && paper && pinchDistInicial > 0) {
      const [a, b] = [toque(event.touches[0]!), toque(event.touches[1]!)];
      const escala = calcularZoomPinch(pinchEscalaInicial, pinchDistInicial, distanciaToques(a, b));
      if (pinchAnclaLocal && typeof paper.scaleUniformAtPoint === "function") {
        paper.scaleUniformAtPoint(escala, pinchAnclaLocal);
      } else {
        paper.scale(escala, escala);
      }
      paper.wakeUp?.();
      paper.checkViewport?.();
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && panInicio) {
      const actual = toque(event.touches[0]!);
      if (!panActivo && !superaUmbralPan(panInicio, actual)) return;
      panActivo = true;
      const viewport = args.viewport;
      if (viewport) {
        const destino = calcularScrollPan(scrollInicio, panInicio, actual);
        viewport.scrollTo({ left: destino.left, top: destino.top, behavior: "auto" });
      }
      event.preventDefault();
    }
  };

  const alTerminar = (event: TouchEvent) => {
    if (event.touches.length < 2) {
      pinchDistInicial = 0;
      pinchAnclaLocal = null;
    }
    if (event.touches.length === 0) {
      panInicio = null;
      panActivo = false;
    }
  };

  // passive:false — el pan/pinch DEBEN poder prevenir el scroll/bounce nativo.
  args.host.addEventListener("touchstart", alEmpezar, { passive: false });
  args.host.addEventListener("touchmove", alMover, { passive: false });
  args.host.addEventListener("touchend", alTerminar);
  args.host.addEventListener("touchcancel", alTerminar);
  return () => {
    args.host.removeEventListener("touchstart", alEmpezar);
    args.host.removeEventListener("touchmove", alMover);
    args.host.removeEventListener("touchend", alTerminar);
    args.host.removeEventListener("touchcancel", alTerminar);
  };
}
