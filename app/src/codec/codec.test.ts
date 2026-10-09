import { expect, test } from 'bun:test';
import { importarV0 } from './importar';
import { informeVacio } from './informe';
import { revision, resumen, ID_MODELO } from './canonico';
import { leerCanonico } from './canonico';
import { exportarV0 } from './exportar';
import { validarForma } from '../nucleo/forma';
import { documento, entidad, enlace, extremo, refinado, apariencia } from './pruebas';
import type { Raw } from './pruebas';
const leer = (d: Raw) => importarV0(JSON.stringify(d));
function ok(d: Raw) { const r = leer(d); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe)); expect(validarForma(r.modelo)).toEqual([]); return r; }
function estado(id: string, entidadId = 'o-1', extra: Raw = {}) { return { id, entidadId, nombre: id, ...extra }; }
const basico = () => documento([entidad('o-1'), entidad('p-2', 'proceso')]);
test('T-287 API total: JSON inválido y formato desconocido rechazan sin lanzar', () => {
  for (const s of ['', '{', 'null', '[]', '{"formato":"otro","modelo":{}}']) { let r; expect(() => { r = importarV0(s); }).not.toThrow(); expect(r!.ok).toBe(false); expect(r!.informe.rechazos.length).toBeGreaterThan(0); }
});
test('T-287 etapa 1: v0, registro y recovery usan snapshot vigente y declaran ramas', () => {
  const d = basico(), a = ok(d), b = ok({ json: JSON.stringify(d), carpetaId: 'folder' });
  expect(a.modelo).toEqual(b.modelo);
  const c = ok({ format: 'opforja.local-recovery.v1', document: { snapshotJson: JSON.stringify(d), conflicts: [{ snapshotJson: '{}' }, { snapshotJson: '{}' }] } });
  expect(c.modelo).toEqual(a.modelo); expect(c.informe.descartado.some(e => e.ruta.includes('conflicts') && e.mensaje.includes('2'))).toBe(true);
});
test('T-287 etapa 1: portátil multirevisión checksum UTF8 real y selección explícita', async () => {
  const d = basico(); d.modelo.nombre = 'Revisión á Ñ';
  const payload = JSON.stringify({ manifest: { selectedRevisionId: 'r2' }, profile: { id: 'deep-opm-pro.modelo', version: 'deep-opm-pro.modelo.v0' }, revisions: [{ id: 'r1', modelJson: JSON.stringify(documento()) }, { id: 'r2', modelJson: JSON.stringify(d) }], sources: { included: [{ content: 'fuente' }], omitted: [{ reason: 'omitida' }] } });
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))), x => x.toString(16).padStart(2, '0')).join('');
  const p = { format: 'opforja.portable-package', version: 1, payload, integrity: { algorithm: 'SHA-256', payloadDigest: digest } };
  expect(ok(p).modelo.nombre).toBe('Revisión á Ñ'); expect(ok(p).informe.descartado.length).toBeGreaterThanOrEqual(2);
  for (const q of [{ ...p, payload: payload + ' ' }, { ...p, version: 2 }, { ...p, integrity: { ...p.integrity, algorithm: 'otro' } }]) expect(leer(q).ok).toBe(false);
  for (const manifest of [{ selectedRevisionId: 'missing' }, {}]) { const v = JSON.stringify({ ...JSON.parse(payload), manifest }); const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v))), x => x.toString(16).padStart(2, '0')).join(''); expect(leer({ ...p, payload: v, integrity: { ...p.integrity, payloadDigest: hash } }).ok).toBe(false); }
});
test('T-287 etapa 2: arrays, colecciones ausentes y alias apariciones', () => {
  const d = basico(); for (const k of ['entidades', 'estados', 'enlaces', 'abanicos', 'opds']) d.modelo[k] = Object.values(d.modelo[k]);
  d.modelo.opds[0].apariciones = d.modelo.opds[0].apariencias; delete d.modelo.opds[0].apariencias;
  expect(Object.keys(ok(d).modelo.cosas)).toEqual(['o-1', 'p-2']);
  const e = documento(); delete e.modelo.entidades; delete e.modelo.estados; delete e.modelo.enlaces; delete e.modelo.abanicos; expect(ok(e).modelo.cosas).toEqual({});
});
test('T-287 etapa 2: ambigüedad intracolectiva rechaza, colisión entre colecciones remapea referencias', () => {
  const d = basico(); d.modelo.entidades = [entidad('o-1'), entidad('o-1')]; expect(leer(d).ok).toBe(false);
  const e = basico(); e.modelo.entidades['o-1'].id = 'otro'; expect(leer(e).ok).toBe(false);
  const f = basico(); f.modelo.estados['o-1'] = estado('o-1'); f.modelo.enlaces['o-1'] = enlace('o-1', 'consumo', 'o-1', 'p-2', { origenId: extremo('o-1', 'estado') });
  f.modelo.opds['opd-1'].enlaces = { a: { id: 'a', enlaceId: 'o-1', opdId: 'opd-1' } };
  const r = ok(f); const o = r.modelo.cosas['o-1']; expect(o?.tipo).toBe('objeto'); if (o?.tipo !== 'objeto') throw Error('objeto');
  expect(o.estados[0]!.id).not.toBe('o-1'); expect(Object.values(r.modelo.enlaces)[0]).toMatchObject({ objeto: 'o-1', estado: o.estados[0]!.id });
});
test('T-287 etapa 3: acumula referencias rotas con ruta sin fabricar entidades', () => {
  const d = basico(); d.modelo.estados = { s: estado('s', 'missing') }; d.modelo.enlaces = { e: enlace('e', 'efecto', 'missing', 'p-2', { estadoEntradaId: 'other' }) }; d.modelo.opds['opd-1'].apariencias.bad = apariencia('not-there');
  const r = leer(d); expect(r.ok).toBe(false); expect(r.informe.rechazos.length).toBeGreaterThanOrEqual(4); expect(r.informe.rechazos.map(e => e.ruta)).toEqual(expect.arrayContaining(['estados.s.entidadId', 'enlaces.e.origenId', 'enlaces.e.estadoEntradaId', 'opds.opd-1.apariencias.bad.entidadId']));
});
test('T-287 T-012 etapa 4: tipo inválido rechaza; default y nombre NFC sin recortar', () => {
  for (const tipo of [undefined, 'otro']) { const d = basico(); d.modelo.entidades['o-1'].tipo = tipo; expect(leer(d).ok).toBe(false); }
  const d = basico(); d.modelo.entidades['o-1'].nombre = ' a\u0301  '; delete d.modelo.entidades['o-1'].esencia; d.modelo.entidades['o-1'].afiliacion = 'incorrecta';
  const r = ok(d); expect(r.modelo.cosas['o-1']!.nombre).toBe(' á  '); expect(r.modelo.cosas['o-1']!.esencia).toBe('informacional'); expect(r.informe.descartado.some(e => e.ruta.endsWith('afiliacion') && e.mensaje.includes('incorrecta'))).toBe(true);
});
test('T-020 etapa 4: valorSlot sin exhibidor se declara perdido, rasgo conserva texto', () => {
  const d = basico(); d.modelo.entidades['o-1'].valorSlot = { tipo: 'number', valor: 12 };
  const r = ok(d); expect('valor' in r.modelo.cosas['o-1']!).toBe(false); expect(r.informe.descartado.some(e => e.ruta.endsWith('valorSlot.tipo'))).toBe(true);
  d.modelo.enlaces.e = enlace('e', 'exhibicion', 'p-2', 'o-1'); expect(ok(d).modelo.cosas['o-1']).toMatchObject({ valor: '12' });
});
test('T-021 etapa 4: duración válida conservada e inválida declarada', () => {
  const d = basico(); d.modelo.entidades['p-2'].duracion = { min: 1, esperada: 2, max: 3, unidad: 'hour' }; expect(ok(d).modelo.cosas['p-2']).toMatchObject({ duracion: { min: 1, esperada: 2, max: 3, unidad: 'hour' } });
  d.modelo.entidades['p-2'].duracion.min = 4; const r = ok(d); expect('duracion' in r.modelo.cosas['p-2']!).toBe(false); expect(r.informe.descartado.some(e => e.ruta.endsWith('duracion'))).toBe(true);
});
test('T-015 etapa 5: orden, unión designaciones, un estado y default/current únicos', () => {
  const d = basico(); d.modelo.estados = { 's-12': estado('s-12', 'o-1', { orden: 1, designaciones: ['default', 'current', 'final'] }), 's-11': estado('s-11', 'o-1', { orden: 0, designaciones: ['default', 'current', 'inicial'], esInicial: true, suprimido: true }) };
  const r = ok(d), o = r.modelo.cosas['o-1']; if (o?.tipo !== 'objeto') throw Error('objeto'); expect(o.estados.map(s => s.id)).toEqual(['s-11', 's-12']); expect(o.porDefecto).toBe('s-11'); expect(o.current).toBe('s-11'); expect(o.estados[0]).toMatchObject({ inicial: true, suprimido: true }); expect(r.informe.descartado.length).toBeGreaterThanOrEqual(2);
  d.modelo.estados = { 's-11': estado('s-11') }; expect(ok(d).modelo.cosas['o-1']).toMatchObject({ estados: [{ id: 's-11', nombre: 's-11' }] });
});
test('T-059 etapa 5: estado de proceso perdido y anclaje retirado conserva enlace', () => {
  const d = basico(); d.modelo.estados.s = estado('s', 'p-2'); d.modelo.enlaces.e = enlace('e', 'invocacion', 'p-2', 'p-2', { origenId: extremo('s', 'estado') });
  const r = ok(d); expect(r.modelo.enlaces.e).toEqual({ id: 'e', tipo: 'invocacion', origen: 'p-2', destino: 'p-2' }); expect(r.informe.descartado.some(e => e.ruta.includes('origenId'))).toBe(true);
});
test('T-029 etapa 6: refinamiento legacy normalizado; descomposición objeto a despliegue sin crear enlaces', () => {
  const d = refinado(); d.modelo.entidades['p-2'].refinamiento = { tipo: 'descomposicion', opdId: 'opd-3' }; delete d.modelo.entidades['p-2'].refinamientos;
  expect(ok(d).modelo.opds['opd-3']).toMatchObject({ tipo: 'descomposicion', bandas: [['p-4'], ['p-5']] });
  const e = refinado(); e.modelo.entidades['p-2'].tipo = 'objeto'; const r = ok(e); expect(r.modelo.opds['opd-3']).toMatchObject({ tipo: 'despliegue', modo: 'agregacion' }); expect(r.modelo.enlaces).toEqual({});
});
test('T-029 etapa 6: boceto/vista/huérfano pierden OPD pero conservan cosas', () => {
  for (const extra of [{ padreId: null }, { vista: { tipo: 'otro' } }, { padreId: 'opd-1' }]) { const d = basico(); d.modelo.opds.draft = { id: 'draft', nombre: 'Boceto', apariencias: { a: apariencia('o-1', 'draft') }, enlaces: {}, ...extra }; const r = ok(d); expect(r.modelo.opds.draft).toBeUndefined(); expect(r.modelo.cosas['o-1']).toBeDefined(); expect(r.informe.descartado.some(e => e.ruta === 'opds.draft')).toBe(true); }
});
test('T-029 etapa 6: padre roto se normaliza y aparición de padre se coloca', () => {
  const d = refinado(); d.modelo.opds['opd-3'].padreId = 'missing'; delete d.modelo.opds['opd-1'].apariencias['a-opd-1-p-2'];
  const r = ok(d); expect(r.modelo.opds['opd-3']).toMatchObject({ padre: 'opd-1' }); expect(r.modelo.opds['opd-1']!.apariciones['p-2']).toBeDefined();
});
test('T-030 etapa 6: bandas geométricas toleran 4px; duplicada menor id, coordenadas y ocultos propios', () => {
  const d = refinado(); delete d.modelo.opds['opd-3'].ordenInzoom; const a = d.modelo.opds['opd-3'].apariencias; a['a-opd-3-p-4'].y = 100; a['a-opd-3-p-5'].y = 104;
  a['a-opd-3-o-1'].x = 0.6; a['a-opd-3-o-1'].width = 10; a.duplicate = { ...a['a-opd-3-o-1'], id: 'z-last', x: 90 }; const r = ok(d); expect(r.modelo.opds['opd-3']).toMatchObject({ bandas: [['p-4', 'p-5']] }); expect(r.modelo.opds['opd-3']!.apariciones['o-1']).toMatchObject({ x: 1, ancho: 135, alto: 60 });
});
test('T-287 etapa 7: firmas ilegales y NO descartan enlace, no documento', () => {
  for (const e of [enlace('e', 'consumo', 'p-2', 'o-1'), enlace('e', 'agregacion', 'o-1', 'o-1'), enlace('e', 'instrumento', 'o-1', 'p-2', { modificador: 'no' })]) { const d = basico(); d.modelo.enlaces.e = e; const r = ok(d); expect(r.modelo.enlaces.e).toBeUndefined(); expect(r.informe.descartado.some(x => x.ruta === 'enlaces.e')).toBe(true); }
});
for (const [origen, destino, entrada, salida] of [
  ['p-2', 'o-1', 's-3', 's-4'], ['o-1', 'p-2', undefined, undefined], ['s-3', 'p-2', 's-3', undefined], ['p-2', 's-4', undefined, 's-4'],
] as const) test(`T-032 etapa 7: efecto ${origen}→${destino} conserva hechos`, () => {
  const d = documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('e', 'efecto', origen, destino, { origenId: extremo(origen, origen.startsWith('s') ? 'estado' : 'entidad'), destinoId: extremo(destino, destino.startsWith('s') ? 'estado' : 'entidad'), ...(origen === 'p-2' && destino === 'o-1' ? { estadoEntradaId: entrada, estadoSalidaId: salida } : {}) })], [estado('s-3'), estado('s-4')]);
  expect(ok(d).modelo.enlaces.e).toEqual({ id: 'e', tipo: 'efecto', objeto: 'o-1', proceso: 'p-2', ...(entrada ? { entrada } : {}), ...(salida ? { salida } : {}) });
});
test('T-032 etapa 7: par real sin modo y procesos diferentes, standalone explícito protegido', () => {
  const d = refinado([enlace('in', 'efecto', 'p-4', 'o-1', { estadoEntradaId: 's-6', efectoEscindido: { grupoId: 'g', rol: 'entrada', enlacePadreId: 'in' } }), enlace('out', 'efecto', 'p-5', 'o-1', { estadoSalidaId: 's-7', efectoEscindido: { grupoId: 'g', rol: 'salida', enlacePadreId: 'in' } })]); d.modelo.estados = { 's-6': estado('s-6'), 's-7': estado('s-7') };
  expect(ok(d).modelo.enlaces.in).toMatchObject({ escision: { par: 'out', mitad: 'entrada' } });
  d.modelo.enlaces.in.efectoEscindido.modo = 'standalone'; const r = ok(d); expect('escision' in r.modelo.enlaces.in!).toBe(false); expect('escision' in r.modelo.enlaces.out!).toBe(false);
});
test('T-032 etapa 7: consumo+resultado con estados fusionan TS3; ruta/mult/fan bloquean sin borrar', () => {
  const make = () => documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('c', 'consumo', 's-3', 'p-2', { origenId: extremo('s-3', 'estado'), modificador: 'condicion' }), enlace('r', 'resultado', 'p-2', 's-4', { destinoId: extremo('s-4', 'estado') })], [estado('s-3'), estado('s-4')]);
  expect(ok(make()).modelo.enlaces).toEqual({ c: { id: 'c', tipo: 'efecto', objeto: 'o-1', proceso: 'p-2', entrada: 's-3', salida: 's-4', control: 'c' } });
  for (const [k, v] of [['rutaEtiqueta', 'L1'], ['multiplicidadOrigen', '+']]) { const d = make(); d.modelo.enlaces.c[k!] = v; expect(Object.keys(ok(d).modelo.enlaces)).toEqual(['c', 'r']); }
});
test('T-050 etapa 7: bidireccional igual→recíproco; etiqueta vacía divide; anclajes mínimos', () => {
  const d = documento([entidad('o-1'), entidad('o-2')], [enlace('e', 'etiquetadoBidireccional', 'o-1', 'o-2', { etiqueta: 'une', backwardTag: 'une' })]); expect(ok(d).modelo.enlaces.e).toMatchObject({ tipo: 'reciproco', etiqueta: 'une' });
  d.modelo.enlaces.e.backwardTag = ''; expect(Object.values(ok(d).modelo.enlaces).map(e => e.tipo)).toEqual(['etiquetado', 'etiquetado']);
  d.modelo.estados.s = estado('s'); d.modelo.enlaces.e = enlace('e', 'etiquetadoBidireccional', 's', 'o-2', { origenId: extremo('s', 'estado') }); const r = ok(d); expect(r.modelo.enlaces.e).toEqual({ id: 'e', tipo: 'reciproco', origen: 'o-1', destino: 'o-2' }); expect(r.informe.descartado.some(e => e.ruta === 'enlaces.e.estados' && e.regla === 'reglas §4.10')).toBe(true);
});
test('T-050 R-STRE-1 legado se informa y solo documento canónico exacto evita repetición', () => {
  const d=documento([entidad('o-1'),entidad('o-2')],[enlace('e','etiquetadoBidireccional','o-1','o-2',{etiqueta:'une',backwardTag:'une'})]);
  const r=ok(d);expect(r.informe.normalizado.some(e=>e.regla==='R-STRE-1')).toBe(true);
  const a=exportarV0(r.modelo), canon=importarV0(a);expect(canon.ok).toBe(true);expect(informeVacio(canon.informe)).toBe(true);expect(leerCanonico(a).ok).toBe(true);
  const pretty=JSON.stringify(JSON.parse(a));expect(importarV0(pretty).informe.normalizado.some(e=>e.regla==='R-STRE-1')).toBe(true);expect(leerCanonico(pretty).ok).toBe(false);
  expect(ok({json:a}).informe.normalizado.some(e=>e.regla==='R-STRE-1')).toBe(true);
});
test('T-057 etapa 7: multiplicidad equivalentes y campos ilegales con pérdida declarada', () => {
  for (const [legacy, mult] of [['?', '?'], ['0..1', '?'], ['*', '*'], ['0..N', '*'], ['+', '+'], ['1..N', '+'], ['1', undefined], ['1..1', undefined], ['2', '2'], ['12', '12'], ['3..3', '3'], ['2..*', '2..*'], ['2..N', '2..*'], ['0', undefined], ['2..5', undefined]]) { const d = basico(); d.modelo.enlaces.e = enlace('e', 'consumo', 'o-1', 'p-2', { multiplicidadOrigen: legacy }); expect(ok(d).modelo.enlaces.e).toMatchObject(mult ? { mult } : { tipo: 'consumo' }); if (!mult) expect('mult' in ok(d).modelo.enlaces.e!).toBe(false); }
  const d = basico(); d.modelo.enlaces.e = enlace('e', 'consumo', 'o-1', 'p-2', { multiplicidadOrigen: '+', modificador: 'condicion' }); expect('mult' in ok(d).modelo.enlaces.e!).toBe(false);
});
test('T-057 T-286 DEC35 enteros largos y su intervalo exacto se importan sin pérdida y quedan en punto fijo', () => {
  for (const valor of ['1000000', '9007199254740993', '123456789012345678901234567890'] as const)
    for (const legacy of [valor, `${valor}..${valor}`]) {
      const d = documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('e', 'consumo', 'o-1', 'p-2', { multiplicidadOrigen: legacy })]);
      const r = ok(d); expect(r.modelo.enlaces.e).toEqual({ id: 'e', tipo: 'consumo', objeto: 'o-1', proceso: 'p-2', mult: valor });
      expect(r.informe.descartado).toEqual([]); expect(r.informe.rechazos).toEqual([]); expect(r.informe.visibilidad).toEqual([]);
      const texto = exportarV0(r.modelo), vuelta = importarV0(texto); expect(vuelta.ok).toBe(true);
      if (!vuelta.ok) throw Error(JSON.stringify(vuelta.informe));
      expect(informeVacio(vuelta.informe)).toBe(true); expect(exportarV0(vuelta.modelo)).toBe(texto); expect(leerCanonico(texto).ok).toBe(true);
    }
});
test('T-057 T-287 DEC35 el número JSON conserva sus cifras originales también dentro de sobres', () => {
  for (const valor of ['1000000', '9007199254740993', '123456789012345678901234567890'] as const)
    for (const [tipo, campo, desde, hasta] of [['consumo', 'multiplicidadOrigen', 'o-1', 'p-2'], ['resultado', 'multiplicidadDestino', 'p-2', 'o-1']] as const) {
      const d = documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('e', tipo, desde, hasta, { [campo]: valor })]);
      const texto = JSON.stringify(d).replace(`${JSON.stringify(campo)}:${JSON.stringify(valor)}`, `${JSON.stringify(campo)}:${valor}`);
      for (const entrada of [texto, JSON.stringify({ json: texto }), JSON.stringify({ format: 'opforja.local-recovery.v1', document: { snapshotJson: texto } })]) {
        const r = importarV0(entrada); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
        expect(r.modelo.enlaces.e).toEqual({ id: 'e', tipo, objeto: 'o-1', proceso: 'p-2', mult: valor });
        expect(r.informe.descartado).toEqual([]); expect(r.informe.rechazos).toEqual([]); expect(r.informe.visibilidad).toEqual([]);
        const canonico = exportarV0(r.modelo); expect(leerCanonico(canonico).ok).toBe(true);
        const vuelta = importarV0(canonico); expect(vuelta.ok).toBe(true); if (vuelta.ok) expect(exportarV0(vuelta.modelo)).toBe(canonico);
      }
    }
});
test('T-057 T-287 extracción numérica conserva texto y claves escapadas, y rechaza ceros iniciales de JSON inválido', () => {
  const valor = '9007199254740993', d = documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('e', 'consumo', 'o-1', 'p-2', { multiplicidadOrigen: valor })]);
  d.modelo.nombre = `Texto con "multiplicidadOrigen":${valor} y \\ comillas`;
  const texto = JSON.stringify(d).replace(`"multiplicidadOrigen":"${valor}"`, `"multiplicidad\\u004Frigen":${valor}`);
  const r = importarV0(texto); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
  expect(r.modelo.nombre).toBe(d.modelo.nombre); expect(r.modelo.enlaces.e).toMatchObject({ mult: valor }); expect(r.informe.descartado).toEqual([]);
  const invalido = JSON.stringify(d).replace(`"multiplicidadOrigen":"${valor}"`, '"multiplicidadOrigen":03');
  expect(importarV0(invalido).ok).toBe(false);
});
test('T-057 T-287 un decimal JSON no inventa una multiplicidad entera por redondeo', () => {
  for (const valor of ['2.0000000000000001', '9007199254740990.9', '20.0000000000000001e-1', '1.999999999999999999999', '3.3', '3e-1', '-2', '2e99999999'])
    for (const [tipo, campo, desde, hasta] of [['consumo', 'multiplicidadOrigen', 'o-1', 'p-2'], ['resultado', 'multiplicidadDestino', 'p-2', 'o-1']] as const) {
      const d = documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('e', tipo, desde, hasta, { [campo]: valor })]);
      const texto = JSON.stringify(d).replace(`${JSON.stringify(campo)}:${JSON.stringify(valor)}`, `${JSON.stringify(campo)}:${valor}`);
      for (const entrada of [texto, JSON.stringify({ json: texto }), JSON.stringify({ format: 'opforja.local-recovery.v1', document: { snapshotJson: texto } })]) {
        const r = importarV0(entrada); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
        expect(r.modelo.enlaces.e).toEqual({ id: 'e', tipo, objeto: 'o-1', proceso: 'p-2' });
        expect(r.informe.descartado).toHaveLength(1); expect(r.informe.descartado[0]).toMatchObject({ regla: 'DR-21', ruta: `enlaces.e.${campo}` });
        expect(r.informe.descartado[0]!.mensaje).toContain(valor); expect(r.informe.rechazos).toEqual([]); expect(r.informe.visibilidad).toEqual([]);
      }
    }
});
test('T-057 T-287 notaciones numéricas JSON exactamente enteras conservan su equivalencia sin admitirlas como cadenas', () => {
  for (const [valor, mult] of [['2.0', '2'], ['2.0000000000000000', '2'], ['2e0', '2'], ['2E+0', '2'], ['0.2e1', '2'], ['20e-1', '2'], ['3e2', '300'], ['30.00e1', '300'], ['9007199254740991.0', '9007199254740991'], ['9.007199254740991e15', '9007199254740991']] as const) {
    const d = documento([entidad('o-1'), entidad('p-2', 'proceso')], [enlace('e', 'consumo', 'o-1', 'p-2', { multiplicidadOrigen: valor })]);
    const texto = JSON.stringify(d).replace(`"multiplicidadOrigen":"${valor}"`, `"multiplicidadOrigen":${valor}`);
    const r = importarV0(texto); expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
    expect(r.modelo.enlaces.e).toEqual({ id: 'e', tipo: 'consumo', objeto: 'o-1', proceso: 'p-2', mult });
    expect(r.informe.descartado).toEqual([]); expect(r.informe.rechazos).toEqual([]); expect(r.informe.visibilidad).toEqual([]);
    const canonico = exportarV0(r.modelo); expect(leerCanonico(canonico).ok).toBe(true);
    const cadena = ok(d); expect('mult' in cadena.modelo.enlaces.e!).toBe(false); expect(cadena.informe.descartado).toHaveLength(1);
  }
});
test('T-021 etapa 7: cotas fijas convierten exactamente; calendario pierde representación sin equivalencia inventada', () => {
  const d = documento([entidad('p-1', 'proceso'), entidad('p-2', 'proceso')], [enlace('max', 'excepcionSobretiempo', 'p-1', 'p-2', { tiempoMaximo: '2', unidadTiempoMaximo: 'h' }), enlace('min', 'excepcionSubtiempo', 'p-1', 'p-2', { tiempoMinimo: '60', unidadTiempoMinimo: 'min' })]);
  expect(ok(d).modelo.cosas['p-1']).toMatchObject({ duracion: { max: 2, min: 1, unidad: 'hour' } });
  d.modelo.enlaces.min.unidadTiempoMinimo = 'mes'; const r = ok(d); expect(r.modelo.cosas['p-1']).toMatchObject({ duracion: { max: 2, unidad: 'hour' } }); expect(r.informe.descartado.some(e => e.mensaje.includes('60') && e.mensaje.includes('mes') && e.mensaje.includes('representación'))).toBe(true);
});
test('T-287 etapa 9: fan O→OR, mixto cargable y no ofrecido mínimo', () => {
  const d = documento([entidad('o-1'), entidad('p-2', 'proceso'), entidad('p-3', 'proceso')], [enlace('a', 'consumo', 'o-1', 'p-2'), enlace('b', 'resultado', 'p-3', 'o-1')]); d.modelo.abanicos.f = { id: 'f', operador: 'O', enlaceIds: ['a', 'b'], opdId: 'opd-1' }; expect(ok(d).modelo.abanicos.f).toEqual({ id: 'f', operador: 'OR', enlaces: ['a', 'b'] });
  d.modelo.enlaces.a.tipo = 'instrumento'; d.modelo.enlaces.a.modificador = 'evento'; d.modelo.enlaces.b = enlace('b', 'instrumento', 'o-1', 'p-3', { modificador: 'evento' }); const r = ok(d); expect(r.modelo.abanicos.f).toBeUndefined(); expect(Object.keys(r.modelo.enlaces)).toHaveLength(2);
});
test('T-006 etapa 10: 14 extensiones, ignorados y desconocidos anidados exhaustivos', () => {
  const d = basico(); const keys = ['ontologia', 'satisfaccionesRequisito', 'declaracionesNoNucleares', 'familiasEfectosPreestado', 'anclasNormativas', 'notasMesa', 'mesaExploracion', 'estereotipos', 'procedencia', 'fichaTrabajo', 'lentesConocimiento', 'submodelos', 'pieceLineage', 'referenciaPadreSubmodelo']; keys.forEach(k => d.modelo[k] = [{ dato: 1 }]); d.modelo.archivado = true; d.modelo.entidades['o-1'].novedad = { nested: 1 }; d.modelo.opds['opd-1'].apariencias['a-opd-1-o-1'].contextoRefinamiento = { desconocido: 'x' };
  const r = ok(d); expect(keys.every(k => r.informe.descartado.some(e => e.ruta === k && e.mensaje.includes('1')))).toBe(true); expect(r.informe.ignorado.archivado).toBe(1); expect(r.informe.descartado.some(e => e.ruta === 'entidades.o-1.novedad.nested')).toBe(true);
  expect(new Set(r.informe.descartado.map(e => e.ruta)).size).toBe(r.informe.descartado.length);
});
test('T-287 etapa 11: entradas usuario no causan cierre residual; forma vacía en positivos', () => {
  for (const extra of [{ unidadTiempo: '???' }, { nextSeq: -1 }, { nextSeq: 1.5 }]) { const d = basico(); Object.assign(d.modelo, extra); const r = ok(d); expect(r.modelo.secuencia).toBeGreaterThan(2); }
});
test('T-196 Informe, resumen y revisión hash de bytes sin canonicalizar', async () => {
  const i = { normalizado: [], descartado: [], rechazos: [], visibilidad: [], ignorado: { visual: 2 } }; expect(informeVacio(i)).toBe(true); expect(informeVacio({ ...i, normalizado: [{ ruta: 'x', mensaje: 'x' }] })).toBe(false);
  expect(resumen(ok(basico()).modelo)).toEqual({ nombre: 'Códec', cosas: 2, opds: 1 });
  expect(await revision('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  expect(await revision('á\n')).not.toBe(await revision('á')); expect(ID_MODELO.test('../bad')).toBe(false); expect(ID_MODELO.test('m-good_1')).toBe(true);
});
