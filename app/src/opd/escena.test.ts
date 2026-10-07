import { expect, test } from 'bun:test';
import type { Modelo, Cosa, Enlace, Opd, Objeto, Proceso } from '../nucleo/tipos';
import { escena } from './escena';
import { aTexto, dibujar } from './dibujo';
import { anchoTexto } from './metricas';
import { validarForma } from '../nucleo/forma';
import { erroresContexto } from '../nucleo/matriz';
import { proyectar } from '../nucleo/proyeccion';
import { gatesExportacion } from '../nucleo/diagnostico';
function m(cs: readonly Cosa[], es: readonly Enlace[] = [], os: readonly Opd[] = []): Modelo { return { id: 'modelo', nombre: 'Modelo', unidadTiempo: 'min', raiz: 'sd', secuencia: 100, cosas: Object.fromEntries(cs.map(c => [c.id, c])), enlaces: Object.fromEntries(es.map(e => [e.id, e])), abanicos: {}, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: Object.fromEntries(cs.filter(c => !os.some(o => o.tipo === 'descomposicion' && [...o.bandas.flat(), ...o.objetosInternos].includes(c.id))).map((c, i) => [c.id, { x: i * 230, y: i % 2 * 180, ancho: 135, alto: 60 }])) }, ...Object.fromEntries(os.map(o => [o.id, o])) } }; }
const o = (id = 'o', nombre = 'Pedido'): Objeto => ({ id, nombre, tipo: 'objeto', esencia: 'informacional', afiliacion: 'sistemica', estados: [] });
const p = (id = 'p', nombre = 'Procesar'): Proceso => ({ id, nombre, tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica' });
for (const tipo of ['objeto', 'proceso'] as const)
    for (const esencia of ['fisica', 'informacional'] as const)
        for (const afiliacion of ['sistemica', 'ambiental'] as const)
            test(`T-200 T-201 ${tipo} ${esencia} ${afiliacion}`, () => { const e = escena(m([{ ...(tipo === 'objeto' ? o() : p()), esencia, afiliacion }]), 'sd'), n = e.nodos[0]!, svg = aTexto(dibujar(e, 'canon')); expect([n.tipo, n.fisica, n.ambiental]).toEqual([tipo, esencia === 'fisica', afiliacion === 'ambiental']); expect(svg.includes('filter="url(#sombra-fisica)"')).toBe(esencia === 'fisica'); expect(svg.includes('stroke-dasharray="8 4"')).toBe(afiliacion === 'ambiental'); expect(svg.includes(tipo === 'objeto' ? '<rect' : '<ellipse')).toBe(true); });
test('T-202 grueso solo para cosa refinada también en hijo', () => { const base = m([p(), p('q', 'Preparar')], [{ id: 'e', tipo: 'agregacion', refinable: 'p', refinador: 'q' }], [{ id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'p', orden: 0, modo: 'agregacion', apariciones: { p: { x: 0, y: 0, ancho: 135, alto: 60 }, q: { x: 0, y: 180, ancho: 135, alto: 60 } } }]); expect(escena(base, 'sd').nodos.map(n => n.grueso)).toEqual([true, false]); expect(escena(base, 'h').nodos[0]!.grueso).toBe(true); expect(escena(m([p(), p('q')], Object.values(base.enlaces)), 'sd').nodos.every(n => !n.grueso)).toBe(true); });
test('T-204 rótulo 60 caracteres íntegro expande sin truncar', () => { const nombre = 'A'.repeat(60), n = escena(m([o('o', nombre)]), 'sd').nodos[0]!; expect(n.rotulo.lineas.join(' ')).toBe(nombre); expect(n.caja.ancho).toBeGreaterThanOrEqual(anchoTexto(nombre, 17, false) + 24); });
test('T-206 cuatro designaciones dentro del objeto; pin current externo', () => {
    const c = { ...o(), tipo: 'objeto' as const, estados: [{ id: 's1', nombre: 'nuevo', inicial: true as const, final: true as const }, { id: 's2', nombre: 'listo' }], porDefecto: 's1', current: 's2' }, e = escena(m([c, p()]), 'sd'), n = e.nodos[0]!;
    expect(n.estados.map(s => [s.inicial, s.final, s.porDefecto, s.current])).toEqual([[true, true, true, false], [false, false, false, true]]);
    expect(e.nodos[1]!.estados).toEqual([]);
    for (const s of n.estados) {
        expect(s.caja.y).toBeGreaterThan(n.caja.y);
        expect(s.caja.y + s.caja.alto).toBeLessThanOrEqual(n.caja.y + n.caja.alto);
        expect(s.caja.x + s.caja.ancho).toBeLessThanOrEqual(n.caja.x + n.caja.ancho);
    }
    const svg = aTexto(dibujar(e, 'canon'));
    expect(svg).toContain('stroke-width="3"');
    expect(svg).not.toContain('↗');
    expect(svg).toContain('pin-current');
});
test('T-208 chip global o local; anclaje expresa estado suprimido', () => { const c = { ...o(), tipo: 'objeto' as const, estados: [{ id: 's1', nombre: 'nuevo', suprimido: true as const }, { id: 's2', nombre: 'listo' }] }, base = m([c, p()]), local = { ...base, opds: { sd: { ...base.opds.sd!, apariciones: { ...base.opds.sd!.apariciones, o: { ...base.opds.sd!.apariciones.o!, ocultos: ['s2'] } } } } }; expect(escena(local, 'sd').nodos[0]!.chipOcultos?.n).toBe(2); expect(aTexto(dibujar(escena(local, 'sd'), 'canon'))).toContain('⋯2'); expect(escena({ ...local, enlaces: { e: { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's1' } } }, 'sd').nodos[0]!.chipOcultos?.n).toBe(1); });
for (const tipo of ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'] as const)
    test(`T-209 T-210 ${tipo} marcadores por rol`, () => { const e = escena(m([o(), p()], [{ id: 'e', tipo, objeto: 'o', proceso: 'p' }]), 'sd').aristas[0]!; expect(e.tramos[0]!.inicio).toBe(tipo === 'efecto' ? 'punta' : undefined); expect(e.tramos[0]!.fin).toBe(tipo === 'agente' ? 'piruletaNegra' : tipo === 'instrumento' ? 'piruletaBlanca' : 'punta'); expect(e.hechos).toEqual(['e']); expect(e.capa).toBe(4); });
test('T-209 TS3 dos tramos y TS4/5 una punta', () => {
    const obj = { ...o(), tipo: 'objeto' as const, estados: [{ id: 's1', nombre: 'nuevo' }, { id: 's2', nombre: 'listo' }] };
    for (const [entrada, salida, n] of [['s1', 's2', 2], ['s1', undefined, 1], [undefined, 's2', 1]] as const) {
        const e = escena(m([obj, p()], [{ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', ...(entrada ? { entrada } : {}), ...(salida ? { salida } : {}) }]), 'sd').aristas[0]!;
        expect(e.tramos).toHaveLength(n);
        expect(e.capa).toBe(20);
        for (const t of e.tramos) {
            expect(t.inicio).toBeUndefined();
            expect(t.fin).toBe('punta');
        }
    }
});
test('T-211 rayo invocación y lazo autoinvocación', () => { const e = escena(m([p(), p('q', 'Preparar')], [{ id: 'e', tipo: 'invocacion', origen: 'p', destino: 'q' }, { id: 'l', tipo: 'invocacion', origen: 'p', destino: 'p' }]), 'sd'); expect(e.aristas.every(a => a.rayo)).toBe(true); expect(e.aristas[0]!.tramos[0]!.puntos).toHaveLength(4); expect(e.aristas[1]!.tramos[0]!.puntos.length).toBe(3); });
for (const tipo of ['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'] as const)
    test(`T-212 símbolo compartido ${tipo} ortogonal`, () => {
        const e = escena(m([o(), o('a', 'Parte'), o('b', 'Rasgo')], [{ id: 'e1', tipo, refinable: 'o', refinador: 'a' }, { id: 'e2', tipo, refinable: 'o', refinador: 'b' }]), 'sd');
        expect(e.simbolos).toHaveLength(1);
        expect(e.simbolos[0]!.ramas).toEqual(['e1', 'e2']);
        expect(e.aristas).toHaveLength(0);
        for (const t of e.simbolos[0]!.peine)
            for (let i = 1; i < t.length; i++)
                expect(t[i]!.x === t[i - 1]!.x || t[i]!.y === t[i - 1]!.y).toBe(true);
    });
test('T-212 incompleta conserva barra bajo triángulo', () => { expect(escena(m([{ ...o(), incompleta: ['agregacion'] }, o('a')], [{ id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'a' }]), 'sd').simbolos[0]!.incompleta).toBe(true); });
test('T-213 itálicas, ruta, multiplicidades y arpones', () => { const e = escena(m([o(), o('a', 'Cliente'), p()], [{ id: 'e', tipo: 'etiquetadoBidireccional', origen: 'o', destino: 'a', etiqueta: 'pertenece a', inversa: 'posee', multOrigen: '?', multDestino: '*' }, { id: 'r', tipo: 'consumo', objeto: 'o', proceso: 'p', ruta: 'principal', mult: '+' }]), 'sd'); expect(e.aristas[0]!.tramos[0]!.inicio).toBe('arpon'); expect(e.aristas[0]!.tramos[0]!.fin).toBe('arpon'); expect(e.aristas[0]!.etiquetas.filter(l => l.italica).map(l => l.texto)).toEqual(['pertenece a', 'posee']); expect(e.aristas[1]!.etiquetas.map(l => l.texto)).toEqual(['principal', '+']); });
test('T-214 T-215 e/c y excepciones sin punta adicional', () => { const e = escena(m([o(), p(), p('q', 'Manejar')], [{ id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p', control: 'e' }, { id: 'c', tipo: 'instrumento', objeto: 'o', proceso: 'p', control: 'c' }, { id: 's', tipo: 'excepcionSobretiempo', origen: 'p', destino: 'q' }, { id: 'u', tipo: 'excepcionSubtiempo', origen: 'p', destino: 'q' }]), 'sd'); expect(e.aristas.map(a => a.marcas[0]!.texto)).toEqual(['e', 'c', '/', '//']); expect(e.aristas.slice(2).every(a => a.tramos[0]!.fin === undefined)).toBe(true); });
for (const operador of ['XOR', 'OR'] as const)
    test(`T-216 ${operador} arcos extremo común`, () => { const base = m([o(), o('a', 'Cliente'), p()], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p' }, { id: 'e2', tipo: 'consumo', objeto: 'a', proceso: 'p' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador, enlaces: ['e1', 'e2'] } } }, 'sd'); expect(e.arcos).toHaveLength(operador === 'XOR' ? 1 : 2); expect(e.aristas[0]!.tramos[0]!.puntos.at(-1)).toEqual(e.aristas[1]!.tramos[0]!.puntos.at(-1)); expect(e.arcos[0]!.centro).toEqual(e.aristas[0]!.tramos[0]!.puntos.at(-1)!); });
test('T-220 duración sin placeholder', () => { expect(escena(m([{ ...p(), tipo: 'proceso', duracion: { min: 1, esperada: 3, max: 5 } }]), 'sd').nodos[0]!.duracion).toBe('[min] {1, 3, 5}'); });
test('T-221 contenedor preserva bandas y modelo; escena memoizada', () => { const base = m([p(), p('q', 'Preparar'), p('r', 'Despachar')], [], [{ id: 'h', tipo: 'descomposicion', cosa: 'p', padre: 'sd', orden: 0, bandas: [['q'], ['r']], objetosInternos: [], apariciones: { p: { x: 0, y: 0, ancho: 420, alto: 288 }, q: { x: 140, y: 64, ancho: 135, alto: 60 }, r: { x: 140, y: 164, ancho: 135, alto: 60 } } }]), antes = JSON.stringify(base), e = escena(base, 'h'); expect(e.nodos[0]!.contenedor).toBe(true); expect(e.nodos.slice(1).map(n => n.caja.y)).toEqual([64, 164]); expect(JSON.stringify(base)).toBe(antes); expect(escena(base, 'h')).toBe(e); });
test('T-222 instancia derivada conserva nombre léxico', () => { const base = m([o('clase', 'Pedido'), o('inst', 'PedidoUno')], [{ id: 'e', tipo: 'clasificacion', refinable: 'clase', refinador: 'inst' }]), n = escena(base, 'sd').nodos[1]!; expect(n.rotuloInstancia).toBe('PedidoUno : Pedido'); expect(n.rotulo.lineas.join(' ')).toBe('PedidoUno : Pedido'); expect(base.cosas.inst!.nombre).toBe('PedidoUno'); });
test('T-203 T-227 T-228 capas y edición separadas; XML escapado', () => { const e = escena(m([o(), p()], [{ id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' }]), 'sd'), canon = aTexto(dibujar(e, 'canon')), edit = aTexto(dibujar(e, 'edicion')); expect(canon).not.toContain('data-ref'); expect(canon).not.toContain('#8e2a2e'); expect(canon).toContain('fill="#000"'); expect(edit).toContain('data-ref="enlace:e"'); expect(edit).toContain('stroke-width="15"'); expect(edit).toContain('data-ref="cosa:o"'); expect(canon.indexOf('data-capa="4"')).toBeLessThan(canon.indexOf('data-capa="10"')); expect(aTexto({ t: 'text', a: { title: '"<&' }, h: ['<&>'] })).toBe('<text title="&quot;&lt;&amp;">&lt;&amp;&gt;</text>'); });
test('T-205 T-207 T-224 caja contiene glifos y extremos sin cortar texto itálico', () => { const c = { ...o(), tipo: 'objeto' as const, estados: [{ id: 's', nombre: 'extraordinariamente' }], current: 's', porDefecto: 's' }, e = escena(m([c, p('p', 'Extraordinariamente')], [{ id: 'i', tipo: 'invocacion', origen: 'p', destino: 'p' }]), 'sd'); const n = e.nodos[0]!, s = n.estados[0]!; expect(e.caja.y).toBeLessThanOrEqual(s.caja.y - 14); expect(e.caja.y + e.caja.alto).toBeGreaterThanOrEqual(Math.max(s.caja.y + s.caja.alto + 12, ...e.aristas[0]!.tramos[0]!.puntos.map(p => p.y))); const svg = aTexto(dibujar(e, 'canon')); expect(svg).toContain('font-size="13" font-style="italic"'); expect(svg).toContain('font-kerning="none"'); });
test('T-206 T-020 valor puntual se expresa en cápsula inferior sin estado ni id fabricado', () => { const c = { ...o('o', 'Cantidad'), tipo: 'objeto' as const, valor: '12' }, e = escena(m([c]), 'sd'), n = e.nodos[0]!; expect(n.estados).toHaveLength(1); expect(n.estados[0]!.ref).toEqual({ tipo: 'cosa', id: 'o' }); expect(n.estados[0]!.nombre).toBe('12'); expect(n.rotulo.lineas).toEqual(['Cantidad']); expect(c.estados).toEqual([]); });
test('T-204 rótulo multilínea queda inscrito también en elipse', () => { const n = escena(m([p('p', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')]), 'sd').nodos[0]!, w = anchoTexto(n.rotulo.lineas[0]!, 17, true); const y = n.rotulo.y - 17, cy = n.caja.y + n.caja.alto / 2; const semi = n.caja.ancho / 2 * Math.sqrt(1 - ((y - cy) / (n.caja.alto / 2)) ** 2); expect(w / 2).toBeLessThanOrEqual(semi - 4); });
test('T-217 T-218 T-219 barra, multiplicidad y ruta no inventan placeholders', () => { const e = escena(m([o(), p()], [{ id: 'c', tipo: 'consumo', objeto: 'o', proceso: 'p' }]), 'sd'); expect(e.aristas[0]!.etiquetas).toEqual([]); expect(e.simbolos).toEqual([]); });
test('T-224 T-225 recorte de consumo en perímetro real de elipse y recta única', () => { const e = escena(m([o(), p()], [{ id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' }]), 'sd'), t = e.aristas[0]!.tramos[0]!, r = e.nodos[1]!.caja, b = t.puntos[1]!; expect(t.puntos).toHaveLength(2); expect(((b.x - r.x - r.ancho / 2) / (r.ancho / 2)) ** 2 + ((b.y - r.y - r.alto / 2) / (r.alto / 2)) ** 2).toBeCloseTo(1, 10); });
test('T-226 escena respeta posiciones guardadas sin auto-layout global', () => { const base = m([o(), p()], [{ id: 'c', tipo: 'consumo', objeto: 'o', proceso: 'p' }]), e = escena(base, 'sd'); expect(e.nodos.map(n => [n.caja.x, n.caja.y])).toEqual([[0, 0], [230, 180]]); expect(escena({ ...base }, 'sd')).not.toBe(e); });
test('T-216 DEC29 no dibuja agrupación en un estado común, conserva enlaces sueltos', () => { const c = { ...o(), estados: [{ id: 's', nombre: 'listo' }] }, base = m([c, p(), p('q', 'Preparar')], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's' }, { id: 'e2', tipo: 'consumo', objeto: 'o', proceso: 'q', estado: 's' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['e1', 'e2'] } } }, 'sd'); expect(e.arcos).toEqual([]); expect(e.aristas.map(a => a.ref.id)).toEqual(['e1', 'e2']); expect(e.aristas.every(a => a.tramos[0]!.puntos.length === 2)).toBe(true); });
test('T-216 abanico colineal conserva sector cero y OR dos registros', () => { const base = m([o(), p(), p('q', 'Preparar')], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p' }, { id: 'e2', tipo: 'consumo', objeto: 'o', proceso: 'q' }]), e = escena({ ...base, opds: { sd: { ...base.opds.sd!, apariciones: { o: { x: 0, y: 0, ancho: 135, alto: 60 }, p: { x: 300, y: 0, ancho: 135, alto: 60 }, q: { x: 600, y: 0, ancho: 135, alto: 60 } } } }, abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['e1', 'e2'] } } }, 'sd'); expect(e.arcos).toHaveLength(2); expect(e.arcos[0]!.desde).toBe(e.arcos[0]!.hasta); expect(e.arcos.map(a => a.radio)).toEqual([30, 35]); });
test('T-221 T-086 B-19 contorno hijo conserva habilitadores y efecto básico; excluye dos externos', () => { const o1 = { ...o('o', 'Equipo'), estados: [{ id: 's', nombre: 'disponible' }] }, base = m([o1, { ...o('a', 'Operador'), esencia: 'fisica' }, { ...o('ex', 'Otro'), estados: [{ id: 'sx', nombre: 'disponible' }] }, p(), p('q', 'Preparar'), p('r', 'Despachar')], [{ id: 'i', tipo: 'instrumento', objeto: 'o', proceso: 'p' }, { id: 'a1', tipo: 'agente', objeto: 'a', proceso: 'p' }, { id: 'e', tipo: 'efecto', objeto: 'ex', proceso: 'p' }, { id: 'externo', tipo: 'etiquetado', origen: 'o', destino: 'a', etiqueta: 'pertenece a' }], [{ id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['r']], objetosInternos: [], apariciones: { p: { x: 200, y: 200, ancho: 420, alto: 288 }, q: { x: 340, y: 264, ancho: 135, alto: 60 }, r: { x: 340, y: 364, ancho: 135, alto: 60 }, o: { x: 0, y: 0, ancho: 135, alto: 60 }, a: { x: 300, y: 0, ancho: 135, alto: 60 }, ex: { x: -200, y: 200, ancho: 135, alto: 60 } } }]), e = escena(base, 'h'); expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(e.aristas.map(a => a.ref.id)).toEqual(['i', 'a1', 'e']); expect(e.aristas[0]!.tramos[0]!.fin).toBe('piruletaBlanca'); expect(e.aristas[1]!.tramos[0]!.fin).toBe('piruletaNegra'); expect(e.aristas[2]!.tramos[0]!.inicio).toBe('punta'); });
for (const continuidad of [true, false])
    test(`T-221 T-085 B-29 R+C escena conserva continuidad por ID=${continuidad}`, () => { const c = { ...o(), estados: [{ id: 's1', nombre: 'listo' }, { id: 's2', nombre: 'igual' }] }, base = m([c, p(), p('q', 'Preparar'), p('r', 'Despachar')], [{ id: 'er', tipo: 'resultado', objeto: 'o', proceso: 'q', estado: 's1' }, { id: 'ec', tipo: 'consumo', objeto: 'o', proceso: 'r', estado: continuidad ? 's1' : 's2' }], [{ id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['r']], objetosInternos: [], apariciones: { p: { x: 200, y: 200, ancho: 420, alto: 288 }, q: { x: 340, y: 264, ancho: 135, alto: 60 }, r: { x: 340, y: 364, ancho: 135, alto: 60 }, o: { x: 0, y: 0, ancho: 135, alto: 60 } } }]); const parent = { ...base, opds: { ...base.opds, sd: { id: 'sd', tipo: 'raiz' as const, apariciones: { o: { x: 0, y: 0, ancho: 135, alto: 60 }, p: { x: 300, y: 180, ancho: 135, alto: 60 } } } } }, e = escena(parent, 'sd'); expect(e.aristas).toHaveLength(continuidad ? 1 : 2); expect(e.aristas[0]!.tramos).toHaveLength(continuidad ? 2 : 1); expect(e.aristas.flatMap(a => a.hechos)).toEqual(['er', 'ec']); });
test('T-227 edición agrupa OR bajo una referencia y clave de abanico únicas', () => { const base = m([o(), o('a', 'Cliente'), p()], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p' }, { id: 'e2', tipo: 'consumo', objeto: 'a', proceso: 'p' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['e1', 'e2'] } } }, 'sd'), svg = aTexto(dibujar(e, 'edicion')); expect(svg.match(/data-ref="abanico:f"/g)).toHaveLength(1); expect(svg.match(/stroke-dasharray="4 1"/g)).toHaveLength(2); });
test('T-213 rótulos largos itálicos quedan a cada lado de eje inclinado sin atravesar tinta', () => {
    const base = m([o('a', 'Documento'), o('b', 'Archivador')], [{ id: 'e', tipo: 'etiquetadoBidireccional', origen: 'a', destino: 'b', etiqueta: 'permanece cuidadosamente relacionado con', inversa: 'conserva permanentemente su relación inversa con' }]), e = escena(base, 'sd'), a = e.aristas[0]!, t = a.tramos[0]!, p = t.puntos[0]!, q = t.puntos[1]!, dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy);
    for (const l of a.etiquetas) {
        const w = anchoTexto(l.texto, 11, true), corners = [{ x: l.en.x - w / 2, y: l.en.y - 11 }, { x: l.en.x + w / 2, y: l.en.y - 11 }, { x: l.en.x + w / 2, y: l.en.y + 4 }, { x: l.en.x - w / 2, y: l.en.y + 4 }];
        const ds = corners.map(c => (dx * (c.y - p.y) - dy * (c.x - p.x)) / len);
        expect(Math.min(...ds) > 0 || Math.max(...ds) < 0).toBe(true);
    }
});

for (const operador of ['XOR', 'OR'] as const)
    for (const comun of ['entrada'] as const)
        test(`T-209 T-216 fan ${operador} TS3 ${comun} común conserva ambos estados y terminales P`, () => {
            const obj = { ...o(), estados: [{ id: 's0', nombre: 'nuevo' }, { id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }, { id: 's3', nombre: 'listo' }] };
            const enlaces: readonly Enlace[] = ['s1', 's2'].map((estado, i) => ({ id: `f${i}`, tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: estado }));
            const base = m([obj, p()], enlaces), modelo: Modelo = { ...base, abanicos: { f: { id: 'f', operador, enlaces: ['f0', 'f1'] } } }, antes = JSON.stringify(modelo);
            expect(validarForma(modelo)).toEqual([]);
            expect(erroresContexto(modelo)).toEqual([]);
            expect(gatesExportacion(modelo, { opd: 'sd' })).toEqual([]);
            expect(proyectar(modelo, 'sd').abanicos).toEqual([{ abanico: 'f', operador, ramas: ['f0', 'f1'], comun: 'p' }]);
            const e = escena(modelo, 'sd'), objeto = e.nodos.find(n => n.ref.id === 'o')!, proceso = e.nodos.find(n => n.ref.id === 'p')!;
            const enEstado = (punto: { x: number; y: number }, id: string) => {
                const caja = objeto.estados.find(s => s.ref.id === id)!.caja;
                expect(punto.x).toBeGreaterThanOrEqual(caja.x - 1e-9);
                expect(punto.x).toBeLessThanOrEqual(caja.x + caja.ancho + 1e-9);
                expect(punto.y).toBeGreaterThanOrEqual(caja.y - 1e-9);
                expect(punto.y).toBeLessThanOrEqual(caja.y + caja.alto + 1e-9);
            };
            const enProceso = (punto: { x: number; y: number }) => {
                const c = proceso.caja;
                expect(((punto.x - c.x - c.ancho / 2) / (c.ancho / 2)) ** 2 + ((punto.y - c.y - c.alto / 2) / (c.alto / 2)) ** 2).toBeCloseTo(1, 9);
            };
            for (let i = 0; i < 2; i++) {
                const a = e.aristas[i]!, estado = i === 0 ? 's1' : 's2';
                expect(a.ref).toEqual({ tipo: 'enlace', id: `f${i}` });
                expect(a.hechos).toEqual([`f${i}`]);
                expect(a.tramos).toHaveLength(2);
                enEstado(a.tramos[0]!.puntos[0]!, 's0');
                enProceso(a.tramos[0]!.puntos.at(-1)!);
                enProceso(a.tramos[1]!.puntos[0]!);
                enEstado(a.tramos[1]!.puntos.at(-1)!, estado);
                expect(a.tramos.map(t => [t.inicio, t.fin])).toEqual([[undefined, 'punta'], [undefined, 'punta']]);
            }
            expect(e.arcos).toHaveLength(operador === 'XOR' ? 1 : 2);
            for (const arco of e.arcos) {
                expect(arco.abanico).toBe('f');
                expect(arco.doble).toBe(operador === 'OR');
                enProceso(arco.centro);
                expect(arco.hasta).toBeGreaterThan(arco.desde);
            }
            expect(escena(modelo, 'sd')).toBe(e);
            expect(JSON.stringify(modelo)).toBe(antes);
        });

// DESIGN 6.3: regresiones de revisión independiente; posiciones guardadas intactas.
function modeloRevision(): Modelo {
    const base = m([{ ...o(), estados: [{ id: 's', nombre: 'nuevo' }, { id: 't', nombre: 'listo' }] }, { ...p(), duracion: { min: 1, max: 5 } }]);
    return { ...base, opds: { sd: { ...base.opds.sd!, apariciones: { o: { x: 0, y: 0, ancho: 200, alto: 140 }, p: { x: 450, y: 320, ancho: 200, alto: 100 } } } } };
}
function revisarModelo(base: Modelo) {
    expect(validarForma(base)).toEqual([]);
    expect(erroresContexto(base)).toEqual([]);
    expect(gatesExportacion(base, 'modelo')).toEqual([]);
}
function elementos(n: ReturnType<typeof dibujar>): ReturnType<typeof dibujar>[] {
    return [n, ...(n.h ?? []).flatMap(h => typeof h === 'string' ? [] : elementos(h))];
}
function distancia(a: { x: number; y: number }, b: { x: number; y: number }) { return Math.hypot(a.x - b.x, a.y - b.y); }
test('T-214 revisión e/c círculos18 papel tinta en canon y edición', () => {
    for (const control of ['e', 'c'] as const) {
        const base = { ...modeloRevision(), enlaces: { en: { id: 'en', tipo: 'consumo' as const, objeto: 'o', proceso: 'p', control } } }, antes = JSON.stringify(base);
        revisarModelo(base);
        for (const modo of ['canon', 'edicion'] as const) {
            const ns = elementos(dibujar(escena(base, 'sd'), modo));
            expect(ns.some(n => n.t === 'circle' && n.a.r === 9 && n.a.fill === '#fafaf8' && n.a.stroke === '#171511')).toBe(true);
            expect(ns.some(n => n.t === 'text' && n.h?.includes(control))).toBe(true);
        }
        expect(JSON.stringify(base)).toBe(antes);
    }
});
test('T-214 revisión control28 desde perímetroP sin cap proporcional', () => {
    for (const x of [450, 210]) {
        const b = modeloRevision(), base = { ...b, enlaces: { en: { id: 'en', tipo: 'consumo' as const, objeto: 'o', proceso: 'p', control: 'e' as const } }, opds: { sd: { ...b.opds.sd!, apariciones: { ...b.opds.sd!.apariciones, p: { x, y: 0, ancho: 200, alto: 100 } } } } };
        revisarModelo(base);
        const a = escena(base, 'sd').aristas[0]!;
        expect(distancia(a.marcas[0]!.en, a.tramos[0]!.puntos.at(-1)!)).toBeCloseTo(28, 9);
    }
});
test('T-207 revisión DEFAULT superior izquierdo abierto y bbox de tinta', () => {
    const b = modeloRevision(), base = { ...b, cosas: { ...b.cosas, o: { ...b.cosas.o! as Objeto, porDefecto: 's' } } };
    revisarModelo(base);
    const e = escena(base, 'sd'), s = e.nodos[0]!.estados[0]!, ns = elementos(dibujar(e, 'edicion')), g = ns.find(n => n.a['data-ref'] === 'estado:s')!;
    const path = elementos(g).find(n => n.t === 'path')!;
    const [x, y, tx, ty] = String(path.a.d).match(/^M\s+([-\d.e+]+)\s+([-\d.e+]+)\s+L\s+([-\d.e+]+)\s+([-\d.e+]+)/)!.slice(1).map(Number);
    expect(x!).toBeLessThan(s.caja.x); expect(y!).toBeLessThan(s.caja.y);
    expect([tx, ty]).toEqual([s.caja.x, s.caja.y]);
    expect(e.caja.x).toBeLessThanOrEqual(x! - .6); expect(e.caja.y).toBeLessThanOrEqual(y! - .6);
    expect(path.a.fill).toBe('none');
});
test('T-213 revisión bi tercios recortados y lados opuestos', () => {
    const b = modeloRevision(), base = { ...b, cosas: { ...b.cosas, q: o('q', 'Cliente') }, enlaces: { bi: { id: 'bi', tipo: 'etiquetadoBidireccional' as const, origen: 'o', destino: 'q', etiqueta: 'pertenece a', inversa: 'posee' } }, opds: { sd: { ...b.opds.sd!, apariciones: { ...b.opds.sd!.apariciones, q: { x: 440, y: 300, ancho: 180, alto: 130 } } } } };
    revisarModelo(base);
    const a = escena(base, 'sd').aristas[0]!, [s, t] = a.tramos[0]!.puntos, dx = t!.x - s!.x, dy = t!.y - s!.y, len2 = dx * dx + dy * dy;
    const ls = ['etiqueta', 'inversa'].map(k => a.etiquetas.find(l => l.clave === k)!);
    expect(ls.map(l => l.texto)).toEqual(['pertenece a', 'posee']);
    expect(((ls[0]!.en.x - s!.x) * dx + (ls[0]!.en.y - s!.y) * dy) / len2).toBeCloseTo(1 / 3, 9);
    expect(((ls[1]!.en.x - s!.x) * dx + (ls[1]!.en.y - s!.y) * dy) / len2).toBeCloseTo(2 / 3, 9);
    expect(ls.map(l => dx * (l.en.y - s!.y) - dy * (l.en.x - s!.x)).reduce((a, b) => a * b)).toBeLessThan(0);
    expect(ls.every(l => l.italica)).toBe(true);
});
test('T-207 revisión CURRENT círculo3.5 y pie externo por identidad', () => {
    const b = modeloRevision(), base = { ...b, cosas: { ...b.cosas, o: { ...b.cosas.o! as Objeto, current: 's' } } }, antes = JSON.stringify(base);
    revisarModelo(base);
    const e = escena(base, 'sd'), s = e.nodos[0]!.estados[0]!, ns = elementos(dibujar(e, 'edicion')), g = ns.find(n => n.a['data-ref'] === 'estado:s')!, children = elementos(g), c = children.find(n => n.t === 'circle' && n.a.r === 3.5)!;
    expect(c).toBeDefined(); expect(c.a.cx).toBe(s.caja.x + s.caja.ancho);
    expect(Number(c.a.cy) + 3.5).toBeLessThanOrEqual(s.caja.y);
    expect(children.some(n => n.t === 'line' || n.t === 'path' && n.a['aria-label'] === 'pin-current' && String(n.a.d).includes('L '))).toBe(true);
    expect(e.caja.y).toBeLessThanOrEqual(Number(c.a.cy) - 4);
    expect(JSON.stringify(base)).toBe(antes);
});
test('T-219 revisión ruta10perpendicular izquierda O→P incluso resultado', () => {
    for (const tipo of ['consumo', 'resultado'] as const) {
        const base = { ...modeloRevision(), enlaces: { en: { id: 'en', tipo, objeto: 'o', proceso: 'p', ruta: 'principal' } } };
        revisarModelo(base);
        const a = escena(base, 'sd').aristas[0]!, [s, t] = a.tramos[0]!.puntos, signo = tipo === 'resultado' ? -1 : 1, dx = (t!.x - s!.x) * signo, dy = (t!.y - s!.y) * signo, l = Math.hypot(dx, dy), r = a.etiquetas.find(l => l.clave === 'ruta')!;
        expect(r.en.x - (s!.x + t!.x) / 2).toBeCloseTo(10 * dy / l, 9);
        expect(r.en.y - (s!.y + t!.y) / 2).toBeCloseTo(-10 * dx / l, 9);
    }
});
test('T-215 revisión excepciones22 desde manejador sin puntas', () => {
    const b = modeloRevision(), base = { ...b, cosas: { ...b.cosas, q: p('q', 'Manejar') }, enlaces: { x: { id: 'x', tipo: 'excepcionSobretiempo' as const, origen: 'p', destino: 'q' }, y: { id: 'y', tipo: 'excepcionSubtiempo' as const, origen: 'p', destino: 'q' } }, opds: { sd: { ...b.opds.sd!, apariciones: { ...b.opds.sd!.apariciones, q: { x: 900, y: 320, ancho: 200, alto: 100 } } } } };
    revisarModelo(base);
    for (const a of escena(base, 'sd').aristas) { expect(distancia(a.marcas[0]!.en, a.tramos[0]!.puntos.at(-1)!)).toBeCloseTo(22, 9); expect(a.tramos[0]!.fin).toBeUndefined(); }
});
test('T-206 revisión ancho texto13itálica+16 y6inicial altura26', () => {
    const b = modeloRevision(), base = { ...b, cosas: { ...b.cosas, o: { ...b.cosas.o! as Objeto, estados: [{ id: 's', nombre: 'extraordinariamente', inicial: true as const }, { id: 't', nombre: 'independientemente' }] } } };
    revisarModelo(base);
    const ss = escena(base, 'sd').nodos[0]!.estados;
    expect(ss[0]!.caja.ancho).toBeCloseTo(anchoTexto('extraordinariamente', 13, true) + 22, 9);
    expect(ss[1]!.caja.ancho).toBeCloseTo(anchoTexto('independientemente', 13, true) + 16, 9);
    expect(ss.map(s => s.caja.alto)).toEqual([26, 26]);
});
test('T-206 revisión separación8 y orden de estados', () => {
    const base = modeloRevision(); revisarModelo(base);
    const [a, b] = escena(base, 'sd').nodos[0]!.estados;
    expect(b!.caja.x - a!.caja.x - a!.caja.ancho).toBeCloseTo(8, 9);
    expect([a!.ref.id, b!.ref.id]).toEqual(['s', 't']);
});
test('T-208 revisión chip16 inferior derecho persiste canon', () => {
    const b = modeloRevision(), base = { ...b, cosas: { ...b.cosas, o: { ...b.cosas.o! as Objeto, estados: [{ id: 's', nombre: 'nuevo', suprimido: true as const }, { id: 't', nombre: 'listo' }] } } };
    revisarModelo(base); const e = escena(base, 'sd'), chip = e.nodos[0]!.chipOcultos!;
    expect(chip.n).toBe(1); expect(chip.caja.alto).toBe(16);
    expect(elementos(dibujar(e, 'canon')).some(n => n.t === 'rect' && n.a.height === 16 && n.a.rx === 8)).toBe(true);
});
test('T-218 revisión multiplicidad14+perpendicular10 por extremo objeto', () => {
    for (const tipo of ['consumo', 'resultado'] as const) {
        const base = { ...modeloRevision(), enlaces: { en: { id: 'en', tipo, objeto: 'o', proceso: 'p', mult: '+' as const } } }; revisarModelo(base);
        const a = escena(base, 'sd').aristas[0]!, [s, t] = a.tramos[0]!.puntos, origen = tipo === 'consumo' ? s! : t!, otro = tipo === 'consumo' ? t! : s!, dx = otro.x - origen.x, dy = otro.y - origen.y, l = Math.hypot(dx, dy), q = a.etiquetas.find(l => l.clave === 'mult-origen')!, ox = q.en.x - origen.x, oy = q.en.y - origen.y;
        expect((ox * dx + oy * dy) / l).toBeCloseTo(14, 9);
        expect(Math.abs((dx * oy - dy * ox) / l)).toBeCloseTo(10, 9);
    }
});
test('T-220 revisión slots ausentes– sin duración ausente', () => {
    const base = modeloRevision(); revisarModelo(base);
    expect(escena(base, 'sd').nodos[1]!.duracion).toBe('[min] {1, –, 5}');
    expect(escena(m([p()]), 'sd').nodos[0]!.duracion).toBeUndefined();
});

test('T-214 T-218 T-219 revisión anotaciones siguen tramo final de abanico', () => {
    for (const control of ['c', undefined] as const) {
        const b = modeloRevision(), base: Modelo = { ...b, cosas: { ...b.cosas, q: o('q', 'Cliente') }, enlaces: { en: { id: 'en', tipo: 'consumo', objeto: 'o', proceso: 'p', ruta: 'principal', ...(control ? { control } : { mult: '+' }) }, eq: { id: 'eq', tipo: 'consumo', objeto: 'q', proceso: 'p', ...(control ? { control } : {}) } }, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['en', 'eq'] } }, opds: { sd: { ...b.opds.sd!, apariciones: { ...b.opds.sd!.apariciones, q: { x: 0, y: 500, ancho: 200, alto: 140 } } } } };
        revisarModelo(base);
        const a = escena(base, 'sd').aristas.find(a => a.ref.id === 'en')!, [s, t] = a.tramos[0]!.puntos;
        if (control) expect(distancia(a.marcas[0]!.en, t!)).toBeCloseTo(28, 9);
        const dx = t!.x - s!.x, dy = t!.y - s!.y, l = Math.hypot(dx, dy), ruta = a.etiquetas.find(e => e.clave === 'ruta')!;
        expect(ruta.en.x - (s!.x + t!.x) / 2).toBeCloseTo(10 * dy / l, 9);
        expect(ruta.en.y - (s!.y + t!.y) / 2).toBeCloseTo(-10 * dx / l, 9);
        if (!control) {
            const mult = a.etiquetas.find(e => e.clave === 'mult-origen')!;
            expect(((mult.en.x - s!.x) * dx + (mult.en.y - s!.y) * dy) / l).toBeCloseTo(14, 9);
            expect(Math.abs((dx * (mult.en.y - s!.y) - dy * (mult.en.x - s!.x)) / l)).toBeCloseTo(10, 9);
        }
    }
});

// APPEND T204/T220: la medición genuina de tinta de [ y } precede a este RED.
for(const declarado of [60,80]) test(`T-204 T-220 duración inscrita con semiejes de contenido ${declarado}`,()=>{
    const proc:Proceso={...p('p','Preparar'),duracion:{min:1e20,esperada:2e20,max:3e20}};
    const base=m([proc]),modelo:Modelo={...base,opds:{sd:{...base.opds.sd!,apariciones:{p:{x:-200,y:-150,ancho:160,alto:declarado}}}}};
    expect(validarForma(modelo)).toEqual([]);expect(erroresContexto(modelo)).toEqual([]);
    const antes=JSON.stringify(modelo);Object.freeze(modelo);const n=escena(modelo,'sd').nodos[0]!;
    const contenido=Math.max(anchoTexto(n.duracion!,11,false),...n.rotulo.lineas.map(l=>anchoTexto(l,17,true)));
    expect(n.caja.ancho).toBeGreaterThanOrEqual(contenido*Math.SQRT2+16);
    expect(n.caja.alto).toBeGreaterThanOrEqual((n.rotulo.lineas.length*22+20)*Math.SQRT2+16);
    expect(modelo.opds.sd!.apariciones.p).toEqual({x:-200,y:-150,ancho:160,alto:declarado});expect(JSON.stringify(modelo)).toBe(antes);
});

import { colocarMarcador } from './marcadores';
for(const tipo of ['reciproco','etiquetadoBidireccional'] as const) test(`T-213 ${tipo} medias puntas en lados globales opuestos en ambas tangentes`,()=>{
 const base=m([o(),o('b','Cliente')],[tipo==='etiquetadoBidireccional'?{id:'e',tipo,origen:'o',destino:'b',etiqueta:'conoce',inversa:'es-conocido'}:{id:'e',tipo,origen:'o',destino:'b',etiqueta:'conoce'}]);
 expect(validarForma(base)).toEqual([]);expect(erroresContexto(base)).toEqual([]);
 const t=escena(base,'sd').aristas[0]!.tramos[0]!, [a,b]=t.puntos;
 const p0=colocarMarcador(t.inicio!,a!,b!),p1=colocarMarcador(t.fin!,b!,a!);
 const ala=(q:typeof p0,p:typeof a)=>{const y=q.figura.datos.endsWith('-10')?-10:10;return {x:q.matriz[0]*20+q.matriz[2]*y+q.matriz[4]-p!.x,y:q.matriz[1]*20+q.matriz[3]*y+q.matriz[5]-p!.y};};
 const w0=ala(p0,a),w1=ala(p1,b),dx=b!.x-a!.x,dy=b!.y-a!.y;
 expect((dx*w0.y-dy*w0.x)*(dx*w1.y-dy*w1.x)).toBeLessThan(0);
});
test('T-221 contenedor final real centra nombre, duración y estados conservando posiciones persistidas',()=>{
 const base=m([p('p','Procesar'),p('q','Preparar'),p('r','Finalizar')],[],[{id:'h',tipo:'descomposicion',padre:'sd',cosa:'p',orden:0,bandas:[['q'],['r']],objetosInternos:[],apariciones:{p:{x:0,y:0,ancho:200,alto:200},q:{x:50,y:80,ancho:135,alto:60},r:{x:550,y:250,ancho:135,alto:60}}}]);
 expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]);const antes=JSON.stringify(base),n=escena(base,'h').nodos.find(n=>n.ref.id==='p')!;
 expect(n.caja.ancho).toBe(709); expect(n.rotulo.x).toBe(n.caja.x+n.caja.ancho/2); expect(n.rotulo.y).toBe(n.caja.y+24);expect(JSON.stringify(base)).toBe(antes);
});
test('T-212 dibujo de triángulo estructural conserva trazo 1.2 y punta procedimental 1',()=>{
 const e=escena(m([o(),o('b','Parte')],[{id:'e',tipo:'agregacion',refinable:'o',refinador:'b'}]),'sd');
 const ns=elementos(dibujar(e,'canon'));expect(ns.find(n=>n.t==='polygon' && n.a.points==='15,0 30,30 0,30')?.a['stroke-width']).toBe(1.2);
});

test('T-219 tinta de ruta preserva negro y ancla10, con separación de papel del trazo asociado',()=>{
 const b=modeloRevision(),base:Modelo={...b,enlaces:{en:{id:'en',tipo:'consumo',objeto:'o',proceso:'p',ruta:'principal'}}};revisarModelo(base);const e=escena(base,'sd'),ruta=e.aristas[0]!.etiquetas.find(l=>l.clave==='ruta')!;
 const n=elementos(dibujar(e,'canon')).find(n=>n.t==='text'&&n.h?.includes('principal'))!;
 expect(n.a.x).toBe(ruta.en.x);expect(n.a.y).toBe(ruta.en.y);expect(n.a.fill).toBe('#000');expect(n.a['font-size']).toBe(11);
 expect(n.a['paint-order']).toBe('stroke fill');expect(n.a.stroke).toBe('#fafaf8');expect(n.a['stroke-width']).toBe(3);
});

// DEC34: el layout importado respeta tamaños y posiciones persistidos; el texto se ajusta dentro
// y sólo crece lo que no cabe, hacia donde no pisa a nadie.
import { readFileSync, readdirSync } from 'node:fs';
import { importarV0 } from '../codec/importar';
import { advertenciasEscena } from './exportar';
const sobre = (m0: Modelo, pos: Record<string, { x: number; y: number; ancho: number; alto: number }>): Modelo => ({ ...m0, opds: { ...m0.opds, sd: { ...m0.opds.sd!, apariciones: pos } } });
for (const [tipo, nombre, lineas] of [['objeto', 'OnStar System', 1], ['objeto', 'System Handler', 2], ['objeto', 'Cellular Network', 2], ['proceso', 'Call Making', 1], ['proceso', 'Driver Rescuing', 2], ['proceso', 'Call Handling', 1]] as const)
    test(`T-204 DEC34 ${tipo} «${nombre}» cabe envuelto en 135×60 sin crecer`, () => {
        const c = tipo === 'objeto' ? o('c', nombre) : p('c', nombre), base = sobre(m([c]), { c: { x: 10, y: 20, ancho: 135, alto: 60 } }), antes = JSON.stringify(base);
        const n = escena(base, 'sd').nodos[0]!;
        expect(n.caja).toEqual({ x: 10, y: 20, ancho: 135, alto: 60 });
        expect(n.rotulo.lineas).toHaveLength(lineas); expect(n.rotulo.lineas.join(' ')).toBe(nombre);
        for (const [i, l] of n.rotulo.lineas.entries()) {
            const w = anchoTexto(l, 17, tipo === 'proceso'), y = n.rotulo.y + i * 22 - 17;
            if (tipo === 'objeto') { expect(w).toBeLessThanOrEqual(n.caja.ancho - 16); expect(y).toBeGreaterThanOrEqual(n.caja.y); expect(y + 22).toBeLessThanOrEqual(n.caja.y + n.caja.alto); }
            else for (const yy of [y, y + 22]) expect(w / 2 + 4).toBeLessThanOrEqual(n.caja.ancho / 2 * Math.sqrt(Math.max(0, 1 - ((yy - n.caja.y - n.caja.alto / 2) / (n.caja.alto / 2)) ** 2)) + 1e-9);
        }
        expect(JSON.stringify(base)).toBe(antes);
    });
test('T-204 DEC34 expansión crece hacia el lado libre y contiene la caja persistida', () => {
    const base = sobre(m([o('o', 'A'.repeat(60)), p()]), { o: { x: 0, y: 0, ancho: 135, alto: 60 }, p: { x: 140, y: 0, ancho: 135, alto: 60 } }), antes = JSON.stringify(base);
    const e = escena(base, 'sd'), n = e.nodos.find(n => n.ref.id === 'o')!;
    expect(n.caja.ancho).toBeGreaterThanOrEqual(anchoTexto('A'.repeat(60), 17, false) + 24);
    expect(n.caja.x).toBeLessThan(0); expect(n.caja.x + n.caja.ancho).toBeGreaterThanOrEqual(135); expect(n.caja.y).toBeLessThanOrEqual(0); expect(n.caja.y + n.caja.alto).toBeGreaterThanOrEqual(60);
    expect(n.caja.x + n.caja.ancho).toBeLessThanOrEqual(140);
    expect(advertenciasEscena(e).filter(w => w.tipo === 'solape')).toEqual([]);
    expect(e.nodos.find(n => n.ref.id === 'p')!.caja).toEqual({ x: 140, y: 0, ancho: 135, alto: 60 }); expect(JSON.stringify(base)).toBe(antes);
});
test('T-204 T-212 DEC34 fixtures no ganan solapes que no tuvieran en el v0', () => {
    const area = (a: { x: number; y: number; ancho: number; alto: number }, b: typeof a) => Math.max(0, Math.min(a.x + a.ancho, b.x + b.ancho) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.alto, b.y + b.alto) - Math.max(a.y, b.y));
    const nuevos: string[] = [];
    for (const f of readdirSync(new URL('../../fixtures/v0/', import.meta.url)).filter(f => f.endsWith('.json')).sort()) {
        const r = importarV0(readFileSync(new URL('../../fixtures/v0/' + f, import.meta.url), 'utf8')); if (!r.ok) throw Error(f);
        for (const opd of Object.keys(r.modelo.opds)) {
            const e = escena(r.modelo, opd), ap = r.modelo.opds[opd]!.apariciones;
            for (const [i, a] of e.nodos.entries()) for (const b of e.nodos.slice(i + 1))
                if (!a.contenedor && !b.contenedor && area(a.caja, b.caja) > 0 && area(ap[a.ref.id]!, ap[b.ref.id]!) === 0)
                    nuevos.push(`${f} ${opd} ${r.modelo.cosas[a.ref.id]!.nombre} × ${r.modelo.cosas[b.ref.id]!.nombre}`);
        }
    }
    // Único caso sin salida: fila sintética con 45 px entre cajas cuyos estados exigen +100 px de ancho.
    expect(nuevos).toEqual(['sintetico.json opd-1 Objeto_0 × Objeto_1', 'sintetico.json opd-1 Objeto_1 × Objeto_2', 'sintetico.json opd-1 Objeto_4 × Objeto_5', 'sintetico.json opd-1 Objeto_5 × Procesar_0']);
});
