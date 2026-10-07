import { test, expect } from 'bun:test';
import type { Enlace, Modelo, TipoEnlace, Control, Multiplicidad } from '../nucleo/tipos';
import { modeloCon } from '../pruebas/constructores';
import { validarForma } from '../nucleo/forma';
import { erroresContexto, noOfrecido, MATRIZ, violacionesForma } from '../nucleo/matriz';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { PLANTILLAS } from './plantillas';
import { generarModelo } from './generar';

let tiempoEnumeracion = 0;
const importsStrictExactos = new Set<string>();
let modelosVerificados = 0;
const perfilCoste = {generar:0,planificar:0,importar:0,regenerar:0};
const libro:{familia:string;admitido:boolean;[campo:string]:unknown}[]=[];const documentos=new Map<string,{nombre:string;texto:string;origenes:string[];estricto:boolean}>();let llamadasStrict=0,hitsStrict=0;
const pendientesStrict:{nombre:string;id:string;doc:string;clave:string}[]=[];
// Retención de prueba: sólo hasta la última comparación del argumento exacto.
function retencionStrict(claves:readonly string[]){
 const restantes=new Map<string,number>(),resultados=new Map<string,ReturnType<typeof importarOpl>>(),snapshots=new Map<string,string>();
 for(const clave of claves)restantes.set(clave,(restantes.get(clave)??0)+1);
 return {
  resultados,snapshots,
  guardar(clave:string,r:ReturnType<typeof importarOpl>){if(restantes.get(clave)!>1){resultados.set(clave,r);snapshots.set(clave,JSON.stringify(r));}},
  comparado(clave:string){const n=restantes.get(clave)!-1;restantes.set(clave,n);if(n===0){resultados.delete(clave);snapshots.delete(clave);}}
 };
}
const plantillasCanonicas=new Set(PLANTILLAS.map(p=>p.id));
function verificar(m: Modelo, id: string, estricto = true) {
    modelosVerificados++;
    let tic=performance.now(); const doc = generarDocumentoOpl(m);perfilCoste.generar+=performance.now()-tic;
    const claveDocumento=JSON.stringify([m.nombre,doc]);const entrada=documentos.get(claveDocumento)??{nombre:m.nombre,texto:doc,origenes:[],estricto};entrada.origenes.push(id);documentos.set(claveDocumento,entrada);
    tic=performance.now(); const p = planificar(m, 'modelo', doc);perfilCoste.planificar+=performance.now()-tic;
    expect({ id, errores: p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error')) }).toEqual({ id, errores: [] });
    expect({ id, acciones: p.acciones }).toEqual({ id, acciones: [] });
    expect(generarModelo(m).every(l => l.soloDisplay || plantillasCanonicas.has(l.plantilla))).toBe(true);
    if(estricto)pendientesStrict.push({nombre:m.nombre,id,doc,clave:claveDocumento});
}

test('T-191 T-192 T-190 todas dimensiones legales de 15 firmas: auto-reparseo y estricto sin cuota', () => {
    const fallos: string[] = [];
    const inicio = performance.now(), propuestos: Record<string, number> = {}, admitidos: Record<string, number> = {}, excluidos: Record<string, number> = {};
    const b = modeloCon({ objetos: [['Alfa', ['uno', 'dos', 'tres']], ['Ilustre', ['uno', 'dos', 'tres']]], procesos: ['Beta', 'Omega'] });
    const O = Object.values(b.cosas).filter(c => c.tipo === 'objeto'), P = Object.values(b.cosas).filter(c => c.tipo === 'proceso');
    for (const tipo of Object.keys(MATRIZ) as TipoEnlace[]) {
        const estructural = ['agregacion','exhibicion','generalizacion','clasificacion'].includes(tipo), textual = ['etiquetado','etiquetadoBidireccional','reciproco'].includes(tipo), procedimental = ['consumo','resultado','efecto','agente','instrumento'].includes(tipo);
        const pares = procedimental ? [[O[0]!.id, P[0]!.id]] : estructural || textual ? [[O[0]!.id,O[1]!.id], [P[0]!.id,P[1]!.id]] : [[P[0]!.id,P[1]!.id]];
        if (tipo === 'exhibicion') pares.push([O[0]!.id,P[0]!.id],[P[0]!.id,O[0]!.id]);
        if (tipo === 'invocacion' || tipo === 'etiquetado' || tipo === 'reciproco') pares.push([P[0]!.id,P[0]!.id]);
        for (const [a, z] of pares) for (const femenino of [false,true]) for (const esencia of ['fisica','informacional'] as const) for (const afiliacion of ['sistemica','ambiental'] as const) {
            const cs = Object.fromEntries(Object.entries(b.cosas).map(([id,c]) => [id, { ...c, esencia, afiliacion, ...(femenino ? { genero:'f' as const } : {}) }]));
            const origen=cs[a!]!,destino=cs[z!]!;const so = origen.tipo === 'objeto' ? origen.estados : [], sz = destino.tipo === 'objeto' ? destino.estados : [];
            const estados = tipo === 'efecto' ? [{},{ entrada:so[0]?.id },{ salida:so[1]?.id },{ entrada:so[0]?.id,salida:so[1]?.id },{ entrada:so[0]?.id,salida:so[0]?.id }] : procedimental ? [{},{ estado:so[0]?.id }] : tipo === 'generalizacion' && so.length && sz.length ? [{},{ estados:{general:so[0]!.id,especializacion:sz[0]!.id}}] : textual && so.length ? tipo === 'reciproco' ? [{},{estados:{origen:so[0]!.id}},{estados:{origen:so[0]!.id,destino:sz[0]!.id}}] : tipo === 'etiquetadoBidireccional' ? [{},{estadoOrigen:so[0]!.id}] : [{},{estadoOrigen:so[0]!.id},{estadoDestino:sz[0]!.id},{estadoOrigen:so[0]!.id,estadoDestino:sz[0]!.id}] : [{}];
            for (const s of estados) for (const control of procedimental && tipo !== 'resultado' ? [undefined,'e','c'] as (Control|undefined)[] : [undefined]) for (const mult of MATRIZ[tipo].mult !== 'ninguno' ? [undefined,'?','*','+'] as (Multiplicidad|undefined)[] : [undefined]) for (const multDestino of textual ? [undefined,'?','*','+'] as (Multiplicidad|undefined)[] : [undefined]) for (const ruta of tipo === 'consumo' || tipo === 'resultado' ? [undefined,'Uno'] : [undefined]) for (const etiqueta of textual ? tipo === 'etiquetadoBidireccional' ? ['conoce'] : [undefined,'conoce'] : [undefined]) {
                const campos = procedimental ? {objeto:a,proceso:z} : estructural ? {refinable:a,refinador:z} : {origen:a,destino:z};
                const e = { id:'e-prueba',tipo,...campos,...s,...(control?{control}:{}),...(mult? textual?{multOrigen:mult}:{mult}:{}),...(multDestino?{multDestino}:{}),...(ruta?{ruta}:{}),...(etiqueta?{etiqueta}:{}),...(tipo==='etiquetadoBidireccional'?{inversa:'es-conocido'}:{}) } as Enlace;
                const m:Modelo={...b,cosas:cs,enlaces:{[e.id]:e}}; propuestos[tipo]=(propuestos[tipo]??0)+1;
                const form=validarForma(m), contexto=form.length?[]:erroresContexto(m), no=form.length?null:noOfrecido(m,e);
                const razones=[...form.map(v=>v.regla),...contexto.map(v=>v.regla),...(no?[no.regla]:[])];
                libro.push({familia:'atómico',tipo,extremos:[a,z],estado:s,control,mult,multDestino,ruta,etiqueta,femenino,esencia,afiliacion,forma:form.map(v=>v.regla),contexto:contexto.map(v=>v.regla),noOfrecido:no?{regla:no.regla,registro:no.registro}:null,admitido:!razones.length});
                if(razones.length){for(const r of new Set(razones))excluidos[r]=(excluidos[r]??0)+1;continue;}
                admitidos[tipo]=(admitidos[tipo]??0)+1; try { verificar(m, `${tipo}:${propuestos[tipo]}:${femenino}:${esencia}:${afiliacion}`); } catch(error) { fallos.push(`${tipo}:${estable(e)}:${femenino}:${esencia}:${afiliacion}: ${String(error)}`); }
            }
        }
    }
    console.log('WP9 matriz',JSON.stringify({propuestos,admitidos,excluidos,ms:performance.now()-inicio}));
    console.log('WP9 fallos',JSON.stringify(fallos));
    expect(fallos).toEqual([]);
    expect(Object.keys(admitidos).sort()).toEqual((Object.keys(MATRIZ) as string[]).sort());
    tiempoEnumeracion += performance.now()-inicio;
}, 30000);
const estable = (x:unknown)=>JSON.stringify(x);

for (const tipo of ['consumo','resultado','efecto','agente','instrumento','invocacion'] as const) for (const operador of ['XOR','OR'] as const) for (const comun of ['objeto','proceso'] as const) for(const n of [2,3,4]) test(`T-192 abanicos ${tipo} ${operador} común ${comun} ${n} miembros dimensiones`,()=>{
 const inicio = performance.now();
 const objetos=Array.from({length:comun==='proceso'?n:1},(_,i)=>[`Objeto_${i}`,['uno','dos']] as const),procesos=Array.from({length:comun==='objeto'||tipo==='invocacion'?n+1:1},(_,i)=>`Proceso_${i}`);
 const b=modeloCon({objetos,procesos}),os=Object.values(b.cosas).filter(c=>c.tipo==='objeto'),ps=Object.values(b.cosas).filter(c=>c.tipo==='proceso');
 let admitidos=0,excluidos=0;
 for(const estado of tipo==='invocacion'||comun==='objeto'?[false]:[false,true]) for(const control of tipo==='resultado'||tipo==='invocacion'?[undefined]:[undefined,'e','c'] as const) for(const mult of tipo==='invocacion'?[undefined]:[undefined,'?','*','+'] as const) {
  const enlaces=Object.fromEntries(Array.from({length:n},(_,i)=>{
   const id=`e-${i}`,o=comun==='proceso'?os[i]!:os[0]!,p=comun==='objeto'?ps[i]!:ps[0]!;
   const e=tipo==='invocacion'?{id,tipo,origen:comun==='objeto'?ps[0]!.id:ps[i+1]!.id,destino:comun==='objeto'?ps[i+1]!.id:ps[0]!.id}:{id,tipo,objeto:o.id,proceso:p.id,...(estado?tipo==='efecto'?{entrada:o.estados[0]!.id,salida:o.estados[1]!.id}:{estado:o.estados[i%2]!.id}:{}),...(control?{control}:{}),...(mult?{mult}:{})};return[id,e as Enlace];
  }));
  const f={id:'fan',operador,enlaces:Object.keys(enlaces)},m:Modelo={...b,enlaces,abanicos:{fan:f}};
  const vs=validarForma(m),ctx=vs.length?[]:erroresContexto(m),nf=vs.length?[]:Object.values(enlaces).flatMap(e=>{const x=noOfrecido(m,e,f);return x?[{regla:x.regla,registro:x.registro}]:[]});
  libro.push({familia:'fan',tipo,operador,comun,n,estado,control,mult,forma:vs.map(v=>v.regla),contexto:ctx.map(v=>v.regla),noOfrecido:nf,admitido:!vs.length&&!ctx.length&&!nf.length});if(vs.length||ctx.length||nf.length){excluidos++;continue;}
  admitidos++;verificar(m,`fan:${tipo}:${operador}:${comun}:${n}:${estado}:${control}:${mult}`);
 }
 tiempoEnumeracion += performance.now()-inicio;
 expect(admitidos).toBeGreaterThan(0);console.log('WP9 fan',tipo,operador,comun,n,{admitidos,excluidos});
});

import { aplicarAcciones } from '../nucleo/operaciones';
import { must } from '../pruebas/constructores';
for(const bandas of [[['Recibir'],['Validar']], [['Recibir','Validar']], [['Recibir','Validar'],['Archivar']], [['Recibir'],['Validar','Archivar']], [['Recibir','Validar'],['Archivar'],['Enviar','Cobrar']]]) for(const internos of [false,true]) test(`T-192 T-166 CX bandas ${JSON.stringify(bandas)} internos ${internos}`,()=>{
 const inicio = performance.now();
 const b=modeloCon({procesos:['Gestionar']}),p=Object.keys(b.cosas)[0]!;
 const r=must(aplicarAcciones(b,[{op:'descomponer',args:{opd:b.raiz,proceso:p,bandas}}])),d=Object.values(r.modelo.opds).find(d=>d.tipo==='descomposicion')!;
 const m=internos?must(aplicarAcciones(r.modelo,[{op:'crearCosa',args:{opd:d.id,tipo:'objeto',nombre:'Registro',x:50,y:60,alcance:'interno'}}])).modelo:r.modelo;
 expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);verificar(m,`CX:${JSON.stringify(bandas)}:${internos}`);libro.push({familia:'CX',bandas,internos,admitido:true}); tiempoEnumeracion += performance.now()-inicio;
});
for(const modo of ['agregacion','exhibicion','generalizacion','clasificacion'] as const) for(const tipo of ['objeto','proceso'] as const) test(`T-192 T-166 CX3 modo ${modo} ${tipo}`,()=>{
 const inicio = performance.now();
 const b=modeloCon(tipo==='objeto'?{objetos:[['Colección',[]]]}:{procesos:['Coleccionar']}),id=Object.keys(b.cosas)[0]!;
 const m=must(aplicarAcciones(b,[{op:'desplegar',args:{opd:b.raiz,cosa:id,modo,refinadores:['Alfa','Ilustre']}}])).modelo;
 expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);verificar(m,`CX3:${modo}:${tipo}`);libro.push({familia:'CX3',modo,tipo,admitido:true}); tiempoEnumeracion += performance.now()-inicio;
});


