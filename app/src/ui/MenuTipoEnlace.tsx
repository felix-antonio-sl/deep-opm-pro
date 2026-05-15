// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { validarFirmaEnlace } from "../modelo/operaciones";
import type { Entidad, Id, Modelo, TipoEnlace } from "../modelo/tipos";
import { tokens } from "./tokens";

type DireccionFiltro = "saliente" | "entrante";

export const TIPOS_ENLACE_MENU: Array<{ tipo: TipoEnlace; label: string }> = [
  { tipo: "agregacion", label: "Agregación" },
  { tipo: "exhibicion", label: "Exhibición" },
  { tipo: "generalizacion", label: "Generalización" },
  { tipo: "clasificacion", label: "Clasificación" },
  { tipo: "etiquetado", label: "Etiquetado" },
  { tipo: "etiquetadoBidireccional", label: "Etiquetado bidireccional" },
  { tipo: "agente", label: "Agente" },
  { tipo: "instrumento", label: "Instrumento" },
  { tipo: "consumo", label: "Consumo" },
  { tipo: "resultado", label: "Resultado" },
  { tipo: "efecto", label: "Efecto" },
  { tipo: "invocacion", label: "Invocación" },
  { tipo: "excepcionSobretiempo", label: "Excepción sobretiempo" },
  { tipo: "excepcionSubtiempo", label: "Excepción subtiempo" },
  { tipo: "excepcionSubSobretiempo", label: "Excepción sub/sobretiempo" },
];

interface Props {
  modelo: Modelo;
  origenId: Id | null;
  destinoId: Id | null;
  direccion: DireccionFiltro;
  onDireccion: (direccion: DireccionFiltro) => void;
  onElegir: (tipo: TipoEnlace, origenId: Id, destinoId: Id) => void;
  onElegirPendiente?: (tipo: TipoEnlace) => void;
}

