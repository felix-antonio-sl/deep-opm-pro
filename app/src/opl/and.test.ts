import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace, fijarMultiplicidad, fijarRuta, fijarControl } from '../nucleo/enlaces';
import { formarAbanico } from '../nucleo/abanicos';
import { fijarGenero } from '../nucleo/cosas';
import { descomponer, desplegar } from '../nucleo/refinamiento';
import { aplicarPlan } from './aplicar';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import type { EnlaceNuevo, Multiplicidad } from '../nucleo/tipos';
import { generarBloque } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { analizar } from './analizar';
import { planificar } from './planificar';

type Caso = 'consumo' | 'resultado' | 'efecto' | 'cambio' | 'entrada' | 'salida' | 'agente' | 'instrumento';
const nombres = ['Alfa', 'Beta', 'Gamma'] as const;
const estados = [['nuevo', 'listo'], ['pendiente', 'activo'], ['vacio', 'lleno']] as const;
function modelo(caso: Caso, n: number, conEstado = false) {
    let m = modeloCon({ objetos: nombres.map((nombre, i) => [nombre, estados[i]!] as const), procesos: ['Procesar'] });
    const p = porNombre(m, 'Procesar').id, ids: string[] = [];
    for (let i = 0; i < n; i++) {
        const o = porNombre(m, nombres[i]!); if (o.tipo !== 'objeto') throw Error('Objeto esperado');
        let candidato: EnlaceNuevo;
        if (caso === 'cambio' || caso === 'entrada' || caso === 'salida')
            candidato = { tipo: 'efecto', objeto: o.id, proceso: p, ...(caso !== 'salida' ? { entrada: o.estados[0]!.id } : {}), ...(caso !== 'entrada' ? { salida: o.estados[1]!.id } : {}) };
        else candidato = { tipo: caso, objeto: o.id, proceso: p, ...(caso !== 'efecto' && conEstado ? { estado: o.estados[1]!.id } : {}) };
        const r = must(crearEnlace(m, { opd: m.raiz, candidato })); m = r.modelo; ids.push(r.creados[0]!);
    }
    expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
    return { m, ids };
}
const filas: readonly [Caso, boolean, string, string][] = [
    ['consumo', false, '*Procesar* consume **Alfa** y **Beta**.', '*Procesar* consume **Alfa**, **Beta** y **Gamma**.'],
    ['consumo', true, '*Procesar* consume **Alfa** en `listo` y **Beta** en `activo`.', '*Procesar* consume **Alfa** en `listo`, **Beta** en `activo` y **Gamma** en `lleno`.'],
    ['resultado', false, '*Procesar* genera **Alfa** y **Beta**.', '*Procesar* genera **Alfa**, **Beta** y **Gamma**.'],
    ['resultado', true, '*Procesar* genera **Alfa** en `listo` y **Beta** en `activo`.', '*Procesar* genera **Alfa** en `listo`, **Beta** en `activo` y **Gamma** en `lleno`.'],
    ['efecto', false, '*Procesar* afecta **Alfa** y **Beta**.', '*Procesar* afecta **Alfa**, **Beta** y **Gamma**.'],
    ['cambio', false, '*Procesar* cambia **Alfa** de `nuevo` a `listo` y **Beta** de `pendiente` a `activo`.', '*Procesar* cambia **Alfa** de `nuevo` a `listo`, **Beta** de `pendiente` a `activo` y **Gamma** de `vacio` a `lleno`.'],
    ['entrada', false, '*Procesar* cambia **Alfa** de `nuevo` y **Beta** de `pendiente`.', '*Procesar* cambia **Alfa** de `nuevo`, **Beta** de `pendiente` y **Gamma** de `vacio`.'],
    ['salida', false, '*Procesar* cambia **Alfa** a `listo` y **Beta** a `activo`.', '*Procesar* cambia **Alfa** a `listo`, **Beta** a `activo` y **Gamma** a `lleno`.'],
    ['agente', false, '**Alfa** y **Beta** manejan *Procesar*.', '**Alfa**, **Beta** y **Gamma** manejan *Procesar*.'],
    ['agente', true, '**Alfa** en `listo` y **Beta** en `activo` manejan *Procesar*.', '**Alfa** en `listo`, **Beta** en `activo` y **Gamma** en `lleno` manejan *Procesar*.'],
    ['instrumento', false, '*Procesar* requiere **Alfa** y **Beta**.', '*Procesar* requiere **Alfa**, **Beta** y **Gamma**.'],
    ['instrumento', true, '*Procesar* requiere **Alfa** en `listo` y **Beta** en `activo`.', '*Procesar* requiere **Alfa** en `listo`, **Beta** en `activo` y **Gamma** en `lleno`.']
];
for (const [caso, conEstado, dos, tres] of filas) for (const n of [2, 3]) {
    const texto = n === 2 ? dos : tres;
    test(`T-194 B-41 ${caso} estados=${conEstado} ${n} miembros: oración y procedencia de cada hecho`, () => {
        const { m, ids } = modelo(caso, n, conEstado), antes = exportarV0(m);
        const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
        expect(ls.map(l => l.texto)).toEqual([texto]); expect(ls[0]!.hechos).toEqual(ids);
        for (const id of ids) {
            const o = m.enlaces[id]!; if (!('objeto' in o)) throw Error('Objeto esperado');
            expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'cosa' && t.ref.id === o.objeto)).toBe(true);
            for (const sid of o.tipo === 'efecto' ? [o.entrada, o.salida] : [o.estado]) if (sid)
                expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'estado' && t.ref.id === sid)).toBe(true);
        }
        expect(planificar(m, 'modelo', generarDocumentoOpl(m)).acciones).toEqual([]);
        expect(exportarV0(m)).toBe(antes);
    });
    test(`T-194 T-192 B-41 ${caso} estados=${conEstado} ${n} miembros: lectura y reconstrucción íntegra desde vacío`, () => {
        const a = analizar(texto)[0]!; expect(a.diagnosticos).toEqual([]); expect(a.hechos).toHaveLength(n);
        expect(a.hechos.every(h => h.k === 'enlace' && h.enlace.tipo === (['cambio', 'entrada', 'salida'].includes(caso) ? 'efecto' : caso))).toBe(true);
        expect(a.hechos.map(h => h.k === 'enlace' && 'objeto' in h.enlace ? h.enlace.objeto.nombre : null)).toEqual(nombres.slice(0, n));
        const { m } = modelo(caso, n, conEstado), doc = generarDocumentoOpl(m), r = importarOpl(m.nombre, doc);
        expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
        expect(r.valor.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(r.valor.modelo)).toBe(doc);
        expect(Object.keys(r.valor.modelo.enlaces)).toHaveLength(n); expect(Object.keys(r.valor.modelo.abanicos)).toHaveLength(0);
        expect(gatesExportacion(r.valor.modelo, 'modelo')).toEqual([]);
        const json = exportarV0(r.valor.modelo), codec = importarV0(json); expect(codec.ok).toBe(true);
        if (!codec.ok) throw Error('Códec rechazado'); expect(exportarV0(codec.modelo)).toBe(json);
    });
}

