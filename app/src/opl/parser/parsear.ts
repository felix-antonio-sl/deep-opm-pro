import type { Afiliacion, DesignacionEstado, Esencia, TipoEntidad, TipoEnlace } from "../../modelo/tipos";
import type { AstProcedimentalBase, DiagnosticoOpl, LineaOplNormalizada, OracionOplAst, ParseResultOpl } from "./tipos";

import { parsearAbanico, parsearAbanicoEvento, parsearFamiliaEfectosPreestado } from "./groups";
import {
  PUNTO_FINAL, RUTA_PREFIJO_RE, claveNombre, dividirLista, extraerMultiplicidadDeNombre,
  limpiarEstado, limpiarObjetoConEstado, limpiarObjetoConEstadoConMultiplicidad,
  normalizarLineas, normalizarNombreOpl, parsearCambioEstadoMarcado, textoMarcadoDeLinea,
} from "./text";

// Conserva la entrada pública del parser para sus consumidores.
export { claveNombre, extraerMultiplicidad, normalizarLineas, normalizarNombreOpl } from "./text";

export function parsearParrafoOpl(texto: string): ParseResultOpl {
  const lineas = normalizarLineas(texto);
  const ast: OracionOplAst[] = [];
  const diagnosticos: DiagnosticoOpl[] = [];

  for (const linea of lineas) {
    if (!PUNTO_FINAL.test(linea.texto) && !linea.etiqueta) {
      diagnosticos.push(errorSintaxis(linea.linea, "La oracion OPL-ES debe terminar en punto."));
      continue;
    }
    const textoSinPunto = linea.texto.replace(PUNTO_FINAL, "").trim();
    const textoMarcadoSinPunto = textoMarcadoDeLinea(linea.original).replace(PUNTO_FINAL, "").trim();
    const parsed = parsearOracion(textoSinPunto, linea, textoMarcadoSinPunto);
    ast.push(parsed.ast);
    diagnosticos.push(...parsed.diagnosticos);
  }

  return { ast, diagnosticos, lineas };
}

function parsearOracion(
  texto: string,
  linea: LineaOplNormalizada,
  textoMarcado = texto,
): { ast: OracionOplAst; diagnosticos: DiagnosticoOpl[] } {
  // SSOT §13: ruta etiquetada. Si la oracion empieza por `Por ruta <etiqueta>, ...`
  // delegamos el parseo del sub-texto y enriquecemos el AST resultante con
  // `rutaEtiqueta`. Solo aplica en familias procedimental / evento / condicion
  // (las unicas que el modelo soporta para rutas; `enlaceAdmiteRuta`).
  const rutaMatch = RUTA_PREFIJO_RE.exec(texto);
  if (rutaMatch) {
    const etiqueta = (rutaMatch[1] ?? "").trim();
    const subTexto = (rutaMatch[2] ?? "").trim();
    if (etiqueta && subTexto) {
      const rutaMarcadaMatch = RUTA_PREFIJO_RE.exec(textoMarcado);
      const subTextoMarcado = (rutaMarcadaMatch?.[2] ?? subTexto).trim();
      const hijo = parsearOracion(subTexto, linea, subTextoMarcado);
      const astConRuta = aplicarRutaAlAst(hijo.ast, etiqueta);
      return { ast: astConRuta, diagnosticos: hijo.diagnosticos };
    }
  }

  return parsearFamiliaEfectosPreestado(textoMarcado, linea)
    ?? parsearDescripcion(texto, linea)
    ?? parsearClasificacionRasgo(texto, linea)
    ?? parsearEstados(texto, linea)
    ?? parsearAbanicoEvento(texto, linea)
    ?? parsearEvento(texto, linea, textoMarcado)
    ?? parsearExcepcion(texto, linea)
    // `parsearAbanico` (ronda 26/L3) DEBE correr antes de `parsearCondicion` y
    // `parsearProcedimental`. Las oraciones de abanico se mimetizan con las
    // individuales cuando se ignora el cuantificador ("exactamente uno de" /
    // "al menos uno de"). Si NO esta el cuantificador, parsearAbanico devuelve
    // null y la cadena continua → aditividad estricta.
    ?? parsearAbanico(texto, linea, textoMarcado)
    ?? parsearCondicion(texto, linea, textoMarcado)
    ?? parsearProcedimental(texto, linea, textoMarcado)
    ?? parsearEstructural(texto, linea)
    ?? parsearDesignacionEstado(texto, linea)
    ?? parsearPlegadoParcial(texto, linea)
    ?? parsearMetadata(texto, linea)
    ?? parsearContexto(texto, linea)
    ?? {
      ast: { kind: "unsupported", linea: linea.linea, texto, ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}) },
      diagnosticos: [{
        codigo: "syntax-error",
        severidad: "error",
        linea: linea.linea,
        columna: 1,
        mensaje: "No se reconocio una oracion OPL-ES canonica soportada por el parser.",
        sugerencia: "Usa una plantilla SSOT: descripcion, estados, enlace procedural, enlace estructural o contexto.",
      }],
    };
}

/**
 * Aplica `rutaEtiqueta` al AST hijo si el kind admite ruta. Familias soportadas:
 * - `procedimental`: rutaEtiqueta directo (esta en AstProcedimentalBase).
 * - `evento`: rutaEtiqueta replicada al base si existe (es donde vive el enlace).
 * - `condicion`: la rutaEtiqueta viaja en el AST y `planificarCondicion` la
 *   traslada al enlace base que materializa (§11.1 Roundtrip: la etiqueta DEBE
 *   preservarse — A3-2).
 * - `abanico`: idem, el wrapper L3 no soporta ruta en este corte.
 *
 * Para AST de otras familias (descripcion-cosa, estados, ...) el prefijo
 * `Por ruta` no tiene sentido: devolvemos el AST sin enriquecer.
 */
