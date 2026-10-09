import type { ResultadoImport } from './informe';
import type { Entrada, Informe, DiffVisibilidad } from './informe';
import type { Modelo, Cosa, Enlace, Opd, Abanico, Estado, Aparicion, Duracion, UnidadTiempo, Multiplicidad } from '../nucleo/tipos';
import { esProcedimental, extremos } from '../nucleo/tipos';
import { validarForma } from '../nucleo/forma';
import { MATRIZ, noOfrecido, esMultiplicidad } from '../nucleo/matriz';
import { indice, describirEnlace } from '../nucleo/indice';
import { proyectar } from '../nucleo/proyeccion';
import { colocar } from '../nucleo/colocacion';
import { sufijoId } from '../nucleo/ids';
import { sha256 } from './sha256';
import { exportarV0 } from './exportar';
import { registro, esRegistro, texto as str, natural, unidad, unidades, opdAbanico, puertoComun } from './v0';
import type { Registro } from './v0';

// Datos JSON del usuario: conservar el original del Informe sin recursión ni coerción.
function jsonInforme(valor:unknown):string {
  if(valor===undefined)return 'undefined';
  const salida:string[]=[],pendientes:({texto:string}|{valor:unknown})[]=[{valor}];
  while(pendientes.length) {
    const parte=pendientes.pop()!;
    if('texto'in parte){salida.push(parte.texto);continue;}
    const x=parte.valor;
    if(Array.isArray(x)) {
      salida.push('[');pendientes.push({texto:']'});
      for(let i=x.length-1;i>=0;i--){pendientes.push({valor:x[i]});if(i>0)pendientes.push({texto:','});}
    } else if(esRegistro(x)) {
      const entradas=Object.entries(x).filter(([,v])=>v!==undefined&&typeof v!=='function'&&typeof v!=='symbol');
      salida.push('{');pendientes.push({texto:'}'});
      for(let i=entradas.length-1;i>=0;i--){const [k,v]=entradas[i]!;pendientes.push({valor:v},{texto:':'},{texto:JSON.stringify(k)});if(i>0)pendientes.push({texto:','});}
    } else salida.push(JSON.stringify(x)??'null');
  }
  return salida.join('');
}

class Lectura {
  readonly normalizado: Entrada[] = []; readonly descartado: Entrada[] = []; readonly rechazos: Entrada[] = [];
  readonly ignorado: Record<string,number> = {}; readonly visibilidad: DiffVisibilidad[] = [];
  private readonly entradas = new Set<string>();
  private readonly consumidos = new WeakSet<object>();
  get informe(): Informe { return { normalizado:this.normalizado, descartado:this.descartado, rechazos:this.rechazos, ignorado:this.ignorado, visibilidad:this.visibilidad }; }
  anotar(tipo:'normalizado'|'descartado'|'rechazos', ruta:string, mensaje:string, regla?:string):void {
    const key = `${tipo}:${ruta}:${regla ?? ''}:${mensaje}`; if (this.entradas.has(key)) return; this.entradas.add(key);
    this[tipo].push({ ruta,mensaje,...(regla ? { regla } : {}) });
  }
  norm(r:string,m:string,regla='T-287'):void { this.anotar('normalizado',r,m,regla); }
  perder(r:string,v:unknown,regla='T-006',m='Información no representable'):void { if(v!==null&&typeof v==='object')this.consumidos.add(v);this.anotar('descartado',r,`${m}: ${jsonInforme(v)}.`,regla); }
  rechazar(r:string,m:string):void { this.anotar('rechazos',r,m,'T-287'); }
  ignorar(r:string,v:unknown):void { if (v !== undefined) this.ignorado[r] = (this.ignorado[r] ?? 0) + (Array.isArray(v) ? v.length : esRegistro(v) ? Object.keys(v).length : 1); }
  desconocidos(v:unknown,ruta:string,conocidos:readonly string[]):void {
    if(v!==null&&typeof v==='object'&&this.consumidos.has(v))return;
    const pendientes=Object.entries(registro(v)).filter(([k])=>!conocidos.includes(k)).map(([k,x])=>({x,p:ruta?`${ruta}.${k}`:k})).reverse();
    while(pendientes.length) {
      const {x,p}=pendientes.pop()!;
      const hijos=esRegistro(x)?Object.entries(x):Array.isArray(x)?x.map((y,i)=>[String(i),y] as const):[];
      if(hijos.length) for(let i=hijos.length-1;i>=0;i--) { const [k,y]=hijos[i]!; pendientes.push({x:y,p:`${p}.${k}`}); }
      else this.perder(p,x,'T-006','Campo desconocido');
    }
  }
}
const count = (x:unknown) => Array.isArray(x) ? x.length : esRegistro(x) ? Object.keys(x).length : x === undefined ? 0 : 1;
function sobre(text:string,l:Lectura):Registro | undefined {
  let actual:unknown;
  try { actual = JSON.parse(text); } catch { l.rechazar('$','JSON inválido.'); return undefined; }
  for (let profundidad=0; profundidad<32; profundidad++) {
    if (!esRegistro(actual)) { l.rechazar('$','Sobre inválido.'); return undefined; }
    if (actual.carpetaId !== undefined) l.ignorar('carpetaId',actual.carpetaId);
    if (actual.formato === 'deep-opm-pro.modelo.v0') {
      if (!esRegistro(actual.modelo)) { l.rechazar('modelo','Modelo inválido.'); return undefined; }
      l.desconocidos(actual,'',['formato','modelo','carpetaId']); return actual.modelo;
    }
    if (actual.formato !== undefined) { l.rechazar('formato','Formato no reconocido.'); return undefined; }
    let siguiente:unknown;
    if (typeof actual.json === 'string') {
      siguiente=actual.json;
      for (const [k,v] of Object.entries(actual)) if (k !== 'json' && k !== 'carpetaId') l.ignorar(`registro.${k}`,v);
    } else if (actual.format === 'opforja.local-recovery.v1') {
      const d=registro(actual.document); siguiente=d.snapshotJson;
      const n=count(d.conflicts)+count(actual.conflicts); if (n) l.perder('document.conflicts',n,'T-006',`${n} ramas de recuperación conservadas solo en el original`);
      l.desconocidos(d,'document',['snapshotJson','conflicts','id','modelId','updatedAt','baseRevision','label']);
    } else if (actual.format === 'opforja.portable-package') {
      const integrity=registro(actual.integrity);
      if (actual.version !== 1 || typeof actual.payload !== 'string' || integrity.algorithm !== 'SHA-256' || typeof integrity.payloadDigest !== 'string' || sha256(actual.payload) !== integrity.payloadDigest) { l.rechazar('integrity','Versión o checksum SHA-256 inválido.'); return undefined; }
      let value:unknown; try { value=JSON.parse(actual.payload); } catch { l.rechazar('payload','Payload JSON inválido.'); return undefined; }
      const p=registro(value), manifest=registro(p.manifest), profile=registro(p.profile);
      if (profile.id !== 'deep-opm-pro.modelo' || profile.version !== 'deep-opm-pro.modelo.v0' || typeof manifest.selectedRevisionId !== 'string' || !Array.isArray(p.revisions)) { l.rechazar('manifest','Perfil o selección de revisión inválida.'); return undefined; }
      const ids=p.revisions.map(r=>registro(r).id), selected=p.revisions.map(registro).filter(r=>r.id === manifest.selectedRevisionId);
      if (selected.length !== 1 || new Set(ids).size !== ids.length || typeof selected[0]!.modelJson !== 'string') { l.rechazar('manifest.selectedRevisionId','Selección ausente o ambigua.'); return undefined; }
      siguiente=selected[0]!.modelJson;
      if (p.revisions.length>1) l.perder('payload.revisions',p.revisions.length-1,'T-006','Otras revisiones conservadas solo en el original');
      const sources=registro(p.sources), n=count(sources.included)+count(sources.omitted); if (n) l.perder('payload.sources',n,'T-006','Fuentes conservadas solo en el original');
      l.desconocidos(actual,'',['format','version','payload','integrity']); l.desconocidos(integrity,'integrity',['algorithm','payloadDigest']);
      l.desconocidos(p,'payload',['manifest','profile','revisions','sources']);
    } else { l.rechazar('formato','Formato no reconocido.'); return undefined; }
    if (typeof siguiente !== 'string') { l.rechazar('$','El sobre no contiene modelJson legible.'); return undefined; }
    try { actual=JSON.parse(siguiente); } catch { l.rechazar('$','JSON inválido en el sobre.'); return undefined; }
  }
  l.rechazar('$','Demasiados sobres anidados.'); return undefined;
}
type Col = 'entidades'|'estados'|'enlaces'|'abanicos'|'opds';
const cols:readonly Col[]=['entidades','estados','enlaces','abanicos','opds'];
const prefijos:Record<Col,string>={ entidades:'o',estados:'s',enlaces:'e',abanicos:'f',opds:'opd' };
function coleccion(x:unknown,r:string,l:Lectura):Record<string,Registro> {
  if (x === undefined) return {};
  if (!esRegistro(x) && !Array.isArray(x)) { l.rechazar(r,'Colección inválida.'); return {}; }
  const result:Record<string,Registro>=Object.create(null);
  for (const [key,value] of Object.entries(x)) {
    if (!esRegistro(value) || typeof value.id !== 'string') { l.rechazar(`${r}.${key}`,'Elemento sin id legible.'); continue; }
    if ((!Array.isArray(x) && key !== value.id) || Object.hasOwn(result,value.id)) { l.rechazar(`${r}.${key}`,'Id ambiguo dentro de la colección.'); continue; }
    result[value.id]={...value};
  }
  return result;
}
function valores(x:unknown,r:string,l:Lectura):Registro[] {
  if (x === undefined) return [];
  if (!esRegistro(x) && !Array.isArray(x)) { l.rechazar(r,'Colección inválida.'); return []; }
  return Object.entries(x).flatMap(([k,v])=> { if (!esRegistro(v)) { l.rechazar(`${r}.${k}`,'Elemento inválido.'); return []; } return [{...v,__key:k}]; });
}
function duracion(v:unknown):Duracion | undefined {
  if (!esRegistro(v)) return undefined;
  const nums=['min','esperada','max'].flatMap(k=>v[k] === undefined ? [] : [v[k]]);
  if (nums.some(n=>typeof n !== 'number' || !Number.isFinite(n) || n<=0) || v.unidad !== undefined && !unidades.includes(v.unidad as UnidadTiempo)) return undefined;
  const d=v as Duracion;
  if (d.min !== undefined && d.esperada !== undefined && d.min>d.esperada || d.esperada !== undefined && d.max !== undefined && d.esperada>d.max || d.min !== undefined && d.max !== undefined && d.min>d.max) return undefined;
  return { ...(d.min !== undefined ? {min:d.min}:{}), ...(d.esperada !== undefined ? {esperada:d.esperada}:{}), ...(d.max !== undefined ? {max:d.max}:{}), ...(d.unidad ? {unidad:d.unidad}:{}) };
}

