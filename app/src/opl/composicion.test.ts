import {test,expect} from 'bun:test';
import {PLANTILLAS,tokensPlantilla} from './plantillas';
import type {Huecos,Hueco} from './plantillas';
import {textoDeTokens} from './linea';
import {analizar} from './analizar';
const O:Hueco={texto:'Registro',marca:'objeto'},P:Hueco={texto:'Gestionar',marca:'proceso'},s:Hueco={texto:'listo',marca:'estado'};
for(const id of ['RF1','RF1i','RF2','RF2b','RF2i','RF3','RF3i','RF4b','RFE','D5','D6','CX1','CX2','CXM','FAN-consumo-convergente-XOR','FAN-resultado-divergente-OR','C18'] as const) for(let n=1;n<=4;n++)test(`T-194 composición ${id} lista ${n}`,()=>{
 const objs=Array.from({length:n},(_,i)=>({texto:['Alfa','Índice','Oro','Hierro'][i]!,marca:'objeto' as const})),ps=objs.map(o=>({...o,marca:'proceso' as const})),ss=objs.map((o,i)=>({texto:`estado_${i}`,marca:'estado' as const}));
 const h:Huecos={vertice:O,general:O,C:objs,otro:ps,O,P,s:id==='D5'||id==='D6'?ss:s,Oe:objs.map(o=>({...o,estado:s})),Plista:ps,Olista:objs,operador:{texto:id.endsWith('-OR')?'OR':'XOR'},SEC:{texto:'',tokens:ps.flatMap((p,i)=>[...(i?[{texto:i===n-1?' y ':', ',rol:'texto' as const}]:[]),{texto:p.texto,rol:'nombre' as const,marca:p.marca}]),bandas:ps.map(p=>[p])}};
 const p=PLANTILLAS.find(p=>p.id===id)!,texto=textoDeTokens(tokensPlantilla(id,h)),a=analizar(texto)[0]!;
 expect({texto,diagnosticos:a.diagnosticos}).toEqual({texto,diagnosticos:[]});expect(a.hechos).toEqual(p.hacia(h));
});


test('T-194 composición generativa reproducible conserva conjuntos listas opciones y bandas',()=>{
 let semilla=0x1949;const siguiente=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla>>>8;};
 const ids=['RF1','RF1i','RF2','RF2b','RF2i','RF3','RF3i','RF4b','RFE','D5','D6','CX1','CX2','CXM','FAN-consumo-convergente-XOR','FAN-resultado-divergente-OR','C18'];
 for(const id of ids)for(let ensayo=0;ensayo<8;ensayo++){
  const n=(id.startsWith('FAN')||id==='C18'?2:1)+siguiente()%(id.startsWith('FAN')||id==='C18'?3:4),femenino=!!(siguiente()%2),mult=[undefined,'?','*','+'][siguiente()%4] as Hueco['mult'],bases=['Índice','Hierro','Oro','Registro'];
  const objs:Hueco[]=Array.from({length:n},(_,i)=>({texto:bases[(siguiente()+i)%bases.length]+'_'+ensayo+'_'+i,marca:'objeto',...((id==='RF1'||id==='RF1i'||id.startsWith('FAN'))&&femenino&&(mult==='?'||mult==='+')?{genero:'f' as const}:{}),...((id==='RF1'||id==='RF1i'||id.startsWith('FAN'))&&mult?{mult}:{})})),ps=objs.map(o=>({...o,marca:'proceso' as const})),ss=objs.map((o,i)=>({texto:'estado_'+ensayo+'_'+i,marca:'estado' as const}));
  const bandas:Hueco[][]=[];for(const p of ps){if(bandas.length&&siguiente()%2)bandas[bandas.length-1]!.push(p);else bandas.push([p]);}
  if(id==='CX1'){bandas.splice(0,bandas.length,...ps.map(p=>[p]));}else if(id==='CX2'){bandas.splice(0,bandas.length,ps);}
  const secTokens:import('./linea').TokenOpl[]=[];bandas.forEach((b,i)=>{if(i)secTokens.push({texto:i===bandas.length-1?' y ':', ',rol:'texto'});if(b.length>1)secTokens.push({texto:'paralelo ',rol:'texto'});b.forEach((p,j)=>{if(j)secTokens.push({texto:j===b.length-1?' y ':', ',rol:'texto'});secTokens.push({texto:p.texto,rol:'nombre',marca:'proceso'});});});
  const h:Record<string,import('./plantillas').ValorHueco|undefined>={vertice:O,general:O,C:objs,otro:ps,O,P,s:id==='D5'||id==='D6'?ss:s,Oe:objs.map(o=>({...o,estado:s})),Plista:ps,Olista:objs,operador:{texto:id.endsWith('-OR')?'OR':'XOR'},SEC:{texto:'',tokens:secTokens,bandas}};
  if(id.startsWith('CX')){if(siguiente()%2)h.O=objs;else delete h.O;}
  const p=PLANTILLAS.find(p=>p.id===id)!,before=JSON.stringify(h),texto=textoDeTokens(tokensPlantilla(id,h)),a=analizar(texto)[0]!;expect({id,ensayo,diagnosticos:a.diagnosticos}).toEqual({id,ensayo,diagnosticos:[]});const firma=(f:unknown)=>JSON.stringify(f);expect(a.hechos.map(firma).sort()).toEqual(p.hacia(h).map(firma).sort());expect(JSON.stringify(h)).toBe(before);
 }
});