function aplicarRutaAlAst(ast: OracionOplAst, rutaEtiqueta: string): OracionOplAst {
  if (ast.kind === "procedimental") return { ...ast, rutaEtiqueta };
  if (ast.kind === "evento") {
    if (ast.base) return { ...ast, base: { ...ast.base, rutaEtiqueta } };
    return ast;
  }
  if (ast.kind === "condicion") return { ...ast, rutaEtiqueta };
  return ast;
}

function parsearDescripcion(texto: string, linea: LineaOplNormalizada) {
  const match = /^(.+?) es un (objeto|proceso) (f[ií]sic[oa]|informacional) y (sist[eé]mic[oa]|ambiental)$/iu.exec(texto);
  if (!match) return null;
  return {
    ast: {
      kind: "descripcion-cosa" as const,
      linea: linea.linea,
      nombre: normalizarNombreOpl(match[1] ?? ""),
      tipoEntidad: (match[2] === "objeto" ? "objeto" : "proceso") as TipoEntidad,
      esencia: parsearEsencia(match[3] ?? ""),
      afiliacion: parsearAfiliacion(match[4] ?? ""),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

// G2 (canon-opm D1–D4, ui-forja/04 §3.1): clasificación escindida en oraciones
// simples. `X es física.` / `X es informacional.` (esencia) y `X es ambiental.`
// / `X es sistémica.` (afiliación), una dimensión por oración. El tipo (objeto
// vs proceso) no aparece en el texto canónico: se infiere de la decoración
// markdown del nombre (**objeto** vs *proceso*) en `linea.original`. Reverso del
// generador `oracionEntidad`; mantiene `parsearDescripcion` (forma colapsada)
// como entrada legacy/dictado válida — aditividad, nunca rechazo de OPL válida.
const CLASIFICACION_RASGO_RE = /^(.+?) es (f[ií]sic[oa]|informacional|sist[eé]mic[oa]|ambiental)$/iu;

function tipoEntidadDesdeMarkdown(original: string): TipoEntidad {
  return /\*\*[^*]/.test(original.trim()) ? "objeto" : original.trim().startsWith("*") ? "proceso" : "objeto";
}

function parsearClasificacionRasgo(texto: string, linea: LineaOplNormalizada) {
  const match = CLASIFICACION_RASGO_RE.exec(texto);
  if (!match) return null;
  const rasgo = (match[2] ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");
  // Esencia: `físico/física` o `informacional`. Afiliación: `sistémico/sistémica`
  // o `ambiental`. La dimensión la decide la familia léxica, no el género.
  const esEsencia = rasgo.startsWith("fisic") || rasgo === "informacional";
  return {
    ast: {
      kind: "descripcion-cosa" as const,
      linea: linea.linea,
      nombre: normalizarNombreOpl(match[1] ?? ""),
      tipoEntidad: tipoEntidadDesdeMarkdown(linea.original),
      ...(esEsencia ? { esencia: parsearEsencia(match[2] ?? "") } : { afiliacion: parsearAfiliacion(match[2] ?? "") }),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

function parsearEstados(texto: string, linea: LineaOplNormalizada) {
  const match = /^(.+?) puede estar (.+)$/iu.exec(texto);
  if (!match) return null;
  return {
    ast: {
      kind: "estados" as const,
      linea: linea.linea,
      objeto: normalizarNombreOpl(match[1] ?? ""),
      estados: dividirLista(match[2] ?? "", "o").map(limpiarEstado).filter(Boolean),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

// SSOT §8.1 EX1/EX2: "X ocurre si duracion de Y excede N unidad" o
// "X ocurre si duracion de Y es menor que N unidad". Captura valor numerico
// crudo y unidad textual; el aplicador persiste tal cual en `tiempoMaximo` /
// `unidadTiempoMaximo` (resp. minimo) sobre el enlace.
const EXCEPCION_SOBRETIEMPO_RE =
  /^(.+?)\s+ocurre\s+si\s+duraci[oó]n\s+de\s+(.+?)\s+excede\s+(\d+(?:[.,]\d+)?)\s+(.+?)$/iu;
const EXCEPCION_SUBTIEMPO_RE =
  /^(.+?)\s+ocurre\s+si\s+duraci[oó]n\s+de\s+(.+?)\s+es\s+menor\s+que\s+(\d+(?:[.,]\d+)?)\s+(.+?)$/iu;
// SSOT §5.3 L889 variante combinada: "X ocurre si duracion de Y es menor que
// <min> u<min> o excede <max> u<max>". Crea `excepcionSubSobretiempo`. DEBE
// probarse ANTES de las simples: contiene ambas subfrases y las simples
// matchearian con fuente corrupta.
const EXCEPCION_COMBINADA_RE =
  /^(.+?)\s+ocurre\s+si\s+duraci[oó]n\s+de\s+(.+?)\s+es\s+menor\s+que\s+(\d+(?:[.,]\d+)?)\s+(.+?)\s+o\s+excede\s+(\d+(?:[.,]\d+)?)\s+(.+?)$/iu;

function parsearExcepcion(texto: string, linea: LineaOplNormalizada) {
  const combinada = EXCEPCION_COMBINADA_RE.exec(texto);
  if (combinada) {
    return astExcepcion(linea, {
      proceso: normalizarNombreOpl(combinada[1] ?? ""),
      fuente: normalizarNombreOpl(combinada[2] ?? ""),
      limite: {
        tipo: "minmax",
        min: { valor: (combinada[3] ?? "").trim(), unidad: (combinada[4] ?? "").trim() },
        max: { valor: (combinada[5] ?? "").trim(), unidad: (combinada[6] ?? "").trim() },
      },
    });
  }
  const sobretiempo = EXCEPCION_SOBRETIEMPO_RE.exec(texto);
  if (sobretiempo) {
    return astExcepcion(linea, {
      proceso: normalizarNombreOpl(sobretiempo[1] ?? ""),
      fuente: normalizarNombreOpl(sobretiempo[2] ?? ""),
      limite: { tipo: "max", valor: (sobretiempo[3] ?? "").trim(), unidad: (sobretiempo[4] ?? "").trim() },
    });
  }
  const subtiempo = EXCEPCION_SUBTIEMPO_RE.exec(texto);
  if (subtiempo) {
    return astExcepcion(linea, {
      proceso: normalizarNombreOpl(subtiempo[1] ?? ""),
      fuente: normalizarNombreOpl(subtiempo[2] ?? ""),
      limite: { tipo: "min", valor: (subtiempo[3] ?? "").trim(), unidad: (subtiempo[4] ?? "").trim() },
    });
  }
  return null;
}

function astExcepcion(
  linea: LineaOplNormalizada,
  payload: {
    proceso: string;
    fuente: string;
    limite: Extract<OracionOplAst, { kind: "excepcion" }>["limite"];
  },
) {
  return {
    ast: {
      kind: "excepcion" as const,
      linea: linea.linea,
      proceso: payload.proceso,
      fuente: payload.fuente,
      limite: payload.limite,
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

// SSOT §7: condiciones transformadoras (CT1/CT2/CS2..CS4), habilitadoras
// (CH1/CH2/CS5/CS6) y con estado especificado (CS1/CS6). El estado puede
// venir con backticks crudos o sin ellos (limpiarMarkdown los elimina del
// texto antes de llegar aqui), por eso `\\`?` es opcional.
const CONDICION_OCURRE_RE =
  /^(.+?)\s+ocurre\s+si\s+(.+?)\s+(?:(existe)|est[aá]\s+en\s+`?([^`,]+?)`?)(?:,\s*en\s+cuyo\s+caso\s+(.+?))?,\s*de\s+lo\s+contrario\s+(.+?)\s+se\s+omite$/iu;
const CONDICION_AGENTE_RE =
  /^(.+?)\s+maneja\s+(.+?)\s+si\s+(.+?)\s+(?:(existe)|est[aá]\s+en\s+`?([^`,]+?)`?),\s*de\s+lo\s+contrario\s+(.+?)\s+se\s+omite$/iu;

function parsearCondicion(texto: string, linea: LineaOplNormalizada, textoMarcado = texto) {
  const agente = CONDICION_AGENTE_RE.exec(texto);
  if (agente) {
    const proceso = normalizarNombreOpl(agente[2] ?? "");
    const condicionante = normalizarNombreOpl(agente[1] ?? "");
    const procesoOmitido = normalizarNombreOpl(agente[6] ?? "");
    if (claveNombre(procesoOmitido) !== claveNombre(proceso)) return null;
    const estado = agente[5] ? limpiarEstado(agente[5]) : undefined;
    return astCondicion(linea, {
      proceso,
      condicionante,
      ...(estado ? { condicionanteEstado: estado } : {}),
      base: "agente",
      sinConsecuencia: true,
    });
  }

  const ocurre = CONDICION_OCURRE_RE.exec(texto);
  if (!ocurre) return null;

  const proceso = normalizarNombreOpl(ocurre[1] ?? "");
  const condicionante = normalizarNombreOpl(ocurre[2] ?? "");
  const estado = ocurre[4] ? limpiarEstado(ocurre[4]) : undefined;
  const subClausula = (ocurre[5] ?? "").trim();
  const procesoOmitido = normalizarNombreOpl(ocurre[6] ?? "");
  if (claveNombre(procesoOmitido) !== claveNombre(proceso)) return null;

  if (!subClausula) {
    return astCondicion(linea, {
      proceso,
      condicionante,
      ...(estado ? { condicionanteEstado: estado } : {}),
      base: "instrumento",
      sinConsecuencia: true,
    });
  }

  const subClausulaMarcada = /,\s*en\s+cuyo\s+caso\s+(.+),\s*de\s+lo\s+contrario\s+/iu.exec(textoMarcado)?.[1]?.trim()
    ?? subClausula;
  const base = clasificarSubClausulaCondicion(subClausula, proceso, condicionante, subClausulaMarcada);
  if (!base) return null;
  return astCondicion(linea, {
    proceso,
    condicionante,
    ...(estado ? { condicionanteEstado: estado } : {}),
    base: base.base,
    ...(base.estadoSalida ? { estadoSalida: base.estadoSalida } : {}),
    sinConsecuencia: false,
  });
}

function clasificarSubClausulaCondicion(
  sub: string,
  proceso: string,
  condicionante: string,
  subMarcada = sub,
): { base: "consumo" | "efecto"; estadoSalida?: string } | null {
  const procesoClave = claveNombre(proceso);
  const condicionanteClave = claveNombre(condicionante);

  let match = /^(.+?)\s+se\s+consume$/iu.exec(sub);
  if (match) {
    if (claveNombre(normalizarNombreOpl(match[1] ?? "")) !== condicionanteClave) return null;
    return { base: "consumo" };
  }
  match = /^(.+?)\s+consume\s+(.+)$/iu.exec(sub);
  if (match) {
    if (claveNombre(normalizarNombreOpl(match[1] ?? "")) !== procesoClave) return null;
    if (claveNombre(normalizarNombreOpl(match[2] ?? "")) !== condicionanteClave) return null;
    return { base: "consumo" };
  }
  match = /^(.+?)\s+afecta\s+(.+)$/iu.exec(sub);
  if (match) {
    if (claveNombre(normalizarNombreOpl(match[1] ?? "")) !== procesoClave) return null;
    if (claveNombre(normalizarNombreOpl(match[2] ?? "")) !== condicionanteClave) return null;
    return { base: "efecto" };
  }
  const cambioMarcado = parsearCambioEstadoMarcado(subMarcada);
  if (cambioMarcado?.proceso) {
    if (claveNombre(cambioMarcado.proceso) !== procesoClave) return null;
    if (claveNombre(cambioMarcado.objeto) !== condicionanteClave) return null;
    return { base: "efecto", estadoSalida: cambioMarcado.estadoSalida };
  }
  // CS2: "Proceso cambia Objeto de `s1` a `s2`" (backticks opcionales: limpiarMarkdown los puede haber quitado).
  match = /^(.+?)\s+cambia\s+(.+?)\s+de\s+`?([^`]+?)`?\s+a\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    if (claveNombre(normalizarNombreOpl(match[1] ?? "")) !== procesoClave) return null;
    if (claveNombre(normalizarNombreOpl(match[2] ?? "")) !== condicionanteClave) return null;
    return { base: "efecto", estadoSalida: limpiarEstado(match[4] ?? "") };
  }
  // CS3: "Proceso cambia Objeto de `s`".
  match = /^(.+?)\s+cambia\s+(.+?)\s+de\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    if (claveNombre(normalizarNombreOpl(match[1] ?? "")) !== procesoClave) return null;
    if (claveNombre(normalizarNombreOpl(match[2] ?? "")) !== condicionanteClave) return null;
    return { base: "consumo" };
  }
  // CS4: "Proceso cambia Objeto a `s`".
  match = /^(.+?)\s+cambia\s+(.+?)\s+a\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    if (claveNombre(normalizarNombreOpl(match[1] ?? "")) !== procesoClave) return null;
    if (claveNombre(normalizarNombreOpl(match[2] ?? "")) !== condicionanteClave) return null;
    return { base: "efecto", estadoSalida: limpiarEstado(match[3] ?? "") };
  }
  return null;
}

function astCondicion(
  linea: LineaOplNormalizada,
  payload: {
    proceso: string;
    condicionante: string;
    condicionanteEstado?: string;
    base: "agente" | "instrumento" | "consumo" | "efecto";
    estadoSalida?: string;
    sinConsecuencia: boolean;
  },
) {
  return {
    ast: {
      kind: "condicion" as const,
      linea: linea.linea,
      proceso: payload.proceso,
      condicionante: payload.condicionante,
      ...(payload.condicionanteEstado ? { condicionanteEstado: payload.condicionanteEstado } : {}),
      base: payload.base,
      ...(payload.estadoSalida ? { estadoSalida: payload.estadoSalida } : {}),
      sinConsecuencia: payload.sinConsecuencia,
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

// SSOT §6: eventos. "X [en `s`] inicia Y[, que <verbo> Z]" emitido por el
// generador cuando enlace tiene `modificador === "evento"`. Sufijo opcional
// de probabilidad se descarta para el match; la planificacion lo ignora.
const PROBABILIDAD_SUFIX_RE = /\s*(?:\(probabilidad:\s*[^)]+\)|Pr\s*=\s*\d+(?:[.,]\d+)?)\s*$/iu;

function parsearEvento(texto: string, linea: LineaOplNormalizada, textoMarcado = texto) {
  const textoSinProb = texto.replace(PROBABILIDAD_SUFIX_RE, "").trim();

  // Forma ET-agente: "X inicia y maneja Y" (sin coma + que).
  let match = /^(.+?)\s+inicia\s+y\s+maneja\s+(.+)$/iu.exec(textoSinProb);
  if (match) {
    const iniciador = normalizarNombreOpl(match[1] ?? "");
    const proceso = normalizarNombreOpl(match[2] ?? "");
    if (!iniciador || !proceso) return null;
    const base: AstProcedimentalBase = { tipoEnlace: "agente", objeto: iniciador, proceso };
    return astEvento(linea, { iniciador, proceso, base });
  }

  // Forma ET-invocacion: "X inicia e invoca Y".
  match = /^(.+?)\s+inicia\s+e\s+invoca\s+(.+)$/iu.exec(textoSinProb);
  if (match) {
    const iniciador = normalizarNombreOpl(match[1] ?? "");
    const destino = normalizarNombreOpl(match[2] ?? "");
    if (!iniciador || !destino) return null;
    const base: AstProcedimentalBase = { tipoEnlace: "invocacion", origen: iniciador, destino };
    return astEvento(linea, { iniciador, proceso: destino, base });
  }

  // Forma ET/ETS/EH/EHS general: "X [en `s`] inicia Y[, que <sub-clausula>]".
  // El estado puede llegar con o sin backticks (`limpiarMarkdown` ya los puede
  // haber eliminado antes); regex tolerante a ambos.
  match = /^(.+?)(?:\s+en\s+`?([^`]+?)`?)?\s+inicia\s+(.+?)(?:,\s*que\s+(.+))?$/iu.exec(textoSinProb);
  if (!match) return null;

  const iniciador = normalizarNombreOpl(match[1] ?? "");
  const iniciadorEstado = match[2] ? limpiarEstado(match[2]) : undefined;
  const proceso = normalizarNombreOpl(match[3] ?? "");
  const subClausula = (match[4] ?? "").trim();

  if (!iniciador || !proceso) return null;

  if (!subClausula) {
    // "X inicia Y" sin sub-clausula → solo evento + invocacion implicita.
    return astEvento(linea, { iniciador, proceso, ...(iniciadorEstado ? { iniciadorEstado } : {}) });
  }

  const subClausulaMarcada = /,\s*que\s+(.+)$/iu.exec(textoMarcado)?.[1]?.trim() ?? subClausula;
  const base = parsearSubClausulaEvento(subClausula, proceso, iniciadorEstado, subClausulaMarcada);
  if (!base) return null;

  return astEvento(linea, {
    iniciador,
    proceso,
    base,
    ...(iniciadorEstado ? { iniciadorEstado } : {}),
  });
}

function parsearSubClausulaEvento(
  sub: string,
  proceso: string,
  iniciadorEstado: string | undefined,
  subMarcada = sub,
): AstProcedimentalBase | null {
  // "consume X [en `s`]" → consumo (origen objeto=X, destino proceso).
  let match = /^consume\s+(.+)$/iu.exec(sub);
  if (match) {
    const objeto = limpiarObjetoConEstado(match[1] ?? "");
    return {
      tipoEnlace: "consumo",
      proceso,
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoEntrada: objeto.estado } : iniciadorEstado ? { estadoEntrada: iniciadorEstado } : {}),
    };
  }

  // "genera Y [en `s`]" → resultado (origen proceso, destino objeto=Y).
  match = /^genera\s+(.+)$/iu.exec(sub);
  if (match) {
    const objeto = limpiarObjetoConEstado(match[1] ?? "");
    return {
      tipoEnlace: "resultado",
      proceso,
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoSalida: objeto.estado } : iniciadorEstado ? { estadoSalida: iniciadorEstado } : {}),
    };
  }

  // "requiere X" → instrumento (objeto requerido, destino proceso).
  match = /^requiere\s+(.+)$/iu.exec(sub);
  if (match) {
    return { tipoEnlace: "instrumento", proceso, objeto: normalizarNombreOpl(match[1] ?? "") };
  }

  // "afecta X" → efecto.
  match = /^afecta\s+(.+)$/iu.exec(sub);
  if (match) {
    return { tipoEnlace: "efecto", proceso, objeto: normalizarNombreOpl(match[1] ?? "") };
  }

  const cambioMarcado = parsearCambioEstadoMarcado(subMarcada);
  if (cambioMarcado) {
    return {
      tipoEnlace: "efecto",
      proceso,
      objeto: cambioMarcado.objeto,
      estadoEntrada: cambioMarcado.estadoEntrada,
      estadoSalida: cambioMarcado.estadoSalida,
    };
  }

  // "cambia X de `s1` a `s2`" → efecto con transicion (ETS2). Backticks
  // opcionales por `limpiarMarkdown`.
  match = /^cambia\s+(.+?)\s+de\s+`?([^`]+?)`?\s+a\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    return {
      tipoEnlace: "efecto",
      proceso,
      objeto: normalizarNombreOpl(match[1] ?? ""),
      estadoEntrada: limpiarEstado(match[2] ?? ""),
      estadoSalida: limpiarEstado(match[3] ?? ""),
    };
  }

  // "cambia X de `s`" → efecto parcial TS4 standalone.
  match = /^cambia\s+(.+?)\s+de\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    return {
      tipoEnlace: "efecto",
      proceso,
      objeto: normalizarNombreOpl(match[1] ?? ""),
      estadoEntrada: limpiarEstado(match[2] ?? ""),
    };
  }

  // "cambia X a `s`" → efecto parcial TS5 standalone.
  match = /^cambia\s+(.+?)\s+a\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    return {
      tipoEnlace: "efecto",
      proceso,
      objeto: normalizarNombreOpl(match[1] ?? ""),
      estadoSalida: limpiarEstado(match[2] ?? ""),
    };
  }

  // "maneja X" → agente (objeto=X, proceso).
  match = /^maneja\s+(.+)$/iu.exec(sub);
  if (match) {
    return { tipoEnlace: "agente", objeto: normalizarNombreOpl(match[1] ?? ""), proceso };
  }

  // "invoca X" → invocacion (origen proceso, destino X).
  match = /^invoca\s+(.+?)(?:\s+despues\s+de\s+.+)?$/iu.exec(sub);
  if (match) {
    return { tipoEnlace: "invocacion", origen: proceso, destino: normalizarNombreOpl(match[1] ?? "") };
  }

  return null;
}

function astEvento(
  linea: LineaOplNormalizada,
  payload: { iniciador: string; iniciadorEstado?: string; proceso: string; base?: AstProcedimentalBase },
) {
  return {
    ast: {
      kind: "evento" as const,
      linea: linea.linea,
      iniciador: payload.iniciador,
      ...(payload.iniciadorEstado ? { iniciadorEstado: payload.iniciadorEstado } : {}),
      proceso: payload.proceso,
      ...(payload.base ? { base: payload.base } : {}),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

function parsearProcedimental(texto: string, linea: LineaOplNormalizada, textoMarcado = texto) {
  let match = /^(.+?) se invoca a s[ií] mismo(?: despu[eé]s de (.+?))?$/iu.exec(texto);
  if (match) {
    const proceso = normalizarNombreOpl(match[1] ?? "");
    const demora = (match[2] ?? "").trim();
    return astProcedimental(linea, {
      tipoEnlace: "invocacion",
      proceso,
      origen: proceso,
      destino: proceso,
      ...(demora ? { demora } : {}),
    });
  }
  // SSOT §12: verbos aceptan variante plural (`consume[n]?`, `genera[n]?`,
  // `maneja[n]?`, `requiere[n]?`, `invoca[n]?`, `afecta[n]?`). El generador
  // pluraliza cuando la multiplicidad del sujeto es pluralizadora (`*`, `>=2`,
  // `*..N`). Mantenemos compat con singular. La cardinalidad PREFIJA de cada
  // extremo se captura via `extraerMultiplicidad`.
  match = /^(.+?) consumen? (.+)$/iu.exec(texto);
  if (match) {
    // En consumo el proceso es destino (sujeto del verbo), el objeto es origen.
    const proceso = extraerMultiplicidadDeNombre(match[1] ?? "");
    const objeto = limpiarObjetoConEstadoConMultiplicidad(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "consumo",
      proceso: proceso.nombre,
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoEntrada: objeto.estado } : {}),
      ...(objeto.multiplicidad ? { multiplicidadOrigen: objeto.multiplicidad } : {}),
      ...(proceso.multiplicidad ? { multiplicidadDestino: proceso.multiplicidad } : {}),
    });
  }
  match = /^(.+?) generan? (.+)$/iu.exec(texto);
  if (match) {
    // En resultado el proceso es origen (sujeto), el objeto es destino.
    const proceso = extraerMultiplicidadDeNombre(match[1] ?? "");
    const objeto = limpiarObjetoConEstadoConMultiplicidad(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "resultado",
      proceso: proceso.nombre,
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoSalida: objeto.estado } : {}),
      ...(proceso.multiplicidad ? { multiplicidadOrigen: proceso.multiplicidad } : {}),
      ...(objeto.multiplicidad ? { multiplicidadDestino: objeto.multiplicidad } : {}),
    });
  }
  match = /^(.+?) afectan? (.+)$/iu.exec(texto);
  if (match) {
    // En efecto el proceso es origen (sujeto), el objeto es destino.
    const proceso = extraerMultiplicidadDeNombre(match[1] ?? "");
    const objeto = extraerMultiplicidadDeNombre(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "efecto",
      proceso: proceso.nombre,
      objeto: objeto.nombre,
      ...(proceso.multiplicidad ? { multiplicidadOrigen: proceso.multiplicidad } : {}),
      ...(objeto.multiplicidad ? { multiplicidadDestino: objeto.multiplicidad } : {}),
    });
  }
  const cambioMarcado = parsearCambioEstadoMarcado(textoMarcado);
  if (cambioMarcado?.proceso) return astProcedimental(linea, { tipoEnlace: "efecto", ...cambioMarcado, proceso: cambioMarcado.proceso });
  match = /^(.+?) cambia (.+?) de (.+?) a (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "efecto", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? ""), estadoEntrada: limpiarEstado(match[3] ?? ""), estadoSalida: limpiarEstado(match[4] ?? "") });
  match = /^(.+?) cambia (.+?) de (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "efecto", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? ""), estadoEntrada: limpiarEstado(match[3] ?? "") });
  match = /^(.+?) cambia (.+?) a (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "efecto", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? ""), estadoSalida: limpiarEstado(match[3] ?? "") });
  match = /^(.+?) manejan? (.+)$/iu.exec(texto);
  if (match) {
    // En agente el objeto es origen (sujeto, ej. "Operador"), proceso es destino.
    // Gramática HS: el sujeto puede calificar estado ("Operador en `disponible`").
    const objeto = limpiarObjetoConEstadoConMultiplicidad(match[1] ?? "");
    const proceso = extraerMultiplicidadDeNombre(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "agente",
      objeto: objeto.nombre,
      proceso: proceso.nombre,
      ...(objeto.estado ? { estadoEntrada: objeto.estado } : {}),
      ...(objeto.multiplicidad ? { multiplicidadOrigen: objeto.multiplicidad } : {}),
      ...(proceso.multiplicidad ? { multiplicidadDestino: proceso.multiplicidad } : {}),
    });
  }
  match = /^(.+?) requieren? (.+)$/iu.exec(texto);
  if (match) {
    // En instrumento el proceso es destino (sujeto), el objeto es origen
    // (complemento, ej. "Procesar requiere Equipo" → Equipo→Procesar).
    // Gramática HS: el complemento puede calificar estado ("Equipo en `calibrado`").
    const proceso = extraerMultiplicidadDeNombre(match[1] ?? "");
    const objeto = limpiarObjetoConEstadoConMultiplicidad(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "instrumento",
      proceso: proceso.nombre,
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoEntrada: objeto.estado } : {}),
      ...(objeto.multiplicidad ? { multiplicidadOrigen: objeto.multiplicidad } : {}),
      ...(proceso.multiplicidad ? { multiplicidadDestino: proceso.multiplicidad } : {}),
    });
  }
  match = /^(.+?) invocan? (.+?)(?: despu[eé]s de (.+?))?$/iu.exec(texto);
  if (match) {
    const origen = extraerMultiplicidadDeNombre(match[1] ?? "");
    const destino = extraerMultiplicidadDeNombre(match[2] ?? "");
    const demora = (match[3] ?? "").trim();
    return astProcedimental(linea, {
      tipoEnlace: "invocacion",
      origen: origen.nombre,
      destino: destino.nombre,
      ...(origen.multiplicidad ? { multiplicidadOrigen: origen.multiplicidad } : {}),
      ...(destino.multiplicidad ? { multiplicidadDestino: destino.multiplicidad } : {}),
      ...(demora ? { demora } : {}),
    });
  }
  return null;
}

/**
 * Variante de `limpiarObjetoConEstado` que tambien extrae multiplicidad
 * prefija del nombre antes de normalizarlo. Util para `consume`/`genera`
 * donde el objeto puede venir como `1..N Recursos` o `* Veces en \`s\``.
 *
 * Estrategia: separar primero por " en <estado>" (post-markdown), luego
 * aplicar `extraerMultiplicidadDeNombre` al lado izquierdo. El estado va
 * por `limpiarEstado` que ya descarta parentesis.
 */
function parsearEstructural(texto: string, linea: LineaOplNormalizada) {
  let match = /^(.+?) consta(?:n)? de (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "agregacion", match[1] ?? "", match[2] ?? "");
  match = /^(.+?) exhibe(?:n)? (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "exhibicion", match[1] ?? "", match[2] ?? "");
  match = /^(.+?) tiene un (.+?) opcional$/iu.exec(texto);
  if (match) return astEstructural(linea, "exhibicion", match[1] ?? "", match[2] ?? "", "0..1");
  match = /^(.+?) tiene (.+?) opcionales$/iu.exec(texto);
  if (match) return astEstructural(linea, "exhibicion", match[1] ?? "", match[2] ?? "", "0..1");
  match = /^(.+?) es un (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "generalizacion", match[2] ?? "", match[1] ?? "");
  match = /^(.+?) son (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "generalizacion", match[2] ?? "", match[1] ?? "");
  match = /^(.+?) es una instancia de (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "clasificacion", match[2] ?? "", match[1] ?? "");
  match = /^(.+?) son instancias de (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "clasificacion", match[2] ?? "", match[1] ?? "");
  return null;
}

// Tras `limpiarMarkdown` los backticks ya no aparecen en el texto normalizado,
// pero el parser tambien se invoca con strings crudos en tests; tolerar ambos.
// El generador emite `Default`/`Current` capitalizados (SSOT OPL-ES D9-D10);
// aceptamos tambien las formas espanolas `por defecto`/`actual` por amistad
// con dictado humano.
const DESIGNACION_ESTADO_RE = /^(.+?)\s+en\s+`?([^`]+?)`?\s+es\s+(inicial|final|default|current|por defecto|actual)\.?\s*$/iu;
const DESIGNACION_ESTADO_CANONICA_RE = /^Estado\s+`?([^`]+?)`?\s+de\s+(.+?)\s+es\s+(inicial|final|default|current|por defecto|actual)\.?\s*$/iu;

function parsearDesignacionEstado(texto: string, linea: LineaOplNormalizada) {
  const canonica = DESIGNACION_ESTADO_CANONICA_RE.exec(texto);
  const legacy = canonica ? null : DESIGNACION_ESTADO_RE.exec(texto);
  const match = canonica ?? legacy;
  if (!match) return null;
  const designacion = normalizarDesignacion(match[3] ?? "");
  if (!designacion) return null;
  const estado = canonica ? match[1] : match[2];
  const entidad = canonica ? match[2] : match[1];
  return {
    ast: {
      kind: "designacion-estado" as const,
      linea: linea.linea,
      entidad: normalizarNombreOpl(entidad ?? ""),
      estado: limpiarEstado(estado ?? ""),
      designacion,
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

function normalizarDesignacion(raw: string): DesignacionEstado | null {
  const lower = raw.trim().toLocaleLowerCase("es");
  if (lower === "inicial") return "inicial";
  if (lower === "final") return "final";
  if (lower === "default" || lower === "por defecto") return "default";
  if (lower === "current" || lower === "actual") return "current";
  return null;
}

// Plegado parcial §10.5: refleja vista, no muta hechos del modelo.
// Formato canonico del generador `oracionPlegadoParcial`:
// `X se lista con A, B y C y N (partes|rasgos) más como rasgos.`
const PLEGADO_PARCIAL_RE = /^(.+?)\s+se\s+lista\s+con\s+(.+?)\s+y\s+(\d+)\s+(?:partes|rasgos)\s+(?:más|mas)\s+como\s+(partes|rasgos)\.?\s*$/iu;

function parsearPlegadoParcial(texto: string, linea: LineaOplNormalizada) {
  const match = PLEGADO_PARCIAL_RE.exec(texto);
  if (!match) return null;
  const rol = ((match[4] ?? "").toLocaleLowerCase("es") === "partes" ? "partes" : "rasgos") as
    | "partes"
    | "rasgos";
  const partesElididas = Number.parseInt(match[3] ?? "0", 10);
  const partesExplicitas = dividirLista(match[2] ?? "", "y")
    .map(normalizarNombreOpl)
    .filter(Boolean);
  return {
    ast: {
      kind: "plegado-parcial" as const,
      linea: linea.linea,
      entidad: normalizarNombreOpl(match[1] ?? ""),
      partesExplicitas,
      partesElididas,
      rol,
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [{
      codigo: "unsupported-kernel" as const,
      severidad: "info" as const,
      linea: linea.linea,
      columna: 1,
      mensaje: "El plegado parcial se reconoce como informacional: refleja vista, no muta hechos del modelo.",
      sugerencia: "Cambia el modo de plegado desde el canvas para alterar la vista.",
    }],
  };
}

function parsearMetadata(texto: string, linea: LineaOplNormalizada) {
  let match = /^(.+?) tiene unidad (.+)$/iu.exec(texto);
  if (match) return astMetadata(linea, match[1] ?? "", "unidad", limpiarEstado(match[2] ?? ""));
  match = /^(.+?) se describe como "(.+)"$/iu.exec(texto);
  if (match) return astMetadata(linea, match[1] ?? "", "descripcion", match[2] ?? "");
  match = /^(.+?) es (.+)$/iu.exec(texto);
  if (match) return astMetadata(linea, match[1] ?? "", "valor", match[2] ?? "");
  return null;
}

function parsearContexto(texto: string, linea: LineaOplNormalizada) {
  const match = /^(.+?) (se descompone en|se despliega en|se pliega en)(?: (.+))?$/iu.exec(texto);
  if (!match) return null;
  const frase = (match[2] ?? "").toLocaleLowerCase("es");
  const familia: Extract<OracionOplAst, { kind: "contexto" }>["familia"] =
    frase.includes("descompone") ? "descomposicion" : frase.includes("despliega") ? "despliegue" : "plegado";
  if (familia !== "plegado") {
    // Fase 1·U4: en descomposición, parsear el orden temporal declarado de la
    // cola («paralelo A, B y C, D, en esa secuencia») a bandas de nombres.
    const orden = familia === "descomposicion" ? parsearOrdenDescomposicion(match[3] ?? "") : undefined;
    return {
      ast: {
        kind: "contexto" as const, linea: linea.linea, familia, sujeto: normalizarNombreOpl(match[1] ?? ""),
        ...(orden ? { bandasNombres: orden.bandas, ordenTemporalTexto: orden.texto } : {}),
        ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
      },
      diagnosticos: [],
    };
  }
  return {
    ast: { kind: "contexto" as const, linea: linea.linea, familia, sujeto: normalizarNombreOpl(match[1] ?? ""), ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}) },
    diagnosticos: [{
      codigo: "unsupported-kernel" as const,
      severidad: "warning" as const,
      linea: linea.linea,
      columna: 1,
      mensaje: "La oracion de contexto se parsea, pero este corte no aplica refinamientos desde OPL libre.",
      sugerencia: "Usa inzoom/unfold desde el canvas; OPL reverse no borra ni crea refinamientos por ausencia.",
    }],
  };
}

function astProcedimental(linea: LineaOplNormalizada, ast: Omit<Extract<OracionOplAst, { kind: "procedimental" }>, "kind" | "linea" | "etiqueta">) {
  return { ast: { kind: "procedimental" as const, linea: linea.linea, ...ast, ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}) }, diagnosticos: [] };
}

function astEstructural(
  linea: LineaOplNormalizada,
  tipoEnlace: Extract<OracionOplAst, { kind: "estructural" }>["tipoEnlace"],
  origen: string,
  destinos: string,
  multiplicidadDestino?: string,
) {
  return {
    ast: {
      kind: "estructural" as const,
      linea: linea.linea,
      tipoEnlace,
      origen: normalizarNombreOpl(origen),
      destinos: dividirLista(destinos, "y").map(normalizarNombreOpl).filter(Boolean),
      ...(multiplicidadDestino ? { multiplicidadDestino } : {}),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

function astMetadata(linea: LineaOplNormalizada, sujeto: string, campo: Extract<OracionOplAst, { kind: "metadata" }>["campo"], valor: string) {
  return { ast: { kind: "metadata" as const, linea: linea.linea, sujeto: normalizarNombreOpl(sujeto), campo, valor, ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}) }, diagnosticos: [] };
}

/**
 * Fase 1·U4 — parsea la cola de una oración de descomposición a bandas de orden
 * (espejo del forward `describirProcesosTemporales`). Devuelve `undefined` cuando
 * NO hay orden declarado (enumeración legacy sin «paralelo» ni «en esa secuencia»):
 * en ese caso el reverse no toca `ordenInzoom`.
 *
 * Pasos: 1) retirar la cola «, así como <objetos>» (los objetos no son del
 * orden); 2) detectar/retirar el marcador «en esa secuencia»; 3) si hay orden
 * (secuencia o «paralelo»), tokenizar a bandas con `parsearBandasOrden`.
 */
function parsearOrdenDescomposicion(resto: string): { bandas: string[][]; texto: string } | undefined {
  // La cola de objetos «, así como …» va SIEMPRE al final (tras la secuencia).
  let temporal = resto.replace(/,?\s*as[ií]\s+como\s+.+$/iu, "").trim();
  const tieneSecuencia = /,?\s*en\s+esa\s+secuencia$/iu.test(temporal);
  temporal = temporal.replace(/,?\s*en\s+esa\s+secuencia$/iu, "").trim();
  const tieneParalelo = /\bparalelo\b/iu.test(temporal);
  if (!temporal || (!tieneSecuencia && !tieneParalelo)) return undefined;
  return { bandas: parsearBandasOrden(temporal), texto: temporal };
}

/**
 * Tokeniza el texto temporal en bandas. El token «y» tiene doble rol: dentro de
 * un grupo `paralelo` marca el último nombre de la banda (listarOpl emite UN solo
 * «y», antes del nombre final); fuera, «,»/«y» separan bandas de la secuencia.
 * Desambiguación dirigida por el marcador `paralelo`: una banda paralela siempre
 * lo lleva y termina en su primer nombre unido por «y»; un singleton consume un
 * único token. La gramática es inequívoca porque el forward es determinista.
 */
function parsearBandasOrden(temporal: string): string[][] {
  // Partir en tokens registrando el separador que PRECEDE a cada uno.
  const tokens: Array<{ sep: "inicio" | "coma" | "y"; texto: string }> = [];
  const sepRe = /\s*,\s*|\s+y\s+/iu;
  let resto = temporal.trim();
  let sep: "inicio" | "coma" | "y" = "inicio";
  for (;;) {
    const m = sepRe.exec(resto);
    if (!m) {
      if (resto.trim()) tokens.push({ sep, texto: resto.trim() });
      break;
    }
    tokens.push({ sep, texto: resto.slice(0, m.index).trim() });
    sep = m[0].includes(",") ? "coma" : "y";
    resto = resto.slice(m.index + m[0].length);
  }

  const bandas: string[][] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i]!;
    const esParalelo = /^paralelo\s+/iu.test(token.texto);
    if (esParalelo) {
      const nombres = [normalizarNombreOpl(token.texto.replace(/^paralelo\s+/iu, ""))];
      i += 1;
      // listarOpl: nombres unidos por «, » y el último por « y ». Consumimos los
      // unidos por coma; el primer token unido por «y» es el nombre final.
      while (i < tokens.length && tokens[i]!.sep === "coma") {
        nombres.push(normalizarNombreOpl(tokens[i]!.texto));
        i += 1;
      }
      if (i < tokens.length && tokens[i]!.sep === "y") {
        nombres.push(normalizarNombreOpl(tokens[i]!.texto));
        i += 1;
      }
      bandas.push(nombres.filter(Boolean));
    } else {
      bandas.push([normalizarNombreOpl(token.texto)].filter(Boolean));
      i += 1;
    }
  }
  return bandas.filter((banda) => banda.length > 0);
}

function parsearEsencia(texto: string): Esencia {
  return /^f/i.test(texto.normalize("NFD").replace(/\p{Diacritic}/gu, "")) ? "fisica" : "informacional";
}

function parsearAfiliacion(texto: string): Afiliacion {
  return /^s/i.test(texto.normalize("NFD").replace(/\p{Diacritic}/gu, "")) ? "sistemica" : "ambiental";
}

function errorSintaxis(linea: number, mensaje: string): DiagnosticoOpl {
  return { codigo: "syntax-error", severidad: "error", linea, columna: 1, mensaje };
}