type FusionarPares=(data:Record<Col,Record<string,Registro>>,enlaces:Record<string,Enlace>,l:Lectura,alias:Map<string,string>)=>void;

export function importarV0(texto:string):ResultadoImport {
  let directo=false;
  try { directo=registro(JSON.parse(texto)).formato==='deep-opm-pro.modelo.v0'; } catch { /* La ruta ordinaria devuelve el rechazo con su ruta. */ }
  if(directo) {
    // §3.4.2-7: construir y cerrar antes de decidir la fusión. No hay marcador wire.
    const candidato=importarDocumento(texto);
    if(candidato.ok&&candidato.informe.descartado.length===0&&candidato.informe.rechazos.length===0&&candidato.informe.visibilidad.length===0&&validarForma(candidato.modelo).length===0&&exportarV0(candidato.modelo)===texto)return candidato;
  }
  // Legado y sobres conservan las reglas ordinarias, con un Informe propio completo.
  return importarDocumento(texto,fusionarPares);
}

function importarDocumento(texto:string,fusionar?:FusionarPares):ResultadoImport {
  const l=new Lectura(), raw=sobre(texto,l);
  const fallo=():ResultadoImport=>({ok:false,informe:l.informe});
  if (!raw) return fallo();
  const entrada=Object.fromEntries(cols.map(k=>[k,coleccion(raw[k],k,l)])) as Record<Col,Record<string,Registro>>;
  if (l.rechazos.length) return fallo();
  let seq=Number.isSafeInteger(raw.nextSeq) && Number(raw.nextSeq)>0 ? Number(raw.nextSeq):1;
  for (const c of cols) for (const id of Object.keys(entrada[c])) seq=Math.max(seq,sufijoId(id)+1);
  const usados=new Set<string>();
  const nuevo=(p:string):string=> { let id:string; do { id=`${p}-${seq++}`; } while(usados.has(id)); usados.add(id); return id; };
  const maps=Object.fromEntries(cols.map(c=>[c,new Map<string,string>()])) as Record<Col,Map<string,string>>;
  for (const c of cols) for (const [old,v] of Object.entries(entrada[c])) {
    let id=old;
    if (!/^[A-Za-z0-9._:~-]{1,80}$/.test(id) || usados.has(id)) { id=nuevo(c==='entidades' && v.tipo === 'proceso' ? 'p':prefijos[c]); l.norm(`${c}.${old}.id`,`${old} → ${id}`,'T-022'); } else usados.add(id);
    maps[c].set(old,id);
  }
  const map=(c:Col,v:unknown):string=>typeof v === 'string' ? maps[c].get(v) ?? v : '';
  const data=Object.fromEntries(cols.map(c=>[c,Object.fromEntries(Object.entries(entrada[c]).map(([old,v])=>[map(c,old),{...v,id:map(c,old)}]))])) as unknown as typeof entrada;
  // Todas las referencias se reescriben por su rol, no por coincidencia de texto.
  for (const s of Object.values(data.estados)) s.entidadId=map('entidades',s.entidadId);
  for (const e of Object.values(data.enlaces)) {
    for (const key of ['origenId','destinoId']) {
      if (typeof e[key] === 'string') { e[key]={kind:'entidad',id:map('entidades',e[key])}; l.norm(`enlaces.${e.id}.${key}`,'Extremo textual → entidad.'); }
      else if (esRegistro(e[key])) { const v=e[key]; e[key]={...v,id:map(v.kind === 'estado' ? 'estados':'entidades',v.id)}; }
    }
    for (const k of ['estadoEntradaId','estadoSalidaId']) if (e[k] !== undefined) e[k]=map('estados',e[k]);
    if (esRegistro(e.derivado)) e.derivado={...e.derivado,enlacePadreId:map('enlaces',e.derivado.enlacePadreId),refinamientoId:map('entidades',e.derivado.refinamientoId)};
  }
  const apps=new Map<string,Registro[]>(), linksOpd=new Map<string,Registro[]>();
  for (const o of Object.values(data.opds)) {
    if (o.apariciones !== undefined && o.apariencias === undefined) { o.apariencias=o.apariciones; l.norm(`opds.${o.id}.apariciones`,'Alias apariciones → apariencias.'); }
    o.padreId=o.padreId === null ? null:map('opds',o.padreId);
    const as=valores(o.apariencias,`opds.${o.id}.apariencias`,l); for (const a of as) { a.entidadId=map('entidades',a.entidadId); a.opdId=a.opdId === undefined ? o.id:map('opds',a.opdId); if(Array.isArray(a.estadosSuprimidos)) a.estadosSuprimidos=a.estadosSuprimidos.map(v=>map('estados',v)); }
    apps.set(str(o.id),as);
    const es=valores(o.enlaces,`opds.${o.id}.enlaces`,l); for(const a of es) { a.enlaceId=map('enlaces',a.enlaceId); a.opdId=a.opdId === undefined ? o.id:map('opds',a.opdId); } linksOpd.set(str(o.id),es);
    if(Array.isArray(o.ordenInzoom)) o.ordenInzoom=o.ordenInzoom.map(b=>Array.isArray(b)?b.map(v=>map('entidades',v)):b);
  }
  for (const f of Object.values(data.abanicos)) { if(Array.isArray(f.enlaceIds)) f.enlaceIds=f.enlaceIds.map(v=>map('enlaces',v)); if(f.opdId!==undefined) f.opdId=map('opds',f.opdId); }
  const slots:{cosa:string;opd:string;tipo:string;modo?:string;ruta:string}[]=[];
  for (const e of Object.values(data.entidades)) {
    const refs={...registro(e.refinamientos)};
    if(e.refinamiento!==undefined) { const r=registro(e.refinamiento), t=str(r.tipo); if(refs[t]===undefined) refs[t]={opdId:r.opdId,...(r.modo!==undefined?{modo:r.modo}:{})}; l.norm(`entidades.${e.id}.refinamiento`,'Refinamiento legacy → plural.'); l.desconocidos(r,`entidades.${e.id}.refinamiento`,['tipo','opdId','modo']); }
    for(const [tipo,v] of Object.entries(refs)) { const s=registro(v); slots.push({cosa:str(e.id),opd:map('opds',s.opdId),tipo,...(typeof s.modo==='string'?{modo:s.modo}:{}),ruta:`entidades.${e.id}.refinamientos.${tipo}`}); l.desconocidos(s,`entidades.${e.id}.refinamientos.${tipo}`,['opdId','modo']); }
  }
  // Etapa 3: acumular referencias rotas antes de perder campos no representables.
  const ref=(c:Col,id:unknown,r:string):void=> { if(typeof id!=='string' || !Object.hasOwn(data[c],id)) l.rechazar(r,`Referencia inexistente: ${JSON.stringify(id)}.`); };
  for(const s of Object.values(data.estados)) ref('entidades',s.entidadId,`estados.${s.id}.entidadId`);
  for(const e of Object.values(data.enlaces)) {
    for(const k of ['origenId','destinoId']) { const v=registro(e[k]); if(v.kind!=='entidad'&&v.kind!=='estado') l.rechazar(`enlaces.${e.id}.${k}`,'Extremo inválido.'); else ref(v.kind==='estado'?'estados':'entidades',v.id,`enlaces.${e.id}.${k}`); }
    for(const k of ['estadoEntradaId','estadoSalidaId']) if(e[k]!==undefined) ref('estados',e[k],`enlaces.${e.id}.${k}`);
  }
  for(const [id,as] of apps) for(const a of as) { ref('entidades',a.entidadId,`opds.${id}.apariencias.${a.__key}.entidadId`); ref('opds',a.opdId,`opds.${id}.apariencias.${a.__key}.opdId`); }
  for(const [id,as] of linksOpd) for(const a of as) { ref('enlaces',a.enlaceId,`opds.${id}.enlaces.${a.__key}.enlaceId`); ref('opds',a.opdId,`opds.${id}.enlaces.${a.__key}.opdId`); }
  for(const s of slots) ref('opds',s.opd,`${s.ruta}.opdId`);
  for(const f of Object.values(data.abanicos)) for(const id of Array.isArray(f.enlaceIds)?f.enlaceIds:[]) if(!registro(data.enlaces[str(id)]?.derivado).tipo) ref('enlaces',id,`abanicos.${f.id}.enlaceIds`);
  for(const o of Object.values(data.opds)) if(o.ordenInzoom!==undefined) { if(!Array.isArray(o.ordenInzoom) || o.ordenInzoom.some(b=>!Array.isArray(b))) l.rechazar(`opds.${o.id}.ordenInzoom`,'Bandas inválidas.'); else for(const id of (o.ordenInzoom as unknown[][]).flat()) ref('entidades',id,`opds.${o.id}.ordenInzoom`); }
  const raiz=map('opds',raw.opdRaizId); ref('opds',raiz,'opdRaizId');
  if(l.rechazos.length) return fallo();
  const cosas:Record<string,Cosa>=Object.create(null), enlaces:Record<string,Enlace>=Object.create(null), opds:Record<string,Opd>=Object.create(null), abanicos:Record<string,Abanico>=Object.create(null);
  const modelo=():Modelo=>({ id:/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(str(raw.id))?str(raw.id):str(raw.id,'m-import').replace(/[^A-Za-z0-9_-]/g,'').slice(0,80)||'m-import',nombre:str(raw.nombre),...(typeof raw.descripcion==='string'?{descripcion:raw.descripcion}:{}),unidadTiempo:unidad(raw.unidadTiempo)??'min',raiz,cosas,enlaces,opds,abanicos,secuencia:seq });
  const nfc=(v:unknown,r:string):string=> { const s=str(v), n=s.normalize('NFC'); if(s!==n) l.norm(r,'Nombre convertido a NFC.','T-025'); return n; };
  for(const [id,e] of Object.entries(data.entidades)) {
    if(e.tipo!=='objeto'&&e.tipo!=='proceso') { l.rechazar(`entidades.${id}.tipo`,'Tipo de cosa inválido.'); continue; }
    const base:Registro={id,tipo:e.tipo,nombre:nfc(e.nombre,`entidades.${id}.nombre`)};
    for(const [key,values,def] of [['esencia',['fisica','informacional'],'informacional'],['afiliacion',['sistemica','ambiental'],'sistemica']] as const) {
      base[key]=values.includes(e[key] as never)?e[key]:def;
      if(e[key]===undefined) l.norm(`entidades.${id}.${key}`,`Default ${def}.`); else if(!values.includes(e[key] as never)) l.perder(`entidades.${id}.${key}`,e[key]);
    }
    if(typeof e.descripcion==='string') base.descripcion=e.descripcion;
    if(e.genero==='f') base.genero='f'; else if(e.genero!==undefined) l.perder(`entidades.${id}.genero`,e.genero);
    if(Array.isArray(e.coleccionIncompleta)) { const valid=e.coleccionIncompleta.filter(v=>['agregacion','exhibicion','generalizacion'].includes(str(v))); if(valid.length) base.incompleta=[...new Set(valid)]; if(valid.length!==e.coleccionIncompleta.length) l.perder(`entidades.${id}.coleccionIncompleta`,e.coleccionIncompleta); }
    if(e.tipo==='objeto') {
      base.estados=[];const slot=registro(e.valorSlot);
      if(slot.valor!==undefined) {
        if(slot.valor===null||typeof slot.valor!=='object')base.valor=String(slot.valor);
        else l.perder(`entidades.${id}.valorSlot.valor`,slot.valor,'T-020','Valor de slot no textual representable');
      } else if(e.valorSlot!==undefined)l.ignorar(`entidades.${id}.valorSlot`,e.valorSlot);
      if(slot.tipo!==undefined&&slot.tipo!=='string')l.perder(`entidades.${id}.valorSlot.tipo`,slot.tipo,'T-020');
      l.desconocidos(slot,`entidades.${id}.valorSlot`,['tipo','placeholder','valor']);
    }
    if(e.duracion!==undefined) { const d=duracion(e.duracion); if(e.tipo==='proceso'&&d) base.duracion=d; else l.perder(`entidades.${id}.duracion`,e.duracion,'T-021'); l.desconocidos(e.duracion,`entidades.${id}.duracion`,['min','esperada','max','unidad']); }
    for(const k of ['alias','unidad','imagen','urls','simulacion','estereotipoId','anclaje','requisito','lineal','orderedFundamentalTypes']) if(e[k]!==undefined) l.perder(`entidades.${id}.${k}`,e[k]);
    for(const k of ['esAtributo','layoutEstados']) l.ignorar(`entidades.${id}.${k}`,e[k]);
    l.desconocidos(e,`entidades.${id}`,['id','tipo','nombre','esencia','afiliacion','descripcion','genero','valorSlot','coleccionIncompleta','duracion','refinamientos','refinamiento','alias','unidad','imagen','urls','simulacion','estereotipoId','anclaje','requisito','lineal','orderedFundamentalTypes','esAtributo','layoutEstados']);
    cosas[id]=base as unknown as Cosa;
  }
  if(l.rechazos.length) return fallo();
  const estadosRetirados=new Set<string>();
  for(const id of Object.keys(cosas)) {
    const c=cosas[id]!; const es=Object.values(data.estados).filter(s=>s.entidadId===id);
    if(es.every(s=>typeof s.orden==='number')) es.sort((a,b)=>Number(a.orden)-Number(b.orden));
    else if(es.every(s=>/\d+$/.test(str(s.id)))) es.sort((a,b)=>sufijoId(str(a.id))-sufijoId(str(b.id)));
    const nuevos:Estado[]=[]; let porDefecto:string|undefined,current:string|undefined;
    for(const s of es) {
      const ruta=`estados.${s.id}`;
      if(c.tipo==='proceso') { estadosRetirados.add(str(s.id)); l.perder(ruta,s,'AP-12','Estado de proceso'); continue; }
      const des=Array.isArray(s.designaciones)?s.designaciones:[];
      const invalidas=des.filter(v=>!['default','porDefecto','current','inicial','final'].includes(str(v)));if(invalidas.length)l.perder(`${ruta}.designaciones`,invalidas,'T-016','Designaciones desconocidas');
      if(new Set(des).size!==des.length || s.esInicial===true&&des.includes('inicial') || s.esFinal===true&&des.includes('final')) l.norm(`${ruta}.designaciones`,'Designaciones repetidas unificadas.','T-016');
      const tieneDefault=des.includes('default')||des.includes('porDefecto')||s.default===true||s.porDefecto===true;
      if(tieneDefault) { if(porDefecto) l.perder(`${ruta}.designaciones.default`,true,'T-016'); else porDefecto=str(s.id); }
      if(des.includes('current')||s.current===true) { if(current) l.perder(`${ruta}.designaciones.current`,true,'T-017'); else current=str(s.id); }
      nuevos.push({id:str(s.id),nombre:nfc(s.nombre,`${ruta}.nombre`),...(s.esInicial===true||des.includes('inicial')?{inicial:true}:{}),...(s.esFinal===true||des.includes('final')?{final:true}:{}),...(s.suprimido===true?{suprimido:true}:{})});
      if(s.duracion!==undefined) l.perder(`${ruta}.duracion`,s.duracion,'T-021');
      for(const k of ['x','y','width','height']) l.ignorar(`${ruta}.${k}`,s[k]);
      l.desconocidos(s,ruta,['id','entidadId','nombre','orden','esInicial','esFinal','designaciones','default','porDefecto','current','suprimido','duracion','x','y','width','height']);
    }
    if(c.tipo==='objeto') cosas[id]={...c,estados:nuevos,...(porDefecto?{porDefecto}:{}),...(current?{current}:{})};
  }
  // Las siguientes etapas mantienen hechos propios; nunca ejecutan distribución del núcleo.
  construirOpds(data,apps,slots,raiz,cosas,opds,l,modelo);
  const alias=new Map<string,string>(), remap=(id:string):string=> { const vistos=new Set<string>(); while(alias.has(id)&&!vistos.has(id)){vistos.add(id);id=alias.get(id)!;} return id; };
  construirEnlaces(data,cosas,enlaces,estadosRetirados,l,nuevo,modelo,alias,fusionar);
  mapearDerivados(data,cosas,enlaces,opds,alias,remap,l,nuevo);
  fusionarDuplicados(data,enlaces,alias,remap,l);
  construirAbanicos(data,abanicos,enlaces,remap,l,modelo);
  for(const [id,c] of Object.entries(cosas)) if(c.tipo==='objeto'&&c.valor!==undefined&&!Object.values(enlaces).some(e=>e.tipo==='exhibicion'&&e.refinador===id)) { const {valor,...resto}=c; cosas[id]=resto; l.perder(`entidades.${id}.valorSlot.valor`,valor,'T-020','Valor sin exhibidor'); }
  if(raw.unidadTiempo===undefined) l.norm('unidadTiempo','Default min.'); else if(!unidad(raw.unidadTiempo)) l.perder('unidadTiempo',raw.unidadTiempo,'T-021');
  if(!Number.isSafeInteger(raw.nextSeq)||Number(raw.nextSeq)<seq) l.norm('nextSeq',`Secuencia elevada a ${seq}.`,'T-022');
  const result=modelo(); if(result.id!==raw.id) l.norm('id',`Identificador de modelo saneado: ${result.id}.`,'T-022');
  for(const k of ['ontologia','satisfaccionesRequisito','declaracionesNoNucleares','familiasEfectosPreestado','anclasNormativas','notasMesa','mesaExploracion','estereotipos','procedencia','fichaTrabajo','lentesConocimiento','submodelos','pieceLineage','referenciaPadreSubmodelo']) if(raw[k]!==undefined) l.perder(k,raw[k],'T-006',`${count(raw[k])} elementos no representables`);
  for(const k of ['archivado','archivadoEn','versiones','crearVersionAlGuardar']) l.ignorar(k,raw[k]);
  l.desconocidos(raw,'',['id','nombre','descripcion','unidadTiempo','opdRaizId','nextSeq',...cols,'ontologia','satisfaccionesRequisito','declaracionesNoNucleares','familiasEfectosPreestado','anclasNormativas','notasMesa','mesaExploracion','estereotipos','procedencia','fichaTrabajo','lentesConocimiento','submodelos','pieceLineage','referenciaPadreSubmodelo','archivado','archivadoEn','versiones','crearVersionAlGuardar']);
  if(l.rechazos.length) return fallo();
  const residual=validarForma(result);
  if(residual.length) {
    if(!(import.meta as ImportMeta & {env?:{PROD?:boolean}}).env?.PROD) throw Error(`Error interno del importador: ${JSON.stringify(residual)}`);
    for(const v of residual) l.rechazar('$',`Error interno del importador: ${v.mensaje}`); return fallo();
  }
  diffVisibilidad(result,linksOpd,data,remap,l);
  // §3.4.4: excepción del DOCUMENTO directo canónico propio, sin limpiar pérdidas/diff.
  // El recíproco no tiene otro wire v0: el legado conserva su anotación R-STRE-1.
  if(exportarV0(result)===texto) for(let i=l.normalizado.length-1;i>=0;i--) if(l.normalizado[i]!.regla==='R-STRE-1')l.normalizado.splice(i,1);
  return {ok:true,modelo:result,informe:l.informe};
}

