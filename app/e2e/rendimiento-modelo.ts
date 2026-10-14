import {modeloCon} from '../src/pruebas/constructores';
import {validarForma} from '../src/nucleo/forma';
import {erroresContexto} from '../src/nucleo/matriz';
import {exportarV0} from '../src/codec/exportar';
import type {Modelo} from '../src/nucleo/tipos';

/** Carga sintética válida: todas las cosas y enlaces están en un solo OPD. */
export function modeloGrande(n:number):Modelo {
 if(n<20||n%2)throw Error('Número par de cosas ≥20');
 const q=n/2,nombre=(tipo:string,i:number)=>`${tipo}_${String(i+1).padStart(3,'0')}`;
 const m=modeloCon({objetos:Array.from({length:q},(_,i)=>[nombre('Dato',i),['pendiente']] as const),procesos:Array.from({length:q},(_,i)=>nombre('Procesar',i)),enlaces:Array.from({length:q},(_,i)=>[
  ['consumo',nombre('Dato',i),nombre('Procesar',i)] as const,
  ['resultado',nombre('Dato',(i+1)%q),nombre('Procesar',i)] as const,
  ['agente',nombre('Dato',(i+7)%q),nombre('Procesar',i)] as const,
 ]).flat()});
 const columnas=n===100?8:12,apariciones={...m.opds[m.raiz]!.apariciones};
 for(const [i,c] of Object.values(m.cosas).entries()){
  const j=i%q,x=(j%columnas)*430+(c.tipo==='proceso'?210:0),y=Math.floor(j/columnas)*160;
  apariciones[c.id]={x,y,ancho:135,alto:c.tipo==='objeto'?90:60};
 }
 const resultado={...m,id:`perf-opforja-${n}-20261014`,nombre:`Rendimiento OpForja ${n} entidades`,opds:{...m.opds,[m.raiz]:{...m.opds[m.raiz]!,apariciones}}};
 const errores=[...validarForma(resultado),...erroresContexto(resultado)];if(errores.length)throw Error(JSON.stringify(errores.slice(0,3)));
 return resultado;
}
if(import.meta.main){const dir=Bun.argv[2]!;for(const n of [100,300,600]){const m=modeloGrande(n);await Bun.write(`${dir}/modelo-${n}.json`,exportarV0(m));console.log(JSON.stringify({n,estados:n/2,enlaces:Object.keys(m.enlaces).length,opds:1}));}}
