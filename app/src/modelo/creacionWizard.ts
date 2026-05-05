// Kernel puro del asistente de nuevo modelo de 12 etapas.
// Validacion de datos por etapa y siembra del modelo con layout radial
// determinista. Sin dependencias del store ni del render.
//
// SSOT: metodologia-opm-es.md §6 (12 etapas + reglas de cierre).
// Layout: radial "sol" con proceso central, sectores por categoria,
// radio base = 260, espaciado angular minimo 25°.

import { extremoEstado } from "./extremos";
import {
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  renombrarEstado,
} from "./operaciones";
import type { Id, Modelo, Posicion, Resultado, TipoEnlace } from "./tipos";

// ─── Tipos ───────────────────────────────────────────────────────────

/** Etapa del asistente: 0 (bienvenida) a 11 (modelo sembrado). */
export type EtapaAsistente = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** Verbos de salida mapeados a es-CL en la UI; internos en EN. */
export type VerboSalida = "creates" | "affects" | "changes";
export const VERBOS_SALIDA: VerboSalida[] = ["creates", "affects", "changes"];
export const VERBO_SALIDA_ES: Record<VerboSalida, string> = {
  creates: "crea",
  affects: "afecta",
  changes: "cambia",
};

/** Datos capturados por las 12 etapas del asistente. */
export interface DatosAsistente {
  funcionPrincipal: string;
  beneficiario: string;
  atributo: { nombre: string; estadoEntrada: string; estadoSalida: string } | null;
  beneficiarioEsHandler: boolean;
  agentesAdicionales: string[];
  nombreSistema: string;
  herramientas: string[];
  entradas: string[];
  salidas: { nombre: string; verbo: VerboSalida }[];
  ambientales: string[];
}

/** Parametros de layout radial. Expuestos para testear determinismo. */
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
    atributo: null,
    beneficiarioEsHandler: true,
    agentesAdicionales: [],
    nombreSistema: "",
    herramientas: [],
    entradas: [],
    salidas: [],
    ambientales: [],
  };
}

export const TOTAL_ETAPAS = 12;
export const ETAPA_BIENVENIDA = 0 satisfies EtapaAsistente;
export const ETAPA_FUNCION = 1 satisfies EtapaAsistente;
export const ETAPA_BENEFICIARIO = 2 satisfies EtapaAsistente;
export const ETAPA_ATRIBUTO = 3 satisfies EtapaAsistente;
export const ETAPA_HANDLER = 4 satisfies EtapaAsistente;
export const ETAPA_NOMBRE_SISTEMA = 5 satisfies EtapaAsistente;
export const ETAPA_HERRAMIENTAS = 6 satisfies EtapaAsistente;
export const ETAPA_ENTRADAS = 7 satisfies EtapaAsistente;
export const ETAPA_SALIDAS = 8 satisfies EtapaAsistente;
export const ETAPA_AMBIENTALES = 9 satisfies EtapaAsistente;
export const ETAPA_CONFIRMAR = 10 satisfies EtapaAsistente;

export const ETAPAS_OBLIGATORIAS: EtapaAsistente[] = [
  ETAPA_BIENVENIDA, ETAPA_FUNCION, ETAPA_BENEFICIARIO,
  ETAPA_NOMBRE_SISTEMA, ETAPA_CONFIRMAR,
];

export const ETAPAS_OPCIONALES: EtapaAsistente[] = [
  ETAPA_ATRIBUTO, ETAPA_HANDLER, ETAPA_HERRAMIENTAS,
  ETAPA_ENTRADAS, ETAPA_SALIDAS, ETAPA_AMBIENTALES,
];

