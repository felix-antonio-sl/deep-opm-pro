import { expect, test } from 'bun:test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Modelo, Cosa, Enlace, Opd, Aparicion, ModoDespliegue, Objeto, Proceso } from '../nucleo/tipos';
import { escena } from './escena';
import { dibujar, aTexto } from './dibujo';
import { importarV0 } from '../codec/importar';
import { opdsEnPreorden, etiquetaOpd } from '../nucleo/proyeccion';
import { validarForma } from '../nucleo/forma';
import { erroresContexto } from '../nucleo/matriz';
const obj = (id: string, nombre = 'Pedido'): Objeto => ({ id, nombre, tipo: 'objeto', estados: [], esencia: 'informacional', afiliacion: 'sistemica' });
const pro = (id: string, nombre = 'Procesar'): Proceso => ({ id, nombre, tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica' });
const a = (x: number, y: number, ancho = 135, alto = 60): Aparicion => ({ x, y, ancho, alto });
function modelo(cs: readonly Cosa[], es: readonly Enlace[] = [], pos?: Record<string, Aparicion>, os: readonly Opd[] = []): Modelo { return { id: 'sintetico', nombre: 'Casos construidos', unidadTiempo: 'min', raiz: 'sd', secuencia: 500, cosas: Object.fromEntries(cs.map(c => [c.id, c])), enlaces: Object.fromEntries(es.map(e => [e.id, e])), abanicos: {}, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: pos ?? Object.fromEntries(cs.map((c, i) => [c.id, a((i % 3) * 260, Math.floor(i / 3) * 220)])) }, ...Object.fromEntries(os.map(o => [o.id, o])) } }; }
interface Caso {
    nombre: string;
    m: Modelo;
    opd: string;
    oraculo: string;
    construido: boolean;
}
const casos: Caso[] = [];
const agregar = (nombre: string, m: Modelo, oraculo: string, opd = 'sd') => casos.push({ nombre, m, opd, oraculo, construido: true });
for (const tipo of ['objeto', 'proceso'] as const)
    for (const afiliacion of ['sistemica', 'ambiental'] as const)
        for (const esencia of ['fisica', 'informacional'] as const)
            agregar(`${tipo}-${esencia === 'fisica' ? 'fisico' : 'informacional'}-${afiliacion === 'sistemica' ? 'sistemico' : 'ambiental'}`, modelo([{ ...(tipo === 'objeto' ? obj('c') : pro('c')), esencia, afiliacion }]), 'T-200 T-201 T-205 forma/contorno/sombra/tipografía');