function construirOpds(data:Record<Col,Record<string,Registro>>, apps:Map<string,Registro[]>, slots:{cosa:string;opd:string;tipo:string;modo?:string;ruta:string}[], raiz:string, cosas:Record<string,Cosa>, opds:Record<string,Opd>, l:Lectura, modelo:()=>Modelo):void {
  const asignados=new Map<string,typeof slots[number]>(), porCosa=new Set<string>();
  for(const s of [...slots].sort((a,b)=>natural(a.cosa,b.cosa))) {
    if(!['descomposicion','despliegue'].includes(s.tipo) || s.opd===raiz || asignados.has(s.opd) || porCosa.has(`${s.cosa}:${s.tipo}`) || !apps.get(s.opd)?.some(a=>a.entidadId===s.cosa)) { l.perder(s.ruta,s,'F-7','Ranura de refinamiento no representable'); continue; }
    asignados.set(s.opd,s); porCosa.add(`${s.cosa}:${s.tipo}`);
  }
  const padres=new Map<string,string|undefined>();
  for(const [id,o] of Object.entries(data.opds)) {
    if(id===raiz) continue;
    const padre=typeof o.padreId==='string'&&Object.hasOwn(data.opds,o.padreId)&&o.padreId!==id?o.padreId:undefined;
    padres.set(id,padre);
    if(o.padreId!==null&&padre===undefined) l.norm(`opds.${id}.padreId`,'Padre ausente/colgante/autorreferente → raíz.','F-7');
  }
  for(const id of padres.keys()) {
    const camino:string[]=[]; let p:string|undefined=id;
    while(p!==undefined&&p!==raiz&&!camino.includes(p)){camino.push(p);p=padres.get(p);}
    if(p!==undefined&&camino.includes(p)) { const menor=camino.slice(camino.indexOf(p)).sort(natural)[0]!; padres.set(menor,undefined); l.norm(`opds.${menor}.padreId`,'Ciclo de padres cortado en el menor id.','F-7'); }
  }
  const brutoPorCosa=new Map<string,Map<string,Registro>>();
  for(const [id,o] of Object.entries(data.opds)) {
    const s=asignados.get(id), ruta=`opds.${id}`;
    const objetoDescomp=s?.tipo==='descomposicion'&&cosas[s.cosa]?.tipo==='objeto';
    if(id!==raiz&&(!s||o.padreId===null||o.vista!==undefined||objetoDescomp&&porCosa.has(`${s.cosa}:despliegue`))) { l.perder(ruta,{apariciones:count(o.apariencias??o.apariciones)},'F-7','OPD boceto/huérfano/vista o descomposición no representable'); continue; }
    const apariciones:Record<string,Aparicion>=Object.create(null), elegidas=new Map<string,Registro>();
    for(const a of [...(apps.get(id)??[])].sort((a,b)=>natural(str(a.id),str(b.id)))) {
      const c=str(a.entidadId), ar=`${ruta}.apariencias.${a.__key}`;
      if(elegidas.has(c)) { l.norm(ar,'Aparición duplicada: se conserva el menor id.','DR-25'); continue; }
      elegidas.set(c,a);
      const num=(v:unknown,def:number)=>typeof v==='number'&&Number.isFinite(v)?Math.round(v):def;
      const x=num(a.x,0),y=num(a.y,0),small=typeof a.width!=='number'||!Number.isFinite(a.width)||a.width<20||typeof a.height!=='number'||!Number.isFinite(a.height)||a.height<20;
      const ancho=small?135:num(a.width,135),alto=small?60:num(a.height,60);
      if(x!==a.x||y!==a.y||ancho!==a.width||alto!==a.height) l.norm(ar,'Geometría redondeada; tamaño mínimo 135×60.','T-225');
      const dueño=cosas[c], propios=dueño?.tipo==='objeto'?new Set(dueño.estados.map(s=>s.id)):new Set<string>();
      const ocultos=Array.isArray(a.estadosSuprimidos)?[...new Set(a.estadosSuprimidos.filter((x):x is string=>typeof x==='string'&&propios.has(x)))]:[];
      if(Array.isArray(a.estadosSuprimidos)&&ocultos.length!==a.estadosSuprimidos.length) l.norm(`${ar}.estadosSuprimidos`,'Supresión filtrada a estados propios.','T-018');
      apariciones[c]={x,y,ancho,alto,...(ocultos.length?{ocultos}:{})};
      for(const k of ['id','ports','modoTamano','modoPlegado','ordenPartes','parteExtraidaDe']) l.ignorar(`${ar}.${k}`,a[k]);
      l.desconocidos(a,ar,['__key','id','entidadId','opdId','x','y','width','height','estadosSuprimidos','contextoRefinamiento','ports','modoTamano','modoPlegado','ordenPartes','parteExtraidaDe']);
      const ctx=registro(a.contextoRefinamiento); l.desconocidos(ctx,`${ar}.contextoRefinamiento`,['tipo','refinableEntidadId','rol','contenedorAparienciaId','enlacesPadreIds']);
      for(const k of ['tipo','refinableEntidadId','rol','contenedorAparienciaId','enlacesPadreIds']) l.ignorar(`${ar}.contextoRefinamiento.${k}`,ctx[k]);
    }
    brutoPorCosa.set(id,elegidas);
    if(typeof o.nombre==='string'&&!/^SD[\d.]*$/.test(o.nombre)) l.perder(`${ruta}.nombre`,o.nombre);
    if(o.preguntaGuia!==undefined) l.perder(`${ruta}.preguntaGuia`,o.preguntaGuia);
    for(const a of valores(o.enlaces,`${ruta}.enlaces`,l)) {
      const ar=`${ruta}.enlaces.${a.__key}`; for(const k of ['id','vertices','symbolPos','symbolAnchors','labelPositions']) l.ignorar(`${ar}.${k}`,a[k]);
      l.desconocidos(a,ar,['__key','id','enlaceId','opdId','vertices','symbolPos','symbolAnchors','labelPositions']);
    }
    l.desconocidos(o,ruta,['id','nombre','padreId','ordenLocal','ordenInzoom','apariencias','apariciones','enlaces','preguntaGuia','vista']);
    if(id===raiz) { opds[id]={id,tipo:'raiz',apariciones}; continue; }
    if(!s) continue;
    if(s.tipo==='despliegue'||objetoDescomp) {
      const modo=['agregacion','exhibicion','generalizacion','clasificacion'].includes(s.modo??'')?s.modo as 'agregacion':'agregacion';
      if(objetoDescomp) {
        const partes=new Set(Object.values(data.enlaces).filter(e=>e.tipo==='agregacion'&&registro(e.origenId).id===s.cosa).map(e=>str(registro(e.destinoId).id)));
        const sinParte=Object.keys(apariciones).filter(c=>c!==s.cosa&&cosas[c]?.tipo==='objeto'&&!partes.has(c)).sort(natural);
        l.norm(s.ruta,`Descomposición de objeto → despliegue agregación; no se creó ningún enlace. Objetos sin parte por agregación: ${JSON.stringify(sinParte)}; revisar si son partes.`,'DR-23');
      }
      else if(s.modo===undefined) l.norm(`${s.ruta}.modo`,'Modo de despliegue → agregacion.','T-029');
      else if(modo!==s.modo) l.perder(`${s.ruta}.modo`,s.modo,'T-029');
      opds[id]={id,tipo:'despliegue',cosa:s.cosa,padre:padres.get(id)??raiz,orden:0,modo,apariciones};
    } else opds[id]={id,tipo:'descomposicion',cosa:s.cosa,padre:padres.get(id)??raiz,orden:0,bandas:[],objetosInternos:[],apariciones};
  }
  // Recolgar hijos de OPDs descartados; si no hay aparición superviviente, se retira el OPD.
  for(let vuelta=0;vuelta<=Object.keys(data.opds).length;vuelta++) {
    let cambio=false;
    for(const [id,o] of Object.entries(opds)) if(o.tipo!=='raiz'&&!opds[o.padre]) {
      const elegido=indice(modelo()).preorden.find(p=>p!==id&&Object.hasOwn(opds[p]!.apariciones,o.cosa));
      if(elegido) { opds[id]={...o,padre:elegido}; l.norm(`opds.${id}.padreId`, `Recolgado a ${elegido}.`,'F-7'); }
      else { delete opds[id]; l.perder(`opds.${id}`,o,'F-7','Refinamiento sin padre con aparición'); }
      cambio=true;
    }
    if(!cambio) break;
  }
  const quitarSubarbol=(id:string):void=> { const hijos=Object.values(opds).filter(o=>o.tipo!=='raiz'&&o.padre===id).map(o=>o.id); const o=opds[id]; delete opds[id]; l.perder(`opds.${id}`,o,'R-REF-1','Ciclo de refinamiento: hechos conservados'); hijos.forEach(quitarSubarbol); };
  for(const [id,o] of Object.entries(opds)) if(o.tipo!=='raiz') {
    let p=opds[o.padre]; const vistos=new Set<string>([id]);
    while(p&&p.tipo!=='raiz'&&!vistos.has(p.id)) { if(p.cosa===o.cosa){quitarSubarbol(id);break;} vistos.add(p.id);p=opds[p.padre]; }
  }
  for(const [id,o] of Object.entries(opds)) if(o.tipo!=='raiz') {
    const padre=opds[o.padre];
    if(padre&&!Object.hasOwn(padre.apariciones,o.cosa)) { const tam={ancho:135,alto:60}, p=colocar(modelo(),padre.id,tam); opds[padre.id]={...padre,apariciones:{...padre.apariciones,[o.cosa]:{...p,...tam}}}; l.norm(`opds.${o.padre}.apariencias`, `Añadida aparición de ${o.cosa} en hueco libre.`,'T-029'); }
  }
  const hermanos=new Map<string,Opd[]>(); for(const o of Object.values(opds)) if(o.tipo!=='raiz'){const xs=hermanos.get(o.padre)??[];xs.push(o);hermanos.set(o.padre,xs);}
  for(const xs of hermanos.values()) {
    const valores=xs.map(o=>data.opds[o.id]?.ordenLocal), completo=valores.every(v=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0)&&new Set(valores).size===xs.length;
    xs.sort((a,b)=>completo?Number(data.opds[a.id]!.ordenLocal)-Number(data.opds[b.id]!.ordenLocal):natural(a.id,b.id));
    xs.forEach((o,orden)=>{if(o.tipo!=='raiz')opds[o.id]={...opds[o.id]!,orden} as Opd; if(!completo||data.opds[o.id]!.ordenLocal!==orden)l.norm(`opds.${o.id}.ordenLocal`, `Orden denso ${orden}.`,'T-031');});
  }
  const internosAsignados=new Set<string>();
  const subarbol=(id:string,otro:string):boolean=> { let p=opds[otro];const vistos=new Set<string>();while(p&&!vistos.has(p.id)){if(p.id===id)return true;vistos.add(p.id);p=p.tipo==='raiz'?undefined:opds[p.padre];}return false; };
  for(const id of indice(modelo()).preorden) {
    const o=opds[id]; if(o?.tipo!=='descomposicion') continue;
    const candidatos:string[]=[], objetoIds:string[]=[];
    for(const [c,a] of brutoPorCosa.get(id)??[]) {
      if(c===o.cosa) continue;
      const ctx=registro(a.contextoRefinamiento), contorno=o.apariciones[o.cosa], caja=o.apariciones[c]!;
      let interno=ctx.rol==='interno';
      if(ctx.rol===undefined) { interno=!!contorno&&caja.x>=contorno.x&&caja.y>=contorno.y&&caja.x+caja.ancho<=contorno.x+contorno.ancho&&caja.y+caja.alto<=contorno.y+contorno.alto&&!Object.hasOwn(opds[o.padre]!.apariciones,c); l.norm(`opds.${id}.apariencias.${a.__key}.contextoRefinamiento`,'Alcance derivado de geometría y padre.','T-033'); }
      if(interno&&Object.values(opds).some(p=>Object.hasOwn(p.apariciones,c)&&!subarbol(id,p.id))) { interno=false;l.norm(`opds.${id}.apariencias.${a.__key}.contextoRefinamiento`,'Interno con aparición fuera del subárbol → externo.','T-033'); }
      if(interno&&internosAsignados.has(c)) { interno=false;l.norm(`opds.${id}.apariencias.${a.__key}.contextoRefinamiento`,'Interno ya perteneciente a otro OPD → externo.','F-8'); }
      if(interno) { internosAsignados.add(c); (cosas[c]?.tipo==='proceso'?candidatos:objetoIds).push(c); }
    }
    const orden=data.opds[id]!.ordenInzoom, bandas:string[][]=[], usados=new Set<string>();
    if(Array.isArray(orden)) {
      for(const b of orden as unknown[][]) { const nuevos=b.filter((p):p is string=>typeof p==='string'&&candidatos.includes(p)&&!usados.has(p)); const unicos=[...new Set(nuevos)]; unicos.forEach(p=>usados.add(p)); if(unicos.length)bandas.push(unicos); }
      const faltantes=candidatos.filter(p=>!usados.has(p)).sort((a,b)=>o.apariciones[a]!.y-o.apariciones[b]!.y||natural(a,b)); faltantes.forEach(p=>bandas.push([p]));
      if(JSON.stringify(bandas)!==JSON.stringify(orden))l.norm(`opds.${id}.ordenInzoom`,'Bandas filtradas y completadas con internos.','T-030');
    } else {
      for(const c of candidatos.sort((a,b)=>o.apariciones[a]!.y-o.apariciones[b]!.y||natural(a,b))) { const ultima=bandas.at(-1); if(ultima&&Math.abs(o.apariciones[c]!.y-o.apariciones[ultima[0]!]!.y)<=4)ultima.push(c);else bandas.push([c]); }
      l.norm(`opds.${id}.ordenInzoom`,'Bandas derivadas de geometría (tolerancia 4 px).','T-030');
    }
    opds[id]={...o,bandas,objetosInternos:objetoIds};
  }
}

