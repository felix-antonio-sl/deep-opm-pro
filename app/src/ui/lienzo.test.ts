import { test, expect } from 'bun:test';
import { modeloCon, porNombre, congelar } from '../pruebas/constructores';
import { tiposLegales } from '../nucleo/matriz';
import { aplicarAcciones } from '../nucleo/operaciones';
import { escena } from '../opd/escena';
import { dibujar } from '../opd/dibujo';

test('T-010 adaptador conserva árbol canónico, atributos y texto sin overlays', async () => {
    const { convertirSvg } = await import('./SvgPreact');
    const m = modeloCon({ objetos: [['Pedido', ['nuevo']]], procesos: ['Preparar'] });
    const n = dibujar(escena(m, m.raiz), 'canon'), antes = JSON.stringify(n);
    const v = convertirSvg(n);
    expect(v.type).toBe(n.t); expect(v.props.children).toHaveLength(n.h!.length);
    expect(JSON.stringify(n)).toBe(antes);
    const texto = convertirSvg({t:'text',a:{'font-kerning':'none',x:3},h:['<&"']});
    expect(texto.props['font-kerning']).toBe('none'); expect(texto.props.children).toEqual(['<&"']);
});
test('T-011 selección alternada conserva otras clases y limpia en vacío', async () => {
    const { seleccionarRef } = await import('./Lienzo');
    const s = {cosas:['o1'], estados:['s1'],enlaces:[],abanicos:[]};
    expect(seleccionarRef(s,{tipo:'enlace',id:'e1'},true)).toEqual({...s,enlaces:['e1']});
    expect(seleccionarRef(s,{tipo:'estado',id:'s1'},true)).toEqual({...s,estados:[]});
    expect(seleccionarRef(s,null,false)).toEqual({cosas:[],estados:[],enlaces:[],abanicos:[]});
});
test('T-040 pendientes reconsultan tipo y sentido por identidad de elección', async () => {
    const { confirmarDatos } = await import('./MenuTipoEnlace');
    const m = congelar(modeloCon({objetos:[['Agua',[]],['Vaso',[]]]})), antes=JSON.stringify(m);
    const desde={cosa:porNombre(m,'Agua').id},hacia={cosa:porNombre(m,'Vaso').id};
    const opciones=tiposLegales(m,{opd:m.raiz,desde,hacia});
    const opcion=opciones.find(o=>o.tipo==='etiquetadoBidireccional'&&o.sentido==='directo')!;
    expect(opcion.legal).toBe('pendiente');
    const r=confirmarDatos(m,m.raiz,{k:'menuTipo',desde,hacia,opciones},opcion,{etiqueta:'contiene',inversa:'pertenece'});
    expect(r.acciones).toHaveLength(1); expect(aplicarAcciones(m,r.acciones).ok).toBe(true);
    expect(confirmarDatos(m,m.raiz,{k:'menuTipo',desde,hacia,opciones},opcion,{etiqueta:'',inversa:'pertenece'}).acciones).toHaveLength(0);
    expect(JSON.stringify(m)).toBe(antes);
});
test('T-011 coordenadas cámara invierten pantalla sin mutar modelo', async () => {
    const { puntoModelo }=await import('./Lienzo');
    expect(puntoModelo({x:120,y:80},{x:20,y:30,zoom:2})).toEqual({x:50,y:25});
});

import { crearEditor } from '../editor/estado';
import { dependencias, configuracion, ciclos } from '../editor/pruebas.test';
import { reducirGesto } from '../editor/gestos';

