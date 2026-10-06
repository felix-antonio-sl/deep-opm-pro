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
test('T-211 rayo invocación y lazo autoinvocación', () => { const e = escena(m([p(), p('q', 'Preparar')], [{ id: 'e', tipo: 'invocacion', origen: 'p', destino: 'q' }, { id: 'l', tipo: 'invocacion', origen: 'p', destino: 'p' }]), 'sd'); expect(e.aristas.every(a => a.rayo)).toBe(true); expect(e.aristas[0]!.tramos[0]!.puntos).toHaveLength(4); expect(e.aristas[1]!.tramos[0]!.puntos.length).toBeGreaterThan(4); });
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
test('T-213 itálicas, ruta, multiplicidades y arpones', () => { const e = escena(m([o(), o('a', 'Cliente'), p()], [{ id: 'e', tipo: 'etiquetadoBidireccional', origen: 'o', destino: 'a', etiqueta: 'pertenece a', inversa: 'posee', multOrigen: '?', multDestino: '*' }, { id: 'r', tipo: 'consumo', objeto: 'o', proceso: 'p', ruta: 'principal', mult: '+' }]), 'sd'); expect(e.aristas[0]!.tramos[0]!.inicio).toBe('arponInverso'); expect(e.aristas[0]!.tramos[0]!.fin).toBe('arpon'); expect(e.aristas[0]!.etiquetas.filter(l => l.italica).map(l => l.texto)).toEqual(['pertenece a', 'posee']); expect(e.aristas[1]!.etiquetas.map(l => l.texto)).toEqual(['principal', '+']); });
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
test('T-216 T-224 abanico anclado a estado común conserva recorte en cápsula', () => { const c = { ...o(), estados: [{ id: 's', nombre: 'listo' }] }, base = m([c, p(), p('q', 'Preparar')], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's' }, { id: 'e2', tipo: 'consumo', objeto: 'o', proceso: 'q', estado: 's' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['e1', 'e2'] } } }, 'sd'), s = e.nodos[0]!.estados[0]!, punto = e.arcos[0]!.centro; expect(punto.x).toBeGreaterThanOrEqual(s.caja.x); expect(punto.x).toBeLessThanOrEqual(s.caja.x + s.caja.ancho); expect(punto.y).toBeGreaterThanOrEqual(s.caja.y); expect(punto.y).toBeLessThanOrEqual(s.caja.y + s.caja.alto); });
test('T-216 abanico colineal conserva sector cero y OR dos registros', () => { const base = m([o(), p(), p('q', 'Preparar')], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p' }, { id: 'e2', tipo: 'consumo', objeto: 'o', proceso: 'q' }]), e = escena({ ...base, opds: { sd: { ...base.opds.sd!, apariciones: { o: { x: 0, y: 0, ancho: 135, alto: 60 }, p: { x: 300, y: 0, ancho: 135, alto: 60 }, q: { x: 600, y: 0, ancho: 135, alto: 60 } } } }, abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['e1', 'e2'] } } }, 'sd'); expect(e.arcos).toHaveLength(2); expect(e.arcos[0]!.desde).toBe(e.arcos[0]!.hasta); expect(e.arcos.map(a => a.radio)).toEqual([30, 35]); });
test('T-221 T-086 B-19 contorno hijo conserva habilitadores y efecto básico; excluye dos externos', () => { const o1 = { ...o('o', 'Equipo'), estados: [{ id: 's', nombre: 'disponible' }] }, base = m([o1, { ...o('a', 'Operador'), esencia: 'fisica' }, { ...o('ex', 'Otro'), estados: [{ id: 'sx', nombre: 'disponible' }] }, p(), p('q', 'Preparar'), p('r', 'Despachar')], [{ id: 'i', tipo: 'instrumento', objeto: 'o', proceso: 'p' }, { id: 'a1', tipo: 'agente', objeto: 'a', proceso: 'p' }, { id: 'e', tipo: 'efecto', objeto: 'ex', proceso: 'p' }, { id: 'externo', tipo: 'etiquetado', origen: 'o', destino: 'a', etiqueta: 'pertenece a' }], [{ id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['r']], objetosInternos: [], apariciones: { p: { x: 200, y: 200, ancho: 420, alto: 288 }, q: { x: 340, y: 264, ancho: 135, alto: 60 }, r: { x: 340, y: 364, ancho: 135, alto: 60 }, o: { x: 0, y: 0, ancho: 135, alto: 60 }, a: { x: 300, y: 0, ancho: 135, alto: 60 }, ex: { x: -200, y: 200, ancho: 135, alto: 60 } } }]), e = escena(base, 'h'); expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(e.aristas.map(a => a.ref.id)).toEqual(['i', 'a1', 'e']); expect(e.aristas[0]!.tramos[0]!.fin).toBe('piruletaBlanca'); expect(e.aristas[1]!.tramos[0]!.fin).toBe('piruletaNegra'); expect(e.aristas[2]!.tramos[0]!.inicio).toBe('punta'); });
for (const continuidad of [true, false])
    test(`T-221 T-085 B-29 R+C escena conserva continuidad por ID=${continuidad}`, () => { const c = { ...o(), estados: [{ id: 's1', nombre: 'listo' }, { id: 's2', nombre: 'igual' }] }, base = m([c, p(), p('q', 'Preparar'), p('r', 'Despachar')], [{ id: 'er', tipo: 'resultado', objeto: 'o', proceso: 'q', estado: 's1' }, { id: 'ec', tipo: 'consumo', objeto: 'o', proceso: 'r', estado: continuidad ? 's1' : 's2' }], [{ id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['r']], objetosInternos: [], apariciones: { p: { x: 200, y: 200, ancho: 420, alto: 288 }, q: { x: 340, y: 264, ancho: 135, alto: 60 }, r: { x: 340, y: 364, ancho: 135, alto: 60 }, o: { x: 0, y: 0, ancho: 135, alto: 60 } } }]); const parent = { ...base, opds: { ...base.opds, sd: { id: 'sd', tipo: 'raiz' as const, apariciones: { o: { x: 0, y: 0, ancho: 135, alto: 60 }, p: { x: 300, y: 180, ancho: 135, alto: 60 } } } } }, e = escena(parent, 'sd'); expect(e.aristas).toHaveLength(continuidad ? 1 : 2); expect(e.aristas[0]!.tramos).toHaveLength(continuidad ? 2 : 1); expect(e.aristas.flatMap(a => a.hechos)).toEqual(['er', 'ec']); });
test('T-227 edición agrupa OR bajo una referencia y clave de abanico únicas', () => { const base = m([o(), o('a', 'Cliente'), p()], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p' }, { id: 'e2', tipo: 'consumo', objeto: 'a', proceso: 'p' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['e1', 'e2'] } } }, 'sd'), svg = aTexto(dibujar(e, 'edicion')); expect(svg.match(/data-ref="abanico:f"/g)).toHaveLength(1); expect(svg.match(/stroke-dasharray="4 1"/g)).toHaveLength(2); });
test('T-216 T-224 B-31 abanico con estados heterogéneos no cambia anclajes', () => {
    const c = { ...o(), estados: [{ id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }] }, base = m([c, p(), p('q', 'Archivar')], [{ id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's1' }, { id: 'e2', tipo: 'consumo', objeto: 'o', proceso: 'q', estado: 's2' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['e1', 'e2'] } } }, 'sd');
    for (let i = 0; i < 2; i++) {
        const s = e.nodos[0]!.estados[i]!.caja, p = e.aristas[i]!.tramos[0]!.puntos[0]!;
        expect(p.x).toBeGreaterThanOrEqual(s.x - 1e-9);
        expect(p.x).toBeLessThanOrEqual(s.x + s.ancho + 1e-9);
        expect(p.y).toBeGreaterThanOrEqual(s.y - 1e-9);
        expect(p.y).toBeLessThanOrEqual(s.y + s.alto + 1e-9);
    }
});
test('T-209 T-216 B-31 fan TS3 salida común conserva entrada→P, P→salida y dos arcos OR', () => {
    const c = { ...o(), estados: [{ id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }, { id: 's3', nombre: 'listo' }] }, base = m([c, p()], [{ id: 'e1', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's1', salida: 's3' }, { id: 'e2', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's2', salida: 's3' }]), e = escena({ ...base, abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['e1', 'e2'] } } }, 'sd');
    expect(validarForma(base)).toEqual([]);
    expect(erroresContexto({ ...base, abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['e1', 'e2'] } } })).toEqual([]);
    expect(e.arcos).toHaveLength(2);
    for (let i = 0; i < 2; i++) {
        const s = e.nodos[0]!.estados[i]!.caja, t = e.aristas[i]!.tramos[0]!, p = t.puntos[0]!;
        expect(p.x).toBeGreaterThanOrEqual(s.x);
        expect(p.x).toBeLessThanOrEqual(s.x + s.ancho);
        expect(p.y).toBeGreaterThanOrEqual(s.y);
        expect(p.y).toBeLessThanOrEqual(s.y + s.alto);
        expect(e.aristas[i]!.tramos).toHaveLength(2);
        expect(t.fin).toBe('punta');
    }
});
test('T-213 rótulos largos itálicos quedan a cada lado de eje inclinado sin atravesar tinta', () => {
    const base = m([o('a', 'Documento'), o('b', 'Archivador')], [{ id: 'e', tipo: 'etiquetadoBidireccional', origen: 'a', destino: 'b', etiqueta: 'permanece cuidadosamente relacionado con', inversa: 'conserva permanentemente su relación inversa con' }]), e = escena(base, 'sd'), a = e.aristas[0]!, t = a.tramos[0]!, p = t.puntos[0]!, q = t.puntos[1]!, dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy);
    for (const l of a.etiquetas) {
        const w = anchoTexto(l.texto, 11, true), corners = [{ x: l.en.x - w / 2, y: l.en.y - 11 }, { x: l.en.x + w / 2, y: l.en.y - 11 }, { x: l.en.x + w / 2, y: l.en.y + 4 }, { x: l.en.x - w / 2, y: l.en.y + 4 }];
        const ds = corners.map(c => (dx * (c.y - p.y) - dy * (c.x - p.x)) / len);
        expect(Math.min(...ds) > 0 || Math.max(...ds) < 0).toBe(true);
    }
});

