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
test('T-105 T-162 ENT3 preserva esencia y afiliación explícitas sin crear propiedades implícitas',()=>{
 expect(tabla.PLANTILLAS.find(x=>x.id==='ENT3')!.hacia({C:{texto:'Pedido',marca:'objeto'},esencia:{texto:'física'},afiliacion:{texto:'ambiental'}})).toEqual([{k:'mencion',cosa:{nombre:'Pedido',tipo:'objeto'}},{k:'esencia',cosa:{nombre:'Pedido',tipo:'objeto'},valor:'fisica'},{k:'afiliacion',cosa:{nombre:'Pedido',tipo:'objeto'},valor:'ambiental'}]);
});
test('T-121 inversa SSE5 conserva orientación superficial y el estado queda en el destino',()=>{
 expect(tabla.PLANTILLAS.find(x=>x.id==='SSE5')!.hacia({O1:{texto:'Pedido',marca:'objeto'},O2:{texto:'Cuenta',marca:'objeto'},a:{texto:'pendiente',marca:'estado'},t2:{texto:'pertenece a'}})).toEqual([{k:'enlace',enlace:{tipo:'etiquetado',origen:{nombre:'Cuenta',tipo:'objeto'},destino:{nombre:'Pedido',tipo:'objeto',estado:'pendiente'},etiqueta:'pertenece a'}}]);
});

test('T-129 la ruta pertenece a la plantilla y su inversa conserva el campo original',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='ET1')!;expect(p.patron).toContain('[Por ruta {r}, ]');expect(p.hacia({O:{texto:'Pedido',marca:'objeto'},P:{texto:'Procesar',marca:'proceso'},r:{texto:'normal'}})).toEqual([{k:'enlace',enlace:{tipo:'consumo',objeto:{nombre:'Pedido',tipo:'objeto'},proceso:'Procesar',control:'e',ruta:'normal'}}]);expect(tabla.PLANTILLAS.find(p=>p.id==='H1')!.patron).not.toContain('Por ruta');
});

test('T-106 D4 reconoce los dos géneros y conserva afiliación sistémica sin emisión',()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id==='D4')!;expect(p.estado).toBe('P');expect(p.desde).toBeUndefined();for(const genero of [undefined,'f'] as const)expect(p.hacia({C:{texto:'Cuenta',marca:'objeto',...(genero?{genero}:{})}})).toEqual([{k:'afiliacion',cosa:{nombre:'Cuenta',tipo:'objeto',...(genero?{genero}:{})},valor:'sistemica'}]);expect(p.patron).toContain('sistémico|sistémica');
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

for(const op of ['XOR','OR'] as const)test(`T-122 agente común tiene literal de cosa sin estado ${op}`,()=>{
 const p=tabla.PLANTILLAS.find(p=>p.id===`FAN-agente-divergente-${op}`)!;
 expect(p.patron).toBe('{O} maneja {Q} {Lo:Plista}.');
 const h={O:{texto:'Operador',marca:'objeto' as const},Plista:[{texto:'Archivar',marca:'proceso' as const},{texto:'Procesar',marca:'proceso' as const}],operador:{texto:op}},before=JSON.stringify(h);
 expect(p.hacia(h)).toEqual([{k:'abanico',operador:op,ramas:[{tipo:'agente',objeto:{nombre:'Operador',tipo:'objeto'},proceso:'Archivar'},{tipo:'agente',objeto:{nombre:'Operador',tipo:'objeto'},proceso:'Procesar'}]}]);expect(JSON.stringify(h)).toBe(before);
});


for (const plantilla of ['SE4', 'SE5', 'SSE6', 'SSE7'] as const) {
    test(`T-266 conjunción fonética de frase emitida ${plantilla} conserva tokens y estados`, () => {
        const Libro = { texto: 'Libro', marca: 'objeto' as const, ref: { tipo: 'cosa' as const, id: 'l' } };
        const Indice = { texto: 'Índice', marca: 'objeto' as const, ref: { tipo: 'cosa' as const, id: 'i' } };
        const h = { C1: Libro, C2: Indice, O1: Libro, O2: Indice, a: { texto: 'listo', marca: 'estado' as const }, b: { texto: 'abierto', marca: 'estado' as const }, t: { texto: 'asociados' } };
        const texto = tabla.tokensPlantilla(plantilla, h).map(t => t.texto).join('');
        expect(texto).toContain(plantilla === 'SSE7' ? 'Índice y Libro' : plantilla === 'SSE6' ? 'listo e Índice' : 'Libro e Índice');
        const tokens = tabla.tokensPlantilla(plantilla, h).filter(t => t.ref);
        expect(tokens.map(t => t.ref!.id)).toEqual(plantilla === 'SSE7' ? ['i', 'l'] : ['l', 'i']);
    });
}
test('T-117 RH1 conjunción sigue artículo pronunciado, no nombre aislado', () => {
    const C = { texto: 'Colección', marca: 'objeto' as const };
    const hs = { C, articulos: [{ texto: 'Libro', marca: 'objeto' as const }, { texto: 'Índice', marca: 'objeto' as const }] };
    expect(tabla.tokensPlantilla('RH1', hs).map(t => t.texto).join('')).toBe('Colección es un Libro y un Índice.');
});