test('T-194 B-41 estado parcial y multiplicidad distinta pertenecen a cada miembro', () => {
    let { m, ids } = modelo('resultado', 3, true);
    const b = m.enlaces[ids[1]!]!; if (b.tipo !== 'resultado') throw Error('Resultado esperado');
    const { estado: omitido, ...sinEstado } = b; void omitido; m = { ...m, enlaces: { ...m.enlaces, [b.id]: sinEstado } };
    for (const [i, mult] of ['?', '+', '3'].entries()) m = must(fijarMultiplicidad(m, { enlace: ids[i]!, extremo: 'objeto', valor: mult as Multiplicidad })).modelo;
    const texto = '*Procesar* genera un **Alfa** en `listo` opcional, al menos un **Beta** y 3 **Gamma** en `lleno`.';
    expect(generarBloque(m, m.raiz).filter(l => l.hechos.length).map(l => l.texto)).toEqual([texto]);
    const a = analizar(texto)[0]!; expect(a.diagnosticos).toEqual([]);
    expect(a.hechos).toEqual([
        { k: 'enlace', enlace: { tipo: 'resultado', proceso: 'Procesar', objeto: { nombre: 'Alfa', tipo: 'objeto', mult: '?', estado: 'listo' } } },
        { k: 'enlace', enlace: { tipo: 'resultado', proceso: 'Procesar', objeto: { nombre: 'Beta', tipo: 'objeto', mult: '+' } } },
        { k: 'enlace', enlace: { tipo: 'resultado', proceso: 'Procesar', objeto: { nombre: 'Gamma', tipo: 'objeto', mult: '3', estado: 'lleno' } } }
    ]);
    const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
});

test('T-194 B-41 invocador común enumera destinos sin crear un abanico', () => {
    let m = modeloCon({ procesos: ['Procesar', 'Archivar', 'Cobrar', 'Revisar'] }); const origen = porNombre(m, 'Procesar').id, ids: string[] = [];
    for (const nombre of ['Archivar', 'Cobrar', 'Revisar']) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'invocacion', origen, destino: porNombre(m, nombre).id } })); m = r.modelo; ids.push(r.creados[0]!);
    }
    const texto = '*Procesar* invoca *Archivar*, *Cobrar* y *Revisar*.';
    const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length); expect(ls.map(l => l.texto)).toEqual([texto]); expect(ls[0]!.hechos).toEqual(ids);
    expect(analizar(texto)[0]!.hechos).toEqual(['Archivar', 'Cobrar', 'Revisar'].map(destino => ({ k: 'enlace', enlace: { tipo: 'invocacion', origen: 'Procesar', destino } })));
    const r = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(Object.keys(r.modelo.enlaces)).toHaveLength(3); expect(r.modelo.abanicos).toEqual({});
});

