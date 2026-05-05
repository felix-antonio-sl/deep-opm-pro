// Canonical link assets live in assets/svg/links/{procedural,structural}.
// Runtime markers are normalized from those preview SVGs for JointJS marker coordinates.
export const LINK_ASSETS = {
  procedural: {
    agente: {
      source: "assets/svg/links/procedural/agent.svg",
      path: "M57.5 34C61.6421 34 65 30.6421 65 26.5C65 22.3579 61.6421 19 57.5 19C53.697 19 50.5549 21.8306 50.066 25.5H13V28.5H50.2697C51.1449 31.6711 54.0505 34 57.5 34Z",
      marker: { type: "circle", r: 5, cx: 5, fill: "#586D8C", stroke: "#586D8C" },
    },
    instrumento: {
      source: "assets/svg/links/procedural/instrument.svg",
      path: "M63 26.5C63 28.9854 60.9852 31 58.5 31C56.0148 31 54 28.9854 54 26.5C54 24.0146 56.0148 22 58.5 22C60.9852 22 63 24.0146 63 26.5ZM66 26.5C66 30.6421 62.6421 34 58.5 34C55.0505 34 52.1449 31.6711 51.2697 28.5H14V25.5H51.066C51.5549 21.8306 54.697 19 58.5 19C62.6421 19 66 22.3579 66 26.5Z",
      marker: { type: "circle", r: 5, cx: 5, fill: "white", stroke: "#586D8C", strokeWidth: 2 },
    },
    consumo: {
      source: "assets/svg/links/procedural/consumption.svg",
      path: "M46.725 29L42.5404 32.9055L39.2249 36L43.5653 34.6848L63.8267 28.5449L67.2749 27.5L63.8267 26.4551L43.5653 20.3152L39.2249 19L42.5404 22.0945L46.725 26H15V29H46.725ZM49.6967 26.0378L46.8809 23.4099L60.3784 27.5L46.8809 31.5901L49.6967 28.9622L51.2632 27.5L49.6967 26.0378Z",
      marker: { type: "path", d: "M0,0 L23,8 L12,0 L23,-8 L0,0", fill: "white", stroke: "#586D8C", strokeWidth: 2 },
    },
    resultado: {
      source: "assets/svg/links/procedural/result.svg",
      path: "M35.132 24L39.428 20.0881L42.8196 17L38.4208 18.3005L17.5956 24.4573L14.0684 25.5L17.5956 26.5427L38.4208 32.6995L42.8196 34L39.428 30.9116L35.132 27L67.65 27V24L35.132 24ZM32.1382 26.9788L35.0293 29.6113L21.1228 25.5L35.0293 21.3887L32.1382 24.0212L30.5142 25.5L32.1382 26.9788Z",
      marker: { type: "path", d: "M0,0 L23,8 L12,0 L23,-8 L0,0", fill: "white", stroke: "#586D8C", strokeWidth: 2 },
    },
    efecto: {
      source: "assets/svg/links/procedural/effect.svg",
      path: "M32.7345 31.9055L28.5499 28H53.7502L49.5657 31.9055L46.2501 35L50.5906 33.6848L70.8519 27.5449L74.3002 26.5L70.8519 25.4551L50.5906 19.3152L46.2501 18L49.5657 21.0945L53.7502 25H28.5499L32.7345 21.0945L36.05 18L31.7096 19.3152L11.4482 25.4551L8 26.5L11.4482 27.5449L31.7096 33.6848L36.05 35L32.7345 31.9055ZM28.394 22.4099L25.5782 25.0378L24.0117 26.5L25.5782 27.9622L28.394 30.5901L14.8965 26.5L28.394 22.4099ZM56.7219 25.0378L53.9061 22.4099L67.4037 26.5L53.9061 30.5901L56.7219 27.9622L58.2885 26.5L56.7219 25.0378Z",
      marker: { type: "path", d: "M0,0 L23,8 L12,0 L23,-8 L0,0", fill: "white", stroke: "#586D8C", strokeWidth: 2 },
    },
    invocacion: {
      source: "assets/svg/links/procedural/invocation.svg",
      path: "M64.9736 24H59.5H26V27H54.0264L45.2353 32.2096L40.5264 35H46H73V32H51.4736L60.2647 26.7904L64.9736 24Z",
      arrowPath: "M25.6034 24.7689L33.172 17.7049L7.44819 25.5L33.172 33.2951L25.6034 26.2311L24.8201 25.5L25.6034 24.7689Z",
      marker: { type: "polygon", points: "0,0 23,8 12,0 23,-8 0,0 ", fill: "white", stroke: "#586D8C", strokeWidth: 2 },
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
      markerFill: "white",
    },
    clasificacion: {
      source: "assets/svg/links/structural/classification.svg",
      path: "M39.5885 11L55.1769 38H24L39.5885 11ZM39.5885 17L29.1962 35H49.9808L39.5885 17Z",
      markerPoints: "15,0 30,30 0,30",
      markerFill: "white",
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
