import {expect,test} from 'bun:test';
import {generarDocumentoOpl,importarOpl} from './documento';
import {modeloCon} from '../pruebas/constructores';
test('T-100 documento canónico con nombre y cabecera contextual de raíz',()=>{
 const base=modeloCon({objetos:[['Pedido',[]]],procesos:['Procesar']});
 const m={...base,cosas:Object.fromEntries(Object.entries(base.cosas).map(([id,c])=>[id,{...c,esencia:'informacional' as const}]))};
 expect(generarDocumentoOpl(m)).toBe(`# ${m.nombre}\n\n## SD\n*Procesar* es informacional.\n**Pedido** es informacional.`);
});
test('T-282 importación OPL permanece pendiente de su propietaria WP-9',()=>{expect(()=>importarOpl('Prueba','')).toThrow('pendiente:');});
