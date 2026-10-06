import { expect, test } from 'bun:test';
import { generarBloque, generarModelo, lineaDeEnlace, textoCanonico } from './generar';
import { congelar } from '../pruebas/constructores';
import type { Modelo, Cosa, Objeto, Enlace, EnlaceNuevo, Opd, Abanico } from '../nucleo/tipos';
import { validarForma } from '../nucleo/forma';
import { diagnosticar } from '../nucleo/diagnostico';
import { violacionesContexto, noOfrecido, violacionesAbanico } from '../nucleo/matriz';
import { textoDeTokens, refsDeTokens } from './linea';
import { generarDocumentoOpl } from './documento';

const ap = { x: 0, y: 0, ancho: 140, alto: 70 };
const obj = (id: string, nombre: string): Objeto => ({ id, nombre, tipo: 'objeto', esencia: 'informacional', afiliacion: 'sistemica', estados: [{ id: `${id}-pend`, nombre: 'pendiente' }, { id: `${id}-pag`, nombre: 'pagado' }] });
const pro = (id: string, nombre: string): Cosa => ({ id, nombre, tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica' });
function m(enlaces: readonly Enlace[] = [], extras: Partial<Modelo> = {}): Modelo {
    const cosas = { o: obj('o', 'Pedido'), a: obj('a', 'Cuenta'), p: pro('p', 'Procesar'), q: pro('q', 'Archivar') };
    return congelar({ id: 'opl', nombre: 'Modelo OPL', unidadTiempo: 'min', raiz: 'sd', secuencia: 1000, cosas,
        enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {}, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: Object.fromEntries(Object.keys(cosas).map(id => [id, ap])) } }, ...extras });
}
const nominales: readonly [string, string, EnlaceNuevo, string][] = [
 ['T-110','T1',{tipo:'consumo',objeto:'o',proceso:'p'},'*Procesar* consume **Pedido**.'],
 ['T-110','TS1',{tipo:'consumo',objeto:'o',proceso:'p',estado:'o-pend'},'*Procesar* consume **Pedido** en `pendiente`.'],
 ['T-110','T2',{tipo:'resultado',objeto:'o',proceso:'p'},'*Procesar* genera **Pedido**.'],
 ['T-110','TS2',{tipo:'resultado',objeto:'o',proceso:'p',estado:'o-pag'},'*Procesar* genera **Pedido** en `pagado`.'],
 ['T-110','T3',{tipo:'efecto',objeto:'o',proceso:'p'},'*Procesar* afecta **Pedido**.'],
 ['T-110','TS3',{tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pag'},'*Procesar* cambia **Pedido** de `pendiente` a `pagado`.'],
 ['T-110','TS4',{tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend'},'*Procesar* cambia **Pedido** de `pendiente`.'],
 ['T-110','TS5',{tipo:'efecto',objeto:'o',proceso:'p',salida:'o-pag'},'*Procesar* cambia **Pedido** a `pagado`.'],
 ['T-111','H1',{tipo:'agente',objeto:'o',proceso:'p'},'**Pedido** maneja *Procesar*.'],
 ['T-111','HS1',{tipo:'agente',objeto:'o',proceso:'p',estado:'o-pend'},'**Pedido** en `pendiente` maneja *Procesar*.'],
 ['T-111','H2',{tipo:'instrumento',objeto:'o',proceso:'p'},'*Procesar* requiere **Pedido**.'],
 ['T-111','HS2',{tipo:'instrumento',objeto:'o',proceso:'p',estado:'o-pend'},'*Procesar* requiere **Pedido** en `pendiente`.'],
 ['T-112','ET1',{tipo:'consumo',objeto:'o',proceso:'p',control:'e'},'**Pedido** inicia *Procesar*, que consume **Pedido**.'],
 ['T-112','ETS1',{tipo:'consumo',objeto:'o',proceso:'p',control:'e',estado:'o-pend'},'**Pedido** en `pendiente` inicia *Procesar*, que consume **Pedido**.'],
 ['T-112','ET2',{tipo:'efecto',objeto:'o',proceso:'p',control:'e'},'**Pedido** inicia *Procesar*, que afecta **Pedido**.'],
 ['T-112','ETS2',{tipo:'efecto',objeto:'o',proceso:'p',control:'e',entrada:'o-pend',salida:'o-pag'},'**Pedido** en `pendiente` inicia *Procesar*, que cambia **Pedido** de `pendiente` a `pagado`.'],
 ['T-112','ETS3',{tipo:'efecto',objeto:'o',proceso:'p',control:'e',entrada:'o-pend'},'**Pedido** en `pendiente` inicia *Procesar*, que cambia **Pedido** de `pendiente`.'],
 ['T-112','ETS4',{tipo:'efecto',objeto:'o',proceso:'p',control:'e',salida:'o-pag'},'**Pedido** en cualquier estado inicia *Procesar*, que cambia **Pedido** a `pagado`.'],
 ['T-112','EH1',{tipo:'agente',objeto:'o',proceso:'p',control:'e'},'**Pedido** inicia y maneja *Procesar*.'],
 ['T-112','EHS1',{tipo:'agente',objeto:'o',proceso:'p',control:'e',estado:'o-pend'},'**Pedido** en `pendiente` inicia y maneja *Procesar*.'],
 ['T-112','EH2',{tipo:'instrumento',objeto:'o',proceso:'p',control:'e'},'**Pedido** inicia *Procesar*, que requiere **Pedido**.'],
 ['T-112','EHS2',{tipo:'instrumento',objeto:'o',proceso:'p',control:'e',estado:'o-pend'},'**Pedido** en `pendiente` inicia *Procesar*, que requiere **Pedido** en `pendiente`.'],
 ['T-113','CT1',{tipo:'consumo',objeto:'o',proceso:'p',control:'c'},'*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.'],
 ['T-114','CS1',{tipo:'consumo',objeto:'o',proceso:'p',control:'c',estado:'o-pend'},'*Procesar* ocurre si **Pedido** está en `pendiente`, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.'],
 ['T-112','CT2',{tipo:'efecto',objeto:'o',proceso:'p',control:'c'},'*Procesar* ocurre si **Pedido** existe, en cuyo caso *Procesar* afecta **Pedido**, de lo contrario *Procesar* se omite.'],
 ['T-112','CS2',{tipo:'efecto',objeto:'o',proceso:'p',control:'c',entrada:'o-pend',salida:'o-pag'},'*Procesar* ocurre si **Pedido** está en `pendiente`, en cuyo caso *Procesar* cambia **Pedido** de `pendiente` a `pagado`, de lo contrario *Procesar* se omite.'],
 ['T-112','CS3',{tipo:'efecto',objeto:'o',proceso:'p',control:'c',entrada:'o-pend'},'*Procesar* ocurre si **Pedido** está en `pendiente`, en cuyo caso *Procesar* cambia **Pedido** de `pendiente`, de lo contrario *Procesar* se omite.'],
 ['T-112','CS4',{tipo:'efecto',objeto:'o',proceso:'p',control:'c',salida:'o-pag'},'*Procesar* ocurre si **Pedido** existe, en cuyo caso *Procesar* cambia **Pedido** a `pagado`, de lo contrario *Procesar* se omite.'],
 ['T-112','CH1',{tipo:'agente',objeto:'o',proceso:'p',control:'c'},'**Pedido** maneja *Procesar* si **Pedido** existe, de lo contrario *Procesar* se omite.'],
 ['T-112','CS5',{tipo:'agente',objeto:'o',proceso:'p',control:'c',estado:'o-pend'},'**Pedido** maneja *Procesar* si **Pedido** está en `pendiente`, de lo contrario *Procesar* se omite.'],
 ['T-112','CH2',{tipo:'instrumento',objeto:'o',proceso:'p',control:'c'},'*Procesar* ocurre si **Pedido** existe, de lo contrario *Procesar* se omite.'],
 ['T-112','CS6',{tipo:'instrumento',objeto:'o',proceso:'p',control:'c',estado:'o-pend'},'*Procesar* ocurre si **Pedido** está en `pendiente`, de lo contrario *Procesar* se omite.'],
 ['T-116','IV1',{tipo:'invocacion',origen:'p',destino:'q'},'*Procesar* invoca *Archivar*.'],
 ['T-116','IV2',{tipo:'invocacion',origen:'p',destino:'p'},'*Procesar* se invoca a sí mismo.'],
 ['T-119','SE1',{tipo:'etiquetado',origen:'o',destino:'a',etiqueta:'tiene'},'**Pedido** tiene **Cuenta**.'],
 ['T-119','SE2',{tipo:'etiquetado',origen:'o',destino:'a'},'**Pedido** se relaciona con **Cuenta**.'],
 ['T-121','SSE1',{tipo:'etiquetado',origen:'o',destino:'a',estadoOrigen:'o-pend',etiqueta:'tiene'},'**Pedido** en `pendiente` tiene **Cuenta**.'],
 ['T-121','SSE2',{tipo:'etiquetado',origen:'o',destino:'a',estadoDestino:'a-pag',etiqueta:'tiene'},'**Pedido** tiene **Cuenta** en `pagado`.'],
 ['T-121','SSE3',{tipo:'etiquetado',origen:'o',destino:'a',estadoOrigen:'o-pend',estadoDestino:'a-pag',etiqueta:'tiene'},'**Pedido** en `pendiente` tiene **Cuenta** en `pagado`.'],
 ['T-120','SE4',{tipo:'reciproco',origen:'o',destino:'a',etiqueta:'asociados'},'**Pedido** y **Cuenta** son asociados.'],
 ['T-120','SE5',{tipo:'reciproco',origen:'o',destino:'a'},'**Pedido** y **Cuenta** se relacionan.'],
 ['T-121','SSE6',{tipo:'reciproco',origen:'o',destino:'a',estados:{origen:'o-pend',destino:'a-pag'},etiqueta:'asociados'},'**Pedido** en `pendiente` y **Cuenta** en `pagado` son asociados.'],
 ['T-121','SSE7',{tipo:'reciproco',origen:'o',destino:'a',estados:{origen:'o-pend'},etiqueta:'asociados'},'**Cuenta** y **Pedido** en `pendiente` son asociados.'],
 ['T-138','TS3',{tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pend'},'*Procesar* cambia **Pedido** de `pendiente` a `pendiente`.']
];
for (const [tid, plantilla, enlace, texto] of nominales) test(`${tid} literal ${plantilla} ${texto}`, () => {
    const base=m(), o=base.cosas.o!; const modelo=congelar({...base, cosas:{...base.cosas,o:{...o,esencia:'fisica' as const}}});
    const antes=JSON.stringify(modelo), linea=lineaDeEnlace(modelo,'sd',enlace);
    expect(linea?.texto).toBe(texto); expect(linea?.plantilla).toBe(plantilla);
    expect(JSON.stringify(modelo)).toBe(antes);
});
test('T-106 género D1, ambiental D3 y mención mínima D2 sin defaults redundantes',()=>{
 const base=m(), o=base.cosas.o!;
 const lineas=generarBloque(congelar({...base,cosas:{...base.cosas,o:{...o,esencia:'fisica',genero:'f',afiliacion:'ambiental'}}}),'sd');
 expect(lineas.filter(l=>l.plantilla==='D2').map(l=>l.texto)).toEqual(['*Archivar* es informacional.','*Procesar* es informacional.']);
 expect(lineas.map(l=>l.texto)).toContain('**Pedido** es física.'); expect(lineas.map(l=>l.texto)).toContain('**Pedido** es ambiental.');
 expect(lineas.some(l=>l.plantilla==='D4')).toBe(false);
});
test('T-101 estados ocultos D6 no se nombran y el anclaje visible vence supresión',()=>{
 const base=m([{id:'e',tipo:'consumo',objeto:'o',proceso:'p',estado:'o-pend'}]), o=base.cosas.o!; if(o.tipo!=='objeto')throw Error('montaje');
 const mod=congelar({...base,cosas:{...base.cosas,o:{...o,estados:o.estados.map(s=>({...s,suprimido:true as const}))}}});
 expect(generarBloque(mod,'sd').filter(l=>l.plantilla==='D6').map(l=>l.texto)).toEqual(['**Pedido** puede estar `pendiente`, y otros estados.']);
});
test('T-108 designaciones combinadas, por defecto y Current declarado',()=>{
 const base=m(),o=base.cosas.o!;if(o.tipo!=='objeto')throw Error('montaje');
 const mod=congelar({...base,cosas:{...base.cosas,o:{...o,estados:[{...o.estados[0]!,inicial:true as const,final:true as const},o.estados[1]!],porDefecto:'o-pend',current:'o-pag'}}});
 expect(generarBloque(mod,'sd').filter(l=>['D7','D8','D9','D10','D13'].includes(l.plantilla)).map(l=>l.texto)).toEqual(['Estado `pendiente` de **Pedido** es inicial y final.','Estado `pendiente` de **Pedido** es por defecto.','Estado `pagado` de **Pedido** es declarado `Current`.']);
});
test('T-135 tokens tipados, refs únicas y marcas se serializan en única fuente',()=>{
 const l=lineaDeEnlace(m(),'sd',{tipo:'consumo',objeto:'o',proceso:'p',estado:'o-pend'})!;
 expect(l.texto).toBe('*Procesar* consume **Pedido** en `pendiente`.');
 expect(l.tokens.filter(t=>t.ref).map(t=>[t.texto,t.marca,t.ref])).toEqual([['Procesar','proceso',{tipo:'cosa',id:'p'}],['Pedido','objeto',{tipo:'cosa',id:'o'}],['pendiente','estado',{tipo:'estado',id:'o-pend'}]]);
 expect(l.refs).toEqual([{tipo:'cosa',id:'p'},{tipo:'cosa',id:'o'},{tipo:'estado',id:'o-pend'}]);
});
test('T-139 display y numeración no entran al texto canónico; texto se regenera desde modelo',()=>{
 const mod=m([{id:'e',tipo:'consumo',objeto:'o',proceso:'p'}]), canon=generarModelo(mod);
 expect(textoCanonico(generarModelo(mod,{esencia:'siempre',numeracion:true}))).toBe(textoCanonico(canon));
 expect(generarBloque(mod,'sd',{esencia:'siempre',numeracion:false}).some(l=>l.plantilla==='D2'&&l.soloDisplay)).toBe(true);
});
test('T-123 FAN5A bruto falla cerrado sin ocultar diagnóstico ni inventar TS3',()=>{
 const es:Enlace[]=[{id:'e1',tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pag'},{id:'e2',tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pag',salida:'o-pend'}];
 const mod=m(es,{abanicos:{f:{id:'f',operador:'XOR',enlaces:['e1','e2']}}}), antes=JSON.stringify(mod);
 expect(validarForma(mod).every(v=>v.codigo==='F-5')).toBe(true);
 expect(diagnosticar(mod).some(d=>d.codigo==='abanico-invalido')).toBe(true);
 expect(generarBloque(mod,'sd').filter(l=>l.hechos.some(id=>['e1','e2'].includes(id)))).toEqual([]);
 expect(JSON.stringify(mod)).toBe(antes);
});

const basicos: readonly [Enlace['tipo'],boolean,string,string][] = [
 ['consumo',true,'*Procesar* consume exactamente uno de **Cuenta** o **Pedido**.','*Procesar* consume al menos uno de **Cuenta** o **Pedido**.'],
 ['consumo',false,'Exactamente uno de *Archivar* o *Procesar* consume **Pedido**.','Al menos uno de *Archivar* o *Procesar* consume **Pedido**.'],
 ['resultado',true,'Exactamente uno de *Archivar* o *Procesar* genera **Pedido**.','Al menos uno de *Archivar* o *Procesar* genera **Pedido**.'],
 ['resultado',false,'*Procesar* genera exactamente uno de **Cuenta** o **Pedido**.','*Procesar* genera al menos uno de **Cuenta** o **Pedido**.'],
 ['efecto',true,'*Procesar* afecta exactamente uno de **Cuenta** o **Pedido**.','*Procesar* afecta al menos uno de **Cuenta** o **Pedido**.'],
 ['efecto',false,'**Pedido** es afectado por exactamente uno de *Archivar* o *Procesar*.','**Pedido** es afectado por al menos uno de *Archivar* o *Procesar*.'],
 ['agente',true,'*Procesar* es manejado por exactamente uno de **Cuenta** o **Pedido**.','*Procesar* es manejado por al menos uno de **Cuenta** o **Pedido**.'],
 ['agente',false,'**Pedido** maneja exactamente uno de *Archivar* o *Procesar*.','**Pedido** maneja al menos uno de *Archivar* o *Procesar*.'],
 ['instrumento',true,'*Procesar* requiere exactamente uno de **Cuenta** o **Pedido**.','*Procesar* requiere al menos uno de **Cuenta** o **Pedido**.'],
 ['instrumento',false,'Exactamente uno de *Archivar* o *Procesar* requiere **Pedido**.','Al menos uno de *Archivar* o *Procesar* requiere **Pedido**.'],
 ['invocacion',true,'Exactamente uno de *Archivar* o *Procesar* invoca *Validar*.','Al menos uno de *Archivar* o *Procesar* invoca *Validar*.'],
 ['invocacion',false,'*Validar* invoca exactamente uno de *Archivar* o *Procesar*.','*Validar* invoca al menos uno de *Archivar* o *Procesar*.']
];
for(const [tipo,convergente,xor,or] of basicos)for(const operador of ['XOR','OR'] as const)test(`T-122 abanico ${tipo} ${convergente?'convergente':'divergente'} ${operador} singular y trazable`,()=>{
 const porProceso=tipo==='resultado'?!convergente:convergente;
 const es=tipo==='invocacion'?[{id:'e1',tipo,origen:convergente?'p':'v',destino:convergente?'v':'p'},{id:'e2',tipo,origen:convergente?'q':'v',destino:convergente?'v':'q'}] as Enlace[]:[{id:'e1',tipo,objeto:'o',proceso:'p'},{id:'e2',tipo,objeto:porProceso?'a':'o',proceso:porProceso?'p':'q'}] as Enlace[];
 const base=m();const cosas={...base.cosas,v:pro('v','Validar'),o:{...base.cosas.o!,esencia:'fisica' as const},a:{...base.cosas.a!,esencia:'fisica' as const}};
 const mod=m(es,{cosas,opds:{sd:{id:'sd',tipo:'raiz',apariciones:Object.fromEntries(Object.keys(cosas).map(id=>[id,ap]))}},abanicos:{f:{id:'f',operador,enlaces:['e1','e2']}}});
 expect(validarForma(mod)).toEqual([]);
 const before=JSON.stringify(mod),ls=generarBloque(mod,'sd').filter(l=>l.hechos.includes('e1'));
 expect(ls.map(l=>l.texto)).toEqual([operador==='XOR'?xor:or]);
 expect(ls[0]!.hechos).toEqual(['e1','e2']);expect(new Set(ls[0]!.tokens.filter(t=>t.hecho).map(t=>t.hecho))).toEqual(new Set(['e1','e2']));expect(JSON.stringify(mod)).toBe(before);
});
test('T-129 rutas de ramas desagrupan el abanico sin inventar cuantificador',()=>{
 const mod=m([{id:'e1',tipo:'consumo',objeto:'o',proceso:'p',ruta:'normal'},{id:'e2',tipo:'consumo',objeto:'a',proceso:'p'}],{abanicos:{f:{id:'f',operador:'OR',enlaces:['e1','e2']}}});
 expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['*Procesar* consume **Cuenta**.','Por ruta normal, *Procesar* consume **Pedido**.']);
});
test('T-131 RF2b agrupa con clase del exhibidor primero y sin coma',()=>{
 const mod=m([{id:'e1',tipo:'exhibicion',refinable:'o',refinador:'p'},{id:'e2',tipo:'exhibicion',refinable:'o',refinador:'a'}]);
 const ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(['**Pedido** exhibe **Cuenta** así como *Procesar*.']);expect(ls[0]!.hechos).toEqual(['e2','e1']);
});
test('T-115 excepciones transportan cotas propias y unidad en singular/plural sin default inventado',()=>{
 const base=m();const mod=m([{id:'e1',tipo:'excepcionSobretiempo',origen:'p',destino:'q'},{id:'e2',tipo:'excepcionSubtiempo',origen:'p',destino:'q'}],{cosas:{...base.cosas,p:{...pro('p','Procesar'),tipo:'proceso',duracion:{max:1,min:0.5,unidad:'hour'}}}});
 expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['*Archivar* ocurre si duración de *Procesar* excede 1 hora.','*Archivar* ocurre si duración de *Procesar* es menor que 0.5 horas.']);
 expect(lineaDeEnlace(base,'sd',{tipo:'excepcionSobretiempo',origen:'p',destino:'q'})!.texto).toBe('*Archivar* ocurre si duración de *Procesar* excede su duración máxima.');
});
test('T-128 multiplicidad usa género de objeto cuantificado y no glifos',()=>{
 const base=m();const mod=m([],{cosas:{...base.cosas,o:{...base.cosas.o!,genero:'f'}}});
 expect(lineaDeEnlace(mod,'sd',{tipo:'consumo',objeto:'o',proceso:'p',mult:'?'})!.texto).toBe('*Procesar* consume una opcional **Pedido**.');
 expect(lineaDeEnlace(mod,'sd',{tipo:'consumo',objeto:'o',proceso:'p',mult:'*'})!.texto).toBe('*Procesar* consume opcional (cero o más) **Pedido**.');
 expect(lineaDeEnlace(mod,'sd',{tipo:'resultado',objeto:'o',proceso:'p',mult:'+'})!.texto).toBe('*Procesar* genera al menos una **Pedido**.');
});

test('T-123 FAN5A conserva entrada común y hechos por salida aunque la proyección tenga extremos coincidentes',()=>{
 const mod=m([{id:'e1',tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pend'},{id:'e2',tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pag'}],{abanicos:{f:{id:'f',operador:'XOR',enlaces:['e1','e2']}}});
 expect(validarForma(mod)).toEqual([]);const ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(['*Procesar* cambia **Pedido** de `pendiente` a exactamente uno de `pagado` o `pendiente`.']);expect(ls[0]!.hechos).toEqual(['e2','e1']);
});
test('T-124 controles C18 y CFE y FAN4 son una sola oración',()=>{
 const consumo=m([{id:'e1',tipo:'consumo',objeto:'o',proceso:'p',control:'c'},{id:'e2',tipo:'consumo',objeto:'a',proceso:'p',control:'c'}],{abanicos:{f:{id:'f',operador:'OR',enlaces:['e1','e2']}}});
 expect(generarBloque(consumo,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['*Procesar* ocurre si al menos uno de **Cuenta** o **Pedido** existe, en cuyo caso *Procesar* consume al menos uno de **Cuenta** o **Pedido**, de lo contrario *Procesar* se omite.']);
 for(const control of ['c','e'] as const){const mod=m([{id:'e1',tipo:'efecto',objeto:'o',proceso:'p',control},{id:'e2',tipo:'efecto',objeto:'o',proceso:'q',control}],{abanicos:{f:{id:'f',operador:'XOR',enlaces:['e1','e2']}}});expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual([control==='c'?'Exactamente uno de *Archivar* o *Procesar* ocurre si **Pedido** existe, en cuyo caso afecta **Pedido**, de lo contrario se omite.':'**Pedido** inicia exactamente uno de *Archivar* o *Procesar*, y es afectado por el proceso que ocurre.']);}
});
function hijo(bandas:readonly(readonly string[])[],internos:readonly string[]=['a']):Modelo {
 const base=m(),cosas={...base.cosas,r:pro('r','Validar')};const ids=['p',...bandas.flat(),...internos];return m([],{cosas,opds:{sd:{id:'sd',tipo:'raiz',apariciones:{p:ap,o:ap}},h:{id:'h',tipo:'descomposicion',padre:'sd',cosa:'p',orden:0,bandas,objetosInternos:internos,apariciones:Object.fromEntries(ids.map(id=>[id,ap]))}}});
}
test('T-125 CX secuencia, paralelo, mixto e internos se obtienen de bandas reales',()=>{
 const casos:readonly[readonly(readonly string[])[],string][]=[[[['q'],['r']],'*Procesar* se descompone en *Archivar* y *Validar*, en esa secuencia, así como **Cuenta**.'],[[['r','q']],'*Procesar* se descompone en paralelo *Archivar* y *Validar*, así como **Cuenta**.'],[[['q','r'],['o']],'*Procesar* se descompone en paralelo *Archivar* y *Validar*, y **Pedido**, en esa secuencia, así como **Cuenta**.']];
 // El tercer caso usa tres procesos; un objeto nunca constituye banda.
 const mixto=hijo([['q','r'],['s']]);const modMixto=congelar({...mixto,cosas:{...mixto.cosas,s:pro('s','Cerrar')}});
 for(const [bandas,texto]of casos.slice(0,2)){const mod=hijo(bandas);expect(validarForma(mod)).toEqual([]);expect(generarBloque(mod,'h')[0]!.texto).toBe(texto);}
 expect(validarForma(modMixto)).toEqual([]);expect(generarBloque(modMixto,'h')[0]!.texto).toBe('*Procesar* se descompone en paralelo *Archivar* y *Validar*, y *Cerrar*, en esa secuencia, así como **Cuenta**.');
});
test('T-127 un refinador no fabrica oración CX y bloques usan preorden y contexto padre',()=>{
 const mod=hijo([['q']],[]);expect(generarBloque(mod,'h').some(l=>l.plantilla.startsWith('CX'))).toBe(false);
 expect(generarModelo(mod).filter(l=>l.plantilla==='cabecera').map(l=>l.texto)).toEqual(['## SD','## SD1 · descomposición de *Procesar* · en SD']);
});
test('T-126 despliegue mixto primero clase del refinable sin secuencia ni paralelo',()=>{
 const base=m([{id:'e1',tipo:'exhibicion',refinable:'o',refinador:'a'},{id:'e2',tipo:'exhibicion',refinable:'o',refinador:'p'}]);const mod=congelar({...base,opds:{...base.opds,h:{id:'h',tipo:'despliegue',padre:'sd',cosa:'o',orden:0,modo:'exhibicion',apariciones:{o:ap,a:ap,p:ap}}} as Record<string,Opd>});
 expect(validarForma(mod)).toEqual([]);expect(generarBloque(mod,'h')[0]!.texto).toBe('**Pedido** se despliega en SD1 en **Cuenta**, así como *Procesar*.');
 expect(generarBloque(mod,'h').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['**Pedido** exhibe **Cuenta**.','**Pedido** exhibe *Procesar*.']);
});

test('T-123 salida común de TS3 DEC29 no ofrecida falla cerrado antes de importar',()=>{
 const mod=m([{id:'e1',tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pag'},{id:'e2',tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pag',salida:'o-pag'}],{abanicos:{f:{id:'f',operador:'OR',enlaces:['e1','e2']}}});
 expect(validarForma({ ...mod, abanicos: {} })).toEqual([]);expect(validarForma(mod).map(v=>v.codigo)).toContain('F-5');expect(generarBloque(mod,'sd').filter(l=>l.hechos.length)).toEqual([]);
});
test('T-117 RH1 herencia múltiple sale de RF3, con artículo del general y refs propias',()=>{
 const base=m();const mod=m([{id:'e1',tipo:'generalizacion',refinable:'o',refinador:'b'},{id:'e2',tipo:'generalizacion',refinable:'a',refinador:'b'}],{cosas:{...base.cosas,o:{...base.cosas.o!,genero:'f'},b:obj('b','Factura')},opds:{sd:{id:'sd',tipo:'raiz',apariciones:{o:ap,a:ap,b:ap}}}});
 expect(validarForma(mod)).toEqual([]);const ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(['**Factura** es un **Cuenta** y una **Pedido**.']);expect(ls[0]!.hechos).toEqual(['e2','e1']);
});
test('T-121 RFE agrupa solo por general y estado general con estados propios por especialización',()=>{
 const base=m();const mod=m([{id:'e1',tipo:'generalizacion',refinable:'o',refinador:'a',estados:{general:'o-pend',especializacion:'a-pag'}},{id:'e2',tipo:'generalizacion',refinable:'o',refinador:'b',estados:{general:'o-pend',especializacion:'b-pend'}}],{cosas:{...base.cosas,b:obj('b','Factura')},opds:{sd:{id:'sd',tipo:'raiz',apariciones:{o:ap,a:ap,b:ap}}}});
 expect(validarForma(mod)).toEqual([]);const ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(['**Cuenta** en `pagado` y **Factura** en `pendiente` son **Pedido** en `pendiente`.']);expect(ls[0]!.hechos).toEqual(['e1','e2']);
});
test('T-118 incompleta declarada preserva parte única y no inventa nombre',()=>{
 const base=m();const mod=m([{id:'e1',tipo:'agregacion',refinable:'o',refinador:'a',mult:'+'}],{cosas:{...base.cosas,o:{...base.cosas.o!,incompleta:['agregacion']}}});
 expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['**Pedido** consta de al menos un **Cuenta** y al menos otra parte.']);
});
test('T-120 bidireccionales de etiquetas iguales se normalizan con misma identidad de hecho',()=>{
 const mod=m([{id:'e1',tipo:'etiquetadoBidireccional',origen:'o',destino:'a',etiqueta:'asociados',inversa:'asociados'}]);
 const ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(['**Pedido** y **Cuenta** son asociados.']);expect(ls[0]!.hechos).toEqual(['e1']);expect(mod.enlaces.e1!.tipo).toBe('etiquetadoBidireccional');
});
test('T-120 etiquetado bidireccional simple y con estado emite dos líneas contiguas con IDs estables',()=>{
 for(const estadoOrigen of [undefined,'o-pend']){const mod=m([{id:'e1',tipo:'etiquetadoBidireccional',origen:'o',destino:'a',etiqueta:'tiene',inversa:'pertenece a',...(estadoOrigen?{estadoOrigen}:{})}]);const ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(estadoOrigen?['**Pedido** en `pendiente` tiene **Cuenta**.','**Cuenta** pertenece a **Pedido** en `pendiente`.']:['**Pedido** tiene **Cuenta**.','**Cuenta** pertenece a **Pedido**.']);expect(ls[0]!.id).not.toBe(ls[1]!.id);expect(ls.every(l=>l.hechos.join()==='e1')).toBe(true);}
});

test('T-103 cada oración es una sola línea terminada en punto',()=>{
 const mod=m([{id:'e1',tipo:'consumo',objeto:'o',proceso:'p',control:'e'}]);for(const l of generarBloque(mod,'sd')){expect(l.texto.endsWith('.')).toBe(true);expect(l.texto).not.toContain('\n');}
});
test('T-107 lista de estados conserva orden del modelo y alterna o/u fonéticamente',()=>{
 const base=m();const mod=m([],{cosas:{...base.cosas,o:{...obj('o','Pedido'),tipo:'objeto',estados:[{id:'s1',nombre:'pagado'},{id:'s2',nombre:'ocupado'}]}}});
 expect(generarBloque(mod,'sd').find(l=>l.id==='sd#D5:o')!.texto).toBe('**Pedido** puede estar `pagado` u `ocupado`.');
});
test('T-109 Current es declaración visible del estado y no lectura runtime',()=>{
 const base=m();const c=base.cosas.o!;const mod=m([],{cosas:{...base.cosas,o:{...c,tipo:'objeto',estados:c.tipo==='objeto'?c.estados:[],current:'o-pag'}}});expect(generarBloque(mod,'sd').filter(l=>l.plantilla==='D13').map(l=>l.texto)).toEqual(['Estado `pagado` de **Pedido** es declarado `Current`.']);
});
test('T-130 listas estructurales alternan y/e por nombre sin coma Oxford',()=>{
 const base=m();const mod=m([{id:'e1',tipo:'agregacion',refinable:'o',refinador:'a'},{id:'e2',tipo:'agregacion',refinable:'o',refinador:'b'},{id:'e3',tipo:'agregacion',refinable:'o',refinador:'c'}],{cosas:{...base.cosas,b:obj('b','Factura'),c:obj('c','Informe')},opds:{sd:{id:'sd',tipo:'raiz',apariciones:{o:ap,a:ap,b:ap,c:ap}}}});
 expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['**Pedido** consta de **Cuenta**, **Factura** e **Informe**.']);
});
test('T-132 hijo de refinamiento mantiene oraciones atómicas además de CX',()=>{
 const mod=hijo([['q'],['r']],[]);const es:Record<string,Enlace>={e1:{id:'e1',tipo:'agregacion',refinable:'p',refinador:'q'},e2:{id:'e2',tipo:'agregacion',refinable:'p',refinador:'r'}};const refinado=congelar({...mod,enlaces:es});expect(validarForma(refinado)).toEqual([]);expect(generarBloque(refinado,'h').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['*Procesar* consta de *Archivar*.','*Procesar* consta de *Validar*.']);
});
test('T-133 procedimentales independientes no se comprimen en composición indivisible',()=>{
 const mod=m([{id:'e1',tipo:'consumo',objeto:'o',proceso:'p'},{id:'e2',tipo:'consumo',objeto:'a',proceso:'p'}]);expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['*Procesar* consume **Cuenta**.','*Procesar* consume **Pedido**.']);
});
test('T-134 orden por proceso, fuerza y nombre es determinista con IDs estables',()=>{
 const es:Enlace[]=[{id:'e1',tipo:'resultado',objeto:'o',proceso:'p'},{id:'e2',tipo:'consumo',objeto:'a',proceso:'p'},{id:'e3',tipo:'consumo',objeto:'o',proceso:'q'}];const mod=m(es),reordenado=m([...es].reverse());const out=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(out.map(l=>l.texto)).toEqual(['*Archivar* consume **Pedido**.','*Procesar* consume **Cuenta**.','*Procesar* genera **Pedido**.']);expect(generarBloque(reordenado,'sd').map(l=>l.id)).toEqual(generarBloque(mod,'sd').map(l=>l.id));
});
test('T-136 descripción y geometría son meta y no emiten oraciones',()=>{
 const base=m(),mod=m([],{descripcion:'No emitir esta descripción',cosas:{...base.cosas,p:{...base.cosas.p!,descripcion:'Tampoco esta nota'}},opds:{sd:{id:'sd',tipo:'raiz',apariciones:Object.fromEntries(Object.keys(base.cosas).map(id=>[id,{...ap,x:777,y:333}]))}}});expect(textoCanonico(generarModelo(mod))).toBe(textoCanonico(generarModelo(base)));
});
test('T-137 ninguna aparición sin clasificación fabrica instanciación',()=>{
 const mod=m();expect(generarBloque(mod,'sd').some(l=>l.plantilla==='RF4'||l.plantilla==='RF4b')).toBe(false);
});
test('T-102 tokens no contienen Markdown de nombres y texto conserva tipografías',()=>{
 const l=lineaDeEnlace(m(),'sd',{tipo:'efecto',objeto:'o',proceso:'p',entrada:'o-pend',salida:'o-pag'})!;expect(l.tokens.filter(t=>t.marca).map(t=>[t.texto,t.marca])).toEqual([['Procesar','proceso'],['Pedido','objeto'],['pendiente','estado'],['pagado','estado']]);expect(l.tokens.every(t=>!t.texto.includes('**')&&!t.texto.includes('`'))).toBe(true);
});

test('T-135 plegado usa proyección real y conserva todos los IDs subyacentes',()=>{
 const child=hijo([['q'],['r']],[]),c=child.cosas.o!;const mod=congelar({...child,cosas:{...child.cosas,o:{...c,esencia:'fisica' as const}},opds:{...child.opds,h:{...child.opds.h!,apariciones:{...child.opds.h!.apariciones,o:ap}}},enlaces:{e1:{id:'e1',tipo:'agente',objeto:'o',proceso:'q'},e2:{id:'e2',tipo:'agente',objeto:'o',proceso:'r'}}} as Modelo);
 expect(validarForma(mod)).toEqual([]);const before=JSON.stringify(mod),ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);expect(ls.map(l=>l.texto)).toEqual(['**Pedido** maneja *Procesar*.']);expect(ls[0]!.hechos).toEqual(['e1','e2']);expect(ls[0]!.refs).toEqual([{tipo:'cosa',id:'o'},{tipo:'cosa',id:'p'}]);expect(JSON.stringify(mod)).toBe(before);
});
test('T-101 todos los estados ocultos no fabrica lista vacía ni estado Current',()=>{
 const base=m();const mod=m([],{opds:{sd:{...base.opds.sd!,apariciones:{...base.opds.sd!.apariciones,o:{...ap,ocultos:['o-pend','o-pag']}}}}});const ls=generarBloque(mod,'sd');expect(ls.some(l=>l.id==='sd#D5:o'||l.id==='sd#D6:o')).toBe(false);expect(ls.find(l=>l.id==='sd#D2:o')!.texto).toBe('**Pedido** es informacional.');
});
test('T-124 abanico sin superficie de control no se transforma en dos eventos plausibles',()=>{
 const mod=m([{id:'e1',tipo:'instrumento',objeto:'o',proceso:'p',control:'e'},{id:'e2',tipo:'instrumento',objeto:'a',proceso:'p',control:'e'}],{abanicos:{f:{id:'f',operador:'XOR',enlaces:['e1','e2']}}});
 expect(diagnosticar(mod).some(d=>d.codigo==='abanico-invalido')).toBe(true);expect(generarBloque(mod,'sd').flatMap(l=>l.hechos)).toEqual([]);expect(Object.keys(mod.enlaces)).toEqual(['e1','e2']);
});
test('T-110 contexto recuperable no suprime una superficie nuclear bien formada',()=>{
 const mod=m([{id:'e1',tipo:'agente',objeto:'o',proceso:'p'}]);expect(diagnosticar(mod).some(d=>d.severidad==='error')).toBe(true);expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual(['**Pedido** maneja *Procesar*.']);
});

test('T-102 Current literal también se serializa desde un token sin Markdown',()=>{
 const base=m();const mod=m([],{cosas:{...base.cosas,o:{...obj('o','Pedido'),tipo:'objeto',current:'o-pag'}}});const l=generarBloque(mod,'sd').find(l=>l.plantilla==='D13')!;expect(l.tokens.every(t=>!t.texto.includes('`'))).toBe(true);expect(l.tokens.some(t=>t.texto==='Current'&&t.marca==='estado'&&!t.ref)).toBe(true);expect(l.texto).toBe('Estado `pagado` de **Pedido** es declarado `Current`.');
});
test('T-120 SE3 utiliza claves estables de sus dos hechos de superficie',()=>{
 const mod=m([{id:'e1',tipo:'etiquetadoBidireccional',origen:'o',destino:'a',etiqueta:'tiene',inversa:'pertenece a'}]);expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.id)).toEqual(['sd#SE3a:e1','sd#SE3b:e1']);
});

