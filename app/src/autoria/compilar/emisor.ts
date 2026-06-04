// Emisor del compilador (W4.2, etapa 4). De cada oración normalizada (estricta o
// normalizada) → AST de `opl/parser/parsear.ts` → llamadas al DSL de autoría.
//
// REUSO: `parsearParrafoOpl` da el AST (texto→AST con nombres, puro y verificado).
// El emisor mapea cada `kind` de AST a la primitiva DSL correspondiente, usando el
// Resolutor para los nombres→keys (creación, reuso o proyección `ver()`).
//
// LEDGER L2: cada oración aplicable produce 1..N hechos (con N>1 trazado: el
// abanico emite N enlaces + el agrupamiento; las estructurales de lista emiten N
// enlaces). Las clases SIN primitiva (registro de exclusiones del inventario §2)
// no se pierden: el emisor las devuelve como `excluida` con la razón.

import type { Autor } from "../dsl";
import type { ExtremoEntrada, OpcionesEnlace } from "../tipos";
import { parsearParrafoOpl } from "../../opl/parser/parsear";
import type { OracionOplAst } from "../../opl/parser/tipos";
import type { TipoEnlace } from "../../modelo/tipos";
import { Resolutor } from "./resolutor";

/** Un hecho emitido al DSL (para contabilidad L2). */
export interface HechoEmitido {
  /** Tipo de primitiva DSL invocada. */
  primitiva:
    | "entidad"
    | "estados"
    | "enlace"
    | "designarEstado"
    | "abanico"
    | "ver";
  /** Detalle textual (p.ej. el tipo de enlace, el nombre de la entidad). */
  detalle: string;
}

/** Resultado de emitir UNA oración. */
export type ResultadoEmision =
  | { estado: "aplicada"; hechos: HechoEmitido[] }
  | { estado: "excluida"; clase: string; razon: string }
  | { estado: "fallo"; razon: string };

/** Contexto que el emisor necesita por OPD. */
export interface ContextoEmision {
  autor: Autor;
  resolutor: Resolutor;
  /** Clave del OPD activo (para `ver()` y para marcar apariciones). */
  opdClave: string;
  /** Id real del OPD activo (clave del DSL `opd()`). */
  opdKey: string;
  /**
   * Unión de estados por entidad (clave-nombre → lista de estados en forma display),
   * pre-calculada sobre TODO el proto: estados explícitos (`puede estar`) + estados
   * implícitos por transición/resultado/evento. Permite declarar el state set
   * completo de un objeto la primera vez que se referencia, de modo que las
   * transiciones que nombran un estado declarado solo por uso no fallen.
   */
  estadosUnion: Map<string, string[]>;
  /** Conjunto de keys de entidad cuyos estados ya se declararon (idempotencia). */
  estadosDeclarados: Set<string>;
}

/**
 * Recolecta, sobre la lista de oraciones normalizadas del proto, la UNIÓN de
 * estados por entidad (display form). Cosecha tanto `X puede estar …` (explícito)
 * como los estados nombrados en transiciones/resultados/eventos (`cambia X de 'a'
 * a 'b'`, `genera X en estado 'e'`, `X en estado 'e' inicia …`). Es el análogo de
 * `cosecharEstadosImplicitos` del normalizador, pero conservando la forma display
 * (el normalizador solo guarda la clave). La clave del mapa es `claveNombre`.
 */
