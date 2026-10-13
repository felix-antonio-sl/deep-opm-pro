import { expect, test } from 'bun:test';
import { modeloCon, porNombre, congelar, must } from '../pruebas/constructores';
import type { Modelo, EnlaceProcedimental } from '../nucleo/tipos';
import { aplicarAccion, type Accion } from '../nucleo/operaciones';
import { erroresContexto } from '../nucleo/matriz';
import { generarBloque } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { analizar } from './analizar';
import { planificar } from './planificar';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { exportarDiagrama, exportarDocumento } from '../opd/exportar';
import { gatesExportacion, gatesDocumento } from '../nucleo/diagnostico';
import { crearEditor } from '../editor/estado';
import { dependencias, configuracion, ciclos } from '../editor/pruebas.test';

function plural(m: Modelo, nombre: string, valor: string | null): Modelo {
    return must(aplicarAccion(m, { op: 'fijarNombrePlural', args: { cosa: porNombre(m, nombre).id, nombre: valor } } as unknown as Accion)).modelo;
}
function preparado(q = '2'): Modelo {
    let m = modeloCon({ objetos: [['Pieza', ['lista']], ['Piezas', []]], procesos: ['Ensamblar'], enlaces: [['consumo', 'Pieza', 'Ensamblar']] });
    const e = Object.values(m.enlaces)[0]!;
    m = must(aplicarAccion(m, { op: 'fijarMultiplicidad', args: { enlace: e.id, extremo: 'objeto', valor: q } })).modelo;
    return m;
}
function fijo(m: Modelo) {
    const doc = generarDocumentoOpl(m), antes = JSON.stringify(m), p = planificar(m, 'modelo', doc);
    expect(p.acciones).toEqual([]);
    expect(p.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    const r = importarOpl(m.nombre, doc); expect(r.ok).toBe(true);
    if (!r.ok) throw Error(JSON.stringify(r));
    expect(generarDocumentoOpl(r.valor.modelo)).toBe(doc);
    const v = importarV0(exportarV0(m)); expect(v.ok).toBe(true);
    if (!v.ok) throw Error(JSON.stringify(v));
    expect(v.informe.descartado).toEqual([]);
    expect(exportarV0(v.modelo)).toBe(exportarV0(m));
    expect(JSON.stringify(m)).toBe(antes);
    return r.valor.modelo;
}

test('T-176 T-192 B-42 DEC56 el metadato plural es un hecho de presentación explícito', () => {
    const l = analizar('Forma plural de **Pieza**: «Piezas».')[0]!;
    expect(l.diagnosticos).toEqual([]);
    expect(l.hechos).toEqual([{ k: 'plural', objeto: 'Pieza', nombre: 'Piezas' }]);
});

test('T-128 T-192 B-42 DEC56 la emisión de un dato explícito mantiene el nombre nuclear', () => {
    const base = preparado(), c = porNombre(base, 'Pieza');
    const m = congelar({ ...base, cosas: { ...base.cosas, [c.id]: { ...c, nombrePlural: 'Piezas' } } });
    expect(generarDocumentoOpl(m)).toContain('*Ensamblar* consume 2 **Piezas** [nombre: «Pieza»].');
    expect(m.cosas[c.id]!.nombre).toBe('Pieza');
});

test('T-057 T-128 T-192 B-42 DEC56 plural explícito conserva Pieza/Piezas y referencia canónica', () => {
    const m = plural(preparado(), 'Pieza', 'Piezas'), id = porNombre(m, 'Pieza').id;
    const doc = generarDocumentoOpl(m);
    expect(doc).toContain('Forma plural de **Pieza**: «Piezas».');
    expect(doc).toContain('*Ensamblar* consume 2 **Piezas** [nombre: «Pieza»].');
    const tokens = generarBloque(m, m.raiz).find(l => l.hechos.length)!.tokens;
    expect(tokens.find(t => t.texto === 'Piezas')?.ref).toEqual({ tipo: 'cosa', id });
    expect(tokens.find(t => t.texto === 'Piezas')?.formaPlural).toBe(true);
    expect(generarBloque(m, m.raiz).flatMap(l => l.tokens).filter(t => t.texto === 'Pieza' && t.ref?.id === id)
        .every(t => !t.formaPlural)).toBe(true);
    const r = fijo(m);
    expect(porNombre(r, 'Pieza')).toMatchObject({ nombrePlural: 'Piezas' });
    expect(porNombre(r, 'Piezas').id).not.toBe(porNombre(r, 'Pieza').id);
});

test('T-025 T-011 T-192 B-42 DEC56 forma sin uso, invariante, rename y retirada son reversibles', () => {
    let m = modeloCon({ objetos: [['Análisis', []], ['Dato', []]], procesos: [] });
    m = plural(m, 'Análisis', 'Análisis'); m = plural(m, 'Dato', 'Datos de entrada');
    const antes = JSON.stringify(m);
    expect(generarDocumentoOpl(m)).toContain('Forma plural de **Análisis**: «Análisis».');
    expect(porNombre(fijo(m), 'Dato')).toMatchObject({ nombrePlural: 'Datos de entrada' });
    m = must(aplicarAccion(m, { op: 'renombrarCosa', args: { cosa: porNombre(m, 'Dato').id, nombre: 'Registro' } })).modelo;
    expect(porNombre(m, 'Registro')).toMatchObject({ nombrePlural: 'Datos de entrada' });
    m = plural(m, 'Registro', null);
    expect('nombrePlural' in porNombre(m, 'Registro')).toBe(false);
    expect(JSON.stringify(m)).not.toBe(antes);
    const invalida = aplicarAccion(m, { op: 'fijarNombrePlural', args: { cosa: porNombre(m, 'Registro').id, nombre: 'Datos  malos' } } as unknown as Accion);
    expect(invalida?.ok).toBe(false);
});

for (const [q, usaPlural] of [['1', false], ['?', false], ['+', false], ['(4/2)-1', false], ['1..1', false], ['1,1', false],
    ['0', true], ['2', true], ['*', true], ['muchos', true], ['2..*', true], ['0..1', true], ['n; n=1', true]] as const)
    test(`T-057 T-128 T-192 B-42 DEC56 cantidad ${q} elige singular/plural estático sin solver`, () => {
        const m = plural(preparado(q), 'Pieza', 'Piezas'), lineas = generarBloque(m, m.raiz).filter(l => l.hechos.length);
        expect(lineas.some(l => l.texto.includes('[nombre: «Pieza»]'))).toBe(usaPlural);
        fijo(m);
    });

test('T-193 T-288 B-42 DEC56 forma faltante conserva recuperación y SVG, exige completar documento', () => {
    const m = preparado(), antes = exportarV0(m), doc = generarDocumentoOpl(m);
    expect(doc).toContain('2 **Pieza**');
    expect(importarOpl(m.nombre, doc).ok).toBe(true);
    expect(gatesExportacion(m, { opd: m.raiz })).toEqual([]);
    expect(exportarDiagrama(m, m.raiz, { version: 'prueba' }).ok).toBe(true);
    expect(gatesExportacion(m, 'modelo')).toEqual([]);
    expect(gatesDocumento(m).some(g => g.regla === 'DEC56/DR-12')).toBe(true);
    expect(exportarDocumento(m, new Map([[m.raiz, generarBloque(m, m.raiz)]]), { version: 'prueba' }).ok).toBe(false);
    expect(exportarV0(m)).toBe(antes);
});

test('T-176 T-178 B-42 DEC56 declaraciones o marcadores incompatibles no crean una entidad plausible', () => {
    const base = plural(preparado(), 'Pieza', 'Piezas'), antes = exportarV0(base);
    for (const texto of ['Forma plural de **Pieza**: «Piezas».\nForma plural de **Pieza**: «Componentes».',
        'Forma plural de **Pieza**: «Piezas».\n*Ensamblar* consume 2 **Componentes** [nombre: «Pieza»].',
        '*Ensamblar* consume 2 **Piezas** [nombre: «Fantasma»].\n*Ensamblar* consume 2 **Componentes** [nombre: «Fantasma»].']) {
        const p = planificar(base, 'modelo', texto);
        expect(p.lineas.some(l => l.diagnosticos.length)).toBe(true);
        expect(p.acciones).toEqual([]);
        expect(exportarV0(base)).toBe(antes);
    }
});

test('T-119 T-128 T-192 B-42 DEC56 default plural no absorbe la etiqueta libre se relacionan con', () => {
    let base = modeloCon({ objetos: [['Pieza', []], ['Destino', []]] });
    base = plural(base, 'Pieza', 'Piezas');
    const modelos = [undefined, 'se relacionan con'].map(etiqueta => must(aplicarAccion(base, { op: 'crearEnlace', args: { opd: base.raiz,
        candidato: { tipo: 'etiquetado', origen: porNombre(base, 'Pieza').id, destino: porNombre(base, 'Destino').id,
            multOrigen: '2', ...(etiqueta ? { etiqueta } : {}) } } })).modelo);
    expect(generarDocumentoOpl(modelos[0]!)).not.toBe(generarDocumentoOpl(modelos[1]!));
    for (const [i, m] of modelos.entries()) {
        const r = fijo(m), e = Object.values(r.enlaces)[0]!;
        expect(e.tipo === 'etiquetado' && e.etiqueta).toBe(i ? 'se relacionan con' : undefined);
    }
});

for (const etiqueta of [undefined, 'se relaciona con', 'se relacionan con'])
    for (const estados of ['ninguno', 'origen', 'destino', 'ambos']) for (const n of [1, 2, 3])
        for (const cantidad of ['1', '2', 'n; n>=1', '*; n>=0'])
            test(`T-119 T-128 T-182 T-192 DEC57 UNI ${etiqueta ?? 'ausente'}/${estados}/${n}/${cantidad} conserva default o etiqueta libre`, () => {
                let m = modeloCon({ objetos: [['Pieza', ['lista']], ['Destino', ['activo']], ['Otro', ['activo']], ['Tercero', ['activo']]] });
                for (const [nombre, forma] of [['Pieza', 'Piezas'], ['Destino', 'Destinos'], ['Otro', 'Otros'], ['Tercero', 'Terceros']])
                    m = plural(m, nombre!, forma!);
                const o = porNombre(m, 'Pieza'); if (o.tipo !== 'objeto') throw Error('Montaje');
                for (const nombre of ['Destino', 'Otro', 'Tercero'].slice(0, n)) {
                    const d = porNombre(m, nombre); if (d.tipo !== 'objeto') throw Error('Montaje');
                    m = must(aplicarAccion(m, { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: o.id,
                        destino: d.id, multOrigen: cantidad, multDestino: '2', ...(etiqueta ? { etiqueta } : {}),
                        ...(['origen', 'ambos'].includes(estados) ? { estadoOrigen: o.estados[0]!.id } : {}),
                        ...(['destino', 'ambos'].includes(estados) ? { estadoDestino: d.estados[0]!.id } : {}) } } })).modelo;
                }
                const doc = generarDocumentoOpl(m), esPlural = cantidad !== '1', libre = etiqueta === 'se relacionan con';
                const sujeto = '[nombre: «Pieza»]'+(['origen','ambos'].includes(estados)?' en `lista`':'')
                    +(cantidad.startsWith('*')?' opcionales':'')+(cantidad.includes(';')?`, **donde n >= ${cantidad.startsWith('*')?'0':'1'}**`:'');
                expect(doc).toContain(libre ? '«se relacionan con»' : esPlural ? sujeto+' se relacionan con' : '«se relaciona con»');
                if (!libre) expect(doc).not.toContain('«se relacionan con»');
                const r = fijo(m), xs = Object.values(r.enlaces);
                expect(xs).toHaveLength(n);
                for (const e of xs) {
                    expect(e.tipo).toBe('etiquetado'); if (e.tipo !== 'etiquetado') throw Error('Enlace');
                    expect(e.multOrigen).toBe(cantidad); expect(e.multDestino).toBe('2');
                    if (libre) expect(e.etiqueta).toBe('se relacionan con');
                    else expect([undefined, 'se relaciona con']).toContain(e.etiqueta);
                    expect(Boolean(e.estadoOrigen)).toBe(['origen', 'ambos'].includes(estados));
                    expect(Boolean(e.estadoDestino)).toBe(['destino', 'ambos'].includes(estados));
                }
            });

