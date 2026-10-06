import { expect, test } from 'bun:test';
import * as g from './geometria';
import type { Punto, Rect } from './escena';

const caja: Rect = Object.freeze({ x: 11, y: -7, ancho: 140, alto: 50 });
const centro = { x: 81, y: 18 };
function borde(p: Punto, forma: 'rectangulo' | 'elipse' | 'capsula'): void {
  const x = Math.abs(p.x - centro.x), y = Math.abs(p.y - centro.y);
  if (forma === 'rectangulo') expect(Math.min(Math.abs(x - 70), Math.abs(y - 25))).toBeLessThan(1e-9);
  else if (forma === 'elipse') expect(Math.abs(x ** 2 / 70 ** 2 + y ** 2 / 25 ** 2 - 1)).toBeLessThan(1e-9);
  else if (x > 62 && y > 17) expect(Math.abs((x - 62) ** 2 + (y - 17) ** 2 - 64)).toBeLessThan(1e-9);
  else expect(Math.min(Math.abs(x - 70), Math.abs(y - 25))).toBeLessThan(1e-9);
  expect(x).toBeLessThanOrEqual(70 + 1e-9); expect(y).toBeLessThanOrEqual(25 + 1e-9);
}
for (const forma of ['rectangulo', 'elipse', 'capsula'] as const) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [4, 3], [-4, 3], [4, -3], [-4, -3], [65, 21]]) {
  test(`T-224 recorte ${forma} dirección ${dx},${dy} sobre el perímetro real`, () => {
    expect(g.recortar).toBeFunction();
    const p = g.recortar(caja, { x: centro.x + dx!, y: centro.y + dy! }, forma);
    borde(p, forma);
    expect(Math.abs((p.x - centro.x) * dy! - (p.y - centro.y) * dx!)).toBeLessThan(1e-9);
    expect((p.x - centro.x) * dx! + (p.y - centro.y) * dy!).toBeGreaterThan(0);
    expect(caja).toEqual({ x: 11, y: -7, ancho: 140, alto: 50 });
  });
}
test('T-224 cápsula usa radio acotado en cajas pequeñas', () => {
  expect(g.recortar).toBeFunction();
  const p = g.recortar({ x: 0, y: 0, ancho: 10, alto: 10 }, { x: 15, y: 15 }, 'capsula');
  expect(p.x).toBeCloseTo(5 + 5 / Math.sqrt(2), 12); expect(p.y).toBeCloseTo(p.x, 12);
});
test('T-224 centros coincidentes usan el borde este y recorte es reversible', () => {
  expect(g.recortarEnlace).toBeFunction();
  const a = { x: 0, y: 0, ancho: 80, alto: 40 }, b = { x: 20, y: 10, ancho: 40, alto: 20 };
  const q = g.recortarEnlace(a, 'elipse', b, 'rectangulo');
  expect(q).toEqual([{ x: 80, y: 20 }, { x: 60, y: 20 }]);
  expect<readonly Punto[]>(g.recortarEnlace(b, 'rectangulo', a, 'elipse')).toEqual([...q].reverse());
  const c = { x: 250, y: 100, ancho: 100, alto: 80 };
  const r = g.recortarEnlace(a, 'rectangulo', c, 'elipse');
  expect<readonly Punto[]>(g.recortarEnlace(c, 'elipse', a, 'rectangulo')).toEqual([...r].reverse());
});
test('T-224 entradas no finitas o cajas sin área se rechazan sin NaN', () => {
  expect(g.recortar).toBeFunction();
  for (const c of [{ ...caja, ancho: 0 }, { ...caja, alto: -1 }, { ...caja, x: NaN }, { ...caja, y: Infinity }]) expect(() => g.recortar(c, centro, 'elipse')).toThrow(RangeError);
  expect(() => g.recortar(caja, { x: Infinity, y: 0 }, 'rectangulo')).toThrow(RangeError);
});
for (const len of [2, 100, 400]) for (const [ux, uy] of [[1, 0], [0, -1], [.6, .8]]) test(`T-211 rayo conserva recta base y offset acotado ${len} ${ux},${uy}`, () => {
  expect(g.rayo).toBeFunction(); const a = Object.freeze({ x: 3, y: 7 }), b = Object.freeze({ x: 3 + len * ux!, y: 7 + len * uy! });
  const r = g.rayo(a, b); expect(r).toHaveLength(4); expect(r[0]).toEqual(a); expect(r[3]).toEqual(b);
  const k = len === 400 ? 22 : 12;
  for (const [index, ratio, sign] of [[1, .46, 1], [2, .54, -1]]) {
    const p = r[index!]!; const vx = p.x - a.x, vy = p.y - a.y;
    expect(vx * ux! + vy * uy!).toBeCloseTo(ratio! * len, 10);
    expect(vx * -uy! + vy * ux!).toBeCloseTo(sign! * k, 10);
  }
});
test('T-211 rayo de longitud cero no inventa una excursión', () => {
  expect(g.rayo).toBeFunction(); expect<readonly Punto[]>(g.rayo({ x: 1, y: 2 }, { x: 1, y: 2 })).toEqual(Array(4).fill({ x: 1, y: 2 }));
});
for (const alto of [50, 200]) test(`T-211 autoinvocación corta semirrectas ±35°, no parametrización de elipse ${alto}`, () => {
  expect(g.autoinvocacion).toBeFunction(); const q = { x: 10, y: 20, ancho: 240, alto }; const c = { x: 130, y: 20 + alto / 2 };
  const r = g.autoinvocacion(q);
  expect(r.pico).toEqual({ x: 130, y: 20 + alto + (alto === 50 ? 56 : 110) });
  for (const [p, signo] of [[r.salida, 1], [r.retorno, -1]] as const) {
    expect(((p.x - c.x) / 120) ** 2 + ((p.y - c.y) / (alto / 2)) ** 2).toBeCloseTo(1, 12);
    expect((p.x - c.x) / (p.y - c.y)).toBeCloseTo(signo * Math.tan(35 * Math.PI / 180), 12);
  }
  expect(r.puntos[0]).toEqual(r.salida); expect(r.puntos.at(-1)).toEqual(r.retorno); expect(r.puntos.filter(p => p.x === r.pico.x && p.y === r.pico.y)).toHaveLength(1);
});
for (const [orientacion, dx, dy] of [['derecha', 250, 0], ['izquierda', -250, 0], ['abajo', 0, 250], ['arriba', 0, -250]] as const) test(`T-212 peine ${orientacion} comparte barra y conserva orden transversal sin cruces`, () => {
  expect(g.peine).toBeFunction(); const horizontal = dx !== 0; const origen = { caja: { x: -40, y: -20, ancho: 80, alto: 40 }, forma: 'rectangulo' as const };
  const otros = [-60, 0, 70].map((t, i) => ({ id: `r${i}`, caja: { x: dx + (horizontal ? 0 : t) - 20, y: dy + (horizontal ? t : 0) - 10, ancho: 40, alto: 20 }, forma: 'rectangulo' as const }));
  const p = g.peine(origen, Object.freeze([...otros].reverse()), true)!;
  expect(p.orientacion).toBe(orientacion); expect(p.ramas.map(r => r.id)).toEqual(['r0', 'r1', 'r2']);
  const eje = horizontal ? 'x' : 'y', transversal = horizontal ? 'y' : 'x'; const signo = Math.sign(dx || dy);
  expect(p.vertice[eje]).toBe((horizontal ? 40 : 20) * signo + 24 * signo);
  expect(p.base[eje] - p.vertice[eje]).toBe(30 * signo); expect(p.barra[0][eje] - p.base[eje]).toBe(16 * signo);
  expect(Math.abs(p.incompleta![1][transversal] - p.incompleta![0][transversal])).toBe(14);
  for (const rama of p.ramas) { expect(rama.puntos[0]![transversal]).toBe(rama.puntos[1]![transversal]); expect(rama.puntos[0]![eje]).toBe(p.barra[0][eje]); }
  expect(g.peine(origen, otros, true)).toEqual(p);
});
test('T-212 peine vacío y centroide coincidente son deterministas', () => {
  expect(g.peine).toBeFunction(); const q = { caja: { x: -10, y: -10, ancho: 20, alto: 20 }, forma: 'rectangulo' as const };
  expect(g.peine(q, [], false)).toBeNull(); const p = g.peine(q, [{ ...q, id: 'a' }], false)!;
  expect(p.orientacion).toBe('derecha'); expect(p.incompleta).toBeUndefined();
  expect(JSON.stringify(p)).not.toContain('null');
});
function polar(deg: number): Punto { return { x: Math.cos(deg * Math.PI / 180) * 100, y: Math.sin(deg * Math.PI / 180) * 100 }; }
for (const [angles, start, span] of [[[350, 10], 350, 20], [[10, 50, 80], 10, 70], [[0, 120, 240], 0, 240], [[90, 270], 90, 180], [[20, 20], 20, 0]] as const) test(`T-216 sector mínimo cubre ${angles} sin tomar el hueco`, () => {
  expect(g.sectorMinimo).toBeFunction(); const s = g.sectorMinimo({ x: 0, y: 0 }, angles.map(polar));
  expect(s.desde).toBeCloseTo(start * Math.PI / 180, 12); expect(s.hasta - s.desde).toBeCloseTo(span * Math.PI / 180, 12);
  expect(g.sectorMinimo({ x: 0, y: 0 }, [...angles].reverse().map(polar))).toEqual(s);
});
for (const [operador, radios] of [['AND', []], ['XOR', [30]], ['OR', [30, 35]]] as const) test(`T-216 abanico ${operador} acopla en borde real y conserva topología`, () => {
  expect(g.abanico).toBeFunction(); const q = { caja: { x: -40, y: -20, ancho: 80, alto: 40 }, forma: 'elipse' as const }; const otros = [{ x: 160, y: -80 }, { x: 160, y: 80 }];
  const f = g.abanico(q, otros, operador); expect(f.acople).toEqual({ x: 40, y: 0 }); expect(f.arcos.map(a => a.radio)).toEqual([...radios]);
  for (const a of f.arcos) { expect(a.centro).toEqual(f.acople); expect(a.dash).toBe('4 1'); expect(a.trazo).toBe(1.5); expect(a.desde).toBeCloseTo(Math.PI * 2 - Math.atan2(80, 120), 12); expect(a.hasta).toBeCloseTo(Math.PI * 2 + Math.atan2(80, 120), 12); }
  expect(g.abanico(q, [...otros].reverse(), operador)).toEqual(f);
});
test('T-216 abanico vacío y punto coincidente no produce NaN ni arcos ficticios', () => {
  expect(g.abanico).toBeFunction(); const q = { caja: { x: -10, y: -10, ancho: 20, alto: 20 }, forma: 'rectangulo' as const };
  expect(g.abanico(q, [], 'XOR')).toEqual({ acople: { x: 10, y: 0 }, arcos: [] });
  expect(g.sectorMinimo({ x: 0, y: 0 }, [{ x: 0, y: 0 }])).toEqual({ desde: 0, hasta: 0 });
});
for (const [a, b, c, d, expected] of [
  [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 0 }, true],
  [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }, true],
  [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 20, y: 0 }, false],
  [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 1 }, { x: 10, y: 1 }, false],
  [{ x: 2, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 3, y: 0 }, true],
] as const) test(`T-224 intersección de segmentos finitos ${JSON.stringify(a)} ${JSON.stringify(c)}`, () => {
  expect(g.intersectanSegmentos).toBeFunction(); expect(g.intersectanSegmentos(a, b, c, d)).toBe(expected); expect(g.intersectanSegmentos(c, d, b, a)).toBe(expected);
});
for (const forma of ['rectangulo', 'elipse'] as const) test(`T-224 intersección ${forma} tangente, dentro y fuera de segmento`, () => {
  expect(g.intersectaCaja).toBeFunction(); const q = { x: -10, y: -5, ancho: 20, alto: 10 };
  expect(g.intersectaCaja({ x: -20, y: 5 }, { x: 20, y: 5 }, q, forma)).toBe(true);
  expect(g.intersectaCaja({ x: -1, y: 0 }, { x: 1, y: 0 }, q, forma)).toBe(true);
  expect(g.intersectaCaja({ x: 11, y: 0 }, { x: 20, y: 0 }, q, forma)).toBe(false);
  expect(g.intersectaCaja({ x: -20, y: 6 }, { x: 20, y: 6 }, q, forma)).toBe(false);
});