test('T-122 estados por rama de objeto común DEC29 no se expresan mediante dialecto local',()=>{
 const mod=m([{id:'e1',tipo:'consumo',objeto:'o',proceso:'p',estado:'o-pend'},{id:'e2',tipo:'consumo',objeto:'o',proceso:'q',estado:'o-pag'}],{abanicos:{f:{id:'f',operador:'XOR',enlaces:['e1','e2']}}});
 expect(validarForma({ ...mod, abanicos: {} })).toEqual([]);expect(validarForma(mod).map(v=>v.codigo)).toContain('F-5');expect(generarBloque(mod,'sd').filter(l=>l.hechos.length)).toEqual([]);
});

test('T-135 etiqueta y ruta conservan token a hecho y referencia persistente del enlace',()=>{
 const mod=m([{id:'e1',tipo:'etiquetado',origen:'o',destino:'a',etiqueta:'tiene'},{id:'e2',tipo:'consumo',objeto:'o',proceso:'p',ruta:'normal'}]);const ls=generarBloque(mod,'sd');const tag=ls.find(l=>l.hechos.includes('e1'))!.tokens.find(t=>t.texto==='tiene')!,ruta=ls.find(l=>l.hechos.includes('e2'))!.tokens.find(t=>t.texto==='normal')!;expect(tag.hecho).toBe('e1');expect(tag.ref).toEqual({tipo:'enlace',id:'e1'});expect(ruta.hecho).toBe('e2');expect(ruta.ref).toEqual({tipo:'enlace',id:'e2'});
});