for (const invertir of [false, true]) test(`T-119 T-128 T-192 DEC57 lista mezcla ausente y reservado independiente de orden=${invertir}`, () => {
    let m = modeloCon({ objetos: [['Pieza', []], ['Destino', []], ['Otro', []]] }); m = plural(m, 'Pieza', 'Piezas');
    for (const nombre of invertir ? ['Otro', 'Destino'] : ['Destino', 'Otro'])
        m = must(aplicarAccion(m, { op:'crearEnlace',args:{opd:m.raiz,candidato:{tipo:'etiquetado',origen:porNombre(m,'Pieza').id,
            destino:porNombre(m,nombre).id,multOrigen:'2',...(nombre==='Otro'?{etiqueta:'se relaciona con'}:{})}}})).modelo;
    const antes = exportarV0(m), doc = generarDocumentoOpl(m);
    expect(doc).toContain('2 **Piezas** [nombre: «Pieza»] se relacionan con **Destino** y **Otro**.');
    expect(generarBloque(m,m.raiz).filter(l=>l.hechos.length)).toHaveLength(1); fijo(m);
    expect(exportarV0(m)).toBe(antes);
});

for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const) for (const evento of [false, true])
    if (tipo !== 'resultado' || !evento) test(`T-052 T-057 T-128 T-192 B-42 DEC56 ${tipo}/evento=${evento} plural, estado y restricción íntegros`, () => {
        let m = plural(preparado('2..5; n>=1'), 'Pieza', 'Piezas');
        m = { ...m, enlaces: {} };
        const o = porNombre(m, 'Pieza'); if (o.tipo !== 'objeto') throw Error('Fixture');
        m = must(aplicarAccion(m, { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo, objeto: o.id,
            proceso: porNombre(m, 'Ensamblar').id, mult: '2..5; n>=1', estado: o.estados[0]!.id,
            ...(evento ? { control: 'e' as const } : {}) } } })).modelo;
        const l = generarBloque(m, m.raiz).find(l => l.hechos.length)!;
        expect(l.texto).toContain('**Piezas** [nombre: «Pieza»] en `lista`');
        expect(l.tokens.some(t => t.ref?.id === o.estados[0]!.id && t.hecho === Object.keys(m.enlaces)[0])).toBe(true);
        const r = fijo(m), e = Object.values(r.enlaces)[0]!;
        expect('mult' in e && e.mult).toBe('2..5; n>=1');
        expect('control' in e ? e.control : undefined).toBe(evento ? 'e' : undefined);
    });

