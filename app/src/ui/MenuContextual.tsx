import { useEffect, useRef } from 'preact/hooks';
import { COMANDOS } from '../editor/comandos';
import type { Comando, ContextoComando } from '../editor/comandos';
import type { Editor, EstadoEditor } from '../editor/estado';
import type { Punto } from '../opd/escena';
export function MenuContextual(p:{editor:Editor;estado:EstadoEditor;contexto:ContextoComando;en:Punto;cerrar:()=>void;ejecutar?:(c:Comando)=>void}) {
    const menu = useRef<HTMLDivElement>(null);
    useEffect(() => { menu.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus(); }, []);
    const contextos=[p.contexto,...(['objeto','proceso','contenedor','subproceso'].includes(p.contexto)?['cosa']:[]),...(p.estado.seleccion.enlaces.length>1?['multiple']:[])];
    const comandos=COMANDOS.filter(c=>contextos.includes(c.contexto));
    return <div ref={menu} role="menu" aria-label="Acciones de selección" class="menu-contextual" style={{left:`${p.en.x}px`,top:`${p.en.y}px`}} onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();p.cerrar();}}}>
        {comandos.map(c=>{const motivo=c.disponible(p.estado);return <button role="menuitem" disabled={motivo!==true} title={motivo===true?'':motivo} onClick={()=>{p.cerrar();if(p.ejecutar)p.ejecutar(c);else c.ejecutar(p.editor);}}>{c.titulo}{c.atajo&&<kbd>{c.atajo}</kbd>}{motivo!==true&&<small>{motivo}</small>}</button>;})}<button onClick={p.cerrar}>Cerrar</button>
    </div>;
}
