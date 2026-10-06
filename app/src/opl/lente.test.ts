import {test,expect} from 'bun:test';
import {modeloCon} from '../pruebas/constructores';
import {planificar} from './planificar';
import {aplicarPlan} from './aplicar';
import {exportarV0} from '../codec/exportar';
import {generarDocumentoOpl} from './documento';
test('T-302 ausencia y unsupported no borran ni reservan IDs; preview conserva identidad',()=>{
 const m=modeloCon({objetos:[['Registro',[]]],procesos:['Guardar'],enlaces:[['consumo','Registro','Guardar']]}),antes=exportarV0(m);
 for(const t of ['', '**Registro** es persistente.']){const p=planificar(m,m.raiz,t);expect(p.base).toBe(m);expect(p.acciones).toEqual([]);const r=aplicarPlan(m,p);expect(r.ok).toBe(true);if(r.ok){expect(r.valor.modelo).toBe(m);expect(exportarV0(r.valor.modelo)).toBe(antes);}}
 const doc=generarDocumentoOpl(m);expect(planificar(m,'modelo',doc.split('\n').reverse().join('\n')).acciones).toEqual([]);
});

import type {Modelo,Enlace} from '../nucleo/tipos';
import {aplicarAcciones} from '../nucleo/operaciones';
import {must} from '../pruebas/constructores';
import {validarForma} from '../nucleo/forma';
import {importarOpl} from './documento';
import {generarModelo} from './generar';
import {proyectar} from '../nucleo/proyeccion';
const reimportar=(m:Modelo)=>{const t=generarDocumentoOpl(m),r=importarOpl(m.nombre,t);expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);expect(r.valor.plan.resumen.noAplicables).toBe(0);return r.valor.modelo;};
const preservar=(m:Modelo)=>{const before=exportarV0(m),p=planificar(m,'modelo',generarDocumentoOpl(m));expect(p.acciones).toEqual([]);expect(must(aplicarPlan(m,p)).modelo).toBe(m);expect(exportarV0(m)).toBe(before);expect(validarForma(m)).toEqual([]);};

