import type {
  ConfiguracionSimulacionEntidad,
  ConfiguracionSimulacionNumerica,
  ConfiguracionSimulacionTextual,
  DistribucionSimulacion,
  Entidad,
  FilaTextualSimulacion,
  Modelo,
  ParametrosSimulacionEntidad,
  Resultado,
  TipoValorSlot,
  ValorConcreto,
} from "../tipos";
import { validarValorSlot } from "../validadores/valorSlot";
import { rngSembrado } from "./rng";

/**
 * Parametros y muestreo de simulacion computacional.
 *
 * Referencia operacional OPCloud:
 * - opm-extracted/src/app/models/LogicalPart/components/SimulationModule.ts
 * - opm-extracted/src/app/dialogs/Simulation/Simulation.ts
 * - opm-extracted/src/app/dialogs/simulationElement/SimulationElement.ts
 *
 * Adaptacion deep-opm-pro: OPCloud marca objetos computacionales; aqui el
 * equivalente editable y serializable son atributos OPM con `valorSlot`.
 */

const MAX_TRIES = 100000;
const DISTRIBUCIONES: readonly DistribucionSimulacion[] = [
  "uniform",
  "normal",
  "bernoulli",
  "geometric",
  "poisson",
  "exponential",
  "binomial",
];

export type RngSimulacion = () => number;

export function parametrosSimulacionPorDefecto(entidad: Entidad): ParametrosSimulacionEntidad {
  const tipo = entidad.valorSlot?.tipo ?? "string";
  const valor = entidad.valorSlot?.valor;
  if (tipo === "integer" || tipo === "float") {
    const numero = numeroFinito(valor);
    const baseMin = numero ?? 0;
    const baseMax = numero ?? (tipo === "integer" ? 10 : 1);
    return {
      simulable: true,
      configuracion: {
        modo: "numerica",
        distribucion: "uniform",
        entero: tipo === "integer",
        uniformMin: baseMin,
        uniformMax: baseMax,
      },
    };
  }
  const texto = tipo === "char"
    ? textoCharPorDefecto(valor)
    : (textoNoVacio(valor) ?? entidad.nombre.trim()) || "valor";
  return {
    simulable: true,
    configuracion: {
      modo: "textual",
      valores: [{ texto, porcentaje: 100 }],
    },
  };
}

export function normalizarParametrosSimulacion(
  value: unknown,
  tipoSlot: TipoValorSlot,
): Resultado<ParametrosSimulacionEntidad> {
  if (!esRecord(value)) return fallo("Parámetros de simulación inválidos");
  if (typeof value.simulable !== "boolean") return fallo("Parámetros de simulación inválidos: simulable");
  if (!value.simulable) return ok({ simulable: false });
  const configuracion = normalizarConfiguracion(value.configuracion, tipoSlot);
  if (!configuracion.ok) return configuracion;
  return ok({ simulable: true, configuracion: configuracion.value });
}

export function muestrearValorEntidad(
  entidad: Entidad,
  rng: RngSimulacion = Math.random,
): Resultado<ValorConcreto | undefined> {
  const slot = entidad.valorSlot;
  const params = entidad.simulacion;
  if (!slot || !params?.simulable) return ok(undefined);
  const normalizados = normalizarParametrosSimulacion(params, slot.tipo);
  if (!normalizados.ok) return normalizados;
  const config = normalizados.value.configuracion;
  if (!config) return fallo("La simulación no tiene configuración");
  const valor = config.modo === "textual"
    ? muestrearTextual(config, slot.tipo, rng)
    : muestrearNumerico(config, slot.tipo, rng);
  if (!valor.ok || valor.value === undefined) return valor;
  const validado = validarValorSlot(slot.tipo, valor.value);
  return validado.ok ? ok(validado.value) : validado;
}

export function generarDatosSimulados(
  modelo: Modelo,
  numeroEjecuciones: number,
  rng: RngSimulacion | number = Math.random,
): Array<Record<string, ValorConcreto | undefined>> {
  const random = typeof rng === "number" ? rngSembrado(rng) : rng;
  const atributos = Object.values(modelo.entidades)
    .filter((entidad) => entidad.esAtributo && entidad.valorSlot && entidad.simulacion?.simulable);
  const total = Math.max(0, Math.floor(numeroEjecuciones));
  return Array.from({ length: total }, () => {
    const fila: Record<string, ValorConcreto | undefined> = {};
    for (const entidad of atributos) {
      const valor = muestrearValorEntidad(entidad, random);
      fila[entidad.nombre] = valor.ok ? valor.value : undefined;
    }
    return fila;
  });
}