test('T-062 T-252 O con selección activa crea petición una vez y cancelar no reserva ID', async () => {
    const { despacharLienzo }=await import('./Lienzo');
    const d=dependencias(), ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);
    ed.seleccionar({cosas:['o-2'],estados:[],enlaces:[],abanicos:[]});
    const m=ed.obtener().modelo!;
    expect(despacharLienzo(ed,'objeto',{key:'o'})).toBe(true);
    expect(ed.obtener().solicitud).toEqual({k:'crear',tipo:'objeto'});
    const r=reducirGesto(m,m.raiz,{k:'creando',tipo:'objeto',en:{x:10,y:20},nombre:'Fantasma'},{k:'tecla',tecla:'Escape',mayus:false,ctrl:false,alt:false});
    expect(r.acciones).toEqual([]);expect(r.gesto).toEqual({k:'reposo'});expect(ed.obtener().modelo).toBe(m);
    ed.solicitar(null);expect(despacharLienzo(ed,'objeto',{key:'o',editable:true})).toBe(false);
    expect(despacharLienzo(ed,'objeto',{key:'o',isComposing:true})).toBe(false);
    ed.fijarModo('navegacion');expect(despacharLienzo(ed,'objeto',{key:'o'})).toBe(false);
    ed.cerrar();await ciclos();
});

