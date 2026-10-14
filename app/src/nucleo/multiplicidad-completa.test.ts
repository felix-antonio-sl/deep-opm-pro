import { expect, test } from 'bun:test';
import { esMultiplicidad } from './matriz';
import { crearEnlace, fijarMultiplicidad } from './enlaces';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarDocumentoOpl, importarOpl } from '../opl/documento';
import { planificar } from '../opl/planificar';
import type { EnlaceNuevo, Modelo } from './tipos';
import { reciprocoConEstados } from './tipos';
import { generarModelo } from '../opl/generar';
import { analizar } from '../opl/analizar';
import { descomponer } from './refinamiento';
import { validarForma } from './forma';
import { erroresContexto } from './matriz';
import { escena } from '../opd/escena';
import { moverApariciones } from './cosas';
import { anchoTexto } from '../opd/metricas';

function cambiosPorEstado(m: Modelo) {
    return Object.values(m.enlaces).map(e => {
        if (e.tipo !== 'efecto') throw Error('Firma de cambio');
        const objeto = m.cosas[e.objeto]!;
        if (objeto.tipo !== 'objeto') throw Error('Dueño de estados');
        const nombre = (id: string | undefined) => objeto.estados.find(s => s.id === id)?.nombre ?? null;
        return [objeto.nombre, m.cosas[e.proceso]!.nombre, nombre(e.entrada), nombre(e.salida), e.mult ?? null];
    }).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

const cantidades = [
    '0', '1', '2..5', '3..5,8..10', '0..0,2..4', 'n..m',
    'n+1', '(b-i)', '3*n', '(b+2*w)/2',
    '2,3*n; n<=4', 'e; e>=1; e=b+2*w',
    'b; b en {0,1}', 'w; 0<=w<=3', 'k; k=2..4',
    '2/2', '2-1', '1..1', '1,1..1', '90071992547409931', '(1+3)/2',
    '0,1,3..5', 'n/2; n=2,4,6', 'n; n!=0; n<=m; N>=n',
    '"b-i"', '"muchos"', '"a/b"', '"Main I/O Output"; "Main I/O Output">=1',
    '2.."N"',
    '0.5*n', 'n; n<1.5', '0.5*2', '1.0..1.0', 'n; n en {0.5,1.5}',
    '0.5*2..3', '0.5*2,2',
    '?; n>=0', '*; n>=0', '+; n>=1', '2..*; n>=2', 'muchos; n>=2',
] as const;

for (const cantidad of cantidades)
    test(`T-057 T-128 T-192 B-42 completa ${cantidad}: núcleo, inversa desde vacío y códec`, () => {
        expect(esMultiplicidad(cantidad)).toBe(true);
        const base = modeloCon({ objetos: [['Máquina', []]], procesos: ['Operar'] });
        const creado = must(crearEnlace(base, { opd: base.raiz, candidato: {
            tipo: 'consumo', objeto: porNombre(base, 'Máquina').id,
            proceso: porNombre(base, 'Operar').id, mult: cantidad,
        } })).modelo;
        const json = exportarV0(creado), texto = generarDocumentoOpl(creado);
        const leido = must(importarOpl(creado.nombre, texto)).modelo;
        expect(Object.values(leido.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([cantidad]);
        expect(generarDocumentoOpl(leido)).toBe(texto);
        expect(planificar(creado, 'modelo', texto).acciones).toEqual([]);
        const fijo = importarV0(json);
        expect(fijo.ok).toBe(true); if (!fijo.ok) throw Error('Códec');
        expect(exportarV0(fijo.modelo)).toBe(json);
        expect(exportarV0(creado)).toBe(json);
    });

for (const lado of ['entrada', 'salida', 'ambos'] as const) for (const operador of ['XOR', 'OR'] as const)
    for (const n of [2, 3, 4]) for (const variante of ['uniforme', 'cantidades', 'restricciones', 'ausente'] as const)
        test(`T-054 T-057 T-128 T-192 B-42 FAN5 ${lado}/${operador}/${n}/${variante}: cantidades propias sin cambiar común P`, () => {
            let m = modeloCon({ objetos: [['Máquina', ['común', ...Array.from({ length: n }, (_, i) => `estado_${i}`)]]], procesos: ['Operar'] });
            const o = porNombre(m, 'Máquina'); if (o.tipo !== 'objeto') throw Error('Montaje');
            const ids: string[] = [], valores: (string | undefined)[] = [];
            for (let i = 0; i < n; i++) {
                const mult = variante === 'ausente' && i === 0 ? undefined : variante === 'uniforme' ? 'n; n>=1'
                    : variante === 'restricciones' ? `n; n>=${i + 1}` : `n+${i}; n en {1,2}`;
                const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: o.id,
                    proceso: porNombre(m, 'Operar').id, ...(lado !== 'salida' ? { entrada: o.estados[lado === 'ambos' ? 0 : i + 1]!.id } : {}),
                    ...(lado !== 'entrada' ? { salida: o.estados[i + 1]!.id } : {}), ...(mult ? { mult } : {}) },
                    ...(i ? { abanicoCon: { enlace: ids[0]!, operador } } : {}) }));
                m = r.modelo; ids.push(r.creados[0]!); valores.push(mult);
            }
            const texto = generarDocumentoOpl(m), leido = must(importarOpl(m.nombre, texto));
            expect(Object.values(leido.modelo.enlaces)).toHaveLength(n);
            expect(Object.values(leido.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual(valores);
            expect(cambiosPorEstado(leido.modelo)).toEqual(cambiosPorEstado(m));
            expect(Object.values(leido.modelo.abanicos)).toHaveLength(1);
            expect(Object.values(leido.modelo.abanicos)[0]).toMatchObject({ operador, enlaces: Object.keys(leido.modelo.enlaces) });
            expect(generarDocumentoOpl(leido.modelo)).toBe(texto);
            expect(planificar(m, 'modelo', texto).acciones).toEqual([]);
            const linea = generarModelo(m).find(l => l.hechos.length)!;
            expect(linea.hechos).toEqual(ids);
            expect(linea.texto.match(/\*Operar\*/g)).toHaveLength(1);
            expect(linea.texto).toContain(operador === 'XOR' ? 'exactamente uno de' : 'al menos uno de');
            const json = exportarV0(m), fijo = importarV0(json); expect(fijo.ok).toBe(true);
            if (fijo.ok) expect(exportarV0(fijo.modelo)).toBe(json);
        });

for (const lado of ['entrada', 'salida', 'ambos'] as const) for (const operador of ['XOR', 'OR'] as const)
    test(`T-054 T-057 T-150 T-192 B-42 FAN5 ${lado}/${operador}: ausencia intermedia y orden de frases libre`, () => {
        const estado = (n: number) => `estado_${n}`;
        const miembro = (n: number) => (n === 1 ? '' : `«n+${n}» `) + '**Máquina**'
            + (lado !== 'salida' ? ' de `' + (lado === 'ambos' ? 'común' : estado(n)) + '`' : '')
            + (lado !== 'entrada' ? ' a `' + estado(n) + '`' : '')
            + (n === 1 ? '' : `, **donde n >= ${n + 1}**`);
        const base = '*Operar* cambia ' + (operador === 'XOR' ? 'exactamente uno de ' : 'al menos uno de ');
        const canon = must(importarOpl('Orden', '# Orden\n\n## SD\n' + base + [0, 1, 2].map(miembro).join(' o ') + '.')).modelo;
        for (const orden of [[2, 1, 0], [1, 2, 0], [2, 0, 1]]) {
            const texto = '# Orden\n\n## SD\n' + base + orden.map(miembro).join(' o ') + '.';
            expect(analizar(texto).flatMap(l => l.diagnosticos)).toEqual([]);
            const r = must(importarOpl('Orden', texto));
            expect(r.plan.resumen.noAplicables).toBe(0);
            expect(cambiosPorEstado(r.modelo)).toEqual(cambiosPorEstado(canon));
            expect(Object.values(r.modelo.abanicos)).toHaveLength(1);
            expect(Object.values(r.modelo.abanicos)[0]!.operador).toBe(operador);
            const documento = generarDocumentoOpl(r.modelo), leido = must(importarOpl(r.modelo.nombre, documento));
            expect(generarDocumentoOpl(leido.modelo)).toBe(documento);
            expect(cambiosPorEstado(leido.modelo)).toEqual(cambiosPorEstado(canon));
        }
    });

for (const cantidad of ['5..2', '2..', '..3', '[2..5)', 'n/', '(n+1', 'n**2', 'n; n en {}', 'n; n>=', 'n; console.log(1)', '-1', '0.5', '0.5+0.25', 'n/0.0', '2..1.5', '1.5..2.5', '-1..2', '0.5,2', '1.5..2.5,3'])
    test(`T-057 B-42 cantidad inválida ${cantidad}: rechazo sin mutación`, () => {
        expect(esMultiplicidad(cantidad)).toBe(false);
        const base = modeloCon({ objetos: [['Máquina', []]], procesos: ['Operar'], enlaces: [['consumo', 'Máquina', 'Operar']] });
        const json = exportarV0(base);
        const cambio = fijarMultiplicidad(base, { enlace: Object.keys(base.enlaces)[0]!, extremo: 'objeto', valor: cantidad });
        expect(cambio.ok).toBe(false);
        expect(exportarV0(base)).toBe(json);
    });

for (const tipo of ['etiquetado', 'etiquetadoBidireccional', 'reciproco'] as const)
    for (const lado of ['origen', 'destino', 'ambos'] as const)
        test(`T-057 T-128 T-182 T-192 B-42 ${tipo}/${lado}: cantidad y estado propios en ambos extremos`, () => {
            const base = modeloCon({ objetos: [['Origen', ['activo']], ['Destino', ['listo']]] });
            const a = porNombre(base, 'Origen'), b = porNombre(base, 'Destino');
            if (a.tipo !== 'objeto' || b.tipo !== 'objeto') throw Error('Montaje');
            const estadoOrigen = lado !== 'destino' ? a.estados[0]!.id : undefined;
            const estadoDestino = lado !== 'origen' ? b.estados[0]!.id : undefined;
            const comun = { origen: a.id, destino: b.id, etiqueta: 'conoce', multOrigen: 'n; n>=1', multDestino: '2..4' };
            const anclajes = { ...(estadoOrigen ? { estadoOrigen } : {}), ...(estadoDestino ? { estadoDestino } : {}) };
            const candidato: EnlaceNuevo = tipo === 'reciproco'
                ? reciprocoConEstados({ ...comun, tipo }, estadoOrigen, estadoDestino)
                : tipo === 'etiquetadoBidireccional' ? { ...comun, tipo, inversa: 'pertenece', ...anclajes }
                    : { ...comun, tipo, ...anclajes };
            const m = must(crearEnlace(base, { opd: base.raiz, candidato })).modelo;
            const json = exportarV0(m), texto = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, texto));
            expect(r.plan.resumen.noAplicables).toBe(0);
            expect(generarDocumentoOpl(r.modelo)).toBe(texto);
            const valores = (modelo: typeof m) => Object.values(modelo.enlaces).map(e => {
                if (!('origen' in e) || !('multOrigen' in e)) throw Error('Firma');
                return [modelo.cosas[e.origen]!.nombre, modelo.cosas[e.destino]!.nombre, e.multOrigen,
                    'multDestino' in e ? e.multDestino : undefined];
            });
            expect(valores(r.modelo)).toEqual(valores(m));
            expect(planificar(m, 'modelo', texto).acciones).toEqual([]);
            const fijo = importarV0(json); expect(fijo.ok).toBe(true);
            if (fijo.ok) expect(exportarV0(fijo.modelo)).toBe(json);
            expect(exportarV0(m)).toBe(json);
        });