function construirEnlaces(data:Record<Col,Record<string,Registro>>, cosas:Record<string,Cosa>, enlaces:Record<string,Enlace>, retirados:Set<string>, l:Lectura, nuevo:(p:string)=>string, modelo:()=>Modelo, alias:Map<string,string>, fusionar:FusionarPares|undefined):void {
  const estadoPropio=(s:unknown,obj:string,r:string):string|undefined=> {
    if(s===undefined) return undefined;
    if(retirados.has(str(s))||cosas[obj]?.tipo!=='objeto'||!(cosas[obj] as Extract<Cosa,{tipo:'objeto'}>).estados.some(e=>e.id===s)) { l.perder(r,s,'F-3','Anclaje descartado: no es estado propio de objeto');return undefined; }
    return str(s);
  };
  const ext=(v:unknown,r:string):{cosa:string;estado?:string}=> {
    const x=registro(v), id=str(x.id);
    if(x.kind==='estado') { const s=data.estados[id]!, c=str(s.entidadId); const estado=estadoPropio(id,c,r); return {cosa:c,...(estado?{estado}:{})}; }
    return {cosa:id};
  };
  const mult=(v:unknown,r:string):Multiplicidad|undefined=> {
    if(v===undefined) return undefined;
    if(typeof v!=='string'&&typeof v!=='number') {l.perder(r,v,'DR-21','Multiplicidad fuera del producto');return undefined;}
    // DEC35: el entero exacto n ≥ 2 y 2..* son del producto; n..n es el mismo entero.
    const s=typeof v==='string'?v:String(v), alias:Record<string,Multiplicidad|undefined>={'0..1':'?','0..*':'*','0..N':'*','1..*':'+','1..N':'+','2..N':'2..*','1':undefined,'1..1':undefined};
    const exacto=/^([1-9]\d*)\.\.\1$/.exec(s)?.[1];
    const m=Object.hasOwn(alias,s)?alias[s]:esMultiplicidad(s)?s:exacto!==undefined&&esMultiplicidad(exacto)?exacto:null;
    if(m===null) { l.perder(r,v,'DR-21','Multiplicidad fuera del producto'); return undefined; }
    if(m&&m!==s)l.norm(r,`Multiplicidad equivalente ${s} → ${m}.`,'T-057'); return m;
  };
  const controles=(e:Registro,r:string):'c'|'e'|undefined=> {
    if(e.modificador==='condicion')return 'c'; if(e.modificador==='evento')return 'e';
    if(e.modificador===undefined&&(e.subtipoModificador==='C'||e.subtipoModificador==='E')) { l.norm(`${r}.subtipoModificador`,'Control desde alias legacy.','T-052'); return e.subtipoModificador==='C'?'c':'e'; }
    if(e.modificador!==undefined)l.perder(`${r}.modificador`,e.modificador,'T-052','Modificador irrepresentable'); return undefined;
  };
  const firma=(e:Enlace,r:string):boolean=> {
    const fila=MATRIZ[e.tipo], roles='objeto'in e?[e.objeto,e.proceso]:'refinable'in e?[e.refinable,e.refinador]:[e.origen,e.destino];
    const a=cosas[roles[0]!],b=cosas[roles[1]!];
    if(!a||!b||fila.clases[0]!=='cosa'&&fila.clases[0]!==a.tipo||fila.clases[1]!=='cosa'&&fila.clases[1]!==b.tipo||fila.mismoTipo&&a.tipo!==b.tipo||!fila.reflexivo&&a.id===b.id) { l.perder(r,data.enlaces[e.id],'F-2','Firma incompatible con la matriz'); return false; } return true;
  };
  const cotas=(e:Registro,id:string,origen:string):void=> {
    const c=cosas[origen]; if(c?.tipo!=='proceso')return;
    for(const [campo,bound,un] of [['tiempoMaximo','max','unidadTiempoMaximo'],['tiempoMinimo','min','unidadTiempoMinimo']] as const) {
      if(e[campo]===undefined)continue;
      const v=typeof e[campo]==='number'?e[campo]:typeof e[campo]==='string'&&e[campo]!==''?Number(e[campo]):NaN;
      const u=unidad(e[un])??(e[un]===undefined?modelo().unidadTiempo:undefined), r=`enlaces.${id}.${campo}`;
      if(!Number.isFinite(v)||v<=0||!u){l.perder(r,{valor:e[campo],unidad:e[un]},'T-021','Cota no numérica/positiva o unidad desconocida');continue;}
      const actual=cosas[origen]; if(actual?.tipo!=='proceso')continue;
      const d=actual.duracion??{}, du=d.unidad??(actual.duracion?modelo().unidadTiempo:u);
      const factores:Partial<Record<UnidadTiempo,number>>={ms:1,sec:1000,min:60000,hour:3600000,day:86400000,week:604800000};
      if(du!==u&&(factores[du]===undefined||factores[u]===undefined)) {l.perder(r,{valor:e[campo],unidad:e[un]},'T-021','Choque de representación entre unidades sin equivalencia exacta; conserva primera cota');continue;}
      const n=du===u?v:v*factores[u]!/factores[du]!;
      if(d[bound]===n) {l.ignorar(r,e[campo]);l.ignorar(`enlaces.${id}.${un}`,e[un]);continue;}
      const propuesto={...d,[bound]:n,...(d.unidad?{}:{unidad:du})};
      if(d[bound]!==undefined||!duracion(propuesto)) {l.perder(r,{valor:e[campo],unidad:e[un]},'T-021','Cota incompatible: conserva primera cota');continue;}
      cosas[origen]={...actual,duracion:propuesto}; l.norm(r,`Cota ${JSON.stringify(e[campo])} ${str(e[un],u)} → duración.${bound} ${n} ${du}.`,'R-EXC-2/3');
    }
  };
  for(const [id,e] of Object.entries(data.enlaces)) {
    const r=`enlaces.${id}`, a=ext(e.origenId,`${r}.origenId`), b=ext(e.destinoId,`${r}.destinoId`), tipo=str(e.tipo);
    if(e.modificador==='no') {l.perder(r,e,'DS-19','Enlace negado no representable');continue;}
    if(!Object.hasOwn(MATRIZ,tipo)&&tipo!=='excepcionSubSobretiempo') {l.perder(r,e,'F-2','Tipo de enlace desconocido');continue;}
    let out:Registro={id,tipo};
    let segundo:Enlace|undefined;
    const ctrl=controles(e,r), mo=mult(e.multiplicidadOrigen,`${r}.multiplicidadOrigen`), md=mult(e.multiplicidadDestino,`${r}.multiplicidadDestino`);
    let permiteOrigen=false, permiteDestino=false;
    if(['consumo','agente','instrumento'].includes(tipo)) {out={...out,objeto:a.cosa,proceso:b.cosa,...(a.estado?{estado:a.estado}:{})};permiteOrigen=true;if(b.estado)l.perder(`${r}.destinoId`,b.estado,'F-3','Anclaje de proceso retirado');}
    else if(tipo==='resultado') {out={...out,objeto:b.cosa,proceso:a.cosa,...(b.estado?{estado:b.estado}:{})};permiteDestino=true;if(a.estado)l.perder(`${r}.origenId`,a.estado,'F-3','Anclaje de proceso retirado');}
    else if(tipo==='efecto') {
      const directo=cosas[a.cosa]?.tipo==='proceso',obj=directo?b.cosa:a.cosa,proc=directo?a.cosa:b.cosa;
      const entrada=estadoPropio(e.estadoEntradaId??(!directo?a.estado:undefined),obj,`${r}.estadoEntradaId`),salida=estadoPropio(e.estadoSalidaId??(directo?b.estado:undefined),obj,`${r}.estadoSalidaId`);
      out={...out,objeto:obj,proceso:proc,...(entrada?{entrada}:{}),...(salida?{salida}:{})}; permiteDestino=directo;permiteOrigen=!directo;
      if(!directo)l.norm(r,'Efecto con dirección v0 O→P → compacto P→O.','T-032');
    } else if(['invocacion','excepcionSobretiempo','excepcionSubtiempo','excepcionSubSobretiempo'].includes(tipo)) {
      out={...out,origen:a.cosa,destino:b.cosa}; if(a.estado)l.perder(`${r}.origenId`,a.estado,'F-3');if(b.estado)l.perder(`${r}.destinoId`,b.estado,'F-3');
      if(tipo==='excepcionSubSobretiempo') {out.tipo='excepcionSobretiempo';const subId=Object.hasOwn(data.enlaces,`${id}~sub`)?nuevo('e'):`${id}~sub`;segundo={id:subId,tipo:'excepcionSubtiempo',origen:a.cosa,destino:b.cosa};}
    } else if(['agregacion','exhibicion','generalizacion','clasificacion'].includes(tipo)) {
      out={...out,refinable:a.cosa,refinador:b.cosa};permiteDestino=tipo==='agregacion';
      if(tipo==='generalizacion'&&a.estado&&b.estado&&cosas[a.cosa]?.tipo==='objeto'&&cosas[b.cosa]?.tipo==='objeto')out.estados={general:a.estado,especializacion:b.estado};
      else {if(a.estado)l.perder(`${r}.origenId`,a.estado,'R-OPL-RF-3','Anclaje estructural retirado');if(b.estado)l.perder(`${r}.destinoId`,b.estado,'R-OPL-RF-3','Anclaje estructural retirado');}
    } else {
      out={...out,origen:a.cosa,destino:b.cosa}; permiteOrigen=true;permiteDestino=true;const tag=str(e.etiqueta),back=str(e.backwardTag);
      if(tipo==='etiquetado')out={...out,...(tag?{etiqueta:tag}:{}),...(a.estado?{estadoOrigen:a.estado}:{}),...(b.estado?{estadoDestino:b.estado}:{})};
      else if(tag===back) {
        l.norm(r,'Etiquetas iguales → recíproco.','R-STRE-1');
        out={...out,tipo:'reciproco',...(tag?{etiqueta:tag}:{}),...(a.estado?{estados:{origen:a.estado,...(b.estado?{destino:b.estado}:{})}}:{})};
        if(!a.estado&&b.estado)l.perder(`${r}.destinoId`,b.estado,'AP-11','Recíproco no admite solo estado destino');
      } else if(!tag||!back) {
        out={...out,tipo:'etiquetado',...(tag?{etiqueta:tag}:{}),...(a.estado?{estadoOrigen:a.estado}:{}),...(b.estado?{estadoDestino:b.estado}:{})};
        const secondId=Object.hasOwn(data.enlaces,`${id}~inv`)?nuevo('e'):`${id}~inv`;
        segundo={id:secondId,tipo:'etiquetado',origen:b.cosa,destino:a.cosa,...(back?{etiqueta:back}:{}),...(b.estado?{estadoOrigen:b.estado}:{}),...(a.estado?{estadoDestino:a.estado}:{}),...(md?{multOrigen:md}:{}),...(mo?{multDestino:mo}:{})};
        l.norm(r,`Etiqueta vacía → dos enlaces opuestos (${secondId}).`,'DS-13');
      } else {out={...out,etiqueta:tag,inversa:back,...(a.estado?{estadoOrigen:a.estado}:{})};if(b.estado)l.perder(`${r}.destinoId`,b.estado,'AP-11','Bidireccional no admite estado destino');}
    }
    const internalTipo=out.tipo as Enlace['tipo'];
    if(ctrl) {if(MATRIZ[internalTipo].control)out.control=ctrl;else l.perder(`${r}.modificador`,e.modificador??e.subtipoModificador,'AP-01/02','Control ilegal retirado');}
    if(mo) {if(permiteOrigen)out[MATRIZ[internalTipo].familia==='etiquetada'?'multOrigen':'mult']=mo;else l.perder(`${r}.multiplicidadOrigen`,e.multiplicidadOrigen,'R-MULT-1A','Multiplicidad en extremo ilegal');}
    if(md) {if(permiteDestino)out[MATRIZ[internalTipo].familia==='etiquetada'?'multDestino':'mult']=md;else l.perder(`${r}.multiplicidadDestino`,e.multiplicidadDestino,'R-MULT-1A','Multiplicidad en extremo ilegal');}
    if(e.rutaEtiqueta!==undefined) {if(internalTipo==='consumo'||internalTipo==='resultado')out.ruta=str(e.rutaEtiqueta);else l.perder(`${r}.rutaEtiqueta`,e.rutaEtiqueta,'DR-19');}
    if(MATRIZ[internalTipo].familia!=='etiquetada'&&typeof e.etiqueta==='string'&&e.etiqueta!=='')l.perder(`${r}.etiqueta`,e.etiqueta,'R-OPL-1');
    for(const k of ['probabilidad','demora','tasa','unidadesTasa','requisitos','mostrarRequisitos'])if(e[k]!==undefined)l.perder(`${r}.${k}`,e[k]);
    for(const k of ['subtipoModificador','grupoEstructuralId','portId'])l.ignorar(`${r}.${k}`,e[k]);
    l.desconocidos(e,r,['id','tipo','origenId','destinoId','etiqueta','backwardTag','estadoEntradaId','estadoSalidaId','efectoEscindido','modificador','subtipoModificador','multiplicidadOrigen','multiplicidadDestino','rutaEtiqueta','tiempoMaximo','tiempoMinimo','unidadTiempoMaximo','unidadTiempoMinimo','probabilidad','demora','tasa','unidadesTasa','requisitos','mostrarRequisitos','grupoEstructuralId','portId','derivado']);
    for(const key of ['origenId','destinoId'])l.desconocidos(e[key],`${r}.${key}`,['kind','id']);
    if(firma(out as unknown as Enlace,r)) {
      enlaces[id]=out as unknown as Enlace;
      if(segundo)enlaces[segundo.id]=segundo;
      if(tipo==='excepcionSubSobretiempo')l.norm(r,`Excepción dual → ${id} y ${segundo!.id}.`,'T-265');
      if(['excepcionSobretiempo','excepcionSubtiempo','excepcionSubSobretiempo'].includes(tipo))cotas(e,id,a.cosa);
    }
  }
  // Un grupo real de mitades, con objetos/estados propios, acredita el par; metadata sola no.
  const grupos=new Map<string,{id:string;meta:Registro}[]>();
  for(const [id,e] of Object.entries(data.enlaces))if(e.efectoEscindido!==undefined&&enlaces[id]?.tipo==='efecto') {
    const meta=registro(e.efectoEscindido),g=str(meta.grupoId),xs=grupos.get(g)??[];xs.push({id,meta});grupos.set(g,xs);
    l.ignorar(`enlaces.${id}.efectoEscindido.enlacePadreId`,meta.enlacePadreId);l.desconocidos(meta,`enlaces.${id}.efectoEscindido`,['grupoId','rol','modo','enlacePadreId']);
  }
  for(const [g,xs] of grupos) {
    const a=xs.find(x=>x.meta.rol==='entrada'),b=xs.find(x=>x.meta.rol==='salida'),ea=a?enlaces[a.id]:undefined,eb=b?enlaces[b.id]:undefined;
    const valid=!!g&&xs.length===2&&a&&b&&a.id!==b.id&&ea?.tipo==='efecto'&&eb?.tipo==='efecto'&&ea.objeto===eb.objeto&&ea.entrada!==undefined&&ea.salida===undefined&&eb.salida!==undefined&&eb.entrada===undefined&&xs.every(x=>x.meta.modo===undefined||x.meta.modo==='par');
    if(valid&&a&&b&&ea?.tipo==='efecto'&&eb?.tipo==='efecto') {
      for(const [x,e,par,mitad] of [[a,ea,b.id,'entrada'],[b,eb,a.id,'salida']] as const) {const {control,...sinControl}=e;enlaces[x.id]={...sinControl,escision:{par,mitad}};if(control)l.perder(`enlaces.${x.id}.modificador`,control,'AP-08','Control de mitad escindida');if(x.meta.modo===undefined)l.norm(`enlaces.${x.id}.efectoEscindido.modo`,'Grupo real TS4/TS5 complementario → par.','T-032');}
    } else for(const x of xs) { if(xs.length===1||x.meta.modo==='standalone')l.norm(`enlaces.${x.id}.efectoEscindido`,'Mitad standalone sin par.','T-032');else l.perder(`enlaces.${x.id}.efectoEscindido`,x.meta,'T-032','Metadata de grupo ambiguo no representable: conserva el hecho'); }
  }
  fusionar?.(data,enlaces,l,alias);
  // F-5 conserva el mínimo elemento y nunca convierte contexto cargable en rechazo.
  for(const [id,e] of Object.entries(enlaces)) {
    const no=noOfrecido(modelo(),e);if(!no)continue;let out:Registro={...e};
    if(no.registro==='B-05') {delete out.estados;l.perder(`enlaces.${id}.estados`,('estados'in e?e.estados:undefined),no.regla,'Anclajes sin plantilla');}
    else for(const k of ['mult','multOrigen','multDestino'])if(out[k]!==undefined){l.perder(`enlaces.${id}.${k}`,out[k],no.regla,'Multiplicidad sin plantilla');delete out[k];}
    enlaces[id]=out as unknown as Enlace;
  }
}

