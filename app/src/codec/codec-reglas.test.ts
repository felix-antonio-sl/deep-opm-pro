import { test, expect } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { importarV0 } from './importar';
import { exportarV0 } from './exportar';
import { informeVacio } from './informe';
import { leerCanonico, revision } from './canonico';
import { validarForma } from '../nucleo/forma';
import { azar } from '../pruebas/azar';
import { documento, entidad, enlace, extremo, refinado, apariencia } from './pruebas';
import type { Raw } from './pruebas';
function leer(d:Raw){const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(validarForma(r.modelo)).toEqual([]);return r;}
function fixed(d:Raw){const r=leer(d),a=exportarV0(r.modelo),b=importarV0(a);expect(b.ok).toBe(true);if(!b.ok)throw Error(JSON.stringify(b.informe));expect(b.informe).toMatchObject({normalizado:[],descartado:[],rechazos:[],visibilidad:[]});expect(exportarV0(b.modelo)).toBe(a);expect(leerCanonico(a).ok).toBe(true);return r;}
const states=()=>[{id:'s-6',entidadId:'o-1',nombre:'inicial'},{id:'s-7',entidadId:'o-1',nombre:'final'}];
test('T-022 ids opacos __proto__/constructor/toString sobreviven y export ordena natural',()=>{
 const d=documento([entidad('__proto__'),entidad('constructor'),entidad('toString'),entidad('o-10'),entidad('o-2')]);const r=fixed(d);expect(Object.keys(r.modelo.cosas)).toHaveLength(5);expect(r.modelo.cosas['__proto__']).toMatchObject({id:'__proto__',tipo:'objeto'});const raw=JSON.parse(exportarV0(r.modelo));expect(Object.keys(raw.modelo.entidades).indexOf('o-2')).toBeLessThan(Object.keys(raw.modelo.entidades).indexOf('o-10'));
});
test('T-022 ids inválidos se reasignan con todas las referencias y secuencia válida',()=>{
 const d=documento([entidad('id con espacio'),entidad('p-2','proceso')],[enlace('e-3','consumo','id con espacio','p-2')]);d.modelo.nextSeq=1;const r=leer(d),obj=Object.values(r.modelo.cosas).find(c=>c.tipo==='objeto')!;expect(obj.id).toMatch(/^o-\d+$/);expect(r.modelo.enlaces['e-3']).toMatchObject({objeto:obj.id});expect(r.modelo.opds['opd-1']!.apariciones[obj.id]).toBeDefined();expect(r.modelo.secuencia).toBeGreaterThan(Number(obj.id.split('-').at(-1)));expect(r.informe.normalizado.some(e=>e.ruta.includes('id con espacio'))).toBe(true);
});
test('T-025 nombres duplicados y fuera del léxico conservan identidad y texto',()=>{
 const d=documento([entidad('o-1','objeto',{nombre:' duplicado '}),entidad('o-2','objeto',{nombre:' duplicado '})]);const r=fixed(d);expect(Object.values(r.modelo.cosas).map(c=>c.nombre)).toEqual([' duplicado ',' duplicado ']);
});
test('T-016 desconocidos en designaciones se declaran sin borrar estados',()=>{
 const d=documento([entidad('o-1')],[],[{id:'s-3',entidadId:'o-1',nombre:'a',designaciones:['inicial','alien']}]);const r=leer(d);expect(r.modelo.cosas['o-1']).toMatchObject({estados:[{inicial:true}]});expect(r.informe.descartado.some(e=>e.ruta==='estados.s-3.designaciones'&&e.mensaje.includes('alien'))).toBe(true);
});
test('T-006 campo perdido entero consume desconocidos anidados sin duplicar pérdida',()=>{
 const d=documento([entidad('p-2','proceso',{duracion:{min:-1,unknown:{detail:5}}})]);const r=leer(d);expect(r.informe.descartado.filter(e=>e.ruta.startsWith('entidades.p-2.duracion')).map(e=>e.ruta)).toEqual(['entidades.p-2.duracion']);
});
for(const campo of ['alias','unidad','imagen','urls','simulacion','estereotipoId','anclaje','requisito','lineal','orderedFundamentalTypes'])test(`T-006 extensión de cosa ${campo} se declara`,()=>{const d=documento([entidad('o-1','objeto',{[campo]:[1]})]);expect(leer(d).informe.descartado.some(e=>e.ruta===`entidades.o-1.${campo}`)).toBe(true);});
test('T-006 metadatos visuales y geometría de enlace son ignorados, sin falsa pérdida',()=>{
 const d=documento([entidad('o-1','objeto',{esAtributo:true,layoutEstados:{x:1}}),entidad('p-2','proceso')],[enlace('e','consumo','o-1','p-2')]);const ae=d.modelo.opds['opd-1'].enlaces['ae-e'];Object.assign(ae,{symbolPos:{x:1},symbolAnchors:{a:2},labelPositions:[1]});const r=leer(d);expect(r.informe.descartado).toEqual([]);expect(Object.keys(r.informe.ignorado).some(k=>k.endsWith('symbolAnchors'))).toBe(true);
});
test('T-029 ranuras duplicadas conservan primera por id cuya cosa aparezca',()=>{
 const d=refinado();d.modelo.entidades['o-1'].refinamientos={despliegue:{opdId:'opd-3',modo:'agregacion'}};const r=leer(d);expect(r.modelo.opds['opd-3']).toMatchObject({tipo:'despliegue',cosa:'o-1'});expect(r.informe.descartado.some(e=>e.ruta.includes('p-2.refinamientos'))).toBe(true);
});
test('T-029 padre autorreferente y ciclo de padres se normalizan sin excepción',()=>{
 const d=refinado();d.modelo.opds['opd-3'].padreId='opd-3';expect(leer(d).modelo.opds['opd-3']).toMatchObject({padre:'opd-1'});
 const e=refinado();e.modelo.entidades['p-4'].refinamientos={despliegue:{opdId:'opd-6',modo:'agregacion'}};e.modelo.opds['opd-6']={id:'opd-6',nombre:'SD2',padreId:'opd-3',apariencias:{a:apariencia('p-4','opd-6')},enlaces:{}};e.modelo.opds['opd-3'].padreId='opd-6';const r=leer(e);expect(r.modelo.opds['opd-3']).toMatchObject({padre:'opd-1'});expect(r.modelo.opds['opd-6']).toMatchObject({padre:'opd-3'});
});
test('T-029 ciclo de cosa refinada descarta subárbol, conserva hechos',()=>{
 const d=refinado();d.modelo.entidades['p-2'].refinamientos.despliegue={opdId:'opd-6',modo:'agregacion'};d.modelo.opds['opd-6']={id:'opd-6',nombre:'SD1.1',padreId:'opd-3',apariencias:{a:apariencia('p-2','opd-6')},enlaces:{}};const r=leer(d);expect(r.modelo.opds['opd-6']).toBeUndefined();expect(r.modelo.cosas['p-2']).toBeDefined();expect(r.informe.descartado.some(e=>e.regla==='R-REF-1')).toBe(true);
});
test('T-029 hijo de padre descartado se recuelga y cascada sin aparición pierde OPD',()=>{
 const d=refinado();d.modelo.opds['opd-3'].vista={tipo:'otra'};d.modelo.entidades['p-4'].refinamientos={despliegue:{opdId:'opd-6',modo:'agregacion'}};d.modelo.opds['opd-6']={id:'opd-6',nombre:'SD',padreId:'opd-3',apariencias:{a:apariencia('p-4','opd-6')},enlaces:{}};expect(leer(d).modelo.opds['opd-6']).toBeUndefined();d.modelo.opds['opd-1'].apariencias.p4=apariencia('p-4');expect(leer(d).modelo.opds['opd-6']).toMatchObject({padre:'opd-1'});
});
test('T-030 ordenInzoom filtra/completa internos; externo no se transforma en interno',()=>{
 const d=refinado();d.modelo.opds['opd-3'].ordenInzoom=[['o-1','p-4','p-4']];const r=leer(d);expect(r.modelo.opds['opd-3']).toMatchObject({bandas:[['p-4'],['p-5']]});
});
test('T-033 interno con aparición fuera del subárbol pasa a externo',()=>{
 const d=refinado();d.modelo.opds['opd-1'].apariencias.p4=apariencia('p-4');const r=leer(d);expect(r.modelo.opds['opd-3']).toMatchObject({bandas:[['p-5']]});expect(r.informe.normalizado.some(e=>e.regla==='T-033'&&e.mensaje.includes('fuera'))).toBe(true);
});
test('T-032 metadata sola, tres mitades y objetos distintos nunca fabrican par',()=>{
 for(const variant of ['single','three','objects']){const d=refinado([enlace('in','efecto','p-4','o-1',{estadoEntradaId:'s-6',efectoEscindido:{grupoId:'g',rol:'entrada'}}),enlace('out','efecto','p-5','o-1',{estadoSalidaId:'s-7',efectoEscindido:{grupoId:'g',rol:'salida'}})]);d.modelo.estados=Object.fromEntries(states().map(s=>[s.id,s]));if(variant==='single'){delete d.modelo.enlaces.out;delete d.modelo.opds['opd-1'].enlaces['ae-out'];}if(variant==='three')d.modelo.enlaces.third={...d.modelo.enlaces.in,id:'third'};if(variant==='objects'){d.modelo.entidades['o-8']=entidad('o-8');d.modelo.estados['s-7'].entidadId='o-8';d.modelo.enlaces.out.destinoId=extremo('o-8');}const r=leer(d);expect(Object.values(r.modelo.enlaces).every(e=>!('escision'in e))).toBe(true);if(variant!=='single')expect(r.informe.descartado.some(e=>e.ruta.endsWith('efectoEscindido'))).toBe(true);}
});
test('T-032 controles ilegales en tipo y mitades se pierden como campo',()=>{
 const d=refinado([enlace('in','efecto','p-4','o-1',{estadoEntradaId:'s-6',modificador:'evento',efectoEscindido:{grupoId:'g',rol:'entrada',modo:'par'}}),enlace('out','efecto','p-5','o-1',{estadoSalidaId:'s-7',modificador:'condicion',efectoEscindido:{grupoId:'g',rol:'salida',modo:'par'}}),enlace('r','resultado','p-4','o-1',{modificador:'evento'})]);d.modelo.estados=Object.fromEntries(states().map(s=>[s.id,s]));const r=fixed(d);expect(Object.values(r.modelo.enlaces).every(e=>!('control'in e))).toBe(true);expect(r.informe.descartado.filter(e=>e.ruta.endsWith('modificador'))).toHaveLength(3);
});
test('T-287 efecto anclado a estado de otro objeto pierde solo anclaje',()=>{
 const d=documento([entidad('o-1'),entidad('o-3'),entidad('p-2','proceso')],[enlace('e','efecto','p-2','o-1',{estadoEntradaId:'s-4'})],[{id:'s-4',entidadId:'o-3',nombre:'a'}]);const r=fixed(d);expect(r.modelo.enlaces.e).toEqual({id:'e',tipo:'efecto',objeto:'o-1',proceso:'p-2'});expect(r.informe.descartado.some(e=>e.regla==='F-3')).toBe(true);
});
test('T-092 especialización de estado bilateral y anclaje estructural unilateral',()=>{
 const es=[{id:'s-3',entidadId:'o-1',nombre:'a'},{id:'s-4',entidadId:'o-2',nombre:'b'}];const d=documento([entidad('o-1'),entidad('o-2')],[enlace('e','generalizacion','s-3','s-4',{origenId:extremo('s-3','estado'),destinoId:extremo('s-4','estado')})],es);expect(fixed(d).modelo.enlaces.e).toMatchObject({estados:{general:'s-3',especializacion:'s-4'}});d.modelo.enlaces.e.destinoId=extremo('o-2');const r=fixed(d);expect('estados'in r.modelo.enlaces.e!).toBe(false);expect(r.informe.descartado.some(e=>e.regla==='R-OPL-RF-3')).toBe(true);
});
for(const tipo of ['efecto','invocacion','agregacion','etiquetado'])test(`T-006 ruta no representable ${tipo} se declara`,()=>{
 const d=documento([entidad('o-1'),entidad('o-3'),entidad('p-2','proceso'),entidad('p-4','proceso')],[enlace('e',tipo,tipo==='invocacion'?'p-2':tipo==='efecto'?'p-2':'o-1',tipo==='invocacion'?'p-4':tipo==='efecto'?'o-1':'o-3',{rutaEtiqueta:'ruta'})]);const r=leer(d);expect(r.modelo.enlaces.e).toBeDefined();expect('ruta'in r.modelo.enlaces.e!).toBe(false);expect(r.informe.descartado.some(e=>e.ruta==='enlaces.e.rutaEtiqueta'&&e.regla==='DR-19')).toBe(true);
});
test('T-052 subtipo C/E alias, ruta permitida y multiplicidad ilegal destino proceso',()=>{
 const d=documento([entidad('o-1'),entidad('p-2','proceso')],[enlace('e','consumo','o-1','p-2',{subtipoModificador:'C',multiplicidadDestino:'+',rutaEtiqueta:'R1'})]);const r=fixed(d);expect(r.modelo.enlaces.e).toEqual({id:'e',tipo:'consumo',objeto:'o-1',proceso:'p-2',control:'c',ruta:'R1'});expect(r.informe.descartado.some(e=>e.ruta.endsWith('multiplicidadDestino'))).toBe(true);
});
test('T-021 excepción dual genera ids distintos y conserva cotas, choque numérico primero',()=>{
 const d=documento([entidad('p-1','proceso'),entidad('p-2','proceso')],[enlace('e','excepcionSubSobretiempo','p-1','p-2',{tiempoMinimo:'1',tiempoMaximo:'2',unidadTiempoMinimo:'h',unidadTiempoMaximo:'h'})]);const r=fixed(d);expect(Object.values(r.modelo.enlaces).map(e=>e.tipo).sort()).toEqual(['excepcionSobretiempo','excepcionSubtiempo']);expect(r.modelo.enlaces['e~sub']).toBeDefined();expect(r.modelo.cosas['p-1']).toMatchObject({duracion:{min:1,max:2,unidad:'hour'}});
 d.modelo.enlaces.other=enlace('other','excepcionSobretiempo','p-1','p-2',{tiempoMaximo:'8',unidadTiempoMaximo:'h'});expect(leer(d).modelo.cosas['p-1']).toMatchObject({duracion:{max:2}});expect(leer(d).informe.descartado.some(e=>e.ruta==='enlaces.other.tiempoMaximo')).toBe(true);
});
test('T-028 fan derivado y alias repetido ignorados, pertenencia doble conserva primero',()=>{
 const d=refinado([enlace('p1','instrumento','o-1','p-2'),enlace('p2','instrumento','o-1','p-5'),enlace('d1','instrumento','o-1','p-4',{derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'p1',refinamientoId:'p-2'}}),enlace('d2','instrumento','o-1','p-4',{derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'p2',refinamientoId:'p-2'}})]);
 d.modelo.abanicos={f1:{id:'f1',operador:'O',enlaceIds:['p1','p2']},fd:{id:'fd',operador:'O',enlaceIds:['d1','d2'],puertoComun:{portId:'port-fan-ref-x'}},f2:{id:'f2',operador:'XOR',enlaceIds:['p1','p2']}};const r=leer(d);expect(r.modelo.abanicos.f1).toBeDefined();expect(r.modelo.abanicos.fd).toBeUndefined();expect(r.informe.ignorado['abanicos.fd']).toBe(1);expect(r.informe.descartado.some(e=>e.ruta==='abanicos.fd')).toBe(false);expect(r.modelo.abanicos.f2).toBeUndefined();
});
test('T-054 abanico efecto mixto no ofrecido pierde fan conserva estados y enlaces',()=>{
 const d=documento([entidad('o-1'),entidad('p-2','proceso')],[enlace('a','efecto','p-2','o-1',{estadoEntradaId:'s-6',estadoSalidaId:'s-7'}),enlace('b','efecto','p-2','o-1',{estadoEntradaId:'s-7',estadoSalidaId:'s-6'})],states());d.modelo.abanicos.f={id:'f',operador:'XOR',enlaceIds:['a','b']};const r=fixed(d);expect(r.modelo.abanicos.f).toBeUndefined();expect(Object.keys(r.modelo.enlaces)).toHaveLength(2);expect(r.informe.descartado.some(e=>e.regla==='R-FAN-5/5A')).toBe(true);
});
test('T-196 SHA256 UTF8 independiente en bloques 55/56/64/1000 y astrales',async()=>{
 for(const s of ['','x'.repeat(55),'x'.repeat(56),'x'.repeat(64),'x'.repeat(1000),'á Ñ 🧭\n']){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),n=>n.toString(16).padStart(2,'0')).join('');expect(await revision(s)).toBe(hash);}
});
test('T-286 fixture sintético reproducible semilla 20261002 sin cambiar generador',()=>{
 const path=new URL('../../fixtures/v0/sintetico.json',import.meta.url);expect(existsSync(path)).toBe(true);expect(readFileSync(path,'utf8')).toBe(exportarV0(azar(20261002,'completo')));expect(informeVacio(importarV0(readFileSync(path,'utf8')).informe)).toBe(true);
});
test('T-196 C+R bloqueado por multiplicidad luego retirada por F-5 también exige punto fijo',()=>{
 const d=documento([entidad('o-1'),entidad('p-2','proceso')],[enlace('c','consumo','s-6','p-2',{origenId:extremo('s-6','estado'),multiplicidadOrigen:'+',modificador:'condicion'}),enlace('r','resultado','p-2','s-7',{destinoId:extremo('s-7','estado')})],states());
 const original=leer(d);expect(Object.keys(original.modelo.enlaces)).toEqual(['c','r']);expect(original.informe.descartado.some(e=>e.regla==='DR-44')).toBe(true);
 const a=exportarV0(original.modelo),retorno=importarV0(a);expect(retorno.ok).toBe(true);if(!retorno.ok)throw Error(JSON.stringify(retorno.informe));expect(exportarV0(retorno.modelo)).toBe(a);expect(informeVacio(retorno.informe)).toBe(true);
});
test('T-286 punto fijo de las 15 clases, anclajes, metadatos y duración derivada',()=>{
 const d=documento([entidad('o-1','objeto',{descripcion:'meta',genero:'f',coleccionIncompleta:['generalizacion']}),entidad('o-4','objeto',{valorSlot:{tipo:'string',valor:'12'}}),entidad('o-6'),entidad('p-2','proceso',{duracion:{min:1,max:3,unidad:'hour'}}),entidad('p-5','proceso')],[
 enlace('c','consumo','s-6','p-2',{origenId:extremo('s-6','estado'),rutaEtiqueta:'entrada'}),enlace('r','resultado','p-5','s-7',{destinoId:extremo('s-7','estado'),rutaEtiqueta:'salida'}),enlace('fx','efecto','p-2','o-1',{estadoEntradaId:'s-6',estadoSalidaId:'s-7'}),
 enlace('agent','agente','o-6','p-2',{modificador:'evento'}),enlace('instrument','instrumento','o-6','p-5',{multiplicidadOrigen:'+'}),enlace('iv','invocacion','p-2','p-5'),enlace('max','excepcionSobretiempo','p-2','p-5',{tiempoMaximo:'3',unidadTiempoMaximo:'h'}),enlace('min','excepcionSubtiempo','p-2','p-5',{tiempoMinimo:'1',unidadTiempoMinimo:'h'}),
 enlace('agg','agregacion','o-1','o-6',{multiplicidadDestino:'*'}),enlace('exhib','exhibicion','o-1','o-4'),enlace('gen','generalizacion','s-6','s-8',{origenId:extremo('s-6','estado'),destinoId:extremo('s-8','estado')}),enlace('class','clasificacion','o-1','o-6'),
 enlace('tag','etiquetado','s-6','o-6',{origenId:extremo('s-6','estado'),etiqueta:'une'}),enlace('bi','etiquetadoBidireccional','s-6','o-6',{origenId:extremo('s-6','estado'),etiqueta:'tiene',backwardTag:'pertenece'}),enlace('rec','etiquetadoBidireccional','s-6','s-8',{origenId:extremo('s-6','estado'),destinoId:extremo('s-8','estado'),etiqueta:'colabora',backwardTag:'colabora'}),
 ],[...states(),{id:'s-8',entidadId:'o-6',nombre:'otro'}]);const r=fixed(d);expect(new Set(Object.values(r.modelo.enlaces).map(e=>e.tipo)).size).toBe(15);expect(r.modelo.cosas['o-4']).toMatchObject({valor:'12'});
});
test('T-040 excepción dual con firma inválida se descarta entera sin lanzar residual',()=>{
 const d=documento([entidad('o-1'),entidad('p-2','proceso')],[enlace('bad','excepcionSubSobretiempo','o-1','p-2',{tiempoMinimo:'1',tiempoMaximo:'2',unidadTiempoMinimo:'h',unidadTiempoMaximo:'h'})]);
 const r=leer(d);expect(Object.keys(r.modelo.enlaces)).toEqual([]);expect(r.informe.descartado.some(e=>e.ruta==='enlaces.bad'&&e.regla==='F-2')).toBe(true);expect(r.informe.normalizado.some(e=>e.regla==='T-265')).toBe(false);
});
test('T-040 excepción descartada por firma no inventa duración en la fuente',()=>{
 const d=documento([entidad('p-1','proceso'),entidad('o-2')],[enlace('bad','excepcionSobretiempo','p-1','o-2',{tiempoMaximo:'2',unidadTiempoMaximo:'h'})]);
 const r=leer(d);expect(r.modelo.enlaces.bad).toBeUndefined();expect(r.modelo.cosas['p-1']).not.toHaveProperty('duracion');expect(r.informe.normalizado.some(e=>e.regla==='R-EXC-2/3')).toBe(false);
});
test('T-029 conversión de descomposición de objeto enumera apariciones sin parte agregada',()=>{
 const d=refinado();d.modelo.entidades['p-2'].tipo='objeto';d.modelo.entidades['p-4'].tipo='objeto';const r=leer(d);const n=r.informe.normalizado.find(e=>e.regla==='DR-23');expect(n?.mensaje).toContain('o-1');expect(n?.mensaje).toContain('p-4');expect(Object.keys(r.modelo.enlaces)).toEqual([]);
});
test('T-287 desconocidos anidados profundamente se informan sin excepción de pila',()=>{
 const d=documento([entidad('o-1')]);let tail='7';for(let i=0;i<12000;i++)tail='{"x":'+tail+'}';const text=JSON.stringify(d).replace('"modelo":{','"modelo":{"unknown":'+tail+',');const r=importarV0(text);expect(r.ok).toBe(true);expect(r.informe.descartado).toHaveLength(1);expect(r.informe.descartado[0]?.ruta).toBe('unknown'+'.x'.repeat(12000));
});
test('T-028 abanico sin extremo común cargado conserva punto fijo y las dos ramas',()=>{
 const d=documento([entidad('o-1'),entidad('o-3'),entidad('p-2','proceso'),entidad('p-4','proceso')],[enlace('a','instrumento','o-1','p-2'),enlace('b','instrumento','o-3','p-4')]);d.modelo.abanicos.f={id:'f',operador:'O',enlaceIds:['a','b']};expect(fixed(d).modelo.abanicos.f).toMatchObject({enlaces:['a','b']});
});
test('T-287 API total para desconocido a 40000 niveles conserva ruta y pérdida completas',()=>{
 const d=documento([entidad('o-1')]);let value='7';for(let i=0;i<40000;i++)value='{"x":'+value+'}';const text=JSON.stringify(d).replace('"modelo":{','"modelo":{"datoProfundo":'+value+',');let r:ReturnType<typeof importarV0>|undefined;
 expect(()=>{r=importarV0(text);}).not.toThrow();expect(r?.ok).toBe(true);expect(r?.informe.descartado).toEqual([{ruta:'datoProfundo'+'.x'.repeat(40000),mensaje:'Campo desconocido: 7.',regla:'T-006'}]);expect(r?.informe.rechazos).toEqual([]);
});
test('T-006 desconocidos mixtos conservan orden de hojas y categoría de pérdida',()=>{
 const d=documento([entidad('o-1')]);d.modelo.extra={primero:{a:1},arreglo:[{b:2},3,{},[],null],ultimo:'original'};const r=leer(d);expect(r.informe.descartado.map(e=>({ruta:e.ruta,regla:e.regla,mensaje:e.mensaje}))).toEqual([
 {ruta:'extra.primero.a',regla:'T-006',mensaje:'Campo desconocido: 1.'},
 {ruta:'extra.arreglo.0.b',regla:'T-006',mensaje:'Campo desconocido: 2.'},
 {ruta:'extra.arreglo.1',regla:'T-006',mensaje:'Campo desconocido: 3.'},
 {ruta:'extra.arreglo.2',regla:'T-006',mensaje:'Campo desconocido: {}.'},
 {ruta:'extra.arreglo.3',regla:'T-006',mensaje:'Campo desconocido: [].'},
 {ruta:'extra.arreglo.4',regla:'T-006',mensaje:'Campo desconocido: null.'},
 {ruta:'extra.ultimo',regla:'T-006',mensaje:'Campo desconocido: "original".'},
 ]);
});
test('T-020 valorSlot sin valor se ignora y tipo no string se declara independientemente',()=>{
 const d=documento([entidad('o-1','objeto',{valorSlot:{tipo:'number',placeholder:'value'}})]);const r=leer(d);expect(r.modelo.cosas['o-1']).not.toHaveProperty('valor');expect(r.informe.ignorado['entidades.o-1.valorSlot']).toBe(2);expect(r.informe.descartado).toEqual([{ruta:'entidades.o-1.valorSlot.tipo',mensaje:'Información no representable: "number".',regla:'T-020'}]);
});
test('T-020 valorSlot string sin valor se ignora sin falsa pérdida',()=>{
 const d=documento([entidad('o-1','objeto',{valorSlot:{tipo:'string',placeholder:'value'}})]);const r=leer(d);expect(r.modelo.cosas['o-1']).not.toHaveProperty('valor');expect(r.informe.ignorado['entidades.o-1.valorSlot']).toBe(2);expect(r.informe.descartado).toEqual([]);
});
for(const valor of [{toString:7},{valueOf:2,toString:null},['texto','otro']])test(`T-020 valorSlot objeto ${JSON.stringify(valor)} se pierde completo sin fabricar texto ni lanzar`,()=>{
 const d=documento([entidad('o-1'),entidad('o-3','objeto',{valorSlot:{tipo:'object',valor}})],[enlace('e','exhibicion','o-1','o-3')]);let r:ReturnType<typeof importarV0>|undefined;expect(()=>{r=importarV0(JSON.stringify(d));}).not.toThrow();expect(r?.ok).toBe(true);if(!r?.ok)throw Error('Documento debería conservarse');expect(validarForma(r.modelo)).toEqual([]);expect(r.modelo.cosas['o-3']).not.toHaveProperty('valor');expect(r.modelo.enlaces.e).toBeDefined();expect(r.informe.descartado.find(e=>e.ruta==='entidades.o-3.valorSlot.valor')?.mensaje).toContain(JSON.stringify(valor));expect(r.informe.descartado.some(e=>e.ruta==='entidades.o-3.valorSlot.tipo')).toBe(true);
});
for(const campo of ['multiplicidadOrigen','multiplicidadDestino'])test(`T-057 ${campo} objeto sin coerción se declara sin perder enlace`,()=>{
 const d=documento([entidad('o-1'),entidad('p-2','proceso')],[enlace('e','instrumento','o-1','p-2',{[campo]:{toString:7}})]);let r:ReturnType<typeof importarV0>|undefined;expect(()=>{r=importarV0(JSON.stringify(d));}).not.toThrow();expect(r?.ok).toBe(true);if(!r?.ok)throw Error('Documento debería conservarse');expect(r.modelo.enlaces.e).toEqual({id:'e',tipo:'instrumento',objeto:'o-1',proceso:'p-2'});expect(r.informe.descartado).toEqual([{ruta:`enlaces.e.${campo}`,mensaje:'Multiplicidad fuera del producto: {"toString":7}.',regla:'DR-21'}]);
});
test('T-287 pérdida completa de valorSlot objeto a 40000 niveles conserva original sin pila recursiva',()=>{
 const d=documento([entidad('o-1'),entidad('o-3','objeto',{valorSlot:{tipo:'object',valor:'PAYLOAD'}})],[enlace('e','exhibicion','o-1','o-3')]);let value='7';for(let i=0;i<40000;i++)value='{"x":'+value+'}';const text=JSON.stringify(d).replace('"PAYLOAD"',value);let r:ReturnType<typeof importarV0>|undefined;expect(()=>{r=importarV0(text);}).not.toThrow();expect(r?.ok).toBe(true);if(!r?.ok)throw Error('Documento debería conservarse');expect(validarForma(r.modelo)).toEqual([]);expect(r.modelo.cosas['o-3']).not.toHaveProperty('valor');expect(r.informe.descartado.find(e=>e.ruta==='entidades.o-3.valorSlot.valor')?.mensaje).toBe('Valor de slot no textual representable: '+value+'.');
});
test('T-020 valores primitivos de slot conservan las conversiones texto y número previas',()=>{
 for(const [valor,texto] of [[12,'12'],[12.5,'12.5'],['texto á\n','texto á\n'],[false,'false'],[null,'null']] as const){const d=documento([entidad('o-1'),entidad('o-3','objeto',{valorSlot:{tipo:'string',valor}})],[enlace('e','exhibicion','o-1','o-3')]);expect(leer(d).modelo.cosas['o-3']).toMatchObject({valor:texto});}
});
test('T-287 extensión declarada profunda conserva original y conteo en Informe iterativo',()=>{
 const d=documento([entidad('o-1')]);let value='7';for(let i=0;i<40000;i++)value='{"x":'+value+'}';const text=JSON.stringify(d).replace('"modelo":{','"modelo":{"ontologia":'+value+',');let r:ReturnType<typeof importarV0>|undefined;expect(()=>{r=importarV0(text);}).not.toThrow();expect(r?.ok).toBe(true);expect(r?.informe.descartado).toEqual([{ruta:'ontologia',mensaje:'1 elementos no representables: '+value+'.',regla:'T-006'}]);
});