const estados: Cosa = { ...obj('o'), tipo: 'objeto', estados: [{ id: 's0', nombre: 'normal' }, { id: 's1', nombre: 'inicial', inicial: true }, { id: 's2', nombre: 'final', final: true }, { id: 's3', nombre: 'combinado', inicial: true, final: true }, { id: 's4', nombre: 'defecto' }, { id: 's5', nombre: 'actual' }], porDefecto: 's4', current: 's5' };
agregar('estados-designaciones', modelo([estados]), 'T-206 T-207 6 cápsulas, doble/grueso, flecha abierta y pin externo');
const ocultos: Cosa = { ...obj('o'), tipo: 'objeto', estados: [{ id: 's1', nombre: 'global', suprimido: true }, { id: 's2', nombre: 'local' }, { id: 's3', nombre: 'anclado', suprimido: true }] };
agregar('estados-ocultos-anclados', modelo([ocultos, pro('p')], [{ id: 'enlace-e', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's3' }], { o: { ...a(0, 0), ocultos: ['s1', 's2'] }, p: a(260, 180) }), 'T-208 chip ⋯2 y estado anclado visible');
agregar('rotulos-largos-nfc', modelo([obj('o', 'A\u0301rbol Ñandú pingüino Información extraordinariamente larga conservada íntegra'), pro('p', 'Almacenar Información Íntegra')]), 'T-203 T-204 NFC, multilínea, sin recorte ni elipsis');
agregar('transformadores-basicos', modelo([obj('o1', 'Entrada'), pro('p'), obj('o2', 'Salida'), { ...obj('o3', 'Recurso'), estados: [{ id: 'sRecurso', nombre: 'disponible' }] }], [{ id: 'c', tipo: 'consumo', objeto: 'o1', proceso: 'p' }, { id: 'r', tipo: 'resultado', objeto: 'o2', proceso: 'p' }, { id: 't', tipo: 'efecto', objeto: 'o3', proceso: 'p' }], { o1: a(0, 0), p: a(270, 180), o2: a(540, 360), o3: a(0, 360) }), 'T-209 C hacia P, R hacia O, efecto ambos extremos');
const stateObj = (id: string): Cosa => ({ ...obj(id, 'Pedido' + id.toUpperCase()), tipo: 'objeto', estados: [{ id: id + 'n', nombre: 'nuevo' }, { id: id + 'l', nombre: 'listo' }] });
agregar('transformadores-estados', modelo([stateObj('a'), stateObj('b'), stateObj('c'), stateObj('d'), stateObj('e'), pro('p', 'Transformar')], [{ id: 'ts1', tipo: 'consumo', objeto: 'a', proceso: 'p', estado: 'an' }, { id: 'ts2', tipo: 'resultado', objeto: 'b', proceso: 'p', estado: 'bl' }, { id: 'ts3', tipo: 'efecto', objeto: 'c', proceso: 'p', entrada: 'cn', salida: 'cl' }, { id: 'ts4', tipo: 'efecto', objeto: 'd', proceso: 'p', entrada: 'dn' }, { id: 'ts5', tipo: 'efecto', objeto: 'e', proceso: 'p', salida: 'el' }], { a: a(0, 0), b: a(800, 0), c: a(0, 240), d: a(800, 240), e: a(400, 480), p: a(420, 240) }), 'T-209 T-206 TS1/2/3/4/5 estados y dirección');
agregar('habilitadores', modelo([{ ...obj('o', 'Operador'), esencia: 'fisica' }, obj('i', 'Instrumento'), pro('p')], [{ id: 'a', tipo: 'agente', objeto: 'o', proceso: 'p' }, { id: 'ei', tipo: 'instrumento', objeto: 'i', proceso: 'p' }], { o: a(0, 0), i: a(300, 0), p: a(150, 200) }), 'T-210 palito, negro/blanco en proceso');
agregar('invocacion', modelo([pro('p', 'Iniciar'), pro('q', 'Continuar')], [{ id: 'iv', tipo: 'invocacion', origen: 'p', destino: 'q' }], { p: a(0, 0), q: a(350, 200) }), 'T-211 rayo cuatro vértices, punta al invocado');
agregar('autoinvocacion', modelo([pro('p', 'Reintentar')], [{ id: 'iv', tipo: 'invocacion', origen: 'p', destino: 'p' }]), 'T-211 lazo y punta, viewport cubre pico');
const modos: ModoDespliegue[] = ['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'];
const triCs = modos.flatMap((_, i) => [obj('t' + i, 'Todo' + String.fromCharCode(65 + i)), obj('a' + i, 'Parte' + String.fromCharCode(65 + i)), obj('b' + i, 'Rasgo' + String.fromCharCode(65 + i))]);
const triEs: Enlace[] = modos.flatMap((tipo, i) => [{ id: 'ra' + i, tipo, refinable: 't' + i, refinador: 'a' + i }, { id: 'rb' + i, tipo, refinable: 't' + i, refinador: 'b' + i }]);
const triPos = Object.fromEntries(modos.flatMap((_, i) => [['t' + i, a(i * 440 + 90, 0)], ['a' + i, a(i * 440, 240)], ['b' + i, a(i * 440 + 220, 240)]]));
agregar('triangulos-peines', modelo(triCs, triEs, triPos), 'T-212 cuatro topologías, ramas dobles y peine manhattan');
agregar('etiquetados', modelo([obj('a', 'Pedido'), obj('b', 'Cliente'), obj('c', 'Producto'), obj('d', 'Proveedor')], [{ id: 'u', tipo: 'etiquetado', origen: 'a', destino: 'b', etiqueta: 'pertenece a' }, { id: 'bi', tipo: 'etiquetadoBidireccional', origen: 'b', destino: 'c', etiqueta: 'solicita', inversa: 'es solicitado por' }, { id: 'r', tipo: 'reciproco', origen: 'c', destino: 'd', etiqueta: 'coopera con' }], { a: a(0, 0), b: a(350, 0), c: a(700, 0), d: a(1050, 0) }), 'T-213 abierta, arpones, itálicas por roles');
agregar('control-ec', modelo([obj('o', 'Pedido'), obj('i', 'Equipo'), pro('p')], [{ id: 'enlace-e', tipo: 'consumo', objeto: 'o', proceso: 'p', control: 'e' }, { id: 'c', tipo: 'instrumento', objeto: 'i', proceso: 'p', control: 'c' }], { o: a(0, 0), i: a(300, 0), p: a(150, 200) }), 'T-214 e/c minúsculas junto proceso');
agregar('excepciones', modelo([pro('p', 'Esperar'), pro('q', 'Manejar'), pro('r', 'Cancelar')], [{ id: 'enlace-s', tipo: 'excepcionSobretiempo', origen: 'p', destino: 'q' }, { id: 'u', tipo: 'excepcionSubtiempo', origen: 'p', destino: 'r' }], { p: a(0, 130), q: a(420, 0), r: a(420, 260) }), 'T-215 una/dos barras, sin punta adicional');
function fan(operador?: 'XOR' | 'OR'): Modelo { const cs = [obj('a', 'Entrada'), obj('b', 'Reserva'), pro('p', 'Transformar'), obj('c', 'Resultado'), obj('d', 'Salida')], es: Enlace[] = [{ id: 'c1', tipo: 'consumo', objeto: 'a', proceso: 'p' }, { id: 'c2', tipo: 'consumo', objeto: 'b', proceso: 'p' }, { id: 'r1', tipo: 'resultado', objeto: 'c', proceso: 'p' }, { id: 'r2', tipo: 'resultado', objeto: 'd', proceso: 'p' }]; const base = modelo(cs, es, { a: a(0, 0), b: a(0, 300), p: a(360, 150), c: a(720, 0), d: a(720, 300) }); return operador ? { ...base, abanicos: { f1: { id: 'f1', operador, enlaces: ['c1', 'c2'] }, f2: { id: 'f2', operador, enlaces: ['r1', 'r2'] } } } : base; }
agregar('abanico-xor', fan('XOR'), 'T-216 un arco convergente/divergente');
agregar('abanico-or', fan('OR'), 'T-216 dos arcos concéntricos');
agregar('enlaces-and', fan(), 'T-216 cuatro enlaces independientes, sin arco');
agregar('incompletas', modelo(triCs.map((c, i) => i % 3 === 0 && i < 9 ? { ...c, incompleta: [modos[Math.floor(i / 3)] as 'agregacion' | 'exhibicion' | 'generalizacion'] } : c), triEs, triPos), 'T-217 barra A/Ex/G, clasificación completa');
agregar('multiplicidades', modelo([obj('o', 'Lote'), pro('p'), obj('t', 'Todo'), obj('r', 'Parte'), obj('a', 'Cliente')], [{ id: 'c', tipo: 'consumo', objeto: 'o', proceso: 'p', mult: '?' }, { id: 'enlace-s', tipo: 'agregacion', refinable: 't', refinador: 'r', mult: '+' }, { id: 'enlace-e', tipo: 'etiquetado', origen: 'o', destino: 'a', etiqueta: 'pertenece a', multOrigen: '*', multDestino: '?' }], { o: a(0, 0), p: a(300, 200), t: a(650, 0), r: a(650, 250), a: a(0, 400) }), 'T-218 mult objeto/parte y extremos etiquetado');
const rutaFan = fan('XOR');
agregar('rutas', { ...rutaFan, enlaces: Object.fromEntries(Object.values(rutaFan.enlaces).map(e => [e.id, { ...e, ruta: e.id.startsWith('c') ? 'entrada ' + e.id : 'salida ' + e.id }])) }, 'T-219 rutas C/R en ramas, no placeholders');
agregar('duraciones', modelo([{ ...pro('p', 'Esperar'), tipo: 'proceso', duracion: { min: 1, esperada: 3, max: 5 } }, { ...pro('q', 'Guardar'), tipo: 'proceso', duracion: { max: 10, unidad: 'sec' } }, { ...pro('r', 'Despachar'), tipo: 'proceso', duracion: { min: 2, unidad: 'hour' } }]), 'T-220 unidad y cotas parciales bajo nombre');
function hijo(): Modelo { const cs = [pro('p', 'Completar'), pro('q', 'Preparar'), pro('r', 'Revisar'), pro('s', 'Despachar'), { ...obj('o', 'Registro'), estados: [{ id: 'sRegistro', nombre: 'disponible' }] }, obj('i', 'Equipo'), obj('ex', 'Entrada'), obj('sal', 'Salida')]; const child: Opd = { id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q', 'r'], ['s']], objetosInternos: ['o'], apariciones: { p: a(0, 0, 430, 388), q: a(40, 64), r: a(225, 64), s: a(150, 164), o: a(150, 264), i: a(150, -140), ex: a(-260, 140), sal: a(600, 140) } }; return modelo(cs, [{ id: 'ei', tipo: 'instrumento', objeto: 'i', proceso: 'p' }, { id: 'c', tipo: 'consumo', objeto: 'ex', proceso: 'q' }, { id: 'res', tipo: 'resultado', objeto: 'sal', proceso: 's' }, { id: 't', tipo: 'efecto', objeto: 'o', proceso: 'r' }], { p: a(0, 0), ex: a(-260, 0), sal: a(260, 0), i: a(0, -180) }, [child]); }
agregar('bandas-contorno-dr13', hijo(), 'T-221 B-19 bandas e interno; instrumento en contorno sin externo-externo', 'h');
agregar('instancia-valor', modelo([obj('cl', 'Pedido'), obj('in', 'PedidoUno'), { ...obj('at', 'Cantidad'), tipo: 'objeto', valor: '12' }], [{ id: 'c', tipo: 'clasificacion', refinable: 'cl', refinador: 'in' }, { id: 'ex', tipo: 'exhibicion', refinable: 'in', refinador: 'at' }], { cl: a(0, 0), in: a(0, 240), at: a(350, 240) }), 'T-222 T-020 instancia derivada y valor en cápsula');
agregar('refinamiento-y-monocromo', hijo(), 'T-202 T-203 contorno grueso, composición apta para escala gris');
agregar('estados-texto-largo', modelo([{ ...obj('o', 'Documento'), tipo: 'objeto', estados: [{ id: 's', nombre: 'extraordinariamenteextensoconservadointegro' }] }]), 'T-204 T-206 cápsula expandida y texto completo');
agregar('nombres-sin-espacio', modelo([obj('o', 'A'.repeat(60)), pro('p', 'ExtraordinariamenteExtensoConservadoIntegroSinTruncamiento')]), 'T-204 palabra indivisible íntegra en rect y elipse');
const dirs = { n: a(280, 0), s: a(280, 560), w: a(0, 280), e: a(560, 280), p: a(280, 280) };
agregar('extremos-cuatro-direcciones', modelo([obj('n', 'Entrada'), { ...obj('s', 'Operador'), esencia: 'fisica' }, obj('w', 'Equipo'), obj('e', 'Salida'), pro('p')], [{ id: 'enlace-n', tipo: 'consumo', objeto: 'n', proceso: 'p' }, { id: 'enlace-s', tipo: 'agente', objeto: 's', proceso: 'p' }, { id: 'enlace-w', tipo: 'instrumento', objeto: 'w', proceso: 'p' }, { id: 'enlace-e', tipo: 'resultado', objeto: 'e', proceso: 'p' }], dirs), 'T-209 T-210 4 direcciones, marker detrás del borde');
const orientPos = Object.fromEntries(modos.flatMap((_, i) => { const cx = i * 620 + 280, cy = 280; const dx = i === 2 ? 220 : i === 3 ? -220 : 0, dy = i === 0 ? 220 : i === 1 ? -220 : 0; return [['t' + i, a(cx, cy)], ['a' + i, a(cx + dx - (dy ? 100 : 0), cy + dy - (dx ? 100 : 0))], ['b' + i, a(cx + dx + (dy ? 100 : 0), cy + dy + (dx ? 100 : 0))]]; }));
agregar('peines-cuatro-orientaciones', modelo(triCs, triEs, orientPos), 'T-212 manhattan en abajo/arriba/derecha/izquierda');
agregar('etiquetas-largas-opuestas', modelo([obj('a', 'Documento'), obj('b', 'Archivador')], [{ id: 'enlace-e', tipo: 'etiquetadoBidireccional', origen: 'a', destino: 'b', etiqueta: 'permanece cuidadosamente relacionado con', inversa: 'conserva permanentemente su relación inversa con' }], { a: a(0, 0), b: a(680, 200) }), 'T-213 dos textos completos opuestos, bbox tinta');
function escindido(): Modelo { const c = stateObj('o'), p = pro('p', 'Completar'), q = pro('q', 'Preparar'), r = pro('r', 'Finalizar'); return modelo([c, p, q, r], [{ id: 'en', tipo: 'efecto', objeto: 'o', proceso: 'q', entrada: 'on', escision: { par: 'sa', mitad: 'entrada' } }, { id: 'sa', tipo: 'efecto', objeto: 'o', proceso: 'r', salida: 'ol', escision: { par: 'en', mitad: 'salida' } }], { o: a(0, 0), p: a(400, 180) }, [{ id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['r']], objetosInternos: [], apariciones: { p: a(400, 0, 420, 288), q: a(540, 64), r: a(540, 164), o: a(0, 100) } }]); }
agregar('escision-vista-padre', escindido(), 'T-209 T-085 hechos par escindido proyectados TS3');
const col = escindido();
agregar('fan-abstraido-colapsado', { ...col, enlaces: { en: { id: 'en', tipo: 'consumo', objeto: 'o', proceso: 'q' }, sa: { id: 'sa', tipo: 'consumo', objeto: 'o', proceso: 'r' } }, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['en', 'sa'] } } }, 'T-216 T-085 fan colapsado: un hecho, sin arco inventado');
agregar('cruce-con-advertencia', modelo([obj('a', 'Entrada'), obj('b', 'Reserva'), pro('p', 'Procesar'), pro('q', 'Guardar')], [{ id: 'ca', tipo: 'consumo', objeto: 'a', proceso: 'p' }, { id: 'cb', tipo: 'consumo', objeto: 'b', proceso: 'q' }], { a: a(0, 0), b: a(0, 300), p: a(500, 300), q: a(500, 0) }), 'T-284 cruce real, aviso fuera canon');
agregar('expansion-con-solape', modelo([obj('o', 'A'.repeat(60)), pro('p')], [{ id: 'c', tipo: 'consumo', objeto: 'o', proceso: 'p' }], { o: a(0, 0), p: a(140, 0) }), 'T-204 T-284 expansión conserva posiciones y avisa solape');
const mezcla = modelo([...['objeto', 'proceso'].flatMap((tipo, j) => ['fisica', 'informacional'].flatMap((esencia, k) => ['sistemica', 'ambiental'].map((afiliacion, l) => ({ ...((tipo === 'objeto') ? obj('m' + j + k + l, 'Objeto' + String.fromCharCode(65 + k * 2 + l)) : pro('m' + j + k + l, 'Procesar' + String.fromCharCode(65 + k * 2 + l))), esencia, afiliacion } as Cosa)))), estados, ...triCs], triEs);
agregar('vocabulario-en-grises', mezcla, 'T-223 T-203 composición ocho formas, designaciones y triángulos; gris se inspecciona adicionalmente');
const fixtureSelections: {
    fixture: string;
    sd: string;
    profundo: string;
    duplicado: boolean;
}[] = [];
for (const fixture of ['Modelo_Vacio', 'OPM_Structure_Meta_Model', 'OnStar_System', 'SD_Async', 'SD_Sync', 'System_Diagram']) {
    const r = importarV0(readFileSync(new URL(`../../fixtures/v0/${fixture}.json`, import.meta.url), 'utf8'));
    if (!r.ok)
        throw Error(`Fixture ${fixture}: ${JSON.stringify(r.informe.rechazos)}`);
    const ids = opdsEnPreorden(r.modelo), profundo = [...ids].sort((a, b) => etiquetaOpd(r.modelo, b).split('.').length - etiquetaOpd(r.modelo, a).split('.').length || (r.modelo.opds[a]!.tipo === 'raiz' ? 1 : 0) - (r.modelo.opds[b]!.tipo === 'raiz' ? 1 : 0))[0]!;
    fixtureSelections.push({ fixture, sd: r.modelo.raiz, profundo, duplicado: profundo === r.modelo.raiz });
    casos.push({ nombre: `fixture-${fixture}-sd`, m: r.modelo, opd: r.modelo.raiz, oraculo: 'T-223 fixture SD importado real, pérdida declarada por codec', construido: false });
    if (profundo !== r.modelo.raiz)
        casos.push({ nombre: `fixture-${fixture}-profundo`, m: r.modelo, opd: profundo, oraculo: 'T-223 fixture OPD máximo profundo, empate preorden', construido: false });
}
const carpeta = new URL('__golden__/', import.meta.url);
test('T-223 inventario 40 construidos más vistas únicas de 12 selecciones reales', () => {
    expect(casos.filter(c => c.construido)).toHaveLength(40);
    expect(fixtureSelections).toHaveLength(6);
    expect(new Set(casos.map(c => c.nombre)).size).toBe(casos.length);
    for (const c of casos) {
        expect(validarForma(c.m).map(v => ({ caso: c.nombre, ...v }))).toEqual([]);
        if (c.construido)
            expect(erroresContexto(c.m).map(v => ({ caso: c.nombre, ...v }))).toEqual([]);
    }
});
for (const c of casos)
    test(`T-223 golden ${c.nombre}: ${c.oraculo}`, () => {
        const e = escena(c.m, c.opd), svg = aTexto(dibujar(e, 'canon')), ruta = new URL(c.nombre + '.svg', carpeta);
        expect(svg).not.toContain('data-ref');
        expect(svg).not.toContain('#8e2a2e');
        if (process.env.OPFORJA_GOLDEN === 'escribir') {
            mkdirSync(carpeta, { recursive: true });
            writeFileSync(ruta, svg);
        }
        expect(svg).toBe(readFileSync(ruta, 'utf8'));
    });
