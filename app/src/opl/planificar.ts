import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
import type { DiagOpl } from './analizar';
// ---------- Planificación y aplicación ----------
export type TipoPatch = 'crear-entidad' | 'traer-entidad' | 'cambiar-esencia' | 'cambiar-afiliacion' | 'sincronizar-estados' | 'aplicar-designacion-estado' | 'fijar-valor' | 'fijar-cota' | 'crear-refinamiento' | 'fijar-orden' | 'fijar-incompleta' | 'crear-enlace' | 'ajustar-enlace' | 'fijar-etiqueta-enlace' | 'crear-abanico' | 'renombrar-entidad' | 'renombrar-estado';
export interface Patch {
    readonly p: TipoPatch;
    readonly fase: 1 | 2 | 3; // 1 no-enlace · 2 enlace y cota · 3 abanico (R-OPL-EDIT-5, T-181)
    readonly clave: string; // clave de hecho: detecta conflicto-patches (T-178)
    readonly acciones: readonly Accion[]; // operaciones del núcleo, con los ids que asignó el ensayo
    readonly descripcion: string; // «crear objeto **Cliente**», «crear enlace consumo» (R-OPL-EDIT-1)
}
export type EstadoLinea = 'ignorada-vacia' | 'aplicable' | 'no-aplicable' | 'sin-cambio'; // T-174
export type RazonNoAplicable = 'forma-no-reconocida' | 'entidad-no-existe' | 'referencia-ambigua' | 'enlace-invalido-firma' | 'conflicto-patches' | 'inversa-no-soportada' | 'puntuacion-faltante' | 'cambio-ya-presente'; // T-176: cerrado
export interface LineaPlan {
    readonly numero: number;
    readonly texto: string;
    readonly estado: EstadoLinea;
    readonly patches: readonly Patch[];
    readonly diagnosticos: readonly DiagOpl[];
    readonly razon?: RazonNoAplicable; // solo si no-aplicable; o 'cambio-ya-presente'/'inversa-no-soportada' como detalle de sin-cambio
    readonly detalle: string; // texto visible de la canaleta
}
export interface ResumenPlan {
    readonly total: number;
    readonly aplicables: number;
    readonly noAplicables: number;
    readonly ignoradas: number;
    readonly sinCambio: number;
}
export interface Plan {
    readonly base: Modelo; // identidad del modelo planificado
    readonly alcance: Id | 'modelo';
    readonly lineas: readonly LineaPlan[];
    readonly resumen: ResumenPlan;
    readonly acciones: readonly Accion[]; // de las líneas aplicables, en orden de fases
    readonly notas: readonly DiagOpl[]; // no-delete-by-absence (info, T-172)
}
export function planificar(m: Modelo, alcance: Id | 'modelo', texto: string): Plan { throw new Error('pendiente: WP-9'); } // puro (T-173)
// exige m === plan.base; si no ⇒ replanificar
export const TEXTO_RAZON: Readonly<Record<RazonNoAplicable, string>> = new Proxy<Record<RazonNoAplicable, string>>({ 'forma-no-reconocida': '', 'entidad-no-existe': '', 'referencia-ambigua': '', 'enlace-invalido-firma': '', 'conflicto-patches': '', 'inversa-no-soportada': '', 'puntuacion-faltante': '', 'cambio-ya-presente': '' }, { get() { throw new Error('pendiente: WP-9'); } }); // textos visibles de CANON §6.2
