// Kernel puro del asistente de nuevo modelo de 3 etapas.
//
// Ronda 23 L3 #6: poda 9→3. Las 6 etapas opcionales (atributo, handler,
// nombre, herramientas, entradas, salidas, ambientales) y la bienvenida
// fueron eliminadas. Su funcionalidad existe en el inspector tras crear
// el modelo. La etapa de confirmación se fusiona en `EtapaSembrar`.
//
// Las 3 etapas restantes son:
//   0. Función principal  (proceso central)
//   1. Beneficiario       (objeto físico que recibe valor)
//   2. Sembrar             (preview + confirmar)
//
// SSOT: metodologia-opm-es.md §6 — el inspector cubre el resto del SD.
// Layout: radial "sol" con proceso central, sectores por categoría,
// radio base = 260, espaciado angular mínimo 25°.

import {
  cambiarEsencia,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
} from "./operaciones";
import type { Id, Modelo, Posicion, Resultado } from "./tipos";

// ─── Tipos ───────────────────────────────────────────────────────────

/** Etapa del asistente: 0 (función), 1 (beneficiario), 2 (sembrar). */
export type EtapaAsistente = 0 | 1 | 2;

/** Datos capturados por las 3 etapas del asistente. */
export interface DatosAsistente {
  funcionPrincipal: string;
  beneficiario: string;
}

/** Parámetros de layout radial. Expuestos para testear determinismo. */
export interface ParametrosLayoutRadial {
  centro: Posicion;
  radioInterior: number;
  radioExterior: number;
  espaciadoMinimo: number;
}

export const LAYOUT_DEFAULT: ParametrosLayoutRadial = {
  centro: { x: 600, y: 400 },
  radioInterior: 260,
  radioExterior: 400,
  espaciadoMinimo: 25,
};

/** Valor inicial de datos del asistente. */
export function datosAsistenteVacio(): DatosAsistente {
  return {
    funcionPrincipal: "",
    beneficiario: "",
  };
}

export const TOTAL_ETAPAS = 3;
export const ETAPA_FUNCION = 0 satisfies EtapaAsistente;
export const ETAPA_BENEFICIARIO = 1 satisfies EtapaAsistente;
export const ETAPA_SEMBRAR = 2 satisfies EtapaAsistente;

/** Nombre por defecto del sistema cuando el operador no lo personaliza. */
export const NOMBRE_SISTEMA_DEFAULT = "Mi sistema";

// ─── Validación ──────────────────────────────────────────────────────

export interface ResultadoValidacion {
  ok: true;
}

export interface ErrorValidacion {
  ok: false;
  error: string;
}

export function validarDatosAsistente(
  datos: Partial<DatosAsistente>,
  etapa: EtapaAsistente,
): ResultadoValidacion | ErrorValidacion {
  switch (etapa) {
    case ETAPA_FUNCION: {
      const val = (datos.funcionPrincipal ?? "").trim();
      if (val.length === 0) return { ok: false, error: "La función principal del sistema es obligatoria" };
      if (val.length > 120) return { ok: false, error: "El nombre de la función principal es muy largo (máx 120 caracteres)" };
      return { ok: true };
    }
    case ETAPA_BENEFICIARIO: {
      const val = (datos.beneficiario ?? "").trim();
      if (val.length === 0) return { ok: false, error: "El beneficiario del sistema es obligatorio" };
      if (val.length > 80) return { ok: false, error: "El nombre del beneficiario es muy largo (máx 80 caracteres)" };
      return { ok: true };
    }
    case ETAPA_SEMBRAR: {
      const f = (datos.funcionPrincipal ?? "").trim();
      if (f.length === 0) return { ok: false, error: "Falta la función principal del sistema" };
      const b = (datos.beneficiario ?? "").trim();
      if (b.length === 0) return { ok: false, error: "Falta el beneficiario del sistema" };
      return { ok: true };
    }
    default:
      return { ok: true };
  }
}

// ─── Layout radial ───────────────────────────────────────────────────

function posicionEnAnillo(anguloGrados: number, radio: number, centro: Posicion): Posicion {
  const rad = (anguloGrados * Math.PI) / 180;
  return {
    x: Math.round(centro.x + radio * Math.cos(rad)),
    y: Math.round(centro.y - radio * Math.sin(rad)),
  };
}

