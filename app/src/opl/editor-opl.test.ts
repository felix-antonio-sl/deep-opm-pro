import { test, expect } from 'bun:test';
import { crearModelo } from '../nucleo/modelo';
import { aplicarAcciones } from '../nucleo/operaciones';
import { validarForma } from '../nucleo/forma';
import { planificar, TEXTO_RAZON } from './planificar';
import { aplicarPlan } from './aplicar';
import { generarBloque, textoCanonico } from './generar';

const vacio = () => crearModelo({ id: 'm', nombre: 'Prueba' });
test('T-173 planificación pura y aplicación atómica por fases conservan IDs de ensayo', () => {
    const m = vacio(), antes = JSON.stringify(m), p = planificar(m, m.raiz, '*Validar* cambia **Pedido** de `nuevo` a `listo`.');
    expect(p.base).toBe(m); expect(JSON.stringify(m)).toBe(antes); expect(p.resumen.noAplicables).toBe(0);
    expect(p.acciones.map(a => a.op)).toContain('crearCosa'); expect(p.acciones.map(a => a.op)).toContain('agregarEstado');
    const r = aplicarPlan(m, p); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(validarForma(r.valor.modelo)).toEqual([]); const e = Object.values(r.valor.modelo.enlaces)[0]!;
    expect(e).toMatchObject({ tipo: 'efecto' }); const ensayo = aplicarAcciones(m, p.acciones); expect(ensayo.ok).toBe(true); if (ensayo.ok) expect(r.valor).toEqual(ensayo.valor);
    const otra = planificar(r.valor.modelo, m.raiz, textoCanonico(generarBloque(r.valor.modelo, m.raiz)));
    expect(otra.acciones).toEqual([]); expect(otra.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error'))).toEqual([]);
});
test('T-196 acciones vacías devuelven identidad y stale exige replanificar', () => {
    const m = vacio(), p = planificar(m, m.raiz, '\n'); const r = aplicarPlan(m, p);
    expect(r.ok).toBe(true); if (r.ok) expect(r.valor.modelo).toBe(m);
    expect(aplicarPlan({ ...m }, p)).toMatchObject({ ok: false, rechazo: { codigo: 'referencia-ambigua' } });
});
test('T-178 conflictos rechazan ambas líneas sin reservar IDs ni descartar otras válidas', () => {
    const m = vacio(), p = planificar(m, m.raiz, '**Pedido** es físico.\n**Pedido** es informacional.\n*Validar* es físico.');
    expect(p.lineas.slice(0, 2).map(l => l.razon)).toEqual(['conflicto-patches', 'conflicto-patches']);
    const r = aplicarPlan(m, p); expect(r.ok).toBe(true); if (r.ok) expect(Object.values(r.valor.modelo.cosas).map(c => c.nombre)).toEqual(['Validar']);
    expect(m.secuencia).toBe(2);
});
test('T-174 T-179 cuatro estados y ocho razones son visibles con partial parse real', () => {
    const m = vacio(), p = planificar(m, m.raiz, '\n**Pedido** es físico.\n??\n**Pedido** es físico.');
    expect(p.lineas.map(l => l.estado)).toEqual(['ignorada-vacia', 'aplicable', 'no-aplicable', 'sin-cambio']);
    expect(Object.values(TEXTO_RAZON)).toHaveLength(8); expect(Object.values(TEXTO_RAZON).every(Boolean)).toBe(true);
    expect(p.resumen).toEqual({ total: 4, aplicables: 1, noAplicables: 1, ignoradas: 1, sinCambio: 1 });
});
test('T-020 VAL crea primero la exhibición y después valor sin violar F13', () => {
    const m = vacio(), p = planificar(m, m.raiz, '**Color** de **Producto** es rojo.');
    expect(p.resumen.noAplicables).toBe(0); const r = aplicarPlan(m, p); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(validarForma(r.valor.modelo)).toEqual([]);
    const a = Object.values(r.valor.modelo.cosas).find(c => c.nombre === 'Color')!;
    expect(a).toMatchObject({ tipo: 'objeto', valor: 'rojo' });
    expect(Object.values(r.valor.modelo.enlaces)).toEqual([expect.objectContaining({ tipo: 'exhibicion', refinador: a.id })]);
});

test('T-177 T-158 tipo incompatible y nombre ambiguo no mutan ni eligen primer candidato',()=>{
 const m=vacio(),r=aplicarAcciones(m,[{op:'crearCosa',args:{opd:m.raiz,tipo:'objeto',nombre:'Pedido',x:0,y:0}}]);expect(r.ok).toBe(true);if(!r.ok)return;
 expect(planificar(r.valor.modelo,m.raiz,'*Pedido* es físico.').lineas[0]?.razon).toBe('enlace-invalido-firma');
 const c=Object.values(r.valor.modelo.cosas)[0]!,dup={...r.valor.modelo,cosas:{...r.valor.modelo.cosas,otro:{...c,id:'otro'}}};
 const p=planificar(dup,m.raiz,'**Pedido** es físico.');expect(p.lineas[0]?.razon).toBe('referencia-ambigua');expect(p.acciones).toEqual([]);
});
test('T-186 SE3 se combina por bloque antes del ensayo y segunda línea explica su par',()=>{
 const m=vacio(),p=planificar(m,m.raiz,'**Alfa** conoce **Beta**.\n**Beta** pertenece a **Alfa**.');
 expect(p.lineas.map(l=>l.estado)).toEqual(['aplicable','aplicable']);expect(p.lineas[1]?.detalle).toContain('par de la línea 1');
 const r=aplicarPlan(m,p);expect(r.ok).toBe(true);if(r.ok)expect(Object.values(r.valor.modelo.enlaces)).toEqual([expect.objectContaining({tipo:'etiquetadoBidireccional',etiqueta:'conoce',inversa:'pertenece a'})]);
});
test('T-178 conflicto de ajustes del mismo enlace rechaza ambas líneas conservando hecho nuclear',()=>{
 const r=aplicarAcciones(vacio(),[{op:'crearCosa',args:{opd:'opd-1',tipo:'objeto',nombre:'Pedido',x:0,y:0}},{op:'crearCosa',args:{opd:'opd-1',tipo:'proceso',nombre:'Validar',x:200,y:0}}]);expect(r.ok).toBe(true);if(!r.ok)return;
 const p=planificar(r.valor.modelo,'opd-1','**Pedido** inicia *Validar*, que consume **Pedido**.\n*Validar* consume **Pedido**.');
 expect(p.lineas.map(l=>l.razon)).toEqual(['conflicto-patches','conflicto-patches']);expect(p.acciones).toEqual([]);
});

test('T-172 nota única sólo ante ausencia real, no al autorreparse completo',()=>{
 const r=aplicarAcciones(vacio(),[{op:'crearCosa',args:{opd:'opd-1',tipo:'objeto',nombre:'Pedido',x:0,y:0}}]);expect(r.ok).toBe(true);if(!r.ok)return;
 expect(planificar(r.valor.modelo,'opd-1',textoCanonico(generarBloque(r.valor.modelo,'opd-1'))).notas).toEqual([]);
 expect(planificar(r.valor.modelo,'opd-1','').notas).toEqual([expect.objectContaining({codigo:'no-delete-by-absence',severidad:'info'})]);
});
test('T-159 escisión original y EX de fuente elevada no se destruyen al auto-reparsear',()=>{
 const b=vacio(),r=aplicarAcciones(b,[{op:'crearCosa',args:{opd:b.raiz,tipo:'proceso',nombre:'Gestionar',x:0,y:0}},{op:'crearCosa',args:{opd:b.raiz,tipo:'proceso',nombre:'Recuperar',x:700,y:0}}]);expect(r.ok).toBe(true);if(!r.ok)return;
 const parent=Object.values(r.valor.modelo.cosas).find(c=>c.nombre==='Gestionar')!.id,handler=Object.values(r.valor.modelo.cosas).find(c=>c.nombre==='Recuperar')!.id;
 const d=aplicarAcciones(r.valor.modelo,[{op:'fijarDuracion',args:{proceso:parent,duracion:{max:60,min:30,unidad:'min'}}},{op:'descomponer',args:{opd:b.raiz,proceso:parent,bandas:[['Preparar'],['Validar']]}}]);expect(d.ok).toBe(true);if(!d.ok)return;
 const model=d.valor.modelo,child=Object.values(model.opds).find(o=>o.tipo==='descomposicion')!,prep=Object.values(model.cosas).find(c=>c.nombre==='Preparar')!.id,valid=Object.values(model.cosas).find(c=>c.nombre==='Validar')!.id;
 const e=aplicarAcciones(model,[{op:'traerCosa',args:{opd:child.id,cosa:handler,x:600,y:0}},{op:'fijarDuracion',args:{proceso:prep,duracion:{max:5,unidad:'min'}}},{op:'fijarDuracion',args:{proceso:valid,duracion:{min:2,unidad:'hour'}}},{op:'crearEnlace',args:{opd:child.id,candidato:{tipo:'excepcionSobretiempo',origen:prep,destino:handler}}},{op:'crearEnlace',args:{opd:child.id,candidato:{tipo:'excepcionSubtiempo',origen:valid,destino:handler}}}]);expect(e.ok).toBe(true);if(!e.ok)return;
 const m=e.valor.modelo,before=JSON.stringify(m),p=planificar(m,b.raiz,textoCanonico(generarBloque(m,b.raiz)));
 expect(p.lineas.flatMap(l=>l.diagnosticos.filter(d=>d.severidad==='error'))).toEqual([]);expect(p.acciones).toEqual([]);expect(JSON.stringify(m)).toBe(before);
 const edited=planificar(m,b.raiz,textoCanonico(generarBloque(m,b.raiz)).replace('excede 5 minutos','excede 7 minutos'));
 expect(edited.acciones).toEqual([{op:'fijarDuracion',args:{proceso:prep,duracion:{max:7,unidad:'min'}}}]);
 const a=aplicarPlan(m,edited);expect(a.ok).toBe(true);if(a.ok){expect(a.valor.modelo.cosas[parent]).toEqual(m.cosas[parent]);expect(a.valor.modelo.enlaces).toEqual(m.enlaces);}
});

import { modeloCon, congelar, must } from '../pruebas/constructores';
import { erroresContexto, noOfrecido } from '../nucleo/matriz';
import type { Modelo } from '../nucleo/tipos';
test('T-168 dos EX de mismo campo elevado se resuelven por destino y fuente nuclear, no por primer proceso',()=>{
 const b=modeloCon({procesos:['Gestionar','Recuperar','Avisar','Preparar','Validar']}),[p,h1,h2,s1,s2]=Object.values(b.cosas);
 const app=b.opds[b.raiz]!.apariciones;
 const m=congelar<Modelo>({...b,cosas:{...b.cosas,[p!.id]:{...p!,tipo:'proceso',duracion:{max:60,unidad:'min'}},[s1!.id]:{...s1!,tipo:'proceso',duracion:{max:5,unidad:'min'}},[s2!.id]:{...s2!,tipo:'proceso',duracion:{max:2,unidad:'hour'}}},
  enlaces:{uno:{id:'uno',tipo:'excepcionSobretiempo',origen:s1!.id,destino:h1!.id},dos:{id:'dos',tipo:'excepcionSobretiempo',origen:s2!.id,destino:h2!.id}},
  opds:{[b.raiz]:{id:b.raiz,tipo:'raiz',apariciones:Object.fromEntries([p!,h1!,h2!].map(c=>[c.id,app[c.id]!]))},h:{id:'h',tipo:'descomposicion',padre:b.raiz,cosa:p!.id,orden:0,bandas:[[s1!.id],[s2!.id]],objetosInternos:[],apariciones:app}}});
 expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);
 const t=textoCanonico(generarBloque(m,b.raiz));expect(t).toContain('excede 5 minutos');expect(t).toContain('excede 2 horas');
 const before=JSON.stringify(m),a=planificar(m,b.raiz,t);expect(a.acciones).toEqual([]);expect(a.resumen.noAplicables).toBe(0);
 const e=planificar(m,b.raiz,t.replace('excede 2 horas','excede 3 horas'));expect(e.acciones).toEqual([{op:'fijarDuracion',args:{proceso:s2!.id,duracion:{max:3,unidad:'hour'}}}]);expect(JSON.stringify(m)).toBe(before);
});