for(const [campo,texto] of [['entrada','*Procesar* cambia **Pedido** de al menos uno de `pagado` o `pendiente`.'],['salida','*Procesar* cambia **Pedido** a al menos uno de `pagado` o `pendiente`.']] as const)test(`T-123 abanico unilateral ${campo} conserva estados y operador OR`,()=>{
 const mod=m([{id:'e1',tipo:'efecto',objeto:'o',proceso:'p',[campo]:'o-pend'},{id:'e2',tipo:'efecto',objeto:'o',proceso:'p',[campo]:'o-pag'}],{abanicos:{f:{id:'f',operador:'OR',enlaces:['e1','e2']}}});expect(validarForma(mod)).toEqual([]);expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual([texto]);
});
const unidadesLiterales:readonly[Modelo['unidadTiempo'],string,string][]=[['ms','milisegundo','milisegundos'],['sec','segundo','segundos'],['min','minuto','minutos'],['hour','hora','horas'],['day','día','días'],['week','semana','semanas'],['month','mes','meses'],['year','año','años']];
for(const [unidad,singular,plural] of unidadesLiterales)test(`T-115 unidad ${unidad} del modelo en singular y plural es-CL`,()=>{
 for(const [n,palabra] of [[1,singular],[2,plural]] as const){const base=m(),mod=m([],{unidadTiempo:unidad,cosas:{...base.cosas,p:{...pro('p','Procesar'),tipo:'proceso',duracion:{max:n}}}});expect(lineaDeEnlace(mod,'sd',{tipo:'excepcionSobretiempo',origen:'p',destino:'q'})!.texto).toBe(`*Archivar* ocurre si duración de *Procesar* excede ${n} ${palabra}.`);}
});
test('T-106 valor de atributo usa el exhibidor visible primero por nombre',()=>{
 const base=m();const mod=m([{id:'e1',tipo:'exhibicion',refinable:'a',refinador:'o'},{id:'e2',tipo:'exhibicion',refinable:'q',refinador:'o'}],{cosas:{...base.cosas,o:{...obj('o','Pedido'),tipo:'objeto',valor:'uno'}}});expect(validarForma(mod)).toEqual([]);expect(generarBloque(mod,'sd').filter(l=>l.plantilla==='VAL').map(l=>l.texto)).toEqual(['**Pedido** de *Archivar* es uno.']);
});