test('T-127 CXM y/e lee la frase emitida, conserva comas, bandas y tokens',()=>{
 const m={id:'m',nombre:'Modelo',raiz:'sd',unidadTiempo:'min' as const,secuencia:10,cosas:Object.fromEntries(['P','Alfa','Beta','Índice','Isla'].map(id=>[id,{id,tipo:'proceso' as const,nombre:id,esencia:'informacional' as const,afiliacion:'sistemica' as const}])),enlaces:{},abanicos:{},opds:{}};
 const d:import('../nucleo/tipos').OpdDescomposicion={id:'h',tipo:'descomposicion',cosa:'P',padre:'sd',orden:0,bandas:[['Alfa','Beta'],['Índice']],objetosInternos:[],apariciones:{}};
 const p=tabla.PLANTILLAS.find(p=>p.id==='CXM')!,h=tabla.datosContexto({...m,opds:{h:d}},'h')!.huecos;
 expect(tabla.tokensPlantilla('CXM',h).map(t=>t.texto).join('')).toBe('P se descompone en paralelo Alfa y Beta, e Índice, en esa secuencia.');
 expect(p.hacia(h)).toEqual([{k:'descomposicion',proceso:'P',bandas:[['Alfa','Beta'],['Índice']],internos:[]}]);
});

test('T-191 T-300 compilación del patrón conserva opcionales género tokens y entradas intercaladas',()=>{
 const O={texto:'Pedido',marca:'objeto' as const,ref:{tipo:'cosa' as const,id:'o'},hecho:'e'},P={texto:'Validar',marca:'proceso' as const,ref:{tipo:'cosa' as const,id:'p'},hecho:'e'},h={O,P,r:{texto:'principal'}},before=JSON.stringify(h);
 const a=tabla.tokensPlantilla('T1',h);expect(a.map(t=>t.texto).join('')).toBe('Por ruta principal, Validar consume Pedido.');
 expect(tabla.tokensPlantilla('T1',{O,P}).map(t=>t.texto).join('')).toBe('Validar consume Pedido.');
 expect(tabla.tokensPlantilla('D1',{C:{...O,genero:'f'}}).map(t=>t.texto).join('')).toBe('Pedido es física.');
 expect(tabla.tokensPlantilla('D1',{C:O}).map(t=>t.texto).join('')).toBe('Pedido es físico.');
 expect(tabla.tokensPlantilla('T1',h)).toEqual(a);expect(JSON.stringify(h)).toBe(before);
 const literal=a.find(t=>t.rol==='verbo')!;literal.texto;Reflect.set(literal,'texto','contaminado');expect(tabla.tokensPlantilla('T1',h).map(t=>t.texto).join('')).toBe('Por ruta principal, Validar consume Pedido.');
});


test('T-191 tokens derivados conservan valor completo identidad de hechos entradas y evicción',()=>{
 const O={texto:'Pedido',marca:'objeto' as const,ref:{tipo:'cosa' as const,id:'o'},hecho:'e'},P={texto:'Validar',marca:'proceso' as const,ref:{tipo:'cosa' as const,id:'p'},hecho:'e'},h={O,P},before=JSON.stringify(h);
 const a=tabla.tokensPlantilla('T1',h),snapshot=JSON.stringify(a);
 const otro=tabla.tokensPlantilla('T1',{O:{...O,ref:{tipo:'cosa',id:'otro'},hecho:'otro-enlace'},P});
 expect(otro.map(t=>t.texto)).toEqual(a.map(t=>t.texto));expect(otro.filter(t=>t.ref).map(t=>t.ref!.id)).toEqual(['p','otro']);expect(otro.filter(t=>t.hecho).map(t=>t.hecho)).toEqual(['e','otro-enlace']);
 O.texto='Cuenta';expect(tabla.tokensPlantilla('T1',h).map(t=>t.texto).join('')).toBe('Validar consume Cuenta.');O.texto='Pedido';
 expect(JSON.stringify(h)).toBe(before);expect(JSON.stringify(a)).toBe(snapshot);expect(Object.isFrozen(O)).toBe(false);expect(Object.isFrozen(O.ref)).toBe(false);
 const externos=[{texto:'Alfa',rol:'nombre' as const,marca:'proceso' as const,ref:{tipo:'cosa' as const,id:'alfa'}}],cx={P,SEC:{texto:'',tokens:externos}};
 expect(tabla.tokensPlantilla('CXM',cx).some(t=>t.ref?.id==='alfa')).toBe(true);expect(Object.isFrozen(externos)).toBe(false);expect(Object.isFrozen(externos[0])).toBe(false);expect(Object.isFrozen(externos[0]!.ref)).toBe(false);
 externos[0]!.texto='Beta';expect(tabla.tokensPlantilla('CXM',cx).some(t=>t.texto==='Beta')).toBe(true);
 for(let i=0;i<2100;i++)expect(tabla.tokensPlantilla('D1',{C:{texto:'Objeto_'+i,marca:'objeto'}}).map(t=>t.texto).join('')).toBe('Objeto_'+i+' es físico.');
 expect(tabla.tokensPlantilla('T1',h)).toEqual(a);expect(JSON.stringify(a)).toBe(snapshot);
 for(let i=0;i<2;i++)expect(()=>tabla.tokensPlantilla('NO-EXISTE',h)).toThrow('Plantilla desconocida: NO-EXISTE');
});