test('T-182 identidades etiquetadas con estados distintos se agregan sin reanclar el hecho original',()=>{
 const m=modeloCon({objetos:[['Pedido',['nuevo','listo']],['Registro',[]]]}),[o,d]=Object.values(m.cosas);
 if(o?.tipo!=='objeto'||d?.tipo!=='objeto')throw Error('fixture');
 const b=must(aplicarAcciones(m,[{op:'crearEnlace',args:{opd:m.raiz,candidato:{tipo:'etiquetado',origen:o.id,destino:d.id,estadoOrigen:o.estados[0]!.id,etiqueta:'conoce'}}}])).modelo;
 const original=Object.values(b.enlaces)[0]!,before=JSON.stringify(b),plan=planificar(b,b.raiz,'**Pedido** en `listo` conoce **Registro**.');
 expect(plan.resumen.noAplicables).toBe(0);const r=aplicarPlan(b,plan);expect(r.ok).toBe(true);if(!r.ok)return;
 expect(r.valor.modelo.enlaces[original.id]).toEqual(original);expect(Object.values(r.valor.modelo.enlaces)).toEqual([original,expect.objectContaining({tipo:'etiquetado',estadoOrigen:o.estados[1]!.id})]);expect(JSON.stringify(b)).toBe(before);
});
test('T-182 nueva identidad de consumo sometida a RROL conserva enlace original al rechazar',()=>{
 const m=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Validar']}),o=Object.values(m.cosas).find(c=>c.tipo==='objeto')!,p=Object.values(m.cosas).find(c=>c.tipo==='proceso')!;
 if(o.tipo!=='objeto')throw Error('fixture');
 const b=must(aplicarAcciones(m,[{op:'crearEnlace',args:{opd:m.raiz,candidato:{tipo:'consumo',objeto:o.id,proceso:p.id,estado:o.estados[0]!.id}}}])).modelo;
 const plan=planificar(b,b.raiz,'*Validar* consume **Pedido** en `listo`.');expect(plan.lineas[0]?.diagnosticos).toEqual([expect.objectContaining({codigo:'type-mismatch',regla:'R-ROL-UNIC-1'})]);expect(plan.acciones).toEqual([]);expect(must(aplicarPlan(b,plan)).modelo).toBe(b);
});
test('T-150 género masculino literal revierte designación léxica femenina sin inferirla del nombre',()=>{
 const b=modeloCon({objetos:[['Pedido',[]]]}),id=Object.keys(b.cosas)[0]!,m=must(aplicarAcciones(b,[{op:'fijarGenero',args:{cosa:id,genero:'f'}}])).modelo;
 const p=planificar(m,m.raiz,'**Pedido** es físico.');expect(p.resumen.noAplicables).toBe(0);const r=aplicarPlan(m,p);expect(r.ok).toBe(true);if(r.ok)expect(r.valor.modelo.cosas[id]?.genero).toBeUndefined();expect(m.cosas[id]?.genero).toBe('f');
});
test('T-176 abanico común en estado no ofrecido es warning y línea entera sin acciones',()=>{
 const b=vacio(),text='Exactamente uno de *Validar* o *Archivar* consume **Pedido** en `nuevo`.',before=JSON.stringify(b),p=planificar(b,b.raiz,text);
 expect(p.lineas[0]).toMatchObject({estado:'sin-cambio',razon:'inversa-no-soportada'});expect(p.lineas[0]?.diagnosticos).toEqual([expect.objectContaining({codigo:'unsupported-canonical',severidad:'warning'})]);expect(p.acciones).toEqual([]);expect(JSON.stringify(b)).toBe(before);
});

