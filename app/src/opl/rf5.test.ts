import { test, expect } from 'bun:test';
import { analizar } from './analizar';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { aplicarAcciones } from '../nucleo/operaciones';
import { validarForma } from '../nucleo/forma';
import { erroresContexto } from '../nucleo/matriz';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { aplicarAccion } from '../nucleo/operaciones';
import type { Accion } from '../nucleo/operaciones';
import { tiposLegales } from '../nucleo/matriz';
import { diagnosticar } from '../nucleo/diagnostico';
import { escena } from '../opd/escena';
import { exportarDiagrama } from '../opd/exportar';
import { generarBloque, textoCanonico } from './generar';
import type { Enlace, EnlaceNuevo, Modelo, Objeto } from '../nucleo/tipos';
import type { HechoTexto } from './analizar';

const rf5 = '**Auto** exhibe **Medio de Desplazamiento** en `tierra`.';
const base = () => modeloCon({
    objetos: [['Vehículo', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
    enlaces: [['generalizacion', 'Vehículo', 'Auto'], ['exhibicion', 'Vehículo', 'Medio de Desplazamiento']],
});
const hecho: HechoTexto = { k: 'enlace', enlace: { tipo: 'exhibicion', refinable: { nombre: 'Auto', tipo: 'objeto' }, refinador: { nombre: 'Medio de Desplazamiento', tipo: 'objeto', estado: 'tierra' } } };
const fallo = { codigo: 'type-mismatch', severidad: 'error', regla: 'R-STRE-2' };
const atributo = (m: Modelo) => porNombre(m, 'Medio de Desplazamiento') as Objeto;
const valor = (m: Modelo, nombre: string) => atributo(m).estados.find(s => s.nombre === nombre)!.id;
const crearRf5 = (m: Modelo, nombre = 'tierra', exhibidor = 'Auto'): Accion => ({ op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'exhibicion', refinable: porNombre(m, exhibidor).id, refinador: atributo(m).id, estado: valor(m, nombre) } } });
const conRf5 = () => { const b = base(); return must(aplicarAcciones(b, [crearRf5(b)])).modelo; };
const rf5De = (m: Modelo) => Object.values(m.enlaces).filter((e): e is Extract<Enlace, { tipo: 'exhibicion' }> => e.tipo === 'exhibicion' && e.estado !== undefined);
const rechazo = (m: Modelo, a: Accion) => { const r = aplicarAccion(m, a); if (r.ok) throw Error(`Aceptó ${a.op}`); return r.rechazo; };
function estricto(m: Modelo) {
    const doc = generarDocumentoOpl(m);
    expect(planificar(m, m.raiz, doc).acciones).toEqual([]);
    const nuevo = must(importarOpl(m.nombre, doc));
    expect(nuevo.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
    expect(planificar(nuevo.modelo, nuevo.modelo.raiz, doc).acciones).toEqual([]);
    const bytes = exportarV0(m), json = importarV0(bytes); expect(json.ok).toBe(true);
    if (!json.ok) throw Error('Códec');
    expect(json.informe.descartado).toEqual([]); expect(json.informe.normalizado).toEqual([]);
    expect(exportarV0(json.modelo)).toBe(bytes); expect(json.modelo.enlaces).toEqual(m.enlaces);
    return { doc, nuevo: nuevo.modelo };
}

for (const verbo of ['exhibe', 'Exhibe', 'EXHIBE']) test(`T-121 T-156 B-37 RF5 ${verbo} reconoce la caracterización con estado y nunca un etiquetado`, () => {
    const texto = rf5.replace('exhibe', verbo), l = analizar(texto)[0]!;
    expect(l.plantilla).toBe('RF5');
    expect(l.hechos).toEqual([hecho]);
    expect(l.diagnosticos).toEqual([]);
    // Sin la especialización y la exhibición del general no hay RF5 válida (R-STRE-2): nada se crea.
    const r = must(importarOpl('RF5 sin contexto', texto));
    expect(r.plan.acciones).toEqual([]);
    expect(r.plan.lineas[0]).toMatchObject({ estado: 'no-aplicable', razon: 'enlace-invalido-firma' });
    expect(r.plan.lineas[0]!.diagnosticos).toEqual([expect.objectContaining(fallo)]);
    expect(r.modelo.cosas).toEqual({}); expect(r.modelo.enlaces).toEqual({});
    expect(r.modelo.secuencia).toBe(r.plan.base.secuencia);
});

test('T-121 T-173 B-37 RF5 en un contexto nativo válido crea sólo su hecho y conserva IDs y campos guardados', () => {
    const b = base(), auto = porNombre(b, 'Auto').id;
    const m = must(aplicarAcciones(b, [
        { op: 'fijarGenero', args: { cosa: auto, genero: 'f' } },
        { op: 'fijarNombrePlural', args: { cosa: auto, nombre: 'Autos' } },
    ])).modelo;
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]);
    const antes = exportarV0(m), p = planificar(m, m.raiz, rf5);
    expect(p.lineas[0]).toMatchObject({ estado: 'aplicable' });
    expect(p.lineas[0]!.diagnosticos).toEqual([]);
    expect(p.acciones).toEqual([{ op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'exhibicion', refinable: auto, refinador: atributo(m).id, estado: valor(m, 'tierra') } } }]);
    const n = must(aplicarPlan(m, p)).modelo;
    expect(exportarV0(m)).toBe(antes);
    expect(n.cosas).toEqual(m.cosas); expect(n.opds).toEqual(m.opds);
    expect(n.enlaces).toEqual({ ...m.enlaces, [`e-${m.secuencia}`]: { id: `e-${m.secuencia}`, tipo: 'exhibicion', refinable: auto, refinador: atributo(m).id, estado: valor(m, 'tierra') } });
    expect(validarForma(n)).toEqual([]); expect(erroresContexto(n)).toEqual([]);
    expect(planificar(n, n.raiz, rf5).acciones).toEqual([]);
    estricto(n);
});