test('T-191 token externo congelado conserva ref externa mutable sin contaminar salidas',()=>{
 const ref={tipo:'cosa' as const,id:'a'},token=Object.freeze({texto:'Alfa',rol:'nombre' as const,marca:'proceso' as const,ref}),h={P:{texto:'Gestionar',marca:'proceso' as const},SEC:{texto:'',tokens:[token]}};
 const a=tabla.tokensPlantilla('CXM',h),snapshot=JSON.stringify(a);expect(Object.isFrozen(ref)).toBe(false);ref.id='b';const b=tabla.tokensPlantilla('CXM',h);expect(b.find(t=>t.texto==='Alfa')!.ref!.id).toBe('b');expect(a.find(t=>t.texto==='Alfa')!.ref!.id).toBe('a');expect(JSON.stringify(a)).toBe(snapshot);
 const circular:tabla.Huecos={};(circular as Record<string,unknown>).extra=circular;expect(()=>tabla.tokensPlantilla('NO-EXISTE',circular)).toThrow('Plantilla desconocida: NO-EXISTE');
});

test('T-127 colación de contexto conserva Unicode, equivalencias y desempate por ID anterior', () => {
    const nombres = ['Árbol', 'Arbol', 'A\u0301rbol', 'Índice', 'indice', 'I\u0301ndice', 'Ñandú', 'Nandu', 'Órbita', 'Operar 2', 'Operar 10', '', ' '] as const;
    for (const a of nombres) for (const b of nombres) {
        const m: import('../nucleo/tipos').Modelo = { id: 'm-orden', nombre: 'Orden', raiz: 'sd', unidadTiempo: 'min', secuencia: 10,
            cosas: { p: {id:'p', tipo:'proceso', nombre:'Procesar', esencia:'informacional', afiliacion:'sistemica'},
                'p-2': {id:'p-2', tipo:'proceso', nombre:a, esencia:'informacional', afiliacion:'sistemica'},
                'p-10': {id:'p-10', tipo:'proceso', nombre:b, esencia:'informacional', afiliacion:'sistemica'} }, enlaces:{}, abanicos:{},
            opds:{sd:{id:'sd', tipo:'raiz', apariciones:{}}, h:{id:'h', tipo:'descomposicion', padre:'sd', cosa:'p', orden:0, bandas:[['p-2','p-10']], objetosInternos:[], apariciones:{}}} };
        const antes = JSON.stringify(m), h = tabla.datosContexto(m, 'h')!;
        // Expresión previa independiente: el nuevo comparador debe ser extensionalmente idéntico.
        const esperado = ['p-2','p-10'].sort((x,y) => m.cosas[x]!.nombre.localeCompare(m.cosas[y]!.nombre, 'es', {sensitivity:'base'}) || x.localeCompare(y));
        expect(h.plantilla).toBe('CX2'); expect((h.huecos.Plista as tabla.Hueco[]).map(x=>x.ref!.id)).toEqual(esperado);
        expect(JSON.stringify(m)).toBe(antes);
    }
});

test('T-127 colación local nunca altera bandas, entradas ni conjunción observable', () => {
    const m: import('../nucleo/tipos').Modelo = {id:'m-bandas', nombre:'Bandas', raiz:'sd', unidadTiempo:'min', secuencia:10,
        cosas:Object.fromEntries([['p','Procesar'],['a','Índice'],['b','Arbol'],['c','Árbol'],['d','Isla']].map(([id,nombre]) => [id!,{id:id!,tipo:'proceso' as const,nombre:nombre!,esencia:'informacional' as const,afiliacion:'sistemica' as const}])), enlaces:{}, abanicos:{},
        opds:{sd:{id:'sd',tipo:'raiz',apariciones:{}},h:{id:'h',tipo:'descomposicion',cosa:'p',padre:'sd',orden:0,bandas:[['c','b'],['d','a']],objetosInternos:[],apariciones:{}}}};
    const antes=JSON.stringify(m), h=tabla.datosContexto(m,'h')!;
    expect(h.plantilla).toBe('CXM'); expect(tabla.PLANTILLAS.find(p=>p.id==='CXM')!.hacia(h.huecos)).toEqual([{k:'descomposicion', proceso:'Procesar', bandas:[['Arbol','Árbol'],['Índice','Isla']], internos:[]}]);
    expect(tabla.tokensPlantilla(h.plantilla,h.huecos).map(t=>t.texto).join('')).toBe('Procesar se descompone en paralelo Arbol y Árbol, y paralelo Índice e Isla, en esa secuencia.');
    expect(JSON.stringify(m)).toBe(antes);
});