test('T-025 T-057 T-192 B-42 DEC56 procesos, forma inválida y conversión no descartan la forma', () => {
    const m = plural(preparado(), 'Pieza', 'Piezas'), antes = exportarV0(m);
    expect(aplicarAccion(m, { op: 'fijarNombrePlural', args: { cosa: porNombre(m, 'Ensamblar').id, nombre: 'Ensamblajes' } }).ok).toBe(false);
    for (const nombre of ['pieza', ' Piezas', 'Piezas ', 'Piezas  Nuevas', 'Piezas»'])
        expect(aplicarAccion(m, { op: 'fijarNombrePlural', args: { cosa: porNombre(m, 'Pieza').id, nombre } }).ok).toBe(false);
    expect(aplicarAccion(m, { op: 'cambiarTipoCosa', args: { cosa: porNombre(m, 'Pieza').id } }).ok).toBe(false);
    expect(exportarV0(m)).toBe(antes);
});

for (const operador of ['XOR', 'OR'] as const) for (const n of [2, 3, 4])
    for (const tipo of ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'] as const)
        test(`T-054 T-057 T-128 T-192 B-42 DEC56 ${tipo}/${operador}/${n} común O conserva cantidades por rama`, () => {
            const nombres = ['Ensamblar', 'Reparar', 'Inspeccionar', 'Embalar'].slice(0, n);
            let m = modeloCon({ objetos: [['Pieza', ['lista', 'usada']]], procesos: nombres });
            m = must(aplicarAccion(m, { op: 'fijarEsencia', args: { cosa: porNombre(m, 'Pieza').id, esencia: 'fisica' } })).modelo;
            m = plural(m, 'Pieza', 'Piezas');
            const ids: string[] = [];
            for (const [i, nombre] of nombres.entries()) {
                const r = aplicarAccion(m, { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo, objeto: porNombre(m, 'Pieza').id, proceso: porNombre(m, nombre).id, mult: i % 2 ? 'm; m>=0' : 'n; n>=1' } } });
                expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r));
                m = r.valor.modelo; ids.push(r.valor.creados[0]!);
            }
            m = must(aplicarAccion(m, { op: 'formarAbanico', args: { enlaces: ids, operador } })).modelo;
            expect(erroresContexto(m)).toEqual([]);
            const l = generarBloque(m, m.raiz).find(l => l.plantilla.startsWith('FAN-ramas-'))!;
            expect(l).toBeDefined();
            expect(l.texto.startsWith(operador === 'XOR' ? 'Exactamente uno de ' : 'Al menos uno de ')).toBe(true);
            expect(new Set(l.hechos)).toEqual(new Set(ids));
            expect(analizar(l.texto)[0]!.hechos[0]).toMatchObject({ k: 'abanico', operador });
            const r = fijo(m), es = Object.values(r.enlaces) as EnlaceProcedimental[];
            expect(es).toHaveLength(n);
            expect(es.map(e => [r.cosas[e.proceso]!.nombre, e.mult]).sort()).toEqual(Object.values(m.enlaces).map(e => [m.cosas[(e as EnlaceProcedimental).proceso]!.nombre, (e as EnlaceProcedimental).mult]).sort());
            expect(Object.values(r.abanicos)[0]).toMatchObject({ operador });
        });

