import { tieneDesignacion } from "../../modelo/estadosDesignaciones";
import { entidadIdDeExtremo, extremoEntidad } from "../../modelo/extremos";
import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Enlace, Entidad, Id, Modelo, Modificador, TipoEnlace, TipoEntidad } from "../../modelo/tipos";
import { ordenarOpdsParaOpl } from "../bloquesJerarquicos";
import { generarOplInteractivo } from "../generar";
import type { OplLineaInteractiva, OplReferencia } from "../interaccion";
import { claveNombre, parsearParrafoOpl } from "./parsear";
import type {
  AstProcedimentalBase,
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
    case "evento":
      return planificarEvento(modelo, ast, registry, opdActivoId);
    case "condicion":
      return planificarCondicion(modelo, ast, registry);
    case "abanico":
      return planificarAbanico(modelo, ast, registry);
    case "excepcion":
      return planificarExcepcion(modelo, ast, registry);
    case "estructural":
      return planificarEstructural(modelo, ast, registry, opdActivoId);
    case "designacion-estado":
      return planificarDesignacionEstado(modelo, ast, registry);
    case "plegado-parcial":
      // Informacional: refleja vista, no muta hechos del modelo.
      // El parser ya emite el diagnostico `info`; aqui no hay patch que generar.
      return;
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
      return planificarContexto(modelo, ast, registry);
    case "unsupported":
      return;
  }
}

function planificarContexto(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "contexto" }>,
  registry: PatchRegistry,
): void {
  if (ast.familia !== "descomposicion" && ast.familia !== "despliegue") return;
  const entidad = resolverEntidad(modelo, ast.sujeto, undefined, ast.linea, registry, { silenciosoSiNoExiste: true });
  if (!entidad) {
    registry.diagnostico({
      codigo: "unknown-symbol",
      severidad: "error",
      linea: ast.linea,
      columna: 1,
      mensaje: `No existe '${ast.sujeto}' para crear refinamiento ${ast.familia}.`,
    });
    return;
  }
  const yaExiste = ast.familia === "descomposicion"
    ? entidad.refinamientos?.descomposicion
    : entidad.refinamientos?.despliegue;
  if (yaExiste) return;
  registry.add({ tipo: "crear-refinamiento", linea: ast.linea, entidadId: entidad.id, familia: ast.familia });
  // Sin pérdida silenciosa: la oración canónica enumera miembros, pero el
  // reverse solo crea el refinamiento (OPD hijo vacío); los miembros se
  // modelan en el canvas o con sus propias oraciones.
  registry.diagnostico({
    codigo: "unsupported-kernel",
    severidad: "info",
    linea: ast.linea,
    columna: 1,
    mensaje: `Se crea ${ast.familia === "descomposicion" ? "la descomposición" : "el despliegue"} de '${ast.sujeto}' con OPD hijo vacío; los miembros enumerados en la oración no se crean ni se mueven automáticamente.`,
  });
}

function planificarDesignacionEstado(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "designacion-estado" }>,
  registry: PatchRegistry,
): void {
  const entidad = resolverEntidad(modelo, ast.entidad, "objeto", ast.linea, registry, { silenciosoSiNoExiste: true });
  if (!entidad) {
    registry.diagnostico({
      codigo: "unknown-symbol",
      severidad: "error",
      linea: ast.linea,
      columna: 1,
      mensaje: `No existe el objeto '${ast.entidad}' para designar su estado.`,
    });
    return;
  }
  const estados = estadosDeEntidad(modelo, entidad.id);
  const claveEstado = claveNombre(ast.estado);
  const estado = estados.find((item) => claveNombre(item.nombre) === claveEstado);
  if (!estado) {
    registry.diagnostico({
      codigo: "unknown-symbol",
      severidad: "error",
      linea: ast.linea,
      columna: 1,
      mensaje: `El objeto '${entidad.nombre}' no tiene un estado llamado '${ast.estado}'.`,
      sugerencia: "Declara primero los estados con 'X puede estar ...'.",
    });
    return;
  }
  if (tieneDesignacion(estado, ast.designacion)) return;
  registry.add({
    tipo: "aplicar-designacion-estado",
    linea: ast.linea,
    entidadId: entidad.id,
    estadoNombre: estado.nombre,
    designacion: ast.designacion,
  });
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
    registry.add({
      tipo: "crear-entidad",
      linea: ast.linea,
      nombre: ast.nombre,
      entidadTipo: ast.tipoEntidad,
      ...(ast.esencia !== undefined ? { esencia: ast.esencia } : {}),
      ...(ast.afiliacion !== undefined ? { afiliacion: ast.afiliacion } : {}),
    });
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

  if (ast.esencia !== undefined && entidad.esencia !== ast.esencia) registry.add({ tipo: "cambiar-esencia", linea: ast.linea, entidadId: entidad.id, anterior: entidad.esencia, siguiente: ast.esencia });
  if (ast.afiliacion !== undefined && entidad.afiliacion !== ast.afiliacion) registry.add({ tipo: "cambiar-afiliacion", linea: ast.linea, entidadId: entidad.id, anterior: entidad.afiliacion, siguiente: ast.afiliacion });
}

