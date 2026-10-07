import {useState} from 'preact/hooks';
import {aplicarAccion} from '../nucleo/operaciones';
import type {Accion} from '../nucleo/operaciones';
import {describirEnlace} from '../nucleo/indice';
import {Dialogo} from './Dialogo';
import type { Modelo, Ref } from '../nucleo/tipos';
import { indice } from '../nucleo/indice';
import { opdsEnPreorden, etiquetaOpd, proyectar } from '../nucleo/proyeccion';
import type { Editor as Controlador } from '../editor/estado';
import type { DatosRanura } from './Editor';
export function filasArbol(m: Modelo) {
 return opdsEnPreorden(m).map(id => { const o=m.opds[id]!; let profundidad=0,actual=o; while(actual.tipo!=='raiz'){profundidad++;actual=m.opds[actual.padre]!;} return {id,profundidad,etiqueta:etiquetaOpd(m,id),nombre:o.tipo==='raiz'?m.nombre:m.cosas[o.cosa]?.nombre??'',tipo:o.tipo}; });
}
export function contieneRef(m:Modelo,opd:string,r:Ref):boolean {
 if(r.tipo==='opd')return r.id===opd;
 const v=proyectar(m,opd);
 if(r.tipo==='cosa')return v.cosas.some(c=>c.cosa===r.id);
 if(r.tipo==='estado')return v.cosas.some(c=>c.estadosVisibles.includes(r.id));
 if(r.tipo==='enlace')return v.enlaces.some(e=>e.enlace.id===r.id||e.hechos.includes(r.id));
 if(r.tipo==='abanico')return v.abanicos.some(a=>a.abanico===r.id);
 return false;
}
export function navegarConSeleccion(editor:Controlador,opd:string){
 const s=editor.obtener(),m=s.modelo;if(!m?.opds[opd])return;
 const refs:Ref[]=[...s.seleccion.cosas.map(id=>({tipo:'cosa' as const,id})),...s.seleccion.estados.map(id=>({tipo:'estado' as const,id})),...s.seleccion.enlaces.map(id=>({tipo:'enlace' as const,id})),...s.seleccion.abanicos.map(id=>({tipo:'abanico' as const,id}))];
 editor.navegar(opd,{seleccionar:refs.filter(r=>contieneRef(m,opd,r))});
}
export function irRefs(editor:Controlador,refs:readonly Ref[],opd?:string) {
 const s=editor.obtener(),m=s.modelo;if(!m)return;
 const destino=opd&&m.opds[opd]?opd:opdsEnPreorden(m).find(id=>refs.some(r=>contieneRef(m,id,r)));
 if(destino)editor.navegar(destino,{seleccionar:refs});
}
export function perdidasAccion(m:Modelo,a:Accion){const r=aplicarAccion(m,a);if(!r.ok)return {r,perdidas:[] as string[],conservados:[] as string[]};const n=r.valor.modelo,p:string[]=[],c:string[]=[];for(const [id,x]of Object.entries(m.cosas)){if(!n.cosas[id])p.push(`${x.nombre} (${id})`);if(x.tipo==='objeto')for(const s of x.estados)if(!indice(n).estadoDe.has(s.id))p.push(`${x.nombre}: ${s.nombre} (${s.id})`);}for(const [id,e]of Object.entries(m.enlaces))if(!n.enlaces[id])p.push(describirEnlace(m,e)+` (${id})`);for(const id of Object.keys(m.abanicos))if(!n.abanicos[id])p.push(`Abanico ${id}`);for(const [id,o]of Object.entries(m.opds)){if(!n.opds[id])p.push(`OPD ${id}`);for(const cosa of Object.keys(o.apariciones))if(!n.opds[id]?.apariciones[cosa]&&a.op!=='quitarDeOpd')p.push(`Aparición de ${m.cosas[cosa]?.nombre??cosa} en ${id}`);}if(a.op==='quitarDeOpd')for(const id of a.args.cosas)p.push(`Aparición de ${m.cosas[id]?.nombre??id} en ${a.args.opd}`);if(a.op==='eliminarRefinamiento'){const o=m.opds[a.args.opd];if(o&&o.tipo!=='raiz'&&n.cosas[o.cosa])c.push(m.cosas[o.cosa]!.nombre+' conserva su identidad');for(const id of Object.keys(n.enlaces))if(m.enlaces[id])c.push(describirEnlace(n,n.enlaces[id]!));}return {r,perdidas:p,conservados:c};}
export function ArbolOpd(p:DatosRanura & {elegido?:()=>void}) {
 const [menu,fijar]=useState<string|null>(null),[decision,decidir]=useState<string|null>(null),[error,fallar]=useState(''),m=p.estado.modelo;if(!m)return null;const idx=indice(m),filas=filasArbol(m),accion=(opd:string):Accion=>({op:'eliminarRefinamiento',args:{opd}}),previo=menu?aplicarAccion(m,accion(menu)):null,perdidas=decision?perdidasAccion(m,accion(decision)):null;
 return <div class="arbol-contenido"><h2>OPDs</h2><ul role="tree" aria-label="Diagramas del modelo">{filas.map((f,i)=><li key={f.id} role="treeitem" aria-level={f.profundidad+1} aria-current={p.estado.opd===f.id?'page':undefined} style={{paddingInlineStart:`${f.profundidad*12}px`}}><button onContextMenu={ev=>{ev.preventDefault();fijar(f.id);}} onKeyDown={ev=>{if(ev.key==='ArrowDown'||ev.key==='ArrowUp'||ev.key==='Home'||ev.key==='End'){ev.preventDefault();const botones=ev.currentTarget.closest('ul')!.querySelectorAll('button'),j=ev.key==='Home'?0:ev.key==='End'?filas.length-1:Math.max(0,Math.min(filas.length-1,i+(ev.key==='ArrowDown'?1:-1)));botones[j]?.focus();}if(ev.key==='F10'&&ev.shiftKey){ev.preventDefault();fijar(f.id);}}} onClick={()=>{navegarConSeleccion(p.editor,f.id);p.elegido?.();}}><span>{idx.hijosDe.get(f.id)?.length?'▾':'·'} {f.etiqueta}</span><span>{f.nombre}</span></button></li>)}</ul>
 {menu&&<Dialogo titulo="Acciones del OPD" cerrar={()=>fijar(null)}><button autoFocus onClick={()=>{navegarConSeleccion(p.editor,menu);fijar(null);p.elegido?.();}}>Ir al OPD</button>{menu!==m.raiz&&<><button disabled={p.estado.modo!=='edicion'||!!(previo&&!previo.ok)} title={previo&&!previo.ok?previo.rechazo.mensaje:''} onClick={()=>{decidir(menu);fijar(null);}}>Eliminar refinamiento</button>{previo&&!previo.ok&&<p>{previo.rechazo.mensaje}</p>}</>}</Dialogo>}
 {decision&&perdidas&&<Dialogo titulo="Confirmar pérdidas de refinamiento" cerrar={()=>decidir(null)} acciones={[{texto:'Cancelar',hacer:()=>decidir(null)},{texto:'Confirmar',peligrosa:true,deshabilitada:!perdidas.r.ok,hacer:()=>{const r=p.editor.ejecutar(accion(decision));if(r.ok){const o=m.opds[decision];if(o&&o.tipo!=='raiz')navegarConSeleccion(p.editor,o.padre);decidir(null);}else fallar(r.rechazo.mensaje);}}]}><p>Se eliminan:</p><ul>{perdidas.perdidas.map(x=><li>{x}</li>)}</ul><p>Se conservan en el padre:</p><ul>{perdidas.conservados.map(x=><li>{x}</li>)}</ul>{error&&<p role="alert">{error}</p>}</Dialogo>}</div>;
}