export function recolectarEstadosUnion(oraciones: string[]): Map<string, string[]> {
  const porClave = new Map<string, { nombre: string; estados: Map<string, string> }>();
  const agregar = (entidad: string, estados: string[]) => {
    const clave = claveEntidad(entidad);
    if (!clave) return;
    const reg = porClave.get(clave) ?? { nombre: entidad.trim(), estados: new Map<string, string>() };
    for (const e of estados) {
      const limpio = limpiarEstado(e);
      if (limpio) reg.estados.set(claveEntidad(limpio), limpio);
    }
    porClave.set(clave, reg);
  };

  for (const oracion of oraciones) {
    const texto = oracion.trim().endsWith(".") ? oracion : `${oracion}.`;
    const { ast } = parsearParrafoOpl(texto);
    for (const a of ast) {
      if (a.kind === "estados") agregar(a.objeto, a.estados);
      else if (a.kind === "procedimental") {
        if (a.estadoEntrada) agregar(estadoPortador(a), [a.estadoEntrada]);
        if (a.estadoSalida) agregar(a.objeto ?? "", [a.estadoSalida]);
      } else if (a.kind === "evento" && a.base) {
        if (a.base.estadoEntrada) agregar(a.base.objeto ?? "", [a.base.estadoEntrada]);
        if (a.base.estadoSalida) agregar(a.base.objeto ?? "", [a.base.estadoSalida]);
        if (a.iniciadorEstado) agregar(a.iniciador, [a.iniciadorEstado]);
      }
    }
  }

  const salida = new Map<string, string[]>();
  for (const [clave, reg] of porClave) salida.set(clave, [...reg.estados.values()]);
  return salida;
}

/** El portador del estado de entrada en un AST procedimental es el objeto. */
function estadoPortador(a: { objeto?: string; proceso?: string }): string {
  return a.objeto ?? a.proceso ?? "";
}

/**
 * Recolecta los rasgos esencia/afiliación declarados en las descripciones del
 * proto (`X es un objeto físico y sistémico` tras la normalización AESS). Permite
 * crear cada entidad con su esencia/afiliación correctas la primera vez que se la
 * referencia (la firma `agente` exige objeto físico — un agente descrito en otro
 * OPD no puede crearse informacional por default). La clave es `claveEntidad`.
 */
export function recolectarRasgos(
  oraciones: string[],
): Map<string, { esencia: "informacional" | "fisica"; afiliacion: "sistemica" | "ambiental" }> {
  const salida = new Map<string, { esencia: "informacional" | "fisica"; afiliacion: "sistemica" | "ambiental" }>();
  // Marca de "es agente" (origen de un enlace `agente`/`maneja`): OPM exige que un
  // agente sea OBJETO FÍSICO. El proto HODOM no siempre declara la esencia de los
  // roles (los lista como partes de un agregado físico, dejando la esencia
  // implícita); sin esto, un agente sin descripción se crea informacional y rompe
  // la firma `agente`. Es una inferencia PRINCIPIADA (regla OPM), no una adivinanza.
  const esAgente = new Set<string>();
  for (const oracion of oraciones) {
    const texto = oracion.trim().endsWith(".") ? oracion : `${oracion}.`;
    const { ast } = parsearParrafoOpl(texto);
    for (const a of ast) {
      if (a.kind === "descripcion-cosa") {
        const clave = claveEntidad(a.nombre);
        if (!clave) continue;
        const previo = salida.get(clave) ?? { esencia: "informacional" as const, afiliacion: "sistemica" as const };
        salida.set(clave, {
          esencia: a.esencia ?? previo.esencia,
          afiliacion: a.afiliacion ?? previo.afiliacion,
        });
      } else if (a.kind === "procedimental" && a.tipoEnlace === "agente" && a.objeto) {
        esAgente.add(claveEntidad(a.objeto));
      } else if (a.kind === "evento" && a.base?.tipoEnlace === "agente" && a.base.objeto) {
        esAgente.add(claveEntidad(a.base.objeto));
      }
    }
  }
  // Un agente sin esencia explícita declarada → físico (regla OPM), conservando su
  // afiliación si ya se conoce. Una descripción explícita SIEMPRE gana.
  for (const clave of esAgente) {
    const previo = salida.get(clave);
    if (!previo) salida.set(clave, { esencia: "fisica", afiliacion: "ambiental" });
  }
  return salida;
}

