import {useState} from 'preact/hooks';
import {createPortal} from 'preact/compat';
import type {DatosRanura} from './Editor';
import type {Accion} from '../nucleo/operaciones';
import {aplicarAccion} from '../nucleo/operaciones';
import {indice} from '../nucleo/indice';
import {Dialogo} from './Dialogo';
import {textoUi,textoPlano} from './TextoUi';

const MODOS=['agregacion','exhibicion','generalizacion','clasificacion'] as const;
const NOMBRES:Readonly<Record<typeof MODOS[number],string>>={agregacion:'Agregación: partes',exhibicion:'Exhibición: rasgos',generalizacion:'Generalización: especializaciones',clasificacion:'Clasificación: instancias'};
export function DialogoDespliegue(p:DatosRanura&{cosa:string;cerrar:()=>void}) {
 const m=p.estado.modelo!,idx=indice(m),existente=idx.refinamientosDe.get(p.cosa)?.despliegue,nombre=m.cosas[p.cosa]?.nombre??'El elemento';
 const [error,fallar]=useState('');
 const probar=(opd:string)=>MODOS.map(modo=>{const accion:Accion={op:'desplegar',args:{opd,cosa:p.cosa,modo}};return{modo,accion,previa:aplicarAccion(m,accion)};});
 let origen=p.estado.opd,opciones=existente?[]:probar(origen);
 // La operación decide dónde puede refinarse; el diálogo busca ese origen entre los ancestros.
 while(!existente&&!opciones.some(o=>o.previa.ok)) {
  const o=m.opds[origen];if(!o||o.tipo==='raiz')break;
  origen=o.padre;opciones=probar(origen);
 }
 const rechazo=!opciones.some(o=>o.previa.ok)?opciones.find(o=>!o.previa.ok)?.previa:undefined;
 function abrir(opd:string,encadenar=false) {
  p.editor.fijarModo('edicion');p.cerrar();p.editor.navegar(opd,{seleccionar:[{tipo:'cosa',id:p.cosa}]});p.mostrarDestino?.();
  if(encadenar)p.editor.solicitar({k:'encadenar'});
  else queueMicrotask(()=>{const s=p.editor.obtener();if(s.opd===opd&&s.modo==='edicion')document.querySelector<HTMLElement>('.lienzo-interactivo')?.focus();});
 }
 function elegir(accion:Accion) {
  fallar('');p.editor.fijarModo('edicion');const r=p.editor.ejecutar(accion);
  if(!r.ok){p.editor.fijarModo('gestion-modal');fallar(r.rechazo.mensaje);return;}
  abrir(r.valor.creados.find(id=>r.valor.modelo.opds[id])!,true);
 }
 return createPortal(<Dialogo titulo="Desplegar (unfold) por modo" cerrar={p.cerrar}>
  {existente?<><p><strong>{nombre}</strong> ya tiene un despliegue en <strong>{idx.etiqueta.get(existente)}</strong>.</p><button onClick={()=>abrir(existente)}>Ir al despliegue</button></>:<>
   {origen!==p.estado.opd&&<p>El despliegue de <strong>{nombre}</strong> se creará desde <strong>{idx.etiqueta.get(origen)}</strong>.</p>}
   {rechazo&&!rechazo.ok&&<p role="alert">{textoUi(rechazo.rechazo.mensaje)}</p>}
   {opciones.map((o,i)=><button key={o.modo} disabled={!o.previa.ok} title={o.previa.ok?'':textoPlano(o.previa.rechazo.mensaje)} onClick={()=>elegir(o.accion)}>{i+1} {NOMBRES[o.modo]}</button>)}
  </>}
  {error&&<p role="alert">{textoUi(error)}</p>}
 </Dialogo>,document.body);
}
