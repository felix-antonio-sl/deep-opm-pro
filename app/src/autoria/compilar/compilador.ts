// Compilador proto-modelo → Modelo (W4.2). Une las cuatro etapas:
//   1. normalizador (compilar/normalizador.ts) — sub-dialecto → OPL-ES estricto.
//   2. lector de estructura (compilar/estructura.ts) — markdown → plan de OPDs.
//   3. resolutor incremental (compilar/resolutor.ts) — nombres → keys, por-OPD.
//   4. emisor (compilar/emisor.ts) — oración estricta → llamadas al DSL.
//
// Entrada:  el markdown del proto-modelo.
// Salida:   { autor, modelo, ledger } — el Autor del DSL con el Modelo construido
//           y el LEDGER L2 (por cada línea del proto, su destino final).
//
// LEY L2 (test): ninguna línea sin destino; el número de hechos aplicados ==
// número de oraciones aplicables (con la contabilidad de A1/A6: una línea cruda
// que el normalizador parte en N oraciones aporta N entradas al ledger).

import { crearAutor } from "../dsl";
import type { Autor } from "../dsl";
import { leerEstructura } from "./estructura";
import type { NodoOpd, LineaEstructural } from "./estructura";
import { Resolutor } from "./resolutor";
import { emitirCompuesta, emitirOracion, recolectarEstadosUnion, recolectarRasgos } from "./emisor";
import type { HechoEmitido } from "./emisor";
import type { Ancla, LineaNormalizada } from "./tipos";
import {
  compilarAnclasDeLinea,
  contabilizarAnclasNoCompiladas,
  nuevoEstadoClaves,
  sumarContabilidad,
} from "./anclas";
import type { ContabilidadAnclas, EstadoClaves } from "./anclas";

/** Destino L2 de una línea del proto (cada línea cae en exactamente uno). `anclas`
 *  conserva las anclas detectadas en la línea (W5.2): en líneas RECHAZADAS, el ancla
 *  no se pierde — queda junto al diagnóstico (L8). */
export type DestinoLedger =
  | { tipo: "aplicada"; oracion: string; opd: string; regla?: string; original?: string; hechos: HechoEmitido[]; anclas?: Ancla[] }
  | { tipo: "estructura"; oracion: string; opd: string; refinable: string | null }
  | { tipo: "rechazada"; original: string; categoria: string; diagnostico: string; anclas?: Ancla[] }
  | { tipo: "excluida"; oracion: string; clase: string; razon: string; anclas?: Ancla[] }
  | { tipo: "comentario"; texto: string; anclas?: Ancla[] }
  | { tipo: "estructural-md"; texto: string; clase: LineaEstructural["clase"] }
  | { tipo: "fallo"; oracion: string; razon: string; anclas?: Ancla[] };

export interface Ledger {
  /** Una entrada por línea/oración del proto, con su destino final. */
  entradas: DestinoLedger[];
}

export interface ResultadoCompilacion {
  autor: Autor;
  /** Conveniencia: el modelo construido (== autor.modelo). */
  modelo: Autor["modelo"];
  ledger: Ledger;
  /** Conteo agregado de hechos por tipo de destino (para reportes). */
  resumen: ResumenLedger;
}

export interface ResumenLedger {
  aplicadas: number;
  hechos: number;
  hechosPorPrimitiva: Record<string, number>;
  estructura: number;
  excluidas: number;
  rechazadas: number;
  comentarios: number;
  fallos: number;
  opds: number;
  // ── Contabilidad de anclas normativas (W5.2 / L8) ──
  /** Total de anclas detectadas en el proto (norma + ratificacion + candidatas). */
  anclasDetectadas: number;
  /** Anclas (norma/ratificacion) compiladas a `AnclaNormativa` en el bundle. */
  anclasCompiladas: number;
  /** Etiquetas `[C1]`-style conservadas, NO compiladas (§10.3). */
  anclasCandidatas: number;
  /** Anclas norma/ratificacion de líneas rechazadas/fallidas (no compiladas, en ledger). */
  anclasEnRechazadas: number;
}

export interface OpcionesCompilacion {
  /** Nombre del modelo. */
  nombre?: string;
  /** Id del modelo. */
  id?: string;
}

/**
 * Compila el markdown de un proto-modelo a un Modelo OPM (vía DSL) + ledger L2.
 *
 * No aplica layout ni valida: eso lo hace `emitirBundle(autor)` aguas abajo
 * (el piloto lo encadena). Aquí solo se construye el modelo y se contabiliza.
 */
