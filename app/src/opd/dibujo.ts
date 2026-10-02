import type { Escena } from './escena';
export interface NodoSvg {
    readonly t: string; // 'g' | 'path' | 'rect' | 'ellipse' | 'text' | 'polygon' | 'circle' | …
    readonly a: Readonly<Record<string, string | number>>; // atributos SVG (kebab-case)
    readonly h?: readonly (NodoSvg | string)[];
    readonly k?: string; // clave estable (= data-ref en 'edicion')
}
export function dibujar(e: Escena, modo: 'canon' | 'edicion'): NodoSvg { throw new Error('pendiente: WP-9'); } // <g> raíz con <defs> (sombra) incluidas
export function aTexto(n: NodoSvg): string { throw new Error('pendiente: WP-9'); } // serializador con escape XML (30 líneas)