test('T-010 adaptación recursiva del dibujo REAL conserva todos los atributos, capas y texto', async()=>{
    const {convertirSvg}=await import('./SvgPreact');
    const m=congelar(modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Preparar']})),antes=JSON.stringify(m);
    const arbol=dibujar(escena(m,m.raiz),'canon');
    function comparar(n:typeof arbol,v:ReturnType<typeof convertirSvg>){
        expect(v.type).toBe(n.t);
        for(const [k,a]of Object.entries(n.a??{}))expect(v.props[k]).toBe(a);
        const hijos=v.props.children as Array<ReturnType<typeof convertirSvg>|string>;
        expect(hijos.length).toBe((n.h??[]).length);
        for(const [i,h]of (n.h??[]).entries())if(typeof h==='string')expect(hijos[i]).toBe(h);else comparar(h,hijos[i] as ReturnType<typeof convertirSvg>);
    }
    comparar(arbol,convertirSvg(arbol));expect(JSON.stringify(m)).toBe(antes);
});

test('T-011 V3 menú de cambio EXISTENTE emite una operación con datos/ID y un undo',async()=>{
 const {confirmarDatos}=await import('./MenuTipoEnlace'),{crearEnlace}=await import('../nucleo/enlaces'),{exportarV0}=await import('../codec/exportar');const b=modeloCon({objetos:[['Agua',[]],['Vaso',[]]]}),desde={cosa:porNombre(b,'Agua').id},hacia={cosa:porNombre(b,'Vaso').id};const c=crearEnlace(b,{opd:b.raiz,candidato:{tipo:'etiquetado',origen:desde.cosa,destino:hacia.cosa,etiqueta:'conoce'}});expect(c.ok).toBe(true);if(!c.ok)throw Error('montaje');const m=c.valor.modelo,id=c.valor.creados[0]!,opciones=tiposLegales(m,{opd:m.raiz,desde,hacia}),o=opciones.find(x=>x.tipo==='etiquetadoBidireccional'&&x.sentido==='directo')!,datos={etiqueta:'contiene',inversa:'pertenece'};
 const r=confirmarDatos(m,m.raiz,{k:'menuTipo',desde,hacia,opciones},o,datos,id);expect(r.acciones).toEqual([{op:'cambiarTipoEnlace',args:{enlace:id,tipo:'etiquetadoBidireccional',sentido:'directo',etiquetas:datos}}]);const d=dependencias();d.documento(exportarV0(m));const ed=crearEditor(configuracion(d));await ed.abrir(m.id);const antes=ed.obtener().modelo!;expect(ed.ejecutar(r.acciones[0]!).ok).toBe(true);const n=ed.obtener().modelo!;expect(Object.keys(n.enlaces)).toEqual([id]);expect(n.enlaces[id]).toMatchObject({id,tipo:'etiquetadoBidireccional',...datos});expect(n.secuencia).toBe(m.secuencia);expect(ed.obtener().pasado).toHaveLength(1);ed.deshacer();expect(ed.obtener().modelo).toBe(antes);expect(ed.obtener().pasado).toHaveLength(0);ed.cerrar();await ciclos();
});

test('T-011 elección inversa con datos conserva candidato, ID y un deshacer real', async()=>{
    const {confirmarDatos}=await import('./MenuTipoEnlace'),{crearEnlace}=await import('../nucleo/enlaces'),{exportarV0}=await import('../codec/exportar');
    const b=modeloCon({objetos:[['Pedido',[]],['Registro',[]]]}),desde={cosa:porNombre(b,'Pedido').id},hacia={cosa:porNombre(b,'Registro').id};
    const c=crearEnlace(b,{opd:b.raiz,candidato:{tipo:'agregacion',refinable:desde.cosa,refinador:hacia.cosa}});expect(c.ok).toBe(true);if(!c.ok)throw Error('montaje');
    const m=c.valor.modelo,id=c.valor.creados[0]!,opciones=tiposLegales(m,{opd:m.raiz,desde,hacia}),o=opciones.find(x=>x.tipo==='etiquetadoBidireccional'&&x.sentido==='inverso')!,datos={etiqueta:'contiene',inversa:'pertenece'};
    const r=confirmarDatos(m,m.raiz,{k:'menuTipo',desde,hacia,opciones},o,datos,id);
    expect(r.acciones).toHaveLength(1);expect(r.acciones[0]!.args).toEqual({enlace:id,tipo:'etiquetadoBidireccional',sentido:'inverso',etiquetas:datos});
    const d=dependencias();d.documento(exportarV0(m));const ed=crearEditor(configuracion(d));await ed.abrir(m.id);const antes=ed.obtener().modelo!;
    expect(ed.ejecutar(r.acciones[0]!).ok).toBe(true);expect(ed.obtener().modelo!.enlaces[id]).toEqual({id,tipo:'etiquetadoBidireccional',origen:hacia.cosa,destino:desde.cosa,...datos});
    expect(ed.obtener().pasado).toHaveLength(1);ed.deshacer();expect(ed.obtener().modelo).toBe(antes);ed.cerrar();await ciclos();
});

test('T-011 menú de enlace estructural resuelve el mismo par nuclear fuera de aristas',async()=>{
    const {extremosSeleccionados}=await import('./Lienzo');
    const {crearEnlace}=await import('../nucleo/enlaces');const b=modeloCon({objetos:[['Pedido',[]],['Registro',[]]]});
    const a=porNombre(b,'Pedido').id,z=porNombre(b,'Registro').id;
    const r=crearEnlace(b,{opd:b.raiz,candidato:{tipo:'agregacion',refinable:a,refinador:z}});expect(r.ok).toBe(true);if(!r.ok)throw Error('montaje');
    const m=r.valor.modelo,id=r.valor.creados[0]!;expect(escena(m,m.raiz).aristas.some(e=>e.ref.id===id)).toBe(false);
    expect(extremosSeleccionados(m,id)).toEqual({desde:{cosa:a},hacia:{cosa:z}});
    expect(extremosSeleccionados(m,'ausente')).toBeNull();
});


test('T-011 M y Mayús+M recorren multiplicidades por rol con identidad, etiqueta y undo',async()=>{
 const {accionMultiplicidad}=await import('./Lienzo'),{crearEnlace}=await import('../nucleo/enlaces'),{exportarV0}=await import('../codec/exportar');
 const b=modeloCon({objetos:[['Agua',[]],['Vaso',[]]]}),a=porNombre(b,'Agua').id,v=porNombre(b,'Vaso').id,c=crearEnlace(b,{opd:b.raiz,candidato:{tipo:'etiquetado',origen:a,destino:v,etiqueta:'llena'}});expect(c.ok).toBe(true);if(!c.ok)throw Error('montaje');let m=c.valor.modelo;const id=c.valor.creados[0]!,antes=JSON.stringify(m);
 for(const valor of ['?','*','+',undefined] as const){const r=aplicarAcciones(m,[accionMultiplicidad(m.enlaces[id]!,false)]);expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);m=r.valor.modelo;expect(m.enlaces[id]).toMatchObject({id,tipo:'etiquetado',etiqueta:'llena'});expect('multDestino'in m.enlaces[id]! ? m.enlaces[id]!.multDestino:undefined).toBe(valor);expect('multOrigen'in m.enlaces[id]! ? m.enlaces[id]!.multOrigen:undefined).toBeUndefined();}
 for(let i=0;i<3;i++){const r=aplicarAcciones(m,[accionMultiplicidad(m.enlaces[id]!,false)]);expect(r.ok).toBe(true);if(!r.ok)throw Error('montaje');m=r.valor.modelo;}
 for(const valor of ['?','*','+',undefined] as const){const r=aplicarAcciones(m,[accionMultiplicidad(m.enlaces[id]!,true)]);expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);m=r.valor.modelo;expect('multOrigen'in m.enlaces[id]! ? m.enlaces[id]!.multOrigen:undefined).toBe(valor);expect('multDestino'in m.enlaces[id]! ? m.enlaces[id]!.multDestino:undefined).toBe('+');expect(m.enlaces[id]).toMatchObject({id,etiqueta:'llena'});}
 expect(JSON.stringify(c.valor.modelo)).toBe(antes);expect(m.secuencia).toBe(c.valor.modelo.secuencia);
 const d=dependencias();d.documento(exportarV0(m));const ed=crearEditor(configuracion(d));await ed.abrir(m.id);const previo=ed.obtener().modelo!;expect(ed.ejecutar(accionMultiplicidad(previo.enlaces[id]!,true)).ok).toBe(true);expect(ed.obtener().pasado).toHaveLength(1);ed.deshacer();expect(ed.obtener().modelo).toBe(previo);ed.cerrar();await ciclos();
});

