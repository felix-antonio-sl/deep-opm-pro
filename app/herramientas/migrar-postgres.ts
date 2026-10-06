import { SQL } from 'bun';
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, lstat, readdir, readFile, open, link, unlink, realpath } from 'node:fs/promises';
import { dirname, join, resolve, relative, sep, basename } from 'node:path';
import { importarV0 } from '../src/codec/importar';
import { exportarV0 } from '../src/codec/exportar';
import { leerCanonico, ID_MODELO } from '../src/codec/canonico';
import type { Informe } from '../src/codec/informe';
import { diagnosticar } from '../src/nucleo/diagnostico';
import type { Diagnostico } from '../src/nucleo/diagnostico';
import type { Modelo } from '../src/nucleo/tipos';

export interface CuentaLegada { id: string; email: string; password_hash: string }
export interface FilaModeloLegada {
    tenant_id: string; id: string; nombre: string; carpeta_id: string | null;
    actualizado_en: string; archivado: boolean; revision: number; payload: string;
}
export interface AutosaveLegado { tenant_id: string; modelo_id: string; creado_en: string; payload: string }
export interface VersionLegada extends AutosaveLegado { id: string; nombre: string }
export interface IndiceLegado { tenant_id: string; indice: unknown }
export interface FuenteLegada {
    cuentas(): Promise<readonly CuentaLegada[]>;
    tenants(accountId: string): Promise<readonly string[]>;
    indices(tenants: readonly string[]): Promise<readonly IndiceLegado[]>;
    modelos(tenants: readonly string[]): Promise<readonly FilaModeloLegada[]>;
    autosaves(tenants: readonly string[]): Promise<readonly AutosaveLegado[]>;
    versiones(tenants: readonly string[]): Promise<readonly VersionLegada[]>;
}
export interface OpcionesMigracion {
    readonly datos: string; readonly email?: string; readonly ensayo?: boolean;
    readonly salida?: string; readonly reemplazar?: boolean; readonly ahora?: () => number;
    readonly io?: { readonly instalar: (archivo: string, contenido: string) => Promise<void> };
}
export interface EntradaMigracion {
    readonly tenant: string; readonly idOriginal: string; readonly id: string; readonly nombre: string;
    readonly fuente: 'guardado' | 'autosave'; readonly estado: 'modelos' | 'papelera' | 'rechazado' | 'fallo';
    readonly originales: readonly string[]; readonly versiones: readonly string[];
    readonly informeArchivo: string; readonly archivo?: string; readonly informe: Informe;
    readonly diagnosticos: readonly Diagnostico[];
}
export type ResultadoMigracion = { readonly ok: true; readonly archivo: string; readonly modelos: readonly EntradaMigracion[] }
    | { readonly ok: false; readonly error: string; readonly archivo?: string; readonly modelos?: readonly EntradaMigracion[] };