function planificarEstados(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "estados" }>,
  anterior: OplLineaInteractiva | null,
  registry: PatchRegistry,
): void {
  const entidad = resolverEntidad(modelo, ast.objeto, "objeto", ast.linea, registry, { silenciosoSiNoExiste: true })
    ?? entidadDeRefAnterior(modelo, anterior, "objeto");
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
  if (!entidad) {
    // Cierre del ciclo estado-objeto: el objeto puede venir declarado en una
    // línea previa del MISMO texto (patch `crear-entidad` ya planificado).
    // Igual que los enlaces, se emite una referencia pendiente por nombre que
    // el aplicador resuelve tras crear la entidad (orden por línea).
    const pendiente = registry.refEntidadPendiente(modelo, ast.objeto, "objeto", ast.linea);
    if (pendiente) {
      registry.add({ tipo: "sincronizar-estados", linea: ast.linea, objeto: pendiente, nombres: ast.estados });
      return;
    }
    registry.diagnostico({
      codigo: "unknown-symbol",
      severidad: "error",
      linea: ast.linea,
      columna: 1,
      mensaje: `No existe el objeto '${ast.objeto}' para sincronizar estados.`,
    });
    return;
  }

  const actuales = estadosDeEntidad(modelo, entidad.id);
  const refsEstado = anterior?.refs.filter((ref) => ref.tipo === "estado") ?? [];
  if (actuales.length === 0 || ast.estados.length > actuales.length) {
    registry.add({ tipo: "sincronizar-estados", linea: ast.linea, objeto: { tipo: "id", id: entidad.id }, nombres: ast.estados });
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
  planificarEnlace(modelo, ast.linea, ast.tipoEnlace, endpoints.origen, endpoints.destino, ast.etiqueta, registry, {
    ...(ast.multiplicidadOrigen ? { multiplicidadOrigen: ast.multiplicidadOrigen } : {}),
    ...(ast.multiplicidadDestino ? { multiplicidadDestino: ast.multiplicidadDestino } : {}),
    ...(ast.rutaEtiqueta ? { rutaEtiqueta: ast.rutaEtiqueta } : {}),
    ...(ast.estadoEntrada ? { estadoEntrada: ast.estadoEntrada } : {}),
    ...(ast.estadoSalida ? { estadoSalida: ast.estadoSalida } : {}),
    ...(ast.demora ? { demora: ast.demora } : {}),
  });
}

function planificarEvento(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "evento" }>,
  registry: PatchRegistry,
  _opdActivoId: Id,
): void {
  // D1: el estado del iniciador (ETS/EHS) se pasa como parte del extremo del enlace
  // via `endpointsBase`, no como patch separado de estado.
  // Caso "X inicia Y" sin sub-clausula → invocacion proceso→proceso base.
  // El kernel no admite condicion/evento/no sobre invocacion [AP-01..03].
  if (!ast.base) {
    const origen = refEntidadPorNombre(modelo, ast.iniciador, "proceso", ast.linea, registry);
    const destino = refEntidadPorNombre(modelo, ast.proceso, "proceso", ast.linea, registry);
    if (!origen || !destino) return;
    planificarEnlace(modelo, ast.linea, "invocacion", origen, destino, ast.etiqueta, registry);
    return;
  }
  const endpoints = endpointsBase(modelo, ast.base, ast.linea, registry);
  if (!endpoints) return;
  planificarEnlace(modelo, ast.linea, ast.base.tipoEnlace, endpoints.origen, endpoints.destino, ast.etiqueta, registry, {
    modificador: "evento",
    ...(ast.base.multiplicidadOrigen ? { multiplicidadOrigen: ast.base.multiplicidadOrigen } : {}),
    ...(ast.base.multiplicidadDestino ? { multiplicidadDestino: ast.base.multiplicidadDestino } : {}),
    ...(ast.base.rutaEtiqueta ? { rutaEtiqueta: ast.base.rutaEtiqueta } : {}),
    ...(ast.base.estadoEntrada ? { estadoEntrada: ast.base.estadoEntrada } : {}),
    ...(ast.base.estadoSalida ? { estadoSalida: ast.base.estadoSalida } : {}),
  });
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
    planificarEnlace(modelo, ast.linea, ast.tipoEnlace, origen, destinoRef, ast.etiqueta, registry, {
      ...(ast.multiplicidadDestino ? { multiplicidadDestino: ast.multiplicidadDestino } : {}),
    });
  }
}

