import type { Modelo, Id, Aparicion, OpdDescomposicion, OpdDespliegue } from './tipos';
const solapa = (x: number, y: number, t: {
    ancho: number;
    alto: number;
}, a: Aparicion) => x < a.x + a.ancho + 24 && x + t.ancho + 24 > a.x && y < a.y + a.alto + 24 && y + t.alto + 24 > a.y;
export function colocar(m: Modelo, opd: Id, tam: {
    ancho: number;
    alto: number;
}, punto?: {
    x: number;
    y: number;
}): {
    x: number;
    y: number;
} {
    const cajas = Object.values(m.opds[opd]?.apariciones ?? {});
    if (!cajas.length)
        return { x: 0, y: 0 };
    const minX = Math.min(...cajas.map(a => a.x)), maxX = Math.max(...cajas.map(a => a.x + a.ancho)), minY = Math.min(...cajas.map(a => a.y)), maxY = Math.max(...cajas.map(a => a.y + a.alto));
    const p = punto ?? { x: Math.round((minX + maxX - tam.ancho) / 2), y: Math.round((minY + maxY - tam.alto) / 2) };
    const libre = (x: number, y: number) => !cajas.some(a => solapa(x, y, tam, a));
    let intentos = 0;
    for (let radio = 0; intentos < 400; radio++) {
        const puntos: {
            x: number;
            y: number;
        }[] = [];
        for (let dx = -radio; dx <= radio; dx++)
            for (let dy = -radio; dy <= radio; dy++)
                if (Math.max(Math.abs(dx), Math.abs(dy)) === radio)
                    puntos.push({ x: Math.round(p.x) + dx * 20, y: Math.round(p.y) + dy * 20 });
        puntos.sort((a, b) => (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2) || a.y - b.y || a.x - b.x);
        for (const q of puntos) {
            if (intentos++ >= 400)
                break;
            if (libre(q.x, q.y))
                return q;
        }
    }
    return { x: Math.ceil(maxX + 24), y: Math.round(p.y) };
}
export function colocarDescomposicion(m: Modelo, o: OpdDescomposicion): Readonly<Record<Id, Aparicion>> {
    const cajas: {
        [id: Id]: Aparicion;
    } = { ...o.apariciones };
    const origen = o.apariciones[o.cosa] ?? { x: 0, y: 0, ancho: 420, alto: 188 };
    const anchoFila = (ids: readonly Id[]) => ids.reduce((n, id) => n + (cajas[id]?.ancho ?? 135), 0) + Math.max(0, ids.length - 1) * 40;
    const altoFila = (ids: readonly Id[]) => Math.max(0, ...ids.map(id => cajas[id]?.alto ?? 60));
    const ancho = Math.max(420, ...o.bandas.map(b => anchoFila(b) + 80), anchoFila(o.objetosInternos) + 80);
    const pasos = o.bandas.map(b => Math.max(100, altoFila(b) + 40));
    const totalPasos = pasos.reduce((total, paso) => total + paso, 0);
    const reservaInternos = o.objetosInternos.length ? Math.max(100, altoFila(o.objetosInternos) + 40) : 0;
    const alto = 64 + totalPasos + reservaInternos + 24;
    cajas[o.cosa] = { ...origen, ancho, alto };
    const fila = (ids: readonly Id[], y: number) => {
        const anchoFila = ids.reduce((n, id) => n + (cajas[id]?.ancho ?? 135), 0) + Math.max(0, ids.length - 1) * 40;
        let x = origen.x + (ancho - anchoFila) / 2;
        for (const id of ids) {
            const a = cajas[id] ?? { x: 0, y: 0, ancho: 135, alto: 60 };
            cajas[id] = { ...a, x: Math.round(x), y: Math.round(y) };
            x += a.ancho + 40;
        }
    };
    let yBanda = origen.y + 64;
    o.bandas.forEach((b, k) => {
        fila(b, yBanda);
        yBanda += pasos[k]!;
    });
    fila(o.objetosInternos, origen.y + 64 + totalPasos);
    const internos = new Set([o.cosa, ...o.bandas.flat(), ...o.objetosInternos]);
    const grupos = new Map<string, Id[]>();
    for (const id of Object.keys(cajas)) {
        if (internos.has(id))
            continue;
        let grupo = m.cosas[id]?.tipo === 'proceso' ? 'procesos' : 'estructurales';
        for (const e of Object.values(m.enlaces))
            if ('objeto' in e && e.objeto === id && internos.has(e.proceso)) {
                grupo = e.tipo === 'resultado' ? 'salidas' : e.tipo === 'agente' || e.tipo === 'instrumento' ? 'habilitadores' : 'entradas';
                break;
            }
        const g = grupos.get(grupo) ?? [];
        g.push(id);
        grupos.set(grupo, g);
    }
    const finSalidas = origen.y + 64 + (grupos.get('salidas') ?? []).reduce((n, id) => n + Math.max(100, cajas[id]!.alto + 40), 0);
    const yEstructurales = Math.max(origen.y + alto + 80, finSalidas + 40);
    const altoEstructurales = Math.max(0, ...(grupos.get('estructurales') ?? []).map(id => cajas[id]!.alto));
    const yProcesos = Math.max(origen.y + alto + 80, finSalidas + 40, altoEstructurales ? yEstructurales + altoEstructurales + 40 : 0);
    for (const [g, ids] of grupos) {
        ids.sort((a, b) => (m.cosas[a]?.nombre ?? a).localeCompare(m.cosas[b]?.nombre ?? b, 'es'));
        let avance = 0;
        for (const id of ids) {
            const a = cajas[id]!;
            const horizontal = g === 'habilitadores' || g === 'estructurales';
            const x = g === 'entradas' ? origen.x - a.ancho - 80 : horizontal ? origen.x + avance : origen.x + ancho + 80;
            const y = g === 'habilitadores' ? origen.y - a.alto - 80 : g === 'estructurales' ? yEstructurales : g === 'procesos' ? yProcesos + avance : origen.y + 64 + avance;
            cajas[id] = { ...a, x, y };
            avance += horizontal ? a.ancho + 40 : Math.max(100, a.alto + 40);
        }
    }
    return cajas;
}
export function colocarDespliegue(m: Modelo, o: OpdDespliegue): Readonly<Record<Id, Aparicion>> {
    const cajas = { ...o.apariciones };
    const a = cajas[o.cosa] ?? { x: 0, y: 0, ancho: 135, alto: 60 };
    const ids = Object.values(m.enlaces).filter(e => e.tipo === o.modo && 'refinable' in e && e.refinable === o.cosa).flatMap(e => 'refinador' in e ? [e.refinador] : []).sort((x, y) => (m.cosas[x]?.nombre ?? x).localeCompare(m.cosas[y]?.nombre ?? y, 'es'));
    const total = ids.reduce((n, id) => n + (cajas[id]?.ancho ?? 135), 0) + Math.max(0, ids.length - 1) * 40;
    let x = a.x + a.ancho / 2 - total / 2;
    for (const id of ids) {
        const b = cajas[id] ?? { x: 0, y: 0, ancho: 135, alto: 60 };
        cajas[id] = { ...b, x: Math.round(x), y: a.y + 180 };
        x += b.ancho + 40;
    }
    cajas[o.cosa] = a;
    return cajas;
}
