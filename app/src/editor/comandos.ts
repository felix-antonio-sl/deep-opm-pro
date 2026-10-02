import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
import type { EstadoEditor, Editor } from './estado';
export type ContextoComando = 'global' | 'lienzo' | 'cosa' | 'objeto' | 'proceso' | 'contenedor' | 'estado' | 'enlace' | 'multiple' | 'abanico' | 'simbolo' | 'modo-enlace' | 'nombre' | 'biblioteca' | 'editor-opl';
export interface Comando {
    readonly id: string;
    readonly titulo: string;
    readonly atajo?: string;
    readonly contexto: ContextoComando;
    readonly menu?: 'contextual' | 'exportar';
    disponible(e: EstadoEditor): true | string; // string = motivo visible (deshabilitado)
    ejecutar(ed: Editor): void;
}
export const COMANDOS: readonly Comando[] = new Proxy<Comando[]>([], { get() { throw new Error('pendiente: WP-10'); } });
