import {test,expect} from 'bun:test';
import {modeloCon,porNombre,must,congelar} from '../pruebas/constructores';
import {descomponer} from '../nucleo/refinamiento';
import {generarBloque} from '../opl/generar';
import {planificar} from '../opl/planificar';
import {exportarV0} from '../codec/exportar';
import {crearEditor} from '../editor/estado';
import {dependencias,configuracion,ciclos} from '../editor/pruebas.test';

test('T-031 árbol conserva preorden e IDs y navega sólo al destino instalado',async()=>{
 const {filasArbol}=await import('./ArbolOpd');
 const m=modeloCon({procesos:['Preparar']}),r=must(descomponer(m,{opd:m.raiz,proceso:porNombre(m,'Preparar').id,bandas:[['Recibir'],['Entregar']]}));
 const filas=filasArbol(r.modelo);expect(filas.map(f=>f.id)).toEqual([m.raiz,r.creados[0]!]);expect(filas.map(f=>f.profundidad)).toEqual([0,1]);expect(filas[1]!.nombre).toBe('Preparar');
 const {navegarRuta}=await import('./App');const d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);ed.ejecutar({op:'renombrarModelo',args:{nombre:'Edición pendiente'}});const base=ed.obtener().modelo!;d.cliente.guardar=async()=>({estado:503,error:'Sin conexión'});expect(await navegarRuta(ed,'inexistente','opd-inexistente')).toBe(false);expect(ed.obtener().modelo).toBe(base);expect(ed.obtener().opd).toBe(base.raiz);ed.cerrar();await ciclos();
});
test('T-244 OPL filtra por identidad con prioridad de enlaces, no por nombre',async()=>{
 const {filtrarLineas}=await import('./PanelOpl');const m=congelar(modeloCon({objetos:[['Pedido',['nuevo']]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]})),lineas=generarBloque(m,m.raiz),e=Object.keys(m.enlaces)[0]!,o=porNombre(m,'Pedido').id,antes=exportarV0(m);
 const s={cosas:[o],estados:[],enlaces:[e],abanicos:[]};const vistas=filtrarLineas(lineas,s);expect(vistas.length).toBeGreaterThan(0);expect(vistas.every(l=>l.hechos.includes(e)||l.refs.some(r=>r.tipo==='enlace'&&r.id===e))).toBe(true);expect(filtrarLineas(lineas,{...s,enlaces:[],cosas:[]})).toBe(lineas);expect(exportarV0(m)).toBe(antes);
});
test('T-011 edición OPL replantea contra base actual y aplica una vez con undo real',async()=>{
 const {planVigente}=await import('./EditorOpl');const d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);const a=ed.obtener().modelo!,texto=generarBloque(a,a.raiz).map(l=>l.texto).join('\n').replace('**Pedido** es físico.','**Pedido** es informacional.'),p=planificar(a,a.raiz,texto);ed.ejecutar({op:'renombrarModelo',args:{nombre:'Cambio concurrente'}});const b=ed.obtener().modelo!,nuevo=planVigente(b,b.raiz,texto,p);expect(nuevo.base).toBe(b);expect(ed.aplicarOpl(nuevo).ok).toBe(true);expect(ed.obtener().pasado).toHaveLength(2);expect(ed.obtener().modelo!.cosas['o-2']!.esencia).toBe('informacional');ed.deshacer();expect(ed.obtener().modelo).toBe(b);ed.cerrar();await ciclos();
});
test('T-286 exportaciones usan bytes actuales y todos los gates canónicos',async()=>{
 const {prepararExportaciones}=await import('./MenuExportar');const m=modeloCon({objetos:[['Pedido',[]]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]}),antes=exportarV0(m),x=prepararExportaciones(m,m.raiz);expect(x.json).toBe(antes);expect(x.svg.ok).toBe(true);expect(x.html.ok).toBe(true);expect(x.opl).toContain('Pedido');if(x.svg.ok)expect(x.svg.valor.svg).not.toContain('ui-capa');expect(exportarV0(m)).toBe(antes);
});
test('T-248 buscar sin acentos limita20 y distingue OPD de traer cosa',async()=>{
 const {resultadosBuscar,accionTraer}=await import('./Buscar');const m=modeloCon({objetos:[['Árbol',['crecido']]],procesos:Array.from({length:23},(_,i)=>'Proceso '+i)}),antes=exportarV0(m);expect(resultadosBuscar(m,'arbol')[0]!.ref.id).toBe(porNombre(m,'Árbol').id);expect(resultadosBuscar(m,'Proceso')).toHaveLength(20);const q=resultadosBuscar(m,'Prueba').find(r=>r.ref.tipo==='opd')!;expect(q.ref.id).toBe(m.raiz);expect(accionTraer(m,m.raiz,q.ref,{x:10,y:20})).toBeNull();expect(exportarV0(m)).toBe(antes);
});
test('T-260 diagnóstico ordena OPD activo y reparaciones conservan acción nuclear',async()=>{
 const {ordenarDiagnosticos}=await import('./PanelDiagnostico');const {diagnosticar}=await import('../nucleo/diagnostico');const m=modeloCon({objetos:[['Pedido',['nuevo']]]});const ds=diagnosticar(m),antes=exportarV0(m),r=ordenarDiagnosticos(ds,m.raiz);expect(r).toHaveLength(ds.length);expect(new Set(r)).toEqual(new Set(ds));for(const d of r)if(d.reparacion)expect(d.reparacion).toBe(ds.find(x=>x===d)!.reparacion!);expect(exportarV0(m)).toBe(antes);
});