test('T-011 T-025 T-128 DEC56 fijar, renombrar y retirar plural son pasos únicos reversibles del editor', async () => {
    const d = dependencias(), ed = crearEditor(configuracion(d)); await ed.abrir(d.m.id);
    const base = ed.obtener().modelo!, id = porNombre(base, 'Pedido').id, antes = exportarV0(base);
    try {
        expect(ed.ejecutar({ op: 'fijarNombrePlural', args: { cosa: id, nombre: 'Pedidos de compra' } }).ok).toBe(true);
        const conPlural = ed.obtener().modelo!;
        expect(ed.obtener().pasado).toHaveLength(1);
        expect(porNombre(conPlural, 'Pedido')).toMatchObject({ id, nombrePlural: 'Pedidos de compra' });
        ed.deshacer(); expect(ed.obtener().modelo).toBe(base);
        ed.rehacer(); expect(ed.obtener().modelo).toBe(conPlural);
        expect(ed.ejecutar({ op: 'renombrarCosa', args: { cosa: id, nombre: 'Orden' } }).ok).toBe(true);
        expect(porNombre(ed.obtener().modelo!, 'Orden')).toMatchObject({ id, nombrePlural: 'Pedidos de compra' });
        ed.deshacer(); expect(ed.obtener().modelo).toBe(conPlural);
        expect(ed.ejecutar({ op: 'fijarNombrePlural', args: { cosa: id, nombre: null } }).ok).toBe(true);
        expect(ed.obtener().pasado).toHaveLength(2);
        expect(ed.obtener().modelo!.cosas[id]).not.toHaveProperty('nombrePlural');
        ed.deshacer(); expect(ed.obtener().modelo).toBe(conPlural);
        expect(ed.ejecutar({ op: 'fijarNombrePlural', args: { cosa: id, nombre: 'Dos  Pedidos' } }).ok).toBe(false);
        expect(ed.obtener().modelo).toBe(conPlural);
        expect(ed.obtener().pasado).toHaveLength(1);
        expect(exportarV0(base)).toBe(antes);
    } finally { ed.cerrar(); await ciclos(); }
});