test('T-211 offset intermedio del rayo200 no satura prematuramente', () => {
  const r = g.rayo({ x: 0, y: 0 }, { x: 200, y: 0 }); expect(r[1]).toEqual({ x: 92, y: 16 }); expect(r[2]).toEqual({ x: 108, y: -16 });
});

for (const [operador, radios] of [['AND', []], ['XOR', [30]], ['OR', [30, 35]]] as const) test(`T-216 extremos distintos colineales conservan registros ${operador} sin ampliar el sector`, () => {
  const comun = { caja: { x: -10, y: -10, ancho: 20, alto: 20 }, forma: 'rectangulo' as const };
  const extremos = Object.freeze([Object.freeze({ x: 100, y: 0 }), Object.freeze({ x: 200, y: 0 })]);
  const f = g.abanico(comun, extremos, operador);
  expect(f.acople).toEqual({ x: 10, y: 0 }); expect(f.arcos.map(a => a.radio)).toEqual([...radios]);
  for (const arco of f.arcos) { expect(arco.centro).toEqual({ x: 10, y: 0 }); expect(arco.desde).toBe(0); expect(arco.hasta).toBe(0); expect(arco.dash).toBe('4 1'); expect(arco.trazo).toBe(1.5); }
  expect(g.abanico(comun, [...extremos].reverse(), operador)).toEqual(f);
});
for (const operador of ['AND', 'XOR', 'OR'] as const) test(`T-216 menos de dos ramas no genera registros de arco ${operador}`, () => {
  const comun = { caja: { x: -10, y: -10, ancho: 20, alto: 20 }, forma: 'rectangulo' as const };
  expect(g.abanico(comun, [], operador).arcos).toEqual([]);
  expect(g.abanico(comun, [{ x: 100, y: 0 }], operador).arcos).toEqual([]);
});

