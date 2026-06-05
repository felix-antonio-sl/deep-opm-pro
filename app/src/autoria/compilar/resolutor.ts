// Resolutor incremental por-OPD del compilador (W4.2, etapa 3).
//
// Análogo al mapa `creadas` de `app/src/opl/parser/aplicar.ts:31`, pero net-new
// (el `planificar.ts` del reverse no es reusable: está acoplado al modelo vivo y
// resuelve contra entidades YA existentes). Aquí construimos el modelo DESDE CERO,
// así que el resolutor lleva la cuenta de lo creado y decide, por cada mención de
// un nombre en una oración:
//
//   - ENTIDAD NUEVA: el nombre nunca se vio → se registra y se crea con `entidad()`.
//   - ENTIDAD EXISTENTE EN ESTE OPD: ya tiene aparición en el OPD activo → se reusa.
//   - APARICIÓN EN OTRO OPD: la entidad existe (creada en otro OPD) pero no tiene
//     aparición en el OPD activo → se proyecta con `ver()` (DSL), no se recrea.
//
// La clave de comparación de nombres es la del parser (`claveNombre`), de modo que
// "Equipo HODOM" y "equipo hodom" colisionan, igual que en el reverse.

import { claveNombre } from "../../opl/parser/parsear";
import type { EntKey } from "../tipos";
import type { Afiliacion, Esencia, TipoEntidad } from "../../modelo/tipos";

/** Rasgos esencia/afiliación pre-inferidos para una entidad. */
export interface Rasgos {
  esencia: Esencia;
  afiliacion: Afiliacion;
}

/** Registro de una entidad conocida por el resolutor. */
export interface EntidadConocida {
  /** Clave de dominio para el DSL (`entidad(key, …)`). */
  key: EntKey;
  /** Nombre display exacto del autor (pilar de byte-identidad). */
  nombre: string;
  /** Tipo declarado/inferido. */
  tipo: TipoEntidad;
  /** Claves de OPD donde la entidad ya tiene aparición (`ver()` o creación). */
  opdsConAparicion: Set<string>;
}

/** Decisión del resolutor para una mención. */
export type Resolucion =
  | { accion: "crear"; key: EntKey; tipo: TipoEntidad; rasgos: Rasgos }
  | { accion: "reusar"; key: EntKey; tipo: TipoEntidad }
  | { accion: "proyectar"; key: EntKey; tipo: TipoEntidad };

// ── Guard anti-silencio R9 (adjudicación dov-dori 2026-06-05, hallazgo (c)) ──
//
// Un nombre de cosa con material no nominal residual (paréntesis/corchete
// colgante, o un localizador de cita `art.`/`§`/`N°` suelto) delata casi siempre
// una CITA NORMATIVA NO EXTRAÍDA que el parser absorbió al nombre. Crear esa
// entidad en silencio produce duplicados semánticos (`Permiso de edificación
// (LGUC art. 116)` ≠ `Permiso de edificación`) que violan R-NOM-OBJ-1 y la
// garantía L2/L8 («nada se pierde en silencio»). El guard DETECTA y DIAGNOSTICA;
// NO adivina (no decide que el residuo es norma, no fusiona, no extrae solo).

/** Localizador de cita suelto en el nombre (`art. 118`, `§5.1.6`, `N° 4`). La
 *  palabra léxica `Artículo de aseo` NO dispara (exige número a continuación). */
const RESIDUO_LOCALIZADOR_RE = /(?:\bart[s]?\.|§|\bN°|\bn[uú]m(?:eral)?\.?\s)\s*\d/iu;

/**
 * Devuelve el residuo no nominal hallado en un nombre-a-crear, o null si el
 * nombre es limpio. Puro y exportado (lo usa el test del guard).
 */
export function residuoNoNominal(nombre: string): string | null {
  const paren = /\(([^)]*)\)|\[([^\]]*)\]/u.exec(nombre);
  if (paren) return paren[0] ?? null;
  const loc = RESIDUO_LOCALIZADOR_RE.exec(nombre);
  if (loc) return loc[0] ?? null;
  return null;
}

export class Resolutor {
  /** clave-nombre → entidad conocida. */
  private readonly porClave = new Map<string, EntidadConocida>();
  /** clave-nombre → tipo PRE-INFERIDO por el contexto del proto (autoridad sobre el default). */
  private readonly tipoSemilla = new Map<string, TipoEntidad>();
  /** clave-nombre → rasgos esencia/afiliación declarados en alguna descripción del proto. */
  private readonly rasgosSemilla = new Map<string, Rasgos>();
  /** clave-nombre de entidades con clase OPM declarada EXPLÍCITAMENTE en el proto. */
  private readonly claseExplicita = new Set<string>();
  /** clave-nombre de TODO nombre de entidad declarado en el proto (cualquier OPD,
   *  cualquier orden). Permite el «nombre conocido más largo» de la tensión 3
   *  sin depender del orden de creación (`Resumen clínico en domicilio` se
   *  declara en una lista `consta de` posterior a su primer uso). */
  private readonly nombresConocidos = new Set<string>();
  private contador = 0;

  /**
   * Pre-siembra los tipos inferidos por el ContextoProto (`tipoPorEntidad`). El
   * contexto recorre TODO el proto antes de compilar y sabe, por uso, si una
   * entidad es objeto o proceso (sujeto de verbo procedural, refinable, etc.). Al
   * sembrarlos, la PRIMERA creación de una entidad usa el tipo correcto en lugar
   * del default `objeto` de la primera mención (que falla firmas de enlace cuando
   * un proceso se nombra antes de su descripción). La clave ya viene normalizada.
   */
  sembrarTipos(tipoPorClave: Map<string, "objeto" | "proceso">): void {
    for (const [clave, tipo] of tipoPorClave) this.tipoSemilla.set(clave, tipo);
  }

