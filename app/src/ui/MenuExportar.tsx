import {useEffect,useState} from 'preact/hooks';
import type {Modelo,Ref} from '../nucleo/tipos';
import {gatesExportacion} from '../nucleo/diagnostico';
import {opdsEnPreorden} from '../nucleo/proyeccion';
import {exportarV0} from '../codec/exportar';
import {generarDocumentoOpl} from '../opl/documento';
import {generarBloque} from '../opl/generar';
import {estadosOmitidos,accionesExpresarEstados} from '../opl/estados-omitidos';
import {exportarDiagrama,exportarDocumento} from '../opd/exportar';
import {VERSION_BUNDLE} from '../editor/estado';
import type {Editor} from '../editor/estado';
import type {DatosRanura} from './Editor';
import {Dialogo} from './Dialogo';
import {descargarTexto} from './Biblioteca';
import {irRefs} from './ArbolOpd';
export function prepararExportaciones(m:Modelo,opd:string){return {json:exportarV0(m),opl:generarDocumentoOpl(m),estadosOmitidos:estadosOmitidos(m),gatesSvg:gatesExportacion(m,{opd}),gatesHtml:gatesExportacion(m,'modelo'),svg:exportarDiagrama(m,opd,{version:VERSION_BUNDLE}),html:exportarDocumento(m,new Map(opdsEnPreorden(m).map(id=>[id,generarBloque(m,id)])),{version:VERSION_BUNDLE})};}
export function expresarEstadosOmitidos(editor:Editor,modeloId:string){
 const m=editor.obtener().modelo;if(!m||m.id!==modeloId)return null;
 const acciones=accionesExpresarEstados(m);return acciones.length?editor.ejecutarVarias(acciones,'Expresar estados omitidos'):null;
}
export function MenuExportar(p:DatosRanura & {cerrar:()=>void}){const m=p.estado.modelo!,x=prepararExportaciones(m,p.estado.opd),[error,fallar]=useState(''),[modeloId]=useState(m.id);const ver=(refs:readonly Ref[])=>{irRefs(p.editor,refs);p.cerrar();};
 const expresar=()=>{const r=expresarEstadosOmitidos(p.editor,modeloId);if(!r||r.ok)p.cerrar();else fallar(r.rechazo.mensaje);};
 useEffect(()=>{if(m.id!==modeloId)p.cerrar();},[m.id,modeloId]);
 return <Dialogo titulo="Exportar" cerrar={p.cerrar}><p>Instantánea del estado actual. Las marcas del editor quedan fuera.</p><div class="exportaciones"><button onClick={()=>descargarTexto(x.json,`${m.nombre}.opforja.json`)}>Modelo JSON</button><button onClick={()=>descargarTexto(x.opl,`${m.nombre}.md`,'text/markdown')}>Documento OPL</button><button disabled={!!x.gatesSvg.length} onClick={()=>{if(x.svg.ok)descargarTexto(x.svg.valor.svg,x.svg.valor.archivo,'image/svg+xml');else fallar(x.svg.rechazo.mensaje);}}>OPD SVG · canon-diagrama</button>{x.gatesSvg.map(g=><p>{g.regla}: {g.mensaje} <button onClick={()=>ver(g.refs)}>Ir</button></p>)}{x.svg.ok&&x.svg.valor.advertencias.map(a=><p>{a.texto} <button onClick={()=>ver(a.refs)}>Ver</button></p>)}<button disabled={!!x.gatesHtml.length} onClick={()=>{if(x.html.ok)descargarTexto(x.html.valor.html,x.html.valor.archivo,'text/html');else fallar(x.html.rechazo.mensaje);}}>Documento HTML · canon-documento</button>{x.gatesHtml.map(g=><p>{g.regla}: {g.mensaje} <button onClick={()=>ver(g.refs)}>Ir</button></p>)}</div>{!!x.estadosOmitidos.length&&<section aria-label="Estados omitidos del documento OPL">
 <p>{x.estadosOmitidos.length} estados del modelo no aparecen en ningún bloque del documento OPL. Documento OPL expresa las vistas actuales: al importarlo en un modelo vacío, estos estados no se recuperan y un «afecta» puede quedar sin aplicar. Modelo JSON los conserva exactamente.</p>
 <ul>{x.estadosOmitidos.map(q=>{const c=m.cosas[q.objeto]!;return <li key={q.estado}><strong>{c.nombre}</strong>: {c.tipo==='objeto'&&c.estados.find(s=>s.id===q.estado)!.nombre}</li>;})}</ul>
 <p>Expresar estados omitidos muestra únicamente estos estados en sus apariciones existentes. Cambia las vistas del modelo y se puede deshacer en un paso. Después, vuelve a Exportar para descargar el documento actualizado.</p>
 <button disabled={p.estado.modo!=='edicion'} onClick={expresar}>Expresar estados omitidos</button>
 </section>}{error&&<p role="alert">{error}</p>}</Dialogo>;
}