// ─── Validacion ──────────────────────────────────────────────────────

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
      if (val.length === 0) return { ok: false, error: "La funcion principal del sistema es obligatoria" };
      if (val.length > 120) return { ok: false, error: "El nombre de la funcion principal es muy largo (max 120 caracteres)" };
      return { ok: true };
    }
    case ETAPA_BENEFICIARIO: {
      const val = (datos.beneficiario ?? "").trim();
      if (val.length === 0) return { ok: false, error: "El beneficiario del sistema es obligatorio" };
      if (val.length > 80) return { ok: false, error: "El nombre del beneficiario es muy largo (max 80 caracteres)" };
      return { ok: true };
    }
    case ETAPA_ATRIBUTO: {
      if (!datos.atributo) return { ok: true };
      const a = datos.atributo.nombre.trim();
      const e1 = datos.atributo.estadoEntrada.trim();
      const e2 = datos.atributo.estadoSalida.trim();
      if (a.length === 0 && e1.length === 0 && e2.length === 0) return { ok: true };
      if (a.length === 0) return { ok: false, error: "El nombre del atributo no puede estar vacio" };
      if (e1.length === 0) return { ok: false, error: "El estado de entrada no puede estar vacio" };
      if (e2.length === 0) return { ok: false, error: "El estado de salida no puede estar vacio" };
      return { ok: true };
    }
    case ETAPA_HANDLER: {
      if (!datos.beneficiarioEsHandler) {
        const agentes = (datos.agentesAdicionales ?? []).filter((a) => a.trim().length > 0);
        if (agentes.length === 0) {
          return { ok: false, error: "Si el beneficiario no es handler, debes indicar al menos un agente" };
        }
      }
      return { ok: true };
    }
    case ETAPA_NOMBRE_SISTEMA: {
      const val = (datos.nombreSistema ?? "").trim();
      if (val.length === 0) return { ok: false, error: "El nombre del sistema es obligatorio" };
      if (val.length > 120) return { ok: false, error: "El nombre del sistema es muy largo (max 120 caracteres)" };
      return { ok: true };
    }
    case ETAPA_HERRAMIENTAS:
    case ETAPA_ENTRADAS:
    case ETAPA_SALIDAS:
    case ETAPA_AMBIENTALES:
      return { ok: true };
    case ETAPA_CONFIRMAR: {
      const f = (datos.funcionPrincipal ?? "").trim();
      if (f.length === 0) return { ok: false, error: "Falta la funcion principal del sistema" };
      const b = (datos.beneficiario ?? "").trim();
      if (b.length === 0) return { ok: false, error: "Falta el beneficiario del sistema" };
      const n = (datos.nombreSistema ?? "").trim();
      if (n.length === 0) return { ok: false, error: "Falta el nombre del sistema" };
      if (!datos.beneficiarioEsHandler) {
        const agentes = (datos.agentesAdicionales ?? []).filter((a) => a.trim().length > 0);
        if (agentes.length === 0) {
          return { ok: false, error: "Falta definir los agentes del sistema" };
        }
      }
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

function distribuirEnSector(
  posiciones: Map<string, Posicion>,
  prefijo: string,
  items: string[],
  anguloBaseGrados: number,
  espaciadoGrados: number,
  radio: number,
  centro: Posicion,
): void {
  if (items.length === 0) return;
  const offset = ((items.length - 1) * espaciadoGrados) / 2;
  for (let i = 0; i < items.length; i++) {
    const angulo = anguloBaseGrados - offset + i * espaciadoGrados;
    posiciones.set(`${prefijo}_${i}`, posicionEnAnillo(angulo, radio, centro));
  }
}

export function calcularPosicionesRadiales(
  datos: DatosAsistente,
  params: Partial<ParametrosLayoutRadial> = {},
): Map<string, Posicion> {
  const p = { ...LAYOUT_DEFAULT, ...params };
  const pos = new Map<string, Posicion>();

  pos.set("__proceso__", { ...p.centro });
  pos.set("__beneficiario__", posicionEnAnillo(0, p.radioInterior, p.centro));
  if (datos.atributo && datos.atributo.nombre.trim().length > 0) {
    pos.set("__atributo__", posicionEnAnillo(45, p.radioInterior, p.centro));
  }
  pos.set("__sistema__", posicionEnAnillo(270, p.radioInterior, p.centro));

  const agentes = datos.beneficiarioEsHandler
    ? [] : datos.agentesAdicionales.filter((a) => a.trim().length > 0);
  distribuirEnSector(pos, "__agente", agentes, 90, p.espaciadoMinimo, p.radioInterior, p.centro);

  const herramientas = datos.herramientas.filter((h) => h.trim().length > 0);
  distribuirEnSector(pos, "__herr", herramientas, 240, p.espaciadoMinimo, p.radioInterior, p.centro);

  const entradas = datos.entradas.filter((e) => e.trim().length > 0);
  distribuirEnSector(pos, "__entrada", entradas, 330, p.espaciadoMinimo, p.radioInterior, p.centro);

  const salidas = datos.salidas.filter((s) => s.nombre.trim().length > 0);
  distribuirEnSector(pos, "__salida", salidas.map((s) => s.nombre), 135, p.espaciadoMinimo, p.radioInterior, p.centro);

  const ambientales = datos.ambientales.filter((a) => a.trim().length > 0);
  distribuirEnSector(pos, "__amb", ambientales, 180, p.espaciadoMinimo, p.radioExterior, p.centro);

  return pos;
}

// ─── Siembra ─────────────────────────────────────────────────────────

export function sembrarModeloDesdeAsistente(
  datos: DatosAsistente,
  layoutParams: Partial<ParametrosLayoutRadial> = {},
): Resultado<Modelo> {
  const validacion = validarDatosAsistente(datos, ETAPA_CONFIRMAR);
  if (!validacion.ok) return { ok: false, error: validacion.error };

  const posiciones = calcularPosicionesRadiales(datos, layoutParams);

  // Contexto mutable de siembra: guarda el modelo en construccion y registra
  // los IDs de entidades creadas para enlazar y marcar ambientales.
  const ctx: ContextoSiembra = {
    modelo: crearModelo(datos.nombreSistema.trim()),
    nombresUsados: new Set<string>(),
    nameToId: new Map<string, Id>(),
  };
  const opdId = ctx.modelo.opdRaizId;

  // Helpers de siembra
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
    const id = nuevaEntidadId(ctx.modelo);
    ctx.nameToId.set(n.toLowerCase(), id);
    return id;
  };

  const crearProc = (pos: Posicion, nombre: string): Id => {
    const n = unico(nombre);
    ctx.modelo = must(crearProceso(ctx.modelo, opdId, pos, n));
    const id = nuevaEntidadId(ctx.modelo);
    ctx.nameToId.set(n.toLowerCase(), id);
    return id;
  };

  const enlazar = (origen: Id, destino: Id, tipo: TipoEnlace): void => {
    ctx.modelo = must(crearEnlace(ctx.modelo, opdId, origen, destino, tipo));
  };

  // 2. Proceso central
  const procesoId = crearProc(posiciones.get("__proceso__")!, datos.funcionPrincipal);

  // 3. Beneficiario (debe ser fisico para enlace agente)
  const beneficiarioId = crearObj(posiciones.get("__beneficiario__")!, datos.beneficiario);
  ctx.modelo = must(cambiarEsencia(ctx.modelo, beneficiarioId, "fisica"));

  // 4. Atributo (opcional)
  if (datos.atributo && datos.atributo.nombre.trim().length > 0) {
    const posAttr = posiciones.get("__atributo__") ?? posiciones.get("__beneficiario__")!;
    const atributoId_ = crearObj({ x: posAttr.x + 20, y: posAttr.y + 80 }, datos.atributo.nombre);

    const estRes = must(crearEstadosIniciales(ctx.modelo, atributoId_));
    ctx.modelo = estRes.modelo;
    const [e1Id, e2Id] = estRes.estadoIds;

    ctx.modelo = must(renombrarEstado(ctx.modelo, e1Id, unico(datos.atributo.estadoEntrada)));
    ctx.modelo = must(renombrarEstado(ctx.modelo, e2Id, unico(datos.atributo.estadoSalida)));

    // Enlace exhibicion: beneficiario -> atributo
    ctx.modelo = must(crearEnlace(ctx.modelo, opdId, beneficiarioId, atributoId_, "exhibicion"));

    // Enlaces estado -> proceso: usar extremoEstado para estados
    ctx.modelo = must(crearEnlace(ctx.modelo, opdId, extremoEstado(e1Id), procesoId, "consumo"));
    ctx.modelo = must(crearEnlace(ctx.modelo, opdId, procesoId, extremoEstado(e2Id), "resultado"));
  }

  // 5. Handler (agente requiere origen fisico)
  if (datos.beneficiarioEsHandler) {
    ctx.modelo = must(crearEnlace(ctx.modelo, opdId, beneficiarioId, procesoId, "agente"));
  } else {
    const agentes = datos.agentesAdicionales.filter((a) => a.trim().length > 0);
    for (let i = 0; i < agentes.length; i++) {
      const pos = posiciones.get(`__agente_${i}`)
        ?? posicionEnAnillo(90 + i * 25, LAYOUT_DEFAULT.radioInterior, LAYOUT_DEFAULT.centro);
      const agId = crearObj(pos, agentes[i]!);
      ctx.modelo = must(cambiarEsencia(ctx.modelo, agId, "fisica"));
      ctx.modelo = must(crearEnlace(ctx.modelo, opdId, agId, procesoId, "agente"));
    }
  }

  // 6. Nombre del sistema
  const sistemaId = crearObj(posiciones.get("__sistema__")!, datos.nombreSistema);
  enlazar(sistemaId, procesoId, "exhibicion");
  enlazar(sistemaId, procesoId, "instrumento");

  // 7. Herramientas
  for (let i = 0; i < datos.herramientas.length; i++) {
    const h = datos.herramientas[i]!.trim();
    if (h.length === 0) continue;
    const pos = posiciones.get(`__herr_${i}`)
      ?? posicionEnAnillo(240 + i * 25, LAYOUT_DEFAULT.radioInterior, LAYOUT_DEFAULT.centro);
    const hId = crearObj(pos, h);
    enlazar(hId, procesoId, "instrumento");
  }

  // 8. Entradas
  for (let i = 0; i < datos.entradas.length; i++) {
    const e = datos.entradas[i]!.trim();
    if (e.length === 0) continue;
    const pos = posiciones.get(`__entrada_${i}`)
      ?? posicionEnAnillo(330 + i * 25, LAYOUT_DEFAULT.radioInterior, LAYOUT_DEFAULT.centro);
    const eId = crearObj(pos, e);
    enlazar(eId, procesoId, "consumo");
  }

  // 9. Salidas
  for (let i = 0; i < datos.salidas.length; i++) {
    const s = datos.salidas[i]!;
    if (s.nombre.trim().length === 0) continue;
    const pos = posiciones.get(`__salida_${i}`)
      ?? posicionEnAnillo(135 + i * 25, LAYOUT_DEFAULT.radioInterior, LAYOUT_DEFAULT.centro);
    const sId = crearObj(pos, s.nombre);
    const tipo: TipoEnlace = s.verbo === "creates" ? "resultado" : "efecto";
    enlazar(procesoId, sId, tipo);
  }

  // 10. Ambientales
  for (const nombreAmb of datos.ambientales) {
    const t = nombreAmb.trim();
    if (t.length === 0) continue;
    const idAmb = ctx.nameToId.get(t.toLowerCase());
    if (idAmb && idAmb !== procesoId) {
      ctx.modelo = must(cambiarAfiliacion(ctx.modelo, idAmb, "ambiental"));
    }
  }

  return { ok: true, value: ctx.modelo };
}

// ─── Contexto de siembra ─────────────────────────────────────────────

interface ContextoSiembra {
  modelo: Modelo;
  nombresUsados: Set<string>;
  /** Para resolver nombres -> IDs al marcar ambientales. */
  nameToId: Map<string, Id>;
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Devuelve el ID de la entidad mas recientemente creada. */
function nuevaEntidadId(modelo: Modelo): Id {
  const ids = Object.keys(modelo.entidades);
  if (ids.length === 0) throw new Error("No hay entidades");
  // La ultima clave insertada (los IDs son secuenciales: e-1, e-2, ...)
  return ids[ids.length - 1]!;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