test('T-194 B-41 lista AND no acepta «o» ni interpreta dos hechos como uno', () => {
    for (const texto of ['*Procesar* consume **Alfa** o **Beta**.', '*Procesar* cambia **Alfa** de `nuevo` a `listo` o **Beta** de `pendiente` a `activo`.'])
        expect(analizar(texto)[0]!.hechos).toEqual([]);
    expect(analizar('*Procesar* consume **Alfa** y **Beta**, y **Gamma**.')[0]!.hechos).toEqual([]);
});

const listasAnd: readonly [string, string, readonly string[]][] = [
    ['AND-consumo', '*Procesar* consume {lista}.', ['**Alfa y Archivo** en `nuevo y listo`', '**Índice o Registro**', '**Beta** en `en curso`', '**Gamma**']],
    ['AND-resultado', '*Procesar* genera {lista}.', ['**Alfa y Archivo** en `nuevo y listo`', '**Índice o Registro**', '**Beta** en `en curso`', '**Gamma**']],
    ['AND-efecto', '*Procesar* afecta {lista}.', ['**Alfa y Archivo**', '**Índice o Registro**', '**Beta**', '**Gamma**']],
    ['AND-cambio', '*Procesar* cambia {lista}.', ['**Alfa y Archivo** de `nuevo y listo` a `en curso`', '**Índice o Registro** de `pendiente` a `activo`', '**Beta** de `vacio` a `lleno`', '**Gamma** de `nuevo` a `listo`']],
    ['AND-entrada', '*Procesar* cambia {lista}.', ['**Alfa y Archivo** de `nuevo y listo`', '**Índice o Registro** de `pendiente`', '**Beta** de `vacio`', '**Gamma** de `nuevo`']],
    ['AND-salida', '*Procesar* cambia {lista}.', ['**Alfa y Archivo** a `en curso`', '**Índice o Registro** a `activo`', '**Beta** a `lleno`', '**Gamma** a `listo`']],
    ['AND-agente', '{lista} manejan *Procesar*.', ['**Alfa y Archivo** en `nuevo y listo`', '**Índice o Registro**', '**Beta** en `en curso`', '**Gamma**']],
    ['AND-instrumento', '*Procesar* requiere {lista}.', ['**Alfa y Archivo** en `nuevo y listo`', '**Índice o Registro**', '**Beta** en `en curso`', '**Gamma**']],
    ['AND-invocacion', '*Procesar* invoca {lista}.', ['*Alfa y Archivo*', '*Índice o Registro*', '*Beta*', '*Gamma*']],
    ['AND-instrumento-procesos', '{lista} requieren **Recurso** en `en curso`.', ['*Alfa y Archivo*', '*Índice o Registro*', '*Beta*', '*Gamma*']]
];
for (const [plantilla, patron, miembros] of listasAnd) {
    test(`T-150 T-194 B-41 ${plantilla} rechaza separadores fuera de A.4.3 sin producir hechos`, () => {
        const [a, b, c] = miembros;
        for (const lista of [
            `${a}, ${b}`, `${a}, ${b}, ${c}`,
            `${a} y ${b}, ${c}`, `${a} e ${b}, ${c}`,
            `${a} y ${b} y ${c}`, `${a} e ${b} e ${c}`,
            `${a}, y ${b}`, `${a} o ${b}`, `${a} y ${b} o ${c}`
        ]) {
            const r = analizar(patron.replace('{lista}', lista))[0]!;
            expect(r.hechos).toEqual([]);
            expect(r.diagnosticos.some(d => d.severidad === 'error' || d.codigo === 'unsupported-canonical')).toBe(true);
        }
    });
    test(`T-150 T-194 B-41 ${plantilla} conserva 2/3/4 miembros con cierre y/e y spans opacos`, () => {
        for (const n of [2, 3, 4]) for (const conjuncion of ['y', 'e']) {
            const lista = miembros.slice(0, n - 1).join(', ') + ` ${conjuncion} ` + miembros[n - 1];
            const texto = patron.replace('{lista}', lista), r = analizar(texto)[0]!;
            expect(r.plantilla).toBe(plantilla); expect(r.diagnosticos).toEqual([]); expect(r.hechos).toHaveLength(n);
            if (plantilla === 'AND-consumo' || plantilla === 'AND-resultado') {
                const conRuta = analizar('Por ruta Común y Especial, ' + texto)[0]!;
                expect(conRuta.diagnosticos).toEqual([]); expect(conRuta.hechos).toHaveLength(n);
                expect(conRuta.hechos.every(h => h.k === 'enlace' && 'ruta' in h.enlace && h.enlace.ruta === 'Común y Especial')).toBe(true);
            }
        }
    });
}