export function MenuTipoEnlace({ modelo, origenId, destinoId, direccion, onDireccion, onElegir, onElegirPendiente }: Props) {
  const [tipoPreview, setTipoPreview] = useState<TipoEnlace | null>(null);
  const origen = origenId ? modelo.entidades[origenId] : undefined;
  const destino = destinoId ? modelo.entidades[destinoId] : undefined;
  const opciones = origen && destino ? tiposValidos(modelo, origen, destino, direccion) : [];
  const opcionesPendientes = origen && !destino ? tiposPendientes(modelo, origen) : [];
  const opcionPreview = opciones.find((opcion) => opcion.tipo === tipoPreview) ?? opciones[0] ?? null;
  return (
    <div style={style.panel} data-testid="menu-tipo-enlace">
      <div style={style.header}>
        <strong>Tipos válidos</strong>
        <div style={style.segmented} role="group" aria-label="Dirección de enlace">
          <button type="button" style={direccion === "saliente" ? style.segmentActive : style.segment} onClick={() => onDireccion("saliente")}>Salida</button>
          <button type="button" style={direccion === "entrante" ? style.segmentActive : style.segment} onClick={() => onDireccion("entrante")}>Entrada</button>
        </div>
      </div>
      {!origen ? (
        <p style={style.empty} data-testid="menu-tipo-enlace-estado-sin-origen">Selecciona la entidad origen del enlace.</p>
      ) : !destino ? (
        <div style={style.estado} data-testid="menu-tipo-enlace-estado-sin-destino">
          <p style={style.estadoLinea}>
            <span style={style.estadoEtiqueta}>Origen</span>
            <strong style={style.estadoNombre}>{origen.nombre}</strong>
          </p>
          <p style={style.estadoHint}>Elige un tipo para entrar en modo Conectar, o selecciona otra cosa para filtrar por firma y preview OPL.</p>
          {onElegirPendiente && opcionesPendientes.length > 0 ? (
            <div style={style.list}>
              {opcionesPendientes.map((opcion) => (
                <button
                  key={opcion.tipo}
                  type="button"
                  style={style.item}
                  data-testid={`menu-tipo-enlace-${opcion.tipo}`}
                  onClick={() => onElegirPendiente(opcion.tipo)}
                >
                  <span style={style.icon}>{iconoTipo(opcion.tipo)}</span>
                  <span style={style.itemText}>
                    <strong>{etiquetaTipo(opcion.tipo)}</strong>
                    <small style={style.preview}>Luego selecciona la entidad o estado destino.</small>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : opciones.length === 0 ? (
        <div style={style.estado} data-testid="menu-tipo-enlace-estado-sin-tipos">
          <p style={style.estadoLinea}>
            <span style={style.estadoEtiqueta}>Origen</span>
            <strong style={style.estadoNombre}>{origen.nombre}</strong>
          </p>
          <p style={style.estadoLinea}>
            <span style={style.estadoEtiqueta}>Destino</span>
            <strong style={style.estadoNombre}>{destino.nombre}</strong>
          </p>
          <p style={style.estadoHint}>No hay tipos válidos para esta firma. Prueba invertir la dirección o cambiar la selección.</p>
        </div>
      ) : (
        <div style={style.list}>
          {opciones.map((opcion) => (
            <button
              key={opcion.tipo}
              type="button"
              style={opcionPreview?.tipo === opcion.tipo ? style.itemActive : style.item}
              data-testid={`menu-tipo-enlace-${opcion.tipo}`}
              onPointerEnter={() => setTipoPreview(opcion.tipo)}
              onFocus={() => setTipoPreview(opcion.tipo)}
              onClick={() => onElegir(opcion.tipo, opcion.origen.id, opcion.destino.id)}
            >
              <span style={style.icon}>{iconoTipo(opcion.tipo)}</span>
              <span style={style.itemText}>
                <strong>{etiquetaTipo(opcion.tipo)}</strong>
                <small style={style.preview}>{previewOpl(opcion.tipo, opcion.origen, opcion.destino)}</small>
              </span>
            </button>
          ))}
          {opcionPreview ? (
            <div style={style.previewBox} data-testid="menu-tipo-enlace-preview-opl">
              <span style={style.previewLabel}>Preview OPL</span>
              <strong>{previewOpl(opcionPreview.tipo, opcionPreview.origen, opcionPreview.destino)}</strong>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function tiposValidos(modelo: Modelo, origen: Entidad, destino: Entidad, direccion: DireccionFiltro) {
  const par = direccion === "saliente"
    ? { origen, destino }
    : { origen: destino, destino: origen };
  return TIPOS_ENLACE_MENU.flatMap(({ tipo }) => {
    const firma = validarFirmaEnlace(tipo, par.origen, par.destino);
    if (!firma.ok) return [];
    return [{ tipo, origen: par.origen, destino: par.destino }];
  });
}

function tiposPendientes(modelo: Modelo, origen: Entidad) {
  const destinos = Object.values(modelo.entidades).filter((entidad) => entidad.id !== origen.id);
  return TIPOS_ENLACE_MENU.filter(({ tipo }) => (
    destinos.some((destino) => validarFirmaEnlace(tipo, origen, destino).ok)
  ));
}

function etiquetaTipo(tipo: TipoEnlace): string {
  return TIPOS_ENLACE_MENU.find((item) => item.tipo === tipo)?.label ?? tipo;
}

function iconoTipo(tipo: TipoEnlace): string {
  if (tipo === "agregacion") return "A";
  if (tipo === "exhibicion") return "E";
  if (tipo === "generalizacion") return "G";
  if (tipo === "clasificacion") return "C";
  if (tipo === "etiquetado") return "Et";
  if (tipo === "etiquetadoBidireccional") return "Et2";
  if (tipo === "agente") return "Ag";
  if (tipo === "instrumento") return "In";
  if (tipo === "consumo") return "Co";
  if (tipo === "resultado") return "R";
  if (tipo === "efecto") return "Ef";
  if (tipo === "excepcionSobretiempo") return "/";
  if (tipo === "excepcionSubtiempo") return "//";
  if (tipo === "excepcionSubSobretiempo") return "///";
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
  if (tipo === "excepcionSobretiempo") return `${d} ocurre si duración de ${o} excede su duración máxima.`;
  if (tipo === "excepcionSubtiempo") return `${d} ocurre si duración de ${o} es menor que su duración mínima.`;
  if (tipo === "excepcionSubSobretiempo") return `${d} ocurre si duración de ${o} sale de su rango.`;
  if (tipo === "agregacion") return `${o} consta de ${d}.`;
  if (tipo === "exhibicion") return `${o} exhibe ${d}.`;
  if (tipo === "generalizacion") return `${d} es ${o}.`;
  if (tipo === "etiquetado") return `${o} se relaciona con ${d}.`;
  if (tipo === "etiquetadoBidireccional") return `${o} y ${d} se relacionan.`;
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
  itemActive: { display: "flex", alignItems: "center", gap: "8px", width: "100%", border: `1px solid ${tokens.colors.infoBordeSuave}`, borderRadius: tokens.radii.md, background: tokens.colors.infoFondoClaro, padding: "8px", textAlign: "left", cursor: "pointer" },
  icon: { display: "grid", placeItems: "center", flex: "0 0 28px", width: "28px", height: "28px", borderRadius: tokens.radii.sm, background: tokens.colors.fondoIcono, color: tokens.colors.textoControl, fontSize: "11px", fontWeight: 800 },
  itemText: { display: "grid", gap: "2px", minWidth: 0, color: tokens.colors.textoPrimario, fontSize: "13px" },
  preview: { color: tokens.colors.textoTerciario, fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  previewBox: { display: "grid", gap: "3px", padding: "8px", border: `1px solid ${tokens.colors.infoBordeSuave}`, borderRadius: tokens.radii.md, background: tokens.colors.azulMuySuave, color: tokens.colors.textoPrimario, fontSize: "12px" },
  previewLabel: { color: tokens.colors.infoTextoOscuro, fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0 },
  empty: { margin: 0, color: tokens.colors.textoTerciario, fontSize: "12px" },
  // P1-4 ronda 4: estado vivo del popover cuando hay seleccion parcial.
  estado: { display: "grid", gap: "6px", padding: "8px", border: `1px solid ${tokens.colors.infoBordeSuave}`, borderRadius: tokens.radii.md, background: tokens.colors.azulMuySuave, color: tokens.colors.textoPrimario, fontSize: "12px" },
  estadoLinea: { display: "flex", gap: "8px", alignItems: "baseline", margin: 0 },
  estadoEtiqueta: { color: tokens.colors.infoTextoOscuro, fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0, flex: "0 0 48px" },
  estadoNombre: { color: tokens.colors.textoPrimario, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 },
  estadoHint: { margin: "4px 0 0", color: tokens.colors.textoTerciario, fontSize: "11px", lineHeight: 1.3 },
} satisfies Record<string, preact.JSX.CSSProperties>;
