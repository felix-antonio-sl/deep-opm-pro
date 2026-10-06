import {test,expect} from 'bun:test';
import {azar} from '../pruebas/azar';
import {validarForma} from '../nucleo/forma';
import {generarModelo} from './generar';
import {PLANTILLAS} from './plantillas';
import {generarDocumentoOpl,importarOpl} from './documento';
import {planificar} from './planificar';
for(const perfil of ['estricto','completo'] as const) for(let semilla=0;semilla<200;semilla++) test(`T-191 T-192 azar histórico ${perfil} semilla ${semilla}`,()=>{
 const m=azar(semilla,perfil),before=JSON.stringify(m),t=generarDocumentoOpl(m),p=planificar(m,'modelo',t);
 expect(validarForma(m)).toEqual([]);expect(generarModelo(m).every(l=>l.soloDisplay||PLANTILLAS.some(p=>p.id===l.plantilla))).toBe(true);
 expect(p.acciones).toEqual([]);expect(p.lineas.flatMap(l=>l.diagnosticos.filter(d=>d.severidad==='error'))).toEqual([]);expect(JSON.stringify(m)).toBe(before);
 if(perfil==='estricto'){const r=importarOpl(m.nombre,t);expect(r.ok).toBe(true);if(r.ok){expect(r.valor.plan.resumen.noAplicables).toBe(0);expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);}}
});