for (const lado of ['entrada', 'salida', 'ambos'] as const) for (const control of [undefined, 'e'] as const)
    test(`T-057 T-128 T-182 T-192 B-42 cambio ${lado}/${control ?? 'sin control'}: cantidad única y restricción tras estados`, () => {
        const base = modeloCon({ objetos: [['Máquina', ['lista', 'operando']]], procesos: ['Operar'] });
        const o = porNombre(base, 'Máquina'); if (o.tipo !== 'objeto') throw Error('Montaje');
        const r = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'efecto', objeto: o.id,
            proceso: porNombre(base, 'Operar').id, ...(lado !== 'salida' ? { entrada: o.estados[0]!.id } : {}),
            ...(lado !== 'entrada' ? { salida: o.estados[1]!.id } : {}), ...(control ? { control } : {}), mult: '3*n; n>=1' } }));
        const m = r.modelo, texto = generarDocumentoOpl(m), leido = must(importarOpl(m.nombre, texto));
        const linea = generarModelo(m).find(l => l.hechos.includes(r.creados[0]!))!;
        expect(linea.texto.match(/«3\*n»/g)).toHaveLength(1);
        expect(linea.texto).toContain('**donde n >= 1**.');
        expect(linea.tokens.filter(t => t.negrita)).toEqual([expect.objectContaining({
            texto: 'donde n >= 1', rol: 'multiplicidad', hecho: r.creados[0]!, ref: { tipo: 'enlace', id: r.creados[0]! },
        })]);
        expect(linea.tokens.filter(t => t.negrita).every(t => !t.marca)).toBe(true);
        expect(linea.texto).toContain(lado === 'ambos' ? 'de `lista` a `operando`' : lado === 'entrada' ? 'de `lista`' : 'a `operando`');
        expect(generarDocumentoOpl(leido.modelo)).toBe(texto);
        expect(Object.values(leido.modelo.enlaces)).toHaveLength(1);
        expect(Object.values(leido.modelo.enlaces)[0]).toMatchObject({ tipo: 'efecto', mult: '3*n; n>=1', ...(control ? { control } : {}) });
        expect(planificar(m, 'modelo', texto).acciones).toEqual([]);
        const json = exportarV0(m), fijo = importarV0(json); expect(fijo.ok).toBe(true);
        if (fijo.ok) expect(exportarV0(fijo.modelo)).toBe(json);
        if (control) {
            const otraCosa = linea.texto.replace(/que cambia \*\*Máquina\*\*/, 'que cambia **Otra**');
            expect(analizar(otraCosa)[0]!.hechos).toEqual([]);
            if (lado !== 'salida') {
                const otroEstado = linea.texto.replace(/de `lista`/, 'de `operando`');
                expect(analizar(otroEstado)[0]!.hechos).toEqual([]);
            }
        }
    });

