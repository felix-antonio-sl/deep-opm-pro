import {expect,test} from 'bun:test';
import * as tabla from './plantillas';
const ids=['D1','D2','D3','D4','ENT3','D5','D6','D7','D8','D9','D10','D11','D12','D13','VAL','T1','T2','T3','TS1','TS2','TS3','TS4','TS5','H1','H2','HS1','HS2','ET1','ET2','ETS1','ETS2','ETS3','ETS4','EH1','EH2','EHS1','EHS2','CT1','CT2','CS1','CS2','CS3','CS4','CH1','CH2','CS5','CS6','COND-ALT','EX1','EX2','EX1r','EX2r','IV1','IV2','RF1','RF1i','RF2','RF2b','RF2i','RF3','RF3b','RF3i','RF4','RF4b','RH1','RFE','SE1','SE2','SE3','SSE1','SSE2','SSE3','SSE4','SSE5','SE4','SE5','SSE6','SSE7','FAN5s','FAN5e','FAN5A','FAN4','CFE','C18','CX1','CX2','CXM','CXI','CXN','CX3','CX3s','ATR-E'];
test('T-105 tabla única contiene las superficies G/P, desde y hacia tipados',()=>{
 const ps=(tabla as {PLANTILLAS?:readonly {id:string;estado:string;desde?:unknown;hacia:unknown}[]}).PLANTILLAS??[];
 for(const id of ids){const p=ps.find(p=>p.id===id);expect(p).toBeDefined();expect(typeof p?.hacia).toBe('function');if(p?.estado==='G')expect(typeof p.desde).toBe('function');}
 for(const id of ['D4','ENT3','D11','D12','COND-ALT','CXI','CXN','CX3s','ATR-E'])expect(ps.find(p=>p.id===id)?.estado).toBe('P');
});

test('T-105 hacia reconstruye consumo condicionado y agrupación de efecto sin conocimiento del modelo',()=>{
 const ps=(tabla as typeof import('./plantillas')).PLANTILLAS;
 const O={texto:'Pedido',marca:'objeto' as const}, P={texto:'Procesar',marca:'proceso' as const}, s={texto:'pendiente',marca:'estado' as const};
 expect(ps.find(p=>p.id==='CS1')!.hacia({O,P,s})).toEqual([{k:'enlace',enlace:{tipo:'consumo',objeto:{nombre:'Pedido',tipo:'objeto',estado:'pendiente'},proceso:'Procesar',control:'c'}}]);
 expect(ps.find(p=>p.id==='FAN5A')!.hacia({O,P,e:s,s:[{texto:'pagado',marca:'estado'},{texto:'anulado',marca:'estado'}],operador:{texto:'XOR'}})).toEqual([{k:'abanico',operador:'XOR',ramas:[{tipo:'efecto',objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Procesar',entrada:'pendiente',salida:'pagado'},{tipo:'efecto',objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Procesar',entrada:'pendiente',salida:'anulado'}]}]);
});
test('T-105 hacia CX conserva bandas e internos y nunca transforma paralelos en secuencia',()=>{
 const ps=(tabla as typeof import('./plantillas')).PLANTILLAS;
 expect(ps.find(p=>p.id==='CX2')!.hacia({P:{texto:'Procesar',marca:'proceso'},Plista:[{texto:'Archivar',marca:'proceso'},{texto:'Validar',marca:'proceso'}],O:[{texto:'Cuenta',marca:'objeto'}]})).toEqual([{k:'descomposicion',proceso:'Procesar',bandas:[['Archivar','Validar']],internos:['Cuenta']}]);
});

test('T-115 inversa de excepción recupera valor y unidad de la cota',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='EX1')!;expect(p.hacia({P1:{texto:'Archivar',marca:'proceso'},P2:{texto:'Procesar',marca:'proceso'},n:{texto:'1'},u:{texto:'hora'}})).toEqual([{k:'enlace',enlace:{tipo:'excepcionSobretiempo',origen:'Procesar',destino:'Archivar'}},{k:'cota',proceso:'Procesar',campo:'max',n:1,unidad:'hour'}]);
});
test('T-105 restricciones impiden vaciar listas y cambian ni el hecho ni la tabla',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='D5')!;expect(typeof p.restricciones).toBe('function');expect(p.restricciones!({O:{texto:'Pedido',marca:'objeto'},s:[]})).toBe(false);expect(p.restricciones!({O:{texto:'Pedido',marca:'objeto'},s:[{texto:'pagado',marca:'estado'}]})).toBe(true);
});

