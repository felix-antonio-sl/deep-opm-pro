import {test,expect,afterEach} from 'bun:test';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {hashPassword,verifyPassword,leerCuenta,ejecutarCuenta} from './cuenta';
const vector = {"email": "operador@example.test", "clave": "Solo-prueba-WP11-2026", "hashClave": "scrypt$16384$8$1$X4SjTVHnKHoxcZYA7vLQjA$s_YgLWfNWaoyEzhJYpjkWMOUH6z6DSC4kFGXkxbxmLd_H6WgAQCcB9vHnD53Rp9ux6Ppl2zoq8CptXel4X31Ew", "versionCredencial": 1};
const dirs:string[]=[];
afterEach(async()=>{await Promise.all(dirs.splice(0).map(d=>rm(d,{recursive:true,force:true})));});
async function datos(){const d=await mkdtemp(join(tmpdir(),'opforja-cuenta-prueba-'));dirs.push(d);return d;}
test('WP-11 §8.2 hash scrypt legado independiente: clave válida e incorrecta',()=>{
 expect(verifyPassword(vector.clave,vector.hashClave)).toBe(true);
 expect(verifyPassword('incorrecta-sintetica',vector.hashClave)).toBe(false);
});
test('WP-11 §8.2 hash nuevo conserva formato scrypt y sal independiente',()=>{
 const a=hashPassword('clave-sintetica-larga'),b=hashPassword('clave-sintetica-larga');
 expect(a).toMatch(/^scrypt\$16384\$8\$1\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/);expect(a).not.toBe(b);
 expect(verifyPassword('clave-sintetica-larga',a)).toBe(true);
 for(const x of ['', 'scrypt$NaN$8$1$abc$abc','scrypt$16384$8$1$abc$'])expect(verifyPassword('prueba',x)).toBe(false);
});
test('WP-11 §8.2 CLI crear: dos claves y cuenta única sin sobrescritura',async()=>{
 const d=await datos(),args=['crear','prueba@example.test','--datos',d];
 expect(await ejecutarCuenta(args,'clave-sintetica-larga\nclave-sintetica-larga\n')).toBe(0);
 const c=await leerCuenta(d);expect(c?.email).toBe('prueba@example.test');expect(c?.versionCredencial).toBe(1);expect(verifyPassword('clave-sintetica-larga',c!.hashClave)).toBe(true);
 const antes=await readFile(join(d,'cuenta.json'),'utf8');expect(await ejecutarCuenta(args,'otra-clave-sintetica\notra-clave-sintetica\n')).toBe(1);expect(await readFile(join(d,'cuenta.json'),'utf8')).toBe(antes);
});
test('WP-11 §8.2 CLI rechaza claves cortas/distintas y cuenta ausente',async()=>{
 const d=await datos();expect(await leerCuenta(d)).toBeNull();
 expect(await ejecutarCuenta(['crear','prueba@example.test','--datos',d],'corta\ncorta\n')).toBe(1);
 expect(await ejecutarCuenta(['crear','prueba@example.test','--datos',d],'clave-sintetica-larga\notra-clave-sintetica\n')).toBe(1);
 expect(await leerCuenta(d)).toBeNull();expect(await ejecutarCuenta(['cerrar-sesiones','--datos',d],'')).toBe(1);
});
test('WP-11 §8.2 CLI clave y cerrar-sesiones suben versión, hash válido y email conservado',async()=>{
 const d=await datos();await ejecutarCuenta(['crear','prueba@example.test','--datos',d],'clave-sintetica-larga\nclave-sintetica-larga\n');
 expect(await ejecutarCuenta(['clave','--datos',d],'clave-nueva-sintetica\nclave-nueva-sintetica\n')).toBe(0);
 let c=await leerCuenta(d);expect(c?.versionCredencial).toBe(2);expect(verifyPassword('clave-nueva-sintetica',c!.hashClave)).toBe(true);
 expect(verifyPassword('clave-sintetica-larga',c!.hashClave)).toBe(false);
 expect(await ejecutarCuenta(['cerrar-sesiones','--datos',d],'')).toBe(0);c=await leerCuenta(d);expect(c?.versionCredencial).toBe(3);expect(c?.email).toBe('prueba@example.test');
});

test('WP-11 §8.2 CLI real por stdin sintético y --datos: crear, clave, cerrar-sesiones',async()=>{
 const raiz=await mkdtemp(join(tmpdir(),'opforja-cuenta-entry-prueba-'));dirs.push(raiz);
 const ejecutar=async(args:string[],entrada:string)=>{const h=Bun.spawn([process.execPath,'--no-env-file',join(import.meta.dir,'cuenta.ts'),...args,'--datos',raiz],{env:{PATH:'/tmp/opforja-rehacer-tools:/usr/bin:/bin'},stdin:new Blob([entrada]),stdout:'pipe',stderr:'pipe'});const [texto,error,codigo]=await Promise.all([new Response(h.stdout).text(),new Response(h.stderr).text(),h.exited]);expect(texto).not.toContain('clave-entry-sintetica');expect(error).toBe('');return codigo;};
 expect(await ejecutar(['crear','cli@example.test'],'clave-entry-sintetica\nclave-entry-sintetica\n')).toBe(0);expect((await leerCuenta(raiz))?.versionCredencial).toBe(1);expect(await ejecutar(['crear','otro@example.test'],'clave-entry-sintetica\nclave-entry-sintetica\n')).toBe(1);expect(await ejecutar(['clave'],'clave-entry-sintetica-nueva\nclave-entry-sintetica-nueva\n')).toBe(0);expect(await ejecutar(['cerrar-sesiones'],'')).toBe(0);const c=await leerCuenta(raiz);expect(c?.email).toBe('cli@example.test');expect(c?.versionCredencial).toBe(3);expect(verifyPassword('clave-entry-sintetica-nueva',c!.hashClave)).toBe(true);
});

test('WP-11 §8.2 físico cuenta sintética UTF8 ilegible no fabrica email por sustitución',async()=>{
 const d=await datos(),texto=JSON.stringify({email:'\uFFFD@example.test',hashClave:vector.hashClave,versionCredencial:1}),valido=Buffer.from(texto),i=valido.indexOf(Buffer.from([239,191,189]));await writeFile(join(d,'cuenta.json'),valido);expect((await leerCuenta(d))?.email).toBe('\uFFFD@example.test');const invalido=Buffer.concat([valido.subarray(0,i),Buffer.from([255]),valido.subarray(i+3)]);await writeFile(join(d,'cuenta.json'),invalido);await expect(leerCuenta(d)).rejects.toThrow();expect(await ejecutarCuenta(['cerrar-sesiones','--datos',d],'')).toBe(1);expect(await readFile(join(d,'cuenta.json'))).toEqual(invalido);
});