test('T-150 T-173 B-42 negrita de restricciones no reinterpreta un nombre literal donde', () => {
    const texto = '**Origen** «conoce» **Alfa**, **donde Mínimo** e **Índice**.';
    const l = analizar(texto)[0]!;
    expect(l.texto).toBe(texto); expect(l.hechos).toHaveLength(3);
    expect(l.hechos.filter(h => h.k === 'enlace').map(h => h.enlace.tipo === 'etiquetado' ? h.enlace.destino.nombre : null))
        .toEqual(['Alfa', 'donde Mínimo', 'Índice']);
    // Reconocer el nombre heredado no autoriza crear una cosa fuera del léxico.
    const b = modeloCon({ objetos: [['Origen', []]] }), antes = exportarV0(b), p = planificar(b, b.raiz, texto);
    expect(p.acciones).toEqual([]); expect(p.lineas[0]!.diagnosticos.some(d => d.regla === 'R-§18-LEX-1')).toBe(true);
    expect(exportarV0(b)).toBe(antes);
});

for (const negrita of [false, true]) test(`T-057 T-150 T-192 B-42 pertenencia Unicode ${negrita}: restricción declarativa desde OPL`, () => {
    const texto = '*Operar* consume «n» **Máquina**, ' + (negrita ? '**' : '') + 'donde n ∈ {0,1}; n ≤ 2' + (negrita ? '**' : '') + '.';
    const l = analizar(texto)[0]!;
    expect(l.diagnosticos).toEqual([]); expect(l.hechos).toHaveLength(1);
    const r = must(importarOpl('Unicode', '# Unicode\n\n## SD\n' + texto));
    expect(Object.values(r.modelo.enlaces)[0]).toMatchObject({ tipo: 'consumo', mult: 'n; n en {0,1}; n<=2' });
    const doc = generarDocumentoOpl(r.modelo), otra = must(importarOpl(r.modelo.nombre, doc));
    expect(generarDocumentoOpl(otra.modelo)).toBe(doc); expect(planificar(r.modelo, 'modelo', doc).acciones).toEqual([]);
});