test('T-182 T-192 DEC56 códec declara rechazo de forma inválida sin descartar el original', () => {
    const m = plural(preparado(), 'Pieza', 'Piezas'), antes = exportarV0(m);
    for (const [id, valor] of [[porNombre(m, 'Pieza').id, 2], [porNombre(m, 'Pieza').id, 'Piezas  Nuevas'],
        [porNombre(m, 'Ensamblar').id, 'Ensamblajes']] as const) {
        const doc = JSON.parse(antes); doc.modelo.entidades[id].nombrePlural = valor;
        const original = JSON.stringify(doc), r = importarV0(original);
        expect(r.ok).toBe(false);
        expect(r.informe.rechazos.some(x => x.ruta === `entidades.${id}.nombrePlural`)).toBe(true);
        expect(JSON.stringify(doc)).toBe(original);
    }
    expect(exportarV0(m)).toBe(antes);
});

for (const operador of ['XOR', 'OR'] as const) for (const invertir of [false, true]) for (const evento of [false, true])
    test(`T-054 T-057 T-128 T-192 DEC56 común O ${operador}/orden=${invertir}/evento=${evento} conserva ausencia parcial y B08`, () => {
        let m = modeloCon({ objetos: [['Pieza', []]], procesos: ['Ensamblar', 'Reparar', 'Embalar'] });
        m = plural(m, 'Pieza', 'Piezas');
        const ids: string[] = [], cantidades = ['n; n>=1', undefined, '2'] as const;
        for (const [i, nombre] of ['Ensamblar', 'Reparar', 'Embalar'].entries()) {
            const r = must(aplicarAccion(m, { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo: 'consumo',
                objeto: porNombre(m, 'Pieza').id, proceso: porNombre(m, nombre).id, ...(evento ? { control: 'e' as const } : {}),
                ...(cantidades[i] !== undefined ? { mult: cantidades[i]! } : {}) } } }));
            m = r.modelo; ids.push(r.creados[0]!);
        }
        const antes = exportarV0(m), grupo = aplicarAccion(m, { op: 'formarAbanico', args: { enlaces: invertir ? [...ids].reverse() : ids, operador } });
        if (evento) {
            expect(grupo.ok).toBe(false); if (grupo.ok) throw Error('B08 debe permanecer no ofrecida');
            expect(grupo.rechazo).toMatchObject({ codigo: 'no-ofrecido', regla: 'T-056' });
            expect(exportarV0(m)).toBe(antes); return;
        }
        m = must(grupo).modelo;
        const r = fijo(m), e = Object.values(r.enlaces) as EnlaceProcedimental[];
        expect(e.map(x => [r.cosas[x.proceso]!.nombre, x.mult, 'control' in x ? x.control : undefined]).sort())
            .toEqual([['Ensamblar', cantidades[0], undefined], ['Reparar', cantidades[1], undefined], ['Embalar', cantidades[2], undefined]].sort());
        expect(Object.values(r.abanicos)[0]?.enlaces).toHaveLength(3);
        const f = Object.values(m.abanicos)[0]!;
        const cambiado = must(aplicarAccion(m, { op: 'fijarOperador', args: { abanico: f.id, operador: operador === 'XOR' ? 'OR' : 'XOR' } })).modelo;
        fijo(cambiado); expect(cambiado.enlaces).toBe(m.enlaces);
    });

