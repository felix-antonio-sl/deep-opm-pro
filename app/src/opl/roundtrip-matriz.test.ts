import { test, expect } from 'bun:test';
import type { Modelo } from '../nucleo/tipos';
import { modeloCon } from '../pruebas/constructores';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { PLANTILLAS } from './plantillas';
import { generarModelo } from './generar';
import { casosRoundtrip } from '../pruebas/corpus-roundtrip';

const importsStrictExactos = new Set<string>();
let modelosVerificados = 0;
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
    const doc = generarDocumentoOpl(m);
    const claveDocumento=JSON.stringify([m.nombre,doc]);const entrada=documentos.get(claveDocumento)??{nombre:m.nombre,texto:doc,origenes:[],estricto};entrada.origenes.push(id);documentos.set(claveDocumento,entrada);
    const p = planificar(m, 'modelo', doc);
    expect({ id, errores: p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error')) }).toEqual({ id, errores: [] });
    expect({ id, acciones: p.acciones }).toEqual({ id, acciones: [] });
    expect(generarModelo(m).every(l => l.soloDisplay || plantillasCanonicas.has(l.plantilla))).toBe(true);
    if(estricto)pendientesStrict.push({nombre:m.nombre,id,doc,clave:claveDocumento});
}

for (const { nombre, ejecutar, timeout } of casosRoundtrip(verificar, expect, libro, console.log)) test(nombre, ejecutar, timeout);

test('T-192 estricto real por cada argumento exacto compara TODOS sus modelos de origen',()=>{
 const fallos:string[]=[],retencion=retencionStrict(pendientesStrict.map(e=>e.clave));
 for(const {nombre,id,doc,clave} of pendientesStrict){try{
  llamadasStrict++;let r=retencion.resultados.get(clave);
  if(r){hitsStrict++;expect(JSON.stringify(r)).toBe(retencion.snapshots.get(clave)!);}
  else{r=importarOpl(nombre,doc);importsStrictExactos.add(clave);retencion.guardar(clave,r);}
  expect({id,ok:r.ok}).toEqual({id,ok:true});if(!r.ok)continue;
  expect(r.valor.plan.resumen.noAplicables).toBe(0);const texto=generarDocumentoOpl(r.valor.modelo);expect({id,texto}).toEqual({id,texto:doc});
 }catch(e){fallos.push(id+':'+String(e));}finally{retencion.comparado(clave);}}
 expect(fallos).toEqual([]);expect(llamadasStrict).toBe(pendientesStrict.length);expect(retencion.resultados.size).toBe(0);expect(retencion.snapshots.size).toBe(0);
});

test('T-192 factorización exacta es determinista intercalada y no contamina modelos de origen',()=>{
 const b=modeloCon({objetos:[['Pedido',[]]],procesos:['Validar'],enlaces:[['consumo','Pedido','Validar']]}),before=JSON.stringify(b),doc=generarDocumentoOpl(b);
 const r=importarOpl(b.nombre,doc);expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);const after=JSON.stringify(r);
 for(let i=0;i<8;i++)expect(importarOpl('Otra',`**Objeto_${i}** es físico.`).ok).toBe(true);
 const otra=importarOpl(b.nombre,doc);expect(otra.ok).toBe(true);if(otra.ok){expect(generarDocumentoOpl(otra.valor.modelo)).toBe(doc);expect(otra.valor.modelo).not.toBe(r.valor.modelo);expect(JSON.stringify(r)).toBe(after);expect(JSON.stringify(b)).toBe(before);}
 expect(llamadasStrict).toBe(importsStrictExactos.size+hitsStrict);expect(libro.filter(c=>c.admitido).length).toBe(modelosVerificados);console.log('WP9 factorización',{modelosVerificados,llamadasStrict,importsReales:importsStrictExactos.size,hitsStrict,propuestas:libro.length});
});

test('T-192 retención A/B/A conserva respuesta exacta hasta último uso y libera después',()=>{
 const a=['A','**Alfa** es informacional.'] as const,b=['B','**Beta** es físico.'] as const,ka=JSON.stringify(a),kb=JSON.stringify(b),retencion=retencionStrict([ka,kb,ka]),importadas=new Set<string>();let llamadas=0;
 const obtener=(k:string,args:readonly[string,string])=>{const previa=retencion.resultados.get(k);if(previa){expect(JSON.stringify(previa)).toBe(retencion.snapshots.get(k)!);return previa;}llamadas++;const r=importarOpl(...args);importadas.add(k);retencion.guardar(k,r);return r;};
 const ra=obtener(ka,a);expect(ra.ok).toBe(true);retencion.comparado(ka);expect(retencion.resultados.get(ka)).toBe(ra);
 const rb=obtener(kb,b);expect(rb.ok).toBe(true);retencion.comparado(kb);expect(retencion.resultados.has(kb)).toBe(false);expect(obtener(ka,a)).toBe(ra);expect(llamadas).toBe(2);expect(importadas.size).toBe(2);retencion.comparado(ka);expect(retencion.resultados.size).toBe(0);expect(retencion.snapshots.size).toBe(0);
});

test('T-192 corpus completo conserva todos los modelos y argumentos estrictos',()=>{
 expect(modelosVerificados).toBe(2996);
 expect(importsStrictExactos.size).toBe(2734);
 expect(pendientesStrict).toHaveLength(2992);
 expect(documentos.size).toBe(2736);
 expect(libro).toHaveLength(5786);
 console.log('WP9 corpus completo',{modelosVerificados,entradasStrictExactas:importsStrictExactos.size,documentos:documentos.size});
});