test('T-194 B-41 nombres con conjunciones se delimitan por su tipografía', () => {
    const a = analizar('*Procesar y Archivar* requiere **Alfa y Beta** e **Índice o Registro**.')[0]!;
    expect(a.diagnosticos).toEqual([]); expect(a.hechos).toEqual([
        { k: 'enlace', enlace: { tipo: 'instrumento', objeto: { nombre: 'Alfa y Beta', tipo: 'objeto' }, proceso: 'Procesar y Archivar' } },
        { k: 'enlace', enlace: { tipo: 'instrumento', objeto: { nombre: 'Índice o Registro', tipo: 'objeto' }, proceso: 'Procesar y Archivar' } }
    ]);
});

for (const modo of ['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'] as const)
    test(`T-132 T-194 B-41 ${modo} agrupa también los hechos del OPD hijo`, () => {
        let m = modeloCon({ objetos: [['Vehículo', []], ['Alfa', []], ['Beta', []], ['Gamma', []]] });
        const vertice = porNombre(m, 'Vehículo').id, ids: string[] = [];
        for (const nombre of nombres) {
            const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: modo, refinable: vertice, refinador: porNombre(m, nombre).id } })); m = r.modelo; ids.push(r.creados[0]!);
        }
        const r = must(desplegar(m, { opd: m.raiz, cosa: vertice, modo })); m = r.modelo;
        const hijo = r.creados[0]!, texto = modo === 'agregacion' ? '**Vehículo** consta de **Alfa**, **Beta** y **Gamma**.'
            : modo === 'exhibicion' ? '**Vehículo** exhibe **Alfa**, **Beta** y **Gamma**.'
                : modo === 'generalizacion' ? '**Alfa**, **Beta** y **Gamma** son **Vehículo**.' : '**Alfa**, **Beta** y **Gamma** son instancias de **Vehículo**.';
        const ls = generarBloque(m, hijo).filter(l => l.hechos.length); expect(ls.map(l => l.texto)).toEqual([texto]); expect(ls[0]!.hechos).toEqual(ids);
        expect(planificar(m, hijo, generarBloque(m, hijo).map(l => l.texto).join('\n')).acciones).toEqual([]);
        const doc = generarDocumentoOpl(m), vuelta = must(importarOpl(m.nombre, doc)); expect(vuelta.plan.resumen.noAplicables).toBe(0);
        expect(generarDocumentoOpl(vuelta.modelo)).toBe(doc); expect(Object.keys(vuelta.modelo.opds)).toHaveLength(2);
        expect(Object.values(vuelta.modelo.opds).find(o => o.tipo === 'despliegue')).toMatchObject({ modo });
    });

