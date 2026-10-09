import { expect,test } from 'bun:test';
import { VOCABULARIO } from './vocabulario';
import { PLANTILLAS, tokensPlantilla, unidad } from './plantillas';
import { textoDeTokens } from './linea';
// Inventario manual cerrado de §5.3: literales de filas y expansiones finitas de huecos.
// Los nombres, rutas, etiquetas, valores y números del usuario quedan fuera.
const palabras = `a afecta afectado al ambiental así cambia caso cero como con consta consume contrario cualquier current cuyo de declarado defecto descompone desde despliega día días dos duración e el en entonces es esa especialización estado estados estar está exactamente excede exhibe existe final física físico genera hora horas informacional inicia inicial instancia instancias invoca lo maneja manejado menor menos mes meses milisegundo milisegundos minuto minutos mismo más máxima mínima objeto ocurre omite opcional otra otro otros paralelo parte persistente por proceso puede que rasgo relaciona relacionan requiere ruta se secuencia segundo segundos semana semanas si sistémica sistémico son su sí transitoria u un una uno y año años o`;
test('T-104 T-005 T-300 vocabulario es unión cerrada de literales de las plantillas G y P y sus macros finitos',()=>{
 expect(PLANTILLAS).toHaveLength(116); expect(VOCABULARIO).toHaveLength(109);
 expect(new Set(VOCABULARIO)).toEqual(new Set(palabras.split(' ')));
 expect(VOCABULARIO).not.toContain('consumen');
 for(const nombre of ['Pedido','Procesar','pendiente','urgente','centurias'])expect(VOCABULARIO).not.toContain(nombre.toLowerCase());
});
test('T-104 T-005 expansiones fijas Q Ly Lo multiplicidad y unidades es-CL pertenecen al vocabulario cerrado',()=>{
 for(const palabra of ['exactamente','uno','al','menos','de','y','e','o','u','un','una','opcional','cero','más','dos'])expect(VOCABULARIO).toContain(palabra);
 const o={texto:'Pedido',marca:'objeto' as const},p={texto:'Procesar',marca:'proceso' as const};
 for(const [op,texto] of [['XOR','exactamente uno de'],['OR','al menos uno de']] as const){
  expect(textoDeTokens(tokensPlantilla('FAN5s',{O:o,P:p,s:[{texto:'pagado',marca:'estado'}],operador:{texto:op}}))).toContain(texto);
  expect(textoDeTokens(tokensPlantilla('CFE',{O:o,Plista:[p],operador:{texto:op}}))).toStartWith(texto[0]!.toUpperCase()+texto.slice(1));
 }
 for(const [n,esperado] of [['Isla',' e '],['Cuenta',' y ']] as const)expect(textoDeTokens(tokensPlantilla('RF2',{vertice:o,C:[o,{texto:n,marca:'objeto'}]}))).toContain(esperado);
 for(const [n,esperado] of [['oculto',' u '],['pagado',' o ']] as const)expect(textoDeTokens(tokensPlantilla('D5',{O:o,s:[{texto:'pendiente',marca:'estado'},{texto:n,marca:'estado'}]}))).toContain(esperado);
 for(const [mult,frases] of [['?',['un opcional','una opcional']],['*',['opcional (cero o más)','opcional (cero o más)']],['+',['al menos un','al menos una']]] as const)
  for(const [i,genero] of [undefined,'f' as const].entries())expect(textoDeTokens(tokensPlantilla('T1',{P:p,mO:{...o,mult,...(genero?{genero}:{})}}))).toContain(frases[i]!);
 for(const [u,singular,plural] of [['ms','milisegundo','milisegundos'],['sec','segundo','segundos'],['min','minuto','minutos'],['hour','hora','horas'],['day','día','días'],['week','semana','semanas'],['month','mes','meses'],['year','año','años']] as const){
  expect(unidad(u,1)).toBe(singular);expect(unidad(u,2)).toBe(plural);expect(VOCABULARIO).toContain(singular);expect(VOCABULARIO).toContain(plural);
 }
});