test('T-105 inversas estructurales recuperan ambas listas de RF2b e incompleta de RF3i',()=>{
 const c={texto:'Pedido',marca:'objeto' as const},a={texto:'Cuenta',marca:'objeto' as const},p={texto:'Procesar',marca:'proceso' as const};
 expect(tabla.PLANTILLAS.find(x=>x.id==='RF2b')!.hacia({vertice:c,C:[a],otro:[p]})).toEqual([{k:'enlace',enlace:{tipo:'exhibicion',refinable:{nombre:'Pedido',tipo:'objeto'},refinador:{nombre:'Cuenta',tipo:'objeto'}}},{k:'enlace',enlace:{tipo:'exhibicion',refinable:{nombre:'Pedido',tipo:'objeto'},refinador:{nombre:'Procesar',tipo:'proceso'}}}]);
 expect(tabla.PLANTILLAS.find(x=>x.id==='RF3i')!.hacia({C:[a],general:c})).toEqual([{k:'enlace',enlace:{tipo:'generalizacion',refinable:{nombre:'Pedido',tipo:'objeto'},refinador:{nombre:'Cuenta',tipo:'objeto'}}},{k:'incompleta',cosa:{nombre:'Pedido',tipo:'objeto'},relacion:'generalizacion'}]);
});
test('T-105 ENT3 preserva esencia y afiliación explícitas sin crear propiedades implícitas',()=>{
 expect(tabla.PLANTILLAS.find(x=>x.id==='ENT3')!.hacia({C:{texto:'Pedido',marca:'objeto'},esencia:{texto:'física'},afiliacion:{texto:'ambiental'}})).toEqual([{k:'mencion',cosa:{nombre:'Pedido',tipo:'objeto'}},{k:'esencia',cosa:{nombre:'Pedido',tipo:'objeto'},valor:'fisica'},{k:'afiliacion',cosa:{nombre:'Pedido',tipo:'objeto'},valor:'ambiental'}]);
});
test('T-121 inversa SSE5 conserva orientación superficial y el estado queda en el destino',()=>{
 expect(tabla.PLANTILLAS.find(x=>x.id==='SSE5')!.hacia({O1:{texto:'Pedido',marca:'objeto'},O2:{texto:'Cuenta',marca:'objeto'},a:{texto:'pendiente',marca:'estado'},t2:{texto:'pertenece a'}})).toEqual([{k:'enlace',enlace:{tipo:'etiquetado',origen:{nombre:'Cuenta',tipo:'objeto'},destino:{nombre:'Pedido',tipo:'objeto',estado:'pendiente'},etiqueta:'pertenece a'}}]);
});

test('T-129 la ruta pertenece a la plantilla y su inversa conserva el campo original',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='ET1')!;expect(p.patron).toContain('[Por ruta {r}, ]');expect(p.hacia({O:{texto:'Pedido',marca:'objeto'},P:{texto:'Procesar',marca:'proceso'},r:{texto:'normal'}})).toEqual([{k:'enlace',enlace:{tipo:'consumo',objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Procesar',control:'e',ruta:'normal'}}]);expect(tabla.PLANTILLAS.find(p=>p.id==='H1')!.patron).not.toContain('Por ruta');
});

test('T-106 D4 reconoce los dos géneros y conserva afiliación sistémica sin emisión',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='D4')!;expect(p.estado).toBe('P');expect(p.desde).toBeUndefined();for(const genero of [undefined,'f'] as const)expect(p.hacia({C:{texto:'Cuenta',marca:'objeto',...(genero?{genero}:{})}})).toEqual([{k:'afiliacion',cosa:{nombre:'Cuenta',tipo:'objeto'},valor:'sistemica'}]);expect(p.patron).toContain('sistémico|sistémica');
});
test('T-115 restricciones de cota rechazan unidad ajena y número no decimal',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='EX1')!,base={P1:{texto:'Archivar',marca:'proceso' as const},P2:{texto:'Procesar',marca:'proceso' as const}};expect(p.restricciones!({...base,n:{texto:'1'},u:{texto:'años'}})).toBe(true);expect(p.restricciones!({...base,n:{texto:'NaN'},u:{texto:'años'}})).toBe(false);expect(p.restricciones!({...base,n:{texto:'1'},u:{texto:'centurias'}})).toBe(false);
});

