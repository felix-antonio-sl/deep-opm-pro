import { entidadIdDeExtremo, extremoEntidad } from "../../modelo/extremos";
import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Enlace, Entidad, Id, Modelo, TipoEnlace, TipoEntidad } from "../../modelo/tipos";
import { ordenarOpdsParaOpl } from "../bloquesJerarquicos";
import { generarOplInteractivo } from "../generar";
import type { OplLineaInteractiva, OplReferencia } from "../interaccion";
import { claveNombre, parsearParrafoOpl } from "./parsear";
import type {
  DiagnosticoOpl,
  OracionOplAst,
  PatchOplPropuesto,
  PrevisualizacionOplReverse,
  ReferenciaEntidadPatch,
} from "./tipos";

export function planificarEdicionOplLibre(
  modelo: Modelo,
  texto: string,
  opts: { opdActivoId?: Id } = {},
): PrevisualizacionOplReverse {
  const parse = parsearParrafoOpl(texto);
  const diagnosticos = [...parse.diagnosticos];
  const patches: PatchOplPropuesto[] = [];
  const lineasActuales = ordenarOpdsParaOpl(modelo).flatMap((opdId) => generarOplInteractivo(modelo, opdId));
  const registry = new PatchRegistry(patches, diagnosticos);

  for (const ast of parse.ast) {
    const anterior = lineasActuales[ast.linea - 1] ?? null;
    planificarAst(modelo, ast, anterior, registry, opts.opdActivoId ?? modelo.opdRaizId);
  }

  if (parse.ast.length < lineasActuales.length) {
    diagnosticos.push({
      codigo: "no-delete-by-absence",
      severidad: "info",
      linea: parse.ast.length + 1,
      columna: 1,
      mensaje: "Las lineas ausentes no borran hechos del modelo en modo OPL reverse seguro.",
      sugerencia: "Elimina desde canvas o usa una accion destructiva explicita cuando exista.",
    });
  }

  return { ast: parse.ast, diagnosticos, patches };
}

function planificarAst(
  modelo: Modelo,
  ast: OracionOplAst,
  anterior: OplLineaInteractiva | null,
  registry: PatchRegistry,
  opdActivoId: Id,
): void {
  switch (ast.kind) {
    case "descripcion-cosa":
      return planificarDescripcion(modelo, ast, anterior, registry);
    case "estados":
      return planificarEstados(modelo, ast, anterior, registry);
    case "procedimental":
      return planificarProcedimental(modelo, ast, registry, opdActivoId);
    case "estructural":
      return planificarEstructural(modelo, ast, registry, opdActivoId);
    case "metadata":
      registry.diagnostico({
        codigo: "unsupported-kernel",
        severidad: "warning",
        linea: ast.linea,
        columna: 1,
        mensaje: `La metadata OPL '${ast.campo}' se parsea, pero este corte no la aplica desde texto libre.`,
      });
      return;
    case "contexto":
    case "unsupported":
      return;
  }
}

function planificarDescripcion(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "descripcion-cosa" }>,
  anterior: OplLineaInteractiva | null,
  registry: PatchRegistry,
): void {
  const actual = resolverEntidad(modelo, ast.nombre, ast.tipoEntidad, ast.linea, registry, { silenciosoSiNoExiste: true });
  const refAnterior = refEntidadUnica(anterior);
  const entidad = actual ?? (refAnterior && entidadCompatible(modelo.entidades[refAnterior.id], ast.tipoEntidad) ? modelo.entidades[refAnterior.id] : null);

  if (!entidad) {
    registry.add({ tipo: "crear-entidad", linea: ast.linea, nombre: ast.nombre, entidadTipo: ast.tipoEntidad, esencia: ast.esencia, afiliacion: ast.afiliacion });
    return;
  }

  if (claveNombre(entidad.nombre) !== claveNombre(ast.nombre)) {
    const colision = resolverEntidad(modelo, ast.nombre, ast.tipoEntidad, ast.linea, registry, { silenciosoSiNoExiste: true });
    if (colision && colision.id !== entidad.id) {
      registry.diagnostico({
        codigo: "ambiguous-symbol",
        severidad: "error",
        linea: ast.linea,
        columna: 1,
        mensaje: `No se puede renombrar '${entidad.nombre}' a '${ast.nombre}' porque ya existe otra cosa con ese nombre.`,
      });
    } else {
      registry.add({ tipo: "renombrar-entidad", linea: ast.linea, entidadId: entidad.id, anterior: entidad.nombre, siguiente: ast.nombre });
    }
  }

  if (entidad.esencia !== ast.esencia) registry.add({ tipo: "cambiar-esencia", linea: ast.linea, entidadId: entidad.id, anterior: entidad.esencia, siguiente: ast.esencia });
  if (entidad.afiliacion !== ast.afiliacion) registry.add({ tipo: "cambiar-afiliacion", linea: ast.linea, entidadId: entidad.id, anterior: entidad.afiliacion, siguiente: ast.afiliacion });
}

