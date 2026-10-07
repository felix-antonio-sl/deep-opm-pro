import {useEffect,useRef,useState} from 'preact/hooks';
import {generarModelo} from '../opl/generar';
import type {LineaOpl,TokenOpl} from '../opl/linea';
import type {Seleccion} from '../editor/estado';
import type {Ref} from '../nucleo/tipos';
import type {DatosRanura} from './Editor';
import {irRefs} from './ArbolOpd';
import {Dialogo} from './Dialogo';
export function refToken(t:TokenOpl):Ref|undefined{return t.hecho?{tipo:'enlace',id:t.hecho}:t.ref;}
export function filtrarLineas(lineas:readonly LineaOpl[],s:Seleccion):readonly LineaOpl[]{
 const ids=s.enlaces.length?s.enlaces:[...s.cosas,...s.estados,...s.abanicos];
 return ids.length?lineas.filter(l=>l.refs.some(r=>ids.includes(r.id))||l.hechos.some(id=>ids.includes(id))):lineas;
}
export function PanelOpl(p:DatosRanura){
 const m=p.estado.modelo!,[filtrar,filtro]=useState(false),[editar,edicion]=useState<{ref:Ref,texto:string,inversa?:boolean}|null>(null),[texto,cambiar]=useState(''),[error,fallar]=useState(''),lista=useRef<HTMLDivElement>(null);
 const todas=generarModelo(m,p.estado.vista),lineas=filtrar?filtrarLineas(todas,p.estado.seleccion):todas;
 const seleccion=[...p.estado.seleccion.cosas,...p.estado.seleccion.estados,...p.estado.seleccion.enlaces,...p.estado.seleccion.abanicos];
 useEffect(()=>{if(!seleccion.length)return;const primera=lineas.find(l=>l.opd===p.estado.opd&&(l.refs.some(r=>seleccion.includes(r.id))||l.hechos.some(id=>seleccion.includes(id))));lista.current?.querySelector<HTMLElement>(`[data-linea="${CSS.escape(primera?.id??'')}"]`)?.scrollIntoView({block:'nearest'});},[p.estado.seleccion,p.estado.opd]);
 function token(t:TokenOpl){if(!t.ref)return;const r=t.ref;
  if(r.tipo==='cosa'||r.tipo==='estado'){edicion({ref:r,texto:t.texto});cambiar(t.texto);fallar('');return;}
  if(r.tipo==='enlace'){const e=m.enlaces[r.id];if(e&&'etiqueta'in e&&t.texto===e.etiqueta){edicion({ref:r,texto:t.texto});cambiar(t.texto);fallar('');return;}if(e&&'inversa'in e&&t.texto===e.inversa){edicion({ref:r,texto:t.texto,inversa:true});cambiar(t.texto);fallar('');return;}p.editor.fijarPaneles({derecha:true});irRefs(p.editor,[r],p.estado.opd);}
 }
 function guardar(){if(!editar)return;const r=editar.ref;const a=r.tipo==='cosa'?{op:'renombrarCosa' as const,args:{cosa:r.id,nombre:texto}}:r.tipo==='estado'?{op:'renombrarEstado' as const,args:{estado:r.id,nombre:texto}}:{op:'fijarEtiqueta' as const,args:{enlace:r.id,etiqueta:editar.inversa&&m.enlaces[r.id]&&'etiqueta'in m.enlaces[r.id]!?(m.enlaces[r.id] as {etiqueta:string}).etiqueta:texto,...(editar.inversa?{inversa:texto}:{})}};const resultado=p.editor.ejecutar(a);if(resultado.ok)edicion(null);else fallar(`${resultado.rechazo.regla}: ${resultado.rechazo.mensaje}`);}
 return <div class="panel-opl"><div class="panel-cabecera"><h2>OPL</h2><button disabled={p.estado.modo!=='edicion'} onClick={()=>p.editor.solicitar({k:'opl'})}>Editar</button></div><div class="opciones-opl"><label><input type="checkbox" checked={filtrar} onChange={e=>filtro(e.currentTarget.checked)}/>Sólo selección</label><label>Esencia<select value={p.estado.vista.esencia} onChange={e=>p.editor.fijarVista({esencia:e.currentTarget.value as 'siempre'|'solo-difiere'|'oculta'})}><option value="siempre">Siempre</option><option value="solo-difiere">Si difiere</option><option value="oculta">Oculta</option></select></label><label><input type="checkbox" checked={p.estado.vista.numeracion} onChange={e=>p.editor.fijarVista({numeracion:e.currentTarget.checked})}/>Numeración</label></div><div ref={lista} class="oraciones">{lineas.map(l=><p key={l.id} data-linea={l.id} style={{paddingInlineStart:`${l.profundidad*12}px`}} class={`${l.plantilla==='cabecera'?'cabecera-opl':''} ${p.estado.lineasNuevas.includes(l.id)?'linea-nueva':''} ${l.refs.some(r=>p.estado.realce.some(x=>x.tipo===r.tipo&&x.id===r.id))||l.hechos.some(id=>p.estado.realce.some(x=>x.tipo==='enlace'&&x.id===id))?'linea-realzada':''}`}>
 {l.tokens.map((t,i)=><span key={i} class={`token ${t.marca??''} ${refToken(t)?'interactivo':''}`} {...(refToken(t)?{tabIndex:0,role:'button',onMouseEnter:()=>p.editor.realzar([refToken(t)!]),onMouseLeave:()=>p.editor.realzar([]),onFocus:()=>p.editor.realzar([refToken(t)!]),onBlur:()=>p.editor.realzar([]),onClick:()=>irRefs(p.editor,[refToken(t)!],l.opd),onDblClick:()=>{if(p.estado.modo==='edicion')token(t);},onKeyDown:(e:KeyboardEvent)=>{if(e.key==='Enter'){e.preventDefault();irRefs(p.editor,[refToken(t)!],l.opd);}if(e.key==='F2'&&p.estado.modo==='edicion'){e.preventDefault();token(t);}}}: {})}>{l.plantilla==='cabecera'?t.texto.replace(/^## /,''):t.texto}</span>)}
 </p>)}</div>{!lineas.length&&<p>No hay oraciones para esta selección.</p>}{editar&&<Dialogo titulo="Editar término OPL" cerrar={()=>edicion(null)}><form onSubmit={e=>{e.preventDefault();guardar();}}><label>Texto<input autoFocus value={texto} onInput={e=>cambiar(e.currentTarget.value)}/></label><button>Aplicar</button>{error&&<p role="alert">{error}</p>}</form></Dialogo>}</div>;
}
