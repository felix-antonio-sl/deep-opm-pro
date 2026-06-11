// Lector de estructura del proto-modelo (W4.2, etapa 2 del compilador).
//
// Entrada:  el markdown completo de un proto-modelo (prosa + bloques ```opl bajo
//           encabezados markdown).
// Salida:   un PLAN — la lista ordenada de OPDs a crear, cada uno con sus líneas
//           crudas de hecho y, si es un in-zoom, la entidad refinable y el tipo
//           de refinamiento. Más el ledger de líneas markdown (etapa estructural)
//           que NO son hechos: encabezados, prosa interbloque, fences.
//
// CONVENCIÓN v0 (D2 del acta de consenso; gramática-subdialecto-v0):
//
//   1. La estructura del proto es un árbol de OPDs. Los ENCABEZADOS markdown
//      (`#`..`####`) segmentan el documento; los bloques ```opl que aparecen bajo
//      un encabezado aportan los HECHOS de ese segmento. La PROSA interbloque
//      (todo lo que no es fence ni encabezado) es razonamiento del modelador: NO
//      compila — se conserva en el ledger como `prosa`.
//
//   2. El PRIMER bloque ```opl del documento define el OPD RAÍZ (el SD de sistema,
//      p.ej. "SD0"). Sus hechos no abren refinamiento: pueblan el OPD raíz.
//
//   3. Una oración clase `estructura` (`X se descompone en A, B y C [en esa
//      secuencia]` / `X se despliega en …`) dentro de un bloque ABRE un OPD hijo
//      de refinamiento cuyo `refinable` es `X` (un proceso para `se descompone`,
//      un objeto para `se despliega`). El resto de los hechos del MISMO bloque son
//      el contenido de ESE OPD hijo (los subprocesos A, B, C y sus enlaces). Es la
//      convención observada en HODOM: cada bloque de in-zoom abre con la oración
//      `se descompone en` y sigue con el detalle del OPD que esa oración abrió.
//
//   4. Un bloque ```opl que NO contiene ninguna oración `estructura` y NO es el
//      primero se trata como CONTINUACIÓN del último OPD abierto (mismo nivel):
//      sus hechos se anexan al OPD del bloque previo. Esto cubre los sub-bloques
//      de un mismo encabezado (p.ej. la capa de vigilancia, los unfolds sueltos)
//      y la forma gen-spec (un segundo bloque bajo el mismo header que enumera las
//      especializaciones sin reabrir `se descompone en`).
//
// DÓNDE EL MD REAL TENSIONA LA CONVENCIÓN (reportado, no forzado): el sub-OPD
// navegacional de gen-spec de HODOM (SD1.M3-X) vive en un segundo bloque del mismo
// encabezado que el in-zoom de su padre, sin oración `se descompone en` propia —
// por la regla 4 sus especializaciones se anexan al OPD del primer bloque, no a un
// OPD navegacional separado. El compilador lo COMPILA (las generalizaciones son
// hechos válidos) pero las coloca en el OPD del in-zoom, no en un sub-OPD aparte.
// El piloto lo reporta como tensión de la convención v0 (el proto no marca el
// corte de sub-OPD con un encabezado ni con una oración estructural).

import { construirContextoProto, normalizarBloqueOpl } from "./normalizador";
import type { ContextoProto, LineaNormalizada } from "./tipos";

/** Un OPD del plan: o el raíz (sin refinable) o un refinamiento de una entidad. */
export interface NodoOpd {
  /** Clave estable del OPD (derivada del encabezado o de un contador). */
  clave: string;
  /** Nombre legible del OPD (el texto del encabezado markdown que lo introduce). */
  nombre: string;
  /** Clave del OPD padre, o null si es el raíz. */
  padreClave: string | null;
  /** Para un in-zoom/unfold: el nombre (display) de la entidad refinada; null en el raíz. */
  refinableNombre: string | null;
  /** Tipo de refinamiento que abre este OPD. */
  refinamiento: "raiz" | "descomposicion" | "despliegue";
  /** Si la descomposición se declaró `en esa secuencia` (orden temporal). */
  secuencial: boolean;
  /** S1: miembros declarados en la lista de `se descompone en` (display names). Vacío en raíz/despliegue. */
  miembros: string[];
  /** Las líneas de hecho normalizadas que pueblan este OPD (sin la oración estructural que lo abre). */
  hechos: LineaNormalizada[];
  /** Número de línea markdown (1-based) del encabezado o del primer fence, para trazas del ledger. */
  lineaMd: number;
}

