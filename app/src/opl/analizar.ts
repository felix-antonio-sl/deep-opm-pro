import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
// ---------- Salida del analizador (por nombres; no conoce el modelo) ----------
export interface NombreTipado {
    readonly nombre: string;
    readonly tipo: TipoCosa;
}
export interface ExtremoTexto extends NombreTipado {
    readonly estado?: string;
    readonly mult?: Multiplicidad;
    readonly genero?: 'f';
    readonly cualquierEstado?: true;
}
export type EnlaceTexto = {
    readonly tipo: 'consumo' | 'resultado' | 'agente' | 'instrumento';
    readonly objeto: ExtremoTexto;
    readonly proceso: string;
    readonly control?: Control;
    readonly ruta?: string;
} | {
    readonly tipo: 'efecto';
    readonly objeto: ExtremoTexto;
    readonly proceso: string;
    readonly entrada?: string;
    readonly salida?: string;
    readonly control?: Control;
} | {
    readonly tipo: 'invocacion' | 'excepcionSobretiempo' | 'excepcionSubtiempo';
    readonly origen: string;
    readonly destino: string;
} | {
    readonly tipo: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
    readonly refinable: ExtremoTexto;
    readonly refinador: ExtremoTexto;
} // estados solo en generalización (RFE)
 | {
    readonly tipo: 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco';
    readonly origen: ExtremoTexto;
    readonly destino: ExtremoTexto;
    readonly etiqueta?: string;
    readonly inversa?: string;
};
export type HechoTexto = {
    readonly k: 'esencia';
    readonly cosa: NombreTipado;
    readonly valor: Esencia;
} | {
    readonly k: 'afiliacion';
    readonly cosa: NombreTipado;
    readonly valor: Afiliacion;
} | {
    readonly k: 'mencion';
    readonly cosa: NombreTipado;
} // D2, D4, D11/D12 coherentes: existencia
 | {
    readonly k: 'estados';
    readonly objeto: string;
    readonly nombres: readonly string[];
    readonly otros: boolean;
} | {
    readonly k: 'designacion';
    readonly objeto: string;
    readonly estado: string;
    readonly designaciones: readonly Designacion[];
} | {
    readonly k: 'valor';
    readonly atributo: string;
    readonly exhibidor: string;
    readonly valor: string;
} | {
    readonly k: 'cota';
    readonly proceso: string;
    readonly campo: 'max' | 'min';
    readonly n: number;
    readonly unidad: UnidadTiempo;
} | {
    readonly k: 'enlace';
    readonly enlace: EnlaceTexto;
} | {
    readonly k: 'abanico';
    readonly operador: Operador;
    readonly ramas: readonly EnlaceTexto[];
} | {
    readonly k: 'incompleta';
    readonly cosa: NombreTipado;
    readonly relacion: RelacionIncompleta;
} | {
    readonly k: 'descomposicion';
    readonly proceso: string;
    readonly bandas: readonly (readonly string[])[];
    readonly internos: readonly string[];
    readonly opdPadre?: string;
    readonly opdHijo?: string;
} | {
    readonly k: 'despliegue';
    readonly cosa: NombreTipado;
    readonly opdHijo?: string;
    readonly refinadores: readonly NombreTipado[];
};
export type CodigoOpl = 'syntax-error' | 'unknown-symbol' | 'ambiguous-symbol' | 'type-mismatch' | 'patch-conflict' | 'unsupported-canonical' | 'non-canonical' | 'no-delete-by-absence';
export interface DiagOpl {
    readonly codigo: CodigoOpl;
    readonly severidad: Severidad;
    readonly linea: number;
    readonly mensaje: string;
    readonly regla?: string;
}
export interface LineaAnalizada {
    readonly numero: number;
    readonly texto: string;
    readonly vacia: boolean;
    readonly cabecera?: string; // '## SD1 …' ⇒ 'SD1' (solo contexto, T-185)
    readonly plantilla?: string;
    readonly hechos: readonly HechoTexto[];
    readonly diagnosticos: readonly DiagOpl[];
}
export function analizar(texto: string): readonly LineaAnalizada[] { throw new Error('pendiente: WP-9'); }
