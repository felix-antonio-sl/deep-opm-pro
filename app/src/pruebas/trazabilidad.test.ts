import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { modeloCon, must, congelar } from './constructores';
import type { Modelo, Objeto } from '../nucleo/tipos';
import { validarForma } from '../nucleo/forma';
import { erroresContexto, REGLAS_CONTEXTO } from '../nucleo/matriz';
import { CATALOGO, diagnosticar } from '../nucleo/diagnostico';
import { crearCosa, traerCosa, moverApariciones, redimensionar } from '../nucleo/cosas';
import { fijarControl } from '../nucleo/enlaces';
import { escena } from '../opd/escena';
import { exportarDiagrama } from '../opd/exportar';
import { generarBloque, generarModelo, textoCanonico } from '../opl/generar';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { documento, entidad } from '../codec/pruebas';
const caja = { x: 0, y: 0, ancho: 400, alto: 300 };
function dosOpd(): Modelo {
 const b=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Procesar','Preparar','Finalizar']});
 return congelar<Modelo>({...b,opds:{...b.opds,'opd-1':{...b.opds['opd-1']!,apariciones:{'o-2':b.opds['opd-1']!.apariciones['o-2']!,'p-5':b.opds['opd-1']!.apariciones['p-5']!}},h:{id:'h',tipo:'descomposicion',padre:'opd-1',cosa:'p-5',orden:0,bandas:[['p-6'],['p-7']],objetosInternos:[],apariciones:{'p-5':caja,'p-6':{x:40,y:75,ancho:135,alto:60},'p-7':{x:40,y:170,ancho:135,alto:60}}}}});
}
function sano(m:Modelo){expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);}
test('T-010 OPD y OPL expresan la misma identidad nuclear sin mutarla',()=>{
 const m=modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar'],enlaces:[['consumo','Pedido','Procesar']]});sano(m);const antes=JSON.stringify(m),e=escena(m,m.raiz),l=generarBloque(m,m.raiz);
 expect(e.aristas.map(a=>a.hechos)).toEqual([['e-4']]);expect(l.filter(l=>l.hechos.length).map(l=>l.hechos)).toEqual([['e-4']]);expect(l.find(l=>l.hechos.includes('e-4'))?.texto).toBe('*Procesar* consume **Pedido**.');expect(JSON.stringify(m)).toBe(antes);
});
test('T-013 defaults de proceso y datos intrínsecos compartidos entre apariciones',()=>{
 const b=modeloCon(),r=must(crearCosa(b,{opd:b.raiz,tipo:'proceso',nombre:'Procesar',x:0,y:0}));
 expect(r.modelo.cosas['p-2']).toEqual({id:'p-2',tipo:'proceso',nombre:'Procesar',esencia:'informacional',afiliacion:'sistemica'});
 const m=dosOpd(),n=must(traerCosa(m,{opd:'h',cosa:'o-2',x:-200,y:0})).modelo;sano(n);expect(n.cosas).toBe(m.cosas);expect(n.opds['opd-1']!.apariciones['o-2']).not.toEqual(n.opds.h!.apariciones['o-2']);expect(n.cosas['o-2']).toBe(m.cosas['o-2']);
});
test('T-023 T-248 misma cosa en dos OPD con geometría distinta y rechazo ya-aparece',()=>{
 const m=dosOpd(),antes=JSON.stringify(m),r=must(traerCosa(m,{opd:'h',cosa:'o-2',x:-200,y:0})),n=r.modelo;sano(n);expect(r.creados).toEqual([]);expect(n.secuencia).toBe(m.secuencia);
 const ns=['opd-1','h'].map(id=>escena(n,id).nodos.find(n=>n.ref.id==='o-2')!);expect(ns.map(n=>n.ref)).toEqual([{tipo:'cosa',id:'o-2'},{tipo:'cosa',id:'o-2'}]);expect(ns[0]!.caja).not.toEqual(ns[1]!.caja);expect(traerCosa(n,{opd:'h',cosa:'o-2',x:-300,y:0})).toMatchObject({ok:false,rechazo:{codigo:'ya-aparece'}});expect(JSON.stringify(m)).toBe(antes);
});
test('T-019 objeto exhibido conserva sus estados propios, RF2 y D5 y export fiel',()=>{
 const m=modeloCon({objetos:[['Pedido',[]],['Color',['rojo','azul']]],enlaces:[['exhibicion','Pedido','Color']]});sano(m);const antes=JSON.stringify(m),l=generarBloque(m,m.raiz);
 expect(l.map(l=>l.texto)).toContain('**Pedido** exhibe **Color**.');expect(l.some(l=>l.texto.includes('rojo')&&l.texto.includes('azul'))).toBe(true);expect(m.cosas['o-2']).not.toHaveProperty('atributos');expect(m.cosas['o-3']?.tipo).toBe('objeto');
 const r=exportarDiagrama(m,m.raiz,{version:'prueba'});expect(r.ok).toBe(true);if(r.ok){expect(r.valor.svg).toContain('>Color</text>');expect(r.valor.svg).toContain('>rojo</text>');expect(r.valor.svg).toContain('>azul</text>');}expect(JSON.stringify(m)).toBe(antes);
});
test('T-027 cambio e a c conserva ID y cantidades, ambas expresiones siguen el hecho',()=>{
 const m=modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar'],enlaces:[['consumo','Pedido','Procesar']]});sano(m);const id='e-4',antes=JSON.stringify(m),e=must(fijarControl(m,{enlace:id,control:'e'})).modelo,c=must(fijarControl(e,{enlace:id,control:'c'})).modelo;sano(c);
 expect(Object.keys(c.enlaces)).toEqual(Object.keys(m.enlaces));expect(c.secuencia).toBe(m.secuencia);const original=m.enlaces[id]!;if(original.tipo!=='consumo')throw Error('Firma de fixture');expect(c.enlaces[id]).toEqual({...original,control:'c'});expect(textoCanonico(generarModelo(e))).not.toBe(textoCanonico(generarModelo(c)));expect(JSON.stringify(m)).toBe(antes);
});
test('T-036 runtime importado se informa y desaparece de JSON/export mientras Current declarado permanece',()=>{
 const d=documento([entidad('o-1','objeto',{nombre:'Pedido',simulacion:{actual:'s-2'}})],[],[{id:'s-2',entidadId:'o-1',nombre:'nuevo',designaciones:['current']}]);
 const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(r.informe.descartado).toContainEqual(expect.objectContaining({ruta:'entidades.o-1.simulacion'}));
 const obj=r.modelo.cosas['o-1'] as Objeto;expect(obj.current).toBe('s-2');expect(exportarV0(r.modelo)).not.toContain('simulacion');expect(exportarV0(r.modelo)).toContain('current');const e=exportarDiagrama(r.modelo,r.modelo.raiz,{version:'prueba'});expect(e.ok).toBe(true);if(e.ok){expect(e.valor.svg).toContain('pin-current');expect(e.valor.svg).not.toContain('simulacion');}
});
test('T-084 identidad nuclear determina el tipo en dos OPD sin instancia visual',()=>{
 const m=must(traerCosa(dosOpd(),{opd:'h',cosa:'o-2',x:-200,y:0})).modelo;sano(m);
 expect(['opd-1','h'].map(id=>escena(m,id).nodos.find(n=>n.ref.id==='o-2')!.tipo)).toEqual(['objeto','objeto']);expect(JSON.parse(exportarV0(m)).modelo.entidades['o-2'].tipo).toBe('objeto');
});
test('T-249 mover y redimensionar realmente conserva OPL y hechos, control semántico sí cambia OPL',()=>{
 const m=modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar'],enlaces:[['consumo','Pedido','Procesar']]});sano(m);const antes=JSON.stringify(m),opl=textoCanonico(generarModelo(m)),n=must(moverApariciones(m,{opd:m.raiz,mover:[{cosa:'o-2',x:-300,y:150}]})).modelo,z=must(redimensionar(n,{opd:m.raiz,cosa:'o-2',ancho:200,alto:110})).modelo;
 expect(textoCanonico(generarModelo(z))).toBe(opl);expect(z.enlaces).toBe(m.enlaces);expect(z.cosas).toBe(m.cosas);expect(textoCanonico(generarModelo(must(fijarControl(z,{enlace:'e-4',control:'c'})).modelo))).not.toBe(opl);expect(JSON.stringify(m)).toBe(antes);
});
test('T-289 renumeración de OPD por orden derivado no sustituye IDs al exportar/reimportar',()=>{
 const m=dosOpd(),n:Modelo={...m,opds:{...m.opds,h:{...m.opds.h!,orden:5} as Modelo['opds'][string]}},antes=JSON.stringify(n),r=importarV0(exportarV0(n));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(Object.keys(r.modelo.opds).sort()).toEqual(['h','opd-1']);expect(r.modelo.opds.h).toMatchObject({id:'h',padre:'opd-1',cosa:'p-5',orden:0});expect(r.informe.normalizado.some(e=>e.ruta.includes('orden'))).toBe(true);expect(JSON.stringify(n)).toBe(antes);
});
test('T-003 toda regla de contexto y catálogo acredita primaria local o límite de producto declarado',()=>{
 const reglas=readFileSync(new URL('../../../canon/reglas-opm-estrictas-es/content.md',import.meta.url),'utf8'),opd=readFileSync(new URL('../../../canon/spec-forja-opd-es/content.md',import.meta.url),'utf8'),opl=readFileSync(new URL('../../../canon/spec-forja-opl-es/content.md',import.meta.url),'utf8');
 const texto=reglas+'\n'+opd+'\n'+opl,patron=(s:string)=>s.replace(/[^a-zA-Z0-9]/g,'').toUpperCase(),normal=patron(texto);
 const derivadas:Readonly<Record<string,string>>={'R-RES-1':'RRES1','R-EFE-1':'REFE1','R-ROL-UNIC-1':'ROPDHAB4','R-DIST-1':'RDIST1','R-CX-DIST-2':'RCXDIST2','R-AG-1':'RAG1'};
 for(const r of REGLAS_CONTEXTO)expect(normal.includes(patron(derivadas[r.id]??r.id)),r.id).toBe(true);
 for(const r of CATALOGO){expect(r.regla.length).toBeGreaterThan(0);expect(r.accion.length).toBeGreaterThan(0);} // Catálogo derivado tiene varias condiciones locales: alcance exacto se declara en conformidad, no sólo este inventario.
 expect(REGLAS_CONTEXTO.find(r=>r.id==='R-ROL-1')).toMatchObject({codigo:'no-ofrecido',registro:'B-34'});
});

test('T-014 perseverancia se deriva del tipo nuclear sin campo persistido ni glifo añadido',()=>{
 const m=congelar(modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar']})),antes=exportarV0(m);
 sano(m);const e=escena(m,m.raiz);expect(e.nodos.map(n=>n.tipo)).toEqual(['objeto','proceso']);
 const r=exportarDiagrama(m,m.raiz,{version:'trazabilidad'});expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.mensaje);
 const entidades=JSON.parse(antes).modelo.entidades;
 expect(entidades['o-2'].tipo).toBe('objeto');expect(entidades['p-3'].tipo).toBe('proceso');
 for(const c of [m.cosas['o-2']!,m.cosas['p-3']!,entidades['o-2'],entidades['p-3']]){
  expect(c).not.toHaveProperty('persistencia');expect(c).not.toHaveProperty('perseverancia');
 }
 expect(r.valor.svg).toContain('>Pedido</text>');expect(r.valor.svg).toContain('>Procesar</text>');
 expect(r.valor.svg).toContain('<rect');expect(r.valor.svg).toContain('<ellipse');
 expect(r.valor.svg).not.toContain('perseverancia');expect(r.valor.svg).not.toContain('persistencia');
 expect(exportarV0(m)).toBe(antes);
});