test('T-216 B V2 visibilidad analítica detecta un obstáculo entre muestras', () => {
  const comprobar = (g as unknown as { arcoLibre: (a: g.ArcoGeometrico, cajas: readonly Rect[]) => boolean }).arcoLibre;
  expect(comprobar).toBeFunction();
  const arco: g.ArcoGeometrico = { centro: { x: 0, y: 0 }, radio: 100, desde: 0, hasta: 1, dash: '4 1', trazo: 1.5 };
  const angle = .123456789, x = 100 * Math.cos(angle), y = 100 * Math.sin(angle);
  expect(comprobar(arco, [{ x: x - .000001, y: y - .000001, ancho: .000002, alto: .000002 }])).toBe(false);
  expect(comprobar(arco, [{ x: 130, y: 130, ancho: 10, alto: 10 }])).toBe(true);
});

test('T-206 T-216 esquina de cápsula distingue bbox de área redondeada con trazo', () => {
  const intersecta = (g as unknown as { intersectaCapsula: (a: Punto, b: Punto, caja: Rect, pad: number) => boolean }).intersectaCapsula;
  expect(intersecta).toBeFunction();
  const r = { x: 0, y: 0, ancho: 80, alto: 26 };
  expect(intersecta({ x: 0, y: 0 }, { x: 3, y: 0 }, r, .75)).toBe(false);
  expect(intersecta({ x: 9, y: -1 }, { x: 9, y: 1 }, r, .75)).toBe(true);
  expect(intersecta({ x: -5, y: 13 }, { x: 90, y: 13 }, r, .75)).toBe(true);
});

