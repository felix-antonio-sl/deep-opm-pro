import { expect, test } from 'bun:test';
import { importarV0 } from './importar';
import { exportarV0 } from './exportar';
import { leerCanonico } from './canonico';
import { informeVacio } from './informe';
import { validarForma } from '../nucleo/forma';
import { azar } from '../pruebas/azar';
import { readdirSync, readFileSync } from 'node:fs';
import type { Modelo } from '../nucleo/tipos';
const dir = new URL('../../fixtures/v0/', import.meta.url);
export function fijo(m: Modelo) { const antes = JSON.stringify(m), a = exportarV0(m); expect(exportarV0(m)).toBe(a); expect(JSON.stringify(m)).toBe(antes); expect(a.endsWith('\n')).toBe(true); const r = importarV0(a); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe)); expect(validarForma(r.modelo)).toEqual([]); expect(r.informe).toMatchObject({ normalizado: [], descartado: [], rechazos: [], visibilidad: [] }); expect(informeVacio(r.informe)).toBe(true); expect(exportarV0(r.modelo)).toBe(a); expect(leerCanonico(a).ok).toBe(true); expect(leerCanonico(JSON.stringify(JSON.parse(a))).ok).toBe(false); }
for (const name of readdirSync(dir).filter(n => n.endsWith('.json'))) test(`T-286 punto fijo fixture ${name}`, () => { const r = importarV0(readFileSync(new URL(name, dir), 'utf8')); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe)); fijo(r.modelo); });
// Conteos literales del JSON recibido: solo se retiran las 9/14 copias derivadas.
// Meta pierde dos etiquetas no etiquetadas, conserva los 24 hechos y sus identidades.
const cuentas=[
 ['Modelo_Vacio.json',0,0,0,1,[]],
 ['OPM_Structure_Meta_Model.json',25,0,24,4,['enlaces.e-33.etiqueta','enlaces.e-49.etiqueta']],
 ['OnStar_System.json',15,4,20,2,[]],
 ['SD_Async.json',14,2,18,2,[]], // DEC33: cinco enlaces repetidos idénticos se funden sin pérdida
 ['SD_Sync.json',15,2,19,2,[]],
 ['System_Diagram.json',8,2,8,1,[]],
 ['sintetico.json',11,9,6,1,[]],
] as const;
for(const [nombre,cosas,estados,enlaces,opds,perdidas] of cuentas)test(`T-286 conteos y pérdidas literales ${nombre}`,()=>{
 const r=importarV0(readFileSync(new URL(nombre,dir),'utf8'));expect(r.ok).toBe(true);if(!r.ok)throw Error(JSON.stringify(r.informe));expect([Object.keys(r.modelo.cosas).length,Object.values(r.modelo.cosas).flatMap(c=>c.tipo==='objeto'?c.estados:[]).length,Object.keys(r.modelo.enlaces).length,Object.keys(r.modelo.opds).length,Object.keys(r.modelo.abanicos).length]).toEqual([cosas,estados,enlaces,opds,0]);expect(r.informe.descartado.map(e=>e.ruta)).toEqual([...perdidas]);
});
test('T-196 punto fijo y pureza 200 semillas reales', () => { for (let i = 1; i <= 200; i++) fijo(azar(i, i % 2 ? 'estricto' : 'completo')); });
import { modeloCon } from '../pruebas/constructores';
test('T-286 DEC35 punto fijo con el entero exacto y 2..* en procedimental, agregación y etiquetado', () => {
    const b = modeloCon({ objetos: [['Pieza', []], ['Conjunto', []], ['Cosa', []], ['Fábrica', []], ['Planta', []]], procesos: ['Fabricar'], enlaces: [['resultado', 'Pieza', 'Fabricar'], ['agregacion', 'Conjunto', 'Cosa'], ['etiquetado', 'Fábrica', 'Planta']] });
    const [r, ag, et] = Object.values(b.enlaces) as [Extract<Modelo['enlaces'][string], { tipo: 'resultado' }>, Extract<Modelo['enlaces'][string], { tipo: 'agregacion' }>, Extract<Modelo['enlaces'][string], { tipo: 'etiquetado' }>];
    const m: Modelo = { ...b, enlaces: { [r.id]: { ...r, mult: '3' }, [ag.id]: { ...ag, mult: '2..*' }, [et.id]: { ...et, etiqueta: 'comprende', multOrigen: '2..*', multDestino: '12' } } };
    fijo(m);
    expect(importarV0(exportarV0(m))).toMatchObject({ ok: true, modelo: { enlaces: m.enlaces } });
});