for(const tipo of ['consumo','resultado'] as const)for(const operador of ['exactamente uno de','al menos uno de'])test(`T-181 ${tipo} mismo O/P estados distintos contexto atómico fase2 ${operador}`,()=>{
 const b=modeloCon(),text=`*Validar* ${tipo==='consumo'?'consume':'genera'} ${operador} **Pedido** en \`nuevo\` o **Pedido** en \`listo\`.`;
 const fixture=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Validar']}),o=Object.values(fixture.cosas).find(c=>c.tipo==='objeto')!,proc=Object.values(fixture.cosas).find(c=>c.tipo==='proceso')!;
 if(o.tipo!=='objeto')throw Error('fixture');
 const es:Modelo['enlaces']={a:{id:'a',tipo,objeto:o.id,proceso:proc.id,estado:o.estados[0]!.id},z:{id:'z',tipo,objeto:o.id,proceso:proc.id,estado:o.estados[1]!.id}},f={id:'f',operador:operador==='exactamente uno de'?'XOR' as const:'OR' as const,enlaces:['a','z']},legal:Modelo={...fixture,enlaces:es,abanicos:{f}};
 expect(validarForma(legal)).toEqual([]);expect(erroresContexto(legal)).toEqual([]);expect(Object.values(es).map(e=>noOfrecido(legal,e,f))).toEqual([null,null]);
 const p=planificar(b,b.raiz,text);expect(p.resumen.noAplicables).toBe(0);expect(p.lineas[0]?.diagnosticos).toEqual([]);const r=must(aplicarPlan(b,p)).modelo;
 expect(Object.values(r.abanicos)).toHaveLength(1);expect(Object.values(r.enlaces)).toHaveLength(2);expect(validarForma(r)).toEqual([]);expect(erroresContexto(r)).toEqual([]);
 expect(p.lineas[0]?.patches.filter(p=>p.p==='crear-enlace').map(p=>p.fase)).toEqual([2,2]);expect(p.acciones.some(a=>a.op==='crearEnlace'&&a.args.abanicoCon)).toBe(true);expect(planificar(r,r.raiz,textoCanonico(generarBloque(r,r.raiz))).acciones).toEqual([]);expect(Object.keys(b.enlaces)).toEqual([]);
});