function claveEntidad(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['"`]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

/**
 * Emite las llamadas DSL para UNA oración ya normalizada (texto estricto). Parsea,
 * despacha por kind del AST, y devuelve el destino L2 de la línea.
 */
export function emitirOracion(oracion: string, ctx: ContextoEmision): ResultadoEmision {
  const texto = oracion.trim().endsWith(".") ? oracion : `${oracion}.`;
  const { ast } = parsearParrafoOpl(texto);
  const principal = ast[0];
  if (!principal) return { estado: "fallo", razon: "oración vacía o no parseable" };
  if (principal.kind === "unsupported") {
    return { estado: "fallo", razon: "el parser no reconoció una oración OPL-ES canónica" };
  }
  return emitirAst(principal, ctx);
}

function emitirAst(ast: OracionOplAst, ctx: ContextoEmision): ResultadoEmision {
  switch (ast.kind) {
    case "descripcion-cosa":
      return emitirDescripcion(ast, ctx);
    case "estados":
      return emitirEstados(ast, ctx);
    case "procedimental":
      return emitirProcedimental(ast, ctx);
    case "estructural":
      return emitirEstructural(ast, ctx);
    case "evento":
      return emitirEvento(ast, ctx);
    case "condicion":
      return emitirCondicion(ast, ctx);
    case "abanico":
      return emitirAbanico(ast, ctx);
    case "excepcion":
      return emitirExcepcion(ast, ctx);
    case "designacion-estado":
      return emitirDesignacion(ast, ctx);
    // Clases SIN primitiva-destino para L2 (inventario §2): se registran como
    // exclusiones, jamás se pierden en silencio.
    case "metadata":
      return { estado: "excluida", clase: "metadata", razon: `metadata '${ast.campo}' sin primitiva de autoría que la setee` };
    case "plegado-parcial":
      return { estado: "excluida", clase: "plegado-parcial", razon: "el plegado parcial es vista, no hecho del modelo" };
    case "contexto":
      return { estado: "excluida", clase: "contexto", razon: "oración de contexto (refinamiento) — la maneja el lector de estructura, no el emisor" };
    default:
      return { estado: "fallo", razon: `kind de AST no manejado: ${(ast as { kind: string }).kind}` };
  }
}

// ── Cosas ────────────────────────────────────────────────────────────────

function emitirDescripcion(
  ast: Extract<OracionOplAst, { kind: "descripcion-cosa" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  const r = ctx.resolutor.resolver(ast.nombre, ctx.opdClave, ast.tipoEntidad);
  if (r.accion === "crear") {
    // Esencia/afiliación: la forma colapsada/AESS trae ambas; la escindida una.
    // El DSL exige ambas — usamos defaults del modelo para la dimensión ausente
    // (informacional/sistémica, igual que crearObjeto/crearProceso del kernel).
    ctx.autor.entidad(
      r.key,
      ast.tipoEntidad,
      ast.nombre.trim(),
      ast.esencia ?? r.rasgos.esencia,
      ast.afiliacion ?? r.rasgos.afiliacion,
    );
    asegurarEstados(ast.nombre, r.key, ctx);
    colocarAparicion(r.accion, r.key, ctx);
    return { estado: "aplicada", hechos: [{ primitiva: "entidad", detalle: `${ast.tipoEntidad} ${ast.nombre.trim()}` }] };
  }
  // La cosa ya existe: una segunda descripción es idempotente para el bootstrap
  // (no re-creamos ni mutamos esencia/afiliación — el proto declara una vez).
  // Si la mención cae en otro OPD, asegura su aparición vía `ver()`.
  colocarAparicion(r.accion, r.key, ctx);
  return { estado: "aplicada", hechos: r.accion === "proyectar" ? [{ primitiva: "ver", detalle: ast.nombre.trim() }] : [] };
}

function emitirEstados(
  ast: Extract<OracionOplAst, { kind: "estados" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  const propios = ast.estados.map(limpiarEstado).filter(Boolean);
  // Usa la UNIÓN (explícitos de esta línea + implícitos por transición de todo el
  // proto) para no perder estados intermedios declarados solo por uso.
  const union = ctx.estadosUnion.get(claveEntidad(ast.objeto));
  const nombres = union && union.length >= propios.length ? union : propios;
  if (nombres.length < 2) {
    return { estado: "fallo", razon: "un objeto con estados requiere ≥2 en OPM" };
  }
  // El portador de estados es un objeto; asegúralo creado.
  const r = ctx.resolutor.resolver(ast.objeto, ctx.opdClave, "objeto");
  // Si la entidad ya existe como PROCESO (el proto usa el mismo nombre como
  // proceso refinable y como objeto-con-estados — contradicción del proto), no
  // declaramos estados sobre un proceso: la serialización lo rechazaría. Se
  // reporta como exclusión (la línea no se pierde).
  if (r.tipo !== "objeto") {
    return { estado: "excluida", clase: "estados-sobre-proceso", razon: `'${ast.objeto.trim()}' ya es proceso; un proceso no porta estados en OPM` };
  }
  const hechos: HechoEmitido[] = [];
  if (r.accion === "crear") {
    ctx.autor.entidad(r.key, r.tipo, ast.objeto.trim(), r.rasgos.esencia, r.rasgos.afiliacion);
    hechos.push({ primitiva: "entidad", detalle: `objeto ${ast.objeto.trim()}` });
  }
  // designaciones inicial/final embebidas en la lista (`'a' (inicial)`) ya las
  // descarta el parser; el proto las declara con designacion-estado aparte.
  if (typeof r.key === "string" && !ctx.estadosDeclarados.has(r.key)) {
    ctx.autor.estados(r.key, nombres);
    ctx.estadosDeclarados.add(r.key);
  }
  colocarAparicion(r.accion, r.key, ctx);
  hechos.push({ primitiva: "estados", detalle: `${ast.objeto.trim()} (${nombres.length})` });
  return { estado: "aplicada", hechos };
}

/**
 * Normaliza un nombre de estado a la forma que el DSL almacena: sin comillas
 * envolventes, sin el prefijo literal `estado ` (que el parser deja cuando el
 * proto escribe `en estado 'x'` en lugar de `` en `x` ``), sin designación
 * adosada `(inicial)`. Espejo de `limpiarEstado` del parser + strip de comillas.
 */
function limpiarEstado(raw: string): string {
  return raw
    .trim()
    .replace(/^estado\s+/iu, "")
    .replace(/\([^)]*\)/gu, "")
    .replace(/^['"`]|['"`]$/gu, "")
    .replace(/\.$/u, "")
    .trim();
}

// ── Enlaces procedurales ───────────────────────────────────────────────────

function emitirProcedimental(
  ast: Extract<OracionOplAst, { kind: "procedimental" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  return emitirBase(ast.tipoEnlace, ast, ctx, {
    ...(ast.multiplicidadOrigen ? { multiplicidadOrigen: ast.multiplicidadOrigen } : {}),
    ...(ast.multiplicidadDestino ? { multiplicidadDestino: ast.multiplicidadDestino } : {}),
    ...(ast.demora ? { demora: ast.demora } : {}),
    ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
  });
}

/**
 * Emite un enlace a partir de un AstProcedimentalBase, resolviendo (origen,
 * destino) según el tipo (espejo de `planificar.ts:endpointsBase` +
 * `aplicar.ts:resolverExtremosPatch`) y colocando los estados en el lugar correcto:
 *
 *   - efecto: el estado va como metadato `estadoEntradaId/SalidaId` del enlace
 *     (es el único tipo donde la serialización lo admite) → `opts.entrada/salida`.
 *   - consumo/agente/instrumento con estado de entrada: el estado va EN el extremo
 *     ORIGEN (el objeto) como `extremoEstado` → `{estado, entidad}`.
 *   - resultado con estado de salida: el estado va EN el extremo DESTINO (el
 *     objeto) como `extremoEstado`.
 *
 * `extrasOpts` aporta multiplicidad/demora/etiqueta/modificador del llamador.
 */
function emitirBase(
  tipo: TipoEnlace,
  base: {
    proceso?: string;
    objeto?: string;
    origen?: string;
    destino?: string;
    estadoEntrada?: string;
    estadoSalida?: string;
  },
  ctx: ContextoEmision,
  extrasOpts: OpcionesEnlace,
): ResultadoEmision {
  const entrada = base.estadoEntrada ? limpiarEstado(base.estadoEntrada) : undefined;
  const salida = base.estadoSalida ? limpiarEstado(base.estadoSalida) : undefined;
  const proc = base.proceso ?? base.origen ?? base.destino;

  switch (tipo) {
    case "agente":
    case "instrumento":
    case "consumo": {
      if (!base.objeto || !base.proceso) return { estado: "fallo", razon: `extremos incompletos de ${tipo}` };
      const objetoKey = keyEntidad(base.objeto, ctx, "objeto");
      const procesoKey = keyEntidad(base.proceso, ctx, "proceso");
      // El estado de entrada (del objeto) va en el extremo origen.
      const origen: ExtremoEntrada = entrada && typeof objetoKey === "string"
        ? { estado: entrada, entidad: objetoKey }
        : objetoKey;
      return enlazar(ctx, origen, procesoKey, tipo, extrasOpts);
    }
    case "resultado": {
      if (!base.proceso || !base.objeto) return { estado: "fallo", razon: "extremos incompletos de resultado" };
      const procesoKey = keyEntidad(base.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(base.objeto, ctx, "objeto");
      // El estado de salida (del objeto) va en el extremo destino.
      const destino: ExtremoEntrada = salida && typeof objetoKey === "string"
        ? { estado: salida, entidad: objetoKey }
        : objetoKey;
      return enlazar(ctx, procesoKey, destino, "resultado", extrasOpts);
    }
    case "efecto": {
      if (!base.proceso || !base.objeto) return { estado: "fallo", razon: "extremos incompletos de efecto" };
      const procesoKey = keyEntidad(base.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(base.objeto, ctx, "objeto");
      // En efecto el estado va como metadato del enlace (estadoEntradaId/SalidaId).
      const opts: OpcionesEnlace = {
        ...extrasOpts,
        ...(entrada ? { entrada } : {}),
        ...(salida ? { salida } : {}),
      };
      return enlazar(ctx, procesoKey, objetoKey, "efecto", opts);
    }
    case "invocacion": {
      const origen = base.origen ?? proc;
      const destino = base.destino ?? proc;
      if (!origen || !destino) return { estado: "fallo", razon: "extremos incompletos de invocación" };
      return enlazar(ctx, keyEntidad(origen, ctx, "proceso"), keyEntidad(destino, ctx, "proceso"), "invocacion", extrasOpts);
    }
    default:
      return { estado: "fallo", razon: `tipo de enlace no manejado: ${tipo}` };
  }
}

function emitirEstructural(
  ast: Extract<OracionOplAst, { kind: "estructural" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  // Agregación/exhibición: origen objeto; generalización/clasificación: el
  // general/clase es el origen del enlace (`estructural.ts`/`planificar` mapean
  // `A es un B` → generalizacion(B, A): origen=B, destinos=[A]).
  const hechos: HechoEmitido[] = [];
  for (const destino of ast.destinos) {
    const opts: OpcionesEnlace = {
      ...(ast.multiplicidadDestino ? { multiplicidadDestino: ast.multiplicidadDestino } : {}),
      ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
    };
    const res = enlazar(
      ctx,
      keyEntidad(ast.origen, ctx, "objeto"),
      keyEntidad(destino, ctx, "objeto"),
      ast.tipoEnlace,
      opts,
    );
    if (res.estado === "aplicada") hechos.push(...res.hechos);
    else if (res.estado === "fallo") return res;
  }
  if (hechos.length === 0) return { estado: "fallo", razon: `estructural ${ast.tipoEnlace} sin destinos resolubles` };
  return { estado: "aplicada", hechos };
}

function emitirEvento(
  ast: Extract<OracionOplAst, { kind: "evento" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  if (!ast.base) {
    // "X inicia Y" pelado → invocacion proceso→proceso con modificador evento.
    const origen = keyEntidad(ast.iniciador, ctx, "proceso");
    const destino = keyEntidad(ast.proceso, ctx, "proceso");
    return enlazar(ctx, origen, destino, "invocacion", { modificador: "evento" });
  }
  const b = ast.base;
  return emitirBase(b.tipoEnlace, b, ctx, {
    modificador: "evento",
    ...(b.multiplicidadOrigen ? { multiplicidadOrigen: b.multiplicidadOrigen } : {}),
    ...(b.multiplicidadDestino ? { multiplicidadDestino: b.multiplicidadDestino } : {}),
    ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
  });
}

function emitirCondicion(
  ast: Extract<OracionOplAst, { kind: "condicion" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  // `condicionante` es el objeto; `proceso` el proceso. `emitirBase` los coloca
  // según el tipo. El estado del condicionante (CS*) no se inversea como extremo
  // desde el reverse (planificar.ts lo preserva pero no lo aplica) — lo omitimos
  // como el reverse, salvo `estadoSalida` de efecto (que sí va como metadato).
  return emitirBase(ast.base, {
    proceso: ast.proceso,
    objeto: ast.condicionante,
    ...(ast.estadoSalida ? { estadoSalida: ast.estadoSalida } : {}),
  }, ctx, {
    modificador: "condicion",
    ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
  });
}

function emitirAbanico(
  ast: Extract<OracionOplAst, { kind: "abanico" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  // Forma con estados (§11.3): el aplicador del reverse no inversa extremos de
  // estado desde el abanico — fuera del alcance L2 (registrar exclusión).
  if (ast.otrosEstados && ast.otrosEstados.length >= 2) {
    return { estado: "excluida", clase: "abanico-con-estados", razon: "abanico §11.3 con estados: extremos por estado fuera del alcance L2" };
  }
  const otrosTipo = ast.tipoEnlace === "invocacion" ? "proceso" : "objeto";
  const procesoKey = keyEntidad(ast.proceso, ctx, "proceso");
  const hechos: HechoEmitido[] = [];
  const enlaceIds: string[] = [];
  for (const otro of ast.otros) {
    const otroKey = keyEntidad(otro, ctx, otrosTipo);
    const rama = ramaEnlace(ast.tipoEnlace, ast.puertoEsOrigen, procesoKey, otroKey);
    const opts: OpcionesEnlace = ast.modificador ? { modificador: ast.modificador } : {};
    const id = ctx.autor.enlazar(ctx.opdKey, rama.origen, rama.destino, ast.tipoEnlace, opts);
    if (id) {
      enlaceIds.push(id);
      hechos.push({ primitiva: "enlace", detalle: `${ast.tipoEnlace} (rama abanico)` });
    }
  }
  if (enlaceIds.length < 2) {
    return { estado: "fallo", razon: "abanico con menos de 2 ramas resolubles" };
  }
  ctx.autor.abanico(ctx.opdKey, enlaceIds, ast.operador);
  hechos.push({ primitiva: "abanico", detalle: `${ast.operador} (${enlaceIds.length} ramas)` });
  return { estado: "aplicada", hechos };
}

function emitirExcepcion(
  _ast: Extract<OracionOplAst, { kind: "excepcion" }>,
  _ctx: ContextoEmision,
): ResultadoEmision {
  // Excepciones sobretiempo/subtiempo (#23): el DSL no expone superficie (Tanda 2
  // del inventario, fuera de W4.1). Registrar exclusión, no perder la línea.
  return { estado: "excluida", clase: "excepcion", razon: "excepción temporal sin primitiva de autoría (inventario §2, Tanda 2)" };
}

function emitirDesignacion(
  ast: Extract<OracionOplAst, { kind: "designacion-estado" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  const conocida = ctx.resolutor.buscar(ast.entidad);
  if (!conocida) return { estado: "fallo", razon: `designación: entidad '${ast.entidad}' no declarada` };
  if (ast.designacion === "inicial" || ast.designacion === "final") {
    // inicial/final ya se setean vía `estados(…, inicial, final)`; el proto los
    // declara con `'a' (inicial)` en la lista (descartado) o aquí. Reaplicar la
    // designación es seguro (idempotente vía `designarEstado`).
    ctx.autor.designarEstado(conocida.key, ast.estado, ast.designacion);
  } else {
    ctx.autor.designarEstado(conocida.key, ast.estado, ast.designacion);
  }
  return { estado: "aplicada", hechos: [{ primitiva: "designarEstado", detalle: `${ast.entidad} en '${ast.estado}' = ${ast.designacion}` }] };
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resuelve un nombre a su key del DSL para usarlo como extremo de enlace. Crea la
 * entidad si es nueva (con esencia/afiliación default; una descripción posterior
 * la afina), y coloca su aparición en el OPD activo (creación o proyección de otro
 * OPD). El layout (`aplicarLayoutCompleto`) reubica todas las apariencias después.
 */
function keyEntidad(nombre: string, ctx: ContextoEmision, tipo: "objeto" | "proceso"): ExtremoEntrada {
  const r = ctx.resolutor.resolver(nombre, ctx.opdClave, tipo);
  if (r.accion === "crear") {
    // Usa el tipo RESUELTO (semilla del contexto > hint posicional) y los rasgos
    // esencia/afiliación declarados en el proto: un proceso/agente nombrado antes
    // de su descripción se crea con el tipo y la esencia correctos.
    ctx.autor.entidad(r.key, r.tipo, nombre.trim(), r.rasgos.esencia, r.rasgos.afiliacion);
  }
  // Si la entidad es portadora de estados (unión del proto), decláralos ahora para
  // que las transiciones que la referencian con un estado los resuelvan.
  if (typeof r.key === "string") asegurarEstados(nombre, r.key, ctx);
  colocarAparicion(r.accion, r.key, ctx);
  return r.key;
}

/**
 * Coloca la aparición de una entidad en el OPD activo si hace falta. La validación
 * de integridad exige que TODA entidad extremo de un enlace tenga aparición en el
 * OPD del enlace; el DSL `entidad()` NO crea aparición (a diferencia de las
 * operaciones del kernel), por eso el emisor llama `ver()` explícitamente, como
 * hace el generador HODOM (388 `ver()`). En `reusar` ya hay aparición → no-op.
 * Las coordenadas son provisionales: el layout las reubica.
 */
function colocarAparicion(accion: "crear" | "reusar" | "proyectar", key: string, ctx: ContextoEmision): void {
  if (accion === "reusar") return;
  ctx.autor.ver(ctx.opdKey, key, 0, 0);
}

/**
 * Declara el state set COMPLETO de una entidad (unión explícita + implícita) la
 * primera vez que se la referencia, si el proto le atribuye ≥2 estados en algún
 * lugar. Idempotente por `estadosDeclarados`. Garantiza que una transición que
 * nombra un estado declarado solo por uso (no en `puede estar`) resuelva.
 */
function asegurarEstados(nombre: string, key: string, ctx: ContextoEmision): void {
  if (ctx.estadosDeclarados.has(key)) return;
  // Solo los OBJETOS portan estados en OPM; nunca declarar estados sobre un proceso
  // (la serialización rechaza un estado cuyo `entidadId` es un proceso).
  const conocida = ctx.resolutor.buscar(nombre);
  if (conocida && conocida.tipo !== "objeto") return;
  const union = ctx.estadosUnion.get(claveEntidad(nombre));
  if (!union || union.length < 2) return;
  ctx.estadosDeclarados.add(key);
  ctx.autor.estados(key, union);
}

/** Forma el enlace vía DSL y lo contabiliza; resuelve fallos de firma del kernel. */
function enlazar(
  ctx: ContextoEmision,
  origen: ExtremoEntrada,
  destino: ExtremoEntrada,
  tipo: TipoEnlace,
  opts: OpcionesEnlace,
): ResultadoEmision {
  try {
    const id = ctx.autor.enlazar(ctx.opdKey, origen, destino, tipo, opts);
    // `enlazar` devuelve null cuando consume una agregación contorno→sub como
    // contención interna (no hay enlace, pero es semántica válida del in-zoom).
    return { estado: "aplicada", hechos: [{ primitiva: "enlace", detalle: id ? tipo : `${tipo} (contención interna)` }] };
  } catch (e) {
    return { estado: "fallo", razon: e instanceof Error ? e.message : String(e) };
  }
}

/** Calcula (origen, destino) de una rama de abanico (espejo de `ramaEnlaceAbanico`). */
function ramaEnlace(
  tipo: TipoEnlace,
  puertoEsOrigen: boolean,
  procesoKey: ExtremoEntrada,
  otroKey: ExtremoEntrada,
): { origen: ExtremoEntrada; destino: ExtremoEntrada } {
  if (tipo === "efecto") return { origen: procesoKey, destino: otroKey };
  return puertoEsOrigen
    ? { origen: procesoKey, destino: otroKey }
    : { origen: otroKey, destino: procesoKey };
}
