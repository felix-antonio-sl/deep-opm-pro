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