test('T-127 un refinador con dos especializaciones de estado no fabrica CX3',()=>{
 const ap={x:0,y:0,ancho:140,alto:70};
 const m:Modelo={id:'test',nombre:'Prueba única',unidadTiempo:'min',raiz:'sd',secuencia:100,cosas:{o:{id:'o',nombre:'Pedido',tipo:'objeto',esencia:'informacional',afiliacion:'sistemica',estados:[{id:'a',nombre:'pendiente'},{id:'b',nombre:'pagado'}]},c:{id:'c',nombre:'Factura',tipo:'objeto',esencia:'informacional',afiliacion:'sistemica',estados:[{id:'c-a',nombre:'pendiente'},{id:'c-b',nombre:'pagado'}]}},enlaces:{e1:{id:'e1',tipo:'generalizacion',refinable:'o',refinador:'c',estados:{general:'a',especializacion:'c-a'}},e2:{id:'e2',tipo:'generalizacion',refinable:'o',refinador:'c',estados:{general:'b',especializacion:'c-b'}}},abanicos:{},opds:{sd:{id:'sd',tipo:'raiz',apariciones:{o:ap,c:ap}},h:{id:'h',tipo:'despliegue',padre:'sd',cosa:'o',orden:0,modo:'generalizacion',apariciones:{o:ap,c:ap}}}};
 expect(validarForma(m)).toEqual([]);expect(generarBloque(m,'h').filter(l=>l.plantilla==='CX3')).toEqual([]);
});