for (const lado of ['entrada', 'salida', 'ambos'] as const) for (const n of [3, 4])
    test(`T-057 T-133 T-182 T-192 B-42 AND cambios ${lado}/${n}: cantidades y restricciones por miembro`, () => {
        let m = modeloCon({ objetos: Array.from({ length: n }, (_, i) => [`Máquina_${i}`, ['lista', 'operando']] as const), procesos: ['Operar'] });
        const ids: string[] = [], valores: string[] = [];
        for (let i = 0; i < n; i++) {
            const o = porNombre(m, `Máquina_${i}`); if (o.tipo !== 'objeto') throw Error('Montaje');
            const mult = `n+${i}; n en {1,2}; n>=${i + 1}`;
            const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: o.id,
                proceso: porNombre(m, 'Operar').id, ...(lado !== 'salida' ? { entrada: o.estados[0]!.id } : {}),
                ...(lado !== 'entrada' ? { salida: o.estados[1]!.id } : {}), mult } }));
            m = r.modelo; ids.push(r.creados[0]!); valores.push(mult);
        }
        const texto = generarDocumentoOpl(m), linea = generarModelo(m).find(l => l.hechos.length)!;
        expect(linea.hechos).toEqual(ids);
        expect(linea.plantilla).toBe(lado === 'ambos' ? 'AND-cambio' : lado === 'entrada' ? 'AND-entrada' : 'AND-salida');
        const r = must(importarOpl(m.nombre, texto));
        expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual(valores);
        expect(generarDocumentoOpl(r.modelo)).toBe(texto);
        expect(planificar(m, 'modelo', texto).acciones).toEqual([]);
        for (const id of ids) expect(linea.tokens.some(t => t.hecho === id && t.negrita)).toBe(true);
        const json = exportarV0(m), fijo = importarV0(json); expect(fijo.ok).toBe(true);
        if (fijo.ok) expect(exportarV0(fijo.modelo)).toBe(json);
    });