for (const operador of ['XOR', 'OR'] as const)
    for (const comun of ['entrada', 'salida'] as const)
        test(`T-209 T-216 fan ${operador} TS3 ${comun} común conserva ambos estados y terminales P`, () => {
            const obj = { ...o(), estados: [{ id: 's0', nombre: 'nuevo' }, { id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }, { id: 's3', nombre: 'listo' }] };
            const enlaces: readonly Enlace[] = ['s1', 's2'].map((estado, i) => ({ id: `f${i}`, tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: comun === 'entrada' ? 's0' : estado, salida: comun === 'salida' ? 's3' : estado }));
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
                enEstado(a.tramos[0]!.puntos[0]!, comun === 'entrada' ? 's0' : estado);
                enProceso(a.tramos[0]!.puntos.at(-1)!);
                enProceso(a.tramos[1]!.puntos[0]!);
                enEstado(a.tramos[1]!.puntos.at(-1)!, comun === 'salida' ? 's3' : estado);
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

// Criterio A autorizado, DESIGN §6.3. Datos de los 16 casos manuales comunesO
// y las dos sondas degeneradas/DS-10; los históricos 0/16 y 0/2 no se reescriben.
import { noOfrecido, violacionesAbanico } from '../nucleo/matriz';
import { exportarDiagrama, exportarDocumento } from './exportar';
import { generarBloque } from '../opl/generar';
type FamiliaA = 'consumo' | 'resultado' | 'agente' | 'instrumento';
function modeloCriterioA(tipo: FamiliaA, operador: 'XOR' | 'OR', parcial: boolean): Modelo {
    const enlace = (id: string, proceso: string, estado?: string): Enlace => ({ id, tipo, objeto: 'o', proceso, ...(estado ? { estado } : {}) });
    return {
        id: `review-${operador}-${tipo}-${parcial ? 'ausencia' : 'distintos'}`, nombre: 'Modelo', raiz: 'sd', secuencia: 100, unidadTiempo: 'min',
        cosas: { o: { ...o('o', 'Registro'), esencia: tipo === 'agente' ? 'fisica' : 'informacional', estados: [{ id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }] }, p: p('p', 'Preparar'), q: p('q', 'Despachar') },
        enlaces: { e1: enlace('e1', 'p', 's1'), e2: enlace('e2', 'q', parcial ? undefined : 's2') },
        abanicos: { f: { id: 'f', operador, enlaces: ['e1', 'e2'] } },
        opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { o: { x: 0, y: 0, ancho: 300, alto: 220 }, p: { x: 550, y: 0, ancho: 160, alto: 80 }, q: { x: 550, y: 300, ancho: 160, alto: 80 } } } }
    };
}
function congelarCriterioA<T>(valor: T): T {
    if (valor && typeof valor === 'object' && !Object.isFrozen(valor)) {
        Object.values(valor).forEach(congelarCriterioA);
        Object.freeze(valor);
    }
    return valor;
}
function comprobarCriterioA(base: Modelo, referencia: { x: number; y: number }, sector: readonly [number, number], uniforme = false): void {
    const antes = JSON.stringify(base), f = base.abanicos.f!;
    expect(validarForma(base)).toEqual([]);
    expect(erroresContexto(base)).toEqual([]);
    expect(violacionesAbanico(base, f)).toEqual([]);
    expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
    expect(gatesExportacion(base, 'modelo')).toEqual([]);
    Object.values(base.enlaces).forEach(e => expect(noOfrecido(base, e, f)).toBeNull());
    congelarCriterioA(base);
    const e = escena(base, 'sd'), objeto = e.nodos.find(n => n.ref.id === 'o')!, vista = proyectar(base, 'sd');
    expect(vista.abanicos).toHaveLength(1);
    expect(vista.abanicos[0]).toMatchObject({ abanico: 'f', comun: 'o', operador: f.operador, ramas: ['e1', 'e2'] });
    expect(e.aristas.map(a => a.ref)).toEqual([{ tipo: 'enlace', id: 'e1' }, { tipo: 'enlace', id: 'e2' }]);
    if (uniforme) {
        expect(e.arcos.map(a => [a.abanico, a.radio, a.doble])).toEqual(f.operador === 'OR' ? [['f', 30, true], ['f', 35, true]] : [['f', 30, false]]);
        for (const arco of e.arcos) {
            expect(arco.centro.x).toBeCloseTo(referencia.x, 9);
            expect(arco.centro.y).toBeCloseTo(referencia.y, 9);
            expect(arco.desde).toBeCloseTo(sector[0], 9);
            expect(arco.hasta).toBeCloseTo(sector[1], 9);
        }
    } else {
        comprobarB(base);
    }
    for (const id of f.enlaces) {
        const enlace = base.enlaces[id]!;
        if (!('objeto' in enlace) || !('estado' in enlace) && enlace.tipo === 'efecto') throw Error('Fixture C/R/A/I');
        const arista = e.aristas.find(a => a.ref.id === id)!, tramo = arista.tramos[0]!;
        expect(arista.hechos).toEqual([id]);
        expect(arista.tramos).toHaveLength(1);
        if (uniforme) expect(tramo.puntos).toHaveLength(2); else expect(tramo.puntos.length).toBeGreaterThanOrEqual(2);
        expect(tramo.inicio).toBeUndefined();
        expect(tramo.fin).toBe(enlace.tipo === 'agente' ? 'piruletaNegra' : enlace.tipo === 'instrumento' ? 'piruletaBlanca' : 'punta');
        const terminal = enlace.tipo === 'resultado' ? tramo.puntos.at(-1)! : tramo.puntos[0]!, proceso = e.nodos.find(n => n.ref.id === enlace.proceso)!;
        const terminalP = enlace.tipo === 'resultado' ? tramo.puntos[0]! : tramo.puntos.at(-1)!, pc = proceso.caja;
        expect(((terminalP.x - pc.x - pc.ancho / 2) / (pc.ancho / 2)) ** 2 + ((terminalP.y - pc.y - pc.alto / 2) / (pc.alto / 2)) ** 2).toBeCloseTo(1, 9);
        const estado = 'estado' in enlace ? enlace.estado : undefined;
        if (uniforme) {
            expect(terminal.x).toBeCloseTo(referencia.x, 9);
            expect(terminal.y).toBeCloseTo(referencia.y, 9);
        } else if (estado) {
            const capsula = objeto.estados.find(s => s.ref.id === estado)!;
            expect(capsula.ref).toEqual({ tipo: 'estado', id: estado });
            expect(terminal.x).toBeGreaterThanOrEqual(capsula.caja.x);
            expect(terminal.x).toBeLessThanOrEqual(capsula.caja.x + capsula.caja.ancho);
            expect(terminal.y).toBeGreaterThanOrEqual(capsula.caja.y);
            expect(terminal.y).toBeLessThanOrEqual(capsula.caja.y + capsula.caja.alto);
            const c = capsula.caja, cx = Math.max(c.x + 8, Math.min(terminal.x, c.x + c.ancho - 8)), cy = Math.max(c.y + 8, Math.min(terminal.y, c.y + c.alto - 8));
            // Ecuación del perímetro redondeado, independiente del algoritmo de recorte.
            expect(Math.hypot(terminal.x - cx, terminal.y - cy)).toBeCloseTo(8, 9);
            // Terminal se conserva exactamente como el enlace standalone del mismo hecho.
            const sinFan = escena({ ...base, abanicos: {} }, 'sd').aristas.find(a => a.ref.id === id)!.tramos[0]!;
            if (tramo.puntos.length === 2) expect(terminal).toEqual(enlace.tipo === 'resultado' ? sinFan.puntos[1]! : sinFan.puntos[0]!);
            else {
                const propio = estado ? objeto.estados.find(s => s.ref.id === estado)!.caja : objeto.caja;
                const adj = enlace.tipo === 'resultado' ? tramo.puntos.at(-2)! : tramo.puntos[1]!;
                const cx = propio.x + propio.ancho / 2, cy = propio.y + propio.alto / 2;
                expect((terminal.x - cx) * (adj.y - cy) - (terminal.y - cy) * (adj.x - cx)).toBeCloseTo(0, 7);
                expect((terminal.x - cx) * (adj.x - cx) + (terminal.y - cy) * (adj.y - cy)).toBeGreaterThan(0);
            }
        } else {
            const c = objeto.caja;
            expect(terminal.x).toBeGreaterThanOrEqual(c.x);
            expect(terminal.x).toBeLessThanOrEqual(c.x + c.ancho);
            expect(terminal.y).toBeGreaterThanOrEqual(c.y);
            expect(terminal.y).toBeLessThanOrEqual(c.y + c.alto);
            expect(Math.min(Math.abs(terminal.x - c.x), Math.abs(terminal.x - c.x - c.ancho), Math.abs(terminal.y - c.y), Math.abs(terminal.y - c.y - c.alto))).toBeCloseTo(0, 9);
            const sinFan = escena({ ...base, abanicos: {} }, 'sd').aristas.find(a => a.ref.id === id)!.tramos[0]!;
            if (tramo.puntos.length === 2) expect(terminal).toEqual(enlace.tipo === 'resultado' ? sinFan.puntos[1]! : sinFan.puntos[0]!);
            else {
                const propio = estado ? objeto.estados.find(s => s.ref.id === estado)!.caja : objeto.caja;
                const adj = enlace.tipo === 'resultado' ? tramo.puntos.at(-2)! : tramo.puntos[1]!;
                const cx = propio.x + propio.ancho / 2, cy = propio.y + propio.alto / 2;
                expect((terminal.x - cx) * (adj.y - cy) - (terminal.y - cy) * (adj.x - cx)).toBeCloseTo(0, 7);
                expect((terminal.x - cx) * (adj.x - cx) + (terminal.y - cy) * (adj.y - cy)).toBeGreaterThan(0);
            }
        }
    }
    const svg = aTexto(dibujar(e, 'canon'));
    expect(svg.match(/stroke-dasharray="4 1"/g)).toHaveLength(f.operador === 'OR' ? 2 : 1);
    expect(svg.match(/stroke-width="1.5" stroke-dasharray="4 1"/g)).toHaveLength(f.operador === 'OR' ? 2 : 1);
    expect(exportarDiagrama(base, 'sd', { version: 'criterio-A' }).ok).toBe(true);
    expect(exportarDocumento(base, new Map(), { version: 'criterio-A' }).ok).toBe(true);
    expect(JSON.stringify(base)).toBe(antes);
    expect(escena(base, 'sd')).toBe(e);
}
const sectorComunO = [6.002885650841135, 6.839056116333744] as const;
for (const operador of ['XOR', 'OR'] as const)
    for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const)
        for (const parcial of [false, true])
            test(`T-216 criterio A ${operador} ${tipo} comúnO ${parcial ? 'ausencia parcial' : 'estados distintos'}`, () => {
                comprobarCriterioA(modeloCriterioA(tipo, operador, parcial), { x: 300, y: 135 }, sectorComunO);
            });