test('T-040 M mantiene roles objeto/refinador y deja rechazar extremo no aplicable al núcleo',async()=>{
 const {accionMultiplicidad}=await import('./Lienzo'),{crearEnlace}=await import('../nucleo/enlaces');
 for(const tipo of ['consumo','agregacion','invocacion'] as const){const b=modeloCon({objetos:[['Agua',[]],['Vaso',[]]],procesos:['Verter','Vaciar']}),a=porNombre(b,'Agua').id,v=porNombre(b,'Vaso').id,p=porNombre(b,'Verter').id,q=porNombre(b,'Vaciar').id,candidato=tipo==='consumo'?{tipo,objeto:a,proceso:p}:tipo==='agregacion'?{tipo,refinable:v,refinador:a}:{tipo,origen:p,destino:q};const c=crearEnlace(b,{opd:b.raiz,candidato});expect(c.ok).toBe(true);if(!c.ok)throw Error('montaje');let m=c.valor.modelo;const id=c.valor.creados[0]!,previo=JSON.stringify(m);
  for(const valor of ['?','*','+',undefined] as const){const accion=accionMultiplicidad(m.enlaces[id]!,false),r=aplicarAcciones(m,[accion]);if(tipo==='invocacion'){expect(r.ok).toBe(false);expect(JSON.stringify(m)).toBe(previo);break;}expect(accion).toMatchObject({op:'fijarMultiplicidad',args:{enlace:id,extremo:tipo==='consumo'?'objeto':'refinador',valor:valor??null}});expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);m=r.valor.modelo;expect('mult'in m.enlaces[id]! ? m.enlaces[id]!.mult:undefined).toBe(valor);}
 }
});

