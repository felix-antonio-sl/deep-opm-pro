import type { Afiliacion, DesignacionEstado, Esencia, TipoEntidad } from "../../modelo/tipos";
import type { AstProcedimentalBase, DiagnosticoOpl, LineaOplNormalizada, OracionOplAst, ParseResultOpl } from "./tipos";

const PUNTO_FINAL = /\.\s*$/;
const ETIQUETA_SUFIX = /\s*\[etiqueta:\s*([^\]]+)\]\s*$/i;

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
    const parsed = parsearOracion(textoSinPunto, linea);
    ast.push(parsed.ast);
    diagnosticos.push(...parsed.diagnosticos);
  }

  return { ast, diagnosticos, lineas };
}

export function normalizarLineas(texto: string): LineaOplNormalizada[] {
  return texto
    .split(/\r?\n/)
    .map((original, index) => normalizarLinea(original, index + 1))
    .filter((linea): linea is LineaOplNormalizada => linea !== null);
}

export function normalizarNombreOpl(raw: string): string {
  return limpiarMarkdown(raw)
    .replace(/^\s*(?:\d+(?:\.\.(?:\d+|N))?|\*)\s+/i, "")
    .replace(/\s+\[[^\]\r\n]+\]/g, "")
    .replace(/\s+\{[^}\r\n]+\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function claveNombre(raw: string): string {
  return normalizarNombreOpl(raw)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es");
}

function normalizarLinea(original: string, linea: number): LineaOplNormalizada | null {
  const sinNumeracion = original.replace(/^\s*(?:\d+(?:\.\d+)*[.)]|[-•])\s+/, "").trim();
  if (!sinNumeracion) return null;
  const etiquetaMatch = ETIQUETA_SUFIX.exec(sinNumeracion);
  const etiqueta = etiquetaMatch?.[1]?.trim();
  const sinEtiqueta = etiqueta ? sinNumeracion.slice(0, etiquetaMatch!.index).trim() : sinNumeracion;
  return {
    linea,
    original,
    texto: limpiarMarkdown(sinEtiqueta).trim(),
    ...(etiqueta ? { etiqueta } : {}),
  };
}

function limpiarMarkdown(texto: string): string {
  return texto
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\s][^*\n]*?)\*/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1");
}

