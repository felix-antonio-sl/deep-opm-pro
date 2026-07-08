import type { Id, Modelo, Opd } from "../tipos";

/** Nombre por defecto de un OPD suelto: «Boceto N» (N = primer ordinal libre). */
function siguienteNombreBoceto(modelo: Modelo): string {
  const usados = new Set(Object.values(modelo.opds).map((o) => o.nombre));
  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i += 1) {
    const candidato = `Boceto ${i}`;
    if (!usados.has(candidato)) return candidato;
  }
  return "Boceto";
}

/**
 * Crea un OPD SUELTO (`padreId:null`, id≠opdRaizId): un fragmento fuera del árbol
 * de refinamiento, estado transitorio legítimo del arranque bottom-up (R-OPD-REF-20).
 * Nace vacío para trazar sin ceremonia; NO toca opdRaizId, entidades ni enlaces.
 *
 * El id sale del contador único `nextSeq`, saltando colisiones con OPDs ya
 * existentes: en un modelo recién creado la raíz ocupa `opd-1` mientras `nextSeq`
 * aún vale 1 (`crearModelo` hardcodea la raíz sin consumir el contador), de modo
 * que el primer suelto debe avanzar hasta el primer slot libre para no
 * SOBRESCRIBIR la raíz. `nextSeq` queda en el valor siguiente al consumido.
 */
export function crearOpdSuelto(modelo: Modelo, nombre?: string): { modelo: Modelo; opdId: Id } {
  let seq = modelo.nextSeq;
  while (modelo.opds[`opd-${seq}`]) seq += 1;
  const opdId: Id = `opd-${seq}`;
  const opd: Opd = {
    id: opdId,
    nombre: nombre?.trim() || siguienteNombreBoceto(modelo),
    padreId: null,
    apariencias: {},
    enlaces: {},
  };
  return {
    modelo: { ...modelo, nextSeq: seq + 1, opds: { ...modelo.opds, [opdId]: opd } },
    opdId,
  };
}
