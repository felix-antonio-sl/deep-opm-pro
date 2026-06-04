// DSL imperativo re-entrante para construir un Modelo OPM programáticamente (dominio-agnóstico).
// Extraído del generador de hd-opm; los globales de módulo se convirtieron en estado de instancia
// (closure de `crearAutor`), de modo que se pueden construir N modelos por proceso sin colisión.
//
// W3.2 (D4 del acta de consenso) — validación incremental sobre las operaciones del kernel:
// El DSL escribe los bytes del modelo directamente (conserva su esquema de ids `e-${seq}`/`a-${seq}`/
// `ae-${seq}`/`o|p-${key}`/`opd-${key}`/`s-${key}-${slug}`, exigido por la byte-identidad del bundle
// golden de hd-opm). Pero la VALIDACIÓN de firmas ya NO es implícita: `enlazar` compone el validador
// canónico del kernel (`validarFirmaEnlace`, la misma firma que usa `crearEnlace`) y RECHAZA en el
// punto de construcción —no en la emisión— todo enlace cuya firma sea ilegal (p.ej. agente
// objeto→objeto, consumo proceso→objeto). Se eligió la vía (b) del brief (componer la validación
// del kernel con la escritura del DSL) sobre la vía (a) (extender las operaciones kernel con un
// `idForzado`): las operaciones `crearObjeto`/`crearProceso`/`crearEnlace` acoplan creación de
// entidad+apariencia, fuerzan esencia/afiliación canónicas, renombran por unicidad
// (`nombreUnicoEntidad`) y refuerzan por ontología — todas mutaciones que CAMBIARÍAN los bytes del
// bundle. La vía (b) gana la validación temprana sin tocar la salida (verificado: los 433 enlaces
// del golden HODOM pasan `validarFirmaEnlace`).
//
// Residuo documentado (deuda visible): la creación de ENTIDADES (`entidad`/`atributo`/…) NO pasa por
// `crearObjeto`/`crearProceso`. Esas operaciones (1) generan id propio vía `nextSeq` —incompatible
// con el esquema `o|p-${key}` del DSL—, (2) fuerzan `esencia: "informacional"`/`afiliacion:
// "sistemica"` —el DSL toma esencia/afiliación arbitrarias del autor—, (3) renombran por unicidad
// y refuerzan por ontología —el DSL preserva el nombre EXACTO del autor, pilar de la byte-identidad—
// y (4) crean apariencia acoplada —el DSL separa `entidad()` de `ver()`. Pasar entidades por el
// kernel sin re-pin del golden es imposible hoy; queda como deuda para cuando se versione el bundle.
import type {
  Afiliacion,
  Apariencia,
  AparienciaEnlace,
  Entidad,
  Esencia,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  SubtipoModificador,
  TipoEnlace,
} from "../modelo/tipos";
import { entidadDeExtremo } from "../modelo/extremos";
import { validarFirmaEnlace } from "../modelo/operaciones/helpers";
import type { EntKey, ExtremoEntrada, OpcionesAutor, OpcionesEnlace, OpdKey } from "./tipos";

