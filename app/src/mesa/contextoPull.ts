import { exportarContextoSkill } from "../opl/contextoSkill";
import { hidratarModelo } from "../serializacion/json";
import type { Especie } from "../persistencia/especie";

/**
 * Lógica pura (sin red, sin DOM) de `mesa pull`: elegir la base de trabajo
 * (autosave no consolidado vs. lo guardado) y componer el encabezado de la
 * mesa (Especie + Fuente) sobre el generador EXISTENTE `exportarContextoSkill`.
 * LEY DE DETERMINISMO DEL GENERADOR: el cuerpo del pull, quitando el
 * encabezado, es byte-igual a `exportarContextoSkill` para el mismo modelo —
 * un generador, dos consumidores (skill directa y puente mesa↔skill).
 */
export type FuenteEstado = { clase: "guardado"; rev: number } | { clase: "autosave"; creadoEn: string };

export function elegirBase(input: {
  guardadoActualizadoEn: string;
  guardadoJson: string;
  guardadoRev: number;
  autosave?: { creadoEn: string; json: string };
}): { json: string; fuente: FuenteEstado } {
  // El autosave gana SOLO si es estrictamente más nuevo que lo guardado — en
  // empate manda lo guardado (ya ratificado), no el no-consolidado.
  if (input.autosave && input.autosave.creadoEn > input.guardadoActualizadoEn) {
    return { json: input.autosave.json, fuente: { clase: "autosave", creadoEn: input.autosave.creadoEn } };
  }
  return { json: input.guardadoJson, fuente: { clase: "guardado", rev: input.guardadoRev } };
}

function lineaFuente(f: FuenteEstado): string {
  return f.clase === "guardado"
    ? `Fuente: guardado rev ${f.rev}`
    : `Fuente: autosave no consolidado (no ratificado) — ${f.creadoEn}`;
}

export function componerPull(input: {
  nombre: string;
  especie: Especie;
  base: { json: string; fuente: FuenteEstado };
  now?: Date;
}): string {
  const m = hidratarModelo(input.base.json);
  if (!m.ok) throw new Error(`base ilegible: ${m.error}`);
  const encabezado = [`<!-- mesa pull · ${input.nombre} -->`, `Especie: ${input.especie}`, lineaFuente(input.base.fuente), ""].join(
    "\n",
  );
  return encabezado + exportarContextoSkill(m.value, input.now);
}
