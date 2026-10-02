// Transcripción manual independiente de CANON §2.1. Nunca se importa desde producción.
import type { TipoEnlace } from '../nucleo/tipos';
export interface ExpectativaMatriz {
    readonly familia: 'transformadora' | 'habilitadora' | 'invocacion' | 'excepcion' | 'estructural' | 'etiquetada';
    readonly roles: readonly [
        'objeto',
        'proceso'
    ] | readonly [
        'refinable',
        'refinador'
    ] | readonly [
        'origen',
        'destino'
    ];
    readonly estados: 'ninguno' | 'objeto' | 'entradaSalida' | 'parGeneralizacion' | 'origenDestino' | 'soloOrigen' | 'simetrico';
    readonly etiquetas: 'ninguna' | 'opcional' | 'doble';
    readonly clases: readonly [
        'objeto' | 'proceso' | 'cosa',
        'objeto' | 'proceso' | 'cosa'
    ];
    readonly mismoTipo: boolean;
    readonly reflexivo: boolean;
    readonly control: boolean;
    readonly abanico: boolean;
    readonly ruta: boolean;
    readonly mult: 'objeto' | 'refinador' | 'ambos' | 'ninguno';
}
export const EXPECTATIVAS_MATRIZ: Readonly<Record<TipoEnlace, ExpectativaMatriz>> = {
    consumo: { familia: 'transformadora', roles: ['objeto', 'proceso'], estados: 'objeto', etiquetas: 'ninguna', clases: ['objeto', 'proceso'], mismoTipo: false, reflexivo: false, control: true, abanico: true, ruta: true, mult: 'objeto' },
    resultado: { familia: 'transformadora', roles: ['objeto', 'proceso'], estados: 'objeto', etiquetas: 'ninguna', clases: ['objeto', 'proceso'], mismoTipo: false, reflexivo: false, control: false, abanico: true, ruta: true, mult: 'objeto' },
    efecto: { familia: 'transformadora', roles: ['objeto', 'proceso'], estados: 'entradaSalida', etiquetas: 'ninguna', clases: ['objeto', 'proceso'], mismoTipo: false, reflexivo: false, control: true, abanico: true, ruta: false, mult: 'objeto' },
    agente: { familia: 'habilitadora', roles: ['objeto', 'proceso'], estados: 'objeto', etiquetas: 'ninguna', clases: ['objeto', 'proceso'], mismoTipo: false, reflexivo: false, control: true, abanico: true, ruta: false, mult: 'objeto' },
    instrumento: { familia: 'habilitadora', roles: ['objeto', 'proceso'], estados: 'objeto', etiquetas: 'ninguna', clases: ['objeto', 'proceso'], mismoTipo: false, reflexivo: false, control: true, abanico: true, ruta: false, mult: 'objeto' },
    invocacion: { familia: 'invocacion', roles: ['origen', 'destino'], estados: 'ninguno', etiquetas: 'ninguna', clases: ['proceso', 'proceso'], mismoTipo: true, reflexivo: true, control: false, abanico: true, ruta: false, mult: 'ninguno' },
    excepcionSobretiempo: { familia: 'excepcion', roles: ['origen', 'destino'], estados: 'ninguno', etiquetas: 'ninguna', clases: ['proceso', 'proceso'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ninguno' },
    excepcionSubtiempo: { familia: 'excepcion', roles: ['origen', 'destino'], estados: 'ninguno', etiquetas: 'ninguna', clases: ['proceso', 'proceso'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ninguno' },
    agregacion: { familia: 'estructural', roles: ['refinable', 'refinador'], estados: 'ninguno', etiquetas: 'ninguna', clases: ['cosa', 'cosa'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'refinador' },
    exhibicion: { familia: 'estructural', roles: ['refinable', 'refinador'], estados: 'ninguno', etiquetas: 'ninguna', clases: ['cosa', 'cosa'], mismoTipo: false, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ninguno' },
    generalizacion: { familia: 'estructural', roles: ['refinable', 'refinador'], estados: 'parGeneralizacion', etiquetas: 'ninguna', clases: ['cosa', 'cosa'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ninguno' },
    clasificacion: { familia: 'estructural', roles: ['refinable', 'refinador'], estados: 'ninguno', etiquetas: 'ninguna', clases: ['cosa', 'cosa'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ninguno' },
    etiquetado: { familia: 'etiquetada', roles: ['origen', 'destino'], estados: 'origenDestino', etiquetas: 'opcional', clases: ['cosa', 'cosa'], mismoTipo: true, reflexivo: true, control: false, abanico: false, ruta: false, mult: 'ambos' },
    etiquetadoBidireccional: { familia: 'etiquetada', roles: ['origen', 'destino'], estados: 'soloOrigen', etiquetas: 'doble', clases: ['cosa', 'cosa'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ambos' },
    reciproco: { familia: 'etiquetada', roles: ['origen', 'destino'], estados: 'simetrico', etiquetas: 'opcional', clases: ['cosa', 'cosa'], mismoTipo: true, reflexivo: false, control: false, abanico: false, ruta: false, mult: 'ambos' },
};
// Dirección en v0 independiente de roles procedimentales (objeto, proceso).
export const DIRECCION_CANONICA = {
    consumo: ['objeto', 'proceso'], resultado: ['proceso', 'objeto'], efecto: ['proceso', 'objeto'],
    agente: ['objeto', 'proceso'], instrumento: ['objeto', 'proceso'], invocacion: ['origen', 'destino'],
    excepcionSobretiempo: ['origen', 'destino'], excepcionSubtiempo: ['origen', 'destino'],
    agregacion: ['refinable', 'refinador'], exhibicion: ['refinable', 'refinador'], generalizacion: ['refinable', 'refinador'], clasificacion: ['refinable', 'refinador'],
    etiquetado: ['origen', 'destino'], etiquetadoBidireccional: ['origen', 'destino'], reciproco: ['origen', 'destino'],
} as const satisfies Readonly<Record<TipoEnlace, readonly [
    string,
    string
]>>;
// CANON §2.2: convergencia = destino común; divergencia = origen común, salvo
// efecto cuya dirección procedimental conserva objeto↔proceso en la tabla canónica.
export const EXPECTATIVAS_ABANICOS = {
    consumo: { convergente: 'proceso', divergente: 'objeto', control: true },
    resultado: { convergente: 'objeto', divergente: 'proceso', control: false },
    efecto: { convergente: 'proceso', divergente: 'objeto', control: true },
    agente: { convergente: 'proceso', divergente: 'objeto', control: true },
    instrumento: { convergente: 'proceso', divergente: 'objeto', control: true },
    invocacion: { convergente: 'destino', divergente: 'origen', control: false },
} as const;
export const EXPECTATIVAS_REGLAS = [
    { id: 'R-ROL-UNIC-1', tipos: ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'], regla: 'Un procedimental por par; ramas del mismo abanico exceptuadas.' },
    { id: 'R-EFE-1', tipos: ['efecto'], regla: 'El objeto debe tener estados propios o heredados.' },
    { id: 'R-RES-1', tipos: ['resultado'], regla: 'El resultado nunca se ancla a un estado inicial.' },
    { id: 'R-DIST-1', tipos: ['consumo', 'resultado'], regla: 'Nunca en el contorno de proceso descompuesto.' },
    { id: 'R-CX-DIST-2', tipos: ['consumo', 'efecto', 'agente', 'instrumento'], regla: 'Evento sistémico no cruza frontera temporal.' },
    { id: 'AP-27', tipos: ['consumo', 'efecto', 'agente', 'instrumento'], regla: 'Evento en banda no primera bloquea con previos obligatorios; advierte con previos omisibles.' },
    { id: 'R-INV-2B', tipos: ['invocacion'], regla: 'Impide duplicar transición de bandas adyacentes.' },
    { id: 'R-FAN-GEO-2', tipos: ['consumo', 'resultado', 'efecto', 'agente', 'instrumento', 'invocacion'], regla: 'Abanico mismo tipo, extremo común y ramas distintas.' },
    { id: 'R-FAN-3', tipos: ['consumo', 'efecto', 'agente', 'instrumento'], regla: 'Control homogéneo en todas las ramas.' },
] as const;