for (const tipo of ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'] as const)
    test(`T-057 T-074 T-076 T-192 B-42 ${tipo}: distribución y escisión conservan la anotación completa`, () => {
        const base = modeloCon({ objetos: [['Máquina', ['lista', 'operando']]], procesos: ['Operar'] });
        const o = porNombre(base, 'Máquina'); if (o.tipo !== 'objeto') throw Error('Montaje');
        const mult = 'n/2; n en {2,4}; n>=2';
        const r = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo, objeto: o.id,
            proceso: porNombre(base, 'Operar').id, mult, ...(tipo === 'efecto'
                ? { entrada: o.estados[0]!.id, salida: o.estados[1]!.id } : { estado: o.estados[0]!.id }) } }));
        const antes = exportarV0(r.modelo), id = r.creados[0]!;
        const refinado = must(descomponer(r.modelo, { opd: r.modelo.raiz, cosa: porNombre(r.modelo, 'Operar').id,
            bandas: [['Preparar'], ['Entregar']] })).modelo;
        expect(validarForma(refinado)).toEqual([]); expect(erroresContexto(refinado)).toEqual([]);
        expect(refinado.enlaces[id]).toBeDefined();
        const es = Object.values(refinado.enlaces);
        expect(es).toHaveLength(tipo === 'efecto' ? 2 : 1);
        expect(es.every(e => 'mult' in e && e.mult === mult)).toBe(true);
        // Los habilitadores sin evento son distributivos en el contorno (R-DIST-1).
        const destino = porNombre(refinado, tipo === 'agente' || tipo === 'instrumento' ? 'Operar'
            : tipo === 'resultado' ? 'Entregar' : 'Preparar').id;
        expect(refinado.enlaces[id]).toMatchObject({ tipo, proceso: destino });
        if (tipo === 'efecto') {
            expect(es[0]).toMatchObject({ entrada: o.estados[0]!.id, escision: { par: es[1]!.id, mitad: 'entrada' } });
            expect(es[1]).toMatchObject({ salida: o.estados[1]!.id, proceso: porNombre(refinado, 'Entregar').id,
                escision: { par: id, mitad: 'salida' } });
        }
        const texto = generarDocumentoOpl(refinado), leido = must(importarOpl(refinado.nombre, texto));
        expect(leido.plan.resumen.noAplicables).toBe(0);
        expect(Object.values(leido.modelo.enlaces).every(e => 'mult' in e && e.mult === mult)).toBe(true);
        expect(generarDocumentoOpl(leido.modelo)).toBe(texto);
        expect(planificar(refinado, 'modelo', texto).acciones).toEqual([]);
        const json = exportarV0(refinado), fijo = importarV0(json); expect(fijo.ok).toBe(true);
        if (fijo.ok) expect(exportarV0(fijo.modelo)).toBe(json);
        expect(exportarV0(r.modelo)).toBe(antes);
    });

