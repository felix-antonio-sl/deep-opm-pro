import {textoUi,textoPlano} from './TextoUi';
import type { EstadoEditor } from '../editor/estado';
import { cuenta } from './cuenta';
export function Franja(p: { estado: EstadoEditor; deshacer: () => void }) {
    const f = p.estado.franja;
    return <div class="franja" role="status" aria-live="polite"><span>{f ? `${f.tipo === 'ok' ? '✓' : f.tipo === 'rechazo' ? '✕' : '·'} ${textoPlano(f.texto)}` : p.estado.modo === 'navegacion' ? 'Solo navegación' : p.estado.modo === 'estatico' ? 'Vista canon' : 'Edición'}</span>
        {f?.regla && <small>{f.regla} · {f.accion}</small>}{!!f?.trazas.length && <details><summary>{cuenta(f.trazas.length, 'traza', 'trazas')}</summary><ul>{f.trazas.map(t => <li>{textoUi(t.mensaje)} · {t.regla}</li>)}</ul></details>}
        {f?.tipo === 'ok' && <button onClick={p.deshacer}>Deshacer</button>}</div>;
}
