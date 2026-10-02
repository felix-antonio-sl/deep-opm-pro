import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
export interface FilaModelo {
    readonly id: Id;
    readonly nombre: string;
    readonly modificado: string;
    readonly rev: string;
    readonly bytes: number;
    readonly cosas: number;
    readonly opds: number;
}
export interface FilaPapelera {
    readonly entrada: string;
    readonly id: Id;
    readonly nombre: string;
    readonly eliminado: string;
    readonly motivo: 'eliminado' | 'reemplazado';
}
export type FalloApi = {
    readonly estado: number;
    readonly error: string;
    readonly informe?: Informe;
};
export interface Cliente {
    sesion(): Promise<{
        email: string;
    } | null>;
    entrar(email: string, clave: string): Promise<'ok' | 'credenciales' | {
        reintentarEn: number;
    }>;
    salir(): Promise<void>;
    listar(): Promise<readonly FilaModelo[]>;
    leer(id: Id): Promise<{
        texto: string;
        rev: string;
    } | 'no-existe'>;
    crear(texto: string): Promise<{
        id: Id;
        rev: string;
    } | FalloApi>;
    guardar(id: Id, texto: string, rev: string, o?: {
        respaldo?: true;
    }): Promise<{
        rev: string;
    } | {
        conflicto: string;
    } | FalloApi>;
    eliminar(id: Id): Promise<void>;
    papelera(): Promise<readonly FilaPapelera[]>;
    restaurar(entrada: string): Promise<{
        id: Id;
        rev: string;
    }>;
    purgar(entrada: string): Promise<void>;
    versionServidor(): string | null; // última cabecera X-Opforja-Version vista
}
export function crearCliente(f: typeof fetch, base?: string): Cliente { throw new Error('pendiente: WP-11'); }
