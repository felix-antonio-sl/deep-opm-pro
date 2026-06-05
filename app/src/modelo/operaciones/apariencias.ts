import { contenedorRefinamiento, encajarAparienciaEnContorno, encajarCajaAparienciaEnContorno } from "../layout";
import { CANON } from "../constantes";
import { formatearNombreCompuesto } from "../objetoMetadata";
import { mismosAnclajesSimbolo, normalizarAnclajesSimbolo } from "../simboloEstructural";
import type { AnclajesSimboloEstructural, Apariencia, Id, Modelo, Posicion, PosicionLabelEnlace, Resultado } from "../tipos";
import { RESIZE_MIN, clampValor } from "../../canvas/grid";
import { aparienciaEsInternaDeRefinamiento } from "../contextoRefinamiento";
import { fallo, ok } from "./helpers";
import { refrescarEnlacesExternosDerivados } from "./refinamiento";

/**
 * Operaciones de apariencias en el OPD activo: mover una apariencia (con
 * arrastre del contorno cuando es contenedor de refinamiento, clamp al
 * bbox cuando es interna), actualizar vértices manuales de un enlace.
 *
 * Refs: HU-12.020 (restricción interior), HU-12.008/.010 (contenedor + externos).
 */

export function moverApariencia(modelo: Modelo, opdId: Id, entidadId: Id, posicion: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = Object.values(opd.apariencias).find((item) => item.entidadId === entidadId);
  if (!apariencia) return fallo(`Apariencia no existe para entidad: ${entidadId}`);

  return moverAparienciaPorId(modelo, opdId, apariencia.id, posicion);
}

export function moverAparienciaPorId(modelo: Modelo, opdId: Id, aparienciaId: Id, posicion: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  if (apariencia.x === posicion.x && apariencia.y === posicion.y) return ok(modelo);

  const contorno = contenedorRefinamiento(modelo, opdId);
  const esContorno = contorno !== null && contorno.id === aparienciaId;

  let nuevasApariencias: Record<Id, Apariencia>;
  if (esContorno) {
    // Mover contorno arrastra a las apariencias internas (creadas dentro de
    // este OPD: subprocesos, partes refinadoras, objetos internos). Las
    // apariencias fuera del contorno (externos proxy o contexto visual del
    // OPD hijo) deben mantener su posicion absoluta.
    const dx = posicion.x - apariencia.x;
    const dy = posicion.y - apariencia.y;
    nuevasApariencias = {};
    for (const [id, ap] of Object.entries(opd.apariencias)) {
      if (id === aparienciaId) {
        nuevasApariencias[id] = { ...ap, x: posicion.x, y: posicion.y };
        continue;
      }
      nuevasApariencias[id] = aparienciaEsInternaDeRefinamiento(modelo, opdId, ap)
        ? { ...ap, x: ap.x + dx, y: ap.y + dy }
        : ap;
    }
  } else if (contorno && aparienciaEsInternaDeRefinamiento(modelo, opdId, apariencia)) {
    // Apariencia interna: clamp al bbox del contorno (HU-12.020 restriccion
    // interior). Padding coherente con restrictTranslate del paper. Las
    // apariencias fuera del contorno NO se clampean (caen en la rama "else"
    // de abajo) porque por diseno viven libres alrededor del bbox.
    const encajada = encajarAparienciaEnContorno({ ...apariencia, ...posicion }, contorno);
    nuevasApariencias = {
      ...opd.apariencias,
      [apariencia.id]: { ...apariencia, x: encajada.x, y: encajada.y },
    };
  } else {
    // OPD raiz, sin refinable o cosa contextual fuera del contorno:
    // comportamiento sin restriccion.
    nuevasApariencias = {
      ...opd.apariencias,
      [apariencia.id]: { ...apariencia, x: posicion.x, y: posicion.y },
    };
  }

  const movido: Modelo = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: nuevasApariencias,
      },
    },
  };

  return refrescarEnlacesExternosDerivados(movido, opdId);
}