  /**
   * Pre-siembra los rasgos esencia/afiliación declarados en las descripciones del
   * proto. Igual que los tipos, un agente físico (`Médico … es físico y sistémico`)
   * descrito en un OPD pero usado como agente en otro debe crearse FÍSICO la
   * primera vez (la firma `agente` exige objeto físico). La clave viene normalizada.
   */
  sembrarRasgos(rasgosPorClave: Map<string, Rasgos>): void {
    for (const [clave, rasgos] of rasgosPorClave) this.rasgosSemilla.set(clave, rasgos);
  }

  /** Pre-siembra las claves con clase OPM declarada explícitamente (tensión 4). */
  sembrarClaseExplicita(claves: Set<string>): void {
    for (const clave of claves) this.claseExplicita.add(clave);
  }

  /** Pre-siembra TODO nombre de entidad declarado en el proto (tensión 3). La
   *  clave de entrada es el nombre display; se normaliza con `claveNombre`. */
  sembrarNombresConocidos(nombres: Iterable<string>): void {
    for (const nombre of nombres) this.nombresConocidos.add(claveNombre(nombre));
  }

  /** ¿El nombre corresponde a una entidad declarada en el proto (en cualquier
   *  OPD/orden)? Mira el pre-sembrado del contexto Y lo ya creado. */
  esConocido(nombre: string): boolean {
    const clave = claveNombre(nombre);
    return this.nombresConocidos.has(clave) || this.porClave.has(clave);
  }

  /** ¿La entidad tiene clase OPM declarada explícitamente (vs heredable)? Vale
   *  tanto si ya está creada como si solo está pre-sembrada por el contexto. */
  tieneClaseExplicita(nombre: string): boolean {
    return this.claseExplicita.has(claveNombre(nombre));
  }

  /** Devuelve la entidad conocida por nombre, o undefined. */
  buscar(nombre: string): EntidadConocida | undefined {
    return this.porClave.get(claveNombre(nombre));
  }

  /** ¿La entidad ya está registrada (en cualquier OPD)? */
  existe(nombre: string): boolean {
    return this.porClave.has(claveNombre(nombre));
  }

  /** Tipo PRE-SEMBRADO por el contexto del proto (sin crear la entidad). */
  tipoSemillaDe(nombre: string): TipoEntidad | undefined {
    return this.tipoSemilla.get(claveNombre(nombre));
  }

  /**
   * Resuelve una mención de entidad en el OPD activo. Si no existe, la registra
   * como nueva del tipo indicado (default `objeto`). Si existe pero su tipo aún
   * era ambiguo y ahora se conoce, NO lo cambia (la primera evidencia fija el
   * tipo; igual que el normalizador). Marca la aparición en el OPD activo.
   */
  resolver(nombre: string, opdClave: string, tipoSugerido: TipoEntidad = "objeto", forzarTipo = false): Resolucion {
    const clave = claveNombre(nombre);
    const existente = this.porClave.get(clave);
    if (!existente) {
      // Guard R9 (hallazgo (c)): NO crear en silencio una entidad cuyo nombre
      // arrastra material no nominal — casi siempre una cita no extraída. El
      // throw lo captura el compilador y lo registra como fallo con diagnóstico.
      const residuo = residuoNoNominal(nombre);
      if (residuo) {
        throw new Error(
          `Nombre con material no nominal residual (R9): "${nombre.trim()}" arrastra "${residuo}" — ` +
            `parece una cita normativa no extraída; usa una forma de cita reconocida (Cuerpo art. N / §X) o declárala como ancla.`,
        );
      }
      // La semilla del contexto (uso global) gana al tipo sugerido por la posición
      // sintáctica de esta mención puntual — SALVO `forzarTipo` (tensión 4: una
      // parte de agregación homogénea SIN clase explícita hereda la del todo,
      // aunque un heurístico débil/over-split la haya sembrado al revés).
      const tipo = forzarTipo ? tipoSugerido : (this.tipoSemilla.get(clave) ?? tipoSugerido);
      const rasgos = this.rasgosSemilla.get(clave) ?? { esencia: "informacional", afiliacion: "sistemica" };
      const key = this.nuevaKey(nombre);
      const conocida: EntidadConocida = {
        key,
        nombre: nombre.trim(),
        tipo,
        opdsConAparicion: new Set([opdClave]),
      };
      this.porClave.set(clave, conocida);
      return { accion: "crear", key, tipo, rasgos };
    }
    if (existente.opdsConAparicion.has(opdClave)) {
      return { accion: "reusar", key: existente.key, tipo: existente.tipo };
    }
    existente.opdsConAparicion.add(opdClave);
    return { accion: "proyectar", key: existente.key, tipo: existente.tipo };
  }

  /** Marca que `nombre` ya tiene aparición en `opdClave` (p.ej. el contorno de un in-zoom). */
  marcarAparicion(nombre: string, opdClave: string): void {
    const conocida = this.porClave.get(claveNombre(nombre));
    if (conocida) conocida.opdsConAparicion.add(opdClave);
  }

  /** Promueve el tipo de una entidad conocida a `proceso` (evidencia fuerte: refinable/sujeto procedural). */
  promoverAProceso(nombre: string): void {
    const conocida = this.porClave.get(claveNombre(nombre));
    if (conocida) conocida.tipo = "proceso";
  }

  /** Todas las entidades conocidas (para reportes/ledger). */
  entidades(): EntidadConocida[] {
    return [...this.porClave.values()];
  }

  private nuevaKey(nombre: string): EntKey {
    const slug = nombre
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/gu, "-")
      .replace(/^-|-$/gu, "")
      .slice(0, 48);
    return `${slug || "ent"}-${++this.contador}`;
  }
}
