import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile, mkdir, open, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
export interface Cuenta {
    readonly email: string;
    readonly hashClave: string;
    readonly versionCredencial: number;
}
const N = 16384, R = 8, P = 1, KEYLEN = 64;
export function hashPassword(password: string): string {
    const salt = randomBytes(16), hash = scryptSync(password, salt, KEYLEN, {
        N, r: R, p: P
    });
    return `scrypt$${N}$${R}$${P}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}
export function verifyPassword(password: string, stored: string): boolean {
    const partes = stored.split('$');
    if (partes.length !== 6 || partes[0] !== 'scrypt')
        return false;
    const n = Number(partes[1]), r = Number(partes[2]), p = Number(partes[3]);
    if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p))
        return false;
    try {
        const salt = Buffer.from(partes[4]!, 'base64url'), esperado = Buffer.from(partes[5]!, 'base64url');
        if (!esperado.length)
            return false;
        return timingSafeEqual(scryptSync(password, salt, esperado.length, {
            N: n, r, p
        }), esperado);
    }
    catch {
        return false;
    }
}
export const HASH_SENUELO = hashPassword(randomBytes(16).toString('hex'));
const ausente = (e: unknown) => typeof e === 'object' && e !== null && 'code' in e && e.code === 'ENOENT';
export async function leerCuenta(datos: string): Promise<Cuenta | null> {
    let texto: string;
    try {
        texto = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await readFile(join(datos, 'cuenta.json')));
    }
    catch (e) {
        if (ausente(e))
            return null;
        throw e;
    }
    const c: unknown = JSON.parse(texto);
    if (typeof c !== 'object' || c === null || !('email' in c) || typeof c.email !== 'string' || !('hashClave' in c) || typeof c.hashClave !== 'string' || !('versionCredencial' in c) || !Number.isSafeInteger(c.versionCredencial) || Number(c.versionCredencial) < 1)
        throw new Error('Cuenta inválida');
    return c as Cuenta;
}
async function escribir(datos: string, c: Cuenta, nueva: boolean) {
    await mkdir(datos, {
        recursive: true
    });
    const archivo = join(datos, 'cuenta.json');
    // Creación exclusiva evita reemplazar una cuenta aun con dos CLI concurrentes.
    const temporal = nueva ? archivo : join(datos, `.tmp-cuenta-${randomBytes(8).toString('hex')}`);
    const f = await open(temporal, 'wx', 0o600);
    try {
        await f.writeFile(JSON.stringify(c));
        await f.sync();
    }
    finally {
        await f.close();
    }
    try {
        if (!nueva)
            await rename(temporal, archivo);
        const dir = await open(datos, 'r');
        try {
            await dir.sync();
        }
        finally {
            await dir.close();
        }
    }
    catch (e) {
        if (!nueva)
            await unlink(temporal).catch(() => {
            });
        throw e;
    }
}
export async function ejecutarCuenta(args: readonly string[], entrada: string, salida: (texto: string) => void = () => {
}): Promise<number> {
    const pos = args.indexOf('--datos'), datos = pos >= 0 ? args[pos + 1] : undefined, accion = args[0];
    if (!datos || !['crear', 'clave', 'cerrar-sesiones'].includes(accion ?? '')) {
        salida('Uso: cuenta crear <email> | clave | cerrar-sesiones --datos <dir>');
        return 1;
    }
    try {
        const c = await leerCuenta(datos);
        if (accion === 'crear' && c) {
            salida('La cuenta ya existe');
            return 1;
        }
        if (accion !== 'crear' && !c) {
            salida('No existe una cuenta');
            return 1;
        }
        const [clave, segunda] = entrada.split(/\r?\n/);
        if (accion !== 'cerrar-sesiones' && (!clave || clave.length < 10 || clave !== segunda)) {
            salida('La clave debe tener al menos 10 caracteres y coincidir');
            return 1;
        }
        const email = accion === 'crear' ? args[1] : c!.email;
        if (!email || email === '--datos') {
            salida('Falta el email');
            return 1;
        }
        await escribir(datos, {
            email, hashClave: accion === 'cerrar-sesiones' ? c!.hashClave : hashPassword(clave!), versionCredencial: accion === 'crear' ? 1 : c!.versionCredencial + 1
        }, accion === 'crear');
        salida('Cuenta actualizada');
        return 0;
    }
    catch {
        salida('No se pudo actualizar la cuenta');
        return 1;
    }
}
if (import.meta.main) {
    const args = process.argv.slice(2);
    if (!args.includes('--datos') && process.env.OPFORJA_DATOS)
        args.push('--datos', process.env.OPFORJA_DATOS);
    if (args[0] !== 'cerrar-sesiones')
        console.log('Clave y repetición, una por línea:');
    process.exitCode = await ejecutarCuenta(args, args[0] === 'cerrar-sesiones' ? '' : await Bun.stdin.text(), console.log);
}