// Cada OPD compone su vista (R-CX-COMP-2): el padre dice la herencia múltiple con RH1 y el hijo del
// despliegue del general, con RF3. Son los mismos hechos; leerlos desde vacío no es un conflicto.
for (const genero of [undefined, 'f'] as const)
    test(`T-178 T-117 B-41 RH1 del padre y RF3 del hijo expresan los mismos hechos${genero ? ' con general femenino' : ''}`, () => {
        let m = modeloCon({
            objetos: [['Intermedio', []], ['Otro General', []], ['Auto', []], ['Barco', []]],
            enlaces: [['generalizacion', 'Intermedio', 'Auto'], ['generalizacion', 'Intermedio', 'Barco'], ['generalizacion', 'Otro General', 'Auto'], ['generalizacion', 'Otro General', 'Barco']],
        });
        const general = porNombre(m, 'Intermedio').id;
        if (genero) m = must(fijarGenero(m, { cosa: general, genero })).modelo;
        const d = must(desplegar(m, { opd: m.raiz, cosa: general, modo: 'generalizacion' })); m = d.modelo;
        expect(validarForma(m)).toEqual([]);
        const articulo = genero ? 'una' : 'un', hechos = (opd: string) => generarBloque(m, opd).filter(l => l.hechos.length).map(l => l.texto);
        expect(hechos(m.raiz)).toEqual([`**Auto** es ${articulo} **Intermedio** y un **Otro General**.`, `**Barco** es ${articulo} **Intermedio** y un **Otro General**.`]);
        expect(hechos(d.creados[0]!)).toEqual(['**Auto** y **Barco** son **Intermedio**.']);
        const doc = generarDocumentoOpl(m), vuelta = must(importarOpl(m.nombre, doc)), n = vuelta.modelo;
        expect(vuelta.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
        expect(Object.values(n.opds).find(o => o.tipo === 'despliegue')).toMatchObject({ modo: 'generalizacion' });
        expect(generarDocumentoOpl(n)).toBe(doc); expect(planificar(n, n.raiz, doc).acciones).toEqual([]);
        // Los mismos cuatro enlaces, sin campos que la generalización no tiene; el artículo sólo aporta género.
        const forma = (x: typeof m) => Object.values(x.enlaces).map(e => JSON.stringify(Object.entries(e).filter(([k]) => k !== 'id').map(([k, v]) => [k, typeof v === 'string' && x.cosas[v] ? x.cosas[v]!.nombre : v]))).sort();
        expect(forma(n)).toEqual(forma(m)); expect(porNombre(n, 'Intermedio').genero).toBe(genero);
        const bytes = exportarV0(n), json = importarV0(bytes); if (!json.ok) throw Error('Códec');
        expect(json.informe.descartado).toEqual([]); expect(exportarV0(json.modelo)).toBe(bytes);
    });

test('T-132 T-194 B-41 una lista del hijo no absorbe hechos de otro párrafo ni borra CX', () => {
    let m = modeloCon({ procesos: ['Gestionar'] }); const p = porNombre(m, 'Gestionar').id;
    const d = must(descomponer(m, { opd: m.raiz, proceso: p, bandas: [['Validar'], ['Archivar']] })); m = d.modelo;
    const hijo = d.creados[0]!;
    for (const nombre of ['Validar', 'Archivar']) m = must(crearEnlace(m, { opd: hijo, candidato: { tipo: 'agregacion', refinable: p, refinador: porNombre(m, nombre).id } })).modelo;
    const ls = generarBloque(m, hijo);
    expect(ls.filter(l => l.plantilla.startsWith('CX')).map(l => l.texto)).toEqual(['*Gestionar* se descompone en *Validar* y *Archivar*, en esa secuencia.']);
    expect(ls.filter(l => l.hechos.length).map(l => l.texto)).toEqual(['*Gestionar* consta de *Archivar* y *Validar*.']);
    expect(generarBloque(m, m.raiz).some(l => l.hechos.length > 0)).toBe(false);
    expect(must(importarOpl(m.nombre, generarDocumentoOpl(m))).plan.resumen.noAplicables).toBe(0);
});

for (const tipo of ['consumo', 'resultado'] as const)
    test(`T-194 B-41 ${tipo} conserva el prefijo de ruta común y separa rutas distintas`, () => {
        let { m, ids } = modelo(tipo, 3);
        for (const [i, id] of ids.entries()) m = must(fijarRuta(m, { enlace: id, ruta: i === 2 ? 'Otra' : 'Común' })).modelo;
        const verbo = tipo === 'consumo' ? 'consume' : 'genera';
        expect(generarBloque(m, m.raiz).filter(l => l.hechos.length).map(l => l.texto)).toEqual([
            `Por ruta Común, *Procesar* ${verbo} **Alfa** y **Beta**.`, `Por ruta Otra, *Procesar* ${verbo} **Gamma**.`
        ]);
        const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
        expect(Object.values(r.modelo.enlaces).map(e => 'ruta' in e ? e.ruta : undefined).sort()).toEqual(['Común', 'Común', 'Otra']);
    });

for (const operador of ['XOR', 'OR'] as const)
    test(`T-194 B-41 AND no absorbe ramas ${operador} ni fabrica otro operador`, () => {
        let { m, ids } = modelo('consumo', 3); m = must(formarAbanico(m, { enlaces: ids.slice(0, 2), operador })).modelo;
        const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
        expect(ls.map(l => l.texto)).toEqual([`*Procesar* consume ${operador === 'XOR' ? 'exactamente' : 'al menos'} uno de **Alfa** o **Beta**.`, '*Procesar* consume **Gamma**.']);
        const r = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(Object.values(r.modelo.abanicos)).toHaveLength(1);
        expect(Object.values(r.modelo.abanicos)[0]).toMatchObject({ operador }); expect(Object.values(r.modelo.enlaces)).toHaveLength(3);
    });

for (const control of ['e', 'c'] as const)
    test(`T-194 B-41 producción singular ${control} no inventa un disparo colectivo`, () => {
        let { m, ids } = modelo('instrumento', 2);
        for (const id of ids) m = must(fijarControl(m, { enlace: id, control })).modelo;
        const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length); expect(ls).toHaveLength(2);
        expect(ls.every(l => l.hechos.length === 1 && !l.plantilla.startsWith('AND-'))).toBe(true);
        const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
        expect(Object.values(r.modelo.enlaces).map(e => 'control' in e ? e.control : undefined)).toEqual([control, control]);
    });

test('T-173 T-194 B-41 editar un miembro conserva IDs y quitar texto no borra los otros', () => {
    const { m, ids } = modelo('resultado', 2), antes = exportarV0(m), doc = generarDocumentoOpl(m);
    const beta = m.enlaces[ids[1]!]!; if (beta.tipo !== 'resultado') throw Error('Resultado esperado');
    const editado = doc.replace('*Procesar* genera **Alfa** y **Beta**.', '*Procesar* genera **Alfa** y 3 **Beta**.');
    const p = planificar(m, 'modelo', editado); expect(p.resumen.noAplicables).toBe(0);
    expect(p.acciones.some(a => a.op === 'fijarMultiplicidad' && a.args.enlace === ids[1] && a.args.valor === '3')).toBe(true);
    expect(p.acciones.every(a => 'enlace' in a.args && a.args.enlace === ids[1])).toBe(true);
    const r = must(aplicarPlan(m, p)); expect(Object.keys(r.modelo.enlaces)).toEqual(ids);
    expect(r.modelo.enlaces[ids[0]!]).toBe(m.enlaces[ids[0]!]); expect(r.modelo.enlaces[ids[1]!]).toMatchObject({ mult: '3' });
    expect(r.modelo).toEqual({ ...m, enlaces: { ...m.enlaces, [ids[1]!]: { ...beta, mult: '3' } } });
    expect(exportarV0(m)).toBe(antes);
    const quitado = doc.replace('*Procesar* genera **Alfa** y **Beta**.', '*Procesar* genera **Alfa**.');
    const q = planificar(m, 'modelo', quitado); expect(q.acciones).toEqual([]); expect(q.notas.some(d => d.codigo === 'no-delete-by-absence')).toBe(true);
    expect(exportarV0(must(aplicarPlan(m, q)).modelo)).toBe(antes);
});