class ErrorMigracion extends Error {}
const falta = (e: unknown) => e !== null && typeof e === 'object' && 'code' in e && e.code === 'ENOENT';
const objeto = (x: unknown): Record<string, unknown> => x !== null && typeof x === 'object' && !Array.isArray(x) ? x as Record<string, unknown> : {};
const clave = (tenant: string, id: string) => JSON.stringify([tenant, id]);
const derivado = (dato: string) => `m-${createHash('sha256').update(dato).digest('hex').slice(0, 24)}`;
const contiene = (padre: string, hijo: string) => { const r = relative(padre, hijo); return !r || r !== '..' && !r.startsWith(`..${sep}`) && !r.startsWith(sep); };
// Comparación temporal completa: PostgreSQL conserva microsegundos, no sólo ms.
function fecha(texto: string): bigint {
    const m = /^(\d{4}-\d\d-\d\d[ T]\d\d:\d\d:\d\d)(?:\.(\d{1,9}))?(Z|[+-]\d\d(?::?\d\d)?)$/.exec(texto);
    const zona = m?.[3], offset = zona?.length === 3 ? zona + ':00' : zona?.length === 5 ? zona.slice(0, 3) + ':' + zona.slice(3) : zona;
    const segundos = m ? Date.parse(m[1]!.replace(' ', 'T') + offset!) : NaN;
    if (!m || !Number.isFinite(segundos)) throw new ErrorMigracion('Una marca de tiempo legada es inválida.');
    return BigInt(segundos) * 1_000_000n + BigInt((m[2] ?? '').padEnd(9, '0'));
}
async function ubicacion(p: string): Promise<string> {
    try { return await realpath(p); }
    catch (e) { if (!falta(e)) throw e; return join(await ubicacion(dirname(p)), basename(p)); }
}
// Comprueba componentes existentes antes de escribir; no sigue un symlink padre.
async function comprobarDirectorio(p: string): Promise<void> {
    const padre = dirname(p); if (padre !== p) await comprobarDirectorio(padre);
    try { const s = await lstat(p); if (!s.isDirectory() || s.isSymbolicLink()) throw new ErrorMigracion('El destino debe ser un directorio, sin enlaces simbólicos.'); }
    catch (e) { if (!falta(e)) throw e; }
}
async function directorio(p: string): Promise<void> {
    await comprobarDirectorio(p);
    const padre = dirname(p);
    try { await lstat(p); }
    catch (e) { if (!falta(e)) throw e; if (padre !== p) await directorio(padre); await mkdir(p, { mode: 0o700 }); }
}
// Archivo durable y publicación exclusiva: nunca reemplaza ni borra un original.
async function escribir(archivo: string, contenido: string): Promise<void> {
    await directorio(dirname(archivo));
    const temporal = join(dirname(archivo), `.tmp-migracion-${randomBytes(12).toString('hex')}`);
    const f = await open(temporal, 'wx', 0o600);
    try {
        try { await f.writeFile(contenido); await f.sync(); } finally { await f.close(); }
        await link(temporal, archivo);
        const d = await open(dirname(archivo), 'r'); try { await d.sync(); } finally { await d.close(); }
    } finally { await unlink(temporal); }
}
function asignar(id: string, procedencia: string, ocupados: Set<string>): string {
    let candidato = ID_MODELO.test(id) ? id : derivado(procedencia);
    const base = derivado(procedencia); let n = 0;
    while (ocupados.has(candidato)) candidato = n++ ? `${base}-${n}` : base;
    ocupados.add(candidato); return candidato;
}
function conteos(m: Modelo) {
    return { cosas: Object.keys(m.cosas).length, estados: Object.values(m.cosas).reduce((n, c) => n + (c.tipo === 'objeto' ? c.estados.length : 0), 0),
        enlaces: Object.keys(m.enlaces).length, abanicos: Object.keys(m.abanicos).length, opds: Object.keys(m.opds).length };
}
function anteriores(texto: string) {
    try {
        const d = objeto(JSON.parse(texto)), m = objeto(d.modelo);
        return { cosas: Object.keys(objeto(m.entidades)).length, estados: Object.keys(objeto(m.estados)).length,
            enlaces: Object.keys(objeto(m.enlaces)).length, abanicos: Object.keys(objeto(m.abanicos)).length, opds: Object.keys(objeto(m.opds)).length };
    } catch { return null; }
}
const bloque = (dato: unknown) => `\n\`\`\`json\n${JSON.stringify(dato, null, 2)}\n\`\`\`\n`;

