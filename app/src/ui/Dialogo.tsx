import { Component } from 'preact';
import type { ComponentChildren } from 'preact';
import { VERSION_BUNDLE } from '../editor/estado';
import { useEffect, useRef } from 'preact/hooks';
export interface AccionDialogo { readonly texto: string; readonly hacer: () => void | Promise<void>; readonly peligrosa?: boolean; readonly deshabilitada?: boolean }
export function Dialogo(p: { titulo: string; children: ComponentChildren; acciones?: readonly AccionDialogo[]; cerrar?: () => void; ocupado?: boolean }) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => { const d = ref.current!, anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        d.showModal(); const campo = d.querySelector<HTMLElement>('[autofocus],input,button'); campo?.focus();
        return () => { d.close(); anterior?.focus(); };
    }, []);
    return <dialog ref={ref} aria-label={p.titulo} onCancel={e => { e.preventDefault(); if (!p.ocupado) p.cerrar?.(); }}>
        <header><h2>{p.titulo}</h2>{p.cerrar && <button aria-label="Cerrar diálogo" disabled={p.ocupado} onClick={p.cerrar}>×</button>}</header>
        <div class="dialogo-contenido">{p.children}</div><footer>{p.acciones?.map(a => <button class={a.peligrosa ? 'peligro' : ''} disabled={p.ocupado || a.deshabilitada} onClick={() => { void a.hacer(); }}>{a.texto}</button>)}</footer>
    </dialog>;
}

export class LimitePanel extends Component<{ nombre: string; opd?: string; children: ComponentChildren }, { detalle: string | null }> {
    override state = { detalle: null as string | null };
    override componentDidCatch(e: Error) { this.setState({ detalle: e.stack ?? e.message }); }
    override render() { return this.state.detalle ? <section role="alert"><h2>No se pudo abrir {this.props.nombre}</h2><p>Las otras zonas siguen disponibles.</p><button onClick={() => { void navigator.clipboard?.writeText(`Versión ${VERSION_BUNDLE}\nOPD ${this.props.opd ?? '—'}\n${this.state.detalle}`); }}>Copiar detalle</button><button onClick={() => this.setState({ detalle: null })}>Reintentar</button></section> : this.props.children; }
}