test('T-251 Inspector decisión enumera pérdidas reales y quitar conserva enlaces/IDs',async()=>{
 const {perdidasAccion}=await import('./Inspector');const m=modeloCon({objetos:[['Pedido',['nuevo']]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]}),o=porNombre(m,'Pedido').id,e=Object.keys(m.enlaces)[0]!,antes=exportarV0(m);
 const quitado=perdidasAccion(m,{op:'quitarDeOpd',args:{opd:m.raiz,cosas:[o]}});expect(quitado.r.ok).toBe(true);if(quitado.r.ok){expect(quitado.r.valor.modelo.cosas[o]).toBe(m.cosas[o]);expect(quitado.r.valor.modelo.enlaces[e]).toBe(m.enlaces[e]);}expect(quitado.perdidas).toContain(`Aparición de Pedido en ${m.raiz}`);
 const borrado=perdidasAccion(m,{op:'eliminarCosas',args:{cosas:[o]}});expect(borrado.r.ok).toBe(true);expect(borrado.perdidas.some(x=>x.includes(e))).toBe(true);expect(borrado.perdidas.some(x=>x.includes('nuevo'))).toBe(true);expect(exportarV0(m)).toBe(antes);
});
test('T-283 export expone todos bloqueos y conserva documento JSON sin limpiar diagnósticos',async()=>{
 const {prepararExportaciones}=await import('./MenuExportar'),{gatesExportacion}=await import('../nucleo/diagnostico');const b=modeloCon({objetos:[['Pedido',[]],['Registro',[]]]}),o=porNombre(b,'Pedido').id,m={...b,cosas:{...b.cosas,[o]:{...b.cosas[o]!,nombre:'nombre ilegal'}}},antes=exportarV0(m),x=prepararExportaciones(m,m.raiz);
 expect(x.gatesSvg).toEqual(gatesExportacion(m,{opd:m.raiz}));expect(x.gatesHtml).toEqual(gatesExportacion(m,'modelo'));expect(x.gatesSvg.length).toBeGreaterThan(0);expect(x.svg.ok).toBe(false);expect(x.html.ok).toBe(false);expect(x.json).toBe(antes);expect(exportarV0(m)).toBe(antes);
});
test('T-261 dos reparaciones reales usan un commit y undo íntegro',async()=>{
 const {diagnosticar}=await import('../nucleo/diagnostico'),{accionesReparacion}=await import('./PanelDiagnostico');const d=dependencias(),b=d.m,ids=Object.keys(b.cosas),m={...b,cosas:Object.fromEntries(ids.map(id=>[id,{...b.cosas[id]!,nombre:'Pedido'}]))};d.documento(exportarV0(m));const ed=crearEditor(configuracion(d));await ed.abrir(m.id);const base=ed.obtener().modelo!,rs=diagnosticar(base).filter(d=>d.codigo==='nombre-duplicado'&&d.reparacion);expect(rs).toHaveLength(2);expect(ed.ejecutarVarias(accionesReparacion(base,rs).acciones,'Dos nombres reparados').ok).toBe(true);expect(ed.obtener().pasado).toHaveLength(1);expect(diagnosticar(ed.obtener().modelo!).some(x=>x.codigo==='nombre-duplicado')).toBe(false);ed.deshacer();expect(ed.obtener().modelo).toBe(base);ed.cerrar();await ciclos();
});
test('T-018 Ref estado oculto y enlace abstraído siguen visibilidad de Vista por identidad',async()=>{
 const {contieneRef}=await import('./ArbolOpd');const m=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]}),o=porNombre(m,'Pedido');if(o.tipo!=='objeto')throw Error('montaje');const {suprimirEstado}=await import('../nucleo/estados'),n=must(suprimirEstado(m,{estado:o.estados[0]!.id,opd:m.raiz,activa:true})).modelo;
 expect(contieneRef(n,n.raiz,{tipo:'estado',id:o.estados[0]!.id})).toBe(false);expect(contieneRef(n,n.raiz,{tipo:'estado',id:o.estados[1]!.id})).toBe(true);expect(contieneRef(n,n.raiz,{tipo:'enlace',id:Object.keys(n.enlaces)[0]!})).toBe(true);
});

