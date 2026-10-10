import { expect, test } from 'bun:test';
import * as m from './marcadores';
import { readFileSync } from 'node:fs';
const canon = readFileSync(new URL('../../../perfil/opd-opforja.md', import.meta.url), 'utf8').split('### §18.3')[1]!.split('### §18.4')[0]!;
const literales = {
  punta: 'M 0 0 L 23 8 L 12 0 L 23 -8 Z',
  piruletaNegra: 'M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0',
  piruletaBlanca: 'M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0',
  abierta: '0,0 20,-10 0,0 20,10', arpon: '0.5,0 20,10', arponInverso: '0.5,0 20,-10',
  sobretiempo: '4,10 13,-10', subtiempo: '4,10 13,-10 8.5,0 17,0 13,10 22,-10', triangulo: '15,0 30,30 0,30',
};
for (const [id, literal] of Object.entries(literales)) test(`${id === 'triangulo' ? 'T-212' : id.startsWith('piruleta') ? 'T-210' : id.includes('tiempo') ? 'T-215' : 'T-209'} ${id} conserva literal canónico`, () => {
  expect(m.MARCADORES).toBeDefined(); expect<string>(m.MARCADORES[id as keyof typeof m.MARCADORES].datos).toBe(literal);
  expect(canon).toContain(id.startsWith('arpon') ? '0.5,0 20,±10' : literal);
});
test('T-209 punta cerrada hueca, abierta y arpón conservan topología propia', () => {
  expect(m.MARCADORES).toBeDefined(); expect(m.MARCADORES.punta.tipo).toBe('path'); expect(m.MARCADORES.punta.datos.endsWith('Z')).toBe(true); expect(m.MARCADORES.punta.relleno).toBe('papel');
  expect(m.MARCADORES.abierta.tipo).toBe('polilinea'); expect(m.MARCADORES.abierta.relleno).toBe('ninguno'); expect(m.MARCADORES.arpon.relleno).toBe('ninguno');
});
test('T-210 piruletas tienen círculo r5 y palito, rellenos distintos', () => {
  expect(m.MARCADORES).toBeDefined(); expect(m.MARCADORES.piruletaNegra.datos.match(/a5,5/g)).toHaveLength(2); expect(m.MARCADORES.piruletaBlanca.datos).toBe(m.MARCADORES.piruletaNegra.datos);
  expect(m.MARCADORES.piruletaNegra.relleno).toBe('tinta'); expect(m.MARCADORES.piruletaBlanca.relleno).toBe('papel');
});
for (const [relacion, relleno, interior] of [['agregacion', 'tinta', undefined], ['generalizacion', 'papel', undefined], ['exhibicion', 'papel', 'poligono'], ['clasificacion', 'papel', 'circulo']] as const) test(`T-212 triángulo ${relacion} conserva el interior distinguible`, () => {
  expect(m.triangulo).toBeFunction(); const t = m.triangulo(relacion); expect(t.exterior.datos).toBe('15,0 30,30 0,30'); expect(t.exterior.relleno).toBe(relleno); expect(t.interior?.tipo).toBe(interior);
  if (relacion === 'exhibicion') expect(t.interior).toEqual({ tipo: 'poligono', datos: '15,12 21,24 9,24', relleno: 'tinta' });
  if (relacion === 'clasificacion') expect(t.interior).toEqual({ tipo: 'circulo', centro: { x: 15, y: 20 }, radio: 4, relleno: 'tinta' });
});
for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [.6, .8]]) for (const id of ['punta', 'abierta', 'arpon', 'arponInverso', 'piruletaNegra', 'piruletaBlanca'] as const) test(`T-209 ${id} orienta ancla y cuerpo detrás del extremo ${dx},${dy}`, () => {
  expect(m.colocarMarcador).toBeFunction(); const q = { x: 30, y: -10 }, p = { x: q.x - dx!, y: q.y - dy! }; const colocado = m.colocarMarcador(id, q, p); const [a, b, c, d, e, f] = colocado.matriz;
  const aplicar = (x: number, y: number) => ({ x: a * x + c * y + e, y: b * x + d * y + f });
  const ancla = id.startsWith('piruleta') ? 17 : id.startsWith('arpon') ? .5 : 0;
  const tip = aplicar(ancla, 0); expect(tip.x).toBeCloseTo(q.x, 12); expect(tip.y).toBeCloseTo(q.y, 12);
  const cuerpo = aplicar(id.startsWith('piruleta') ? 12 : 20, 0); expect((cuerpo.x - q.x) * dx! + (cuerpo.y - q.y) * dy!).toBeLessThan(0);
  expect(colocado.figura.datos).toBe(literales[id]); expect(a * d - b * c).toBeCloseTo(1, 12);
});
test('T-213 arpones preservan mitades opuestas y sentidos invertidos', () => {
  expect(m.colocarMarcador).toBeFunction(); const q = { x: 0, y: 0 };
  const hacia = m.colocarMarcador('arpon', q, { x: -1, y: 0 }).matriz;
  const desde = m.colocarMarcador('arpon', q, { x: 1, y: 0 }).matriz;
  const inverso = m.colocarMarcador('arponInverso', q, { x: -1, y: 0 }).matriz;
  const y = (t: readonly number[], sy: number) => t[1]! * 20 + t[3]! * sy + t[5]!;
  expect(y(hacia, 10)).toBe(-10); expect(y(desde, 10)).toBe(10); expect(y(inverso, -10)).toBe(10);
});
for (const orientacion of ['abajo', 'arriba', 'derecha', 'izquierda'] as const) test(`T-212 transformación del triángulo ${orientacion} deja vértice al refinable y base a refinadores`, () => {
  expect(m.colocarTriangulo).toBeFunction(); const [a, b, c, d, e, f] = m.colocarTriangulo({ x: 40, y: 50 }, orientacion);
  expect(a * 15 + e).toBe(40); expect(b * 15 + f).toBe(50);
  const base = { x: a * 15 + c * 30 + e, y: b * 15 + d * 30 + f };
  expect(base).toEqual({ x: 40 + (orientacion === 'derecha' ? 30 : orientacion === 'izquierda' ? -30 : 0), y: 50 + (orientacion === 'abajo' ? 30 : orientacion === 'arriba' ? -30 : 0) });
});
test('T-209 tangente degenerada usa +x sin NaN y no cambia literales', () => {
  expect(m.colocarMarcador).toBeFunction(); expect(m.colocarMarcador('punta', { x: 1, y: 2 }, { x: 1, y: 2 }).matriz).toEqual([-1, -0, 0, -1, 1, 2]);
});
