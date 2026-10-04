import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
// ---------- Salida del generador ----------
export interface TokenOpl {
    readonly texto: string; // sin marcas Markdown
    readonly rol: 'texto' | 'nombre' | 'verbo' | 'estado' | 'multiplicidad';
    readonly marca?: 'objeto' | 'proceso' | 'estado'; // **…**, *…*, `…`
    readonly ref?: Ref; // cosa/estado/opd del hueco (T-135)
    readonly hecho?: Id; // enlace del sub-span (R-OPL-INT-6, T-245)
}
export interface LineaOpl {
    readonly id: string; // estable por hecho, no posicional: `${opd}#${plantilla}:${clave}` (§5.4)
    readonly plantilla: string; // id de §5.3
    readonly texto: string; // Markdown canónico; se construye desde los tokens (una sola fuente)
    readonly tokens: readonly TokenOpl[];
    readonly refs: readonly Ref[]; // únicas por tipo:id, en orden de primera aparición
    readonly hechos: readonly Id[]; // enlaces del modelo que la línea expresa (abstraídos incluidos)
    readonly opd: Id;
    readonly etiquetaOpd: string;
    readonly profundidad: number;
    readonly soloDisplay?: true; // cabeceras de bloque y D2 de display (T-185)
}
export interface OpcionesOpl {
    readonly esencia: 'siempre' | 'solo-difiere' | 'oculta';
    readonly numeracion: boolean;
}

export function textoDeTokens(tokens: readonly TokenOpl[]): string {
    return tokens.map(t => t.marca === 'objeto' ? `**${t.texto}**` : t.marca === 'proceso' ? `*${t.texto}*` : t.marca === 'estado' ? `\`${t.texto}\`` : t.texto).join('');
}
export function refsDeTokens(tokens: readonly TokenOpl[]): readonly Ref[] {
    const vistas = new Set<string>(), refs: Ref[] = [];
    for (const t of tokens) if (t.ref) {
        const clave = `${t.ref.tipo}:${t.ref.id}`;
        if (!vistas.has(clave)) { vistas.add(clave); refs.push(t.ref); }
    }
    return refs;
}