test('T-174 T-194 B-41 un miembro inválido rechaza la línea completa y revierte el ensayo', () => {
    const m = modeloCon({ objetos: [['Alfa', ['nuevo', 'listo']], ['Beta', []]], procesos: ['Procesar'] }), antes = exportarV0(m);
    const p = planificar(m, 'modelo', '*Procesar* afecta **Alfa** y **Beta**.');
    expect(p.resumen.noAplicables).toBe(1); expect(p.lineas[0]!.diagnosticos.some(d => d.regla === 'R-EFE-1')).toBe(true);
    expect(p.acciones).toEqual([]); expect(exportarV0(must(aplicarPlan(m, p)).modelo)).toBe(antes);
});

test('T-173 T-194 B-41 las oraciones atómicas anteriores conservan identidad y se normalizan a lista', () => {
    const { m } = modelo('consumo', 2, true), antes = exportarV0(m), doc = generarDocumentoOpl(m);
    const atomo = doc.replace('*Procesar* consume **Alfa** en `listo` y **Beta** en `activo`.', '*Procesar* consume **Alfa** en `listo`.\n*Procesar* consume **Beta** en `activo`.');
    const p = planificar(m, 'modelo', atomo); expect(p.resumen.noAplicables).toBe(0); expect(p.acciones).toEqual([]);
    expect(exportarV0(must(aplicarPlan(m, p)).modelo)).toBe(antes);
    const r = must(importarOpl(m.nombre, atomo)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
    expect(Object.values(r.modelo.enlaces)).toHaveLength(2); expect(r.modelo.abanicos).toEqual({});
});

test('T-194 B-41 TS3, TS4 y efecto básico no comparten producción de lista', () => {
    let m = modeloCon({ objetos: nombres.map((nombre, i) => [nombre, estados[i]!] as const), procesos: ['Procesar'] });
    for (const [i, nombre] of nombres.entries()) {
        const o = porNombre(m, nombre); if (o.tipo !== 'objeto') throw Error('Objeto esperado');
        m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: o.id, proceso: porNombre(m, 'Procesar').id,
            ...(i < 2 ? { entrada: o.estados[0]!.id } : {}), ...(i === 0 ? { salida: o.estados[1]!.id } : {}) } })).modelo;
    }
    const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
    expect(ls.map(l => l.texto)).toEqual(['*Procesar* cambia **Alfa** de `nuevo` a `listo`.', '*Procesar* cambia **Beta** de `pendiente`.', '*Procesar* afecta **Gamma**.']);
    expect(ls.every(l => l.hechos.length === 1)).toBe(true);
    const doc = generarDocumentoOpl(m); expect(generarDocumentoOpl(must(importarOpl(m.nombre, doc)).modelo)).toBe(doc);
});

test('T-194 B-41 invocación con destino común y autoinvocación mantienen su producción singular', () => {
    let m = modeloCon({ procesos: ['Procesar', 'Archivar', 'Cobrar'] });
    const procesar = porNombre(m, 'Procesar').id;
    for (const nombre of ['Procesar', 'Archivar', 'Cobrar']) m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'invocacion', origen: porNombre(m, nombre).id, destino: procesar } })).modelo;
    const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
    expect(ls.map(l => l.texto)).toEqual(['*Archivar* invoca *Procesar*.', '*Cobrar* invoca *Procesar*.', '*Procesar* se invoca a sí mismo.']);
    expect(ls.every(l => l.hechos.length === 1)).toBe(true);
    const doc = generarDocumentoOpl(m); expect(generarDocumentoOpl(must(importarOpl(m.nombre, doc)).modelo)).toBe(doc);
});