for (const [tipo, operador, parcial] of [['consumo', 'XOR', false], ['agente', 'OR', true]] as const)
    test(`T-216 criterio A ESTE exacto degenerado ${operador} ${tipo}`, () => {
        const original = modeloCriterioA(tipo, operador, parcial), base: Modelo = { ...original, opds: { ...original.opds, sd: { ...original.opds.sd!, apariciones: { ...original.opds.sd!.apariciones, q: { x: -410, y: 140, ancho: 160, alto: 80 } } } } };
        const e = escena(base, 'sd'), centro = (id: string) => { const c = e.nodos.find(n => n.ref.id === id)!.caja; return [c.x + c.ancho / 2, c.y + c.alto / 2]; };
        expect(centro('o')).toEqual([150, 110]);
        expect(centro('p')).toEqual([630, 40]);
        expect(centro('q')).toEqual([-330, 180]);
        if (parcial) {
            const terminal = e.aristas.find(a => a.ref.id === 'e2')!.tramos[0]!.puntos[0]!;
            expect(terminal.x).toBeGreaterThanOrEqual(0); expect(terminal.x).toBeLessThanOrEqual(300);
            expect(terminal.y).toBeGreaterThanOrEqual(0); expect(terminal.y).toBeLessThanOrEqual(220);
            expect(Math.min(terminal.x, 300 - terminal.x, terminal.y, 220 - terminal.y)).toBeCloseTo(0, 9);
        }
        comprobarCriterioA(base, { x: 300, y: 110 }, [3.030935432415898, 6.074162364373322]);
    });
for (const [tipo, operador] of [['consumo', 'XOR'], ['resultado', 'OR']] as const)
    test(`T-216 T-219 criterio A ruta DS-10 ${operador} ${tipo}`, () => {
        const original = modeloCriterioA(tipo, operador, false), base: Modelo = { ...original, enlaces: Object.fromEntries(Object.entries(original.enlaces).map(([id, enlace]) => [id, { ...enlace, ruta: 'principal' } as Enlace])) };
        comprobarCriterioA(base, { x: 300, y: 135 }, sectorComunO);
        const e = escena(base, 'sd'), g = generarBloque(base, 'sd');
        expect(g.some(l => l.plantilla.startsWith('FANLOCAL-'))).toBe(false);
        for (const id of ['e1', 'e2']) {
            expect(e.aristas.find(a => a.ref.id === id)!.etiquetas).toEqual(expect.arrayContaining([expect.objectContaining({ clave: 'ruta', texto: 'principal' })]));
            expect(g.some(l => l.hechos.includes(id) && l.tokens.some(t => t.ref?.id === (id === 'e1' ? 's1' : 's2')) && l.tokens.some(t => t.texto.includes('principal')))).toBe(true);
        }
    });
test('T-216 criterio A ausencia no hereda DEFAULT ni Current', () => {
    for (const designacion of ['porDefecto', 'current'] as const) {
        const original = modeloCriterioA('consumo', 'XOR', true), objeto = original.cosas.o! as Objeto, base: Modelo = { ...original, cosas: { ...original.cosas, o: { ...objeto, [designacion]: 's2' } } };
        comprobarCriterioA(base, { x: 300, y: 135 }, sectorComunO);
        expect('estado' in base.enlaces.e2!).toBe(false);
    }
});
test('T-216 criterio A identidad distinta no se vuelve uniforme por nombre igual', () => {
    const original = modeloCriterioA('instrumento', 'OR', false), objeto = original.cosas.o! as Objeto, base: Modelo = { ...original, cosas: { ...original.cosas, o: { ...objeto, estados: objeto.estados.map(s => ({ ...s, nombre: 'igual' })) } } };
    // Fixture diagnóstico T-015: la escena conserva identidad, export rechaza el léxico.
    expect(validarForma(base)).toEqual([]);
    expect(violacionesAbanico(base, base.abanicos.f!)).toEqual([]);
    expect(gatesExportacion(base, { opd: 'sd' }).map(v => v.regla)).toEqual(['T-015']);
    const antes = JSON.stringify(base);
    congelarCriterioA(base);
    const e = escena(base, 'sd');
    expect(e.aristas[0]!.tramos[0]!.puntos[0]).not.toEqual(e.aristas[1]!.tramos[0]!.puntos[0]);
    expect(e.nodos.find(n => n.ref.id === 'o')!.estados.map(s => s.ref.id)).toEqual(['s1', 's2']);
    expect(e.aristas.map(a => [a.ref, a.hechos])).toEqual([[{ tipo: 'enlace', id: 'e1' }, ['e1']], [{ tipo: 'enlace', id: 'e2' }, ['e2']]]);
    for (const [id, estado] of [['e1', 's1'], ['e2', 's2']] as const) {
        const terminal = e.aristas.find(a => a.ref.id === id)!.tramos[0]!.puntos[0]!, capsula = e.nodos.find(n => n.ref.id === 'o')!.estados.find(s => s.ref.id === estado)!;
        expect(terminal.x).toBeGreaterThanOrEqual(capsula.caja.x);
        expect(terminal.x).toBeLessThanOrEqual(capsula.caja.x + capsula.caja.ancho);
    }
    expect(e.arcos).toHaveLength(2);
    for (const arco of e.arcos) {
        expect(arco.centro.x).toBeGreaterThanOrEqual(0); expect(arco.centro.x).toBeLessThanOrEqual(300);
        expect(arco.centro.y).toBeGreaterThanOrEqual(0); expect(arco.centro.y).toBeLessThanOrEqual(220);
        for (const a of e.aristas) expect(crucesB(arco, a.tramos[0]!.puntos).length).toBeGreaterThan(0);
    }
    const exportado = exportarDiagrama(base, 'sd', { version: 'criterio-A-negativo' });
    expect(exportado.ok).toBe(false);
    if (exportado.ok) throw Error('Nombres de estado duplicados no exportables');
    expect(exportado.rechazo.regla).toBe('T-015');
    expect(JSON.stringify(base)).toBe(antes);
});
for (const especificado of [true, false])
    test(`T-216 fuera de excepción A terminal único ${especificado ? 'mismo ID' : 'ausencia total'}`, () => {
        for (const operador of ['XOR', 'OR'] as const) for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const) {
            const original = modeloCriterioA(tipo, operador, false);
            const enlaces = Object.fromEntries(Object.entries(original.enlaces).map(([id, anterior]) => {
                if (!('proceso' in anterior)) throw Error('Fixture procedimental');
                const { estado: _estado, ...sinEstado } = anterior as Enlace & { estado?: string };
                return [id, { ...sinEstado, ...(especificado ? { estado: 's1' } : {}) } as Enlace];
            }));
            const base: Modelo = { ...original, enlaces };
            const e = escena(base, 'sd'), objeto = e.nodos.find(n => n.ref.id === 'o')!;
            const caja = especificado ? objeto.estados.find(s => s.ref.id === 's1')!.caja : objeto.caja;
            const referencia = { x: caja.x + caja.ancho, y: caja.y + caja.alto / 2 + (190 - caja.y - caja.alto / 2) * (caja.ancho / 2) / (630 - caja.x - caja.ancho / 2) };
            const sector = [Math.atan2(40 - referencia.y, 630 - referencia.x) + 2 * Math.PI, Math.atan2(340 - referencia.y, 630 - referencia.x) + 2 * Math.PI] as const;
            comprobarCriterioA(base, referencia, sector, true);
        }
    });

