import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { HASH_SENUELO, verifyPassword } from './cuenta';
import type { Cuenta } from './cuenta';
interface Opciones {
    readonly secreto: string;
    readonly token?: string;
    readonly cuenta: () => Promise<Cuenta | null>;
    readonly ahora?: () => number;
}
export interface Auth {
    readonly ok: boolean;
    readonly estado: number;
    readonly error?: string;
    readonly cookie?: string;
    readonly reintentarEn?: number;
    readonly auth?: 'cookie' | 'bearer';
    readonly email?: string;
}
const QUINCE = 15 * 60 * 1000, TREINTA = 30 * 24 * 60 * 60;
const digest = (s: string) => createHash('sha256').update(s).digest();
export class Sesiones {
    private readonly ahora: () => number;
    private readonly ips = new Map<string, {
        fallos: number[];
        hasta: number;
    }>();
    private global: {
        fallos: number[];
        hasta: number;
    } = {
        fallos: [], hasta: 0
    };
    constructor(private readonly o: Opciones) {
        if (o.secreto.length < 32)
            throw new Error('OPFORJA_SECRETO requerido, mínimo 32 caracteres');
        if (o.token !== undefined && o.token.length < 48)
            throw new Error('OPFORJA_TOKEN requiere al menos 48 caracteres');
        this.ahora = o.ahora ?? Date.now;
    }
    private limite(ip: string): Auth | undefined {
        const n = this.ahora(), local = this.ips.get(ip), hasta = Math.max(this.global.hasta, local?.hasta ?? 0);
        if (hasta > n)
            return {
                ok: false, estado: 429, error: 'Demasiados intentos', reintentarEn: Math.ceil((hasta - n) / 1000)
            };
        return undefined;
    }
    private fallo(ip: string): Auth {
        const n = this.ahora(), local = this.ips.get(ip) ?? {
            fallos: [], hasta: 0
        };
        local.fallos = local.fallos.filter(t => t > n - QUINCE);
        local.fallos.push(n);
        if (local.fallos.length >= 5)
            local.hasta = n + QUINCE;
        this.ips.set(ip, local);
        this.global.fallos = this.global.fallos.filter(t => t > n - QUINCE);
        this.global.fallos.push(n);
        if (this.global.fallos.length >= 20)
            this.global.hasta = n + QUINCE;
        return this.limite(ip) ?? {
            ok: false, estado: 401, error: 'Credenciales inválidas'
        };
    }
    private firma(payload: string) {
        return createHmac('sha256', this.o.secreto).update(payload).digest();
    }
    async login(email: string, clave: string, ip: string, host: string): Promise<Auth> {
        const c = await this.o.cuenta();
        const coincide = !!c && email.toLocaleLowerCase('en') === c.email.toLocaleLowerCase('en');
        const valida = verifyPassword(clave, coincide ? c!.hashClave : HASH_SENUELO);
        const limite = this.limite(ip);
        if (limite)
            return limite;
        if (!coincide || !valida)
            return this.fallo(ip);
        const payload = Buffer.from(JSON.stringify({
            v: c!.versionCredencial, exp: Math.floor(this.ahora() / 1000) + TREINTA
        })).toString('base64url');
        return {
            ok: true, estado: 204, cookie: `opforja_sesion=${payload}.${this.firma(payload).toString('base64url')}; HttpOnly;${host === 'localhost' ? '' : ' Secure;'} SameSite=Strict; Path=/; Max-Age=${TREINTA}`
        };
    }
    async autenticar(r: Request, ip: string, o: {
        mutacion?: boolean;
        sesion?: boolean;
    } = {}): Promise<Auth> {
        const authorization = r.headers.get('authorization');
        if (authorization !== null) {
            if (o.sesion)
                return {
                    ok: false, estado: r.method === 'DELETE' ? 400 : 401, error: r.method === 'DELETE' ? 'Bearer no cierra una sesión' : 'Sesión requerida'
                };
            const limite = this.limite(ip);
            if (limite)
                return limite;
            const t = /^Bearer (.+)$/.exec(authorization)?.[1];
            if (!this.o.token || !t || !timingSafeEqual(digest(t), digest(this.o.token)))
                return this.fallo(ip);
            const c = await this.o.cuenta();
            if (!c)
                return {
                    ok: false, estado: 401, error: 'Sesión requerida'
                };
            return {
                ok: true, estado: 200, email: c.email, auth: 'bearer'
            };
        }
        const cookie = r.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith('opforja_sesion='))?.slice(15);
        let version: number | undefined;
        if (cookie) {
            const partes = cookie.split('.');
            if (partes.length === 2) {
                try {
                    const payload = partes[0]!, firma = Buffer.from(partes[1]!, 'base64url'), esperada = this.firma(payload);
                    if (firma.length === esperada.length && timingSafeEqual(firma, esperada)) {
                        const d: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString());
                        if (typeof d === 'object' && d !== null && 'v' in d && 'exp' in d && Number.isSafeInteger(d.v) && typeof d.exp === 'number' && Number.isFinite(d.exp) && d.exp > Math.floor(this.ahora() / 1000))
                            version = Number(d.v);
                    }
                }
                catch { /* Una cookie de usuario ilegible no es una excepción interna. */
                }
            }
        }
        const c = await this.o.cuenta();
        if (!c || version !== c.versionCredencial)
            return {
                ok: false, estado: 401, error: 'Sesión requerida'
            };
        if (o.mutacion) {
            const origin = r.headers.get('origin');
            let mismo = true;
            if (origin !== null) {
                try {
                    mismo = new URL(origin).host === new URL(r.url).host;
                }
                catch {
                    mismo = false;
                }
            }
            if (r.headers.get('x-opforja') !== '1' || !mismo)
                return {
                    ok: false, estado: 403, error: 'Petición no autorizada'
                };
        }
        return {
            ok: true, estado: 200, email: c.email, auth: 'cookie'
        };
    }
}
export const BORRAR_COOKIE = 'opforja_sesion=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0';
