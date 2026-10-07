import type { Ref } from '../nucleo/tipos';
import type { EstadoEditor, Editor, SolicitudUI } from './estado';
import { aplicarAccion } from '../nucleo/operaciones';
import { indice } from '../nucleo/indice';
export type ContextoComando = 'global' | 'lienzo' | 'cosa' | 'objeto' | 'proceso' | 'contenedor' | 'estado' | 'enlace' | 'multiple' | 'abanico' | 'simbolo' | 'modo-enlace' | 'nombre' | 'biblioteca' | 'editor-opl' | 'subproceso' | 'encadenando' | 'menu-tipo';
export interface Comando {
    readonly id: string;
    readonly titulo: string;
    readonly atajo?: string;
    readonly contexto: ContextoComando;
    readonly menu?: 'contextual' | 'exportar';
    disponible(e: EstadoEditor): true | string; // string = motivo visible (deshabilitado)
    ejecutar(ed: Editor): void;
}
const todos: Comando[] = [];
let numeroGesto = 0;
const conModelo = (e: EstadoEditor): true | string => e.modelo ? true : 'Abre un modelo.';
const editar = (e: EstadoEditor): true | string => !e.modelo ? 'Abre un modelo.' : e.modo !== 'edicion' ? 'El lienzo no está en modo edición.' : true;
const cosas = (e: EstadoEditor): true | string => editar(e) !== true ? editar(e) : e.seleccion.cosas.length ? true : 'Selecciona una cosa.';
const refs = (e: EstadoEditor): readonly Ref[] => [...e.seleccion.cosas.map(id => ({ tipo: 'cosa' as const, id })), ...e.seleccion.estados.map(id => ({ tipo: 'estado' as const, id })), ...e.seleccion.enlaces.map(id => ({ tipo: 'enlace' as const, id })), ...e.seleccion.abanicos.map(id => ({ tipo: 'abanico' as const, id }))];
function comando(id: string, titulo: string, contexto: ContextoComando, atajo: string | undefined, disponible: Comando['disponible'], accion: (ed: Editor) => void) {
    todos.push({ id, titulo, contexto, ...(atajo ? { atajo } : {}), disponible, ejecutar(ed) { if (disponible(ed.obtener()) === true) accion(ed); } });
}
function pedir(id: string, titulo: string, contexto: ContextoComando, atajo: string | undefined, k: SolicitudUI['k'], disponible = editar, opcion?: string) {
    comando(id, titulo, contexto, atajo, disponible, ed => ed.solicitar({ k, refs: refs(ed.obtener()), ...(opcion ? { opcion } : {}) }));
}
comando('deshacer','Deshacer','global','Ctrl+Z',e=>editar(e)!==true?editar(e):e.pasado.length?true:'No hay cambios para deshacer.',ed=>ed.deshacer());
comando('rehacer','Rehacer','global','Ctrl+Shift+Z',e=>editar(e)!==true?editar(e):e.futuro.length?true:'No hay cambios para rehacer.',ed=>ed.rehacer());
comando('rehacer-y','Rehacer','global','Ctrl+Y',e=>editar(e)!==true?editar(e):e.futuro.length?true:'No hay cambios para rehacer.',ed=>ed.rehacer());
comando('guardar','Guardar ahora','global','Ctrl+S',conModelo,ed=>{void ed.guardarAhora();});
pedir('buscar','Buscar cosa u OPD','global','Ctrl+K','buscar',conModelo);
pedir('editar-opl','Editar OPL','global','Ctrl+E','opl');
pedir('ayuda','Ayuda','global','?','ayuda',()=>true);
comando('cancelar','Cancelar','global','Escape',()=>true,ed=>{if(ed.obtener().solicitud){ed.solicitar(null);if(ed.obtener().modo==='gestion-modal')ed.fijarModo('edicion');}else ed.seleccionar({cosas:[],estados:[],enlaces:[],abanicos:[]});});
pedir('desplazar','Desplazar lienzo','global',' ','camara',conModelo,'desplazar');
comando('encuadrar','Encuadrar','global','Ctrl+0',conModelo,ed=>ed.encuadrar());
for(const [id,titulo,atajo,ratio] of [['zoom-mas','Acercar','+',1.1],['zoom-menos','Alejar','-',1/1.1]] as const)comando(id,titulo,'global',atajo,conModelo,ed=>{const c=ed.obtener().camara;ed.fijarCamara({...c,zoom:c.zoom*ratio});});
comando('arbol','Mostrar árbol','global','Ctrl+\\',()=>true,ed=>ed.fijarPaneles({arbol:!ed.obtener().paneles.arbol}));
comando('columna','Mostrar columna derecha','global','Ctrl+.',()=>true,ed=>ed.fijarPaneles({derecha:!ed.obtener().paneles.derecha}));
comando('canon','Vista canon','global','F9',conModelo,ed=>ed.fijarModo(ed.obtener().modo==='estatico'?'edicion':'estatico'));
for(const [id,tecla,direccion] of [['padre','Alt+ArrowUp',0],['hermano-anterior','Alt+ArrowLeft',-1],['hermano-siguiente','Alt+ArrowRight',1]] as const) comando(id,'Navegar '+id,'global',tecla,e=>{if(!e.modelo)return 'Abre un modelo.';const o=e.modelo.opds[e.opd]!;if(o.tipo==='raiz')return 'No hay OPD padre.';if(direccion===0)return true;const hs=indice(e.modelo).hijosDe.get(o.padre)??[];return hs[hs.indexOf(o.id)+direccion]?true:'No hay hermano en esa dirección.';},ed=>{const e=ed.obtener(),o=e.modelo!.opds[e.opd]!;if(o.tipo==='raiz')return;const hs=indice(e.modelo!).hijosDe.get(o.padre)??[];ed.navegar(direccion===0?o.padre:hs[hs.indexOf(o.id)+direccion]!);});
for(const [tipo,tecla] of [['objeto','O'],['proceso','P']] as const)comando('crear-'+tipo,'Crear '+tipo,'lienzo',tecla,editar,ed=>ed.solicitar({k:'crear',tipo}));
pedir('renombrar','Renombrar','cosa','F2','renombrar',cosas);
comando('entrar','Entrar al refinamiento','cosa','Enter',cosas,ed=>{const e=ed.obtener(),id=e.seleccion.cosas[0]!,r=indice(e.modelo!).refinamientosDe.get(id),h=r?.descomposicion??r?.despliegue;if(h)ed.navegar(h);else ed.solicitar({k:'renombrar',refs:[{tipo:'cosa',id}]});});
pedir('modo-enlace','Conectar','cosa','R','enlace',cosas);
pedir('estado','Agregar estado','objeto','S','estado',e=>cosas(e)!==true?cosas(e):e.modelo!.cosas[e.seleccion.cosas[0]!]!.tipo==='objeto'?true:'Sólo objetos tienen estados.');
comando('descomponer','Descomponer','proceso','D',cosas,ed=>{const e=ed.obtener(),gesto=`cadena-${++numeroGesto}`,r=ed.ejecutar({op:'descomponer',args:{opd:e.opd,proceso:e.seleccion.cosas[0]!}},{gesto});if(r.ok){const opd=r.valor.creados[0]!;ed.navegar(opd);ed.solicitar({k:'encadenar',opcion:'subprocesos',gesto});}});
pedir('desplegar','Desplegar','cosa','U','desplegar',cosas);
pedir('encadenar','Nombres encadenados','contenedor','N','encadenar',conModelo);
for(const [id,tecla,op,campo,a,b] of [['esencia','Shift+F','fijarEsencia','esencia','fisica','informacional'],['afiliacion','Shift+A','fijarAfiliacion','afiliacion','sistemica','ambiental']] as const)comando(id,'Alternar '+id,'cosa',tecla,cosas,ed=>{const e=ed.obtener();ed.ejecutarVarias(e.seleccion.cosas.map(cosa=>op==='fijarEsencia'?{op,args:{cosa,esencia:e.modelo!.cosas[cosa]!.esencia===a?b as 'informacional':a as 'fisica'}}:{op,args:{cosa,afiliacion:e.modelo!.cosas[cosa]!.afiliacion===a?b as 'ambiental':a as 'sistemica'}}),'Alternar '+id);});
comando('quitar','Quitar de este OPD','cosa','Delete',cosas,ed=>{const e=ed.obtener();if(e.seleccion.cosas.length>=2)ed.solicitar({k:'tipo',opcion:'confirmar-quitar',refs:[...e.seleccion.cosas.map(id=>({tipo:'cosa' as const,id})),{tipo:'opd',id:e.opd}]});else ed.ejecutar({op:'quitarDeOpd',args:{opd:e.opd,cosas:e.seleccion.cosas}});});
pedir('eliminar-cosas','Eliminar del modelo','cosa','Shift+Delete','tipo',cosas,'confirmar-eliminar');
for(const [key,dx,dy] of [['ArrowLeft',-1,0],['ArrowRight',1,0],['ArrowUp',0,-1],['ArrowDown',0,1]] as const)for(const shift of [false,true])comando('mover-'+key+(shift?'-10':''),'Mover selección','cosa',(shift?'Shift+':'')+key,cosas,ed=>{const e=ed.obtener(),o=e.modelo!.opds[e.opd]!,idx=indice(e.modelo!);ed.ejecutar({op:'moverApariciones',args:{opd:e.opd,mover:e.seleccion.cosas.map(cosa=>{const a=o.apariciones[cosa]!;return {cosa,x:a.x+dx*(shift?10:1),y:a.y+(idx.subprocesoDe.has(cosa)?0:dy*(shift?10:1))};})}});});
for(const [key,delta,nueva] of [['[',-1,false],[']',1,false],['Shift+[',0,true],['Shift+]',1,true]] as const)comando('banda-'+key,'Mover banda','subproceso',key,cosas,ed=>{const e=ed.obtener(),proceso=e.seleccion.cosas[0]!,s=indice(e.modelo!).subprocesoDe.get(proceso);if(s)ed.ejecutar({op:'moverSubproceso',args:{opd:s.opd,proceso,destino:nueva?{nuevaBandaAntesDe:s.banda+delta}:{banda:s.banda+delta}}});});
const estadoDisponible=(e:EstadoEditor)=>editar(e)!==true?editar(e):e.seleccion.estados.length===1?true:'Selecciona un estado.';
for(const [id,tecla,designacion] of [['inicial','I','inicial'],['final','F','final'],['default','D','porDefecto']] as const)comando('estado-'+id,'Estado '+id,'estado',tecla,estadoDisponible,ed=>{const e=ed.obtener(),s=e.seleccion.estados[0]!,ubicacion=indice(e.modelo!).estadoDe.get(s)!;const objeto=e.modelo!.cosas[ubicacion.objeto]!;if(objeto.tipo==='objeto')ed.ejecutar({op:'designar',args:{estado:s,designacion,activa:designacion==='porDefecto'?objeto.porDefecto!==s:!objeto.estados[ubicacion.posicion]![designacion]}});});
comando('estado-ocultar','Ocultar aquí','estado','H',estadoDisponible,ed=>ed.ejecutar({op:'suprimirEstado',args:{estado:ed.obtener().seleccion.estados[0]!,opd:ed.obtener().opd,activa:true}}));
comando('estado-ocultar-todos','Ocultar en todos','estado','Shift+H',estadoDisponible,ed=>ed.ejecutar({op:'suprimirEstado',args:{estado:ed.obtener().seleccion.estados[0]!,opd:null,activa:true}}));
for(const [key,delta] of [['ArrowLeft',-1],['ArrowRight',1]] as const)comando('estado-orden-'+key,'Reordenar estado','estado',key,estadoDisponible,ed=>{const e=ed.obtener(),estado=e.seleccion.estados[0]!,s=indice(e.modelo!).estadoDe.get(estado);if(s)ed.ejecutar({op:'moverEstado',args:{estado,indice:s.posicion+delta}});});
pedir('estado-renombrar','Renombrar estado','estado','F2','renombrar',estadoDisponible);
comando('estado-eliminar','Eliminar estado','estado','Delete',estadoDisponible,ed=>ed.ejecutar({op:'eliminarEstado',args:{estado:ed.obtener().seleccion.estados[0]!}}));
const enlaceDisponible=(e:EstadoEditor)=>editar(e)!==true?editar(e):e.seleccion.enlaces.length?true:'Selecciona un enlace.';
for(const [control,tecla] of [['e','E'],['c','C']] as const)comando('control-'+control,'Control '+control,'enlace',tecla,enlaceDisponible,ed=>{const e=ed.obtener();ed.ejecutarVarias(e.seleccion.enlaces.map(enlace=>({op:'fijarControl' as const,args:{enlace,control:'control' in e.modelo!.enlaces[enlace]!&&e.modelo!.enlaces[enlace]!.control===control?null:control}})),'Fijar control');});
pedir('mult','Multiplicidad objeto/refinador','enlace','M','multiplicidad',enlaceDisponible,'objeto-refinador');
pedir('mult-origen','Multiplicidad origen','enlace','Shift+M','multiplicidad',enlaceDisponible,'origen');
pedir('cambiar-tipo','Cambiar tipo','enlace','Enter','tipo',enlaceDisponible);
comando('enlace-eliminar','Eliminar enlaces','enlace','Delete',enlaceDisponible,ed=>ed.ejecutar({op:'eliminarEnlaces',args:{enlaces:ed.obtener().seleccion.enlaces}}));
for(const [operador,key] of [['XOR','X'],['OR','Shift+X']] as const)comando('abanico-'+operador,'Formar '+operador,'multiple',key,e=>{if(editar(e)!==true)return editar(e);if(e.seleccion.enlaces.length<2)return 'Selecciona dos enlaces.';const r=aplicarAccion(e.modelo!,{op:'formarAbanico',args:{operador,enlaces:e.seleccion.enlaces}});return r.ok?true:r.rechazo.mensaje;},ed=>ed.ejecutar({op:'formarAbanico',args:{operador,enlaces:ed.obtener().seleccion.enlaces}}));
comando('abanico-alternar','Alternar operador','abanico','X',e=>editar(e)!==true?editar(e):e.seleccion.abanicos.length?true:'Selecciona un abanico.',ed=>{const e=ed.obtener(),abanico=e.seleccion.abanicos[0]!;ed.ejecutar({op:'fijarOperador',args:{abanico,operador:e.modelo!.abanicos[abanico]!.operador==='XOR'?'OR':'XOR'}});});
comando('abanico-disolver','Disolver abanico','abanico','Delete',e=>editar(e)!==true?editar(e):e.seleccion.abanicos.length?true:'Selecciona un abanico.',ed=>ed.ejecutar({op:'disolverAbanico',args:{abanico:ed.obtener().seleccion.abanicos[0]!}}));
pedir('coleccion','Colección incompleta','simbolo','I','tipo',editar,'coleccion-incompleta');
pedir('agregar-refinador','Agregar refinador','simbolo','Enter','refinador');
for(const [id,titulo,contexto,key,k,opcion] of [
 ['destino-siguiente','Destino siguiente','modo-enlace','Tab','enlace','siguiente'],['destino-crear','Crear destino','modo-enlace','Enter','enlace','menu'],['cancelar-enlace','Cancelar enlace','modo-enlace','Escape','enlace','cancelar'],
 ['nombre-confirmar','Confirmar nombre','nombre','Enter','renombrar','confirmar'],['nombre-otro','Confirmar y otro','nombre','Shift+Enter','renombrar','otro'],['nombre-tipo','Alternar tipo','nombre','Tab','crear','alternar-tipo'],['nombre-cancelar','Cancelar nombre','nombre','Escape','renombrar','cancelar'],
 ['cadena-siguiente','Banda siguiente','encadenando','Enter','encadenar','siguiente'],['cadena-misma','Misma banda','encadenando','Shift+Enter','encadenar','misma'],['cadena-terminar','Terminar cadena','encadenando','Escape','encadenar','terminar'],
 ['tipo-arriba','Tipo anterior','menu-tipo','ArrowUp','tipo','anterior'],['tipo-abajo','Tipo siguiente','menu-tipo','ArrowDown','tipo','siguiente'],['tipo-crear','Crear enlace','menu-tipo','Enter','tipo','crear'],['tipo-invertir','Otra orientación','menu-tipo','Tab','tipo','invertir'],
 ['opl-aplicar','Aplicar OPL','editor-opl','Ctrl+Enter','opl','aplicar'],['opl-siguiente','Siguiente no aplicable','editor-opl','Ctrl+ArrowDown','opl','siguiente'],['opl-anterior','Anterior no aplicable','editor-opl','Ctrl+ArrowUp','opl','anterior'],['opl-salir','Salir del OPL','editor-opl','Escape','opl','salir'],
 ['biblioteca-buscar','Buscar modelo','biblioteca','/','biblioteca','buscar'],['biblioteca-arriba','Modelo anterior','biblioteca','ArrowUp','biblioteca','anterior'],['biblioteca-abajo','Modelo siguiente','biblioteca','ArrowDown','biblioteca','siguiente'],['biblioteca-abrir','Abrir modelo','biblioteca','Enter','biblioteca','abrir'],['biblioteca-nuevo','Nuevo modelo','biblioteca','N','biblioteca','nuevo'],['biblioteca-importar','Importar modelo','biblioteca','I','importar','modelo'],['biblioteca-renombrar','Renombrar modelo','biblioteca','F2','biblioteca','renombrar'],['biblioteca-eliminar','Eliminar modelo','biblioteca','Delete','biblioteca','eliminar'],
] as const) {
    if (id === 'nombre-otro') comando(id,titulo,contexto,key,conModelo,ed=>ed.solicitar({k,refs:refs(ed.obtener()),opcion:ed.obtener().seleccion.estados.length?'confirmar':'otro'}));
    else pedir(id,titulo,contexto,key,k,contexto==='biblioteca'?()=>true:conModelo,opcion);
}
export const COMANDOS: readonly Comando[] = Object.freeze(todos);
