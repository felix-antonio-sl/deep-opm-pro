import {useEffect,useState} from 'preact/hooks';
import {aplicarAccion} from '../nucleo/operaciones';
import type {Accion} from '../nucleo/operaciones';
import type {Modelo} from '../nucleo/tipos';
import {diagnosticar} from '../nucleo/diagnostico';
import type {Diagnostico} from '../nucleo/diagnostico';
import type {DatosRanura} from './Editor';
import {irRefs} from './ArbolOpd';
export function ordenarDiagnosticos(ds:readonly Diagnostico[],opd:string){return [...ds].sort((a,b)=>Number(b.opd===opd)-Number(a.opd===opd));}
export function accionesReparacion(m:Modelo,seleccion:readonly Diagnostico[]){
 const acciones:Accion[]=[];let candidato=m;
 for(const d of seleccion){const actual=diagnosticar(candidato).find(x=>x.codigo===d.codigo&&x.opd===d.opd&&x.refs.length===d.refs.length&&x.refs.every((r,i)=>r.tipo===d.refs[i]!.tipo&&r.id===d.refs[i]!.id));
  if(!actual?.reparacion)continue;const r=aplicarAccion(candidato,actual.reparacion);if(!r.ok)return {acciones:[] as Accion[],error:`${r.rechazo.regla}: ${r.rechazo.mensaje}`};acciones.push(actual.reparacion);candidato=r.valor.modelo;
 }return {acciones,error:''};
}
export function PanelDiagnostico(p:DatosRanura){const ds=ordenarDiagnosticos(diagnosticar(p.estado.modelo!),p.estado.opd),[elegidos,marcar]=useState<readonly Diagnostico[]>([]),[error,fallar]=useState('');
 useEffect(()=>{marcar([]);},[p.estado.modelo]);
 const aplicar=(d:readonly Diagnostico[])=>{const preparado=accionesReparacion(p.editor.obtener().modelo!,d);if(preparado.error){fallar(preparado.error);return;}const acciones=preparado.acciones;if(!acciones.length)return;const r=p.editor.ejecutarVarias(acciones,acciones.length===1?'Diagnóstico reparado':`${acciones.length} diagnósticos reparados`);if(r.ok){marcar([]);fallar('');}else fallar(`${r.rechazo.regla}: ${r.rechazo.mensaje}`);};
 return <div class="panel-diagnostico"><h2>Diagnóstico</h2>{(['error','warning','info'] as const).map(k=><section key={k}><h3>{k==='error'?'Bloqueos':k==='warning'?'Avisos':'Información'} ({ds.filter(d=>d.severidad===k).length})</h3>{ds.filter(d=>d.severidad===k).map((d,i)=><article key={`${d.codigo}:${d.opd}:${i}`}><p><strong>{d.regla}</strong> {d.mensaje}</p><small>{d.accion}</small><div><button onClick={()=>irRefs(p.editor,d.refs,d.opd)}>Ir</button>{d.reparacion&&<><button disabled={p.estado.modo!=='edicion'} onClick={()=>aplicar([d])}>Aplicar reparación</button><label><input type="checkbox" disabled={p.estado.modo!=='edicion'} checked={elegidos.includes(d)} onChange={e=>marcar(e.currentTarget.checked?[...elegidos,d]:elegidos.filter(x=>x!==d))}/>Incluir {d.codigo}</label></>}</div></article>)}</section>)}{elegidos.length>0&&<button disabled={p.estado.modo!=='edicion'} onClick={()=>aplicar(elegidos.filter(d=>ds.includes(d)))}>Aplicar a {elegidos.length}</button>}{error&&<p role="alert">{error}</p>}</div>;
}
