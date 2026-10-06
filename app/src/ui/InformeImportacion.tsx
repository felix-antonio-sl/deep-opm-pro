import { useState } from 'preact/hooks';
import type { Informe } from '../codec/informe';
import type { Modelo } from '../nucleo/tipos';
import { diagnosticar } from '../nucleo/diagnostico';
import { Dialogo } from './Dialogo';
export function InformeImportacion(p: { informe: Informe; titulo?: string; anterior?: Informe; modelo?: Modelo; original?: string; descargar?: () => void; cerrar: () => void; crear?: (reparar: boolean) => Promise<void>; aceptarTexto?: string; ocupado?: boolean; error?: string }) {
    const [reparar, fijar] = useState(false), ds = p.modelo ? diagnosticar(p.modelo) : [], reparaciones = ds.filter(d => d.reparacion);
    const seccion = (titulo: string, xs: Informe['normalizado']) => <details open={titulo === 'Rechazos'}><summary>{titulo} ({xs.length})</summary><ul>{xs.map(x => <li><code>{x.ruta}</code>: {x.mensaje}{x.regla && <small> · {x.regla}</small>}</li>)}</ul></details>;
    return <Dialogo titulo={p.titulo ?? 'Informe de importación'} cerrar={p.cerrar} ocupado={!!p.ocupado} acciones={p.crear && !p.informe.rechazos.length ? [{ texto: p.aceptarTexto ?? 'Crear modelo', hacer: () => p.crear!(reparar) }] : []}>
        {p.modelo && <p>{Object.keys(p.modelo.cosas).length} cosas · {Object.values(p.modelo.cosas).reduce((n, c) => n + (c.tipo === 'objeto' ? c.estados.length : 0), 0)} estados · {Object.keys(p.modelo.enlaces).length} enlaces · {Object.keys(p.modelo.opds).length} OPDs</p>}
        {seccion('Normalizado', p.informe.normalizado)}{seccion('Descartado', p.informe.descartado)}
        {p.original !== undefined && p.descargar && <button onClick={p.descargar}>Descargar original</button>}
        <details><summary>Ignorado ({Object.values(p.informe.ignorado).reduce((a, b) => a + b, 0)})</summary><ul>{Object.entries(p.informe.ignorado).map(([k, n]) => <li>{k}: {n}</li>)}</ul></details>
        {seccion('Rechazos', p.informe.rechazos)}
        <details><summary>Visibilidad por OPD ({p.informe.visibilidad.length})</summary>{p.informe.visibilidad.map(v => <section><h3>{v.etiqueta}</h3><ul>{v.aparecen.map(x => <li>+ {x.texto}</li>)}{v.desaparecen.map(x => <li>− {x.texto}</li>)}</ul></section>)}</details>
        <details><summary>Errores del canon cargados ({ds.length})</summary><ul>{ds.map(d => <li>{d.severidad}: {d.mensaje} · {d.regla}. {d.accion}</li>)}</ul></details>
        {!!reparaciones.length && p.crear && <label class="casilla"><input type="checkbox" checked={reparar} onChange={e => fijar(e.currentTarget.checked)} />Aplicar {reparaciones.length} reparaciones sugeridas antes de crear<ul>{reparaciones.map(d => <li>{d.mensaje} · {d.accion}</li>)}</ul></label>}
        {p.anterior && <details><summary>Informe inicial conservado</summary>{seccion('Normalizado inicial', p.anterior.normalizado)}{seccion('Descartado inicial', p.anterior.descartado)}{seccion('Rechazos iniciales', p.anterior.rechazos)}<ul>{Object.entries(p.anterior.ignorado).map(([k, n]) => <li>{k}: {n}</li>)}</ul>{p.anterior.visibilidad.map(v => <section><h3>{v.etiqueta}</h3><ul>{v.aparecen.map(x => <li>+ {x.texto}</li>)}{v.desaparecen.map(x => <li>− {x.texto}</li>)}</ul></section>)}</details>}
        {p.error && <p role="alert" class="mensaje-error">{p.error}</p>}
    </Dialogo>;
}
