import type { Modelo, Id } from './tipos';
import type { Rechazo } from './resultado';
import { claveNombre } from './indice';
const letra = 'A-Za-zÁÉÍÓÚÑÜáéíóúñü';
const palabra = `[${letra}][${letra}0-9_-]*`;
const cosa = new RegExp(`^[A-ZÁÉÍÓÚÑÜ][${letra}0-9_-]*( ${palabra})*$`);
const estado = new RegExp(`^[a-záéíóúñü][${letra}0-9_-]*$`);
const etiqueta = new RegExp(`^[a-záéíóúñü][${letra}0-9_-]*( ${palabra})*$`);
const rechazo = (mensaje: string): Rechazo => ({ codigo: 'lexico', regla: 'R-§18-LEX-1', mensaje, refs: [] });
export function validarNombreCosa(nombre: string): Rechazo | null { return cosa.test(nombre) ? null : rechazo('El nombre de cosa no cumple el léxico canónico.'); }
export function validarNombreEstado(nombre: string): Rechazo | null { return estado.test(nombre) ? null : rechazo('El estado requiere una palabra que empiece en minúscula.'); }
export function validarEtiqueta(nombre: string): Rechazo | null { return etiqueta.test(nombre) ? null : rechazo('La etiqueta requiere palabras léxicas separadas por un espacio.'); }
export function sugerirNombre(m: Modelo, nombre: string, tipo: 'cosa' | 'estado', excluir?: Id): string {
    let limpio = nombre.normalize('NFC').replace(new RegExp(`[^${letra}0-9_ -]`, 'g'), '').trim().split(/\s+/).map(p => p.replace(new RegExp(`^[^${letra}]+`), '')).filter(Boolean).join(tipo === 'estado' ? '-' : ' ');
    if (!limpio)
        limpio = tipo === 'cosa' ? 'Cosa' : 'estado';
    if (tipo === 'estado')
        limpio = limpio.toLocaleLowerCase('es');
    limpio = (tipo === 'cosa' ? limpio[0]!.toLocaleUpperCase('es') : limpio[0]!.toLocaleLowerCase('es')) + limpio.slice(1);
    const nombres = new Set<string>();
    for (const c of Object.values(m.cosas)) {
        if (tipo === 'cosa' && c.id !== excluir)
            nombres.add(claveNombre(c.nombre));
        if (tipo === 'estado' && c.tipo === 'objeto')
            for (const s of c.estados)
                if (s.id !== excluir)
                    nombres.add(claveNombre(s.nombre));
    }
    let candidato = limpio;
    for (let n = 2; nombres.has(claveNombre(candidato)); n++)
        candidato = `${limpio}-${n}`;
    return candidato;
}
export function conjuncionY(siguiente: string): 'y' | 'e' { return /^(?:[ií]|h[ií])/i.test(siguiente) && !/^hi[ea]/i.test(siguiente) ? 'e' : 'y'; }
export function conjuncionO(siguiente: string): 'o' | 'u' { return /^(?:o|ó|ho)/i.test(siguiente) ? 'u' : 'o'; }