function endpointsProcedimentales(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "procedimental" }>,
  registry: PatchRegistry,
): { origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch } | null {
  return endpointsBase(modelo, ast, ast.linea, registry);
}

function endpointsBase(
  modelo: Modelo,
  base: AstProcedimentalBase,
  linea: number,
  registry: PatchRegistry,
): { origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch } | null {
  switch (base.tipoEnlace) {
    case "agente": {
      const objeto = refEntidadPorNombre(modelo, base.objeto ?? "", "objeto", linea, registry);
      const proceso = refEntidadPorNombre(modelo, base.proceso ?? "", "proceso", linea, registry);
      return objeto && proceso ? { origen: objeto, destino: proceso } : null;
    }
    case "instrumento": {
      const objeto = refEntidadPorNombre(modelo, base.objeto ?? "", "objeto", linea, registry);
      const proceso = refEntidadPorNombre(modelo, base.proceso ?? "", "proceso", linea, registry);
      return objeto && proceso ? { origen: objeto, destino: proceso } : null;
    }
    case "consumo": {
      const objeto = refEntidadPorNombre(modelo, base.objeto ?? "", "objeto", linea, registry);
      const proceso = refEntidadPorNombre(modelo, base.proceso ?? "", "proceso", linea, registry);
      return objeto && proceso ? { origen: objeto, destino: proceso } : null;
    }
    case "resultado":
    case "efecto": {
      const proceso = refEntidadPorNombre(modelo, base.proceso ?? "", "proceso", linea, registry);
      const objeto = refEntidadPorNombre(modelo, base.objeto ?? "", "objeto", linea, registry);
      return proceso && objeto ? { origen: proceso, destino: objeto } : null;
    }
    case "invocacion": {
      const origen = refEntidadPorNombre(modelo, base.origen ?? base.proceso ?? "", "proceso", linea, registry);
      const destino = refEntidadPorNombre(modelo, base.destino ?? base.proceso ?? "", "proceso", linea, registry);
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
  opciones: {
    modificador?: Modificador;
    /** Multiplicidad de origen capturada en parser (SSOT §12). */
    multiplicidadOrigen?: string;
    /** Multiplicidad de destino capturada en parser (SSOT §12). */
    multiplicidadDestino?: string;
    /** Etiqueta de ruta capturada en parser (SSOT §13). */
    rutaEtiqueta?: string;
    estadoEntrada?: string;
    estadoSalida?: string;
    /** Demora de invocación/autoinvocación (SSOT §8). */
    demora?: string;
  } = {},
): void {
  const origenId = resolverRefId(modelo, origen);
  const destinoId = resolverRefId(modelo, destino);
  const existente = origenId && destinoId ? buscarEnlace(modelo, tipoEnlace, origenId, destinoId) : null;
  // Campos opcionales L4 (multiplicidad y ruta) que se propagan a `crear-enlace`.
  const camposL4 = {
    ...(opciones.multiplicidadOrigen ? { multiplicidadOrigen: opciones.multiplicidadOrigen } : {}),
    ...(opciones.multiplicidadDestino ? { multiplicidadDestino: opciones.multiplicidadDestino } : {}),
    ...(opciones.rutaEtiqueta ? { rutaEtiqueta: opciones.rutaEtiqueta } : {}),
    ...(opciones.estadoEntrada ? { estadoEntrada: opciones.estadoEntrada } : {}),
    ...(opciones.estadoSalida ? { estadoSalida: opciones.estadoSalida } : {}),
    ...(opciones.demora ? { demora: opciones.demora } : {}),
  };
  if (!existente) {
    registry.add({
      tipo: "crear-enlace",
      linea,
      tipoEnlace,
      origen,
      destino,
      ...(etiqueta ? { etiqueta } : {}),
      ...(opciones.modificador ? { modificador: opciones.modificador } : {}),
      ...camposL4,
    });
    return;
  }
  // D3: enlace ya existe — si se propuso modificador, aplicarlo solo si no hay otro.
  if (opciones.modificador) {
    if (existente.modificador === undefined) {
      registry.add({
        tipo: "crear-enlace",
        linea,
        tipoEnlace,
        origen,
        destino,
        ...(etiqueta ? { etiqueta } : {}),
        modificador: opciones.modificador,
        ...camposL4,
      });
    } else if (existente.modificador !== opciones.modificador) {
      registry.diagnostico({
        codigo: "patch-conflict",
        severidad: "warning",
        linea,
        columna: 1,
        mensaje: `El enlace ${tipoEnlace} ya tiene modificador '${existente.modificador}' y la oracion propone '${opciones.modificador}'.`,
        sugerencia: "Quita el modificador anterior desde el canvas antes de cambiarlo desde OPL.",
      });
    }
  } else if (opciones.multiplicidadOrigen || opciones.multiplicidadDestino || opciones.rutaEtiqueta || opciones.estadoEntrada || opciones.estadoSalida || opciones.demora) {
    // Enlace ya existe sin modificador, pero la oracion trae datos L4 (multiplicidad
    // o ruta) — emitimos un patch idempotente para actualizarlos. El aplicador
    // detecta que el enlace ya existe y solo aplica los campos L4.
    registry.add({
      tipo: "crear-enlace",
      linea,
      tipoEnlace,
      origen,
      destino,
      ...(etiqueta ? { etiqueta } : {}),
      ...camposL4,
    });
  }
  const etiquetaActual = existente.etiqueta.trim();
  const etiquetaNueva = etiqueta?.trim() ?? "";
  if (etiquetaActual !== etiquetaNueva) {
    registry.add({ tipo: "fijar-etiqueta-enlace", linea, enlaceId: existente.id, anterior: etiquetaActual, siguiente: etiquetaNueva });
  }
}

/**
 * Planifica una oracion de condicion (SSOT §7).
 *
 * - CT (consumo/efecto) y CS (con estado): crea/actualiza enlace consumo o
 *   efecto con modificador `condicion`.
 * - CH (habilitador): crea/actualiza enlace instrumento o agente con modificador
 *   `condicion`.
 *
 * El estado del condicionante (`condicionanteEstado`) se preserva en el AST
 * para una iteracion futura del aplicador que soporte extremos de estado en
 * `crear-enlace`.
 */
function planificarCondicion(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "condicion" }>,
  registry: PatchRegistry,
): void {
  const endpoints = endpointsCondicion(modelo, ast, registry);
  if (!endpoints) return;
  planificarEnlace(
    modelo,
    ast.linea,
    endpoints.tipoEnlace,
    endpoints.origen,
    endpoints.destino,
    ast.etiqueta,
    registry,
    {
      modificador: "condicion",
      ...(ast.condicionanteEstado ? { estadoEntrada: ast.condicionanteEstado } : {}),
      ...(ast.estadoSalida ? { estadoSalida: ast.estadoSalida } : {}),
      ...(ast.rutaEtiqueta ? { rutaEtiqueta: ast.rutaEtiqueta } : {}),
    },
  );
}

function endpointsCondicion(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "condicion" }>,
  registry: PatchRegistry,
): {
  tipoEnlace: Extract<TipoEnlace, "agente" | "instrumento" | "consumo" | "efecto">;
  origen: ReferenciaEntidadPatch;
  destino: ReferenciaEntidadPatch;
} | null {
  const proceso = refEntidadPorNombre(modelo, ast.proceso, "proceso", ast.linea, registry);
  if (!proceso) return null;
  const objeto = refEntidadPorNombre(modelo, ast.condicionante, "objeto", ast.linea, registry);
  if (!objeto) return null;

  switch (ast.base) {
    case "agente":
      return { tipoEnlace: "agente", origen: objeto, destino: proceso };
    case "instrumento":
      return { tipoEnlace: "instrumento", origen: objeto, destino: proceso };
    case "consumo":
      return { tipoEnlace: "consumo", origen: objeto, destino: proceso };
    case "efecto":
      return { tipoEnlace: "efecto", origen: proceso, destino: objeto };
  }
}