if (process.env.OPFORJA_GOLDEN === 'escribir')
    test('T-223 recibo scratch de caja y procedencia de cada SVG', () => { const manifest = { construidos: 40, seleccionesFixture: fixtureSelections, unicos: casos.length, casos: casos.map(c => { const e = escena(c.m, c.opd), s = aTexto(dibujar(e, 'canon')); return { nombre: c.nombre, opd: c.opd, etiqueta: etiquetaOpd(c.m, c.opd), caja: e.caja, oraculo: c.oraculo, construido: c.construido, contexto: erroresContexto(c.m), sha256: createHash('sha256').update(s).digest('hex') }; }) }; writeFileSync('/tmp/opforja-rehacer/WP-8b-golden-manifest.json', JSON.stringify(manifest, null, 2)); expect(manifest.unicos).toBeGreaterThanOrEqual(46); });

// B V2: apéndice; los 52 callbacks y 50 SVG anteriores conservan su prefijo.
interface ArchivoB { readonly id: string; readonly grupo: string; readonly sha256: string; readonly jsonOriginal: string }
const archivosB = JSON.parse(readFileSync(new URL('./pruebas/modelos-B-v2.json', import.meta.url), 'utf8')) as readonly ArchivoB[];
const casosB: Caso[] = archivosB.map(f => ({ nombre: 'B-v2-' + f.id, m: JSON.parse(f.jsonOriginal) as Modelo, opd: 'sd', oraculo: `T-206 T-216 ${f.grupo}; entrada SHA ${f.sha256}`, construido: true }));
function baseB(operador: 'XOR' | 'OR', tipo: 'consumo' | 'resultado' = 'consumo'): Modelo {
    const objetos: Objeto = { ...obj('o', 'Registro'), estados: [{ id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }] };
    const m = modelo([objetos, pro('p', 'Preparar'), pro('q', 'Despachar')], [
        { id: 'e1', tipo, objeto: 'o', proceso: 'p', estado: 's1' },
        { id: 'e2', tipo, objeto: 'o', proceso: 'q', estado: 's2' }
    ], { o: a(0, 0, 300, 220), p: a(550, 0, 160, 80), q: a(550, 300, 160, 80) });
    return { ...m, abanicos: { f: { id: 'f', operador, enlaces: ['e1', 'e2'] } } };
}
for (const operador of ['XOR', 'OR'] as const) {
    const m = baseB(operador);
    casosB.push({ nombre: `B-v2-tres-ramas-${operador}`, opd: 'sd', oraculo: 'T-216 tres ramas: dos estados por identidad y tres procesos', construido: true,
        m: { ...m, cosas: { ...m.cosas, r: pro('r', 'Registrar') }, enlaces: { ...m.enlaces, e3: { id: 'e3', tipo: 'consumo', objeto: 'o', proceso: 'r', estado: 's1' } }, abanicos: { f: { ...m.abanicos.f!, enlaces: ['e1', 'e2', 'e3'] } }, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, r: a(550, 600, 160, 80) } } } }
    });
}
{
    const m = baseB('XOR'), w: Objeto = { ...obj('w', 'Factura'), estados: [{ id: 'w1', nombre: 'abierto' }, { id: 'w2', nombre: 'cerrado' }] };
    casosB.push({ nombre: 'B-v2-multiples-fans', opd: 'sd', oraculo: 'T-216 fans XOR y OR distintos sin fusión de pertenencia', construido: true,
        m: { ...m, cosas: { ...m.cosas, w, u: pro('u', 'Facturar'), v: pro('v', 'Cerrar') }, enlaces: { ...m.enlaces, e3: { id: 'e3', tipo: 'consumo', objeto: 'w', proceso: 'u', estado: 'w1' }, e4: { id: 'e4', tipo: 'consumo', objeto: 'w', proceso: 'v', estado: 'w2' } }, abanicos: { ...m.abanicos, g: { id: 'g', operador: 'OR', enlaces: ['e3', 'e4'] } }, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, w: a(900, 0, 300, 220), u: a(1450, 0, 160, 80), v: a(1450, 300, 160, 80) } } } }
    });
}
{
    const m = baseB('OR'), estados = [{ id: 's1', nombre: 'pendiente', inicial: true as const, final: true as const }, { id: 's2', nombre: 'pagado' }, { id: 's3', nombre: 'cerrado' }, { id: 's4', nombre: 'cancelado' }];
    const procesos = ['p', 'q', 'u', 'v', 'w', 'z'], nombres = ['Preparar', 'Despachar', 'Cobrar', 'Liquidar', 'Cerrar', 'Archivar'];
    casosB.push({ nombre: 'B-v2-uniformes-tres-fans-decoracion', opd: 'sd', oraculo: 'T-206 T-207 T-208 T-216 tres fans uniformes, inicial/final/default/current y chip', construido: true,
        m: { ...m, cosas: { o: { ...obj('o', 'Registro'), estados, porDefecto: 's1', current: 's2' }, ...Object.fromEntries(procesos.map((id, i) => [id, pro(id, nombres[i]!)])) }, enlaces: Object.fromEntries(procesos.map((proceso, i) => [`e${i + 1}`, { id: `e${i + 1}`, tipo: 'consumo' as const, objeto: 'o', proceso, estado: `s${Math.floor(i / 2) + 1}` }])), abanicos: Object.fromEntries(['f', 'g', 'h'].map((id, i) => [id, { id, operador: 'OR' as const, enlaces: [`e${2 * i + 1}`, `e${2 * i + 2}`] }])), opds: { sd: { ...m.opds.sd!, apariciones: { o: { ...a(0, 0, 300, 220), ocultos: ['s4'] }, ...Object.fromEntries(procesos.map((id, i) => [id, a(550, -100 + i * 120, 160, 80)])) } } } }
    });
}
for (const tipo of ['consumo', 'resultado'] as const) {
    const m = baseB('OR', tipo);
    const enlaces = Object.fromEntries(Object.entries(m.enlaces).map(([id, e]) => {
        if (e.tipo !== 'consumo' && e.tipo !== 'resultado') throw Error('Fixture C/R');
        return [id, { ...e, ruta: 'principal', mult: '+' as const }];
    }));
    casosB.push({ nombre: `B-v2-anotaciones-segmentos-${tipo}`, opd: 'sd', oraculo: 'T-218 T-219 DS10 y multiplicidad sobre segmentos propios reales', construido: true,
        m: { ...m, enlaces, opds: { sd: { ...m.opds.sd!, apariciones: { ...m.opds.sd!.apariciones, p: a(200, 0, 160, 80) } } } }
    });
}
test('T-223 B V2 inventario 34 modelos portables exactos más seis composiciones', () => {
    expect(archivosB).toHaveLength(34);
    expect(archivosB.filter(f => ['original16', 'degenerado2', 'DS10ruta2'].includes(f.grupo))).toHaveLength(20);
    expect(casosB).toHaveLength(40);
    expect(new Set(casosB.map(c => c.nombre)).size).toBe(40);
    for (const archivo of archivosB) expect(createHash('sha256').update(archivo.jsonOriginal).digest('hex')).toBe(archivo.sha256);
    for (const c of casosB) { expect(validarForma(c.m)).toEqual([]); expect(erroresContexto(c.m)).toEqual([]); }
});
for (const c of casosB) test(`T-223 golden ${c.nombre}: ${c.oraculo}`, () => {
    const previo = JSON.stringify(c.m), e = escena(c.m, c.opd), svg = aTexto(dibujar(e, 'canon')), ruta = new URL(c.nombre + '.svg', carpeta);
    expect(svg).not.toContain('data-ref');
    expect(svg).not.toContain('#8e2a2e');
    if (process.env.OPFORJA_GOLDEN === 'escribir') writeFileSync(ruta, svg);
    expect(svg).toBe(readFileSync(ruta, 'utf8'));
    expect(JSON.stringify(c.m)).toBe(previo);
});
if (process.env.OPFORJA_GOLDEN === 'escribir') test('T-223 B V2 recibo nuevo de caja y modelos, catálogo anterior separado', () => {
    const manifest = casosB.map(c => { const e = escena(c.m, c.opd), svg = aTexto(dibujar(e, 'canon')); return { nombre: c.nombre, opd: c.opd, modelo: c.m, caja: e.caja, oraculo: c.oraculo, sha256: createHash('sha256').update(svg).digest('hex') }; });
    writeFileSync('/tmp/opforja-rehacer/grafica-todas-ramas-escritora/implementacion-uniformes-X/golden-B-v2-manifest-X.json', JSON.stringify(manifest, null, 2) + '\n');
    expect(manifest).toHaveLength(40);
});

