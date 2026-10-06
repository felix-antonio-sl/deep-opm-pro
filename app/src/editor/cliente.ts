import type { Id } from '../nucleo/tipos';
import type { Informe } from '../codec/informe';
export interface FilaModelo {
    readonly id: Id;
    readonly nombre: string;
    readonly modificado: string;
    readonly rev: string;
    readonly bytes: number;
    readonly cosas: number;
    readonly opds: number;
}
export interface FilaPapelera {
    readonly entrada: string;
    readonly id: Id;
    readonly nombre: string;
    readonly eliminado: string;
    readonly motivo: 'eliminado' | 'reemplazado';
}
export type FalloApi = {
    readonly estado: number;
    readonly error: string;
    readonly informe?: Informe;
};
export interface Cliente {
    sesion(): Promise<{
        email: string;
    } | null>;
    entrar(email: string, clave: string): Promise<'ok' | 'credenciales' | {
        reintentarEn: number;
    }>;
    salir(): Promise<void>;
    listar(): Promise<readonly FilaModelo[]>;
    leer(id: Id): Promise<{
        texto: string;
        rev: string;
    } | 'no-existe'>;
    crear(texto: string): Promise<{
        id: Id;
        rev: string;
        canonicalizado?: true;
        informe?: Informe;
    } | FalloApi>;
    guardar(id: Id, texto: string, rev: string, o?: {
        respaldo?: true;
    }): Promise<{
        rev: string;
        canonicalizado?: true;
        informe?: Informe;
    } | {
        conflicto: string;
    } | FalloApi>;
    eliminar(id: Id): Promise<void>;
    papelera(): Promise<readonly FilaPapelera[]>;
    restaurar(entrada: string): Promise<{
        id: Id;
        rev: string;
        canonicalizado?: true;
        informe?: Informe;
    } | FalloApi>;
    purgar(entrada: string): Promise<void>;
    versionServidor(): string | null; // última cabecera X-Opforja-Version vista
}
export function crearCliente(f: typeof fetch, base = ''): Cliente {
    let version: string | null = null;
    async function pedir(ruta: string, method = 'GET', body?: string, rev?: string) {
        const headers = new Headers();
        if (method !== 'GET') headers.set('X-Opforja', '1');
        if (body !== undefined) headers.set('Content-Type', 'application/json');
        if (rev !== undefined) headers.set('If-Match', `"${rev}"`);
        const r = await f(base + ruta, { method, headers, credentials: 'same-origin', ...(body !== undefined ? { body } : {}) });
        version = r.headers.get('X-Opforja-Version') ?? version;
        return r;
    }
    async function json(r: Response): Promise<any> {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) return { estado: r.status, error: typeof d.error === 'string' ? d.error : `HTTP ${r.status}`, ...(d.informe ? { informe: d.informe } : {}), ...(d.rev ? { conflicto: d.rev } : {}), ...(d.reintentarEn !== undefined ? { reintentarEn: d.reintentarEn } : {}) };
        return d;
    }
    const ruta = (id: Id) => '/api/modelos/' + encodeURIComponent(id);
    const exigir = async (r: Response) => { const d = await json(r); if (!r.ok) throw d; return d; };
    return {
        async sesion() { const r = await pedir('/api/sesion'); if (r.status === 401) return null; return exigir(r); },
        async entrar(email, clave) { const r = await pedir('/api/sesion', 'POST', JSON.stringify({ email, clave })); if (r.ok) return 'ok'; const d = await json(r); if (r.status === 401) return 'credenciales'; if (r.status === 429) return { reintentarEn: d.reintentarEn }; throw d; },
        async salir() { const r = await pedir('/api/sesion', 'DELETE'); if (!r.ok) throw await json(r); },
        async listar() { return (await exigir(await pedir('/api/modelos'))).modelos; },
        async leer(id) { const r = await pedir(ruta(id)); if (r.status === 404) return 'no-existe'; if (!r.ok) throw await json(r); return { texto: await r.text(), rev: (r.headers.get('ETag') ?? '').replace(/^"|"$/g, '') }; },
        async crear(texto) { return json(await pedir('/api/modelos', 'POST', texto)); },
        async guardar(id, texto, rev, o) { const r = await pedir(ruta(id) + (o?.respaldo ? '?respaldo=1' : ''), 'PUT', texto, rev); const d = await json(r); return r.status === 412 ? { conflicto: d.conflicto } : d; },
        async eliminar(id) { const r = await pedir(ruta(id), 'DELETE'); if (!r.ok) throw await json(r); },
        async papelera() { return (await exigir(await pedir('/api/papelera'))).entradas; },
        async restaurar(entrada) { return json(await pedir('/api/papelera/' + encodeURIComponent(entrada) + '/restaurar', 'POST')); },
        async purgar(entrada) { const r = await pedir('/api/papelera/' + encodeURIComponent(entrada), 'DELETE'); if (!r.ok) throw await json(r); },
        versionServidor: () => version,
    };
}
