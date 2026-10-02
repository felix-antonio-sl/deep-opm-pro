import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
import type { Cliente } from './cliente';
import type { AlmacenLocal } from './guardado';
export interface Seleccion {
    readonly cosas: readonly Id[];
    readonly estados: readonly Id[];
    readonly enlaces: readonly Id[];
    readonly abanicos: readonly Id[];
    readonly simbolo?: string;
}
export type ModoLienzo = 'edicion' | 'navegacion' | 'gestion-modal' | 'estatico';
export type EstadoGuardado = 'guardado' | 'pendiente' | 'guardando' | 'sin-conexion' | 'conflicto' | 'sesion-vencida' | 'error' | 'eliminado' | 'version-nueva'; // CC-15
export interface Camara {
    readonly x: number;
    readonly y: number;
    readonly zoom: number;
}
export interface Franja {
    readonly tipo: 'ok' | 'rechazo' | 'info';
    readonly texto: string;
    readonly regla?: string;
    readonly accion?: string;
    readonly trazas: readonly Traza[];
}
export interface Paso {
    readonly modelo: Modelo;
    readonly opd: Id;
    readonly seleccion: Seleccion;
    readonly etiqueta: string;
    readonly gesto?: string;
}
export interface EstadoEditor {
    readonly pantalla: 'acceso' | 'biblioteca' | 'editor';
    readonly modelo: Modelo | null;
    readonly rev: string | null;
    readonly opd: Id;
    readonly seleccion: Seleccion;
    readonly pasado: readonly Paso[];
    readonly futuro: readonly Paso[]; // 200 máx.
    readonly franja: Franja | null;
    readonly guardado: EstadoGuardado;
    readonly modo: ModoLienzo;
    readonly camara: Camara;
    readonly realce: readonly Ref[]; // hover bimodal
    readonly lineasNuevas: readonly string[]; // ids de LineaOpl nuevas o cambiadas (se limpian a los 2 s)
    readonly paneles: {
        readonly arbol: boolean;
        readonly derecha: boolean;
    };
    readonly vista: {
        readonly esencia: OpcionesOpl['esencia'];
        readonly numeracion: boolean;
    }; // sin grilla (CC-04)
}
export interface Editor {
    obtener(): EstadoEditor;
    suscribir(f: () => void): () => void;
    ejecutar(a: Accion, o?: {
        readonly gesto?: string;
    }): Respuesta<Hecho>; // ÚNICO commit (T-011); mismo gesto ⇒ un paso
    ejecutarVarias(as: readonly Accion[], etiqueta: string): Respuesta<Hecho>; // «Aplicar a los N», reparaciones
    aplicarOpl(plan: Plan): Respuesta<Hecho>;
    deshacer(): void;
    rehacer(): void;
    navegar(opd: Id, o?: {
        readonly seleccionar?: readonly Ref[];
    }): void; // encuadra (DS-22)
    seleccionar(s: Seleccion | ((s: Seleccion) => Seleccion)): void;
    realzar(r: readonly Ref[]): void;
    fijarModo(m: ModoLienzo): void;
    abrir(id: Id): Promise<void>;
    cerrar(): void;
    guardarAhora(): Promise<void>;
    resolverConflicto(o: 'conservar-mios' | 'usar-guardada'): Promise<void>;
    guardarDeNuevo(): Promise<void>; // tras 404: POST con el mismo id o uno nuevo (CC-15)
    resolverBorrador(o: 'recuperar' | 'descartar' | 'descargar'): Promise<void>;
}
export function crearEditor(dep: {
    readonly cliente: Cliente;
    readonly local: AlmacenLocal;
    readonly reloj?: () => number;
}): Editor { throw new Error('pendiente: WP-10'); }