// APPEND X: intervalos cerrados por obstáculo/sector, OR sobre ambos radios finitos.
test('T-216 X radio analítico cruza todas las rectas y evita el cuerpo sin malla', () => {
    expect(g.radioUniforme).toBeFunction();
    const C = {x:0,y:0}, fines = [{x:200,y:-100},{x:200,y:100}];
    const sector = g.sectorMinimo(C, fines);
    const caja = {x:20,y:-20,ancho:80,alto:40};
    const arcos = g.radioUniforme(C, fines, 'OR', [caja])!;
    expect(arcos).toHaveLength(2); expect(arcos[0]!.radio).toBeGreaterThan(100);
    expect(arcos[1]!.radio-arcos[0]!.radio).toBe(5);
    for(const a of arcos) { expect(g.arcoLibre(a,[caja])).toBe(true); expect(a.desde).toBe(sector.desde); expect(a.hasta).toBe(sector.hasta);
      for(const q of fines) expect(g.crucesCirculo(C,a.radio,C,q).length).toBeGreaterThan(0); }
    expect(g.radioUniforme(C,[...fines].reverse(),'OR',[caja])).toEqual(arcos);
});
test('T-216 X radio no prolonga ramas cortas ni dispensa arco exterior OR', () => {
    expect(g.radioUniforme).toBeFunction();
    expect(g.radioUniforme({x:0,y:0},[{x:32,y:0},{x:0,y:32}],'OR',[])).toBeNull();
    expect(g.radioUniforme({x:0,y:0},[{x:40,y:0},{x:0,y:40}],'XOR',[{x:-1,y:-1,ancho:100,alto:100}])).toBeNull();
    const f = [{x:100,y:0},{x:0,y:100}];
    expect(g.radioUniforme({x:0,y:0},f,'XOR',[])!.map(a=>a.radio)).toEqual([30]);
    expect(g.radioUniforme({x:0,y:0},f,'OR',[])!.map(a=>a.radio)).toEqual([30,35]);
});