export function compilarProto(markdown: string, opciones: OpcionesCompilacion = {}): ResultadoCompilacion {
  const plan = leerEstructura(markdown);
  const autor = crearAutor({ ...(opciones.id ? { id: opciones.id } : {}), ...(opciones.nombre ? { nombre: opciones.nombre } : {}) });
  const resolutor = new Resolutor();
  // Semilla de tipos: el ContextoProto recorrió todo el proto e infirió objeto/
  // proceso por uso global. Sembrarlos evita que un proceso nombrado antes de su
  // descripción se cree como objeto (firma de enlace ilegal).
  resolutor.sembrarTipos(plan.contexto.tipoPorEntidad);
  // Clase explícita (tensión 4): qué entidades tienen clase OPM declarada de
  // forma fuerte. El emisor la usa para que una parte de `consta de` sin clase
  // propia herede la clase del todo (agregación homogénea).
  resolutor.sembrarClaseExplicita(plan.contexto.claseExplicita);
  // Nombres conocidos (tensión 3): el universo de entidades declaradas en TODO el
  // proto, para preferir el nombre conocido más largo (`Resumen clínico en
  // domicilio`) sobre la lectura `objeto + estado` aunque se declare después.
  resolutor.sembrarNombresConocidos(plan.contexto.entidades.values());
  // Unión de estados por entidad (explícitos + implícitos por transición) sobre
  // TODO el proto: declara el state set completo la primera vez que se referencia
  // un objeto, para que las transiciones a estados solo declarados por uso no fallen.
  const oraciones = plan.opds.flatMap((opd) =>
    opd.hechos.flatMap((h) => {
      if (h.clase === "estricta" || h.clase === "normalizada") return [h.oracion];
      // Las emisiones-oración de una línea `compuesta` (familia V) también aportan
      // estados/rasgos (p.ej. una TS `cambia X a 'e'` reescrita por V12/V14).
      if (h.clase === "compuesta") return h.emisiones.flatMap((e) => (e.via === "oracion" ? [e.oracion] : []));
      return [];
    }),
  );
  const estadosUnion = recolectarEstadosUnion(oraciones);
  // Rasgos esencia/afiliación declarados en el proto: una entidad nombrada antes de
  // su descripción (p.ej. un agente físico) se crea con la esencia correcta.
  resolutor.sembrarRasgos(recolectarRasgos(oraciones));
  const estadosDeclarados = new Set<string>();
  // Registro de enlaces procedurales por OPD (tensión 1: adjunción del evento sin
  // portador sobre un `requiere` coexistente, sin duplicar). Compartido entre OPDs.
  const enlacesProcedurales = new Map<string, string>();
  // Secuencia de claveProto de colas (`cola-fina-N`) POR COMPILACIÓN: holder fresco
  // compartido entre OPDs → reentrante/determinista (bug de-risking F4 corregido).
  const secuenciaColaAncla = { n: 0 };
  // W5.2: estado de claves de ancla (desambiguación estable de colisiones) +
  // contabilidad L8 acumulada (detectadas == compiladas + candidatas + en-rechazadas).
  const clavesAncla = nuevoEstadoClaves();
  const contabAnclas: { total: ContabilidadAnclas } = {
    total: { detectadas: 0, compiladas: 0, candidatas: 0, enRechazadas: 0 },
  };
  const entradas: DestinoLedger[] = [];

  // Las líneas markdown no-hecho (encabezados, prosa, fences) van al ledger como
  // `estructural-md`: ninguna se pierde. (Las omitimos del resumen de hechos.)
  for (const est of plan.estructurales) {
    entradas.push({ tipo: "estructural-md", texto: est.texto, clase: est.clase });
  }

  // Crea todos los OPDs primero (para que `refDescomp`/`ver` puedan referirlos por
  // clave). El raíz primero (fija `modelo.opdRaizId`).
  for (const nodo of plan.opds) {
    autor.opd(nodo.clave, nodo.nombre, nodo.padreClave);
  }

  // Procesa cada OPD en orden: el raíz puebla entidades; los hijos registran su
  // refinamiento, proyectan el contorno y emiten su detalle.
  for (const nodo of plan.opds) {
    procesarOpd(nodo, autor, resolutor, entradas, estadosUnion, estadosDeclarados, enlacesProcedurales, clavesAncla, contabAnclas, secuenciaColaAncla);
  }

  const resumen = resumir(entradas, plan.opds.length, contabAnclas.total);
  return { autor, modelo: autor.modelo, ledger: { entradas }, resumen };
}