for(const variante of ['s','e','A'] as const)for(const operador of ['XOR','OR'] as const)for(const n of [2,3,4])test(`T-192 FAN5${variante} ${operador} ${n} mismo O/P estados no comunes`,()=>{
 const inicio=performance.now(),b=modeloCon({objetos:[['Pedido',['entrada','salida_1','salida_2','salida_3','salida_4']]],procesos:['Validar']}),[o,p]=Object.values(b.cosas);if(o?.tipo!=='objeto')throw Error('fixture');
 const enlaces=Object.fromEntries(Array.from({length:n},(_,i)=>{const id=`e-${i}`;return[id,{id,tipo:'efecto',objeto:o.id,proceso:p!.id,...(variante==='e'?{entrada:o.estados[i+1]!.id}:variante==='A'?{entrada:o.estados[0]!.id,salida:o.estados[i+1]!.id}:{salida:o.estados[i+1]!.id})} as Enlace]}));
 const f={id:'f',operador,enlaces:Object.keys(enlaces)},m:Modelo={...b,enlaces,abanicos:{f}};expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);expect(Object.values(enlaces).map(e=>noOfrecido(m,e,f))).toEqual(Array(n).fill(null));verificar(m,`FAN5:${variante}:${operador}:${n}`);libro.push({familia:'FAN5',variante,operador,n,admitido:true});tiempoEnumeracion+=performance.now()-inicio;
});
for(const tipo of ['consumo','resultado','agente','instrumento'] as const)for(const operador of ['XOR','OR'] as const)for(const patron of ['estados-parciales','mult-heterogenea','mult-parcial','ruta-una'] as const)test(`T-192 fan común P ${tipo} ${operador} ${patron}`,()=>{
 const inicio=performance.now(),b=modeloCon({objetos:[['Pedido',['nuevo','listo']],['Registro',['nuevo','listo']],['Cuenta',['nuevo','listo']]],procesos:['Validar']}),os=Object.values(b.cosas).filter(c=>c.tipo==='objeto'),p=Object.values(b.cosas).find(c=>c.tipo==='proceso')!;
 const enlaces=Object.fromEntries(os.map((o,i)=>{const id=`e-${i}`;return[id,{id,tipo,objeto:o.id,proceso:p.id,...(patron==='estados-parciales'&&i!==1?{estado:o.estados[i%2]!.id}:{}),...(patron==='mult-heterogenea'?{mult:['?','*','+'][i] as Multiplicidad}:patron==='mult-parcial'&&i!==1?{mult:'?' as const}:{}),...(patron==='ruta-una'&&i===1?{ruta:'Uno'}:{})} as Enlace]}));
 const f={id:'f',operador,enlaces:Object.keys(enlaces)},m:Modelo={...b,enlaces,abanicos:{f}},form=[...validarForma(m),...Object.values(enlaces).flatMap(e=>violacionesForma(m,e))],ctx=form.length?[]:erroresContexto(m),nf=form.length?[]:Object.values(enlaces).flatMap(e=>{const v=noOfrecido(m,e,f);return v?[{regla:v.regla,registro:v.registro}]:[]});libro.push({familia:'fan-por-rama',tipo,operador,patron,forma:form.map(v=>v.regla),contexto:ctx.map(v=>v.regla),noOfrecido:nf,admitido:!form.length&&!ctx.length&&!nf.length});
 if(patron==='ruta-una'&&tipo!=='consumo'&&tipo!=='resultado'){expect(form.length).toBeGreaterThan(0);}else{expect(form).toEqual([]);expect(ctx).toEqual([]);expect(nf).toEqual([]);verificar(m,`fan:${tipo}:${operador}:${patron}`,patron!=='ruta-una');if(patron==='ruta-una'){const r=importarOpl(m.nombre,generarDocumentoOpl(m));expect(r.ok).toBe(true);if(r.ok){expect(Object.values(r.valor.modelo.abanicos)).toEqual([]);expect(Object.values(r.valor.modelo.enlaces).filter(e=>'ruta' in e&&e.ruta==='Uno')).toHaveLength(1);}}}
 tiempoEnumeracion+=performance.now()-inicio;
});

