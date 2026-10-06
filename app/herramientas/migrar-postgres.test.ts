import { afterEach, expect, test } from 'bun:test';
import { mkdtemp, mkdir, readdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { documento, entidad, enlace, apariencia, refinado } from '../src/codec/pruebas';
import { importarV0 } from '../src/codec/importar';
import { leerCanonico, ID_MODELO } from '../src/codec/canonico';
import { exportarV0 } from '../src/codec/exportar';
import { modeloCon } from '../src/pruebas/constructores';
import type { FuenteLegada, FilaModeloLegada } from './migrar-postgres';
const api = await import('./migrar-postgres').catch(() => null);
const dirs: string[] = [];
const hash = 'scrypt$16384$8$1$X4SjTVHnKHoxcZYA7vLQjA$s_YgLWfNWaoyEzhJYpjkWMOUH6z6DSC4kFGXkxbxmLd_H6WgAQCcB9vHnD53Rp9ux6Ppl2zoq8CptXel4X31Ew';
const cuenta = { id: 'cuenta-sintetica', email: 'operador@example.test', password_hash: hash };
const fecha = '2026-01-10T12:00:00.000Z';
const ahora = () => Date.parse(fecha);
afterEach(async () => { await Promise.all(dirs.splice(0).map(d => rm(d, { recursive: true, force: true }))); });
async function temporal() { const d = await mkdtemp(join(tmpdir(), 'opforja-migracion-prueba-')); dirs.push(d); return d; }
async function arbol(d: string): Promise<Record<string, string>> {
    const r: Record<string, string> = {};
    async function visitar(p: string) {
        for (const e of await readdir(p, { withFileTypes: true })) {
            const archivo = join(p, e.name);
            if (e.isDirectory()) await visitar(archivo); else r[relative(d, archivo)] = await readFile(archivo, 'utf8');
        }
    }
    await visitar(d); return r;
}
const payload = () => JSON.stringify(documento([entidad('o-1', 'objeto', { nombre: 'Pedido' }), entidad('p-2', 'proceso', { nombre: 'Procesar' })], [enlace('e-3', 'consumo', 'o-1', 'p-2')]));
function fila(id: string, texto = payload(), tenant = 'tenant-A'): FilaModeloLegada {
    return { tenant_id: tenant, id, nombre: `Modelo ${id}`, carpeta_id: null, actualizado_en: '2026-01-01T00:00:00.000Z', archivado: false, revision: 4, payload: texto };
}
function fuente(modelos: readonly FilaModeloLegada[] = [fila('guardado')]): FuenteLegada {
    return { cuentas: async () => [cuenta], tenants: async () => ['tenant-A', 'tenant-B'],
        indices: async () => [{ tenant_id: 'tenant-A', indice: { modelos: [], carpetas: [] } }],
        modelos: async () => modelos, autosaves: async () => [], versiones: async () => [] };
}
async function migrar(f: FuenteLegada, datos: string, extra: Record<string, unknown> = {}) {
    expect(api?.migrar).toBeFunction(); return api!.migrar(f, { datos, ahora, ...extra });
}

test('T-287 WP-12 ocho categorías/nueve filas conservan fuente, versiones, tenants, informes y papelera', async () => {
    const d = await temporal(), base = payload(), nuevo = JSON.stringify(JSON.parse(base), null, 2);
    const boceto = JSON.parse(base); boceto.modelo.opds.boceto = { id: 'boceto', nombre: 'Boceto', padreId: null, apariencias: { a: apariencia('o-1', 'boceto') }, enlaces: {} };
    const carpeta = JSON.parse(base); carpeta.carpetaId = 'carpeta-payload';
    const familia = JSON.parse(base); familia.modelo.familiasEfectosPreestado = [{ dato: 'conservar-original' }];
    const cotas = documento([entidad('p-1', 'proceso', { nombre: 'Preparar' }), entidad('p-2', 'proceso', { nombre: 'Recuperar' })],
        [enlace('max', 'excepcionSobretiempo', 'p-1', 'p-2', { tiempoMaximo: '2', unidadTiempoMaximo: 'h' }), enlace('min', 'excepcionSubtiempo', 'p-1', 'p-2', { tiempoMinimo: '60', unidadTiempoMinimo: 'min' })]);
    const modelos = [fila('autosave', base), { ...fila('archivado'), archivado: true }, fila('boceto', JSON.stringify(boceto)),
        fila('invalido', '{ bytes inválidos sin reformatear'), { ...fila('carpeta', JSON.stringify(carpeta)), carpeta_id: 'carpeta-columna' },
        fila('familias', JSON.stringify(familia)), fila('cotas', JSON.stringify(cotas)), fila('duplicado', base, 'tenant-A'), fila('duplicado', nuevo, 'tenant-B')];
    const originales = JSON.stringify(modelos), f = fuente(modelos);
    f.autosaves = async () => [{ tenant_id: 'tenant-A', modelo_id: 'autosave', creado_en: '2026-01-02T00:00:00.000Z', payload: nuevo }];
    f.versiones = async () => modelos.map(m => ({ tenant_id: m.tenant_id, modelo_id: m.id, id: '../version-original', nombre: 'Versión íntegra', creado_en: fecha, payload: m.payload }));
    f.indices = async () => [{ tenant_id: 'tenant-A', indice: { modelos: [{ id: 'carpeta', carpetaId: 'carpeta-indice', esBiblioteca: true, esApunte: false, archivado: true }], carpetas: [{ id: 'carpeta-indice', nombre: 'Legada' }] } }];
    const r = await migrar(f, d); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    expect(r.modelos).toHaveLength(9); expect(new Set(r.modelos.map(m => m.id)).size).toBe(9);
    const todo = await arbol(d);
    expect(JSON.parse(todo['cuenta.json']!)).toEqual({ email: cuenta.email, hashClave: hash, versionCredencial: 1 });
    expect(r.modelos.filter(m => m.estado === 'modelos')).toHaveLength(7);
    expect(r.modelos.filter(m => m.estado === 'papelera')).toHaveLength(1);
    expect(r.modelos.filter(m => m.estado === 'rechazado')).toHaveLength(1);
    for (const m of r.modelos) {
        const original = modelos.find(x => x.id === m.idOriginal && x.tenant_id === m.tenant)!;
        expect(m.id).toMatch(ID_MODELO); expect(todo[m.originales[0]!]).toBe(original.payload);
        expect(m.versiones).toHaveLength(1); expect(todo[m.versiones[0]!]).toBe(original.payload);
        expect(m.nombre).toBe(original.nombre); expect(todo[m.informeArchivo]).toContain('Visibilidad');
        const esperado = importarV0(m.fuente === 'autosave' ? nuevo : original.payload);
        expect(m.informe).toEqual(esperado.informe);
        if (m.estado !== 'rechazado') {
            const c = leerCanonico(todo[m.archivo!]!); expect(c.ok).toBe(true);
            if (c.ok) { expect(c.valor.id).toBe(m.id); expect(c.valor.nombre).toBe(original.nombre); }
        } else expect(todo[m.archivo!]!).toBe(original.payload);
    }
    expect(r.modelos.find(m => m.idOriginal === 'autosave')!.fuente).toBe('autosave');
    expect(todo[r.modelos.find(m => m.idOriginal === 'autosave')!.originales[1]!]).toBe(nuevo);
    const estado = (id: string) => r.modelos.find(m => m.idOriginal === id)!;
    expect(estado('boceto').informe.descartado.some(e => e.ruta === 'opds.boceto')).toBe(true);
    expect(estado('familias').informe.descartado.some(e => e.ruta === 'familiasEfectosPreestado')).toBe(true);
    const c = leerCanonico(todo[estado('cotas').archivo!]!); expect(c.ok).toBe(true);
    if (c.ok) expect(c.valor.cosas['p-1']).toMatchObject({ duracion: { min: 1, max: 2, unidad: 'hour' } });
    const informe = todo[estado('carpeta').informeArchivo]!;
    for (const x of ['carpeta-columna', 'carpeta-payload', 'carpeta-indice', 'esBiblioteca', 'esApunte', 'archivado']) expect(informe).toContain(x);
    const total = todo[join(r.archivo, 'INFORME.md')]!;
    const bloqueTotal = /```json\n([\s\S]*?)\n```/.exec(total)![1]!;
    expect(JSON.parse(bloqueTotal)).toEqual({filas:9, instalados:7, papelera:1, rechazados:1, fallos:0, versiones:9, autosaves:1});
    for (const m of r.modelos) expect(total).toContain(m.id);
    expect(Object.values(todo).filter((_, i) => Object.keys(todo)[i]?.endsWith('.md')).join('\n')).not.toContain(hash);
    expect(JSON.stringify(modelos)).toBe(originales);
});

for (const [fechaAuto, esperado] of [['2026-01-01T00:00:00.000Z', 'guardado'], ['2025-12-31T23:59:59.999Z', 'guardado'], ['2026-01-01T01:00:00.001+01:00', 'autosave']] as const)
test(`T-287 WP-12 fecha completa, empate/anterior y tenant independiente ${fechaAuto}`, async () => {
    const d = await temporal(), f = fuente([fila('mismo', payload(), 'tenant-A'), fila('mismo', payload(), 'tenant-B')]);
    f.autosaves = async () => [{ tenant_id: 'tenant-A', modelo_id: 'mismo', creado_en: fechaAuto, payload: payload() }];
    const r = await migrar(f, d); expect(r.ok).toBe(true); if (r.ok) {
        expect(r.modelos.find(m => m.tenant === 'tenant-A')?.fuente).toBe(esperado);
        expect(r.modelos.find(m => m.tenant === 'tenant-B')?.fuente).toBe('guardado');
    }
});

test('WP-12 §8.6 cuenta ambigua/ausente y email desconocido no producen archivos ni exponen hash', async () => {
    for (const cuentas of [[], [cuenta, { ...cuenta, id: 'segunda', email: 'otro@example.test' }]]) {
        const d = await temporal(), f = fuente(); f.cuentas = async () => cuentas;
        const r = await migrar(f, d); expect(r.ok).toBe(false); expect(await arbol(d)).toEqual({});
        expect(JSON.stringify(r)).not.toContain(hash);
    }
    const d = await temporal(), f = fuente();
    expect((await migrar(f, d, { email: 'ausente@example.test' })).ok).toBe(false);
    expect(await arbol(d)).toEqual({});
    f.cuentas = async () => [cuenta, { ...cuenta, id: 'segunda', email: 'otro@example.test' }];
    f.tenants = async id => { expect(id).toBe('segunda'); return ['tenant-A']; };
    expect((await migrar(f, d, { email: 'otro@example.test' })).ok).toBe(true);
    expect(JSON.parse(await readFile(join(d, 'cuenta.json'), 'utf8')).email).toBe('otro@example.test');
});

test('T-287 WP-12 tenant ajeno y fechas corruptas rechazan sin contaminar destino', async () => {
    for (const f of [fuente([fila('ajeno', payload(), 'otro-tenant')]), fuente([{ ...fila('fecha'), actualizado_en: 'sin-fecha' }])]) {
        const d = await temporal(); expect((await migrar(f, d)).ok).toBe(false); expect(await arbol(d)).toEqual({});
    }
});

test('T-022 T-287 WP-12 IDs hostiles/colisiones nunca escapan ni sobrescriben', async () => {
    const d = await temporal(), modelos = [fila('../fuera'), fila('..'), fila('a/b'), fila('misma', payload(), 'tenant-A'), fila('misma', payload(), 'tenant-B')];
    const r = await migrar(fuente(modelos), d); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    expect(new Set(r.modelos.map(m => m.id)).size).toBe(5);
    const todo = await arbol(d);
    for (const m of r.modelos) { expect(m.id).toMatch(ID_MODELO); expect(m.archivo).toBe(join('modelos', `${m.id}.json`)); expect(todo[m.originales[0]!]).toBe(modelos.find(x => x.id === m.idOriginal && x.tenant_id === m.tenant)!.payload); }
});

test('T-287 WP-12 ensayo escribe mismos resultados en salida separada y no toca datos; solapes prohibidos', async () => {
    const datos = await temporal(), salida = await temporal(), real = await temporal();
    await writeFile(join(datos, 'intacto.txt'), 'no tocar'); const antes = await arbol(datos);
    const r = await migrar(fuente(), datos, { ensayo: true, salida }), s = await migrar(fuente(), real);
    expect(r.ok).toBe(true); expect(s.ok).toBe(true); expect(await arbol(datos)).toEqual(antes);
    expect(await readFile(join(salida, 'modelos/guardado.json'), 'utf8')).toBe(await readFile(join(real, 'modelos/guardado.json'), 'utf8'));
    for (const destino of [datos, join(datos, 'dentro')]) expect((await migrar(fuente(), datos, { ensayo: true, salida: destino })).ok).toBe(false);
    expect((await migrar(fuente(), datos, { ensayo: true })).ok).toBe(false);
    expect(await arbol(datos)).toEqual(antes);
});

test('T-287 WP-12 destino no vacío exige reemplazar, preserva archivos/cuenta/versiones anteriores', async () => {
    const d = await temporal(); await mkdir(join(d, 'modelos')); await writeFile(join(d, 'modelos/guardado.json'), exportarV0(modeloCon()));
    const antes = await arbol(d); expect((await migrar(fuente(), d)).ok).toBe(false); expect(await arbol(d)).toEqual(antes);
    const r = await migrar(fuente(), d, { reemplazar: true }); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    expect(r.modelos[0]!.id).not.toBe('guardado'); expect((await arbol(d))['modelos/guardado.json']).toBe(antes['modelos/guardado.json']);
    expect((await migrar(fuente(), d, { reemplazar: true })).ok).toBe(true);
    const otro = await temporal(); await writeFile(join(otro, 'cuenta.json'), 'cuenta diferente');
    const original = await arbol(otro); expect((await migrar(fuente(), otro)).ok).toBe(false); expect(await arbol(otro)).toEqual(original);
});

test('T-286 WP-12 verificar relee todos los archivos sin modificar bytes/rutas ni necesitar fuente', async () => {
    const d = await temporal(); await mkdir(join(d, 'modelos'));
    await writeFile(join(d, 'modelos/bueno.json'), exportarV0({ ...modeloCon(), id: 'bueno' }));
    await writeFile(join(d, 'modelos/malo.json'), '{');
    await writeFile(join(d, 'modelos/no-canonico.json'), payload());
    await writeFile(join(d, 'modelos/otro-id.json'), exportarV0({ ...modeloCon(), id: 'incongruente' }));
    const antes = await arbol(d); expect(api?.verificar).toBeFunction(); const r = await api!.verificar(d);
    expect(r.ok).toBe(false); expect(r.errores.map(e => e.archivo).sort()).toEqual(['malo.json', 'no-canonico.json', 'otro-id.json']);
    expect(await arbol(d)).toEqual(antes);
    expect(api?.ejecutarMigracion).toBeFunction(); const mensajes: string[] = [];
    expect(await api!.ejecutarMigracion(['--verificar', '--datos', d], { salida: s => mensajes.push(s) })).toBe(1);
    expect(mensajes.join('\n')).toContain('malo.json'); expect(await arbol(d)).toEqual(antes);
});

test('WP-12 §8.6 fallo de instalación conserva originales/versiones y devuelve fallo recuperable', async () => {
    const d = await temporal();
    const f = fuente(); f.versiones = async () => [{ tenant_id: 'tenant-A', modelo_id: 'guardado', id: 'v-1', nombre: 'Antes', creado_en: fecha, payload: '  bytes versión original  ' }];
    const r = await migrar(f, d, { io: { instalar: async () => { throw Error('fallo sintético de instalación'); } } });
    expect(r.ok).toBe(false); const todo = await arbol(d);
    expect(Object.keys(todo).filter(p => p.startsWith('modelos/'))).toEqual([]);
    expect(Object.values(todo)).toContain(payload()); expect(Object.values(todo)).toContain('  bytes versión original  ');
    expect(Object.entries(todo).filter(([p]) => p.endsWith('INFORME.md'))[0]?.[1]).toContain('fallo');
    const bloqueado = await temporal(); await writeFile(join(bloqueado, 'modelos'), 'no es directorio');
    const s = await migrar(f, bloqueado); expect(s.ok).toBe(false);
    expect((await arbol(bloqueado))['modelos']).toBe('no es directorio');
});

test('WP-12 §8.6 adaptador SQL ejecuta sólo SELECT parametrizados y conserva tenant por fila', async () => {
    expect(api?.fuenteSql).toBeFunction(); const llamadas: { sql: string; params: readonly unknown[] }[] = [];
    const f = api!.fuenteSql(async (sql, params) => { llamadas.push({ sql, params }); return []; });
    await f.cuentas(); await f.tenants('account'); await f.indices(['a', 'b']); await f.modelos(['a', 'b']); await f.autosaves(['a', 'b']); await f.versiones(['a', 'b']);
    expect(llamadas).toHaveLength(6); expect(llamadas.every(x => /^SELECT\b/i.test(x.sql) && !/;|\b(UPDATE|DELETE|INSERT|ALTER|DROP|CREATE)\b/i.test(x.sql))).toBe(true);
    expect(llamadas[1]?.params).toEqual(['account']); for (const c of llamadas.slice(2)) { expect(c.params).toEqual([['a', 'b']]); expect(c.sql).toContain('tenant_id'); }
});

test('WP-12 §8.6 CLI import-safe, guardas y errores no revelan URL/hash', async () => {
    const d = await temporal(), mensajes: string[] = []; expect(api?.ejecutarMigracion).toBeFunction();
    expect(await api!.ejecutarMigracion(['--datos', d], { salida: s => mensajes.push(s) })).toBe(1);
    const f = fuente(); f.cuentas = async () => { throw Error(`postgres://clave-secreta ${hash}`); };
    expect(await api!.ejecutarMigracion(['--url', 'postgres://clave-secreta', '--datos', d], { fuente: f, salida: s => mensajes.push(s) })).toBe(1);
    expect(mensajes.join('\n')).not.toContain('clave-secreta'); expect(mensajes.join('\n')).not.toContain(hash); expect(await arbol(d)).toEqual({});
    expect(await api!.ejecutarMigracion(['--url', 'sintetica', '--datos', d], { fuente: fuente(), salida: s => mensajes.push(s) })).toBe(0);
});


test('WP-12 §8.6 ensayo rechaza también salida ancestro de datos sin escribir', async () => {
    const padre = await temporal(), datos = join(padre, 'instalacion'); await mkdir(datos);
    await writeFile(join(datos, 'intacto'), 'conservar'); const previo = await arbol(padre);
    expect((await migrar(fuente(), datos, { ensayo: true, salida: padre })).ok).toBe(false);
    expect(await arbol(padre)).toEqual(previo);
});

test('WP-12 §8.6 enlace simbólico en archivo/ no redirige ni escribe cuenta', async () => {
    const datos = await temporal(), externo = await temporal(); await writeFile(join(externo, 'intacto'), 'conservar');
    await symlink(externo, join(datos, 'archivo'), 'dir'); const antes = await arbol(externo);
    const r = await migrar(fuente(), datos);
    expect(r.ok).toBe(false); expect(await arbol(externo)).toEqual(antes);
    expect(await readdir(datos)).toEqual(['archivo']);
});

test('T-286 WP-12 verificar no elimina BOM ni sustituye UTF8 corrupto para aceptar archivos', async () => {
    const d = await temporal(); await mkdir(join(d, 'modelos'));
    const canon = exportarV0({ ...modeloCon(), id: 'bom' });
    expect(leerCanonico('\uFEFF' + canon).ok).toBe(false);
    await writeFile(join(d, 'modelos/bom.json'), '\uFEFF' + canon);
    await writeFile(join(d, 'modelos/utf8.json'), new Uint8Array([0x7b, 0xff, 0x7d]));
    const bom = await readFile(join(d, 'modelos/bom.json')), corrupto = await readFile(join(d, 'modelos/utf8.json'));
    const r = await api!.verificar(d); expect(r.ok).toBe(false);
    expect(r.errores.map(x => x.archivo).sort()).toEqual(['bom.json', 'utf8.json']);
    expect(await readFile(join(d, 'modelos/bom.json'))).toEqual(bom);
    expect(await readFile(join(d, 'modelos/utf8.json'))).toEqual(corrupto);
});

for (const [guardado, auto, esperado] of [
    ['2026-01-01T00:00:00.000001Z', '2026-01-01T00:00:00.000002Z', 'autosave'],
    ['2026-01-01T00:00:00.000002Z', '2026-01-01T01:00:00.000001+01:00', 'guardado'],
    ['2026-01-01T00:00:00.000001Z', '2026-01-01 00:00:00.000002+00', 'autosave'],
] as const) test(`T-287 WP-12 precedencia timestamp completa conserva microsegundos ${esperado}`, async () => {
    const d = await temporal(), original = payload(), nuevo = JSON.stringify(JSON.parse(original), null, 2);
    const f = fuente([{ ...fila('precision'), actualizado_en: guardado }]);
    f.autosaves = async () => [{ tenant_id: 'tenant-A', modelo_id: 'precision', creado_en: auto, payload: nuevo }];
    const r = await migrar(f, d); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    expect(r.modelos[0]!.fuente).toBe(esperado); const todo = await arbol(d);
    expect(todo[r.modelos[0]!.originales[0]!]).toBe(original); expect(todo[r.modelos[0]!.originales[1]!]).toBe(nuevo);
});

test('WP-12 §8.6 puente SQL usa TEXT[] explícito y timestamp textual sin precisión perdida', async () => {
    expect(api?.fuenteBunSql).toBeFunction();
    const llamadas: {sql: string; params: readonly unknown[]}[] = [], arrays: {values: readonly string[]; type: string}[] = [];
    const f = api!.fuenteBunSql({ array: (values, type) => { const r = { values, type }; arrays.push(r); return r; },
        unsafe: async (sql, params) => { llamadas.push({sql, params});
            if (sql.includes('FROM opforja_models')) return [{...fila('fecha'), actualizado_en: '2026-01-01T00:00:00.000001Z'}];
            if (sql.includes('FROM opforja_model_autosaves')) return [{tenant_id:'tenant-A', modelo_id:'fecha', creado_en:'2026-01-01T00:00:00.000002Z', payload:payload()}];
            return []; } });
    await f.tenants('account'); await f.indices(['tenant-legacy']);
    const modelos = await f.modelos(['tenant-legacy']), autos = await f.autosaves(['tenant-legacy']); await f.versiones(['tenant-legacy']);
    expect(arrays).toHaveLength(4); expect(arrays.every(x => x.type === 'TEXT' && x.values[0] === 'tenant-legacy')).toBe(true);
    expect(llamadas[0]?.params).toEqual(['account']); expect(llamadas.slice(1).every(x => x.params[0] === arrays[llamadas.indexOf(x)-1])).toBe(true);
    for (const c of llamadas.slice(2)) { expect(c.sql).toContain(c.sql.includes('opforja_models ') ? 'actualizado_en::text AS actualizado_en' : 'creado_en::text AS creado_en'); }
    expect(modelos[0]?.actualizado_en).toBe('2026-01-01T00:00:00.000001Z'); expect(autos[0]?.creado_en).toBe('2026-01-01T00:00:00.000002Z');
});

test('T-287 WP-12 visibilidad no vacía y diagnósticos reales quedan íntegros en informe', async () => {
    const d = await temporal(), v = refinado([enlace('e-sub', 'instrumento', 'o-1', 'p-4')]);
    v.modelo.opds['opd-1'].enlaces = {}; v.modelo.opds['opd-3'].enlaces = {};
    const texto = JSON.stringify(v), f = fuente([fila('visible', texto)]), r = await migrar(f, d);
    expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    expect(r.modelos[0]!.informe.visibilidad).toEqual([{ opd: 'opd-3', etiqueta: 'SD1', aparecen: [{enlace:'e-sub', texto:'instrumento: o-1 → p-4'}], desaparecen:[] }]);
    const informe = await readFile(join(d, r.modelos[0]!.informeArchivo), 'utf8');
    expect(informe).toContain(JSON.stringify(r.modelos[0]!.informe, null, 2));
    expect(informe).toContain(JSON.stringify(r.modelos[0]!.diagnosticos, null, 2)); expect(texto).toBe(JSON.stringify(v));
});


test('T-287 WP-12 originales sin fila de modelo siguen archivados con procedencia, sin instalación ficticia', async () => {
    const d = await temporal(), f = fuente();
    f.autosaves = async () => [{tenant_id:'tenant-B', modelo_id:'ausente', creado_en:fecha, payload:'  autosave sin fila original  '}];
    f.versiones = async () => [{tenant_id:'tenant-B', modelo_id:'ausente', id:'v-original', nombre:'Sin fila', creado_en:fecha, payload:' versión sin fila original '}];
    const r = await migrar(f, d); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    const todo = await arbol(d); expect(Object.values(todo)).toContain('  autosave sin fila original  ');
    expect(Object.values(todo)).toContain(' versión sin fila original '); expect(r.modelos).toHaveLength(1);
    const total = todo[join(r.archivo, 'INFORME.md')]!; expect(total).toContain('ausente'); expect(total).toContain('tenant-B');
    for (const [p, t] of Object.entries(todo).filter(([p]) => /originales|versiones/.test(p))) expect(total).toContain(p.slice(r.archivo.length + 1));
});

test('T-025 T-287 WP-12 nombre no léxico conserva hechos y muestra código/reparación sin corregirlo', async () => {
    const d = await temporal(), texto = JSON.stringify(documento([entidad('o-1', 'objeto', {nombre:'pedido!'}), entidad('p-2', 'proceso', {nombre:'Procesar'})], [enlace('e-3', 'consumo', 'o-1', 'p-2')]));
    const row = Object.freeze(fila('lexico', texto)), filas = Object.freeze([row]);
    const r = await migrar(fuente(filas), d); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.error);
    const m = r.modelos[0]!, c = leerCanonico(await readFile(join(d, m.archivo!), 'utf8')); expect(c.ok).toBe(true);
    if (c.ok) { expect(c.valor.cosas['o-1']?.nombre).toBe('pedido!'); expect(c.valor.enlaces['e-3']).toMatchObject({objeto:'o-1', proceso:'p-2', tipo:'consumo'}); }
    const diagnostico = m.diagnosticos.find(x => x.codigo === 'nombre-fuera-de-lexico');
    expect(diagnostico).toBeDefined(); expect(diagnostico?.reparacion).toMatchObject({op:'renombrarCosa'});
    const informe = await readFile(join(d, m.informeArchivo), 'utf8'); expect(informe).toContain('nombre-fuera-de-lexico'); expect(informe).toContain('renombrarCosa');
    expect(await readFile(join(d, m.originales[0]!), 'utf8')).toBe(texto); expect(row.payload).toBe(texto);
});

