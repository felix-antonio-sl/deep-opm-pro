import { contenedorRefinamiento, encajarAparienciaEnContorno } from "../layout";
import { CANON } from "../constantes";
import { formatearNombreCompuesto } from "../objetoMetadata";
import type { Apariencia, Id, Modelo, Posicion, Resultado } from "../tipos";
import { RESIZE_MIN, clampValor } from "../../canvas/grid";
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
    // apariencias proxy de externos (entidades que tambien tienen apariencia
    // en otro OPD, tipicamente el padre) son anclas del contexto y deben
    // mantener su posicion absoluta. La distincion se basa en el modelo:
    // una apariencia es proxy si la entidad existe en otro OPD; no se usa
    // heuristica geometrica que falla cuando el contorno se desplaza sobre
    // los proxies (HU-12.008 contenedor envolvente; HU-12.010 externos).
    const dx = posicion.x - apariencia.x;
    const dy = posicion.y - apariencia.y;
    nuevasApariencias = {};
    for (const [id, ap] of Object.entries(opd.apariencias)) {
      if (id === aparienciaId) {
        nuevasApariencias[id] = { ...ap, x: posicion.x, y: posicion.y };
        continue;
      }
      nuevasApariencias[id] = aparienciaEsProxyExterna(modelo, opdId, ap)
        ? ap
        : { ...ap, x: ap.x + dx, y: ap.y + dy };
    }
  } else if (contorno && !aparienciaEsProxyExterna(modelo, opdId, apariencia)) {
    // Apariencia interna: clamp al bbox del contorno (HU-12.020 restriccion
    // interior). Padding coherente con restrictTranslate del paper. Las
    // apariencias proxy de externos NO se clampean (caen en la rama "else"
    // de abajo) porque por diseno viven fuera del bbox del contorno.
    const encajada = encajarAparienciaEnContorno({ ...apariencia, ...posicion }, contorno);
    nuevasApariencias = {
      ...opd.apariencias,
      [apariencia.id]: { ...apariencia, x: encajada.x, y: encajada.y },
    };
  } else {
    // OPD raiz o sin refinable: comportamiento sin restriccion.
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

  const siguienteWidth = Math.round(Math.max(RESIZE_MIN.width, width));
  const siguienteHeight = Math.round(Math.max(RESIZE_MIN.height, height));
  const siguienteX = Math.round(posicion?.x ?? apariencia.x);
  const siguienteY = Math.round(posicion?.y ?? apariencia.y);
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

function aparienciaEsProxyExterna(modelo: Modelo, opdId: Id, apariencia: Apariencia): boolean {
  for (const otroOpdId of Object.keys(modelo.opds)) {
    if (otroOpdId === opdId) continue;
    const otroOpd = modelo.opds[otroOpdId];
    if (!otroOpd) continue;
    for (const ap of Object.values(otroOpd.apariencias)) {
      if (ap.entidadId === apariencia.entidadId) return true;
    }
  }
  return false;
}

function mismosVertices(a: Posicion[], b: Posicion[]): boolean {
  return a.length === b.length && a.every((vertice, index) => vertice.x === b[index]?.x && vertice.y === b[index]?.y);
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
