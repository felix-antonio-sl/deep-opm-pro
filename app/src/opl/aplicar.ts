import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
import type { Plan } from './planificar';
export function aplicarPlan(m: Modelo, plan: Plan): Respuesta<Hecho> { throw new Error('pendiente: WP-13'); }
