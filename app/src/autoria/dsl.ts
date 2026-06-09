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
//
// W4.1 (Tanda 1 del inventario `inventario-primitivas-dsl.md (retirado 2a83c1c5, en git)`) — primitivas
// ADITIVAS que delegan 1:1 a operaciones del kernel ya existentes. Ninguna altera el comportamiento
// de los métodos previos (verificado por byte-identidad del golden HODOM, que no las usa). Seis
// primitivas: (1) `abanico()` → `formarAbanico` (cierra la exclusión rectora L2 #30); (2)
// `OpcionesEnlace.multiplicidadOrigen` → espejo de `multiplicidadDestino` en la escritura del enlace
// (#31); (3) `OpcionesEnlace.demora` → `definirDemora` (#21); (4) `autoinvocacion()` →
// `crearAutoInvocacion` (#22); (5) `OpcionesEnlace.modificador: "no"` → ya fluía por `modificador`,
// pero el subtipo no se mapeaba; ahora `"no"`→`"no"` (#19); (6) `designarEstado()` → designaciones
// default/current, espejo de inicial/final de `estados()` (#5). El abanico replica el pin de puerto
// compartido que hace el reverse antes de `formarAbanico` (`opl/parser/aplicar.ts:390-405`): los
// enlaces del DSL no tienen `portId` hasta el layout, así que `abanico()` asigna un portId de
// fan-out al lado del puerto común antes de delegar al kernel.
import type {
  Afiliacion,
  Apariencia,
  AparienciaEnlace,
  DesignacionEstado,
  Entidad,
  Esencia,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  OperadorAbanico,
  PosicionLabelEnlace,
  SubtipoModificador,
  TipoEnlace,
} from "../modelo/tipos";
import { entidadDeExtremo } from "../modelo/extremos";
import { validarFirmaEnlace } from "../modelo/operaciones/helpers";
import { formarAbanico } from "../modelo/abanicos";
import { definirDemora } from "../modelo/modificadores";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { normalizarPosicionLabelEnlace } from "../modelo/etiquetasEnlace";
import type { AnclaNormativa } from "../modelo/tipos";
import type {
  EntKey,
  ExtremoEntrada,
  OpcionesAncla,
  OpcionesAutor,
  OpcionesEnlace,
  OpdKey,
  TargetAnclaEntrada,
} from "./tipos";

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
  /** Marca un OPD ya declarado como vista ad-hoc `generic-view` (E-1): reúne
   *  apariciones arbitrarias SIN refinamiento; excluida de los checkers de
   *  frontera/descomposición. */
  vistaGenerica(key: OpdKey, opts?: { readOnly?: boolean }): void;
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
  /**
   * Crea un enlace en el OPD y devuelve su Id (para componer abanicos con `abanico()`).
   * Las agregaciones del contorno→sub se consumen como contención interna (devuelve `null`).
   */
  enlazar(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace, opts?: OpcionesEnlace): Id | null;
  /**
   * Añade en `opdKey` una aparición visual de un enlace lógico ya existente.
   * No declara un nuevo hecho: lanza si no hay exactamente un enlace global
   * con esos extremos y tipo. Si ya aparece en ese OPD, devuelve su apariencia.
   */
  aparecerEnlace(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace): Id;
  /**
   * F1: añade en `opdKey` una aparición de un enlace lógico identificado por su
   * `enlaceId`. A diferencia de `aparecerEnlace` (que resuelve por extremos+tipo
   * y lanza si hay >1 candidato), funciona con multi-edges legítimos (mismos
   * extremos+tipo, distintos por transición de estado). Lanza si el enlace no
   * existe; si ya aparece en ese OPD, devuelve su apariencia. Usa el mismo
   * contador global `ae-<n>`.
   */
  aparecerEnlacePorId(opdKey: OpdKey, enlaceId: Id): Id;
  /**
   * Posiciona la etiqueta semántica principal de una aparición de enlace.
   * La posición es por OPD/aparición, no global al enlace lógico.
   */
  posicionarEtiqueta(
    opdKey: OpdKey,
    origen: ExtremoEntrada,
    destino: ExtremoEntrada,
    tipo: TipoEnlace,
    distance: number,
    opts?: Omit<PosicionLabelEnlace, "distance">,
  ): Id;
  /**
   * Agrupa ≥2 enlaces que comparten un puerto en un abanico O/XOR. W4.1 Tanda 1 (#30).
   * Delega en `formarAbanico` del kernel (mismo validador que el reverse). Replica el pin de
   * puerto compartido del aplicador antes de delegar. Lanza si el kernel rechaza (p.ej. <2 enlaces,
   * enlaces no procedurales/heterogéneos, o sin puerto común).
   */
  abanico(opdKey: OpdKey, enlaceIds: Id[], operador?: OperadorAbanico): Id;
  /**
   * Auto-invocación de un proceso (`se invoca a sí mismo [después de Ns]`). W4.1 Tanda 1 (#22).
   * Delega en `crearAutoInvocacion` del kernel (el proceso debe tener apariencia en el OPD). Lanza si
   * el kernel rechaza. Devuelve el Id del enlace de invocación creado.
   */
  autoinvocacion(opdKey: OpdKey, procesoKey: EntKey, demora?: string): Id;
  /**
   * Designa un estado ya declarado. Para `inicial`/`final`, sincroniza tambien
   * los booleanos legacy `esInicial`/`esFinal`; para `default`/`current`, solo
   * escribe la designacion avanzada.
   */
  designarEstado(entidadKey: EntKey, estado: string, designacion: DesignacionEstado): void;
  /**
   * Adjunta un ancla normativa (W5.1) a entidad/enlace/OPD/modelo por clave de dominio.
   * Extensión ADITIVA: contenido meta del autor (R-DOC-7/V-204), NO emite OPL nuclear ni
   * cuenta como cosa. `target.enlace` toma el Id que `enlazar()` devuelve. Devuelve el Id
   * posicional del ancla en el bundle; `opts.claveProto` es la clave estable de trazabilidad.
   * Lanza ante target irresoluble o clave duplicada.
   */
  ancla(target: TargetAnclaEntrada, opts: OpcionesAncla): Id;
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
  let abanicoSeq = 1;
  let anclaSeq = 1;

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

  function vistaGenerica(key: OpdKey, opts?: { readOnly?: boolean }): void {
    const opd = modelo.opds[idOpd(key)];
    if (!opd) throw new Error(`vistaGenerica: OPD inexistente '${String(key)}' (declara opd(...) primero).`);
    opd.vista = { kind: "generic-view", ...(opts?.readOnly !== undefined ? { readOnly: opts.readOnly } : {}) };
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
      const esInicial = nombre === inicial;
      const esFinal = nombre === final;
      const designaciones: DesignacionEstado[] = [];
      if (esInicial) designaciones.push("inicial");
      if (esFinal) designaciones.push("final");
      const estado: Estado = {
        id,
        entidadId,
        nombre,
        // V16-2: orden explicito = orden de declaracion (el autor declara en orden
        // temporal/logico). Sin esto, estadosDeEntidad desempata por id y los badges
        // salian alfabeticos (egresado|hospitalizado|requiere en vez del ciclo real).
        orden: indice,
        ...(esInicial ? { esInicial: true } : {}),
        ...(esFinal ? { esFinal: true } : {}),
        ...(designaciones.length > 0 ? { designaciones } : {}),
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

  function extremosCoinciden(a: ExtremoEnlace, b: ExtremoEnlace): boolean {
    return a.kind === b.kind && a.id === b.id;
  }

  function buscarEnlaceExistente(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace): { enlaceId: Id; opdId: Id } {
    const opdId = idOpd(opdKey);
    const origenResuelto = extremo(origen);
    const destinoResuelto = extremo(destino);
    const candidatos = Object.values(modelo.enlaces).filter(
      (enlace) =>
        enlace.tipo === tipo &&
        extremosCoinciden(enlace.origenId, origenResuelto) &&
        extremosCoinciden(enlace.destinoId, destinoResuelto),
    );
    if (candidatos.length === 0) {
      throw new Error(`aparecerEnlace/posicionarEtiqueta: no existe enlace ${tipo} en '${opdKey}'`);
    }
    if (candidatos.length > 1) {
      throw new Error(`aparecerEnlace/posicionarEtiqueta: enlace ambiguo ${tipo} en '${opdKey}' (${candidatos.length} candidatos)`);
    }
    return { enlaceId: candidatos[0]!.id, opdId };
  }

  function aparienciaDeEnlace(opdId: Id, enlaceId: Id): AparienciaEnlace | undefined {
    return Object.values(modelo.opds[opdId]?.enlaces ?? {}).find((apariencia) => apariencia.enlaceId === enlaceId);
  }

  function normalizarPosicionEtiqueta(distance: number, opts: Omit<PosicionLabelEnlace, "distance"> = {}): PosicionLabelEnlace {
    const normalizada = normalizarPosicionLabelEnlace({ distance, ...opts });
    if (!normalizada) throw new Error("posicionarEtiqueta: posición de label inválida");
    return normalizada;
  }

  function registrarInternoInzoom(opdId: Id, entidadId: Id): void {
    const internos = internosInzoom.get(opdId) ?? new Set<Id>();
    internos.add(entidadId);
    internosInzoom.set(opdId, internos);
  }

  function designarEstado(entidadKey: EntKey, nombre: string, designacion: DesignacionEstado): void {
    const estadoId = idEstado(entidadKey, nombre);
    const estado = modelo.estados[estadoId]!;
    const previas = estado.designaciones ?? [];
    if (!previas.includes(designacion)) {
      estado.designaciones = [...previas, designacion];
    }
    if (designacion === "inicial") estado.esInicial = true;
    if (designacion === "final") estado.esFinal = true;
  }

  function abanico(opdKey: OpdKey, enlaceIds: Id[], operador: OperadorAbanico = "O"): Id {
    const opdId = idOpd(opdKey);
    // El kernel exige que las ramas compartan un puerto EXACTO (entidadId+lado+portId). Los enlaces
    // del DSL aún no tienen portId (lo asigna el layout), así que replicamos el pin de puerto
    // compartido del reverse (`opl/parser/aplicar.ts:390-405`): detectamos la entidad común y el
    // lado por el que entra a cada rama, y le ponemos un portId de fan-out compartido.
    const enlaces = enlaceIds.map((id) => {
      const enlace = modelo.enlaces[id];
      if (!enlace) throw new Error(`Abanico en OPD '${opdKey}': enlace inexistente '${id}'`);
      return enlace;
    });
    if (enlaces.length >= 2) {
      const pivote = entidadPivoteComun(enlaces);
      if (pivote) {
        const portId: Id = `port-fan-${pivote.entidadId}-${pivote.lado}-${abanicoSeq++}`;
        for (const enlace of enlaces) {
          const campo = pivote.lado === "origen" ? "origenId" : "destinoId";
          const extremoActual = enlace[campo];
          if (extremoActual.kind === "entidad" && extremoActual.id === pivote.entidadId) {
            modelo.enlaces[enlace.id] = { ...enlace, [campo]: { ...extremoActual, portId } };
          }
        }
      }
    }
    const formado = formarAbanico(modelo, opdId, enlaceIds, operador);
    if (!formado.ok) {
      throw new Error(`Abanico ilegal en OPD '${opdKey}': ${formado.error}`);
    }
    // Vuelca el resultado inmutable (abanicos + nextSeq) al modelo mutable del autor.
    modelo.abanicos = formado.value.abanicos ?? {};
    modelo.nextSeq = formado.value.nextSeq;
    const nuevo = Object.values(formado.value.abanicos ?? {}).find((ab) =>
      ab.opdId === opdId && enlaceIds.every((id) => ab.enlaceIds.includes(id)),
    );
    if (!nuevo) throw new Error(`Abanico en OPD '${opdKey}': no se pudo localizar el abanico formado`);
    return nuevo.id;
  }

  function autoinvocacion(opdKey: OpdKey, procesoKey: EntKey, demora?: string): Id {
    const opdId = idOpd(opdKey);
    const procesoId = idEntidad(procesoKey);
    const previos = new Set(Object.keys(modelo.enlaces));
    const creado = demora !== undefined
      ? crearAutoInvocacion(modelo, opdId, procesoId, demora)
      : crearAutoInvocacion(modelo, opdId, procesoId);
    if (!creado.ok) {
      throw new Error(`Auto-invocación ilegal en OPD '${opdKey}' (${procesoKey}): ${creado.error}`);
    }
    // Vuelca el resultado inmutable (enlaces + apariencia del OPD + nextSeq) al modelo mutable.
    modelo.enlaces = creado.value.enlaces;
    modelo.opds[opdId]!.enlaces = creado.value.opds[opdId]!.enlaces;
    modelo.nextSeq = creado.value.nextSeq;
    const enlaceId = Object.keys(modelo.enlaces).find((id) => !previos.has(id));
    if (!enlaceId) throw new Error(`Auto-invocación en OPD '${opdKey}': no se pudo localizar el enlace creado`);
    return enlaceId;
  }

  /** Entidad común (puerto del abanico) y el lado por el que entra a todas las ramas, o null. */
  function entidadPivoteComun(enlaces: { origenId: ExtremoEnlace; destinoId: ExtremoEnlace }[]): { entidadId: Id; lado: "origen" | "destino" } | null {
    for (const lado of ["origen", "destino"] as const) {
      const campo = lado === "origen" ? "origenId" : "destinoId";
      const primer = enlaces[0]![campo];
      if (primer.kind !== "entidad") continue;
      const entidadId = primer.id;
      const todas = enlaces.every((enlace) => {
        const ext = enlace[campo];
        return ext.kind === "entidad" && ext.id === entidadId;
      });
      if (todas) return { entidadId, lado };
    }
    return null;
  }

  function ancla(target: TargetAnclaEntrada, opts: OpcionesAncla): Id {
    if (!opts.claveProto || !opts.claveProto.trim()) {
      throw new Error("Ancla normativa sin claveProto (clave estable nacida en el proto).");
    }
    const claveProto = opts.claveProto.trim();
    const anclas = modelo.anclasNormativas ?? {};
    for (const existente of Object.values(anclas)) {
      if (existente.claveProto === claveProto) {
        throw new Error(`Ancla normativa con claveProto duplicada: '${claveProto}'.`);
      }
    }
    // Resuelve el target de dominio a un target con ids del bundle, lanzando si es irresoluble.
    let targetResuelto: AnclaNormativa["target"];
    if ("modelo" in target) {
      targetResuelto = { tipo: "modelo" };
    } else if ("entidad" in target) {
      targetResuelto = { tipo: "entidad", id: idEntidad(target.entidad) };
    } else if ("opd" in target) {
      targetResuelto = { tipo: "opd", id: idOpd(target.opd) };
    } else {
      if (!modelo.enlaces[target.enlace]) {
        throw new Error(`Ancla normativa con enlace inexistente: '${target.enlace}'.`);
      }
      targetResuelto = { tipo: "enlace", id: target.enlace };
    }
    const estado = opts.estado ?? "vigente";
    // Azúcar C1: `nivelAutoridad` suelto arma una ratificación pendiente.
    const ratificacion: AnclaNormativa["ratificacion"] | undefined =
      opts.ratificacion ??
      (opts.nivelAutoridad ? { nivelAutoridad: opts.nivelAutoridad, estadoRatificacion: "pendiente" } : undefined);
    const id = `anc-${anclaSeq++}`;
    const nueva: AnclaNormativa = {
      id,
      claveProto,
      target: targetResuelto,
      estado,
      ...(opts.referencias && opts.referencias.length ? { referencias: opts.referencias } : {}),
      ...(opts.nota && opts.nota.trim() ? { nota: opts.nota.trim() } : {}),
      ...(ratificacion ? { ratificacion } : {}),
    };
    modelo.anclasNormativas = { ...anclas, [id]: nueva };
    return id;
  }

  function enlazar(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace, opts: OpcionesEnlace = {}): Id | null {
    const opdId = idOpd(opdKey);
    // Agregación del contorno hacia un subproceso: se CONSUME como contención interna (no se crea enlace).
    if (
      tipo === "agregacion" &&
      typeof origen === "string" &&
      modelo.entidades[idEntidad(origen)]!.refinamientos?.descomposicion?.opdId === opdId
    ) {
      if (typeof destino === "string") registrarInternoInzoom(opdId, idEntidad(destino));
      return null;
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
    // W4.1 (#19): el modificador `no` ya fluía por `opts.modificador`, pero el subtipo solo se
    // mapeaba para evento/condición. Ahora `"no"`→`"no"` (espejo del kernel `aplicarModificador`),
    // de modo que el subtipo del enlace `no` queda consistente con el resto de la capa.
    const subtipoModificador: SubtipoModificador | undefined =
      opts.modificador === "evento" ? "E" : opts.modificador === "condicion" ? "C" : opts.modificador === "no" ? "no" : undefined;
    const enlace = {
      id,
      tipo,
      origenId: origenExtremo,
      destinoId: destinoExtremo,
      etiqueta: opts.etiqueta ?? "",
      ...(opts.entrada ? { estadoEntradaId: idEstado(destino as EntKey, opts.entrada) } : {}),
      ...(opts.salida ? { estadoSalidaId: idEstado(destino as EntKey, opts.salida) } : {}),
      // W4.1 (#31): multiplicidad de origen, espejo exacto de la de destino ya soportada.
      ...(opts.multiplicidadOrigen ? { multiplicidadOrigen: opts.multiplicidadOrigen } : {}),
      ...(opts.multiplicidadDestino ? { multiplicidadDestino: opts.multiplicidadDestino } : {}),
      ...(opts.modificador ? { modificador: opts.modificador } : {}),
      ...(subtipoModificador ? { subtipoModificador } : {}),
    };
    modelo.enlaces[id] = enlace;
    const apId = `ae-${aparienciaEnlaceSeq++}`;
    const apariencia: AparienciaEnlace = { id: apId, enlaceId: id, opdId, vertices: [] };
    modelo.opds[opdId]!.enlaces[apId] = apariencia;
    // W4.1 (#21): demora de invocación delegada al kernel (`definirDemora`), aplicada sobre el
    // enlace recién escrito. Vuelca el resultado inmutable al modelo mutable del autor.
    if (opts.demora) {
      const conDemora = definirDemora(modelo, id, opts.demora);
      if (!conDemora.ok) {
        throw new Error(
          `Demora ilegal en OPD '${opdKey}' (${origenEntidad.nombre} ${tipo} ${destinoEntidad.nombre}): ${conDemora.error}`,
        );
      }
      modelo.enlaces[id] = conDemora.value.enlaces[id]!;
    }
    return id;
  }

  function aparecerEnlace(opdKey: OpdKey, origen: ExtremoEntrada, destino: ExtremoEntrada, tipo: TipoEnlace): Id {
    const { enlaceId, opdId } = buscarEnlaceExistente(opdKey, origen, destino, tipo);
    const existente = aparienciaDeEnlace(opdId, enlaceId);
    if (existente) return existente.id;
    const apId = `ae-${aparienciaEnlaceSeq++}`;
    modelo.opds[opdId]!.enlaces[apId] = { id: apId, enlaceId, opdId, vertices: [] };
    return apId;
  }

  function aparecerEnlacePorId(opdKey: OpdKey, enlaceId: Id): Id {
    const opdId = idOpd(opdKey);
    if (!modelo.enlaces[enlaceId]) {
      throw new Error(`aparecerEnlacePorId: no existe el enlace '${enlaceId}'`);
    }
    const existente = aparienciaDeEnlace(opdId, enlaceId);
    if (existente) return existente.id;
    const apId = `ae-${aparienciaEnlaceSeq++}`;
    modelo.opds[opdId]!.enlaces[apId] = { id: apId, enlaceId, opdId, vertices: [] };
    return apId;
  }

  function posicionarEtiqueta(
    opdKey: OpdKey,
    origen: ExtremoEntrada,
    destino: ExtremoEntrada,
    tipo: TipoEnlace,
    distance: number,
    opts: Omit<PosicionLabelEnlace, "distance"> = {},
  ): Id {
    const { enlaceId, opdId } = buscarEnlaceExistente(opdKey, origen, destino, tipo);
    const apariencia = aparienciaDeEnlace(opdId, enlaceId);
    if (!apariencia) throw new Error(`posicionarEtiqueta: el enlace ${tipo} no aparece en '${opdKey}'`);
    apariencia.labelPositions = {
      ...(apariencia.labelPositions ?? {}),
      etiqueta: normalizarPosicionEtiqueta(distance, opts),
    };
    return apariencia.id;
  }

  return {
    modelo,
    internosInzoom,
    id: idEntidad,
    idOpd,
    idEstado,
    opd,
    vistaGenerica,
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
    aparecerEnlace,
    aparecerEnlacePorId,
    posicionarEtiqueta,
    abanico,
    autoinvocacion,
    designarEstado,
    ancla,
    extremo,
    contornoLocal,
  };
}