export async function migrar(fuente: FuenteLegada, opciones: OpcionesMigracion): Promise<ResultadoMigracion> {
    let archivo: string | undefined;
    const resultados: EntradaMigracion[] = [];
    try {
        const datos = resolve(opciones.datos);
        if (opciones.ensayo && !opciones.salida) throw new ErrorMigracion('El ensayo requiere --salida separada.');
        const destino = opciones.ensayo ? resolve(opciones.salida!) : datos;
        if (opciones.ensayo) {
            const a = await ubicacion(datos), b = await ubicacion(destino);
            if (contiene(a, b) || contiene(b, a)) throw new ErrorMigracion('La salida de ensayo no puede solaparse con los datos.');
        }
        for (const p of [destino, join(destino, 'archivo'), join(destino, 'modelos'), join(destino, 'papelera')]) await comprobarDirectorio(p);
        // Toda selección/validación de origen precede a cualquier escritura.
        const cuentas = await fuente.cuentas(), seleccion = opciones.email ? cuentas.filter(c => c.email === opciones.email) : cuentas;
        if (seleccion.length !== 1) throw new ErrorMigracion('Debe seleccionarse una cuenta existente y única con --email.');
        const cuenta = seleccion[0]!;
        if (!cuenta.email || !cuenta.password_hash || !cuenta.id) throw new ErrorMigracion('La cuenta legada está incompleta.');
        const tenants = [...new Set(await fuente.tenants(cuenta.id))];
        if (!tenants.length || tenants.some(t => typeof t !== 'string' || !t)) throw new ErrorMigracion('La cuenta no tiene tenants válidos.');
        const indices = await fuente.indices(tenants), modelos = await fuente.modelos(tenants), autosaves = await fuente.autosaves(tenants), versiones = await fuente.versiones(tenants);
        for (const row of [...indices, ...modelos, ...autosaves, ...versiones])
            if (!tenants.includes(row.tenant_id)) throw new ErrorMigracion('La fuente devolvió datos de un tenant no seleccionado.');
        const vistos = new Set<string>();
        for (const m of modelos) {
            const k = clave(m.tenant_id, m.id);
            if (vistos.has(k)) throw new ErrorMigracion('Hay una fila de modelo duplicada dentro de su tenant.');
            vistos.add(k); fecha(m.actualizado_en);
            if (typeof m.payload !== 'string' || typeof m.nombre !== 'string' || typeof m.id !== 'string') throw new ErrorMigracion('Una fila de modelo está incompleta.');
        }
        for (const a of autosaves) { fecha(a.creado_en); if (typeof a.payload !== 'string') throw new ErrorMigracion('Autosave sin payload textual.'); }
        for (const v of versiones) if (typeof v.payload !== 'string') throw new ErrorMigracion('Versión sin payload textual.');
        const nuevaCuenta = { email: cuenta.email, hashClave: cuenta.password_hash, versionCredencial: 1 };
        let existeCuenta = false;
        try {
            const p = join(destino, 'cuenta.json'); if ((await lstat(p)).isSymbolicLink()) throw new ErrorMigracion('La cuenta de destino no puede ser un enlace.');
            const anterior: unknown = JSON.parse(await readFile(p, 'utf8'));
            if (JSON.stringify(anterior) !== JSON.stringify(nuevaCuenta)) throw new ErrorMigracion('La cuenta de destino es distinta; no se reemplaza.');
            existeCuenta = true;
        } catch (e) { if (!falta(e)) throw e; }
        const ocupados = new Set<string>();
        for (const coleccion of ['modelos', 'papelera']) {
            const p = join(destino, coleccion);
            try {
                const tipo = await lstat(p);
                if (!tipo.isDirectory() || tipo.isSymbolicLink()) throw new ErrorMigracion('Una colección de destino no es un directorio seguro.');
                const entradas = await readdir(p, { withFileTypes: true });
                if (coleccion === 'modelos' && entradas.length && !opciones.reemplazar) throw new ErrorMigracion('modelos/ no está vacío; requiere --reemplazar.');
                for (const e of entradas) {
                    if (e.isSymbolicLink()) throw new ErrorMigracion('No se escriben colecciones con enlaces simbólicos.');
                    if (e.name.endsWith('.json')) {
                        const idPapelera = /^(.+)--\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z--(?:eliminado|reemplazado)\.json$/.exec(e.name)?.[1];
                        ocupados.add(coleccion === 'papelera' ? idPapelera ?? e.name.split('--')[0]! : e.name.slice(0, -5));
                    }
                }
            } catch (e) { if (!falta(e)) throw e; }
        }
        await directorio(destino);
        if (!existeCuenta) await escribir(join(destino, 'cuenta.json'), JSON.stringify(nuevaCuenta));
        const instante = new Date((opciones.ahora ?? Date.now)()).toISOString();
        archivo = join('archivo', `migracion-${instante.replace(/:/g, '-')}-${randomBytes(6).toString('hex')}`);
        await directorio(join(destino, archivo));
        await escribir(join(destino, archivo, 'indices.json'), JSON.stringify(indices, null, 2));
        const porModelo = new Map<string, string>(), fuentesPorModelo = new Map<string, AutosaveLegado[]>();
        for (const m of modelos) porModelo.set(clave(m.tenant_id, m.id), asignar(m.id, clave(m.tenant_id, m.id), ocupados));
        for (const a of autosaves) { const k = clave(a.tenant_id, a.modelo_id), xs = fuentesPorModelo.get(k) ?? []; xs.push(a); fuentesPorModelo.set(k, xs); }
        const fuentesArchivadas: { tenant: string; modelo: string; tipo: string; ruta: string; creado?: string }[] = [];
        // Una fuente huérfana también se recupera, pero nunca inventa un modelo.
        for (const [k, autos] of fuentesPorModelo) {
            if (vistos.has(k)) continue;
            const a = autos[0]!; const id = porModelo.get(k) ?? asignar(a.modelo_id, k, ocupados); porModelo.set(k, id);
            for (const [n, auto] of autos.entries()) {
                const ruta = join(archivo, 'originales', 'autosaves', id, `${n + 1}.json`);
                await escribir(join(destino, ruta), auto.payload);
                fuentesArchivadas.push({tenant: auto.tenant_id, modelo: auto.modelo_id, tipo: 'autosave sin fila', creado: auto.creado_en, ruta});
            }
        }
        const versionesPorModelo = new Map<string, string[]>();
        const versionesOcupadas = new Map<string, Set<string>>();
        for (const v of versiones) {
            const k = clave(v.tenant_id, v.modelo_id);
            if (!porModelo.has(k)) porModelo.set(k, asignar(v.modelo_id, k, ocupados));
            const id = porModelo.get(k)!, vs = versionesOcupadas.get(id) ?? new Set<string>(); versionesOcupadas.set(id, vs);
            const ruta = join(archivo, 'versiones', id, `${asignar(v.id, JSON.stringify([k, v.id]), vs)}.json`);
            await escribir(join(destino, ruta), v.payload);
            fuentesArchivadas.push({tenant: v.tenant_id, modelo: v.modelo_id, tipo: 'versión', creado: v.creado_en, ruta});
            const xs = versionesPorModelo.get(k) ?? []; xs.push(ruta); versionesPorModelo.set(k, xs);
        }
        let fallos = 0;
        for (const m of modelos) {
            const k = clave(m.tenant_id, m.id), id = porModelo.get(k)!, autos = fuentesPorModelo.get(k) ?? [];
            const originales = [join(archivo, 'originales', `${id}.json`)];
            await escribir(join(destino, originales[0]!), m.payload);
            fuentesArchivadas.push({tenant: m.tenant_id, modelo: m.id, tipo: 'guardado', creado: m.actualizado_en, ruta: originales[0]!});
            for (const [n, a] of autos.entries()) {
                const ruta = join(archivo, 'originales', 'autosaves', id, `${n + 1}.json`); originales.push(ruta);
                await escribir(join(destino, ruta), a.payload);
                fuentesArchivadas.push({tenant: a.tenant_id, modelo: a.modelo_id, tipo: 'autosave', creado: a.creado_en, ruta});
            }
            let elegida: AutosaveLegado | undefined;
            for (const a of autos) if (fecha(a.creado_en) > fecha(m.actualizado_en) && (!elegida || fecha(a.creado_en) > fecha(elegida.creado_en))) elegida = a;
            const texto = elegida?.payload ?? m.payload, r = importarV0(texto), informeArchivo = join(archivo, 'informes', `${id}.md`);
            let estado: EntradaMigracion['estado'] = 'rechazado', ruta: string | undefined;
            let diagnosticos: readonly Diagnostico[] = [], canon: Modelo | undefined;
            if (r.ok) {
                canon = { ...r.modelo, id, nombre: m.nombre }; diagnosticos = diagnosticar(canon);
                estado = m.archivado ? 'papelera' : 'modelos';
                ruta = m.archivado ? join('papelera', `${id}--${instante}--eliminado.json`) : join('modelos', `${id}.json`);
                try {
                    await directorio(join(destino, estado));
                    await (opciones.io?.instalar ?? escribir)(join(destino, ruta), exportarV0(canon));
                } catch { estado = 'fallo'; fallos++; ruta = undefined; }
            } else {
                ruta = join(archivo, 'rechazados', `${id}.json`); await escribir(join(destino, ruta), texto);
            }
            const entrada: EntradaMigracion = { tenant: m.tenant_id, idOriginal: m.id, id, nombre: m.nombre, fuente: elegida ? 'autosave' : 'guardado', estado,
                originales, versiones: versionesPorModelo.get(k) ?? [], informeArchivo, ...(ruta ? { archivo: ruta } : {}), informe: r.informe, diagnosticos };
            resultados.push(entrada);
            let raw: Record<string, unknown> = {}; try { raw = objeto(JSON.parse(texto)); } catch { /* Original rechazado preservado sin interpretar. */ }
            const indiceViejo = indices.filter(x => x.tenant_id === m.tenant_id);
            const detalle = { tenant: m.tenant_id, idRegistro: m.id, idInstalado: id, nombreRegistro: m.nombre,
                nombrePayload: r.ok ? r.modelo.nombre : null, idPayload: r.ok ? r.modelo.id : null,
                carpetaColumna: m.carpeta_id, carpetaPayload: raw.carpetaId ?? objeto(raw.modelo).carpetaId ?? null,
                indice: indiceViejo, archivado: m.archivado, revision: m.revision, fuente: entrada.fuente, estado,
                antes: anteriores(texto), despues: canon ? conteos(canon) : null, originales, versiones: entrada.versiones };
            await escribir(join(destino, informeArchivo), `# ${m.nombre}\n\n## Procedencia, carpeta/especie y diferencias\n${bloque(detalle)}\n## Informe completo del códec\n${bloque(r.informe)}\n## Visibilidad por OPD\n${bloque(r.informe.visibilidad)}\n## Diagnósticos, códigos y reparaciones\n${bloque(diagnosticos)}${estado === 'fallo' ? '\nLa instalación falló; originales y versiones permanecen recuperables.\n' : ''}`);
        }
        const totales = { filas: resultados.length, instalados: resultados.filter(m => m.estado === 'modelos').length,
            papelera: resultados.filter(m => m.estado === 'papelera').length, rechazados: resultados.filter(m => m.estado === 'rechazado').length,
            fallos, versiones: versiones.length, autosaves: autosaves.length };
        const tabla = resultados.map(m => `| ${m.id} | ${m.estado} | ${m.fuente} | [Informe](informes/${m.id}.md) |`).join('\n');
        const enlacesFuentes = fuentesArchivadas.map(f => { const p = f.ruta.slice(archivo!.length + 1); return `- [${p}](${p})`; }).join('\n');
        await escribir(join(destino, archivo, 'INFORME.md'), `# Migración\n${bloque(totales)}\n| Modelo | Estado | Fuente | Informe |\n|---|---|---|---|\n${tabla}\n\n## Fuentes archivadas\n${enlacesFuentes}\n${bloque(fuentesArchivadas)}\n## Versiones y procedencia completa\n${bloque(versiones.map(v => ({ tenant: v.tenant_id, modelo: v.modelo_id, id: v.id, nombre: v.nombre, creado: v.creado_en, destino: porModelo.get(clave(v.tenant_id, v.modelo_id)) })))}\n`);
        return fallos ? { ok: false, error: 'Hubo fallos de instalación; consulte el informe y los originales.', archivo, modelos: resultados } : { ok: true, archivo, modelos: resultados };
    } catch (e) {
        return { ok: false, error: e instanceof ErrorMigracion ? e.message : 'No se pudo completar la migración; la fuente no fue modificada.', ...(archivo ? { archivo } : {}), modelos: resultados };
    }
}