const estructuralesPendientes:readonly[Enlace['tipo'],boolean,string,string][]=[
 ['generalizacion',true,'**Cuenta** y **Factura** son **Pedido**.','*Archivar* y *Validar* son *Procesar*.'],
 ['generalizacion',false,'**Cuenta** es una **Pedido**.','*Archivar* es un *Procesar*.'],
 ['clasificacion',true,'**Cuenta** y **Factura** son instancias de **Pedido**.','*Archivar* y *Validar* son instancias de *Procesar*.'],
 ['clasificacion',false,'**Cuenta** es una instancia de **Pedido**.','*Archivar* es una instancia de *Procesar*.']
];
for(const [tipo,plural,objetos,procesos]of estructuralesPendientes)for(const clase of ['objeto','proceso'] as const)test(`T-117 literal ${tipo} ${plural?'plural':'singular'} de ${clase}`,()=>{
 const base=m(),cosas={...base.cosas,o:{...base.cosas.o!,genero:'f' as const},b:obj('b','Factura'),r:pro('r','Validar')};const refinable=clase==='objeto'?'o':'p',destinos=clase==='objeto'?['a','b']:['q','r'];
 const es=destinos.slice(0,plural?2:1).map((refinador,i)=>({id:`e${i+1}`,tipo,refinable,refinador} as Enlace));const mod=m(es,{cosas,opds:{sd:{id:'sd',tipo:'raiz',apariciones:Object.fromEntries(Object.keys(cosas).map(id=>[id,ap]))}}});expect(validarForma(mod)).toEqual([]);expect(generarBloque(mod,'sd').filter(l=>l.hechos.length).map(l=>l.texto)).toEqual([clase==='objeto'?objetos:procesos]);
});

