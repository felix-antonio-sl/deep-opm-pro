import { generarModelo, textoCanonico } from './generar';
import type { Modelo } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import { planificarImportacion } from './planificar';
import type { Plan } from './planificar';
export function generarDocumentoOpl(m: Modelo): string { return `# ${m.nombre}\n\n${textoCanonico(generarModelo(m))}`; }
export function importarOpl(nombre: string, texto: string): Respuesta<{
    modelo: Modelo;
    plan: Plan;
}> {
    const r = planificarImportacion(nombre, texto);
    return { ok: true, valor: { modelo: r.hecho.modelo, plan: r.plan }, trazas: r.trazas };
}
