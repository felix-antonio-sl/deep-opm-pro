// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef, useState } from "preact/hooks";
import type { Entidad, Id, Modelo, TipoEnlace } from "../modelo/tipos";
import {
  evaluarTiposEnlacePermitidos,
  resumirMotivosTiposNoPermitidos,
  TIPOS_ENLACE_CANONICOS,
  tiposEnlacePermitidos,
  type EvaluacionTipoEnlace,
} from "../modelo/opcionesEnlace";
import { tokens } from "./tokens";

type DireccionFiltro = "saliente" | "entrante";

const LABELS_TIPO_ENLACE: Record<TipoEnlace, string> = {
  agregacion: "Agregación",
  exhibicion: "Exhibición",
  generalizacion: "Generalización",
  clasificacion: "Clasificación",
  etiquetado: "Etiquetado",
  etiquetadoBidireccional: "Etiquetado bidireccional",
  agente: "Agente",
  instrumento: "Instrumento",
  consumo: "Consumo",
  resultado: "Resultado",
  efecto: "Efecto",
  invocacion: "Invocación",
  excepcionSobretiempo: "Excepción sobretiempo",
  excepcionSubtiempo: "Excepción subtiempo",
  excepcionSubSobretiempo: "Excepción sub/sobretiempo",
};

export const TIPOS_ENLACE_MENU: Array<{ tipo: TipoEnlace; label: string }> = TIPOS_ENLACE_CANONICOS
  .map((tipo) => ({ tipo, label: LABELS_TIPO_ENLACE[tipo] }));

interface Props {
  modelo: Modelo;
  origenId: Id | null;
  destinoId: Id | null;
  direccion: DireccionFiltro;
  onDireccion: (direccion: DireccionFiltro) => void;
  onElegir: (tipo: TipoEnlace, origenId: Id, destinoId: Id) => void;
  onElegirPendiente?: (tipo: TipoEnlace) => void;
  anchor?: { left: number; top: number };
  titulo?: string;
  autoFocusFirstOption?: boolean;
}