export function redimensionarApariencia(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
  width: number,
  height: number,
  posicion?: Posicion,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return fallo("Tamaño inválido");

  const contorno = contenedorRefinamiento(modelo, opdId);
  const cajaSolicitada = {
    x: Math.round(posicion?.x ?? apariencia.x),
    y: Math.round(posicion?.y ?? apariencia.y),
    width: Math.round(Math.max(RESIZE_MIN.width, width)),
    height: Math.round(Math.max(RESIZE_MIN.height, height)),
  };
  const caja = contorno && contorno.id !== aparienciaId && aparienciaEsInternaDeRefinamiento(modelo, opdId, apariencia)
    ? encajarCajaAparienciaEnContorno(cajaSolicitada, contorno)
    : cajaSolicitada;
  const siguienteWidth = caja.width;
  const siguienteHeight = caja.height;
  const siguienteX = caja.x;
  const siguienteY = caja.y;
  if (
    apariencia.width === siguienteWidth &&
    apariencia.height === siguienteHeight &&
    apariencia.x === siguienteX &&
    apariencia.y === siguienteY &&
    apariencia.modoTamano === "manual"
  ) {
    return ok(modelo);
  }

  const redimensionado = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: {
            ...apariencia,
            x: siguienteX,
            y: siguienteY,
            width: siguienteWidth,
            height: siguienteHeight,
            modoTamano: "manual" as const,
          },
        },
      },
    },
  };
  return refrescarEnlacesExternosDerivados(redimensionado, opdId);
}