/**
 * Planifica una oracion de abanico XOR/OR (SSOT §11.2-§11.4) — ronda 26/L3.
 *
 * Emite:
 *   1. N patches `crear-enlace` (uno por rama), aplicando el modificador
 *      `condicion` cuando el AST lo trae.
 *   2. Un patch `crear-abanico` que los agrupa con el operador (`O` / `XOR`).
 *
 * Limitacion: la forma §11.3 con estados ("cambia X a/de cuant `s1` y `s2`")
 * se planifica como un solo enlace a la entidad portadora, porque el
 * aplicador no inversa extremos de estado desde OPL libre (analogo a
 * `planificarCondicion` con `condicionanteEstado`).
 */
function planificarAbanico(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "abanico" }>,
  registry: PatchRegistry,
): void {
  if (ast.tipoEnlace === "efecto" && !ast.otrosEstados && planificarAbanicoEfectoObjetoAProcesos(modelo, ast, registry)) {
    return;
  }

  const procesoRef = refEntidadPorNombre(modelo, ast.proceso, "proceso", ast.linea, registry);
  if (!procesoRef) return;

  const otrosTipo: TipoEntidad = ast.tipoEnlace === "invocacion" ? "proceso" : "objeto";

  if (ast.otrosEstados && ast.otrosEstados.length >= 2) {
    const objetoNombre = ast.otros[0] ?? "";
    const objetoRef = refEntidadPorNombre(modelo, objetoNombre, otrosTipo, ast.linea, registry);
    if (!objetoRef) return;
    registry.diagnostico({
      codigo: "unsupported-kernel",
      severidad: "info",
      linea: ast.linea,
      columna: 1,
      mensaje: "El abanico con estados se aplica al objeto portador; los extremos por estado no se inversean desde OPL libre en este corte.",
      sugerencia: "Define los estados desde canvas y vuelve a generar el OPL.",
    });
    planificarRamaAbanico(modelo, ast, procesoRef, objetoRef, ast.linea, registry);
    return;
  }

  const ramasRefs: Array<{ origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch }> = [];
  for (const otroNombre of ast.otros) {
    const otroRef = refEntidadPorNombre(modelo, otroNombre, otrosTipo, ast.linea, registry);
    if (!otroRef) continue;
    const ramaRefs = ramaEnlaceAbanico(ast, procesoRef, otroRef);
    if (!ramaRefs) continue;
    planificarEnlace(
      modelo,
      ast.linea,
      ast.tipoEnlace,
      ramaRefs.origen,
      ramaRefs.destino,
      ast.etiqueta,
      registry,
      ast.modificador ? { modificador: ast.modificador } : {},
    );
    ramasRefs.push(ramaRefs);
  }

  if (ramasRefs.length < 2) return;

  registry.add({
    tipo: "crear-abanico",
    linea: ast.linea,
    operador: ast.operador,
    tipoEnlace: ast.tipoEnlace,
    procesoRef,
    procesoEsOrigen: ast.puertoEsOrigen,
    ramas: ramasRefs.map((rama) => ({ origen: rama.origen, destino: rama.destino })),
    ...(ast.modificador ? { modificador: ast.modificador } : {}),
  });
}