/** Destino de cada línea markdown que NO es un hecho compilable. */
export interface LineaEstructural {
  lineaMd: number;
  texto: string;
  clase: "encabezado" | "prosa" | "fence";
}

/** Resultado del lector de estructura. */
export interface PlanEstructura {
  /** OPDs en orden de aparición (el primero es el raíz). */
  opds: NodoOpd[];
  /** Líneas markdown no-hecho (encabezados, prosa, fences) conservadas para el ledger L2. */
  estructurales: LineaEstructural[];
  /** El contexto del proto (estados/tipos por entidad), construido sobre todos los bloques. */
  contexto: ContextoProto;
}

interface BloqueCrudo {
  /** Texto del encabezado markdown más cercano por encima del bloque. */
  encabezado: string;
  /** Clave derivada del encabezado. */
  encabezadoClave: string;
  /** Línea markdown (1-based) del primer renglón del fence (la apertura ```opl). */
  lineaMd: number;
  /** Líneas crudas dentro del fence. */
  lineas: string[];
}

/**
 * Lee el markdown y produce el plan de OPDs + el ledger estructural.
 *
 * Pasada 1: tokeniza el markdown en (encabezados, prosa, bloques ```opl).
 * Pasada 2: construye el ContextoProto sobre TODOS los bloques (estados/tipos).
 * Pasada 3: normaliza cada bloque y lo asigna a un OPD según la convención v0.
 */
export function leerEstructura(markdown: string): PlanEstructura {
  const { bloques, estructurales } = tokenizar(markdown);
  const contexto = construirContextoProto(bloques.map((b) => b.lineas));

  const opds: NodoOpd[] = [];
  let contadorOpd = 0;
  // El "OPD abierto" al que se anexan los bloques de continuación (regla 4).
  let opdActual: NodoOpd | null = null;

  for (const bloque of bloques) {
    const normalizadas = normalizarBloqueOpl(bloque.lineas, contexto);
    // Separa la(s) oración(es) estructural(es) del resto de hechos.
    const estructura = normalizadas.find((l) => l.clase === "estructura");
    const hechos = normalizadas.filter((l) => l.clase !== "estructura");

    if (opds.length === 0) {
      // Regla 2: el primer bloque define el OPD raíz. Si trae una oración
      // estructural (raro en el primer bloque), su refinable se usa como nombre.
      const nodo: NodoOpd = {
        clave: bloque.encabezadoClave || `opd-${++contadorOpd}`,
        nombre: bloque.encabezado || "Raíz",
        padreClave: null,
        refinableNombre: null,
        refinamiento: "raiz",
        secuencial: false,
        miembros: [],
        hechos,
        lineaMd: bloque.lineaMd,
      };
      opds.push(nodo);
      opdActual = nodo;
      // Si el primer bloque trae estructura, no la perdemos: la registramos como
      // descomposición del raíz hacia un OPD que llegará en bloques siguientes.
      if (estructura?.clase === "estructura") {
        opdActual = abrirOpdRefinamiento(estructura, opds, opdActual, ++contadorOpd, bloque);
        opds.push(opdActual);
      }
      continue;
    }

    if (estructura?.clase === "estructura") {
      // Regla 3: abre un OPD hijo de refinamiento de la entidad estructurada.
      const padre = opdActual ?? opds[0]!;
      const nodo = abrirOpdRefinamiento(estructura, opds, padre, ++contadorOpd, bloque);
      nodo.hechos = hechos;
      opds.push(nodo);
      opdActual = nodo;
      continue;
    }

    // Regla 4: bloque sin estructura → continuación del OPD abierto.
    if (opdActual) {
      opdActual.hechos.push(...hechos);
    } else {
      opds[0]!.hechos.push(...hechos);
    }
  }

  return { opds, estructurales, contexto };
}

/** Construye un NodoOpd de refinamiento a partir de una oración `estructura`. */
function abrirOpdRefinamiento(
  estructura: Extract<LineaNormalizada, { clase: "estructura" }>,
  opds: NodoOpd[],
  padre: NodoOpd,
  contador: number,
  bloque: BloqueCrudo,
): NodoOpd {
  const refinable = extraerRefinable(estructura.oracion);
  const esDespliegue = /\bse\s+despliega\s+en\b/iu.test(estructura.oracion);
  return {
    clave: bloque.encabezadoClave || `opd-${contador}`,
    nombre: bloque.encabezado || refinable.nombre || `OPD ${contador}`,
    padreClave: padre.clave,
    refinableNombre: refinable.nombre,
    refinamiento: esDespliegue ? "despliegue" : "descomposicion",
    secuencial: Boolean(estructura.secuencial),
    miembros: esDespliegue ? [] : extraerMiembros(estructura.oracion),
    hechos: [],
    lineaMd: bloque.lineaMd,
  };
}

