import {useEffect,useRef,useState} from 'preact/hooks';
import {generarBloque} from '../opl/generar';
import {planificar} from '../opl/planificar';
import type {Plan} from '../opl/planificar';
import type {Modelo} from '../nucleo/tipos';
import type {DatosRanura} from './Editor';
import {despacharAtajo} from '../editor/atajos';
import {Dialogo} from './Dialogo';
export function planVigente(m:Modelo,opd:string,texto:string,plan:Plan):Plan{return plan.base===m&&plan.alcance===opd&&plan.lineas.map(l=>l.texto).join("\n")===texto?plan:planificar(m,opd,texto);}
export function EditorOpl(p:DatosRanura){
 const m=p.estado.modelo!,canon=()=>generarBloque(p.editor.obtener().modelo!,p.editor.obtener().opd).map(l=>l.texto).join('\n'),[texto,cambiar]=useState(canon),[plan,fijar]=useState(()=>planificar(m,p.estado.opd,texto)),[error,fallar]=useState(''),area=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{const timer=setTimeout(()=>fijar(planificar(m,p.estado.opd,texto)),150);return()=>clearTimeout(timer);},[texto,m,p.estado.opd]);
 function cerrar(){p.editor.solicitar(null);}
 function aplicar(){const s=p.editor.obtener();if(!s.modelo)return;const actual=planVigente(s.modelo,s.opd,texto,plan);fijar(actual);if(!actual.acciones.length)return;const r=p.editor.aplicarOpl(actual);if(r.ok){const t=canon();cambiar(t);fijar(planificar(p.editor.obtener().modelo!,p.editor.obtener().opd,t));fallar('');}else fallar(`${r.rechazo.regla}: ${r.rechazo.mensaje}`);}
 function siguiente(d:number){const vigente=planVigente(p.editor.obtener().modelo!,p.estado.opd,texto,plan);fijar(vigente);const malos=vigente.lineas.filter(l=>l.estado==='no-aplicable').map(l=>l.numero),a=area.current;if(!malos.length||!a)return;
  const actual=texto.slice(0,a.selectionStart).split('\n').length,n=d>0?(malos.find(n=>n>actual)??malos[0]!):([...malos].reverse().find(n=>n<actual)??malos.at(-1)!),partes=texto.split('\n'),inicio=partes.slice(0,n-1).reduce((s,l)=>s+l.length+1,0);a.focus();a.setSelectionRange(inicio,inicio+(partes[n-1]?.length??0));
 }
 useEffect(()=>{const opcion=p.estado.solicitud?.k==='opl'?p.estado.solicitud.opcion:undefined;if(!opcion)return;if(opcion==='salir'){cerrar();return;}if(opcion==='aplicar')aplicar();else if(opcion==='siguiente')siguiente(1);else if(opcion==='anterior')siguiente(-1);p.editor.solicitar({k:'opl'});},[p.estado.solicitud]);
 const signos={'ignorada-vacia':'·','sin-cambio':'=','aplicable':'+','no-aplicable':'×'};
 return <Dialogo titulo="Editar OPL" cerrar={cerrar}><div onKeyDown={e=>{if(despacharAtajo(p.editor,'editor-opl',{key:e.key,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey,altKey:e.altKey,editable:true,isComposing:e.isComposing}))e.preventDefault();}}><div class="resumen-plan" role="status">{plan.resumen.total} líneas · {plan.resumen.aplicables} aplicables · {plan.resumen.noAplicables} no aplicables · {plan.resumen.ignoradas} ignoradas · {plan.resumen.sinCambio} sin cambio</div><div class="edicion-opl"><ol class="canaleta" aria-label="Estado de cada línea">{plan.lineas.map(l=><li title={l.detalle||l.razon||l.estado} class={l.estado}>{l.numero} {signos[l.estado]}</li>)}</ol><textarea ref={area} autoFocus onScroll={e=>{const canaleta=e.currentTarget.previousElementSibling;if(canaleta)canaleta.scrollTop=e.currentTarget.scrollTop;}} aria-label="Texto OPL" wrap="off" spellcheck={false} value={texto} onInput={e=>cambiar(e.currentTarget.value)}/></div><div class="errores-plan">{plan.lineas.filter(l=>l.estado==='no-aplicable').map(l=><p key={l.numero}>Línea {l.numero}: {l.detalle||l.razon}</p>)}</div>{error&&<p role="alert">{error}</p>}<button disabled={!plan.acciones.length||p.estado.modo!=='edicion'} onClick={aplicar}>{plan.acciones.length?`Aplicar ${plan.acciones.length} cambio${plan.acciones.length===1?'':'s'}`:'Sin cambios aplicables'}</button></div></Dialogo>;
}