function fusionarPares(data:Record<Col,Record<string,Registro>>,enlaces:Record<string,Enlace>,l:Lectura,alias:Map<string,string>):void {
  const enFan=new Set(Object.values(data.abanicos).flatMap(f=>Array.isArray(f.enlaceIds)?f.enlaceIds.map(v=>str(v)):[]));
  const pares=new Map<string,Enlace[]>();
  for(const e of Object.values(enlaces))if((e.tipo==='consumo'||e.tipo==='resultado')&&e.estado!==undefined&&!registro(data.enlaces[e.id]?.derivado).tipo) {const key=JSON.stringify([e.objeto,e.proceso]),xs=pares.get(key)??[];xs.push(e);pares.set(key,xs);}
  for(const xs of pares.values()) {
    if(xs.length!==2)continue;const c=xs.find(e=>e.tipo==='consumo'),r=xs.find(e=>e.tipo==='resultado');
    if(c?.tipo!=='consumo'||r?.tipo!=='resultado'||enFan.has(c.id)||enFan.has(r.id)||c.ruta!==undefined||r.ruta!==undefined||c.mult!==undefined||r.mult!==undefined)continue;
    enlaces[c.id]={id:c.id,tipo:'efecto',objeto:c.objeto,proceso:c.proceso,...(c.estado?{entrada:c.estado}:{}),...(r.estado?{salida:r.estado}:{}),...(c.control?{control:c.control}:{})};delete enlaces[r.id];alias.set(r.id,c.id);l.norm(`enlaces.${c.id}`,`Consumo + resultado ${r.id} → TS3; alias ${r.id} → ${c.id}.`,'T-032');
  }
}

