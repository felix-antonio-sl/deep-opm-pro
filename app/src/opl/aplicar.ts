import type { Modelo } from '../nucleo/tipos';
import type { Respuesta, Hecho } from '../nucleo/resultado';
import { aplicarAcciones } from '../nucleo/operaciones';
import type { Plan } from './planificar';
export function aplicarPlan(m: Modelo, plan: Plan): Respuesta<Hecho> {
    if (m !== plan.base) return { ok: false, rechazo: { codigo: 'referencia-ambigua', regla: 'T-173', mensaje: 'El modelo cambió: vuelve a planificar.', refs: [] } };
    return aplicarAcciones(m, plan.acciones);
}
