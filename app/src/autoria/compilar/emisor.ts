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
import { aplicarModificador } from "../../modelo/modificadores";
import { Resolutor } from "./resolutor";
import type { Directiva, Emision, LineaNormalizada } from "./tipos";

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

/** Resultado de emitir UNA oración o directiva. `enlaceIds` lista los enlaces
 *  creados (cuando aplica), para que una línea `compuesta` pueda agruparlos en un
 *  abanico (familia V14/V15). `entidadKey` es la CLAVE DE DOMINIO de la entidad
 *  PRINCIPAL que la línea declara (target preferente de un ancla cuando la línea no
 *  emite enlace — W5.2; la consume `ctx.autor.ancla({entidad: key})`). */
export type ResultadoEmision =
  | { estado: "aplicada"; hechos: HechoEmitido[]; enlaceIds?: string[]; entidadKey?: string }
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
  /**
   * Registro de enlaces procedurales emitidos por OPD: `opdKey|origenKey>destinoKey`
   * → Id del enlace. Permite la ADJUNCIÓN del evento sin portador (tensión 1): si
   * un enlace procedimental X→P ya existe en el OPD (p.ej. un `requiere` previo),
   * el evento no crea un duplicado — adjunta `modificador: evento` + estado de
   * gatillo al enlace existente. Y al revés: un `requiere` posterior reusa el
   * instrumento-evento que el evento ya creó (no duplica). Provisto por el
   * compilador y compartido entre OPDs (la clave incluye el OPD).
   */
  enlacesProcedurales: Map<string, string>;
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
      } else if (a.kind === "evento") {
        // El estado-gatillo del iniciador lo porta el iniciador (objeto), tenga o
        // no sub-cláusula base — el evento sin portador (`X en \`s\` inicia P`)
        // también lo declara para X (tensión 1: el instrumento-evento lo usa).
        if (a.iniciadorEstado) agregar(a.iniciador, [a.iniciadorEstado]);
        if (a.base?.estadoEntrada) agregar(a.base.objeto ?? "", [a.base.estadoEntrada]);
        if (a.base?.estadoSalida) agregar(a.base.objeto ?? "", [a.base.estadoSalida]);
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
 * Tensión 3 — preferir el nombre conocido más largo. El parser parte
 * `Objeto en X` por el último ` en `: `Resumen clínico en domicilio` →
 * `objeto="Resumen clínico"`, `estado="domicilio"`. Si `"objeto en estado"`
 * reconstruye una ENTIDAD CONOCIDA del proto (declarada p.ej. en una lista
 * `consta de`), devolvemos el nombre COMPLETO y descartamos el estado espurio.
 * Si no, devolvemos los extremos tal cual (el ` en ` SÍ era un estado).
 */
function reconstituirNombreConEn(
  objeto: string | undefined,
  estado: string | undefined,
  ctx: ContextoEmision,
): { nombre: string; estado: string | undefined; merged: boolean } {
  if (!objeto || !estado) return { nombre: objeto ?? "", estado, merged: false };
  const estadoLimpio = estado.replace(/^['"`]|['"`]$/gu, "").trim();
  const completo = `${objeto.trim()} en ${estadoLimpio}`;
  // Preferir el nombre conocido MÁS LARGO: si el nombre completo es una entidad
  // conocida del proto, gana sobre la lectura `objeto + estado` (el ` en ` era
  // parte del nombre, no un estado). Si el completo NO es conocido pero el objeto
  // sí porta ese estado (declarado), respetamos la lectura de estado.
  if (ctx.resolutor.esConocido(completo)) {
    return { nombre: completo, estado: undefined, merged: true };
  }
  return { nombre: objeto, estado, merged: false };
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
    return { estado: "aplicada", hechos: [{ primitiva: "entidad", detalle: `${ast.tipoEntidad} ${ast.nombre.trim()}` }], entidadKey: r.key };
  }
  // La cosa ya existe: una segunda descripción es idempotente para el bootstrap
  // (no re-creamos ni mutamos esencia/afiliación — el proto declara una vez).
  // Si la mención cae en otro OPD, asegura su aparición vía `ver()`.
  colocarAparicion(r.accion, r.key, ctx);
  return { estado: "aplicada", hechos: r.accion === "proyectar" ? [{ primitiva: "ver", detalle: ast.nombre.trim() }] : [], entidadKey: r.key };
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
  return { estado: "aplicada", hechos, ...(typeof r.key === "string" ? { entidadKey: r.key } : {}) };
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
  // Tensión 3: el parser parte `Objeto en X` en `objeto` + estado `X` por el
  // último ` en `. Si `Objeto en X` es una ENTIDAD CONOCIDA del proto (declarada
  // p.ej. en una lista `consta de`: `Resumen clínico en domicilio`), preferimos
  // el nombre conocido COMPLETO y descartamos el estado espurio.
  const ent = reconstituirNombreConEn(base.objeto, base.estadoEntrada, ctx);
  const sal = reconstituirNombreConEn(base.objeto, base.estadoSalida, ctx);
  const objetoEntrada = ent.nombre;
  const objetoSalida = sal.nombre;
  const entrada = ent.estado ? limpiarEstado(ent.estado) : undefined;
  const salida = sal.estado ? limpiarEstado(sal.estado) : undefined;
  const proc = base.proceso ?? base.origen ?? base.destino;

  switch (tipo) {
    case "agente":
    case "instrumento":
    case "consumo": {
      if (!base.objeto || !base.proceso) return { estado: "fallo", razon: `extremos incompletos de ${tipo}` };
      const objetoKey = keyEntidad(objetoEntrada, ctx, "objeto");
      const procesoKey = keyEntidad(base.proceso, ctx, "proceso");
      // El estado de entrada (del objeto) va en el extremo origen.
      const origen: ExtremoEntrada = entrada && typeof objetoKey === "string"
        ? { estado: entrada, entidad: objetoKey }
        : objetoKey;
      // Instrumento pasa por dedup (simetría con el evento sin portador: un
      // `requiere` posterior reusa el instrumento-evento que el evento creó).
      return tipo === "instrumento"
        ? enlazarConDedup(ctx, origen, procesoKey, tipo, extrasOpts)
        : enlazar(ctx, origen, procesoKey, tipo, extrasOpts);
    }
    case "resultado": {
      if (!base.proceso || !base.objeto) return { estado: "fallo", razon: "extremos incompletos de resultado" };
      const procesoKey = keyEntidad(base.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(objetoSalida, ctx, "objeto");
      // El estado de salida (del objeto) va en el extremo destino.
      const destino: ExtremoEntrada = salida && typeof objetoKey === "string"
        ? { estado: salida, entidad: objetoKey }
        : objetoKey;
      return enlazar(ctx, procesoKey, destino, "resultado", extrasOpts);
    }
    case "efecto": {
      if (!base.proceso || !base.objeto) return { estado: "fallo", razon: "extremos incompletos de efecto" };
      const procesoKey = keyEntidad(base.proceso, ctx, "proceso");
      // Nombre reconstituido (tensión 3): prefiere el merge que sí ocurrió.
      const objetoEfecto = ent.merged ? objetoEntrada : sal.merged ? objetoSalida : base.objeto;
      const objetoKey = keyEntidad(objetoEfecto, ctx, "objeto");
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
  //
  // Tensión 4 — agregación HOMOGÉNEA. Agregación/generalización/clasificación son
  // de clase única (el kernel exige mismo lado OPM); `exhibicion` NO (admite
  // cross-class: un objeto exhibe un proceso-operación). Para los homogéneos: el
  // TODO fija la clase; una PARTE sin clase OPM propia HEREDA la del todo
  // (objeto⊃objetos, proceso⊃procesos). Una parte con clase contraria EXPLÍCITA
  // es contradicción real del proto → diagnóstico (no silencio, no herencia
  // forzada que la oculte).
  const homogeneo = ast.tipoEnlace === "agregacion" || ast.tipoEnlace === "generalizacion" || ast.tipoEnlace === "clasificacion";
  const claseTodo = claseDeNombre(ast.origen, ctx, "objeto");
  const origenKey = keyEntidad(ast.origen, ctx, homogeneo ? claseTodo : "objeto");

  // El parser divide la lista por ` y `, fragmentando nombres con ` y ` interno
  // (`Vigilancia y monitorización clínica` → `Vigilancia` + `monitorización
  // clínica`). Re-junta los fragmentos adyacentes cuando su unión es una entidad
  // CONOCIDA del proto (nombre más largo gana, tensión 3/4).
  const destinos = rejuntarDestinos(ast.destinos, ctx);

  const hechos: HechoEmitido[] = [];
  for (const destino of destinos) {
    const claseParte = claseDeNombre(destino, ctx, homogeneo ? claseTodo : "objeto");
    if (homogeneo && claseParte !== claseTodo && ctx.resolutor.tieneClaseExplicita(destino)) {
      return {
        estado: "fallo",
        razon:
          `agregación heterogénea: '${ast.origen.trim()}' es ${claseTodo} pero '${destino.trim()}' ` +
          `está declarado ${claseParte} en otra parte del proto (clase contraria explícita)`,
      };
    }
    const opts: OpcionesEnlace = {
      ...(ast.multiplicidadDestino ? { multiplicidadDestino: ast.multiplicidadDestino } : {}),
      ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
    };
    // En homogéneo la parte hereda la clase del todo (salvo clase explícita propia,
    // ya filtrada): `forzarTipo` ignora una semilla débil/over-split contraria. En
    // exhibición se resuelve con su clase conocida/sembrada.
    const res = enlazar(
      ctx,
      origenKey,
      keyEntidad(destino, ctx, homogeneo ? claseTodo : claseParte, homogeneo),
      ast.tipoEnlace,
      opts,
    );
    if (res.estado === "aplicada") hechos.push(...res.hechos);
    else if (res.estado === "fallo") return res;
  }
  if (hechos.length === 0) return { estado: "fallo", razon: `estructural ${ast.tipoEnlace} sin destinos resolubles` };
  return { estado: "aplicada", hechos };
}

/**
 * Re-junta fragmentos de lista que el parser partió por un ` y ` INTERNO de un
 * nombre compuesto. Greedy de izquierda a derecha: para cada posición intenta la
 * unión más larga `frag_i y frag_{i+1} [y …]` que sea una entidad CONOCIDA del
 * proto; si la encuentra, la consume entera. Si no, deja el fragmento tal cual.
 * Idempotente cuando no hay nombres compuestos (devuelve la lista original).
 */
function rejuntarDestinos(destinos: string[], ctx: ContextoEmision): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < destinos.length) {
    // Busca la unión MÁS CORTA `frag_i [y frag_{i+1} …]` (≥2 fragmentos) que sea
    // una entidad conocida — el PRIMER nombre completo gana, sin tragarse el
    // siguiente ítem de la lista. Si ninguna unión es conocida, deja el fragmento
    // solo (el ` y ` era separador de lista, no nombre interno).
    let mejorFin = i;
    let candidato = destinos[i]!;
    let acumulado = destinos[i]!;
    for (let j = i + 1; j < destinos.length; j++) {
      acumulado = `${acumulado} y ${destinos[j]!}`;
      if (ctx.resolutor.esConocido(acumulado)) {
        mejorFin = j;
        candidato = acumulado;
        break; // primer nombre completo conocido: no seguir extendiendo
      }
    }
    out.push(candidato);
    i = mejorFin + 1;
  }
  return out;
}

/** Clase OPM con que se resolverá un nombre: la ya conocida/sembrada si existe,
 *  o el `default` (la clase del todo, en agregación homogénea). NO crea entidad. */
function claseDeNombre(nombre: string, ctx: ContextoEmision, porDefecto: "objeto" | "proceso"): "objeto" | "proceso" {
  const conocida = ctx.resolutor.buscar(nombre);
  if (conocida) return conocida.tipo === "proceso" ? "proceso" : "objeto";
  const sembrado = ctx.resolutor.tipoSemillaDe(nombre);
  return sembrado === "proceso" ? "proceso" : sembrado === "objeto" ? "objeto" : porDefecto;
}

function emitirEvento(
  ast: Extract<OracionOplAst, { kind: "evento" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  if (!ast.base) {
    return emitirEventoSinPortador(ast, ctx);
  }
  const b = ast.base;
  return emitirBase(b.tipoEnlace, b, ctx, {
    modificador: "evento",
    ...(b.multiplicidadOrigen ? { multiplicidadOrigen: b.multiplicidadOrigen } : {}),
    ...(b.multiplicidadDestino ? { multiplicidadDestino: b.multiplicidadDestino } : {}),
    ...(ast.etiqueta ? { etiqueta: ast.etiqueta } : {}),
  });
}

/**
 * Evento de la forma desnuda `X [en \`s\`] inicia P` (sin cola `, que <verbo> Z`).
 * El parser no le adjunta un enlace BASE portador, así que aquí lo completamos a
 * la forma canónica SSOT §6 (tensión 1, decisión del operador):
 *
 *   - Si el INICIADOR es un PROCESO → `invocacion` proceso→proceso `modificador:
 *     evento` (comportamiento previo; `Ajuste terapéutico inicia Prescribir`).
 *   - Si el INICIADOR es un OBJETO con estado-gatillo `s` (`Paciente en
 *     \`hospitalizado…\` inicia Operación clínica`) → el proceso usa el estado
 *     como gatillo SIN consumirlo: instrumento `requiere` X→P con estado en el
 *     extremo origen y `modificador: evento` (idiom V-59).
 *
 * ADJUNCIÓN (no duplicar): si en el MISMO OPD ya existe un instrumento X→P
 * declarado por otra oración (`Operación clínica requiere Paciente en \`s\``),
 * se ADJUNTA el modificador `evento` al enlace existente en lugar de crear un
 * segundo enlace. Y a la inversa: un `requiere` posterior reusa el instrumento-
 * evento que el evento ya creó (la dedup la cierra `emitirBase` vía el registro).
 */
function emitirEventoSinPortador(
  ast: Extract<OracionOplAst, { kind: "evento" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  return emitirEventoCore(
    ast.iniciador,
    ast.proceso,
    ast.iniciadorEstado ? limpiarEstado(ast.iniciadorEstado) : undefined,
    ctx,
    ast.etiqueta,
  );
}

/**
 * Núcleo del evento sin portador (ruta W4.3), reusable por el AST `evento` y por
 * la directiva `evento` de la familia V (V3/V13/V14/V15). Un iniciador proceso (o
 * sin estado-gatillo) produce una invocación proceso→proceso evento; un iniciador
 * objeto-en-estado produce un instrumento-evento con el gatillo en el origen
 * (gatillo sin consumo, V-59) — sin gatillo si el objeto no porta ≥2 estados.
 */
function emitirEventoCore(
  iniciador: string,
  proceso: string,
  estado: string | undefined,
  ctx: ContextoEmision,
  etiqueta?: string,
): ResultadoEmision {
  const iniciadorTipo = ctx.resolutor.buscar(iniciador)?.tipo ?? tipoSembrado(iniciador, ctx);

  // Iniciador proceso (o sin estado-gatillo): invocacion proceso→proceso evento.
  if (iniciadorTipo === "proceso" || !estado) {
    const origen = keyEntidad(iniciador, ctx, "proceso");
    const destino = keyEntidad(proceso, ctx, "proceso");
    return enlazarConDedup(ctx, origen, destino, "invocacion", { modificador: "evento" });
  }

  // Iniciador objeto-en-estado: instrumento-evento (gatillo sin consumo, V-59).
  const objetoKey = keyEntidad(iniciador, ctx, "objeto");
  const procesoKey = keyEntidad(proceso, ctx, "proceso");
  const tieneStateSet = (ctx.estadosUnion.get(claveEntidad(iniciador))?.length ?? 0) >= 2;
  const origen: ExtremoEntrada =
    estado && tieneStateSet && typeof objetoKey === "string" ? { estado, entidad: objetoKey } : objetoKey;
  return enlazarConDedup(ctx, origen, procesoKey, "instrumento", {
    modificador: "evento",
    ...(etiqueta ? { etiqueta } : {}),
  });
}

/** Tipo pre-sembrado del contexto para un nombre aún no creado. */
function tipoSembrado(nombre: string, ctx: ContextoEmision): "objeto" | "proceso" {
  return ctx.resolutor.tipoSemillaDe(nombre) ?? "objeto";
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
function keyEntidad(nombre: string, ctx: ContextoEmision, tipo: "objeto" | "proceso", forzarTipo = false): ExtremoEntrada {
  const r = ctx.resolutor.resolver(nombre, ctx.opdClave, tipo, forzarTipo);
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
    // Registra el enlace procedural (clave por OPD + extremos-entidad + tipo) para
    // la adjunción/dedup del evento sin portador (tensión 1).
    if (id) ctx.enlacesProcedurales.set(claveEnlace(ctx.opdKey, origen, destino, tipo), id);
    // `enlazar` devuelve null cuando consume una agregación contorno→sub como
    // contención interna (no hay enlace, pero es semántica válida del in-zoom).
    return {
      estado: "aplicada",
      hechos: [{ primitiva: "enlace", detalle: id ? tipo : `${tipo} (contención interna)` }],
      ...(id ? { enlaceIds: [id] } : {}),
    };
  } catch (e) {
    return { estado: "fallo", razon: e instanceof Error ? e.message : String(e) };
  }
}

/** Clave de un enlace procedural en el registro (OPD + entidades-extremo + tipo).
 *  Ignora el estado de un extremo `{estado, entidad}`: lo que importa para la
 *  dedup del evento es el par de entidades y el tipo, no el estado-gatillo. */
function claveEnlace(opdKey: string, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace): string {
  return `${opdKey}|${entidadDeExtremo(origen)}>${entidadDeExtremo(destino)}|${tipo}`;
}

/**
 * Enlaza con dedup/adjunción (tensión 1). Antes de crear, mira el registro:
 *
 *   - Si YA existe un enlace del mismo (OPD, extremos-entidad, tipo):
 *     · si esta emisión trae `modificador: evento` y el existente no lo tiene →
 *       ADJUNTA el modificador evento al existente (no duplica). Si el existente
 *       trae un estado-gatillo solo en esta emisión, lo re-apunta al origen.
 *     · si no aporta nada nuevo (ya es evento, o esta emisión es el `requiere`
 *       plano y el existente ya es instrumento-evento) → reusa, idempotente.
 *   - Si no existe → crea normalmente (vía `enlazar`, que lo registra).
 */
function enlazarConDedup(
  ctx: ContextoEmision,
  origen: ExtremoEntrada,
  destino: ExtremoEntrada,
  tipo: TipoEnlace,
  opts: OpcionesEnlace,
): ResultadoEmision {
  const clave = claveEnlace(ctx.opdKey, origen, destino, tipo);
  const existenteId = ctx.enlacesProcedurales.get(clave);
  if (existenteId) {
    const existente = ctx.autor.modelo.enlaces[existenteId];
    if (existente) {
      // Adjunta el modificador evento si esta emisión lo pide y el existente no
      // lo tiene (la oración `requiere` plana ya creó el instrumento; el evento
      // lo convierte en gatillo). Re-apunta el origen al estado-gatillo si esta
      // emisión lo aporta y el existente no.
      let cambio = false;
      if (opts.modificador === "evento" && existente.modificador !== "evento") {
        const aplicado = aplicarModificador(ctx.autor.modelo, existenteId, "evento");
        if (aplicado.ok) {
          ctx.autor.modelo.enlaces[existenteId] = aplicado.value.enlaces[existenteId]!;
          cambio = true;
        }
      }
      // El existente apuntaba a la entidad pelada y esta emisión aporta el
      // estado-gatillo en el origen → re-apunta el origen al estado (idempotente
      // con el reverse: el gatillo vive en el extremo origen del instrumento).
      if (typeof origen !== "string" && ctx.autor.modelo.enlaces[existenteId]!.origenId.kind === "entidad") {
        const estadoId = ctx.autor.idEstado(origen.entidad, origen.estado);
        ctx.autor.modelo.enlaces[existenteId] = {
          ...ctx.autor.modelo.enlaces[existenteId]!,
          origenId: { kind: "estado", id: estadoId },
        };
        cambio = true;
      }
      // Idempotente: ya existe el enlace (con o sin upgrade). No duplica.
      return {
        estado: "aplicada",
        hechos: cambio ? [{ primitiva: "enlace", detalle: `${tipo} (adjunción evento)` }] : [],
        enlaceIds: [existenteId],
      };
    }
  }
  return enlazar(ctx, origen, destino, tipo, opts);
}

/** Extrae la key de entidad de un ExtremoEntrada (entidad sola o `{estado, entidad}`). */
function entidadDeExtremo(e: ExtremoEntrada): string {
  return typeof e === "string" ? e : e.entidad;
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

// ── FAMILIA V — emisión de líneas compuestas y directivas ───────────────────

/** Contador global de claveProto para anclas de cola (la unicidad la exige el DSL). */
let claveAnclaSeq = 0;

/**
 * Emite una línea `compuesta` (familia V): cada emisión (oración o directiva)
 * produce 0..N hechos; si la línea pide `agrupar`, forma un abanico XOR/OR sobre
 * los enlaces creados por las emisiones. Devuelve una emisión `aplicada` con
 * todos los hechos, o `fallo`/`excluida` si una emisión falla.
 */
export function emitirCompuesta(
  linea: Extract<LineaNormalizada, { clase: "compuesta" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  const hechos: HechoEmitido[] = [];
  const enlaceIds: string[] = [];
  for (const emision of linea.emisiones) {
    const res = emitirEmision(emision, ctx);
    if (res.estado === "fallo") return res;
    if (res.estado === "excluida") return res;
    hechos.push(...res.hechos);
    if (res.enlaceIds) enlaceIds.push(...res.enlaceIds);
  }
  // Abanico XOR/OR sobre los enlaces creados (V14/V15). Requiere ≥2 enlaces que
  // compartan un puerto (el proceso/iniciador común) y sean HOMOGÉNEOS (mismo
  // tipo) — restricción del kernel. La agrupación es BEST-EFFORT: si los enlaces
  // son heterogéneos (p.ej. V14: un efecto-TS y una invocación-evento no son del
  // mismo tipo y el kernel no los agrupa en un único abanico), los enlaces se
  // CONSERVAN y la línea NO falla — la decisión XOR queda anotada como ancla
  // pendiente sobre los enlaces (canal de modelado fino), no se pierde.
  if (linea.agrupar && enlaceIds.length >= 2) {
    const operador = linea.agrupar.operador === "XOR" ? "XOR" : "O";
    try {
      ctx.autor.abanico(ctx.opdKey, enlaceIds, operador);
      hechos.push({ primitiva: "abanico", detalle: `${operador} (${enlaceIds.length} ramas)` });
    } catch {
      // Heterogéneo (o sin puerto común): no se forma el abanico, pero la decisión
      // XOR se preserva como ancla pendiente sobre cada rama (no se aborta el hecho).
      for (const enlaceId of enlaceIds) {
        adjuntarAncla(ctx, enlaceId, `decisión ${operador} entre ${enlaceIds.length} consecuencias alternativas (modelado fino pendiente)`);
      }
      hechos.push({ primitiva: "ver", detalle: `${operador} no agrupable (ramas heterogéneas); anotado` });
    }
  }
  return { estado: "aplicada", hechos, enlaceIds };
}

/** Emite una emisión individual: oración (ruta parser) o directiva (ruta directa). */
function emitirEmision(emision: Emision, ctx: ContextoEmision): ResultadoEmision {
  if (emision.via === "oracion") return emitirOracion(emision.oracion, ctx);
  return emitirDirectiva(emision.directiva, ctx);
}

/**
 * Emite una DIRECTIVA de la familia V directamente al DSL (sin pasar por el
 * parser→AST), para los efectos que el parser reverse no sabe re-leer (tagged,
 * modificador con gatillo, anotaciones). Devuelve el/los enlace(s) creados.
 */
function emitirDirectiva(directiva: Directiva, ctx: ContextoEmision): ResultadoEmision {
  switch (directiva.tipo) {
    case "instrumento-condicion": {
      // X→P instrumento con `modificador: condicion`, gatillo opcional en origen.
      const procesoKey = keyEntidad(directiva.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(directiva.objeto, ctx, "objeto");
      const tieneStateSet = (ctx.estadosUnion.get(claveEntidad(directiva.objeto))?.length ?? 0) >= 2;
      const origen: ExtremoEntrada =
        directiva.estado && tieneStateSet && typeof objetoKey === "string"
          ? { estado: directiva.estado, entidad: objetoKey }
          : objetoKey;
      return enlazar(ctx, origen, procesoKey, "instrumento", { modificador: "condicion" });
    }
    case "evento":
      return emitirEventoCore(directiva.iniciador, directiva.proceso, directiva.estado, ctx);
    case "instrumento": {
      const procesoKey = keyEntidad(directiva.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(directiva.objeto, ctx, "objeto");
      return enlazarConDedup(ctx, objetoKey, procesoKey, "instrumento", {});
    }
    case "resultado": {
      const procesoKey = keyEntidad(directiva.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(directiva.objeto, ctx, "objeto");
      return enlazar(ctx, procesoKey, objetoKey, "resultado", {});
    }
    case "efecto-anotado": {
      // P afecta O, con el verbo original (compromete/libera) en la etiqueta del
      // enlace — canal serializable que round-trip en el OPL forward (`[etiqueta: …]`).
      const procesoKey = keyEntidad(directiva.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(directiva.objeto, ctx, "objeto");
      return enlazar(ctx, procesoKey, objetoKey, "efecto", { etiqueta: directiva.anotacionEtiqueta });
    }
    case "transicion": {
      // Efecto P→O con estado de salida, resolviendo el objeto por su nombre
      // COMPLETO (sin la degradación parser que parte ` de ` en objeto+estado).
      const procesoKey = keyEntidad(directiva.proceso, ctx, "proceso");
      const objetoKey = keyEntidad(directiva.objeto, ctx, "objeto");
      const opts: OpcionesEnlace = {
        salida: directiva.estadoSalida,
        ...(directiva.estadoEntrada ? { entrada: directiva.estadoEntrada } : {}),
      };
      return enlazar(ctx, procesoKey, objetoKey, "efecto", opts);
    }
    case "invocacion": {
      const origenKey = keyEntidad(directiva.origen, ctx, "proceso");
      const destinoKey = keyEntidad(directiva.destino, ctx, "proceso");
      return enlazar(ctx, origenKey, destinoKey, "invocacion", {});
    }
    case "tagged":
      return emitirTagged(directiva, ctx);
    case "hecho-anotado":
      return emitirHechoAnotado(directiva, ctx);
    default:
      return { estado: "fallo", razon: `directiva no manejada: ${(directiva as { tipo: string }).tipo}` };
  }
}

/**
 * Emite un enlace estructural TAGGED (`etiquetado`) origen→destino con `etiqueta`.
 * El generador OPL forward lo emite como `Origen <etiqueta> Destino.` (round-trip
 * forward); el parser reverse no lo re-lee (no hay `kind` de AST tagged). La cola
 * opcional (`para el acto`) se adjunta como ancla normativa pendiente.
 */
function emitirTagged(
  directiva: Extract<Directiva, { tipo: "tagged" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  const origenKey = keyEntidad(directiva.origen, ctx, "objeto");
  const destinoKey = keyEntidad(directiva.destino, ctx, "objeto");
  const opts: OpcionesEnlace = {
    etiqueta: directiva.etiqueta,
    ...(directiva.multiplicidadDestino ? { multiplicidadDestino: directiva.multiplicidadDestino } : {}),
  };
  let enlaceId: string | null = null;
  try {
    enlaceId = ctx.autor.enlazar(ctx.opdKey, origenKey, destinoKey, "etiquetado", opts);
  } catch (e) {
    return { estado: "fallo", razon: e instanceof Error ? e.message : String(e) };
  }
  if (!enlaceId) return { estado: "fallo", razon: "enlace etiquetado no creado" };
  const hechos: HechoEmitido[] = [{ primitiva: "enlace", detalle: `etiquetado «${directiva.etiqueta}»` }];
  if (directiva.colaAnotada) {
    adjuntarAncla(ctx, enlaceId, directiva.colaAnotada);
    hechos.push({ primitiva: "ver", detalle: `cola anotada: ${directiva.colaAnotada}` });
  }
  return { estado: "aplicada", hechos, enlaceIds: [enlaceId] };
}

/**
 * Emite el hecho principal (una oración estricta) y adjunta su cola de modelado
 * fino como ancla normativa PENDIENTE sobre el enlace que la oración crea (V12).
 */
function emitirHechoAnotado(
  directiva: Extract<Directiva, { tipo: "hecho-anotado" }>,
  ctx: ContextoEmision,
): ResultadoEmision {
  const res = emitirOracion(directiva.oracion, ctx);
  if (res.estado === "aplicada" && res.enlaceIds && res.enlaceIds.length > 0) {
    adjuntarAncla(ctx, res.enlaceIds[res.enlaceIds.length - 1]!, directiva.colaAnotada);
    return {
      estado: "aplicada",
      hechos: [{ primitiva: "ver", detalle: `cola anotada: ${directiva.colaAnotada}` }],
      ...(res.enlaceIds ? { enlaceIds: res.enlaceIds } : {}),
    };
  }
  // Si la oración principal no creó un enlace al que anclar (idempotencia, dedup),
  // la cola no tiene destino enlace — se descarta sin perder el hecho principal.
  return { estado: "aplicada", hechos: [] };
}

/** Adjunta una ancla normativa PENDIENTE (cola de modelado fino) sobre un enlace. */
function adjuntarAncla(ctx: ContextoEmision, enlaceId: string, nota: string): void {
  try {
    ctx.autor.ancla(
      { enlace: enlaceId },
      {
        claveProto: `cola-fina-${++claveAnclaSeq}`,
        estado: "pendiente-ratificacion",
        nota,
        nivelAutoridad: "operador-modelado",
      },
    );
  } catch {
    // El ancla es trazabilidad meta; un fallo de adjunción no debe abortar el hecho.
  }
}