// Dos registros con el mismo contenido sobre los mismos extremos son un único hecho
// repetido (copias por OPD del legado): se conserva el primero, sin pérdida (R-ROL-UNIC-1).
function fusionarDuplicados(data:Record<Col,Record<string,Registro>>,enlaces:Record<string,Enlace>,alias:Map<string,string>,remap:(id:string)=>string,l:Lectura):void {
  const enFan=new Set(Object.values(data.abanicos).flatMap(f=>Array.isArray(f.enlaceIds)?f.enlaceIds.map(v=>remap(str(v))):[]));
  const vistos=new Map<string,string>();
  for(const e of Object.values(enlaces)) {
    if(enFan.has(e.id)||'escision' in e&&e.escision!==undefined)continue;
    const {id,...resto}=e,clave=JSON.stringify(Object.entries(resto).sort(([a],[b])=>a<b?-1:a>b?1:0));
    const previo=vistos.get(clave);
    if(previo===undefined){vistos.set(clave,id);continue;}
    delete enlaces[id];alias.set(id,previo);
    l.norm(`enlaces.${id}`,`Enlace idéntico a ${previo}: el mismo hecho repetido se conserva una vez.`,'R-ROL-UNIC-1');
  }
}

function mapearDerivados(data:Record<Col,Record<string,Registro>>, cosas:Record<string,Cosa>, enlaces:Record<string,Enlace>, opds:Record<string,Opd>, alias:Map<string,string>, remap:(id:string)=>string, l:Lectura, nuevo:(p:string)=>string):void {
  const grupos=new Map<string,{id:string;raw:Registro;meta:Registro;hecho:Enlace|undefined}[]>();
  for(const [id,raw] of Object.entries(data.enlaces))if(registro(raw.derivado).tipo==='enlace-externo-refinamiento') {
    const meta=registro(raw.derivado),p=remap(str(meta.enlacePadreId)),grupo=grupos.get(p)??[];grupo.push({id,raw,meta,hecho:enlaces[id]});grupos.set(p,grupo);
    l.desconocidos(meta,`enlaces.${id}.derivado`,['tipo','enlacePadreId','refinamientoId','origen']);
  }
  const enFan=new Set(Object.values(data.abanicos).flatMap(f=>Array.isArray(f.enlaceIds)?f.enlaceIds.map(id=>remap(str(id))):[]));
  for(const [id,xs] of grupos) {
    let padre=enlaces[id];
    if(!padre) {for(const x of xs){delete enlaces[x.id];l.perder(`enlaces.${x.id}`,x.raw,'T-287','Derivado huérfano');}continue;}
    const manuales=xs.filter(x=>x.meta.origen==='manual'),automaticos=xs.filter(x=>x.meta.origen===undefined||x.meta.origen==='automatico');
    for(const x of xs) {
      if(x.meta.origen!==undefined&&x.meta.origen!=='manual'&&x.meta.origen!=='automatico'){l.perder(`enlaces.${x.id}.derivado`,x.meta,'T-287','Origen derivado desconocido');continue;}
      l.ignorar(`enlaces.${x.id}.derivado`,true);
      if(x.hecho)delete enlaces[x.id];
      alias.set(x.id,id);
      l.norm(`enlaces.${x.id}.derivado`,`${x.id} → hecho padre ${id}.`,'T-287');
    }
    if(manuales.length) {
      const primero=manuales[0]!;
      if(primero.hecho) {padre={...primero.hecho,id};enlaces[id]=padre;}
      for(const x of manuales.slice(1))if(x.hecho){enlaces[x.id]=x.hecho;alias.delete(x.id);l.norm(`enlaces.${x.id}.derivado`,'Reanclaje manual adicional conservado como propio.','T-287');}
      continue;
    }
    if(!esProcedimental(padre)||!automaticos.length)continue;
    const propios=automaticos.filter(x=>x.hecho&&esProcedimental(x.hecho));
    const procesos=propios.flatMap(x=>x.hecho&&esProcedimental(x.hecho)?[x.hecho.proceso]:[]);
    const ref=opds[Object.values(opds).find(o=>o.tipo==='descomposicion'&&o.cosa===padre!.proceso)?.id??''];
    const bandas=ref?.tipo==='descomposicion'?ref.bandas.flat():[];
    const indicados=new Set(procesos);
    const primero=bandas.find(p=>indicados.has(p))??bandas[0],ultimo=[...bandas].reverse().find(p=>indicados.has(p))??bandas.at(-1);
    if(padre.tipo==='resultado') {if(ultimo)enlaces[id]={...padre,proceso:ultimo};continue;}
    if(padre.tipo==='consumo') {if(primero)enlaces[id]={...padre,proceso:primero};continue;}
    // Etapa 8 / AP-21: el evento sistémico incluye habilitadores, no solo efecto.
    if(padre.control==='e'&&cosas[padre.objeto]?.afiliacion==='sistemica') {if(primero)enlaces[id]={...padre,proceso:primero};continue;}
    if(padre.tipo!=='efecto')continue;
    const full=padre.entrada!==undefined&&padre.salida!==undefined;
    if(full&&padre.control===undefined&&!enFan.has(id)&&primero&&ultimo) {
      const resultadoOriginal=[...alias].find(([original,target])=>target===id&&data.enlaces[original]?.tipo==='resultado')?.[0];
      const salidaId=resultadoOriginal??propios.find(x=>x.hecho&&esProcedimental(x.hecho)&&x.hecho.proceso===ultimo)?.id??nuevo('e');
      enlaces[id]={id,tipo:'efecto',objeto:padre.objeto,proceso:primero,entrada:padre.entrada!,escision:{par:salidaId,mitad:'entrada'}};
      enlaces[salidaId]={id:salidaId,tipo:'efecto',objeto:padre.objeto,proceso:ultimo,salida:padre.salida!,escision:{par:id,mitad:'salida'}};
      alias.delete(salidaId);
      for(const x of propios) if(str(x.meta.enlacePadreId)===resultadoOriginal||x.id===salidaId)alias.set(x.id,salidaId);
      l.norm(`enlaces.${id}.derivado`, `TS3 mapeado a mitades ${id}/${salidaId}.`,'T-032');
    } else if(padre.entrada!==undefined&&padre.salida===undefined || full&&(padre.control!==undefined||enFan.has(id))) {if(primero)enlaces[id]={...padre,proceso:primero};}
    else if(padre.salida!==undefined&&padre.entrada===undefined){if(ultimo)enlaces[id]={...padre,proceso:ultimo};}
    // Efecto simple/agente/instrumento sin evento sistémico conserva contorno.
  }
}

