import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { DatosRanura } from './Editor';
import type { Camara, Seleccion } from '../editor/estado';
import { COMANDOS } from '../editor/comandos';
import type { ContextoComando } from '../editor/comandos';
import { despacharAtajo } from '../editor/atajos';
import { reducirGesto } from '../editor/gestos';
import type { Gesto, EventoLienzo } from '../editor/gestos';
import { indice, claveNombre } from '../nucleo/indice';
import { tiposLegales, MATRIZ } from '../nucleo/matriz';
import type { TeclaComando } from '../editor/atajos';
import type { Editor as Controlador } from '../editor/estado';
import type { Ref, ModoDespliegue } from '../nucleo/tipos';
import { validarNombreCosa, validarNombreEstado } from '../nucleo/lexico';
import { colocar } from '../nucleo/colocacion';
import { escena } from '../opd/escena';
import type { Punto, Rect } from '../opd/escena';
import { dibujar } from '../opd/dibujo';
import { SvgPreact } from './SvgPreact';
import { CapaUi } from './CapaUi';
import { NombreEnLinea } from './NombreEnLinea';
import { MenuTipoEnlace, confirmarDatos } from './MenuTipoEnlace';
import { MenuContextual } from './MenuContextual';
import { Dialogo } from './Dialogo';
const VACIA = (): Seleccion => ({ cosas: [], estados: [], enlaces: [], abanicos: [] });
export function puntoModelo(p: Punto, c: Camara): Punto { return { x: (p.x-c.x)/c.zoom, y: (p.y-c.y)/c.zoom }; }
export function seleccionarRef(s: Seleccion, ref: Ref | null, alternar: boolean): Seleccion {
    if (!ref) return VACIA();
    const k=ref.tipo==='cosa'?'cosas':ref.tipo==='estado'?'estados':ref.tipo==='enlace'?'enlaces':ref.tipo==='abanico'?'abanicos':null;
    if(!k)return s; const previo=alternar?s:VACIA();
    return {...previo,[k]:alternar&&previo[k].includes(ref.id)?previo[k].filter(id=>id!==ref.id):[...previo[k],ref.id]};
}
export function refCercana(elemento: Element | null): Ref | null {
    const v=elemento?.closest('[data-ref]')?.getAttribute('data-ref'); if(!v)return null;
    const i=v.indexOf(':'),tipo=v.slice(0,i),id=v.slice(i+1);
    return ['cosa','estado','enlace','abanico','opd'].includes(tipo)?{tipo:tipo as Ref['tipo'],id}:null;
}
export function despacharLienzo(editor:Controlador, contexto:ContextoComando, ev:TeclaComando):boolean {
    return despacharAtajo(editor,contexto,ev)||(contexto!=='lienzo'&&despacharAtajo(editor,'lienzo',ev));
}
export function Lienzo(p: DatosRanura) {
    const m=p.estado.modelo!,opd=p.estado.opd,idx=indice(m),e=useMemo(()=>escena(m,opd),[m,opd]),canon=p.estado.modo==='estatico';
    const contenedor=m.opds[opd]!, host=useRef<HTMLDivElement>(null), svg=useRef<SVGSVGElement>(null);
    const [gesto,fijar]=useState<Gesto>({k:'reposo'}),actual=useRef<Gesto>(gesto),[hover,realzar]=useState<Ref|null>(null),[menu,contextual]=useState<Punto|null>(null);
    const [ocultos,mostrarOcultos]=useState<string|null>(null);
    const [edicion,editar]=useState<{ref:Ref;valor:string;inversa?:string;en:Punto}|null>(null),[despliegue,desplegar]=useState(false),[buscar,busqueda]=useState<string|null>(null),[eliminar,confirmarEliminar]=useState(false),[estadoBorrar,borrarEstado]=useState<string|null>(null),[cambiando,cambiarEnlace]=useState<string|null>(null);
    const dedos=useRef(new Map<number,Punto>()),pellizco=useRef<{distancia:number;centro:Punto;camara:Camara}|null>(null);
    const bandaDrag=useRef<{desde:Punto;x:number}|null>(null);
    const [tipoRefinador,fijarTipoRefinador]=useState<'objeto'|'proceso'>('objeto'),tiposCadena=useRef<Array<'objeto'|'proceso'>>([]);
    const cursor=useRef<Punto>({x:0,y:0}),espacio=useRef(false),captura=useRef<number|null>(null),origenResize=useRef<Rect|null>(null);
    const cambiar=(g:Gesto)=>{actual.current=g;fijar(g);};
    const pantalla=(punto:Punto)=>({x:punto.x*p.estado.camara.zoom+p.estado.camara.x,y:punto.y*p.estado.camara.zoom+p.estado.camara.y});
    const local=(ev:{clientX:number;clientY:number})=>{const r=host.current!.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top};};
    const centroVista=()=>puntoModelo({x:(host.current?.clientWidth??800)/2,y:(host.current?.clientHeight??600)/2},p.editor.obtener().camara);
    const caja=(ref:Ref):Rect|undefined=>ref.tipo==='estado'?e.nodos.flatMap(n=>n.estados).find(s=>s.ref.id===ref.id)?.caja:e.nodos.find(n=>n.ref.id===ref.id)?.caja;
    const extremo=(ref:Ref)=>ref.tipo==='estado'?{cosa:idx.estadoDe.get(ref.id)!.objeto,estado:ref.id}:{cosa:ref.id};
    const nombreRef=(ref:Ref)=>ref.tipo==='estado'?m.cosas[idx.estadoDe.get(ref.id)!.objeto]!.tipo==='objeto'?e.nodos.flatMap(n=>n.estados).find(s=>s.ref.id===ref.id)?.nombre??'Estado':'Estado':m.cosas[ref.id]?.nombre??ref.id;
    function iniciarCreacion(tipo:'objeto'|'proceso',nombre='') {
        const pos=colocar(m,opd,{ancho:135,alto:60},cursor.current.x||cursor.current.y?cursor.current:centroVista());
        const bandas=contenedor.tipo==='descomposicion'&&tipo==='proceso'?banda(pos.y):undefined;
        cambiar({k:'creando',tipo,en:pos,nombre,...(bandas&&'banda'in bandas?{banda:{indice:bandas.banda,paralelo:true}}:{})});
    }
    function aplicar(r:ReturnType<typeof reducirGesto>) {
        cambiar(r.gesto);if(r.camara)p.editor.fijarCamara(r.camara);
        if(r.acciones.length){if(p.editor.obtener().modo==='gestion-modal')p.editor.fijarModo('edicion');
            if(r.acciones.length===1)p.editor.ejecutar(r.acciones[0]!,r.gestoId?{gesto:r.gestoId}:undefined);else p.editor.ejecutarVarias(r.acciones,'Gesto de lienzo');}
    }
    function evento(ev:EventoLienzo) {
        const s=p.editor.obtener(), g=actual.current;
        if(!s.modelo)return;
        if(g.k==='encadenando'&&g.modo==='refinadores'&&ev.k==='tecla'&&ev.tecla==='Tab'&&contenedor.tipo==='despliegue'&&contenedor.modo==='exhibicion'){
            fijarTipoRefinador(t=>t==='objeto'?'proceso':'objeto');return;
        }
        const r=reducirGesto(s.modelo,s.opd,g,ev);
        if(g.k==='menuTipo'&&r.acciones.some(a=>a.op==='crearEnlace')){const i=ev.k==='elegir'?ev.indice:ev.k==='tecla'&&/^[1-9]$/.test(ev.tecla)?Number(ev.tecla)-1:g.elegida??0;const o=g.opciones[i];if(o)try{localStorage.setItem(`opforja.enlace.${m.cosas[g.desde.cosa]?.tipo}.${m.cosas[g.hacia.cosa]?.tipo}`,JSON.stringify({tipo:o.tipo,sentido:o.sentido}));}catch{}}
        if(g.k==='encadenando'&&g.modo==='refinadores') {
            if(ev.k==='tecla'&&ev.tecla==='Enter'&&g.actual&&!validarNombreCosa(g.actual))tiposCadena.current.push(tipoRefinador);
            if(r.acciones.some(a=>a.op==='agregarRefinadores')) {
                const nombres=r.acciones.flatMap(a=>a.op==='agregarRefinadores'?[...a.args.nombres]:[]);
                const tipos=nombres.map((_,i)=>tiposCadena.current[i]??tipoRefinador);
                const grupos:Array<{tipo:'objeto'|'proceso';nombres:string[]}>=[];
                nombres.forEach((nombre,i)=>{const tipo=tipos[i]!;if(grupos.at(-1)?.tipo===tipo)grupos.at(-1)!.nombres.push(nombre);else grupos.push({tipo,nombres:[nombre]});});
                aplicar({...r,acciones:grupos.map(a=>({op:'agregarRefinadores' as const,args:{opd:g.opd,...a}}))});tiposCadena.current=[];return;
            }
        }
        aplicar(r);
    }
    function cancelar() {cambiar({k:'reposo'});editar(null);busqueda(null);contextual(null);desplegar(false);confirmarEliminar(false);borrarEstado(null);cambiarEnlace(null);mostrarOcultos(null);p.editor.solicitar(null);if(p.editor.obtener().modo==='gestion-modal')p.editor.fijarModo('edicion');host.current?.focus();}
    function contexto():ContextoComando {const s=p.editor.obtener().seleccion;if(s.estados.length)return'estado';if(s.abanicos.length)return'abanico';if(s.simbolo)return'simbolo';if(s.enlaces.length>1)return'multiple';if(s.enlaces.length)return'enlace';const c=m.cosas[s.cosas[0]??''];if(!c)return'lienzo';return idx.subprocesoDe.has(c.id)?'subproceso':e.nodos.find(n=>n.ref.id===c.id)?.contenedor?'contenedor':c.tipo==='objeto'?'objeto':'proceso';}
    function banda(y:number):{banda:number}|{nuevaBandaAntesDe:number}|null {
        if(contenedor.tipo!=='descomposicion')return null;
        const filas=contenedor.bandas.map((b,i)=>({i,y:e.nodos.find(n=>b.includes(n.ref.id))?.caja.y??0}));
        const cerca=filas.find(b=>Math.abs(y-(b.y+30))<40); if(cerca)return{banda:cerca.i};
        const i=filas.findIndex(b=>y<b.y+30);return{nuevaBandaAntesDe:i<0?filas.length:i};
    }
    useEffect(()=>{cambiar({k:'reposo'});editar(null);contextual(null);},[opd]);
    const previoGesto=useRef(gesto.k);
    useEffect(()=>{if(gesto.k==='reposo'&&previoGesto.current!=='reposo'&&!document.querySelector('dialog[open]'))host.current?.focus();previoGesto.current=gesto.k;},[gesto.k]);
    useEffect(()=>{if(p.estado.modo==='navegacion'||p.estado.modo==='estatico'){cambiar({k:'reposo'});editar(null);contextual(null);}},[p.estado.modo]);
    useEffect(()=>{
        const s=p.estado.solicitud;if(!s)return;const ref=s.refs?.[0]??(p.estado.seleccion.estados[0]?{tipo:'estado' as const,id:p.estado.seleccion.estados[0]}:p.estado.seleccion.cosas[0]?{tipo:'cosa' as const,id:p.estado.seleccion.cosas[0]}:null);
        if(s.k==='crear'){iniciarCreacion(s.tipo??'objeto',s.texto??'');p.editor.solicitar(null);}
        else if(s.k==='estado'&&ref){cambiar({k:'estado',objeto:ref.tipo==='estado'?idx.estadoDe.get(ref.id)!.objeto:ref.id,nombre:''});p.editor.solicitar(null);}
        else if(s.k==='renombrar'&&ref){const b=caja(ref);editar({ref,valor:nombreRef(ref),en:b?pantalla({x:b.x,y:b.y}):{x:24,y:60}});p.editor.solicitar(null);}
        else if(s.k==='enlace'&&s.opcion==='buscar-o-crear'){busqueda((buscar??'')+(s.texto??''));p.editor.solicitar(null);}
        else if(s.k==='enlace'&&ref){cambiar({k:'conectando',desde:extremo(ref),punto:cursor.current});p.editor.solicitar(null);}
        else if(s.k==='encadenar'||s.k==='refinador'){tiposCadena.current=[];fijarTipoRefinador('objeto');cambiar({k:'encadenando',opd,bandas:[],actual:'',modo:contenedor.tipo==='despliegue'?'refinadores':'subprocesos',...(s.gesto?{id:s.gesto}:{})});p.editor.solicitar(null);}
        else if(s.k==='desplegar'){desplegar(true);p.editor.solicitar(null);}
        else if(s.k==='multiplicidad'){
            const acciones=p.estado.seleccion.enlaces.map(enlace=>{const z=m.enlaces[enlace]!,roles=MATRIZ[z.tipo].mult;const ex=s.opcion==='origen'?'origen':roles==='refinador'?'refinador':'objeto';const valor=ex==='origen'&&'multOrigen'in z?z.multOrigen:'mult'in z?z.mult:undefined;const vals=[null,'?','*','+'] as const;return {op:'fijarMultiplicidad' as const,args:{enlace,extremo:ex as 'origen'|'refinador'|'objeto',valor:vals[(vals.indexOf(valor??null)+1)%4]!}};});
            if(acciones.length)p.editor.ejecutarVarias(acciones,'Multiplicidad de selección');p.editor.solicitar(null);
        }
        else if(s.k==='tipo'&&s.opcion==='confirmar-eliminar'){confirmarEliminar(true);p.editor.solicitar(null);}
        else if(s.k==='tipo'&&s.opcion==='coleccion-incompleta'&&p.estado.seleccion.simbolo){const z=e.simbolos.find(z=>z.clave===p.estado.seleccion.simbolo);if(z&&z.relacion!=='clasificacion')p.editor.ejecutar({op:'fijarIncompleta',args:{cosa:z.refinable,relacion:z.relacion,activa:!m.cosas[z.refinable]?.incompleta?.includes(z.relacion)}});p.editor.solicitar(null);}
        else if(s.k==='tipo'&&p.estado.seleccion.enlaces.length){const z=e.aristas.find(z=>z.ref.id===p.estado.seleccion.enlaces[0]);const extremos=z?.tramos[0]?.extremos;if(extremos?.length===2){const t=z!.tramos[0]!,desde={cosa:extremos[0]!,...(t.estados?.[0]?{estado:t.estados[0]}:{})},hacia={cosa:extremos[1]!,...(t.estados?.[1]?{estado:t.estados[1]}:{})};cambiarEnlace(z!.ref.id);cambiar({k:'menuTipo',desde,hacia,opciones:tiposLegales(m,{opd,desde,hacia})});}p.editor.solicitar(null);}
        else if(s.k==='camara'){espacio.current=true;p.editor.solicitar(null);}
    },[p.estado.solicitud]);
    useEffect(()=>{const modal=despliegue||eliminar||estadoBorrar!==null||ocultos!==null||buscar!==null;if(modal&&p.editor.obtener().modo==='edicion')p.editor.fijarModo('gestion-modal');return()=>{if(modal&&p.editor.obtener().modo==='gestion-modal')p.editor.fijarModo('edicion');};},[despliegue,eliminar,estadoBorrar,ocultos,buscar]);
    function teclado(ev:KeyboardEvent,enMenu=false) {
        if(ev.defaultPrevented||ev.isComposing)return;const target=ev.target instanceof Element?ev.target:null;if(target?.closest('dialog')&&!enMenu)return;const g=actual.current;
        if(g.k!=='reposo'&&['Escape','Enter','Tab','ArrowUp','ArrowDown'].includes(ev.key)||g.k==='menuTipo'&&/^[1-9]$/.test(ev.key)) {ev.preventDefault();ev.stopPropagation();evento({k:'tecla',tecla:ev.key,mayus:ev.shiftKey,ctrl:ev.ctrlKey,alt:ev.altKey});return;}
        if(target?.matches('input,textarea,select,[contenteditable=true]'))return;
        if(ev.key==='Tab'&&g.k==='reposo'&&target?.closest('[data-ref^="cosa:"]')){const ref=refCercana(target),i=ordenFoco.indexOf(ref?.id??'');const id=ordenFoco[(i+(ev.shiftKey?-1:1)+ordenFoco.length)%ordenFoco.length];if(id){ev.preventDefault();host.current?.querySelector<SVGElement>(`[role="img"][data-ref="cosa:${CSS.escape(id)}"]`)?.focus();}return;}
        if(ev.key==='Delete'&&contexto()==='estado'){const id=p.editor.obtener().seleccion.estados[0];if(id&&e.aristas.some(a=>a.tramos.some(t=>t.estados?.includes(id)))){ev.preventDefault();borrarEstado(id);return;}}
        if(ev.key.toUpperCase()==='R'&&contexto()==='estado'&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){const id=p.editor.obtener().seleccion.estados[0]!;cambiar({k:'conectando',desde:extremo({tipo:'estado',id}),punto:cursor.current});ev.preventDefault();return;}
        if(ev.key===' '){ev.preventDefault();espacio.current=true;return;}
        const ctx=g.k==='conectando'?'modo-enlace':contexto();
        if((g.k==='reposo'?despacharLienzo:despacharAtajo)(p.editor,ctx,{key:ev.key,ctrlKey:ev.ctrlKey,metaKey:ev.metaKey,shiftKey:ev.shiftKey,altKey:ev.altKey,isComposing:ev.isComposing})){ev.preventDefault();ev.stopPropagation();}
    }
    useEffect(() => { const up = (ev: KeyboardEvent) => { if (ev.key === ' ') espacio.current = false; }; window.addEventListener('keyup', up); return () => window.removeEventListener('keyup', up); }, []);
    function abajo(ev:PointerEvent) {
        if(ev.button===2||p.estado.modo==='gestion-modal'||canon||(ev.target instanceof Element&&ev.target.closest('dialog')))return;host.current?.focus();const pos=local(ev),pt=puntoModelo(pos,p.estado.camara);cursor.current=pt;
        if(actual.current.k==='creando'&&ev.button===0){cambiar({...actual.current,en:pt});host.current?.querySelector<HTMLInputElement>('.nombre-en-linea input')?.focus();ev.preventDefault();return;}
        if(ev.pointerType==='touch'){dedos.current.set(ev.pointerId,pos);if(dedos.current.size===2){const [a,b]=[...dedos.current.values()];pellizco.current={distancia:Math.hypot(b!.x-a!.x,b!.y-a!.y),centro:{x:(a!.x+b!.x)/2,y:(a!.y+b!.y)/2},camara:p.editor.obtener().camara};cambiar({k:'reposo'});host.current?.setPointerCapture(ev.pointerId);return;}}
        const target=ev.target instanceof Element?ev.target:null,ref=refCercana(target),ui=target?.closest('[data-ui]')?.getAttribute('data-ui');
        if(ev.button===1||espacio.current){cambiar({k:'desplazando',desde:pos,camara:p.estado.camara});}
        else if(p.estado.modo==='edicion'&&ui==='conectar'&&ref){cambiar({k:'conectando',desde:extremo(ref),punto:pt});}
        else if(p.estado.modo==='edicion'&&ui==='reanclar'){const asa=target!.closest('[data-ui]')!;cambiar({k:'reanclando',enlace:asa.getAttribute('data-enlace')!,extremo:asa.getAttribute('data-extremo')==='origen'?'origen':'destino',punto:pt});}
        else if(p.estado.modo==='edicion'&&ui==='resize'&&ref){const b=caja(ref);if(b){origenResize.current=b;cambiar({k:'redimensionando',cosa:ref.id,caja:b});}}
        else if(actual.current.k==='conectando'){evento({k:'mover',punto:pt,mayus:ev.shiftKey,...(ref?{sobre:`${ref.tipo}:${ref.id}`}:{})});evento({k:'arriba',punto:pt,mayus:ev.shiftKey,...(ref?{sobre:`${ref.tipo}:${ref.id}`}:{})});return;}
        else if(target?.closest('[data-ref]')?.getAttribute('data-ref')?.startsWith('simbolo:')){p.editor.seleccionar({...VACIA(),simbolo:target.closest('[data-ref]')!.getAttribute('data-ref')!});}
        else if(p.estado.modo==='edicion'&&ref?.tipo==='cosa'&&e.nodos.some(n=>n.ref.id===ref.id&&n.chipOcultos&&pt.x>=n.chipOcultos.caja.x&&pt.x<=n.chipOcultos.caja.x+n.chipOcultos.caja.ancho&&pt.y>=n.chipOcultos.caja.y&&pt.y<=n.chipOcultos.caja.y+n.chipOcultos.caja.alto)){mostrarOcultos(ref.id);return;}
        else {const s=p.editor.obtener().seleccion;const conservar=ref?.tipo==='cosa'&&s.cosas.includes(ref.id)&&!ev.shiftKey;p.editor.seleccionar(conservar?s:seleccionarRef(s,ref,ev.shiftKey));
            if(ref?.tipo==='cosa'&&p.estado.modo==='edicion'&&!ev.shiftKey){if(idx.subprocesoDe.has(ref.id)){bandaDrag.current={desde:pt,x:contenedor.apariciones[ref.id]!.x};cambiar({k:'banda',proceso:ref.id,destino:null});}else cambiar({k:'arrastrando',cosas:conservar?s.cosas:[ref.id],desde:pt,delta:{x:0,y:0}});}}
        if(ev.button===0||ev.button===1){captura.current=ev.pointerId;host.current?.setPointerCapture(ev.pointerId);}ev.preventDefault();
    }
    function mover(ev:PointerEvent) {
        const pos=local(ev),pt=puntoModelo(pos,p.estado.camara);cursor.current=pt;
        if(dedos.current.has(ev.pointerId)){dedos.current.set(ev.pointerId,pos);if(pellizco.current&&dedos.current.size===2){const [a,b]=[...dedos.current.values()],q=pellizco.current,c=q.camara,z=Math.max(.2,Math.min(3,c.zoom*Math.hypot(b!.x-a!.x,b!.y-a!.y)/q.distancia));p.editor.fijarCamara({zoom:z,x:(a!.x+b!.x)/2-(q.centro.x-c.x)*z/c.zoom,y:(a!.y+b!.y)/2-(q.centro.y-c.y)*z/c.zoom});return;}}
        const target=document.elementFromPoint(ev.clientX,ev.clientY),ref=refCercana(target);
        realzar(ref);p.editor.realzar(ref?[ref,...(ref.tipo==='enlace'?e.aristas.find(a=>a.ref.id===ref.id)?.hechos.map(id=>({tipo:'enlace' as const,id}))??[]:[])]:[]);
        const g=actual.current;
        if(g.k==='redimensionando'&&origenResize.current){const b=origenResize.current;cambiar({...g,caja:{...b,ancho:Math.max(40,Math.round(pt.x-b.x)),alto:Math.max(30,Math.round(pt.y-b.y))}});}
        else if(g.k==='banda')cambiar({...g,destino:banda(pt.y)});
        else if(g.k!=='reposo')evento({k:'mover',punto:g.k==='desplazando'?pos:pt,mayus:ev.shiftKey,...(ref?{sobre:`${ref.tipo}:${ref.id}`}:{})});
    }
    function arriba(ev:PointerEvent) {
        if(dedos.current.delete(ev.pointerId)&&pellizco.current){pellizco.current=null;captura.current=null;return;}
        const g=actual.current;if(g.k==='reposo'){captura.current=null;if(host.current?.hasPointerCapture(ev.pointerId))host.current.releasePointerCapture(ev.pointerId);return;}const target=document.elementFromPoint(ev.clientX,ev.clientY),ref=refCercana(target),pt=puntoModelo(local(ev),p.estado.camara);
        if(g.k==='banda'&&bandaDrag.current&&g.destino){const origen=bandaDrag.current;p.editor.ejecutarVarias([{op:'moverSubproceso',args:{opd,proceso:g.proceso,destino:g.destino}},{op:'moverApariciones',args:{opd,mover:[{cosa:g.proceso,x:origen.x+pt.x-origen.desde.x,y:contenedor.apariciones[g.proceso]!.y}]}}],'Mover subproceso');bandaDrag.current=null;cambiar({k:'reposo'});}
        else if(g.k==='conectando'||g.k==='reanclando'||g.k==='arrastrando'||g.k==='banda'||g.k==='redimensionando'||g.k==='desplazando')evento({k:'arriba',punto:pt,mayus:ev.shiftKey,...(ref?{sobre:`${ref.tipo}:${ref.id}`}:{})});
        captura.current=null;if(host.current?.hasPointerCapture(ev.pointerId))host.current.releasePointerCapture(ev.pointerId);
    }
    function zoom(ratio:number){const c=p.editor.obtener().camara,z=Math.max(.2,Math.min(3,c.zoom*ratio)),x=(host.current?.clientWidth??800)/2,y=(host.current?.clientHeight??600)/2;p.editor.fijarCamara({zoom:z,x:x-(x-c.x)*z/c.zoom,y:y-(y-c.y)*z/c.zoom});}
    function doble(ev:MouseEvent) {if(p.estado.modo!=='edicion')return;const target=ev.target instanceof Element?ev.target:null,ref=refCercana(target);if(ref?.tipo==='enlace'){const z=m.enlaces[ref.id];if(z&&MATRIZ[z.tipo].etiquetas!=='ninguna')editar({ref,valor:'etiqueta'in z?z.etiqueta??'':'',...(MATRIZ[z.tipo].etiquetas==='doble'?{inversa:'inversa'in z?z.inversa:''}:{}),en:local(ev)});}else if(ref?.tipo==='estado'){editar({ref,valor:nombreRef(ref),en:local(ev)});}else if(ref?.tipo==='cosa'){p.editor.seleccionar(seleccionarRef(VACIA(),ref,false));despacharAtajo(p.editor,'cosa',{key:'Enter'});}else iniciarCreacion('objeto');}
    const ordenFoco=e.nodos.map(n=>n.ref.id).sort((a,b)=>m.cosas[a]!.nombre.localeCompare(m.cosas[b]!.nombre,'es'));
    const g=gesto,nombre=g.k==='creando'?g.nombre:g.k==='estado'?g.nombre:g.k==='encadenando'?g.actual:null;
    const nombrePos=g.k==='creando'?g.en:g.k==='estado'?{x:caja({tipo:'cosa',id:g.objeto})?.x??0,y:(caja({tipo:'cosa',id:g.objeto})?.y??0)+70}:g.k==='encadenando'?{x:(e.nodos.find(n=>n.contenedor)?.caja.x??0)+30,y:(e.nodos.find(n=>n.contenedor)?.caja.y??0)+64+g.bandas.length*100}:null;
    const existente=g.k==='creando'?Object.values(m.cosas).find(c=>claveNombre(c.nombre)===claveNombre(g.nombre)):undefined;
    const errorNombre=nombre===null?null:g.k==='estado'?validarNombreEstado(nombre):validarNombreCosa(nombre);
    const corregido=nombre?nombre[0]!.toLocaleUpperCase('es')+nombre.slice(1):'';
    function confirmarNombre(mayus=false){if(g.k==='creando'&&existente){if(existente.tipo===g.tipo){const r=p.editor.ejecutar({op:'traerCosa',args:{cosa:existente.id,opd,x:g.en.x,y:g.en.y}});if(r.ok)cancelar();}return;}evento({k:'tecla',tecla:'Enter',mayus,ctrl:false,alt:false});}
    function elegir(i:number,operador?:'XOR'|'OR'){const z=actual.current;if(z.k!=='menuTipo')return;const o=z.opciones[i];if(o?.legal==='pendiente')return;try{if(o)localStorage.setItem(`opforja.enlace.${m.cosas[z.desde.cosa]?.tipo}.${m.cosas[z.hacia.cosa]?.tipo}`,JSON.stringify({tipo:o.tipo,sentido:o.sentido}));}catch{}p.editor.fijarModo('edicion');if(cambiando&&o){const r=p.editor.ejecutar({op:'cambiarTipoEnlace',args:{enlace:cambiando,tipo:o.tipo}});if(r.ok)cancelar();return;}evento({k:'elegir',indice:i,...(operador?{operador}:{})});if(actual.current.k==='reposo')host.current?.focus();}
    useEffect(()=>{if(g.k==='menuTipo'){p.editor.fijarModo('gestion-modal');try{const ultimo=JSON.parse(localStorage.getItem(`opforja.enlace.${m.cosas[g.desde.cosa]?.tipo}.${m.cosas[g.hacia.cosa]?.tipo}`)??'null');const i=g.opciones.findIndex(o=>o.tipo===ultimo?.tipo&&o.sentido===ultimo?.sentido&&o.legal===true);if(i>=0&&g.elegida===undefined)cambiar({...g,elegida:i});}catch{}}},[g.k]);
    return <div class={`lienzo-interactivo modo-${p.estado.modo}`} ref={host} tabIndex={0} role="region" aria-label="Edición del diagrama" onKeyDown={teclado} onPointerDown={abajo} onPointerMove={mover} onPointerUp={arriba} onPointerCancel={()=>{dedos.current.clear();pellizco.current=null;bandaDrag.current=null;captura.current=null;cambiar({k:'reposo'});}} onLostPointerCapture={()=>{if(captura.current!==null){captura.current=null;cambiar({k:'reposo'});}}} onDblClick={doble} onContextMenu={ev=>{ev.preventDefault();if(p.estado.modo!=='edicion')return;const ref=refCercana(ev.target instanceof Element?ev.target:null);if(ref)p.editor.seleccionar(seleccionarRef(VACIA(),ref,false));cambiar({k:'reposo'});contextual(local(ev));p.editor.fijarModo('gestion-modal');}}>
        {!canon&&<div class="paleta-lienzo" onPointerDown={ev=>ev.stopPropagation()}><button disabled={p.estado.modo!=='edicion'} onClick={()=>cancelar()}>Seleccionar</button><button disabled={p.estado.modo!=='edicion'||!p.estado.seleccion.cosas.length&&!p.estado.seleccion.estados.length} onClick={()=>{const id=p.estado.seleccion.estados[0]??p.estado.seleccion.cosas[0];if(id)cambiar({k:'conectando',desde:extremo({tipo:p.estado.seleccion.estados.length?'estado':'cosa',id}),punto:cursor.current});}}>Conectar <kbd>R</kbd></button><button disabled={p.estado.modo!=='edicion'} onClick={()=>iniciarCreacion('objeto')}>Objeto <kbd>O</kbd></button><button disabled={p.estado.modo!=='edicion'} onClick={()=>iniciarCreacion('proceso')}>Proceso <kbd>P</kbd></button></div>}
        {!canon&&<div class="zoom-lienzo" onPointerDown={ev=>ev.stopPropagation()}><button aria-label="Alejar diagrama" onClick={()=>zoom(.9)}>−</button><output>{Math.round(p.estado.camara.zoom*100)}%</output><button aria-label="Acercar diagrama" onClick={()=>zoom(1.1)}>+</button><button onClick={()=>p.editor.encuadrar()}>Encuadrar</button></div>}
        <svg ref={svg} class="svg-lienzo" width="100%" height="100%" aria-label={`Diagrama ${m.nombre}`} onWheel={ev=>{ev.preventDefault();evento({k:'rueda',punto:local(ev),dx:ev.deltaX,dy:ev.deltaY,ctrl:ev.ctrlKey,camara:p.editor.obtener().camara});}}>
            <g transform={`translate(${p.estado.camara.x} ${p.estado.camara.y}) scale(${p.estado.camara.zoom})`}>
                <SvgPreact dibujo={dibujar(e,canon?'canon':'edicion')} {...(!canon?{atributos:(ref:string)=>{const r=refCercanaValor(ref);return r?.tipo==='cosa'?{tabIndex:0,role:'img','aria-label':`${m.cosas[r.id]?.tipo==='objeto'?'Objeto':'Proceso'} ${m.cosas[r.id]?.nombre}, ${m.cosas[r.id]?.esencia??'informacional'}`,onFocus:()=>p.editor.seleccionar(seleccionarRef(VACIA(),r,false))}:{ };}}:{})} />
                {p.estado.modo==='edicion'&&<CapaUi modelo={m} escena={e} seleccion={p.estado.seleccion} hover={hover} realce={p.estado.realce} gesto={g} zoom={p.estado.camara.zoom} legal={ref=>g.k!=='conectando'||tiposLegales(m,{opd,desde:g.desde,hacia:extremo(ref)}).some(o=>o.legal===true)} />}
            </g>
        </svg>
        {!e.nodos.length&&g.k==='reposo'&&<div class="vacio-lienzo">Crea un objeto o un proceso para comenzar. <kbd>O</kbd> <kbd>P</kbd></div>}
        {nombre!==null&&nombrePos&&<NombreEnLinea en={pantalla(nombrePos)} valor={nombre} titulo={g.k==='estado'?'Nombre del estado':g.k==='encadenando'?`Nombre siguiente${contenedor.tipo==='despliegue'&&contenedor.modo==='exhibicion'?` (${tipoRefinador==='objeto'?'atributo':'operación'})`:''}`:`Nombre del ${g.k==='creando'?g.tipo:'elemento'}`} cambiar={nombre=>evento({k:'nombre',nombre})} mensaje={existente?`Ya existe ${existente.nombre} (${existente.tipo}). ${g.k==='creando'&&existente.tipo===g.tipo?'↵ Traer misma identidad aquí':'Cambia el nombre o cancela'}`:errorNombre?.mensaje} {...(errorNombre&&corregido!==nombre&&!validarNombreCosa(corregido)&&g.k!=='estado'?{sugerencia:corregido}:{})} confirmar={()=>confirmarNombre()} cancelar={()=>evento({k:'tecla',tecla:'Escape',mayus:false,ctrl:false,alt:false})} tecla={ev=>{if(['Enter','Tab','Escape'].includes(ev.key)){ev.preventDefault();ev.stopPropagation();if(ev.key==='Enter')confirmarNombre(ev.shiftKey);else evento({k:'tecla',tecla:ev.key,mayus:ev.shiftKey,ctrl:ev.ctrlKey,alt:ev.altKey});}}} />}
        {edicion&&<NombreEnLinea en={edicion.en} valor={edicion.valor} titulo={edicion.ref.tipo==='estado'?'Renombrar estado':edicion.ref.tipo==='enlace'?'Etiqueta':'Renombrar cosa'} cambiar={valor=>editar({...edicion,valor})} {...(edicion.inversa!==undefined?{inversa:edicion.inversa,cambiarInversa:(inversa:string)=>editar({...edicion,inversa})}:{})} confirmar={()=>{const r=edicion.ref.tipo==='estado'?p.editor.ejecutar({op:'renombrarEstado',args:{estado:edicion.ref.id,nombre:edicion.valor}}):edicion.ref.tipo==='enlace'?p.editor.ejecutar({op:'fijarEtiqueta',args:{enlace:edicion.ref.id,etiqueta:edicion.valor||null,...(edicion.inversa!==undefined?{inversa:edicion.inversa}:{})}}):p.editor.ejecutar({op:'renombrarCosa',args:{cosa:edicion.ref.id,nombre:edicion.valor}});if(r.ok)editar(null);}} cancelar={()=>editar(null)} tecla={ev=>{if(ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();editar(null);}}} />}
        {g.k==='menuTipo'&&<MenuTipoEnlace modelo={m} opd={opd} gesto={g} cambio={!!cambiando} elegir={elegir} cancelar={cancelar} tecla={ev=>teclado(ev,true)} datos={(o,d)=>{const r=confirmarDatos(m,opd,g,o,d,cambiando??undefined);if(!r.acciones.length)return false;if(cambiando){p.editor.fijarModo('edicion');const cambiado=p.editor.ejecutar(r.acciones[0]!);if(cambiado.ok)cancelar();return cambiado.ok;}p.editor.fijarModo('edicion');aplicar(r);return true;}} />}
        {menu&&<MenuContextual editor={p.editor} estado={{...p.estado,modo:'edicion'}} contexto={contexto()} en={{x:Math.min(menu.x,(host.current?.clientWidth??800)-276),y:Math.min(menu.y,(host.current?.clientHeight??600)-160)}} cerrar={()=>{contextual(null);p.editor.fijarModo('edicion');host.current?.focus();}} ejecutar={c=>{if(c.id==='estado-eliminar'){const id=p.editor.obtener().seleccion.estados[0];if(id&&e.aristas.some(a=>a.tramos.some(t=>t.estados?.includes(id)))){borrarEstado(id);return;}}c.ejecutar(p.editor);}} />}
        {despliegue&&<Dialogo titulo="Desplegar por modo" cerrar={()=>desplegar(false)}>{(['agregacion','exhibicion','generalizacion','clasificacion'] as ModoDespliegue[]).map((modo,i)=><button onClick={()=>{const cosa=p.editor.obtener().seleccion.cosas[0];if(!cosa)return;p.editor.fijarModo('edicion');const r=p.editor.ejecutar({op:'desplegar',args:{opd,cosa,modo}});if(r.ok){desplegar(false);p.editor.navegar(r.valor.creados.find(id=>r.valor.modelo.opds[id])!);p.editor.solicitar({k:'encadenar'});}}}>{i+1} {modo}</button>)}</Dialogo>}
        {ocultos&&m.cosas[ocultos]?.tipo==='objeto'&&<Dialogo titulo="Estados ocultos" cerrar={()=>mostrarOcultos(null)}>{m.cosas[ocultos].estados.filter(s=>!e.nodos.find(n=>n.ref.id===ocultos)?.estados.some(v=>v.ref.id===s.id)).map(s=><button onClick={()=>{p.editor.fijarModo('edicion');const r=p.editor.ejecutarVarias([{op:'suprimirEstado',args:{estado:s.id,opd:null,activa:false}},{op:'suprimirEstado',args:{estado:s.id,opd,activa:false}}],'Mostrar estado');if(r.ok)mostrarOcultos(null);}}>{s.nombre} · Mostrar</button>)}</Dialogo>}
        {estadoBorrar&&<Dialogo titulo="Eliminar estado enlazado" cerrar={()=>borrarEstado(null)}><p>Los enlaces anclados a este estado quedarán sobre su objeto.</p><button onClick={()=>{p.editor.fijarModo('edicion');const r=p.editor.ejecutar({op:'eliminarEstado',args:{estado:estadoBorrar}});if(r.ok)borrarEstado(null);}}>Eliminar estado</button></Dialogo>}
        {eliminar&&<Dialogo titulo="Eliminar del modelo" cerrar={()=>confirmarEliminar(false)}><p>Se eliminarán {p.estado.seleccion.cosas.length} cosas, {p.estado.seleccion.cosas.reduce((n,id)=>{const c=m.cosas[id];return n+(c?.tipo==='objeto'?c.estados.length:0);},0)} estados y {Object.values(m.enlaces).filter(z=>p.estado.seleccion.cosas.some(id=>Object.values(z).includes(id))).length} enlaces; aparecen en {Object.values(m.opds).filter(o=>p.estado.seleccion.cosas.some(id=>o.apariciones[id])).length} OPDs. Quitar de este OPD conserva la cosa.</p><button class="peligro" onClick={()=>{p.editor.fijarModo('edicion');const r=p.editor.ejecutar({op:'eliminarCosas',args:{cosas:p.estado.seleccion.cosas}});if(r.ok)confirmarEliminar(false);}}>Eliminar definitivamente</button></Dialogo>}
        {buscar!==null&&g.k==='conectando'&&<Dialogo titulo="Destino del enlace" cerrar={()=>busqueda(null)}><input aria-label="Buscar destino" autoFocus value={buscar} onInput={ev=>busqueda(ev.currentTarget.value)} />{Object.values(m.cosas).filter(c=>contenedor.apariciones[c.id]&&claveNombre(c.nombre).includes(claveNombre(buscar))).map(c=><button onClick={()=>{p.editor.fijarModo('edicion');busqueda(null);evento({k:'arriba',punto:cursor.current,sobre:`cosa:${c.id}`,mayus:false});}}>{c.nombre}</button>)}{(['objeto','proceso'] as const).map(tipo=><button disabled={!!validarNombreCosa(buscar)} onClick={()=>{p.editor.fijarModo('edicion');const en=colocar(m,opd,{ancho:135,alto:60},{x:cursor.current.x,y:cursor.current.y+(tipo==='objeto'?-100:100)}),r=p.editor.ejecutar({op:'crearCosa',args:{opd,tipo,nombre:buscar,x:en.x,y:en.y}});if(r.ok){const cosa=r.valor.creados.find(id=>r.valor.modelo.cosas[id]);busqueda(null);if(cosa)evento({k:'arriba',punto:en,sobre:`cosa:${cosa}`,mayus:false});}}}>Crear {tipo} «{buscar}»</button>)}</Dialogo>}
        {g.k==='conectando'&&<p class="estado-gesto" role="status">Enlace: Tab recorre destinos · escribe nombre · ↵ tipo · ⎋</p>}
    </div>;
}
function refCercanaValor(v:string):Ref|null{const i=v.indexOf(':'),tipo=v.slice(0,i);return ['cosa','estado','enlace','abanico'].includes(tipo)?{tipo:tipo as Ref['tipo'],id:v.slice(i+1)}:null;}