function procesarOpd(
  nodo: NodoOpd,
  autor: Autor,
  resolutor: Resolutor,
  entradas: DestinoLedger[],
  estadosUnion: Map<string, string[]>,
  estadosDeclarados: Set<string>,
  enlacesProcedurales: Map<string, string>,
  clavesAncla: EstadoClaves,
  contabAnclas: { total: ContabilidadAnclas },
  secuenciaColaAncla: { n: number },
): void {
  let refinableKey: string | null = null;
  // 1) Para un OPD de refinamiento: registra el refinamiento y proyecta el
  //    contorno. El refinable debe existir (creado en el OPD padre). Si no existe
  //    aún (el proto lo nombra por primera vez aquí), lo creamos como proceso.
  if (nodo.refinamiento !== "raiz" && nodo.refinableNombre) {
    const r = resolutor.resolver(nodo.refinableNombre, nodo.padreClave ?? nodo.clave, "proceso");
    resolutor.promoverAProceso(nodo.refinableNombre);
    if (r.accion === "crear") {
      autor.entidad(r.key, "proceso", nodo.refinableNombre.trim(), "fisica", "sistemica");
    }
    if (nodo.refinamiento === "descomposicion") autor.refDescomp(r.key, nodo.clave);
    else autor.refDespliegue(r.key, nodo.clave);
    // Coloca el contorno (el DSL detecta esContorno por el refinamiento ya registrado).
    autor.ver(nodo.clave, r.key, 40, 30);
    resolutor.marcarAparicion(nodo.refinableNombre, nodo.clave);
    entradas.push({
      tipo: "estructura",
      oracion: `${nodo.refinableNombre} se ${nodo.refinamiento === "despliegue" ? "despliega" : "descompone"} en …`,
      opd: nodo.clave,
      refinable: nodo.refinableNombre,
    });

    refinableKey = r.key;
  }

  // 2) Emite los hechos del OPD.
  const ctx = { autor, resolutor, opdClave: nodo.clave, opdKey: nodo.clave, estadosUnion, estadosDeclarados, enlacesProcedurales, secuenciaColaAncla };
  for (const linea of nodo.hechos) {
    const contab = emitirLinea(linea, ctx, entradas, clavesAncla);
    contabAnclas.total = sumarContabilidad(contabAnclas.total, contab);
  }

  // 3) S1 (solicitud upstream skill, 2026-06-11): los miembros de `X se
  //    descompone en A, B …` SON el interior del in-zoom. TRAS emitir los
  //    hechos (para que cada miembro nazca con la esencia/afiliación que el
  //    proto declara y el ledger no pierda hechos), se declara su membresía
  //    emitiendo la agregación contorno→miembro que el DSL CONSUME como
  //    contención (registrarInternoInzoom; no crea enlace en el bundle). Un
  //    miembro declarado SOLO en la lista se crea aquí (es interior declarado).
  //    Sin esto, el layout renderiza los subprocesos fuera del contorno y
  //    LF-19 acusa falso positivo de modelado.
  if (nodo.refinamiento === "descomposicion" && refinableKey) {
    for (const miembro of nodo.miembros) {
      const rm = resolutor.resolver(miembro, nodo.clave, "proceso");
      if (rm.accion === "crear") {
        autor.entidad(rm.key, rm.tipo, miembro.trim(), rm.rasgos.esencia, rm.rasgos.afiliacion);
      }
      if (rm.accion === "crear" || rm.accion === "proyectar") {
        autor.ver(nodo.clave, rm.key, 60, 60);
        resolutor.marcarAparicion(miembro, nodo.clave);
      }
      autor.enlazar(nodo.clave, refinableKey, rm.key, "agregacion");
    }
  }
}

