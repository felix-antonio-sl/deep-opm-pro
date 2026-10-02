import { test, expect } from 'bun:test';
import { importarV0 } from './importar';
import { proyectar } from '../nucleo/proyeccion';
import { documento, entidad, enlace, refinado } from './pruebas';
import { readFileSync } from 'node:fs';

// Oráculo manual desde los ids y apariencias del JSON original, no desde el códec.
// Meta/OnStar/Sync/System conservan sus hechos visibles tras el alias derivado→padre.
// Async guarda copias PROPIAS (sin derivado) de enlaces del contorno: aparecen también
// en el otro OPD. e-62 y e-74 unen dos externos del despliegue por agregación y
// dejan de verse: o-51/o-53 no son refinadores de p-13; las partes son p-37/39/41/49.
const originales = [
 ['Modelo_Vacio.json','opd-1',[],[]],
 ['OPM_Structure_Meta_Model.json','opd-1',[],[]],
 ['OPM_Structure_Meta_Model.json','opd-63',[],[]],
 ['OPM_Structure_Meta_Model.json','opd-77',[],[]],
 ['OPM_Structure_Meta_Model.json','opd-91',[],[]],
 ['OnStar_System.json','opd-1',[],[]],
 ['OnStar_System.json','opd-33',[],[]],
 ['SD_Async.json','opd-1',['e-62','e-64','e-66','e-68','e-70','e-72'],[]],
 ['SD_Async.json','opd-35',['e-19','e-25','e-27','e-29','e-31','e-33'],['e-62','e-74']],
 ['SD_Sync.json','opd-1',[],[]],
 ['SD_Sync.json','opd-35',[],[]],
 ['System_Diagram.json','opd-1',[],[]],
] as const;
for(const [name,opd,aparecen,desaparecen] of originales)test(`T-287 oráculo manual visibilidad ${name}/${opd}`,()=>{
 const r=importarV0(readFileSync(new URL(`../../fixtures/v0/${name}`,import.meta.url),'utf8'));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));const diff=r.informe.visibilidad.find(d=>d.opd===opd);
 expect(diff?.aparecen.map(d=>d.enlace)??[]).toEqual([...aparecen]);expect(diff?.desaparecen.map(d=>d.enlace)??[]).toEqual([...desaparecen]);
 if(diff){expect(diff.etiqueta).toBe(opd==='opd-1'?'SD':'SD1');expect(diff.aparecen.concat(diff.desaparecen).every(d=>d.texto.includes('→'))).toBe(true);}
});
test('T-287 etapa 12: directos aparecen y hechos abstraídos nunca aparecen', () => {
  const d = refinado([enlace('e-sub', 'instrumento', 'o-1', 'p-4')]); d.modelo.opds['opd-1'].enlaces = {}; d.modelo.opds['opd-3'].enlaces = {};
  const r = importarV0(JSON.stringify(d)); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
  expect(proyectar(r.modelo, 'opd-1').enlaces[0]).toMatchObject({ abstraido: true, hechos: ['e-sub'] });
  expect(r.informe.visibilidad.map(v => ({ opd: v.opd, aparecen: v.aparecen.map(e => e.enlace), desaparecen: v.desaparecen.map(e => e.enlace) }))).toEqual([{ opd: 'opd-3', aparecen: ['e-sub'], desaparecen: [] }]);
});
test('T-287 etapa 12: pérdida externa declarada con etiqueta y texto nuclear', () => {
  const d = refinado([enlace('e-ext', 'etiquetado', 'o-1', 'p-2')]); // p-2 es contorno: este hecho sí se ve.
  d.modelo.entidades['o-6'] = entidad('o-6'); d.modelo.opds['opd-3'].apariencias.a6 = { ...d.modelo.opds['opd-3'].apariencias['a-opd-3-o-1'], id: 'a6', entidadId: 'o-6' };
  d.modelo.enlaces['e-ext'] = enlace('e-ext', 'etiquetado', 'o-1', 'o-6'); d.modelo.opds['opd-3'].enlaces.a = { id: 'a', enlaceId: 'e-ext', opdId: 'opd-3' }; d.modelo.opds['opd-1'].enlaces = {};
  const r = importarV0(JSON.stringify(d)); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe)); const v = r.informe.visibilidad.find(v => v.opd === 'opd-3'); expect(v?.etiqueta).toBe('SD1'); expect(v?.desaparecen).toEqual([{ enlace: 'e-ext', texto: 'etiquetado: o-1 → o-6' }]);
});