test('T-022 T-287 WP-12 ID con sufijo autosave no colisiona con ningún original auxiliar', async () => {
    const d = await temporal(), original = payload(), auxiliar = JSON.stringify(JSON.parse(original), null, 2);
    const f = fuente([fila('guardado', original), fila('guardado--autosave-1', original)]);
    f.autosaves = async () => [{tenant_id:'tenant-A', modelo_id:'guardado', creado_en:fecha, payload:auxiliar}];
    const r = await migrar(f, d); expect(r.ok).toBe(true); if(!r.ok) throw Error(r.error);
    const m = r.modelos.find(x=>x.id==='guardado')!, otro=r.modelos.find(x=>x.id==='guardado--autosave-1')!, todo=await arbol(d);
    expect(m.originales[0]).toBe(join(r.archivo,'originales/guardado.json'));
    expect(otro.originales[0]).toBe(join(r.archivo,'originales/guardado--autosave-1.json'));
    expect(new Set([...m.originales,...otro.originales]).size).toBe(3);
    expect(todo[m.originales[0]!]).toBe(original); expect(todo[otro.originales[0]!]).toBe(original); expect(todo[m.originales[1]!]).toBe(auxiliar);
    for(const e of r.modelos) {const c=leerCanonico(todo[e.archivo!]!); expect(c.ok).toBe(true); if(c.ok) expect(c.valor.id).toBe(e.id);}
});

test('T-022 T-287 WP-12 ID con doble guion en papelera queda reservado sin reemplazar archivo', async () => {
    const d=await temporal(), id='archivado--parte', viejo=exportarV0({...modeloCon(),id}); await mkdir(join(d,'papelera'));
    const ruta=join('papelera',`${id}--${fecha}--eliminado.json`); await writeFile(join(d,ruta),viejo);
    const r=await migrar(fuente([{...fila(id),archivado:true}]),d); expect(r.ok).toBe(true); if(!r.ok)throw Error(r.error);
    expect(r.modelos[0]!.id).not.toBe(id); expect(await readFile(join(d,ruta),'utf8')).toBe(viejo);
    expect((await readdir(join(d,'papelera'))).length).toBe(2);
});