export function MenuTipoEnlace({ modelo, origenId, destinoId, direccion, onDireccion, onElegir, onElegirPendiente, anchor, titulo, autoFocusFirstOption }: Props) {
  const [tipoPreview, setTipoPreview] = useState<TipoEnlace | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const origen = origenId ? modelo.entidades[origenId] : undefined;
  const destino = destinoId ? modelo.entidades[destinoId] : undefined;
  const evaluaciones = origen && destino ? evaluarTiposEnlacePermitidos(modelo, origen.id, destino.id, direccion) : [];
  const opciones = tiposValidos(evaluaciones);
  const opcionesPendientes = origen && !destino ? tiposPendientes(modelo, origen) : [];
  const opcionPreview = opciones.find((opcion) => opcion.tipo === tipoPreview) ?? opciones[0] ?? null;
  const totalNoAplican = evaluaciones.filter((evaluacion) => !evaluacion.permitido).length;
  const motivosNoAplican = resumirMotivosTiposNoPermitidos(evaluaciones);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.addEventListener("keydown", navegarOpcionesMenu, true);
    return () => panel.removeEventListener("keydown", navegarOpcionesMenu, true);
  }, []);

  useEffect(() => {
    if (!autoFocusFirstOption) return;
    const frame = requestAnimationFrame(() => {
      botonesOpcion(panelRef.current)[0]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [autoFocusFirstOption, direccion, origenId, destinoId]);

  return (
    <div
      ref={panelRef}
      style={anchor ? { ...style.panel, left: `${anchor.left}px`, top: `${anchor.top}px` } : style.panel}
      data-testid="menu-tipo-enlace"
      data-ifml-stereotype="Modeless"
      data-ifml-modal="false"
      data-ifml-pattern="DE-DLKP"
      data-atajos-local="true"
    >
      <div style={style.header}>
        <strong>{titulo ?? tituloPorDefecto(origen, destino)}</strong>
        <div style={style.segmented} role="group" aria-label="Dirección de enlace">
          <button type="button" style={direccion === "saliente" ? style.segmentActive : style.segment} onClick={() => onDireccion("saliente")}>Salida</button>
          <button type="button" style={direccion === "entrante" ? style.segmentActive : style.segment} onClick={() => onDireccion("entrante")}>Entrada</button>
        </div>
      </div>
      {!origen ? (
        <p style={style.empty} data-testid="menu-tipo-enlace-estado-sin-origen">Selecciona la cosa origen del enlace.</p>
      ) : !destino ? (
        <div style={style.estado} data-testid="menu-tipo-enlace-estado-sin-destino">
          <p style={style.estadoLinea}>
            <span style={style.estadoEtiqueta}>Origen</span>
            <strong style={style.estadoNombre}>{origen.nombre}</strong>
          </p>
          <p style={style.estadoHint}>Elige un tipo para entrar en modo Conectar, o selecciona otra cosa para filtrar por firma y previsualizar OPL.</p>
          {onElegirPendiente && opcionesPendientes.length > 0 ? (
            <div style={style.list}>
              {opcionesPendientes.map((opcion) => (
                <button
                  key={opcion.tipo}
                  type="button"
                  style={style.item}
                  data-testid={`menu-tipo-enlace-${opcion.tipo}`}
                  data-menu-tipo-enlace-option="true"
                  onClick={() => onElegirPendiente(opcion.tipo)}
                >
                  <span style={style.icon}>{iconoTipo(opcion.tipo)}</span>
                  <span style={style.itemText}>
                    <strong>{etiquetaTipo(opcion.tipo)}</strong>
                    <small style={style.preview}>Luego selecciona la cosa o estado destino.</small>
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
          {motivosNoAplican ? (
            <p style={style.estadoMotivo} data-testid="menu-tipo-enlace-motivos">{motivosNoAplican}</p>
          ) : null}
        </div>
      ) : (
        <div style={style.list}>
          {totalNoAplican > 0 ? (
            <p
              style={style.filteredHint}
              data-testid="menu-tipo-enlace-filtrado"
              title={motivosNoAplican}
              aria-label={motivosNoAplican ? `Tipos filtrados: ${motivosNoAplican}` : undefined}
            >
              {totalNoAplican} {totalNoAplican === 1 ? "tipo no aplica" : "tipos no aplican"} entre {origen.tipo} y {destino.tipo}
            </p>
          ) : null}
          {opciones.map((opcion) => (
            <button
              key={opcion.tipo}
              type="button"
              style={opcionPreview?.tipo === opcion.tipo ? style.itemActive : style.item}
              data-testid={`menu-tipo-enlace-${opcion.tipo}`}
              data-menu-tipo-enlace-option="true"
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
              <span style={style.previewLabel}>Previsualización OPL</span>
              <strong>{previewOpl(opcionPreview.tipo, opcionPreview.origen, opcionPreview.destino)}</strong>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function navegarOpcionesMenu(event: KeyboardEvent): void {
  const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const target = event.target instanceof HTMLElement ? event.target : null;
  const panel = target?.closest<HTMLElement>('[data-testid="menu-tipo-enlace"]')
    ?? (event.currentTarget instanceof HTMLElement ? event.currentTarget : null);
  const opciones = botonesOpcion(panel);
  if (opciones.length === 0) return;
  event.preventDefault();
  event.stopPropagation();
  const activo = document.activeElement instanceof HTMLButtonElement ? opciones.indexOf(document.activeElement) : -1;
  const siguiente = indiceSiguienteOpcion(event.key, activo, opciones.length);
  opciones[siguiente]?.focus();
}

function botonesOpcion(panel: HTMLElement | null): HTMLButtonElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLButtonElement>('button[data-menu-tipo-enlace-option="true"]'));
}

function indiceSiguienteOpcion(key: string, actual: number, total: number): number {
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  if (key === "ArrowUp") return actual <= 0 ? total - 1 : actual - 1;
  return actual < 0 || actual >= total - 1 ? 0 : actual + 1;
}

function tituloPorDefecto(origen: Entidad | undefined, destino: Entidad | undefined): string {
  if (origen && destino) return `Conectar ${origen.nombre} → ${destino.nombre}`;
  if (origen) return `Conectar ${origen.nombre} → destino`;
  return "Conectar cosas";
}

function tiposValidos(evaluaciones: EvaluacionTipoEnlace[]) {
  return evaluaciones.flatMap((evaluacion) => {
    if (!evaluacion.permitido || !evaluacion.origen || !evaluacion.destino) return [];
    return [{ tipo: evaluacion.tipo, origen: evaluacion.origen, destino: evaluacion.destino }];
  });
}

function tiposPendientes(modelo: Modelo, origen: Entidad) {
  const destinos = Object.values(modelo.entidades).filter((entidad) => entidad.id !== origen.id);
  return TIPOS_ENLACE_MENU.filter(({ tipo }) => (
    destinos.some((destino) => tiposEnlacePermitidos(modelo, origen.id, destino.id, "saliente", [tipo]).includes(tipo))
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

/**
 * Estilos del MenuTipoEnlace — Ronda 28 L2 (Bauhaus monocromática).
 *
 *   - Panel: borde 1.5px ink, sin sombra offset, padding 12px.
 *   - Segmented Salida/Entrada: borde 1px ink, activo = ink04 + inset
 *     accent cinabrio (no azul).
 *   - Items: borde 1px ink-15, hover ink-04 (vía menus.css). Sin radius.
 *   - PreviewBox: borde 1.5px ink, fondo ink-04 — el highlight informativo
 *     se logra con peso tipográfico, no con tinte azul.
 */
const style = {
  panel: {
    position: "fixed",
    top: "56px",
    left: "520px",
    width: "320px",
    zIndex: 25,
    display: "grid",
    gap: "10px",
    padding: "12px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: "none",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", fontSize: `${tokens.typography.sizes.base}px`, color: tokens.colors.ink, fontWeight: tokens.typography.weights.semibold },
  segmented: { display: "flex", border: `1px solid ${tokens.colors.ink}`, overflow: "hidden" },
  segment: { border: 0, background: tokens.colors.paper, color: tokens.colors.ink70, height: "26px", padding: "0 10px", cursor: "pointer", fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.sm}px`, fontWeight: tokens.typography.weights.medium, textTransform: "uppercase", letterSpacing: "0.04em" },
  segmentActive: { border: 0, background: tokens.colors.ink04, color: tokens.colors.ink, height: "26px", padding: "0 10px", cursor: "pointer", fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.sm}px`, fontWeight: tokens.typography.weights.semibold, textTransform: "uppercase", letterSpacing: "0.04em", boxShadow: `inset 0 -2px 0 0 ${tokens.colors.accent}` },
  list: { display: "grid", gap: "4px" },
  item: { display: "flex", alignItems: "center", gap: "10px", width: "100%", border: `1px solid ${tokens.colors.ink15}`, background: tokens.colors.paper, padding: "8px 10px", textAlign: "left", cursor: "pointer", fontFamily: tokens.typography.fontFamily, transition: "background 150ms ease-out" },
  itemActive: { display: "flex", alignItems: "center", gap: "10px", width: "100%", border: `1px solid ${tokens.colors.ink}`, background: tokens.colors.ink04, padding: "8px 10px", textAlign: "left", cursor: "pointer", fontFamily: tokens.typography.fontFamily },
  icon: { display: "grid", placeItems: "center", flex: "0 0 26px", width: "26px", height: "26px", border: `1px solid ${tokens.colors.ink15}`, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.fontFamilyMono, fontSize: `${tokens.typography.sizes.xs}px`, fontWeight: tokens.typography.weights.medium },
  itemText: { display: "grid", gap: "2px", minWidth: 0, color: tokens.colors.ink, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.base}px` },
  preview: { color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.xs}px`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  filteredHint: { margin: "0 0 2px", color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.sm}px`, fontWeight: tokens.typography.weights.medium, textTransform: "uppercase", letterSpacing: "0.06em" },
  previewBox: { display: "grid", gap: "4px", padding: "8px 10px", border: `1.5px solid ${tokens.colors.ink}`, background: tokens.colors.ink04, color: tokens.colors.ink, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.sm}px` },
  previewLabel: { color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.xxs}px`, fontWeight: tokens.typography.weights.medium, textTransform: "uppercase", letterSpacing: "0.08em" },
  empty: { margin: 0, color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.sm}px` },
  estado: { display: "grid", gap: "6px", padding: "10px", border: `1.5px solid ${tokens.colors.ink}`, background: tokens.colors.ink04, color: tokens.colors.ink, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.sm}px` },
  estadoLinea: { display: "flex", gap: "8px", alignItems: "baseline", margin: 0 },
  estadoEtiqueta: { color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.xxs}px`, fontWeight: tokens.typography.weights.medium, textTransform: "uppercase", letterSpacing: "0.08em", flex: "0 0 56px" },
  estadoNombre: { color: tokens.colors.ink, fontSize: `${tokens.typography.sizes.base}px`, fontWeight: tokens.typography.weights.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 },
  estadoHint: { margin: "4px 0 0", color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.xs}px`, lineHeight: 1.4 },
  estadoMotivo: { margin: 0, color: tokens.colors.ink70, fontSize: `${tokens.typography.sizes.xs}px`, lineHeight: 1.4 },
} satisfies Record<string, preact.JSX.CSSProperties>;
