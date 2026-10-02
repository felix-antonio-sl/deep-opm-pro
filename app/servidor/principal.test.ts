import {test,expect,afterEach} from 'bun:test';
import {mkdtemp,rm,mkdir,writeFile,readdir,readFile} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {createHash} from 'node:crypto';
import {crearServidor} from './principal';import {hashPassword,ejecutarCuenta} from './cuenta';
import {leerCanonico,revision,resumen} from '../src/codec/canonico';import {importarV0} from '../src/codec/importar';import {exportarV0} from '../src/codec/exportar';import {modeloCon} from '../src/pruebas/constructores';
const canon={leerCanonico,revision,resumen,importarV0,exportarV0};const token='token-sintetico-'.repeat(5),secreto='secreto-sintetico-'.repeat(5),clave='clave-sintetica-larga';
const limpieza:(()=>Promise<void>)[]=[];afterEach(async()=>{await Promise.all(limpieza.splice(0).map(f=>f()));});
const documento=(id='m-alfa',nombre='Modelo de prueba')=>exportarV0({...modeloCon(),id,nombre});
async function preparar(conToken=true,activos=0){const raiz=await mkdtemp(join(tmpdir(),'opforja-http-prueba-')),datos=join(raiz,'datos'),web=join(raiz,'web');await mkdir(datos);await mkdir(join(web,'assets'),{recursive:true});await writeFile(join(datos,'cuenta.json'),JSON.stringify({email:'prueba@example.test',hashClave:hashPassword(clave),versionCredencial:1}));await writeFile(join(web,'index.html'),'<!doctype html><h1>SPA sintética</h1>');await writeFile(join(web,'assets/app.js'),'console.log("sintetico")');
 if(activos){await mkdir(join(datos,'modelos'));await Promise.all(Array.from({length:activos},(_,i)=>writeFile(join(datos,'modelos',`m-cuota-${i}.json`),documento(`m-cuota-${i}`))));}
 let ahora=Date.UTC(2026,0,1);const logs:Readonly<Record<string,unknown>>[]=[];const s=await crearServidor({datos,web,secreto,...(conToken?{token}:{}),version:'prueba-sha',canon,puerto:0,hostname:'127.0.0.1',ahora:()=>ahora,log:e=>logs.push(e)});
 limpieza.push(async()=>{await s.cerrar();await rm(raiz,{recursive:true,force:true});});const base='http://127.0.0.1:'+s.servidor.port;
 const llamar=(ruta:string,method='GET',body?:string,headers:Record<string,string>={})=>fetch(base+ruta,{method,...(body!==undefined?{body}:{}),headers:{authorization:'Bearer '+token,...headers}});
 return {s,base,datos,web,logs,llamar,avanzar:(ms:number)=>ahora+=ms};
}
function cabeceras(r:Response){expect(r.headers.get('x-opforja-version')).toBe('prueba-sha');expect(r.headers.get('x-content-type-options')).toBe('nosniff');expect(r.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");expect(r.headers.get('referrer-policy')).toBe('no-referrer');expect(r.headers.get('permissions-policy')).toContain('camera=()');}
test('WP-11 §8.1 salud, estáticos, SPA, seguridad y API desconocida404',async()=>{
 const p=await preparar();for(const [ruta,estado]of [['/salud',200],['/biblioteca',200],['/assets/app.js',200],['/assets/ausente.js',404],['/api/no-existe',404]] as const){const r=await fetch(p.base+ruta);expect(r.status).toBe(estado);cabeceras(r);if(ruta==='/salud')expect(await r.json()).toEqual({ok:true,version:'prueba-sha'});if(ruta==='/biblioteca'){expect(await r.text()).toContain('SPA sintética');expect(r.headers.get('cache-control')).toBe('no-store');}if(ruta==='/assets/app.js')expect(r.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');}
});
test('WP-11 §8.1 todas rutas de modelos, ETag, descarga, 409/428/412/404/204',async()=>{
 const p=await preparar();let r=await p.llamar('/api/modelos','POST',documento());expect(r.status).toBe(201);cabeceras(r);const creado=await r.json() as {id:string;rev:string};expect(creado).toEqual({id:'m-alfa',rev:createHash('sha256').update(documento()).digest('hex')});
 r=await p.llamar('/api/modelos');expect(r.status).toBe(200);expect((await r.json() as {modelos:unknown[]}).modelos).toHaveLength(1);
 r=await p.llamar('/api/modelos/m-alfa?descargar=1');expect(r.status).toBe(200);expect(r.headers.get('etag')).toBe('"'+creado.rev+'"');expect(r.headers.get('content-disposition')).toContain('Modelo-de-prueba.opforja.json');expect(await r.text()).toBe(documento());
 expect((await p.llamar('/api/modelos','POST',documento())).status).toBe(409);expect((await p.llamar('/api/modelos/m-alfa','PUT',documento())).status).toBe(428);
 r=await p.llamar('/api/modelos/m-alfa','PUT',documento('m-alfa','Cambio'),{'if-match':'"incorrecta"'});expect(r.status).toBe(412);expect((await r.json() as {rev:string}).rev).toBe(creado.rev);
 expect((await p.llamar('/api/modelos/m-alfa','PUT',documento('m-otro'),{'if-match':'"'+creado.rev+'"'})).status).toBe(400);
 r=await p.llamar('/api/modelos/m-alfa','PUT',documento('m-alfa','Cambio'),{'if-match':'"'+creado.rev+'"'});expect(r.status).toBe(200);const actual=await r.json() as {rev:string};expect(actual.rev).not.toBe(creado.rev);
 expect((await p.llamar('/api/modelos/m-alfa','DELETE',undefined,{'if-match':'"'+creado.rev+'"'})).status).toBe(412);
 r=await p.llamar('/api/modelos/m-alfa','DELETE',undefined,{'if-match':'"'+actual.rev+'"'});expect(r.status).toBe(204);cabeceras(r);expect(await r.text()).toBe('');
 expect((await p.llamar('/api/modelos/m-alfa')).status).toBe(404);expect((await p.llamar('/api/modelos/m-alfa','PUT',documento(),{'if-match':'"'+actual.rev+'"'})).status).toBe(404);expect((await p.llamar('/api/modelos/m-alfa','DELETE')).status).toBe(404);
});
test('WP-11 §8.1 papelera: respaldo, restauración con colisión y borrado definitivo',async()=>{
 const p=await preparar();const creado=await (await p.llamar('/api/modelos','POST',documento())).json() as {rev:string};expect((await p.llamar('/api/modelos/m-alfa?respaldo=1','PUT',documento('m-alfa','Cambio'),{'if-match':'"'+creado.rev+'"'})).status).toBe(200);
 let r=await p.llamar('/api/papelera');expect(r.status).toBe(200);const e=(await r.json() as {entradas:{entrada:string;motivo:string}[]}).entradas[0]!;expect(e.motivo).toBe('reemplazado');r=await p.llamar('/api/papelera/'+encodeURIComponent(e.entrada)+'/restaurar','POST');expect(r.status).toBe(201);const nuevo=await r.json() as {id:string;rev:string};expect(nuevo.id).not.toBe('m-alfa');expect(JSON.parse(await (await p.llamar('/api/modelos/'+nuevo.id)).text()).modelo.id).toBe(nuevo.id);
 expect((await p.llamar('/api/papelera/'+encodeURIComponent(e.entrada)+'/restaurar','POST')).status).toBe(404);
 expect((await p.llamar('/api/modelos/m-alfa','DELETE')).status).toBe(204);const d=(await (await p.llamar('/api/papelera')).json() as {entradas:{entrada:string}[]}).entradas[0]!;expect((await p.llamar('/api/papelera/'+encodeURIComponent(d.entrada),'DELETE')).status).toBe(204);expect((await (await p.llamar('/api/papelera')).json() as {entradas:unknown[]}).entradas).toEqual([]);
});
test('T-287 HTTP canonicalización, 400,422 e informe; aceptación explícita de pérdida',async()=>{
 const p=await preparar();let r=await p.llamar('/api/modelos','POST',JSON.stringify(JSON.parse(documento())));expect(r.status).toBe(201);expect((await r.json() as {canonicalizado:boolean}).canonicalizado).toBe(true);
 r=await p.llamar('/api/modelos','POST','{');expect(r.status).toBe(400);expect((await r.json() as {informe:unknown}).informe).toBeDefined();
 const d=JSON.parse(documento('m-perdida'));d.modelo.extension='dato-sintetico-no-representable';r=await p.llamar('/api/modelos','POST',JSON.stringify(d));expect(r.status).toBe(422);cabeceras(r);expect((await r.json() as {error:string}).error).toBe('El documento pierde información al importarse');
 r=await p.llamar('/api/modelos?aceptarPerdidas=1','POST',JSON.stringify(d));expect(r.status).toBe(201);expect((await r.json() as {informe:{descartado:unknown[]}}).informe.descartado.length).toBeGreaterThan(0);
});
test('T-287 CC16 IDs de cuerpo originales y ruta inválidos404 antes de archivos',async()=>{
 const p=await preparar();for(const id of ['.tmp-x','../fuera','modelo ','área','x'.repeat(81)])expect((await p.llamar('/api/modelos','POST',documento(id))).status).toBe(400);
 for(const ruta of ['/api/modelos/.tmp-x','/api/modelos/%2F','/api/modelos/%252e%252e','/api/modelos/x%20','/api/papelera/%2F/restaurar']){const r=await p.llamar(ruta,ruta.endsWith('/restaurar')?'POST':'GET');expect(r.status).toBe(404);cabeceras(r);}
 expect(await readdir(join(p.datos,'modelos'))).toEqual([]);expect(await readdir(join(p.datos,'papelera'))).toEqual([]);
});
test('WP-11 §8.2 cookie login/GET/logout, CSRF, Origin y cambios de cuenta reales',async()=>{
 const p=await preparar();let r=await fetch(p.base+'/api/sesion',{method:'POST',body:JSON.stringify({email:'prueba@example.test',clave})});expect(r.status).toBe(204);cabeceras(r);const cookie=r.headers.get('set-cookie')!.split(';')[0]!;
 r=await fetch(p.base+'/api/sesion',{headers:{cookie}});expect(r.status).toBe(200);expect(await r.json()).toEqual({email:'prueba@example.test'});
 expect((await fetch(p.base+'/api/modelos',{method:'POST',headers:{cookie},body:documento()})).status).toBe(403);
 expect((await fetch(p.base+'/api/modelos',{method:'POST',headers:{cookie,'x-opforja':'1',origin:'http://otro.test'},body:documento()})).status).toBe(403);
 expect((await fetch(p.base+'/api/modelos',{method:'POST',headers:{cookie,'x-opforja':'1'},body:documento()})).status).toBe(201);
 r=await fetch(p.base+'/api/sesion',{method:'DELETE',headers:{cookie,'x-opforja':'1'}});expect(r.status).toBe(204);expect(r.headers.get('set-cookie')).toContain('Max-Age=0');
 expect(await ejecutarCuenta(['clave','--datos',p.datos],'clave-nueva-sintetica\nclave-nueva-sintetica\n')).toBe(0);expect((await fetch(p.base+'/api/modelos',{headers:{cookie}})).status).toBe(401);
});
test('WP-11 §8.2 Bearer sin configuración, token inválido, precedencia y sesión específica',async()=>{
 const p=await preparar(false);expect((await p.llamar('/api/modelos')).status).toBe(401);const q=await preparar();expect((await q.llamar('/api/modelos', 'GET',undefined,{authorization:'Bearer incorrecto'})).status).toBe(401);expect((await q.llamar('/api/sesion')).status).toBe(401);expect((await q.llamar('/api/sesion','DELETE')).status).toBe(400);
 let r=await fetch(q.base+'/api/sesion',{method:'POST',body:JSON.stringify({email:'prueba@example.test',clave})});const cookie=r.headers.get('set-cookie')!.split(';')[0]!;expect((await q.llamar('/api/modelos','GET',undefined,{cookie,authorization:'incorrecto'})).status).toBe(401);
 r=await fetch(q.base+'/api/modelos');expect(r.status).toBe(401);cabeceras(r);
 expect((await q.llamar('/api/modelos')).status).toBe(200);expect(JSON.stringify(q.logs)).not.toContain(token);expect(JSON.stringify(q.logs)).not.toContain(clave);expect(q.logs.some(x=>x.auth==='bearer')).toBe(true);
});
test('WP-11 §8.2 login/IP XFF429 y 4KB; 25MiB reales devuelven413 con cabeceras',async()=>{
 const p=await preparar();for(let i=0;i<5;i++)await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.8, 127.0.0.1'},body:JSON.stringify({email:'prueba@example.test',clave:'incorrecta'})});let r=await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.8'},body:JSON.stringify({email:'prueba@example.test',clave})});expect(r.status).toBe(429);cabeceras(r);expect((await r.json() as {reintentarEn:number}).reintentarEn).toBe(900);p.avanzar(900001);
 expect((await fetch(p.base+'/api/sesion',{method:'POST',body:' '.repeat(4097)})).status).toBe(413);
 r=await p.llamar('/api/modelos','POST','ñ'.repeat(13*1024*1024));expect(r.status).toBe(413);cabeceras(r);expect(await readdir(join(p.datos,'modelos'))).toEqual([]);
});

test('WP-11 §8.3 log conserva modo Bearer en rechazo de almacén sin cuerpo/token',async()=>{
 const p=await preparar();const r=await p.llamar('/api/modelos/m-ausente');expect(r.status).toBe(404);expect(p.logs.at(-1)?.auth).toBe('bearer');expect(JSON.stringify(p.logs)).not.toContain(token);
});

test('WP-11 §9.1 entrypoint real inicia en loopback efímero, integra códec y termina con SIGTERM',async()=>{
 const raiz=await mkdtemp(join(tmpdir(),'opforja-entry-prueba-')),datos=join(raiz,'datos'),web=join(raiz,'web');limpieza.push(()=>rm(raiz,{recursive:true,force:true}));await mkdir(datos);await mkdir(web);await writeFile(join(web,'index.html'),'<h1>Entrada sintética</h1>');await writeFile(join(datos,'cuenta.json'),JSON.stringify({email:'entry@example.test',hashClave:hashPassword(clave),versionCredencial:1}));
 const hijo=Bun.spawn([process.execPath,'--no-env-file',join(import.meta.dir,'principal.ts'),'--datos',datos,'--web',web,'--puerto','0','--host','127.0.0.1'],{env:{PATH:'/tmp/opforja-rehacer-tools:/usr/bin:/bin',OPFORJA_SECRETO:secreto,OPFORJA_TOKEN:token,OPFORJA_VERSION:'entry-sintetico'},stdout:'pipe',stderr:'pipe',stdin:'ignore'});
 const lector=hijo.stdout.getReader();let reloj:ReturnType<typeof setTimeout>|undefined;
 try{const inicio=await Promise.race([(async()=>{let texto='';for(;;){const x=await lector.read();if(x.done)throw new Error('El entrypoint terminó sin anunciar puerto');texto+=new TextDecoder().decode(x.value);const lineas=texto.split('\n');for(const l of lineas.slice(0,-1)){const e=JSON.parse(l) as {evento:string;puerto:number};if(e.evento==='servidor-iniciado')return e;}texto=lineas.at(-1)!;}})(),new Promise<never>((_,rechazar)=>{reloj=setTimeout(()=>rechazar(new Error('Falta anuncio del puerto efímero real')),1500);})]);
  expect(inicio.puerto).toBeGreaterThan(0);const base='http://127.0.0.1:'+inicio.puerto;let r=await fetch(base+'/salud');expect(await r.json()).toEqual({ok:true,version:'entry-sintetico'});r=await fetch(base+'/api/modelos',{method:'POST',headers:{authorization:'Bearer '+token},body:documento('m-entry')});expect(r.status).toBe(201);expect(await readFile(join(datos,'modelos/m-entry.json'),'utf8')).toBe(documento('m-entry'));hijo.kill('SIGTERM');expect(await hijo.exited).toBe(0);
 }finally{if(reloj)clearTimeout(reloj);hijo.kill();await hijo.exited;await lector.cancel();lector.releaseLock();}
},10000);

test('WP-11 §9.2 entrypoint rechaza secreto ausente y token corto antes de escuchar',async()=>{
 const raiz=await mkdtemp(join(tmpdir(),'opforja-entry-config-prueba-'));limpieza.push(()=>rm(raiz,{recursive:true,force:true}));
 for(const config of [{},{OPFORJA_SECRETO:secreto,OPFORJA_TOKEN:'corto'}]){const h=Bun.spawn([process.execPath,'--no-env-file',join(import.meta.dir,'principal.ts'),'--datos',join(raiz,'datos'),'--web',join(raiz,'web'),'--host','127.0.0.1','--puerto','0'],{env:{PATH:'/tmp/opforja-rehacer-tools:/usr/bin:/bin',...config},stdin:'ignore',stdout:'pipe',stderr:'pipe'});const [salida,error,exit]=await Promise.all([new Response(h.stdout).text(),new Response(h.stderr).text(),h.exited]);expect(exit).toBe(1);expect(salida).toBe('');expect(error).toContain('OPFORJA_');expect(await readdir(raiz)).toEqual([]);}
});

test('WP-11 §8.2 JSON login ilegible conserva respuesta uniforme y límite de intentos',async()=>{
 const p=await preparar();for(let i=0;i<5;i++)await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.20'},body:'{'});
 const r=await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.20'},body:JSON.stringify({email:'prueba@example.test',clave})});expect(r.status).toBe(429);expect((await r.json() as {reintentarEn:number}).reintentarEn).toBe(900);
});

test('WP-11 §8.1 HTTP507 a2000 activos y nombre máximo200 caracteres sin efectos fallidos',async()=>{
 const p=await preparar(true,2000);let r=await p.llamar('/api/modelos','POST',documento('m-extra'));expect(r.status).toBe(507);cabeceras(r);expect(p.s.almacen.listar()).toHaveLength(2000);expect(await readdir(join(p.datos,'modelos'))).toHaveLength(2000);
 const q=await preparar();r=await q.llamar('/api/modelos','POST',documento('m-nombre','á'.repeat(201)));expect(r.status).toBe(400);expect(q.s.almacen.listar()).toHaveLength(0);r=await q.llamar('/api/modelos','POST',documento('m-nombre','á'.repeat(200)));expect(r.status).toBe(201);
});
test('WP-11 §8.1 límites inclusivos4KiB/25MiB y PUT413 preservan bytes y revisión',async()=>{
 const p=await preparar(),login=JSON.stringify({email:'prueba@example.test',clave});let r=await fetch(p.base+'/api/sesion',{method:'POST',body:login.padEnd(4096)});expect(r.status).toBe(204);
 const doc=documento('m-limite'),texto=doc+' '.repeat(25*1024*1024-Buffer.byteLength(doc));r=await p.llamar('/api/modelos','POST',texto);expect(r.status).toBe(201);const g=await r.json() as {rev:string;canonicalizado:boolean};expect(g.canonicalizado).toBe(true);expect(await readFile(join(p.datos,'modelos/m-limite.json'),'utf8')).toBe(doc);
 r=await p.llamar('/api/modelos/m-limite','PUT',texto+' ',{'if-match':'"'+g.rev+'"'});expect(r.status).toBe(413);cabeceras(r);expect((await p.s.almacen.leer('m-limite')).rev).toBe(g.rev);expect(await readdir(join(p.datos,'previas'))).toEqual([]);
},10000);

test('WP-11 §8.2 regresión revisión UTF8 login ilegible uniforme y cinco fallos sin eludir límite',async()=>{
 const p=await preparar();const primera=await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.45'},body:new Uint8Array([0xc3,0x28])});expect(primera.status).toBe(401);expect(await primera.json()).toEqual({error:'Credenciales inválidas'});
 for(let i=0;i<5;i++)await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.46'},body:new Uint8Array([0xff])});const r=await fetch(p.base+'/api/sesion',{method:'POST',headers:{'x-forwarded-for':'192.0.2.46'},body:JSON.stringify({email:'prueba@example.test',clave})});expect(r.status).toBe(429);expect((await r.json() as {reintentarEn:number}).reintentarEn).toBe(900);expect((await fetch(p.base+'/api/sesion',{method:'POST',body:new Uint8Array(4097).fill(255)})).status).toBe(413);
});
test('WP-11 §8.1 regresión revisión SPA assets sin extensión sirve index no-store',async()=>{
 const p=await preparar();for(const ruta of ['/assets/sin-extension','/assets/index.html']){const r=await fetch(p.base+ruta);expect(r.status).toBe(ruta.endsWith('index.html')?404:200);if(r.status===200){expect(await r.text()).toContain('SPA sintética');expect(r.headers.get('cache-control')).toBe('no-store');}}const asset=await fetch(p.base+'/assets/app.js');expect(asset.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
});
test('T-287 regresión revisión HTTP requiere v0 raíz y CC16 original también frente a sobres',async()=>{
 const p=await preparar();const raw=JSON.parse(documento());raw.modelo.id='..';const registro=JSON.stringify({json:JSON.stringify(raw)});expect(importarV0(registro).ok).toBe(true);expect((await p.llamar('/api/modelos','POST',registro)).status).toBe(400);expect(p.s.almacen.listar()).toHaveLength(0);
 const g=await p.s.almacen.guardar(documento(),{crear:true});for(const texto of [JSON.stringify({json:documento('m-externo')}),JSON.stringify(JSON.parse(documento()).modelo),JSON.stringify({modelo:JSON.parse(documento()).modelo}),JSON.stringify({formato:'otro',modelo:JSON.parse(documento()).modelo})]){expect((await p.llamar('/api/modelos','POST',texto)).status).toBe(400);expect((await p.llamar('/api/modelos/m-alfa?respaldo=1','PUT',texto,{'if-match':'"'+g.rev+'"'})).status).toBe(400);}expect((await p.s.almacen.leer('m-alfa')).texto).toBe(documento());expect(await readdir(join(p.datos,'papelera'))).toEqual([]);expect(await readdir(join(p.datos,'previas'))).toEqual([]);
});

test('T-287 B HTTP restaurar400/422 con Informe original intacto sin aceptarPerdidas y201histórico informado',async()=>{
 const p=await preparar();const raw=JSON.parse(documento('m-hist'));raw.modelo.extensionHist='marca-original';for(const [texto,estado,id]of [['{',400,'m-rechazo'],[JSON.stringify(raw),422,'m-perdida']] as const){const entrada=`${id}--2026-01-01T00:00:00.000Z--eliminado.json`;await writeFile(join(p.datos,'papelera',entrada),texto);const r=await p.llamar('/api/papelera/'+entrada+'/restaurar?aceptarPerdidas=1','POST',documento('m-falso'));expect(r.status).toBe(estado);expect((await r.json() as {informe:unknown}).informe).toEqual(importarV0(texto).informe);expect(await readFile(join(p.datos,'papelera',entrada),'utf8')).toBe(texto);cabeceras(r);}
 const texto=JSON.stringify(JSON.parse(documento('m-hist'))),entrada='m-hist--2026-01-01T00:00:00.000Z--eliminado.json';await writeFile(join(p.datos,'papelera',entrada),texto);const r=await p.llamar('/api/papelera/'+entrada+'/restaurar','POST');expect(r.status).toBe(201);const creado=await r.json() as {canonicalizado:boolean;informe:unknown};expect(creado.canonicalizado).toBe(true);expect(creado.informe).toEqual(importarV0(texto).informe);expect(await readdir(join(p.datos,'modelos'))).toEqual(['m-hist.json']);
});

test('T-287 B HTTP restaurar límites400/413/507 antes de efectos mantienen Informe y fuente',async()=>{
 const p=await preparar(true,2000),texto=JSON.stringify(JSON.parse(documento('m-hist'))),entrada='m-hist--2026-01-01T00:00:00.000Z--eliminado.json';await writeFile(join(p.datos,'papelera',entrada),texto);let r=await p.llamar('/api/papelera/'+entrada+'/restaurar','POST');expect(r.status).toBe(507);expect((await r.json() as {informe:unknown}).informe).toEqual(importarV0(texto).informe);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(await readFile(join(p.datos,'papelera',entrada),'utf8')).toBe(texto);
 const q=await preparar(),grande=JSON.parse(documento('m-grande'));grande.modelo.descripcion='x'.repeat(25*1024*1024);for(const [id,estado,original]of [['m-nombre',400,JSON.stringify(JSON.parse(documento('m-nombre','A'.repeat(201))))],['m-grande',413,JSON.stringify(grande)]] as const){const e=`${id}--2026-01-01T00:00:00.000Z--eliminado.json`;await writeFile(join(q.datos,'papelera',e),original);r=await q.llamar('/api/papelera/'+e+'/restaurar','POST');expect(r.status).toBe(estado);expect((await r.json() as {informe:unknown}).informe).toEqual(importarV0(original).informe);expect(await readFile(join(q.datos,'papelera',e),'utf8')).toBe(original);expect(q.s.almacen.listar()).toEqual([]);cabeceras(r);}expect(await readdir(join(q.datos,'papelera'))).toHaveLength(2);
},10000);

test('T-287 físico HTTP BOM UTF8 no se quita antes de import para aparentar documento canónico',async()=>{
 const p=await preparar(),texto='\uFEFF'+documento('m-bom');expect(importarV0(texto).ok).toBe(false);const r=await p.llamar('/api/modelos','POST',texto);expect(r.status).toBe(400);expect((await r.json() as {informe:unknown}).informe).toEqual(importarV0(texto).informe);expect(await readdir(join(p.datos,'modelos'))).toEqual([]);
});

test('T-286 físico HTTP GET/CAS/DELETE/REST exponen500 sin Informe ni copia de texto inventada',async()=>{
 const p=await preparar(),texto=exportarV0({...modeloCon(),id:'m-fisico',descripcion:'Marca \uFFFD física'}),valido=Buffer.from(texto),i=valido.indexOf(Buffer.from([239,191,189])),invalido=Buffer.concat([valido.subarray(0,i),Buffer.from([255]),valido.subarray(i+3)]);expect(i).toBeGreaterThan(-1);
 const creado=await (await p.llamar('/api/modelos','POST',texto)).json() as {rev:string},ruta=join(p.datos,'modelos/m-fisico.json');await writeFile(ruta,invalido);
 for(const metodo of ['GET','PUT','DELETE']){const r=await p.llamar('/api/modelos/m-fisico?respaldo=1',metodo,metodo==='PUT'?texto:undefined,{'if-match':'"'+creado.rev+'"'});expect(r.status).toBe(500);expect(await r.json()).toEqual({error:'Error interno'});cabeceras(r);expect(await readFile(ruta)).toEqual(invalido);}
 expect(await readdir(join(p.datos,'previas'))).toEqual([]);expect(await readdir(join(p.datos,'papelera'))).toEqual([]);
 const entrada='m-fisico--2026-01-01T00:00:00.000Z--eliminado.json',fuente=join(p.datos,'papelera',entrada);await writeFile(fuente,invalido);const r=await p.llamar('/api/papelera/'+entrada+'/restaurar','POST');expect(r.status).toBe(500);expect(await r.json()).toEqual({error:'Error interno'});expect(await readFile(fuente)).toEqual(invalido);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(await readdir(join(p.datos,'modelos'))).toEqual(['m-fisico.json']);expect((await (await p.llamar('/api/papelera')).json() as {entradas:unknown[]}).entradas).toEqual([]);
});