test('T-118 exhibición mixta incompleta mantiene ambos rasgos tipados, hechos, refs y cola',()=>{
 const base=m(),mod=m([{id:'e1',tipo:'exhibicion',refinable:'o',refinador:'a'},{id:'e2',tipo:'exhibicion',refinable:'o',refinador:'p'}],{cosas:{...base.cosas,o:{...base.cosas.o!,incompleta:['exhibicion']}}});
 expect(validarForma(mod)).toEqual([]);for(const e of Object.values(mod.enlaces))expect(violacionesContexto(mod,e)).toEqual([]);
 const before=JSON.stringify(mod),ls=generarBloque(mod,'sd').filter(l=>l.hechos.length);
 expect(ls.map(l=>l.texto)).toEqual(['**Pedido** exhibe **Cuenta** así como *Procesar* y al menos otro rasgo.']);
 expect(ls[0]!.hechos).toEqual(['e1','e2']);expect(ls[0]!.refs).toEqual([{tipo:'cosa',id:'o'},{tipo:'cosa',id:'a'},{tipo:'cosa',id:'p'}]);
 expect(ls[0]!.tokens.filter(t=>t.marca).map(t=>[t.texto,t.marca,t.ref,t.hecho])).toEqual([['Pedido','objeto',{tipo:'cosa',id:'o'},'e1'],['Cuenta','objeto',{tipo:'cosa',id:'a'},'e1'],['Procesar','proceso',{tipo:'cosa',id:'p'},'e2']]);
 expect(JSON.stringify(mod)).toBe(before);
});

