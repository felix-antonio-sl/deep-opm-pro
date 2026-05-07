import type { Afiliacion, Esencia, TipoEntidad } from "../../modelo/tipos";
import type { DiagnosticoOpl, LineaOplNormalizada, OracionOplAst, ParseResultOpl } from "./tipos";

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
    ?? parsearProcedimental(texto, linea)
    ?? parsearEstructural(texto, linea)
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
