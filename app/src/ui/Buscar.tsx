import {useState} from 'preact/hooks';
import {buscarPorNombre,indice} from '../nucleo/indice';
import type {Modelo,Ref} from '../nucleo/tipos';
import type {Accion} from '../nucleo/operaciones';
import {aplicarAccion} from '../nucleo/operaciones';
import {escena} from '../opd/escena';
import type {DatosRanura} from './Editor';
import {filasArbol,irRefs} from './ArbolOpd';
import {Dialogo} from './Dialogo';
const normal=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('es').trim();
export function resultadosBuscar(m:Modelo,q:string){const r=[...buscarPorNombre(m,q,20)];for(const f of filasArbol(m))if(normal(f.nombre+' '+f.etiqueta).includes(normal(q)))r.push({ref:{tipo:'opd' as const,id:f.id},texto:f.nombre,detalle:f.etiqueta});return r.slice(0,20);}
export function accionTraer(m:Modelo,opd:string,ref:Ref,en:{x:number,y:number}):Accion|null{
 const id=ref.tipo==='estado'?indice(m).estadoDe.get(ref.id)?.objeto:ref.tipo==='cosa'?ref.id:undefined;if(!id)return null;
 const accion=(x:number,y:number):Accion=>({op:'traerCosa',args:{cosa:id,opd,x:Math.round(x),y:Math.round(y)}}),inicial=accion(en.x,en.y),r=aplicarAccion(m,inicial);
 if(!r.ok||m.opds[opd]?.apariciones[id])return inicial;
 const caja=escena(r.valor.modelo,opd).nodos.find(n=>n.ref.id===id)!.caja,otras=escena(m,opd).nodos.map(n=>n.caja);
 const puntos=[en,...otras.flatMap(c=>[{x:c.x+c.ancho+24,y:c.y},{x:c.x-caja.ancho-24,y:c.y},{x:c.x,y:c.y+c.alto+24},{x:c.x,y:c.y-caja.alto-24}])];
 puntos.sort((a,b)=>Math.hypot(a.x-en.x,a.y-en.y)-Math.hypot(b.x-en.x,b.y-en.y)||a.x-b.x||a.y-b.y);
 for(const p of puntos){const a=accion(p.x,p.y),r=aplicarAccion(m,a);if(!r.ok)continue;const nodos=escena(r.valor.modelo,opd).nodos,n=nodos.find(n=>n.ref.id===id)!.caja;
  if(nodos.filter(n=>n.ref.id!==id).every(({caja:c})=>n.x+n.ancho+8<=c.x||c.x+c.ancho+8<=n.x||n.y+n.alto+8<=c.y||c.y+c.alto+8<=n.y))return a;
 }
 // A la derecha de la unión de cajas existe un hueco sin mover ninguna aparición.
 return accion(Math.max(en.x,...otras.map(c=>c.x+c.ancho))+24,en.y);
}
export function Buscar(p:DatosRanura){const [q,consulta]=useState(''),[elegido,elegir]=useState(0),[error,fallar]=useState(''),m=p.estado.modelo!,resultados=resultadosBuscar(m,q),camara=p.estado.camara;
 const punto=()=>{const r=document.querySelector('.contenido-lienzo')?.getBoundingClientRect();return{x:((r?.width??800)/2-camara.x)/camara.zoom,y:((r?.height??600)/2-camara.y)/camara.zoom};};
 function ir(i:number){const r=resultados[i];if(r){irRefs(p.editor,[r.ref]);p.editor.solicitar(null);}}
 function traer(i:number){const r=resultados[i];if(!r)return;const a=accionTraer(m,p.estado.opd,r.ref,punto());if(!a){ir(i);return;}const res=p.editor.ejecutar(a);if(res.ok){p.editor.navegar(p.estado.opd,{seleccionar:[r.ref]});p.editor.solicitar(null);}else fallar(`${res.rechazo.regla}: ${res.rechazo.mensaje}`);}
 return <Dialogo titulo="Buscar" cerrar={()=>p.editor.solicitar(null)}><label>Nombre o diagrama<input autoFocus value={q} onInput={e=>{consulta(e.currentTarget.value);elegir(0);}} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();elegir(Math.max(0,Math.min(resultados.length-1,elegido+(e.key==='ArrowDown'?1:-1))));}if(e.key==='Enter'){e.preventDefault();if(e.shiftKey)ir(elegido);else traer(elegido);}}}/></label><p>Enter trae al OPD actual · Mayús+Enter va a su aparición.</p><ul class="resultados-buscar">{resultados.map((r,i)=>{const a=accionTraer(m,p.estado.opd,r.ref,punto()),previo=a?aplicarAccion(m,a):null,razon=previo&&!previo.ok?previo.rechazo.mensaje:null;return <li key={`${r.ref.tipo}:${r.ref.id}`} class={i===elegido?'elegido':''}><button onClick={()=>elegir(i)}><strong>{r.texto}</strong><small>{r.detalle}</small></button><button onClick={()=>ir(i)}>Ir</button>{a&&<button disabled={p.estado.modo!=='edicion'||!!razon} title={razon??''} onClick={()=>traer(i)}>Traer</button>}{razon&&<small>{razon}</small>}</li>;})}</ul>{!resultados.length&&<p>No hay coincidencias.</p>}{error&&<p role="alert">{error}</p>}</Dialogo>;
}
