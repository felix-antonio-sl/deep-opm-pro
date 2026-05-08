// [JOYAS §1-3] Helper puro: clasifica cada línea editada del OPL libre en
// {aplicable | no-aplicable | ignorada-vacia | sin-cambio}, sumando contadores
// estables para que el editor honesto pueda mostrar 4 grupos visuales antes de
// aplicar al modelo. No muta nada; consume el output existente del planificador
// (`PrevisualizacionOplReverse`) sin reescribir el parser.
//
// Cita SSOT: OPL-ES D1-D8/T1-T3 (sentencias canónicas), Glos 3.55/3.69
// (designación de cosas), V-180+ (enlaces), V-201 (unicidad de nombres).
//
// Mapeo de razones canónicas (cerrado, ver brief L2 ronda 20 §6):
//   forma-no-reconocida      "Forma OPL no reconocida"                       OPL-ES D1-D8, T1-T3
//   entidad-no-existe        "La entidad referida no existe en el modelo"    Glos 3.55, 3.69
//   cambio-ya-presente       "Este cambio ya está aplicado al modelo"        —
//   referencia-ambigua       "Más de una entidad con ese nombre; usa código" V-201 unicidad
//   enlace-invalido-firma    "Firma de enlace inválida para los participantes" V-180+
//   inversa-no-soportada     "Edición inversa no soportada para este tipo"   —
//   conflicto-patches        "Cambios incompatibles sobre el mismo hecho"    —
//   puntuacion-faltante      "La oración OPL-ES debe terminar en punto"      OPL-ES sintaxis

import type { DiagnosticoOpl, PatchOplPropuesto, PrevisualizacionOplReverse } from "./parser";

export type EstadoLineaOpl = "aplicable" | "no-aplicable" | "ignorada-vacia" | "sin-cambio";

export type RazonNoAplicable =
  | "forma-no-reconocida"
  | "entidad-no-existe"
  | "cambio-ya-presente"
  | "referencia-ambigua"
  | "enlace-invalido-firma"
  | "inversa-no-soportada"
  | "conflicto-patches"
  | "puntuacion-faltante";

export interface RazonVisible {
  codigo: RazonNoAplicable;
  texto: string;
  citaSsot: string;
}

export interface LineaClasificada {
  numero: number;
  texto: string;
  estado: EstadoLineaOpl;
  /** Cuando estado = "aplicable": índice 0-based en preview.patches del cambio principal. */
  cambioId?: number;
  /** Cuando estado = "aplicable": descripción legible del cambio. */
  descripcionCambio?: string;
  /** Cuando estado = "no-aplicable": razón canónica. */
  razon?: RazonVisible;
}

export interface ResumenClasificacion {
  total: number;
  aplicables: number;
  noAplicables: number;
  ignoradas: number;
  sinCambio: number;
}

export interface ResultadoClasificacion {
  lineas: LineaClasificada[];
  resumen: ResumenClasificacion;
}

/**
 * Clasifica cada línea del texto del editor libre OPL en uno de 4 estados
 * estables. El criterio canónico es:
 *   1. Línea con sólo whitespace → ignorada-vacia.
 *   2. Línea con al menos un patch propuesto → aplicable (cambioId apunta al
 *      primer patch para esa línea; descripcionCambio resume).
 *   3. Línea sin patches pero con diagnóstico severidad=error → no-aplicable
 *      con razón canónica derivada del código.
 *   4. Línea sin patches ni errores pero con warning/info → sin-cambio (la
 *      oración fue parseada y coincide con el modelo, no muta).
 *   5. Línea sin patches, sin diagnósticos y no-vacía → sin-cambio (parser
 *      la consumió pero no produjo mutación; ej. oración duplicada).
 */
export function clasificarEdicionOpl(
  texto: string,
  preview: PrevisualizacionOplReverse | null,
): ResultadoClasificacion {
  const lineasTexto = texto.split(/\r?\n/);
  const patchesPorLinea = agruparPatchesPorLinea(preview?.patches ?? []);
  const diagnosticosPorLinea = agruparDiagnosticosPorLinea(preview?.diagnosticos ?? []);
  const patchesArr = preview?.patches ?? [];

  const lineas: LineaClasificada[] = lineasTexto.map((textoOriginal, index) => {
    const numero = index + 1;
    const trimmed = textoOriginal.trim();
    if (trimmed.length === 0) {
      return { numero, texto: textoOriginal, estado: "ignorada-vacia" };
    }
    const patchesLinea = patchesPorLinea.get(numero) ?? [];
    if (patchesLinea.length > 0) {
      const primerPatch = patchesLinea[0]!;
      const cambioId = patchesArr.indexOf(primerPatch);
      const base: LineaClasificada = {
        numero,
        texto: textoOriginal,
        estado: "aplicable",
        descripcionCambio: describirPatchesLinea(patchesLinea),
      };
      if (cambioId >= 0) base.cambioId = cambioId;
      return base;
    }
    const diagsLinea = diagnosticosPorLinea.get(numero) ?? [];
    const errorBloqueante = diagsLinea.find((d) => d.severidad === "error");
    if (errorBloqueante) {
      return {
        numero,
        texto: textoOriginal,
        estado: "no-aplicable",
        razon: razonDesdeDiagnostico(errorBloqueante),
      };
    }
    // Sin patches, sin error: el parser entendió la oración pero no muta el
    // modelo (oración consistente con estado actual). Es "sin-cambio".
    return { numero, texto: textoOriginal, estado: "sin-cambio" };
  });

  const resumen: ResumenClasificacion = {
    total: lineas.length,
    aplicables: lineas.filter((l) => l.estado === "aplicable").length,
    noAplicables: lineas.filter((l) => l.estado === "no-aplicable").length,
    ignoradas: lineas.filter((l) => l.estado === "ignorada-vacia").length,
    sinCambio: lineas.filter((l) => l.estado === "sin-cambio").length,
  };
  return { lineas, resumen };
}