test('T-150 aplicar OPL inmediato replantea texto nuevo aunque todavía no venza150ms',async()=>{
 const {planVigente}=await import('./EditorOpl');const d=dependencias(),m=d.m,base=generarBloque(m,m.raiz).map(l=>l.texto).join('\n'),p=planificar(m,m.raiz,base),texto=base.replace('**Pedido** es físico.','**Pedido** es informacional.');expect(p.acciones).toHaveLength(0);const actual=planVigente(m,m.raiz,texto,p);expect(actual.acciones.length).toBeGreaterThan(0);expect(actual.base).toBe(m);
});

test('T-248 Traer conserva cosa y enlaces y elige un hueco libre usando las cajas reales',async()=>{
 const {accionTraer}=await import('./Buscar'),{aplicarAccion}=await import('../nucleo/operaciones'),{escena}=await import('../opd/escena');const b=modeloCon({objetos:[['Pedido',[]],['Registro',[]]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]}),o=porNombre(b,'Registro').id,m=must(aplicarAccion(b,{op:'quitarDeOpd',args:{opd:b.raiz,cosas:[o]}})).modelo,antes=exportarV0(m),cajas=escena(m,m.raiz).nodos.map(n=>n.caja),a=accionTraer(m,m.raiz,{tipo:'cosa',id:o},{x:cajas[0]!.x,y:cajas[0]!.y})!;
 const n=must(aplicarAccion(m,a)).modelo,caja=escena(n,n.raiz).nodos.find(x=>x.ref.id===o)!.caja;expect(cajas.every(c=>caja.x+caja.ancho<=c.x||c.x+c.ancho<=caja.x||caja.y+caja.alto<=c.y||c.y+c.alto<=caja.y)).toBe(true);expect(n.cosas[o]).toBe(m.cosas[o]);expect(n.enlaces).toBe(m.enlaces);expect(n.secuencia).toBe(m.secuencia);expect(exportarV0(m)).toBe(antes);
});

