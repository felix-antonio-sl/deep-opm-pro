import { mkdir, readdir, readFile, open, rename, link, copyFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { constants } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { ID_MODELO } from '../src/codec/canonico';
import type { leerCanonico, revision, resumen } from '../src/codec/canonico';
import type { importarV0 } from '../src/codec/importar';
import type { exportarV0 } from '../src/codec/exportar';
import type { Informe } from '../src/codec/informe';
export interface Canon {
    readonly leerCanonico: typeof leerCanonico;
    readonly revision: typeof revision;
    readonly resumen: typeof resumen;
    readonly importarV0: typeof importarV0;
    readonly exportarV0: typeof exportarV0;
}
export interface OpcionesAlmacen {
    readonly datos: string;
    readonly canon: Canon;
    readonly ahora?: () => number;
    readonly previas?: number;
    readonly previasMin?: number;
    readonly io?: {
        rename: typeof rename;
        link: typeof link;
        open?: typeof open;
        copyFile?: typeof copyFile;
        unlink?: typeof unlink;
    };
    readonly log?: (evento: Readonly<Record<string, unknown>>) => void;
}
export interface Guardado {
    readonly id: string;
    readonly rev: string;
    readonly canonicalizado?: true;
    readonly informe?: Informe;
}
export interface FilaModelo {
    readonly id: string;
    readonly nombre: string;
    readonly modificado: string;
    readonly rev: string;
    readonly bytes: number;
    readonly cosas: number;
    readonly opds: number;
}
export interface EntradaPapelera {
    readonly entrada: string;
    readonly id: string;
    readonly nombre: string;
    readonly eliminado: string;
    readonly motivo: 'eliminado' | 'reemplazado';
}
export class ErrorAlmacen extends Error {
    constructor(readonly estado: number, readonly cuerpo: {
        error: string;
        rev?: string;
        informe?: Informe;
    }) {
        super(cuerpo.error);
    }
}
export const MAX_BYTES = 25 * 1024 * 1024;
const decodificar = (bytes: Uint8Array): string => new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
const noExiste = (e: unknown) => typeof e === 'object' && e !== null && 'code' in e && e.code === 'ENOENT';
const entradaPatron = /^([A-Za-z0-9][A-Za-z0-9_-]{0,79})--(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z)--(eliminado|reemplazado)\.json$/;
type Modelo = Parameters<typeof exportarV0>[0];
export class Almacen {
    private readonly indice = new Map<string, FilaModelo>();
    private readonly colas = new Map<string, Promise<void>>();
    private readonly ahora: () => number;
    private readonly io: {
        rename: typeof rename;
        link: typeof link;
        open: typeof open;
        copyFile: typeof copyFile;
        unlink: typeof unlink;
    };
    constructor(private readonly o: OpcionesAlmacen) {
        this.ahora = o.ahora ?? Date.now;
        this.io = {
            rename, link, open, copyFile, unlink, ...o.io
        };
        if (!Number.isInteger(o.previas ?? 30) || (o.previas ?? 30) < 1 || !Number.isFinite(o.previasMin ?? 10) || (o.previasMin ?? 10) < 0)
            throw new Error('Configuración de previas inválida');
    }
    private ruta(col: string, nombre = '') {
        return join(this.o.datos, col, nombre);
    }
    private async mutex<T>(clave: string, accion: () => Promise<T>): Promise<T> {
        const previa = this.colas.get(clave) ?? Promise.resolve();
        let liberar!: () => void;
        const turno = new Promise<void>(r => {
            liberar = r;
        });
        const cola = previa.then(() => turno);
        this.colas.set(clave, cola);
        await previa;
        try {
            return await accion();
        }
        finally {
            liberar();
            if (this.colas.get(clave) === cola)
                this.colas.delete(clave);
        }
    }
    private validarId(id: string) {
        if (!ID_MODELO.test(id))
            throw new ErrorAlmacen(404, {
                error: 'Modelo no encontrado'
            });
    }
    private async sincronizarDir(dir: string) {
        const f = await this.io.open(dir, 'r');
        try {
            await f.sync();
        }
        finally {
            await f.close();
        }
    }
    private async leerTexto(ruta: string): Promise<string> {
        return decodificar(await readFile(ruta));
    }
    private async archivarInvalido(archivo: string, id: string, ruta: string): Promise<void> {
        const ocupados = new Set(await readdir(this.ruta('archivo/invalidos')));
        let destino = archivo, numero = 1;
        while (ocupados.has(destino))
            destino = `${id}--${numero++}.json`;
        await this.io.rename(ruta, this.ruta('archivo/invalidos', destino));
        this.o.log?.({ evento: 'archivo-invalido', id });
    }
    async iniciar(): Promise<void> {
        for (const col of ['modelos', 'previas', 'papelera', 'archivo/invalidos'])
            await mkdir(this.ruta(col), {
                recursive: true
            });
        for (const archivo of await readdir(this.ruta('modelos'))) {
            if (!archivo.endsWith('.json') || !ID_MODELO.test(archivo.slice(0, -5)))
                continue;
            const id = archivo.slice(0, -5), ruta = this.ruta('modelos', archivo);
            const original = await readFile(ruta);
            let texto: string;
            try {
                texto = decodificar(original);
            } catch {
                await this.archivarInvalido(archivo, id, ruta);
                continue;
            }
            const r = this.o.canon.importarV0(texto);
            if (!r.ok) {
                await this.archivarInvalido(archivo, id, ruta);
                continue;
            }
            // CC-14: resumen del import; revisión/bytes del archivo original, sin reescritura.
            const f = await open(ruta, 'r');
            let fecha: number;
            try {
                fecha = (await f.stat()).mtimeMs;
            }
            finally {
                await f.close();
            }
            this.indice.set(id, await this.fila(id, texto, r.modelo, fecha));
        }
        await this.purgar();
    }
    private async fila(id: string, texto: string, m: Modelo, fecha = this.ahora()): Promise<FilaModelo> {
        return {
            id, ...this.o.canon.resumen(m), modificado: new Date(fecha).toISOString(), rev: await this.o.canon.revision(texto), bytes: Buffer.byteLength(texto)
        };
    }
    listar(): readonly FilaModelo[] {
        return [...this.indice.values()].sort((a, b) => b.modificado.localeCompare(a.modificado) || a.id.localeCompare(b.id));
    }
    async leer(id: string): Promise<{
        texto: string;
        rev: string;
        nombre: string;
    }> {
        this.validarId(id);
        return this.mutex(id, async () => {
            const fila = this.indice.get(id);
            if (!fila)
                throw new ErrorAlmacen(404, {
                    error: 'Modelo no encontrado'
                });
            const texto = await this.leerTexto(this.ruta('modelos', id + '.json'));
            return {
                texto, rev: await this.o.canon.revision(texto), nombre: fila.nombre
            };
        });
    }
    private preparar(texto: string, aceptarPerdidas = false): {
        texto: string;
        modelo: Modelo;
        canonicalizado?: true;
        informe?: Informe;
    } {
        if (Buffer.byteLength(texto) > MAX_BYTES)
            throw new ErrorAlmacen(413, {
                error: 'Documento demasiado grande'
            });
        // El id de entrada no puede ser reparado por el import tolerante (CC-16).
        let raw: unknown;
        try {
            raw = JSON.parse(texto);
        }
        catch {
            const r = this.o.canon.importarV0(texto);
            throw new ErrorAlmacen(400, {
                error: 'Documento inválido', informe: r.informe
            });
        }
        if (typeof raw !== 'object' || raw === null || !('formato' in raw) || raw.formato !== 'deep-opm-pro.modelo.v0' || !('modelo' in raw) || typeof raw.modelo !== 'object' || raw.modelo === null || Array.isArray(raw.modelo))
            throw new ErrorAlmacen(400, {
                error: 'Documento v0 requerido en raíz'
            });
        const m = raw.modelo;
        if (!('id' in m) || typeof m.id !== 'string' || !ID_MODELO.test(m.id))
            throw new ErrorAlmacen(400, {
                error: 'Id de modelo inválido'
            });
        const estricto = this.o.canon.leerCanonico(texto);
        let modelo: Modelo;
        let resultado: {
            texto: string;
            modelo: Modelo;
            canonicalizado?: true;
            informe?: Informe;
        };
        if (estricto.ok) {
            modelo = estricto.valor;
            resultado = {
                texto, modelo
            };
        }
        else {
            const r = this.o.canon.importarV0(texto);
            if (!r.ok || r.informe.rechazos.length)
                throw new ErrorAlmacen(400, {
                    error: 'Documento inválido', informe: r.informe
                });
            if (r.informe.descartado.length && !aceptarPerdidas)
                throw new ErrorAlmacen(422, {
                    error: 'El documento pierde información al importarse', informe: r.informe
                });
            modelo = r.modelo;
            resultado = {
                texto: this.o.canon.exportarV0(modelo), modelo, canonicalizado: true, informe: r.informe
            };
        }
        if (!ID_MODELO.test(modelo.id))
            throw new ErrorAlmacen(400, {
                error: 'Id de modelo inválido'
            });
        if (Array.from(modelo.nombre).length > 200)
            throw new ErrorAlmacen(400, {
                error: 'Nombre de modelo demasiado largo'
            });
        if (Buffer.byteLength(resultado.texto) > MAX_BYTES)
            throw new ErrorAlmacen(413, {
                error: 'Documento demasiado grande'
            });
        return resultado;
    }
    private async temporal(id: string, texto: string): Promise<string> {
        const ruta = this.ruta('modelos', `.tmp-${id}-${randomBytes(8).toString('hex')}`);
        const f = await open(ruta, 'wx', 0o600);
        try {
            await f.writeFile(texto, 'utf8');
            await f.sync();
        }
        catch (e) {
            await f.close();
            await unlink(ruta).catch(() => {
            });
            throw e;
        }
        await f.close();
        return ruta;
    }
    private async previa(id: string, texto: string) {
        const dir = this.ruta('previas', id);
        await mkdir(dir, {
            recursive: true
        });
        let archivos = (await readdir(dir)).filter(x => /^\d{4}-.*--[a-f0-9]{8}\.json$/.test(x)).sort();
        const ultimo = archivos.at(-1);
        const n = this.ahora();
        if (ultimo && n - Date.parse(ultimo.split('--')[0]!) <= (this.o.previasMin ?? 10) * 60000)
            return;
        let fecha = n, ruta: string;
        const rev = (await this.o.canon.revision(texto)).slice(0, 8);
        do {
            ruta = join(dir, `${new Date(fecha++).toISOString()}--${rev}.json`);
        } while (archivos.includes(ruta.slice(dir.length + 1)));
        try {
            await this.io.link(this.ruta('modelos', id + '.json'), ruta);
        }
        catch {
            await copyFile(this.ruta('modelos', id + '.json'), ruta);
        }
        const f = await open(ruta, 'r');
        try {
            await f.sync();
        }
        finally {
            await f.close();
        }
        archivos = (await readdir(dir)).sort();
        for (const nombre of archivos.slice(0, Math.max(0, archivos.length - (this.o.previas ?? 30))))
            await unlink(join(dir, nombre));
        await this.sincronizarDir(dir);
    }
    // Orden: entrada -> id -> cupo -> nombres. Nunca se adquiere id/entrada desde nombres.
    private async nombrePapelera<T>(id: string, motivo: 'eliminado' | 'reemplazado', accion: (nombre: string) => Promise<T>): Promise<T> {
        return this.mutex('$papelera-nombres', async () => {
            const ocupadas = new Set(await readdir(this.ruta('papelera')));
            let n = this.ahora(), nombre: string;
            do {
                nombre = `${id}--${new Date(n++).toISOString()}--${motivo}.json`;
            } while (ocupadas.has(nombre));
            return accion(nombre);
        });
    }
    private async aPapelera(id: string, motivo: 'eliminado' | 'reemplazado'): Promise<string> {
        return this.nombrePapelera(id, motivo, async nombre => {
            await this.io.rename(this.ruta('modelos', id + '.json'), this.ruta('papelera', nombre));
            try {
                await this.sincronizarDir(this.ruta('papelera'));
            } catch (e) {
                await this.io.rename(this.ruta('papelera', nombre), this.ruta('modelos', id + '.json'));
                await this.sincronizarDir(this.ruta('modelos'));
                await this.sincronizarDir(this.ruta('papelera'));
                throw e;
            }
            return nombre;
        });
    }
    private async respaldarFuente(entrada: string, id: string): Promise<void> {
        await this.nombrePapelera(id, 'reemplazado', async nombre => {
            const destino = this.ruta('papelera', nombre);
            await this.io.copyFile(this.ruta('papelera', entrada), destino, constants.COPYFILE_EXCL);
            const archivo = await this.io.open(destino, 'r');
            try {
                await archivo.sync();
            } finally {
                await archivo.close();
            }
            await this.sincronizarDir(this.ruta('papelera'));
        });
    }
    private async consumirFuente(entrada: string, original: Buffer, historica: boolean): Promise<void> {
        // La exclusión evita que otro productor reutilice el nombre durante una recuperación tardía.
        await this.mutex('$papelera-nombres', async () => {
            let retirada = false;
            try {
                await this.io.unlink(this.ruta('papelera', entrada));
                retirada = true;
                await this.sincronizarDir(this.ruta('papelera'));
            } catch (e) {
                // El histórico ya tiene respaldo durable. El canónico no añade respaldo en éxito.
                if (retirada && !historica) {
                    const archivo = await this.io.open(this.ruta('papelera', entrada), 'wx', 0o600);
                    try {
                        await archivo.writeFile(original);
                        await archivo.sync();
                    } finally {
                        await archivo.close();
                    }
                    await this.sincronizarDir(this.ruta('papelera'));
                }
                throw e;
            }
        });
    }
    async guardar(texto: string, o: {
        crear?: boolean;
        id?: string;
        rev?: string;
        respaldo?: boolean;
        aceptarPerdidas?: boolean;
    }): Promise<Guardado> {
        return this.guardarCandidato(this.preparar(texto, o.aceptarPerdidas), o);
    }
    private async guardarCandidato(preparado: ReturnType<Almacen['preparar']>, o: Parameters<Almacen['guardar']>[1], antesDeInstalar?: () => Promise<void>): Promise<Guardado> {
        const id = o.id ?? preparado.modelo.id;
        if (o.id !== undefined && preparado.modelo.id !== o.id)
            throw new ErrorAlmacen(400, {
                error: 'El id del documento no coincide con la ruta'
            });
        this.validarId(id);
        return this.mutex(id, async () => {
            const guardar = async () => {
                const vigente = this.indice.get(id);
                if (o.crear) {
                    if (vigente)
                        throw new ErrorAlmacen(409, {
                            error: 'El modelo ya existe'
                        });
                    if (this.indice.size >= 2000)
                        throw new ErrorAlmacen(507, {
                            error: 'Límite de modelos alcanzado'
                        });
                }
                else {
                    if (!vigente)
                        throw new ErrorAlmacen(404, {
                            error: 'Modelo no encontrado'
                        });
                    if (o.rev === undefined)
                        throw new ErrorAlmacen(428, {
                            error: 'If-Match requerido'
                        });
                }
                let anterior: string | undefined;
                if (vigente) {
                    anterior = await this.leerTexto(this.ruta('modelos', id + '.json'));
                    const rev = await this.o.canon.revision(anterior);
                    if (o.rev !== rev)
                        throw new ErrorAlmacen(412, {
                            error: 'Revisión desactualizada', rev
                        });
                }
                const fila = await this.fila(id, preparado.texto, preparado.modelo);
                const tmp = await this.temporal(id, preparado.texto);
                let papelera: string | undefined, instalado = false;
                try {
                    if (anterior !== undefined)
                        await this.previa(id, anterior);
                    if (o.respaldo && vigente)
                        papelera = await this.aPapelera(id, 'reemplazado');
                    if (antesDeInstalar)
                        await antesDeInstalar();
                    await this.io.rename(tmp, this.ruta('modelos', id + '.json'));
                    instalado = true;
                    this.indice.set(id, fila);
                    await this.sincronizarDir(this.ruta('modelos'));
                }
                catch (e) {
                    await unlink(tmp).catch(() => {
                    });
                    if (papelera && !instalado) {
                        await copyFile(this.ruta('papelera', papelera), this.ruta('modelos', id + '.json'));
                        const f = await open(this.ruta('modelos', id + '.json'), 'r');
                        try {
                            await f.sync();
                        }
                        finally {
                            await f.close();
                        }
                        await this.sincronizarDir(this.ruta('modelos'));
                    }
                    throw e;
                }
                this.o.log?.({
                    evento: o.crear ? 'modelo-creado' : 'modelo-guardado', id
                });
                return {
                    id, rev: fila.rev, ...(preparado.canonicalizado ? {
                        canonicalizado: true as const, informe: preparado.informe!
                    } : {})
                };
            };
            return o.crear ? this.mutex('$creacion', guardar) : guardar();
        });
    }
    async eliminar(id: string, rev?: string): Promise<void> {
        this.validarId(id);
        await this.mutex(id, async () => {
            if (!this.indice.has(id))
                throw new ErrorAlmacen(404, {
                    error: 'Modelo no encontrado'
                });
            if (rev !== undefined) {
                const actual = await this.o.canon.revision(await this.leerTexto(this.ruta('modelos', id + '.json')));
                if (actual !== rev)
                    throw new ErrorAlmacen(412, {
                        error: 'Revisión desactualizada', rev: actual
                    });
            }
            await this.aPapelera(id, 'eliminado');
            this.indice.delete(id);
            await this.sincronizarDir(this.ruta('modelos'));
            this.o.log?.({
                evento: 'modelo-eliminado', id
            });
        });
    }
    async papelera(): Promise<readonly EntradaPapelera[]> {
        const entradas: EntradaPapelera[] = [];
        for (const entrada of await readdir(this.ruta('papelera'))) {
            const p = entradaPatron.exec(entrada);
            if (!p)
                continue;
            try {
                const original = await readFile(this.ruta('papelera', entrada));
                let texto: string;
                try {
                    texto = decodificar(original);
                } catch {
                    continue;
                }
                const r = this.o.canon.importarV0(texto);
                if (r.ok)
                    entradas.push({
                        entrada, id: p[1]!, nombre: r.modelo.nombre, eliminado: p[2]!, motivo: p[3] as 'eliminado' | 'reemplazado'
                    });
            }
            catch (e) {
                if (!noExiste(e))
                    throw e;
            }
        }
        return entradas.sort((a, b) => b.eliminado.localeCompare(a.eliminado) || a.entrada.localeCompare(b.entrada));
    }
    private validarEntrada(entrada: string) {
        if (!entradaPatron.test(entrada))
            throw new ErrorAlmacen(404, {
                error: 'Entrada no encontrada'
            });
    }
    async borrarEntrada(entrada: string): Promise<void> {
        this.validarEntrada(entrada);
        await this.mutex('papelera:' + entrada, async () => {
            try {
                await this.io.unlink(this.ruta('papelera', entrada));
            }
            catch (e) {
                if (!noExiste(e))
                    throw e;
            }
            await this.sincronizarDir(this.ruta('papelera'));
        });
    }
    async restaurar(entrada: string): Promise<Guardado> {
        this.validarEntrada(entrada);
        return this.mutex('papelera:' + entrada, async () => {
            let original: Buffer;
            try {
                original = await readFile(this.ruta('papelera', entrada));
            } catch (e) {
                if (noExiste(e))
                    throw new ErrorAlmacen(404, { error: 'Entrada no encontrada' });
                throw e;
            }
            const texto = decodificar(original);
            const r = this.o.canon.importarV0(texto);
            if (!r.ok || r.informe.rechazos.length)
                throw new ErrorAlmacen(400, { error: 'Documento inválido', informe: r.informe });
            if (r.informe.descartado.length)
                throw new ErrorAlmacen(422, { error: 'El documento pierde información al importarse', informe: r.informe });
            const historica = !this.o.canon.leerCanonico(texto).ok;
            const idOriginal = entradaPatron.exec(entrada)![1]!;
            let id = idOriginal;
            for (;;) {
                if (this.indice.has(id))
                    id = 'm-' + randomBytes(6).toString('hex');
                try {
                    const candidato = this.preparar(this.o.canon.exportarV0({ ...r.modelo, id }));
                    const resultado = await this.guardarCandidato(candidato, { crear: true },
                        historica ? () => this.respaldarFuente(entrada, idOriginal) : undefined);
                    await this.consumirFuente(entrada, original, historica);
                    return historica ? { ...resultado, canonicalizado: true, informe: r.informe } : resultado;
                } catch (e) {
                    if (e instanceof ErrorAlmacen && e.estado === 409) {
                        id = 'm-' + randomBytes(6).toString('hex');
                        continue;
                    }
                    if (historica && e instanceof ErrorAlmacen)
                        throw new ErrorAlmacen(e.estado, { ...e.cuerpo, informe: r.informe });
                    throw e;
                }
            }
        });
    }
    async purgar(): Promise<void> {
        for (const entrada of await readdir(this.ruta('papelera'))) {
            const p = entradaPatron.exec(entrada);
            if (p && this.ahora() - Date.parse(p[2]!) > 30 * 24 * 3600 * 1000)
                await this.borrarEntrada(entrada);
        }
    }
}
