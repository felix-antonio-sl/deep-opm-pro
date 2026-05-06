import { contenedorRefinamiento } from "../layout";
import type { Apariencia, Id, Modelo, Posicion, Resultado } from "../tipos";
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
    const minX = contorno.x + 4;
    const maxX = contorno.x + contorno.width - apariencia.width - 4;
    const minY = contorno.y + 28;
    const maxY = contorno.y + contorno.height - apariencia.height - 8;
    const clampX = Math.max(minX, Math.min(maxX, posicion.x));
    const clampY = Math.max(minY, Math.min(maxY, posicion.y));
    nuevasApariencias = {
      ...opd.apariencias,
      [apariencia.id]: { ...apariencia, x: clampX, y: clampY },
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