export function ajustarAlTexto(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  const entidad = modelo.entidades[apariencia.entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${apariencia.entidadId}`);
  const size = tamanoAjustadoAlTexto(formatearNombreCompuesto(entidad, { aliasVisible: true }));
  return redimensionarApariencia(modelo, opdId, aparienciaId, size.width, size.height, { x: apariencia.x, y: apariencia.y });
}

export function volverAAutoTamano(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  const siguiente: Apariencia = {
    ...apariencia,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
    modoTamano: "auto",
  };
  const actualizado = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: { ...opd.apariencias, [aparienciaId]: siguiente },
      },
    },
  };
  return refrescarEnlacesExternosDerivados(actualizado, opdId);
}

export function alternarModoTamano(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  return apariencia.modoTamano === "manual"
    ? volverAAutoTamano(modelo, opdId, aparienciaId)
    : redimensionarApariencia(modelo, opdId, aparienciaId, apariencia.width, apariencia.height);
}

export function actualizarVerticesEnlace(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  vertices: Posicion[],
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.enlaces[aparienciaEnlaceId];
  if (!apariencia) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const normalizados = vertices.map((vertice) => ({ x: vertice.x, y: vertice.y }));
  if (mismosVertices(apariencia.vertices, normalizados)) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: {
          ...opd.enlaces,
          [aparienciaEnlaceId]: { ...apariencia, vertices: normalizados },
        },
      },
    },
  });
}

export function actualizarPosicionLabelEnlace(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  labelKey: string,
  posicion: PosicionLabelEnlace,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.enlaces[aparienciaEnlaceId];
  if (!apariencia) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const key = labelKey.trim();
  if (!key) return fallo("Label de enlace inválido");
  const normalizada = normalizarPosicionLabel(posicion);
  if (!normalizada) return fallo("Posición de label inválida");
  const previas = apariencia.labelPositions ?? {};
  if (mismaPosicionLabel(previas[key], normalizada)) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: {
          ...opd.enlaces,
          [aparienciaEnlaceId]: {
            ...apariencia,
            labelPositions: {
              ...previas,
              [key]: normalizada,
            },
          },
        },
      },
    },
  });
}

export function actualizarPosicionSimboloEstructural(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceIds: readonly Id[],
  posicion: Posicion,
  anclajesPorApariencia: Partial<Record<Id, AnclajesSimboloEstructural>> = {},
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  if (!Number.isFinite(posicion.x) || !Number.isFinite(posicion.y)) {
    return fallo("Posición de símbolo estructural inválida");
  }

  let enlaces = opd.enlaces;
  let cambio = false;
  const ids = Array.from(new Set(aparienciaEnlaceIds));
  for (const aparienciaEnlaceId of ids) {
    const apariencia = enlaces[aparienciaEnlaceId];
    if (!apariencia) continue;
    const symbolPos = { x: Math.round(posicion.x), y: Math.round(posicion.y) };
    const symbolAnchors = normalizarAnclajesSimbolo(anclajesPorApariencia[aparienciaEnlaceId]);
    const mismaPosicion = apariencia.symbolPos?.x === symbolPos.x && apariencia.symbolPos.y === symbolPos.y;
    const mismosAnclajes = symbolAnchors === undefined || mismosAnclajesSimbolo(apariencia.symbolAnchors, symbolAnchors);
    if (mismaPosicion && mismosAnclajes) continue;
    enlaces = {
      ...enlaces,
      [aparienciaEnlaceId]: {
        ...apariencia,
        symbolPos,
        ...(symbolAnchors ? { symbolAnchors } : {}),
      },
    };
    cambio = true;
  }

  if (!cambio) return ok(modelo);
  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces,
      },
    },
  });
}

export function actualizarAnclajesSimboloEstructural(
  modelo: Modelo,
  opdId: Id,
  anclajesPorApariencia: Partial<Record<Id, AnclajesSimboloEstructural>>,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  let enlaces = opd.enlaces;
  let cambio = false;
  for (const [aparienciaEnlaceId, anclajes] of Object.entries(anclajesPorApariencia)) {
    const apariencia = enlaces[aparienciaEnlaceId];
    if (!apariencia) continue;
    const symbolAnchors = normalizarAnclajesSimbolo(anclajes);
    if (!symbolAnchors || mismosAnclajesSimbolo(apariencia.symbolAnchors, symbolAnchors)) continue;
    enlaces = {
      ...enlaces,
      [aparienciaEnlaceId]: {
        ...apariencia,
        symbolAnchors,
      },
    };
    cambio = true;
  }

  if (!cambio) return ok(modelo);
  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces,
      },
    },
  });
}

export function resetearAnclajesSimboloEstructural(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceIds: readonly Id[],
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  let enlaces = opd.enlaces;
  let cambio = false;
  for (const aparienciaEnlaceId of new Set(aparienciaEnlaceIds)) {
    const apariencia = enlaces[aparienciaEnlaceId];
    if (!apariencia?.symbolAnchors) continue;
    const siguiente = { ...apariencia };
    delete siguiente.symbolAnchors;
    enlaces = { ...enlaces, [aparienciaEnlaceId]: siguiente };
    cambio = true;
  }

  if (!cambio) return ok(modelo);
  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces,
      },
    },
  });
}

function mismosVertices(a: Posicion[], b: Posicion[]): boolean {
  return a.length === b.length && a.every((vertice, index) => vertice.x === b[index]?.x && vertice.y === b[index]?.y);
}

function normalizarPosicionLabel(posicion: PosicionLabelEnlace): PosicionLabelEnlace | null {
  if (!Number.isFinite(posicion.distance)) return null;
  const normalizada: PosicionLabelEnlace = {
    distance: redondearLabel(posicion.distance),
  };
  if (typeof posicion.offset === "number") {
    if (!Number.isFinite(posicion.offset)) return null;
    normalizada.offset = redondearLabel(posicion.offset);
  } else if (posicion.offset) {
    if (!Number.isFinite(posicion.offset.x) || !Number.isFinite(posicion.offset.y)) return null;
    normalizada.offset = {
      x: redondearLabel(posicion.offset.x),
      y: redondearLabel(posicion.offset.y),
    };
  }
  if (posicion.angle !== undefined) {
    if (!Number.isFinite(posicion.angle)) return null;
    normalizada.angle = redondearLabel(posicion.angle);
  }
  return normalizada;
}

function mismaPosicionLabel(a: PosicionLabelEnlace | undefined, b: PosicionLabelEnlace): boolean {
  if (!a) return false;
  return a.distance === b.distance && mismoOffsetLabel(a.offset, b.offset) && a.angle === b.angle;
}

function mismoOffsetLabel(a: PosicionLabelEnlace["offset"], b: PosicionLabelEnlace["offset"]): boolean {
  if (a === undefined || b === undefined) return a === b;
  if (typeof a === "number" || typeof b === "number") return a === b;
  return a.x === b.x && a.y === b.y;
}

function redondearLabel(valor: number): number {
  return Math.round(valor * 1000) / 1000;
}

function tamanoAjustadoAlTexto(texto: string): { width: number; height: number } {
  const lineas = texto.split(/\s+/).reduce<string[]>((acc, palabra) => {
    const actual = acc[acc.length - 1] ?? "";
    const candidato = actual ? `${actual} ${palabra}` : palabra;
    if (candidato.length > 18 && actual) acc.push(palabra);
    else if (acc.length === 0) acc.push(candidato);
    else acc[acc.length - 1] = candidato;
    return acc;
  }, []);
  const maxChars = Math.max(...lineas.map((linea) => linea.length), texto.length, 1);
  const widthTexto = maxChars * CANON.dims.fontSize * 0.62 + 28;
  const heightTexto = Math.max(1, lineas.length) * CANON.dims.fontSize * 1.35 + 24;
  return {
    width: Math.round(clampValor(RESIZE_MIN.width, 420, Math.max(CANON.dims.cosaWidth, widthTexto))),
    height: Math.round(clampValor(RESIZE_MIN.height, 220, Math.max(CANON.dims.cosaHeight, heightTexto))),
  };
}
