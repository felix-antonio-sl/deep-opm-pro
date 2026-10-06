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

test('T-062 O con selección activa crea petición una vez y cancelar no reserva ID', async () => {
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
 const r=confirmarDatos(m,m.raiz,{k:'menuTipo',desde,hacia,opciones},o,datos,id);expect(r.acciones).toEqual([{op:'cambiarTipoEnlace',args:{enlace:id,tipo:'etiquetadoBidireccional',etiquetas:datos}}]);const d=dependencias();d.documento(exportarV0(m));const ed=crearEditor(configuracion(d));await ed.abrir(m.id);const antes=ed.obtener().modelo!;expect(ed.ejecutar(r.acciones[0]!).ok).toBe(true);const n=ed.obtener().modelo!;expect(Object.keys(n.enlaces)).toEqual([id]);expect(n.enlaces[id]).toMatchObject({id,tipo:'etiquetadoBidireccional',...datos});expect(n.secuencia).toBe(m.secuencia);expect(ed.obtener().pasado).toHaveLength(1);ed.deshacer();expect(ed.obtener().modelo).toBe(antes);expect(ed.obtener().pasado).toHaveLength(0);ed.cerrar();await ciclos();
});
