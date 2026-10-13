/** Cantidad con su sustantivo: en español sólo el uno va en singular («1 cosa», «0 cosas», «2 cosas»). */
export const cuenta = (n: number, singular: string, plural: string): string => `${n} ${n === 1 ? singular : plural}`;