function planificarAbanicoEfectoObjetoAProcesos(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "abanico" }>,
  registry: PatchRegistry,
): boolean {
  if (refEntidadPorNombreSilenciosa(modelo, ast.proceso, "proceso", ast.linea, registry)) {
    return false;
  }
  const objetoRef = refEntidadPorNombreSilenciosa(modelo, ast.proceso, "objeto", ast.linea, registry);
  if (!objetoRef) return false;

  const ramasRefs: Array<{ origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch }> = [];
  for (const procesoNombre of ast.otros) {
    const procesoRef = refEntidadPorNombre(modelo, procesoNombre, "proceso", ast.linea, registry);
    if (!procesoRef) continue;
    const ramaRefs = { origen: objetoRef, destino: procesoRef };
    planificarEnlace(
      modelo,
      ast.linea,
      ast.tipoEnlace,
      ramaRefs.origen,
      ramaRefs.destino,
      ast.etiqueta,
      registry,
      ast.modificador ? { modificador: ast.modificador } : {},
    );
    ramasRefs.push(ramaRefs);
  }

  if (ramasRefs.length < 2) return true;

  registry.add({
    tipo: "crear-abanico",
    linea: ast.linea,
    operador: ast.operador,
    tipoEnlace: ast.tipoEnlace,
    procesoRef: objetoRef,
    procesoEsOrigen: true,
    ramas: ramasRefs.map((rama) => ({ origen: rama.origen, destino: rama.destino })),
    ...(ast.modificador ? { modificador: ast.modificador } : {}),
  });
  return true;
}

