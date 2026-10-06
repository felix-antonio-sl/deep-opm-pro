import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
import type { Cliente } from './cliente';
import type { AlmacenLocal } from './guardado';
export interface Seleccion {
    readonly cosas: readonly Id[];
    readonly estados: readonly Id[];
    readonly enlaces: readonly Id[];
    readonly abanicos: readonly Id[];
    readonly simbolo?: string;
}
export type ModoLienzo = 'edicion' | 'navegacion' | 'gestion-modal' | 'estatico';
export type EstadoGuardado = 'guardado' | 'pendiente' | 'guardando' | 'sin-conexion' | 'conflicto' | 'sesion-vencida' | 'error' | 'eliminado' | 'version-nueva'; // CC-15
export interface Camara {
    readonly x: number;
    readonly y: number;
    readonly zoom: number;
}
export interface Franja {
    readonly tipo: 'ok' | 'rechazo' | 'info';
    readonly texto: string;
    readonly regla?: string;
    readonly accion?: string;
    readonly trazas: readonly Traza[];
}
export interface Paso {
    readonly modelo: Modelo;
    readonly opd: Id;
    readonly seleccion: Seleccion;
    readonly etiqueta: string;
    readonly gesto?: string;
}
export type SolicitudUI = { readonly k: 'buscar' | 'opl' | 'ayuda' | 'crear' | 'renombrar' | 'estado' | 'enlace' | 'multiplicidad' | 'tipo' | 'desplegar' | 'encadenar' | 'refinador' | 'informe' | 'borrador' | 'reingreso' | 'conflicto' | 'salida' | 'descarga' | 'biblioteca' | 'importar' | 'camara'; readonly refs?: readonly Ref[]; readonly tipo?: TipoCosa; readonly texto?: string; readonly informe?: Informe; readonly servidorCambio?: boolean; readonly opcion?: string; readonly gesto?: string };
export interface EstadoEditor {
    readonly solicitud: SolicitudUI | null;
    readonly pantalla: 'acceso' | 'biblioteca' | 'editor';
    readonly modelo: Modelo | null;
    readonly rev: string | null;
    readonly opd: Id;
    readonly seleccion: Seleccion;
    readonly pasado: readonly Paso[];
    readonly futuro: readonly Paso[]; // 200 máx.
    readonly franja: Franja | null;
    readonly guardado: EstadoGuardado;
    readonly modo: ModoLienzo;
    readonly camara: Camara;
    readonly realce: readonly Ref[]; // hover bimodal
    readonly lineasNuevas: readonly string[]; // ids de LineaOpl nuevas o cambiadas (se limpian a los 2 s)
    readonly paneles: {
        readonly arbol: boolean;
        readonly derecha: boolean;
    };
    readonly vista: {
        readonly esencia: OpcionesOpl['esencia'];
        readonly numeracion: boolean;
    }; // sin grilla (CC-04)
}
export interface Editor {
    obtener(): EstadoEditor;
    solicitar(s: SolicitudUI | null): void;
    fijarCamara(c: Camara): void;
    fijarPaneles(p: Partial<EstadoEditor['paneles']>): void;
    fijarVista(v: Partial<EstadoEditor['vista']>): void;
    encuadrar(): void;
    confirmarImportacion(): Promise<void>;
    salirIgualmente(): void;
    suscribir(f: () => void): () => void;
    ejecutar(a: Accion, o?: {
        readonly gesto?: string;
    }): Respuesta<Hecho>; // ÚNICO commit (T-011); mismo gesto ⇒ un paso
    ejecutarVarias(as: readonly Accion[], etiqueta: string): Respuesta<Hecho>; // «Aplicar a los N», reparaciones
    aplicarOpl(plan: Plan): Respuesta<Hecho>;
    deshacer(): void;
    rehacer(): void;
    navegar(opd: Id, o?: {
        readonly seleccionar?: readonly Ref[];
    }): void; // encuadra (DS-22)
    seleccionar(s: Seleccion | ((s: Seleccion) => Seleccion)): void;
    realzar(r: readonly Ref[]): void;
    fijarModo(m: ModoLienzo): void;
    abrir(id: Id): Promise<void>;
    cerrar(): void;
    guardarAhora(): Promise<void>;
    resolverConflicto(o: 'conservar-mios' | 'usar-guardada'): Promise<void>;
    guardarDeNuevo(): Promise<void>; // tras 404: POST con el mismo id o uno nuevo (CC-15)
    resolverBorrador(o: 'recuperar' | 'descartar' | 'descargar'): Promise<void>;
}