function parsearOracion(texto: string, linea: LineaOplNormalizada): { ast: OracionOplAst; diagnosticos: DiagnosticoOpl[] } {
  return parsearDescripcion(texto, linea)
    ?? parsearEstados(texto, linea)
    ?? parsearEvento(texto, linea)
    ?? parsearExcepcion(texto, linea)
    ?? parsearCondicion(texto, linea)
    ?? parsearProcedimental(texto, linea)
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

function parsearEstados(texto: string, linea: LineaOplNormalizada) {
  const match = /^(.+?) puede (?:ser|estar) (.+)$/iu.exec(texto);
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

function parsearExcepcion(texto: string, linea: LineaOplNormalizada) {
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
  payload: { proceso: string; fuente: string; limite: { tipo: "max" | "min"; valor: string; unidad: string } },
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

function parsearCondicion(texto: string, linea: LineaOplNormalizada) {
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

  const base = clasificarSubClausulaCondicion(subClausula, proceso, condicionante);
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
// "(probabilidad: NN%)" se descarta para el match; la planificacion lo ignora.
const PROBABILIDAD_SUFIX_RE = /\s*\(probabilidad:\s*[^)]+\)\s*$/iu;

function parsearEvento(texto: string, linea: LineaOplNormalizada) {
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

  const base = parsearSubClausulaEvento(subClausula, proceso, iniciadorEstado);
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

  // "cambia X de `s`" → consumo de estado.
  match = /^cambia\s+(.+?)\s+de\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    return {
      tipoEnlace: "consumo",
      proceso,
      objeto: normalizarNombreOpl(match[1] ?? ""),
      estadoEntrada: limpiarEstado(match[2] ?? ""),
    };
  }

  // "cambia X a `s`" → resultado a estado.
  match = /^cambia\s+(.+?)\s+a\s+`?([^`]+?)`?$/iu.exec(sub);
  if (match) {
    return {
      tipoEnlace: "resultado",
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

function parsearProcedimental(texto: string, linea: LineaOplNormalizada) {
  let match = /^(.+?) se invoca a s[ií] mismo(?: despues de .+)?$/iu.exec(texto);
  if (match) {
    const proceso = normalizarNombreOpl(match[1] ?? "");
    return astProcedimental(linea, { tipoEnlace: "invocacion", proceso, origen: proceso, destino: proceso });
  }
  match = /^(.+?) consume (.+)$/iu.exec(texto);
  if (match) {
    const objeto = limpiarObjetoConEstado(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "consumo",
      proceso: normalizarNombreOpl(match[1] ?? ""),
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoEntrada: objeto.estado } : {}),
    });
  }
  match = /^(.+?) genera (.+)$/iu.exec(texto);
  if (match) {
    const objeto = limpiarObjetoConEstado(match[2] ?? "");
    return astProcedimental(linea, {
      tipoEnlace: "resultado",
      proceso: normalizarNombreOpl(match[1] ?? ""),
      objeto: objeto.nombre,
      ...(objeto.estado ? { estadoSalida: objeto.estado } : {}),
    });
  }
  match = /^(.+?) afecta (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "efecto", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? "") });
  match = /^(.+?) cambia (.+?) de (.+?) a (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "efecto", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? ""), estadoEntrada: limpiarEstado(match[3] ?? ""), estadoSalida: limpiarEstado(match[4] ?? "") });
  match = /^(.+?) cambia (.+?) de (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "consumo", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? ""), estadoEntrada: limpiarEstado(match[3] ?? "") });
  match = /^(.+?) cambia (.+?) a (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "resultado", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? ""), estadoSalida: limpiarEstado(match[3] ?? "") });
  match = /^(.+?) maneja (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "agente", objeto: normalizarNombreOpl(match[1] ?? ""), proceso: normalizarNombreOpl(match[2] ?? "") });
  match = /^(.+?) requiere (.+)$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "instrumento", proceso: normalizarNombreOpl(match[1] ?? ""), objeto: normalizarNombreOpl(match[2] ?? "") });
  match = /^(.+?) invoca (.+?)(?: despues de .+)?$/iu.exec(texto);
  if (match) return astProcedimental(linea, { tipoEnlace: "invocacion", origen: normalizarNombreOpl(match[1] ?? ""), destino: normalizarNombreOpl(match[2] ?? "") });
  return null;
}

function parsearEstructural(texto: string, linea: LineaOplNormalizada) {
  let match = /^(.+?) consta(?:n)? de (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "agregacion", match[1] ?? "", match[2] ?? "");
  match = /^(.+?) exhibe(?:n)? (.+)$/iu.exec(texto);
  if (match) return astEstructural(linea, "exhibicion", match[1] ?? "", match[2] ?? "");
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

function parsearDesignacionEstado(texto: string, linea: LineaOplNormalizada) {
  const match = DESIGNACION_ESTADO_RE.exec(texto);
  if (!match) return null;
  const designacion = normalizarDesignacion(match[3] ?? "");
  if (!designacion) return null;
  return {
    ast: {
      kind: "designacion-estado" as const,
      linea: linea.linea,
      entidad: normalizarNombreOpl(match[1] ?? ""),
      estado: limpiarEstado(match[2] ?? ""),
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
  const match = /^(.+?) (se descompone en|se despliega en|se pliega en)(?: .+)?$/iu.exec(texto);
  if (!match) return null;
  const frase = (match[2] ?? "").toLocaleLowerCase("es");
  const familia: Extract<OracionOplAst, { kind: "contexto" }>["familia"] =
    frase.includes("descompone") ? "descomposicion" : frase.includes("despliega") ? "despliegue" : "plegado";
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

function astEstructural(linea: LineaOplNormalizada, tipoEnlace: Extract<OracionOplAst, { kind: "estructural" }>["tipoEnlace"], origen: string, destinos: string) {
  return {
    ast: {
      kind: "estructural" as const,
      linea: linea.linea,
      tipoEnlace,
      origen: normalizarNombreOpl(origen),
      destinos: dividirLista(destinos, "y").map(normalizarNombreOpl).filter(Boolean),
      ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}),
    },
    diagnosticos: [],
  };
}

function astMetadata(linea: LineaOplNormalizada, sujeto: string, campo: Extract<OracionOplAst, { kind: "metadata" }>["campo"], valor: string) {
  return { ast: { kind: "metadata" as const, linea: linea.linea, sujeto: normalizarNombreOpl(sujeto), campo, valor, ...(linea.etiqueta ? { etiqueta: linea.etiqueta } : {}) }, diagnosticos: [] };
}

function dividirLista(texto: string, conjuncion: "y" | "o"): string[] {
  const re = conjuncion === "y" ? /\s+y\s+/iu : /\s+o\s+/iu;
  return texto.split(",").flatMap((parte) => parte.split(re)).map((item) => item.trim()).filter(Boolean);
}

function limpiarEstado(texto: string): string {
  return texto.replace(/\([^)]*\)/g, "").replace(/\.$/, "").trim();
}

function limpiarObjetoConEstado(texto: string): { nombre: string; estado?: string } {
  const match = /^(.+?) en (.+)$/iu.exec(texto.trim());
  if (!match) return { nombre: normalizarNombreOpl(texto) };
  return { nombre: normalizarNombreOpl(match[1] ?? ""), estado: limpiarEstado(match[2] ?? "") };
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