// B V2: el requisito alcanza cada miembro y cada radio del operador.
import type { Escena, Punto } from './escena';
// Oráculo independiente: raíces de la intersección círculo/segmento FINITO.
function crucesB(arco: Escena['arcos'][number], puntos: readonly Punto[]): Punto[] {
    const cruces: Punto[] = [];
    for (let i = 1; i < puntos.length; i++) {
        const a = puntos[i - 1]!, b = puntos[i]!, dx = b.x - a.x, dy = b.y - a.y;
        const x = a.x - arco.centro.x, y = a.y - arco.centro.y;
        const aa = dx * dx + dy * dy, bb = 2 * (x * dx + y * dy), cc = x * x + y * y - arco.radio ** 2;
        const disc = bb * bb - 4 * aa * cc;
        if (!aa || disc < 0) continue;
        for (const t of [(-bb - Math.sqrt(disc)) / (2 * aa), (-bb + Math.sqrt(disc)) / (2 * aa)]) {
            if (t < -1e-9 || t > 1 + 1e-9) continue;
            const p = { x: a.x + t * dx, y: a.y + t * dy };
            let angle = Math.atan2(p.y - arco.centro.y, p.x - arco.centro.x);
            while (angle < arco.desde - 1e-9) angle += 2 * Math.PI;
            if (angle <= arco.hasta + 1e-9) cruces.push(p);
        }
    }
    return cruces;
}
function comprobarB(base: Modelo): void {
    expect(validarForma(base)).toEqual([]);
    expect(erroresContexto(base)).toEqual([]);
    expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
    const antes = JSON.stringify(base);
    congelarCriterioA(base);
    const s = escena(base, 'sd'), vista = proyectar(base, 'sd');
    const opacos = [
        ...s.nodos.map(n => ({ x: n.caja.x - 1, y: n.caja.y - 1, ancho: n.caja.ancho + 2 + (n.fisica ? 8 : 0), alto: n.caja.alto + 2 + (n.fisica ? 8 : 0) })),
        ...s.aristas.flatMap(a => a.etiquetas.map(l => ({ x: l.en.x - anchoTexto(l.texto, 11, l.italica) / 2 - 1, y: l.en.y - 12, ancho: anchoTexto(l.texto, 11, l.italica) + 2, alto: 16 }))),
        ...s.aristas.flatMap(a => a.tramos.flatMap(t => {
            const p = t.puntos.at(-1)!, adj = t.puntos.at(-2)!, len = Math.hypot(p.x - adj.x, p.y - adj.y), ux = (p.x - adj.x) / len, uy = (p.y - adj.y) / len;
            const corners = [[0, -10], [0, 10], [-24, -10], [-24, 10]].map(([x, y]) => ({ x: p.x + x! * ux - y! * uy, y: p.y + x! * uy + y! * ux }));
            const x = Math.min(...corners.map(p => p.x)), y = Math.min(...corners.map(p => p.y));
            return t.fin ? [{ x: x - 1, y: y - 1, ancho: Math.max(...corners.map(p => p.x)) - x + 2, alto: Math.max(...corners.map(p => p.y)) - y + 2 }] : [];
        }))
    ];
    for (const f of vista.abanicos) {
        const node = s.nodos.find(n => n.ref.id === f.comun)!;
        const arcos = s.arcos.filter(a => a.abanico === f.abanico);
        expect(arcos).toHaveLength(f.operador === 'OR' ? 2 : 1);
        if (f.operador === 'OR') expect(arcos[1]!.radio - arcos[0]!.radio).toBeCloseTo(5, 9);
        for (const arco of arcos) {
            expect(arco.centro.x).toBeGreaterThanOrEqual(node.caja.x);
            expect(arco.centro.x).toBeLessThanOrEqual(node.caja.x + node.caja.ancho);
            expect(arco.centro.y).toBeGreaterThanOrEqual(node.caja.y);
            expect(arco.centro.y).toBeLessThanOrEqual(node.caja.y + node.caja.alto);
            expect(arco.radio).toBeGreaterThan(0);
            // Analítico sobre TODO el sector, incluidos extremos: no sólo sus
            // cruces con las ramas ni una nube de muestras sobre el círculo.
            for (const r of opacos) {
                const corners = [{ x: r.x, y: r.y }, { x: r.x + r.ancho, y: r.y }, { x: r.x + r.ancho, y: r.y + r.alto }, { x: r.x, y: r.y + r.alto }, { x: r.x, y: r.y }];
                expect(crucesB(arco, corners)).toHaveLength(0);
                for (const angle of [arco.desde, arco.hasta]) {
                    const x = arco.centro.x + arco.radio * Math.cos(angle), y = arco.centro.y + arco.radio * Math.sin(angle);
                    expect(x >= r.x && x <= r.x + r.ancho && y >= r.y && y <= r.y + r.alto).toBe(false);
                }
            }
            for (const id of f.ramas) {
                const a = s.aristas.find(a => a.ref.id === id)!;
                expect(a.hechos).toEqual([id]);
                const cruces = a.tramos.flatMap(t => crucesB(arco, t.puntos));
                expect(cruces.length).toBeGreaterThan(0);
                // El cruce del arco no puede quedar oculto por el cuerpo común.
                expect(cruces.some(p => p.x < node.caja.x - 1 || p.x > node.caja.x + node.caja.ancho + 9 || p.y < node.caja.y - 1 || p.y > node.caja.y + node.caja.alto + 9)).toBe(true);
            }
        }
    }
    expect(JSON.stringify(base)).toBe(antes);
    expect(exportarDiagrama(base, 'sd', { version: 'B-v2' }).ok).toBe(true);
}
for (const operador of ['XOR', 'OR'] as const)
    for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const)
        for (const parcial of [false, true])
            test(`T-216 B V2 TODOS ${operador} ${tipo} ${parcial ? 'ausencia' : 'distintos'}`, () => comprobarB(modeloCriterioA(tipo, operador, parcial)));
for (const [tipo, operador, parcial] of [['consumo', 'XOR', false], ['agente', 'OR', true]] as const)
    test(`T-216 B V2 degenerado ${operador} ${tipo}`, () => {
        const original = modeloCriterioA(tipo, operador, parcial);
        comprobarB({ ...original, opds: { sd: { ...original.opds.sd!, apariciones: { ...original.opds.sd!.apariciones, q: { x: -410, y: 140, ancho: 160, alto: 80 } } } } });
    });
for (const [tipo, operador] of [['consumo', 'XOR'], ['resultado', 'OR']] as const)
    for (const caso of ['DS10', 'proximo', 'dos-proximos', 'solapado'] as const)
        test(`T-216 T-219 B V2 ${operador} ${tipo} ${caso}`, () => {
            const original = modeloCriterioA(tipo, operador, false);
            const apariciones = { ...original.opds.sd!.apariciones };
            if (caso !== 'DS10') apariciones.p = { ...apariciones.p!, x: caso === 'solapado' ? 200 : 310 };
            if (caso === 'dos-proximos') apariciones.q = { ...apariciones.q!, x: 310, y: 230 };
            const enlaces = caso === 'DS10' ? Object.fromEntries(Object.entries(original.enlaces).map(([id, e]) => [id, { ...e, ruta: 'principal' } as Enlace])) : original.enlaces;
            comprobarB({ ...original, enlaces, opds: { sd: { ...original.opds.sd!, apariciones } } });
        });
for (const operador of ['XOR', 'OR'] as const)
    test(`T-216 B V2 tres ramas ${operador}`, () => {
        const m = modeloCriterioA('consumo', operador, false);
        comprobarB({ ...m, cosas: { ...m.cosas, r: p('r', 'Registrar') }, enlaces: { ...m.enlaces, e3: { id: 'e3', tipo: 'consumo', objeto: 'o', proceso: 'r', estado: 's1' } }, abanicos: { f: { ...m.abanicos.f!, enlaces: ['e1', 'e2', 'e3'] } }, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, r: { x: 550, y: 600, ancho: 160, alto: 80 } } } } });
    });

import { intersectaCaja } from './geometria';
test('T-216 B V2 degenerado mantiene continuidad sin cruzar otra cápsula', () => {
    const m = modeloCriterioA('consumo', 'XOR', false);
    const base: Modelo = { ...m, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, q: { x: -410, y: 140, ancho: 160, alto: 80 } } } } };
    expect(validarForma(base)).toEqual([]);
    expect(erroresContexto(base)).toEqual([]);
    expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
    const s = escena(base, 'sd'), otra = s.nodos.find(n => n.ref.id === 'o')!.estados.find(s => s.ref.id === 's1')!.caja;
    const puntos = s.aristas.find(a => a.ref.id === 'e2')!.tramos[0]!.puntos;
    expect(puntos.slice(1).some((b, i) => intersectaCaja(puntos[i]!, b, otra, 'rectangulo'))).toBe(false);
});

for (const operador of ['XOR', 'OR'] as const)
    for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const)
        test(`T-206 T-216 uniforme tinta visible ${operador} ${tipo}`, () => {
            const m = modeloCriterioA(tipo, operador, false);
            const base: Modelo = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).map(([id, e]) => [id, { ...e, estado: 's1' } as Enlace])) };
            expect(validarForma(base)).toEqual([]);
            expect(erroresContexto(base)).toEqual([]);
            expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
            const antes = JSON.stringify(base); congelarCriterioA(base);
            const s = escena(base, 'sd'), objeto = s.nodos.find(n => n.ref.id === 'o')!;
            expect(s.arcos.map(a => a.radio)).toEqual(operador === 'OR' ? [30, 35] : [30]);
            for (const arco of s.arcos) {
                const angulos = [arco.desde, arco.hasta, ...[0, Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI].filter(t => t >= arco.desde && t <= arco.hasta)];
                const minX = Math.min(...angulos.map(t => arco.centro.x + arco.radio * Math.cos(t))) - .75;
                expect(minX).toBeGreaterThan(objeto.caja.x + objeto.caja.ancho + (objeto.fisica ? 8 : 0));
            }
            const otro = objeto.estados.find(s => s.ref.id === 's2')!.caja;
            for (const a of s.aristas) {
                expect(a.tramos).toHaveLength(1);
                expect(a.tramos[0]!.puntos).toHaveLength(2);
                expect(a.tramos[0]!.puntos.slice(1).some((b, i) => intersectaCaja(a.tramos[0]!.puntos[i]!, b, otro, 'rectangulo'))).toBe(false);
            }
            expect(objeto.estados.map(s => s.ref.id)).toEqual(['s1', 's2']);
            expect(JSON.stringify(base)).toBe(antes);
        });

for (const tipo of ['consumo', 'resultado'] as const)
    test(`T-218 T-219 B V2 anotaciones siguen segmentos reales ${tipo}`, () => {
        const m = modeloCriterioA(tipo, 'OR', false);
        const base: Modelo = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).map(([id, e]) => { if (e.tipo !== 'consumo' && e.tipo !== 'resultado') throw Error('Fixture C/R'); return [id, { ...e, ruta: 'principal', mult: '+' as const }]; })), opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, p: { x: 200, y: 0, ancho: 160, alto: 80 } } } } };
        expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
        // También contrastar el sector contra etiquetas y marcadores FINALES,
        // después de derivar cada recorrido; no sólo las anotaciones de entrada.
        comprobarB(base);
        const s = escena(base, 'sd');
        for (const a of s.aristas) {
            const ps = a.tramos[0]!.puntos;
            expect(ps.length).toBeGreaterThan(2);
            const desdeO = tipo === 'resultado' ? [...ps].reverse() : ps;
            const ruta = a.etiquetas.find(l => l.clave === 'ruta')!.en;
            expect(desdeO.slice(1).some((b, i) => {
                const p = desdeO[i]!, len = Math.hypot(b.x - p.x, b.y - p.y);
                return Math.hypot(ruta.x - (p.x + b.x) / 2 - 10 * (b.y - p.y) / len, ruta.y - (p.y + b.y) / 2 + 10 * (b.x - p.x) / len) < 1e-8;
            })).toBe(true);
            const x = desdeO[0]!, y = desdeO[1]!, len = Math.hypot(y.x - x.x, y.y - x.y), mult = a.etiquetas.find(l => l.clave === 'mult-origen')!.en;
            expect(mult.x).toBeCloseTo(x.x + 14 * (y.x - x.x) / len + 10 * (y.y - x.y) / len, 9);
            expect(mult.y).toBeCloseTo(x.y + 14 * (y.y - x.y) / len - 10 * (y.x - x.x) / len, 9);
        }
    });

