import {expect,test} from 'bun:test';
import {generarDocumentoOpl,importarOpl} from './documento';
import {modeloCon} from '../pruebas/constructores';
test('T-100 documento canónico con nombre y cabecera contextual de raíz',()=>{
 const base=modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar']});
 const m={...base,cosas:Object.fromEntries(Object.entries(base.cosas).map(([id,c])=>[id,{...c,esencia:'informacional' as const}]))};
 expect(generarDocumentoOpl(m)).toBe(`# ${m.nombre}\n\n## SD\n*Procesar* es informacional.\n**Pedido** es informacional.`);
});
test('T-287 importación OPL vacía crea modelo válido y plan sin acciones',()=>{const r=importarOpl('Prueba','');expect(r.ok).toBe(true);if(!r.ok)return;expect(r.valor.modelo.nombre).toBe('Prueba');expect(validarForma(r.valor.modelo)).toEqual([]);expect(r.valor.modelo.cosas).toEqual({});expect(r.valor.plan.acciones).toEqual([]);expect(r.valor.plan.resumen).toEqual({total:1,aplicables:0,noAplicables:0,ignoradas:1,sinCambio:0});});

import type { Modelo } from '../nucleo/tipos';
import { generarModelo, textoCanonico } from './generar';
import { validarForma } from '../nucleo/forma';
import { erroresContexto } from '../nucleo/matriz';
test('T-282 Markdown genuino contiene todos los bloques en preorden y contexto de padres',()=>{
 const b=modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar','Preparar','Finalizar']});
 const m:Modelo={...b,opds:{...b.opds,'opd-1':{...b.opds['opd-1']!,apariciones:{'o-2':b.opds['opd-1']!.apariciones['o-2']!,'p-3':b.opds['opd-1']!.apariciones['p-3']!}},h:{id:'h',tipo:'descomposicion',padre:'opd-1',cosa:'p-3',orden:0,bandas:[['p-4'],['p-5']],objetosInternos:[],apariciones:{'p-3':{x:0,y:0,ancho:400,alto:300},'p-4':{x:30,y:65,ancho:135,alto:60},'p-5':{x:30,y:160,ancho:135,alto:60}}}}};
 expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);const antes=JSON.stringify(m),doc=generarDocumentoOpl(m),bloques=generarModelo(m);
 expect([...new Set(bloques.map(b=>b.opd))]).toEqual(['opd-1','h']);expect(doc).toBe(`# ${m.nombre}\n\n${textoCanonico(bloques)}`);
 expect(doc.indexOf('## SD\n')).toBeLessThan(doc.indexOf('## SD1'));
 expect(doc).toContain('*Procesar* se descompone');expect(doc).toContain('*Preparar*');expect(doc).toContain('*Finalizar*');expect(JSON.stringify(m)).toBe(antes);
});
// Revisión contra los ejemplos de Wikipedia/ISO: el texto que genera el producto vuelve idéntico.
for (const texto of [
    '**B** puede estar `s1`, `s2` o `s3`.\n*P* genera exactamente uno de **B** en `s1`, **B** en `s2` o **B** en `s3`.',
    '**Auto** tiene un opcional **Techo Solar**.',
    '**Auto** tiene al menos una **Rueda**.'
])
    test(`T-287 OPL→modelo→OPL idéntico: ${texto.split('\n').at(-1)}`, () => {
        const r = importarOpl('Prueba', `## SD\n${texto}`); expect(r.ok).toBe(true); if (!r.ok) return;
        expect(Object.keys(r.valor.modelo.enlaces).length).toBeGreaterThan(0);
        expect(generarDocumentoOpl(r.valor.modelo)).toBe(`# Prueba\n\n## SD\n${texto}`);
    });
test('T-287 el atributo opcional «tiene un **Y** opcional» sigue sin soporte y no crea hechos', () => {
    const r = importarOpl('Prueba', '## SD\n**Pedido** tiene una **Marca** opcional.'); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.valor.modelo.enlaces).toEqual({});
});

import {aplicarAcciones} from '../nucleo/operaciones';
import {porNombre,must} from '../pruebas/constructores';
import {exportarV0} from '../codec/exportar';
for(const designaciones of [
 ['inicial','porDefecto'],['final','current'],['inicial','final','porDefecto'],['inicial','final','current'],['inicial','final','porDefecto','current']
] as const)test(`T-108 T-192 dimensiones de designación coexistentes ${designaciones.join('+')} desde documento nativo visible`,()=>{
 const b=modeloCon({objetos:[['Pedido',['pendiente','completado']]],procesos:['Preparar'],enlaces:[['efecto','Pedido','Preparar']]}),o=porNombre(b,'Pedido');if(o.tipo!=='objeto')throw Error('Objeto');const m=must(aplicarAcciones(b,designaciones.map(designacion=>({op:'designar' as const,args:{estado:o.estados[0]!.id,designacion,activa:true}})))).modelo,antes=exportarV0(m),texto=generarDocumentoOpl(m),r=importarOpl(m.nombre,texto);
 expect(r.ok).toBe(true);if(!r.ok)throw Error('Importación');expect(r.valor.plan.resumen.noAplicables).toBe(0);expect(generarDocumentoOpl(r.valor.modelo)).toBe(texto);const objeto=porNombre(r.valor.modelo,'Pedido');if(objeto.tipo!=='objeto')throw Error('Objeto reconstruido');for(const d of designaciones)if(d==='inicial'||d==='final')expect(objeto.estados[0]![d]).toBe(true);else expect(objeto[d]).toBe(objeto.estados[0]!.id);expect(Object.values(r.valor.modelo.enlaces).map(e=>e.tipo)).toEqual(['efecto']);expect(exportarV0(m)).toBe(antes);
});
test('T-120 SE3 con la etiqueta por defecto vuelve desde vacío al mismo bidireccional, entre objetos y entre procesos',()=>{
 for(const datos of [{objetos:[['Alfa',[]],['Beta',[]]] as const},{procesos:['Alfa','Beta']}]){
  const base=modeloCon({...datos,enlaces:[['etiquetadoBidireccional','Alfa','Beta']]}),[id,e]=Object.entries(base.enlaces)[0]!;
  const m={...base,enlaces:{[id]:{...e,etiqueta:'se relaciona con',inversa:'es relacionado por'}}} as typeof base,texto=generarDocumentoOpl(m);
  expect(texto).toContain('se relaciona con');expect(texto).toContain('es relacionado por');
  const r=importarOpl(m.nombre,texto);expect(r.ok).toBe(true);if(!r.ok)continue;
  expect(r.valor.plan.resumen.noAplicables).toBe(0);
  expect(Object.values(r.valor.modelo.enlaces)).toEqual([expect.objectContaining({tipo:'etiquetadoBidireccional',etiqueta:'se relaciona con',inversa:'es relacionado por'})]);
  expect(generarDocumentoOpl(r.valor.modelo)).toBe(texto);
 }
});
