import { useEffect, useRef, useState } from 'preact/hooks';
import type { Cliente, FilaModelo, FilaPapelera } from '../editor/cliente';
import type { AlmacenLocal } from '../editor/guardado';
import type { Editor } from '../editor/estado';
import { crearModelo, renombrarModelo } from '../nucleo/modelo';
import { importarV0 } from '../codec/importar';
import { exportarV0 } from '../codec/exportar';
import type { Informe, ResultadoImport } from '../codec/informe';
import { importarOpl } from '../opl/documento';
import { diagnosticar } from '../nucleo/diagnostico';
import { aplicarAcciones } from '../nucleo/operaciones';
import { despacharAtajo } from '../editor/atajos';
import { Dialogo } from './Dialogo';
import { InformeImportacion } from './InformeImportacion';
export function descargarTexto(texto: string, nombre: string, tipo = 'application/json') {
    descargarArchivo(new Blob([texto], { type: tipo }), nombre);
}
export function descargarArchivo(archivo: Blob, nombre: string) {
    const url = URL.createObjectURL(archivo), a = document.createElement('a');
    a.href = url; a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function prepararImportacion(nombre: string, original: string): { original: string; resultado: ResultadoImport } {
    let resultado: ResultadoImport;
    if (/\.(md|txt)$/i.test(nombre)) {
        const r = importarOpl(nombre.replace(/\.[^.]+$/, '') || 'Importado', original);
        resultado = r.ok ? { ok: true, modelo: r.valor.modelo, informe: { normalizado: [], descartado: [], ignorado: {}, rechazos: [], visibilidad: [] } } : { ok: false, informe: { normalizado: [], descartado: [], ignorado: {}, visibilidad: [], rechazos: [{ ruta: 'OPL', mensaje: r.rechazo.mensaje, regla: r.rechazo.regla ?? r.rechazo.codigo }] } };
    } else resultado = importarV0(original);
    if (resultado.ok) resultado = { ...resultado, modelo: { ...resultado.modelo, id: `m-${crypto.randomUUID()}` } };
    return { original, resultado };
}
export function prepararArchivo(nombre: string, bytes: Uint8Array): ReturnType<typeof prepararImportacion> & { archivo: Blob } {
    const archivo = new Blob([bytes.slice().buffer], { type: 'application/octet-stream' });
    try {
        const original = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
        return { ...prepararImportacion(nombre, original), archivo };
    } catch {
        return { original: '', archivo, resultado: { ok: false, informe: { normalizado: [], descartado: [], ignorado: {}, visibilidad: [], rechazos: [{ ruta: 'archivo', mensaje: 'El archivo no es texto UTF-8 legible. Puedes descargar el original sin cambios.', regla: 'UTF-8' }] } } };
    }
}
export async function renombrarFila(cliente: Pick<Cliente, 'leer' | 'guardar'>, id: string, nombre: string): Promise<{ ok: boolean; error?: string; informe?: Informe }> {
    const d = await cliente.leer(id); if (d === 'no-existe') return { ok: false, error: 'El modelo ya no existe.' };
    const i = importarV0(d.texto); if (!i.ok || i.informe.descartado.length) return { ok: false, error: 'No se renombró: revisa el informe al abrir el modelo.', informe: i.informe };
    const r = renombrarModelo(i.modelo, { nombre }); if (!r.ok) return { ok: false, error: r.rechazo.mensaje };
    const g = await cliente.guardar(id, exportarV0(r.valor.modelo), d.rev, ...(exportarV0(i.modelo) !== d.texto ? [{ respaldo: true as const }] : []));
    return 'conflicto' in g ? { ok: false, error: 'Conflicto: otro cambio guardado. Refresca antes de renombrar.' } : 'estado' in g ? { ok: false, error: g.error, ...(g.informe ? { informe: g.informe } : {}) } : { ok: true, ...(g.informe ? { informe: g.informe } : {}) };
}
export function modificacionRelativa(fecha: string, ahora = Date.now()): string {
    const minutos = Math.max(0, Math.floor((ahora - Date.parse(fecha)) / 60000));
    if (!Number.isFinite(minutos)) return 'fecha no disponible';
    if (!minutos) return 'hace menos de un minuto';
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60); return horas < 24 ? `hace ${horas} h` : `hace ${Math.floor(horas / 24)} días`;
}
const mensaje = (e: unknown) => typeof e === 'object' && e && 'error' in e ? String(e.error) : 'No se pudo conectar. Reintenta.';
export function Biblioteca(p: { cliente: Cliente; local: AlmacenLocal; editor: Editor; email: string; salir: () => void; sesionVencida: () => void; informeCreado: (dato: { informe: Informe; anterior?: Informe; original?: string; archivo?: Blob }) => void }) {
    const [filas, lista] = useState<readonly FilaModelo[]>([]), [papelera, basura] = useState<readonly FilaPapelera[]>([]), [borradores, drafts] = useState<readonly string[]>([]);
    const [error, fallar] = useState(''), [cargando, cargar] = useState(true), [ocupado, ocupar] = useState(false), [filtro, filtrar] = useState(''), [seleccion, seleccionar] = useState<string | null>(null);
    const [nombre, nombrar] = useState(''), [edicion, editar] = useState<'nuevo' | string | null>(null), [decision, decidir] = useState<{ texto: string; hacer: () => Promise<void> } | null>(null);
    const [importacion, importar] = useState<(ReturnType<typeof prepararImportacion> & { archivo?: Blob }) | null>(null), [informe, mostrar] = useState<Informe | null>(null), input = useRef<HTMLInputElement>(null), buscar = useRef<HTMLInputElement>(null);
    async function refrescar() { cargar(true); try { const [f, b, ids] = await Promise.all([p.cliente.listar(), p.cliente.papelera(), p.local.ids()]); lista(f); basura(b); drafts(ids); } catch (e) { fallar(mensaje(e)); if (typeof e === 'object' && e && 'estado' in e && e.estado === 401) p.sesionVencida(); } finally { cargar(false); } }
    useEffect(() => { void refrescar(); }, []);
    function editarNombre(id: string) { editar(id); nombrar(id === 'nuevo' ? '' : filas.find(f => f.id === id)?.nombre ?? ''); }
    const visibles = filas.filter(f => f.nombre.toLocaleLowerCase('es').includes(filtro.toLocaleLowerCase('es')));
    useEffect(() => p.editor.suscribir(() => {
        const s = p.editor.obtener().solicitud; if (!s || (s.k !== 'biblioteca' && s.k !== 'importar')) return;
        p.editor.solicitar(null);
        if (s.k === 'importar') input.current?.click();
        else if (s.opcion === 'buscar') buscar.current?.focus();
        else if (s.opcion === 'nuevo') editarNombre('nuevo');
        else if (s.opcion === 'renombrar' && seleccion) editarNombre(seleccion);
        else if (s.opcion === 'abrir' && seleccion) void p.editor.abrir(seleccion);
        else if (s.opcion === 'eliminar' && seleccion) eliminar(seleccion);
        else if (s.opcion === 'anterior' || s.opcion === 'siguiente') { const n = visibles.findIndex(f => f.id === seleccion), delta = s.opcion === 'anterior' ? -1 : 1; seleccionar(visibles[Math.max(0, Math.min(visibles.length - 1, n + delta))]?.id ?? null); }
    }), [filas, filtro, seleccion]);
    async function ejecutar(hacer: () => Promise<void>) { if (ocupado) return; ocupar(true); fallar(''); try { await hacer(); } catch (e) { fallar(mensaje(e)); if (typeof e === 'object' && e && 'estado' in e && e.estado === 401) p.sesionVencida(); } finally { ocupar(false); } }
    function eliminar(id: string) { const f = filas.find(f => f.id === id); if (f) decidir({ texto: `Mover ${f.nombre} a la papelera (se conserva 30 días)`, hacer: async () => { await p.cliente.eliminar(id); decidir(null); await refrescar(); } }); }
    async function guardarNombre(e: Event) { e.preventDefault(); await ejecutar(async () => {
        if (edicion === 'nuevo') { const m = crearModelo({ id: `m-${crypto.randomUUID()}`, nombre }), r = await p.cliente.crear(exportarV0(m)); if ('estado' in r) { fallar(r.error); if (r.informe) mostrar(r.informe); return; } editar(null); await p.editor.abrir(r.id); if (r.informe) p.informeCreado({ informe: r.informe }); }
        else if (edicion) { const r = await renombrarFila(p.cliente, edicion, nombre); if (!r.ok) { fallar(r.error ?? 'No se pudo renombrar.'); if (r.informe) mostrar(r.informe); return; } editar(null); if (r.informe) mostrar(r.informe); await refrescar(); }
    }); }
    async function archivo(f: File) { await ejecutar(async () => { importar(prepararArchivo(f.name, new Uint8Array(await f.arrayBuffer()))); }); }
    async function crearImportado(reparar: boolean) { await ejecutar(async () => {
        if (!importacion?.resultado.ok) return; let m = importacion.resultado.modelo;
        if (reparar) { const as = diagnosticar(m).flatMap(d => d.reparacion ? [d.reparacion] : []), r = aplicarAcciones(m, as); if (!r.ok) { fallar(r.rechazo.mensaje); return; } m = r.valor.modelo; }
        const r = await p.cliente.crear(exportarV0(m)); if ('estado' in r) { fallar(r.error); if (r.informe) mostrar(r.informe); return; }
        const anterior = importacion.resultado.informe, original = importacion.original, archivo = importacion.archivo; importar(null); await p.editor.abrir(r.id); if (r.informe) p.informeCreado({ informe: r.informe, anterior, original, ...(archivo ? { archivo } : {}) });
    }); }
    async function restaurar(entrada: string) { await ejecutar(async () => {
        try { const r = await p.cliente.restaurar(entrada); if ('estado' in r) { fallar(r.error); if (r.informe) mostrar(r.informe); return; } if (r.informe) mostrar(r.informe); }
        catch (e) { fallar(mensaje(e)); if (typeof e === 'object' && e && 'estado' in e && e.estado === 401) p.sesionVencida(); } finally { await refrescar(); } // nunca repite POST: pudo instalarse antes del fallo de respuesta
    }); }
    return <main class="biblioteca" onKeyDown={e => { if (despacharAtajo(p.editor, 'biblioteca', { ...e, key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey, altKey: e.altKey, editable: (e.target as HTMLElement).matches('input,textarea,select'), isComposing: e.isComposing })) e.preventDefault(); }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer?.files[0]; if (f) void archivo(f); }}>
        <header class="biblioteca-cabecera"><div class="marca">opforja</div><span>{p.email}</span><button onClick={p.salir}>Salir</button></header>
        <section class="biblioteca-lista"><div class="titulo-acciones"><div><p class="sobrelinea">TU ESPACIO DE TRABAJO</p><h1>Biblioteca</h1></div><div><button onClick={() => input.current?.click()} disabled={ocupado}>Importar</button><button class="primario" onClick={() => editarNombre('nuevo')} disabled={ocupado}>Nuevo</button></div></div>
        <input hidden type="file" accept=".json,.md,.txt" ref={input} onChange={e => { const f = e.currentTarget.files?.[0]; if (f) void archivo(f); e.currentTarget.value = ''; }} />
        <label class="filtro">Buscar modelo<input type="search" ref={buscar} value={filtro} onInput={e => filtrar(e.currentTarget.value)} placeholder="Filtrar por nombre" /></label>
        {error && <p role="alert" class="mensaje-error">{error} <button onClick={() => { fallar(''); void refrescar(); }}>Refrescar</button></p>}
        {edicion === 'nuevo' && <form class="nuevo" onSubmit={e => { void guardarNombre(e); }}><label>Nombre del modelo<input autoFocus required value={nombre} onInput={e => nombrar(e.currentTarget.value)} /></label><button disabled={ocupado}>Crear modelo</button><button type="button" onClick={() => editar(null)}>Cancelar</button></form>}
        {cargando ? <p role="status">Cargando modelos…</p> : !filas.length ? <div class="vacio"><h2>Aún no hay modelos</h2><p>Crea un modelo o importa un archivo JSON u OPL.</p><button onClick={() => editarNombre('nuevo')}>Nuevo modelo</button><button onClick={() => input.current?.click()}>Importar archivo</button></div> : <ul class="modelos">{visibles.map(f => <li key={f.id} class={seleccion === f.id ? 'seleccionado' : ''} onClick={() => seleccionar(f.id)}>
            {edicion === f.id ? <form onSubmit={e => { void guardarNombre(e); }}><label>Renombrar modelo<input autoFocus required value={nombre} onInput={e => nombrar(e.currentTarget.value)} /></label><button disabled={ocupado}>Guardar nombre</button><button type="button" onClick={() => editar(null)}>Cancelar</button></form> : <><button class="abrir-modelo" onClick={() => { void ejecutar(() => p.editor.abrir(f.id)); }}>{f.nombre}</button><p><time dateTime={f.modificado}>{modificacionRelativa(f.modificado)}</time> · {f.cosas} cosas · {f.opds} OPDs {borradores.includes(f.id) && <strong> · cambios sin subir</strong>}</p><details class="fila-acciones"><summary aria-label={`Acciones de ${f.nombre}`}>⋯</summary><div><button onClick={() => editarNombre(f.id)}>Renombrar</button><a href={`/api/modelos/${encodeURIComponent(f.id)}?descargar=1`} download>Descargar JSON</a><button onClick={() => eliminar(f.id)}>Eliminar</button></div></details></>}
        </li>)}</ul>}
        <details class="papelera"><summary>Papelera ({papelera.length})</summary><ul>{papelera.map(f => <li key={f.entrada}><strong>{f.nombre}</strong><span>{f.motivo} · {new Date(f.eliminado).toLocaleString('es-CL')}</span><button disabled={ocupado} onClick={() => { void restaurar(f.entrada); }}>Restaurar</button><button onClick={() => decidir({ texto: `Eliminar definitivamente ${f.nombre}`, hacer: async () => { await p.cliente.purgar(f.entrada); decidir(null); await refrescar(); } })}>Eliminar definitivamente</button></li>)}</ul></details></section>
        {decision && <Dialogo titulo={decision.texto} cerrar={() => decidir(null)} ocupado={ocupado} acciones={[{ texto: 'Cancelar', hacer: () => decidir(null) }, { texto: decision.texto.startsWith('Mover') ? 'Mover a la papelera' : 'Eliminar definitivamente', peligrosa: true, hacer: () => ejecutar(decision.hacer) }]}><p>{decision.texto.startsWith('Mover') ? 'El modelo queda recuperable en la papelera durante 30 días.' : 'Se borrará esta entrada de la papelera y no podrá restaurarse.'}</p>{error && <p role="alert">{error}</p>}</Dialogo>}
        {importacion && <InformeImportacion informe={importacion.resultado.informe} {...(importacion.resultado.ok ? { modelo: importacion.resultado.modelo, crear: crearImportado } : {})} original={importacion.original} descargar={() => importacion.archivo ? descargarArchivo(importacion.archivo, 'original-importado.json') : descargarTexto(importacion.original, 'original-importado.json')} cerrar={() => { importar(null); fallar(''); }} ocupado={ocupado} error={error} />}
        {informe && <InformeImportacion titulo={importacion ? 'Informe del servidor' : 'Informe de importación'} informe={informe} error={error} cerrar={() => mostrar(null)} />}
    </main>;
}