export function calcularPosicionesRadiales(
  _datos: DatosAsistente,
  params: Partial<ParametrosLayoutRadial> = {},
): Map<string, Posicion> {
  const p = { ...LAYOUT_DEFAULT, ...params };
  const pos = new Map<string, Posicion>();

  pos.set("__proceso__", { ...p.centro });
  pos.set("__beneficiario__", posicionEnAnillo(0, p.radioInterior, p.centro));
  pos.set("__sistema__", posicionEnAnillo(270, p.radioInterior, p.centro));

  return pos;
}

// ─── Siembra ─────────────────────────────────────────────────────────

/**
 * Siembra el modelo SD mínimo a partir de los datos capturados por el wizard
 * de 3 etapas: un proceso central (función principal), un objeto físico
 * (beneficiario) con enlace agente al proceso, y un objeto sistema con
 * enlaces exhibición + instrumento al proceso. El resto del SD (herramientas,
 * entradas, salidas, ambientales, atributos, agentes adicionales) se modela
 * en el inspector tras la siembra.
 */
export function sembrarModeloDesdeAsistente(
  datos: DatosAsistente,
  layoutParams: Partial<ParametrosLayoutRadial> = {},
): Resultado<Modelo> {
  const validacion = validarDatosAsistente(datos, ETAPA_SEMBRAR);
  if (!validacion.ok) return { ok: false, error: validacion.error };

  const posiciones = calcularPosicionesRadiales(datos, layoutParams);

  const ctx: ContextoSiembra = {
    modelo: crearModelo(NOMBRE_SISTEMA_DEFAULT),
    nombresUsados: new Set<string>(),
  };
  const opdId = ctx.modelo.opdRaizId;

  const unico = (nombre: string): string => {
    const base = nombre.trim();
    const key = base.toLowerCase();
    if (!ctx.nombresUsados.has(key)) {
      ctx.nombresUsados.add(key);
      return base;
    }
    let sufijo = 2;
    while (ctx.nombresUsados.has(`${key} ${sufijo}`)) sufijo++;
    const u = `${base} ${sufijo}`;
    ctx.nombresUsados.add(u.toLowerCase());
    return u;
  };

  const crearObj = (pos: Posicion, nombre: string): Id => {
    const n = unico(nombre);
    ctx.modelo = must(crearObjeto(ctx.modelo, opdId, pos, n));
    return nuevaEntidadId(ctx.modelo);
  };

  const crearProc = (pos: Posicion, nombre: string): Id => {
    const n = unico(nombre);
    ctx.modelo = must(crearProceso(ctx.modelo, opdId, pos, n));
    return nuevaEntidadId(ctx.modelo);
  };

  const enlazar = (origen: Id, destino: Id, tipo: Parameters<typeof crearEnlace>[4]): void => {
    ctx.modelo = must(crearEnlace(ctx.modelo, opdId, origen, destino, tipo));
  };

  // 1. Proceso central
  const procesoId = crearProc(posiciones.get("__proceso__")!, datos.funcionPrincipal);

  // 2. Beneficiario (físico para enlace agente)
  const beneficiarioId = crearObj(posiciones.get("__beneficiario__")!, datos.beneficiario);
  ctx.modelo = must(cambiarEsencia(ctx.modelo, beneficiarioId, "fisica"));
  enlazar(beneficiarioId, procesoId, "agente");

  // 3. Sistema (objeto que exhibe e instrumenta al proceso)
  const sistemaId = crearObj(posiciones.get("__sistema__")!, NOMBRE_SISTEMA_DEFAULT);
  enlazar(sistemaId, procesoId, "exhibicion");
  enlazar(sistemaId, procesoId, "instrumento");

  return { ok: true, value: ctx.modelo };
}

// ─── Contexto de siembra ─────────────────────────────────────────────

interface ContextoSiembra {
  modelo: Modelo;
  nombresUsados: Set<string>;
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Devuelve el ID de la entidad más recientemente creada. */
function nuevaEntidadId(modelo: Modelo): Id {
  const ids = Object.keys(modelo.entidades);
  if (ids.length === 0) throw new Error("No hay entidades");
  return ids[ids.length - 1]!;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