for (const lado of ['entrada', 'salida', 'ambos'] as const) for (const control of [undefined, 'e'] as const)
    for (const [x, y] of [[1100, 0], [1100, 350], [-1100, 350], [0, 1100]])
        test(`T-057 T-218 B-42 ${lado}/${control ?? 'sin evento'}/${x}/${y}: cantidad en el terminal del objeto`, () => {
            let m = modeloCon({ objetos: [['Máquina', ['lista', 'operando']]], procesos: ['Operar'] });
            const o = porNombre(m, 'Máquina'); if (o.tipo !== 'objeto') throw Error('Dueño');
            m = must(moverApariciones(m, { opd: m.raiz, mover: [
                { cosa: o.id, x: 0, y: 0 }, { cosa: porNombre(m, 'Operar').id, x: x!, y: y! },
            ] })).modelo;
            const creado = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: o.id,
                proceso: porNombre(m, 'Operar').id, ...(lado !== 'salida' ? { entrada: o.estados[0]!.id } : {}),
                ...(lado !== 'entrada' ? { salida: o.estados[1]!.id } : {}), mult: '3*n; n>=1', ...(control ? { control } : {}) } }));
            const dibujo = escena(creado.modelo, creado.modelo.raiz), arista = dibujo.aristas[0]!;
            const cantidades = arista.etiquetas.filter(l => l.clave.startsWith('mult'));
            expect(cantidades).toHaveLength(1); expect(cantidades[0]!.texto).toBe('3*n; n>=1');
            const objeto = dibujo.nodos.find(n => n.ref.id === o.id)!.caja;
            const etiqueta = cantidades[0]!, ancho = anchoTexto(etiqueta.texto, 12, false);
            const tinta = { x: etiqueta.en.x - ancho / 2, y: etiqueta.en.y - 9, ancho, alto: 9 };
            expect(tinta.x + tinta.ancho <= objeto.x || tinta.x >= objeto.x + objeto.ancho
                || tinta.y + tinta.alto <= objeto.y || tinta.y >= objeto.y + objeto.alto).toBe(true);
            const proceso = dibujo.nodos.find(n => n.ref.id === porNombre(m, 'Operar').id)!.caja;
            const distancia = (c: typeof objeto) => Math.hypot(cantidades[0]!.en.x - c.x - c.ancho / 2,
                cantidades[0]!.en.y - c.y - c.alto / 2);
            expect(distancia(objeto)).toBeLessThan(distancia(proceso));
            expect(arista.hechos).toEqual([creado.creados[0]!]);
            // TS3 y también TS4/TS5 standalone son pares de flechas (spec-OPD §4.1, R-OPD-TR-6).
            expect(arista.tramos).toHaveLength(2);
        });