function construirAbanicos(data:Record<Col,Record<string,Registro>>, abanicos:Record<string,Abanico>, enlaces:Record<string,Enlace>, remap:(id:string)=>string, l:Lectura, modelo:()=>Modelo):void {
  const ocupados=new Set<string>(), firmas=new Set<string>();
  for(const [id,f] of Object.entries(data.abanicos)) {
    const originales=Array.isArray(f.enlaceIds)?f.enlaceIds.map(v=>str(v)):[],mapeados=[...new Set(originales.map(remap))],firma=[...mapeados].sort(natural).join('|');
    const derivados=originales.length>0&&originales.every(id=>registro(data.enlaces[id]?.derivado).tipo==='enlace-externo-refinamiento');
    if(derivados||firmas.has(firma)&&originales.some(id=>remap(id)!==id)) {l.ignorar(`abanicos.${id}`,true);continue;}
    const ramas=mapeados.filter(id=>Object.hasOwn(enlaces,id)&&!ocupados.has(id));
    if(ramas.length<2) {l.perder(`abanicos.${id}`,f,'T-028','Menos de dos ramas supervivientes');continue;}
    if(f.operador!=='O'&&f.operador!=='OR'&&f.operador!=='XOR'){l.perder(`abanicos.${id}.operador`,f.operador,'T-028');continue;}
    if(ramas.length!==mapeados.filter(id=>Object.hasOwn(enlaces,id)).length)l.norm(`abanicos.${id}.enlaceIds`,'Pertenencia doble: conserva el primer abanico.','F-6');
    const fan:Abanico={id,operador:f.operador==='XOR'?'XOR':'OR',enlaces:ramas};abanicos[id]=fan;
    const no=noOfrecido(modelo(),enlaces[ramas[0]!]!,fan);
    if(no) {delete abanicos[id];l.perder(`abanicos.${id}`,f,no.regla,'Abanico sin plantilla ofrecida; enlaces conservados');continue;}
    ramas.forEach(id=>ocupados.add(id));firmas.add(firma);
    if(f.decision!==undefined)l.perder(`abanicos.${id}.decision`,f.decision,'T-028');
    const comun=puertoComun(ramas.map(id=>enlaces[id]!)),puerto=registro(f.puertoComun);
    if(f.puertoEntidadId!==undefined&&f.puertoEntidadId!==(comun?.entidadId??''))l.norm(`abanicos.${id}.puertoEntidadId`,'Puerto común derivado de extremos.','T-028');
    if(f.puertoComun!==undefined&&(puerto.entidadId!==comun?.entidadId||puerto.lado!==comun?.lado||puerto.portId!==`puerto-${id}`))l.norm(`abanicos.${id}.puertoComun`,'Puerto común derivado de extremos.','T-028');
    l.desconocidos(puerto,`abanicos.${id}.puertoComun`,['entidadId','lado','portId']);
    l.desconocidos(f,`abanicos.${id}`,['id','operador','enlaceIds','puertoComun','puertoEntidadId','opdId','decision']);
  }
}

