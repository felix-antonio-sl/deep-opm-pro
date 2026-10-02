import {test,expect,afterEach} from 'bun:test';
import {mkdtemp,rm,readdir,readFile,writeFile,mkdir,rename,link,open,unlink,copyFile,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {createHash} from 'node:crypto';
import {Almacen} from './almacen';
import {leerCanonico,revision,resumen} from '../src/codec/canonico';import {importarV0} from '../src/codec/importar';import {exportarV0} from '../src/codec/exportar';import {modeloCon} from '../src/pruebas/constructores';
const canon={leerCanonico,revision,resumen,importarV0,exportarV0};const dirs:string[]=[];
afterEach(async()=>{await Promise.all(dirs.splice(0).map(d=>rm(d,{recursive:true,force:true})));});
export function documento(id='m-alfa',nombre='Modelo de prueba'){return exportarV0({...modeloCon(),id,nombre});}
const sha=(s:string)=>createHash('sha256').update(s).digest('hex');
async function preparar(io?:NonNullable<ConstructorParameters<typeof Almacen>[0]['io']>){const datos=await mkdtemp(join(tmpdir(),'opforja-almacen-prueba-'));dirs.push(datos);let ahora=Date.UTC(2026,0,1);const a=new Almacen({datos,canon,ahora:()=>ahora,...(io?{io}:{})});await a.iniciar();return {a,datos,avanzar:(ms:number)=>ahora+=ms};}
test('T-286 almacén guarda bytes canónicos, sha independiente e índice reconstruido',async()=>{
 const p=await preparar(),texto=documento();const r=await p.a.guardar(texto,{crear:true});expect(r).toMatchObject({id:'m-alfa',rev:sha(texto)});expect(r.canonicalizado).toBeUndefined();
 expect((await p.a.leer('m-alfa')).texto).toBe(texto);expect(await readFile(join(p.datos,'modelos/m-alfa.json'),'utf8')).toBe(texto);expect(p.a.listar()).toMatchObject([{id:'m-alfa',nombre:'Modelo de prueba',bytes:Buffer.byteLength(texto),cosas:0,opds:1}]);
 const b=new Almacen({datos:p.datos,canon});await b.iniciar();expect(b.listar()).toMatchObject([{id:'m-alfa',rev:sha(texto)}]);
});
test('T-287 IDs originales inválidos no se reasignan mediante import tolerante',async()=>{
 const {a}=await preparar();for(const id of ['.tmp-x','../fuera','modelo ','área','x'.repeat(81)])await expect(a.guardar(documento(id),{crear:true})).rejects.toMatchObject({estado:400});expect(a.listar()).toHaveLength(0);
});
test('T-286 CAS concurrente da un éxito y un 412 sin pérdida del ganador',async()=>{
 const {a,datos}=await preparar();const inicial=await a.guardar(documento(),{crear:true});const textos=[documento('m-alfa','Primero'),documento('m-alfa','Segundo')];const resultados=await Promise.allSettled(textos.map(t=>a.guardar(t,{id:'m-alfa',rev:inicial.rev})));
 expect(resultados.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(resultados.filter(r=>r.status==='rejected')).toHaveLength(1);const fallido=resultados.find(r=>r.status==='rejected') as PromiseRejectedResult;expect(fallido.reason.estado).toBe(412);
 const vigente=await a.leer('m-alfa');expect(textos).toContain(vigente.texto);expect(vigente.rev).toBe(sha(vigente.texto));expect(await readFile(join(datos,'modelos/m-alfa.json'),'utf8')).toBe(vigente.texto);
});
test('T-286 409/404/428/412 y cuerpo de otro id no escriben ni respaldan',async()=>{
 const {a,datos}=await preparar();const r=await a.guardar(documento(),{crear:true});await expect(a.guardar(documento(),{crear:true})).rejects.toMatchObject({estado:409});
 await expect(a.guardar(documento('m-no'),{id:'m-no',rev:r.rev})).rejects.toMatchObject({estado:404});await expect(a.guardar(documento(),{id:'m-alfa'})).rejects.toMatchObject({estado:428});
 await expect(a.guardar(documento('m-otro'),{id:'m-alfa',rev:r.rev})).rejects.toMatchObject({estado:400});await expect(a.guardar(documento(),{id:'m-alfa',rev:'incorrecta',respaldo:true})).rejects.toMatchObject({estado:412});
 expect(await readdir(join(datos,'papelera'))).toEqual([]);expect(await readdir(join(datos,'previas'))).toEqual([]);expect((await a.leer('m-alfa')).texto).toBe(documento());
});
test('T-286 atomicidad: fallo entre write y rename preserva vigente e índice, cola usable',async()=>{
 let fallar=false;const p=await preparar({rename:async(...args:Parameters<typeof rename>)=>{if(fallar&&String(args[0]).includes('modelos/.tmp-'))throw new Error('Fallo sintético rename');return rename(...args);},link});const r=await p.a.guardar(documento(),{crear:true});fallar=true;
 await expect(p.a.guardar(documento('m-alfa','Cambio'),{id:'m-alfa',rev:r.rev})).rejects.toThrow('Fallo sintético');expect((await p.a.leer('m-alfa')).texto).toBe(documento());expect(p.a.listar()[0]?.rev).toBe(r.rev);expect((await readdir(join(p.datos,'modelos'))).filter(x=>x.startsWith('.tmp-'))).toEqual([]);
 fallar=false;expect((await p.a.guardar(documento('m-alfa','Cambio'),{id:'m-alfa',rev:r.rev})).rev).toBe(sha(documento('m-alfa','Cambio')));
});
test('T-286 previas:100 PUT en minuto dejan una copia de bytes viejos',async()=>{
 const p=await preparar();let r=await p.a.guardar(documento(),{crear:true});for(let i=0;i<100;i++){p.avanzar(500);r=await p.a.guardar(documento('m-alfa','Nombre '+i),{id:'m-alfa',rev:r.rev});}
 const copias=await readdir(join(p.datos,'previas/m-alfa'));expect(copias).toHaveLength(1);expect(await readFile(join(p.datos,'previas/m-alfa',copias[0]!),'utf8')).toBe(documento());
});
test('T-286 previas cada11min rotan30 y fallback copyFile conserva textos canónicos',async()=>{
 const p=await preparar({rename,link:async()=>{throw new Error('link no disponible sintético');}});let r=await p.a.guardar(documento(),{crear:true});for(let i=0;i<35;i++){p.avanzar(11*60*1000);r=await p.a.guardar(documento('m-alfa','Nombre '+i),{id:'m-alfa',rev:r.rev});}
 const copias=await readdir(join(p.datos,'previas/m-alfa'));expect(copias).toHaveLength(30);for(const archivo of copias)expect(leerCanonico(await readFile(join(p.datos,'previas/m-alfa',archivo),'utf8')).ok).toBe(true);
});
test('T-286 respaldo/papelera restaura mismo id o nuevo cuando ocupado; borrado y purga',async()=>{
 const p=await preparar();const r=await p.a.guardar(documento(),{crear:true});await p.a.guardar(documento('m-alfa','Cambio'),{id:'m-alfa',rev:r.rev,respaldo:true});let entradas=await p.a.papelera();expect(entradas).toMatchObject([{id:'m-alfa',motivo:'reemplazado'}]);
 const restaurado=await p.a.restaurar(entradas[0]!.entrada);expect(restaurado.id).not.toBe('m-alfa');const nuevo=JSON.parse((await p.a.leer(restaurado.id)).texto);expect(nuevo.modelo.id).toBe(restaurado.id);expect(nuevo.modelo.nombre).toBe('Modelo de prueba');
 await p.a.eliminar('m-alfa');entradas=await p.a.papelera();expect(entradas).toMatchObject([{id:'m-alfa',motivo:'eliminado'}]);expect((await p.a.restaurar(entradas[0]!.entrada)).id).toBe('m-alfa');
 await p.a.eliminar('m-alfa');p.avanzar(30*24*3600*1000+1);await p.a.purgar();expect(await p.a.papelera()).toEqual([]);
 await expect(p.a.leer('m-ausente')).rejects.toMatchObject({estado:404});await expect(p.a.eliminar('m-ausente')).rejects.toMatchObject({estado:404});await expect(p.a.restaurar('ausente')).rejects.toMatchObject({estado:404});
});
test('T-286 respaldo con fallo final mantiene versión original recuperable',async()=>{
 let fallar=false;const p=await preparar({rename:async(...args:Parameters<typeof rename>)=>{if(fallar&&String(args[0]).includes('modelos/.tmp-'))throw new Error('Fallo sintético');return rename(...args);},link});const r=await p.a.guardar(documento(),{crear:true});fallar=true;
 await expect(p.a.guardar(documento('m-alfa','Cambio'),{id:'m-alfa',rev:r.rev,respaldo:true})).rejects.toThrow();expect((await p.a.leer('m-alfa')).texto).toBe(documento());expect(await readFile(join(p.datos,'modelos/m-alfa.json'),'utf8')).toBe(documento());
});
test('T-287 no canónico se canonicaliza y pérdida real exige422 antes de mover respaldo',async()=>{
 const p=await preparar();const raw=JSON.stringify(JSON.parse(documento()));const r=await p.a.guardar(raw,{crear:true});expect(r.canonicalizado).toBe(true);expect((await p.a.leer('m-alfa')).texto).toBe(documento());
 const perdido=JSON.parse(documento());perdido.modelo.extensionSinRepresentacion='hecho-original-sintetico';await expect(p.a.guardar(JSON.stringify(perdido),{id:'m-alfa',rev:r.rev,respaldo:true})).rejects.toMatchObject({estado:422});expect(await p.a.papelera()).toEqual([]);
 const aceptado=await p.a.guardar(JSON.stringify(perdido),{id:'m-alfa',rev:r.rev,aceptarPerdidas:true});expect(aceptado.canonicalizado).toBe(true);expect(aceptado.informe?.descartado.length).toBeGreaterThan(0);
 await expect(p.a.guardar('{',{crear:true})).rejects.toMatchObject({estado:400});
});
test('T-288 guardar errores contextuales recuperables no consulta gates futuros',async()=>{
 const {a}=await preparar();const m=modeloCon({objetos:[['Agua',[]]],procesos:['Hervir'],enlaces:[['consumo','Agua','Hervir'],['instrumento','Agua','Hervir']]});const t=exportarV0({...m,id:'m-contexto'});expect((await a.guardar(t,{crear:true})).id).toBe('m-contexto');expect((await a.leer('m-contexto')).texto).toBe(t);
});
test('T-287 CC14 arranque conserva legible no canónico e ilegibles van a archivo',async()=>{
 const p=await preparar();const original=JSON.stringify(JSON.parse(documento()));await writeFile(join(p.datos,'modelos/m-alfa.json'),original);await writeFile(join(p.datos,'modelos/m-roto.json'),'{');await writeFile(join(p.datos,'modelos/m-formato.json'),'{"formato":"otro"}');await writeFile(join(p.datos,'modelos/.tmp-residuo'),'temporal');
 const b=new Almacen({datos:p.datos,canon});await b.iniciar();expect((await b.leer('m-alfa')).texto).toBe(original);expect(b.listar()[0]?.rev).toBe(sha(original));expect(await readdir(join(p.datos,'archivo/invalidos'))).toHaveLength(2);
 const r=await b.guardar(documento('m-alfa','Nuevo'),{id:'m-alfa',rev:sha(original)});expect(r.rev).toBe(sha(documento('m-alfa','Nuevo')));const copias=await readdir(join(p.datos,'previas/m-alfa'));expect(await readFile(join(p.datos,'previas/m-alfa',copias[0]!),'utf8')).toBe(original);
});
test('T-286 límite2000 coordinado entre POST distintos concurrentes',async()=>{
 const p=await preparar();for(let i=0;i<1999;i++)await writeFile(join(p.datos,'modelos',`m-${i}.json`),documento('m-'+i));const b=new Almacen({datos:p.datos,canon});await b.iniciar();const rs=await Promise.allSettled([b.guardar(documento('m-uno'),{crear:true}),b.guardar(documento('m-dos'),{crear:true})]);expect(rs.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect((rs.find(r=>r.status==='rejected') as PromiseRejectedResult).reason.estado).toBe(507);expect(b.listar()).toHaveLength(2000);
});

test('T-286 fallo de fsync tras rename conserva versión completa y CAS/índice coherentes',async()=>{
 for(const respaldo of [false,true]){
  const datos=await mkdtemp(join(tmpdir(),'opforja-almacen-fsync-prueba-'));dirs.push(datos);let fallar=false;
  const abrir:typeof open=async(...args)=>{const f=await open(...args);if(args[0]===join(datos,'modelos')){const sync=f.sync.bind(f);f.sync=async()=>{if(fallar){fallar=false;throw new Error('fsync directorio sintético');}await sync();};}return f;};
  const a=new Almacen({datos,canon,io:{rename,link,open:abrir}});await a.iniciar();const inicial=await a.guardar(documento(),{crear:true});fallar=true;await expect(a.guardar(documento('m-alfa','Completo nuevo'),{id:'m-alfa',rev:inicial.rev,respaldo})).rejects.toThrow('fsync directorio sintético');
  const vigente=await a.leer('m-alfa');expect(vigente.texto).toBe(documento('m-alfa','Completo nuevo'));expect(a.listar()[0]?.rev).toBe(sha(vigente.texto));expect(a.listar()[0]?.nombre).toBe('Completo nuevo');expect(leerCanonico(vigente.texto).ok).toBe(true);expect((await readdir(join(datos,'modelos'))).some(n=>n.startsWith('.tmp-'))).toBe(false);
  await expect(a.guardar(documento(),{id:'m-alfa',rev:inicial.rev})).rejects.toMatchObject({estado:412, cuerpo:{rev:sha(vigente.texto)}});expect(await readdir(join(datos,'previas/m-alfa'))).toHaveLength(1);if(respaldo)expect((await a.papelera())[0]?.motivo).toBe('reemplazado');
 }
});

test('T-286 fallo al sincronizar papelera recupera original antes de commit de respaldo o DELETE',async()=>{
 for(const borrar of [false,true]){const datos=await mkdtemp(join(tmpdir(),'opforja-almacen-papelera-sync-prueba-'));dirs.push(datos);let fallar=false;
  const abrir:typeof open=async(...args)=>{const f=await open(...args);if(args[0]===join(datos,'papelera')){const sync=f.sync.bind(f);f.sync=async()=>{if(fallar){fallar=false;throw new Error('papelera fsync sintético');}await sync();};}return f;};
  const a=new Almacen({datos,canon,io:{rename,link,open:abrir}});await a.iniciar();const inicial=await a.guardar(documento(),{crear:true});fallar=true;await expect(borrar?a.eliminar('m-alfa'):a.guardar(documento('m-alfa','Cambio'),{id:'m-alfa',rev:inicial.rev,respaldo:true})).rejects.toThrow('papelera fsync sintético');expect((await a.leer('m-alfa')).texto).toBe(documento());expect(a.listar()[0]?.rev).toBe(inicial.rev);expect(await a.papelera()).toEqual([]);
 }
});
test('T-286 DELETE con fsync tardío conserva original en papelera e índice sin activo',async()=>{
 const datos=await mkdtemp(join(tmpdir(),'opforja-almacen-delete-sync-prueba-'));dirs.push(datos);let fallar=false;const abrir:typeof open=async(...args)=>{const f=await open(...args);if(args[0]===join(datos,'modelos')){const sync=f.sync.bind(f);f.sync=async()=>{if(fallar){fallar=false;throw new Error('DELETE fsync sintético');}await sync();};}return f;};const a=new Almacen({datos,canon,io:{rename,link,open:abrir}});await a.iniciar();await a.guardar(documento(),{crear:true});fallar=true;await expect(a.eliminar('m-alfa')).rejects.toThrow('DELETE fsync sintético');expect(a.listar()).toEqual([]);await expect(a.leer('m-alfa')).rejects.toMatchObject({estado:404});const entrada=(await a.papelera())[0]!;expect(await readFile(join(datos,'papelera',entrada.entrada),'utf8')).toBe(documento());
});

test('T-286 id válido creacion no colisiona con exclusión global de altas',async()=>{
 const {a}=await preparar();let reloj:ReturnType<typeof setTimeout>|undefined;try{const r=await Promise.race([a.guardar(documento('creacion'),{crear:true}),new Promise<never>((_,rechazar)=>{reloj=setTimeout(()=>rechazar(new Error('Alta atascada por id válido')),1000);})]);expect(r.id).toBe('creacion');expect(a.listar()).toHaveLength(1);}finally{if(reloj)clearTimeout(reloj);}
});

test('T-286 regresión revisión arranques sucesivos conservan tres inválidos de mismo nombre',async()=>{
 const datos=await mkdtemp(join(tmpdir(),'opforja-archivo-revision-prueba-'));dirs.push(datos);await mkdir(join(datos,'modelos'));const textos=['{original sintético primero','{original sintético segundo','{original sintético tercero'];for(const texto of textos){await writeFile(join(datos,'modelos/m-invalid.json'),texto);await new Almacen({datos,canon}).iniciar();}const nombres=await readdir(join(datos,'archivo/invalidos'));expect(nombres).toHaveLength(3);expect(await readFile(join(datos,'archivo/invalidos/m-invalid.json'),'utf8')).toBe(textos[0]!);const contenidos=await Promise.all(nombres.map(n=>readFile(join(datos,'archivo/invalidos',n),'utf8')));for(const texto of textos)expect(contenidos).toContain(texto);expect(await readdir(join(datos,'modelos'))).toEqual([]);
});

async function fuentePapelera(p:{datos:string},texto:string,id='m-hist',fecha='2026-01-01T00:00:00.000Z'){
 const entrada=`${id}--${fecha}--eliminado.json`;await writeFile(join(p.datos,'papelera',entrada),texto);return entrada;
}
const historico=(id='m-hist',nombre='Historia')=>JSON.stringify(JSON.parse(documento(id,nombre)));
async function contenidosPapelera(datos:string){const archivos=await readdir(join(datos,'papelera'));return Promise.all(archivos.map(async n=>({nombre:n,texto:await readFile(join(datos,'papelera',n),'utf8')})));}

test('T-287 B restaurar rechazo y pérdida conserva Informe original, bytes/nombre/fecha sin efectos',async()=>{
 const raw=JSON.parse(documento('m-hist'));raw.modelo.legadoNoRepresentable={marca:'original sintético'};
 for(const [texto,estado]of [['{',400],[JSON.stringify(raw),422]] as const){const p=await preparar(),entrada=await fuentePapelera(p,texto),ruta=join(p.datos,'papelera',entrada),antes=await stat(ruta),original=importarV0(texto);
  await expect(p.a.restaurar(entrada)).rejects.toMatchObject({estado,cuerpo:{informe:original.informe}});expect(await readFile(ruta,'utf8')).toBe(texto);expect((await stat(ruta)).mtimeMs).toBe(antes.mtimeMs);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(await readdir(join(p.datos,'modelos'))).toEqual([]);expect(p.a.listar()).toEqual([]);
 }
});
test('T-287 B restaurar histórico sobre ocupado preserva Informe y visibilidad original completos',async()=>{
 const p=await preparar();await p.a.guardar(documento('m-hist','Vigente'),{crear:true});const raw=JSON.parse(exportarV0({...modeloCon({objetos:[['Pedido',[]]],procesos:['Despachar'],enlaces:[['consumo','Pedido','Despachar']]}),id:'m-hist'}));raw.modelo.opds['opd-1'].enlaces={};const texto=JSON.stringify({json:JSON.stringify(raw)}),original=importarV0(texto);expect(original.ok).toBe(true);expect(original.informe.descartado).toEqual([]);expect(original.informe.visibilidad).toEqual([{opd:'opd-1',etiqueta:'SD',aparecen:[{enlace:'e-4',texto:'consumo: Pedido → Despachar'}],desaparecen:[]}]);const entrada=await fuentePapelera(p,texto);p.avanzar(1000);
 const r=await p.a.restaurar(entrada);expect(r.id).not.toBe('m-hist');expect(r.canonicalizado).toBe(true);expect(r.informe).toEqual(original.informe);expect(leerCanonico((await p.a.leer(r.id)).texto).ok).toBe(true);expect((await p.a.leer('m-hist')).texto).toBe(documento('m-hist','Vigente'));
 const copias=await contenidosPapelera(p.datos);expect(copias).toHaveLength(1);expect(copias[0]?.texto).toBe(texto);expect(copias[0]?.nombre).toBe('m-hist--2026-01-01T00:00:01.000Z--reemplazado.json');p.avanzar(30*24*3600*1000);await p.a.purgar();expect(await contenidosPapelera(p.datos)).toHaveLength(1);p.avanzar(1);await p.a.purgar();expect(await contenidosPapelera(p.datos)).toEqual([]);
});
test('T-287 B fuente canónica ocupada mantiene id nuevo sin respaldo extra ni informe artificial',async()=>{
 const p=await preparar();await p.a.guardar(documento('m-hist','Vigente'),{crear:true});const entrada=await fuentePapelera(p,documento('m-hist','Canónico'));const r=await p.a.restaurar(entrada);expect(r.id).not.toBe('m-hist');expect(r.canonicalizado).toBeUndefined();expect(r.informe).toBeUndefined();expect(await p.a.papelera()).toEqual([]);expect(JSON.parse((await p.a.leer(r.id)).texto).modelo.id).toBe(r.id);expect((await p.a.leer('m-hist')).texto).toBe(documento('m-hist','Vigente'));
});
test('T-287 B límites nombre y tamaño del candidato mantienen fuente e Informe sin respaldo',async()=>{
 const grande=JSON.parse(documento('m-hist'));grande.modelo.descripcion='x'.repeat(25*1024*1024);
 for(const [texto,estado]of [[historico('m-hist','A'.repeat(201)),400],[JSON.stringify(grande),413]] as const){const p=await preparar(),entrada=await fuentePapelera(p,texto),original=importarV0(texto);expect(original.ok).toBe(true);expect(original.informe.rechazos).toEqual([]);await expect(p.a.restaurar(entrada)).rejects.toMatchObject({estado,cuerpo:{informe:original.informe}});expect(await readFile(join(p.datos,'papelera',entrada),'utf8')).toBe(texto);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(await readdir(join(p.datos,'modelos'))).toEqual([]);}
},10000);
test('T-287 B histórico mayor25MiB con candidato pequeño se restaura y respalda exacto sin límite nuevo',async()=>{
 const p=await preparar(),texto=historico()+' '.repeat(26*1024*1024),entrada=await fuentePapelera(p,texto);const r=await p.a.restaurar(entrada);expect(r.canonicalizado).toBe(true);expect(r.informe).toEqual(importarV0(texto).informe);expect(leerCanonico((await p.a.leer(r.id)).texto).ok).toBe(true);const copias=await contenidosPapelera(p.datos);expect(copias).toHaveLength(1);expect(copias[0]?.texto).toBe(texto);
},10000);
test('T-286 B cupo2000 rechaza antes de respaldo/consumo y conserva Informe histórico',async()=>{
 const p=await preparar();await Promise.all(Array.from({length:2000},(_,i)=>writeFile(join(p.datos,'modelos',`m-c-${i}.json`),documento(`m-c-${i}`))));const a=new Almacen({datos:p.datos,canon});await a.iniciar();const texto=historico(),entrada=await fuentePapelera(p,texto);await expect(a.restaurar(entrada)).rejects.toMatchObject({estado:507,cuerpo:{informe:importarV0(texto).informe}});expect(a.listar()).toHaveLength(2000);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(await readFile(join(p.datos,'papelera',entrada),'utf8')).toBe(texto);
});
for(const fallo of ['backup-copy','backup-file-sync','backup-dir-sync','install-rename','active-dir-sync','source-unlink','consume-dir-sync'] as const)test(`T-286 B fallo ${fallo} expone error sin perder última copia original`,async()=>{
 let activado=false,dirs=0;const rutaPapelera=(v:unknown)=>typeof v==='string'&&v.includes('/papelera/');
 const copiar:typeof copyFile=async(...args)=>{if(activado&&fallo==='backup-copy'&&rutaPapelera(args[1]))throw Error(fallo);await copyFile(...args);};
 const borrar:typeof unlink=async(...args)=>{if(activado&&fallo==='source-unlink'&&rutaPapelera(args[0]))throw Error(fallo);await unlink(...args);};
 const mover:typeof rename=async(...args)=>{if(activado&&fallo==='install-rename'&&typeof args[1]==='string'&&args[1].includes('/modelos/'))throw Error(fallo);await rename(...args);};
 const abrir:typeof open=async(...args)=>{const f=await open(...args),sync=f.sync.bind(f),ruta=String(args[0]);f.sync=async()=>{if(activado){if(ruta.endsWith('/papelera')){dirs++;if(fallo==='backup-dir-sync'&&dirs===1||fallo==='consume-dir-sync'&&dirs===2)throw Error(fallo);}if(fallo==='backup-file-sync'&&rutaPapelera(ruta)&&ruta.endsWith('--reemplazado.json'))throw Error(fallo);if(fallo==='active-dir-sync'&&ruta.endsWith('/modelos'))throw Error(fallo);}await sync();};return f;};
 const p=await preparar({rename:mover,link,open:abrir,copyFile:copiar,unlink:borrar}),texto=historico(),entrada=await fuentePapelera(p,texto);activado=true;await expect(p.a.restaurar(entrada)).rejects.toThrow(fallo);
 const originales=(await contenidosPapelera(p.datos)).filter(x=>x.texto===texto);expect(originales.length).toBeGreaterThan(0);if(['backup-copy','backup-file-sync','backup-dir-sync','install-rename'].includes(fallo)){expect(p.a.listar()).toEqual([]);expect(await readFile(join(p.datos,'papelera',entrada),'utf8')).toBe(texto);}else{expect(p.a.listar()).toHaveLength(1);expect(leerCanonico((await p.a.leer(p.a.listar()[0]!.id)).texto).ok).toBe(true);}expect((await readdir(join(p.datos,'modelos'))).some(n=>n.startsWith('.tmp-'))).toBe(false);
});
test('T-286 B productores concurrentes restaurar/PUT respaldo/DELETE conservan todos originales y nombres',async()=>{
 const p=await preparar(),vigente=documento('m-hist','Vigente'),g=await p.a.guardar(vigente,{crear:true});const a=historico('m-hist','Historia A'),b=historico('m-hist','Historia B'),ea=await fuentePapelera(p,a,'m-hist','2025-12-31T23:59:59.000Z'),eb=await fuentePapelera(p,b,'m-hist','2025-12-31T23:59:59.001Z');const tareas=[p.a.restaurar(ea),p.a.restaurar(eb),p.a.guardar(documento('m-hist','Nueva'),{id:'m-hist',rev:g.rev,respaldo:true}),p.a.eliminar('m-hist')];let reloj:ReturnType<typeof setTimeout>|undefined;try{const rs=await Promise.race([Promise.all(tareas),new Promise<never>((_,no)=>{reloj=setTimeout(()=>no(Error('Ciclo de mutex de papelera')),3000);})]);expect(rs).toHaveLength(4);}finally{if(reloj)clearTimeout(reloj);}
 const copias=await contenidosPapelera(p.datos);expect(copias.map(c=>c.texto)).toContain(a);expect(copias.map(c=>c.texto)).toContain(b);expect(copias.map(c=>c.texto)).toContain(vigente);expect(copias.map(c=>c.texto)).toContain(documento('m-hist','Nueva'));expect(new Set(copias.map(c=>c.nombre)).size).toBe(copias.length);expect(copias.filter(c=>c.nombre.endsWith('--reemplazado.json'))).toHaveLength(3);
});
test('T-286 B misma entrada restaurar/restaurar y purga concurrentes consumen una sola vez',async()=>{
 const p=await preparar(),texto=historico(),entrada=await fuentePapelera(p,texto);const rs=await Promise.allSettled([p.a.restaurar(entrada),p.a.restaurar(entrada)]);expect(rs.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(rs.find(r=>r.status==='rejected')).toMatchObject({reason:{estado:404}});expect(p.a.listar()).toHaveLength(1);expect((await contenidosPapelera(p.datos)).filter(c=>c.texto===texto)).toHaveLength(1);
 const q=await preparar(),e=await fuentePapelera(q,historico());q.avanzar(31*24*3600*1000);await Promise.all([q.a.restaurar(e),q.a.purgar()]);expect(q.a.listar()).toHaveLength(1);const copias=await q.a.papelera();expect(copias).toHaveLength(1);expect(copias[0]?.motivo).toBe('reemplazado');expect(copias[0]?.eliminado).toBe('2026-02-01T00:00:00.000Z');
});

test('T-286 B canónico ocupado con fallo sync después de unlink conserva fuente sin respaldo extra',async()=>{
 let fallar=false;const abrir:typeof open=async(...args)=>{const f=await open(...args),sync=f.sync.bind(f);f.sync=async()=>{if(fallar&&typeof args[0]==='string'&&args[0].endsWith('/papelera')){fallar=false;throw Error('consumo canónico sync');}await sync();};return f;};const p=await preparar({rename,link,open:abrir});await p.a.guardar(documento('m-hist','Vigente'),{crear:true});const texto=documento('m-hist','Canónico'),entrada=await fuentePapelera(p,texto);fallar=true;await expect(p.a.restaurar(entrada)).rejects.toThrow('consumo canónico sync');expect(await readFile(join(p.datos,'papelera',entrada),'utf8')).toBe(texto);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(p.a.listar()).toHaveLength(2);
});

test('T-196 B restaurar fuente directa canónica C/R ocupada conserva ids/tipos/contexto sin fusión',async()=>{
 const p=await preparar();await p.a.guardar(documento('m-hist','Vigente'),{crear:true});const base=modeloCon({objetos:[['Pedido',['nuevo','listo']]],procesos:['Despachar']});const texto=exportarV0({...base,id:'m-hist',secuencia:8,enlaces:{'e-6':{id:'e-6',tipo:'consumo',objeto:'o-2',proceso:'p-5',estado:'s-3',control:'c'},'e-7':{id:'e-7',tipo:'resultado',objeto:'o-2',proceso:'p-5',estado:'s-4'}}});expect(leerCanonico(texto).ok).toBe(true);const entrada=await fuentePapelera(p,texto);const r=await p.a.restaurar(entrada),actual=importarV0((await p.a.leer(r.id)).texto);expect(actual.ok).toBe(true);if(!actual.ok)throw Error('Destino debe ser canónico');expect(actual.modelo.enlaces).toEqual({'e-6':{id:'e-6',tipo:'consumo',objeto:'o-2',proceso:'p-5',estado:'s-3',control:'c'},'e-7':{id:'e-7',tipo:'resultado',objeto:'o-2',proceso:'p-5',estado:'s-4'}});expect(r.canonicalizado).toBeUndefined();expect(await p.a.papelera()).toEqual([]);
});

function documentoFisico(){const texto=exportarV0({...modeloCon(),id:'m-fisico',descripcion:'Marca \uFFFD original física'}),valido=Buffer.from(texto),i=valido.indexOf(Buffer.from([239,191,189]));if(i<0)throw Error('Fixture debe contener U+FFFD literal');return {texto,valido,invalido:Buffer.concat([valido.subarray(0,i),Buffer.from([255]),valido.subarray(i+3)])};}
test('T-287 físico UTF8 válido U+FFFD conserva bytes, longitud y SHA independiente',async()=>{
 const p=await preparar(),f=documentoFisico(),ruta=join(p.datos,'modelos/m-fisico.json');await writeFile(ruta,f.valido);const a=new Almacen({datos:p.datos,canon});await a.iniciar();expect(a.listar()[0]?.rev).toBe(createHash('sha256').update(f.valido).digest('hex'));expect(a.listar()[0]?.bytes).toBe(f.valido.length);const visto=await a.leer('m-fisico');expect(Buffer.from(visto.texto)).toEqual(f.valido);expect(visto.rev).toBe(createHash('sha256').update(f.valido).digest('hex'));expect(await readFile(ruta)).toEqual(f.valido);
});
test('T-287 físico UTF8 ilegible se archiva exacto sin texto activo/rev inventados',async()=>{
 const p=await preparar(),f=documentoFisico(),ruta=join(p.datos,'modelos/m-fisico.json');expect(f.invalido.toString('utf8')).toBe(f.texto);await writeFile(ruta,f.invalido);const a=new Almacen({datos:p.datos,canon});await a.iniciar();expect(a.listar()).toEqual([]);expect(await readdir(join(p.datos,'modelos'))).toEqual([]);expect(await readFile(join(p.datos,'archivo/invalidos/m-fisico.json'))).toEqual(f.invalido);await writeFile(ruta,Buffer.concat([f.invalido,Buffer.from(' ')]));await new Almacen({datos:p.datos,canon}).iniciar();const nombres=await readdir(join(p.datos,'archivo/invalidos'));expect(nombres).toHaveLength(2);expect(await readFile(join(p.datos,'archivo/invalidos/m-fisico.json'))).toEqual(f.invalido);
});
test('T-287 físico BOM UTF8 inicial no se elimina para fabricar legibilidad/canonicidad',async()=>{
 const p=await preparar(),f=documentoFisico(),bom=Buffer.concat([Buffer.from([239,187,191]),f.valido]);expect(importarV0(bom.toString('utf8')).ok).toBe(false);await writeFile(join(p.datos,'modelos/m-fisico.json'),bom);const a=new Almacen({datos:p.datos,canon});await a.iniciar();expect(a.listar()).toEqual([]);expect(await readFile(join(p.datos,'archivo/invalidos/m-fisico.json'))).toEqual(bom);
});
test('T-286 físico corrupción después de arrancar rechaza GET/CAS sin previa ni sustitución de bytes',async()=>{
 const p=await preparar(),f=documentoFisico(),g=await p.a.guardar(f.texto,{crear:true}),ruta=join(p.datos,'modelos/m-fisico.json');await writeFile(ruta,f.invalido);await expect(p.a.leer('m-fisico')).rejects.toThrow();await expect(p.a.guardar(f.texto,{id:'m-fisico',rev:g.rev,respaldo:true})).rejects.toThrow();await expect(p.a.eliminar('m-fisico',g.rev)).rejects.toThrow();expect(await readFile(ruta)).toEqual(f.invalido);expect(await readdir(join(p.datos,'previas'))).toEqual([]);expect(await readdir(join(p.datos,'papelera'))).toEqual([]);
});
test('T-287 físico papelera ilegible no fabrica fila legible ni modelo, fuente exacta conservada',async()=>{
 const p=await preparar(),f=documentoFisico(),entrada='m-fisico--2026-01-01T00:00:00.000Z--eliminado.json',ruta=join(p.datos,'papelera',entrada);await writeFile(ruta,f.invalido);expect(await p.a.papelera()).toEqual([]);await expect(p.a.restaurar(entrada)).rejects.toThrow();expect(await readFile(ruta)).toEqual(f.invalido);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);expect(p.a.listar()).toEqual([]);
});
test('T-287 físico restaurar UTF8 ilegible falla antes de instalar/respaldo sin Informe inventado',async()=>{
 const p=await preparar(),f=documentoFisico(),entrada='m-fisico--2026-01-01T00:00:00.000Z--eliminado.json',ruta=join(p.datos,'papelera',entrada);await writeFile(ruta,f.invalido);await expect(p.a.restaurar(entrada)).rejects.toThrow();expect(await readFile(ruta)).toEqual(f.invalido);expect(await readdir(join(p.datos,'modelos'))).toEqual([]);expect(await readdir(join(p.datos,'papelera'))).toEqual([entrada]);
});