function planificarEstados(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "estados" }>,
  anterior: OplLineaInteractiva | null,
  registry: PatchRegistry,
): void {
  const entidad = resolverEntidad(modelo, ast.objeto, "objeto", ast.linea, registry, { silenciosoSiNoExiste: true })
    ?? entidadDeRefAnterior(modelo, anterior, "objeto");
  if (!entidad) {
    registry.diagnostico({
      codigo: "unknown-symbol",
      severidad: "error",
      linea: ast.linea,
      columna: 1,
      mensaje: `No existe el objeto '${ast.objeto}' para sincronizar estados.`,
    });
    return;
  }
  if (ast.estados.length < 2) {
    registry.diagnostico({
      codigo: "syntax-error",
      severidad: "error",
      linea: ast.linea,
      columna: 1,
      mensaje: "Un objeto con estados necesita al menos dos estados en OPM.",
    });
    return;
  }

  const actuales = estadosDeEntidad(modelo, entidad.id);
  const refsEstado = anterior?.refs.filter((ref) => ref.tipo === "estado") ?? [];
  if (actuales.length === 0 || ast.estados.length > actuales.length) {
    registry.add({ tipo: "sincronizar-estados", linea: ast.linea, objetoId: entidad.id, nombres: ast.estados });
    return;
  }

  ast.estados.forEach((nombre, index) => {
    const estadoId = refsEstado[index]?.id ?? actuales[index]?.id;
    const estado = estadoId ? modelo.estados[estadoId] : undefined;
    if (estado && claveNombre(estado.nombre) !== claveNombre(nombre)) {
      registry.add({ tipo: "renombrar-estado", linea: ast.linea, estadoId: estado.id, anterior: estado.nombre, siguiente: nombre });
    }
  });
}

function planificarProcedimental(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "procedimental" }>,
  registry: PatchRegistry,
  _opdActivoId: Id,
): void {
  const endpoints = endpointsProcedimentales(modelo, ast, registry);
  if (!endpoints) return;
  planificarEnlace(modelo, ast.linea, ast.tipoEnlace, endpoints.origen, endpoints.destino, ast.etiqueta, registry);
}

function planificarEstructural(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "estructural" }>,
  registry: PatchRegistry,
  _opdActivoId: Id,
): void {
  for (const destino of ast.destinos) {
    const origen = refEntidadPorNombre(modelo, ast.origen, undefined, ast.linea, registry);
    const destinoRef = refEntidadPorNombre(modelo, destino, undefined, ast.linea, registry);
    if (!origen || !destinoRef) continue;
    planificarEnlace(modelo, ast.linea, ast.tipoEnlace, origen, destinoRef, ast.etiqueta, registry);
  }
}