test('T-216 B V2 múltiples fans conservan pertenencia e intersecciones', () => {
    const m = modeloCriterioA('consumo', 'XOR', false), objeto = m.cosas.o! as Objeto;
    const w: Objeto = { ...objeto, id: 'w', nombre: 'Factura', estados: [{ id: 'w1', nombre: 'abierto' }, { id: 'w2', nombre: 'cerrado' }] };
    const base: Modelo = { ...m, cosas: { ...m.cosas, w, u: p('u', 'Facturar'), v: p('v', 'Cerrar') }, enlaces: { ...m.enlaces, e3: { id: 'e3', tipo: 'consumo', objeto: 'w', proceso: 'u', estado: 'w1' }, e4: { id: 'e4', tipo: 'consumo', objeto: 'w', proceso: 'v', estado: 'w2' } }, abanicos: { ...m.abanicos, g: { id: 'g', operador: 'OR', enlaces: ['e3', 'e4'] } }, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, w: { x: 900, y: 0, ancho: 300, alto: 220 }, u: { x: 1450, y: 0, ancho: 160, alto: 80 }, v: { x: 1450, y: 300, ancho: 160, alto: 80 } } } } };
    comprobarB(base);
    const s = escena(base, 'sd');
    expect(s.arcos.map(a => a.abanico)).toEqual(['f', 'g', 'g']);
});
test('T-216 B V2 repetibilidad, permutación y movimientos pequeños preservan los predicados', () => {
    for (const operador of ['XOR', 'OR'] as const) for (const tipo of ['consumo', 'resultado'] as const) {
        const original = modeloCriterioA(tipo, operador, false);
        const base = escena(original, 'sd');
        const firma = (s: Escena) => JSON.stringify({ arcos: s.arcos, caminos: [...s.aristas].sort((a, b) => a.ref.id.localeCompare(b.ref.id)).map(a => [a.ref.id, a.tramos]) });
        expect(firma(escena(JSON.parse(JSON.stringify(original)), 'sd'))).toBe(firma(base));
        const permutado: Modelo = { ...original, enlaces: Object.fromEntries(Object.entries(original.enlaces).reverse()), abanicos: { f: { ...original.abanicos.f!, enlaces: [...original.abanicos.f!.enlaces].reverse() } } };
        expect(firma(escena(permutado, 'sd'))).toBe(firma(base));
        for (const delta of [-1, 1]) for (const eje of ['x', 'y'] as const) {
            const a = original.opds.sd!.apariciones.p!;
            const m: Modelo = { ...original, opds: { sd: { ...original.opds.sd!, apariciones: { ...original.opds.sd!.apariciones, p: { ...a, [eje]: a[eje] + delta } } } } };
            comprobarB(m);
            const s = escena(m, 'sd');
            expect(Number.isFinite(s.caja.ancho + s.caja.alto)).toBe(true);
            // Esta guarda evita saltos sin límite, no afirma continuidad universal.
            expect(Math.abs(s.arcos[0]!.radio - base.arcos[0]!.radio)).toBeLessThan(10);
        }
    }
});

test('T-216 B V2 ausencia agente no pierde continuidad en sombra propia', () => {
    const m = modeloCriterioA('agente', 'OR', true);
    const base: Modelo = { ...m, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, q: { x: -410, y: 140, ancho: 160, alto: 80 } } } } };
    expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
    const s = escena(base, 'sd'), o = s.nodos.find(n => n.ref.id === 'o')!, ps = s.aristas.find(a => a.ref.id === 'e2')!.tramos[0]!.puntos;
    const shadow = { x: o.caja.x + o.caja.ancho + .01, y: o.caja.y + 8, ancho: 7.99, alto: o.caja.alto };
    expect(ps.slice(1).some((b, i) => intersectaCaja(ps[i]!, b, shadow, 'rectangulo'))).toBe(false);
});

for (const operador of ['XOR', 'OR'] as const) for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const) for (const parcial of [false, true])
    test(`T-206 packing conserva lectura standalone ${operador} ${tipo} ${parcial ? 'ausencia' : 'distintos'}`, () => {
        const m = modeloCriterioA(tipo, operador, parcial), base: Modelo = { ...m, abanicos: {} };
        expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
        const s = escena(base, 'sd'), n = s.nodos.find(n => n.ref.id === 'o')!;
        for (const a of s.aristas) {
            const enlace = base.enlaces[a.ref.id]!;
            if (!('estado' in enlace) || !enlace.estado) continue;
            for (const otro of n.estados.filter(s => s.ref.id !== enlace.estado)) {
                const ps = a.tramos[0]!.puntos;
                expect(ps.slice(1).some((b, i) => intersectaCaja(ps[i]!, b, otro.caja, 'rectangulo'))).toBe(false);
            }
        }
    });

for (const tipo of ['consumo', 'resultado'] as const)
    test(`T-216 B V2 primaria conserva rectas legibles ${tipo}`, () => {
        const base = modeloCriterioA(tipo, 'OR', false);
        expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
        const actual = escena(base, 'sd'), standalone = escena({ ...base, abanicos: {} }, 'sd');
        // Witness analítico original: C=(150,110), r206.01075237738274/r+5
        // cruza ambos segmentos fuera de O. El tramo superior pasa por fuera de
        // la esquina rx8 de pagado: su bbox no es una cápsula opaca rectangular.
        for (const a of actual.aristas) expect(a.tramos).toEqual(standalone.aristas.find(s => s.ref.id === a.ref.id)!.tramos);
    });

test('T-206 T-207 T-208 T-216 packing de tres fans conserva decoración y región inferior', () => {
    const m = modeloCriterioA('consumo', 'OR', false), objeto = m.cosas.o! as Objeto;
    const estados = [{ id: 's1', nombre: 'pendiente', inicial: true as const, final: true as const }, { id: 's2', nombre: 'pagado' }, { id: 's3', nombre: 'cerrado' }, { id: 's4', nombre: 'cancelado' }];
    const procesos = ['p', 'q', 'u', 'v', 'w', 'z'], nombres = ['Preparar', 'Despachar', 'Cobrar', 'Liquidar', 'Cerrar', 'Archivar'];
    const enlaces = Object.fromEntries(procesos.map((proceso, i) => [`e${i + 1}`, { id: `e${i + 1}`, tipo: 'consumo' as const, objeto: 'o', proceso, estado: `s${Math.floor(i / 2) + 1}` }]));
    const base: Modelo = { ...m, cosas: { o: { ...objeto, estados, porDefecto: 's1', current: 's2' }, ...Object.fromEntries(procesos.map((id, i) => [id, p(id, nombres[i]!)])) }, enlaces, abanicos: Object.fromEntries(['f', 'g', 'h'].map((id, i) => [id, { id, operador: 'OR' as const, enlaces: [`e${2 * i + 1}`, `e${2 * i + 2}`] }])), opds: { sd: { ...m.opds.sd!, apariciones: { o: { ...m.opds.sd!.apariciones.o!, ocultos: ['s4'] }, ...Object.fromEntries(procesos.map((id, i) => [id, { x: 550, y: -100 + i * 120, ancho: 160, alto: 80 }])) } } } };
    expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
    const antes = JSON.stringify(base); congelarCriterioA(base);
    const s = escena(base, 'sd'), n = s.nodos.find(n => n.ref.id === 'o')!;
    expect(n.estados.map(s => s.ref.id)).toEqual(['s1', 's2', 's3']);
    expect(n.chipOcultos).toMatchObject({ n: 1, caja: { alto: 16 } });
    expect(n.estados[0]).toMatchObject({ inicial: true, final: true, porDefecto: true });
    expect(n.estados[1]).toMatchObject({ current: true });
    for (const estado of n.estados) {
        expect(estado.caja.alto).toBe(26);
        expect(estado.caja.ancho).toBeCloseTo(anchoTexto(estado.nombre, 13, true) + 16 + (estado.inicial ? 6 : 0), 9);
        const superior = estado.caja.y - (estado.current || estado.porDefecto ? 12 : 0);
        expect(superior).toBeGreaterThan(n.rotulo.y + 4);
        expect(estado.caja.x).toBeGreaterThanOrEqual(n.caja.x);
        expect(estado.caja.x + estado.caja.ancho).toBeLessThanOrEqual(n.caja.x + n.caja.ancho);
    }
    expect(s.arcos.map(a => a.radio)).toEqual([30, 35, 30, 35, 30, 35]);
    // Sector completo y dos radios; el packing no puede ocultar h detrás de O.
    const r = { x: n.caja.x - .75, y: n.caja.y - .75, ancho: n.caja.ancho + 1.5, alto: n.caja.alto + 1.5 };
    const contornoO = [{ x: r.x, y: r.y }, { x: r.x + r.ancho, y: r.y }, { x: r.x + r.ancho, y: r.y + r.alto }, { x: r.x, y: r.y + r.alto }, { x: r.x, y: r.y }];
    for (const arco of s.arcos) {
        expect(crucesB(arco, contornoO)).toHaveLength(0);
        for (const angle of [arco.desde, arco.hasta]) {
            const x = arco.centro.x + arco.radio * Math.cos(angle), y = arco.centro.y + arco.radio * Math.sin(angle);
            expect(x >= r.x && x <= r.x + r.ancho && y >= r.y && y <= r.y + r.alto).toBe(false);
        }
    }
    expect(s.aristas.every(a => a.tramos[0]!.puntos.length === 2)).toBe(true);
    expect(JSON.stringify(base)).toBe(antes);
});

// Bytes de los 20 modelos archivados originales, portables; no constructor análogo.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const archivosOriginalesB = (JSON.parse(readFileSync(new URL('./pruebas/modelos-B-v2.json', import.meta.url), 'utf8')) as readonly { id: string; grupo: string; sha256: string; jsonOriginal: string }[]).filter(a => ['original16', 'degenerado2', 'DS10ruta2'].includes(a.grupo));
for (const archivo of archivosOriginalesB)
    test(`T-216 T-219 B V2 archivo exacto ${archivo.id}`, () => {
        expect(createHash('sha256').update(archivo.jsonOriginal).digest('hex')).toBe(archivo.sha256);
        comprobarB(JSON.parse(archivo.jsonOriginal) as Modelo);
    });

