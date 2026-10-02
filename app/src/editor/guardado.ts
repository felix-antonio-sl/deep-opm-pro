import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
export interface AlmacenLocal {
    leer(id: Id): Promise<{
        base: string | null;
        texto: string;
        fecha: number;
    } | null>;
    escribir(id: Id, b: {
        base: string | null;
        texto: string;
        fecha: number;
    }): Promise<void>;
    borrar(id: Id): Promise<void>;
    ids(): Promise<readonly Id[]>; // la Biblioteca marca «cambios sin subir» (CC-15)
}