/**
 * Texto del botón "Aplicar" honesto: incluye el conteo cuando hay aplicables y
 * cae a un mensaje neutro cuando no los hay. Helper puro para que sea
 * testeable sin DOM.
 */
export function etiquetaBotonAplicar(aplicables: number): string {
  if (aplicables <= 0) return "Sin cambios aplicables";
  return `Aplicar ${aplicables} ${aplicables === 1 ? "cambio" : "cambios"}`;
}

function agruparPatchesPorLinea(patches: PatchOplPropuesto[]): Map<number, PatchOplPropuesto[]> {
  const mapa = new Map<number, PatchOplPropuesto[]>();
  for (const patch of patches) {
    const existing = mapa.get(patch.linea);
    if (existing) existing.push(patch);
    else mapa.set(patch.linea, [patch]);
  }
  return mapa;
}

function agruparDiagnosticosPorLinea(diagnosticos: DiagnosticoOpl[]): Map<number, DiagnosticoOpl[]> {
  const mapa = new Map<number, DiagnosticoOpl[]>();
  for (const diag of diagnosticos) {
    const existing = mapa.get(diag.linea);
    if (existing) existing.push(diag);
    else mapa.set(diag.linea, [diag]);
  }
  return mapa;
}

function razonDesdeDiagnostico(diagnostico: DiagnosticoOpl): RazonVisible {
  switch (diagnostico.codigo) {
    case "unknown-symbol":
      return {
        codigo: "entidad-no-existe",
        texto: "La entidad referida no existe en el modelo",
        citaSsot: "Glos 3.55, 3.69",
      };
    case "ambiguous-symbol":
      return {
        codigo: "referencia-ambigua",
        texto: "Más de una entidad con ese nombre",
        citaSsot: "V-201 unicidad",
      };
    case "type-mismatch":
      return {
        codigo: "enlace-invalido-firma",
        texto: "Firma de enlace inválida",
        citaSsot: "V-180+",
      };
    case "patch-conflict":
      return {
        codigo: "conflicto-patches",
        texto: "Cambios incompatibles sobre el mismo hecho",
        citaSsot: "—",
      };
    case "unsupported-kernel":
      return {
        codigo: "inversa-no-soportada",
        texto: "Edición inversa no soportada",
        citaSsot: "—",
      };
    case "no-delete-by-absence":
      // Este código aparece como info y no debería bloquear; si llega como
      // error tratamos como inversa-no-soportada para honestidad del editor.
      return {
        codigo: "inversa-no-soportada",
        texto: "Las líneas ausentes no borran hechos",
        citaSsot: "—",
      };
    case "syntax-error":
      if (/punto/i.test(diagnostico.mensaje)) {
        return {
          codigo: "puntuacion-faltante",
          texto: "La oración OPL-ES debe terminar en punto",
          citaSsot: "OPL-ES sintaxis",
        };
      }
      return {
        codigo: "forma-no-reconocida",
        texto: "Forma OPL no reconocida",
        citaSsot: "OPL-ES D1-D8, T1-T3",
      };
    default:
      return {
        codigo: "forma-no-reconocida",
        texto: "Forma OPL no reconocida",
        citaSsot: "OPL-ES D1-D8, T1-T3",
      };
  }
}

function describirPatchesLinea(patches: PatchOplPropuesto[]): string {
  return patches.map(describirPatch).join(" · ");
}

function describirPatch(patch: PatchOplPropuesto): string {
  switch (patch.tipo) {
    case "renombrar-entidad":
      return `renombrar ${patch.anterior} -> ${patch.siguiente}`;
    case "cambiar-esencia":
      return `esencia ${patch.anterior} -> ${patch.siguiente}`;
    case "cambiar-afiliacion":
      return `afiliacion ${patch.anterior} -> ${patch.siguiente}`;
    case "crear-entidad":
      return `crear ${patch.entidadTipo} ${patch.nombre}`;
    case "sincronizar-estados":
      return `sincronizar estados (${patch.nombres.join(", ")})`;
    case "renombrar-estado":
      return `estado ${patch.anterior} -> ${patch.siguiente}`;
    case "crear-enlace":
      return `crear enlace ${patch.tipoEnlace}`;
    case "fijar-etiqueta-enlace":
      return `etiqueta enlace -> ${patch.siguiente || "(vacía)"}`;
  }
}