test('T-105 inversa CXI separa proceso contenedor, secuencia e internos tipados',()=>{
 const h={P:{texto:'Procesar',marca:'proceso' as const},Plista:[{texto:'Validar',marca:'proceso' as const},{texto:'Archivar',marca:'proceso' as const}],O:[{texto:'Cuenta',marca:'objeto' as const},{texto:'Pedido',marca:'objeto' as const}]};
 const before=JSON.stringify(h),p=tabla.PLANTILLAS.find(p=>p.id==='CXI')!;
 expect(p.hacia(h)).toEqual([{k:'descomposicion',proceso:'Procesar',bandas:[['Validar'],['Archivar']],internos:['Cuenta','Pedido']}]);
 expect(tabla.tokensPlantilla('CXI',h).filter(t=>t.marca).map(t=>[t.texto,t.marca])).toEqual([['Procesar','proceso'],['Validar','proceso'],['Archivar','proceso'],['Cuenta','objeto'],['Pedido','objeto']]);
 expect(JSON.stringify(h)).toBe(before);
});
test('T-105 inversa CX3s separa contenedor y refinadores mixtos sin autorrefinador',()=>{
 const h={vertice:{texto:'Pedido',marca:'objeto' as const},C:[{texto:'Cuenta',marca:'objeto' as const},{texto:'Procesar',marca:'proceso' as const}]};
 const before=JSON.stringify(h),p=tabla.PLANTILLAS.find(p=>p.id==='CX3s')!;
 expect(p.hacia(h)).toEqual([{k:'despliegue',cosa:{nombre:'Pedido',tipo:'objeto'},refinadores:[{nombre:'Cuenta',tipo:'objeto'},{nombre:'Procesar',tipo:'proceso'}]}]);
 expect(tabla.tokensPlantilla('CX3s',h).filter(t=>t.marca).map(t=>[t.texto,t.marca])).toEqual([['Pedido','objeto'],['Cuenta','objeto'],['Procesar','proceso']]);
 expect(JSON.stringify(h)).toBe(before);
});
test('T-118 inversa exhibición incompleta conserva rasgos de ambos tipos y la declaración',()=>{
 expect(tabla.PLANTILLAS.find(p=>p.id==='RF2i')!.hacia({vertice:{texto:'Pedido',marca:'objeto'},C:[{texto:'Cuenta',marca:'objeto'}],otro:[{texto:'Procesar',marca:'proceso'}]})).toEqual([{k:'enlace',enlace:{tipo:'exhibicion',refinable:{nombre:'Pedido',tipo:'objeto'},refinador:{nombre:'Cuenta',tipo:'objeto'}}},{k:'enlace',enlace:{tipo:'exhibicion',refinable:{nombre:'Pedido',tipo:'objeto'},refinador:{nombre:'Procesar',tipo:'proceso'}}},{k:'incompleta',cosa:{nombre:'Pedido',tipo:'objeto'},relacion:'exhibicion'}]);
});

