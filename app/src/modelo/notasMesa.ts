// Helpers de kernel para la extensión NotaMesa (W6.5-a). Puro: sin JointJS, sin
// DOM, sin Zustand. La nota es contenido META de la mesa (mismo estatuto que
// AnclaNormativa, V-204): NO emite OPL, NO cuenta como cosa, NO altera
// validarModelo nuclear. Insumo de re-elicitación: viaja en el contexto W6.0 y
// se resuelve corrigiendo el proto.
import { siguienteId } from "./operaciones/helpers";
import type { Id, Modelo, NotaMesa, Resultado, TargetAncla } from "./tipos";

function fallo<T>(error: string): Resultado<T> {
  return { ok: false, error };
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

/** Valida que el target exista en el modelo (los `modelo`-level no exigen id). */
function targetValido(modelo: Modelo, target: TargetAncla): boolean {
  switch (target.tipo) {
    case "modelo": return true;
    case "entidad": return Boolean(modelo.entidades[target.id]);
    case "enlace": return Boolean(modelo.enlaces[target.id]);
    case "opd": return Boolean(modelo.opds[target.id]);
  }
}

/** Agrega una nota de mesa. Rechaza ruidoso texto vacío o target inexistente. */
export function agregarNotaMesa(
  modelo: Modelo,
  target: TargetAncla,
  texto: string,
  fecha: string,
): Resultado<Modelo> {
  const textoLimpio = texto.trim();
  if (!textoLimpio) return fallo("Nota de mesa vacía");
  if (!targetValido(modelo, target)) {
    return fallo(`Nota de mesa: target inexistente (${target.tipo}${target.tipo === "modelo" ? "" : `: ${target.id}`})`);
  }
  const id = siguienteId(modelo, "nm");
  const nota: NotaMesa = { id, target, texto: textoLimpio, fecha };
  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 1,
    notasMesa: { ...(modelo.notasMesa ?? {}), [id]: nota },
  });
}

/** Edita el texto de una nota existente (preserva id/target/fecha). */
export function editarNotaMesa(modelo: Modelo, notaId: Id, texto: string): Resultado<Modelo> {
  const nota = modelo.notasMesa?.[notaId];
  if (!nota) return fallo(`Nota de mesa no existe: ${notaId}`);
  const textoLimpio = texto.trim();
  if (!textoLimpio) return fallo("Nota de mesa vacía");
  return ok({
    ...modelo,
    notasMesa: { ...modelo.notasMesa, [notaId]: { ...nota, texto: textoLimpio } },
  });
}

/** Elimina una nota (resuelta = desechable; jamás se fosiliza como definición). */
export function eliminarNotaMesa(modelo: Modelo, notaId: Id): Resultado<Modelo> {
  if (!modelo.notasMesa?.[notaId]) return fallo(`Nota de mesa no existe: ${notaId}`);
  const { [notaId]: _eliminada, ...resto } = modelo.notasMesa;
  return ok({ ...modelo, notasMesa: resto });
}

/** Enumera todas las notas con orden estable por `id` (determinista). */
export function enumerarNotasMesa(modelo: Modelo): NotaMesa[] {
  const notas = modelo.notasMesa;
  if (!notas) return [];
  return Object.values(notas).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** Filtra las notas adjuntas a un target dado. */
export function notasDeTarget(modelo: Modelo, target: TargetAncla): NotaMesa[] {
  return enumerarNotasMesa(modelo).filter((nota) =>
    nota.target.tipo === target.tipo
    && (target.tipo === "modelo" || (nota.target.tipo !== "modelo" && nota.target.id === target.id)),
  );
}
