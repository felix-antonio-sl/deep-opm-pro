import { useRef, useState } from "preact/hooks";
import { CANON } from "../modelo/constantes";
import { useOpmStore } from "../store";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, TipoEnlace } from "../modelo/tipos";

interface DragState {
  entidadId: string;
  offsetX: number;
  offsetY: number;
}

export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const moverEntidad = useOpmStore((s) => s.moverEntidad);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const opd = modelo.opds[modelo.opdRaizId];
  const apariencias = opd ? Object.values(opd.apariencias) : [];
  const enlaces = opd ? Object.values(opd.enlaces) : [];
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      role="img"
      aria-label="OPD activo"
      style={style.canvas}
      onPointerMove={(event) => {
        if (!drag) return;
        const point = svgPoint(svgRef.current, event);
        moverEntidad(drag.entidadId, point.x - drag.offsetX, point.y - drag.offsetY);
      }}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <marker id="marker-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M 1 1 L 11 6 L 1 11 z" fill={CANON.colores.enlace} stroke={CANON.colores.enlace} />
        </marker>
        <marker id="marker-triangle-start" viewBox="0 0 30 30" refX="15" refY="15" markerWidth="18" markerHeight="18" orient="auto-start-reverse">
          <path d="M2.49,24.98 L15.33,0.76 L28.16,24.98 Z" fill={CANON.colores.enlace} stroke={CANON.colores.enlace} stroke-width="2" />
        </marker>
        <marker id="marker-agent-start" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="12" markerHeight="12" orient="auto">
          <circle cx="6" cy="6" r="4.5" fill={CANON.colores.enlace} stroke={CANON.colores.enlace} stroke-width="1.5" />
        </marker>
        <marker id="marker-instrument-start" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="12" markerHeight="12" orient="auto">
          <circle cx="6" cy="6" r="4.5" fill={CANON.colores.relleno} stroke={CANON.colores.enlace} stroke-width="1.5" />
        </marker>
      </defs>
      {enlaces.map((aparienciaEnlace) => {
        const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
        return enlace ? renderEnlace(aparienciaEnlace, enlace, aparienciaPorEntidad, modelo.entidades) : null;
      })}
      {apariencias.map((apariencia) => {
        const entidad = modelo.entidades[apariencia.entidadId];
        return entidad ? renderEntidad({
          apariencia,
          entidad,
          seleccionada: entidad.id === seleccionId,
          seleccionarEntidad,
          iniciarDrag: (event) => {
            if (modoEnlace) return;
            const point = svgPoint(svgRef.current, event);
            setDrag({
              entidadId: entidad.id,
              offsetX: point.x - apariencia.x,
              offsetY: point.y - apariencia.y,
            });
          },
        }) : null;
      })}
    </svg>
  );
}

