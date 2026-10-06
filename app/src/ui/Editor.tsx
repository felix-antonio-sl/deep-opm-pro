import type { ComponentType } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Editor as Controlador, EstadoEditor } from '../editor/estado';
import { VERSION_BUNDLE } from '../editor/estado';
import { COMANDOS } from '../editor/comandos';
import { despacharAtajo } from '../editor/atajos';
import { diagnosticar, gatesExportacion } from '../nucleo/diagnostico';
import { etiquetaOpd, opdsEnPreorden } from '../nucleo/proyeccion';
import { exportarV0 } from '../codec/exportar';
import { generarDocumentoOpl } from '../opl/documento';
import { generarBloque } from '../opl/generar';
import { exportarDiagrama, exportarDocumento } from '../opd/exportar';
import { Franja } from './Franja';
import { Dialogo, LimitePanel } from './Dialogo';
import { descargarTexto } from './Biblioteca';
export interface DatosRanura { readonly editor: Controlador; readonly estado: EstadoEditor }
export interface RanurasEditor { readonly lienzo?: ComponentType<DatosRanura>; readonly arbol?: ComponentType<DatosRanura>; readonly propiedades?: ComponentType<DatosRanura>; readonly opl?: ComponentType<DatosRanura>; readonly diagnostico?: ComponentType<DatosRanura>; readonly solicitud?: ComponentType<DatosRanura> }
const GUARDADO = { guardado: 'Guardado', pendiente: 'Cambios sin guardar', guardando: 'Guardando…', 'sin-conexion': 'Sin conexión', conflicto: 'Conflicto', 'sesion-vencida': 'Sesión vencida', error: 'No se pudo guardar', eliminado: 'Eliminado en otra sesión', 'version-nueva': 'Versión nueva: recarga' };
const titulos = { lienzo: 'Lienzo', arbol: 'OPDs', propiedades: 'Propiedades', opl: 'OPL', diagnostico: 'Diagnóstico' };
export function Editor(p: { editor: Controlador; estado: EstadoEditor; salir: () => void; ranuras?: RanurasEditor }) {
    const [zona, cambiar] = useState<keyof typeof titulos>('lienzo'), [menu, exportacion] = useState(false), [error, fallar] = useState(''), [renombre, renombrar] = useState(false), [nombre, nombrar] = useState('');
    const [ancho, anchura] = useState(() => { try { return Math.max(280, Math.min(700, Number(localStorage.getItem('opforja.columna')) || 400)); } catch { return 400; } }), derecha = useRef<HTMLElement>(null);
    const m = p.estado.modelo!, ds = diagnosticar(m), bloqueos = ds.filter(d => d.severidad === 'error').length, avisos = ds.filter(d => d.severidad === 'warning').length;
    const comando = (id: string) => COMANDOS.find(c => c.id === id)!;
    const boton = (id: string, texto?: string) => { const c = comando(id), razon = c.disponible(p.estado); return <button title={razon === true ? c.atajo : razon} disabled={razon !== true} onClick={() => c.ejecutar(p.editor)}>{texto ?? c.titulo}</button>; };
    useEffect(() => {
        const tecla = (e: KeyboardEvent) => {
            const target = e.target instanceof HTMLElement ? e.target : null;
            if (e.defaultPrevented || target?.closest('dialog')) return;
            const editable = !!target?.matches('input,textarea,select,[contenteditable=true]');
            if (despacharAtajo(p.editor, 'global', { key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey, altKey: e.altKey, editable, isComposing: e.isComposing })) e.preventDefault();
        };
        window.addEventListener('keydown', tecla); return () => window.removeEventListener('keydown', tecla);
    }, [p.editor]);
    useEffect(() => { const f = (e: BeforeUnloadEvent) => { if (p.estado.guardado !== 'guardado' && p.estado.guardado !== 'version-nueva') { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', f); return () => window.removeEventListener('beforeunload', f); }, [p.estado.guardado]);
    function ranura(k: keyof typeof titulos) { const R = p.ranuras?.[k]; return R ? <LimitePanel key={`${k}-${p.estado.opd}`} nombre={titulos[k]} opd={p.estado.opd}><R editor={p.editor} estado={p.estado} /></LimitePanel> : <div class="ranura-pendiente"><h2>{titulos[k]}</h2>{k === 'lienzo' && !Object.keys(m.cosas).length && <p>El modelo está vacío.</p>}</div>; }
    const ruta: string[] = []; let actual = p.estado.opd;
    while (m.opds[actual]) { ruta.unshift(actual); const o = m.opds[actual]!; if (o.tipo === 'raiz') break; actual = o.padre; }
    const nombreOpd = (id: string) => { const o = m.opds[id]!; return o.tipo === 'raiz' ? m.nombre : m.cosas[o.cosa]?.nombre ?? ''; };
    const gateSvg = gatesExportacion(m, { opd: p.estado.opd }), gateHtml = gatesExportacion(m, 'modelo');
    function svg() { const r = exportarDiagrama(m, p.estado.opd, { version: VERSION_BUNDLE }); if (r.ok) descargarTexto(r.valor.svg, r.valor.archivo, 'image/svg+xml'); else fallar(r.rechazo.mensaje); }
    function html() { const lineas = new Map(opdsEnPreorden(m).map(id => [id, generarBloque(m, id)])), r = exportarDocumento(m, lineas, { version: VERSION_BUNDLE }); if (r.ok) descargarTexto(r.valor.html, r.valor.archivo, 'text/html'); else fallar(r.rechazo.mensaje); }
    function resize(e: PointerEvent) { if (!derecha.current) return; const inicio = e.clientX, base = ancho, limite = Math.min(700, window.innerWidth * .5);
        const mover = (v: PointerEvent) => anchura(Math.max(280, Math.min(limite, base + inicio - v.clientX)));
        const fin = () => { window.removeEventListener('pointermove', mover); window.removeEventListener('pointerup', fin); };
        window.addEventListener('pointermove', mover); window.addEventListener('pointerup', fin);
    }
    useEffect(() => { try { localStorage.setItem('opforja.columna', String(ancho)); } catch { /* preferencia prescindible */ } }, [ancho]);
    return <div class="editor">
        <header class="editor-cabecera"><button aria-label="Volver a la Biblioteca" onClick={() => p.editor.cerrar()}>≡</button><button class="nombre-modelo" disabled={p.estado.modo !== 'edicion'} title={p.estado.modo !== 'edicion' ? 'El modelo está en modo navegación.' : 'Renombrar modelo'} onClick={() => { nombrar(m.nombre); renombrar(true); }}>{m.nombre} <span>✎</span></button>
        <nav aria-label="Ruta de OPD">{ruta.map((id, i) => <span class="paso-ruta">{i > 0 && <span aria-hidden="true">›</span>}<button onClick={() => p.editor.navegar(id)} aria-current={id === p.estado.opd ? 'page' : undefined}>{etiquetaOpd(m, id)} <span class="rotulo-ruta">{nombreOpd(id)}</span></button></span>)}<select aria-label="OPD activo" value={p.estado.opd} onChange={e => p.editor.navegar(e.currentTarget.value)}>{opdsEnPreorden(m).map(id => <option value={id}>{etiquetaOpd(m, id)}</option>)}</select></nav>
        <div class="indicador-guardado" role="status">{GUARDADO[p.estado.guardado]}{p.estado.guardado === 'version-nueva' && <button onClick={() => { void p.editor.guardarAhora().then(() => location.reload()); }}>Recargar</button>}</div>
        <div class="acciones-editor"><button onClick={() => { p.editor.fijarPaneles({ derecha: true }); cambiar('diagnostico'); }}>{bloqueos} bloqueos · {avisos} avisos</button>{boton('deshacer', '↶')}{boton('rehacer', '↷')}<button onClick={() => exportacion(!menu)}>Exportar ▾</button>{boton('ayuda', '?')}<button onClick={p.salir}>Salir</button></div>
        <details class="acciones-estrechas"><summary aria-label="Más acciones">⋯</summary>{boton('guardar')}{boton('deshacer')}{boton('rehacer')}<button onClick={() => exportacion(true)}>Exportar</button>{boton('ayuda')}<button onClick={p.salir}>Salir</button></details></header>
        <div class="editor-zonas" style={{ '--columna': `${ancho}px` }}>
        <aside class={`arbol ${p.estado.paneles.arbol ? 'abierto' : 'plegado'} ${zona === 'arbol' ? 'zona-activa' : ''}`} aria-label="Árbol de OPDs">{boton('arbol', p.estado.paneles.arbol ? '‹ OPDs' : '›')}{p.estado.paneles.arbol && ranura('arbol')}</aside>
        <main class={`zona-lienzo ${zona === 'lienzo' ? 'zona-activa' : ''}`} aria-label="Lienzo"><div class="contenido-lienzo">{ranura('lienzo')}</div><Franja estado={p.estado} deshacer={() => p.editor.deshacer()} /></main>
        {p.estado.paneles.derecha && <aside ref={derecha} class={`columna-derecha ${!p.estado.paneles.derecha ? 'oculta' : ''} ${zona !== 'lienzo' && zona !== 'arbol' ? 'zona-activa' : ''}`} aria-label="Propiedades y OPL">
        <div class="divisor" role="separator" aria-label="Ancho de columna" aria-valuenow={ancho} aria-valuemin={280} aria-valuemax={700} tabIndex={0} onPointerDown={resize} onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); anchura(Math.max(280, Math.min(700, ancho + (e.key === 'ArrowLeft' ? 20 : -20)))); } }} />
        <section class={`zona-propiedades ${zona === 'propiedades' ? 'zona-activa' : ''}`}>{ranura('propiedades')}</section>
        <div class="pestanas" role="tablist" aria-label="Contenido de columna"><button role="tab" aria-selected={zona !== 'diagnostico'} onClick={() => cambiar('opl')}>OPL</button><button role="tab" aria-selected={zona === 'diagnostico'} onClick={() => { p.editor.fijarPaneles({ derecha: true }); cambiar('diagnostico'); }}>Diagnóstico {ds.length}</button>{boton('columna', 'Plegar')}</div>
        <section class="zona-panel">{ranura(zona === 'diagnostico' ? 'diagnostico' : 'opl')}</section></aside>}</div>
        <nav class="navegacion-estrecha" aria-label="Zonas del editor">{Object.entries(titulos).map(([id, texto]) => <button aria-pressed={zona === id} onClick={() => { cambiar(id as keyof typeof titulos); p.editor.fijarPaneles({ arbol: true, derecha: true }); }}>{texto}{id === 'diagnostico' ? ` ${ds.length}` : ''}</button>)}</nav>
        {renombre && <Dialogo titulo="Renombrar modelo" cerrar={() => renombrar(false)}><form onSubmit={e => { e.preventDefault(); const r = p.editor.ejecutarVarias([{ op: 'renombrarModelo', args: { nombre } }], 'Modelo renombrado'); if (r.ok) renombrar(false); }}><label>Nombre del modelo<input autoFocus required value={nombre} onInput={e => nombrar(e.currentTarget.value)} /></label><button>Guardar nombre</button></form></Dialogo>}
        {menu && <Dialogo titulo="Exportar" cerrar={() => { exportacion(false); fallar(''); }}><p>Instantánea del estado actual. Los controles del editor quedan fuera de la exportación.</p><div class="exportaciones"><button onClick={() => descargarTexto(exportarV0(m), `${m.nombre}.opforja.json`)}>Modelo JSON</button><button onClick={() => descargarTexto(generarDocumentoOpl(m), `${m.nombre}.md`, 'text/markdown')}>Documento OPL</button><button disabled={!!gateSvg.length} onClick={svg}>OPD SVG · canon-diagrama</button>{gateSvg[0] && <p>{gateSvg[0].regla}: {gateSvg[0].mensaje} <button onClick={() => { exportacion(false); p.editor.navegar(p.estado.opd, { seleccionar: gateSvg[0]!.refs }); cambiar('diagnostico'); }}>Ir</button></p>}<button disabled={!!gateHtml.length} onClick={html}>Documento HTML · canon-documento</button>{gateHtml[0] && <p>{gateHtml[0].regla}: {gateHtml[0].mensaje}</p>}</div>{error && <p role="alert">{error}</p>}</Dialogo>}
    </div>;
}
