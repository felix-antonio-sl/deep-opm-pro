// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { validarFirmaEnlace } from "../modelo/operaciones";
import type { Entidad, Id, Modelo, TipoEnlace } from "../modelo/tipos";
import { tokens } from "./tokens";

type DireccionFiltro = "saliente" | "entrante";

const TIPOS_MENU: Array<{ tipo: TipoEnlace; label: string }> = [
  { tipo: "agregacion", label: "Agregación" },
  { tipo: "exhibicion", label: "Exhibición" },
  { tipo: "generalizacion", label: "Generalización" },
  { tipo: "clasificacion", label: "Clasificación" },
  { tipo: "agente", label: "Agente" },
  { tipo: "instrumento", label: "Instrumento" },
  { tipo: "consumo", label: "Consumo" },
  { tipo: "resultado", label: "Resultado" },
  { tipo: "efecto", label: "Efecto" },
  { tipo: "invocacion", label: "Invocación" },
];

interface Props {
  modelo: Modelo;
  origenId: Id | null;
  destinoId: Id | null;
  direccion: DireccionFiltro;
  onDireccion: (direccion: DireccionFiltro) => void;
  onElegir: (tipo: TipoEnlace, origenId: Id, destinoId: Id) => void;
}

export function MenuTipoEnlace({ modelo, origenId, destinoId, direccion, onDireccion, onElegir }: Props) {
  const origen = origenId ? modelo.entidades[origenId] : undefined;
  const destino = destinoId ? modelo.entidades[destinoId] : undefined;
  const opciones = origen && destino ? tiposValidos(modelo, origen, destino, direccion) : [];
  return (
    <div style={style.panel} data-testid="menu-tipo-enlace">
      <div style={style.header}>
        <strong>Tipos válidos</strong>
        <div style={style.segmented} role="group" aria-label="Dirección de enlace">
          <button type="button" style={direccion === "saliente" ? style.segmentActive : style.segment} onClick={() => onDireccion("saliente")}>Salida</button>
          <button type="button" style={direccion === "entrante" ? style.segmentActive : style.segment} onClick={() => onDireccion("entrante")}>Entrada</button>
        </div>
      </div>
      {!origen || !destino ? (
        <p style={style.empty}>Selecciona dos cosas para ver firmas y preview OPL.</p>
      ) : opciones.length === 0 ? (
        <p style={style.empty}>No hay tipos válidos para esta firma.</p>
      ) : (
        <div style={style.list}>
          {opciones.map((opcion) => (
            <button
              key={opcion.tipo}
              type="button"
              style={style.item}
              data-testid={`menu-tipo-enlace-${opcion.tipo}`}
              onClick={() => onElegir(opcion.tipo, opcion.origen.id, opcion.destino.id)}
            >
              <span style={style.icon}>{iconoTipo(opcion.tipo)}</span>
              <span style={style.itemText}>
                <strong>{etiquetaTipo(opcion.tipo)}</strong>
                <small style={style.preview}>{previewOpl(opcion.tipo, opcion.origen, opcion.destino)}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function tiposValidos(modelo: Modelo, origen: Entidad, destino: Entidad, direccion: DireccionFiltro) {
  const par = direccion === "saliente"
    ? { origen, destino }
    : { origen: destino, destino: origen };
  return TIPOS_MENU.flatMap(({ tipo }) => {
    const firma = validarFirmaEnlace(tipo, par.origen, par.destino);
    if (!firma.ok) return [];
    return [{ tipo, origen: par.origen, destino: par.destino }];
  });
}

function etiquetaTipo(tipo: TipoEnlace): string {
  return TIPOS_MENU.find((item) => item.tipo === tipo)?.label ?? tipo;
}

function iconoTipo(tipo: TipoEnlace): string {
  if (tipo === "agregacion") return "A";
  if (tipo === "exhibicion") return "E";
  if (tipo === "generalizacion") return "G";
  if (tipo === "clasificacion") return "C";
  if (tipo === "agente") return "Ag";
  if (tipo === "instrumento") return "In";
  if (tipo === "consumo") return "Co";
  if (tipo === "resultado") return "R";
  if (tipo === "efecto") return "Ef";
  return "Iv";
}

function previewOpl(tipo: TipoEnlace, origen: Entidad, destino: Entidad): string {
  const o = nombreOpl(origen);
  const d = nombreOpl(destino);
  if (tipo === "consumo") return `${d} consume ${o}.`;
  if (tipo === "resultado") return `${o} genera ${d}.`;
  if (tipo === "efecto") return origen.tipo === "proceso" ? `${o} afecta ${d}.` : `${d} afecta ${o}.`;
  if (tipo === "agente") return `${o} maneja ${d}.`;
  if (tipo === "instrumento") return `${d} requiere ${o}.`;
  if (tipo === "invocacion") return `${o} invoca ${d}.`;
  if (tipo === "agregacion") return `${o} consta de ${d}.`;
  if (tipo === "exhibicion") return `${o} exhibe ${d}.`;
  if (tipo === "generalizacion") return `${d} es ${o}.`;
  return `${d} es una instancia de ${o}.`;
}

function nombreOpl(entidad: Entidad): string {
  return entidad.tipo === "proceso" ? `*${entidad.nombre}*` : `**${entidad.nombre}**`;
}

const style = {
  panel: {
    position: "fixed",
    top: "56px",
    left: "520px",
    width: "320px",
    zIndex: 25,
    display: "grid",
    gap: "8px",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menu,
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", fontSize: "13px", color: tokens.colors.textoPrimario },
  segmented: { display: "flex", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.control, overflow: "hidden" },
  segment: { border: 0, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, height: "26px", padding: "0 8px", cursor: "pointer", fontSize: "12px" },
  segmentActive: { border: 0, background: tokens.colors.acentoUiSuave, color: tokens.colors.azulAccion, height: "26px", padding: "0 8px", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  list: { display: "grid", gap: "6px" },
  item: { display: "flex", alignItems: "center", gap: "8px", width: "100%", border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md, background: tokens.colors.fondoCard, padding: "8px", textAlign: "left", cursor: "pointer" },
  icon: { display: "grid", placeItems: "center", flex: "0 0 28px", width: "28px", height: "28px", borderRadius: tokens.radii.sm, background: tokens.colors.fondoIcono, color: tokens.colors.textoControl, fontSize: "11px", fontWeight: 800 },
  itemText: { display: "grid", gap: "2px", minWidth: 0, color: tokens.colors.textoPrimario, fontSize: "13px" },
  preview: { color: tokens.colors.textoTerciario, fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  empty: { margin: 0, color: tokens.colors.textoTerciario, fontSize: "12px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