test('T-192 géneros esencia afiliación mixtos por extremos no se heredan de la primera cosa',()=>{
 const inicio=performance.now();
 for(const tipo of ['etiquetado','agregacion','consumo','instrumento'] as const)for(const inverso of [false,true]){
  const b=modeloCon(tipo==='consumo'||tipo==='instrumento'?{objetos:[['Alfa',[]]],procesos:['Beta']}:{objetos:[['Alfa',[]],['Beta',[]]]}),[a,z]=Object.values(b.cosas),cs={...b.cosas,[a!.id]:{...a!,esencia:inverso?'informacional' as const:'fisica' as const,afiliacion:'ambiental' as const,genero:'f' as const},[z!.id]:{...z!,esencia:inverso?'fisica' as const:'informacional' as const,afiliacion:'sistemica' as const}};
  const e=(tipo==='consumo'||tipo==='instrumento'?{id:'e',tipo,objeto:a!.id,proceso:z!.id,mult:'+'}:tipo==='agregacion'?{id:'e',tipo,refinable:a!.id,refinador:z!.id,mult:'?'}:{id:'e',tipo,origen:a!.id,destino:z!.id,etiqueta:'conoce',multOrigen:'+',multDestino:'?'}) as Enlace,m:Modelo={...b,cosas:cs,enlaces:{e}};
  expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);expect(noOfrecido(m,e)).toBeNull();verificar(m,`extremos-mixtos:${tipo}:${inverso}`);libro.push({familia:'atributos-mixtos',tipo,inverso,admitido:true});
 }
 tiempoEnumeracion+=performance.now()-inicio;
});

