import {useState} from 'preact/hooks';
import type {Modelo,Ref} from '../nucleo/tipos';
import {gatesExportacion} from '../nucleo/diagnostico';
import {opdsEnPreorden} from '../nucleo/proyeccion';
import {exportarV0} from '../codec/exportar';
import {generarDocumentoOpl} from '../opl/documento';
import {generarBloque} from '../opl/generar';
import {exportarDiagrama,exportarDocumento} from '../opd/exportar';
import {VERSION_BUNDLE} from '../editor/estado';
import type {DatosRanura} from './Editor';
import {Dialogo} from './Dialogo';
import {descargarTexto} from './Biblioteca';
import {irRefs} from './ArbolOpd';
export function prepararExportaciones(m:Modelo,opd:string){return {json:exportarV0(m),opl:generarDocumentoOpl(m),gatesSvg:gatesExportacion(m,{opd}),gatesHtml:gatesExportacion(m,'modelo'),svg:exportarDiagrama(m,opd,{version:VERSION_BUNDLE}),html:exportarDocumento(m,new Map(opdsEnPreorden(m).map(id=>[id,generarBloque(m,id)])),{version:VERSION_BUNDLE})};}
export function MenuExportar(p:DatosRanura & {cerrar:()=>void}){const m=p.estado.modelo!,x=prepararExportaciones(m,p.estado.opd),[error,fallar]=useState('');const ver=(refs:readonly Ref[])=>{irRefs(p.editor,refs);p.cerrar();};
 return <Dialogo titulo="Exportar" cerrar={p.cerrar}><p>Instantánea del estado actual. Las marcas del editor quedan fuera.</p><div class="exportaciones"><button onClick={()=>descargarTexto(x.json,`${m.nombre}.opforja.json`)}>Modelo JSON</button><button onClick={()=>descargarTexto(x.opl,`${m.nombre}.md`,'text/markdown')}>Documento OPL</button><button disabled={!!x.gatesSvg.length} onClick={()=>{if(x.svg.ok)descargarTexto(x.svg.valor.svg,x.svg.valor.archivo,'image/svg+xml');else fallar(x.svg.rechazo.mensaje);}}>OPD SVG · canon-diagrama</button>{x.gatesSvg.map(g=><p>{g.regla}: {g.mensaje} <button onClick={()=>ver(g.refs)}>Ir</button></p>)}{x.svg.ok&&x.svg.valor.advertencias.map(a=><p>{a.texto} <button onClick={()=>ver(a.refs)}>Ver</button></p>)}<button disabled={!!x.gatesHtml.length} onClick={()=>{if(x.html.ok)descargarTexto(x.html.valor.html,x.html.valor.archivo,'text/html');else fallar(x.html.rechazo.mensaje);}}>Documento HTML · canon-documento</button>{x.gatesHtml.map(g=><p>{g.regla}: {g.mensaje} <button onClick={()=>ver(g.refs)}>Ir</button></p>)}</div>{error&&<p role="alert">{error}</p>}</Dialogo>;
}
