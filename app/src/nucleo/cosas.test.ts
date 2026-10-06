import { test, expect } from 'bun:test';
import * as c from './cosas';
import { modeloCon, congelar } from '../pruebas/constructores';
import { validarForma } from './forma';
import { proyectar } from './proyeccion';
import { erroresContexto } from './matriz';
import type { Hecho, Respuesta, CodigoRechazo } from './resultado';
import type { Modelo, OpdDescomposicion, Objeto } from './tipos';

function descompuesta(): Modelo {
    const m = modeloCon({ objetos: [['Externo', []], ['Interno', []]], procesos: ['Procesar', 'Iniciar', 'Terminar'] });
    const hijo: OpdDescomposicion = { id: 'opd-7', tipo: 'descomposicion', padre: 'opd-1', cosa: 'p-4', orden: 0, bandas: [['p-5'], ['p-6']], objetosInternos: ['o-3'], apariciones: {
        'p-4': { x: 100, y: 100, ancho: 500, alto: 400 },
        'p-5': { x: 200, y: 164, ancho: 135, alto: 60 },
        'p-6': { x: 220, y: 264, ancho: 135, alto: 60 },
        'o-3': { x: 300, y: 364, ancho: 135, alto: 60 },
        'o-2': { x: -100, y: 100, ancho: 135, alto: 60 },
    } };
    const root = m.opds['opd-1']!;
    return congelar({ ...m, opds: { 'opd-1': { ...root, apariciones: { 'o-2': root.apariciones['o-2']!, 'p-4': root.apariciones['p-4']! } }, [hijo.id]: hijo }, secuencia: 8 });
}