function firmaCantidades(m: Modelo) {
    const estado = (id: string | undefined) => id ? Object.values(m.cosas).flatMap(c => c.tipo === 'objeto'
        ? c.estados.filter(s => s.id === id).map(s => [c.nombre, s.nombre]) : [])[0] : null;
    return Object.values(m.enlaces).map(e => {
        if ('objeto' in e) return [e.tipo, m.cosas[e.objeto]!.nombre, m.cosas[e.proceso]!.nombre,
            'estado' in e ? estado(e.estado) : null, e.mult ?? null, 'control' in e ? e.control ?? null : null];
        if (e.tipo !== 'etiquetado' && e.tipo !== 'etiquetadoBidireccional' && e.tipo !== 'reciproco') throw Error('Firma');
        return [e.tipo, m.cosas[e.origen]!.nombre, m.cosas[e.destino]!.nombre,
            estado(e.tipo === 'reciproco' ? e.estados?.origen : e.estadoOrigen),
            estado(e.tipo === 'reciproco' ? e.estados?.destino : e.estadoDestino),
            e.multOrigen ?? null, e.multDestino ?? null, e.etiqueta ?? null,
            e.tipo === 'etiquetadoBidireccional' ? e.inversa : null];
    });
}

for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento', 'etiquetado', 'etiquetadoBidireccional', 'reciproco'] as const)
    for (const mult of ['?; n>=0', '*; n>=0']) for (const variante of ['sinEstado', 'conEstado', 'evento'] as const) {
        if (variante === 'evento' && (tipo === 'resultado' || tipo === 'etiquetado' || tipo === 'etiquetadoBidireccional' || tipo === 'reciproco')) continue;
        test(`T-057 T-128 T-192 B-42 ${tipo}/${mult}/${variante}: opcionalidad después del estado y restricción íntegra`, () => {
            const b = modeloCon({ objetos: [['Máquina', ['lista']], ['Otro', ['activo']]], procesos: ['Operar'] });
            const o = porNombre(b, 'Máquina'), z = porNombre(b, 'Otro');
            if (o.tipo !== 'objeto' || z.tipo !== 'objeto') throw Error('Montaje');
            const conEstado = variante !== 'sinEstado', datos = { objeto: o.id, proceso: porNombre(b, 'Operar').id,
                mult, ...(conEstado ? { estado: o.estados[0]!.id } : {}) };
            let candidato: EnlaceNuevo;
            if (tipo === 'resultado') candidato = { tipo, ...datos };
            else if (tipo === 'consumo' || tipo === 'agente' || tipo === 'instrumento')
                candidato = { tipo, ...datos, ...(variante === 'evento' ? { control: 'e' as const } : {}) };
            else {
                const comun = { origen: o.id, destino: z.id, multOrigen: mult, multDestino: '2..4', etiqueta: 'conoce' };
                const estadoOrigen = conEstado ? o.estados[0]!.id : undefined, estadoDestino = conEstado ? z.estados[0]!.id : undefined;
                const anclajes = conEstado ? { estadoOrigen: estadoOrigen!, estadoDestino: estadoDestino! } : {};
                candidato = tipo === 'reciproco' ? reciprocoConEstados({ tipo, ...comun }, estadoOrigen, estadoDestino)
                    : tipo === 'etiquetadoBidireccional' ? { tipo, ...comun, ...anclajes, inversa: 'es conocido por' }
                        : { tipo, ...comun, ...anclajes };
            }
            const m = must(crearEnlace(b, { opd: b.raiz, candidato })).modelo, antes = exportarV0(m), doc = generarDocumentoOpl(m);
            expect(doc).not.toMatch(/opcional(?:es)? en `/);
            expect(analizar(doc).flatMap(l => l.diagnosticos)).toEqual([]);
            const r = must(importarOpl(m.nombre, doc));
            expect(r.plan.resumen.noAplicables).toBe(0); expect(firmaCantidades(r.modelo)).toEqual(firmaCantidades(m));
            expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
            const fijo = importarV0(antes); expect(fijo.ok).toBe(true);
            if (fijo.ok) expect(exportarV0(fijo.modelo)).toBe(antes);
            expect(exportarV0(m)).toBe(antes);
        });
    }

for (const operador of ['XOR', 'OR'] as const) for (const n of [2, 3, 4])
    test(`T-054 T-057 T-218 B-42 ${operador}/${n}: restricciones largas de ramas no se pisan y conservan la geometría`, () => {
        let m = modeloCon({ objetos: [['Máquina', Array.from({ length: n }, (_, i) => `estado_${i}`)]], procesos: ['Operar'] });
        const o = porNombre(m, 'Máquina'); if (o.tipo !== 'objeto') throw Error('Dueño');
        m = must(moverApariciones(m, { opd: m.raiz, mover: [{ cosa: o.id, x: 80, y: 180 },
            { cosa: porNombre(m, 'Operar').id, x: 1100, y: 200 }] })).modelo;
        let primer: string | undefined;
        for (const s of o.estados) {
            const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: o.id,
                proceso: porNombre(m, 'Operar').id, salida: s.id, mult: 'n; n en {0,1,2,3,4,5,6,7,8,9}' },
                ...(primer ? { abanicoCon: { enlace: primer, operador } } : {}) }));
            m = r.modelo; primer ??= r.creados[0]!;
        }
        const antes = exportarV0(m), dibujo = escena(m, m.raiz);
        const cajas = dibujo.aristas.flatMap(a => a.etiquetas.filter(q => q.clave.startsWith('mult')).map(q => ({
            x: q.en.x - anchoTexto(q.texto, 12, false) / 2, y: q.en.y - 12,
            ancho: anchoTexto(q.texto, 12, false), alto: 16,
        })));
        expect(cajas).toHaveLength(n);
        for (let i = 0; i < cajas.length; i++) for (const b of cajas.slice(i + 1)) {
            const a = cajas[i]!;
            expect(a.x + a.ancho <= b.x || b.x + b.ancho <= a.x || a.y + a.alto <= b.y || b.y + b.alto <= a.y).toBe(true);
        }
        const sinCantidades: Modelo = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).map(([id, e]) => {
            if (e.tipo !== 'efecto') throw Error('Firma'); const { mult, ...sin } = e; void mult; return [id, sin];
        })) };
        const referencia = escena(sinCantidades, sinCantidades.raiz);
        expect(dibujo.nodos).toEqual(referencia.nodos); expect(dibujo.arcos).toEqual(referencia.arcos);
        expect(dibujo.aristas.map(a => [a.ref, a.hechos, a.tramos, a.marcas])).toEqual(referencia.aristas.map(a => [a.ref, a.hechos, a.tramos, a.marcas]));
        expect(exportarV0(m)).toBe(antes);
    });