export interface Autor {
  /** El modelo en construcción (mutado por los métodos). */
  readonly modelo: Modelo;
  /** Mapa OPD→entidades registradas como internas de su in-zoom (consumidas de las agregaciones al contorno). */
  readonly internosInzoom: Map<Id, Set<Id>>;
  /** Resuelve el Id de una entidad por su clave (lanza si no existe). */
  id(key: EntKey): Id;
  /** Resuelve el Id de un OPD por su clave (lanza si no existe). */
  idOpd(key: OpdKey): Id;
  /** Resuelve el Id de un estado por (entidad, nombre de estado). */
  idEstado(entidadKey: EntKey, estado: string): Id;
  /** Declara un OPD. padreKey=null lo marca como raíz (el primero fija modelo.opdRaizId). */
  opd(key: OpdKey, nombre: string, padreKey?: OpdKey | null, ordenLocal?: number): Id;
  /** Declara una entidad (objeto/proceso). */
  entidad(key: EntKey, tipo: "objeto" | "proceso", nombre: string, esencia: Esencia, afiliacion: Afiliacion, descripcion?: string): Id;
  /** Azúcar: declara un atributo (objeto informacional/sistémico con value slot). */
  atributo(key: EntKey, nombre: string, descripcion?: string): Id;
  /** Azúcar: atributo cuyos valores son estados discretos (caracterización con state set). */
  atributoEstados(key: EntKey, nombre: string, descripcion?: string): Id;
  /** Declara el state set de una entidad (≥2 estados; opcional inicial/final). */
  estados(entidadKey: EntKey, nombres: string[], inicial?: string, final?: string): void;
  /** Registra que `entidadKey` se refina por DESCOMPOSICIÓN (in-zoom de proceso) en `opdKey`. */
  refDescomp(entidadKey: EntKey, opdKey: OpdKey): void;
  /** Registra refinamiento por DESPLIEGUE/agregación (unfold de objeto en partes) en `opdKey`. */
  refDespliegue(entidadKey: EntKey, opdKey: OpdKey): void;
  /** Despliegue por EXHIBICIÓN (unfold del objeto en sus atributos exhibidos). */
  refDespliegueExh(entidadKey: EntKey, opdKey: OpdKey): void;
  /** Despliegue por GENERALIZACIÓN (el general se despliega en sus especializaciones XOR). */
  refDespliegueGen(entidadKey: EntKey, opdKey: OpdKey): void;
  /** Coloca una aparición de la entidad en el OPD (geometría inicial; el layout la reubica). */
  ver(opdKey: OpdKey, entidadKey: EntKey, x: number, y: number, width?: number, height?: number, estadosSuprimidos?: string[]): void;
  /** Crea un enlace en el OPD. Las agregaciones del contorno→sub se consumen como contención interna. */
  enlazar(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace, opts?: OpcionesEnlace): void;
  /** Construye un ExtremoEnlace desde una clave de entidad o {estado, entidad}. */
  extremo(input: ExtremoEntrada): ExtremoEnlace;
  /** La apariencia de contorno (refinable por descomposición) local a un OPD, si existe. */
  contornoLocal(opdId: Id): Apariencia | undefined;
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Crea un autor re-entrante. Cada autor tiene su propio modelo + mapas de claves. */
export function crearAutor(opciones: OpcionesAutor = {}): Autor {
  const modelo: Modelo = {
    id: opciones.id ?? "modelo",
    nombre: opciones.nombre ?? "Modelo",
    opdRaizId: "",
    opds: {},
    entidades: {},
    estados: {},
    enlaces: {},
    nextSeq: 10000,
  };
  const eid = new Map<EntKey, Id>();
  const oid = new Map<OpdKey, Id>();
  const sid = new Map<string, Id>();
  const internosInzoom = new Map<Id, Set<Id>>();
  let aparienciaSeq = 1;
  let enlaceSeq = 1;
  let aparienciaEnlaceSeq = 1;

  function idEntidad(key: EntKey): Id {
    const id = eid.get(key);
    if (!id) throw new Error(`Entidad no registrada: ${key}`);
    return id;
  }
  function idOpd(key: OpdKey): Id {
    const id = oid.get(key);
    if (!id) throw new Error(`OPD no registrado: ${key}`);
    return id;
  }
  function idEstado(entidadKey: EntKey, estado: string): Id {
    const id = sid.get(`${entidadKey}:${estado}`);
    if (!id) throw new Error(`Estado no registrado: ${entidadKey}:${estado}`);
    return id;
  }

  function opd(key: OpdKey, nombre: string, padreKey: OpdKey | null = null, ordenLocal?: number): Id {
    const id = `opd-${key}`;
    oid.set(key, id);
    modelo.opds[id] = {
      id,
      nombre,
      padreId: padreKey ? idOpd(padreKey) : null,
      apariencias: {},
      enlaces: {},
      ...(ordenLocal !== undefined ? { ordenLocal } : {}),
    };
    if (!padreKey && !modelo.opdRaizId) modelo.opdRaizId = id;
    return id;
  }

  function entidad(key: EntKey, tipo: "objeto" | "proceso", nombre: string, esencia: Esencia, afiliacion: Afiliacion, descripcion?: string): Id {
    const prefix = tipo === "objeto" ? "o" : "p";
    const id = `${prefix}-${key}`;
    eid.set(key, id);
    const item: Entidad = {
      id,
      tipo,
      nombre,
      esencia,
      afiliacion,
      ...(descripcion ? { descripcion } : {}),
    };
    modelo.entidades[id] = item;
    return id;
  }

  function atributo(key: EntKey, nombre: string, descripcion?: string): Id {
    const id = entidad(key, "objeto", nombre, "informacional", "sistemica", descripcion);
    const e = modelo.entidades[id]!;
    e.esAtributo = true;
    e.valorSlot = { tipo: "string", placeholder: "value" };
    return id;
  }

  function atributoEstados(key: EntKey, nombre: string, descripcion?: string): Id {
    const id = entidad(key, "objeto", nombre, "informacional", "sistemica", descripcion);
    modelo.entidades[id]!.esAtributo = true;
    return id;
  }

  function estados(entidadKey: EntKey, nombres: string[], inicial?: string, final?: string): void {
    if (nombres.length === 1) throw new Error(`deep-opm-pro no acepta un unico estado: ${entidadKey}`);
    const entidadId = idEntidad(entidadKey);
    for (const [indice, nombre] of nombres.entries()) {
      const id = `s-${entidadKey}-${slug(nombre)}`;
      sid.set(`${entidadKey}:${nombre}`, id);
      const estado: Estado = {
        id,
        entidadId,
        nombre,
        // V16-2: orden explicito = orden de declaracion (el autor declara en orden
        // temporal/logico). Sin esto, estadosDeEntidad desempata por id y los badges
        // salian alfabeticos (egresado|hospitalizado|requiere en vez del ciclo real).
        orden: indice,
        ...(nombre === inicial ? { esInicial: true, designaciones: ["inicial"] } : {}),
        ...(nombre === final ? { esFinal: true, designaciones: ["final"] } : {}),
      };
      modelo.estados[id] = estado;
    }
  }

  function refDescomp(entidadKey: EntKey, opdKey: OpdKey): void {
    const e = modelo.entidades[idEntidad(entidadKey)]!;
    e.refinamientos = { ...(e.refinamientos ?? {}), descomposicion: { opdId: idOpd(opdKey) } };
  }
  function refDespliegue(entidadKey: EntKey, opdKey: OpdKey): void {
    const e = modelo.entidades[idEntidad(entidadKey)]!;
    e.refinamientos = { ...(e.refinamientos ?? {}), despliegue: { opdId: idOpd(opdKey), modo: "agregacion" } };
  }
  function refDespliegueExh(entidadKey: EntKey, opdKey: OpdKey): void {
    const e = modelo.entidades[idEntidad(entidadKey)]!;
    e.refinamientos = { ...(e.refinamientos ?? {}), despliegue: { opdId: idOpd(opdKey), modo: "exhibicion" } };
  }
  function refDespliegueGen(entidadKey: EntKey, opdKey: OpdKey): void {
    const e = modelo.entidades[idEntidad(entidadKey)]!;
    e.refinamientos = { ...(e.refinamientos ?? {}), despliegue: { opdId: idOpd(opdKey), modo: "generalizacion" } };
  }

  function ver(opdKey: OpdKey, entidadKey: EntKey, x: number, y: number, width = 190, height = 72, estadosSuprimidos?: string[]): void {
    const opdId = idOpd(opdKey);
    const entidadId = idEntidad(entidadKey);
    const ent = modelo.entidades[entidadId]!;
    const esContorno = ent.refinamientos?.descomposicion?.opdId === opdId;
    // El contorno se ancla en (40,30) con un tamaño BASE modesto; su tamaño final lo fija el layout.
    const geometria = {
      x: esContorno ? 40 : x,
      y: esContorno ? 30 : y,
      width: esContorno ? Math.max(width, 520) : width,
      height: esContorno ? Math.max(height, 320) : height,
    };
    const id = `a-${aparienciaSeq++}`;
    const apariencia: Apariencia = {
      id,
      entidadId,
      opdId,
      ...geometria,
      ...(esContorno
        ? { contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: entidadId, rol: "contorno" } as const }
        : {}),
      ...(estadosSuprimidos && estadosSuprimidos.length
        ? { estadosSuprimidos: estadosSuprimidos.map((e) => idEstado(entidadKey, e)) }
        : {}),
    };
    modelo.opds[opdId]!.apariencias[id] = apariencia;
  }