import { intersectaCapsula } from './geometria';
for (const archivo of (JSON.parse(readFileSync(new URL('./pruebas/modelos-B-v2.json', import.meta.url), 'utf8')) as readonly { id: string; grupo: string; jsonOriginal: string }[]).filter(a => ['original16', 'degenerado2', 'DS10ruta2', 'stress6'].includes(a.grupo)))
    test(`T-216 B V2 continuidad por identidad sobre modelo portátil ${archivo.id}`, () => {
        const base = JSON.parse(archivo.jsonOriginal) as Modelo;
        expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
        const previo = JSON.stringify(base); congelarCriterioA(base);
        const s = escena(base, 'sd');
        for (const a of s.aristas) {
            const e = base.enlaces[a.ref.id]!;
            if (!('objeto' in e) || !('proceso' in e) || e.tipo === 'efecto') throw Error('Dominio C/R/A/I');
            const ps = a.tramos[0]!.puntos, estado = 'estado' in e ? e.estado : undefined;
            expect(a.hechos).toEqual([e.id]);
            for (let i = 1; i < ps.length; i++) {
                const x = ps[i - 1]!, y = ps[i]!;
                expect(Math.hypot(y.x - x.x, y.y - x.y)).toBeGreaterThan(0);
                for (const n of s.nodos) {
                    for (const st of n.estados.filter(st => st.ref.id !== estado))
                        expect(intersectaCapsula(x, y, st.caja, st.inicial ? 1.5 : .75)).toBe(false);
                    if (n.ref.id !== e.objeto && n.ref.id !== e.proceso)
                        expect(intersectaCaja(x, y, { ...n.caja, ancho: n.caja.ancho + (n.fisica ? 8 : 0), alto: n.caja.alto + (n.fisica ? 8 : 0) }, 'rectangulo')).toBe(false);
                    for (const [j, linea] of n.rotulo.lineas.entries()) {
                        const w = anchoTexto(linea, 17, n.rotulo.italica);
                        expect(intersectaCaja(x, y, { x: n.rotulo.x - w / 2, y: n.rotulo.y + j * 22 - 17, ancho: w, alto: 20 }, 'rectangulo')).toBe(false);
                    }
                    // La sombra propia capa10 oculta sólo ramas capa4; capa20 la sobrepinta.
                    if (n.ref.id === e.objeto && n.fisica && a.capa === 4) {
                        const c = n.caja;
                        expect(intersectaCaja(x, y, { x: c.x + c.ancho + .01, y: c.y + 8, ancho: 7.99, alto: c.alto }, 'rectangulo')).toBe(false);
                        expect(intersectaCaja(x, y, { x: c.x + 8, y: c.y + c.alto + .01, ancho: c.ancho, alto: 7.99 }, 'rectangulo')).toBe(false);
                    }
                }
            }
        }
        // Un tramo compartido borraría el par rama–estado aunque conserve IDs.
        for (let i = 0; i < s.aristas.length; i++) for (const b of s.aristas.slice(i + 1)) {
            const as = s.aristas[i]!.tramos[0]!.puntos, bs = b.tramos[0]!.puntos;
            for (let j = 1; j < as.length; j++) for (let k = 1; k < bs.length; k++) {
                const a0 = as[j - 1]!, a1 = as[j]!, b0 = bs[k - 1]!, b1 = bs[k]!, dx = a1.x - a0.x, dy = a1.y - a0.y;
                if (Math.abs(dx * (b1.y - b0.y) - dy * (b1.x - b0.x)) > 1e-7 || Math.abs(dx * (b0.y - a0.y) - dy * (b0.x - a0.x)) > 1e-7) continue;
                const axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
                const overlap = Math.min(Math.max(a0[axis], a1[axis]), Math.max(b0[axis], b1[axis])) - Math.max(Math.min(a0[axis], a1[axis]), Math.min(b0[axis], b1[axis]));
                expect(overlap).toBeLessThanOrEqual(1e-7);
            }
        }
        expect(JSON.stringify(base)).toBe(previo);
    });

// R2 B V2: contraejemplos independientes exactos, modelos legales antes del fix.
const modelosCentrosEfectivosR2: readonly Modelo[] = [
    {
        "id": "review-OR-consumo-distintos",
        "nombre": "Modelo",
        "raiz": "sd",
        "secuencia": 100,
        "unidadTiempo": "min",
        "cosas": {
            "o": {
                "id": "o",
                "nombre": "Registro",
                "tipo": "objeto",
                "esencia": "informacional",
                "afiliacion": "sistemica",
                "estados": [
                    {
                        "id": "s1",
                        "nombre": "pendiente"
                    },
                    {
                        "id": "s2",
                        "nombre": "pagado"
                    }
                ]
            },
            "p": {
                "id": "p",
                "nombre": "Prepararaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "tipo": "proceso",
                "esencia": "informacional",
                "afiliacion": "sistemica"
            },
            "q": {
                "id": "q",
                "nombre": "Despacharaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "tipo": "proceso",
                "esencia": "informacional",
                "afiliacion": "sistemica"
            }
        },
        "enlaces": {
            "e1": {
                "id": "e1",
                "tipo": "consumo",
                "objeto": "o",
                "proceso": "p",
                "estado": "s1"
            },
            "e2": {
                "id": "e2",
                "tipo": "consumo",
                "objeto": "o",
                "proceso": "q",
                "estado": "s1"
            }
        },
        "abanicos": {
            "f": {
                "id": "f",
                "operador": "OR",
                "enlaces": [
                    "e1",
                    "e2"
                ]
            }
        },
        "opds": {
            "sd": {
                "id": "sd",
                "tipo": "raiz",
                "apariciones": {
                    "o": {
                        "x": 0,
                        "y": 0,
                        "ancho": 300,
                        "alto": 220
                    },
                    "p": {
                        "x": -200,
                        "y": -150,
                        "ancho": 160,
                        "alto": 80
                    },
                    "q": {
                        "x": -200,
                        "y": 350,
                        "ancho": 160,
                        "alto": 80
                    }
                }
            }
        }
    },
    {
        "id": "review-OR-resultado-distintos",
        "nombre": "Modelo",
        "raiz": "sd",
        "secuencia": 100,
        "unidadTiempo": "min",
        "cosas": {
            "o": {
                "id": "o",
                "nombre": "Registro",
                "tipo": "objeto",
                "esencia": "informacional",
                "afiliacion": "sistemica",
                "estados": [
                    {
                        "id": "s1",
                        "nombre": "pendiente"
                    },
                    {
                        "id": "s2",
                        "nombre": "pagado"
                    }
                ]
            },
            "p": {
                "id": "p",
                "nombre": "Prepararaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "tipo": "proceso",
                "esencia": "informacional",
                "afiliacion": "sistemica"
            },
            "q": {
                "id": "q",
                "nombre": "Despacharaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "tipo": "proceso",
                "esencia": "informacional",
                "afiliacion": "sistemica"
            }
        },
        "enlaces": {
            "e1": {
                "id": "e1",
                "tipo": "resultado",
                "objeto": "o",
                "proceso": "p",
                "estado": "s1"
            },
            "e2": {
                "id": "e2",
                "tipo": "resultado",
                "objeto": "o",
                "proceso": "q",
                "estado": "s1"
            }
        },
        "abanicos": {
            "f": {
                "id": "f",
                "operador": "OR",
                "enlaces": [
                    "e1",
                    "e2"
                ]
            }
        },
        "opds": {
            "sd": {
                "id": "sd",
                "tipo": "raiz",
                "apariciones": {
                    "o": {
                        "x": 0,
                        "y": 0,
                        "ancho": 300,
                        "alto": 220
                    },
                    "p": {
                        "x": -200,
                        "y": -150,
                        "ancho": 160,
                        "alto": 80
                    },
                    "q": {
                        "x": -200,
                        "y": 350,
                        "ancho": 160,
                        "alto": 80
                    }
                }
            }
        }
    }
];
function comprobarUniformeEfectivoR2(base: Modelo, radioVariable = false): void {
    expect(validarForma(base)).toEqual([]);
    expect(erroresContexto(base)).toEqual([]);
    expect(violacionesAbanico(base, base.abanicos.f!)).toEqual([]);
    Object.values(base.enlaces).forEach(e => expect(noOfrecido(base, e, base.abanicos.f!)).toBeNull());
    expect(gatesExportacion(base, { opd: 'sd' })).toEqual([]);
    expect(gatesExportacion(base, 'modelo')).toEqual([]);
    const antes = JSON.stringify(base); congelarCriterioA(base);
    const s = escena(base, 'sd'), objeto = s.nodos.find(n => n.ref.id === 'o')!, estado = objeto.estados.find(n => n.ref.id === 's1')!;
    if (radioVariable) { expect(s.arcos[0]!.radio).toBeGreaterThanOrEqual(30); expect(s.arcos.map(a => a.radio)).toEqual(base.abanicos.f!.operador === 'OR' ? [s.arcos[0]!.radio, s.arcos[0]!.radio + 5] : [s.arcos[0]!.radio]); }
    else expect(s.arcos.map(a => a.radio)).toEqual(base.abanicos.f!.operador === 'OR' ? [30, 35] : [30]);
    expect(objeto.estados.map(n => n.ref.id)).toEqual(['s1', 's2']);
    const r = { x: objeto.caja.x - .75, y: objeto.caja.y - .75, ancho: objeto.caja.ancho + 1.5 + (objeto.fisica ? 8 : 0), alto: objeto.caja.alto + 1.5 + (objeto.fisica ? 8 : 0) };
    const borde = [{ x: r.x, y: r.y }, { x: r.x + r.ancho, y: r.y }, { x: r.x + r.ancho, y: r.y + r.alto }, { x: r.x, y: r.y + r.alto }, { x: r.x, y: r.y }];
    for (const arco of s.arcos) {
        expect(crucesB(arco, borde)).toHaveLength(0);
        for (const angulo of [arco.desde, arco.hasta]) {
            const x = arco.centro.x + arco.radio * Math.cos(angulo), y = arco.centro.y + arco.radio * Math.sin(angulo);
            expect(x >= r.x && x <= r.x + r.ancho && y >= r.y && y <= r.y + r.alto).toBe(false);
        }
    }
    for (const a of s.aristas) {
        const enlace = base.enlaces[a.ref.id]!;
        if (!('objeto' in enlace) || !('proceso' in enlace) || enlace.tipo === 'efecto') throw Error('Fixture C/R/A/I');
        expect(enlace.estado).toBe('s1'); expect(a.hechos).toEqual([enlace.id]); expect(a.capa).toBe(20);
        expect(a.tramos).toHaveLength(1); const t = a.tramos[0]!; expect(t.puntos).toHaveLength(2); expect(t.fin).toBe(enlace.tipo === 'agente' ? 'piruletaNegra' : enlace.tipo === 'instrumento' ? 'piruletaBlanca' : 'punta');
        const terminal = enlace.tipo === 'resultado' ? t.puntos.at(-1)! : t.puntos[0]!;
        for (const arco of s.arcos) expect(terminal).toEqual(arco.centro);
        const c = estado.caja, cx = Math.max(c.x + 8, Math.min(terminal.x, c.x + c.ancho - 8)), cy = Math.max(c.y + 8, Math.min(terminal.y, c.y + c.alto - 8));
        expect(Math.hypot(terminal.x - cx, terminal.y - cy)).toBeCloseTo(8, 8);
    }
    expect(exportarDiagrama(base, 'sd', { version: 'B-v2-R2' }).ok).toBe(true);
    expect(exportarDocumento(base, new Map(), { version: 'B-v2-R2' }).ok).toBe(true);
    expect(JSON.stringify(base)).toBe(antes);
}
for (const base of modelosCentrosEfectivosR2)
    test(`T-206 T-216 R2 centros P efectivos exactos ${base.enlaces.e1!.tipo}`, () => comprobarUniformeEfectivoR2(base));