test('T-165 estados explícitos reconstruyen visibilidad local sin borrar ni renombrar identidad',()=>{
 const b=modeloCon({objetos:[['Pedido',['nuevo','listo']]]}),o=Object.values(b.cosas)[0]!;if(o.tipo!=='objeto')throw Error('fixture');
 const m=must(aplicarAcciones(b,[{op:'suprimirEstado',args:{estado:o.estados[1]!.id,opd:b.raiz,activa:true}}])).modelo,p=planificar(m,m.raiz,'**Pedido** puede estar `nuevo` o `listo`.');
 expect(p.resumen.noAplicables).toBe(0);const r=must(aplicarPlan(m,p)).modelo;expect(proyectar(r,r.raiz).cosas[0]?.estadosVisibles).toEqual(o.estados.map(s=>s.id));expect(r.cosas[o.id]).toEqual(m.cosas[o.id]);expect(m.opds[m.raiz]!.apariciones[o.id]?.ocultos).toEqual([o.estados[1]!.id]);
});

import {proyectar} from '../nucleo/proyeccion';


test('T-167 etiqueta SD1 resuelve ID persistente del hijo al crear en su contexto',()=>{
 const b=modeloCon({procesos:['Gestionar']}),proceso=Object.keys(b.cosas)[0]!,m=must(aplicarAcciones(b,[{op:'descomponer',args:{opd:b.raiz,proceso,bandas:[['Preparar'],['Validar']]}}])).modelo,child=Object.values(m.opds).find(o=>o.tipo==='descomposicion')!;
 const antes=JSON.stringify(m),p=planificar(m,'modelo','## SD1\n**Cuenta** es informacional.');expect(p.resumen.noAplicables).toBe(0);expect(p.acciones.find(a=>a.op==='crearCosa')).toMatchObject({args:{opd:child.id,nombre:'Cuenta',tipo:'objeto'}});
 const resultado=must(aplicarPlan(m,p)).modelo,c=Object.values(resultado.cosas).find(c=>c.nombre==='Cuenta')!;expect(resultado.opds[child.id]!.apariciones[c.id]).toBeDefined();expect(resultado.opds[m.raiz]!.apariciones[c.id]).toBeUndefined();expect(JSON.stringify(m)).toBe(antes);
});
test('T-171 conjunto de hechos conserva IDs al reordenar líneas y T-185 display no produce patches',()=>{
 const m=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Validar'],enlaces:[['consumo','Pedido','Validar']]}),antes=JSON.stringify(m),ls=generarBloque(m,m.raiz).filter(l=>!l.soloDisplay),p=planificar(m,m.raiz,ls.map(l=>l.texto).reverse().join('\n'));
 expect(p.acciones).toEqual([]);expect(p.resumen.noAplicables).toBe(0);expect(must(aplicarPlan(m,p)).modelo).toBe(m);expect(planificar(m,'modelo','## SD').acciones).toEqual([]);expect(JSON.stringify(m)).toBe(antes);
});
test('T-184 editar lista de estados agrega sólo sub-span nuevo y conserva identidades existentes',()=>{
 const m=modeloCon({objetos:[['Pedido',['nuevo','listo']]]}),o=Object.values(m.cosas)[0]!;if(o.tipo!=='objeto')throw Error('fixture');const antes=JSON.stringify(m),p=planificar(m,m.raiz,'**Pedido** puede estar `nuevo`, `listo` o `pagado`.');
 expect(p.resumen.noAplicables).toBe(0);expect(p.acciones).toEqual([{op:'agregarEstado',args:{objeto:o.id,nombre:'pagado'}}]);const resultado=must(aplicarPlan(m,p)).modelo,actual=resultado.cosas[o.id]!;if(actual.tipo!=='objeto')throw Error('fixture');const previos:typeof o.estados=actual.estados.slice(0,2);expect(previos).toEqual(o.estados);expect(actual.estados[2]!.nombre).toBe('pagado');expect(JSON.stringify(m)).toBe(antes);
});
test('T-195 T-161 condición alternativa reconstruye hecho y regeneración canónica sin conservar superficie',()=>{
 const m=vacio(),p=planificar(m,m.raiz,'Si **Pedido** existe entonces *Validar* ocurre y consume **Pedido**, de lo contrario se omite *Validar*.');expect(p.resumen.noAplicables).toBe(0);const resultado=must(aplicarPlan(m,p)).modelo;expect(Object.values(resultado.enlaces)).toEqual([expect.objectContaining({tipo:'consumo',control:'c'})]);expect(textoCanonico(generarBloque(resultado,resultado.raiz))).toContain('*Validar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Validar* se omite.');
 expect(planificar(resultado,resultado.raiz,'Si **Pedido** existe entonces *Validar* ocurre y consume **Pedido**, de lo contrario se omite *Validar*.').acciones).toEqual([]);
});

