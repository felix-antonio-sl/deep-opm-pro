import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { importarV0 } from './importar';
import { validarForma } from '../nucleo/forma';
import { proyectar } from '../nucleo/proyeccion';
import { refinado, enlace, entidad, extremo } from './pruebas';
const rows = [
  ['OnStar_System.json', 'e-27', ['e-44', 'e-46', 'e-48'], 'p-13'],
  ['OnStar_System.json', 'e-29', ['e-50', 'e-52', 'e-54'], 'p-13'],
  ['OnStar_System.json', 'e-31', ['e-56', 'e-58', 'e-60'], 'p-13'],
  ['SD_Sync.json', 'e-23', ['e-50', 'e-52', 'e-54'], 'p-13'],
  ['SD_Sync.json', 'e-25', ['e-56', 'e-58', 'e-60'], 'p-13'],
  ['SD_Sync.json', 'e-27', ['e-62'], 'p-37'],
  ['SD_Sync.json', 'e-29', ['e-64', 'e-66', 'e-68'], 'p-13'],
  ['SD_Sync.json', 'e-31', ['e-70', 'e-72', 'e-74'], 'p-13'],
  ['SD_Sync.json', 'e-33', ['e-76'], 'p-78'],
] as const;
for (const [name, parent, derivatives, proceso] of rows) for (const derivative of derivatives) test(`T-287 derivado ${name} ${derivative}→${parent}`, () => {
  const r = importarV0(readFileSync(new URL(`../../fixtures/v0/${name}`, import.meta.url), 'utf8')); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe)); expect(validarForma(r.modelo)).toEqual([]); expect(r.modelo.enlaces[parent]).toMatchObject({ id: parent, proceso }); expect(r.modelo.enlaces[derivative]).toBeUndefined(); expect(r.informe.ignorado[`enlaces.${derivative}.derivado`]).toBeGreaterThan(0);
});
test('T-287 derivados: ausencia no distribuye, manual adicional propio y huérfano pierde', () => {
  const d = refinado([enlace('parent', 'consumo', 'o-1', 'p-2'), enlace('d1', 'consumo', 'o-1', 'p-4', { derivado: { tipo: 'enlace-externo-refinamiento', enlacePadreId: 'parent', refinamientoId: 'p-2', origen: 'manual' } }), enlace('d2', 'consumo', 'o-1', 'p-5', { derivado: { tipo: 'enlace-externo-refinamiento', enlacePadreId: 'parent', refinamientoId: 'p-2', origen: 'manual' } }), enlace('orphan', 'consumo', 'o-1', 'p-4', { derivado: { tipo: 'enlace-externo-refinamiento', enlacePadreId: 'missing', refinamientoId: 'p-2' } })]);
  const r = importarV0(JSON.stringify(d)); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe)); expect(r.modelo.enlaces.parent).toMatchObject({ proceso: 'p-4' }); expect(r.modelo.enlaces.d2).toMatchObject({ id: 'd2', proceso: 'p-5' }); expect(r.modelo.enlaces.orphan).toBeUndefined();
  const plain = refinado([enlace('parent', 'consumo', 'o-1', 'p-2')]); const p = importarV0(JSON.stringify(plain)); expect(p.ok).toBe(true); if (p.ok) expect(p.modelo.enlaces.parent).toMatchObject({ proceso: 'p-2' });
});
test('T-032 derivados TS3 sin control usa bandas, no orden del Record; dos mitades conservan ids',()=>{
 const d=refinado([enlace('parent','efecto','p-2','o-1',{estadoEntradaId:'s-6',estadoSalidaId:'s-7'}),enlace('late','efecto','p-5','o-1',{estadoEntradaId:'s-6',estadoSalidaId:'s-7',derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'parent',refinamientoId:'p-2'}}),enlace('early','efecto','p-4','o-1',{estadoEntradaId:'s-6',estadoSalidaId:'s-7',derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'parent',refinamientoId:'p-2'}})]);
 d.modelo.estados={'s-6':{id:'s-6',entidadId:'o-1',nombre:'a'},'s-7':{id:'s-7',entidadId:'o-1',nombre:'b'}};
 const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(r.modelo.enlaces.parent).toEqual({id:'parent',tipo:'efecto',objeto:'o-1',proceso:'p-4',entrada:'s-6',escision:{par:'late',mitad:'entrada'}});expect(r.modelo.enlaces.late).toEqual({id:'late',tipo:'efecto',objeto:'o-1',proceso:'p-5',salida:'s-7',escision:{par:'parent',mitad:'salida'}});expect(r.modelo.enlaces.early).toBeUndefined();expect(validarForma(r.modelo)).toEqual([]);
});
test('T-032 derivados de consumo+resultado fusionados recuperan id del resultado en salida',()=>{
 const d=refinado([enlace('c','consumo','s-6','p-2',{origenId:extremo('s-6','estado')}),enlace('r','resultado','p-2','s-7',{destinoId:extremo('s-7','estado')}),enlace('dc','consumo','s-6','p-4',{origenId:extremo('s-6','estado'),derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'c',refinamientoId:'p-2'}}),enlace('dr','resultado','p-5','s-7',{destinoId:extremo('s-7','estado'),derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'r',refinamientoId:'p-2'}})]);d.modelo.estados={'s-6':{id:'s-6',entidadId:'o-1',nombre:'a'},'s-7':{id:'s-7',entidadId:'o-1',nombre:'b'}};
 d.modelo.opds['opd-3'].enlaces={adc:{id:'adc',enlaceId:'dc',opdId:'opd-3'},adr:{id:'adr',enlaceId:'dr',opdId:'opd-3'}};
 const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(r.modelo.enlaces.c).toMatchObject({id:'c',proceso:'p-4',entrada:'s-6',escision:{par:'r',mitad:'entrada'}});expect(r.modelo.enlaces.r).toMatchObject({id:'r',proceso:'p-5',salida:'s-7',escision:{par:'c',mitad:'salida'}});expect(r.modelo.enlaces.dc).toBeUndefined();expect(r.modelo.enlaces.dr).toBeUndefined();expect(validarForma(r.modelo)).toEqual([]);
 expect(proyectar(r.modelo,'opd-3').enlaces.map(e=>({id:e.enlace.id,hechos:e.hechos,abstraido:e.abstraido}))).toEqual([{id:'c',hechos:['c'],abstraido:false},{id:'r',hechos:['r'],abstraido:false}]);expect(r.informe.visibilidad).toEqual([]);
});
for(const variante of ['TS4','TS5','TS3-control','TS3-fan','evento-sistemico'])test(`T-032 derivados ${variante} reanclan primer/último completo`,()=>{
 const fields=variante==='TS4'?{estadoEntradaId:'s-6'}:variante==='TS5'?{estadoSalidaId:'s-7'}:variante==='evento-sistemico'?{modificador:'evento'}:{estadoEntradaId:'s-6',estadoSalidaId:'s-7',...(variante==='TS3-control'?{modificador:'condicion'}:{})};
 const d=refinado([enlace('parent','efecto','p-2','o-1',fields),enlace('late','efecto','p-5','o-1',{...fields,derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'parent',refinamientoId:'p-2'}}),enlace('early','efecto','p-4','o-1',{...fields,derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'parent',refinamientoId:'p-2'}})]);d.modelo.estados={'s-6':{id:'s-6',entidadId:'o-1',nombre:'a'},'s-7':{id:'s-7',entidadId:'o-1',nombre:'b'}};
 if(variante==='TS3-fan'){d.modelo.enlaces.other=enlace('other','efecto','p-4','o-1',{estadoEntradaId:'s-6',estadoSalidaId:'s-7'});d.modelo.abanicos.f={id:'f',operador:'O',enlaceIds:['parent','other']};}
 const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(r.modelo.enlaces.parent).toMatchObject({proceso:variante==='TS5'?'p-5':'p-4'});expect('escision'in r.modelo.enlaces.parent!).toBe(false);expect(r.modelo.enlaces.late).toBeUndefined();expect(r.modelo.enlaces.early).toBeUndefined();
});
for(const tipo of ['agente','instrumento'] as const)for(const afiliacion of ['sistemica','ambiental'])test(`T-060 derivado de evento ${tipo} ${afiliacion} recupera reanclaje indicado`,()=>{
 const d=refinado([enlace('parent',tipo,'o-1','p-2',{modificador:'evento'}),enlace('early',tipo,'o-1','p-4',{modificador:'evento',derivado:{tipo:'enlace-externo-refinamiento',enlacePadreId:'parent',refinamientoId:'p-2',origen:'automatico'}})]);
 d.modelo.entidades['o-1'].esencia='fisica';d.modelo.entidades['o-1'].afiliacion=afiliacion;
 const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(r.modelo.enlaces.parent).toEqual({id:'parent',tipo,objeto:'o-1',proceso:afiliacion==='sistemica'?'p-4':'p-2',control:'e'});expect(r.modelo.enlaces.early).toBeUndefined();expect(validarForma(r.modelo)).toEqual([]);expect(r.informe.ignorado['enlaces.early.derivado']).toBe(1);expect(r.informe.normalizado.some(e=>e.ruta==='enlaces.early.derivado')).toBe(true);
});
for(const tipo of ['agente','instrumento'] as const)test(`T-060 evento ${tipo} sistémico sin derivado no fabrica distribución`,()=>{
 const d=refinado([enlace('parent',tipo,'o-1','p-2',{modificador:'evento'})]);d.modelo.entidades['o-1'].esencia='fisica';const r=importarV0(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect(r.modelo.enlaces.parent).toEqual({id:'parent',tipo,objeto:'o-1',proceso:'p-2',control:'e'});expect(Object.keys(r.modelo.enlaces)).toEqual(['parent']);
});