test('T-193 parcial 1 no estricto: procedencia de escisión permanece JSON y ensayo existente',()=>{
 const b=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Gestionar']}),[o,p]=Object.values(b.cosas);if(o?.tipo!=='objeto'||p?.tipo!=='proceso')throw Error('fixture');
 const ef=must(aplicarAcciones(b,[{op:'crearEnlace',args:{opd:b.raiz,candidato:{tipo:'efecto',objeto:o.id,proceso:p.id,entrada:o.estados[0]!.id,salida:o.estados[1]!.id}}}])).modelo;
 const m=must(aplicarAcciones(ef,[{op:'descomponer',args:{opd:b.raiz,proceso:p.id,bandas:[['Preparar'],['Completar']]}}])).modelo;expect(Object.values(m.enlaces).filter(e=>e.tipo==='efecto'&&e.escision)).toHaveLength(2);preservar(m);const standalone:Modelo={...m,enlaces:Object.fromEntries(Object.entries(m.enlaces).map(([id,e])=>{const {escision,...plain}=e as Enlace&{escision?:unknown};void escision;return[id,plain as Enlace];}))};expect(validarForma(standalone)).toEqual([]);expect(generarDocumentoOpl(standalone)).toBe(generarDocumentoOpl(m));
});
test('T-193 parcial 2 no estricto: ausencia aditiva no elimina hechos',()=>{const m=modeloCon({objetos:[['Pedido',[]]],procesos:['Validar'],enlaces:[['consumo','Pedido','Validar']]});expect(must(aplicarPlan(m,planificar(m,m.raiz,''))).modelo).toBe(m);preservar(m);});
test('T-193 parcial 3 no estricto: posiciones tamaños son JSON, no OPL',()=>{const b=modeloCon({objetos:[['Registro',[]]]}),id=Object.keys(b.cosas)[0]!,m=must(aplicarAcciones(b,[{op:'moverApariciones',args:{opd:b.raiz,mover:[{cosa:id,x:347,y:219}]}},{op:'redimensionar',args:{opd:b.raiz,cosa:id,ancho:280,alto:180}}])).modelo;preservar(m);expect(Object.values(reimportar(m).opds)[0]!.apariciones).not.toEqual(m.opds[m.raiz]!.apariciones);});
test('T-193 parcial 4 no estricto: supresión en todos y reconstrucción local con otros',()=>{
 const b=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Gestionar']}),o=Object.values(b.cosas).find(c=>c.tipo==='objeto')!;if(o.tipo!=='objeto')throw Error('fixture');
 for(const opd of [null,b.raiz]){const m=must(aplicarAcciones(b,[{op:'suprimirEstado',args:{estado:o.estados[1]!.id,opd,activa:true}}])).modelo;preservar(m);const r=reimportar(m),ro=Object.values(r.cosas).find(c=>c.nombre==='Pedido')!;expect(ro.tipo==='objeto'&&ro.estados.map(s=>s.nombre)).toEqual(['nuevo']);}
 const p=planificar(b,b.raiz,'**Pedido** puede estar `nuevo`, y otros estados.');expect(p.resumen.noAplicables).toBe(0);const r=must(aplicarPlan(b,p)).modelo;expect(proyectar(r,r.raiz).cosas.find(c=>c.cosa===o.id)?.estadosVisibles).toEqual([o.estados[0]!.id]);expect(r.cosas[o.id]).toEqual(b.cosas[o.id]);
});
test('T-193 parcial 5 no estricto: duración sin EX no se reconstruye',()=>{const b=modeloCon({procesos:['Gestionar']}),id=Object.keys(b.cosas)[0]!,m=must(aplicarAcciones(b,[{op:'fijarDuracion',args:{proceso:id,duracion:{min:2,max:60,unidad:'min'}}}])).modelo;preservar(m);expect(Object.values(reimportar(m).cosas)[0]).not.toHaveProperty('duracion');});
test('T-193 parcial 6 no estricto: descripción y género sin literal no se reconstruyen',()=>{const b=modeloCon({objetos:[['Cuenta',[]]]}),id=Object.keys(b.cosas)[0]!,m=must(aplicarAcciones(b,[{op:'fijarEsencia',args:{cosa:id,esencia:'informacional'}},{op:'fijarGenero',args:{cosa:id,genero:'f'}},{op:'fijarDescripcion',args:{cosa:id,texto:'Sólo JSON'}}])).modelo;expect(m.cosas[id]?.descripcion).toBe('Sólo JSON');preservar(m);const r=Object.values(reimportar(m).cosas)[0]!;expect(r).not.toHaveProperty('genero');expect(r).not.toHaveProperty('descripcion');});
test('T-193 parcial 7 no estricto: refinamiento trivial sin CX no se reconstruye',()=>{const b=modeloCon({procesos:['Gestionar']}),id=Object.keys(b.cosas)[0]!,m=must(aplicarAcciones(b,[{op:'descomponer',args:{opd:b.raiz,proceso:id,bandas:[['Preparar']]}}])).modelo;expect(generarModelo(m).some(l=>l.plantilla?.startsWith('CX'))).toBe(false);preservar(m);const r=must(importarOpl(m.nombre,generarDocumentoOpl(m)));expect(r.plan.lineas.flatMap(l=>l.diagnosticos).filter(d=>d.codigo==='unknown-symbol').length).toBeGreaterThan(0);expect(Object.keys(r.modelo.opds)).toHaveLength(1);});
test('T-193 parcial 8 no estricto: DS10 conserva ruta sin recuperar operador',()=>{const b=modeloCon({objetos:[['Pedido',[]]],procesos:['Validar','Archivar']}),[o,p,q]=Object.values(b.cosas),enlaces:Record<string,Enlace>={a:{id:'a',tipo:'consumo',objeto:o!.id,proceso:p!.id,ruta:'Uno'},z:{id:'z',tipo:'consumo',objeto:o!.id,proceso:q!.id,ruta:'Dos'}};const m:Modelo={...b,enlaces,abanicos:{f:{id:'f',operador:'OR',enlaces:['a','z']}}};preservar(m);const r=reimportar(m);expect(Object.values(r.abanicos)).toEqual([]);expect(Object.values(r.enlaces).map(e=>e.tipo==='consumo'&&e.ruta).sort()).toEqual(['Dos','Uno']);});
test('T-193 parcial 9 no estricto: dirigidos opuestos se reconstruyen bidireccionales',()=>{const b=modeloCon({objetos:[['Alfa',[]],['Beta',[]]]}),[a,z]=Object.keys(b.cosas),m:Modelo={...b,enlaces:{a:{id:'a',tipo:'etiquetado',origen:a!,destino:z!,etiqueta:'conoce'},z:{id:'z',tipo:'etiquetado',origen:z!,destino:a!,etiqueta:'pertenece a'}}};preservar(m);expect(Object.values(reimportar(m).enlaces)).toEqual([expect.objectContaining({tipo:'etiquetadoBidireccional',etiqueta:'conoce',inversa:'pertenece a'})]);});
test('T-193 parcial 10 no estricto: cosas sin aparición no pertenecen a un bloque',()=>{const b=modeloCon({objetos:[['Visible',[]],['Huérfana',[]]]}),[v]=Object.keys(b.cosas),m:Modelo={...b,opds:{[b.raiz]:{...b.opds[b.raiz]!,apariciones:{[v!]:b.opds[b.raiz]!.apariciones[v!]!}}}};preservar(m);expect(Object.values(reimportar(m).cosas).map(c=>c.nombre)).toEqual(['Visible']);
 const c=modeloCon({objetos:[['Visible',[]],['Huérfana',[]]],procesos:['Validar'],enlaces:[['consumo','Huérfana','Validar']]}),h=Object.values(c.cosas).find(x=>x.nombre==='Huérfana')!.id,apariciones={...c.opds[c.raiz]!.apariciones};delete apariciones[h];const conEnlace:Modelo={...c,opds:{[c.raiz]:{...c.opds[c.raiz]!,apariciones}}};preservar(conEnlace);expect(Object.values(conEnlace.enlaces)).toHaveLength(1);const importado=reimportar(conEnlace);expect(Object.values(importado.enlaces)).toEqual([]);expect(Object.values(importado.cosas).some(x=>x.nombre==='Huérfana')).toBe(false);
});