for (const operador of ['XOR', 'OR'] as const)
    for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const)
        test(`T-206 T-216 R2 controles centros medidos ${operador} ${tipo}`, () => {
            for (const variante of ['normal', 'nombre-largo', 'duracion'] as const) {
                const m = modeloCriterioA(tipo, operador, false);
                const procesos = Object.fromEntries(['p', 'q'].map(id => {
                    const proceso = m.cosas[id]! as Proceso;
                    return [id, { ...proceso,
                        ...(variante === 'nombre-largo' ? { nombre: proceso.nombre + 'a'.repeat(100) } : {}),
                        ...(variante === 'duracion' ? { duracion: { min: 1e20, esperada: 2e20, max: 3e20 } } : {}) }];
                }));
                const base: Modelo = { ...m, cosas: { ...m.cosas, ...procesos }, enlaces: Object.fromEntries(Object.entries(m.enlaces).map(([id, e]) => [id, { ...e, estado: 's1' } as Enlace])),
                    opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones,
                        p: { x: -200, y: -150, ancho: 160, alto: 80 }, q: { x: -200, y: 350, ancho: 160, alto: 80 } } } } };
                comprobarUniformeEfectivoR2(base, variante === 'duracion');
                if (variante === 'duracion') comprobarTintaUniformeX(base, 'sd');
            }
        });

