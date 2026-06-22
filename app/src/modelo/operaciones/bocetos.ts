import type { Boceto, Id, Modelo, Opd, Resultado } from "../tipos";
import { fallo, ok, siguienteId } from "./helpers";

/**
 * CRUD PURO de la capa de pizarra / bosquejo (D7.2). Cada operación toma un
 * Modelo y devuelve un Modelo NUEVO (inmutable, la entrada nunca se muta),
 * operando EXCLUSIVAMENTE sobre `Opd.bocetos`. La capa de boceto es
 * NO-SEMÁNTICA: el kernel la IGNORA (mismo estatuto que `generic-view` +
 * AnclaNormativa + NotaMesa). Defendido por `law-bocetos-no-contaminan`.
 *
 * Ids de boceto: `siguienteId(modelo, "bo")` ⇒ `bo-N`. El prefijo `bo` NO
 * colisiona con o-/p-/s-/e-/a- porque un boceto JAMÁS se referencia desde
 * enlaces/estados/abanicos — vive solo en `Opd.bocetos`. Comparte la secuencia
 * `nextSeq` con el resto del bundle (un id consumido no se reutiliza).
 *
 * La SELECCIÓN de un boceto NO vive aquí ni en el modelo: es estado de UI del
 * `PizarraSlice` (no entra al trío sellado del store — deuda O(N²)).
 */

export interface BocetoAgregado {
  modelo: Modelo;
  bocetoId: Id;
}

export type PosicionBoceto = { x: number; y: number } | { dx: number; dy: number };

/** Parche permitido de edición: contenido y geometría laxa; nunca `id` ni `tipo`. */
export type ParcheBoceto = Partial<Pick<Boceto, "texto" | "estilo" | "w" | "h" | "puntos">>;

export function agregarBoceto(
  modelo: Modelo,
  opdId: Id,
  boceto: Omit<Boceto, "id">,
): Resultado<BocetoAgregado> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const bocetoId = siguienteId(modelo, "bo");
  const nuevo: Boceto = { ...boceto, id: bocetoId };
  const nextOpd: Opd = { ...opd, bocetos: { ...(opd.bocetos ?? {}), [bocetoId]: nuevo } };
  const siguiente: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 1,
    opds: { ...modelo.opds, [opdId]: nextOpd },
  };
  return ok({ modelo: siguiente, bocetoId });
}

export function moverBoceto(
  modelo: Modelo,
  opdId: Id,
  bocetoId: Id,
  posicion: PosicionBoceto,
): Resultado<Modelo> {
  return conBoceto(modelo, opdId, bocetoId, (boceto) => {
    if ("dx" in posicion) {
      const { dx, dy } = posicion;
      return {
        ...boceto,
        ...(boceto.x !== undefined ? { x: boceto.x + dx } : {}),
        ...(boceto.y !== undefined ? { y: boceto.y + dy } : {}),
        ...(boceto.puntos ? { puntos: boceto.puntos.map((p) => ({ x: p.x + dx, y: p.y + dy })) } : {}),
      };
    }
    const { x, y } = posicion;
    // Reanclaje absoluto: si el boceto es una flecha por puntos, traslada los
    // puntos al nuevo origen conservando su forma relativa al primer punto.
    if (boceto.puntos && boceto.puntos.length > 0) {
      const [primero, ...resto] = boceto.puntos;
      const ox = primero?.x ?? 0;
      const oy = primero?.y ?? 0;
      const dx = x - ox;
      const dy = y - oy;
      return {
        ...boceto,
        ...(boceto.x !== undefined ? { x } : {}),
        ...(boceto.y !== undefined ? { y } : {}),
        puntos: [{ x, y }, ...resto.map((p) => ({ x: p.x + dx, y: p.y + dy }))],
      };
    }
    return { ...boceto, x, y };
  });
}

export function editarBoceto(
  modelo: Modelo,
  opdId: Id,
  bocetoId: Id,
  parche: ParcheBoceto,
): Resultado<Modelo> {
  return conBoceto(modelo, opdId, bocetoId, (boceto) => ({ ...boceto, ...parche }));
}

export function eliminarBoceto(modelo: Modelo, opdId: Id, bocetoId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  if (!opd.bocetos?.[bocetoId]) return fallo(`Boceto no existe: ${opdId}.${bocetoId}`);
  const { [bocetoId]: _, ...resto } = opd.bocetos;
  // exactOptionalPropertyTypes: omitir la clave si no quedan bocetos, nunca
  // dejar `undefined` explícito (byte-identidad legacy con un OPD sin la clave).
  const { bocetos: _bocetosPrevios, ...opdSinBocetos } = opd;
  const nextOpd: Opd = {
    ...opdSinBocetos,
    ...(Object.keys(resto).length > 0 ? { bocetos: resto } : {}),
  };
  return ok({ ...modelo, opds: { ...modelo.opds, [opdId]: nextOpd } });
}

/** Helper interno: localiza el boceto, le aplica `transformar` y reescribe el OPD. */
function conBoceto(
  modelo: Modelo,
  opdId: Id,
  bocetoId: Id,
  transformar: (boceto: Boceto) => Boceto,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const boceto = opd.bocetos?.[bocetoId];
  if (!boceto) return fallo(`Boceto no existe: ${opdId}.${bocetoId}`);
  const nextOpd: Opd = {
    ...opd,
    bocetos: { ...(opd.bocetos ?? {}), [bocetoId]: transformar(boceto) },
  };
  return ok({ ...modelo, opds: { ...modelo.opds, [opdId]: nextOpd } });
}
