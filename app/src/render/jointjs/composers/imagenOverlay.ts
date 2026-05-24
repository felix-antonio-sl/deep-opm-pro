import { estadosDeEntidad } from "../../../modelo/operaciones";
import { tieneRefinamiento } from "../../../modelo/refinamientos";
import type { Apariencia, Entidad, Id, Modelo, ModoImagenEntidad } from "../../../modelo/tipos";
import { CODEX } from "../constantes.codex";
import type { JointCellJson } from "../proyeccionTipos";

const BADGE_SIZE = 22;

/**
 * Overlay aditivo para imágenes incrustadas de objetos.
 *
 * No modifica `composers/entidad.ts`: compone cells extra sobre la entidad
 * base y deja la imagen fuera de la semántica OPM/OPL.
 */
export function proyectarImagenesEntidad(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  modoGlobal: ModoImagenEntidad | null = null,
): JointCellJson[] {
  if (entidad.tipo !== "objeto" || !entidad.imagen) return [];
  const insignia = componerInsigniaCamara(opdId, apariencia, entidad);
  const overlay = componerImagenOverlay(modelo, opdId, apariencia, entidad, modoGlobal);
  return overlay ? [overlay, insignia] : [insignia];
}

export function componerImagenOverlay(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  modoGlobal: ModoImagenEntidad | null = null,
): JointCellJson | null {
  if (entidad.tipo !== "objeto" || !entidad.imagen || tieneRefinamiento(entidad)) return null;
  const modo = modoGlobal ?? entidad.imagen.modo;
  if (modo === "texto") return null;
  const estadosVisibles = estadosDeEntidad(modelo, entidad.id).some((estado) => !estado.suprimido);
  if (estadosVisibles) return null;

  const region = regionImagen(apariencia, modo);
  return {
    id: `${apariencia.id}-imagen-overlay`,
    type: "standard.Rectangle",
    position: { x: apariencia.x, y: apariencia.y },
    size: { width: apariencia.width, height: apariencia.height },
    markup: [
      { tagName: "rect", selector: "imageFrame" },
      { tagName: "image", selector: "imagen" },
    ],
    attrs: {
      imageFrame: {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        rx: 4,
        ry: 4,
        fill: "transparent",
        stroke: "transparent",
        pointerEvents: "none",
      },
      imagen: {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        href: entidad.imagen.url,
        xlinkHref: entidad.imagen.url,
        preserveAspectRatio: "xMidYMid slice",
        opacity: modo === "imagen-texto" ? 0.72 : 1,
        pointerEvents: "none",
        "data-testid": "entidad-imagen-overlay",
      },
    },
    opm: {
      kind: "imagen-overlay",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
    },
    z: 11,
  };
}

export function componerInsigniaCamara(opdId: Id, apariencia: Apariencia, entidad: Entidad): JointCellJson {
  return {
    id: `${apariencia.id}-imagen-insignia`,
    type: "standard.Rectangle",
    position: { x: apariencia.x + 6, y: apariencia.y + apariencia.height - BADGE_SIZE - 6 },
    size: { width: BADGE_SIZE, height: BADGE_SIZE },
    attrs: {
      body: {
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        rx: 4,
        ry: 4,
        fill: CODEX.colores.paper,
        stroke: CODEX.colores.ink,
        strokeWidth: 1,
        cursor: "pointer",
        "data-testid": "entidad-insignia-imagen",
      },
      label: {
        text: "📷",
        fill: CODEX.colores.ink,
        fontFamily: CODEX.fuentes.serif,
        fontSize: 13,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: BADGE_SIZE / 2,
        y: BADGE_SIZE / 2,
        cursor: "pointer",
        title: "Imagen",
        "data-testid": "entidad-insignia-imagen",
      },
    },
    opm: {
      kind: "imagen-insignia",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
    },
    z: 12,
  };
}

function regionImagen(apariencia: Apariencia, modo: ModoImagenEntidad): { x: number; y: number; width: number; height: number } {
  if (modo === "imagen") return { x: 4, y: 4, width: apariencia.width - 8, height: apariencia.height - 8 };
  const height = Math.max(24, Math.round(apariencia.height * 0.58));
  return { x: 4, y: 4, width: apariencia.width - 8, height };
}