function diffVisibilidad(m:Modelo, links:Map<string,Registro[]>, data:Record<Col,Record<string,Registro>>, remap:(id:string)=>string, l:Lectura):void {
  const idx=indice(m);
  for(const o of idx.preorden) {
    const old=new Set((links.get(o)??[]).map(a=>remap(str(a.enlaceId)))),v=proyectar(m,o),directos=new Set(v.enlaces.filter(e=>!e.abstraido).flatMap(e=>e.hechos)),abstraidos=new Set(v.enlaces.filter(e=>e.abstraido).flatMap(e=>e.hechos));
    const linea=(id:string)=>({enlace:id,texto:m.enlaces[id]?describirEnlace(m,m.enlaces[id]!):`Enlace ${id} no representable`});
    const aparecen=[...directos].filter(id=>!old.has(id)).sort(natural).map(linea),desaparecen=[...old].filter(id=>!directos.has(id)&&!abstraidos.has(id)).sort(natural).map(linea);
    const fans=Object.values(data.abanicos).filter(f=>f.opdId===o&&m.abanicos[str(f.id)]&&!v.abanicos.some(v=>v.abanico===f.id)&&opdAbanico(m,str(f.id))!==o);
    for(const f of fans)desaparecen.push({abanico:str(f.id),texto:`Abanico ${f.id}`} as unknown as typeof desaparecen[number]);
    if(aparecen.length||desaparecen.length)l.visibilidad.push({opd:o,etiqueta:idx.etiqueta.get(o)??o,aparecen,desaparecen});
  }
}