// R2: dos contraejemplos exactos de centros ampliados; apéndice nuevo.
const modelosGoldenR2: readonly Modelo[] = [
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
for (const m of modelosGoldenR2) test(`T-223 golden B-v2-R2-centros-efectivos-${m.enlaces.e1!.tipo}: T-206 T-216`, () => {
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]);
    const previo = JSON.stringify(m), e = escena(m, 'sd'), svg = aTexto(dibujar(e, 'canon'));
    const ruta = new URL(`B-v2-R2-centros-efectivos-${m.enlaces.e1!.tipo}.svg`, carpeta);
    if (process.env.OPFORJA_GOLDEN === 'escribir') writeFileSync(ruta, svg);
    expect(svg).toBe(readFileSync(ruta, 'utf8'));
    expect(JSON.stringify(m)).toBe(previo);
});

// APPEND X: datos de los ocho RED de duración y cuatro contenedores nativos.
const datosUniformesX = JSON.parse(readFileSync(new URL('./pruebas/modelos-uniformes-X.json',import.meta.url),'utf8')) as readonly {id:string;opd:string;sha256:string;jsonOriginal:string}[];
for(const dato of datosUniformesX) test(`T-223 golden ${dato.id}: T-206 T-216 X tinta completa`,()=>{
    expect(createHash('sha256').update(dato.jsonOriginal).digest('hex')).toBe(dato.sha256);
    const m=JSON.parse(dato.jsonOriginal) as Modelo; expect(validarForma(m)).toEqual([]);expect(erroresContexto(m)).toEqual([]);
    const previo=JSON.stringify(m),s=escena(m,dato.opd),svg=aTexto(dibujar(s,'canon')),ruta=new URL(`${dato.id}.svg`,carpeta);
    if(process.env.OPFORJA_GOLDEN==='escribir')writeFileSync(ruta,svg);
    expect(svg).toBe(readFileSync(ruta,'utf8'));expect(JSON.stringify(m)).toBe(previo);
});
