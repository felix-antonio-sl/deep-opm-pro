import { PLANTILLAS, LITERALES_EXPANDIDOS, patronProducto } from './plantillas';
/** Unión exacta de los literales; los nombres y huecos nunca amplían el vocabulario. */
export const VOCABULARIO: readonly string[] = Object.freeze([...new Set([...PLANTILLAS.flatMap(p => [p.patron, patronProducto(p)].map(s => s.replace(/\{[^}]+\}/g, ''))), ...LITERALES_EXPANDIDOS].flatMap(texto => texto.toLocaleLowerCase('es').match(/[\p{L}]+/gu) ?? []))].sort());
export function plural(n: number, singular: string, varios: string): string { return n === 1 ? singular : varios; }