  function contornoLocal(opdId: Id): Apariencia | undefined {
    return Object.values(modelo.opds[opdId]!.apariencias).find((apariencia) => {
      const ent = modelo.entidades[apariencia.entidadId];
      return ent?.refinamientos?.descomposicion?.opdId === opdId;
    });
  }

  function extremo(input: ExtremoEntrada): ExtremoEnlace {
    if (typeof input === "string") return { kind: "entidad", id: idEntidad(input) };
    return { kind: "estado", id: idEstado(input.entidad, input.estado) };
  }

  function registrarInternoInzoom(opdId: Id, entidadId: Id): void {
    const internos = internosInzoom.get(opdId) ?? new Set<Id>();
    internos.add(entidadId);
    internosInzoom.set(opdId, internos);
  }

  function enlazar(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace, opts: OpcionesEnlace = {}): void {
    const opdId = idOpd(opdKey);
    // Agregación del contorno hacia un subproceso: se CONSUME como contención interna (no se crea enlace).
    if (
      tipo === "agregacion" &&
      typeof origen === "string" &&
      modelo.entidades[idEntidad(origen)]!.refinamientos?.descomposicion?.opdId === opdId
    ) {
      if (typeof destino === "string") registrarInternoInzoom(opdId, idEntidad(destino));
      return;
    }
    // W3.2 (vía b): validación incremental de la firma EN el punto de construcción.
    // Resuelve los extremos a sus Entidad y delega en el validador canónico del kernel
    // (el mismo que usa `crearEnlace`). Una firma ilegal (p.ej. agente objeto→objeto) lanza
    // aquí, no en la emisión — error temprano, trazable a la línea del autor que lo creó.
    const origenExtremo = extremo(origen);
    const destinoExtremo = extremo(destino);
    const origenEntidad = entidadDeExtremo(modelo, origenExtremo);
    const destinoEntidad = entidadDeExtremo(modelo, destinoExtremo);
    if (!origenEntidad || !destinoEntidad) {
      throw new Error(`Enlace ${tipo} con extremo inexistente en OPD '${opdKey}'`);
    }
    const firma = validarFirmaEnlace(tipo, origenEntidad, destinoEntidad, {
      origen: origenExtremo,
      destino: destinoExtremo,
    });
    if (!firma.ok) {
      throw new Error(
        `Firma de enlace ilegal en OPD '${opdKey}' (${origenEntidad.nombre} ${tipo} ${destinoEntidad.nombre}): ${firma.error}`,
      );
    }
    const id = `e-${enlaceSeq++}`;
    const subtipoEvento: SubtipoModificador | undefined =
      opts.modificador === "evento" ? "E" : opts.modificador === "condicion" ? "C" : undefined;
    const enlace = {
      id,
      tipo,
      origenId: origenExtremo,
      destinoId: destinoExtremo,
      etiqueta: opts.etiqueta ?? "",
      ...(opts.entrada ? { estadoEntradaId: idEstado(destino as EntKey, opts.entrada) } : {}),
      ...(opts.salida ? { estadoSalidaId: idEstado(destino as EntKey, opts.salida) } : {}),
      ...(opts.multiplicidadDestino ? { multiplicidadDestino: opts.multiplicidadDestino } : {}),
      ...(opts.modificador ? { modificador: opts.modificador } : {}),
      ...(subtipoEvento ? { subtipoModificador: subtipoEvento } : {}),
    };
    modelo.enlaces[id] = enlace;
    const apId = `ae-${aparienciaEnlaceSeq++}`;
    const apariencia: AparienciaEnlace = { id: apId, enlaceId: id, opdId, vertices: [] };
    modelo.opds[opdId]!.enlaces[apId] = apariencia;
  }

  return {
    modelo,
    internosInzoom,
    id: idEntidad,
    idOpd,
    idEstado,
    opd,
    entidad,
    atributo,
    atributoEstados,
    estados,
    refDescomp,
    refDespliegue,
    refDespliegueExh,
    refDespliegueGen,
    ver,
    enlazar,
    extremo,
    contornoLocal,
  };
}