function normalizarConfiguracion(
  value: unknown,
  tipoSlot: TipoValorSlot,
): Resultado<ConfiguracionSimulacionEntidad> {
  if (!esRecord(value)) return fallo("Parámetros de simulación inválidos: configuración");
  if (value.modo === "textual") return normalizarTextual(value, tipoSlot);
  if (value.modo === "numerica") return normalizarNumerica(value, tipoSlot);
  return fallo("Parámetros de simulación inválidos: modo");
}

function normalizarNumerica(
  value: Record<string, unknown>,
  tipoSlot: TipoValorSlot,
): Resultado<ConfiguracionSimulacionNumerica> {
  if (tipoSlot !== "integer" && tipoSlot !== "float") {
    return fallo("La simulación numérica requiere atributo integer o float");
  }
  if (!esDistribucion(value.distribucion)) return fallo("Distribución de simulación inválida");
  const config: ConfiguracionSimulacionNumerica = {
    modo: "numerica",
    distribucion: value.distribucion,
  };
  if (typeof value.entero === "boolean") config.entero = value.entero;
  for (const campo of ["rangoMin", "rangoMax", "uniformMin", "uniformMax", "normalMu", "normalSigma", "probabilidad", "binomialN", "binomialP", "lambda"] as const) {
    const numero = numeroOpcional(value[campo]);
    if (numero === null) return fallo(`Parámetro numérico inválido: ${campo}`);
    if (numero !== undefined) config[campo] = numero;
  }
  if (config.rangoMin !== undefined && config.rangoMax !== undefined && config.rangoMin > config.rangoMax) {
    return fallo("Rango de simulación inválido");
  }
  if (config.uniformMin !== undefined && config.uniformMax !== undefined && config.uniformMin > config.uniformMax) {
    return fallo("Rango uniforme inválido");
  }
  const p = config.probabilidad;
  if ((config.distribucion === "bernoulli" || config.distribucion === "geometric") && (p === undefined || p <= 0 || p > 1)) {
    return fallo("La distribución requiere probabilidad en (0, 1]");
  }
  if (config.distribucion === "binomial") {
    if (config.binomialN === undefined || !Number.isInteger(config.binomialN) || config.binomialN < 0) {
      return fallo("La distribución binomial requiere n entero >= 0");
    }
    if (config.binomialP === undefined || config.binomialP < 0 || config.binomialP > 1) {
      return fallo("La distribución binomial requiere p en [0, 1]");
    }
  }
  if ((config.distribucion === "exponential" || config.distribucion === "poisson") && (config.lambda === undefined || config.lambda <= 0)) {
    return fallo("La distribución requiere lambda > 0");
  }
  if (config.distribucion === "normal" && (config.normalSigma === undefined || config.normalSigma <= 0)) {
    return fallo("La distribución normal requiere sigma > 0");
  }
  return ok(config);
}

function normalizarTextual(
  value: Record<string, unknown>,
  tipoSlot: TipoValorSlot,
): Resultado<ConfiguracionSimulacionTextual> {
  if (!Array.isArray(value.valores)) return fallo("La simulación textual requiere valores");
  const valores: FilaTextualSimulacion[] = [];
  for (const item of value.valores) {
    if (!esRecord(item) || typeof item.texto !== "string" || typeof item.porcentaje !== "number") {
      return fallo("Valor textual de simulación inválido");
    }
    const texto = item.texto.trim();
    if (!texto || !Number.isFinite(item.porcentaje) || item.porcentaje < 0) {
      return fallo("Valor textual de simulación inválido");
    }
    const validado = validarValorSlot(tipoSlot, texto);
    if (!validado.ok) return validado;
    valores.push({ texto: String(validado.value), porcentaje: item.porcentaje });
  }
  if (valores.length === 0) return fallo("La simulación textual requiere al menos un valor");
  const total = valores.reduce((sum, item) => sum + item.porcentaje, 0);
  if (Math.abs(total - 100) > 1e-9) return fallo("La suma de porcentajes debe ser 100");
  return ok({ modo: "textual", valores });
}

