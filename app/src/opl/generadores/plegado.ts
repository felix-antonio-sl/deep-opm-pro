import { modoPlegadoApariencia, partesDePlegado, UMBRAL_PARTES_MAS } from "../../modelo/plegado";
import type { Apariencia, Entidad, Modelo } from "../../modelo/tipos";
import { listarOpl, nombreOpl } from "./refsHints";

/**
 * Generador de oraciones OPL para plegado parcial.
 * Cubre SSOT OPL-ES §10.5 e ISO 19450 §3.22/§668-§679.
 * Consumidores: `refinamiento.ts` y `opl/generar.ts`.
 */

export function oracionPlegadoParcial(modelo: Modelo, apariencia: Apariencia, entidad: Entidad): string | null {
  if (modoPlegadoApariencia(apariencia) !== "parcial") return null;
  const partes = partesDePlegado(modelo, entidad.id);
  if (partes.length === 0) return null;
  const visibles = partes.slice(0, UMBRAL_PARTES_MAS).map((parte) => {
    const interna = modelo.entidades[parte.entidadId];
    return interna ? nombreOpl(interna) : `**${parte.nombre}**`;
  });
  const restantes = partes.length - visibles.length;
  const destino = restantes > 0
    ? `${listarOpl(visibles)} y ${restantes} ${restantes === 1 ? "parte más" : "partes más"}`
    : listarOpl(visibles);
  return `${nombreOpl(entidad)} se lista con ${destino} como rasgos.`;
}