test('T-251 quitar múltiple usa refs capturadas, atomicidad e identidad con un undo',async()=>{const {accionQuitar}=await import('./Lienzo');const d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);const m=ed.obtener().modelo!,opd=ed.obtener().opd,refs=[{tipo:'cosa' as const,id:'o-2'},{tipo:'cosa' as const,id:'p-5'},{tipo:'opd' as const,id:opd}];expect(accionQuitar(refs)).toEqual({op:'quitarDeOpd',args:{opd,cosas:['o-2','p-5']}});expect(accionQuitar(refs.slice(0,2))).toBeNull();const r=ed.ejecutar(accionQuitar(refs)!);expect(r.ok).toBe(true);expect(ed.obtener().modelo!.cosas).toEqual(m.cosas);expect(ed.obtener().modelo!.enlaces).toEqual(m.enlaces);expect(ed.obtener().modelo!.secuencia).toBe(m.secuencia);expect(ed.obtener().modelo!.opds[opd]!.apariciones['o-2']).toBeUndefined();expect(ed.obtener().modelo!.opds[opd]!.apariciones['p-5']).toBeUndefined();expect(ed.obtener().pasado).toHaveLength(1);ed.deshacer();expect(ed.obtener().modelo).toBe(m);const malo=ed.ejecutar({op:'quitarDeOpd',args:{opd,cosas:['o-2','no-existe']}});expect(malo.ok).toBe(false);expect(ed.obtener().modelo).toBe(m);ed.cerrar();await ciclos();});

test('T-051 segundo gesto completa TS4 a TS3 por ID con una operación y undo',async()=>{
 const d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);const creado=ed.ejecutar({op:'crearEnlace',args:{opd:ed.obtener().opd,candidato:{tipo:'efecto',objeto:'o-2',proceso:'p-5',entrada:'s-3'}}});if(!creado.ok)throw Error(creado.rechazo.mensaje);const id=creado.valor.creados[0]!,m=ed.obtener().modelo!,opd=ed.obtener().opd,antes=JSON.stringify(m),desde={cosa:'p-5'},hacia={cosa:'o-2',estado:'s-4'},opciones=tiposLegales(m,{opd,desde,hacia}),i=opciones.findIndex(o=>o.legal===false&&o.alternativa?.k==='completarCambio');expect(i).toBeGreaterThanOrEqual(0);const g={k:'menuTipo' as const,desde,hacia,opciones},r=reducirGesto(m,opd,g,{k:'elegir',indice:i});expect(r.acciones).toEqual([{op:'fijarEstados',args:{enlace:id,estados:{entrada:'s-3',salida:'s-4'}}}]);const h=ed.obtener().pasado.length,resultado=ed.ejecutar(r.acciones[0]!);expect(resultado.ok).toBe(true);const previo=m.enlaces[id];if(previo?.tipo!=='efecto')throw Error('montaje efecto');expect(ed.obtener().modelo!.enlaces[id]).toEqual({...previo,salida:'s-4'});expect(ed.obtener().modelo!.secuencia).toBe(m.secuencia);expect(Object.keys(ed.obtener().modelo!.enlaces)).toEqual([id]);expect(ed.obtener().pasado).toHaveLength(h+1);expect(JSON.stringify(m)).toBe(antes);ed.deshacer();expect(ed.obtener().modelo).toBe(m);ed.cerrar();await ciclos();
});


test('T-051 menú presenta completar cambio primero conservando el índice nuclear y estados por ID',async()=>{
 const {opcionesPresentadas,textoCompletar}=await import('./MenuTipoEnlace'),d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);
 const c=ed.ejecutar({op:'crearEnlace',args:{opd:ed.obtener().opd,candidato:{tipo:'efecto',objeto:'o-2',proceso:'p-5',entrada:'s-3'}}});expect(c.ok).toBe(true);
 const m=ed.obtener().modelo!,opciones=tiposLegales(m,{opd:ed.obtener().opd,desde:{cosa:'p-5'},hacia:{cosa:'o-2',estado:'s-4'}}),antes=JSON.stringify(opciones),i=opciones.findIndex(o=>o.legal===false&&o.alternativa?.k==='completarCambio'),filas=opcionesPresentadas(opciones);
 expect(filas[0]!.i).toBe(i);expect(filas[0]!.o).toBe(opciones[i]!);expect(textoCompletar(m,filas[0]!.o)).toBe('Completar cambio: de nuevo a listo');expect(new Set(filas.map(x=>x.i)).size).toBe(filas.length);for(const f of filas)expect(f.o).toBe(opciones[f.i]!);expect(JSON.stringify(opciones)).toBe(antes);ed.cerrar();await ciclos();
});


