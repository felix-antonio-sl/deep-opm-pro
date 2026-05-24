// Canonical link assets live in assets/svg/links/{procedural,structural}.
// Runtime markers are normalized from those preview SVGs for JointJS marker
// coordinates.
//
// CANON-V3 Codex + restauracion swallowtail (2026-05-23):
//   Todos los markers reciclan los paths canonicos OPCloud y migran a ink
//   editorial `#171511` con hairline 1px. Diferenciacion por tipo:
//     - consumo/resultado: SWALLOWTAIL ink (canonico OPM/Dori §3.1 + OPCloud
//       sandbox). Ronda 28 L4 habia probado triangulo lleno pensando que con
//       paleta ink-stroke identica al cuerpo el marker tendria que cargar la
//       diferenciacion entera, pero la silueta swallowtail es ESA
//       diferenciacion: identifica de inmediato la pareja procedural canonica
//       frente al lollipop (agente/instrumento) y al rombo (invocacion). La
//       direccion del enlace (source vs target) separa consumo de resultado.
//     - efecto: swallowtail BIDIRECCIONAL ink (source+target marker), silueta
//       OPCloud effect.svg.
//     - instrumento: lollipop circulo vacio ink fill paper (○).
//     - agente: lollipop circulo lleno ink (●).
//     - invocacion: rombo vacio ink (◇), no flecha; cambio canon L4 sostenido.
//       Antes (BUG-4c1753): swallowtail blanco identico a procedurales. El
//       rombo separa semanticamente la invocacion (causalidad asincrona)
//       del consumo/resultado (causalidad sobre objetos). Esta sustitucion
//       agrega semantica, no la pierde, asi que se mantiene.
//     - excepciones temporales: polylines ink (zigzag tachadura).
//     - etiquetado / etiquetado bidireccional: polyline ink abierta.
//
// Tests asociados: proyeccion.test.ts (assertions sobre markers literales),
// composers/markers.test.ts.
import { CODEX } from "./constantes.codex";

const INK = CODEX.colores.ink;
const PAPER = CODEX.colores.paper;
const MARKER_STROKE_WIDTH = CODEX.strokes.enlace;