const ramasTS3 = () => [
 {plantilla:'TS3',huecos:{O:{texto:'Pedido',marca:'objeto' as const},P:{texto:'Procesar',marca:'proceso' as const},e:{texto:'pendiente',marca:'estado' as const},s:{texto:'pagado',marca:'estado' as const}}},
 {plantilla:'TS3',huecos:{O:{texto:'Pedido',marca:'objeto' as const},P:{texto:'Procesar',marca:'proceso' as const},e:{texto:'pagado',marca:'estado' as const},s:{texto:'pagado',marca:'estado' as const}}}
];
// RAMAS es deliberadamente privado; el cast permite observar RED contra la firma previa sin cambiar producción.
const locales = (ramas:readonly unknown[]) => ({RAMAS:{texto:'',ramas}} as unknown as tabla.Huecos);
for(const op of ['XOR','OR'] as const)test(`T-105 local B-31 tabla única TS3 ${op} conserva operador y todos los roles`,()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id===`FANLOCAL-${op}`);expect(p).toBeDefined();expect(p).toMatchObject({estado:'G',origen:'LOCAL',registro:'B-31'});
 const h=locales(ramasTS3()),before=JSON.stringify(h);expect(p!.desde!({plantilla:p!.id,huecos:h})).toBe(h);
 expect(p!.hacia(h)).toEqual([{k:'abanico',operador:op,ramas:[{tipo:'efecto',objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Procesar',entrada:'pendiente',salida:'pagado'},{tipo:'efecto',objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Procesar',entrada:'pagado',salida:'pagado'}]}]);expect(JSON.stringify(h)).toBe(before);
});
for(const tipo of ['consumo','resultado','agente','instrumento'] as const)test(`T-105 local B-31 hacia ${tipo} conserva ausencia y marca de objeto común`,()=>{
 const ids={consumo:['TS1','T1'],resultado:['TS2','T2'],agente:['HS1','H1'],instrumento:['HS2','H2']}[tipo];
 const O={texto:'Pedido',marca:'objeto' as const};
 const h=locales([{plantilla:ids[0]!,huecos:{O,mO:O,P:{texto:'Procesar',marca:'proceso'},s:{texto:'pendiente',marca:'estado'}}},{plantilla:ids[1]!,huecos:{O,mO:O,P:{texto:'Archivar',marca:'proceso'}}}]);
 const p=tabla.PLANTILLAS.find(p=>p.id==='FANLOCAL-XOR');expect(p).toBeDefined();expect(p!.hacia(h)).toEqual([{k:'abanico',operador:'XOR',ramas:[{tipo,objeto:{nombre:'Pedido',tipo:'objeto',estado:'pendiente'},proceso:'Procesar'},{tipo,objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Archivar'}]}]);
});
const rechazosLocales:readonly [string,(ramas:ReturnType<typeof ramasTS3>)=>readonly unknown[]][]=[
 ['cero',()=>[]],['una',r=>[r[0]]],['familia mixta',r=>[r[0],{plantilla:'T1',huecos:{O:r[1]!.huecos.O,mO:r[1]!.huecos.O,P:r[1]!.huecos.P}}]],
 ['tipo O incorrecto',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,O:{texto:'Pedido',marca:'proceso'}}}]],
 ['O sin marca',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,O:{texto:'Pedido'}}}]],
 ['P sin marca',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,P:{texto:'Procesar'}}}]],
 ['E sin marca',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,e:{texto:'pagado'}}}]],
 ['salida ausente',r=>[r[0],{plantilla:'TS3',huecos:{O:r[1]!.huecos.O,P:r[1]!.huecos.P,e:r[1]!.huecos.e}}]],
 ['entrada y salida variables',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,s:{texto:'anulado',marca:'estado'}}}]],
 ['entrada uniforme',r=>[r[0],r[0]]],['otro objeto',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,O:{texto:'Cuenta',marca:'objeto'}}}]],
 ['otro proceso TS3',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,P:{texto:'Archivar',marca:'proceso'}}}]],
 ['control',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,control:{texto:'e'}}}]],['ruta',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,r:{texto:'normal'}}}]],
 ['plantilla ajena',r=>[r[0],{...r[1],plantilla:'D5'}]],['fragmento opaco',r=>[r[0],{...r[1],huecos:{...r[1]!.huecos,P:{...r[1]!.huecos.P,tokens:[{texto:'texto residual',rol:'texto'}]}}}]]
];
for(const [nombre,cambiar] of rechazosLocales)test(`T-105 local B-31 rechaza cerrado ${nombre}`,()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='FANLOCAL-XOR');expect(p).toBeDefined();const h=locales(cambiar(ramasTS3())),before=JSON.stringify(h);expect(p!.hacia(h)).toEqual([]);expect(p!.restricciones!(h)).toBe(false);expect(p!.desde!({plantilla:p!.id,huecos:h})).toBeNull();expect(JSON.stringify(h)).toBe(before);
});
test('T-105 local B-31 no acepta estado uniforme ni proceso repetido en objeto común',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='FANLOCAL-XOR');expect(p).toBeDefined();const O={texto:'Pedido',marca:'objeto' as const},s={texto:'pendiente',marca:'estado' as const},P={texto:'Procesar',marca:'proceso' as const};
 for(const r of [[{plantilla:'HS1',huecos:{O,mO:O,P,s}},{plantilla:'HS1',huecos:{O,mO:O,P:{texto:'Archivar',marca:'proceso'},s}}],[{plantilla:'HS1',huecos:{O,mO:O,P,s}},{plantilla:'H1',huecos:{O,mO:O,P}}]])expect(p!.hacia(locales(r))).toEqual([]);
});

for(const op of ['XOR','OR'] as const)test(`T-122 B-32 tabla agente objeto común ${op} conserva estado explícito o ausencia por rama`,()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id===`FAN-agente-divergente-${op}`)!;
 expect(p.patron).toBe('{Oe} maneja {Q} {Lo:Plista}.');
 for(const presente of [false,true]){
  const O={texto:'Operador',marca:'objeto' as const,...(presente?{estado:{texto:'listo',marca:'estado' as const}}:{})};
  const h={O,Plista:[{texto:'Archivar',marca:'proceso' as const},{texto:'Procesar',marca:'proceso' as const}],operador:{texto:op}},before=JSON.stringify(h);
  expect(p.hacia(h)).toEqual([{k:'abanico',operador:op,ramas:[{tipo:'agente',objeto:{nombre:'Operador',tipo:'objeto',...(presente?{estado:'listo'}:{})},proceso:'Archivar'},{tipo:'agente',objeto:{nombre:'Operador',tipo:'objeto',...(presente?{estado:'listo'}:{})},proceso:'Procesar'}]}]);expect(JSON.stringify(h)).toBe(before);
 }
});
