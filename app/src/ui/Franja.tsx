import type { EstadoEditor } from '../editor/estado';
export function Franja(p: { estado: EstadoEditor; deshacer: () => void }) {
    const f = p.estado.franja;
    return <div class="franja" role="status" aria-live="polite"><span>{f ? `${f.tipo === 'ok' ? '✓' : f.tipo === 'rechazo' ? '✕' : '·'} ${f.texto}` : p.estado.modo === 'navegacion' ? 'Solo navegación' : p.estado.modo === 'estatico' ? 'Vista canon' : 'Edición'}</span>
        {f?.regla && <small>{f.regla} · {f.accion}</small>}{!!f?.trazas.length && <details><summary>{f.trazas.length} trazas</summary><ul>{f.trazas.map(t => <li>{t.mensaje} · {t.regla}</li>)}</ul></details>}
        {f?.tipo === 'ok' && <button onClick={p.deshacer}>Deshacer</button>}</div>;
}
