import { useEffect, useMemo, useState } from 'preact/hooks';
import { crearCliente } from '../editor/cliente';
import { crearAlmacenLocal } from '../editor/guardado';
import { crearEditor } from '../editor/estado';
import type { Editor as Controlador } from '../editor/estado';
import type { Cliente } from '../editor/cliente';
import type { AlmacenLocal } from '../editor/guardado';
import type { Informe } from '../codec/informe';
import { exportarV0 } from '../codec/exportar';
import { Acceso } from './Acceso';
import { Biblioteca, descargarTexto, descargarArchivo } from './Biblioteca';
import { Editor } from './Editor';
import type { RanurasEditor } from './Editor';
import { Dialogo, LimitePanel } from './Dialogo';
import { InformeImportacion } from './InformeImportacion';
import { Ayuda } from './Ayuda';
export function App(p: { cliente?: Cliente; local?: AlmacenLocal; editor?: Controlador; ranuras?: RanurasEditor }) {
    const deps = useMemo(() => { const cliente = p.cliente ?? crearCliente(fetch.bind(globalThis)), local = p.local ?? crearAlmacenLocal(); return { cliente, local, editor: p.editor ?? crearEditor({ cliente, local }) }; }, []);
    useEffect(() => { deps.editor.fijarPaneles({ arbol: innerWidth >= 1600 }); }, []);
    const [informeCreado, informeServidor] = useState<{ informe: Informe; anterior?: Informe; original?: string; archivo?: Blob } | null>(null);
    const [estado, publicar] = useState(deps.editor.obtener()), [sesion, fijarSesion] = useState<string | null>(null), [arranque, listo] = useState(false), [error, fallar] = useState(''), [ocupado, ocupar] = useState(false), [salidaCuenta, cerrarCuenta] = useState(false);
    useEffect(() => deps.editor.suscribir(() => publicar(deps.editor.obtener())), []);
    async function rutaPedida() { const x = /^#\/m\/([^/]+)(?:\/([^/]+))?$/.exec(location.hash); if (x) { await deps.editor.abrir(decodeURIComponent(x[1]!)); if (x[2] && deps.editor.obtener().modelo) deps.editor.navegar(decodeURIComponent(x[2])); } }
    useEffect(() => { let activo = true; void deps.cliente.sesion().then(async s => { if (!activo) return; fijarSesion(s?.email ?? null); if (s) await rutaPedida(); }).catch(() => { if (activo) fallar('No se pudo comprobar la sesión. Reintenta.'); }).finally(() => { if (activo) { listo(true); document.body.dataset.listo = '1'; } }); return () => { activo = false; delete document.body.dataset.listo; }; }, []);
    useEffect(() => { if (estado.modelo) history.replaceState(null, '', `#/m/${encodeURIComponent(estado.modelo.id)}/${encodeURIComponent(estado.opd)}`); else if (arranque && sesion) history.replaceState(null, '', '#/'); }, [estado.modelo?.id, estado.opd, arranque, sesion]);
    useEffect(() => { if (salidaCuenta && !estado.modelo) void salirCuenta(); }, [salidaCuenta, estado.modelo]);
    async function salirCuenta() { if (ocupado) return; ocupar(true); try { await deps.cliente.salir(); fijarSesion(null); cerrarCuenta(false); history.replaceState(null, '', '#/'); } catch { fallar('No se pudo cerrar la sesión. Reintenta.'); cerrarCuenta(false); } finally { ocupar(false); } }
    function salir() { if (estado.modelo) { cerrarCuenta(true); deps.editor.cerrar(); } else void salirCuenta(); }
    async function accion(hacer: () => void | Promise<void>) { if (ocupado) return; ocupar(true); fallar(''); try { await hacer(); } catch { fallar('No se pudo completar la acción. Los cambios siguen en este navegador.'); } finally { ocupar(false); } }
    const cancelar = () => { deps.editor.solicitar(null); cerrarCuenta(false); };
    const s = estado.solicitud;
    const descargar = () => { if (estado.modelo) descargarTexto(exportarV0(estado.modelo), `${estado.modelo.nombre}.opforja.json`); };
    const decision = s?.k === 'conflicto' ? { titulo: 'Hay cambios guardados en otra sesión', texto: 'Elige qué conservar. Usar la versión guardada crea antes una copia de tus cambios.', acciones: [{ texto: 'Conservar mis cambios', hacer: () => accion(() => deps.editor.resolverConflicto('conservar-mios')) }, { texto: 'Usar la versión guardada', hacer: () => accion(() => deps.editor.resolverConflicto('usar-guardada')) }] }
        : s?.k === 'borrador' ? { titulo: 'Recuperar cambios de este navegador', texto: s.servidorCambio ? 'El servidor cambió desde este borrador. Recuperar conservará tus cambios con respaldo.' : 'Este navegador conserva cambios que no están en la versión guardada.', acciones: [{ texto: 'Recuperar', hacer: () => accion(() => deps.editor.resolverBorrador('recuperar')) }, { texto: 'Descartar borrador', hacer: () => accion(() => deps.editor.resolverBorrador('descartar')) }, { texto: 'Descargar borrador', hacer: () => accion(() => deps.editor.resolverBorrador('descargar')) }] }
        : s?.k === 'salida' ? { titulo: 'Quedan cambios sin subir', texto: 'La salida no pudo guardar todos los cambios. Se conservan en el borrador de este navegador.', acciones: [{ texto: 'Reintentar', hacer: () => accion(async () => { await deps.editor.guardarAhora(); if (deps.editor.obtener().guardado === 'guardado' || deps.editor.obtener().guardado === 'version-nueva') deps.editor.cerrar(); }) }, { texto: 'Descargar JSON', hacer: descargar }, { texto: 'Salir de todos modos', hacer: () => deps.editor.salirIgualmente() }] } : null;
    if (!arranque) return <main class="arranque" role="status">Abriendo opforja…</main>;
    return <><LimitePanel nombre="la aplicación">{!sesion ? <Acceso cliente={deps.cliente} entrado={async email => { fijarSesion(email); fallar(''); await rutaPedida(); }} /> : estado.modelo ? <Editor editor={deps.editor} estado={estado} salir={salir} {...(p.ranuras ? { ranuras: p.ranuras } : {})} /> : <Biblioteca key={sesion} cliente={deps.cliente} local={deps.local} editor={deps.editor} email={sesion} salir={salir} sesionVencida={() => fijarSesion(null)} informeCreado={informeServidor} />}</LimitePanel>
        {error && <div class="error-app" role="alert">{error}<button onClick={() => { fallar(''); if (!sesion) location.reload(); }}>Reintentar</button></div>}
        {informeCreado && <InformeImportacion informe={informeCreado.informe} {...(informeCreado.anterior ? { anterior: informeCreado.anterior } : {})} {...(informeCreado.original !== undefined ? { original: informeCreado.original, descargar: () => informeCreado.archivo ? descargarArchivo(informeCreado.archivo, 'original-importado.json') : descargarTexto(informeCreado.original!, 'original-importado.json') } : {})} {...(estado.modelo ? { modelo: estado.modelo } : {})} cerrar={() => informeServidor(null)} />}
        {s?.k === 'ayuda' && <Ayuda cerrar={cancelar} />}
        {s?.k === 'reingreso' && <Dialogo titulo="Volver a entrar" ocupado={ocupado}><Acceso reingreso cliente={deps.cliente} entrado={async email => { fijarSesion(email); await deps.editor.guardarAhora(); }} /></Dialogo>}
        {s?.k === 'informe' && s.informe && <InformeImportacion informe={s.informe} {...(estado.modelo ? { modelo: estado.modelo } : {})} {...(s.texto !== undefined ? { original: s.texto, descargar: () => descargarTexto(s.texto!, 'original-abierto.json') } : {})} cerrar={cancelar} {...(!estado.modelo && !s.informe.rechazos.length ? { crear: async () => { await accion(() => deps.editor.confirmarImportacion()); }, aceptarTexto: 'Abrir de todos modos' } : {})} ocupado={ocupado} error={error} />}
        {decision && <Dialogo titulo={decision.titulo} cerrar={cancelar} ocupado={ocupado} acciones={decision.acciones}><p>{decision.texto}</p>{error && <p role="alert">{error}</p>}</Dialogo>}
        {s?.k === 'descarga' && s.texto !== undefined && <Dialogo titulo="Descargar borrador" cerrar={() => deps.editor.solicitar({ k: 'borrador' })} acciones={[{ texto: 'Descargar JSON', hacer: () => descargarTexto(s.texto!, 'borrador.opforja.json') }]}><p>Descarga los bytes del borrador sin cambiarlos.</p></Dialogo>}
        {estado.modelo && estado.guardado === 'eliminado' && !s && <Dialogo titulo="Este modelo se eliminó en otra sesión" acciones={[{ texto: 'Guardarlo de nuevo', hacer: () => accion(() => deps.editor.guardarDeNuevo()) }, { texto: 'Descargar JSON', hacer: descargar }, { texto: 'Volver a Biblioteca', hacer: () => deps.editor.cerrar() }]}><p>Tus cambios siguen abiertos y se conservan en este navegador.</p></Dialogo>}
        {estado.modelo && estado.guardado === 'error' && !s && <Dialogo titulo="No se pudo guardar" acciones={[{ texto: 'Reintentar', hacer: () => accion(() => deps.editor.guardarAhora()) }, { texto: 'Descargar JSON', hacer: descargar }, { texto: 'Volver a Biblioteca', hacer: () => deps.editor.cerrar() }]}><p>{estado.franja?.texto}</p></Dialogo>}
        {s && !['ayuda','reingreso','informe','conflicto','borrador','salida','descarga','biblioteca','importar','camara'].includes(s.k) && (p.ranuras?.solicitud ? <p.ranuras.solicitud editor={deps.editor} estado={estado} /> : <Dialogo titulo="Acción del editor" cerrar={cancelar}><p>Esta acción estará disponible al completar el lienzo y los paneles.</p></Dialogo>)}
    </>;
}
