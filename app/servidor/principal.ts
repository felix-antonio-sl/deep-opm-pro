import { resolve, sep } from 'node:path';
import { Almacen, ErrorAlmacen, MAX_BYTES } from './almacen';
import type { Canon } from './almacen';
import { leerCuenta } from './cuenta';
import { Sesiones, BORRAR_COOKIE } from './sesion';
import { ID_MODELO, leerCanonico, revision, resumen } from '../src/codec/canonico';
import { importarV0 } from '../src/codec/importar';
import { exportarV0 } from '../src/codec/exportar';
export interface ConfigServidor {
    readonly datos: string;
    readonly web: string;
    readonly secreto: string;
    readonly token?: string;
    readonly version: string;
    readonly canon: Canon;
    readonly puerto?: number;
    readonly hostname?: string;
    readonly ahora?: () => number;
    readonly previas?: number;
    readonly previasMin?: number;
    readonly log?: (e: Readonly<Record<string, unknown>>) => void;
}
const seguridad = {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self'; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
};
async function cuerpo(r: Request, max: number): Promise<string> {
    const lector = r.body?.getReader();
    if (!lector)
        return '';
    const partes: Uint8Array[] = [];
    let total = 0;
    try {
        for (;;) {
            const x = await lector.read();
            if (x.done)
                break;
            total += x.value.byteLength;
            if (total > max) {
                await lector.cancel();
                throw new ErrorAlmacen(413, {
                    error: 'Cuerpo demasiado grande'
                });
            }
            partes.push(x.value);
        }
    }
    finally {
        lector.releaseLock();
    }
    const bytes = new Uint8Array(total);
    let i = 0;
    for (const p of partes) {
        bytes.set(p, i);
        i += p.byteLength;
    }
    try {
        return new TextDecoder('utf-8', {
            fatal: true, ignoreBOM: true
        }).decode(bytes);
    }
    catch {
        throw new ErrorAlmacen(400, {
            error: 'Documento inválido'
        });
    }
}
function etag(r: Request): string | undefined {
    const h = r.headers.get('if-match');
    return h === null ? undefined : /^"([a-f0-9]{64})"$/.exec(h)?.[1] ?? 'no-coincide';
}
function archivoNombre(nombre: string): string {
    return nombre.normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'modelo';
}
export async function crearServidor(c: ConfigServidor): Promise<{
    servidor: Bun.Server<undefined>;
    almacen: Almacen;
    cerrar: () => Promise<void>;
}> {
    const log = c.log ?? (e => console.log(JSON.stringify(e))), ahora = c.ahora ?? Date.now;
    const sesiones = new Sesiones({
        secreto: c.secreto, ...(c.token !== undefined ? {
            token: c.token
        } : {}), cuenta: () => leerCuenta(c.datos), ahora
    });
    const almacen = new Almacen({
        datos: c.datos, canon: c.canon, ahora, ...(c.previas !== undefined ? {
            previas: c.previas
        } : {}), ...(c.previasMin !== undefined ? {
            previasMin: c.previasMin
        } : {}), log
    });
    await almacen.iniciar();
    const web = resolve(c.web);
    const responder = (estado: number, valor: unknown, headers: HeadersInit = {}) => new Response(estado === 204 ? null : JSON.stringify(valor), {
        status: estado, headers: {
            'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...Object.fromEntries(new Headers(headers))
        }
    });
    let servidor!: Bun.Server<undefined>;
    const manejar = async (r: Request, contexto: {
        auth: string;
    }): Promise<{
        respuesta: Response;
        auth: string;
    }> => {
        const url = new URL(r.url), ruta = url.pathname, metodo = r.method;
        let auth = 'ninguna';
        const respuesta = (estado: number, valor: unknown, headers: HeadersInit = {}) => ({
            respuesta: responder(estado, valor, headers), auth
        });
        const ip = r.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || servidor.requestIP(r)?.address || 'desconocida';
        if (ruta === '/salud' && metodo === 'GET')
            return respuesta(200, {
                ok: true, version: c.version
            });
        if (ruta === '/api/sesion' && metodo === 'POST') {
            let datos: unknown;
            try {
                datos = JSON.parse(await cuerpo(r, 4096));
            }
            catch (e) {
                if (e instanceof ErrorAlmacen && e.estado !== 400)
                    throw e;
                datos = {};
            }
            const d = typeof datos === 'object' && datos !== null ? datos as Record<string, unknown> : {};
            const a = await sesiones.login(typeof d.email === 'string' ? d.email : '', typeof d.clave === 'string' ? d.clave : '', ip, url.hostname);
            return respuesta(a.estado, a.estado === 429 ? {
                error: a.error, reintentarEn: a.reintentarEn
            } : {
                error: a.error
            }, a.cookie ? {
                'Set-Cookie': a.cookie
            } : {});
        }
        const modelo = /^\/api\/modelos\/([^/]+)$/.exec(ruta), papelera = /^\/api\/papelera\/([^/]+)(\/restaurar)?$/.exec(ruta);
        let id: string | undefined, entrada: string | undefined;
        try {
            if (modelo) {
                id = decodeURIComponent(modelo[1]!);
                if (!ID_MODELO.test(id))
                    return respuesta(404, {
                        error: 'Modelo no encontrado'
                    });
            }
            if (papelera) {
                entrada = decodeURIComponent(papelera[1]!);
                if (entrada.includes('/') || entrada.includes('\\') || entrada.includes('\0'))
                    return respuesta(404, {
                        error: 'Entrada no encontrada'
                    });
            }
        }
        catch {
            return respuesta(404, {
                error: 'Ruta no encontrada'
            });
        }
        const protegida = ruta === '/api/sesion' || ruta === '/api/modelos' || ruta === '/api/papelera' || !!modelo || !!papelera;
        if (protegida) {
            const a = await sesiones.autenticar(r, ip, {
                sesion: ruta === '/api/sesion', mutacion: !['GET', 'HEAD'].includes(metodo)
            });
            if (!a.ok)
                return respuesta(a.estado, a.estado === 429 ? {
                    error: a.error, reintentarEn: a.reintentarEn
                } : {
                    error: a.error
                });
            auth = a.auth!;
            contexto.auth = auth;
            if (ruta === '/api/sesion') {
                if (metodo === 'GET')
                    return respuesta(200, {
                        email: a.email
                    });
                if (metodo === 'DELETE')
                    return respuesta(204, null, {
                        'Set-Cookie': BORRAR_COOKIE + (url.hostname === 'localhost' ? '' : '; Secure')
                    });
            }
            if (ruta === '/api/modelos') {
                if (metodo === 'GET')
                    return respuesta(200, {
                        modelos: almacen.listar()
                    });
                if (metodo === 'POST') {
                    const g = await almacen.guardar(await cuerpo(r, MAX_BYTES), {
                        crear: true, aceptarPerdidas: url.searchParams.get('aceptarPerdidas') === '1'
                    });
                    return respuesta(201, g);
                }
            }
            if (id !== undefined) {
                if (metodo === 'GET') {
                    const d = await almacen.leer(id);
                    return {
                        respuesta: new Response(d.texto, {
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ETag: `"${d.rev}"`, ...(url.searchParams.get('descargar') === '1' ? {
                                    'Content-Disposition': `attachment; filename="${archivoNombre(d.nombre)}.opforja.json"`
                                } : {})
                            }
                        }), auth
                    };
                }
                if (metodo === 'PUT') {
                    const rev = etag(r);
                    if (rev === undefined)
                        return respuesta(428, {
                            error: 'If-Match requerido'
                        });
                    const g = await almacen.guardar(await cuerpo(r, MAX_BYTES), {
                        id, rev, respaldo: url.searchParams.get('respaldo') === '1', aceptarPerdidas: url.searchParams.get('aceptarPerdidas') === '1'
                    });
                    const { id: _id, ...resto } = g;
                    return respuesta(200, resto);
                }
                if (metodo === 'DELETE') {
                    await almacen.eliminar(id, etag(r));
                    return respuesta(204, null);
                }
            }
            if (ruta === '/api/papelera' && metodo === 'GET')
                return respuesta(200, {
                    entradas: await almacen.papelera()
                });
            if (entrada !== undefined) {
                if (papelera?.[2] && metodo === 'POST')
                    return respuesta(201, await almacen.restaurar(entrada));
                if (!papelera?.[2] && metodo === 'DELETE') {
                    await almacen.borrarEntrada(entrada);
                    return respuesta(204, null);
                }
            }
        }
        if (ruta.startsWith('/api/') || ruta === '/api' || metodo !== 'GET')
            return respuesta(404, {
                error: 'Ruta no encontrada'
            });
        let local: string, esSPA: boolean;
        try {
            const decodificada = decodeURIComponent(ruta);
            if (decodificada.includes('\0') || decodificada.includes('\\'))
                return respuesta(404, {
                    error: 'Ruta no encontrada'
                });
            esSPA = !decodificada.split('/').at(-1)?.includes('.');
            local = esSPA ? resolve(web, 'index.html') : resolve(web, '.' + decodificada);
        }
        catch {
            return respuesta(404, {
                error: 'Ruta no encontrada'
            });
        }
        if (local !== web && !local.startsWith(web + sep))
            return respuesta(404, {
                error: 'Ruta no encontrada'
            });
        const f = Bun.file(local);
        if (!await f.exists())
            return respuesta(404, {
                error: 'Archivo no encontrado'
            });
        return {
            respuesta: new Response(f, {
                headers: {
                    'Cache-Control': !esSPA && ruta.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-store'
                }
            }), auth
        };
    };
    servidor = Bun.serve<undefined>({
        hostname: c.hostname ?? '127.0.0.1', port: c.puerto ?? 8080, maxRequestBodySize: Number.MAX_SAFE_INTEGER, fetch: async (r) => {
            const inicio = ahora(), contexto = {
                auth: 'ninguna'
            };
            let estado: number, salida: Response;
            try {
                const res = await manejar(r, contexto);
                salida = res.respuesta;
                contexto.auth = res.auth;
                estado = salida.status;
            }
            catch (e) {
                estado = e instanceof ErrorAlmacen ? e.estado : 500;
                salida = responder(estado, e instanceof ErrorAlmacen ? e.cuerpo : {
                    error: 'Error interno'
                });
            }
            for (const [k, v] of Object.entries(seguridad))
                salida.headers.set(k, v);
            salida.headers.set('X-Opforja-Version', c.version);
            log({
                metodo: r.method, ruta: new URL(r.url).pathname, estado, ms: Math.max(0, ahora() - inicio), auth: contexto.auth
            });
            return salida;
        }
    });
    const purga = setInterval(() => {
        void almacen.purgar().catch(() => log({
            evento: 'fallo-purga'
        }));
    }, 24 * 3600 * 1000);
    purga.unref();
    return {
        servidor, almacen, cerrar: async () => {
            clearInterval(purga);
            await servidor.stop(true);
        }
    };
}
if (import.meta.main) {
    const args = process.argv.slice(2), opcion = (k: string) => {
        const i = args.indexOf(k);
        return i < 0 ? undefined : args[i + 1];
    };
    try {
        const datos = opcion('--datos') ?? process.env.OPFORJA_DATOS, web = opcion('--web') ?? process.env.OPFORJA_WEB, secreto = process.env.OPFORJA_SECRETO;
        if (!datos || !web || !secreto)
            throw new Error('OPFORJA_DATOS, OPFORJA_WEB y OPFORJA_SECRETO requeridos');
        const puerto = Number(opcion('--puerto') ?? process.env.PORT ?? 8080);
        if (!Number.isInteger(puerto) || puerto < 0 || puerto > 65535)
            throw new Error('Puerto inválido');
        const token = process.env.OPFORJA_TOKEN;
        const s = await crearServidor({
            datos, web, secreto, ...(token ? {
                token
            } : {}), version: process.env.OPFORJA_VERSION ?? 'local', canon: {
                leerCanonico, importarV0, exportarV0, revision, resumen
            }, puerto, hostname: opcion('--host') ?? '0.0.0.0', previas: Number(process.env.OPFORJA_PREVIAS ?? 30), previasMin: Number(process.env.OPFORJA_PREVIAS_MIN ?? 10)
        });
        console.log(JSON.stringify({
            evento: 'servidor-iniciado', puerto: s.servidor.port
        }));
        for (const signal of ['SIGTERM', 'SIGINT'] as const)
            process.once(signal, () => {
                void s.cerrar();
            });
    }
    catch (e) {
        console.error(e instanceof Error ? e.message : 'No se pudo iniciar el servidor');
        process.exitCode = 1;
    }
}