for(const tipo of ['excepcionSobretiempo','excepcionSubtiempo'] as const)for(const n of [undefined,1,3])for(const unidad of [undefined,'sec','hour'] as const)test(`T-192 EX cota ${tipo} ${n} unidad ${unidad}`,()=>{
 const inicio=performance.now(),b=modeloCon({procesos:['Fuente','Manejo']}),[p,z]=Object.values(b.cosas),campo=tipo==='excepcionSobretiempo'?'max':'min';
 const e:Enlace={id:'e',tipo,origen:p!.id,destino:z!.id},m:Modelo={...b,cosas:{...b.cosas,[p!.id]:{...p!,tipo:'proceso',...(n!==undefined?{duracion:{[campo]:n,...(unidad?{unidad}:{})}}:{})}},enlaces:{e}};
 expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);verificar(m,`EX:${tipo}:${n}:${unidad}`);libro.push({familia:'EX',tipo,n,unidad,admitido:true});tiempoEnumeracion+=performance.now()-inicio;
});
test('T-192 estricto real por cada argumento exacto compara TODOS sus modelos de origen',()=>{
 const inicio=performance.now(),fallos:string[]=[],retencion=retencionStrict(pendientesStrict.map(e=>e.clave));
 for(const {nombre,id,doc,clave} of pendientesStrict){try{
  llamadasStrict++;let r=retencion.resultados.get(clave);
  if(r){hitsStrict++;expect(JSON.stringify(r)).toBe(retencion.snapshots.get(clave)!);}
  else{const tic=performance.now();r=importarOpl(nombre,doc);perfilCoste.importar+=performance.now()-tic;importsStrictExactos.add(clave);retencion.guardar(clave,r);}
  expect({id,ok:r.ok}).toEqual({id,ok:true});if(!r.ok)continue;
  expect(r.valor.plan.resumen.noAplicables).toBe(0);const tic=performance.now(),texto=generarDocumentoOpl(r.valor.modelo);perfilCoste.regenerar+=performance.now()-tic;expect({id,texto}).toEqual({id,texto:doc});
 }catch(e){fallos.push(id+':'+String(e));}finally{retencion.comparado(clave);}}
 expect(fallos).toEqual([]);expect(llamadasStrict).toBe(pendientesStrict.length);expect(retencion.resultados.size).toBe(0);expect(retencion.snapshots.size).toBe(0);tiempoEnumeracion+=performance.now()-inicio;
});