function bien(r: Respuesta<Hecho>): Modelo {
    expect(r.ok).toBe(true);
    if (!r.ok) throw new Error(r.rechazo.mensaje);
    expect(validarForma(r.valor.modelo)).toEqual([]);
    return r.valor.modelo;
}
function rechazo(r: Respuesta<Hecho>, codigo: CodigoRechazo, regla?: string) {
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('Se esperaba rechazo');
    expect(r.rechazo.codigo).toBe(codigo);
    expect(r.rechazo.refs.length).toBeGreaterThan(0);
    expect(r.rechazo.regla).toBe(regla ?? r.rechazo.regla);
    expect(r.rechazo.mensaje.length).toBeGreaterThan(0);
}
test('T-062 crea objeto y proceso con defaults, IDs y original inmutable', () => {
    const m = modeloCon(), previo = JSON.stringify(m);
    const a = c.crearCosa(m, { opd: m.raiz, tipo: 'objeto', nombre: 'Pedido', x: 0, y: 0 });
    const n = bien(a);
    if (!a.ok) return;
    expect(a.valor.creados).toEqual(['o-2']);
    expect(n.cosas['o-2']).toEqual({ id: 'o-2', tipo: 'objeto', nombre: 'Pedido', esencia: 'informacional', afiliacion: 'sistemica', estados: [] });
    const b = c.crearCosa(congelar(n), { opd: m.raiz, tipo: 'proceso', nombre: 'Procesar pedido', x: 200, y: 0 });
    expect(bien(b).cosas['p-3']?.tipo).toBe('proceso');
    expect(JSON.stringify(m)).toBe(previo);
    expect(n.secuencia).toBe(3);
});
for (const nombre of ['', 'pedido', ' Pedido', 'Pedido ', 'Pedido  nuevo', 'Pedido!']) {
    test(`T-025 crear rechaza léxico sin corrección: ${JSON.stringify(nombre)}`, () => rechazo(c.crearCosa(modeloCon(), { opd: 'opd-1', tipo: 'objeto', nombre, x: 0, y: 0 }), 'lexico', 'R-§18-LEX-1'));
}
test('T-065 unicidad cruza tipos y referencia la cosa existente', () => {
    const m = modeloCon({ objetos: [['Pedido', []]] });
    const r = c.crearCosa(m, { opd: m.raiz, tipo: 'proceso', nombre: 'Pedido', x: 200, y: 0 });
    rechazo(r, 'unicidad-nominal');
    if (!r.ok) expect(r.rechazo.refs).toContainEqual({ tipo: 'cosa', id: 'o-2' });
});
test('T-065 renombra conservando identidad y excluye el propio registro', () => {
    const m = modeloCon({ objetos: [['Pedido', []], ['Factura', []]] });
    expect(bien(c.renombrarCosa(m, { cosa: 'o-2', nombre: 'Pedido' })).cosas['o-2']?.nombre).toBe('Pedido');
    expect(bien(c.renombrarCosa(m, { cosa: 'o-2', nombre: 'Orden' })).secuencia).toBe(m.secuencia);
    rechazo(c.renombrarCosa(m, { cosa: 'o-2', nombre: 'Factura' }), 'unicidad-nominal');
});
test('T-063 cambia tipo vacío y rechaza objeto con estados', () => {
    const m = modeloCon({ objetos: [['Pedido', []], ['Factura', ['lista']]] });
    expect(bien(c.cambiarTipoCosa(m, { cosa: 'o-2' })).cosas['o-2']?.tipo).toBe('proceso');
    rechazo(c.cambiarTipoCosa(m, { cosa: 'o-3' }), 'tipo-incompatible');
});
test('T-063 cambiar tipo consulta firma real de enlaces', () => {
    const m = modeloCon({ objetos: [['Pedido', []]], procesos: ['Procesar'], enlaces: [['consumo', 'Pedido', 'Procesar']] });
    rechazo(c.cambiarTipoCosa(m, { cosa: 'o-2' }), 'tipo-incompatible');
});
test('T-045 DS-20 rechaza agente informacional y permite error previo independiente', () => {
    const m = modeloCon({ objetos: [['Persona', []]], procesos: ['Procesar'], enlaces: [['agente', 'Persona', 'Procesar']] });
    rechazo(c.fijarEsencia(m, { cosa: 'o-2', esencia: 'informacional' }), 'contexto', 'R-AG-1');
    const malo = congelar({ ...m, cosas: { ...m.cosas, 'o-2': { ...m.cosas['o-2']!, esencia: 'informacional' as const } } });
    expect(bien(c.fijarDescripcion(malo, { cosa: 'p-3', texto: 'Descripción' })).cosas['p-3']?.descripcion).toBe('Descripción');
    expect(bien(c.fijarEsencia(malo, { cosa: 'o-2', esencia: 'fisica' })).cosas['o-2']?.esencia).toBe('fisica');
});
test('T-091 ambiental se propaga por rasgos transitivos y corta ciclos', () => {
    const m = modeloCon({ objetos: [['Pedido', []], ['Peso', []], ['Unidad', []]], enlaces: [['exhibicion', 'Pedido', 'Peso'], ['exhibicion', 'Peso', 'Unidad'], ['exhibicion', 'Unidad', 'Pedido']] });
    const r = c.fijarAfiliacion(m, { cosa: 'o-2', afiliacion: 'ambiental' });
    const n = bien(r);
    expect(Object.values(n.cosas).map(x => x.afiliacion)).toEqual(['ambiental', 'ambiental', 'ambiental']);
    if (r.ok) expect(r.trazas.filter(t => t.regla === 'R-OPD-STR-13')).toHaveLength(3);
    const q = bien(c.fijarAfiliacion(congelar(n), { cosa: 'o-3', afiliacion: 'sistemica' }));
    expect(q.cosas['o-2']?.afiliacion).toBe('ambiental');
    expect(q.cosas['o-4']?.afiliacion).toBe('ambiental');
});
test('T-020 valor exige rasgo y léxico, null retira sin inventar texto', () => {
    const m = modeloCon({ objetos: [['Pedido', []], ['Peso', []]], enlaces: [['exhibicion', 'Pedido', 'Peso']] });
    rechazo(c.fijarValor(m, { objeto: 'o-2', valor: '12' }), 'tipo-incompatible');
    rechazo(c.fijarValor(m, { objeto: 'o-3', valor: 'doce kilos' }), 'lexico');
    const n = bien(c.fijarValor(m, { objeto: 'o-3', valor: '-12.5' }));
    expect(n.cosas['o-3']).toHaveProperty('valor', '-12.5');
    expect(bien(c.fijarValor(congelar(n), { objeto: 'o-3', valor: null })).cosas['o-3']).not.toHaveProperty('valor');
});
test('T-063 género masculino y descripción null retiran campos opcionales', () => {
    let m = modeloCon({ objetos: [['Pedido', []]] });
    m = bien(c.fijarGenero(m, { cosa: 'o-2', genero: 'f' }));
    expect(m.cosas['o-2']?.genero).toBe('f');
    m = bien(c.fijarGenero(congelar(m), { cosa: 'o-2', genero: 'm' }));
    expect(m.cosas['o-2']).not.toHaveProperty('genero');
    m = bien(c.fijarDescripcion(congelar(m), { cosa: 'o-2', texto: 'Texto' }));
    m = bien(c.fijarDescripcion(congelar(m), { cosa: 'o-2', texto: null }));
    expect(m.cosas['o-2']).not.toHaveProperty('descripcion');
});
test('T-063 duración finita positiva ordenada, unidad y retiro', () => {
    const m = modeloCon({ objetos: [['Pedido', []]], procesos: ['Procesar'] });
    for (const duracion of [{ min: 0 }, { max: Infinity }, { min: 3, max: 2 }, { esperada: 1, min: 2 }, { min: 1, unidad: 'invalid' }])
        rechazo(c.fijarDuracion(m, { proceso: 'p-3', duracion: duracion as never }), 'duracion-invalida', 'F-10');
    rechazo(c.fijarDuracion(m, { proceso: 'o-2', duracion: { min: 1 } }), 'tipo-incompatible');
    const n = bien(c.fijarDuracion(m, { proceso: 'p-3', duracion: { min: 1, esperada: 2, max: 3, unidad: 'sec' } }));
    expect(n.cosas['p-3']).toHaveProperty('duracion', { min: 1, esperada: 2, max: 3, unidad: 'sec' });
    expect(bien(c.fijarDuracion(congelar(n), { proceso: 'p-3', duracion: null })).cosas['p-3']).not.toHaveProperty('duracion');
});
test('T-063 relación incompleta sin duplicados ni clasificación', () => {
    const m = modeloCon({ objetos: [['Pedido', []]] });
    const n = bien(c.fijarIncompleta(m, { cosa: 'o-2', relacion: 'exhibicion', activa: true }));
    expect(bien(c.fijarIncompleta(congelar(n), { cosa: 'o-2', relacion: 'exhibicion', activa: true })).cosas['o-2']?.incompleta).toEqual(['exhibicion']);
    expect(bien(c.fijarIncompleta(congelar(n), { cosa: 'o-2', relacion: 'exhibicion', activa: false })).cosas['o-2']).not.toHaveProperty('incompleta');
    rechazo(c.fijarIncompleta(m, { cosa: 'o-2', relacion: 'clasificacion' as never, activa: true }), 'tipo-incompatible');
});
test('T-062 referencias ausentes son rechazo útil antes de reservar ID', () => {
    const m = modeloCon();
    rechazo(c.crearCosa(m, { opd: 'opd-99', tipo: 'objeto', nombre: 'Pedido', x: 0, y: 0 }), 'no-encontrado');
    rechazo(c.renombrarCosa(m, { cosa: 'o-99', nombre: 'Pedido' }), 'no-encontrado');
    expect(m.secuencia).toBe(2);
});
test('T-248 traer conserva la cosa y hechos, rechaza ya-aparece e interno de otro OPD', () => {
    const m = descompuesta();
    const sinExterno = { ...m.opds['opd-7']!.apariciones }; delete sinExterno['o-2'];
    const base = congelar({ ...m, opds: { ...m.opds, 'opd-7': { ...m.opds['opd-7']!, apariciones: sinExterno } } });
    const r = c.traerCosa(base, { cosa: 'o-2', opd: 'opd-7', x: -100, y: 100 }), n = bien(r);
    expect(n.cosas).toBe(base.cosas); expect(n.enlaces).toBe(base.enlaces);
    expect(n.secuencia).toBe(base.secuencia);
    if (r.ok) expect(r.valor.creados).toEqual([]);
    rechazo(c.traerCosa(m, { cosa: 'o-2', opd: 'opd-7', x: 0, y: 0 }), 'ya-aparece');
    const rootApps = { ...m.opds['opd-1']!.apariciones }; delete rootApps['o-3'];
    const sinInterno = congelar({ ...m, opds: { ...m.opds, 'opd-1': { ...m.opds['opd-1']!, apariciones: rootApps } } });
    rechazo(c.traerCosa(sinInterno, { cosa: 'o-3', opd: 'opd-1', x: 0, y: 0 }), 'es-interno');
});
test('T-081 traer externo dentro del contenedor rebota con traza sin convertirlo en interno', () => {
    const m = descompuesta(), apps = { ...m.opds['opd-7']!.apariciones }; delete apps['o-2'];
    const base = congelar({ ...m, opds: { ...m.opds, 'opd-7': { ...m.opds['opd-7']!, apariciones: apps } } });
    const r = c.traerCosa(base, { cosa: 'o-2', opd: 'opd-7', x: 250, y: 250 }), n = bien(r);
    const o = n.opds['opd-7'] as OpdDescomposicion, p = o.apariciones['o-2']!;
    expect(p.x + p.ancho <= 100 || p.x >= 600 || p.y + p.alto <= 100 || p.y >= 500).toBe(true);
    expect(o.objetosInternos).toEqual(['o-3']);
    if (r.ok) expect(r.trazas.some(t => t.regla === 'T-081')).toBe(true);
});
test('T-082 mover contenedor traslada internos una vez, mantiene bandas y externos', () => {
    const m = descompuesta(), original = JSON.stringify(m);
    const r = c.moverApariciones(m, { opd: 'opd-7', mover: [{ cosa: 'p-4', x: 200, y: 200 }, { cosa: 'p-5', x: 300, y: 264 }] });
    const o = bien(r).opds['opd-7'] as OpdDescomposicion;
    expect(o.apariciones['p-4']!.x).toBe(200);
    expect(o.apariciones['p-5']).toEqual({ x: 300, y: 264, ancho: 135, alto: 60 });
    expect(o.apariciones['p-6']!.y).toBe(364);
    expect(o.apariciones['o-3']!.y).toBe(464);
    expect(o.apariciones['o-2']).toEqual(m.opds['opd-7']!.apariciones['o-2']);
    expect(o.bandas).toBe((m.opds['opd-7'] as OpdDescomposicion).bandas);
    expect(JSON.stringify(m)).toBe(original);
});
test('T-082 subproceso solo x, objeto interno confinado, externo rebota', () => {
    const m = descompuesta();
    const r = c.moverApariciones(m, { opd: 'opd-7', mover: [{ cosa: 'p-5', x: -500, y: 999 }, { cosa: 'o-3', x: 999, y: -999 }, { cosa: 'o-2', x: 200, y: 200 }] });
    const o = bien(r).opds['opd-7'] as OpdDescomposicion;
    expect(o.apariciones['p-5']!.y).toBe(164);
    for (const id of ['p-5', 'o-3']) { const p = o.apariciones[id]!; expect(p.x).toBeGreaterThanOrEqual(100); expect(p.x + p.ancho).toBeLessThanOrEqual(600); expect(p.y).toBeGreaterThanOrEqual(100); expect(p.y + p.alto).toBeLessThanOrEqual(500); }
    const ext = o.apariciones['o-2']!;
    expect(ext.x + ext.ancho <= 100 || ext.x >= 600 || ext.y + ext.alto <= 100 || ext.y >= 500).toBe(true);
    if (r.ok) expect(r.trazas.some(t => t.regla === 'T-081')).toBe(true);
});
test('T-064 mover lote valida todas referencias antes de publicar, duplicate no doble delta', () => {
    const m = descompuesta(), original = JSON.stringify(m);
    rechazo(c.moverApariciones(m, { opd: 'opd-7', mover: [{ cosa: 'p-4', x: 200, y: 200 }, { cosa: 'o-99', x: 0, y: 0 }] }), 'no-encontrado');
    expect(JSON.stringify(m)).toBe(original);
    const n = bien(c.moverApariciones(m, { opd: 'opd-7', mover: [{ cosa: 'p-4', x: 200, y: 200 }, { cosa: 'p-4', x: 200, y: 200 }] }));
    expect(n.opds['opd-7']!.apariciones['p-5']!.x).toBe(300);
});
test('T-249 redimensionar conserva posición, rechazo tamaño inválido y ausencia', () => {
    const m = modeloCon({ objetos: [['Pedido', []]] });
    expect(bien(c.redimensionar(m, { opd: 'opd-1', cosa: 'o-2', ancho: 200, alto: 100 })).opds['opd-1']!.apariciones['o-2']).toEqual({ x: 0, y: 0, ancho: 200, alto: 100 });
    rechazo(c.redimensionar(m, { opd: 'opd-1', cosa: 'o-2', ancho: 0, alto: 100 }), 'forma');
    rechazo(c.redimensionar(m, { opd: 'opd-1', cosa: 'o-2', ancho: Infinity, alto: 100 }), 'forma');
    rechazo(c.redimensionar(m, { opd: 'opd-1', cosa: 'o-99', ancho: 100, alto: 100 }), 'no-encontrado');
});
test('T-251 DS-6 última aparición se quita y conserva todos hechos con traza', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]], procesos: ['Procesar'], enlaces: [['consumo', 'Pedido', 'Procesar']] });
    const r = c.quitarDeOpd(m, { opd: 'opd-1', cosas: ['o-2'] }), n = bien(r);
    expect(n.opds['opd-1']!.apariciones).not.toHaveProperty('o-2');
    expect(n.cosas).toBe(m.cosas); expect(n.enlaces).toBe(m.enlaces); expect(n.abanicos).toBe(m.abanicos); expect(n.secuencia).toBe(m.secuencia);
    if (r.ok) expect(r.trazas.some(t => t.mensaje.includes('sigue en el modelo'))).toBe(true);
});
test('T-251 quitar lote rechaza contenedor, internos y ausente; conserva snapshot', () => {
    const m = descompuesta(), snapshot = JSON.stringify(m);
    rechazo(c.quitarDeOpd(m, { opd: 'opd-7', cosas: ['o-2', 'p-4'] }), 'es-contenedor');
    rechazo(c.quitarDeOpd(m, { opd: 'opd-7', cosas: ['o-2', 'o-3'] }), 'es-interno');
    rechazo(c.quitarDeOpd(m, { opd: 'opd-7', cosas: ['o-2', 'o-99'] }), 'no-encontrado');
    expect(JSON.stringify(m)).toBe(snapshot);
});
test('T-083 DS-5 eliminar refinada aborta todo lote, nunca borra OPDs', () => {
    const m = descompuesta(), snapshot = JSON.stringify(m);
    rechazo(c.eliminarCosas(m, { cosas: ['o-2', 'p-4'] }), 'tiene-refinamiento');
    expect(JSON.stringify(m)).toBe(snapshot);
    rechazo(c.cambiarTipoCosa(m, { cosa: 'p-4' }), 'tipo-incompatible');
});
test('T-080 eliminar cascada de enlaces/estados/apariciones y miembro banda sin remigrar', () => {
    const m = descompuesta();
    const n = bien(c.eliminarCosas(m, { cosas: ['p-5', 'o-3'] }));
    expect(n.cosas).not.toHaveProperty('p-5'); expect(n.cosas).not.toHaveProperty('o-3');
    expect((n.opds['opd-7'] as OpdDescomposicion).bandas).toEqual([['p-6']]);
    expect((n.opds['opd-7'] as OpdDescomposicion).objetosInternos).toEqual([]);
    expect(n.opds['opd-1']!.apariciones).not.toHaveProperty('p-5');
    expect(n.secuencia).toBe(m.secuencia);
});
test('T-020 cascada retira valor al perder último exhibidor y conserva con otro', () => {
    const base = modeloCon({ objetos: [['Pedido', []], ['Peso', []], ['Factura', []]], enlaces: [['exhibicion', 'Pedido', 'Peso'], ['exhibicion', 'Factura', 'Peso']] });
    const m = congelar({ ...base, cosas: { ...base.cosas, 'o-3': { ...base.cosas['o-3']! as Objeto, valor: '12' } } });
    expect(bien(c.eliminarCosas(m, { cosas: ['o-2'] })).cosas['o-3']).toHaveProperty('valor', '12');
    const r = c.eliminarCosas(m, { cosas: ['o-2', 'o-4'] }), n = bien(r);
    expect(n.cosas['o-3']).not.toHaveProperty('valor');
    if (r.ok) expect(r.trazas.some(t => t.regla === 'F-13' && t.mensaje.includes('12'))).toBe(true);
});
test('T-062 crear internos incorpora bandas/objetos, hereda ambiental y usa geometría real', () => {
    const base = descompuesta(), m = congelar({ ...base, cosas: { ...base.cosas, 'p-4': { ...base.cosas['p-4']!, afiliacion: 'ambiental' as const } } });
    const r = c.crearCosa(m, { opd: 'opd-7', tipo: 'objeto', nombre: 'Dato', x: 250, y: 250 });
    const n = bien(r), o = n.opds['opd-7'] as OpdDescomposicion;
    expect(o.objetosInternos).toEqual(['o-3', 'o-8']); expect(n.cosas['o-8']?.afiliacion).toBe('ambiental');
    if (r.ok) expect(r.trazas.some(t => t.regla === 'R-OBJ-6')).toBe(true);
    const q = bien(c.crearCosa(m, { opd: 'opd-7', tipo: 'proceso', nombre: 'Continuar', x: -300, y: 0, alcance: 'interno', banda: { indice: 0, paralelo: true } }));
    expect((q.opds['opd-7'] as OpdDescomposicion).bandas).toEqual([['p-5', 'p-8'], ['p-6']]);
    expect(q.cosas['p-8']?.afiliacion).toBe('ambiental');
});
test('T-062 fixture de descomposición tiene forma válida y roles persistidos', () => {
    expect(validarForma(descompuesta())).toEqual([]);
});
test('T-062 primer subproceso con contorno vacío completa distribución vacua, sin doble', () => {
    const m = descompuesta(), o = m.opds['opd-7'] as OpdDescomposicion;
    const base = congelar({ ...m, opds: { ...m.opds, 'opd-7': { ...o, bandas: [], apariciones: { 'p-4': o.apariciones['p-4']!, 'o-3': o.apariciones['o-3']!, 'o-2': o.apariciones['o-2']! } } } });
    const r = c.crearCosa(base, { opd: 'opd-7', tipo: 'proceso', nombre: 'Comenzar', x: 250, y: 250, alcance: 'interno' });
    const n = bien(r);
    expect((n.opds['opd-7'] as OpdDescomposicion).bandas).toEqual([['p-8']]);
    expect(n.enlaces).toBe(base.enlaces);
    if (r.ok) expect(r.valor.creados).toEqual(['p-8']);
});
test('T-080 cascada elimina estados y todos incidentes, abanico de una rama se disuelve', () => {
    const base = modeloCon({ objetos: [['Pedido', ['listo']], ['Factura', []]], procesos: ['Procesar'], enlaces: [['consumo', 'Pedido', 'Procesar'], ['consumo', 'Factura', 'Procesar']] });
    const m: Modelo = congelar({ ...base, enlaces: { ...base.enlaces, 'e-6': { id: 'e-6', tipo: 'consumo' as const, objeto: 'o-2', proceso: 'p-5', estado: 's-3' } }, abanicos: { 'f-8': { id: 'f-8', operador: 'XOR' as const, enlaces: ['e-6', 'e-7'] } }, secuencia: 9 });
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]);
    const r = c.eliminarCosas(m, { cosas: ['o-2'] }), n = bien(r);
    expect(n.enlaces).toEqual({ 'e-7': m.enlaces['e-7']! });
    expect(n.abanicos).toEqual({}); expect(n.cosas).not.toHaveProperty('o-2');
    expect(n.opds['opd-1']!.apariciones).not.toHaveProperty('o-2');
    if (r.ok) { expect(r.valor.creados).toEqual([]); expect(r.trazas.some(t => t.refs.some(x => x.id === 'f-8'))).toBe(true); }
    expect((m.cosas['o-2'] as Objeto).estados[0]?.id).toBe('s-3');
});
test('T-054 abanico con dos ramas restantes conserva identidad, orden y operador', () => {
    const base = modeloCon({ objetos: [['Pedido', []], ['Factura', []], ['Nota', []]], procesos: ['Procesar'], enlaces: [['consumo', 'Pedido', 'Procesar'], ['consumo', 'Factura', 'Procesar'], ['consumo', 'Nota', 'Procesar']] });
    const m = congelar({ ...base, abanicos: { 'f-9': { id: 'f-9', operador: 'OR' as const, enlaces: ['e-6', 'e-7', 'e-8'] } }, secuencia: 10 });
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]);
    expect(bien(c.eliminarCosas(m, { cosas: ['o-3'] })).abanicos['f-9']).toEqual({ id: 'f-9', operador: 'OR', enlaces: ['e-6', 'e-8'] });
});
test('T-074 eliminar subproceso retira su mitad y otra queda standalone sin remigración', () => {
    const base = descompuesta();
    const m = congelar({ ...base, cosas: { ...base.cosas, 'o-2': { ...base.cosas['o-2']! as Objeto, estados: [{ id: 's-8', nombre: 'nuevo' }, { id: 's-9', nombre: 'listo' }] } }, enlaces: {
        'e-10': { id: 'e-10', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-5', entrada: 's-8', escision: { par: 'e-11', mitad: 'entrada' as const } },
        'e-11': { id: 'e-11', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-6', salida: 's-9', escision: { par: 'e-10', mitad: 'salida' as const } },
    }, secuencia: 12 });
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]);
    const r = c.eliminarCosas(m, { cosas: ['p-5'] }), n = bien(r);
    expect(n.enlaces['e-11']).toEqual({ id: 'e-11', tipo: 'efecto', objeto: 'o-2', proceso: 'p-6', salida: 's-9' });
    expect(n.enlaces).not.toHaveProperty('e-10');
    if (r.ok) expect(r.trazas.some(t => t.regla === 'DR-7')).toBe(true);
});
test('T-093 eliminar general aplica DS-20 global y aborta lote antes de publicar', () => {
    const m = modeloCon({ objetos: [['General', ['listo']], ['Especial', []], ['Otro', []]], procesos: ['Procesar'], enlaces: [['generalizacion', 'General', 'Especial'], ['efecto', 'Especial', 'Procesar']] });
    const original = JSON.stringify(m);
    expect(erroresContexto(m)).toEqual([]);
    rechazo(c.eliminarCosas(m, { cosas: ['o-5', 'o-2'] }), 'contexto', 'R-EFE-1');
    expect(JSON.stringify(m)).toBe(original);
});
test('T-064 DS-20 mismo código en refs distintas cuenta como error nuevo', () => {
    const base = modeloCon({ objetos: [['Persona', []], ['Operador', []]], procesos: ['Procesar'], enlaces: [['agente', 'Persona', 'Procesar'], ['agente', 'Operador', 'Procesar']] });
    const m = congelar({ ...base, cosas: { ...base.cosas, 'o-2': { ...base.cosas['o-2']!, esencia: 'informacional' as const } } });
    expect(erroresContexto(m).map(v => v.regla)).toEqual(['R-AG-1']);
    const r = c.fijarEsencia(m, { cosa: 'o-3', esencia: 'informacional' });
    rechazo(r, 'contexto', 'R-AG-1');
    if (!r.ok) expect(r.rechazo.refs).toContainEqual({ tipo: 'enlace', id: 'e-6' });
});
test('T-063 tipos de miembros internos no cambian a categoría incompatible con F-8', () => {
    const m = descompuesta();
    rechazo(c.cambiarTipoCosa(m, { cosa: 'p-5' }), 'tipo-incompatible', 'F-8');
    rechazo(c.cambiarTipoCosa(m, { cosa: 'o-3' }), 'tipo-incompatible', 'F-8');
});
test('T-062 alcance externo explícito prevalece sobre punto interno, banda inválida es atómica', () => {
    const m = descompuesta();
    const n = bien(c.crearCosa(m, { opd: 'opd-7', tipo: 'objeto', nombre: 'Dato', x: 250, y: 250, alcance: 'externo' }));
    expect((n.opds['opd-7'] as OpdDescomposicion).objetosInternos).toEqual(['o-3']);
    expect(proyectar(n, 'opd-7').cosas.find(c => c.cosa === 'o-8')?.rol).toBe('externo');
    rechazo(c.crearCosa(m, { opd: 'opd-7', tipo: 'proceso', nombre: 'Continuar', x: 250, y: 250, banda: { indice: 9, paralelo: true } }), 'forma', 'F-8');
    expect(m.secuencia).toBe(8);
});
test('T-062 posición no finita nunca deja caja inválida ni reserva ID', () => {
    const m = modeloCon({ objetos: [['Pedido', []]] });
    rechazo(c.crearCosa(m, { opd: 'opd-1', tipo: 'objeto', nombre: 'Factura', x: NaN, y: 0 }), 'forma', 'F-12');
    rechazo(c.moverApariciones(m, { opd: 'opd-1', mover: [{ cosa: 'o-2', x: Infinity, y: 0 }] }), 'forma', 'F-12');
    expect(m.secuencia).toBe(3);
});
test('T-064 todas las propiedades rechazan cosa ausente sin excepción ni ID', () => {
    const m = modeloCon();
    for (const r of [c.cambiarTipoCosa(m, { cosa: 'o-99' }), c.fijarEsencia(m, { cosa: 'o-99', esencia: 'fisica' }), c.fijarAfiliacion(m, { cosa: 'o-99', afiliacion: 'ambiental' }), c.fijarGenero(m, { cosa: 'o-99', genero: 'm' }), c.fijarDescripcion(m, { cosa: 'o-99', texto: null }), c.fijarValor(m, { objeto: 'o-99', valor: null }), c.fijarDuracion(m, { proceso: 'p-99', duracion: null }), c.fijarIncompleta(m, { cosa: 'o-99', relacion: 'agregacion', activa: false }), c.traerCosa(m, { cosa: 'o-99', opd: 'opd-1', x: 0, y: 0 }), c.eliminarCosas(m, { cosas: ['o-99'] })]) rechazo(r, 'no-encontrado');
});
test('T-081 contenedor arrastrado sobre externo conserva su rol y lo deja fuera con traza', () => {
    const m = descompuesta();
    const r = c.moverApariciones(m, { opd: 'opd-7', mover: [{ cosa: 'p-4', x: -200, y: 100 }] });
    const n = bien(r), o = n.opds['opd-7'] as OpdDescomposicion;
    const ext = o.apariciones['o-2']!, cont = o.apariciones['p-4']!;
    expect(ext.x + ext.ancho <= cont.x || ext.x >= cont.x + cont.ancho || ext.y + ext.alto <= cont.y || ext.y >= cont.y + cont.alto).toBe(true);
    expect(proyectar(n, 'opd-7').cosas.find(c => c.cosa === 'o-2')?.rol).toBe('externo');
    if (r.ok) expect(r.trazas.some(t => t.regla === 'T-081')).toBe(true);
});
test('T-251 quitar aparición padre que sostiene hijo rechaza forma F-7 sin cascada silenciosa', () => {
    const m = descompuesta(), snapshot = JSON.stringify(m);
    rechazo(c.quitarDeOpd(m, { opd: 'opd-1', cosas: ['o-2', 'p-4'] }), 'forma', 'F-7');
    expect(JSON.stringify(m)).toBe(snapshot);
});
test('T-064 mover exige 1..n antes de publicar', () => {
    const base = descompuesta();
    rechazo(c.moverApariciones(base, { opd: 'opd-7', mover: [] }), 'forma', 'producto');
});
test('T-064 mover rechaza overflow real sin caja inválida ni publicación parcial', () => {
    const base = descompuesta();
    const o = base.opds['opd-7']!, cajas = { ...o.apariciones, 'p-4': { ...o.apariciones['p-4']!, x: -1e308 } };
    const m = congelar({ ...base, opds: { ...base.opds, 'opd-7': { ...o, apariciones: cajas } } });
    expect(validarForma(m)).toEqual([]);
    rechazo(c.moverApariciones(m, { opd: 'opd-7', mover: [{ cosa: 'p-4', x: 1e308, y: 100 }] }), 'forma', 'F-12');
    expect(m.opds['opd-7']!.apariciones['p-4']!.x).toBe(-1e308);
});
test('T-080 cascada deja snapshot íntegro y recuperable con IDs, hechos, marcas y geometría', () => {
    const base = modeloCon({ objetos: [['Pedido', ['listo']], ['Factura', []]], procesos: ['Procesar'], enlaces: [['consumo', 'Pedido', 'Procesar']] });
    const m = congelar({ ...base, cosas: { ...base.cosas, 'o-2': { ...base.cosas['o-2']! as Objeto, porDefecto: 's-3', current: 's-3', estados: [{ id: 's-3', nombre: 'listo', inicial: true as const, final: true as const }] } }, opds: { 'opd-1': { ...base.opds['opd-1']!, apariciones: { ...base.opds['opd-1']!.apariciones, 'o-2': { ...base.opds['opd-1']!.apariciones['o-2']!, ocultos: ['s-3'] } } } } });
    const antes = structuredClone(m), snapshot = m;
    const r = c.eliminarCosas(m, { cosas: ['o-2'] });
    const n = bien(r);
    expect(n.cosas).not.toHaveProperty('o-2'); expect(n.enlaces).toEqual({});
    expect(snapshot).toEqual(antes);
    expect(snapshot.cosas['o-2']).toHaveProperty('current', 's-3');
    expect(snapshot.opds['opd-1']!.apariciones['o-2']).toHaveProperty('ocultos', ['s-3']);
    expect(snapshot.secuencia).toBe(7);
    if (r.ok) expect(r.valor.creados).toEqual([]);
});
test('T-063 cambiar tipo conserva valor puntual hasta retiro explícito, con original y argumentos intactos', () => {
    const base = modeloCon({ objetos: [['Pedido', []], ['Peso', []]], enlaces: [['exhibicion', 'Pedido', 'Peso']] });
    const m = congelar({ ...base, cosas: { ...base.cosas, 'o-3': { ...base.cosas['o-3']! as Objeto, valor: '12' } } });
    const args = congelar({ cosa: 'o-3' }), snapshot = JSON.stringify(m);
    rechazo(c.cambiarTipoCosa(m, args), 'tipo-incompatible', 'T-063');
    expect(JSON.stringify(m)).toBe(snapshot); expect(args).toEqual({ cosa: 'o-3' });
    const retirado = bien(c.fijarValor(m, { objeto: 'o-3', valor: null }));
    const n = bien(c.cambiarTipoCosa(congelar(retirado), args));
    expect(n.cosas['o-3']?.tipo).toBe('proceso'); expect(n.cosas['o-3']).not.toHaveProperty('valor');
    expect(n.enlaces).toBe(m.enlaces); expect(n.secuencia).toBe(m.secuencia);
});
test('T-063 cambiar tipo conserva duración hasta retiro explícito, sin pérdida por analogía', () => {
    const base = modeloCon({ procesos: ['Procesar'] });
    const duracion = congelar({ min: 1, max: 2, unidad: 'sec' as const });
    const m = congelar({ ...base, cosas: { ...base.cosas, 'p-2': { ...base.cosas['p-2']! as import('./tipos').Proceso, duracion } } });
    const args = congelar({ cosa: 'p-2' }), snapshot = JSON.stringify(m);
    rechazo(c.cambiarTipoCosa(m, args), 'tipo-incompatible', 'T-063');
    expect(JSON.stringify(m)).toBe(snapshot); expect(args).toEqual({ cosa: 'p-2' });
    expect(m.cosas['p-2']).toHaveProperty('duracion', { min: 1, max: 2, unidad: 'sec' });
    const retirado = bien(c.fijarDuracion(m, { proceso: 'p-2', duracion: null }));
    const n = bien(c.cambiarTipoCosa(congelar(retirado), args));
    expect(n.cosas['p-2']).toEqual({ id: 'p-2', tipo: 'objeto', nombre: 'Procesar', esencia: 'informacional', afiliacion: 'sistemica', estados: [] });
    expect(n.secuencia).toBe(m.secuencia);
});
test('T-063 cambiar tipo lista los impedimentos reales y referencias útiles', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]] });
    const r = c.cambiarTipoCosa(m, { cosa: 'o-2' });
    rechazo(r, 'tipo-incompatible', 'T-063');
    if (!r.ok) { expect(r.rechazo.mensaje).toContain('listo'); expect(r.rechazo.refs).toContainEqual({ tipo: 'estado', id: 's-3' }); }
    const r2 = c.cambiarTipoCosa(descompuesta(), { cosa: 'p-4' });
    rechazo(r2, 'tipo-incompatible', 'T-063');
    if (!r2.ok) expect(r2.rechazo.refs).toContainEqual({ tipo: 'opd', id: 'opd-7' });
});