function emitirLinea(
  linea: LineaNormalizada,
  ctx: {
    autor: Autor;
    resolutor: Resolutor;
    opdClave: string;
    opdKey: string;
    estadosUnion: Map<string, string[]>;
    estadosDeclarados: Set<string>;
    enlacesProcedurales: Map<string, string>;
    secuenciaColaAncla: { n: number };
  },
  entradas: DestinoLedger[],
  clavesAncla: EstadoClaves,
): ContabilidadAnclas {
  const conAnclas = <T extends DestinoLedger>(e: T, anclas?: Ancla[]): T =>
    anclas && anclas.length ? { ...e, anclas } : e;
  switch (linea.clase) {
    case "comentario": {
      // W5.2: las citas normativas del comentario de bloque compilan a ancla con
      // target = el OPD del bloque; las `[C1]`-style se conservan como candidatas.
      const contab = compilarAnclasDeLinea(linea.anclas, { opdKey: ctx.opdKey }, ctx.autor, clavesAncla);
      entradas.push(conAnclas({ tipo: "comentario", texto: linea.texto }, linea.anclas));
      return contab;
    }
    case "rechazada":
      // L8: el ancla de una línea rechazada NO se pierde — queda junto al diagnóstico
      // (contabilizada como `enRechazadas`, NO compilada: el hecho no tiene target).
      entradas.push(conAnclas({ tipo: "rechazada", original: linea.original, categoria: linea.categoria, diagnostico: linea.diagnostico }, linea.anclas));
      return contabilizarAnclasNoCompiladas(linea.anclas);
    case "estructura":
      // Una oración estructural fuera de cabecera de bloque (no abrió OPD): se
      // registra como estructura sin refinable separado (continuación aditiva).
      entradas.push({ tipo: "estructura", oracion: linea.oracion, opd: ctx.opdClave, refinable: null });
      return contabilizarAnclasNoCompiladas(linea.anclas);
    case "estricta":
    case "normalizada": {
      const res = emitirSegura(() => emitirOracion(linea.oracion, ctx));
      if (res.estado === "aplicada") {
        entradas.push(conAnclas({
          tipo: "aplicada",
          oracion: linea.oracion,
          opd: ctx.opdClave,
          ...(linea.clase === "normalizada" ? { regla: linea.regla, original: linea.original } : {}),
          hechos: res.hechos,
        }, linea.anclas));
        return compilarAnclasDeLinea(
          linea.anclas,
          { ...(res.enlaceIds ? { enlaceIds: res.enlaceIds } : {}), ...(res.entidadKey ? { entidadKey: res.entidadKey } : {}), opdKey: ctx.opdKey },
          ctx.autor,
          clavesAncla,
        );
      } else if (res.estado === "excluida") {
        entradas.push(conAnclas({ tipo: "excluida", oracion: linea.oracion, clase: res.clase, razon: res.razon }, linea.anclas));
      } else {
        entradas.push(conAnclas({ tipo: "fallo", oracion: linea.oracion, razon: res.razon }, linea.anclas));
      }
      return contabilizarAnclasNoCompiladas(linea.anclas);
    }
    case "compuesta": {
      // Familia V: emite cada emisión (oración o directiva) y, si la línea pide
      // agrupar, forma el abanico sobre los enlaces creados. Una sola entrada de
      // ledger `aplicada` con todos los hechos (trazabilidad por `regla`/`original`).
      const res = emitirSegura(() => emitirCompuesta(linea, ctx));
      if (res.estado === "aplicada") {
        entradas.push(conAnclas({
          tipo: "aplicada",
          oracion: linea.original,
          opd: ctx.opdClave,
          regla: linea.regla,
          original: linea.original,
          hechos: res.hechos,
        }, linea.anclas));
        return compilarAnclasDeLinea(
          linea.anclas,
          { ...(res.enlaceIds ? { enlaceIds: res.enlaceIds } : {}), ...(res.entidadKey ? { entidadKey: res.entidadKey } : {}), opdKey: ctx.opdKey },
          ctx.autor,
          clavesAncla,
        );
      } else if (res.estado === "excluida") {
        entradas.push(conAnclas({ tipo: "excluida", oracion: linea.original, clase: res.clase, razon: res.razon }, linea.anclas));
      } else {
        entradas.push(conAnclas({ tipo: "fallo", oracion: linea.original, razon: res.razon }, linea.anclas));
      }
      return contabilizarAnclasNoCompiladas(linea.anclas);
    }
  }
}

/**
 * Envuelve una emisión capturando los throws de los guards (R9 del resolutor,
 * firmas ilegales del DSL fuera de rutas con try propio) como destino `fallo`
 * con la razón — L2: la línea cae a un destino con diagnóstico, jamás revienta
 * la compilación entera ni se pierde en silencio.
 */
function emitirSegura(emitir: () => ReturnType<typeof emitirOracion>): ReturnType<typeof emitirOracion> {
  try {
    return emitir();
  } catch (e) {
    return { estado: "fallo", razon: e instanceof Error ? e.message : String(e) };
  }
}

function resumir(entradas: DestinoLedger[], opds: number, anclas: ContabilidadAnclas): ResumenLedger {
  const hechosPorPrimitiva: Record<string, number> = {};
  let aplicadas = 0;
  let hechos = 0;
  let estructura = 0;
  let excluidas = 0;
  let rechazadas = 0;
  let comentarios = 0;
  let fallos = 0;
  for (const e of entradas) {
    switch (e.tipo) {
      case "aplicada":
        aplicadas += 1;
        for (const h of e.hechos) {
          hechos += 1;
          hechosPorPrimitiva[h.primitiva] = (hechosPorPrimitiva[h.primitiva] ?? 0) + 1;
        }
        break;
      case "estructura": estructura += 1; break;
      case "excluida": excluidas += 1; break;
      case "rechazada": rechazadas += 1; break;
      case "comentario": comentarios += 1; break;
      case "fallo": fallos += 1; break;
      default: break;
    }
  }
  return {
    aplicadas,
    hechos,
    hechosPorPrimitiva,
    estructura,
    excluidas,
    rechazadas,
    comentarios,
    fallos,
    opds,
    anclasDetectadas: anclas.detectadas,
    anclasCompiladas: anclas.compiladas,
    anclasCandidatas: anclas.candidatas,
    anclasEnRechazadas: anclas.enRechazadas,
  };
}