export interface Temporizador { programar(f: () => void, ms: number): unknown; cancelar(id: unknown): void; }
declare const __OPFORJA_VERSION__: string;
export const VERSION_BUNDLE = typeof __OPFORJA_VERSION__ === 'string' ? __OPFORJA_VERSION__ : 'local';
import { aplicarAccion, aplicarAcciones } from '../nucleo/operaciones';
import { aplicarPlan } from '../opl/aplicar';
import { generarModelo } from '../opl/generar';
import { importarV0 } from '../codec/importar';
import { exportarV0 } from '../codec/exportar';
import { renombrarModelo } from '../nucleo/modelo';
import { escena } from '../opd/escena';

export function crearEditor(dep: {
    readonly cliente: Cliente; readonly local: AlmacenLocal; readonly reloj?: () => number;
    readonly temporizador?: Temporizador; readonly versionBundle?: string;
    readonly tamano?: () => { ancho: number; alto: number };
}): Editor {
    const ahora = dep.reloj ?? Date.now, timer = dep.temporizador ?? { programar: (f: () => void, ms: number) => setTimeout(f, ms), cancelar: (id: unknown) => clearTimeout(id as ReturnType<typeof setTimeout>) };
    const vacia = (): Seleccion => ({ cosas: [], estados: [], enlaces: [], abanicos: [] });
    let estado: EstadoEditor = { pantalla: 'biblioteca', modelo: null, rev: null, opd: '', seleccion: vacia(), pasado: [], futuro: [], franja: null, guardado: 'guardado', modo: 'edicion', camara: { x: 0, y: 0, zoom: 1 }, realce: [], lineasNuevas: [], paneles: { arbol: true, derecha: true }, vista: { esencia: 'solo-difiere', numeracion: false }, solicitud: null };
    const oyentes = new Set<() => void>();
    const publicar = (cambio: Partial<EstadoEditor>) => { estado = Object.freeze({ ...estado, ...cambio }); for (const f of [...oyentes]) f(); };
    let generacion = 0, cambio = 0, pendiente = false, pausa = false, respaldo = false, conflictoRev: string | null = null;
    let primeraEdicion = 0, ultimaEdicion = 0, ultimoBorrador = -Infinity, espera = 2000, versionNueva = false;
    let auto: unknown, draft: unknown, brillo: unknown, vuelo: Promise<void> | null = null, ultimoGesto: string | undefined;
    let apertura: { id: Id; texto: string; rev: string; modelo: Modelo; informe: Informe; canonical: boolean } | null = null;
    const cancelar = (h: unknown) => { if (h !== undefined) timer.cancelar(h); };
    const limpiarTimers = () => { cancelar(auto); cancelar(draft); cancelar(brillo); auto = draft = brillo = undefined; };
    const version = () => { const v = dep.cliente.versionServidor(); if (v && v !== (dep.versionBundle ?? VERSION_BUNDLE)) versionNueva = true; };
    function error(mensaje: string, estadoGuardado: EstadoGuardado = 'error', informe?: Informe) { publicar({ guardado: estadoGuardado, franja: { tipo: 'rechazo', texto: mensaje, trazas: [] }, ...(informe ? { solicitud: { k: 'informe', informe } } : {}) }); }
    async function escribirBorrador() {
        cancelar(draft); draft = undefined;
        if (!estado.modelo || !pendiente) return;
        const gen = generacion, m = estado.modelo, b = { base: estado.rev, texto: exportarV0(m), fecha: ahora() };
        ultimoBorrador = ahora();
        try { await dep.local.escribir(m.id, b); } catch { /* AlmacenLocal mantiene memoria; no impedir edición. */ }
        if (gen !== generacion) return;
    }
    function programar() {
        cancelar(auto); auto = undefined;
        if (!estado.modelo || !pendiente || pausa || vuelo) return;
        const gen = generacion, ms = Math.max(0, Math.min(ultimaEdicion + 1500, primeraEdicion + 10000) - ahora());
        auto = timer.programar(() => { if (gen === generacion) void guardar(); }, ms);
    }
    function editar() {
        if (!pendiente) primeraEdicion = ahora();
        pendiente = true; cambio++; ultimaEdicion = ahora();
        publicar({ guardado: pausa ? estado.guardado : 'pendiente' });
        if (draft === undefined) {
            const gen = generacion;
            draft = timer.programar(() => { if (gen === generacion) void escribirBorrador(); }, Math.max(0, ultimoBorrador + 500 - ahora()));
        }
        programar();
    }
    const snapshot = (etiqueta: string, gesto?: string): Paso => ({ modelo: estado.modelo!, opd: estado.opd, seleccion: estado.seleccion, etiqueta, ...(gesto ? { gesto } : {}) });
    function encuadrar() {
        if (!estado.modelo || !estado.modelo.opds[estado.opd]) return;
        const caja = escena(estado.modelo, estado.opd).caja, tamaño = dep.tamano?.() ?? { ancho: 800, alto: 600 };
        const zoom = Math.max(.2, Math.min(1, (tamaño.ancho - 48) / Math.max(1, caja.ancho), (tamaño.alto - 48) / Math.max(1, caja.alto)));
        publicar({ camara: { zoom, x: tamaño.ancho / 2 - (caja.x + caja.ancho / 2) * zoom, y: tamaño.alto / 2 - (caja.y + caja.alto / 2) * zoom } });
    }
    function commit(r: Respuesta<Hecho>, etiqueta: string, gesto?: string): Respuesta<Hecho> {
        if (!r.ok) { publicar({ franja: { tipo: 'rechazo', texto: r.rechazo.mensaje, regla: r.rechazo.regla, ...(r.rechazo.accion ? { accion: r.rechazo.accion } : {}), trazas: [] } }); return r; }
        if (r.valor.modelo === estado.modelo) return r;
        const anterior = estado.modelo!, viejo = new Map(generarModelo(anterior).map(l => [l.id, l.texto]));
        const lineasNuevas = generarModelo(r.valor.modelo).filter(l => viejo.get(l.id) !== l.texto).map(l => l.id);
        const pasado = gesto && gesto === ultimoGesto ? estado.pasado : [...estado.pasado, snapshot(etiqueta, gesto)].slice(-200);
        ultimoGesto = gesto;
        publicar({ modelo: r.valor.modelo, pasado, futuro: [], lineasNuevas, opd: r.valor.modelo.opds[estado.opd] ? estado.opd : r.valor.modelo.raiz,
            franja: { tipo: r.trazas.length ? 'info' : 'ok', texto: etiqueta, trazas: r.trazas } });
        cancelar(brillo); const gen = generacion; brillo = timer.programar(() => { if (gen === generacion) publicar({ lineasNuevas: [] }); }, 2000);
        const nuevos = r.valor.creados.filter(id => r.valor.modelo.cosas[id] && !anterior.cosas[id]);
        if (nuevos.length) {
            const nodos = escena(r.valor.modelo,estado.opd).nodos.filter(n=>nuevos.includes(n.ref.id));
            const tamano = dep.tamano?.() ?? {ancho:800,alto:600}; let {x,y,zoom} = estado.camara;
            for (const n of nodos) {
                const izquierda=n.caja.x*zoom+x,derecha=(n.caja.x+n.caja.ancho)*zoom+x,arriba=n.caja.y*zoom+y,abajo=(n.caja.y+n.caja.alto)*zoom+y;
                x += izquierda<0?-izquierda:derecha>tamano.ancho?tamano.ancho-derecha:0;
                y += arriba<0?-arriba:abajo>tamano.alto?tamano.alto-abajo:0;
            }
            if (x!==estado.camara.x||y!==estado.camara.y) publicar({camara:{x,y,zoom}});
        }
        editar(); return r;
    }
    function prohibido(): Respuesta<Hecho> { return { ok: false, rechazo: { codigo: 'contexto', regla: 'producto', mensaje: 'El editor no está en modo edición.', refs: [] } }; }
    function puede(): boolean { return !!estado.modelo && estado.modo === 'edicion'; }
    async function cargar(id: Id) {
        const gen = generacion;
        try {
            const r = await dep.cliente.leer(id); version(); if (gen !== generacion) return;
            if (r === 'no-existe') { error('El modelo ya no existe.', 'eliminado'); return; }
            const i = importarV0(r.texto);
            if (!i.ok) { error('El documento no se puede abrir.', 'error', i.informe); return; }
            const canonical = exportarV0(i.modelo) === r.texto;
            apertura = { id, texto: r.texto, rev: r.rev, modelo: i.modelo, informe: i.informe, canonical };
            if (i.informe.descartado.length) { publicar({ solicitud: { k: 'informe', informe: i.informe }, modo: 'gestion-modal' }); return; }
            await instalarApertura();
        } catch (e) { if (gen === generacion) error(e instanceof Error ? e.message : 'No se pudo abrir el modelo.'); }
    }
    async function instalarApertura() {
        const a = apertura; if (!a) return; apertura = null;
        limpiarTimers(); generacion++; const gen = generacion;
        cambio = 0; pendiente = false; pausa = false; espera = 2000; respaldo = !a.canonical; ultimoGesto = undefined; ultimoBorrador = -Infinity;
        publicar({ pantalla: 'editor', modelo: a.modelo, rev: a.rev, opd: a.modelo.raiz, seleccion: vacia(), pasado: [], futuro: [], realce: [], lineasNuevas: [], franja: a.informe.normalizado.length || a.informe.descartado.length ? { tipo: 'info', texto: 'Documento importado; consulta el informe.', trazas: [] } : null, modo: 'edicion', solicitud: null, guardado: versionNueva ? 'version-nueva' : 'guardado' });
        encuadrar();
        if (!a.canonical) editar();
        const b = await dep.local.leer(a.id).catch(() => null);
        if (gen !== generacion) return;
        if (b && b.texto !== exportarV0(a.modelo)) publicar({ solicitud: { k: 'borrador', servidorCambio: b.base !== a.rev }, modo: 'gestion-modal' });
    }
    async function guardar(): Promise<void> {
        cancelar(auto); auto = undefined;
        if (vuelo) { await vuelo; if (pendiente && !pausa) return guardar(); return; }
        if (!pendiente || !estado.modelo) return;
        const gen = generacion, enviado = estado.modelo, texto = exportarV0(enviado), base = estado.rev, numero = cambio, conRespaldo = respaldo;
        if (!base) { pausa = true; error('El documento aún no tiene revisión de servidor.'); return; }
        publicar({ guardado: 'guardando' });
        vuelo = (async () => {
            try {
                const r = await dep.cliente.guardar(enviado.id, texto, base, conRespaldo ? { respaldo: true } : undefined); version();
                if (gen !== generacion) return;
                if ('conflicto' in r) { conflictoRev = r.conflicto; pausa = true; publicar({ guardado: 'conflicto', modo: 'navegacion', solicitud: { k: 'conflicto' } }); await escribirBorrador(); return; }
                if ('estado' in r) {
                    await escribirBorrador();
                    if (gen !== generacion) return;
                    if (r.estado === 401) { pausa = true; publicar({ guardado: 'sesion-vencida', modo: 'navegacion', solicitud: { k: 'reingreso' } }); }
                    else if (r.estado === 404) { pausa = true; error(r.error, 'eliminado', r.informe); }
                    else if (r.estado >= 500 || r.estado === 0) throw new Error(r.error);
                    else { pausa = true; error(r.error, 'error', r.informe); }
                    return;
                }
                publicar({ rev: r.rev }); respaldo = false; espera = 2000;
                if (r.canonicalizado) {
                    versionNueva = true;
                    const lectura = await dep.cliente.leer(enviado.id); version(); if (gen !== generacion) return;
                    if (lectura === 'no-existe') { pausa = true; error('El documento canonicalizado desapareció.', 'eliminado'); return; }
                    const canon = importarV0(lectura.texto);
                    if (!canon.ok) { pausa = true; error('Documento canonicalizado ilegible.', 'error', canon.informe); return; }
                    publicar({ rev: lectura.rev, ...(cambio === numero ? { modelo: canon.modelo } : {}), ...(r.informe ? { solicitud: { k: 'informe', informe: r.informe } } : {}) });
                }
                if (cambio === numero) {
                    const b = await dep.local.leer(enviado.id).catch(() => null);
                    if (gen !== generacion) return;
                    if (cambio === numero && b && b.texto === texto) await dep.local.borrar(enviado.id).catch(() => {});
                    if (gen !== generacion) return;
                    if (cambio === numero) { pendiente = false; publicar({ guardado: versionNueva ? 'version-nueva' : 'guardado', modo: 'edicion' }); }
                    else { await escribirBorrador(); if (gen !== generacion) return; primeraEdicion = ultimaEdicion; publicar({ guardado: 'pendiente' }); }
                } else { await escribirBorrador(); if (gen !== generacion) return; primeraEdicion = ultimaEdicion; publicar({ guardado: 'pendiente' }); }
            } catch {
                if (gen !== generacion) return;
                await escribirBorrador(); if (gen !== generacion) return; publicar({ guardado: 'sin-conexion' });
                const ms = espera; espera = Math.min(60000, espera * 2);
                auto = timer.programar(() => { if (gen === generacion) void guardar(); }, ms);
            } finally {
                vuelo = null;
                if (pendiente && !pausa && estado.guardado !== 'sin-conexion') programar();
            }
        })();
        await vuelo;
    }
    async function salir(continuar: () => void) {
        const gen = generacion;
        await escribirBorrador(); if (gen !== generacion) return false;
        await guardar(); if (gen !== generacion) return false;
        if (pendiente) { publicar({ solicitud: { k: 'salida' } }); return false; }
        continuar(); return true;
    }
    const editor: Editor = {
        obtener: () => estado, suscribir(f) { oyentes.add(f); return () => { oyentes.delete(f); }; },
        solicitar: solicitud => publicar({ solicitud }),
        fijarCamara: camara => publicar({ camara: { ...camara, zoom: Math.max(.2, Math.min(3, camara.zoom)) } }),
        fijarPaneles: p => publicar({ paneles: { ...estado.paneles, ...p } }),
        fijarVista: v => publicar({ vista: { ...estado.vista, ...v } }), encuadrar,
        ejecutar(a, o) { return puede() ? commit(aplicarAccion(estado.modelo!, a), a.op, o?.gesto) : prohibido(); },
        ejecutarVarias(as, etiqueta) { return puede() ? commit(aplicarAcciones(estado.modelo!, as), etiqueta) : prohibido(); },
        aplicarOpl(plan) { return puede() ? commit(aplicarPlan(estado.modelo!, plan), 'Aplicar OPL') : prohibido(); },
        deshacer() { const p = estado.pasado.at(-1); if (!p || !puede()) return; const actual = snapshot(p.etiqueta), anteriorOpd=estado.opd; publicar({ modelo: p.modelo, opd: p.opd, seleccion: p.seleccion, pasado: estado.pasado.slice(0, -1), futuro: [...estado.futuro, actual].slice(-200), lineasNuevas: [] }); ultimoGesto = undefined; if (anteriorOpd !== p.opd) encuadrar(); editar(); },
        rehacer() { const p = estado.futuro.at(-1); if (!p || !puede()) return; const actual = snapshot(p.etiqueta), anteriorOpd=estado.opd; publicar({ modelo: p.modelo, opd: p.opd, seleccion: p.seleccion, pasado: [...estado.pasado, actual].slice(-200), futuro: estado.futuro.slice(0, -1), lineasNuevas: [] }); ultimoGesto = undefined; if (anteriorOpd !== p.opd) encuadrar(); editar(); },
        navegar(opd, o) { if (!estado.modelo?.opds[opd]) return; publicar({ opd, seleccion: o?.seleccionar ? { cosas: o.seleccionar.filter(r => r.tipo === 'cosa').map(r => r.id), estados: o.seleccionar.filter(r => r.tipo === 'estado').map(r => r.id), enlaces: o.seleccionar.filter(r => r.tipo === 'enlace').map(r => r.id), abanicos: o.seleccionar.filter(r => r.tipo === 'abanico').map(r => r.id) } : vacia() }); encuadrar(); },
        seleccionar: s => publicar({ seleccion: typeof s === 'function' ? s(estado.seleccion) : s }),
        realzar: realce => publicar({ realce }), fijarModo: modo => publicar({ modo }),
        async abrir(id) { if (estado.modelo && !(await salir(() => {}))) return; generacion++; await cargar(id); },
        cerrar() { void salir(() => editor.salirIgualmente()); },
        salirIgualmente() { void escribirBorrador(); limpiarTimers(); generacion++; pendiente = false; pausa = false; publicar({ pantalla: 'biblioteca', modelo: null, rev: null, opd: '', pasado: [], futuro: [], seleccion: vacia(), solicitud: null }); },
        confirmarImportacion: instalarApertura,
        async guardarAhora() { if (estado.guardado === 'sesion-vencida' || estado.guardado === 'error' || estado.guardado === 'sin-conexion') { pausa = false; publicar({ modo: 'edicion', solicitud: null }); } await guardar(); },
        async resolverConflicto(o) {
            if (!estado.modelo || !conflictoRev) return;
            if (o === 'conservar-mios') { publicar({ rev: conflictoRev, modo: 'edicion', solicitud: null }); pausa = false; respaldo = true; await guardar(); }
            else {
                const m = estado.modelo, gen = generacion, numero = cambio, hora = new Date(ahora()), sufijo = `${String(hora.getHours()).padStart(2, '0')}:${String(hora.getMinutes()).padStart(2, '0')}`;
                const nombre = `${m.nombre} (copia ${sufijo})`, ren = renombrarModelo(m, { nombre });
                if (!ren.ok) { error(ren.rechazo.mensaje); return; }
                const copia = { ...ren.valor.modelo, id: nuevoId() }, r = await dep.cliente.crear(exportarV0(copia)); version();
                if (gen !== generacion) return;
                if ('estado' in r) { error(r.error, 'conflicto', r.informe); return; }
                if (numero !== cambio) { error('Hubo cambios mientras se creó la copia.', 'conflicto'); return; }
                pendiente = false; await dep.local.borrar(m.id).catch(() => {}); if (gen !== generacion) return; await cargar(m.id);
            }
        },
        async guardarDeNuevo() {
            if (!estado.modelo) return;
            const m = estado.modelo, numero = cambio, gen = generacion;
            let copia = m, r = await dep.cliente.crear(exportarV0(copia));
            if ('estado' in r && r.estado === 409) { copia = { ...m, id: nuevoId() }; r = await dep.cliente.crear(exportarV0(copia)); }
            version(); if (gen !== generacion) return;
            if ('estado' in r) { error(r.error, 'error', r.informe); return; }
            publicar({ modelo: { ...estado.modelo!, id: r.id }, rev: r.rev, guardado: versionNueva ? 'version-nueva' : 'guardado', modo: 'edicion', solicitud: null }); pausa = false;
            if (r.canonicalizado) {
                versionNueva = true; const lectura = await dep.cliente.leer(r.id); version(); if (gen !== generacion) return;
                if (lectura === 'no-existe') { pausa = true; error('El documento canonicalizado desapareció.', 'eliminado'); return; }
                const canon = importarV0(lectura.texto);
                if (!canon.ok) { pausa = true; error('Documento canonicalizado ilegible.', 'error', canon.informe); return; }
                publicar({ rev: lectura.rev, ...(numero === cambio ? { modelo: canon.modelo } : {}), ...(r.informe ? { solicitud: { k: 'informe', informe: r.informe } } : {}) });
            }
            if (numero === cambio) {
                await dep.local.borrar(m.id).catch(() => {}); if (gen !== generacion) return;
                if (numero === cambio) pendiente = false;
                else { await escribirBorrador(); if (gen !== generacion) return; publicar({guardado:'pendiente'}); programar(); }
            } else { await escribirBorrador(); if (gen !== generacion) return; publicar({guardado:'pendiente'}); programar(); }
        },
        async resolverBorrador(o) {
            const m = estado.modelo; if (!m) return; const gen = generacion, b = await dep.local.leer(m.id); if (!b || gen !== generacion) return;
            if (o === 'descargar') { publicar({ solicitud: { k: 'descarga', texto: b.texto } }); return; }
            if (o === 'descartar') { await dep.local.borrar(m.id); if (gen !== generacion) return; publicar({ solicitud: null, modo: 'edicion' }); return; }
            const i = importarV0(b.texto); if (!i.ok || i.informe.descartado.length) { publicar({ solicitud: { k: 'informe', informe: i.informe } }); return; }
            if (i.modelo.id !== m.id) { error('El borrador pertenece a otro modelo.'); return; }
            respaldo = b.base !== estado.rev; pausa = false; publicar({ modelo: i.modelo, modo: 'edicion', solicitud: null }); editar(); if (respaldo) await guardar();
        },
    };
    return editor;
}
let secuenciaCopias = 0;
function nuevoId(): Id { return `m-${Date.now().toString(36)}-${(++secuenciaCopias).toString(36)}`; }