test('T-245 subspan enlazado resuelve SU hecho y no el nombre compartido',async()=>{
 const {refToken}=await import('./PanelOpl');const cosa={tipo:'cosa' as const,id:'o-2'},t={texto:'Pedido',rol:'nombre' as const,ref:cosa,hecho:'e-8'};expect(refToken(t)).toEqual({tipo:'enlace',id:'e-8'});expect(refToken({...t,hecho:'e-9'})).toEqual({tipo:'enlace',id:'e-9'});expect(refToken({texto:'Pedido',rol:'nombre',ref:cosa})).toBe(cosa);expect(refToken({texto:'Pedido',rol:'texto'})).toBeUndefined();
});
test('T-241 panel recibe cabeceras y profundidad de los bloques reales sin cambiar el Modelo',async()=>{
 const {generarModelo}=await import('../opl/generar');const b=modeloCon({procesos:['Preparar']}),m=must(descomponer(b,{opd:b.raiz,proceso:porNombre(b,'Preparar').id,bandas:[['Recibir'],['Entregar']]})).modelo,antes=exportarV0(m),ls=generarModelo(m);expect(ls.filter(l=>l.plantilla==='cabecera').map(l=>[l.opd,l.profundidad])).toEqual([[m.raiz,0],[Object.keys(m.opds)[1]!,1]]);expect(exportarV0(m)).toBe(antes);
});
test('T-251 pérdida global lista todas apariciones y refinamiento hoja conserva padre/hechos',async()=>{
 const {perdidasAccion}=await import('./Inspector');const b=modeloCon({objetos:[['Pedido',['nuevo']]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]}),r=must(descomponer(b,{opd:b.raiz,proceso:porNombre(b,'Preparar').id,bandas:[['Recibir'],['Entregar']]})),m=r.modelo,hijo=r.creados[0]!,o=porNombre(m,'Pedido').id,antes=exportarV0(m),p=perdidasAccion(m,{op:'eliminarCosas',args:{cosas:[o]}});expect(p.r.ok).toBe(true);for(const [id,opd]of Object.entries(m.opds))if(opd.apariciones[o])expect(p.perdidas).toContain(`Aparición de Pedido en ${id}`);
 const q=perdidasAccion(m,{op:'eliminarRefinamiento',args:{opd:hijo}});expect(q.r.ok).toBe(true);expect(q.perdidas).toContain(`OPD ${hijo}`);expect(q.conservados).toContain('Preparar conserva su identidad');expect(exportarV0(m)).toBe(antes);
});

test('T-216 abanico colineal válido conserva sector cero como límite visual sin excepción',async()=>{
 const {formarAbanico}=await import('../nucleo/abanicos'),{escena}=await import('../opd/escena'),{exportarDiagrama}=await import('../opd/exportar');const b=modeloCon({objetos:[['Agua',[]],['Sal',[]],['Materia',[]]],procesos:['Mezclar'],enlaces:[['consumo','Agua','Mezclar'],['consumo','Sal','Mezclar'],['agregacion','Materia','Agua'],['agregacion','Materia','Sal']]}),m=must(formarAbanico(b,{operador:'XOR',enlaces:Object.values(b.enlaces).filter(e=>e.tipo==='consumo').map(e=>e.id)})).modelo,antes=exportarV0(m);
 const e=escena(m,m.raiz);expect(e.arcos).toHaveLength(1);expect(e.arcos[0]!.radio).toBe(30);expect(e.arcos[0]!.hasta).toBe(e.arcos[0]!.desde);expect(exportarDiagrama(m,m.raiz,{version:'wp16-test'}).ok).toBe(true);expect(exportarV0(m)).toBe(antes);
});

test('T-022 ruta conserva selección visible por ID y elimina sólo la ausente en destino',async()=>{
 const {navegarRuta}=await import('./App');const d=dependencias(),b=modeloCon({objetos:[['Pedido',['nuevo']]],procesos:['Preparar'],enlaces:[['consumo','Pedido','Preparar']]}),m=must(descomponer(b,{opd:b.raiz,proceso:porNombre(b,'Preparar').id,bandas:[['Recibir'],['Entregar']]})).modelo,hijo=Object.keys(m.opds).find(id=>id!==m.raiz)!,o=porNombre(m,'Pedido').id,interno=porNombre(m,'Recibir').id;d.documento(exportarV0(m));const ed=crearEditor(configuracion(d));await ed.abrir(m.id);const antes=exportarV0(ed.obtener().modelo!);ed.seleccionar({cosas:[o],estados:[],enlaces:[],abanicos:[]});await navegarRuta(ed,m.id,hijo);expect(ed.obtener().seleccion.cosas).toEqual([o]);ed.seleccionar({cosas:[o,interno],estados:[],enlaces:[],abanicos:[]});await navegarRuta(ed,m.id,m.raiz);expect(ed.obtener().seleccion.cosas).toEqual([o]);expect(exportarV0(ed.obtener().modelo!)).toBe(antes);expect(ed.obtener().pasado).toHaveLength(0);ed.cerrar();await ciclos();
});
