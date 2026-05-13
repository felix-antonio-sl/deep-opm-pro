import type { Enlace, Id, Modelo, ValorConcreto } from "../tipos";
import { validarValorSlot } from "../validadores/valorSlot";
import { muestrearValorEntidad, type RngSimulacion } from "./parametros";
import type { CambioValorRuntime, PasoSimulacion } from "./tipos";

/**
 * Estado inicial de valores runtime: copia `entidad.valorSlot.valor` de cada
 * atributo y, si `entidad.simulacion.simulable` está activo, muestrea un valor
 * OPCloud-like para el runtime. Los valores runtime viven separados del modelo:
 * la simulación NO muta `entidad.valorSlot.valor`.
 */
export function iniciarValoresRuntime(modelo: Modelo, rng: RngSimulacion = Math.random): Record<Id, ValorConcreto> {
  const valores: Record<Id, ValorConcreto> = {};
  for (const entidad of Object.values(modelo.entidades)) {
    if (entidad.valorSlot?.valor !== undefined) {
      valores[entidad.id] = entidad.valorSlot.valor;
    }
    if (entidad.esAtributo && entidad.valorSlot && entidad.simulacion?.simulable) {
      const muestreado = muestrearValorEntidad(entidad, rng);
      if (muestreado.ok && muestreado.value !== undefined) {
        valores[entidad.id] = muestreado.value;
      } else {
        delete valores[entidad.id];
      }
    }
  }
  return valores;
}

/**
 * Aplica cambios de valor para un paso de simulación. Beta2-min implementa
 * **asignación atributo→atributo** (no fórmulas, no operaciones aritméticas):
 * cuando un proceso tiene un enlace consumo desde un atributo A y un enlace
 * resultado a un atributo B (ambos con `valorSlot`), el valor runtime de A
 * se copia a B si los tipos son compatibles.
 *
 * Si:
 *   - A no tiene valor runtime: diagnóstico "atributo sin valor".
 *   - Los tipos de slot difieren: diagnóstico "tipos incompatibles".
 *   - `validarValorSlot` rechaza el valor para el tipo destino: diagnóstico
 *     con la razón devuelta por el validador.
 *
 * En cualquier diagnóstico, ese par específico NO aplica cambio pero los
 * demás pares siguen procesándose. El contexto no se bloquea: el diagnóstico
 * queda en el trace para el operador.
 */
export function aplicarCambiosValor(
  modelo: Modelo,
  valoresActuales: Record<Id, ValorConcreto>,
  paso: PasoSimulacion,
): { valoresNuevos: Record<Id, ValorConcreto>; cambios: CambioValorRuntime[]; motivos: string[] } {
  const valoresNuevos = { ...valoresActuales };
  const cambios: CambioValorRuntime[] = [];
  const motivos: string[] = [];

  const entradasAtributo = paso.enlacesEntradaIds
    .map((id) => modelo.enlaces[id])
    .filter((e): e is Enlace => Boolean(e))
    .filter((e) => e.tipo === "consumo" || e.tipo === "efecto" || e.tipo === "instrumento")
    .filter((e) => e.origenId.kind === "entidad" && esAtributoEntidad(modelo, e.origenId.id));

  const salidasAtributo = paso.enlacesSalidaIds
    .map((id) => modelo.enlaces[id])
    .filter((e): e is Enlace => Boolean(e))
    .filter((e) => e.tipo === "resultado" || e.tipo === "efecto")
    .filter((e) => e.destinoId.kind === "entidad" && esAtributoEntidad(modelo, e.destinoId.id));

  const yaProducidos = new Set<Id>();

  for (const entrada of entradasAtributo) {
    const atrEntradaId = entrada.origenId.id;
    const valor = valoresActuales[atrEntradaId];
    const entidadEntrada = modelo.entidades[atrEntradaId];
    if (!entidadEntrada?.valorSlot) continue;

    for (const salida of salidasAtributo) {
      const atrSalidaId = salida.destinoId.id;
      if (yaProducidos.has(atrSalidaId)) continue;
      const entidadSalida = modelo.entidades[atrSalidaId];
      if (!entidadSalida?.valorSlot) continue;

      if (valor === undefined) {
        motivos.push(`${entidadEntrada.nombre} sin valor runtime`);
        continue;
      }
      if (entidadEntrada.valorSlot.tipo !== entidadSalida.valorSlot.tipo) {
        motivos.push(
          `Tipos incompatibles: ${entidadEntrada.nombre} (${entidadEntrada.valorSlot.tipo}) → ${entidadSalida.nombre} (${entidadSalida.valorSlot.tipo})`,
        );
        continue;
      }
      const validado = validarValorSlot(entidadSalida.valorSlot.tipo, valor);
      if (!validado.ok) {
        motivos.push(`${entidadSalida.nombre}: ${validado.error}`);
        continue;
      }
      const antes = valoresActuales[atrSalidaId];
      valoresNuevos[atrSalidaId] = validado.value;
      cambios.push({ entidadId: atrSalidaId, antes, despues: validado.value });
      yaProducidos.add(atrSalidaId);
    }
  }

  return { valoresNuevos, cambios, motivos };
}

function esAtributoEntidad(modelo: Modelo, entidadId: Id): boolean {
  const entidad = modelo.entidades[entidadId];
  return Boolean(entidad?.esAtributo && entidad.valorSlot);
}