// APPEND X: fallo que captura: el sector o glifo completo oculto pese a línea central visible.
import { arcoLibre, expandirCaja, crucesCirculo } from './geometria';
import { colocarMarcador } from './marcadores';
function comprobarTintaUniformeX(base: Modelo, opd: string): void {
    expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]);
    expect(gatesExportacion(base, { opd })).toEqual([]);
    const antes = JSON.stringify(base); congelarCriterioA(base); const e = escena(base, opd), objeto = e.nodos.find(n => n.ref.id === 'o')!;
    expect(e.arcos.length).toBe(base.abanicos.f!.operador === 'OR' ? 2 : 1);
    const cuerpo = expandirCaja({ ...objeto.caja, ancho: objeto.caja.ancho + (objeto.fisica ? 8 : 0), alto: objeto.caja.alto + (objeto.fisica ? 8 : 0) }, 1.5);
    for (const arco of e.arcos) {
        expect(arcoLibre({ ...arco, dash: '4 1', trazo: 1.5 }, [cuerpo])).toBe(true);
        for (const arista of e.aristas.filter(a => base.abanicos.f!.enlaces.includes(a.ref.id))) {
            const t = arista.tramos[0]!, enlace = base.enlaces[arista.ref.id]!;
            expect(t.puntos).toHaveLength(2); expect(arista.hechos).toEqual([enlace.id]); expect(arista.capa).toBe(20);
            const contacto = enlace.tipo === 'resultado' ? t.puntos.at(-1)! : t.puntos[0]!;
            expect(contacto).toEqual(arco.centro);
            const roots = crucesCirculo(arco.centro, arco.radio, t.puntos[0]!, t.puntos[1]!).filter(p => { let a = Math.atan2(p.y - arco.centro.y, p.x - arco.centro.x); while (a < arco.desde - 1e-9) a += Math.PI * 2; return a <= arco.hasta + 1e-9; });
            expect(roots.length).toBeGreaterThan(0);
        }
    }
    for (const arista of e.aristas) for (const t of arista.tramos) {
        if (!t.fin) continue;
        const mark = colocarMarcador(t.fin, t.puntos.at(-1)!, t.puntos.at(-2)!), M = mark.matriz;
        const point = (x: number, y: number) => ({ x: M[0]*x + M[2]*y + M[4], y: M[1]*x + M[3]*y + M[5] });
        const caps = e.nodos.flatMap(n => n.estados).filter(c => c.ref.id !== (base.enlaces[arista.ref.id]! as { estado?: string }).estado);
        if (t.fin === 'punta') {
            expect(mark.figura.datos).toBe('M 0 0 L 23 8 L 12 0 L 23 -8 Z');
            const polygon = [point(0,0), point(23,8), point(12,0), point(23,-8)];
            for (const c of caps) expect(polygon.some((a,i) => intersectaCapsula(a, polygon[(i+1)%4]!, c.caja, 1.1))).toBe(false);
        } else {
            expect(t.fin === 'piruletaBlanca' || t.fin === 'piruletaNegra').toBe(true);
            const C = point(12,0); for (const c of caps) { expect(intersectaCapsula(point(0,0), point(7,0), c.caja, 1.1)).toBe(false); expect(intersectaCapsula(C,C,c.caja,6.1)).toBe(false); }
        }
    }
    expect(JSON.stringify(base)).toBe(antes);
}
const modelosContenedorUniformeX: readonly Modelo[] = [
  {
    "id": "review-OR-consumo-distintos",
    "nombre": "Modelo",
    "raiz": "sd",
    "secuencia": 100,
    "unidadTiempo": "min",
    "cosas": {
      "o": {
        "id": "o",
        "nombre": "Registro",
        "tipo": "objeto",
        "esencia": "informacional",
        "afiliacion": "sistemica",
        "estados": [
          {
            "id": "s1",
            "nombre": "pendiente"
          },
          {
            "id": "s2",
            "nombre": "pagado"
          }
        ]
      },
      "p": {
        "id": "p",
        "nombre": "Preparar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "q": {
        "id": "q",
        "nombre": "Despachar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "r": {
        "id": "r",
        "nombre": "Archivar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      }
    },
    "enlaces": {
      "e1": {
        "id": "e1",
        "tipo": "instrumento",
        "objeto": "o",
        "proceso": "p",
        "estado": "s1"
      },
      "e2": {
        "id": "e2",
        "tipo": "instrumento",
        "objeto": "o",
        "proceso": "q",
        "estado": "s1"
      }
    },
    "abanicos": {
      "f": {
        "id": "f",
        "operador": "OR",
        "enlaces": [
          "e1",
          "e2"
        ]
      }
    },
    "opds": {
      "sd": {
        "id": "sd",
        "tipo": "raiz",
        "apariciones": {
          "o": {
            "x": -400,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": 0,
            "y": 0,
            "ancho": 160,
            "alto": 80
          }
        }
      },
      "h": {
        "id": "h",
        "tipo": "descomposicion",
        "cosa": "p",
        "padre": "sd",
        "orden": 0,
        "bandas": [
          [
            "q",
            "r"
          ]
        ],
        "objetosInternos": [],
        "apariciones": {
          "o": {
            "x": 0,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": -600,
            "y": -300,
            "ancho": 160,
            "alto": 80
          },
          "q": {
            "x": 400,
            "y": -150,
            "ancho": 160,
            "alto": 80
          },
          "r": {
            "x": 1800,
            "y": -150,
            "ancho": 160,
            "alto": 80
          }
        }
      }
    }
  },
  {
    "id": "review-OR-consumo-distintos",
    "nombre": "Modelo",
    "raiz": "sd",
    "secuencia": 100,
    "unidadTiempo": "min",
    "cosas": {
      "o": {
        "id": "o",
        "nombre": "Registro",
        "tipo": "objeto",
        "esencia": "fisica",
        "afiliacion": "sistemica",
        "estados": [
          {
            "id": "s1",
            "nombre": "pendiente"
          },
          {
            "id": "s2",
            "nombre": "pagado"
          }
        ]
      },
      "p": {
        "id": "p",
        "nombre": "Preparar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "q": {
        "id": "q",
        "nombre": "Despachar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "r": {
        "id": "r",
        "nombre": "Archivar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      }
    },
    "enlaces": {
      "e1": {
        "id": "e1",
        "tipo": "agente",
        "objeto": "o",
        "proceso": "p",
        "estado": "s1"
      },
      "e2": {
        "id": "e2",
        "tipo": "agente",
        "objeto": "o",
        "proceso": "q",
        "estado": "s1"
      }
    },
    "abanicos": {
      "f": {
        "id": "f",
        "operador": "OR",
        "enlaces": [
          "e1",
          "e2"
        ]
      }
    },
    "opds": {
      "sd": {
        "id": "sd",
        "tipo": "raiz",
        "apariciones": {
          "o": {
            "x": -400,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": 0,
            "y": 0,
            "ancho": 160,
            "alto": 80
          }
        }
      },
      "h": {
        "id": "h",
        "tipo": "descomposicion",
        "cosa": "p",
        "padre": "sd",
        "orden": 0,
        "bandas": [
          [
            "q",
            "r"
          ]
        ],
        "objetosInternos": [],
        "apariciones": {
          "o": {
            "x": 0,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": -600,
            "y": -300,
            "ancho": 160,
            "alto": 80
          },
          "q": {
            "x": 400,
            "y": -150,
            "ancho": 160,
            "alto": 80
          },
          "r": {
            "x": 1800,
            "y": -150,
            "ancho": 160,
            "alto": 80
          }
        }
      }
    }
  },
  {
    "id": "review-OR-consumo-distintos",
    "nombre": "Modelo",
    "raiz": "sd",
    "secuencia": 100,
    "unidadTiempo": "min",
    "cosas": {
      "o": {
        "id": "o",
        "nombre": "Registro",
        "tipo": "objeto",
        "esencia": "informacional",
        "afiliacion": "sistemica",
        "estados": [
          {
            "id": "s1",
            "nombre": "pendiente"
          },
          {
            "id": "s2",
            "nombre": "pagado"
          }
        ]
      },
      "p": {
        "id": "p",
        "nombre": "Preparar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "q": {
        "id": "q",
        "nombre": "Despachar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "r": {
        "id": "r",
        "nombre": "Archivar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      }
    },
    "enlaces": {
      "e1": {
        "id": "e1",
        "tipo": "instrumento",
        "objeto": "o",
        "proceso": "p",
        "estado": "s1"
      },
      "e2": {
        "id": "e2",
        "tipo": "instrumento",
        "objeto": "o",
        "proceso": "q",
        "estado": "s1"
      }
    },
    "abanicos": {
      "f": {
        "id": "f",
        "operador": "OR",
        "enlaces": [
          "e1",
          "e2"
        ]
      }
    },
    "opds": {
      "sd": {
        "id": "sd",
        "tipo": "raiz",
        "apariciones": {
          "o": {
            "x": -400,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": 0,
            "y": 0,
            "ancho": 160,
            "alto": 80
          }
        }
      },
      "h": {
        "id": "h",
        "tipo": "descomposicion",
        "cosa": "p",
        "padre": "sd",
        "orden": 0,
        "bandas": [
          [
            "q",
            "r"
          ]
        ],
        "objetosInternos": [],
        "apariciones": {
          "o": {
            "x": 0,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": -600,
            "y": 350,
            "ancho": 160,
            "alto": 80
          },
          "q": {
            "x": 400,
            "y": 500,
            "ancho": 160,
            "alto": 80
          },
          "r": {
            "x": 1800,
            "y": 500,
            "ancho": 160,
            "alto": 80
          }
        }
      }
    }
  },
  {
    "id": "review-OR-consumo-distintos",
    "nombre": "Modelo",
    "raiz": "sd",
    "secuencia": 100,
    "unidadTiempo": "min",
    "cosas": {
      "o": {
        "id": "o",
        "nombre": "Registro",
        "tipo": "objeto",
        "esencia": "fisica",
        "afiliacion": "sistemica",
        "estados": [
          {
            "id": "s1",
            "nombre": "pendiente"
          },
          {
            "id": "s2",
            "nombre": "pagado"
          }
        ]
      },
      "p": {
        "id": "p",
        "nombre": "Preparar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "q": {
        "id": "q",
        "nombre": "Despachar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      },
      "r": {
        "id": "r",
        "nombre": "Archivar",
        "tipo": "proceso",
        "esencia": "informacional",
        "afiliacion": "sistemica"
      }
    },
    "enlaces": {
      "e1": {
        "id": "e1",
        "tipo": "agente",
        "objeto": "o",
        "proceso": "p",
        "estado": "s1"
      },
      "e2": {
        "id": "e2",
        "tipo": "agente",
        "objeto": "o",
        "proceso": "q",
        "estado": "s1"
      }
    },
    "abanicos": {
      "f": {
        "id": "f",
        "operador": "OR",
        "enlaces": [
          "e1",
          "e2"
        ]
      }
    },
    "opds": {
      "sd": {
        "id": "sd",
        "tipo": "raiz",
        "apariciones": {
          "o": {
            "x": -400,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": 0,
            "y": 0,
            "ancho": 160,
            "alto": 80
          }
        }
      },
      "h": {
        "id": "h",
        "tipo": "descomposicion",
        "cosa": "p",
        "padre": "sd",
        "orden": 0,
        "bandas": [
          [
            "q",
            "r"
          ]
        ],
        "objetosInternos": [],
        "apariciones": {
          "o": {
            "x": 0,
            "y": 0,
            "ancho": 300,
            "alto": 220
          },
          "p": {
            "x": -600,
            "y": 350,
            "ancho": 160,
            "alto": 80
          },
          "q": {
            "x": 400,
            "y": 500,
            "ancho": 160,
            "alto": 80
          },
          "r": {
            "x": 1800,
            "y": 500,
            "ancho": 160,
            "alto": 80
          }
        }
      }
    }
  }
];
test('T-206 T-216 X cajas P definitivas y tinta contenedor-instrumento-arriba', () => { const base = modelosContenedorUniformeX[0]!; comprobarTintaUniformeX(base, 'h'); const e = escena(base, 'h'), n = e.nodos.find(n => n.ref.id === 'p')!; expect(n.caja.ancho).toBe(2584); expect(n.caja.alto).toBe(254); });
test('T-206 T-216 X cajas P definitivas y tinta contenedor-agente-arriba', () => { const base = modelosContenedorUniformeX[1]!; comprobarTintaUniformeX(base, 'h'); const e = escena(base, 'h'), n = e.nodos.find(n => n.ref.id === 'p')!; expect(n.caja.ancho).toBe(2584); expect(n.caja.alto).toBe(254); });
test('T-206 T-216 X cajas P definitivas y tinta contenedor-instrumento-abajo', () => { const base = modelosContenedorUniformeX[2]!; comprobarTintaUniformeX(base, 'h'); const e = escena(base, 'h'), n = e.nodos.find(n => n.ref.id === 'p')!; expect(n.caja.ancho).toBe(2584); expect(n.caja.alto).toBe(254); });
test('T-206 T-216 X cajas P definitivas y tinta contenedor-agente-abajo', () => { const base = modelosContenedorUniformeX[3]!; comprobarTintaUniformeX(base, 'h'); const e = escena(base, 'h'), n = e.nodos.find(n => n.ref.id === 'p')!; expect(n.caja.ancho).toBe(2584); expect(n.caja.alto).toBe(254); });

// APPEND X: estabilidad por geometría e identidad; primer GREEN es cobertura adicional.
for (const tipo of ['consumo','resultado','agente','instrumento'] as const)
 test(`T-206 T-216 X radio y packing reproducibles por identidad ${tipo}`, () => {
    const m=modeloCriterioA(tipo,'OR',false);
    const base:Modelo={...m,cosas:{...m.cosas,p:{...m.cosas.p! as Proceso,duracion:{min:1e20,esperada:2e20,max:3e20}},q:{...m.cosas.q! as Proceso,duracion:{min:1e20,esperada:2e20,max:3e20}}},
      enlaces:Object.fromEntries(Object.entries(m.enlaces).map(([id,e])=>[id,{...e,estado:'s1'} as Enlace])),
      opds:{sd:{...m.opds.sd!,apariciones:{...m.opds.sd!.apariciones,p:{x:-200,y:-150,ancho:160,alto:80},q:{x:-200,y:350,ancho:160,alto:80}}}}};
    comprobarTintaUniformeX(base,'sd');
    const s=escena(base,'sd');
    expect(escena(JSON.parse(JSON.stringify(base)) as Modelo,'sd')).toEqual(s);
    const permutada:Modelo={...base,abanicos:{f:{...base.abanicos.f!,enlaces:[...base.abanicos.f!.enlaces].reverse()}}};
    const perm=escena(permutada,'sd'); expect(perm.arcos).toEqual(s.arcos); expect(perm.nodos).toEqual(s.nodos);
    for(const a of s.aristas) expect(perm.aristas.find(b=>b.ref.id===a.ref.id)).toEqual(a);
    expect(base.opds.sd!.apariciones).toEqual({...m.opds.sd!.apariciones,p:{x:-200,y:-150,ancho:160,alto:80},q:{x:-200,y:350,ancho:160,alto:80}});
 });
for(const operador of ['XOR','OR'] as const)
 test(`T-206 T-216 X tres ramas finitas completas ${operador}`,()=>{
    const m=modeloCriterioA('consumo',operador,false);
    const base:Modelo={...m,cosas:{...m.cosas, r:p('r','Archivar')},enlaces:{e1:{id:'e1',tipo:'consumo',objeto:'o',proceso:'p',estado:'s1'},e2:{id:'e2',tipo:'consumo',objeto:'o',proceso:'q',estado:'s1'},e3:{id:'e3',tipo:'consumo',objeto:'o',proceso:'r',estado:'s1'}},abanicos:{f:{id:'f',operador,enlaces:['e1','e2','e3']}},
      opds:{sd:{...m.opds.sd!,apariciones:{...m.opds.sd!.apariciones,r:{x:650,y:180,ancho:160,alto:80}}}}};
    comprobarTintaUniformeX(base,'sd'); expect(escena(base,'sd').arcos.map(a=>a.radio)).toEqual(operador==='OR'?[30,35]:[30]);
 });

// APPEND T204/T220: la medición genuina de tinta de [ y } precede a este RED.
for(const declarado of [60,80]) test(`T-204 T-220 X duración inscrita con semiejes de contenido ${declarado}`,()=>{
    const proc:Proceso={...p('p','Preparar'),duracion:{min:1e20,esperada:2e20,max:3e20}};
    const base=m([proc]),modelo:Modelo={...base,opds:{sd:{...base.opds.sd!,apariciones:{p:{x:-200,y:-150,ancho:160,alto:declarado}}}}};
    expect(validarForma(modelo)).toEqual([]);expect(erroresContexto(modelo)).toEqual([]);
    const antes=JSON.stringify(modelo);congelarCriterioA(modelo);const n=escena(modelo,'sd').nodos[0]!;
    const contenido=Math.max(anchoTexto(n.duracion!,11,false),...n.rotulo.lineas.map(l=>anchoTexto(l,17,true)));
    expect(n.caja.ancho).toBeGreaterThanOrEqual(contenido*Math.SQRT2+16);
    expect(n.caja.alto).toBeGreaterThanOrEqual((n.rotulo.lineas.length*22+20)*Math.SQRT2+16);
    expect(modelo.opds.sd!.apariciones.p).toEqual({x:-200,y:-150,ancho:160,alto:declarado});expect(JSON.stringify(modelo)).toBe(antes);
});