for (const operador of ['XOR', 'OR'] as const)
    test(`T-194 B-41 DS10 conserva las ramas ${operador} separadas de la lista AND de la misma ruta`, () => {
        let m = modeloCon({ objetos: ['Alfa', 'Beta', 'Gamma', 'Delta'].map(n => [n, []] as const), procesos: ['Procesar'] });
        const ids: string[] = [];
        for (const nombre of ['Alfa', 'Beta', 'Gamma', 'Delta']) {
            const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: porNombre(m, nombre).id, proceso: porNombre(m, 'Procesar').id } })); m = r.modelo; ids.push(r.creados[0]!);
        }
        m = must(formarAbanico(m, { enlaces: ids.slice(0, 2), operador })).modelo;
        for (const id of ids) m = must(fijarRuta(m, { enlace: id, ruta: 'Común' })).modelo;
        const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
        expect(ls.map(l => l.texto)).toEqual(['Por ruta Común, *Procesar* consume **Alfa**.', 'Por ruta Común, *Procesar* consume **Beta**.', 'Por ruta Común, *Procesar* consume **Delta** y **Gamma**.']);
        expect(ls.map(l => l.hechos)).toEqual([[ids[0]!], [ids[1]!], [ids[3]!, ids[2]!]]);
        const p = planificar(m, 'modelo', generarDocumentoOpl(m)); expect(p.acciones).toEqual([]);
        expect(exportarV0(must(aplicarPlan(m, p)).modelo)).toBe(exportarV0(m));
        expect(Object.values(m.abanicos)[0]).toMatchObject({ operador });
    });

for (const conEstado of [false, true]) for (const n of [2, 3])
    test(`T-194 B-41 instrumento común con ${n} procesos estado=${conEstado}: lista, procedencia e inversa`, () => {
        let m = modeloCon({ objetos: [['Herramienta', ['lista', 'ocupada']]], procesos: ['Archivar', 'Cobrar', 'Revisar'] });
        const o = porNombre(m, 'Herramienta'); if (o.tipo !== 'objeto') throw Error('Objeto esperado');
        const ids: string[] = [];
        for (const nombre of ['Archivar', 'Cobrar', 'Revisar'].slice(0, n)) {
            const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'instrumento', objeto: o.id, proceso: porNombre(m, nombre).id, mult: '3', ...(conEstado ? { estado: o.estados[0]!.id } : {}) } })); m = r.modelo; ids.push(r.creados[0]!);
        }
        const texto = `${n === 2 ? '*Archivar* y *Cobrar*' : '*Archivar*, *Cobrar* y *Revisar*'} requieren 3 **Herramienta**${conEstado ? ' en `lista`' : ''}.`;
        const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length); expect(ls.map(l => l.texto)).toEqual([texto]); expect(ls[0]!.hechos).toEqual(ids);
        for (const id of ids) {
            const e = m.enlaces[id]!; if (e.tipo !== 'instrumento') throw Error('Instrumento esperado');
            expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'cosa' && t.ref.id === e.proceso)).toBe(true);
        }
        const a = analizar(texto)[0]!; expect(a.diagnosticos).toEqual([]); expect(a.hechos).toHaveLength(n);
        const doc = generarDocumentoOpl(m), antes = exportarV0(m); expect(planificar(m, 'modelo', doc).acciones).toEqual([]); expect(exportarV0(m)).toBe(antes);
        const r = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(Object.values(r.modelo.enlaces)).toHaveLength(n);
        expect(Object.values(r.modelo.enlaces).every(e => e.tipo === 'instrumento' && e.mult === '3' && (conEstado ? !!e.estado : !e.estado))).toBe(true);
        const json = exportarV0(r.modelo), codec = importarV0(json); expect(codec.ok).toBe(true); if (!codec.ok) throw Error('Códec rechazado'); expect(exportarV0(codec.modelo)).toBe(json);
    });

test('T-194 B-41 instrumento común no hereda estados ausentes ni multiplicidades distintas', () => {
    let m = modeloCon({ objetos: [['Herramienta', ['lista', 'ocupada']]], procesos: ['Archivar', 'Cobrar', 'Revisar', 'Validar'] });
    const o = porNombre(m, 'Herramienta'); if (o.tipo !== 'objeto') throw Error('Objeto esperado');
    for (const [i, nombre] of ['Archivar', 'Cobrar', 'Revisar', 'Validar'].entries()) m = must(crearEnlace(m, { opd: m.raiz, candidato: {
        tipo: 'instrumento', objeto: o.id, proceso: porNombre(m, nombre).id, ...(i !== 1 ? { estado: o.estados[i < 2 ? 0 : 1]!.id } : {}), ...(i === 3 ? { mult: '3' } : {})
    } })).modelo;
    const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
    expect(ls.map(l => l.texto)).toEqual(['*Archivar* requiere **Herramienta** en `lista`.', '*Cobrar* requiere **Herramienta**.', '*Revisar* requiere **Herramienta** en `ocupada`.', '*Validar* requiere 3 **Herramienta** en `ocupada`.']);
    expect(ls.every(l => l.hechos.length === 1)).toBe(true);
    const doc = generarDocumentoOpl(m); expect(generarDocumentoOpl(must(importarOpl(m.nombre, doc)).modelo)).toBe(doc);
});