function endpointsProcedimentales(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "procedimental" }>,
  registry: PatchRegistry,
): { origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch } | null {
  switch (ast.tipoEnlace) {
    case "agente": {
      const objeto = refEntidadPorNombre(modelo, ast.objeto ?? "", "objeto", ast.linea, registry);
      const proceso = refEntidadPorNombre(modelo, ast.proceso ?? "", "proceso", ast.linea, registry);
      return objeto && proceso ? { origen: objeto, destino: proceso } : null;
    }
    case "instrumento": {
      const objeto = refEntidadPorNombre(modelo, ast.objeto ?? "", "objeto", ast.linea, registry);
      const proceso = refEntidadPorNombre(modelo, ast.proceso ?? "", "proceso", ast.linea, registry);
      return objeto && proceso ? { origen: objeto, destino: proceso } : null;
    }
    case "consumo": {
      const objeto = refEntidadPorNombre(modelo, ast.objeto ?? "", "objeto", ast.linea, registry);
      const proceso = refEntidadPorNombre(modelo, ast.proceso ?? "", "proceso", ast.linea, registry);
      return objeto && proceso ? { origen: objeto, destino: proceso } : null;
    }
    case "resultado":
    case "efecto": {
      const proceso = refEntidadPorNombre(modelo, ast.proceso ?? "", "proceso", ast.linea, registry);
      const objeto = refEntidadPorNombre(modelo, ast.objeto ?? "", "objeto", ast.linea, registry);
      return proceso && objeto ? { origen: proceso, destino: objeto } : null;
    }
    case "invocacion": {
      const origen = refEntidadPorNombre(modelo, ast.origen ?? ast.proceso ?? "", "proceso", ast.linea, registry);
      const destino = refEntidadPorNombre(modelo, ast.destino ?? ast.proceso ?? "", "proceso", ast.linea, registry);
      return origen && destino ? { origen, destino } : null;
    }
  }
}

function planificarEnlace(
  modelo: Modelo,
  linea: number,
  tipoEnlace: TipoEnlace,
  origen: ReferenciaEntidadPatch,
  destino: ReferenciaEntidadPatch,
  etiqueta: string | undefined,
  registry: PatchRegistry,
): void {
  const origenId = resolverRefId(modelo, origen);
  const destinoId = resolverRefId(modelo, destino);
  const existente = origenId && destinoId ? buscarEnlace(modelo, tipoEnlace, origenId, destinoId) : null;
  if (!existente) {
    registry.add({ tipo: "crear-enlace", linea, tipoEnlace, origen, destino, ...(etiqueta ? { etiqueta } : {}) });
    return;
  }
  const etiquetaActual = existente.etiqueta.trim();
  const etiquetaNueva = etiqueta?.trim() ?? "";
  if (etiquetaActual !== etiquetaNueva) {
    registry.add({ tipo: "fijar-etiqueta-enlace", linea, enlaceId: existente.id, anterior: etiquetaActual, siguiente: etiquetaNueva });
  }
}

function refEntidadPorNombre(
  modelo: Modelo,
  nombre: string,
  entidadTipo: TipoEntidad | undefined,
  linea: number,
  registry: PatchRegistry,
): ReferenciaEntidadPatch | null {
  const entidad = resolverEntidad(modelo, nombre, entidadTipo, linea, registry, { silenciosoSiNoExiste: true });
  if (entidad) return { tipo: "id", id: entidad.id };
  registry.diagnostico({
    codigo: "unknown-symbol",
    severidad: "error",
    linea,
    columna: 1,
    mensaje: `No existe la cosa '${nombre}' requerida por la oracion OPL.`,
    sugerencia: "Declara primero la cosa con una oracion 'Nombre es un objeto/proceso ...'.",
  });
  return null;
}

function resolverEntidad(
  modelo: Modelo,
  nombre: string,
  tipo: TipoEntidad | undefined,
  linea: number,
  registry: PatchRegistry,
  opts: { silenciosoSiNoExiste?: boolean } = {},
): Entidad | null {
  const clave = claveNombre(nombre);
  const candidatos = Object.values(modelo.entidades).filter((entidad) =>
    claveNombre(entidad.nombre) === clave && (tipo === undefined || entidad.tipo === tipo)
  );
  if (candidatos.length === 1) return candidatos[0]!;
  if (candidatos.length > 1) {
    registry.diagnostico({
      codigo: "ambiguous-symbol",
      severidad: "error",
      linea,
      columna: 1,
      mensaje: `El nombre '${nombre}' es ambiguo (${candidatos.length} candidatos).`,
    });
  } else if (!opts.silenciosoSiNoExiste) {
    registry.diagnostico({ codigo: "unknown-symbol", severidad: "error", linea, columna: 1, mensaje: `No existe '${nombre}'.` });
  }
  return null;
}

