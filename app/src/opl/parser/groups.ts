// Oraciones agrupadas: abanicos XOR/OR y familias por preestado.
import type { OperadorAbanico, TipoEnlace } from "../../modelo/tipos";
import type { DiagnosticoOpl, LineaOplNormalizada, OracionOplAst } from "./tipos";
import { claveNombre, normalizarNombreOpl, limpiarEstado, limpiarEstadoMarcado } from "./text";

/** El punto y coma separa miembros solo fuera de una etiqueta entre backticks. */
function splitFamilyItems(text: string): string[] {
  const items: string[] = [];
  let start = 0;
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "`") quoted = !quoted;
    else if (text[index] === ";" && !quoted) {
      items.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  items.push(text.slice(start).trim());
  return items;
}

export function parsearFamiliaEfectosPreestado(
  textoMarcado: string,
  linea: LineaOplNormalizada,
): { ast: OracionOplAst; diagnosticos: DiagnosticoOpl[] } | null {
  const match = /^\[Extensi[oó]n declarada:\s*([^\]]+)\]\s+La familia (total|parcial) indexada por preestado de (.+?) sobre (.+?) tiene dominio \{(.+)\} y comprende (.+); exactamente un miembro aplica para el preestado real$/iu.exec(textoMarcado);
  if (!match) return null;
  const familiaId = (match[1] ?? "").trim();
  const cobertura = (match[2] ?? "").toLocaleLowerCase("es") as "total" | "parcial";
  const proceso = normalizarNombreOpl(match[3] ?? "");
  const objeto = normalizarNombreOpl(match[4] ?? "");
  const dominioEstados = splitFamilyItems(match[5] ?? "")
    .map((item) => /^`([^`]+)`$/u.exec(item)?.[1]?.trim() ?? "");
  const miembros = splitFamilyItems(match[6] ?? "")
    .map((item) => /^`([^`]+)`\s+—ruta\s+`([^`]+)`→\s+`([^`]+)`$/u.exec(item.trim()))
    .map((item) => item ? {
      estadoEntrada: (item[1] ?? "").trim(),
      rutaEtiqueta: (item[2] ?? "").trim(),
      estadoSalida: (item[3] ?? "").trim(),
    } : null);
  if (!familiaId || !proceso || !objeto || dominioEstados.length < 2 || dominioEstados.some((item) => !item) || miembros.length < 2 || miembros.some((item) => item === null)) {
    return null;
  }
  return {
    ast: {
      kind: "familia-efectos-preestado",
      linea: linea.linea,
      familiaId,
      cobertura,
      proceso,
      objeto,
      dominioEstados,
      miembros: miembros.filter((item): item is NonNullable<typeof item> => item !== null),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

// SSOT §11.2-§11.4: abanicos XOR/OR (ronda 26/L3). Reconoce las formas
// emitidas por `generadores/abanico.ts:oracionAbanico` y por
// `oracionAbanicoCondicional`.
//
// Decision D1: cuantificador → operador
//   - "exactamente uno de" → "XOR"
//   - "al menos uno de"   → "O"
// Sin override desde texto: si la palabra no aparece, no hay abanico.
//
// Cubre tres familias:
//
// A) §11.2-§11.3 forma directa
//    `<Proceso> <verbo> [<Obj> (a|de) ]<cuant> <lista>.`
//
// B) §11.4 forma condicional generica
//    `<Proceso> ocurre si <cuant> <lista> existe[, en cuyo caso <sub>],
//     de lo contrario <Proceso> se omite.`
//
// C) Variantes condicionales especificas (cierre TODOs L3):
//    - resultado: `<P> ocurre si <cuant> <lista> puede generarse, en cuyo
//      caso <P> genera <cuant> <lista>, de lo contrario <P> se omite.`
//    - invocacion: `<P> invoca <cuant> <lista> si <P> ocurre.`

const ABANICO_CUANT_RE = /^(exactamente uno de|al menos uno de)\s+(.+)$/iu;

function operadorDeCuantificador(cuant: string): OperadorAbanico {
  return /exactamente/i.test(cuant) ? "XOR" : "O";
}

function tokenizarListaAbanico(texto: string): string[] {
  return texto
    .split(/\s*,\s*/u)
    .flatMap((parte) => parte.split(/\s+(?:y|o)\s+/iu))
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parsearAbanico(texto: string, linea: LineaOplNormalizada, textoMarcado = texto) {
  return parsearAbanicoResultadoCondicional(texto, linea)
    ?? parsearAbanicoInvocacionCondicional(texto, linea)
    ?? parsearAbanicoCondicional(texto, linea)
    ?? parsearAbanicoDirecto(texto, linea, textoMarcado);
}

const ABANICO_EFECTO_EVENTO_OBJETO_PROCESOS_RE =
  /^(.+?)\s+inicia\s+(exactamente uno de|al menos uno de)\s+(?:los\s+procesos\s+)?(.+?),\s*(?:y\s+es\s+afectado\s+por\s+el\s+proceso\s+que\s+ocurre|que\s+afecta\s+(?:el|al)\s+proceso\s+que\s+ocurre)$/iu;

export function parsearAbanicoEvento(texto: string, linea: LineaOplNormalizada) {
  const match = ABANICO_EFECTO_EVENTO_OBJETO_PROCESOS_RE.exec(texto);
  if (!match) return null;
  const proceso = normalizarNombreOpl(match[1] ?? "");
  const operador = operadorDeCuantificador(match[2] ?? "");
  const otros = tokenizarListaAbanico(match[3] ?? "").map(normalizarNombreOpl).filter(Boolean);
  if (!proceso || otros.length < 2) return null;
  return astAbanico(linea, {
    proceso,
    operador,
    tipoEnlace: "efecto",
    otros,
    puertoEsOrigen: true,
    modificador: "evento",
  });
}

// Variante (C) resultado + condicion + abanico (TODO cerrado en L3).
const ABANICO_RESULTADO_COND_RE =
  /^(.+?)\s+ocurre\s+si\s+(exactamente uno de|al menos uno de)\s+(.+?)\s+puede\s+generarse,\s*en\s+cuyo\s+caso\s+(.+?)\s+genera\s+(?:exactamente uno de|al menos uno de)\s+.+?,\s*de\s+lo\s+contrario\s+(.+?)\s+se\s+omite$/iu;

function parsearAbanicoResultadoCondicional(texto: string, linea: LineaOplNormalizada) {
  const match = ABANICO_RESULTADO_COND_RE.exec(texto);
  if (!match) return null;
  const proceso = normalizarNombreOpl(match[1] ?? "");
  const operador = operadorDeCuantificador(match[2] ?? "");
  const otros = tokenizarListaAbanico(match[3] ?? "").map(normalizarNombreOpl).filter(Boolean);
  const procesoSub = normalizarNombreOpl(match[4] ?? "");
  const procesoOmitido = normalizarNombreOpl(match[5] ?? "");
  if (!proceso || otros.length < 2) return null;
  if (claveNombre(procesoSub) !== claveNombre(proceso)) return null;
  if (claveNombre(procesoOmitido) !== claveNombre(proceso)) return null;
  return astAbanico(linea, {
    proceso, operador, tipoEnlace: "resultado", otros, puertoEsOrigen: true, modificador: "condicion",
  });
}

// Variante (C) invocacion + condicion + abanico (TODO cerrado en L3).
const ABANICO_INVOCACION_COND_RE =
  /^(.+?)\s+invoca\s+(exactamente uno de|al menos uno de)\s+(.+?)\s+si\s+(.+?)\s+ocurre$/iu;

function parsearAbanicoInvocacionCondicional(texto: string, linea: LineaOplNormalizada) {
  const match = ABANICO_INVOCACION_COND_RE.exec(texto);
  if (!match) return null;
  const proceso = normalizarNombreOpl(match[1] ?? "");
  const operador = operadorDeCuantificador(match[2] ?? "");
  const otros = tokenizarListaAbanico(match[3] ?? "").map(normalizarNombreOpl).filter(Boolean);
  const procesoCondicion = normalizarNombreOpl(match[4] ?? "");
  if (!proceso || otros.length < 2) return null;
  if (claveNombre(procesoCondicion) !== claveNombre(proceso)) return null;
  return astAbanico(linea, {
    proceso, operador, tipoEnlace: "invocacion", otros, puertoEsOrigen: true, modificador: "condicion",
  });
}

// Variante (A) §11.2-§11.3 directa. Tabla derivada del generador (cf. abanico.ts:94-119).
const ABANICO_VERBO_RE_LIST = [
  { re: /^(.+?)\s+consume\s+(.+)$/iu, tipo: "consumo" as const, puertoEsOrigen: false },
  { re: /^(.+?)\s+genera\s+(.+)$/iu, tipo: "resultado" as const, puertoEsOrigen: true },
  { re: /^(.+?)\s+requiere\s+(.+)$/iu, tipo: "instrumento" as const, puertoEsOrigen: false },
  { re: /^(.+?)\s+afecta\s+(.+)$/iu, tipo: "efecto" as const, puertoEsOrigen: true },
  { re: /^(.+?)\s+invoca\s+(.+)$/iu, tipo: "invocacion" as const, puertoEsOrigen: true },
  { re: /^(.+?)\s+maneja\s+(.+)$/iu, tipo: "agente" as const, puertoEsOrigen: true },
  { re: /^(.+?)\s+es\s+consumido\s+por\s+(.+)$/iu, tipo: "consumo" as const, puertoEsOrigen: true },
  { re: /^(.+?)\s+es\s+generado\s+por\s+(.+)$/iu, tipo: "resultado" as const, puertoEsOrigen: false },
  { re: /^(.+?)\s+es\s+requerido\s+por\s+(.+)$/iu, tipo: "instrumento" as const, puertoEsOrigen: true },
  { re: /^(.+?)\s+es\s+invocado\s+por\s+(.+)$/iu, tipo: "invocacion" as const, puertoEsOrigen: false },
  { re: /^(.+?)\s+es\s+manejado\s+por\s+(.+)$/iu, tipo: "agente" as const, puertoEsOrigen: false },
] as const;

const ABANICO_CAMBIA_RE =
  /^(.+?)\s+cambia\s+(.+?)\s+(a|de)\s+(exactamente uno de|al menos uno de)\s+(.+)$/iu;
const ABANICO_CAMBIA_ENTRADA_COMUN_RE =
  /^(.+?)\s+cambia\s+(.+?)\s+de\s+`([^`]+)`\s+a\s+(exactamente uno de|al menos uno de)\s+(.+)$/iu;
const ABANICO_EFECTO_OBJETO_AFECTADO_PROCESOS_RE =
  /^(.+?)\s+es\s+afectado\s+por\s+(exactamente uno de|al menos uno de)\s+(?:los\s+procesos\s+)?(.+)$/iu;
const ABANICO_EFECTO_OBJETO_PROCESOS_RE =
  /^(.+?)\s+afecta\s+a\s+(exactamente uno de|al menos uno de)\s+(?:los\s+procesos\s+)?(.+)$/iu;

function parsearAbanicoDirecto(texto: string, linea: LineaOplNormalizada, textoMarcado = texto) {
  const entradaComun = ABANICO_CAMBIA_ENTRADA_COMUN_RE.exec(textoMarcado);
  if (entradaComun) {
    const proceso = normalizarNombreOpl(entradaComun[1] ?? "");
    const objeto = normalizarNombreOpl(entradaComun[2] ?? "");
    const estadoEntradaComun = limpiarEstado(entradaComun[3] ?? "");
    const operador = operadorDeCuantificador(entradaComun[4] ?? "");
    const estados = tokenizarListaAbanico(entradaComun[5] ?? "").map(limpiarEstadoMarcado).filter(Boolean);
    if (!proceso || !objeto || !estadoEntradaComun || estados.length < 2) return null;
    return astAbanico(linea, {
      proceso,
      operador,
      tipoEnlace: "efecto",
      otros: estados.map(() => objeto),
      otrosEstados: estados,
      estadoEntradaComun,
      puertoEsOrigen: true,
    });
  }

  const cambia = ABANICO_CAMBIA_RE.exec(texto);
  if (cambia) {
    const proceso = normalizarNombreOpl(cambia[1] ?? "");
    const objeto = normalizarNombreOpl(cambia[2] ?? "");
    const direccion = (cambia[3] ?? "").toLocaleLowerCase("es");
    const operador = operadorDeCuantificador(cambia[4] ?? "");
    const estados = tokenizarListaAbanico(cambia[5] ?? "").map(limpiarEstado).filter(Boolean);
    if (!proceso || !objeto || estados.length < 2) return null;
    const tipo: Extract<TipoEnlace, "consumo" | "resultado"> = direccion === "a" ? "resultado" : "consumo";
    return astAbanico(linea, {
      proceso, operador, tipoEnlace: tipo,
      otros: estados.map(() => objeto),
      otrosEstados: estados,
      puertoEsOrigen: direccion === "a",
    });
  }

  const efectoObjetoProcesos = ABANICO_EFECTO_OBJETO_AFECTADO_PROCESOS_RE.exec(texto)
    ?? ABANICO_EFECTO_OBJETO_PROCESOS_RE.exec(texto);
  if (efectoObjetoProcesos) {
    const proceso = normalizarNombreOpl(efectoObjetoProcesos[1] ?? "");
    const operador = operadorDeCuantificador(efectoObjetoProcesos[2] ?? "");
    const otros = tokenizarListaAbanico(efectoObjetoProcesos[3] ?? "").map(normalizarNombreOpl).filter(Boolean);
    if (proceso && otros.length >= 2) {
      return astAbanico(linea, {
        proceso, operador, tipoEnlace: "efecto", otros, puertoEsOrigen: true,
      });
    }
  }

  for (const entry of ABANICO_VERBO_RE_LIST) {
    const match = entry.re.exec(texto);
    if (!match) continue;
    const proceso = normalizarNombreOpl(match[1] ?? "");
    const restoMatch = ABANICO_CUANT_RE.exec((match[2] ?? "").trim());
    if (!restoMatch) continue;
    const operador = operadorDeCuantificador(restoMatch[1] ?? "");
    const otros = tokenizarListaAbanico(restoMatch[2] ?? "").map(normalizarNombreOpl).filter(Boolean);
    if (!proceso || otros.length < 2) continue;
    return astAbanico(linea, {
      proceso, operador, tipoEnlace: entry.tipo, otros, puertoEsOrigen: entry.puertoEsOrigen,
    });
  }
  return null;
}

const ABANICO_CONDICION_RE =
  /^(.+?)\s+ocurre\s+si\s+(exactamente uno de|al menos uno de)\s+(.+?)\s+existe(?:,\s*en\s+cuyo\s+caso\s+(.+?))?,\s*de\s+lo\s+contrario\s+(.+?)\s+se\s+omite$/iu;

function parsearAbanicoCondicional(texto: string, linea: LineaOplNormalizada) {
  const match = ABANICO_CONDICION_RE.exec(texto);
  if (!match) return null;
  const proceso = normalizarNombreOpl(match[1] ?? "");
  const operador = operadorDeCuantificador(match[2] ?? "");
  const otros = tokenizarListaAbanico(match[3] ?? "").map(normalizarNombreOpl).filter(Boolean);
  const subClausula = (match[4] ?? "").trim();
  const procesoOmitido = normalizarNombreOpl(match[5] ?? "");
  if (!proceso || otros.length < 2) return null;
  if (claveNombre(procesoOmitido) !== claveNombre(proceso)) return null;

  if (!subClausula) {
    return astAbanico(linea, {
      proceso, operador, tipoEnlace: "instrumento", otros, puertoEsOrigen: false, modificador: "condicion",
    });
  }

  const clasificacion = clasificarSubClausulaAbanico(subClausula, proceso, otros);
  if (!clasificacion) return null;
  return astAbanico(linea, {
    proceso, operador, tipoEnlace: clasificacion.tipo, otros,
    puertoEsOrigen: clasificacion.puertoEsOrigen, modificador: "condicion",
  });
}

function clasificarSubClausulaAbanico(
  sub: string,
  proceso: string,
  otros: string[],
): { tipo: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">; puertoEsOrigen: boolean } | null {
  const procesoClave = claveNombre(proceso);
  const otrosClaves = new Set(otros.map((nombre) => claveNombre(nombre)));

  let match = /^(.+?)\s+consume\s+(.+)$/iu.exec(sub);
  if (match && claveNombre(normalizarNombreOpl(match[1] ?? "")) === procesoClave) {
    if (listaSeCorrespondeConOtros(match[2] ?? "", otrosClaves)) {
      return { tipo: "consumo", puertoEsOrigen: false };
    }
  }
  match = /^(.+?)\s+afecta\s+(.+)$/iu.exec(sub);
  if (match && claveNombre(normalizarNombreOpl(match[1] ?? "")) === procesoClave) {
    if (listaSeCorrespondeConOtros(match[2] ?? "", otrosClaves)) {
      return { tipo: "efecto", puertoEsOrigen: true };
    }
  }
  match = /^(exactamente uno de|al menos uno de)\s+(.+?)\s+maneja\s+(.+)$/iu.exec(sub);
  if (match && claveNombre(normalizarNombreOpl(match[3] ?? "")) === procesoClave) {
    if (listaSeCorrespondeConOtros(match[2] ?? "", otrosClaves)) {
      return { tipo: "agente", puertoEsOrigen: false };
    }
  }
  return null;
}

function listaSeCorrespondeConOtros(textoLista: string, otrosClaves: Set<string>): boolean {
  const items = tokenizarListaAbanico(textoLista).map(normalizarNombreOpl).map(claveNombre);
  if (items.length === 0) return false;
  return items.every((clave) => otrosClaves.has(clave));
}

function astAbanico(
  linea: LineaOplNormalizada,
  payload: {
    proceso: string;
    operador: OperadorAbanico;
    tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion">;
    otros: string[];
    otrosEstados?: string[];
    estadoEntradaComun?: string;
    puertoEsOrigen: boolean;
    modificador?: "condicion" | "evento";
  },
) {
  return {
    ast: {
      kind: "abanico" as const,
      linea: linea.linea,
      proceso: payload.proceso,
      operador: payload.operador,
      tipoEnlace: payload.tipoEnlace,
      otros: payload.otros,
      ...(payload.otrosEstados ? { otrosEstados: payload.otrosEstados } : {}),
      ...(payload.estadoEntradaComun ? { estadoEntradaComun: payload.estadoEntradaComun } : {}),
      puertoEsOrigen: payload.puertoEsOrigen,
      ...(payload.modificador ? { modificador: payload.modificador } : {}),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}