for (const completa of [false, true])
    test(`T-194 B-41 matriz instrumento ${completa ? 'completa' : 'dispersa'} prioriza proceso y es estable sin duplicar hechos`, () => {
        let m = modeloCon({ objetos: [['Alfa', []], ['Beta', []]], procesos: completa ? ['Archivar', 'Cobrar'] : ['Archivar', 'Cobrar', 'Revisar'] });
        const pares = completa ? [['Archivar', 'Alfa'], ['Archivar', 'Beta'], ['Cobrar', 'Alfa'], ['Cobrar', 'Beta']] : [['Archivar', 'Alfa'], ['Archivar', 'Beta'], ['Cobrar', 'Beta'], ['Revisar', 'Beta']];
        const ids: string[] = [];
        for (const [p, o] of pares) { const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'instrumento', objeto: porNombre(m, o!).id, proceso: porNombre(m, p!).id } })); m = r.modelo; ids.push(r.creados[0]!); }
        const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length), texto = completa
            ? ['*Archivar* requiere **Alfa** y **Beta**.', '*Cobrar* requiere **Alfa** y **Beta**.']
            : ['*Archivar* requiere **Alfa** y **Beta**.', '*Cobrar* y *Revisar* requieren **Beta**.'];
        expect(ls.map(l => l.texto)).toEqual(texto); expect(ls.flatMap(l => l.hechos).sort()).toEqual([...ids].sort());
        expect(new Set(ls.flatMap(l => l.hechos)).size).toBe(ids.length);
        const invertido = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).reverse()) }; expect(generarBloque(invertido, m.raiz)).toEqual(generarBloque(m, m.raiz));
        const doc = generarDocumentoOpl(m); expect(generarDocumentoOpl(must(importarOpl(m.nombre, doc)).modelo)).toBe(doc);
    });

test('T-194 B-41 instrumento común no absorbe procesos de un abanico', () => {
    let m = modeloCon({ objetos: [['Herramienta', []]], procesos: ['Archivar', 'Cobrar', 'Procesar', 'Revisar'] }); const ids: string[] = [];
    for (const nombre of ['Archivar', 'Cobrar', 'Procesar', 'Revisar']) { const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'instrumento', objeto: porNombre(m, 'Herramienta').id, proceso: porNombre(m, nombre).id } })); m = r.modelo; ids.push(r.creados[0]!); }
    m = must(formarAbanico(m, { enlaces: ids.slice(0, 2), operador: 'XOR' })).modelo;
    const ls = generarBloque(m, m.raiz).filter(l => l.hechos.length);
    expect(ls).toHaveLength(2); expect(ls[0]!.hechos).toEqual(ids.slice(0, 2)); expect(ls[0]!.plantilla).toMatch(/^FAN-/);
    expect(ls[1]!.texto).toBe('*Procesar* y *Revisar* requieren **Herramienta**.'); expect(ls[1]!.hechos).toEqual(ids.slice(2));
    expect(planificar(m, 'modelo', generarDocumentoOpl(m)).acciones).toEqual([]);
});

for (const tipo of ['consumo', 'resultado', 'instrumento', 'agente', 'cambio'] as const)
    test(`T-182 T-194 B-41 un estado distinto por texto en ${tipo} no reemplaza la identidad del segundo miembro`, () => {
        const { m, ids } = modelo(tipo, 2, true), previo = exportarV0(m), beta = porNombre(m, 'Beta');
        if (beta.tipo !== 'objeto') throw Error('Objeto esperado');
        const doc = generarDocumentoOpl(m), linea = generarBloque(m, m.raiz).find(l => l.hechos.includes(ids[1]!))!.texto;
        const editado = doc.replace(linea, linea.replace('`activo`', '`pendiente`')); expect(editado).not.toBe(doc);
        const p = planificar(m, 'modelo', editado);
        expect(p.resumen.noAplicables).toBe(1); expect(p.lineas.find(l => l.estado === 'no-aplicable')!.diagnosticos).toEqual([expect.objectContaining({ codigo: 'type-mismatch', regla: 'R-ROL-UNIC-1' })]);
        expect(p.acciones).toEqual([]); expect(exportarV0(must(aplicarPlan(m, p)).modelo)).toBe(previo);
        expect(Object.keys(m.enlaces)).toEqual(ids);
        expect(exportarV0(m)).toBe(previo);
    });

test('T-174 T-194 B-41 el cambio de estado no elige una rama entre enlaces del mismo objeto y proceso', () => {
    let m = modeloCon({ objetos: [['Alfa', ['nuevo', 'listo', 'archivado']]], procesos: ['Procesar'] });
    const o = porNombre(m, 'Alfa'); if (o.tipo !== 'objeto') throw Error('Objeto esperado');
    const a = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: o.id, estado: o.estados[0]!.id, proceso: porNombre(m, 'Procesar').id } })); m = a.modelo;
    m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: o.id, estado: o.estados[1]!.id, proceso: porNombre(m, 'Procesar').id }, abanicoCon: { enlace: a.creados[0]!, operador: 'XOR' } })).modelo;
    const antes = exportarV0(m), p = planificar(m, 'modelo', '*Procesar* consume **Alfa** en `archivado`.');
    expect(p.resumen.noAplicables).toBe(1); expect(p.acciones).toEqual([]); expect(exportarV0(must(aplicarPlan(m, p)).modelo)).toBe(antes);
});