test('T-192 factorización exacta es determinista intercalada y no contamina modelos de origen',()=>{
 const inicio=performance.now(),b=modeloCon({objetos:[['Pedido',[]]],procesos:['Validar'],enlaces:[['consumo','Pedido','Validar']]}),before=JSON.stringify(b),doc=generarDocumentoOpl(b);
 const r=importarOpl(b.nombre,doc);expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);const after=JSON.stringify(r);
 for(let i=0;i<8;i++)expect(importarOpl('Otra',`**Objeto_${i}** es físico.`).ok).toBe(true);
 const otra=importarOpl(b.nombre,doc);expect(otra.ok).toBe(true);if(otra.ok){expect(generarDocumentoOpl(otra.valor.modelo)).toBe(doc);expect(otra.valor.modelo).not.toBe(r.valor.modelo);expect(JSON.stringify(r)).toBe(after);expect(JSON.stringify(b)).toBe(before);}
 expect(llamadasStrict).toBe(importsStrictExactos.size+hitsStrict);expect(libro.filter(c=>c.admitido).length).toBe(modelosVerificados);console.log('WP9 factorización',{modelosVerificados,llamadasStrict,importsReales:importsStrictExactos.size,hitsStrict,propuestas:libro.length});
 tiempoEnumeracion+=performance.now()-inicio;
});