function muestrearNumerico(
  config: ConfiguracionSimulacionNumerica,
  tipoSlot: TipoValorSlot,
  rng: RngSimulacion,
): Resultado<ValorConcreto | undefined> {
  const min = config.rangoMin ?? -Infinity;
  const max = config.rangoMax ?? Infinity;
  const entero = tipoSlot === "integer" || config.entero === true;
  for (let intento = 0; intento < MAX_TRIES; intento += 1) {
    const valor = sampleNumerico(config, rng);
    if (valor === null) return fallo("Parámetros de distribución inválidos");
    const ajustado = entero ? Math.round(valor) : valor;
    if (ajustado >= min && ajustado <= max) return ok(ajustado);
  }
  return ok(undefined);
}

function muestrearTextual(
  config: ConfiguracionSimulacionTextual,
  tipoSlot: TipoValorSlot,
  rng: RngSimulacion,
): Resultado<ValorConcreto | undefined> {
  const rand = rng01(rng) * 100;
  let acumulado = 0;
  for (const item of config.valores) {
    acumulado += item.porcentaje;
    if (rand <= acumulado) {
      const validado = validarValorSlot(tipoSlot, item.texto);
      return validado.ok ? ok(validado.value) : validado;
    }
  }
  const ultimo = config.valores.at(-1);
  if (!ultimo) return ok(undefined);
  const validado = validarValorSlot(tipoSlot, ultimo.texto);
  return validado.ok ? ok(validado.value) : validado;
}

function sampleNumerico(config: ConfiguracionSimulacionNumerica, rng: RngSimulacion): number | null {
  if (config.distribucion === "uniform") {
    const min = config.uniformMin ?? 0;
    const max = config.uniformMax ?? 1;
    if (min > max) return null;
    return min + (max - min) * rng01(rng);
  }
  if (config.distribucion === "normal") {
    const mu = config.normalMu ?? 0;
    const sigma = config.normalSigma;
    if (sigma === undefined || sigma <= 0) return null;
    const u1 = rng01Abierto(rng);
    const u2 = rng01(rng);
    return mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  if (config.distribucion === "bernoulli") {
    const p = config.probabilidad;
    if (p === undefined || p < 0 || p > 1) return null;
    return rng01(rng) < p ? 1 : 0;
  }
  if (config.distribucion === "geometric") {
    const p = config.probabilidad;
    if (p === undefined || p <= 0 || p > 1) return null;
    return Math.ceil(Math.log(1 - rng01Abierto(rng)) / Math.log(1 - p));
  }
  if (config.distribucion === "binomial") {
    const n = config.binomialN;
    const p = config.binomialP;
    if (n === undefined || p === undefined || !Number.isInteger(n) || n < 0 || p < 0 || p > 1) return null;
    let exitos = 0;
    for (let i = 0; i < n; i += 1) if (rng01(rng) < p) exitos += 1;
    return exitos;
  }
  if (config.distribucion === "exponential") {
    const lambda = config.lambda;
    if (lambda === undefined || lambda <= 0) return null;
    return -Math.log(1 - rng01Abierto(rng)) / lambda;
  }
  const lambda = config.lambda;
  if (lambda === undefined || lambda <= 0) return null;
  const limite = Math.exp(-lambda);
  let k = 0;
  let producto = 1;
  do {
    k += 1;
    producto *= rng01Abierto(rng);
  } while (producto > limite);
  return k - 1;
}

function esDistribucion(value: unknown): value is DistribucionSimulacion {
  return typeof value === "string" && DISTRIBUCIONES.includes(value as DistribucionSimulacion);
}

function numeroOpcional(value: unknown): number | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function numeroFinito(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function textoNoVacio(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const texto = String(value).trim();
  return texto ? texto : null;
}

function textoCharPorDefecto(value: unknown): string {
  const texto = textoNoVacio(value);
  return texto?.length === 1 ? texto : "A";
}

function rng01(rng: RngSimulacion): number {
  const value = rng();
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1 - Number.EPSILON, value));
}

function rng01Abierto(rng: RngSimulacion): number {
  return Math.max(Number.EPSILON, rng01(rng));
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