test('T-051 resultado alternativo forma XOR/OR con estados conservados y un undo real',async()=>{
 for(const operador of ['XOR','OR'] as const){const d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);const c=ed.ejecutar({op:'crearEnlace',args:{opd:ed.obtener().opd,candidato:{tipo:'resultado',objeto:'o-2',proceso:'p-5',estado:'s-3'}}});expect(c.ok).toBe(true);if(!c.ok)throw Error(c.rechazo.mensaje);const m=ed.obtener().modelo!,id=c.valor.creados[0]!,desde={cosa:'p-5'},hacia={cosa:'o-2',estado:'s-4'},opciones=tiposLegales(m,{opd:ed.obtener().opd,desde,hacia}),i=opciones.findIndex(o=>o.tipo==='resultado'&&o.sentido==='directo'&&o.legal===false&&o.alternativa?.k==='abanicoCon');expect(i).toBeGreaterThanOrEqual(0);const r=reducirGesto(m,ed.obtener().opd,{k:'menuTipo',desde,hacia,opciones},{k:'elegir',indice:i,operador}),h=ed.obtener().pasado.length;expect(ed.ejecutar(r.acciones[0]!).ok).toBe(true);const nuevo=ed.obtener().modelo!,fan=Object.values(nuevo.abanicos)[0]!;expect(fan.operador).toBe(operador);expect(fan.enlaces).toHaveLength(2);expect(nuevo.enlaces[id]).toEqual(m.enlaces[id]);expect(Object.values(nuevo.enlaces).find(e=>e.id!==id)).toMatchObject({tipo:'resultado',objeto:'o-2',proceso:'p-5',estado:'s-4'});expect(ed.obtener().pasado).toHaveLength(h+1);ed.deshacer();expect(ed.obtener().modelo).toBe(m);ed.cerrar();await ciclos();}
});


test('T-051 alternativas efecto TS4/TS5 mantienen estado, ID y un undo real en XOR/OR',async()=>{
 for(const rol of ['entrada','salida'] as const)for(const operador of ['XOR','OR'] as const){const d=dependencias(),ed=crearEditor(configuracion(d));await ed.abrir(d.m.id);const c=ed.ejecutar({op:'crearEnlace',args:{opd:ed.obtener().opd,candidato:{tipo:'efecto',objeto:'o-2',proceso:'p-5',[rol]:'s-3'}}});expect(c.ok).toBe(true);if(!c.ok)throw Error(c.rechazo.mensaje);
  const m=ed.obtener().modelo!,id=c.valor.creados[0]!,objeto={cosa:'o-2',estado:'s-4'},proceso={cosa:'p-5'},[desde,hacia]=rol==='entrada'?[objeto,proceso]:[proceso,objeto],sentido=rol==='entrada'?'inverso':'directo',opciones=tiposLegales(m,{opd:ed.obtener().opd,desde,hacia}),i=opciones.findIndex(o=>o.tipo==='efecto'&&o.sentido===sentido&&o.legal===false&&o.alternativa?.k==='abanicoCon');expect(i).toBeGreaterThanOrEqual(0);const r=reducirGesto(m,ed.obtener().opd,{k:'menuTipo',desde,hacia,opciones},{k:'elegir',indice:i,operador}),h=ed.obtener().pasado.length;expect(ed.ejecutar(r.acciones[0]!).ok).toBe(true);
  const n=ed.obtener().modelo!,fan=Object.values(n.abanicos)[0]!;expect(fan.operador).toBe(operador);expect(fan.enlaces).toHaveLength(2);expect(n.enlaces[id]).toEqual(m.enlaces[id]);expect(Object.values(n.enlaces).find(e=>e.id!==id)).toEqual({id:expect.any(String),tipo:'efecto',objeto:'o-2',proceso:'p-5',[rol]:'s-4'});expect(ed.obtener().pasado).toHaveLength(h+1);ed.deshacer();expect(ed.obtener().modelo).toBe(m);ed.cerrar();await ciclos();
 }
});
