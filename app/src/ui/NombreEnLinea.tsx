import { useEffect, useRef } from 'preact/hooks';
import type { Punto } from '../opd/escena';
export function NombreEnLinea(p: { en: Punto; valor: string; titulo: string; mensaje?: string | undefined; inversa?: string; cambiarInversa?: (s:string)=>void; sugerencia?: string; cambiar: (s: string) => void; tecla: (e: KeyboardEvent) => void; confirmar: () => void; cancelar: () => void }) {
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => { input.current?.focus(); input.current?.select(); }, [p.titulo]);
    return <div class="nombre-en-linea" style={{ '--nombre-x': `${p.en.x}px`, '--nombre-y': `${p.en.y}px` }} onPointerDown={e => e.stopPropagation()}>
        <form onSubmit={e => { e.preventDefault(); p.confirmar(); }}><label>{p.titulo}<input ref={input} aria-label={p.titulo} value={p.valor} onInput={e => p.cambiar(e.currentTarget.value)} onKeyDown={e => { if (!e.isComposing) p.tecla(e); }} autoComplete="off" /></label>
        {p.inversa !== undefined && <label>Etiqueta inversa<input aria-label="Etiqueta inversa" value={p.inversa} onInput={e=>p.cambiarInversa?.(e.currentTarget.value)} /></label>}
        {p.mensaje && <p role="status">{p.mensaje}</p>}{p.sugerencia && <button type="button" onClick={() => { p.cambiar(p.sugerencia!); input.current?.focus(); }}>Usar {p.sugerencia}</button>}
        <div><button>Confirmar ↵</button><button type="button" onClick={p.cancelar}>Cancelar ⎋</button></div></form>
    </div>;
}