test('T-192 retención A/B/A conserva respuesta exacta hasta último uso y libera después',()=>{
 const inicio=performance.now(),a=['A','**Alfa** es informacional.'] as const,b=['B','**Beta** es físico.'] as const,ka=JSON.stringify(a),kb=JSON.stringify(b),retencion=retencionStrict([ka,kb,ka]),importadas=new Set<string>();let llamadas=0;
 const obtener=(k:string,args:readonly[string,string])=>{const previa=retencion.resultados.get(k);if(previa){expect(JSON.stringify(previa)).toBe(retencion.snapshots.get(k)!);return previa;}llamadas++;const r=importarOpl(...args);importadas.add(k);retencion.guardar(k,r);return r;};
 const ra=obtener(ka,a);expect(ra.ok).toBe(true);retencion.comparado(ka);expect(retencion.resultados.get(ka)).toBe(ra);
 const rb=obtener(kb,b);expect(rb.ok).toBe(true);retencion.comparado(kb);expect(retencion.resultados.has(kb)).toBe(false);expect(obtener(ka,a)).toBe(ra);expect(llamadas).toBe(2);expect(importadas.size).toBe(2);retencion.comparado(ka);expect(retencion.resultados.size).toBe(0);expect(retencion.snapshots.size).toBe(0);tiempoEnumeracion+=performance.now()-inicio;
});

test('T-192 toda enumeración construcción análisis ensayo aplicación en menos de tres segundos',async()=>{
 await Bun.write('/tmp/opforja-rehacer/reanudacion-decisiones29/wp9/libro-corpus.json',JSON.stringify({propuestas:libro,documentos:[...documentos.values()],modelosVerificados,llamadasStrict,importsReales:importsStrictExactos.size,hitsStrict,ms:tiempoEnumeracion},null,2));
 console.log('WP9 coste completo',{ms:tiempoEnumeracion,modelosVerificados,entradasStrictExactas:importsStrictExactos.size,perfilCoste});expect(tiempoEnumeracion).toBeLessThan(3000);});
