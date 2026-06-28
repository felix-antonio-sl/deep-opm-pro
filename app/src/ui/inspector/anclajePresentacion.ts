// Centinela de Drift (Fase 3) — lógica PURA de presentación de la sección
// «Anclaje» del Inspector. Copy honesto BIBLIOTECA-nivel (D1): nunca «tu Pieza
// cambió»; siempre «la biblioteca cambió». Vocabulario de carpintero (D5): Pieza
// / Anclaje / Soltar / biblioteca / sincronizado / divergente — cero matemática.
// Separado del componente para poder probarlo sin DOM (patrón anclasPresentacion).
import type { Anclaje, EstadoDrift } from "../../modelo/tipos";

/** Frase de irreversibilidad de Soltar — D4: dicha en el gesto, antes del click. */
const AVISO_SOLTAR = "Soltar la convierte en copia propia y deja de avisarte. Soltar no se deshace.";

export interface CopyAnclaje {
  estado: EstadoDrift;
  /** Encabezado en negrita; solo el aviso de divergencia lo lleva. */
  titulo: string | null;
  /** Línea descriptiva del estado. */
  cuerpo: string;
  /** Re-sincronizar solo tiene sentido si hay hash vivo (divergente). */
  mostrarReSincronizar: boolean;
  /** Soltar siempre disponible (convierte en copia propia). */
  mostrarSoltar: boolean;
  /** Aviso bajo los botones; incluye la irreversibilidad de Soltar (D4). */
  avisoAcciones: string;
}

/** Nombre presentable de la biblioteca: el rótulo si existe, si no el id. */
export function nombreBiblioteca(anclaje: Anclaje): string {
  return anclaje.biblioteca.nombre ?? anclaje.biblioteca.modeloId;
}

/** Nombre presentable de la Pieza anclada: hoy el id del tipo (sin cargar la lib). */
export function nombrePieza(anclaje: Anclaje): string {
  return anclaje.piezaId;
}

/**
 * Copy de la sección según el estado de drift. `null`/ausente ⇒ se trata como
 * `no-resuelto` defensivo (el Inspector solo monta esta sección si hay anclaje;
 * el drift puede no haber resuelto aún). El copy NUNCA culpa a la Pieza (D1).
 */
export function copyAnclaje(
  estado: EstadoDrift | null | undefined,
  anclaje: Anclaje,
): CopyAnclaje {
  const pieza = nombrePieza(anclaje);
  const biblio = nombreBiblioteca(anclaje);
  const efectivo: EstadoDrift = estado ?? "no-resuelto";

  if (efectivo === "sincronizado") {
    return {
      estado: efectivo,
      titulo: null,
      cuerpo: `Anclada a ${pieza} de ${biblio} · al día.`,
      mostrarReSincronizar: false,
      mostrarSoltar: true,
      avisoAcciones: AVISO_SOLTAR,
    };
  }

  if (efectivo === "divergente") {
    return {
      estado: efectivo,
      titulo: "La biblioteca de esta pieza cambió.",
      cuerpo: `La anclaste a «${pieza}» de ${biblio}. Desde entonces, la biblioteca cambió.`,
      mostrarReSincronizar: true,
      mostrarSoltar: true,
      avisoAcciones: `Re-sincronizar adopta la versión nueva. ${AVISO_SOLTAR}`,
    };
  }

  // no-resuelto: honestidad temporal — ni divergencia ni al-día; sin Re-sincronizar.
  return {
    estado: "no-resuelto",
    titulo: null,
    cuerpo: `No se pudo leer la biblioteca «${biblio}» para verificar si cambió.`,
    mostrarReSincronizar: false,
    mostrarSoltar: true,
    avisoAcciones: AVISO_SOLTAR,
  };
}