test('T-121 T-173 B-37 documento mixto aplica RF2 y RF5 como hechos distintos', () => {
    const m = base(), soportada = '**Auto** exhibe **Color**.';
    const mixto = planificar(m, m.raiz, rf5 + '\n' + soportada);
    expect(mixto.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    const r = must(aplicarPlan(m, mixto)).modelo;
    expect(Object.values(r.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([]);
    expect(Object.values(r.enlaces).filter(e => e.tipo === 'exhibicion')).toHaveLength(3);
    expect(rf5De(r)).toEqual([expect.objectContaining({ refinable: porNombre(m, 'Auto').id, refinador: atributo(m).id, estado: valor(m, 'tierra') })]);
    expect(r.cosas[porNombre(m, 'Medio de Desplazamiento').id]).toEqual(porNombre(m, 'Medio de Desplazamiento'));
    const doc = estricto(r).doc;
    expect(doc.split('\n')).toContain('**Auto** exhibe **Color**.'); expect(doc.split('\n')).toContain(rf5);
});

test('T-119 T-192 B-37 etiqueta explícita exhibe conserva otro hecho, roundtrip estricto y códec fijo', () => {
    const m = base(), texto = rf5.replace(' exhibe ', ' «exhibe» '), p = planificar(m, m.raiz, texto);
    expect(p.lineas[0]!.diagnosticos).toEqual([]);
    const r = must(aplicarPlan(m, p)).modelo, atributo = porNombre(m, 'Medio de Desplazamiento');
    if (atributo.tipo !== 'objeto') throw Error('Montaje');
    expect(Object.values(r.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([
        expect.objectContaining({ tipo: 'etiquetado', etiqueta: 'exhibe', origen: porNombre(m, 'Auto').id,
            destino: atributo.id, estadoDestino: atributo.estados[0]!.id }),
    ]);
    const doc = generarDocumentoOpl(r);
    expect(doc).toContain(texto); expect(doc).toContain('**Vehículo** exhibe **Medio de Desplazamiento**.');
    expect(planificar(r, r.raiz, doc).acciones).toEqual([]);
    const nuevo = must(importarOpl(r.nombre, doc));
    expect(nuevo.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
    const e = Object.values(nuevo.modelo.enlaces).find(e => e.tipo === 'etiquetado')!;
    expect(e.tipo).toBe('etiquetado');
    if (e.tipo !== 'etiquetado') throw Error('Falta el etiquetado');
    expect(nuevo.modelo.cosas[e.origen]!.nombre).toBe('Auto');
    const destino = nuevo.modelo.cosas[e.destino]!;
    expect(destino.nombre).toBe('Medio de Desplazamiento');
    if (destino.tipo !== 'objeto') throw Error('Destino');
    expect(destino.estados.find(s => s.id === e.estadoDestino)?.nombre).toBe('tierra');
    expect(e.etiqueta).toBe('exhibe');
    const bytes = exportarV0(r), json = importarV0(bytes); expect(json.ok).toBe(true);
    if (json.ok) expect(exportarV0(json.modelo)).toBe(bytes);
});

for (const texto of [
    '**Auto exhibe** «exhibe» **Atributo en valor** en `estado exhibe`.',
    '**Auto** «exhibe Atributo en valor» **Atributo** en `tierra`.',
    '**Auto** «conoce» exhibe **Atributo** en `tierra`.',
    '**Auto** exhibe **Atributo exhibe**.',
]) test(`T-150 B-37 RF5 no interpreta datos opacos ${texto}`, () => {
    const l = analizar(texto)[0]!;
    expect(l.diagnosticos).toEqual([]); expect(l.hechos).toHaveLength(1);
});

test('T-157 B-37 la grafía histórica mantiene su clasificación sin ofrecer RF5', () => {
    const l = analizar('**Auto** exhibe `tierra` **Medio de Desplazamiento**.')[0]!;
    expect(l.hechos).toEqual([]);
    expect(l.diagnosticos).toEqual([expect.objectContaining({ codigo: 'non-canonical', regla: 'R-ZNC-1' })]);
});

// ---------- RF5 completa: núcleo, operaciones, OPL, códec, OPD y editor ----------

test('T-121 T-040 R-STRE-2 la firma exige objetos, valor propio del atributo y vértice sin estado', () => {
    const b = base(), auto = porNombre(b, 'Auto').id, medio = atributo(b).id, tierra = valor(b, 'tierra');
    const m = must(aplicarAcciones(b, [{ op: 'crearCosa', args: { opd: b.raiz, tipo: 'proceso', nombre: 'Conducir', x: 0, y: 300 } }, { op: 'agregarEstado', args: { objeto: auto, nombre: 'nuevo' } }])).modelo;
    const conducir = porNombre(m, 'Conducir').id, nuevo = (m.cosas[auto] as Objeto).estados[0]!.id;
    const crear = (candidato: EnlaceNuevo) => rechazo(m, { op: 'crearEnlace', args: { opd: m.raiz, candidato } });
    expect(crear({ tipo: 'exhibicion', refinable: conducir, refinador: medio, estado: tierra })).toMatchObject({ codigo: 'forma', regla: 'R-STRE-2' });
    // Estado ajeno: el valor debe pertenecer al atributo del extremo.
    expect(crear({ tipo: 'exhibicion', refinable: auto, refinador: medio, estado: nuevo })).toMatchObject({ codigo: 'forma', regla: 'R-EDIT-2' });
    expect(crear({ tipo: 'exhibicion', refinable: auto, refinador: medio, estado: 's-inexistente' })).toMatchObject({ codigo: 'forma', regla: 'R-EDIT-2' });
    // El vértice nunca lleva estado; los demás estructurales fundamentales siguen sin anclaje.
    const desde = { cosa: auto, estado: nuevo }, hacia = { cosa: medio, estado: tierra };
    const legales = tiposLegales(m, { opd: m.raiz, desde: { cosa: auto }, hacia });
    expect(legales.find(o => o.tipo === 'exhibicion' && o.sentido === 'directo')).toMatchObject({ legal: true, candidato: { tipo: 'exhibicion', refinable: auto, refinador: medio, estado: tierra } });
    expect(legales.find(o => o.tipo === 'etiquetado' && o.sentido === 'directo')).toMatchObject({ legal: true, candidato: { tipo: 'etiquetado', origen: auto, destino: medio, estadoDestino: tierra } });
    for (const tipo of ['agregacion', 'generalizacion', 'clasificacion'] as const)
        expect(legales.find(o => o.tipo === tipo && o.sentido === 'directo')).toMatchObject({ legal: false });
    const inverso = tiposLegales(m, { opd: m.raiz, desde: hacia, hacia: { cosa: auto } });
    expect(inverso.find(o => o.tipo === 'exhibicion' && o.sentido === 'inverso')).toMatchObject({ legal: true, candidato: { tipo: 'exhibicion', refinable: auto, refinador: medio, estado: tierra } });
    expect(tiposLegales(m, { opd: m.raiz, desde, hacia }).find(o => o.tipo === 'exhibicion')).toMatchObject({ legal: false, motivo: { regla: 'R-EDIT-2' } });
    expect(tiposLegales(m, { opd: m.raiz, desde: { cosa: conducir }, hacia }).find(o => o.tipo === 'exhibicion' && o.sentido === 'directo')).toMatchObject({ legal: false, motivo: { regla: 'R-STRE-2' } });
});

test('T-121 R-STRE-2 R-HER-2 el contexto heredado se consulta por la cadena de generales sin materializarse', () => {
    const sin = modeloCon({ objetos: [['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]], enlaces: [['exhibicion', 'Auto', 'Medio de Desplazamiento']] });
    expect(rechazo(sin, crearRf5(sin))).toMatchObject({ codigo: 'contexto', regla: 'R-STRE-2' });
    // El general existe pero no exhibe el atributo: tampoco es su atributo discriminante.
    const ajeno = modeloCon({ objetos: [['Vehículo', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra']]], enlaces: [['generalizacion', 'Vehículo', 'Auto']] });
    expect(rechazo(ajeno, crearRf5(ajeno))).toMatchObject({ codigo: 'contexto', regla: 'R-STRE-2' });
    // Cadena transitiva y herencia múltiple: basta un general que exhiba el atributo.
    const cadena = modeloCon({ objetos: [['Vehículo', []], ['Vehículo Terrestre', []], ['Auto', []], ['Bien', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
        enlaces: [['exhibicion', 'Vehículo', 'Medio de Desplazamiento'], ['generalizacion', 'Vehículo', 'Vehículo Terrestre'], ['generalizacion', 'Vehículo Terrestre', 'Auto'], ['generalizacion', 'Bien', 'Auto']] });
    const n = must(aplicarAcciones(cadena, [crearRf5(cadena)])).modelo;
    expect(erroresContexto(n)).toEqual([]); expect(Object.keys(n.cosas)).toEqual(Object.keys(cadena.cosas));
    expect(rf5De(n)).toHaveLength(1);
    estricto(n);
});

test('T-121 AP-29 DR-46 repetir el valor heredado se rechaza; otro valor no se prohíbe', () => {
    const b = modeloCon({ objetos: [['Vehículo', []], ['Vehículo Terrestre', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
        enlaces: [['exhibicion', 'Vehículo', 'Medio de Desplazamiento'], ['generalizacion', 'Vehículo', 'Vehículo Terrestre'], ['generalizacion', 'Vehículo Terrestre', 'Auto']] });
    const m = must(aplicarAcciones(b, [crearRf5(b, 'tierra', 'Vehículo Terrestre')])).modelo;
    expect(rechazo(m, crearRf5(m, 'tierra'))).toMatchObject({ codigo: 'contexto', regla: 'AP-29' });
    const otro = must(aplicarAcciones(m, [crearRf5(m, 'agua')])).modelo;
    expect(rf5De(otro).map(e => e.tipo === 'exhibicion' ? e.estado : '')).toEqual([valor(m, 'tierra'), valor(m, 'agua')]);
    // El mismo valor dos veces es el mismo hecho, no otro enlace.
    expect(rechazo(otro, crearRf5(otro, 'agua'))).toMatchObject({ codigo: 'ya-existe' });
    estricto(otro);
});

test('T-015 T-121 R-STRE-2 lo que sostiene el valor no se repara ni se convierte en silencio', () => {
    const m = conRf5(), e = rf5De(m)[0]!, gen = Object.values(m.enlaces).find(x => x.tipo === 'generalizacion')!;
    const general = Object.values(m.enlaces).find(x => x.tipo === 'exhibicion' && x.estado === undefined)!;
    expect(rechazo(m, { op: 'eliminarEstado', args: { estado: valor(m, 'tierra') } })).toMatchObject({ codigo: 'estado-enlazado', regla: 'R-STRE-2', refs: expect.arrayContaining([{ tipo: 'enlace', id: e.id }]) });
    expect(rechazo(m, { op: 'eliminarEnlaces', args: { enlaces: [gen.id] } })).toMatchObject({ codigo: 'contexto', regla: 'R-STRE-2' });
    expect(rechazo(m, { op: 'eliminarEnlaces', args: { enlaces: [general.id] } })).toMatchObject({ codigo: 'contexto', regla: 'R-STRE-2' });
    expect(rechazo(m, { op: 'eliminarCosas', args: { cosas: [porNombre(m, 'Vehículo').id] } })).toMatchObject({ codigo: 'contexto', regla: 'R-STRE-2' });
    // Retirar el valor por edición explícita produce RF2, que duplica la exhibición heredada.
    expect(rechazo(m, { op: 'fijarEstados', args: { enlace: e.id, estados: { estado: null } } })).toMatchObject({ codigo: 'contexto', regla: 'AP-29' });
    expect(rechazo(m, { op: 'suprimirEstado', args: { estado: valor(m, 'tierra'), opd: m.raiz, activa: true } })).toMatchObject({ codigo: 'estado-enlazado', regla: 'LF-03' });
    // Otro valor sin anclaje sí se elimina; un extremo eliminado se lleva el enlace.
    expect(must(aplicarAccion(m, { op: 'eliminarEstado', args: { estado: valor(m, 'agua') } })).modelo.enlaces[e.id]).toEqual(e);
    const sinAtributo = must(aplicarAccion(m, { op: 'eliminarCosas', args: { cosas: [atributo(m).id] } })).modelo;
    expect(sinAtributo.enlaces[e.id]).toBeUndefined(); expect(erroresContexto(sinAtributo)).toEqual([]);
    const sinAuto = must(aplicarAccion(m, { op: 'eliminarEnlaces', args: { enlaces: [e.id] } })).modelo;
    expect(must(aplicarAccion(sinAuto, { op: 'eliminarEnlaces', args: { enlaces: [gen.id] } })).modelo.enlaces[gen.id]).toBeUndefined();
});

test('T-121 T-015 R-OPD-EDIT-2 editar valor, renombrar, reanclar y cambiar tipo conservan identidad', () => {
    const m = conRf5(), e = rf5De(m)[0]!, tierra = valor(m, 'tierra'), agua = valor(m, 'agua'), auto = porNombre(m, 'Auto').id, medio = atributo(m).id;
    const otroValor = must(aplicarAccion(m, { op: 'fijarEstados', args: { enlace: e.id, estados: { estado: agua } } })).modelo;
    expect(otroValor.enlaces[e.id]).toEqual({ ...e, estado: agua });
    expect(generarDocumentoOpl(otroValor)).toContain('**Auto** exhibe **Medio de Desplazamiento** en `agua`.');
    const renombrado = must(aplicarAccion(m, { op: 'renombrarEstado', args: { estado: tierra, nombre: 'suelo' } })).modelo;
    expect(renombrado.enlaces[e.id]).toEqual(e);
    expect(generarDocumentoOpl(renombrado)).toContain('**Auto** exhibe **Medio de Desplazamiento** en `suelo`.');
    estricto(renombrado);
    const reanclado = must(aplicarAccion(m, { op: 'reanclarExtremo', args: { opd: m.raiz, enlace: e.id, extremo: 'destino', hacia: { cosa: medio, estado: agua } } })).modelo;
    expect(reanclado.enlaces[e.id]).toEqual({ ...e, estado: agua });
    expect(rechazo(m, { op: 'reanclarExtremo', args: { opd: m.raiz, enlace: e.id, extremo: 'destino', hacia: { cosa: medio } } })).toMatchObject({ regla: 'AP-29' });
    expect(rechazo(m, { op: 'reanclarExtremo', args: { opd: m.raiz, enlace: e.id, extremo: 'origen', hacia: { cosa: auto, estado: agua } } })).toMatchObject({ codigo: 'forma', regla: 'R-EDIT-2' });
    // Cambiar a etiquetado con sentido conserva el valor como estado de destino (SSE2), otro hecho.
    const etiquetado = aplicarAccion(m, { op: 'cambiarTipoEnlace', args: { enlace: e.id, tipo: 'etiquetado', sentido: 'directo' } });
    if (!etiquetado.ok) throw Error(etiquetado.rechazo.mensaje);
    expect(etiquetado.valor.modelo.enlaces[e.id]).toEqual({ id: e.id, tipo: 'etiquetado', origen: auto, destino: medio, estadoDestino: tierra });
    expect(etiquetado.trazas.filter(t => t.regla === 'R-OPD-OP-5')).toEqual([]);
    const devuelto = must(aplicarAccion(etiquetado.valor.modelo, { op: 'cambiarTipoEnlace', args: { enlace: e.id, tipo: 'exhibicion', sentido: 'directo' } })).modelo;
    expect(devuelto.enlaces[e.id]).toEqual(e);
    const sinSentido = aplicarAccion(m, { op: 'cambiarTipoEnlace', args: { enlace: e.id, tipo: 'etiquetado' } });
    if (!sinSentido.ok) throw Error(sinSentido.rechazo.mensaje);
    expect(sinSentido.valor.modelo.enlaces[e.id]).toEqual({ id: e.id, tipo: 'etiquetado', origen: auto, destino: medio });
    expect(sinSentido.trazas).toEqual([expect.objectContaining({ regla: 'R-OPD-OP-5', mensaje: 'Se retiró estado al cambiar el tipo de enlace.' }),
        expect.objectContaining({ regla: 'R-OPD-OP-5', refs: [{ tipo: 'enlace', id: e.id }, { tipo: 'estado', id: tierra }] })]);
});

test('T-121 T-192 G y P conservan RF5 fuera de las listas RF2, en cualquier orden y OPD', () => {
    const b = base(), m = must(aplicarAcciones(b, [
        { op: 'crearCosa', args: { opd: b.raiz, tipo: 'objeto', nombre: 'Color', x: 0, y: 300 } },
        { op: 'crearCosa', args: { opd: b.raiz, tipo: 'objeto', nombre: 'Barco', x: 300, y: 300 } },
    ])).modelo, auto = porNombre(m, 'Auto').id, barco = porNombre(m, 'Barco').id;
    const n = must(aplicarAcciones(m, [
        { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'exhibicion', refinable: auto, refinador: porNombre(m, 'Color').id } } },
        { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'generalizacion', refinable: porNombre(m, 'Vehículo').id, refinador: barco } } },
        crearRf5(m), crearRf5(m, 'agua', 'Barco'),
    ])).modelo;
    const { doc } = estricto(n), lineas = doc.split('\n');
    expect(lineas).toContain('**Auto** exhibe **Color**.');
    expect(lineas).toContain('**Auto** exhibe **Medio de Desplazamiento** en `tierra`.');
    expect(lineas).toContain('**Barco** exhibe **Medio de Desplazamiento** en `agua`.');
    expect(lineas).toContain('**Vehículo** exhibe **Medio de Desplazamiento**.');
    expect(generarBloque(n, n.raiz).filter(l => l.plantilla === 'RF5').map(l => l.hechos)).toEqual(rf5De(n).map(e => [e.id]));
    // Enlaces en orden inverso, tras las cosas y sus estados: RF5 se ensaya después de los enlaces que la sostienen.
    const cosas = lineas.filter(l => / es físico\.$| puede estar /.test(l)), enlaces = lineas.filter(l => l.startsWith('**') && !cosas.includes(l));
    expect(enlaces.indexOf(rf5)).toBeGreaterThan(enlaces.indexOf('**Vehículo** exhibe **Medio de Desplazamiento**.'));
    const invertido = must(importarOpl(n.nombre, ['# ' + n.nombre, '', '## SD', ...cosas, ...[...enlaces].reverse()].join('\n')));
    expect(invertido.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    expect(generarDocumentoOpl(invertido.modelo)).toBe(doc);
});

test('T-121 T-192 RF5 de un OPD hijo se sostiene en hechos del padre al importar desde vacío', () => {
    const b = conRf5(), auto = porNombre(b, 'Auto').id;
    const d = must(aplicarAcciones(b, [{ op: 'crearCosa', args: { opd: b.raiz, tipo: 'objeto', nombre: 'Rueda', x: 0, y: 300 } }])).modelo;
    const m = must(aplicarAcciones(d, [
        { op: 'crearEnlace', args: { opd: d.raiz, candidato: { tipo: 'agregacion', refinable: auto, refinador: porNombre(d, 'Rueda').id } } },
        { op: 'desplegar', args: { opd: d.raiz, cosa: auto, modo: 'agregacion' } },
    ])).modelo;
    const hijo = Object.values(m.opds).find(o => o.tipo === 'despliegue')!;
    const n = must(aplicarAcciones(m, [{ op: 'traerCosa', args: { opd: hijo.id, cosa: atributo(m).id, x: 400, y: 0 } }])).modelo;
    expect(textoCanonico(generarBloque(n, hijo.id)).split('\n')).toContain(rf5);
    estricto(n);
});

test('T-121 DR-46 RF5 no integra colección, despliegue por exhibición ni la oración de valor', () => {
    const b = conRf5(), auto = porNombre(b, 'Auto').id;
    const m = must(aplicarAcciones(b, [
        { op: 'crearCosa', args: { opd: b.raiz, tipo: 'objeto', nombre: 'Color', x: 0, y: 300 } },
        { op: 'fijarValor', args: { objeto: atributo(b).id, valor: 'variable' } },
    ])).modelo;
    const n = must(aplicarAcciones(m, [
        { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'exhibicion', refinable: auto, refinador: porNombre(m, 'Color').id } } },
        { op: 'fijarIncompleta', args: { cosa: auto, relacion: 'exhibicion', activa: true } },
    ])).modelo;
    // VAL se apoya en la exhibición ordinaria del general aunque Auto se ordene antes.
    const lineas = generarDocumentoOpl(n).split('\n');
    expect(lineas).toContain('**Medio de Desplazamiento** de **Vehículo** es variable.');
    expect(lineas).toContain('**Auto** exhibe **Color** y al menos otro rasgo.');
    expect(lineas).toContain(rf5);
    estricto(n);
    const s = escena(n, n.raiz), rf5s = s.simbolos.filter(x => x.clave === `simbolo:${auto}:exhibicion:${valor(n, 'tierra')}`);
    expect(rf5s).toEqual([expect.objectContaining({ relacion: 'exhibicion', incompleta: false, ramas: [rf5De(n)[0]!.id] })]);
    expect(s.simbolos.find(x => x.clave === `simbolo:${auto}:exhibicion`)).toMatchObject({ incompleta: true });
    // Desplegar Auto por exhibición trae sus rasgos, no el atributo cuyo valor especifica.
    const desplegado = must(aplicarAccion(n, { op: 'desplegar', args: { opd: n.raiz, cosa: auto, modo: 'exhibicion' } }));
    const opd = desplegado.modelo.opds[desplegado.creados[0]!]!;
    expect(Object.keys(opd.apariciones).sort()).toEqual([auto, porNombre(n, 'Color').id].sort());
    expect(textoCanonico(generarBloque(desplegado.modelo, opd.id)).split('\n')).toContain(`**Auto** se despliega en SD1 en **Color**.`);
    estricto(desplegado.modelo);
});

test('T-212 T-121 R-OPD-STR-14 el OPD dibuja el triángulo de exhibición con la base en el valor', () => {
    const m = conRf5(), e = rf5De(m)[0]!, auto = porNombre(m, 'Auto').id, tierra = valor(m, 'tierra');
    const s = escena(m, m.raiz), simbolo = s.simbolos.find(x => x.ramas.includes(e.id))!;
    expect(simbolo).toMatchObject({ clave: `simbolo:${auto}:exhibicion:${tierra}`, refinable: auto, relacion: 'exhibicion', incompleta: false, ramas: [e.id] });
    expect(simbolo.incidencias).toContainEqual(expect.objectContaining({ refs: [e.id], extremos: [atributo(m).id], estados: [tierra] }));
    // El extremo de la rama toca la cápsula del valor, no la caja del atributo.
    const capsula = s.nodos.find(n => n.ref.id === atributo(m).id)!.estados.find(x => x.ref.id === tierra)!.caja;
    const fin = simbolo.peine.at(-1)!.at(-1)!;
    expect(fin.x).toBeGreaterThanOrEqual(capsula.x - 1); expect(fin.x).toBeLessThanOrEqual(capsula.x + capsula.ancho + 1);
    expect(fin.y).toBeGreaterThanOrEqual(capsula.y - 1); expect(fin.y).toBeLessThanOrEqual(capsula.y + capsula.alto + 1);
    expect(s.simbolos.filter(x => x.relacion === 'exhibicion')).toHaveLength(2);
    const svg = exportarDiagrama(m, m.raiz, { version: 'rf5' });
    expect(svg.ok).toBe(true); if (!svg.ok) throw Error(svg.rechazo.mensaje);
    expect(svg.valor.svg).toContain('>tierra</text>');
    expect(diagnosticar(m).filter(d => d.severidad === 'error')).toEqual([]);
});

test('T-012 T-121 importar v0 conserva RF5 y no reinterpreta anclajes que no lo son', () => {
    const b = modeloCon({ objetos: [['Vehículo', []], ['Auto', ['nuevo']], ['Medio de Desplazamiento', ['tierra', 'agua']]], procesos: ['Conducir'],
        enlaces: [['generalizacion', 'Vehículo', 'Auto'], ['exhibicion', 'Vehículo', 'Medio de Desplazamiento']] });
    const m = must(aplicarAcciones(b, [crearRf5(b)])).modelo, e = rf5De(m)[0]!, v0 = JSON.parse(exportarV0(m));
    const auto = porNombre(m, 'Auto') as Objeto, nuevo = auto.estados[0]!.id, medio = atributo(m).id;
    expect(v0.modelo.enlaces[e.id]).toEqual({ id: e.id, tipo: 'exhibicion', origenId: { kind: 'entidad', id: auto.id }, destinoId: { kind: 'estado', id: valor(m, 'tierra') }, etiqueta: '' });
    const variante = (cambio: (x: Record<string, unknown>) => Record<string, unknown>) => {
        const d = structuredClone(v0); d.modelo.enlaces[e.id] = cambio(d.modelo.enlaces[e.id]);
        const r = importarV0(JSON.stringify(d)); if (!r.ok) throw Error('Importación'); return r;
    };
    // Vértice anclado, ambos extremos anclados o exhibidor proceso: el anclaje se descarta como antes.
    const vertice = variante(x => ({ ...x, origenId: { kind: 'estado', id: nuevo }, destinoId: { kind: 'entidad', id: medio } }));
    expect(vertice.informe.descartado).toEqual([expect.objectContaining({ ruta: `enlaces.${e.id}.origenId`, regla: 'R-OPL-RF-3' })]);
    expect(vertice.modelo.enlaces[e.id]).toEqual({ id: e.id, tipo: 'exhibicion', refinable: auto.id, refinador: medio });
    const ambos = variante(x => ({ ...x, origenId: { kind: 'estado', id: nuevo } }));
    expect(ambos.informe.descartado.map(d => d.ruta)).toEqual([`enlaces.${e.id}.origenId`, `enlaces.${e.id}.destinoId`]);
    expect(ambos.modelo.enlaces[e.id]).toEqual({ id: e.id, tipo: 'exhibicion', refinable: auto.id, refinador: medio });
    const proceso = variante(x => ({ ...x, origenId: { kind: 'entidad', id: porNombre(m, 'Conducir').id } }));
    expect(proceso.informe.descartado).toEqual([expect.objectContaining({ ruta: `enlaces.${e.id}.destinoId`, regla: 'R-OPL-RF-3' })]);
    expect(proceso.modelo.enlaces[e.id]).toEqual({ id: e.id, tipo: 'exhibicion', refinable: porNombre(m, 'Conducir').id, refinador: medio });
    for (const r of [vertice, ambos, proceso]) expect(rf5De(r.modelo)).toEqual([]);
    // Sin contexto de herencia se carga y se diagnostica como error recuperable, sin repararlo.
    const gen = Object.values(m.enlaces).find(x => x.tipo === 'generalizacion')!.id;
    const sinGeneral = structuredClone(v0); delete sinGeneral.modelo.enlaces[gen];
    for (const o of Object.values(sinGeneral.modelo.opds) as { enlaces: Record<string, { enlaceId: string }> }[])
        for (const [k, v] of Object.entries(o.enlaces)) if (v.enlaceId === gen) delete o.enlaces[k];
    const cargado = importarV0(JSON.stringify(sinGeneral)); expect(cargado.ok).toBe(true);
    if (!cargado.ok) throw Error('Importación');
    expect(cargado.informe.descartado).toEqual([]);
    expect(cargado.modelo.enlaces[e.id]).toEqual(e);
    expect(diagnosticar(cargado.modelo)).toContainEqual(expect.objectContaining({ codigo: 'enlace-invalido', regla: 'R-STRE-2', severidad: 'error' }));
});

test('T-011 T-121 crear, deshacer, rehacer y recargar RF5 conservan identidad', async () => {
    const { dependencias, configuracion, ciclos } = await import('../editor/pruebas.test');
    const { crearEditor } = await import('../editor/estado');
    const d = dependencias(), m = { ...base(), id: d.m.id };
    d.documento(exportarV0(m));
    const ed = crearEditor(configuracion(d)); await ed.abrir(d.m.id);
    const abierto = ed.obtener().modelo!;
    expect(ed.ejecutar(crearRf5(abierto)).ok).toBe(true);
    const creado = ed.obtener().modelo!, e = rf5De(creado)[0]!;
    expect(ed.obtener().pasado).toHaveLength(1);
    ed.deshacer(); expect(ed.obtener().modelo).toBe(abierto);
    ed.rehacer(); expect(ed.obtener().modelo!.enlaces[e.id]).toEqual(e);
    const recargado = importarV0(exportarV0(ed.obtener().modelo!)); expect(recargado.ok).toBe(true);
    if (recargado.ok) expect(recargado.modelo.enlaces).toEqual(creado.enlaces);
    ed.cerrar(); await ciclos();
});

test('T-121 T-192 DR-46 el orden RF5 no depende de IDs aunque los nombres empaten en la colación', () => {
    const modelo = (especializaciones: readonly string[], valores: readonly (readonly [string, string])[]) => {
        const b = modeloCon({ objetos: [['Atributo', ['tierra', 'agua']], ['General', []], ...especializaciones.map(n => [n, []] as const)],
            enlaces: [['exhibicion', 'General', 'Atributo'], ...especializaciones.map(n => ['generalizacion', 'General', n] as const)] });
        const a = porNombre(b, 'Atributo') as Objeto;
        return must(aplicarAcciones(b, valores.map(([n, v]) => ({ op: 'crearEnlace', args: { opd: b.raiz, candidato: { tipo: 'exhibicion', refinable: porNombre(b, n).id, refinador: a.id, estado: a.estados.find(s => s.nombre === v)!.id } } })))).modelo;
    };
    const lineasRf5 = (m: Modelo) => generarBloque(m, m.raiz).filter(l => l.plantilla === 'RF5').map(l => l.texto);
    const esperado = ['**Zorro** exhibe **Atributo** en `tierra`.', '**Zórro** exhibe **Atributo** en `agua`.'];
    const variantes = [
        modelo(['Zorro', 'Zórro'], [['Zorro', 'tierra'], ['Zórro', 'agua']]),
        modelo(['Zórro', 'Zorro'], [['Zórro', 'agua'], ['Zorro', 'tierra']]),
        modelo(['Zórro', 'Zorro'], [['Zorro', 'tierra'], ['Zórro', 'agua']]),
    ];
    for (const m of variantes) {
        expect(erroresContexto(m)).toEqual([]);
        expect(lineasRf5(m)).toEqual(esperado);
        const nuevo = must(importarOpl(m.nombre, generarDocumentoOpl(m)));
        expect(nuevo.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
        expect(lineasRf5(nuevo.modelo)).toEqual(esperado);
    }
    // Varios valores de la misma especialización siguen el orden persistido de los estados.
    const dos = modelo(['Zorro'], [['Zorro', 'agua'], ['Zorro', 'tierra']]);
    expect(lineasRf5(dos)).toEqual(['**Zorro** exhibe **Atributo** en `tierra`.', '**Zorro** exhibe **Atributo** en `agua`.']);
    estricto(dos);
});
