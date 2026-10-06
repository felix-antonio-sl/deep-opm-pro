import { useState } from 'preact/hooks';
import type { Cliente } from '../editor/cliente';
export function Acceso(p: { cliente: Cliente; entrado: (email: string) => void | Promise<void>; reingreso?: boolean }) {
    const [email, correo] = useState(''), [clave, password] = useState(''), [error, fallar] = useState(''), [ocupado, ocupar] = useState(false);
    async function entrar(e: Event) { e.preventDefault(); if (ocupado) return; ocupar(true); fallar('');
        try { const r = await p.cliente.entrar(email, clave); password('');
            if (r === 'ok') await p.entrado(email);
            else fallar(r === 'credenciales' ? 'Credenciales inválidas' : `Demasiados intentos; espera ${Math.ceil(r.reintentarEn / 60)} minutos`);
        } catch { fallar('No se pudo conectar. Reintenta sin cerrar esta página.'); } finally { ocupar(false); }
    }
    return <section class="acceso"><div class="marca">opforja<span>Modelador OPM</span></div><h1>{p.reingreso ? 'Sesión vencida' : 'Entrar'}</h1>
        {p.reingreso && <p>Los cambios se conservan en este navegador. Entra para volver a guardar.</p>}
        <form onSubmit={e => { void entrar(e); }}><label>Correo<input autoFocus type="email" name="email" autoComplete="username" required value={email} onInput={e => correo(e.currentTarget.value)} /></label>
        <label>Clave<input type="password" name="clave" autoComplete="current-password" required value={clave} onInput={e => password(e.currentTarget.value)} /></label>
        {error && <p role="alert" class="mensaje-error">{error}</p>}<button class="primario" disabled={ocupado}>{ocupado ? 'Entrando…' : 'Entrar'}</button></form>
    </section>;
}
