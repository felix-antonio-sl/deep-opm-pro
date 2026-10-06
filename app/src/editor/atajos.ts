import { COMANDOS } from './comandos';
import type { ContextoComando } from './comandos';
import type { Editor } from './estado';
export interface TeclaComando { readonly key: string; readonly ctrlKey?: boolean; readonly metaKey?: boolean; readonly shiftKey?: boolean; readonly altKey?: boolean; readonly editable?: boolean; readonly isComposing?: boolean; }
export function despacharAtajo(ed: Editor, contexto: ContextoComando, ev: TeclaComando): boolean {
    if (ev.isComposing) return false;
    const ctrl = !!(ev.ctrlKey || ev.metaKey), letra = ev.key.length === 1 ? ev.key.toUpperCase() : ev.key;
    if (ctrl && /^(W|T|N|Tab|[1-9])$/.test(letra)) return false;
    if (ev.editable && contexto !== 'nombre' && contexto !== 'editor-opl' && ev.key !== 'Escape') return false;
    let tecla = `${ctrl ? 'Ctrl+' : ''}${ev.altKey ? 'Alt+' : ''}${ev.shiftKey ? 'Shift+' : ''}${letra}`;
    if (ev.key === '?') tecla = '?';
    if (contexto === 'modo-enlace' && !ctrl && !ev.altKey && /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü]$/.test(ev.key)) {
        if (!ed.obtener().modelo || ed.obtener().modo !== 'edicion') return false;
        ed.solicitar({k:'enlace',texto:ev.key,opcion:'buscar-o-crear'}); return true;
    }
    const padres: ContextoComando[] = ['objeto', 'proceso', 'contenedor', 'subproceso'].includes(contexto) ? [contexto, 'cosa', 'global'] : [contexto, 'global'];
    const comando = padres.map(p => COMANDOS.find(c => c.contexto === p && c.atajo === tecla)).find(Boolean);
    if (!comando || comando.disponible(ed.obtener()) !== true) return false;
    comando.ejecutar(ed); return true;
}