function entidadDeRefAnterior(modelo: Modelo, linea: OplLineaInteractiva | null, tipo: TipoEntidad): Entidad | null {
  const ref = refEntidadUnica(linea);
  const entidad = ref ? modelo.entidades[ref.id] : undefined;
  return entidadCompatible(entidad, tipo) ? entidad : null;
}

function refEntidadUnica(linea: OplLineaInteractiva | null): Extract<OplReferencia, { tipo: "entidad" }> | null {
  const refs = linea?.refs.filter((ref): ref is Extract<OplReferencia, { tipo: "entidad" }> => ref.tipo === "entidad") ?? [];
  return refs.length === 1 ? refs[0]! : null;
}

function entidadCompatible(entidad: Entidad | undefined, tipo: TipoEntidad): entidad is Entidad {
  return !!entidad && entidad.tipo === tipo;
}

function buscarEnlace(modelo: Modelo, tipo: TipoEnlace, origenId: Id, destinoId: Id): Enlace | null {
  return Object.values(modelo.enlaces).find((enlace) => {
    if (enlace.tipo !== tipo) return false;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    return origen === origenId && destino === destinoId;
  }) ?? null;
}

function resolverRefId(modelo: Modelo, ref: ReferenciaEntidadPatch): Id | null {
  if (ref.tipo === "id") return ref.id;
  const clave = claveNombre(ref.nombre);
  return Object.values(modelo.entidades).find((entidad) =>
    claveNombre(entidad.nombre) === clave && (ref.entidadTipo === undefined || entidad.tipo === ref.entidadTipo)
  )?.id ?? null;
}

class PatchRegistry {
  private keys = new Map<string, PatchOplPropuesto>();

  constructor(private readonly patches: PatchOplPropuesto[], private readonly diagnosticos: DiagnosticoOpl[]) {}

  add(patch: PatchOplPropuesto): void {
    const key = patchKey(patch);
    const previo = this.keys.get(key);
    if (previo) {
      if (JSON.stringify(previo) !== JSON.stringify(patch)) {
        this.diagnostico({
          codigo: "patch-conflict",
          severidad: "error",
          linea: patch.linea,
          columna: 1,
          mensaje: "La edicion OPL propone dos cambios incompatibles sobre el mismo hecho.",
        });
      }
      return;
    }
    this.keys.set(key, patch);
    this.patches.push(patch);
  }

  diagnostico(diagnostico: DiagnosticoOpl): void {
    this.diagnosticos.push(diagnostico);
  }
}

function patchKey(patch: PatchOplPropuesto): string {
  switch (patch.tipo) {
    case "renombrar-entidad":
    case "cambiar-esencia":
    case "cambiar-afiliacion":
      return `${patch.tipo}:${patch.entidadId}`;
    case "crear-entidad":
      return `${patch.tipo}:${patch.nombre}:${patch.entidadTipo}`;
    case "sincronizar-estados":
      return `${patch.tipo}:${patch.objetoId}`;
    case "renombrar-estado":
      return `${patch.tipo}:${patch.estadoId}`;
    case "crear-enlace":
      return `${patch.tipo}:${patch.tipoEnlace}:${refKey(patch.origen)}:${refKey(patch.destino)}`;
    case "fijar-etiqueta-enlace":
      return `${patch.tipo}:${patch.enlaceId}`;
  }
}

function refKey(ref: ReferenciaEntidadPatch): string {
  return ref.tipo === "id" ? ref.id : `${ref.nombre}:${ref.entidadTipo ?? "*"}`;
}

void extremoEntidad;