/**
 * S1 (solicitud upstream skill, 2026-06-11): extrae los miembros de la lista de
 * `X se descompone en A, B y C [en esa secuencia]`. Los miembros nombrados SON
 * el interior del in-zoom: el compilador los registra como internos del OPD
 * hijo (la misma membresía que el DSL declara vía agregaciones contorno→parte).
 * Lista simple por coma/` y ` — la convención del proto estricto; un nombre con
 * ` y ` interno no resolverá y simplemente no se registrará como interno extra.
 */
function extraerMiembros(oracion: string): string[] {
  const m = /\bse\s+descompone(?:\s+tambi[eé]n)?\s+en\s+(.+)$/iu.exec(oracion.trim().replace(/\.\s*$/u, ""));
  if (!m) return [];
  const lista = (m[1] ?? "").replace(/,?\s+en\s+esa\s+secuencia$/iu, "");
  return lista
    .split(/\s*,\s*|\s+y\s+/iu)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Extrae la entidad refinada (sujeto) de una oración estructural. */
function extraerRefinable(oracion: string): { nombre: string } {
  const m = /^(.+?)\s+se\s+(?:descompone|despliega)(?:\s+tambi[eé]n)?\s+en\b/iu.exec(oracion.trim());
  return { nombre: (m?.[1] ?? "").trim() };
}

/**
 * Tokeniza el markdown en bloques ```opl (con su encabezado más cercano) y la
 * lista de líneas estructurales (encabezados + prosa + fences) para el ledger.
 */
function tokenizar(markdown: string): { bloques: BloqueCrudo[]; estructurales: LineaEstructural[] } {
  const lineas = markdown.split(/\r?\n/);
  const bloques: BloqueCrudo[] = [];
  const estructurales: LineaEstructural[] = [];

  let encabezado = "";
  let encabezadoClave = "";
  let dentroDeOpl = false;
  let buffer: string[] = [];
  let lineaFence = 0;

  for (let i = 0; i < lineas.length; i++) {
    const cruda = lineas[i] ?? "";
    const lineaMd = i + 1;
    const fence = /^\s*```\s*(\w+)?\s*$/.exec(cruda);

    if (fence) {
      if (!dentroDeOpl) {
        // Apertura de fence. Solo nos interesan los ```opl.
        if ((fence[1] ?? "").toLowerCase() === "opl") {
          dentroDeOpl = true;
          buffer = [];
          lineaFence = lineaMd;
        }
        estructurales.push({ lineaMd, texto: cruda, clase: "fence" });
      } else {
        // Cierre de fence: vuelca el bloque.
        bloques.push({ encabezado, encabezadoClave, lineaMd: lineaFence, lineas: buffer });
        dentroDeOpl = false;
        estructurales.push({ lineaMd, texto: cruda, clase: "fence" });
      }
      continue;
    }

    if (dentroDeOpl) {
      buffer.push(cruda);
      continue;
    }

    const enc = /^(#{1,6})\s+(.+?)\s*$/.exec(cruda);
    if (enc) {
      encabezado = (enc[2] ?? "").trim();
      encabezadoClave = claveEncabezado(encabezado);
      estructurales.push({ lineaMd, texto: cruda, clase: "encabezado" });
      continue;
    }

    estructurales.push({ lineaMd, texto: cruda, clase: "prosa" });
  }

  // Fence sin cerrar al EOF: vuelca lo acumulado (tolerancia).
  if (dentroDeOpl && buffer.length) {
    bloques.push({ encabezado, encabezadoClave, lineaMd: lineaFence, lineas: buffer });
  }

  return { bloques, estructurales };
}

/** Deriva una clave estable de OPD del texto del encabezado (slug del prefijo de código si lo hay). */
function claveEncabezado(encabezado: string): string {
  // Encabezados HODOM: "SD1.M2.1 — in-zoom de `…`". Toma el prefijo de código.
  const codigo = /^([A-Za-z0-9.\-/]+)\b/u.exec(encabezado.trim());
  const base = (codigo?.[1] ?? encabezado).trim();
  return base
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "") || "opd";
}
