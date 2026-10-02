import {test,expect} from 'bun:test';
import {importarV0} from './importar';
import {exportarV0} from './exportar';
import {leerCanonico,revision} from './canonico';
import {informeVacio} from './informe';
import {validarForma} from '../nucleo/forma';
import {documento,entidad,enlace,extremo} from './pruebas';
import type {Raw} from './pruebas';

// Wire directo escrito desde el contrato; no se obtiene importando/exportando bajo prueba.
function documentoDirecto():Raw {
 const d=documento([entidad('o-1'),entidad('p-2','proceso')],[
  enlace('c','consumo','s-6','p-2',{origenId:extremo('s-6','estado'),modificador:'condicion'}),
  enlace('r','resultado','p-2','s-7',{destinoId:extremo('s-7','estado')}),
 ],[{id:'s-6',entidadId:'o-1',nombre:'a',orden:0},{id:'s-7',entidadId:'o-1',nombre:'b',orden:1}]);
 d.modelo.opds['opd-1'].enlaces={
  'ae-opd-1-c':{id:'ae-opd-1-c',enlaceId:'c',opdId:'opd-1',vertices:[]},
  'ae-opd-1-r':{id:'ae-opd-1-r',enlaceId:'r',opdId:'opd-1',vertices:[]},
 };
 return d;
}
const bytes=(d:Raw)=>JSON.stringify(d,null,2)+'\n';
function fusionLegado(s:string) {
 const r=importarV0(s);expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));
 expect(r.modelo.enlaces).toEqual({c:{id:'c',tipo:'efecto',objeto:'o-1',proceso:'p-2',entrada:'s-6',salida:'s-7',control:'c'}});
 expect(r.informe.normalizado.some(e=>e.regla==='T-032'&&e.mensaje.includes('→ TS3'))).toBe(true);
 expect(validarForma(r.modelo)).toEqual([]);return r;
}
test('T-196 reconocimiento previo: directo exacto preserva C/R, ids, contexto y lector estricto',()=>{
 const text=bytes(documentoDirecto()),r=importarV0(text);expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));
 expect(r.modelo.enlaces).toEqual({c:{id:'c',tipo:'consumo',objeto:'o-1',proceso:'p-2',estado:'s-6',control:'c'},r:{id:'r',tipo:'resultado',objeto:'o-1',proceso:'p-2',estado:'s-7'}});
 expect(validarForma(r.modelo)).toEqual([]);expect(informeVacio(r.informe)).toBe(true);expect(exportarV0(r.modelo)).toBe(text);expect(leerCanonico(text).ok).toBe(true);
 expect(r.informe.ignorado['opds.opd-1.enlaces.ae-opd-1-r.id']).toBe(1);
});
test('T-196 reconocimiento previo: reformat y bytes sin LF siguen fusión ordinaria',()=>{
 const d=documentoDirecto();for(const text of [JSON.stringify(d),bytes(d).trimEnd(),bytes(d)+' ',JSON.stringify(d,null,4)+'\n']){fusionLegado(text);expect(leerCanonico(text).ok).toBe(false);}
});
test('T-196 reconocimiento previo: registro y recovery con payload exacto siguen legacy',()=>{
 const text=bytes(documentoDirecto());const registro=fusionLegado(JSON.stringify({json:text,carpetaId:'carpeta'}));expect(registro.informe.ignorado.carpetaId).toBe(1);
 const recovery=fusionLegado(JSON.stringify({format:'opforja.local-recovery.v1',document:{snapshotJson:text,conflicts:[{snapshotJson:'{}'}]}}));expect(recovery.informe.descartado.some(e=>e.ruta==='document.conflicts')).toBe(true);
});
test('T-196 reconocimiento previo: portátil con checksum real y payload exacto sigue legacy',async()=>{
 const payload=JSON.stringify({manifest:{selectedRevisionId:'r1'},profile:{id:'deep-opm-pro.modelo',version:'deep-opm-pro.modelo.v0'},revisions:[{id:'r1',modelJson:bytes(documentoDirecto())}],sources:{included:[],omitted:[]}});
 const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload))),n=>n.toString(16).padStart(2,'0')).join('');
 expect(await revision(payload)).toBe(digest);fusionLegado(JSON.stringify({format:'opforja.portable-package',version:1,payload,integrity:{algorithm:'SHA-256',payloadDigest:digest}}));
});
test('T-196 reconocimiento previo: no ocultar pérdidas al preservar semántica de la fuente',()=>{
 const d=documentoDirecto();d.modelo.misterio={valor:'original'};d.modelo.entidades['p-2'].duracion={min:-1,unidad:'hour'};
 const r=fusionLegado(bytes(d));expect(r.informe.descartado.map(e=>e.ruta)).toEqual(['entidades.p-2.duracion','misterio.valor']);expect(r.informe.descartado[1]?.mensaje).toContain('original');expect(leerCanonico(bytes(d)).ok).toBe(false);
});
test('T-196 reconocimiento previo: referencias rotas rechazan sin esconder evidencia',()=>{
 const d=documentoDirecto();d.modelo.enlaces.c.origenId.id='ausente';const r=importarV0(bytes(d));expect(r.ok).toBe(false);expect(r.informe.rechazos.map(e=>e.ruta)).toEqual(['enlaces.c.origenId']);expect(leerCanonico(bytes(d)).ok).toBe(false);
});
test('T-196 reconocimiento previo: diff de visibilidad impide excepción y permanece informado',()=>{
 const d=documentoDirecto();d.modelo.opds['opd-1'].enlaces={};const r=fusionLegado(bytes(d));expect(r.informe.visibilidad.map(v=>({opd:v.opd,aparecen:v.aparecen.map(e=>e.enlace),desaparecen:v.desaparecen.map(e=>e.enlace)}))).toEqual([{opd:'opd-1',aparecen:['c'],desaparecen:[]}]);expect(leerCanonico(bytes(d)).ok).toBe(false);
});
