import type { Modelo, Id, Ref, TipoCosa, ModoDespliegue } from '../nucleo/tipos';
export interface Punto {
    readonly x: number;
    readonly y: number;
}
export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly ancho: number;
    readonly alto: number;
}
export type Marcador = 'punta' | 'piruletaNegra' | 'piruletaBlanca' | 'abierta' | 'arpon' | 'arponInverso';
export interface Escena {
    readonly opd: Id;
    readonly caja: Rect; // unión de todo lo dibujado (sombras +8, arcos, rótulos)
    readonly nodos: readonly NodoCosa[];
    readonly simbolos: readonly Simbolo[];
    readonly aristas: readonly Arista[];
    readonly arcos: readonly Arco[];
}
export interface NodoCosa {
    readonly ref: Ref;
    readonly tipo: TipoCosa;
    readonly caja: Rect;
    readonly contenedor: boolean;
    readonly grueso: boolean; // grueso ⇔ la cosa tiene descomposición o despliegue (T-202)
    readonly ambiental: boolean;
    readonly fisica: boolean; // dash 8 4 / sombra (T-200, T-201)
    readonly rotulo: {
        readonly lineas: readonly string[];
        readonly x: number;
        readonly y: number;
        readonly italica: boolean;
    };
    readonly estados: readonly NodoEstado[];
    readonly chipOcultos?: {
        readonly n: number;
        readonly caja: Rect;
    }; // ⋯N (T-208)
    readonly duracion?: string; // «[min] {1, 3, 5}» (T-220)
    readonly rotuloInstancia?: string; // «Nombre : Clase» (T-222)
}
export interface NodoEstado {
    readonly ref: Ref;
    readonly caja: Rect;
    readonly nombre: string;
    readonly inicial: boolean;
    readonly final: boolean;
    readonly porDefecto: boolean;
    readonly current: boolean;
}
export interface Simbolo {
    readonly clave: string; // 'simbolo:<refinable>:<relacion>' (data-ref)
    readonly refinable: Id;
    readonly relacion: ModoDespliegue;
    readonly vertice: Punto;
    readonly orientacion: 'abajo' | 'arriba' | 'derecha' | 'izquierda';
    readonly incompleta: boolean;
    readonly ramas: readonly Id[]; // enlaces
    readonly peine: readonly (readonly Punto[])[]; // tramo común + bajadas (ortogonales)
    readonly mult: readonly {
        readonly texto: string;
        readonly en: Punto;
    }[];
}
export interface Tramo {
    readonly puntos: readonly Punto[];
    readonly inicio?: Marcador;
    readonly fin?: Marcador;
}
export interface Arista {
    readonly ref: Ref;
    readonly hechos: readonly Id[];
    readonly tramos: readonly Tramo[]; // TS3: 2 tramos (entrada→P, P→salida)
    readonly rayo: boolean; // invocación
    readonly marcas: readonly {
        readonly texto: 'e' | 'c' | '/' | '//';
        readonly en: Punto;
        readonly angulo: number;
    }[];
    readonly etiquetas: readonly {
        readonly texto: string;
        readonly en: Punto;
        readonly italica: boolean;
        readonly clave: 'etiqueta' | 'inversa' | 'ruta' | 'mult-origen' | 'mult-destino';
    }[];
    readonly capa: 4 | 20; // 20 = anclada a estado
}
export interface Arco {
    readonly abanico: Id;
    readonly centro: Punto;
    readonly radio: number;
    readonly desde: number;
    readonly hasta: number;
    readonly doble: boolean;
}
export function escena(m: Modelo, opd: Id): Escena { throw new Error('pendiente: WP-9'); } // memo por (modelo, opd)