function planificarRamaAbanico(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "abanico" }>,
  procesoRef: ReferenciaEntidadPatch,
  otroRef: ReferenciaEntidadPatch,
  linea: number,
  registry: PatchRegistry,
): void {
  const ramaRefs = ramaEnlaceAbanico(ast, procesoRef, otroRef);
  if (!ramaRefs) return;
  planificarEnlace(
    modelo,
    linea,
    ast.tipoEnlace,
    ramaRefs.origen,
    ramaRefs.destino,
    ast.etiqueta,
    registry,
    ast.modificador ? { modificador: ast.modificador } : {},
  );
}

/**
 * Calcula (origen, destino) de una rama del abanico segun tipoEnlace y
 * puertoEsOrigen. La logica espeja `endpointsBase` para enlaces simples,
 * pero opera sobre el par (proceso, otro) ya resuelto. Cf. la tabla del
 * generador en `abanico.ts:94-119`.
 */
function ramaEnlaceAbanico(
  ast: Extract<OracionOplAst, { kind: "abanico" }>,
  procesoRef: ReferenciaEntidadPatch,
  otroRef: ReferenciaEntidadPatch,
): { origen: ReferenciaEntidadPatch; destino: ReferenciaEntidadPatch } | null {
  switch (ast.tipoEnlace) {
    case "agente":
    case "instrumento":
    case "consumo":
      return ast.puertoEsOrigen
        ? { origen: procesoRef, destino: otroRef }
        : { origen: otroRef, destino: procesoRef };
    case "resultado":
      return ast.puertoEsOrigen
        ? { origen: procesoRef, destino: otroRef }
        : { origen: otroRef, destino: procesoRef };
    case "efecto":
      return { origen: procesoRef, destino: otroRef };
    case "invocacion":
      return ast.puertoEsOrigen
        ? { origen: procesoRef, destino: otroRef }
        : { origen: otroRef, destino: procesoRef };
  }
}

/**
 * Planifica una oracion de excepcion temporal (SSOT §8.1 EX1/EX2).
 *
 * Crea un enlace `excepcionSobretiempo` o `excepcionSubtiempo` entre el proceso
 * fuente y el proceso de manejo, persistiendo los valores de duracion/unidad
 * tal cual aparecen en la oracion.
 */