// DEC 29: estado común no ofrecido; los positivos canónicos sin estado siguen.
for(const [op,q] of [['XOR','exactamente uno de'],['OR','al menos uno de']] as const)
 for(const permutado of [false,true])test(`T-122 agente común en borde ${op} ${permutado?'permutado':'original'}`,()=>{
  const base=m(),mod=m([{id:'e1',tipo:'agente',objeto:'o',proceso:'p'},{id:'e2',tipo:'agente',objeto:'o',proceso:'q'}],{cosas:{...base.cosas,o:{...obj('o','Operador'),esencia:'fisica'}},abanicos:{f:{id:'f',operador:op,enlaces:permutado?['e2','e1']:['e1','e2']}}});
  expect(validarForma(mod)).toEqual([]);for(const e of Object.values(mod.enlaces)){expect(noOfrecido(mod,e,mod.abanicos.f)).toBeNull();expect(violacionesContexto(mod,e)).toEqual([]);}
  const before=JSON.stringify(mod),ls=generarBloque(mod,'sd').filter(l=>l.hechos.length),l=ls[0]!;
  expect(ls).toHaveLength(1);expect(l.texto).toBe(`**Operador** maneja ${q} *Archivar* o *Procesar*.`);
  expect(l.id).toBe(`sd#FAN-agente-divergente-${op}:FAN:f`);expect(l.hechos).toEqual(permutado?['e2','e1']:['e1','e2']);
  expect(l.tokens.filter(t=>t.marca==='estado')).toEqual([]);expect(textoDeTokens(l.tokens)).toBe(l.texto);expect(l.refs).toEqual(refsDeTokens(l.tokens));expect(JSON.stringify(mod)).toBe(before);
 });