export async function verificar(datos: string): Promise<{ readonly ok: boolean; readonly errores: readonly { archivo: string; mensaje: string }[] }> {
    const errores: { archivo: string; mensaje: string }[] = [], carpeta = join(resolve(datos), 'modelos');
    try {
        const tipo = await lstat(carpeta);
        if (!tipo.isDirectory() || tipo.isSymbolicLink()) throw Error('colección');
        for (const e of await readdir(carpeta, { withFileTypes: true })) {
            if (!e.name.endsWith('.json')) continue;
            try {
                if (!e.isFile() || e.isSymbolicLink() || !ID_MODELO.test(e.name.slice(0, -5))) throw Error('archivo');
                const texto = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await readFile(join(carpeta, e.name))), r = leerCanonico(texto);
                if (!r.ok || r.valor.id !== e.name.slice(0, -5)) errores.push({ archivo: e.name, mensaje: 'No es v0 canónico con identidad concordante.' });
            } catch { errores.push({ archivo: e.name, mensaje: 'No se pudo verificar el archivo sin alterarlo.' }); }
        }
    } catch { errores.push({ archivo: 'modelos/', mensaje: 'No se pudo leer la colección de modelos.' }); }
    return { ok: errores.length === 0, errores };
}

export function fuenteSql(consulta: (sql: string, params: readonly unknown[]) => Promise<readonly Record<string, unknown>[]>): FuenteLegada {
    const leer = async <T>(sql: string, params: readonly unknown[]): Promise<readonly T[]> => await consulta(sql, params) as unknown as readonly T[];
    return {
        cuentas: () => leer('SELECT id, email, password_hash FROM opforja_accounts', []),
        tenants: async id => (await leer<{ tenant_id: string }>('SELECT tenant_id FROM opforja_account_tenants WHERE account_id = $1', [id])).map(t => t.tenant_id),
        indices: ts => leer('SELECT tenant_id, indice FROM opforja_workspaces WHERE tenant_id = ANY($1)', [ts]),
        modelos: ts => leer('SELECT tenant_id, id, nombre, carpeta_id, actualizado_en::text AS actualizado_en, archivado, revision, payload::text AS payload FROM opforja_models WHERE tenant_id = ANY($1) ORDER BY tenant_id, id', [ts]),
        autosaves: ts => leer('SELECT tenant_id, modelo_id, creado_en::text AS creado_en, payload::text AS payload FROM opforja_model_autosaves WHERE tenant_id = ANY($1)', [ts]),
        versiones: ts => leer('SELECT tenant_id, modelo_id, id, nombre, creado_en::text AS creado_en, payload::text AS payload FROM opforja_model_versions WHERE tenant_id = ANY($1) ORDER BY tenant_id, modelo_id, id', [ts]),
    };
}
// Adaptador estructural inyectable; el driver real recibe TEXT[], nunca JSON implícito.
export function fuenteBunSql(db: {
    array(values: string[], type: 'TEXT'): unknown;
    unsafe(sql: string, params: unknown[]): Promise<readonly Record<string, unknown>[]>;
}): FuenteLegada {
    return fuenteSql((sql, params) => db.unsafe(sql, params.map(p => Array.isArray(p) ? db.array(p, 'TEXT') : p)));
}
export async function ejecutarMigracion(args: readonly string[], o: { readonly fuente?: FuenteLegada; readonly salida?: (texto: string) => void } = {}): Promise<number> {
    const salida = o.salida ?? (() => {}), valores = new Map<string, string>(), flags = new Set<string>();
    for (let i = 0; i < args.length; i++) {
        const a = args[i]!;
        if (['--ensayo', '--reemplazar', '--verificar'].includes(a) && !flags.has(a)) flags.add(a);
        else if (['--datos', '--url', '--email', '--salida'].includes(a) && !valores.has(a) && args[i + 1] && !args[i + 1]!.startsWith('--')) valores.set(a, args[++i]!);
        else { salida('Argumentos inválidos. Use --url [--email] --datos, o --verificar --datos.'); return 1; }
    }
    const datos = valores.get('--datos') ?? '/datos';
    if (flags.has('--verificar')) {
        if (flags.size !== 1 || [...valores.keys()].some(k => k !== '--datos')) { salida('Verificar sólo acepta --datos.'); return 1; }
        const r = await verificar(datos); for (const e of r.errores) salida(`${e.archivo}: ${e.mensaje}`); return r.ok ? 0 : 1;
    }
    if (!valores.has('--url') || valores.has('--salida') && !flags.has('--ensayo') || flags.has('--ensayo') && !valores.has('--salida')) { salida('Falta --url; ensayo requiere --salida separada.'); return 1; }
    let db: SQL | undefined;
    try {
        const fuente = o.fuente ?? fuenteBunSql({ array: (values, type) => { db ??= new SQL(valores.get('--url')!); return db.array(values, type); }, unsafe: async (sql, params) => { db ??= new SQL(valores.get('--url')!); return await db.unsafe(sql, params); } });
        const r = await migrar(fuente, { datos, ensayo: flags.has('--ensayo'), reemplazar: flags.has('--reemplazar'),
            ...(valores.has('--salida') ? { salida: valores.get('--salida')! } : {}), ...(valores.has('--email') ? { email: valores.get('--email')! } : {}) });
        salida(r.ok ? `Migración completada; ${r.modelos.length} filas con informes.` : r.error); return r.ok ? 0 : 1;
    } catch { salida('No se pudo leer la fuente legada.'); return 1; }
    finally { await db?.close().catch(() => {}); }
}
if (import.meta.main) process.exitCode = await ejecutarMigracion(Bun.argv.slice(2), { salida: texto => console.log(texto) });