for (const operador of ['XOR', 'OR'] as const) for (const tipo of ['consumo', 'resultado', 'instrumento', 'agente'] as const)
    test(`T-054 T-057 T-128 T-192 DEC56 común P ${tipo}/${operador} conserva plurales por cada miembro`, () => {
        let m = modeloCon({ objetos: [['Pieza', ['lista']], ['Dato', ['válido']]], procesos: ['Ensamblar'] });
        m = plural(plural(m, 'Pieza', 'Piezas'), 'Dato', 'Datos'); const ids: string[] = [];
        for (const [nombre, mult] of [['Pieza', '2'], ['Dato', 'm; m>=2']] as const) {
            const objeto = porNombre(m, nombre); if (objeto.tipo !== 'objeto') throw Error('Fixture');
            m = must(aplicarAccion(m, { op: 'fijarEsencia', args: { cosa: objeto.id, esencia: 'fisica' } })).modelo;
            const r = must(aplicarAccion(m, { op: 'crearEnlace', args: { opd: m.raiz, candidato: { tipo, objeto: objeto.id,
                proceso: porNombre(m, 'Ensamblar').id, estado: objeto.estados[0]!.id, mult } } }));
            m = r.modelo; ids.push(r.creados[0]!);
        }
        m = must(aplicarAccion(m, { op: 'formarAbanico', args: { enlaces: ids, operador } })).modelo;
        const doc = generarDocumentoOpl(m);
        expect(doc).toContain('**Piezas** [nombre: «Pieza»]'); expect(doc).toContain('**Datos** [nombre: «Dato»]');
        const r = fijo(m); expect(Object.values(r.abanicos)[0]).toMatchObject({ operador });
        expect(Object.values(r.enlaces).map(e => 'mult' in e ? e.mult : null).sort()).toEqual(['2', 'm; m>=2']);
    });
