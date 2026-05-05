import type { dia } from "jointjs";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Abanico, Apariencia, Id, Modelo, Posicion } from "../../modelo/tipos";
import { calcularGeometriaAbanico } from "./abanicoOverlay";

// Devuelve los abanicos del OPD activo donde la entidad participa, ya sea
// como puerto compartido o como otro extremo de alguna rama. Necesario para
// recomputar el overlay durante el drag visual sin pasar por el store.
export function abanicosAfectadosPorEntidad(modelo: Modelo, opdId: Id, entidadId: Id): Abanico[] {
  const result: Abanico[] = [];
  for (const abanico of Object.values(modelo.abanicos ?? {})) {
    if (abanico.opdId !== opdId) continue;
    if (abanico.puertoEntidadId === entidadId) {
      result.push(abanico);
      continue;
    }
    const involucra = abanico.enlaceIds.some((enlaceId) => {
      const enlace = modelo.enlaces[enlaceId];
      if (!enlace) return false;
      const oId = entidadIdDeExtremo(modelo, enlace.origenId);
      const dId = entidadIdDeExtremo(modelo, enlace.destinoId);
      return oId === entidadId || dId === entidadId;
    });
    if (involucra) result.push(abanico);
  }
  return result;
}

// Sincroniza la celda overlay del abanico con la posicion EN VIVO de las
// entidades en el graph (mid-drag, antes de que `moverApariencia` commitee
// al store). Sin este puente, el overlay solo se reproyecta al `pointerup`
// y "salta" a la posicion final desconectado del movimiento del cursor.
// Equivalente conceptual a OpCloud `Arc.redrawAllArcs` (shared.ts:5946),
// pero invocado por listener de `change:position` en lugar de pointerUp.
export function sincronizarOverlayAbanicoEnDrag(
  graph: dia.Graph,
  modelo: Modelo,
  abanico: Abanico,
): void {
  const overlayCell = graph.getCell(`overlay-abanico-${abanico.id}`);
  if (!overlayCell) return;
  const opd = modelo.opds[abanico.opdId];
  if (!opd) return;
  const tipoPuerto = modelo.entidades[abanico.puertoEntidadId]?.tipo;
  if (!tipoPuerto) return;

  const aparienciaPorEntidad = new Map<Id, Apariencia>();
  for (const ap of Object.values(opd.apariencias)) {
    const cell = graph.getCell(ap.id) as dia.Element | undefined;
    if (!cell) continue;
    const pos = cell.position();
    const size = cell.size();
    aparienciaPorEntidad.set(ap.entidadId, {
      ...ap,
      x: pos.x,
      y: pos.y,
      width: size.width,
      height: size.height,
    });
  }
  const aparienciaPuerto = aparienciaPorEntidad.get(abanico.puertoEntidadId);
  if (!aparienciaPuerto) return;

  const centrosOtros: Posicion[] = [];
  for (const enlaceId of abanico.enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const oId = entidadIdDeExtremo(modelo, enlace.origenId);
    const dId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!oId || !dId) continue;
    const otroId = oId === abanico.puertoEntidadId ? dId : oId;
    const otroAp = aparienciaPorEntidad.get(otroId);
    if (!otroAp) continue;
    centrosOtros.push({
      x: otroAp.x + otroAp.width / 2,
      y: otroAp.y + otroAp.height / 2,
    });
  }

  const geometria = calcularGeometriaAbanico({
    aparienciaPuerto,
    tipoEntidadPuerto: tipoPuerto,
    centrosOtros,
    operador: abanico.operador,
  });
  if (!geometria) return;

  const elem = overlayCell as dia.Element;
  elem.position(geometria.position.x, geometria.position.y);
  elem.resize(geometria.size.width, geometria.size.height);
  overlayCell.attr("body/d", geometria.d);
}