// PASO4 S2: las cotas pertenecen al hecho nuclear, aunque su fuente se vea abstraída.
test('T-115 EX abstraída conserva dos cotas originales distintas, unidades, dirección y procedencia', () => {
    const base = m();
    const modelo = m([
        { id: 'ex1', tipo: 'excepcionSobretiempo', origen: 'r', destino: 'q' },
        { id: 'ex2', tipo: 'excepcionSubtiempo', origen: 't', destino: 'q' },
    ], {
        cosas: { ...base.cosas,
            p: { ...pro('p', 'Procesar'), tipo: 'proceso', duracion: { max: 60, min: 30, unidad: 'min' } },
            q: { ...pro('q', 'Archivar'), afiliacion: 'ambiental' },
            r: { ...pro('r', 'Preparar'), tipo: 'proceso', duracion: { max: 5, unidad: 'min' } },
            t: { ...pro('t', 'Validar'), tipo: 'proceso', duracion: { min: 2, unidad: 'hour' } },
        },
        opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { p: ap, q: ap } },
            h: { id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['r'], ['t']], objetosInternos: [], apariciones: { p: ap, q: ap, r: ap, t: ap } } },
    });
    expect(validarForma(modelo)).toEqual([]);
    for (const e of Object.values(modelo.enlaces)) expect(violacionesContexto(modelo, e)).toEqual([]);
    const antes = JSON.stringify(modelo), lineas = generarBloque(modelo, 'sd').filter(l => l.hechos.length);
    expect(lineas.map(l => l.texto)).toEqual([
        '*Archivar* ocurre si duración de *Procesar* excede 5 minutos.',
        '*Archivar* ocurre si duración de *Procesar* es menor que 2 horas.',
    ]);
    expect(lineas.map(l => l.hechos)).toEqual([['ex1'], ['ex2']]);
    for (const l of lineas) {
        expect(l.refs).toEqual([{ tipo: 'cosa', id: 'q' }, { tipo: 'cosa', id: 'p' }]);
        expect(l.tokens.filter(t => t.marca === 'proceso').map(t => t.hecho)).toEqual([l.hechos[0], l.hechos[0]]);
    }
    expect(JSON.stringify(modelo)).toBe(antes);
});

test('T-118 colección incompleta en hijo conserva la parte revelada y cola sin inventar refinadores', () => {
    const base = m();
    const modelo = m([{ id: 'parte-a', tipo: 'agregacion', refinable: 'o', refinador: 'a' }, { id: 'parte-b', tipo: 'agregacion', refinable: 'o', refinador: 'b' }], {
        cosas: { ...base.cosas, b: obj('b', 'Saldo') },
        opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { o: ap, a: ap, b: ap } },
            h: { id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'o', modo: 'agregacion', orden: 0, apariciones: { o: ap, a: ap } } },
    });
    expect(validarForma(modelo)).toEqual([]);
    const antes = JSON.stringify(modelo), lineas = generarBloque(modelo, 'h').filter(l => l.hechos.length);
    expect(lineas.map(l => l.texto)).toEqual(['**Pedido** consta de **Cuenta** y al menos otra parte.']);
    expect(lineas.map(l => l.hechos)).toEqual([['parte-a']]);
    expect(lineas[0]!.refs).toEqual([{ tipo: 'cosa', id: 'o' }, { tipo: 'cosa', id: 'a' }]);
    expect(JSON.stringify(modelo)).toBe(antes);
});

for(const operador of ['XOR','OR'] as const)for(const reverso of [false,true])test(`T-057 multiplicidades distintas por rama común P ${operador} permutación ${reverso}`,()=>{
 const enlaces:Enlace[]=[{id:'e1',tipo:'consumo',objeto:'o',proceso:'p',mult:'+'},{id:'e2',tipo:'consumo',objeto:'a',proceso:'p',mult:'?'}],b=m(enlaces),modelo=m(enlaces,{abanicos:{f:{id:'f',operador,enlaces:reverso?['e2','e1']:['e1','e2']}}});
 expect(validarForma(modelo)).toEqual([]);for(const e of enlaces){expect(noOfrecido(modelo,e,modelo.abanicos.f)).toBeNull();expect(violacionesContexto(modelo,e)).toEqual([]);}const antes=JSON.stringify(modelo),l=generarBloque(modelo,'sd').find(l=>l.hechos.length===2)!;
 expect(new Set(l.hechos)).toEqual(new Set(['e1','e2']));expect(l.texto).toContain('al menos un **Pedido**');expect(l.texto).toContain('un opcional **Cuenta**');expect(l.texto).toContain(operador==='XOR'?'exactamente uno de':'al menos uno de');expect(l.refs.map(r=>r.id)).toEqual(expect.arrayContaining(['p','o','a']));expect(JSON.stringify(modelo)).toBe(antes);
});