export const LINK_ASSETS = {
  procedural: {
    agente: {
      source: "assets/svg/links/procedural/agent.svg",
      path: "M57.5 34C61.6421 34 65 30.6421 65 26.5C65 22.3579 61.6421 19 57.5 19C53.697 19 50.5549 21.8306 50.066 25.5H13V28.5H50.2697C51.1449 31.6711 54.0505 34 57.5 34Z",
      // P3-2 ronda 4: lollipop canonico (SSOT §1.5, V-190). Stick 7px + circulo
      // r=5 centrado en (12,0). Agente = circulo LLENO ink (semantica humano /
      // controlador externo del proceso).
      marker: { type: "path", d: "M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0", fill: INK, stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    instrumento: {
      source: "assets/svg/links/procedural/instrument.svg",
      path: "M63 26.5C63 28.9854 60.9852 31 58.5 31C56.0148 31 54 28.9854 54 26.5C54 24.0146 56.0148 22 58.5 22C60.9852 22 63 24.0146 63 26.5ZM66 26.5C66 30.6421 62.6421 34 58.5 34C55.0505 34 52.1449 31.6711 51.2697 28.5H14V25.5H51.066C51.5549 21.8306 54.697 19 58.5 19C62.6421 19 66 22.3579 66 26.5Z",
      // P3-2 ronda 4: instrumento = lollipop circulo VACIO (stroke ink fill
      // paper); semantica = recurso reusable que no se consume.
      marker: { type: "path", d: "M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0", fill: PAPER, stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    consumo: {
      source: "assets/svg/links/procedural/consumption.svg",
      path: "M46.725 29L42.5404 32.9055L39.2249 36L43.5653 34.6848L63.8267 28.5449L67.2749 27.5L63.8267 26.4551L43.5653 20.3152L39.2249 19L42.5404 22.0945L46.725 26H15V29H46.725ZM49.6967 26.0378L46.8809 23.4099L60.3784 27.5L46.8809 31.5901L49.6967 28.9622L51.2632 27.5L49.6967 26.0378Z",
      // CANON-V2 + restauracion 2026-05-23: SWALLOWTAIL ink (flecha con cola
      // hendida en V), silueta canonica OPM/Dori §3.1 y OPCloud sandbox para
      // consumo/resultado. Ronda 28 L4 habia migrado a triangulo lleno para
      // resolver "consumo=resultado=efecto al mismo aspecto" bajo paleta
      // saturada, pero bajo paleta Bauhaus la silueta swallowtail es la que
      // carga el canal semantico canonico. La direccion del enlace
      // (source vs target) sigue separando consumo de resultado.
      marker: { type: "path", d: "M0,0 L10,-5 L6,0 L10,5 z", fill: INK, stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    resultado: {
      source: "assets/svg/links/procedural/result.svg",
      path: "M35.132 24L39.428 20.0881L42.8196 17L38.4208 18.3005L17.5956 24.4573L14.0684 25.5L17.5956 26.5427L38.4208 32.6995L42.8196 34L39.428 30.9116L35.132 27L67.65 27V24L35.132 24ZM32.1382 26.9788L35.0293 29.6113L21.1228 25.5L35.0293 21.3887L32.1382 24.0212L30.5142 25.5L32.1382 26.9788Z",
      // CANON-V2 + restauracion 2026-05-23: swallowtail ink simetrico al de
      // consumo. La direccion del enlace (origen / destino) en la topologia
      // source/target distingue consumo de resultado; la silueta swallowtail
      // los identifica como pareja procedural canonica frente al lollipop
      // (agente/instrumento) y al rombo (invocacion).
      marker: { type: "path", d: "M0,0 L10,-5 L6,0 L10,5 z", fill: INK, stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    efecto: {
      source: "assets/svg/links/procedural/effect.svg",
      path: "M32.7345 31.9055L28.5499 28H53.7502L49.5657 31.9055L46.2501 35L50.5906 33.6848L70.8519 27.5449L74.3002 26.5L70.8519 25.4551L50.5906 19.3152L46.2501 18L49.5657 21.0945L53.7502 25H28.5499L32.7345 21.0945L36.05 18L31.7096 19.3152L11.4482 25.4551L8 26.5L11.4482 27.5449L31.7096 33.6848L36.05 35L32.7345 31.9055ZM28.394 22.4099L25.5782 25.0378L24.0117 26.5L25.5782 27.9622L28.394 30.5901L14.8965 26.5L28.394 22.4099ZM56.7219 25.0378L53.9061 22.4099L67.4037 26.5L53.9061 30.5901L56.7219 27.9622L58.2885 26.5L56.7219 25.0378Z",
      // CANON-V2 + restauracion 2026-05-23: swallowtail BIDIRECCIONAL ink
      // (composers/enlace.ts monta el mismo marker en source+target).
      // Semantica OPM: el proceso consume Y produce el objeto en una misma
      // transicion atomica. La doble swallowtail es la silueta OPCloud
      // canonica (effect.svg).
      marker: { type: "path", d: "M0,0 L10,-5 L6,0 L10,5 z", fill: INK, stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    invocacion: {
      source: "assets/svg/links/procedural/invocation.svg",
      path: "M64.9736 24H59.5H26V27H54.0264L45.2353 32.2096L40.5264 35H46H73V32H51.4736L60.2647 26.7904L64.9736 24Z",
      arrowPath: "M25.6034 24.7689L33.172 17.7049L7.44819 25.5L33.172 33.2951L25.6034 26.2311L24.8201 25.5L25.6034 24.7689Z",
      // CANON-V2: invocacion = ROMBO vacio (◇). Cambio canon respecto del
      // swallowtail blanco viejo: el rombo separa la invocacion (causalidad
      // discreta entre procesos, posiblemente asincrona, posiblemente con
      // demora) del consumo/resultado (causalidad sobre objetos).
      marker: { type: "path", d: "M0,0 L5,5 L10,0 L5,-5 z", fill: PAPER, stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    excepcionSobretiempo: {
      source: "assets/svg/links/procedural/overtimeexception.svg",
      marker: { type: "polyline", points: "4,10 13,-10", fill: "none", stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    excepcionSubtiempo: {
      source: "assets/svg/links/procedural/underTime.svg",
      marker: { type: "polyline", points: "4,10 13,-10 8.5,0 17,0 13,10 22,-10", fill: "none", stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    excepcionSubSobretiempo: {
      source: "assets/svg/links/procedural/underOver.svg",
      marker: { type: "polyline", points: "4,10 13,-10 8.5,0 17,0 13,10 22,-10 17.5,0 32,0 28,10 37,-10", fill: "none", stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    etiquetado: {
      source: "assets/svg/links/procedural/unidirectionalRelation.svg",
      marker: { type: "polyline", points: "0,0 20,-10 0,0 20,10", fill: "none", stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
    etiquetadoBidireccional: {
      source: "assets/svg/links/procedural/bidirectionalRelation.svg",
      marker: { type: "polyline", points: "0.5,0 20,10", fill: "none", stroke: INK, strokeWidth: MARKER_STROKE_WIDTH },
    },
  },
  structural: {
    agregacion: {
      source: "assets/svg/links/structural/aggregation.svg",
      points: "55.1769,38 39.5885,11 24,38",
      markerPoints: "15,0 30,30 0,30",
    },
    exhibicion: {
      source: "assets/svg/links/structural/exhibition.svg",
      path: "M55.1769 39L39.5885 12L24 39H55.1769ZM29.1962 36L39.5885 18L49.9807 36H29.1962ZM46.5166 34L39.5884 22L32.6602 34H46.5166Z",
      markerPath: "M30 30L15 0L0 30H30ZM6 26L15 8L24 26H6ZM21 24L15 12L9 24H21Z",
    },
    generalizacion: {
      source: "assets/svg/links/structural/generalization.svg",
      path: "M39.5885 11L55.1769 38H24L39.5885 11ZM39.5885 17L29.1962 35H49.9808L39.5885 17Z",
      markerPoints: "15,0 30,30 0,30",
      // CANON-V2: triangulo VACIO (fill paper / stroke ink). Antes "white"
      // generico; ahora alineado con el paper Bauhaus.
      markerFill: PAPER,
    },
    clasificacion: {
      source: "assets/svg/links/structural/classification.svg",
      path: "M39.5885 11L55.1769 38H24L39.5885 11ZM39.5885 17L29.1962 35H49.9808L39.5885 17Z",
      markerPoints: "15,0 30,30 0,30",
      markerFill: PAPER,
      markerDot: { cx: 15, cy: 20, r: 4 },
    },
  },
  // Los abanicos logicos no tienen un asset estatico: el arco se construye
  // dinamicamente en abanicoOverlay.ts a partir de los enlaces y el dock real.
  // Ver opm-extracted shared.ts:5908-5914 (XOR=1 arco r=30, O=2 arcos r=30/35).
  logical: {
    or: { source: "assets/svg/links/logical/or.svg" },
    xor: { source: "assets/svg/links/logical/xor.svg" },
  },
} as const;