for(const slot of ['por defecto','declarado `Current`'])test(`T-178 dos estados distintos para el slot único ${slot} rechazan ambas declaraciones`,()=>{
 const m=modeloCon({objetos:[['Pedido',['pendiente','completado']]]}),o=Object.values(m.cosas)[0]!,antes=JSON.stringify(m),p=planificar(m,m.raiz,`Estado \`pendiente\` de **Pedido** es ${slot}.\nEstado \`completado\` de **Pedido** es ${slot}.`);
 expect(p.lineas.map(l=>l.razon)).toEqual(['conflicto-patches','conflicto-patches']);expect(p.acciones).toEqual([]);expect(must(aplicarPlan(m,p)).modelo).toBe(m);expect(JSON.stringify(m)).toBe(antes);expect(o.tipo).toBe('objeto');
});
test('T-108 T-178 declaraciones compatibles repetidas D7 D10 D9 D13 no son conflictos ni duplican acciones',()=>{
 const m=modeloCon({objetos:[['Pedido',['pendiente','completado']]]}),o=Object.values(m.cosas)[0]!;if(o.tipo!=='objeto')throw Error('Objeto');const antes=JSON.stringify(m),texto='Estado `pendiente` de **Pedido** es inicial.\nEstado `pendiente` de **Pedido** es inicial y final.\nEstado `pendiente` de **Pedido** es por defecto.\nEstado `pendiente` de **Pedido** es por defecto.\nEstado `pendiente` de **Pedido** es declarado `Current`.\nEstado `pendiente` de **Pedido** es declarado `Current`.',p=planificar(m,m.raiz,texto);
 expect(p.resumen.noAplicables).toBe(0);expect(p.acciones).toEqual((['inicial','final','porDefecto','current'] as const).map(designacion=>({op:'designar',args:{estado:o.estados[0]!.id,designacion,activa:true}})));const n=must(aplicarPlan(m,p)).modelo,c=n.cosas[o.id];if(c?.tipo!=='objeto')throw Error('Objeto');expect(c.estados[0]).toMatchObject({id:o.estados[0]!.id,nombre:'pendiente',inicial:true,final:true});expect(c.porDefecto).toBe(o.estados[0]!.id);expect(c.current).toBe(o.estados[0]!.id);expect(JSON.stringify(m)).toBe(antes);
});
test('T-108 T-178 designaciones por objeto independientes y varios iniciales/finales no colisionan',()=>{
 const m=modeloCon({objetos:[['Pedido',['pendiente','completado']],['Registro',['pendiente','completado']]]}),texto='Estado `pendiente` de **Pedido** es inicial y final.\nEstado `completado` de **Pedido** es inicial y final.\nEstado `pendiente` de **Pedido** es por defecto.\nEstado `completado` de **Registro** es por defecto.\nEstado `pendiente` de **Pedido** es declarado `Current`.\nEstado `completado` de **Registro** es declarado `Current`.',p=planificar(m,m.raiz,texto);expect(p.resumen.noAplicables).toBe(0);const n=must(aplicarPlan(m,p)).modelo;for(const c of Object.values(n.cosas)){if(c.tipo!=='objeto')throw Error('Objeto');expect(c.estados.find(s=>s.id===c.porDefecto)?.nombre).toBe(c.nombre==='Pedido'?'pendiente':'completado');expect(c.current).toBe(c.porDefecto);}const pedido=Object.values(n.cosas).find(c=>c.nombre==='Pedido');if(pedido?.tipo!=='objeto')throw Error('Objeto');expect(pedido.estados.every(s=>s.inicial&&s.final)).toBe(true);
});
