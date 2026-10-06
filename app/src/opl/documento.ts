import { generarModelo, textoCanonico } from './generar';
import type { Modelo } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import { planificar } from './planificar';
import type { Plan } from './planificar';
import { aplicarPlan } from './aplicar';
import { crearModelo } from '../nucleo/modelo';
export function generarDocumentoOpl(m: Modelo): string { return `# ${m.nombre}\n\n${textoCanonico(generarModelo(m))}`; }
export function importarOpl(nombre: string, texto: string): Respuesta<{
    modelo: Modelo;
    plan: Plan;
}> {
    const base = crearModelo({ id: 'modelo-opl', nombre }), plan = planificar(base, 'modelo', texto);
    const r = aplicarPlan(base, plan);
    return r.ok ? { ok: true, valor: { modelo: r.valor.modelo, plan }, trazas: r.trazas } : r;
}