function planificarExcepcion(
  modelo: Modelo,
  ast: Extract<OracionOplAst, { kind: "excepcion" }>,
  registry: PatchRegistry,
): void {
  const fuente = refEntidadPorNombre(modelo, ast.fuente, "proceso", ast.linea, registry);
  const proceso = refEntidadPorNombre(modelo, ast.proceso, "proceso", ast.linea, registry);
  if (!fuente || !proceso) return;

  const limite = ast.limite;
  const tipoEnlace: TipoEnlace =
    limite.tipo === "minmax" ? "excepcionSubSobretiempo"
    : limite.tipo === "max" ? "excepcionSobretiempo"
    : "excepcionSubtiempo";
  const camposTiempo: { tiempoMaximo?: string; unidadTiempoMaximo?: string; tiempoMinimo?: string; unidadTiempoMinimo?: string } =
    limite.tipo === "minmax"
      ? {
          tiempoMinimo: limite.min.valor,
          unidadTiempoMinimo: limite.min.unidad,
          tiempoMaximo: limite.max.valor,
          unidadTiempoMaximo: limite.max.unidad,
        }
      : limite.tipo === "max"
        ? { tiempoMaximo: limite.valor, unidadTiempoMaximo: limite.unidad }
        : { tiempoMinimo: limite.valor, unidadTiempoMinimo: limite.unidad };

  const origenId = resolverRefId(modelo, fuente);
  const destinoId = resolverRefId(modelo, proceso);
  const existente = origenId && destinoId ? buscarEnlace(modelo, tipoEnlace, origenId, destinoId) : null;

  if (!existente) {
    registry.add({
      tipo: "crear-enlace",
      linea: ast.linea,
      tipoEnlace,
      origen: fuente,
      destino: proceso,
      ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
      ...camposTiempo,
    });
    return;
  }

  const difiereMaximo = camposTiempo.tiempoMaximo !== undefined
    && (existente.tiempoMaximo !== camposTiempo.tiempoMaximo || existente.unidadTiempoMaximo !== camposTiempo.unidadTiempoMaximo);
  const difiereMinimo = camposTiempo.tiempoMinimo !== undefined
    && (existente.tiempoMinimo !== camposTiempo.tiempoMinimo || existente.unidadTiempoMinimo !== camposTiempo.unidadTiempoMinimo);
  if (difiereMaximo || difiereMinimo) {
    registry.add({
      tipo: "crear-enlace",
      linea: ast.linea,
      tipoEnlace,
      origen: fuente,
      destino: proceso,
      ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
      ...camposTiempo,
    });
  }
  const etiquetaActual = existente.etiqueta.trim();
  const etiquetaNueva = ast.etiqueta?.trim() ?? "";
  if (etiquetaActual !== etiquetaNueva) {
    registry.add({ tipo: "fijar-etiqueta-enlace", linea: ast.linea, enlaceId: existente.id, anterior: etiquetaActual, siguiente: etiquetaNueva });
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
  const pendiente = registry.refEntidadPendiente(modelo, nombre, entidadTipo, linea);
  if (pendiente) return pendiente;
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

function refEntidadPorNombreSilenciosa(
  modelo: Modelo,
  nombre: string,
  entidadTipo: TipoEntidad,
  linea: number,
  registry: PatchRegistry,
): ReferenciaEntidadPatch | null {
  const entidad = resolverEntidad(modelo, nombre, entidadTipo, linea, registry, { silenciosoSiNoExiste: true });
  if (entidad) return { tipo: "id", id: entidad.id };
  return registry.refEntidadPendiente(modelo, nombre, entidadTipo, linea);
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
      // G2: la clasificación escindida emite dos `crear-entidad` para la misma
      // cosa (una por dimensión). Se fusionan en el patch pendiente: cada
      // oración aporta su dimensión sin dispararse como conflicto.
      if (previo.tipo === "crear-entidad" && patch.tipo === "crear-entidad" && previo.entidadTipo === patch.entidadTipo) {
        if (previo.esencia === undefined && patch.esencia !== undefined) previo.esencia = patch.esencia;
        if (previo.afiliacion === undefined && patch.afiliacion !== undefined) previo.afiliacion = patch.afiliacion;
        return;
      }
      // El `patchKey` ya define la identidad del hecho con independencia del
      // número de línea. Dos oraciones distintas pueden emitir el mismo patch
      // (p. ej. G2: las dos oraciones de clasificación escindida resuelven al
      // mismo renombrado vía `anterior`): si solo difieren en `linea`, es
      // idempotente, no conflicto.
      if (!equivalenteSalvoLinea(previo, patch)) {
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

  refEntidadPendiente(
    modelo: Modelo,
    nombre: string,
    entidadTipo: TipoEntidad | undefined,
    linea: number,
  ): ReferenciaEntidadPatch | null {
    const clave = claveNombre(nombre);
    const candidatos: ReferenciaEntidadPatch[] = [];
    for (const patch of this.patches) {
      if (patch.tipo === "crear-entidad") {
        if (claveNombre(patch.nombre) === clave && (!entidadTipo || patch.entidadTipo === entidadTipo)) {
          candidatos.push({ tipo: "nombre", nombre: patch.nombre, entidadTipo: patch.entidadTipo });
        }
        continue;
      }
      if (patch.tipo !== "renombrar-entidad") continue;
      if (claveNombre(patch.siguiente) !== clave) continue;
      const entidad = modelo.entidades[patch.entidadId];
      if (!entidad || (entidadTipo && entidad.tipo !== entidadTipo)) continue;
      candidatos.push({ tipo: "id", id: patch.entidadId });
    }
    const deduplicados = candidatos.filter((candidato, index, todos) => (
      todos.findIndex((item) => refKey(item) === refKey(candidato)) === index
    ));
    if (deduplicados.length === 1) return deduplicados[0]!;
    if (deduplicados.length > 1) {
      this.diagnostico({
        codigo: "ambiguous-symbol",
        severidad: "error",
        linea,
        columna: 1,
        mensaje: `El nombre '${nombre}' es ambiguo en los cambios OPL pendientes (${deduplicados.length} candidatos).`,
      });
    }
    return null;
  }
}

function equivalenteSalvoLinea(a: PatchOplPropuesto, b: PatchOplPropuesto): boolean {
  const { linea: _la, ...restoA } = a;
  const { linea: _lb, ...restoB } = b;
  return JSON.stringify(restoA) === JSON.stringify(restoB);
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
      return `${patch.tipo}:${patch.objeto.tipo === "id" ? patch.objeto.id : claveNombre(patch.objeto.nombre)}`;
    case "renombrar-estado":
      return `${patch.tipo}:${patch.estadoId}`;
    case "crear-enlace":
      return `${patch.tipo}:${patch.tipoEnlace}:${refKey(patch.origen)}:${refKey(patch.destino)}:${patch.modificador ?? ""}`;
    case "fijar-etiqueta-enlace":
      return `${patch.tipo}:${patch.enlaceId}`;
    case "aplicar-designacion-estado":
      return `${patch.tipo}:${patch.entidadId}:${claveNombre(patch.estadoNombre)}:${patch.designacion}`;
    case "crear-abanico": {
      // El abanico se identifica por (linea, tipo, proceso, lado). No usamos
      // las ramas en la clave porque la idempotencia debe permitir reordenar
      // sin generar conflicto.
      const procesoKey = refKey(patch.procesoRef);
      return `${patch.tipo}:${patch.linea}:${patch.tipoEnlace}:${procesoKey}:${patch.procesoEsOrigen ? "o" : "d"}:${patch.modificador ?? ""}`;
    }
    case "crear-refinamiento":
      return `${patch.tipo}:${patch.entidadId}:${patch.familia}`;
  }
}

function refKey(ref: ReferenciaEntidadPatch): string {
  return ref.tipo === "id" ? ref.id : `${ref.nombre}:${ref.entidadTipo ?? "*"}`;
}

void extremoEntidad;
