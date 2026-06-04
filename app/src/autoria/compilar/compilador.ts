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
import type { LineaNormalizada } from "./tipos";

/** Destino L2 de una línea del proto (cada línea cae en exactamente uno). */
export type DestinoLedger =
  | { tipo: "aplicada"; oracion: string; opd: string; regla?: string; original?: string; hechos: HechoEmitido[] }
  | { tipo: "estructura"; oracion: string; opd: string; refinable: string | null }
  | { tipo: "rechazada"; original: string; categoria: string; diagnostico: string }
  | { tipo: "excluida"; oracion: string; clase: string; razon: string }
  | { tipo: "comentario"; texto: string }
  | { tipo: "estructural-md"; texto: string; clase: LineaEstructural["clase"] }
  | { tipo: "fallo"; oracion: string; razon: string };

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
    procesarOpd(nodo, autor, resolutor, entradas, estadosUnion, estadosDeclarados, enlacesProcedurales);
  }

  const resumen = resumir(entradas, plan.opds.length);
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
): void {
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
  }

  // 2) Emite los hechos del OPD.
  const ctx = { autor, resolutor, opdClave: nodo.clave, opdKey: nodo.clave, estadosUnion, estadosDeclarados, enlacesProcedurales };
  for (const linea of nodo.hechos) {
    emitirLinea(linea, ctx, entradas);
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
  },
  entradas: DestinoLedger[],
): void {
  switch (linea.clase) {
    case "comentario":
      entradas.push({ tipo: "comentario", texto: linea.texto });
      return;
    case "rechazada":
      entradas.push({ tipo: "rechazada", original: linea.original, categoria: linea.categoria, diagnostico: linea.diagnostico });
      return;
    case "estructura":
      // Una oración estructural fuera de cabecera de bloque (no abrió OPD): se
      // registra como estructura sin refinable separado (continuación aditiva).
      entradas.push({ tipo: "estructura", oracion: linea.oracion, opd: ctx.opdClave, refinable: null });
      return;
    case "estricta":
    case "normalizada": {
      const res = emitirOracion(linea.oracion, ctx);
      if (res.estado === "aplicada") {
        entradas.push({
          tipo: "aplicada",
          oracion: linea.oracion,
          opd: ctx.opdClave,
          ...(linea.clase === "normalizada" ? { regla: linea.regla, original: linea.original } : {}),
          hechos: res.hechos,
        });
      } else if (res.estado === "excluida") {
        entradas.push({ tipo: "excluida", oracion: linea.oracion, clase: res.clase, razon: res.razon });
      } else {
        entradas.push({ tipo: "fallo", oracion: linea.oracion, razon: res.razon });
      }
      return;
    }
    case "compuesta": {
      // Familia V: emite cada emisión (oración o directiva) y, si la línea pide
      // agrupar, forma el abanico sobre los enlaces creados. Una sola entrada de
      // ledger `aplicada` con todos los hechos (trazabilidad por `regla`/`original`).
      const res = emitirCompuesta(linea, ctx);
      if (res.estado === "aplicada") {
        entradas.push({
          tipo: "aplicada",
          oracion: linea.original,
          opd: ctx.opdClave,
          regla: linea.regla,
          original: linea.original,
          hechos: res.hechos,
        });
      } else if (res.estado === "excluida") {
        entradas.push({ tipo: "excluida", oracion: linea.original, clase: res.clase, razon: res.razon });
      } else {
        entradas.push({ tipo: "fallo", oracion: linea.original, razon: res.razon });
      }
      return;
    }
  }
}

function resumir(entradas: DestinoLedger[], opds: number): ResumenLedger {
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
  return { aplicadas, hechos, hechosPorPrimitiva, estructura, excluidas, rechazadas, comentarios, fallos, opds };
}