function renderEntidad(props: {
  apariencia: Apariencia;
  entidad: Entidad;
  seleccionada: boolean;
  seleccionarEntidad: (id: string) => void;
  iniciarDrag: (event: PointerEvent) => void;
}) {
  const { apariencia, entidad, seleccionada, seleccionarEntidad, iniciarDrag } = props;
  const stroke = entidad.tipo === "objeto" ? CANON.colores.objeto : CANON.colores.proceso;
  const dash = entidad.afiliacion === "ambiental" ? "8 4" : undefined;
  const sombra = entidad.esencia === "fisica" ? "drop-shadow(1px 2px 2px rgb(0 0 0 / 0.25))" : undefined;
  const lineas = lineasLabel(entidad.nombre);
  const lineHeight = 16;
  const startY = apariencia.height / 2 - ((lineas.length - 1) * lineHeight) / 2;

  return (
    <g
      key={apariencia.id}
      transform={`translate(${apariencia.x}, ${apariencia.y})`}
      onClick={(event) => {
        event.stopPropagation();
        seleccionarEntidad(entidad.id);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        iniciarDrag(event);
      }}
      style={style.entidad}
    >
      {seleccionada ? (
        <rect
          x="-7"
          y="-7"
          width={apariencia.width + 14}
          height={apariencia.height + 14}
          rx="8"
          fill="none"
          stroke={CANON.colores.enlace}
          stroke-width="1.5"
          stroke-dasharray="4 4"
        />
      ) : null}
      {entidad.tipo === "objeto" ? (
        <rect
          width={apariencia.width}
          height={apariencia.height}
          rx="4"
          fill={CANON.colores.relleno}
          stroke={stroke}
          stroke-width="2"
          stroke-dasharray={dash}
          style={{ filter: sombra }}
        />
      ) : (
        <ellipse
          cx={apariencia.width / 2}
          cy={apariencia.height / 2}
          rx={apariencia.width / 2}
          ry={apariencia.height / 2}
          fill={CANON.colores.relleno}
          stroke={stroke}
          stroke-width="2"
          stroke-dasharray={dash}
          style={{ filter: sombra }}
        />
      )}
      <text
        x={apariencia.width / 2}
        y={startY}
        dominant-baseline="middle"
        text-anchor="middle"
        fill={CANON.colores.texto}
        font-family={CANON.dims.fontFamily}
        font-size={CANON.dims.fontSize}
        font-weight={CANON.dims.fontWeight}
      >
        {lineas.map((linea, index) => (
          <tspan key={`${index}-${linea}`} x={apariencia.width / 2} dy={index === 0 ? 0 : lineHeight}>
            {linea}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function renderEnlace(
  aparienciaEnlace: AparienciaEnlace,
  enlace: Enlace,
  aparienciaPorEntidad: Map<string, Apariencia>,
  entidades: Record<string, Entidad>,
) {
  const origen = aparienciaPorEntidad.get(enlace.origenId);
  const destino = aparienciaPorEntidad.get(enlace.destinoId);
  const entidadOrigen = entidades[enlace.origenId];
  const entidadDestino = entidades[enlace.destinoId];
  if (!origen || !destino || !entidadOrigen || !entidadDestino) return null;

  const centroOrigen = centro(origen);
  const centroDestino = centro(destino);
  const source = puntoBorde(origen, entidadOrigen, centroDestino);
  const target = puntoBorde(destino, entidadDestino, centroOrigen);
  const markers = markersPorTipo(enlace.tipo);

  return (
    <g key={aparienciaEnlace.id}>
      <line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke="transparent"
        stroke-width={CANON.dims.enlaceHitArea}
        pointer-events="stroke"
      />
      <line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke={CANON.colores.enlace}
        stroke-width={CANON.dims.enlaceVisible}
        fill="none"
        marker-start={markers.start}
        marker-end={markers.end}
      />
    </g>
  );
}

function centro(apariencia: Apariencia): { x: number; y: number } {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function puntoBorde(apariencia: Apariencia, entidad: Entidad, hacia: { x: number; y: number }): { x: number; y: number } {
  const c = centro(apariencia);
  const dx = hacia.x - c.x;
  const dy = hacia.y - c.y;
  if (dx === 0 && dy === 0) return c;

  if (entidad.tipo === "objeto") {
    const escala = Math.min(
      (apariencia.width / 2) / Math.abs(dx || Number.MIN_VALUE),
      (apariencia.height / 2) / Math.abs(dy || Number.MIN_VALUE),
    );
    return { x: c.x + dx * escala, y: c.y + dy * escala };
  }

  const rx = apariencia.width / 2;
  const ry = apariencia.height / 2;
  const escala = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));
  return { x: c.x + dx * escala, y: c.y + dy * escala };
}

function markersPorTipo(tipo: TipoEnlace): { start?: string; end?: string } {
  switch (tipo) {
    case "agregacion":
      return { start: "url(#marker-triangle-start)" };
    case "agente":
      return { start: "url(#marker-agent-start)" };
    case "instrumento":
      return { start: "url(#marker-instrument-start)" };
    case "consumo":
    case "resultado":
    case "efecto":
    case "invocacion":
      return { end: "url(#marker-arrow)" };
  }
}

function svgPoint(svg: SVGSVGElement | null, event: PointerEvent): { x: number; y: number } {
  if (!svg) return { x: event.clientX, y: event.clientY };
  const rect = svg.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function lineasLabel(texto: string): string[] {
  const palabras = texto.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [""];
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of palabras) {
    const candidata = actual ? `${actual} ${palabra}` : palabra;
    if (candidata.length <= 18 || actual.length === 0) {
      actual = candidata;
    } else {
      lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas.slice(0, 3);
}

const style = {
  canvas: {
    display: "block",
    background: "#eef3f8",
    cursor: "default",
  },
  entidad: {
    cursor: "pointer",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
