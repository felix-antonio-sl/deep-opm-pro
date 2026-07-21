import type {
  ClaseDeclaracionNoNuclear,
  DeclaracionNoNuclear,
  EstadoAsercionNoNuclear,
  EstadoEvaluacionNoNuclear,
  Id,
  Modelo,
  Resultado,
  TargetDeclaracionNoNuclear,
} from "../modelo/tipos";
import { esRecord, fallo, ok } from "./validarHelpers";

const CLASES = new Set<ClaseDeclaracionNoNuclear>(["rol", "restriccion", "exclusion", "frontera"]);
const ESTADOS_ASERCION = new Set<EstadoAsercionNoNuclear>(["ratificada", "hipotesis", "pendiente"]);
const ESTADOS_EVALUACION = new Set<EstadoEvaluacionNoNuclear>([
  "no-evaluada",
  "indeterminada",
  "satisfecha",
  "fallida",
]);

type Referencias = Pick<Modelo, "opds" | "entidades" | "estados" | "enlaces" | "abanicos">;

export function validarDeclaracionesNoNucleares(
  value: unknown,
  referencias: Referencias,
): Resultado<Record<Id, DeclaracionNoNuclear>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: declaracionesNoNucleares");
  const declaraciones: Record<Id, DeclaracionNoNuclear> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!id.trim() || !esRecord(raw) || raw.id !== id) {
      return fallo(`Declaración no nuclear inválida: ${id || "<id vacío>"}`);
    }
    if (!CLASES.has(raw.clase as ClaseDeclaracionNoNuclear)) {
      return fallo(`Declaración no nuclear inválida: ${id}.clase`);
    }
    if (typeof raw.afirmacion !== "string" || !raw.afirmacion.trim()) {
      return fallo(`Declaración no nuclear inválida: ${id}.afirmacion`);
    }
    if (typeof raw.propietarioSemantico !== "string" || !raw.propietarioSemantico.trim()) {
      return fallo(`Declaración no nuclear inválida: ${id}.propietarioSemantico`);
    }
    if (!Array.isArray(raw.procedencia) || raw.procedencia.some((item) => typeof item !== "string" || !item.trim())) {
      return fallo(`Declaración no nuclear inválida: ${id}.procedencia`);
    }
    if (!ESTADOS_ASERCION.has(raw.estadoAsercion as EstadoAsercionNoNuclear)) {
      return fallo(`Declaración no nuclear inválida: ${id}.estadoAsercion`);
    }
    if (raw.estadoEvaluacion !== undefined &&
      !ESTADOS_EVALUACION.has(raw.estadoEvaluacion as EstadoEvaluacionNoNuclear)) {
      return fallo(`Declaración no nuclear inválida: ${id}.estadoEvaluacion`);
    }
    if (!Array.isArray(raw.targets)) return fallo(`Declaración no nuclear inválida: ${id}.targets`);
    const targets: TargetDeclaracionNoNuclear[] = [];
    for (const [indice, targetRaw] of raw.targets.entries()) {
      const target = validarTarget(id, indice, targetRaw, referencias);
      if (!target.ok) return target;
      targets.push(target.value);
    }
    declaraciones[id] = {
      id,
      clase: raw.clase as ClaseDeclaracionNoNuclear,
      afirmacion: raw.afirmacion,
      targets,
      propietarioSemantico: raw.propietarioSemantico,
      procedencia: [...raw.procedencia] as string[],
      estadoAsercion: raw.estadoAsercion as EstadoAsercionNoNuclear,
      ...(raw.estadoEvaluacion !== undefined
        ? { estadoEvaluacion: raw.estadoEvaluacion as EstadoEvaluacionNoNuclear }
        : {}),
    };
  }
  return ok(declaraciones);
}

function validarTarget(
  declaracionId: Id,
  indice: number,
  value: unknown,
  referencias: Referencias,
): Resultado<TargetDeclaracionNoNuclear> {
  const ruta = `Declaración no nuclear inválida: ${declaracionId}.targets[${indice}]`;
  if (!esRecord(value) || typeof value.tipo !== "string") return fallo(ruta);
  if (value.tipo === "modelo") {
    if (value.id !== undefined) return fallo(`${ruta}.id`);
    return ok({ tipo: "modelo" });
  }
  if (typeof value.id !== "string" || !value.id) return fallo(`${ruta}.id`);
  const existe = value.tipo === "opd"
    ? Boolean(referencias.opds[value.id])
    : value.tipo === "entidad"
      ? Boolean(referencias.entidades[value.id])
      : value.tipo === "estado"
        ? Boolean(referencias.estados[value.id])
        : value.tipo === "enlace"
          ? Boolean(referencias.enlaces[value.id])
          : value.tipo === "abanico"
            ? Boolean(referencias.abanicos?.[value.id])
            : false;
  if (!existe) return fallo(`${ruta}.id`);
  return ok({ tipo: value.tipo as Exclude<TargetDeclaracionNoNuclear["tipo"], "modelo">, id: value.id });
}