test('T-216 X intervalos consideran el interior del sector mayor que π y tangencias',()=>{
    const C={x:0,y:0}, fines=[{x:200,y:0},{x:0,y:200},{x:-200,y:0},{x:0,y:-200}];
    const r={x:-80,y:-10,ancho:160,alto:20}, arcs=g.radioUniforme(C,fines,'OR',[r])!;
    expect(arcs).toHaveLength(2);expect(arcs[0]!.radio).toBeGreaterThan(Math.hypot(80,10));
    expect(arcs.every(a=>g.arcoLibre(a,[r]))).toBe(true);
    const tangent={x:30,y:-1,ancho:1,alto:2};
    const ts=g.radioUniforme(C,[{x:100,y:0},{x:100,y:50}],'XOR',[tangent])!;
    expect(ts[0]!.radio).toBeGreaterThan(31); expect(g.arcoLibre(ts[0]!,[tangent])).toBe(true);
});

test('T-216 X arco usa elipse efectiva cuando su bbox rechaza una esquina vacía',()=>{
    expect(g.arcoLibreElipse).toBeFunction();
    const E={x:20,y:-30,ancho:200,alto:60},a={centro:{x:0,y:0},radio:40,desde:Math.PI/4,hasta:Math.PI/3,dash:'4 1' as const,trazo:1.5 as const};
    expect(g.arcoLibre(a,[E])).toBe(false);expect(g.arcoLibreElipse(a,E)).toBe(true);
    expect(g.arcoLibreElipse({...a,desde:0,hasta:Math.PI/3},E)).toBe(false);
    expect(g.arcoLibreElipse({...a,radio:120,desde:0,hasta:Math.PI},E)).toBe(false);
});

test('T-216 X trazo completo frente polígono real distingue bbox rotada y ala',()=>{
    expect(g.arcoLibrePoligono).toBeFunction();
    const arc={centro:{x:0,y:0},radio:30,desde:0,hasta:Math.PI*2,dash:'4 1' as const,trazo:1.5 as const};
    const poly=[{x:0,y:0},{x:23,y:8},{x:12,y:0},{x:23,y:-8}];
    expect(g.arcoLibrePoligono(arc,poly,1.25)).toBe(true);
    expect(g.arcoLibrePoligono({...arc,radio:20},poly,1.25)).toBe(false);
    expect(g.arcoLibrePoligono({...arc,radio:40},[{x:-50,y:-50},{x:50,y:-50},{x:50,y:50},{x:-50,y:50}],1.25)).toBe(false);
});
