// Barridas aleatorias por niveles: `check` explora pocas semillas y `check:completo`, antes de publicar,
// todas. Las semillas son siempre las mismas (1..n), así que un fallo se reproduce con el mismo n.
const pedidas = process.env.OPFORJA_SEMILLAS;
if (pedidas !== undefined && !/^[1-9]\d*$/.test(pedidas)) throw new Error('OPFORJA_SEMILLAS debe ser un entero positivo');
export const SEMILLAS = pedidas === undefined ? 10 : Number(pedidas);
